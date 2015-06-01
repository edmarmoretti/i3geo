/**
 * Title: Temas
 *
 * Funcoes de dialogo e processamento de propriedades de um tema existente no mapa
 *
 * Em i3GEO.tema.dialogo estao as funcoes de abertura dos dialogos para alteracao das propriedades do tema,
 *
 * Namespace:
 *
 * i3GEO.tema
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_tema.js>
 */
/**
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
//TODO nova ferramenta para definir GEOMTRANSFORM
i3GEO.tema =
	{
		/**
		 * Objeto que contem os identificadores dos temporizadores (setInterval) estabelecidos para cada camada
		 *
		 * Type: {objeto} - {idtema:{idtemporizador:,tempo:}}
		 */
		TEMPORIZADORESID : {},
		/**
		 * Function: ativaFerramentas
		 * 
		 * Verifica se uma camada possuí ferramentas configuradas e que devem ser abertas ao ser adicionada ao mapa
		 * 
		 * Parametros:
		 * 
		 * {objeto} - objeto camada ver em i3GEO.arvoreDeCamadas.CAMADAS
		 */
		ativaFerramentas : function(camada){
			if(camada.ferramentas && camada.ferramentas != ""){
				if(camada.tme){
					i3GEO.tema.dialogo.tme(camada.name);
				}
			}
		},
		/**
		 * Function: exclui
		 *
		 * Exclui um tema do mapa
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 *
		 * {boolean} - confirma exclusao
		 */
		exclui : function(tema,confirma) {
			if(confirma && confirma === true){
				i3GEO.janela.confirma($trad("removerDoMapa"), 300, $trad("x14"),
					"", function() {
						i3GEO.tema.exclui(tema);
					});
				return;
			}
			// remove o tema do DOM e seus filhos
			try {
				try {
					i3GEO.pluginI3geo.removeCamada(tema);
				} catch (r) {
				}
				var p = document.getElementById("idx" + tema).parentNode.parentNode.parentNode;
				do {
					p.removeChild(p.childNodes[0]);
				} while (p.childNodes.length > 0);
				p.parentNode.removeChild(p);
				// atualiza a arvore de temas se for o caso
				var ck = i3GEO.arvoreDeTemas.buscaCheckbox(tema);
				if (ck) {
					ck.checked = false;
				}
			} catch (e) {
			}
			i3GEO.php.excluitema(i3GEO.atualiza, [
				tema
			]);
			i3GEO.mapa.ativaTema();
			i3GEO.temaAtivo = "";
		},
		/**
		 * Function: fonte
		 *
		 * Abre os metadados registrados para o tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 *
		 * {boolean} - abre em um popup
		 */
		fonte : function(tema, popup, link) {
			i3GEO.mapa.ativaTema(tema);
			if(!link){
				link = i3GEO.configura.locaplic + "/admin/abrefontemapfile.php?tema=" + tema;
			}
			if (!popup) {
				window.open(link);
			} else {
				i3GEO.janela.cria(
					(i3GEO.parametros.w / 2) + 25 + "px",
					(i3GEO.parametros.h / 2) + 18 + "px",
					link,
					"",
					"",
					"<div class='i3GeoTituloJanela'>Metadata</div>",
					"metadata" + tema
				);
			}
		},
		/**
		 * Sobe um tema na ordem de desenho
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 */
		sobe : function(tema) {
			i3GEO.php.sobetema(function(retorno) {
				//
				// atualiza apenas remonta a arvore
				// no caso de interfaces como openlayers
				// e necessario mover o DIV tbm
				//
				i3GEO.atualiza(retorno);
				if (i3GEO.Interface.ATUAL === "openlayers") {
					i3GEO.Interface.openlayers.ordenaLayers();
				}
			}, tema);
		},
		/**
		 * Desce um tema na ordem de desenho
		 *
		 * Parametros:
		 *
		 * tema - codigo do tema
		 */
		desce : function(tema) {
			i3GEO.php.descetema(function(retorno) {
				//
				// atualiza apenas remonta a arvore
				// no caso de interfaces como openlayers
				// e necessario mover o DIV tbm
				//
				i3GEO.atualiza(retorno);
				if (i3GEO.Interface.ATUAL === "openlayers") {
					i3GEO.Interface.openlayers.ordenaLayers();
				}
			}, tema);
		},
		/**
		 * Function: zoom
		 *
		 * Zoom para o tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 */
		zoom : function(tema) {
			i3GEO.mapa.ativaTema(tema);
			i3GEO.php.zoomtema(i3GEO.atualiza, tema);
		},
		/**
		 * Function: zoomsel
		 *
		 * Zoom para os elementos selecionados de um tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 */
		zoomsel : function(tema) {
			i3GEO.mapa.ativaTema(tema);
			i3GEO.php.zoomsel(i3GEO.atualiza, tema);
		},
		/**
		 * Function: limpasel
		 *
		 * Limpa a selecao do tema
		 *
		 * Parametros:
		 *
		 * {string} - ID (name) do tema clicado
		 */
		limpasel : function(tema) {
			i3GEO.mapa.ativaTema(tema);
			i3GEO.php.limpasel(function(retorno) {
				i3GEO.atualiza(retorno);
				i3GEO.Interface.atualizaTema(retorno, tema);
			}, tema);
		},
		/**
		 * Function: mudatransp
		 *
		 * Muda a transparencia de um tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 *
		 * {numeric} - valor da transparencia
		 */
		mudatransp : function(idtema, valor) {
			i3GEO.mapa.ativaTema(idtema);
			// o campo input com o valor possui o prefixo 'tr' seguido pelo codigo do tema
			if (!valor) {
				if ($i("tr" + idtema)) {
					valor = $i("tr" + idtema).value;
				}
			}
			if (valor !== "") {
				i3GEO.php.mudatransp(function(retorno) {
					i3GEO.atualiza(retorno);
					i3GEO.Interface.atualizaTema(retorno, idtema);
				}, idtema, valor);
			} else {
				i3GEO.janela.tempoMsg($trad("x16"));
			}
		},
		/**
		 * Function: invertestatuslegenda
		 *
		 * Inverte o status atual do metadata CLASSE, permitindo esconder ou mostrar a legenda do tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 */
		invertestatuslegenda : function(idtema) {
			i3GEO.janela.tempoMsg($trad("x17"));
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.php.invertestatuslegenda(function(retorno) {
				i3GEO.atualiza(retorno);
				i3GEO.arvoreDeCamadas.atualiza();
			}, idtema);
		},
		/**
		 * Function: alteracorclasse
		 *
		 * Altera a cor de uma classe de um tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 *
		 * {numeric} - id da classe
		 *
		 * {string} - nova cor (r,g,b)
		 */
		alteracorclasse : function(idtema, idclasse, rgb) {
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.php.aplicaCorClasseTema(temp = function() {
				i3GEO.atualiza();
				i3GEO.Interface.atualizaTema("", idtema);
				i3GEO.arvoreDeCamadas.atualizaLegenda(idtema);
			}, idtema, idclasse, rgb);
		},
		/**
		 * Function: mudanome
		 *
		 * Muda o nome de um tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 */
		mudanome : function(idtema,valor) {
			i3GEO.mapa.ativaTema(idtema);
			if (!valor) {
				return;
			}
			if (valor !== "") {
				i3GEO.php.mudanome(i3GEO.atualiza, idtema, valor);
			} else {
				i3GEO.janela.tempoMsg($trad("x18"));
			}
		},
		/**
		 * Function: copia
		 *
		 * Adiciona ao mapa uma copia do tema
		 *
		 * Parametros:
		 *
		 * {string} - codigo do tema
		 */
		copia : function(idtema) {
			i3GEO.php.copiatema(i3GEO.atualiza, idtema);
		},
		/**
		 * Function: mostralegendajanela
		 *
		 * Mostra a legenda de um tema em uma janela flutuante especifica
		 *
		 * Na configuracao padrao, essa funcao e disparada quando o usuario estaciona o ouse sobre o nome de um tema na arvore de camadas
		 *
		 * O uso normal seria nas opcoes onmouseover e onmouseout
		 *
		 * Exemplo:
		 *
		 * onmouseover = i3GEO.tema.mostralegendajanela(idtema,nome,"ativatimer")
		 *
		 * onmouseout = i3GEO.tema.mostralegendajanela(idtema,nome,"desaativatimer")
		 *
		 * onclick = i3GEO.tema.mostralegendajanela(idtema,nome,"abrejanela")
		 *
		 * Parametros:
		 *
		 * {String} - codigo do tema
		 *
		 * {String} - nome completo do tema que sera mostrado no cabecalho da janela
		 *
		 * {ativatimer|desativatimer|abrejanela} - tipo de operacao que sera executada
		 */
		mostralegendajanela : function(idtema, nome, tipoOperacao) {
			if (tipoOperacao === "ativatimer") {
				mostralegendajanelaTimer = setTimeout("i3GEO.tema.mostralegendajanela('" + idtema + "','" + nome + "','abrejanela')", 4000);
			}
			if (tipoOperacao === "abrejanela") {
				try {
					clearTimeout(mostralegendajanelaTimer);
				} catch (e) {
				}
				if (!$i("janelaLegenda" + idtema)) {
					var janela = i3GEO.janela.cria("250px", "", "", "", "", nome, "janelaLegenda" + idtema, false);
					janela[2].style.textAlign = "left";
					janela[2].style.background = "white";
					janela[2].innerHTML = $trad("o1");
				}
				i3GEO.php.criaLegendaHTML(function(retorno) {
					$i("janelaLegenda" + idtema + "_corpo").innerHTML = retorno.data.legenda;
				}, idtema, "legenda3.htm");
			}
			if (tipoOperacao === "desativatimer") {
				clearTimeout(mostralegendajanelaTimer);
			}
		},
		/**
		 * Function: temporizador
		 *
		 * Aplica um temporizador para que a camada seja redesenhada em determinado intervalo de tempo.
		 *
		 * O campo com o valor de tempo (em segundos) e composto por "temporizador"+idtema
		 *
		 * Parametros:
		 *
		 * {string} - id que identifica o tema no map file.
		 */
		temporizador : function(idtema, tempo) {
			var t;
			if(!tempo){
				if ($i("temporizador" + idtema)) {
					tempo = $i("temporizador" + idtema).value;
				}
				else{
					tempo = 0;
				}
			}
			if (tempo != "" && parseInt(tempo, 10) > 0) {
				//eval('i3GEO.tema.TEMPORIZADORESID.' + idtema + ' = {tempo: ' + tempo + ',idtemporizador: setInterval(function(' + idtema
				//	+ '){if(!$i("arrastar_' + idtema + '")){delete(i3GEO.tema.TEMPORIZADORESID.' + idtema
				//	+ ');return;}i3GEO.Interface.atualizaTema("",idtema);},parseInt(' + tempo + ',10)*1000)};');
				t = function(){
					if(!$i("arrastar_" + idtema)){
						delete(i3GEO.tema.TEMPORIZADORESID[idtema]);
						return;
					}
					i3GEO.Interface.atualizaTema("",idtema);
				};

				i3GEO.tema.TEMPORIZADORESID[idtema] = {
					tempo: tempo,
					idtemporizador: setInterval(t,
						parseInt(tempo,10)*1000
					)
				};
			} else {
				try {
					window.clearInterval(i3GEO.tema.TEMPORIZADORESID[idtema].idtemporizador);
					delete (i3GEO.tema.TEMPORIZADORESID[idtema]);
				} catch (e) {
				}
			}
		},
		/**
		 * Section: i3GEO.tema.dialogo
		 *
		 * Abre as telas de dialogo das opcoes de manipulacao de um tema
		 */
		dialogo : {
			/**
			 * Function: storymap
			 *
			 * Abre a ferramenta storymap
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 */
			storymap : function(tema) {
				if(!tema){
					tema = "";
				}
				var temp = function(){
					i3GEOF.storymap.iniciaJanelaFlutuante(tema);
				};
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.storymap()",
					"storymap",
					"storymap",
					"dependencias.php",
					temp);
			},
			/**
			 * Function: tme
			 *
			 * Abre a ferramenta TME
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 */
			tme : function(tema) {
				if(!tema){
					tema = "";
				}
				var temp = function(){
					//i3GEO.mapa.ativaTema(tema);
					i3GEOF.tme.iniciaJanelaFlutuante(tema);
				};
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.tme()",
					"tme",
					"tme",
					"dependencias.php",
					temp);
			},
			/**
			 * Function: mostraWms
			 *
			 * Mostra a url que da acesso ao WMS de um tema
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 */
			mostraWms : function(tema) {
				i3GEO.janela.mensagemSimples(i3GEO.configura.locaplic + "/ogc.php?tema=" + tema, "WMS url");
			},
			/**
			 * Function: comentario
			 *
			 * Abre a janela de dialogo para o usuario ver e inserir comentarios em um tema
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 */
			comentario : function(tema) {
				i3GEO.janela
					.cria(
						"530px",
						"330px",
						i3GEO.configura.locaplic + "/ferramentas/comentarios/index.php?tema=" + tema + "&g_sid=" + i3GEO.configura.sid
							+ "&locaplic=" + i3GEO.configura.locaplic,
						"",
						"",
						"<img src='"
							+ i3GEO.configura.locaplic
							+ "/imagens/player_volta.png' style=cursor:pointer onclick='javascript:history.go(-1)'><span style=position:relative;top:-2px; > "
							+ $trad("x19") + " " + tema + "</span><a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
							+ "/ajuda_usuario.php?idcategoria=7&idajuda=68' ><b> </b></a>",
						"comentario" + Math.random());
			},
			/**
			 * Function: cortina
			 *
			 * Abre a janela de dialogo da ferramenta cortina
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 *
			 */
			cortina : function(tema) {
				i3GEO.mapa.ativaTema(tema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.cortina()",
					"cortina",
					"cortina",
					"dependencias.php",
					"i3GEOF.cortina.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: mmscale
			 *
			 * Abre a janela de dialogo que permite definir o comportamento do mapa em fun&ccedil;&atilde;o da escala
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 *
			 */
			mmscale : function(tema) {
				i3GEO.mapa.ativaTema(tema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.mmscale()",
					"mmscale",
					"mmscale",
					"dependencias.php",
					"i3GEOF.mmscale.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: atalhoscamada
			 *
			 * Abre a janela de dialogo que abre os atalhos de configura&ccedil;&atilde;o de um tema (utilizad na &aacute;rvore de camadas)
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 *
			 */
			atalhoscamada : function(tema) {
				i3GEO.mapa.ativaTema(tema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.atalhoscamada()",
					"atalhoscamada",
					"atalhoscamada",
					"dependencias.php",
					"i3GEOF.atalhoscamada.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: abreKml
			 *
			 * Abre a janela de dialogo da ferramenta convertekml
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema escolhido
			 *
			 * {string} - tipo de kml - kml|kmz , o tipo kmz permite acessar os dados via kml (por meio de um WMS) e via kml vetorial.
			 */
			abreKml : function(tema, tipo) {
				if (arguments.lenght === 1) {
					tipo = "kml";
				}
				if (typeof (i3GEOF.converteKml) === 'undefined') {
					i3GEO.util.scriptTag(
						i3GEO.configura.locaplic + "/ferramentas/convertekml/index.js",
						"i3GEOF.converteKml.criaJanelaFlutuante('" + tema + "','" + tipo + "')",
						"i3GEOF.converteKml_script");
				} else {
					i3GEOF.converteKml.criaJanelaFlutuante(tema, tipo);
				}
			},
			/**
			 * Function: salvaMapfile
			 *
			 * Abre a janela de dialogo da ferramenta salvamapfile
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema
			 */
			salvaMapfile : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.salvaMapfile()", "salvamapfile", "salvamapfile");
			},
			/**
			 * Function: graficotema
			 *
			 * Abre a janela de dialogo da ferramenta graficotema
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema
			 */
			graficotema : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.graficotema()",
					"graficotema",
					"graficoTema",
					"dependencias.php",
					"i3GEOF.graficoTema.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: toponimia
			 *
			 * Abre a janela de dialogo da ferramenta toponimia
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema
			 */
			toponimia : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.toponimia()",
					"toponimia",
					"toponimia",
					"dependencias.php",
					"i3GEOF.toponimia.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: filtro
			 *
			 * Abre a janela de dialogo da ferramenta filtro
			 *
			 * Parametros:
			 *
			 * {string} - codigo do tema
			 *
			 * {boolean} - indica o modo de calculadora, que permite retornar o filtro para um ID
			 *
			 * {string} - id do elemento que recebera o filtro
			 */
			filtro : function(idtema,modoCalculadora,idRetorno) {
				i3GEO.mapa.ativaTema(idtema);
				var temp = function(){
					i3GEOF.filtro.iniciaJanelaFlutuante(modoCalculadora,idRetorno);
				};
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.filtro()",
					"filtro",
					"filtro",
					"dependencias.php",
					temp);
			},
			/**
			 * Function: procuraratrib
			 *
			 * Abre a janela de dialogo da ferramenta busca
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema conforme definido no map file
			 */
			procuraratrib : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.procuraratrib()",
					"busca",
					"busca",
					"dependencias.php",
					"i3GEOF.busca.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: tabela
			 *
			 * Abre a janela de dialogo da ferramenta tabela
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema conforme definido no map file
			 */
			tabela : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.tabela()",
					"tabela",
					"tabela",
					"dependencias.php",
					"i3GEOF.tabela.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: etiquetas
			 *
			 * Abre a janela de dialogo da ferramenta etiqueta
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema conforme definido no map file
			 */
			etiquetas : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.etiquetas()",
					"etiqueta",
					"etiqueta",
					"dependencias.php",
					"i3GEOF.etiqueta.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: editaLegenda
			 *
			 * Abre a janela de dialogo da ferramenta legenda
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema conforme definido no map file
			 */
			editaLegenda : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.editaLegenda()",
					"legenda",
					"legenda",
					"dependencias.php",
					"i3GEOF.legenda.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: download
			 *
			 * Abre a janela de dialogo da ferramenta download
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema no map file.
			 */
			download : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.download()", "download", "download");
			},
			/**
			 * Function: sld
			 *
			 * Converte a legenda do tema para o formato SLD (utilizado em requisicoes de Web Services OGC)
			 *
			 * O SLD e mostrado em uma janela sobre o mapa
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema no map file.
			 */
			sld : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.janela.cria("500px", "350px", i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?funcao=tema2sld&tema="
					+ idtema + "&g_sid=" + i3GEO.configura.sid, "", "", "<div class='i3GeoTituloJanela'>SLD<a class=ajuda_usuario target=_blank href='"
					+ i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=41' ><b> </b></a></div>");
			},
			/**
			 * Function: aplicarsld
			 *
			 * Fax o upload de um arquivo SLD (xml) e aplica ao tema
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema no map file.
			 */
			aplicarsld : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.aplicarsld()",
					"aplicarsld",
					"aplicarsld",
					"dependencias.php",
					"i3GEOF.aplicarsld.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: editorsql
			 *
			 * Abre a janela de dialogo da ferramenta editorsql
			 *
			 * Parametros:
			 *
			 * {string} - id que identifica o tema no map file.
			 */
			editorsql : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.editorsql()",
					"editorsql",
					"editorsql",
					"dependencias.php",
					"i3GEOF.editorsql.iniciaJanelaFlutuante()");
			}
		}
	};
// YAHOO.log("carregou classe tema", "Classes i3geo");