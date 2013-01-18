<?php
/*
Title: xml.php

Conjunto de fun&ccedil;&otilde;es que geram arquivos na estrutura XML conforme os dados cadastrados no sistema de administra&ccedil;&atilde;o.

Permite a gera&ccedil;&atilde;o de XML no padr&atilde;o RSS e outros. &Eacute; utilizado por fun&ccedil;&otilde;es internas do i3Geo e por programas
utilit&aacute;rios que fornecem dados no formato RSS para outros fins.

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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/xml.php
*/
//
//processa a vari&aacute;vel $esquemaadmin definida em ms_configura.php
//essa vari&aacute;vel precisa ter um . no final quando n&atilde;o for vazia, evitando erros na inclus&atilde;o dentro dos SQLs
//
if (!isset($esquemaadmin)){
	include_once(__DIR__."/../../ms_configura.php");
}
if(!empty($esquemaadmin)){
	$esquemaadmin = $esquemaadmin.".";
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
function geraXmlSistemas($perfil,$locaplic,$editores)
{
	global $esquemaadmin;
	$editor = verificaEditores($editores);
	if (!isset($perfil)){$perfil = "";}
	$perfil = str_replace(","," ",$perfil);
	$perfil = explode(" ",$perfil);
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<SISTEMAS>\n";
	$q = "select * from ".$esquemaadmin."i3geoadmin_sistemas";
	$qatlas = $dbh->query($q);
	foreach($qatlas as $row)
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
		}
	}
	$xml .= "</SISTEMAS>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
/*
Function: geraRSScomentariosTemas

RSS com os comentarios sobre um ou todos os temas

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

id_tema {numeric} - (opcional) id do tema para mostrar apenas os coment&aacute;rios de um tema

Retorno:

RSS
*/
function geraRSScomentariosTemas($locaplic,$id_tema="")
{
	global $esquemaadmin;
	$sql = "select '' as tipo_ws, b.nome_tema||' '||a.data as nome_ws,a.openidnome||' '||a.openidurl||' &amp;lt;br&amp;gt;'||a.comentario as desc_ws, a.openidnome as autor_ws, b.link_tema as link_ws from ".$esquemaadmin."i3geoadmin_comentarios as a,".$esquemaadmin."i3geoadmin_temas as b where a.id_tema = b.id_tema ";
	if($id_tema != "")
	{$sql .= " and a.id_tema = $id_tema ";}
	return geraXmlRSS($locaplic,$sql,"Lista de comentarios");
}
/*
Function: geraRSStemas

RSS com os temas cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

id_n2 {string} - código do subgrupo do sistema de administra&ccedil;&atilde;o

Retorno:

RSS
*/
function geraRSStemas($locaplic,$id_n2)
{
	global $esquemaadmin;
	$sql = "
		select '' as tipo_ws, i3geoadmin_temas.codigo_tema as id_ws,i3geoadmin_temas.nome_tema as nome_ws,'' as desc_ws,'php/parsemapfile.php?id='||i3geoadmin_temas.codigo_tema as link_ws,i3geoadmin_temas.link_tema as autor_ws
		from ".$esquemaadmin."i3geoadmin_n3 as n3
		LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = n3.id_tema
		LEFT JOIN ".$esquemaadmin."i3geousr_grupotema ON n3.id_tema = i3geousr_grupotema.id_tema
		where i3geousr_grupotema.id_grupo is null and i3geoadmin_temas.id_tema = n3.id_tema and n3.id_n2 = '$id_n2' and n3.n3_perfil = '' and n3.publicado != 'NAO' order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Lista de temas");
}
/*
Function: geraRSStemasRaiz

RSS com os temas localizados na raiz de um n&iacute;vel

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

id {string} - código do nó

nivel {string} - n&iacute;vel do nó

Retorno:

RSS
*/
function geraRSStemasRaiz($locaplic,$id,$nivel)
{
	global $esquemaadmin;
	$sql = "
	select '' as tipo_ws, i3geoadmin_temas.codigo_tema as id_ws,i3geoadmin_temas.nome_tema as nome_ws,'' as desc_ws,'php/parsemapfile.php?id='||i3geoadmin_temas.codigo_tema as link_ws,i3geoadmin_temas.link_tema as autor_ws
	from ".$esquemaadmin."i3geoadmin_raiz as r
	LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = r.id_tema
	LEFT JOIN ".$esquemaadmin."i3geousr_grupotema ON r.id_tema = i3geousr_grupotema.id_tema
	where i3geousr_grupotema.id_grupo is null and i3geoadmin_temas.id_tema = r.id_tema and r.nivel = '$nivel' and r.id_nivel = '$id' order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Temas na raiz");
}
/*
Function: geraRSSsubgrupos

RSS com os subgrupos cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

id_n1 {string} - código do grupo do sistema de administra&ccedil;&atilde;o

Retorno:

RSS
*/
function geraRSSsubgrupos($locaplic,$id_n1)
{
	global $esquemaadmin;
	$sql = "select '' as tipo_ws, n2.id_n2 as id_ws,g.nome_subgrupo as nome_ws,'' as desc_ws,'rsstemas.php?id='||n2.id_n2 as link_ws,'' as autor_ws from ".$esquemaadmin."i3geoadmin_n2 as n2,".$esquemaadmin."i3geoadmin_subgrupos as g ";
	$sql .= " where g.id_subgrupo = n2.id_subgrupo and n2.id_n1 = '$id_n1' and n2.n2_perfil = '' and n2.publicado != 'NAO' order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Lista de sub-grupos");
}
/*
Function: geraRSSgrupos

RSS com os grupos cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraRSSgrupos($locaplic)
{
	global $esquemaadmin;
	$sql = "select '' as tipo_ws, n1.id_n1 as id_ws, g.nome_grupo as nome_ws,'rsstemasraiz.php?nivel=1&id='||n1.id_n1 as desc_ws,'rsssubgrupos.php?id='||n1.id_n1 as link_ws,'' as autor_ws ";
	$sql .= "from ".$esquemaadmin."i3geoadmin_n1 as n1,".$esquemaadmin."i3geoadmin_grupos as g ";
	$sql .= "where g.id_grupo = n1.id_grupo and n1.n1_perfil = '' and n1.publicado != 'NAO' group by id_ws,tipo_ws,nome_ws,desc_ws,link_ws,autor_ws order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Lista de grupos");
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
function geraXmlWS($locaplic)
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = 'WS' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Web services");
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
function geraXmlWMS($locaplic)
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where (tipo_ws = 'WMS' or tipo_ws = 'WMS-Tile') and nome_ws <> '' order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Web services WMS-OGC");
}
/*
Function: geraXmlGeorss

RSS com a lista de GEORSS cadastrados

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraXmlGeorss($locaplic)
{
	global $esquemaadmin;
	$sql = "select * from ".$esquemaadmin."i3geoadmin_ws where tipo_ws = 'GEORSS' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Georss");
}
/*
Function: geraRSStemasDownload

RSS com a lista de temas para download

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraRSStemasDownload($locaplic)
{
	global $esquemaadmin;
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$url = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].(str_replace("/admin/rsstemasdownload.php","",$_SERVER['PHP_SELF']));
	$sql = "select '' as tipo_ws,'".$url."/datadownload.htm?'||codigo_tema as link_ws, g.nome_grupo||' -> '||sg.nome_subgrupo||' -> '||nome_tema as nome_ws, desc_tema as desc_ws, link_tema as autor_ws ";
	$sql .= "
		from ".$esquemaadmin."i3geoadmin_temas as t,".$esquemaadmin."i3geoadmin_n3 as n3, ".$esquemaadmin."i3geoadmin_n2 as n2, ".$esquemaadmin."i3geoadmin_n1 as n1, ".$esquemaadmin."i3geoadmin_grupos as g, ".$esquemaadmin."i3geoadmin_subgrupos as sg
		where
		t.id_tema = n3.id_tema
		and n3.id_n2 = n2.id_n2
		and n2.id_subgrupo = sg.id_subgrupo
		and n2.id_n1 = n1.id_n1
		and n1.id_grupo = g.id_grupo
		and (t.download_tema != 'nao' and t.download_tema != 'NAO')
		and t.tipoa_tema != 'WMS'
		and n3.n3_perfil = ''
		and n2.n2_perfil = ''
		and n1.n1_perfil = ''
		and n3.publicado != 'NAO'
		and n2.publicado != 'NAO'
		and n1.publicado != 'NAO'
	";
	//echo $sql;exit;
	return geraXmlRSS($locaplic,$sql,"Temas para download");
}
/*
Function: geraRSStemasKml

RSS com a lista de temas que permitem KML

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraRSStemasKml($locaplic)
{
	global $esquemaadmin;
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$url = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].(str_replace("/admin/rsstemaskml.php","",$_SERVER['PHP_SELF']));
	$sql = "select '' as tipo_ws,'".$url."/pacotes/kmlmapserver/kmlservice.php?request=kml&map='||codigo_tema||'&typename='||codigo_tema as link_ws, g.nome_grupo||' -> '||sg.nome_subgrupo||' -> '||nome_tema as nome_ws, desc_tema as desc_ws, link_tema as autor_ws ";
	$sql .= "
		from ".$esquemaadmin."i3geoadmin_temas as t,".$esquemaadmin."i3geoadmin_n3 as n3, ".$esquemaadmin."i3geoadmin_n2 as n2, ".$esquemaadmin."i3geoadmin_n1 as n1, ".$esquemaadmin."i3geoadmin_grupos as g, ".$esquemaadmin."i3geoadmin_subgrupos as sg
		where
		t.id_tema = n3.id_tema
		and n3.id_n2 = n2.id_n2
		and n2.id_subgrupo = sg.id_subgrupo
		and n2.id_n1 = n1.id_n1
		and n1.id_grupo = g.id_grupo
		and (t.kml_tema != 'nao' and t.kml_tema != 'NAO')
		and n3.n3_perfil = ''
		and n2.n2_perfil = ''
		and n1.n1_perfil = ''
		and n3.publicado != 'NAO'
		and n2.publicado != 'NAO'
		and n1.publicado != 'NAO'
	";
	//echo $sql;exit;
	return geraXmlRSS($locaplic,$sql,"Temas em KML");
}
/*
Function: geraRSStemasOgc

RSS com a lista de temas que permitem servi&ccedil;os OGC

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

Retorno:

RSS
*/
function geraRSStemasOgc($locaplic)
{
	global $esquemaadmin;
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$url = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].(str_replace("/admin/rsstemasogc.php","",$_SERVER['PHP_SELF']));
	$sql = "select '' as tipo_ws,'".$url."/ogc.php?request=getcapabilities&service=wms&tema='||codigo_tema as link_ws, g.nome_grupo||' -> '||sg.nome_subgrupo||' -> '||nome_tema as nome_ws, desc_tema as desc_ws, link_tema as autor_ws ";
	$sql .= "
		from ".$esquemaadmin."i3geoadmin_temas as t,".$esquemaadmin."i3geoadmin_n3 as n3, ".$esquemaadmin."i3geoadmin_n2 as n2, ".$esquemaadmin."i3geoadmin_n1 as n1, ".$esquemaadmin."i3geoadmin_grupos as g, ".$esquemaadmin."i3geoadmin_subgrupos as sg
		where
		t.id_tema = n3.id_tema
		and n3.id_n2 = n2.id_n2
		and n2.id_subgrupo = sg.id_subgrupo
		and n2.id_n1 = n1.id_n1
		and n1.id_grupo = g.id_grupo
		and (t.ogc_tema != 'nao' or t.ogc_tema != 'NAO')
		and t.tipoa_tema != 'WMS'
		and n3.n3_perfil = ''
		and n2.n2_perfil = ''
		and n1.n1_perfil = ''
		and n3.publicado != 'NAO'
		and n2.publicado != 'NAO'
		and n1.publicado != 'NAO'
	";
	//echo $sql;exit;
	return geraXmlRSS($locaplic,$sql,"Temas em KML");
}
/*
Function: geraXmlRSS

Gera um RSS com base em um SQL compat&iacute;vel com o sistema de administra&ccedil;&atilde;o.

O SQL dever&aacute; retornar os itens nome_ws desc_ws e link_ws

Parametros:

locaplic {string} - localiza&ccedil;&atilde;o do i3Geo no sistema de arquivos

sql {string} - SQL que ser&aacute; aplicado ao sistema de administra&ccedil;&atilde;o

descricao {string} - descri&ccedil;&atilde;o que ser&aacute; inserida no canal RSS
Retorno:

RSS
*/
function geraXmlRSS($locaplic,$sql,$descricao)
{
	global $esquemaadmin;
	//var_dump($_SERVER);exit;
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "<rss version='2.0'>";
	$xml .= "<channel>\n";
	$xml .= "<title>RSS</title>\n";
	$xml .= "<description>$descricao</description>\n";
	$xml .= "<link></link>\n";
	$xml .= "<docs></docs>\n";
	$xml .= "<copyright>Gerado pelo i3Geo</copyright>\n";
	$xml .= "<language>pt-br</language>\n";
	$xml .= "<webmaster></webmaster>\n";
	$qatlas = $dbh->query($sql);
	foreach($qatlas as $row)
	{
		$xml .= "<item>\n";
		$xml .= "<category/>\n";
		$xml .= "<title>".entity_decode($row["nome_ws"])."</title>\n";
		$xml .= "<description>".xmlTexto_prepara(entity_decode($row["desc_ws"]))."</description>\n";
		$link = xmlTexto_prepara($row["link_ws"]);
		if(stristr($link, 'http') === FALSE)
		{$link = "http://".$_SERVER["HTTP_HOST"].dirname($_SERVER["REQUEST_URI"])."/".$link;}
		$xml .= "<link>".$link."</link>\n";
		$xml .= "<pubDate/>\n";
		$xml .= "<author>".xmlTexto_prepara($row["autor_ws"])."</author>\n";
		$xml .= "<nacessos></nacessos>\n";
		$xml .= "<nacessosok></nacessosok>\n";
		$xml .= "<id>".xmlTexto_prepara($row["id_ws"])."</id>\n";
		$xml .= "<tipo>".$row["tipo_ws"]."</tipo>\n";
		$xml .= "</item>\n";
	}
	$xml .= "</channel></rss>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
function geraXmlAtlas($locaplic,$editores)
{
	global $esquemaadmin;
	error_reporting(0);
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<RAIZ>\n";
	//$q = "select * from i3geoadmin_atlas";
	$qatlas = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_atlas");

	$editor = verificaEditores($editores);
	foreach($qatlas as $row)
	{
		$mostra = true;
		if(strtolower($row["publicado_atlas"] == "nao"))
		{$mostra = false;}
		if($editor)
		{$mostra = true;}
		if($mostra)
		{
			$xml .= "<ATLAS>\n";
			$xml .= " <ID>".$row["id_atlas"]."</ID>\n";
			$xml .= " <PUBLICADO>".$row["publicado_atlas"]."</PUBLICADO>\n";
			$xml .= " <TITULO>".xmlTexto_prepara($row["titulo_atlas"])."</TITULO>\n";
			$xml .= " <DESCRICAO>".xmlTexto_prepara($row["desc_atlas"])."</DESCRICAO>\n";
			$xml .= " <ICONE>".$row["icone_atlas"]."</ICONE>\n";
			$xml .= " <LINKMAISINFO>".xmlTexto_prepara($row["link_atlas"])."</LINKMAISINFO>\n";
			$xml .= " <TEMPLATEHTML>".xmlTexto_prepara($row["template_atlas"])."</TEMPLATEHTML>\n";
			$xml .= " <WABERTURA>".$row["w_atlas"]."</WABERTURA>\n";
			$xml .= " <HABERTURA>".$row["h_atlas"]."</HABERTURA>\n";
			$xml .= " <PRANCHADEFAULT>".$row["pranchadefault_atlas"]."</PRANCHADEFAULT>\n";
			$xml .= " <TIPOGUIAS>".$row["tipoguias_atlas"]."</TIPOGUIAS>\n";
			$xml .= " <BASEMAPFILE>".$row["basemapfile_atlas"]."</BASEMAPFILE>\n";
			$xml .= " <PRANCHAS>\n";
			$xml = geraXmlAtlas_pegapranchas($xml,$row["id_atlas"],$dbh);
			$xml .= " </PRANCHAS>\n";
			$xml .= " </ATLAS>\n";
		}
	}
	$xml .= "</RAIZ>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
function geraXmlIdentifica($perfil,$locaplic,$editores)
{
	global $esquemaadmin;
	$editor = verificaEditores($editores);
	if (!isset($perfil)){$perfil = "";}
	$perfil = str_replace(","," ",$perfil);
	$perfil = explode(" ",$perfil);
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
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
		}error_reporting(E_ALL);
	}
	$xml .= "</SISTEMAS>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
function geraXmlMapas($perfil,$locaplic,$editores)
{
	global $esquemaadmin;
	if (!isset($perfil)){$perfil = "";}
	$perfil = str_replace(","," ",$perfil);
	$perfil = explode(" ",$perfil);
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<MAPAS>\n";
	$q = "select * from ".$esquemaadmin."i3geoadmin_mapas";
	$q = $dbh->query($q);
	$editor = verificaEditores($editores);
	foreach($q as $row)
	{
		$mostraMapa = false;
		if($row["perfil_mapa"] == "")
		{$mostraMapa = true;}
		else
		{
			$perfilMapa = explode(" ",str_replace(","," ",$row["perfil_mapa"]));
			$mostraMapa = array_in_array($perfil,$perfilMapa);
		}
		if(strtolower($row["publicado_mapa"] == "nao"))
		{$mostraMapa = false;}
		if($editor)
		{$mostraMapa = true;}
		if($mostraMapa)
		{
			$xml .= "<MAPA>\n";
			$xml .= " <PERFIL>".$row["perfil_mapa"]."</PERFIL>\n";
			$xml .= " <NOME>".xmlTexto_prepara($row["nome_mapa"])."</NOME>\n";
			$xml .= " <DESCRICAO>".xmlTexto_prepara($row["desc_mapa"])."</DESCRICAO>\n";
			$xml .= " <IMAGEM>".xmlTexto_prepara($row["imagem_mapa"])."</IMAGEM>\n";
			$xml .= " <TEMAS>".$row["temas_mapa"]."</TEMAS>\n";
			$xml .= " <LIGADOS>".$row["ligados_mapa"]."</LIGADOS>\n";
			$xml .= " <EXTENSAO>".$row["ext_mapa"]."</EXTENSAO>\n";
			$xml .= " <OUTROS>".xmlTexto_prepara($row["outros_mapa"])."</OUTROS>\n";
			$xml .= " <LINKDIRETO>".xmlTexto_prepara($row["linkdireto_mapa"])."</LINKDIRETO>\n";
			$xml .= " <PUBLICADO>".$row["publicado_mapa"]."</PUBLICADO>\n";
			if($row["mapfile"] != ""){
				$xml .= " <CONTEMMAPFILE>sim</CONTEMMAPFILE>\n";
			}
			else{
				$xml .= " <CONTEMMAPFILE>nao</CONTEMMAPFILE>\n";
			}
			$xml .= "</MAPA>\n";
		}
	}
	$xml .= "</MAPAS>\n";
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
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
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
			$xml .= "<TLINK>".xmlTexto_prepara($row["link_tema"])."</TLINK>\n";
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
function geraXmlAtlas_pegapranchas($xml,$id_atlas,$dbh)
{
	global $esquemaadmin;
	$q = "select * from ".$esquemaadmin."i3geoadmin_atlasp as p where p.id_atlas = $id_atlas order by ordem_prancha";
	$qpranchas = $dbh->query($q);
	foreach($qpranchas as $row)
	{
		$xml .= "  <PRANCHA>\n";
		$xml .= "   <ID>".$row["id_prancha"]."</ID>\n";
		$xml .= "   <TITULO>".xmlTexto_prepara($row["titulo_prancha"])."</TITULO>\n";
		$xml .= "   <DESCRICAO>".xmlTexto_prepara($row["desc_prancha"])."</DESCRICAO>\n";
		$xml .= "   <ICONE>".$row["icone_prancha"]."</ICONE>\n";
		$xml .= "   <LINKMAISINFO>".xmlTexto_prepara($row["link_prancha"])."</LINKMAISINFO>\n";
		$xml .= "   <WABERTURA>".$row["w_prancha"]."</WABERTURA>\n";
		$xml .= "   <HABERTURA>".$row["h_prancha"]."</HABERTURA>\n";
		$xml .= "   <MAPEXT>".$row["mapext_prancha"]."</MAPEXT>\n";
		$xml .= "   <TEMAS>\n";
		$xml = geraXmlAtlas_pegatemas($xml,$row["id_prancha"],$dbh);
		$xml .= "   </TEMAS>\n";
		$xml .= "  </PRANCHA>\n";
	}
	return $xml;
}
function geraXmlAtlas_pegatemas($xml,$id_prancha,$dbh)
{
	global $esquemaadmin;
	$q = "select t.codigo_tema,t.ligado_tema from ".$esquemaadmin."i3geoadmin_atlast as t where t.id_prancha = '$id_prancha' order by ordem_tema";
	//echo $q;
	$qtemas = $dbh->query($q);
	foreach($qtemas as $row)
	{
		$xml .= "<TEMA>\n";
		$xml .= "<CODIGO>".$row["codigo_tema"]."</CODIGO>\n";
		$xml .= "<LIGADO>".$row["ligado_tema"]."</LIGADO>\n";
		$xml .= "</TEMA>\n";
	}
	return $xml;
}
function geraXmlSistemas_pegafuncoes($perfil,$xml,$id_sistema,$dbh)
{
	global $esquemaadmin;
	$q = "select * from ".$esquemaadmin."i3geoadmin_sistemasf where id_sistema = '$id_sistema'";
	$qtemas = $dbh->query($q);
	foreach($qtemas as $row)
	{
		if($row["perfil_funcao"] == "")
		$mostra = true;
		else
		{
			$perfilF = explode(" ",str_replace(","," ",$row["perfil_funcao"]));
			$mostra = array_in_array($perfil,$perfilF);
		}
		if($mostra)
		{
			$xml .= "<FUNCAO>\n";
			$xml .= " <NOMEFUNCAO>".xmlTexto_prepara($row["nome_funcao"])."</NOMEFUNCAO>\n";
			$xml .= " <ABRIR>".xmlTexto_prepara($row["abrir_funcao"])."</ABRIR>\n";
			$xml .= " <JANELAW>".$row["w_funcao"]."</JANELAW>\n";
			$xml .= " <JANELAH>".$row["h_funcao"]."</JANELAH>\n";
			$xml .= " <PERFIL>".$row["perfil_funcao"]."</PERFIL>\n";
			$xml .= "</FUNCAO>\n";
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

?>
