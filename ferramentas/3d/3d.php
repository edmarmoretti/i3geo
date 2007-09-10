<?php
/*
About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
require_once("../../classesphp/pega_variaveis.php");
error_reporting(0);
if (isset($g_sid))
{session_id($g_sid);}
session_name("i3GeoPHP");
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}

require_once("../../classesphp/funcoes_gerais.php");
//
//carrega o phpmapscript
//
if (!function_exists(ms_GetVersion))
{
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
}
$maptemp = "";
if ($temaz=="")
{
	if (file_exists($temasaplic."/".$map3d))
	{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$maptemp = ms_newMapObj($temasaplic."\\".$map3d);}
		else
		{$maptemp = ms_newMapObj($temasaplic."/".$map3d);}
	}
	if (file_exists($map3d))
	{$maptemp = ms_newMapObj($map3d);}
	if ($maptemp == ""){echo "Arquivo com o relevo não foi encontrado";return;}
}
$mapa = ms_newMapObj($map_file);
if ($mapa->width > 400)
{
	$mapa->setsize(400,400);
}
$imgo = $mapa->draw();
$nome = ($imgo->imagepath).nomeRandomico().".png";
$nomefinal = ($imgo->imagepath).nomeRandomico().".wrl";
$imgo->saveImage($nome);
$arquivocor = $nome;

$numlayers = $mapa->numlayers;
for ($i=0;$i < $numlayers;$i++)
{
	$layer = $mapa->getlayer($i);
	$layer->set("status",MS_OFF);
}
if ($temaz=="")
{
	$temastemp = $maptemp->getalllayernames();
	foreach ($temastemp as $t)
	{
		$layer = $maptemp->getlayerbyname($t);
		$layer->set("status",MS_DEFAULT);
		ms_newLayerObj($mapa, $layer);
	}
}
else
{
	$layer = $mapa->getlayerbyname($temaz);
	$layer->set("status",MS_DEFAULT);
	$eb=$mapa->scalebar;
	$eb->set("status",MS_OFF);
}
$cor = $mapa->imagecolor;
$cor->setRGB(255,255,255);
$imgo = $mapa->draw();
$nome = ($imgo->imagepath).nomeRandomico().".png";
$nomefinal = ($imgo->imagepath).nomeRandomico().".wrl";
$imgo->saveImage($nome);
$arquivoalt = $nome;

$imgcor = imagecreatefrompng($arquivocor);
$imgalt = imagecreatefrompng($arquivoalt);
$sx = imagesx($imgcor);
$sy = imagesy($imgcor);
$fp = fopen($nomefinal,"w");
		

$texto = "#VRML V2.0 utf8
Group {
children [DirectionalLight { direction 0 -1 0 }
Shape {
appearance Appearance { material Material { diffuseColor .2 .2 .2}}
  geometry ElevationGrid {
	xDimension $sx
	xSpacing 1
	zDimension $sy
	zSpacing 1
	solid TRUE
height [\n";
fwrite($fp,$texto);
//fator redução de z
if(($fz == "")||($fz == 0)){$fz = 1;}

for ($y = 0; $y < $sy; $y++)
{
	for ($x = 0; $x < $sx; $x++)
	{
		$alt = imagecolorat($imgalt, $x, $y);
		$z = ($alt >> 16) & 0xFF;
		fwrite($fp,($z/$fz)." ");
	}
}

$texto = "]
color Color { color [\n";
fwrite($fp,$texto);

for ($y = 0; $y < $sy; $y++)
{
	for ($x = 0; $x < $sx; $x++)
	{
		$cor = imagecolorat($imgcor, $x, $y);
		$r = ($cor >> 16) & 0xFF;
		$g = ($cor >> 8) & 0xFF;
		$b = $cor & 0xFF;
		fwrite($fp,($r/500)." ".($g/500)." ".($b/500)." ");		
	}
}

$texto = '] }
}
}
]
}
Viewpoint { position '.($sx / 2).' '.$sx.' '.($sx / 2).'  orientation 1 0 0 -1.57 description "Above" }
Viewpoint { position '.($sx / 2).' 1.000000 '.($sx / 2).' description "Center" }
NavigationInfo { speed 100 type "EXAMINE" }';
fwrite($fp,$texto);
fclose($fp);
$h = "window.location.protocol+'//'+window.location.host+'/ms_tmp/".basename($imgurl)."/".(basename($nomefinal))."'";
echo "<div style=text-align:center;font-family:Verdana,Arial,Helvetica,sans-serif; > O arquivo foi gerado!!<br>";
echo "<br><a id=abre href='' >Clique aqui</a>";
echo "<br><br>x:$x y:$y";

echo "<script>document.getElementById('abre').href=".$h."</script>";
?>
