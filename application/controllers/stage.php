<?php defined('SYSPATH') OR die('No direct access allowed.');
class Stage_Controller extends Template_Controller
{

	protected $db;
    protected $session;
	public $template = 'kohana/template';
 
    public function __construct()
    {
        parent::__construct(); // This must be included
 
        $this->db = Database::instance();
        $this->session = Session::instance();
    }
 
    public function index()
    {
        $stages = ORM::factory('stage')->find_all();
		
		 // Load the view as an object		 		
		$this->template->content = new View('stage_index');
		$this->template->content->stages = $stages;		         				
		
    }
 
    public function view($stage_id)
    {
        $stage = ORM::factory('stage',$stage_id);
		$this->template->content = $stage->name;
    }
	
	public function map() 
	{
	
		
	
		// Create a new Gmap
		$map = new Gmap('map', array
		(
			'ScrollWheelZoom' => TRUE,
			'Dragging' => TRUE,
			'InfoWindow' => TRUE,
			'DoubleClickZoom' => TRUE,
			'ContinuousZoom' => TRUE,
			'GoogleBar' => TRUE,	
			
		));

		// Set the map center point
		$map->center(51.55271,-0.186649, 5)->controls('large')->overview(200,200)->types('G_NORMAL_MAP', 'add');

		// Add a custom marker icon
		$map->add_icon('tinyIcon', array
		(
			'image' => 'http://labs.google.com/ridefinder/images/mm_20_red.png',
			'shadow' => 'http://labs.google.com/ridefinder/images/mm_20_shadow.png',
			'iconSize' => array('12', '20'),
			'shadowSize' => array('22', '20'),
			'iconAnchor' => array('6', '20'),
			'infoWindowAnchor' => array('5', '1')
	    ));

		// Add a new marker
		$map->add_marker(51.55271,-0.186649, '<strong>ITV, London</strong><p>Hello world!</p>', array('icon' => 'tinyIcon', 'draggable' => true, 'bouncy' => true));
		$map->add_marker(51.55271,-0.186649, '<strong>ITV, London</strong><p>Hello world!</p>', array('icon' => 'tinyIcon', 'draggable' => true, 'bouncy' => true));
		
		$this->template->content = new View('stage_map');		
		$this->template->content->api_url = Gmap::api_url();
		$this->template->content->map = $map->render();
	
	}
	
	public function create()
    {
		$stage = ORM::factory('stage');
		$stage->name='Hello ORM';
		$stage->save();
		
		$this->template->content = "New Object Created!";
		
    }	
	
	public function delete($id)
	{
		$loc = ORM::factory('location',$id);
		$loc->delete();
		header('Location: /mdb/index.html');
		exit;
	}
	
	public function save()
    {
				if ($_POST['action'] == 'savepoint') {
				$name = $_POST['name'];
				if(preg_match('/[^\w\s]/i', $name)) {
					$this->_fail('Invalid name provided.');
				}
				if(empty($name)) {
					$this->_fail('Please enter a name.');
				}
			}
			
			$loc = ORM::factory('location');
			$loc->name=$name;
			$loc->address=$_POST['address'];
			$loc->lat=$_POST['lat'];
			$loc->lng=$_POST['lng'];
			$loc->url=$_POST['url'];
			$loc->phone=$_POST['phone'];
		    $loc->save();
		
			$this->_success(array('id'=>$loc->id,'lat' => $_POST['lat'], 'lng' => $_POST['lng'], 'name' => $name,'address'=>$_POST['address'],'url'=>$_POST['url'],'phone'=>$_POST['phone'],));
			
	}
	
	public function jsonlist()  {
	
		$locations = ORM::factory('location')->find_all();
		$points = array();
		foreach ($locations as $row)
		{
			array_push($points, array('id'=>$row->id,'name' => $row->name, 'lat' => $row->lat, 'lng' => $row->lng,'address'=>$row->address,'url'=>$row->url,'phone'=>$row->phone));
		}
		echo json_encode(array('Locations' => $points));
		exit;
	}
	
	function _success($data) {
		
	  die(json_encode(array('status' => 'success', 'data' => $data)));
}
	
  function _fail($message)
	{
		die(json_encode(array('status' => 'fail', 'message' => $message)));		
    }
	
}
?>