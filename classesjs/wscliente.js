/*
Title: Cliente de web service

File: i3geo/classesjs/wscliente.js

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
WCservico = "";
g_tipo = ""
g_tema = ""
g_proj = ""
g_legenda = ""
g_nometema = ""
g_funcao = ""
g_sid = ""
WClistaDeTemas = ""
WClistaDeFuncoes = ""
g_RSSws = new Array() //enderecos dos RSS do tipo WS
g_RSSwms = new Array() //enderecos dos RSS do tipo WMS

//seta as variáveis navn e navm
navm = false
navn = false
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
/*
Function: WCinicia

Monta a árvore de opções e preenche a DIV arvore. Busca a lista de serviços, se existirem RSS cadastrados.
*/
function WCinicia()
{
	arvore = new Object();
	arvore = treeviewNew("arvore", "default", "arvoreMenu", null);
	arvore.createItem("raiz", "Opções", g_locaplic+"/imagens/lc_group.gif", true, true, true, null);
	WCcriano("ajudawc","Ajuda",g_locaplic+"/imagens/folder-s.gif","raiz","");
	WCcriano("ajudawc1","<span class=clique onclick='WCativa(\"oquews\")'>Web Services</span>",g_locaplic+"/imagens/new.gif","ajudawc","link");
	WCcriano("ajudawc2","<span class=clique onclick='WCativa(\"oqueogc\")'>Padrões OGC</span>",g_locaplic+"/imagens/new.gif","ajudawc","link");
	WCcriano("ajudawc3","<span class=clique onclick='WCativa(\"oquecarto\")'>WS cartográfico</span>",g_locaplic+"/imagens/new.gif","ajudawc","link");

	WCcriano("clientewms","Mapas",g_locaplic+"/imagens/folder-s.gif","raiz","");
	WCcriano("clientewms1","<span class=clique onclick='WCativa(\"escolherwms\")'>Escolher serviço</span>",g_locaplic+"/imagens/new.gif","clientewms","link");
	WCcriano("clientewms4","<span class=clique onclick='WClistatemas()'>Escolher um tema</span>",g_locaplic+"/imagens/new.gif","clientewms","link");
	WCcriano("clientewms2","<span class=clique onclick='WCgetcapabilities(\"WMS\")'>Resposta XML (WMS)</span>",g_locaplic+"/imagens/new.gif","clientewms","link");
	WCcriano("clientewms3","<span class=clique onclick='WCgetcapabilities(\"WFS\")'>Resposta XML (WFS)</span>",g_locaplic+"/imagens/new.gif","clientewms","link");

	WCcriano("clientedados","Dados",g_locaplic+"/imagens/folder-s.gif","raiz","");
	WCcriano("clientedados1","<span class=clique onclick='WCativa(\"escolherws\")'>Escolher serviço</span>",g_locaplic+"/imagens/new.gif","clientedados","link");
	WCcriano("clientedados4","<span class=clique onclick='WClistafuncoes()'>Escolher fun&ccedil;&atilde;o</span>",g_locaplic+"/imagens/new.gif","clientedados","link");
	WCcriano("clientedados2","<span class=clique onclick='WCwsdl()'>WSDL</span>",g_locaplic+"/imagens/new.gif","clientedados","link");

	WCcriano("listarss","RSS",g_locaplic+"/imagens/xml.gif","raiz","");
	WCcriano("listarssws","<span class=clique onclick='WClistaServicos(\"ws\")'>Dados</span>",g_locaplic+"/imagens/new.gif","listarss","link");
	WCcriano("listarsswms","<span class=clique onclick='WClistaServicos(\"wms\")'>Mapas</span>",g_locaplic+"/imagens/new.gif","listarss","link");
	if (document.getElementById("RSSws"))
	{
		if (g_RSSws.length > 0)
		{
			var p = g_locaplic+"/classesphp/wscliente.php?funcao=listaRSSws&rss="+g_RSSws.join("|")+"&g_sid="+g_sid;
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"listaRSSws",mostraRetornowsRSS);
		}
	}
	if (document.getElementById("RSSwms"))
	{
		if (g_RSSwms.length > 0)
		{
			var p = g_locaplic+"/classesphp/wscliente.php?funcao=listaRSSws&rss="+g_RSSwms.join("|")+"&g_sid="+g_sid;
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"listaRSSws",mostraRetornowmsRSS);
		}
	}
	/*
	pega parametros pela url
	servico,tema
	*/
	parametros = "";
	parServico = "";
	parTema = "";
	parTipo = "";
	//servico = unescape(((((window.location.href).split("servico="))[1]).split("&"))[0]);
	parametros = window.location.href.split("?");
	if (parametros.length > 1)
	{
		valores = parametros[1].split(",");
		//[0]=tipo,[1]=endereco,[2]=tema
		//abre o servico e lista os temas
		if (valores.length == 2)
		{
			WCservico = valores[1];
			if (parametros.length==3)
			{WCservico += "?"+parametros[2];}
			if (valores[0] == "wms")
			{
				registrawms(WCservico);
			}
		}
	}
}
/*
Function: WClistaServicos

Lista os serviços cadastrados.

Parameters:

tipo - ws/wms

*/
function WClistaServicos(tipo)
{
	if (tipo == ("ws"))
	{var lista = g_RSSws}
	else
	{var lista = g_RSSwms}
	for (i=0;i<lista.length; i++)
	{
		var ins = "<p class=clique onclick=\"window.open('"+lista[i]+"')\" ><img src="+g_locaplic+"/imagens/xml.gif >&nbsp;"+lista[i]+"</p>"
	}
	document.getElementById("corpo").innerHTML = ins
}
/*
Function: mostraRetornowsRSS

Lista os ws vindos dos RSS.

*/
function mostraRetornowsRSS(retorno)
{
	var linhas = retorno.data.split("|")
	var ins = ""
	for (i=0;i<linhas.length; i++)
	{
		var caso = linhas[i].split("#")

		ins += "<p class=clique onclick=\"registraws('"+caso[2]+"')\" ><b>"+caso[0]+"</b><span style=color:gray ><br>&nbsp;"+caso[1]+"<br>&nbsp;("+caso[3]+")</span>"
		if (caso[4])
		{ins += " <span style=color:gray >(disponibilidade: "+parseInt(caso[4])+"%, dias considerados: "+caso[5]+")</span></p>";}
		else {ins += "</p>"}
	}
	document.getElementById("RSSws").innerHTML = ins
}
/*
Function: mostraRetornowmsRSS

Lista os wms vindos dos RSS.

*/
function mostraRetornowmsRSS(retorno)
{
	var linhas = retorno.data.split("|")
	var ins = ""
	for (i=0;i<linhas.length; i++)
	{
		var caso = linhas[i].split("#")
		if (i > 0)
		{
			ins += "<p class=clique onclick=\"registrawms('"+caso[2]+"')\" ><b>"+caso[0]+"</b>&nbsp;"+caso[1]+"&nbsp;("+caso[3]+")"
			if (caso[4])
			{ins += " <span style=color:gray >(disponibilidade: "+parseInt(caso[4])+"%, dias considerados: "+caso[5]+")</span></p>";}
			else {ins += "</p>"}
		}
		else
		{{ins += ""}}
	}
	document.getElementById("RSSwms").innerHTML = ins+"<br><br>"
}
/*
Function: WCcriano

Cria um nó na árvore de opções

Parâmetros:

idnovo - nome do id do novo nó

texto - texto que será incluído

imagem - imagem que será utilizada no nó

pai - id do pai do nó

tipo - tipo de nó (se for vazio é um nó normal, se não é um nó final)
*/
function WCcriano(idnovo,texto,imagem,pai,tipo)
{
	if (tipo != "")
	{arvore.createItem(idnovo, texto, imagem, false, true, true, pai);}
	else
	{arvore.createItem(idnovo, texto, imagem, true, true, true, pai);}
}
/*
Function: WCativa

Ativa uma opção.

O conteúdo do div (id) é lido e incluído na div corpo

Parâmetros:

id - id do div com o conteúdo que será ativado
*/
function WCativa(id)
{
	var novo = document.getElementById(id)
	document.getElementById("corpo").innerHTML = novo.innerHTML
	if (id == "escolherwms")
	{document.getElementById("enderecowms").value = WCservico}
	if (id == "escolherws")
	{document.getElementById("enderecows").value = WCservico}
}
/*
Function: registrawms

Copia um link (serviço WMS) para o campo de formulário enderecowms.

Parâmetros:

nome - endereço do serviço
*/
function registrawms(nome)
{
	document.getElementById("enderecowms").value = nome
	WCservico = nome
	WClistaDeTemas = ""
	WClistatemas()
}
/*
Function: registraws

Copia um link (serviço WS) para o campo de formulário enderecows.

Parâmetros:

nome - endereço do serviço
*/
function registraws(nome)
{
	document.getElementById("enderecows").value = nome
	WCservico = nome
	WClistaDeFuncoes = ""
	WClistafuncoes()
}
/*
Function: WCaguarde

Gera mensagem de aguarde.
*/
function WCaguarde()
{
	document.getElementById("corpo").innerHTML = "<p>Aguarde...</p>"
}
/*
Function: WCgetcapabilities

Executa ajax para buscar resultado do getcapabilities.

Parâmetros:

tipo - tipo de chamada WMS|WFS

*/
function WCgetcapabilities(tipo)
{
	if (WCservico != "")
	{
		WCaguarde();
		var p = g_locaplic+"/classesphp/wscliente.php?funcao=getcapabilities&onlineresource="+WCservico+"&tipo="+tipo+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities",mostraRetorno);
	}
	else
	document.getElementById("corpo").innerHTML = "<p>Nenhum serviço foi escolhido.</p>"
}
/*
Function: mostraRetorno

Mostra o retorno de uma chamada ajax sem tratamento

*/
function mostraRetorno(retorno)
{
	document.getElementById("corpo").innerHTML = "<p>"+retorno.data
}
/*
Function: WCmostraTemas

Mostra o retorno da chamada ajax que busca a lista de temas

*/
function WCmostraTemas(retorno)
{
	document.cookie = 'i3GeoPHP=; expires=Thu, 2 Aug 2001 20:47:11 UTC; path=/';
	if (WClistaDeTemas == "")
	{
		var ins = "<div style='text-align:left'><p>Selecione a camada que ser&aacute; adicionada ao mapa e depois clique em Aplicar.<br>"
		ins += '<p><input type="button" class=executar value="Aplicar&nbsp;&nbsp;" onclick="WCverMapa()" />'
		document.getElementById("corpo").innerHTML = ins+"<p>"+retorno.data+"</div>"
		WClistaDeTemas = ins+"<p>"+retorno.data
	}
	else
	{document.getElementById("corpo").innerHTML = WClistaDeTemas}
}
/*
Function: WClistatemas

Busca a lista de temas de um WMS ou WFS

*/
function WClistatemas()
{
	if (WCservico != "")
	{
		WCaguarde();
		if (WClistaDeTemas == "")
		{
			var p = g_locaplic+"/classesphp/mapa_controle.php?map_file=''&funcao=temaswms&servico="+WCservico+"&g_sid="+g_sid
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"temaswms",WCmostraTemas);
		}
		else
		{WCmostraTemas("")}
	}
	else
	document.getElementById("corpo").innerHTML = "<p>Nenhum serviço foi escolhido.</p>"
}
/*
Function: WClistafuncoes

Busca a lista de funções de um WS

*/
function WClistafuncoes()
{
	if (WCservico != "")
	{
		WCaguarde();
		if (WClistaDeFuncoes == "")
		{
			var p = g_locaplic+"/classesphp/wscliente.php?funcao=funcoesws&servico="+WCservico+"&g_sid="+g_sid
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"funcoesws",WCmostraFuncoes);
		}
		else
		{WCmostraFuncoes("")}
	}
	else
	document.getElementById("corpo").innerHTML = "<p>Nenhum serviço foi escolhido.</p>"
}
/*
Function: WCmostraFuncoes

Mostra o retorno da chamada ajax que busca a lista de temas

*/
function WCmostraFuncoes(retorno)
{
	if (WClistaDeFuncoes == "")
	{
		var ins = "<p>Selecione a fun&ccedil;&atilde;o que ser&aacute; acionada depois clique em Aplicar.<br>"
		ins += '<p><input type="button" class=executar value="Aplicar&nbsp;&nbsp;" onclick="WCselParFuncao()" />'
		ins += "<div style='text-align:left;'>"
		var funcs = retorno.data.split("|");
		for (i=0;i<funcs.length; i++)
		{
			var f = funcs[i].split("#")
			ins += "<br><b><input style='cursor:pointer' type=radio name='funcao' onclick=\"WCselParFuncao('"+f[0]+"')\" />&nbsp;"+f[0]+"</b>&nbsp;"+f[3]+"<br>"
			ins += "<i>Entrada:</i>"+f[1]
			ins += "<br><i>Sa&iacute;da:</i>"+f[2]+"<br>"
		}
		document.getElementById("corpo").innerHTML = ins+"</div>"
		WClistaDeFuncoes = ins+"</div>"
	}
	else
	{document.getElementById("corpo").innerHTML = WClistaDeFuncoes}
}
/*
Function: WCselParFuncao

Lista os parâmetros de uma função para o usuário digitar os valores.

Parâmetros:

funcao - função que será chamada

*/
function WCselParFuncao(funcao)
{
	WCaguarde();
	g_funcao = funcao;
	var p = g_locaplic+"/classesphp/wscliente.php?funcao=parfuncoesws&servico="+WCservico+"&funcaows="+funcao+"&g_sid="+g_sid
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"parFuncoesws",WCmostraParFuncoes);
}
/*
Function: WCmostraParFuncoes

Mostra o retorno da chamada ajax que busca as funcoes de um WS

*/
function WCmostraParFuncoes(retorno)
{
	if (retorno.data == ""){WCchamadados(retorno.data)}
	else
	{
		var pars = retorno.data.split("|")
		var ins = "<p>Digite os valores dos par&acirc;metros e depois em clique em 'Aplicar'.<br>"
		ins += '<p><input type="button" class=executar value="Aplicar&nbsp;&nbsp;" onclick=WCchamadados(\"'+retorno.data+'\") />'
		ins += "<div style='text-align:left;'>"
		for (i=0;i<pars.length; i++)
		{
			var temp = pars[i].split("#")
			ins+= "<br>"+temp[0]+"&nbsp("+temp[1]+")<input type=text size=20 value='' id=xxx"+temp[0]+" /><br>"
		}
		document.getElementById("corpo").innerHTML = ins+"</div>"
	}
}
/*
Function: WCchamadados

Busca os dados de uma função de um serviço

*/
function WCchamadados(retorno)
{
	var par = new Array()
	if (retorno != "")
	{
		var pars = retorno.split("|")
		for (i=0;i<pars.length; i++)
		{
			var temp = pars[i].split("#")
			par.push(temp[0]+"*"+document.getElementById("xxx"+temp[0]).value)
		}
	}
	WCaguarde();
	var p = g_locaplic+"/classesphp/wscliente.php?funcao=dadosws&servico="+WCservico+"&funcaows="+g_funcao+"&param="+par.join("|")+"&g_sid="+g_sid
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"dadosWS",WCmostraDados);
}
/*
Function: WCmostraDados

Mostra os dados de uma função de um serviço

*/
function WCmostraDados(retorno)
{
	document.getElementById("corpo").innerHTML = "<div style='text-align:left'>"+retorno.data+ "</div>"
}
/*
Function: seltema

Seta as variáveis necessárias para visualizar o mapa

Parâmetros:

tipo - tipo de tema
tema - nome do tema
legenda - endereço da legenda
nometema - nome completo do tema

*/
function seltema(tipo,tema,legenda,nometema)
{
	g_tipo = tipo; //tipo de tema
	g_tema = tema; //tema selecionado do ws
	g_legenda = legenda; //legenda do tema
	g_nometema = nometema; //nome do tema
}
/*
Function: WCverMapa

Mostra o mapa

*/
function WCverMapa()
{
	var epsg = document.getElementById("proj").value.split(",")
	var epsg = epsg[0]
	var epsg = epsg.split(":")
	var epsg = epsg[1]
	document.getElementById("corpo").innerHTML = "<div style=text-align:left id=mapa ></div><div style=width:550px;text-align:left id=localizarxy ></div><div style=text-align:left ><iframe width=400 id=desc ></iframe></div>"
	var map = new OpenLayers.Map('mapa');
	var bounds = new OpenLayers.Bounds(-73,5,-27,-34);
	if (g_tipo != "estilo")
	{var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",WCservico, {layers: g_tema, srs: epsg} );}
	else
	{
		var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",WCservico, {layers: g_tema, styles: g_nometema, srs: epsg});
	}
	map.addLayer(wms);
	map.zoomToExtent(bounds);
	map.events.register("mousemove", map, function(e)
	{
		//pega as coordenadas do cursor
		if (navm)
		{var p = new OpenLayers.Pixel(e.x,e.y);}
		else
		{var p = e.xy;}
		//altera o indicador de localizacao
		var lonlat = map.getLonLatFromViewPortPx(p);
		var d = convdmsf(lonlat.lon,lonlat.lat);
	}
	)
	map.events.register("click", map, function(e)
	{
		//pega as coordenadas do cursor
		if (navm)
		{var p = new OpenLayers.Pixel(e.x,e.y);}
		else
		{var p = e.xy;}
		//altera o indicador de localizacao
		var lonlat = map.getLonLatFromViewPortPx(p);
		var url = wms.getFullRequestString()
		url = url.replace("GetMap","getfeatureinfo")
		url += "&QUERY_LAYERS="+g_tema
		var bb = map.getExtent()
		url += "&BBOX="+bb.toBBOX()
		//var xy = p.split(",")
		url += "&x="+p.x
		url += "&y="+p.y
		var size = map.getSize()
		url += "&WIDTH="+size.w
		url += "&HEIGHT="+size.h
		document.getElementById("desc").src = url
	}
	)
}
/*
Function: WCwsdl

Abre o servico WSDL em uma nova janela

*/
function WCwsdl()
{window.open(WCservico)}
/*
Function: convdmsf

Converte dd em dms.

Parameters:

x - coordenada x.

y - coordenada y.

Returns:

Array com o valor de x [0] e y [1] no formato dd mm ss
*/
function convdmsf(x,y) //0ms
{
	var m = 0;
	var s = 0;
	var dx = parseInt(x);
	if (dx > 0)
	{var restod = x - dx;}
	if (dx < 0)
	{restod = (x * -1) - (dx * -1);}
	dx = dx;
	if (restod != 0)
	{
		var mm = restod * 60;
		var m = parseInt(restod * 60);
		var restos = mm - m;
		var mx = m;
		if (restos != 0)
		{
			var s = restos * 60;
			var s = (s+" ").substring(0,5);
			var sx = s;
		}
		else  { s = "00.00" }
	}
	else
	{
		var mx = "00";
		var sx = "00.00";
	}
	if (m.length == 2){m = "0"+m+"";}
	if (s*1 < 10){s = "0"+s;}
	var xv = dx+" "+mx+" "+sx;
	var m = 0;
	var s = 0;
	var dy = parseInt(y);
	if (dy > 0)
	{var restod = y - dy;}
	if (dy < 0)
	{var restod = (y * -1) - (dy * -1);}
	dy = dy;
	if (restod != 0)
	{
		var mm = restod * 60;
		var m = parseInt(restod * 60);
		var restos = mm - m;
		var my = m;
		if (restos != 0)
		{
			var s = restos * 60;
			s = (s+" ").substring(0,5);
			var sy = s;
		}
		else  { var s = "00.00";}
	}
	else
	{
		var my = "00";
		var sy = "00.00";
	}
	if (m.length == 2){m = "0"+m;}
	if (s*1 < 10){s = "0"+s;}
	var yv = dy+" "+my+" "+sy;
	var res = new Array();
	res[0] = xv;
	res[1] = yv;
	if (document.getElementById("localizarxy"))
	{
		document.getElementById("localizarxy").innerHTML = 
		"<input style=text-align:left type=text size=20 value='Long.= "+dx+" "+mx+" "+sx+"'/><input style=text-align:left type=text size=20 value='Lat.= "+dy+" "+my+" "+sy+"'/>"
	}
	return res;
}
