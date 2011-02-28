<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Importar WMC

Importa um arquivo WMC (Web Map Context) e acrescenta ascamadas ao mapa atual.

Veja:

<i3GEO.arvoreDeTemas.dialogo.importarwmc>

Arquivo:

i3geo/ferramentas/importarwmc/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

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
Classe: i3GEOF.importarwmc
*/
i3GEOF.importarwmc = {
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
			$i(iddiv).innerHTML += i3GEOF.importarwmc.html();
			new YAHOO.widget.Button(
				"i3GEOimportarwmcbotao1",
				{onclick:{fn: i3GEOF.importarwmc.submete}}
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
		var ins = '<form id=i3GEOimportarwmcf target="i3GEOimportarwmciframe" action="'+i3GEO.configura.locaplic+'/ferramentas/importarwmc/upload.php" method="post" ENCTYPE="multipart/form-data">' +
		'<p class="paragrafo" >Arquivo: <br><input class=digitar type="file" size=42 name="i3GEOimportarwmc" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p class="paragrafo" >Ou URL: <br><input class=digitar type="text" size=42 name="i3GEOimportarwmcurl" style="top:0px;left:0px;cursor:text;"></p>' +
		'<br><p class="paragrafo" ><input id=i3GEOimportarwmcbotao1 type="button" value="Importar" size=12 name="submit">' +
		'<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="100000">' +
		'</form>' +
		'<br><iframe name=i3GEOimportarwmciframe style="text-align:left;border:1px solid gray;" width="98%" height="60px"></iframe>';
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
			i3GEO.janela.minimiza("i3GEOF.importarwmc");
		};
		titulo = "Upload de arquivo importarwmc <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=27' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"320px",
			"280px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.importarwmc",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.importarwmc_corpo").style.backgroundColor = "white";
		i3GEOF.importarwmc.aguarde = $i("i3GEOF.importarwmc_imagemCabecalho").style;
		i3GEOF.importarwmc.inicia(divid);
	},
	/*
	Function: submete
	
	Submete o arquivo ao servidor.
	*/
	submete: function(){
		if(i3GEOF.importarwmc.aguarde.visibility==="visible")
		{return;}
		i3GEOF.importarwmc.aguarde.visibility="visible";
		$i("i3GEOimportarwmcf").submit();
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>
