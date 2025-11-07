document.addEventListener("DOMContentLoaded", function() {
  fetch('/navbar')
    .then(response => {
      if(!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;

      const currentPath = window.location.pathname;

      const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');

      navLinks.forEach(link => {
        // const linkHref = link.getAttribute('href');
        // if(linkHref === currentPage) {
        //   link.classList.add('active');
        // }
        const linkPath = new URL(link.href).pathname;
        if(linkPath === currentPath) {
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






