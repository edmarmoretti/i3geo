<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Filtro da árvore de camadas

Veja:

<i3GEO.arvoreDeCamadas.dialogo.filtro>

Arquivo:

i3geo/ferramentas/filtroarvore/index.js.php

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
Classe: i3GEOF.filtroarvore

*/
i3GEOF.filtroarvore = {
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
		var box;
		try{
			$i(iddiv).innerHTML += i3GEOF.filtroarvore.html();
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
		var ins = '<p class=paragrafo >Escolha o tipo de filtro ou "nenhum" para não filtrar<br><br>' +
			'<select onchange="i3GEO.arvoreDeCamadas.ARVORE = null;i3GEO.arvoreDeCamadas.FILTRO = this.value;i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true)">' +
			'<option value="naofaznada">---</option>' +
			'<option value="">remover filtro</option>' +
			'<option value="ligados">ligados</option>' +
			'<option value="desligados">desligados</option>' +
			'<option value="selecionados">com seleção</option>' +
			'<option value="download">permitem download</option>' +
			'<option value="wms">são do tipo WMS</option>' +
			'<option value="raster">são do tipo raster</option>' +
			'<option value="toponimia">contem apenas texto</option>' +
			'</select><br><br>' +
			'Operação<br><br>' +
			'<select onchange="i3GEOF.filtroarvore.lote(this)" >' +
			'<option value="">---</option>' +
			'<option value="excluir">excluir</option>' +
			'</select>';
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
			i3GEO.janela.minimiza("i3GEOF.filtroarvore");
		};
		//cria a janela flutuante
		titulo = "Filtro <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=4' >&nbsp;&nbsp;&nbsp;</a>";
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
	
	Executa uma operação em lote sobre as camadas mostradas no mapa
	
	*/
	lote: function(objeto){
		var operacao = objeto.value,
			lista = i3GEO.arvoreDeCamadas.listaLigadosDesligados(),
			temp;
		if(operacao === "excluir"){
			if(window.confirm("Remove todos do mapa?")){
				i3GEO.php.excluitema(i3GEO.atualiza,lista[2]);
			}
		}
		objeto.value = "";
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>