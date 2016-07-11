# My Neighborhood map

###How to run
This is a single page web app that shows some of my favorite places in Phoenix, AZ. It utilizes the Google Maps API to plot these (hardcoded) locations. To run this app, simply run index.html in your browser.

###How to use

-By clicking on the Wikipedia articles hamburger, you will open a sidebar which loads Wikipedia articles using the Wikipedia API. Upon initial run, there will be articles related to the query “Phoenix, AZ”. If a marker on the map is clicked, or an item from the “Cool places in PHX” sidebar is clicked, the Wikipedia sidebar will update with articles related to the name of that place. To close the sidebar, simply click on the hamburger again.

-By clicking on the “Cool places in PHX” hamburger, you will open a sidebar with a list of my favorite places. This sidebar has filter functionality which will filter both the list and markers on the map. The filter can take a piece of any part of the name, and return that name, so “ent” would return “Lux Central” and “Crescent Ballroom.” To use this, simply type in your query and click the filter button. If you want to reset the list and markers back so that everything shows again, click on the refresh button. This will also take you back to the default map bounds. To close the sidebar, simply click on the hamburger again.
