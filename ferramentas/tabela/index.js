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
nomeArquivoGr = "" //nome do arquivo que conterá os dados apoós ser feito o gráfico pela primeira vez
mensagemAjuda("men1",$i("men1").innerHTML)
parametrosURL()
//se o R estiver instalado, mostra a guia de graficos
if (g_r != "sim")
{$i("guia4obj").innerHTML = "Opção não disponível"}
ativaGuias("")
mostraGuia("guia1")
tipoDeGrafico = "" //tipo de grafico selecionado pelo usuário
imagemG = "" //imagem do grafico gerado
//eventos das guias
$i("guia1").onclick = function()
{mostraGuia("guia1");}
$i("guia2").onclick = function()
{mostraGuia("guia2");limpalista();selecionarmarcadosf()}
$i("guia3").onclick = function()
{
 	mostraGuia("guia3");
 	comboitens("estatItem",tema,function(retorno)
	{$i("itensGuia3").innerHTML = retorno.dados},"itensGuia3")
}
$i("guia4").onclick = function()
{mostraGuia("guia4");t0();}
if($i("guia5"))
{
	$i("guia5").onclick = function()
	{
		mostraGuia("guia5")
		//monta a lista de itens
		checkitenseditaveis(
		tema,
		function(retorno)
		{
			if (retorno.tipo == "dados")
			{$i("itensrelatorio").innerHTML = retorno.dados}
		}
		,"itensrelatorio"
		)
 		comboitens("agrupaItem",tema,function(retorno)
		{$i("agrupamento").innerHTML = retorno.dados},"agrupamento")	
	}
}
//combo com as camadas
comboCamadas("selCamada",tema,function(retorno)
{
	if (retorno.dados == "") //tema unico
 	{$i("combot").innerHTML="";registrosf()}
 	else
 	{
		$i("combot").innerHTML = "<div style=top:10px class=destaca >O tema escolhido &eacute; composto por mais de uma camada de dados. Selecione uma das camadas para listar:</div><br>"+retorno.dados
		$i("selCamada").onchange = function()
		{
		 	tema = $i("selCamada").value
			registrosf()
		}
 	}
},"combot"
)
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
		new YAHOO.widget.Button("botao2");
		new YAHOO.widget.Button("botao3");
		new YAHOO.widget.Button("botao4");
		new YAHOO.widget.Button("botao5");
		new YAHOO.widget.Button("botao6");
		new YAHOO.widget.Button("botao7");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()	
//conta menos 20
function menosf()
{
	var i = $i("inicio").value * 1;
	var f = $i("fim").value * 1
	var d = f - i;

	$i("inicio").value = i - d - 1
	$i("fim").value = i - 1
	if ($i("inicio").value < 1)
	{
		$i("inicio").value = 1
		$i("fim").value = 1 + d
	}
	registrosf()
}
//conta menos 20
function maisf()
{
	var i = $i("inicio").value * 1;
	var f = $i("fim").value * 1
	var d = f - i;
	$i("inicio").value = f + 1
	$i("fim").value = f + d + 1
	registrosf()
}
//lista os registros da tabela
function registrosf()
{
	aguarde("block")
	var tipolista = "tudo"
	var tiporeg = "brasil"
	if ($i("tiporeg").checked)
	{tiporeg = "mapa"}
	if ($i("tipolista").checked)
	{tipolista = "selecionados"}
	var inicio=$i("inicio").value - 1
	var fim=$i("fim").value
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&inicio="+inicio+"&fim="+fim+"&tema="+tema+"&tipo="+tiporeg+"&tipolista="+tipolista
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaRegistros",montaregistrosf);
}
//monta a lista dos registros da tabela
function montaregistrosf(retorno)
{
	if (retorno.data != undefined)
	{
		var ins = new Array()
		//cabecalho da tabela
		ins = "<table id=tabelai >"
		ins += "<tr><td></td><td></td><td></td>"
		for (i=0;i<retorno.data[0].itens.length;i++)
		{ins += "<td id='"+(i * 1 + 3)+"' style='background-color:yellow' ><img style=cursor:pointer onclick='excluicolunaf(this)' src=../../imagens/x.gif title='excluir' /><img style=cursor:pointer onclick='ordenacolunaf(this)' src=../../imagens/ordena1.gif title='ordena' /> "+retorno.data[0].itens[i]+"</td>"}
		ins += "</tr>"
		var cor = "linha"
		for (i=0;i<retorno.data[1].registros.length;i++)
		{
			ins += "<tr><td><img style=cursor:pointer onclick='excluilinhaf(this)' src=../../imagens/x.gif title='excluir' /></td>"
			ins += "<td><img style=cursor:pointer onclick='zoomlinhaf(this)' src=../../imagens/o.gif title='zoom' ids="+retorno.data[1].registros[i].indice+" /></td>"
			ins += "<td><input title='marca' style='cursor:pointer' type='checkbox' "+retorno.data[1].registros[i].status+"  name="+retorno.data[1].registros[i].indice+" /></td>"
		 	var vals = retorno.data[1].registros[i].valores
			for (j=0;j<vals.length;j++)
			{ins += "<td class='"+cor+"'>"+vals[j].valor+"</td>"}
			if (cor == "linha"){cor = "linha1"}
			else{cor = "linha"}
		}
		$i("registros").innerHTML = ins
	}
	aguarde("none")
}
//exclui uma linha
function excluilinhaf(celula)
{
	aguarde("block")
	var p = celula.parentNode.parentNode
	do
	{
		p.removeChild(p.childNodes[0])
	} while (p.childNodes.length > 0);
	p.parentNode.removeChild(p)
	aguarde("none")
}
//zoom para uma linha
function zoomlinhaf(celula)
{
	aguarde("block")
	var p = celula.parentNode.parentNode
	var reg = p.getElementsByTagName("input")[0].name
	//pega a extensao
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=extregistros&registro="+reg+"&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"extensaoRegistro",zoomlinhaf1);
}
function zoomlinhaf1(retorno)
{
	aguarde("none")
	ext = retorno.data
	//muda a extensao do mapa
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",zoomlinhaf2);
}
function zoomlinhaf2()
{
	if ($i("tiporeg").checked)
	{
		$i("registros").innerHTML = ''
		//refaz a lista de registros
		registrosf()
	}
	//redesenha o mapa
	concluidof()
}
//exclui uma coluna
function excluicolunaf(coluna)
{
	aguarde("block")
	var tabela = $i("tabelai")
	var trs = tabela.getElementsByTagName("tr")
	var cid = coluna.parentNode.id
	for (t=0;t<trs.length;t++)
	{
		if (trs[t].childNodes)
		{
			for (i = 0; i < trs[t].childNodes[cid].childNodes.length;i++)
			{trs[t].childNodes[cid].removeChild(trs[t].childNodes[cid].childNodes[i])}
			trs[t].childNodes[cid].innerHTML = "";
		}
	}
	aguarde("none")
}
//ordena por uma coluna
function ordenacolunaf(coluna)
{
	aguarde("block")
	var tabela = $i("tabelai")
	var trs = tabela.getElementsByTagName("tr")
	var cabecalhotr = trs[0]
	//pega os valores para fazer o sort
	var conta = 0
	var psort = new Array()
	var cid = coluna.parentNode.id
	for (t=0;t<trs.length;t++)
	{
		if ((t) < trs.length)
		{
			if (trs[t].childNodes[cid].innerHTML)
			{
				if (trs[t].childNodes[cid].innerHTML != "undefined")
				{psort[conta] =  trs[t].childNodes[cid].innerHTML+"+"+conta;conta = conta + 1}
			}
		}
	}
	//recosntroi a tabela
	var psortfim = psort.sort()
	var ins = "<table id=tabelai >"
	for (p=0;p<psortfim.length;p++)
	{
		var e = psortfim[p].split("+")[1] * 1
		if (trs[e] != undefined)
		{
			ins += "<tr>" + trs[e].innerHTML + "</tr>"
		}
	}
	$i("registros").innerHTML = ins+"</table>"
	aguarde("none")
}
//seleciona marcados
function selecionarmarcadosf()
{
	aguarde("block")
	var tabela = $i("tabelai")
	var trs = tabela.getElementsByTagName("tr")
	var cabecalhoi = trs[0]
	var ins = "<br><table id='tabelas' >"
	var cor = "linha1"
	var rlinha1 = new RegExp('class="linha1"',"g")
	var rlinha = new RegExp('class="linha"',"g")
	var rinput = new RegExp('type="checkbox"',"g")
	for (t=0;t<trs.length;t++)
	{
		if ((t) < trs.length)
		{
			var isn = trs[t].childNodes[2].getElementsByTagName("input")
			if (isn[0] != undefined)
			{
				if (isn[0].checked)
				{
					var p = isn[0].parentNode.parentNode
					if (cor == "linha1")
					{p = p.innerHTML.replace(rlinha,"class='linha1'");cor = "linha"}
					else
					{p = p.innerHTML.replace(rlinha1,"class='linha'");cor = "linha1"}
					p = p.replace(rinput,"type='hidden' ")
					ins += "<tr>" + p + "</tr>"
				}
			}
		}
	}
	$i("registrossel").innerHTML = ins
	//ativa guia dos selecionados
	$i("guia2obj").style.display="block"
	$i("guia1obj").style.display="none"
	aguarde("none")
}
//ativa selecao no mapa
function ativaself()
{
	aguarde("block")
	var tabela = $i("tabelas")
	var trs = tabela.getElementsByTagName("tr")
	var ids = new Array
	for (t=0;t<trs.length;t++)
	{
		if ((t) < trs.length)
		{
			var isn = trs[t].childNodes[2].getElementsByTagName("input")
			if (isn[0] != undefined)
			{ids.push(isn[0].name)}
		}
	}
	ids = ids.toString()
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=incluisel&tema="+tema+"&ids="+ids
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	window.parent.g_operacao = "selecao"
	var fim = function()
	{aguarde("none");window.parent.ajaxredesenha("")}
	cp.call(p,"incluiSel",fim);
}
//limpa selecao no mapa
function limpaself()
{
	limpalista()
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=limpasel&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"selecaoLimpa",concluidof);
}
//limpa a lista de elementos selecionados
function limpalista()
{
	$i("registrossel").innerHTML = ""
}
//gera a estatistica de um item
function calculaestatisticaf()
{
	if($i("estatItem").value == "")
	{alert("Escolha um item!");return;}
	aguarde("block")
	var monta = function (retorno)
	{
		aguarde("none")
		var ins = retorno.data
		if (retorno.data.indices != undefined)
		{
			if (retorno.data.indices)
			{
				var ins = ""
				for (i=0;i<retorno.data.indices.length;i++)
				{
					var nome = eval("retorno.data.variaveis."+retorno.data.indices[i])
					var valor = eval("retorno.data.valores."+retorno.data.indices[i])
					ins = ins + "<p style='text-align:left'> <span style='color:gray'>"+nome+": </span>"+valor+"</p>"
				}
				$i("resultadotab").innerHTML=''
			}
		}
		$i("operacoes").innerHTML = ins + "<br>"
	}		
	var exclui = ""
	if ($i("filtro1").value != ""){exclui = $i("filtro1").value}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=estatistica&item="+$i("estatItem").value+"&tema="+tema+"&exclui="+exclui
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"estatDescritivas",monta);
}
//lista os dados no formato texto
function listatextof()
{
	aguarde("block")
	var monta = function(retorno)
	{
		if (retorno.data != undefined)
		{
			var linhas = retorno.data.valores
			var ins = retorno.data.itens+"<br>"
			for (linha=0;linha<linhas.length;linha++)
			{ins += linhas[linha] + "<br>"}
			$i("operacoes").innerHTML = ins +"<br>"
			$i("resultadotab").innerHTML=''
		}
		else
		{$i("operacoes").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
		aguarde("none")
	}
	
	var tipo = "brasil"
	if ($i("tiporeg").checked){tipo = "mapa"}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatexto&tema="+tema+"&tipo="+tipo
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"itensTexto",monta);
}
//cria um novo tema
function criatemaf()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=criatemasel&tema="+tema+"&nome=Novo tema "+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	aguarde("none");
	cp.call(p,"selecao2tema",window.parent.ajaxredesenha);
}
//termina
function concluidof()
{
	window.parent.remapaf()
	$i("resultadotab").innerHTML=''
	aguarde("none")
}
//
//funcoes da guia graficos
//
function t0()
{
	$i("resultado").innerHTML = "";
	ins = "<br><img src='../../imagens/Rlogo.jpg'/>"
	ins += "<br><p>A representação gr&aacute;fica dos dados tabulares utiliza todos os elementos da tabela ou os selecionados, se estiverem ativos no mapa."
	ins += "<p>Nas op&ccedil;&otilde;s seguintes, defina o tipo e as op&ccedil;&otilde;es do gr&aacute;fico."
	ins += "<br><br><a href='../../pacotes/r/docs' target=blank >Os gráficos s&atilde;o gerados com o software R. Veja alguns documentos sobre o uso do R</a>"
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	ins = "<p>Escolha o tipo de gr&aacute;fico:</p>"
	ins += "<table><tr>"
	ins += "<td><img src='../../imagens/grtorta.png' /></td>"
	ins += "<td><img src='../../imagens/grbarras.png' /></td>"
	ins += "<td><img src='../../imagens/grhist.png' /></td>"
	ins += "<tr><td><input style='border: 0px solid gray;cursor:pointer' onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='pie' />Pizza</td>"
	ins += "<td><input style='border: 0px solid gray;cursor:pointer' onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='barplot' />Barras</td>"
	ins += "<td><input style='border: 0px solid gray;cursor:pointer' onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='hist' />Histograma</td></tr>"
	
	ins += "<tr><td><img src='../../imagens/grlinhas.png' /></td>"
	ins += "<td><img src='../../imagens/grdisp.png' /></td>"
	ins += "<td><a href=http://addictedtor.free.fr/graphiques/RGraphGallery.php?graph=70 ><img src='../../imagens/grscatterbins.png' title=fonte style=cursor:pointer /></a></td>"
	
	ins += "<tr><td><input style='border: 0px solid gray;cursor:pointer' onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='linhas' />Linhas</td>"
	ins += "<td><input style='border: 0px solid gray;cursor:pointer' onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='scatter' />Dispersão</td>"
	ins += "<td><input style='border: 0px solid gray;cursor:pointer' onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='scatterbins' />Dispersão 2d</td>"

	ins += "<td></td></tr>"
	//ins += "<span><input onclick='javascript:tipoDeGrafico=this.value' type=radio name=tipoG value='estrela' />Estrela</span><br>"
	ins += "</table>"
	mostraOpcao("t0()","t2a()",ins,"t1")
}
//gera o combo com os itens
function t2a()
{
 	if (tipoDeGrafico == "")
 	{
	  	alert("Selecione um tipo de Grafico")
	  	t1()
 	}
 	else
 	{
		comboitens("gi1",tema,function(retorno)
		{
	 		combo1 = retorno.dados
	 		combo2 = combo1.replace("gi1","gi2")
	 		t2()
		})
	}
}
function t2()
{
	if (tipoDeGrafico != "estrela")
	{
		ins = "Item com os valores ou eixo y:<br>"
		ins += combo1
	}
	if (tipoDeGrafico == "estrela")
	{
		var combo = comboitensf(retorno)
		var itens = checkitensf(retorno)
		ins = "<br><br>Item para agrupar os valores e que define as estrelas:<br>"
		ins += combo1
		ins += "Pontas das estrelas:<br><br>"
		var c = "<div id=itens >" + itens + "</div>"
		ins += c

	}
	if ((tipoDeGrafico != "hist") && (tipoDeGrafico != "estrela"))
	{
		ins += "<br><br>Item com as categorias ou eixo x:<br>"
		ins += combo2
	}
	if ((tipoDeGrafico != "hist") && (tipoDeGrafico != "estrela") && (tipoDeGrafico != "scatter") && (tipoDeGrafico != "scatterbins"))
	{
		ins += "<br><br>Os valores ser&atilde;o agrupados pelas categorias por:<br>"
		ins += "<select id=agrupar >"
		ins += "<option value=soma SELECTED >soma</option>"
		ins += "<option value=conta >contagem</option>"
		ins += "<option value=media >m&eacute;dia</option></select>"
	}
	ins += "<br><br>Excluir valores:<br>"
	ins += "<input class=digitar type=text value='' size=4 id=gexcluir />"
	aguarde("none")
	mostraOpcao("t0()","t4()",ins,"t2")
}
function t4()
{
	nomeArquivoGr = "" //nome do arquivo que conterá os dados apoós ser feito o gráfico pela primeira vez
	aguarde("block")
	if (tipoDeGrafico=="pie")
	{
		parametros = "radius,Tgrid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Trotulos,cex,font,Toutros,lty,bg,gw,gh,res,percentual"
	}
	if (tipoDeGrafico=="barplot")
	{
		parametros = "Tgrid,grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,Trotulos,font,las,cexaxis,Toutros,space,bg,gw,gh,res,percentual,setasdv"
	}
	if (tipoDeGrafico=="hist")
	{
		parametros = "Tgrid,grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,font,Toutros,corbarras,breaks,lwd,bg,gw,gh,res,densidade"
	}
	if (tipoDeGrafico=="linhas")
	{
		parametros = "Tgrid,grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,colaxis,Toutros,pch,spline,tpt,ppontos,lty,tck,lwd,bg,gw,gh,res"
	}
	if (tipoDeGrafico=="scatter")
	{
		parametros = "grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,colaxis,Toutros,pch,tpt,ppontos,lty,tck,lwd,bg,gw,gh,res,corlinha"
	}
	if (tipoDeGrafico=="scatterbins")
	{
		parametros = "grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,colaxis,Toutros,pch,tpt,ppontos,lty,tck,lwd,bg,gw,gh,res,corlinha,nbins,plota3d"
	}
	if (tipoDeGrafico=="estrela")
	{
		parametros = "grid,border,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexaxis,collab,fontlab,las,Trotulos,cex,cexlab,colaxis,Toutros,pch,tpt,ppontos,lty,tck,lwd,bg,font,gw,gh,res"
		var t = $i("itens").getElementsByTagName("input");
		var tsl = new Array(); //itens
		for (i=0;i<t.length; i++)
		{
			if (t[i].type == "checkbox")
			{
				if (t[i].checked == true)
				{tsl.push(t[i].value);}
			}
		}
		if (tsl == 0)
		{alert("Escolha um item pelo menos");}
		else
		{itensEstrela = tsl.toString(",")}
	}
	ins = "<div onclick='geraG(\"mostraG\")' style=position:absolute;top:0px;left:0px;text-align:left; ><input id=botao7 type=button value='Gera em uma nova janela' size=15 /></div>"
	ins += "<div onclick='geraG(\"mostraI\")' style=position:absolute;top:0px;left:158px;text-align:left; ><input id=botao10 type=button value='Gera nessa janela' size=15 /></div>"
	ins += "<div onclick='fusaoG()' style=position:absolute;top:0px;left:280px;text-align:left; ><input id=botao8 type=button value='Fus&atilde;o com o mapa' size=25  /></div>"

	ins += "<div id=imgG style=position:relative;top:30px; ></div>"
	ins += "<br><br><table class=lista >"

	ins += "<tr><td><b>Tamanho da figura</b></td><td></td></tr>"
	
	ins += "<tr><td>Largura em pixels</td>"
	ins += "<td><input class=digitar type=text value=400 size=4 id='gw' /></td></tr>"

	ins += "<tr><td>Altura em pixels</td>"
	ins += "<td><input class=digitar type=text value=400 size=4 id='gh' /></td></tr>"

	ins += "<tr><td>Resolu&ccedil;&atilde;o em dpi</td>"
	ins += "<td><input class=digitar type=text value=72 size=4 id='res' /></td></tr>"

	var temp = parametros.split(",")
	for(i=0;i < temp.length;i++)
	{
		ins += retornaPar(temp[i])
	}
	ins += "</table>"
	aguarde("none")
	mostraOpcao("","",ins,"t4")
	YAHOO.example.init = function ()
	{
		function onPushButtonsMarkupReady()
		{
			new YAHOO.widget.Button("botao7");
			new YAHOO.widget.Button("botao8");
			new YAHOO.widget.Button("botao9");
			new YAHOO.widget.Button("botao10");
		}
   		YAHOO.util.Event.onContentReady("botao7", onPushButtonsMarkupReady);
	}()	
}
function retornaPar(id)
{
	var ins = ""
	if (id == "Tgrid")
	{
		ins += "<tr><td><b>Grade e bordas</b></td><td></td></tr>"
	}
	if (id == "Ttitulo")
	{
		ins += "<tr><td><b>Título</b></td><td></td></tr>"
	}
	if (id == "Tsubtitulo")
	{
		ins += "<tr><td><b>Sub-Título</b></td><td></td></tr>"
	}
	if (id == "Teixo")
	{
		ins += "<tr><td><b>Texto dos eixos</b></td><td></td></tr>"
	}
	if (id == "Trotulos")
	{
		ins += "<tr><td><b>Texto dos rótulos dos eixos</b></td><td></td></tr>"
	}
	if (id == "Toutros")
	{
		ins += "<tr><td><b>Outros</b></td><td></td></tr>"
	}
	if (id == "Bgrafico")
	{
		ins += "<tr><td><b>Margem do gráfico</b></td><td></td></tr>"
	}
	if (id == "corlinha")
	{
		ins += "<tr><td>Cor da linha</td>"
		ins += "<td>"+combocor("corlinha","1")+"</td></tr>"
	}	
	if (id == "corbarras")
	{
		ins += "<tr><td>Cor das barras</td>"
		ins += "<td>"+combocor("corbarras","0")+"</td></tr>"
	}
	if (id == "plota3d")
	{
		ins += "<tr><td>Plota em 3d?</td>"
		ins += "<td>"+naosim("plota3d")+"</td></tr>"
	}
	if (id == "setasdv")
	{
		ins += "<tr><td>Plota as marcas do desvio padrão?</td>"
		ins += "<td>"+naosim("setasdv")+"</td></tr>"
	}	
	if (id == "margem")
	{
		ins += "<tr><td>Plota a margem?</td>"
		ins += "<td>"+simnao("margem")+"</td></tr>"
	}
	if (id == "margemexterna")
	{
		ins += "<tr><td>Margem externa</td>"
		ins += "<td>"+combocor("margemexterna","0")+"</td></tr>"
	}
	if (id == "margeminterna")
	{
		ins += "<tr><td>Margem interna</td>"
		ins += "<td>"+combocor("margeminterna","0")+"</td></tr>"
	}
	if (id == "nbins")
	{
		ins += "<tr><td>Número de divisões dos eixos</td>"
		ins += "<td><input class=digitar type=text value='40' size=4 id=nbins /></td></tr>"
	}
	if (id == "breaks")
	{
		ins += "<tr><td>Total de quebras</td>"
		ins += "<td><input class=digitar type=text value='20' size=20 id=breaks /></td></tr>"
	}
	if (id == "space")
	{
		ins += "<tr><td>Espa&ccedil;amento entre as barras</td>"
		ins += "<td><input class=digitar type=text value=0 size=4 id=space /></td></tr>"
	}
	if (id == "grid")
	{
		ins += "<tr><td>Plota a grade?</td>"
		ins += "<td>"+simnao("grid")+"</td></tr>"
	}
	if (id == "radius")
	{
		ins += "<tr><td>Redu&ccedil;&atilde;o da figura (-1 a 1)</td>"
		ins += "<td><input class=digitar type=text value='0.9' size=4 id=radius /></td></tr>"
	}
	if (id == "percentual")
	{
		ins += "<tr><td>Plota o percentual nos rótulos?</td>"
		ins += "<td>"+simnao("percentual")+"</td></tr>"
	}
	if (id == "densidade")
	{
		ins += "<tr><td>Utiliza densidade</td>"
		ins += "<td>"+naosim("densidade")+"</td></tr>"
	}
	if (id == "ann")
	{
		ins += "<tr><td>Plota os textos?</td>"
		ins += "<td>"+simnao("ann")+"</td></tr>"
	}
	if (id == "adj")
	{
		ins += "<tr><td>Posicionamento dos textos</td>"
		ins += "<td><select name=adj id=adj >"
		ins += "<option value=0.5 SELECTED>centro</option>"
		ins += "<option value=0 >esquerda</option>"
		ins += "<option value=1 >direita</option>"
		ins += "</select></td></tr>"
	}
	if (id == "font")
	{
		ins += '<tr><td>Estilo da fonte dos textos marginais</td>';
		ins += '<td style="text-align:left">';
		ins +=  '<select name="font" id=font >';
		ins +=   '<option value="2" selected >normal</option>';
		ins +=   '<option value="3">negrito</option>';
		ins +=   '<option value="4">itálico</option>';
		ins +=   '<option value="5">negrito-itálico</option>';
		ins +=  "</select>";
		ins +=  '</td></tr>';
	}
	if (id == "cex")
	{
		ins += "<tr><td>Fator de escala</td>"
		ins += "<td><input class=digitar type=text value='.6' size=4 id=cex /></td></tr>"
	}
	if (id == "main")
	{
		var t = ""
		if ($i("gi1"))
		{t = $i("gi1").value}
		if ($i("gi2"))
		{t += " " + $i("gi2").value}
		ins += "<tr><td>T&iacute;tulo</td>"
		ins += "<td><input class=digitar type=text value='"+t+"' size=20 id=main /></td></tr>"
	}
	if (id == "fontmain")
	{
		ins += '<tr><td>Estilo</td>';
		ins += '<td style="text-align:left">';
		ins +=  '<select name="fontmain" id=fontmain >';
		ins +=   '<option value="2" selected >normal</option>';
		ins +=   '<option value="3">negrito</option>';
		ins +=   '<option value="4">itálico</option>';
		ins +=   '<option value="5">negrito-itálico</option>';
		ins +=  "</select>";
		ins +=  '</td></tr>';
	}
	if (id == "cexmain")
	{
		ins += "<tr><td>Fator de escala</td>"
		ins += "<td><input class=digitar type=text value=1 size=4 id=cexmain /></td></tr>"
	}
	if (id == "colmain")
	{
		ins += "<tr><td>Cor</td>"
		ins += "<td>"+combocor("colmain","1")+"</td></tr>"
	}
	if (id == "sub")
	{
		ins += "<tr><td>Sub-T&iacute;tulo</td>"
		ins += "<td><input class=digitar type=text value='' size=20 id=sub /></td></tr>"
	}
	if (id == "fontsub")
	{
		ins += '<tr><td>Estilo</td>';
		ins += '<td style="text-align:left">';
		ins +=  '<select name="fontsub" id=fontsub >';
		ins +=   '<option value="2" selected >normal</option>';
		ins +=   '<option value="3">negrito</option>';
		ins +=   '<option value="4">itálico</option>';
		ins +=   '<option value="5">negrito-itálico</option>';
		ins +=  "</select>";
		ins +=  '</td></tr>';
	}
	if (id == "cexsub")
	{
		ins += "<tr><td>Fator de escala</td>"
		ins += "<td><input class=digitar type=text value=1 size=4 id=cexsub /></td></tr>"
	}
	if (id == "colsub")
	{
		ins += "<tr><td>Cor</td>"
		ins += "<td>"+combocor("colsub","1")+"</td></tr>"
	}
	if (id == "ylab")
	{
		if ($i("gi1"))
		{var t = $i("gi1").value}
		if (tipoDeGrafico == "hist"){var t = "quantidade" }
		ins += "<tr><td>Nome do eixo y</td>"
		ins += "<td><input class=digitar type=text value='"+t+"' size=20 id=ylab /></td></tr>"
	}
	if (id == "xlab")
	{
		if ($i("gi2"))
		{var t = $i("gi2").value}
		if (tipoDeGrafico == "hist"){var t = "ocorrencias" }
		ins += "<tr><td>Nome do eixo x</td>"
		ins += "<td><input class=digitar type=text value='"+t+"' size=20 id=xlab /></td></tr>"
	}
	if (id == "cexaxis")
	{
		ins += "<tr><td>Fator de escala</td>"
		ins += "<td><input class=digitar type=text value=.5 size=4 id=cexaxis /></td></tr>"
	}
	if (id == "cexlab")
	{
		ins += "<tr><td>Fator de escala</td>"
		ins += "<td><input class=digitar type=text value=1 size=4 id=cexlab /></td></tr>"
	}
	if (id == "colaxis")
	{
		ins += "<tr><td>Cor</td>"
		ins += "<td>"+combocor("colaxis","1")+"</td></tr>"
	}
	if (id == "collab")
	{
		ins += "<tr><td>Cor</td>"
		ins += "<td>"+combocor("collab","1")+"</td></tr>"
	}
	if (id == "fontaxis")
	{
		ins += '<tr><td>Estilo</td>';
		ins += '<td style="text-align:left">';
		ins +=  '<select name="fontaxis" id=fontaxis >';
		ins +=   '<option value="2" selected >normal</option>';
		ins +=   '<option value="3">negrito</option>';
		ins +=   '<option value="4">itálico</option>';
		ins +=   '<option value="5">negrito-itálico</option>';
		ins +=  "</select>";
		ins +=  '</td></tr>';
	}
	if (id == "fontlab")
	{
		ins += '<tr><td>Estilo</td>';
		ins += '<td style="text-align:left">';
		ins +=  '<select name="fontlab" id=fontlab >';
		ins +=   '<option value="2" selected >normal</option>';
		ins +=   '<option value="3">negrito</option>';
		ins +=   '<option value="4">itálico</option>';
		ins +=   '<option value="5">negrito-itálico</option>';
		ins +=  "</select>";
		ins +=  '</td></tr>';
	}
	if (id == "las")
	{
		ins += "<tr><td>&Acirc;ngulo</td>"
		ins += "<td><select name='las' id=las >"
		ins += "<option value=0 SELECTED>paralelos</option>"
		ins += "<option value=1 >horizontal</option>"
		ins += "<option value=2 >perpendicular</option>"
		ins += "<option value=3 >vertical</option>"
		ins += "</select></td></tr>"
	}
	if (id == "lty")
	{
		ins += '<tr><td>Estilo das linhas</td>';
		ins += '<td style="text-align:left">';
		ins += '<select name="lty" id="lty" >\n';
		ins +=  '<option value="0"  >nenhum</option>';
		ins +=  '<option value="1" selected >sólido</option>';
		ins +=  '<option value="2">tracejado</option>';
		ins +=  '<option value="3">pontilhado</option>';
		ins +=  '<option value="4">traço-ponto</option>';
		ins +=  '<option value="5">traço longo</option>';
		ins +=  '<option value="6">traço duplo</option>';
		ins += "</select>";
		ins += '</td></tr>';
	}
	if (id == "border")
	{
		ins += "<tr><td>Cor da borda dos elementos ou linhas</td>"
		ins += "<td>"+combocor("border","1")+"</td></tr>"
	}
	if (id == "lwd")
	{
		ins += "<tr><td>Largura da linha</td>"
		ins += "<td><input class=digitar type=text value=1 size=4 id=lwd /></tr>"
	}
	if (id == "tck")
	{
		ins += "<tr><td>Tamanho dos tics</td>"
		ins += "<td><input class=digitar type=text value=1 size=4 id=tck /></td></tr>"
	}
	if (id == "horiz")
	{
		ins += "<tr><td>Horizontal?</td>"
		ins += "<td>"+simnao("horiz")+"</td></tr>"
	}
	if (id == "spline")
	{
		ins += "<tr><td>Suaviza as linhas?</td>"
		ins += "<td>"+naosim("spline")+"</td></tr>"
	}
	if (id == "ppontos")
	{
		ins += "<tr><td>Plota os pontos?</td>"
		ins += "<td>"+simnao("ppontos")+"</td></tr>"
	}
	if (id == "full")
	{
		ins += "<tr><td>Círculo inteiro?</td>"
		ins += "<td>"+simnao("full")+"</td></tr>"
	}
	if (id == "pch")
	{
		ins += "<tr><td>Símbolo dos pontos</td>"
		ins += "<td><input class=digitar type=text value='o' size=4 id=pch /></td></tr>"
	}
	if (id == "tpt")
	{
		ins += "<tr><td>Tamanho dos pontos</td>"
		ins += "<td><input class=digitar type=text value=0.5 size=4 id=tpt /></td></tr>"
	}
	return (ins)
}
function geraG(onde)
{
	aguarde("block")
	if (tipoDeGrafico=="pie")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficopizza"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoPizza",eval(onde));
	}
	if (tipoDeGrafico=="barplot")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficobarras"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoBarras",eval(onde));
	}
	if (tipoDeGrafico=="hist")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficohist"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoHist",eval(onde));
	}
	if (tipoDeGrafico=="linhas")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficolinhas"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoLinhas",eval(onde));
	}
	if (tipoDeGrafico=="scatter")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficoscatter"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoScatter",eval(onde));
	}
	if (tipoDeGrafico=="scatterbins")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficoscatterbins"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoScatterBins",eval(onde));
	}
	if (tipoDeGrafico=="estrela")
	{
		var par = montapar(parametros)
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=graficoestrela"+par
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"graficoEstrela",eval(onde));
	}
}
//mostra o grafico
function mostraG(retorno)
{
	if (retorno.data != "erro")
	{
		var r = retorno.data
		var l = r.split(",")
		var w = window.open("")
		w.document.write("<img src='"+l[0]+"' />")
		w.document.write("<br><br><br><a href="+l[1]+"> Arquivo com os valores</a>")
		imagemG = l[0]
		nomeArquivoGr = l[2]
	}
	else
	{alert("Ocorreu algum erro. Verifique os tipos de dados.")}
	aguarde("none")
}
//mostra o grafico
function mostraI(retorno)
{
	if (retorno.data != "erro")
	{
		var r = retorno.data
		var l = r.split(",")
		$i("imgG").innerHTML = "<img src='"+l[0]+"' />"
		imagemG = l[0]
		nomeArquivoGr = l[2]
	}
	else
	{alert("Ocorreu algum erro. Verifique os tipos de dados.")}
	aguarde("none")
}
//monta os parametros do grafico
function montapar(parametros)
{
	var par = ""
	var parametros = parametros.split(",")
	for(i=0;i < parametros.length;i++)
	{
		if ($i(parametros[i]))
		{
			var v = $i(parametros[i]).value
			par += "&"+parametros[i]+"="+v
		}
	}
	if (tipoDeGrafico == "estrela")
	{var tipo = "estrela";}
	if (tipoDeGrafico == "hist")
	{var tipo = "hist";}
	if ((tipoDeGrafico == "scatter") || (tipoDeGrafico == "scatterbins"))
	{var tipo = "scatter";}
	if ($i("agrupar"))
	{
		var tipo = $i("agrupar").value
	}
	if ((tipoDeGrafico == "pie") || (tipoDeGrafico == "barplot") || (tipoDeGrafico == "scatter") || (tipoDeGrafico == "scatterbins"))
	{par += "&itemvalores="+$i("gi1").value+"&itemclasses="+$i("gi2").value+"&tema="+tema+"&exclui="+$i("gexcluir").value+"&tipo="+tipo}
	if (tipoDeGrafico == "hist")
	{par += "&itemvalores="+$i("gi1").value+"&itemclasses="+$i("gi1").value+"&tema="+tema+"&exclui="+$i("gexcluir").value+"&tipo=nenhum"}
	if (tipoDeGrafico == "linhas")
	{par += "&itemvalores="+$i("gi1").value+"&itemclasses="+$i("gi2").value+"&tema="+tema+"&exclui="+$i("gexcluir").value+"&tipo="+tipo}
	if (tipoDeGrafico == "estrela")
	{par += "&itemvalores="+$i("gi1").value+"&tema="+tema+"&exclui="+$i("gexcluir").value+"&tipo="+tipo+"&itemclasses="+itensEstrela}
	par += "&nome="+nomeArquivoGr
	return(par)
}
//funde o grafico com o mapa
function fusaoG()
{
	aguarde("block")
	if (imagemG == ""){alert("O gráfico ainda não foi gerado")}
	else
	{
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=fusaografico&imagem="+window.parent.g_quadrooriginal+"&grafico="+imagemG
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"fusaoGrafico",mostraFG);
	}
}
//mostra o resultado da fusao do mapa com o grafico
function mostraFG(retorno)
{
	var img = retorno.data; //window.parent.$i("img").src
	window.parent.$i("img").src = ""
	window.parent.$i("img").src = img
	window.open(img)
	aguarde("none")
}
//gera relatorio
function gerarelatorio()
{
	$i("arearel").value = $i("calculaarea").checked
	$i("statrel").value = $i("calculaestat").checked
	$i("excluirvalor").value = $i("excestat").value
	$i("temarel").value=tema
	$i("g_sid").value=g_sid
	$i("itemagruparel").value=$i("agrupaItem").value
	var inputs = $i("itensrelatorio").getElementsByTagName("input")
	var listai = new Array;
	var listanomes = new Array();
	for (i=0;i<inputs.length; i++)
	{
		if (inputs[i].checked == true)
		{
			listai.push(inputs[i].id+";"+inputs[i].name)
			var nome = $i(inputs[i].id+inputs[i].name).value;
			listanomes.push(nome);
		}
	}
	$i("nomesrel").value=listanomes
	$i("itensrel").value=listai
	$i("relatorio").submit();
}