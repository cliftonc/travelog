	<?php defined('SYSPATH') OR die('No direct access allowed.');
class Route_Controller extends Controller
{

	protected $db;
    protected $session;	
 
    public function __construct()
    {
        parent::__construct(); // This must be included
 
        $this->db = Database::instance();
        $this->session = Session::instance();
    }
 
    public function index()
    {
		header('Location: /mdb');
        exit();				
    }
 
	public function show($id)
	{
		$row = ORM::factory('route',$id);
		$this->_success(array('id'=>$row->id,'description' => $row->description, 'start_location_id' => $row->start_location_id, 'end_location_id' => $row->end_location_id));		
	}
 
    public function delete($id)
	{
		$status = 'success';		
		$loc = ORM::factory('route',$id);
		try {
			$loc->delete();
		} catch(Exception $e) {
			$status = 'fail';			
		}		
		if($status == 'success') {
			$this->_success("");		
		} else {
			$this->_fail("Unable to delete the selected record.");		
		}	
	}
 
 	 public function jsonroute($id)
	{
		$route = ORM::factory('route',$id);		
		
		$start_lat = (string) $route->start_location->lat;
		$start_lng = (string) $route->start_location->lng;		
		$start = $start_lat . "," . $start_lng;
		
		$end_lat = (string) $route->end_location->lat;
		$end_lng = (string) $route->end_location->lng;		
		$end = $end_lat . "," . $end_lng;
		
		die(json_encode(array('start_location' =>$start, 'end_location' => $end)));
	}
	
	public function save()
    {
						
			if($_POST['route_id']) {
				$route = ORM::factory('route',$_POST['route_id']);
			} else {
				$route = ORM::factory('route');
			}										
			
			$route->description=$_POST['description'];			
			$route->start_location_id=$_POST['start_location_id'];
			$route->end_location_id=$_POST['end_location_id'];			
			$route->trip_id=$_POST['trip_id'];			
		    $route->save();
		
			$this->_success(array('id'=>$route->id,'description' => $_POST['description'],'start_location_id' => $_POST['start_location_id'],'end_location_id' => $_POST['end_location_id']));
			
	}
	
	public function jsonlist()  {
	
		$trip = $_GET['trip'];			
		$routes = ORM::factory('route')->where('trip_id',$trip)->find_all();
	
	$points = array();
		foreach ($routes as $row)
		{
			array_push($points, array('id'=>$row->id,'description' => $row->description, 'start_location_id' => $row->start_location_id, 'end_location_id' => $row->end_location_id));
		}
		echo json_encode(array('Routes' => $points));
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