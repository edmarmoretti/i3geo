/*
Title: i3geo.js

Lê o conjunto de javascripts para o funcionamento do i3geo.

Carrega o arquivo compactado i3geo_tudo_compacto.js que inclui também os scripts do YUI

File: i3geo.js

About: Licença

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
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Parâmetros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
$i = function(id)
{return document.getElementById(id);}
/*
Function: $trad

Pega o termo traduzido para uma lingua específica

Parameters:

id - id que identifica o texto na variável g_linguagem, definida em configura.js
*/
$trad = function(id)
{
	return eval("g_traducao."+id+"[0]."+g_linguagem+";");
}
//necessario para nao dar erro no refresh
mostradicasf = function(){}
var scriptLocation = "";
var scripts = document.getElementsByTagName('script');
for (var i = 0; i < scripts.length; i++) {
	var src = scripts[i].getAttribute('src');
	if (src) {
		var index = src.lastIndexOf("zerocal/i3geo.js");
		// is it found, at the end of the URL?
		if ((index > -1) && (index + "zerocal/i3geo.js".length == src.length)) {
			scriptLocation = src.slice(0, -"zerocal/i3geo.js".length);
			break;
		}
	}
}
//scripts
var allScriptTags = "";
var jsfiles = new Array("i3geo_tudo_compacto.js.php")
for (var i = 0; i < jsfiles.length; i++)
{
	var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
	allScriptTags += currentScriptTag;
}
document.write("<link rel='stylesheet' type='text/css' href='" + scriptLocation + "../css/i3geo.css.php'></script>");
document.write(allScriptTags);