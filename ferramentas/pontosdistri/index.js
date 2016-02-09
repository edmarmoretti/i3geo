if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.pontosDistri
*/
i3GEOF.pontosDistri = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.pontosDistri.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["asp"] = '"';
		dicionario["limitePontos"] = i3GEO.util.comboSimNao('i3GEOpontosDistrilimitePontos','sim');
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			var b;
			$i(iddiv).innerHTML += i3GEOF.pontosDistri.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOpontosDistriguia1","i3GEOpontosDistriguia");
			//eventos das guias
			$i("i3GEOpontosDistriguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOpontosDistriguia1","i3GEOpontosDistriguia");};
			$i("i3GEOpontosDistriguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOpontosDistriguia2","i3GEOpontosDistriguia");};
			b = new YAHOO.widget.Button(
				"i3GEOpontosDistribotao4",
				{onclick:{fn: i3GEOF.pontosDistri.verCores}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOpontosDistribotao1",
				{onclick:{fn: i3GEOF.pontosDistri.analiseDensidade}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOpontosDistribotao2",
				{onclick:{fn: i3GEOF.pontosDistri.analiseDistancia}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOpontosDistribotao3",
				{onclick:{fn: i3GEOF.pontosDistri.analiseRelatorio}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOpontosDistribotaokernel",
				{onclick:{fn: i3GEOF.pontosDistri.analiseKernel}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOpontosDistribotaodeldir",
				{onclick:{fn: i3GEOF.pontosDistri.analiseDeldir}}
			);
			b.addClass("rodar");
			i3GEOF.pontosDistri.ativaFoco();
			i3GEO.util.aplicaAquarela("i3GEOF.pontosDistri");
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
		var ins = Mustache.render(i3GEOF.pontosDistri.MUSTACHE, i3GEOF.pontosDistri.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if ($i("i3GEOF.pontosDistri")) {
			return;
		}
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.pontosDistri.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.pontosDistri");
		};
		//cria a janela flutuante
		titulo = "<div class='i3GeoTituloJanela'>" + $trad("u14")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=20' ><b> </b></a></div>";
		janela = i3GEO.janela.cria(
			"400px",
			"330px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.pontosDistri",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		$i("i3GEOF.pontosDistri_corpo").style.backgroundColor = "white";
		i3GEOF.pontosDistri.aguarde = $i("i3GEOF.pontosDistri_imagemCabecalho").style;
		i3GEOF.pontosDistri.inicia(divid);
		i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.pontosDistri.ativaFoco()"]);
		temp = function(){
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",["i3GEOF.pontosDistri.ativaFoco()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.util.comboTemas(
			"i3GEOpontosDistritemasComSel",
			function(retorno){
		 		if(retorno.tipo !== "dados"){
		 			$i("i3GEOpontosDistriTemas").innerHTML = "<p class=paragrafo style=color:red >"+$trad('nenhumTemaSelecionado',i3GEOF.pontosDistri.dicionario)+"<span style=cursor:pointer;color:blue onclick='i3GEO.mapa.dialogo.selecao()' > "+$trad('seleciona',i3GEOF.pontosDistri.dicionario)+"</span></p>";
		 			return;
		 		}
		 		$i("i3GEOpontosDistriTemas").innerHTML = "<p class=paragrafo >"+retorno.dados + "</p>";
	 			$i("i3GEOpontosDistritemasComSel").onchange = function(){
	 				i3GEO.mapa.ativaTema($i("i3GEOpontosDistritemasComSel").value);
	 			};
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOpontosDistritemasComSel").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOpontosDistriTemas",
			"",
			false,
			"selecionados",
			" "
		);
		var i = $i("i3GEOF.pontosDistri_c").style;
		i.zIndex = i3GEO.janela.ULTIMOZINDEX;
		i3GEO.janela.ULTIMOZINDEX++;
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj){
		i3GEO.util.abreCor("",obj);
	},
	/*
	Function: verCores

	Mostra as cores definidas nos intervalos de defini&ccedil;&atilde;o da paleta

	Veja:

	<VERPALETA>
	*/
	verCores: function(){
		try{
			if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
			{return;}
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=verPaleta&numclasses="+n+"&cori="+ci+"&corf="+cf,
				mostraopcoes = function(retorno){
					retorno = retorno.data.split("*");
					var ins = "<br><br>",
						i,
						n = retorno.length;
					for (i=0;i<n;i++){
						ins += "<div style=background-color:rgb("+retorno[i]+") >"+retorno[i]+"</div>";
					}
					$i("i3GEOpontosDistrimostracores").innerHTML = ins;
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				};
			cp.set_response_type("JSON");
			cp.call(p,"verPaleta",mostraopcoes);
		}catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseDistancia

	Executa a an&aacute;lise de distribui&ccedil;&atilde;o de pontos

	Veja:

	<ANALISEDISTRIPT>
	*/
	analiseDistancia: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=distancia&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				i3GEO.janela.tempoMsg($trad('selecionaUmTema',i3GEOF.pontosDistri.dicionario));
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseDensidade

	Executa a an&aacute;lise de densidade

	Veja:

	<ANALISEDISTRIPT>
	*/
	analiseDensidade: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=densidade&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				i3GEO.janela.tempoMsg("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseKernel

	Executa a an&aacute;lise de kernel

	Veja:

	<ANALISEDISTRIPT>
	*/
	analiseKernel: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=kernel&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&sigma="+$i("i3GEOpontosDistrisigma").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				i3GEO.janela.tempoMsg("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseDeldir

	Executa a an&aacute;lise de triangula&ccedil;&atilde;o

	Veja:

	<ANALISEDISTRIPT>

	*/
	analiseDeldir: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var tema = $i("i3GEOpontosDistritemasComSel").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses=&cori=&corf=&tipo=deldir&limitepontos=&extendelimite=&sigma=&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				i3GEO.janela.tempoMsg("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseRelatorio

	Abre o relat&oacute;rio de an&aacute;lise

	Veja:

	<ANALISEDISTRIPT>

	*/
	analiseRelatorio: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(retorno){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					window.open(retorno.data);
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=relatorio&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&sigma="+$i("i3GEOpontosDistrisigma").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				i3GEO.janela.tempoMsg("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	}
};
