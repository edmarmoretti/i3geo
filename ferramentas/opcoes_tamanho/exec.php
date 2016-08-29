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
Valor: MUDATAMANHO

Muda o tamanho da imagem do mapa atual.

<Mapa->mudaQS>
*/
	case "MUDATAMANHO":
		copiaSeguranca($map_file);
		$map = ms_newMapObj($map_file);
		$map->setsize($_GET["largura"],$_GET["altura"]);
		$salvo = $map->save($map_file);
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		$m = new Mapa($map_file);
		$m->mudaQS($_GET["largura"],$_GET["altura"]);
		$retorno = "ok";
		$_SESSION["contadorsalva"]++;
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>