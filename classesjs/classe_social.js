/**
 * Title: Social
 * 
 * Op&ccedil;&otilde;es de compartilhamento e uso de redes sociais.
 * 
 * Namespace:
 * 
 * i3GEO.social
 * 
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_social.js>
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
i3GEO.social =
	{
		curtirFacebook : function(url, tipo) {
			if (tipo === "comtotal") {
				return "<iframe src='http://www.facebook.com/plugins/like.php?href="
					+ url
					+ "&layout=button_count&show_faces=false&width=160&action=like&colorscheme=light&height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:160px; height:21px;' allowTransparency='true'></iframe>";
			}
			if (tipo === "semtotal") {
				return "<iframe src='http://www.facebook.com/plugins/like.php?href="
					+ url
					+ "&layout=button_count&show_faces=false&action=like&colorscheme=light&height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:100px; height:21px;' allowTransparency='true'></iframe>";
			}
		},
		publicarTwitter : function(url, tipo) {
			var re = new RegExp("=", "g");
			url = url.replace(re, '%3d');
			if (tipo === "comtotal") {
				return '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?count=horizontal&via=i3geo&url='
					+ url + '" style="width:100px; height:21px;"></iframe>';
			}
			if (tipo === "semtotal") {
				return '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?count=none&via=i3geo&url='
					+ url + '" style="width:65px; height:21px;"></iframe>';
			}
		},
		/**
		 * Function: compartilhar
		 * 
		 * Cria os bot&otilde;es de publicar no Twitter e curtir/compartilhar no Facebook
		 * 
		 * Gera o HTML contendo as tags IMG com os links
		 * 
		 * Parametros:
		 * 
		 * {string} - id do elemento HTML que receber&aacute; os links
		 * 
		 * {string} - url para o Facebook
		 * 
		 * {string} - url para o Twitter
		 * 
		 * {string} - tipo de bot&atilde;o comtotal|semtotal
		 * 
		 * {string} - url onde est&aacute; o i3Geo. Se n&atilde;o for especificada, ser&aacute; obtida de i3GEO.configura.locaplic
		 * 
		 * Return:
		 * 
		 * HTML com os bot&otilde;es
		 */
		compartilhar : function(id, urlcf, urlpt, tipo, locaplic) {
			if (!locaplic) {
				locaplic = i3GEO.configura.locaplic;
			}
			if (!tipo) {
				tipo = "comtotal";
			}
			var onde = $i(id), tabela = "";
			if (tipo === "comtotal") {
				tabela += "<table style='width:250px' ><tr>";
			}
			if (tipo === "semtotal") {
				tabela += "<table style='width:115px' ><tr>";
			}
			if (onde || id === "") {
				if (urlpt !== "") {
					tabela += "<td>" + i3GEO.social.publicarTwitter(urlpt, tipo) + "</td>";
				}
				if (urlcf !== "") {
					// tabela += "<td><img style='cursor:pointer' src='"+locaplic+"/imagens/facebook.gif'
					// onclick='javascript:window.open(\"http://www.facebook.com/sharer.php?u="+urlcf+"\")' title='Compartilhar'/></td>";
					tabela += "<td>" + i3GEO.social.curtirFacebook(urlcf, tipo) + "</td>";
				}
				tabela += "</tr></table>";
				if (id !== "") {
					onde.innerHTML = tabela;
				}
				return tabela;
			} else {
				return false;
			}
		},
		/**
		 * Function: bookmark
		 * 
		 * Cria os bot&otilde;es de bookmark em redes sociais
		 * 
		 * Gera o HTML contendo as tags IMG com os links
		 * 
		 * Parametro:
		 * 
		 * {string} - link que ser&aacute; marcado
		 * 
		 * {string} - url onde est&aacute; o i3Geo. Se n&atilde;o for especificada, ser&aacute; obtida de i3GEO.configura.locaplic
		 * 
		 * Return:
		 * 
		 * HTML com os bot&otilde;es
		 */
		bookmark : function(link, locaplic) {
			if (!locaplic) {
				locaplic = i3GEO.configura.locaplic;
			}
			var ins =
				"<img style='cursor:pointer' src='" + locaplic
					+ "/imagens/delicious.gif' onclick='javascript:window.open(\"http://del.icio.us/post?url=" + link
					+ "\")' title='Delicious'/> ";
			ins +=
				"<img style='cursor:pointer' src='" + locaplic
					+ "/imagens/digg.gif' onclick='javascript:window.open(\"http://digg.com/submit/post?url=" + link
					+ "\")' title='Digg'/> ";
			ins +=
				"<img style='cursor:pointer' src='" + locaplic
					+ "/imagens/facebook.gif' onclick='javascript:window.open(\"http://www.facebook.com/sharer.php?u=" + link
					+ "\")' title='Facebook'/> ";
			ins +=
				"<img style='cursor:pointer' src='" + locaplic
					+ "/imagens/stumbleupon.gif' onclick='javascript:window.open(\"http://www.stumbleupon.com/submit?url=" + link
					+ "\")' title='StumbleUpon'/>";
			return ins;
		}
	};