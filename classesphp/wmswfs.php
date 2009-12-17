<?php
/*
Title: wmswfs.php

Faz a leitura e o processamento de web services nos padrões OGC.
Atualmente, processa apenas serviços no padrão WMS.

Licenca:

GPL2


I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/wmswfs.php
*/
/*
Function: gravaCacheWMS

Lê o getcapabilities de um WMS e salva em disco se o mesmo não tiver sido salvo antes

O arquivo é gravado no diretório temporário

Parametros:

$servico - endereço do WMS

Return:

Nome do arquivo criado
*/
function gravaCacheWMS($servico)
{
	global $dir_tmp;
	//ini_set('auto_detect_line_endings', true);
	error_reporting(0);
	try{
		$teste = explode("=",$servico);
		if ( count($teste) > 1 ){$servico = $servico."&";}
		else
		{
			$teste = explode("?",$servico);
			if ( count($teste) == 1 ){$servico = $servico."?";}
		}
		$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.1.1";
		$nome = $dir_tmp."/wms".md5($servico).".xml";
		if(!file_exists($nome))
		{
			$wms_capabilities = file($wms_service_request);
			if( !$wms_capabilities )
			{return "erro";}
			else
			{
				$fp = fopen($nome, 'w');
				fwrite($fp, implode("",$wms_capabilities));
				fclose($fp);	
			}
		}
		return $nome;
	}
	catch(Exception $e){return "erro";}
}
/*
function: existeTemaWFS

Verifica se existe um tema em um servico WFS processando o getcapabilities.

parameters:
$wfs - endereço do serviço

$tema - tema que será verificado
*/
function existeTemaWFS()
{
	global $wfs,$tema;
	$capabilities = implode("",$wfs);
	$dom = new DomDocument();
	$dom->loadXML($capabilities);
	$xpath = new DOMXPath($dom);
	$query = '//WFS_Capabilities/FeatureTypeList/FeatureType';
	$entries = $xpath->query($query);
	foreach($entries as $e)
	{
		$e->getElementsByTagName("Name");
		$n = $e->nodeValue;
		if ($n == $tema)
		{return "sim";}
	}
	return "nao";
}
/*
function: existeWFS

Verifica se existe um servico WFS invocando o getcapabilities.

parameters:
$servico - endereço do serviço
*/
function existeWFS()
{
	global $servico;
	$teste = explode("=",$servico);
	if ( count($teste) > 1 ){$servico = $servico."&";}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WFS";
	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	if( !($wfs_capabilities = file($wms_service_request)) ) {
		# Cannot download the capabilities file.
		return "nao";
	}
	else
	{return $wfs_capabilities;}
}
/*
function: getcapabilities

Chama a função getcapabilities e retorna o resultado.

parameters:
$servico - Endereço do web service.

$id_ws - id do wms se estiver sendo utilizado o banco de administração do i3geo
*/
function getcapabilities()
{
	global $servico,$id_ws;
	$teste = explode("=",$servico);
	if ( count($teste) > 1 ){$servico = $servico."&";}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WMS&version=1.1.0";
	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	if( !($wms_capabilities = file($wms_service_request)) ) {
		# Cannot download the capabilities file.
		$cp->set_data("Erro de acesso");
		return;
	}
	$wms_capabilities = implode("",$wms_capabilities);
	return(xml2html($wms_capabilities));
}
/*
function: getcapabilities2

Chama a função getcapabilities e retorna o resultado formatado (WMS).

parameters:
$servico - Endereço do web service.

*/
function getcapabilities2()
{
	global $servico;
	$teste = explode("=",$servico);
	if ( count($teste) > 1 ){$servico = $servico."&";}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WMS&version=1.1.0";
	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	if( !($wms_capabilities = file($wms_service_request)) ) {
		# Cannot download the capabilities file.
		$cp->set_data("Erro de acesso");
		return;
	}
	$wms_capabilities = implode("",$wms_capabilities);
	$dom = new DomDocument();
	$dom->loadXML($wms_capabilities);
	$xpath = new DOMXPath($dom);
	$retorno = "";
	$query = '//WMT_MS_Capabilities/Service/Name';
	$entries = $xpath->query($query);
	$temp = "";
	foreach ($entries as $entry){$temp .= $entry->nodeValue;}
	$retorno .= "<b>Nome: </b>".$temp;

	$query = '//WMT_MS_Capabilities/Service/Title';
	$entries = $xpath->query($query);
	$temp = "";
	foreach ($entries as $entry){$temp .= $entry->nodeValue;}
	$retorno .= "<br><br><b>T&iacute;tulo: </b>".$temp;

	$query = '//WMT_MS_Capabilities/Service/Abstract';
	$entries = $xpath->query($query);
	$temp = "";
	foreach ($entries as $entry){$temp .= $entry->nodeValue;}
	$retorno .= "<br><br><b>Resumo: </b>".$temp;

	$query = '//WMT_MS_Capabilities/Service/KeywordList';
	$entries = $xpath->query($query);
	$temp = "";
	foreach ($entries as $entry){$temp .= $entry->nodeValue.".";}
	$retorno .= "<br><br><b>Palavras-chave: </b>".$temp;

	$query = '//WMT_MS_Capabilities/Service/ContactInformation';
	$entries = $xpath->query($query);
	$temp = "";
	foreach ($entries as $entry){$temp .= $entry->nodeValue.".";}
	$retorno .= "<br><br><b>Contato: </b>".$temp;

	return($retorno);
}
/*
function: getcapabilities3

Chama a função getcapabilities e retorna o resultado formatado (WFS).

parameters:

$servico - Endereço do web service.

*/
function getcapabilities3()
{
	global $servico;
	$teste = explode("=",$servico);
	if ( count($teste) > 1 ){$servico = $servico."&";}
	$wms_service_request = $servico . "request=getcapabilities&service=wfs&version=1.0.0";
	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	if( !($wms_capabilities = file($wms_service_request)) ) {
		# Cannot download the capabilities file.
		$cp->set_data("Erro de acesso");
		return;
	}
	$wms_capabilities = implode("",$wms_capabilities);
	$dom = new DomDocument();
	$dom->loadXML($wms_capabilities);
	$retorno = "";
	$services = $dom->getElementsByTagName("Service");
	foreach ($services as $service)
	{
		$vs = $service->getElementsByTagName("Name");
		$temp = "";
		foreach ($vs as $v)
		{$temp .= $v->nodeValue;}
		$retorno .= "<b>Nome: </b>".$temp;
		$vs = $service->getElementsByTagName("Title");
		$temp = "";
		foreach ($vs as $v)
		{$temp .= $v->nodeValue;}
		$retorno .= "<br><br><b>T&iacute;tulo: </b>".$temp;
	}
	return($retorno);
}
/*
function: temaswms

Lista os temas de um web service WMS.

parameters:

$servico - Endereço do web service.

*/
function temaswms()
{
	global $servico,$id_ws;
	$wms_service_request = gravaCacheWMS($servico);
	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	//$wms_service_request = "c://temp//teste.xml";
	include_once("../admin/php/admin.php");
	include_once("../admin/php/webservices.php");
	if($wms_service_request == "erro") {
		# Cannot download the capabilities file.
		//registra a tentativa de acesso
		if(isset($id_ws))
		{
			adicionaAcesso($id_ws,false);
		}
		$cp->set_data("Erro de acesso");
		return;
	}
	elseif(isset($id_ws))
	{
		if($id_ws != "")
		adicionaAcesso($id_ws,true);
	}
	
	$handle = fopen ($wms_service_request, "r");
	$wms_capabilities = fread($handle, filesize($wms_service_request));
	fclose ($handle); 
	
	$dom = new DomDocument();
	$dom->loadXML($wms_capabilities);
	$layers = wms_layers($dom);
	$xpath = new DOMXPath($dom);
	//verifica sld
	$query = '//WMT_MS_Capabilities/Capability/UserDefinedSymbolization';
	$entries = $xpath->query($query);
	foreach($entries as $e)
	{$n = $e->getAttribute("SupportSLD");}
	$suporta = "nao";
	if ($n == 1){$suporta = "sim";}
	$xpath = new DOMXPath($dom);
	$q = '//WMT_MS_Capabilities/Capability';
	$query = $q.'/Layer';
	$layers = $xpath->query($query);
	$retorna = array();
	foreach ($layers as $layer)
	{
		$r = pegaTag($layer);
		$retorna = imprimeTag($r,$retorna);
		$layers1 = $xpath->query('Layer',$layer);
		foreach ($layers1 as $layer1)
		{
			$layers2 = $xpath->query('Layer',$layer1);
			$r1 = pegaTag($layer1);
			$camada1 = $r1["nome"];
			$titulocamada1 = $r1["titulo"];
			$retorna = imprimeTag($r1,$retorna);
			if($r1["estilos"])
			{$retorna = imprimeEstilos($r1["estilos"],$suporta,$retorna,$camada1,$titulocamada1);}
			else
			{
				if($layers2->length == 0)
				$retorna[] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"tema\",\"" . $camada1 . "\",\"\",\"default\",\"".$camada1." ".$titulocamada1."\",\"".$suporta."\")' value='" . $camada1 . "'/> default<i>".$titulocamada1."</i></span><br>";
			}
			foreach ($layers2 as $layer2)
			{
				$layers3 = $xpath->query('Layer',$layer2);
				$r2 = pegaTag($layer2);
				$camada2 = $r2["nome"];
				$titulocamada2 = $r2["titulo"];
				$retorna = imprimeTag($r2,$retorna);
				if($r2["estilos"])
				{$retorna = imprimeEstilos($r2["estilos"],$suporta,$retorna,$camada2,$titulocamada2);}
				else
				{
					if($layers3->length == 0)
					$retorna[] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"tema\",\"" . $camada2 . "\",\"\",\"default\",\"".$camada2." ".$titulocamada2."\",\"".$suporta."\")' value='" . $camada2 . "'/> default <i>".$titulocamada2."</i></span><br>";
				}
				foreach ($layers3 as $layer3)
				{
					$r3 = pegaTag($layer3);
					$camada3 = $r3["nome"];
					$titulocamada3 = $r3["titulo"];
					$retorna = imprimeTag($r3,$retorna);
					if($r3["estilos"])
					{$retorna = imprimeEstilos($r3["estilos"],$suporta,$retorna,$camada3,$titulocamada3);}
					else
					{
						$retorna[] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"tema\",\"" . $camada3 . "\",\"\",\"default\",\"".$camada3." ".$titulocamada3."\",\"".$suporta."\")' value='" . $camada3 . "'/> default <i>".$titulocamada3."</i></span><br>";
					}
				}
			}
			if(count($layers2) == 1){$retorna[] = "<hr>";}
		}
	}	
	$retorna[] = "<br>Proj.:<input size=30 id=proj type=text class=digitar value='".implode(",",wms_srs($dom))."'/><br>";
	$retorna[] = "<br>Formatos imagem:<input size=30 id=formatos type=text class=digitar value='".implode(",",wms_formats($dom))."'/><br><br>";
	$retorna[] = "<br>Formatos info:<input size=30 id=formatosinfo type=text class=digitar value='".implode(",",wms_formatsinfo($dom))."'/><br><br>";
	$retorna[] = "<br>Versao:<input size=30 id=versao type=text class=digitar value='".(wms_version($dom))."'/><br><br>";
	$retorna[] = "<br>Suporta SLD:<input size=30 id=suportasld type=text class=digitar value='".$suporta."'/><br><br><br>";
	return(implode($retorna));
}
/*
function: listaLayersWMS

Lista os temas de um web service WMS e retorna o resultado como um array.

parameters:

$servico - Endereço do web service.

$nivel - nível do layer na hierarquia existente no getcapabilities (string do tipo

$nomelayer - nome do layer que contém os próximos layers
*/
function listaLayersWMS()
{
	global $servico,$nivel,$id_ws,$nomelayer;
	if(!isset($nomelayer)){$nomelayer = "undefined";}
	$wms_service_request = gravaCacheWMS($servico);
	include_once("../admin/php/admin.php");
	include_once("../admin/php/webservices.php");
	error_reporting(0);
	
	if($nivel < 2){
		if($wms_service_request == "erro") {
			//registra a tentativa de acesso
			if(isset($id_ws))
			{
				adicionaAcesso($id_ws,false);
			}
			$cp->set_data("Erro de acesso");
			return;
		}
		elseif(isset($id_ws))
		{
			adicionaAcesso($id_ws,true);
		}	
	}
	$handle = fopen ($wms_service_request, "r");
	$wms_capabilities = fread ($handle, filesize ($wms_service_request));
	fclose ($handle); 
	$dom = new DomDocument();
	$dom->loadXML($wms_capabilities);
	$xpath = new DOMXPath($dom);
	$q = '//WMT_MS_Capabilities/Capability';
	$res = array();
	
	if($nomelayer != "undefined")
	{
		for($i=0; $i < $nivel-1 ; ++$i)
		$q .= "/Layer";
		$layersanteriores = $xpath->query($q);
		foreach ($layersanteriores as $layeranterior)
		{
			$r1 = pegaTag($layeranterior);
			if($r1["nome"] == $nomelayer || $r1["titulo"] == $nomelayer)
			{
				$layers = $xpath->query('Layer',$layeranterior);
				foreach ($layers as $layer)
				{
					$r = pegaTag($layer);
					if(!$r["nome"]){$r["nome"] = $r["titulo"];}
					$res[] = array("nome"=>$r["nome"],"titulo"=>$r["titulo"],"estilos"=>$r["estilos"],"srs"=>wms_srs($dom),"formats"=>wms_formats($dom),"version"=>wms_version($dom),"formatsinfo"=>wms_formatsinfo($dom));
				}
				if($layers->length == 0)
				{
					$res[] = array("nome"=>$r1["nome"],"titulo"=>$r1["titulo"],"estilos"=>(array(array("nome"=>"default","titulo"=>"default"))),"srs"=>wms_srs($dom),"formats"=>wms_formats($dom),"version"=>wms_version($dom),"formatsinfo"=>wms_formatsinfo($dom));
				}
			}
		}
	}
	else
	{
		//
		//pega os layers no primeiro nível
		//
		$q .= "/Layer";
		$layers = $xpath->query($q);	
		$res = array();
		foreach ($layers as $layer)
		{
			$r = pegaTag($layer);
			//echo $r["nome"]."\n";
			if(!$r["nome"]){$r["nome"] = $r["titulo"];}
			if(array_search("Style",$r["tags"]) || array_search("Layer",$r["tags"]))
			{$res[] = array("nome"=>$r["nome"],"titulo"=>$r["titulo"],"estilos"=>$r["estilos"],"srs"=>wms_srs($dom),"formats"=>wms_formats($dom),"version"=>wms_version($dom),"formatsinfo"=>wms_formatsinfo($dom));}
		}
	}
	return($res);
}

function imprimeEstilos($es,$suporta,$retorna,$tval,$tituloalternativo)
{
	foreach($es as $e)
	{
		//$tval = $e["titulo"];
		$nomeestilo = $e["nome"];
		$nomecamada = $e["titulo"];
		//if($nomecamada == "default" || $nomecamada == "")
		//{$nomecamada = $tituloalternativo;}
		$tituloestilo = $e["titulo"];
		$retorna[] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"estilo\",\"" . $tval . "\",\"\",\"" . $nomeestilo . "\",\"".$tituloalternativo." ".$nomecamada." ".$tituloestilo."\",\"".$suporta."\")' value='" . $nomeestilo . "'/><span style=color:blue >" . $nomeestilo." <i>".$tituloestilo."</i></span><br>";	
	}
	return $retorna;
}
function imprimeTag($r,$retorna)
{
	if(!$r["nome"])
	{$retorna[] =  "<br><span style='color:brown;font-size:14pt' ><b>".$r["titulo"]."</b></span><br>";}
	else
	{
		$retorna[] =  "<hr>";
		$retorna[] =  "<br><span style='color:brown;font-size:12pt' ><b>".$r["nome"]."</b></span><br>";
		$retorna[] =  "<br><span style='color:black;font-size:12pt' ><b>".$r["titulo"]."</b></span><br>";
		$retorna[] =  "<br><span style='color:gray;font-size:9pt' >".$r["resumo"]."</span><br>";
	}
	return $retorna;
}
function pegaTag($layer)
{
	$noslayer = $layer->childNodes;
	$resultado = array();
	for ($i = 0; $i < $noslayer->length; ++$i)
	{
		$tnome = $noslayer->item($i)->tagName;
		$tvalor = $noslayer->item($i)->nodeValue;
		if($tnome)
		{
			if ($tnome == "Title")
			{$resultado["titulo"] = $tvalor;}
			if ($tnome == "Name")
			{$resultado["nome"] = $tvalor;}
			if ($tnome == "Abstract")
			{$resultado["resumo"] = $tvalor;}
			if ($tnome == "Style")
			{
				$ss = $noslayer->item($i)->childNodes;
				$ssl = $ss->length;
				for ($s = 0; $s < $ssl; $s++)
				{
					$snome = $ss->item($s)->tagName;
					$svalor = $ss->item($s)->nodeValue;
					if($snome)
					{
						if ($snome == "Title")
						{$t=$svalor;}
						if ($snome == "Name")
						{$n=$svalor;}
					}
				}
				$resultado["estilos"][] = array("nome"=>$n,"titulo"=>$t);
			}
			$resultado["tags"][] = $tnome;
		}
	}
	return $resultado;
}


/*
function: temaswfs

Lista os temas de um web service WFS.

parameters:
$servico - Endereço do web service.

$cp - Objeto CPAINT.
*/
function temaswfs()
{
	global $servico,$cp;
	$teste = explode("=",$servico);
	if ( count($teste) > 1 ){$servico = $servico."&";}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WFS";
	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	if( !($wms_capabilities = file($wms_service_request)) ) {
		# Cannot download the capabilities file.
		$cp->set_data("Erro de acesso");
		return;
	}
	$wms_capabilities = implode("",$wms_capabilities);
	$dom = new DomDocument();
	$dom->loadXML($wms_capabilities);
	$services = $dom->getElementsByTagName("Service");
	foreach ($services as $service)
	{
		$vs = $service->getElementsByTagName("Name");
		$serv = "";
		foreach ($vs as $v)
		{$serv .= $v->nodeValue;}
	}	
	$layers = $dom->getElementsByTagName("FeatureType");
	foreach ($layers as $layer)
	{
		$vs = $layer->getElementsByTagName("Title");
		$temp1 = "";
		foreach ($vs as $v)
		{$temp1 .= $v->nodeValue;}
		
		$vs = $layer->getElementsByTagName("Abstract");
		$temp2 = "";
		foreach ($vs as $v)
		{$temp2 .= $v->nodeValue;}
		
		$vs = $layer->getElementsByTagName("SRS");
		$temp3 = array();
		foreach ($vs as $v)
		{$temp3[] = $v->nodeValue;}
		$temp3 = implode("#",$temp3);

		$vs = $layer->getElementsByTagName("Name");
		$temp = "";
		foreach ($vs as $v)
		{$temp .= $v->nodeValue;}
		$temp = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"" . $temp . "\",\"" .$temp1. "\",\"" . $temp3 . "\",\"" . $serv ."\")' /><span style=color:red >" . $temp . "</span><br>";		
		$retorno .= "<br>".$temp.$temp1."<br>".$temp2."<hr>";
	}
	$cp->set_data($retorno);
}
/*
function: xml2html

Converte caracteres XML em HTML.

parameters:

$str - Xml.
*/
function xml2html ( $str )
{
	$str = ereg_replace("&","&amp;",$str);
	$str = ereg_replace("<","&lt;",$str);
	$str = ereg_replace(">","&gt;<BR>",$str);
	return $str;
}
/*
function: wms_descricao

Retorna a descrição de um serviço (nó).
*/
function wms_descricao ( $dom,$xp )
{
	$xpath = new DOMXPath($dom);
	$query = $xp;
	$entries = $xpath->query($query);
	$n = "";
	foreach ($entries as $entry)
	{
		$n = $entry->nodeValue;
	}
	return $n;
}
/*
function: wms_descricaov

Retorna a descrição de um serviço (atributo).
*/
function wms_descricaov ( $dom,$xp,$attrib )
{
	$xpath = new DOMXPath($dom);
	$query = $xp;
	$entries = $xpath->query($query);
	$n = "";
	foreach ($entries as $entry)
	{
		$n = $entry->getAttribute($attrib);
	}
	return $n;
}
/*
function: wms_descricaon

Retorna a descrição de um serviço (filho de um nó).
*/
function wms_descricaon ( $dom,$xp,$n ) {
	$ctx = xpath_new_context($dom);
	$xpnode = xpath_eval($ctx,$xp);
	$dtnode = $xpnode->nodeset[$n]->first_child();
	return $dtnode->content;
}
/*
function: wms_title

Retorna o título de um WMS.
*/
function wms_title ( $dom ) {
	#
	# Read the WMS service title and return it as text.
	#
	$xpath = new DOMXPath($dom);
	$query = '//WMT_MS_Capabilities/Service/Title';
	$entries = $xpath->query($query);
	foreach ($entries as $entry){$nomeserv = $entry->nodeValue;}
	return $nomeserv;
}
/*
function: wms_onlineresource

Retorna o recurso on-line de um WMS.
*/
function wms_onlineresource ( $dom ) {
	#
	# Read the WMS online resource URL and return it as text.
	#
	$xp = "/WMT_MS_Capabilities/Service/OnlineResource";
	$ctx = xpath_new_context($dom);
	$xpnode = xpath_eval($ctx,$xp);
	return $xpnode->nodeset[0]->get_attribute("href");
}
/*
function: wms_formats

Retorna os formatos de imagem de um WMS.
*/
function wms_formats ( $dom )
{
	$xpath = new DOMXPath($dom);
	$query = '//WMT_MS_Capabilities/Capability/Request/GetMap/Format';
	$entries = $xpath->query($query);
	$arr = array();
	foreach ($entries as $entry)
	{
		$arr[] = $entry->nodeValue;
	}
	return $arr;
}
/*
function: wms_formatsinfo

Retorna os formatos existentes de retorno da opção getfeatureinfo.
*/
function wms_formatsinfo ( $dom )
{
	$xpath = new DOMXPath($dom);
	$query = '//WMT_MS_Capabilities/Capability/Request/GetFeatureInfo/Format';
	$entries = $xpath->query($query);
	$arr = array();
	foreach ($entries as $entry)
	{
		$arr[] = $entry->nodeValue;
	}
	return $arr;
}
/*
function: wms_estilos

Retorna os estilos de um WMS.
*/
function wms_estilos ( $dom ) {
	#
	# Read the WMS image formats and return them as an array.
	#
	//$xp = "/Style";
	//$ctx = xpath_new_context($dom);
	//$xpnode = xpath_eval($ctx,$xp);
	//return $xpnode->nodeset;
	$return = $dom->getElementsByTagName("Style");

}
/*
function: wms_exceptions

Retorna as exceptions de um WMS.
*/
function wms_exceptions ( $dom ) {
	#
	# Read the WMS exception formats and return them as an array.
	#
	$xp = "/WMT_MS_Capabilities/Capability/Exception/Format";
	$ctx = xpath_new_context($dom);
	$xpnode = xpath_eval($ctx,$xp);
	$arr = array();
	for( $i = 0; $i < sizeof($xpnode->nodeset); ++$i ) {
		$dtnode = $xpnode->nodeset[0]->first_child();
		array_push($arr,$dtnode->content);
	}
	return $arr;
}
/*
function: wms_version

Retorna a versao.
*/
function wms_version ( $dom )
{
	$n = $dom->getElementsByTagName('WMT_MS_Capabilities');
	$params = $dom->getElementsByTagName('*');

	foreach ($params as $param) {
		$v = $param -> getAttribute('version');
		break;
	}
	return $v;
}
/*
function: wms_layers

Retorna os layers de um WMS.
*/
function wms_layers ( $dom ) {
	#
	# Read the WMS first level layers and return an
	# array of nodes.
	#
	$xpath = new DOMXPath($dom);
	$query = '//WMT_MS_Capabilities/Capability/Layer/Layer/Layer';
	$entries = $xpath->query($query);
	if ($entries->length == 0)
	{
		$query = '//WMT_MS_Capabilities/Capability/Layer';
		$entries = $xpath->query($query);		
	}
	else
	{
		$query = '//WMT_MS_Capabilities/Capability/Layer/Layer';
		$entries = $xpath->query($query);		
	}
	return $entries;
}
/*
function: wms_xpnode2content

Read the content child node of an element tag node WMS.
*/
function wms_xpnode2content( $xp_node ) {
	#
	# Read the content child node of an element tag
	# node.
	#
	$content = "";
	if( $xp_node->nodeset[0] ) {
		$node = $xp_node->nodeset[0]->first_child();
		$content = $node->content;
	}
	return $content;
}
/*
function: wms_srs

Retorna os SRSs WMS.
*/
function wms_srs( $dom )
{
	$xpath = new DOMXPath($dom);
	$query = '//WMT_MS_Capabilities/Capability/Layer/SRS';
	$entries = $xpath->query($query);
	$srs = "";
	//utiliza apenas os epsg do Brasil
	$single = array();
	foreach ($entries as $entry)
	{
		$arr[] = $entry->nodeValue;
		if ($entry->nodeValue == "EPSG:4326")
		{$single[] = "EPSG:4326";}
		if ($entry->nodeValue == "EPSG:4291")
		{$single[] = "EPSG:4291";}
	}
	if (count($single) > 0)
	{$arr = $single;}
	return $arr;
}
/*
function: wms_bbox

Retorna o BBOX de um WMS.
*/
function wms_bbox( $dom )
{
	$xpath = new DOMXPath($dom);
	$query = '//WMT_MS_Capabilities/Capability/Layer/LatLonBoundingBox';
	$entries = $xpath->query($query);
	foreach ($entries as $entry){$bbox = $entry->nodeValue;}
	if ($bbox == '-1,-1,-1,-1')
	{return '-180,-90,180,90';}
	else
	{return wms_bbox2txt($bbox);}
}
/*
function: wms_bbox2txt

Convert a BoundingBox node into a text string de um wms.
*/
function wms_bbox2txt( $node ) {
	#
	# Convert a BoundingBox node into a text string.
	#
	if( $node ) {
		$txt .= 1 * $node->get_attribute("minx");
		$txt .= ",";
		$txt .= 1 * $node->get_attribute("miny");
		$txt .= ",";
		$txt .= 1 * $node->get_attribute("maxx");
		$txt .= ",";
		$txt .= 1 * $node->get_attribute("maxy");
	}
	else {
		$txt = "-180,-90,180,90";
	}
	return $txt;
}
/*
function: wms_layer2html

Convert a Layer node into an HTML representation wms.
*/
function wms_layer2html( $node, $tipo , $layer ) {
	#
	# Convert a Layer node into an HTML representation.
	#
	$ctx = xpath_new_context($node);
	$xp_title  = xpath_eval($ctx,"/Title");
	$xp_name   = xpath_eval($ctx,"/Name");
	if (wms_xpnode2content($xp_name) == ""){$xp_name = xpath_eval($ctx,"/name");}
	$xp_srs    = xpath_eval($ctx,"/SRS");
	$xp_llbbox = xpath_eval($ctx,"/LatLonBoundingBox");
	$xp_bbox   = xpath_eval($ctx,"/BoundingBox");
	$txt_title = wms_xpnode2content($xp_title);
	$txt_name  = wms_xpnode2content($xp_name);
	$txt_srs   = strtoupper(wms_xpnode2content($xp_srs));
	$node_llbbox = $xp_llbbox->nodeset[0];
	$node_bbox   = $xp_bbox->nodeset[0];
	$queryable = 0;
	if ( $node->get_attribute("queryable") ) {
		$queryable = 1;
	}
	$opaque = 0;
	if ( $node->get_attribute("opaque") ) {
		$opaque = 1;
	}
	//legenda
	$xp_legenda   = xpath_eval($ctx,"/LegendURL/OnlineResource");
	$nodelegenda = $xp_legenda->nodeset[0];
	if($nodelegenda)
	{  $legenda = $nodelegenda->get_attribute("href");}

	$html  = "<INPUT TYPE='radio' NAME='checks' VALUE='$txt_name' onClick='toggle(event,\"$tipo\",\"$layer\",\"$legenda\",\"$txt_title\")'>";
	$html .= "&nbsp;&nbsp;";
	$html .= $txt_title . "\n";
	$html .= wms_hidden("bbox_$txt_name", wms_bbox2txt($node_bbox));
	$html .= wms_hidden("llbox_$txt_name", wms_bbox2txt($node_llbbox));
	$html .= wms_hidden("srs_$txt_name", $txt_srs);
	$html .= wms_hidden("query_$txt_name", $queryable );
	$html .= wms_hidden("opaque_$txt_name", $opaque );
	$html .= "<BR>";
	return $html;
}
/*
function: wms_layer3html

Convert a Layer node into an HTML representation sem radio.
*/
function wms_layer3html( $node ) {
	#
	# Convert a Layer node into an HTML representation sem radio.
	#
	$ctx = xpath_new_context($node);
	$xp_title  = xpath_eval($ctx,"/Title");
	$xp_abs  = xpath_eval($ctx,"/Abstract");
	$txt_title = wms_xpnode2content($xp_title);
	$txt_abs = wms_xpnode2content($xp_abs);
	$html .= "<b>".$txt_title . "</b><i style='color:gray'>" . "-" . $txt_abs . "</i>\n";
	$html .= "<BR>";
	return $html;
}
/*
function: wms_layer4html

Convert a Layer into an HTML WMS.
*/
function wms_layer4html( $layer ) {
	$estilos = wms_estilos($layer);
	if (count($estilos) > 0)
	{
		$ctxl = xpath_new_context($layer);
		$xp_namel   = xpath_eval($ctxl,"/Name");
		if (wms_xpnode2content($xp_namel) == ""){$xp_namel = xpath_eval($ctxl,"/name");}
		$txt_namel  = wms_xpnode2content($xp_namel);
		$html .= wms_layer3html($layer);
		foreach ($estilos as $estilo)
		{
			$html .= wms_layer2html($estilo,"estilo",$txt_namel);
		}
	}
	else
	{
		$html .= wms_layer2html($layer,"tema","");
	}
	return $html;
}
?>