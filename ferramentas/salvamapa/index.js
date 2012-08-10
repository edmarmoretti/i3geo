
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Salva mapa

Faz o download do mapfile atualmente em uso. Posteriormente, o mapfile pode ser enviado de volta ao servidor para restaurar o mapa

Veja:

<i3GEO.mapa.dialogo.salvaMapa>

Arquivo: i3geo/ferramentas/salvamapa/index.js.php

About: Licen&ccedil;a

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
Classe: i3GEOF.salvaMapa
*/
i3GEOF.salvaMapa = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.salvaMapa.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.salvaMapa.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/salvamapa/dicionario.js",
				"i3GEOF.salvaMapa.iniciaJanelaFlutuante()",
				"i3GEOF.salvaMapa.dicionario_script"
			);
		}
		else{
			i3GEOF.salvaMapa.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		var temp = function(){
			try{
				var teste,
					map_file = i3GEO.parametros.mapfile,
					local = map_file.split("ms_tmp");
				teste = i3GEO.configura.locaplic+"/testamapfile.php?map="+map_file;
				local = i3GEO.util.protocolo()+"://"+window.location.host+"/ms_tmp"+local[1];
				$i(iddiv).innerHTML += i3GEOF.salvaMapa.html()+"<a href='"+local+"' target='_blank' >Clique aqui para baixar o arquivo</a><br>";
				$i(iddiv).innerHTML += "<a href='"+teste+"' target='_blank' >Clique aqui para testar</a>";
			}
			catch(erro){alert(erro);}
		},
		atualiza = true,
		geo = false;
		if(i3GEO.Interface.ATUAL === "googlemaps" || i3GEO.Interface.ATUAL === "googleearth"){
			atualiza = false;
			geo = true;
		}
		i3GEO.php.mudaext(temp,"nenhum",i3GEO.parametros.mapexten,i3GEO.configura.locaplic,i3GEO.configura.sid,atualiza,geo);
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins += '<p class="paragrafo" >Salvando o mapa atual, voc&ecirc; poder&aacute; carreg&aacute;-lo novamente. Clique no link abaixo com o bot&atilde;o direito do mouse e salve o arquivo em seu computador.';
		ins += '<p class="paragrafo" >Para carregar o mapa salvo anteriormente, utilize a op&ccedil;&atilde;o de carregar mapa.';
		ins += '<p class="paragrafo" >';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		titulo = $trad("u17")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=10' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.salvaMapa",
			true,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.salvaMapa.aguarde = $i("i3GEOF.salvaMapa_imagemCabecalho").style;
		i3GEOF.salvaMapa.inicia(divid);
	}
};
