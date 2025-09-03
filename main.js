// Main Application Controller
class App {
    constructor() {
        this.navigation = new Navigation();
        this.hero = new Hero();
        this.cursor = new CustomCursor();
        this.scrollController = new ScrollController();
        this.particleSystem = new ParticleSystem();
        this.sectionTransitions = new SectionTransitions();
        
        this.init();
    }
    
    init() {
        // Initialize all components
        document.addEventListener('DOMContentLoaded', () => {
            this.navigation.init();
            this.hero.init();
            this.cursor.init();
            this.scrollController.init();
            this.particleSystem.init();
            this.sectionTransitions.init();
            
            // Mark as loaded
            document.body.classList.add('loaded');
        });
        
        // Handle page visibility changes for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Handle resize events
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }
    
    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }
    
    handleResize() {
        const isMobile = window.innerWidth <= 968;
        
        // Optimize for mobile
        if (isMobile) {
            this.cursor.disable();
            this.particleSystem.reduce();
        } else {
            this.cursor.enable();
            this.particleSystem.restore();
        }
    }
}

// Enhanced Navigation Controller
class Navigation {
    constructor() {
        this.navToggle = null;
        this.navOverlay = null;
        this.navMenuLinks = null;
        this.navigation = null;
        this.isOpen = false;
        this.scrolled = false;
    }
    
    init() {
        this.navToggle = document.getElementById('navToggle');
        this.navOverlay = document.getElementById('navOverlay');
        this.navMenuLinks = document.querySelectorAll('.nav-menu-link');
        this.navigation = document.querySelector('.navigation');
        
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Toggle navigation
        this.navToggle.addEventListener('click', () => {
            this.toggleNavigation();
        });
        
        // Close navigation when clicking links
        this.navMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.closeNavigation();
                
                setTimeout(() => {
                    this.smoothScrollTo(target);
                }, 400);
            });
        });
        
        // Close navigation on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeNavigation();
            }
        });
        
        // Close navigation when clicking outside
        this.navOverlay.addEventListener('click', (e) => {
            if (e.target === this.navOverlay) {
                this.closeNavigation();
            }
        });
    }
    
    toggleNavigation() {
        if (this.isOpen) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }
    
    openNavigation() {
        this.isOpen = true;
        this.navToggle.classList.add('active');
        this.navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add staggered animation to menu items
        this.navMenuLinks.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.1 + 0.1}s`;
        });
    }
    
    closeNavigation() {
        this.isOpen = false;
        this.navToggle.classList.remove('active');
        this.navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset transition delays
        this.navMenuLinks.forEach(link => {
            link.style.transitionDelay = '0s';
        });
    }
    
    handleScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    const shouldBeScrolled = scrollTop > 50;
                    
                    if (shouldBeScrolled !== this.scrolled) {
                        this.scrolled = shouldBeScrolled;
                        this.navigation.classList.toggle('scrolled', this.scrolled);
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Enhanced Hero Section Controller
class Hero {
    constructor() {
        this.heroTitle = null;
        this.titleWords = null;
        this.geometricShapes = null;
        this.buttons = null;
    }
    
    init() {
        this.heroTitle = document.querySelector('.hero-title');
        this.titleWords = document.querySelectorAll('.title-word, .title-highlight');
        this.geometricShapes = document.querySelectorAll('.floating-shape');
        this.buttons = document.querySelectorAll('.btn');
        
        this.setupInteractions();
        this.handleParallax();
    }
    
    setupInteractions() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createRippleEffect(button);
            });
            
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e, button);
            });
        });
    }
    
    handleParallax() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const scrollSpeed = scrolled * 0.3;
                    
                    // Parallax effect for geometric shapes
                    this.geometricShapes.forEach((shape, index) => {
                        const speed = (index + 1) * 0.2;
                        const yPos = scrollSpeed * speed;
                        const rotation = scrolled * 0.1;
                        shape.style.transform += ` translateY(${yPos}px) rotate(${rotation}deg)`;
                    });
                    
                    // Fade out scroll indicator
                    const scrollIndicator = document.querySelector('.scroll-indicator');
                    if (scrollIndicator) {
                        const opacity = Math.max(0, 1 - scrolled / 400);
                        scrollIndicator.style.opacity = opacity;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Enhanced Custom Cursor Controller
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.cursorPos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.isEnabled = true;
    }
    
    init() {
        // Only initialize on desktop
        if (window.innerWidth <= 968) {
            this.disable();
            return;
        }
        
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.follower) return;
        
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursorPos.x = e.clientX;
            this.cursorPos.y = e.clientY;
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .floating-shape, .feature-item, .service-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.isEnabled) {
                    document.body.classList.add('cursor-hover');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (this.isEnabled) {
                    document.body.classList.remove('cursor-hover');
                }
            });
        });
    }
    
    animate() {
        if (!this.isEnabled) return;
        
        // Smooth cursor following with easing
        this.followerPos.x += (this.cursorPos.x - this.followerPos.x) * 0.15;
        this.followerPos.y += (this.cursorPos.y - this.followerPos.y) * 0.15;
        
        this.cursor.style.left = this.cursorPos.x + 'px';
        this.cursor.style.top = this.cursorPos.y + 'px';
        
        this.follower.style.left = this.followerPos.x + 'px';
        this.follower.style.top = this.followerPos.y + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
    
    disable() {
        this.isEnabled = false;
        if (this.cursor) this.cursor.style.display = 'none';
        if (this.follower) this.follower.style.display = 'none';
    }
    
    enable() {
        this.isEnabled = true;
        if (this.cursor) this.cursor.style.display = 'block';
        if (this.follower) this.follower.style.display = 'block';
        this.animate();
    }
}

// Enhanced Scroll Controller with Section Transitions
class ScrollController {
    constructor() {
        this.sections = null;
        this.currentSection = 0;
        this.isScrolling = false;
        this.observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -20% 0px'
        };
    }
    
    init() {
        this.sections = document.querySelectorAll('.section');
        this.setupIntersectionObserver();
        this.addSmoothScrolling();
        this.handleScrollProgress();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.triggerSectionAnimations(entry.target);
                    
                    // Update current section
                    const sectionIndex = Array.from(this.sections).indexOf(entry.target);
                    this.currentSection = sectionIndex;
                }
            });
        }, this.observerOptions);
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    triggerSectionAnimations(section) {
        // Animate section elements with staggered delays
        const animatedElements = section.querySelectorAll('.section-number, .section-title, .section-description, .feature-item, .service-card, .contact-item');
        
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1 + 0.2}s`;
            element.classList.add('animate-in');
        });
    }
    
    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    this.isScrolling = true;
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    setTimeout(() => {
                        this.isScrolling = false;
                    }, 1000);
                }
            });
        });
    }
    
    handleScrollProgress() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollProgress = scrollTop / documentHeight;
                    
                    // Update scroll-based animations
                    this.updateScrollAnimations(scrollProgress, scrollTop);
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateScrollAnimations(progress, scrollTop) {
        // Parallax effects for hero elements
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            const parallaxOffset = scrollTop * 0.5;
            heroVisual.style.transform = `translateY(${parallaxOffset}px)`;
        }
        
        // Update gradient orbs position
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.3;
            const yPos = scrollTop * speed;
            orb.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Section Transitions Controller
class SectionTransitions {
    constructor() {
        this.sections = null;
        this.transitionElements = null;
    }
    
    init() {
        this.sections = document.querySelectorAll('[data-section]');
        this.transitionElements = document.querySelectorAll('.section-transition');
        
        this.setupSectionObserver();
        this.createTransitionEffects();
    }
    
    setupSectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSection(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    animateSection(section) {
        const sectionType = section.dataset.section;
        
        // Trigger section-specific animations
        switch (sectionType) {
            case 'hero':
                this.animateHero(section);
                break;
            case 'about':
                this.animateAbout(section);
                break;
            case 'services':
                this.animateServices(section);
                break;
            case 'work':
                this.animateWork(section);
                break;
            case 'contact':
                this.animateContact(section);
                break;
        }
    }
    
    animateHero(section) {
        // Hero animations are handled by CSS
    }
    
    animateAbout(section) {
        const features = section.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    animateServices(section) {
        const services = section.querySelectorAll('.service-card');
        services.forEach((service, index) => {
            setTimeout(() => {
                service.style.opacity = '1';
                service.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    animateWork(section) {
        const workItems = section.querySelectorAll('.work-placeholder');
        workItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    animateContact(section) {
        const contactItems = section.querySelectorAll('.contact-item');
        contactItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    createTransitionEffects() {
        // Create smooth transitions between sections
        this.sections.forEach((section, index) => {
            if (index === 0) return; // Skip hero section
            
            const transition = section.querySelector('.section-transition');
            if (transition) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            transition.style.animation = 'scaleInX 1s ease-out forwards';
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(section);
            }
        });
    }
}

// Enhanced Particle System
class ParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.particleCount = 60;
        this.isReduced = false;
    }
    
    init() {
        this.container = document.getElementById('particleGrid');
        if (!this.container) return;
        
        this.createParticles();
        this.animateParticles();
    }
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and timing
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 25;
            const duration = 20 + Math.random() * 15;
            
            particle.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${0.3 + Math.random() * 0.4};
            `;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    animateParticles() {
        if (this.isReduced) return;
        
        // Add subtle movement to particles
        setInterval(() => {
            this.particles.forEach(particle => {
                const currentLeft = parseFloat(particle.style.left) || 0;
                const currentTop = parseFloat(particle.style.top) || 0;
                
                const newLeft = (currentLeft + 0.05) % 100;
                const newTop = (currentTop + Math.sin(Date.now() * 0.0005) * 0.02) % 100;
                
                particle.style.left = newLeft + '%';
                particle.style.top = newTop + '%';
            });
        }, 100);
    }
    
    reduce() {
        this.isReduced = true;
        this.particles.forEach(particle => {
            particle.style.display = 'none';
        });
    }
    
    restore() {
        this.isReduced = false;
        this.particles.forEach(particle => {
            particle.style.display = 'block';
        });
        this.animateParticles();
    }
}

// Add dynamic styles for animations
const dynamicStyles = `
    @keyframes ripple-expand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 120px;
            height: 120px;
            opacity: 0;
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .section.visible .section-content > * {
        animation-play-state: running;
    }
    
    /* Enhanced hover effects */
    .feature-item:hover,
    .service-card:hover {
        transform: translateY(-8px) scale(1.02);
    }
    
    /* Magnetic button effects */
    .btn:hover {
        transform: translateY(-4px) scale(1.05);
    }
    
    /* Smooth section transitions */
    .section {
        transition: all 1s cubic-bezier(0.77, 0, 0.175, 1);
    }
    
    /* Loading optimizations */
    .loading * {
        animation-play-state: paused;
    }
    
    .loaded * {
        animation-play-state: running;
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Initialize the application
new App();

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical resources
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.body.classList.remove('loading');
    }, 100);
});

// Add error handling for critical functions
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // Graceful degradation - ensure basic functionality still works
    document.body.classList.add('fallback-mode');
});

// Handle resize events for responsive behavior
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 968;
    
    // Update cursor visibility
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower) {
        if (isMobile) {
            cursor.style.display = 'none';
            follower.style.display = 'none';
        } else {
            cursor.style.display = 'block';
            follower.style.display = 'block';
        }
    }
});

// Optimize scroll performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    document.body.classList.add('scrolling');
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 150);
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Optimize touch interactions
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
}