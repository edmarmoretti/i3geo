/**
 * Title: Controle de usu&aacute;rio
 *
 * Controla o sistema de login e &aacute;rea restrita dos usu&aacute;rios
 *
 * Em i3GEO.login.dialogo estao as funcoes de abertura dos dialogos
 *
 * Namespace:
 *
 * i3GEO.login
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_login.js>
 */

/**
 * Licen&ccedil;a
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
i3GEO.login = {
	/**
	 * Propriedade: divnomelogin
	 *
	 * Id do DIV existente no mapa e que recebera o nome do usuario apos o login para ser
	 * mostrado no mapa.
	 *
	 * Type:
	 *
	 * {String}
	 *
	 * Default:
	 *
	 * i3GEONomeLogin
	 */
	divnomelogin : "i3GEONomeLogin",
	/**
	 * Propriedade: recarrega
	 *
	 * Recarrega ou nao a pagina atual apos o login
	 *
	 * Tipo:
	 *
	 * {boolean}
	 *
	 * Default:
	 *
	 * false
	 */
	recarrega : false,
	/**
	 * Propriedade: funcaoLoginOk
	 *
	 * Funcao que sera executada quando o login ocorrer de forma correta
	 *
	 * Tipo:
	 *
	 * {function}
	 *
	 * Default:
	 *
	 * null
	 */
	funcaoLoginOk : null,
	/**
	 * Propriedade: funcaoLoginErro
	 *
	 * Funcao que sera executada quando o login ocorrer de forma errada
	 *
	 * Tipo:
	 *
	 * {function}
	 *
	 * Default:
	 *
	 * null
	 */
	funcaoLoginErro : null,
	/**
	 * Remove os cookies que guardam a informacao de login
	 */
	anulaCookie : function() {
		i3GEO.util.insereCookie(
			"i3geocodigologin",
			"",
			0);
		i3GEO.util.insereCookie(
			"i3geousuariologin",
			"",
			0);
		i3GEO.util.insereCookie(
			"i3geousuarionome",
			"",
			0);
		i3GEO.util.insereCookie(
			"i3GeoLogin",
			"",
			0);
	},
	/**
	 * Verifica se o cookie de login esta ativo
	 *
	 * Return:
	 *
	 * Boolean
	 */
	verificaCookieLogin : function() {
		var a = i3GEO.util.pegaCookie("i3geocodigologin"), b = i3GEO.util.pegaCookie("i3geousuarionome");
		if (a
			&& b
			&& a != ""
			&& b != "") {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * Verifica se uma operacao pode ser executada
	 */
	verificaOperacao : function(operacao, locaplic, funcaoOk, tipo, funcaoErro) {
		var p = "", cp, temp, resultado = true;
		if (!i3GEO.login.verificaCookieLogin()) {
			if (!funcaoErro) {
				alert("Login...!");
			} else {
				funcaoErro.call();
			}
			return false;
		}
		if (!locaplic) {
			locaplic = i3GEO.configura.locaplic;
		}
		temp = function(retorno) {
			if (retorno.data == "naopermitido"){
				alert($trad("naoPermitido"));
				return false;
			}
			if (retorno.data == "sim") {
				resultado = true;
			} else {
				resultado = false;
			}
			if (resultado === true) {
				if (funcaoOk
					&& funcaoOk != "") {
					funcaoOk.call();
				}
			} else {
				if ($i(i3GEO.login.divnomelogin)) {
					$i(i3GEO.login.divnomelogin).innerHTML = "";
					i3GEO.login.anulaCookie();
				}
				if (funcaoErro
					&& funcaoErro != ""
					&& resultado === false) {
					funcaoErro.call();
				}
			}
			return resultado;
		};
		// verificacao rapida, busca apenas na sessao do usuario ja aberta
		if (!tipo || tipo === "sessao") {
			p = locaplic
				+ "/admin/php/login.php?funcao=validaoperacaosessao";
		}
		// verifica no banoc de dados, o que considera qualquer mudanca no banco
		// feita apos o usuario ter aberto a sessao
		//XXX implementar funcao validaoperacaobanco
		if (tipo === "banco") {
			p = locaplic
				+ "/admin/php/login.php?funcao=validaoperacaobanco";
		}
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.set_transfer_mode("POST");
		cp.call(
			p,
			"login",
			temp,
			"&operacao="
				+ operacao);
	},
	/**
	 * Section: i3GEO.login.dialogo
	 *
	 * Abre as telas de di&aacute;logo com o usu&aacute;rio
	 *
	 * Exemplo:
	 *
	 * Para abrir a mensagem de dialogo de login, utilize
	 *
	 * i3GEO.login.dialogo.abreLogin();
	 *
	 * Para abrir a mensagem de dialogo de logout, utilize
	 *
	 * i3GEO.login.dialogo.abreLogout()
	 */
	dialogo : {
		/**
		 * Function: abreLogin
		 *
		 * Abre a tela de login
		 */
		abreLogin : function(locaplic) {
			var js;
			if (!locaplic || locaplic == "") {
				locaplic = i3GEO.configura.locaplic;
			}
			if (typeof (i3GEOF.loginusuario) === 'undefined') {
				js = locaplic
					+ "/ferramentas/loginusuario/dependencias.php";
				i3GEO.util.scriptTag(
					js,
					"i3GEOF.loginusuario.start()",
					"i3GEOF.loginusuario_script()");
			} else {
				i3GEOF.loginusuario.start();
			}
		},
		/**
		 * Function: abreLogout
		 *
		 * Abre a tela de logout
		 */
		abreLogout : function() {
			var r = confirm($trad("x26"));
			if (r == true) {
				i3GEO.login.anulaCookie();
				if(i3GEO.janela){
					i3GEO.janela.destroi("i3GEOF.loginusuario");
				}
				if ($i(i3GEO.login.divnomelogin)) {
					$i(i3GEO.login.divnomelogin).innerHTML = "";
				}
				if (i3GEO.login.recarrega === true) {
					document.location.reload();
				}
				if (i3GEO.parametros) {
					i3GEO.parametros.editor = "nao";
					if(i3GEO.catalogoMenus){
						i3GEO.catalogoMenus.listaMenus();
					}
				}
			}
		}
	}
};