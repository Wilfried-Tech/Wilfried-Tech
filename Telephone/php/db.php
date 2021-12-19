<?php 
$host = ['0.0.0.0:3306'];
$dbname = ['Wilfried-Tech'];
$user = ['root'];
$password = ['root'];
$i = 0;
try
{
	$sql = new PDO("mysql:host=$host[$i];dbname=$dbname[$i];charset=utf8", $user[$i], $password[$i], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
}
catch (Exception $e)
{
  header('Content-type: text/plain','error',500);
  die('Erreur : ' . $e->getMessage());
}
?>