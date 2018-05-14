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
	document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../css/font/material-icons.css'/>");
	document.write("<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>");
	document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../css/i3geo8.css.php'></link>");
	document.write("<script type='text/javascript' src='" + scriptLocation + "i3geo_tudo_compacto8.js.php'></script>");
})();
