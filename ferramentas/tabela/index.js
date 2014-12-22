if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.tabela
 */
i3GEOF.tabela =
	{
		/**
		 * Array com os ids das janelas ja criadas
		 */
		janelas : [],
		/**
		 * Objeto com as propriedades de cada janela. A chave e o id da janela armazenado em i3GEO.tabela.janelas
		 */
		propJanelas : {},
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function(idjanela) {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.tabela.dicionario);
			dicionario["idjanela"] = idjanela;
			dicionario["idjanelaA"] = '"'+idjanela+'"';
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			dicionario["propriedades"] = $trad('p13');
			dicionario["ini"] = $inputText("", "", idjanela + 'i3GEOtabelainicio', "", 5, "1");
			dicionario["fim"] = $inputText("", "", idjanela + 'i3GEOtabelafim', "", 5, "20");
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
			var b,onButtonClick = function(p_sType, p_aArgs, botao) {
				var oMenuItem = p_aArgs[1];
				if (oMenuItem) {
					if (oMenuItem.value != "") {
						i3GEO.mapa.ativaTema(oMenuItem.value);
						botao.set("label", "<span class='cabecalhoTemas' >" + oMenuItem.cfg.getProperty("text") + "</span>&nbsp;&nbsp;");
						i3GEOF.tabela.propJanelas[idjanela].tema = oMenuItem.value;
						$i(idjanela + "_corpo").innerHTML = "";
						i3GEOF.tabela.inicia(iddiv, idjanela);
					}
				}
			};
			i3GEO.janela.comboCabecalhoTemas(
				idjanela + "i3GEOFtabelaComboCabeca",
				idjanela + "i3GEOFtabelaComboCabecaSel",
				"tabela",
				"ligadosComTabela",
				onButtonClick);
			if (i3GEOF.tabela.propJanelas[idjanela].tema === "") {
				$i(iddiv).innerHTML = "";
				return;
			}
			try {
				$i(iddiv).innerHTML = i3GEOF.tabela.html(idjanela);
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOtabelaguia1", idjanela + "i3GEOtabelaguia");
				// eventos das guias
				$i(idjanela + "i3GEOtabelaguia6").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOtabelaguia6", idjanela + "i3GEOtabelaguia");
				};
				$i(idjanela + "i3GEOtabelaguia1").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOtabelaguia1", idjanela + "i3GEOtabelaguia");
				};
				$i(idjanela + "i3GEOtabelaguia3").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOtabelaguia3", idjanela + "i3GEOtabelaguia");
					if (!$i(idjanela + "i3GEOtabelaComboItensGuia3")) {
						i3GEOF.tabela.comboItensEstat(idjanela);
					}
				};
				// relatorio
				$i(idjanela + "i3GEOtabelaguia5").onclick =
					function() {
						i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOtabelaguia5", idjanela + "i3GEOtabelaguia");
						i3GEO.util.checkItensEditaveis(i3GEOF.tabela.propJanelas[idjanela].tema, function(retorno) {
							if (retorno.tipo === "dados") {
								$i(idjanela + "i3GEOtabelaitensrelatorio").innerHTML = retorno.dados;
							}
						}, idjanela + "i3GEOtabelaitensrelatorio", "320px", "", "sim");
						i3GEO.util.comboItens(idjanela + "i3GEOtabelaagrupaItem", i3GEOF.tabela.propJanelas[idjanela].tema, function(
							retorno) {
							if (retorno.tipo === "erro") {
								$i(idjanela + "i3GEOtabelaagrupamento").innerHTML =
									"<br><br><span style='color:red'>" + $trad('erroTemaOrigem', i3GEOF.tabela.dicionario) + "</span><br><br>";
							} else {
								$i(idjanela + "i3GEOtabelaagrupamento").innerHTML = retorno.dados;
							}
						}, idjanela + "i3GEOtabelaagrupamento", "");
					};
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotao2", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.ativaSelecao(idjanela);
						}
					}
				});
				b.addClass("rodar100");
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotao3", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.limpaSelecao(idjanela);
						}
					}
				});
				b.addClass("rodar100");
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotao6", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.criaNovoTema(idjanela);
						}
					}
				});
				b.addClass("rodar100");
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotaoLista", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.pegaRegistros(idjanela);
						}
					}
				});
				b.addClass("rodar100");
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelaGraficoI", {
					onclick : {
						fn : function() {
							i3GEO.mapa.ativaTema(i3GEOF.tabela.propJanelas[idjanela].tema);
							i3GEO.analise.dialogo.graficoInterativo1();
						}
					}
				});
				b.addClass("rodar100");
				$i(idjanela + "i3GEOtabelabotaoLista-button").style.minHeight = "2em";
				$i(idjanela + "i3GEOtabelabotaoLista-button").style.padding = "0px 15px";
				$i(idjanela + "i3GEOtabelabotaoLista-button").style.lineHeight = "1.5";
				$i(idjanela + "i3GEOtabelabotaoLista").style.position = "relative";
				$i(idjanela + "i3GEOtabelabotaoLista").style.top = "2px";

				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotao4", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.estatistica(idjanela);
						}
					}
				});
				b.addClass("abrir");

				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotao7", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.relatorioTabela(idjanela);
						}
					}
				});
				b.addClass("abrir");
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotao5", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.relatorioTexto(idjanela);
						}
					}
				});
				b.addClass("abrir");
				b = new YAHOO.widget.Button(idjanela + "i3GEOtabelabotaoVinculos", {
					onclick : {
						fn : function() {
							i3GEOF.tabela.vinculos.iniciaJanelaFlutuante();
						}
					}
				});
				b.addClass("abrir100");
				i3GEO.util.mensagemAjuda(idjanela + "i3GEOtabelamen1", $i(idjanela + "i3GEOtabelamen1").innerHTML);

				if (i3GEO.parametros.r.toLowerCase() !== "sim") {
					$i(idjanela + "i3GEOtabelaguia4obj").innerHTML = $trad("x22");
				}
				i3GEOF.tabela.pegaRegistros(idjanela);
			} catch (erro) {
				i3GEO.janela.tempoMsg(erro);
			}
			i3GEO.guias.ajustaGuiaFerramenta(idjanela,idjanela+"i3GEOtabela");
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
			var ins = Mustache.render(i3GEOF.tabela.MUSTACHE, i3GEOF.tabela.mustacheHash(idjanela));
			return ins;
		},
		/*
		 * Function: criaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var minimiza, cabecalho, janela, divid, temp, titulo, id;
			id = "tabela" + parseInt(Math.random() * 1000000, 10);
			// i3GEO.janela.tempoMsg($trad('msgDadosRegiaoAtual',i3GEOF.tabela.dicionario));
			i3GEOF.tabela.janelas.push(id);
			i3GEOF.tabela.propJanelas[id] = {};
			i3GEOF.tabela.propJanelas[id].colunas = {
				"itens" : [],
				"alias" : []
			};
			i3GEOF.tabela.propJanelas[id].registros = [];
			i3GEOF.tabela.propJanelas[id].tema = i3GEO.temaAtivo;
			i3GEOF.tabela.propJanelas[id].atualiza = false;

			cabecalho = function() {
				i3GEOF.tabela.ativaFoco(id);
			};
			minimiza = function() {
				var t = i3GEO.janela.minimiza(id,"120px");
				if(t === "min"){
					$i(id + "I").style.display = "none";
					$i("i3GEOFtabelaRodape" + id).style.display = "none";
				} else {
					$i(id + "I").style.display = "block";
					$i("i3GEOFtabelaRodape" + id).style.display = "block";
				}
			};
			duplica = function() {
				i3GEOF.tabela.iniciaJanelaFlutuante();
			};
			// cria a janela flutuante
			titulo =
			"<span class='i3GEOconeFerramenta i3GEOiconeTabela' title='"+$trad('tabela', i3GEOF.tabela.dicionario)+"'></span>"
			+ "<div id='" + id + "I' style='left:10px;'>"
			+ "<div  id='" + id + "i3GEOFtabelaComboCabeca' class='comboTemasCabecalho' style='left:0px;'>   ------</div>&nbsp;&nbsp;&nbsp;" + $trad('tabela', i3GEOF.tabela.dicionario)
			+ " <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
			+ "/ajuda_usuario.php?idcategoria=5&idajuda=39' >&nbsp;&nbsp;&nbsp;</a></div></div>";

			janela =
				i3GEO.janela.cria(
					"550px",
					"400px",
					"",
					"",
					"",
					titulo,
					id,
					false,
					"hd",
					cabecalho,
					minimiza,
					function(){
						i3GEO.guias.ajustaGuiaFerramenta(id,id+"i3GEOtabela");
					},
					true,
					"",
					duplica);
			divid = janela[2].id;
			if (i3GEOF.tabela.janelas.length > 1) {
				temp = janela[0].cfg.config;
				janela[0].moveTo(temp.x.value + (i3GEOF.tabela.janelas.length * 50), temp.y.value + (i3GEOF.tabela.janelas.length * 15));
			}
			$i(id + "_corpo").style.backgroundColor = "white";
			i3GEOF.tabela.propJanelas[id].aguarde = $i(id + "_imagemCabecalho").style;
			i3GEOF.tabela.propJanelas[id].atualiza = true;
			// indica se a janela sera atualizada na navegacao
			temp = 'i3GEOF.tabela.propJanelas["' + id + '"].atualiza = this.checked';
			janela[0]
				.setFooter("<div id='i3GEOFtabelaRodape" + id + "' style=background-color:#F2F2F2; ><input class='inputsb' checked style='cursor:pointer;position:relative;top:2px;' onclick='"
					+ temp + "' type=checkbox />&nbsp;" + $trad('atualizaAoNavegar', i3GEOF.tabela.dicionario) + " (" + id + ")</div>");

			i3GEOF.tabela.inicia(divid, id);
			// inicia os eventos
			if (i3GEO.Interface.ATUAL === "openlayers") {
				if (i3GEO.eventos.NAVEGAMAPA.toString().search('i3GEOF.tabela.atualizaListaDeRegistros()') < 0) {
					i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.tabela.atualizaListaDeRegistros()");
				}
			}
			if (i3GEO.Interface.ATUAL === "googlemaps" && !tabelaDragend) {
				tabelaDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {
					i3GEOF.tabela.atualizaListaDeRegistros();
				});
				tabelaZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {
					i3GEOF.tebela.atualizaListaDeRegistros();
				});
			}
			if (i3GEO.Interface.ATUAL === "googleearth" && !tabelaDragend) {
				tabelaDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {
					i3GEOF.tabela.atualizaListaDeRegistros();
				});
			}

			temp = function() {
				i3GEOF.tabela.janelas.remove(id);
				i3GEOF.tabela.propJanelas[id] = null;
				if (i3GEOF.tabela.janelas.length === 0) {
					if (i3GEO.Interface.ATUAL === "openlayers") {
						i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.tabela.atualizaListaDeRegistros()");
					}
					if (i3GEO.Interface.ATUAL === "googlemaps") {
						google.maps.event.removeListener(tabelaDragend);
						google.maps.event.removeListener(tabelaZoomend);
					}
					if (i3GEO.Interface.ATUAL === "googleearth") {
						google.earth.removeEventListener(tabelaDragend);
					}
				}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		},
		//TODO listar mesmo os deligados
		atualizaCombosCabecalhos : function() {
			var i, id, n = i3GEOF.tabela.janelas.length;
			for (i = 0; i < n; i++) {
				id = i3GEOF.tabela.janelas[i];
				i3GEO.janela.comboCabecalhoTemas(
					id + "i3GEOFtabelaComboCabeca",
					id + "i3GEOFtabelaComboCabecaSel",
					"tabela",
					"ligadosComTabela");
			}
		},
		/**
		 * Obtem os parametros de cada janela e converte em base64. Cada janela e inserida como um item em um objeto A compactacao e
		 * utilizada para salvar as configuracoes no mapfile atual
		 */
		compactaConfig : function() {
			var c, g, par, janelas, i, n, novoid;
			par = [];
			janelas = i3GEOF.tabela.janelas;
			n = janelas.length;
			//TODO retornaConfig nao existe
			for (i = 0; i < n; i++) {
				novoid = window.prompt($trad('idDaTabela',i3GEOF.tabela.dicionario),janelas[i]);
				c = i3GEOF.tabela.retornaConfig(janelas[i],novoid);
				par.push(c);
			}
			g = YAHOO.lang.JSON.stringify(par);
			return i3GEO.util.base64encode(g);
		},
		restauraTabelas : function(par) {
			//TODO LISTAREGATIVO nao existe
			i3GEOF.tabela.LISTAREGATIVO = false;
			var n, i;
			par = i3GEO.util.base64decode(par);
			//alert(par)
			par = YAHOO.lang.JSON.parse(par);
			n = par.length;
			for (i = 0; i < n; i++) {
				i3GEOF.tabela.iniciaJanelaFlutuante(par[i]);
			}
		},
		/*
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function(id) {
			if (i3GEOF.tabela.propJanelas[id].tema !== "" && i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.tabela.propJanelas[id].tema) === "") {
				i3GEO.janela.tempoMsg($trad('temaNaoExisteMais', i3GEOF.tabela.dicionario));
			}
			var i = $i(id + "_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		},
		vinculos : {
			ligacoes : [],
			iniciaJanelaFlutuante : function() {
				var janela, titulo;
				// cria a janela flutuante
				titulo =
					"&nbsp;&nbsp;&nbsp;" + $trad("vinculos", i3GEOF.tabela.dicionario) + " <a class=ajuda_usuario target=_blank href='"
						+ i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=120' >&nbsp;&nbsp;&nbsp;</a>";
				janela =
					i3GEO.janela.cria(
						"300px",
						"300px",
						"",
						"",
						"",
						titulo,
						"i3GEOFtabelaVinculos",
						true,
						"hd",
						"",
						"",
						"",
						true,
						i3GEO.configura.locaplic + "/imagens/oxygen/16x16/edit-table-cell-merge.png");
				divid = janela[2].id;
				if (i3GEOF.tabela.janelas.length > 1) {
					temp = janela[0].cfg.config;
					janela[0]
						.moveTo(temp.x.value + (i3GEOF.tabela.janelas.length * 50), temp.y.value + (i3GEOF.tabela.janelas.length * 15));
				}
				$i("i3GEOFtabelaVinculos_corpo").style.backgroundColor = "white";
				i3GEOF.tabela.vinculos.inicia();
			},
			html : function() {
				var ins =
					"" + "	<fieldset class=subbloco >" + "		<p class=paragrafo >" + $trad('selecionaTabela', i3GEOF.tabela.dicionario) + "<br>"
						+ i3GEOF.tabela.comboJanelas("i3GEOFTabelaOpcoesAdicionaVinculoT1", "i3GEOF.tabela.vinculos.comboColunasT1()")
						+ "		<div id=i3GEOFTabelaVinculoT1Colunas style=position:relative;left:10px ></div>" + "		<p class=paragrafo >"
						+ $trad('selecionaSegundaTabela', i3GEOF.tabela.dicionario) + "<br>"
						+ i3GEOF.tabela.comboJanelas("i3GEOFTabelaOpcoesAdicionaVinculoT2", "i3GEOF.tabela.vinculos.comboColunasT2()")
						+ "		<div id=i3GEOFTabelaVinculoT2Colunas style=position:relative;left:10px ></div>"
						+ "		<p class=paragrafo ><input id=i3GEOFTabelaVinculoBotaoCriar size=25 type=button value='"
						+ $trad('criaVinculo', i3GEOF.tabela.dicionario) + "' /></p>" + "	</fieldset>"
						+ "	<fieldset class=subbloco id=i3GEOFtabelaVinculosLista >" + "	</fieldset>";
				return ins;
			},
			inicia : function() {
				$i("i3GEOFtabelaVinculos_corpo").innerHTML = i3GEOF.tabela.vinculos.html();
				new YAHOO.widget.Button(
					"i3GEOFTabelaVinculoBotaoCriar",
					{
						onclick : {
							fn : function() {
								var t1 = $i("i3GEOFTabelaOpcoesAdicionaVinculoT1").value, t2 =
									$i("i3GEOFTabelaOpcoesAdicionaVinculoT2").value, c1 =
									$i("i3GEOFTabelaOpcoesAdicionaVinculoColunaT1").value, c2 =
									$i("i3GEOFTabelaOpcoesAdicionaVinculoColunaT1").value;
								if (t1 != "" && t2 != "" && c1 != "" && c2 != "") {
									i3GEOF.tabela.vinculos.ligacoes.push({
										"t1" : t1,
										"t2" : t2,
										"c1" : c1,
										"c2" : c2
									});
								}
								i3GEOF.tabela.vinculos.lista();
							}
						}
					});
				i3GEOF.tabela.vinculos.lista();
			},
			comboColunasT1 : function() {
				var colunas =
					i3GEOF.tabela
						.comboColunas($i("i3GEOFTabelaOpcoesAdicionaVinculoT1").value, "i3GEOFTabelaOpcoesAdicionaVinculoColunaT1"), ins =
					"";
				ins = "	<p class=paragrafo >" + $trad('colunaLigacao', i3GEOF.tabela.dicionario) + "<br>" + colunas;
				$i("i3GEOFTabelaVinculoT1Colunas").innerHTML = ins;
			},
			comboColunasT2 : function() {
				var colunas =
					i3GEOF.tabela
						.comboColunas($i("i3GEOFTabelaOpcoesAdicionaVinculoT2").value, "i3GEOFTabelaOpcoesAdicionaVinculoColunaT2"), ins =
					"";
				ins = "	<p class=paragrafo >" + $trad('colunaLigacao', i3GEOF.tabela.dicionario) + "<br>" + colunas;
				$i("i3GEOFTabelaVinculoT2Colunas").innerHTML = ins;
			},
			lista : function() {
				var v = i3GEOF.tabela.vinculos.ligacoes, n = v.length, ins =
					"<p class=paragrafo ><b>" + $trad('vinculos', i3GEOF.tabela.dicionario) + "</b></p>", i;
				for (i = 0; i < n; i++) {
					ins +=
						"<p class=paragrafo ><img style='cursor:pointer;float:left;' src='" + i3GEO.configura.locaplic
							+ "/imagens/oxygen/16x16/edit-delete.png' title='excluir' onclick='i3GEOF.tabela.vinculos.excluir(\"" + i
							+ "\")' />" + v[i].t1 + " " + v[i].c1 + " -> " + v[i].t2 + " " + v[i].c2 + "<p>";
				}
				$i("i3GEOFtabelaVinculosLista").innerHTML = ins;
			},
			excluir : function(i) {
				i3GEOF.tabela.vinculos.ligacoes.splice(parseInt(i, 10), 1);
				i3GEOF.tabela.vinculos.lista();
			},
			atualizaVinculos : function(tabelaOrigem, registro, marcado) {
				var v = i3GEOF.tabela.vinculos.ligacoes, n = v.length, i, valor;
				if (n > 0) {
					for (i = 0; i < n; i++) {
						// verifica se o vinculo existe
						if (v[i].t1 === tabelaOrigem) {
							// pega o valor do registro na tabela origem
							valor = i3GEOF.tabela.vinculos.pegaValorRegistro(v[i].t1, v[i].c1, registro);
							// marca o registro na tabela destino
							i3GEOF.tabela.vinculos.registro(v[i].t2, v[i].c2, valor, marcado);
						}
						if (v[i].t2 === tabelaOrigem) {
							// pega o valor do registro na tabela origem
							valor = i3GEOF.tabela.vinculos.pegaValorRegistro(v[i].t2, v[i].c2, registro);
							// marca o registro na tabela destino
							i3GEOF.tabela.vinculos.registro(v[i].t1, v[i].c1, valor, marcado);
						}
					}
				}
			},
			// verifica qtas colunas devem ser puladas em cada linha
			colunasVazias : function(idjanela) {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), linhas = tabela.getElementsByTagName("tr"), pular = 0, colunas, n, i;
				colunas = linhas[0].getElementsByTagName("td");
				n = colunas.length;
				for (i = 0; i < n; i++) {
					if (colunas[i].innerHTML == "") {
						pular++;
					}
				}
				return pular;
			},
			// pega o indice de uma coluna em uma tabela buscando no cabecalho
			// no valor de title em cada celula
			indiceColuna : function(idjanela, t) {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), linhas = tabela.getElementsByTagName("tr"), linha = linhas[0], colunas =
					linha.getElementsByTagName("td"), indice = 0, n = colunas.length, i, s;
				for (i = 0; i < n; i++) {
					s = colunas[i].getElementsByTagName("span");
					if (s && s[0] && s[0].title && s[0].title == t) {
						return i;
					}
				}
				return indice;
			},
			// retorna o indice de uma coluna que contem a tag input na tabela
			// com a lista de valores
			indiceColunaInput : function(idjanela) {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), linhas = tabela.getElementsByTagName("tr"), linha = linhas[1], colunas =
					linha.getElementsByTagName("td"), indice = 0, n = colunas.length, i;
				for (i = 0; i < n; i++) {
					if (colunas[i].getElementsByTagName("input").length > 0) {
						return i;
					}
				}
				return indice;
			},
			// pega o valor da coluna em uma tabela com a lista de valores com
			// base no codigo do registro
			pegaValorRegistro : function(idjanela, coluna, registro) {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), linhas = tabela.getElementsByTagName("tr"), n = linhas.length, indiceColuna =
					i3GEOF.tabela.vinculos.indiceColuna(idjanela, coluna), indiceColunaInput =
					i3GEOF.tabela.vinculos.indiceColunaInput(idjanela), i, linha, colunas;
				for (i = 1; i < n; i++) {
					linha = linhas[i];
					colunas = linha.getElementsByTagName("td");
					if (colunas[indiceColunaInput].getElementsByTagName("input")[0].name == registro) {
						return colunas[indiceColuna].innerHTML;
					}
				}
				return "";
			},
			registro : function(idjanela, coluna, valor, marcado) {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), linhas = tabela.getElementsByTagName("tr"), n = linhas.length, indiceColuna =
					i3GEOF.tabela.vinculos.indiceColuna(idjanela, coluna), indiceColunaInput =
					i3GEOF.tabela.vinculos.indiceColunaInput(idjanela), i, linha, colunas, reg;
				for (i = 1; i < n; i++) {
					linha = linhas[i];
					colunas = linha.getElementsByTagName("td");
					if (colunas[indiceColuna].innerHTML == valor) {
						reg = colunas[indiceColunaInput].getElementsByTagName("input")[0];
						reg.checked = marcado;
						i3GEOF.tabela.propJanelas[idjanela].registros[reg.name] = marcado;
					}
				}
			},
		},
		comboJanelas : function(idcombo, funcao, w) {
			var i, n = i3GEOF.tabela.janelas.length;
			if (!funcao) {
				funcao = "";
			}
			if (!w) {
				w = 260;
			}
			ins =
				"" + "	<select style='width:" + w + "px;' id='" + idcombo + "' onchange='" + funcao + "'>"
					+ "	<option value='' >---</option>";
			for (i = 0; i < n; i++) {
				ins += "<option value='" + i3GEOF.tabela.janelas[i] + "' >" + i3GEOF.tabela.janelas[i] + "</option>";
			}
			ins += "</select>";
			return ins;
		},
		comboColunas : function(idJanela, idcombo, funcao, w) {
			var i, c = i3GEOF.tabela.propJanelas[idJanela].colunas, n = c.itens.length;
			if (!funcao) {
				funcao = "";
			}
			if (!w) {
				w = 250;
			}
			ins =
				"" + "	<select style='width:" + w + "px;' id='" + idcombo + "' onchange='" + funcao + "'>"
					+ "	<option value='' >---</option>";
			for (i = 0; i < n; i++) {
				ins += "<option value='" + c.itens[i] + "' >" + c.alias[i] + "</option>";
			}
			ins += "</select>";
			return ins;
		},
		/*
		 * Function: ativaAutoAtualiza
		 *
		 * Ativa ou desativa a atualiza&ccedil;&atilde;o autom&aacute;tica da tabela quando o usu&aacute;rio navega no mapa
		 */
		atualizaListaDeRegistros : function() {
			var i, janelas = i3GEOF.tabela.janelas, propJanelas = i3GEOF.tabela.propJanelas, n = janelas.length;
			for (i = 0; i < n; i++) {
				if (propJanelas[janelas[i]].atualiza === true) {
					i3GEOF.tabela.pegaRegistros(janelas[i]);
				}
			}
		},
		/*
		 * Function: pegaRegistros
		 *
		 * Pega os registros da tabela de atributos do tema
		 *
		 * Veja:
		 *
		 * <LISTAREGISTROS>
		 */
		pegaRegistros : function(idjanela, tipolista, dadosDaClasse, inicio, fim, funcao) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			if (!idjanela) {
				idjanela = "";
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			$i(idjanela + "i3GEOtabelaregistros").innerHTML = "";
			var p, ext, tiporeg = "brasil", cp = new cpaint();
			// verifica se esta no modo de atualizacao automatica
			if (i3GEOF.tabela.propJanelas[idjanela].atualiza === true) {
				tiporeg = "mapa";
			}
			if (!tipolista) {
				if ($i(idjanela + "i3GEOtabelatipolista").checked) {
					tipolista = "selecionados";
				} else {
					tipolista = "tudo";
				}
			}
			if (!dadosDaClasse) {
				if ($i(idjanela + "i3GEOtabelalegenda").checked) {
					dadosDaClasse = "sim";
				} else {
					dadosDaClasse = "nao";
				}
			}
			if (!inicio) {
				inicio = $i(idjanela + "i3GEOtabelainicio").value - 1;
			} else {
				inicio = "";
			}
			if (!fim) {
				fim = $i(idjanela + "i3GEOtabelafim").value - 1;
			} else {
				fim = "";
			}
			if (!funcao) {
				funcao = function(retorno) {
					i3GEOF.tabela.propJanelas[idjanela].registros = [];
					i3GEOF.tabela.montaTabela(retorno, idjanela);
				};
			}
			ext = i3GEO.parametros.mapexten;
			ext = i3GEO.util.extOSM2Geo(ext);
			p =
				i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid=" + i3GEO.configura.sid + "&funcao=listaregistros"
					+ "&inicio=" + inicio + "&fim=" + fim + "&tema=" + i3GEOF.tabela.propJanelas[idjanela].tema + "&tipo=" + tiporeg
					+ "&tipolista=" + tipolista + "&ext=" + ext + "&dadosDaClasse=" + dadosDaClasse;
			cp.set_response_type("JSON");
			cp.call(p, "listaRegistros", funcao);
		},
		/*
		 * Function: montaTabela
		 *
		 * Monta a visualiza&ccedil;&atilde;o da tabela de atributos
		 */
		montaTabela : function(retorno, idjanela) {
			if (retorno.data !== undefined) {
				var ins, i, vals, cor, j, n, stat, imagem, registros = i3GEOF.tabela.propJanelas[idjanela].registros, i3GEOtabelalegenda =
					$i(idjanela + "i3GEOtabelalegenda").checked;
				// cabecalho da tabela
				ins = "<table id=" + idjanela + "i3GEOtabelatabelai class=lista8 >";
				ins +=
					"<tr><td style='background-color:yellow'></td><td style='background-color:yellow'></td><td style='background-color:yellow'></td><td style='background-color:yellow'></td>";
				i3GEOF.tabela.propJanelas[idjanela].colunas = {
					"itens" : retorno.data[0].itens,
					"alias" : retorno.data[0].alias
				};
				n = retorno.data[0].itens.length;
				for (i = 0; i < n; i++) {
					ins +=
						"<td accessKey='" + (i * 1 + 4) + "' style='background-color:yellow' >"
							+ "<img style=cursor:pointer onclick='i3GEOF.tabela.excluiColuna(this," + (i * 1 + 4) + ",\"" + idjanela
							+ "\")' src='" + i3GEO.configura.locaplic + "/imagens/x.gif' title='" + $trad("t12") + "' />&nbsp;"
							+ "<img style=cursor:pointer onclick='i3GEOF.tabela.ordenaColuna(this," + (i * 1 + 4) + ",\"" + idjanela
							+ "\")' src='" + i3GEO.configura.locaplic + "/imagens/ordena1.gif' title='"
							+ $trad('ordena', i3GEOF.tabela.dicionario) + "' /><br><span title='" + retorno.data[0].itens[i] + "'> <b>"
							+ retorno.data[0].alias[i] + "</b></span></td>";
				}
				ins += "</tr>";
				cor = "linha";
				n = retorno.data[1].registros.length;
				if ($i(idjanela + "i3GEOtabelafim").value === "") {
					$i(idjanela + "i3GEOtabelafim").value = n - 1;
				}
				for (i = 0; i < n; i++) {
					ins +=
						"<tr><td><img style=cursor:pointer onclick='i3GEOF.tabela.excluiLinha(this,\"" + idjanela + "\")' src='"
							+ i3GEO.configura.locaplic + "/imagens/x.gif' title='" + $trad("t12") + "' /></td>";
					ins += "<td>";
					if (retorno.data[1].registros[i].ext && retorno.data[1].registros[i].ext != "") {
						ins +=
							"<img style=cursor:pointer onclick='i3GEOF.tabela.zoomExt(\"" + retorno.data[1].registros[i].ext + "\",\""
								+ idjanela + "\")' src='" + i3GEO.configura.locaplic + "/imagens/o.gif' title='zoom' ids="
								+ retorno.data[1].registros[i].indice + " />";
					}
					ins += "</td>";
					stat = "";
					if (retorno.data[1].registros[i].status === "CHECKED") {
						stat = "CHECKED";
					}
					if (registros[retorno.data[1].registros[i].indice]) {
						if (registros[retorno.data[1].registros[i].indice] === true) {
							stat = "CHECKED";
						} else {
							stat = "";
						}
					}
					ins +=
						"<td><input title='marca' onclick='i3GEOF.tabela.registraLinha(this,\"" + idjanela
							+ "\")' style='cursor:pointer;border:0px solid white;' type='checkbox' " + stat + "  name="
							+ retorno.data[1].registros[i].indice + " /></td>";
					if (i3GEOtabelalegenda == true) {
						imagem = retorno.data.legenda[retorno.data[1].registros[i].classe["indice"]];
						ins += "<td><img title='" + retorno.data[1].registros[i].classe["nome"] + "' src='" + imagem + "' /></td>";
					} else {
						ins += "<td></td>";
					}
					if (stat === "CHECKED") {
						registros[retorno.data[1].registros[i].indice] = true;
					}
					vals = retorno.data[1].registros[i].valores;
					for (j = 0; j < vals.length; j++) {
						ins += "<td class='" + cor + "'>" + vals[j].valor + "</td>";
					}
					if (cor === "linha") {
						cor = "linha1";
					} else {
						cor = "linha";
					}
				}
				$i(idjanela + "i3GEOtabelaregistros").innerHTML = ins;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		/*
		 * Function: mais
		 *
		 * Avan&ccedil;a o contador de registros para a listagem
		 */
		mais : function(idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			var i = $i(idjanela + "i3GEOtabelainicio").value * 1, f = $i(idjanela + "i3GEOtabelafim").value * 1, d = f - i;
			$i(idjanela + "i3GEOtabelainicio").value = f + 1;
			$i(idjanela + "i3GEOtabelafim").value = f + d + 1;
			i3GEOF.tabela.pegaRegistros(idjanela);
		},
		/*
		 * Function: todos
		 *
		 * Avan&ccedil;a o contador de registros para o fim da listagem
		 */
		todos : function(idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			$i(idjanela + "i3GEOtabelainicio").value = 1;
			$i(idjanela + "i3GEOtabelafim").value = "";
			i3GEOF.tabela.pegaRegistros(idjanela, false, false, false, 1, true);
		},
		/*
		 * Function: menos
		 *
		 * Retrocede o contador de registros para a listagem
		 */
		menos : function(idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			var i = $i(idjanela + "i3GEOtabelainicio").value * 1, f = $i(idjanela + "i3GEOtabelafim").value * 1, d = f - i;
			$i(idjanela + "i3GEOtabelainicio").value = i - d - 1;
			$i(idjanela + "i3GEOtabelafim").value = i - 1;
			if ($i(idjanela + "i3GEOtabelainicio").value < 1) {
				$i(idjanela + "i3GEOtabelainicio").value = 1;
				$i(idjanela + "i3GEOtabelafim").value = 1 + d;
			}
			i3GEOF.tabela.pegaRegistros(idjanela);
		},
		/*
		 * Function: excluiColuna
		 *
		 * Exclui uma coluna da visualiza&ccedil;&atilde;o da tabela
		 */
		excluiColuna : function(coluna, cid, idjanela) {
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			try {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), trs, tds, i, t, nt, ni;
				// pega o indice correto
				tds = coluna.parentNode.parentNode.getElementsByTagName("td");
				nt = tds.length;
				for (t = 0; t < nt; t++) {
					if (tds[t].accessKey == cid) {
						cid = t;
						break;
					}
				}
				trs = tabela.getElementsByTagName("tr");
				nt = trs.length;
				for (t = 0; t < nt; t++) {
					i = trs[t];
					if (i.getElementsByTagName("td")[cid]) {
						ni = i.getElementsByTagName("td")[cid];
						i.removeChild(ni);
					}
				}
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
			} catch (e) {
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				if (typeof (console) !== 'undefined') {
					console.error(e);
				}
			}
		},
		/*
		 * Function: ordenaColuna
		 *
		 * Ordena uma coluna da tabela
		 */
		ordenaColuna : function(coluna, cid, idjanela) {
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			try {
				var tabela = $i(idjanela + "i3GEOtabelatabelai"), trs = tabela.getElementsByTagName("tr"), ntrs = trs.length, tds, nt, conta =
					0, psort = [], t, psortfim, npsortfim, ins, p, e;
				// pega o indice correto
				tds = coluna.parentNode.parentNode.getElementsByTagName("td");
				nt = tds.length;
				for (t = 0; t < nt; t++) {
					if (tds[t].accessKey == cid) {
						cid = t;
						break;
					}
				}
				for (t = 0; t < ntrs; t++) {
					if (t < ntrs) {
						if (trs[t].childNodes[cid].innerHTML) {
							if (trs[t].childNodes[cid].innerHTML !== "undefined") {
								psort[conta] = trs[t].childNodes[cid].innerHTML + "+" + conta;
								conta = conta + 1;
							}
						}
					}
				}
				// recosntroi a tabela
				psortfim = psort.sort();
				ins = "<table id=" + idjanela + "i3GEOtabelatabelai class=lista8 >";
				npsortfim = psortfim.length;
				for (p = 0; p < npsortfim; p++) {
					e = psortfim[p].split("+")[1] * 1;
					if (trs[e] !== undefined) {
						ins += "<tr>" + trs[e].innerHTML + "</tr>";
					}
				}
				$i(idjanela + "i3GEOtabelaregistros").innerHTML = ins + "</table>";
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
			} catch (e) {
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				if (typeof (console) !== 'undefined') {
					console.error(e);
				}
			}
		},
		excluiLinha : function(celula) {
			var p = celula.parentNode.parentNode;
			do {
				p.removeChild(p.childNodes[0]);
			} while (p.childNodes.length > 0);
			p.parentNode.removeChild(p);
		},
		zoomExt : function(ext, idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			var funcao = function() {
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				i3GEOF.tabela.pegaRegistros(idjanela);
				i3GEO.atualiza();
			};
			i3GEO.php.mudaext(funcao, "nenhum", ext);
		},
		registraLinha : function(linha, idjanela) {
			i3GEOF.tabela.propJanelas[idjanela].registros[linha.name] = linha.checked;
			i3GEOF.tabela.vinculos.atualizaVinculos(idjanela, linha.name, linha.checked);
		},
		/*
		 * Function: listaMarcados
		 *
		 * Retorna um array com os &iacute;ndices dos registros que est&atilde;o marcados.
		 */
		listaMarcados : function(idjanela) {
			var lista = [], registros = i3GEOF.tabela.propJanelas[idjanela].registros, i, n = registros.length;
			for (i = 0; i < n; i++) {
				if (registros[i] === true) {
					lista.push(i);
				}
			}
			return lista;
		},
		/*
		 * Function: ativaSelecao
		 *
		 * Seleciona no mapa os elementos que estiverem marcados na guia 2
		 *
		 * Veja:
		 *
		 * <INCLUISEL>
		 */
		ativaSelecao : function(idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			var lista = i3GEOF.tabela.listaMarcados(idjanela), p, cp, temp = function(retorno) {
				if (retorno) {
					i3GEO.Interface.atualizaTema(retorno, i3GEOF.tabela.propJanelas[idjanela].tema);
					i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				}
			};
			p =
				i3GEO.configura.locaplic + "/ferramentas/tabela/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=incluisel&tema="
					+ i3GEOF.tabela.propJanelas[idjanela].tema + "&ids=" + lista.toString();
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p, "incluiSel", temp);
		},
		/*
		 * Function: limpaSelecao
		 *
		 * Limpa a sele&ccedil;&atilde;o do tema da tabela
		 */
		limpaSelecao : function(idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			i3GEO.tema.limpasel(i3GEOF.tabela.propJanelas[idjanela].tema);
			i3GEOF.tabela.propJanelas[idjanela].registros = [];
			var lista = $i(idjanela + "i3GEOtabelatabelai").getElementsByTagName("input"), n = lista.length, i;
			for (i = 0; i < n; i++) {
				lista[i].checked = false;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		/*
		 * Function: criaNovoTema
		 *
		 * Cria um novo tema contendo a sele&ccedil;&atilde;o existente
		 */
		criaNovoTema : function(idjanela) {
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			var temp = function(retorno) {
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
			};
			i3GEO.php.criatemaSel(temp, i3GEOF.tabela.propJanelas[idjanela].tema);
		},
		/*
		 * Function: comboItens
		 *
		 * Cria um combo para selecionar um item do tema escolhido
		 */
		comboItensEstat : function(idjanela) {
			var tema = i3GEOF.tabela.propJanelas[idjanela].tema;
			i3GEO.util.comboItens(idjanela + "i3GEOtabelaComboItensGuia3", tema, function(retorno) {
				if (retorno.tipo === "erro") {
					$i(idjanela + "i3GEOtabelaitensGuia3").innerHTML =
						"<br><br><span style='color:red'>" + $trad('erroTemaOrigem2', i3GEOF.tabela.dicionario) + "</span><br><br>";
				} else {
					$i(idjanela + "i3GEOtabelaitensGuia3").innerHTML = retorno.dados;
				}
			}, idjanela + "i3GEOtabelaitensGuia3", "");
		},
		estatistica : function(idjanela) {
			if ($i(idjanela + "i3GEOtabelaComboItensGuia3").value === "") {
				i3GEO.janela.tempoMsg("Escolha um item!");
				return;
			}
			if (i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			try {
				var monta = function(retorno) {
					var ins = "", nome, valor, i, n;
					if (retorno.data.indices !== undefined) {
						if (retorno.data.indices) {
							n = retorno.data.indices.length;
							for (i = 0; i < n; i++) {
								nome = eval("retorno.data.variaveis." + retorno.data.indices[i]);
								valor = eval("retorno.data.valores." + retorno.data.indices[i]);
								ins += "<p style='text-align:left'> <span style='color:gray'>" + nome + ": </span>" + valor + "</p>";
							}
						}
					} else {
						ins = retorno.data;
					}
					$i(idjanela + "i3GEOtabelaoperacoes").innerHTML = ins + "<br>";
					i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				}, exclui = "", cp = new cpaint(), p;
				if ($i(idjanela + "i3GEOtabelafiltro1").value !== "") {
					exclui = $i("i3GEOtabelafiltro1").value;
				}
				p =
					i3GEO.configura.locaplic + "/ferramentas/tabela/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=estatistica&item="
						+ $i(idjanela + "i3GEOtabelaComboItensGuia3").value + "&tema=" + i3GEOF.tabela.propJanelas[idjanela].tema
						+ "&exclui=" + exclui + "&ext=" + i3GEO.parametros.mapexten;
				cp.set_response_type("JSON");
				cp.call(p, "estatDescritivas", monta);
			} catch (e) {
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				$i("operacoes").innerHTML = "Ocorreu um erro: " + e;
			}
		},
		tabelaTexto : function() {
		},
		/*
		 * Function: relatorioTabela
		 *
		 * Monta o relat&oacute;rio padr&atilde;o em uma nova janela
		 */
		relatorioTabela : function(idjanela) {
			try {
				$i(idjanela + "i3GEOtabelatiporelh").value = "";
				$i(idjanela + "i3GEOtabelaarearelh").value = $i(idjanela + "i3GEOtabelacalculaarea").checked;
				$i(idjanela + "i3GEOtabelastatrelh").value = $i(idjanela + "i3GEOtabelacalculaestat").checked;
				$i(idjanela + "i3GEOtabelaexcluirvalorh").value = $i(idjanela + "i3GEOtabelaexcestat").value;
				$i(idjanela + "i3GEOtabelatemarelh").value = i3GEOF.tabela.propJanelas[idjanela].tema;
				$i(idjanela + "i3GEOtabelag_sidh").value = i3GEO.configura.sid;
				$i(idjanela + "i3GEOtabelaitemagruparelh").value = $i(idjanela + "i3GEOtabelaagrupaItem").value;
				var inputs = $i(idjanela + "i3GEOtabelaitensrelatorio").getElementsByTagName("input"), listai = [], listaordem = [], listanomes =
					[], nome, ordem, i, temp, n = inputs.length;
				for (i = 0; i < n; i++) {
					if (inputs[i].type === "checkbox" && inputs[i].checked == true) {
						listai.push(inputs[i].id + ";" + inputs[i].name);
						nome = $i(inputs[i].id + inputs[i].name).value;
						listanomes.push(nome);
						ordem = $i("ordem_" + inputs[i].id + inputs[i].name).value;
						if (ordem === "") {
							ordem = 0;
						}
						listaordem.push(ordem);
					}
				}
				$i(idjanela + "i3GEOtabelaordemrel").value = listaordem;
				$i(idjanela + "i3GEOtabelanomesrelh").value = listanomes;
				$i(idjanela + "i3GEOtabelaitensrelh").value = listai;
				temp = $i(idjanela + "i3GEOtabelarelatorio").action;
				$i(idjanela + "i3GEOtabelarelatorio").action += "?ext=" + i3GEO.parametros.mapexten;
				$i(idjanela + "i3GEOtabelarelatorio").submit();
				$i(idjanela + "i3GEOtabelarelatorio").action = temp;
			} catch (e) {
				i3GEO.janela.tempoMsg(e);
			}
		},
		/*
		 * Function: relatorioTexto
		 *
		 * Gera o relat&oacute;rio no formato CSV
		 */
		relatorioTexto : function() {
			try {
				$i("i3GEOtabelaarearelh").value = $i("i3GEOtabelacalculaarea").checked;
				$i("i3GEOtabelastatrelh").value = $i("i3GEOtabelacalculaestat").checked;
				$i("i3GEOtabelaexcluirvalorh").value = $i("i3GEOtabelaexcestat").value;
				$i("i3GEOtabelatemarelh").value = i3GEOF.tabela.tema;
				$i("i3GEOtabelag_sidh").value = i3GEO.configura.sid;
				$i("i3GEOtabelaitemagruparelh").value = $i("i3GEOtabelaagrupaItem").value;
				$i("i3GEOtabelatiporelh").value = "csv";
				var inputs = $i("i3GEOtabelaitensrelatorio").getElementsByTagName("input"), listai = [], listanomes = [], nome, i, temp, n =
					inputs.length;
				for (i = 0; i < n; i++) {
					if (inputs[i].checked === true) {
						listai.push(inputs[i].id + ";" + inputs[i].name);
						nome = $i(inputs[i].id + inputs[i].name).value;
						listanomes.push(nome);
					}
				}
				$i("i3GEOtabelanomesrelh").value = listanomes;
				$i("i3GEOtabelaitensrelh").value = listai;
				temp = $i("i3GEOtabelarelatorio").action;
				$i("i3GEOtabelarelatorio").action += "?ext=" + i3GEO.parametros.mapexten;
				$i("i3GEOtabelarelatorio").submit();
				$i("i3GEOtabelarelatorio").action = temp;
			} catch (e) {
				i3GEO.janela.tempoMsg(e);
			}
		}
	};