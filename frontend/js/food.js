document.addEventListener('DOMContentLoaded', function() {
    const sidebarContent = document.querySelector('.sidebar-content');
    const actionContainer = document.getElementById('sidebar-action-bar');
    
    // MẢNG DỮ LIỆU (LIST)
    // Only store actual meal items here. The 
    // "plus" control is rendered separately below the list.
    let mealScheduleList = []; 
    
    let selectedMealIndex = null;
    
    // LẤY CÁC MẪU (TEMPLATES)
    // Note: HTML now separates the add-button and the dropdown menu into two templates
    const mealButtonTemplate = document.getElementById('meal-button-template');
    const mealDropdownTemplate = document.getElementById('meal-dropdown-template');
    const footerTemplateElement = document.getElementById('sidebar-footer-template');

    // Single reusable dropdown element and its state (only one instance)
    let dropdownElement = null;
    let dropdownOn = false; // whether dropdown is currently shown for a selected meal

    // Helpers to open/close the single dropdown
    function openDropdownAt(index) {
        if (!mealDropdownTemplate) return;
        // ensure dropdownElement exists
        if (!dropdownElement) {
            dropdownElement = mealDropdownTemplate.cloneNode(true);
            dropdownElement.removeAttribute('id');

            // attach item handlers once
            const items = dropdownElement.querySelectorAll('.dropdown-item');
            items.forEach(it => {
                it.addEventListener('click', function(e) {
                    e.preventDefault();
                    const text = this.textContent;
                    if (selectedMealIndex !== null && mealScheduleList[selectedMealIndex]) {
                        mealScheduleList[selectedMealIndex].name = text;
                    }
                    dropdownOn = false;
                    closeDropdown();
                    renderSchedule();
                });
            });
        }

        // find the meal element in the sidebar
        const mealEl = sidebarContent.querySelector(`[data-index=\"${index}\"]`);
        if (!mealEl) return;

        // insert dropdownElement after the meal element
        if (dropdownElement.parentNode) dropdownElement.parentNode.removeChild(dropdownElement);
        mealEl.parentNode.insertBefore(dropdownElement, mealEl.nextSibling);
        dropdownElement.classList.add('show');
        dropdownOn = true;
    }

    function closeDropdown() {
        if (!dropdownElement) return;

        // Ensure selected meal gets a default if its name is empty
        ensureDefaultForSelectedMeal();

        dropdownElement.classList.remove('show');
        if (dropdownElement.parentNode) dropdownElement.parentNode.removeChild(dropdownElement);
        dropdownOn = false;
    }

    // If a meal is selected and its name is empty, set it to the default 'Breakfast'
    function ensureDefaultForSelectedMeal() {
        if (selectedMealIndex !== null && mealScheduleList[selectedMealIndex]) {
            if (mealScheduleList[selectedMealIndex].name === '') {
                mealScheduleList[selectedMealIndex].name = 'Breakfast';
            }
        }
    }

    // ---------------------------
    // Reusable action functions
    // ---------------------------
    function addNewMeal() {
        mealScheduleList.push({ type: 'meal', name: '' });
        selectedMealIndex = mealScheduleList.length - 1;
        renderSchedule();
        openDropdownAt(selectedMealIndex);
    }

    function addMealAbove(index) {
        if (index === null || index === undefined) return;
        const insertIndex = index;
        mealScheduleList.splice(insertIndex, 0, { type: 'meal', name: '' });
        selectedMealIndex = insertIndex;
        renderSchedule();
        openDropdownAt(selectedMealIndex);
    }

    function addMealBelow(index) {
        if (index === null || index === undefined) return;
        const insertIndex = index + 1;
        mealScheduleList.splice(insertIndex, 0, { type: 'meal', name: '' });
        selectedMealIndex = insertIndex;
        renderSchedule();
        openDropdownAt(selectedMealIndex);
    }

    function deleteSelectedMeal() {
        if (selectedMealIndex === null || selectedMealIndex === undefined) return;
        if (!mealScheduleList[selectedMealIndex]) return;
        mealScheduleList.splice(selectedMealIndex, 1);
        selectedMealIndex = null;
        closeDropdown();
        renderSchedule();
    }

    function openEditDropdown(index) {
        if (index === null || index === undefined) return;
        selectedMealIndex = index;
        openDropdownAt(index);
    }

    // *******************************************************************
    // HÀM RENDER CHÍNH
    // *******************************************************************
    function renderSchedule() {
        sidebarContent.innerHTML = ''; 
        actionContainer.innerHTML = '';

        // Lặp qua MẢNG DỮ LIỆU — chỉ render các bữa ăn thực sự
        mealScheduleList.forEach((item, index) => {
            // Create a simple container for a meal item (no dropdown inside)
            const elementWrapper = document.createElement('div');
            elementWrapper.dataset.index = index;
            elementWrapper.classList.add('meal-completed', 'p-2', 'mb-2', 'rounded-3', 'bg-light', 'shadow-sm', 'd-flex', 'align-items-center');

            const textElement = document.createElement('span');
            textElement.textContent = item.name;
            textElement.classList.add('selected-meal-text', 'ms-2', 'fw-bold');
            elementWrapper.appendChild(textElement);

            if (index === selectedMealIndex) {
                elementWrapper.style.backgroundColor = '#e9ecef';
                const footerClone = footerTemplateElement.cloneNode(true);
                footerClone.removeAttribute('id');
                sidebarContent.appendChild(elementWrapper);
                sidebarContent.appendChild(footerClone);

                // --- Footer action: Delete selected meal ---
                // Find delete button inside footer and attach handler
                const deleteBtn = footerClone.querySelector('[title="Xóa mục đã chọn"], .btn-outline-danger');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        deleteSelectedMeal();
                    });
                }
                // --- Footer action: Open dropdown for selected meal (edit) ---
                const editBtn = footerClone.querySelector('[title="Thay đổi mục đã chọn"], .btn-outline-info');
                if (editBtn) {
                    editBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        openEditDropdown(selectedMealIndex);
                    });
                }
                // --- Footer action: Add a new meal above the selected meal ---
                const addAboveBtn = footerClone.querySelector('[title="Thêm mục phía trên"]');
                if (addAboveBtn) {
                    addAboveBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        addMealAbove(selectedMealIndex);
                    });
                }
                // --- Footer action: Add a new meal below the selected meal ---
                const addBelowBtn = footerClone.querySelector('[title="Thêm mục phía dưới"]');
                if (addBelowBtn) {
                    addBelowBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        addMealBelow(selectedMealIndex);
                    });
                }
            } else {
                elementWrapper.style.backgroundColor = '';
                sidebarContent.appendChild(elementWrapper);
            }
        });

        // Luôn hiển thị nút + ở dưới cùng (không thuộc mealScheduleList)
        // Use separate templates: a button template and a dropdown menu template
        const plusWrapper = mealButtonTemplate ? mealButtonTemplate.cloneNode(true) : null;
        const dropdownClone = mealDropdownTemplate ? mealDropdownTemplate.cloneNode(true) : null;

        if (plusWrapper) {
            plusWrapper.removeAttribute('id');
            const plusButton = plusWrapper.querySelector('.btn-add-meal');
            if (plusButton) {
                plusButton.innerHTML = '<i class="bi bi-plus-circle-fill"></i>';
                plusButton.classList.remove('btn-add-meal-done');
                plusButton.disabled = false;
            }

            // Append plus button
            sidebarContent.appendChild(plusWrapper);
        }

        // Note: dropdownClone is not appended here. We use a single reusable
        // dropdownElement created on demand (openDropdownAt) so there is exactly
        // one dropdown instance in the DOM when opened.
    }


    // *******************************************************************
    // LÓGIC XỬ LÝ SỰ KIỆN CHUNG
    // *******************************************************************
    
    // Delegated handler for the plus button: centralize the click handling
    // so we don't attach listeners on every render. When plus is clicked we
    // finalize any active selection/dropdown and then create a new meal.
    sidebarContent.addEventListener('click', function(e) {
        const plusBtn = e.target.closest('.btn-add-meal');
        if (!plusBtn) return;
        e.stopPropagation();
        // finalize any active selection/dropdown
        ensureDefaultForSelectedMeal();
        closeDropdown();
        selectedMealIndex = null;
        // create new meal (this will select it and open dropdown)
        addNewMeal();
    });

    sidebarContent.addEventListener('click', function(event) {
        // Only handle clicks on meal items (select/unselect)
        const completed = event.target.closest('.meal-completed');
        ensureDefaultForSelectedMeal();
        if (completed) {
            const completedItem = completed;
            const clickedIndex = parseInt(completedItem.dataset.index);
                selectedMealIndex = (selectedMealIndex === clickedIndex) ? null : clickedIndex;
                // If user clicked inside the sidebar and this action finalizes an
                // edit (e.g. deselecting a previously-selected blank meal), make
                // sure the defaulting logic runs consistently.

                closeDropdown();
                renderSchedule();
        }
    });

    
    // Gọi hàm render lần đầu
    renderSchedule();

    // Close dropdown when clicking outside (global listener)
    document.addEventListener('click', function(e) {
        if (!dropdownOn) return;
        if (dropdownElement && (dropdownElement.contains(e.target) || e.target.closest('.btn-add-meal'))) return;

        // Ensure any selected meal with empty name gets default before closing
        ensureDefaultForSelectedMeal();

        closeDropdown();
        renderSchedule();
    });
});