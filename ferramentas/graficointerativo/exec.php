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
Valor: GRAFICOSELECAO

Pega os dados necessсrios para a geraчуo dos grсficos da ferramenta seleчуo

<iniciaDadosGrafico>
*/
	case "GRAFICOSELECAO":
		include(dirname(__FILE__)."/../../classesphp/graficos.php");
		if(!isset($_GET["exclui"]))
		{$_GET["exclui"] = "";}
		if(!isset($_GET["tipo"]))
		{$_GET["tipo"] = "nenhum";}
		if(!isset($_GET["ordenax"]))
		{$_GET["ordenax"] = "nao";}
		$itemvalores = explode(",",$_GET["itemvalores"]);
		if(count($itemvalores) == 1){
			$itemvalores = $itemvalores[0];
		}
		$retorno = iniciaDadosGrafico($map_file,$tema,$_GET["exclui"],$_GET["itemclasses"],$itemvalores,$_GET["tipo"],false,$ext,true,$_GET["ordenax"]);
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>