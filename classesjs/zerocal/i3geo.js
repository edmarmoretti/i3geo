//depreciado
$i = function(id)
{return document.getElementById(id);}
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