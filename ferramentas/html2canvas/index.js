if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.html2canvas
 *
 */
i3GEOF.html2canvas = {
	/*
	 * Function: inicia
	 *
	 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	 *
	 * Parametro:
	 *
	 * obj {dom}
	 */
	inicia: function(obj){
		html2canvas(obj, {
			onrendered: function(canvas) {
				var d,u;
				d = document.createElement("img");
				Canvas2Image.saveAsPNG(canvas,true);
				u = canvas.toDataURL();
				d.src = u;
				$i("i3GEOF.html2canvas_corpo").appendChild(d);
			},
			letterRendering: true
		});
	},
	/*
	 * Function: iniciaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante: function(obj){
		var titulo,cabecalho,minimiza;
		if ($i("i3GEOF.html2canvas")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.html2canvas");
		};
		// cria a janela flutuante
		titulo = "</div><div class='i3GeoTituloJanelaBs'>img</div>";
		i3GEO.janela.cria(
			"400px",
			"230px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.html2canvas",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		//XODO incluir esses estilos na criacao da janela
		$i("i3GEOF.html2canvas_corpo").style.backgroundColor = "white";
		$i("i3GEOF.html2canvas_corpo").style.textAlign = "left";
		i3GEOF.html2canvas.inicia(obj);
	}
};
