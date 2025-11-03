document.addEventListener('DOMContentLoaded', function() {
    const sidebarContent = document.querySelector('.sidebar-content');

    const newDropdownTemplate = sidebarContent.querySelector('.add-meal-dropdown').outerHTML;

    sidebarContent.addEventListener('click', function() {
        if(event.target.classList.contains('dropdown-item')) {
            event.preventDefault(); // Block the default event

            const selectedText = event.target.textContent;
            const currentDropdownWrapper = event.target.closest('.add-meal-dropdown');
            const button = currentDropdownWrapper.querySelector('.btn-add-meal');

            const textElement = document.createElement('span');
            textElement.textContent = selectedText;
            // maintain the meal-text by "selected-meal-text"
            textElement.classList.add('selected-meal-text', 'ms-2', 'fw-bold');

            button.insertAdjacentElement('afterend', textElement);

            button.disabled = true;
            button.removeAttribute('data-bs-toggle');
            button.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            button.classList.add('btn-add-meal-done'); // add done

            const dropdownMenu = currentDropdownWrapper.querySelector('.dropdown-menu');
            if(dropdownMenu) {
                dropdownMenu.remove();
            }

            sidebarContent.insertAdjacentHTML('beforeend', newDropdownTemplate);
        }
    });
});