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
listaitens = "" //guarda a lista de temas e itens
comboDeItens = ""
//combo com as camadas
comboCamadas("selCamada",tema,function(retorno)
	{
	 	if (retorno == "") //tema unico
	 	{montaComboItens()}
	 	else
	 	{
			$i("combot").innerHTML = "<div class=alerta >O tema escolhido &eacute; composto por mais de uma camada de dados. Selecione uma das camadas para filtrar:</div><br>"+retorno
			$i("selCamada").onchange = function()
			{
			 	tema = $i("selCamada").value
				$i("par").innerHTML =  "<table id=parametros ><tr><td>&nbsp;</td><td>&nbsp;</td><td style=background-color:yellow >Item</td><td style=background-color:yellow >Operador</td><td style=background-color:yellow >Valor</td><td style=background-color:yellow >Conector</td></tr></table>"
				montaComboItens()
			}
	 	}
	}
)
mensagemAjuda("men1",$i("men1").innerHTML)
//guias
$i("guia1").onclick = function()
{$i("guia1obj").style.display="block";}
$i("guia2").onclick = function()
{
	aguarde("block")
	$i("guia2obj").style.display="block";
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=pegafiltro&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"pegaFiltro",pegafiltrof);
}
$i("guia3").onclick = function()
{$i("guia3obj").style.display="block";aplicaFiltro("sim")}
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
		new YAHOO.widget.Button("botao2");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()	
function aplicaFiltro(testa)
{
	if( ($i("filtro").value != "") &&($i("guia2obj").style.display=="block"))
	{
		filtro = $i("filtro").value
		var re = new RegExp("'","g")
		filtro = filtro.replace(re,"|")
		//var re = new RegExp("((","g")
		filtro = filtro.replace(re,"")
		//var re = new RegExp("))","g")
		filtro = filtro.replace(re,"")		
	}
	else
	{
		var g = $i("parametros")
		var ipt = g.getElementsByTagName("tr")
		if (ipt.length > 1)
		{
			aguarde("block")
			var filtro = ""
			for (i=1;i<ipt.length; i++)
			{
				var nos = ipt[i].childNodes
				var s = nos[2].getElementsByTagName("select")
				var itemsel = s[0].value
				var s = nos[3].getElementsByTagName("select")
				var operador = s[0].value
				var s = nos[4].getElementsByTagName("input")
				var valor = s[0].value
				if ((valor == "") && ($i("cbitens")))
				{
				 	valor = $i("cbitens").value
				 	s[0].value = $i("cbitens").value
				}
				var s = nos[5].getElementsByTagName("select")
				var conector = s[0].value
				// para verificar se e numerico use "a"*1 != NaN
				if (valor*1)
				{filtro = filtro + "(["+itemsel+"] "+operador+" "+valor+")"}
				else
				{filtro = filtro + "(|["+itemsel+"]| "+operador+" |"+valor+"|)"}
				if ((i + 1) != ipt.length) //tem conector
				{filtro = filtro + conector}
				else
				{filtro = "("+filtro+")"}
			}
		}
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=inserefiltro&tema="+tema+"&filtro="+filtro+"&testa="+testa
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	aguarde("none");
	window.parent.g_operacao = "outras"
	if (testa == "sim")
	{
	 	var monta = function(retorno){$i("teste").innerHTML = "<img src="+retorno.data+" />"}
		cp.call(p,"insereFiltro",monta);
	}
	else
	{cp.call(p,"insereFiltro",window.parent.ajaxredesenha);}
}
$i("limpar").onclick = function()
{
	aguarde("block")
	var filtro = ""
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=inserefiltro&tema="+tema+"&filtro="+filtro
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	aguarde("none");
	window.parent.g_operacao = "outras"
	cp.call(p,"insereFiltro",window.parent.ajaxredesenha);
}
//cria o combo com os itens
function montaComboItens()
{
	$i("par").style.display="block"
	comboitens("selItem",tema,function(retorno)
	{
	 	comboDeItens = retorno
	 	adicionalinha()
	}
	)	
}
//adiciona uma linha de parametros
function adicionalinha()
{
	aguarde("block")
	var add = document.createElement("img")
	add.src = '../../imagens/plus.gif'
	add.style.cursor="pointer"
	add.onclick = function()
	{adicionalinha()}
	//xis exclui a linha
	var xis = document.createElement("img")
	xis.src = '../../imagens/x.gif'
	xis.style.cursor="pointer"
	xis.onclick = function()
	{
		var p = this.parentNode.parentNode.parentNode
		for (i = 0; i < p.childNodes.length;i++)
		{p.removeChild(p.childNodes[i])}
	}
	//interrogacao abre a lista de valores
	var interrogacao = document.createElement("img")
	interrogacao.src = '../../imagens/interrogacao.gif'
	interrogacao.title='mostra valores'
	interrogacao.style.cursor="pointer"
	interrogacao.onclick = function()
	{
		aguarde("block")
		obj = (this.parentNode.getElementsByTagName("input"))[0]
		var itemTema = (this.parentNode.parentNode.getElementsByTagName("select"))[0].value
		valoresItemCombo("cbitens",tema,itemTema,function(retorno)
		{
	 		aguarde("none")
			$i("valores").innerHTML = "<br>Escolha o valor:"+retorno
			$i("cbitens").onchange = function()
			{
				obj.value = this.value
			}		
		}
		)	
	}
	var operador = "<select>"
	operador += "<option value='='>igual</option>"
	operador += "<option value='!='>dif</option>"
	operador += "<option value='<'>menor</option>"
	operador += "<option value='>'>maior</option>"
	operador += "<option value='<='><=</option>"
	operador += "<option value='>='>>=</option>"
	operador += "<option value='in'>in</option>"
	operador += "<option value='~='>regExp</option></select>"
	var conector = "<select>"
	conector += "<option value='and'>e</option>"
	conector += "<option value='or'>ou</option>"
	conector += "<option value='not'>n&atilde;o</option></select>"
	var valor = document.createElement("input")
	valor.type = "text"
	valor.value = ""
	valor.size = "20"
	var ntb = document.createElement("tbody")
	var ntr = document.createElement("tr")
	var ntad = document.createElement("td")
	ntad.appendChild(add)
	ntr.appendChild(ntad)
	var ntd = document.createElement("td")
	ntd.appendChild(xis)
	ntr.appendChild(ntd)
	var ntd1 = document.createElement("td")
	ntd1.innerHTML = comboDeItens
	ntr.appendChild(ntd1)
	var ntd2 = document.createElement("td")
	ntd2.innerHTML = operador
	ntr.appendChild(ntd2)
	var ntd3 = document.createElement("td")
	ntd3.appendChild(valor)
	ntd3.appendChild(interrogacao)
	ntr.appendChild(ntd3)
	var ntd4 = document.createElement("td")
	ntd4.innerHTML = conector
	ntr.appendChild(ntd4)
	ntb.appendChild(ntr)
	tabela = $i("parametros")
	tabela.appendChild(ntb)
	aguarde("none")
}
//pega filtro inicial se houver
function pegafiltrof(filtro)
{
	$i("filtro").value = filtro.data
	aguarde("none")
}
//termina
function concluidof()
{
	window.parent.remapaf()
	$i("resultado").innerHTML=''
	aguarde("none")
}