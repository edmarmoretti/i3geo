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
estilo = ""
classe = ""
listaitens = "" //guarda a lista de temas e itens
ativaGuias("")
mostraGuia("guia1")
$i("guia1").onclick = function()
{
	mostraGuia("guia1");
	mostralegenda();
}
$i("guia2").onclick = function()
{
 	mostraGuia("guia2");
	comboCamadas("selCamada",tema,function(retorno)
	{
	 	if (retorno.dados != "")
		{
		 	$i("combot").innerHTML = "<span style=background-color:yellow >O tema escolhido &eacute; composto por mais de uma camada de dados. Selecione uma das camadas para gerar a legenda nova:</span>"+retorno.dados
			$i("selCamada").onchange = function()
			{
				tema = $i("selCamada").value
				comboitens("selItem",$i("selCamada").value,function(retorno)
		 		{$i("itens").innerHTML = retorno.dados},"itens")
			}
		}
		else
		{
		 	comboitens("selItem",tema,function(retorno)
		 	{$i("itens").innerHTML = retorno.dados},"itens")
		}
	})
}
$i("guia3").onclick = function()
{mostraGuia("guia3")}
$i("guia4").onclick = function()
{
	mostraGuia("guia4");
	graficocontagem();
}
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
		new YAHOO.widget.Button("botaoadiciona");
	}
   	YAHOO.util.Event.onContentReady("botao7", onPushButtonsMarkupReady);
}() 	
mostralegenda()
function mostralegenda()
{
	aguarde("block")
	$i("resultado").innerHTML = "Aguarde...montando a legenda"
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editalegenda&opcao=edita&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"tabelaLegenda",montaLegenda);
}
function graficocontagem()
{
	aguarde("none")
	$i("resultadoGrafico").innerHTML = "Aguarde...calculando"
	var monta = function(retorno)
	{
		if (retorno.data[0].proc == "") //o layer nao deve ser raster
		{
			var ins = new Array()
			ins.push("<table width=100% >")
			for (i=0;i<retorno.data.length;i++)
			{
				var id = retorno.data[i].tema+"-"+retorno.data[i].idclasse //layer+indice da classe
				var re = new RegExp("'", "g");
				var exp = (retorno.data[i].expressao).replace(re,'"')
				ins.push("<tr><td style='text-align:left;border-bottom:0 none white' >"+retorno.data[i].nomeclasse+"</td></tr>")
				var t = (retorno.data[i].nreg * 100)/retorno.data[i].totalreg
				ins.push("<tr><td style=text-align:left ><img height=15px width="+t+"% src='"+retorno.data[i].imagem+"' /></td></tr>")
			}
			ins.push("</table><br>")
			$i("resultadoGrafico").innerHTML = ins.join("")
		}
		else
		{$i("resultadoGrafico").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=contagemclasse&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"cocontagemclasse",monta);
}
function montaLegenda(retorno)
{
	aguarde("none")
	if (retorno.data != undefined)
	{
		if (retorno.data[0].proc == "") //o layer nao deve ser raster
		{
			var ins = new Array()
			ins.push("<table id=legenda ><tr><td><img src='../../imagens/inverter.png' title='Inverter cores' onclick='inverteCores()' style=cursor:pointer /></td><td style=background-color:white ><img src='../../imagens/tamanho.png' title='Calcula tamanho' onclick='calculaTamanho()' style=cursor:pointer /></td><td style=background-color:yellow >nome</td><td style=background-color:yellow >express&atilde;o</td></tr>")
			for (i=0;i<retorno.data.length;i++)
			{
				var id = retorno.data[i].tema+"-"+retorno.data[i].idclasse //layer+indice da classe
				var re = new RegExp("'", "g");
				var exp = (retorno.data[i].expressao).replace(re,'"')
				ins.push("<tr><td><img style='cursor:pointer' title='clique para excluir' onclick='excluilinhaf(this)' src='../../imagens/x.gif' title='excluir' /></td><td><img style='cursor:pointer' title='clique para alterar' src='"+retorno.data[i].imagem+"' onclick='editaSimbolo(\""+id+"\")' /></td><td><input id="+id+" title='digite o novo nome' class=digitar size='30' name=nome value='"+retorno.data[i].nomeclasse+"'/></td><td><input title='digite a nova express&atilde;o' class=digitar size='30' name=expressao value='"+exp+"'/></td></tr>")
			}
			ins.push("</table><br>")
			$i("resultado").innerHTML = ins.join("")
		}
		else
		{
			var ajuda = "<br><br>Para aplicar um ajuste entre 0 e 255 cores, utilize a opção 'Escala de Cores'."
			ajuda += " O valor de SCALE= pode ser a palavra AUTO (SCALE=AUTO) ou um valor m&iacute;nimo e m&aacute;ximo (por exemplo SCALE=20,3000)."
			ajuda += " Voc&ecirc; pode aplicar a escala em bandas individuais, para isso, utilize SCALE_n, por exemplo SCALE_1=AUTO SCALE_2=200,500."
			ajuda += "<br>Para escolher quais bandas ser&atilde;o utilizadas e qual sua ordem, utilize a op&ccedil;&atilde;o BANDAS."
			ajuda += " Utilize, por exemplo, BANDS=1,2,3 BANDS=1 ."
			var ins = "<br>Voc&ecirc; pode incluir processos na imagem para modificar as caracter&iacute;sticas de visualiza&ccedil;&atilde;o<br><br>Adicionar processo:";
			ins += "<select onchange=adicionaProcesso(this) >"
			ins += "<option value='' >selecione o processo</option>"
			ins += "<option value='SCALE=' >Escala de cores</option>"
			ins += "<option value='BANDS=' >Bandas</option>"
			ins += "<option value='COLOR_MATCH_THRESHOLD=' >Threshold</option>"
			ins += "<option value='NODATA=' >Nodata</option>"
			ins += "</select><br>"
			ins += '<br><input class="executar" onclick="aplicaProcessos()" size="22" type="buttom" value="aplicar processos">'
			if(retorno.data[0].proc != "")
			{ins += "<div style=width:80% id=processos ></div>"}
			else
			{
				ins += "<div style=width:80% id=processos >"
				for (i=0;i<retorno.data[0].proc.length;i++)
				{
					ins += "<br><input type=text size=50 value='"+retorno.data[0].proc[i]+"' />"
				}
				ins += "</div>"
			}
			$i("resultado").innerHTML = ins+ajuda
		}
	}
	else
	{$i("resultado").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
}
function adicionaProcesso(s)
{
	var novoel = document.createElement("input");
	novoel.type = 'text';
	novoel.value = s.value;
	novoel.size = 50
	$i("processos").appendChild(novoel);
	s.value = ''
}
function aplicaProcessos()
{
	var lista = new Array
	if ($i("processos").innerHTML != "")
	{
		var ipt = $i("processos").getElementsByTagName("input")
		for (i=0;i<ipt.length; i++)
		{
			if (ipt[i].value != "")
			{
				lista.push(ipt[i].value)
			}
		}
	}
	lista = lista.join("|")
	lista = '"'+lista+'"'
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=aplicaProcessos&lista="+lista+"&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"aplicaProcessos",window.parent.ajaxredesenha);
}
function inverteCores()
{
	var retornapaleta = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
		mostralegenda();
	}
	aguarde("block")
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=inverteCoresClasses&tema="+tema
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"alteraCoresClasses",retornapaleta);
}
function calculaTamanho()
{
	var retornapaleta = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
		mostralegenda();
	}
	aguarde("block")
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=calculaTamanhoClasses&tema="+tema
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"calculaTamanhoClasses",retornapaleta);
}
function valorU()
{
	var item = $i("selItem").value
	if (item == "")
	{alert("Selecione um item!");return;}
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&tema="+tema+"&item="+item+"&opcao=valorunico&ignorar="+$i("ignorar").value
	var cp = new cpaint();
	//cp.set_debug(2)
	var fim = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
	}	
	cp.set_response_type("JSON");
	window.parent.g_operacao = "outras"
	//window.parent.borra("sim");
	cp.call(p,"alteraclasse",fim);
}
function simbU()
{
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&tema="+tema+"&opcao=simbolounico"
	var cp = new cpaint();
	//cp.set_debug(2)
	var fim = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
	}	
	cp.set_response_type("JSON");
	window.parent.g_operacao = "outras"
	//window.parent.borra("sim");
	cp.call(p,"alteraclasse",fim);
}
function valorC()
{
	var item = $i("selItem").value
	if (item == "")
	{alert("Selecione um item!");return;}
	aguarde("block")
	var nclasses = $i("nclasses").value
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&nclasses="+nclasses+"&tema="+tema+"&item="+item+"&opcao=intervalosiguais&ignorar="+$i("ignorar").value
	var cp = new cpaint();
	var fim = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
	}	
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	window.parent.g_operacao = "outras"
	//window.parent.borra("sim");
	cp.call(p,"alteraclasse",fim);
}
function valorQ()
{
	var item = $i("selItem").value
	if (item == "")
	{alert("Selecione um item!");return;}
	aguarde("block")
	var nclasses = $i("nclasses").value
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&tema="+tema+"&item="+item+"&opcao=quartis&ignorar="+$i("ignorar").value
	var cp = new cpaint();
	//cp.set_debug(2)
	var fim = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
	}	
	cp.set_response_type("JSON");
	window.parent.g_operacao = "outras"
	//window.parent.borra("sim");
	cp.call(p,"alteraclasse",fim);
}
function representacao()
{
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alterarepresentacao&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	var fim = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
	}	
	cp.set_response_type("JSON");
	window.parent.g_operacao = "outras"
	//window.parent.borra("sim");
	cp.call(p,"alteraRepresentacao",fim);
}
function mudaLegenda()
{
	aguarde("block")
	var tabela = $i("legenda")
	var trs = tabela.getElementsByTagName("tr")
	var nomes = new Array()
	var exps = new Array()
	var ids = new Array()
	for (t=0;t<trs.length;t++)
	{
		if(trs[t].childNodes)
		{
			var nn = trs[t].childNodes
			for (n=0;n<nn.length;n++)
			{
				if(nn[n].childNodes)
				{
					var isn = nn[n].getElementsByTagName("input")
					if (isn[0] != undefined)
					{
						if(isn[0].name == "nome")
						{
							nomes.push(isn[0].value)
							ids.push(isn[0].id)
						}
						if(isn[0].name == "expressao")
						exps.push(isn[0].value)
					}
				}
			}
		}
	}
	var ids = ids.join(";")
	var nomes = nomes.join(";")
	var exps = exps.join(";")
	//var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&opcao=alteraclasses"+"&ids="+ids+"&nomes="+nomes+"&exps="+exps
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&opcao=alteraclasses"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_transfer_mode('POST');
	cp.set_response_type("JSON");
	cp.call(p,"alteraclassesPost",aplicaRedesenha,ids,nomes,exps);
}
//aplica e redesenha
function aplicaRedesenha()
{
 	mostralegenda()
 	window.parent.ajaxredesenha('')
}
//adiciona totalização no nome da classe
function adicionaConta()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=contagemclasse"+"&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"contagemclasse",montaLegenda);
	alert("A contagem considera apenas os elementos visíveis na abrangência do mapa");
}
//adiciona uma nova classe
function adicionaClasse()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraclasse&opcao=adicionaclasse"+"&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"alteraclasse",mostralegenda);
}
//exclui uma linha
function excluilinhaf(celula)
{
	var p = celula.parentNode.parentNode
	do
	{
		p.removeChild(p.childNodes[0])
	} while (p.childNodes.length > 0);
	p.parentNode.removeChild(p)
	mudaLegenda()
}
function editaSimbolo(id)
{
	aguarde("block")
	$i("guia1obj").style.display="none";
	$i("guia3obj").style.display="block";
	var id = id.split("-")
	tema=id[0]
	classe = id[1]
	estilo = 0
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&opcao=pegaparametros&tema="+id[0]+"&classe="+id[1]
	var cp = new cpaint();
	//cp.set_debug(2);
	cp.set_response_type("JSON");
	cp.call(p,"pegaParametrosMapa",montaEditor);
}
function montaEditor(retorno)
{
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		aguarde("none")
		//cria combo com os estilos
		estilos = retorno.split("|")
		var combo = "<select id='estilos' onchange=verEstilo(this.value)>"
		for (i=0;i<estilos.length;i++)
		{
			var l = estilos[i].split("#")
			sct = "<option value="+l[1]+"  />"+l[1]+"</option>"
			combo += sct
		}
		combo += "</select>"
		var botoes = "<input class=executar onclick='excluiestilo()' size=10 type=buttom value='excluir' />"
		botoes += "&nbsp;<input class=executar onclick='adicionaestilo()' size=14 type=buttom value='adicionar' />"
		botoes += "&nbsp;<input class=executar onclick='sobeestilo()' size=8 type=buttom value='sobe' />"
		botoes += "&nbsp;<input class=executar onclick='desceestilo()' size=8 type=buttom value='desce' />"
		$i("comboestilos").innerHTML = "Estilo: "+combo+botoes
		verEstilo(0)
	}
	else
	{
		aguarde("none")
		$i("comboestilos").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}
//mostra o estilo selecionado
function verEstilo(e)
{
	estilo = e //esta e uma variavel global
	var linha = estilos[estilo]
	linha = linha.split("#")
	var tipoLayer = linha[0]
	var d = ""
	d += "<table><tr><td style='text-align:left;'>Cor do contorno:</td><td><input type=text class=digitar id=outlinecolor value='"+linha[2]+ "' title='digite o valor'/></td><td><img style=cursor:pointer src='../../imagens/aquarela.gif' onclick=\"cor('outlinecolor')\" /></td></tr>"
	d += "<tr><td style='text-align:left;'>Cor do fundo:</td><td><input type=text class=digitar id=backgroundcolor value='"+linha[3]+ "' title='digite o valor'/></td><td><img style=cursor:pointer src='../../imagens/aquarela.gif' onclick=\"cor('backgroundcolor')\" /></td></tr>"
	d += "<tr><td style='text-align:left;'>Cor da frente:</td><td><input type=text class=digitar id=color value='"+linha[4]+ "' title='digite o valor'/></td><td><img style=cursor:pointer src='../../imagens/aquarela.gif' onclick=\"cor('color')\" /></td></tr>"
	d += "<tr><td style='text-align:left;'>Tamanho:</td><td><input type=text class=digitar id=sizes value='"+linha[6]+ "' title='digite o valor'/></td><td></td></tr>"
	d += "<tr><td style='text-align:left;'>S&iacute;mbolo:</td><td><input type=text class=digitar id=symbolname value='"+linha[5]+"' title='digite o valor'/></td><td></td></tr></table>"
	$i("mostraEstilo").innerHTML = "Propriedades do s&iacute;mbolo. Utilize -1,-1,-1 para anular uma cor. A cor deve ser definida no formato vermelho,verde,azul<br><br>"+d
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&tipo="+tipoLayer+"&opcao=listaSimbolos"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"editasimbolo",listaSimbolos);
}
//monta a lista de simbolos
function listaSimbolos(retorno)
{
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		aguarde("none")
		$i("simbolos").innerHTML = "<br>Lista de s&iacute;mbolos. Clique para selecionar:<br><br>"+retorno
	}
	else
	{
		aguarde("none")
		$i("simbolos").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}
//pega o simbolo clicado
function aplicarsim(s)
{$i("symbolname").value = s.title}
//aplica um estilo
function aplicaEstilo()
{
	aguarde("block")
	var outlinecolor = $i("outlinecolor").value
	var backgroundcolor = $i("backgroundcolor").value
	var color = $i("color").value
	var symbolname = $i("symbolname").value
	var size = $i("sizes").value
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&opcao=aplica&tema="+tema+"&classe="+classe+"&estilo="+estilo+"&outlinecolor="+outlinecolor+"&backgroundcolor="+backgroundcolor+"&color="+color+"&symbolname="+symbolname+"&size="+size
	var cp = new cpaint();
	var fim = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
	}	
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	window.parent.g_operacao = "outras"
	cp.call(p,"editasimbolo",fim);
}
//exclui estilo
function excluiestilo()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&opcao=excluiestilo&tema="+tema+"&classe="+classe+"&estilo="+estilo
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"editasimbolo",reMontaEditor);
}
//adiciona estilo
function adicionaestilo()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&opcao=adicionaestilo&tema="+tema+"&classe="+classe+"&estilo="+estilo
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"editasimbolo",reMontaEditor);
}
//sobe estilo
function sobeestilo()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&opcao=sobeestilo&tema="+tema+"&classe="+classe+"&estilo="+estilo
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"editasimbolo",reMontaEditor);
}
//desce estilo
function desceestilo()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=editasimbolo&opcao=desceestilo&tema="+tema+"&classe="+classe+"&estilo="+estilo
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"editasimbolo",reMontaEditor);
}
//remonta o editor de simbolos
function reMontaEditor()
{
	var id = tema+"-"+classe //layer+indice da classe
	editaSimbolo(id)
}
//cria cores
function paleta()
{
	var retornapaleta = function()
	{
		aguarde("none")
		window.parent.ajaxredesenha("");
		mostralegenda();
	}
	var ci = $i("acori").value
	var cf = $i("acorf").value
	aguarde("block")
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=alteraCoresClasses&tema="+tema+"&cori="+ci+"&corf="+cf
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"alteraCoresClasses",retornapaleta);
}