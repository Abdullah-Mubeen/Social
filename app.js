// Smooth scrolling with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced header scroll effect
let lastScrollY = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Add shadow and background opacity based on scroll
    if (currentScrollY > 20) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }

    // Hide/show header on scroll (optional)
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add staggered animation delays
            const elements = entry.target.querySelectorAll('.service-card, .testimonial, .pricing-card');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // For single elements
            if (elements.length === 0) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// Observe sections and cards

// Initialize hero animations immediately
document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

// Add loading class to body to trigger initial animations
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.querySelector('.mobile-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-toggle';
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            toggle.style.cssText = `
                        background: none;
                        border: none;
                        font-size: 20px;
                        color: var(--text-primary);
                        cursor: pointer;
                        padding: 8px;
                    `;
            document.querySelector('.nav').appendChild(toggle);
        }
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();


// Smooth Slider Functionality
let currentSlide = 0;
const totalSlides = 6;
const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.dot');

function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveSlide(direction) {
    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Auto-play slider (optional)
let autoPlayInterval = setInterval(() => {
    moveSlide(1);
}, 6000);

// Pause auto-play on hover
const sliderWrapper = document.querySelector('.slider-wrapper');
sliderWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

sliderWrapper.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 6000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
});

window.addEventListener('DOMContentLoaded', (event) => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial state for all headings and accents
    gsap.set(".scroll-anim-heading", {
        opacity: 0,
        y: 100,
        rotateX: 30,
        scale: 0.9
    });

    gsap.set(".scroll-anim-accent", {
        opacity: 0,
        y: 20,
        scale: 0.8
    });

    // Create animations for each section
    gsap.utils.toArray('.scroll-anim-section').forEach((section, index) => {
        const heading = section.querySelector('.scroll-anim-heading');
        const accents = section.querySelectorAll('.scroll-anim-accent');

        // Timeline for each section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top center+=100",
                end: "center center",
                toggleActions: "play none none reverse",
                markers: false,
                scrub: 1,
                snap: {
                    snapTo: "labels",
                    duration: { min: 0.2, max: 0.5 },
                    delay: 0.1,
                    ease: "power1.inOut"
                }
            }
        });

        // Add labels for snap points
        tl.addLabel('start')
            .to(heading, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                duration: 1.5,
                ease: "expo.out"
            })
            .to(accents, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=1")
            .addLabel('end');

        // Add parallax effect
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: (i, target) => -50 * (i + 1),
            ease: "none"
        });
    });

    // Add a smooth scroll effect for the entire page
    gsap.to("body", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 3
        },
        ease: "power1.inOut"
    });
});
// Ultra-lightweight scroll controller
class ScrollManager {
    constructor() {
        this.sections = document.querySelectorAll('.challenge-viewport');
        this.progressLine = document.querySelector('.progress-line');
        this.counter = document.querySelector('.progress-counter');
        this.currentSection = 0;
        this.init();
    }

    init() {
        this.updateOnScroll();
        this.sections[0]?.querySelector('.challenge-content')?.classList.add('active');
    }

    updateOnScroll() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateProgress();
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateProgress() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrolled / maxScroll * 100, 100);

        if (this.progressLine) {
            this.progressLine.style.height = `${progress}%`;
        }
    }

    updateActiveSection() {
        const scrollPos = window.pageYOffset + window.innerHeight * 0.5;

        this.sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.pageYOffset;
            const sectionBottom = sectionTop + rect.height;

            const content = section.querySelector('.challenge-content');

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                if (index !== this.currentSection) {
                    this.currentSection = index;
                    if (this.counter) {
                        this.counter.textContent = String(index + 1).padStart(2, '0');
                    }
                }
                content?.classList.add('active');
            } else {
                content?.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ScrollManager());
} else {
    new ScrollManager();
}

// Optimize performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
