mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 9,
        center: coordinates
});
const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset:20}).setHTML(`<h4>${tt}</h4><p>Exect Location will be shared after Registration</p>`))
        .addTo(map);    

        