document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const saveBtns = document.querySelectorAll('.btn-save');
    
    let currentIndex = 3; // Empezar con el slide central
    let autoPlayInterval = null;
    const autoPlayDelay = 4000;
    
    // Función para actualizar posiciones (igual que el CodePen)
    function updatePositions() {
        items.forEach((item, index) => {
            item.classList.remove('active');
            
            // Calcular la nueva posición basada en la diferencia con currentIndex
            const diff = index - currentIndex;
            
            // Posicionamiento basado en la diferencia
            if (diff === 0) {
                // Slide central
                item.style.left = '50%';
                item.style.transform = 'translateY(-50%) translateX(-50%) scale(1)';
                item.style.opacity = '1';
                item.style.zIndex = '3';
                item.classList.add('active');
            } else if (Math.abs(diff) === 1) {
                // Slides inmediatamente adyacentes
                const direction = diff > 0 ? 1 : -1;
                item.style.left = `${50 + (direction * 15)}%`;
                item.style.transform = 'translateY(-50%) translateX(-50%) scale(0.9)';
                item.style.opacity = '0.7';
                item.style.zIndex = '2';
            } else if (Math.abs(diff) === 2) {
                // Slides dos posiciones alejadas
                const direction = diff > 0 ? 1 : -1;
                item.style.left = `${50 + (direction * 30)}%`;
                item.style.transform = 'translateY(-50%) translateX(-50%) scale(0.8)';
                item.style.opacity = '0.4';
                item.style.zIndex = '1';
            } else {
                // Slides muy alejados (invisibles)
                const direction = diff > 0 ? 1 : -1;
                item.style.left = `${50 + (direction * 45)}%`;
                item.style.transform = 'translateY(-50%) translateX(-50%) scale(0.7)';
                item.style.opacity = '0';
                item.style.zIndex = '0';
            }
        });
        
        // Actualizar dots
        updateDots();
    }
    
    // Función para actualizar dots
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Función para ir al siguiente slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updatePositions();
        resetAutoPlay();
    }
    
    // Función para ir al slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updatePositions();
        resetAutoPlay();
    }
    
    // Función para ir a un slide específico
    function goToSlide(index) {
        if (index !== currentIndex) {
            currentIndex = index;
            updatePositions();
            resetAutoPlay();
        }
    }
    
    // Función para toggle save
    function toggleSave(button) {
        const isSaved = button.classList.contains('saved');
        
        if (isSaved) {
            button.classList.remove('saved');
            button.innerHTML = '<i class="far fa-bookmark"></i> Save';
        } else {
            button.classList.add('saved');
            button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        }
        
        resetAutoPlay();
    }
    
    // Autoplay functions
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event Listeners
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
    });
    
    // Dots navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            goToSlide(index);
        });
    });
    
    // Save buttons
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSave(this);
        });
    });
    
    // View buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const activeSlide = document.querySelector('.item.active');
            const destination = activeSlide.querySelector('.title').textContent;
            alert(`Viewing offer for: ${destination}`);
            resetAutoPlay();
        });
    });
    
    // Click en slides para navegar
    items.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-primary') && !e.target.closest('.btn-save')) {
                goToSlide(index);
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });
    
    // Swipe para móvil
    let startX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });
    
    slider.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    }, { passive: false });
    
    slider.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        resetAutoPlay();
    });
    
    // Mouse drag para desktop
    slider.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        isDragging = true;
        stopAutoPlay();
    });
    
    slider.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    slider.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        
        const endX = e.clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        resetAutoPlay();
    });
    
    // Pausar autoplay al hacer hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Inicializar
    updatePositions();
    startAutoPlay();
    
    // Ajustar en resize
    window.addEventListener('resize', updatePositions);
});