/*--------------------------------------------------------------- Navbar */

export function initNavbar() {

    document.addEventListener('DOMContentLoaded', () => {
        const navbarItems = document.querySelectorAll('.navbar-item');
        navbarItems.forEach((item, index) => {
            // Définissez un délai pour chaque élément
            setTimeout(() => {
                item.classList.add('navbar-item-visible');
            }, index * 200); // Augmentez le délai pour chaque élément (200ms, 400ms, etc.)
        });
    });

    /* Active element */
    let lastActiveElement = null;
    
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('#nav-links a');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (this.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => { 
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
                
                lastActiveElement = link;
            }
        });
    });
    
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('mouseover', function() {
            document.querySelectorAll('#nav-links a').forEach(otherLink => {
                otherLink.classList.remove('active');
            });
        });
    });
    
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('mouseleave', function() {
            if (lastActiveElement) {
                lastActiveElement.classList.add('active');
            }
        });
    });
}