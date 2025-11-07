async function getMeals(type="breakfast") {
    const response = await fetch(`http://localhost:5000/recommend?type=${type}`);
    if (!response.ok) {
        alert("Có lỗi xảy ra khi lấy dữ liệu!");
        return;
    }

    const meals = await response.json();
    const wrapper = document.getElementById('meal-list-wrapper');
    wrapper.innerHTML = '';
    if (!meals.length) {
        wrapper.style.display = 'none';
        return;
    }

    wrapper.style.display = 'block';
    meals.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'list-group-item list-group-item-action d-flex align-items-center shadow-sm rounded';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <img src="${meal.img_url + "?text=" + meal.name}" alt="${meal.type}" class="me-3 rounded" style="width:50px; height:50px; object-fit:cover;">
            <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">${meal.name}</h6>
                <p class="mb-1 text-truncate" style="max-width:200px;">${meal.description || '-'}</p>
                <small class="text-muted">${meal.location || '-'} | ${meal.address || '-'}</small>
            </div>
            <span class="badge ${meal.ratings >= 4 ? 'bg-success' : meal.ratings >= 2 ? 'bg-warning text-dark' : 'bg-danger'} rounded-pill">${meal.ratings || '-'}/5</span>
        `;
        wrapper.appendChild(div);
    });
}