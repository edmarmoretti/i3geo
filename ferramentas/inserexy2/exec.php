<?php
include_once(__DIR__."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: INSERESHP

Insere um ponto em um shape file existente.

<SHP->insereSHP>
*/
	case "INSERESHP":
		include_once(__DIR__."/../../classesphp/classe_shp.php");
		copiaSeguranca($map_file);
		$m = new SHP($map_file,$tema);
		if (!isset($projecao)){$projecao = "";}
		$m->insereSHP($xy,$projecao,$item,$valor);
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
function redesenhaMapa()
{
	global $tempo,$map_file,$tipoimagem,$cp,$postgis_mapa,$utilizacgi,$locmapserv,$interface,$mapexten;
	if($tipoimagem != "nenhum" && $tipoimagem != "")
	{$utilizacgi = "nao";}
	if (connection_aborted()){exit();}
	if($interface == "googleearth" && $mapexten != ""){
		include_once(__DIR__."/../../classesphp/classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->mudaExtensao($mapexten);
		$m->salva();
	}
	include_once(__DIR__."/../../classesphp/classe_mapa.php");
	$m = New Mapa($map_file);
	$par = $m->parametrosTemas();
	//
	//na interface googlemaps n&atilde;o &eacute; necess&aacute;rio gerar a imagem
	//
	$e = $m->mapa->extent;
	$ext = $e->minx." ".$e->miny." ".$e->maxx." ".$e->maxy;
	$res["mapimagem"] = "";
	$res["mapexten"] = $ext;
	$res["mapres"] = "";
	$res["erro"] = "";
	$res["mapscale"] = "";
	$res["pixelsize"] = "";
	$res["mapimagem"] = "";
	$res["w"] = $m->mapa->width;
	$res["h"] = $m->mapa->height;
	$res["mappath"] = "";
	$res["mapurl"] = "";
	$res["mensagens"] = $m->pegaMensagens();
	$res["tempo"] = microtime(1) - $tempo;
	restauraCon($map_file,$postgis_mapa);
	ob_clean();
	if ($par == "")
	{$retorno = "erro";}
	else
	{$retorno = array("variaveis"=>$res,"temas"=>$par);}
	cpjson($retorno);
}
?>