/*
Title: Ferramenta análise de geometrias

File: i3geo/ferramentas/analisageometrias/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Class: i3GEOF.analisaGeometrias

Inclui gráficos em cada elemento de um tema tendo como fonte a tabela de atributos.

Abre uma janela com várias opções e lista de itens para os gráficos.

O tema que será utilizado é o que estiver armazenado na variável global i3GEO.temaAtivo
*/
i3GEOF.analisaGeometrias = {
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.analisaGeometrias.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias1","i3GEOanalisageometrias");
			//eventos das guias
			$i("i3GEOanalisageometrias1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometriasa1","i3GEOanalisageometrias");};
			$i("i3GEOanalisageometrias2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias2","i3GEOanalisageometrias");};
			
			new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotao1",
				{onclick:{fn: i3GEOF.analisaGeometrias.capturageo}}
			);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen1",$i("i3GEOanalisageometriasmen1").innerHTML);
			g_tipoacao="";
			g_operacao="";
			i3GEOF.analisaGeometrias.ativaFoco();
			var combot = "<select style='font-size:11px' id='i3GEOanalisageometriastipoOperacao' onchange='i3GEOF.analisaGeometrias.operacao(this)' >"
			combot += "<option value='adiciona' >Adiciona</option>"
			combot += "<option value='retira' >Retira</option>"
			combot += "<option value='inverte' >Inverte</option>"
			combot += "<option value='limpa' >Limpa</option>"
			combot += "</select>"
			$i("i3GEOanalisageometriasoperacao").innerHTML = combot

		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEOinseregraficoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias1" style="text-align:center;left:0px;" >Capturar</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias2" style="text-align:center;left:0px;" >Listar</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias3" style="text-align:center;left:0px;" >Analisar</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div>';
		ins += '<div class="geralFerramentas" style="left:0px;top:0px;width:98%;height:86%;">';
		ins += '	<div class=guiaobj id="i3GEOanalisageometrias1obj" style="left:1px;90%;display:none;">';
		ins += '		<p class=paragrafo >Escolha o tema que receber&aacute; a sele&ccedil;&atilde;o:';
		ins += '		<div id="i3GEOanalisageometriastemas" style="width:90%;text-align:left;left:0px">';
		ins += '		</div><br>';
		ins += '		<p class=paragrafo >Tipo de sele&ccedil;&atilde;o:';
		ins += '		<div id="i3GEOanalisageometriasoperacao" style="width:90%;text-align:left;left:0px">';
		ins += '		</div><br>';
		ins += '		<input id=i3GEOanalisageometriasbotao1 size=45 type=button value="Capturar as geometrias selecionadas"/><br><br>';
		ins += '		<div id=i3GEOanalisageometriasmen1 style="top:5px;left:0px"><p class=paragrafo >Ap&oacute;s escolher o tema, clique no mapa para selecionar os elementos desejados, caso vc j&aacute; n&atilde;o tenha feito isso ou caso deseje alterar a sele&ccedil;&atilde;o. Conclu&iacute;da a sele&ccedil;&atilde;o, clique no bot&atilde;o de captura para obter as geometrias. <br>As geometrias capturadas podem ser vistas na segunda guia.';
		ins += '		</div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOanalisageometrias2obj" style="left:1px;display:none;">';
		
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOanalisageometrias3obj" style="left:1px;display:none;">';

		ins += '	</div>';
		ins += '</div>	';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabeçalho da janela
		cabecalho = function(){
			i3GEOF.analisaGeometrias.ativaFoco();
		};
		minimiza = function(){
			var temp = $i("i3GEOF.analisaGeometrias_corpo");
			if(temp){
				if(temp.style.display === "block")
				{temp.style.display = "none";}
				else
				{temp.style.display = "block";}
			}
		};
		//cria a janela flutuante
		titulo = "An&aacute;lise de geometrias <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=23' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"500px",
			"400px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.analisaGeometrias",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		
		/*
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.insereGrafico.insere()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.insereGrafico.insere()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.insereGrafico.insere()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		*/			
		i3GEOF.analisaGeometrias.inicia(divid);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(g_tipoacao !== 'analisageometrias'){
			g_tipoacao='analisageometrias';
			g_operacao='analisageometrias';
			i3GEOF.analisaGeometrias.comboTemas();
		}
	},
	/*
	Function: comboTemas
	
	Cria o combo com os temas disponíveis (temas ligados) para adição dos gráficos.
	*/
	comboTemas: function(){
		i3GEO.util.comboTemasLigados(
			"i3GEOanalisageometriastemasLigados",
			function(retorno){
		 		$i("i3GEOanalisageometriastemas").innerHTML = retorno.dados;
		 		if ($i("i3GEOanalisageometriastemasLigados")){
		 			$i("i3GEOanalisageometriastemasLigados").onchange = function(){
		 				i3GEO.temaAtivo = $i("i3GEOanalisageometriastemasLigados").value;
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOanalisageometriastemasLigados").value = i3GEO.temaAtivo;
					$i("i3GEOanalisageometriastemasLigados").onchange.call();
				}
			},
			"i3GEOanalisageometriastemas"
		);
	}
};
/*
$i("guia1").onclick = function()
{mostraGuia("guia1")}
$i("guia2").onclick = function()
{mostraGuia("guia2");listageometrias();}
$i("guia3").onclick = function()
{mostraGuia("guia3");}

mensagemAjuda("men2","")
mensagemAjuda("men3","")

//combo com o tipo de operacao
//cria combo com os temas
comboTemasLigados("comboTemas",function(retorno)
{
	window.parent.g_tipoacao = "selecao";
	window.parent.i3GEO.eventos.MOUSECLIQUE.push("i3GEO.selecao.clique()");
	$i("temas").innerHTML = retorno.dados
	aguarde("none")
	$i("comboTemas").onchange = function()
	{window.parent.i3GEO.temaAtivo = $i("comboTemas").value}
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
		cp.call(p,"selecaoPT",window.parent.i3GEO.atualiza);
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
*/