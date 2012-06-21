
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Quadros de animação

Configura e executa a animação do mapa, sobrepondo em sequência as imagens já produzidas pelo mapa

Veja:

<i3GEO.gadgets.quados.opcoes>

Arquivo:

i3geo/ferramentas/opcoes_quadros/index.js.php

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
Classe: i3GEOF.opcoesQuadros
*/
i3GEOF.opcoesQuadros = {
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
			$i(iddiv).innerHTML += i3GEOF.opcoesQuadros.html();
			new YAHOO.widget.Button(
				"i3GEOopcoesQuadrosbotao1",
				{onclick:{fn: i3GEOF.opcoesQuadros.limpa}}
			);
			new YAHOO.widget.Button(
				"i3GEOopcoesQuadrosbotao2",
				{onclick:{fn: i3GEOF.opcoesQuadros.executa}}
			);
			$i("i3GEOopcoesQuadrosnquadros").onchange = function(){
				i3GEO.gadgets.quadros.inicia($i("i3GEOopcoesQuadrosnquadros").value);
				i3GEO.gadgets.quadros.quadroatual = -1;
			};
			i3GEOF.opcoesQuadros.aguarde.visibility = "hidden";
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
		var ins = '<table summary="" class=lista >' + 
			'<tr><td>Tempo:</td><td>' +
			$inputText("","","i3GEOopcoesQuadrostempoanima","",4,"450") +	
			'</td></tr><tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>N. de quadros:</td><td>' +
			$inputText("","","i3GEOopcoesQuadrosnquadros","",4,i3GEO.gadgets.quadros.quadrosfilme.length) +
			'</tr></table><br>' +
			'<p class=paragrafo ><input id=i3GEOopcoesQuadrosbotao1 size=10  type=button value="Limpa"/>' +
			'<p class=paragrafo ><input  id=i3GEOopcoesQuadrosbotao2 size=10 type=button value="Mostra"/>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesQuadros");
		};
		//cria a janela flutuante
		titulo = "Quadros <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=6&idajuda=54' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"170px",
			"130px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesQuadros",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesQuadros_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesQuadros_corpo").style.textAlign = "left";
		i3GEOF.opcoesQuadros.aguarde = $i("i3GEOF.opcoesQuadros_imagemCabecalho").style;
		i3GEOF.opcoesQuadros.inicia(divid);
	},
	/*
	Function: executa
	
	Executa a animação
	
	Veja:
	
	<i3GEO.gadgets.quadros.anima>
	*/
	executa: function(){
		i3GEO.gadgets.quadros.anima(0,$i("i3GEOopcoesQuadrostempoanima").value);
	},
	/*
	Function: limpa
	
	Limpa o gadget quadros
	*/
	limpa: function(){
		i3GEO.gadgets.quadros.inicia(i3GEO.gadgets.quadros.quadrosfilme.length);
		i3GEO.gadgets.quadros.quadroatual = -1;
	}
};
