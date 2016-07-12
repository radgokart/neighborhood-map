function mapError() {
    alert("Error loading Google Maps");
}

function initKO() {
    var model = {
        markers: [],
        map: null,
        locations: [{
            title: 'Lux Central',
            location: {
                lat: 33.5006054,
                lng: -112.0742918
            }
        }, {
            title: 'Chase Field',
            location: {
                lat: 33.4455264,
                lng: -112.0666641
            }
        }, {
            title: 'Tres Leches Cafe',
            location: {
                lat: 33.51838850000001,
                lng: -112.063614
            }
        }, {
            title: 'Crescent Ballroom',
            location: {
                lat: 33.45179939999999,
                lng: -112.076835
            }
        }, {
            title: 'The Westin Phoenix Downtown',
            location: {
                lat: 33.451666,
                lng: -112.0730457
            }
        }],
        myInfoWindow: null,
        bounds: null
    };

    var ViewModel = function() {
        var self = this;
        // Inital wiki list item
        self.wikiData = ko.observableArray([{
            title: "Phoenix, AZ",
            url: "https://en.wikipedia.org/wiki/Phoenix,_Arizona"
        }, {
            title: "Courtesy of Wikipedia API",
            url: "https://www.mediawiki.org/wiki/API:Main_page"
        }]);

        self.clickHamburgerPHX = function() {
            if (self.isSlideMenuVisible() === false) {
                self.isSlideMenuVisible(true);
            } else {
                self.isSlideMenuVisible(false);
            }
        };

        self.isSlideMenuVisible = ko.observable(false);

        self.clickHamburgerWiki = function() {
            if (self.isWikiMenuVisible() === false) {
                self.isWikiMenuVisible(true);
            } else {
                self.isWikiMenuVisible(false);
            }
        };

        self.isWikiMenuVisible = ko.observable(false);

        self.clickKoMenuItem = function(item, event) {
            self.clickHamburgerPHX();
            // Takes the last character of the item's id that was clicked on and uses it as an index. This works because I purposely appended the index to the id when I created the menu's <li> items.
            google.maps.event.trigger(model.markers[event.target.id.slice(-1)], 'click');
        };

        self.menuList = ko.observableArray([]);
        model.locations.forEach(function(locationItem, index) {
            self.menuList.push({
                "title": locationItem.title,
                "index": "ko-menu-item-" + index,
                "visibility": ko.observable(true)
            });
        });
        self.myInput = ko.observable("");
        self.doFilter = function() {
            self.checkFilter(self.menuList(), self.myInput().toLowerCase());
        };
        self.checkFilter = function(passedArray, searchTerm) {
            passedArray.forEach(function(passedItem, index) {
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
            // show default bounds and clear input box
            self.myInput("");
            // reset wiki articles
            self.wikiData.removeAll();
            if (model.myInfoWindow !== null) {
                model.myInfoWindow.close();
            }
            self.wikiData.push({
                title: "Phoenix, AZ",
                url: "https://en.wikipedia.org/wiki/Phoenix,_Arizona"
            });
            self.wikiData.push({
                title: "Courtesy of Wikipedia API",
                url: "https://www.mediawiki.org/wiki/API:Main_page"
            });
            model.map.fitBounds(model.bounds);
        };

        // Begin map stuff
        /* Inspiration drawn from Project_Code_6_StaticMapsAndStreetViewImagery.html of Google Maps API course */

        // Callback function that run once maps API is loaded
        self.initMap = function() {
            model.map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 33.447641,
                    lng: -112.073550
                },
                zoom: 12,
                scrollwheel: false,
                streetViewControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                }
            });

            model.myInfoWindow = new google.maps.InfoWindow();
            self.createMarkers();
        };

        self.createMarkers = function() {
            for (var i = 0; i < model.locations.length; i++) {
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

                self.wireUpInfoWindow(i, marker);

                model.markers.push(marker);
            }
            // Put each marker on the map and then extend the bounds of the map to include all markers
            model.bounds = new google.maps.LatLngBounds();
            for (var j = 0; j < model.markers.length; j++) {
                model.markers[j].setMap(model.map);
                model.bounds.extend(model.markers[j].position);
            }
            model.map.fitBounds(model.bounds);
        };

        // This creates a click listener to that will open the info window
        self.wireUpInfoWindow = function(index, marker) {
            marker.addListener("click", function() {
                self.giveInfoWindowSomeInfo(this, model.myInfoWindow, model.locations[index]);
                // Begin wiki api stuff
                var wikiRequestTimeout = setTimeout(function() {
                    self.wikiData.removeAll();
                    self.wikiData.push({
                        title: "Failed to load Wikipedia",
                        url: "#"
                    });
                }, 4000);
                $.ajax({
                    url: "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&callback=wikiCallBack",
                    dataType: 'jsonp',
                    success: function(response) {
                        // articleList is just an array of strings
                        var articleList = response[1];
                        var tempArray = [];
                        if (articleList.length < 1) {
                            tempArray.push({
                                title: "No articles found",
                                url: "#"
                            });
                        } else {
                            for (var i = 0; i < articleList.length; i++) {
                                articleStr = articleList[i];
                                tempArray.push({
                                    title: articleStr,
                                    url: "http://en.wikipedia.org/wiki/" + articleStr
                                });
                            }
                        }
                        tempArray.push({
                            title: "Courtesy of Wikipedia API",
                            url: "https://www.mediawiki.org/wiki/API:Main_page"
                        });
                        // Clear wikiData array's contents and then update with tempArray
                        self.wikiData.removeAll();
                        tempArray.forEach(function(item) {
                            self.wikiData.push(item);
                        });
                        // Cancel error message
                        clearTimeout(wikiRequestTimeout);
                        if (self.isWikiMenuVisible() === false) {
                            self.clickHamburgerWiki();
                        }
                    }
                });
                // End wiki api stuff
            });
        };

        self.giveInfoWindowSomeInfo = function(marker, infowindow, dataObject) {
            function stopBouncing() {
                infowindow.marker.setAnimation(null);
            }
            if (infowindow.marker != marker) {
                // Clear infowindow content.
                infowindow.setContent('');
                infowindow.marker = marker;
                // Make sure the marker is cleared when the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
                infowindow.setContent("<div>" + dataObject.title + "</div>" +
                    "<div>lat: " + dataObject.location.lat + ", lng: " + dataObject.location.lng + "</div>");
                if (infowindow.marker.getAnimation() !== null) {
                    infowindow.marker.setAnimation(null);
                } else {
                    infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(stopBouncing, 400);
                }
                infowindow.open(model.map, marker);
            }
        };
        // End map stuff
        self.initMap();
    };
    ko.applyBindings(new ViewModel());
}
