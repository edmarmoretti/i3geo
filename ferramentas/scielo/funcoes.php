<?php
error_reporting(0);
require_once("../../classesjs/cpaint/cpaint2.inc.php");
require_once("../../ms_configura.php");
require_once("../../pacotes/phpxbase/api_conversion.php");
$cp = new cpaint();
$cp->register('listaartigos');
$cp->start();
$cp->return_data();
function listaartigos()
{
	global $ret, $cp;
	$ret = explode(" ",$ret);
	$pol = "POLYGON((".$ret[0]." ".$ret[3].",".$ret[2]." ".$ret[3].",".$ret[2]." ".$ret[1].",".$ret[0]." ".$ret[1].",".$ret[0]." ".$ret[3]."))";
	$pgpar = "host=10.1.1.36 port=5432 dbname=geodados user=geodados password=geodados";
	$pgconn = pg_connect($pgpar);
	$sql = "SELECT DISTINCT tab.codigo AS g, tab.nome as n, tab.uf as u";
	$sql .= " FROM brasil.bralim6 AS tab";
	$sql .= " WHERE intersects(GeomFromText('".$pol."',4291),tab.the_geom)";
	$result=pg_query($pgconn, $sql);
	$numrows = pg_num_rows($result);
	if ($numrows == 0){return 0;}
	for ($i = 0; $i < $numrows; $i++)
	{
		$arr = pg_fetch_array($result, $i);
		$codigos[] = $arr["g"];
	}
	pg_close($pgconn);
	$fdbf = xbase_open("/opt/www/html/mapas/aplic/dadosdoc/scielo/scielomun.dbf",'r');
	$fdbfnr = xbase_numrecords($fdbf);
	$achou = "nao";
	$fdbfnr = xbase_numrecords($fdbf);
	for ($i=1;$i <= $fdbfnr;$i++)
	{
		$reg = xbase_get_record_with_names ( $fdbf, ($i + 1) );
		$codibge = $reg["CODIBGE"];
		if (array_search($codibge,$codigos) !== FALSE)
		{
			$artigo = $reg["ARTIGO"];
			$codscielo = $reg["CODS"];
			$ins[] = $codscielo."*".$artigo;
			$achou = "sim";
		}
	}
	xbase_close($fdbf);
	if ($achou == "nao"){$ins[] = "*Nao foi encontrado nenhum artigo!";}
	if (function_exists(mb_convert_encoding))
	{$res = mb_convert_encoding(implode("#",$ins),"UTF-8","ISO-8859-1");}
	else
	{$res = implode("#",$ins);}
	$cp->set_data($res);
}
?>