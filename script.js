// ==================== CONFIGURATION ==================== 
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4N83mjil2KL9WqUD-T-lUi4ct5JfyEY3dncvkWpCYFgv4ir_V9sPTxKaa8DCNwGROrA/exec';

// ==================== DOM ELEMENTS ==================== 
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');

// ==================== INITIALIZE ==================== 
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initFormSubmission();
});

// ==================== FAQ ACCORDION ==================== 
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            item.classList.toggle('open');
        });
    });
}

// ==================== FORM SUBMISSION ==================== 
function initFormSubmission() {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages
        successMsg.classList.remove('show');
        errorMsg.classList.remove('show');

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        // Validate form
        if (!name || !email || !phone) {
            showError();
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        // Build URL with query parameters
        const url = APPS_SCRIPT_URL + '?' + new URLSearchParams({
            name: name,
            email: email,
            phone: phone
        });

        // Send fetch request
        fetch(url, {
            method: 'GET',
            mode: 'no-cors'
        })
        .then(() => showSuccess())
        .catch(() => showError())
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><span>→</span>';
        });
    });
}

// ==================== UTILITY FUNCTIONS ==================== 

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show success message
 */
function showSuccess() {
    successMsg.classList.add('show');
    form.reset();
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);

    // Scroll to success message
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show error message
 * @param {string} customMessage - Optional custom error message
 */
function showError(customMessage = null) {
    errorMsg.classList.add('show');
    
    if (customMessage) {
        errorMsg.textContent = '✗ ' + customMessage;
    }
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 5000);

    // Scroll to error message
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==================== SMOOTH SCROLL ==================== 

/**
 * Smooth scroll to section on link click
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's the form submit button
        if (href === '#' || this.closest('form')) return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== BUTTON ACTIONS ==================== 

/**
 * Smooth scroll to contact form when CTA buttons are clicked
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const text = this.textContent.toLowerCase();
        
        // Scroll to contact section on specific button clicks
        if (text.includes('start') || text.includes('contact') || text.includes('get in touch')) {
            if (this.textContent.includes('→')) {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    e.preventDefault();
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// ==================== FORM VALIDATION ON INPUT ==================== 

/**
 * Real-time form validation feedback
 */
if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value.trim().length < 2) {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (!isValidEmail(this.value.trim())) {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value.trim().length < 10) {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '';
            }
        });
    }
}

// ==================== ANALYTICS (Optional) ==================== 

/**
 * Track form interactions (optional)
 */
if (form) {
    form.addEventListener('focus', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // You can add analytics tracking here
            console.log('User focused on:', e.target.name);
        }
    }, true);
}

// ==================== ACCESSIBILITY ==================== 

/**
 * Keyboard navigation for FAQ accordion
 */
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// ==================== PERFORMANCE ==================== 

/**
 * Lazy load images (if any)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('✅ Script loaded successfully');
