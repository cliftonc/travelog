<?php defined('SYSPATH') OR die('No direct access allowed.');
class Location_Controller extends Controller
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
		$row = ORM::factory('location',$id);
		$this->_success(array('id'=>$row->id,'name' => $row->name, 'lat' => $row->lat, 'lng' => $row->lng,'address'=>$row->address,'url'=>$row->url,'phone'=>$row->phone,'type'=>$row->type));		
	}
 
    public function delete($id)
	{
		$status = 'success';		
		$loc = ORM::factory('location',$id);
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
	
	public function save()
    {			
			
			if($_POST['location_id']) {
				$loc = ORM::factory('location',$_POST['location_id']);
			} else {
				$loc = ORM::factory('location');
			}	
				
			$loc->name=$_POST['name'];
			$loc->address=$_POST['address'];
			$loc->lat=$_POST['lat'];
			$loc->lng=$_POST['lng'];
			$loc->url=$_POST['url'];
			$loc->phone=$_POST['phone'];
			$loc->type=$_POST['type'];							$loc->trip_id=$_POST['trip_id'];			
		    $loc->save();
		
			$this->_success(array('id'=>$loc->id,'lat' => $_POST['lat'], 'lng' => $_POST['lng'], 'name' => $_POST['name'],'address'=>$_POST['address'],'url'=>$_POST['url'],'phone'=>$_POST['phone'],'type'=>$_POST['type']));
			
	}
	
	public function jsonlist()  {		$trip = $_GET['trip'];				$type = $_GET['type'];				
		if($type != 'All') {
			$locations = ORM::factory('location')->where('type',$type)->where('trip_id',$trip)->find_all();
		} else {
			$locations = ORM::factory('location')->where('trip_id',$trip)->find_all();
		}
		
		$points = array();
		foreach ($locations as $row)
		{
			array_push($points, array('id'=>$row->id,'name' => $row->name, 'lat' => $row->lat, 'lng' => $row->lng,'address'=>$row->address,'url'=>$row->url,'phone'=>$row->phone,'type'=>$row->type));
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