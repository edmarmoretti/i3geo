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
			var sUrl = "../php/temas.php?funcao=pegaLayers&codigoMap="+node.data.codigoMap;
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
                timeout: 7000
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
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"excluir('mapfile','"+$mapfiles[i]+"')\" title=excluir src=\"../imagens/01.png\" /><b>&nbsp;<span>"+$mapfiles[i]+"</span>"
		var d = {html:conteudo,codigoMap:$mapfiles[i]};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		nos.push(tempNode)
	}
	if(redesenha=="sim")
	tree.draw();
	return nos;
}
function montaRaizTema(no,dados)
{
	function iconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadLayerData(node, fnLoadComplete)
    {
		var sUrl = "../php/arvore.php?funcao=pegaTemas&id_n2="+node.data.id_n2;
		var callback =
		{
            success: function(oResponse)
            {
                var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
				//montaTemas(idmenu,node,dados,false)
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
            timeout: 7000
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
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirLayer('"+no.data.codigoMap+"','"+dados.layers[i]+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+dados.layers[i]+"</span>"
		var d = {html:conteudo,id:no.data.codigoMap+"_"+dados.layers[i]}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.setDynamicLoad(loadLayerData, iconMode);
	}
	tree.draw();
}
function adicionaNovoMapfile()
{
	core_carregando("ativa");
	core_carregando(" adicionando um novo mapfile");
	var nome = $i("Etitulo").value
	var codigo = $i("Ecodigo").value
	sUrl = "../php/temas.php?funcao=criarNovoMap&nome="+nome+"&codigo="+codigo
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
					$mapfiles = [codigo];
					var nos = montaNosRaiz("nao");
					tree.popNode(nos[0])
					var noi = tree.getNodeByIndex(1);
					nos[0].insertBefore(noi);
					tree.draw();
					core_carregando("desativa");
				}
				YAHOO.example.container.panelEditor.destroy();
				YAHOO.example.container.panelEditor = null;
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
	sUrl = "../php/temas.php?funcao=criarNovoLayer&codigoMap="+codigoMap
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
				YAHOO.example.container.panelEditor.destroy();
				YAHOO.example.container.panelEditor = null;
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}

function excluirLayer(codigoMap,codigoLayer)
{
	var mensagem = " excluindo "+codigoLayer;
	var no = tree.getNodeByProperty("id",codigoMap+"_"+codigoLayer)
	var sUrl = "../php/temas.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_excluiNoTree(sUrl,no,mensagem)	
}
YAHOO.util.Event.addListener(window, "load", initMenu);