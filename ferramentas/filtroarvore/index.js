
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Filtro da &aacute;rvore de camadas

Veja:

<i3GEO.arvoreDeCamadas.dialogo.filtro>

Arquivo:

i3geo/ferramentas/filtroarvore/index.js.php

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
Classe: i3GEOF.filtroarvore

*/
i3GEOF.filtroarvore = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.filtroarvore.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.filtroarvore.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/filtroarvore/dicionario.js",
				"i3GEOF.filtroarvore.iniciaJanelaFlutuante()",
				"i3GEOF.filtroarvore.dicionario_script"
			);
		}
		else{
			i3GEOF.filtroarvore.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.filtroarvore.html();
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
		var ins = '<p class=paragrafo >'+$trad('selecionaFiltro',i3GEOF.filtroarvore.dicionario)+'<br><br>' +
			'<select onchange="i3GEO.arvoreDeCamadas.ARVORE = null;i3GEO.arvoreDeCamadas.FILTRO = this.value;i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true)">' +
			'<option value="naofaznada">---</option>' +
			'<option value="">'+$trad('removeFiltro',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="ligados">'+$trad('ligado',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="desligados">'+$trad('desligado',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="selecionados">'+$trad('comSelecao',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="download">'+$trad('permiteDownload',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="wms">'+$trad('wms',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="raster">'+$trad('raster',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'<option value="toponimia">'+$trad('apenasTexto',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'</select><br><br>' +
			$trad('operacao',i3GEOF.filtroarvore.dicionario)+'<br><br>' +
			'<select onchange="i3GEOF.filtroarvore.lote(this)" >' +
			'<option value="">---</option>' +
			'<option value="excluir">'+$trad('exclui',i3GEOF.filtroarvore.dicionario)+'</option>' +
			'</select>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.filtroarvore");
		};
		//cria a janela flutuante
		titulo = $trad("t29")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=97' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"220px",
			"140px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.filtroarvore",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.filtroarvore_corpo").style.backgroundColor = "white";
		$i("i3GEOF.filtroarvore_corpo").style.textAlign = "left";
		i3GEOF.filtroarvore.aguarde = $i("i3GEOF.filtroarvore_imagemCabecalho").style;
		i3GEOF.filtroarvore.inicia(divid);
	},
	/*
	Function: lote

	Executa uma opera&ccedil;&atilde;o em lote sobre as camadas mostradas no mapa

	*/
	lote: function(objeto){
		var operacao = objeto.value,
			lista = i3GEO.arvoreDeCamadas.listaLigadosDesligados();
		if(operacao === "excluir"){
			i3GEO.janela.confirma(
				"Remove todos do mapa?",
				300,
				$trad("x14"),
				$trad("x15"),
				function(){i3GEO.php.excluitema(i3GEO.atualiza,lista[2]);}
			);
		}
		objeto.value = "";
	}
};
