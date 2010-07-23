	<?php defined('SYSPATH') OR die('No direct access allowed.');
class Journal_Controller extends Controller
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
		$row = ORM::factory('journal',$id);
		$this->_success(array('id'=>$row->id,'type' => $row->type,'name' => $row->name, 'journal' => $row->journal, 'album' => $row->album, 'posted' => $row->posted, 'location_id' => $row->location_id,'route_id' => $row->route_id ));		
	}
 
    public function delete($id)
	{
		$status = 'success';		
		$loc = ORM::factory('journal',$id);
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
						
			if($_POST['journal_id']) {
				$journal = ORM::factory('journal',$_POST['journal_id']);
			} else {
				$journal = ORM::factory('journal');
			}										
			
			$date = date("Y-m-d H:i:s");
			$journal->name=$_POST['name'];			
			$journal->type=$_POST['journal_type'];			
			$journal->journal=$_POST['journal'];	
			$journal->album=$_POST['album'];			
			$journal->posted=$_POST['posted'];
			$journal->location_id=$_POST['location_id'];			
			$journal->route_id=$_POST['route_id'];			
			$journal->trip_id=$_POST['trip_id'];	
			$journal->save();
		
			$this->_success(array('id'=>$journal->id,'name' => $_POST['name'],'type' => $_POST['journal_type'],'journal' => $_POST['journal'],'album' => $_POST['album'],'posted' => $_POST['posted'],'location_id' => $_POST['location_id'],'route_id' => $_POST['route_id']));
			
	}
	
	public function jsonlist()  {
	
		$trip = $_GET['trip'];			
		$journals = ORM::factory('journal')->where('trip_id',$trip)->find_all();
		$points = array();
		foreach ($journals as $row)
		{
			array_push($points, array('id'=>$row->id,'type' => $row->type,'name' => $row->name, 'journal' => $row->journal, 'album' => $row->album, 'posted' => $row->posted, 'location_id' => $row->location_id,'route_id' => $row->route_id));
		}
		echo json_encode(array('journals' => $points));
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