var blockUI_progress; 
var blockUI_success; 
var blockUI_fail; 

// Init
jQuery.initialiseUtils = function () {		

	blockUI_progress = {'backgroundColor': '#33E', 'font-size': '14px', 'padding': '20px', 'color': '#fff', 'border': 'none'}; 
	blockUI_success = {'backgroundColor': '#3E3', 'font-size': '14px', 'padding': '20px', 'color': '#fff', 'border': 'none'}; 
	blockUI_fail = {'backgroundColor': '#E33', 'font-size': '14px', 'padding': '20px', 'color': '#fff', 'border': 'none'}; 
	
	// block ui globals
	$.blockUI.defaults.css = {}; 	

		$('#home_link')			
			.click(function() {
				$('#journal_summary').show();
				$('#journal_view').hide();				
			});
	
	
};



