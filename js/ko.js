function initKO() {
    // Create local copy of locations array from Google Maps
    var koLocationArray = foursquareLocationArray;

    var model = {koLocationArray};

    var ViewModel = function() {
        var self = this;
        // This imports the titles property of all maps location array objects into a new array
        this.menuList = ko.observableArray([]);
        model.koLocationArray.forEach(function(locationItem, index) {
            self.menuList.push({"title": locationItem.title, "index": "ko-menu-item-"+index});
        });
    };

    $("#ko-menu").attr("data-bind", "foreach: menuList");
    $(".ko-menu-item").attr("data-bind", "text: title, attr: {id: index}");

    ko.applyBindings(new ViewModel());
    // Non-KO JS
    $(document).on("click", "#hamburger", function() {
        $("#slide-menu").toggleClass("menu-hidden");
    });
    // Couldn't get these to work in a loop
    $(document).on("click", "#ko-menu-item-0", function() {
        $("#slide-menu").toggleClass("menu-hidden");
        google.maps.event.trigger(markers[0], 'click');
    });
    $(document).on("click", "#ko-menu-item-1", function() {
        $("#slide-menu").toggleClass("menu-hidden");
        google.maps.event.trigger(markers[1], 'click');
    });
    $(document).on("click", "#ko-menu-item-2", function() {
        $("#slide-menu").toggleClass("menu-hidden");
        google.maps.event.trigger(markers[2], 'click');
    });
    $(document).on("click", "#ko-menu-item-3", function() {
        $("#slide-menu").toggleClass("menu-hidden");
        google.maps.event.trigger(markers[3], 'click');
    });
    $(document).on("click", "#ko-menu-item-4", function() {
        $("#slide-menu").toggleClass("menu-hidden");
        google.maps.event.trigger(markers[4], 'click');
    });
}
