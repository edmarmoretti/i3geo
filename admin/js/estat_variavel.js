if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
//
//esse script tambem e utilizado em i3geo/ferramentas/metaestat
//
i3GEOadmin.variaveis = {
	/*
	 * armazena os dados das tabelas auxiliares, como tipos de unidades de medida, etc
	 */
	dadosAuxiliares: [],
	/*
	 * Funcao que sera executada apos um registro ser atuallizado
	 * Essa funcao e utilizada para modificar o comportamento dos formularios, ou seja, apos o usuario clicar no botao salvar
	 * essa funcao e executada no retorno da operacao de alteracao do resgistro no banco de dados
	 * E utilizado por i3geo/ferramentas/metaestat para customizar os formularios do ajudante de criacao de variaveis
	 */
	aposGravar: function(args){
	},
	inicia: function(){
		tree = "";
		YAHOO.namespace("admin.container");
		i3GEOadmin.variaveis.listaDadosAuxiliares();
		i3GEOadmin.variaveis.ativaBotaoAdicionaVariavel("estatVariavelAdiciona");
		i3GEOadmin.variaveis.ativaBotaoRelatorioCompleto("estatVariavelrelatorioCompleto");
		if($i("estatVariavelajuda")){
			core_ativaPainelAjuda("estatVariavelajuda","botaoAjuda");
		}
		if($i("estatVariavelArvore")){
			core_carregando("ativa");
			i3GEOadmin.variaveis.arvore.inicia();
		}
	},
	ativaBotaoAdicionaVariavel: function(idBotao){
		if(!$i(idBotao)){
			return;
		}
		var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraVariavel",
			adiciona = function(){
				core_carregando("ativa");
				core_carregando(" adicionando um novo registro");
				var callback = {
						success:function(o){
							try	{
								core_carregando("desativa");
								var j = YAHOO.lang.JSON.parse(o.responseText);
								i3GEOadmin.variaveis.arvore.adicionaNos([j],true);
								i3GEOadmin.variaveis.editar("variavel",j.codigo_variavel);
							}
							catch(e){core_handleFailure(e,o.responseText);}
						},
						failure:core_handleFailure,
						argument: { foo:"foo", bar:"bar" }
				};
			core_makeRequest(sUrl,callback);
		};
		//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
		new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
	},
	ativaBotaoRelatorioCompleto: function(idBotao){
		if(!$i(idBotao)){
			return;
		}
		var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=relatorioCompleto&dadosGerenciais=sim",
			adiciona = function(){
				core_carregando("ativa");
				core_carregando(" Aguarde");
				var callback = {
						success:function(o){
							try	{
								core_carregando("desativa");
								var j = YAHOO.lang.JSON.parse(o.responseText);
								core_montaEditor("","650px","500px","","Relat&oacute;rio");
								$i("editor_bd").innerHTML = j;
							}
							catch(e){core_handleFailure(e,o.responseText);}
						},
						failure:core_handleFailure,
						argument: { foo:"foo", bar:"bar" }
				};
				core_makeRequest(sUrl,callback);
			};
		new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
	},
	arvore:{
		inicia:function(){
			core_pegaDados("buscando vari&aacute;veis...",i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaVariavel","i3GEOadmin.variaveis.arvore.monta");
		},
		monta: function(dados){
			YAHOO.example.treeExample = new function()	{
				function changeIconMode(){
					buildTree();
				}
				function loadNodeData(node, fnLoadComplete){
					var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaMedidaVariavel&codigo_variavel="+node.data.codigo_variavel,
					callback = {
							success: function(oResponse){
								var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
								i3GEOadmin.variaveis.medidas.adicionaNos(node,dados,false);
								oResponse.argument.fnLoadComplete();
							},
							failure: function(oResponse){
								oResponse.argument.fnLoadComplete();
							},
							argument:{
								"node": node,
								"fnLoadComplete": fnLoadComplete
							},
							timeout: 25000
					};
					if(node.data.codigo_variavel){
						YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
					}
					else{
						fnLoadComplete.call();
					}
				}
				function buildTree(){
					tree = new YAHOO.widget.TreeView("estatVariavelArvore");
					tree.setDynamicLoad(loadNodeData, 1);
					var root = tree.getRoot(),
					tempNode = new YAHOO.widget.TextNode('', root, false);
					tempNode.isLeaf = true;
					core_carregando("desativa");
				}
				buildTree();
			}();
			i3GEOadmin.variaveis.arvore.adicionaNos(dados);
			tree.draw();
		},
		adicionaNos: function(dados,redesenha){
			var i,j,d,conteudo,
			root = tree.getRoot();
			for (i=0, j=dados.length; i<j; i++){
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('variavel','"+dados[i].codigo_variavel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('variavel','"+dados[i].codigo_variavel+"')\" title=editar src=\"../imagens/06.png\" /><b>";
				if(dados[i].nome && dados[i].nome != "")
				{conteudo += "&nbsp;<span>"+dados[i].nome+" - <span style='color:gray;'>"+dados[i].descricao+" id: "+dados[i].codigo_variavel+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir a vari&aacute;vel!!!</span>";}
				d = {html:conteudo,codigo_variavel:dados[i].codigo_variavel,tipo:"variavel"};
				new YAHOO.widget.HTMLNode(d, root, false,true);
			}
			if(redesenha){tree.draw();}
		}
	},
	medidas: {
		adicionaNos: function(no,dados,redesenha){
			var tempNode,tempNode1,tempNode2,tempNode3,tempNode4,tempNode5,i,conteudo,d,j;
			function temaIconMode(){
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
			}
			function loadNodeData(node, fnLoadComplete){
				var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaParametro&id_medida_variavel="+node.data.no_parametros,
				callback = {
						success: function(oResponse){
							var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
							i3GEOadmin.variaveis.parametro.adicionaNos(node,dados,false);
							oResponse.argument.fnLoadComplete();
						},
						failure: function(oResponse){
							oResponse.argument.fnLoadComplete();
						},
						argument:{
							"node": node,
							"fnLoadComplete": fnLoadComplete
						},
						timeout: 25000
				};
				YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
			};
			function loadNodeDataClasses(node, fnLoadComplete){
				var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaClassificacaoMedida&id_medida_variavel="+node.data.no_classificacao,
				callback = {
						success: function(oResponse){
							var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
							i3GEOadmin.variaveis.classificacao.adicionaNos(node,dados,false);
							oResponse.argument.fnLoadComplete();
						},
						failure: function(oResponse){
							oResponse.argument.fnLoadComplete();
						},
						argument:{
							"node": node,
							"fnLoadComplete": fnLoadComplete
						},
						timeout: 25000
				};
				YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
			};
			function loadNodeDataLinks(node, fnLoadComplete){
				var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaLinkMedida&id_medida_variavel="+node.data.no_link,
				callback = {
						success: function(oResponse){
							var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
							i3GEOadmin.variaveis.link.adicionaNos(node,dados,false);
							oResponse.argument.fnLoadComplete();
						},
						failure: function(oResponse){
							oResponse.argument.fnLoadComplete();
						},
						argument:{
							"node": node,
							"fnLoadComplete": fnLoadComplete
						},
						timeout: 25000
				};
				YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
			};
			function loadNodeDataFonteinfo(node, fnLoadComplete){
				var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaFonteinfoMedida&id_medida_variavel="+node.data.no_fonteinfo,
				callback = {
						success: function(oResponse){
							var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
							i3GEOadmin.variaveis.fonte.adicionaNos(node,dados,false);
							oResponse.argument.fnLoadComplete();
						},
						failure: function(oResponse){
							oResponse.argument.fnLoadComplete();
						},
						argument:{
							"node": node,
							"fnLoadComplete": fnLoadComplete
						},
						timeout: 25000
				};
				YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
			};
			if(!redesenha && !(tree.getNodeByProperty("etiqueta_adiciona_variavel",no.data.codigo_variavel))){
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style=\"cursor:pointer;\" onclick=\"i3GEOadmin.variaveis.medidas.adicionar('"+no.data.codigo_variavel+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova medida da vari&aacute;vel</i></span>",
							etiqueta_adiciona_variavel:no.data.codigo_variavel
						},
						no,
						false,
						true
				);
				tempNode.isLeaf = true;
			}
			for (i=0, j=dados.length; i<j; i++)	{
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title=editar src=\"../imagens/06.png\" /><b>";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.sql('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title='ver sql' src=\"../imagens/database.png\" /><b>";

				if(dados[i].nomemedida != "")
				{conteudo += "&nbsp;<span><b>"+dados[i].nomemedida+"</b> <span style='color:gray;'>"+dados[i].esquemadb+" - "+dados[i].tabela+" - "+dados[i].colunavalor+" id: "+dados[i].id_medida_variavel+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova medida!!!</span>";}
				d = {html:conteudo,id_medida_variavel:dados[i].id_medida_variavel,tipo:"medida"};
				tempNode1 = new YAHOO.widget.HTMLNode(d, no, false,true);
				tempNode1.isLeaf = false;
				//tempNode1.setDynamicLoad(temp, 1);
				conteudo = "&nbsp;Par&acirc;metros";
				d = {html:conteudo,no_parametros:dados[i].id_medida_variavel};
				tempNode2 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
				tempNode2.isLeaf = false;
				tempNode2.setDynamicLoad(loadNodeData, 1);
				conteudo = "&nbsp;Classifica&ccedil;&otilde;es";
				d = {html:conteudo,no_classificacao:dados[i].id_medida_variavel};
				tempNode3 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
				tempNode3.isLeaf = false;
				tempNode3.setDynamicLoad(loadNodeDataClasses, 1);
				conteudo = "&nbsp;Links";
				d = {html:conteudo,no_link:dados[i].id_medida_variavel};
				tempNode4 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
				tempNode4.isLeaf = false;
				tempNode4.setDynamicLoad(loadNodeDataLinks, 1);
				conteudo = "&nbsp;Fontes";
				d = {html:conteudo,no_fonteinfo:dados[i].id_medida_variavel};
				tempNode5 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
				tempNode5.isLeaf = false;
				tempNode5.setDynamicLoad(loadNodeDataFonteinfo, 1);
			}

			if(redesenha){tree.draw();}
		},
		adicionar: function(codigo_variavel){
			var no = tree.getNodeByProperty("codigo_variavel",codigo_variavel),
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraMedidaVariavel&codigo_variavel="+codigo_variavel,
			callback = {
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					i3GEOadmin.variaveis.medidas.adicionaNos(no,[dados],true);
					i3GEOadmin.variaveis.editar('medidaVariavel',dados.id_medida_variavel);
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback);
		},
		montaDiv: function(i){
			var temp,ins = "",limg=i3GEO.configura.locaplic+"/imagens/crialeg.jpg",
				param = {
					"linhas":[
										{titulo:"Nome:",id:"Enomemedida",size:"50",value:i.nomemedida,tipo:"text",div:""},
										{titulo:"Unidade de medida:",id:"",size:"50",value:i.codigo_unidade_medida,tipo:"text",div:"<div id=Ccodigo_unidade_medida ></div>"},
										{titulo:"Tipo de per&iacute;odo:",id:"",size:"50",value:i.codigo_tipo_periodo,tipo:"text",div:"<div id=Ccodigo_tipo_periodo ></div>"},
										{titulo:"Tipo de regi&atilde;o:",id:"",size:"50",value:i.codigo_tipo_regiao,tipo:"text",div:"<div id=Ccodigo_tipo_regiao ></div>"},
										{titulo:"Tabela do banco que contem os valores: <img onclick='i3GEOadmin.variaveis.selTabela(\"Etabela\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"sim\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"Etabela",size:"50",value:i.tabela,tipo:"text",div:""}
						]
				};
			ins += core_geraLinhas(param);
			ins += "<br><br><div id='editorMedidaDefault' >";
			param = {
				"linhas":[
									{titulo:"Conex&atilde;o:",id:"",size:"50",value:i.codigo_estat_conexao,tipo:"text",div:"<div id=Ccodigo_estat_conexao ></div>"},
									{titulo:"Esquema do banco: <img onclick='i3GEOadmin.variaveis.selEsquema(\"Eesquemadb\",\"Ecodigo_estat_conexao\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"Eesquemadb",size:"50",value:i.esquemadb,tipo:"text",div:""},
									{titulo:"Coluna com os valores: <img onclick='i3GEOadmin.variaveis.selColuna(\"Ecolunavalor\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"Ecolunavalor",size:"50",value:i.colunavalor,tipo:"text",div:""},
									{titulo:"Coluna de liga&ccedil;&atilde;o com a tabela GEO: <img onclick='i3GEOadmin.variaveis.selColuna(\"Ecolunaidgeo\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"Ecolunaidgeo",size:"50",value:i.colunaidgeo,tipo:"text",div:""},
									{titulo:"Coluna com os IDs &uacute;nicos que identificam cada registro da tabela com os valores: <img onclick='i3GEOadmin.variaveis.selColuna(\"Ecolunaidunico\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"Ecolunaidunico",size:"50",value:i.colunaidunico,tipo:"text",div:""},
									{titulo:"Filtro adicional:",id:"Efiltro",size:"50",value:i.filtro,tipo:"text",div:""}
				]
			};
			ins += core_geraLinhas(param);
			//utilizados pelo ajudante de criacao de variaveis
			//para permitir a criacao de parametros de tempo
			ins += "<div id=EparametrosTempo style='display:none' >";
			param = {
				"linhas":[
									{titulo:"Coluna com o ano (se couber): <img onclick='i3GEOadmin.variaveis.selColuna(\"EcolunaAno\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"EcolunaAno",size:"50",value:i.colunaano,tipo:"text",div:""},
									{titulo:"Coluna com o m&ecirc;s (se couber): <img onclick='i3GEOadmin.variaveis.selColuna(\"EcolunaMes\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"EcolunaMes",size:"50",value:i.colunames,tipo:"text",div:""},
									{titulo:"Coluna com o dia (se couber): <img onclick='i3GEOadmin.variaveis.selColuna(\"EcolunaDia\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"EcolunaDia",size:"50",value:i.colunadia,tipo:"text",div:""},
									{titulo:"Coluna com a hora (se couber): <img onclick='i3GEOadmin.variaveis.selColuna(\"EcolunaHora\",\"Ecodigo_estat_conexao\",\"Eesquemadb\",\"Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",id:"EcolunaHora",size:"50",value:i.colunahora,tipo:"text",div:""}
				]
			};
			ins += core_geraLinhas(param);
			ins += "</div><br><br>";
			//utilizado para passar o codigo da variavel qd for necessario
			ins += "<input type=hidden id='Ecodigo_variavel' value='' />";
			$i("editor_bd").innerHTML = ins;
			if($i("Ccodigo_unidade_medida")){
				temp = "<select id='Ecodigo_unidade_medida' >";
				temp += core_comboObjeto(i3GEOadmin.variaveis.dadosAuxiliares.unidade_medida,"codigo_unidade_medida","nome",i.codigo_unidade_medida);
				temp += "</select>";
				$i("Ccodigo_unidade_medida").innerHTML = temp;
			}
			if($i("Ccodigo_tipo_periodo")){
				temp = "<select id='Ecodigo_tipo_periodo' >";
				temp += core_comboObjeto(i3GEOadmin.variaveis.dadosAuxiliares.tipo_periodo,"codigo_tipo_periodo","nome",i.codigo_tipo_periodo);
				temp += "</select>";
				$i("Ccodigo_tipo_periodo").innerHTML = temp;
			}
			if($i("Ccodigo_tipo_regiao")){
				temp = "<select id='Ecodigo_tipo_regiao' >";
				temp += core_comboObjeto(i3GEOadmin.variaveis.dadosAuxiliares.tipo_regiao,"codigo_tipo_regiao","nome_tipo_regiao",i.codigo_tipo_regiao);
				temp += "</select>";
				$i("Ccodigo_tipo_regiao").innerHTML = temp;
			}
			if($i("Ccodigo_estat_conexao")){
				temp = "<select id='Ecodigo_estat_conexao' >";
				temp += core_comboObjeto(i3GEOadmin.variaveis.dadosAuxiliares.conexao,"codigo_estat_conexao","bancodedados",i.codigo_estat_conexao);
				temp += "</select>";
				$i("Ccodigo_estat_conexao").innerHTML = temp;
			}
			$i("Ecodigo_tipo_regiao").onchange = function(){
				//alert("Escolha uma tabela compat&iacute;vel com essa regi&atilde;o");
				//$i("Etabela").value = "";
			};
		}
	},
	classificacao:{
		adicionaNos: function(no,dados,redesenha){
			var tempNode,i,j,conteudo,d;
			function temaIconMode()	{
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
			}
			function loadNodeData(node, fnLoadComplete){
				var sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaClasseClassificacao&id_classificacao="+node.data.id_classificacao,
				callback = {
						success: function(oResponse){
							var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
							i3GEOadmin.variaveis.classes.adicionaNos(node,dados,false);
							oResponse.argument.fnLoadComplete();
						},
						failure: function(oResponse){
							oResponse.argument.fnLoadComplete();
						},
						argument:{
							"node": node,
							"fnLoadComplete": fnLoadComplete
						},
						timeout: 25000
				};
				YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
			};
			if(!redesenha)	{
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style=\"cursor:pointer;\" onclick=\"i3GEOadmin.variaveis.classificacao.adicionar('"+no.data.no_classificacao+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova classifica&ccedil;&atilde;o</i></span>"
						},
						no,
						false,
						true
				);
				tempNode.isLeaf = true;
			}
			for (i=0, j=dados.length; i<j; i++)	{
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('classificacaoMedida','"+dados[i].id_classificacao+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('classificacaoMedida','"+dados[i].id_classificacao+"')\" title=editar src=\"../imagens/06.png\" /><b>";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.classificacao.classesAuto('"+dados[i].id_classificacao+"','"+no.data.no_classificacao+"')\" title='criar classes' src=\"../imagens/accessories-calculator.png\" /><b>";

				if(dados[i].nome != "")
				{conteudo += "&nbsp;<span><b>"+dados[i].nome+"</b><span style=color:gray > Obs.: "+dados[i].observacao+" id: "+dados[i].id_classificacao+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova classifica&ccedil;&atilde;o!!!</span>";}
				d = {html:conteudo,id_classificacao:dados[i].id_classificacao,tipo:"classificacao"};
				tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
				tempNode.isLeaf = false;
				tempNode.setDynamicLoad(loadNodeData, 1);
			}
			if(redesenha){tree.draw();}
		},
		classesAuto: function(id_classificacao,id_medida_variavel){
			core_montaEditor("","450px","200px","","Criar classes");
			var ins = "<p class='paragrafo' >Utilize um dos m&eacute;todos abaixo para gerar as classes que ser&atilde;o utilizadas para representar os dados no cartograma</p>" +
			"&nbsp;<input id=i3GEOFmetaestatEditorBotao8 type='button' value='Escolher cores' />" +
			"<br><br>";
			ins += "&nbsp;<input id=i3GEOFmetaestatEditorBotao6 type='button' value='Divis&atilde;o em quartis' />" +
			"&nbsp;<input id=i3GEOFmetaestatEditorBotao7 type='button' value='5 intervalos iguais' />";
			ins += '<input type=hidden  value="" id="listaColourRampEditor"  />'; //utilizado pelo seletor de colourramp;
			$i("editor_bd").innerHTML = ins;
			new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotao8",
					{onclick:{fn:
						function(){
							i3GEO.util.abreColourRamp("","listaColourRampEditor",5);
						}
					}}
			);
			new YAHOO.widget.Button(
				"i3GEOFmetaestatEditorBotao6",
				{onclick:{fn:
					function(){
						var cores = $i("listaColourRampEditor").value,
							p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=calculaClassificacao&tipo=quartil&cores="+cores+"&id_classificacao="+id_classificacao+"&id_medida_variavel="+id_medida_variavel,
							callback;
						if(cores == ""){
							alert("Escolha as cores primeiro");
							return;
						}
						callback = {
								success:function(o){
									try	{
										core_carregando("desativa");
										var no = tree.getNodeByProperty("id_classificacao",id_classificacao);
										tree.removeChildren(no) ;
										no.expand();
									}
									catch(e){core_handleFailure(e,o.responseText);}
								},
								failure:core_handleFailure,
								argument: { foo:"foo", bar:"bar" }
						};
						core_carregando("ativa");
						core_makeRequest(p,callback);
					}
				}}
			);
			new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotao7",
				{onclick:{fn:
					function(){
						var cores = $i("listaColourRampEditor").value,
							p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=calculaClassificacao&tipo=intiguais5&cores="+cores+"&id_classificacao="+id_classificacao+"&id_medida_variavel="+id_medida_variavel,
							callback;
						if(cores == ""){
							alert("Escolha as cores primeiro");
							return;
						}
						callback = {
								success:function(o){
									try	{
										core_carregando("desativa");
										var no = tree.getNodeByProperty("id_classificacao",id_classificacao);
										tree.removeChildren(no) ;
										no.expand();
									}
									catch(e){core_handleFailure(e,o.responseText);}
								},
								failure:core_handleFailure,
								argument: { foo:"foo", bar:"bar" }
						};
						core_carregando("ativa");
						core_makeRequest(p,callback);
					}
				}}
			);
		},
		adicionar: function(id_medida_variavel){
			var no = tree.getNodeByProperty("no_classificacao",id_medida_variavel),
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraClassificacaoMedida&id_medida_variavel="+id_medida_variavel,
			callback = 	{
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					i3GEOadmin.variaveis.classificacao.adicionaNos(no,[dados],true);
					i3GEOadmin.variaveis.editar('classificacaoMedida',dados.id_classificacao);
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback);
		},
		montaDiv: function(i){
			var ins = "",
				param = {
					"linhas":[
							{titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
							{titulo:"Observa&ccedil;&atilde;o:",id:"Eobservacao",size:"50",value:i.observacao,tipo:"text",div:""}
					]
				};
			ins += core_geraLinhas(param);
			//utilizado para passar o codigo da variavel qd for necessario
			ins += "<input type=hidden id='Eid_medida_variavel' value='' />";
			//ins += "<br><br><br>";
			$i("editor_bd").innerHTML = ins;
		}
	},
	classes:{
		adicionaNos: function(no,dados,redesenha){
			var tempNode,i,j,conteudo,d;
			function temaIconMode()	{
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
			}
			if(!redesenha)	{
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style=\"cursor:pointer;\" onclick=\"i3GEOadmin.variaveis.classes.adicionar('"+no.data.id_classificacao+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova classe</i></span>"
						},
						no,
						false,
						true
				);
				tempNode.isLeaf = true;
			}
			for (i=0, j=dados.length; i<j; i++)	{
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('classeClassificacao','"+dados[i].id_classe+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('classeClassificacao','"+dados[i].id_classe+"')\" title=editar src=\"../imagens/06.png\" /><b>";
				if(dados[i].nome != "")
				{conteudo += "&nbsp;<span><b>"+dados[i].titulo+"</b><span style=color:gray >  id: "+dados[i].id_classe+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova classe!!!</span>";}
				d = {html:conteudo,id_classe:dados[i].id_classe,tipo:"classeClassificacao"};
				tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
				tempNode.isLeaf = true;
			}
			if(redesenha){tree.draw();}
		},
		adicionar: function(id_classificacao){
			var no = tree.getNodeByProperty("id_classificacao",id_classificacao),
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraClasseClassificacao&id_classificacao="+id_classificacao,
			callback = 	{
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					i3GEOadmin.variaveis.classes.adicionaNos(no,[dados],true);
					i3GEOadmin.variaveis.editar('classeClassificacao',dados.id_classe);
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback);
		},
		montaDiv: function(i){
			var ins = "",
			param = {
				"linhas":[
									{titulo:"T&iacute;tulo:",id:"Etitulo",size:"50",value:i.titulo,tipo:"text",div:""},
									{titulo:"Express&atilde;o (no estilo Mapserver)<br> exemplo (([nu_farm_funcionando] > 0) and ([nu_farm_funcionando] < 5)):",id:"Eexpressao",size:"50",value:i.expressao,tipo:"text",div:""},
									{titulo:"S&iacute;mbolo (pode ser utilizado uma imagem, exemplo: /var/www/i3geo/imagensteste.png) :",id:"Esimbolo",size:"10",value:i.simbolo,tipo:"text",div:""},
									{titulo:"Tamanho do s&iacute;mbolo:",id:"Etamanho",size:"10",value:i.tamanho,tipo:"text",div:""},
									{titulo:"Vermelho: <img src='../../imagens/aquarela.gif' style='cursor:pointer;' onclick='core_abreCor(\"\",\"inputEventoCor\");' />",id:"Evermelho",size:"10",value:i.vermelho,tipo:"text",div:""},
									{titulo:"Verde:",id:"Everde",size:"10",value:i.verde,tipo:"text",div:""},
									{titulo:"Azul:",id:"Eazul",size:"10",value:i.azul,tipo:"text",div:""},
									{titulo:"Contorno - tamanho do s&iacute;mbolo:",id:"Eotamanho",size:"10",value:i.otamanho,tipo:"text",div:""},
									{titulo:"Contorno - Vermelho <img src='../../imagens/aquarela.gif' style='cursor:pointer;' onclick='core_abreCor(\"\",\"inputEventoOutlineCor\");' />:",id:"Eovermelho",size:"10",value:i.overmelho,tipo:"text",div:""},
									{titulo:"Contorno - Verde:",id:"Eoverde",size:"10",value:i.overde,tipo:"text",div:""},
									{titulo:"Contorno - Azul:",id:"Eoazul",size:"10",value:i.oazul,tipo:"text",div:""}
				]
			};
			ins += core_geraLinhas(param);
			//ins += "<br><br><br>";
			//o input hidden recebe a cor da janela de selecao interativa e executa o preenchimento dos campos rgb

			$i("editor_bd").innerHTML = ins+"<input type=hidden value='' id='inputEventoCor' onchange='i3GEOadmin.variaveis.classes.preencheCores(\"inputEventoCor\",\"E\")' />";
			$i("editor_bd").innerHTML = ins+"<input type=hidden value='' id='inputEventoOutlineCor' onchange='i3GEOadmin.variaveis.classes.preencheCores(\"inputEventoOutlineCor\",\"Eo\")' />";

		},
		preencheCores: function(id,prefixo){
			var cor = $i(id).value.split(",");
			if(cor.length == 3){
				$i(prefixo+"vermelho").value = cor[0];
				$i(prefixo+"verde").value = cor[1];
				$i(prefixo+"azul").value = cor[2];
			}
		}
	},
	parametro:{
		adicionaNos: function(no,dados,redesenha){
			var tempNode,i,j,conteudo,d;
			function temaIconMode()	{
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
			}
			if(!redesenha)	{
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style=\"cursor:pointer;\" onclick=\"i3GEOadmin.variaveis.parametro.adicionar('"+no.data.no_parametros+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar novo par&acirc;metro</i></span>"
						},
						no,
						false,
						true
				);
				tempNode.isLeaf = true;
			}
			for (i=0, j=dados.length; i<j; i++)	{
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('parametroMedida','"+dados[i].id_parametro_medida+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('parametroMedida','"+dados[i].id_parametro_medida+"')\" title=editar src=\"../imagens/06.png\" /><b>";
				if(dados[i].nome != "")
				{conteudo += "&nbsp;<span><b>"+dados[i].nome+"</b><span style=color:gray > - "+dados[i].descricao+" id: "+dados[i].id_parametro_medida+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir o novo par&acirc;metro!!!</span>";}
				d = {html:conteudo,id_parametro_medida:dados[i].id_parametro_medida,tipo:"parametro"};
				tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
				tempNode.isLeaf = true;
			}
			if(redesenha){tree.draw();}
		},
		adicionar: function(id_medida_variavel){
			var no = tree.getNodeByProperty("no_parametros",id_medida_variavel),

			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraParametroMedida&id_medida_variavel="+id_medida_variavel,
			callback = 	{
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					i3GEOadmin.variaveis.parametro.adicionaNos(no,[dados],true);
					i3GEOadmin.variaveis.editar('parametroMedida',dados.id_parametro_medida);
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback);
		},
		montaDiv: function(i){
			var ins = "",
				limg=i3GEO.configura.locaplic+"/imagens/crialeg.jpg",
				param = {
					"linhas":[
							{titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
							{titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""},
							{titulo:"Coluna com os par&acirc;metros: <img onclick='i3GEOadmin.variaveis.selColuna(\"Ecoluna\",\"parametro_Ecodigo_estat_conexao\",\"parametro_Eesquemadb\",\"parametro_Etabela\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>",
							id:"Ecoluna",size:"50",value:i.coluna,tipo:"text",div:""},
							{titulo:"id_pai:",id:"Eid_pai",size:"50",value:i.id_pai,tipo:"text",div:""},
							{titulo:"Tipo:",id:"",size:"50",value:i.tipo,tipo:"text",div:"<div id=Ctipo_parametro ></div>"}
					]
				};
			ins += core_geraLinhas(param);
			ins += "<br><br><br>" +
				"<input type=hidden id=parametro_Ecodigo_estat_conexao value='"+i.codigo_estat_conexao+"' />" +
				"<input type=hidden id=parametro_Eesquemadb value='"+i.esquemadb+"' />" +
				"<input type=hidden id=parametro_Etabela value='"+i.tabela+"' />";
			$i("editor_bd").innerHTML = ins;
			//para saber a lista de tipos, veja a descricao da tabela de parametros no MER do banco de dados
			if($i("Ctipo_parametro")){
				temp = "<select id='Etipo' >";
				temp += core_comboObjeto(i3GEOadmin.variaveis.dadosAuxiliares.tiposDeParametros,"id","valor",i.tipo);
				temp += "</select>";
				$i("Ctipo_parametro").innerHTML = temp;
			}
		}
	},
	link: {
		adicionaNos: function(no,dados,redesenha){
			var tempNode,i,j,conteudo,d;
			function temaIconMode()	{
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
			}
			if(!redesenha)	{
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style=\"cursor:pointer;\" onclick=\"i3GEOadmin.variaveis.link.adicionar('"+no.data.no_link+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar novo link</i></span>"
						},
						no,
						false,
						true
				);
				tempNode.isLeaf = true;
			}
			for (i=0, j=dados.length; i<j; i++)	{
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('linkMedida','"+dados[i].id_link+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('linkMedida','"+dados[i].id_link+"')\" title=editar src=\"../imagens/06.png\" /><b>";
				if(dados[i].nome != "")
				{conteudo += "&nbsp;<span><a href='"+dados[i].link+"' >"+dados[i].nome+"</a><span style=color:gray > - "+dados[i].link+" - id: "+dados[i].id_link+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir o novo link!!!</span>";}
				d = {html:conteudo,id_link:dados[i].id_link,tipo:"link"};
				tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
				tempNode.isLeaf = true;
			}
			if(redesenha){tree.draw();}
		},
		adicionar: function(id_medida_variavel){
			var no = tree.getNodeByProperty("no_link",id_medida_variavel),
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraLinkMedida&id_medida_variavel="+id_medida_variavel,
			callback = 	{
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					i3GEOadmin.variaveis.link.adicionaNos(no,[dados],true);
					i3GEOadmin.variaveis.editar('linkMedida',dados.id_link);
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback);
		},
		montaDiv: function(i){
			var ins = "",
			param = {
				"linhas":[
									{titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
									{titulo:"Link:",id:"Elink",size:"50",value:i.link,tipo:"text",div:""}
									]
			};
			ins += core_geraLinhas(param);
			//ins += "<br><br><br>";
			$i("editor_bd").innerHTML = ins;
		}
	},
	fonte:{
		adicionaNos: function(no,dados,redesenha){
			var tempNode,i,j,conteudo,d;
			function temaIconMode()	{
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
			}
			if(!redesenha)	{
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style=\"cursor:pointer;\" onclick=\"i3GEOadmin.variaveis.editar('fonteinfo','"+no.data.no_fonteinfo+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova fonte</i></span>"
						},
						no,
						false,
						true
				);
				tempNode.isLeaf = true;
			}
			for (i=0, j=dados.length; i<j; i++)	{
				conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"i3GEOadmin.variaveis.excluir('fonteinfo','"+dados[i].id_fonteinfo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
				//conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"i3GEOadmin.variaveis.editar('fonteinfo','"+dados[i].id_fonteinfo+"')\" title=editar src=\"../imagens/06.png\" /><b>";

				if(dados[i].titulo != "")
				{conteudo += "&nbsp;<span><a href='"+dados[i].link+"' >"+dados[i].titulo+"</a><span style=color:gray > - "+dados[i].link+" - id: "+dados[i].id_fonteinfo+"</span></span>";}
				else
				{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova fonte!!!</span>";}
				d = {html:conteudo,id_medida_variavel_fonteinfo:no.data.no_fonteinfo,id_fonteinfo:dados[i].id_fonteinfo,tipo:"fonteinfo"};
				tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
				tempNode.isLeaf = true;
			}
			if(redesenha){tree.draw();}
		},
		/*
		adicionar: function(id_medida_variavel,id_fonteinfo){
			var no = tree.getNodeByProperty("no_fonteinfo",id_medida_variavel),
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=adicinaFonteinfoMedida&id_medida_variavel="+id_medida_variavel,
			callback = 	{
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					i3GEOadmin.variaveis.fonte.adicionaNos(no,[dados],true);
					i3GEOadmin.variaveis.editar('fonteinfo',id_medida_variavel);
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback);
		},
		*/
		montaDiv: function(dados){
			ins = "<br><b>Escolha a Fonte:</b><br><br>";
			ins += "<select style='width:400px;' id='Eid_fonteinfo' >";
			ins += core_comboObjeto(i3GEOadmin.variaveis.dadosAuxiliares.fonteinfo,"id_fonteinfo","titulo");
			ins += "</select>";
			$i("editor_bd").innerHTML = ins;
		}
	},
	montaDivVariavel: function(i){
		var ins = "",
		param = {
				"linhas":[
									{titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
									{titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""}
									]
		};
		ins += core_geraLinhas(param);
		//ins += "<br><br><br>";
		$i("editor_bd").innerHTML = ins;
	},
	editarMontaFormulario: function(dados,tipo,id){
		if(tipo == "variavel"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('variavel','"+id+"')","450px","200px","","Editor de vari&aacute;vel",true);
			i3GEOadmin.variaveis.montaDivVariavel(dados);
		}
		if(tipo == "medidaVariavel"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('medidaVariavel','"+id+"')","450px","200px","","Editor de medidas",true);
			i3GEOadmin.variaveis.medidas.montaDiv(dados);
		}
		if(tipo == "parametroMedida"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('parametroMedida','"+id+"')","450px","200px","","Editor de par&acirc;metros",true);
			i3GEOadmin.variaveis.parametro.montaDiv(dados);
		}
		if(tipo == "classificacaoMedida"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('classificacaoMedida','"+id+"')","450px","200px","","Editor de classifica&ccedil;&atilde;o",true);
			i3GEOadmin.variaveis.classificacao.montaDiv(dados);
		}
		if(tipo == "classeClassificacao"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('classeClassificacao','"+id+"')","450px","200px","","Editor de classe",true);
			i3GEOadmin.variaveis.classes.montaDiv(dados);
		}
		if(tipo == "linkMedida"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('linkMedida','"+id+"')","450px","200px","","Editor de links",true);
			i3GEOadmin.variaveis.link.montaDiv(dados);
		}
	},
	editar: function(tipo,id) {
		core_carregando("ativa");
		core_carregando(" buscando dados");
		var sUrl = null,
		callback = {
				success:function(o) {
					try	{
						var dados = "";
						if(o){
							dados = YAHOO.lang.JSON.parse(o.responseText);
						}
						i3GEOadmin.variaveis.editarMontaFormulario(dados,tipo,id);
						core_carregando("desativa");
					}
					catch(e){core_handleFailure(e,"");}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		if(tipo == "variavel"){
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaVariavel&codigo_variavel="+id;
		}
		if(tipo == "medidaVariavel"){
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaMedidaVariavel&id_medida_variavel="+id;
		}
		if(tipo == "parametroMedida"){
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaParametro&id_parametro_medida="+id;
		}
		if(tipo == "classificacaoMedida"){
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaClassificacaoMedida&id_classificacao="+id;
		}
		if(tipo == "classeClassificacao"){
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaClasseClassificacao&id_classe="+id;
		}
		if(tipo == "linkMedida"){
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaLinkMedida&id_link="+id;
		}
		if(tipo == "fonteinfo"){
			core_montaEditor("i3GEOadmin.variaveis.gravaDados('fonteinfo','"+id+"')","450px","200px","","Editor de fontes");
			i3GEOadmin.variaveis.fonte.montaDiv();
			core_carregando("desativa");
		}
		if(sUrl){
			//se id for vazio, o editor e montado vazio
			//caso contrario, os dados sao obtidos via ajax
			if(id == ""){
				callback.success();
			}
			else{
				core_makeRequest(sUrl,callback);
			}
		}
	},
	sql: function(tipo,id) {
		core_carregando("ativa");
		core_carregando(" buscando dados");
		var sUrl = null,
		callback = {
				success:function(o) {
					try	{
						if(tipo == "medidaVariavel"){
							var ins = "",
							dados = YAHOO.lang.JSON.parse(o.responseText);
							core_montaEditor("","480px","300px","","Testes",false);
							ins = "<p><b>Select simples:</b> "+dados.sql;
							ins += "<p><b>Mapserver:</b> "+dados.sqlmapserver;
							ins += "<p><b>&Uacute;ltima URL:</b><div id='ultimaUrl'></div> ";
							ins += "<p><b>Colunas:</b> "+dados.colunas;
							ins +="<p><input style='position:relative;top:2px' type='checkbox' id='incluirtodascolunas' />Incluir todas as colunas no resultado";
							ins +="<p>Filtro opcional (exemplo: valor = 1)<br>";
							ins += "<input type=text value='' id='filtrosql' />";
							ins +="<p>Agrupar pela coluna<br>";
							ins += "<input type=text value='' id='agruparsql' />";
							ins +="<p>Tipo de layer (para o caso de mapas ou mapfiles, podendo ser point,line ou polygon)<br>";
							ins += "<input type=text value='' id='tipolayer' />";
							ins +="<p>Codigo da classifica&ccedil;&atilde;o que ser&aacute; usada para mostrar o mapa<br>";
							ins += "<input type=text value='' id='classificacao' />";
							ins += '  <p><input type=button id="sqljson" value="JSON" />';
							ins += '  <input type=button id="xmlestat" value="XML" />';
							ins += '  <input type=button id="sumarioestat" value="Sum&aacute;rio" />';
							ins += '  <input type=button id="sumarioxmlestat" value="Sum&aacute;rio XML" />';
							ins += '  <input type=button id="graficoestat" value="Gr&aacute;fico" />';
							ins += '  <input type=button id="mapfileestat" value="Mapfile" /><br><br>';
							ins += '  <input type=button id="i3geoestat" value="i3Geo" />';
							ins += '  <input type=button id="kmzestat" value="Kmz (vetorial)" />';
							ins += '  <input type=button id="kmlestat" value="Kml (wms)" />';
							ins += '  <input type=button id="kml3destat" value="Kml 3d" />';

							$i("editor_bd").innerHTML = ins;
							new YAHOO.widget.Button("sqljson");
							document.getElementById("sqljson-button").onclick = function(){
								var u,colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=dadosMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&agruparpor="+$i("agruparsql").value;
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("xmlestat");
							document.getElementById("xmlestat-button").onclick = function(){
								var u,colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=dadosMedidaVariavel&formato=xml&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&agruparpor="+$i("agruparsql").value;
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("sumarioestat");
							$i("sumarioestat-button").onclick = function(){
								var u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=sumarioMedidaVariavel&formato=json&id_medida_variavel='+id+"&agruparpor="+$i("agruparsql").value+"&filtro="+$i("filtrosql").value;
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("sumarioxmlestat");
							$i("sumarioxmlestat-button").onclick = function(){
								var u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=sumarioMedidaVariavel&formato=xml&id_medida_variavel='+id+"&agruparpor="+$i("agruparsql").value+"&filtro="+$i("filtrosql").value;
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("mapfileestat");
							$i("mapfileestat-button").onclick = function(){
								var u,colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=mapfileMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value;
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("kmzestat");
							$i("kmzestat-button").onclick = function(){
								var u,colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=kmlmedidavariavel&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value+"&formato=kmz";
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("kmlestat");
							$i("kmlestat-button").onclick = function(){
								var u,colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=kmlmedidavariavel&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value+"&formato=kml";
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("kml3destat");
							$i("kml3destat-button").onclick = function(){
								var u,colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=kmlmedidavariavel&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value+"&formato=kml3d";
								$i("ultimaUrl").innerHTML = u;
								window.open(u);
							};
							new YAHOO.widget.Button("i3geoestat");
							$i("i3geoestat-button").onclick = function(){
								var u,sUrl,callback = 	{
										success: function(oResponse){
											var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
											u = i3GEO.configura.locaplic+"/ms_criamapa.php?temasa="+dados.mapfile+"&layers="+dados.layer;
											$i("ultimaUrl").innerHTML = u;
											window.open(u);
											core_carregando("desativa");
										},
										failure:core_handleFailure,
										argument: { foo:"foo", bar:"bar" }
								},
								colunas = 0;
								if($i("incluirtodascolunas").checked === true){
									colunas = 1;
								}
								sUrl = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=mapfileMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value;
								core_carregando("ativa");
								core_makeRequest(sUrl,callback);
							};
							new YAHOO.widget.Button("graficoestat");
							$i("graficoestat-button").onclick = function(){
								var callback = 	{
										success: function(oResponse){
											var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
											dados = dados.grupos;
											if(dados == ""){
												dados = dados.histograma;
											}
											//converte os dados para o padrao usado no grafico
											abreDados = function(){
												i3GEOF.graficointerativo.dados = dados;
												i3GEOF.graficointerativo.montaTabelaDados = function(dados){
													var i=0,
													v,
													ins,
													key = "",
													id,
													cor = "#C11515";
													n = dados.lenght;
													v = [];
													ins = [];
													ins.push("<p class=paragrafo >Tabela de dados para o gr&aacute;fico. Os valores podem ser editados</p><table class=lista4 id=i3GEOgraficointerativotabeladados ><tr><td></td>");
													ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,1)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> nome</td>");
													ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,2)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> valor</td>");
													ins.push("<td style=background-color:yellow >cor</td><td></td></tr>");
													for(key in dados){
														v[0] = key;
														v[1] = dados[key];
														id = "i3GEOgraficointerativoDados"+i; //layer+indice da classe
														ins.push("<tr><td>");
														ins.push("<img style='cursor:pointer' title='clique para excluir' onclick='i3GEOF.graficointerativo.excluilinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='excluir' /></td>");
														ins.push("</td><td>");
														ins.push($inputText("","",id+"_nome","digite o novo nome",20,v[0],"nome"));
														ins.push("</td><td>");
														ins.push($inputText("","",id+"_valor","digite o novo valor",12,v[1],"valor"));
														ins.push("</td><td>");
														if($i("i3GEOgraficointerativoCoresA").checked){
															cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
														}
														//verifica se no objeto com os dados existe um terceiro valor com as cores
														if(v[2]){
															cor = i3GEO.util.rgb2hex(v[2]);
														}
														ins.push($inputText("","",id+"_cor","",12,cor,"cor"));
														ins.push("</td><td>");
														ins.push("<img alt='aquarela.gif' style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo.corj(\""+id+"_cor\")' />");
														ins.push("</td></tr>");
														i++;
													}
													ins.push("</table><br>");
													//ins.push("<input type=hidden id=i3GEOgraficointerativoComboXid />");
													//ins.push("<input type=hidden id=i3GEOgraficointerativoComboYid />");
													$i("i3GEOgraficointerativoDados").innerHTML = ins.join("");
													if($i("agruparsql").value != ""){
														//$i("i3GEOgraficointerativoComboXid").value = $i("agruparsql").value;
														//$i("i3GEOgraficointerativoComboYid").value = "Soma";
													}
												};
												i3GEOF.graficointerativo.criaJanelaFlutuante();
												core_carregando("desativa");
											};
											i3GEO.util.scriptTag(
													"../../ferramentas/graficointerativo/index.js",
													"abreDados()",
													"i3GEOF.graficointerativo_script"
											);
										},
										failure:core_handleFailure,
										argument: { foo:"foo", bar:"bar" }
								},
								sUrl = '../php/metaestat.php?funcao=sumarioMedidaVariavel&formato=json&id_medida_variavel='+id+"&agruparpor="+$i("agruparsql").value+"&filtro="+document.getElementById("filtrosql").value;
								core_carregando("ativa");
								core_makeRequest(sUrl,callback);
							};
						}
						if(tipo == "parametroMedida"){

						}
						core_carregando("desativa");
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		if(tipo == "medidaVariavel"){
			sUrl = "../php/metaestat.php?funcao=sqlMedidaVariavel&id_medida_variavel="+id;
		}
		if(tipo == "parametroMedida"){
			sUrl = "../php/metaestat.php?funcao=listaParametro&id_parametro_medida="+id;
		}
		if(sUrl){
			core_makeRequest(sUrl,callback);
		}
	},
	excluir: function(tipo,id){
		var mensagem = " excluindo o registro = "+id,
		no = null,
		sUrl = null;
		if(tipo == "variavel")	{
			no = tree.getNodeByProperty("codigo_variavel",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirVariavel&codigo_variavel="+id;
		}
		if(tipo == "medidaVariavel")	{
			no = tree.getNodeByProperty("id_medida_variavel",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirMedidaVariavel&id_medida_variavel="+id;
		}
		if(tipo == "parametroMedida")	{
			no = tree.getNodeByProperty("id_parametro_medida",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirParametroMedida&id_parametro_medida="+id;
		}
		if(tipo == "classificacaoMedida")	{
			no = tree.getNodeByProperty("id_classificacao",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirClassificacaoMedida&id_classificacao="+id;
		}
		if(tipo == "classeClassificacao")	{
			no = tree.getNodeByProperty("id_classe",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirClasseClassificacao&id_classe="+id;
		}
		if(tipo == "linkMedida")	{
			no = tree.getNodeByProperty("id_link",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirLinkMedida&id_link="+id;
		}
		if(tipo == "fonteinfo")	{
			no = tree.getNodeByProperty("id_fonteinfo",id);
			sUrl = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluirFonteinfoMedida&id_fonteinfo="+id+"&id_medida_variavel="+no.data.id_medida_variavel_fonteinfo;
		}
		if(sUrl)
		{core_excluiNoTree(sUrl,no,mensagem);}
	},
	gravaDados: function(tipo,id){
		var reg,temp,sUrl,i,campos = null,
		par = null,
		prog = null;
		if(tipo == "variavel"){
			campos = new Array("nome","descricao");
			par = "&codigo_variavel="+id;
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraVariavel";
		}
		if(tipo == "medidaVariavel"){
			campos = new Array("colunaAno","colunaMes","colunaDia","colunaHora","codigo_variavel","codigo_unidade_medida","codigo_tipo_periodo","codigo_tipo_regiao","codigo_estat_conexao","esquemadb","tabela","colunavalor","colunaidgeo","colunaidunico","filtro","nomemedida");
			par = "&id_medida_variavel="+id;
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraMedidaVariavel";
		}
		if(tipo == "parametroMedida"){
			campos = new Array("nome","descricao","coluna","id_pai","tipo");
			par = "&id_parametro_medida="+id;
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraParametroMedida";
		}
		if(tipo == "classificacaoMedida"){
			campos = new Array("id_medida_variavel","nome","observacao");
			par = "&id_classificacao="+id;
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraClassificacaoMedida";
		}
		if(tipo == "classeClassificacao"){
			campos = new Array("titulo","azul","verde","vermelho","tamanho","simbolo","otamanho","overde","oazul","overmelho");
			par = "&id_classe="+id;
			//troca o < por | para evitar problemas de passagem de parametro
			temp = $i("Eexpressao").value;
			reg = new RegExp("<", "g");
			temp = temp.replace(reg,'|');
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraClasseClassificacao&expressao="+temp;
		}
		if(tipo == "linkMedida"){
			campos = new Array("nome","link");
			par = "&id_link="+id;
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraLinkMedida";
		}
		if(tipo == "fonteinfo"){
			campos = new Array("id_fonteinfo");
			par = "&id_medida_variavel="+id;
			prog = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=adicionaFonteinfoMedida";
		}
		for (i=0;i<campos.length;i++)
		{par += "&"+campos[i]+"="+($i("E"+campos[i]).value);}

		var callback = {
				success:function(o){
					try	{
						var no;
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
							core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem menus vinculados a este tema</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else{
							if(tipo == "variavel"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("codigo_variavel",id);
								no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enome").value+"</b> - <span style='color:gray;'>"+document.getElementById("Edescricao").value+" id: "+id+"</span>";
								no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								no.html = no.getContentEl().innerHTML;
							}
							if(tipo == "medidaVariavel"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("id_medida_variavel",id);
								no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enomemedida").value+"</b> - <span style='color:gray;'>"+document.getElementById("Eesquemadb").value+" - "+document.getElementById("Etabela").value+" - "+document.getElementById("Ecolunavalor").value+" id: "+id+"</span>";
								no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								no.html = no.getContentEl().innerHTML;
							}
							if(tipo == "parametroMedida"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("id_parametro_medida",id);
								no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enome").value+"</b><span style=color:gray > - "+document.getElementById("Edescricao").value+" id: "+id+"</span>";
								no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								no.html = no.getContentEl().innerHTML;
							}
							if(tipo == "classificacaoMedida"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("id_classificacao",id);
								no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enome").value+"</b><span style=color:gray > Obs.: "+document.getElementById("Eobservacao").value+" id: "+id+"</span>";
								no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								no.html = no.getContentEl().innerHTML;
							}
							if(tipo == "classeClassificacao"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("id_classe",id);
								no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Etitulo").value+"</b><span style=color:gray > id: "+id+"</span>";
								no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								no.html = no.getContentEl().innerHTML;
							}
							if(tipo == "linkMedida"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("id_link",id);
								no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<a href='"+document.getElementById("Elink").value+"' >"+document.getElementById("Enome").value+"</a><span style=color:gray > - "+document.getElementById("Elink").value+" - id: "+id+"</span>";
								no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								no.html = no.getContentEl().innerHTML;
							}
							if(tipo == "fonteinfo"){
								i3GEOadmin.variaveis.aposGravar.call([tipo,id]);
								if(!YAHOO.lang.isObject(tree)){
									core_carregando("desativa");
									if(YAHOO && YAHOO.admin && YAHOO.admin.container && YAHOO.admin.container.panelEditor){
										YAHOO.admin.container.panelEditor.destroy();
									}
									return;
								}
								no = tree.getNodeByProperty("no_fonteinfo",id);
								i3GEOadmin.variaveis.fonte.adicionaNos(no,[YAHOO.lang.JSON.parse(o.responseText)],true);
								//no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<a href='"+document.getElementById("Elink").value+"' >"+document.getElementById("Etitulo").value+"</a><span style=color:gray > - "+document.getElementById("Elink").value+" - id: "+id+"</span>";
								//no.getContentEl().getElementsByTagName("span")[0].style.color = "";
								//no.html = no.getContentEl().innerHTML;
							}
							core_carregando("desativa");
						}
						YAHOO.admin.container.panelEditor.destroy();
						YAHOO.admin.container.panelEditor = null;
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		if(prog && par){
			core_carregando("ativa");
			core_carregando(" gravando o registro do id= "+id);
			sUrl = prog+par;
			core_makeRequest(sUrl,callback,'GET');
		}
	},
	listaDadosAuxiliares: function(){
		var callback = {
				success:function(o){
					try	{
						i3GEOadmin.variaveis.dadosAuxiliares = YAHOO.lang.JSON.parse(o.responseText);
						i3GEOadmin.variaveis.dadosAuxiliares["tiposDeParametros"] = [
							{"id":"0","valor":"Nao definido"},
							{"id":"1","valor":"Ano"},
							{"id":"2","valor":"Mes"},
							{"id":"3","valor":"Dia"},
							{"id":"4","valor":"Hora"}
						];
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaDadosTabelasAuxiliares",callback);
	},
	selEsquema: function(idEleValue,idEleCodigoConexao){
		var eleValue = $i(idEleValue),
		eleCodigoConexao = $i(idEleCodigoConexao),
		callback = {
				success:function(o){
					try	{
						var dados = YAHOO.lang.JSON.parse(o.responseText),
						n = dados.length,
						i,
						valores = [],
						textos = [],
						selecionados = [eleValue.value];
						for(i=0;i<n;i++){
							valores.push(dados[i].esquema);
							textos.push(dados[i].esquema);
						}
						core_menuCheckBox(valores,textos,selecionados,eleValue,"","","sim");
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		if(!eleValue || !eleCodigoConexao){
			return;
		}
		if(eleCodigoConexao.value == ""){
			alert("Escolha uma conexao");
			return;
		}
		core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=esquemasConexao&formato=json&codigo_estat_conexao="+eleCodigoConexao.value,callback);
	},
	selTabela: function(idEleValue,idEleCodigoConexao,idEleNomeEsquema,excluigeom){
		if(!excluigeom){
			excluigeom = "nao";
		}
		var eleValue = $i(idEleValue),
		eleCodigoConexao = $i(idEleCodigoConexao),
		eleNomeEsquema = $i(idEleNomeEsquema),
		callback = {
				success:function(o){
					try	{
						var dados = YAHOO.lang.JSON.parse(o.responseText),
						n = dados.length,
						i,
						valores = [],
						textos = [],
						selecionados = [eleValue.value];
						for(i=0;i<n;i++){
							valores.push(dados[i].tabela);
							textos.push(dados[i].tabela);
						}
						core_menuCheckBox(valores,textos,selecionados,eleValue,"","","sim");
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		if(!eleValue || !eleCodigoConexao || !eleNomeEsquema){
			return;
		}
		if(eleCodigoConexao.value == ""){
			alert("Escolha uma conexao");
			return;
		}
		if(eleNomeEsquema.value == ""){
			alert("Escolha um esquema");
			return;
		}
		core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=tabelasEsquema&formato=json&codigo_estat_conexao="+eleCodigoConexao.value+"&nome_esquema="+eleNomeEsquema.value+"&excluigeom="+excluigeom,callback);
	},
	selColuna: function(idEleValue,idEleCodigoConexao,idEleNomeEsquema,idEleNomeTabela){
		var eleValue = $i(idEleValue),
		eleCodigoConexao = $i(idEleCodigoConexao),
		eleNomeEsquema = $i(idEleNomeEsquema),
		eleNomeTabela = $i(idEleNomeTabela),
		callback = {
				success:function(o){
					try	{
						var dados = YAHOO.lang.JSON.parse(o.responseText),
						n = dados.length,
						i,
						valores = [],
						textos = [],
						selecionados = [eleValue.value];
						for(i=0;i<n;i++){
							valores.push(dados[i]);
							textos.push(dados[i]);
						}
						core_menuCheckBox(valores,textos,selecionados,eleValue,"","","sim");
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		if(!eleValue || !eleCodigoConexao || !eleNomeEsquema || !eleNomeTabela){
			return;
		}
		if(eleCodigoConexao.value == ""){
			alert("Escolha uma conexao");
			return;
		}
		if(eleNomeEsquema.value == ""){
			alert("Escolha um esquema");
			return;
		}
		if(eleNomeTabela.value == ""){
			alert("Escolha uma tabela");
			return;
		}
		core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=colunasTabela&formato=json&codigo_estat_conexao="+eleCodigoConexao.value+"&nome_esquema="+eleNomeEsquema.value+"&nome_tabela="+eleNomeTabela.value,callback);
	}


};