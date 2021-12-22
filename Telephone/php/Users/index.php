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
    $res = $sql->query("SELECT * FROM Utilisateurs");
    $Users = array();
    while($row = $res->fetch(PDO::FETCH_ASSOC)){
      if($row['email']==$_POST['email']){
        if ($row['name']==$_POST['name']&&$row['password']==$_POST['mdp']) {
          header('Content-type: text/plain','success',200);
          exit(json_encode($row));
        } else {
          header('Content-type: text/plain','error',400);
          exit('cet email est déjà utilisé');
        }
      }
    }
    
    $response = $sql->prepare('INSERT INTO Utilisateurs(name,password,email) VALUES(:name,:password,:email)');
      $response->execute(array(
        'name' => htmlspecialchars($_POST['name']),
        'password' => $_POST['mdp'],
        'email' => $_POST['email']
        ));
    header('Content-type: text/plain','success',200);
    exit();
  }
  if($_POST['action']=='GET'){
    $res = $sql->query("SELECT * FROM Utilisateurs");
    $Users = array();
    $Users['accounts'] = array();
    while($row = $res->fetch(PDO::FETCH_ASSOC)){
      if($row['name']==$_POST['name']&&$row['password']==$_POST['mdp']){
        $Users['self'] = $row;
      }else{
        $arr = array();
        $arr['id'] = $row['id'];
        $arr['name'] = $row['name'];
        $arr['email'] = $row['email'];
        $arr['seen'] = $row['seen'];
        $arr['online'] = $row['online'];
        $Users['accounts'][] = $arr;
      }
    }
    header('Content-type: text/json','successfull',200);
    echo json_encode($Users);
    exit;
  }
  if($_POST['action']=='PUT'){
    $response = $sql->prepare('UPDATE Utilisateurs SET name=:name,email=:email,online=:online,config=:config,others=:others WHERE id=:id');
    $response->execute(array(
      'id' => $_POST['id'],
      'name' => $_POST['name'],
      'email' => $_POST['email'],
      'online' => $_POST['online'],
      'config' => $_POST['config'],
      'others' => $_POST['others']
      ));
    header('Content-type: text/plain','success',200);
    exit('successfully updated');
  }
}else{
  header('Content-type: text/plain','error',401);
  exit('action required');
}
  
  
  
  
 