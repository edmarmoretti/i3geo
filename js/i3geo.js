/*
i3geo - carregador de javascripts

Esse arquivo e mantido apenas para compatibilidade com instalacoes que usem a carga de javascript com o nome i3geo.js.

Para uso atual, prefira o arquivo que contem a versao no nome, exemplo i3geo5.js

Para uso nas interfaces HTML.

L&ecirc; o conjunto de javascripts para o funcionamento do i3geo.

Carrega o arquivo compactado i3geo_tudo_compacto.js.php

Veja exemplo em <geral.htm>

Arquivo:

i3geo/classesjs/i3geo.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
/*
Pega um objeto do documento.

Exemplo: $i("box1")

Parametros:

id - id do objeto

Retorno:

object - objeto javaScript
 */
$i = function(id)
{return document.getElementById(id);};

//para nao dar erro em interfaces com OL 2

OpenLayers = {
		ImgPath: "",
		Layer: {
			OSM: function(opt){
				var titulo = "", name = "", url = "", v = false;
				if(opt == "Aquarela"){
					titulo = "Aquarela";
					name = "Aquarela";
					url = "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg";
					v = false;
				}
				if(opt == "OSM"){
					titulo = "OSM";
					name = "osm";
					url = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
					v = true;
				}
				if(opt == "Toner"){
					titulo = "Toner";
					name = "toner";
					url = "http://tile.stamen.com/toner/{z}/{x}/{y}.png";
					v = false;
				}
				if(opt == "Toner lite"){
					name = "tonerlite";
					titulo = "Toner lite";
					url = "http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png";
					v = false;
				}
				if(opt == "MapQuest Open Aerial"){
					titulo = "MapQuest Open Aerial";
					name = "layMapQuestAerial";
					url = "http://oatile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg";
					v = false;
				}
				return new ol.layer.Tile({
					title : titulo,
					visible : v,
					isBaseLayer : true,
					name : name,
					source: new ol.source.OSM({
						attributions : [new ol.Attribution({html: 'Atualize as camadas de fundo para OL3'})],
						crossOrigin : "anonymous",
						url : url
					})
				});
			}
		}
};


(function(){
	var scriptLocation = "";
	var scripts = document.getElementsByTagName('script');
	var i = 0;
	for (i = 0; i < scripts.length; i++) {
		var src = scripts[i].getAttribute('src');
		if (src) {
			var index = src.lastIndexOf("i3geo.js");
			// is it found, at the end of the URL?
			if ((index > -1) && (index + "i3geo.js".length == src.length)) {
				scriptLocation = src.slice(0, -"i3geo.js".length);
				break;
			}
		}
	}
	document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../pacotes/yui290/build/button/assets/skins/sam/button.css'></link>");
	document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../css/i3geo7.css.php'></link>");
	document.write("<script type='text/javascript' src='" + scriptLocation + "i3geo_tudo_compacto7.js.php'></script>");
})();
