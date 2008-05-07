<?php
/*
Title: WS Cliente

Funções de leitura de web services e montagem da lista de serviços para conexão remota.

Utilizado também pela aplicação ws_cliente

About: Licença

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

File: i3geo/classesphp/wscliente.php

19/6/2007

Include:

<pega_variaveis.php>, <lews/wms_functions.php>, <classesjs/cpaint/cpaint2.inc.php>
*/
include_once("pega_variaveis.php");
include_once("lews/wms_functions.php");
include_once("../pacotes/cpaint/cpaint2.inc.php");
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

cp - Objeto CPAINT.

onlineresource - Endereço do serviço.

tipo - Tipo do serviço WMS|WFS.
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

servico - Endereço do web service.

cp - Objeto CPAINT.
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

cp - Objeto CPAINT.

servico - Endereço do web service.

funcaows - Nome da função do serviço.

param - Parâmetros da funcao.
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

Pega os campos de parâmetros de uma função de um WS.

cp - Objeto CPAINT.

servico - Endereço do web service.

funcaows - Nome da função do serviço.
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
/*
Function: listaRSSws

Pega os links de um RSS WS.

cp - Objeto CPAINT.

rss - Endereços dos RSS.
*/
function listaRSSws()
{
	global $cp,$rss;
	require('../pacotes/magpierss/rss_fetch.inc');
	//$rss = fetch_rss("http://localhost/i3geo/menutemas/servicosws.xml");
	$rsss = explode("|",$rss);
	$erro = "Erro. Nao foi possivel ler o arquivo";
	foreach ($rsss as $r)
	{
		$rss = fetch_rss($r);
		if ($rss)
		{
			$erro = "";
			$linhas[] = "<a href='".$r."' target=blank ><img src='imagens/rss.gif' /></a>####";
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