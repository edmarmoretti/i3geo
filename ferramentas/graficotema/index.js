/*
Title: Gr&aacute;fico tema

Inclui gr&aacute;ficos em cada elemento de um tema tendo como fonte a tabela de atributos. &Eacute; criado um novo tema no mapa com
os gr&aacute;ficos. Abre uma janela com v&aacute;rias op&ccedil;&otilde;es e lista de itens para os gr&aacute;ficos.
O tema que ser&aacute; utilizado &eacute; o que estiver armazenado na vari&aacute;vel global i3GEO.temaAtivo

Arquivo:

i3geo/ferramentas/graficotema/index.js.php

Licenca:

GPL2

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
Classe: i3GEOF.graficoTema

*/
i3GEOF.graficoTema = {
	propriedades : {
		mesmoTema : false
	},
	tema : i3GEO.temaAtivo,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.graficoTema.iniciaDicionario();
	},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MUSTACHELISTA : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.graficoTema.dicionario);
		return dicionario;
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.graficoTema.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/graficotema/dicionario.js",
				"i3GEOF.graficoTema.iniciaJanelaFlutuante()",
				"i3GEOF.graficoTema.dicionario_script"
			);
		}
		else{
			i3GEOF.graficoTema.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.graficoTema.MUSTACHE == ""){
			var t1 = i3GEO.configura.locaplic + "/ferramentas/graficotema/template_mst.html",
			t2 = i3GEO.configura.locaplic + "/ferramentas/graficotema/templateLista_mst.html";

			$.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
				i3GEOF.graficoTema.MUSTACHE = r1[0];
				i3GEOF.graficoTema.MUSTACHELISTA = r2[0];
				i3GEOF.graficoTema.inicia(iddiv);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		}


		if(i3GEOF.graficoTema.tema === ""){
			//$i(iddiv).innerHTML = "";			return;
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.graficoTema.html();

			if (!$i("i3GEOFgraficotemaComboCabecaSel")) {
				i3GEO.janela.comboCabecalhoTemasBs("i3GEOFgraficotemaComboCabeca","i3GEOFgraficotemaComboCabecaSel","graficoTema","ligadosComTabela",function(evt){
					var botao = evt.target;
					if (botao) {
						if (botao.value != "") {
							i3GEO.mapa.ativaTema(botao.value);
							i3GEOF.graficoTema.tema = botao.value;
							$i(iddiv).innerHTML = "";
							i3GEOF.graficoTema.inicia(iddiv);
						} else {
							//$i(iddiv).innerHTML = "";
						}
					}
				});
			}

			i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia1","i3GEOgraficotemaguia");
			//eventos das guias
			$i("i3GEOgraficotemaguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia1","i3GEOgraficotemaguia");};
			$i("i3GEOgraficotemaguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia2","i3GEOgraficotemaguia");};

			//
			//pega a lista de itens e chama a fun&ccedil;&atilde;o de montagem das op&ccedil;&otilde;es de escolha
			//
			i3GEO.php.listaItensTema(i3GEOF.graficoTema.montaListaItens,i3GEOF.graficoTema.tema);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		i3GEO.util.aplicaAquarela("i3GEOgraficotemaguia2obj");
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.graficoTema.MUSTACHE, i3GEOF.graficoTema.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(propriedades){
		if(propriedades){
			i3GEOF.graficoTema.propriedades = propriedades;
		}
		var janela,divid,temp,titulo;
		if($i("i3GEOF.graficoTema")){
			i3GEOF.graficoTema.inicia("i3GEOF.graficoTema_corpo");
			return;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("t37a")+"</span></div>";
		janela = i3GEO.janela.cria(
			"400px",
			"330px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.graficoTema",
			false,
			"hd",
			"",
			"",
			"",
			true,
			"",
			"",
			"",
			"",
			"40"
		);
		divid = janela[2].id;
		i3GEOF.graficoTema.aguarde = $i("i3GEOF.graficoTema_imagemCabecalho").style;
		$i("i3GEOF.graficoTema_corpo").style.backgroundColor = "white";
		i3GEOF.graficoTema.inicia(divid);
	},
	/*
	Function: montaListaItens

	Monta a lista de itens que poder&atilde;o ser escolhidos para compor o mapa.

	A lista &eacute; inserida no elemento html com id "i3GEOgraficotemalistai"
	*/
	montaListaItens: function(retorno){
		var ins,i,n, temp = {}, mustache = [];
		try{
			ins = [];
			ins.push("<table class=lista8 >");
			n = retorno.data.valores.length;
			for (i=0;i<n; i++){
				temp = {};
				temp.item = retorno.data.valores[i].item;
				temp.rcor = i3GEO.util.randomRGB();
				mustache.push(temp);
			}
			ins = Mustache.render(
					i3GEOF.graficoTema.MUSTACHELISTA,
					$.extend(
							{},
							{
								"linhas" :  mustache,
							},
							i3GEOF.graficoTema.DICIONARIO
					)
			);
			$i("i3GEOgraficotemalistai").innerHTML = ins;
			i3GEO.util.aplicaAquarela("i3GEOgraficotemalistai");
		}
		catch(e)
		{$i("i3GEOgraficotemalistai").innerHTML = "<p style=color:red >Erro<br>"+e;}
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaItensMarcados

	Recupera os itens que foram marcados e monta uma lista para enviar como parametro para a fun&ccedil;&atilde;o de gera&ccedil;&atilde;o dos gr&aacute;ficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOgraficotemalistai").getElementsByTagName("input"),
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
				listadeitens.push(it.replace("i3GEOgraficotema","")+","+c);
			}
		}
		return(listadeitens.join("*"));
	},
	/*
	Function: criaNovoTema

	Cria um novo tema que ir&aacute; conter os gr&aacute;ficos e adiciona ao mapa.

	Veja:

	<GRAFICOTEMA>
	*/
	criaNovoTema: function(){
		try{
			if(i3GEOF.graficoTema.aguarde.visibility === "visible")
			{return;}
			var lista = i3GEOF.graficoTema.pegaItensMarcados(),
				nlista = lista.split("*").length,
				outlinecolor = $i("i3GEOgraficotemaoutlinecolor").value,
				offset = $i("i3GEOgraficotemaoffset").value,
				tipo = $i("i3GEOgraficotematipo").value,
				tamanho,
				temp,
				cp = new cpaint(),
				p;
			if(nlista < 2){
				i3GEO.janela.tempoMsg($trad('msgSelecionaItens',i3GEOF.graficoTema.dicionario));
				return;
			}
			if (tipo === "PIE"){tamanho = $i("i3GEOgraficotemalargura").value;}
			else
			{tamanho = $i("i3GEOgraficotemalargura").value+" "+$i("i3GEOgraficotemaaltura").value;}
			if(lista === "")
			{i3GEO.janela.tempoMsg("selecione um item");return;}
			i3GEOF.graficoTema.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.graficoTema.aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
				if(i3GEOF.graficoTema.propriedades.mesmoTema === true){
					i3GEO.Interface.atualizaTema(retorno,i3GEOF.graficoTema.tema);
				}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/graficotema/exec.php?"
			+ "g_sid="+i3GEO.configura.sid
			+ "&funcao=graficotema"
			+ "&tema="+i3GEOF.graficoTema.tema
			+ "&lista="+lista
			+ "&tamanho="+tamanho
			+ "&tipo="+tipo
			+ "&outlinecolor="+outlinecolor
			+ "&offset="+offset
			+ "&mesmoTema="+i3GEOF.graficoTema.propriedades.mesmoTema;
			cp.set_response_type("JSON");
			cp.call(p,"graficotema",temp);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.graficoTema.aguarde.visibility = "hidden";}
	}
};