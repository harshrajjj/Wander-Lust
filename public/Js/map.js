mapboxgl.accessToken = mapToken; // Getting file mapToken from show.js script

// Default coordinates for Delhi
const defaultCoordinates = [77.209, 28.6139]; // [lng, lat]

// Validate coordinates: ensure it's an array with two valid numbers
const isValidCoordinates = Array.isArray(Listing.geometry?.coordinates) && Listing.geometry.coordinates.length === 2;

// Use Listing.geometry.coordinates if valid; otherwise, use defaultCoordinates
const coordinates = isValidCoordinates ? Listing.geometry.coordinates : defaultCoordinates;

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // Container ID
    center: coordinates, // Starting position [lng, lat]
    zoom: 12 // Starting zoom level
});

// Create a marker
const marker = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(coordinates) // Use the same coordinates as the map center
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${Listing.title}</h4><p>Exact Location will be Provided after booking</p>`)
            .setMaxWidth("300px")
    )
    .addTo(map);
