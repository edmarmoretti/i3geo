if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.atalhosmapa
 */
i3GEOF.atalhosmapa =
{
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
		//pega os itens do menu suspenso e que contem a lista de aplicativos
		var s, b, m, n, i, t, ins = "<div style='margin-left: 5px'>";
		m = i3GEO.configura.oMenuData.submenus.ferramentas;
		n = m.length;
		for(i=0;i<n;i++){
			if(m[i].submenu.id === "mapa"){
				t = m[i].submenu.itemdata[0];
			}
		}
		n = t.length;
		for(i=0;i<n;i++){
			ins += "<p class='paragrafo'><input id='atalhosmapa" + i + "' type='button' value='" + t[i].text.split("</span>")[1] + "' /></p>";
		}
		$i(iddiv).innerHTML = ins + "</div>";
		for(i=0;i<n;i++){
			eval("s = "+t[i].url.split("javascript:")[1].replace("()","") + ";");
			b = new YAHOO.widget.Button("atalhosmapa" + i, {
				onclick : {
					fn : s
				}
			});
			b.addClass("abrir");
		}

	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
		var temp, minimiza, cabecalho, janela, divid, temp, titulo, ltema;

		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza(id);
		};
		// cria a janela flutuante
		titulo = "&nbsp;&nbsp;&nbsp;";
		janela =
			i3GEO.janela.cria(
				"280px",
				"300px",
				"",
				"",
				"",
				titulo,
				"i3GEOF.atalhosmapa",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true,
				i3GEO.configura.locaplic + "/imagens/oxygen/16x16/games-config-custom.png"
			);
		divid = janela[2].id;
		janela[2].style.backgroundColor = "white";
		janela[0].bringToTop();
		i3GEOF.atalhosmapa.inicia(divid);
	}
};