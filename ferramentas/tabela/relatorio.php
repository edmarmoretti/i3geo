<?php
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
include("../../classesphp/carrega_ext.php");
include("../../classesphp/pega_variaveis.php");
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
$layer = $mapa->getlayerbyname($temarel);
$existesel = "nao";
if (file_exists($map_file."qy"))
{$mapa->loadquery($map_file."qy");}
if ($layer->getNumresults() > 0){$existesel = "sim";}
if ($existesel == "nao")
{$layer->querybyrect($mapa->extent);}
$layer->open();
//$registros[] = array();
$res_count = $layer->getNumresults();
for ($i = 0; $i < $res_count; $i++)
{
	$valitem = array();
	$result = $layer->getResult($i);
	$shp_index  = $result->shapeindex;
	$shape = $layer->getshape(-1, $shp_index);
	$grupo = "";
	foreach ($itensrel as $item)
	{
		$v = trim($shape->values[$item]);
		if (function_exists("mb_convert_encoding"))
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
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
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
	{
		echo "<td>$c</td>";
	}
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
				echo "<td>$v</td>";
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
		echo "<td>$s</td>";
		echo "</tr>";
		echo "<tr style=background-color:orange >";
		echo "<td>m&eacute;dia</td>";
		foreach($soma as $s)
		echo "<td>".($s / $ocorrencias)."</td>";
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
					echo "<td>$v</td>";
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
			echo "<td>$s</td>";
			echo "</tr>";
			echo "<tr style=background-color:orange >";
			echo "<td>m&eacute;dia</td>";
			foreach($soma as $s)
			echo "<td>".($s / $ocorrencias)."</td>";
			echo "</tr>";
		}
		echo "</table>";
	}

}
function calculaarea($geo)
{
	global $postgis_con;
	$v = versao();
	if (($v["principal"] != 5) && ($postgis_con == ""))
	{return ("erro. Nao foi definida a conexao com o Postgis.");}
	if ($v["principal"] != 5)
	{
		$pgconn = pg_connect($postgis_con);
		$g = $geo->towkt();
		$sql = "select area(transform( GeomFromText('$g',4291),$srid_area))::float as aream";
		$result=pg_query($pgconn, $sql);
		pg_close($pgconn);	
		$calculo = pg_fetch_all($result);
		return $calculo[0]["aream"];
	}
	else
	{
		$g = $geo->towkt();
		$shape = ms_shapeObjFromWkt($g);
		$rect = $shape->bounds;
		$projInObj = ms_newprojectionobj("proj=latlong");
		$projOutObj = ms_newprojectionobj("proj=laea,lat_0=".$rect->miny.",lon_0=".$rect->minx.",x_0=500000,y_0=10000000,ellps=GRS67,units=m,no_defs");					
		$shape->project($projInObj, $projOutObj);
		$s = $shape->towkt();
		$shape = ms_shapeObjFromWkt($s);
		$area = $shape->getArea();
		return $area;
	}
}
/*
function: versao

Retorna a versão do Mapserver.
*/
	function versao()
	{
		$v = "5.0.0";
		$vs = explode(" ",ms_GetVersion());
		for ($i=0;$i<(count($vs));$i++)
		{
			if(strtolower($vs[$i]) == "version")
			{$v = $vs[$i+1];}
		}
		$versao["completa"] = $v;
		$v = explode(".",$v);
		$versao["principal"] = $v[0];
		return $versao;
	}
?>