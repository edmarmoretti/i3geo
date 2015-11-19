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
favoritosNode = "";
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
	core_carregando($trad("msgBuscaTemas",i3GEOadmin.core.dicionario));
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaMapfiles("montaArvore()",letraAtual);
}
function ativaBotaoVerificarOrfaos(idBotao)
{
	var botao, temp = function(){
		core_montaEditor("","450px","660px","","Verificar");
		verificaOrfaos();
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	botao = new YAHOO.widget.Button(idBotao,{ onclick: { fn: temp } });
	botao.addClass("rodar");
}
function ativaBotaoUploadGvsig(idBotao)
{
	var botao,temp = function(){
		var ins = '<form id=i3GEOuploadgvp target="i3GEOuploadgvpiframe" action="../php/uploadgvp.php" method="post" ENCTYPE="multipart/form-data">' +
		'<p class="paragrafo" >'+ $trad("gvp",i3GEOadmin.editormapfile.dicionario) +'<br><input type="file" size=20 name="i3GEOuploadgvp" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p class="paragrafo" ><input id=i3GEOuploadgvpbotao1 type="submit" value='+ $trad("enviar",i3GEOadmin.core.dicionario) +' size=12 name="submit">' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="100000">' +
		'</form>' +
		'<br><iframe name=i3GEOuploadgvpiframe style="text-align:left;border:1px solid gray;" width="98%" height="150px"></iframe>';
		core_montaEditor("","350px","320px","","UploadGvp");
		$i("editor_bd").innerHTML = ins;
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	botao = new YAHOO.widget.Button(idBotao,{ onclick: { fn: temp } });
	botao.addClass("rodar");
}
function ativaBotaoAdicionaMapfile(idBotao)
{
	var botao, adiciona = function()
	{
		core_montaEditor("adicionaNovoMapfile()","450px","660px","","Mapfile",true,true,false);
		ins = "<p><b>"+ $trad("nomeMap",i3GEOadmin.editormapfile.dicionario) +"</p>";
		ins += "<input size=50 type=text id='Ecodigo' value='' /></p>";
		ins += "<p><input type=checkbox id=Eacessopublico checked style=position:relative;top:2px; />";
		ins += ""+ $trad("permiteOgc",i3GEOadmin.editormapfile.dicionario) +"</p>";

		ins += "<p><b>"+ $trad("metaestat",i3GEOadmin.editormapfile.dicionario) +"</p>";
		ins += "<select id='Emetaestat' >";
		ins += core_combosimnao("nao");
		ins += "</select>";
		ins += "<p><b>"+ $trad("tituloTema",i3GEOadmin.editormapfile.dicionario) +"</b></p>";
		ins += "<p>"+ $trad("tituloPt",i3GEOadmin.editormapfile.dicionario) +"</p>";
		ins += "<input size=50 type=text id='Etitulo' value='' /></p>";
		ins += "<p>"+ $trad("tituloEs",i3GEOadmin.editormapfile.dicionario) +"</p>";
		ins += "<input size=50 type=text id='EtituloES' value='' /></p>";
		ins += "<p>"+ $trad("tituloEn",i3GEOadmin.editormapfile.dicionario) +"</p>";
		ins += "<input size=50 type=text id='EtituloEN' value='' /></p>";
		ins += "<input size=50 type=hidden id='EtituloIT' value='' /></p>";
		$i("editor_bd").innerHTML = ins;
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	botao = new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
	botao.addClass("rodar");
}
/*
Function: montaArvore

Monta a &aacute;rvore

<PEGALAYERS>
*/
function montaArvore(){
	YAHOO.example.treeExample = new function(){
		tree = "";
		function changeIconMode(){
			buildTree();
		}
		function loadNodeData(node, fnLoadComplete){
			if(node.data.codigoMap == undefined){
				fnLoadComplete.call();
				return;
			}
			var sUrl = "../php/editormapfile.php?funcao=pegaLayers&codigoMap="+node.data.codigoMap;
			var callback = {
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					montaRaizTema(node,dados);
					oResponse.argument.fnLoadComplete();
				},
				failure: function(oResponse){
					oResponse.argument.fnLoadComplete();
				},
				argument: {
					"node": node,
					"fnLoadComplete": fnLoadComplete
				},
				timeout: 25000
			};
			YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
		}
		function buildTree(){
			tree = new YAHOO.widget.TreeView("tabela");
			tree.setDynamicLoad(loadNodeData, 0);
			var root = tree.getRoot();
			favoritosNode = new YAHOO.widget.TextNode('Favoritos', root, true);
			favoritosNode.isLeaf = false;
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
	montaFavoritos();
	montaNosRaiz("nao");
	tree.draw();
}
favoritosArray = [];
retornaFavoritosArray();
function retornaFavoritosArray(){
	var temp = i3GEO.util.pegaCookie("I3GEOfavoritosEditorMapfile");
	if(temp){
		favoritosArray = temp.split(",");
	}
	else{
		favoritosArray = [];
	}
	return favoritosArray;
}
function registraFavoritos(codigoTema){
	favoritosArray.remove(codigoTema);
	favoritosArray.push(codigoTema);
	i3GEO.util.insereCookie("I3GEOfavoritosEditorMapfile", favoritosArray.toString(","));
	montaFavoritos();
	tree.draw();
}
function removeFavoritos(codigoTema,redesenha){
	var temp = tree.getNodeByProperty("id",codigoTema+"favorito");
	if(temp){
		tree.removeNode(temp);
	}
	favoritosArray.remove(codigoTema);
	i3GEO.util.insereCookie("I3GEOfavoritosEditorMapfile", favoritosArray.toString(","));
	if(redesenha){
		tree.draw();
	}
}
function montaFavoritos(){
	var mapfile, i, j, conteudo, iconePlus, d, tempNode;
	for (i=0, j=$mapfiles.length; i<j; i++){
		mapfile = $mapfiles[i];
		if(!tree.getNodeByProperty("id",mapfile.codigo+"favorito")){
			if(i3GEO.util.in_array(mapfile.codigo,favoritosArray)){
				iconePlus = true;
				if(mapfile.extensao != "map"){
					iconePlus = false;
				}
				conteudo = montaTextoTemaMapfile(mapfile);
				d = {html:conteudo,tipo:"favorito",id_tema:mapfile.id_tema,id:mapfile.codigo+"favorito",codigoMap:mapfile.codigo};
				tempNode = new YAHOO.widget.HTMLNode(d, favoritosNode, false, iconePlus);
				tempNode.isLeaf = true;
				tempNode.enableHighlight = false;
			}
		}
	}
}
function montaTextoTemaMapfile(mapfile){
	var conteudo = "", i, iconePlus = true;
	if(mapfile.extensao != "map"){
		iconePlus = false;
		conteudo += "<b>("+mapfile.extensao+") </b>";
	}

	i = "margin-left:2px;width:13px;position:relative;cursor:pointer;top:2px";
	conteudo += "&nbsp;<img style="+i+" onclick=\"excluirMapfile('"+mapfile.codigo+"')\" title="+ $trad("excluir",i3GEOadmin.core.dicionario) +" src=\"../imagens/01.png\" />";
	conteudo += "&nbsp;<img style="+i+" onclick=\"filtraLetra('"+mapfile.codigo+"')\" title='"+ $trad("filtraLista",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/view-filter.png\" />";
	if(i3GEO.util.in_array(mapfile.codigo,favoritosArray)){
		conteudo += "&nbsp;<img style="+i+" onclick=\"removeFavoritos('"+mapfile.codigo+"',true)\" title='"+ $trad("retiraFavoritos",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/bookmarks.png\" />";
	}
	else{
		conteudo += "&nbsp;<img style="+i+" onclick=\"registraFavoritos('"+mapfile.codigo+"')\" title='"+ $trad("favorito",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/bookmarks.png\" />";
	}
	if(iconePlus){
		conteudo += "&nbsp;<img style="+i+" onclick=\"clonarMapfile('"+mapfile.codigo+"')\" title='"+ $trad("criaCopia",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/clonar.png\" />";
	}
	conteudo += "&nbsp;<img style="+i+" onclick=\"limparCacheMapfile('"+mapfile.codigo+"')\" title='"+ $trad("limpaCache",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/limparcache.png\" />";
	conteudo += "&nbsp;<img style="+i+" onclick=\"editorTemaMapfile('"+mapfile.codigo+"')\" title='"+ $trad("editaTema",i3GEOadmin.editormapfile.dicionario) +"' src=\"../imagens/text-frame-link.png\" />";
	if(iconePlus){
		conteudo += "<a style='margin-left:2px;border:solid white 0px;text-decoration:none;' href='../php/editortexto.php?mapfile="+mapfile.codigo+"' target=_self >&nbsp;<img title='"+ $trad("editorTxt",i3GEOadmin.core.dicionario) +"' style=\"border:0px solid white;width:12px;position:relative;cursor:pointer;top:2px\" src=\"../imagens/document-edit.png\" /></a>";
	}
	//opcao de download se for gvsig
	if(mapfile.extensao === "gvp"){
		conteudo += "&nbsp;<img style="+i+" onclick=\"downloadGvp('"+mapfile.codigo+"')\" title='download' src=\"../imagens/down1.gif\" />";
	}
	if(mapfile.extensao === "map" || mapfile.extensao === "gvp"){
		conteudo += "&nbsp;<img style="+i+" onclick=\"testarMapfile('"+mapfile.codigo+"','"+mapfile.extensao+"')\" title='"+ $trad("testar",i3GEOadmin.core.dicionario) +"' src=\"../imagens/41.png\" />";
		conteudo += "&nbsp;<img style="+i+" onclick=\"testarMapfileRapido('"+mapfile.codigo+"','"+mapfile.extensao+"')\" title='"+ $trad("testarRapido",i3GEOadmin.core.dicionario) +"' src=\"../imagens/41r.png\" />";
	}
	conteudo += "&nbsp;<img style="+i+";width:20px; onclick=\"javascript:window.open('../../interface/black_editor.php?&temaEdicao="+mapfile.codigo+"')\" title='"+ $trad("editarI3geo",i3GEOadmin.core.dicionario) +"' src=\"../imagens/i3geo2editor.jpg\" />";
	conteudo += "&nbsp;<img style="+i+";width:20px; onclick=\"javascript:window.open('../../ms_criamapa.php?temasa="+mapfile.codigo+"&layers="+mapfile.codigo+"')\" title='"+ $trad("testarI3geo",i3GEOadmin.core.dicionario) +"' src=\"../imagens/i3geo2.jpg\" />";
	conteudo += "<b>&nbsp;"+mapfile.codigo+"</b>&nbsp;<span class=iconeEditar title='"+$trad("editarNome",i3GEOadmin.core.dicionario)+"' onclick='alteraNomeTema(this,\""+mapfile.codigo+"\")' style=cursor:pointer;color:gray id='idNome_"+mapfile.codigo+"'>"+mapfile.nome+"</span>";
	conteudo += "<br><img src=''style='display:none;' id='testeRapido"+mapfile.codigo+"' />";
	if(mapfile.imagem != "" && $i("mostraMini").checked == true){
		conteudo += "</b><br><img src='../../temas/miniaturas/"+mapfile.imagem+"'/>";
	}
	return conteudo;
}
function montaNosRaiz(redesenha){
	var root = tree.getRoot(), nos = new Array(), conteudo = "", iconePlus = true;
	for (var i=0, j=$mapfiles.length; i<j; i++)
	{
		iconePlus = true;
		if($mapfiles[i].extensao != "map"){
			iconePlus = false;
		}
		conteudo = montaTextoTemaMapfile($mapfiles[i]);
		var d = {html:conteudo,tipo:"mapfile",id_tema:$mapfiles[i].id_tema,id:$mapfiles[i].codigo,codigoMap:$mapfiles[i].codigo};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,iconePlus);
		tempNode.enableHighlight = false;
		nos.push(tempNode);
	}
	if(redesenha=="sim"){
		tree.draw();
	}
	return nos;
}
function testarMapfileRapido(codigoMap,extensao)
{
	if($i("testeRapido"+codigoMap).style.display === "block"){
		$i("testeRapido"+codigoMap).style.display = "none";
		return;
	}
	$i("testeRapido"+codigoMap).src = "../../testamapfile.php?cache=nao&tipo=grande&map="+codigoMap+".map";
	$i("testeRapido"+codigoMap).style.display = "block";
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
		var d = {tipo:"etiqueta",etiquetaGrupousrTema:no.data.id_tema,html:"<i>"+ $trad("gruposUsuarios",i3GEOadmin.editormapfile.dicionario) +"</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, true,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"editorGrupousr('"+no.data.id_tema+"','"+no.data.codigoMap+"')\" ><img style='position:relative;top:2px' src=\"../imagens/05.png\" /><i>"+ $trad("adicionaNovo",i3GEOadmin.core.dicionario) +"</i></span>";
		var d = {html:conteudo};
		tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, true,true);
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
		var d = {tipo:"etiqueta",etiquetaLayers:no.data.codigoMap,html:"<i>"+ $trad("layers",i3GEOadmin.core.dicionario) +"</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, true,true);
		tempNodeR.isLeaf = false;
		tempNodeR.enableHighlight = false;

		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"adicionaNovoLayer('"+no.data.codigoMap+"')\" ><img style='position:relative;top:2px' src=\"../imagens/05.png\" /><i>"+ $trad("adicionaNovo",i3GEOadmin.core.dicionario) +"</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	//adiciona a lista de layers no no
	for (var i=0, j=dados.layers.length; i<j; i++)
	{
		tempNode = new YAHOO.widget.HTMLNode(montaNoLayer(no.data.codigoMap,dados.layers[i]), tempNodeR, true,true);
		tempNode.setDynamicLoad(loadLayerData, 0);
		tempNode.isLeaf = false;
		tempNode.enableHighlight = false;
	}
	tree.draw();
}
function iconMode()
{
	var newVal = parseInt(this.value);
	if (newVal != currentIconMode)
	{currentIconMode = newVal;}
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
	core_carregando($trad("msgVerifica",i3GEOadmin.core.dicionario));

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
					core_carregando("desativa");
					var ins = "<p>"+ $trad("semMap",i3GEOadmin.editormapfile.dicionario) +"",
						d = YAHOO.lang.JSON.parse(o.responseText),
						n = d.length,
						i,ima;
					for(i=0;i<n;i++){
						ima = '<img src="../imagens/01.png" title='+ $trad("excluir",i3GEOadmin.core.dicionario) +' onclick="excluirOrfao(\''+d[i].codigo_tema+'\')" style="position:relative;cursor:pointer;top:4px;left:-2px">';
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
		acessopublico = "SIM";
	if($i("Eacessopublico").checked === false){
		acessopublico = "NAO";
	}
	if(codigo === ""){
		alert($trad("digitaNome",i3GEOadmin.editormapfile.dicionario));return;
	}
	codigo = codigo.toLowerCase();
	codigo = i3GEO.util.removeAcentos(codigo);
	codigo = codigo.replace(" ","");
	sUrl = "../php/editormapfile.php?funcao=criarNovoMap&nome="+nome+"&codigo="+codigo+"&it="+it+"&en="+en+"&es="+es+"&metaestat="+metaestat+"&acessopublico="+acessopublico;
	core_carregando("ativa");
	core_carregando($trad("adicionaMap",i3GEOadmin.core.dicionario));
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >"+ $trad("codigoExiste",i3GEOadmin.core.dicionario) +"</span>");
					setTimeout("core_carregando('desativa')",3000);
				}
				else
				{
					YAHOO.admin.container.panelEditor.destroy();
					YAHOO.admin.container.panelEditor = null;
					core_pegaMapfiles("montaArvore()");
					//abre o editor de fonte de dados
					editorDados(codigo,codigo);
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
	var mensagem = $trad("msgLimpa",i3GEOadmin.editormapfile.dicionario)+codigoMap;
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
	var mensagem = $trad("excluiCache",i3GEOadmin.editormapfile.dicionario);
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
	removeFavoritos(codigoMap,false);
	var mensagem = $trad("msgExcluiMap",i3GEOadmin.core.dicionario)+codigoMap;
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
		core_carregando($trad("msgCopia",i3GEOadmin.core.dicionario));
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
	var mensagem = ""+ $trad("nomeArquivo",i3GEOadmin.core.dicionario) +"<br><input type=text value='' id=clonarComo />";
	var largura = "300";
	core_dialogoPergunta(handleYes,handleNo,mensagem,largura);
}
function alteraNomeTema(obj,codigoMap){
	var handleYes, handleNo, mensagem, largura = "300";
	
	mensagem = ""+ $trad("novoTitulo",i3GEOadmin.core.dicionario) +"<br><input size=30 type=text value='"+obj.innerHTML+"' id=mudarNomePara />";
	handleNo = function(){
		this.hide();
	};
	handleYes = function(){
		var callback, sUrl, novonome = $i("mudarNomePara").value;
		this.hide();
		if(novonome == "" || novonome === obj.innerHTML){
			return;
		}
		sUrl = "../php/editormapfile.php?funcao=alterarNomeTema&codigoMap="+codigoMap+"&novoNome="+novonome;
		core_carregando("ativa");
		core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+codigoMap);
		callback = {
			success:function(o) {
				try	{
					core_carregando("desativa");
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					obj.innerHTML = dados.tema;
				}
				catch(e){
					core_handleFailure(o,o.responseText);
				}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	core_dialogoPergunta(handleYes,handleNo,mensagem,largura);
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
/**
 * Obtem os dados do formulario de parametros de um plugin de inclusao de dados
 *
 * Formata a string e salva no LAYER
 *
 * @param onde
 * @param plugin
 * @param codigoMap
 * @param codigoLayer
 */
function salvarDadosEditorPlugin(onde,plugin,codigoMap,codigoLayer){
	var campos = onde.getElementsByTagName("input"),
		n = campos.length,
		par = [],
		prog = "../php/editormapfile.php?funcao=gravaPlugin",
		i;
	if(plugin != ""){
		if(!i3GEO.pluginI3geo[plugin].parametrosFormAdmin){
			for(i=0; i<n; i++){
				par.push('"'+campos[i].name+'":"'+campos[i].value+'"');
			}
			if(plugin != ""){
				plugin = '{"plugin":"'+plugin+'","parametros":{' + par.join(",") + '}}';
			}
		}
		else{
			plugin = i3GEO.pluginI3geo[plugin].parametrosFormAdmin(onde);
		}
	}
	core_carregando("ativa");
	core_carregando($trad("gravaLayer",i3GEOadmin.core.dicionario)+codigoLayer);
	var sUrl = prog
		+ "&codigoMap=" + codigoMap
		+ "&codigoLayer=" + codigoLayer
		+ "&plugin=" + plugin;
	var callback = {
			success:function(o)	{
				try	{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro") {
						core_carregando("<span style=color:red >"+ $trad("naoSalva",i3GEOadmin.core.dicionario) +"</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else {
						YAHOO.admin.container.panelEditor.destroy();
						YAHOO.admin.container.panelEditor = null;
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
	var callback,sUrl,i,valor,teste1, valorTeste,campos = [], par = "", prog = "", temp;
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
		//validacao
		if($i("kml_tema") && $i("ogc_tema")){
			if(($i("ogc_tema").value).toLowerCase() == "sim"){
				$i("kml_tema").value = "SIM";
			}
		}
		if($i("kml_tema") && $i("kmz_tema")){
			if(($i("kmz_tema").value).toLowerCase() == "sim"){
				$i("kml_tema").value = "SIM";
			}
			if(($i("kml_tema").value).toLowerCase() == "nao"){
				$i("kmz_tema").value = "NAO";
			}
		}
		campos = new Array("download","arquivodownload","arquivokmz","ogc_tema","kml_tema","kmz_tema","download_tema");
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
		valorTeste = $i("extensao").value;
		if(valorTeste != ""){
			teste1 = valorTeste.split(" ");
			if(teste1.length != 4)
			{alert($trad("extensao",i3GEOadmin.editormapfile.dicionario));return;}
			if(teste1[0]*1 > teste1[2]*1)
			{alert($trad("xmin",i3GEOadmin.editormapfile.dicionario));return;}
			if(teste1[1]*1 > teste1[3]*1)
			{alert($trad("ymin",i3GEOadmin.editormapfile.dicionario));return;}
		}
		valorTeste = $i("escala").value;
		if(valorTeste != ""){
			teste1 = valorTeste * 1;
			if(teste1 <= 0){
				alert($trad("erroEscala",i3GEOadmin.editormapfile.dicionario));
				return;
			}
		}
		campos = new Array("name","tema","iconetema","mensagem","escala","extensao","group");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarTitulo";
	}
	if(tipo == "conexao")
	{
		campos = new Array("tiles", "cortepixels","metaestat_id_medida_variavel","metaestat","cache","projection","type","connection","connectiontype","tileitem","tileindex","filteritem","filter","tipooriginal","convcaracter");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarConexao";
		//codifica o valor de data
		temp = "";
		if($i("data") && $i("data").value != ""){
			temp = i3GEO.util.base64encode($i("data").value);
		}
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&data="+temp;
	}
	if(tipo == "metadados")
	{
		campos = new Array("wms_tile","legendaimg","wms_srs","wms_name","wms_server_version","wms_format","wms_auth_username","wms_auth_password","wms_auth_type","wms_connectiontimeout","wms_latlonboundingbox","wms_proxy_auth_type","wms_proxy_host","wms_proxy_port","wms_proxy_type","wms_proxy_username","wms_proxy_password","wms_sld_body","wms_sld_url","wms_style","wms_bgcolor","wms_transparent","wms_time","itembuscarapida","ltempoformatodata","ltempoiteminicio","ltempoitemfim","ltempoitemtitulo","ltempoitemdescricao","ltempoitemtip","ltempoitemimagem","ltempoitemicone","ltempoitemlink","editorsql","ltempoconvencode","description_template","palletefile","palletestep","classestamanho","classessimbolo","classescor","classesnome","classesitem","identifica","transitioneffect","extensao","escondido","classe","tip","itenslink","itens","itensdesc");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		prog = "../php/editormapfile.php?funcao=alterarMetadados";
	}
	if(tipo == "classeGeral")
	{
		campos = new Array("status","minscale","maxscale","keyimage");
		par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
		par += "&expression="+i3GEO.util.base64encode($i("expression").value);
		par += "&name="+i3GEO.util.base64encode($i("name").value);
		par += "&title="+i3GEO.util.base64encode($i("title").value);
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
		for (i=0;i<campos.length;i++){
			if($i(campos[i])){
				valor = "";
				if($i(campos[i]).disabled === false){
					valor = $i(campos[i]).value;
				}
				par += "&"+campos[i]+"="+ valor;
			}
		}
	}catch(e){alert(e);}
	core_carregando("ativa");
	core_carregando($trad("gravaLayer",i3GEOadmin.core.dicionario)+codigoLayer);
	sUrl = prog+par;
	callback = {
			success:function(o)	{
				try{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
						core_carregando("<span style=color:red >"+ $trad("naoSalva",i3GEOadmin.core.dicionario) +"</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else{
						if(testar == false){
							if(tipo=="conexao"){
								//montaEditorDados(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="comport"){
								//montaEditorComport(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="dispo"){
								//montaEditorDispo(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="editavel"){
								//montaEditorEditavel(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="titulo"){
								//o codigo do layer pode ter sido alterado
								var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer);
								tree.removeChildren(no) ;
								no.expand();
								//montaEditorTitulo(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="metadados"){
								//montaEditorMetadados(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="geral"){
								var d = YAHOO.lang.JSON.parse(o.responseText);
								montaEditorGeral(d);
								if(d.name != codigoLayer){
									core_pegaMapfiles("montaArvore()");
									YAHOO.admin.container.panelEditor.destroy();
									YAHOO.admin.container.panelEditor = null;
								}
							}
							if(tipo=="classeGeral"){
								var dados = YAHOO.lang.JSON.parse(o.responseText);
								var no = tree.getNodeByProperty("id",dados.codigoMap+"_"+dados.codigoLayer+"_"+dados.indiceClasse);
								var d = conteudoNoClasse(dados.codigoMap,dados.codigoLayer,dados.indiceClasse,dados.name);
								no.setHtml(d);
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="classeLabel"){
								//montaEditorClasseLabel(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo=="estilo"){
								//montaEditorEstilo(YAHOO.lang.JSON.parse(o.responseText));
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
							}
							if(tipo =="grupousr"){
								var no = tree.getNodeByProperty("id",$i("Ecodigo_mapa_usr").value);
								tree.removeChildren(no) ;
								no.expand();
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
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
		core_carregando($trad("msgModificaOrdem2",i3GEOadmin.core.dicionario));
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
						var c,m = prompt($trad("senhaBd",i3GEOadmin.editormapfile.dicionario), "");
						if (m != null) {
							c = $i(eleValue);
							c.value = c.value.replace("******",m);
						}
						else{
							alert($trad("valorSenha",i3GEOadmin.editormapfile.dicionario));
						}
					};
					for(i=0;i<n;i++){
						temp = "password=****** user="+dados[i].usuario+" dbname="+dados[i].bancodedados+" host="+dados[i].host+" port="+dados[i].porta;


						textos.push("<b>"+dados[i].codigo_estat_conexao+"</b> (d: "+dados[i].bancodedados+" h: "+dados[i].host+" u: "+dados[i].usuario+")");
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
			alert($trad("apenasShp",i3GEOadmin.editormapfile.dicionario));
		}
	}
	else{
		i3GEO.util.navegadorDir(onde,false,false,true);
	}
}

//YAHOO.util.Event.addListener(window, "load", initMenu);
