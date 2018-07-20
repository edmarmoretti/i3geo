<?php
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
include_once(dirname(__FILE__)."/../../classesphp/classe_escala.php");
switch (strtoupper($_GET["funcao"]))
{
/*
Valor: MUDAESCALAGRAFICA

Aplica novos par&acirc;metros na barra de escala atual.

<Escala->mudaEscalaGrafica>
*/
	case "MUDAESCALAGRAFICA":
		$m = new Escala($_SESSION["map_file"]);
		$retorno = $m->mudaEscalaGrafica($_GET);
		ob_clean();
		header("Content-type: application/json");
		echo json_encode(array(
		    "errorMsg" => ""
		));
		exit;
	break;
/*
Valor: ESCALAPARAMETROS

Pega os par&acirc;metros da barra de escala atual.

<Escala->parametrosBarraEscala>
*/
	case "PARAMETROSBARRAESCALA":
		$m = new Escala($_SESSION["map_file"]);
		$retorno = $m->parametrosBarraEscala();
		ob_clean();
		header("Content-type: application/json");
		echo json_encode($retorno);
		exit;
	break;
/*
Valor: TESTAESCALAGRAFICA

Testa os novos par&acirc;metros de uma barra de escala.

<Escala->testaescalagrafica>
*/
	case "TESTAESCALAGRAFICA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_escala.php");
		$m = new Escala($_SESSION["map_file"]);
		$retorno = $m->testaescalagrafica($_GET);
		ob_clean();
		header("Content-type: application/json");
		echo json_encode($retorno);
		exit;
	break;

}