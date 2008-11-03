<?php
		$string1 = "<?xml version='1.0' encoding='UTF-8'?>";
		$string1 .= 
'<FLAMINGO xmlns:fmc="fmc" lang="en" languages="en" tooltipdelay="500">
<fmc:Logo id="logo"/>
<fmc:Coordinates right="right" top="top" decimals="4" listento="map">
<style id=".xy" font-family="verdana" font-size="10px" color="#555555" display="block" font-weight="normal"/>
<string id="xy">
<en>
<![CDATA[x:[x]<br>y:[y]]]>
</en>
</string>
</fmc:Coordinates>
<fmc:Window skin="g" top="60" right="right -100" width="300" bottom="bottom -70" canresize="true" canclose="true" title="Identificação" visible="false">
<fmc:IdentifyResultsHTML width="100%" height="100%" listento="map">
<style id=".bold" font-family="verdana" font-size="12px" color="#333333" display="block" font-weight="bold"/>
<style id=".normal" font-family="verdana" font-size="11px" color="#333333" display="block" font-weight="normal"/>
<style id=".uitleg" font-family="verdana" font-size="11px" color="#0033cc" display="block" font-weight="normal" font-style="italic"/>
</fmc:IdentifyResultsHTML>
</fmc:Window>
<fmc:Scalebar id="sbkm" skin="style1" left="30" bottom="bottom" width="200" units=" km" magicnumber="1000" listento="map">
<style id=".label" font-family="verdana" font-size="10px" color="#555555" display="block" font-weight="normal"/>
<style id=".units" font-family="verdana" font-size="10px" color="#555555" display="block" font-weight="normal"/>
</fmc:Scalebar>
<fmc:ToolGroup left="30" top="0" tool="zoom" listento="map">
<fmc:ToolZoomin id="zoom" title="aproxima"/>
<fmc:ToolZoomout left="30"/>
<fmc:ToolSuperPan left="60"/>
<fmc:ToolMeasure left="90" units=" m" magicnumber="1" decimals="0"/>
</fmc:ToolGroup>
<fmc:ButtonPrev right="210" top="2" listento="map"/>
<fmc:ButtonNext right="240" top="2" listento="map"/>
<fmc:ButtonFull right="270" top="2" listento="map"/>
<fmc:ZoomerV left="5" top="40" height="163" listento="map"/>
<fmc:MonitorLayer id="monitor" left="230" top="55" listento="map">
<style id=".text" font-family="verdana" font-size="12px" color="#666666" display="block" font-weight="normal"/>
<string id="waiting" en="Criando o mapa..."/>
<string id="loading" en="Redesenhando [percentage]%..."/>
</fmc:MonitorLayer>
<fmc:Map id="overview" movequality="HIGH" right="right" bottom="bottom" width="150" height="150" extent="-79.8713331401,-41.7736536401,-26.2264448599,11.8712346401" fullextent="-79.8713331401,-41.7736536401,-26.2264448599,11.8712346401">
<fmc:LayerOverview listento="map" followfactor="10000"/>
<fmc:LayerImage id="brasil" imageurl="../imagens/referencia1.png" extent="-79.8713331401,-41.7736536401,-26.2264448599,11.8712346401" />
</fmc:Map>

<fmc:Container borderwidth="0" bordercolor="#b8b8b8" left="left" top="top" bottom="bottom" right="right">
	<fmc:BorderNavigation skin="F1" width="100%" height="100%" listento="map"/>
	<fmc:Map id="map" movequality="HIGH" conform="true" mapunits="DECIMALDEGREES" width="100%" height="100%" fullextent="-180,-90,180,90"  extent="-76.5125927,-39.3925675209,-29.5851853,9.49014852081"  >
		<fmc:LayerIdentifyIcon/>
		<fmc:LayerGrid gridwidth="10" gridheight="10" minscale="11000"/>
		<fmc:LayerGrid gridwidth="5" gridheight="5" minscale="5000" maxscale="11000"/>
		<fmc:LayerGrid gridwidth="2" gridheight="2" minscale="1000" maxscale="5000"/>
		<fmc:LayerGrid gridwidth="1" gridheight="1" minscale= "500" maxscale="1000"/>
		<fmc:LayerGrid gridwidth="0.5" gridheight="0.5" minscale="100" maxscale="500"/>
		<fmc:LayerGrid gridwidth="0.1" gridheight="0.1" maxscale="100"/>
		<fmc:LayerOGWMS id="OG3"  format="PNG" url="';
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$host = $protocolo[0]."://".$_SERVER['HTTP_HOST'];
	//include_once("../ms_configura.php");
	$string2 = $host."/i3geo/classesphp/flamingoogc.php?g_sid=".$g_sid;
	$string3 = '&WMS=OGC:WMS&SERVICE=WMS&VERSION=1.1.0&SRS=EPSG:4291&EXCEPTIONS=INIMAGE&BGCOLOR=0xF0F0F0" LAYERS="copyright"/>
	</fmc:Map>
</fmc:Container>
</FLAMINGO>';
	$stringFinal = $string1.$string2.$string3;
	$arq = dirname($map_file)."/flamingo.xml";
	$fp = fopen($arq,"w");
	fwrite($fp,$stringFinal);
	fclose($fp);

?>