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
/*
Function: WCinicia

Monta a árvore de opções e preenche a DIV arvore.

Parameters:

RSSws - Array contendo a lista de endereços com a lista dos serviços do tipo web service. A lista deve estar no formato RSS

RSSwms - Array contendo a lista de endereços com a lista dos serviços do tipo WMS. A lista deve estar no formato RSS
*/
function i3geo_wscliente_inicia(RSSws,RSSwms)
{
	/* 
	Variable: i3geo_wscliente_RSSws
	
	Array com a lista de web services do tipo dados
	 */
	i3geo_wscliente_RSSws = RSSws;
	/* 
	Variable: i3geo_wscliente_RSSwms
	
	Array com a lista de web services do tipo wms
	 */
	i3geo_wscliente_RSSwms = RSSwms
	/* 
	Variable: i3geo_wscliente_tipo
	
	Tipo de serviço wms ativo
	*/
	i3geo_wscliente_tipo = ""
	/* 
	Variable: i3geo_wscliente_tema
	
	Código do tema wms escolhido
	*/
	i3geo_wscliente_tema = ""
	/* 
	Variable: i3geo_wscliente_nometema
	
	Nome do tema wms escolhido
	*/
	i3geo_wscliente_nometema = ""
	/* 
	Variable: i3geo_wscliente_funcao
	
	Função do ws escolhida.
	*/
	i3geo_wscliente_funcao = ""
	g_sid = ""
	//seta as variáveis navn e navm
	navm = false
	navn = false
	var app = navigator.appName.substring(0,1);
	if (app=='N') navn=true; else navm=true;	
	
	var ins = ""
	var i = "&nbsp;&nbsp;<img style=position:relative;top:3px; src='"+g_locaplic+"/imagens/new.gif' >"
	var ii = "onmouseover='javascript:this.style.textDecoration=\"underline\"' onmouseout='javascript:this.style.textDecoration=\"none\"'"
	ins += "<b>&nbsp;Ajuda</b><br>";
	ins += i+"<span "+ii+" class=clique onclick='i3geo_wscliente_ativa(\"oquews\")'>Web Services</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_ativa(\"oqueogc\")'>Padrões OGC</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_ativa(\"oquecarto\")'>WS cartográfico</span><br><br>";
	ins += "</table>"
	ins += "<b>&nbsp;Mapas</b><br>"
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_servicoswms()'>Escolher serviço</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_listatemas()'>Escolher um tema</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_getcapabilities(\"WMS\")'>Resposta XML (WMS)</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_getcapabilities(\"WFS\")'>Resposta XML (WFS)</span><br><br>";

	ins += "<b>&nbsp;Dados</b><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_servicosws()'>Escolher serviço</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_listafuncoes()'>Escolher fun&ccedil;&atilde;o</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_wsdl()'>WSDL</span><br><br>";

	ins += "<b>&nbsp;RSS</b><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_listaServicos(\"ws\")'>Dados</span><br>";
	ins += i+"<span "+ii+"  class=clique onclick='i3geo_wscliente_listaServicos(\"wms\")'>Mapas</span><br>";
	document.getElementById("arvoreMenu").innerHTML = ins;
	/*
	pega parametros pela url
	servico,tema
	*/
	parametros = "";
	parServico = "";
	parTema = "";
	parTipo = "";
	parametros = window.location.href.split("?");
	if (parametros.length > 1)
	{
		valores = parametros[1].split(",");
		if (valores.length == 2)
		{
			i3geo_wscliente_WCservico = valores[1];
			if (parametros.length==3)
			{i3geo_wscliente_WCservico += "?"+parametros[2];}
			if (valores[0] == "wms")
			{
				document.getElementById("enderecowms").value = nome
				i3geo_wscliente_listatemas()
			}
		}
	}
}
/*
Function: i3geo_wscliente_listaServicos

Lista os serviços cadastrados.

Parameters:

tipo - ws/wms

*/
function i3geo_wscliente_listaServicos(tipo)
{
	if (tipo == ("ws"))
	{var lista = i3geo_wscliente_RSSws}
	else
	{var lista = i3geo_wscliente_RSSwms}
	for (i=0;i<lista.length; i++)
	{
		var ins = "<p class=clique onclick=\"window.open('"+lista[i]+"')\" ><img src="+g_locaplic+"/imagens/xml.gif >&nbsp;"+lista[i]+"</p>"
	}
	document.getElementById("corpo").innerHTML = ins
}

/*
Function: i3geo_wscliente_servicosws

Lista os web services existentes no arquivo definido na variável i3geo_wscliente_RSSws.

*/
function i3geo_wscliente_servicosws()
{
	var monta = function(retorno)
	{
		var linhas = retorno.data.split("|")
		var ins = ""
		if(linhas.length == 1)
		{var ins = "<br><span style=color:red >"+retorno.data+"</span>"}
		else
		{
			for (i=0;i<linhas.length; i++)
			{
				var caso = linhas[i].split("#")
				var clique = "javascript:document.getElementById(\"enderecows\").value='"+caso[2]+"';document.getElementById('enderecows').value='"+caso[2]+"'"
				ins += "<p class=clique onclick="+clique+" ><b>"+caso[0]+"</b><span style=color:gray ><br>&nbsp;"+caso[1]+"<br>&nbsp;("+caso[3]+")</span>"
				if (caso[4])
				{ins += " <span style=color:gray >(disponibilidade: "+parseInt(caso[4])+"%, dias considerados: "+caso[5]+")</span></p>";}
				else {ins += "</p>"}
			}
		}
		document.getElementById("resultadoRSSws").innerHTML = ins
		document.getElementById("corpo").style.display="none"
		document.getElementById("RSSws").style.display="block"
		aguardeTotal("none");
	}
	if (i3geo_wscliente_RSSws.length > 0)
	{
		aguardeTotal("block");
		var p = g_locaplic+"/classesphp/wscliente.php?funcao=listaRSSws&rss="+i3geo_wscliente_RSSws.join("|")+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"listaRSSws",monta);
	}	
}
/*
Function: i3geo_wscliente_servicoswms

Lista os web services existentes no arquivo definido na variável RSSwms.

A variável RSSwms deve ser definida no arquivo html que inicia o wscliente.

*/
function i3geo_wscliente_servicoswms()
{
	var mostraRetornowmsRSS = function(retorno)
	{
		var linhas = retorno.data.split("|")
		var ins = ""
		if(linhas.length == 1)
		{var ins = "<br><span style=color:red>"+retorno.data+"</span>"}
		else
		{
			for (i=0;i<linhas.length; i++)
			{
				var caso = linhas[i].split("#")
				if (i > 0)
				{
					var clique = "javascript:document.getElementById(\"enderecowms\").value='"+caso[2]+"';document.getElementById('enderecowms').value='"+caso[2]+"'"
					ins += "<p class=clique onclick="+clique+" ><b>"+caso[0]+"</b>&nbsp;"+caso[1]+"&nbsp;("+caso[3]+")"
					if (caso[4])
					{ins += " <span style=color:gray >(disponibilidade: "+parseInt(caso[4])+"%, dias considerados: "+caso[5]+")</span></p>";}
					else {ins += "</p>"}
				}
				else
				{{ins += ""}}
			}
		}
		document.getElementById("resultadoRSSwms").innerHTML = ins
		document.getElementById("corpo").style.display="none"
		document.getElementById("RSSwms").style.display="block"
		aguardeTotal("none");
	}
	if (document.getElementById("RSSwms"))
	{
		if (i3geo_wscliente_RSSwms.length > 0)
		{
			aguardeTotal("block");
			var p = g_locaplic+"/classesphp/wscliente.php?funcao=listaRSSws&rss="+i3geo_wscliente_RSSwms.join("|")+"&g_sid="+g_sid;
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"listaRSSws",mostraRetornowmsRSS);
		}
	}
}
/*
Function: i3geo_wscliente_ativa

Ativa uma opção mostrando o seu respectivo texto.

O conteúdo do div (id) é lido e incluído na div corpo

Parâmetros:

id - id do div com o conteúdo que será ativado
*/
function i3geo_wscliente_ativa(id)
{
	var novo = document.getElementById(id)
	document.getElementById("corpo").innerHTML = novo.innerHTML
}
/*
Function: i3geo_wscliente_getcapabilities

Executa ajax para buscar resultado do getcapabilities.

Parâmetros:

tipo - tipo de chamada WMS|WFS

*/
function i3geo_wscliente_getcapabilities(tipo)
{
	var monta = function (retorno)
	{
		aguardeTotal("none");
		document.getElementById("corpo").innerHTML = "<div class=listaAjuda ><p>"+retorno.data+"</div>"
	}
	if (document.getElementById("enderecowms").value != "")
	{
		aguardeTotal("block");
		var p = g_locaplic+"/classesphp/wscliente.php?funcao=getcapabilities&onlineresource="+document.getElementById("enderecowms").value+"&tipo="+tipo+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities",monta);
	}
	else
	document.getElementById("corpo").innerHTML = "<p>Nenhum serviço foi escolhido.</p>"
}
/*
Function: i3geo_wscliente_listatemas

Busca a lista de temas de um WMS ou WFS
*/
function i3geo_wscliente_listatemas()
{
	var WCservico = document.getElementById('enderecowms').value
	var WCmostraTemas = function(retorno)
	{
		aguardeTotal("none");
		document.cookie = 'i3GeoPHP=; expires=Thu, 2 Aug 2001 20:47:11 UTC; path=/';
		var ins = "<div style='text-align:left'><p>Selecione a camada que ser&aacute; adicionada ao mapa e depois clique em Aplicar.<br></div>"
		ins += '<p><div onclick="i3geo_wscliente_verMapa()" ><input id=botao3 type="button" class=executar value="Aplicar&nbsp;&nbsp;"  /></div>'
		ins += '<br><div style="text-align:left;height:260px;overflow:auto;width:555px;" >'
		document.getElementById("corpo").innerHTML = ins+"<p>"+retorno.data+"</div>"
		YAHOO.example.init = function ()
		{
			function onPushButtonsMarkupReady()
			{new YAHOO.widget.Button("botao3");}
			YAHOO.util.Event.onContentReady("botao3", onPushButtonsMarkupReady);
		}()		
	}
	document.getElementById("RSSws").style.display="none"
	document.getElementById("RSSwms").style.display="none"
	document.getElementById("corpo").style.display="block"
	if(WCservico == "")
	{document.getElementById("corpo").innerHTML = "<p>Nenhum serviço foi escolhido.</p>"}
	aguardeTotal("block");
	var p = g_locaplic+"/classesphp/mapa_controle.php?map_file=''&funcao=temaswms&servico="+WCservico+"&g_sid="+g_sid
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"temaswms",WCmostraTemas);
}
/*
Function: i3geo_wscliente_listafuncoes

Busca a lista de funções de um WS

*/
function i3geo_wscliente_listafuncoes()
{
	var WCmostraFuncoes = function(retorno)
	{
		aguardeTotal("none");
		var ins = "<p>Selecione a fun&ccedil;&atilde;o que ser&aacute; acionada depois clique em Aplicar.<br></div>"
		ins += '<p><div onclick="i3geo_wscliente_selParFuncao()" ><input id=botao4 type="buttom" class=executar value="Aplicar&nbsp;&nbsp;" /></div>'
		ins += '<br><div style="text-align:left;height:260px;overflow:auto;width:555px;" >'
		if(!retorno.data)
		{document.getElementById("corpo").innerHTML="<br><span style=color:red ><b>Erro ao acessar o servi&ccedil;o!</span>";return;}
		var funcs = retorno.data.split("|");
		for (i=0;i<funcs.length; i++)
		{
			var f = funcs[i].split("#")
			ins += "<br><b><input style='cursor:pointer' type=radio name='funcao' onclick=\"i3geo_wscliente_selParFuncao('"+f[0]+"')\" />&nbsp;"+f[0]+"</b>&nbsp;"+f[3]+"<br>"
			ins += "<i>Entrada:</i>"+f[1]
			ins += "<br><i>Sa&iacute;da:</i>"+f[2]+"<br>"
		}
		document.getElementById("corpo").innerHTML = ins+"</div>"
		YAHOO.example.init = function ()
		{
			function onPushButtonsMarkupReady()
			{new YAHOO.widget.Button("botao4");}
			YAHOO.util.Event.onContentReady("botao4", onPushButtonsMarkupReady);
		}()		
		document.getElementById("RSSws").style.display="none"
		document.getElementById("RSSwms").style.display="none"
		document.getElementById("corpo").style.display="block"
	}
	var WCservico = document.getElementById('enderecows').value
	if (WCservico != "")
	{
		aguardeTotal("block");
		var p = g_locaplic+"/classesphp/wscliente.php?funcao=funcoesws&servico="+WCservico+"&g_sid="+g_sid
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"funcoesws",WCmostraFuncoes);
	}
	else
	document.getElementById("corpo").innerHTML = "<p>Nenhum serviço foi escolhido.</p>"
}
/*
Function: i3geo_wscliente_selParFuncao

Lista os parâmetros de uma função para o usuário digitar os valores.

Parâmetros:

funcao - função que será chamada

*/
function i3geo_wscliente_selParFuncao(funcao)
{
	var WCmostraParFuncoes = function (retorno)
	{
		aguardeTotal("none");
		if (retorno.data == ""){i3geo_wscliente_chamadados(retorno.data)}
		else
		{
			var pars = retorno.data.split("|")
			var ins = "<p>Digite os valores dos par&acirc;metros e depois em clique em 'Aplicar'.<br>"
			ins += '<p><input type="button" class=executar value="Aplicar&nbsp;&nbsp;" onclick=i3geo_wscliente_chamadados(\"'+retorno.data+'\") />'
			ins += '<br><div style="text-align:left;height:260px;overflow:auto;width:555px;" >'
			for (i=0;i<pars.length; i++)
			{
				var temp = pars[i].split("#")
				ins+= "<br>"+temp[0]+"&nbsp("+temp[1]+")<input type=text size=20 value='' id=xxx"+temp[0]+" /><br>"
			}
			document.getElementById("corpo").innerHTML = ins+"</div>"
		}
		document.getElementById("RSSws").style.display="none"
		document.getElementById("RSSwms").style.display="none"
		document.getElementById("corpo").style.display="block"
	}
	aguardeTotal("block");
	i3geo_wscliente_funcao = funcao;
	var p = g_locaplic+"/classesphp/wscliente.php?funcao=parfuncoesws&servico="+document.getElementById("enderecows").value+"&funcaows="+funcao+"&g_sid="+g_sid
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"parFuncoesws",WCmostraParFuncoes);
}
/*
Function: i3geo_wscliente_chamadados

Busca os dados de uma função de um serviço

*/
function i3geo_wscliente_chamadados(retorno)
{
	var monta = function (retorno)
	{
		aguardeTotal("none");
		document.getElementById("corpo").innerHTML = "<div style='text-align:left;height:320px;overflow:auto;width:555px;' >"+retorno.data+ "</div>"
		document.getElementById("RSSws").style.display="none"
		document.getElementById("RSSwms").style.display="none"
		document.getElementById("corpo").style.display="block"
	}
	aguardeTotal("block");
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
	var p = g_locaplic+"/classesphp/wscliente.php?funcao=dadosws&servico="+document.getElementById("enderecowms").value+"&funcaows="+i3geo_wscliente_funcao+"&param="+par.join("|")+"&g_sid="+g_sid
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"dadosWS",monta);
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
	i3geo_wscliente_tipo = tipo; //tipo de tema
	i3geo_wscliente_tema = tema; //tema selecionado do ws
	i3geo_wscliente_nometema = nometema; //nome do tema
}
/*
Function: i3geo_wscliente_verMapa

Mostra o mapa

*/
function i3geo_wscliente_verMapa()
{
	var WCservico = document.getElementById("enderecowms").value
	var epsg = document.getElementById("proj").value.split(",")
	var epsg = epsg[0]
	var epsg = epsg.split(":")
	var epsg = epsg[1]
	document.getElementById("corpo").innerHTML = "<div style=text-align:left id=mapa ></div><div style=width:550px;text-align:left id=localizarxy ></div><div style=text-align:left ><iframe width=400 id=desc ></iframe></div>"
	var map = new OpenLayers.Map('mapa');
	var bounds = new OpenLayers.Bounds(-73,5,-27,-34);
	if (i3geo_wscliente_tipo != "estilo")
	{var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",WCservico, {layers: i3geo_wscliente_tema, srs: epsg} );}
	else
	{
		var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",WCservico, {layers: i3geo_wscliente_tema, styles: i3geo_wscliente_nometema, srs: epsg});
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
		var d = i3geo_wscliente_convdmsf(lonlat.lon,lonlat.lat);
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
		url += "&QUERY_LAYERS="+i3geo_wscliente_tema
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
Function: i3geo_wscliente_wsdl

Abre o servico WSDL em uma nova janela

*/
function i3geo_wscliente_wsdl()
{window.open(document.getElementById("enderecows").value)}
/*
Function: i3geo_wscliente_convdmsf

Converte dd em dms.

Parameters:

x - coordenada x.

y - coordenada y.

Returns:

Array com o valor de x [0] e y [1] no formato dd mm ss
*/
function i3geo_wscliente_convdmsf(x,y) //0ms
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
