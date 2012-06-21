<?php
include_once("../../classesphp/pega_variaveis.php");
if(!isset($palavra))
{echo "Parâmetro &palavra= não foi definido. 'palavra' é a palavra que será buscada";}
if(!isset($locaplic))
{echo "<br>Parâmetro &locaplic= não foi definido. 'locaplic' indica onde o i3geo está instalado";}
?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <link rel="stylesheet" type="text/css" href="../../css/ferramentas.css">
      <link rel="stylesheet" type="text/css" href="../../css/botoes.css">
  	<title></title>
  </head>
  <body name="ancora" class="yui-skin-sam;" style="overflow:auto;">
<div style="top:5px;left:1px;display:block;width:90%;"  id="resultado" >Aguarde...</div>
	<script src="../../classesjs/i3geo.js" type="text/javascript"></script>
    <script language="JavaScript" type="text/javascript" src="index.js"></script>

<script type="text/javascript">
i3GEObuscaRapida.idresultado

var mapaLugar = function(wkt,layer,gid,nm)
{
	var ext = i3GEO.util.wkt2ext(wkt,"polygon");
	var url = "<?php echo $locaplic;?>/ms_criamapa.php?srs_wms=epsg:4618&image_wms=image/png&versao_wms=1.1.1"
	url += "&url_wms=http://mapas.mma.gov.br/webservices/geonameswms.php?gid="+gid+"&";
	url += "&layer_wms="+layer+"&style_wms=default"
	url += "&nome_wms="+nm+" - "+layer
	url += "&mapext="+ext
	url += "&interface=googlemaps.phtml"
	window.open(url)
}
i3GEObuscaRapida.funcaozoom = "mapaLugar"
i3GEObuscaRapida.inicia("<?php echo $palavra;?>","<?php echo $locaplic;?>",i3GEObuscaRapida.montaResultado,true,false)
  </script>


  </body>
</html>