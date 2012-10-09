<?php
/*
Title: metarproxima

Acessa o Web Service do Geonames que busca esta&ccedil;&otilde;es meteorol&oacute;gicas da rede METAR mais pr&oacute;ximas de um ponto.

Esse programa &eacute; utilizado na ferramenta de identifica&ccedil;&atilde;o e seu uso deve ser habilitado por meio do sistema
de administra&ccedil;&atilde;o do i3Geo. Para isso, utilize http://localhost/i3geo/admin/html/identifica.html e insira
"../ferramentas/metar/metarproxima.php" em uma nova linha na coluna "programa".

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

Parametros:

x - coordenada x em d&eacute;cimos de grau

y - coordenada y em d&eacute;cimos de grau

Return:

{html}
*/
//set_time_limit(600);
echo "<html><style>
	P 
	{padding-top:1px;COLOR: #2F4632;text-align: justify;font-size: 12px;font-family: Verdana, Arial, Helvetica, sans-serif;}
	</style>";
require_once("../../classesphp/pega_variaveis.php");
error_reporting(E_ALL);
$url = "http://ws.geonames.org/findNearByWeatherXML?lat=$y&lng=$x&lang=pt";

$xml = simplexml_load_file($url);

$conta = 0;
$fim = array();
$resultado = "";
if($xml == true){
	$raiz = $xml->xpath('observation');
	foreach($raiz as $e){
		//var_dump($e);
		$r = $e->xpath('observation');
		foreach($r as $t)
		{$resultado .= "<p><b>".$t."</b>";}
		
		$r = $e->xpath('observationTime');
		foreach($r as $t)
		{$resultado .= "<p><b> Data: </b>".$t;}
		
		$r = $e->xpath('stationName');
		foreach($r as $t)
		{$resultado .= "<p><b> Esta&ccedil;&atilde;o: </b>".$t;}
		
		$r = $e->xpath('ICAO');
		foreach($r as $t)
		{$resultado .= "<p><b> ICAO: </b>".$t;}
		
		$r = $e->xpath('elevation');
		foreach($r as $t)
		{$resultado .= "<p><b> Eleva&ccedil;&atilde;o: </b>".$t;}
		
		$r = $e->xpath('lat');
		foreach($r as $t){
			$resultado .= "<p><a title='Incluir no mapa' href='#' onmouseout='escondexy()' onmouseover='mostraxy()' onclick='insereponto()'><b> Latitude: </b>".$t;
			$y = $t;
		}
		$r = $e->xpath('lng');
		foreach($r as $t){
			$resultado .= "<b> Longitude: </b>".$t."</a>";
			$x = $t;
		}
		
		$r = $e->xpath('temperature');
		foreach($r as $t)
		{$resultado .= "<p><b> Temperatura: </b>".$t." C";}
		
		$r = $e->xpath('dewPoint');
		foreach($r as $t)
		{$resultado .= "<p><b> Ponto de orvalho: </b>".$t." C";}
		
		$r = $e->xpath('humidity');
		foreach($r as $t)
		{$resultado .= "<p><b> Humidade: </b>".$t." %";}
		
		$r = $e->xpath('clouds');
		foreach($r as $t)
		{$resultado .= "<p><b> Nuvens: </b>".$t;}
		
		$r = $e->xpath('weatherCondition');
		foreach($r as $t)
		{$resultado .= "<p><b> Condi&ccedil;&atilde;o: </b>".$t;}
		
		$r = $e->xpath('hectoPascAltimeter');
		foreach($r as $t)
		{$resultado .= "<p><b> Press&atilde;o: </b>".$t." hpa";}
		
		$r = $e->xpath('windDirection');
		foreach($r as $t)
		{$resultado .= "<p><b> Dire&ccedil;&atilde;o do vento: </b>".$t;}
		
		$r = $e->xpath('windSpeed');
		foreach($r as $t)
		{$resultado .= "<p><b> Velocidade do vento: </b>".$t." mph<br>";}
		
		$resultado .= "<p><a href='$url' >Web Service</a><br>";
		$resultado .= "<br><a href='http://weather.noaa.gov/' >Metar</a><br>";
	}
}
if ($resultado == "" || $xml == "")
{$resultado = "<span style=color:red >Nada encontrado</span><br><hr>";}
echo $resultado;
?>
<script>
	var i3GEO = window.parent.i3GEO;
	var x = <?php echo $x;?>;
	var y = <?php echo $y;?>;

	$i = window.parent.$i
	function escondexy(){
		i3GEO.util.escondeBox();
	}
	function mostraxy(){
		if(i3GEO.Interface.ATUAL === "googleearth")
		{return;}
		i3GEO.util.criaBox("boxpin");
		xy = i3GEO.calculo.dd2tela(x*1,y*1,$i(i3GEO.Interface.IDCORPO),i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);
		var box = $i("boxpin");
		box.style.display = "block";
		box.style.width = "5px";
		box.style.height = "5px";
		box.style.top = parseInt(xy[1],10)-2+"px";
		box.style.left = parseInt(xy[0],10)-2+"px";
		box.style.position = "absolute";
		box.style.border = "solid 2px red"
		box.style.zIndex = 5000
	}
	function insereponto(){
		i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,x,y);		
	}
</script>
</html>