// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Add animation class for smooth transition
    body.classList.add('theme-transitioning');
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 300);
});

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Hide all content sections
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Show corresponding content section
        const targetSection = item.getAttribute('data-section');
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    });
});

// Typewriter Effect
class Typewriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before starting next word
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize Typewriter
const typewriterElement = document.querySelector('.typewriter-text');
if (typewriterElement) {
    const typewriterTexts = [
        'a Web Developer',
        'an Appication Developer', 
        'an Ethical Hacker',
        'a Content Creator'
        
    ];
    
    new Typewriter(typewriterElement, typewriterTexts, 100);
}

// Skill Bars Animation
function animateSkillBars() {
    skillBars.forEach(bar => {
        const percent = bar.getAttribute('data-percent');
        bar.style.width = percent + '%';
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate skill bars when skills section is visible
            if (entry.target.id === 'skills') {
                setTimeout(animateSkillBars, 300);
            }
        }
    });
}, observerOptions);

// Observe all sections for animation
contentSections.forEach(section => {
    observer.observe(section);
});

// Initialize EmailJS
(function() {
    emailjs.init("49_wDNmwYYci3Q9rx"); // Replace with your EmailJS public key
})();

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('user_name');
        const email = formData.get('user_email');
        const message = formData.get('user_message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
                 // EmailJS template parameters - try multiple variable formats
         const templateParams = {
             from_name: name,
             from_email: email,
             message: message,
             to_name: 'Nakul',
             // Alternative variable names that EmailJS might use
             name: name,
             email: email,
             user_name: name,
             user_email: email,
             user_message: message
         };
        
                 console.log('Sending email with params:', templateParams);
         console.log('Service ID: service_jtfgocb');
         console.log('Template ID: template_wle4ijb');
         console.log('Template variables used: from_name, from_email, message, to_name');
         console.log('Name value:', name);
         console.log('Email value:', email);
         console.log('Message value:', message);
         
         // Send email using EmailJS
         emailjs.send('service_jtfgocb', 'template_wle4ijb', templateParams)
             .then(function(response) {
                 console.log('SUCCESS!', response.status, response.text);
                 showNotification('Message sent successfully!', 'success');
                 contactForm.reset();
                 submitBtn.innerHTML = originalText;
                 submitBtn.disabled = false;
             }, function(error) {
                 console.log('FAILED...', error);
                 showNotification('Failed to send message. Please try again.', 'error');
                 submitBtn.innerHTML = originalText;
                 submitBtn.disabled = false;
             });
    });
}

// CV Download Function
function downloadCV() {
    // Show loading state
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
    btn.disabled = true;
    
    // Open the NakulResume.pdf file in a new tab
    window.open('NakulResume.pdf', '_blank');
    
    // Show success message
    setTimeout(() => {
        showNotification('Resume opened in new tab!', 'success');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
}



// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .theme-transitioning * {
        transition: none !important;
    }
    
    .content-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .content-section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-progress {
        width: 0 !important;
    }
    
    .timeline-item {
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .timeline-item.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    .contact-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .contact-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // CV Download functionality
    const downloadCVBtn = document.querySelector('.btn-primary');
    if (downloadCVBtn && downloadCVBtn.textContent.includes('Download CV')) {
        downloadCVBtn.addEventListener('click', downloadCV);
    }
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .timeline-item, .contact-item');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        elementObserver.observe(el);
    });
    
    // Show intro section by default
    const introSection = document.getElementById('intro');
    if (introSection) {
        introSection.classList.add('active');
    }
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Footer Social Links Enhancement
    const socialLinks = document.querySelectorAll('.social-link, .sidebar-social-link');
    
    socialLinks.forEach(link => {
        // Add ripple effect on click
        link.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = link.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add floating animation on hover
        link.addEventListener('mouseenter', () => {
            link.style.animation = 'socialFloat 0.6s ease-in-out';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.animation = '';
        });
    });
    
    // Add CSS for ripple and floating animations
    const footerStyles = document.createElement('style');
    footerStyles.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes socialFloat {
            0%, 100% { transform: translateY(-5px) scale(1.1); }
            50% { transform: translateY(-8px) scale(1.15); }
        }
        
        .footer-links a {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .footer-links a:hover {
            transform: translateX(5px);
        }
        
        .social-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .social-link:active {
            transform: scale(0.95);
        }
    `;
    
    document.head.appendChild(footerStyles);
    
    // 3D Background Interactive Effects
    init3DBackground();
    
    // Mobile Navigation
    initMobileNavigation();
});



// Mobile Navigation
function initMobileNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Function to update active states
    function updateActiveStates(targetSection) {
        // Update sidebar nav items
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === targetSection) {
                item.classList.add('active');
            }
        });
        
        // Update content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });
    }
    
    // Sidebar nav item click handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');
            updateActiveStates(targetSection);
            
            // Smooth scroll to section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Footer quick links
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetSection = href.substring(1); // Remove the #
            
            if (targetSection) {
                updateActiveStates(targetSection);
                
                // Smooth scroll to section
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Scroll spy to update active states based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        contentSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const sectionId = section.id;
                updateActiveStates(sectionId);
            }
        });
    });
}

// 3D Background Interactive Effects
function init3DBackground() {
    const background = document.querySelector('.background-3d');
    const particles = document.querySelectorAll('.particle');
    const shapes = document.querySelectorAll('.shape');
    
    // Mouse movement effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Parallax effect for shapes
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            shape.style.transform += ` translate(${x}px, ${y}px)`;
        });
        
        // Subtle grid movement
        const gridLines = document.querySelector('.grid-lines');
        if (gridLines) {
            const gridX = (mouseX - 0.5) * 10;
            const gridY = (mouseY - 0.5) * 10;
            gridLines.style.transform = `translate(${gridX}px, ${gridY}px)`;
        }
    });
    
    // Particle interaction
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(3)';
            particle.style.opacity = '1';
            particle.style.boxShadow = '0 0 20px var(--accent-color)';
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = 'scale(1)';
            particle.style.opacity = '0.6';
            particle.style.boxShadow = 'none';
        });
    });
    
    // Shape interaction
    shapes.forEach(shape => {
        shape.addEventListener('mouseenter', () => {
            shape.style.opacity = '0.4';
            shape.style.transform += ' scale(1.2)';
        });
        
        shape.addEventListener('mouseleave', () => {
            shape.style.opacity = '0.1';
            shape.style.transform = shape.style.transform.replace(' scale(1.2)', '');
        });
    });
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        background.style.transform = `translateY(${rate}px)`;
    });
}

// Mobile/Tablet Sidebar Toggle
const menuToggleBtn = document.getElementById('menuToggleBtn');
const sidebar = document.querySelector('.sidebar');
let sidebarOverlay = document.querySelector('.sidebar-overlay');

function closeSidebar() {
    sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

function openSidebar() {
    sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
}

if (!sidebarOverlay) {
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
}

if (menuToggleBtn && sidebar) {
    menuToggleBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}
// Close sidebar when a nav link is clicked (on mobile/tablet)
document.querySelectorAll('.sidebar .nav-item a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            closeSidebar();
        }
    });
});
