if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.atalhoscamada
 */
i3GEOF.atalhoscamada =
{
	/**
	 * Array com os ids das janelas ja criadas
	 */
	janelas : [],
	propJanelas : {},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function(idjanela) {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.atalhoscamada.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["procurar"] = $trad("t23");
		dicionario["topo"] = $trad("t25");
		dicionario["etiquetas"] = $trad("t27");
		dicionario["filtro"] = $trad("t29");
		dicionario["tabela"] = $trad("t31");
		dicionario["grafico"] = $trad("t37");
		dicionario["editaLegenda"] = $trad("t33");
		dicionario["destaca"] = $trad("t35");
		dicionario["sql"] = $trad("t41");
		dicionario["comentar"] = $trad("t45");
		dicionario["wms"] = "WMS-OGC";
		dicionario["salvamapfile"] = $trad("t44");
		dicionario["tme"] = $trad("t49");
		dicionario["idjanela"] = idjanela;
		dicionario["idjanelaA"] = '"'+idjanela+'"';
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
	inicia : function(iddiv, idjanela) {
		var tema, temp, b, ltema, funcoes = i3GEO.arvoreDeCamadas.FUNCOES;

		tema = i3GEOF.atalhoscamada.propJanelas[idjanela].tema;
		ltema = i3GEO.arvoreDeCamadas.pegaTema(tema);

		//
		// ajusta as propriedades e funcoes caso a camada seja um plugin
		//
		ltema = i3GEO.pluginI3geo.aplicaPropriedades(ltema);
		// inclui no objeto o parametro de verificacao
		// e necessario clonar para nao alterar o original
		funcoes = i3GEO.util.cloneObj(funcoes);
		funcoes.plugini3geo = ltema.plugini3geo;
		funcoes = i3GEO.pluginI3geo.aplicaPropriedades(funcoes);

		$i(iddiv).innerHTML = i3GEOF.atalhoscamada.html(idjanela);

		if( i3GEO.login.verificaCookieLogin()){
			if (funcoes.sql === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaSql", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.editorsql(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (i3GEO.parametros.editor.toLowerCase() === "sim") {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaSalva", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.salvaMapfile(tema);
						}
					}
				});
				b.addClass("abrir");
			}
		}

		if (funcoes.tme === true) {
			b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaTme", {
				onclick : {
					fn : function() {
						i3GEO.tema.dialogo.tme(tema);
					}
				}
			});
			b.addClass("abrir");
		}

		if (funcoes.wms === true
			&& ltema.permiteogc.toLowerCase() !== "nao") {
			b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaWms", {
				onclick : {
					fn : function() {
						i3GEO.tema.dialogo.mostraWms(tema);
					}
				}
			});
			b.addClass("abrir");
		}

		if (funcoes.comentar === true
			&& ltema.permitecomentario.toLowerCase() !== "nao"
			&& i3GEO.arvoreDeTemas.OPCOESADICIONAIS.comentarios === true) {
			b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaComentar", {
				onclick : {
					fn : function() {
						i3GEO.tema.dialogo.comentario(tema);
					}
				}
			});
			b.addClass("abrir");
		}

		if (funcoes.destacar === true
			&& i3GEO.Interface.ATUAL !== "googlemaps"
			&& i3GEO.Interface.ATUAL !== "googleearth") {
			b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaDestaca", {
				onclick : {
					fn : function() {
						i3GEO.navega.destacaTema.inicia(tema);
					}
				}
			});
			b.addClass("abrir");
		}
		b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaCopia", {
			onclick : {
				fn : function() {
					i3GEO.tema.copia(tema);
				}
			}
		});
		b.addClass("rodar");

		if ((ltema.type < 3) && (ltema.connectiontype !== 7)){
			if (funcoes.procurar === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaProcurar", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.procuraratrib(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (funcoes.toponimia === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaTopo", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.toponimia(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (funcoes.etiquetas === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaEtiquetas", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.etiquetas(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (funcoes.filtrar === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaFiltro", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.filtro(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (funcoes.tabela === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaTabela", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.tabela(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (funcoes.grafico === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaGrafico", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.graficotema(tema);
						}
					}
				});
				b.addClass("abrir");
			}
			if (funcoes.storymap === true) {
				b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaStoryMap", {
					onclick : {
						fn : function() {
							i3GEO.tema.dialogo.storymap(tema);
						}
					}
				});
				b.addClass("abrir");
			}
		}
		if ((ltema.type < 4 || ltema.type === 8)
			&& funcoes.editorlegenda === true) {
			b = new YAHOO.widget.Button(idjanela+"i3GEOFatalhoscamadaEditaLegenda", {
				onclick : {
					fn : function() {
						i3GEO.tema.dialogo.editaLegenda(tema);
					}
				}
			});
			b.addClass("abrir");
		}
		if (funcoes.compartilhar === true
			&& ltema.permitecomentario.toLowerCase() !== "nao") {
			temp = i3GEO.configura.locaplic
				+ "/ms_criamapa.php?layers="
				+ ltema.name
				+ "&temasa="
				+ ltema.name;
			$i("i3GEOFatalhoscamadaCompartilhar").innerHTML = i3GEO.social.compartilhar(
				"",
				temp,
				temp,
				"semtotal");
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
	html : function(idjanela) {
		var ins = Mustache.render(i3GEOF.atalhoscamada.MUSTACHE, i3GEOF.atalhoscamada.mustacheHash(idjanela));
		return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
		var minimiza, cabecalho, janela, divid, temp, titulo, ltema, id = "atc"
			+ parseInt(
				Math.random() * 1000000,
				10);

		i3GEOF.atalhoscamada.janelas.push(id);
		i3GEOF.atalhoscamada.propJanelas[id] = {};
		i3GEOF.atalhoscamada.propJanelas[id].tema = i3GEO.temaAtivo;

		ltema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhoscamada.propJanelas[id].tema);
		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza(id);
		};
		// cria a janela flutuante
		titulo = "<div class='i3GeoTituloJanela'>" + ltema.tema + "</div>";
		janela =
			i3GEO.janela.cria(
				"280px",
				"300px",
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
				i3GEO.configura.locaplic + "/imagens/oxygen/16x16/games-config-custom.png"
			);
		divid = janela[2].id;
		if (i3GEOF.atalhoscamada.janelas.length > 1) {
			temp = janela[0].cfg.config;
			janela[0].moveTo(
				temp.x.value
					+ (i3GEOF.atalhoscamada.janelas.length * 50),
				temp.y.value
					+ (i3GEOF.atalhoscamada.janelas.length * 15));
		}
		janela[2].style.backgroundColor = "white";
		temp = function() {
			i3GEOF.atalhoscamada.janelas.remove(id);
			i3GEOF.atalhoscamada.propJanelas[id] = null;
		};
		YAHOO.util.Event.addListener(
			janela[0].close,
			"click",
			temp);
		janela[0].bringToTop();
		i3GEOF.atalhoscamada.inicia(divid, id);
	},
	/**
	 * Aplica ao objeto CAMADAS o parametro definido
	 * Esse parametro e usado na hora de salvar o mapa
	 * Para isso, a funcao salvarmapfile deve ser preparada para obter o parametro
	 * e enviar para a funcao php
	 * veja em i3GEOF.salvamapfile.salva
	 *
	 * conv indica se deve ser feita a conversao de checked para sim/nao
	 */
	metadata: function(obj,conv){
		var valor,tema;
		if(conv){
			if(obj.checked){
				valor = "sim";
			}
			else{
				valor = "nao";
			}
		}
		else{
			valor = obj.value;
		}
		tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhoscamada.tema);
		tema[obj.name] = valor;
	},
	mudaOpacidade : function(f,idjanela){
		i3GEO.tema.mudatransp(i3GEOF.atalhoscamada.propJanelas[idjanela].tema,f[0].value);
	},
	temporizador : function(f,idjanela){
		i3GEO.tema.temporizador(i3GEOF.atalhoscamada.propJanelas[idjanela].tema,f[0].value);
	},
	mudaNome : function(f,idjanela){
		i3GEO.tema.mudanome(i3GEOF.atalhoscamada.propJanelas[idjanela].tema,f[0].value);
	}
};