/*
Title: Cortina

Aplica um efeito de cortina a um tema, permitindo mostr&aacute;-lo ou escond&ecirc;-lo de forma controlada por um bot&atilde;o deslizante.
Funciona apenas nas interfaces que utilizam camadas m&uacute;ltiplas, como a interface openlayers

Veja:

<i3GEO.tema.dialogo.cortina>

Arquivo:

i3geo/ferramentas/cortina/index.js.php

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
Classe: i3GEOF.cortina
*/
i3GEOF.cortina = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: tema

	C&oacute;digo do tema definido na inicializa&ccedil;&atilde;o da janela e que ser&aacute; alvo da cortina.
	*/
	tema: "",
	/*
	Variavel: janela

	Janela flutuante criada

	Type:
	{YAHOO.panel}
	*/
	janela: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.cortina.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.cortina.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/cortina/template_mst.html", function(template) {
				i3GEOF.cortina.MUSTACHE = template;
				i3GEOF.cortina.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.cortina.html();
		i3GEOF.cortina.criaslide();
		i3GEOF.cortina.comboTemas();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.cortina.MUSTACHE, i3GEOF.cortina.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro:

	tema {string} - codigo do tema

	mx {numero} - (opcional) posi&ccedil;&atilde;o em x para onde a janela ser&aacute; movida ap&oacute;s ser criada

	my {numero} - (opcional) posi&ccedil;&atilde;o em y para onde a janela ser&aacute; movida ap&oacute;s ser criada
	*/
	iniciaJanelaFlutuante: function(tema,mx,my){
		if($i("i3GEOF.cortina")){
			return;
		}
		if(tema == undefined){
			tema = i3GEO.temaAtivo;
			i3GEOF.cortina.tema = tema;
		}
		else{
			i3GEO.mapa.ativaTema(tema);
			i3GEOF.cortina.tema = tema;
		}
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.cortina",200);
		};
		var janela,divid,temp,titulo;

		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("t42") + "</span></div>";
		janela = i3GEO.janela.cria(
			"240px",
			"120px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.cortina",
			false,
			"hd",
			"",
			"",
			"",
			true,
			"",
			"",
			"",
			"",
			"90"
		);
		divid = janela[2].id;
		i3GEOF.cortina.janela = janela[0];
		if(mx != undefined)
		{janela[0].moveTo(mx,my);}
		$i("i3GEOF.cortina_corpo").style.backgroundColor = "white";
		$i("i3GEOF.cortina_corpo").style.textAlign = "left";
		i3GEOF.cortina.aguarde = $i("i3GEOF.cortina_imagemCabecalho").style;
		temp = function(){
			var layer = null,estilo;
			if(i3GEO.Interface.ATUAL === "openlayers"){
				layer = i3geoOL.getLayersByName(i3GEO.temaAtivo)[0];
				if(layer){
					estilo = layer.div.style;
				}
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				layer = i3GEO.Interface.googlemaps.retornaDivLayer(i3GEO.temaAtivo);
				if(layer){
					estilo = layer.style;
				}
			}
			if(layer){
				estilo.clip = "rect(0px,"+i3GEO.parametros.w+"px,"+i3GEO.parametros.h+"px,0px)";
			}
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",["i3GEOF.cortina.comboTemas()"]);
			i3GEOF.cortina.slider = null;
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.cortina.comboTemas()"]);
		i3GEOF.cortina.inicia(divid);
	},
	/*
	Function: criaslide

	Cria a barra deslizante com base em YAHOO.widget.Slider
	*/
	criaslide: function(){
		i3GEOF.cortina.slider = YAHOO.widget.Slider.getHorizSlider($i("slider-bg"),$i("slider-thumb"), 0, 200, 0);
		var	layer;
		if(i3GEOF.cortina.tema !== ""){
			if(i3GEO.Interface.ATUAL === "openlayers"){
				layer = i3geoOL.getLayersByName(i3GEOF.cortina.tema)[0];
				//TODO nao funciona no OL3
				if(layer.div == undefined){
					return;
				}
				i3GEOF.cortina.estilo = layer.div.style;
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				layer = i3GEO.Interface.googlemaps.retornaDivLayer(i3GEOF.cortina.tema);
				i3GEOF.cortina.estilo = layer.style;
			}
			i3GEOF.cortina.estilo.clip = "rect(0px,"+i3GEO.parametros.w+"px,"+i3GEO.parametros.h+"px,0px)";
		}
		i3GEOF.cortina.slider.setValue(0,false);
		i3GEOF.cortina.slider.subscribe("change", function(offsetFromStart) {
			var t=0,
				r=i3GEO.parametros.w,
				b=i3GEO.parametros.h,
				l=0,
				escala = r / 200;
			l = l + (offsetFromStart * escala);
			i3GEOF.cortina.estilo.clip = "rect("+t+"px,"+r+"px,"+b+"px,"+l+"px)";
		});
	},
	/*
	Function: reiniciaSlide

	Zera a barra do slide
	*/
	//TODO openlayers usa canvas e nao div, o que impede de funcionar
	reiniciaSlide: function(){
		var layer;
		i3GEOF.cortina.slider.setValue(0,false);
		if(i3GEO.Interface.ATUAL === "openlayers"){
			layer = i3geoOL.getLayersByName(i3GEOF.cortina.tema)[0];
			if(layer){
				i3GEOF.cortina.estilo = layer.div.style;
			}
		}
		if(i3GEO.Interface.ATUAL === "googlemaps"){
			layer = i3GEO.Interface.googlemaps.retornaDivLayer(i3GEOF.cortina.tema);
			if(layer){
				i3GEOF.cortina.estilo = layer.style;
			}
		}
		i3GEOF.cortina.slider.subscribe("change", function(offsetFromStart) {
			var t=0,
				r=i3GEO.parametros.w,
				b=i3GEO.parametros.h,
				l=0,
				escala = r / 200;
			l = l + (offsetFromStart * escala);
			i3GEOF.cortina.estilo.clip = "rect("+t+"px,"+r+"px,"+b+"px,"+l+"px)";
		});
	},
	/*
	Function: comboTemas

	Cria um combo com a lista de temas

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOcortinatemas",
			function(retorno){
		 		$i("i3GEOcortinaTemasDiv").innerHTML = retorno.dados;
		 		$i("i3GEOcortinaTemasDiv").style.display = "block";
		 		if ($i("i3GEOcortinatemas")){
		 			$i("i3GEOcortinatemas").onchange = function(){
						if(i3GEOF.cortina.estilo){
							i3GEOF.cortina.estilo.clip = "rect(0px,"+i3GEO.parametros.w+"px,"+i3GEO.parametros.h+"px,0px)";
						}
						var t = $i("i3GEOcortinatemas").value;
						i3GEO.mapa.ativaTema(t);
						i3GEOF.cortina.tema = t;
						i3GEOF.cortina.reiniciaSlide();
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOcortinatemas").value = i3GEO.temaAtivo;
					$i("i3GEOcortinatemas").onchange.call();
				}
			},
			"i3GEOcortinaTemasDiv",
			"",
			false,
			"ligados",
			"",
			false,
			true,
			"form-control comboTema"
		);
	}
};
