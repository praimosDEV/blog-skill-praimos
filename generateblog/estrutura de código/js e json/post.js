(function () {
    function applyLang(lang) {
        document.querySelectorAll('[data-lang]').forEach(function (el) {
            el.classList.toggle('active', el.getAttribute('data-lang') === lang);
        });
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.setlang === lang);
        });
        document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en' : 'es');

        if (window.PAGE_META && window.PAGE_META[lang]) {
            document.title = window.PAGE_META[lang].title;
            var descTag = document.querySelector('meta[name="description"]');
            if (descTag) descTag.setAttribute('content', window.PAGE_META[lang].description);
        }

        try { localStorage.setItem('praimos-blog-lang', lang); } catch (e) { /* ignore */ }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyLang(btn.dataset.setlang);
            });
        });

        var saved = null;
        try { saved = localStorage.getItem('praimos-blog-lang'); } catch (e) { /* ignore */ }

        var browserLang = (navigator.language || 'pt').slice(0, 2);
        var initial = saved || (['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'pt');
        applyLang(initial);
    });
})();
