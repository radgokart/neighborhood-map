// Begin map stuff
/* Inspiration drawn from Project_Code_6_StaticMapsAndStreetViewImagery.html of Google Maps API course */

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

// This creates a click listener to that will open the info window
function wireUpInfoWindow (index, marker) {
    marker.addListener("click", function() {
        giveInfoWindowSomeInfo(this, model.myInfoWindow, model.locations[index]);
    });
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

        wireUpInfoWindow(i, marker);

        model.markers.push(marker);
    }
        // Put each marker on the map and then extend the bounds of the map to include all markers
    model.bounds = new google.maps.LatLngBounds();
    for (var j = 0; j<model.markers.length; j++) {
        model.markers[j].setMap(model.map);
        model.bounds.extend(model.markers[j].position);
    }
    model.map.fitBounds(model.bounds);
}

function giveInfoWindowSomeInfo(marker, infowindow, dataObject) {
    function stopBouncing() {
        infowindow.marker.setAnimation(null);
    }
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
            infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(stopBouncing, 2500);
        }
        infowindow.open(model.map, marker);
    }
}
// End map stuff

// Begin wiki api stuff
var wikiRequestTimeout = setTimeout(function() {
    $("#wiki-popout").append("<p style='color: white;'>Failed to get wikipedia resources</p> <p>Please reload page</p>");
}, 4000);


$.ajax( {
    url: "http://en.wikipedia.org/w/api.php?action=opensearch&search=Phoenix, AZ&callback=wikiCallBack",
    dataType: 'jsonp',
    success: function(response) {
        var articleList = response[1];
        for (var i = 0; i<articleList.length; i++) {
            articleStr = articleList[i];
            var url = "http://en.wikipedia.org/wiki/"+articleStr;
            $("#wiki-popout").append("<li><a href='"+url+"'>"+articleStr+"</a></li>");
        }
        $("#wiki-popout").append("<li><a style='color: white;' href='https://www.wikipedia.org'>Courtesy of Wikipedia API</a></li>");
    clearTimeout(wikiRequestTimeout);
    }
});
// End wiki api stuff

// Begin knockout stuff
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
    myInfoWindow: null,
    bounds: null,
    wikiQuery: "Phoenix, AZ"
};

var ViewModel = function() {
    var self = this;
    // Maniputlating the DOM
    $(document).on("click", "#hamburger-phx", function() {
        $("#slide-menu").toggleClass("menu-hidden");
    });
    $(document).on("click", "#hamburger-wiki", function() {
        $("#wiki-popout").toggleClass("wiki-hidden");
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
    $("#ko-menu").attr("data-bind", "foreach: menuList");
    $(".ko-menu-item").attr("data-bind", "text: title, attr: {id: index}, visible: visibility");
    $("#input-to-filter").attr("data-bind", "value: myInput");
    $("#filter-btn").attr("data-bind", "click: doFilter");
    $("#filter-btn-refresh").attr("data-bind", "click: resetFilter");

    self.menuList = ko.observableArray([]);
    model.locations.forEach(function(locationItem, index) {
        self.menuList.push({"title": locationItem.title, "index": "ko-menu-item-"+index, "visibility": ko.observable(true)});
    });
    self.myInput = ko.observable("Filter here...");
    self.doFilter = function() {
        self.checkFilter(self.menuList(), self.myInput().toLowerCase());
    };
    self.checkFilter = function(passedArray, searchTerm) {
        passedArray.forEach(function(passedItem, index){
            // Only filter if item is already visible. Works for subsequent filtering.
            if (passedItem.visibility() === true) {
                if (passedItem.title.toLowerCase().search(searchTerm) != -1) {
                    passedItem.visibility(true);
                } else {
                    passedItem.visibility(false);
                    model.markers.forEach(function(markerItem) {
                        if (passedItem.title == markerItem.title) {
                            markerItem.setMap(null);
                        }
                    });
                    // if map has been moved, fit bounds again to bring it where it should be based on filter
                    model.map.fitBounds(model.bounds);
                }
            }
        });
    };
    // reset menuList item visibility
    self.resetFilter = function() {
        self.menuList().forEach(function(menuItem) {
            menuItem.visibility(true);
        });
        // show all markers
        model.markers.forEach(function(markerItem) {
            markerItem.setMap(model.map);
            model.bounds.extend(markerItem.position);
        });
        // show default bounds again
        model.map.fitBounds(model.bounds);
    };
};
ko.applyBindings(new ViewModel());
// End knockout stuff
