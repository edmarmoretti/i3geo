<?php
/*
Title: wscliente.php

Executa requisições a Web Services convencionais ou nos padrões OGC.

Possibilita a leitura dos metadados dos serviços e também a execução das funções existentes.

É utilizado apenas pela aplicação wscliente e as requisições são feitas por meio de AJAX utilizando-se abiblioteca CPAINT.

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

i3geo/classesphp/wscliente.php

Parametros:

$funcao {string} - nome da função que será executada

$cp {CPAINT} - objeto CPAINT contendo os parâmetros da API CPAINT

As variáveis globais de cada função devem ser enviadas como prâmetros ao ser feita a requisição

Exemplo:

http://localhost/i3geo/classesphp/wscliente.php?funcao=listaRSSws&rss=http://localhost/i3geo/admin/xmlservicosws.php&g_sid=&cpaint_function=listaRSSws&cpaint_response_type=JSON
*/
include_once("pega_variaveis.php");
include_once("lews/wms_functions.php");
include_once("../pacotes/cpaint/cpaint2.inc.php");
include_once("carrega_ext.php");
include("../ms_configura.php");
$cp = new cpaint();
//
//busca o getcapabilities de um wms
//
if ($funcao == "getcapabilities")
{
	$cp->register('getcapabilities');
	$cp->start();
	$cp->return_data();
	exit;
}
/*
Function: getcapabilities

Retorna a resposta da função getcapabilities de um serviço WMS.

Globais:

$cp {CPAINT} - Objeto CPAINT.

$onlineresource {string} - Endereço do serviço.

$tipo {string} - Tipo do serviço WMS|WFS.

Retorno:

{JSON} - Objeto JSON com as marcações do XML resultante convertidas para HTML 
*/
function getcapabilities()
{
	global $cp,$onlineresource,$tipo;
	$teste = explode("=",$onlineresource);
	if ( count($teste) > 1 ){$onlineresource = $onlineresource."&";}
	# -------------------------------------------------------------
	# Test that there is a wms service defined before proceding.
	#
	if ( ! $onlineresource ) {
		# No WMS service provided.
		wms_fatal("No 'onlineresource' defined.");
	}

	$wms_service_request = $onlineresource . "REQUEST=GetCapabilities&SERVICE=".$tipo;

	# -------------------------------------------------------------
	# Test that the capabilites file has successfully downloaded.
	#
	if( !($wms_capabilities = file($wms_service_request)) ) {
		# Cannot download the capabilities file.
		wms_fatal("Não foi possível ler o retorno do serviço '$wms_service_request'.");
	}

	$wms_capabilities = implode("",$wms_capabilities);

	# -------------------------------------------------------------
	# Test that the capabilites file has successfully parsed.
	#
	$dom = new DomDocument();
	$dom->loadXML($wms_capabilities);
	$cp->set_data(xml2html($wms_capabilities));
}
//le funções de um WS
if ($funcao == "funcoesws")
{
	$cp->register('funcoesws');
	$cp->start();
	$cp->return_data();
	exit;
}
/*
Function: funcoesws

Lista as funções de um web service SOAP ou RPC.

Globais:

$servico {string} - Endereço do web service.

$cp {CPAINT} - Objeto CPAINT.

Retorno:

{JSON} - lista de funções e parâmetros de cada uma
*/
function funcoesws()
{
	global $servico,$cp;
	include_once('../pacotes/SOAP/nusoap.php');
	$service_request = $servico; // . "?wsdl";
	$service_r = file($service_request);
	$service_r = implode("",$service_r);
	$c = new Xsoapclient($servico."?wsdl","wsdl");
	$elementos = $c->getproxy();
	foreach ($elementos as $elemento)
	{
		if (is_array($elemento))
		{
			foreach ($elemento as $x)
			{
				if (is_array($x))
				{
					if ($x['name'])
					{
						$txt_name = $x['name'];
						$nomeFuncao[] = $txt_name;
					}
					if ($x['input'])
					{
						//echo "<p>Entrada:";
						$itens = array_keys($x['input']);
						foreach ($itens as $item)
						{
							if ($item == "parts")
							{
								$vs = array_keys($x['input'][$item]);
								foreach ($vs as $v)
								{
									$xx = explode(":",$x['input'][$item][$v]);
									$inputFuncao[$txt_name] .= "<br>".$v."<span style='text-align:left;color:gray'> tipo:".($xx[2])."</span>";
								}
							}
						}
					}
					if ($x['output'])
					{
						$itens = array_keys($x['output']);
						foreach ($itens as $item)
						{
							if ($item == "parts")
							{
								$vs = array_keys($x['output'][$item]);
								foreach ($vs as $v)
								{
									$xx = explode(":",$x['output'][$item][$v]);
									$outputFuncao[$txt_name] .= "<br>".$v."<span style='text-align:left;color:gray'> tipo:".($xx[2])."</span>";
								}
							}
						}
					}
					if ($x['documentation'])
					{$docFuncao[$txt_name] = "<br>".$x['documentation'];}

				}
			}
		}
	}
	if (count($nomeFuncao) > 0)
	{
		foreach ($nomeFuncao as $f)
		{
			$final[] = $f."#".$inputFuncao[$f]."#".$outputFuncao[$f]."#".$docFuncao[$f];
		}
		$retorna = implode("|",$final);
	}
	else
	{$retorna="Nenhuma função encontrada";}
	$cp->set_data($retorna);
}
//busca dados de um WS
if ($funcao == "dadosws")
{
	$cp->register('dadosWS');
	$cp->start();
	$cp->return_data();
	exit;
}
/*
Function: dadosWS

Faz a chamada de uma função de um WS para pegar os dados.

Globais:

$cp {CPAINT} - Objeto CPAINT.

$servico {string} - Endereço do web service.

$funcaows {string} - Nome da função do serviço.

$param {string} - Parâmetros da funcao.

Retorno:

{JSON} - resultado da chamada ao serviço
*/
function dadosWS()
{
	global $param,$cp,$servico,$funcaows;
	//ini_set("memory_limit","28M");
	include_once('../pacotes/SOAP/nusoap.php');
	include_once("../pacotes/SOAP/easy_parser.inc");
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	$retorna = "erro";
	$parametros = "";
	if (isset($param))
	{
		$parametros = array();
		$linhas = explode("|",$param);
		if (count($linhas) == 0){$linhas[] = $param;}
		foreach($linhas as $linha)
		{	
			$p = explode("*",$linha);
			if (($p[1] == "null") || ($p[1] == "")){$p[1] = null;}
			$parametros = array_merge(array($p[0]=>$p[1]),$parametros);
		}
	}
	$resultado = $soapclient->call($funcaows,$parametros);
	$xml = new easy_parser;
	$result = $xml->parser($resultado,false); // if source of document is not a file then use $result = $xml->parser($var_source,false)
	if (@$r = $xml->view_source())
	{$retorna = "<b>Resultado da chamada XML:</b><br><br>".$r;}
	else
	{
		if (@$p = $soapclient->getproxy())
		{
			$vv = $p->$funcaows($parametros);
			$retorna = "<br><b>Resultado da chamada com getproxy</b><br>";
			$retorna .= "<pre>";
			$retorna .= print_r($vv,true);
			$retorna .= "</pre>";
			$retorna .= "<b>Resultado da chamada normal</b><br>";
			$retorna .= "<pre><font color=red>";
			$retorna .= print_r($resultado,true);
		}
	}
	if (function_exists("mb_convert_encoding"))
	{$cp->set_data(mb_convert_encoding($retorna,"UTF-8","ISO-88591"));}
	else 
	{$cp->set_data($retorna);}
}
//le parâmetros de uma função de um WS
if ($funcao == "parfuncoesws")
{
	$cp->register('parFuncoesws');
	$cp->start();
	$cp->return_data();
	exit;
}
/*
Function: parFuncoesws

Retorna os campos de parâmetros de uma função de um WS.

Globais:

$cp {CPAINT} - Objeto CPAINT.

$servico {string} - Endereço do web service.

$funcaows {string} - Nome da função do serviço.

Retorno:

{JSON}
*/
function parFuncoesws()
{
	global $cp,$servico,$funcaows;
	$retorna = array();
	include_once('../pacotes/SOAP/nusoap.php');
	$service_request = $servico; // . "?wsdl";
	$service_r = file($service_request);
	$service_r = implode("",$service_r);
	$c = new Xsoapclient($servico."?wsdl","wsdl");
	$elementos = $c->getproxy();
	if ($elementos->wsdl->schemas)
	{
		$schemas = $elementos->wsdl->schemas;
		foreach($schemas[key($schemas)][0]->complexTypes[$funcaows."_ContainedType"]["elements"] as $elemento)
		{
			$retorna[] = $elemento["name"]."#";
		}
	}
	if (count($retorna) == 0)
	{
		foreach ($elementos as $elemento)
		{
			if (is_array($elemento))
			{
				foreach ($elemento as $x)
				{
					if (is_array($x))
					{
						if (($x['name']) && ($x['name'] == $funcaows))
						{
							foreach ($x as $xx)
							{
								if ($xx["message"] == $funcaows."Request")
								{
									$vs = array_keys($xx['parts']);
									foreach ($vs as $v)
									{
										$t = explode(":",$xx['parts'][$v]);
										$retorna[] = $v."#".$t[2];
									}									
								}
							}
						}
					}
				}
			}
		}
	}
	if (count($retorna) > 0)
	{$cp->set_data(implode("|",$retorna));}
	else
	{$cp->set_data("");}
	
}
//le links de RSS para ws
if ($funcao == "listaRSSws")
{
	$cp->register('listaRSSws');
	$cp->start();
	$cp->return_data();
	exit;
}
if ($funcao == "listaRSSws2")
{
	$cp->register('listaRSSws2');
	$cp->start();
	$cp->return_data();
	exit;
}
if ($funcao == "listaRSSwsARRAY")
{
	$cp->register('listaRSSwsARRAY');
	$cp->start();
	$cp->return_data();
	exit;
}
/*
listaRSSws2 (depreciado)

Pega os links de um RSS.

cp - Objeto CPAINT.

rss - Endereços dos RSS.

tipo - Tipo de recurso, permite a escolha do programa PHP que será usado GEORSS|WMS|WS|DOWNLOAD
*/
function listaRSSws2()
{
	global $cp,$rss,$locaplic,$tipo;
	if(!isset($tipo)){$tipo = "GEORSS";}
	include_once("$locaplic/classesphp/funcoes_gerais.php");
	include_once("$locaplic/admin/php/xml.php");
	include_once("$locaplic/ms_configura.php");
	$rsss = explode("|",$rss);
	if(count($rsss) == 0){$rsss = array(" ");}
	$erro = "Erro. Nao foi possivel ler o arquivo";
	foreach ($rsss as $r)
	{
		$endereco = $r;
		if($r == "" || $r == " ")
		{
			if($tipo == "GEORSS")
			{
				$canali = simplexml_load_string(geraXmlGeorss($locaplic));
				$endereco = "admin/xmlgeorss.php";
			}
			if($tipo == "WMS")
			{
				$canali = simplexml_load_string(geraXmlWMS($locaplic));
				$endereco = "admin/xmlservicoswms.php";
			}
			if($tipo == "WS")
			{
				$canali = simplexml_load_string(geraXmlWS($locaplic));
				$endereco = "admin/xmlservicosws.php";
			}
			if($tipo == "DOWNLOAD")
			{
				$canali = simplexml_load_string(geraXmlDownload($locaplic));
				$endereco = "admin/xmllinksdownload.php";
			}
		}
		else
		{$canali = simplexml_load_file($rss);}
		$linhas[] = "<a href='".$endereco."' target=blank ><img style='border:0px solid white' src='imagens/rss.gif' /></a>####";
		//var_dump($canali);
		foreach ($canali->channel->item as $item)
		{
			$linha[] = ixml($item,"title");
			$linha[] = ixml($item,"description");
			$linha[] = ixml($item,"link");
			$linha[] = ixml($item,"author");
			$linha[] = ixml($item,"ranking");
			$linha[] = ixml($item,"tempo");
			$linhas[] = implode("#",$linha);
			$linha = array();
		}
	}
	$retorna = implode("|",$linhas);
	$retorna = str_replace("\n","",$retorna);
	//$retorna = mb_convert_encoding($retorna,"UTF-8","ISO-88591");
	$cp->set_data($retorna);
}
/*
Function: listaRSSwsARRAY

Pega os links de um RSS e retorna o resultado como um array.

Globais:

$cp {CPAINT} - Objeto CPAINT.

$rss {string} - Endereços dos RSS.

$tipo {string} - Tipo de recurso, permite a escolha do programa PHP que será usado GEORSS|WMS|WS|DOWNLOAD

Retorno:

{JSON}
*/
function listaRSSwsARRAY()
{
	global $cp,$rss,$locaplic,$tipo;
	if(!isset($tipo)){$tipo = "GEORSS";}
	include_once("$locaplic/classesphp/funcoes_gerais.php");
	include_once("$locaplic/admin/php/xml.php");
	include_once("$locaplic/ms_configura.php");
	$rsss = explode("|",$rss);
	if(count($rsss) == 0){$rsss = array(" ");}
	$erro = "Erro. Nao foi possivel ler o arquivo";
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$urli3geo = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST']."/".basename($locaplic);
	foreach ($rsss as $r)
	{
		if($r == "" || $r == " ")
		{
			
			if($tipo == "GEORSS")
			{
				$canali = simplexml_load_string(geraXmlGeorss($locaplic));
				$linkrss = $urli3geo."/admin/xmlgeorss.php";
			}
			if($tipo == "KML")
			{
				$canali = simplexml_load_string(geraXmlKmlrss($locaplic));
				$linkrss = $urli3geo."/admin/xmlkmlrss.php";
			}
			if($tipo == "WMS")
			{
				$canali = simplexml_load_string(geraXmlWMS($locaplic));
				$linkrss = $urli3geo."/admin/xmlservicoswms.php";
			}
			if($tipo == "WS")
			{
				$canali = simplexml_load_string(geraXmlWS($locaplic));
				$linkrss = $urli3geo."/admin/xmlservicosws.php";
			}	
			if($tipo == "DOWNLOAD")
			{
				$canali = simplexml_load_string(geraXmlDownload($locaplic));
				$linkrss = $urli3geo."/admin/xmllinksdownload.php";
			}
		}
		else
		{$canali = simplexml_load_file($rss);}
		if($r != "")
		$linhas["rss"] = "<a href='".$r."' target=blank ><img style='border:0px solid white;' src='imagens/rss.gif' /></a>";
		else
		{
			$linhas["rss"] = "<a href='".$linkrss."' target=blank ><img style='border:0px solid white;' src='imagens/rss.gif' /></a>";			
		}
		//var_dump($canali);
		$canais = array();
		foreach ($canali->channel->item as $item)
		{
			$canais[] = array("id_ws"=>(ixml($item,"id")),"title"=>(ixml($item,"title")),"description"=>(ixml($item,"description")),"link"=>(ixml($item,"link")),"author"=>(ixml($item,"author")),"nacessos"=>(ixml($item,"nacessos")),"nacessosok"=>(ixml($item,"nacessosok")));
		}
		$linhas["canais"] = $canais;
	}
	$cp->set_data($linhas);
}

/*
Function: listaRSSws

Pega os links de um RSS usando a biblioteca magpierss (depreciado).

Globais:

$cp {CPAINT} - Objeto CPAINT.

$rss {string} - Endereços dos RSS.

Retorno:

{JSON}
*/
function listaRSSws()
{
	global $cp,$rss;
	require('../pacotes/magpierss/rss_fetch.inc');
	$rsss = explode("|",$rss);
	$erro = "Erro. Nao foi possivel ler o arquivo";
	foreach ($rsss as $r)
	{
		$rss = fetch_rss($r);
		if ($rss)
		{
			$erro = "";
			$linhas[] = "<a href='".$r."' target=blank ><img style='border:0px solid white;' src='imagens/rss.gif' /></a>####";
			foreach ( $rss->items as $item )
			{
				$linha[] = $item['title'];
				$linha[] = $item['description'];
				$linha[] = $item['link'];
				$linha[] = $item['author'];
				$linha[] = $item['ranking'];
				$linha[] = $item['tempo'];
				$linhas[] = implode("#",$linha);
				$linha = array();
			}
		}
	}
	if ($erro == "")
	{
		$retorna = implode("|",$linhas);
		$retorna = str_replace("\n","",$retorna);
		if (function_exists("mb_convert_encoding"))
		{$retorna = mb_convert_encoding($retorna,"UTF-8","ISO-88591");}
		else 
		{$retorna = $retorna;}
	}
	else {$retorna = $erro;}
	$cp->set_data($retorna);
}
?>