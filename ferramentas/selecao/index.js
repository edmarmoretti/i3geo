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

YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
		new YAHOO.widget.Button("botao2");
		new YAHOO.widget.Button("botao3");
		new YAHOO.widget.Button("botao4");
		new YAHOO.widget.Button("botaoGr");
	}
    YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()

//inicializa
mensagemAjuda("men1",$i("men1").innerHTML)
parametrosURL()
aguarde("block")
ativaGuias("")
mostraGuia("guia1")
comboi = ""
tema = ""
//eventos das guias
$i("guia1").onclick = function()
{mostraGuia("guia1");$i("opc1").style.display="block";$i("botoesopc").style.display="block";}
$i("guia2").onclick = function()
{
	mostraGuia("guia2");
	if ($i("comboTemas").value == "")
	{alert("Escolha um tema");}
	$i("opc1").style.display="block";
	$i("botoesopc").style.display="block";
}
$i("guia3").onclick = function()
{
 	mostraGuia("guia3")
	comboTemasSel("comboOverlay",function(retorno)
	{
 		$i("overlay").innerHTML = retorno.dados
	},"overlay")
	$i("opc1").style.display="block";
	$i("botoesopc").style.display="block";
}
$i("guia4").onclick = function()
{
 	mostraGuia("guia4")
 	$i("opc1").style.display="block";
 	$i("botoesopc").style.display="block";
}
$i("guia5").onclick = function()
{
 	mostraGuia("guia5")
	$i("opc1").style.display="none";
	$i("botoesopc").style.display="none";
	if ($i("comboTemas").value == "")
	{alert("Escolha um tema");}
	else
	{
		if(!$i("itemX"))
		{
			comboitens("itemX",$i("comboTemas").value,function(retorno)
			{
	 			$i("lugarComboX").innerHTML = retorno.dados;
			},"lugarComboX")
		}
		if(!$i("itemY"))
		{
			comboitens("itemY",$i("comboTemas").value,function(retorno)
			{
	 			$i("lugarComboY").innerHTML = retorno.dados;
			},"lugarComboY")
		}
		if($i("itemX") && $i("itemY"))
		{atualizaGrafico();}
	}
}

//combo com o tipo de operacao
var combot = "<select  id=tipoOperacao onchange='operacao(this)' >"
combot += "<option value='adiciona' >Adiciona</option>"
combot += "<option value='retira' >Retira</option>"
combot += "<option value='inverte' >Inverte</option>"
combot += "<option value='limpa' >Limpa</option>"
combot += "</select>"
$i("operacao").innerHTML = combot

function mudaicone()
{
	$i("selecaopt").style.border = "1px solid gray"
	$i("selecaoext").style.border = "1px solid gray"
	$i("selecaobox").style.border = "1px solid gray"
	$i("selecaopoli").style.border = "1px solid gray"
}
//botoes de tipo
function tiposel(obj)
{
	window.parent.objmapa.temaAtivo = $i("comboTemas").value;
	$i("parapoli").style.display = "none";
	var fim = function()
	{aguarde("none");window.parent.ajaxredesenha("");}
	if ($i("comboTemas").value == ""){alert("Escolha um tema");return;}
	if (obj.id == "selecaoext")
	{
		if (window.parent.objmapa.scale > 500000)
		{alert("A escala do mapa deve ser pelo menos 1:500.000");return;}
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=selecaoext&tema="+$i("comboTemas").value+"&tipo="+$i("tipoOperacao").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"selecaoEXT",fim);	
	}
	if (obj.id == "selecaobox")
	{
		mudaicone()
		obj.style.border = "1px solid white"
		window.parent.g_tipoacao = "selecaobox";	
	}
	if (obj.id == "selecaopt")
	{
		mudaicone()
		obj.style.border = "1px solid white"
		window.parent.g_tipoacao = "selecao";	
	}
	if (obj.id == "selecaopoli")
	{
		window.parent.richdraw.fecha()
		window.parent.limpacontainerf()
		mudaicone()
		obj.style.border = "1px solid white"
		window.parent.g_tipoacao = "selecaopoli";
		alert("Clique no mapa para desenhar o polígono. Clique duas vezes para parar.")
		//$i("parapoli").style.display = "block";
		window.parent.criaContainerRichdraw();
		window.parent.richdraw.lineColor = "red";
		window.parent.richdraw.lineWidth = "2px";
	}
}

//cria combo com os temas

comboTemasLigados("comboTemas",function(retorno)
{
 	$i("temas").innerHTML = retorno.dados
 	aguarde("none")
 	$i("comboTemas").onchange = function()
	{
	 	$i("lugarComboX").innerHTML = "";
	 	$i("lugarComboY").innerHTML = "";
	 	window.parent.objmapa.temaAtivo = $i("comboTemas").value
		comboitens("selItem",$i("comboTemas").value,function(retorno)
		{
	 		comboi = retorno.dados
			var p = $i("parametros")
			for (i = 0; i < p.childNodes.length;i++)
			{p.removeChild(p.childNodes[i])}
	 		adicionalinha()
		})
		if ($i("comboTemas").value != "")
		{$i("opc3").style.display="block"}
		else
		{
			alert("Selecione um tema");
			$i("opc3").style.display="block"
		}
	}
},"temas")

//adiciona uma linha de parametros
function adicionalinha()
{
	var comboitens = comboi
	//interrogacao abre a lista de valores
	var interrogacao = document.createElement("img")
	interrogacao.src = '../../imagens/interrogacao.gif'
	interrogacao.title='lista'
	interrogacao.style.cursor="pointer"
	interrogacao.onclick = function()
	{
		var itemTema = (this.parentNode.parentNode.getElementsByTagName("select"))[0].value
		if (itemTema == "")
		{
			alert("Selecione um campo")
			return
		}
		aguarde("block")
		valoresItem
		(
			$i("comboTemas").value,
			itemTema,
			function(retorno)
			{
	 			aguarde("none")
				$i("valores").innerHTML = "<br>Valores:<br>"+retorno.dados
			}
			,"valores"
		)	
	}
	var operador = "<select>"
	operador += "<option value=',=,'>igual</option>"
	operador += "<option value=',!=,'>dif</option>"
	operador += "<option value=',<,'>menor</option>"
	operador += "<option value=',>,'>maior</option>"
	operador += "<option value=',<=,'><=</option>"
	operador += "<option value=',>=,'>=</option>"
	operador += "<option value=',in,'>in</option>"
	operador += "<option value=',~=,'>regExp</option></select>"
	var valor = document.createElement("input")
	valor.type = "text"
	valor.value = ""
	valor.size = "20"
	var ntb = document.createElement("tbody")
	var ntr = document.createElement("tr")
	ntb.appendChild(ntr)
	var ntd1 = document.createElement("td")
	ntd1.innerHTML = comboi
	ntr.appendChild(ntd1)
	var ntd2 = document.createElement("td")
	ntd2.innerHTML = operador
	ntr.appendChild(ntd2)
	var ntd3 = document.createElement("td")
	ntd3.appendChild(valor)
	ntr.appendChild(ntd3)
	var ntd4 = document.createElement("td")
	ntd4.appendChild(interrogacao)
	ntr.appendChild(ntd4)
	tabela = $i("parametros")
	tabela.appendChild(ntb)
}
//executa o tipo de operacao selecionada se for o caso
function operacao(tipo)
{
	if ($i("comboTemas").value == ""){alert("Escolha um tema");return;}
	if((tipo.value == "limpa") || (tipo.value == "inverte"))
	{
		aguarde("block")
		var fim = function()
		{aguarde("none");window.parent.ajaxredesenha("")}
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=selecaopt&tema="+$i("comboTemas").value+"&tipo="+tipo.value+"&tolerancia="+$i("toleranciapt").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		window.parent.g_operacao = "selecao"
		cp.call(p,"selecaoPT",fim);
	}
}
//aplica a selecao por atributo
function aplicaselecao()
{
	if ($i("comboTemas").value == ""){alert("Escolha um tema");return;}
	aguarde("block")
	var g = $i("parametros")
	var ipt = g.getElementsByTagName("tr")
	if (ipt.length > 0)
	{
		var filtro = ""
		for (i=0;i<ipt.length; i++)
		{
			var nos = ipt[i].childNodes
			var s = nos[0].getElementsByTagName("select")
			var itemsel = s[0].value
			var s = nos[1].getElementsByTagName("select")
			var operador = s[0].value
			var s = nos[2].getElementsByTagName("input")
			var valor = s[0].value
		}
		var tipo = $i("tipoOperacao").value
		var fim = function()
		{aguarde("none");window.parent.ajaxredesenha("")}
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=selecaoatrib&tipo="+tipo+"&tema="+$i("comboTemas").value+"&valor="+valor+"&operador="+operador+"&item="+itemsel
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		window.parent.g_operacao = "selecao"
		cp.call(p,"selecaoAtributos",fim);
	}
}
//aplica a selecao por tema
function aplicaselecaoTema()
{
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=selecaotema&temao="+$i("comboOverlay").value+"&tema="+$i("comboTemas").value+"&tipo="+$i("tipoOperacao").value
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	window.parent.g_operacao = "selecao"
	cp.call(p,"selecaoTema",mostraSelecaoTema);
}
//mostra a seleção por tema
function mostraSelecaoTema(retorno)
{
 	aguarde("none")
 	if (retorno.data == "ok")
	{window.parent.remapaf()}
	else
	{alert(retorno.data)}
}
//cria um novo tema
function criatemaf()
{
	if ($i("comboTemas").value == "")
	{alert("Escolha um tema!");}
	else
	{
		aguarde("block")
		var fim = function()
		{aguarde("none");window.parent.ajaxredesenha("")}
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=criatemasel&tema="+$i("comboTemas").value+"&nome=Novo tema "+$i("comboTemas").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"selecao2tema",fim);
	}
}
function concluidof()
{
	window.parent.remapaf()
	aguarde("none")
}
function concluipoligono()
{
	$i("parapoli").style.display = "none";
	tiposel($i("selecaopt"))
	var pontos = window.parent.pontosdistobj;
	window.parent.richdraw.fecha()
	var n = pontos.xpt.length;
	if (n > 2)
	{
		aguarde("block")
		var xs = pontos.xpt.toString(",")
		var ys = pontos.ypt.toString(",")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=selecaoPoli"
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p,"selecaoPoli",concluidof,xs,ys,$i("comboTemas").value,$i("tipoOperacao").value);
	}
	else
	{alert("Sao necessarios pelo menos tres pontos");}
}
function atualizaGrafico()
{
	var monta = function(retorno)
	{
		$i("lugarGrafico").innerHTML = "<canvas id='canvasTest' width='350' height='180' style='border: 1px solid #eee;'></canvas>"
		var dados = retorno.data.dados;
		var values = new Array();
		var labels = new Array();
		for (i=1;i<dados.length; i++)
		{
			var celula = dados[i].split(";");
			values.push(eval("["+i+","+celula[1]+"]"));
			var temp = '{v:'+(i)+',label:'+'"'+celula[0]+'"}';
			labels.push(temp);
		}
		var options = {
			"colorScheme": "",
			"padding": {left: 2, right: 2, top: 5, bottom: 2},
			"xTicks": eval("["+labels+"]")
		};
		layout = new Layout("bar", options);
		renderer = new SweetCanvasRenderer($('canvasTest'), layout, options);
		var chartStyle = "bar"; //document.forms["options"].chartStyle[chartStyleSelected].value;
		var colorScheme = "Blue"; //document.forms["options"].colorScheme[colorSchemeSelected].value;
		// setup layout options
		var themeName = "office" + $i("colorScheme").value;
		var theme = PlotKit.Base[themeName]();
		MochiKit.Base.update(options, theme);        
		layout.style = $i("chartStyle").value;
		MochiKit.Base.update(layout.options, options);
		MochiKit.Base.update(renderer.options, options);
		layout.addDataset("data", values);  
		layout.evaluate();
		renderer.clear();
		renderer.render();
	}
	if($i("itemX").value == "" || $i("itemY").value == "")
	{alert("Escolha as colunas primeiro");}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficoSelecao&tema="+$i("comboTemas").value+"&itemclasses="+$i("itemX").value+"&itemvalores="+$i("itemY").value
	var cp = new cpaint();
	cp.set_response_type("JSON");
	cp.call(p,"graficoSelecao",monta);
}
