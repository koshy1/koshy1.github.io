// Bethel Community Website - Enhanced Interactive Features
// Navigation, forms, performance optimizations, and accessibility

document.addEventListener('DOMContentLoaded', function() {
    // Application state
    let currentOpenDropdown = null;
    let currentOpenMobileDropdown = null;
    let isScrolling = false;
    let scrollTimeout = null;
    let lazyImages = [];

    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initFormHandling();
    initLazyLoading();
    initScrollToTop();
    initAnimationObserver();
    initPerformanceOptimizations();
    initZoomIntegration();

    // =========================================================================
    // NAVIGATION SYSTEM
    // =========================================================================

    function initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (hamburger && mobileMenu) {
            // Enhanced mobile menu toggle with animations
            hamburger.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Prevent body scroll when menu is open
                if (!isExpanded) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
                
                // Toggle mobile menu with animation
                mobileMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                
                // Update ARIA attributes
                this.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.setAttribute('aria-hidden', isExpanded);
                
                // Focus management with delay for animation
                if (!isExpanded) {
                    setTimeout(() => {
                        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
                        if (firstLink) firstLink.focus();
                    }, 150);
                }
            });
        }

        initDesktopDropdowns();
        initMobileDropdowns();
        initClickOutside();
        initEscapeHandling();
        initActiveSection();
    }

    function initDesktopDropdowns() {
        const dropdownLinks = document.querySelectorAll('.nav-link[aria-haspopup="true"]');
        
        dropdownLinks.forEach(link => {
            const dropdown = document.getElementById(link.getAttribute('aria-controls'));
            const dropdownItems = dropdown ? dropdown.querySelectorAll('a') : [];
            
            // Mouse events with debouncing
            let mouseEnterTimeout, mouseLeaveTimeout;
            
            link.parentElement.addEventListener('mouseenter', () => {
                clearTimeout(mouseLeaveTimeout);
                mouseEnterTimeout = setTimeout(() => openDropdown(link, dropdown), 100);
            });
            
            link.parentElement.addEventListener('mouseleave', () => {
                clearTimeout(mouseEnterTimeout);
                mouseLeaveTimeout = setTimeout(() => closeDropdown(link, dropdown), 200);
            });
            
            // Keyboard events
            link.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'Enter':
                    case ' ':
                    case 'ArrowDown':
                        e.preventDefault();
                        openDropdown(link, dropdown);
                        if (dropdownItems.length > 0) {
                            dropdownItems[0].focus();
                        }
                        break;
                    case 'Escape':
                        closeDropdown(link, dropdown);
                        link.focus();
                        break;
                }
            });
            
            // Dropdown item keyboard navigation
            dropdownItems.forEach((item, index) => {
                item.addEventListener('keydown', function(e) {
                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextItem = dropdownItems[index + 1] || dropdownItems[0];
                            nextItem.focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            const prevItem = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
                            prevItem.focus();
                            break;
                        case 'Escape':
                            e.preventDefault();
                            closeDropdown(link, dropdown);
                            link.focus();
                            break;
                        case 'Tab':
                            if (e.shiftKey && index === 0) {
                                closeDropdown(link, dropdown);
                            } else if (!e.shiftKey && index === dropdownItems.length - 1) {
                                closeDropdown(link, dropdown);
                            }
                            break;
                    }
                });
            });
        });
    }

    function initMobileDropdowns() {
        const mobileDropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const dropdown = document.getElementById(this.getAttribute('aria-controls'));
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close other open dropdowns
                if (currentOpenMobileDropdown && currentOpenMobileDropdown !== dropdown) {
                    currentOpenMobileDropdown.classList.remove('active');
                    currentOpenMobileDropdown.setAttribute('aria-hidden', 'true');
                    const prevToggle = document.querySelector(`[aria-controls="${currentOpenMobileDropdown.id}"]`);
                    if (prevToggle) {
                        prevToggle.setAttribute('aria-expanded', 'false');
                        prevToggle.classList.remove('active');
                    }
                }
                
                // Toggle current dropdown with animation
                dropdown.classList.toggle('active');
                this.classList.toggle('active');
                this.setAttribute('aria-expanded', !isExpanded);
                dropdown.setAttribute('aria-hidden', isExpanded);
                
                currentOpenMobileDropdown = isExpanded ? null : dropdown;
            });
        });
    }

    function initClickOutside() {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item') && currentOpenDropdown) {
                const link = currentOpenDropdown.previousElementSibling;
                closeDropdown(link, currentOpenDropdown);
            }
            
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger')) {
                closeMobileMenu();
            }
        });
    }

    function initEscapeHandling() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (document.querySelector('.mobile-menu.active')) {
                    closeMobileMenu();
                    document.querySelector('.hamburger').focus();
                }
            }
        });
    }

    function initActiveSection() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]');
        
        if (sections.length > 0 && navLinks.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"], .mobile-nav-link[href="#${entry.target.id}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-20% 0px -70% 0px'
            });
            
            sections.forEach(section => observer.observe(section));
        }
    }

    // =========================================================================
    // SMOOTH SCROLLING SYSTEM
    // =========================================================================

    function initSmoothScrolling() {
        // Handle all anchor links with smooth scrolling and header offset
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra padding
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Smooth scroll with easing
                smoothScrollTo(targetPosition, 800);
                
                // Update focus for accessibility
                setTimeout(() => {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
                }, 850);
            }
        });
    }

    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // =========================================================================
    // FORM HANDLING SYSTEM
    // =========================================================================

    function initFormHandling() {
        // Newsletter form with enhanced validation
        const newsletterForms = document.querySelectorAll('#newsletterForm');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', handleNewsletterSubmission);
        });

        // Connection form handling
        const connectionForm = document.getElementById('connectionForm');
        if (connectionForm) {
            connectionForm.addEventListener('submit', handleConnectionForm);
        }

        // Real-time form validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', validateEmail);
            input.addEventListener('input', debounce(validateEmail, 500));
        });
    }

    function handleNewsletterSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!validateEmailField(emailInput)) {
            showFormMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual newsletter service)
        setTimeout(() => {
            showFormMessage(form, 'Thank you for subscribing! Check your email for confirmation.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    function handleConnectionForm(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required.');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        if (!isValid) return;

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            showFormMessage(form, 'Thank you for reaching out! We will contact you soon.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    function validateEmail(e) {
        const input = e.target;
        validateEmailField(input);
    }

    function validateEmailField(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        
        if (input.value && !isValid) {
            showFieldError(input, 'Please enter a valid email address.');
            return false;
        } else {
            clearFieldError(input);
            return true;
        }
    }

    function showFormMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
        
        form.appendChild(messageEl);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => messageEl.remove(), 5000);
        }
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.setAttribute('role', 'alert');
        
        field.parentNode.appendChild(errorEl);
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.id + '-error');
        errorEl.id = field.id + '-error';
    }

    function clearFieldError(field) {
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) errorEl.remove();
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    // =========================================================================
    // LAZY LOADING SYSTEM
    // =========================================================================

    function initLazyLoading() {
        lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(loadImage);
        }
    }

    function loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    }

    // =========================================================================
    // SCROLL TO TOP FUNCTIONALITY
    // =========================================================================

    function initScrollToTop() {
        // Create scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '<span aria-hidden="true">↑</span>';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top of page');
        scrollTopBtn.style.display = 'none';
        document.body.appendChild(scrollTopBtn);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', debounce(() => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'block';
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
                setTimeout(() => {
                    if (!scrollTopBtn.classList.contains('visible')) {
                        scrollTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        }, 100));

        // Handle click
        scrollTopBtn.addEventListener('click', () => {
            smoothScrollTo(0, 600);
        });
    }

    // =========================================================================
    // ANIMATION OBSERVER
    // =========================================================================

    function initAnimationObserver() {
        const animatedElements = document.querySelectorAll('.mission-item, .gathering-option, .value-card, .impact-item');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 100);
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }

    // =========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // =========================================================================

    function initPerformanceOptimizations() {
        // Preload critical resources
        preloadCriticalResources();
        
        // Optimize scroll performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        });

        function updateScrollState() {
            // Update scroll-dependent elements efficiently
            const scrolled = window.pageYOffset;
            const header = document.querySelector('header');
            
            if (scrolled > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            ticking = false;
        }
    }

    function preloadCriticalResources() {
        // Preload fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];
        
        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // =========================================================================
    // ZOOM INTEGRATION
    // =========================================================================

    function initZoomIntegration() {
        // Add Zoom meeting integration hooks
        const zoomButtons = document.querySelectorAll('[data-zoom-meeting]');
        
        zoomButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const meetingId = button.getAttribute('data-zoom-meeting');
                const meetingPassword = button.getAttribute('data-zoom-password');
                
                // Check if it's Sunday to determine if meeting is available
                const today = new Date();
                const isSunday = today.getDay() === 0;
                const currentHour = today.getHours();
                
                if (isSunday && currentHour >= 9 && currentHour < 12) {
                    // Meeting is live - show join options
                    showZoomJoinModal(meetingId, meetingPassword);
                } else {
                    // Meeting not available - show info
                    showMeetingInfoModal();
                }
            });
        });
    }

    function showZoomJoinModal(meetingId, password) {
        const modal = createModal(`
            <h3>Join Sunday Worship</h3>
            <p>Our Sunday worship service is starting soon!</p>
            <div class="zoom-options">
                <a href="https://us02web.zoom.us/j/${meetingId}?pwd=${password}" class="btn btn-primary" target="_blank">
                    Join via Web Browser
                </a>
                <p class="zoom-details">
                    <strong>Meeting ID:</strong> ${meetingId}<br>
                    <strong>Password:</strong> ${password}
                </p>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    function showMeetingInfoModal() {
        const modal = createModal(`
            <h3>Worship Schedule</h3>
            <p>Our Sunday worship service is at 10:00 AM:</p>
            <ul>
                <li><strong>In-Person:</strong> 2nd and 4th Sundays</li>
                <li><strong>Online via Zoom:</strong> 1st, 3rd, and 5th Sundays</li>
            </ul>
            <p>For Zoom meeting details, please contact us at <a href="mailto:info@bethelcommunitySL.org">info@bethelcommunitySL.org</a></p>
            <a href="pages/contact.html" class="btn btn-secondary">Contact Us</a>
        `);
        
        document.body.appendChild(modal);
    }

    function createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal" role="dialog" aria-labelledby="modal-title">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        // Close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
        
        return modal;
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

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

    function openDropdown(link, dropdown) {
        if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
            const prevLink = currentOpenDropdown.previousElementSibling;
            closeDropdown(prevLink, currentOpenDropdown);
        }
        
        if (dropdown) {
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
            link.setAttribute('aria-expanded', 'true');
            currentOpenDropdown = dropdown;
        }
    }
    
    function closeDropdown(link, dropdown) {
        if (dropdown) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
            link.setAttribute('aria-expanded', 'false');
            currentOpenDropdown = null;
        }
    }
    
    function closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenu && hamburger) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Close any open mobile dropdowns
            if (currentOpenMobileDropdown) {
                currentOpenMobileDropdown.classList.remove('active');
                currentOpenMobileDropdown.setAttribute('aria-hidden', 'true');
                const toggle = document.querySelector(`[aria-controls="${currentOpenMobileDropdown.id}"]`);
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.classList.remove('active');
                }
                currentOpenMobileDropdown = null;
            }
        }
    }
});