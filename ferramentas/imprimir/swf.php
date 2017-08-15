<?php
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");

include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),"",false);

$_GET = array_merge($_GET,$_POST);
//error_reporting(0);
session_name("i3GeoPHP");
if (isset($_GET["g_sid"]))
{session_id($_GET["g_sid"]);}
session_start();

$map_file = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];
//
//se as extens&otilde;es j&aacute; estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais r&aacute;pido
//
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
//
//carrega o phpmapscript
//
$exts = get_loaded_extensions();
if (array_search( "MapScript", $exts) != TRUE)
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		if(!@dl('php_mapscript_48.dll'))
		dl('php_mapscript.dll');
	}
	else
	{dl('php_mapscript.so');}
}
require(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
//error_reporting(0);
$nomes = nomeRandomico();
$map = ms_newMapObj($map_file);
substituiConObj($map,$postgis_mapa);
$legenda =$map->legend;
$legenda->set("status",MS_EMBED);
//altera o nome das classes vazias
$temas = $map->getalllayernames();
foreach ($temas as $tema)
{
	$layer = $map->getlayerbyname($tema);
	if (($layer->data != "") && (strtolower($layer->getmetadata("escondido")) != "sim") && (strtolower($layer->getmetadata("tema")) != "nao"))
	{
		if ($layer->numclasses > 0)
		{
			$classe = $layer->getclass(0);
			if (($classe->name == "") || ($classe->name == " "))
			{$classe->set("name",$layer->getmetadata("tema"));}
		}
	}
	if ($layer->getmetadata("classe") == "NAO")
	{
		$nclasses = $layer->numclasses;
		if ($nclasses > 0)
		{
			for($i=0;$i<$nclasses;$i++)
			{
				$classe = $layer->getclass($i);
				$classe->set("name","classeNula");
			}
		}
	}
}

removeLinha("classeNula",$temp);

$of = $map->outputformat;
$of->set("driver","swf");
$of->set("imagemode","PC256");
$of->setoption("OUTPUT_MOVIE","SINGLE");

$imgo = $map->draw();
if($imgo->imagepath == "")
{echo "Erro IMAGEPATH vazio";exit;}
$nomer = ($imgo->imagepath)."mapa".$nomes.".swf";
$imgo->saveImage($nomer);
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$nomemapa = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomemapa' >Arquivo gerado! Clique para ver.</a>";
?>