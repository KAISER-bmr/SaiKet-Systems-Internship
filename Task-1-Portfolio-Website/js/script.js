// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu after clicking a link
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = {};

        // Get all form inputs
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        // Hide all error messages first
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(function(msg) {
            msg.classList.add('hidden');
        });

        // Remove error borders
        const inputs = [nameInput, emailInput, subjectInput, messageInput];
        inputs.forEach(function(input) {
            input.classList.remove('border-red-500');
        });

        // Validate Name
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            formData.name = nameInput.value.trim();
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            formData.email = emailInput.value.trim();
        }

        // Validate Subject
        if (subjectInput.value.trim() === '') {
            showError(subjectInput, 'Please enter a subject');
            isValid = false;
        } else if (subjectInput.value.trim().length < 3) {
            showError(subjectInput, 'Subject must be at least 3 characters');
            isValid = false;
        } else {
            formData.subject = subjectInput.value.trim();
        }

        // Validate Message
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Please enter a message');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            formData.message = messageInput.value.trim();
        }

        // If all validations pass
        if (isValid) {
            // Log form data to console (in real app, this would be sent to a server)
            console.log('Form Data Submitted:', formData);
            
            // Show success message
            successMessage.classList.remove('hidden');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                successMessage.classList.add('hidden');
            }, 5000);

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // Function to show error message
    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        input.classList.add('border-red-500');
        
        // Remove error when user starts typing
        input.addEventListener('input', function clearError() {
            errorElement.classList.add('hidden');
            input.classList.remove('border-red-500');
            input.removeEventListener('input', clearError);
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        observer.observe(section);
    });

    // Active Navigation Link Highlighting
    const sections2 = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections2.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('text-purple-600', 'font-bold');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-purple-600', 'font-bold');
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });

    // Project card click handlers (placeholder functionality)
    const projectButtons = document.querySelectorAll('.project-card button');
    
    projectButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            alert('Project details coming soon! This is a placeholder for now.');
        });
    });

    console.log('Portfolio website loaded successfully! 🚀');
});