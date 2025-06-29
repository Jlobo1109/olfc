// JavaScript for slideshows and other interactive features will go here. 

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('header ul');

    menuToggle.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });

    // Mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown .dropbtn');

    dropdowns.forEach(dropbtn => {
        dropbtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                // Prevent link navigation
                e.preventDefault();
                
                // Toggle current dropdown
                const currentDropdown = this.parentElement;
                const isActive = currentDropdown.classList.contains('active');
                // Close all dropdowns
                document.querySelectorAll('.dropdown.active').forEach(openDropdown => {
                    openDropdown.classList.remove('active');
                });
                // Open only if it was not already active
                if (!isActive) {
                    currentDropdown.classList.add('active');
                }
            }
        });
    });

    // Change header background on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

}); 