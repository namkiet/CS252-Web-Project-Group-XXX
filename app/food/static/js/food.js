document.addEventListener('DOMContentLoaded', function() {
    const sidebarContent = document.querySelector('.sidebar-content');
    const actionContainer = document.getElementById('sidebar-action-bar');
    
    let dateCnt = 1 ;
    let selectedDate = 0 ;
    let allDateMealScheduleList=[[]] ;
    let mealScheduleList = []; // to maintain what meals in current schedule
    let selectedMealIndex = null; // to maintain what meal is selected
    let pendingEditIndex = null; // to maintain the item that is adding

    const mealButtonTemplate = document.getElementById('meal-button-template');
    const mealDropdownTemplate = document.getElementById('meal-dropdown-template');
    const footerTemplateElement = document.getElementById('sidebar-footer-template');

    // let dropdownElement = null;
    let dropdownOn = false; 

    // Helpers to open/close the single dropdown
    function openDropdownAt(indexToEdit) {
        if (!mealDropdownTemplate) return;

        closeDropdown();

        const dropdownElement = mealDropdownTemplate.cloneNode(true);
        dropdownElement.removeAttribute('id');

        const items = dropdownElement.querySelectorAll('.dropdown-item');
        items.forEach(it => {
            it.addEventListener('click', function(e) {
                e.preventDefault();
                const text = this.textContent;
                if (indexToEdit !== null && mealScheduleList[indexToEdit]) {
                    mealScheduleList[indexToEdit].name = text;
                }
                dropdownOn = false;
                closeDropdown();
                selectedMealIndex = null;
                pendingEditIndex = null;
                renderSchedule();
            });
        });

        const footerEl = sidebarContent.querySelector('.sidebar-footer');
        if(footerEl) {
            footerEl.appendChild(dropdownElement);
        } else {
            const mealEl = sidebarContent.querySelector(`[data-index=\"${indexToEdit}\"]`);
            if(mealEl) {
                mealEl.parentNode.insertBefore(dropdownElement, mealEl.nextSibling)
            }
        }

        dropdownElement.classList.add('show');
        dropdownOn = true;
    }

    function openDropdownForAdd(anchorElement) {
        if(!mealDropdownTemplate) return;

        cleanupPendingEdit();
        closeDropdown();
        selectedMealIndex = null;

        const dropdownElement = mealDropdownTemplate.cloneNode(true);
        dropdownElement.removeAttribute('id');

        const items = dropdownElement.querySelectorAll('.dropdown-item');
        items.forEach(it => {
            it.addEventListener('click', function(e){
                e.preventDefault();
                const text = this.textContent;

                mealScheduleList.push({ type: 'meal', name: text});
                selectedMealIndex = null;

                dropdownOn = false;
                closeDropdown();
                renderSchedule();
            });
        });

        anchorElement.appendChild(dropdownElement);
        dropdownElement.classList.add('show');
        dropdownOn = true;
    }
 
    function closeDropdown() {
        const activeDropdown = document.querySelector('.add-meal-menu.show');

        if(activeDropdown) {
            activeDropdown.classList.remove('show');
            if (activeDropdown.parentNode) {
                activeDropdown.parentNode.removeChild(activeDropdown);
            }
        }
        dropdownOn = false;
    }

    function cleanupPendingEdit() {
        if (pendingEditIndex !== null && mealScheduleList[pendingEditIndex]) {
            if (mealScheduleList[pendingEditIndex].name === '') {
                mealScheduleList.splice(pendingEditIndex, 1);
            }
        }
        pendingEditIndex = null;
    }

    function isAddingNewMeal() {
        return pendingEditIndex !== null;
    }

    function addNewMeal() {
        if(isAddingNewMeal()) return;

        const insertIndex = mealScheduleList.length;
        mealScheduleList.push({ type: 'meal', name: '' })
        pendingEditIndex = insertIndex;
        selectedMealIndex = insertIndex;
        renderSchedule();
        openDropdownAt(pendingEditIndex);
    }

    function addMealAbove(index) {
        if (isAddingNewMeal()) return;
        
        if (index === null || index === undefined) return;
        const insertIndex = index;
        mealScheduleList.splice(insertIndex, 0, { type: 'meal', name: '' });
        selectedMealIndex = insertIndex + 1;
        pendingEditIndex = insertIndex;
        
        renderSchedule();
        openDropdownAt(pendingEditIndex);
    }

    function addMealBelow(index) {
        if (isAddingNewMeal()) return;

        if (index === null || index === undefined) return;
        const insertIndex = index + 1;
        mealScheduleList.splice(insertIndex, 0, { type: 'meal', name: '' });
        selectedMealIndex = index;
        pendingEditIndex = insertIndex;
        
        renderSchedule();
        openDropdownAt(pendingEditIndex);
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
        if(isAddingNewMeal()) return;
        if (index === null || index === undefined) return;
        
        selectedMealIndex = index;
        pendingEditIndex = index;

        renderSchedule();
        openDropdownAt(index);
    }

    // Render
    function renderSchedule() {
        mealScheduleList = allDateMealScheduleList[selectedDate];
        sidebarContent.innerHTML = ''; 
        actionContainer.innerHTML = '';

        mealScheduleList.forEach((item, index) => {
            if(item.name !== '') {
                const elementWrapper = document.createElement('div');
                elementWrapper.dataset.index = index;
                elementWrapper.classList.add('meal-completed', 'p-2', 'mb-2', 'rounded-3', 'bg-light', 'shadow-sm', 'd-flex', 'align-items-center');

                const textElement = document.createElement('span');
                textElement.textContent = item.name;
                textElement.classList.add('selected-meal-text', 'ms-2', 'fw-bold');
                elementWrapper.appendChild(textElement);

                const iconElement = document.createElement('i');
                iconElement.classList.add('bi', 'bi-three-dots-vertical');
                iconElement.classList.add('ms-auto');
                iconElement.classList.add('text-muted');
                elementWrapper.appendChild(iconElement);

                if(index === selectedMealIndex) {
                    elementWrapper.classList.add('selected');
                }

                sidebarContent.appendChild(elementWrapper);
            }
            if(index === selectedMealIndex) {
                const footerClone = footerTemplateElement.cloneNode(true);
                footerClone.removeAttribute('id');
                sidebarContent.appendChild(footerClone);

                const deleteBtn = footerClone.querySelector('[title="Delete selected item"], .btn-outline-danger');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        deleteSelectedMeal();
                    });
                }

                const editBtn = footerClone.querySelector('[title="Change selected item"], .btn-outline-info');
                if (editBtn) {
                    editBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        openEditDropdown(selectedMealIndex);
                    });
                }

                const addAboveBtn = footerClone.querySelector('[title="Add above"]');
                if (addAboveBtn) {
                    addAboveBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        addMealAbove(selectedMealIndex);
                    });
                }

                const addBelowBtn = footerClone.querySelector('[title="Add below"]');
                if (addBelowBtn) {
                    addBelowBtn.addEventListener('click', function(ev) {
                        ev.stopPropagation();
                        addMealBelow(selectedMealIndex);
                    });
                }
            } 
        });

        const plusWrapper = mealButtonTemplate ? mealButtonTemplate.cloneNode(true) : null;
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

    const maxDays = 10 ;
    const dock = document.getElementById("date-taskbar");
    const addBtn = document.getElementById("addDay");
    const removeBtn = document.getElementById("removeDay");

    function renderDays() {
        const oldDays = dock.querySelectorAll(".day-item");
        oldDays.forEach(day => day.remove());

        for (let i = 0; i < dateCnt; i++) {
            const day = document.createElement("div");
            day.className = "day-item";
            day.textContent = `Day ${i+1}`;

            if (i === selectedDate) day.classList.add("selected-day");

            day.addEventListener("click", () => {
                selectedDate = i;
                renderDays();
            });

            dock.insertBefore(day, dock.querySelector(".controls-taskbar"));
        }
        renderSchedule();
    }


    function addDay() {
        if (dateCnt < maxDays) {
            dateCnt=dateCnt+1;
            allDateMealScheduleList.push([]);

            if (selectedDate === null) {
                selectedDate = 0;
            }

            renderDays();
        } else {
            alert("Can only take up to 10 days!");
        }
    }

    function removeDay() {
        //min : 1 day
        if (dateCnt <= 1) return;

        dateCnt--;

        allDateMealScheduleList.pop();

        if (selectedDate >= dateCnt) {
            selectedDate = dateCnt - 1;
        }

        renderDays();
    }

    
    addBtn.addEventListener("click", addDay);
    removeBtn.addEventListener("click", removeDay);

    sidebarContent.addEventListener('click', function(e) {
        const plusBtn = e.target.closest('.btn-add-meal');
        if (!plusBtn) return;

        e.stopPropagation();

        const plusWrapper = plusBtn.closest('.add-meal-button');
        if (plusWrapper) {
            openDropdownForAdd(plusWrapper);
        }
    });

    sidebarContent.addEventListener('click', function(event) {
        const completed = event.target.closest('.meal-completed');
        
        if (completed) {
            const clickedIndex = parseInt(completed.dataset.index);
            if (pendingEditIndex !== null && pendingEditIndex !== clickedIndex) {
                cleanupPendingEdit(); 
            }

            const completedItem = completed;
            selectedMealIndex = (selectedMealIndex === clickedIndex) ? null : clickedIndex;

            if (selectedMealIndex === pendingEditIndex) {
                pendingEditIndex = null;
            }

            closeDropdown();
            renderSchedule();
            
            getMeals(mealScheduleList[clickedIndex].name);
            console.log('1');
        }
    });

    
    renderDays();

    document.addEventListener('click', function(e) {
        if (!dropdownOn) return;
        
        const activeDropdown = document.querySelector('.add-meal-menu.show');

        if (activeDropdown && !activeDropdown.contains(e.target) && !e.target.closest('.btn-add-meal')) {
            cleanupPendingEdit();
            closeDropdown();
            renderSchedule();
        }
    });

    // const locationModalElement = document.getElementById('locationModal');
    // const locationModal = new bootstrap.Modal(locationModalElement);
    // locationModal.show();
});