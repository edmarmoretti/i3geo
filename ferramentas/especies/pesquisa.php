<?php
/*
Title: Esp&eacute;cies (PHP)

Acessa os web services do MMA para recuperar os dados de esp&eacute;cies.

Por ser executado dentro do i3Geo, boa parte dos parâmetros s&atilde;o obtidos da vari&aacute;vel de se&ccedil;&atilde;o.

Arquivos:

i3geo/ferramentas/especies/pesquisa.php
i3geo/ferramentas/especies/pesquisa.htm

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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

*/
set_time_limit(180);
require_once(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");
require_once(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
if (function_exists('ereg'))
{require_once(dirname(__FILE__).'/../../pacotes/SOAPdepreciado/nusoap.php');}
else
{require_once(dirname(__FILE__).'/../../pacotes/SOAP/nusoap.php');}
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
require_once(dirname(__FILE__)."/../../pacotes/phpxbase/api_conversion.php");
require_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
$cp = new cpaint();
$servico = "http://mapas.mma.gov.br/webservices/especiesws.php";

if ($funcao == "listaBancos")
{
	$cp->register('listaBancos');
	$cp->start();
	$cp->return_data();
}
if ($funcao == "listaFamilias")
{
	$cp->register('listaFamilias');
	$cp->start();
	$cp->return_data();
}
if ($funcao == "listaEspecies")
{
	$cp->register('listaEspecies');
	$cp->start();
	$cp->return_data();
}
if ($funcao == "adicionatema")
{
	$cp->register('adicionatema');
	$cp->start();
	$cp->return_data();
}
/*
Function: listaBancos

Obt&eacute;m a lista de bancos.
*/
function listaBancos()
{
	global $cp,$servico;
	$resultado = array();
	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);
	$resultado = $soapclient->call("natureserveDatabase","");
	$cp->set_data($resultado);
}
/*
Function: listaFamilias

Obt&eacute;m a lista de familias.
*/
function listaFamilias()
{
	global $cp,$servico,$banco;
	$resultado = array();
	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);
	$resultado = $soapclient->call("natureserveFamily",$banco);
	$cp->set_data($resultado);
}
/*
Function: listaEspecies

Obt&eacute;m a lista de especies.
*/
function listaEspecies()
{
	global $cp,$servico,$banco,$familia;
	$resultado = array();
	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);
	$resultado = $soapclient->call("natureserveEspecie",array($banco,$familia));
	$cp->set_data($resultado);
}
/*
Function: adicionatema

Adiciona um tema no mapa atual.
*/
function adicionatema()
{
	global $map_file,$dir_tmp,$imgdir,$banco,$familia,$servico,$cp,$especie,$cor,$locaplic,$imgurl;
	$retorno = "erro.";

	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);

	$resultado = $soapclient->call("natureserveGidEspecie",array($banco,$especie));
	$tabelas = $resultado["especies"];
	$mapa = ms_newMapObj($map_file);
	include(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
	include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
	$nomeslegenda["munamb1"] = "p&aacute;ssaros (poligonos) ".$especie;
	$nomeslegenda["munamb2"] = "anf&iacute;bios (poligonos) ".$especie;
	$nomeslegenda["munamb3"] = "mam&iacute;feros (poligonos) ".$especie;
	$nomeslegenda["munamb4"] = "p&aacute;ssaros (pontos) ".$especie;
	$nomeslegenda["munamb5"] = "mam&iacute;feros (pontos) ".$especie;
	foreach ($tabelas as $tabela)
	{
		if ($tabela["gids"] != '')
		{
			$retorno = "ok";
			$nometema = explode(".",$tabela["tabela"]);
			$tema = $nometema[1];
			$servico = "http://mapas.mma.gov.br/webservices/especieswms.php?gid=".$tabela["gids"]."&cor=".$cor;
			$nome = "default";
			$proj = "EPSG:4618";
			$formato = "image/png";
			$nomecamada = $nomeslegenda[$tema];
			$suportasld = "nao";
			$versao = "1.1.0";
			$tiporep = "";
			$tipo = "";
			$m = new Mapa($map_file);
			$m->adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld);
			$m->salva();
		}
	}
	$cp->set_data($retorno);
}
?>