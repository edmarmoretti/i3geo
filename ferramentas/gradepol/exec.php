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
Valor: GRADEDEPOL

Gera uma grade de pol&iacute;gonos com espa&ccedil;amento regular definido em d&eacute;cimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

<Analise->gradeDePol>
*/
	case "GRADEDEPOL":
		include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Analise($map_file,$tema);
		if($_GET["proj"] == "sim"){
			$_GET["proj"] = true;
		}
		else{
			$_GET["proj"] = false;
		}

		$retorno = $m->gradeDePol($_GET["dd"],$_GET["px"],$_GET["py"],$locaplic,$_GET["nptx"],$_GET["npty"],$_GET["proj"]);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>