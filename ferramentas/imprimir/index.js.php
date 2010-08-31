<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Imprimir

Abre janela de opções para impressão do mapa atual

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
Classe: i3GEOF.imprimir

*/
i3GEOF.imprimir = {
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
			$i(iddiv).innerHTML += i3GEOF.imprimir.html();
			var temp = function(retorno){
				g_legendaHTML = retorno.data.legenda
			}
			i3GEO.php.criaLegendaHTML(temp,"","legendaseminput.htm")
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
		var ins = '<p class=paragrafo > Escolha o modelo:</p>' +
			'<table class=lista6 width="200px">';
			if(i3GEO.Interface.ATUAL == "padrao"){
			ins += '	<tr>' +
			'		<td><input style="cursor:pointer" onclick=i3GEOF.imprimir.abreI(this) type=radio value="a4l.htm" name=cmodelo /></td>' +
			'		<td>A4 paisagem</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td ><input style="cursor:pointer" onclick=i3GEOF.imprimir.abreI(this) type=radio value="a4p.htm" name=cmodelo  /></td>' +
			'		<td >A4 retrato</td>' +
			'	</tr>';
			}
			ins += '	<tr>' +
			'		<td><input style="cursor:pointer" onclick=i3GEOF.imprimir.abreI(this) type=radio value="a4lpaisagempdf.htm" name=cmodelo /></td>' +
			'		<td>A4 com margens pdf</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input style="cursor:pointer" onclick=i3GEOF.imprimir.abreI(this) type=radio value="geotif.php" name=cmodelo /></td>' +
			'		<td>Geo Tiff</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input style="cursor:pointer" onclick=i3GEOF.imprimir.abreI(this) type=radio value="aggpng.php" name=cmodelo /></td>' +
			'		<td>Agg/Png alta qualidade</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input style="cursor:pointer" onclick=i3GEOF.imprimir.abreI(this) type=radio value="svg.php" name=cmodelo /></td>' +
			'		<td>Svg - vetorial</td>' +
			'	</tr>' +
			'</table>';
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
			i3GEO.janela.minimiza("i3GEOF.imprimir");
		};
		//cria a janela flutuante
		titulo = "Imprimir <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=49' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"220px",
			"140px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.imprimir",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.imprimir_corpo").style.backgroundColor = "white";
		$i("i3GEOF.imprimir_corpo").style.textAlign = "left";
		i3GEOF.imprimir.aguarde = $i("i3GEOF.imprimir_imagemCabecalho").style;
		i3GEOF.imprimir.inicia(divid);
	},
	/*
	Function: abreI
	
	Abre uma nova janela com o resultado da impressão.
	*/
	abreI: function(obj){
		window.open(i3GEO.configura.locaplic+"/ferramentas/imprimir/"+obj.value+"?g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL+"&mapexten="+i3GEO.parametros.mapexten);
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>