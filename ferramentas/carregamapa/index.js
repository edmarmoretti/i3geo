
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Carrega mapa salvo

Envia um mapfile armazenado localmente para o servidor do i3Geo. O mapa deve ter sido salvo com a ferramenta
de salvar mapa.
Ao enviar o arquivo, um novo diret&oacute;rio tempor&aacute;rio &eacute; criado e o mapa &eacute; iniciado. Ao reiniciar o mapa, os layers locais são eliminados.
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
Classe: i3GEOF.carregaMapa
*/
i3GEOF.carregaMapa = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.carregaMapa.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.carregaMapa.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/carregamapa/dicionario.js",
				"i3GEOF.carregaMapa.iniciaJanelaFlutuante()",
				"i3GEOF.carregaMapa.dicionario_script"
			);
		}
		else{
			i3GEOF.carregaMapa.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.carregaMapa.html();
			new YAHOO.widget.Button(
				"i3GEOcarregamapabotao1",
				{onclick:{fn: i3GEOF.carregaMapa.submete}}
			);
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
		var ins = '';
		ins += '<p class="paragrafo" >Digite o nome do arquivo .map (não utilize espa&ccedil;o em branco ou caracteres acentuados) ou busque com o navegador de arquivos:';
		ins += '<br><br>';
		ins += '<form id=i3GEOcarregamapaf target="i3GEOcarregamaiframe" action="'+i3GEO.configura.locaplic+'/ferramentas/carregamapa/upload.php" method="post" ENCTYPE="multipart/form-data">';
		ins += '<p class="paragrafo" ><input id="i3GEOcarregamapafilemap" type="file" size=25 name="i3GEOcarregamapafilemap" style="top:0px;left:0px;cursor:pointer;">';
		ins += '<br><br>';
		ins += '<p class="paragrafo" ><input id=i3GEOcarregamapabotao1 type="button" value="Carregar arquivo" size=12 name="submit">';
		ins += '<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >';
		ins += '<input type="hidden" name="MAX_FILE_SIZE" value="10000">';
		ins += '<input type=hidden id=i3GEOcarregamapanomearq name=i3GEOcarregamapanomearq value="" >';
		ins += '</form>';
		ins += '<br><iframe name=i3GEOcarregamaiframe width="98%" height="70px" style="text-align:left;border:1px solid gray;" ></iframe>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
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
		i3GEOF.carregaMapa.aguarde.visibility="visible";
		$i("i3GEOcarregamapanomearq").value = $i("i3GEOcarregamapafilemap").value;
		$i("i3GEOcarregamapaf").submit();
	}
};
