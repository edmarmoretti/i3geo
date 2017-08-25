/*
Title: Metar

Busca as esta&ccedil;&otilde;es meteorol&oacute;gicas da rede METAR na extens&atilde;o geogr&aacute;fica do mapa atual.

Veja:

<i3GEO.navega.dialogo.metar>

<metarextensao>

<metarproxima>

Arquivo:

i3geo/ferramentas/metar/index.php

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
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.metar
 *
 */
i3GEOF.metar =
	{
		MARCA : false,
		/*
		 * Variavel: aguarde
		 *
		 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.metar.dicionario);
			return dicionario;
		},
		/*
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametro:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia : function(iddiv) {
			if(i3GEOF.metar.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/metar/template_mst.html", function(template) {
					i3GEOF.metar.MUSTACHE = template;
					i3GEOF.metar.inicia(iddiv);
				});
				return;
			}
				$i(iddiv).innerHTML = i3GEOF.metar.html();
				i3GEOF.metar.ativaFoco();
				if (i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth") {
					i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.metar.lista()");
				}
				if (i3GEO.Interface.ATUAL === "googlemaps") {
					metarDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {
						i3GEOF.metar.lista();
					});
					metarZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {
						i3GEOF.metar.lista();
					});
				}
				if (i3GEO.Interface.ATUAL === "googleearth") {
					metarDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {
						i3GEOF.metar.lista();
					});
				}
				i3GEOF.metar.lista();

		},
		/*
		 * Function: html
		 *
		 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
		 *
		 * Retorno:
		 *
		 * String com o c&oacute;digo html
		 */
		html : function() {
			var ins = Mustache.render(i3GEOF.metar.MUSTACHE, i3GEOF.metar.mustacheHash());
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var minimiza, cabecalho, janela, divid, temp, titulo;
			if ($i("i3GEOF.metar")) {
				return;
			}
			// funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
			cabecalho = function() {
				i3GEOF.metar.ativaFoco();
			};
			minimiza = function() {
				i3GEO.janela.minimiza("i3GEOF.metar",200);
			};
			// cria a janela flutuante
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >Metar</span></div>";
			janela = i3GEO.janela.cria(
					"350px",
					"210px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.metar",
					false,
					"hd",
					cabecalho,
					minimiza,
					"",
					true,
					"",
					"",
					"",
					"",
					"87"
			);
			divid = janela[2].id;
			i3GEOF.metar.aguarde = $i("i3GEOF.metar_imagemCabecalho").style;
			i3GEOF.metar.inicia(divid);
			temp = function() {
				i3GEOF.metar.escondexy();
				if (i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth") {
					i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.metar.lista()"]);
				}
				if (i3GEO.Interface.ATUAL === "googlemaps") {
					google.maps.event.removeListener(metarDragend);
					google.maps.event.removeListener(metarZoomend);
				}
				if (i3GEO.Interface.ATUAL === "googleearth") {
					google.earth.removeEventListener(metarDragend);
				}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		},
		/*
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function() {
		},
		/*
		 * Function: lista
		 *
		 * Lista as esta&ccedil;&otilde;es consultando o webservice http://ws.geonames.org/weatherJSON
		 */
		lista : function() {
			$i("i3GEOmetarLista").innerHTML = "";
			if (i3GEOF.metar.aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.metar.aguarde.visibility = "visible";
			var montaResultado =
				{
					success : function(o) {
						var ins, dados, ndados, i, temp, temp1;
						i3GEOF.metar.aguarde.visibility = "hidden";
						ins = "<h5 class='alert alert-info'>" + $trad('ajuda', i3GEOF.metar.dicionario) + "</h5>";
						try {
							dados = JSON.parse(o.responseText)[0].weatherObservations;
							ndados = dados.length;
							for (i = 0; i < ndados; i++) {
								temp = "i3GEOF.metar.mostraxy(" + dados[i].lng + "," + dados[i].lat + ")";
								temp1 =
									"i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid," + dados[i].lng + ","
										+ dados[i].lat + ")";

								ins += "<h4>" + dados[i].stationName
										+ "</h4><a href='#' onclick='" + temp1 + "' onmouseover='" + temp
										+ "' onmouseout='i3GEO.util.escondeBox()' >long: " + dados[i].lng + ", lat: " + dados[i].lat
										+ "</a>"
										+ "<h5>" + $trad('temperatura', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].temperature + " C&nbsp</h5>"
										+ "<h5>" + $trad('condicao', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].weatherCondition + "</h5>"
										+ "<h5>" + $trad('observacao', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].observation + "&nbsp;</h5>"
										+ "<h5>" + $trad('nuvens', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].clouds + "&nbsp;</h5>"
										+ "<h5>" + $trad('direcaoVento', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].windDirection + "&nbsp;<h5>"
										+ "<h5>" + $trad('pontoOrvalho', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].dewPoint + " C&nbsp;</h5>"
										+ "<h5>" + $trad('velocidadeVento', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].windSpeed + " mph&nbsp;</h5>"
										+ "<h5>" + $trad('humidade', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].humidity + " %&nbsp;</h5>"
										+ "<h5>" + $trad('data', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].datetime + "&nbsp;</h5>"
										+ "<h5>" + $trad('pressao', i3GEOF.metar.dicionario) + ":&nbsp;"
										+ dados[i].hectoPascAltimeter + " hpa&nbsp;</h5>"
										+ "<h5>ICAO" + dados[i].ICAO + "&nbsp;</h5><hr>";
							}
							$i("i3GEOmetarLista").innerHTML = ins;
						} catch (e) {
							$i("i3GEOmetarLista").innerHTML = ins;
						}
					},
					failure : function(o) {
						$i("i3GEOmetarLista").innerHTML = "Erro";
						i3GEOF.metar.aguarde.visibility = "hidden";
						return;
					},
					argument : {
						foo : "foo",
						bar : "bar"
					}
				};
			if (i3GEO.parametros.mapexten) {
				ext = i3GEO.parametros.mapexten;
			} else {
				ext = "-49.1774741355 -16.379556709 -47.2737662565 -14.9806872512";
			} // apenas para exemplo
			p = i3GEO.configura.locaplic + "/ferramentas/metar/metarextensao.php?ret=" + ext;
			YAHOO.util.Connect.asyncRequest("GET", p, montaResultado);
		},
		/*
		 * Function: mostraxy
		 *
		 * Indica no mapa a localiza&ccedil;&atilde;o de uma esta&ccedil;&atilde;o
		 *
		 * Parametros:
		 *
		 * x {Numero} - longitude em dd
		 *
		 * y {Numero} - latitude em dd
		 */
		mostraxy : function(x, y) {
			if (i3GEO.Interface.ATUAL === "googleearth") {
				return;
			}
			if (i3GEOF.metar.MARCA === false) {
				i3GEOF.metar.MARCA = i3GEO.desenho.addPin(x, y, "", "", i3GEO.configura.locaplic + '/imagens/google/metar.png', "metar");
			} else {
				i3GEO.desenho.movePin(i3GEOF.metar.MARCA, x, y);
			}
		},
		escondexy : function() {
			i3GEO.desenho.removePins("metar");
			i3GEOF.metar.MARCA = false;
		}
	};