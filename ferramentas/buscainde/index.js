
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Busca metadados na INDE

Experimental

Veja:

<i3GEO.arvoredetemas.dialogo.buscainde>

Arquivo:

i3geo/ferramentas/buscainde/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.buscainde

*/
i3GEOF.buscainde = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.buscainde.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario
	
	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
	
	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/	
	iniciaDicionario: function(){
		if(typeof(i3GEOF.buscainde.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/buscainde/dicionario.js",
				"i3GEOF.buscainde.iniciaJanelaFlutuante()",
				"i3GEOF.buscainde.dicionario_script"
			);
		}
		else{
			i3GEOF.buscainde.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.buscainde.html();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta
	
	Retorno:
	
	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '<iframe style="width:99%;height:99%;border:0px" src="'+i3GEO.configura.locaplic+'/pacotes/cswclient/csw.html"></iframe>';
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
			i3GEO.janela.minimiza("i3GEOF.buscainde");
		};
		//cria a janela flutuante
		titulo = "Cliente CSW <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=109&idajuda=8' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"550px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.buscainde",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.buscainde_corpo").style.backgroundColor = "white";
		$i("i3GEOF.buscainde_corpo").style.textAlign = "left";
		i3GEOF.buscainde.inicia(divid);
	},
};
