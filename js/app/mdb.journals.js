// Global for latest
var latestJournal;

// Initialise the Map
jQuery.initialiseJournals = function() {
	
	$.toggleJournalType('Location');
	$("#journal_type").change(function(){		
		$.toggleJournalType($("#journal_type").val());
		return false;
	});	
	
	$('#center-tabs').tabs('disable', 3); 
		
	 $("#form-add-journal").dialog({
			autoOpen: false,
			height: 400,
			width: 650,
			title: 'Add New Journal',
			modal: true,
			resizable: false,
			buttons: {
				'Save Journal': function() {					
					$.saveJournal();
					$(this).dialog('close');
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			},
			close: function() {				
				// $(".wysiwyg").remove(); // Remove the wyswig editor
				$('#add-journal #journal').show();	
			}
		});
		
		$('#posted').datepicker({'dateFormat':'yy-mm-dd'});																				
		
		$('#show-form-add-journal')
			.button()
			.click(function() {
				$('#add-journal #journal_id').val("");
				$('#add-journal #name').val("");																
				$('#add-journal #album').val("");																
				$("#journal_type").val("Location");								
				$('#add-journal #journal').val("");																				
				$('#add-journal #posted').val("");																				
				$.toggleJournalType('Location');				
				$('#form-add-journal').dialog('open');
				// $.initialiseEditor();								
			});
	
	$.loadJournals();	
	
};

jQuery.initialiseEditor = function() {

		
		$('.journal_editor').wysiwyg({
			controls: {
			  
			  strikeThrough : { visible : true },
			  underline     : { visible : true },
			  
			  separator00 : { visible : true },
			  
			  justifyLeft   : { visible : true },
			  justifyCenter : { visible : true },
			  justifyRight  : { visible : true },
			  justifyFull   : { visible : true },
			  
			  separator01 : { visible : true },
			  
			  indent  : { visible : true },
			  outdent : { visible : true },
			  
			  separator02 : { visible : true },
			  
			  subscript   : { visible : true },
			  superscript : { visible : true },
			  
			  separator03 : { visible : true },
			  
			  undo : { visible : true },
			  redo : { visible : true },
			  
			  separator04 : { visible : true },
			  
			  insertOrderedList    : { visible : true },
			  insertUnorderedList  : { visible : true },
			  insertHorizontalRule : { visible : true },
					  			  
			}
		  });
  
};

jQuery.toggleJournalType = function(type) {

	if(type == 'Location') {
		$('#journal_location_select').show();
		$('#journal_route_select').hide();
	} else {
		$('#journal_location_select').hide();
		$('#journal_route_select').show();
	};
};


jQuery.loadJournals = function(l_type) {
	
	l_type = typeof(l_type) != 'undefined' ? l_type : 'admin';
		
	$('#journal_list').empty();
	$('#journal_summary_list').empty();
	
	$.getJSON("journal/jsonlist?trip="+currentTrip, function(json) {
		// do stuff in step #11		
		if (json.journals.length > 0) {
			for (i=0; i<json.journals.length; i++) {			    
				var journal = json.journals[i];				
	
			$.addJournal(journal,l_type);
			}
		}
	});
}

jQuery.saveJournal = function() {
	$.blockUI({message: 'Saving journal ...',css: blockUI_progress});		
	
	var data = $("#add-journal :input").serializeArray();
	data[data.length] = { name: "trip_id", value: currentTrip };
	
	// Manually push other keys
	data.push({'name':'journal','value':$("#journal").val()});	
		
	if($("#location_id option:selected").val() == "") {
		data.push({'name':'location_id','value':""});	
	}
	
	if($("#route_id option:selected").val() == "") {
		data.push({'name':'route_id','value':""});	
	}
	 
	$.post($("#add-journal").attr('action'), data, function(json){		
		if (json.status == "fail") {
			$.blockUI({message: 'Unable to save journal due to an issue with the database, check the form values!',timeout:2000,css: blockUI_fail});		
		}
		if (json.status == "success") {
			$("#add-journal :input[name!=action]").val("");
			var journal = json.data;
			$.blockUI({message: 'Saved!',timeout:500,css: blockUI_success});		
			$.loadJournals();
		}
	}, "json");
}


jQuery.addJournal = function(journal,l_type) {		
	
	if(l_type=='admin') {
			
			$("<li>")
				.html('<div class="show_journal"><div  class="showjournal_' + journal.id+'" title="Show" style="float: left; width: 100px;">' + journal.name + '</div><a style="float: right" class="delete_journal" id="deletejournal_' + journal.id+'" title="Delete"><img src="css/delete.png" border="0"/></a><a style="float: right" class="edit_journal" id="editjournal_' + journal.id+'" title="Edit"><img src="css/edit.png" border="0"/></a><div style="clear:both"/></div>')		
				.appendTo("#journal_list");
			

			$("#deletejournal_" + journal.id)
				.click(function(){
					$.deleteJournal(journal.id);
			})
			
			$("#editjournal_" + journal.id)
				.click(function(){
					$.editJournal(journal.id);
			})	
			
	} else {

			$("<li>")
				.html('<div class="show_journal"><a  href="#" title="Show" class="showjournal_' + journal.id+'" style="float: left;">' + journal.name + '</a></div><div style="clear:both"/>')		
				.appendTo("#journal_list");
	
		$("<li>")
				.html(						
						'<div style="padding-top: 3px;"><a  href="#" title="Open Journal ..." class="showjournal_' + journal.id+'" style="float: left;"><h3 style="margin-top: 0px">' + journal.name + '</a>&nbsp;&nbsp;[@' + journal.posted  + ']</h3></div>' +						
						'<div style="float:left;">' + journal.journal + '</div>' + 	
						'<div style="clear:both;"/>'				
						)		
				.appendTo("#journal_summary_list");	
	
	}
	
	$(".showjournal_" + journal.id)
		.click(function(){
			// showMarker(marker);
			$.showJournal(journal);
		})
	
	
}

jQuery.editJournal = function(journalId) {
	
	$.blockUI({message: 'Loading journal ...',css: blockUI_progress});	
	
	$.getJSON("journal/show/"+journalId, function(json) {
		// do stuff in step #11		
		if (json.status = "success" ) {
			$('#add-journal #journal_id').val(json.data.id);
			$('#add-journal #name').val(json.data.name);
			$('#add-journal #album').val(json.data.album);
			$('#add-journal #journal_type').val(json.data.type);
			$('#add-journal #location_id').val(json.data.location_id);
			$('#add-journal #route_id').val(json.data.route_id);
			$('#add-journal #posted').val(json.data.posted);			
			$('#add-journal #journal').val(json.data.journal);			
			$.toggleJournalType($('#journal_type').val());				
			$('#form-add-journal').dialog('open');
			// $.initialiseEditor();
			$.unblockUI();	
		}
	});
	
}


jQuery.loadJournalComments = function(journal_id) {

	$('#journal_comments').empty(); 

	$.getJSON("comment/jsonlist?journal="+journal_id, function(json) {
		// do stuff in step #11		
		if (json.comments.length > 0) {
			for (i=0; i<json.comments.length; i++) {			    
				var comment = json.comments[i];				
				$.addComment(comment);
			}
		} else {
			$("<div>")
				.html(						
						'<div style="float:left;">No comments yet ... be the first!</div>'		
						)		
				.appendTo("#journal_comments");	
		}
	});
	
};


jQuery.addComment = function(comment) {		
	
		$("<div style='float: left; margin-bottom: 10px;'>")
				.html(						
						'<div style="padding-top: 3px;"><h3 style="margin-top: 0px">' + comment.name + '</a>&nbsp;&nbsp;[@' + comment.date  + ']</h3></div>' +						
						'<div style="float:left;">' + comment.comment + '</div>'		
				)		
				.appendTo("#journal_comments");	
	
}



jQuery.saveComment = function() {

	$.blockUI({message: 'Saving comment ...',css: blockUI_progress});		
	
	var data = $("#add-comment :input").serializeArray();
	if($("#comment_name").val() == "" || $("#comment_comment").val() == '' || ($("#human").val() != 'London' && $("#human").val() != 'london') ) {
		$.blockUI({message: 'You need to add both a name and a comment, and answer the are you a human question correctly!',timeout:2000,css: blockUI_fail});		
	} else {
		$.post($("#add-comment").attr('action'), data, function(json){		
			if (json.status == "fail") {
				$.blockUI({message: 'Unable to save comment due to an issue with the database, check the form values!',timeout:2000,css: blockUI_fail});		
			}
			if (json.status == "success") {
				$("#add-comment :input[name!=action]").val("");
				var comment = json.data;
					$('#journal_id').val(comment.journal_id);

				$.blockUI({message: 'Saved!',timeout:500,css: blockUI_success});		
				$.loadJournalComments(comment.journal_id);
			}
		}, "json");
	}
}



jQuery.showJournal = function(journal) {

	$('#journal_view').show(); 	
	$('#journal_summary').hide(); 	

	$('#center-tabs').tabs('enable', 3); 
	$('#center-tabs').tabs('select', 3); 
	
	$('#journal_view_name').html("<h3>" + journal.name + "</h3>")				
	$('#journal_view_posted').html("<small>" + journal.posted + "</small><br/><br/>")				
	$('#journal_view_journal').html(journal.journal)		
	
	$('#journal_id').val(journal.id);
	$.loadJournalComments(journal.id);
	
	$("#photo_container").empty();	
	
	$("<div id='pwi_photos'>")
		.appendTo("#photo_container");	
		
	$("#pwi_photos").pwi({
	        username: 'clifton.cunningham',
			maxResults: 200,
			thumbSize: 72,     
			thumbCrop: 1, 
			showAlbumDescription: false,
			showPhotoCaption: false,			
			showPhotoCaptionDate: false,
			mode: 'album',
			showSlideshowLink: false,
			album: journal.album,
			photoSize: 640,
			labels: {
				photo: "photo",
				photos: "photos",
				albums: "",
				slideshow: "Display slideshow",
				loading: "Fetching photos ...",
				page: "Page",
				prev: "Previous",
				next: "Next",
				devider: "|"
			},
			albumstore: {},
			photostore: {}
	});
		
		
	if(journal.type == 'Location') {
			$.getJSON("location/show/"+journal.location_id, function(json) {
				// do stuff in step #11		
				if (json.status = "success" ) {					
					// Journal Map
					journal_bounds = new GLatLngBounds();	
					journal_map = new GMap2(document.getElementById('journal_map'),{ });
					journal_map.setUIToDefault();							
					$.addLocation(json.data, 'journal');			
					journal_map.setCenter(new GLatLng(json.data.lat, json.data.lng), 10);			
				}
			});
		} else {
			$.getJSON("route/jsonroute/" + journal.route_id, function(json) {
					// do stuff in step #11		
					journal_bounds = new GLatLngBounds();	
					journal_map = new GMap2(document.getElementById('journal_map'),{ });
					journal_map.setUIToDefault();															
					directions = new GDirections(journal_map);					
					directions.load("from: " + json.start_location + " to: " + json.end_location);							
				});
		};
				
	
}

// Delete a journal
jQuery.deleteJournal = function(journalId) {
		
	$.blockUI({message: 'Deleting journal ...',css: blockUI_progress});		
	
	$.getJSON("journal/delete/"+journalId, function(json) {
		// do stuff in step #11		
		if (json.status == "success" ) {
			$.unblockUI();	
			$.loadJournals();
		} else {
			$.blockUI({message: '<h3>I was unable to delete the journal due to a fault in the database, e.g. there may be dependent journals.<h3>',timeout:2000,css: blockUI_fail});	
		}
	});
	
}