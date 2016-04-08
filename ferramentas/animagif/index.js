/*
Title: animagif

Cria um arquivo gif que mostra superposição de imagens do mapa atual

<i3GEO.tema.dialogo.animagif>

Arquivo:

i3geo/ferramentas/animagif/index.js.php

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
 * Classe: i3GEOF.animagif
 *
 * Camadas podem ter as definicoes default de parametros armazenadas no metadata animagif Esse metadata e mantido no objeto
 * i3GEO.arvoreDeCamadas.CAMADAS
 *
 * Os campos definidos pelo usuario podem ser salvos no mapfile caso o usuario esteja logado
 *
 * Veja tambem i3geo/ferramentas/atalhosedicao
 */
i3GEOF.animagif =
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
		i3GEOF.animagif.iniciaDicionario();
	},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.animagif.dicionario);
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
		if (typeof (i3GEOF.animagif.dicionario) === 'undefined') {
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic + "/ferramentas/animagif/dicionario.js",
				"i3GEOF.animagif.iniciaJanelaFlutuante()",
			"i3GEOF.animagif.dicionario_script");
		} else {
			i3GEOF.animagif.iniciaJanelaFlutuante();
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
		var camada = "", temp;
		i3GEO.janela.comboCabecalhoTemas("i3GEOFanimagifComboCabeca", "i3GEOFanimagifComboCabecaSel", "animagif", "ligadosComTabela");
		if(i3GEOF.animagif.tema === ""){
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.animagif.html();
		i3GEOF.animagif.rodape();
		//
		// verifica se a camada possui definicao dos parametros
		//
		if (i3GEO.arvoreDeCamadas) {
			camada = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.animagif.tema);
			if (camada != "" && camada.ferramentas.animagif) {
				if(camada.ferramentas.animagif.auto === "sim"){
					$i("ativaAoAdic").checked = true;
				}
				if(camada.ferramentas.animagif.exec === "sim"){
					$i("execAoAdic").checked = true;
				}
				temp = $i("i3GEOANIMAGIFtipocolunat").getElementsByTagName("select")[0];
				temp.value = camada.ferramentas.animagif.tipocolunat;
				temp = $i("i3GEOANIMAGIFtempo");
				temp.value = camada.ferramentas.animagif.tempo;
				temp = $i("i3GEOANIMAGIFw");
				temp.value = camada.ferramentas.animagif.w;
				temp = $i("i3GEOANIMAGIFh");
				temp.value = camada.ferramentas.animagif.h;
				temp = $i("i3GEOANIMAGIFcache").getElementsByTagName("select")[0];
				temp.value = camada.ferramentas.animagif.cache;
				temp = $i("i3GEOANIMAGIFextensao");
				temp.value = camada.ferramentas.animagif.mapext;
				temp = $i("i3GEOANIMAGIFlegenda").getElementsByTagName("select")[0];
				temp.value = camada.ferramentas.animagif.legenda;
				temp = $i("i3GEOANIMAGIFtransparencia").getElementsByTagName("select")[0];
				temp.value = camada.ferramentas.animagif.transparencia;
				temp = $i("i3GEOANIMAGIFoperador").getElementsByTagName("select")[0];
				temp.value = camada.ferramentas.animagif.operador;
				temp = $i("i3GEOANIMAGIFnulos");
				temp.value = camada.ferramentas.animagif.nulos;
				// combo para escolher a coluna com as datas
				i3GEO.util.comboItens("i3GEOanimagifcolunat", i3GEOF.animagif.tema, function(retorno) {
					$i("i3GEOANIMAGIFcolunatSel").innerHTML = retorno.dados;
					temp = $i("i3GEOANIMAGIFcolunatSel").getElementsByTagName("select")[0];
					temp.value = camada.ferramentas.animagif.colunat;
				}, "i3GEOanimagifcolunatSel");
			} else if (camada != "") {
				i3GEO.util.comboItens("i3GEOanimagifcolunat", i3GEOF.animagif.tema, function(retorno) {
					$i("i3GEOANIMAGIFcolunatSel").innerHTML = retorno.dados;
				}, "i3GEOanimagifcolunatSel");
				$i("i3GEOANIMAGIFextensao").value = i3GEO.parametros.mapexten;
			}
		} else{
			i3GEO.util.comboItens("i3GEOanimagifcolunat", i3GEOF.animagif.tema, function(retorno) {
				$i("i3GEOANIMAGIFcolunatSel").innerHTML = retorno.dados;
			}, "i3GEOanimagifcolunatSel");
			$i("i3GEOANIMAGIFextensao").value = i3GEO.parametros.mapexten;
		}
		i3GEOF.animagif.ativaFoco();
	},
	rodape : function() {
		var ins =
			'<input class="paragrafo" id="i3GEOanimagifbotao1" type="button" value="' + $trad('geragif', i3GEOF.animagif.dicionario)
			+ '" style="cursor:pointer;color:blue"/>';
		if (i3GEO.login.verificaCookieLogin() === true) {
			ins +=
				'<input class="paragrafo" style="margin-top:3px;" id="i3GEOanimagifbotaoSalva" type="button" value="' + $trad(
					'salvaParametros',
					i3GEOF.animagif.dicionario)
					+ '" style="cursor:pointer;color:blue"/>';
			ins +=
				'<input class="paragrafo" style="margin-top:3px;" id="i3GEOanimagifbotaoRemove" type="button" value="' + $trad(
					'removeParametros',
					i3GEOF.animagif.dicionario)
					+ '" style="cursor:pointer;color:blue"/>';
		}
		YAHOO.i3GEO.janela.manager.find("i3GEOF.animagif").setFooter(ins);

		var b = new YAHOO.widget.Button("i3GEOanimagifbotao1", {
			onclick : {
				fn : i3GEOF.animagif.ativa
			}
		});
		b.addClass("rodar");
		$i("i3GEOanimagifbotao1-button").style.width = "350px";
		if (i3GEO.login.verificaCookieLogin() === true && i3GEO.parametros.editor === "sim") {
			$i("parametrosComLogin").style.display = 'block';
			b = new YAHOO.widget.Button("i3GEOanimagifbotaoSalva", {
				onclick : {
					fn : i3GEOF.animagif.salvaParametros
				}
			});
			b.addClass("rodar");
			$i("i3GEOanimagifbotaoSalva-button").style.width = "350px";

			b = new YAHOO.widget.Button("i3GEOanimagifbotaoRemove", {
				onclick : {
					fn : i3GEOF.animagif.removeParametros
				}
			});
			b.addClass("rodar");
			$i("i3GEOanimagifbotaoRemove-button").style.width = "350px";
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
		var ins = Mustache.render(i3GEOF.animagif.MUSTACHE, i3GEOF.animagif.mustacheHash());
		return ins;
	},
	/*
	 * Function: iniciaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function(tema) {
		i3GEOF.animagif.tema = tema;
		var minimiza, cabecalho, janela, divid, temp, titulo;
		if ($i("i3GEOF.animagif")) {
			i3GEOF.animagif.inicia("i3GEOF.animagif_corpo");
			return;
		}
		cabecalho = function() {
			i3GEOF.animagif.ativaFoco();
		};
		minimiza = function() {
			i3GEO.janela.minimiza("i3GEOF.animagif");
		};
		// cria a janela flutuante
		titulo =
			"<span class='i3GEOiconeFerramenta i3GEOiconeanimagif'></span>" + "<div  id='i3GEOFanimagifComboCabeca' class='comboTemasCabecalho'>   ------</div>"
			+ "<div class='i3GeoTituloJanela'>animagif </span><a class=ajuda_usuario target=_blank href='"
			+ i3GEO.configura.locaplic
			+ "/ajuda_usuario.php?idcategoria=5&idajuda=130' ><b> </b></a></div>";
		janela = i3GEO.janela.cria("380px", "380px", "", "", "", titulo, "i3GEOF.animagif", false, "hd", cabecalho, minimiza, "", true);
		divid = janela[2].id;
		i3GEOF.animagif.aguarde = $i("i3GEOF.animagif_imagemCabecalho").style;
		$i("i3GEOF.animagif_corpo").style.backgroundColor = "white";
		i3GEOF.animagif.inicia(divid);
		temp = function() {
			i3GEO.eventos.removeEventos(
				"ATUALIZAARVORECAMADAS",
				[
				 'i3GEO.janela.comboCabecalhoTemas("i3GEOFanimagifComboCabeca","i3GEOFanimagifComboCabecaSel","animagif","ligadosComTabela")'
				]
			);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	 * Function: ativaFoco
	 *
	 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	 */
	ativaFoco : function() {
		var i = $i("i3GEOF.animagif_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	salvaParametros: function(){
		//monta a string JSON que sera enviada para gravacao
		var j, auto = "nao", exec = "nao";
		if($i("ativaAoAdic").checked === true){
			auto = "sim";
		}
		if($i("execAoAdic").checked === true){
			exec = "sim";
		}

		j = '{"colunat":"'
			+ $i("i3GEOANIMAGIFcolunatSel").getElementsByTagName("select")[0].value
			+ '","tipocolunat":"'
			+ $i("i3GEOANIMAGIFtipocolunat").getElementsByTagName("select")[0].value
			+ '","tempo":"'
			+ $i("i3GEOANIMAGIFtempo").value
			+ '","w":"'
			+ $i("i3GEOANIMAGIFw").value
			+ '","h":"'
			+ $i("i3GEOANIMAGIFh").value
			+ '","cache":"'
			+ $i("i3GEOANIMAGIFcache").getElementsByTagName("select")[0].value
			+ '","mapext":"'
			+ $i("i3GEOANIMAGIFextensao").value
			+ '","legenda":"'
			+ $i("i3GEOANIMAGIFlegenda").getElementsByTagName("select")[0].value
			+ '","transparente":"'
			+ $i("i3GEOANIMAGIFtransparencia").getElementsByTagName("select")[0].value
			+ '","operador":"'
			+ $i("i3GEOANIMAGIFoperador").getElementsByTagName("select")[0].value
			+ '","nulos":"'
			+ $i("i3GEOANIMAGIFnulos").value
			+ '","auto":"'
			+ auto
			+ '","exec":"'
			+ exec
			+ '"}';

		i3GEO.janela.confirma($trad("incluiPar", i3GEOF.animagif.dicionario), 300, $trad("x14"),
			"", function() {
			p = i3GEO.configura.locaplic + "/ferramentas/animagif/manutencao.php";
			par = "&g_sid=" + i3GEO.configura.sid
			+ "&tema=" + i3GEOF.animagif.tema
			+ "&animagif=" + i3GEO.util.base64encode(j)
			+ "&funcao=inclui";

			retorno =
				function(retorno) {
				i3GEO.janela.fechaAguarde("animagif");
			};
			i3GEO.janela.abreAguarde("animagif", $trad("o1"));
			cpJSON.call(p, "foo", retorno, par);
		});

	},
	removeParametros: function(){
		i3GEO.janela.confirma($trad("removePar", i3GEOF.animagif.dicionario), 300, $trad("x14"),
			"", function() {
			p = i3GEO.configura.locaplic + "/ferramentas/animagif/manutencao.php";
			par = "&g_sid=" + i3GEO.configura.sid
			+ "&tema=" + i3GEOF.animagif.tema
			+ "&funcao=remove";

			retorno =
				function(retorno) {
				i3GEO.janela.fechaAguarde("animagif");
			};
			i3GEO.janela.abreAguarde("animagif", $trad("o1"));
			cpJSON.call(p, "foo", retorno, par);
		});
	},
	/*
	 * Function: ativa
	 *
	 * Cria o arquivo gif com os itens marcados
	 *
	 */
	ativa : function() {
		var par = "", temp;
		temp = $i("i3GEOANIMAGIFcolunatSel").getElementsByTagName("select")[0];
		if (temp.value === "") {
			i3GEO.janela.tempoMsg($trad('selecionaCol', i3GEOF.animagif.dicionario));
			return;
		}
		par = "colunat=" + temp.value;
		temp = $i("i3GEOANIMAGIFtipocolunat").getElementsByTagName("select")[0];
		par += "&tipocolunat=" + temp.value;
		temp = $i("i3GEOANIMAGIFtempo");
		par += "&tempo=" + temp.value;
		temp = $i("i3GEOANIMAGIFw");
		par += "&w=" + temp.value;
		temp = $i("i3GEOANIMAGIFh");
		par += "&h=" + temp.value;
		temp = $i("i3GEOANIMAGIFcache").getElementsByTagName("select")[0];
		par += "&cache=" + temp.value;
		temp = $i("i3GEOANIMAGIFextensao");
		par += "&mapext=" + temp.value;
		temp = $i("i3GEOANIMAGIFlegenda").getElementsByTagName("select")[0];
		par += "&legenda=" + temp.value;
		temp = $i("i3GEOANIMAGIFtransparencia").getElementsByTagName("select")[0];
		par += "&transparente=" + temp.value;
		temp = $i("i3GEOANIMAGIFoperador").getElementsByTagName("select")[0];
		par += "&operador=" + temp.value;
		temp = $i("i3GEOANIMAGIFnulos");
		par += "&nulos=" + temp.value;

		i3GEO.janela.cria(
			(parseInt($i("i3GEOANIMAGIFw").value,10) + 50) + "px",
			(parseInt($i("i3GEOANIMAGIFh").value,10) + 150) + "px",
			i3GEO.configura.locaplic+"/ferramentas/animagif/index.php?" + par + "&tema=" + i3GEOF.animagif.tema,
			"",
			"",
			"GIF",
			"i3GEOF.animagifGif",
			false,
			"hd",
			"",
			"",
			"",
			true
		);
		$i("i3GEOF.animagif_corpo").style.backgroundColor = "white";
	}
};
