// ===== Main JavaScript File =====
document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    initPreloader();
    
    // Navbar scroll effect
    initNavbarScroll();
    
    // Form handling
    initHeroForm();
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize counters (if any)
    initCounters();
});

// ===== Preloader =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('loadingProgress');
    
    if (!preloader) return;
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide preloader after delay
            setTimeout(() => {
                preloader.classList.add('fade-out');
                
                // Remove preloader from DOM after animation
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, 100);
    
    // Skip preloader on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !preloader.classList.contains('fade-out')) {
            clearInterval(interval);
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const header = document.querySelector('.header');
    const mainNav = document.querySelector('.main-nav');
    
    if (!header || !mainNav) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow on scroll
        if (scrollTop > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
        
        // Hide/show navbar on scroll direction
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
                header.style.transition = 'transform 0.3s ease';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
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
    
    window.addEventListener('scroll', updateActiveNavLink);
}

// ===== Hero Form Handling =====
function initHeroForm() {
    const form = document.getElementById('heroConsultationForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(form)) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                showNotification('Your consultation request has been submitted successfully! Our legal team will contact you within 24 hours.', 'success');
                
                // Reset form
                form.reset();
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Log form data (in production, send to backend)
                console.log('Form submitted:', formObject);
            }, 1500);
        }
    });
    
    // Form validation
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                markInvalid(input, 'This field is required');
                isValid = false;
            } else {
                markValid(input);
                
                // Email validation
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    markInvalid(input, 'Please enter a valid email address');
                    isValid = false;
                }
                
                // Phone validation
                if (input.type === 'tel' && !isValidPhone(input.value)) {
                    markInvalid(input, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const re = /^(\+?234|0)[789][01]\d{8}$/;
        const cleaned = phone.replace(/\D/g, '');
        return re.test(cleaned);
    }
    
    function markInvalid(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback mt-1';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function markValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        // Remove error message if exists
        const existingError = input.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Add CSS for validation states
    const style = document.createElement('style');
    style.textContent = `
        .is-invalid {
            border-color: #DC2626 !important;
        }
        .is-valid {
            border-color: #10B981 !important;
        }
        .invalid-feedback {
            color: #DC2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
    `;
    document.head.appendChild(style);
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Tooltips =====
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ===== Counters =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 30px;
                right: 30px;
                background-color: white;
                color: #1E293B;
                padding: 20px 25px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-left: 4px solid #1E3A8A;
            }
            .notification-success {
                border-left-color: #10B981;
            }
            .notification-content {
                display: flex;
                align-items: center;
                flex: 1;
                gap: 12px;
            }
            .notification-content i {
                font-size: 1.3rem;
            }
            .notification-success .notification-content i {
                color: #10B981;
            }
            .notification-close {
                background: none;
                border: none;
                color: #64748B;
                cursor: pointer;
                margin-left: 15px;
                font-size: 1rem;
                transition: color 0.3s ease;
                padding: 5px;
                border-radius: 4px;
            }
            .notification-close:hover {
                color: #1E293B;
                background-color: #F1F5F9;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode && notification.classList.contains('show')) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

// ===== Utility Functions =====
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== Export for Modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPreloader,
        initNavbarScroll,
        initHeroForm,
        showNotification
    };
}

// ===== About Section Animations =====
function initAboutAnimations() {
    // Initialize counters
    initCounters();
    
    // Scroll animations
    initScrollAnimations();
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('animated');
                    
                    // Trigger specific animation if specified
                    const animation = element.getAttribute('data-animation');
                    if (animation) {
                        element.classList.add(`animate__${animation}`);
                    }
                }, delay * 1000);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAboutAnimations();
    
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target;
            
            // Add formatting
            if (target >= 1000) {
                counter.innerText = target.toLocaleString();
            }
        }
    }
    
    // Animate counters when in viewport
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// ===== Team Section Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize team tabs
    initTeamTabs();
    
    // Initialize team member modals
    initTeamModals();
    
    // Initialize team member hover effects
    initTeamHoverEffects();
});

function initTeamTabs() {
    const teamTabs = document.querySelectorAll('#teamTabs .nav-link');
    
    teamTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            teamTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update URL hash
            const target = this.getAttribute('data-bs-target');
            history.pushState(null, null, target);
        });
    });
    
    // Show first tab content on page load
    const firstTab = document.querySelector('#teamTabs .nav-link.active');
    if (firstTab) {
        const target = firstTab.getAttribute('data-bs-target');
        showTabContent(target.replace('#', ''));
    }
}

function showTabContent(tabId) {
    const tabContents = document.querySelectorAll('.tab-pane');
    tabContents.forEach(content => {
        content.classList.remove('show', 'active');
        if (content.id === tabId) {
            content.classList.add('show', 'active');
        }
    });
}

function initTeamModals() {
    const teamCards = document.querySelectorAll('.team-card');
    const teamModal = new bootstrap.Modal(document.getElementById('teamModal'));
    
    teamCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger on button clicks
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            
            // Get team member data
            const teamName = this.querySelector('.team-name').textContent;
            const teamTitle = this.querySelector('.team-title').textContent;
            const teamBio = this.querySelector('.team-bio').textContent;
            const teamImage = this.querySelector('img').src;
            
            // Load modal content
            loadTeamModal(teamName, teamTitle, teamBio, teamImage);
            
            // Show modal
            teamModal.show();
        });
    });
}

function loadTeamModal(name, title, bio, image) {
    const modalBody = document.querySelector('#teamModal .modal-body');
    const modalTitle = document.querySelector('#teamModalLabel');
    
    modalTitle.textContent = name;
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${image}" alt="${name}" class="img-fluid rounded mb-3">
                <div class="contact-info">
                    <h6>Contact Information</h6>
                    <p><i class="fas fa-envelope me-2"></i> ${name.split(' ')[0].toLowerCase()}@serenitylegal.com</p>
                    <p><i class="fas fa-phone me-2"></i> 0806 829 6028 (Ext. ${Math.floor(Math.random() * 10) + 1})</p>
                </div>
            </div>
            <div class="col-md-8">
                <h4>${name}</h4>
                <p class="text-primary">${title}</p>
                <p>${bio}</p>
                
                <h6 class="mt-4">Areas of Expertise</h6>
                <div class="expertise-list mb-4">
                    <span class="badge bg-primary me-2 mb-2">Alternative Dispute Resolution</span>
                    <span class="badge bg-primary me-2 mb-2">Energy Law</span>
                    <span class="badge bg-primary me-2 mb-2">Corporate Governance</span>
                </div>
                
                <h6>Education</h6>
                <ul class="list-unstyled">
                    <li><i class="fas fa-graduation-cap me-2"></i> LL.B (Hons) - University of Lagos</li>
                    <li><i class="fas fa-graduation-cap me-2"></i> B.L - Nigerian Law School</li>
                    <li><i class="fas fa-graduation-cap me-2"></i> LL.M - University of Port Harcourt</li>
                </ul>
                
                <h6 class="mt-4">Professional Memberships</h6>
                <p>Nigerian Bar Association, International Bar Association, Chartered Institute of Arbitrators</p>
            </div>
        </div>
    `;
}

function initTeamHoverEffects() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTeamTabs,
        initTeamModals
    };
}

// ===== Footer Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in copyright
    setCurrentYear();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Initialize emergency banner click tracking
    initEmergencyTracking();
});

function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const consentCheckbox = this.querySelector('#newsletterConsent');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Validate email and consent
        if (!isValidEmail(emailInput.value)) {
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        if (!consentCheckbox.checked) {
            showNewsletterMessage('Please agree to receive emails.', 'error');
            return;
        }
        
        // Show loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showNewsletterMessage('Thank you for subscribing to our newsletter!', 'success');
            
            // Reset form
            newsletterForm.reset();
            
            // Restore button
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            
            // Track subscription
            trackNewsletterSubscription(emailInput.value);
        }, 1500);
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNewsletterMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message newsletter-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('newsletter-message-styles')) {
        const style = document.createElement('style');
        style.id = 'newsletter-message-styles';
        style.textContent = `
            .newsletter-message {
                margin-top: 15px;
                padding: 12px 15px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.9rem;
                animation: slideIn 0.3s ease;
            }
            
            .newsletter-success {
                background-color: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.2);
                color: #10b981;
            }
            
            .newsletter-error {
                background-color: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to form
    const form = document.querySelector('.newsletter-form');
    form.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            messageDiv.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

function trackNewsletterSubscription(email) {
    // In production, this would send to your analytics/backend
    console.log('Newsletter subscription:', email);
    
    // Example: Send to Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'newsletter_subscription', {
            'event_category': 'Engagement',
            'event_label': 'Footer Newsletter'
        });
    }
}

function initEmergencyTracking() {
    const emergencyBtn = document.querySelector('.btn-danger');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            // Track emergency call click
            console.log('Emergency call clicked from footer');
            
            // In production, send to analytics
            if (typeof gtag === 'function') {
                gtag('event', 'emergency_call', {
                    'event_category': 'Contact',
                    'event_label': 'Footer Emergency Banner'
                });
            }
        });
    }
}

// Social link tracking
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className.split(' ')[1].replace('fa-', '');
        
        // Track social click
        console.log(`Social media click: ${platform}`);
        
        // In production, this would redirect to actual social media
        // For demo, show a message
        showNotification(`In a live website, this would link to our ${platform} page.`, 'info');
    });
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBackToTop,
        initNewsletterForm,
        setCurrentYear
    };
}