<?php
if (!isset($esquemaadmin)){
	include_once(dirname(__FILE__)."/../ms_configura.php");
}
if(!empty($esquemaadmin)){
	$esquemaadmin = str_replace(".","",$esquemaadmin).".";
}

/*
Function: geraXmlSistemas (depreciado)

Parametros:

perfil {string} - perfil que ser&aacute; considerado na gera&ccedil;&atilde;o do XML

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

editores {array} - lista de editores cadastrados em ms_configura.php

Retorno:

String na estrutura XML
*/
function geraXmlSistemas($perfil="",$locaplic="",$editores="")
{
	global $esquemaadmin;
	if(empty($locaplic)){
		return;
	}
	$editor = "nao";//verificaEditores($editores);
	if (!isset($perfil)){$perfil = "";}
	$perfil = str_replace(","," ",$perfil);
	$perfil = explode(" ",$perfil);
	$dbh = "";
	include($locaplic."/classesphp/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<SISTEMAS>\n";
	$q = "select * from ".$esquemaadmin."i3geoadmin_sistemas";
	$qsis = $dbh->query($q);
	$sistemas = array();
	foreach($qsis as $row)
	{
		if($row["perfil_sistema"] == "")
		$mostra = true;
		else
		{
			$perfilS = explode(" ",str_replace(","," ",$row["perfil_sistema"]));
			$mostra = array_in_array($perfil,$perfilS);
		}
		if(strtolower($row["publicado_sistema"] == "nao"))
		{$mostra = false;}
		if($editor)
		{$mostra = true;}
		if($mostra)
		{
			$xml .= "<SISTEMA>\n";
			$xml .= " <PERFIL>".$row["perfil_sistema"]."</PERFIL>\n";
			$xml .= " <PUBLICADO>".$row["publicado_sistema"]."</PUBLICADO>\n";
			$xml .= " <NOMESIS>".xmlTexto_prepara($row["nome_sistema"])."</NOMESIS>\n";
			$xml = geraXmlSistemas_pegafuncoes($perfil,$xml,$row["id_sistema"],$dbh);
			$xml .= "</SISTEMA>\n";
			$funcoesSistema = geraXmlSistemas_pegafuncoes($perfil,$xml,$row["id_sistema"],$dbh);
			$sistemas[] = array(
				"perfil"=>$row["perfil_sistema"],
				"publicado"=>$row["publicado_sistema"],
				"nome"=>$row["nome_sistema"],
				"id"=>$row["id_sistema"],
				"funcoes"=>$funcoesSistema
			);
		}
	}
	$xml .= "</SISTEMAS>\n";
	$dbh = null;
	$dbhw = null;
	//var_dump($sistemas);exit;
	return $sistemas;
}
/*
Function: geraXmlDownload

RSS com os links para sistemas de download

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraXmlDownload($locaplic)
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = 'DOWNLOAD' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Enderecos para download");
}
/*
Function: geraXmlWS

RSS com a lista de WS cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraXmlWS($locaplic,$output="xml")
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = 'WS' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Web services",$output);
}
/*
Function: geraXmlKmlrss

RSS com a lista de KML cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraXmlKmlrss($locaplic)
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = 'KML' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Web services");
}
/*
Function: geraXmlWMS

RSS com a lista de WMS cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraXmlWMS($locaplic,$output)
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where (tipo_ws = 'WMS' or tipo_ws = 'WMS-Tile' or tipo_ws = 'WMS-Time') and nome_ws <> '' order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Web services WMS-OGC",$output);
}
function geraXmlARCGISREST($locaplic,$output)
{
    global $esquemaadmin;
    $sql = "select * from ".$esquemaadmin."i3geoadmin_ws where (tipo_ws = 'ARCGISREST') and nome_ws <> '' order by nome_ws";
    return geraXmlRSS($locaplic,$sql,"WMS ARCGIS (rest)",$output);
}
function geraXmlGeojson($locaplic,$output)
{
    global $esquemaadmin;
    $sql = "select * from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = 'GEOJSON' and nome_ws <> ''";
    return geraXmlRSS($locaplic,$sql,"Georss",$output);
}

/*
Function: geraXmlRSS

Gera um RSS com base em um SQL compat&iacute;vel com o sistema de administra&ccedil;&atilde;o.

O SQL dever&aacute; retornar os itens nome_ws desc_ws e link_ws

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

sql {string} - SQL que ser&aacute; aplicado ao sistema de administra&ccedil;&atilde;o

descricao {string} - descri&ccedil;&atilde;o que ser&aacute; inserida no canal RSS

output {string} - xml|json
Retorno:

RSS
*/
function geraXmlRSS($locaplic,$sql,$descricao,$output="xml")
{
	global $esquemaadmin;
	if(empty($output)){
		$output = "xml";
	}
	//var_dump($_SERVER);exit;
	$dbh = "";
	include($locaplic."/classesphp/conexao.php");
	if($convUTF){
		$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	} else {
		$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	}
	$xml .= "<rss version='2.0'>";
	$xml .= "<channel>\n";
	$xml .= "<title>RSS</title>\n";
	$xml .= "<description>".str_replace("&","&amp;",$descricao)."</description>\n";
	$xml .= "<link></link>\n";
	$xml .= "<docs></docs>\n";
	$xml .= "<copyright>Gerado pelo i3Geo</copyright>\n";
	$xml .= "<language>pt-br</language>\n";
	$xml .= "<webmaster></webmaster>\n";
	$json = array(
		"description"=>$descricao,
		"copyright"=>"Gerado pelo i3Geo",
		"language"=>"pt-br"
	);
	$jsonItems = array();
	$qsis = $dbh->query($sql);
	foreach($qsis as $row) {
		$xml .= "<item>\n";
		$xml .= "<category/>\n";
		$xml .= "<title>".entity_decode($row["nome_ws"])."</title>\n";
		$xml .= "<description>".xmlTexto_prepara(entity_decode($row["desc_ws"]))."</description>\n";
		$link = xmlTexto_prepara($row["link_ws"]);
		if(stristr($link, 'http') === FALSE){
			$link = "http://".$_SERVER["HTTP_HOST"].dirname($_SERVER["REQUEST_URI"])."/".$link;
		}
		$xml .= "<link><![CDATA[".$link."]]></link>\n";
		$xml .= "<pubDate/>\n";
		$xml .= "<author>".xmlTexto_prepara($row["autor_ws"])."</author>\n";
		$xml .= "<nacessos></nacessos>\n";
		$xml .= "<nacessosok></nacessosok>\n";
		if(!isset($row["id_ws"])){
		    $row["id_ws"] = "";
		}
		$xml .= "<id>".xmlTexto_prepara($row["id_ws"])."</id>\n";

		$xml .= "<tipo>".$row["tipo_ws"]."</tipo>\n";
		$xml .= "</item>\n";
		$jsonItems[] = array(
			"title"=>$row["nome_ws"],
			"description"=>$row["desc_ws"],
			"link"=>$link."&output=json",
			"author"=>$row["autor_ws"],
			"id"=>$row["id_ws"],
			"tipo"=>$row["tipo_ws"]
		);
	}
	$json["items"] = $jsonItems;
	$xml .= "</channel></rss>\n";
	$dbh = null;
	$dbhw = null;
	if($output == "xml"){
		return $xml;
	}
	else{
		return json_encode($json);
	}
}
function geraXmlIdentifica($perfil,$locaplic,$editores="")
{
	global $esquemaadmin;
	$editor = "nao";//$editor = verificaEditores($editores);
	if (!isset($perfil)){$perfil = "";}
	$perfil = str_replace(","," ",$perfil);
	$perfil = explode(" ",$perfil);
	$dbh = "";
	include($locaplic."/classesphp/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<SISTEMAS>\n";
	$q = "select * from ".$esquemaadmin."i3geoadmin_identifica ";
	$qi = $dbh->query($q);
	foreach($qi as $row)
	{
		$mostra = true;
		if(strtolower($row["publicado_i"] == "nao"))
		{$mostra = false;}
		if($editor)
		{$mostra = true;}
		if($mostra)
		{
			$xml .= " <FUNCAO>\n";
			$xml .= "  <NOMESIS>".xmlTexto_prepara($row["nome_i"])."</NOMESIS>\n";
			$xml .= "  <ABRIR>".xmlTexto_prepara($row["abrir_i"])."</ABRIR>\n";
			$xml .= "  <PUBLICADO>".$row["publicado_i"]."</PUBLICADO>\n";
			$target = $row["target_i"];
			if($target == ""){$target = "_self";}
			$xml .= "  <TARGET>".$target."</TARGET>\n";
			$xml .= " </FUNCAO>\n";
		}//error_reporting(0);
	}
	$xml .= "</SISTEMAS>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
//
//$id_menu = id do menu que ser&aacute; montado
//$perfil = perfis separados por espa&ccedil;os
//$tipo = gruposeraiz|subgrupos|temas
//$dbh objeto com a conex&atilde;o com o banco
//$locaplic = localiza&ccedil;&atilde;o do i3geo no servidor
//
function geraXmlMenutemas($perfil,$id_menu,$tipo,$locaplic)
{
	global $esquemaadmin;
	xml_testaNum([$id_menu]);
	$dbh = "";
	include($locaplic."/classesphp/conexao.php");
	if (!isset($perfil)){$perfil = "";}
	$perfil = str_replace(","," ",$perfil);
	$perfil = explode(" ",$perfil);
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<TEMASGEO>\n";
	if(!isset($id_menu))
	$xml .= "<CABECALHO>Utilize ?id_menu=1 por exemplo</CABECALHO>\n";
	else
	$xml .= "<CABECALHO></CABECALHO>\n";
	//
	//pega os temas na raiz
	//
	$q = "select nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,r.perfil as perfil from ".$esquemaadmin."i3geoadmin_raiz as r,".$esquemaadmin."i3geoadmin_temas as temas where r.id_nivel = 0 and r.id_tema = temas.id_tema and r.id_menu = $id_menu ";
	$qtemasraiz = $dbh->query($q);
	$xml = geraXmlMenutemas_notema($qtemasraiz,$xml,$perfil);
	$q = "select nome_grupo,desc_grupo,n1.id_grupo,n1.id_n1,n1.n1_perfil as perfil from ".$esquemaadmin."i3geoadmin_n1 as n1,".$esquemaadmin."i3geoadmin_grupos as grupos where n1.id_menu = $id_menu and n1.id_grupo = grupos.id_grupo ";
	$qgrupos = $dbh->query($q);
	foreach($qgrupos as $row)
	{
		//filtra pelo perfil
		if($row["perfil"] == "")
		{$mostra = true;}
		else
		{
			$perfilatual = explode(" ",str_replace(","," ",$row["perfil"]));
			$mostra = array_in_array($perfil,$perfilatual);
		}
		if($mostra)
		{
			$xml .= "<GRUPO>\n";
			$xml .= " <GTIPO>".xmlTexto_prepara($row["nome_grupo"])."</GTIPO>\n";
			//
			//pega temas na raiz
			//
			$q = "select nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,r.perfil as perfil from ".$esquemaadmin."i3geoadmin_raiz as r,".$esquemaadmin."i3geoadmin_temas as temas where r.nivel = 1 and r.id_nivel = ".$row["id_n1"]." and r.id_tema = temas.id_tema and r.id_menu = $id_menu ";
			$qtemasraiz = $dbh->query($q);
			$xml = geraXmlMenutemas_notema($qtemasraiz,$xml,$perfil);
			if(isset($tipo) && ($tipo == "subgrupos") || ($tipo == ""))
			$xml = geraXmlMenutemas_pegasubgrupos($row["id_n1"],$xml,$dbh,$tipo,$perfil);
			$xml .= " <DTIPO>".xmlTexto_prepara($row["desc_grupo"])."</DTIPO>\n";
			$xml .= " <PERFIL>".$row["perfil"]."</PERFIL>\n";
			$xml .= "</GRUPO>\n";
		}
	}
	$xml .= "</TEMASGEO>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
function geraXmlMenutemas_pegasubgrupos($id_n1,$xml,$dbh,$tipo,$perfil)
{
	global $esquemaadmin;
	xml_testaNum([$id_n1]);
	$q = "select subgrupos.id_subgrupo,nome_subgrupo,id_n2,n2.n2_perfil as perfil from ".$esquemaadmin."i3geoadmin_n2 as n2,".$esquemaadmin."i3geoadmin_subgrupos as subgrupos where n2.id_n1 = $id_n1 and n2.id_subgrupo = subgrupos.id_subgrupo ";
	//echo $q;exit;
	$qsgrupos = $dbh->query($q);
	foreach($qsgrupos as $row)
	{
		if($row["perfil"] == "")
		$mostra = true;
		else
		{
			$perfilatual = explode(" ",str_replace(","," ",$row["perfil"]));
			$mostra = array_in_array($perfil,$perfilatual);
		}
		if($mostra)
		{
			$xml .= "<SGRUPO>\n";
			$xml .= "<SDTIPO>".xmlTexto_prepara($row["nome_subgrupo"])."</SDTIPO>\n";
			$xml .= "<PERFIL>".xmlTexto_prepara($row["perfil"])."</PERFIL>\n";
			if(isset($tipo) && ($tipo == "temas") || ($tipo == ""))
			$xml = geraXmlMenutemas_pegatemas($row["id_n2"],$xml,$dbh,$perfil);
			$xml .= "</SGRUPO>\n";
		}
	}
	return $xml;
}
function geraXmlMenutemas_pegatemas($id_n2,$xml,$dbh,$perfil)
{
	global $esquemaadmin;
	xml_testaNum([$id_n2]);
	$q = "select nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,n3.n3_perfil as perfil from ".$esquemaadmin."i3geoadmin_n3 as n3,".$esquemaadmin."i3geoadmin_temas as temas where n3.id_n2 = $id_n2 and n3.id_tema = temas.id_tema ";
	$qtemas = $dbh->query($q);
	$xml = geraXmlMenutemas_notema($qtemas,$xml,$perfil);
	return $xml;
}
function geraXmlMenutemas_notema($qtemas,$xml,$perfil)
{
	global $esquemaadmin;
	foreach($qtemas as $row)
	{
		if($row["perfil"] == "")
		{$mostra = true;}
		else
		{
			$perfilatual = explode(" ",str_replace(","," ",$row["perfil"]));
			$mostra = array_in_array($perfil,$perfilatual);
		}
		if($mostra)
		{
			$xml .= "<TEMA>\n";
			$xml .= "<TID>".$row["codigo_tema"]."</TID>\n";
			$xml .= "<PERFIL>".$row["perfil"]."</PERFIL>\n";
			$xml .= "<TNOME>".xmlTexto_prepara($row["nome_tema"])."</TNOME>\n";
			$xml .= "<TDESC>".xmlTexto_prepara($row["desc_tema"])."</TDESC>\n";
			$xml .= "<TLINK><![CDATA[".xmlTexto_prepara($row["link_tema"])."]]></TLINK>\n";
			$xml .= "<TIPOA>".$row["tipoa_tema"]."</TIPOA>\n";
			$xml .= "<TAGS>".xmlTexto_prepara($row["tags_tema"])."</TAGS>\n";
			$xml .= "<KML>".$row["kml_tema"]."</KML>\n";
			if($row["tipoa_tema"] == "WMS")
			{$xml .= "<OGC>nao</OGC>\n";}
			else
			{$xml .= "<OGC>".$row["ogc_tema"]."</OGC>\n";}
			$xml .= "<DOWNLOAD>".$row["download_tema"]."</DOWNLOAD>\n";
			$xml .= "<NACESSOS></NACESSOS>\n";
			$xml .= "</TEMA>\n";
		}
	}
	return $xml;
}

function array_in_array($needle, $haystack)
{
		//Make sure $needle is an array for foreach
		if(!is_array($needle)) $needle = array($needle);
		//For each value in $needle, return TRUE if in $haystack
		foreach($needle as $pin)
				if(in_array($pin, $haystack)) return TRUE;
		//Return FALSE if none of the values from $needle are found in $haystack
		return FALSE;
}
function xmlTexto_prepara($texto)
{
	return str_replace("&","&amp;",$texto);
}
function entity_decode($texto)
{
	return html_entity_decode($texto);
}
function xml_testaNum($valores){
	foreach ($valores as $valor) {
		if(!empty($valor) && !is_numeric($valor)) {
			ob_clean();
			header ( "HTTP/1.1 403 valor nao numerico" );
			exit;
		}
	}
}
?>
