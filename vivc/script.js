/* ============================================================
   VIVEC – Vocational Training Institute
   script.js – All interactive behaviors
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================== STICKY HEADER ==================== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 60);
    });

    /* ==================== MOBILE NAV / HAMBURGER ==================== */
    const hamburger = document.getElementById('hamburger');
    const nav       = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
        hamburger.classList.toggle('hamburger--open');
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('hamburger--open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => (s.style.transform = s.style.opacity = ''));
        }
    });

    // Mobile: toggle dropdown on tap
    document.querySelectorAll('.nav__item--dropdown').forEach(item => {
        item.querySelector('a').addEventListener('click', e => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('open');
            }
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', e => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('nav--open');
            hamburger.classList.remove('hamburger--open');
            hamburger.querySelectorAll('span').forEach(s => (s.style.transform = s.style.opacity = ''));
        }
    });

    /* ==================== HERO SLIDER ==================== */
    /*
      Supports any number of .hero__slide elements.
      Slides auto-advance every 5 s.
      Prev/Next arrow buttons and dot buttons also control the slider.
      Touch/swipe supported on mobile.
      Each slide uses background-image set via inline style in HTML.
    */
    const slides      = document.querySelectorAll('.hero__slide');
    const dots        = document.querySelectorAll('.hero__dot');
    const heroPrev    = document.getElementById('heroPrev');
    const heroNext    = document.getElementById('heroNext');
    let   currentSlide = 0;
    let   heroTimer;

    function goToSlide(index) {
        // Remove active from current
        slides[currentSlide].classList.remove('hero__slide--active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('hero__dot--active');

        // Calculate next (wraps around)
        currentSlide = ((index % slides.length) + slides.length) % slides.length;

        // Activate next
        slides[currentSlide].classList.add('hero__slide--active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('hero__dot--active');
    }

    function startAuto() {
        heroTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
    function resetAuto() {
        clearInterval(heroTimer);
        startAuto();
    }

    // Dot clicks
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); resetAuto(); });
    });

    // Arrow clicks
    if (heroPrev) heroPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAuto(); });
    if (heroNext) heroNext.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAuto(); });

    // Start auto-play
    if (slides.length > 1) startAuto();

    // Touch / swipe
    let touchStartX = 0;
    const heroEl = document.getElementById('hero');
    if (heroEl) {
        heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        heroEl.addEventListener('touchend',   e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { goToSlide(currentSlide + (diff > 0 ? 1 : -1)); resetAuto(); }
        });
    }

    /* ==================== TESTIMONIALS SLIDER ==================== */
    const testiCards = document.querySelectorAll('.testi-card');
    let currentTesti = 0;

    function showTesti(index) {
        testiCards[currentTesti].classList.remove('testi-card--active');
        currentTesti = ((index % testiCards.length) + testiCards.length) % testiCards.length;
        testiCards[currentTesti].classList.add('testi-card--active');
    }

    const testiPrev = document.getElementById('testiPrev');
    const testiNext = document.getElementById('testiNext');
    if (testiPrev) testiPrev.addEventListener('click', () => showTesti(currentTesti - 1));
    if (testiNext) testiNext.addEventListener('click', () => showTesti(currentTesti + 1));
    if (testiCards.length > 1) setInterval(() => showTesti(currentTesti + 1), 6000);

    /* ==================== PARTNERS CAROUSEL ==================== */
    const partnersTrack = document.querySelector('.partners__track');
    let partnerOffset   = 0;
    const partnerStep   = 200;

    function scrollPartners(dir) {
        if (!partnersTrack) return;
        const maxScroll = partnersTrack.scrollWidth - partnersTrack.clientWidth;
        partnerOffset   = Math.max(0, Math.min(partnerOffset + dir * partnerStep, maxScroll));
        partnersTrack.scrollTo({ left: partnerOffset, behavior: 'smooth' });
    }
    const partnerPrev = document.getElementById('partnerPrev');
    const partnerNext = document.getElementById('partnerNext');
    if (partnerPrev) partnerPrev.addEventListener('click', () => scrollPartners(-1));
    if (partnerNext) partnerNext.addEventListener('click', () => scrollPartners(1));

    /* ==================== BACK TO TOP ==================== */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('back-to-top--visible', window.scrollY > 400);
    });
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ==================== COUNTER ANIMATION ==================== */
    function animateCounter(el, target, suffix = '') {
        let current = 0;
        const step  = target / (2000 / 30);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 30);
    }

    const statsSection = document.querySelector('.why-us');
    if (statsSection) {
        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const nums    = document.querySelectorAll('.stat__number');
                const targets = [
                    { val: 8700, suffix: '+' },
                    { val: 294,  suffix: '+' },
                    { val: 14,   suffix: '+' },
                    { val: 65,   suffix: '%' },
                ];
                nums.forEach((el, i) => animateCounter(el, targets[i].val, targets[i].suffix));
                io.unobserve(entries[0].target);
            }
        }, { threshold: 0.3 });
        io.observe(statsSection);
    }

    /* ==================== SCROLL REVEAL ==================== */
    const revealEls = document.querySelectorAll(
        '.program-card, .feature, .study-card, .stat, .mosaic-item, .about__image, .about__content, .success-card'
    );
    revealEls.forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });
    const revealIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx   = Array.from(revealEls).indexOf(entry.target);
                const delay = (idx % 4) * 80;
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                revealIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealIO.observe(el));

    /* ==================== NEWSLETTER FORM ==================== */
    const newsletterBtn   = document.querySelector('.newsletter-form button');
    const newsletterInput = document.querySelector('.newsletter-form input');
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', () => {
            const email = newsletterInput.value.trim();
            if (!email || !email.includes('@')) {
                newsletterInput.style.borderColor = '#e53935';
                setTimeout(() => (newsletterInput.style.borderColor = ''), 2000);
                return;
            }
            newsletterBtn.innerHTML    = '<i class="fas fa-check"></i>';
            newsletterBtn.style.background = '#218838';
            newsletterInput.value = '';
            setTimeout(() => {
                newsletterBtn.innerHTML    = '<i class="fas fa-paper-plane"></i>';
                newsletterBtn.style.background = '';
            }, 3000);
        });
    }

    /* ==================== ACTIVE NAV ON SCROLL ==================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__item > a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 130) current = sec.id; });
        navLinks.forEach(link => {
            link.parentElement.classList.remove('nav__item--active');
            if (link.getAttribute('href') === `#${current}`) link.parentElement.classList.add('nav__item--active');
        });
    });

});