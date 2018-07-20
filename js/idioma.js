/**
 * Title: Idioma
 *
 * Tradu&ccedil;&atilde;o da interface principal.
 *
 * Fornece os m&eacute;todos para traduzir frases para idiomas
 * espec&iacute;ficos.
 *
 * O dicion&aacute;rio &eacute; definido em i3geo/classesjs/dicionario.js
 *
 * Se voc&ecirc; est&aacute; customizando o i3geo,acrescentandonovas
 * funcionalidades, utilize o m&eacute;todo alteraDicionario para acrescentar
 * novas tradu&ccedil;&otilde;es, dessa forma, quandoo usu&aacute;rio escolher
 * oidioma ainterface ser&aacute; adaptada corretamente.
 *
 * Namespace:
 *
 * i3GEO.idioma
 *
 * Exemplos:
 *
 * (start code)
 *
 * i3GEO.idioma.define("pt");
 *
 * i3GEO.idioma.defineDicionario(g_traducao);
 *
 * i3GEO.idioma.alteraDicionario("d22","novo oi");
 *
 * alert($trad("d22"))
 *
 * (end)
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_idioma.js>
 */

 /** Licen&ccedil;a
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
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE
 * ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para
 * mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.idioma = {
	/**
	 * Propriedade: MOSTRASELETOR
	 *
	 * Define se o i3Geo ir&aacute; incluir no mapa as bandeiras de
	 * sele&ccedil;&atilde;o de idiomas
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	MOSTRASELETOR : false,
	/**
	 * Propriedade: IDSELETOR
	 *
	 * Define o id do elemento HTML que receber&aacute; o seletor. Se n&atilde;o
	 * for definido, o seletor ser&aacute; posicionado automaticamente pelo
	 * i3Geo
	 *
	 * Tipo:
	 *
	 * {String}
	 *
	 */
	IDSELETOR : "",
	/**
	 * Propriedade: SELETORES
	 *
	 * Lista os seletores (bandeiras) que ser&atilde;o inclu&iacute;das no
	 * seletor
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *
	 * ["pt","en","es","it"]
	 */
	SELETORES : [
		"pt",
		"en",
		"es"
	], // ,"it"],
	/**
	 * Propriedade: DICIONARIO
	 *
	 * Objeto contendo o dicion&aacute;rio default utilizado
	 *
	 * Tipo:
	 *
	 * {object}
	 *
	 * Default:
	 *
	 * g_traducao
	 */
	DICIONARIO : g_traducao,
	/**
	 * Function: define
	 *
	 * Define qual o idioma em uso. O default &eacute; "pt".
	 *
	 * Parametro:
	 *
	 * {String} - C&oacute;digo do idioma.
	 */
	define : function(codigo) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.idioma.define(" + codigo + ")");

		i3GEO.idioma.ATUAL = codigo;
		i3GEO.util.insereCookie(
			"i3geolingua",
			codigo);
	},
	/**
	 * Function: retornaAtual
	 *
	 * Retorna o idioma atual.
	 *
	 * Return:
	 *
	 * {string} - C&oacute;digo do idioma.
	 */
	retornaAtual : function() {
		return (i3GEO.idioma.ATUAL);
	},
	/**
	 * Function: defineDicionario
	 *
	 * Define o objeto com as tradu&ccedil;&otilde;es. O default &eacute;
	 * "g_traducao"
	 *
	 * Parametro:
	 *
	 * {Object} - Objeto com a tradu&ccedil;&atilde;o.
	 *
	 * Exemplo:
	 *
	 * (start code)
	 *
	 * g_traducao = {
	 * 		"p1": [{
	 * 			pt:"texto em portugues",
	 * 			en:"texto em ingles",
	 * 			es:"texto em espanhol"
	 * 		}]
	 * };
	 *
	 *  (end)
	 */
	defineDicionario : function(obj) {
		i3GEO.idioma.DICIONARIO = obj;
	},
	/**
	 * Function: alteraDicionario
	 *
	 * Altera um texto do dicionario ou acresecenta um novo texto para o idioma
	 * atual.
	 *
	 * Parametros:
	 *
	 * {String} - C&oacute;digo do texto.
	 *
	 * {String} - Novo texto.
	 *
	 */
	alteraDicionario : function(id, novo) {
		i3GEO.idioma.DICIONARIO[id][0][i3GEO.idioma.ATUAL] = novo;
	},
	/**
	 * Function: traduzir
	 *
	 * Traduz um texto para o idioma escolhido
	 *
	 * Parametros:
	 *
	 * {String} - C&oacute;digo do texto.
	 *
	 * {string} - Objeto que cont&eacute;m o dicion&aacute;. Por default,
	 * utiliza i3GEO.idioma.DICIONARIO
	 *
	 * Returns:
	 *
	 * {String} Texto traduzido.
	 */
	traduzir : function(id, dic) {
		if (!dic) {
			dic = i3GEO.idioma.DICIONARIO;
		}
		if (dic[id]) {
			var r, t = dic[id][0];
			r = t[i3GEO.idioma.ATUAL];
			if (r == "") {
				r = t["pt"];
			}
			return r;
		} else {
			return;
		}
	},
	/**
	 * Function: adicionaDicionario
	 *
	 * Adiciona novos registros ao dicion&aacute;rio atual
	 *
	 * Parametro:
	 *
	 * {Object}  - Objeto novo dicion&aacute;rio.
	 *
	 * Exemplo:
	 *
	 * (start code)
	 *
	 * var novodic ={ "pp": [{
	 *
	 * pt:"texto em portugues",
	 *
	 * en:"texto em ingles",
	 *
	 * es:"texto em espanhol"
	 *
	 * }]}
	 *
	 * i3GEO.idioma.adicionaDicionario(novodic)
	 *
	 * alert($trad("pp"))
	 *
	 * (code)
	 */
	adicionaDicionario : function(novodic) {
		for ( var k in novodic) {
			if (novodic.hasOwnProperty(k)) {
				i3GEO.idioma.DICIONARIO[k] = novodic[k];
			}
		}
	},
	/**
	 * Function: mostraDicionario
	 *
	 * Abre uma nova janela do navegador com a lista de palavras do
	 * dicion&aacute;rio.
	 */
	mostraDicionario : function() {
		var w, k = 0;
		w = window.open();
		for (k in i3GEO.idioma.DICIONARIO) {
			if (i3GEO.idioma.DICIONARIO.hasOwnProperty(k)) {
				w.document.write(k
					+ " = "
					+ i3GEO.idioma.traduzir(k)
					+ "<br>");
			}
		}
	},

	/**
	 * Function: trocaIdioma
	 *
	 * Troca o idioma atual por outro.
	 *
	 * A troca &eacute; baseada na defini&ccedil;&atilde;o de um cookie e reload
	 * da p&aacute;gina.
	 *
	 * Parametro:
	 *
	 * {String} - C&oacute;digo do idioma (p.e. "en")
	 */
	trocaIdioma : function(codigo) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.idioma.trocaIdioma()");

		i3GEO.util.insereCookie(
			"i3geolingua",
			codigo);
		window.location.reload(true);
	},
	/**
	 * Function: listaIdiomas
	 *
	 * Lista os idiomas dispon&iacute;veis no dicion&aacute;rio ativo
	 *
	 * Returns:
	 *
	 * {Array} c&oacute;digos de idioma dispon&iacute;veis.
	 */
	listaIdiomas : function() {
		for ( var k in i3GEO.idioma.DICIONARIO) {
			if (i3GEO.idioma.DICIONARIO.hasOwnProperty(k)) {
				return (i3GEO.util.listaChaves(i3GEO.idioma.DICIONARIO[k][0]));
			}
		}
	},
	/**
	 * Function: mostraSeletor
	 *
	 * Inclui as bandeiras no mapa permitindo a sele&ccedil;&atilde;o do idioma
	 *
	 * As imagens das bandeiras devem estar definidas no CSS do i3geo, recebendo
	 * como identificadores os ids uk,brasil,italiano,espanhol
	 */
	mostraSeletor : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.idioma.mostraSeletor()");

		if (!i3GEO.idioma.MOSTRASELETOR) {
			return;
		}
		//
		// monta o elemento HTML com as bandeiras
		//
		var ins, n, w, i, pos, novoel, temp;
		ins = "";
		n = i3GEO.idioma.SELETORES.length;
		if ($i("i3geo")
			&& i3GEO.parametros.w < 700) {
			w = "width:10px;";
		} else {
			w = "";
		}
		for (i = 0; i < n; i++) {
			temp = i3GEO.idioma.SELETORES[i];
			ins += '<img  style="'
				+ w
				+ 'padding:0 0px;top:-7px;padding-right:0px;border: 1px solid white;" src="'
				+ i3GEO.configura.locaplic + "/imagens/branco.gif"
				+ '" onclick="i3GEO.idioma.trocaIdioma(\''
				+ temp
				+ '\')" ';
			if (temp === "en") {
				ins += 'alt="Ingles" id="uk" />';
			}
			if (temp === "pt") {
				ins += 'alt="Portugues" id="brasil" />';
			}
			if (temp === "es") {
				ins += 'alt="Espanhol" id="espanhol" />';
			}
		}
		if (i3GEO.idioma.IDSELETOR !== ""
			&& $i(i3GEO.idioma.IDSELETOR)) {
			$i(i3GEO.idioma.IDSELETOR).innerHTML = ins;
		} else {
			pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if (!$i("i3geoseletoridiomas")) {
				novoel = document.createElement("div");
				novoel.innerHTML = ins;
				novoel.id = "i3geoseletoridiomas";
				document.body.appendChild(novoel);
			} else {
				novoel = $i("i3geoseletoridiomas");
			}
			novoel.style.position = "absolute";
			novoel.style.top = pos[1]
				- 17
				+ "px";
			novoel.style.left = pos[0]
				+ "px";
			novoel.style.zIndex = 5000;
		}
	},
	//guarda o objeto com os termos traduzidos
	OBJETOIDIOMA : "",
	/**
	 * Function: objetoIdioma
	 *
	 * Retorna um objeto com os itens do dicionario para o idioma atual
	 *
	 * Parametro:
	 *
	 * {objeto} - (opcional) objeto com o dicionario
	 */
	objetoIdioma : function(dic) {
		if (!dic) {
			dic = i3GEO.idioma.DICIONARIO;
		}
		var novo = {}, k = 0;
		for (k in dic) {
			if (dic.hasOwnProperty(k)) {
				novo[k] = i3GEO.idioma.traduzir(
					k,
					dic);
			}
		}
		return novo;
	}
};
/**
 * Function: $trad
 *
 * Atalho para a fun&ccedil;&atilde;o de tradu&ccedil;&atilde;o
 *
 * Parametros:
 *
 * {String} - C&oacute;digo do texto.
 *
 * {string} - Objeto que cont&eacute;m o dicion&aacute;. Por default,
 * utiliza i3GEO.idioma.DICIONARIO
 *
 * Returns:
 *
 * {String} - Texto traduzido.
 */
var $trad = function(id, dic) {
	if (!dic || dic == "g_traducao") {
		return i3GEO.idioma.OBJETOIDIOMA[id];
	} else {
		return (i3GEO.idioma.traduzir(
			id,
			dic));
	}
};
//
(function() {
	/*
	 * Define o idioma padrao quando o cookie ainda nao tiver sido escolhido
	 */
	if (document.cookie.indexOf("i3geolingua") === -1) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + 10);
		var l = "pt";
		var lang = navigator.language || navigator.userLanguage;
		lang = lang.split("-")[0];
		if(lang == "en" || lang == "es" || lang == "pt"){
			l = lang;
		}
		document.cookie = "i3geolingua=" + l + "; expires=" + exdate.toUTCString() + ";path=/";
	}
	var c = i3GEO.util.pegaCookie("i3geolingua");
	if (c) {
		i3GEO.idioma.define(c);
	} else {
		i3GEO.idioma.define("pt");
	}
	if (typeof ('g_traducao') !== "undefined") {
		i3GEO.idioma.defineDicionario(g_traducao);
	}
	i3GEO.idioma.OBJETOIDIOMA = i3GEO.idioma.objetoIdioma(i3GEO.idioma.DICIONARIO);
	delete g_traducao;
	delete i3GEO.idioma.DICIONARIO;
})();