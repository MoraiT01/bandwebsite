// Main JavaScript for Smokin' Breadsticks website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) { // Added check for mainNav
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active'); // Toggle active class on the button itself
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            // Ensure targetId is not just "#" to prevent errors if an element with id="#" exists.
            if (targetId.length > 1) { 
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add active class to current nav item
    const currentPathname = window.location.pathname; // e.g., "/index.html" or "/music.html"
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); // e.g., "index.html" or "music.html"
        
        // Get the filename from the current path, e.g., "index.html" from "/project/index.html"
        const currentPageFilename = currentPathname.substring(currentPathname.lastIndexOf('/') + 1);

        // Handle the root case: if current page is "index.html" or just "/", and link is "index.html"
        if ((currentPageFilename === 'index.html' || currentPageFilename === '') && linkHref === 'index.html') {
            link.classList.add('active');
        } 
        // Handle other pages: if the link's href matches the current page's filename
        else if (linkHref !== 'index.html' && currentPageFilename === linkHref) {
            link.classList.add('active');
        }
    });
    
    // Newsletter form submission (in footer)
    // Note: form_handlers.js also has a newsletter handler.
    // Ensure only one is active or they don't conflict.
    // This version is simpler (no email validation).
    const newsletterForms = document.querySelectorAll('.newsletter form'); // Target all newsletter forms
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                    // In a static site, this doesn't send data to a server
                    // unless you integrate a third-party service.
                    console.log('Newsletter subscription (client-side from main.js):', emailInput.value);
                    alert('Thanks for subscribing to our newsletter! (Demo - no data sent)');
                    emailInput.value = ''; // Clear input after "submission"
                } else if (emailInput) {
                    alert('Please enter your email address.');
                }
            });
        });
    }
    
    // Initialize any music players if present (placeholder)
    const audioPlayers = document.querySelectorAll('.audio-player'); // Assuming class "audio-player"
    if (audioPlayers.length > 0) {
        audioPlayers.forEach(player => {
            // Custom audio player functionality would go here.
            // For a static site, this would likely involve HTML5 audio elements
            // and JS to control them.
            console.log('Audio player found (placeholder initialization).');
        });
    }
});