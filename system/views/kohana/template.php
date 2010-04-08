<?php defined('SYSPATH') OR die('No direct access allowed.'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<link href="/mdb/css/main.css" type="text/css" rel="stylesheet">
   <script type="text/javascript" src="http://www.google.co.uk/jsapi?key=ABQIAAAAtN4hECGudqg6epgOA2ksuBRTuAA4jwnjEFdxJeOOthBDmzmzlBR2rYXU8_Qw4xI1UGWOcyhsHIuRKQ"/>
	<script type="text/javascript" charset="utf-8">
		//google.load("jquery", "1.3.1");
		 google.load("maps", "2");				
		 google.setOnLoadCallback(function() {
				var map = new google.maps.Map2(document.getElementById('map'));
				var burnsvilleMN = new GLatLng(44.797916,-93.278046);
				map.setCenter(burnsvilleMN, 8);
		 });
		
	</script>	
	
</head>
<body>		

	<div class="content">
		<?php echo $content ?>
	</div>
	
	<div id="map"></div>

	<div class="performance">
		Rendered in {execution_time} seconds, using {memory_usage} of memory<br />		
	</div>

</body>
</html>