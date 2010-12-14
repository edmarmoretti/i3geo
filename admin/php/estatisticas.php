<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/i3geo_ferramentas45.css">
<title></title>
<style>
td {text-align:left}
</style>
</head>
<body style=overflow:auto; >
<div style=text-align:center;width:600px >
<p><img src="../../imagens/i3geo1.jpg" />
<p style='font-size:16px'>Estatística do sistema de administração</p> 
<div style=text-align:left;width:600px >
<?php
/*
Title: Estatísticas do banco de dados de administração

Gera uma página HTML com dados que descrevem a situação atual do banco de dados de administração.

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/estatisticas.php

*/
include_once("admin.php");

$totaltemas = count(pegaDados("select * from i3geoadmin_temas"));
$temasvalidos = pegaDados("select * from i3geoadmin_temas where codigo_tema <> ''");
$temasassocsubgrupos = pegaDados("select id_tema from i3geoadmin_n3 group by id_tema");
$ntags = pegaDados("select nome from i3geoadmin_tags");
error_reporting(0);
$totaltemasvalidos = count($temasvalidos);
$codigostemas = array();
$ncodigostemas = array();
$nnomestemas = array();
$ndownloadtemas = 0;
$nkmltemas = 0;
$nogctemas = 0;
$nsemlinktemas = 0;
$nsemtagstemas = 0;
$nacessosmaiorqueum = 0;
$nacessosmaiorquedez = 0;
$nacessosmaiorquecem = 0;
$temasacessos = array();
foreach($temasvalidos as $tema){
	$ncodigostemas[$tema[codigo_tema]]++; 
	$nnomestemas[$tema[nome_tema]]++;
	if(strtolower($tema["download_tema"]) == "sim")
	{$ndownloadtemas++;}
	if(strtolower($tema["kml_tema"]) != "nao")
	{$nkmltemas++;}
	if(strtolower($tema["ogc_tema"]) != "nao")
	{$nogctemas++;}
	if(strtolower($tema["link_tema"]) == "")
	{$nsemlinktemas++;}
	if($tema["tags_tema"] == "")
	{$nsemtagstemas++;}
	if($tema["nacessos"] > 0)
	{$nacessosmaiorqueum++;}
	if($tema["nacessos"] > 10)
	{$nacessosmaiorquedez++;}
	if($tema["nacessos"] > 100)
	{	
		$nacessosmaiorquecem++;
		//$temasmaisdecem[] = $tema[nome_tema];
	}
	$temasacessos[$tema[nome_tema]] = $tema["nacessos"];
}
$temasmaisdeum = array();
foreach ($ncodigostemas as $n)
{
	if($n > 1)
	$temasmaisdeum[] = $n;
}
$nomestemasmaisdeum = array();
foreach ($nnomestemas as $n)
{
	if($n > 1)
	$nomestemasmaisdeum[] = $n;
}
echo "<table>";
echo "<tr><td><b>Número total de temas cadastrados: </b></td><td>$totaltemas</td><td></td></tr>";
echo "<tr><td><b>Número total de temas válidos (código diferente de vazio): </b></td><td>$totaltemasvalidos</td><td></td></tr>";
echo "<tr><td><b>Temas válidos com códigos duplicados: </b></td><td>".count($temasmaisdeum)."</td><td></td></tr>";
echo "<tr><td><b>Temas válidos com nomes duplicados: </b></td><td>".count($nomestemasmaisdeum)."</td><td></td></tr>";
echo "<tr><td><b>Temas associados a algum sub-grupo: </b></td><td>".count($temasassocsubgrupos)."</td><td></td></tr>";

echo "<tr><td>Dos temas válidos:</td><td>&nbsp;</td><td></td></tr>";
echo "<tr><td><b>Número de temas sem link: </b></td><td>".$nsemlinktemas."</td><td>&nbsp;&nbsp;".round(($nsemlinktemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
echo "<tr><td><b>Número de temas sem tags: </b></td><td>".$nsemtagstemas."</td><td>&nbsp;&nbsp;".round(($nsemtagstemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
echo "<tr><td><b>Número de temas disponíveis para download: </b></td><td>".$ndownloadtemas."</td><td>&nbsp;&nbsp;".round(($ndownloadtemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
echo "<tr><td><b>Número de temas disponíveis como KML: </b></td><td>".$nkmltemas."</td><td>&nbsp;&nbsp;".round(($nkmltemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
echo "<tr><td><b>Número de temas disponíveis como Web Service OGC: </b></td><td>".$nogctemas."</td><td>&nbsp;&nbsp;".round(($nogctemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";

echo "<tr><td>&nbsp;</td><td>&nbsp;</td><td></td></tr>";
echo "<tr><td><b>Número de temas com acesso maior que 0: </b></td><td>".$nacessosmaiorqueum."</td><td>&nbsp;&nbsp;".round(($nacessosmaiorqueum * 100) / $totaltemasvalidos,2) ." %</td></tr>";
echo "<tr><td><b>Número de temas com acesso maior que 10: </b></td><td>".$nacessosmaiorquedez."</td><td>&nbsp;&nbsp;".round(($nacessosmaiorquedez * 100) / $totaltemasvalidos,2) ." %</td></tr>";
echo "<tr><td><b>Número de temas com acesso maior que 100: </b></td><td>".$nacessosmaiorquecem."</td><td>&nbsp;&nbsp;".round(($nacessosmaiorquecem * 100) / $totaltemasvalidos,2) ." %</td></tr>";

echo "<tr><td>&nbsp;</td><td>&nbsp;</td><td></td></tr>";
echo "<tr><td><b>Número de tags: </b></td><td>".count($ntags)."</td><td></td></tr>";

echo "</table>";
echo "<p><b>Aceesos por tema</b></p>";
arsort($temasacessos);
$temasacessos2 = array_keys($temasacessos);
for($i=0;$i<=count($temasacessos2);$i++)
{
	if(mb_detect_encoding($temasacessos2[$i],'UTF-8, ISO-8859-1') == "UTF-8")
	echo "<p>".utf8_decode($temasacessos2[$i])." - ".$temasacessos[$temasacessos2[$i]]."</p>";
	else
	echo "<p>".$temasacessos2[$i]." - ".$temasacessos[$temasacessos2[$i]]."</p>";
}
echo "<pre>";
echo "<hr>".date('l jS \of F Y h:i:s A');
//var_dump($temasacessos);
?>
