<?php
error_reporting(0);
require_once("../../classesphp/pega_variaveis.php");
require_once("../../pacotes/cpaint/cpaint2.inc.php");
require_once("../../ms_configura.php");
require_once("../../pacotes/phpxbase/api_conversion.php");
if (function_exists('ereg'))
{require_once('../../pacotes/SOAPdepreciado/nusoap.php');}
else
{require_once('../../pacotes/SOAP/nusoap.php');}
$servico = "http://mapas.mma.gov.br/webservices/scielo.php";
$cp = new cpaint();
$cp->register('listaartigos');
$cp->start();
$cp->return_data();
function listaartigos()
{
	global $ret, $cp, $servico;
	$resultado = "";
	if (file($servico))
	{
		$ret = explode(" ",$ret);
		if (function_exists('ereg'))
		$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
		else
		$soapclient = new nusoap_client($servico);
		$resultado = $soapclient->call("listaartigosregiao",$ret);
	}
	$cp->set_data($resultado);
}
?>