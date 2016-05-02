// Here is the javascript setup for a basic map:

// Enter your mapbox map id here to reference it for the base layer,
// this one references the ugly green map that I made.
var mapId = 'clavicon.019h2f2e';

// And this is my access token, use yours.
var accessToken = 'pk.eyJ1IjoiY2xhdmljb24iLCJhIjoiY2lucWJvYWdxMTBkNXR2bHllZmdleGpxNyJ9.55RZs-Oc-J189elv7Q5DFQ';

// Create the map object with your mapId and token,
// referencing the DOM element where you want the map to go.
L.mapbox.accessToken = accessToken;
var map = L.mapbox.map('map', mapId);

// Set the initial view of the map to the whole US
//map.setView([39, -96], 4);

// Great, now we have a basic web map!

var dataFileToAdd = 'data/restaurants.geojson';

var featureLayer = L.mapbox.featureLayer();  //empty feature layer object
	featureLayer.loadURL(dataFileToAdd);	//load the data into this object
	featureLayer.addTo(map);	//now add this layer with data into the map element

//when the feature is 'ready' and loaded, each feature (which is called a Layer here for some reason in eachLayer)
//is given an icon with color, size, and symbol
featureLayer.on('ready', function(){
	this.eachLayer(function(layer){
    	layer.setIcon(L.mapbox.marker.icon({
        	"marker-color": "#8834bb",
          	"marker-size": "small",
          	"marker-symbol": "restaurant"
        }))
    })
  	//the map extent is set to the extent of the data loaded in featureLayer
    map.fitBounds(featureLayer.getBounds());	
})

//this section is commented out because we are doing something more complicated on 'click' below
/*
featureLayer.on('ready', function(){
	this.eachLayer(function(layer){
    	layer.bindPopup('Welcome to ' + layer.feature.properties.name);
    })
})
*/

// this is a function for what to do when a feature is clicked on
// instead of a popup it creates a sidebar with information
// so this function must grab the geojson information like "phone number" and such
// and create a <div> and fill it with that information; so a lot of this function is 
// actually translating the geojson info into HTML to append into the new <div> being created
// and this <div> sits inside the sidebar <div> that has already been defined in index.html.
var clickHandler = function(e){
	$('#info').empty();
   
  	var feature = e.target.feature;
  	
  	$('#sidebar').fadeIn(400, function(){
    	var info = '';
      
      	info += '<div>';
      	info += '<h2>' + feature.properties.name + '</h2>';
      	if (feature.properties.cuisine) {
          	info += '<p>' + "This restaurant features " + feature.properties.cuisine + '<p>';
        }
      	else if (feature.properties.phone) {
        	info += '<p>' + "Phone number: " + feature.properties.phone + '</p>';
        }
      	else if (feature.properties.website) {
        	info += '<p>' + '<a href=" + feature.properties.website + ">' + "Website: " + feature.properties.website + '</a></p>';
        }
      	else {
        	info += '<p>No restaurant info available.</p>';
        }
      	info += '</div>';
      	$('#info').append(info);
    })
}

// This actually calls the function we made above, when the event 'click' happens to a feature.
featureLayer.on('ready', function(){
	this.eachLayer(function(layer){
    	layer.on('click', clickHandler)
    })
})

// The sidebar then fades out when you 'click' off somewhere in the empty 'map' object, which
// in this case is anywhere in the map that is not a featureLayer object. 
map.on('click', function(){
	$('#sidebar').fadeOut(200);
})

var myLocation = L.mapbox.featureLayer().addTo(map);

map.on('locationfound',function(e){
	myLocation.setGeoJSON({
      	type: 'Feature',
      	geometry: {
        	type: 'Point',
          	coordinates: [ e.latlng.lng, e.latlng.lat]
        },
      	properties: {
        	"title": "Here I am!",
          	"marker-color": "#ff8888",
          	"marker-symbol": "star"
        }
    })
})

map.locate({setView: true)




