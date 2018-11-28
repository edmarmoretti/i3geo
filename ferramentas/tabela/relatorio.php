<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<title>i3Geo</title>
</head>
<?php
session_name("i3GeoPHP");

include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
error_reporting(0);
$nomesrel = $_GET["nomesrel"];
$temarel = $_GET["temarel"];
$ordemrel = $_GET["ordemrel"];
$itensrel = $_GET["itensrel"];
$itemagruparel = $_GET["itemagruparel"];
$ext = $_GET["ext"];

if (isset($_GET["g_sid"])){
	session_id($_GET["g_sid"]);
}
session_start();

$map_file = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];

include (dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
$versao = versao();
$versao = $versao["principal"];
error_reporting(0);
$temp = explode(",",$nomesrel);
$colunasTemp = array();
foreach($temp as $t){
	$t1Temp=explode("|",$t);
	$colunasTemp[] = $t1Temp[0];
}
//reordena as colunas
$ordem = explode(",",$ordemrel);
if(count($ordem) > 0){
	$itensrelTemp = explode(",",$itensrel);
	$itensrel = array();
	$colunas = array();
	$n = count($colunasTemp);
	for($i=0;$i<$n;$i++){
		$colunas[$ordem[$i]] = $colunasTemp[$i];
		$t1[$ordem[$i]] = $t1Temp[$i];
		$itensrel[$ordem[$i]] = $itensrelTemp[$i];
	}
	if(count($colunas) == count($colunasTemp)){
		ksort($colunas);
		ksort($t1);
		ksort($itensrel);
		$itensrel = implode(",",$itensrel);
	}
}
else{
	$colunas = $colunasTemp;
	$t1 = $t1Temp;
}

if($itemagruparel != ""  && !in_array($itemagruparel,$colunas)){
	$colunas[] = $itemagruparel;
}

$temp = explode(",",$itensrel);
$itensrel = array();
foreach($temp as $t)
{
	$t1=explode("|",$t);
	$itensrel[] = $t1[0];
}
if($itemagruparel != ""  && !in_array($itemagruparel,$itensrel))
{$itensrel[] = $itemagruparel;}

$mapa = ms_newMapObj($map_file);
substituiConObj($mapa,$postgis_mapa);
if($ext && $ext != ""){
	$e = explode(" ",str_replace(","," ",$ext));
	$extatual = $mapa->extent;
	$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
}

$layer = $mapa->getlayerbyname($temarel);
$layer->set("template","none.html");
//$layer->set("data",$layer->data."options='-c client_encoding=LATIN1'");
$existesel = "nao";

/*
if (file_exists($map_file."qy"))
{$mapa->loadquery($map_file."qy");}
*/
carregaquery2($map_file,$layer,$mapa);

if ($layer->getNumresults() > 0){
	$existesel = "sim";
}
if ($existesel == "nao"){
	$layer->querybyrect($mapa->extent);
}

$layer->open();
if(strtoupper($layer->getmetadata("convcaracter")) == "NAO"){
	$convC = false;
}
else{
	$convC = true;
}

//$registros[] = array();
$res_count = $layer->getNumresults();
for ($i = 0; $i < $res_count; $i++){
	$valitem = array();
	if($versao >= 6){
		$shape = $layer->getShape($layer->getResult($i));
	}
	else{
		$shape = $layer->getFeature($layer->getResult($i)->shapeindex);
	}
	$grupo = "";
	foreach ($itensrel as $item){
		$v = trim($shape->values[$item]);
		//$v = mb_convert_encoding($v,mb_detect_encoding($v),"ISO-8859-1");
		if (function_exists("mb_convert_encoding") && $convC == true){
			//$v = mb_convert_encoding($v,"UTF-8","ISO-8859-1");
		}
		$valitem[$item] = $v;
	}

	if ($itemagruparel != ""){
		$grupo = $valitem[$itemagruparel];
	}
	if($arearel == "true"){
		$valitem["area"] = calculaarea($shape);
	}
	if ($itemagruparel == "")
	$registros[] = $valitem;
	else{
		if(!$registros[$grupo])
		$registros[$grupo]=array($valitem);
		else
		array_push($registros[$grupo],$valitem);
	}
}
$fechou = $layer->close();

restauraCon($map_file,$postgis_mapa);

if(isset($_GET["tiporel"]) && $_GET["tiporel"] == "csv"){
	ob_end_clean();
	header("Content-Disposition: attachment; filename=relatorio.csv");
	header("Content-type: text/csv");
	echo implode(";",explode(",",$nomesrel));
	if($arearel == "true"){
	    echo ";&aacute;rea em ha \n";
	}
	else{
	    echo "\n";
	}
	foreach ($registros as $linhas){
		echo converte(implode(";",$linhas))."\n";
	}
	exit;
}
?>

<style>
body,td
{
	text-align:left;
	border: 0px solid #FFFFFF;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	position:relative;
	font-size:10pt;
	padding:10px;
}

</style>
<body>
<?php
echo "<span style=font-size:18px; >Relat&oacute;rio do tema: <b>".converte($layer->getmetadata("TEMA"))."</b><br></span>";
$ocorrencias = count($registros);
echo "ocorr&ecirc;ncias: ".$ocorrencias."<br>";
if ($itemagruparel == "")
{
	echo "<table>";
	$cor = "rgb(240,240,240)";
	echo "<tr style=background-color:yellow >";
	if($statrel == "true"){echo "<td></td>";}
	foreach ($colunas as $c)
	{echo "<td>$c</td>";}
	if($arearel == "true")
	{echo "<td>&aacute;rea em ha</td>";}
	foreach ($registros as $linhas)
	{
		if(count($linhas)>0){
			echo "<tr style=background-color:$cor >";
			if ($statrel == "true")
			echo "<td></td>";
			$conta = 0;
			foreach($linhas as $v){
				if(is_numeric(trim($v))){
					echo "<td style='text-align:right'>".number_format($v,2,",",".")."</td>";
				}
				else{
					echo "<td style='text-align:left'>".converte($v)."</td>";
				}
				if ($statrel == "true"){
					$v = trim($v);
					if(!is_numeric($v)){$v = 0;}
					if ($v == $excluirvalor){$v = 0;}
					$soma[$conta] = $soma[$conta] + $v;
				}
				$conta++;
			}
			echo "<tr>";
			if ($cor == "rgb(240,240,240)")
			{$cor = "rgb(220,220,220)";}
			else
			{$cor = "rgb(240,240,240)";}
		}
	}
	if ($statrel == "true")
	{
		echo "<tr style=background-color:orange >";
		echo "<td>soma</td>";
		foreach($soma as $s)
		echo "<td style='text-align:right'>".number_format($s,2,",",".")."</td>";
		echo "</tr>";
		echo "<tr style=background-color:orange >";
		echo "<td>m&eacute;dia</td>";
		foreach($soma as $s)
		echo "<td style='text-align:right'>".number_format(($s / $ocorrencias),2,",",".")."</td>";
		echo "</tr>";
	}
	echo "</table>";
}
else
{
	$conta = -1;
	$chaves = array_keys($registros);
	sort($chaves);
	foreach ($chaves as $chave)
	{
		//if(count($registro) < 1){continue;}
		//var_dump($registros[$conta]);
		$ocorrencias = count($registros[$chave]);
		echo "<br><br><b>".$itemagruparel.": ".$chave."<br>ocorr&ecirc;ncias: ".$ocorrencias."<br></b>";
		//echo "<pre>";var_dump($registro);
		echo "<table>";
		$cor = "rgb(240,240,240)";
		echo "<tr style=background-color:yellow >";
		if ($statrel == "true")
		echo "<td></td>";
		foreach ($colunas as $c)
		{
			echo "<td>$c</td>";
		}
		$soma = array();
		if($arearel == "true")
		{echo "<td>&aacute;rea em ha</td>";}
		echo "<tr>";
		foreach ($registros[$chave] as $linhas)
		{
			if (count($linhas) > 0 )
			{
				//echo "<pre>";var_dump($linhas);
				echo "<tr style=background-color:$cor >";
				if ($statrel == "true")
				echo "<td></td>";
				$conta = 0;
				foreach($linhas as $v)
				{
					if(is_numeric(trim($v)))
					{echo "<td style='text-align:right'>".number_format($v,2,",",".")."</td>";}
					else
					{echo "<td style='text-align:left'>".converte($v)."</td>";}
					if ($statrel == "true")
					{
						$v = trim($v);
						if(!is_numeric($v)){$v = 0;}
						if ($v == $excluirvalor){$v = 0;}
						$soma[$conta] = $soma[$conta] + $v;
					}
					$conta++;
				}
				echo "<tr>";
				if ($cor == "rgb(240,240,240)")
				{$cor = "rgb(220,220,220)";}
				else
				{$cor = "rgb(240,240,240)";}
			}
		}
		if ($statrel == "true" && $ocorrencias>1 )
		{
			echo "<tr style=background-color:orange >";
			echo "<td>soma</td>";
			foreach($soma as $s)
			echo "<td style='text-align:right'>".number_format($s,2,",",".")."</td>";
			echo "</tr>";
			echo "<tr style=background-color:orange >";
			echo "<td>m&eacute;dia</td>";
			foreach($soma as $s)
			echo "<td style='text-align:right'>".number_format(($s / $ocorrencias),2,",",".")."</td>";
			echo "</tr>";
		}
		echo "</table>";
	}

}
function calculaarea($geo)
{
	global $postgis_con;
	$v = versao();
	if (($v["principal"] < 5) && ($postgis_con == ""))
	{return ("erro. &Eacute; necess&aacute;ria uma vers&atilde;o maior que 5.0 do Mapserver.");}
	$g = $geo->towkt();
	$shape = ms_shapeObjFromWkt($g);
	$rect = $shape->bounds;
	$projInObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
	$projOutObj = ms_newprojectionobj("proj=laea,lat_0=".$rect->miny.",lon_0=".$rect->minx.",x_0=500000,y_0=10000000,ellps=GRS67,units=m,no_defs");
	$shape->project($projInObj, $projOutObj);
	$s = $shape->towkt();
	$shape = ms_shapeObjFromWkt($s);
	$area = $shape->getArea();
	return $area / 10000;
}
function converte($texto)
{
	if (!mb_detect_encoding($texto,"UTF-8",true))
	{
		$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");
	}
	return $texto;
}
?>