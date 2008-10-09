YAHOO.namespace("example.container");
function initMenu()
{
	//ativaBotaoAdicionaAtlas("../php/atlas.php?funcao=alterarAtlas","adiciona")
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaPerfis("pegaMenus()");
}
function pegaMenus()
{
	core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus","montaArvore")
}
function montaArvore(dados)
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
			var sUrl = "../php/arvore.php?funcao=pegaGrupos&id_menu="+node.data.id_menu;
			var callback =
			{
                success: function(oResponse)
                {
                    var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
					montaNosGrupos(node.data.id_menu,node,dados,false)
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
   	montaNosMenus(dados)
   	tree.draw();
}
//
//adiciona os menus na árvore
//
function montaNosMenus(dados,redesenha)
{
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "<b>&nbsp;<span>"+dados[i].nome_menu+"</span>"
		var d = {html:conteudo,id_menu:dados[i].id_menu,tipo:"menu"};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
	}
	if(redesenha){tree.draw();}
}
//
//adiciona os grupos em um menu
//
function montaNosGrupos(idmenu,no,dados,redesenha)
{
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadSubgruposData(node, fnLoadComplete)
    {
		var sUrl = "../php/arvore.php?funcao=pegaSubGrupos&id_n1="+node.data.id_n1+"&id_menu="+idmenu;
		var callback =
		{
            success: function(oResponse)
            {
                var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
				montaNosSubgrupos(idmenu,node,dados,true)
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
    //pega os temas que ficam na raiz da árvore
	if(!tree.getNodeByProperty("etiquetaTemasRaiz","menu_"+idmenu))
	montaTemasRaiz(no,dados,true)
	//pega os grupos do menu
    if(!tree.getNodeByProperty("etiquetaGrupo","menu_"+idmenu))
    {
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"novoGrupo('"+idmenu+"')\" title='adiciona grupo' src=\"../imagens/05.png\" />"
		var temp = "menu_"+idmenu
		var d = {tipo:"etiqueta","etiquetaGrupo":temp,html:conteudo+"<i>Grupos:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.grupos.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','grupo','"+dados.grupos[i].id_n1+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','grupo','"+dados.grupos[i].id_n1+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('grupo','"+dados.grupos[i].id_n1+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('grupo','"+dados.grupos[i].id_n1+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados.grupos[i].nome_grupo+"</span>"
		var d = {html:conteudo,id_n1:dados.grupos[i].id_n1,tipo:"grupo"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		//tempNode.isLeaf = true;
		tempNode.setDynamicLoad(loadSubgruposData, temaIconMode);
	}
	if(redesenha){tree.draw();}
}
function montaNosSubgrupos(idmenu,no,dados,redesenha)
{
    function loadTemasData(node, fnLoadComplete)
    {
		var sUrl = "../php/arvore.php?funcao=pegaTemas&id_n2="+node.data.id_n2;
		var callback =
		{
            success: function(oResponse)
            {
                var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
				montaTemas(idmenu,node,dados,false)
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
    if(!tree.getNodeByProperty("etiquetaTemasGrupo","grupo_"+no.data.id_n1))
	montaTemasRaizGrupo(idmenu,no,dados,true)
	if(!tree.getNodeByProperty("etiquetaTemasSubGrupo",no.data.id_n1))
	{
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"novoSubGrupo('"+idmenu+"','"+no.data.id_n1+"')\" title='adiciona sub-grupo' src=\"../imagens/05.png\" />"
		var d = {tipo:"etiqueta",etiquetaTemasSubGrupo:no.data.id_n1,html:conteudo+"<i>Sub-grupos:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
	for (var i=0, j=dados.subgrupos.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','subgrupo','"+dados.subgrupos[i].id_n2+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','subgrupo','"+dados.subgrupos[i].id_n2+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('subgrupo','"+dados.subgrupos[i].id_n2+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('subgrupo','"+dados.subgrupos[i].id_n2+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados.subgrupos[i].nome_subgrupo+"</span>"
		var d = {html:conteudo,id_n2:dados.subgrupos[i].id_n2,tipo:"subgrupo"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.setDynamicLoad(loadTemasData, temaIconMode);
	}
	if(redesenha){tree.draw();}
}
function montaTemas(idmenu,no,dados,redesenha)
{
	if(!tree.getNodeByProperty("etiquetaTemas",no.data.id_n2))
	{
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"novoTema('"+idmenu+"','"+no.data.id_n2+"')\" title='adiciona tema' src=\"../imagens/05.png\" />"
		var d = {tipo:"etiqueta",etiquetaTemas:no.data.id_n2,html:conteudo+"<i>Temas:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','tema','"+dados[i].id_n3+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','tema','"+dados[i].id_n3+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('tema','"+dados[i].id_n3+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('tema','"+dados[i].id_n3+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados[i].nome_tema+"</span>"
		var d = {html:conteudo,id_n3:dados[i].id_n3,tipo:"tema"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
function montaTemasRaiz(no,dados,redesenha)
{
    if(!tree.getNodeByProperty("etiquetaTemasRaiz","menu_"+no.data.id_menu))
    {
		var temp = "menu_"+no.data.id_menu
		var d = {etiquetaTemasRaiz:temp,tipo:"etiqueta",html:"<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"novoTemaRaiz('"+no.data.id_menu+"')\" title='adiciona tema'  src=\"../imagens/05.png\" /><i>Temas na raiz do menu:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	var resultado = new Array();
	for (var i=0, j=dados.raiz.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','raizmenu','"+dados.raiz[i].id_raiz+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','raizmenu','"+dados.raiz[i].id_raiz+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('raizmenu','"+dados.raiz[i].id_raiz+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('raizmenu','"+dados.raiz[i].id_raiz+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados.raiz[i].nome_tema+"</span>"
		var d = {html:conteudo,id_raiz:dados.raiz[i].id_raiz,tipo:"raizmenu"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		resultado.push(tempNode)
	}
	return resultado;
}
function montaTemasRaizGrupo(idmenu,no,dados,redesenha)
{
    if(!tree.getNodeByProperty("etiquetaTemasGrupo","grupo_"+no.data.id_n1))
    {
		var temp = "grupo_"+no.data.id_n1
		var d = {etiquetaTemasGrupo:temp,tipo:"etiqueta",html:"<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"novoTemaRaizGrupo('"+idmenu+"','"+no.data.id_n1+"')\" title='adiciona tema'  src=\"../imagens/05.png\" /><i>Temas na raiz do grupo:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	var resultado = new Array();
	for (var i=0, j=dados.raiz.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','raizgrupo','"+dados.raiz[i].id_raiz+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','raizgrupo','"+dados.raiz[i].id_raiz+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('raizgrupo','"+dados.raiz[i].id_raiz+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('raizgrupo','"+dados.raiz[i].id_raiz+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados.raiz[i].nome_tema+"</span>"
		var d = {html:conteudo,id_raiz:dados.raiz[i].id_raiz,tipo:"raizmenu"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		resultado.push(tempNode)
	}
	return resultado;	
}
//
//adiciona um novo tema na raiz do menu
//id = id do menu alvo
//
function novoTemaRaiz(id)
{
	core_carregando("ativa");
	var mensagem = " adicionando tema...";
	core_carregando("mensagem");
	var no = tree.getNodeByProperty("id_menu",id)
	var noEtiquetaGrupo = tree.getNodeByProperty("etiquetaGrupo","menu_"+id)
	var sUrl = "../php/arvore.php?funcao=adicionarTemaRaiz&id_menu="+id;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			var nos = montaTemasRaiz(no,dados,false)
			tree.popNode(nos[0])
			nos[0].insertBefore(noEtiquetaGrupo)
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
function novoTemaRaizGrupo(idmenu,id)
{
	core_carregando("ativa");
	var mensagem = " adicionando tema...";
	core_carregando("mensagem");
	var no = tree.getNodeByProperty("id_n1",id)
	var noEtiquetaSubGrupo = tree.getNodeByProperty("etiquetaTemasSubGrupo",id)
	var sUrl = "../php/arvore.php?funcao=adicionarTemaRaizGrupo&id_n1="+id+"&id_menu="+idmenu;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			var nos = montaTemasRaizGrupo(idmenu,no,dados,false)
			tree.popNode(nos[0])
			nos[0].insertBefore(noEtiquetaSubGrupo)
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}

//
//adiciona um novo grupo
//
function novoGrupo(id_menu)
{
	core_carregando("ativa");
	var mensagem = " adicionando grupo...";
	core_carregando("mensagem");
	var sUrl = "../php/arvore.php?funcao=adicionarGrupo&id_menu="+id_menu;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			var no = tree.getNodeByProperty("id_menu",id_menu)
			montaNosGrupos(id_menu,no,dados,false)
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
//
//adiciona um novo sub-grupo
//
function novoSubGrupo(idmenu,id_n1)
{
	core_carregando("ativa");
	var mensagem = " adicionando Sub-grupo...";
	core_carregando("mensagem");
	var sUrl = "../php/arvore.php?funcao=adicionarSubGrupo&id_n1="+id_n1;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			var no = tree.getNodeByProperty("id_n1",id_n1)
			montaNosSubgrupos(idmenu,no,dados,false)
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
//
//adiciona um novo tema em um sub-grupo
//
function novoTema(idmenu,id_n2)
{
	core_carregando("ativa");
	var mensagem = " adicionando tema...";
	core_carregando("mensagem");
	var sUrl = "../php/arvore.php?funcao=adicionarTema&id_n2="+id_n2;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			var no = tree.getNodeByProperty("id_n2",id_n2)
			montaTemas(idmenu,no,dados,false)
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
function excluir(tipo,id)
{
	var mensagem = " excluindo o registro do id= "+id;
	if(tipo == "raizgrupo" || tipo == "raizmenu")
	{
		var no = tree.getNodeByProperty("id_raiz",id)
		var sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_raiz";
	}

	if(tipo == "grupo")
	{
		var no = tree.getNodeByProperty("id_n1",id)
		var sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_n1";
	}
	if(tipo == "subgrupo")
	{
		var no = tree.getNodeByProperty("id_n2",id)
		var sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_n2";
	}
	if(tipo == "tema")
	{
		var no = tree.getNodeByProperty("id_n3",id)
		var sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_n3";
	}
	core_excluiNoTree(sUrl,no,mensagem)	
}
function editar(tipo,id)
{
	core_carregando("ativa");
	core_carregando(" buscando dados");
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(tipo == "grupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('grupo','"+id+"')")
					$i("editor_bd").innerHTML = montaDivGrupo(dados)
					core_comboGrupos("comboGrupo","Eid_grupo",dados.id_grupo,"")
					core_comboPerfis("comboPerfil","Eperfil_grupo","","registraPerfil(this.value,\"En1_perfil\")")
				}
				if(tipo == "subgrupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('subgrupo','"+id+"')")
					$i("editor_bd").innerHTML = montaDivSubGrupo(dados)
					core_comboSubGrupos("comboSubGrupo","Eid_subgrupo",dados.id_subgrupo,"")
					core_comboPerfis("comboPerfil","Eperfil_subgrupo","","registraPerfil(this.value,\"En2_perfil\")")
				}
				if(tipo == "tema")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('tema','"+id+"')")
					$i("editor_bd").innerHTML = montaDivTema(dados)
					core_comboTemas("comboTema","Eid_tema",dados.id_tema,"")
					core_comboPerfis("comboPerfil","Eperfil_tema","","registraPerfil(this.value,\"En3_perfil\")")
				}
				if(tipo == "raizmenu" || tipo == "raizgrupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('"+tipo+"','"+id+"')")
					$i("editor_bd").innerHTML = montaDivRaiz(dados)
					core_comboTemas("comboTema","Eid_tema",dados.id_tema,"")
					core_comboPerfis("comboPerfil","Eperfil","","registraPerfil(this.value,\"Eperfil\")")
				}
				core_carregando("desativa");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	if(tipo == "grupo")
	{var sUrl = "../php/arvore.php?funcao=pegaDadosGrupo&id="+id;}
	if(tipo == "subgrupo")
	{var sUrl = "../php/arvore.php?funcao=pegaDadosSubGrupo&id="+id;}
	if(tipo == "tema")
	{var sUrl = "../php/arvore.php?funcao=pegaDadosTema&id="+id;}
	if(tipo == "raizmenu" || tipo == "raizgrupo")
	{var sUrl = "../php/arvore.php?funcao=pegaDadosRaiz&id="+id;}
	core_makeRequest(sUrl,callback)
}
function montaDivGrupo(i)
{
	var ins = "<br>Grupo:<br><br>"
	ins += "<div id=comboGrupo >Buscando...</div>"
	ins += "<p>Perfis que podem ver: </p>"
	ins += "<input size=50 type=text id='En1_perfil' value='"+i.n1_perfil+"' /></p>"
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br>Publicado?<br>"
	ins += "<select id='Epublicado' >"
	ins += core_combosimnao(i.publicado)
	ins += "</select>"
	ins += "<br><br>Para criar um novo grupo clique <a href='grupos.html' >aqui</a>."
	ins += "<br><br>Para criar um novo perfil clique <a href='perfis.html' >aqui</a>."
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />"
	return(ins)
}
function montaDivSubGrupo(i)
{
	var ins = "<br>Sub-Grupo:<br><br>"
	ins += "<div id=comboSubGrupo >Buscando...</div>"
	ins += "<p>Perfis que podem ver: </p>"
	ins += "<input size=50 type=text id='En2_perfil' value='"+i.n2_perfil+"' /></p>"
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br>Publicado?<br>"
	ins += "<select id='Epublicado' >"
	ins += core_combosimnao(i.publicado)
	ins += "</select>"
	ins += "<br><br>Para criar um novo sub-grupo clique <a href='subgrupos.html' >aqui</a>."
	ins += "<br><br>Para criar um novo perfil clique <a href='perfis.html' >aqui</a>."
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />"
	return(ins)
}
function montaDivTema(i)
{
	var ins = "<br>Tema:<br><br>"
	ins += "<div id=comboTema >Buscando...</div>"
	ins += "<p>Perfis que podem ver: </p>"
	ins += "<input size=50 type=text id='En3_perfil' value='"+i.n3_perfil+"' /></p>"
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br>Publicado?<br>"
	ins += "<select id='Epublicado' >"
	ins += core_combosimnao(i.publicado)
	ins += "</select>"
	ins += "<br><br>Para criar um novo tema clique <a href='temas.html' >aqui</a>."
	ins += "<br><br>Para criar um novo perfil clique <a href='perfis.html' >aqui</a>."
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />"
	return(ins)
}
function montaDivRaiz(i)
{
	var ins = "<br>Tema:<br><br>"
	ins += "<div id=comboTema >Buscando...</div>"
	ins += "<p>Perfis que podem ver: </p>"
	ins += "<input size=50 type=text id='Eperfil' value='"+i.perfil+"' /></p>"
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br><br>Para criar um novo tema clique <a href='temas.html' >aqui</a>."
	ins += "<br><br>Para criar um novo perfil clique <a href='perfis.html' >aqui</a>."
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />"
	return(ins)
}

function registraPerfil(valor,id)
{
	var inp = $i(id)
	var perfis = inp.value
	if(perfis == "")
	inp.value = valor
	else
	inp.value = perfis+" "+valor
}
function gravaDados(tipo,id)
{
	if(tipo == "grupo")
	{
		var campos = new Array("id_grupo","n1_perfil","publicado","ordem")
		var par = "&id="+id
		var prog = "../php/arvore.php?funcao=alterarGrupo"
	}
	if(tipo == "subgrupo")
	{
		var campos = new Array("id_subgrupo","n2_perfil","publicado","ordem")
		var par = "&id="+id
		var prog = "../php/arvore.php?funcao=alterarSubGrupo"
	}
	if(tipo == "tema")
	{
		var campos = new Array("id_tema","n3_perfil","publicado","ordem")
		var par = "&id="+id
		var prog = "../php/arvore.php?funcao=alterarTema"
	}
	if(tipo == "raizmenu" || tipo == "raizgrupo")
	{
		var campos = new Array("id_tema","perfil","ordem")
		var par = "&id="+id
		var prog = "../php/arvore.php?funcao=alterarRaiz"
	}

	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i("E"+campos[i]).value)}
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = prog+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem menus vinculados a este tema</span>");
  					setTimeout("core_carregando('desativa')",3000)
  				}
  				else
  				{
  					if(tipo == "grupo")
  					{
  						var obj = document.getElementById("Eid_grupo")
  						var texto = obj.options[obj.selectedIndex].text
  						var no = tree.getNodeByProperty("id_n1",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto
  					}
  					if(tipo == "subgrupo")
  					{
  						var obj = document.getElementById("Eid_subgrupo")
  						var texto = obj.options[obj.selectedIndex].text
  						var no = tree.getNodeByProperty("id_n2",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto
  					}
  					if(tipo == "tema")
  					{
  						var obj = document.getElementById("Eid_tema")
  						var texto = obj.options[obj.selectedIndex].text
  						var no = tree.getNodeByProperty("id_n3",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto
  					}
					if(tipo == "raizmenu" || tipo == "raizgrupo")
  					{
  						var obj = document.getElementById("Eid_tema")
  						var texto = obj.options[obj.selectedIndex].text
  						var no = tree.getNodeByProperty("id_raiz",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto
  					}		
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
	core_makeRequest(sUrl,callback,'POST')
}
function sobeDesce(movimento,tipo,id)
{
	if(tipo == "raizmenu" || tipo == "raizgrupo")
	{
		var no = tree.getNodeByProperty("id_raiz",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	if(tipo == "grupo")
	{
		var no = tree.getNodeByProperty("id_n1",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	if(tipo == "subgrupo")
	{
		var no = tree.getNodeByProperty("id_n2",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	if(tipo == "tema")
	{
		var no = tree.getNodeByProperty("id_n3",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	var callback =
	{
    	success: function(oResponse)
		{core_carregando("desativa");},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	if(movimenta)
	{
		var sUrl = "../php/arvore.php?funcao=movimentaNo&tipo="+tipo+"&movimento="+movimento+"&id="+id;		
		core_carregando("ativa");
		core_carregando(" modificando a ordem no banco de dados");
		core_makeRequest(sUrl,callback)
	}
}

YAHOO.util.Event.addListener(window, "load", initMenu);