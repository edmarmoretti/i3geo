<?php
/*
Title: mapa_openlayers.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substitui&ccedil;&atilde;o
das vari&aacute;veis de conex&atilde;o com banco e outras opera&ccedil;&otilde;es espec&iacute;ficas do i3Geo.

&Eacute; utilizado especificamente nas interfaces que utilizam a biblioteca OpenLayers.

Precisa do codigo da "section" PHP aberta pelo i3Geo (veja ms_criamapa.php) ou o codigo para acesso especial indicado no par&acirc;metro telaR
(veja a ferramenta TELAREMOTA).


Parametros:

g_sid {string} - codigo da "section" PHP

telaR {string} - (opcional) utilizado para autorizar o uso do mapfile aberto (deve estar registrado em $fingerprint (vari&aacute;vel de se&ccedil;&atilde;o)

tipolayer {fundo|} - (opcional) indica que a imagem a ser produzida comp&otilde;e o fundo do mapa

BBOX {xmin xmax ymin ymax} - extens&atilde;o geogr&aacute;fica a ser utilizada no desenho do mapa

WIDTH {numeric} - largura do mapa

HEIGHT {numeric} - altura do mapa

layer {string} - codigo do layer existente no mapa que ser&aacute; desenhado (ignorado quando telaR for definido)

DESLIGACACHE {sim|nao} - for&ccedil;a a n&atilde;o usar o cache de imagens qd definido como "sim", do contr&aacute;rio, o uso ou n&atilde;o do cache ser&aacute; definido automaticamente

TIPOIMAGEM {cinza|sepiaclara|sepianormal|negativo|detectaBordas|embassa|gaussian_blur|selective_blur|mean_removal|pixelate
} - filtro de imagem que ser&aacute; aplicado na imagem

Licenca:

GPL2

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
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/mapa_openlayers.php

*/
error_reporting(0);
inicializa();

//
//calcula a extensao geografica com base no x,y,z
//nos casos do modo notile, a requisicao e feita como se fosse um wms
//quando for do tipo tms $_GET["tms"] contem os parametros do tile
//
if(isset($_GET["tms"])){
	$_GET["WIDTH"] = 256;
	$_GET["HEIGHT"] = 256;
	$temp = explode("/",$_GET["tms"]);
	$z = $temp[2];
	$x = $temp[3];
	$y = str_replace(".png","",$temp[4]);

	$n = pow(2,$z+1);
	$lon1 = $x / $n * 360.0 - 180.0;
	$lon2 = ($x+1) / $n * 360.0 - 180.0;
	$n = pow(2,$z);
	$lat1 = $y / $n * 180.0 - 90.0;
	$lat2 = ($y+1) / $n * 180.0 - 90.0;
	$_GET["BBOX"] = $lon1." ".$lat1." ".$lon2." ".$lat2;
}
//para o caso da versao 3 do OpenLayers
//excluir?
if(isset($_GET["X"])){
	$box = explode(",",$_GET["BBOX"]);
	$res = ($box[2] + 180) - ($box[0] + 180);
	$res = $res / 256;
	$z = intval((0.703125 / $res) / 4) + 1;
	$x = floor((($box[0] + 180) / 360) * pow(2, $z));
	$y = floor((1 - log(tan(deg2rad($box[3])) + 1 / cos(deg2rad($box[3]))) / pi()) /2 * pow(2, $z));

	$_GET["WIDTH"] = 256;
	$_GET["HEIGHT"] = 256;
	$_GET["tms"] = "/".$_GET["layer"]."/".$z."/".$x."/".$y.".png";
	echo $_GET["BBOX"]." ".$_GET["tms"];exit;
}
if(isset($_GET["TileMatrix"])){
	$_GET["WIDTH"] = 256;
	$_GET["HEIGHT"] = 256;
	$z = $_GET["TileMatrix"];
	$x = $_GET["TileCol"];
	$y = $_GET["TileRow"];
	//calcula resolucoes
	$res = array();
	$temp = 0.703125;
	for($i = 0; $i < 40; $i++){
		$res[] = $temp;
		$temp = $temp / 2;
	}
	$_GET["tms"] = "/wmts/".$_GET["layer"]."/".$z."/".$x."/".$y.".png";
	if($z."/".$x."/".$y == "0/0/0" || $x == -1 || $y == -1){
		return;
	}
	$top_left_minx = -180;
	$top_left_maxy = 90;

	$x_size = $res[$z - 1] * 256;
	$y_size = $x_size;

	$lon1 = $top_left_minx + ($x * $x_size);
	$lat1 = $top_left_maxy - ($y * $y_size) - $y_size;
	$lon2 = $top_left_minx + ($x * $x_size) + $x_size;
	$lat2 = $top_left_maxy - ($y * $y_size);

	$_GET["BBOX"] = $lon1." ".$lat1." ".$lon2." ".$lat2;
}
$map_fileX = $_SESSION["map_file"];
//
//verifica se o request e OGC
if(!empty($_GET["request"])){
	$_GET["REQUEST"] = $_GET["request"];
}
//
//resolve o problema da selecao nas versoes mais recentes nova do mapserver
//
$qyfile = dirname($map_fileX)."/".$_GET["layer"].".php";
$qy = file_exists($qyfile);
if($_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature"){
	$_GET["DESLIGACACHE"] = "sim";
}
if($qy == false && $_GET["cache"] == "sim" && $_GET["DESLIGACACHE"] != "sim"){
	carregaCacheImagem($_SESSION["cachedir"],$_SESSION["map_file"],$_GET["tms"],$_SESSION["i3georendermode"]);
}

//
//map_fileX e para o caso register_globals = On no PHP.INI
//
if(isset($_GET["tipolayer"]) && $_GET["tipolayer"] == "fundo"){
	$map_fileX = str_replace(".map","fundo.map",$map_fileX);
}
$postgis_mapa = $_SESSION["postgis_mapa"];
$cachedir = $_SESSION["cachedir"];
if(isset($_GET["BBOX"])){
	$_GET["mapext"] = str_replace(","," ",$_GET["BBOX"]);
	$_GET["map_size"] = $_GET["WIDTH"]." ".$_GET["HEIGHT"];
}
$_GET["TIPOIMAGEM"] = trim($_GET["TIPOIMAGEM"]);

$mapa = ms_newMapObj($map_fileX);

//
//processa os layers do mapfile
//
if(!isset($_GET["telaR"])){//no caso de projecoes remotas, o mapfile nao e alterado
	$numlayers = $mapa->numlayers;
	$cache = false;
	for($i = 0;$i < $numlayers;++$i){
		$l = $mapa->getLayer($i);
		$layerName = $l->name;
		if($layerName != $_GET["layer"]){
			$l->set("status",MS_OFF);
		}
		//no caso de haver uma mascara definida no layer
		if($versao["inteiro"] >= 60200){
			if($l->mask != ""){
				$lmask = $mapa->getlayerbyname($l->mask);
				if(!empty($postgis_mapa)){
					if($lmask->connectiontype == MS_POSTGIS){
						$lcon = $l->connection;
						if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
							if(($lcon == " ") || ($lcon == "")){
								$lmask->set("connection",$postgis_mapa);
							}
							else{
								$lmask->set("connection",$postgis_mapa[$lcon]);
							}
						}
					}
				}
			}
		}
		if($layerName == $_GET["layer"] || $l->group == $_GET["layer"] && $l->group != ""){
			if ($l->getmetadata("classesnome") != ""){
				if(!function_exists("autoClasses"))
				{include_once("funcoes_gerais.php");}
				autoClasses($l,$mapa);
			}
			//
			//numero de pixels que serao considerados para corte da imagem no caso de cache ativo e tema de pontos
			//
			$cortePixels = 0;
			if ($l->getmetadata("cortepixels") != "" && $qy == false){
				$cortePixels = $l->getmetadata("cortepixels");
			}
			$l->set("status",MS_DEFAULT);
			$l->set("template","none.htm");
			if (!empty($postgis_mapa)){
				if ($l->connectiontype == MS_POSTGIS){
					$lcon = $l->connection;
					if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
						if(($lcon == " ") || ($lcon == ""))
						{$l->set("connection",$postgis_mapa);}
						else
						{$l->set("connection",$postgis_mapa[$lcon]);}
					}
				}
			}
		}

		if($layerName == $_GET["layer"]){
			if(strtolower($l->getmetadata("cache")) == "sim"){
				$cache = true;
				$nomecache = $l->getmetadata("nomeoriginal");
				if($nomecache == ""){
					$nomecache = $layerName;
				}
			}
			if($_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature" ){
				$l->setmetadata("gml_include_items","all");
				$l->set("template","none.htm");
				$l->setmetadata("WMS_INCLUDE_ITEMS","all");
				$l->setmetadata("WFS_INCLUDE_ITEMS","all");
				$l->setmetadata("ows_enable_request","*");
				$l->set("dump",MS_TRUE);
				$l->setmetadata("ows_srs","AUTO");
				if(strtolower($_GET["REQUEST"]) == "getfeature"){
					$_GET["TYPENAME"] = $l->name;
				}
			}
		}
	}
}

if (!function_exists('imagepng')){
	$_GET["TIPOIMAGEM"] = "";
}

if($_GET["layer"] == ""){
	$cache = true;
}

if(($_GET == false) || ($qy) || (strtolower($_GET["DESLIGACACHE"]) == "sim")){
	$cache = false;
}
elseif($_GET["TIPOIMAGEM"] != "" && $_GET["TIPOIMAGEM"] != "nenhum"){
	$cache = false;
}

if($cache == true && $_GET["cache"] != "nao"){
	carregaCacheImagem($cachedir,$_SESSION["map_file"],$_GET["tms"]);
}
if(isset($_GET["map_size"])){
	$map_size = explode(" ",$_GET["map_size"]);
	$mapa->setsize($map_size[0],$map_size[1]);
}

if(isset($_GET["mapext"])){
	$mapext = explode(" ",$_GET["mapext"]);
	$mapa->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);
}
//
//qd a cahamda e para um WMS, redireciona para ogc.php
//
if($_GET["REQUEST"] == "GetFeatureInfo" || $_GET["REQUEST"] == "getfeature"){
	$req = ms_newowsrequestobj();
	$_GET = array_merge($_GET,$_POST);
	foreach ($_GET as $k=>$v){
		$req->setParameter($k, $v);
	}
	$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
	$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
	$or = $proto.$server.$_SERVER['PHP_SELF'];
	$mapa->setmetadata("wfs_onlineresource",$or."?".$_SERVER["QUERY_STRING"]);

	ms_ioinstallstdouttobuffer();
	$mapa->owsdispatch($req);
	$contenttype = ms_iostripstdoutbuffercontenttype();
	header("Content-type: $contenttype");
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();
	exit;
}

$o = $mapa->outputformat;
$o->set("imagemode",MS_IMAGEMODE_RGBA);
if(!isset($_GET["telaR"])){
	$legenda = $mapa->legend;
	$legenda->set("status",MS_OFF);
	$escala = $mapa->scalebar;
	$escala->set("status",MS_OFF);
}

//
//se o layer nao for do tipo fundo
//
if($_GET["tipolayer"] != "fundo")
{$o->set("transparent",MS_TRUE);}

//
//se o layer foi marcado para corte altera os parametros para ampliar o mapa
//antes de gerar a imagem
//
if($cortePixels > 0){
	//$mapa->prepareImage();
	//echo $mapa->scaledenom;exit;
	$escalaInicial = $mapa->scaledenom;
	$extensaoInicial = $mapa->extent;
	$wh = 256+($cortePixels*2);
	$mapa->setsize($wh,$wh);
	$ponto = new pointObj();
	$ponto->setxy(($wh/2),($wh/2));
	$mapa->zoomScale($escalaInicial, $ponto, $wh, $wh, $extensaoInicial);
}

//se nao houver selecao
if($qy != true){
	$img = $mapa->draw();
}
else{
	$handle = fopen ($qyfile, "r");
	$conteudo = fread ($handle, filesize ($qyfile));
	fclose ($handle);
	$shp = unserialize($conteudo);
	$l = $mapa->getLayerByname($_GET["layer"]);
	if ($l->connectiontype != MS_POSTGIS){
		$indxlayer = $l->index;
		foreach ($shp as $indx)
		{$mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$qm = $mapa->querymap;
		$qm->set("width",$map_size[0]);
		$qm->set("height",$map_size[1]);
		$img = $mapa->drawQuery();
	}
	else{
		$img = $mapa->draw();
		$c = $mapa->querymap->color;
		$numclasses = $l->numclasses;
		if ($numclasses > 0)
		{
			$classe0 = $l->getClass(0);
			$classe0->setexpression("");
			$classe0->set("name"," ");
			for ($i=1; $i < $numclasses; ++$i)
			{
				$classe = $l->getClass($i);
				$classe->set("status",MS_DELETE);
			}
		}
		$cor = $classe0->getstyle(0)->color;
		$cor->setrgb($c->red,$c->green,$c->blue);
		//$cor = $classe0->getstyle(0)->outlinecolor;
		//$cor->setrgb($c->red,$c->green,$c->blue);
		$status = $l->open();
		$status = $l->whichShapes($mapa->extent);
		while ($shape = $l->nextShape())
		{
			if(in_array($shape->index,$shp))
			$shape->draw($mapa,$l,$img);
		}
		$l->close();
	}
	$cache = false;
}
//nao usa o cache pois e necessario processar a imagem com alguma rotina de filtro
if($_GET["TIPOIMAGEM"] != "" && $_GET["TIPOIMAGEM"] != "nenhum"){
	if($img->imagepath == "")
	{echo "Erro IMAGEPATH vazio";exit;}
	$nomer = ($img->imagepath)."filtroimgtemp".nomeRand().".png";
	$img->saveImage($nomer);
	//
	//corta a imagem gerada para voltar ao tamanho normal
	//
	if($cortePixels > 0){
		cortaImagemDisco($nomer,$cortePixels,256);
	}
	filtraImg($nomer,$_GET["TIPOIMAGEM"]);
	$img = imagecreatefrompng($nomer);
	imagealphablending($img, false);
	imagesavealpha($img, true);
	ob_clean();
	echo header("Content-type: image/png \n\n");
	imagepng($img);
	imagedestroy($img);
}
else{
	if($cache == true && $_GET["cache"] != "nao"){
		//cache ativo. Salva a imagem em cache
		$nomer = salvaCacheImagem($cachedir,$map_fileX,$_GET["tms"]);
		if($_SESSION["i3georendermode"] == 2){
			ob_clean();
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			header("X-Sendfile: $nomer");
			header("Content-type: image/png");
		}
		else{
			ob_clean();
			header('Content-Length: '.filesize($nomer));
			header('Content-Type: image/png');
			//header('Cache-Control: max-age=3600, must-revalidate');
			//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			//fpassthru(fopen($nomer, 'rb'));
			readfile($nomer);
		}
	}
	else{
		//cache inativo
		if($img->imagepath == ""){
			ilegal();
		}
		//se for necessario cortar a imagem, $img->saveImage() nao funciona
		if($_SESSION["i3georendermode"] == 0 || ($_SESSION["i3georendermode"] == 1 && $cortePixels > 0)){
			$nomer = ($img->imagepath)."temp".nomeRand().".png";
			$img->saveImage($nomer);
			//
			//corta a imagem gerada para voltar ao tamanho normal
			//
			if($cortePixels > 0){
				$img = cortaImagemDisco($nomer,$cortePixels,256);
			}
			else{
				$img = imagecreatefrompng($nomer);
				imagealphablending($img, false);
				imagesavealpha($img, true);
			}
			ob_clean();
			echo header("Content-type: image/png \n\n");
			imagepng($img);
			imagedestroy($img);
			exit;
		}
		if($_SESSION["i3georendermode"] == 1){
			ob_clean();
			header('Content-Type: image/png');
			$img->saveImage();
		}
		if($_SESSION["i3georendermode"] == 2){
			$nomer = ($img->imagepath)."temp".nomeRand().".png";
			$img->saveImage($nomer);
			//
			//corta a imagem gerada para voltar ao tamanho normal
			//
			if($cortePixels > 0){
				$img = cortaImagemDisco($nomer,$cortePixels,256);
			}
			ob_clean();
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			header("X-Sendfile: $nomer");
			header("Content-type: image/png");
		}
	}
}
function salvaCacheImagem($cachedir,$map,$tms){
	global $img,$cortePixels;
	if($cachedir == ""){
		$nome = dirname(dirname($map))."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	if(!file_exists($nome)){
		@mkdir(dirname($nome),0777,true);
		chmod(dirname($nome),0777);
		$img->saveImage($nome);
		//
		//corta a imagem gerada para voltar ao tamanho normal
		//
		if($cortePixels > 0){
			$img = cortaImagemDisco($nome,$cortePixels,256);
		}
		chmod($nome,0777);
	}
	return $nome;
}
function carregaCacheImagem($cachedir,$map,$tms,$i3georendermode=0){
	if($cachedir == ""){
		$nome = dirname(dirname($map))."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	if(file_exists($nome)){
		if($i3georendermode = 0 || $i3georendermode = 1 || empty($i3georendermode)){
			header('Content-Length: '.filesize($nome));
			header('Content-Type: image/png');
			//header('Cache-Control: max-age=3600, must-revalidate');
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			//header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
			//fpassthru(fopen($nome, 'rb'));
			readfile($nome);
		}
		else{
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			header("X-Sendfile: $nome");
			header("Content-type: image/png");
		}
		exit;
	}
}
function nomeRand($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}
function filtraImg($nomer,$tipoimagem){
	include_once("classe_imagem.php");
	$tiposImagem = explode(" ",$tipoimagem);
	foreach ($tiposImagem as $tipoimagem){
		$m = new Imagem($nomer);
		if ($tipoimagem == "cinza")
		{imagepng($m->cinzaNormal(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "sepiaclara")
		{imagepng($m->sepiaClara(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "sepianormal")
		{imagepng($m->sepiaNormal(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "negativo")
		{imagepng($m->negativo(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "detectaBordas")
		{imagepng($m->detectaBordas(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "embassa")
		{imagepng($m->embassa(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "gaussian_blur")
		{imagepng($m->gaussian_blur(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "selective_blur")
		{imagepng($m->selective_blur(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "mean_removal")
		{imagepng($m->mean_removal(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "pixelate")
		{imagepng($m->pixelate(),str_replace("\\","/",$nomer));}
	}
}
function inicializa(){
	clearstatcache();
	session_name("i3GeoPHP");
	if(@$_GET["g_sid"]){
		session_id($_GET["g_sid"]);
	}
	else{
		ilegal();
	}
	session_start();
	if(@$_SESSION["fingerprint"]){
		$f = explode(",",$_SESSION["fingerprint"]);
		if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $f[0] && !in_array($_GET["telaR"],$f) )
		{ilegal();}
	}
	else{
		exit;
	}
	if(!isset($_SESSION["map_file"])){
		exit;
	}
}
function ilegal(){
	$img = imagecreatefrompng("../imagens/ilegal.png");
	imagealphablending($img, false);
	imagesavealpha($img, true);
	ob_clean();
	echo header("Content-type: image/png \n\n");
	imagepng($img);
	exit;
}
/**
 * Corta uma imagem existente em disco
 */
function cortaImagemDisco($arquivo,$cortePixels,$tamanhoFinal=256){
	$img = imagecreatefrompng($arquivo);
	$imgc = imagecreatetruecolor($tamanhoFinal,$tamanhoFinal);
	//necessario, sem isso algumas imagens sao geradas de forma errada
	imagesavealpha($imgc, true);
	$color = imagecolorallocatealpha($imgc,0x00,0x00,0x00,127);
	imagefill($imgc, 0, 0, $color);
	imagecopy( $imgc, $img, 0 , 0 , $cortePixels , $cortePixels , $tamanhoFinal, $tamanhoFinal );
	imagepng($imgc,$arquivo);
	return $imgc;
}
?>
