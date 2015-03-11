if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

/*
Classe: i3GEOF.toponimia

*/
i3GEOF.toponimia = {
	tema : i3GEO.temaAtivo,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Propriedade: ATIVAITEM

	Sera marcado como selecionado no combo com a lista de itens
	*/
	ATIVAITEM: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.toponimia.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["asp"] = '"';
		dicionario["sim"] = $trad("x14");
		dicionario["nao"] = $trad("x15");
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFtoponimiaComboCabeca","i3GEOFtoponimiaComboCabecaSel","toponimia","ligadosComTabela");
		if(i3GEOF.toponimia.tema === ""){
			$i(iddiv).innerHTML = "";//'<p style="position: relative; top: 0px; font-size: 15px; text-align: left;">'+$trad("x33")+'</p>';
			return;
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.toponimia.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia1","i3GEOtoponimiaguia");
			//eventos das guias
			$i("i3GEOtoponimiaguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia1","i3GEOtoponimiaguia");};
			$i("i3GEOtoponimiaguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia2","i3GEOtoponimiaguia");};
			$i("i3GEOtoponimiaguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia3","i3GEOtoponimiaguia");
				i3GEOF.toponimia.testa();
			};
			var b,versao;
			versao = i3GEO.parametros.versaomscompleta.split(".");
			
			b = new YAHOO.widget.Button(
				"i3GEOtoponimiabotao1",
				{onclick:{fn: i3GEOF.toponimia.cria}}
			);
			b.addClass("rodar150");
			
			if(parseInt(versao[0],10) <= 6 && parseInt(versao[1],10) == 0){
				$i("i3GEOtoponimiabotao2").style.display = "none";
			}
			else{
				b = new YAHOO.widget.Button(
					"i3GEOtoponimiabotao2",
					{onclick:{fn: i3GEOF.toponimia.remove}}
				);
				b.addClass("rodar150");
			}
			//
			//pega a lista de itens e chama a fun&ccedil;&atilde;o de montagem das op&ccedil;&otilde;es de escolha
			//
			i3GEO.util.comboItens(
				"i3GEOtoponimiaListaItens",
				i3GEOF.toponimia.tema,
				function(retorno){
					$i("i3GEOtoponimiaDivListaItens").innerHTML = retorno.dados;
					$i("i3GEOtoponimiaDivListaItens").style.display = "block";
					$i("i3GEOtoponimiaListaItens").value = i3GEOF.toponimia.ATIVAITEM;
				},
				"i3GEOtoponimiaDivListaItens",
				""
			);
			i3GEO.util.comboFontes("i3GEOtoponimiaListaFonte","i3GEOtoponimiaDivListaFonte");
			i3GEO.util.aplicaAquarela("i3GEOF.toponimia_corpo");
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
		var ins = Mustache.render(i3GEOF.toponimia.MUSTACHE, i3GEOF.toponimia.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		if($i("i3GEOF.toponimia")){
			i3GEOF.toponimia.inicia("i3GEOF.toponimia_corpo");
			return;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GEOconeFerramenta i3GEOiconeToponimia'></span>" + "<div  id='i3GEOFtoponimiaComboCabeca' class='comboTemasCabecalho'>   ------</div><span style=margin-left:60px>"+$trad("x56")+"&nbsp;</span><a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=36' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"410px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.toponimia",
			false,
			"hd",
			"",
			"",
			"",
			true
		);
		divid = janela[2].id;
		i3GEOF.toponimia.aguarde = $i("i3GEOF.toponimia_imagemCabecalho").style;
		$i("i3GEOF.toponimia_corpo").style.backgroundColor = "white";
		i3GEOF.toponimia.inicia(divid);
		temp = function(){
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",['i3GEO.janela.comboCabecalhoTemas("i3GEOFtoponimiaComboCabeca","i3GEOFtoponimiaComboCabecaSel","toponimia","ligadosComTabela")']);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaPar

	Pega os parametros para montar a chamada ajax que cria ou testa a topon&iacute;mia
	*/
	pegaPar: function(){
		var par = "",
			novotema = "sim";
		if($i("i3GEOtoponimiaListaItens").value == "")
		{i3GEO.janela.tempoMsg("Escolha um item");return false;}
		if($i("i3GEOtoponimiafundoc_i").value === "")
		{$i("i3GEOtoponimiafundoc_i").value = "off";}
		if($i("i3GEOtoponimiasombra_i").value === "")
		{$i("i3GEOtoponimiasombra_i").value = "off";}
		if($i("i3GEOtoponimiamascara_i").value === "")
		{$i("i3GEOtoponimiamascara_i").value = "off";}
		if($i("i3GEOtoponimiafrentes_i").value === "")
		{$i("i3GEOtoponimiafrentes_i").value = "off";}
		if($i("i3GEOtoponimianovotema").checked)
		{novotema = "nao";}
		if($i("i3GEOtoponimiaMinscale").value === ""){
			$i("i3GEOtoponimiaMinscale").value = 0;
		}
		if($i("i3GEOtoponimiaMaxscale").value === ""){
			$i("i3GEOtoponimiaMaxscale").value = 0;
		}
		par = "&position="+$i("i3GEOtoponimiaposition_i").value +
			"&partials="+$i("i3GEOtoponimiapartials_i").value+
			"&offsetx="+$i("i3GEOtoponimiaoffsetx_i").value+
			"&offsety="+$i("i3GEOtoponimiaoffsety_i").value+
			"&minfeaturesize="+$i("i3GEOtoponimiaminfeaturesize_i").value+
			"&mindistance="+$i("i3GEOtoponimiamindistance_i").value+
			"&force="+$i("i3GEOtoponimiaforce_i").value+
			"&shadowsizex="+$i("i3GEOtoponimiafrentex_i").value+
			"&shadowsizey="+$i("i3GEOtoponimiafrentey_i").value+
			"&cor="+$i("i3GEOtoponimiafrente_i").value+
			"&sombray="+$i("i3GEOtoponimiasombray_i").value+
			"&sombrax="+$i("i3GEOtoponimiasombrax_i").value+
			"&angulo="+$i("i3GEOtoponimiaangulo_i").value+
			"&tamanho="+$i("i3GEOtoponimiatamanho_i").value+
			"&fonte="+$i("i3GEOtoponimiaListaFonte").value+
			"&fundo="+$i("i3GEOtoponimiafundoc_i").value+
			"&sombra="+$i("i3GEOtoponimiasombra_i").value+
			"&outlinecolor="+$i("i3GEOtoponimiamascara_i").value+
			"&shadowcolor="+$i("i3GEOtoponimiafrentes_i").value+
			"&item="+$i("i3GEOtoponimiaListaItens").value+
			"&wrap="+$i("i3GEOtoponimiawrap_i").value+
			"&tema="+i3GEOF.toponimia.tema+
			"&minscale="+parseInt($i("i3GEOtoponimiaMinscale").value,10)+
			"&maxscale="+parseInt($i("i3GEOtoponimiaMaxscale").value,10)+
			"&novotema="+novotema;
		return par;
	},
	/*
	Function: cria

	Cria a topon&iacute;mia no tema selecionado

	Veja:

	<CRIATOPONIMIA>
	*/
	cria: function(){
		try{
			if(i3GEOF.toponimia.aguarde.visibility === "visible")
			{return;}
			i3GEOF.toponimia.aguarde.visibility = "visible";
			var monta = function(){
					i3GEOF.toponimia.aguarde.visibility = "hidden";
					if($i("i3GEOtoponimianovotema").checked)
					{i3GEO.Interface.atualizaTema("",i3GEOF.toponimia.tema);}
					else
					{i3GEO.atualiza();}
				},
				par = i3GEOF.toponimia.pegaPar(),
				p = i3GEO.configura.locaplic+"/ferramentas/toponimia/exec.php?g_sid="+i3GEO.configura.sid+
					"&funcao=criatoponimia&"+par;
			if(par === false){
				i3GEOF.toponimia.aguarde.visibility = "hidden";
				return;
			}
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"criaToponimia",monta);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.toponimia.aguarde.visibility = "hidden";}
	},
	remove: function(){
		try{
			if(i3GEOF.toponimia.aguarde.visibility === "visible")
			{return;}
			i3GEOF.toponimia.aguarde.visibility = "visible";
			var monta = function(){
					i3GEOF.toponimia.aguarde.visibility = "hidden";
					i3GEO.Interface.atualizaTema("",i3GEOF.toponimia.tema);
				},
				p = i3GEO.configura.locaplic+"/ferramentas/toponimia/exec.php?g_sid="+i3GEO.configura.sid+
					"&funcao=removetoponimia&tema="+i3GEOF.toponimia.tema;

			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"removeToponimia",monta);
		}catch(e){
			i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.toponimia.aguarde.visibility = "hidden";
		}
	},
	/*
	Function:

	Testa a cria&ccedil;&atilde;o da topon&iacute;mia gerando uma imagem tempor&aacute;ria

	Veja:

	<CRIATOPONIMIA>
	*/
	testa: function(){
		if(i3GEOF.toponimia.aguarde.visibility === "visible")
		{return;}
		i3GEOF.toponimia.aguarde.visibility = "visible";
		var monta = function(retorno){
				$i("i3GEOtoponimiaTeste").innerHTML= "<img src='"+retorno.data+"' >";
				i3GEOF.toponimia.aguarde.visibility = "hidden";
			},
			par = i3GEOF.toponimia.pegaPar(),
			p = i3GEO.configura.locaplic+"/ferramentas/toponimia/exec.php?g_sid="+i3GEO.configura.sid+
				"&funcao=criatoponimia&tipo=teste&"+par;
		if(par === false){
			i3GEOF.toponimia.aguarde.visibility = "hidden";
			return;
		}
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"criaToponimia",monta);
	}
};