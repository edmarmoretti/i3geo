<?php
include_once(dirname(__FILE__)."/../inicia.php");
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
		$retorno = $m->pegaFiltro();
	break;
/*
Valor: INSEREFILTRO

Inclui um filtro no tema.

<Temas->insereFiltro>
*/
	case "INSEREFILTRO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		if(!isset($testa)){$testa="";}
		{$retorno = $m->insereFiltro($filtro,$testa,"sim");}
		if(strtolower($testa) != "sim"){
			$m->salva();
			$_SESSION["contadorsalva"]++;
			redesenhaMapa();
		}
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