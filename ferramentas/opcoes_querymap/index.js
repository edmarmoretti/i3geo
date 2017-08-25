if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.opcoesQuery
*/
i3GEOF.opcoesQuery = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesQuery.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.opcoesQuery.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_querymap/template_mst.html", function(template) {
				i3GEOF.opcoesQuery.MUSTACHE = template;
				i3GEOF.opcoesQuery.inicia(iddiv);
			});
			return;
		}
		try{
			i3GEOF.opcoesQuery.aguarde.visibility = "visible";
			$i(iddiv).innerHTML = i3GEOF.opcoesQuery.html();
			i3GEO.util.aplicaAquarela("i3GEOF.opcoesQuery");
			var p = i3GEO.configura.locaplic+"/ferramentas/opcoes_querymap/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegaquerymapcor",
				cp = new cpaint(),
				retorno = function(retorno){
					i3GEOF.opcoesQuery.aguarde.visibility = "hidden";
					if(retorno.data.erro){i3GEO.janela.tempoMsg("Erro");return;}
					$i("i3GEOopcoesQuerycor").value = retorno.data;
				};
			cp.set_response_type("JSON");
			cp.call(p,"corQM",retorno);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html: function() {
		var ins = Mustache.render(i3GEOF.opcoesQuery.MUSTACHE, i3GEOF.opcoesQuery.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.opcoesQuery")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesQuery");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p8") + "</span></div>";
		janela = i3GEO.janela.cria(
			"220px",
			"120px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesQuery",
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
			"5"
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesQuery_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesQuery_corpo").style.textAlign = "left";
		i3GEOF.opcoesQuery.aguarde = $i("i3GEOF.opcoesQuery_imagemCabecalho").style;
		i3GEOF.opcoesQuery.inicia(divid);
	},
	/*
	Function: executa

	Aplica os parametros definidos

	Veja:

	<QUERYMAPCOR>
	*/
	executa: function(){
		if(i3GEOF.opcoesQuery.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesQuery.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesQuery.aguarde.visibility = "hidden";
				i3GEO.Interface.atualizaMapa();
			},
			cor = $i("i3GEOopcoesQuerycor").value,
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=querymapcor&cor="+cor,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"corQM",temp);
	}
};
