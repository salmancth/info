/*!
* Start Bootstrap - Resume v7.0.2 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// List of certificate file names
const certificateImages = [
    'HIL_Scratch.jpg',
    'certificate2.jpg',
    'certificate3.jpg'
    // Add more certificates as needed
  ];
  
  // Function to display certificates
  function displayCertificates() {
    const gallery = document.getElementById('certificates-gallery');
  
    certificateImages.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = `certificates/${image}`;
      imgElement.alt = `Certificate: ${image}`;
      gallery.appendChild(imgElement);
    });
  }
  
  // Call the function on page load
  document.addEventListener('DOMContentLoaded', displayCertificates);
  
