    /* Inspiration drawn from Project_Code_6_StaticMapsAndStreetViewImagery.html of Google Maps API course */
    /*var markers = [];
    var map;
    var locations;
    var myInfoWindow;*/

    // Callback function that run once maps API is loaded
function initMap() {
    model.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.447641, lng: -112.073550},
    zoom: 12,
    scrollwheel: false
    });

    model.myInfoWindow = new google.maps.InfoWindow();

        // Wait until the map is loaded before loading knockout functionality
        //google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        //    initKO();
        //});
    createMarkers();

    if (model.map === null) {
        alert("Error loading map");
    }
}

function createMarkers() {
    for (var i=0; i < model.locations.length; i++) {
        // Get properties from current location element
        var title = model.locations[i].title;
        var position = model.locations[i].location;
        // Create marker for this location element and set its properties
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

            // This creates a click listener to that will open the info window
        function wireUpInfoWindow (index) {
            marker.addListener("click", function() {
                giveInfoWindowSomeInfo(this, model.myInfoWindow, model.locations[index]);
            });
        }
        wireUpInfoWindow(i);

        model.markers.push(marker);
    }
        // Put each marker on the map and then extend the bounds of the map to include all markers
    var bounds = new google.maps.LatLngBounds();
    for (var j = 0; j<model.markers.length; j++) {
        model.markers[j].setMap(model.map);
        bounds.extend(model.markers[j].position);
    }
    model.map.fitBounds(bounds);
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
        infowindow.open(model.map, marker);
    }
}

var model = {
    markers: [],
    map: null,
    locations: [
        {title: 'Lux Central', location: {lat: 33.5006054, lng: -112.0742918}},
        {title: 'Chase Field', location: {lat: 33.4455264, lng: -112.0666641}},
        {title: 'Tres Leches Cafe', location: {lat: 33.51838850000001, lng: -112.063614}},
        {title: 'Crescent Ballroom', location: {lat: 33.45179939999999, lng: -112.076835}},
        {title: 'The Westin Phoenix Downtown', location: {lat: 33.451666, lng: -112.0730457}}
    ],
    myInfoWindow: null
};

var ViewModel = function() {
    var self = this;

    $("#ko-menu").attr("data-bind", "foreach: menuList");
    $(".ko-menu-item").attr("data-bind", "text: title, attr: {id: index}, visible: visibility");
    $("#input-to-filter").attr("data-bind", "value: myInput");
    $("#filter-btn").attr("data-bind", "click: doFilter");
    $("#filter-btn-refresh").attr("data-bind", "click: resetFilter");

    // This imports the titles property of all maps location array objects into a new array
    self.menuList = ko.observableArray([]);
    model.locations.forEach(function(locationItem, index) {
        self.menuList.push({"title": locationItem.title, "index": "ko-menu-item-"+index, "visibility": true});
    });
    self.myInput = ko.observable("Filter here...");
    self.doFilter = function() {
        self.checkFilter(self.menuList(), self.myInput().toLowerCase());
    };
    self.checkFilter = function(passedArray, searchTerm) {
        // make existing stuff invisible and then good results visible later
        self.menuList().forEach(function(item) {
            item.visibility = false;
        });
        var tempArray = [];
        var searchTermLength = searchTerm.length;
        passedArray.forEach(function(item, index){
            var cutString = item.title.slice(0, searchTermLength).toLowerCase();
            if (cutString === searchTerm) {
                tempArray.push(item);
            } else {
                // do nothing if it doesn't match
            }
        });
        // TODO get KO to observe changes to self.menuList
        self.menuList().forEach(function(locationItem) {
            tempArray.forEach(function(tempItem){
                if (locationItem.title == tempItem.title) {
                    locationItem.visibility = true;
                }
            });
        });
        console.log(self.menuList());
    };
    // reset menuList item visibility
    self.resetFilter = function() {
        self.menuList().forEach(function(menuItem) {
            menuItem.visibility = true;
        });
        console.log(self.menuList());
    };
};
ko.applyBindings(new ViewModel());

    // Non-KO JS
$(document).on("click", "#hamburger", function() {
    $("#slide-menu").toggleClass("menu-hidden");
});
    // Couldn't get these to work in a loop
$(document).on("click", "#ko-menu-item-0", function() {
    $("#slide-menu").toggleClass("menu-hidden");
    google.maps.event.trigger(model.markers[0], 'click');
});
$(document).on("click", "#ko-menu-item-1", function() {
    $("#slide-menu").toggleClass("menu-hidden");
    google.maps.event.trigger(model.markers[1], 'click');
});
$(document).on("click", "#ko-menu-item-2", function() {
    $("#slide-menu").toggleClass("menu-hidden");
    google.maps.event.trigger(model.markers[2], 'click');
});
$(document).on("click", "#ko-menu-item-3", function() {
    $("#slide-menu").toggleClass("menu-hidden");
    google.maps.event.trigger(model.markers[3], 'click');
});
$(document).on("click", "#ko-menu-item-4", function() {
    $("#slide-menu").toggleClass("menu-hidden");
    google.maps.event.trigger(model.markers[4], 'click');
});
