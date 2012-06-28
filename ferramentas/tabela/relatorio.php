<?php
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
include("../../classesphp/pega_variaveis.php");
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$postgis_mapa = $_SESSION["postgis_mapa"];
include("../../classesphp/carrega_ext.php");
include("../../classesphp/funcoes_gerais.php");
$versao = versao();
$versao = $versao["principal"];
substituiCon($map_file,$postgis_mapa);
$temp = explode(",",$nomesrel);
$colunas = array();
foreach($temp as $t)
{
	$t1=explode(";",$t);
	$colunas[] = $t1[0];
}
if($itemagruparel != ""  && !in_array($itemagruparel,$colunas))
{$colunas[] = $itemagruparel;}
$temp = explode(",",$itensrel);
$itensrel = array();
foreach($temp as $t)
{
	$t1=explode(";",$t);
	$itensrel[] = $t1[0];
}
if($itemagruparel != ""  && !in_array($itemagruparel,$itensrel))
{$itensrel[] = $itemagruparel;}
$mapa = ms_newMapObj($map_file);
if($ext && $ext != ""){
	$e = explode(" ",$ext);
	$extatual = $mapa->extent;
	$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
}
$layer = $mapa->getlayerbyname($temarel);
$layer->set("template","none.html");
$existesel = "nao";
/*
if (file_exists($map_file."qy"))
{$mapa->loadquery($map_file."qy");}
*/
carregaquery2($map_file,$layer,$mapa);
if ($layer->getNumresults() > 0){$existesel = "sim";}
if ($existesel == "nao")
{$layer->querybyrect($mapa->extent);}
$layer->open();
if(strtoupper($layer->getmetadata("convcaracter")) == "NAO")
{$convC = false;}
else
{$convC = true;}
//$registros[] = array();
$res_count = $layer->getNumresults();
for ($i = 0; $i < $res_count; $i++)
{
	$valitem = array();
	if($versao == 6)
	{$shape = $layer->getShape($layer->getResult($i));}
	else{$shape = $layer->getFeature($layer->getResult($i)->shapeindex);}	
	$grupo = "";
	foreach ($itensrel as $item)
	{
		$v = trim($shape->values[$item]);
		if (function_exists("mb_convert_encoding") && $convC == true)
		{$v = mb_convert_encoding($v,"UTF-8","ISO-8859-1");}
		$valitem[$item] = $v;
	}
	if ($itemagruparel != "")
	{$grupo = $valitem[$itemagruparel];}
	if($arearel == "true")
	{
		$valitem["area"] = calculaarea($shape);
	}
	if ($itemagruparel == "")
	$registros[] = $valitem;
	else
	{
		if(!$registros[$grupo])
		$registros[$grupo]=array($valitem);
		else
		array_push($registros[$grupo],$valitem);
	}
}
$fechou = $layer->close();
restauraCon($map_file,$postgis_mapa);

if(isset($tiporel) && $tiporel == "csv")
{
	echo "<pre>";
	echo implode(";",explode(",",$nomesrel));
	if($arearel == "true")
	{echo ";&aacute;rea em ha \n";}
	else
	{echo "\n";}
	foreach ($registros as $linhas)
	{echo implode(";",$linhas)."\n";}
	exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>i3Geo</title>
</head>
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
<img src='../../imagens/i3geo1.jpg' /><br>
<?php
echo "<span style=font-size:18px; >Relat&oacute;rio do tema: <b>".$layer->getmetadata("TEMA")."</b><br></span>";
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
		if(count($linhas)>0)
		{
			echo "<tr style=background-color:$cor >";
			if ($statrel == "true")
			echo "<td></td>";
			$conta = 0;
			foreach($linhas as $v)
			{
				if(is_numeric(trim($v)))
				{echo "<td style='text-align:right'>".number_format($v,2,",",".")."</td>";}
				else
				{echo "<td style='text-align:left'>$v</td>";}
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
					{echo "<td style='text-align:left'>$v</td>";}
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
	{return ("erro. &Eacute; necess&aacute;ria uma versão maior que 5.0 do Mapserver.");}
	$g = $geo->towkt();
	$shape = ms_shapeObjFromWkt($g);
	$rect = $shape->bounds;
	$projInObj = ms_newprojectionobj("proj=latlong");
	$projOutObj = ms_newprojectionobj("proj=laea,lat_0=".$rect->miny.",lon_0=".$rect->minx.",x_0=500000,y_0=10000000,ellps=GRS67,units=m,no_defs");					
	$shape->project($projInObj, $projOutObj);
	$s = $shape->towkt();
	$shape = ms_shapeObjFromWkt($s);
	$area = $shape->getArea();
	return $area / 10000;
}
?>