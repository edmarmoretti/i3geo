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
//inicializa
parametrosURL()
comboi = ""
tema = ""
aguarde("block")
ativaGuias("")
mostraGuia("guia1")
//eventos das guias
$i("guia1").onclick = function()
{mostraGuia("guia1")}
$i("guia2").onclick = function()
{mostraGuia("guia2");listageometrias();}
$i("guia3").onclick = function()
{mostraGuia("guia3");}

mensagemAjuda("men1",$i("men1").innerHTML)
mensagemAjuda("men2","")
mensagemAjuda("men3","")

//combo com o tipo de operacao
var combot = "<select  id=tipoOperacao onchange='operacao(this)' >"
combot += "<option value='adiciona' >Adiciona</option>"
combot += "<option value='retira' >Retira</option>"
combot += "<option value='inverte' >Inverte</option>"
combot += "<option value='limpa' >Limpa</option>"
combot += "</select>"
$i("operacao").innerHTML = combot
//cria combo com os temas
comboTemasLigados("comboTemas",function(retorno)
{
	$i("temas").innerHTML = retorno.dados
	aguarde("none")
	$i("comboTemas").onchange = function()
	{window.parent.objmapa.temaAtivo = $i("comboTemas").value}
},"temas")

YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
		new YAHOO.widget.Button("botao2");
		new YAHOO.widget.Button("botao3");
		new YAHOO.widget.Button("botaof1");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()

//executa o tipo de operacao selecionada se for o caso
function operacao(tipo)
{
	if((tipo.value == "limpa") || (tipo.value == "inverte"))
	{
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=selecaopt&tema="+$i("comboTemas").value+"&tipo="+tipo.value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		window.parent.g_operacao = "selecao"
		window.parent.borra("sim");
		cp.call(p,"selecaoPT",window.parent.ajaxredesenha);
	}
}
//captura as geometrias selecionadas e grava em arquivos
function capturageo()
{
	var nome=window.prompt("Nome que sera dado a geometria:")
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=capturageometrias&tema="+$i("comboTemas").value+"&nome="+nome
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"capturageo",listageometrias);
}
//lista as geometrias capturadas
function listageometrias()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listageometrias"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listageometrias",montalistageometrias);
}
//monta a lista de geometrias
function montalistageometrias(retorno)
{
	if(retorno.data != "")
	{
		var ins = "<div onclick='excluirgeo()' style=top:0px; ><br><input id=botao4 type=button size=20  value='Excluir marcados' \></div>"
		ins += "<div onclick='incmapa()' style=position:absolute;top:14px;left:140px ><input id=botao5 type=button size=20  value='Ver no mapa' \></div><br>"
		var cor = "rgb(245,245,245)"
		for (i=0;i<retorno.data.length; i++)
		{
			ins += "<table width=700 ><tr style=background-color:"+cor+" >"
			ins += "<td width=5 ><input type=checkbox id="+retorno.data[i].arquivo+" style=cursor:pointer \></td>"
			ins += "<td width=55 >"+retorno.data[i].layer+" "+retorno.data[i].arquivo+"</td>"
			ins += "<td><table>"
			var temp = retorno.data[i].dados
			for (j=0;j<temp.length; j++)
			{
				ins += "<tr><td>"+temp[j].id+"</td><td style=text-align:left >"
				if (temp[j].imagem != "")
				{ins += "<img src='"+temp[j].imagem+"' />"}
				for (k=0;k<temp[j].valores.length; k++)
				{
					ins += temp[j].valores[k].item+" = "+temp[j].valores[k].valor+"<br>"
					
				}
				ins += "</td></tr>"
			}
			ins += "</table></td>"
			ins += "</tr></table>"
			if (cor == "rgb(245,245,245)"){cor = "rgb(255,255,255)"}
			else {cor = "rgb(245,245,245)"}
		}
		$i("listadegeometrias").innerHTML = ins
		YAHOO.example.init = function ()
		{
			function onPushButtonsMarkupReady()
			{
				new YAHOO.widget.Button("botao4");
				new YAHOO.widget.Button("botao5");
			}
   			YAHOO.util.Event.onContentReady("botao5", onPushButtonsMarkupReady);
		}()
	}
	aguarde("none")
}
function pegaMarcados()
{
	var inputs = $i("listadegeometrias").getElementsByTagName("input")
	var listai = new Array;
	for (i=0;i<inputs.length; i++)
	{
		if (inputs[i].checked == true)
		{listai.push(inputs[i].id);}
	}
	return (listai.join(","))
}
function incmapa()
{
	var lista = pegaMarcados()
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=incmapageometrias&lista="+lista
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"incmapageometrias",window.parent.remapaf());
}
function excluirgeo()
{
	aguarde("block")
	var lista = pegaMarcados()
	$i("listadegeometrias").innerHTML = ""
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=removergeometrias&lista="+lista
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"removergeometrias",listageometrias);
}
function calculo()
{
	operacao = $i("calculos").value
	if (operacao != "")
	{
		aguarde("block")
		var lista = pegaMarcados()
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=calculaGeometrias&operacao="+operacao+"&lista="+lista
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"analisaGeometrias",concluidof);
	}
}
function funcoes()
{
	operacao = $i("funcoes").value
	if (operacao != "")
	{
		aguarde("block")
		var lista = pegaMarcados()
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=funcoesGeometrias&operacao="+operacao+"&lista="+lista
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"funcoesGeometrias",concluidof);
	}
}
function funcoes1()
{
	var lista = pegaMarcados();
	if(window.confirm("Essa operação funciona apenas se houver uma geometria. Continua?"))
	{
		operacao = $i("funcoes1").value
		if (operacao != "")
		{
			aguarde("block")
			var lista = pegaMarcados()
			var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=funcoesGeometrias&operacao="+operacao+"&lista="+lista
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"funcoesGeometrias",concluidof);
		}
	}
}
function concluidof()
{
	aguarde("none")
}