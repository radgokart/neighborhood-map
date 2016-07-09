// This is a global array which the map will use to match infowindow data to a specific marker. The indexes match the indexes of the locations array in Google Maps, so if a for loop is called, locations[i] and foursquareInfoArray[i] should be pointing to the right data that we want.
var foursquareLocationArray = [];
var locations = [
                {title: 'Tres Leches Cafe', location: {lat: 33.51838850000001, lng: -112.063614}},
                {title: 'The Westin Phoenix Downtown', location: {lat: 33.451666, lng: -112.0730457}},
                {title: 'Chase Field', location: {lat: 33.4455264, lng: -112.0666641}},
                {title: 'Lux Central', location: {lat: 33.5006054, lng: -112.0742918}},
                {title: 'Crescent Ballroom', location: {lat: 33.45179939999999, lng: -112.076835}}
                ];

function initFoursquare() {
    // Create local copy of locations array from Google Maps
    var foursquareURL;

    locations.forEach(function(locationItem, index){
        foursquareURL = "https://api.foursquare.com/v2/venues/search?near=phoenix,az&query=" + locationItem.title + "&client_id=IY4MOF0VN0HHCOSRH121TJYN1P3FTVZRNCX2RU1YNF23GRBH&client_secret=O0GFJPKBRBDYSO4M52SRJBINZLFWVF4DLPNYZ3WH5NOIYVKW&v=20160709&m=foursquare";

        $.ajax( {
            url: foursquareURL,
            dataType: "json",
            success: function(responseObject) {
                var foursquareTitle = responseObject.response.venues[0].name;
                var foursquareLocation = responseObject.response.venues[0].location;
                // This is tough, as the push doesn't happen until the async call is done, which means that the info array won't be available until all ajax calls are done. In my testing, I was able to get it populated by using setTimeout to wait 800 ms before using console.log(foursquareInfoArray).
                foursquareLocationArray.push({"title": foursquareTitle, location: foursquareLocation});
            },
            // Since map marker position depends on this, use hard coded location if foursquare api fails
            error: function() {
                foursquareLocationArray.push({"title": "Error loading data", location: locationItem.location});
            }
        });
    });
    setTimeout(function() {
        $("#loading-text").text("");
    },1000);
    // Calling initMap here as a way to kick off foursquare api call first. This gives foursquare api time to provide the data we are asking for.
    initMap();
    // Foursquare data needs to be loaded before the markers are created, since they are built using foursquare data. This timeout was tested with network throttling in dev tools to allow enough time for markers to properly load even when network speeds are 750 kbps which is 3G.
    setTimeout(createMarkers, 750);
}
