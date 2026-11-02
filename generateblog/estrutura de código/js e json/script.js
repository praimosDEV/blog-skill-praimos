// Blog posts data - now empty, will be populated from posts.json
let blogPosts = [];

// Site language (pt/en/es). Shared with the individual blog post pages via
// the same localStorage key, so a language choice made on the homepage
// carries over when the reader opens a post, and vice-versa.
let currentLang = 'pt';

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const blogGrid = document.getElementById('blog-grid');
const loadMoreBtn = document.getElementById('load-more');
const filterBtns = document.querySelectorAll('.filter-btn');
const particles = document.getElementById('particles');

// State
let currentFilter = 'all';
let postsLoaded = 3;
let isLoading = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    initLanguage();

    // Initialize components
    initParticles();
    initScrollAnimations();
    // A função loadBlogPosts abaixo é responsável por 'acessar a API' (o arquivo posts.json)
    // conforme documentado em 'API.json'. Note que isso é feito com JavaScript no navegador.
    loadBlogPosts(); 
    initEventListeners();
    updateActiveNavLink();
});

// ---------- Language switching ----------
function initLanguage() {
    let saved = null;
    try { saved = localStorage.getItem('praimos-blog-lang'); } catch (e) { /* ignore */ }
    const browserLang = (navigator.language || 'pt').slice(0, 2);
    const initial = saved || (['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'pt');

    document.querySelectorAll('.site-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setSiteLang(btn.dataset.setlang));
    });

    setSiteLang(initial);
}

function setSiteLang(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang);

    document.querySelectorAll('[data-lang]').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.site-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.setlang === lang);
    });

    try { localStorage.setItem('praimos-blog-lang', lang); } catch (e) { /* ignore */ }

    if (typeof window.refreshNotifyToggleLabel === 'function') {
        window.refreshNotifyToggleLabel();
    }

    // Re-render blog cards in the new language (title/excerpt/tags/category name)
    if (blogPosts.length) {
        renderBlogPosts();
    }
}

// Load blog posts from JSON file (acting as our API endpoint)
async function loadBlogPosts() {
    try {
        // CORRECTION: Alterado para carregar os posts do arquivo local './posts.json'.
        // Isso garante que os blogs sejam exibidos, pois o acesso a uma URL externa
        // (https://praimos.com.br/blog/posts.json) pode estar inacessível ou causar problemas de CORS
        // no ambiente atual, resultando na não exibição dos posts.
        const response = await fetch('./posts.json');
        if (!response.ok) throw new Error('posts.json respondeu com erro HTTP ' + response.status);
        const posts = await response.json();
        blogPosts = posts;
    } catch (error) {
        // IMPORTANT: fetch() of a local posts.json fails under the file:// protocol
        // (blocked by the browser's CORS policy) and can also fail if posts.json
        // is missing/renamed on the server. Rather than showing an empty blog
        // section in either case, fall back to the same data embedded directly
        // in posts-data.js (loaded via <script> before this file), so the posts
        // always render regardless of how the page is opened.
        console.warn('Não foi possível buscar posts.json via fetch (comum ao abrir o arquivo direto no navegador). Usando dados embutidos em posts-data.js.', error);
        blogPosts = window.POSTS_DATA || [];
    }
    renderBlogPosts();
}

// Particles Animation
function initParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
    }
}

// Navigation
function initEventListeners() {
    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            scrollToSection(targetId);
            
            // Close mobile menu
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });

    // Blog filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter posts
            currentFilter = btn.getAttribute('data-filter');
            postsLoaded = 3;
            renderBlogPosts();
        });
    });

    // Load more posts
    loadMoreBtn.addEventListener('click', loadMorePosts);

    // Scroll event for navbar
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        handleNavbarScroll();
    });
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 35, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'rgba(15, 15, 35, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
}

// Blog functionality

// Combines a post's "date" (YYYY/MM/DD) with its optional "publishTime"
// (HH:MM, 24h) into a real Date/time. If publishTime is omitted, defaults
// to 00:00 — same behavior as before this feature existed, so old posts
// keep working unchanged.
function getPublishDateTime(post) {
    const timePart = post.publishTime || '00:00';
    const datePart = (post.date || '').replace(/\//g, '-');
    return new Date(`${datePart}T${timePart}:00`);
}

function isPostPublished(post, now) {
    return getPublishDateTime(post) <= (now || new Date());
}

function renderBlogPosts() {
    blogGrid.innerHTML = '';
    
    const now = new Date();
    // Date-only version (midnight), still used below for the "featured
    // until" comparison, which only ever needs day-level granularity.
    const todayInClientTimeZone = new Date();
    todayInClientTimeZone.setHours(0, 0, 0, 0); 
    
    // 1. Filter posts based on publication date+time (only show posts whose
    // scheduled publish moment has already passed)
    const publishedPosts = blogPosts.filter(post => isPostPublished(post, now));
    
    // Update blog count in stats with *published* posts
    const blogCountElement = document.getElementById('blog-count');
    if (blogCountElement) {
        blogCountElement.textContent = publishedPosts.length;
    }
    
    // 2. Sort published posts by date (most recent first)
    const sortedPosts = [...publishedPosts].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });
    
    // 3. Filter posts based on current category filter
    let filteredByCategory = sortedPosts;
    if (currentFilter !== 'all') {
        filteredByCategory = sortedPosts.filter(post => post.category === currentFilter);
    }
    
    // 4. Separate featured post if it exists and is currently active
    let featuredPost = null;

    const featuredIndex = filteredByCategory.findIndex(post => {
        if (!post.isFeatured || !post.featuredUntil) return false;

        const featuredUntilDate = new Date(post.featuredUntil);
        featuredUntilDate.setHours(0, 0, 0, 0); // Midnight of the featuredUntil day

        return todayInClientTimeZone <= featuredUntilDate;
    });

    let otherPosts = [];
    if (featuredIndex !== -1) {
        featuredPost = filteredByCategory[featuredIndex];
        otherPosts = filteredByCategory.filter((_, index) => index !== featuredIndex);
    } else {
        otherPosts = filteredByCategory;
    }

    // Combine posts for rendering: featured post first, then others
    let postsToRender = [];
    if (featuredPost) {
        postsToRender.push(featuredPost);
    }
    postsToRender = postsToRender.concat(otherPosts);

    // Show filtered posts up to postsLoaded limit
    const finalPostsToShow = postsToRender.slice(0, postsLoaded);
    
    if (finalPostsToShow.length === 0) {
        // Show "coming soon" message if no posts match filter
        const comingSoonMessages = {
            pt: { title: 'Em Breve', text: 'Novos posts do blog serão adicionados em breve. Fique atento para atualizações sobre desenvolvimento de jogos, tutoriais e bastidores do estúdio.' },
            en: { title: 'Coming Soon', text: 'New blog posts will be added soon. Stay tuned for updates on game development, tutorials, and behind-the-scenes content from the studio.' },
            es: { title: 'Próximamente', text: 'Pronto se añadirán nuevas entradas al blog. Mantente atento a las novedades sobre desarrollo de videojuegos, tutoriales y detrás de escena del estudio.' }
        };
        const comingSoon = comingSoonMessages[currentLang] || comingSoonMessages.pt;
        const comingSoonElement = document.createElement('div');
        comingSoonElement.className = 'coming-soon-message';
        comingSoonElement.innerHTML = `
            <div class="coming-soon-content">
                <i class="fas fa-clock"></i>
                <h3>${comingSoon.title}</h3>
                <p>${comingSoon.text}</p>
            </div>
        `;
        blogGrid.appendChild(comingSoonElement);
        loadMoreBtn.style.display = 'none';
    } else {
        // Render blog posts
        finalPostsToShow.forEach((post, index) => {
            const postElement = createBlogPostElement(post, index);
            blogGrid.appendChild(postElement);
        });

        // Now that the cards actually exist in the DOM, attach the
        // scroll-fade observer to them (this must happen AFTER insertion —
        // observing before the cards exist was the bug that made posts
        // render with opacity:0 and never become visible).
        observeFadeIns('.blog-card');
        
        // Show/hide load more button
        if (finalPostsToShow.length < postsToRender.length) {
            loadMoreBtn.style.display = 'inline-flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

function createBlogPostElement(post, index) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.style.animationDelay = `${index * 0.1}s`;
    
    const categoryColors = {
        devlog: '#6366f1',
        news: '#10b981',
        tutorial: '#f59e0b',
        'behind-scenes': '#8b5cf6',
        'dev-analysis': '#ef4444' // New color for DEV análise
    };
    
    const categoryNames = {
        pt: { devlog: 'Dev Log', news: 'Notícias', tutorial: 'Tutorial', 'behind-scenes': 'Bastidores', 'dev-analysis': 'DEV Análise' },
        en: { devlog: 'Dev Log', news: 'News', tutorial: 'Tutorial', 'behind-scenes': 'Behind the Scenes', 'dev-analysis': 'Dev Analysis' },
        es: { devlog: 'Dev Log', news: 'Noticias', tutorial: 'Tutorial', 'behind-scenes': 'Detrás de Escena', 'dev-analysis': 'Análisis Dev' }
    };
    const categoryNamesForLang = categoryNames[currentLang] || categoryNames.pt;

    // Localized text: posts store title/excerpt/tags as {pt, en, es} maps.
    // Older post objects with plain strings/arrays still work via the fallback.
    const title = (post.title && typeof post.title === 'object') ? (post.title[currentLang] || post.title.pt) : post.title;
    const excerpt = (post.excerpt && typeof post.excerpt === 'object') ? (post.excerpt[currentLang] || post.excerpt.pt) : post.excerpt;

    // Recalculate if post is featured based on current date (client's local date)
    const todayDateOnly = new Date();
    todayDateOnly.setHours(0,0,0,0);
    const isCurrentlyFeatured = post.isFeatured && post.featuredUntil && new Date(post.featuredUntil).setHours(0,0,0,0) >= todayDateOnly;

    if (isCurrentlyFeatured) {
        article.classList.add('blog-card--featured');
    }

    // Tags: post.tags can be a language map ({pt, en, es}) or a flat array.
    const tagList = post.tags ? (post.tags[currentLang] || post.tags.pt || post.tags) : [];
    const tagsHtml = tagList.length
        ? `<div class="blog-tags">${tagList.slice(0, 4).map(t => `<span class="blog-tag">#${t}</span>`).join('')}</div>`
        : '';

    // Cover image: use post.image when provided (local SVG/photo), otherwise
    // fall back to the original category icon so older posts keep working.
    const imageHtml = post.image
        ? `<img src="${post.image}" alt="${title}" loading="lazy" class="blog-cover-img">`
        : `<i class="fas fa-${getBlogIcon(post.category)}"></i>`;

    const featuredLabel = { pt: 'Destaque da Semana', en: 'Featured This Week', es: 'Destacado de la Semana' }[currentLang] || 'Destaque da Semana';
    const readMoreLabel = { pt: 'Ler mais', en: 'Read more', es: 'Leer más' }[currentLang] || 'Ler mais';

    article.innerHTML = `
        <a href="${post.url}" class="blog-image" aria-label="${title}">
            ${isCurrentlyFeatured ? `<span class="featured-badge"><i class="fas fa-star"></i> ${featuredLabel}</span>` : ''}
            ${imageHtml}
        </a>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-category" style="background-color: ${categoryColors[post.category]}">
                    ${categoryNamesForLang[post.category]}
                </span>
                <span class="blog-date">${formatDate(post.date)}</span>
            </div>
            <h3 class="blog-title"><a href="${post.url}" class="blog-title-link">${title}</a></h3>
            <p class="blog-excerpt">${excerpt}</p>
            ${tagsHtml}
            <div class="blog-footer">
                <a href="${post.url}" class="read-more">
                    ${readMoreLabel} <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
    
    return article;
}

function getBlogIcon(category) {
    const icons = {
        devlog: 'code',
        news: 'newspaper',
        tutorial: 'graduation-cap',
        'behind-scenes': 'camera',
        'dev-analysis': 'lightbulb' // New icon for DEV análise
    };
    return icons[category] || 'file-alt';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const locales = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
    return date.toLocaleDateString(locales[currentLang] || 'pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// NOTE: publish-status checking now lives in isPostPublished()/getPublishDateTime()
// near renderBlogPosts(), which understand the optional publishTime (HH:MM)
// field. This older date-only helper was superseded and removed to avoid
// having two slightly different definitions of "published" in the file.

// Get published content count with improved date checking
function getPublishedContentCount() {
    // Now just returns total posts, as the 'publishDate <= currentDate' filter was removed
    // to allow all posts in posts.json to be visible per user request.
    return blogPosts.length;
}

function loadMorePosts() {
    if (isLoading) return;

    const labels = {
        pt: { loading: 'Carregando...', idle: 'Carregar Mais Posts' },
        en: { loading: 'Loading...', idle: 'Load More Posts' },
        es: { loading: 'Cargando...', idle: 'Cargar Más Publicaciones' }
    };
    const label = labels[currentLang] || labels.pt;

    isLoading = true;
    loadMoreBtn.innerHTML = `<span>${label.loading}</span> <i class="fas fa-spinner fa-spin"></i>`;
    
    setTimeout(() => {
        postsLoaded += 3;
        renderBlogPosts();
        isLoading = false;
        loadMoreBtn.innerHTML = `<span>${label.idle}</span> <i class="fas fa-plus"></i>`;
    }, 1000);
}

// Scroll animations
let scrollObserver = null;

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements that already exist in the DOM at load time
    // (blog cards are handled separately by observeFadeIns() every time
    // renderBlogPosts() runs, since they're created asynchronously).
    observeFadeIns('.game-card, .contact-item, .stat');
}

// Attaches the fade-in/observer treatment to elements matching `selector`.
// Safe to call repeatedly (e.g. every renderBlogPosts()) — already-observed
// elements are skipped via the data-observed marker.
function observeFadeIns(selector) {
    document.querySelectorAll(selector).forEach(el => {
        if (el.dataset.observed) return;
        el.dataset.observed = '1';
        el.classList.add('fade-in');
        if (scrollObserver) {
            scrollObserver.observe(el);
        } else {
            // No observer available for some reason — don't leave the
            // element permanently hidden, just show it.
            el.classList.add('visible');
        }
    });
}

// Utility functions
window.scrollToSection = scrollToSection;

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Parallax effect for hero particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const x = mouseX * speed;
        const y = mouseY * speed;
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    updateActiveNavLink();
    handleNavbarScroll();
}, 16);

window.removeEventListener('scroll', () => {
    updateActiveNavLink();
    handleNavbarScroll();
});

window.addEventListener('scroll', throttledScrollHandler);
