/* Inspiration drawn from Project_Code_6_StaticMapsAndStreetViewImagery.html of Google Maps API course */
var markers = [];
var map;
var locations;

// Callback function that run once maps API is loaded
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.447641, lng: -112.073550},
    zoom: 12,
    scrollwheel: false
    });
    // All of this must be called withing initMap, because it waits for the api to be loaded before executing its code. Otherwise, the browser would move on to map.js's map functions before the map/api was ready.
    locations = [
        {title: 'Lux Central', location: {lat: 33.5006054, lng: -112.0742918}},
        {title: 'Chase Field', location: {lat: 33.4455264, lng: -112.0666641}},
        {title: 'Tres Leches Cafe', location: {lat: 33.51838850000001, lng: -112.063614}},
        {title: 'Crescent Ballroom', location: {lat: 33.45179939999999, lng: -112.076835}},
        {title: 'The Westin Phoenix Downtown', location: {lat: 33.451666, lng: -112.0730457}}
    ];

    var myInfoWindow = new google.maps.InfoWindow();

    // This creates a marker for each item in locations array and then pushes it into markers array

    for (var i=0; i < locations.length; i++) {
        // Get properties from current location element
        var title = locations[i].title;
        var position = locations[i].location;
        // Create marker for this location element and set its properties
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);

        // TODO Waiting to get things working before moving on
        // This creates a click listener to that will open the info window
        //marker.click(function() {
        //    giveInfoWindowSomeInfo(this, myInfoWindow);
        //});

    }
    // Put each marker on the map and then extend the bounds of the map to include all markers
    var bounds = new google.maps.LatLngBounds();
    for (var j = 0; j<markers.length; j++) {
        markers[j].setMap(map);
        bounds.extend(markers[j].position);
    }
    map.fitBounds(bounds);

    // Wait until the map is loaded before loading knockout functionality
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        initKO();
    });
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        initYelp();
    });
}

function giveInfoWindowSomeInfo() {

}

function selectMarker() {

}
