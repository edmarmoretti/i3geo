<?php
error_reporting(0);
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesjs/cpaint/cpaint2.inc.php");
require_once("../../ms_configura.php");
require_once("../../pacotes/phpxbase/api_conversion.php");
require_once('../../pacotes/SOAP/nusoap.php');
$servico = "http://mapas.mma.gov.br/webservices/scielo.php";
$cp = new cpaint();
$cp->register('listaartigos');
$cp->start();
$cp->return_data();
function listaartigos()
{
	global $ret, $cp, $servico;
	$ret = explode(" ",$ret);
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	$resultado = $soapclient->call("listaartigosregiao",$ret);
	$cp->set_data($resultado);
}
?>