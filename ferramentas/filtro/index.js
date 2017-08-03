if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

/*
Classe: i3GEOF.filtro
*/
i3GEOF.filtro = {
	CONTADOR: 0,
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
	/*
	Variavel: comboTemas

	Armazena o combo com os itens do tema
	*/
	comboTemas: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MUSTACHELINHAFILTRO: "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function(modoCalculadora,idRetorno) {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.filtro.dicionario);
		dicionario["modoCalculadora"] = modoCalculadora;
		dicionario["idRetorno"] = idRetorno;
		if(modoCalculadora == true){
			dicionario["escondeGuias"] = "hidden";
		} else {
			dicionario["escondeGuias"] = "";
		}
		i3GEOF.filtro.dicionario["escondeGuias"] = dicionario["escondeGuias"];
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv,modoCalculadora,idRetorno){
		if(i3GEOF.filtro.MUSTACHE == ""){
			var t1 = i3GEO.configura.locaplic + "/ferramentas/filtro/template_mst.html",
			t2 = i3GEO.configura.locaplic + "/ferramentas/filtro/template_linhafiltro_mst.html";

			$.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
				i3GEOF.filtro.MUSTACHE = r1[0];
				i3GEOF.filtro.MUSTACHELINHAFILTRO = r2[0];
				i3GEOF.filtro.inicia(iddiv,modoCalculadora,idRetorno);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		}
		if(modoCalculadora === undefined){
			modoCalculadora = false;
		}
		if(modoCalculadora === false){
			if (!$i("i3GEOFfiltroComboCabecaSel")) {
				i3GEO.janela.comboCabecalhoTemasBs("i3GEOFfiltroComboCabeca","i3GEOFfiltroComboCabecaSel","filtro","ligadosComTabela",function(evt){
					var botao = evt.target;
					if (botao) {
						if (botao.value != "") {
							i3GEO.mapa.ativaTema(botao.value);
							i3GEOF.filtro.tema = botao.value;
							$i(iddiv).innerHTML = "";
							i3GEOF.filtro.inicia(iddiv);
						} else {
							$i(iddiv).innerHTML = "";
						}
					}
				});
			}
			if(i3GEOF.filtro.tema === ""){
				$i(iddiv).innerHTML = "";
				return;
			}
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.filtro.html(modoCalculadora,idRetorno);
			i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
			if(modoCalculadora === false){
				//eventos das guias
				$i("i3GEOfiltroguia1").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
				};
				$i("i3GEOfiltroguia2").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia2","i3GEOfiltroguia");
					i3GEOF.filtro.pegaFiltro();
				};
				/*
				$i("i3GEOfiltroguia3").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia3","i3GEOfiltroguia");
					i3GEOF.filtro.aplicaFiltro("sim");
				};
				*/
			}
			//
			//pega a lista de itens e chama a fun&ccedil;&atilde;o de montagem das op&ccedil;&otilde;es de cria&ccedil;&atilde;o do filtro
			//
			i3GEO.util.comboItens(
				"",
				i3GEOF.filtro.tema,
				function(retorno){
					i3GEOF.filtro.comboTemas = retorno.dados;
					i3GEOF.filtro.adicionaLinhaFiltro();
				},
				"",
				"coluna",
				"",
				"",
				"form-control"
			);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(modoCalculadora,idRetorno){
		var ins = Mustache.render(i3GEOF.filtro.MUSTACHE, i3GEOF.filtro.mustacheHash(modoCalculadora,idRetorno));
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	A opcao modoCalculadora (boolean) aplica o filtro em um elemento ID e nao aplica ao tema
	Nesse modo e necessario indicar o id do elemento que recebera o filtro
	*/
	iniciaJanelaFlutuante: function(modoCalculadora,idRetorno){
		var janela,divid,temp,titulo = "";
		if(modoCalculadora === undefined){
			modoCalculadora = false;
		}
		if($i("i3GEOF.filtro")){
			i3GEOF.filtro.inicia("i3GEOF.filtro_corpo");
			return;
		}
		//cria a janela flutuante
		if(modoCalculadora === false){
			titulo = "<div  id='i3GEOFfiltroComboCabeca' class='comboTemasCabecalhoBs form-group' style='width:200px; left:15px;'>   ------</div></div><a class='i3GeoTituloJanelaBs' style='right:40px;' target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=38' >"+$trad("t29")+"</a>";
		}
		janela = i3GEO.janela.cria(
			"600px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.filtro",
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
		janela[0].bringToTop();
		i3GEOF.filtro.aguarde = $i("i3GEOF.filtro_imagemCabecalho").style;
		$i("i3GEOF.filtro_corpo").style.backgroundColor = "white";
		i3GEOF.filtro.inicia(divid,modoCalculadora,idRetorno);

	},
	/*
	Function: adicionaLinhaFiltro

	Adiciona uma nova linha de filtro
	*/
	removeLinha : function(obj,id){
		var linha = $i("linhaFiltro"+id);
		linha.parentNode.removeChild(linha);
	},
	listaValores: function(id){
		var itemTema = $("#linhaFiltro" + id + " [name='coluna']").val();
		i3GEO.util.comboValoresItem(
			"i3GEOfiltrocbitens",
			i3GEOF.filtro.tema,
			itemTema,
			function(retorno){
				$i("i3GEOfiltrovalores").innerHTML = "<label class='control-label'>" +
					$trad('selecionaValor',i3GEOF.filtro.dicionario) +
					":</label>" +
					retorno.dados;
				if ($i("i3GEOfiltrocbitens")){
					$i("i3GEOfiltrocbitens").onchange = function() {
						$("#linhaFiltro" + id + " [name='valor']").val(this.value);
					};
				}
			},
			"i3GEOfiltrovalores",
			"form-control"
		);
	},
	adicionaLinhaFiltro: function(){
		i3GEOF.filtro.CONTADOR++;
		var temp,ntr,tabela;
		ntr = document.createElement("tr");
		ntr.id = "linhaFiltro"+i3GEOF.filtro.CONTADOR;
		temp = Mustache.render(
				"{{#data}}" + i3GEOF.filtro.MUSTACHELINHAFILTRO + "{{/data}}",
				{"data":{"comboTemas": i3GEOF.filtro.comboTemas,"contador": i3GEOF.filtro.CONTADOR, "escondeGuias": i3GEOF.filtro.dicionario["escondeGuias"]}}
		);
		$(ntr).html(temp);
		tabela = $i("i3GEOfiltroparametros");
		tabela.appendChild(ntr);
	},
	/*
	Function: pegaFiltro

	Pega o filtro atual de um tema

	Veja:

	<PEGAFILTRO>
	*/
	pegaFiltro: function(){
		var p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegafiltro&tema="+i3GEOF.filtro.tema,
			cp = new cpaint(),
			temp = function(retorno){
				if(retorno.data !== undefined)
				{$i("i3GEOfiltrofiltro").value = i3GEO.util.base64decode(retorno.data);}
			};
		cp.set_response_type("JSON");
		cp.call(p,"pegaFiltro",temp);
	},
	/*
	Function: limpaFiltro

	Limpa o filtro de um tema

	Veja:

	<INSEREFILTRO>
	*/
	limpaFiltro: function(){
		try{
			if(i3GEOF.filtro.aguarde.visibility === "visible")
			{return;}
			i3GEOF.filtro.aguarde.visibility = "visible";
			var p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro&tema="+i3GEOF.filtro.tema+"&filtro=",
				cp = new cpaint(),
				temp = function(retorno){
					i3GEOF.filtro.aguarde.visibility = "hidden";
					if(i3GEO.Interface.ATUAL === "padrao")
					{i3GEO.atualiza(retorno);}
					i3GEO.Interface.atualizaTema(retorno,i3GEOF.filtro.tema);
				};
			cp.set_response_type("JSON");
			cp.call(p,"insereFiltro",temp);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Function: aplicaFiltro

	Aplica um filtro ao tema

	Veja:

	<INSEREFILTRO>

	Parametro:

	testa {String} - sim|nao indica a realiza&ccedil;&atilde;o de teste ou aplica&ccedil;&atilde;o final do filtro
	*/
	aplicaFiltro: function(testa,modoCalculadora,idRetorno){
		if(arguments.length === 0)
		{testa = "nao";}
		if(i3GEOF.filtro.aguarde.visibility === "visible")
		{return;}
		try{
			i3GEOF.filtro.aguarde.visibility = "visible";
			var filtro = "",
				re,p,cp,temp;
			if( ($i("i3GEOfiltrofiltro").value !== "") && ($i("i3GEOfiltroguia2obj").style.display === "block")){
				filtro = $i("i3GEOfiltrofiltro").value;
			}
			else{
				filtro = i3GEOF.filtro.formataMapserver();
			}
			if(modoCalculadora === true){
				i3GEOF.filtro.aguarde.visibility = "hidden";
				temp = i3GEOF.filtro.formataMapserver();
				re = new RegExp("'", "g");
				temp = temp.replace(re, '"');
				$i(idRetorno).value = temp;
				i3GEO.janela.destroi("i3GEOF.filtro");
			}
			else{
				p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?base64=sim&g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro";
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.set_transfer_mode('POST');
				if (testa.toLowerCase() === "sim"){
					temp = function(retorno){
						$i("i3GEOfiltroguia3obj").innerHTML = "<img src="+retorno.data+" />";
						i3GEOF.filtro.aguarde.visibility = "hidden";
					};
				}
				else{
					temp = function(retorno){
						if(i3GEO.Interface.ATUAL === "padrao")
						{i3GEO.atualiza(retorno);}
						i3GEO.Interface.atualizaTema(retorno,i3GEOF.filtro.tema);
						i3GEOF.filtro.aguarde.visibility = "hidden";
					};
				}
				cp.call(p,"insereFiltro",temp,"tema="+i3GEOF.filtro.tema+"&testa="+testa+"&filtro=" + i3GEO.util.base64encode(filtro));
			}
		}
		catch(e){
			i3GEO.janela.tempoMsg("Erro: "+e);
			i3GEOF.filtro.aguarde.visibility = "hidden";
		}
	},
	formataMapserver : function(){
		var filtro = "",g,ipt,i,nos,s,itemsel,operador,valor;
		g = $i("i3GEOfiltroparametros");
		ipt = g.getElementsByTagName("tr");
		if (ipt.length > 1){
			for (i=1;i<ipt.length; i++){
				itemsel = $(ipt[i]).find("[name='coluna']").val();
				operador = $(ipt[i]).find("[name='operador']").val();
				valor = $(ipt[i]).find("[name='valor']").val();
				conector = $(ipt[i]).find("[name='conector']").val();
				if (valor*1){
					filtro = filtro + "(["+itemsel+"] "+operador+" "+valor+")";
				}
				else{
					filtro = filtro + "('["+itemsel+"]' "+operador+" '"+valor+"')";
				}
				if ((i + 1) != ipt.length){
					filtro = filtro + conector;
				}
				else{
					filtro = "("+filtro+")";
				}
			}
		}
		return filtro;
	}
};