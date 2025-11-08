// import { getMeals } from './food-query.js'

document.addEventListener('DOMContentLoaded', function() {
    const sidebarContent = document.querySelector('.sidebar-content');
    const actionContainer = document.getElementById('sidebar-action-bar');
    
    let mealScheduleList = []; // to maintain what meals in current schedule
    
    let selectedMealIndex = null; // to maintain what meal is selected

    const mealButtonTemplate = document.getElementById('meal-button-template');
    const mealDropdownTemplate = document.getElementById('meal-dropdown-template');
    const footerTemplateElement = document.getElementById('sidebar-footer-template');

    let dropdownElement = null;
    let dropdownOn = false; 

    // Helpers to open/close the single dropdown
    function openDropdownAt(index) {
        if (!mealDropdownTemplate) return;

        if (!dropdownElement) {
            dropdownElement = mealDropdownTemplate.cloneNode(true);
            dropdownElement.removeAttribute('id');

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
                    selectedMealIndex = null;
                    renderSchedule();
                });
            });
        }

        const mealEl = sidebarContent.querySelector(`[data-index=\"${index}\"]`);
        if (!mealEl) return;

        if (dropdownElement.parentNode) dropdownElement.parentNode.removeChild(dropdownElement);
        mealEl.parentNode.insertBefore(dropdownElement, mealEl.nextSibling);
        dropdownElement.classList.add('show');
        dropdownOn = true;
    }

    function closeDropdown() {
        if (!dropdownElement) return;

        ensureDefaultForSelectedMeal();

        dropdownElement.classList.remove('show');
        if (dropdownElement.parentNode) dropdownElement.parentNode.removeChild(dropdownElement);
        dropdownOn = false;
    }

    function ensureDefaultForSelectedMeal() {
        if (selectedMealIndex !== null && mealScheduleList[selectedMealIndex]) {
            if (mealScheduleList[selectedMealIndex].name === '') {
                mealScheduleList.splice(selectedMealIndex, 1);
                selectedMealIndex = null;
            }
        }
    }

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

    // Render
    function renderSchedule() {
        sidebarContent.innerHTML = ''; 
        actionContainer.innerHTML = '';

        mealScheduleList.forEach((item, index) => {
            const elementWrapper = document.createElement('div');
            elementWrapper.dataset.index = index;
            elementWrapper.classList.add('meal-completed', 'p-2', 'mb-2', 'rounded-3', 'bg-light', 'shadow-sm', 'd-flex', 'align-items-center');

            const textElement = document.createElement('span');
            textElement.textContent = item.name;
            textElement.classList.add('selected-meal-text', 'ms-2', 'fw-bold');
            elementWrapper.appendChild(textElement);

            if (index === selectedMealIndex) {

                elementWrapper.style.backgroundColor = '#e9ecef';
                sidebarContent.appendChild(elementWrapper);

                if(item.name !== '') {
                    const footerClone = footerTemplateElement.cloneNode(true);
                    footerClone.removeAttribute('id');
                    sidebarContent.appendChild(elementWrapper);
                    sidebarContent.appendChild(footerClone);

                    const deleteBtn = footerClone.querySelector('[title="Xóa mục đã chọn"], .btn-outline-danger');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function(ev) {
                            ev.stopPropagation();
                            deleteSelectedMeal();
                        });
                    }

                    const editBtn = footerClone.querySelector('[title="Thay đổi mục đã chọn"], .btn-outline-info');
                    if (editBtn) {
                        editBtn.addEventListener('click', function(ev) {
                            ev.stopPropagation();
                            openEditDropdown(selectedMealIndex);
                        });
                    }

                    const addAboveBtn = footerClone.querySelector('[title="Thêm mục phía trên"]');
                    if (addAboveBtn) {
                        addAboveBtn.addEventListener('click', function(ev) {
                            ev.stopPropagation();
                            addMealAbove(selectedMealIndex);
                        });
                    }

                    const addBelowBtn = footerClone.querySelector('[title="Thêm mục phía dưới"]');
                    if (addBelowBtn) {
                        addBelowBtn.addEventListener('click', function(ev) {
                            ev.stopPropagation();
                            addMealBelow(selectedMealIndex);
                        });
                    }
                }
            } else {
                elementWrapper.style.backgroundColor = '';
                sidebarContent.appendChild(elementWrapper);
            }
        });

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

            sidebarContent.appendChild(plusWrapper);
        }

    }

    sidebarContent.addEventListener('click', function(e) {
        const plusBtn = e.target.closest('.btn-add-meal');
        if (!plusBtn) return;

        e.stopPropagation();
        ensureDefaultForSelectedMeal();

        closeDropdown();
        selectedMealIndex = null;

        addNewMeal();
    });

    sidebarContent.addEventListener('click', function(event) {
        const completed = event.target.closest('.meal-completed');
        
        if (completed) {
            ensureDefaultForSelectedMeal();
            const completedItem = completed;
            const clickedIndex = parseInt(completedItem.dataset.index);
            selectedMealIndex = (selectedMealIndex === clickedIndex) ? null : clickedIndex;

            closeDropdown();
            renderSchedule();

            console.log(mealScheduleList[clickedIndex].name);
            getMeals(mealScheduleList[clickedIndex].name);
            
        }
    });

    renderSchedule();

    document.addEventListener('click', function(e) {
        if (!dropdownOn) return;
        if (dropdownElement && (dropdownElement.contains(e.target) || e.target.closest('.btn-add-meal'))) return;

        ensureDefaultForSelectedMeal();

        closeDropdown();
        renderSchedule();
    });
});