<?php
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();
if($_GET["funcao"] == "registra"){
	$_SESSION["extenttelaremota"] = $_GET["ext"];
	ob_clean();
	echo header("Content-type: text/html \n\n");	
	echo json_encode(array("data"=>"ok"));
	return;
}
if($_GET["funcao"] == "recupera"){
	ob_clean();
	echo header("Content-type: text/html \n\n");	
	echo json_encode(array("data"=>array("extent"=>$_SESSION["extenttelaremota"],"contadorsalva"=>$_SESSION["contadorsalva"])));
	return;
}
?>