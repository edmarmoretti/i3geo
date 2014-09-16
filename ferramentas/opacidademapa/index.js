
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: opacidademapa

Altera a opacidade de todas as camadas existentes no mapa modificando o estilo.

O Mapfile n&atilde;o &eacute; alterado, apenas o estilo dos elementos HTML.

Veja:

<i3GEO.tema.dialogo.opacidademapa>

Arquivo:

i3geo/ferramentas/opacidademapa/index.js.php

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
Classe: i3GEOF.opacidademapa
*/
i3GEOF.opacidademapa = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: janela

	Janela flutuante criada

	Type:
	{YAHOO.panel}
	*/
	janela: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.opacidademapa.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.opacidademapa.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/opacidademapa/dicionario.js",
				"i3GEOF.opacidademapa.iniciaJanelaFlutuante()",
				"i3GEOF.opacidademapa.dicionario_script"
			);
		}
		else{
			i3GEOF.opacidademapa.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFopacidademapaComboCabeca","i3GEOFopacidademapaComboCabecaSel","tabela","ligados");
		try{
			$i(iddiv).innerHTML = i3GEOF.opacidademapa.html();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		i3GEOF.opacidademapa.criaslide();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = "";
		if(navm){
			ins += '<div id="slider-bg" class="yui-h-slider" style="background: url('+i3GEO.configura.locaplic+'/pacotes/yui290/build/slider/assets/bg-h.gif) no-repeat -108px 0;height: 28px;width: 210px;" tabindex="-1" title="Slider">' +
				'<div id="slider-thumb" class="yui-slider-thumb"><img src="'+i3GEO.configura.locaplic+'/pacotes/yui290/build/slider/assets/thumb-n.gif"></div>' +
				'</div>';
		}
		else{
			ins += '<div id="slider-bg" class="yui-h-slider" style="background: url('+i3GEO.configura.locaplic+'/pacotes/yui290/build/slider/assets/bg-h.gif) no-repeat 5px 0;height: 28px;width: 210px;" tabindex="-1" title="Slider">' +
				'<div id="slider-thumb" class="yui-slider-thumb"><img src="'+i3GEO.configura.locaplic+'/pacotes/yui290/build/slider/assets/thumb-n.gif"></div>' +
				'</div>';
		}
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro:

	mx {numero} - (opcional) posi&ccedil;&atilde;o em x para onde a janela ser&aacute; movida ap&oacute;s ser criada

	my {numero} - (opcional) posi&ccedil;&atilde;o em y para onde a janela ser&aacute; movida ap&oacute;s ser criada
	*/
	iniciaJanelaFlutuante: function(mx,my){
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opacidademapa");
		};
		var janela,divid,titulo;
		//cria a janela flutuante
		titulo = "<div  id='i3GEOFopacidademapaComboCabeca' class='comboTemasCabecalho'>------</div>&nbsp;&nbsp;&nbsp;"+$trad("t20")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=102' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"230px",
			"40px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opacidademapa",
			false,
			"hd",
			"",
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic + "/imagens/oxygen/16x16/file-zoom-in.png"
		);
		divid = janela[2].id;
		i3GEOF.opacidademapa.janela = janela[0];
		if(mx != undefined)
		{janela[0].moveTo(mx,my);}
		$i("i3GEOF.opacidademapa_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opacidademapa_corpo").style.textAlign = "left";
		i3GEOF.opacidademapa.aguarde = $i("i3GEOF.opacidademapa_imagemCabecalho").style;
		i3GEOF.opacidademapa.inicia(divid);
		if(i3GEO.Interface.ATUAL == "googleearth"){
			$i('i3GEOFopacidademapaComboCabeca').style.display = "none";
		}
	},
	/*
	Function: criaslide

	Cria a barra deslizante com base em YAHOO.widget.Slider
	*/
	criaslide: function(){
		i3GEOF.opacidademapa.slider = YAHOO.widget.Slider.getHorizSlider($i("slider-bg"),$i("slider-thumb"), 0, 200, 0);
		i3GEOF.opacidademapa.slider.setValue(200,false);
		i3GEOF.opacidademapa.slider.subscribe("change", function(offsetFromStart) {
			i3GEO.Interface.aplicaOpacidade(offsetFromStart / 200,$i("i3GEOFopacidademapaComboCabecaSel").value);
		});
		if(navm){
			$i("slider-bg").style.left = "-100px";
			$i("i3GEOF.opacidademapa_corpo").style.background = "url("+i3GEO.configura.locaplic+"/pacotes/yui290/build/slider/assets/bg-h.gif) white no-repeat 10px 0px";
		}
	}
};