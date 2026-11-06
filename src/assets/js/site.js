// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Tab functionality for schedule
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
    
