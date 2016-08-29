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
Valor: ANALISEDISTRIPT

Gera an&aacute;lise de distribui&ccedil;&atilde;o de pontos.

Executa script R para gerar a imagem.

<Analise->analiseDistriPt>
*/
	case "ANALISEDISTRIPT":
		include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($_GET["tema2"]))
		{$_GET["tema2"] = "";}
		if(!isset($_GET["limitepontos"]))
		{$_GET["limitepontos"] = "";}
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if(empty($_GET["item"])){
			$_GET["item"] = "";
		}
		$retorno = $m->analiseDistriPt($locaplic,$dir_tmp,$R_path,$_GET["numclasses"],$_GET["tipo"],$_GET["cori"],$_GET["corf"],$tmpurl,$_GET["sigma"],$_GET["limitepontos"],$_GET["tema2"],$_GET["extendelimite"]);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>