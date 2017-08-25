if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.opcoesEscala

*/
i3GEOF.opcoesEscala = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesEscala.dicionario);
		dicionario["sim"] = $trad("x14");
		dicionario["nao"] = $trad("x15");
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["asp"] = '"';
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.opcoesEscala.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_escala/template_mst.html", function(template) {
				i3GEOF.opcoesEscala.MUSTACHE = template;
				i3GEOF.opcoesEscala.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.opcoesEscala.html();
			i3GEOF.opcoesEscala.parametrosAtuais();
			i3GEO.util.aplicaAquarela("i3GEOF.opcoesEscala_corpo");
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		if(i3GEO.Interface.ATUAL !== "padrao")
		{i3GEO.janela.tempoMsg($trad('msg',i3GEOF.opcoesEscala.dicionario));}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html: function() {
		var ins = Mustache.render(i3GEOF.opcoesEscala.MUSTACHE, i3GEOF.opcoesEscala.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.opcoesEscala")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesEscala",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p4") + "</span></div>";
		janela = i3GEO.janela.cria(
			"280px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesEscala",
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
			"3"
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesEscala_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesEscala_corpo").style.textAlign = "left";
		i3GEOF.opcoesEscala.aguarde = $i("i3GEOF.opcoesEscala_imagemCabecalho").style;
		i3GEOF.opcoesEscala.inicia(divid);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa

	Aplica os parametros definidos

	Veja:

	<MUDAESCALAGRAFICA>
	*/
	executa: function(){
		if(i3GEOF.opcoesEscala.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesEscala.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesEscala.aguarde.visibility = "hidden";
				if(i3GEO.Interface.ATUAL === "padrao")
				{i3GEO.atualiza();}
			},
			par = i3GEOF.opcoesEscala.parametrosFormulario(),
			p = i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=mudaescalagrafica"+par,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"mudaEscalaGrafica",temp);
	},
	/*
	Function: parametrosAtuais

	Pega os parametros atuais da barra de escala

	Veja:

	<ESCALAPARAMETROS>
	*/
	parametrosAtuais: function(){
		i3GEOF.opcoesEscala.aguarde.visibility = "visible";
		var p = i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=escalaparametros",
			cp = new cpaint(),
			temp = function(retorno){
				try{
					if(retorno.data !== ""){
						eval(retorno.data);
						$i("i3GEOopcoesEscalaw").value = w;
						$i("i3GEOopcoesEscalah").value = h;
						$i("i3GEOopcoesEscalastatus").value = status;
						$i("i3GEOopcoesEscalaestilo").value = estilo;
						$i("i3GEOopcoesEscalaintervalos").value = intervalos;
						$i("i3GEOopcoesEscalaunidade").value = unidade;
						$i("i3GEOopcoesEscalacor").value = cor;
						$i("i3GEOopcoesEscalabcor").value = bcor;
						$i("i3GEOopcoesEscalaocor").value = ocor;
					}
					i3GEOF.opcoesEscala.aguarde.visibility = "hidden";
				}catch(e){
					i3GEO.janela.tempoMsg("Erro. "+e);
					i3GEOF.opcoesEscala.aguarde.visibility = "hidden";
				}
			};
		cp.set_response_type("JSON");
		cp.call(p,"pegaParametrosLegImg",temp);
	},
	/*
	Function: parametrosFormulario

	Pega os valores do formul&aacute;rio atual
	*/
	parametrosFormulario: function(){
		var par = "&w=" + $i("i3GEOopcoesEscalaw").value +
		"&h=" + $i("i3GEOopcoesEscalah").value +
		"&estilo=" + $i("i3GEOopcoesEscalaestilo").value +
		"&status="+$i("i3GEOopcoesEscalastatus").value +
		"&intervalos=" + $i("i3GEOopcoesEscalaintervalos").value +
		"&unidade=" + $i("i3GEOopcoesEscalaunidade").value +
		"&cor=" + $i("i3GEOopcoesEscalacor").value +
		"&bcor=" + $i("i3GEOopcoesEscalabcor").value +
		"&ocor=" + $i("i3GEOopcoesEscalaocor").value;
		return(par);
	},
	/*
	Function: testa

	Testa a barra, mostrando uma imagem tempor&aacute;ria

	Veja:

	<TESTAESCALAGRAFICA>
	*/
	testa: function(){
		if(i3GEOF.opcoesEscala.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesEscala.aguarde.visibility = "visible";
		var temp = function(retorno){
				i3GEOF.opcoesEscala.aguarde.visibility = "hidden";
				i3GEO.janela.closeMsg("<img  src='" + retorno.data + "'  />");
			},
			par = i3GEOF.opcoesEscala.parametrosFormulario(),
			p = i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=testaescalagrafica"+par,
			cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"testaescalagrafica",temp);
	}
};