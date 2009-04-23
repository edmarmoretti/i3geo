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
g_sid = "";
try{g_sid = window.parent.i3GEO.configura.sid;}
catch(e){}
$i = function(id)
{return document.getElementById(id);}
cabecalhojanela = ""; 
//eventos das guias
var h = 0;
if(window.parent.document.getElementById("wdocai"))
{var h = parseInt(window.parent.document.getElementById("wdocai").style.height);}
navm = false; // IE
navn = false; // netscape
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
if (!$i("mascaraaguarde"))
{
	if (navm){var s = "filter:'alpha(opacity=20)'";}
	if (navn){var s = "opacity:.2";}
	var ins = "<div id=mascaraaguarde style=color:red;display:none;position:absolute;top:0px;left:0px;width:120%;height:"+h+"px;background-color:gray;border-size:0px;z-index:6000;"+s+" >";
	ins += "&nbsp;</div>";
	document.body.innerHTML += ins 
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
		document.getElementById("fundo").style.width = "104%";
		document.getElementById("fundo").style.height = "99%";
	}
	if (document.getElementById("geral"))
	{
		document.getElementById("geral").style.height = "95%";
		document.getElementById("geral").style.width = "100%";
	}
}
document.body.style.backgroundColor="#F0F0F0";

$tradAjuda = function(tipo,id){
	eval("var t = g_traducao_ajuda."+tipo);
	eval("var texto = t[id]."+window.parent.i3GEO.idioma.ATUAL);
	return (texto);
};

//abre relogio
function aguarde(tipo)
{
	if (tipo == "block")
	{
		$i("mascaraaguarde").style.display = "block";
	}
	if (tipo == "none")
	{
		if ($i("mascaraaguarde"))
		{$i("mascaraaguarde").style.display="none";}
	}
	if (document.getElementById("aguarde"))
	{document.getElementById("aguarde").style.display = "none";}
}
//monta um bloqueio da tela toda
function aguardeTotal(tipo)
{
	var w = parseInt(screen.availWidth);
	var h = parseInt(screen.availHeight);
	if (!document.getElementById("aguardeTotal"))
	{
		var novoel = document.createElement("div");
		novoel.style.width = w+"px";
		novoel.style.height = h+"px";
		novoel.id = "aguardeTotal";
		novoel.display = "none";
		novoel.style.zIndex=10000;
		novoel.style.position = "absolute";
		novoel.style.top = 0;
		novoel.style.left = 0;
		novoel.style.backgroundColor="gray";
		if(navn)
		{novoel.style.opacity = 0.45;}
		else
		{novoel.style.filter='alpha(opacity=45)';}
		if(!g_locaplic)
		{g_locaplic = "..";}
		var i = "<div id=aguardeTotal1 style='display:none;padding:5px;border:1px solid black;text-align:center;background-color:white;position:absolute;z-index:10001;left:"+w/2+"px;top:"+((h/2)-200)+"px;'><img src='"+g_locaplic+"/imagens/aguarde.gif' /><span style=color:red >&nbsp;<b>Aguarde...</b></span></div>";
		document.body.appendChild(novoel);
		document.body.innerHTML+=i;
	}
	document.getElementById("aguardeTotal").style.display=tipo;
	document.getElementById("aguardeTotal1").style.display=tipo;
}
//abre a paleta de cores
function cor(obj)
{window.parent.i3GEO.util.abreCor("wdocai",obj);}
//mostra uma nova opcao quando o usuário clica em proximo ou anterior.
//É utilizado nos menus de análise
function mostraOpcao(anterior,proxima,texto,idatual)
{
	if(document.getElementById(idatual)){document.getElementById("resultado").removeChild(document.getElementById(idatual))}
	if (!document.getElementById(idatual))
	{
		var ndiv = document.createElement("div");
		ndiv.id = idatual;
		texto += "<br><br><table style='width:100%;background-color:#F2F2F2;' ><tr style='width:100%'>";
		if (anterior != "")
		{texto += "<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:#F2F2F2;'><img onclick='"+anterior+"' src=../../imagens/anterior.gif ></td>";}
		if (proxima != "")
		{texto += "<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:#F2F2F2;'><img onclick='javascript:this.src=\"../../imagens/aguarde.gif\";"+proxima+"' src=../../imagens/proxima.gif ></td>";}
		ndiv.innerHTML = texto+"</tr></table>";
		document.getElementById("resultado").appendChild(ndiv);
	}
	var ids = new Array("t0","t1","t2","t3","t4","t5","t6","t7");
	for (i=0;i<ids.length;i++)
	{
		if (document.getElementById(ids[i]))
		{document.getElementById(ids[i]).style.display="none";}
	}
	document.getElementById(idatual).style.display="block";
}
//monta um combo sim-nao retornando true ou false
function simnao(id)
{
	var combo = "<select name="+id+" id="+id+" >";
    combo+= "<option value=TRUE selected>sim</option>";
	combo += "<option value=FALSE >não</option>";
	combo += "</select>";
	return(combo);
}
//monta um combo sim-nao retornando true ou false
function naosim(id)
{
	var combo = "<select name="+id+" id="+id+" >";
    combo+= "<option value=TRUE >sim</option>";
	combo += "<option value=FALSE selected >não</option>";
	combo += "</select>";
	return(combo);
}
//monta um combo com cores para o R
function combocor(id,def,s)
{
	var combo = "<select name="+id+" id="+id+" >";
	if (def == 0){s = 'selected';}
	combo += '<option value="0" '+s+' >branco</option>';
	s = "";
	combo +='<option value="2">vermelho</option>';
	combo += '<option value="7">amarelo</option>';
	if (def == 1){s = 'selected'};
	combo += '<option value="1" '+s+' >preto</option>';
	combo += '<option value="rgb(1,1,0.8)">bege</option>';
	combo += '<option value="3">verde</option>';
	combo += '<option value="8">cinza</option>';
	combo += '<option value="4">azul</option>';
	combo += '<option value="5">ciano</option>';
	combo += '<option value="6">magenta</option>';
	combo += "</select>";
	return(combo);
}
//
//monta combo com os itens de um unico tema
//
function comboitens(id,tema,funcao,onde,nome)
{
	if (arguments.length > 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>";
	if (arguments.length != 5)
	{nome = "";}

	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<select  id='"+id+"' name='"+nome+"'>");
			ins.push("<option value='' >---</option>");
			for (i=0;i<retorno.data.valores.length; i++)
			{
				if (retorno.data.valores[i].tema == tema)
				{ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>");}
			}
			ins.push("</select>");
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{
			var temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};
		}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//
//monta checks com os itens baseado em um tema
//
function checkitensf(tema,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<table class=lista >");
			for (i=0;i<retorno.data.valores.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"' /></td>");
				ins.push("<td>"+retorno.data.valores[i].item+" - "+retorno.data.valores[i].nome+"</td></tr>");
			}
			ins.push("</table>");
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{
			var temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};
		}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//
//monta checks com os itens baseado em um tema com os nomes em um input editável
//
function checkitenseditaveis(tema,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<table class=lista >");
			for (i=0;i<retorno.data.valores.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"' /></td>");
				ins.push("<td><input id='"+retorno.data.valores[i].item+retorno.data.valores[i].tema+"' type=text size=25 value='"+retorno.data.valores[i].item+" - "+retorno.data.valores[i].nome+"' /></td></tr>");
			}
			ins.push("</table>");
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{
			var temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};
		}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}

//monta radios com os itens baseado em um tema
function radioitensf(tema,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<table class=lista >");
			for (i=0;i<retorno.data.valores.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' name='itensradio' type=radio id='"+retorno.data.valores[i].item+";"+retorno.data.valores[i].tema+"' /></td>");
				ins.push("<td>"+retorno.data.valores[i].item+" - "+retorno.data.valores[i].nome+"</td></tr>");
			}
			ins.push("</table>");
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);
}
//lista os valores de um item de um tema
function valoresItem(tema,itemTema,funcao,onde)
{
	if (arguments.length == 4)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando valores...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			for (i=0;i<retorno.data[1].registros.length;i++)
			{
				var pares = retorno.data[1].registros[i].valores;
				for (j=0;j<pares.length;j++)
				{ins.push(pares[j].valor + "<br>");}
			}
			ins.push("<br>");
			ins.sort;
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call( g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);
}
//lista os valores de um item de um tema e monta um combo
function valoresItemCombo(id,tema,itemTema,funcao,onde)
{
	if (arguments.length == 5)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando valores...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<select  id="+id+" >");
			ins.push("<option value='' >---</option>");
			for (i=0;i<retorno.data[1].registros.length; i++)
			{
				var pares = retorno.data[1].registros[i].valores;
				for (j=0;j<pares.length;j++)
				{ins.push("<option value='"+pares[j].valor+"' >"+pares[j].valor+"</option>");}
			}
			ins.push("</select>");
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
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
function comboCamadas(id,tema,funcao,onde)
{
	if (arguments.length == 4)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.temas.length > 1)
			{
				var combot = "<select  id="+id+" >";
				combot = combot + "<option value='' >---</option>";
				for (i=0;i<retorno.data.temas.length;i++)
				{
					combot = combot + "<option value="+retorno.data.temas[i]+" >"+retorno.data.nomes[i]+"</option>";
				}
				combot = combot + "</select>";
				var temp = {dados:combot,tipo:"dados"};
			}
			else
			{var temp = {dados:"",tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
		eval("funcao(temp)");
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
function comboTemasSel(id,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
	eval("funcao('<div style=color:red;font-size:10px; >Aguarde...</div>')");
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >";
				comboTemas += "<option value=''>----</option>";
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
				comboTemas += "</select>";
				var temp = {dados:comboTemas,tipo:"dados"};
			}
			else
			{var temp = {dados:'<div class=alerta >Nenhum tema possui sele&ccedil;&atilde;o. Utilize a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de um tema para escolher algum elemento de algum tema.</div>',tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
		eval("funcao(temp)");
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
function comboTemasLigados(id,funcao,onde,nome,multiplo)
{
	if (arguments.length > 2)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
	if (arguments.length == 3)
	{nome = "";}
	if (arguments.length < 5)
	{multiplo = false;}
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				if(multiplo)
				comboTemas = "<select id='"+id+"' size='4' multiple='multiple' name='"+nome+"'>";
				else
				comboTemas = "<select id='"+id+"' name='"+nome+"'>";
				comboTemas += "<option value=''>----</option>";
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
				comboTemas += "</select>";
				var temp = {dados:comboTemas,tipo:"dados"};
			}
			else
			{var temp = {dados:'<div class=alerta >Nenhum tema está ligado.</div>',tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
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
function comboTemasLocais(id,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas locais...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >";
				comboTemas += "<option value=''>----</option>";
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
				comboTemas += "</select>";
				var temp = {dados:comboTemas,tipo:"dados"};
			}
			else
			{var temp = {dados:'<div class=alerta >Nenhum tema local dispon&iacute;vel.</div>',tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemaslocais","listaTemasLocais",monta);
}
//lista temas do tipo ponto
function comboTemasPt(id,funcao,onde,selecao)
{
	if (arguments.length == 3)
	{
		$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
		var selecao = "nao";
	}
	if (arguments.length == 2)
	{var selecao = "nao";}
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >";
				comboTemas += "<option value=''>----</option>";
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
				comboTemas += "</select>";
				var temp = {dados:comboTemas,tipo:"dados"};
			}
			else
			{var temp = {dados:'<div class=alerta >Nenhum tema de pontos dispon&iacute;vel.</div>',tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=ponto&selecao="+selecao,"listaTemasTipo",monta);
}
//lista temas do tipo poligonal
function comboTemasPol(id,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >";
				comboTemas += "<option value=''>----</option>";
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
				comboTemas += "</select>";
				var temp = {dados:comboTemas,tipo:"dados"};
			}
			else
			{var temp = {dados:'<div class=alerta >Nenhum tema de pol&iacute;gonos dispon&iacute;vel.</div>',tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono","listaTemasTipo",monta);
}
//lista temas do tipo poligonal
function comboTemasRaster(id,funcao,onde)
{
	if (arguments.length == 3)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			if (retorno.data.length > 0)
			{
				comboTemas = "<select id="+id+" >";
				comboTemas += "<option value=''>----</option>";
				for (i=0;i<retorno.data.length;i++)
				{comboTemas += "<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
				comboTemas += "</select>";
				var temp = {dados:comboTemas,tipo:"dados"};
			}
			else
			{var temp = {dados:'<div class=alerta >Nenhum tema raster dispon&iacute;vel.</div>',tipo:"mensagem"};}
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=raster","listaTemasTipo",monta);
}
//
//monta checks com os temas poligonais e raster
//
function checkTemasPolRaster(funcao,onde)
{
	if (arguments.length == 2)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<table class=lista >");
			for (i=0;i<retorno.data.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' value="+retorno.data[i].tema+" type=checkbox id="+retorno.data[i].tema+" /></td>");
				ins.push("<td>"+retorno.data[i].nome+"</td></tr>");
			}
			ins.push("</table>");
			var ins = ins.join('');
			var temp ={dados:ins,tipo:"dados"};
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono,raster","listaTemasTipo",monta);
}

//
//monta combo com as fontes truetype disponiveis
//
function comboTrueType(funcao,onde)
{
	if (arguments.length == 2)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando fontes...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var lista = retorno.data.split(",");
			var ins = "<select id=fonte >";
			ins = ins + "<option value='bitmap' >bitmap</option>";
			for (i=0;i<lista.length;i++)
			{ins = ins + "<option value="+lista[i]+" >"+lista[i]+"</option>";}
			ins = ins + "</select>";
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype","listaTrueType",monta);
}
//monta radios com a lista de codigos epsg
function radioepsg(funcao,onde)
{
	if (arguments.length == 2)
	$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando...</span>";
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var ins = new Array();
			ins.push("<table class=lista >");
			ins.push("<tr><td><input size=2 style='cursor:pointer' name='epsg' type=radio checked value='' /></td>");
			ins.push("<td>"+retorno.data[0].nome+"</td></tr>");
			for (i=1;i<retorno.data.length; i++)
			{
				ins.push("<tr><td><input size=2 style='cursor:pointer' name='epsg' type=radio value='"+retorno.data[i].codigo+"' /></td>");
				ins.push("<td>"+retorno.data[i].nome+"</td></tr>");
			}
			ins.push("</table>");
			var ins = ins.join('');
			var temp = {dados:ins,tipo:"dados"};
		}
		else
		{var temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
		eval("funcao(temp)");
	}
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaEpsg","listaEpsg",monta);
}

//remove os acentos de uma frase ou palavra
function removeAcentos(palavra)
{
	var re = /ã|á|à|â/gi;
	palavra = palavra.replace(re,"a");
	var re = /é/gi;
	palavra = palavra.replace(re,"e");
	var re = /í/gi;
	palavra = palavra.replace(re,"i");
	var re = /ó|õ/gi;
	palavra = palavra.replace(re,"o");
	var re = /ç/gi;
	palavra = palavra.replace(re,"c");
	var re = /ú/gi;
	palavra = palavra.replace(re,"u");
	return(palavra);
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
	g_locaplic = window.parent.i3GEO.configura.locaplic; //localizacao da aplicacao
	g_r = window.parent.i3GEO.parametros.r;
	var temp = (window.location.href).split("tema=");
	if (temp[1])
	{tema = (temp[1].split("&"))[0];}
}
//faz o zoom no mapa para uma extensao
function zoomf(ext)
{
	window.parent.objaguarde.abre("i3GEO.atualiza",window.parent.$trad("o1"));
	//faz um zoom na ocorrencia
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",window.parent.remapaf);
}
//localiza um ponto no mapa no centro de uma extensao
function pinf(ext)
{
	window.parent.objaguarde.abre("i3GEO.atualiza",window.parent.$trad("o1"));
	// mostra um ponto vermelho na ocorr&ecirc;ncia
	valores = ext.split(" ");
	vx = (valores[0] * 1) + ((((valores[0] * -1) - (valores[2] * -1)) / 2) * 1);
	vy = (valores[1] * 1) + ((((valores[1] * -1) - (valores[3] * -1)) / 2) * 1);
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=zoomponto&pin=pin&xy="+ vx + " " + vy;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"zoomPonto",window.parent.i3GEO.atualiza);
}
function convdmsddf(g,m,s)
{
  cd = $i(g).value;
  cm = $i(m).value;
  cs = $i(s).value;
  var sinal = 'positivo';
  if (cd < 0)
  {
    cd = cd * -1;
    sinal = 'negativo';
  }
  spm = cs / 3600;
  mpg = cm / 60;
  var dd = (cd * 1) + (mpg * 1) + (spm * 1);
  if (sinal == 'negativo')
  {dd = dd * -1;}
  return dd;
}
function mensagemAjuda(onde,texto)
{
	var ins = "<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 8pt; border: 1px solid #B1CDEB; text-align: left; padding-left: 7px;padding-right: 11px;'>";
	ins += '<div style="float:right"><img src="../../imagens/question.gif" /></div>';
	ins += '<div style="left;">';
	if (texto == "")
	{var texto = $i(onde).innerHTML;}
	ins += texto;
	ins += '</div></th></tr></table>';
	if (onde != "")
	{$i(onde).innerHTML = ins;}
	else
	{return(ins);}
}
function mensagemOpcao(onde,texto)
{
	var ins = "<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 8pt; border: 1px solid #B1CDEB; text-align: left; padding-left: 7px;padding-right: 11px;'>";
	ins += '<div style="float:right"><img src="../../imagens/opcoes.gif" /></div>';
	ins += '<div style="left;">';
	if (texto == "")
	{var texto = $i(onde).innerHTML;}
	ins += texto;
	ins += '</div></th></tr></table>';
	if (onde != "")
	{$i(onde).innerHTML = ins;}
	else
	{return(ins);}
}
function ativaGuias()
{
	//ajusta as guias da versão antiga do YUI
	//pega o elemento onde estão os tabs
	for(g=0;g<12;g++)
	{
		if ($i("guia"+g))
		var gpai = $i("guia"+g).parentNode;
	}
	gpai.id = "guiasYUI";
	gpai.className = "yui-navset";
	var ins = '<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
	for(g=0;g<12;g++)
	{
		if ($i("guia"+g))
		ins += '<li><a href="#"><em><div id=guia'+g+' style=text-align:center;font-size:10px;left:0px; >'+$i("guia"+g).innerHTML+'</div></em></a></li>';
	}
	ins += "</ul>";
	gpai.innerHTML = ins;
}
function mostraGuia(guia)
{
	for(g=0;g<12;g++)
	{
		if ($i("guia"+g+"obj"))
		$i("guia"+g+"obj").style.display="none";
	}
	if ($i(guia+"obj"))
	{$i(guia+"obj").style.display="block";}
}
/*
Function: protocolo

Retorna o protocolo utilizado na url.
*/
function protocolo()
{
	var u = window.location.href;
	var u = u.split(":");
	return (u[0]);
}