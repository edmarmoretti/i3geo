/*
 * Title: Utilit&aacute;rios
 *
 * Fun&ccedil;&otilde;es de uso geral
 *
 * Namespace:
 *
 * i3GEO.util
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_util.js>
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica
 * Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do GNU junto com
 * este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite 330, Boston, MA
 * 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
/**
 * Constant: navm
 *
 * Verdadeiro (true) se o navegador for o Internet Explorer
 *
 * Tipo:
 *
 * {boolean}
 */
var navm = false;
/**
 * Constant: navn
 *
 * Verdadeiro (true) se o navegador for o Firefox
 *
 * Tipo:
 *
 * {boolean}
 */
var navn = false;
/**
 * Constant: chro
 *
 * Verdadeiro (true) se o navegador for o Chrome
 *
 * Tipo:
 *
 * {boolean}
 */
var chro = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
/**
 * Constant: opera
 *
 * Verdadeiro (true) se o navegador for o Opera
 *
 * Tipo:
 *
 * {boolean}
 */
var opera = navigator.userAgent.toLowerCase().indexOf('opera') > -1;
if (navigator.appName.substring(0, 1) === 'N') {
    navn = true;
}
if (navigator.appName.substring(0, 1) === 'M') {
    navm = true;
}
if (opera === true) {
    navn = true;
}

/**
 * Function: $i
 *
 * Obtem um elemento DOM a partir de seu id
 *
 * Parametro:
 *
 * {String} - ID do elemento.
 *
 * Returns:
 *
 * {Object}
 */
var $i = function(id) {
    if(!id || id === ""){
	return false;
    }
    return document.getElementById(id);
};
/**
 * Function: Array.remove()
 *
 * Extende os metodos de um objeto Array, permitindo remover um elemento.
 *
 */
Array.prototype.remove = function(s) {
    try {
	var n = this.length, i;
	for (i = 0; i < n; i++) {
	    if (this[i] == s) {
		this.splice(i, 1);
	    }
	}
    } catch (e) {
    }
};
/**
 * Function: Array.getUnique()
 *
 * Extende os metodos de um objeto Array, retorna um array com valores unicos
 *
 */
Array.prototype.getUnique = function() {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
	if (u.hasOwnProperty(this[i])) {
	    continue;
	}
	a.push(this[i]);
	u[this[i]] = 1;
    }
    return a;
};

//funcoes de arredondamento usando Math
//Closure
(function(){

    /**
     * Decimal adjustment of a number.
     *
     * @param	{String}	type	The type of adjustment.
     * @param	{Number}	value	The number.
     * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
     * @returns	{Number}			The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
	// If the exp is undefined or zero...
	if (typeof exp === 'undefined' || +exp === 0) {
	    return Math[type](value);
	}
	value = +value;
	exp = +exp;
	// If the value is not a number or the exp is not an integer...
	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
	    return NaN;
	}
	// Shift
	value = value.toString().split('e');
	value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	// Shift back
	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
	Math.round10 = function(value, exp) {
	    return decimalAdjust('round', value, exp);
	};
    }
    // Decimal floor
    if (!Math.floor10) {
	Math.floor10 = function(value, exp) {
	    return decimalAdjust('floor', value, exp);
	};
    }
    // Decimal ceil
    if (!Math.ceil10) {
	Math.ceil10 = function(value, exp) {
	    return decimalAdjust('ceil', value, exp);
	};
    }

})();


i3GEO.util =
{
	/**
	 * Elementos IMG criados na funcao criaPin
	 *
	 * Tipo: {Array}
	 */
	PINS : [],
	/**
	 * Elementos DIV criados na funcao criaBox
	 *
	 * Tipo: {Array}
	 */
	BOXES : [],
	/**
	 * Function: trim
	 *
	 * Implementa o metodo trim para navegadores sem suporte a essa funcao
	 *
	 * Parametros:
	 *
	 * {String}
	 *
	 * Return:
	 *
	 * {String}
	 */
	trim : function(s) {
	    return s.replace(/^\s+|\s+$/gm, '');
	},
	generateId : function(pre){
	    if(!pre){
		pre = "UniqId";
	    }
	    return pre + String(Date.now())+Math.floor(Math.random()*10000);
	},
	/**
	 * Function: escapeURL
	 *
	 * Converte uma string em uma url valida
	 *
	 * Parametros:
	 *
	 * {String} - url que sera convertida
	 *
	 * Return:
	 *
	 * {String}
	 */
	escapeURL : function(sUrl) {
	    var re;
	    sUrl = escape(sUrl);
	    re = new RegExp("%3F", "g");
	    sUrl = sUrl.replace(re, '?');
	    re = new RegExp("%3D", "g");
	    sUrl = sUrl.replace(re, '=');
	    re = new RegExp("%26", "g");
	    sUrl = sUrl.replace(re, '&');
	    return sUrl;
	},
	/**
	 * Function: insereCookie
	 *
	 * Cria um novo cookie.
	 *
	 * Parametros:
	 *
	 * {String} -Nome do cookie.
	 *
	 * {String} - Valor do cookie
	 *
	 * {numerico} - Dias que levara para expirar
	 */
	insereCookie : function(nome, valor, expira) {
	    if (typeof (console) !== 'undefined')
		console.info("insereCookie " + nome);

	    if (!expira) {
		expira = 10;
	    }
	    var exdate = new Date();
	    exdate.setDate(exdate.getDate() + expira);
	    document.cookie = nome + "=" + valor + "; expires=" + exdate.toUTCString() + ";path=/";
	},
	/**
	 * Function: pegaCookie
	 *
	 * Pega o valor de um cookie.
	 *
	 * Parametros:
	 *
	 * {String} - Nome do cookie.
	 *
	 * Returns:
	 *
	 * valor do cookie
	 */
	pegaCookie : function(nome) {
	    var cookies, i, fim;
	    cookies = document.cookie;
	    i = cookies.indexOf(nome);
	    if (i === -1) {
		return null;
	    }
	    fim = cookies.indexOf(";", i);
	    if (fim === -1) {
		fim = cookies.length;
	    }
	    return (unescape(cookies.substring(i, fim))).split("=")[1];
	},
	/**
	 * Function: listaChaves
	 *
	 * Lista as chaves de um objeto que forem true.
	 *
	 * Parametro:
	 *
	 * {Object}
	 *
	 * Return:
	 *
	 * array com as chaves.
	 */
	listaChaves : function(obj) {
	    var keys, key = "";
	    keys = [];
	    for (key in obj) {
		if (obj[key]) {
		    keys.push(key);
		}
	    }
	    return keys;
	},
	/**
	 * Function: listaTodasChaves
	 *
	 * Lista as chaves de um objeto
	 *
	 * Parametros:
	 *
	 * {Object}
	 *
	 * Return:
	 *
	 * array com as chaves.
	 */
	listaTodasChaves : function(obj) {
	    var keys, key = "";
	    keys = [];
	    for (key in obj) {
		keys.push(key);
	    }
	    return keys;
	},
	/**
	 * Function: removeAcentos
	 *
	 * Remove acentos de uma palavra ou frase
	 *
	 * Parametros:
	 *
	 * {String} - palavra
	 *
	 * Return:
	 *
	 * {String}
	 */
	removeAcentos : function(str) {
	    var defaultDiacriticsRemovalMap =
		[
		    {
			'base' : 'A',
			'letters' : /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
		    },
		    {
			'base' : 'C',
			'letters' : /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
		    },
		    {
			'base' : 'E',
			'letters' : /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
		    },
		    {
			'base' : 'I',
			'letters' : /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
		    },
		    {
			'base' : 'O',
			'letters' : /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
		    },
		    {
			'base' : 'U',
			'letters' : /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
		    },
		    {
			'base' : 'a',
			'letters' : /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
		    },
		    {
			'base' : 'c',
			'letters' : /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
		    },
		    {
			'base' : 'e',
			'letters' : /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
		    },
		    {
			'base' : 'i',
			'letters' : /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
		    },
		    {
			'base' : 'o',
			'letters' : /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
		    },
		    {
			'base' : 'u',
			'letters' : /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
		    }
		    ];
	    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
		str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
	    }
	    return str;
	},
	/**
	 * Function: protocolo
	 *
	 * Obtem o protocolo utilizado na URL atual
	 *
	 * Return:
	 *
	 * {String} - protocolo
	 */
	protocolo : function() {
	    var u = window.location.href;
	    u = u.split(":");
	    return (u[0]);
	},
	/**
	 * Function: pegaPosicaoObjeto
	 *
	 * Retorna a posicao x,y de um objeto em relacao a tela do navegador
	 *
	 * Parametros:
	 *
	 * {Object} - objeto dom
	 *
	 * Return:
	 *
	 * {Array} - array com a posicao [x,y]
	 */
	pegaPosicaoObjeto : function(obj) {
	    if (obj) {
		if (!obj.style) {
		    return [
			0, 0
			];
		}
		var curleft = 0, curtop = 0;
		if (obj) {
		    if (obj.offsetParent) {
			do {
			    curleft += obj.offsetLeft - obj.scrollLeft;
			    curtop += obj.offsetTop - obj.scrollTop;
			    obj = obj.offsetParent;
			} while (obj);
		    }
		}
		return [
		    curleft + document.body.scrollLeft, curtop + document.body.scrollTop
		    ];
	    } else {
		return [
		    0, 0
		    ];
	    }
	},
	/**
	 * Function: pegaElementoPai
	 *
	 * Pega o elemento pai de um elemento clicado
	 *
	 * Parametros:
	 *
	 * {Objeto} - elemento do DOM
	 *
	 * Return:
	 *
	 * {Node} - objeto DOM
	 */
	pegaElementoPai : function(e) {
	    var targ = document;
	    if (!e) {
		e = window.event;
	    }
	    if (e.target) {
		targ = e.target;
	    } else {
		if (e.srcElement) {
		    targ = e.srcElement;
		}
	    }
	    if (targ.nodeType === 3) {
		targ = targ.parentNode;
	    }
	    if (targ.parentNode) {
		tparent = targ.parentNode;
		return (tparent);
	    } else {
		return targ;
	    }
	},
	/**
	 * depreciado
	 */
	mudaCursor : function() {
	},
	/**
	 * Cria um elemento div na pagina atual.
	 *
	 * Esse elemento pode ser utilizado para desenhar retangulos sobre o mapa com base em coordenadas de tela
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento que sera criado. Por default, sera 'boxg'
	 */
	criaBox : function(id) {
	    if (arguments.length === 0) {
		id = "boxg";
	    }
	    if (!$i(id)) {
		var novoel = document.createElement("div");
		novoel.id = id;
		novoel.style.zIndex = 1;
		novoel.innerHTML = '<font face="Arial" size=0></font>';
		document.body.appendChild(novoel);
		novoel.onmouseover = function() {
		    novoel.style.display = 'none';
		};
		novoel.onmouseout = function() {
		    novoel.style.display = 'block';
		};
		i3GEO.util.BOXES.push(id);
	    } else {
		$i(id).style.display = "block";
	    }
	},
	/**
	 * Esconde os BOXES com IDs registrados em i3GEO.util.BOXES
	 *
	 * Os ids sao criado pela funcao criaBox
	 */
	escondeBox : function() {
	    var l, i;
	    l = i3GEO.util.BOXES.length;
	    for (i = 0; i < l; i++) {
		if ($i(i3GEO.util.BOXES[i])) {
		    $i(i3GEO.util.BOXES[i]).style.display = "none";
		}
	    }
	},
	/**
	 * Function: criaPin
	 *
	 * Cria um elemento imagem com posi&ccedil;&atilde;o fixa na pagina atual.
	 *
	 * A imagem n&atilde;o &eacute; deslocada junto com o mapa
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) id do elemento que sera criado. Por default, sera 'boxpin'
	 *
	 * {URL} - (opcional) endereco da imagem
	 *
	 * {String} - (opcional) largura da imagem
	 *
	 * {String} - (opcional) altura da imagem
	 *
	 * funcao que sera executada no evento mouseover
	 *
	 * Retorno:
	 *
	 * array [boolean,obj] - indica se foi criado ou se ja existia | objeto criado
	 */
	criaPin : function(id, imagem, w, h, mouseover, onde) {
	    if (!id || id === "") {
		id = "boxpin";
	    }
	    if (!imagem || imagem === "") {
		imagem = i3GEO.configura.locaplic + '/imagens/marker.png';
	    }
	    if (!w || w === "") {
		w = 21;
	    }
	    if (!h || h === "") {
		h = 25;
	    }
	    if (!onde || onde === "") {
		onde = document.body;
	    }
	    var p = $i(id);
	    if (!p) {
		var novoel = document.createElement("img");
		novoel.style.zIndex = 10000;
		novoel.style.position = "absolute";
		novoel.style.width = parseInt(w, 10) + "px";
		novoel.style.height = parseInt(h, 10) + "px";
		novoel.style.top = "0px";
		novoel.style.left = "0px";
		novoel.src = imagem;
		novoel.id = id;
		novoel.style.display = "block";
		if (id === "boxpin") {
		    novoel.onmouseover = function() {
			$i("boxpin").style.display = "none";
		    };
		} else if (mouseover) {
		    novoel.onmouseover = mouseover;
		}
		onde.appendChild(novoel);
		i3GEO.util.PINS.push(id);
		return [
		    true, novoel
		    ];
	    }
	    p.style.display = "block";
	    return [
		false, p
		];
	},
	/**
	 * Function: posicionaImagemNoMapa
	 *
	 * Posiciona uma imagem no mapa no local onde o mouse esta posicionado sobre o mapa
	 *
	 * Parametros:
	 *
	 * {string} - id do elemento que sera posicionado
	 *
	 * {posicao do pixel} - se nao for definida ou for vazia, sera utilizado o valor de objposicaocursor.telax
	 *
	 * {posicao do pixel} - se nao for definida ou for vazia, sera utilizado o valor de objposicaocursor.telay
	 *
	 * Return:
	 *
	 * array[top,left] - valores em pixel da posicao calculada da imagem
	 */
	posicionaImagemNoMapa : function(id, x, y) {
	    var i, mx, my;
	    if (!x) {
		x = objposicaocursor.telax;
	    }
	    if (!y) {
		y = objposicaocursor.telay;
	    }
	    i = $i(id);
	    mx = parseInt(i.style.width, 10) / 2;
	    my = parseInt(i.style.height, 10) / 2;
	    i.style.top = y - my + "px";
	    i.style.left = x - mx + "px";
	    return [
		y - my, x - mx
		];
	},
	/**
	 * Function: escondePin
	 *
	 * Esconde os PINS com IDs registrados em i3GEO.util.PINS
	 *
	 * Os ids sao criados pela funcao criaPin
	 */
	escondePin : function() {
	    var l, i;
	    l = i3GEO.util.PINS.length;
	    for (i = 0; i < l; i++) {
		if ($i(i3GEO.util.PINS[i])) {
		    $i(i3GEO.util.PINS[i]).style.display = "none";
		}
	    }
	},
	removePin : function(id) {
	    var l, i, idpin;
	    l = i3GEO.util.PINS.length;
	    for (i = 0; i < l; i++) {
		idpin = i3GEO.util.PINS[i];
		if ($i(idpin)) {
		    if (!id || (id && id === idpin)) {
			$i(idpin).style.display = "none";
			i3GEO.util.removeChild(idpin);
			i3GEO.util.PINS.remove(i);
		    }
		}
	    }
	},
	/**
	 * Depreciado na versao 6.0
	 */
	$im : function(g) {
	    return i3GEO.configura.locaplic + "/imagens/" + g;
	},
	/**
	 * Function $inputText ou nome curto $inputText
	 *
	 * Cria um elemento html do tipo input text com formata&ccedil;&atilde;o especial.
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento pai do input
	 *
	 * {Integer} - largura em pixel
	 *
	 * {String} - id do objeto input
	 *
	 * {String} - texto que vai no title
	 *
	 * {Integer} - numero de digitos do input
	 *
	 * {String} - valor do input
	 *
	 * {String} - name do input
	 *
	 * {String} - (opcional) string que sera inserida no evento "onchange"
	 *
	 */
	$inputText : function(idPai, larguraIdPai, idInput, titulo, digitos, valor, nome, onch) {
	    if (arguments.length === 6) {
		nome = "";
	    }
	    if (idPai !== "") {
		if (larguraIdPai !== "") {
		    $i(idPai).style.width = larguraIdPai + "px";
		}
		$i(idPai).style.padding = "3";
		$i(idPai).style.textAlign = "center";
	    }
	    if (!onch) {
		onch = "";
	    }
	    return "<span ><input onchange=\"" + onch
	    + "\" tabindex='0'  id='"
	    + idInput
	    + "' title='"
	    + titulo
	    + "' type='text' size='"
	    + digitos
	    + "' value='"
	    + valor
	    + "' name='"
	    + nome
	    + "' /></span>";
	},
	// incluir no onmouseover dos itens com cores
	$inputTextMudaCor : function(obj) {
	    var n = obj.value.split(" ");
	    obj.style.color = "rgb(" + n[0] + "," + n[1] + "," + n[2] + ")";
	},
	/**
	 * Function: $top ou nome curto $top
	 *
	 * Muda a posicao (superior) de um objeto tanto no IE como no Firefox.
	 *
	 * Exemplo: $top("imagem",100)
	 *
	 * Parametros:
	 *
	 * {string} - identificador do objeto
	 *
	 * {numeric} - posicao em relacao ao topo.
	 */
	$top : function(id, valor) {
	    if (document.getElementById(id).style) {
		if (document.getElementById(id).style.pixelTop) {
		    document.getElementById(id).style.pixelTop = valor;
		} else {
		    document.getElementById(id).style.top = valor + "px";
		}
	    }
	},
	/**
	 * Function: $left ou nome curto $left
	 *
	 * Muda a posicao (esquerda) de um objeto tanto no IE como no Firefox.
	 *
	 * Exemplo: $left("imagem",100)
	 *
	 * Parametros:
	 *
	 * {string} - identificador do objeto
	 *
	 * {numeric} - posicao em relacao a esquerda.
	 */
	$left : function(id, valor) {
	    if (document.getElementById(id).style) {
		if (document.getElementById(id).style.pixelLeft) {
		    document.getElementById(id).style.pixelLeft = valor;
		} else {
		    document.getElementById(id).style.left = valor + "px";
		}
	    }
	},
	/**
	 * Function: adicionaSHP
	 *
	 * Inclui um arquivo shapefile no mapa atual como uma nova camada
	 *
	 * Parametros:
	 *
	 * {String} - caminho completo do shapefile
	 */
	adicionaSHP : function(path) {
	    var temp = path.split(".");
	    if ((temp[1] === "SHP") || (temp[1] === "shp")) {
		i3GEO.php.adicionaTemaSHP(i3GEO.atualiza, path);
	    } else {
		i3GEO.php.adicionaTemaIMG(i3GEO.atualiza, path);
	    }
	},
	/**
	 * Function: abreCor
	 *
	 * Abre a janela flutuante para escolha de uma cor
	 *
	 * Parametros:
	 *
	 * {String} - id do conteudo da janela flutuante que chamou a funcao. Pode ser "" caso elemento exista em document
	 *
	 * {String} - id do elemento que recebera os valores da cor selecionada
	 *
	 * {String} - opcional pode ser definido como rgb,rgbSep (separado por espacos em branco) ou hex indicando o tipo de retorno da cor
	 */
	abreCor : function(janelaid, elemento, tipo) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.util.abreCor() " + elemento);

	    if (!i3GEO.configura) {
		i3GEO.configura = {
			locaplic : "../"
		};
	    }
	    if (arguments.length === 2) {
		tipo = "rgb";
	    }
	    var janela, ins, novoel, wdocaiframe, wsrc =
		i3GEO.configura.locaplic + "/ferramentas/colorpicker/index.htm?doc=" + janelaid + "&elemento=" + elemento + "&tipo=" + tipo, texto =
		    "Cor", id = "i3geo_janelaCor", classe = "hd";
	    if ($i(id)) {
		YAHOO.i3GEO.janela.manager.find(id).show();
		return;
	    }
	    ins = '<div id="' + id + '_cabecalho" class="hd">';
	    ins +=
		"<span><img id='i3geo_janelaCor_imagemCabecalho' style='visibility:hidden;' src=\'" + i3GEO.configura.locaplic
		+ "/imagens/aguarde.gif\' /></span>";
	    ins += texto;
	    ins += '</div><div id="i3geo_janelaCor_corpo" class="bd" style="padding:5px">';
	    if (wsrc !== "") {
		ins +=
		    '<iframe name="' + id + 'i" id="i3geo_janelaCori" valign="top" style="height:230px,border:0px white solid"></iframe>';
	    }
	    ins += '</div>';
	    novoel = document.createElement("div");
	    novoel.id = "i3geo_janelaCor";
	    novoel.style.display = "block";
	    novoel.innerHTML = ins;
	    if ($i("i3geo")) {
		$i("i3geo").appendChild(novoel);
	    } else {
		document.body.appendChild(novoel);
	    }
	    wdocaiframe = $i("i3geo_janelaCori");
	    if (wdocaiframe) {
		wdocaiframe.style.display = "block";
		wdocaiframe.src = wsrc;
		wdocaiframe.style.height = "250px";
		wdocaiframe.style.width = "355px";
		wdocaiframe.style.border = "0px solid white";
	    }
	    janela = new YAHOO.widget.Panel(id, {
		height : "290px",
		modal : false,
		width : "360px",
		fixedcenter : true,
		constraintoviewport : false,
		visible : true,
		iframe : false,
		strings: {close: "<span class='material-icons'>cancel</span>"}
	    });
	    YAHOO.i3GEO.janela.manager.register(janela);
	    janela.render();
	    $i(id + '_cabecalho').className = classe;
	},
	/**
	 * Function: aparece
	 *
	 * Aplica efeito de aparecimento suave de um objeto
	 *
	 * Parametros:
	 *
	 * {String} - id do objeto
	 *
	 * {Integer} - tempo em milesegundos que levara o efeito
	 *
	 * {Integer} - intervalo entre uma imagem e outra
	 */
	aparece : function(id, tempo, intervalo) {
	    var n, obj, opacidade, fadei = 0, tempoFadei = null;
	    n = parseInt(tempo / intervalo, 10);
	    obj = $i(id);
	    if (n === 1) {
		obj.style.display = "block";
		if (navm) {
		    obj.style.filter = 'alpha(opacity=100)';
		} else {
		    obj.style.opacity = 1;
		}
	    }
	    tempo = n * intervalo;
	    intervalo = (intervalo * 100) / tempo;
	    opacidade = 0;
	    if (navm) {
		obj.style.filter = 'alpha(opacity=0)';
	    } else {
		obj.style.opacity = 0;
	    }
	    obj.style.display = "block";
	    fadei = function() {
		opacidade += intervalo;
		if (navm) {
		    obj.style.filter = 'alpha(opacity=' + opacidade + ')';
		} else {
		    obj.style.opacity = opacidade / 100;
		}
		if (opacidade < 100) {
		    tempoFadei = setTimeout(fadei, tempo);
		} else {
		    if (tempoFadei) {
			clearTimeout(tempoFadei);
		    }
		    if (navm) {
			obj.style.filter = 'alpha(opacity=100)';
		    } else {
			obj.style.opacity = 1;
		    }
		}
	    };
	    tempoFadei = setTimeout(fadei, tempo);
	},
	/**
	 * Function: desaparece
	 *
	 * Aplica efeito de desaparecimento suave de um objeto
	 *
	 * Parametros:
	 *
	 * {String} - id do objeto
	 *
	 * {Integer} - tempo em milesegundos que levara o efeito
	 *
	 * {Integer} - intervalo entre uma imagem e outra
	 *
	 * {Boolean} - remove ou nao o objeto no final
	 */
	desaparece : function(id, tempo, intervalo, removeobj) {
	    var n, obj, opacidade, fade = 0, p, tempoFade = null;
	    n = parseInt(tempo / intervalo, 10);
	    obj = $i(id);
	    if (n === 1) {
		obj.style.display = "none";
		if (removeobj) {
		    p = obj.parentNode;
		    if (p) {
			p.removeChild(obj);
		    }
		}
		return;
	    }
	    tempo = n * intervalo;
	    intervalo = (intervalo * 100) / tempo;
	    opacidade = 100;
	    if (navm) {
		obj.style.filter = 'alpha(opacity=100)';
	    } else {
		obj.style.opacity = 1;
	    }
	    obj.style.display = "block";
	    fade = function() {
		opacidade -= intervalo;
		if (navm) {
		    obj.style.filter = 'alpha(opacity=' + opacidade + ')';
		} else {
		    obj.style.opacity = opacidade / 100;
		}
		if (opacidade > 0) {
		    tempoFade = setTimeout(fade, tempo);
		} else {
		    if (tempoFade) {
			clearTimeout(tempoFade);
		    }
		    obj.style.display = "none";
		    if (navm) {
			obj.style.filter = 'alpha(opacity=100)';
		    } else {
			obj.style.opacity = 1;
		    }
		    if (removeobj) {
			p = obj.parentNode;
			if (p) {
			    p.removeChild(obj);
			}
		    }
		}
	    };
	    tempoFade = setTimeout(fade, tempo);
	},
	/**
	 * Function: wkt2ext
	 *
	 * Calcula a extensao geografica de uma geometria fornecida no formato WKT
	 *
	 * Parametros:
	 *
	 * {String} - geometria no formato wkt
	 *
	 * {String} - tipo de geometria (polygon,point,line)
	 *
	 * Return:
	 *
	 * {String} - extensao geografica (xmin ymin xmax ymax)
	 */
	wkt2ext : function(wkt, tipo) {
	    var re, x, y, w, xMin, xMax, yMin, yMax, temp;
	    tipo = tipo.toLowerCase();
	    ext = false;
	    if (tipo === "polygon") {
		try {
		    re = new RegExp("POLYGON", "g");
		    wkt = wkt.replace(re, "");
		    wkt = wkt.split("(")[2].split(")")[0];
		    wkt = wkt.split(",");
		    x = [];
		    y = [];
		    for (w = 0; w < wkt.length; w++) {
			temp = wkt[w].split(" ");
			x.push(temp[0]);
			y.push(temp[1]);
		    }
		    x.sort(i3GEO.util.sortNumber);
		    xMin = x[0];
		    xMax = x[(x.length) - 1];
		    y.sort(i3GEO.util.sortNumber);
		    yMin = y[0];
		    yMax = y[(y.length) - 1];
		    return xMin + " " + yMin + " " + xMax + " " + yMax;
		} catch (e) {
		}
	    }
	    if (tipo === "point") {
		try {
		    re = new RegExp("POINT", "g");
		    wkt = wkt.replace(re, "");
		    wkt = wkt.split("(")[1].split(")")[0];
		    wkt = wkt.split(" ");
		    return (wkt[0] * 1 - 0.01) + " " + (wkt[1] * 1 - 0.01) + " " + (wkt[0] * 1 + 0.01) + " " + (wkt[1] * 1 + 0.01);
		} catch (e) {
		}
	    }
	    return ext;
	},
	/**
	 * Function: sortNumber
	 *
	 * Ordena um array contendo numeros. Deve ser usado como parametro do metodo "sort", exemplo
	 *
	 * y.sort(i3GEO.util.sortNumber), onde y e um array de numeros
	 */
	sortNumber : function(a, b) {
	    return a - b;
	},
	/**
	 * Function: getScrollerWidth
	 *
	 * Calcula o tamanho da barra de rolagem, permitindo calcular o tamanho correto da area util do navegador
	 *
	 * http://www.fleegix.org/articles/2006-05-30-getting-the-scrollbar-width-in-pixels
	 *
	 * Return:
	 *
	 * largura
	 */
	getScrollerWidth : function() {
	    var scr = null, inn = null, wNoScroll = 0, wScroll = 0;
	    scr = document.createElement('div');
	    scr.style.position = 'absolute';
	    scr.style.top = '-1000px';
	    scr.style.left = '-1000px';
	    scr.style.width = '100px';
	    scr.style.height = '50px';
	    // Start with no scrollbar
	    scr.style.overflow = 'hidden';
	    // Inner content div
	    inn = document.createElement('div');
	    inn.style.width = '100%';
	    inn.style.height = '200px';
	    // Put the inner div in the scrolling div
	    scr.appendChild(inn);
	    // Append the scrolling div to the doc
	    document.body.appendChild(scr);
	    // Width of the inner div sans scrollbar
	    wNoScroll = inn.offsetWidth;
	    // Add the scrollbar
	    scr.style.overflow = 'auto';
	    // Width of the inner div width scrollbar
	    wScroll = inn.offsetWidth;
	    // Remove the scrolling div from the doc
	    document.body.removeChild(document.body.lastChild);
	    // Pixel width of the scroller
	    return (wNoScroll - wScroll);
	},
	/**
	 * Function: getScrollHeight
	 *
	 * Calcula o tamanho vertical do browser
	 *
	 * http://w3schools.invisionzone.com/index.php?showtopic=45977
	 *
	 * Return:
	 *
	 * altura
	 */
	getScrollHeight : function() {
	    var mx = Math.max, d = document;
	    return mx(mx(d.body.scrollHeight, d.documentElement.scrollHeight), mx(d.body.offsetHeight, d.documentElement.offsetHeight), mx(
		    d.body.clientHeight,
		    d.documentElement.clientHeight));

	    /**
	     * var maxDisplacement=0; window.scrollTo(0,10000000); if( typeof self.pageYOffset!='undefined' )
	     * maxDisplacement=self.pageYOffset; else if( document.compatMode && document.compatMode != 'BackCompat' )
	     * maxDisplacement=document.documentElement.scrollTop ; else if( document.body && typeof(document.body.scrollTop)!='undefined' )
	     * maxDisplacement=document.body.scrollTop; window.scrollTo(0,0); return maxDisplacement;
	     */
	},
	/**
	 * Function: scriptTag
	 *
	 * Insere um javascript no documento HTML
	 *
	 * Parametros:
	 *
	 * {String} - endereco do JS
	 *
	 * {String} ou {function} - funcao que sera executada ao ser carregado o script (pode ser "")
	 *
	 * {string} - id do elemento script que sera criado
	 *
	 * {boolean} - mostra ou nao a janela de aguarde
	 */
	scriptTag : function(js, ini, id, aguarde) {
	    var head, script;
	    if (!$i(id) || id === "") {
		i3GEO.janela.abreAguarde();
		head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.type = 'text/javascript';
		if (ini !== "") {
		    script.onload = function() {
			i3GEO.janela.fechaAguarde();
			if (ini.call) {
			    ini.call();
			} else {
			    eval(ini);
			}
		    };
		} else {
		    i3GEO.janela.fechaAguarde();
		}
		script.src = js;
		if (id !== "") {
		    script.id = id;
		}
		head.appendChild(script);
	    } else {
		if (ini !== "") {
		    if (jQuery.isFunction(ini)) {
			ini.call();
		    } else {
			eval(ini);
		    }
		}
	    }
	},
	/**
	 * Function: removeScriptTag
	 *
	 * Remove um javascript no documento HTML
	 *
	 * Parametros:
	 *
	 * {string} - id do elemento script que sera removido
	 */
	removeScriptTag : function(id) {
	    try {
		old = $i("loadscriptI3GEO");
		if (old !== null) {
		    old.parentNode.removeChild(old);
		    old = null;
		    eval(id + " = null;");
		}
		old = $i(id);
		if (old !== null) {
		    old.parentNode.removeChild(old);
		}
	    } catch (erro) {
	    }
	},
	/**
	 * Function: verificaScriptTag
	 *
	 * Verifica se um javascript esta carregado no documento.
	 *
	 * util para verificar se existe alguma ferramenta ativa ao procurar por i3GEOF.
	 *
	 * Parametros:
	 *
	 * {string} - nome do javascript
	 *
	 * Retorno:
	 *
	 * {boolean}
	 */
	verificaScriptTag : function(texto) {
	    var s = document.getElementsByTagName("script"), n = s.length, i, t;
	    try {
		for (i = 0; i < n; i++) {
		    t = s[i].id;
		    t = t.split(".");
		    //
		    // dicionario_script pode ter sido incluido por alguma ferramenta e nao foi removido
		    // por isso, caso seja encontrado a funcao retorna false como se o script procurado nao existisse
		    //
		    if (t[2] && t[2] == "dicionario_script") {
			return false;
		    }
		    if (t[0] === texto) {
			return true;
		    }
		}
		return false;
	    } catch (e) {
		return false;
	    }
	},
	/**
	 * Function: mensagemAjuda
	 *
	 * Formata uma mensagem de texto com icone de ?
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento que recebera a mensagem
	 *
	 * {String} - texto da mensagem
	 */
	mensagemAjuda : function(onde, texto) {
	    var ins =
		"<table class='mensagemAjuda' ><tr><th>";
	    ins += '<div style="float:right"></div>';
	    ins += '<div style="text-align:left;">';
	    if (texto === "") {
		texto = $i(onde).innerHTML;
	    }
	    ins += texto;
	    ins += '</div></th></tr></table>';
	    if (onde !== "") {
		$i(onde).innerHTML = ins;
	    } else {
		return (ins);
	    }
	},
	/**
	 * Function: randomRGB
	 *
	 * Gera uma cor RGB de forma aleatoria
	 *
	 * Return:
	 *
	 * {String} - r,g,b
	 */
	randomRGB : function() {
	    var v = Math.random(), r = parseInt(255 * v, 10), g;
	    v = Math.random();
	    g = parseInt(255 * v, 10);
	    v = Math.random();
	    b = parseInt(255 * v, 10);
	    return (r + "," + g + "," + b);
	},
	/**
	 * Function: rgb2hex
	 *
	 * Converte uma cor RGB para HEX
	 *
	 * Parametro:
	 *
	 * {String} - r,g,b
	 *
	 * Return:
	 *
	 * {String}
	 */
	rgb2hex : function(str) {
	    var rgb = str.split(",");
	    function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	    }
	    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
	},
	hex2rgb : function(colour) {
	    var r,g,b;
	    if ( colour.charAt(0) == '#' ) {
		colour = colour.substr(1);
	    }
	    if ( colour.length == 3 ) {
		colour = colour.substr(0,1) + colour.substr(0,1) + colour.substr(1,2) + colour.substr(1,2) + colour.substr(2,3) + colour.substr(2,3);
	    }
	    r = colour.charAt(0) + '' + colour.charAt(1);
	    g = colour.charAt(2) + '' + colour.charAt(3);
	    b = colour.charAt(4) + '' + colour.charAt(5);
	    r = parseInt( r,16 );
	    g = parseInt( g,16 );
	    b = parseInt( b ,16);
	    return r + ',' + g + ',' + b ;
	},
	/**
	 * Function: comboTemas
	 *
	 * Cria um combo (caixa de selesao) com a lista de temas existentes no mapa e de determinado tipo
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * funcao {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera como parametros um Array
	 * associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.: {dados:comboTemas,tipo:"dados"} tipo sera uma string
	 * que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.
	 *
	 * {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	 *
	 * {String} - valor que sera incluido no parametro "name" do elemento "select".
	 *
	 * {Booleano} - indica se o combo permite selecoes multiplas
	 *
	 * {String} - Tipo de temas que serao incluidos no combo ligados|selecionados|raster|pontosSelecionados|pontos|linhaDoTempo
	 *
	 * {string} - estilo (css) que sera aplicado ao combo
	 *
	 * {boolean} - (opcional) indica se o combo sera montado com o estilo YUI (menu)
	 *
	 * {boolean} - (opcional) inclui um option vazio
	 */
	comboTemas : function(id, funcao, onde, nome, multiplo, tipoCombo, estilo, yui, incluiVazio, classe) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.util.comboTemas()");

	    if (onde && onde !== "") {
		//i3GEO.util.defineValor(onde, "innerHTML", "<span style=color:red;font-size:10px; >buscando temas...</span>");
	    }
	    if (!nome) {
		nome = "";
	    }
	    if (!multiplo) {
		multiplo = false;
	    }
	    if (!incluiVazio) {
		incluiVazio = false;
	    }
	    if(!classe){
		classe = "form-control";
	    }
	    var monta, temp, temp1, temp2;
	    monta =	function(retorno) {
		var i, comboTemas = '', n, nomeopt = "", tema;
		if (retorno == undefined || retorno.length == 0 || (retorno.data && retorno.data.length == 0)) {
		    retorno = {"data": [{"tema":"","nome":"---"}]};
		    incluiVazio = false;
		}
		if (retorno !== undefined) {
		    if (retorno.data) {
			retorno = retorno.data;
		    }
		    n = retorno.length;
		    if (n > 0) {
			if (multiplo) {
			    comboTemas +=
				"<select class='" + classe + "' id='" + id + "' size='4' multiple='multiple' name='" + nome + "'>";
			} else {
			    comboTemas += "<select class='" + classe + "' id='" + id + "' name='" + nome + "'>";
			}
			if (incluiVazio === true) {
			    //comboTemas += "<option value=''>"+$trad("x92")+"</option>";
			    comboTemas += "<option value=''>---</option>";
			}
			for (i = 0; i < n; i++) {
			    if (retorno[i].nome) {
				nomeopt = retorno[i].nome;
				tema = retorno[i].tema;
			    } else {
				nomeopt = retorno[i].tema;
				tema = retorno[i].name;
			    }
			    if (retorno[i].escondido !== "sim") {
				comboTemas += "<option value=" + tema + " >" + nomeopt + "</option>";
			    }
			}
			comboTemas += "</select><b class='caret careti'></b>";
			temp = {
				dados : comboTemas,
				tipo : "dados"
			};
		    } else {
			if (tipoCombo === "poligonosSelecionados" || tipoCombo === "selecionados" || tipoCombo === "pontosSelecionados") {
			    temp =
			    {
				    dados : '<div class=alerta >Nenhum tema encontrado. <span style=cursor:pointer;color:blue onclick="i3GEO.mapa.dialogo.selecao()" > Selecionar...</span></div>',
				    tipo : "mensagem"
			    };
			} else {
			    temp = {
				    dados : '<div class=alerta >Nenhum tema encontrado. </div>',
				    tipo : "mensagem"
			    };
			}
		    }
		    eval("funcao(temp);");
		} else {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		}
	    };
	    if (tipoCombo === "ligados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("status", 2, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.php.listaTemas(monta, "ligados", i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoCombo === "ligadosComTabela") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("status", 2, "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		    temp1 = i3GEO.arvoreDeCamadas.filtraCamadas("type", 3, "menor", temp);
		    temp2 = i3GEO.arvoreDeCamadas.filtraCamadas("type", 8, "igual", temp);
		    monta(temp1.concat(temp2));
		} else {
		    i3GEO.php.listaTemas(monta, "ligados", i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoCombo === "comTabela") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("status", 3, "menor", i3GEO.arvoreDeCamadas.CAMADAS);
		    temp1 = i3GEO.arvoreDeCamadas.filtraCamadas("type", 3, "menor", temp);
		    temp2 = i3GEO.arvoreDeCamadas.filtraCamadas("type", 8, "igual", temp);
		    monta(temp1.concat(temp2));
		}
	    }
	    if (tipoCombo === "locais") {
		i3GEO.php.listaTemasEditaveis(monta, i3GEO.configura.locaplic, i3GEO.configura.sid);
	    }
	    if (tipoCombo === "editavel") {
		temp = i3GEO.arvoreDeCamadas.filtraCamadas("editavel", "SIM", "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		monta(temp);
	    }
	    if (tipoCombo === "selecionados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel", "sim", "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.php.listaTemasComSel(monta, i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoCombo === "raster") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", 3, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.php.listatemasTipo(monta, "raster", i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoCombo === "pontosSelecionados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 0, "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel", "sim", "igual", temp));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "pontos") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", 0, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "poligonos") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", 2, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "naoraster") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 4, "diferente", i3GEO.arvoreDeCamadas.CAMADAS);
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 5, "diferente", temp);
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 6, "diferente", temp);
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 7, "diferente", temp);
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", 8, "diferente", temp));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "poligonosSelecionados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 2, "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel", "sim", "igual", temp));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "naolinearSelecionados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 1, "diferente", i3GEO.arvoreDeCamadas.CAMADAS);
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel", "sim", "igual", temp));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "linhaDoTempo") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("linhadotempo", "sim", "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	    if (tipoCombo === "") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", "", "diferente", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.janela.tempoMsg($trad("x13"));
		}
	    }
	},
	/**
	 * Function: checkCombo
	 *
	 * Cria uma lista com check box generico baseado em um objeto com os dados
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * {Array} - array com os nomes
	 *
	 * {Array} - array com os valores
	 *
	 * {objeto} - objeto contendo name e value, exemplo {"nome":"a","valor":"1"}
	 *
	 * {string} - string inserida no item style do container do combo
	 *
	 * {string} - string inserida no evento onclick
	 *
	 * {array} - (opcional) array com os ids de cada checkbox
	 *
	 * {array} - (opcional) array com os ids dos elementos marcados como selecionados
	 *
	 */
	checkCombo : function(id, nomes, valores, estilo, funcaoclick, ids, idschecked) {
	    var temp, i, combo = "", n = valores.length;
	    if(!funcaoclick){
		funcaoclick = "";
	    }
	    if (n > 0) {
		combo = "<div id=" + id + " style='" + estilo + "'>";
		for (i = 0; i < n; i++) {
		    temp = "";
		    if (idschecked && idschecked[i]) {
			temp = "checked";
		    }
		    if (!ids) {
			combo += "<li class='checkbox text-left'>"
			    + "<label style='width:90%'>"
			    +"	<input " + temp + "type='checkbox' value='"+valores[i]+"' onclick="+funcaoclick+" >"
			    +"	<span class='checkbox-material'><span class='check'></span></span> " + nomes[i]
			+"</label></li>";
		    } else {
			combo += "<li class='checkbox text-left'>"
			    + "<label style='width:90%'>"
			    +"	<input " + temp + "type='checkbox' id="+ids[i]+" value='"+valores[i]+"' onclick="+funcaoclick+" >"
			    +"	<span class='checkbox-material'><span class='check'></span></span> " + nomes[i]
			+"</label></li>";
		    }
		}
		combo += "</div>";
	    }
	    return combo;
	},
	valoresCheckCombo : function(id) {
	    var el = $i(id), res = [], n, i;
	    if (el) {
		el = el.getElementsByTagName("input");
		n = el.length;
		for (i = 0; i < n; i++) {
		    if (el[i].checked === true) {
			res.push(el[i].value);
		    }
		}
	    }
	    return res;
	},
	/**
	 * Function: checkTemas
	 *
	 * Cria uma lista com check box de temas existentes no mapa e de determinado tipo
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * funcao {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera como parametros um Array
	 * associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.: {dados:comboTemas,tipo:"dados"} tipo sera uma string
	 * que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.
	 *
	 * {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	 *
	 * {String} - valor que sera incluido no parametro "name" do elemento "select".
	 *
	 * {String} - Tipo de temas que serao incluidos na lista ligados|selecionados|raster|pontosSelecionados|pontos|polraster
	 *
	 * {string} - Prefixo que sera usado no id de cada elemento
	 *
	 * {numeric} - tamanho dos elementos input editaveis
	 */
	checkTemas : function(id, funcao, onde, nome, tipoLista, prefixo, size) {
	    if (arguments.length > 2) {
		$i(onde).innerHTML = "buscando temas...";
	    }
	    if (arguments.length === 3) {
		nome = "";
	    }
	    var monta, temp, temp1, n, i;
	    monta =
		function(retorno) {
		try {
		    var i, comboTemas, n, nome, listaNomes = [], listaValores = [];
		    if (retorno !== undefined) {
			if (retorno.data) {
			    retorno = retorno.data;
			}
			n = retorno.length;
			if (n > 0) {
			    comboTemas = "";
			    for (i = 0; i < n; i++) {
				if (retorno[i].nome) {
				    nome = retorno[i].nome;
				    tema = retorno[i].tema;
				} else {
				    nome = retorno[i].tema;
				    tema = retorno[i].name;
				}
				listaNomes.push(nome);
				listaValores.push(tema);
				comboTemas += "<tr><td><input size=2 style='cursor:pointer' type=checkbox name='" + tema + "' /></td>";
				comboTemas +=
				    "<td>&nbsp;<input style='text-align:left;width:" + size
				    + " cursor:text;' onclick='javascript:this.select();' id='"
				    + prefixo
				    + tema
				    + "' type=text value='"
				    + nome
				    + "' /></td></tr>";
			    }

			    temp = {
				    dados : comboTemas,
				    tipo : "dados"
			    };
			} else {
			    temp = {
				    dados : '<div class=alerta >Nenhum tema encontrado.</div>',
				    tipo : "mensagem"
			    };
			}
		    } else {
			temp = {
				dados : "<p style=color:red >Ocorreu um erro<br>",
				tipo : "erro"
			};
		    }
		    eval("funcao(temp,listaNomes,listaValores);");
		} catch (e) {
		}
	    };
	    if (tipoLista === "ligados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("status", 2, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.php.listaTemas(monta, "ligados", i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoLista === "selecionados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel", "sim", "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.php.listaTemasComSel(monta, i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoLista === "raster") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", 3, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    i3GEO.php.listatemasTipo(monta, "raster", i3GEO.configura.locaplic, i3GEO.configura.sid);
		}
	    }
	    if (tipoLista === "polraster") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 3, "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		    temp1 = i3GEO.arvoreDeCamadas.filtraCamadas("type", 2, "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		    n = temp1.length;
		    for (i = 0; i < n; i++) {
			temp.push(temp1[i]);
		    }
		    monta(temp);
		} else {
		    alert($trad("x13"));
		}
	    }
	    if (tipoLista === "pontosSelecionados") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    temp = i3GEO.arvoreDeCamadas.filtraCamadas("type", 0, "igual", i3GEO.arvoreDeCamadas.CAMADAS);
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel", "sim", "igual", temp));
		} else {
		    alert($trad("x13"));
		}
	    }
	    if (tipoLista === "pontos") {
		if (i3GEO.arvoreDeCamadas.CAMADAS !== "") {
		    monta(i3GEO.arvoreDeCamadas.filtraCamadas("type", 0, "igual", i3GEO.arvoreDeCamadas.CAMADAS));
		} else {
		    alert($trad("x13"));
		}
	    }
	},
	/**
	 * Function: comboItens
	 *
	 * Cria um combo (caixa de selecao) com a lista de itens de um layer
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * {String} - codigo do tema (layer)
	 *
	 * {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera como parametros um Array associativo
	 * contendo os dados em HTML gerados e o tipo de resultado. P.ex.: {dados:comboTemas,tipo:"dados"} tipo sera uma string que pode ser
	 * "dados"|"mensagem"|"erro" indicando o tipo de retorno.
	 *
	 * {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	 *
	 * {String} - valor que sera incluido no parametro "name" do elemento "select".
	 *
	 * {string} sim|nao indica se para os nomes dos itens sera usado o alias (default= sim)
	 *
	 * {string} - estilo CSS em linha
	 *
	 * {string} - classe css
	 */
	comboItens : function(id, tema, funcao, onde, nome, alias, estilo, classe) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.util.comboItens()");

	    if(!classe){
		classe = "";
	    }
	    if (!estilo) {
		estilo = "";
	    } else {
		estilo = "style=" + estilo;
	    }
	    if (!alias) {
		alias = "sim";
	    }
	    if (arguments.length > 3 && $i(onde)) {
		$i(onde).innerHTML = "<span>buscando itens...</span>";
	    }
	    if (arguments.length < 5) {
		nome = "";
	    }

	    var monta = function(retorno) {
		if (typeof (console) !== 'undefined')
		    console.info("monta combo");

		var ins, temp, i, nm;
		if (retorno.data !== undefined) {
		    ins = [];
		    ins.push("<select class='" + classe + "' " + estilo + " id='" + id + "' name='" + nome + "'>");
		    ins.push("<option value='' >---</option>");
		    temp = retorno.data.valores.length;
		    for (i = 0; i < temp; i++) {
			if (retorno.data.valores[i].tema === tema) {
			    if (alias == "sim") {
				nm = retorno.data.valores[i].alias;
				if (nm === "") {
				    nm = retorno.data.valores[i].item;
				}
			    } else {
				nm = retorno.data.valores[i].item;
			    }
			    ins.push("<option value='" + retorno.data.valores[i].item + "' >" + nm + "</option>");
			}
		    }
		    ins.push("</select><b class='caret careti' ></b>");
		    ins = ins.join('');
		    temp = {
			    dados : ins,
			    tipo : "dados"
		    };
		} else {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		}
		if (jQuery.isFunction(funcao)) {
		    funcao.call(this, temp);
		} else {
		    eval("funcao(temp)");
		}
	    };
	    i3GEO.php.listaItensTema(monta, tema);
	},
	/**
	 * Function: comboValoresItem
	 *
	 * Cria uma caixa de selecao com os valores de um item de um tema
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * {String} - codigo do tema (layer)
	 *
	 * {String} - nome do item
	 *
	 * {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera como parametros um Array associativo
	 * contendo os dados em HTML gerados e o tipo de resultado. P.ex.: {dados:comboTemas,tipo:"dados"} tipo sera uma string que pode ser
	 * "dados"|"mensagem"|"erro" indicando o tipo de retorno.
	 *
	 * {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	 */
	comboValoresItem : function(id, tema, itemTema, funcao, onde, classe) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.util.comboValoresItem()");

	    if (arguments.length === 5) {
		$i(onde).innerHTML = "<span style=color:red;font-size:10px; >buscando valores...</span>";
	    }
	    if (arguments.length < 6) {
		classe = "";
	    }
	    var monta = function(retorno) {
		if (typeof (console) !== 'undefined')
		    console.info("monta");

		var ins = [], i, pares, j, valoresSort = [];
		if (retorno.data !== undefined) {
		    ins.push("<select class='" + classe + "' id=" + id + " >");
		    ins.push("<option value='' >---</option>");
		    if(retorno.data[1].registros){
			for (i = 0; i < retorno.data[1].registros.length; i++) {
			    pares = retorno.data[1].registros[i].valores;
			    for (j = 0; j < pares.length; j++) {
				valoresSort.push(pares[j].valor);
			    }
			}
		    } else {
			for (i = 0; i < retorno.data.length; i++) {
			    valoresSort.push(retorno.data[i]);
			}
		    }
		    valoresSort.sort();
		    for (j = 0; j < valoresSort.length; j++) {
			ins.push('<option value="' + valoresSort[j] + '" >' + valoresSort[j] + '</option>');
		    }
		    ins.push("</select><b class='caret careti' ></b>");
		    ins = ins.join('');
		    temp = {
			    dados : ins,
			    tipo : "dados"
		    };
		} else {
		    temp = {
			    dados : '<div class=erro >Ocorreu um erro</erro>',
			    tipo : "erro"
		    };
		}
		if (jQuery.isFunction(funcao)) {
		    funcao.call(this, temp);
		} else {
		    eval("funcao(temp)");
		}
	    };
	    i3GEO.php.listaValoresItensTema(monta, tema, itemTema);
	},
	/**
	 * Function: comboFontes
	 *
	 * Cria um combo (caixa de selecao) com a lista fontes de texto disponiveis
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	 */
	comboFontes : function(id, onde, classe, sel) {
	    if(!classe){
		classe= "";
	    }
	    var monta = function(retorno) {
		var ins = "", temp, i, dados;
		if (retorno.data !== undefined) {
		    ins += "<select name='font' class='" + classe + "' id='" + id + "'>";
		    ins += "<option value='arial' >arial</option>";
		    ins += "<option value='bitmap' >bitmap</option>";
		    dados = retorno.data.split(",");
		    temp = dados.length;
		    for (i = 0; i < temp; i++) {
			ins += "<option value='" + dados[i] + "' >" + dados[i] + "</option>";
		    }
		    ins += "</select><b class='caret careti' ></b>";
		}
		$i(onde).innerHTML = ins;
		if(sel){
		    $i(id).value = sel;
		}
	    };
	    i3GEO.php.listaFontesTexto(monta);
	},
	/**
	 * Function: comboSimNao
	 *
	 * Cria uma caixa de selecao com as palavras sim e nao
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento select que sera criado
	 *
	 * {string} - qual valor estara selecionado sim|nao
	 *
	 * Return:
	 *
	 * {string}
	 */
	comboSimNao : function(id, selecionado) {
	    var combo = "<select class='form-control' name=" + id + " id=" + id + " >";
	    combo += "<option value='' >---</option>";
	    if (selecionado.toLowerCase() === "sim") {
		combo += "<option value=TRUE selected >" + $trad("x14") + "</option>";
	    } else {
		combo += "<option value=TRUE >" + $trad("x14") + "</option>";
	    }
	    if (selecionado === "nao") {
		combo += "<option value=FALSE selected >" + $trad("x15") + "</option>";
	    } else {
		combo += "<option value=FALSE >" + $trad("x15") + "</option>";
	    }
	    combo += "</select><b class='caret careti' ></b>";
	    return (combo);
	},
	/**
	 * Function: checkItensEditaveis
	 *
	 * Cria uma lista de elementos do tipo input com textos editaveis contendo a lista de itens de um tema.
	 *
	 * Parametros:
	 *
	 * {string} - codigo do layer existente no mapa
	 *
	 * {function} - funcao que sera executada para montar a lista. Essa funcao recebera como parametro um array do tipo
	 * {dados:ins,tipo:"dados"} onde ins e um array com as linhas e tipo e o tipo de resultado, que pode ser "dados"|"erro"
	 *
	 * {string} - id do elemento que recebera a mensagem de aguarde
	 *
	 * {numeric} - tamanho dos elementos input editaveis
	 *
	 * {string} - Prefixo que sera usado no id de cada elemento
	 *
	 * {sim|nao} - Indica se a colouna que permite indicar a ordem das escolhas sera ou nao incluida
	 */
	checkItensEditaveis : function(tema, funcao, onde, size, prefixo, ordenacao) {
	    if (!ordenacao || ordenacao == "") {
		ordenacao = "nao";
	    }
	    if (onde !== "") {
		$i(onde).innerHTML = "<span style=color:red;font-size:10px; >" + $trad("x65") + "</span>";
	    }
	    var monta =
		function(retorno) {
		var ins = [], i, temp, n;
		if (retorno.data !== undefined) {
		    if (ordenacao === "sim") {
			ins.push("<table class=lista7 ><tr><td></td><td>" + $trad("x64") + "</td><td>Ordem</td>");
		    } else {
			ins.push("<table class=lista7 ><tr><td></td><td>" + $trad("x64") + "</td><td></td>");
		    }
		    n = retorno.data.valores.length;
		    for (i = 0; i < n; i++) {
			ins.push("<tr><td><div class='checkbox text-left'><label><input name='" + retorno.data.valores[i].tema + "' id='" + prefixo + retorno.data.valores[i].item +"' type='checkbox'><span class='checkbox-material noprint'><span class='check'></span></span></label></div>" + "</td>");
			ins.push("<td><div class='form-group condensed' ><input class='form-control' style='width:" + size
				+ "' id='"
				+ prefixo
				+ retorno.data.valores[i].item
				+ retorno.data.valores[i].tema
				+ "' type=text value='"
				+ retorno.data.valores[i].item
				+ "' /></div></td>");
			if (ordenacao === "sim") {
			    ins.push("<td><div class='form-group condensed' ><input class='form-control' id='ordem_" + prefixo
				    + retorno.data.valores[i].item
				    + retorno.data.valores[i].tema
				    + "' type=text size='3' value='"
				    + i
				    + "' /></div></td>");
			} else {
			    ins.push("<td></td>");
			}
			ins.push("</tr>");
		    }
		    ins.push("</table>");
		    ins = ins.join('');
		    temp = {
			    dados : ins,
			    tipo : "dados"
		    };
		} else {
		    temp = {
			    dados : '<div class=erro >' + $trad("x66") + '</div>',
			    tipo : "erro"
		    };
		}
		funcao.call(this, temp);
	    };
	    i3GEO.php.listaItensTema(monta, tema);
	},
	/**
	 * Function: radioEpsg
	 *
	 * Cria uma lista de codigos EPSG para o usuario escolher um deles.
	 *
	 * A lista e mostrada como uma serie de elementos do tipo radio com "name" igual ao prefixo mais a palavra EPSG
	 *
	 * Parametros:
	 *
	 * {function} - funcao que sera executada para montar a lista. Essa funcao recebera como parametro um array do tipo
	 * {dados:ins,tipo:"dados"} onde ins e um array com as linhas e tipo e o tipo de resultado, que pode ser "dados"|"erro"
	 *
	 * {string} - id do elemento que recebera a mensagem de aguarde
	 *
	 * {string} - Prefixo que sera usado no name de cada elemento
	 *
	 * {string} - sim|nao Marca como escolhido o primeiro valor
	 */
	radioEpsg : function(funcao, onde, prefixo, marcado) {
	    var c;
	    if (arguments.length === 2) {
		$i(onde).innerHTML = "<span style=color:red;font-size:10px; >buscando...</span>";
	    }
	    c = "checked";
	    if(marcado && marcado === "nao"){
		c = "";
	    }
	    var monta =
		function(retorno) {
		var ins = [], i, n, temp;
		if (retorno.data !== undefined) {
		    ins.push("<table class=lista2 >");
		    n = retorno.data.length;
		    for (i = 0; i < n; i++) {
			ins.push("<tr><td><input size=2 style='border:0px solid white;cursor:pointer' " + c
				+ " name='"
				+ prefixo
				+ "EPSG' type=radio value='"
				+ retorno.data[i].codigo
				+ "' /></td>");
			c = "";
			ins.push("<td>" + retorno.data[i].nome + "</td></tr>");
		    }
		    ins.push("</table>");
		    ins = ins.join('');
		    temp = {
			    dados : ins,
			    tipo : "dados"
		    };
		} else {
		    temp = {
			    dados : '<div class=erro >Ocorreu um erro</div>',
			    tipo : "erro"
		    };
		}
		funcao(temp);
	    };
	    i3GEO.php.listaEpsg(monta);
	},
	/**
	 * Function: comboEpsg
	 *
	 * Cria uma lista de codigos EPSG para o usuario escolher um deles.
	 *
	 * Parametros:
	 *
	 * {string} - id que sera atribuido ao combo
	 *
	 * {string} - id do elemento HTML que recebera o combo
	 *
	 * {string} - nome da funcao que sera inserida em onChange
	 *
	 * {string} - valor default do combo
	 */
	comboEpsg : function(idCombo, onde, funcaoOnChange, valorDefault) {
	    onde = $i(onde);
	    onde.innerHTML = "<span style=color:red;font-size:10px; >buscando...</span>";
	    if(!funcaoOnChange){
		funcaoOnChange = "";
	    }
	    if(!valorDefault){
		valorDefault = "";
	    }
	    var monta = function(retorno) {
		var ins = [], i, n;
		if (retorno.data !== undefined) {
		    n = retorno.data.length;
		    ins.push("<select class='form-control' name='" + idCombo + "' id='" + idCombo + "' onChange='" + funcaoOnChange + "(this)' >");
		    for (i = 0; i < n; i++) {
			ins.push("<option value='" + retorno.data[i].codigo + "'>" + retorno.data[i].nome + "</option>");
		    }
		    ins.push("</select><b class='caret careti' ></b>");
		    ins = ins.join('');
		    onde.innerHTML = ins;
		    $i(idCombo).value = valorDefault;
		} else {
		    onde.innerHTML = '<div class=erro >Ocorreu um erro</div>';
		}
	    };
	    i3GEO.php.listaEpsg(monta);
	},
	/**
	 * Function: proximoAnterior
	 *
	 * Cria uma sequencia de opcoes com botao de anterior e proximo. e utilizado principalmente pelas ferramentas de analise espacial,
	 * onde o usuario segue uma sequencia de operacoes de escolha de parametros.
	 *
	 * Parametros:
	 *
	 * {String} - nome da funcao que e executada para voltar a tela anterior. Pode ser "".
	 *
	 * {String} - nome da funcao que e executada para avancar para a proxima tela. Pode ser "".
	 *
	 * {String} - texto que compora a tela atual
	 *
	 * {String} - id do elemento DIV que sera criado para inserir o conteudo definido em 'texto"
	 *
	 * {String} - id do elemento DIV ja existente que recebera as telas (texto).
	 *
	 * {boolean} - mantem ou nao no container o texto ja produzido
	 *
	 * {string} - (opcional) id onde os botoes serao colocados
	 */
	proximoAnterior : function(anterior, proxima, texto, idatual, container, mantem, onde) {
	    if (typeof (console) !== 'undefined')
		console.info("proximoAnterior ");

	    var c,temp = $i(idatual), botoes = "", ndiv = document.createElement("div"), nids, i;
	    if (!mantem) {
		mantem = false;
	    }
	    c = $i(container);
	    if(!c){
		if (typeof (console) !== 'undefined')
		    console.info(container + " nao encontrado");

		return;
	    }
	    if (temp && mantem == false && c) {
		c.removeChild(temp);
	    }
	    if(c && c.style){
		//c.style.backgroundColor = "white";
	    }
	    botoes = "<ul class='proximoAnterior pager condensed'>";
	    if (anterior !== "") {
		anterior = anterior.replace("()","");
		botoes +=
		    "<li><a onclick='" + anterior + "();$(\"#" + container + "\").get(0).scrollIntoView();' class='withripple condensed' href='javascript:void(0)'><i class='material-icons'>navigate_before</i> " + $trad("anterior") + "</a></li>";
	    }
	    if (proxima !== "") {
		proxima = proxima.replace("()","");
		botoes +=
		    "<li><a onclick='" + proxima + "();$(\"#" + container + "\").get(0).scrollIntoView();' class='withripple condensed' href='javascript:void(0)'>" + $trad("proximo") + " <i class='material-icons'>navigate_next</i></a></li>";
	    }
	    botoes += "</ul>";
	    if (onde) {
		$i(onde).innerHTML = botoes;
	    } else {
		texto = texto + "<br><br>" + botoes;
	    }
	    if (!document.getElementById(idatual)) {
		ndiv.id = idatual;
		ndiv.innerHTML = texto;
		c.appendChild(ndiv);
	    }
	    temp = c.getElementsByTagName("div");
	    nids = temp.length;
	    for (i = 0; i < nids; i++) {
		temp[i].style.display = "none";
	    }
	    $i(idatual).style.display = "block";
	    temp = $i(idatual).getElementsByTagName("div");
	    nids = temp.length;
	    for (i = 0; i < nids; i++) {
		temp[i].style.display = "block";
	    }
	},
	/**
	 * Function: dialogoFerramenta
	 *
	 * Atalho para abrir a janela de dialogo de uma ferramenta padrao
	 *
	 * O script adicionado tera como ID "i3GEOF."+nome+"_script"
	 *
	 * Se a funcao de inicializacao nao for definida em nomefuncao, sera utilizado "i3GEOF."+nome+".criaJanelaFlutuante();"
	 *
	 * Se o script ja estiver carregado, a funcao de inicializacao sera executada
	 *
	 * Parametros:
	 *
	 * {string} - mensagem que sera enviada ao console no caso do Firefox
	 *
	 * {string} - diretorio em i3geo/ferramentas
	 *
	 * {string} - nome da classe da ferramenta
	 *
	 * {string} - nome do arquivo javascript
	 *
	 * {string} ou {function} - nome da funcao do javascript carregado que sera executado apos a carga, exemplo:
	 * i3GEOF.locregiao.abreComFiltro()
	 */
	dialogoFerramenta : function(mensagem, dir, nome, nomejs, nomefuncao) {
	    if (!nomejs) {
		nomejs = "index.js";
	    }
	    if (!nomefuncao) {
		nomefuncao = "i3GEOF." + nome + ".criaJanelaFlutuante();";
	    }
	    var js = i3GEO.configura.locaplic + "/ferramentas/" + dir + "/" + nomejs;
	    if (!$i("i3GEOF." + nome + "_script")) {
		i3GEO.util.scriptTag(js, nomefuncao, "i3GEOF." + nome + "_script");
	    } else {
		i3GEO.util.scriptTag(js, nomefuncao, "i3GEOF." + nome + "_script");
	    }
	},
	/**
	 * Function: intersectaBox
	 *
	 * Verifica se um retangulo esta dentro de outro retangulo
	 *
	 * Parametros:
	 *
	 * {string} - retangulo que sera verificado
	 *
	 * {string} - retangulo de referencia
	 *
	 * Return:
	 *
	 * boolean
	 */
	intersectaBox : function(box1, box2) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.util.intersectaBox()" + box1 + "  " + box2);

	    box1 = box1.split(" ");
	    box2 = box2.split(" ");
	    var box1i = box2, box2i = box1, coordx, coordy;
	    coordx = box1[0] * 1;
	    coordy = box1[1] * 1;
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }
	    coordx = box1[2] * 1;
	    coordy = box1[3] * 1;
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }
	    coordx = box1[2] * 1;
	    coordy = box1[1] * 1;
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }

	    box1 = box1i;
	    box2 = box2i;

	    coordx = box1[0] * 1;
	    coordy = box1[1] * 1;
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }
	    coordx = box1[2] * 1;
	    coordy = box1[3] * 1;
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }
	    coordx = box1[2] * 1;
	    coordy = box1[1] * 1;
	    if (coordx >= box2[0] * 1 && coordx <= box2[2] * 1 && coordy >= box2[1] * 1 && coordy <= box2[3] * 1) {
		return true;
	    }

	    return false;
	},
	/**
	 * Function: abreColourRamp
	 *
	 * Abre a janela flutuante para escolha de um degrade de cores
	 *
	 * Parametros:
	 *
	 * {String} - id do conteudo da janela flutuante que chamou a funcao. Pode ser "" caso o 'elemento' exista em window.document
	 *
	 * {String} - id do elemento HTML (um input por exemplo) que recebera os valores da cor selecionada. O evento 'onchange' desse
	 * elemento sera acionado quando o botao aplicar for clicado
	 *
	 * {numerico} - numero de cores default ao abrir o seletor de cores
	 *
	 * {string} - (opcional) nome do tema default que sera mostrado no combo de selecao de temas
	 *
	 * {string} - (opcional) valor do estilo 'display' que sera aplicado ao combo. Usado para esconder o combo quando se quer apenas a janela de selecao de cores
	 */
	abreColourRamp : function(janelaid, elemento, ncores,temaSel, displayComboTemas) {
	    var janela, ins, novoel, wdocaiframe, temp, fix = false, wsrc =
		i3GEO.configura.locaplic + "/ferramentas/colourramp/index.php?ncores="
		+ ncores
		+ "&doc="
		+ janelaid
		+ "&elemento="
		+ elemento
		+ "&locaplic="
		+ i3GEO.configura.locaplic, // +janela+"&elemento="+elemento+"&tipo="+tipo,
		nx = "", texto = "", id = "i3geo_janelaCorRamp", classe = "hd";
	    if(!temaSel){
		temaSel = "";
	    }
	    if ($i(id)) {
		janela = YAHOO.i3GEO.janela.manager.find(id);
		janela.show();
		janela.bringToTop();
		return;
	    }
	    ins = '<div id="' + id + '_cabecalho" class="hd" style="left:10px;">';
	    if (i3GEO && i3GEO.arvoreDeCamadas) {
		ins += "<div  id='i3geo_janelaCorRampComboCabeca' class='comboTemasCabecalhoBs form-group' style='width:200px;top:0px;display:none;'>   ------</div>";
	    }
	    ins += "&nbsp;&nbsp;&nbsp;" + texto;
	    ins += '</div><div id="i3geo_janelaCorRamp_corpo" class="bd" style="padding:5px">';
	    ins += '<iframe name="' + id + 'i" id="i3geo_janelaCorRampi" valign="top" ></iframe>';
	    ins += '</div>';
	    novoel = document.createElement("div");
	    novoel.id = "i3geo_janelaCorRamp";
	    novoel.style.display = "block";
	    novoel.innerHTML = ins;
	    if ($i("i3geo")) {
		$i("i3geo").appendChild(novoel);
	    } else {
		document.body.appendChild(novoel);
	    }
	    wdocaiframe = $i("i3geo_janelaCorRampi");
	    wdocaiframe.style.display = "block";
	    wdocaiframe.src = wsrc;
	    wdocaiframe.style.height = "400px";
	    wdocaiframe.style.width = "100%";
	    wdocaiframe.style.border = "0px solid white";

	    if (nx === "" || nx === "center") {
		fix = true;
	    }
	    janela = new YAHOO.widget.Panel(id, {
		height : "480px",
		modal : false,
		width : "295px",
		fixedcenter : fix,
		constraintoviewport : true,
		visible : true,
		iframe : false,
		strings: {close: "<span class='material-icons'>cancel</span>"}
	    });

	    YAHOO.i3GEO.janela.manager.register(janela);
	    janela.render();
	    $i(id + '_cabecalho').className = classe;
	    if ($i("i3geo_janelaCorRampComboCabeca")) {
		temp =
		    function() {
		    var p, tema = $i("i3geo_janelaCorRampComboCabecaSel").value, funcao = function(retorno) {
			parent.frames["i3geo_janelaCorRampi"].document.getElementById("ncores").value = retorno.data.length;
		    };
		    if (tema !== "") {
			i3GEO.mapa.ativaTema(tema);
			// pega o numero de classes nalegenda do tema escolhido
			p =
			    i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
			    + i3GEO.configura.sid
			    + "&funcao=editalegenda&opcao=edita&tema="
			    + tema;
			i3GEO.util.ajaxGet(p, funcao);
			cp = new cpaint();
		    }
		};
		i3GEO.janela.comboCabecalhoTemasBs(
			"i3geo_janelaCorRampComboCabeca",
			"i3geo_janelaCorRampComboCabecaSel",
			"none",
			"ligados",
			temp,
			temaSel);
	    }
	},
	/**
	 * Tenta identificar onde os JS do i3Geo estao localizados
	 *
	 * Aplica o resultado a variavel i3GEO.configura.locaplic
	 *
	 * Return:
	 *
	 * {string} - url onde esta instalado o i3geo
	 */
	localizai3GEO : function() {
	    var scriptLocation = "", scripts = document.getElementsByTagName('script'), i = 0, index, ns = scripts.length, src;
	    for (i = 0; i < ns; i++) {
		src = scripts[i].getAttribute('src');
		if (src) {
		    index = src.lastIndexOf("/js/i3geo.js");
		    // is it found, at the end of the URL?
		    if ((index > -1) && (index + "/js/i3geo.js".length === src.length)) {
			scriptLocation = src.slice(0, -"/js/i3geo.js".length);
			break;
		    }
		    index = src.lastIndexOf("/js/i3geonaocompacto.js");
		    if ((index > -1) && (index + "/js/i3geonaocompacto.js".length === src.length)) {
			scriptLocation = src.slice(0, -"/js/i3geonaocompacto.js".length);
			break;
		    }
		}
	    }
	    if (i3GEO.configura) {
		i3GEO.configura.locaplic = scriptLocation;
	    }
	    return scriptLocation;
	},
	/**
	 * Function: removeChild
	 *
	 * Remove um filho de um elemento DOM
	 *
	 * Pode-se especificar o pai e o filho a ser removido ou simplesmente o ID do no que se quer remover
	 *
	 * Parametros:
	 *
	 * {string} - id do elemento que sera removido (filho)
	 *
	 * {node} - (opcional) node (DOM) que contem o elemento. Se nao for definido, sera obtido o parent de id
	 */
	removeChild : function(id, el) {
	    var j = $i(id);
	    if (j) {
		if (!el) {
		    el = j.parentNode;
		}
		el.removeChild(j);
	    }
	},
	/**
	 * Function: defineValor
	 *
	 * Aplica um valor a uma propriedade de um elemento
	 *
	 * Parametros:
	 *
	 * {string} - id do elemento que sera removido (filho)
	 *
	 * {string} - propriedade que recebera o valor
	 *
	 * {string} - valor que sera aplicado
	 */
	defineValor : function(id, prop, valor) {
	    var o = $i(id);
	    if(o && o[prop]){
		try {
		    o[prop] = valor;
		} catch (e) {
		}
	    }
	},
	/**
	 * Function: in_array
	 *
	 * Procura a ocorrencia de um elemento em um array
	 *
	 * Parametros:
	 *
	 * {string} - o que sera procurado
	 *
	 * {array} - array
	 *
	 * Return:
	 *
	 * {boolean}
	 */
	in_array : function(x, matriz) {
	    var txt = " " + matriz.join(" ") + " ";
	    var er = new RegExp(" " + x + " ", "gim");
	    return ((txt.match(er)) ? true : false);
	},
	timedProcessArray : function(items, process, callback) {
	    var todo = items.concat();
	    setTimeout(function() {
		var start = +new Date();
		do {
		    process(todo.shift());
		} while (todo.length > 0 && (+new date() - start < 50));
		if (todo.length > 0) {
		    setTimeout(arguments.callee, 25);
		} else {
		    callback(items);
		}
	    }, 25);
	},
	/**
	 * Function: multiStep
	 *
	 * Implementa a tecnica de particionamento para execussao de funcoes no modo assincrono
	 *
	 * Conforme pagina 144 do livro "Javascript de alto desempenho, Nicholas Zakas
	 *
	 * Parametros:
	 *
	 * {array} - funcoes que serao executadas
	 *
	 * {array} - array de arrays com os argumentos de cada funcao
	 *
	 * {function} - funcao que sera executada ao terminar os processos
	 */
	multiStep : function(steps, args, callback) {
	    var tasks = steps.concat();// cria um clone
	    setTimeout(function() {
		var task = tasks.shift(), a = args.shift();
		task.apply(null, a || []);
		if (tasks.length > 0) {
		    setTimeout(arguments.callee, 25);
		} else {
		    callback();
		}
	    }, 25);
	},
	/**
	 * Function: tamanhoBrowser
	 *
	 * Calcula o tamanho da area util do navegador considerando-se as propriedades nativas do objeto window
	 *
	 * Return:
	 *
	 * {[w,h]}
	 */
	tamanhoBrowser : function() {
	    var viewportwidth, viewportheight;
	    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	    if (typeof window.innerWidth != 'undefined') {
		viewportwidth = window.innerWidth, viewportheight = window.innerHeight;
	    }

	    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

	    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined'
		&& document.documentElement.clientWidth != 0) {
		viewportwidth = document.documentElement.clientWidth, viewportheight = document.documentElement.clientHeight;
	    }

	    // older versions of IE

	    else {
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth, viewportheight =
		    document.getElementsByTagName('body')[0].clientHeight;
	    }
	    viewportwidth = viewportwidth - i3GEO.util.getScrollerWidth();
	    return [
		viewportwidth, viewportheight
		];
	},
	/**
	 * Function: detectaTablet
	 *
	 * Verifica se esta em uso um dispositivo do tipo tablet
	 *
	 * Se for detectado, utiliza a interface alternativa definida em i3GEO.Interface.ALTTABLET
	 *
	 * A deteccao e feita com base em i3geo/pacotes/mobileesp/mdetect.js
	 *
	 */
	detectaTablet : function() {
	    var c = DetectaMobile("DetectTierTablet");
	    if (c === false) {
		return false;
	    } else {
		return true;
	    }
	},
	/**
	 * Function: detectaMobile
	 *
	 * Verifica se esta em uso um dispositivo do tipo movel
	 *
	 * Se for detectado, utiliza a interface alternativa definida em i3GEO.Interface.ALTTABLET
	 *
	 * A deteccao e feita com base em i3geo/pacotes/mobileesp/mdetect.js
	 *
	 */
	detectaMobile : function() {
	    var c = DetectaMobile("DetectMobileLong");
	    if (c === false) {
		return false;
	    } else {
		return true;
	    }
	},
	/**
	 * Function: calculaDPI
	 *
	 * Calcula o valor de DPI do monitor.
	 *
	 * O valor e aproximado e utilizado principalmente na interface OpenLayers
	 */
	calculaDPI : function() {
	    var novoel = document.createElement("div"), valor = 72;
	    // novoel.id = 'testeCalculaDPI';
	    novoel.style.height = "1in";
	    novoel.style.left = "-100%";
	    novoel.style.position = "absolute";
	    novoel.style.top = "-100%";
	    novoel.style.width = "1in";
	    document.body.appendChild(novoel);
	    if (novoel.offsetHeight) {
		valor = novoel.offsetHeight;
	    }
	    document.body.removeChild(novoel);
	    return valor;
	},
	/**
	 * Function: ajustaDocType
	 *
	 * Ajusta o DOCTYPE do HTML para funcionar com CSS3
	 */
	ajustaDocType : function() {
	    try {
		if (document.implementation.createDocumentType) {
		    var newDoctype =
			document.implementation.createDocumentType(
				'html',
				'-//W3C//DTD XHTML 1.0 Transitional//EN',
			'http://www.w3.org/TR/html4/loose.dtd');
		    // var newDoctype = document.implementation.createDocumentType('HTML');
		    if (document.doctype) {
			document.doctype.parentNode.replaceChild(newDoctype, document.doctype);
		    }
		}
	    } catch (e) {
	    }
	},
	/**
	 * Function: versaoNavegador
	 *
	 * Retorna algumas versoes de navegador
	 */
	versaoNavegador : function() {
	    if (navm && navigator.userAgent.toLowerCase().indexOf('msie 8.') > -1) {
		return "IE8";
	    }
	    if (navn && navigator.userAgent.toLowerCase().indexOf('3.') > -1) {
		return "FF3";
	    }
	    return "";
	},
	/**
	 * Function: decimalPlaces
	 *
	 * Arredonda um numero
	 *
	 * Obtido de
	 *
	 * http://stackoverflow.com/questions/4868556/how-do-i-stop-parsefloat-from-stripping-zeroes-to-right-of-decimal/4868718#4868718
	 *
	 *
	 * Parameters:
	 *
	 * {numer} - numero que sera arredondado
	 *
	 * {number} - numero de casas decimais
	 */
	decimalPlaces : function(f, l) {
	    var ret = "", str = f.toString(), array = str.split("."), i;
	    if (array.length == 2) {
		ret += array[0] + ".";
		for (i = 0; i < l; i++) {
		    if (i >= array[1].length)
			ret += '0';
		    else
			ret += array[1][i];
		}
	    } else if (array.length == 1) {
		ret += array[0] + ".";
		for (i = 0; i < l; i++) {
		    ret += '0';
		}
	    }
	    return ret;
	},
	/**
	 * Function: ajaxGet
	 *
	 * Faz uma requisi&ccedil;&atilde;o ao servidor por meio de AJAX
	 *
	 * A fun&ccedil;&atilde;o de processamento do resultado ir&aacute; receber um objeto JSON como par&acirc;metro
	 *
	 * Exemplo:
	 *
	 * i3GEO.util.ajaxGet("http://localhost/teste.php",function(retorno){alert(retorno);})
	 *
	 * Parametros:
	 *
	 * {string} - url que ser&aacute; requisitada
	 *
	 * {function} - fun&ccedil;&atilde;o que ir&aacute; processar o resultado
	 */
	ajaxGet : function(sUrl, funcaoRetorno) {
	    var re,falhou, callback;
	    sUrl = escape(sUrl);
	    re = new RegExp("%3F", "g");
	    sUrl = sUrl.replace(re, '?');
	    re = new RegExp("%3D", "g");
	    sUrl = sUrl.replace(re, '=');
	    re = new RegExp("%26", "g");
	    sUrl = sUrl.replace(re, '&');

	    re = new RegExp("%3A", "g");
	    sUrl = sUrl.replace(re, ':');
	    falhou = function(e) {
	    };
	    callback = {
		    success : function(o) {
			try {
			    funcaoRetorno.call("", JSON.parse(o.responseText));
			} catch (e) {
			    falhou(e);
			}
		    },
		    failure : falhou,
		    argument : {
			foo : "foo",
			bar : "bar"
		    }
	    };
	    YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
	},
	/**
	 * Verifica se a funcao html de armazenamento local esta disponivel no navegador
	 */
	verifica_html5_storage : function() {
	    if (typeof (Storage) !== "undefined") {
		return true;
	    } else {
		return false;
	    }
	},
	/**
	 * Function: pegaDadosLocal
	 *
	 * Obtem um valor armazenado localmente
	 *
	 * Parametro:
	 *
	 * {string} - key a ser obtido
	 *
	 * Return:
	 *
	 * array
	 */
	pegaDadosLocal : function(item) {
	    if (i3GEO.util.verifica_html5_storage() && localStorage[item]) {
		return window.localStorage[item];
	    } else {
		return false;
	    }
	},
	/**
	 * Function: limpaDadosLocal
	 *
	 * Limpa os dados locais
	 *
	 * Parametro:
	 *
	 * {string} - key a ser limpo
	 */
	limpaDadosLocal : function(item) {
	    if (i3GEO.util.verifica_html5_storage() && localStorage[item]) {
		window.localStorage.clear(item);
	    }
	},
	/**
	 * Function: gravaDadosLocal
	 *
	 * Grava um valor localmente
	 *
	 * Parametro:
	 *
	 * {string} - key a ser gravado
	 *
	 * {string} - valor a ser gravado
	 *
	 */
	gravaDadosLocal : function(item, valor) {
	    if (i3GEO.util.verifica_html5_storage()) {
		window.localStorage[item] = valor;
		return true;
	    } else {
		return false;
	    }
	},
	/**
	 * Function: extGeo2OSM
	 *
	 * Converte string 'xmin ymin xmax ymax' ou 'xmin ymin' de geo para a projecao OSM
	 */
	extGeo2OSM : function(ext, retornaArray) {
	    var metrica, point, temp, sep;
	    sep = " ";
	    if (typeof ext == "object") {
		return i3GEO.util.projGeo2OSM(ext);
	    }
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		temp = ext.split(sep);
		if (temp === 1) {
		    sep = ",";
		    temp = ext.split(sep);
		}
		if (temp[0] * 1 <= 180 && temp[0] * 1 >= -180) {
		    point = new ol.geom.Point([temp[0]*1, temp[1]*1]);
		    metrica = point.transform("EPSG:4326","EPSG:3857");
		    ext = metrica.getCoordinates()[0] + sep + metrica.getCoordinates()[1];
		    if (temp.length > 2) {
			point = new ol.geom.Point([temp[2]*1, temp[3]*1]);
			metrica = point.transform("EPSG:4326","EPSG:3857");
			ext += sep + metrica.getCoordinates()[0] + sep + metrica.getCoordinates()[1];
		    }
		}
	    }
	    if (retornaArray) {
		return ext.split(sep);
	    } else {
		return ext;
	    }
	},
	/**
	 * Function: extOSM2Geo
	 *
	 * Converte string 'xmin ymin xmax ymax' ou 'xmin ymin' de geo para a projecao OSM
	 */
	extOSM2Geo : function(ext, retornaArray) {
	    var point, temp, sep;
	    sep = " ";
	    if (typeof ext == "object") {
		return i3GEO.util.projOSM2Geo(ext);
	    }
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		temp = ext.split(sep);
		if (temp === 1) {
		    sep = ",";
		    temp = ext.split(sep);
		}
		if (temp[0] * 1 >= 180 || temp[0] * 1 <= -180) {
		    point = new ol.geom.Point([temp[0], temp[1]]);
		    point.transform("EPSG:3857","EPSG:4326");
		    ext = point.getCoordinates()[0] + sep + point.getCoordinates()[1];
		    if (temp.length > 2) {
			point = new ol.geom.Point([temp[2], temp[3]]);
			point.transform("EPSG:3857","EPSG:4326");
			ext += sep + point.getCoordinates()[0] + sep + point.getCoordinates()[1];
		    }
		}
	    }
	    if (retornaArray) {
		return ext.split(sep);
	    } else {
		return ext;
	    }
	},
	/**
	 * Function: projOSM2Geo
	 *
	 * Projeta um objeto OpenLayers de OSM para GEO
	 */
	projOSM2Geo : function(obj) {
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		var clone = obj.clone();
		clone.transform("EPSG:3857","EPSG:4326");
		return clone;
	    }else{
		return obj;
	    }
	},
	/**
	 * Function: projGeo2OSM
	 *
	 * Projeta um objeto OpenLayers de GEO para OSM
	 */
	projGeo2OSM : function(obj) {
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		var clone = obj.clone();
		clone.transform("EPSG:4326","EPSG:3857");
		return clone;
	    }else{
		return obj;
	    }
	},
	/**
	 * Function: navegadorDir
	 *
	 * Abre o navegador de arquivos localizados no servidor
	 *
	 * Parametro:
	 *
	 * {objeto} - objeto input que recebera de volta o valor do arquivo escolhido
	 *
	 * {boolean} - considera os arquivos shapefile
	 *
	 * {boolean} - considera os arquivos de imagem (geo)
	 *
	 * {boolean} considera os arquivos de tipo figura (png e jpg)
	 *
	 * {boolean} insere um botao para retornar o nome da pasta
	 */
	navegadorDir : function(obj, listaShp, listaImg, listaFig, retornaDir) {
	    if (!obj) {
		listaShp = true;
		listaImg = true;
		listaFig = true;
		retornaDir = false;
	    }
	    var temp = function() {
		i3GEOF.navegarquivos.iniciaDicionario(obj, listaShp, listaImg, listaFig, retornaDir);
	    };
	    i3GEO.util.dialogoFerramenta("i3GEO.util.navegadorDir()", "navegarquivos", "navegarquivos", "index.js", temp);
	},
	/**
	 * Function base64encode
	 *
	 * Atalho para a funcao que codifica uma string em base64
	 *
	 * Parametro:
	 *
	 * {string}
	 *
	 * Retorno:
	 *
	 * {base64}
	 */
	base64encode : function(str) {
	    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	    var out, i, len;
	    var c1, c2, c3;

	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
		    out += base64EncodeChars.charAt(c1 >> 2);
		    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
		    out += "==";
		    break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
		    out += base64EncodeChars.charAt(c1 >> 2);
		    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
		    out += "=";
		    break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
	    }
	    return out;
	},
	/**
	 * Function base64decode
	 *
	 * Atalho para a funcao que decodifica uma string de base64
	 *
	 * Parametro:
	 *
	 * {string}
	 *
	 * Retorno:
	 *
	 * {string}
	 */
	base64decode : function(str) {
	    var base64DecodeChars =
		new Array(
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			62,
			-1,
			-1,
			-1,
			63,
			52,
			53,
			54,
			55,
			56,
			57,
			58,
			59,
			60,
			61,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			-1,
			-1,
			-1,
			-1,
			-1,
			-1,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			46,
			47,
			48,
			49,
			50,
			51,
			-1,
			-1,
			-1,
			-1,
			-1);
	    var c1, c2, c3, c4;
	    var i, len, out;

	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
		/** c1 */
		do {
		    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c1 == -1);
		if (c1 == -1)
		    break;

		/** c2 */
		do {
		    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c2 == -1);
		if (c2 == -1)
		    break;

		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

		/** c3 */
		do {
		    c3 = str.charCodeAt(i++) & 0xff;
		    if (c3 == 61)
			return out;
		    c3 = base64DecodeChars[c3];
		} while (i < len && c3 == -1);
		if (c3 == -1)
		    break;

		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

		/** c4 */
		do {
		    c4 = str.charCodeAt(i++) & 0xff;
		    if (c4 == 61)
			return out;
		    c4 = base64DecodeChars[c4];
		} while (i < len && c4 == -1);
		if (c4 == -1)
		    break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	    }
	    return out;
	},
	/**
	 * Function: cloneObj
	 *
	 * Cria um clone de um objeto.
	 *
	 * Exemplo:
	 *
	 * cloneObj = i3GEO.util.cloneObj(origObj);
	 */
	cloneObj : function(obj) {
	    if (obj == null || typeof (obj) != 'object')
		return obj;

	    var temp = new obj.constructor();
	    for ( var key in obj)
		temp[key] = i3GEO.util.cloneObj(obj[key]);

	    return temp;
	},
	/**
	 * Function: aplicaAquarela
	 *
	 * Formata c&oacute;digo HTML para incluir um &iacute;cone para abrir o colorPicker
	 *
	 * Todos os elementos abaixo de 'onde' que contenham a classe css 'i3geoFormIconeAquarela' ser&aatilde;o atingidas
	 *
	 * Exemplo:
	 *
	 * <div id='foo'><div class='i3geoForm100 i3geoFormIconeAquarela' > <input type='text' id='i3GEOlegendaacori' value='0,0,0' />
	 * </div></div>
	 *
	 * <script>i3GEO.util.aplicaAquarela("foo");</script>
	 */
	aplicaAquarela : function(onde) {
	    //id pode ter ponto !!!
	    $($i(onde)).find(".i3geoFormIconeAquarela").click(function() {
		if(this.firstChild){
		    i3GEO.util.abreCor("", $(this).find("input")[0].id);
		} else {
		    i3GEO.util.abreCor("", this.id);
		}
	    });
	},
	/**
	 * Depreciado na versao 6.0
	 */
	insereMarca : {
	    cria : function() {
		alert("i3GEO.util.insereMarca foi depreciado. Veja a classe i3GEO.desenho");
	    },
	    limpa : function() {
	    }
	},
	/**
	 * Function: animaCique
	 *
	 * Aplica um efeito sobre um elemento quando e feito o clique
	 *
	 * Parameters:
	 *
	 * {objeto dom}
	 */
	animaClique : function(obj) {
	    if (obj) {
		//fecha o streetview
		if(i3GEO.Interface.ATUAL === "googlemaps"){
		    i3GeoMap.getStreetView().setVisible(false);
		}
		obj.style.visibility = "hidden";
		setTimeout(function() {
		    obj.style.visibility = "visible";
		}, 50);
	    }
	},
	/**
	 * Function: parseMustache
	 *
	 * Parser de hash e template com Mustache. Troca caracter & amp; para &
	 *
	 * Parameters:
	 *
	 * {string}
	 *
	 * {objeto}
	 */
	parseMustache : function(templateMustache, hashMustache){
	    var re = new RegExp("&amp;", "g"), m;
	    m = Mustache.render(templateMustache, hashMustache);
	    m = m.replace(re, '&');
	    return m;
	},
	checaHtmlVazio: function(id){
	    var i = $i(id);
	    if(!i){
		return null;
	    }
	    if(i.innerHTML.replace(/^\s+|\s+$/, '') == ""){
		return true;
	    } else {
		return false;
	    }
	},
	/**
	 * Function: uid
	 *
	 * Retorna um ID unico baseado no tempo
	 */
	uid : (function () {
	    var counter = 0;
	    return function () {counter += 1; return (new Date().getTime()).toString(36) + counter}
	})(),
	/**
	 * Function: copyToClipboard
	 *
	 * Copia um texto para o clipboar
	 *
	 * Parameters:
	 *
	 * {string}
	 */
	copyToClipboard : function(texto) {
	    if (window.clipboardData && window.clipboardData.setData) {
		// IE specific code path to prevent textarea being shown while dialog is visible.
		return clipboardData.setData("Text", texto);

	    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.setAttribute('readonly', '');
		textarea.textContent = texto;
		textarea.value = texto;
		textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
		textarea.className = "copyToMemory";
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		try {
		    document.execCommand("copy");  // Security exception may be thrown by some browsers.
		} catch (ex) {
		    return false;
		} finally {
		    document.body.removeChild(textarea);
		    i3GEO.janela.snackBar({content: $trad("copytomemory"),timeout: 1000});
		}
	    }
	},
	/**
	 * Function: getFormData
	 *
	 * Serializa os elementos de um formulario usando jQuery
	 *
	 * Exemplo: i3GEO.util.getFormData('#some-form')
	 *
	 * Parameters:
	 *
	 * {dom_query}
	 *
	 * Return:
	 *
	 * {object}
	 */
	getFormData: function(dom_query){
	    var out = {};
	    for (const s_data of $(dom_query).find('input').serializeArray()) {
		out[s_data.name] = s_data.value;
	    }
	    for (const s_data of $(dom_query).find('select').serializeArray()) {
		out[s_data.name] = s_data.value;
	    }
	    return out;
	},
	/*
	 * Baseado em http://codedevelopr.com/articles/form-field-values-jquery-plugin-get-and-set-all-form-field-values-with-javascript/
	 */
	setFormData: function(dom_query,data){
	    for (const s_data of $(dom_query).find('input')) {
		if(data[s_data.name]){
		    s_data.value = data[s_data.name]
		}
	    }
	    for (const s_data of $(dom_query).find('select')) {
		if(data[s_data.name]){
		    s_data.value = data[s_data.name]
		}
	    }
	},
	/**
	 * Function: dynamicSortString
	 *
	 * Funcao de ordenamento de um array de objetos que considera um indice do tipo string
	 *
	 * Exemplo: [{"a":"aaaaa"},{"a":"bbbbb"}].sort(i3GEO.util.dynamicSortString("a"))
	 *
	 * veja https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
	 *
	 * Parameters:
	 *
	 * {string}
	 *
	 */
	dynamicSortString: function(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	    }
	    return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	    }
	}
};

//alias
//depreciado na versao 6.0
var $im = function(g) {
    return i3GEO.util.$im(g);
};
var $inputText = function(idPai, larguraIdPai, idInput, titulo, digitos, valor, nome, onch) {
    if (arguments.length === 6) {
	nome = "";
    }
    return i3GEO.util.$inputText(idPai, larguraIdPai, idInput, titulo, digitos, valor, nome, onch);
};