// ===== NEW FEATURES JAVASCRIPT =====
// All 14 Features Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initPriceTracker();
    initComparisonTool();
    initRecommendations();
    initRegionalHeatmap();
    initFinanceCalculator();
    initVehicleHistory();
    initMarketAlerts();
    initVirtualShowroom();
    initDealerMap();
    initTradeInEstimator();
    initWishlist();
    initLiveChat();
    initSocialProofTicker();
});

// ===== 1. PRICE TRACKER =====
function initPriceTracker() {
    const timeFilters = document.querySelectorAll('.time-filter');
    const miniCharts = document.querySelectorAll('.mini-chart');
    
    // Sample price data for different time periods
    const priceData = {
        '1H': [48000, 47950, 47900, 47850, 47800, 47750, 47700, 47650],
        '24H': [48500, 48300, 48100, 47900, 47800, 47700, 47650, 47700],
        '7D': [49000, 48800, 48500, 48200, 48000, 47800, 47700, 47650],
        '30D': [50000, 49500, 49000, 48500, 48200, 48000, 47800, 47650]
    };
    
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.time-filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.dataset.period;
            
            // Redraw all charts with new data
            miniCharts.forEach((canvas, index) => {
                drawMiniChart(canvas, priceData[period]);
            });
        });
    });
    
    // Initial chart drawing
    miniCharts.forEach(canvas => {
        drawMiniChart(canvas, priceData['24H']);
    });
}

function drawMiniChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 5;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find min and max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Draw line chart
    ctx.beginPath();
    ctx.strokeStyle = '#00AEEF';
    ctx.lineWidth = 2;
    
    const stepX = (width - padding * 2) / (data.length - 1);
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw area fill
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 174, 239, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 174, 239, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
}

// ===== 2. COMPARISON TOOL =====
function initComparisonTool() {
    const addCompareButtons = document.querySelectorAll('.add-to-compare');
    const compareButton = document.querySelector('.btn-compare-cars');
    
    if (compareButton) {
        compareButton.addEventListener('click', function() {
            const comparisonSection = document.getElementById('comparison-tool');
            if (comparisonSection) {
                comparisonSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Animate score rings
    const scoreRings = document.querySelectorAll('.score-ring');
    scoreRings.forEach(ring => {
        const score = ring.dataset.score;
        animateScoreRing(ring, score);
    });
}

function animateScoreRing(element, targetScore) {
    let currentScore = 0;
    const duration = 1500;
    const increment = targetScore / (duration / 16);
    
    const animate = () => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
        }
        
        element.style.setProperty('--score', currentScore);
        
        if (currentScore < targetScore) {
            requestAnimationFrame(animate);
        }
    };
    
    // Start animation when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(element);
}

// ===== 3. AI RECOMMENDATIONS =====
function initRecommendations() {
    const heartButtons = document.querySelectorAll('.rec-heart');
    
    heartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart"></i>';
                showNotification('Added to wishlist!');
            } else {
                this.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    });
    
    // Animate match bars
    const matchBars = document.querySelectorAll('.match-bar-fill');
    matchBars.forEach(bar => {
        const match = bar.parentElement.dataset.match;
        setTimeout(() => {
            bar.style.width = match + '%';
        }, 300);
    });
}

// ===== 4. REGIONAL HEATMAP =====
function initRegionalHeatmap() {
    const regionCards = document.querySelectorAll('.region-card');
    
    regionCards.forEach(card => {
        card.addEventListener('click', function() {
            regionCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Animate price bars
            const bars = this.querySelectorAll('.region-price-bar');
            bars.forEach(bar => {
                const height = bar.dataset.height;
                bar.style.setProperty('--height', height + '%');
            });
        });
    });
}

// ===== 5. FINANCE CALCULATOR =====
function initFinanceCalculator() {
    const priceInput = document.getElementById('carPrice');
    const downInput = document.getElementById('downPayment');
    const rateInput = document.getElementById('interestRate');
    const termButtons = document.querySelectorAll('.term-btn');
    
    let selectedTerm = 60; // Default 5 years
    
    // Term selection
    termButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            termButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTerm = parseInt(this.dataset.months);
            calculateLoan();
        });
    });
    
    // Input listeners
    [priceInput, downInput, rateInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                updateSliderLabel(this);
                calculateLoan();
            });
        }
    });
    
    function updateSliderLabel(slider) {
        const label = document.getElementById(slider.id + 'Value');
        if (label) {
            if (slider.id === 'interestRate') {
                label.textContent = slider.value + '%';
            } else {
                label.textContent = '$' + parseInt(slider.value).toLocaleString();
            }
        }
    }
    
    function calculateLoan() {
        if (!priceInput || !downInput || !rateInput) return;
        
        const price = parseFloat(priceInput.value);
        const downPayment = parseFloat(downInput.value);
        const rate = parseFloat(rateInput.value) / 100 / 12;
        const principal = price - downPayment;
        
        // Monthly payment formula: M = P[r(1+r)^n]/[(1+r)^n-1]
        const monthlyPayment = principal * (rate * Math.pow(1 + rate, selectedTerm)) / (Math.pow(1 + rate, selectedTerm) - 1);
        const totalPayment = monthlyPayment * selectedTerm + downPayment;
        const totalInterest = totalPayment - price;
        
        // Update results
        document.getElementById('monthlyPayment').textContent = '$' + Math.round(monthlyPayment).toLocaleString();
        document.getElementById('totalPayment').textContent = '$' + Math.round(totalPayment).toLocaleString();
        document.getElementById('totalInterest').textContent = '$' + Math.round(totalInterest).toLocaleString();
        
        // Draw payment chart
        drawPaymentChart(principal, totalInterest, downPayment);
    }
    
    // Initial calculation
    calculateLoan();
}

function drawPaymentChart(principal, interest, downPayment) {
    const canvas = document.getElementById('paymentChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const total = principal + interest + downPayment;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Calculate angles
    const principalAngle = (principal / total) * 2 * Math.PI;
    const interestAngle = (interest / total) * 2 * Math.PI;
    const downAngle = (downPayment / total) * 2 * Math.PI;
    
    let startAngle = -Math.PI / 2;
    
    // Draw principal
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + principalAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = '#00AEEF';
    ctx.fill();
    
    startAngle += principalAngle;
    
    // Draw interest
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + interestAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    
    startAngle += interestAngle;
    
    // Draw down payment
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + downAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = '#10b981';
    ctx.fill();
}

// ===== 6. VEHICLE HISTORY =====
function initVehicleHistory() {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    
    // Animate timeline on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    });
    
    timelineEvents.forEach(event => {
        event.style.opacity = '0';
        event.style.transform = 'translateY(20px)';
        event.style.transition = 'all 0.5s ease';
        observer.observe(event);
    });
}

// ===== 7. MARKET ALERTS =====
function initMarketAlerts() {
    const toggles = document.querySelectorAll('.alert-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const alertCard = this.closest('.alert-card');
            if (this.checked) {
                alertCard.style.borderColor = 'rgba(0, 174, 239, 0.5)';
                showNotification('Price alert activated!');
            } else {
                alertCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

// ===== 8. VIRTUAL SHOWROOM (SIMPLE & BEAUTIFUL) =====
function initVirtualShowroom() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const colorItems = document.querySelectorAll('.color-item');
    const carImage = document.getElementById('showroomCarImage');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    
    // Car images for different views
    const carImages = {
        exterior: 'https://images.unsplash.com/photo-1617531653520-bd466bfc81ac?w=1200&q=80',
        interior: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
        engine: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=80',
        wheels: 'https://images.unsplash.com/photo-1625818962312-20e4d8e4f869?w=1200&q=80'
    };
    
    // View button clicks
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (carImage && carImages[view]) {
                carImage.style.opacity = '0.5';
                carImage.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    carImage.src = carImages[view];
                    carImage.style.opacity = '1';
                    carImage.style.transform = 'scale(1)';
                }, 300);
            }
            
            showNotification(`Viewing ${view}`);
        });
    });
    
    // Color selector
    colorItems.forEach(item => {
        item.addEventListener('click', function() {
            colorItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const colorName = this.getAttribute('title');
            showNotification(`Color: ${colorName}`);
            
            // Subtle color filter effect
            if (carImage) {
                carImage.style.filter = 'brightness(0.7)';
                setTimeout(() => {
                    carImage.style.filter = 'brightness(1)';
                }, 300);
            }
        });
    });
    
    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const viewer = document.querySelector('.car-viewer');
            if (viewer) {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                    this.innerHTML = '<i class="fas fa-expand"></i>';
                } else {
                    viewer.requestFullscreen().catch(err => {
                        console.log('Fullscreen error:', err);
                    });
                    this.innerHTML = '<i class="fas fa-compress"></i>';
                }
            }
        });
    }
    
    // Action buttons
    const testDriveBtn = document.querySelector('.btn-showroom-primary');
    const financingBtn = document.querySelector('.btn-showroom-secondary');
    
    if (testDriveBtn) {
        testDriveBtn.addEventListener('click', () => {
            showNotification('Scheduling test drive...');
        });
    }
    
    if (financingBtn) {
        financingBtn.addEventListener('click', () => {
            const financeSection = document.querySelector('.finance-calc-section');
            if (financeSection) {
                financeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== 9. DEALER MAP =====
function initDealerMap() {
    const dealerCards = document.querySelectorAll('.dealer-card');
    
    dealerCards.forEach(card => {
        const contactBtn = card.querySelector('.btn-contact-dealer');
        if (contactBtn) {
            contactBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const dealerName = card.querySelector('h4').textContent;
                showNotification(`Connecting you with ${dealerName}...`);
            });
        }
    });
}

// ===== 10. TRADE-IN ESTIMATOR =====
function initTradeInEstimator() {
    let currentStep = 1;
    const totalSteps = 3;
    
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const backButtons = document.querySelectorAll('.btn-back-step');
    const conditionCards = document.querySelectorAll('.condition-card');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep < totalSteps) {
                document.querySelector(`.tradein-step-${currentStep}`).style.display = 'none';
                currentStep++;
                document.querySelector(`.tradein-step-${currentStep}`).style.display = 'block';
                
                if (currentStep === 3) {
                    calculateTradeInValue();
                }
            }
        });
    });
    
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                document.querySelector(`.tradein-step-${currentStep}`).style.display = 'none';
                currentStep--;
                document.querySelector(`.tradein-step-${currentStep}`).style.display = 'block';
            }
        });
    });
    
    conditionCards.forEach(card => {
        card.addEventListener('click', function() {
            conditionCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
    
    function calculateTradeInValue() {
        const baseValue = 25000;
        const conditionSelected = document.querySelector('input[name="condition"]:checked');
        const mileage = document.getElementById('tradeinMileage')?.value || 50000;
        
        let conditionMultiplier = 1;
        if (conditionSelected) {
            const condition = conditionSelected.value;
            conditionMultiplier = condition === 'excellent' ? 1.0 : 
                                 condition === 'good' ? 0.85 : 
                                 condition === 'fair' ? 0.70 : 0.55;
        }
        
        const mileageMultiplier = Math.max(0.6, 1 - (mileage / 200000) * 0.4);
        
        const estimatedValue = Math.round(baseValue * conditionMultiplier * mileageMultiplier);
        const lowRange = Math.round(estimatedValue * 0.9);
        const highRange = Math.round(estimatedValue * 1.1);
        
        document.getElementById('tradeInValue').textContent = '$' + estimatedValue.toLocaleString();
        document.getElementById('tradeInRange').textContent = `$${lowRange.toLocaleString()} - $${highRange.toLocaleString()}`;
    }
}

// ===== 11. WISHLIST =====
function initWishlist() {
    const wishlistFAB = document.querySelector('.wishlist-fab');
    const wishlistSidebar = document.querySelector('.wishlist-sidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const removeButtons = document.querySelectorAll('.remove-wishlist');
    
    if (wishlistFAB) {
        wishlistFAB.addEventListener('click', () => {
            wishlistSidebar?.classList.toggle('active');
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar?.classList.remove('active');
        });
    }
    
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            item.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                item.remove();
                updateWishlistCount();
            }, 300);
        });
    });
    
    function updateWishlistCount() {
        const count = document.querySelectorAll('.wishlist-item').length;
        const badge = document.querySelector('.wishlist-count');
        if (badge) badge.textContent = count;
    }
}

// ===== 12. LIVE CHAT =====
function initLiveChat() {
    const chatBubble = document.querySelector('.chat-bubble');
    const chatWindow = document.querySelector('.chat-window');
    const minimizeBtn = document.querySelector('.minimize-chat');
    const closeBtn = document.querySelector('.close-chat');
    const sendBtn = document.querySelector('.chat-send');
    const chatInput = document.querySelector('.chat-input');
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatWindow?.classList.toggle('active');
            // Clear notification badge
            const badge = document.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            chatWindow?.classList.remove('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatWindow?.classList.remove('active');
        });
    }
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', () => sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    quickButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.textContent;
            addUserMessage(message);
            setTimeout(() => {
                addBotResponse(message);
            }, 1000);
        });
    });
    
    function sendMessage() {
        const input = document.querySelector('.chat-input');
        if (!input || !input.value.trim()) return;
        
        addUserMessage(input.value);
        input.value = '';
        
        setTimeout(() => {
            addBotResponse();
        }, 1500);
    }
    
    function addUserMessage(text) {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;
        
        const messageHTML = `
            <div class="message user-message" style="flex-direction: row-reverse; text-align: right;">
                <div class="message-content">
                    <p style="background: linear-gradient(135deg, #00AEEF, #00D9FF);">${text}</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function addBotResponse(quickAction) {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;
        
        let response = "Thanks for reaching out! How can I help you find your perfect car today?";
        
        if (quickAction) {
            if (quickAction.includes('Financing')) {
                response = "Great question! We offer flexible financing with rates starting at 2.9% APR. Would you like me to connect you with our financing team?";
            } else if (quickAction.includes('Trade-In')) {
                response = "We'd be happy to evaluate your trade-in! You can use our Trade-In Estimator above for an instant quote, or I can schedule an in-person appraisal.";
            } else if (quickAction.includes('Test Drive')) {
                response = "Awesome! I can help you schedule a test drive. Which vehicle are you interested in?";
            }
        }
        
        const messageHTML = `
            <div class="message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${response}</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// ===== 13. SOCIAL PROOF TICKER =====
function initSocialProofTicker() {
    const ticker = document.querySelector('.social-proof-ticker');
    if (!ticker) return;
    
    const notifications = [
        { icon: 'check-circle', text: '<strong>John D.</strong> just purchased a 2023 Tesla Model 3', time: '2 min ago' },
        { icon: 'heart', text: '<strong>Sarah M.</strong> saved 2024 BMW X5 to wishlist', time: '5 min ago' },
        { icon: 'star', text: '<strong>Mike R.</strong> left a 5-star review', time: '8 min ago' },
        { icon: 'car', text: '<strong>Emily K.</strong> scheduled a test drive', time: '12 min ago' },
        { icon: 'dollar-sign', text: '<strong>Alex P.</strong> got pre-approved for financing', time: '15 min ago' }
    ];
    
    let currentIndex = 0;
    
    function showNextNotification() {
        const notification = notifications[currentIndex];
        
        ticker.innerHTML = `
            <div class="ticker-item">
                <div class="ticker-icon">
                    <i class="fas fa-${notification.icon}"></i>
                </div>
                <div>
                    <p>${notification.text}</p>
                    <span class="ticker-time">${notification.time}</span>
                </div>
            </div>
        `;
        
        ticker.style.animation = 'none';
        setTimeout(() => {
            ticker.style.animation = 'slideInLeft 0.5s ease, fadeOut 0.5s ease 5s forwards';
        }, 10);
        
        currentIndex = (currentIndex + 1) % notifications.length;
    }
    
    // Show first notification immediately
    showNextNotification();
    
    // Rotate notifications every 6 seconds
    setInterval(showNextNotification, 6000);
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00AEEF, #00D9FF);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4);
        z-index: 100000;
        animation: slideInRight 0.4s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        to {
            transform: translateX(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
