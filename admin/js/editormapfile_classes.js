//
//Utilizado por editormapfile.js
//
/*
Function: editorClasseGeral

Abre o editor de dados gerais de uma classe

<PEGAGERAL>
*/
function editorClasseGeral(codigoMap,codigoLayer,indiceClasse)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorClasseGeral");
}
function loadClasseData(node, fnLoadComplete)
{
	var sUrl = "../php/editormapfile.php?funcao=listaEstilos&codigoMap="+node.data.codigoMap+"&codigoLayer="+node.data.codigoLayer+"&indiceClasse="+node.data.indiceClasse;
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			montaParametrosClasses(node,dados,false);
			oResponse.argument.fnLoadComplete();
		},
		failure: function(oResponse)
		{
			oResponse.argument.fnLoadComplete();
		},
		argument:
		{
			"node": node,
			"fnLoadComplete": fnLoadComplete
		},
		timeout: 25000
	};
	YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
}
function conteudoNoClasse(codigoMap,codigoLayer,indice,nome){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','classe','"+codigoMap+"','"+codigoLayer+"','"+indice+"')\" title=sobe src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','classe','"+codigoMap+"','"+codigoLayer+"','"+indice+"')\" title=desce src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirClasse('"+codigoMap+"','"+codigoLayer+"','"+indice+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+indice+" "+nome+"</span>";
	var d = {classes:codigoMap+"_"+codigoLayer,html:conteudo,id:codigoMap+"_"+codigoLayer+"_"+indice,codigoMap:codigoMap,codigoLayer:codigoLayer,indiceClasse:indice};
	return d;
}
function montaParametrosClasses(no,dados,redesenha)
{
	var codigoMap = no.data.codigoMap;
	var codigoLayer = no.data.codigoLayer;
	var indiceClasse = no.data.indiceClasse;
	var conteudo = "";
	var tempNode = "";
	var tempNodeR = "";
	if(!tree.getNodeByProperty("etiquetaClasseGeral",no.data.id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorClasseGeral('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\"  ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita caracter&iacute;sticas da classe' src=\"../imagens/06.png\" /> Editar caracter&iacute;sticas gerais</span>";
		var d = {tipo:"etiquetaClasseGeral",etiquetaClasseGeral:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaClasseLabel",no.data.id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorClasseLabel('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita identificadores de texto' src=\"../imagens/06.png\" /> Editar topon&iacute;mia</span>";
		var d = {tipo:"etiquetaClasseLabel",etiquetaClasseLabel:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaEstilo",no.data.id))
	{
		var d = {tipo:"etiquetaEstilo",etiquetaEstilo:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:"<i>Estilos</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;

		conteudo = "<span onclick=\"adicionaNovoEstilo('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\" style=\"cursor:pointer;\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /> Adicionar um novo</span>";
		var d = {tipo:"etiquetaEstilo",etiquetaEstilo:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var d = conteudoNoEstilo(codigoMap,codigoLayer,indiceClasse,dados[i].estilo);
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	tree.draw();
}
/*
Function: adicionaNovaClasse

Adiciona uma nova classe

<CRIARNOVACLASSE>
*/
function adicionaNovaClasse(codigoMap,codigoLayer,indiceClasse)
{
	core_carregando("ativa");
	core_carregando(" adicionando uma nova classe");
	sUrl = "../php/editormapfile.php?funcao=criarNovaClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Erro</span>");
					setTimeout("core_carregando('desativa')",3000);
				}
				else
				{
					var no = tree.getNodeByProperty("etiquetaClasses",codigoMap+"_"+codigoLayer);
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					var d = conteudoNoClasse(codigoMap,codigoLayer,dados[0].indice,"");
					var tempNode = new YAHOO.widget.HTMLNode(d,no, false,true);
					tempNode.setDynamicLoad(loadClasseData, iconMode);
					tempNode.isLeaf = false;
					tempNode.enableHighlight = false;
					tree.draw();
					core_carregando("desativa");
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: classesAuto

Adiciona classes automaticamente

<AUTOCLASSESLAYER>
*/
function classesAuto(codigoMap,codigoLayer)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		var itemExpressao = document.getElementById("itemExpressao").value;
		var itemNome = document.getElementById("itemNome").value;
		if(itemNome == "")
		{itemNome = itemExpressao;}
		if(p_oEvent.newValue.get("value") == "OK" && itemExpressao != "")
		{
			core_carregando("ativa");
			core_carregando(" gerando as classes");
			var sUrl = "../php/editormapfile.php?funcao=autoClassesLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&itemExpressao="+itemExpressao+"&itemNome="+itemNome;
			var callback2 = {
					success:function(o) {
						try {
							var nos = tree.getNodesByProperty("classes",codigoMap+"_"+codigoLayer);
							/*
							var dados = YAHOO.lang.JSON.parse(o.responseText);

							if(nos){
								for (var i=0, j=nos.length; i<j; i++)
								{tree.removeNode(nos[i],false);}
							}
							tree.draw();
							var no = tree.getNodeByProperty("etiquetaClasses",codigoMap+"_"+codigoLayer);
							*/
							nos.refresh();
							//montaParametrosTemas(no,dados);
							core_carregando("desativa");
							YAHOO.admin.container.panelEditorAutoClasses.destroy();
							YAHOO.admin.container.panelEditorAutoClasses = null;
							//core_pegaMapfiles("montaArvore()");
						}
						catch(e){
							core_handleFailure(o,o.responseText);
							core_carregando("desativa");
							YAHOO.admin.container.panelEditorAutoClasses.destroy();
							YAHOO.admin.container.panelEditorAutoClasses = null;
						}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback2);
		}
		else{
			YAHOO.admin.container.panelEditorAutoClasses.destroy();
			YAHOO.admin.container.panelEditorAutoClasses = null;
		}
	};
	if(!YAHOO.admin.container.panelEditorAutoClasses){
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor_auto";
		var ins = '<div class="hd">Editor</div>';
		ins += "<div class='bd' style='height:354px;overflow:auto'>";
		ins += "<div id='okcancel_checkbox'></div><div id='editor_bd'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		var editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id", name:  "okcancel_checkbox_id", container:  "okcancel_checkbox" });
		editorBotoes.addButtons([
			{ label: "Criar classes", value: "OK", checked: false},
			{ label: "Cancela", value: "CANCEL", checked: false }
		]);
		editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
		YAHOO.admin.container.panelEditorAutoClasses = new YAHOO.widget.Panel("janela_editor_auto", { fixedcenter:true,close:true,width:"400px", height:"400px",overflow:"auto", visible:false,constraintoviewport:true } );
		var fecha = function()
		{
			try{
				YAHOO.admin.container.panelEditorAutoClasses.destroy();
				YAHOO.admin.container.panelEditorAutoClasses = null;
			}
			catch(e){}
		};
		YAHOO.util.Event.addListener(YAHOO.admin.container.panelEditorAutoClasses.close, "click", fecha);

		YAHOO.admin.container.panelEditorAutoClasses.render();
		var sUrl = "../php/editormapfile.php?funcao=pegaItensLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		var callback = {
				success:function(o)	{
					try	{
						var itens = core_comboObjeto(YAHOO.lang.JSON.parse(o.responseText).itens,"","","");
						var ins = "<p>Item da tabela de atributos que ser&aacute; utilizado para compor a express&atilde;o de sele&ccedil;&atilde;o de cada classe</p>";
						ins += "<select  id='itemExpressao' >";
						ins += itens;
						ins += "</select></p>";
						ins += "<p>Item da tabela de atributos que ser&aacute; utilizado para compor o nome de cada classe</p>";
						ins += "<select  id='itemNome' >";
						ins += itens;
						ins += "</select></p>";
						$i("editor_bd").innerHTML = ins;
						core_carregando("desativa");
					}
					catch(e){core_handleFailure(o,o.responseText);core_carregando("desativa");}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	}
	YAHOO.admin.container.panelEditorAutoClasses.show();
}
/*
Function: excluirClasse

Exclui uma classe

<EXCLUIRCLASSE>
*/
function excluirClasse(codigoMap,codigoLayer,indiceClasse)
{
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		var mensagem = " excluindo "+indiceClasse;
		core_carregando(mensagem);
		var sUrl = "../php/editormapfile.php?funcao=excluirClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
		var callback =
		{
			success:function(o)
			{
				try
				{
					var no = tree.getNodesByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse);
					tree.removeNode(no[0]);
					tree.draw();
					core_carregando("desativa");
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	var handleNo = function()
	{this.hide();};
	var mensagem = "Exclui a classe?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
function montaEditorClasseGeral(dados)
{
	var temp = function(){
		salvarDadosEditor('classeGeral',dados.codigoMap,dados.codigoLayer,dados.indiceClasse);
	};
	core_montaEditor(temp,"450px","500px","","Classe",true,true,false);

	var re = /C_/g;
	dados.expression = dados.expression.replace(re,"]");
	re = /_C/g;
	dados.expression = dados.expression.replace(re,"[");
	re = /_A_/g;
	dados.expression = dados.expression.replace(re,"'");
	var param = {
		"linhas":[
		{ajuda:"Nome da classe para ser mostrada na legenda",
		titulo:"Name",id:"name",value:dados.name,tipo:"text"},
		{ajuda:"Descri&ccedil;&atilde;o da classe (mostrada na legenda quando o mouse &eacute; sobreposto",
		titulo:"Title",id:"title",value:dados.title,tipo:"text"},
		{ajuda:"Define o estado atual de exibi&ccedil;&atilde;o da classe. Default ativa a camada permanentemente.",
		titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},
		{ajuda:"Quatro tipos de express&otilde;es s&atilde;o suportadas para definir as classes. Compara&ccedil;&atilde;o de strings, express&otilde;es regulares, express&otilde;es l&oacute;gicas simples e fun&ccedil;&otilde;es de string. Se nenhuma express&atilde;o &eacute; fornecida, ent&atilde;o todas as fei&ccedil;&otilde;es pertencem &agrave; classe em quest&atilde;o. Compara&ccedil;&atilde;o de strings s&atilde;o sens&iacute;veis a caracteres e s&atilde;o as mais r&aacute;pidas e se processar. N&atilde;o s&atilde;o necess&aacute;rios delimitadores especiais, mas &eacute; preciso citar entre aspas strings que contenham caracteres especiais. Como boas pr&aacute;ticas, &eacute; recomendado citar todas as strings. Express&otilde;es regulares s&atilde;o delimitadas utilizando barras (/regex/). N&atilde;o devem ser usadas aspas. O atributo a ser usado como compara&ccedil;&atilde;o &eacute; definido no par&acirc;metro CLASSITEM do n&iacute;vel do LAYER. Express&otilde;es l&oacute;gicas te permitem construir testes bastante complexos em um ou mais atributos e portanto s&oacute; s&atilde;o permitas com shapefiles. Express&otilde;es l&oacute;gicas s&atilde;o delimitadas com par&ecirc;nteses &#8220;(express&atilde;o)&#8221;. Nomes de atributos s&atilde;o delimitados por colchetes &#8220;[ATRIBUTO]&#8221;. Estes nomes s&atilde;o sens&iacute;veis a caracteres e devem concordar com os itens no shapefile. Por exemplo: EXPRESSION ([POPULATION] &gt; 50000 AND  [LANGUAGE]  eq  FRENCH ). Os seguintes operadores l&oacute;gicos s&atilde;o suportados: =, &gt;, &lt;, &lt;=, &gt;=, =, or, and, lt, gt, ge, le, eq, ne, in, ~, ~*. Este n&iacute;vel de complexidade &eacute; mais lento a se processar. Existe uma fun&ccedil;&atilde;o de string: lenght(). Ela computa o comprimento de uma string. Exemplo: EXPRESSION (length( [NAME_E] ) &lt; 8). Compara&ccedil;&atilde;o de strings e express&otilde;es regulares trabalham a partir do CLASSITEM definido no n&iacute;vel da LAYER. Voc&ecirc; pode combinar diferentes tipos de express&otilde;es juntamente com diferentes classes de uma camada. ",
		titulo:"Expression",id:"expression",value:dados.expression,tipo:"text"},
		{ajuda:"Nome completo do arquivo de imagem da legenda para a CLASS. Esta imagem &eacute; usada ao construir uma legenda (ou quando requisitando um &iacute;cone de legenda via MapScript ou uma aplica&ccedil;&atilde;o CGI).",
		titulo:"Keyimage",id:"keyimage",value:dados.keyimage,tipo:"text"},
		{ajuda:"Escala m&aacute;xima na qual a CLASS &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		titulo:"Maxscale",id:"maxscale",value:dados.maxscale,tipo:"text"},
		{ajuda:"Escala m&iacute;nima na qual a CLASS &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		titulo:"Minscale",id:"minscale",value:dados.minscale,tipo:"text"}
		]
	};
	var ins = "";
	if(dados.colunas != "")
	{
		ins += "<p>O layer possu&iacute; as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>";
	}
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<select id='status' >";
	temp += core_comboObjeto(objstatus,"valor","texto",dados.status);
	temp += "</select>";
	$i("cStatus").innerHTML = temp;
}

