// Initialise the Map
var currentTrip;

jQuery.initialiseTrips = function(l_type) {
			
	l_type = typeof(l_type) != 'undefined' ? l_type : 'admin';
			
	currentTrip = 0;
	
	if(l_type=='admin') {
	 
		 $("#form-manage-trips").dialog({
				autoOpen: false,
				height: 320,
				width: 650,
				title: 'Manage Trips',
				modal: false,
				resizable: false,
				buttons: {	
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function() {
					// 
				}
			});

			$('#show-form-manage-trips')
				.button()
				.click(function() {
					// Add code to load trips
					$('#form-manage-trips').dialog('open');						
				});
				
			$('#trip_date').datepicker({'dateFormat':'yy-mm-dd'});		
				
			$('#add-new-trip')
				.button()
				.click(function() {
					// Add code to load trips
					$.createTrip();				
				});
				
			$('#save-trip')
				.button()
				.click(function() {
					// Add code to load trips
					$.saveTrip();				
				});
				
				// Location type selector
	$("#trip-select")		
		.change(function(){
			currentTrip = $("#trip-select").val();
			$.loadLocations();
			$.loadRoutes();
			$.loadJournals();
		});
		
				
	} else {
	
		// Location type selector
		$("#trip-select")		
			.change(function(){
				    currentTrip = $("#trip-select").val();
					$('#trip-header').html($("#trip-select option[value='" + currentTrip + "']").text());
					$('#journal_summary').show();
				    $('#journal_view').hide();				
					$.loadJournals('public');
			});
		
	}
		
	$.loadTrips(l_type);	
	
};

jQuery.loadTrips = function(l_type) {
	
	l_type = typeof(l_type) != 'undefined' ? l_type : 'admin';
	
	$('#trip_list').empty();	
	$('.trip-select').empty();
	
	$.getJSON("trip/jsonlist", function(json) {
		// do stuff in step #11		
		if (json.trips.length > 0) {
			for (i=0; i<json.trips.length; i++) {			    
				var trip = json.trips[i];

				// Set the default trip
				if(i==0 && currentTrip == 0) {
					
					currentTrip = trip.id;	
					$('#trip-header').html(trip.name);
					
					if(l_type=='admin') {
						$.initialiseLocations();
						$.initialiseRoutes();
						$.initialiseJournals();
					} else {
						$.loadJournals('public');
					}
				}
				
				$.addTrip(trip,l_type);
			}
		}
	});
}

jQuery.changeTrip = function() {
		// Load
}

jQuery.saveTrip = function() {

	$.blockUI({message: 'Saving trip ...',css: blockUI_progress});		
	
	var data = $("#add-trip :input").serializeArray();
	
	$.post($("#add-trip").attr('action'), data, function(json){		
		if (json.status == "fail") {
			$.blockUI({message: 'Unable to save trip due to an issue with the database, check the form values!',timeout:2000,css: blockUI_fail});		
		}
		if (json.status == "success") {
			$("#add-trip :input[name!=action]").val("");
			var trip = json.data;
			$.blockUI({message: 'Saved!',timeout:500,css: blockUI_success});		
			$.createTrip();
			$.loadTrips();
		}
	}, "json");
}


jQuery.addTrip = function(trip,l_type) {		
	
	if(l_type=='admin') {
			
			$("<li>")
				.html('<div class="show_trip"><div  class="showtrip_' + trip.id+'" title="Show" style="float: left; width: 100px;">' + trip.name + '</div><a style="float: right" class="delete_trip" id="deletetrip_' + trip.id+'" title="Delete"><img src="css/delete.png" border="0"/></a><a style="float: right" class="edit_trip" id="edittrip_' + trip.id+'" title="Edit"><img src="css/edit.png" border="0"/></a><div style="clear:both"/></div>')		
				.appendTo("#trip_list");
			
			$("#deletetrip_" + trip.id)
				.click(function(){
					$.deleteTrip(trip.id);
			})
			
			$("#edittrip_" + trip.id)
				.click(function(){
					$.editTrip(trip.id);
			})

		$("<option>")
			.html(trip.name)
			.val(trip.id)
			.appendTo(".trip-select");			
			
	} else {

			$("<li>")
				.html('<div class="show_trip"><a  href="#" title="Show" class="showtrip_' + trip.id+'" style="float: left;">' + trip.name + '</a></div><div style="clear:both"/>')		
				.appendTo("#trip_list");
	
		$("<option>")
			.html(trip.name)
			.val(trip.id)
			.appendTo(".trip-select");		
	
	}
	
	
	
	$(".showtrip_" + trip.id)
		.click(function(){
			// showMarker(marker);
			$.showTrip(trip);
		})
	
	
}

jQuery.editTrip = function(tripId) {
	
	$.getJSON("trip/show/"+tripId, function(json) {
		// do stuff in step #11		
		if (json.status = "success" ) {
			$('#add-trip #trip_id').val(json.data.id);
			$('#add-trip #name').val(json.data.name);	
			$('#add-trip #trip_date').val(json.data.trip_date);	
			$('#save-trip').html("Save Changes");				
		}
	});
	
}

jQuery.createTrip = function() {
	
	       $('#add-trip #trip_id').val("");
			$('#add-trip #name').val("");	
			$('#save-trip').html("Create Trip");			
	
}

// Delete a trip
jQuery.deleteTrip = function(tripId) {	
	
	$.getJSON("trip/delete/"+tripId, function(json) {
		// do stuff in step #11		
		if (json.status == "success" ) {
			$.loadTrips();
		} else {
			// $.blockUI({message: '<h3>I was unable to delete the trip due to a fault in the database, e.g. there may be dependent trips.<h3>',timeout:2000,css: blockUI_fail});	
		}
	});
	
}


