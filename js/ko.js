function initKO() {
    // Create local copy of locations array from Google Maps
    var googleMapsLocationData = locations;

    var ViewModel = function() {
        var self = this;
        // This imports the titles property of all maps location array objects into a new array
        this.menuList = ko.observableArray([]);
        googleMapsLocationData.forEach(function(locationItem, index) {
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

}
