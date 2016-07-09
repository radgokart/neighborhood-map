function initKO() {

    var ViewModel = function() {
        var self = this;
        // This imports the titles property of all maps location array objects into a new array
        this.menuList = ko.observableArray([]);
        locations.forEach(function(locationItem, index) {
            self.menuList.push({"title": locationItem.title, "index": "ko-menu-item-"+index});
        });
    };

    $("#ko-menu").attr("data-bind", "foreach: menuList");
    $(".ko-menu-item").attr("data-bind", "text: title, attr: {id: index}");

    ko.applyBindings(new ViewModel());

    $(document).on("click", "#hamburger", function() {
        $("#slide-menu").toggleClass("menu-hidden");
    });

}
