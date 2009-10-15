/*
Title: i3geo - carregador de javascripts

Para uso nas interfaces HTML.

Lê o conjunto de javascripts para o funcionamento do i3geo.

Carrega o arquivo compactado i3geo_tudo_compacto.js.php

Veja exemplo em <geral.htm>

Arquivo:

i3geo/classesjs/i3geo.js

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
/*
Pega um objeto do documento.

Exemplo: $i("box1")

Parâmetros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
var $i = function(id)
{return document.getElementById(id);};

//necessario para nao dar erro no refresh

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
document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../css/i3geo.css.php'></link>");
document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../pacotes/yui270/build/button/assets/skins/sam/button.css'></link>");
document.write("<script src='" + scriptLocation + "i3geo_tudo_compacto.js.php'></script>");