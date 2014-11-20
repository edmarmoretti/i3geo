/*
Title: i3Geo

A classe i3GEO possu&iacute; os m&eacute;todos de cria&ccedil;&atilde;o e atualiza&ccedil;&atilde;o do mapa. Todas as subclasses
s&atilde;o baseadas em i3GEO, por exemplo, para criar uma janela flutuante sobre o mapa,
utilize i3GEO.janela.cria()

Para inicializar o mapa, utilize i3GEO.inicia() e para atualizar o mapa, utilize i3GEO.atualiza().
Ap&oacute;s terminado o processo de inicializa&ccedil;&atilde;o, pode-se executar uma fun&ccedil;&atilde;o de ajuste. Essa fun&ccedil;&atilde;o
deve ser definida em i3GEO.finaliza, por exemplo i3GEO.finaliza = "funcaoDeAjuste()" ou i3GEO.finaliza = function(){}

Ao inicializar ou atualizar o i3Geo, &eacute; feita uma chamada em AJAX
para a obten&ccedil;&atilde;o dos parametros necess&aacute;rios ao funcionamento do mapa. Esses parametros
s&atilde;o armazenados na vari&aacute;vel i3GEO.parametros

Nessa classe est&atilde;o dispon&iacute;veis vari&aacute;veis internas utilizadas em v&aacute;rias fun&ccedil;&otilde;es, como i3GEO.temaAtivo

i3GEOF

Esse objeto recebe os m&eacute;todos sob demanda por meio de inje&ccedil;&atilde;o de javascripts (script tag). &Eacute; utilizado pelas ferramentas existentes em i3geo/ferramentas.

Cada javascript inserido na p&aacute;gina adiciona novos objetos, como por exemplo i3GEOF.buffer.


Arquivo:

i3geo/classesjs/classe_i3geo.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
i3GEOF = [];
/*
 * YAHOO.i3GEO
 *
 * Namespace da biblioteca YUI que &eacute; reutiliz&aacute;vel em v&aacute;rios
 * trechos de c&oacute;digo do i3Geo
 *
 * Type: {YAHOO.namespace}
 */
YAHOO.namespace("i3GEO");
var i3GEO = {
	/*
	 * Propriedade: parametros
	 *
	 * Parametros obtidos do mapa atual. Os parametros s&atilde;o fornecidos
	 * pelos programas PHP de redesenho e cria&ccedil;&atilde;o do mapa e
	 * atualizados sempre que o mapa &eacute; alterado.
	 *
	 * Exemplos:
	 *
	 * alert(i3GEO.parametros.mapexten); i3GEO.parametros.mapscale = 25000;
	 *
	 * Parametros:
	 *
	 * mapexten {String} - extens&atilde;o geogr&aacute;fica do mapa no formato
	 * xmin ymin xmax ymax
	 *
	 * mapscale {Numeric} - denominador da escala do mapa
	 *
	 * mapres {Numeric} - resolu&ccedil;&atilde;o da imagem do mapa em DPI
	 *
	 * pixelsize {Numeric} - tamanho em unidades de terreno dos pixels da imagem
	 *
	 * mapfile {String} - nome do mapfile atualmente em uso
	 *
	 * cgi {String} - endere&ccedil;o do execut&aacute;vel do mapserver no
	 * servidor acess&iacute;vel pela URL
	 *
	 * extentTotal {String} - extens&atilde;o do mapa na
	 * inicializa&ccedil;&atilde;o
	 *
	 * mapimagem {String} - URL da imagem que comp&otilde;e o mapa
	 *
	 * geoip {sim|nao} - indica se o geoip est&aacute; instalado
	 *
	 * listavisual {String} - (depreciado) lista de visuais dispon&iacute;veis
	 *
	 * utilizacgi {sim|nao} - indica se o mapa atual est&aacute; no modo CGI
	 *
	 * versaoms {String} - vers&atilde;o do Mapserver instalado no servidor
	 * (maior)
	 *
	 * versaomscompleta {String} - vers&atilde;o do Mapserver instalado no
	 * servidor (completa)
	 *
	 * mensagens {String} - mensagens para uso no letreiro
	 *
	 * w {Integer} - largura do mapa atual
	 *
	 * h {Integer} - altura do mapa atual
	 *
	 * locsistemas {String} - endere&ccedil;o do xml com a lista de sistemas
	 * adicionais
	 *
	 * locidentifica {String} - endere&ccedil;o do xml com a lista de sistemas
	 * de identifica&ccedil;&atilde;o
	 *
	 * r {sim|nao} - indica se o software R est&aacute; instalado no servidor
	 *
	 * locmapas {String} - endere&ccedil;o do xml com a lista de mapas
	 *
	 * extentref {String} - extens&atilde;o geogr&aacute;fica do mapa de
	 * refer&ecirc;ncia
	 *
	 * celularef {Numeric} - tamanho do pixel do mapa de refer&ecirc;ncia em
	 * unidades do terreno
	 *
	 * kmlurl {String} - url de um arquivo kml que ser&aacute; inserido no mapa.
	 * V&aacute;lido apenas na interface Google Maps
	 *
	 * mensagemInicia {String} - mensagem definida em ms_configura.php indicando
	 * a vers&atilde;o atual do i3Geo.
	 *
	 * interfacePadrao {String} - interface padr&atilde;o definida em
	 * ms_configura
	 *
	 * embedLegenda {String} - sim|nao indica se na inicializa&ccedil;&atilde;o
	 * a legenda foi inserida no conte&uacute;do do mapa ou n&atilde;o
	 *
	 * celularef {Numeric} - tamanho da c&eacute;lula do mapa de
	 * refer&ecirc;ncia
	 *
	 * autenticadoopenid {sim|nao} - indica se o usu&aacute;rio foi autenticado
	 * em alguma rede social
	 *
	 * editor {sim|nao} - indica se o usu&aacute;rio atual &eacute; um editor
	 * (administrador)
	 *
	 * cordefundo {r,g,b}
	 *
	 * copyright {String} - texto existente no Layer copyright do mapfile de
	 * inicializa&ccedil;&atilde;o
	 */
	parametros : {
		mapexten : "",
		mapscale : "",
		mapres : "",
		pixelsize : "",
		mapfile : "",
		cgi : "",
		extentTotal : "",
		mapimagem : "",
		geoip : "",
		listavisual : "", // depreciado
		utilizacgi : "",
		versaoms : "",
		versaomscompleta : "",
		mensagens : "",
		w : "",
		h : "",
		locsistemas : "",
		locidentifica : "",
		r : "",
		locmapas : "",
		celularef : "",
		kmlurl : "",
		mensageminicia : "",
		interfacePadrao : "openlayers.htm",
		embedLegenda : "nao",
		autenticadoopenid : "nao",
		cordefundo : "",
		copyright : "",
		editor : "nao"
	},
	/*
	 * Largura da barra de rolagem do navegador. Se for igual a "", a largura
	 * ser&aacute; calculada automaticamente.
	 *
	 * O valor "scrollerWidth" ser&aacute; utilizado no calculo da largura do
	 * mapa. Se vc n&atilde;o quer diminuir o tamanho do mapa, subtraindo a
	 * largura da barra de rolagem, defina scrollerWidth = 0
	 *
	 * Tipo: {num&eacute;rico}
	 *
	 * Default: {""}
	 */
	scrollerWidth : "",
	/*
	 * Propriedade: finaliza
	 *
	 * Fun&ccedil;&atilde;o que ser&aacute; executada ap&oacute;s a
	 * cria&ccedil;&atilde;o e posicionamento do mapa. Pode ser uma string
	 * tamb&eacute;m, que ser&aacute; avaliada com "eval".
	 *
	 * Tipo: {string}
	 *
	 * Default: {""}
	 */
	finaliza : "",
	/*
	 * Propriedade: finalizaAPI
	 *
	 * Fun&ccedil;&atilde;o que ser&aacute; executada ap&oacute;s a API
	 * utilizada (Openlayers ou Googlemaps) ter sido inicializada e o objeto com
	 * o mapa ter sido criado. Pode ser uma string tamb&eacute;m, que
	 * ser&aacute; avaliada com "eval".
	 *
	 * Tipo: {string}
	 *
	 * Default: {""}
	 */
	finalizaAPI : "",
	/*
	 * Largura e altura do navegador ap&oacute;s a inicializa&ccedil;&atilde;o
	 * do mapa
	 *
	 * &Eacute; utilizado como um parametro para verificar se o mapa foi ou
	 * n&atilde;o redimensionado pelo usu&aacute;rio de forma consistente
	 *
	 * Type: {array}
	 */
	tamanhodoc : [],
	/*
	 * Variavel: temaAtivo
	 *
	 * Indica o &uacute;ltimo tema que foi ativado no mapa
	 *
	 * Permite que ao se passar de uma ferramenta para outra, os menus reflitam
	 * a &uacute;ltima escolha.
	 *
	 * Tipo: {string}
	 *
	 * Default: {""}
	 */
	temaAtivo : "",
	/*
	 * Essa vari&aacute;vel &eacute; um contador utilizado para indicar quantos
	 * processos est&atilde;o ativos e que ir&atilde;o executar o redesenho do
	 * mapa. O mapa s&oacute; &eacute; atualizado quando o contador for menor
	 * que 1. Esse contador &eacute; utilizado no m&eacute;todo i3GEO.atualiza O
	 * contador &eacute; necess&aacute;rio para evitar chamadas
	 * desnecess&aacute;rias a fun&ccedil;&atilde;o de redesenho do mapa.
	 *
	 * Tipo: {string}
	 */
	contadorAtualiza : 0,
	/*
	 * Function: cria
	 *
	 * Cria e configura a visualiza&ccedil;&atilde;o do mapa, definindo
	 * posicionamentos, tamanho etc
	 *
	 * Ap&oacute;s as defini&ccedil;&otilde;es b&aacute;sicas, &eacute;
	 * executado o programa <i3GEO.Interface.cria> que ir&aacute; realizar as
	 * opera&ccedil;&otilde;es conforme a interface atualmente em uso. A
	 * interface &eacute; definida em <i3GEO.Interface.ATUAL>
	 *
	 * Veja <i3GEO.Interface>
	 */
	cria : function() {
		if (i3GEO.configura.ajustaDocType === true) {
			i3GEO.util.ajustaDocType();
		}
		var tamanho, temp;

		temp = window.location.href.split("?");
		if(temp[1]){
			temp = temp[1].split("&");
			if (temp[0] && temp[0] != "") {
				i3GEO.configura.sid = temp[0];
				//
				// O # precisa ser removido, caso contrario, a opcao de reload da
				// pagina pelo browser as vezes nao funciona
				//
				if (i3GEO.configura.sid.split("#")[0]) {
					i3GEO.configura.sid = i3GEO.configura.sid.split("#")[0];
				}
			}
		} else {
			i3GEO.configura.sid = "";
		}
		if (i3GEO.configura.sid === 'undefined') {
			i3GEO.configura.sid = "";
		}
		i3GEO.mapa.aplicaPreferencias();
		if (i3GEO.Interface.ALTTABLET != "") {
			if (i3GEO.util.detectaMobile()) {
				return;
			}
		}
		//
		// tenta definir automaticamente a variavel que indica a localizacao do
		// i3geo
		//
		if (!i3GEO.configura.locaplic
				|| i3GEO.configura.locaplic === "") {
			i3GEO.util.localizai3GEO();
		}
		//
		// calcula o tamanho do mapa
		//
		tamanho = i3GEO.calculaTamanho();
		i3GEO.Interface.cria(
				tamanho[0],
				tamanho[1]);

	},
	/*
	 * Function: inicia
	 *
	 * Inicializa o mapa
	 *
	 * Verifica se o mapa apresenta algum problema no processamento no lado do
	 * servidor e realiza as opera&ccedil;&otilde;es de tentativa de
	 * recupera&ccedil;&atilde;o, se for o caso
	 *
	 * No in&iacute;cio do processo &eacute; executada a fun&ccedil;&atilde;o
	 * <i3GEOmantemCompatibilidade> para realizar as opera&ccedil;&otilde;es
	 * necess&aacute;rias de manuten&ccedil;&atilde;o de compatibilidade da
	 * vers&atilde;o atual para as anteriores
	 *
	 * A inicializa&ccedil;&atilde;o &eacute; baseada em <i3GEO.php.inicia> cujo
	 * retorno &eacute; utilizado para definir a vari&aacute;vel
	 * <i3GEO.parametros>
	 *
	 * Ap&oacute;s a inicializa&ccedil;&atilde;o &eacute; executado
	 * <i3GEO.Interface.inicia>
	 */
	inicia : function(retorno) {
		// define o valor inicial da variavel que controla as etiquetas quando o
		// usuario clica no mapa
		i3GEO.eventos.cliquePerm.ativoinicial = i3GEO.eventos.cliquePerm.ativo;
		var montaMapa, mashup, tamanho;
		if (typeof ("i3GEOmantemCompatibilidade") === 'function') {
			i3GEOmantemCompatibilidade();
		}
		i3GEO.mapa.aplicaPreferencias();
		montaMapa = function(retorno) {
			try {
				var temp, nomecookie = "i3geoOLUltimaExtensao", preferencias = "";
				// verifica se existe bloqueio em funcao da senha no
				// ms_configura.php
				if (retorno.bloqueado) {
					alert(retorno.bloqueado);
					exit;
				}
				if (retorno === "") {
					alert("Ocorreu um erro no mapa - i3GEO.inicia.montaMapa");
					retorno = {
						data : {
							erro : "erro"
						}
					};
				}
				if (retorno.data.erro) {
					// i3GEO.janela.fechaAguarde("montaMapa");
					document.body.style.backgroundColor = "white";
					document.body.innerHTML = "<br>Para abrir o i3Geo utilize o link:<br><a href="
							+ i3GEO.configura.locaplic
							+ "/ms_criamapa.php >"
							+ i3GEO.configura.locaplic
							+ "/ms_criamapa.php</a>";
					return ("linkquebrado");
				} else {
					if (retorno.data.variaveis) {
						i3GEO.parametros = retorno.data.variaveis;
						//
						// converte string em n&uacute;mero
						//
						i3GEO.parametros.mapscale = i3GEO.parametros.mapscale * 1;
						i3GEO.parametros.mapres = i3GEO.parametros.mapres * 1;
						i3GEO.parametros.pixelsize = i3GEO.parametros.pixelsize * 1;
						i3GEO.parametros.w = i3GEO.parametros.w * 1;
						i3GEO.parametros.h = i3GEO.parametros.h * 1;
						//
						// obtem os parametros que foram armazenados ao salvar o
						// mapa
						// caso o mapa atual tenha sido recuperado do banco de
						// dados
						// os parametros sao armazenados em base64 no objeto
						// metadata do mapfile
						//
						if (retorno.data.customizacoesinit) {
							preferencias = YAHOO.lang.JSON.parse(retorno.data.customizacoesinit);
							temp = i3GEO.util.base64decode(preferencias.preferenciasbase64);
							i3GEO.mapa.aplicaPreferencias(temp);
						}

						if (i3GEO.Interface.ATUAL === "googleearth") {
							i3GEO.configura.guardaExtensao = false;
						}
						// obtem o cookie com a ultima extensao geografica
						if (i3GEO.configura.guardaExtensao === true) {
							if (i3GEO.Interface.openlayers.googleLike === true) {
								nomecookie = "i3geoUltima_ExtensaoOSM";
							}
							temp = i3GEO.util.pegaCookie(nomecookie);
							if (temp && temp != "") {
								temp = temp.replace(
										/[\+]/g,
										" ");
								i3GEO.parametros.mapexten = temp;
							}
							i3GEO.eventos.NAVEGAMAPA.push(function() {
								i3GEO.util.insereCookie(
										nomecookie,
										i3GEO.parametros.mapexten);
							});
						}
						// anula os cookies de login se for necessario
						// o servidor verifica se na sessao o login esta ativo
						if (i3GEO.parametros.logado === "nao") {
							i3GEO.login.anulaCookie;
						}
						//
						i3GEO.arvoreDeCamadas.registaCamadas(retorno.data.temas);
						//
						if (retorno.data.variaveis.navegacaoDir.toLowerCase() === "sim") {
							i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir = true;
						}
						//
						// calcula (opcional) o tamanho correto da tabela onde
						// fica o mapa
						// se n&atilde;o for feito esse c&aacute;lculo, o mapa
						// fica ajustado a esquerda
						//
						temp = 0;
						if ($i("contemFerramentas")) {
							temp = temp
									+ parseInt(
											$i("contemFerramentas").style.width,
											10);
						}
						if ($i("ferramentas")) {
							temp = temp
									+ parseInt(
											$i("ferramentas").style.width,
											10);
						}
						if ($i("mst")) {
							$i("mst").style.width = i3GEO.parametros.w
									+ temp
									+ "px";
						}
						i3GEO.Interface.inicia();
						//
						// obtem os parametros que foram armazenados ao salvar o
						// mapa
						// caso o mapa atual tenha sido recuperado do banco de
						// dados
						//
						if (retorno.data.customizacoesinit) {
							// recupera os layers graficos
							if (preferencias.geometriasbase64
									&& preferencias.geometriasbase64 != "") {
								temp = i3GEO.util.base64decode(preferencias.geometriasbase64);
								i3GEO.mapa.desCompactaLayerGrafico(temp);
							}
							// recupera os graficos
							if (preferencias.graficosbase64
									&& preferencias.graficosbase64 != "") {
								i3GEO.mapa.restauraGraficos(preferencias.graficosbase64);
							}
						}
					} else {
						alert("Erro. Impossivel criar o mapa "
								+ retorno.data);
						return;
					}
					//
					// ativa a janela de mensagens se for o caso
					//
					if ($i("ajuda")) // para efeitos de compatibilidade com
										// as vers&otilde;es anteriores a 4.1
					{
						i3GEO.ajuda.DIVAJUDA = "ajuda";
					}
					/*
					 * abreJM = "sim"; if(i3GEO.util.pegaCookie("botoesAjuda")){
					 * abreJM = i3GEO.util.pegaCookie("botoesAjuda");
					 * i3GEO.barraDeBotoes.AJUDA = (abreJM === "sim") ? true :
					 * false; }
					 */
					if (i3GEO.configura.iniciaJanelaMensagens === true) {
						i3GEO.ajuda.abreJanela();
					}
					if (i3GEO.configura.liberaGuias.toLowerCase() === "sim") {
						i3GEO.guias.libera();
					}
				}
				i3GEO.aposIniciar();
			} catch (e) {}
		};
		if (!$i("i3geo")) {
			document.body.id = "i3geo";
		}
		$i("i3geo").className = "yui-skin-sam";
		//
		// se i3GEO.configura.sid = "", o html foi aberto diretamente
		// ent&atilde;o, &eacute; necess&aacute;rio criar os arquivos
		// tempor&aacute;rios do mapa
		// essa opera&ccedil;&atilde;o deve ser ass&iacute;ncrona
		//
		if (i3GEO.configura.sid === "") {
			mashup = function(retorno) {
				// verifica se existe bloqueio em funcao da senha no
				// ms_configura.php
				if (retorno.bloqueado) {
					alert(retorno.bloqueado);
					exit;
				}
				i3GEO.configura.sid = retorno.data;
				i3GEO.inicia(retorno);
			};
			i3GEO.configura.mashuppar += "&interface="
					+ i3GEO.Interface.ATUAL;
			// acrescenta camadas iniciais
			if (i3GEO.mapa.TEMASINICIAIS.length > 0) {
				i3GEO.configura.mashuppar += "&temasa="
						+ i3GEO.mapa.TEMASINICIAIS;
			}
			if (i3GEO.mapa.TEMASINICIAISLIGADOS.length > 0) {
				i3GEO.configura.mashuppar += "&layers="
						+ i3GEO.mapa.TEMASINICIAISLIGADOS;
			}

			i3GEO.php.criamapa(
					mashup,
					i3GEO.configura.mashuppar);
		} else {
			if (i3GEO.parametros.w === ""
					|| i3GEO.parametros.h === "") {
				tamanho = i3GEO.calculaTamanho();
				i3GEO.parametros.w = tamanho[0];
				i3GEO.parametros.h = tamanho[1];
			}
			i3GEO.php.inicia(
					montaMapa,
					i3GEO.configura.embedLegenda,
					i3GEO.parametros.w,
					i3GEO.parametros.h);
		}
		if (i3GEO.eventos.NAVEGAMAPA.toString().search(
				"i3GEO.janela.fechaAguarde()") < 0) {
			i3GEO.eventos.NAVEGAMAPA.push("i3GEO.janela.fechaAguarde()");
		}
		// eval(i3GEO.finaliza);
	},
	/*
	 * Executa opera&ccedil;&otilde;es ap&oacute;s o mapa ter sido posicionado
	 * na tela
	 *
	 * Executa tamb&eacute;m o que for definido em i3Geo.finaliza
	 */
	aposIniciar : function() {
		if ($i("mst")) {
			$i("mst").style.visibility = "visible";
		}
		if (YAHOO.lang.isFunction(i3GEO.finaliza)) {
			i3GEO.finaliza.call();
		} else {
			if (i3GEO.finaliza != "") {
				eval(i3GEO.finaliza);
			}
		}
		if (i3GEO.guias.TIPO === "movel") {
			i3GEO.guias.guiaMovel.inicia();
		}
		if (i3GEO.mapa.AUTORESIZE === true) {
			i3GEO.mapa.ativaAutoResize();
		}
	},
	/*
	 * Function: atualiza
	 *
	 * Atualiza o mapa atual, altera a imagem do mapa os gadgets ativos e os
	 * parametros e verifica a integridade do mapa em uso (arquivo mapfile)
	 *
	 * O processo executa tamb&eacute;m a fun&ccedil;&atilde;o de
	 * atualiza&ccedil;&atilde;o espec&iacute;fica da interface atual em uso,
	 * veja <i3GEO.Interface.redesenha>
	 *
	 * Os seguintes gadgets s&atilde;o processados
	 *
	 * <i3GEO.arvoreDeCamadas.atualiza>
	 *
	 * <i3GEO.arvoreDeCamadas.atualizaFarol>
	 *
	 * Os eventos definidos em <i3GEO.eventos.navegaMapa> s&atilde;o executados
	 *
	 * Parametro:
	 *
	 * retorno {String} - string com os parametros do novo mapa. Se retorno
	 * n&atilde;o for especificado ou se for vazio, ser&aacute; feita uma
	 * chamada em ajax para sua obten&ccedil;&atilde;o. O resultado dessa
	 * chamada &eacute; armazenada em i3GEO.parametros
	 */
	atualiza : function(retorno) {
		var corpoMapa, erro, mapscale, temp;
		if (i3GEO.contadorAtualiza > 1) {
			i3GEO.contadorAtualiza--;
			return;
		}
		if (i3GEO.contadorAtualiza > 0) {
			i3GEO.contadorAtualiza--;
		}
		i3GEO.contadorAtualiza++;
		//
		// funcao que pega os dados do mapa no servidor
		//
		corpoMapa = function() {
			if ($i("ajaxCorpoMapa")) {
				return;
			}
			i3GEO.php.corpo(
					i3GEO.atualiza,
					i3GEO.configura.tipoimagem);
		};
		//
		// se retorno n&atilde;o tiver sido definido, busca os dados no servidor
		// e chama novamente a fun&ccedil;&atilde;o atualiza
		//
		if (arguments.length === 0) {
			i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
			corpoMapa.call();
			return;
		}
		//
		// igual a anterior para efeitos de compatibilidade com outras
		// vers&otilde;es do i3geo
		//
		if (retorno === "") {
			corpoMapa.call();
			return;
		}
		//
		// se retorno.data n&atilde;o existir, &eacute; pq ocorreu um erro
		//
		if (!retorno.data) {
			alert(retorno);
			i3GEO.mapa.recupera.inicia();
			// corpoMapa.call();
			return;
		}
		// verifica se o parametro retorno existe, caso contr&aacute;rio,
		// faz a chamada ao programa PHP para obter os parametros
		try {
			if (retorno.data === "erro") {
				alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");
				i3GEO.mapa.recupera.inicia();
				return;
			} else if (retorno.data === "ok"
					|| retorno.data === "") {
				corpoMapa.call();
				return;
			}
		} catch (e) {

		}
		erro = function() {
			var c = confirm("Ocorreu um erro, quer tentar novamente?");
			if (c) {
				corpoMapa.call();
			} else {
				i3GEO.janela.fechaAguarde();
			}
			return;
		};
		//
		// atualiza as vari&aacute;veis
		//
		if (arguments.length === 0
				|| retorno === ""
				|| retorno.data.variaveis === undefined) {
			erro.call();
			return;
		} else {
			//
			// se deu tudo certo, pega os valores do retorno e seta as
			// vari&aacute;veis do mapa
			//
			if (arguments.length === 0) {
				return;
			}
			i3GEO.mapa.verifica(retorno);
			tempo = "";
			mapscale = i3GEO.parametros.mapscale;
			i3GEO.atualizaParametros(retorno.data.variaveis);

			if (retorno.data.variaveis.erro !== "") {
				alert(retorno.data.variaveis.erro);
			}
			//
			// o try aqui &eacute; necess&aacute;rio pois na interface
			// googlemaps os parametros retorno.data.variaveis n&atilde;o
			// s&atilde;o gerados completamente
			//
			temp = i3GEO.arvoreDeCamadas.converteChaveValor2normal(retorno.data.temas);
			try {
				i3GEO.arvoreDeCamadas.atualiza(temp);
				if (i3GEO.parametros.mapscale !== mapscale) {
					i3GEO.arvoreDeCamadas.atualizaFarol(i3GEO.parametros.mapscale);
				}
			} catch (e) {
			}
			i3GEO.arvoreDeCamadas.registaCamadas(temp);
			// nesse ponto o layer sera adicionado ao mapa
			i3GEO.Interface.redesenha();
			// caso esteja na funcao de identificacao
			if ($i("i3GEOidentificalistaTemas")) {
				g_tipoacao = "identifica";
				g_operacao = 'identifica';
			} else {
				g_operacao = "";
			}
			if ($i("mensagemt")) {
				$i("mensagemt").value = i3GEO.parametros.mapexten;
			}

			i3GEO.eventos.navegaMapa();
			i3GEO.ajuda.mostraJanela(
					"Tempo de redesenho em segundos: "
							+ retorno.data.variaveis.tempo,
					"");
			//
			// verifica se deve ser feito o zoom em algum tema
			//
			temp = i3GEO.arvoreDeCamadas.verificaAplicaExtensao();
			if (temp !== "") {
				i3GEO.tema.zoom(temp);
			}
		}
	},
	/*
	 * Calcula o tamanho do mapa atual e define alguns elementos HTML do mapa
	 *
	 * Return: {array} - [w,h]
	 */
	calculaTamanho : function() {
		var diminuix, diminuiy, menos, novow, novoh, w, h, temp, Dw, Dh;
		diminuix = (navm) ? i3GEO.configura.diminuixM : i3GEO.configura.diminuixN;
		diminuiy = (navm) ? i3GEO.configura.diminuiyM : i3GEO.configura.diminuiyN;
		menos = 0;
		temp = $i("contemFerramentas");
		if (temp
				&& temp.style
				&& temp.style.width) {
			menos += parseInt(
					$i("contemFerramentas").style.width,
					10);
		}
		temp = $i("ferramentas");
		if (temp
				&& temp.style
				&& temp.style.width) {
			menos += parseInt(
					$i("ferramentas").style.width,
					10);
		}

		if (i3GEO.configura.autotamanho === true) {
			if (window.top === window.self) {// nao se aplica em iframe
				window.resizeTo(
						screen.availWidth,
						screen.availHeight);
				window.moveTo(
						0,
						0);
			}
		}
		if (i3GEO.scrollerWidth === "") {
			i3GEO.scrollerWidth = i3GEO.util.getScrollerWidth();
		}
		i3GEO.tamanhodoc = [
				YAHOO.util.Dom.getViewportWidth(), YAHOO.util.Dom.getViewportHeight()
		];
		Dw = YAHOO.util.Dom.getDocumentWidth();
		Dh = YAHOO.util.Dom.getDocumentHeight();
		novow = Dw
				- i3GEO.scrollerWidth;
		novoh = Dh;
		document.body.style.width = novow
				+ "px";
		document.body.style.height = novoh
				+ "px";

		w = novow
				- menos
				- diminuix;
		h = novoh
				- diminuiy;

		temp = $i("corpoMapa");
		if (temp) {
			if (temp.style) {
				if (temp.style.width) {
					w = parseInt(
							temp.style.width,
							10);
					h = parseInt(
							temp.style.width,
							10);
					i3GEO.parametros.w = w;
				}
				if (temp.style.height) {
					h = parseInt(
							temp.style.height,
							10);
					i3GEO.parametros.h = h;
				}
			}
		}
		temp = $i("contemImg");
		if (temp) {
			temp.style.height = h
					+ "px";
			temp.style.width = w
					+ "px";
		}
		return [
				w, h
		];
	},
	/*
	 * Recalcula o tamanho do mapa com base nas configura&ccedil;&otilde;es do
	 * navegador
	 *
	 * Return: {array} - [w,h]
	 */
	reCalculaTamanho : function() {
		var diminuix, diminuiy, menos, novow, novoh, w, h, temp, antigoh = i3GEO.parametros.h;
		diminuix = (navm) ? i3GEO.configura.diminuixM : i3GEO.configura.diminuixN;
		diminuiy = (navm) ? i3GEO.configura.diminuiyM : i3GEO.configura.diminuiyN;
		menos = 0;
		temp = $i("contemFerramentas");
		if (temp
				&& temp.style
				&& temp.style.width) {
			menos += parseInt(
					$i("contemFerramentas").style.width,
					10);
		}
		temp = $i("ferramentas");
		if (temp
				&& temp.style
				&& temp.style.width) {
			menos += parseInt(
					$i("ferramentas").style.width,
					10);
		}
		document.body.style.width = "99%";
		temp = i3GEO.util.tamanhoBrowser();
		novow = temp[0];
		novoh = temp[1];
		temp = (antigoh - (novoh - diminuiy));

		document.body.style.height = novoh
				+ "px";
		w = novow
				- menos
				- diminuix;
		h = novoh
				- diminuiy;

		temp = $i(i3GEO.Interface.IDMAPA);
		if (temp) {
			temp.style.height = h
					+ "px";
			temp.style.width = w
					+ "px";
			YAHOO.util.Event.addListener(
					temp,
					"click",
					YAHOO.util.Event.stopEvent);
			YAHOO.util.Event.addFocusListener(
					temp,
					YAHOO.util.Event.preventDefault);
		}
		temp = $i(i3GEO.Interface.IDCORPO);
		if (temp) {
			temp.style.height = h
					+ "px";
			temp.style.width = w
					+ "px";
			YAHOO.util.Event.addListener(
					temp,
					"click",
					YAHOO.util.Event.stopEvent);
			YAHOO.util.Event.addFocusListener(
					temp,
					YAHOO.util.Event.preventDefault);
		}
		temp = $i("mst");
		if (temp) {
			temp.style.width = "100%";
		}

		i3GEO.parametros.w = w;
		i3GEO.parametros.h = h;
		temp = function() {
			switch (i3GEO.Interface.ATUAL) {
			case "googlemaps":
				i3GEO.Interface.googlemaps.zoom2extent(i3GEO.parametros.mapexten);
				break;
			case "googleearth":
				i3GEO.Interface.googleearth.zoom2extent(i3GEO.parametros.mapexten);
				break;
			case "openlayers":
				i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.mapexten);
				i3geoOL.updateSize();
				i3GEO.Interface.openlayers.OLpanzoombar.div.style.top = i3GEO.Interface.BARRADEZOOMTOP
						+ "px";

				i3GEO.Interface.openlayers.OLpanzoombar.div.style.left = i3GEO.Interface.BARRADEZOOMLEFT
						+ "px";
				i3GEO.Interface.openlayers.OLpanzoombar.div.style.right = i3GEO.Interface.BARRADEZOOMRIGHT
						+ "px";
				if (i3GEO.Interface.BARRADEZOOMLEFT === 0) {
					i3GEO.Interface.openlayers.OLpanzoombar.div.style.left = null;
				}
				if (i3GEO.Interface.BARRADEZOOMRIGHT === 0) {
					i3GEO.Interface.openlayers.OLpanzoombar.div.style.right = null;
				}
				break;
			};
			if (i3GEO.guias.TIPO === "sanfona") {
				i3GEO.guias.ALTURACORPOGUIAS = h
						- (antigoh - i3GEO.guias.ALTURACORPOGUIAS);
			} else {
				i3GEO.guias.ALTURACORPOGUIAS = h;
			}
			return [
					w, h
			];
		};
		i3GEO.php.mudatamanho(
				temp,
				h,
				w);
	},
	/*
	 * Atualiza os valores da vari&aacute;vel i3GEO.parametros
	 *
	 * Parametro:
	 *
	 * variaveis {obj} - objeto JSON com os valores. Tipicamente &eacute; obtido
	 * do servidor por meio de uma chamada AJAX
	 */
	atualizaParametros : function(variaveis) {
		i3GEO.parametros.mapscale = variaveis.mapscale * 1;
		i3GEO.parametros.mapres = variaveis.mapres * 1;
		i3GEO.parametros.pixelsize = variaveis.pixelsize * 1;
		i3GEO.parametros.mapexten = variaveis.mapexten;// variaveis.mapexten;
		i3GEO.parametros.mapimagem = variaveis.mapimagem;
		i3GEO.parametros.w = variaveis.w * 1;
		i3GEO.parametros.h = variaveis.h * 1;
		i3GEO.parametros.mappath = variaveis.mappath;
		i3GEO.parametros.mapurl = variaveis.mapurl;
		if (i3GEO.login.verificaCookieLogin()) {
			i3GEO.parametros.editor = "sim";
		} else {
			i3GEO.parametros.editor = "nao";
		}
	}
};
