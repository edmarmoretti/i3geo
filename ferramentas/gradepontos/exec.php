<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: GRADEDEPONTOS

Gera uma grade de pontos com espa&ccedil;amento regular definido em d&eacute;cimos de grau.

Salva o mapa acrescentando um novo layer com a grade de coordenadas.

<Analise->gradeDePontos>
*/
	case "GRADEDEPONTOS":
		include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Analise($map_file,$tema);
		$retorno = $m->gradeDePontos($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>