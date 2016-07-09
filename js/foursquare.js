// This is a global array which the map will use to match infowindow data to a specific marker. The indexes match the indexes of the locations array in Google Maps, so if a for loop is called, locations[i] and foursquareInfoArray[i] should be pointing to the right data that we want.
var foursquareInfoArray = [];

function initFoursquare() {
    // Create local copy of locations array from Google Maps
    var googleMapsLocationData = locations;
    var foursquareURL;

    googleMapsLocationData.forEach(function(locationItem, index){
        foursquareURL = "https://api.foursquare.com/v2/venues/search?near=phoenix,az&query=" + locationItem.title + "&client_id=IY4MOF0VN0HHCOSRH121TJYN1P3FTVZRNCX2RU1YNF23GRBH&client_secret=O0GFJPKBRBDYSO4M52SRJBINZLFWVF4DLPNYZ3WH5NOIYVKW&v=20160709&m=foursquare";

        $.ajax( {
            url: foursquareURL,
            dataType: "json",
            success: function(responseObject) {
                var foursquareName = responseObject.response.venues[0].name;
                var foursquareLocationLat = responseObject.response.venues[0].location.lat;
                var foursquareLocationLng = responseObject.response.venues[0].location.lng;
                // This is tough, as the push doesn't happen until the async call is done, which means that the info array won't be available until all ajax calls are done. In my testing, I was able to get it populated by using setTimeout to wait 800 ms before using console.log(foursquareInfoArray).
                foursquareInfoArray.push({"location": "lat: " + foursquareLocationLat + ", lng: " + foursquareLocationLng, "title": foursquareName});
            },
            error: function(object, textStatus, errorThrown) {
                foursquareInfoArray.push({"title": "Error loading data", "location": "Error loading data"});
            }
        });
    });

    function showData(){
        console.log(foursquareInfoArray);
    }
    setTimeout(showData, 5000);
    // In order to deal with the asynchronous issue noted above, I made a span element that says "Loading data..." and disappears when the foursquare content should be loaded.
    setTimeout(function() {
        $("#loading-text").text("");
    },2000);
}
