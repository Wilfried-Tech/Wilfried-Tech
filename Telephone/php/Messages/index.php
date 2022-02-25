<?php
if(!isset($_POST['authname'])||!isset($_POST['authpass'])){
  header('Content-type: text/plain','error',401);
  exit('authentification is required');
}else {
  if($_POST['authname']!='Wilfried-Tech'||$_POST['authpass']!= 'jtmlucie63'){
    header('Content-type: text/plain','error',401);
    exit('authentification failed');
  }
}

require_once('../db.php');

if(isset($_POST['action'])){
  if($_POST['action'] == 'POST'){
    $response = $sql->prepare('INSERT INTO Messages(message,sender,receiver,others) VALUES(:message,:sender,:receiver,:others)');
    $response->execute(array(
      'message' => htmlspecialchars($_POST['message']),
      'sender' => $_POST['sender'],
      'receiver' => $_POST['receiver'],
      'others' => $_POST['others']
      ));
    header('Content-type: text/plain','success',200);
    exit('successfull');
  }
  if($_POST['action']=='GET'){
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $query = "SELECT * FROM Messages WHERE (sender=$sender AND receiver=$receiver) OR (sender=$receiver AND receiver=$sender)";
    if($sender==$receiver){
      $query = "SELECT * FROM Messages WHERE (sender=$sender OR receiver=$sender)";
    }
    $res = $sql->query($query);
    $Messages = array();
    while($row = $res->fetch(PDO::FETCH_ASSOC)){
     $Messages[] = $row;
    }
    header('Content-type: text/json','successfull',200);
    echo json_encode($Messages);
    exit;
  }
  if($_POST['action'] == 'PUT'){
    $response = $sql->prepare('UPDATE Messages SET message=:message,others=:others WHERE date = :date');
    $response->execute(array(
      'message' => htmlspecialchars($_POST['message']),
      'others' => $_POST['others'],
      'date' => $_POST['date']
      ));
    header('Content-type: text/plain','success',200);
    exit('successfull');
  }
}else{
  exit('action required');
}
  
  
  
  
?>