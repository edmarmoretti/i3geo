/*
Title: Carrega mapa salvo

Envia um mapfile armazenado localmente para o servidor do i3Geo. O mapa deve ter sido salvo com a ferramenta
de salvar mapa.
Ao enviar o arquivo, um novo diret&oacute;rio tempor&aacute;rio &eacute; criado e o mapa &eacute; iniciado. Ao reiniciar o mapa, os layers locais s&atilde;o eliminados.
O envio e processamento do mapa &eacute; feito pelo programa i3geo/ferramentas/carregamapa/upload.php

Veja:

<i3GEO.mapa.dialogo.carregaMapa>

Arquivo: i3geo/ferramentas/carregamapa/index.js.php

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
Classe: i3GEOF.carregaMapa
*/
i3GEOF.carregaMapa = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.carregaMapa.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["sid"] = i3GEO.configura.sid;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.carregaMapa.html();
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			var b = new YAHOO.widget.Button(
				"i3GEOcarregamapabotao1",
				{onclick:{fn: i3GEOF.carregaMapa.submete}}
			);
			b.addClass("rodar");
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
		var ins = Mustache.render(i3GEOF.carregaMapa.MUSTACHE, i3GEOF.carregaMapa.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		if($i("i3GEOF.carregaMapa")){
			return;
		}
		titulo = $trad("u18")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=11' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"340px",
			"240px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.carregaMapa",
			true,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.carregaMapa.aguarde = $i("i3GEOF.carregaMapa_imagemCabecalho").style;
		i3GEOF.carregaMapa.inicia(divid);
	},
	/*
	Function: submete

	Envia o arquivo para o servidor
	*/
	submete: function(){
		if(i3GEOF.carregaMapa.aguarde.visibility==="visible")
		{return;}
		i3GEOF.carregaMapa.aguarde.visibility="visible";
		$i("i3GEOcarregamapaf").submit();
	}
};
