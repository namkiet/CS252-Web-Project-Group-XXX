import { initializeMap, updateMapLocation } from "./map.js";

document.addEventListener('DOMContentLoaded', function() {
    const sidebarContent = document.querySelector('.sidebar-content');
    const actionContainer = document.getElementById('sidebar-action-bar');
    
    let dateCnt = 1;
    let selectedDate = 0; // to maintain current selected date
    let allDateMealScheduleList=[[]]; // to maintain what day's schedule is it 
    let mealScheduleList = []; // to maintain what meals in current schedule
    let selectedMealIndex = null; // to maintain what meal is selected
    let pendingEditIndex = null; // to maintain the item that is adding

    const mealButtonTemplate = document.getElementById('meal-button-template');
    const mealDropdownTemplate = document.getElementById('meal-dropdown-template');
    const footerTemplateElement = document.getElementById('sidebar-footer-template');

    // -------------------------- DROP DOWN ----------------------------
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
    // -------------------------- FOOTER --------------------------
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

    // ------------------------ TASKBAR FOR DAY -------------------------
    const maxDays = 10;
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

    // -------------------------- RENDER SCHEDULE ------------------------
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

    // ----------------------------MAP AND INPUT LOCATION-------------------------
    initializeMap();

    const searchContainer = document.getElementById('location-search-container')
    const backdrop = document.getElementById('location-backdrop')
    const locationInput = document.getElementById('location-input')
    const suggestionsBox = document.getElementById('location-suggestions')
    const saveLocationBtn = document.getElementById('location-search-btn')
    const useCurrentLocationBtn = document.getElementById('use-current-location-btn')
    const currentLocationSpinner = useCurrentLocationBtn.querySelector('.spinner-border')
    const modalError = document.getElementById('location-error')
    const locationClearBtn = document.getElementById('location-clear-btn');

    let searchTimeout;
    let selectedLocation = null;

    let highlightedSuggestionIndex = -1;

    function setLocationAndAnimate(lat, lon, displayName) {
        const shortDisplayName = displayName.split(',')[0].trim();
        updateMapLocation(lat, lon, shortDisplayName);
        locationInput.value = displayName;

        suggestionsBox.innerHTML = '';
        highlightedSuggestionIndex = -1;
        locationInput.blur();

        searchContainer.classList.remove('is-centered');
        searchContainer.classList.add('is-pinned');

        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';

    }

    locationClearBtn.addEventListener('click', () => {
        locationInput.value = '';
        suggestionsBox.innerHTML = '';
        saveLocationBtn.disabled = true;
        selectedLocation = null;
        modalError.textContent = '';
        locationInput.focus();
        highlightedSuggestionIndex = -1;
    });

    // When user input location
    locationInput.addEventListener('input', () => {
        const query = locationInput.value.trim();

        suggestionsBox.innerHTML = '';
        selectedLocation = null;

        saveLocationBtn.disabled = true;
        
        if(query.length < 3) return;

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try{
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn`);
                if(!response.ok) throw new Error('Network response error');
                const data = await response.json();
                displaySuggestions(data);
            } catch(error) {
                console.error('Error when save location:', error);
                suggestionsBox.innerHTML = '<div class="list-group-item list-group-item-danger">Error: Cannot load</div>'
            }
        }, 200);
    });

    function updateHighlight(index) {
        const items = suggestionsBox.querySelectorAll('.list-group-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    // To display suggestions for location when user type in locationInput
    function displaySuggestions(suggestions) {
        suggestionsBox.innerHTML = '';
        if(suggestions.length === 0) {
            suggestionsBox.innerHTML = '<div class="list-group-item list-group-item-warning">Cannot load</div>';
            return
        }
        
        suggestions.forEach(place => {
            const item = document.createElement('a');
            item.href='#';
            item.className = 'list-group-item list-group-item-action list-group-item-light';
            item.textContent = place.display_name;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                clearTimeout(searchTimeout);

                setLocationAndAnimate(
                    parseFloat(place.lat),
                    parseFloat(place.lon),
                    place.display_name
                );
            });
            suggestionsBox.appendChild(item);
        });
    }

    // When user click saveLocationBtn or we already have selectedLocation yet
    function submitLocation() {
        if(selectedLocation) {
            setLocationAndAnimate(selectedLocation.lat, selectedLocation.lon, selectedLocation.display_name);
        } else {
            modalError.textContent = 'Please choose one suggestion in the list below.';
        }
    }

    saveLocationBtn.addEventListener('click', submitLocation);

    // When user click enter, arrowup, arrowdown while typing in locationInput
    locationInput.addEventListener('keydown', (e) => {
        const items = suggestionsBox.querySelectorAll('.list-group-item');

        if(items.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if(highlightedSuggestionIndex < items.length - 1) {
                        highlightedSuggestionIndex++;
                    } else {
                        highlightedSuggestionIndex = 0;
                    }
                    updateHighlight(highlightedSuggestionIndex);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if(highlightedSuggestionIndex > 0) {
                        highlightedSuggestionIndex--;
                    } else {
                        highlightedSuggestionIndex = items.length - 1;
                    }
                    updateHighlight(highlightedSuggestionIndex);
                    break;
                case 'Enter':
                    if(highlightedSuggestionIndex > -1) {
                        e.preventDefault();
                        const activeItem = items[highlightedSuggestionIndex];
                        if(activeItem) {
                            activeItem.click();
                        }
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    suggestionsBox.innerHTML = '';
                    highlightedSuggestionIndex = -1;
                    break;
            }
        } else if(e.key === 'Enter') {
            e.preventDefault();
        }
    });

    // When user click userCurrentLocationBtn, and we don't use Reverse Geocoding for this!
    useCurrentLocationBtn.addEventListener('click', () => {
        modalError.textContent = '';
        useCurrentLocationBtn.disabled = true;
        currentLocationSpinner.style.display = 'inline-block';

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const displayName = 'Current location';

                setLocationAndAnimate(latitude, longitude, displayName);
                useCurrentLocationBtn.disabled = false;
                currentLocationSpinner.style.display = 'none';
            },
            (err) => {
                console.warn(`Error geolocation (ERROR ${err.code}): ${err.message}`);
                modalError.textContent = 'Cannot find location.';
                useCurrentLocationBtn.disabled = false;
                currentLocationSpinner.style.display = 'none';
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    });

    saveLocationBtn.disabled = true;
});