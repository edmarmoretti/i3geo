<?php
function geraXmlSistemas($perfil,$locaplic,$editores)
{
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
	$q = "select * from i3geoadmin_sistemas";
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
			geraXmlSistemas_pegafuncoes($perfil,&$xml,$row["id_sistema"],$dbh);
			$xml .= "</SISTEMA>\n";
		}
	}
	$xml .= "</SISTEMAS>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;	
}
function geraRSStemas($locaplic,$id_n2)
{
	$sql = "select t.nome_tema as nome_ws,'' as desc_ws,'php/parsemapfile.php?id='||t.codigo_tema as link_ws,t.link_tema as autor_ws from i3geoadmin_n3 as n3,i3geoadmin_temas as t where t.id_tema = n3.id_tema and n3.id_n2 = '$id_n2' and n3.n3_perfil = '' order by nome_ws"; 
	return geraXmlRSS($locaplic,$sql,"Lista de temas");
}
function geraRSSsubgrupos($locaplic,$id_n1)
{
	$sql = "select g.nome_subgrupo as nome_ws,'' as desc_ws,'rsstemas.php?id='||n2.id_n2 as link_ws,'' as autor_ws from i3geoadmin_n2 as n2,i3geoadmin_subgrupos as g where g.id_subgrupo = n2.id_subgrupo and n2.id_n1 = '$id_n1' and n2.n2_perfil = '' order by nome_ws"; 
	return geraXmlRSS($locaplic,$sql,"Lista de sub-grupos");
}

function geraRSSgrupos($locaplic)
{
	//$sql = "select g.nome_grupo as nome_ws,'' as desc_ws,'rsssubgrupos.php?id='||n1.id_n1 as link_ws,'' as autor_ws from i3geoadmin_n1 as n1,i3geoadmin_grupos as g where g.id_grupo = n1.id_grupo and n1.n1_perfil = '' order by nome_ws"; 
	$sql = "select g.nome_grupo as nome_ws,'' as desc_ws,'rsssubgrupos.php?id='||n1.id_n1 as link_ws,'' as autor_ws "; 
	$sql .= "from i3geoadmin_n1 as n1,i3geoadmin_grupos as g, i3geoadmin_n2 as n2, i3geoadmin_n3 as n3 ";
	$sql .= "where g.id_grupo = n1.id_grupo and n2.id_n1 = n1.id_n1 and n3.id_n2 = n2.id_n2 and n1.n1_perfil = '' group by nome_ws,desc_ws,link_ws,autor_ws order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Lista de grupos");
}

function geraXmlDownload($locaplic)
{
	$sql = "select * from i3geoadmin_ws where tipo_ws = 'DOWNLOAD' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Enderecos para download");
}
function geraXmlWS($locaplic)
{
	$sql = "select * from i3geoadmin_ws where tipo_ws = 'WS' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Web services");
}
function geraXmlWMS($locaplic)
{
	$sql = "select * from i3geoadmin_ws where tipo_ws = 'WMS' and nome_ws <> '' order by nome_ws";
	return geraXmlRSS($locaplic,$sql,"Web services WMS-OGC");
}
function geraXmlGeorss($locaplic)
{
	$sql = "select * from i3geoadmin_ws where tipo_ws = 'GEORSS' and nome_ws <> ''";
	return geraXmlRSS($locaplic,$sql,"Georss");
}
function geraXmlRSS($locaplic,$sql,$descricao)
{
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
		$xml .= "<description>".entity_decode($row["desc_ws"])."</description>\n";
		$xml .= "<link>".xmlTexto_prepara($row["link_ws"])."</link>\n";
		$xml .= "<pubDate/>\n";
		$xml .= "<author>".xmlTexto_prepara($row["autor_ws"])."</author>\n";
		$xml .= "<nacessos>".xmlTexto_prepara($row["nacessos"])."</nacessos>\n";
		$xml .= "<nacessosok>".xmlTexto_prepara($row["nacessosok"])."</nacessosok>\n";
		$xml .= "<id>".xmlTexto_prepara($row["id_ws"])."</id>\n";
		$xml .= "</item>\n";
	}
	$xml .= "</channel></rss>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
function geraXmlAtlas($locaplic,$editores)
{
	error_reporting(0);
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	if($convUTF)
	$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
	else
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$xml .= "\n<RAIZ>\n";
	
	//$q = "select * from i3geoadmin_atlas";
	$qatlas = $dbh->query("select * from i3geoadmin_atlas");
	
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
			geraXmlAtlas_pegapranchas(&$xml,$row["id_atlas"],$dbh);
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
	$q = "select * from i3geoadmin_identifica ";
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
		}
	}
	$xml .= "</SISTEMAS>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;	
}
function geraXmlMapas($perfil,$locaplic,$editores)
{
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
	$q = "select * from i3geoadmin_mapas";
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
			$xml .= "</MAPA>\n";
		}
	}
	$xml .= "</MAPAS>\n";
	$dbh = null;
	$dbhw = null;
	return $xml;
}
//
//$id_menu = id do menu que será montado
//$perfil = perfis separados por espaços
//$tipo = gruposeraiz|subgrupos|temas
//$dbh objeto com a conexão com o banco
//$locaplic = localização do i3geo no servidor
//
function geraXmlMenutemas($perfil,$id_menu,$tipo,$locaplic)
{
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
	$q = "select nacessos,nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,r.perfil as perfil from i3geoadmin_raiz as r,i3geoadmin_temas as temas where r.id_nivel = 0 and r.id_tema = temas.id_tema and r.id_menu = $id_menu ";
	$qtemasraiz = $dbh->query($q);
	geraXmlMenutemas_notema($qtemasraiz,&$xml,$perfil);
	$q = "select nome_grupo,desc_grupo,n1.id_grupo,n1.id_n1,n1.n1_perfil as perfil from i3geoadmin_n1 as n1,i3geoadmin_grupos as grupos where n1.id_menu = $id_menu and n1.id_grupo = grupos.id_grupo ";
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
			$q = "select nacessos,nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,r.perfil as perfil from i3geoadmin_raiz as r,i3geoadmin_temas as temas where r.nivel = 1 and r.id_nivel = ".$row["id_n1"]." and r.id_tema = temas.id_tema and r.id_menu = $id_menu ";
			$qtemasraiz = $dbh->query($q);
			geraXmlMenutemas_notema($qtemasraiz,&$xml,$perfil);
			if(isset($tipo) && ($tipo == "subgrupos") || ($tipo == ""))
			geraXmlMenutemas_pegasubgrupos($row["id_n1"],&$xml,$dbh,$tipo,$perfil);
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
	$q = "select subgrupos.id_subgrupo,nome_subgrupo,id_n2,n2.n2_perfil as perfil from i3geoadmin_n2 as n2,i3geoadmin_subgrupos as subgrupos where n2.id_n1 = $id_n1 and n2.id_subgrupo = subgrupos.id_subgrupo ";
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
			geraXmlMenutemas_pegatemas($row["id_n2"],&$xml,$dbh,$perfil);
			$xml .= "</SGRUPO>\n";
		}
	}
}
function geraXmlMenutemas_pegatemas($id_n2,$xml,$dbh,$perfil)
{
	$q = "select nacessos,nome_tema,codigo_tema,desc_tema,link_tema,tipoa_tema,tags_tema,kml_tema,ogc_tema,download_tema,n3.n3_perfil as perfil from i3geoadmin_n3 as n3,i3geoadmin_temas as temas where n3.id_n2 = $id_n2 and n3.id_tema = temas.id_tema ";
	$qtemas = $dbh->query($q);
	geraXmlMenutemas_notema($qtemas,&$xml,$perfil);
}
function geraXmlMenutemas_notema($qtemas,$xml,$perfil)
{
	foreach($qtemas as $row)
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
			$xml .= "<OGC>nao</OGC>\n";
			else
			$xml .= "<OGC>".$row["ogc_tema"]."</OGC>\n";
			$xml .= "<DOWNLOAD>".$row["download_tema"]."</DOWNLOAD>\n";
			$xml .= "<NACESSOS>".$row["nacessos"]."</NACESSOS>\n";
			$xml .= "</TEMA>\n";
		}
	}
}
function geraXmlAtlas_pegapranchas($xml,$id_atlas,$dbh)
{
	$q = "select * from i3geoadmin_atlasp as p where p.id_atlas = $id_atlas ";
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
		geraXmlAtlas_pegatemas(&$xml,$row["id_prancha"],$dbh);
		$xml .= "   </TEMAS>\n";
		$xml .= "  </PRANCHA>\n";
	}	
}
function geraXmlAtlas_pegatemas($xml,$id_prancha,$dbh)
{
	$q = "select t.codigo_tema,t.ligado_tema from i3geoadmin_atlast as t where t.id_prancha = $id_prancha";
	//echo $q;
	$qtemas = $dbh->query($q);
	foreach($qtemas as $row)
	{
		$xml .= "<TEMA>\n";
		$xml .= "<CODIGO>".$row["codigo_tema"]."</CODIGO>\n";
		$xml .= "<LIGADO>".$row["ligado_tema"]."</LIGADO>\n";
		$xml .= "</TEMA>\n";
	}
}
function geraXmlSistemas_pegafuncoes($perfil,&$xml,$id_sistema,$dbh)
{
	$q = "select * from i3geoadmin_sistemasf where id_sistema = '$id_sistema'";
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
function verificaEditores($editores)
{
	$editor = "nao";
	foreach ($editores as $e)
	{
		$e = gethostbyname($e);
		$ip = "UNKNOWN";
		if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
		else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
		else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
		else $ip = "UNKNOWN";
		if ($e == $ip){$editor="sim";}
	}
	return $editor;
}
?>
