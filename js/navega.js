/**
 * Title: Navega&ccedil;&atilde;o sobre o mapa
 *
 * Realiza opera&ccedil;&otilde;es de navega&ccedil;&atilde;o do mapa, como zoom, pan, etc..
 *
 * Namespace:
 *
 * i3GEO.navega
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_navega.js>
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
i3GEO.navega =
	{
		/**
		 * Guarda as ultimas extensoes geograficas das operacoes de navegacao
		 */
		EXTENSOES : {
			lista : [],
			redo : [],
			listax : [
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				""
			],
			posicao : 0,
			emAcao : false
		},
		/**
		 * Tempo em milisegundos que ser&aacute; esperado para executar uma opera&ccedil;&atilde;o de navega&ccedil;&atilde;o sobre o mapa.
		 *
		 * Controla o lapso de tempo utilizado para disparar as fun&ccedil;&otilde;es do tipo navega&ccedil;&atilde;o
		 *
		 * Tipo:
		 *
		 * {Numeric}
		 *
		 * Default:
		 *
		 * 600
		 */
		TEMPONAVEGAR : 600,
		/**
		 * Propriedade: FATORZOOM
		 *
		 * Valor utilizado nas opera&ccedil;&otilde;es de zoom in e out. Fator de zoom.
		 *
		 * Tipo:
		 *
		 * {Numeric}
		 *
		 * Default:
		 *
		 * 2
		 */
		FATORZOOM : 2,
		/**
		 * Objeto do tipo timer utilizado no contador de tempo para o delay de execu&ccedil;&atilde;o das fun&ccedil;&otilde;es de
		 * navega&ccedil;&atilde;o
		 */
		timerNavega : null,
		/**
		 * Registra uma extensao na variavel EXTENSOES
		 */
		registraExt : function(ext) {
			var l = i3GEO.navega.EXTENSOES.lista,
				n = l.length;
			//precisa ter cuidado para nao registrar a mesma extensao atual
			if (n > 10){
				l.shift();
			}
			n = l.length;
			if(n > 0){
				if(l[n-1] === ext){
					return;
				}
			}
			l.push(ext);
			/*
			var n = i3GEO.navega.EXTENSOES.lista.length;
			if (ext == "" || ext == i3GEO.navega.EXTENSOES.lista[n - 1]) {
				i3GEO.navega.EXTENSOES.posicao = 0;
				i3GEO.navega.EXTENSOES.emAcao = false;
				return;
			}
			if (i3GEO.navega.EXTENSOES.emAcao === false) {
				i3GEO.navega.EXTENSOES.lista.shift();
				i3GEO.navega.EXTENSOES.lista.push(ext);
				i3GEO.navega.EXTENSOES.posicao = 0;
				i3GEO.navega.EXTENSOES.emAcao = false;
			}
			i3GEO.navega.EXTENSOES.emAcao = false;
			*/
		},
		extensaoAnterior : function() {
			var l = i3GEO.navega.EXTENSOES.lista,
				r = i3GEO.navega.EXTENSOES.redo,
				e;
			if(l.length > 1){
				e = l.pop();
				i3GEO.navega.zoomExt("", "", "", l[l.length-1]);
				if(r.length > 10){
					r.pop();
				}
				if(r.length > 0 && r[r.length -1] === e){
					return;
				}
				r.push(e);
			}
		},
		extensaoProximo : function() {
			var l = i3GEO.navega.EXTENSOES.lista,
			r = i3GEO.navega.EXTENSOES.redo,
			e;
			if(r.length > 1){
				i3GEO.navega.zoomExt("", "", "", r[r.length-1]);
				e = r.pop();
				if(l.length > 10){
					l.pop();
				}
				if(l.length > 0 && l[l.length -1] === e){
					return;
				}
				l.push(e);
			}
		},
		/**
		 * Function: pan2ponto
		 *
		 * Desloca o centro do mapa para um ponto. Utiliza as funcoes da API em uso para executar o pan
		 *
		 * Parameters:
		 *
		 * {numerico} - longitude
		 *
		 * {numerico} - latitude
		 */
		pan2ponto : function(x, y) {
			i3GEO.Interface[i3GEO.Interface.ATUAL].pan2ponto(x, y);
			i3GEO.Interface[i3GEO.Interface.ATUAL].recalcPar();
		},
		/**
		 * Function: centroDoMapa
		 *
		 * Obt&eacute;m as coordenadas geogr&aacute;ficas do centro do mapa
		 *
		 * Retorno:
		 *
		 * {array|false} - false se falhar ou [x,y] se n&atilde;o falhar
		 */
		centroDoMapa : function() {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.centroDoMapa()");

			var xy;
			switch (i3GEO.Interface.ATUAL) {
			case "openlayers":
				xy = i3geoOL.getCenter();
				if (xy) {
					return [
						xy.lon,
						xy.lat
					];
				} else {
					return false;
				}
				break;
			case "googlemaps":
				xy = i3GeoMap.getCenter();
				if (xy) {
					return [
						xy.lng(),
						xy.lat()
					];
				} else {
					return false;
				}
				break;
			default:
				return false;
			}
		},
		//a marca e fixa no mapa quando ocorre o PAN
		marcaCentroDoMapa : function(xy) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.marcaCentroDoMapa()");

			if (xy != false) {
				xy =
					i3GEO.calculo.dd2tela(
						xy[0] * 1,
						xy[1] * 1,
						$i(i3GEO.Interface.IDMAPA),
						i3GEO.parametros.mapexten,
						i3GEO.parametros.pixelsize);
				i3GEO.util.criaPin("i3GeoCentroDoMapa", i3GEO.configura.locaplic + '/imagens/alvo.png', '30px', '30px');
				i3GEO.util.posicionaImagemNoMapa("i3GeoCentroDoMapa", xy[0], xy[1]);
			}
		},
		removeCookieExtensao : function() {
			var nomecookie = "i3geoOLUltimaExtensao";
			if (i3GEO.Interface.openlayers.googleLike === true) {
				nomecookie = "i3geoUltima_ExtensaoOSM";
			}
			i3GEO.util.insereCookie(nomecookie, "");
		},
		/**
		 * Function: zoomin
		 *
		 * Aproxima o mapa aplicando um fator de modifica&ccedil;&atilde;o da escala
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 */
		zoomin : function(locaplic, sid) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.zoomin()");

			if (i3GEO.Interface.ATUAL === "openlayers") {
				i3geoOL.zoomIn();
				return;
			}
		},
		/**
		 * Function: zoomout
		 *
		 * Afasta o mapa aplicando um fator de modifica&ccedil;&atilde;o da escala
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 */
		zoomout : function(locaplic, sid) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.zoomout()");

			if (i3GEO.Interface.ATUAL === "openlayers") {
				i3geoOL.zoomOut();
				return;
			}
		},
		/**
		 * Function: zoomponto
		 *
		 * Centraliza o mapa em um ponto e acrescenta o ponto como uma nova camada no mapa
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 *
		 * {Numeric} - coordenada em d&eacute;cimos de grau da longitude
		 *
		 * {Numeric} - coordenada em d&eacute;cimos de grau da latitude
		 *
		 * {Numeric} - opcional, tamanho do s&iacute;mbolo do ponto que ser&aacute; inserido no mapa
		 *
		 * {String} - opcional, nome do s&iacute;mbolo para o ponto
		 *
		 * {String} - opcional, cor em r g b (p.ex. "255 0 0")
		 */
		zoomponto : function(locaplic, sid, x, y, tamanho, simbolo, cor) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.zoomponto()");

			if (!simbolo) {
				simbolo = "ponto";
			}
			if (!tamanho) {
				tamanho = 15;
			}
			if (!cor) {
				cor = "255 0 0";
			}
			if (locaplic !== "") {
				i3GEO.configura.locaplic = locaplic;
			}
			if (sid !== "") {
				i3GEO.configura.sid = sid;
			}
			i3GEO.php.zoomponto(i3GEO.atualiza,x,y,tamanho,simbolo,cor);
			/*
			var f =
				"i3GEO.navega.timerNavega = null;" + "i3GEO.php.zoomponto(i3GEO.atualiza," + x + "," + y + "," + tamanho + ",'" + simbolo
					+ "','" + cor + "');";
			if (i3GEO.navega.timerNavega !== undefined) {
				clearTimeout(i3GEO.navega.timerNavega);
			}
			i3GEO.navega.timerNavega = setTimeout(f, i3GEO.navega.TEMPONAVEGAR);
			*/
		},
		/**
		 * Function: zoompontoIMG
		 *
		 * Centraliza o mapa em um ponto de coordenadas medidas na imagem do mapa
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 *
		 * {Numeric} - coordenada x da imagem
		 *
		 * {Numeric} - coordenada y da imagem
		 */
		zoompontoIMG : function(locaplic, sid, x, y) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.zoompontoIMG()");

			if (locaplic !== "") {
				i3GEO.configura.locaplic = locaplic;
			}
			if (sid !== "") {
				i3GEO.configura.sid = sid;
			}
			i3GEO.php.pan(i3GEO.atualiza, '', '', x, y);
		},
		/**
		 * Function: xy2xy
		 *
		 * Desloca o mapa de um ponto de coordenadas xy para um segundo ponto
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 *
		 * {Numeric} - coordenada x inicial
		 *
		 * {Numeric} - coordenada y inicial
		 *
		 * {Numeric} - coordenada x final
		 *
		 * {Numeric} - coordenada y final
		 *
		 * {String} - extens&atilde;o geogr&aacute;fica do mapa
		 *
		 * {String} - tipo de imagem atual do mapa (sepia,nenhum,cinza)
		 */
		xy2xy : function(locaplic, sid, xi, yi, xf, yf, ext, tipoimagem) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.xy2xy()");

			var disty, distx, ex, novoxi, novoxf, novoyf, nex;
			if (locaplic !== "") {
				i3GEO.configura.locaplic = locaplic;
			}
			if (sid !== "") {
				i3GEO.configura.sid = sid;
			}
			disty = (yi * -1) + yf;
			distx = (xi * -1) + xf;
			ex = ext.split(" ");
			novoxi = (ex[0] * 1) - distx;
			novoxf = (ex[2] * 1) - distx;
			novoyi = (ex[1] * 1) - disty;
			novoyf = (ex[3] * 1) - disty;
			if ((distx === 0) && (disty === 0)) {
				return false;
			} else {
				nex = novoxi + " " + novoyi + " " + novoxf + " " + novoyf;
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic, i3GEO.configura.sid, tipoimagem, nex);
				return true;
			}
		},
		/**
		 * Localiza as coordenadas baseadas no n&uacute;mero IP do usu&aacute;rio.
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 *
		 * {Function} - fun&ccedil;&atilde;o que ser&aacute; executada ao concluir a chamada AJAX. Essa fun&ccedil;&atilde;o receber&aacute;
		 * o objeto JSON obtido.
		 */
		localizaIP : function(locaplic, sid, funcao) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.localizaIP()");

			if (locaplic !== "") {
				i3GEO.configura.locaplic = locaplic;
			}
			if (sid !== "") {
				i3GEO.configura.sid = sid;
			}
			i3GEO.php.localizaIP(funcao);
		},
		/**
		 * Mostra no mapa um ponto baseado na localiza&ccedil;&atilde;o do usu&aacute;rio.
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 */
		zoomIP : function(locaplic, sid) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.zoomIP()");

			try {
				if (arguments.length > 0) {
					i3GEO.configura.locaplic = locaplic;
					i3GEO.configura.sid = sid;
				}
				var mostraIP = function(retorno) {
					if (retorno.data.latitude !== null) {
						i3GEO.navega.zoomponto(locaplic, sid, retorno.data.longitude, retorno.data.latitude);
					} else {
						i3GEO.janela.tempoMsg("Nao foi possivel identificar a localizacao.");
					}
				};
				i3GEO.navega.localizaIP(locaplic, sid, mostraIP);
			} catch (e) {
			}
		},
		/**
		 * Function: zoomExt
		 *
		 * Aplica uma nova extens&atilde;o geogr&aacute;fica ao mapa.
		 *
		 * Parametros:
		 *
		 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
		 *
		 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
		 *
		 * {String} - Utlize "" para aplicar o default. Tipo de imagem que ser&aacute; retornada na imagem do mapa que ser&aacute; criada
		 *
		 * {String} - Extens&atilde;o geogr&aacute;fica no formato xmin ymin xmax ymax
		 */
		zoomExt : function(locaplic, sid, tipoimagem, ext) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.zoomExt()");

			var f;
			if (locaplic !== "") {
				i3GEO.configura.locaplic = locaplic;
			}
			if (sid !== "") {
				i3GEO.configura.sid = sid;
			}
			if (tipoimagem === "") {
				tipoimagem = "nenhum";
			}
			// verifica se nao e necessario alterar as coordenadas
			ext = i3GEO.util.extGeo2OSM(ext);
			f = "i3GEO.navega.timerNavega = null;" + "i3GEO.php.mudaext(i3GEO.atualiza,'" + tipoimagem + "','" + ext + "');";
			if (i3GEO.navega.timerNavega !== undefined) {
				clearTimeout(i3GEO.navega.timerNavega);
			}
			i3GEO.navega.timerNavega = setTimeout(f, i3GEO.navega.TEMPONAVEGAR);
		},
		/**
		 * Function: aplicaEscala
		 *
		 * Aplica ao mapa um novo valor de escala tendo como base o valor do denminador
		 *
		 * Utilize "" caso vc queira usar locaplic e sid default.
		 *
		 * Parametros:
		 *
		 * {String} - endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX. Pode ser ""
		 *
		 * {String} - c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo. pode ser ""
		 *
		 * {Numeric} - denominador da escala
		 */
		aplicaEscala : function(locaplic, sid, escala) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.navega.aplicaEscala()");

			// YAHOO.log("aplicaescala", "i3geo");
			if (i3GEO.Interface.ATUAL === "googlemaps") {
				i3GeoMap.setZoom(i3GEO.Interface.googlemaps.escala2nzoom(escala));
			}
			if (i3GEO.Interface.ATUAL === "openlayers") {
				i3geoOL.zoomToScale(escala, true);
			}
		},
		panFixo : function() {
			alert("panFixo foi depreciado na versao 6.0");
		},
		mostraRosaDosVentos : function() {
			alert("mostraRosaDosVentos foi depreciado na versao 6.0");
		},
		/**
		 * Section: i3GEO.navega.autoRedesenho
		 *
		 * Controla o redesenho autom&aacute;tico do mapa por meio de um temporizador
		 */
		autoRedesenho : {
			/**
			 * Propriedade: INTERVALO
			 *
			 * Intervalo de tempo, em milisegundos, que ser&aacute; utilizado para disparar o desenho do mapa
			 *
			 * Tipo:
			 *
			 * {Integer}
			 *
			 * Default:
			 *
			 * 0
			 */
			INTERVALO : 0,
			/**
			 * Guarda o valor do ID do elemento HTML que receber&aacute; o contador de tempo
			 *
			 * Tipo: {String}
			 */
			ID : "tempoRedesenho",
			/**
			 * Function: ativa
			 *
			 * Ativa o auto-redesenho do mapa
			 *
			 * Parametros:
			 *
			 * {String} - id do elemento onde o contador de tempo ser&aacute; mostrado no mapa. Por default, utiliza "tempoRedesenho".
			 */
			ativa : function(id) {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.autoRedesenho.ativa()");

				if (arguments.length === 0) {
					id = "tempoRedesenho";
				}
				i3GEO.navega.autoRedesenho.ID = id;
				if (($i(id)) && i3GEO.navega.autoRedesenho.INTERVALO > 0) {
					$i(id).style.display = "block";
				}
				if (i3GEO.navega.autoRedesenho.INTERVALO > 0) {
					i3GEO.navega.tempoRedesenho =
						setTimeout('i3GEO.navega.autoRedesenho.redesenha()', i3GEO.navega.autoRedesenho.INTERVALO);
				}
				if (($i(id)) && (i3GEO.navega.autoRedesenho.INTERVALO > 0)) {
					$i(id).innerHTML = i3GEO.navega.autoRedesenho.INTERVALO / 1000;
					i3GEO.navega.contaTempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.contagem()', 1000);
				}
			},
			/**
			 * Function: desativa
			 *
			 * Desativa o auto-redesenho do mapa
			 */
			desativa : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.autoRedesenho.desativa()");

				i3GEO.navega.autoRedesenho.INTERVALO = 0;
				clearTimeout(i3GEO.navega.tempoRedesenho);
				clearTimeout(i3GEO.navega.contaTempoRedesenho);
				i3GEO.navega.tempoRedesenho = "";
				i3GEO.navega.contaTempoRedesenho = "";
				if ($i(i3GEO.navega.autoRedesenho.ID)) {
					$i(i3GEO.navega.autoRedesenho.ID).style.display = "none";
				}
			},
			/**
			 * Redesenha o mapa quando o contador de tempo chegar a zero
			 */
			redesenha : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.autoRedesenho.redesenha()");

				clearTimeout(i3GEO.navega.tempoRedesenho);
				clearTimeout(i3GEO.navega.contaTempoRedesenho);
				switch (i3GEO.Interface.ATUAL) {
				case "openlayers":
					i3GEO.Interface.openlayers.atualizaMapa();
					break;
				case "googlemaps":
					i3GEO.Interface.googlemaps.redesenha();
					break;
				default:
					i3GEO.atualiza("");
				}
				i3GEO.navega.autoRedesenho.ativa(i3GEO.navega.autoRedesenho.ID);
			},
			/**
			 * Faz a contagem do tempo
			 */
			contagem : function() {
				if ($i(i3GEO.navega.autoRedesenho.ID)) {
					$i(i3GEO.navega.autoRedesenho.ID).innerHTML = parseInt($i(i3GEO.navega.autoRedesenho.ID).innerHTML, 10) - 1;
				}
				i3GEO.navega.contaTempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.contagem()', 1000);
			}
		},
		zoomBox : {
			inicia : function() {
				alert("zoomBox depreciado na versao 6.0");
			}
		},
		/**
		 * Section: i3GEO.navega.lente
		 *
		 * Ativa e controla a lente de aumento.
		 *
		 * A lente de aumento &eacute; um box que pode ser ativado sobre o mapa mostrando uma imagem ampliada da regi&atilde;o onde
		 * est&aacute; o mouse
		 */
		lente : {
			/**
			 * Propriedade: POSICAOX
			 *
			 * Define a posi&ccedil;&atilde;o em x da lente em rela&ccedil;&atilde;o ao corpo do mapa
			 *
			 * Tipo:
			 *
			 * {numeric}
			 *
			 * Default:
			 *
			 * 0
			 */
			POSICAOX : 0,
			/**
			 * Propriedade: POSICAOY
			 *
			 * Define a posi&ccedil;&atilde;o em y da lente em rela&ccedil;&atilde;o ao corpo do mapa
			 *
			 * Tipo:
			 *
			 * {numeric}
			 *
			 * Default:
			 *
			 * 0
			 */
			POSICAOY : 0,
			/**
			 * Indica se a lente foi ou n&atilde;o aberta
			 */
			ESTAATIVA : "nao",
			/**
			 * Function: inicia
			 *
			 * Ativa a lente de aumento criando os elementos gr&aacute;ficos necess&aacute;rios e ativando os eventos que controlam a
			 * apresenta&ccedil;&atilde;o da lente
			 */
			inicia : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.lente.inicia()");

				// insere lente de aumento
				var novoel, novoimg, temp;
				if (!$i("lente")) {
					novoel = document.createElement("div");
					novoel.id = 'lente';
					novoel.style.clip = 'rect(0px,0px,0px,0px)';
					novoimg = document.createElement("img");
					novoimg.src = "";
					novoimg.id = 'lenteimg';
					novoel.appendChild(novoimg);
					document.body.appendChild(novoel);
					novoel = document.createElement("div");
					novoel.id = 'boxlente';
					document.body.appendChild(novoel);
				}
				temp = $i('boxlente').style;
				temp.borderWidth = '1';
				temp.borderColor = "red";
				temp.display = "block";
				$i("lente").style.display = "block";
				i3GEO.navega.lente.ESTAATIVA = "sim";
				i3GEO.navega.lente.atualiza();
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEO.navega.lente.atualiza()"]);
				i3GEO.eventos.adicionaEventos("MOUSEMOVE",["i3GEO.navega.lente.movimenta()"]);
			},
			/**
			 * Atualiza a imagem da lente aberta
			 */
			atualiza : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.lente.atualiza()");

				var temp = function(retorno) {
					try {
						var pos, volta, nimg, olente, oboxlente, olenteimg;
						retorno = retorno.data;
						if (retorno === "erro") {
							i3GEO.janela.tempoMsg("A lente nao pode ser criada");
							return;
						}
						volta = retorno.split(",");
						nimg = volta[2];
						olente = $i('lente');
						oboxlente = $i('boxlente');
						olenteimg = $i('lenteimg');
						olenteimg.src = nimg;
						olenteimg.style.width = volta[0] * 1.5 + "px";
						olenteimg.style.height = volta[1] * 1.5 + "px";
						olente.style.zIndex = 1000;
						olenteimg.style.zIndex = 1000;
						oboxlente.style.zIndex = 1000;
						pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
						olente.style.left = pos[0] + i3GEO.navega.lente.POSICAOX + "px";
						olente.style.top = pos[1] + i3GEO.navega.lente.POSICAOY + "px";
						oboxlente.style.left = pos[0] + i3GEO.navega.lente.POSICAOX + "px";
						oboxlente.style.top = pos[1] + i3GEO.navega.lente.POSICAOY + "px";
						oboxlente.style.display = 'block';
						oboxlente.style.visibility = 'visible';
						olente.style.display = 'block';
						olente.style.visibility = 'visible';
						i3GEO.janela.fechaAguarde("ajaxabrelente");
					} catch (e) {
						i3GEO.janela.fechaAguarde();
					}
				};
				if (i3GEO.navega.lente.ESTAATIVA === "sim") {
					i3GEO.php.aplicaResolucao(temp, 1.5);
				} else {
					i3GEO.navega.lente.desativa();
				}
			},
			/**
			 * Function: desativa
			 *
			 * Desativa a lente aberta
			 */
			desativa : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.lente.desativa()");

				$i("lente").style.display = "none";
				$i("boxlente").style.display = "none";
				$i('boxlente').style.borderWidth = 0;
				i3GEO.navega.lente.ESTAATIVA = "nao";
				i3GEO.eventos.removeEventos("MOUSEMOVE",["i3GEO.navega.lente.movimenta()"]);
				i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEO.navega.lente.atualiza()"]);
			},
			/**
			 * Movimenta a imagem dentro da lente para refletir a posi&ccedil;&atilde;o do mouse
			 */
			movimenta : function() {
				try {
					if (i3GEO.navega.lente.ESTAATIVA === "sim") {
						var pos = [
							0,
							0
						], esq, topo, clipt, i;
						if ($i("lente").style.visibility === "visible") {
							pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
						}
						esq = (objposicaocursor.telax - pos[0]) * 2.25;
						topo = (objposicaocursor.telay - pos[1]) * 2.25;
						clipt = "rect(" + (topo - 120) + "px " + (esq + 120) + "px " + (topo + 120) + "px " + (esq - 120) + "px)";
						i = $i("lente").style;
						i.clip = clipt;
						i.top = pos[1] - (topo - 120) + "px";
						i.left = pos[0] - (esq - 120) + "px";
						// eval("i." + g_tipotop + "= (pos[1] - (topo - 40))");
						// eval("i." + g_tipoleft + "= (pos[0] - (esq - 40)");
					}
				} catch (e) {
				}
			}
		},
		/**
		 * Section: i3GEO.navega.destacaTema
		 *
		 * Destaca um tema mostrando-o sobre os outros em um box que segue o mouse
		 */
		destacaTema : {
			/**
			 * Propriedade: TAMANHO
			 *
			 * Tamanho do box
			 *
			 * Tipo:
			 *
			 * {Integer}
			 *
			 * Default:
			 *
			 * 75
			 */
			TAMANHO : 75,
			/**
			 * Tipo: {sim|nao}
			 */
			ESTAATIVO : "nao",
			/**
			 * Tipo: {C&oacute;digo do tema}
			 */
			TEMA : "",
			/**
			 * Function: inicia
			 *
			 * Inicia o destaque de um tema
			 *
			 * Parametros:
			 *
			 * {String} - c&oacute;digo do tema
			 */
			inicia : function(tema) {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.destacaTema.inicia()");

				var novoel, novoeli, janela, pos;
				if (!$i("img_d")) {
					pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
					novoel = document.createElement("div");
					novoel.id = "div_d";
					novoel.style.zIndex = 5000;
					document.body.appendChild(novoel);
					$i("div_d").innerHTML = "<input style='position:relative;top:0px;left:0px'' type=image src='' id='img_d' />";
					$i("div_d").style.left = parseInt(pos[0], 10) + "px";
					$i("div_d").style.top = parseInt(pos[1], 10) + "px";
					$i("img_d").style.left = 0 + "px";
					$i("img_d").style.top = 0 + "px";
					$i("img_d").style.width = i3GEO.parametros.w + "px";
					$i("img_d").style.height = i3GEO.parametros.h + "px";
					$i("div_d").style.clip = 'rect(0px 75px 75px 0px)';
					novoeli = document.createElement("div");
					novoeli.id = "div_di";
					novoel.appendChild(novoeli);
					$i("div_di").innerHTML = "<p style='position:absolute;top:0px;left:0px'>+-</p>";
				}
				i3GEO.navega.destacaTema.TEMA = tema;
				i3GEO.navega.destacaTema.ESTAATIVO = "sim";
				i3GEO.navega.destacaTema.atualiza();
				janela = i3GEO.janela.cria(160, 50, "", "center", "center", "<div class='i3GeoTituloJanela'>"+$trad("x50") + "</div>", "ativadesativaDestaque");
				$i(janela[2].id).innerHTML = $trad("x91");
				YAHOO.util.Event.addListener(janela[0].close, "click", i3GEO.navega.destacaTema.desativa);
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEO.navega.destacaTema.atualiza()"]);
				i3GEO.eventos.adicionaEventos("MOUSEMOVE",["i3GEO.navega.destacaTema.movimenta()"]);
			},
			/**
			 * Atualiza o destaque
			 *
			 * &Eacute; definido para o evento de navega&ccedil;&atilde;o do mapa
			 */
			atualiza : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.destacaTema.atualiza()");

				if (i3GEO.navega.destacaTema.ESTAATIVO === "nao") {
					return;
				}
				var temp = function(retorno) {
					var m, novoel;
					retorno = retorno.data;
					m = new Image();
					m.src = retorno;
					$i("div_d").innerHTML = "";
					$i("div_d").style.display = "block";
					novoel = document.createElement("input");
					novoel.id = "img_d";
					novoel.style.position = "relative";
					novoel.style.top = "0px";
					novoel.style.left = "0px";
					novoel.type = "image";
					novoel.src = m.src;
					novoel.style.display = "block";
					$i("div_d").appendChild(novoel);
					i3GEO.janela.fechaAguarde("ajaxdestaca");
				};
				i3GEO.php.geradestaque(temp, i3GEO.navega.destacaTema.TEMA, i3GEO.parametros.mapexten);
			},
			/**
			 * Function: desativa
			 *
			 * Desativa o destaque
			 */
			desativa : function() {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.destacaTema.desativa()");

				i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEO.navega.destacaTema.atualiza()"]);
				i3GEO.eventos.removeEventos("MOUSEMOVE",["i3GEO.navega.destacaTema.movimenta()"]);
				i3GEO.navega.destacaTema.ESTAATIVO = "nao";
				document.body.removeChild($i("div_d"));
			},
			/**
			 * Movimenta o destaque conforme o mouse move
			 *
			 * &Eacute; definido para o evento de deslocamento do mouse
			 */
			movimenta : function() {
				if (i3GEO.navega.destacaTema.ESTAATIVO === "sim") {
					$i("div_d").style.clip =
						'rect(' + (objposicaocursor.imgy - i3GEO.navega.destacaTema.TAMANHO) + "px " + (objposicaocursor.imgx - 10) + "px "
							+ (objposicaocursor.imgy - 10) + "px " + (objposicaocursor.imgx - i3GEO.navega.destacaTema.TAMANHO) + 'px)';
				}
			}
		},
		barraDeZoom : {
			cria : function() {
				alert("barraDeZoom depreciado na versao 6.0");
			}
		},
		/**
		 * Section: i3GEO.navega.dialogo
		 *
		 * Abre as telas de di&aacute;logo das op&ccedil;&otilde;es de navega&ccedil;&atilde;o no mapa atual
		 */
		dialogo : {
			/**
			 * Function: wiki
			 *
			 * Abre a janela de di&aacute;logo da ferramenta wiki permitindo a navega&ccedil;&atilde;o integrada com a Wikip&eacute;dia
			 */
			wiki : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.navega.dialogo.wiki()",
					"wiki",
					"wiki",
					"dependencias.php",
					"i3GEOF.wiki.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: metar
			 *
			 * Abre a janela de di&aacute;logo da ferramenta metar permitindo a navega&ccedil;&atilde;o integrada com a rede de dados
			 * meteorol&oacute;gicos
			 */
			metar : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.navega.dialogo.metar()",
					"metar",
					"metar",
					"dependencias.php",
					"i3GEOF.metar.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: buscaFotos
			 *
			 * Abre a janela de di&aacute;logo da ferramenta metar permitindo a navega&ccedil;&atilde;o integrada com servi&ccedil;os de
			 * armazenamento de fotografias
			 */
			buscaFotos : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.navega.dialogo.buscaFotos()", "buscafotos", "buscaFotos");
			},
			/**
			 * Function: google
			 *
			 * Abre a janela de di&aacute;logo da ferramenta google permitindo a navega&ccedil;&atilde;o integrada com o GoogleMaps
			 *
			 * Parametros:
			 *
			 * {array} - array com os pares de coordenadas x,y que ser&atilde;o adicionados ao mapa do google (opcional)
			 */
			google : function(coordenadas) {
				i3GEO.navega.dialogo.google.coordenadas = coordenadas;
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.navega.dialogo.google()");

				//i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEO.navega.atualizaGoogle()"]);
				var idgoogle = "googlemaps" + Math.random();
				i3GEO.janela.cria((i3GEO.parametros.w / 2.5) + 25 + "px", (i3GEO.parametros.h / 2.5) + 18 + "px", i3GEO.configura.locaplic
					+ "/ferramentas/googlemaps1/index.php", "", "", "<div class='i3GeoTituloJanela'>Google maps<a class=ajuda_usuario target=_blank href='"
					+ i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=68' ><b> </b></a></div>", idgoogle);
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEO.navega.atualizaGoogle('"+idgoogle+"')"]);
			},
			/**
			 * Function: confluence
			 *
			 * Abre a janela de di&aacute;logo da ferramenta confluence permitindo a navega&ccedil;&atilde;o integrada com a
			 * localiza&ccedil;&atilde;o de conflu&ecirc;ncias
			 */
			confluence : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.navega.dialogo.confluence()",
					"confluence",
					"confluence",
					"dependencias.php",
					"i3GEOF.confluence.iniciaJanelaFlutuante()");
			}
		},
		atualizaGoogle : function(idgoogle) {
			try {
				parent.frames[idgoogle + "i"].panTogoogle();
			} catch (e) {
				i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEO.navega.atualizaGoogle('"+idgoogle+"')"]);
				i3GEO.desenho.removePins("googlemaps");
				i3GEO.desenho.removePins("boxOndeGoogle");
			}
		}
	};