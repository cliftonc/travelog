// Map Globals - into jQuery namespace
var bounds;
var geo;
var reasons = [];
var map;
var baseIcon;

// Mini Journal Map
var journal_bounds;
var journal_map;

// Initialise the Map
jQuery.initialiseMap = function() {
	
	// Map and associated elements
	bounds = new GLatLngBounds();	
	geo = new GClientGeocoder(); 	
	map = new GMap2(document.getElementById('map'),{ });		
	
	// Initialise the GeoLocation reasons 
	reasons[G_GEO_SUCCESS]            = "Success";
	reasons[G_GEO_MISSING_ADDRESS]    = "Missing Address";
	reasons[G_GEO_UNKNOWN_ADDRESS]    = "Unknown Address.";
	reasons[G_GEO_UNAVAILABLE_ADDRESS]= "Unavailable Address";
	reasons[G_GEO_BAD_KEY]            = "Bad API Key";
	reasons[G_GEO_TOO_MANY_QUERIES]   = "Too Many Queries";
	reasons[G_GEO_SERVER_ERROR]       = "Server error";	  
	
	// Create a map	
	map.setUIToDefault();
	var Tsize = new GSize(124, 124);
	map.addControl(new GOverviewMapControl(Tsize));
	
	$.initialiseMapPublic();
	
};

jQuery.initialiseMapPublic = function() {
	
	baseIcon = new GIcon(G_DEFAULT_ICON);
	
   // Create a base icon for all of our markers that specifies the
	// shadow, icon dimensions, etc.	
	baseIcon.shadow = "http://google-maps-icons.googlecode.com/files/shadow.png";
	baseIcon.iconSize = new GSize(24, 28);
	baseIcon.shadowSize = new GSize(42,28);
	baseIcon.iconAnchor = new GPoint(13, 30);
	baseIcon.infoWindowAnchor = new GPoint(9, 2);
	
};


