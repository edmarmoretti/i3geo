<?php
include(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: PEGAFILTRO

Pega a string do filtro de um tema.

<Temas->pegaFiltro>
*/
	case "PEGAFILTRO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		$m = new Temas($map_file,$tema);
		$retorno = base64_encode($m->pegaFiltro());
	break;
/*
Valor: INSEREFILTRO

Inclui um filtro no tema.

<Temas->insereFiltro>
*/
	case "INSEREFILTRO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		//copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		if(!isset($_GET["testa"])){
			$_GET["testa"]="";
		}
		$m->insereFiltro("");
		$m->salva();
		$m = new Temas($map_file,$tema);
		$retorno = $m->insereFiltro(base64_decode($_GET["filtro"]),$_GET["testa"],$_GET["base64"]);
		if(strtolower($_GET["testa"]) != "sim"){
			$m->salva();
			$_SESSION["contadorsalva"]++;
			redesenhaMapa();
		}
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>