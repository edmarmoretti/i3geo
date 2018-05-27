/**
 * Title: Gr&aacute;fico interativo 1
 *
 * Representa&ccedil;&atilde;o gr&aacute;fica de dados. O gr&aacute;fico &eacute; constru&iacute;do tendo como base os atributos de um tema
 * e &eacute; modificado conforme o usu&aacute;rio navega pelo mapa. A renderiza&ccedil;&atilde;o do gr&aacute;fico &eacute; feito pelo
 * navegador por meio do aplicativo openflashchart. Os dados que ser&atilde;o utilizados no gr&aacute;fico s&atilde;o baseados em um
 * elemento TABLE. Esse elemento pode ser montado com base na tabela de atributos e editada pelo usu&aacute;rio. Os dados podem
 * tamb&eacute;m ser inseridos como par&acirc;metros na inicializa&ccedil;&atilde;o da ferramenta, permitindo que o gr&aacute;fico seja
 * utilizado por outras ferramentas.
 *
 * Gr&aacute;ficos podem ser salvos no mapa. Veja a fun&ccedil;&atilde;o compactaConfig que gera uma string em base64 com as
 * configura&ccedil;&otilde;es em JSON de todos os gr&aacute;ficos abertos no mapa
 *
 * Os gr&aacute;ficos podem ser restaurados usando-se a fun&ccedil;&atilde;o restauraGraficos
 *
 * Veja:
 *
 * <i3GEO.analise.dialogo.graficointerativo1>
 *
 * Arquivo:
 *
 * i3geo/ferramentas/graficointerativo1/index.js.php
 *
 * Licenca:
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/**
 * Classe: i3GEOF.graficointerativo1
 *
 */
i3GEOF.graficointerativo1 =
	{
		/**
		 * Controla se o evento de atualizacao da lista de registros esta ativo ou nao
		 * E utilizado quando os graficos sao recuperados de um mapa que foi salvo
		 */
		LISTAREGATIVO: true,
		/**
		 * Array com os ids das janelas ja criadas
		 */
		janelas : [],
		propJanelas : {},
		/**
		 * Template no formato mustache E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function(idjanela) {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.graficointerativo1.dicionario);
			dicionario["idjanela"] = idjanela;
			dicionario["idjanelaA"] = '"'+idjanela+'"';
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			dicionario["prop"] = $trad('p13');
			dicionario["asp"] = '"';
			return dicionario;
		},
		/**
		 * Propriedade: dados
		 *
		 * Dados que serao utilizados. Pode ser passado como parametro.
		 *
		 * Default: {false}
		 */
		dados : false,
		/**
		 * Propriedade: titulo
		 *
		 * T&iacute;tulo do gr&aacute;fico. Se for vazio, ser&aacute; obtido do nome do tema selecionado
		 */
		titulo : "",
		/**
		 * Propriedade: tipo
		 *
		 * Tipo de gr&aacute;fico escolhido pelo usu&aacute;rio.
		 */
		tipo : "",
		/**
		 * Propriedade: acumula
		 *
		 * Acumula os valores ao gerar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		acumula : false,
		/**
		 * Propriedade: relativa
		 *
		 * Utiliza valores relativos ao criar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		relativa : false,
		/**
		 * Propriedade: dadospuros
		 *
		 * N&atilde;o faz nenhum tipo de processamento nos dados antes de gerar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		dadospuros : false,
		w: "460px",
		h: "400px",
		/**
		 * Configura o grafico conforme um objeto contendo parametros e opcionalmente os dados Alguns parametros possuem definicoes padrao,
		 * usadas quando o valor nao e passado
		 *
		 * Qualquer outro campo de formulario pode ter seu valor passado como parametro, desde que use o mesmo ID, excluindo-se do nome do
		 * ID o prefixo (codigo da janela)
		 *
		 * parametros {objeto} com os seguintes elementos:
		 *
		 * idjanela - id do grafico. Usado como prefixo para inserir os identificadores dos elementos DOM que fazem parte da interface do
		 * grafico. Se existir um elemento dom esse id, o grafico sera inserido nesse elemento
		 *
		 * tema - codigo do tema existente no mapa e que sera a fonte para os dados
		 *
		 * atualiza true|false - a janela sera atualizada na navegacao do mapa ou nao
		 *
		 * dados - dados que comporao o mapa. Caso nao existam, serao obtidos de tema
		 *
		 * acumula true|false - acumula os valores de cada elemento do grafico
		 *
		 * relativa true|false - utiliza valores relativos nos eixos
		 *
		 * dadospuros true|false - realiza ou nao processos de adequacao dos dados
		 */
		configura : function(parametros) {
			var idjanela;
			if (!parametros.idjanela) {
				idjanela = "graficoi" + parseInt(Math.random() * 1000000, 10);
			} else {
				idjanela = parametros.idjanela;
			}
			i3GEOF.graficointerativo1.janelas.push(idjanela);
			if (parametros) {
				i3GEOF.graficointerativo1.propJanelas[idjanela] = parametros;
			} else {
				i3GEOF.graficointerativo1.propJanelas[idjanela] = {};
			}
			if (!parametros.tema || parametros.tema == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].tema = "";
			}
			if (!parametros.dadosComboItens || parametros.dadosComboItens == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].dadosComboItens = "";
			}
			if (!parametros.atualiza || parametros.atualiza == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].atualiza = true;
			}
			// guarda para esse grafico alguns valores default obtidos dos
			// parametros gerais da ferramenta
			if (!parametros.acumula || parametros.acumula == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].acumula = i3GEOF.graficointerativo1.acumula;
			}
			if (!parametros.relativa || parametros.relativa == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].relativa = i3GEOF.graficointerativo1.relativa;
			}
			if (!parametros.dadospuros || parametros.dadospuros == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].dadospuros = i3GEOF.graficointerativo1.dadospuros;
			}
			if (!parametros.w || parametros.w == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].w = i3GEOF.graficointerativo1.w;
			}
			if (!parametros.h || parametros.h == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].h = i3GEOF.graficointerativo1.h;
			}
			if (!parametros.tipo || parametros.tipo == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].tipo = i3GEOF.graficointerativo1.tipo;
			}
			//comp guarda a lista de diferentes graficos que formam composicoes
			if (!parametros.comp || parametros.comp == undefined) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].comp = [];
			}
			return idjanela;
		},
		/**
		 * Aplica ao grafico os parametros de configuracao definidos para cada interface que controla o grafico Os parametros de
		 * configuracao sao obtidos na inicializacao, passados como parametros Essa funcao deve ser executada apos os elementos html terem
		 * sido renderizados
		 */
		aplicaConfig : function(idjanela) {
			var config, atualizaConfigGr, f, nomesIds;
			config = i3GEOF.graficointerativo1.propJanelas[idjanela];
			nomesIds = i3GEO.util.listaChaves(config);
			atualizaConfigGr = function() {
				var i, o, n, j;
				n = nomesIds.length;
				for (j = 0; j < n; j++) {
					i = nomesIds[j];
					if(config[i]){
						o = $i(i);
						//if(o && o.style)
						//o.style.color = "red"
						if (o && o.type) {
							if (o.type.toLowerCase() === "radio" || o.type.toLowerCase() === "checkbox") {
								o.checked = config[i];
							} else {
								//alert(idjanela+" - "+config[i])
								o.value = config[i];
							}
						}
					}
				}
			};
			// preenche os campos existentes
			atualizaConfigGr();
			// ativa o tipo de grafico
			if (config.tema) {
				i3GEOF.graficointerativo1.ativaTipo("", idjanela);
				i3GEOF.graficointerativo1.comboTemas(idjanela);
				// cria as entradas de parametros para o eixo y
				// quando o grafico esta sendo restaurado do mapa

				if (config.valoresCombosItens && config.valoresCombosItens.selects.length > 0) {
					n = config.valoresCombosItens.selects.length;
					f = function(){
						var i, c, objs;
						atualizaConfigGr();
						//cria as demais entradas de Y
						for (i = 0; i < n; i++) {
							// cria o combo, para cada combo sao adicionados um input para o nome e um input para a cor
							$i(idjanela + "i3GEOgraficointerativo1ComboYid").onchange.call();
						}
						//
						// restaura os valores dos inputs criados conforme os parametros que haviam sido salvos
						//
						c = $i(idjanela + "i3GEOgraficointerativo1ComboYlinha");
						objs = c.getElementsByTagName("select");

						for (i = 0; i < n; i++) {
							objs[i].value = config.valoresCombosItens.selects[i];
						}
						objs = c.getElementsByTagName("input");
						n = config.valoresCombosItens.inputs.length;
						for (i = 0; i < n; i++) {
							if(objs[i]){
								objs[i].value = config.valoresCombosItens.inputs[i];
							}
						}
						atualizaConfigGr();

						if (i3GEOF.graficointerativo1.propJanelas[idjanela].dados == "") {
							i3GEOF.graficointerativo1.obterDados(idjanela);
						}

					};
					//cria o combo para X e um combo para Y
					i3GEOF.graficointerativo1.comboItensSel(idjanela,f);
				}
				else{
					// atualiza novamente os campos criados
					atualizaConfigGr();
					if (i3GEOF.graficointerativo1.propJanelas[idjanela].dados == "") {
						i3GEOF.graficointerativo1.obterDados(idjanela);
					}
				}
			}
		},
		/**
		 * Obtem os parametros de cada janela e converte em base64. Cada janela e inserida como um item em um objeto A compactacao e
		 * utilizada para salvar as configuracoes no mapfile atual
		 */
		compactaConfig : function() {
			var c, g, par, janelas, i, n, novoid;
			par = [];
			janelas = i3GEOF.graficointerativo1.janelas;
			n = janelas.length;
			for (i = 0; i < n; i++) {
				novoid = window.prompt($trad('idDoGrafico',i3GEOF.graficointerativo1.dicionario),janelas[i]);
				c = i3GEOF.graficointerativo1.retornaConfig(janelas[i],novoid);
				par.push(c);
			}
			g = YAHOO.lang.JSON.stringify(par);
			return i3GEO.util.base64encode(g);
		},
		restauraGraficos : function(par) {
			i3GEOF.graficointerativo1.LISTAREGATIVO = false;
			var n, i;
			par = i3GEO.util.base64decode(par);
			//console.info(par);
			par = JSON.parse(par);
			n = par.length;
			for (i = 0; i < n; i++) {
				i3GEOF.graficointerativo1.iniciaJanelaFlutuante(par[i]);
			}
		},
		/**
		 * Retorna um objeto contendo os valores de todos os parametros utilizados no grafico de tal forma que um grafico possa ser
		 * renderizado novamente
		 *
		 * A funcao que salva o mapa no banco de adm utiliza retornaConfig e cria um objeto que ira armazenar os parametros de cada janela
		 */
		retornaConfig : function(idjanela,novoid) {
			// as chaves do objeto correspondem ao ID de cada elemento
			var tmpid,d, c, par, objs, obj = "", valoresCombosItens = {};
			par = i3GEOF.graficointerativo1.propJanelas[idjanela];
			c = $i(idjanela);
			if(!novoid){
				novoid = idjanela;
			}
			// pega todos os elementos do tipo input
			objs = c.getElementsByTagName("input");
			for (obj in objs) {
				// nao inclui agora os dados e cores
				if (objs[obj].id && objs[obj].id != "" && objs[obj].id.search(idjanela + "i3GEOgraficointerativo1Dados") < 0) {
					tmpid = objs[obj].id.replace(idjanela,novoid);
					if (objs[obj].type === "text") {
						par[tmpid] = objs[obj].value;
					} else {
						par[tmpid] = objs[obj].checked;
					}
				}
			}
			// pega todos os elementos do tipo select
			objs = c.getElementsByTagName("select");
			for (obj in objs) {
				if (objs[obj].id && objs[obj].id != "") {
					tmpid = objs[obj].id.replace(idjanela,novoid);
					par[tmpid] = objs[obj].value;
				}
			}
			// se a janela esta marcada para ser atualizada ao navegar, os dados nao devem ser incluidos
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].atualiza === false) {
				// inclui a tabela com os dados
				d = $i(idjanela + "i3GEOgraficointerativo1Dados");
				objs = d.getElementsByTagName("input");
				for (obj in objs) {
					if (objs[obj].id) {
						tmpid = objs[obj].id.replace(idjanela,novoid);
						par[tmpid] = objs[obj].value;
					}
				}
			} else {
				par.dados = "";
			}
			//combos do eixo y
			valoresCombosItens = {
				"selects" : [],
				"inputs" : []
			};
			d = $i(idjanela + "i3GEOgraficointerativo1ComboYlinha");
			objs = d.getElementsByTagName("select");
			for (obj in objs) {
				if (objs[obj].value && objs[obj].value != "") {
					valoresCombosItens.selects.push(objs[obj].value);
				}
			}
			valoresCombosItens.selects = valoresCombosItens.selects.getUnique();
			objs = d.getElementsByTagName("input");
			for (obj in objs) {
				//if (objs[obj].value && objs[obj].value != "") {
					valoresCombosItens.inputs.push(objs[obj].value);
				//}
			}
			par["valoresCombosItens"] = valoresCombosItens;
			par["idjanela"] = novoid;
			par["w"] = c.style.width;
			par["h"] = c.style.height;
			return par;
		},
		/**
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametros:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 *
		 * dados {JSON} - dados para o gr&aacute;fico (opcional) exemplo
		 * ["n;x","'Argentina';33796870","'Paraguay';4773464","'Brazil';151525400","'Chile';13772710"]
		 */
		inicia : function(iddiv, idjanela) {
			if(i3GEOF.graficointerativo1.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/graficointerativo1/template_mst.html", function(template) {
					i3GEOF.graficointerativo1.MUSTACHE = template;
					i3GEOF.graficointerativo1.inicia(iddiv, idjanela);
				});
				return;
			}
			var b;
			$i(iddiv).innerHTML = i3GEOF.graficointerativo1.html(idjanela);
			$i(idjanela + "i3GEOgraficointerativo1Acumula").checked = i3GEOF.graficointerativo1.propJanelas[idjanela].acumula;
			$i(idjanela + "i3GEOgraficointerativo1Relativa").checked = i3GEOF.graficointerativo1.propJanelas[idjanela].relativa;
			$i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked = i3GEOF.graficointerativo1.propJanelas[idjanela].dadospuros;
			// tipos de graficos
			$i(idjanela + "i3GEOgraficointerativo1guia1").onclick = function() {
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia1", idjanela + "i3GEOgraficointerativo1guia");
				$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			// dados para o grafico
			$i(idjanela + "i3GEOgraficointerativo1guia2").onclick = function() {
				if (i3GEOF.graficointerativo1.tipo == "" && i3GEOF.graficointerativo1.propJanelas[idjanela].tipo && i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
					alert($trad("escolhatipo", i3GEOF.graficointerativo1.dicionario));
					return;
				}
				if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo == undefined || i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
					i3GEOF.graficointerativo1.propJanelas[idjanela].tipo = i3GEOF.graficointerativo1.tipo;
				}
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia2", idjanela + "i3GEOgraficointerativo1guia");
				i3GEOF.graficointerativo1.configuraDados(idjanela);
				$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			// propriedades adicionais
			$i(idjanela + "i3GEOgraficointerativo1guia3").onclick = function() {
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia3", idjanela + "i3GEOgraficointerativo1guia");
				$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			// mostra o grafico
			$i(idjanela + "i3GEOgraficointerativo1guia4").onclick = function() {
				var t;
				if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
					alert($trad("escolhatipo", i3GEOF.graficointerativo1.dicionario));
					return;
				}
				if ($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === "") {
					return;
				}
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia4", idjanela + "i3GEOgraficointerativo1guia");
				t = $i(idjanela + "i3GEOgraficointerativo1Grafico");
				t.style.display = "block";
				t.style.position = "relative";
				t.style.top = "-5px";
				t.visibility = "visible";
				i3GEOF.graficointerativo1.tabela2grafico(idjanela);
			};
			$i(idjanela + "i3GEOgraficointerativo1guia5").onclick =
				function() {
					if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
						alert($trad("escolhatipo", i3GEOF.graficointerativo1.dicionario));
						return;
					}
					if ($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === "") {
						return;
					}
					i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia5", idjanela + "i3GEOgraficointerativo1guia");
					$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
					$i(idjanela + "i3GEOgraficointerativo1guia5obj").innerHTML =
						"<textarea class='form-control input-lg' style='height:calc(100%);width:90%;' cols='52' >" + (i3GEOF.graficointerativo1.tabela2csv(idjanela)).join("\n") + "</textarea>";
				};
			$i(idjanela + "i3GEOgraficointerativo1guia6").onclick =
				function() {
					if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
						alert($trad("escolhatipo", i3GEOF.graficointerativo1.dicionario));
						return;
					}
					if ($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === "") {
						return;
					}
					var w, h, form = $i(idjanela + "i3GEOgraficointerativo1PNG"), isvg = form.getElementsByTagName("input")[0], svg =
						$i(idjanela + "i3GEOgraficointerativo1guia4objCanvas").firstChild;
					h = svg.getAttributeNS(null, 'height');
					w = svg.getAttributeNS(null, 'width');
					if (typeof XMLSerializer != "undefined") {
						svg = (new XMLSerializer()).serializeToString(svg);
					} else {
						svg = svg.html();
					}
					isvg.value = svg;
					form.action = form.action + "?" + "w=" + w + "&h=" + h;
					form.submit();
				};
			$i(idjanela + "i3GEOgraficointerativo1guia7").onclick =
				function() {
					i3GEOF.graficointerativo1.composicao.html(idjanela);
					i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia7", idjanela + "i3GEOgraficointerativo1guia");
				};

			i3GEOF.graficointerativo1.ativaFoco(idjanela);
			i3GEOF.graficointerativo1.comboTemas(idjanela);

			if (i3GEOF.graficointerativo1.propJanelas[idjanela].dados != "") {
				i3GEOF.graficointerativo1.montaTabelaDados(idjanela, i3GEOF.graficointerativo1.propJanelas[idjanela].dados);
				$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
			} else {
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia1", idjanela + "i3GEOgraficointerativo1guia");
			}

			//
			// Apos todos os elementos HTML da ferramenta terem sido renderizados
			// aplicam-se os parametros armazenados nas propriedades da janela atual
			// Isso e necessario pois os parametros podem ter sido enviados na inicializacao da ferramenta,
			// por exemplo, quando um mapa e salvo, os parametros sao armazenados e depois recuperados
			//
			i3GEOF.graficointerativo1.aplicaConfig(idjanela);
		},
		/**
		 * Function: html
		 *
		 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
		 *
		 * Retorno:
		 *
		 * String com o c&oacute;digo html
		 */
		html : function(idjanela) {
			var ins = Mustache.render(i3GEOF.graficointerativo1.MUSTACHE, i3GEOF.graficointerativo1.mustacheHash(idjanela));
			return ins;
		},
		/**
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 *
		 * Parametro:
		 *
		 * parametros {obj} - parametros para o gr&aacute;fico. Contem parametros utilizados para configurar o grafico e tambem pode conter
		 * os dados. Para compatibilidade, se nao contiver o item com chave chamada dados, sera considerado como sendo um objeto com apenas
		 * os dados estatisticos
		 *
		 */
		iniciaJanelaFlutuante : function(parametros) {
			var duplica, minimiza, cabecalho, janela, divid, temp, titulo, idjanela;
			//
			// verifica se parametros contem dados, caso contrario compatibiliza o objeto
			// com a versao 6.0 do i3Geo
			//
			if (!parametros) {
				parametros = {
					"dados" : ""
				};
			} else if (parametros.dados == undefined) {
				parametros = {
					"dados" : parametros
				};
			}
			//
			// configura o grafico baseado no objeto parametros
			// se em parametros existir um idjanela, o mesmo e retornado, caso contrario, e criado
			//
			idjanela = i3GEOF.graficointerativo1.configura(parametros);
			//
			// se existir um elemento HTML com o mesmo ID da janela, a renderizacao ocorrera
			// nesse elemento, caso contrario, sera criada uma janela flutuante
			//
			if (!$i(idjanela) && !$i(idjanela+"_corpo")) {
				// cria a janela flutuante
				cabecalho = function() {
					i3GEOF.graficointerativo1.ativaFoco(idjanela);
				};
				minimiza = function() {
					i3GEO.janela.minimiza(idjanela,200);
				};
				mudaTamanhoGrafico = function() {
					var t = $i(idjanela + "i3GEOgraficointerativo1Grafico");
					if (t.style.display === "block") {
						i3GEOF.graficointerativo1.tabela2grafico(idjanela);
					}
				};
				duplica = function() {
					i3GEOF.graficointerativo1.iniciaJanelaFlutuante();
				};
				titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("t37b") + "</span></div>";
				janela =
					i3GEO.janela.cria(
						i3GEOF.graficointerativo1.propJanelas[idjanela].w,
						i3GEOF.graficointerativo1.propJanelas[idjanela].h,
						"",
						"",
						"",
						titulo,
						idjanela,
						false,
						"hd",
						cabecalho,
						minimiza,
						mudaTamanhoGrafico,
						true,
						"",
						duplica,
						"nao",
						"",
						"84"
					);
				divid = janela[2].id;
				if (i3GEOF.graficointerativo1.janelas.length > 1) {
					temp = janela[0].cfg.config;
					janela[0].moveTo(
						temp.x.value
							+ (i3GEOF.graficointerativo1.janelas.length * 50),
						temp.y.value
							+ (i3GEOF.graficointerativo1.janelas.length * 15));
				}

				temp = function() {
					i3GEOF.graficointerativo1.janelas.remove(idjanela);
					i3GEOF.graficointerativo1.propJanelas[idjanela] = null;
					if (i3GEOF.graficointerativo1.janelas.length === 0 && i3GEO.Interface) {
						if (i3GEO.Interface.ATUAL === "openlayers") {
							i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.graficointerativo1.atualizaListaDeRegistros()"]);
						} else if (i3GEO.Interface.ATUAL === "googlemaps") {
							google.maps.event.removeListener(graficointerativo1Dragend);
							google.maps.event.removeListener(graficointerativo1Zoomend);
						} else if (i3GEO.Interface.ATUAL === "googleearth") {
							google.earth.removeEventListener(graficointerativo1Dragend);
						}
						i3GEOF.graficointerativo1.propJanelas = {};
						i3GEOF.graficointerativo1.janelas = [];
					}
				};
				YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			} else {
				// o grafico sera renderizado em $i(idjanela)
				temp = 'i3GEOF.graficointerativo1.propJanelas["' + idjanela + '"].atualiza = this.checked';
				$i(idjanela+"_corpo").innerHTML = "<img src='../imagens/aguarde2.gif' style='visibility: hidden;' class='i3GeoAguardeJanela' id='"+idjanela+"_imagemCabecalho'>"
						+ "<div style=background-color:#F2F2F2; >"
						+ "<input class='inputsb' checked style='cursor:pointer;position:relative;top:2px;' onclick='"
						+ temp
						+ "' type=checkbox />&nbsp;"
						+ $trad("atualizaNavegacao", i3GEOF.graficointerativo1.dicionario) + " (" + idjanela + ")</div>";

				divid = idjanela+"_corpo";
			}
			if($i(idjanela + "_imagemCabecalho")){
				i3GEOF.graficointerativo1.aguarde = $i(idjanela + "_imagemCabecalho").style;
				i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde = $i(idjanela + "_imagemCabecalho").style;
				i3GEOF.graficointerativo1.propJanelas[idjanela].atualiza = true;
			}
			i3GEOF.graficointerativo1.inicia(divid, idjanela);
			// eventos que ocorrem no mapa e afetam os graficos
			if (i3GEO.Interface) {
				i3GEO.janela.tempoMsg($trad('dadosRegiaoMostrada', i3GEOF.graficointerativo1.dicionario));
				if (i3GEO.Interface.ATUAL === "openlayers"
					&& i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEOF.graficointerativo1.atualizaListaDeRegistros()") < 0) {
					i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.graficointerativo1.atualizaListaDeRegistros()");
				} else if (i3GEO.Interface.ATUAL === "googlemaps" && graficointerativo1Dragend == undefined) {
					graficointerativo1Dragend = GEvent.addListener(i3GeoMap, "dragend", function() {
						i3GEOF.graficointerativo1.atualizaListaDeRegistros();
					});
					graficointerativo1Zoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {
						i3GEOF.graficointerativo1.atualizaListaDeRegistros();
					});
				}
			}
		},
		/**
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function(idjanela) {

		},
		novaJanela : function(idjanela) {
			var janela = "", divid, g, v, cabecalho, id, minimiza, titulo;
			g = $i(idjanela + "i3GEOgraficointerativo1guia4objCanvas");
			v = g.cloneNode(true);
			cabecalho = function() {
			};
			id = YAHOO.util.Dom.generateId();
			minimiza = function() {
				i3GEO.janela.minimiza(id,200);
			};
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + idjanela + "</span></div>";
			janela = i3GEO.janela.cria(
				"450px",
				"auto",
				"",
				"",
				"",
				titulo,
				id,
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true,
				"",
				"",
				"",
				""
			);
			divid = janela[2].id;
			v.id = id + "ngrafico";
			v.className = "container-fluid";
			$i(divid).appendChild(v);
		},
		/**
		 * Function: comboTemas
		 *
		 * Monta o combo para escolha do tema que ser&aacute; utilizado no gr&aacute;fico
		 */
		comboTemas : function(idjanela) {
			if (!i3GEO.Interface || !$i(idjanela + "i3GEOgraficointerativo1ComboTemas")) {
				return;
			}
			i3GEO.util.comboTemas(
					idjanela + "i3GEOgraficointerativo1ComboTemasId",
					function(retorno) {
						$i(idjanela + "i3GEOgraficointerativo1ComboTemas").innerHTML += retorno.dados;

						if ($i(idjanela + "i3GEOgraficointerativo1ComboTemasId")) {
							$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").onchange = function() {
								i3GEOF.graficointerativo1.propJanelas[idjanela].dadosComboItens = "";
								var tema = $i(idjanela + "i3GEOgraficointerativo1ComboTemasId").value;
								i3GEO.mapa.ativaTema(tema);
								i3GEOF.graficointerativo1.propJanelas[idjanela].tema = tema;
								i3GEOF.graficointerativo1.comboItensSel(idjanela);
							};
						}
						var j = i3GEOF.graficointerativo1.propJanelas[idjanela];
						if (j.tema && j.tema !== "") {
							$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").value = j.tema;
							$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").onchange.call();
						}
					},
					idjanela + "i3GEOgraficointerativo1ComboTemas",
					"ligados",
					false,
					"",
					" ",
					false,
					true,
					"form-control comboTema"
				);
		},
		/**
		 * Function: ativaTipo
		 *
		 * Define a vari&aacute;vel com o tipo de gr&aacute;fico e mostra a guia2
		 */
		ativaTipo : function(obj, idjanela) {
			if (obj && obj != "") {
				i3GEOF.graficointerativo1.propJanelas[idjanela].tipo = obj.value;
			}
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo == "ponto_1") {
				$i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked = true;
			} else {
				$i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked = false;
			}
			if (!$i(idjanela + "i3GEOgraficointerativo1tabeladados") || $i(idjanela + "i3GEOgraficointerativo1tabeladados").innerHTML == "") {
				$i(idjanela + "i3GEOgraficointerativo1guia2").onclick.call();
			} else {
				$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
			}
		},
		alteraFatorPixel : function(tipo, idjanela) {
			var delta = 20,
				temp = $i(idjanela + "i3GEOgraficointerativo1FatorTamanho"),
				v = parseInt(temp.value, 10);
			if (temp.value >= 0) {
				if (tipo === "mais") {
					temp.value = v + delta;
				} else {
					temp.value = v - delta;
				}
			}
			if (parseInt(temp.value, 10) < 0) {
				temp.value = 0;
			}
			$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
		},
		alteraFatorPixelMenos : function(idjanela) {
			i3GEOF.graficointerativo1.alteraFatorPixel("menos", idjanela);
		},
		alteraFatorPixelMais : function(idjanela) {
			i3GEOF.graficointerativo1.alteraFatorPixel("mais", idjanela);
		},
		/**
		 * Function: configuraDados
		 *
		 * Configura o formul&aacute;rio para obten&ccedil;&atilde;o dos dados para cada tipo de gr&aacute;fico
		 */
		configuraDados : function(idjanela) {
			var ativa = function(comboxlinha, comboylinha, ajudapizza) {
				$i(idjanela + "i3GEOgraficointerativo1ComboXlinha").style.display = comboxlinha;
				$i(idjanela + "i3GEOgraficointerativo1ComboYlinha").style.display = comboylinha;
				$i(idjanela + "i3GEOgraficointerativo1AjudaPizza").style.display = ajudapizza;
			};
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
				i3GEO.janela.tempoMsg($trad('selecionaTipoGrafico', i3GEOF.graficointerativo1.dicionario));
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia1", idjanela + "i3GEOgraficointerativo1guia");
				return;
			}
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "pizza2d") {
				ativa("block", "block", "block");
			}
		},
		/**
		 * Function: comboItensSel
		 *
		 * Cria um combo para selecionar os itens do tema escolhido
		 *
		 * Veja:
		 *
		 * <i3GEO.util.comboItens>
		 */
		comboItensSel : function(idjanela,funcaoFinaliza) {
			var geraCombo = function() {
			}, tema = $i(idjanela + "i3GEOgraficointerativo1ComboTemasId").value;

			geraCombo =
				function(retorno) {
					if (retorno.tipo === "erro") {
						$i(idjanela + "i3GEOgraficointerativo1ComboX").innerHTML =
							"<h5 class='alert alert-error'>" + $trad('erroTemaOrigem', i3GEOF.graficointerativo1.dicionario) + "</h5>";
						$i(idjanela + "i3GEOgraficointerativo1ComboY").innerHTML =
							"<h5 class='alert alert-error'>" + $trad('erroTemaOrigem', i3GEOF.graficointerativo1.dicionario) + "</h5>";
					} else {
						// guarda o valor para reuso
						i3GEOF.graficointerativo1.propJanelas[idjanela].dadosComboItens = retorno;
						//para escolher o item de Y
						var temp = retorno.dados.replace(idjanela + "i3GEOgraficointerativo1ComboXid",idjanela + "i3GEOgraficointerativo1ComboYid");

						$i(idjanela + "i3GEOgraficointerativo1ComboY").innerHTML = "<div>"
							+ temp
							+ "<div style='width:80%' class='form-group label-fixed condensed'>"
							+ "	<input class='form-control input-lg' placeholder='" + $trad('digitaTituloLegenda', i3GEOF.graficointerativo1.dicionario) + "'  type=text id='" + idjanela + "i3GEOgraficointerativo1ComboYidTitulo' value='' />"
							+ "</div>"
							+ "<div style='width:80%' class='form-group label-fixed condensed' >"
							+ "	<input class='form-control input-lg i3geoFormIconeAquarela' id='" + idjanela + "i3GEOgraficointerativo1ComboYidcor' title='cor' type='text' value='0,0,0' />"
							+ "</div>"
							+ "</div>";


						i3GEO.util.aplicaAquarela(idjanela + "i3GEOgraficointerativo1ComboY");

						//para escolher o item de X
						$i(idjanela + "i3GEOgraficointerativo1ComboX").innerHTML = ""
							+ "<div>"
							+ retorno.dados
							+ "<div style='width:80%' class='form-group label-fixed condensed'>"
							+ "<input class='form-control input-lg' placeholder='" + $trad('digitaTituloLegenda', i3GEOF.graficointerativo1.dicionario) + "' type=text id='" + idjanela + "i3GEOgraficointerativo1ComboXidTitulo' value='' />"
							+ "</div></div>";

						if ($i(idjanela + "i3GEOgraficointerativo1ComboYid")) {
							adicionaFilho =
								function() {
									var no = document.createElement("div"), id = "CorG" + parseInt(Math.random() * 100000, 10), novoselect;
									no.innerHTML = ""
										+ retorno.dados
										+ "<div style='width:80%' class='form-group label-fixed condensed'>"
										+ "<input class='form-control input-lg' placeholder='" + $trad('digitaTituloLegenda', i3GEOF.graficointerativo1.dicionario) + "' type=text value='' />"
										+ "</div>"
										+ "<div style='width:80%' class='form-control input-lg i3geoFormIconeAquarela' >"
										+ "<input class='form-control input-lg i3geoFormIconeAquarela' value='50,50,50' id='" + id + "' type=text value='' title='cor' />"
										+ "</div><hr>";
									novoselect = no.getElementsByTagName("select")[0];
									novoselect.id = "";
									novoselect.onchange = adicionaFilho;
									//$i(idjanela + "i3GEOgraficointerativo1ComboY").appendChild(document.createElement("br"));
									$i(idjanela + "i3GEOgraficointerativo1ComboY").appendChild(no);
									i3GEO.util.aplicaAquarela(no.id);
								};
							$i(idjanela + "i3GEOgraficointerativo1ComboYid").onchange = adicionaFilho;
						}
					}
					//executa uma funcao que foi enviada como parametros. Usado ao restaurar um grafico
					if(funcaoFinaliza){
						funcaoFinaliza.call();
					}
				};
			//o primeiro combo gerado contem o id Xid
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].dadosComboItens == "") {
				i3GEO.util.comboItens(
					idjanela + "i3GEOgraficointerativo1ComboXid",
					tema,
					geraCombo,
					idjanela + "i3GEOgraficointerativo1ComboX",
					"",
					"",
					"",
					"form-control"
				);
			} else {
				geraCombo(i3GEOF.graficointerativo1.propJanelas[idjanela].dadosComboItens);
			}
		},
		/**
		 * Atualiza as janelas obtendo os dados conforme a navegacao ocorre
		 */
		atualizaListaDeRegistros : function() {
			if(i3GEOF.graficointerativo1.LISTAREGATIVO === true){
				var i, janelas = i3GEOF.graficointerativo1.janelas, propJanelas = i3GEOF.graficointerativo1.propJanelas, n = janelas.length;
				for (i = 0; i < n; i++) {
					if (propJanelas[janelas[i]].atualiza === true) {
						i3GEOF.graficointerativo1.obterDados(janelas[i]);
						i3GEOF.graficointerativo1.propJanelas[janelas[i]].aguarde.visibility = "hidden";
					}
				}
			}
		},
		/**
		 * Function: obterDados
		 *
		 * Obt&eacute;m os dados que ser&atilde;o utilizados no gr&aacute;fico
		 *
		 * Veja:
		 *
		 * <GRAFICOSELECAO>
		 */
		contadorDados: 0,
		janelasEsperando: [],
		obterDados : function(idjanela) {
			if (!i3GEO.Interface) {
				return;
			}
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			var tema, excluir, cp, tipo, ordenax, monta, p, x, y, i, n, temp;

			tema = $i(idjanela + "i3GEOgraficointerativo1ComboTemasId");
			if (!tema) {
				return;
			} else {
				tema = tema.value;
			}
			i3GEOF.graficointerativo1.contadorDados++;
			excluir = $i(idjanela + "i3GEOgraficointerativo1excluir").value;
			cp = new cpaint();
			tipo = $i(idjanela + "i3GEOgraficointerativo1TipoAgregacao").value;
			ordenax = "sim";

			// pega os itens
			temp = $i(idjanela + "i3GEOgraficointerativo1ComboX");
			x = temp.getElementsByTagName("select");
			if (x.length > 0) {
				x = x[0].value;
			} else {
				x = "";
			}
			temp = $i(idjanela + "i3GEOgraficointerativo1ComboY");
			temp = temp.getElementsByTagName("select");
			n = temp.length;
			if (n === 1) {
				y = temp[0].value;
			} else {
				y = [];
				for (i = 0; i < n; i++) {
					if (temp[i].value != "") {
						y.push(temp[i].value);
					}
				}
				y = y.join(",");
			}
			p =
				i3GEO.configura.locaplic + "/ferramentas/graficointerativo1/exec.php?g_sid=" + i3GEO.configura.sid
					+ "&funcao=graficoSelecao&tema=" + tema + "&itemclasses=" + x + "&itemvalores=" + y + "&exclui=" + excluir + "&ext="
					+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);

			if ($i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked) {
				tipo = "nenhum";
			} else {
				if (x === y) {
					tipo = "conta";
				}
			}
			if (!$i(idjanela + "i3GEOgraficointerativo1OrdenaX").checked) {
				ordenax = "nao";
			}

			if (tema === "") {
				//pode ser que os dados tenham vindo de outra fonte
				if($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === ""){
					i3GEO.janela.tempoMsg($trad('selecionaTema', i3GEOF.graficointerativo1.dicionario));
				}
				return;
			}
			if (x === "") {
				i3GEO.janela.tempoMsg($trad('selecionaItemX', i3GEOF.graficointerativo1.dicionario));
				return;
			}
			if (y === "") {
				i3GEO.janela.tempoMsg($trad('selecionaItemY', i3GEOF.graficointerativo1.dicionario));
				return;
			}
			monta = function(retorno) {
				//o contador e utilizado para disparar processos apenas quando todas as operacoes tiverem terminado
				i3GEOF.graficointerativo1.contadorDados--;
				i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
				i3GEOF.graficointerativo1.montaTabelaDados(idjanela, retorno);

				/*
				i3GEOF.graficointerativo1.janelasEsperando.push(idjanela);
				if(i3GEOF.graficointerativo1.contadorDados === 0){
					var n = i3GEOF.graficointerativo1.janelasEsperando.length,
						i;
					for(i=0;i<n;i++){
						$i(i3GEOF.graficointerativo1.janelasEsperando[i] + "i3GEOgraficointerativo1guia4").onclick.call();
					}
					i3GEOF.graficointerativo1.janelasEsperando = [];
					i3GEOF.graficointerativo1.LISTAREGATIVO = true;
				}
				*/
			};
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "visible";
			cp.set_response_type("JSON");
			cp.call(p + "&tipo=" + tipo + "&ordenax=" + ordenax, "graficoSelecao", monta);
		},
		/**
		 * Pega os nomes das colunas
		 */
		nomesColunas : function(idjanela) {
			// pega os nomes das clunas
			var i, n, p, temp = $i(idjanela + "i3GEOgraficointerativo1ComboX"), colunas, cores, alias;
			if (temp.getElementsByTagName("select")[0]) {
				cores = [];
				colunas = [
					temp.getElementsByTagName("select")[0].value
				];
				alias = [
					temp.getElementsByTagName("input")[0].value
				];
			} else {
				// caso os dados tenham sido definidos como parametros
				colunas = [
					"-",
					"-"
				];
				alias = colunas;
				cores = [
					"#29C152",
					"#29C152"
				];
			}
			temp = $i(idjanela + "i3GEOgraficointerativo1ComboY");
			temp = temp.getElementsByTagName("select");
			n = temp.length;
			for (i = 0; i < n; i++) {
				if (temp[i].value != "") {
					colunas.push(temp[i].value);
					// pega o alias
					p = temp[i].parentNode.getElementsByTagName("input");
					if (p[0].value != "") {
						alias.push(p[0].value);
					} else {
						alias.push(temp[i].value);
					}
					if (p[1].value != "") {
						cores.push(p[1].value);
					} else {
						cores.push("#29C152");
					}
				}
			}
			return [
				colunas,
				alias,
				cores
			];
		},
		/**
		 * Function: montaTabelaDados
		 *
		 * Monta a tabela com os dados que ser&atilde;o utilizados no gr&aacute;fico
		 *
		 * Parametro:
		 *
		 * retorno {JSON} - dados no formato JSON
		 */
		montaTabelaDados : function(idjanela, retorno) {
			var colunas = [], ncolunas, dados, n, v, ins = [], i, j, id, cor = "#F9C806";
			if (!retorno.dados && retorno.data != undefined) {
				dados = retorno.data.dados;
			} else {
				dados = retorno;
			}
			ins.push("<h4>" + $trad('tabelaGrafico', i3GEOF.graficointerativo1.dicionario) + "</h4>");
			ins.push("<table id='" + idjanela + "i3GEOgraficointerativo1tabeladados' ><tr><td></td>");
			// pega os nomes das colunas
			colunas = i3GEOF.graficointerativo1.nomesColunas(idjanela)[0];
			ncolunas = colunas.length;
			for (i = 0; i < ncolunas; i++) {
				ins.push("<td><button onclick='i3GEOF.graficointerativo1.ordenaColuna(\""+idjanela+"\","+i+")' class='btn btn-xs' style='margin: 2px; padding: 2px;'><span class='material-icons'>sort</span></button>&nbsp;" + colunas[i] + "</td>");
			}
			ins.push("<td>" + $trad('cor', i3GEOF.graficointerativo1.dicionario) + "</td><td></td></tr>");
			n = dados.length;
			for (i = 1; i < n; i++) {
				v = dados[i].split(";");
				// ins += v[0]+" "+v[1];
				id = idjanela + "i3GEOgraficointerativo1Dados" + i; // layer+indice da classe
				ins.push("<tr>");
				ins.push("<td><button onclick='i3GEOF.graficointerativo1.excluilinha(this)' class='btn btn-xs' style='margin:2px;padding:2px;'><span class='material-icons'>remove_circle_outline</span></button></td>");
				for (j = 0; j < ncolunas; j++) {
					v[j] = v[j].replace("'", "");
					v[j] = v[j].replace("'", "");
					ins.push("<td>");
					ins.push("<div class='form-group label-fixed condensed' ><input class='form-control input-lg' type='text' id='"+id + colunas[j]+"' value='"+v[j]+"' name='"+colunas[j]+"'/></div>");
					ins.push("</td>");
				}

				ins.push("<td>");
				if ($i(idjanela + "i3GEOgraficointerativo1CoresA").checked) {
					cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
				}
				// verifica se no objeto com os dados existe um terceiro
				// valor com
				// as cores
				if (v[ncolunas + 1]) {
					cor = i3GEO.util.rgb2hex(v[ncolunas + 1]);
				}
				ins.push("<div class='form-group label-fixed condensed' ><input class='form-control input-lg i3geoFormIconeAquarela' type='text' id='"+ id +"_cor' value='"+cor+"' name=''/></div>");
				ins.push("</td><td>");
				ins.push("</td></tr>");
			}
			ins.push("</table><br>");
			$i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML = ins.join("");
			$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
		},
		/**
		 * Function: tabela2csv
		 *
		 * Obt&eacute;m os dados da tabela em CSV
		 */
		tabela2csv : function(idjanela) {
			var colunas = i3GEOF.graficointerativo1.nomesColunas(idjanela), ncolunas = colunas[0].length, inputs =
				$i(idjanela + "i3GEOgraficointerativo1Dados").getElementsByTagName("input"), ninputs = inputs.length, i, j, temp, csv = [];

			csv.push(colunas[0].join(";"));
			for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
				temp = [];
				for (j = 0; j < ncolunas; j++) {
					temp.push(inputs[i + j].value);
				}
				csv.push(temp.join(";"));
			}
			return csv;
		},
		tabela2grafico: function(idjanela){
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "visible";

			var legendaX = "",
				legendaY = "",
				dados =	{},
				xInclinado = false;

			dados = i3GEOF.graficointerativo1.tabela2dados(idjanela);

			xInclinado = $i(idjanela + "i3GEOgraficointerativo1xInclinado").checked;
			/*
			if ($i(idjanela + "i3GEOgraficointerativo1ComboTemasId")) {
				titulo =
					$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").options[$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").options.selectedIndex].text;
			}
			if (i3GEOF.graficointerativo1.titulo != "") {
				titulo = i3GEOF.graficointerativo1.titulo;
			}
			*/
			if ($i(idjanela + "i3GEOgraficointerativo1ComboXid")) {
				legendaX = $i(idjanela + "i3GEOgraficointerativo1ComboXidTitulo").value;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1ComboYid")) {
				legendaY = $i(idjanela + "i3GEOgraficointerativo1ComboYidTitulo").value;
			}

			if (legendaX == legendaY && (legendaX != "" && legendaY != "")) {
				legendaX += " (" + $trad('casos', i3GEOF.graficointerativo1.dicionario) + ")";
				legendaY += " (" + $trad('numeroCasos', i3GEOF.graficointerativo1.dicionario) + ")";
			}

			switch (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo) {
			case "bar_1":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado, "vertical");
				break;
			case "bar_2":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado, "horizontal");
				break;
			case "linha_1":
				legendaX = "";
				i3GEOF.graficointerativo1.linhas(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado);
				break;
			case "pizza_1":
				legendaX = "";
				i3GEOF.graficointerativo1.pizzas(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX);
				break;
			case "ponto_1":
				i3GEOF.graficointerativo1.pontos(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX);
				break;
			case "area_1":
				legendaX = "";
				i3GEOF.graficointerativo1.areas(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado);
				break;
			case "arvore_1":
				i3GEOF.graficointerativo1.arvores(idjanela, dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX);
				break;
			default:
				// alert($trad("escolhatipo", i3GEOF.graficointerativo1.dicionario));
			}
		},
		/**
		 * Function: tabela2dados
		 *
		 * Obt&eacute;m os dados da tabela para compor o gr&aacute;fico
		 */
		tabela2dados : function(idjanela) {
			var colunas = i3GEOF.graficointerativo1.nomesColunas(idjanela),
			ncolunas = colunas[0].length,
			temp = 0,
			ultimo = 0,
			inputs = $i(idjanela + "i3GEOgraficointerativo1Dados").getElementsByTagName("input"),
			ninputs = inputs.length,
			tipoColuna = "String",
			metadados =	[],
			i,
			j,
			acumulado = [],
			acum,
			cores = [],
			par = [],
			total = 0,
			menor = 0,
			maior = 0,
			dados =	{};
			if (ninputs > 0) {
				menor = inputs[1].value * 1;
			}
			if (ncolunas === 2) {
				for (i = 0; i < ninputs; i = i + 3) {
					temp = inputs[i + 1].value * 1;
					total += temp;
					cores.push(inputs[i + 2].value);
				}
				for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
					temp = inputs[i + 1].value * 1;
					acum = ultimo + temp;
					acumulado.push(acum);
					ultimo = ultimo + temp;
					if (temp > maior) {
						maior = temp;
					}
					if (temp < menor) {
						menor = temp;
					}
					temp = inputs[i + 1].value * 1;
					if ($i(idjanela + "i3GEOgraficointerativo1Acumula").checked) {
						temp = acum;
					}
					if ($i(idjanela + "i3GEOgraficointerativo1Relativa").checked) {
						temp = (temp * 100) / total;
					}
					par.push([
						inputs[i].value + "",
						temp
					]);
				}
				if ($i(idjanela + "i3GEOgraficointerativo1Acumula").checked) {
					maior = 0;
				}
			} else {
				total = 0;
				for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
					temp = [];
					for (j = 0; j < ncolunas; j++) {
						temp.push(inputs[i + j].value);
					}
					par.push(temp);
				}
				cores = colunas[2];
			}

			for (j = 0; j < ncolunas; j++) {
				metadados.push({
					"colIndex" : j,
					"colType" : tipoColuna,
					"colName" : colunas[1][j]
				});
				tipoColuna = "Numeric";
			}
			dados = {
				"resultset" : par,
				"metadata" : metadados
			};
			return {
				"dados": dados,
				"cores": cores,
				"menor": menor,
				"maior": maior
			};
		},
		/**
		 * Function: excluilinha
		 *
		 * Exclui uma linha da tabela de dados
		 */
		excluilinha : function(celula) {
			var p = celula.parentNode.parentNode;
			do {
				p.removeChild(p.childNodes[0]);
			} while (p.childNodes.length > 0);
			p.parentNode.removeChild(p);
		},
		/**
		 * Function: corj
		 *
		 * Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
		 */
		corj : function(obj) {
			i3GEO.util.abreCor("", obj, "hex");
		},
		/**
		 * Function: ordenaColuna
		 *
		 * Ordena uma coluna da tabela
		 */
		ordenaColuna : function(idjanela, cid) {
			var tabela = $i(idjanela + "i3GEOgraficointerativo1Dados").getElementsByTagName("table")[0], trs, ntrs = 0, psort = [], t = 0, ins =
				"", p = 0, e, temp, chaves = [], numero = false;

			trs = tabela.getElementsByTagName("tr");
			ntrs = trs.length;

			function sortNumber(a, b) {
				return a.split("@$")[0]*1 - b.split("@$")[0]*1;;
			}
			for (t = 1; t < ntrs; t++) {
				temp = trs[t].getElementsByTagName("input");
				if (temp) {
					psort.push(temp[cid].value + "@$" + t);
					if (temp[cid].value * 1) {
						numero = true;
					}
				}
			}
			// recosntroi a tabela
			if (numero === true) {
				psort = psort.sort(sortNumber);
			} else {
				psort = psort.sort();
			}
			ins = "<tr>" + trs[0].innerHTML + "</tr>";
			ntrs = psort.length;
			for (p = 0; p < ntrs; p++) {
				e = psort[p].split("@$")[1]*1;
				if (trs[e] !== undefined) {
					ins += "<tr>" + trs[e].innerHTML + "</tr>";
				}
			}
			tabela.innerHTML = ins;
		},
		configDefault : function(idjanela, dados, maior, cores, legendaY, legendaX) {
			if($i(idjanela)){
				$i(idjanela).style.visibility = "hidden";
			}
			var temp, config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				height : parseInt($i(idjanela + "_corpo").style.height, 10) - 120,
				orthoAxisTitle : legendaY,
				valuesFont : 'normal 9px sans-serif ',
				baseAxisTitle : legendaX,
				baseAxisTitleAlign : 'center',
				tooltipEnabled : true,
				tooltipArrowVisible : true,
				tooltipFade : false,
				tooltipFollowMouse : false,
				tooltipFormat : function(scene) {
					var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
					return "<span style=color:yellow >" + cat + "</span><br>" + $.number(val,3,$trad("dec"),$trad("mil"));
				},
				clickAction : function(scene) {

					var funcao1 = function(){
						var filtro,coluna = $i(idjanela + "i3GEOgraficointerativo1ComboXid").value,
							val = scene.atoms.category.value;
						if (val*1){
							filtro = "(["+coluna+"] = "+val+")";
						}
						else{
							filtro = "(|["+coluna+"]| = |"+i3GEO.util.trim(val)+"|)";
						}
						i3GEOF.graficointerativo1.filtraCamada(idjanela,filtro);
					};
					var funcao2 = function(){
						var filtro,coluna = scene.datum.atoms['series'].value,
							val = scene.datum.atoms['value'].value;
						if (val*1){
							filtro = "(["+coluna+"] < "+val+")";
						}
						else{
							filtro = "(|["+coluna+"]| < |"+i3GEO.util.trim(val)+"|)";
						}
						i3GEOF.graficointerativo1.filtraCamada(idjanela,filtro);
					};
					i3GEO.janela.confirma("Filtra a camada?",350,"Com base em X","Menor que Y",funcao1,funcao2);

				},
				baseAxisTitleFont : '9px sans-serif',
				yAxisTickFormatter : function(valor) {
					valor = valor + "";
					return $.number(valor,3,$trad("dec"),$trad("mil"));
				},
				valueFormat : function(valor) {
					valor = valor + "";
					return $.number(valor,3,$trad("dec"),$trad("mil"));
				},
				valuesAnchor : 'top',
				valuesVisible : false,
				orthoAxisOriginIsZero : false,
				titleAlign : 'center',
				titleFont : 'bold 14px sans-serif',
				baseAxisTitleFont : '12px sans-serif',
				orthoAxisTitleFont : '12px sans-serif',
				titlePosition : "top",
				orientation : 'vertical',
				baseAxisTicks : true,
				stacked : false,
				animate : true,
				hoverable : false,
				axisGrid : true,
				contentMargins : 5,
				axisOffset : 0.02,
				panelSizeRatio : 0.8,
				orthoAxisLabelSpacingMin : 2,
				selectable : false,
				clickable : true,
				extensionPoints : {
					continuousAxisTicks_strokeStyle : 'gray',
					axisGrid_strokeStyle : 'white',
					xAxisLabel_textStyle : 'black',
					yAxisLabel_textStyle : 'black',
					label_textBaseline : "bottom",
					xAxisLabel_font : 'normal 10px sans-serif'
				}
			};
			if (maior > 0) {
				config.orthoAxisFixedMax = maior;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1Titulo").value != "") {
				config.title = $i(idjanela + "i3GEOgraficointerativo1Titulo").value;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1TituloX").value != "") {
				config.baseAxisTitle = $i(idjanela + "i3GEOgraficointerativo1TituloX").value;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1TituloY").value != "") {
				config.orthoAxisTitle = $i(idjanela + "i3GEOgraficointerativo1TituloY").value;
			}
			temp = $i(idjanela + "i3GEOgraficointerativo1FatorTamanho");
			if (temp && temp.value > 0 && dados.resultset) {
				config.width = dados.resultset.length * temp.value;
			} else {
				config.width = parseInt($i(idjanela).style.width, 10) - 20;
			}
			return config;
		},
		barras : function(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = true, sr = false, config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			if (tipo === "horizontal") {
				config.orientation = 'horizontal';
			}
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.colors = cores;
			//
			//pega os parametros de graficos que fazem composicao com este
			//
			dados = i3GEOF.graficointerativo1.composicao.incluiDados(idjanela,dados);
			config = i3GEOF.graficointerativo1.composicao.incluiConfig(idjanela,config);

			if (dados.resultset && dados.resultset[0] && dados.resultset[0].length > 2) {
				config.stacked = $i(idjanela + "i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i(idjanela + "i3GEOFgraficointerativo1ativaRowsInColumns").checked;
			}
			else if (cores != "") {
				config.extensionPoints.bar_fillStyle = function(d) {
					return config.colors[this.index];
				};
			}
			new pvc.BarChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows : sr
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
			if($i(idjanela)){
				$i(idjanela).style.visibility = "visible";
			}
		},
		linhas : function(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = false, sr = false, config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;
			//
			//pega os parametros de graficos que fazem composicao com este
			//
			dados = i3GEOF.graficointerativo1.composicao.incluiDados(idjanela,dados);
			config = i3GEOF.graficointerativo1.composicao.incluiConfig(idjanela,config);

			if (dados.resultset && dados.resultset[0] && dados.resultset[0].length > 2) {
				config.stacked = $i(idjanela + "i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i(idjanela + "i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}
			new pvc.LineChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows : sr
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
			if($i(idjanela)){
				$i(idjanela).style.visibility = "visible";
			}
		},
		areas : function(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = false, sr = false, config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;
			config.areasVisible = true;
			//
			//pega os parametros de graficos que fazem composicao com este
			//
			dados = i3GEOF.graficointerativo1.composicao.incluiDados(idjanela,dados);
			config = i3GEOF.graficointerativo1.composicao.incluiConfig(idjanela,config);

			if (dados.resultset && dados.resultset[0] && dados.resultset[0].length > 2) {
				config.stacked = $i(idjanela + "i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i(idjanela + "i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}

			new pvc.LineChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows : sr
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
			if($i(idjanela)){
				$i(idjanela).style.visibility = "visible";
			}
		},
		arvores : function(idjanela, dados, maior, cores, legendaY, legendaX, tipo) {

			config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				title : legendaY,
				titleFont : 'italic 14px sans-serif',
				selectable : true,
				hoverable : true,
				legend : false,
				tooltipEnabled : true,
				legendPosition : 'right',
				rootCategoryLabel : legendaX,
				tooltipFormat : function(scene) {
					var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms.size.value;
					return "<span style=color:yellow >" + cat + "</span><br>" + $.number(val,3,$trad("dec"),$trad("mil"));
				}
			};
			//
			//pega os parametros de graficos que fazem composicao com este
			//
			dados = i3GEOF.graficointerativo1.composicao.incluiDados(idjanela,dados);
			config = i3GEOF.graficointerativo1.composicao.incluiConfig(idjanela,config);

			if (cores != "") {
				config.colors = cores;
			}

			new pvc.TreemapChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
			if($i(idjanela)){
				$i(idjanela).style.visibility = "visible";
			}
		},
		pizzas : function(idjanela, dados, maior, cores, legendaY, legendaX, tipo) {
			config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			var config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				animate : true,
				selectable : true,
				hoverable : true,
				valuesVisible : true,
				valuesLabelStyle : 'inside',
				valuesMask : "{category}",
				tooltipFormat : function(scene) {
					var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
					return "<span style=color:yellow >" + cat + "</span><br>" + $.number(val,3,$trad("dec"),$trad("mil"));
				},
				extensionPoints : {
					slice_strokeStyle : 'white'
				}
			};
			//
			//pega os parametros de graficos que fazem composicao com este
			//
			dados = i3GEOF.graficointerativo1.composicao.incluiDados(idjanela,dados);
			config = i3GEOF.graficointerativo1.composicao.incluiConfig(idjanela,config);

			if (cores != "") {
				config.colors = cores;
			}

			new pvc.PieChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
			if($i(idjanela)){
				$i(idjanela).style.visibility = "visible";
			}
		},
		pontos : function(idjanela, dados, maior, cores, legendaY, legendaX, tipo) {
			config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			var config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				animate : true,
				selectable : true,
				hoverable : true,
				valuesVisible : false,
				orthoAxisTitle : legendaY,
				valuesFont : 'normal 9px sans-serif ',
				baseAxisTitle : legendaX,
				yAxisTickFormatter : function(valor) {
					valor = valor + "";
					return $.number(valor,3,$trad("dec"),$trad("mil"));
				},
				valueFormat : function(valor) {
					valor = valor + "";
					return $.number(valor,3,$trad("dec"),$trad("mil"));
				},
				tooltipFormat : function(scene) {
					var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
					return "<span style=color:yellow >X: " + cat + "</span><br>Y: " + $.number(val,3,$trad("dec"),$trad("mil"));
				}
			};
			//
			//pega os parametros de graficos que fazem composicao com este
			//
			dados = i3GEOF.graficointerativo1.composicao.incluiDados(idjanela,dados);
			config = i3GEOF.graficointerativo1.composicao.incluiConfig(idjanela,config);

			if (cores != "") {
				config.colors = cores;
			}

			new pvc.DotChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
			if($i(idjanela)){
				$i(idjanela).style.visibility = "visible";
			}
		},
		/**
		 * Gerencia a sobreposicao de graficos em um unico
		 * i3GEOF.graficointerativo1.propJanelas[idjanela].comp
		 */
		composicao: {
			/**
			 * Parametros do grafico sobreposto
			 * E armazenado quando a janela sobreposta e fechada
			 * Utilizado para recalcular o grafico quando a janela sobreposta for fechada
			 */
			parametros: {},
			/**
			 * Remove uma sobreposicao e atualiza o grafico
			 * "s" e o codigo da janela do grafico sobreposto
			 */
			remove: function(idjanela,s){
				var c = i3GEOF.graficointerativo1.propJanelas[idjanela].comp;
				c.remove(s);
				i3GEOF.graficointerativo1.composicao.listaComp(idjanela);
			},
			/**
			 * Adiciona ao grafico uma nova sobreposicao
			 */
			adiciona: function(idjanela,s){
				if(s === ""){
					return;
				}
				var c = i3GEOF.graficointerativo1.propJanelas[idjanela].comp;
				c.remove(s);
				c.push(s);
				i3GEOF.graficointerativo1.composicao.listaComp(idjanela);
			},
			/**
			 * HTML com o formulario para adicionar sobreposicoes
			 */
			html: function(idjanela){
				i3GEOF.graficointerativo1.composicao.combojanelas(idjanela);
				i3GEOF.graficointerativo1.composicao.listaComp(idjanela);
			},
			/**
			 * Verifica todas as sobreposicoes e as aplica ao grafico
			 * A aplicacao e feita sobre o objeto de dados antes de ser renderizado
			 * Verifica se a janela com o grafico esta aberta ou se devem ser usados os parametros
			 * guardados
			 */
			incluiDados: function(idjanela,dados){
				try{
					var c = i3GEOF.graficointerativo1.propJanelas[idjanela].comp,
						n = c.length,
						i,
						nmeta,
						dadosNovos,
						metaNovos,
						rsNovos,
						rs,
						a = {},
						b = {},
						e = [],
						d = "",
						j,
						nj;
					if(n > 0){
						for(i=0;i<n;i++){
							//inclui os metadados do grafico que sera sobreposto nos metadados do grafico original
							dadosNovos = i3GEOF.graficointerativo1.tabela2dados(c[i]);
							metaNovos = dadosNovos.dados.metadata;
							nmeta = dados.metadata.length;
							nj = metaNovos.length;
							for(j = 0;j<nj;j++){
								if(metaNovos[j].colName != ""){
									nmeta++;
									dados.metadata.push({
										"colIndex" : nmeta,
										"colType" : metaNovos[j].colType,
										"colName" : metaNovos[j].colName + " (" + c[i] + ")"
									});
								}
							}
							//adiciona os dados
							rs = dados.resultset;
							nj = rs.length;
							//hash contendo os valores originais
							for(j=0;j<nj;j++){
								a[rs[j][0]] =rs[j];
							}
							rsNovos = dadosNovos.dados.resultset;
							nj = rsNovos.length;
							//hash contendo os valores novos
							for(j=0;j<nj;j++){
								b[rsNovos[j][0]] = rsNovos[j];
							}
							//busca nos valores novos os dados com base na chave do hash original
							for(d in a){
								if(b[d]){
									a[d].push(b[d][1]);
									e.push(a[d]);
								}
								else{
									a[d].push(0);
									e.push(a[d]);
								}
							}
							dados.resultset = e;
						}
					}
					return dados;
				}
				catch(e){
					return dados;
				}
			},
			/**
			 * Verifica todas as sobreposicoes e as aplica ao grafico
			 * A aplicacao e feita sobre o objeto de configuracao antes de ser renderizado
			 * Verifica se a janela com o grafico esta aberta ou se devem ser usados os parametros
			 * guardados
			 */
			incluiConfig: function(idjanela,config){
				try{
					var c = i3GEOF.graficointerativo1.propJanelas[idjanela].comp,
						n = c.length,
						i,
						nj,
						j,
						ncores = [];
					if(n > 0){
						for(i=0;i<n;i++){
							//pega as cores
							dadosNovos = i3GEOF.graficointerativo1.tabela2dados(c[i]);
							coresNovos = dadosNovos.cores;
							nj = coresNovos.length;
							for(j=0;j<nj;j++){
								ncores.push(coresNovos[j]);
								ncores.push(config.colors[j]);
							}
						}
						config.colors = ncores;
					}
					return config;
				}
				catch(e){
					return config;
				}
			},
			/**
			 * Cria botoes para cada composicao de um grafico
			 */
			listaComp: function(idjanela){
				var c = i3GEOF.graficointerativo1.propJanelas[idjanela].comp,
					n = c.length,
					ins = "",
					i;
				for( i = 0; i < n; i++){
					ins += '<h5>'
						+ '<button onclick="i3GEOF.graficointerativo1.composicao.remove(\'' + idjanela + '\',\'' + c[i] + '\')" class="btn btn-xs" style="margin:2px;padding:2px;"><span class="material-icons">clear</span></button>'
						+ c[i] + "</h5>";
				}
				$i(idjanela + "Composicoes").innerHTML = ins;
			},
			/**
			 * Lista as janelas de graficos abertas
			 */
			combojanelas: function(idjanela){
				var n = i3GEOF.graficointerativo1.janelas.length,
					ins = "",
					i;
				ins += "<select class='form-control' onchange='i3GEOF.graficointerativo1.composicao.adiciona(\"" + idjanela + "\",this.value)'>"
					+ "<option value=''>---</option>";

				for(i = 0; i < n; i++){
					if(i3GEOF.graficointerativo1.janelas[i] != idjanela)
					ins += "<option>" + i3GEOF.graficointerativo1.janelas[i] + "</option>";
				}
				ins += "</select>";
				$i(idjanela + "ComboJanelasGr").innerHTML = ins + '<b class="caret careti"></b>';
			},
			/**
			 * Verifica se o grafico dessa janela tem sobreposicao
			 */
			existe: function(idjanela){

			},
			/**
			 * Guarda os parametros do grafico correspondente a uma sobreposicao
			 */
			guardaParametros: function(idjanela){

			}
		},
		filtraCamada: function(idjanela,filtro){
			var p, cp, temp,tema = i3GEOF.graficointerativo1.propJanelas[idjanela].tema;
			p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?base64=sim&g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro&filtro="+i3GEO.util.base64encode(filtro);
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.set_transfer_mode('POST');
			temp = function(retorno){
				i3GEO.Interface.atualizaTema(retorno,tema);
			};
			cp.call(p,"insereFiltro",temp,"tema="+tema);
		},
		limparFiltros: function(){
			var i, p, cp, temp,tema,
				n = i3GEOF.graficointerativo1.janelas.length;
			p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?base64=sim&g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro";
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.set_transfer_mode('POST');

			for(i=0;i<n;i++){
				tema = i3GEOF.graficointerativo1.propJanelas[i3GEOF.graficointerativo1.janelas[i]].tema;
				temp = function(retorno){
					i3GEO.Interface.atualizaTema(retorno,tema);
				};
				cp.call(p,"insereFiltro",temp,"tema="+tema+"&filtro=");
			}
		}
	};
