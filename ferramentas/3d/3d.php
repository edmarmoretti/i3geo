<?php
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/carrega_ext.php");
error_reporting(0);
set_time_limit(120);
if (isset($g_sid))
{session_id($g_sid);}
session_name("i3GeoPHP");
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$postgis_mapa = $_SESSION["postgis_mapa"];
require_once("../../classesphp/funcoes_gerais.php");
//
//carrega o phpmapscript
//
if (!function_exists('ms_GetVersion'))
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
if(isset($ext) && $ext != "")
{
	$e = explode(" ",$ext);
	$extatual = $mapa->extent;
	$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
}
if ($mapa->width > 500)
{
	$mapa->setsize(500,500);
}
$of = $mapa->outputformat;
$of->set("imagemode",MS_IMAGEMODE_RGB);
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
$imgcor = flipImage($imgcor, true, false);
imagepng($imgcor,$arquivocor);

$imgalt = imagecreatefrompng($arquivoalt);
$sx = imagesx($imgalt);
$sy = imagesy($imgalt);
$fp = fopen($nomefinal,"w");
		

$texto = "#VRML V2.0 utf8
Group {
children [DirectionalLight { direction 0 -1 0 }
Shape {
appearance Appearance {
	material Material { diffuseColor .2 .2 .2 }";
$texto .= "texture ImageTexture { url ".'"'.basename($arquivocor).'"';
$texto .= "}
}

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
		//fwrite($fp,($alt)." ");
	}
}


$texto = ']
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


  function flipImage($image, $vertical, $horizontal) {
    $w = imagesx($image);
    $h = imagesy($image);

    if (!$vertical && !$horizontal) return $image;

    $flipped = imagecreatetruecolor($w, $h);

    if ($vertical) {
      for ($y=0; $y<$h; $y++) {
        imagecopy($flipped, $image, 0, $y, 0, $h - $y - 1, $w, 1);
      }
    }

    if ($horizontal) {
      if ($vertical) {
        $image = $flipped;
        $flipped = imagecreatetruecolor($w, $h);
      }

      for ($x=0; $x<$w; $x++) {
        imagecopy($flipped, $image, $x, 0, $w - $x - 1, 0, 1, $h);
      }
    }

    return $flipped;
  }

?>