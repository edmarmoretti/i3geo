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
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
require_once("../../classesphp/pega_variaveis.php");
error_reporting(0);
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$postgis_mapa = $_SESSION["postgis_mapa"];
//
//se as extens&otilde;es j&aacute; estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais r&aacute;pido
//
include_once ("../../classesphp/carrega_ext.php");
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
require("../../classesphp/funcoes_gerais.php");
error_reporting(0);
$nomes = nomeRandomico();
$map = ms_newMapObj($map_file);
$temp = str_replace(".map","xxx.map",$map_file);
$map->save($temp);
substituiCon($temp,$postgis_mapa);
$map = ms_newMapObj($temp);
if($interface == "googlemaps")
{$map->setProjection("init=epsg:4618,a=6378137,b=6378137");}
$eb = $map->scalebar;
$leb = $eb->label;
if($leb->type == "MS_BITMAP"){
	$leb->set("type",MS_TRUETYPE);
	$leb->set("font","Arial");
}
//altera o nome das classes vazias
$temas = $map->getalllayernames();
foreach ($temas as $tema)
{
	$layer = $map->getlayerbyname($tema);
	if (($layer->data != "") && (strtolower($layer->getmetadata("escondido")) != "sim") && (strtolower($layer->getmetadata("tema")) != "sim"))
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
	$nclasses = $layer->numclasses;
	if ($nclasses > 0)
	{
		for($i=0;$i<$nclasses;$i++)
		{
			$classe = $layer->getclass($i);
			$leb = $classe->label;
			if($leb->type == MS_BITMAP){
				$leb->set("type",MS_TRUETYPE);
				$leb->set("font","Arial");
			}
		}
	}
}
$map->save($temp);
removeLinha("classeNula",$temp);
$map = ms_newMapObj($temp);

$o = $map->outputformat;
if($mapexten != ""){
	$ext = explode(" ",$mapexten);
	$extatual = $map->extent;
	$extatual->setextent($ext[0],$ext[1],$ext[2],$ext[3]);
}
$map->selectOutputFormat("svg");
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
//mapa
$imgo = $map->draw();
if($imgo->imagepath == "")
{echo "Erro IMAGEPATH vazio";exit;}
$nomer = ($imgo->imagepath)."mapa".$nomes.".svg";
$imgo->saveImage($nomer);
$nomemapa = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);
echo "<p>Utilize a op&ccedil;ão de altera&ccedil;ão das propriedades do mapa para ajustar a legenda, tamanho e outras caracter&iacute;sticas antes de gerar os arquivos.</p>";
echo "<p>Arquivos gerados:</p>";
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomemapa' target=_blank >Mapa</a><br><br>";
?>