/*
Title: STORYMAP

Ferramenta para definir os parâmetros de configuração de storymap

Abre apenas se o usuário estiver logado

<i3GEO.tema.dialogo.storymap>

Para testar utilize http://localhost/i3geo/ms_criamapa.php?temasa=_lreal

Arquivo:

i3geo/ferramentas/storymap/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}

/*
 * Classe: i3GEOF.storymap
 * 
 * Camadas podem ter as definicoes default de parametros armazenadas no metadata storymap Esse metadata e mantido no objeto
 * i3GEO.arvoreDeCamadas.CAMADAS
 * 
 * Os campos definidos pelo usuario podem ser salvos no mapfile caso o usuario esteja logado
 * 
 * Veja tambem i3geo/ferramentas/atalhosedicao
 */
i3GEOF.storymap =
	{
		/*
		 * Variavel: tema
		 * 
		 * Tema que ser&aacute; utilizado
		 * 
		 * Type: {string}
		 */
		tema : i3GEO.temaAtivo,
		/*
		 * Variavel: aguarde
		 * 
		 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		/*
		 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
		 */
		criaJanelaFlutuante : function() {
			i3GEOF.storymap.iniciaDicionario();
		},
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.storymap.dicionario);
			return dicionario;
		},
		/*
		 * Function: iniciaDicionario
		 * 
		 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
		 * 
		 * O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario : function() {
			if (typeof (i3GEOF.storymap.dicionario) === 'undefined') {
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic + "/ferramentas/storymap/dicionario.js",
					"i3GEOF.storymap.iniciaJanelaFlutuante()",
					"i3GEOF.storymap.dicionario_script");
			} else {
				i3GEOF.storymap.iniciaJanelaFlutuante();
			}
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
			var camada = "";
			i3GEO.janela.comboCabecalhoTemas("i3GEOFstoComboCabeca", "i3GEOFstoComboCabecaSel", "storymap", "ligadosComTabela");
			if (i3GEOF.storymap.tema === "") {
				return;
			}
			$i(iddiv).innerHTML = i3GEOF.storymap.html();
			i3GEOF.storymap.rodape();
			try {
				//
				// verifica se a camada possui definicao dos parametros
				//
				if (i3GEO.arvoreDeCamadas) {
					camada = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.storymap.tema);
				}
				// cria os combos de opcao
				var temp = function(r) {
					var combo = function(dados, idonde) {
						var n, i, ins;
						n = dados.length;
						ins = "<select id='" + idonde + "Combo' >";
						ins += "<option value='' >---</option>";
						for (i = 0; i < n; i++) {
							ins += "<option value='" + dados[i]["item"] + "' >" + dados[i]["item"] + "</option>";
						}
						ins += "</select>";
						$i(idonde).innerHTML = ins;
					};
					combo(r.data.valores, "i3GEOstocolcabecalho");
					combo(r.data.valores, "i3GEOstocoltexto");
					combo(r.data.valores, "i3GEOstocollocal");
					combo(r.data.valores, "i3GEOstocolicone");
					combo(r.data.valores, "i3GEOstocolmedia");
					combo(r.data.valores, "i3GEOstocollon");
					combo(r.data.valores, "i3GEOstocollat");
					// se os parametros da ferramenta estiverem definidos na camada
					if (camada != "" && camada.ferramentas.storymap) {
						$i("i3GEOStocabecalho").value = camada.ferramentas.storymap.cabecalho;
						$i("i3GEOStotexto").value = camada.ferramentas.storymap.texto;
						$i("i3GEOstocolcabecalhoCombo").value = camada.ferramentas.storymap.colcabecalho;
						$i("i3GEOstocoltextoCombo").value = camada.ferramentas.storymap.coltexto;
						$i("i3GEOstocollocalCombo").value = camada.ferramentas.storymap.collocal;
						$i("i3GEOstocoliconeCombo").value = camada.ferramentas.storymap.colicone;
						$i("i3GEOstocolmediaCombo").value = camada.ferramentas.storymap.colmedia;
						$i("i3GEOstocollonCombo").value = camada.ferramentas.storymap.collon;
						$i("i3GEOstocollatCombo").value = camada.ferramentas.storymap.collat;
					}
				};
				i3GEO.php.listaItensTema(temp, i3GEOF.storymap.tema);
			} catch (erro) {
				i3GEO.janela.tempoMsg(erro);
			}
		},
		rodape : function() {
			var ins =
				'<input class="paragrafo" id="i3GEOstobotao1" type="button" value="' + $trad('aplicar', i3GEOF.storymap.dicionario)
					+ '" style="cursor:pointer;color:blue"/>';
			if (i3GEO.login.verificaCookieLogin() === true) {
				ins +=
					'<input class="paragrafo" style="margin-top:3px;" id="i3GEOstobotaoSalva" type="button" value="' + $trad(
						'salvaParametros',
						i3GEOF.storymap.dicionario)
						+ '" style="cursor:pointer;color:blue"/>';
				ins +=
					'<input class="paragrafo" style="margin-top:3px;" id="i3GEOstobotaoRemove" type="button" value="' + $trad(
						'removeParametros',
						i3GEOF.storymap.dicionario)
						+ '" style="cursor:pointer;color:blue"/>';
			}
			YAHOO.i3GEO.janela.manager.find("i3GEOF.storymap").setFooter(ins);

			var b = new YAHOO.widget.Button("i3GEOstobotao1", {
				onclick : {
					fn : function() {
						window.open(i3GEO.configura.locaplic + "/ferramentas/storymap/default.php?tema=" + i3GEOF.storymap.tema);
					}
				}
			});
			b.addClass("rodar");
			$i("i3GEOstobotao1-button").style.width = "350px";
			if (i3GEO.login.verificaCookieLogin() === true) {
				$i("parametrosComLoginSto").style.display = 'block';
				b = new YAHOO.widget.Button("i3GEOstobotaoSalva", {
					onclick : {
						fn : i3GEOF.storymap.salvaParametros
					}
				});
				b.addClass("rodar");
				$i("i3GEOstobotaoSalva-button").style.width = "350px";

				b = new YAHOO.widget.Button("i3GEOstobotaoRemove", {
					onclick : {
						fn : i3GEOF.storymap.removeParametros
					}
				});
				b.addClass("rodar");
				$i("i3GEOstobotaoRemove-button").style.width = "350px";
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
			var ins = Mustache.render(i3GEOF.storymap.MUSTACHE, i3GEOF.storymap.mustacheHash());
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 * 
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function(tema) {
			i3GEOF.storymap.tema = tema;
			var minimiza, cabecalho, janela, divid, temp, titulo;
			if ($i("i3GEOF.storymap")) {
				i3GEOF.storymap.inicia("i3GEOF.storymap_corpo");
				return;
			}
			cabecalho = function() {
			};
			minimiza = function() {
				i3GEO.janela.minimiza("i3GEOF.storymap");
			};
			// cria a janela flutuante
			titulo =
				"<span class='i3GEOiconeFerramenta i3GEOiconeStorymap'></span>" + "<div  id='i3GEOFstoComboCabeca' class='comboTemasCabecalho'>   ------</div>"
					+ "<div class='i3GeoTituloJanela'>Storymap </span><a class=ajuda_usuario target=_blank href='"
					+ i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=5&idajuda=108' ><b> </b></a></div>";
			janela = i3GEO.janela.cria("380px", "320px", "", "", "", titulo, "i3GEOF.storymap", false, "hd", cabecalho, minimiza, "", true);
			divid = janela[2].id;
			i3GEOF.storymap.aguarde = $i("i3GEOF.storymap_imagemCabecalho").style;
			$i("i3GEOF.storymap_corpo").style.backgroundColor = "white";
			i3GEOF.storymap.inicia(divid);
			temp = function() {
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		},
		salvaParametros : function() {
			var j;
			j =
				'{"cabecalho":"' + $i("i3GEOStocabecalho").value
					+ '","texto":"'
					+ $i("i3GEOStotexto").value
					+ '","colcabecalho":"'
					+ $i("i3GEOstocolcabecalhoCombo").value
					+ '","coltexto":"'
					+ $i("i3GEOstocoltextoCombo").value
					+ '","collocal":"'
					+ $i("i3GEOstocollocalCombo").value
					+ '","colicone":"'
					+ $i("i3GEOstocoliconeCombo").value
					+ '","colmedia":"'
					+ $i("i3GEOstocolmediaCombo").value
					+ '","collon":"'
					+ $i("i3GEOstocollonCombo").value
					+ '","collat":"'
					+ $i("i3GEOstocollatCombo").value
					+ '"}';

			i3GEO.janela.confirma($trad("incluiPar", i3GEOF.storymap.dicionario), 300, $trad("x14"), "", function() {
				p = i3GEO.configura.locaplic + "/ferramentas/storymap/manutencao.php";
				par =
					"&g_sid=" + i3GEO.configura.sid
						+ "&tema="
						+ i3GEOF.storymap.tema
						+ "&storymap="
						+ i3GEO.util.base64encode(j)
						+ "&funcao=inclui";

				retorno = function(retorno) {
					i3GEO.janela.fechaAguarde("storymap");
				};
				i3GEO.janela.abreAguarde("storymap", $trad("o1"));
				cpJSON.call(p, "foo", retorno, par);
			});

		},
		removeParametros : function() {
			i3GEO.janela.confirma($trad("removePar", i3GEOF.storymap.dicionario), 300, $trad("x14"), "", function() {
				p = i3GEO.configura.locaplic + "/ferramentas/storymap/manutencao.php";
				par = "&g_sid=" + i3GEO.configura.sid + "&tema=" + i3GEOF.storymap.tema + "&funcao=remove";

				retorno = function(retorno) {
					i3GEO.janela.fechaAguarde("storymap");
				};
				i3GEO.janela.abreAguarde("storymap", $trad("o1"));
				cpJSON.call(p, "foo", retorno, par);
			});
		}
	};