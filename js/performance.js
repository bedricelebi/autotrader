// ==========================================
// ⚡ PERFORMANCE OPTIMIZATION SCRIPT
// ==========================================

// Reduce animations on slower devices
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSlowDevice = navigator.hardwareConcurrency <= 2;

if (reducedMotion || isSlowDevice) {
    document.documentElement.classList.add('reduce-animations');
}

// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Throttle scroll events
let ticking = false;
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    lastScrollTop = window.pageYOffset;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll(lastScrollTop);
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll(scrollPos) {
    // Efficient scroll handling
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollPos > 100) {
            navbar.style.background = 'rgba(5, 8, 22, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
    }
}

// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle resize
        console.log('Window resized');
    }, 250);
});

// Optimize particle canvas for mobile
if (window.innerWidth < 768) {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        canvas.style.opacity = '0.3';
    }
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        heroParticles.style.display = 'none';
    }
}

// Add CSS for reduced animations
if (reducedMotion || isSlowDevice) {
    const style = document.createElement('style');
    style.textContent = `
        .reduce-animations * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        .particle-canvas,
        #heroParticles,
        .floating-shape,
        .depth-lines {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Console performance info
console.log('⚡ Performance Mode:', isSlowDevice ? 'Optimized' : 'Full');
console.log('🎨 Animations:', reducedMotion ? 'Reduced' : 'Full');
