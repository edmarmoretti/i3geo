<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Salva mapa

Faz o download do mapfile atualmente em uso. Posteriormente, o mapfile pode ser enviado de volta ao servidor para restaurar o mapa

Veja:

<i3GEO.mapa.dialogo.salvaMapa>

Arquivo: i3geo/ferramentas/salvamapa/index.js.php

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.carregaMapa
*/
i3GEOF.salvaMapa = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			var map_file = i3GEO.parametros.mapfile,
				local = map_file.split("ms_tmp");
			local = window.location.protocol+"//"+window.location.host+"/ms_tmp"+local[1];
			$i(iddiv).innerHTML += i3GEOF.salvaMapa.html()+"<a href='"+local+"' target='_blank' >Clique aqui para baixar o arquivo</a>";
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '';
		ins += '<p class="paragrafo" >Salvando o mapa atual, voc&ecirc; poder&aacute; carreg&aacute;-lo novamente. Clique no link abaixo com o bot&atilde;o direito do mouse e salve o arquivo em seu computador.';
		ins += '<p class="paragrafo" >Para carregar o mapa armazenado, utilize a op&ccedil;&atilde;o de carregar mapa.';
		ins += '<p class="paragrafo" >';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		titulo = "Salva o mapa <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=10' >&nbsp;&nbsp;&nbsp;</a>";
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
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>