<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: MUDAESCALAGRAFICA

Aplica novos par&acirc;metros na barra de escala atual.

<Escala->mudaEscalaGrafica>
*/
	case "MUDAESCALAGRAFICA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_escala.php");
		copiaSeguranca($map_file);
		$m = new Escala($map_file);
		$retorno = $m->mudaEscalaGrafica($_GET["w"],$_GET["h"],$_GET["estilo"],$_GET["intervalos"],$_GET["unidade"],$_GET["cor"],$_GET["bcor"],$_GET["ocor"],$_GET["status"]);
		$_SESSION["contadorsalva"]++;
	break;
/*
Valor: ESCALAPARAMETROS

Pega os par&acirc;metros da barra de escala atual.

<Escala->parametrosBarraEscala>
*/
	case "ESCALAPARAMETROS":
		include_once(dirname(__FILE__)."/../../classesphp/classe_escala.php");
		$m = new Escala($map_file);
		$retorno = $m->parametrosBarraEscala();
	break;
/*
Valor: TESTAESCALAGRAFICA

Testa os novos par&acirc;metros de uma barra de escala.

<Escala->testaescalagrafica>
*/
	case "TESTAESCALAGRAFICA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_escala.php");
		$m = new Escala($map_file);
		$retorno = $m->testaescalagrafica($_GET["w"],$_GET["h"],$_GET["estilo"],$_GET["intervalos"],$_GET["unidade"],$_GET["cor"],$_GET["bcor"],$_GET["ocor"]);
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>