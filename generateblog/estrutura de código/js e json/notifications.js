// ============================================================================
// Praimos Studio — Blog publish notifications
//
// Builds on the existing auto-publish system (posts already in posts.json /
// posts-data.js, filtered by getPublishDateTime()/isPostPublished() in
// script.js). This file adds two things on top of that:
//
//   1. If someone has the site open in a tab at the exact moment a
//      scheduled post's publishTime arrives, they get a browser
//      Notification + an in-page toast, and the blog grid updates live.
//   2. If someone opens a new tab on/after the day a post was published
//      (i.e. their first visit after publication), they get a "new post"
//      notification/toast on load.
//
// IMPORTANT LIMITATION (see chat for full explanation): this only works
// while a tab is open. It cannot notify someone whose browser is fully
// closed — that would require a backend push server + Service Worker
// (Push API), which is a separate, much bigger feature.
// ============================================================================
(function () {
    const LAST_VISIT_KEY = 'praimos-last-visit';
    const NOTIFIED_KEY = 'praimos-notified-posts';
    let scheduledTimeout = null;

    function getNotifiedIds() {
        try { return JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]'); } catch (e) { return []; }
    }
    function markNotified(id) {
        const ids = getNotifiedIds();
        if (!ids.includes(id)) {
            ids.push(id);
            try { localStorage.setItem(NOTIFIED_KEY, JSON.stringify(ids)); } catch (e) { /* ignore */ }
        }
    }

    function localizedTitle(post) {
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'pt';
        return (post.title && typeof post.title === 'object') ? (post.title[lang] || post.title.pt) : post.title;
    }

    function labelsFor(lang) {
        const table = {
            pt: { newPost: 'Novo post no blog!', newPosts: (n) => `${n} novos posts desde sua última visita!`, cta: 'Confira agora', blocked: 'Notificações bloqueadas', blockedBody: 'Você bloqueou as notificações deste site nas configurações do navegador.' },
            en: { newPost: 'New blog post!', newPosts: (n) => `${n} new posts since your last visit!`, cta: 'Check it out', blocked: 'Notifications blocked', blockedBody: "You've blocked notifications for this site in your browser settings." },
            es: { newPost: '¡Nueva entrada en el blog!', newPosts: (n) => `¡${n} nuevas entradas desde tu última visita!`, cta: 'Míralo ahora', blocked: 'Notificaciones bloqueadas', blockedBody: 'Has bloqueado las notificaciones de este sitio en la configuración del navegador.' }
        };
        return table[lang] || table.pt;
    }

    // ---------- In-page toast (always shown, works with zero permissions) ----------
    function showToast(title, bodyText, url) {
        const toast = document.createElement('div');
        toast.className = 'blog-toast';
        toast.innerHTML = `
            <div class="blog-toast-icon"><i class="fas fa-bell"></i></div>
            <div class="blog-toast-body">
                <strong>${title}</strong>
                <p>${bodyText}</p>
            </div>
            <button class="blog-toast-close" aria-label="Fechar" type="button">&times;</button>
        `;
        toast.addEventListener('click', (e) => {
            if (e.target.closest('.blog-toast-close')) {
                dismiss();
                return;
            }
            if (url) scrollToSectionOrNavigate(url);
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));

        let dismissed = false;
        function dismiss() {
            if (dismissed) return;
            dismissed = true;
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }
        setTimeout(dismiss, 9000);
    }

    function scrollToSectionOrNavigate(url) {
        // url can be "#blog" (scroll on this page) or a post's own folder URL
        if (url.startsWith('#') && typeof scrollToSection === 'function') {
            scrollToSection(url.slice(1));
        } else {
            window.location.href = url;
        }
    }

    // ---------- Native browser Notification (requires prior permission) ----------
    function fireBrowserNotification(title, body, url) {
        if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
        try {
            const n = new Notification(title, { body: body, icon: 'imag/blog.png', tag: 'praimos-blog-' + url });
            n.onclick = () => {
                window.focus();
                scrollToSectionOrNavigate(url);
                n.close();
            };
        } catch (e) { /* some browsers throw on unsupported combos — fail silently, toast already shown */ }
    }

    function notifyNewPost(post) {
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'pt';
        const L = labelsFor(lang);
        const title = localizedTitle(post);
        showToast(L.newPost, title, post.url);
        fireBrowserNotification(L.newPost, title, post.url);
        markNotified(post.id);
    }

    function notifyMultipleNewPosts(posts) {
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'pt';
        const L = labelsFor(lang);
        const heading = L.newPosts(posts.length);
        showToast('📰', heading, '#blog');
        fireBrowserNotification(heading, '', '#blog');
        posts.forEach(p => markNotified(p.id));
    }

    // ---------- Live check: has a scheduled post just crossed into "published"? ----------
    function checkForNewlyPublished() {
        if (typeof blogPosts === 'undefined' || !blogPosts.length) return;
        if (typeof getPublishDateTime !== 'function') return; // script.js not loaded yet

        const now = new Date();
        const notified = getNotifiedIds();
        let foundNew = false;

        blogPosts.forEach(post => {
            const publishAt = getPublishDateTime(post);
            if (publishAt <= now && !notified.includes(post.id)) {
                notifyNewPost(post);
                foundNew = true;
            }
        });

        if (foundNew && typeof renderBlogPosts === 'function') {
            renderBlogPosts();
        }
        scheduleNextCheck();
    }

    // Schedules a precise setTimeout for the next post's exact publish
    // moment, instead of polling constantly. A low-frequency safety poll
    // (see bottom of file) covers cases where the timer drifts (tab
    // throttled in background, laptop slept, etc.).
    function scheduleNextCheck() {
        if (scheduledTimeout) {
            clearTimeout(scheduledTimeout);
            scheduledTimeout = null;
        }
        if (typeof blogPosts === 'undefined' || typeof getPublishDateTime !== 'function') return;

        const now = new Date();
        const notified = getNotifiedIds();
        const upcomingTimes = blogPosts
            .filter(post => !notified.includes(post.id))
            .map(post => getPublishDateTime(post).getTime())
            .filter(t => t > now.getTime());

        if (!upcomingTimes.length) return;

        const nextTime = Math.min(...upcomingTimes);
        const delay = nextTime - now.getTime() + 500; // small buffer past the exact moment

        // Avoid scheduling absurdly long timeouts (unreliable in some
        // browsers) — anything beyond ~24h just gets picked up by the
        // 60s safety poll once it gets closer.
        if (delay < 24 * 60 * 60 * 1000) {
            scheduledTimeout = setTimeout(checkForNewlyPublished, delay);
        }
    }

    // On a visitor's very first-ever load, mark everything already published
    // as "seen" WITHOUT notifying — otherwise every existing post would
    // trigger a notification the first time anyone visits the site.
    function primeNotifiedOnFirstVisit() {
        let lastVisit = null;
        try { lastVisit = localStorage.getItem(LAST_VISIT_KEY); } catch (e) { /* ignore */ }
        if (lastVisit) return; // not the first visit
        const now = new Date();
        blogPosts.forEach(post => {
            if (getPublishDateTime(post) <= now) markNotified(post.id);
        });
    }

    // Runs once per page load: compares "now" against the last time this
    // visitor was on the site, and notifies about anything published
    // in between (covers "opened a new tab after the post already went live").
    function checkNewSinceLastVisit() {
        let lastVisit = null;
        try { lastVisit = localStorage.getItem(LAST_VISIT_KEY); } catch (e) { /* ignore */ }
        const now = new Date();

        if (lastVisit) {
            const lastVisitDate = new Date(lastVisit);
            const notified = getNotifiedIds();
            const newSinceVisit = blogPosts.filter(post => {
                const publishAt = getPublishDateTime(post);
                return publishAt <= now && publishAt > lastVisitDate && !notified.includes(post.id);
            });
            if (newSinceVisit.length === 1) {
                notifyNewPost(newSinceVisit[0]);
            } else if (newSinceVisit.length > 1) {
                notifyMultipleNewPosts(newSinceVisit);
            }
        }

        try { localStorage.setItem(LAST_VISIT_KEY, now.toISOString()); } catch (e) { /* ignore */ }
    }

    // ---------- Opt-in bell button (native Notification permission) ----------
    function initNotifyToggle() {
        const btn = document.getElementById('notify-toggle');
        if (!btn) return;

        if (typeof Notification === 'undefined') {
            btn.style.display = 'none';
            return;
        }

        function refresh() {
            btn.classList.toggle('active', Notification.permission === 'granted');
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'pt';
            const titles = {
                pt: Notification.permission === 'granted' ? 'Notificações ativadas' : 'Ativar notificações de novos posts',
                en: Notification.permission === 'granted' ? 'Notifications enabled' : 'Enable new post notifications',
                es: Notification.permission === 'granted' ? 'Notificaciones activadas' : 'Activar notificaciones de nuevas publicaciones'
            };
            btn.title = titles[lang] || titles.pt;
        }

        btn.addEventListener('click', () => {
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'pt';
            const L = labelsFor(lang);
            if (Notification.permission === 'default') {
                // Requesting permission from a real click keeps this compliant
                // with browser policies (most browsers ignore/ block requests
                // not tied to a user gesture) and is less spammy than asking
                // automatically on page load.
                Notification.requestPermission().then(refresh);
            } else if (Notification.permission === 'denied') {
                showToast(L.blocked, L.blockedBody, null);
            }
            refresh();
        });

        refresh();
        // Exposed so script.js's setSiteLang() can refresh the tooltip text
        // when the visitor switches language.
        window.refreshNotifyToggleLabel = refresh;
    }

    document.addEventListener('DOMContentLoaded', () => {
        initNotifyToggle();

        // Wait until script.js has actually populated blogPosts (it loads
        // asynchronously via fetch/fallback) before running any checks.
        const waitForPosts = setInterval(() => {
            if (typeof blogPosts !== 'undefined' && blogPosts.length && typeof getPublishDateTime === 'function') {
                clearInterval(waitForPosts);
                primeNotifiedOnFirstVisit();
                checkNewSinceLastVisit();
                scheduleNextCheck();
            }
        }, 200);

        // Safety net: re-check every 60s regardless of the precise
        // setTimeout above, in case it drifted (background tab throttling,
        // system sleep, etc.). checkForNewlyPublished() is a no-op if
        // nothing has actually changed.
        setInterval(checkForNewlyPublished, 60000);
    });
})();
