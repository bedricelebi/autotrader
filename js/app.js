// Currency mapping
const currencyMap = {
    'usa': '$',
    'canada': 'CAD $',
    'uk': '£',
    'germany': '€',
    'france': '€',
    'turkey': '₺',
    'uae': 'AED ',
    'lebanon': 'L£'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initHeroParticles();
    initParticles();
    initScrollAnimations();
    initMagneticEffect();
    initCustomCursor();
    initHeroParallax();
    initStatTilt();
});

function initializeApp() {
    setupCountryChange();
    setupBudgetSlider();
    setupRepairButtons();
    setupAdvancedFilters();
    setupProfitCalculator();
    setupFindCarsButton();
    setupScrollTop();
    setupThemeToggle();
    setupNavigation();
    animateLiveStats();
    initVoiceSearch();
    initKeyboardShortcuts();
    initProgressBar();
    initTooltips();
    initNotifications();
    enhanceFormInputs();
}

// Enhance form inputs with visual feedback
function enhanceFormInputs() {
    const inputs = document.querySelectorAll('.form-card input, .form-card select, .advanced-filters input, .advanced-filters select');
    
    inputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('input-focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('input-focused');
            
            // Validate on blur
            if (input.value && input.type === 'number') {
                const value = parseFloat(input.value);
                if (value < 0) {
                    input.value = 0;
                    showNotification('Value cannot be negative', 'warning');
                }
            }
        });
        
        // Add input animation
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

// Country change handler - updates currency symbol
function setupCountryChange() {
    const countrySelect = document.getElementById('country');
    const currencySymbol = document.getElementById('currencySymbol');
    
    if (countrySelect && currencySymbol) {
        countrySelect.addEventListener('change', (e) => {
            currencySymbol.textContent = currencyMap[e.target.value] || '$';
            updateBudgetDisplay();
        });
    }
}

// Budget slider sync with input
function setupBudgetSlider() {
    const budgetInput = document.getElementById('budget');
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetDisplay = document.getElementById('budgetDisplay');

    if (budgetSlider && budgetInput && budgetDisplay) {
        // Slider changes input
        budgetSlider.addEventListener('input', (e) => {
            budgetInput.value = e.target.value;
            updateBudgetDisplay();
        });

        // Input changes slider
        budgetInput.addEventListener('input', (e) => {
            const value = Math.min(Math.max(e.target.value, 1000), 100000);
            budgetSlider.value = value;
            updateBudgetDisplay();
        });
    }
}

function updateBudgetDisplay() {
    const budgetInput = document.getElementById('budget');
    const budgetDisplay = document.getElementById('budgetDisplay');
    const countrySelect = document.getElementById('country');
    
    if (budgetDisplay && budgetInput && countrySelect) {
        const currency = currencyMap[countrySelect.value] || '$';
        const value = budgetInput.value || budgetSlider.value;
        budgetDisplay.textContent = `${currency}${Number(value).toLocaleString()}`;
    }
}

// Repair tolerance button selection
function setupRepairButtons() {
    // Support both old and new repair button structures
    const repairButtons = document.querySelectorAll('.repair-buttons button, .repair-option');
    
    repairButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active from all
            repairButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked
            button.classList.add('active');
            
            // Create ripple effect (if old structure)
            if (button.classList.contains('repair-buttons')) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                button.appendChild(ripple);
            }
            
            // Play click sound (optional)
            playClickSound();
            
            // Haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Click sound effect
function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Advanced filters toggle
function setupAdvancedFilters() {
    const toggleBtn = document.getElementById('toggleAdvanced');
    const advancedFilters = document.getElementById('advancedFilters');
    
    if (!toggleBtn || !advancedFilters) return;
    
    let isOpen = false;
    
    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        
        // Toggle button state
        toggleBtn.classList.toggle('active', isOpen);
        
        // Toggle filters state
        advancedFilters.classList.toggle('active', isOpen);
        
        if (isOpen) {
            // Opening animation
            advancedFilters.style.display = 'grid';
            
            // Force reflow for animation
            void advancedFilters.offsetHeight;
            
            // Calculate and set max-height
            const height = advancedFilters.scrollHeight;
            advancedFilters.style.maxHeight = height + 'px';
            
            // Smooth scroll after opening
            setTimeout(() => {
                toggleBtn.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 150);
        } else {
            // Closing animation
            advancedFilters.style.maxHeight = '0';
            
            setTimeout(() => {
                advancedFilters.style.display = 'none';
            }, 400);
        }
        
        // Play click sound
        playClickSound();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    });
}

// Profit calculator
function setupProfitCalculator() {
    const inputs = ['calcPurchase', 'calcRepair', 'calcSale', 'calcOther'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateProfit);
        }
    });
    
    // Reset button
    const resetBtn = document.querySelector('.reset-calc-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('calcPurchase').value = 10000;
            document.getElementById('calcRepair').value = 2000;
            document.getElementById('calcSale').value = 15000;
            document.getElementById('calcOther').value = 500;
            calculateProfit();
        });
    }
    
    // Initial calculation
    calculateProfit();
}

function calculateProfit() {
    const purchase = parseFloat(document.getElementById('calcPurchase')?.value || 0);
    const repair = parseFloat(document.getElementById('calcRepair')?.value || 0);
    const sale = parseFloat(document.getElementById('calcSale')?.value || 0);
    const other = parseFloat(document.getElementById('calcOther')?.value || 0);
    
    const totalInvestment = purchase + repair + other;
    const profit = sale - totalInvestment;
    const roi = totalInvestment > 0 ? ((profit / totalInvestment) * 100).toFixed(1) : 0;
    
    // Update display
    const profitAmount = document.getElementById('profitAmount');
    const profitMargin = document.getElementById('profitMargin');
    const totalInvestmentEl = document.getElementById('totalInvestment');
    const expectedReturn = document.getElementById('expectedReturn');
    
    if (profitAmount) {
        profitAmount.textContent = `$${profit.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        profitAmount.className = profit >= 0 ? 'ring-value' : 'ring-value negative';
    }
    
    if (profitMargin) {
        profitMargin.textContent = `${roi}% ROI`;
    }
    
    if (totalInvestmentEl) {
        totalInvestmentEl.textContent = `$${totalInvestment.toLocaleString()}`;
    }
    
    if (expectedReturn) {
        expectedReturn.textContent = `$${sale.toLocaleString()}`;
    }
    
    // Update ROI ring
    const roiRing = document.getElementById('roiRing');
    if (roiRing) {
        const maxRoi = 100; // Max ROI for full circle
        const clampedRoi = Math.max(0, Math.min(roi, maxRoi));
        const circumference = 534; // 2 * PI * 85
        const offset = circumference - (circumference * clampedRoi / maxRoi);
        roiRing.style.strokeDashoffset = offset;
    }
    
    // Update cost breakdown bars
    if (totalInvestment > 0) {
        const purchasePercent = ((purchase / totalInvestment) * 100).toFixed(0);
        const repairPercent = ((repair / totalInvestment) * 100).toFixed(0);
        const otherPercent = ((other / totalInvestment) * 100).toFixed(0);
        
        updateBar('purchaseBar', 'purchasePercent', purchasePercent);
        updateBar('repairBar', 'repairPercent', repairPercent);
        updateBar('otherBar', 'otherPercent', otherPercent);
    }
}

function updateBar(barId, percentId, percent) {
    const bar = document.getElementById(barId);
    const percentEl = document.getElementById(percentId);
    
    if (bar) {
        bar.style.width = `${percent}%`;
    }
    
    if (percentEl) {
        percentEl.textContent = `${percent}%`;
    }
}

// Find cars button
function setupFindCarsButton() {
    const findCarsBtn = document.getElementById('findCars');
    
    if (findCarsBtn) {
        findCarsBtn.addEventListener('click', (e) => {
            const country = document.getElementById('country')?.value;
            const budget = document.getElementById('budget')?.value;
            const carType = document.getElementById('carType')?.value;
            const goal = document.getElementById('goal')?.value;
            
            // Get active repair button
            const activeRepair = document.querySelector('.repair-buttons button.active');
            const repairLevel = activeRepair?.dataset.level || 'medium';
            
            // Get advanced filters if visible
            const advancedFilters = document.getElementById('advancedFilters');
            let extraData = {};
            
            if (advancedFilters && advancedFilters.classList.contains('active')) {
                extraData = {
                    maxAge: document.getElementById('maxAge')?.value || '',
                    maxMileage: document.getElementById('maxMileage')?.value || '',
                    fuelType: document.getElementById('fuelType')?.value || 'any',
                    transmission: document.getElementById('transmission')?.value || 'any'
                };
            }
            
            // Validate
            if (!budget || budget < 1000) {
                showNotification('Please enter a valid budget (minimum $1,000)', 'error');
                shakeElement(document.getElementById('budget'));
                return;
            }
            
            // Show loading state
            findCarsBtn.disabled = true;
            findCarsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SEARCHING...';
            
            // Create success animation
            createConfetti(e.clientX, e.clientY);
            
            // Play success sound
            playSuccessSound();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Save to localStorage
            const searchData = {
                country,
                budget,
                carType,
                goal,
                repairLevel,
                ...extraData,
                timestamp: new Date().toISOString()
            };
            
            // Save search history
            const searches = JSON.parse(localStorage.getItem('searches') || '[]');
            searches.unshift(searchData);
            localStorage.setItem('searches', JSON.stringify(searches.slice(0, 10)));
            
            // Save current search
            localStorage.setItem('currentSearch', JSON.stringify(searchData));
            
            // Simulate processing with progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    
                    // Navigate after animation
                    setTimeout(() => {
                        window.location.href = 'results.html';
                    }, 500);
                }
            }, 200);
        });
    }
}

// Success sound
function playSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.frequency.value = 523.25; // C5
    oscillator2.frequency.value = 659.25; // E5
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime + 0.1);
    oscillator1.stop(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.4);
}

// Confetti animation
function createConfetti(x, y) {
    const colors = ['#00AEEF', '#8a2be2', '#10b981', '#f59e0b'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
        confetti.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
        confetti.style.setProperty('--r', Math.random() * 720 + 'deg');
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Shake element animation
function shakeElement(element) {
    if (!element) return;
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

// Scroll to top button
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Theme toggle (placeholder for future implementation)
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Future: implement light/dark theme toggle
            const icon = themeToggle.querySelector('i');
            if (icon.classList.contains('fa-moon')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
}

// Smooth navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80; // Navbar height
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Animate live stats
function animateLiveStats() {
    const carCount = document.getElementById('liveCarCount');
    const users = document.getElementById('liveUsers');
    
    // Random increments to simulate live data
    setInterval(() => {
        if (carCount) {
            const current = parseInt(carCount.textContent.replace(/,/g, ''));
            const newCount = current + Math.floor(Math.random() * 10);
            carCount.textContent = newCount.toLocaleString();
        }
        
        if (users) {
            const current = parseInt(users.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newUsers = Math.max(8000, current + change);
            users.textContent = newUsers.toLocaleString();
        }
    }, 5000); // Update every 5 seconds
}

// Hero Particles Canvas
function initHeroParticles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 40; // Reduced for subtlety
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.vz = Math.random() * 1.5 + 0.5; // Slower movement
            this.size = Math.random() * 1.5 + 0.5; // Smaller particles
        }
        
        update() {
            this.z -= this.vz;
            
            if (this.z <= 0) {
                this.reset();
                this.z = 1000;
            }
            
            const scale = 1000 / (1000 + this.z);
            this.sx = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            this.sy = (this.y - canvas.height / 2) * scale + canvas.height / 2;
            this.sSize = this.size * scale;
        }
        
        draw() {
            const opacity = (1 - this.z / 1000) * 0.4; // More subtle opacity
            ctx.beginPath();
            ctx.arc(this.sx, this.sy, this.sSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 174, 239, ${opacity})`;
            ctx.fill();
            
            // Add soft glow
            ctx.shadowBlur = 3;
            ctx.shadowColor = `rgba(0, 174, 239, ${opacity * 0.5})`;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Hero Mouse Parallax Effect
function initHeroParallax() {
    const parallaxLayer = document.getElementById('parallaxLayer');
    const hero = document.querySelector('.ultra-hero');
    
    if (!parallaxLayer || !hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        parallaxLayer.style.setProperty('--mouse-x', `${x}%`);
        parallaxLayer.style.setProperty('--mouse-y', `${y}%`);
        
        // Move 3D shapes slightly based on mouse position
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const moveX = (x - 50) * speed * 0.1;
            const moveY = (y - 50) * speed * 0.1;
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    hero.addEventListener('mouseleave', () => {
        parallaxLayer.style.setProperty('--mouse-x', '50%');
        parallaxLayer.style.setProperty('--mouse-y', '50%');
        
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach(shape => {
            shape.style.transform = 'translate(0, 0)';
        });
    });
}

// 3D Tilt Effect for Stat Cards
function initStatTilt() {
    const stats = document.querySelectorAll('[data-tilt]');
    
    stats.forEach(stat => {
        stat.addEventListener('mousemove', (e) => {
            const rect = stat.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            stat.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
        });
        
        stat.addEventListener('mouseleave', () => {
            stat.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

// 3D Particle Background Animation
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.speedZ = Math.random() * 2 + 1;
            this.color = `rgba(0, 174, 239, ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.z -= this.speedZ;
            if (this.z <= 0) {
                this.z = 1000;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            const scale = 1000 / (1000 + this.z);
            const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
            const size2d = this.size * scale;
            
            ctx.beginPath();
            ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Connection lines
            particles.forEach(p => {
                const dx = this.x - p.x;
                const dy = this.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(x2d, y2d);
                    const px2d = (p.x - canvas.width / 2) * (1000 / (1000 + p.z)) + canvas.width / 2;
                    const py2d = (p.y - canvas.height / 2) * (1000 / (1000 + p.z)) + canvas.height / 2;
                    ctx.lineTo(px2d, py2d);
                    ctx.strokeStyle = `rgba(0, 174, 239, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Scroll reveal animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Magnetic mouse effect for cards
function initMagneticEffect() {
    const magneticCards = document.querySelectorAll('.magnetic-card, .tilt-card');
    
    magneticCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 10;
            const rotateY = deltaX * -10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Custom cursor effect - OPTIMIZED FOR INSTANT RESPONSE
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    // INSTANT cursor tracking - no delay
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant positioning for dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        // Faster outline follow (0.5 instead of 0.15)
        outlineX = mouseX;
        outlineY = mouseY;
        cursorOutline.style.left = (outlineX - 20) + 'px';
        cursorOutline.style.top = (outlineY - 20) + 'px';
    }, { passive: true }); // Passive listener for better performance
    
    // Enhance cursor on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, .stat-box, .car-card, .flip-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2)';
            cursorOutline.style.transform = 'scale(1.5)';
            cursorOutline.style.opacity = '1';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
            cursorOutline.style.opacity = '0.5';
        });
    });
}

// Voice Search Feature (Next-Gen)
function initVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return; // Voice recognition not supported
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Add voice button to budget input
    const budgetInput = document.getElementById('budget');
    if (budgetInput && !document.getElementById('voiceBtn')) {
        const voiceBtn = document.createElement('button');
        voiceBtn.id = 'voiceBtn';
        voiceBtn.className = 'voice-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.type = 'button';
        voiceBtn.title = 'Voice input';
        budgetInput.parentElement.style.position = 'relative';
        budgetInput.parentElement.appendChild(voiceBtn);
        
        voiceBtn.addEventListener('click', () => {
            voiceBtn.classList.add('listening');
            recognition.start();
            showNotification('Listening... Say a number', 'info');
        });
    }
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const number = parseInt(transcript.replace(/[^0-9]/g, ''));
        
        if (number && number >= 1000) {
            document.getElementById('budget').value = number;
            document.getElementById('budgetSlider').value = Math.min(number, 100000);
            updateBudgetDisplay();
            showNotification(`Budget set to: ${number}`, 'success');
            playSuccessSound();
        } else {
            showNotification('Please say a valid number (minimum 1000)', 'error');
        }
    };
    
    recognition.onend = () => {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.classList.remove('listening');
    };
    
    recognition.onerror = () => {
        showNotification('Voice recognition error', 'error');
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.classList.remove('listening');
    };
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('budget')?.focus();
            showNotification('Quick search activated', 'info');
        }
        
        // Ctrl/Cmd + Enter: Submit search
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('findCars')?.click();
        }
        
        // Escape: Close advanced filters
        if (e.key === 'Escape') {
            const advancedFilters = document.getElementById('advancedFilters');
            if (advancedFilters && !advancedFilters.classList.contains('hidden')) {
                document.getElementById('toggleAdvanced')?.click();
            }
        }
        
        // Number keys 1-3: Select repair level
        if (['1', '2', '3'].includes(e.key) && !e.target.matches('input, textarea, select')) {
            const buttons = document.querySelectorAll('.repair-buttons button');
            if (buttons[parseInt(e.key) - 1]) {
                buttons[parseInt(e.key) - 1].click();
            }
        }
    });
    
    // Show keyboard shortcuts hint
    setTimeout(() => {
        showNotification('💡 Tip: Press Ctrl+K for quick search, Ctrl+Enter to submit', 'info', 5000);
    }, 3000);
}

// Progress Bar
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    let scrollProgress = 0;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        scrollProgress = (window.scrollY / documentHeight) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = scrollProgress + '%';
        }
    });
}

// Smart Tooltips
function initTooltips() {
    const elementsWithTooltips = [
        { selector: '#country', text: 'Select your country for localized pricing' },
        { selector: '#budget', text: 'Enter your maximum purchase budget' },
        { selector: '#carType', text: 'Choose the type of vehicle you want' },
        { selector: '#goal', text: 'What\'s your primary objective?' },
        { selector: '.theme-toggle', text: 'Toggle dark/light theme' }
    ];
    
    elementsWithTooltips.forEach(({ selector, text }) => {
        const element = document.querySelector(selector);
        if (element && !element.hasAttribute('data-tooltip')) {
            element.setAttribute('data-tooltip', text);
            element.classList.add('has-tooltip');
        }
    });
}

// Toast Notifications System
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function initNotifications() {
    // Welcome notification
    setTimeout(() => {
        showNotification('🚗 Welcome to AutoTrader Global! Find your perfect car flip.', 'success', 4000);
    }, 1000);
    
    // Check for returning user
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 0) {
            setTimeout(() => {
                showNotification(`Welcome back! It's been ${daysSince} day(s) since your last visit.`, 'info', 5000);
            }, 2000);
        }
    }
    localStorage.setItem('lastVisit', new Date().toISOString());
}

// Newsletter submission handler
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    
    if (email) {
        // Simulate API call
        showNotification(`✉️ Thank you! We'll send updates to ${email}`, 'success', 4000);
        document.getElementById('newsletterEmail').value = '';
        playSuccessSound();
        createConfetti(window.innerWidth / 2, window.innerHeight - 100);
        
        if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
        }
    }
    
    return false;
}

// Ultra Modern FAB (Floating Action Button) functionality
document.addEventListener('DOMContentLoaded', () => {
    const fabTrigger = document.getElementById('fabTrigger');
    const fabActions = document.getElementById('fabActions');
    
    if (fabTrigger && fabActions) {
        let isOpen = false;
        
        fabTrigger.addEventListener('click', () => {
            isOpen = !isOpen;
            fabActions.classList.toggle('active', isOpen);
            playClickSound();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
        
        // FAB action handlers
        document.querySelectorAll('.fab-action').forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.dataset.action;
                
                switch(actionType) {
                    case 'chat':
                        showNotification('💬 Live chat launching soon!', 'info');
                        playSuccessSound();
                        break;
                    case 'help':
                        showNotification('❓ Redirecting to help center...', 'info');
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 500);
                        break;
                    case 'share':
                        if (navigator.share) {
                            navigator.share({
                                title: 'AutoTrader Pro',
                                text: 'AI-powered car flipping intelligence platform',
                                url: window.location.href
                            }).then(() => {
                                showNotification('✅ Thanks for sharing!', 'success');
                                createConfetti(window.innerWidth / 2, window.innerHeight / 2);
                            });
                        } else {
                            // Fallback: copy to clipboard
                            navigator.clipboard.writeText(window.location.href);
                            showNotification('🔗 Link copied to clipboard!', 'success');
                        }
                        break;
                }
                
                // Close FAB menu
                isOpen = false;
                fabActions.classList.remove('active');
            });
        });
        
        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.quick-actions-fab') && isOpen) {
                isOpen = false;
                fabActions.classList.remove('active');
            }
        });
    }
    
    // Update footer year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Animate footer stats
    animateFooterStats();
});

// Footer stats animation
function animateFooterStats() {
    const footerUsers = document.getElementById('footerUsers');
    const footerCars = document.getElementById('footerCars');
    
    if (footerUsers && footerCars) {
        setInterval(() => {
            const users = parseInt(footerUsers.textContent.replace(/,/g, ''));
            const newUsers = users + Math.floor(Math.random() * 10 - 3);
            footerUsers.textContent = Math.max(8000, newUsers).toLocaleString();
        }, 8000);
    }
}

// Ultra-stats counter animation
function initUltraStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString();
                } else {
                    element.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                // Final value
                if (target >= 1000) {
                    element.textContent = target.toLocaleString();
                } else {
                    element.textContent = target;
                }
                
                // Add prefix if it exists
                const prefix = element.getAttribute('data-prefix');
                if (prefix) {
                    element.textContent = prefix + element.textContent;
                }
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    const animateProgressBar = (bar) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        // Trigger reflow
        bar.offsetWidth;
        
        // Animate to target width
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = targetWidth;
        }, 100);
    };
    
    // Intersection Observer to trigger animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                
                // Animate counter
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target);
                }
                
                // Animate progress bar
                if (entry.target.classList.contains('stat-progress')) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        animateProgressBar(progressBar);
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observe stat numbers
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Observe progress containers
    const progressContainers = document.querySelectorAll('.stat-progress');
    progressContainers.forEach(progress => observer.observe(progress));
}

// Initialize ultra-stats counters when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUltraStatsCounters);
} else {
    initUltraStatsCounters();
}

// Make functions globally available
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ===== POPULAR CARS CANVAS PARTICLES =====
function initPopularCarsCanvas() {
    const canvas = document.getElementById('popularCarsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 174, 239, ${p.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// ===== TESTIMONIALS CANVAS PARTICLES =====
function initTestimonialsCanvas() {
    const canvas = document.getElementById('testimonialsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 217, 255, ${p.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(0, 217, 255, ${p.opacity})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== INITIALIZE ALL NEW SECTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    initPopularCarsCanvas();
    initTestimonialsCanvas();
    initFAQ();
});
