
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Insere gr&aacute;fico interativo

Inclui gr&aacute;ficos em elementos indicados pelo usu&aacute;rio tendo como fonte a tabela de atributos de um tema.
Abre uma janela com v&aacute;rias op&ccedil;&otilde;es e lista de itens para os gr&aacute;ficos.
O tema que ser&aacute; utilizado &eacute; o que estiver armazenado na vari&aacute;vel global i3GEO.temaAtivo

Veja:

<i3GEO.mapa.dialogo.cliqueGrafico>

Arquivo: i3geo/ferramentas/inseregrafico/index.js.php

About: Licen&ccedil;a

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.insereGrafico

*/
i3GEOF.insereGrafico = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.insereGrafico.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.insereGrafico.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/inseregrafico/dicionario.js",
				"i3GEOF.insereGrafico.iniciaJanelaFlutuante()",
				"i3GEOF.insereGrafico.dicionario_script"
			);
		}
		else{
			i3GEOF.insereGrafico.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.insereGrafico.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");
			//eventos das guias
			$i("i3GEOinseregraficoguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");};
			$i("i3GEOinseregraficoguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia2","i3GEOinseregraficoguia");};
			new YAHOO.widget.Button(
				"i3GEOinseregraficobotao1",
				{onclick:{fn: i3GEOF.insereGrafico.legenda}}
			);
			i3GEO.util.mensagemAjuda("i3GEOinseregraficomen1",$i("i3GEOinseregraficomen1").innerHTML);
			//i3GEO.php.listaItensTema(i3GEOF.graficoTema.montaListaItens,i3GEO.temaAtivo);
			i3GEOF.insereGrafico.ativaFoco();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEOinseregraficoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a  ><em><div id="i3GEOinseregraficoguia1" style="text-align:center;left:0px;" >'+$trad(1,i3GEOF.insereGrafico.dicionario)+'</div></em></a></li>';
		ins += '		<li><a  ><em><div id="i3GEOinseregraficoguia2" style="text-align:center;left:0px;" >'+$trad(2,i3GEOF.insereGrafico.dicionario)+'</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div><br>';
		ins += '	<div class=guiaobj id="i3GEOinseregraficoguia1obj" style="left:1px;display:none;">';
		ins += '		<p class="paragrafo">Escolha o tema com os dados:';
		ins += '		<div id=i3GEOinseregraficotemasi class=styled-select style="display:block;">'+$trad(3,i3GEOF.insereGrafico.dicionario)+'...';
		ins += '		</div>';
		ins += '		<div id=i3GEOinseregraficolistai class=digitar style="left:0px;top:20px;330px;height:80px;overflow:auto;display:block;">'+$trad(4,i3GEOF.insereGrafico.dicionario)+'</div>';
		ins += '		<br><br><br>';
		ins += '		<p class="paragrafo"><input id=i3GEOinseregraficobotao1 size=35  type=button value="mostrar legenda no mapa" />';
		ins += '		<div id=i3GEOinseregraficomen1 style=top:10px;left:1px ><p class="paragrafo">'+$trad(5,i3GEOF.insereGrafico.dicionario)+'</div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOinseregraficoguia2obj" style="left:1px;display:none;">';
		ins += '		<p class=paragrafo >Tamanho do c&iacute;rculo:</p>';
		ins += '		<div class=styled-select >';
		ins += '		<input type=text value=50 id=i3GEOinseregraficow />';
		ins += '		</div>';
		ins += '		<br><p class=paragrafo >'+$trad(6,i3GEOF.insereGrafico.dicionario)+':</p>';
		ins += '		<div class=styled-select >';
		ins += '		<input type=text value=1.5 id=i3GEOinseregraficoinclinacao />';
		ins += '		</div>';
		ins += '		<br><p class=paragrafo >'+$trad(7,i3GEOF.insereGrafico.dicionario)+':</p>';
		ins += '		<div class=styled-select >';
		ins += '		<input type=text value=5 id=i3GEOinseregraficosombra />';
		ins += '		</div>';
		ins += '	</div>';
		ins += '</div>	';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.insereGrafico.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.insereGrafico");
		};
		//cria a janela flutuante
		titulo = $trad("t37")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=80' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"400px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.insereGrafico",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.insereGrafico_corpo").style.backgroundColor = "white";
		i3GEOF.insereGrafico.aguarde = $i("i3GEOF.insereGrafico_imagemCabecalho").style;
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.insereGrafico.insere()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.insereGrafico.insere()");}
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.insereGrafico.insere()");
			i3GEO.eventos.cliquePerm.ativa();
			//if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.insereGrafico.comboTemas()") > 0)
			//{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.insereGrafico.comboTemas()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		//if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.insereGrafico.comboTemas()") < 0)
		//{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.insereGrafico.comboTemas()");}
		i3GEOF.insereGrafico.inicia(divid);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.eventos.cliquePerm.desativa();
		if(g_tipoacao !== 'inseregrafico'){
			i3GEO.barraDeBotoes.ativaIcone("inseregrafico");
			g_tipoacao='inseregrafico';
			g_operacao='inseregrafico';
			temp = Math.random() + "a";
			temp = temp.split(".");
			g_nomepin = "pin"+temp[1];
			i3GEOF.insereGrafico.comboTemas();
			$i("i3GEOinseregraficolistai").innerHTML = "";
			var i = $i("i3GEOF.insereGrafico_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		}
	},
	/*
	Function: insere

	Insere um grafico no mapa na posi&ccedil;&atilde;o clicada

	O ponto &eacute; obtidos do objeto objposicaocursor e os demais par�metros da janela interna aberta no iframe "wdocai"

	Veja:

	<i3GEO.php.insereSHPgrafico>
	*/
	insere: function(){
		if (g_tipoacao === "inseregrafico"){
			var tema = $i("i3GEOinseregraficotemasLigados").value,
				width = $i("i3GEOinseregraficow").value,
				inclinacao = $i("i3GEOinseregraficoinclinacao").value,
				shadow_height = $i("i3GEOinseregraficosombra").value,
				itens,
				temp;
			if (tema === ""){i3GEO.janela.tempoMsg($trad(8,i3GEOF.insereGrafico.dicionario));}
			else{
				itens = i3GEOF.insereGrafico.pegaItensMarcados();
				if (itens === "")
				{i3GEO.janela.tempoMsg($trad(9,i3GEOF.insereGrafico.dicionario));}
				else{
					temp = function(){
						i3GEOF.insereGrafico.aguarde.visibility = "hidden";
						i3GEO.atualiza();
					};
					i3GEOF.insereGrafico.aguarde.visibility = "visible";
					//i3GEO.contadorAtualiza++;
					i3GEO.php.insereSHPgrafico(temp,tema,objposicaocursor.ddx,objposicaocursor.ddy,itens,shadow_height,width,inclinacao);
				}
			}
		}
	},
	/*
	Function: comboTemas

	Cria o combo com os temas dispon&iacute;veis (temas ligados) para adi&ccedil;&atilde;o dos gr&aacute;ficos.

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOinseregraficotemasLigados",
			function(retorno){
		 		$i("i3GEOinseregraficotemasi").innerHTML = retorno.dados;
		 		if ($i("i3GEOinseregraficotemasLigados")){
		 			$i("i3GEOinseregraficotemasLigados").onchange = function(){
		 				$i("i3GEOinseregraficolistai").innerHTML = "<p style=color:red >"+$trad(3,i3GEOF.insereGrafico.dicionario)+"...<br>";
		 				i3GEO.php.listaItensTema(i3GEOF.insereGrafico.listaItens,$i("i3GEOinseregraficotemasLigados").value);
		 				i3GEO.mapa.ativaTema($i("i3GEOinseregraficotemasLigados").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOinseregraficotemasLigados").value = i3GEO.temaAtivo;
					$i("i3GEOinseregraficotemasLigados").onchange.call();
				}
			},
			"i3GEOinseregraficotemasi",
			"",
			false,
			"ligados",
			"display:block"
		);
	},
	/*
	Function: listaItens

	Monta a listagem de itens de um tema com a op&ccedil;&atilde;o de sele&ccedil;&atilde;o de cor

	Parametro:

	retorno {JSON}
	*/
	listaItens: function(retorno){
		try{
			var i,
				n,
				ins = [];
			n = retorno.data.valores.length;
			ins.push("<table class=lista >");
			for (i=0;i<n; i++){
				ins.push("<tr><td><input size=2 style='cursor:pointer' name="+retorno.data.valores[i].item+" type=checkbox id=i3GEOinseregrafico"+retorno.data.valores[i].item+" /></td>");
				ins.push("<td>&nbsp;"+retorno.data.valores[i].item+"</td>");
				ins.push("<td>&nbsp;<input onclick='javascript:this.select();' id=i3GEOinseregrafico"+retorno.data.valores[i].item+"cor type=text size=13 value="+i3GEO.util.randomRGB()+" /></td>");
				ins.push("<td>&nbsp;<img style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick=\"i3GEOF.insereGrafico.corj('i3GEOinseregrafico"+retorno.data.valores[i].item+"cor')\" /></td></tr>");
			}
			ins.push("</table>");
			$i("i3GEOinseregraficolistai").innerHTML = ins.join("");
		}
		catch(e)
		{$i("i3GEOinseregraficolistai").innerHTML = "<p style=color:red >Erro "+e+"<br>";}
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaItensMarcados

	Recupera os itens que foram marcados e monta uma lista para enviar como par�metro para a fun&ccedil;&atilde;o de gera&ccedil;&atilde;o dos gr&aacute;ficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOinseregraficolistai").getElementsByTagName("input"),
			i,
			it,
			c,
			n;
		n = inputs.length;
		for (i=0;i<n; i++)
		{
			if (inputs[i].checked === true)
			{
				it = inputs[i].id;
				c = $i(it+"cor").value;
				listadeitens.push(it.replace("i3GEOinseregrafico","")+","+c);
			}
		}
		return(listadeitens.join("*"));
	},
	/*
	Function: legenda

	Mostra a legenda no mapa do &uacute;ltimo gr&aacute;fico inserido
	*/
	legenda: function(){
		var par = i3GEOF.insereGrafico.pegaItensMarcados(),
			temp,
			i,
			t,
			w;
		try
		{
			temp = par.split("*");
			par = "<table>";
			i = temp.length-1;
			if(i >= 0)
			{
				do
				{
					t = temp[i];
					t = t.split(",");
					par += "<tr style='text-align:left'><td style='background-color:rgb("+t[1]+","+t[2]+","+t[3]+")'>&nbsp;&nbsp;</td><td style='text-align:left'>"+t[0]+"</td></tr>";
				}
				while(i--);
			}
			par += "</table>";
			w = i3GEO.janela.cria(200,200,"","center","center","Legenda","FlegendaGr");
			w = w[2].id;
			$i(w).innerHTML = par;
		}
		catch(e){i3GEO.janela.tempoMsg("Erro. legendaGrafico"+e);}
	}
};