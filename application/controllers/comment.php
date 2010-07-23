	<?php defined('SYSPATH') OR die('No direct access allowed.');
class Comment_Controller extends Controller
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
		$row = ORM::factory('comment',$id);
		$this->_success(array('id'=>$row->id,'journal_id' => $row->journal_id,'name' => $row->name, 'comment' => $row->comment, 'date' => $row->date));		
	}
 
    public function delete($id)
	{
		$status = 'success';		
		$loc = ORM::factory('comment',$id);
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
						
		
			$comment = ORM::factory('comment');	
			$comment->name=$_POST['comment_name'];			
			$comment->comment=$_POST['comment_comment'];	
			$comment->journal_id=$_POST['journal_id'];	
			$comment->save();
		
		
		
			// Email
			$journal = ORM::factory('journal',$_POST['journal_id']);
			
			$to = 'clifton.cunningham@gmail.com,saltyann@gmail.com';
			$subject = 'Comment left by ' . $_POST['comment_name'] . ' against ' . $journal->name;
		    $contents =$_POST['comment_comment'];
			 mail($to, $subject, $contents);
		
			$this->_success(array('id'=>$comment->id,'name' => $_POST['comment_name'],'comment' => $_POST['comment_comment'],'journal_id'=>$_POST['journal_id']));
			
	}
	
	public function jsonlist()  {
	
		$journal = $_GET['journal'];			
		$comments = ORM::factory('comment')->where('journal_id',$journal)->find_all();
		$points = array();
		foreach ($comments as $row)
		{
			array_push($points, array('id'=>$row->id,'name' => $row->name, 'comment' => $row->comment, 'date' => $row->date));
		}
		echo json_encode(array('comments' => $points));
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