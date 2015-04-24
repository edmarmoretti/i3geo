if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.mmscale

*/
i3GEOF.mmscale = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	 * Variavel: tema
	 *
	 * Tema que ser&aacute; utilizado
	 *
	 * Type: {string}
	 */
	tema : i3GEO.temaAtivo,
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.mmscale.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFmmscaleComboCabeca","i3GEOFmmscaleComboCabecaSel","mmscale","ligados");
		if(i3GEO.temaAtivo === ""){
			$i(iddiv).innerHTML = "";
			return;
		}
		$i(iddiv).innerHTML += i3GEOF.mmscale.html();
		var b = new YAHOO.widget.Button(
			"i3GEOmmscalebotao1",
			{onclick:{fn: i3GEOF.mmscale.aplica}}
		);
		b.addClass("rodar");
		i3GEOF.mmscale.atual();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.mmscale.MUSTACHE, i3GEOF.mmscale.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		if($i("i3GEOF.mmscale")){
			i3GEOF.mmscale.tema = i3GEO.temaAtivo;
			i3GEOF.mmscale.inicia("i3GEOF.mmscale_corpo");
			return;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GEOiconeFerramenta i3GEOiconemmscale'></span>" + "<div  id='i3GEOFmmscaleComboCabeca' class='comboTemasCabecalho'>   ------</div>"
		+ "<div class='i3GeoTituloJanela' style='margin-left: 60px;'>" + $trad("p4")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=128' ><b> </b></a></div>";
		janela = i3GEO.janela.cria(
			"330px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mmscale",
			false,
			"hd",
			"",
			"",
			"",
			true
		);
		divid = janela[2].id;
		i3GEOF.mmscale.aguarde = $i("i3GEOF.mmscale_imagemCabecalho").style;
		$i("i3GEOF.mmscale_corpo").style.backgroundColor = "white";
		i3GEOF.mmscale.inicia(divid);
	},
	aplica: function(){
		try{
			if(i3GEOF.mmscale.aguarde.visibility === "visible")
			{return;}
			i3GEOF.mmscale.aguarde.visibility = "visible";
			var p,
				minscaledenom = 0,
				maxscaledenom = 0,
				fim = function(){
					i3GEOF.mmscale.aguarde.visibility = "hidden";
					i3GEO.Interface.atualizaTema("",i3GEOF.mmscale.tema);
				};
			if($i("i3GEOmmscaleMinscale").value != ""){
				minscaledenom = parseInt($i("i3GEOmmscaleMinscale").value,10);
			}
			if($i("i3GEOmmscaleMaxscale").value != ""){
				maxscaledenom = parseInt($i("i3GEOmmscaleMaxscale").value,10);
			}
			p = i3GEO.configura.locaplic+"/ferramentas/mmscale/exec.php?g_sid="+i3GEO.configura.sid+
				"&funcao=MINMAX"+
				"&tema="+i3GEOF.mmscale.tema+
				"&minscaledenom="+minscaledenom+
				"&maxscaledenom="+maxscaledenom;

			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"foo",fim);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.mmscale.aguarde.visibility = "hidden";}
	},
	atual: function(){
		var fim = function(retorno){
			$i("i3GEOmmscaleMinscale").value = retorno.data.minscaledenom;
			$i("i3GEOmmscaleMaxscale").value = retorno.data.maxscaledenom;
		},
		p = i3GEO.configura.locaplic+"/ferramentas/mmscale/exec.php?g_sid="+i3GEO.configura.sid+
				"&funcao=atual&tema="+i3GEOF.mmscale.tema;

		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"criammscale",fim);
	}
};