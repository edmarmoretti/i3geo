function montaNoLayer(codigo,indice){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','layer','"+codigo+"','"+indice+"')\" title="+ $trad("sobe",i3GEOadmin.core.dicionario) +" src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','layer','"+codigo+"','"+indice+"')\" title="+ $trad("desce",i3GEOadmin.core.dicionario) +" src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirLayer('"+codigo+"','"+indice+"')\" title="+ $trad("excluir",i3GEOadmin.core.dicionario) +" width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+indice+"</span>";
	var d = {html:conteudo,id:codigo+"_"+indice,codigoMap:codigo,codigoLayer:indice};
	return d;
}
function loadLayerData(node, fnLoadComplete)
{
	var sUrl = "../php/editormapfile.php?funcao=listaClasses&codigoMap="+node.data.codigoMap+"&codigoLayer="+node.data.codigoLayer;
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			montaParametrosTemas(node,dados,false);
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
/*
Function: montaParametrosTemas

Complementa as op&ccedil;&otilde;es de edi&ccedil;&atilde;o b&aacute;sicas de um LAYER

<LISTAESTILOS>
*/
function montaParametrosTemas(no,dados,redesenha)
{
	var codigoMap = no.data.codigoMap,
		codigoLayer = no.data.codigoLayer,
		id = codigoMap+"_"+codigoLayer,
		conteudo = "",
		tempNodeR = "",
		tempNode = "",
		d;
	if(!tree.getNodeByProperty("etiquetaDados",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorDados('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" />"+ $trad("conexaoLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {tipo:"etiquetaDados",etiquetaDados:id,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(!tree.getNodeByProperty("etiquetaTitulo",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorTitulo('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" />"+ $trad("tituloLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {tipo:"etiquetaTitulo",etiquetaTitulo:id,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaEditavel",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorEditavel('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" />"+ $trad("editavelLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {tipo:"etiquetaEditavel",etiquetaEditavel:id,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaComport",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorComport('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" />"+ $trad("comportamentoLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {tipo:"etiquetaComport",etiquetaComport:id,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}

	if(!tree.getNodeByProperty("etiquetaDispo",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorDispo('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" />"+ $trad("disponibLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {tipo:"etiquetaDispo",etiquetaDispo:id,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
//rever
	if(!tree.getNodeByProperty("etiquetaMetadados",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorMetadados('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita metadados' src=\"../imagens/06.png\" />"+ $trad("miscLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {tipo:"etiquetaMetadados",etiquetaMetadados:id,html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaClasses",id))
	{
		d = {id:id,codigoLayer:codigoLayer,tipo:"etiquetaClasses",etiquetaClasses:id,html:"<i>&nbsp;Classes</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;

		conteudo = "<span style='cursor:pointer;' onclick=\"adicionaNovaClasse('"+codigoMap+"','"+codigoLayer+"')\" ><img  style='position:relative;top:2px' src=\"../imagens/05.png\" />"+ $trad("adicionaClasseLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;

		conteudo = "<span style='cursor:pointer;' onclick=\"classesAuto('"+codigoMap+"','"+codigoLayer+"')\" ><img style='position:relative;top:2px' src=\"../imagens/classificar.gif\" />"+ $trad("criaClassesLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;

		conteudo = "<span style='cursor:pointer;' onclick=\"window.open('../../testamapfile.php?solegenda=sim&map="+no.data.codigoMap+"')\" > <img style='position:relative;top:2px' src=\"../imagens/41.png\" />"+ $trad("testaLayer",i3GEOadmin.editormapfile.dicionario) +"</span>";
		d = {html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;

	}

	for (var i=0, j=dados.length; i<j; i++)
	{
		d = conteudoNoClasse(no.data.codigoMap,codigoLayer,dados[i].indice,dados[i].nome);
		tempNode = new YAHOO.widget.HTMLNode(d,tempNodeR, false,true);
		tempNode.setDynamicLoad(loadClasseData, iconMode);
		tempNode.isLeaf = false;
		tempNode.enableHighlight = false;
	}

	if(!tree.getNodeByProperty("pluginI3geo",id))
	{
		d = {id:id,codigoLayer:codigoLayer,tipo:"pluginI3geo",etiquetaPluginI3geo:id,html:"<i>&nbsp;"+ $trad("pluginLayer",i3GEOadmin.editormapfile.dicionario) +"</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;

		var temp = i3GEO.pluginI3geo.PLUGINS;
		for (var i=0, j=temp.length; i<j; i++){
			if(temp[i].editor === true){
				conteudo = "<span style='cursor:pointer;' onclick=\"pegaPluginLayer('"+temp[i].classe+"','"+codigoMap+"','"+codigoLayer+"')\" ><img style='position:relative;top:2px' src=\"../imagens/classificar.gif\" /> "+temp[i].nome + " - " + temp[i].classe+"</span>";
				d = {html:conteudo};
				tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
				tempNode.isLeaf = true;
				tempNode.enableHighlight = false;
			}
		}
	}
	tree.draw();
}
/**
 * Pega a string de definicao de um plugin no LAYER e monta o formulario
 *
 * @param plugin
 * @param codigoMap
 * @param codigoLayer
 */
function pegaPluginLayer(plugin,codigoMap,codigoLayer){
	core_montaEditor("","450px","500px","","Plugin",true,false,false);
	var sUrl = "../php/editormapfile.php?funcao=pegaPlugin&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	var montaEditorPlugin = function(retorno){
		var ins = "<input type=button title='"+ $trad("salva",i3GEOadmin.core.dicionario) +"' value='"+ $trad("salva",i3GEOadmin.core.dicionario) +"' id=salvarPlugin />"
			+ "<input type=button title='"+ $trad("remove",i3GEOadmin.core.dicionario) +"' value='"+ $trad("remove",i3GEOadmin.core.dicionario) +"' id=removerPlugin />";
		//pega os campos do formulario
		ins += i3GEO.pluginI3geo.formAdmin(plugin,retorno);
		var ajuda = "<p>Mais informa&ccedil;&otilde;es:<br><a href='"+i3GEO.pluginI3geo.linkAjuda(plugin)+"' target=_blank >" + i3GEO.pluginI3geo.linkAjuda(plugin) + "</a></p>";
		$i("editor_bd").innerHTML = ins + ajuda;

		new YAHOO.widget.Button("salvarPlugin",{ onclick: { fn: function(){
			salvarDadosEditorPlugin($i("editor_bd"),plugin,codigoMap,codigoLayer);
		} }});

		new YAHOO.widget.Button("removerPlugin",{ onclick: { fn: function(){
			salvarDadosEditorPlugin($i("editor_bd"),"",codigoMap,codigoLayer);
		} }});
	};
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,montaEditorPlugin);
}
/*
Function: adicionaNovoLayer

Adiciona um novo layer

<CRIARNOVOLAYER>
*/
function adicionaNovoLayer(codigoMap)
{
	core_carregando("ativa");
	core_carregando($trad("msgAdicionaNovoLayer",i3GEOadmin.editormapfile.dicionario));
	sUrl = "../php/editormapfile.php?funcao=criarNovoLayer&codigoMap="+codigoMap;
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
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					var no = tree.getNodeByProperty("etiquetaLayers",codigoMap);
					var tempNode = new YAHOO.widget.HTMLNode(montaNoLayer(codigoMap,dados.layers[0]), no, false,true);
					tempNode.setDynamicLoad(loadLayerData, iconMode);
					tempNode.isLeaf = false;
					tempNode.enableHighlight = false;
					tree.draw();
					//editorGeral(codigoMap,dados.layers[0]);
					editorTitulo(codigoMap,dados.layers[0]);
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
Function: excluirLayer

Exclui um layer

<EXCLUIRLAYER>
*/
function excluirLayer(codigoMap,codigoLayer)
{
	var mensagem = $trad("msgExcluiMap",i3GEOadmin.core.dicionario)+codigoLayer;
	var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer);
	var sUrl = "../php/editormapfile.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_excluiNoTree(sUrl,no,mensagem,codigoLayer);
}
