(() => {
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => p.querySelectorAll(s);

    // Navbar scroll & active section tracking
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');
    const sections = $$('section[id]');
    let ticking = false;

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Navbar style
            navbar.classList.toggle('scrolled', scrollY > 50);

            // Back to top visibility
            $('#backToTop').classList.toggle('visible', scrollY > 500);

            // Active nav link
            let current = '';
            sections.forEach(sec => {
                if (scrollY >= sec.offsetTop - 200) current = sec.id;
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });

            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    const hamburger = $('#hamburger');
    const navMenu = $('#navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = $(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Back to top
    $('#backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Counter animation (runs once when visible)
    const statsEl = $('.hero-stats');
    if (statsEl) {
        const counters = $$('.stat-number');
        let animated = false;

        const animate = () => {
            if (animated) return;
            animated = true;
            counters.forEach(el => {
                const target = +el.dataset.target;
                const duration = 1500;
                const start = performance.now();

                const step = now => {
                    const progress = Math.min((now - start) / duration, 1);
                    el.textContent = Math.ceil(progress * target);
                    if (progress < 1) requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            });
        };

        new IntersectionObserver(([entry], obs) => {
            if (entry.isIntersecting) { animate(); obs.disconnect(); }
        }, { threshold: 0.15 }).observe(statsEl);
    }

    // Reveal work cards on scroll for mobile devices
    const workCards = $$('.work-card');
    if (workCards.length > 0) {
        const revealCard = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        };

        const cardObserver = new IntersectionObserver(revealCard, {
            rootMargin: '-30% 0px -30% 0px', // Activo solo cuando la tarjeta está en el centro de la pantalla
            threshold: 0
        });

        workCards.forEach(card => cardObserver.observe(card));
    }
})();
