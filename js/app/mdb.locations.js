var directionTab = 2;

// Initialise the Location forms and lists
jQuery.initialiseLocations = function() {
	
	$("#showall")	
		.button()
		.click(function(){
			$.loadLocations();
	});
	
	//	Add new location
	$('#show-form-add-point')
		.button()
		.click(function() {
			$('#add-point #location_id').val("");
			$('#add-point #name').val("");
			$('#add-point #address').val("");
			$('#add-point #url').val("");
			$('#add-point #phone').val("");				
			$('#add-point #type').val("Accomodation");				
			$('#form-add-point').dialog('open');
	});
	
	// Location type selector
	$("#select-location-type")		
		.change(function(){
			$.loadLocations();
		});
		
	// Copy textarea value
	$("#journal_textarea")		
		.change(function(){
				$("#journal").val($("#journal_textarea").val());
		});
	
	// Add new location dialog
	$("#form-add-point").dialog({
		autoOpen: false,
		height: 320,
		width: 350,
		modal: true,
		title: 'Add New Location',
		buttons: {
			'Save Location': function() {					
				$.geoEncode();
				$(this).dialog('close');
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			// 
		}
	});
	
	// Load the locations.
	$.loadLocations();

};

// Load the location list and markers
jQuery.loadLocations = function() {

		// Clear the map and all other forms
		$('#directions').empty();			
		$('#list').empty();					
		$('#center-tabs').tabs('disable', directionTab); 		
		$('#location_list').empty();
		$('.location_select').empty();
		map.clearOverlays();
		bounds = new GLatLngBounds();	
	
		// Get the current locatio type selector
		var type = $("#select-location-type").val();
		
		// Retrieve the list of locations
		$.getJSON("location/jsonlist?type="+type + "&trip=" + currentTrip, function(json) {
			// do stuff in step #11		
			if (json.Locations.length > 0) {
				for (i=0; i<json.Locations.length; i++) {			    
					var location = json.Locations[i];				
					$.addLocation(location);				
				}
				$.zoomToBounds();
			}
		});
	
};

// Edit a location (load the form)
jQuery.editLocation = function(locationId) {
		
		$.blockUI({message: 'Loading location ...',css: blockUI_progress});	
		
		$.getJSON("location/show/"+locationId, function(json) {
			// do stuff in step #11		
			if (json.status = "success" ) {
				$('#add-point #location_id').val(json.data.id);
				$('#add-point #name').val(json.data.name);
				$('#add-point #address').val(json.data.address);
				$('#add-point #url').val(json.data.url);
				$('#add-point #phone').val(json.data.phone);
				$('#add-point #type').val(json.data.type);
				$('#form-add-point').dialog('open');
				$.unblockUI();
			}
		});
		
};

// Delete a location
jQuery.deleteLocation = function(locationId) {
	
	$.blockUI({message: 'Deleting location ...',css: blockUI_progress});				
	$.getJSON("location/delete/"+locationId, function(json) {		
		// Reload the locations
		if (json.status == "success" ) {			 
			 $.loadLocations();
			 $.unblockUI();
		} else {
			$.blockUI({message: '<h3>I was unable to delete the location due to a fault in the database, e.g. there may be dependent routes or journals.<h3>',timeout:2000,css: blockUI_fail});	
		}
	});
	
};

// Geo-encode an address
jQuery.geoEncode = function() {
	var address = $("#add-point input[name=address]").val();
	$.blockUI({message: 'Saving location ...',css: blockUI_progress});				
	geo.getLocations(address, function (result){
		if (result.Status.code == G_GEO_SUCCESS) {
			geocode = result.Placemark[0].Point.coordinates;
			$.savePoint(geocode);
		} else {
			var reason="Code "+result.Status.code;
			if (reasons[result.Status.code]) {
				reason = reasons[result.Status.code]
			} 			
			// TODO: Add alert bos with the error						
			$.blockUI({message: 'I was unable to save the location due to: ' + reason,timeout:2000,css: blockUI_fail});					
			geocode = false;
		}
	});
};

// Save a location

jQuery.savePoint = function(geocode) {
	
	var data = $("#add-point :input").serializeArray();
	
	data[data.length] = { name: "lng", value: geocode[0] };
	data[data.length] = { name: "lat", value: geocode[1] };
	data[data.length] = { name: "trip_id", value: currentTrip };
	
	$.post($("#add-point").attr('action'), data, function(json){
		$("#add-point .error").fadeOut();
		if (json.status == "fail") {
			$.blockUI.defaults.css = {}; 
			$.blockUI({message: '<h3>I was unable to save the location due to a fault in the database.<h3>',timeout:2000,css: blockUI_fail});						
		}
		if (json.status == "success") {
			$("#add-point :input[name!=action]").val("");
			$.blockUI({message: 'Saved!',timeout:500,css: blockUI_success});
			var location = json.data;
			$.loadLocations();
		}
	}, "json");
}


// Add a location to the map
jQuery.addLocation = function(location, l_map) {
	
	l_map = typeof(l_map) != 'undefined' ? l_map : 'main';
	
    var point = new GLatLng(location.lat, location.lng);		
	
	 // Create a lettered icon for this point using our icon class   
    var letteredIcon = new GIcon(baseIcon);    
   if(location.type == "Restaurant") {
		letteredIcon.image = "http://google-maps-icons.googlecode.com/files/restaurant.png";
	}
   if(location.type == "Accomodation") {
		letteredIcon.image = "http://google-maps-icons.googlecode.com/files/villa.png";
	}
	if(location.type == "Booked") {
		letteredIcon.image = "http://google-maps-icons.googlecode.com/files/home.png";
	}	
	if(location.type == "Camping") {
		letteredIcon.image = "http://google-maps-icons.googlecode.com/files/tent.png";
	}	
	if(location.type == "POI") {
		letteredIcon.image = "http://google-maps-icons.googlecode.com/files/info.png";
	}	
   
     // Set up our GMarkerOptions object
	 markerOptions = { icon:letteredIcon };

	 var marker = new GMarker(point, markerOptions);
	
	 GEvent.addListener(marker, "click", function() {
        marker.openInfoWindowHtml("<span style='color: #000000;'>" + location.name + '<br/>'  + location.address +'<br/><a target="_new" href="'  + location.url + '">'+ location.url +'</a><br/>' + location.phone + "</span");
      });
	  	  
      if(l_map == 'main') {
		map.addOverlay(marker);	
		bounds.extend(marker.getPoint());
	  } else {
		journal_map.clearOverlays();
		journal_map.addOverlay(marker);	
		journal_bounds.extend(marker.getPoint());
	 }
	  
	
	 if(l_map == 'main') {
		// Add to list in left bar
		$("<li>")
			.html('<div class="show_location"><div id="showlocation_' + location.id+'" title="Show" style="float: left; width: 100px;">' + location.name + '</div><a style="float: right" class="delete_location" id="deletelocation_' + location.id+'" title="Delete"><img src="css/delete.png" border="0"/></a><a style="float: right" class="edit_location" id="editlocation_' + location.id+'" title="Edit"><img src="css/edit.png" border="0"/></a><div style="clear:both"/></div>')
			.appendTo("#location_list");

		// Configure Show clicker
		$("#showlocation_" + location.id)		
			.click(function(){
				$.showMarker(marker);
			})
			.css('width','75%')		
		
		// Configure Delete clicker
		$("#deletelocation_" + location.id)
			.click(function(){
				$.deleteLocation(location.id);
			})
		
		// Configure Edit clicker
		$("#editlocation_" + location.id)
			.click(function(){
				$.editLocation(location.id);
		})	
		
		// Add to list of locations
		$("<div>")
			.html("<h3>" + location.name + "</h3><b>Address: </b>" + location.address + ", <b>Phone:</b>" + location.phone + "<br/><b>URL:&nbsp;</b><a target='_new' href='" + location.url + "'>" + location.url + "</a>")
			.click(function(){
				$.showMarker(marker);
			})
			.appendTo("#list");	
		
		// Add to option list
		$("<option>")
			.html(location.name)
			.val(location.id)
			.appendTo(".location_select");
	}
};

// Move the map to a marker
jQuery.showMarker = function(marker){
	$('#center-tabs').tabs('select', 0);
	var markerOffset = map.fromLatLngToDivPixel(marker.getPoint());
	// map.panTo(marker.getLatLng());		
	map.setCenter(marker.getLatLng(),11);
}

// Zoom the map to full bounds
jQuery.zoomToBounds = function() {
	map.setCenter(bounds.getCenter());
	map.setZoom(map.getBoundsZoomLevel(bounds));
}

	