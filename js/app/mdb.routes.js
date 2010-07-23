// Initialise the Map
jQuery.initialiseRoutes = function() {
	
			
	$("#add-route").submit(function(){		
		saveRoute();
		return false;
	});
	
	 $("#form-add-route").dialog({
			autoOpen: false,
			height: 230,
			width: 350,
			title: 'Add New Route',
			modal: true,
			buttons: {
				'Save Route': function() {					
						$.saveRoute();
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
		
		$('#show-form-add-route')
			.button()
			.click(function() {
				$('#add-route #route_id').val("");
				$('#add-route #description').val("");
				$('#form-add-route').dialog('open');
			});
	
	$.loadRoutes();	
	
};

// Test

jQuery.editRoute = function(routeId) {
	
	$.blockUI({message: 'Loading route ...',css: blockUI_progress});	
	
	$.getJSON("route/show/"+routeId, function(json) {
		// do stuff in step #11		
		if (json.status = "success" ) {
			$('#add-route #route_id').val(json.data.id);
			$('#add-route #description').val(json.data.description);
			$('#add-route #start_location_id').val(json.data.start_location_id);
			$('#add-route #end_location_id').val(json.data.end_location_id);
			$('#form-add-route').dialog('open');
			$.unblockUI();	
		}
	});
	
}

// Delete a route
jQuery.deleteRoute = function(routeId) {
		
	$.blockUI({message: 'Deleting route ...',css: blockUI_progress});		
	
	$.getJSON("route/delete/"+routeId, function(json) {
		// do stuff in step #11		
		if (json.status == "success" ) {
			$.unblockUI();	
			$.loadRoutes();
		} else {
			$.blockUI({message: '<h3>I was unable to delete the route due to a fault in the database, e.g. there may be dependent journals.<h3>',timeout:2000,css: blockUI_fail});	
		}
	});
	
}

jQuery.loadRoutes = function() {
	$('#route_list').empty();
	$.getJSON("route/jsonlist?trip="+currentTrip, function(json) {
		// do stuff in step #11		
		if (json.Routes.length > 0) {
			for (i=0; i<json.Routes.length; i++) {			    
				var route = json.Routes[i];				
				$.addRoute(route);
			}
		}
	});
}

jQuery.showDirections = function(route) {

	$.blockUI({message: 'Loading route map ...',css: blockUI_progress});		
	map.clearOverlays();
	$('#center-tabs').tabs('enable', directionTab); 

	$.getJSON("route/jsonroute/" + route.id, function(json) {
		// do stuff in step #11		
		var  directionsPanel = document.getElementById("directions");
		$('#directions').empty();
		directions = new GDirections(map,directionsPanel);
	    GEvent.addListener(directions, "load", function() { $.unblockUI() });
		directions.load("from: " + json.start_location + " to: " + json.end_location);							
	});
		 
}

jQuery.saveRoute = function() {
	$.blockUI({message: 'Saving route ...',css: blockUI_progress});		
	var data = $("#add-route :input,select").serializeArray();	
	data[data.length] = { name: "trip_id", value: currentTrip };
	
	$.post($("#add-route").attr('action'), data, function(json){		
		if (json.status == "fail") {
			$.blockUI({message: 'Unable to save route due to an issue with the database, check the form values!',timeout:2000,css: blockUI_fail});		
		}
		if (json.status == "success") {
			$("#add-route :input[name!=action]").val("");
			var route = json.data;
			$.blockUI({message: 'Saved!',timeout:500,css: blockUI_success});		
			$.loadRoutes();
		}
	}, "json");
}


jQuery.addRoute = function(route) {		
	
	$("<li>")
		.html('<div class="show_route"><div  id="showroute_' + route.id+'" title="Show" style="float: left; width: 100px;">' + route.description + '</div><a style="float: right" class="delete_route" id="deleteroute_' + route.id+'" title="Delete"><img src="css/delete.png" border="0"/></a><a style="float: right" class="edit_route" id="editroute_' + route.id+'" title="Edit"><img src="css/edit.png" border="0"/></a><div style="clear:both"/></div>')		
		.appendTo("#route_list");
	
	// Add to option list
	$("<option>")
		.html(route.description)
		.val(route.id)
		.appendTo(".route_select");
	
	$("#showroute_" + route.id)
		.click(function(){
			// showMarker(marker);
			$.showDirections(route);
		})
	
	$("#deleteroute_" + route.id)
		.click(function(){
			$.deleteRoute(route.id);
	})
	
	$("#editroute_" + route.id)
		.click(function(){
			$.editRoute(route.id);
	})	
	
}

