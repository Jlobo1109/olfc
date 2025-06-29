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
                
                // Close other open dropdowns
                const currentDropdown = this.parentElement;
                document.querySelectorAll('.dropdown.active').forEach(openDropdown => {
                    if(openDropdown !== currentDropdown) {
                        openDropdown.classList.remove('active');
                    }
                });

                // Toggle current dropdown
                currentDropdown.classList.toggle('active');
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