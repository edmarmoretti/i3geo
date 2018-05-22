/*
Title: Busca r&aacute;pida

Procura um lugar

Busca em um servi&ccedil;o de busca, na &aacute;rvore de temas do i3geo e no servi&ccedil;o do Google.
O resultado &eacute; mostrado como uma listagem, permitindo adicionar um novo tema ao mapa conforme o que foi encontrado.

Veja:

<i3GEO.gadgets.mostraBuscaRapida>

Arquivo:

i3geo/ferramentas/buscarapida/index.js

About: Licen&ccedil;a

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

/*
 Classe: i3GEObuscaRapida
 */
i3GEObuscaRapida =
	{
		BOX : false,
		/*
		 * Property: servico
		 *
		 * Endere&ccedil;o do servi&ccedil;o de busca que ser&aacute; utilizado. Esse servi&ccedil;o deve ser um Web Service no
		 * padr&atilde;o reconhecido pelo i3Geo.
		 *
		 * Type: {String}
		 *
		 * Default: {http://mapas.mma.gov.br/webservices/geonames.php}
		 */
		servico : "http://mapas.mma.gov.br/webservices/geonames.php",
		/*
		 * Property: servicowms
		 *
		 * Endere&ccedil;o do servi&ccedil;o de busca que ser&aacute; utilizado para retornar a representa&ccedil;&atilde;o
		 * cartogr&aacute;fica do elemento encontrado.
		 *
		 * Esse servi&ccedil;o deve ser um Web Service no padr&atilde;o OGC com o parametro adicional "gid" indicando o id do elemento que
		 * ser&aacute; mostrado na tela.
		 *
		 * Type: {String}
		 *
		 * Default: {http://mapas.mma.gov.br/webservices/geonameswms.php}
		 */
		servicowms : "http://mapas.mma.gov.br/webservices/geonameswms.php",
		/*
		 * Property: funcaoZoom
		 *
		 * Nome da fun&ccedil;&atilde;o que ser&aacute; executada ao ser clicado o bot&atilde;o de zoom para o elemento encontrado.
		 *
		 * O bot&atilde;o de zoom &eacute; mostrado logo ap&oacute;s cada elemento encontrado na busca.
		 *
		 * Alterando-se essa op&ccedil;&atilde;o, pode-se executar o busca r&aacute;pida como um gadget.
		 *
		 * Veja i3GEObuscaRapida.zoom para conhecer os parametros que essa fun&ccedil;&atilde;o ir&aacute; receber
		 *
		 * Type: {String}
		 *
		 * Default: {i3GEObuscaRapida.zoom}
		 */
		funcaozoom : "i3GEObuscaRapida.zoom",
		/*
		 * Property: idresultado
		 *
		 * Id do elemento HTML que receber&aacute; o resultado da busca
		 *
		 * Type: {String}
		 *
		 * Default: {resultado}
		 */
		idresultado : "resultado",
		/*
		 * Property: buscatemas
		 *
		 * Indica se deve ser feita a busca na &aacute;rvore de temas
		 *
		 * Type: {boolean}
		 *
		 * Default: {true}
		 */
		buscaemtemas : true,
		/*
		 * Variable: palavra
		 *
		 * Palavra que ser&aacute; buscada
		 *
		 * Type: {String}
		 */
		palavra : "",
		/*
		 * Variable: locaplic
		 *
		 * Endere&ccedil;o do i3geo (url)
		 *
		 * Type:{String}
		 */
		locaplic : "",
		/*
		 * Function: inicia
		 *
		 * Inicia a busca de uma palavra e mostra o resultado na tela
		 *
		 * Veja:
		 *
		 * <i3GEO.php.buscaRapida>
		 *
		 * Parametros:
		 *
		 * palavra {String} - palavra que ser&aacute; procurada
		 *
		 * locaplic {String} - url onde o i3geo est&aacute; instalado, pe, http://localhost/i3geo
		 *
		 * resultado {Function} - fun&ccedil;&atilde;o que ser&aacute; executada para processar o resultado da busca no servico definido em
		 * i3GEObuscaRapida.servicowms. O default &eacute; i3GEObuscaRapida.montaResultado
		 *
		 * servicosexternos {boolean} - indica se a busca ser&aacute; feita nos servi&ccedil;os de busca externos
		 *
		 * temasmapa {boolean} - indica se a busca ser&aacute; feita nos temas existentes no mapa
		 *
		 * google {boolean} - busca ou nao no google (so para interface com google maps)
		 */
		inicia : function(palavra, locaplic, resultado, servicosexternos, temasmapa, google) {
			if ($i(i3GEObuscaRapida.idresultado)) {
				$i(i3GEObuscaRapida.idresultado).style.display = "none";
			}
			palavra = i3GEO.util.removeAcentos(palavra);
			i3GEObuscaRapida.palavra = palavra;
			i3GEObuscaRapida.locaplic = locaplic;
			if (servicosexternos === true) {
				try {
					aguarde("block");
				} catch (e) {
				}
				i3GEO.php.buscaRapida(resultado, locaplic, i3GEObuscaRapida.servico, palavra);
			}
			if (google && google === true && window.parent.google) {
				try {
					aguarde("block");
				} catch (e) {
				}
				if ($i("resultadoGoogle")) {
					$i("resultadoGoogle").innerHTML = "";
				}
				var geocoder = new window.parent.google.maps.Geocoder();
				geocoder.geocode({
					'address' : palavra
				}, function(results, status) {
					if (status == window.parent.google.maps.GeocoderStatus.OK) {
						if (status != window.parent.google.maps.GeocoderStatus.ZERO_RESULTS) {
							// compatibiliza com montaResultadoTemas
							if (results) {
								var b, bo, n = results.length, i = 0, resultado = {
									"data" : []
								};
								for (i = 0; i < n; i++) {
									if (results[i] && results[i].formatted_address && results[i].geometry && results[i].geometry.viewport) {
										// window.parent.i3GeoMap.fitBounds(results[0].geometry.viewport);
										bo = results[i].geometry.bounds;
										b =
											bo.getSouthWest().lng() + " " + bo.getSouthWest().lat() + " " + bo.getNorthEast().lng() + " "
												+ bo.getNorthEast().lat();
										resultado.data.push({
											"valor" : results[i].formatted_address,
											"box" : b
										});
									}
								}
								i3GEObuscaRapida.montaResultadoTemas(resultado);
							}
						}
					}
				});
			} else {
				$i("resultadoGoogle").style.display = "none";
			}
			if (temasmapa === true) {
				try {
					var verificaTema =
						window.parent.i3GEO.arvoreDeCamadas.filtraCamadas(
							"itembuscarapida",
							"",
							"diferente",
							window.parent.i3GEO.arvoreDeCamadas.CAMADAS);
					if (verificaTema.length === 0) {
						alert("Nenhum tema configurado para busca");
						return;
					}
					// aguarde("block");
					i3GEO.php.buscaRapida(i3GEObuscaRapida.montaResultadoTemas, locaplic, "temas", palavra);
				} catch (e) {
					alert(e);
				}
			} else {
				if ($i("resultadoTemas")) {
					$i("resultadoTemas").innerHTML = "";
				}
			}
		},
		/*
		 * Function: montaResultadoTemas
		 *
		 * Mostra o resultado da busca nos atributos dos temas existentes no mapa
		 *
		 * Parametro:
		 *
		 * retorno {JSON} - resultado da fun&ccedil;&atilde;o i3GEO.php.buscaRapida
		 */
		montaResultadoTemas : function(retorno) {
			var i, ins = "Nada encontrado nos temas ou nenhum tema permite busca.<br>";
			try {
				if (retorno.data && retorno.data.length > 0) {
					ins = "<table >";
					for (i = 0; i < retorno.data.length; i++) {
						ins += "<tr><td style='text-align:left'>";
						ins += retorno.data[i].valor;
						var ext = retorno.data[i].box;
						ins +=
							"</td><td onclick='i3GEObuscaRapida.zoomExt(\""
								+ ext
								+ "\")' onmouseover=\"i3GEObuscaRapida.mostraxy('"
								+ ext
								+ "','extent')\" onmouseout='i3GEObuscaRapida.escondexy()' style='color:blue;cursor:pointer'><img title='localizar' src='../../imagens/branco.gif' class='ticfind' /></td></tr>";
					}
					ins += "</table>";
				}
			} catch (e) {
				ins = $trad("x41") + "<br>";
			}
			$i("resultadoTemas").style.display = "block";
			$i("resultadoTemas").innerHTML = ins;
			try {
				aguarde("none");
			} catch (e) {
			}
		},
		/*
		 * Function: montaResultado
		 *
		 * Mostra o resultado da busca. Esta &eacute; a fun&ccedil;&atilde;o default utilizada pelo m&eacute;todo inicia
		 *
		 * Ap&oacute;s o resultado ser mostrado, &eacute; feita a busca na base de temas, executando-se o m&eacute;todo buscaemtemas
		 *
		 * Parametro:
		 *
		 * retorno {JSON} - resultado da fun&ccedil;&atilde;o i3GEO.php.buscaRapida
		 */
		montaResultado : function(retorno) {
			var wkt, gid, i, j, layer, ins = $trad("x42") + " " + i3GEObuscaRapida.servicowms + "<br>";
			try {
				if (retorno.data) {
					if (retorno.data.geonames) {
						ins = "";
						for (i = 0; i < retorno.data.geonames.length; i++) {
							if (i == 0) {
								ins = "<table >";
							}
							ins +=
								"<tr><td style='width:30%;text-align:left;background-color:rgb(220,220,220)' colspan=2 ><b>"
									+ retorno.data.geonames[i].tema + "</b></td></tr>";
							layer = retorno.data.geonames[i].layer;
							for (j = 0; j < retorno.data.geonames[i].lugares.length; j++) {
								ins += "<tr><td style='text-align:left'>";
								ins += retorno.data.geonames[i].lugares[j].nome;
								wkt = retorno.data.geonames[i].lugares[j].limite;
								ins += " " + retorno.data.geonames[i].lugares[j].centroide;
								gid = retorno.data.geonames[i].lugares[j].gid;
								ins +=
									"</td><td onclick=\""
										+ i3GEObuscaRapida.funcaozoom
										+ "('"
										+ wkt
										+ "','"
										+ layer
										+ "','"
										+ gid
										+ "','"
										+ retorno.data.geonames[i].lugares[j].nome
										+ "')\" onmouseover=\"i3GEObuscaRapida.mostraxy('"
										+ wkt
										+ "','wkt')\" onmouseout='i3GEObuscaRapida.escondexy()' style='color:blue;cursor:pointer'><img title='localizar' src='../../imagens/branco.gif' class='ticfind' /></td></tr>";
							}
						}
						ins += "</table>";
					} else {
						ins += "-</table>";
					}
				}
			} catch (e) {
				ins = $trad("x43") + " " + i3GEObuscaRapida.servico + "<br>";
			}
			$i(i3GEObuscaRapida.idresultado).style.display = "block";
			$i(i3GEObuscaRapida.idresultado).innerHTML = ins;
			try {
				aguarde("none");
			} catch (e) {
			}
			if (i3GEObuscaRapida.buscaemtemas) {
				try {
					window.parent.i3GEO.php.procurartemas2(
						i3GEObuscaRapida.resultadoTemas,
						i3GEObuscaRapida.palavra,
						i3GEObuscaRapida.locaplic);
				} catch (e) {
				}
			}
		},
		/*
		 * Function: resultadoTemas
		 *
		 * Acrescenta nos resultados encontrados os dados localizados na base de temas do i3geo
		 *
		 * Essa fun&ccedil;&atilde;o &eacute; cahamda pelo m&eacute;todo montaResultado
		 *
		 * Parameters:
		 *
		 * retorno {Json} - resultado de
		 */
		resultadoTemas : function(retorno) {
			var nomeTema, inp, tid, lk = "", ig, sg, st, ins = "";
			retorno = retorno.data;
			if ((retorno != "erro") && (retorno != undefined) && retorno.length > 0) {
				for (ig = 0; ig < retorno.length; ig++) {
					var ngSgrupo = retorno[ig].subgrupos;
					for (sg = 0; sg < ngSgrupo.length; sg++) {
						var nomeSgrupo = ngSgrupo[sg].subgrupo;
						var ngTema = ngSgrupo[sg].temas;
						for (st = 0; st < ngTema.length; st++) {
							lk = "";
							if (ngTema[st].link != " ") {
								lk = "<a href=" + ngTema[st].link + " target=blank>&nbsp;fonte</a>";
							}
							tid = ngTema[st].tid;
							inp =
								"<input style='text-align:left;cursor:pointer;' onclick='i3GEObuscaRapida.adicionatema(this)' class=inputsb style='cursor:pointer' type=\"checkbox\" value='"
									+ tid + "'  /> (" + nomeSgrupo + ")";
							nomeTema = inp + (ngTema[st].nome) + lk + "<br>";
							ins += nomeTema;
						}
					}
				}
			}
			if (ins != "") {
				$i(i3GEObuscaRapida.idresultado).innerHTML += "<br><b>" + $trad("a7") + ":</b><br>" + ins;
			}
		},
		/*
		 * Function: zoom
		 *
		 * Aplica a opera&ccedil;&atilde;o de zoom quando o usu&aacute;rio clica no bot&atilde;o de adi&ccedil;&atilde;o de um resultado ao
		 * mapa.
		 *
		 * Essa &eacute; a fun&ccedil;&atilde;o default utilizada pela ferramenta, podendo ser substitu&iacute;da por outra se desejado.
		 *
		 * Al&eacute;m de enquadrar o mapa a uma extens&atilde;o geogr&aacute;fica espec&iacute;fica, uma nova camada &eacute; adicionada,
		 * mostrando o limite da ocorr&ecirc;ncia desejada.
		 *
		 * Veja:
		 *
		 * <i3GEO.php.mudaext>
		 *
		 * Parameters:
		 *
		 * wkt {String} - string no formato wkt que ser&aacute; usado para definir a abrang&ecirc;ncia do zoom
		 *
		 * layer {String} - nome do layer existente no servi&ccedil;o definido em i3GEObuscaRapida.servicowms e que ser&aacute; adicionado
		 * ao mapa como uma camada WMS
		 *
		 * gid {String} - identificador que ser&aacute; utilizado no WMS para selecionar o elemento desejado
		 *
		 * nm {String} - nome que ser&aacute; dado a camada que ser&aacute; adicionada ao mapa
		 */
		zoom : function(wkt, layer, gid, nm) {
			var adicionaCamada =
				function(layer, gid, nm, ext) {
					if (window.parent.i3GEO.Interface.openlayers.googleLike === false) {
						var s = i3GEObuscaRapida.servicowms + "?gid=" + gid + "&";
						i3GEO.php.adicionaTemaWMS(window.parent.i3GEO.atualiza, s, layer, "default", "EPSG:4618", "image/png", "1.1.0", nm
							+ " - " + layer, "", "nao", "", i3GEObuscaRapida.locaplic, window.parent.i3GEO.configura.sid);
					}
					i3GEObuscaRapida.zoomExt(ext);
				};
			var ext = i3GEO.util.wkt2ext(wkt, "polygon");
			if (ext == false) {
				alert("wkt invalido");
				return;
			}

			i3GEO.php.mudaext(
				adicionaCamada(layer, gid, nm, ext),
				window.parent.i3GEO.configura.tipoimagem,
				ext,
				i3GEObuscaRapida.locaplic,
				window.parent.i3GEO.configura.sid);
		},
		zoomExt : function(ext) {
			if (window.parent.i3GEO.Interface.ATUAL == "googlemaps") {
				window.parent.i3GEO.Interface.googlemaps.zoom2extent(ext);
			}
			if (window.parent.i3GEO.Interface.ATUAL == "googleearth") {
				window.parent.i3GEO.Interface.googleearth.zoom2extent(ext);
			}
			if (window.parent.i3GEO.Interface.ATUAL == "openlayers") {
				window.parent.i3GEO.Interface.openlayers.zoom2ext(ext);
			}
		},
		/*
		 * Function: adicionatema
		 *
		 * Adiciona um tema ao mapa quando a busca localiza uma ocorr&ecirc;ncia nos menus de camadas
		 *
		 * Nesse caso, o tema &eacute; adicionado ao mapa
		 *
		 * Veja:
		 *
		 * <i3GEO.php.adtema>
		 *
		 * Parameters:
		 *
		 * obj {Object dom} - objeto DOM do tipo INPUT tendo como valor o c&oacute;digo do tema
		 */
		adicionatema : function(obj) {
			if (obj.checked) {
				// window.parent.i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
				if (window.parent.i3GEO.Interface.openlayers.googleLike === false) {
					var temp = function() {
						window.parent.i3GEO.atualiza("");
					};
					i3GEO.php.adtema(temp, obj.value, i3GEObuscaRapida.locaplic, window.parent.i3GEO.configura.sid);
				}
			} else {
				alert("Escolha um tema");
			}
		},
		/*
		 * Function: mostraxy
		 *
		 * Mostra no mapa um retangulo representando a extens&atilde;o geogr&aacute;fica de uma ocorr&ecirc;ncia encontrada na busca
		 *
		 * Parameters:
		 *
		 * texto {String} - coordenadas representando a extens&atilde;o geogr&aacute;fica do elemento
		 *
		 * tipo {string} - wkt|extent
		 */
		mostraxy : function mostraxy(texto, tipo) {
			var ext,b;
			try {
				if (!window.parent) {
					return;
				}
				if (!window.parent.i3GEO) {
					return;
				}
				if (!window.parent.i3GEO.calculo) {
					return;
				}
				if (window.parent.i3GEO.Interface.ATUAL === "googleearth") {
					return;
				}
			} catch (e) {
				return;
			}
			if (tipo === "wkt") {
				ext = window.parent.i3GEO.util.wkt2ext(texto, "polygon");
			} else {
				ext = texto;
			}
			if (ext == false) {
				alert("texto invalido");
				return;
			}
			b = ext.split(" ");
			//OL 3
			if (window.parent.i3GEO.Interface["ATUAL"] === "openlayers") {
				i3GEObuscaRapida.BOX = false;
			}

			if(i3GEObuscaRapida.BOX === false){
				i3GEObuscaRapida.BOX = window.parent.i3GEO.desenho.addBox(b[0], b[1], b[2], b[3], "boxOndeBusca");
			}
			else{
				i3GEObuscaRapida.BOX = window.parent.i3GEO.desenho.moveBox(i3GEObuscaRapida.BOX,b[0], b[1], b[2], b[3]);
			}
		},
		/*
		 * Function: escondexy
		 *
		 * Esconde o box criado com mostraxy
		 */
		escondexy : function() {
			window.parent.i3GEO.desenho.removeBox("boxOndeBusca");
		}
	};