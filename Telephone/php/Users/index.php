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
        if ($row['nom']==$_POST['nom']&&$row['password']==$_POST['mdp']) {
          header('Content-type: text/plain','success',200);
          exit(json_encode($row));
        } else {
          header('Content-type: text/plain','error',400);
          exit('cet email est déjà utilisé');
        }
      }
    }
    
    $response = $sql->prepare('INSERT INTO Utilisateurs(nom,password,email) VALUES(:nom,:password,:email)');
      $response->execute(array(
        'nom' => htmlspecialchars($_POST['nom']),
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
      if($row['nom']==$_POST['nom']&&$row['password']==$_POST['mdp']){
        $Users['self'] = $row;
      }else{
        $arr = array();
        $arr['id'] = $row['id'];
        $arr['nom'] = $row['nom'];
        $arr['email'] = $row['email'];
        $arr['vu'] = $row['vu'];
        $arr['enligne'] = $row['enligne'];
        $Users['accounts'][] = $arr;
      }
    }
    header('Content-type: text/json','successfull',200);
    echo json_encode($Users);
    exit;
  }
  if($_POST['action']=='PUT'){
    $response = $sql->prepare('UPDATE Utilisateurs SET nom=:nom,email=:email,enligne=:enligne,donnees=:donnees,autres=:autres WHERE id=:id');
    $response->execute(array(
      'id' => $_POST['id'],
      'nom' => $_POST['nom'],
      'email' => $_POST['email'],
      'enligne' => $_POST['enligne'],
      'donnees' => $_POST['donnees'],
      'autres' => $_POST['autres']
      ));
    header('Content-type: text/plain','success',200);
    exit('successfully updated');
  }
}else{
  header('Content-type: text/plain','error',401);
  exit('action required');
}
  
  
  
  
 