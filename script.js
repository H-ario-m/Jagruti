const API_KEY = '3fa916b42bfce07d8483560a882561ad';


let map;
let marker; 

map = L.map(box3).setView([20.5937, 78.9629], 5); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setMarker(lat, lon); 
                fetchWeatherByCoordinates(lat, lon);
                map.setView([lat, lon], 13); 
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function setMarker(lat, lon) {
    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map); 
    }
    map.setView([lat, lon], 14); 
}