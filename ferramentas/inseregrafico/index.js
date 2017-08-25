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
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.insereGrafico.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.insereGrafico.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/inseregrafico/template_mst.html", function(template) {
				i3GEOF.insereGrafico.MUSTACHE = template;
				i3GEOF.insereGrafico.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.insereGrafico.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");
			//eventos das guias
			$i("i3GEOinseregraficoguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");};
			$i("i3GEOinseregraficoguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia2","i3GEOinseregraficoguia");};
			i3GEOF.insereGrafico.ativaFoco();
			i3GEOF.insereGrafico.comboTemas();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.insereGrafico.MUSTACHE, i3GEOF.insereGrafico.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if ($i("i3GEOF.insereGrafico")) {
			return;
		}
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.insereGrafico.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.insereGrafico",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("t37") + "</span></div>";
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
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"80"
		);
		divid = janela[2].id;
		$i("i3GEOF.insereGrafico_corpo").style.backgroundColor = "white";
		i3GEOF.insereGrafico.aguarde = $i("i3GEOF.insereGrafico_imagemCabecalho").style;
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.insereGrafico.insere()"]);
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.insereGrafico.insere()"]);
			i3GEO.eventos.cliquePerm.ativa();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEOF.insereGrafico.inicia(divid);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.eventos.cliquePerm.desativa();
		temp = Math.random() + "a";
		temp = temp.split(".");
		g_nomepin = "pin"+temp[1];
	},
	/*
	Function: insere

	Insere um grafico no mapa na posi&ccedil;&atilde;o clicada

	O ponto &eacute; obtidos do objeto objposicaocursor e os demais parametros da janela interna aberta no iframe "wdocai"

	Veja:

	<i3GEO.php.insereSHPgrafico>
	*/
	insere: function(){
		var tema = $i("i3GEOinseregraficotemasLigados").value,
			width = $i("i3GEOinseregraficow").value,
			inclinacao = $i("i3GEOinseregraficoinclinacao").value,
			shadow_height = $i("i3GEOinseregraficosombra").value,
			itens,
			temp;
		if (tema === ""){i3GEO.janela.tempoMsg($trad('semTemaDefinido',i3GEOF.insereGrafico.dicionario));}
		else{
			itens = i3GEOF.insereGrafico.pegaItensMarcados();
			if (itens === "")
			{i3GEO.janela.tempoMsg($trad('semItemEscolhido',i3GEOF.insereGrafico.dicionario));}
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
			" ",
			false,
			true,
			"form-control comboTema"
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
			var i,c,
				n,
				ins = "";
			n = retorno.data.valores.length;
			for (i=0;i<n; i++){
				ins += '<li><div class="form-group condensed"><div style="display:inline;width:100px;" class="checkbox text-left"><label>'
					+ '<input type="checkbox" name="'
					+ retorno.data.valores[i].item + '">'
					+ '<span class="checkbox-material noprint"><span class="check"></span></span> '
					+ retorno.data.valores[i].item
					+ '</label></div>';

				ins += 	'&nbsp;<div style="display:inline-block;" class="form-group label-fixed condensed" >'
					+ '<input style="width:100px;" class="form-control input-lg i3geoFormIconeAquarela" type="text" value="' + i3GEO.util.randomRGB() + '" id="cliqueGr' + i + '"/></div></div></li>';
			}
			$i("i3GEOinseregraficolistai").innerHTML = ins;
			i3GEO.util.aplicaAquarela("i3GEOinseregraficolistai");
		}
		catch(e)
		{$i("i3GEOinseregraficolistai").innerHTML = "<p style=color:red >Erro "+e+"<br>";}
	},
	/*
	Function: pegaItensMarcados

	Recupera os itens que foram marcados e monta uma lista para enviar como parametro para a fun&ccedil;&atilde;o de gera&ccedil;&atilde;o dos gr&aacute;ficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOinseregraficolistai").getElementsByTagName("li"),
			i,linah,
			it,
			n;
		n = inputs.length;
		for (i=0;i<n; i++){
			it = inputs[i].getElementsByTagName("input");
			if (it[0].checked === true)	{
				listadeitens.push(it[0].name+","+it[1].value);
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
			par = "<div class='container-fluid'><table>";
			i = temp.length-1;
			if(i >= 0)
			{
				do
				{
					t = temp[i];
					t = t.split(",");
					par += "<tr style='text-align:left'><td style='width:20px;background-color:rgb("+t[1]+","+t[2]+","+t[3]+") !Important;'>&nbsp;&nbsp;</td><td style='text-align:left'> "+t[0]+"</td></tr>";
				}
				while(i--);
			}
			par += "</table></div>";
			w = i3GEO.janela.cria(200,200,"","center","center","<div class='i3GeoTituloJanela'>Legenda</div>","FlegendaGr");
			w = w[2].id;
			$i(w).innerHTML = par;
		}
		catch(e){i3GEO.janela.tempoMsg("Erro. legendaGrafico"+e);}
	}
};