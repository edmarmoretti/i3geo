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
Valor: CRIABUFFER

Gera entorno (buffer) nos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com o buffer.

<Analise->criaBuffer>
*/
	case "CRIABUFFER":
		include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if(empty($_GET["multiplicar"])){
			$_GET["multiplicar"] = 1;
		}
		$retorno = $m->criaBuffer($_GET["distancia"],$locaplic,$_GET["unir"],$_GET["wkt"],$_GET["multiplicar"],$_GET["itemdistancia"]);
		$m->salva();
		//$_SESSION["contadorsalva"]++;
		//limpa selecao
		$qyfile = str_replace(".map",".qy",$map_file);
		if (file_exists($qyfile)){
			unlink ($qyfile);
		}
		$qyfile = str_replace(".map","_qy.map",$map_file);
		if (file_exists($qyfile)){
			unlink ($qyfile);
		}
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>