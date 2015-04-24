/*
Title: Imprimir

Abre janela de op&ccedil;&otilde;es para impress&atilde;o do mapa atual

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
Classe: i3GEOF.imprimir

*/
i3GEOF.imprimir = {
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.imprimir.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.imprimir.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.imprimir.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/imprimir/dicionario.js",
				"i3GEOF.imprimir.iniciaJanelaFlutuante()",
				"i3GEOF.imprimir.dicionario_script"
			);
		}
		else{
			i3GEOF.imprimir.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.imprimir.html();

			new YAHOO.widget.Button("i3GEOFimprimirPdf", {
				onclick : {
					fn : function() {
						var url = i3GEO.configura.locaplic+"/ferramentas/imprimir/a4lpaisagempdf.htm";
						i3GEOF.imprimir.abreI(url);
					}
				}
			});
			new YAHOO.widget.Button("i3GEOFimprimirTiff", {
				onclick : {
					fn : function() {
						var url = i3GEO.configura.locaplic+"/ferramentas/imprimir/geotif.php";
						i3GEOF.imprimir.abreI(url,"interna");
					}
				}
			});
			new YAHOO.widget.Button("i3GEOFimprimirAgg", {
				onclick : {
					fn : function() {
						var url = i3GEO.configura.locaplic+"/ferramentas/imprimir/aggpng.php";
						i3GEOF.imprimir.abreI(url,"interna");
					}
				}
			});
			new YAHOO.widget.Button("i3GEOFimprimirJpg", {
				onclick : {
					fn : function() {
						var url = i3GEO.configura.locaplic+"/ferramentas/imprimir/jpeg.php";
						i3GEOF.imprimir.abreI(url,"interna");
					}
				}
			});
			new YAHOO.widget.Button("i3GEOFimprimirSvg", {
				onclick : {
					fn : function() {
						var url = i3GEO.configura.locaplic+"/ferramentas/imprimir/svg.php";
						i3GEOF.imprimir.abreI(url,"interna");
					}
				}
			});
			//opcoes
			var b = new YAHOO.widget.Button("i3GEOFimprimirLegenda", {
				onclick : {
					fn : function() {
						i3GEO.mapa.dialogo.opcoesLegenda();
					}
				}
			});
			b.addClass("abrir200");
			var b = new YAHOO.widget.Button("i3GEOFimprimirEscala", {
				onclick : {
					fn : function() {
						i3GEO.mapa.dialogo.opcoesEscala();
					}
				}
			});
			b.addClass("abrir200");
			var b = new YAHOO.widget.Button("i3GEOFimprimirTamanho", {
				onclick : {
					fn : function() {
						i3GEO.mapa.dialogo.tamanho();
					}
				}
			});
			b.addClass("abrir200");
			var b = new YAHOO.widget.Button("i3GEOFimprimirLogo", {
				onclick : {
					fn : function() {
						i3GEO.mapa.dialogo.ativaLogo();
					}
				}
			});
			b.addClass("abrir200");

			var temp = function(retorno){
				g_legendaHTML = retorno.data.legenda;
			};
			i3GEO.php.criaLegendaHTML(temp,"","legendaseminput.htm");
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
		var ins = Mustache.render(i3GEOF.imprimir.MUSTACHE, i3GEOF.imprimir.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.imprimir")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.imprimir");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GEOiconeFerramenta i3GEOiconeImprimir'></span><div class='i3GeoTituloJanela'>" + $trad("d12") + "<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=49' >&nbsp;&nbsp;&nbsp;</a></div>";
		janela = i3GEO.janela.cria(
			"250px",
			"230px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.imprimir",
			false,
			"hd",
			cabecalho,
			""
		);
		divid = janela[2].id;
		$i("i3GEOF.imprimir_corpo").style.backgroundColor = "white";
		$i("i3GEOF.imprimir_corpo").style.textAlign = "left";
		i3GEOF.imprimir.aguarde = $i("i3GEOF.imprimir_imagemCabecalho").style;
		i3GEOF.imprimir.inicia(divid);
	},
	/*
	Function: abreI

	Abre uma nova janela com o resultado da impress&atilde;o.

	Parameters:

	obj {objeto INPUT}

	tipoAbertura {string} - (opcional) se for "interna" abre em uma janela interna do mapa
	*/
	abreI: function(url,tipoAbertura){
		var interf = i3GEO.Interface.ATUAL;
		if(i3GEO.Interface.openlayers.googleLike === true){
			interf = "googlemaps";
		}
		url = url+"?g_sid="+i3GEO.configura.sid+"&interface="+interf+"&mapexten="+i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		var id = "imprimir"+Math.random();
		if(tipoAbertura){
			i3GEO.janela.cria("350px","350px",url,"","","<div class='i3GeoTituloJanela'>Arquivos</div>",id);
		}
		else{
			window.open(url);
		}
	}
};
