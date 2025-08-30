// Bethel Community Website JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    initMobileNavigation();
    initDesktopNavigation();
    initAnnouncementBar();
    initSmoothScrolling();
    initFormSubmissions();
    initHeaderScroll();
    initImageLazyLoading();
    initSidebarNavigation();
}

// Mobile Navigation
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburgerBars = document.querySelectorAll('.mobile-nav-toggle .top-bar, .mobile-nav-toggle .middle-bar, .mobile-nav-toggle .bottom-bar');
    
    if (!mobileToggle || !mobileNav) return;
    
    mobileToggle.addEventListener('click', function() {
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });
    
    function openMobileNav() {
        mobileNav.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        
        // Animate hamburger bars
        if (hamburgerBars.length >= 3) {
            hamburgerBars[0].style.transform = 'translateY(7px) rotate(45deg)';
            hamburgerBars[1].style.opacity = '0';
            hamburgerBars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileNav() {
        mobileNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger bars
        if (hamburgerBars.length >= 3) {
            hamburgerBars[0].style.transform = '';
            hamburgerBars[1].style.opacity = '';
            hamburgerBars[2].style.transform = '';
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Close mobile nav when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileNav.contains(event.target) && !mobileToggle.contains(event.target)) {
            closeMobileNav();
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

// Desktop Navigation (Dropdown Menus)
function initDesktopNavigation() {
    const folders = document.querySelectorAll('.folder');
    
    folders.forEach(folder => {
        const toggle = folder.querySelector('.folder-toggle');
        const subnav = folder.querySelector('.subnav');
        
        if (!toggle || !subnav) return;
        
        // Handle click events for folder toggles (mobile only)
        toggle.addEventListener('click', function(event) {
            // Only handle clicks on mobile
            if (window.innerWidth <= 640) {
                event.preventDefault();
                
                // Close other open folders
                folders.forEach(otherFolder => {
                    if (otherFolder !== folder) {
                        const otherToggle = otherFolder.querySelector('.folder-toggle');
                        const otherSubnav = otherFolder.querySelector('.subnav');
                        if (otherToggle && otherSubnav) {
                            otherToggle.classList.remove('active');
                            otherSubnav.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current folder
                const isActive = toggle.classList.contains('active');
                toggle.classList.toggle('active');
                subnav.classList.toggle('active', !isActive);
            }
        });
        
        // Handle keyboard navigation
        toggle.addEventListener('keydown', function(event) {
            if ((event.key === 'Enter' || event.key === ' ') && window.innerWidth <= 640) {
                event.preventDefault();
                this.click();
            }
        });
    });
    
    // Close mobile dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.folder') && window.innerWidth <= 640) {
            folders.forEach(folder => {
                const toggle = folder.querySelector('.folder-toggle');
                const subnav = folder.querySelector('.subnav');
                if (toggle && subnav) {
                    toggle.classList.remove('active');
                    subnav.classList.remove('active');
                }
            });
        }
    });
    
    // Handle window resize to clean up mobile states
    window.addEventListener('resize', function() {
        if (window.innerWidth > 640) {
            folders.forEach(folder => {
                const toggle = folder.querySelector('.folder-toggle');
                const subnav = folder.querySelector('.subnav');
                if (toggle && subnav) {
                    toggle.classList.remove('active');
                    subnav.classList.remove('active');
                }
            });
        }
    });
}

// Announcement Bar
function initAnnouncementBar() {
    const announcementBar = document.querySelector('.announcement-bar');
    const closeButton = document.querySelector('.announcement-bar-close');
    const announcementUrl = document.querySelector('.announcement-bar-url');
    
    if (!announcementBar || !closeButton) return;
    
    // Check if announcement was previously closed
    const isAnnouncementClosed = localStorage.getItem('announcementClosed');
    if (isAnnouncementClosed) {
        announcementBar.style.display = 'none';
        return;
    }
    
    closeButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        announcementBar.style.display = 'none';
        localStorage.setItem('announcementClosed', 'true');
    });
    
    // Handle announcement bar link click
    if (announcementUrl) {
        announcementUrl.addEventListener('click', function(event) {
            if (event.target === closeButton) {
                event.preventDefault();
                return;
            }
            // The href is already set in the HTML
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Submissions
function initFormSubmissions() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
            }, 1500);
        });
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('#header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let isScrollingDown = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow on scroll
        if (scrollTop > 10) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Hide/show header on scroll (optional - uncomment if desired)
        /*
        isScrollingDown = scrollTop > lastScrollTop;
        
        if (isScrollingDown && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        */
    }, { passive: true });
}

// Image Lazy Loading (for older browsers without native support)
function initImageLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        return;
    }
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Dropdown Menu Functionality (for desktop)
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        // Handle keyboard navigation
        toggle.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDropdown(dropdown);
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                closeDropdown(dropdown);
            }
        });
    });
}

function toggleDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    const isOpen = menu.style.opacity === '1';
    
    if (isOpen) {
        closeDropdown(dropdown);
    } else {
        openDropdown(dropdown);
    }
}

function openDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menu.style.transform = 'translateY(0)';
}

function closeDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
}

// Intersection Observer for Animations (optional)
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.value-card, .gathering-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initDropdownMenus();
    // Uncomment to enable scroll animations
    // initScrollAnimations();
});

// Handle resize events
window.addEventListener('resize', function() {
    // Close mobile nav on resize to prevent display issues
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Service Worker Registration (optional - for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to register service worker
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
        */
    });
}

// Sidebar Navigation (Our Story page)
function initSidebarNavigation() {
    const sidebarToggle = document.querySelector('.sidebar-nav-toggle');
    const sidebar = document.querySelector('.sidebar-nav');
    
    if (!sidebarToggle || !sidebar) return;
    
    sidebarToggle.addEventListener('click', function() {
        const isExpanded = sidebar.classList.contains('expanded');
        
        if (isExpanded) {
            sidebar.classList.remove('expanded');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        } else {
            sidebar.classList.add('expanded');
            sidebarToggle.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Handle keyboard navigation
    sidebarToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    });
    
    // Close sidebar when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 640) {
            sidebar.classList.remove('expanded');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        }
    });
}