<?php
//
//escrito por Luis Henrique Weirich de Matos
//
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
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
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
$nomes = nomeRandomico();
//
//substitui a string de conexão com o banco em cada layer se for necessário
//
$map = ms_newMapObj($map_file);
$temp = str_replace(".map","xxx.map",$map_file);
$map->save($temp);
substituiCon($temp,$postgis_mapa);
$map = ms_newMapObj($temp);

if($interface == "googlemaps")
{$map->setProjection("init=epsg:4291");}

$w = $map->width;
$h = $map->height;

//
//modifica o nome das classes em cada layer para que a legenda do mapa fique correta
//
$temas = $map->getalllayernames();
foreach ($temas as $tema)
{
	$layer = $map->getlayerbyname($tema);
	if (($layer->data != "") && ($layer->getmetadata("escondido") != "SIM") && ($layer->getmetadata("tema") != "NAO"))
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
$map->save($temp);
removeLinha("classeNula",$temp);
$map = ms_newMapObj($temp);

$o = $map->outputformat;
if($interface == "openlayers" || $interface == "googlemaps" || $interface == "googleearth"){
	if($mapexten != ""){
		$ext = explode(" ",$mapexten);
		$extatual = $map->extent;
		$extatual->setextent($ext[0],$ext[1],$ext[2],$ext[3]);
	}
	$legenda = $map->legend;
	$legenda->set("status",MS_EMBED);
	$o->set("imagemode",MS_IMAGEMODE_RGB);
}
$o->set("imagemode",MS_IMAGEMODE_RGB);
$o->set("transparent","false");
$imgo = $map->draw();
$nomer = ($imgo->imagepath)."mapa".$nomes.".png";
$imgo->saveImage($nomer);
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$pathMapa = $dir_tmp."/".basename($imgo->imageurl)."/".basename($nomer);
$nomeImagem = nomeRandomico();
$legenda = $map->legend;
$legenda->set("keysizex",20);
$legenda->set("keysizey",20);
$label = $legenda->label;
$label->set("size",14);
$imgo = $map->drawlegend();
$nomer = ($imgo->imagepath)."leg".$nomeImagem.".PNG";
$imgo->saveImage($nomer);
$pathlegenda = $dir_tmp."/".basename($imgo->imageurl)."/".basename($nomer);
$titulo = $_GET['titulo'];
substituiCon($map_file,$postgis_mapa);
require('../../pacotes/fpdf/fpdf.php');
$pdf = new FPDF("L","mm","A4");
$pdf->SetAutoPageBreak(false);
$pdf->SetDisplayMode( 70 , "single");
$pdf->SetMargins(0, 0, 0);
$pdf->AddPage("L");
$pdf->SetLineWidth(0.6);
$wMapaMax = 222;
$hMapaMax = 171;
$mapasize = getimagesize($pathMapa);
$wMapa = $mapasize[0];
$hMapa = $mapasize[1];
if (($wMapa / $wMapaMax) > ($hMapa / $hMapaMax)){
	$nW = $wMapaMax;
	$nH = $hMapa * $nW / $wMapa;
}else{
	$nH = $hMapaMax;
	$nW = $wMapa * $nH / $hMapa;
}
$pdf->Rect(3, 3, $nW+69, 14, 'D');//Título
$pdf->SetFont('Arial','B',18);
$xMsg = 292/2 - $pdf->GetStringWidth($titulo)/2;
$pdf->Text($xMsg,13,$titulo);
//208
$pdf->Rect(1, 1, 295, $nH+30, 'D');//Quadro
$pdf->Rect(3, 20, 65, $nH+2, 'D');//Legenda
$pdf->Rect(70, 20, $nW+2, $nH+2, 'D');//Mapa
$pdf->Image($pathMapa, 71, 21, $nW, $nH);
$pdf->SetFont('Arial','',9);
//$pdf->Text(14,$nH-1,"Projeção Geográficas");
//$pdf->Text(14,$nH+3,"Sistema de Referência:  SAD69");
$pdf->Image("../../imagens/i3geo1.jpg", 23, $nH+5, 25);
$pdf->SetFont('Arial','',9);
$textMsg = "Projeção Geográfica - datum SAD-69";
$xMsg = 292/2 - $pdf->GetStringWidth($textMsg)/2;
$pdf->Text($xMsg,$nH+28,$textMsg);
$wLegendaMax = 63;
$hLegendaMax = 105;
$legendaSize = getimagesize($pathlegenda);
$wLegenda = $legendaSize[0];
$hLegenda = $legendaSize[1];
$wLegenda = (0.35)*$wLegenda;//de pt para mm
$hLegenda = (0.35)*$hLegenda;
$nW = $wLegenda*0.6;
if ($wLegenda > $wLegendaMax * 1.5)
	$nW = $wLegendaMax;

$pdf->Image($pathlegenda, 4, 21,$nW);
$pdf->Close();
$pdf->Output("mapa.pdf", true);
?>