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
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorClasseGeral");
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
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','classe','"+codigoMap+"','"+codigoLayer+"','"+indice+"')\" title="+ $trad("sobe",i3GEOadmin.core.dicionario) +" src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','classe','"+codigoMap+"','"+codigoLayer+"','"+indice+"')\" title="+ $trad("desce",i3GEOadmin.core.dicionario) +" src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirClasse('"+codigoMap+"','"+codigoLayer+"','"+indice+"')\" title="+ $trad("excluir",i3GEOadmin.core.dicionario) +" width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+indice+" "+i3GEO.util.base64decode(nome)+"</span>";
	var d = {type:'html',classes:codigoMap+"_"+codigoLayer,html:conteudo,id:codigoMap+"_"+codigoLayer+"_"+indice,codigoMap:codigoMap,codigoLayer:codigoLayer,indiceClasse:indice};
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
		conteudo = "<span style=cursor:pointer; onclick=\"editorClasseGeral('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\"  ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='"+ $trad("editaCaractClasses",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/06.png\" />"+ $trad("editaCaractGerais",i3GEOadmin.editormapfile.dicionario) +"</span>";
		var d = {tipo:"etiquetaClasseGeral",etiquetaClasseGeral:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaClasseLabel",no.data.id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorClasseLabel('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='"+ $trad("editaIdentTxt",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/06.png\" />"+ $trad("editaToponimia",i3GEOadmin.editormapfile.dicionario) +"</span>";
		var d = {tipo:"etiquetaClasseLabel",etiquetaClasseLabel:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaEstilo",no.data.id))
	{
		var d = {tipo:"etiquetaEstilo",etiquetaEstilo:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:"<i>"+ $trad("estilos",i3GEOadmin.editormapfile.dicionario) +"</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;

		conteudo = "<span onclick=\"adicionaNovoEstilo('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\" style=\"cursor:pointer;\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" />"+ $trad("adicionaNovo",i3GEOadmin.core.dicionario) +"</span>";
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
	core_carregando($trad("msgNovaClasse",i3GEOadmin.editormapfile.dicionario));
	sUrl = "../php/editormapfile.php?funcao=criarNovaClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >"+ $trad("erro",i3GEOadmin.core.dicionario) +"</span>");
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
			core_carregando($trad("msgGeraClasse",i3GEOadmin.editormapfile.dicionario));
			var sUrl = "../php/editormapfile.php?funcao=autoClassesLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&itemExpressao="+itemExpressao+"&itemNome="+itemNome;
			var callback2 = {
					success:function(o) {
						try {
							var n,tempNode,d,i,nos = tree.getNodeByProperty("etiquetaClasses",codigoMap+"_"+codigoLayer);
							if(nos){
								n = nos.children.length;
								for (i=3; i<n; i++){
									tree.removeNode(nos.children[3],true);
								}
							}
							//tree.draw();
							var dados = YAHOO.lang.JSON.parse(o.responseText);
							n = dados.length;
							for (i=0; i < n; i++)	{
								d = conteudoNoClasse(codigoMap,codigoLayer,dados[i].indice,dados[i].nome);
								tempNode = new YAHOO.widget.HTMLNode(d,nos, false,true);
								tempNode.setDynamicLoad(loadClasseData, iconMode);
								tempNode.isLeaf = false;
								tempNode.enableHighlight = false;
							}
							nos.refresh();
							tree.draw();
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
		var ins = '<div class="hd">'+ $trad("editor",i3GEOadmin.core.dicionario) +'</div>';
		ins += "<div class='bd' style='height:354px;overflow:auto'>";
		ins += "<div id='okcancel_checkbox'></div><div id='editor_bd'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		var editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id", name:  "okcancel_checkbox_id", container:  "okcancel_checkbox" });
		editorBotoes.addButtons([
			{ label: $trad("criaClasses",i3GEOadmin.editormapfile.dicionario), value: "OK", checked: false},
			{ label: $trad("cancela",i3GEOadmin.core.dicionario), value: "CANCEL", checked: false }
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
						var ins = "<p>"+ $trad("itemExpressao",i3GEOadmin.editormapfile.dicionario) +"</p>";
						ins += "<select  id='itemExpressao' >";
						ins += itens;
						ins += "</select></p>";
						ins += "<p>"+ $trad("itemNome",i3GEOadmin.editormapfile.dicionario) +"</p>";
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
		var mensagem = $trad("msgExcluiMap",i3GEOadmin.core.dicionario)+indiceClasse;
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
	var mensagem = $trad("excluiClasse",i3GEOadmin.editormapfile.dicionario);
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
function montaEditorClasseGeral(dados)
{
	var temp = function(){
		salvarDadosEditor('classeGeral',dados.codigoMap,dados.codigoLayer,dados.indiceClasse);
	};
	core_montaEditor(temp,"450px","500px","","Classe",true,true,false);

	dados.expression = i3GEO.util.base64decode(dados.expression);
	dados.name = i3GEO.util.base64decode(dados.name);
	dados.title = i3GEO.util.base64decode(dados.title);

	var param = {
		"linhas":[
		{ajuda:$trad("nomeClasse",i3GEOadmin.editormapfile.dicionario),
		titulo:"Name",id:"name",value:dados.name,tipo:"text"},
		{ajuda:$trad("descricaoClasse",i3GEOadmin.editormapfile.dicionario),
		titulo:"Title",id:"title",value:dados.title,tipo:"text"},
		{ajuda:$trad("exibeClasse",i3GEOadmin.editormapfile.dicionario),
		titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},
		{ajuda:$trad("expressaoClasse",i3GEOadmin.editormapfile.dicionario),
		titulo:"Expression",id:"expression",value:dados.expression,tipo:"text"},
		{ajuda:$trad("arquivoLegenda",i3GEOadmin.editormapfile.dicionario),
		titulo:"Keyimage",id:"keyimage",value:dados.keyimage,tipo:"text"},
		{ajuda:$trad("escalaMax",i3GEOadmin.editormapfile.dicionario),
		titulo:"Maxscale",id:"maxscale",value:dados.maxscale,tipo:"text"},
		{ajuda:$trad("escalaMin",i3GEOadmin.editormapfile.dicionario),
		titulo:"Minscale",id:"minscale",value:dados.minscale,tipo:"text"}
		]
	};
	var ins = "";
	if(dados.colunas != "")
	{
		ins += "<p>"+ $trad("atributos",i3GEOadmin.editormapfile.dicionario) +"";
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

