/**
 * Title: Gadgets (objetos marginais do mapa)
 *
 * Inclui elementos especiais no mapa
 *
 * Os elementos s&atilde;o opcionais e adicionam funcionalidades ao mapa.
 *
 * Namespace:
 *
 * i3GEO.gadgets
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_gadgets.js>
 */

/**
 *
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUACAtilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.gadgets =
	{
		/**
		 * Propriedade: PARAMETROS
		 *
		 * Par&acirc;metros de inicializa&ccedil;&atilde;o dos gadgets.
		 *
		 * Essa vari&aacute;vel define os parametros individuais de cada gadget e o ID do elemento HTML onde o gadget ser&aacute;
		 * inclu&iacute;do (parametro "idhtml").
		 *
		 * Cada tipo de gadget pode ter parametros espec&iacute;ficos, descritos a seguir.
		 *
		 * Voc&ecirc; pode acessar os par&acirc;metros da seguinte forma:
		 *
		 * i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda = 400;
		 *
		 * Para evitar o funcionamento de um gadget experimente utilizar
		 *
		 * Exemplo:
		 *
		 * i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml = "";
		 *
		 * Default:
		 *
		 * (start code)
		 *
		 * i3GEO.gadgets.PARAMETROS = { "mostraInserirKml" : { idhtml : "inserirKml" }, "mostraEscalaNumerica" : { idhtml : "escala" },
		 * "mostraEscalaGrafica" : { idhtml : "escalaGrafica" }, "mostraBuscaRapida" : { idhtml : "buscaRapida", servicosexternos : true,
		 * temasmapa : false, google : true }, "mostraVisual" : { idhtml : "" }, "mostraHistoricoZoom" : { idhtml : "historicozoom" },
		 * "mostraMenuSuspenso" : { permiteLogin : true, marcadores : true, idhtml : "menus", deslocaEsquerda : 0, parametrosYUI : { iframe :
		 * false, autosubmenudisplay : false, showdelay : 200, hidedelay : 500, lazyload : false } }, "mostraMenuLista" : { idhtml :
		 * "menuLista" }, "mostraVersao" : { idhtml : "versaoi3geo" }, "mostraEmail" : { idhtml : "emailInstituicao" } };
		 *
		 * (end)
		 */
		PARAMETROS : {
			"mostraInserirKml" : {
				idhtml : "inserirKml"
			},
			"mostraEscalaNumerica" : {
				idhtml : "escala"
			},
			"mostraEscalaGrafica" : {
				idhtml : "escalaGrafica"
			},
			"mostraBuscaRapida" : {
				idhtml : "buscaRapida",
				servicosexternos : false,
				temasmapa : true,
				google : true,
				tipo : "mini" //pode ser mini|normal
			},
			"mostraVisual" : {
				idhtml : ""
			},
			"mostraHistoricoZoom" : {
				idhtml : "historicozoom"
			},
			"mostraMenuSuspenso" : {
				permiteLogin : true,
				marcadores : true,
				idhtml : "menus",
				deslocaEsquerda : 0,
				menuUnico : false,
				parametrosYUI : {
					iframe : false,
					autosubmenudisplay : false,
					showdelay : 200,
					hidedelay : 500,
					lazyload : false
				}
			},
			"mostraVersao" : {
				idhtml : "versaoi3geo"
			},
			"mostraEmail" : {
				idhtml : "emailInstituicao"
			}
		},
		/**
		 * Function: mostraEmail
		 *
		 * Mostra o e-mail armazenado na vari&aacute;vel i3GEO.parametros.emailInstituicao
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraEmail : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraEmail()");

			if (arguments.length === 0 || id === "") {
				id = i3GEO.gadgets.PARAMETROS.mostraEmail.idhtml;
			} else {
				i3GEO.gadgets.PARAMETROS.mostraEmail.idhtml = id;
			}
			i3GEO.util.defineValor(id, "innerHTML", i3GEO.parametros.emailInstituicao);
		},
		/**
		 * Function: mostraVersao
		 *
		 * Mostra a vers&atilde;o atual do i3Geo armazenada na vari&aacute;vel i3GEO.parametros.mensageminicial
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraVersao : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraVers&atilde;o()");

			if (arguments.length === 0 || id === "") {
				id = i3GEO.gadgets.PARAMETROS.mostraVersao.idhtml;
			} else {
				i3GEO.gadgets.PARAMETROS.mostraVersao.idhtml = id;
			}
			i3GEO.util.defineValor(id, "innerHTML", i3GEO.parametros.mensageminicia);
		},
		/**
		 * Function: mostraInserirKml
		 *
		 * Mostra no mapa a a op&ccedil;&atilde;o para inserir kml.
		 *
		 * Essa op&ccedil;&atilde;o s&oacute; funciona com a API do Google carregada
		 *
		 * Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML existente no mapa que contenha o id
		 * definido em i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de
		 * i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
		 */
		mostraInserirKml : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraInserirKml()");

			var i, ins, temp;
			if (arguments.length === 0) {
				id = i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml;
			}
			if ($i(id)) {
				if (!$i("i3geo_urlkml")) {
					i = $inputText(id, "290", "i3geo_urlkml", "kml url", "35", "kml");
					ins = "<table><tr><td>" + i;
					temp = 'i3GEO.Interface.adicionaKml();';
					ins +=
						"</td><td><img src='" + i3GEO.configura.locaplic
							+ "/imagens/branco.gif"
							+ "' class='tic' onclick='"
							+ temp
							+ "' /></td></tr></table>";
					$i(id).innerHTML = ins;
				}
			}
		},
		/**
		 * Function: mostraEscalaNumerica
		 *
		 * Mostra no mapa a escala num&eacute;rica.
		 *
		 * A escala num&eacute;rica pode ser alterada pelo usu&aacute;rio digitando-se a nova escala.
		 *
		 * Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML existente no mapa que contenha o id
		 * definido em i3GEO.gadgets.PARAMETROS
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraEscalaNumerica : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraEscalaNumerica()");

			var i, ins, temp, onde;
			if (arguments.length === 0) {
				id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;
			}
			onde = $i(id);
			if (onde) {
				if (onde.style.display == "none") {
					onde.style.display = "block";
				}
				if (!$i("i3geo_escalanum")) {
					ins =
						"<form id='i3GEOescalanumForm' >"
						+ "<input type='text' name='' value='"
						+ parseInt(i3GEO.parametros.mapscale, 10)
						+ "' class='digitar' size='10' title='' id='i3geo_escalanum' onclick='javascript:this.select();'>"
						+ "</form>";

					onde.innerHTML = ins;
					$i("i3GEOescalanumForm").onsubmit =
						function() {
							i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic, i3GEO.configura.sid, document
								.getElementById("i3geo_escalanum").value);
							return false;
						};
				}
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
					"i3GEO.gadgets.atualizaEscalaNumerica()"
				]);
			}
		},
		atualizaEscalaNumerica : function(escala) {
			var e = $i("i3geo_escalanum");
			if (!e) {
				i3GEO.eventos.removeEventos("NAVEGAMAPA", [
					"i3GEO.gadgets.atualizaEscalaNumerica()"
				]);
				return;
			}
			if (arguments.length === 1) {
				e.value = escala;
			} else {
				if (i3GEO.parametros.mapscale !== "") {
					e.value = parseInt(i3GEO.parametros.mapscale, 10);
				} else {
					e.value = 0;
				}
			}
		},

		/**
		 * Function: mostraEscalaGrafica
		 *
		 * Mostra no mapa a escala grafica como um elemento fora do mapa.
		 *
		 * Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML existente no mapa que contenha o id
		 * definido em i3GEO.gadgets.PARAMETROS(escala)
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraEscalaGrafica : function(id) {
			if (arguments.length === 0) {
				id = i3GEO.gadgets.PARAMETROS.mostraEscalaGrafica.idhtml;
			}
			var ins;
			if ($i(id)) {
				if (!$i("imagemEscalaGrafica")) {
					ins =
						"<img class='menuarrow' src=\"" + i3GEO.configura.locaplic
							+ "/imagens/branco.gif\" title='op&ccedil;&otilde;es' onclick='i3GEO.mapa.dialogo.opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src='' />";
					$i(id).innerHTML = ins;
				}
				i3GEO.gadgets.atualizaEscalaGrafica();
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
					"i3GEO.gadgets.atualizaEscalaGrafica()"
				]);
			}
		},
		/**
		 * Function: atualizaEscalaGrafica
		 *
		 * Atualiza a escala gr&aacute;fica
		 *
		 */
		atualizaEscalaGrafica : function() {
			var e = $i("imagemEscalaGrafica");
			if (!e) {
				i3GEO.eventos.removeEventos("NAVEGAMAPA", [
					"i3GEO.gadgets.atualizaEscalaGrafica()"
				]);
				return;
			}
			temp = function(retorno) {
				eval(retorno.data);
				$i("imagemEscalaGrafica").src = scaimagem;
			};
			i3GEO.php.escalagrafica(temp);
		},
		/**
		 * Function: mostraBuscaRapida
		 *
		 * Mostra a op&ccedil;&atilde;o de busca r&aacute;pida de lugares por palavra digitada.
		 *
		 * Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML existente no mapa que contenha o id
		 * definido em i3GEO.gadgets.PARAMETROS (buscaRapida)
		 *
		 * Onde a busca ser&aacute; feita &eacute; controlado pela vari&aacute;vel i3GEO.gadgets.PARAMETROS.mostraBuscaRapida
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraBuscaRapida : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraBuscaRapida()");

			var ins = "", temp, fbusca, hashMustache, templateMustache, conf;
			conf = i3GEO.gadgets.PARAMETROS.mostraBuscaRapida;

			if (arguments.length === 0) {
				id = conf.idhtml;
			}
			i3GEO.gadgets.mostraBuscaRapida.id = id;
			temp = $i(id);
			if (temp) {
				// monta a interface
				hashMustache = {
					"idform" : "i3GEObotaoFormBuscaRapida" + id,
					"idinput" : "valorBuscaRapida" + id,
					"link" : i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=71",
					"branco" : i3GEO.configura.locaplic + "/imagens/branco.gif",
					"ajuda" : $trad("p13"),
					"prop" : "i3GEObotaoPropriedadesBuscaRapida" + id,
					"busca" : "i3GEObotaoBuscaRapida" + id,
					"cabecalho" : $trad("x36")
				};
				if(conf.tipo === "mini"){
					templateMustache =
						"" + "<table><tr>"
							+ "	<td><a class=ajuda_usuario target=_blank href='{{link}}' ><b> </b></a></td>"
							+ "	<td><img src='{{branco}}' title='{{ajuda}}' class='ticPropriedades2' id={{prop}} style='margin-right:5px;margin-left:5px;'/></td>"
							+ "	<td>"
							+ "		<form id={{idform}}>"
							+ "			<div class='i3geoForm' style='width:160px;'><input class=i3geoFormSemIcone type=text value='' id='{{idinput}}' /></div>"
							+ "		</form>"
							+ "	</td>"
							+ "	<td><img src='{{branco}}' class='ticfind' id={{busca}} style='margin-left:3px;' /></td>"
							+ "</tr></table>";
					ins = Mustache.render(templateMustache, hashMustache);
				}
				if(conf.tipo === "normal"){
					templateMustache = ""
						+ "<p class=paragrafo >{{{cabecalho}}}</p>"
						+ "<form id={{idform}}>"
						+ "	<div class='i3geoForm i3geoFormIconeBusca'>"
						+ "		<input type=text value='' id='{{idinput}}' />"
						+ "	</div>"
						+ "</form>";
					ins = Mustache.render(templateMustache, hashMustache);

					hashMustache = {
						"externo" : "checked",
						"interno" : "",
						"google" : "checked",
						"titulo" : $trad("x37"),
						"servExt" : $trad("x38"),
						"servMap" : $trad("x39"),
						"googlemaps" : false,
						"ajuda" : $trad("x40")
					};
					if (i3GEO.Interface.ATUAL === "googlemaps") {
						hashMustache["googlemaps"] = true;
					}

					if(conf.servicosexternos == false){
						hashMustache["externo"] = "";
					}
					if(conf.temasmapa == true){
						hashMustache["interno"] = "checked";
					}
					templateMustache = ""
						+ "<p class=paragrafo >{{titulo}}:</p>"
						+ "<p class=paragrafo style='display:inline;'>"
						+ "	<input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos = this.checked' type=checkbox {{externo}} >"
						+ "	{{servExt}}</p>"
						+ "<br><p class=paragrafo style='display:inline;'>"
						+ "	<input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa = this.checked' type=checkbox {{interno}} >"
						+ "	{{servMap}}</p>"
						+ "{{#googlemaps}}"
						+ "<p class=paragrafo style='display:inline;'>"
						+ "	<input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.google = this.checked' type=checkbox {{google}} >"
						+ "	Google"
						+ "</p>"
						+ "{{/googlemaps}}"
						+ "<p class=paragrafo >{{ajuda}}</p>";

					ins += i3GEO.util.parseMustache(templateMustache, hashMustache);
				}
				temp.innerHTML = ins;
				// funcao de busca
				fbusca =
					function() {
						// sem condicoes de busca
						if (conf.google === false && conf.servicosexternos === false
							&& conf.temasmapa === false) {
							i3GEO.janela.tempoMsg($trad("x35"));
							return;
						}
						// nao digitou palavra
						if ($i("valorBuscaRapida" + id).value === "") {
							i3GEO.janela.tempoMsg($trad("x36"));
							return;
						}
						// janela com a rotina e o resultado da busca
						i3GEO.janela.cria("300px", "280px", i3GEO.configura.locaplic + "/ferramentas/buscarapida/index.htm", "", "",
							"<div class='i3GeoTituloJanela'>"+$trad("o2")+"</div>");
						return false;
					};
				if($i("i3GEObotaoBuscaRapida" + id)){
					$i("i3GEObotaoBuscaRapida" + id).onclick = fbusca;
				}
				$i("i3GEObotaoFormBuscaRapida" + id).onsubmit = fbusca;
				if($i("i3GEObotaoPropriedadesBuscaRapida" + id)){
					$i("i3GEObotaoPropriedadesBuscaRapida" + id).onclick =
						function() {
							var janela, hashMustache, templateMustache, ins, interno = "", externo = "", google = "";
							if (conf.servicosexternos) {
								externo = "checked";
							}
							if (conf.temasmapa) {
								interno = "checked";
							}
							if (conf.google) {
								google = "checked";
							}
							hashMustache = {
								"externo" : externo,
								"interno" : interno,
								"google" : google,
								"titulo" : $trad("x37"),
								"servExt" : $trad("x38"),
								"servMap" : $trad("x39"),
								"googlemaps" : false,
								"ajuda" : $trad("x40")
							};
							if (i3GEO.Interface.ATUAL === "googlemaps") {
								hashMustache["googlemaps"] = true;
							}
							templateMustache =
								"" + "<p class=paragrafo >{{titulo}}:</p>"
									+ "<table class=lista3 >"
									+ "	<tr>"
									+ "		<td><input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos = this.checked' type=checkbox {{externo}} ></td>"
									+ "		<td>{{servExt}}</td>"
									+ "	</tr>"
									+ "	<tr>"
									+ "		<td><input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa = this.checked' type=checkbox {{interno}} ></td>"
									+ "		<td>{{servMap}}</td>"
									+ "	</tr>"
									+ "{{#googlemaps}}"
									+ "	<tr>"
									+ "		<td><input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.google = this.checked' type=checkbox {{google}} ></td>"
									+ "		<td>Google</td>"
									+ "	</tr>"
									+ "{{/googlemaps}}"
									+ "</table><br><p class=paragrafo >{{ajuda}}</p>";

							ins = i3GEO.util.parseMustache(templateMustache, hashMustache);
							janela = i3GEO.janela.cria("300px", "150px", "", "", "", "<div class='i3GeoTituloJanela'>"+$trad("s5")+"</div>", "i3GEOpropriedadesBuscaRapida" + id);
							janela[0].setBody("<div>" + ins + "</div>");
						};
				}
			}
		},
		/**
		 * Function: mostraHistoricoZoom
		 *
		 * Mostra na barra de zoom os &iacute;cones que controlam a visualiza&ccedil;&atilde;o do hist&oacute;rico da
		 * navega&ccedil;&atilde;o sobre o mapa
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraHistoricoZoom : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraHistoricoZoom()");

			if (arguments.length === 0) {
				id = i3GEO.gadgets.PARAMETROS.mostraHistoricoZoom.idhtml;
			}
			if ($i(id)) {
				marcadorZoom = "";
				var ins = "<table style='text-align:center;position:relative;left:";
				if (navm) {
					ins += "0px;'>";
				} else {
					ins += "6px;'>";
				}
				ins +=
					"<tr><td><img  id='i3geo_zoomanterior' class='zoomAnterior' title='anterior' src='" + i3GEO.configura.locaplic
						+ "/imagens/branco.gif"
						+ "'  /></td>";
				ins += "<td>&nbsp;</td>";
				ins +=
					"<td><img  id='i3geo_zoomproximo' class='zoomProximo' title='proximo' src='" + i3GEO.configura.locaplic
						+ "/imagens/branco.gif"
						+ "'  /></td>";
				ins += "</tr></table>";
				$i(id).innerHTML = ins;
			}
		},
		/**
		 * i3GEO.gadgets.visual (depreciado)
		 *
		 * Gera os &iacute;cones e controla as op&ccedil;&otilde;es de modifica&ccedil;&atilde;o do visual do mapa.
		 *
		 * O visual consiste na defini&ccedil;&atilde;o dos &iacute;cones utilizados no mapa. O visual pode ser modificado na
		 * inicializa&ccedil;&atilde;o ou ent&atilde;o escolhido pelo usu&aacute;rio.
		 *
		 * Os visuais dispon&iacute;veis s&atilde;o definidos no servidor e consistem em diret&oacute;rios localizados em
		 * i3geo/imagens/visual. A lista de visuais dispon&iacute;veis &eacute; obtida na inicializa&ccedil;&atilde;o do i3geo.
		 *
		 * Os &iacute;cones para mudan&ccedil;a do visual s&atilde;o inclu&iacute;dos no elemento HTML definido em
		 * i3geo.gadgets.PARAMETROS.visual
		 */
		visual : {
			/**
			 * Constr&oacute;i os &iacute;cones de escolha do visual.
			 *
			 * Parametro:
			 *
			 * id {String} - id do elemento que receber&aacute; os &iacute;cones (opcional)
			 */
			inicia : function(id) {
				alert("A i3GEO.gadgets.visual foi depreciado");
			},
			/**
			 * Troca o visual atual. A lista de visuais dispon&iacute;veis &eacute; obtida em i3GEO.parametros.listavisual
			 *
			 * Parametro:
			 *
			 * visual {String} - nome do visual que ser&aacute; utilizado.
			 */
			troca : function(visual) {
				alert("A i3GEO.gadgets.visual foi depreciado");
			}
		}

	};