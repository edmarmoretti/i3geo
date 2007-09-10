/*
Title: Administração de mapfiles

Carrega os javascripts da interface de administração de mapfiles

File: i3geoadmin.js

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

$i = function(id)
{return document.getElementById(id);}
var scriptLocation = "";
var scripts = document.getElementsByTagName('script');
for (var i = 0; i < scripts.length; i++) {
	var src = scripts[i].getAttribute('src');
	if (src) {
		var index = src.lastIndexOf("i3geoadmin.js");
		// is it found, at the end of the URL?
		if ((index > -1) && (index + "i3geoadmin.js".length == src.length)) {
			scriptLocation = src.slice(0, -"i3geoadmin.js".length);
			break;
		}
	}
}
//scripts
var allScriptTags = "";
var jsfiles = new Array("i3geo_tudo_compacto.js")
for (var i = 0; i < jsfiles.length; i++)
{
	var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
	allScriptTags += currentScriptTag;
}
//css
var allCssTags = "";
var cssfiles = new Array("../css/i3geo.css")
for (var i = 0; i < cssfiles.length; i++)
{
	var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
	allCssTags += currentCssTag;
}
document.write(allCssTags);
document.write(allScriptTags);