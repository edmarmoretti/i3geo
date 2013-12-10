/*
Title: editormapfile.js

Fun&ccedil;&otilde;es que controlam a interface do editor de mapfiles (temas)

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/editormapfile.js
*/

contaN = 0;
objcontype = [
	{texto:"MS_INLINE",valor:"0"},
	{texto:"MS_SHAPEFILE",valor:"1"},
	{texto:"MS_TILED_SHAPEFILE",valor:"2"},
	{texto:"MS_SDE",valor:"3"},
	{texto:"MS_OGR",valor:"4"},
	{texto:"MS_TILED_OGR",valor:"5"},
	{texto:"MS_POSTGIS",valor:"6"},
	{texto:"MS_WMS",valor:"7"},
	{texto:"MS_ORACLESPATIAL",valor:"8"},
	{texto:"MS_WFS",valor:"9"},
	{texto:"MS_GRATICULE",valor:"10"},
	{texto:"MS_RASTER",valor:"12"},
	{texto:"MS_PLUGIN",valor:"13"}
];
objbool_tf = [
	{texto:"MS_TRUE",valor:"0"},
	{texto:"MS_FALSE",valor:"1"}
];
objbool_of = [
	{texto:"MS_ON",valor:"2"},
	{texto:"MS_OFF",valor:"3"}
];
objbool_yn = [
	{texto:"MS_YES",valor:"4"},
	{texto:"MS_NO",valor:"5"}
];
objmapunits = [
	{texto:"MS_INCHES",valor:"0"},
	{texto:"MS_FEET",valor:"1"},
	{texto:"MS_MILES",valor:"2"},
	{texto:"MS_METERS",valor:"3"},
	{texto:"MS_KILOMETERS",valor:"4"},
	{texto:"MS_DD",valor:"5"},
	{texto:"MS_PIXELS",valor:"6"}
];
objlayertypes = [
	{texto:"MS_LAYER_POINT",valor:"0"},
	{texto:"MS_LAYER_LINE",valor:"1"},
	{texto:"MS_LAYER_POLYGON",valor:"2"},
	{texto:"MS_LAYER_RASTER",valor:"3"},
	{texto:"MS_LAYER_ANNOTATION",valor:"4"},
	{texto:"MS_LAYER_QUERY",valor:"5"},
	{texto:"MS_LAYER_CIRCLE",valor:"6"},
	{texto:"MS_LAYER_TILEINDEX",valor:"7"},
	{texto:"MS_LAYER_CHART",valor:"8"}
];
objstatus = [
	{texto:"MS_ON",valor:"1"},
	{texto:"MS_OFF",valor:"0"},
	{texto:"MS_DEFAULT",valor:"2"}
];
objfonttypes = [
	{texto:"MS_TRUETYPE",valor:"0"},
	{texto:"MS_BITMAP",valor:"1"}
];
objposition = [
	{texto:"MS_UL",valor:"0"},
	{texto:"MS_LR",valor:"1"},
	{texto:"MS_UR",valor:"2"},
	{texto:"MS_LL",valor:"3"},
	{texto:"MS_CR",valor:"4"},
	{texto:"MS_CL",valor:"5"},
	{texto:"MS_UC",valor:"6"},
	{texto:"MS_WMS",valor:"7"},
	{texto:"MS_LC",valor:"8"},
	{texto:"MS_CC",valor:"9"},
	{texto:"MS_AUTO",valor:"10"},
	{texto:"MS_XY",valor:"11"},
	{texto:"MS_FOLLOW",valor:"12"}
];
objfontstyle = [
	{texto:"MS_TINY",valor:"0"},
	{texto:"MS_SMALL",valor:"1"},
	{texto:"MS_MEDIUM",valor:"2"},
	{texto:"MS_LARGE",valor:"3"},
	{texto:"MS_GIANT",valor:"4"},
];
objshapetype = [
	{texto:"MS_SHAPE_POINT",valor:"0"},
	{texto:"MS_SHAPE_LINE",valor:"1"},
	{texto:"MS_SHAPE_POLYGON",valor:"2"},
	{texto:"MS_SHAPE_NULL",valor:"3"}
];
objshapefiletype = [
	{texto:"MS_SHP_POINT",valor:"0"},
	{texto:"MS_SHP_ARC",valor:"1"},
	{texto:"MS_SHP_POLYGON",valor:"2"},
	{texto:"MS_SHP_MULTIPOINT",valor:"3"}
];
objalignment = [
	{texto:"MS_ALIGN_LEFT",valor:"0"},
	{texto:"MS_ALIGN_CENTER",valor:"1"},
	{texto:"MS_ALIGN_RIGHT",valor:"2"}
];
objtipooriginal = [
	{texto:"poligonal",valor:"poligonal"},
	{texto:"linear",valor:"linear"},
	{texto:"pontual",valor:"pontual"}
];

YAHOO.namespace("admin.container");
/*
Function: initMenu

Inicializa a &aacute;rvore de edi&ccedil;&atilde;o
*/
function initMenu()
{
	if(!letraAtual){
		letraAtual = "";
	}
	ativaBotaoAdicionaMapfile("adiciona");
	ativaBotaoVerificarOrfaos("semmapfiles");
	ativaBotaoUploadGvsig("uploadGvsig");

	core_carregando("ativa");
	core_carregando("buscando temas...");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaMapfiles("montaArvore()",letraAtual);
}
function ativaBotaoVerificarOrfaos(idBotao)
{
	var temp = function(){
		core_montaEditor("","450px","660px","","Verificar");
		verificaOrfaos();
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	new YAHOO.widget.Button(idBotao,{ onclick: { fn: temp } });
}
function ativaBotaoUploadGvsig(idBotao)
{
	var temp = function(){
		var ins = '<form id=i3GEOuploadgvp target="i3GEOuploadgvpiframe" action="../php/uploadgvp.php" method="post" ENCTYPE="multipart/form-data">' +
		'<p class="paragrafo" >Arquivo gvp: <br><input class=digitar type="file" size=20 name="i3GEOuploadgvp" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p class="paragrafo" ><input id=i3GEOuploadgvpbotao1 type="submit" value="Enviar" size=12 name="submit">' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="100000">' +
		'</form>' +
		'<br><iframe name=i3GEOuploadgvpiframe style="text-align:left;border:1px solid gray;" width="98%" height="150px"></iframe>';
		core_montaEditor("","350px","320px","","UploadGvp");
		$i("editor_bd").innerHTML = ins;
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	new YAHOO.widget.Button(idBotao,{ onclick: { fn: temp } });
}
function ativaBotaoAdicionaMapfile(idBotao)
{
	var adiciona = function()
	{
		core_montaEditor("adicionaNovoMapfile()","450px","660px","","","Mapfile");
		ins = "<p><b>Nome do novo arquivo mapfile (sem .map) </b>n&atilde;o utilize caracteres acentuados ou espa&ccedil;os em branco</p>";
		ins += "<input size=50 type=text id='Ecodigo' value='' /></p>";
		ins += "<p><b>Esse mapfile baseia-se no sistema de metadados estat&iacute;sticos?</b> Caso escolha sim, a conex&atilde;o com o banco e o sql de acesso aos dados ser&atilde;o constru&iacute;dos de forma din&acirc;mica</p>";
		ins += "<select id='Emetaestat' >";
		ins += core_combosimnao("nao");
		ins += "</select>";
		ins += "<p><b>T&iacute;tulo do novo tema</b></p>";
		ins += "<p>Em portugu&ecirc;s: </p>";
		ins += "<input size=50 type=text id='Etitulo' value='' /></p>";
		ins += "<p>Espanhol (opcional): </p>";
		ins += "<input size=50 type=text id='EtituloES' value='' /></p>";
		ins += "<p>Ingl&ecirc;s: (opcional)</p>";
		ins += "<input size=50 type=text id='EtituloEN' value='' /></p>";
		ins += "<input size=50 type=hidden id='EtituloIT' value='' /></p>";
		$i("editor_bd").innerHTML = ins;
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
}
/*
Function: montaArvore

Monta a &aacute;rvore

<PEGALAYERS>
*/
function montaArvore()
{
	YAHOO.example.treeExample = new function()
	{
		tree = "";
		function changeIconMode()
		{buildTree();}
		function loadNodeData(node, fnLoadComplete)
		{
			if(node.data.codigoMap == undefined){
				fnLoadComplete.call();
				return;
			}
			var sUrl = "../php/editormapfile.php?funcao=pegaLayers&codigoMap="+node.data.codigoMap;
			var callback =
			{
				success: function(oResponse)
				{
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					montaRaizTema(node,dados);
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
		function buildTree()
		{
			tree = new YAHOO.widget.TreeView("tabela");
			tree.setDynamicLoad(loadNodeData, 0);
			var root = tree.getRoot();
			if(letraAtual == ""){
				var tempNode = new YAHOO.widget.TextNode('Todos', root, false);
				tempNode.isLeaf = true;
			}
			else{
				var tempNode = new YAHOO.widget.TextNode(letraAtual, root, false);
				tempNode.isLeaf = true;
			}
			tempNode.enableHighlight = false;
			core_carregando("desativa");
		}
		buildTree();
	}();
		montaNosRaiz("nao");
		tree.draw();
}
function montaNosRaiz(redesenha)
{
	var root = tree.getRoot();
	var nos = new Array();
	var conteudo = "";
	for (var i=0, j=$mapfiles.length; i<j; i++)
	{
		conteudo = "";
		var iconePlus = true;
		if($mapfiles[i].extensao != "map"){
			iconePlus = false;
			conteudo += "<b>("+$mapfiles[i].extensao+") </b>";
		}
		conteudo += "&nbsp;<img style=\"width:12px;position:relative;cursor:pointer;top:2px\" onclick=\"excluirMapfile('"+$mapfiles[i].codigo+"')\" title=excluir src=\"../imagens/01.png\" />";
		if(iconePlus)
		{conteudo += "&nbsp;<img style=\"width:12px;position:relative;cursor:pointer;top:2px\" onclick=\"clonarMapfile('"+$mapfiles[i].codigo+"')\" title='cria uma cópia' src=\"../imagens/clonar.png\" />";}
		conteudo += "&nbsp;<img style=\"width:12px;position:relative;cursor:pointer;top:2px\" onclick=\"limparCacheMapfile('"+$mapfiles[i].codigo+"')\" title='limpa o chache de imagens se houver' src=\"../imagens/limparcache.png\" />";
		conteudo += "&nbsp;<img style=\"width:12px;position:relative;cursor:pointer;top:2px\" onclick=\"editorTemaMapfile('"+$mapfiles[i].codigo+"')\" title='editar tema associado' src=\"../imagens/03.png\" />";
		if(iconePlus){
			conteudo += "<a style='border:solid white 0px;text-decoration:none;' href='../php/editortexto.php?mapfile="+$mapfiles[i].codigo+"' target=_self >&nbsp;<img title='Editor de textos' style=\"border:0px solid white;width:12px;position:relative;cursor:pointer;top:2px\" src=\"../imagens/06.png\" /></a>";
		}
		//opcao de download se for gvsig
		if($mapfiles[i].extensao === "gvp"){
			conteudo += "&nbsp;<img style=\"width:12px;position:relative;cursor:pointer;top:2px\" onclick=\"downloadGvp('"+$mapfiles[i].codigo+"')\" title='download' src=\"../imagens/down1.gif\" />";
		}
		conteudo += "&nbsp;<img style=\"width:12px;position:relative;cursor:pointer;top:2px\" onclick=\"testarMapfile('"+$mapfiles[i].codigo+"','"+$mapfiles[i].extensao+"')\" title='testar!' src=\"../imagens/41.png\" />";
		conteudo += "&nbsp;<img width=20px style=\"position:relative;cursor:pointer;top:2px\" onclick=\"javascript:window.open('../../ms_criamapa.php?layers="+$mapfiles[i].codigo+"')\" title='abrir no i3Geo' src=\"../../imagens/i3geo2.jpg\" />";
		conteudo += "<b>&nbsp;<span>"+$mapfiles[i].codigo+" <span style=color:gray id='idNome_"+$mapfiles[i].codigo+"'>"+$mapfiles[i].nome+"</span></span>";
		if($mapfiles[i].imagem != "" && $i("mostraMini").checked == true){
			conteudo += "</b><br><img src='../../temas/miniaturas/"+$mapfiles[i].imagem+"'/>";
		}
		var d = {html:conteudo,tipo:"mapfile",id_tema:$mapfiles[i].id_tema,id:$mapfiles[i].codigo,codigoMap:$mapfiles[i].codigo};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,iconePlus);
		tempNode.enableHighlight = false;
		nos.push(tempNode);
	}
	if(redesenha=="sim")
	tree.draw();
	return nos;
}
function testarMapfile(codigoMap,extensao)
{
	window.open("../../testamapfile.php?map="+codigoMap+"."+extensao);
}
/*
Function: montaRaizTema

Monta as op&ccedil;&otilde;es de edi&ccedil;&atilde;o b&aacute;sicas de um LAYER

<LISTACLASSES>
*/
function montaRaizTema(no,dados)
{
	var tempNode = "",tempNodeR = "";
	//no que permite listar os grupos de usuarios registrados para o mapfile
	if(!tree.getNodeByProperty("etiquetaGrupousrTema",no.data.codigoMap))
	{
		var d = {tipo:"etiqueta",etiquetaGrupousrTema:no.data.id_tema,html:"<i>Grupos de usu&aacute;rios que podem utilizar</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, true,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"editorGrupousr('"+no.data.id_tema+"','"+no.data.codigoMap+"')\" ><img style='position:relative;top:2px' src=\"../imagens/05.png\" /><i>Adicionar um novo</i></span>";
		var d = {html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	//adiciona a lista de grupos de usuarios no no
	for (var i=0, j=dados.gruposusr.length; i<j; i++)
	{
		tempNode = new YAHOO.widget.HTMLNode(montaNoGruposUsrTema(dados.gruposusr[i]), tempNodeR, false,true);
		//tempNode.setDynamicLoad(loadLayerData, 0);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	//no que permite listar os layers de um mapfile
	if(!tree.getNodeByProperty("etiquetaLayers",no.data.codigoMap))
	{
		var d = {tipo:"etiqueta",etiquetaLayers:no.data.codigoMap,html:"<i>Layers</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, true,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;

		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"adicionaNovoLayer('"+no.data.codigoMap+"')\" ><img style='position:relative;top:2px' src=\"../imagens/05.png\" /><i>Adicionar um novo</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	//adiciona a lista de layers no no
	for (var i=0, j=dados.layers.length; i<j; i++)
	{
		tempNode = new YAHOO.widget.HTMLNode(montaNoLayer(no.data.codigoMap,dados.layers[i]), tempNodeR, false,true);
		tempNode.setDynamicLoad(loadLayerData, 0);
		tempNode.isLeaf = false;
		tempNode.enableHighlight = false;
	}
	tree.draw();
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
function montaNoGruposUsrTema(dados){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirGrupoUsrTema('"+dados.id_tema+"','"+dados.id_grupo+"','"+dados.codigo_tema+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+dados.nome+"</span>";
	var d = {html:conteudo,id:"usr_"+dados.id_tema+"_"+dados.id_grupo};
	return d;
}
function montaNoLayer(codigo,indice){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','layer','"+codigo+"','"+indice+"')\" title=sobe src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','layer','"+codigo+"','"+indice+"')\" title=desce src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirLayer('"+codigo+"','"+indice+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+indice+"</span>";
	var d = {html:conteudo,id:codigo+"_"+indice,codigoMap:codigo,codigoLayer:indice};
	return d;
}
function iconMode()
{
	var newVal = parseInt(this.value);
	if (newVal != currentIconMode)
	{currentIconMode = newVal;}
}
/*
Function: montaParametrosTemas

Complementa as op&ccedil;&otilde;es de edi&ccedil;&atilde;o b&aacute;sicas de um LAYER

<LISTAESTILOS>
*/
function montaParametrosTemas(no,dados,redesenha)
{
	var codigoMap = no.data.codigoMap;
	var codigoLayer = no.data.codigoLayer;
	var id = codigoMap+"_"+codigoLayer;
	var conteudo = "";
	var tempNodeR = "";
	if(!tree.getNodeByProperty("etiquetaDados",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorDados('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" /> Conex&atilde;o com os dados</span>";
		var d = {tipo:"etiquetaDados",etiquetaDados:id,html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(!tree.getNodeByProperty("etiquetaTitulo",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorTitulo('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" /> T&iacute;tulo, escala, extens&atilde;o</span>";
		var d = {tipo:"etiquetaTitulo",etiquetaTitulo:id,html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaEditavel",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorEditavel('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" /> Edit&aacute;vel (define se o tema &eacute; edit&aacute;vel)</span>";
		var d = {tipo:"etiquetaEditavel",etiquetaEditavel:id,html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaComport",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorComport('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" /> Comportamento no mapa</span>";
		var d = {tipo:"etiquetaComport",etiquetaComport:id,html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}

	if(!tree.getNodeByProperty("etiquetaDispo",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorDispo('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='' src=\"../imagens/06.png\" /> Disponibilidade (download, wms,...)</span>";
		var d = {tipo:"etiquetaDispo",etiquetaDispo:id,html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
//rever
	if(!tree.getNodeByProperty("etiquetaMetadados",id))
	{
		conteudo = "<span style=cursor:pointer; onclick=\"editorMetadados('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita metadados' src=\"../imagens/06.png\" /> Miscel&acirc;nea</span>";
		var d = {tipo:"etiquetaMetadados",etiquetaMetadados:id,html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(!tree.getNodeByProperty("etiquetaClasses",id))
	{
		var d = {id:id,codigoLayer:codigoLayer,tipo:"etiquetaClasses",etiquetaClasses:id,html:"<i>&nbsp;Classes</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;


		conteudo = "<span style='cursor:pointer;' onclick=\"adicionaNovaClasse('"+codigoMap+"','"+codigoLayer+"')\" ><img  style='position:relative;top:2px' src=\"../imagens/05.png\" /> Adicionar uma classe</span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;

		conteudo = "<span style='cursor:pointer;' onclick=\"classesAuto('"+codigoMap+"','"+codigoLayer+"')\" ><img style='position:relative;top:2px' src=\"../imagens/classificar.gif\" /> Criar classes automaticamente</span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;

		conteudo = "<span style='cursor:pointer;' onclick=\"window.open('../../testamapfile.php?solegenda=sim&map="+no.data.codigoMap+"')\" > <img style='position:relative;top:2px' src=\"../imagens/41.png\" /> Testar</span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;

	}

	for (var i=0, j=dados.length; i<j; i++)
	{
		var d = conteudoNoClasse(no.data.codigoMap,codigoLayer,dados[i].indice,dados[i].nome);
		var tempNode = new YAHOO.widget.HTMLNode(d,tempNodeR, false,true);
		tempNode.setDynamicLoad(loadClasseData, iconMode);
		tempNode.isLeaf = false;
		tempNode.enableHighlight = false;
	}

	tree.draw();
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
function conteudoNoEstilo(codigoMap,codigoLayer,indice,estilo){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','estilo','"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title=sobe src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','estilo','"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title=desce src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirEstilo('"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;";
	conteudo += "<img width='10px' heigth='10px' style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editorEstilo('"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title='classes' src=\"../imagens/06.png\" />&nbsp;<span>"+estilo+"</span>";
	var d = {estilos:codigoMap+"_"+codigoLayer+"_"+indice,html:conteudo,id:codigoMap+"_"+codigoLayer+"_"+indice+"_"+estilo,codigoMap:codigoMap,codigoLayer:codigoLayer,indiceClasse:indice,indiceEstilo:estilo};
	return d;
}
function editorDeTexto(codigoMap)
{
	core_carregando("ativa");
	core_carregando("buscando texto...");
	sUrl = "../php/editormapfile.php?funcao=pegaTextoMapfile&codigoMap="+codigoMap;
	var callback =
	{
		success:function(o)
		{
			core_montaEditor("","600px","800px","","Editor");
			var ins = "<input type=button id=salvarTexto value='Salvar' />";
			ins += "<textarea id='editorArea' rows='19' cols='70'>"+YAHOO.lang.JSON.parse(o.responseText)+"</textarea>";
			var temp = function()
			{
				core_carregando("ativa");
				core_carregando("salvando texto...");
				var callback1 =
				{
					success:function(o)
					{
						$i("editorArea").innerHTML = YAHOO.lang.JSON.parse(o.responseText);
						core_carregando("desativa");
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
				};
				var linhas = $i("editorArea").value.split("\n");
				var tempLinhas = "";
				for(var i=0, j=linhas.length; i<j; i++)
				{tempLinhas += linhas[i]+"xxxxxxxx";}
				sUrl = "../php/editormapfile.php?funcao=salvaTextoMapfile&codigoMap="+codigoMap+"&texto="+tempLinhas;
				core_makeRequest(sUrl,callback1,"GET");
			};
			$i("editor_bd").innerHTML = ins;
			new YAHOO.widget.Button("salvarTexto",{ onclick: { fn: temp }});
			core_carregando("desativa");
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: verificaOrfaos

Verifica se existem temas cadastrados no banco de dados e que n&atilde;o possuem mapfile associado.

&Eacute; mostrada ujma lista dos casos e op&ccedil;&atilde;o para apagar o registro do banco ou criar novamente o mapfile

<VERIFICAORFAOS>
*/
function verificaOrfaos()
{
	sUrl = "../php/menutemas.php?funcao=verificaOrfaos";
	core_carregando("ativa");
	core_carregando(" verificando");

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
					core_carregando("desativa");
					var ins = "<p>Os temas listados a seguir n&atilde;o possuem mapfiles criados. Voc&ecirc; pode excluir o registro do tema (remo&ccedil;&atilde;o do banco de dados) clicando na op&ccedil;&atilde;o 'excluir' ou criar o mapfile na op&ccedil;&atilde;o existente no formul&aacute;rio principal.",
						d = YAHOO.lang.JSON.parse(o.responseText),
						n = d.length,
						i,ima;
					for(i=0;i<n;i++){
						ima = '<img src="../imagens/01.png" title="excluir" onclick="excluirOrfao(\''+d[i].codigo_tema+'\')" style="position:relative;cursor:pointer;top:4px;left:-2px">';
						ins += "<p>"+ima+d[i].nome_tema+" <span style=color:gray >"+d[i].codigo_tema+" id: "+d[i].id_tema+"</span>";
					}
					$i("editor_bd").innerHTML = ins;
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
function excluirOrfao(codigo_tema){
	excluirMapfile(codigo_tema);
	YAHOO.admin.container.panelEditor.destroy();
	YAHOO.admin.container.panelEditor = null;
}
/*
Function: adicionaNovoMapfile

Adiciona um novo mapfile

<CRIARNOVOMAP>
*/
function adicionaNovoMapfile()
{
	var nome = $i("Etitulo").value,
		it = $i("EtituloIT").value,
		es = $i("EtituloES").value,
		en = $i("EtituloEN").value,
		codigo = $i("Ecodigo").value,
		metaestat = $i("Emetaestat").value;
	if(codigo === "")
	{alert("Digite o nome do arquivo");return;}
	codigo = codigo.toLowerCase();
	sUrl = "../php/editormapfile.php?funcao=criarNovoMap&nome="+nome+"&codigo="+codigo+"&it="+it+"&en="+en+"&es="+es+"&metaestat="+metaestat;
	core_carregando("ativa");
	core_carregando(" adicionando um novo mapfile");
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Código j&aacute; existe</span>");
					setTimeout("core_carregando('desativa')",3000);
				}
				else
				{
					YAHOO.admin.container.panelEditor.destroy();
					YAHOO.admin.container.panelEditor = null;
					core_pegaMapfiles("montaArvore()");
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
Function: adicionaNovoLayer

Adiciona um novo layer

<CRIARNOVOLAYER>
*/
function adicionaNovoLayer(codigoMap)
{
	core_carregando("ativa");
	core_carregando(" adicionando um novo layer");
	sUrl = "../php/editormapfile.php?funcao=criarNovoLayer&codigoMap="+codigoMap;
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
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					var no = tree.getNodeByProperty("etiquetaLayers",codigoMap);
					var tempNode = new YAHOO.widget.HTMLNode(montaNoLayer(codigoMap,dados.layers[0]), no, false,true);
					tempNode.setDynamicLoad(loadLayerData, iconMode);
					tempNode.isLeaf = false;
					tempNode.enableHighlight = false;
					tree.draw();
					editorGeral(codigoMap,dados.layers[0]);
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
			var callback2 =
			{
					success:function(o)
					{
						try
						{
						var dados = YAHOO.lang.JSON.parse(o.responseText);
						var nos = tree.getNodesByProperty("classes",codigoMap+"_"+codigoLayer);
						if(nos){
							for (var i=0, j=nos.length; i<j; i++)
							{tree.removeNode(nos[i],false);}
						}
						var no = tree.getNodeByProperty("etiquetaClasses",codigoMap+"_"+codigoLayer);
						montaParametrosTemas(no,dados);
							core_carregando("desativa");
						YAHOO.admin.container.panelEditorAutoClasses.destroy();
						YAHOO.admin.container.panelEditorAutoClasses = null;
						}
						catch(e){core_handleFailure(o,o.responseText);core_carregando("desativa");}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback2);
		}
		else
		{
			YAHOO.admin.container.panelEditorAutoClasses.destroy();
			YAHOO.admin.container.panelEditorAutoClasses = null;
		}
	};
	if(!YAHOO.admin.container.panelEditorAutoClasses)
	{
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
		YAHOO.admin.container.panelEditorAutoClasses.render();
		var sUrl = "../php/editormapfile.php?funcao=pegaItensLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		var callback =
		{
				success:function(o)
				{
					try
					{
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
Function: adicionaNovoEstilo

Adiciona um novo estilo

<CRIARNOVOESTILO>
*/
function adicionaNovoEstilo(codigoMap,codigoLayer,indiceClasse)
{
	core_carregando("ativa");
	core_carregando(" adicionando um novo estilo");
	sUrl = "../php/editormapfile.php?funcao=criarNovoEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
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
					var no = tree.getNodeByProperty("etiquetaEstilo",codigoMap+"_"+codigoLayer+"_"+indiceClasse);
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					var d = conteudoNoEstilo(codigoMap,codigoLayer,indiceClasse,dados[0].estilo);
					var tempNode = new YAHOO.widget.HTMLNode(d,no, false,true);
					tempNode.isLeaf = true;
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
Function: limparCacheMapfile

Exclui o cache de imagens referentes ao mapfile

<LIMPARCACHEMAPFILE>
*/
function limparCacheMapfile(codigoMap)
{
	var mensagem = " limpando "+codigoMap;
	var sUrl = "../php/editormapfile.php?funcao=limparCacheMapfile&codigoMap="+codigoMap;
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		core_carregando(mensagem);
		var callback =
		{
				success:function(o)
				{
					try
					{core_carregando("desativa");}
					catch(e){core_handleFailure(o,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	var handleNo = function()
	{this.hide();};
	var mensagem = "Exclui o cache tempor&aacute;rio de renderiza&ccedil;&atilde;o?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
/*
Function: excluirMapfile

Exclui um mapfile

<EXCLUIRMAPFILE>
*/
function excluirMapfile(codigoMap)
{
	var mensagem = " excluindo "+codigoMap;
	var no = tree.getNodeByProperty("id",codigoMap);
	var sUrl = "../php/editormapfile.php?funcao=excluirMapfile&codigoMap="+codigoMap;
	core_excluiNoTree(sUrl,no,mensagem,codigoMap);
}
/*
Function: downloadGvp

Download de arquivo .gvp

<DOWNLOADGVP>
*/
function downloadGvp(codigoMap)
{
	var sUrl = "../php/editormapfile.php?funcao=downloadGvp&codigoMap="+codigoMap;
	window.open(sUrl,"new");
}
/*
Function: clonarMapfile

Exclui um mapfile

<CLONARMAPFILE>
*/
function clonarMapfile(codigoMap)
{
	var sUrl = "../php/editormapfile.php?funcao=clonarMapfile&codigomap="+codigoMap;
	var handleYes = function()
	{
		var novonome = $i("clonarComo").value;
		this.hide();
		if(novonome == "")
		{return;}
		core_carregando("ativa");
		core_carregando("Copiando...");
		var callback =
		{
				success:function(o)
				{
					try
					{
					core_carregando("desativa");
					initMenu();
				}
					catch(e){core_handleFailure(o,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl+"&novomap="+novonome,callback);
	};
	var handleNo = function()
	{this.hide();};
	var mensagem = "Nome do novo arquivo:<br><input type=text value='' id=clonarComo />";
	var largura = "300";
	core_dialogoPergunta(handleYes,handleNo,mensagem,largura);
}
/*
Function: excluirLayer

Exclui um layer

<EXCLUIRLAYER>
*/
function excluirLayer(codigoMap,codigoLayer)
{
	var mensagem = " excluindo "+codigoLayer;
	var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer);
	var sUrl = "../php/editormapfile.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_excluiNoTree(sUrl,no,mensagem,codigoLayer);
}
function excluirGrupoUsrTema(id_tema,id_grupo,codigo_mapa){
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		var mensagem = " excluindo ";
		core_carregando(mensagem);
		var sUrl = "../php/editormapfile.php?funcao=excluirGrupoUsrTema&id_tema="+id_tema+"&id_grupo="+id_grupo;
		var callback =
		{
			success:function(o)
			{
				try
				{
					core_carregando("desativa");
					var no = tree.getNodeByProperty("id",codigo_mapa);
					tree.removeChildren(no) ;
					no.expand();
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
	var mensagem = "Exclui restri&ccedil;&atilde;o?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
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
/*
Function: excluirEstilo

Exclui um estilo

<EXCLUIRESTILO>
*/
function excluirEstilo(codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		var mensagem = " excluindo "+indiceEstilo;
		core_carregando(mensagem);
		var sUrl = "../php/editormapfile.php?funcao=excluirEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
		var callback =
		{
			success:function(o)
			{
				try
				{
					var no = tree.getNodesByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse+"_"+indiceEstilo);
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
	var mensagem = "Exclui o estilo?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
/*
Function: editorDados

Abre o editor de conex&atilde;o com a fonte dos dados de um layer

<PEGACONEXAO>
*/
function editorDados(codigoMap,codigoLayer)
{
	core_montaEditor("","500px","650px","","Conex&atilde;o");
	var sUrl = "../php/editormapfile.php?funcao=pegaConexao&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorDados");
}
/*
Function: editorComport

Abre o editor das op&ccedil;&otilde;es que controlam o comportamento do layer no mapa

<PEGACOMPORT>
*/
function editorComport(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","650px","","Comportamento");
	var sUrl = "../php/editormapfile.php?funcao=pegaComport&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorComport");
}

/*
Function: editorTitulo

Abre o editor de t&iacute;tulo e descri&ccedil;&atilde;o

<PEGACONEXAO>
*/
function editorTitulo(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","650px","","T&iacute;tulo");
	var sUrl = "../php/editormapfile.php?funcao=pegaTitulo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorTitulo");
}
/*
Function: editorDispo

Abre o editor que define a disponibilidade dos dados

<PEGADISPO>
*/
function editorDispo(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","650px","","Disponibilidade");
	var sUrl = "../php/editormapfile.php?funcao=pegaDispo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorDispo");
}
/*
Function: editorEditavel

Abre o editor que define se o tema e editavel ou nao

<PEGAEDITAVEL>
*/
function editorEditavel(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","450px","","Edi&ccedil;&atilde;o");
	var sUrl = "../php/editormapfile.php?funcao=pegaEditavel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorEditavel");
}
//depreciado
function editorConexao(codigoMap,codigoLayer)
{editorDados(codigoMap,codigoLayer);}
/*
Function: editorMetadados

Abre o editor de metadados

<PEGAMETADADOS>
*/
function editorMetadados(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","500px","","Metadados");
	var sUrl = "../php/editormapfile.php?funcao=pegaMetadados&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorMetadados");
}
/*
Function: editorGeral

Abre o editor de dados gerais de um layer

<PEGAGERAL>
*/
function editorGeral(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","500px","","Geral");
	var sUrl = "../php/editormapfile.php?funcao=pegaGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorGeral");
}
function editorGrupousr(id_tema,codigo_mapa)
{
	core_montaEditor("","350px","200px","","Grupo usuario");
	$i("editor_bd").innerHTML = "<input type=hidden value='"+codigo_mapa+"' id='Ecodigo_mapa_usr'/><input type=hidden value='"+id_tema+"' id='Eid_tema_usr'/>";
	var sUrl = "../php/gruposusuarios.php?funcao=pegaGrupos";
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorGrupousr");
}
/*
Function: editorClasseGeral

Abre o editor de dados gerais de uma classe

<PEGAGERAL>
*/
function editorClasseGeral(codigoMap,codigoLayer,indiceClasse)
{
	core_montaEditor("","450px","500px","","Classe");
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorClasseGeral");
}
/*
Function: editorClasseLabel

Abre o editor dos labels de um layer

<PEGACLASSELABEL>
*/
function editorClasseLabel(codigoMap,codigoLayer,indiceClasse)
{
	core_montaEditor("","450px","500px","","Label");
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseLabel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorClasseLabel");
}
/*
Function: editorEstilo

Abre o editor de dados gerais de um estilo

<PEGAESTILO>
*/
function editorEstilo(codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	core_montaEditor("","450px","500px","","Estilo");
	var sUrl = "../php/editormapfile.php?funcao=pegaEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorEstilo");
}
function montaEditorComport(dados)
{
	var param = {
		"linhas":[
			{ajuda:"Sets the current status of the layer. Often modified by MapServer itself. Default turns the layer on permanently",
			titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},
			{ajuda:"Indica se o tema ir&aacute; ser mostrado na ferramenta de identifica&ccedil;&atilde;o",
			titulo:"Identifica (IDENTIFICA)",id:"",value:dados.identifica,tipo:"text",div:"<div id=cIdentifica ></div>"},
			{ajuda:"Define o n&iacute;vel de opacidade (ou a inabilidade de ver atrav&eacute;s da camada) de todos os pixeis classificados para uma dada camada. O valor pode ser um n&uacute;mero inteiro entre 0 e 100 ou o s&iacute;mbolo nomeado  ALPHA . Um valor de 100 &eacute; opaco e 0 &eacute; completamente transparente. O s&iacute;mbolo  ALPHA  direciona o MapServer para honrar a transpar&ecirc;ncia dos s&iacute;mbolos utilizados como pixmap no estilo de uma camada. Isso s&oacute; &eacute; necess&aacute;rio no caso de formatos de sa&iacute;da RGB, e deve ser usado somente quando necess&aacute;rio pois &eacute; dispendioso renderizar s&iacute;mbolos transparentes como pixmap em um mapa de imagem RGB.",
			titulo:"Opacity",id:"opacity",value:dados.opacity,tipo:"text"},
			{ajuda:"Indica se a extens&atilde;o geogr&aacute;fica do mapa deve ser alterada quando o tema for adicionado ao mapa",
			titulo:"Aplica extensao (APLICAEXTENSAO)",id:"",value:dados.aplicaextensao,tipo:"text",div:"<div id=cAplicaextensao ></div>"},
			{ajuda:"Indica se o usu&aacute;rio pode incluir coment&aacute;rios no tema",
			titulo:"Permite comentar (PERMITECOMENTARIO)",id:"",value:dados.permitecomentario,tipo:"text",div:"<div id=cPermitecomentario ></div>"},
			{ajuda:"Temporizador (em segundos) para atualiza&ccedil;&atilde;o autom&aacute;tica da camada. A camada ser&aacute; redesenhada continuamente a cada intervalo de tempo definido",
			titulo:"Temporizador em segundos (METADATA: TEMPORIZADOR)",id:"temporizador",value:dados.temporizador,tipo:"text"},
			{ajuda:"Indica se as classes ser&atilde;o mostradas ou n&atilde;o na legenda. Por padr&atilde;o &eacute; SIM. ",
			titulo:"Classe (CLASSE)",id:"",value:dados.classe,tipo:"text",div:"<div id=cClasse ></div>"},
			{ajuda:"URL de uma imagem que ser&aacute; utilizada em substitui&ccedil;&atilde;o à gera&ccedil;&atilde;o normal da legenda ",
			titulo:"URL da legenda (opcional) (LEGENDAIMG)",id:"legendaimg",value:dados.legendaimg,tipo:"text"},
			{ajuda:"Indica se o tema &eacute; mostrado no mapa mas n&atilde;o nas listas da legenda e na guia 'temas'",
			titulo:"Escondido (ESCONDIDO)",id:"",value:dados.escondido,tipo:"text",div:"<div id=cEscondido ></div>"},
			{ajuda:"Aplica efeitos de transi&ccedil;&atilde;o nas opera&ccedil;&otilde;es de zoom e pan na interface Openlayers",
			titulo:"Efeitos de transi&ccedil;&atilde;o zoom (TRANSITIONEFFECT)",id:"",value:dados.transitioneffect,tipo:"text",div:"<div id=cTransitioneffect ></div>"},
			{ajuda:"Define o padr&atilde;o de cores RGB para tratar como transparente em camadas raster.",
			titulo:"Offsite (R,G,B) (utilize -1,-1,-1 para anular o valor)",id:"offsite",value:dados.offsite,tipo:"text"},
			{ajuda:"Escala m&aacute;xima na qual o LAYER &eacute; desenhado. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Maxscale (utilize -1 para anular o valor)",id:"maxscale",value:dados.maxscale,tipo:"text"},
			{ajuda:"Escala m&iacute;nima na qual o LAYER &eacute; desenhado. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Minscale (utilize -1 para anular o valor)",id:"minscale",value:dados.minscale,tipo:"text"},
			{ajuda:"Nome do item na tabela de atributos para utilizar como etiqueta (label).",
			titulo:"Labelitem",id:"labelitem",value:dados.labelitem,tipo:"text"},
			{ajuda:"Escala m&aacute;xima na qual a LABEL &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Labelmaxscale (utilize -1 para anular o valor)",id:"labelmaxscale",value:dados.labelmaxscale,tipo:"text"},
			{ajuda:"Escala m&iacute;nima na qual a LABEL &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Labelminscale (utilize -1 para anular o valor)",id:"labelminscale",value:dados.labelminscale,tipo:"text"},
			{ajuda:"A escala na qual s&iacute;mbolos e/ou textos aparecem em tamanho total. Isso permite alterar dinamicamente a escala de objetos de acordo com a escala do mapa. Se n&atilde;o for definido, ent&atilde;o o objeto sempre aparecer&aacute; no mesmo tamanho. Essa opera&ccedil;&atilde;o s&oacute; ocorre dentro dos limites de MINSIZE e MAXSIZE como descrito acima. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Symbolscale (utilize -1 para anular o valor)",id:"symbolscale",value:dados.symbolscale,tipo:"text"},
			{ajuda:"Sensibilidade para consultas baseadas em pontos (por exemplo, via mouse e/ou coordenadas do mapa). Dada em TOLERANCEUNITS. Se a camada for um ponto ou uma linha, o padr&atilde;o &eacute; 3. Para todos os outros tipos de camada, o padr&atilde;o &eacute; 0. Para restringir pesquisas por pol&iacute;gonos para que o ponto ocorra dentro do pol&iacute;gono defina a toler&acirc;ncia como 0.",
			titulo:"Tolerance",id:"tolerance",value:dados.tolerance,tipo:"text"},
			{ajuda:" ",
			titulo:"Tolerance units",id:"",value:dados.toleranceunits,tipo:"text",div:"<div id=cToleranceunits ></div>"},
			{ajuda:"Define as unidades de valores do par&acirc;metro SIZE do objeto CLASS (padr&atilde;o &eacute; pixeis). &Uacute;til para simular um buffer.",
			titulo:"Sizeunits",id:"",value:dados.sizeunits,tipo:"text",div:"<div id=cSizeunits ></div>"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cAplicaextensao")){
		temp = "<select id='aplicaextensao' >";
		temp += core_combosimnao(dados.aplicaextensao);
		temp += "</select>";
		$i("cAplicaextensao").innerHTML = temp;
	}
	if($i("cPermitecomentario")){
		temp = "<select id='permitecomentario' >";
		temp += core_combosimnao(dados.permitecomentario);
		temp += "</select>";
		$i("cPermitecomentario").innerHTML = temp;
	}
	if($i("cClasse")){
		temp = "<p><select id='classe' >";
		temp += core_combosimnao(dados.classe);
		temp += "</select>";
		$i("cClasse").innerHTML = temp;
	}
	if($i("cEscondido")){
		temp = "<select id='escondido' >";
		temp += core_combosimnao(dados.escondido);
		temp += "</select>";
		$i("cEscondido").innerHTML = temp;
	}
	if($i("cIdentifica")){
		temp = "<select id='identifica' >";
		temp += core_combosimnao(dados.identifica);
		temp += "</select>";
		$i("cIdentifica").innerHTML = temp;
	}
	if($i("cTransitioneffect")){
		temp = "<select id='transitioneffect' >";
		temp += core_combosimnao(dados.transitioneffect);
		temp += "</select>";
		$i("cTransitioneffect").innerHTML = temp;
	}
	temp = "<select id='status' >";
	temp += core_comboObjeto(objstatus,"valor","texto",dados.status);
	temp += "</select>";
	$i("cStatus").innerHTML = temp;

	temp = "<select id='sizeunits' >";
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.sizeunits);
	temp += "</select>";
	$i("cSizeunits").innerHTML = temp;
	temp = "<select id='toleranceunits' >";
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.toleranceunits);
	temp += "</select>";
	$i("cToleranceunits").innerHTML = temp;

	var temp = function()
	{salvarDadosEditor('comport',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorGrupousr(dados){
	var temp = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	temp += "<p>Escolha o grupo de usu&aacute;rios:</p><select id='Eid_grupousr' >";
	temp += core_comboObjeto(dados,"id_grupo","nome");
	temp += "</select>";
	$i("editor_bd").innerHTML += temp;
	var tempf = function()
	{salvarDadosEditor('grupousr');};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: tempf }});
}
function montaEditorTitulo(dados)
{
	var param = {
		"linhas":[
			{ajuda:"Elemento 'NAME'. N&atilde;o confunda com o nome que aparece no mapa ou  na &aacute;rvore de temas. Normalmente o código recebe o mesmo nome do arquivo mapfile, sem a extens&atilde;o '.map'",
			titulo:"C&oacute;digo do layer",id:"name",value:dados.name,tipo:"text"},
			{ajuda:"Nome do grupo a qual a camada pertence. O nome do grupo pode ser refer&ecirc;ncia como um nome regular de uma camada, permitindo fazer coisas como ligar e desligar um grupo de camadas de uma vez.",
			titulo:"Group",id:"group",value:dados.group,tipo:"text"},
			{ajuda:"Nome que ser&aacute; utilizado na legenda do mapa e na guia 'Temas'",
			titulo:"T&iacute;tulo (METADATA: TEMA)",id:"tema",value:dados.tema,tipo:"text"},
			{ajuda:"Denominador da escala da fonte dos dados utilizado pelo tema. &Eacute; utilizado para apresentar a indica&ccedil;&atilde;o de compatibilidade entre a escala do tema e a escala do mapa que est&aacute; sendo visto.",
			titulo:"Escala (ESCALA)",id:"escala",value:dados.escala,tipo:"text"},
			{ajuda:"Extens&atilde;o geogr&aacute;fica m&aacute;xima do tema, no formato xmin ymin xmax ymax. &Eacute; utilizado na op&ccedil;&atilde;o de 'zoom para o tema'. Quando o tema &eacute; baseado em shapefile, esse metadata n&atilde;o &eacute; necess&aacute;rio, pois o mapserver consegue calcular a extens&atilde;o. J&aacute; em outros tipos de dados, como Postgis, o par&acirc;metro &eacute; necess&aacute;rio. Nesse caso, se n&atilde;o for indicado, o bot&atilde;o de zoom para o tema n&atilde;o ser&aacute; vis&iacute;vel para o usu&aacute;rio",
			titulo:"Extensao (EXTENSAO)",id:"extensao",value:dados.extensao,tipo:"text"},
			{ajuda:"&Iacute;cone que ser&aacute; mostrado na &aacute;rvore de camadas. A imagem deve existir na web e deve ser inclu&iacute;do o caminho completo ou relativo em rela&ccedil;&atilde;o ao local da interface HTML do mapa.",
			titulo:"&Iacute;cone (METADATA: ICONETEMA)",id:"iconetema",value:dados.iconetema,tipo:"text"},
			{ajuda:"Mensagem que ser&aacute; mostrada no rodap&eacute; do mapa quando o tema estiver vis&iacute;vel. &Eacute; &uacute;til para apresentar ao usu&aacute;rio observa&ccedil;&otilde;es especiais sobre o uso daquele tema.",
			titulo:"Mensagem (MENSAGEM)",id:"mensagem",value:dados.mensagem,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	var temp = function()
	{salvarDadosEditor('titulo',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorDispo(dados)
{
	var param = {
		"linhas":[
			{ajuda:"Indica se o usu&aacute;rio pode fazer download do tema. Se sim, o &iacute;cone de download ser&aacute; mostrado na &aacute;rvore de camadas dispon&iacute;veis no mapa.",
			titulo:"Permite download (METADATA: DOWNLOAD)",id:"",value:dados.download,tipo:"text",div:"<div id=cDownload ></div>"},
			{ajuda:"Endere&ccedil;o de um arquivo pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de download. Se n&atilde;o for definido, o arquivo de download &eacute; gerado diretamente do original, convertendo do banco ou copiando o arquivo definido em DATA.",
			titulo:"Arquivo download (ARQUIVODOWNLOAD)",id:"arquivodownload",value:dados.arquivodownload,tipo:"text"},
			{ajuda:"Endere&ccedil;o de um arquivo KMZ ou KML pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de visualiza&ccedil;&atilde;o de KML ou KMZ. Se n&atilde;o for definido, o arquivo &eacute; gerado diretamente do original.",
			titulo:"Arquivo KML ou KMZ (ARQUIVOKMZ)",id:"arquivokmz",value:dados.arquivokmz,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("cDownload")){
		temp = "<select id='download' >";
		temp += core_combosimnao(dados.download);
		temp += "</select>";
		$i("cDownload").innerHTML = temp;
	}
	var temp = function()
	{salvarDadosEditor('dispo',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorEditavel(dados)
{
	var limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png",
		param = {
		"linhas":[
			{ajuda:"Indica se o tema poder&aacute; ser utilizado nos editores vetoriais e de atributos",
			titulo:"O tema pode ser editado? (METADATA: EDITAVEL)",id:"",value:dados.editavel,tipo:"text",div:"<div id=cEditavel ></div>"},
			{ajuda:"Esquema do banco de dados onde est&aacute; a tabela que poder&aacute; ser editada",
			titulo:"Esquema no banco de dados",id:"",value:"",tipo:"text",div:"<div id=cEsquematabelaeditavel ></div>" },
			{ajuda:"Tabela do banco que poder&aacute; ser editada",
			titulo:"Tabela no banco de dados",id:"",value:"",tipo:"text",div:"<div id=cTabelatabelaeditavel ></div>" },
			{ajuda:"Coluna que identifica de forma &uacute;nica cada registro da tabela",
			titulo:"Coluna com IDs &uacute;nicos",id:"",value:"",tipo:"text",div:"<div id=cColunatabelaeditavel ></div>" },
			{ajuda:"Coluna que contem as geometrias da tabela",
			titulo:"Coluna com geometria edit&aacute;vel",id:"",value:"",tipo:"text",div:"<div id=cColunageometriatabelaeditavel ></div>" }
		]
		},
		ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("cEditavel")){
		temp = "<select id='editavel' >";
		temp += core_combosimnao(dados.editavel);
		temp += "</select>";
		$i("cEditavel").innerHTML = temp;
	}
	if($i("cEsquematabelaeditavel")){
		temp = '<input id="esquematabelaeditavel" style="width:90%;" value="'+dados.esquematabelaeditavel+'" />' +
			"<img id='esquematabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cEsquematabelaeditavel").innerHTML = temp;
	}
	$i("esquematabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("esquematabelaeditavel"),"","esquema");
	};
	if($i("cTabelatabelaeditavel")){
		temp = '<input id="tabelaeditavel" style="width:90%;" value="'+dados.tabelaeditavel+'" />' +
			"<img id='tabelatabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cTabelatabelaeditavel").innerHTML = temp;
	}
	$i("tabelatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("tabelaeditavel"),"","tabela");
	};
	if($i("cColunatabelaeditavel")){
		temp = '<input id="colunaidunico" style="width:90%;" value="'+dados.colunaidunico+'" />' +
			"<img id='colunatabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cColunatabelaeditavel").innerHTML = temp;
	}
	$i("colunatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("colunaidunico"),"","coluna");
	};
	if($i("cColunageometriatabelaeditavel")){
		temp = '<input id="colunageometria" style="width:90%;" value="'+dados.colunageometria+'" />' +
			"<img id='colunageometriatabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cColunageometriatabelaeditavel").innerHTML = temp;
	}
	$i("colunageometriatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("colunageometria"),"","coluna");
	};
	var temp = function()
	{salvarDadosEditor('editavel',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorDados(dados)
{
	var idsForms = ["connection","data","tileitem","tileindex","type","tipooriginal","metaestat_id_medida_variavel"],
		idsMetaestat = ["connection","data","tileitem","tileindex","tipooriginal"],
		limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png",
		param = {
			"linhas":[
			{ajuda:"Indica se as defini&ccedil;&otilde;es da camada est&atilde;o relacionadas ao sistema de metadados estat&iacute;sticos. Se estiver, alguns par&acirc;metros s&atilde;o obtidos de forma autom&aacute;tica, como a conex&atilde;o e o SQL de acesso aos dados.",
			titulo:"Esse mapfile est&aacute; integrado ao sistema de metadados estat&iacute;sticos?",id:"",value:dados.metaestat,tipo:"text",div:"<div id=cMetaestat ></div>"},
			{ajuda:"ID da medida da vari&aacute;vel que relaciona a camada ao sistema de metadados estat&iacute;sticos. S&oacute; deve ser definido se o mapfile for integrado a esse sistema.",
			titulo:"ID da vari&aacute;vel no sistema de metadados estat&iacute;sticos ",id:"",value:"",tipo:"text",div:"<div id=cMetaestat_id_medida_variavel ></div>"},
			{ajuda:"Tipo de conex&atilde;o. Padr&atilde;o &eacute; local.",
			titulo:"Connectiontype",id:"",value:"",div:"<div id=cConnectiontype ></div>",tipo:"text"},
			{ajuda:"Aplica a convers&atilde;o de caracteres nas ferramentas que obt&eacute;m os dados descritivos referentes aos elementos do LAYER. Em alguns casos, a convers&atilde;o pode provocar problemas de acentua&ccedil;&atilde;o. Se isso ocorrer, na ferramenta tabela por exemplo, experimente marcar essa op&ccedil;&atilde;o como 'nao'",
			titulo:"Convers&atilde;o de caracteres (METADATA: CONVCARACTER)",id:"",value:dados.convcaracter,tipo:"text",div:"<div id=cConvcaracter ></div>"},
			{ajuda:"Voc&ecirc; pode digitar apenas o 'alias' para esconder a string de conex&atilde;o. Database connection string to retrieve remote data.An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db] . Se vc tiver problemas com acentua&ccedil;&atilde;o, experimente algo como: user=postgres password=postgres dbname=pgutf8 host=localhost port=5432 options='-c client_encoding=LATIN1'",
			titulo:"Connection ",id:"",value:"",tipo:"text",div:"<div id=cConnection ></div>"},
			{ajuda:"Nome completo do arquivo de dado espacial a ser processado. N&atilde;o &eacute; necess&aacute;ria a extens&atilde;o do arquivo para shapefiles. Exemplo: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp. Pode ser especificado relativo &agrave; op&ccedil;&atilde;o SHAPEPATH do objeto MAP. Se for uma camada SDE, deve ser inclu&iacute;do o nome da camada bem como da coluna de geometria, por exemplo, mylayer,shape,myversion. Se &eacute; uma camada PostGIS, o par&acirc;metro deve seguir a forma <columnname> from <tablename>, na qual columnname &eacute; o nome da coluna que cont&eacute;m a geometria e tablename &eacute; o nome da tabela cuja geometria ser&aacute; lida. Exemplo: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291. Para Oracle, use shape FROM table ou shape FROM (SELECT statement) ou at&eacute; express&otilde;es mais complexas. Note que, no entanto, h&aacute; impactos importantes de performance quando utilizadas subconsultas espaciais. Tente utilizar o objeto FILTER sempre que poss&iacute;vel. Voc&ecirc; tamb&eacute;m pode ver o SQL submetido ao for&ccedil;ar um erro, submetendo um par&acirc;metro DATA que voc&ecirc; sabe que n&atilde;o funcionar&aacute;, como uma nome de coluna errado.",
			titulo:"Data",id:"",value:"",tipo:"textarea",div:"<div id=cData ></div>"},
			{ajuda:"Especifica como o dado deve ser desenhado. N&atilde;o precisa ser do mesmo tipo do shapefile. Por exemplo, um shapefile de pol&iacute;gonos pode ser desenhado como pontos, mas um shape de pontos n&atilde;o pode ser desenhado como um pol&iacute;gono. Para diferenciar entre POLYGON e POLYLINE, simplesmente use ou omita o par&acirc;metro COLOR na classifica&ccedil;&atilde;o. Se voc&ecirc; utiliz&aacute;-lo, &eacute; um pol&iacute;gono com uma cor de preenchimento, sen&atilde;o, &eacute; uma polilinha cuja cor &eacute; definida em OUTLINECOLOR. Um c&iacute;rculo (circle) deve ser definido por um ret&acirc;ngulo de limites m&iacute;nimos. Isto &eacute;, dois pontos que definem o menor quadrado que pode cont&ecirc;-lo.",
			titulo:"Type",id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},
			{ajuda:"Ativa ou n&atilde;o a manuten&ccedil;&atilde;o de um cache para armazenar as imagens geradas para montar o mapa. Essa op&ccedil;&atilde;o afeta apenas as interfaces do i3Geo que utilizam o modo TILE (como a interface OpenLayers). O cache &eacute; mantido no diretório tempor&aacute;rio utilizado pelo i3Geo, na pasta chamada cache. Para cada camada &eacute; criada uma sub-pasta. Para limpar o cache, utilize a op&ccedil;&atilde;o existente junto ao nó principal desse mapfile",
			titulo:"Cache de mapas. Camadas WMS s&atilde;o acessadas diretamente do servidor de origem quando o cache estiver inativo. (CACHE)",id:"",value:dados.cache,tipo:"text",div:"<div id=cCache ></div>"},
			{ajuda:"Proje&ccedil;&atilde;o",
			titulo:"Projection",id:"projection",value:dados.projection,tipo:"text"},
			{ajuda:"Este par&acirc;metro permite filtrar atributos espec&iacute;ficos ao mesmo tempo em que &eacute; feita uma filtragem espacial, mas antes de que qualquer express&atilde;o em CLASS seja contabilizada. Para OGR e shapefiles, a string &eacute; simplesmente uma express&atilde;o regular do MapServer. Por exemplo: FILTER type= road  and size &lt;2. Para bancos de dados espaciais &eacute; uma cl&aacute;usula SQL WHERE que &eacute; v&aacute;lida de acordo com o banco de dados subjacente. ",
			titulo:"Filter",id:"filter",value:dados.filter,tipo:"text"},
			{ajuda:"Item a ser usado com simples express&otilde;es FILTER. Somente para OGR e shapefile.",
			titulo:"Filteritem",id:"filteritem",value:dados.filteritem,tipo:"text"},
			{ajuda:"Item que cont&eacute;m a localiza&ccedil;&atilde;o individual de um tile. Padr&atilde;o &eacute;  location .",
			titulo:"tileitem",id:"tileitem",value:dados.tileitem,tipo:"text"},
			{ajuda:"Nome do arquivo ou camada de tileindex. Um tileindex &eacute; semelhante a uma biblioteca de &iacute;ndices do ArcInfo. O tileindex cont&eacute;m fei&ccedil;&otilde;es de pol&iacute;gono para cada tile (ladrilho). O item que cont&eacute;m a localiza&ccedil;&atilde;o do dado ladrilhado &eacute; obtido utilizando o par&acirc;metro TILEITEM. Quando um arquivo &eacute; utilizado como o tileindex para camadas shapefiles ou raster, o tileindex pode ser um shapefile. Para camadas com CONNECTIONTYPE OGR, qualquer fonte de dados OGR suportada pode ser um tileindex. Normalmente a localiza&ccedil;&atilde;o deve conter o caminho do arquivo de tile relativo ao caminho do shape, e n&atilde;o relativo ao pr&oacute;prio tileindex. Se o par&acirc;metro DATA cont&eacute;m algum valor ent&atilde;o ele &eacute; adicionado ao fim da localiza&ccedil;&atilde;o. Quando uma camada de tileindex &eacute; utilizada, ela funciona de forma similar a referir-se diretamente a um arquivo, sendo que qualquer fonte de fei&ccedil;&atilde;o suportada pode ser usada (como PostgreSQL, Oracle etc.).",
			titulo:"tileindex",id:"tileindex",value:dados.tileindex,tipo:"text"},
			{ajuda:"Tipo de representa&ccedil;&atilde;o das fei&ccedil;&otilde;es mostradas da camada. &Eacute; importante definir esse par&acirc;metro para que as fun&ccedil;&otilde;es de gera&ccedil;&atilde;o de SLD funcionem corretamente.",
			titulo:"Tipo de representa&ccedil;&atilde;o (tipooriginal) - para temas do tipo WMS",id:"",value:dados.tipooriginal,tipo:"text",div:"<div id=cTipoOriginal ></div>"}
			]
		};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += "&nbsp;<input type=button title='Testar' value='Testar' id=testarEditor />";

	if(dados.colunas != "" && dados.colunas != undefined){
		ins += "<p>O layer possui as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p><br>";
	}
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cConnection")){
		temp = "";
		if(dados.postgis_mapa.length > 0){
			temp += "<p class=paragrafo >Os seguintes 'alias' est&atilde;o definidos em ms_configura como nomes de conex&otilde;es: ";
			temp += "<b>"+dados.postgis_mapa+"</b>. Para definir um novo, &eacute; necess&aacute;rio editar o arquivo i3geo/ms_configura.php, consulte o administrador do servidor";
			temp += "</p>";
		}
		temp += '<input type="text" value="'+dados.connection+'" id="connection" style="width:90%;">';
		temp += "<img onclick='selConexaoBanco(\"connection\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cConnection").innerHTML = temp;
	}
	if($i("cData")){
		temp = '<textarea value="'+dados.data+'" id="data" style="width:90%;">'+dados.data+'</textarea>';
		temp += "<img onclick='selNavegador(\"data\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cData").innerHTML = temp;
	}
	if($i("cMetaestat_id_medida_variavel")){
		temp = '<input type="text" value="'+dados.metaestat_id_medida_variavel+'" id="metaestat_id_medida_variavel" style="width:90%;">';
		temp += "<img onclick='selIdMedidaVariavel(\"metaestat_id_medida_variavel\",\"metaestat_id_medida_variavel\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cMetaestat_id_medida_variavel").innerHTML = temp;
	}


	if($i("cMetaestat")){
		temp = "<select id='metaestat' >";
		temp += core_combosimnao(dados.metaestat);
		temp += "</select>";
		//temp += "&nbsp;<input type=button value='Par&acirc;metros' id=parametrosMetaestat />";
		$i("cMetaestat").innerHTML = temp;
		//new YAHOO.widget.Button("parametrosMetaestat",{ onclick: { fn: parametrosMetaestat }});
	}
	if($i("cCache")){
		temp = "<select id='cache' >";
		temp += core_combosimnao(dados.cache);
		temp += "</select>";
		$i("cCache").innerHTML = temp;
	}
	if($i("cTipoOriginal")){
		temp = "<select id='tipooriginal' >";
		temp += core_comboObjeto(objtipooriginal,"valor","texto",dados.tipooriginal);
		temp += "</select>";
		$i("cTipoOriginal").innerHTML = temp;
	}

	temp = "<select id='connectiontype' >";
	temp += core_comboObjeto(objcontype,"valor","texto",dados.connectiontype);
	temp += "</select>";
	$i("cConnectiontype").innerHTML = temp;

	temp = "<select id='type' >";
	temp += core_comboObjeto(objlayertypes,"valor","texto",dados.type);
	temp += "</select>";
	$i("cType").innerHTML = temp;

	if($i("cConvcaracter")){
		temp = "<select id='convcaracter' >";
		temp += core_combosimnao(dados.convcaracter);
		temp += "</select>";
		$i("cConvcaracter").innerHTML = temp;
	}

	var temp = function()
	{salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});

	var temp = function()
	{salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,"","",true);};
	new YAHOO.widget.Button("testarEditor",{ onclick: { fn: temp }});

	$i("connectiontype").onchange = function(){
		core_desativaforms(idsForms);
		var valor = $i("connectiontype").value,
			d = [];
		//["connection","data","tileitem","tileindex"]
		if(valor == 0 || valor == 10)
		{d = [];}
		if(valor == 1 || valor == 12)
		{d = ["data","type"];}
		if(valor == 2)
		{d = ["tileitem","tileindex","type"];}
		if(valor == 3 || valor == 4 || valor == 6 || valor == 8 || valor == 13)
		{d = idsForms;}
		if(valor == 5)
		{d = ["connection","tileitem","tileindex","type"];}
		if(valor == 7 || valor == 9)
		{d = ["connection","type","tipooriginal"];}
		core_ativaforms(d);
	};
	$i("metaestat").onchange = function(){
		core_desativaforms(idsMetaestat);
		var valor = $i("metaestat").value,
			d = [];
		if(valor === "SIM"){
			d = ["metaestat_id_medida_variavel"];
		}
		else{
			core_desativaforms(idsForms);
			$i("connectiontype").onchange.call();
		}
		core_ativaforms(d);
	};
	if(dados.metaestat === "SIM"){
		core_desativaforms(idsMetaestat);
	}
	else{
		core_desativaforms(idsForms);
		$i("connectiontype").onchange.call();
	}
}
function selIdMedidaVariavel(idEleValue,idEleCodigoConexao){
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
					valores.push(dados[i].id_medida_variavel);
					textos.push(dados[i].nome_variavel+" - "+dados[i].nomemedida);
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
	core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=LISTAMEDIDAVARIAVEL&formato=json&codigo_variavel=&id_medida_variavel=",callback);
}
function montaEditorMetadados(dados)
{
	var paramRaster = {
		"linhas":[
			{ajuda:"A palete &eacute; v&aacute;lida apenas para temas RASTER. Entre com o endere&ccedil;o do arquivo no servidor. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
			titulo:"Arquivo com palete de cores (opcional e serve apenas para temas raster) (PALLETEFILE)",id:"palletefile",value:dados.palletefile,tipo:"text"},
			{ajuda:"Quantas cores em cada n&iacute;vel da palete. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
			titulo:"Passo (opcional e serve apenas para temas raster) (PALLETESTEP)",id:"palletestep",value:dados.palletestep,tipo:"text"}
		]
	};
	var paramVetor = {
		"linhas":[
			{ajuda:"Indica se o usu&aacute;rio pode abrir o editor de SQL para poder alterar o elemento DATA do Mapfile.",
			titulo:"Permite editar SQL (EDITORSQL)",id:"",value:dados.editorsql,tipo:"text",div:"<div id=cEditorsql ></div>"},
			{ajuda:"Formato das datas existentes na tabela de atributos p.e. iso8601",
			titulo:"Linha do tempo: LTEMPOFORMATODATA",id:"ltempoformatodata",value:dados.ltempoformatodata,tipo:"text"},
			{ajuda:"Item que indica a data de in&iacute;cio de um evento",
			titulo:"Linha do tempo: LTEMPOITEMINICIO",id:"ltempoiteminicio",value:dados.ltempoiteminicio,tipo:"text"},
			{ajuda:"Item que indica a data final de um evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMFIM",id:"ltempoitemfim",value:dados.ltempoitemfim,tipo:"text"},
			{ajuda:"Item que cont&eacute;m o t&iacute;tulo de cada evento",
			titulo:"Linha do tempo: LTEMPOITEMTITULO",id:"ltempoitemtitulo",value:dados.ltempoitemtitulo,tipo:"text"},
			{ajuda:"Item com a descri&ccedil;&atilde;o do evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMDESCRICAO",id:"ltempoitemdescricao",value:dados.ltempoitemdescricao,tipo:"text"},
			{ajuda:"Item para etiquetas do t&iacute;tulo (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMTIP",id:"ltempoitemtip",value:dados.ltempoitemtip,tipo:"text"},
			{ajuda:"Item com o endere&ccedil;o de uma imagem que ser&aacute; inclu&iacute;da no menu popup, aberto quando o usu&aacute;rio clica em um evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMIMAGEM",id:"ltempoitemimagem",value:dados.ltempoitemimagem,tipo:"text"},
			{ajuda:"Link para uma p&aacute;gina que ser&aacute; inclu&iacute;do no menu popup",
			titulo:"Linha do tempo: LTEMPOITEMLINK",id:"ltempoitemlink",value:dados.ltempoitemlink,tipo:"text"},
			{ajuda:"Endere&ccedil;o da imagem do &iacute;cone que ir&aacute; representar o evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMICONE",id:"ltempoitemicone",value:dados.ltempoitemicone,tipo:"text"},
			{ajuda:"Aplica convers&atilde;o do código de caracteres? Pode ser necess&aacute;rio para corrigir problemas de acentua&ccedil;&atilde;o",
			titulo:"Linha do tempo: LTEMPOCONVENCODE",id:"",value:dados.ltempoconvencode,tipo:"text",div:"<div id=cLtempoconvencode ></div>"},
		]
	};
	var paramNaoOWS = {
		"linhas":[
			{ajuda:"&Eacute; poss&iacute;vel a gera&ccedil;&atilde;o de classes automaticamente por meio da defini&ccedil;&atilde;o de colunas na tabela de atributos do tema que armazenam as informa&ccedil;&otilde;es sobre cor, tamanho, etc. Esse metadata &eacute; utilizado para definir qual a coluna da tabela que identifica unicamente cada classe. Para cada valor ser&aacute; criada uma classe.<br>O tema que utiliza a gera&ccedil;&atilde;o de classes de forma autom&aacute;tica, deve ter definido apenas uma classe. Essa classe ser&aacute; utilizada como padr&atilde;o para gera&ccedil;&atilde;o das demais.",
			titulo:"Auto-legenda: id das classes (CLASSESITEM)",id:"classesitem",value:dados.classesitem,tipo:"text"},
			{ajuda:"Nome da coluna que ser&aacute; utilizada para compor o nome das classes geradas automaticamente.",
			titulo:"Auto-legenda: nome das classes (CLASSESNOME)",id:"classesnome",value:dados.classesnome,tipo:"text"},
			{ajuda:"Nome da coluna que definir&aacute; a cor do s&iacute;mbolo utilizado em cada classe. As cores devem ser definidas em RGB.",
			titulo:"Auto-legenda: cor da classe (CLASSESCOR)",id:"classescor",value:dados.classescor,tipo:"text"},
			{ajuda:"Nome da coluna que definir&aacute; o s&iacute;mbolo utilizado em cada classe.",
			titulo:"Auto-legenda: s&iacute;mbolo (CLASSESSIMBOLO)",id:"classessimbolo",value:dados.classessimbolo,tipo:"text"},
			{ajuda:"Nome da coluna que definir&aacute; o tamanho de cada s&iacute;mbolo.",
			titulo:"Auto-legenda: tamanho (CLASSESTAMANHO)",id:"classestamanho",value:dados.classestamanho,tipo:"text"}
		]
	};
	var param = {
		"linhas":[
			{ajuda:"Nome da coluna da tabela de atributos do tema que ser&aacute; utilizado na ferramenta busca r&aacute;pida. Entre apenas uma coluna",
			titulo:"Item utilizado no busca r&aacute;pida (itembuscarapida)",id:"itembuscarapida",value:dados.itembuscarapida,tipo:"text"},
			{ajuda:"Nomes das colunas da tabela de atributos do tema, que ser&atilde;o mostradas na ferramenta de identifica&ccedil;&atilde;o. Se for vazio, todas as colunas ser&atilde;o mostradas. A lista de itens deve ser separada por ',' e grafada em caixa alta no caso de shapefile.",
			titulo:"Itens (ITENS)",id:"itens",value:dados.itens,tipo:"text"},
			{ajuda:"Lista com os 'alias', ou apelidos, para os nomes das colunas listados no metadata 'itens'. Os alias devem ser separados por ',' e seguir a ordem definida em ITENS.",
			titulo:"Nomes dos itens (ITENSDESC)",id:"itensdesc",value:dados.itensdesc,tipo:"text"},
			{ajuda:"Lista de links que ser&atilde;o inclu&iacute;dos em cada resultado de busca da ferramenta de identifica&ccedil;&atilde;o. A lista de links deve ser separada por ',', podendo-se incluir '' para indicar que o item n&atilde;o tem link. Exemplo de uso para inclus&atilde;o de links para o site do IBGE quando um munic&iacute;pio &eacute; clicado no mapa:<br>ITENS 'codigo,nome2,uf'<br>ITENSDESC 'codigo do IBGE,nome do munic&iacute;pio,uf'<br>ITENSLLINK ',http://www.ibge.gov.br/munic2001/tabelas.php?codmun=[codigo]&descricao=[nome],'<br>Podem ser inclu&iacute;dos comandos javascript, para isso utilize sempre aspas simples para fechar o link e acrescente o código javascript, exemplo:<br>ITENSLINK \",'../ferramentas/identifica/testelink.php?sid='+i3GEO.configura.sid\"",
			titulo:"Links dos itens (ITENSLINK)",id:"itenslink",value:dados.itenslink,tipo:"text"},
			{ajuda:"Template utilizado no gerador de KML para definir o conte&uacute;do dos bal&otilde;es de informa&ccedil;&atilde;o. O template utiliza o caractere '%' para iniciar e fechar o nome de uma coluna. O template pode usar tamb&eacute;m elementos HTML, por exemplo: <code>'<b>Nome do municipio</b>: %NOMEMUN%'</code>. Se o template n&atilde;o for especificado, o i3Geo ir&aacute; utilizar o metadata ITENS e ITENSDESC. Se esses n&atilde;o forem especificados, ser&aacute; utilizado o nome original da coluna.",
			titulo:"KML template (DESCRIPTION_TEMPLATE)",id:"description_template",value:dados.description_template,tipo:"text"},
			{ajuda:"Lista de colunas que ser&atilde;o utilizadas na op&ccedil;&atilde;o de inclus&atilde;o de 'etiquetas'. As etiquetas s&atilde;o mostradas no mapa quando o usu&aacute;rio estaciona o mouse por alguns instantes sobre o mapa. Separe a lista com ','.",
			titulo:"Etiqueta (TIP)",id:"tip",value:dados.tip,tipo:"text"}
		]
	};

	var paramOWS = {
		"linhas":[
			{ajuda:"space-delimited list of EPSG projection codes supported by the remote server. You normally get this from the servers capabilities output. This value should be upper case (EPSG:4236.....not epsg:4236) to avoid problems with case sensitive platforms. The value is used to set the SRS WMS URL parameter",
			titulo:"wms_srs",id:"wms_srs",value:dados.wms_srs,tipo:"text"},
			{ajuda:"comma-separated list of layers to be fetched from the remote WMS server. This value is used to set the LAYERS and QUERY_LAYERS WMS URL parameters.",
			titulo:"wms_name",id:"wms_name",value:dados.wms_name,tipo:"text"},
			{ajuda:"the version of the WMS protocol supported by the remote WMS server and that will be used for issuing GetMap requests",
			titulo:"wms_server_version",id:"wms_server_version",value:dados.wms_server_version,tipo:"text"},
			{ajuda:"the image format to use in GetMap requests",
			titulo:"wms_format",id:"wms_format",value:dados.wms_format,tipo:"text"},
			{ajuda:"",
			titulo:"wms_auth_username",id:"wms_auth_username",value:dados.wms_auth_username,tipo:"text"},
			{ajuda:"msEncrypt-style authorization string. Empty strings are also accepted",
			titulo:"wms_auth_password",id:"wms_auth_password",value:dados.wms_auth_password,tipo:"text"},
			{ajuda:"the authorization type to use for a proxy connection. Supported types include: basic, digest, ntlm, any (the underlying http library picks the best among the opotions supported by the remote server), anysafe (the underlying http library picks only safe methods among the options supported by the remote server)",
			titulo:"wms_auth_type",id:"wms_auth_type",value:dados.wms_auth_type,tipo:"text"},
			{ajuda:"the maximum time to wait for a remote WMS layer to load, set in seconds (default is 30 seconds). This metadata can be added at the layer level so that it affects only that layer, or it can be added at the map level (in the web object) so that it affects all of the layers. Note that wms_connectiontimeout at the layer level has priority over the map level.",
			titulo:"wms_connectiontimeout",id:"wms_connectiontimeout",value:dados.wms_connectiontimeout,tipo:"text"},
			{ajuda:"the bounding box of this layer in geographic coordinates in the format lon_min lat_min lon_max lat_max. If it is set then MapServer will request the layer only when the map view overlaps that bounding box. You normally get this from the servers capabilities output.",
			titulo:"wms_latlonboundingbox",id:"wms_latlonboundingbox",value:dados.wms_latlonboundingbox,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_auth_type",id:"wms_proxy_auth_type",value:dados.wms_proxy_auth_type,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_host",id:"wms_proxy_host",value:dados.wms_proxy_host,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_port",id:"wms_proxy_port",value:dados.wms_proxy_port,tipo:"text"},
			{ajuda:"the type of the proxy connection. Valid values are http and socks5, which are case sensitive",
			titulo:"wms_proxy_type",id:"wms_proxy_type",value:dados.wms_proxy_type,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_username",id:"wms_proxy_username",value:dados.wms_proxy_username,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_password",id:"wms_proxy_password",value:dados.wms_proxy_password,tipo:"text"},
			{ajuda:"Can be used to specify an inline SLD document",
			titulo:"wms_sld_body",id:"wms_sld_body",value:dados.wms_sld_body,tipo:"text"},
			{ajuda:"can be used to specify a link to an SLD document",
			titulo:"wms_sld_url",id:"wms_sld_url",value:dados.wms_sld_url,tipo:"text"},
			{ajuda:"name of style to use for the STYLES parameter in GetMap requests for this layer.",
			titulo:"wms_style",id:"wms_style",value:dados.wms_style,tipo:"text"},
			{ajuda:"specifies the color to be used as the background of the map. The general format of BGCOLOR is a hexadecimal encoding of an RGB value where two hexadecimal characters are used for each of Red, Green, and Blue color values. The values can range between 00 and FF for each (0 and 255, base 10). The format is 0xRRGGBB; either upper or lower case characters are allowed for RR, GG, and BB values. The '0x' prefix shall have a lower case 'x'",
			titulo:"wms_bgcolor",id:"wms_bgcolor",value:dados.wms_bgcolor,tipo:"text"},
			{ajuda:"specifies whether the map background is to be made transparent or not. TRANSPARENT can take on two values, 'TRUE' or 'FALSE'. If not specified, MapServer sets default to 'TRUE'",
			titulo:"wms_transparent",id:"wms_transparent",value:dados.wms_transparent,tipo:"text"},
			{ajuda:"value to use for the TIME parameter in GetMap requests for this layer",
			titulo:"wms_time",id:"wms_time",value:dados.wms_time,tipo:"text"},
			{ajuda:"Metadata espec&iacut;fico do i3Geo. Indica se o layer &eacute; do tipo TILECACHE",
			titulo:"&Eacute; do tipo TileCache (0 ou 1 indicam n&atilde;o ou sim) - wms_tile",id:"wms_tile",value:dados.wms_tile,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	if(dados.colunas != "")
	{
		ins += "<p>O layer possu&iacute; as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>";
	}
	ins += core_geraLinhas(param);
	if(dados.type !== 3 && dados.type !== 4)
	{ins += core_geraLinhas(paramVetor);}
	if(dados.connectiontype !== 7 && dados.connectiontype !== 9)
	{ins += core_geraLinhas(paramNaoOWS);}
	if(dados.type === 3)
	{ins += core_geraLinhas(paramRaster);}
	if(dados.connectiontype === 7 || dados.connectiontype === 9)
	{ins += core_geraLinhas(paramOWS);}
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cEditorsql")){
		temp = "<select id='editorsql' >";
		temp += core_combosimnao(dados.editorsql);
		temp += "</select>";
		$i("cEditorsql").innerHTML = temp;
	}
	if($i("cLtempoconvencode")){
		temp = "<select id='ltempoconvencode' >";
		temp += core_combosimnao(dados.ltempoconvencode);
		temp += "</select>";
		$i("cLtempoconvencode").innerHTML = temp;
	}
	var temp = function()
	{salvarDadosEditor('metadados',dados.codigoMap,dados.codigoLayer);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}


function montaEditorClasseGeral(dados)
{
	var re = /C_/g;
	dados.expression = dados.expression.replace(re,"]");
	var re = /_C/g;
	dados.expression = dados.expression.replace(re,"[");
	var re = /_A_/g;
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
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
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

	var temp = function()
	{salvarDadosEditor('classeGeral',dados.codigoMap,dados.codigoLayer,dados.indiceClasse);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorClasseLabel(dados)
{
	var param = {
		"linhas":[
		{ajuda:"Color to draw text with.",
		titulo:"Color",id:"color",value:dados.color,tipo:"cor"},
		{ajuda:"Text size. Use integer to give the size in pixels of your TrueType font based label, or any of theother 5 listed keywords to bitmap fonts.",
		titulo:"Size",id:"size",value:dados.size,tipo:"text"},
		{ajuda:"Position of the label relative to the labeling point (layers only). First letter is Y position, second letter is X position. Auto tells MapServer to calculate a label position that will not interfere with other labels. With points and polygons, MapServer selects from the 8 outer positions (i.e. excluding cc). With lines, it only uses lc or uc, until it finds a position that doesn't collide with labels that have already been drawn. If all positions cause a conflict, then the label is not drawn (Unless the label's FORCE a parameter is set to true). Auto placement is only available with cached labels.",
		titulo:"Position",id:"position",value:dados.position,tipo:"text"},
		{ajuda:"Padding, in pixels, around labels. Useful for maintaining spacing around text to enhance readability. Available only for cached labels. Default is 0.",
		titulo:"Buffer",id:"buffer",value:dados.buffer,tipo:"text"},
		{ajuda:"Font alias (as defined in the FONTSET) to use for labeling",
		titulo:"Font",id:"",value:dados.font,tipo:"text",div:"<div id=cFont ></div>"},
		{ajuda:"Type of font to use. Generally bitmap fonts are faster to draw then TrueType fonts. However,TrueType fonts are scalable and available in a variety of faces. Be sure to set the FONT parameter ifyou select TrueType",
		titulo:"Type",id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},
		{ajuda:"Can text run off the edge of the map? Default is true",
		titulo:"Partials",id:"",value:dados.partials,tipo:"text",div:"<div id=cPartials ></div>"},
		{ajuda:"Forces labels for a particular class on, regardless of collisions. Available only for cached labels. Default is false.",
		titulo:"Force",id:"",value:dados.force,tipo:"text",div:"<div id=cForce ></div>"},
		{ajuda:"Color to draw a background rectangle (i.e. billboard). Off by default.",
		titulo:"Backgroundcolor",id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
		{ajuda:"Color to draw a background rectangle (i.e. billboard) shadow. Off by default.",
		titulo:"Backgroundshadowcolor",id:"backgroundshadowcolor",value:dados.backgroundshadowcolor,tipo:"cor"},
		{ajuda:"Color to draw a one pixel outline around the text.",
		titulo:"Outlinecolor",id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
		{ajuda:"Color of drop shadow.",
		titulo:"Shadowcolor",id:"shadowcolor",value:dados.shadowcolor,tipo:"text"},
		{ajuda:"Shadow offset in pixels.",
		titulo:"Shadowsizex",id:"shadowsizex",value:dados.shadowsizex,tipo:"text"},
		{ajuda:"Shadow offset in pixels.",
		titulo:"Shadowsizey",id:"shadowsizey",value:dados.shadowsizey,tipo:"text"},
		{ajuda:"How far should the background rectangle be offset? Default is 1.",
		titulo:"Backgroundshadowsizex",id:"backgroundshadowsizex",value:dados.backgroundshadowsizex,tipo:"text"},
		{ajuda:"How far should the background rectangle be offset? Default is 1.",
		titulo:"Backgroundshadowsizey",id:"backgroundshadowsizey",value:dados.backgroundshadowsizey,tipo:"text"},
		{ajuda:"Minimum font size to use when scaling text (pixels). Default is 4.",
		titulo:"Minsize",id:"minsize",value:dados.minsize,tipo:"text"},
		{ajuda:"Maximum font size to use when scaling text (pixels). Default is 256.",
		titulo:"Maxsize",id:"maxsize",value:dados.maxsize,tipo:"text"},
		{ajuda:"Offset values for labels, relative to the lower left hand corner of the label and the label point. Given in pixels. In the case of rotated text specify the values as if all labels are horizontal and any rotation will be compensated for.",
		titulo:"Offsetx",id:"offsetx",value:dados.offsetx,tipo:"text"},
		{ajuda:"Offset values for labels, relative to the lower left hand corner of the label and the label point. Given in pixels. In the case of rotated text specify the values as if all labels are horizontal and any rotation will be compensated for.",
		titulo:"Offsety",id:"offsety",value:dados.offsety,tipo:"text"},
		{ajuda:"Angle, given in degrees, to draw the label or AUTO to allow the software to compute the angle, AUTO is valid for LINE layers only. FOLLOW was introduced in version 4.10 and tells map server to compute a curved label for appropriate linear features",
		titulo:"Angle (utilize MS_FOLLOW para textos curvos)",id:"angle",value:dados.angle,tipo:"text"},
		{ajuda:"C&aacute;lculo autom&aacute;tico do &acirc;ngulo quando os elementos forem lineares",
		titulo:"Autoangle",id:"",value:dados.angle,tipo:"text",div:"<div id=cAutoangle ></div>"},
		{ajuda:"Should text be antialiased? Note that this requires more available colors, decreased drawing performance, and results in slightly larger output images.",
		titulo:"Antialias",id:"antialias",value:dados.antialias,tipo:"text"},
		{ajuda:"Character that represents an end-of-line condition in label text, thus resulting in a multi-line label.",
		titulo:"Wrap",id:"wrap",value:dados.wrap,tipo:"text"},
		{ajuda:"Minimum size a feature must be to be labeled. Given in pixels. For line data the overall length of the displayed line is used, for polygons features the smallest dimension of the bounding box is used. Auto keyword tells MapServer to only label features that are larger than their corresponding label. Available for cached labels only.",
		titulo:"Minfeaturesize",id:"minfeaturesize",value:dados.minfeaturesize,tipo:"text"},
		{ajuda:"Minimum distance between duplicate labels. Given in pixels.",
		titulo:"Mindistance",id:"mindistance",value:dados.mindistance,tipo:"text"},
		{ajuda:"Supported encoding format to be used for labels. If the format is not supported, the label will not be drawn. Requires the iconv library (present on most systems). The library is always detected if present on the system, but if not the label will not be drawn. Required for displaying international characters in MapServer. More information can be found at: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html.",
		titulo:"Encoding",id:"encoding",value:dados.encoding,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	if(dados.colunas != "")
	{
		ins += "<p>O layer possu&iacute; as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>";
	}
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<select id='font' >";
	temp += core_comboObjeto(dados.fontes,"","",dados.font);
	temp += "</select>";
	$i("cFont").innerHTML = temp;

	temp = "<select id='type' >";
	temp += core_comboObjeto(objfonttypes,"valor","texto",dados.type);
	temp += "</select>";
	$i("cType").innerHTML = temp;

	temp = "<select id='partials' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.partials);
	temp += "</select>";
	$i("cPartials").innerHTML = temp;

	temp = "<select id='force' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.force);
	temp += "</select>";
	$i("cForce").innerHTML = temp;

	temp = "<select id='autoangle' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.autoangle);
	temp += "</select>";
	$i("cAutoangle").innerHTML = temp;

	var temp = function()
	{salvarDadosEditor('classeLabel',dados.codigoMap,dados.codigoLayer,dados.indiceClasse);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorEstilo(dados)
{
	var limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png";
		param = {
		"linhas":[
			{ajuda:"O s&iacute;mbolo a ser usado para representar as fei&ccedil;&otilde;es. Integer &eacute; o &iacute;ndice do s&iacute;mbolo no symbolset, come&ccedil;ando em 1 (o quinto s&iacute;mbolo &eacute; o s&iacute;mbolo 5). String &eacute; o nome do s&iacute;mbolo (como definido usando o par&acirc;metro SYMBOL NAME). Filename especifica o caminho para um arquivo contendo um s&iacute;mbolo. Por exemplo, um arquivo PNG. Especifique o caminho relativo ao diret&oacute;rio contendo o mapfile. URL especifica o endere&ccedil;o de um arquivo contendo um s&iacute;mbolo pixmap. Por exemplo, um arquivo PNG. Uma URL deve come&ccedil;ar com &#8220;http&#8221;. Exemplo: SYMBOL &#8220;http://myserver.org/path/to/file.png . [ATRIBUTO] permite representa&ccedil;&atilde;o individual de fei&ccedil;&otilde;es usando um atributo no conjunto de dados que especifica o nome do s&iacute;mbolo (como definido usando o par&acirc;metro SYMBOL NAME). S&atilde;o necess&aacute;rios os colchetes []. Se SYMBOL n&atilde;o for especificado, o comportamento depende do tipo de fei&ccedil;&atilde;o: Para pontos, nada ser&aacute; representado; Para linhas, SYMBOL s&oacute; &eacute; relevante se voc&ecirc; quer estilizar as linhas utilizando s&iacute;mbolos, ent&atilde;o a aus&ecirc;ncia de SYMBOL significa que voc&ecirc; ter&aacute; as linhas como especificadas utilizando os par&acirc;metros de representa&ccedil;&atilde;o de linhas (COLOR, WIDTH, PATTERN, LINECAP, etc.); Para pol&iacute;gonos, o interior dos pol&iacute;gonos ser&aacute; representado utilizando um preenchimento s&oacute;lido da cor especificada no par&acirc;metro COLOR.",
			titulo:"Symbolname (pode ser utilizado uma imagem, exemplo: /var/www/i3geo/imagensteste.png) :",id:"",value:dados.symbolname,tipo:"text",div:"<div id=cSymbolname ></div>"},
			{ajuda:"Cor a ser utilizada para desenhar fei&ccedil;&otilde;es.",
			titulo:"Color",id:"color",value:dados.color,tipo:"cor"},
			{ajuda:"Cor de fundo a ser utilizada para desenhar fei&ccedil;&otilde;es.",
			titulo:"Backgroundcolor",id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
			{ajuda:"Tamanho, em SIZEUNITS, do SYMBOL/PATTERN a ser usado. O valor padr&atilde;o depende do tipo do s&iacute;mbolo: para pixmap, o tamanho (em pixeis) do pixmap; para ellipse e vector, o valor m&aacute;ximo de y do par&acirc;metro SYMBOL POINTS; para hatch, 1,0; para truetype, 1,0. Quando a escala de s&iacute;mbolos &eacute; utilizada (SYMBOLSCALEDENOM &eacute; utilizado no n&iacute;vel da LAYER) o SIZE define o tamanho - de acordo com o SIZEUNITS da camada - do SYMBOL /PATTERN a ser usado na escala 1:SYMBOLSCALEDENOM. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia de centro a centro entre as linhas. [ATRIBUTO] especifica um atributo a ser usado para usar como valor de tamanho. Os colchetes [] s&atilde;o necess&aacute;rios.",
			titulo:"Size",id:"size",value:dados.size,tipo:"text"},
			{ajuda:"Cor usada para contornar pol&iacute;gonos e alguns s&iacute;mbolos de marcadores (marker). N&atilde;o possui efeito para linhas. A largura do contorno pode ser especificada usando WIDTH. Se n&atilde;o for especificado nenhum WIDTH, ser&aacute; tra&ccedil;ado um contorno de 1 pixel de largura. Se h&aacute; algum s&iacute;mbolo definido em STYLE, ser&aacute; criado um contorno para este s&iacute;mbolo (somente ellipse, truetype e polygon vector ganhar&atilde;o um contorno). Se n&atilde;o houver s&iacute;mbolo definido em STYLE, o pol&iacute;gono ganhar&aacute; um contorno. [ATRIBUTO] especifica um atributo a ser usado para usar como valor de cor. Os colchetes [] s&atilde;o necess&aacute;rios.",
			titulo:"Outlinecolor",id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
			{ajuda:"WIDTH se refere &agrave; espessura da linha desenhada, em pixeis. Padr&atilde;o &eacute; 1. Quando a escala de s&iacute;mbolos &eacute; utilizada (SYMBOLSCALEDENOM &eacute; utilizado no n&iacute;vel da LAYER) o WIDTH define a espessura da linha - de acordo com o SIZEUNITS da camada &#8211; em rela&ccedil;&atilde;o &agrave; escala 1:SYMBOLSCALEDENOM. Se utilizado com SYMBOL e OUTLINECOLOR, WIDTH define a espessura do contorno dos s&iacute;mbolos. Isto se aplica para os s&iacute;mbolos do tipo  ellipse, truetype e polygon vector. Para linhas, WIDTH especifica a espessura da linha. Para pol&iacute;gonos, se utilizado com OUTLINECOLOR, WIDTH especifica a espessura da linha do pol&iacute;gono. Para um s&iacute;mbolo do tipo hatch, WIDTH especifica a largura das linhas hachuradas. [ATRIBUTO] especifica o atributo a ser usado para valores de WIDTH. Os colchetes [] s&atilde;o necess&aacute;rios.",
			titulo:"Width",id:"width",value:dados.width,tipo:"text"},
			{ajuda:"Tamanho m&iacute;nimo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 0. S&oacute; &eacute; &uacute;til quando usada escala de s&iacute;mbolos. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia entre linhas hachuradas.",
			titulo:"Minsize",id:"minsize",value:dados.minsize,tipo:"text"},
			{ajuda:"Tamanho m&aacute;ximo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 500.",
			titulo:"Maxsize",id:"maxsize",value:dados.maxsize,tipo:"text"},
			{ajuda:"Valor de deslocamento no eixo x para s&iacute;mbolos com sombras, vazios etc.",
			titulo:"Offsetx",id:"offsetx",value:dados.offsetx,tipo:"text"},
			{ajuda:"Valor de deslocamento no eixo y para s&iacute;mbolos com sombras, vazios etc.",
			titulo:"Offsety",id:"offsety",value:dados.offsety,tipo:"text"},
			{ajuda:"Ativa ou desativa o antialias para fontes truetype.",
			titulo:"Antialias",id:"antialias",value:dados.antialias,tipo:"text"},
			{ajuda:"Tamanho m&iacute;nimo em pixeis para desenhar uma linha. Padr&atilde;o &eacute; 0.",
			titulo:"Minwidth",id:"minwidth",value:dados.minwidth,tipo:"text"},
			{ajuda:"Tamanho m&aacute;ximo em pixeis para desenhar uma linha. Padr&atilde;o &eacute; 32.",
			titulo:"Maxwidth",id:"maxwidth",value:dados.maxwidth,tipo:"text"},
			{ajuda:"&Acirc;ngulo, em graus, para rotacionar um s&iacute;mbolo (sentido anti-hor&aacute;rio). Padr&atilde;o &eacute; 0 (sem rota&ccedil;&atilde;o). Para pontos, especifica a rota&ccedil;&atilde;o de um s&iacute;mbolo em rela&ccedil;&atilde;o a seu centro. Para linhas estilizadas, o comportamento depende do valor do elemento GAP. Para valores de GAP negativos, ele especifica o rotacionamento de um s&iacute;mbolo relativo &agrave; dire&ccedil;&atilde;o da linha. Um &acirc;ngulo de 0 significa que o eixo x do s&iacute;mbolo &eacute; orientado juntamente com a dire&ccedil;&atilde;o da linha. Se o valor do GAP for positivo, ele especifica o rotacionamento do s&iacute;mbolo em rela&ccedil;&atilde;o ao seu pr&oacute;prio centro.",
			titulo:"Angle",id:"angle",value:dados.angle,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<input type='text' value='"+dados.symbolname+"' id='symbolname' size='50'>";
	temp += "<img onclick='selNavegador(\"symbolname\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
	temp += "<div id='listaSimbolos' style='overflow:auto;width:350px;height:50px;'></div>";
	$i("cSymbolname").innerHTML = temp;

	var temp = function()
	{salvarDadosEditor('estilo',dados.codigoMap,dados.codigoLayer,dados.indiceClasse,dados.indiceEstilo);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});

	escolheSimbolo = function(nome){
		$i("symbolname").value = nome;
	};
	//lista os simbolos
	var sUrl = "../php/editormapfile.php?funcao=editasimbolo&tipo="+dados.type+"&opcao=listaSimbolos&onclick=escolheSimbolo(this.title)";
	var callback =
	{
			success:function(o)
			{
				try
				{
				var re = new RegExp("ms_tmp", "g");
				var t = o.responseText.replace(re,"../../../ms_tmp/");
				var re = new RegExp("\\\\", "g");
				t = t.replace(re,"");
				$i("listaSimbolos").innerHTML = t;
				}
				catch(e){}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback,'POST');
}

/*
Function: salvarDadosEditor

Altera um mapfile conforme o editor espec&iacute;fico de uma caracter&iacute;stica

<alterarConexao>

<alterarMetadados>

<alterarGeral>

<alterarClasseLabel>

<alterarEstilo>
*/
function salvarDadosEditor(tipo,codigoMap,codigoLayer,indiceClasse,indiceEstilo,testar)
{
	var campos = [], par = "", prog = "", temp, re;
	if(arguments.length < 6){testar = false;}
	if(tipo == "grupousr"){
		campos = [];
		par = "&id_tema="+$i("Eid_tema_usr").value+"&id_grupo="+$i("Eid_grupousr").value;
		prog = "../php/editormapfile.php?funcao=adicionaGrupoUsrTema";
	}
	if(tipo == "comport")
	{
		campos = new Array("aplicaextensao","permitecomentario","temporizador","classe","legendaimg","escondido","identifica","transitioneffect","status","offsite","opacity","maxscale","minscale","labelitem","labelmaxscale","labelminscale","symbolscale","tolerance","toleranceunits","sizeunits");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarComport";
	}
	if(tipo == "dispo")
	{
		campos = new Array("download","arquivodownload","arquivokmz");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarDispo";
	}
	if(tipo == "editavel")
	{
		campos = new Array("editavel","esquematabelaeditavel","tabelaeditavel","colunaidunico","colunageometria");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarEditavel";
	}
	if(tipo == "titulo")
	{
		//
		//valida&ccedil;&atilde;o
		//
		var valorTeste = $i("extensao").value;
		if(valorTeste != ""){
			var teste1 = valorTeste.split(" ");
			if(teste1.length != 4)
			{alert("Sao necessarios 4 valores em extensao");return;}
			if(teste1[0]*1 > teste1[2]*1)
			{alert("xmin maior que xmax em extensao");return;}
			if(teste1[1]*1 > teste1[3]*1)
			{alert("ymin maior que ymax em extensao");return;}
		}
		var valorTeste = $i("escala").value;
		if(valorTeste != ""){
			var teste1 = valorTeste * 1;
			if(teste1 <= 0){}
			{alert("Valor de escala incorreto");return;}
		}

		campos = new Array("name","tema","iconetema","mensagem","escala","extensao","group");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarTitulo";
	}
	if(tipo == "conexao")
	{
		campos = new Array("metaestat_id_medida_variavel","metaestat","cache","projection","type","connection","data","connectiontype","tileitem","tileindex","filteritem","filter","tipooriginal","convcaracter");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarConexao";
	}
	if(tipo == "metadados")
	{
		campos = new Array("wms_tile","legendaimg","wms_srs","wms_name","wms_server_version","wms_format","wms_auth_username","wms_auth_password","wms_auth_type","wms_connectiontimeout","wms_latlonboundingbox","wms_proxy_auth_type","wms_proxy_host","wms_proxy_port","wms_proxy_type","wms_proxy_username","wms_proxy_password","wms_sld_body","wms_sld_url","wms_style","wms_bgcolor","wms_transparent","wms_time","itembuscarapida","ltempoformatodata","ltempoiteminicio","ltempoitemfim","ltempoitemtitulo","ltempoitemdescricao","ltempoitemtip","ltempoitemimagem","ltempoitemicone","ltempoitemlink","editorsql","ltempoconvencode","description_template","palletefile","palletestep","classestamanho","classessimbolo","classescor","classesnome","classesitem","identifica","transitioneffect","extensao","escondido","classe","tip","itenslink","itens","itensdesc");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarMetadados";
	}
	if(tipo == "classeGeral")
	{
		campos = new Array("status","minscale","maxscale","name","title","keyimage");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
		temp = $i("expression").value;
		re = /]/g;
		temp = temp.replace(re,"C_");
		re = "[";
		temp = temp.replace(re,"_C");
		re = /'/g;
		temp = temp.replace(re,"_A_");
		par += "&expression="+temp;
		prog = "../php/editormapfile.php?funcao=alterarClasseGeral";
	}
	if(tipo == "classeLabel")
	{
		campos = new Array("encoding","force","partials","mindistance","minfeaturesize","wrap","antialias","buffer","autoangle","angle","offsety","offsetx","position","maxsize","minsize","size","backgroundshadowsizey","backgroundshadowsizex","shadowsizey","shadowsizex","shadowcolor","outlinecolor","color","backgroundshadowcolor","backgroundcolor","type","font");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
		prog = "../php/editormapfile.php?funcao=alterarClasseLabel"	;
	}
	if(tipo == "estilo")
	{
		campos = new Array("angle","maxwidth","minwidth","width","outlinecolor","backgroundcolor","antialias","offsety","offsetx","maxsize","minsize","size","color","symbolname");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
		prog = "../php/editormapfile.php?funcao=alterarEstilo";
	}
	prog += "&testar="+testar;
	try{
		for (var i=0;i<campos.length;i++){
			if($i(campos[i])){
				var valor = "";
				if($i(campos[i]).disabled === false){
					valor = $i(campos[i]).value;
				}
				par += "&"+campos[i]+"="+ valor;
			}
		}
	}catch(e){alert(e);}
	core_carregando("ativa");
	core_carregando(" gravando o registro do layer= "+codigoLayer);
	var sUrl = prog+par;
	var callback =
	{
			success:function(o)
			{
				try
				{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
					{
						core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel salvar.</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else
					{
						if(testar == false){
							if(tipo=="conexao")
							{montaEditorDados(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="comport")
							{montaEditorComport(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="dispo")
							{montaEditorDispo(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="editavel")
							{montaEditorEditavel(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="titulo")
							{montaEditorTitulo(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="metadados")
							{montaEditorMetadados(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="geral")
							{
								var d = YAHOO.lang.JSON.parse(o.responseText);
								montaEditorGeral(d);
								if(d.name != codigoLayer)
								{
									core_pegaMapfiles("montaArvore()");
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
								}
							}
							if(tipo=="classeGeral")
							{montaEditorClasseGeral(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="classeLabel")
							{montaEditorClasseLabel(YAHOO.lang.JSON.parse(o.responseText));}
							if(tipo=="estilo")
							{montaEditorEstilo(YAHOO.lang.JSON.parse(o.responseText));}

							if(tipo =="grupousr"){
								var no = tree.getNodeByProperty("id",$i("Ecodigo_mapa_usr").value);
								tree.removeChildren(no) ;
								no.expand();
							}
						}
						else{
							window.open("../../testamapfile.php?map="+YAHOO.lang.JSON.parse(o.responseText).url);
						}
						core_carregando("desativa");
					}
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback,'POST');
}
function sobeDesce(movimento,tipo,codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	var movimenta = "", no;
	if(tipo == "layer")
	{
		no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer);
		movimenta = core_movimentaNo(movimento,no);
		indiceClasse = "";
		indiceEstilo = "";
	}
	if(tipo == "classe")
	{
		no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse);
		movimenta = true;
		indiceEstilo = "";
	}
	if(tipo == "estilo")
	{
		no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse+"_"+indiceEstilo);
		movimenta = true;
	}

	var callback =
	{
		success: function(o)
		{
			core_carregando("desativa");
			var no = "";
			if(tipo == "classe")
			{
				no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer);
				tree.removeChildren(no) ;
				no.expand();
			}
			if(tipo == "estilo")
			{
				no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse);
				tree.removeChildren(no);
				no.expand();
			}

		},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	if(movimenta)
	{
		var sUrl = "../php/editormapfile.php?funcao=movimentaNo&tipo="+tipo+"&movimento="+movimento+"&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
		core_carregando("ativa");
		core_carregando(" modificando a ordem");
		core_makeRequest(sUrl,callback);
	}
}
function selConexaoBanco(eleValue){
	var callback = {
			success:function(o){
				try	{
					var dados = YAHOO.lang.JSON.parse(o.responseText),
					n = dados.length,
					i,temp,
					valores = [],
					textos = [],
					selecionados = [],
					funcaoFinal = function(){
						alert("Complete com o valor da senha de acesso em 'password', exemplo: password=postgres");
					};
					for(i=0;i<n;i++){
						temp = "password= user="+dados[i].usuario+" dbname="+dados[i].bancodedados+" host="+dados[i].host+" port="+dados[i].porta;
						textos.push(dados[i].bancodedados);
						valores.push(temp);
					}
					core_menuCheckBox(valores,textos,selecionados,$i(eleValue),"","","sim",funcaoFinal);
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaConexao&formato=json",callback);
}
function selNavegador(onde,tipo){
	if($i("connectiontype")){
		switch(parseInt($i("connectiontype").value,10))
		{
		case 1:
			i3GEO.util.navegadorDir(onde,true,false,false);
			break;
		case 6:
			i3GEO.util.navegadorPostgis(onde);
			break;
		default:
			alert("Opcao disponivel apenas para o tipo shape file");
		}
	}
	else{
		i3GEO.util.navegadorDir(onde,false,false,true);
	}
}

//YAHOO.util.Event.addListener(window, "load", initMenu);