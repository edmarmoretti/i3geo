<?php
	include_once("class.gvsig2mapfile.php");
	error_reporting(E_ALL);
	$gm = new gvsig2mapfile("C:\ms4w\Apache\htdocs\i3geo\pacotes\gvsig\projetoteste.gvp");
	echo "<pre>";
	$nomes = $gm->getViewsNames();
	echo $nomes[0];
?>