<?php
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$_SESSION["i3geoBlFerramentas"],false);
$retorno = "";
include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
switch (strtoupper($_GET["funcao"]))
{
/*
Valor: APLICAPARAMETROSLEGIMG

Aplica um par&acirc;metro em um estilo de uma classe.

<Legenda->aplicaParametrosLegImg>
*/
	case "APLICAPARAMETROSLEGIMG":
		$m = new Legenda($_SESSION["map_file"]);
		$retorno = $m->aplicaParametrosLegImg($_GET);
		$m->salva();
		ob_clean();
		header("Content-type: application/json");
		echo json_encode(array(
		    "errorMsg" => ""
		));
		exit;
	break;
/*
Valor: PEGAPARAMETROSLEGIMG

Pega os par&acirc;metros da legenda embebida no mapa.

<Legenda->pegaParametrosLegImg>
*/
	case "PEGAPARAMETROSLEGIMG":
		$m = new Legenda($_SESSION["map_file"]);
		$retorno = $m->pegaParametrosLegImg();
		if($retorno["status"] == 0){
		    $retorno["status"] = 1;
		}
		ob_clean();
		header("Content-type: application/json");
		echo json_encode($retorno);
		exit;
	break;
/*
Valor: TESTALEGENDA

Testa os par&acirc;metros de defini&ccedil;&atilde;o da legenda inserida no mapa.

<Legenda->aplicaParametrosLegImg>
*/
	case "TESTALEGENDA":
	    $map_file = str_replace(".map","",$_SESSION["map_file"]).".map";
		copy($map_file,str_replace(".map","testeleg.map",$map_file));
		$m = new Legenda(str_replace(".map","testeleg.map",$map_file));
		$m->aplicaParametrosLegImg($_GET);
		$retorno = $m->legendaGrafica();
		ob_clean();
		header("Content-type: application/json");
		echo json_encode($retorno["imagem"]);
		exit;
	break;
	case "GETLEGENDA":
	    $m = new Legenda($_SESSION["map_file"]);
	    $retorno = $m->legendaGrafica();
	    ob_end_clean();
	    header('Content-type: image/png');
	    readfile($retorno["arq"]);
	    exit;
    break;
}
