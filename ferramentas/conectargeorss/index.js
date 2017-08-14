if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

/*
Classe: i3GEOF.conectargeorss
*/
i3GEOF.conectargeorss = {
	IDWS: "",
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.conectargeorss.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.conectargeorss.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/conectargeorss/template_mst.html", function(template) {
				i3GEOF.conectargeorss.MUSTACHE = template;
				i3GEOF.conectargeorss.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.conectargeorss.html();
		var b, monta = function(retorno){
			if (retorno.data.rss.search(/Erro/gi) != -1){
				i3GEO.janela.tempoMsg("OOps! Ocorreu um erro\n"+retorno.data);
				return;
			}
			var canais = retorno.data.canais;
			var ncanais = canais.length;
			var i, ins = "";
			ins += "<select class='form-control' onchange='i3GEOF.conectargeorss.registraws(this.value)' style='width:100%;' >";
			ins += "<option value='' >---</option>";
			for (i = 0; i < ncanais; i++) {
				var caso = canais[i];
				var valor = "'" + caso.link + "','"	+ caso.id_ws + "'";
				ins += "<option value=" + valor + " >"+caso.title+"</option>";
			}
			ins += "</select>";
			document.getElementById("RSSgeo").innerHTML = ins;
		};

		var p = i3GEO.configura.locaplic + "/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss=&tipo=GEORSS";
		var cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"listaRSSwsARRAY",monta);
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.conectargeorss.MUSTACHE, i3GEOF.conectargeorss.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo;
		if($i("i3GEOF.conectargeorss")){
			return;
		}
		//cria a janela flutuante
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.conectargeorss",200);
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("x47") + "</span></div>";
		janela = i3GEO.janela.cria(
			"320px",
			"280px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.conectargeorss",
			false,
			"hd",
			"",
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"29"
		);
		divid = janela[2].id;
		i3GEOF.conectargeorss.aguarde = $i("i3GEOF.conectargeorss_imagemCabecalho").style;
		$i("i3GEOF.conectargeorss_corpo").style.backgroundColor = "white";
		i3GEOF.conectargeorss.inicia(divid);
	},
	adiciona: function(id){
		var url, temp, cp, p;
		if(i3GEOF.conectargeorss.aguarde.visibility === "visible"){
			return;
		}
		if($i("servicoGeorss").value !== ""){
			i3GEOF.conectargeorss.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.conectargeorss.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
			cp = new cpaint();
			cp.set_response_type("JSON");
			p = i3GEO.configura.locaplic+"/ferramentas/conectargeorss/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaGeoRSS&canal="+id+"&servico="+$i("servicoGeorss").value;
			cp.call(p,"foo",temp);
		}
	},
	listaCanais: function(){
		if(i3GEOF.conectargeorss.aguarde.visibility === "visible"){
			return;
		}
		$i("resultadoget").innerHTML = "";
		if ($i("servicoGeorss").value == ""){
			i3GEO.janela.tempoMsg($trad('msgServico',i3GEOF.conectargeorss.dicionario));
		}
		else{
			i3GEOF.conectargeorss.aguarde.visibility = "visible";
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=georssCanais&servico="+$i("servicoGeorss").value;
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"georssCanais",i3GEOF.conectargeorss.montaCanais);
		}
	},
	registraws: function(nome,id_ws){
		$i("servicoGeorss").value = nome;
		if(arguments.length == 2){
			i3GEOF.conectargeorss.IDWS = id_ws;
		}
		else {
			i3GEOF.conectargeorss.IDWS = "";
		}
		i3GEOF.conectargeorss.listaCanais();
	},
	montaCanais: function(retorno){
		var i,ins = "<h5>"+ $trad('selecionaItem',i3GEOF.conectargeorss.dicionario)+"</h5>";
		i3GEOF.conectargeorss.aguarde.visibility = "hidden";
		if (retorno.data != undefined){
			retorno = retorno.data;
			for (i=0;i<retorno.length; i++){
				ins += "<div class='list-group condensed'><div class='row-content text-left'>" +
					"<label class='nomeTema'><a onclick='i3GEOF.conectargeorss.adiciona(\""+i+"\");return false;' href='javascript:void(0)'><h4>" + retorno[i].title + "</h4></a></label></div></div>";
			}
			$i("resultadoget").innerHTML = ins;
		}
		else{
			$i("resultadoget").innerHTML = "<h5 class='alert alert-danger'>"+$trad('erro',i3GEOF.conectargeorss.dicionario)+"</h5>";
		}
	}
};