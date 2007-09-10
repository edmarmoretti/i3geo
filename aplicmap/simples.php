<?php
echo '
<link rel="stylesheet" type="text/css" href="'.$caminho.'css/geral.css">
<link rel="stylesheet" type="text/css" href="'.$caminho.'css/botoes.css">
<link rel="stylesheet" type="text/css" href="'.$caminho.'classesjs/jsobjects/documentation.css">
<script src="'.$caminho.'classesjs/cpaint/cpaint2.inc.compressed.js" type="text/javascript"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/jsobjects/jsUI-Global/common.js"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/jsobjects/jsUI-Global/uiCommon.js"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/jsobjects/jsUI-Treeview/component.js"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/funcoes_compacto.js"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/ferramentas_compacto.js"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/ajax_compacto.js"></script>
<script type="text/javascript" src="'.$caminho.'classesjs/iniciamma_compacto.js"></script>
<body id=corpo >
<center>
<table id="mst" width=100% cellspacing="0">
	<tr>
		<td class=tdbranca id=contemFerramentas style="vertical-align:top;width:268px;text-align:left">
			<table width=100% cellspacing=0 cellpadding=0 >
				<tr><td>
					<div style="background-color:rgb(200,200,200);cursor:pointer;position:relative;font-family: verdana, arial, helvetica, sans-serif;text-align: center">
					<div id=guia1 ><b>&nbsp;Temas&nbsp;</b>|</div><div id=guia2 ><b>&nbsp;Adiciona&nbsp;</b>|</div><div id=guia4 ><b>&nbsp;Legenda&nbsp;</b>|</div>
					</div>
				</td></tr>
			</table>
			<div id="guia1obj" ><div id=listaTemas ></div></div>
			<div id="guia2obj" style="display:none;">Aguarde...<img alt="" src="'.$caminho.'imagens/branco.gif" width=248 /></div>
			<div id="guia4obj" style="display:none;text-align:left"><div id="legenda" style="text-align:left"></div></div>
		</td>
		<td id="ferramentas" class=tdbranca style="vertical-align:top;width:90px">
			<center>
			<table cellspacing=0 cellpadding=0 >
				<tr><td>
					<div id=ferramentas1>
					<table><tr><td><img alt="redesenha" title="redesenha" src="'.$caminho.'imagens/branco.gif" ID="executa"></td></tr></table>
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="info" title="info" src="'.$caminho.'imagens/branco.gif" id="identifica"/></td></tr></table>
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="zoom geral" title="zoom geral" src="'.$caminho.'imagens/branco.gif" ID="zoomtot"/></td></tr></table> 
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="desloca" title="desloca" src="'.$caminho.'imagens/branco.gif" ID="pan"/></td></tr></table>
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="zoom" title="zoom" src="'.$caminho.'imagens/branco.gif" id="zoomli"/></td></tr></table>
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="aproxima" title="aproxima" src="'.$caminho.'imagens/branco.gif" id="zoomiauto"/></td></tr></table>
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="afasta" title="afasta" src="'.$caminho.'imagens/branco.gif" id="zoomoauto"/></td></tr></table>
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="refer&ecirc;ncia" title="refer&ecirc;ncia" src="'.$caminho.'imagens/branco.gif" id="referencia"/></td></tr></table>        
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="mede" title="mede" src="'.$caminho.'imagens/branco.gif" id="mede"/></td></tr></table> 
					<table><tr><td></td></tr></table>
					<table><tr><td><img alt="google" title="google" src="'.$caminho.'imagens/branco.gif" id="google"/></td></tr></table>
					<table><tr><td><img alt="" src="'.$caminho.'imagens/branco.gif" width=70 height=0></td></tr></table>
					</div>
				</td></tr>
			</table>
			</center>
		</td>
		<td class=verdeclaro style="vertical-align:top;">
			<table style="vertical-align:top;">
				<tr><td  class=verdeclaro id=contemImg >
					<div id=corpoMapaO ></div><div id=corpoMapa ></div><div id=corpoMapaL ></div><div id=corpoMapaN ></div><div id=corpoMapaS ></div>
				</td></tr>
				<tr><td class=verdeclaro ><div class=pcenter10 id="longlat">Longitude e latitude</div></td></tr>
				<tr>
					<td class=verdeclaro ><div style="text-align:center" id="escalaGrafica"></div></td>
				</tr>
			</table>
		</td>
	</tr>
	<tr><td colspan=3 ><div id=ajuda class=verdeescuro style="text-align:left;" >I3Geo</div></td></tr>
</table>
<p><a href="http://mapserver.gis.umn.edu/"><img alt="" title="Mapserver" name="mapserver" src="'.$caminho.'imagens/mapserv.png" /></a></p>
</center>
</body>
<script type="text/javascript">
g_locaplic = "http://"+window.location.host+"/i3geo";
g_localimg = "http://"+window.location.host+"/i3geo/imagens";';
echo 'document.body.onmouseover=function(){this.onmousemove=processevent1;};';
echo "m ='".$tmpfname."';";
echo "e = '".$mapext."';";
echo 'objmapa = new Mapa(e,m);';
echo 'objmapa.inicializa();';
echo '</script>';
?>