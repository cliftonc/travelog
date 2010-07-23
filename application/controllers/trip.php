	<?php defined('SYSPATH') OR die('No direct access allowed.');
class Trip_Controller extends Controller
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
		$row = ORM::factory('trip',$id);
		$this->_success(array('id'=>$row->id,'name' => $row->name,'trip_date' => $row->date,));		
	}
 
    public function delete($id)
	{
		$status = 'success';		
		$loc = ORM::factory('trip',$id);
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
						
			if($_POST['trip_id']) {
				$trip = ORM::factory('trip',$_POST['trip_id']);
			} else {
				$trip = ORM::factory('trip');
			}										
			
			$trip->name=$_POST['name'];			
			$trip->date=$_POST['trip_date'];			
			$trip->save();
		
			$this->_success(array('id'=>$trip->id,'name' => $_POST['name'],'trip_date' => $_POST['trip_date']));
			
	}
	
	public function jsonlist()  {
	
		$trips = ORM::factory('trip')->find_all();
		$points = array();
		foreach ($trips as $row)
		{
			array_push($points, array('id'=>$row->id,'name' => $row->name,'trip_date' => $row->date));
		}
		echo json_encode(array('trips' => $points));
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