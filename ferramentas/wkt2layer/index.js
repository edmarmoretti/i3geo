if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.wkt2layer
 */
i3GEOF.wkt2layer =
{
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: parDefault

	parametros padr&atilde;o utilizados para formatar texto
	*/
	parDefault: "position=MS_UR&partials=1&offsetx=0&offsety=0&minfeaturesize=auto&mindistance=auto&force=0&shadowsizex=1&shadowsizey=1&cor=0 0 0&sombray=1&sombrax=1&angulo=0&tamanho=12&fonte=arial&fundo=off&sombra=off&outlinecolor=255,255,255&shadowcolor=off&wrap=",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function(wkt,texto) {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.wkt2layer.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["wkt"] = wkt;
		dicionario["valortexto"] = texto;
		return dicionario;
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
	inicia : function(iddiv,wkt,texto) {
		$i(iddiv).innerHTML = i3GEOF.wkt2layer.html(wkt,texto);
		new YAHOO.widget.Button("i3GEOFwkt2layerShp", {
			onclick : {
				fn : function() {
					var wkt = $i("i3GEOFwkt2layerWkt").value;
					if(wkt.length < 5){
						i3GEO.janela.tempoMsg($trad("mensagem",i3GEOF.wkt2layer.dicionario));
					}
					else{
						i3GEOF.wkt2layer.shapefile();
					}
				}
			}
		});
		new YAHOO.widget.Button("i3GEOFwkt2layerInterno", {
			onclick : {
				fn : function() {
					var wkt = $i("i3GEOFwkt2layerWkt").value;
					if(wkt.length < 5){
						i3GEO.janela.tempoMsg($trad("mensagem",i3GEOF.wkt2layer.dicionario));
					}
					else{
						i3GEOF.wkt2layer.insere();
					}
				}
			}
		});
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
	html : function(wkt,texto) {
		var ins = Mustache.render(i3GEOF.wkt2layer.MUSTACHE, i3GEOF.wkt2layer.mustacheHash(wkt,texto));
		return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function(wkt,texto) {
		var minimiza, cabecalho, janela, divid, temp, titulo;

		if ($i("i3GEOF.wkt2layer")) {
			return;
		}
		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza("i3GEOF.wkt2layer");
		};
		// cria a janela flutuante
		titulo = $trad("wkt2layer",i3GEOF.wkt2layer.dicionario);
		janela =
			i3GEO.janela.cria(
				"280px",
				"180px",
				"",
				"",
				"",
				titulo,
				"i3GEOF.wkt2layer",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true
			);
		divid = janela[2].id;
		janela[0].moveTo(150,150);
		$i("i3GEOF.wkt2layer_corpo").style.backgroundColor = "white";
		i3GEOF.wkt2layer.aguarde = $i("i3GEOF.wkt2layer_imagemCabecalho").style;
		i3GEOF.wkt2layer.inicia(divid,wkt,texto);
	},
	pegaPar: function(){
		var par,nometema,temp;
		try{
			par = i3GEOF.proplabel.pegaPar();
			i3GEOF.wkt2layer.parDefault = par;
		}
		catch(e){
			par = i3GEOF.wkt2layer.parDefault;
		}
		if($i("i3GEOFwkt2layerTitulo").value !== ""){
			nometema = $i("i3GEOFwkt2layerTitulo").value;
		}
		else{
			temp = Math.random() + "_wkt2raster";
			temp = temp.split(".");
			nometema = temp[1];
		}
		if($i("i3GEOFwkt2layerTexto").value !== ""){
			texto = $i("i3GEOFwkt2layerTexto").value;
		}
		else{
			texto = "";
		}
		par += "&nometema=" + nometema
			+ "&texto=" + texto;
		return par;
	},
	/*
	Function: insere

	Insere no mapa

	*/
	insere: function(){
		if(i3GEOF.wkt2layer.aguarde.visibility === "visible")
		{return;}
		i3GEOF.wkt2layer.aguarde.visibility = "visible";
		var wkt,monta,par,p,nometema,temp,cp;
		monta = function(){
		 	i3GEOF.wkt2layer.aguarde.visibility = "hidden";
		 	i3GEO.atualiza();
		 	i3GEO.janela.tempoMsg($trad('fim',i3GEOF.wkt2layer.dicionario));
		};
		par = i3GEOF.wkt2layer.pegaPar();
		wkt = $i("i3GEOFwkt2layerWkt").value;
		p = i3GEO.configura.locaplic+"/ferramentas/wkt2layer/exec.php?g_sid="+i3GEO.configura.sid+
				"&funcao=feature&"+par;
		cp = new cpaint();
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p,"foo",monta,"xy="+wkt);
	},
	/*
	Function: shapefile

	Insere no mapa

	*/
	shapefile: function(){
		if(i3GEOF.wkt2layer.aguarde.visibility === "visible")
		{return;}
		i3GEOF.wkt2layer.aguarde.visibility = "visible";
		var wkt,monta,par,p,nometema,temp,cp;
		monta = function(){
		 	i3GEOF.wkt2layer.aguarde.visibility = "hidden";
		 	i3GEO.atualiza();
		 	i3GEO.janela.tempoMsg($trad('fim',i3GEOF.wkt2layer.dicionario));
		};
		par = i3GEOF.wkt2layer.pegaPar();
		wkt = $i("i3GEOFwkt2layerWkt").value;
		p = i3GEO.configura.locaplic+"/ferramentas/wkt2layer/exec.php?g_sid="+i3GEO.configura.sid+
				"&funcao=shapefile&"+par;
		cp = new cpaint();
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p,"foo",monta,"xy="+wkt);
	}
};
