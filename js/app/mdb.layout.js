// UI Layout
jQuery.layoutUI = function() {
  
	// Basic Layout
	$('body').layout({ 
		// applyDefaultStyles: false,
		closable:  false,
		resizable: true,
		east__size: 300
	});
	
	// Make the buttons buttons, the tabs tabs
	$("button").button();	
	$(".ui_tabs").tabs();
	
	// Call Resize UI and set timer on resize
	$.resizeUI();
		  
};

// UI Layout
jQuery.layoutPublicUI = function() {
  
	// Basic Layout
	$('body').layout({ 
		applyDefaultStyles: false,
		closable:  false,
		resizable: false,
		north__size: 50
	});
	
};

// UI Resizer
jQuery.resizeUI = function() {

		// Retrieve window height and width
		var h = $(window).height();
		var w = $(window).width();
		
		// Set core components size based on window height		
		$("#tabs").css('height', h-65 );
		$("#center-tabs").css('height', h-65 );
		$("#east-tabs").css('height', h-65 );
		$("#map").css('height', h-125 );
		$("#directions").css('height', h-125 );
		$("#list").css('height', h-125 );
		$(".ui-tabs-panel").css('height', h-125 );
		$('#east-tabs-2').css('height', h-125 );
		$('#east-tabs-1').css('height', h-125 );		
};


