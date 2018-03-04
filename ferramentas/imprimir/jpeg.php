<style>
body
{margin:20px;font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 14px;width:300px}
A
{text-align:left;font-family: Verdana, Arial, Helvetica, sans-serif;color: #2F4632;}
A:hover
{color: #4142ff;font-weight: normal;font-family: Verdana, Arial, Helvetica, sans-serif;}
</style>
<body>
<?php
/*
About: Licen&ccedil;a

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
$mapexten = $_GET["mapexten"];
//error_reporting(0);
session_name("i3GeoPHP");
if (isset($_GET["g_sid"]))
{session_id($_GET["g_sid"]);}
session_start();
$map_file = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];
require_once (dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
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
$of = $map->outputformat;
$of->set("driver","AGG/JPEG");
$of->set("imagemode","RGB");
$of->set("mimetype","image/jpeg");
$of->set("extension","jpg");
if($map->getmetadata("interface") == "googlemaps")
{
	$proj4 = pegaProjecaoDefault("proj4");
	$map->setProjection($proj4);
	$map->set("units",MS_METERS);
	$map->preparequery();
	$map->set("scaledenom",$map->scaledenom * 100000);
}
$o = $map->outputformat;

if($mapexten != ""){
	$ext = explode(" ",$mapexten);
	$extatual = $map->extent;
	$extatual->setextent($ext[0],$ext[1],$ext[2],$ext[3]);
}
$o->set("imagemode",MS_IMAGEMODE_RGB);
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
//mapa
$imgo = $map->draw();
if($imgo->imagepath == ""){
	echo "Erro IMAGEPATH vazio";
	exit;
}
$nomer = ($imgo->imagepath)."mapa".$nomes.".jpg";
$imgo->saveImage($nomer);
$nomemapa = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);
//legenda
//corrige o titulo da legenda
$numlayers = $map->numlayers;
for ($j=0;$j < $numlayers;$j++){
	$l = $map->getlayer($j);
	if ($l->getmetadata("classe") == "NAO"){
		$l->set("status",MS_OFF);
	} else {
		if (($l->data != "") && (strtolower($l->getmetadata("escondido")) != "sim") && (strtolower($l->getmetadata("tema")) != "nao")){
			if ($l->numclasses > 0){
				$classe = $l->getclass(0);
				if (($classe->name == "") || ($classe->name == " ")){
					$classe->set("name",$l->getmetadata("tema"));
				}
			}
		}
		if($l->type != 3 && $l->type != 4){
			$nclass = $l->numclasses;
			for($i=0;$i<$nclass;$i++){
				$classe = $l->getclass($i);
				if($classe->title === ""){
					$classe->title = $classe->name;
				}
			}
		}
	}
}
$imgo = $map->drawlegend();
$nomer = ($imgo->imagepath)."legenda".$nomes.".jpg";
$imgo->saveImage($nomer);
$nomelegenda = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);
//escala
$imgo = $map->drawscalebar();
$nomer = ($imgo->imagepath)."escala".$nomes.".jpg";
$imgo->saveImage($nomer);
$nomeescala = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);
//refer&ecirc;ncia
$o = $map->reference->outlinecolor;
if($o->red == -1){
    $o->setrgb(255,0,0);
}
$map->preparequery();
$imgo = $map->drawreferencemap();
$nomer = ($imgo->imagepath)."ref".$nomes.".jpg";
$imgo->saveImage($nomer);
$nomeref = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);

echo "<p>Utilize a op&ccedil;&atilde;o de altera&ccedil;&atilde;o das propriedades do mapa para ajustar a legenda, tamanho e outras caracter&iacute;sticas antes de gerar os arquivos.</p>";
echo "<p>Arquivos gerados:</p>";
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomemapa' target=_blank >Mapa</a><br><br>";
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomeescala' target=_blank >Barra de escala</a><br><br>";
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomeref' target=_blank >Mapa de refer&ecirc;ncia</a><br><br>";
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomelegenda' target=_blank >Legenda</a><br>";
?>
