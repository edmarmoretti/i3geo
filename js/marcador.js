/**
 * Title: Marcador
 *
 * Gerencia os marcadores espaciais que o usuario pode definir e compartilhar
 *
 * Os marcadores sao mantidos como cookies
 *
 * Namespace:
 *
 * i3GEO.marcador
 *
 *  Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_marcador.js>
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
i3GEO.marcador =
	{
		IDONDE: "",
		TEMPLATE: "",
		config: {
			"template": "templates/ferramentasSend.html"
		},
		carregaTemplates: function(){
			$.get(i3GEO.marcador.config.template, function(template) {
				i3GEO.template.marcador = template;
				i3GEO.marcador.inicia();
			});
		},
		inicia: function(obj){
			if(obj && $(obj).attr("data-template") != undefined){
				i3GEO.marcador.config.template = $(obj).attr("data-template");
			}
			if(!i3GEO.template.marcador){
				i3GEO.marcador.carregaTemplates();
				return;
			} else {
				var janela =
					i3GEO.janela.cria(
						"380px",
						"400px",
						"",
						"",
						"",
						"<span class='i3GeoTituloJanelaBsNolink' >" + $trad("x79") + "</span></div>",
						"i3GEOmarcador",
						false,
						"hd",
						"",
						"",
						"",
						true,
		                "",
		                "",
		                "",
		                ""
					);
				i3GEO.marcador.IDONDE = janela[2].id;
				i3GEO.marcador.redesenha();
			}
		},
		/**
		 * Function: prompt
		 *
		 * Pergunta ao usuario o nome do marcador e armazena O Cookie utilizado chama-se marcadoresDoI3Geo
		 */
		prompt : function() {
			i3GEO.janela.prompt($trad("x77"), i3GEO.marcador.armazena, "");
		},
		/**
		 * Armazena um novo marcador no cookie Os cookies sao separados por : O valor contem o nome seguido por = e o valor da extensao
		 * geografica
		 */
		armazena : function() {
			var cookies = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), ext = i3GEO.parametros.mapexten, nome = "Marcador", valor;
			if ($i("i3GEOjanelaprompt")) {
				nome = $i("i3GEOjanelaprompt").value;
			}
			valor = nome + "|" + ext;
			if (cookies) {
				cookies += ":";
			} else {
				cookies = "";
			}
			valor = cookies + valor;
			i3GEO.util.insereCookie("marcadoresDoI3Geo", valor, 365);
			i3GEO.marcador.redesenha();
		},
		redesenha : function() {
			var t = Mustache.to_html(
				"{{#data}}" + i3GEO.template.marcador + "{{/data}}",
				{"data":i3GEO.marcador.itensMenu()}
			);
			$("#" + i3GEO.marcador.IDONDE).html("<div class='container-fluid'>" + t + "</div>");
		},
		exporta : function() {
			var c = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), texto;
			if (!c) {
				c = "";
			}
			texto =
				"<p class=paragrafo >" + $trad("x78") + "</p><div class='i3geoForm i3geoFormIconeEdita' ><input type=text value='" + c
					+ "' onclick='javascript:this.select()'/></div>";
			i3GEO.janela.mensagemSimples(texto, $trad("x79"));
		},
		exportaShp : function() {
			var c = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), temp = function(retorno) {
				i3GEO.temaAtivo = retorno.data;
				i3GEO.atualiza();
			};
			if (c) {
				i3GEO.php.marcadores2shp(temp);
			}
		},
		importa : function() {
			var temp = function() {
				var cookies = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), novos = "";
				if ($i("i3GEOjanelaprompt")) {
					novos = $i("i3GEOjanelaprompt").value;
				}
				if (cookies) {
					cookies += ":";
				} else {
					cookies = "";
				}
				novos = cookies + novos;
				i3GEO.util.insereCookie("marcadoresDoI3Geo", novos, 365);
				i3GEO.marcador.redesenha();
			};
			i3GEO.janela.prompt($trad("x83"), temp, "");
		},
		remove : function(nomeMarcador) {
			var cookie = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), valores = cookie.split(":"), n = valores.length, i, temp, novos = [];
			for (i = 0; i < n; i++) {
				temp = valores[i].split("|");
				if (temp[0] && temp[0] !== nomeMarcador) {
					novos.push(valores[i]);
				}
			}
			i3GEO.util.insereCookie("marcadoresDoI3Geo", novos.join(":"), 365);
			i3GEO.marcador.redesenha();
		},
		recuperaZoom : function(nomeMarcador) {
			var cookie = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), valores = cookie.split(":"), n = valores.length, i, temp;
			for (i = 0; i < n; i++) {
				temp = valores[i].split("|");
				if (temp[0] && temp[0] === nomeMarcador) {
					i3GEO.navega.zoomExt("", "", "", temp[1]);
					return;
				}
			}
		},
		/**
		 * Itens para o menu suspenso
		 */
		itensMenu : function() {
			var itens = [], cookie = i3GEO.util.pegaCookie("marcadoresDoI3Geo"), valores, n, i, temp;
			itens.push({
				nome : $trad("x82"),
				url : "javascript:i3GEO.marcador.prompt()"
			}, {
				nome : $trad("x80"),
				url : "javascript:i3GEO.marcador.exporta()"
			}, {
				nome : $trad("x81"),
				url : "javascript:i3GEO.marcador.importa()"
			}, {
				nome : $trad("x84"),
				url : "javascript:i3GEO.marcador.exportaShp()"
			});
			if (cookie) {
				valores = cookie.split(":");
				n = valores.length;
				for (i = 0; i < n; i++) {
					temp = valores[i].split("|");
					if (temp.length === 2) {
						itens.push({
							nome : temp[0],
							url : "javascript:i3GEO.marcador.recuperaZoom('" + temp[0] + "')",
							opcional: "<a href='javascript:void(0)' onclick='i3GEO.marcador.remove(\"" + temp[0]
								+ "\")' class='btn btn-danger btn-fab btn-fab-mini' role='button'><span class='material-icons md-18'>delete_forever</span></a>"
						});
					}
				}
			}
			return itens;
		}
	};