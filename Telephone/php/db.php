<?php 
$host = ['0.0.0.0:3306','localhost'];
$dbname = ['Wilfried-Tech','id17962202_wilfriedtechdb'];
$user = ['root','id17962202_wilfriedtech'];
$password = ['root','jtmlucie63@Webhost'];
$i = 1;
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