/* Inspiration drawn from Project_Code_6_StaticMapsAndStreetViewImagery.html of Google Maps API course */
var markers = [];
var map;
var locations;
var foursquareData;
var myInfoWindow;

// Callback function that run once maps API is loaded
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.447641, lng: -112.073550},
    zoom: 12,
    scrollwheel: false
    });

    foursquareData = foursquareLocationArray;
    myInfoWindow = new google.maps.InfoWindow();

    // Wait until the map is loaded before loading knockout functionality
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        initKO();
    });
}

function createMarkers() {
    for (var i=0; i < foursquareData.length; i++) {
        // Get properties from current location element
        var title = foursquareData[i].title;
        var position = foursquareData[i].location;
        // Create marker for this location element and set its properties
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);
        // This creates a click listener to that will open the info window
        function listenToMarker (index) {
            marker.addListener("click", function() {
                giveInfoWindowSomeInfo(this, myInfoWindow, foursquareData[index]);
            });
        }
        listenToMarker(i);
    }
    // Put each marker on the map and then extend the bounds of the map to include all markers
    var bounds = new google.maps.LatLngBounds();
    for (var j = 0; j<markers.length; j++) {
        markers[j].setMap(map);
        bounds.extend(markers[j].position);
    }
    map.fitBounds(bounds);
}

function giveInfoWindowSomeInfo(marker, infowindow, dataObject) {
    if (infowindow.marker != marker) {
    	// Clear infowindow content.
    	infowindow.setContent('');
    	infowindow.marker = marker;
    	// Make sure the marker is cleared when the infowindow is closed.
    	infowindow.addListener('closeclick', function() {
            infowindow.marker.setAnimation(null);
            infowindow.marker = null;
    	});
    	infowindow.setContent("<div>" + dataObject.title + "</div>" +
                    "<div>lat: " + dataObject.location.lat + ", lng: " + dataObject.location.lng + "</div>");
        if (infowindow.marker.getAnimation() !== null) {
            infowindow.marker.setAnimation(null);
        }
        else {
            infowindow.marker.setAnimation(google.maps.Animation.DROP);
        }
    	infowindow.open(map, marker);
    }
}
