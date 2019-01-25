if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
i3GEOF.opcoesTempo = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesTempo.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.opcoesTempo.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_autoredesenha/template_mst.html", function(template) {
				i3GEOF.opcoesTempo.MUSTACHE = template;
				i3GEOF.opcoesTempo.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.opcoesTempo.html();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.opcoesTempo.MUSTACHE, i3GEOF.opcoesTempo.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		if ($i("i3GEOF.opcoesTempo")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesTempo");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p12") + "</span></div>";
		janela = i3GEO.janela.cria(
			"300px",
			"160px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesTempo",
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
			"9"
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesTempo_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesTempo_corpo").style.textAlign = "left";
		i3GEOF.opcoesTempo.aguarde = $i("i3GEOF.opcoesTempo_imagemCabecalho").style;
		i3GEOF.opcoesTempo.inicia(divid);
	},
	/*
	Function: executa

	Ativa ou desativa o temporizador. Se o valor de tempo for igual a 0, o temporizador &eacute; desativado.
	*/
	executa: function(){
		i3GEO.navega.autoRedesenho.desativa();
		var i = $i("i3GEOopcoesTempoT");
		i3GEO.navega.autoRedesenho.INTERVALO = i.value * 1000;
		if ((i.value == 0) || (i.value == ""))
		{i3GEO.navega.autoRedesenho.desativa();}
		else
		{i3GEO.navega.autoRedesenho.ativa();}
	}
};