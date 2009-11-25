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
	{texto:"MS_MYGIS",valor:"11"},
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

YAHOO.namespace("example.container");

function initMenu()
{
	ativaBotaoAdicionaMapfile("adiciona")
	core_carregando("ativa");
	core_carregando("buscando temas...");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaMapfiles("montaArvore()")
}
function ativaBotaoAdicionaMapfile(idBotao)
{
	var adiciona = function()
	{
		core_montaEditor("adicionaNovoMapfile()")
		ins = "<p>Título do novo tema: </p>"
		ins += "<input size=50 type=text id='Etitulo' value='' /></p>"
		ins += "<p>Nome do arquivo mapfile (sem .map): </p>"
		ins += "<input size=50 type=text id='Ecodigo' value='' /></p>"
		$i("editor_bd").innerHTML = ins
	};
	//cria o botão de adição de um novo menu
	var adiciona = new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
}
function montaArvore()
{
	YAHOO.example.treeExample = new function()
	{
		var currentIconMode;
		tree = "";
		function changeIconMode()
		{
			var newVal = parseInt(this.value);
			if (newVal != currentIconMode)
			{currentIconMode = newVal;}
			buildTree();
		}
        function loadNodeData(node, fnLoadComplete)
        {
			var sUrl = "../php/editormapfile.php?funcao=pegaLayers&codigoMap="+node.data.codigoMap;
			var callback =
			{
                success: function(oResponse)
                {
                    var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
					montaRaizTema(node,dados)
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
			tree.setDynamicLoad(loadNodeData, currentIconMode);
			var root = tree.getRoot();
			var tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.isLeaf = true;
			core_carregando("desativa");
        }
    	buildTree();
	}();
   	montaNosRaiz("nao")
   	tree.draw();
}
function montaNosRaiz(redesenha)
{
	var root = tree.getRoot();
	var nos = new Array()
	for (var i=0, j=$mapfiles.length; i<j; i++)
	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"excluirMapfile('"+$mapfiles[i]+"')\" title=excluir src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editorTemaMapfile('"+$mapfiles[i]+"')\" title='editar tema associado' src=\"../imagens/06.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"testarMapfile('"+$mapfiles[i]+"')\" title='testar!' src=\"../imagens/41.png\" /><b>&nbsp;<span>"+$mapfiles[i]+"</span>"
		var d = {html:conteudo,id:$mapfiles[i],codigoMap:$mapfiles[i]};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		nos.push(tempNode)
	}
	if(redesenha=="sim")
	tree.draw();
	return nos;
}
function testarMapfile(codigoMap)
{
	window.open("../../testamapfile.php?map="+codigoMap+".map")
}
function montaRaizTema(no,dados)
{
	var codigoMap = no.data.codigoMap;
	function iconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadLayerData(node, fnLoadComplete)
    {
		var sUrl = "../php/editormapfile.php?funcao=listaClasses&codigoMap="+node.data.codigoMap+"&codigoLayer="+node.data.codigoLayer;
		var callback =
		{
            success: function(oResponse)
            {
                var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
				montaParametrosTemas(node,dados,false)
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
    if(!tree.getNodeByProperty("etiquetaLayers",no.data.codigoMap))
    {
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"adicionaNovoLayer('"+no.data.codigoMap+"')\" title='adiciona layer' src=\"../imagens/05.png\" />"
		var d = {tipo:"etiqueta",etiquetaLayers:no.data.codigoMap,html:conteudo+"<i>Layers:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.layers.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','layer','"+no.data.codigoMap+"','"+dados.layers[i]+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','layer','"+no.data.codigoMap+"','"+dados.layers[i]+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirLayer('"+no.data.codigoMap+"','"+dados.layers[i]+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+dados.layers[i]+"</span>"
		var d = {html:conteudo,id:codigoMap+"_"+dados.layers[i],codigoMap:codigoMap,codigoLayer:dados.layers[i]}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.setDynamicLoad(loadLayerData, iconMode);
		tempNode.isLeaf = false;
	}
	tree.draw();
}
function montaParametrosTemas(no,dados,redesenha)
{
	var codigoMap = no.data.codigoMap;
	var codigoLayer = no.data.codigoLayer
	function iconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadClasseData(node, fnLoadComplete)
    {
		var indiceClasse = node.data.indiceClasse;
		var sUrl = "../php/editormapfile.php?funcao=listaEstilos&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
		var callback =
		{
            success: function(oResponse)
            {
                var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
				montaParametrosClasses(node,dados,false)
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
    if(!tree.getNodeByProperty("etiquetaConexao",no.data.id))
    {
		var conteudo = "<span style=cursor:pointer; onclick=\"editorConexao('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita conexão' src=\"../imagens/06.png\" /> Editar fonte dos dados</span>"
		var d = {tipo:"etiquetaConexao",etiquetaConexao:no.data.id,html:conteudo}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
    if(!tree.getNodeByProperty("etiquetaMetadados",no.data.id))
    {
		var conteudo = "<span style=cursor:pointer; onclick=\"editorMetadados('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita metadados' src=\"../imagens/06.png\" /> Editar metadados</span>"
		var d = {tipo:"etiquetaMetadados",etiquetaMetadados:no.data.id,html:conteudo}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
    if(!tree.getNodeByProperty("etiquetaGeral",no.data.id))
    {
		var conteudo = "<span style=cursor:pointer; onclick=\"editorGeral('"+codigoMap+"','"+codigoLayer+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='parâmetros gerais' src=\"../imagens/06.png\" /> Editar características gerais</span>"
		var d = {tipo:"etiquetaGeral",etiquetaGeral:no.data.id,html:conteudo}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
    if(!tree.getNodeByProperty("etiquetaClasses",no.data.id))
    {
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"adicionaNovaClasse('"+codigoMap+"','"+codigoLayer+"')\" title='adiciona classe' src=\"../imagens/05.png\" />&nbsp;"
		conteudo += "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"classesAuto('"+codigoMap+"','"+codigoLayer+"')\" title='gerar classes' src=\"../imagens/classificar.gif\" />&nbsp;"

		//conteudo += "<img width='10px' heigth='10px' style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editorClasses('"+codigoMap+"','"+codigoLayer+"')\" title='classes' src=\"../imagens/06.png\" />"
		var d = {tipo:"etiquetaClasses",etiquetaClasses:no.data.id,html:conteudo+"<i>&nbsp;Classes:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','classe','"+no.data.codigoMap+"','"+codigoLayer+"','"+dados[i].indice+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','classe','"+no.data.codigoMap+"','"+codigoLayer+"','"+dados[i].indice+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirClasse('"+codigoMap+"','"+codigoLayer+"','"+dados[i].indice+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+dados[i].indice+" "+dados[i].nome+"</span>"
		//conteudo += "<img width='10px' heigth='10px' style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editorClasse('"+codigoMap+"','"+codigoLayer+"','"+dados[i].indice+"')\" title='classes' src=\"../imagens/06.png\" />&nbsp;<span>"+dados[i].indice+" "+dados[i].nome+"</span>"
		var d = {classes:codigoMap+"_"+codigoLayer,html:conteudo,id:codigoMap+"_"+codigoLayer+"_"+dados[i].indice,codigoMap:codigoMap,codigoLayer:codigoLayer,indiceClasse:dados[i].indice}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.setDynamicLoad(loadClasseData, iconMode);
		tempNode.isLeaf = false;
	}
	tree.draw();
}
function montaParametrosClasses(no,dados,redesenha)
{
	var codigoMap = no.data.codigoMap;
	var codigoLayer = no.data.codigoLayer
	var indiceClasse = no.data.indiceClasse
    if(!tree.getNodeByProperty("etiquetaClasseGeral",no.data.id))
    {
		var conteudo = "<span style=cursor:pointer; onclick=\"editorClasseGeral('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\"  ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita características da classe' src=\"../imagens/06.png\" /> Editar características gerais</span>"
		var d = {tipo:"etiquetaClasseGeral",etiquetaClasseGeral:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
    if(!tree.getNodeByProperty("etiquetaClasseLabel",no.data.id))
    {
		var conteudo = "<span style=cursor:pointer; onclick=\"editorClasseLabel('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\" ><img width='10px' heigth='10px' style=\"position:relative;top:0px\" title='edita características da classe' src=\"../imagens/06.png\" /> Editar etiquetas</span>"
		var d = {tipo:"etiquetaClasseLabel",etiquetaClasseLabel:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
    if(!tree.getNodeByProperty("etiquetaEstilo",no.data.id))
    {
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"adicionaNovoEstilo('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"')\" title='adiciona estilo' src=\"../imagens/05.png\" />&nbsp;"
		var d = {tipo:"etiquetaEstilo",etiquetaEstilo:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo+"<i>Estilos:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','estilo','"+no.data.codigoMap+"','"+codigoLayer+"','"+indiceClasse+"','"+dados[i].estilo+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','estilo','"+no.data.codigoMap+"','"+codigoLayer+"','"+indiceClasse+"','"+dados[i].estilo+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirEstilo('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"','"+dados[i].estilo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;"
		conteudo += "<img width='10px' heigth='10px' style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editorEstilo('"+codigoMap+"','"+codigoLayer+"','"+indiceClasse+"','"+dados[i].estilo+"')\" title='classes' src=\"../imagens/06.png\" />&nbsp;<span>"+dados[i].estilo+"</span>"
		var d = {estilos:codigoMap+"_"+codigoLayer+"_"+indiceClasse,html:conteudo,id:codigoMap+"_"+codigoLayer+"_"+indiceClasse+"_"+dados[i].estilo,codigoMap:codigoMap,codigoLayer:codigoLayer,indiceClasse:indiceClasse,indiceEstilo:dados[i].estilo}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	tree.draw();
}
function editorDeTexto(codigoMap)
{
	core_carregando("ativa");
	core_carregando("buscando texto...");
	sUrl = "../php/editormapfile.php?funcao=pegaTextoMapfile&codigoMap="+codigoMap
	var callback =
	{
		success:function(o)
		{
			core_montaEditor("","600px","800px")
			var ins = "<input type=button id=salvarTexto value='Salvar' />"
			ins += "<textarea id='editorArea' rows='19' cols='70'>"+YAHOO.lang.JSON.parse(o.responseText)+"</textarea>"
			var temp = function()
			{
				core_carregando("ativa");
				core_carregando("salvando texto...");
				var callback1 =
				{
					success:function(o)
					{
						$i("editorArea").innerHTML = YAHOO.lang.JSON.parse(o.responseText)
						core_carregando("desativa");
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
				}
				var linhas = $i("editorArea").value.split("\n")
				var tempLinhas = ""
				for(var i=0, j=linhas.length; i<j; i++)
				{tempLinhas += linhas[i]+"xxxxxxxx"}
				sUrl = "../php/editormapfile.php?funcao=salvaTextoMapfile&codigoMap="+codigoMap+"&texto="+tempLinhas
				core_makeRequest(sUrl,callback1,"GET")
			}
			$i("editor_bd").innerHTML = ins
			new YAHOO.widget.Button("salvarTexto",{ onclick: { fn: temp }});
			core_carregando("desativa");
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function adicionaNovoMapfile()
{
	core_carregando("ativa");
	core_carregando(" adicionando um novo mapfile");
	var nome = $i("Etitulo").value
	var codigo = $i("Ecodigo").value
	sUrl = "../php/editormapfile.php?funcao=criarNovoMap&nome="+nome+"&codigo="+codigo
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Código já existe</span>");
					setTimeout("core_carregando('desativa')",3000)
				}
				else
				{
					YAHOO.example.container.panelEditor.destroy();
					YAHOO.example.container.panelEditor = null;
					core_pegaMapfiles("montaArvore()")
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function adicionaNovoLayer(codigoMap)
{
	core_carregando("ativa");
	core_carregando(" adicionando um novo layer");
	sUrl = "../php/editormapfile.php?funcao=criarNovoLayer&codigoMap="+codigoMap
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Erro</span>");
					setTimeout("core_carregando('desativa')",3000)
				}
				else
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)
					var no = tree.getNodeByProperty("codigoMap",codigoMap)
					montaRaizTema(no,dados)
					core_carregando("desativa");
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function adicionaNovaClasse(codigoMap,codigoLayer,indiceClasse)
{
	core_carregando("ativa");
	core_carregando(" adicionando uma nova classe");
	sUrl = "../php/editormapfile.php?funcao=criarNovaClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Erro</span>");
					setTimeout("core_carregando('desativa')",3000)
				}
				else
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)				
					var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer)
					montaParametrosTemas(no,dados)
					core_carregando("desativa");
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function classesAuto(codigoMap,codigoLayer)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		var ins = "";
		if(p_oEvent.newValue.get("value") == "OK" && document.getElementById("itens").value != "")
		{
			core_carregando("ativa");
			core_carregando(" gerando as classes");
			var sUrl = "../php/editormapfile.php?funcao=autoClassesLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&item="+document.getElementById("itens").value;
			var callback2 =
			{
  				success:function(o)
  				{
  					try
  					{
						var dados = YAHOO.lang.JSON.parse(o.responseText)				
						var nos = tree.getNodesByProperty("classes",codigoMap+"_"+codigoLayer)
						for (var i=0, j=nos.length; i<j; i++)
						{tree.removeNode(nos[i],false)}
						var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer)
						montaParametrosTemas(no,dados)
  						core_carregando("desativa");
  					}
  					catch(e){core_handleFailure(o,o.responseText);core_carregando("desativa");}
  				},
  				failure:core_handleFailure,
  				argument: { foo:"foo", bar:"bar" }
			};		
			core_makeRequest(sUrl,callback2)
		}
		else
		{
			YAHOO.example.container.panelEditorAutoClasses.destroy();
			YAHOO.example.container.panelEditorAutoClasses = null;
		}
	};
	if(!YAHOO.example.container.panelEditorAutoClasses)
	{
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor";
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
		YAHOO.example.container.panelEditorAutoClasses = new YAHOO.widget.Panel("janela_editor", { fixedcenter:true,close:true,width:"400px", height:"400px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditorAutoClasses.render();
		var sUrl = "../php/editormapfile.php?funcao=pegaItensLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		var callback =
		{
  			success:function(o)
  			{
  				try
  				{
  					ins = "<p>Itens encontrados na tabela de atributos do layer. Escolha um deles para ser utilizado na expressão de seleção de cada classe</p>"
  					ins += "<select  id='itens' >"
  					ins += core_comboObjeto(YAHOO.lang.JSON.parse(o.responseText).itens,"","","");
  					ins += "</select></p>"
  					$i("editor_bd").innerHTML = ins;
  					core_carregando("desativa");
  				}
  				catch(e){core_handleFailure(o,o.responseText);core_carregando("desativa");}
  			},
  			failure:core_handleFailure,
  			argument: { foo:"foo", bar:"bar" }
		};		
		core_makeRequest(sUrl,callback)
	}
	YAHOO.example.container.panelEditorAutoClasses.show();
}
function adicionaNovoEstilo(codigoMap,codigoLayer,indiceClasse)
{
	core_carregando("ativa");
	core_carregando(" adicionando um novo estilo");
	sUrl = "../php/editormapfile.php?funcao=criarNovoEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Erro</span>");
					setTimeout("core_carregando('desativa')",3000)
				}
				else
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)				
					var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse)
					montaParametrosClasses(no,dados)
					core_carregando("desativa");
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function excluirMapfile(codigoMap)
{
	var mensagem = " excluindo "+codigoMap;
	var no = tree.getNodeByProperty("id",codigoMap)
	var sUrl = "../php/editormapfile.php?funcao=excluirMapfile&codigoMap="+codigoMap;
	core_excluiNoTree(sUrl,no,mensagem)	
}
function excluirLayer(codigoMap,codigoLayer)
{
	var mensagem = " excluindo "+codigoLayer;
	var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer)
	var sUrl = "../php/editormapfile.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_excluiNoTree(sUrl,no,mensagem)	
}
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
					var dados = YAHOO.lang.JSON.parse(o.responseText)
					var nos = tree.getNodesByProperty("classes",codigoMap+"_"+codigoLayer)
					for (var i=0, j=nos.length; i<j; i++)
					{tree.removeNode(nos[i],false)}
					var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer)
					core_carregando("desativa");
					montaParametrosTemas(no,dados)
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};	
		core_makeRequest(sUrl,callback)
	}
	var handleNo = function()
	{this.hide();};
	var mensagem = "Exclui a classe?";
	var largura = "300"
	core_dialogoContinua(handleYes,handleNo,mensagem,largura)
}
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
					var dados = YAHOO.lang.JSON.parse(o.responseText)
					var nos = tree.getNodesByProperty("estilos",codigoMap+"_"+codigoLayer+"_"+indiceClasse)
					for (var i=0, j=nos.length; i<j; i++)
					{tree.removeNode(nos[i],false)}
					var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse)
					core_carregando("desativa");
					montaParametrosClasses(no,dados)
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};	
		core_makeRequest(sUrl,callback)
	}
	var handleNo = function()
	{this.hide();};
	var mensagem = "Exclui o estilo?";
	var largura = "300"
	core_dialogoContinua(handleYes,handleNo,mensagem,largura)
}
function editorConexao(codigoMap,codigoLayer)
{
	core_montaEditor("","600px","500px")
	var sUrl = "../php/editormapfile.php?funcao=pegaConexao&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorConexao")
}
function editorMetadados(codigoMap,codigoLayer)
{
	core_montaEditor("","600px","500px")
	var sUrl = "../php/editormapfile.php?funcao=pegaMetadados&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorMetadados")
}
function editorGeral(codigoMap,codigoLayer)
{
	core_montaEditor("","600px","500px")
	var sUrl = "../php/editormapfile.php?funcao=pegaGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorGeral")
}
function editorClasseGeral(codigoMap,codigoLayer,indiceClasse)
{
	core_montaEditor("","600px","500px")
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorClasseGeral")
}
function editorClasseLabel(codigoMap,codigoLayer,indiceClasse)
{
	core_montaEditor("","600px","500px")
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseLabel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorClasseLabel")
}
function editorEstilo(codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	core_montaEditor("","600px","500px")
	var sUrl = "../php/editormapfile.php?funcao=pegaEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorEstilo")
}
function montaEditorConexao(dados)
{
	var param = {
		"linhas":[
		{ajuda:"Type of connection. Default is local.",
		titulo:"Connectiontype",id:"",value:"",div:"<div id=cConnectiontype ></div>",tipo:"text"},
		{ajuda:"Database connection string to retrieve remote data.An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db] . Se vc tiver problemas com acentuação, experimente algo como: user=postgres password=postgres dbname=pgutf8 host=localhost port=5432 options='-c client_encoding=LATIN1'",
		titulo:"Connection",id:"connection",value:dados.connection,tipo:"text"},
		{ajuda:"Full filename of the spatial data to process. No file extension is necessary for shapefiles. Can be specified relative to the SHAPEPATH option from the Map Object.If this is an SDE layer, the parameter should include the name of the layer as well as the geometry column, i.e. 'mylayer,shape,myversion'.If this is a PostGIS layer, the parameter should be in the form of '<columnname> from <tablename>', where 'columnname' is the name of the column containing the geometry objects and 'tablename' is the name of the table from which the geometry data will be read.For Oracle, use 'shape FROM table' or 'shape FROM (SELECT statement)' or even more complex Oracle compliant queries! Note that there are important performance impacts when using spatial subqueries however. Try using MapServer's FILTER whenever possible instead. You can also see the SQL submitted by forcing an error, for instance by submitting a DATA parameter you know won't work, using for example a bad column name. Exemplo postgis: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291 . Exemplo shapefile: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp",
		titulo:"Data",id:"data",value:dados.data,tipo:"text"},
		{ajuda:"Item that contains the location of an individual tile, default is 'location'.",
		titulo:"tileitem",id:"tileitem",value:dados.tileitem,tipo:"text"},
		{ajuda:"Name of the tileindex file or layer. A tileindex is similar to an ArcInfo library index. The tileindex contains polygon features for each tile. The item that contains the location of the tiled data is given using the TILEITEM parameter. When a file is used as the tileindex for shapefile or raster layers, the tileindex should be a shapefile. For CONNECTIONTYPE OGR layers, any OGR supported datasource can be a tileindex. Normally the location should contain the path to the tile file relative to the shapepath, not relative to the tileindex itself. If the DATA parameter contains a value then it is added to the end of the location. When a tileindex layer is used, it works similarly to directly referring to a file, but any supported feature source can be used (ie. postgres, oracle).NOTE: All files in the tileindex should have the same coordinate system, and for vector files the same set of attributes in the same order.",
		titulo:"tileindex",id:"tileindex",value:dados.tileindex,tipo:"text"}
		]
	}
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />"
	if(dados.postgis_mapa.length > 0)
	{
		ins += "<p>Os seguintes 'alias' estão disponíveis para uso na opção 'connection': ";
		ins += dados.postgis_mapa+"</p>"
	}
	ins += "<input type=button title='Testar' value='Testar' id=testarEditor />"
	ins += core_geraLinhas(param)
	ins += "<br><br><br>"
	$i("editor_bd").innerHTML = ins
	temp = "<select id='connectiontype' >"
	temp += core_comboObjeto(objcontype,"valor","texto",dados.connectiontype)
	temp += "</select>"
	$i("cConnectiontype").innerHTML = temp

	var temp = function()
	{salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,false)}
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});

	var temp = function()
	{salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,"","",true)}
	new YAHOO.widget.Button("testarEditor",{ onclick: { fn: temp }});
}
function montaEditorMetadados(dados)
{
	var param = {
		"linhas":[
		{ajuda:"Nome que será utilizado na legenda do mapa e na guia 'Temas'",
		titulo:"Tema",id:"tema",value:dados.tema,tipo:"text"},
		{ajuda:"Denominador da escala da fonte dos dados utilizado pelo tema. É utilizado para apresentar a indicação de compatibilidade entre a escala do tema e a escala do mapa que está sendo visto.",
		titulo:"Escala",id:"escala",value:dados.escala,tipo:"text"},
		{ajuda:"Extensão geográfica máxima do tema, no formato xmin ymin xmax ymax. É utilizado na opção de 'zoom para o tema'. Quando o tema é baseado em shapefile, esse metadata não é necessário, pois o mapserver consegue calcular a extensão. Já em outros tipos de dados, como Postgis, o parâmetro é necessário. Nesse caso, se não for indicado, o botão de zoom para o tema não será visível para o usuário",
		titulo:"Extensao",id:"extensao",value:dados.extensao,tipo:"text"},
		{ajuda:"Indica se a extensão geográfica do mapa deve ser alterada quando o tema for adicionado ao mapa",
		titulo:"Aplica extensao",id:"",value:dados.aplicaextensao,tipo:"text",div:"<div id=cAplicaextensao ></div>"},
		{ajuda:"Indica se o usuário pode fazer download do tema",
		titulo:"Download",id:"",value:dados.download,tipo:"text",div:"<div id=cDownload ></div>"},
		{ajuda:"Endereço de um arquivo para download dos dados (caminho completo no servidor). Se definido, o sistema irá usar esse arquivo ao invés de gerar os dados, quando o usuário clicar nas opções de download. Se não for definido, o arquivo de download é gerado diretamente do original, convertendo do banco ou copiando o arquivo definido em DATA.",
		titulo:"Arquivo download",id:"arquivodownload",value:dados.arquivodownload,tipo:"text"},
		{ajuda:"A palete é válida apenas para temas RASTER. Entre com o endereço do arquivo no servidor. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
		titulo:"Arquivo com palete de cores (opcional e serve apenas para temas raster)",id:"palletefile",value:dados.palletefile,tipo:"text"},
		{ajuda:"Quantas cores em cada nível da palete. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
		titulo:"Passo (opcional e serve apenas para temas raster)",id:"palletestep",value:dados.palletestep,tipo:"text"},
		{ajuda:"Indica se as classes serão mostradas ou não na legenda. Por padrão é SIM.",
		titulo:"Classe",id:"",value:dados.classe,tipo:"text",div:"<div id=cClasse ></div>"},
		{ajuda:"Indica se o tema é mostrado no mapa mas não nas listas da legenda e na guia 'temas'",
		titulo:"Escondido",id:"",value:dados.escondido,tipo:"text",div:"<div id=cEscondido ></div>"},
		{ajuda:"Indica se o tema irá ser mostrado na ferramenta de identificação",
		titulo:"Identifica",id:"",value:dados.identifica,tipo:"text",div:"<div id=cIdentifica ></div>"},
		{ajuda:"Nomes das colunas da tabela de atributos do tema, que serão mostradas na ferramenta de identificação. Se for vazio, todas as colunas serão mostradas. A lista de itens deve ser separada por ',' e grafada em caixa alta no caso de shapefile.",
		titulo:"Itens",id:"itens",value:dados.itens,tipo:"text"},
		{ajuda:"Lista com os 'alias', ou apelidos, para os nomes das colunas listados no metadata 'itens'. Os alias devem ser separados por ',' e seguir a ordem definida em ITENS.",
		titulo:"Itensdesc",id:"itensdesc",value:dados.itensdesc,tipo:"text"},
		{ajuda:"Lista de links que serão incluídos em cada resultado de busca da ferramenta de identificação. A lista de links deve ser separada por ',', podendo-se incluir '' para indicar que o item não tem link. Exemplo de uso para inclusão de links para o site do IBGE quando um município é clicado no mapa:<br>ITENS 'codigo,nome2,uf'<br>ITENSDESC 'codigo do IBGE,nome do município,uf'<br>ITENSLLINK ',http://www.ibge.gov.br/munic2001/tabelas.php?codmun=[codigo]&descricao=[nome],'",
		titulo:"Itenslink",id:"itenslink",value:dados.itenslink,tipo:"text"},
		{ajuda:"Lista de colunas que serão utilizadas na opção de inclusão de 'etiquetas'. As etiquetas são mostradas no mapa quando o usuário estaciona o mouse por alguns instantes sobre o mapa. Separe a lista com ','.",
		titulo:"Tip",id:"tip",value:dados.tip,tipo:"text"},
		{ajuda:"Mensagem que será mostrada no rodapé do mapa quando o tema estiver visível. É útil para apresentar ao usuário observações especiais sobre o uso daquele tema.",
		titulo:"Mensagem",id:"mensagem",value:dados.mensagem,tipo:"text"},
		{ajuda:"É possível a geração de classes automaticamente por meio da definição de colunas na tabela de atributos do tema que armazenam as informações sobre cor, tamanho, etc. Esse metadata é utilizado para definir qual a coluna da tabela que identifica unicamente cada classe. Para cada valor será criada uma classe.<br>O tema que utiliza a geração de classes de forma automática, deve ter definido apenas uma classe. Essa classe será utilizada como padrão para geração das demais.",
		titulo:"Classesitem",id:"classesitem",value:dados.classesitem,tipo:"text"},
		{ajuda:"Nome da coluna que será utilizada para compor o nome das classes geradas automaticamente.",
		titulo:"Classesnome",id:"classesnome",value:dados.classesnome,tipo:"text"},
		{ajuda:"Nome da coluna que definirá a cor do símbolo utilizado em cada classe. As cores devem ser definidas em RGB.",
		titulo:"Classescor",id:"classescor",value:dados.classescor,tipo:"text"},
		{ajuda:"Nome da coluna que definirá o símbolo utilizado em cada classe.",
		titulo:"Classessimbolo",id:"classessimbolo",value:dados.classessimbolo,tipo:"text"},
		{ajuda:"Nome da coluna que definirá o tamanho de cada símbolo.",
		titulo:"Classestamanho",id:"classestamanho",value:dados.classestamanho,tipo:"text"}
		]
	}
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />"
	if(dados.colunas != "")
	{
		ins += "<p>O layer possuí as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>"
	}
	ins += core_geraLinhas(param)
	ins += "<br><br><br>"
	$i("editor_bd").innerHTML = ins
	
	temp = "<select id='aplicaextensao' >"
	temp += core_combosimnao(dados.aplicaextensao)
	temp += "</select>"
	$i("cAplicaextensao").innerHTML = temp
	temp = "<select id='download' >"
	temp += core_combosimnao(dados.download)
	temp += "</select>"
	$i("cDownload").innerHTML = temp
	temp = "<p><select id='classe' >"
	temp += core_combosimnao(dados.classe)
	temp += "</select>"
	$i("cClasse").innerHTML = temp
	temp = "<select id='escondido' >"
	temp += core_combosimnao(dados.escondido)
	temp += "</select>"
	$i("cEscondido").innerHTML = temp
	temp = "<select id='identifica' >"
	temp += core_combosimnao(dados.identifica)
	temp += "</select>"
	$i("cIdentifica").innerHTML = temp

	var temp = function()
	{salvarDadosEditor('metadados',dados.codigoMap,dados.codigoLayer)}
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorGeral(dados)
{
	var param = {
		"linhas":[
		{ajuda:"Layer name",
		titulo:"Name",id:"name",value:dados.name,tipo:"text"},
		{ajuda:"Name of a group that this layer belongs to. The group name can then be reference as a regular layer name in the template files, allowing to do things like turning on and off a group of layers at once.",
		titulo:"Group",id:"group",value:dados.group,tipo:"text"},
		{ajuda:"Projeção",
		titulo:"Projection",id:"projection",value:dados.projection,tipo:"text"},		
		{ajuda:"Sets the current status of the layer. Often modified by MapServer itself. Default turns the layer on permanently",
		titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},		
		{ajuda:"Specifies how the data should be drawn. Need not be the same as the shapefile type. For example, a polygon shapefile may be drawn as a point layer, but a point shapefile may not be drawn as a polygon layer. Common sense rules. Annotation means that a label point will be calculated for the features, but the feature itself will not be drawn although a marker symbol can be optionally drawn. this allows for advanced labeling like numbered highway shields. Points are labeled at that point. Polygons are labeled first using a centroid, and if that doesn't fall in the polygon a scanline approach is used to guarantee the label falls within the feature. Lines are labeled at the middle of the longest arc in the visible portion of the line. Query only means the layer can be queried but not drawn.In order to differentiate between POLYGONs and POLYLINEs (which do not exist as a type), simply respectively use or ommit the COLOR keyword when classifying. If you use it, it's a polygon with a fill color, otherwise it's a polyline with only an OUTLINECOLOR.For CHART layers, see the Dynamic Charting howto.A circle must be defined by a a minimum bounding rectangle. That is, 2 points that define the smallest square that can contain it. These 2 points are the two opposite corners of said box",
		titulo:"Type",id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},		
		{ajuda:"Sets the color index to treat as transparent for raster layers.",
		titulo:"Offsite (R,G,B) (utilize -1,-1,-1 para anular o valor)",id:"offsite",value:dados.offsite,tipo:"text"},
		{ajuda:"Sets the opacity level (or the inability to see through the layer) of all classed pixels for a given layer. The value can either be an integer in the range (0-100) or the named symbol 'ALPHA'. A value of 100 is opaque and 0 is fully transparent. Implemented in MapServer 5.0, to replace the deprecated TRANSPARENCY parameter.The 'ALPHA' symbol directs the MapServer rendering code to honor the indexed or alpha transparency of pixmap symbols used to style a layer. This is only needed in the case of RGB output formats, and should be used only when necessary as it is expensive to render transparent pixmap symbols onto an RGB map image.",
		titulo:"Opacity",id:"opacity",value:dados.opacity,tipo:"text"},
		{ajuda:"Maximum scale at which this LAYER is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Maxscale (utilize -1 para anular o valor)",id:"maxscale",value:dados.maxscale,tipo:"text"},
		{ajuda:"Minimum scale at which this LAYER is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Minscale (utilize -1 para anular o valor)",id:"minscale",value:dados.minscale,tipo:"text"},
		{ajuda:"This parameter allows for data specific attribute filtering that is done at the same time spatial filtering is done, but before any CLASS expressions are evaluated. For OGR and shapefiles the string is simply a mapserver regular expression. For spatial databases the string is a SQL WHERE clause that is valid with respect to the underlying database.For example: FILTER type='road' and size <2",
		titulo:"Filter",id:"filter",value:dados.filter,tipo:"text"},
		{ajuda:"Item to use with simple FILTER expressions. OGR and shapefiles only.",
		titulo:"Filteritem",id:"filteritem",value:dados.filteritem,tipo:"text"},
		{ajuda:"Item name in attribute table to use for class annotation (i.e. labeling).",
		titulo:"Labelitem",id:"labelitem",value:dados.labelitem,tipo:"text"},
		{ajuda:"Maximum scale at which this LAYER is labeled. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Labelmaxscale (utilize -1 para anular o valor)",id:"labelmaxscale",value:dados.labelmaxscale,tipo:"text"},
		{ajuda:"Minimum scale at which this LAYER is labeled. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Labelminscale (utilize -1 para anular o valor)",id:"labelminscale",value:dados.labelminscale,tipo:"text"},
		{ajuda:"The scale at which symbols and/or text appear full size. This allows for dynamic scaling of objects based on the scale of the map. If not set then this layer will always appear at the same size. Scaling only takes place within the limits of MINSIZE and MAXSIZE as described above. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Symbolscale (utilize -1 para anular o valor)",id:"symbolscale",value:dados.symbolscale,tipo:"text"},
		{ajuda:"Sensitivity for point based queries (i.e. via mouse and/or map coordinates). Given in TOLERANCEUNITS. If the layer is a POINT or a LINE, the default is 3. For all other layer types, the default is 0. To restrict polygon searches so that the point must occur in the polygon set the tolerance to zero.",
		titulo:"Tolerance",id:"tolerance",value:dados.tolerance,tipo:"text"},			
		{ajuda:" ",
		titulo:"Tolerance units",id:"",value:dados.toleranceunits,tipo:"text",div:"<div id=cToleranceunits ></div>"},			
		{ajuda:"Sets the unit of CLASS object SIZE values (default is pixels). Useful for simulating buffering",
		titulo:"Sizeunits",id:"",value:dados.sizeunits,tipo:"text",div:"<div id=cSizeunits ></div>"}		
		]
	}
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />"
	ins += "<input type=button title='Testar' value='Testar' id=testarEditor />"
	if(dados.colunas != "")
	{
		ins += "<p>O layer possuí as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>"
	}
	
	ins += core_geraLinhas(param)
	ins += "<br><br><br>"
	$i("editor_bd").innerHTML = ins
		
	temp = "<select id='status' >"
	temp += core_comboObjeto(objstatus,"valor","texto",dados.status)
	temp += "</select>"
	$i("cStatus").innerHTML = temp	
	temp = "<select id='type' >"
	temp += core_comboObjeto(objlayertypes,"valor","texto",dados.type)
	temp += "</select>"
	$i("cType").innerHTML = temp	
	temp = "<select id='sizeunits' >"
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.sizeunits)
	temp += "</select>"
	$i("cSizeunits").innerHTML = temp
	temp = "<select id='toleranceunits' >"
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.toleranceunits)
	temp += "</select>"
	$i("cToleranceunits").innerHTML = temp

	var temp = function()
	{salvarDadosEditor('geral',dados.codigoMap,dados.codigoLayer,false)}
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
	
	var temp = function()
	{salvarDadosEditor('geral',dados.codigoMap,dados.codigoLayer,"","",true)}
	new YAHOO.widget.Button("testarEditor",{ onclick: { fn: temp }});

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
		{ajuda:"Descrição da classe (mostrada na legenda quando o mouse é sobreposto",
		titulo:"Title",id:"title",value:dados.title,tipo:"text"},
		{ajuda:"Sets the current display status of the class. Default turns the class on",
		titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},
		{ajuda:"Four types of expressions are now supported to define class membership. String comparisons, regular expressions, simple logical expressions, and string functions. If no expression is given, then all features are said to belong to this class.<br>String comparisons are case sensitive and are the fastest to evaluate. No special delimiters are necessary although string must be quoted if they contain special characters. (As a matter of good habit, it is recommended you quote all strings).<br>Regular expressions function just like previous versions of MapServer. However, you must now delimit a regular expression using /regex/. No quotes should be used.<br><br>Logical expressions allow you to build fairly complex tests based on one or more attributes and therefore are only available with shapefiles. Logical expressions are delimited by parentheses '(expression)'. Attribute names are delimited by square brackets '[ATTRIBUTE]'. These names are case sensitive and must match the items in the shapefile. For example: EXPRESSION ([POPULATION] > 50000 AND '[LANGUAGE]' eq 'FRENCH') ... The following logical operators are supported: =,>,<,<=,>=,=,or,and,lt,gt,ge,le,eq,ne. As you might expect this level of complexity is slower to process.<br>One string function exists: length(). This obviously computes the length of a string. An example follows:<br>EXPRESSION (length('[NAME_E]') < 8)<br>String comparisons and regular expressions work from the classitem defined at the layer level. You may mix expression types within the different classes of a layer",
		titulo:"Expression",id:"expression",value:dados.expression,tipo:"text"},
		{ajuda:"Full filename of the legend image for the CLASS. This image is used when building a legend (or requesting a legend icon via MapScript or the CGI application).",
		titulo:"Keyimage",id:"keyimage",value:dados.keyimage,tipo:"text"},
		{ajuda:"Maximum scale at which this CLASS is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Maxscale",id:"maxscale",value:dados.maxscale,tipo:"text"},
		{ajuda:"Minimum scale at which this CLASS is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
		titulo:"Minscale",id:"minscale",value:dados.minscale,tipo:"text"}
		]
	}
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />"
	if(dados.colunas != "")
	{
		ins += "<p>O layer possuí as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>"
	}
	ins += core_geraLinhas(param)
	ins += "<br><br><br>"
	$i("editor_bd").innerHTML = ins
		
	temp = "<select id='status' >"
	temp += core_comboObjeto(objstatus,"valor","texto",dados.status)
	temp += "</select>"
	$i("cStatus").innerHTML = temp	

	var temp = function()
	{salvarDadosEditor('classeGeral',dados.codigoMap,dados.codigoLayer,dados.indiceClasse)}
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
		{ajuda:"Cálculo automático do ângulo quando os elementos forem lineares",
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
	}
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />"
	if(dados.colunas != "")
	{
		ins += "<p>O layer possuí as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>"
	}
	ins += core_geraLinhas(param)
	ins += "<br><br><br>"
	$i("editor_bd").innerHTML = ins

	temp = "<select id='font' >"
	temp += core_comboObjeto(dados.fontes,"","",dados.font)
	temp += "</select>"
	$i("cFont").innerHTML = temp
	
	temp = "<select id='type' >"
	temp += core_comboObjeto(objfonttypes,"valor","texto",dados.type)
	temp += "</select>"
	$i("cType").innerHTML = temp	

	temp = "<select id='partials' >"
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.partials)
	temp += "</select>"
	$i("cPartials").innerHTML = temp	

	temp = "<select id='force' >"
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.force)
	temp += "</select>"
	$i("cForce").innerHTML = temp	

	temp = "<select id='autoangle' >"
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.autoangle)
	temp += "</select>"
	$i("cAutoangle").innerHTML = temp

	var temp = function()
	{salvarDadosEditor('classeLabel',dados.codigoMap,dados.codigoLayer,dados.indiceClasse)}
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
function montaEditorEstilo(dados)
{
	var param = {
		"linhas":[
			{ajuda:"The symbol name or number to use for all features if attribute tables are not used. The number is the index of the symbol in the symbol file, starting at 1, the 5th symbol in the file is therefore symbol number 5. You can also give your symbols names using the NAME keyword in the symbol definition file, and use those to refer to them. Default is 0, which results in a single pixel, single width line, or solid polygon fill, depending on layer type.You can also specify a gif or png filename. The path is relative to the location of the mapfile.",
			titulo:"Symbolname",id:"symbolname",value:dados.symbolname,tipo:"text"},
			{ajuda:"Color to use for drawing features.",
			titulo:"Color",id:"color",value:dados.color,tipo:"cor"},
			{ajuda:"Background-color to use for drawing features.",
			titulo:"Backgroundcolorolor",id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
			{ajuda:"Height, in pixels, of the symbol/pattern to be used. Only useful with scalable symbols. Default is 1. For symbols of Type HATCH, the SIZE is the distance between hatched lines. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
			titulo:"Size",id:"size",value:dados.size,tipo:"text"},
			{ajuda:"Color to use for outlining polygons and certain marker symbols. Line symbols do not support outline colors.",
			titulo:"Outlinecolor",id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
			{ajuda:"Width refers to the thickness of line work drawn, in pixels. Default is 1. For symbols of Type HATCH, the WIDTH is how thick the hatched lines are. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
			titulo:"Width",id:"width",value:dados.width,tipo:"text"},
			{ajuda:"Height, in pixels, of the symbol/pattern to be used. Only useful with scalable symbols. Default is 1. For symbols of Type HATCH, the SIZE is the distance between hatched lines. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
			titulo:"Minsize",id:"minsize",value:dados.minsize,tipo:"text"},
			{ajuda:"Maximum size in pixels to draw a symbol. Default is 50.",
			titulo:"Maxsize",id:"maxsize",value:dados.maxsize,tipo:"text"},
			{ajuda:"Offset values for shadows, hollow symbols, etc ...",
			titulo:"Offsetx",id:"offsetx",value:dados.offsetx,tipo:"text"},
			{ajuda:"Offset values for shadows, hollow symbols, etc ...",
			titulo:"Offsety",id:"offsety",value:dados.offsety,tipo:"text"},
			{ajuda:"Should TrueType fonts and Cartoline symbols be antialiased.",
			titulo:"Antialias",id:"antialias",value:dados.antialias,tipo:"text"},
			{ajuda:"Minimum width in pixels to draw the line work.",
			titulo:"Minwidth",id:"minwidth",value:dados.minwidth,tipo:"text"},
			{ajuda:"Maximun width in pixels to draw the line work.",
			titulo:"Maxwidth",id:"maxwidth",value:dados.maxwidth,tipo:"text"},
			{ajuda:"Angle, given in degrees, to draw the line work. Default is 0. For symbols of Type HATCH, this is the angle of the hatched lines. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
			titulo:"Angle",id:"angle",value:dados.angle,tipo:"text"}
		]
	}
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />"
	ins += core_geraLinhas(param)
	ins += "<br><br><br>"
	$i("editor_bd").innerHTML = ins	

	var temp = function()
	{salvarDadosEditor('estilo',dados.codigoMap,dados.codigoLayer,dados.indiceClasse,dados.indiceEstilo)}
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});	
}
function salvarDadosEditor(tipo,codigoMap,codigoLayer,indiceClasse,indiceEstilo,testar)
{
	if(arguments.length < 6){var testar = false;}
	if(tipo == "conexao")
	{
		var campos = new Array("connection","data","connectiontype","tileitem","tileindex")
		var par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer
		var prog = "../php/editormapfile.php?funcao=alterarConexao"
	}
	if(tipo == "metadados")
	{
		//
		//validação
		//
		var valorTeste = $i("extensao").value
		if(valorTeste != ""){
			var teste1 = valorTeste.split(" ");
			if(teste1.length != 4)
			{alert("Sao necessarios 4 valores em extensao");return;}
			if(teste1[0]*1 > teste1[2]*1)
			{alert("xmin maior que xmax em extensao");return;}
			if(teste1[1]*1 > teste1[3]*1)
			{alert("ymin maior que ymax em extensao");return;}
		}
		var valorTeste = $i("escala").value
		if(valorTeste != ""){
			var teste1 = valorTeste * 1;
			if(teste1 > 0){}
			else
			{alert("Valor de escala incorreto");return;}
		}
				
		var campos = new Array("palletefile","palletestep","arquivodownload","aplicaextensao","classestamanho","classessimbolo","classescor","classesnome","classesitem","mensagem","identifica","extensao","escondido","download","escala","tema","classe","tip","itenslink","itens","itensdesc")
		var par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer
		var prog = "../php/editormapfile.php?funcao=alterarMetadados"
	}
	if(tipo == "geral")
	{
		var campos = new Array("name","projection","sizeunits","status","toleranceunits","tolerance","symbolscale","opacity","offsite","minscale","maxscale","labelminscale","labelmaxscale","labelitem","group","filteritem","type","filter")
		var par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer
		var prog = "../php/editormapfile.php?funcao=alterarGeral"
	}
	if(tipo == "classeGeral")
	{
		var campos = new Array("status","minscale","maxscale","name","title","keyimage")
		var par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse
		var temp = $i("expression").value;
		var re = /]/g;
		var temp = temp.replace(re,"C_");
		var re = "[";
		var temp = temp.replace(re,"_C");
		var re = /'/g;
		var temp = temp.replace(re,"_A_");
		par += "&expression="+temp;
		var prog = "../php/editormapfile.php?funcao=alterarClasseGeral"	
	}
	if(tipo == "classeLabel")
	{
		var campos = new Array("encoding","force","partials","mindistance","minfeaturesize","wrap","antialias","buffer","autoangle","angle","offsety","offsetx","position","maxsize","minsize","size","backgroundshadowsizey","backgroundshadowsizex","shadowsizey","shadowsizex","shadowcolor","outlinecolor","color","backgroundshadowcolor","backgroundcolor","type","font")
		var par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse
		var prog = "../php/editormapfile.php?funcao=alterarClasseLabel"	
	}
	if(tipo == "estilo")
	{
		var campos = new Array("angle","maxwidth","minwidth","width","outlinecolor","backgroundcolor","antialias","offsety","offsetx","maxsize","minsize","size","color","symbolname")
		var par = "&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo
		var prog = "../php/editormapfile.php?funcao=alterarEstilo"	
	}
	prog += "&testar="+testar;
	try{
	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i(campos[i]).value)}
	}catch(e){alert(e)}
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
  					core_carregando("<span style=color:red >Não foi possível salvar.</span>");
  					setTimeout("core_carregando('desativa')",3000)
  				}
  				else
  				{
  					if(testar == false){
  						if(tipo=="conexao")
  						{montaEditorConexao(YAHOO.lang.JSON.parse(o.responseText));}
  						if(tipo=="metadados")
  						{montaEditorMetadados(YAHOO.lang.JSON.parse(o.responseText));}
  						if(tipo=="geral")
  						{
  							var d = YAHOO.lang.JSON.parse(o.responseText)
  							montaEditorGeral(d);
  							if(d.name != codigoLayer)
  							{
  								core_pegaMapfiles("montaArvore()")
								YAHOO.example.container.panelEditor.destroy();
								YAHOO.example.container.panelEditor = null;  							
  							}
  						}
  						if(tipo=="classeGeral")
  						{montaEditorClasseGeral(YAHOO.lang.JSON.parse(o.responseText));}
  						if(tipo=="classeLabel")
  						{montaEditorClasseLabel(YAHOO.lang.JSON.parse(o.responseText));}
  						if(tipo=="estilo")
  						{montaEditorEstilo(YAHOO.lang.JSON.parse(o.responseText));}
  					}
  					else{
  						window.open("../../testamapfile.php?map="+YAHOO.lang.JSON.parse(o.responseText).url)
  					}
  					core_carregando("desativa");
  				}
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback,'POST')
}
function sobeDesce(movimento,tipo,codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	if(tipo == "layer")
	{
		var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer);
		var movimenta = core_movimentaNo(movimento,no);
		var indiceClasse = "";
		var indiceEstilo = "";
	}
	if(tipo == "classe")
	{
		var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse);
		var movimenta = true;
		var indiceEstilo = "";
	}
	if(tipo == "estilo")
	{
		var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse+"_"+indiceEstilo);
		var movimenta = true;
	}

	var callback =
	{
    	success: function(o)
		{
			core_carregando("desativa");
			if(tipo == "classe")
			{
				var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer)
				tree.removeChildren(no)  
				no.expand();
			}
			if(tipo == "estilo")
			{
				var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse)
				tree.removeChildren(no)  
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
		core_makeRequest(sUrl,callback)
	}
}
YAHOO.util.Event.addListener(window, "load", initMenu);