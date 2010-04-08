<?php defined('SYSPATH') or die('No direct script access.');

class Route_Model extends ORM {

	protected $belongs_to = array('start_location' => 'location', 'end_location' => 'location');
	protected $sorting = array('description' => 'asc');
}

?>