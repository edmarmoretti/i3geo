if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
i3GEOF.mostraexten = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.mostraexten.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.mostraexten.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/mostraexten/template_mst.html", function(template) {
				i3GEOF.mostraexten.MUSTACHE = template;
				i3GEOF.mostraexten.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.mostraexten.html();
		i3GEOF.mostraexten.ativaFoco();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.mostraexten.MUSTACHE, i3GEOF.mostraexten.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.mostraexten")) {
			return;
		}
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.mostraexten.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mostraexten");
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("d8t") + "</span></div>";
		janela = i3GEO.janela.cria(
			"370px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mostraexten",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"55"
		);
		divid = janela[2].id;
		$i("i3GEOF.mostraexten_corpo").style.backgroundColor = "white";
		$i("i3GEOF.mostraexten_corpo").style.textAlign = "left";
		i3GEOF.mostraexten.aguarde = $i("i3GEOF.mostraexten_imagemCabecalho").style;
		i3GEOF.mostraexten.inicia(divid);
		i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEOF.mostraexten.ativaFoco()"]);
		temp = function(){
			i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.mostraexten.ativaFoco()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Fun&ccedil;&atilde;o que &eacute; disparada quando o usu&aacute;rio clica no cabe&ccedil;alho da ferramenta
	*/
	ativaFoco: function(){
		$i("i3GEOmostraextenatual").innerHTML = i3GEO.parametros.mapexten;
	},
	/*
	Function: executa

	Altera a extens&atilde;o atual

	Veja:

	<i3GEO.navega.zoomExt>
	*/
	executa: function(){
		try{
			var x = i3GEO.calculo.dms2dd($i("i3GEOmostraextenxg").value,$i("i3GEOmostraextenxm").value,$i("i3GEOmostraextenxs").value),
				xx = i3GEO.calculo.dms2dd($i("i3GEOmostraextenxxg").value,$i("i3GEOmostraextenxxm").value,$i("i3GEOmostraextenxxs").value),
				y = i3GEO.calculo.dms2dd($i("i3GEOmostraextenyg").value,$i("i3GEOmostraextenym").value,$i("i3GEOmostraextenys").value),
				yy = i3GEO.calculo.dms2dd($i("i3GEOmostraextenyyg").value,$i("i3GEOmostraextenyym").value,$i("i3GEOmostraextenyys").value);
			if ((x == xx) || (y == yy)){
				//i3GEO.janela.tempoMsg($trad('msgCoordValida',i3GEOF.mostraexten.dicionario));
				//return;

				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,$i("i3GEOmostraextenatual").value);
				return;
			}
			if ((x > xx) || (y > yy)){
				//i3GEO.janela.tempoMsg($trad('msgCoordValida',i3GEOF.mostraexten.dicionario));
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,$i("i3GEOmostraextenatual").value);
				return;
			}
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,(x+" "+y+" "+xx+" "+yy));
		}
		catch(e){i3GEO.janela.tempoMsg(e+" Erro.");}
	}
};