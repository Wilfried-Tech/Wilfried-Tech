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
    $response = $sql->prepare('INSERT INTO Messages(message,expediteur,destinataire,autres) VALUES(:message,:expediteur,:destinataire,:autres)');
    $response->execute(array(
      'message' => htmlspecialchars($_POST['message']),
      'expediteur' => $_POST['expediteur'],
      'destinataire' => $_POST['destinataire'],
      'autres' => $_POST['autres']
      ));
    header('Content-type: text/plain','success',200);
    exit('successfull');
  }
  if($_POST['action']=='GET'){
    $res = $sql->query("SELECT * FROM Messages WHERE expediteur= '".$_POST['expediteur']."' OR destinataire='".$_POST['expediteur']."'");
    $Messages = array();
    while($row = $res->fetch(PDO::FETCH_ASSOC)){
     $Messages[] = $row;
    }
    header('Content-type: text/json','successfull',200);
    echo json_encode($Messages);
    exit;
  }
  if($_POST['action'] == 'PUT'){
    $response = $sql->prepare('UPDATE Messages SET message=:message,autres=:autres WHERE date = :date');
    $response->execute(array(
      'message' => htmlspecialchars($_POST['message']),
      'autres' => $_POST['autres'],
      'date' => $_POST['date']
      ));
    header('Content-type: text/plain','success',200);
    exit('successfull');
  }
}else{
  exit('action required');
}
  
  
  
  
?>