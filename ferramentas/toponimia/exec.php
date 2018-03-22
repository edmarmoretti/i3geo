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
Valor: CRIATOPONIMIA

Cria um novo tema com a topon&iacute;mia do tema atual.

<Toponimia->criaToponimia>
*/
	case "CRIATOPONIMIA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		if(!isset($tipo)){
			$tipo="";
		}
		if(!isset($novotema)){
			$novotema = "sim";
		}
		$retorno = $m->criaToponimia($_GET["item"],$_GET["position"],$_GET["partials"],$_GET["offsetx"],$_GET["offsety"],$_GET["minfeaturesize"],$_GET["mindistance"],$_GET["force"],$_GET["shadowcolor"],$_GET["shadowsizex"],$_GET["shadowsizey"],$_GET["outlinecolor"],$_GET["cor"],$_GET["sombray"],$_GET["sombrax"],$_GET["sombra"],$_GET["fundo"],$_GET["angulo"],$_GET["tamanho"],$_GET["fonte"],$_GET["tipo"],$_GET["wrap"],$_GET["novotema"]);
		if(empty($_GET["maxscale"])){
			$_GET["maxscale"] = -1;
		}
		if(empty($_GET["minscale"])){
			$_GET["minscale"] = -1;
		}
		$m->layer->set("labelmaxscaledenom",$_GET["maxscale"]);
		$m->layer->set("labelminscaledenom",$_GET["minscale"]);
		$p = $m->layer->getProcessing();
		if(!in_array("LABEL_NO_CLIP=True",$p)){
		    $m->layer->setprocessing("LABEL_NO_CLIP=True");
		}
		if(!in_array("POLYLINE_NO_CLIP=True",$p)){
		    $m->layer->setprocessing("POLYLINE_NO_CLIP=True");
		}
		if ($_GET["tipo"] != "teste"){
			$m->salva();$_SESSION["contadorsalva"]++;
		}
	break;
	case "REMOVETOPONIMIA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$tipo="";
		$retorno = $m->removeToponimia();
		$m->salva();
		$_SESSION["contadorsalva"]++;
		break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>
