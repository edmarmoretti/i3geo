if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

i3GEOF.juntamedidasvariavel = {
	tema : "",
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.juntamedidasvariavel.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.juntamedidasvariavel.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/juntamedidasvariavel/template_mst.html", function(template) {
				i3GEOF.juntamedidasvariavel.MUSTACHE = template;
				i3GEOF.juntamedidasvariavel.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.juntamedidasvariavel.html();
		var temp = function(retorno){
			i3GEOF.juntamedidasvariavel.aguarde.visibility = "hidden";

			var n = retorno.length, i, lista = "";

			for(i=0;i<n;i++){
				lista += '<div class="checkbox text-left"><label>'
					+ '<input checked value="' + retorno[i].layer + '" type="checkbox" >'
					+ '<span class="checkbox-material noprint"><span class="check"></span></span>'
					+ retorno[i].tema + '</label></div>';
			}
			$i("i3GEOFjuntaLista").innerHTML = lista;
			i3GEOF.juntamedidasvariavel.noNovoCalculo();
		};
		var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
		"&funcao=listaLayersAgrupados";
		i3GEOF.juntamedidasvariavel.aguarde.visibility = "visible";
		i3GEO.util.ajaxGet(p,temp);
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.juntamedidasvariavel.MUSTACHE, i3GEOF.juntamedidasvariavel.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(tema){
		var janela,divid,titulo;
		if($i("i3GEOF.juntamedidasvariavel")){
			i3GEOF.juntamedidasvariavel.tema = tema;
			i3GEOF.juntamedidasvariavel.inicia("i3GEOF.juntamedidasvariavel_corpo");
			return;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("titulo",i3GEOF.juntamedidasvariavel.dicionario)+"</span></div>";

		janela = i3GEO.janela.cria(
			"330px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.juntamedidasvariavel",
			false,
			"hd",
			"",
			"",
			"",
			true,
			"",
			"",
			"",
			""
		);
		divid = janela[2].id;
		i3GEOF.juntamedidasvariavel.aguarde = $i("i3GEOF.juntamedidasvariavel_imagemCabecalho").style;
		i3GEOF.juntamedidasvariavel.inicia(divid);
	},
	noNovoCalculo: function(){
		var no = document.createElement("div");
		no.innerHTML = '<div class="form-group label-fixed condensed" >'
			+ '<label class="control-label" for="">' + $trad("tituloform",i3GEOF.juntamedidasvariavel.dicionario) + '</label>'
			+ '<input class="form-control input-lg" type="text" value="" /></div>'
			+ '<h5>' + $trad("titulosql",i3GEOF.juntamedidasvariavel.dicionario) + '</h5>'
			+ '<div class="form-group label-fixed condensed"><textarea class="form-control input-lg" rows="4"></textarea></div>';

		$i("i3GEOFjuntaColunasCalculadas").appendChild(no);
	},
	pegaCalculos: function(){
		var div = $i("i3GEOFjuntaColunasCalculadas"),
			nomes = div.getElementsByTagName("input"),
			formulas = div.getElementsByTagName("textarea"),
			n = nomes.length,
			parnomes = [],
			parformulas = [],
			i;
		for(i=0;i<n;i++){
			if(nomes[i].value != "" && formulas[i].value != ""){
				parnomes.push(nomes[i].value);
				parformulas.push(formulas[i].value);
			}
		}
		return "&colunascalc="+parnomes.join(",")+"&formulas="+parformulas.join(",");
	},
	aplica: function(){
		if($i("aguardeAnalise_c") && $i("aguardeAnalise_c").style.visibility == "visible"){
			return;
		};
		i3GEO.janela.abreAguarde("aguardeAnalise","Aguarde...");
		var ps,atualiza,p,i,
			lista = [],
			ics = $i("i3GEOF.junta_corpo").getElementsByTagName("input"),
			n = ics.length;
		for(i=0;i<n;i++){
			if(ics[i].type == "checkbox" && ics[i].checked === true){
				lista.push(ics[i].value);
			}
		}
		if(lista.length == 0){
			alert("selecionaCamada");
			return;
		}
		i3GEO.janela.abreAguarde("aguardeAnalise","Aguarde...");
		p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
			"&funcao=juntaMedidasVariaveis&layerNames="+lista.join(",")+"&nome="+$i("i3GEOFjuntaNovoNome").value;
		ps = i3GEOF.juntaMedidasVariaveis.pegaCalculos();
		atualiza = function(retorno){
			i3GEO.janela.fechaAguarde("aguardeAnalise");
			i3GEO.atualiza();
			i3GEO.temaAtivo = retorno.data;
		};
		//i3GEO.util.ajaxGet(p,atualiza);
		cpJSON.call(p,"foo",atualiza,ps);
	}
};