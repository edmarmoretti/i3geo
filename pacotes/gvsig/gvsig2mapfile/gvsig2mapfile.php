<?php
	include_once("class.gvsig2mapfile.php");
	error_reporting(0);
	$gm = new gvsig2mapfile("C:\ms4w\Apache\htdocs\i3geo\pacotes\gvsig\gvsig2mapfile\projetoteste.gvp");
	echo "<pre>Teste<br>";
	$nomes = $gm->getViewsNames();
	$view = $gm->getViewByName($nomes[0]);
	$dataView = $gm->getViewData($nomes[0]);
	echo "Extensão do mapa: ".(implode(",",$dataView["extent"]))."\n";
	echo "Projeção do mapa: ".$dataView["proj"]."\n";
	echo "Camadas: ".(implode(",",$dataView["layerNames"]))."\n";
	foreach($dataView["layerNames"] as $lname)
	{var_dump($gm->getLayerData($nomes[0],$lname));}
	//localhost/i3geo/ms_criamapa.php?gvsiggvp=C:\ms4w\Apache\htdocs\i3geo\pacotes\gvsig\gvsig2mapfile\projetoteste.gvp&gvsigview=teste 1&temasa=
?>