function displayMap(pos) {
    const coords = [pos.coords.latitude, pos.coords.longitude];
    const map = L.map('map', { center: coords, zoom: 19 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(coords)
        .addTo(map)
        .bindPopup('Vị trí hiện tại của bạn')
        .openPopup();
}

navigator.geolocation.getCurrentPosition(
    (pos) => displayMap(pos),
    (err) => console.error(err),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);
