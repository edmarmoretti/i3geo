<?php

$url = "http://servicos.inde.gov.br/inda.asmx?wsdl";
$soapClient = new SoapClient($url);

$functions = $soapClient->__getFunctions();
$resultado = $soapClient->Lista_recursos();
$recurso = $soapClient->Recursos("0abcb539-a06f-44cc-89bd-8d10260e8552");
echo "<pre>";

echo $soapClient->__getLastRequestHeaders();
echo $soapClient->__getLastRequest();

var_dump($functions);
var_dump($resultado);
//echo $resultado[0];exit;

$return = $soapClient->__soapCall("Lista_recursos");
echo("\nReturning value of __soapCall() call: ".$return);

exit;
$recurso = $soapClient->Recursos("0abcb539-a06f-44cc-89bd-8d10260e8552");
var_dump($recurso);
exit;


try {
	$x = @new SoapClient("http://servicos.inde.gov.br/inda.asmx?wsdl");
} catch (Exception $e) {
	echo $e->getMessage();
}
var_dump($x);
exit;


$url = "http://www.camara.gov.br/SitCamaraWS/Deputados.asmx?wsdl";

$client = new SoapClient($url);
var_dump($client);exit;
//$params->param1 = $value1;
//$params->param2 = $value2;
//$objectresult = $client->MyMethod($params);
$objectresult = $client->Lista_recursos();
$simpleresult = $objectresult->Lista_recursos;
print_r($simpleresult);

/*
try {
	$x = @new SoapClient("http://www.camara.gov.br/SitCamaraWS/Deputados.asmx?wsdl");
} catch (Exception $e) {
	echo $e->getMessage();
}
var_dump($x);
exit;


$client = new SoapClient('http://www.camara.gov.br/SitCamaraWS/Deputados.asmx');
var_dump($client);exit;
$function = 'ObterPartidosCD';
/*
$arguments= array('ConvertTemp' => array(
		'Temperature'   => 31,
		'FromUnit'      => 'degreeCelsius',
		'ToUnit'        => 'degreeFahrenheit'
));

//$options = array('location' => 'http://www.webservicex.net/ConvertTemperature.asmx');

$result = $client->__soapCall($function);//, $arguments, $options);

echo 'Response: ';
print_r($result);

*/

/*
include(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");

include(dirname(__FILE__)."/../../pacotes/SOAP/nusoap.php");

$cp = new cpaint();

$servico = "http://servicos.inde.gov.br/inda.asmx";
$servico = "http://www.camara.gov.br/SitCamaraWS/Deputados.asmx";
$funcao = $_GET["funcao"];
$resultado = array();
$soapclient = new nusoap_client($servico);

$resultado = $soapclient->call($funcao,array(),'http://www.camara.gov.br/SitCamaraWS/Deputados');
var_dump($resultado);

$cp->set_data($resultado);
$cp->return_data();
*/

?>