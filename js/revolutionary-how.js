// ==========================================
// 🌟 REVOLUTIONARY HOW IT WORKS ANIMATIONS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initParticleCanvas();
    initWordMorph();
    init3DCards();
    initMetricCounters();
    initAOSAnimations();
});

// ========== PARTICLE CANVAS ANIMATION ==========
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 174, 239, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections between nearby particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 174, 239, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        animationId = requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// ========== WORD MORPHING ANIMATION ==========
function initWordMorph() {
    const wordElement = document.querySelector('.word-morph');
    if (!wordElement) return;
    
    const words = wordElement.dataset.words.replace(/[\[\]"']/g, '').split(',');
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % words.length;
        
        // Fade out
        wordElement.style.opacity = '0';
        wordElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            wordElement.textContent = words[currentIndex];
            // Fade in
            wordElement.style.opacity = '1';
            wordElement.style.transform = 'translateY(0)';
        }, 300);
    }, 3000);
    
    // Add transition styles
    wordElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ========== 3D CARD FLIP INTERACTIONS ==========
function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        const flipBtn = card.querySelector('.card-front .flip-card-btn');
        const backBtn = card.querySelector('.card-back .flip-card-btn');
        
        // Flip to back
        if (flipBtn) {
            flipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                card.classList.add('flipped');
            });
        }
        
        // Flip to front
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                card.classList.remove('flipped');
            });
        }
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('flipped')) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ========== METRIC COUNTER ANIMATION ==========
function initMetricCounters() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    let hasAnimated = false;
    
    function animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number
            let displayValue;
            if (target >= 1000000) {
                displayValue = (current / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                displayValue = (current / 1000).toFixed(1) + 'K';
            } else if (target < 1) {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = prefix + displayValue + suffix;
        }, stepDuration);
    }
    
    // Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                metricNumbers.forEach(element => {
                    animateCounter(element);
                });
            }
        });
    }, { threshold: 0.5 });
    
    if (metricNumbers.length > 0) {
        observer.observe(metricNumbers[0].closest('.success-metrics'));
    }
}

// ========== AOS (ANIMATE ON SCROLL) INITIALIZATION ==========
function initAOSAnimations() {
    // Simple AOS-like functionality
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add animation classes based on data-aos attribute
                const animationType = entry.target.getAttribute('data-aos');
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    switch(animationType) {
                        case 'fade-up':
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            break;
                        case 'flip-left':
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'perspective(2500px) rotateY(0deg)';
                            break;
                        case 'zoom-in':
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1)';
                            break;
                    }
                }, delay);
            }
        });
    }, { threshold: 0.2 });
    
    elements.forEach(element => {
        // Set initial styles
        const animationType = element.getAttribute('data-aos');
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        switch(animationType) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(60px)';
                break;
            case 'flip-left':
                element.style.opacity = '0';
                element.style.transform = 'perspective(2500px) rotateY(-100deg)';
                break;
            case 'zoom-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.6)';
                break;
        }
        
        observer.observe(element);
    });
}

// ========== SMOOTH SCROLL TO TOP ==========
document.addEventListener('click', function(e) {
    if (e.target.closest('.mega-cta-button') || e.target.closest('.how-cta-button')) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// ========== PARALLAX EFFECT FOR FLOATING ORBS ==========
window.addEventListener('scroll', function() {
    const orbs = document.querySelectorAll('.orb-float');
    const scrolled = window.pageYOffset;
    
    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px)`;
    });
});

// ========== TYPING EFFECT FOR SUBTITLE ==========
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Trigger when element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.disconnect();
            }
        });
    });
    
    observer.observe(typingElement);
}

// Initialize typing effect
setTimeout(initTypingEffect, 500);

console.log('🌟 Revolutionary How It Works loaded!');
