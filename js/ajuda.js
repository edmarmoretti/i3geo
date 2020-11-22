/**
 * Title: Ajuda
 *
 * Manipula&ccedil;&atilde;o das mensagens de ajuda.
 *
 * Permite definir a mensagem padr&atilde;o da janela de mensagens. Abrir a
 * janela e definir seu conte&uacute;do. Controla tamb&eacute;m o letreiro
 * m&oacute;vel que mostra mensagens especiais definidas em cada layer
 * adicionado ao mapa.
 *
 * Namespace:
 *
 * i3GEO.ajuda
 *
 * Exemplos:
 *
 *
 * Para enviar uma mensagem para a janela (quando estiver aberta), utilize
 *
 * i3GEO.ajuda.mostraJanela("texto");
 *
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_ajuda.js>
 */

if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.ajuda =
	{
		/**
		 * Function: abreDoc
		 *
		 * Abre a documentacao do i3geo em uma nova janela do navegador
		 *
		 * Parametro:
		 *
		 * {string} - url que ser&aacute; adicionada a i3GEO.configura.locaplic
		 */
		abreDoc : function(url) {
			if (!url) {
				url = "/documentacao/index.html";
			}
			window.open(i3GEO.configura.locaplic + url);
		},
		ferramenta : function(idajuda){
			var url = i3GEO.configura.locaplic + "/ferramentas/ajuda_usuario.php?"
				+ "&idajuda="
				+ idajuda;
			$.get(url).done(function(data) {
				var json = jQuery.parseJSON(data);
				var texto = json[i3GEO.idioma.ATUAL];
				var titulo = json["titulo"][i3GEO.idioma.ATUAL];
				i3GEO.janela.closeMsg(texto);
			}).fail(function() {

			    return;
			});
		}
	};