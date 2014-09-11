/**
 * Title: markercluster
 *
 * Gera um mapa de pontos agrupados baseado em uma camada existente no mapa.
 *
 * Veja em classesjs/classe_plugini3geo.js
 *
 * A ferramenta altera o mapfile em uso clonando o mapfile escolhido e
 * adicionando os metadados necess&aacute;rios ao uso do markercluster
 *
 * Veja:
 *
 * <i3GEO.analise.dialogo.markercluster>
 *
 * Arquivo:
 *
 * i3geo/ferramentas/markercluster/index.js.php
 *
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente
 * Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja
 * &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA
 * FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral
 * do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
i3GEOF.markercluster = {
	/**
	 * Variavel: aguarde
	 *
	 * Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da
	 * janela.
	 */
	aguarde : "",
	/**
	 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o
	 * tinha dicion&aacute;rio
	 */
	criaJanelaFlutuante : function() {
		i3GEOF.markercluster.iniciaDicionario();
	},
	/**
	 * Function: iniciaDicionario
	 *
	 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a
	 * ferramenta
	 *
	 * O Javascript &eacute; carregado com o id
	 * i3GEOF.nomedaferramenta.dicionario_script
	 */
	iniciaDicionario : function() {
		if (typeof (i3GEOF.markercluster.dicionario) === 'undefined') {
			i3GEO.util.scriptTag(
					i3GEO.configura.locaplic
							+ "/ferramentas/markercluster/dicionario.js",
					"i3GEOF.markercluster.iniciaJanelaFlutuante()",
					"i3GEOF.markercluster.dicionario_script");
		} else {
			i3GEOF.markercluster.iniciaJanelaFlutuante();
		}
	},
	/**
	 * Function: inicia
	 *
	 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	 *
	 * Parametro:
	 *
	 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da
	 * ferramenta
	 */
	inicia : function(iddiv) {
		try {
			$i(iddiv).innerHTML += i3GEOF.markercluster.html();
			i3GEOF.markercluster.t0();
		} catch (erro) {
			i3GEO.janela.tempoMsg(erro);
		}
	},
	/**
	 * Function: html
	 *
	 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das
	 * op&ccedil;&otilde;es da ferramenta
	 *
	 * Retorno:
	 *
	 * String com o c&oacute;digo html
	 */
	html : function() {
		var ins = '';
		ins += '<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOmarkerclusterresultado" >';
		ins += '</div>';
		ins += '<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOmarkerclusterfim" >';
		ins += '</div>';
		return ins;
	},
	/**
	 * Function: iniciaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
		var janela, divid, temp, titulo;
		// cria a janela flutuante
		titulo = $trad("x104")
				+ " <a class=ajuda_usuario target=_blank href='"
				+ i3GEO.configura.locaplic
				+ "/ajuda_usuario.php?idcategoria=3&idajuda=123' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function() {
		};
		janela = i3GEO.janela.cria(
				"400px",
				"250px",
				"",
				"",
				"",
				titulo,
				"i3GEOF.markercluster",
				false,
				"hd",
				function() {
				},
				function() {
					i3GEO.janela.minimiza("i3GEOF.markercluster");
				},
				"",
				false,
				i3GEO.configura.locaplic
						+ "/imagens/oxygen/16x16/accessories-calculator.png");
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.markercluster_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.markercluster.aguarde = $i("i3GEOF.markercluster_imagemCabecalho").style;
		i3GEOF.markercluster.inicia(divid);
		temp = function() {
			// i3GEO.janela.tempoMsg("oi");
			if (i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search(
					"i3GEOF.markercluster.t0()") > 0) {
				i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.markercluster.t0()");
			}
		};
		YAHOO.util.Event.addListener(
				janela[0].close,
				"click",
				temp);
		if (i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search(
				"i3GEOF.markercluster.t0()") < 0) {
			i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.markercluster.t0()");
		}
	},
	t0 : function() {
		var ins = "<img class=i3GeoExemploImg src='"
				+ i3GEO.configura.locaplic
				+ "/ferramentas/markercluster/exemplo.png' />"
				+ "<p class='paragrafo' >"
				+ $trad(
						1,
						i3GEOF.markercluster.dicionario)
				+ "<p class='paragrafo' >"
				+ $trad(
						2,
						i3GEOF.markercluster.dicionario);
		i3GEO.util.proximoAnterior(
				"",
				"i3GEOF.markercluster.t1()",
				ins,
				"i3GEOFgradeDePontost0",
				"i3GEOmarkerclusterresultado",
				true,
				"i3GEOF.markercluster_rodape");
	},
	t1 : function() {
		var ins = "<p class='paragrafo'>"
				+ $trad(
						3,
						i3GEOF.markercluster.dicionario)
				+ ":";
		ins += "<div class=styled-select id='i3GEOmarkerclusterSelTemas' ></div>";
		i3GEO.util.proximoAnterior(
				"i3GEOF.markercluster.t0()",
				"i3GEOF.markercluster.t2()",
				ins,
				"i3GEOF.markercluster.t1",
				"i3GEOmarkerclusterresultado",
				true,
				"i3GEOF.markercluster_rodape");
		i3GEOF.markercluster.comboTemasSel();
	},
	t2 : function() {
		var ins = "<p class='paragrafo'>"
				+ $trad(
						12,
						i3GEOF.markercluster.dicionario);
		ins += "<br></p><div class=styled-select ><input onclick='javascript:this.select();' class=digitar id='i3GEOmarkerclusterTitulo' type=text value='Mapa de agrupamento'/></div>";

		ins += "<br><p class='paragrafo' >"
				+ $trad(
						13,
						i3GEOF.markercluster.dicionario);
		ins += "</p><div class=styled-select ><input onclick='javascript:this.select();' class=digitar id='i3GEOmarkerclusterRaio' type=text value='50'/></div>";

		ins += "<br><p class='paragrafo' >"
				+ $trad(
						14,
						i3GEOF.markercluster.dicionario);
		ins += "</p><div class=styled-select ><input onclick='javascript:this.select();' class=digitar id='i3GEOmarkerclusterOpacidade' type=text value='50'/></div>";

		i3GEO.util.proximoAnterior(
				"i3GEOF.markercluster.t1()",
				"i3GEOF.markercluster.t3()",
				ins,
				"i3GEOF.markercluster.t2",
				"i3GEOmarkerclusterresultado",
				true,
				"i3GEOF.markercluster_rodape");
		i3GEOF.markercluster.comboItens();
	},
	t3 : function() {
		var ins = "<p class='paragrafo'>"
				+ $trad(
						6,
						i3GEOF.markercluster.dicionario);
		ins += "<br><br><input id=i3GEOmarkerclusterbotao1 type='button' value='"
				+ $trad(
						7,
						i3GEOF.markercluster.dicionario)
				+ "' />";
		i3GEO.util.proximoAnterior(
				"i3GEOF.markercluster.t2()",
				"",
				ins,
				"i3GEOF.markercluster.t3",
				"i3GEOmarkerclusterresultado",
				true,
				"i3GEOF.markercluster_rodape");
		new YAHOO.widget.Button("i3GEOmarkerclusterbotao1", {
			onclick : {
				fn : i3GEOF.markercluster.criamarkercluster
			}
		});
	},
	/**
	 * Function: criamarkercluster
	 *
	 * Executa a opera&ccedil;&atilde;o de gera&ccedil;&atilde;o do markercluster
	 *
	 */
	criamarkercluster : function() {
		try {
			if (i3GEOF.markercluster.aguarde.visibility === "visible") {
				return;
			}
			var p, fim, cp;

			i3GEOF.markercluster.aguarde.visibility = "visible";
			fim = function(retorno) {
				i3GEOF.markercluster.aguarde.visibility = "hidden";
				if (retorno.data === undefined) {
					$i("i3GEOmarkerclusterfim").innerHTML = $trad(
							8,
							i3GEOF.markercluster.dicionario);
				} else {
					i3GEO.atualiza();
				}
			};
			p = i3GEO.configura.locaplic
					+ "/ferramentas/markercluster/exec.php?g_sid="
					+ i3GEO.configura.sid
					+ "&funcao=criamarkercluster"
					+ "&tema="
					+ $i("i3GEOmarkerclustertemasComSel").value
					+ "&titulo="
					+ $i("i3GEOmarkerclusterTitulo").value
					+ "&opacidade="
					+ $i("i3GEOmarkerclusterOpacidade").value
					+ "&gridSize="
					+ $i("i3GEOmarkerclusterRaio").value;

			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(
					p,
					"criamarkercluster",
					fim);
		} catch (e) {
			$i("i3GEOmarkerclusterfim").innerHTML = "<p class='paragrafo' >Erro. "
					+ e;
			i3GEOF.markercluster.aguarde.visibility = "hidden";
		}
	},
	/**
	 * Function: comboTemasSel
	 *
	 * Cria um combo com a lista de temas
	 *
	 * Veja:
	 *
	 * <i3GEO.util.comboTemas>
	 */
	comboTemasSel : function() {
		i3GEO.util.comboTemas(
				"i3GEOmarkerclustertemasComSel",
				function(retorno) {
					$i("i3GEOmarkerclusterSelTemas").innerHTML = retorno.dados;
					$i("i3GEOmarkerclusterSelTemas").style.display = "block";
					if ($i("i3GEOmarkerclustertemasComSel")) {
						$i("i3GEOmarkerclustertemasComSel").onchange = function() {
							i3GEO.mapa.ativaTema($i("i3GEOmarkerclustertemasComSel").value);
						};
					}
					if (i3GEO.temaAtivo !== "") {
						$i("i3GEOmarkerclustertemasComSel").value = i3GEO.temaAtivo;
						$i("i3GEOmarkerclustertemasComSel").onchange.call();
					}
				},
				"i3GEOmarkerclusterSelTemas",
				"",
				false,
				"ligados",
				"display:block");
	},
	/**
	 * Function: comboItens
	 *
	 * Cria um combo para escolha de um item do tema
	 *
	 * Veja:
	 *
	 * <i3GEO.util.comboItens>
	 *
	 */
	comboItens : function() {
		i3GEO.util.comboItens(
				"i3GEOmarkerclustertemasItem",
				$i("i3GEOmarkerclustertemasComSel").value,
				function(retorno) {
					$i("i3GEOmarkerclusterondeItens").innerHTML = retorno.dados;
					$i("i3GEOmarkerclusterondeItens").style.display = "block";
				},
				"i3GEOmarkerclusterondeItens");
	}
};