document.addEventListener("DOMContentLoaded", function() {
  fetch('_navbar.html')
    .then(response => {
      if(!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;

      const currentPage = window.location.pathname.split('/').pop() ||
        'index.html';

      const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');

      navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if(linkHref === currentPage) {
          link.classList.add('active');
        }
      })
    })
    .catch(error => {
      console.error('Error fetching navbar:', error);
      document.getElementById('navbar-placeholder').innerHTML
        = '<p style="color:red; text-align:center;">Failed to load navigation bar.</p>'
    })
});


