// Carrusel ES6: next/prev, dots, teclado, swipe, autoplay, reducir movimiento
(() => {
    const root = document.querySelector('[data-carousel]');
    if (!root) return;

    const track = root.querySelector('[data-track]');
    const slides = Array.from(root.querySelectorAll('[data-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-dot]'));
    const btnPrev = root.querySelector('[data-prev]');
    const btnNext = root.querySelector('[data-next]');
    const status = root.querySelector('[data-status]');
    const btnAutoplay = root.querySelector('[data-autoplay]');
    const btnReduced = root.querySelector('[data-reduced]');

    let index = 0;
    let autoplayId = null;
    let autoplayOn = true;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const setActive = (i) => {
        index = clamp(i, 0, slides.length - 1);

        track.scrollTo({
            left: slides[index].offsetLeft,
            behavior: reducedMotion ? 'auto' : 'smooth'
        });

        slides.forEach((s, si) => s.classList.toggle('is-active', si === index));
        dots.forEach((d, di) => {
            const active = di === index;
            d.classList.toggle('is-active', active);
            if (active) d.setAttribute('aria-current', 'true');
            else d.removeAttribute('aria-current');
        });

        if (status) status.textContent = `${index + 1} / ${slides.length}`;
    };

    const next = () => setActive(index + 1 > slides.length - 1 ? 0 : index + 1);
    const prev = () => setActive(index - 1 < 0 ? slides.length - 1 : index - 1);

    const stopAutoplay = () => {
        if (autoplayId) window.clearInterval(autoplayId);
        autoplayId = null;
    };

    const startAutoplay = () => {
        stopAutoplay();
        if (!autoplayOn) return;
        if (reducedMotion) return;
        autoplayId = window.setInterval(next, 4500);
    };

    // Click controls
    btnNext?.addEventListener('click', () => { next(); startAutoplay(); });
    btnPrev?.addEventListener('click', () => { prev(); startAutoplay(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { setActive(i); startAutoplay(); });
    });

    // Save button toggle (demo)
    root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="save"]');
        if (!btn) return;
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!pressed));
        btn.textContent = pressed ? 'Guardar' : 'Guardado';
    });

    // Keyboard
    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); startAutoplay(); }
        if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    });
    root.tabIndex = 0;

    // Swipe (pointer events)
    let startX = 0;
    let isDown = false;

    track.addEventListener('pointerdown', (e) => {
        isDown = true;
        startX = e.clientX;
        track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointerup', (e) => {
        if (!isDown) return;
        isDown = false;

        const dx = e.clientX - startX;
        if (Math.abs(dx) < 40) return;

        if (dx < 0) next();
        else prev();

        startAutoplay();
    });

    // Autoplay toggle
    btnAutoplay?.addEventListener('click', () => {
        autoplayOn = !autoplayOn;
        btnAutoplay.setAttribute('aria-pressed', String(autoplayOn));
        startAutoplay();
    });

    // Reduced motion toggle (manual)
    btnReduced?.addEventListener('click', () => {
        reducedMotion = !reducedMotion;
        btnReduced.setAttribute('aria-pressed', String(reducedMotion));
        stopAutoplay();
        startAutoplay();
    });

    // Sync index on resize (layout changes)
    window.addEventListener('resize', () => setActive(index));

    // Init
    setActive(0);
    startAutoplay();
})();
