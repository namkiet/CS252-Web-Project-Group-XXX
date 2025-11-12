let map;
let currentMarker;

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export function initializeMap() {
    map = L.map('map', {
        center: [16.047079, 108.206482], 
        zoom: 6,
        zoomControl: false 
    });


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomright' 
    }).addTo(map);
}

export function updateMapLocation(lat, lon, displayName) {
    if(!map) {
        console.error('Map load error!');
        return;
    }

    if(currentMarker) {
        map.removeLayer(currentMarker);
    }

    const coords = [lat, lon];
    currentMarker = L.marker(coords, { icon: redIcon }).addTo(map);
    currentMarker.bindPopup(`<b>${displayName}</b>`).openPopup();
    map.flyTo(coords, 15);
}
