
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Upload KML

Envia para o servidor um arquivo no formato KML local e insere como novas camadas no mapa.

Veja:

<i3GEO.arvoreDeTemas.dialogo.uploadkml>

Arquivo:

i3geo/ferramentas/uploadkml/index.js.php

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
Classe: i3GEOF.uploadkml
*/
i3GEOF.uploadkml = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.uploadkml.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.uploadkml.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/uploadkml/dicionario.js",
				"i3GEOF.uploadkml.iniciaJanelaFlutuante()",
				"i3GEOF.uploadkml.dicionario_script"
			);
		}
		else{
			i3GEOF.uploadkml.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.uploadkml.html();
			new YAHOO.widget.Button(
				"i3GEOuploadkmlbotao1",
				{onclick:{fn: i3GEOF.uploadkml.submete}}
			);
			i3GEO.util.radioEpsg(
				function(retorno)
				{$i("i3GEOuploadkmlListaepsg").innerHTML = retorno.dados;},
				"i3GEOuploadkmlListaepsg",
				"uploadkml"
			);
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
		var ins = '<form id=i3GEOuploadkmlf target="i3GEOuploadkmliframe" action="'+i3GEO.configura.locaplic+'/ferramentas/uploadkml/upload.php" method="post" ENCTYPE="multipart/form-data">' +
		'<p class="paragrafo" style=color:red >N&atilde;o use arquivos ou nome de layer com espa&ccedil;os em branco ou acentua&ccedil;&atilde;o</p>' +
		'<p class="paragrafo" >Arquivo kml: <br><input type="file" size=22 name="i3GEOuploadkml" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p class=paragrafo >Nome do layer KML: <br><input type=text size=42 name=layerkml value=""/></p>' +
		'<p class=paragrafo >Proje&ccedil;&atilde;o:</p>' +
		'<div id=i3GEOuploadkmlListaepsg width="98%" style="text-align:left;border:1px solid gray;left:0px;overflow:auto;height:60px"></div>' +
		'<br><p class="paragrafo" ><input id=i3GEOuploadkmlbotao1 type="button" value="Criar camada" size=12 name="submit">' +
		'<br><p class="paragrafo" >O nome do "layer" corresponde ao elemento folder->name existente no arquivo KML. Para descobrir esse valor, abra o arquivo KML em um editor de textos comum.</p>'+
		'<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="100000">' +
		'</form>' +
		'<br><iframe name=i3GEOuploadkmliframe style="text-align:left;border:1px solid gray;" width="98%" height="60px"></iframe>';
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
			i3GEO.janela.minimiza("i3GEOF.uploadkml");
		};
		titulo = "KML <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=104' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"450px",
			"360px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.uploadkml",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.uploadkml_corpo").style.backgroundColor = "white";
		i3GEOF.uploadkml.aguarde = $i("i3GEOF.uploadkml_imagemCabecalho").style;
		i3GEOF.uploadkml.inicia(divid);
	},
	/*
	Function: submete

	Submete o arquivo ao servidor.
	*/
	submete: function(){
		if(i3GEOF.uploadkml.aguarde.visibility==="visible")
		{return;}
		i3GEOF.uploadkml.aguarde.visibility="visible";
		$i("i3GEOuploadkmlf").submit();
	}
};

