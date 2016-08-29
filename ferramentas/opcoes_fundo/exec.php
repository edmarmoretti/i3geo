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
Valor: PEGACORFUNDO

Pega a cor do fundo do mapa atual.

<Mapa->corfundo>
*/
	case "PEGACORFUNDO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		//no caso da interface openlayers, o mapfile &eacute; outro
		/*
		$nomefundo = str_replace(".map","fundo.map",$map_file);
		if(file_exists($nomefundo) && $interface == "openlayers")
		{$m = new Mapa($nomefundo);}
		else
		{$m = new Mapa($map_file);}
		*/
		$m = new Mapa($map_file);
		$retorno = $m->corfundo("");
	break;
/*
Valor: CORFUNDO

Altera a cor do fundo do mapa.

<Mapa->corfundo>
*/
	case "CORFUNDO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->corfundo($_GET["cor"]);
		$m->salva();
		//no caso da interface openlayers, o mapfile &eacute; outro
		/*
		$nomefundo = str_replace(".map","fundo.map",$map_file);
		if(file_exists($nomefundo)){
			$m = new Mapa($nomefundo);
			$m->corfundo($cor);
			$m->salva();
		}
		*/
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);

?>