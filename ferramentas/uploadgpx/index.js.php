<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: GPX

Envia para o servidor um arquivo no formato GPX local e insere como novas camadas no mapa.

Veja:

<i3GEO.arvoreDeTemas.dialogo.uploadgpx>

Arquivo:

i3geo/ferramentas/uploadgpx/index.js.php

Licenca:

GPL2

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
Classe: i3GEOF.uploadgpx
*/
i3GEOF.uploadgpx = {
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
			$i(iddiv).innerHTML += i3GEOF.uploadgpx.html();
			new YAHOO.widget.Button(
				"i3GEOuploadgpxbotao1",
				{onclick:{fn: i3GEOF.uploadgpx.submete}}
			);
			i3GEO.util.radioEpsg(
				function(retorno)
				{$i("i3GEOuploadgpxListaepsg").innerHTML = retorno.dados;},
				"i3GEOuploadgpxListaepsg",
				"uploadgpx"
			);
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
		var ins = '<form id=i3GEOuploadgpxf target="i3GEOuploadgpxiframe" action="'+i3GEO.configura.locaplic+'/ferramentas/uploadgpx/upload.php" method="post" ENCTYPE="multipart/form-data">' +
		'<p class="paragrafo" >Arquivo gpx: <br><input class=digitar type="file" size=42 name="i3GEOuploadgpx" style="top:0px;left:0px"></p>' +
		'<p class=paragrafo >Proje&ccedil;&atilde;o:</p>' +
		'<div id=i3GEOuploadgpxListaepsg style="border:1px solid gray;left:0px;overflow:auto;height:60px"></div>' +
		'<br><p class="paragrafo" ><input id=i3GEOuploadgpxbotao1 type="button" value="Criar camada" size=12 name="submit">' +
		'<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="100000">' +
		'</form>' +
		'<iframe name=i3GEOuploadgpxiframe style="text-align:left;" width="280px" height="60px"></iframe>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.uploadgpx");
		};
		titulo = "Upload de arquivo GPX <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=27' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.uploadgpx",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.uploadgpx_corpo").style.backgroundColor = "white";
		i3GEOF.uploadgpx.aguarde = $i("i3GEOF.uploadgpx_imagemCabecalho").style;
		i3GEOF.uploadgpx.inicia(divid);
	},
	/*
	Function: submete
	
	Submete o arquivo ao servidor.
	*/
	submete: function(){
		if(i3GEOF.uploadgpx.aguarde.visibility==="visible")
		{return;}
		i3GEOF.uploadgpx.aguarde.visibility="visible";
		$i("i3GEOuploadgpxf").submit();
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>
