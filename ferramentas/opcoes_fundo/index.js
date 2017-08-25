if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.opcoesFundo
 */
i3GEOF.opcoesFundo =
	{
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
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesFundo.dicionario);
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			dicionario["asp"] = '"';
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
			if(i3GEOF.opcoesFundo.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_fundo/template_mst.html", function(template) {
					i3GEOF.opcoesFundo.MUSTACHE = template;
					i3GEOF.opcoesFundo.inicia(iddiv);
				});
				return;
			}
			try {
				i3GEOF.opcoesFundo.aguarde.visibility = "visible";
				$i(iddiv).innerHTML = i3GEOF.opcoesFundo.html();
				i3GEO.util.aplicaAquarela("i3GEOF.opcoesFundo_corpo");
				var p =
					i3GEO.configura.locaplic + "/ferramentas/opcoes_fundo/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=pegacorfundo", cp =
					new cpaint(), retorno = function(retorno) {
					i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
					if (retorno.data.erro) {
						i3GEO.janela.tempoMsg("Erro");
						return;
					}
					$i("i3GEOopcoesFundocor").value = retorno.data;
				};
				cp.set_response_type("JSON");
				cp.call(p, "corQM", retorno);
			} catch (erro) {
				i3GEO.janela.tempoMsg(erro);
			}
			if (i3GEO.Interface.ATUAL === "googlemaps") {
				i3GEO.janela.tempoMsg($trad('ajuda', i3GEOF.opcoesFundo.dicionario));
			}
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
			var ins = Mustache.render(i3GEOF.opcoesFundo.MUSTACHE, i3GEOF.opcoesFundo.mustacheHash());
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var janela, divid, titulo, cabecalho, minimiza;
			if ($i("i3GEOF.opcoesFundo")) {
				return;
			}
			cabecalho = function() {
			};
			minimiza = function() {
				i3GEO.janela.minimiza("i3GEOF.opcoesFundo",200);
			};
			// cria a janela flutuante
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p9") + "</span></div>";
			janela = i3GEO.janela.cria(
					"300px",
					"150px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.opcoesFundo",
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
					"6"
				);
			divid = janela[2].id;
			i3GEOF.opcoesFundo.aguarde = $i("i3GEOF.opcoesFundo_imagemCabecalho").style;
			i3GEOF.opcoesFundo.inicia(divid);
		},
		/*
		 * Function: executa
		 *
		 * Aplica a nova cor
		 *
		 * A cor do fundo na interface Openlayers &eacute; definida por meio de estilo, mas &eacute; necess&aacute;rio persistir a cor no
		 * mapfile existente no servidor.
		 */
		executa : function() {
			if (i3GEOF.opcoesFundo.aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.opcoesFundo.aguarde.visibility = "visible";
			var temp, cor, p, cp;
			temp = function() {
				i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
				if (i3GEO.Interface.ATUAL === "openlayers") {
					if (i3geoOL.id && $i(i3geoOL.id + "_events")) {
						$i(i3geoOL.id + "_events").style.backgroundColor = "rgb(" + $i("i3GEOopcoesFundocor").value + ")";
					}
					if (i3geoOL.id && $i(i3geoOL.id + "_OpenLayers_ViewPort")) {
						$i(i3geoOL.id + "_OpenLayers_ViewPort").style.backgroundColor = "rgb(" + $i("i3GEOopcoesFundocor").value + ")";
					}
					// para OL3
					if ($i("openlayers")) {
						$i("openlayers").style.backgroundColor = "rgb(" + $i("i3GEOopcoesFundocor").value + ")";
						i3GEO.parametros.cordefundo = $i("i3GEOopcoesFundocor").value;
					}
				}
				i3GEO.atualiza();
			};
			cor = $i("i3GEOopcoesFundocor").value;
			p =
				i3GEO.configura.locaplic + "/ferramentas/opcoes_fundo/exec.php?g_sid="
					+ i3GEO.configura.sid
					+ "&funcao=corfundo&cor="
					+ cor;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p, "corQM", temp);
		}
	};