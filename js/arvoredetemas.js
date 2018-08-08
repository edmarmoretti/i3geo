/**
 * Title: &Aacute;rvore de temas
 *
 * Monta a &aacute;rvore com os temas dispon&iacute;veis para ser adicionados ao
 * mapa
 *
 * Namespace:
 *
 * i3GEO.arvoreDeTemas
 *
 *
 */

if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.arvoreDeTemas = {
	/**
	 * Propriedade: IDSMENUS
	 *
	 * Array com a lista de ids de menus cadastrados que ser&atilde;o
	 * considerados na montagem da &aacute;rvore. Por default &eacute; vazio, o
	 * que significa que todos os menus serao considerados.
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *  []
	 */
	IDSMENUS : [],

	/**
	 * Function: buscaTema2
	 *
	 * Procura temas na arvore de temas (a busca e feita no servidor e nao na
	 * arvore atual).
	 *
	 * Parametro:
	 *
	 * {String}
	 */
	buscaTema2 : function(palavra) {
		if (palavra === "") {
			return;
		}
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.buscaTema()");

		var busca, root, nodePalavra = "";
		resultadoProcurar = function(retorno) {
			var ig, montaTexto = function(ngSgrupo) {
				var tempn, ngTema, tempng, mostra, d, lk = "", st, sg;
				tempn = ngSgrupo.length;
				for (sg = 0; sg < tempn; sg += 1) {
					ngTema = ngSgrupo[sg].temas;
					tempng = ngTema.length;
					for (st = 0; st < tempng; st += 1) {
						mostra = true;
						try {
							if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
									&& ngTema[st].download === "nao") {
								mostra = false;
							}
							if (i3GEO.arvoreDeTemas.FILTRAOGC
									&& ngTema[st].ogc === "nao") {
								mostra = false;
							}
						} catch (e) {
						    if (typeof (console) !== 'undefined')
							console.error(e.message)

						}
						if (mostra) {
							d = i3GEO.arvoreDeTemas.montaTextoTema("gray",
									ngTema[st]);
							if (ngTema[st].link !== " ") {
								lk = "<a href='" + ngTema[st].link
										+ "' target='blank'>&nbsp;fonte</a>";
							}
							if (ngSgrupo[sg].subgrupo) {
								d += "<td style='text-allign:left'> ("
										+ (ngSgrupo[sg].subgrupo) + ") " + lk
										+ "</td>";
							} else {
								d += "<td style='text-allign:left'> ("
										+ (ngSgrupo[sg].grupo) + ")" + lk
										+ "</td>";
							}
							//aqui vai a saida. antes era arvore
						}
						conta += 1;
					}
				}
			};
		};

		//
		// funcao que sera executada para buscar os temas
		//
		busca = function() {
			i3GEO.php.procurartemas2(resultadoProcurar, i3GEO.util
					.removeAcentos(palavra));
		};
	},
	/**
	 * Function: comboMenus
	 *
	 * Busca a lista de menus existentes no i3geo e monta um combo com o
	 * resultado.
	 *
	 * Ao escolher uma opcao do combo, a funcao de retorno recebera como
	 * parametro o id do menu.
	 *
	 * Parametros:
	 *
	 * {String} - endereco do i3geo
	 *
	 * {String} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
	 *
	 * {String} - id do elemento HTML que recebera o combo
	 *
	 * {String} - id do combo que sera criado
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 */
	comboMenus : function(locaplic, funcaoOnchange, idDestino, idCombo,
			largura, altura) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboMenus()");

		i3GEO.configura.locaplic = locaplic;
		var combo = function(retorno) {
			var ob, ins, ig;
			ob = retorno.data;
			ins = "<select id='"
					+ idCombo
					+ "' SIZE="
					+ altura
					+ " style=width:"
					+ largura
					+ "px onchange='"
					+ funcaoOnchange
					+ "(this.value)' ><option value='' >Escolha um menu:</option>";
			for (ig = 0; ig < ob.length; ig += 1) {
				if (ob[ig].publicado !== "nao" && ob[ig].publicado !== "NAO") {
					if (ob[ig].nomemenu) {
						ins += "<option value=" + ob[ig].idmenu + " >"
								+ ob[ig].nomemenu + "</option>";
					}
				}
			}
			$i(idDestino).innerHTML = ins + "</select>";
			return retorno.data;
		};
		i3GEO.php.pegalistademenus(combo);
	},
	/**
	 * Function: comboGruposMenu
	 *
	 * Busca a lista de grupos existentes no menu de temas do i3geo e monta um
	 * combo com o resultado.
	 *
	 * Ao escolher uma opcao do combo, a funcao de retorno recebera como
	 * parametro o id do grupo.
	 *
	 * Parametros:
	 *
	 * {String} - endereco do i3geo
	 *
	 * {String} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
	 *
	 * {String} - id do elemento HTML que recebera o combo
	 *
	 * {String} - id do combo que sera criado
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 *
	 * {inteiro} - id do menu que sera utilizado para obter os dados
	 */
	comboGruposMenu : function(locaplic, funcaoOnchange, idDestino, idCombo,
			largura, altura, id_menu) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboGruposMenu()");

		i3GEO.configura.locaplic = locaplic;
		i3GEO.arvoreDeTemas.temasRaizGrupos = [];
		var combo = function(retorno) {
			var ins, ig, obGrupos = retorno.data;
			ins = "<select id='"
					+ idCombo
					+ "' SIZE="
					+ altura
					+ " style=width:"
					+ largura
					+ "px onchange='"
					+ funcaoOnchange
					+ "(this.value)' ><option value='' >Escolha um grupo:</option>";
			for (ig = 0; ig < obGrupos.grupos.length; ig += 1) {
				if (obGrupos.grupos[ig].nome) {
					ins += "<option value=" + obGrupos.grupos[ig].id_n1 + " >"
							+ obGrupos.grupos[ig].nome + "</option>";
				}
				i3GEO.arvoreDeTemas.temasRaizGrupos[obGrupos.grupos[ig].id_n1] = obGrupos.grupos[ig].temasgrupo;
			}
			$i(idDestino).innerHTML = ins + "</select>";
		};
		i3GEO.php.pegalistadegrupos(combo, id_menu, "nao");
	},
	/**
	 * Function: comboSubGruposMenu
	 *
	 * Monta um combo com a lista de subgrupos de um grupo do menu de temas do
	 * i3geo.
	 *
	 * Ao escolher um subgrupo, a funcao de retorno recebera o id do grupo e o
	 * id do subgrupo.
	 *
	 * Parametros:
	 *
	 * {String} - endereco do i3geo
	 *
	 * {String} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
	 *
	 * {String} - id do elemento HTML que recebera o combo
	 *
	 * {String} - id do combo que sera criado
	 *
	 * {String} - identificador do grupo que sera pesquisado
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 */
	comboSubGruposMenu : function(locaplic, funcaoOnchange, idDestino, idCombo,
			idGrupo, largura, altura) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboSubGruposMenu()");

		if (idGrupo !== "") {
			var combo = function(retorno) {
				var ins, sg, ig;
				ins = "<select id='"
						+ idCombo
						+ "' size="
						+ altura
						+ " style=width:"
						+ largura
						+ "px onchange='"
						+ funcaoOnchange
						+ "(\""
						+ idGrupo
						+ "\",this.value)' ><option value='' >Escolha um sub-grupo:</option>";
				if (retorno.data.subgrupo) {
					sg = retorno.data.subgrupo;
					for (ig = 0; ig < sg.length; ig += 1) {
						ins += "<option value=" + sg[ig].id_n2 + " >"
								+ sg[ig].nome + "</option>";
					}
				}
				$i(idDestino).innerHTML = ins + "</select>";
			};
			i3GEO.php.pegalistadeSubgrupos(combo, "", idGrupo);
		}
	},
	/**
	 * Function: comboTemasMenu
	 *
	 * Monta um combo com a lista de temas do i3geo.
	 *
	 * Parametros:
	 *
	 * {string} - endereco do i3geo
	 *
	 * {string} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
	 *
	 * {string} - id do elemento HTML que recebera o combo
	 *
	 * {string} - id do combo que sera criado
	 *
	 * {string} - identificador do grupo que sera pesquisado
	 *
	 * {string} - id do subgrupo
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 *
	 * {string} - id do menu escolhido
	 *
	 * {objeto} - (opcional) objeto contendo a lista de temas
	 */
	comboTemasMenu : function(locaplic, funcaoOnchange, idDestino, idCombo,
			idGrupo, idSubGrupo, largura, altura, id_menu, temas) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboTemasMenu()");

		var combo = function(retorno) {
			var ins, sg, ig;
			if (idSubGrupo != "") {
				ins = "<select id='"
						+ idCombo
						+ "' size="
						+ altura
						+ " style=width:"
						+ largura
						+ "px onchange='"
						+ funcaoOnchange
						+ "("
						+ idGrupo
						+ ","
						+ idSubGrupo
						+ ",this.value)' ><option value='' >Escolha um tema:</option>";
			} else {
				ins = "<select id='"
						+ idCombo
						+ "' size="
						+ altura
						+ " style=width:"
						+ largura
						+ "px onchange='"
						+ funcaoOnchange
						+ "("
						+ idGrupo
						+ ",\"\",this.value)' ><option value='' >Escolha um tema:</option>";
			}

			if (typeof (retorno.data) !== 'undefined') {
				retorno = retorno.data.temas;
			}
			sg = retorno.length;
			for (ig = 0; ig < sg; ig++) {
				ins += "<option value=" + retorno[ig].tid + " >"
						+ retorno[ig].nome + "</option>";
			}
			$i(idDestino).innerHTML = ins + "</select>";
		};
		if (typeof (temas) === 'undefined' || temas === "") {
			i3GEO.php.pegalistadetemas(combo, id_menu, idGrupo, idSubGrupo);
		} else {
			combo(temas);
		}
	},
	/**
	 * Section: i3GEO.arvoreDeTemas.dialogo
	 *
	 * Abre as janelas de dialogo com as opcoes adicionais que permitem
	 * acrescentar temas ao mapa
	 *
	 * Por exemplo, para abrir a janela de upload de arquivos dbf, utilize
	 *
	 * i3GEO.arvoreDeTemas.dialogo.uploaddbf()
	 */
	dialogo : {
		/**
		 * Function: dialogo.uploadarquivo
		 *
		 * Abre uma janela flutunate que permite abrir outras ferramentas para o
		 * upload de arquivos de determinados tipos
		 */
		uploadarquivo : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/uploadarquivos/dependencias.php",
					"i3GEOF.uploadarquivos.iniciaJanelaFlutuante()",
					"i3GEOF.uploadarquivos_script");
		},
		/**
		 * Function: dialogo.carouselTemas
		 *
		 * Abre a janela flutuante para o usuario adicionar temas baseado nas
		 * imagens miniatura
		 */
		carouselTemas : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/carouseltemas/index.js",
					"i3GEOF.carouseltemas.criaJanelaFlutuante()",
					"i3GEOF.carouseltemas_script");
		},
		/**
		 * Function: dialogo.buscaInde
		 *
		 * Abre a janela flutuante para o usuario procurar metadados na INDE
		 */
		buscaInde : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/buscainde/dependencias.php",
					"i3GEOF.buscainde.start()",
					"i3GEOF.buscainde_script");
		},
		/**
		 * Function: dialogo.nuvemTags
		 *
		 * Mostra a nuvem de tags para escolha de temas baseado nos tags
		 * registrados nos menus de temas
		 */
		nuvemTags : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/nuvemtags/dependencias.php",
					"i3GEOF.nuvemtags.iniciaJanelaFlutuante()",
					"i3GEOF.nuvemtags_script");
		},
		/**
		 * Function: dialogo.nuvemTagsFlash
		 *
		 * Mostra a nuvem de tags para escolha de temas baseado nos tags
		 * registrados nos menus de temas.
		 *
		 * Essa ferramenta e alternativa a ferramenta nuvemTags, mostrando tbm a
		 * nuvem com um aplicativo em flash
		 */
		nuvemTagsFlash : function() {
			i3GEO.janela.cria("550px", "350px", i3GEO.configura.locaplic
					+ "/ferramentas/nuvemtagsflash/index.htm", "", "",
					$trad("x44"));
		},
		/**
		 * Function: dialogo.navegacaoDir
		 *
		 * Abre a janela para adicionar temas navegando pelos diretorios do
		 * servidor
		 */
		navegacaoDir : function() {
			i3GEO.janela
					.cria("550px", "350px", i3GEO.configura.locaplic
							+ "/ferramentas/navegacaodir/index.htm", "", "",
							"<div class='i3GeoTituloJanela'>" + $trad("x45")
									+ "</div>");
		},
		/**
		 * Function: dialogo.importarwmc
		 *
		 * Abre a janela para importar um arquivo WMC (Web Map Context)
		 */
		importarwmc : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/importarwmc/dependencias.php",
					"i3GEOF.importarwmc.start()",
					"i3GEOF.importarwmc_script");
		},
		/**
		 * Function: dialogo.conectarwfs
		 *
		 * Abre a janela para adicionar temas tendo como fonte um web service do
		 * tipo wfs
		 */
		conectarwfs : function() {
			i3GEO.janela.cria("400px", "300px", i3GEO.configura.locaplic
					+ "/ferramentas/conectarwfs/index.htm", "", "",
					"<div class='i3GeoTituloJanela'>WFS</div>");
		},
		/**
		 * Function: dialogo.downloadbase
		 *
		 * Abre o aplicativo datadownload
		 */
		downloadbase : function() {
			window.open(i3GEO.configura.locaplic + "/datadownload.htm");
		}
	}
};