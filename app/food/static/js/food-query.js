function createStarRating(rating) {
    let starsHtml = '<div class="star-rating text-end">';
    const numRating = parseFloat(rating) || 0;
    const roundedRating = Math.round(numRating);

    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
            // yellow star
            starsHtml += '<i class="bi bi-star-fill"></i>'; 
        } else {
            // empty star
            starsHtml += '<i class="bi bi-star"></i>'; 
        }
    }
    starsHtml += `<small class="text-muted d-block" style="font-size: 0.8em;">${numRating.toFixed(1)}/5.0</small>`;
    starsHtml += '</div>';
    return starsHtml;
}

async function getMeals(type="breakfast") {
    const response = await fetch(`/food/recommend?type=${type}`);
    if (!response.ok) {
        alert("Error: do not load type food to get meals!");
        return;
    }

    const meals = await response.json();
    const wrapper = document.getElementById('meal-list-wrapper');
    const listContainer = document.getElementById('meal-list-items');
    listContainer.innerHTML = '';
    if (!meals.length) {
        wrapper.style.display = 'none';
        return;
    }

    wrapper.style.display = 'flex';
    meals.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center shadow-sm rounded';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${meal.img_url + "?text=" + meal.name}" alt="${meal.type}" class="me-3 rounded" style="width:50px; height:50px; object-fit:cover;">
                <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1">${meal.name}</h6>
                    <p class="mb-1 text-truncate" style="max-width:200px;">${meal.description || '-'}</p>
                    <small class="text-muted">${meal.location || '-'} | ${meal.address || '-'}</small>
                </div>
            </div>
            
            ${createStarRating(meal.ratings)}
        `;
        listContainer.appendChild(div);
    });
}