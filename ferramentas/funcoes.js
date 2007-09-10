/*
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
//
g_sid = window.parent.g_sid;
$i = function(id)
{return document.getElementById(id);}

//eventos das guias
var h = parseInt(window.parent.document.getElementById("wdocai").style.height);
navm = false; // IE
navn = false; // netscape
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
//altera posição da div geral
//if ($i("geral"))
//{if(navm){$i("geral").style.left = "-10px";}}
//verifica se existem guias
reduzAltura = 30
for (i=0;i<7;i++)
{
	if (document.getElementById("guia"+i))
	{reduzAltura = 50}
}
if (navn)
{
	if (document.getElementById("fundo"))
	{
		document.getElementById("fundo").style.width = "100%";
		document.getElementById("fundo").style.height = "100%";
	}
	if (document.getElementById("geral"))
	{
		document.getElementById("geral").style.height = "90%";
		document.getElementById("geral").style.width = "97%";
	}
}
else
{
	if (document.getElementById("fundo"))
	{
		document.getElementById("fundo").style.width = "104%";//document.body.offsetWidth;
		document.getElementById("fundo").style.height = "99%";
	}
	if (document.getElementById("geral"))
	{
		document.getElementById("geral").style.height = "90%";
		document.getElementById("geral").style.width = "100%";//document.body.offsetWidth - 25;
	}
}
for (i=0;i<7;i++)
{
	if (document.getElementById("guia"+i))
	{
		document.getElementById("guia"+i).onmousedown = function()
		{
			for (j=0;j<7;j++)
			{
				if (document.getElementById("guia"+j))
				{
					document.getElementById("guia"+j).style.backgroundColor="rgb(230,230,230)";
					document.getElementById("guia"+j+"obj").style.display="none";
					document.getElementById("guia"+j).style.color="rgb(150,150,150)";
					document.getElementById("guia"+j).style.textDecoration="none";
				}
			}
			this.style.color="orange";
			this.style.backgroundColor="rgb(255,255,255)";
			//this.style.textDecoration="underline"
		}
		document.getElementById("guia"+i).onmouseover = function()
		{this.style.borderTop="2px solid orange";}
		document.getElementById("guia"+i).onmouseout = function()
		{this.style.borderTop="1px solid rgb(230,230,230)";}
	}
}
//abre relogio
function aguarde(tipo)
{
	if (tipo == "block")
	{window.parent.objaguarde.abre("aguardedoc","Aguarde...");}
	if (tipo == "none")
	{window.parent.objaguarde.fecha("aguardedoc","");}
	if (document.getElementById("aguarde"))
	{document.getElementById("aguarde").style.display = "none"}
}
//abre a paleta de cores
function cor(obj)
{window.parent.abreCor("wdocai",obj)}
//mostra uma nova opcao quando o usuário clica em proximo ou anterior.
//É utilizado nos menus de análise
function mostraOpcao(anterior,proxima,texto,idatual)
{
	if (!document.getElementById(idatual))
	{
		var ndiv = document.createElement("div")
		ndiv.id = idatual
		texto += "<br><br><table style='width:100%' ><tr style='width:100%'>"
		if (anterior != "")
		{texto += "<td style='border:0px solid white;text-align:left;cursor:pointer'><img onclick="+anterior+" src=../../imagens/anterior.gif ></td>"}
		if (proxima != "")
		{texto += "<td style='border:0px solid white;text-align:right;cursor:pointer'><img onclick="+proxima+" src=../../imagens/proxima.gif ></td>"}
		//texto += "<br><br><br><br>"
		ndiv.innerHTML = texto+"</tr></table>"
		document.getElementById("resultado").appendChild(ndiv)
	}
	var ids = new Array("t0","t1","t2","t3","t4","t5","t6","t7")
	for (i=0;i<ids.length;i++)
	{
		if (document.getElementById(ids[i]))
		{document.getElementById(ids[i]).style.display="none"}
	}
	document.getElementById(idatual).style.display="block"
}
//monta um combo sim-nao retornando true ou false
function simnao(id)
{
	var combo = "<select name="+id+" id="+id+" >"
    combo+= "<option value=TRUE selected>sim</option>"
	combo += "<option value=FALSE >não</option>"
	combo += "</select>"
	return(combo)
}
//monta um combo sim-nao retornando true ou false
function naosim(id)
{
	var combo = "<select name="+id+" id="+id+" >"
    combo+= "<option value=TRUE >sim</option>"
	combo += "<option value=FALSE selected >não</option>"
	combo += "</select>"
	return(combo)
}
//monta um combo com cores para o R
function combocor(id,def,s)
{
	var combo = "<select name="+id+" id="+id+" >"
	if (def == 0){s = 'selected'}
	combo += '<option value="0" '+s+' >branco</option>'
	s = ""
	combo +='<option value="2">vermelho</option>'
	combo += '<option value="7">amarelo</option>'
	if (def == 1){s = 'selected'}
	combo += '<option value="1" '+s+' >preto</option>'
	combo += '<option value="rgb(1,1,0.8)">bege</option>'
	combo += '<option value="3">verde</option>'
	combo += '<option value="8">cinza</option>'
	combo += '<option value="4">azul</option>'
	combo += '<option value="5">ciano</option>'
	combo += '<option value="6">magenta</option>'
	combo += "</select>"
	return(combo)
}
//
//monta combo com os itens de um unico tema
//
function comboitens(id,tema,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array()
			ins.push("<select  id="+id+" >")
			ins.push("<option value='' >---</option>")
			for (i=0;i<retorno.data.valores.length; i++)
			{
				if (retorno.data.valores[i].tema == tema)
				{ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>")}
			}
			ins.push("</select>")
			eval("funcao(ins.join(''))")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</div>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//
//monta checks com os itens baseado em um tema
//
function checkitensf(tema,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array()
			ins.push("<table class=lista >")
			for (i=0;i<retorno.data.valores.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' name="+retorno.data.valores[i].tema+" type=checkbox id="+retorno.data.valores[i].item+" /></td>")
				ins.push("<td>"+retorno.data.valores[i].item+" - "+retorno.data.valores[i].nome+"</td></tr>")
			}
			ins.push("</table>")
			eval("funcao(ins.join(''))")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</div>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//monta radios com os itens baseado em um tema
function radioitensf(tema,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array()
			ins.push("<table class=lista >")
			for (i=0;i<retorno.data.valores.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' name='itensradio' type=radio id='"+retorno.data.valores[i].item+";"+retorno.data.valores[i].tema+"' /></td>")
				ins.push("<td>"+retorno.data.valores[i].item+" - "+retorno.data.valores[i].nome+"</td></tr>")
			}
			ins.push("</table>")
			eval("funcao(ins.join(''))")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//lista os valores de um item de um tema
function valoresItem(tema,itemTema,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array()
			for (i=0;i<retorno.data[1].registros.length;i++)
			{
				var pares = retorno.data[1].registros[i].valores
				for (j=0;j<pares.length;j++)
				{ins.push(pares[j].valor + "<br>")}
			}
			ins.push("<br>")
			ins.sort
			eval("funcao(ins.join(''))")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call( g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);
}
//lista os valores de um item de um tema e monta um combo
function valoresItemCombo(id,tema,itemTema,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array()
			ins.push("<select  id="+id+" >")
			ins.push("<option value='' >---</option>")
			for (i=0;i<retorno.data[1].registros.length; i++)
			{
				var pares = retorno.data[1].registros[i].valores
				for (j=0;j<pares.length;j++)
				{ins.push("<option value='"+pares[j].valor+"' >"+pares[j].valor+"</option>")}
			}
			ins.push("</select>")
			eval("funcao(ins.join(''))")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call( g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);
}

//
//monta combo com os temas de uma camada
//retorna um combo com id=selCamada
//retorna vazio se for tema unico
//
function comboCamadas(id,tema,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.temas.length > 1)
			{
				var combot = "<select  id="+id+" >"
				combot = combot + "<option value='' >---</option>"
				for (i=0;i<retorno.data.temas.length;i++)
				{
					combot = combot + "<option value="+retorno.data.temas[i]+" >"+retorno.data.nomes[i]+"</option>"
				}
				combot = combot + "</select>"
				eval("funcao(combot)")
			}
			else
			{eval("funcao('')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</div>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//
//monta combo com os temas que possuem seleção
//retorna um combo com id=temasComSel
//
function comboTemasSel(id,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >"
				comboTemas += "<option value=''>----</option>"
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>"}
				comboTemas += "</select>"
				eval("funcao(comboTemas)")
			}
			else
			{eval("funcao('<div class=alerta >Nenhum tema possui sele&ccedil;&atilde;o. Utilize a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de um tema para escolher algum elemento de algum tema.</div>')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</div>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemascomsel","listaTemasComSel",monta);
}
//
//monta combo com os temas que estão ligados
//retorna um combo com id=temasLigados
//
function comboTemasLigados(id,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >"
				comboTemas += "<option value=''>----</option>"
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>"}
				comboTemas += "</select>"
				eval("funcao(comboTemas)")
			}
			else
			{eval("funcao('<div class=alerta >Nenhum tema está ligado.</div>')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemas&opcao=ligados","listaTemas",monta);
}
//
//monta combo com os temas locais
//retorna um combo com id=temasLocais
//
function comboTemasLocais(id,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >"
				comboTemas += "<option value=''>----</option>"
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>"}
				comboTemas += "</select>"
				eval("funcao(comboTemas)")
			}
			else
			{eval("funcao('<div class=alerta >Nenhum tema local dispon&iacute;vel.</div>')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemaslocais","listaTemasLocais",monta);
}
//lista temas do tipo ponto
function comboTemasPt(id,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >"
				comboTemas += "<option value=''>----</option>"
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>"}
				comboTemas += "</select>"
				eval("funcao(comboTemas)")
			}
			else
			{eval("funcao('<div class=alerta >Nenhum tema de pontos dispon&iacute;vel.</div>')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</div>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=ponto","listaTemasTipo",monta);
}
//lista temas do tipo poligonal
function comboTemasPol(id,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >"
				comboTemas += "<option value=''>----</option>"
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>"}
				comboTemas += "</select>"
				eval("funcao(comboTemas)")
			}
			else
			{eval("funcao('<div class=alerta >Nenhum tema de pol&iacute;gonos dispon&iacute;vel.</div>')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono","listaTemasTipo",monta);
}
//lista temas do tipo poligonal
function comboTemasRaster(id,funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >"
				comboTemas += "<option value=''>----</option>"
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>"}
				comboTemas += "</select>"
				eval("funcao(comboTemas)")
			}
			else
			{eval("funcao('<div class=alerta >Nenhum tema raster dispon&iacute;vel.</div>')")}
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=raster","listaTemasTipo",monta);
}
//
//monta checks com os temas poligonais e raster
//
function checkTemasPolRaster(funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array()
			ins.push("<table class=lista >")
			for (i=0;i<retorno.data.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' value="+retorno.data[i].tema+" type=checkbox id="+retorno.data[i].tema+" /></td>")
				ins.push("<td>"+retorno.data[i].nome+"</td></tr>")
			}
			ins.push("</table>")
			eval("funcao(ins.join(''))")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono,raster","listaTemasTipo",monta);
}

//
//monta combo com as fontes truetype disponiveis
//
function comboTrueType(funcao)
{
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var lista = retorno.data.split(",")
			var ins = "<select id=fonte >"
			ins = ins + "<option value='bitmap' >bitmap</option>"
			for (i=0;i<lista.length;i++)
			{ins = ins + "<option value="+lista[i]+" >"+lista[i]+"</option>"}
			ins = ins + "</select>"
			eval("funcao(ins)")
		}
		else
		{eval("funcao('<div class=erro >Ocorreu um erro</erro>')")}
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype","listaTrueType",monta);
}

//remove os acentos de uma frase ou palavra
function removeAcentos(palavra)
{
	var re = /ã|á|à|â/gi
	palavra = palavra.replace(re,"a")
	var re = /é/gi
	palavra = palavra.replace(re,"e")
	var re = /í/gi
	palavra = palavra.replace(re,"i")
	var re = /ó|õ/gi
	palavra = palavra.replace(re,"o")
	var re = /ç/gi
	palavra = palavra.replace(re,"c")
	var re = /ú/gi
	palavra = palavra.replace(re,"u")
	return(palavra)
}
//Troca os acentos de uma frase por entidades html.
function htmlAcentos(palavra)
{
	var re = /ã/gi;
	palavra = palavra.replace(re,"*atilde|");
	var re = /á/gi;
	palavra = palavra.replace(re,"*aacute|");
	var re = /â/gi;
	palavra = palavra.replace(re,"*acirc|");
	var re = /õ/gi;
	palavra = palavra.replace(re,"*otilde|");
	var re = /ó/gi;
	palavra = palavra.replace(re,"*oacute|");
	var re = /ô/gi;
	palavra = palavra.replace(re,"*ocirc|");
	var re = /é/gi;
	palavra = palavra.replace(re,"*eacute|");
	var re = /ê/gi;
	palavra = palavra.replace(re,"*ecirc|");
	var re = /í/gi;
	palavra = palavra.replace(re,"*iacute|");
	var re = /ú/gi;
	palavra = palavra.replace(re,"*uacute|");
	var re = /ç/gi;
	palavra = palavra.replace(re,"*ccedil|");
	var re = /Ã/gi;
	palavra = palavra.replace(re,"*Atilde|");
	var re = /Á/gi;
	palavra = palavra.replace(re,"*Aacute|");
	var re = /Â/gi;
	palavra = palavra.replace(re,"*Acirc|");
	var re = /Õ/gi;
	palavra = palavra.replace(re,"*otilde|");
	var re = /Ó/gi;
	palavra = palavra.replace(re,"*Oacute|");
	var re = /Ô/gi;
	palavra = palavra.replace(re,"*Ocirc|");
	var re = /É/gi;
	palavra = palavra.replace(re,"*Eacute|");
	var re = /Ê/gi;
	palavra = palavra.replace(re,"*Ecirc|");
	var re = /Í/gi;
	palavra = palavra.replace(re,"*Iacute|");
	var re = /Ú/gi;
	palavra = palavra.replace(re,"*Uacute|");
	var re = /Ç/gi;
	palavra = palavra.replace(re,"*Ccedil|");
	return(palavra);
}
//rgb aleatorio
function randomRGB()
{
	var v = Math.random();
	var r = parseInt(255*v);
	var v = Math.random();
	var g = parseInt(255*v);
	var v = Math.random();
	var b = parseInt(255*v);
	return (r+","+g+","+b);		
}
//pega os parametros da url e do mapa e seta variaveis globais
function parametrosURL()
{
	g_locaplic = window.parent.g_locaplic //localizacao da aplicacao
	g_r = window.parent.g_r;
	var temp = (window.location.href).split("tema=")
	if (temp[1])
	{tema = (temp[1].split("&"))[0];}
}
//faz o zoom no mapa para uma extensao
function zoomf(ext)
{
	//faz um zoom na ocorrencia
	window.parent.borra("sim");
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",window.parent.remapaf);
}
//localiza um ponto no mapa no centro de uma extensao
function pinf(ext)
{
	// mostra um ponto vermelho na ocorr&ecirc;ncia
	valores = ext.split(" ");
	vx = (valores[0] * 1) + ((((valores[0] * -1) - (valores[2] * -1)) / 2) * 1)
	vy = (valores[1] * 1) + ((((valores[1] * -1) - (valores[3] * -1)) / 2) * 1)
	window.parent.borra("sim");
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=zoomponto&pin=pin&xy="+ vx + " " + vy
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"zoomPonto",window.parent.ajaxredesenha);
}
function convdmsddf(g,m,s)
{
  cd = $i(g).value
  cm = $i(m).value
  cs = $i(s).value
  var sinal = 'positivo';
  if (cd < 0)
  {
    cd = cd * -1;
    sinal = 'negativo';
  }
  spm = cs / 3600
  mpg = cm / 60
  var dd = (cd * 1) + (mpg * 1) + (spm * 1);
  if (sinal == 'negativo')
  {dd = dd * -1;}
  return dd;
}
function mensagemAjuda(onde,texto)
{
	var ins = "<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;-moz-border-radius:1px;' ><tr><th style='background-color: #cedff2; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 8pt; border: 1px solid #B1CDEB; text-align: left; padding-left: 7px;padding-right: 11px; -moz-border-radius:10px;'>"
	ins += '<div style="float:right"><img src="../../imagens/question.gif" /></div>'
	ins += '<div style="left;">'
	if (texto == "")
	{var texto = $i(onde).innerHTML}
	ins += texto
	ins += '</div></th></tr></table>'
	if (onde != "")
	{$i(onde).innerHTML = ins}
	else
	{return(ins)}
}
function mensagemOpcao(onde,texto)
{
	var ins = "<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;-moz-border-radius:1px;' ><tr><th style='background-color: #cedff2; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 8pt; border: 1px solid #B1CDEB; text-align: left; padding-left: 7px;padding-right: 11px; -moz-border-radius:10px;'>"
	ins += '<div style="float:right"><img src="../../imagens/opcoes.gif" /></div>'
	ins += '<div style="left;">'
	if (texto == "")
	{var texto = $i(onde).innerHTML}
	ins += texto
	ins += '</div></th></tr></table>'
	if (onde != "")
	{$i(onde).innerHTML = ins}
	else
	{return(ins)}
}