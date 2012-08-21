/*
Title: arvore.js

Fun��es que controlam a interface do editor da �rvore de temas

Atuam no controle dos n�s da �rvore

Pode-se enviar par�metros pela URL utilizada na inclus�o desse script

Exemplo:

http://localhost/i3geo/admin/html/arvore.html?id_menu=1&id_grupo=10&id_subgrupo=3

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist�rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa � software livre; voc� pode redistribu�-lo
e/ou modific�-lo sob os termos da Licen�a P�blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa � distribu�do na expectativa de que seja �til,
por�m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl�cita
de COMERCIABILIDADE OU ADEQUA��O A UMA FINALIDADE ESPEC�FICA.
Consulte a Licen�a P�blica Geral do GNU para mais detalhes.
Voc� deve ter recebido uma c�pia da Licen�a P�blica Geral do
GNU junto com este programa; se n�o, escreva para a
Free Software Foundation, Inc., no endere�o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/arvore.js
*/
//
//obtem os parametros da url
//
YAHOO.namespace("admin.container");
(function(){
	$id_menu = "";
	$id_grupo = "";
	$id_subgrupo = "";
	try{
		var i,p,u = window.location.href.split("?")[1];
		u = u.split("&");
		for(i=0;i<u.length;i++){
			p = u[i].split("=");
			eval("$"+p[0]+"='"+p[1]+"';");
		}
	}
	catch(e){}
})();
/*
Function: initMenu

Inicializa a �rvore
*/
function initMenu(){
	var editorDeMenus = function()	{
			if($i("editor_bd")){return;}
			core_montaEditor("","600px","500px","pegaMenus","Menu");
			$i("editor_bd").innerHTML = '<input type=button id=adicionaNovoMenu value="Adicionar um novo menu" style="left:-5px;" /><br><br><div id="letras_M" ></div><br><br><div id="tabela" style="left:-5px;"> </div>';
			i3GEOadmin.menus.inicia();
		},
		editorDeGrupos = function(){
			if($i("editor_bd")){return;}
			core_montaEditor("","600px","500px","","Grupos");
			$i("editor_bd").innerHTML = '<p class=paragrafo >Clique nas c&eacute;lulas da tabela para editar a caracter&iacute;stica de cada item. Finalize com "enter". Ap&oacute;s editar, salve o item.</p><p class=paragrafo ><input type=button id=adicionaNovoGrupo value="Adicionar um novo grupo" style="left:-5px;" /></p><p><br><br><div id="letras_G" ></div><br><div id="tabela" style="left:-5px;"> </div>';
			i3GEOadmin.grupos.inicia();
		},
		editorDeSubGrupos = function()	{
			if($i("editor_bd")){return;}
			core_montaEditor("","600px","500px","","Subgrupos");
			$i("editor_bd").innerHTML = '<p class=paragrafo >Clique nas c&eacute;lulas da tabela para editar a caracter&iacutre;stica de cada item. Finalize com "enter". Ap&oacute;s editar, salve o item.</p><p class=paragrafo ><input type=button id=adicionaNovoSubGrupo value="Adicionar um novo sub-grupo" style="left:-5px;" /></p><br><br><div id="letras_S" ></div><br><div id="tabela" style="left:-5px;"> </div>';
			initEditorSubGrupos();
		};
	new YAHOO.widget.Button("botaoEditorMenu",{ onclick: { fn: editorDeMenus } });
	new YAHOO.widget.Button("botaoEditorGrupo",{ onclick: { fn: editorDeGrupos } });
	new YAHOO.widget.Button("botaoEditorSubGrupo",{ onclick: { fn: editorDeSubGrupos } });

	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaPerfis("pegaMenus()");
}
/*
Function: pegaMenus

Obt�m a lista de menus e monta os n�s principais da �rvore

<PEGAMENUS>
*/
function pegaMenus()
{
	try
	{YAHOO.util.Event.removeListener(YAHOO.admin.container.panelEditor.close, "click");}
	catch(e){}
	core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus2&idioma="+idiomaSel(),"montaArvore");
}
/*
Function: montaArvore

Monta a �rvore de temas

<PEGAGRUPOS>
*/
function montaArvore(dados)
{
	YAHOO.tree = new function()
	{
		tree = "";
		function changeIconMode()
		{
			buildTree();
		}
		function loadNodeData(node, fnLoadComplete)
		{
			if(node.data.id_menu == undefined){
				fnLoadComplete.call();
				return;
			}
			var sUrl = "../php/arvore.php?funcao=pegaGrupos&id_menu="+node.data.id_menu+"&idioma="+idiomaSel();
			var callback =
			{
				success: function(oResponse)
				{
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					montaNosGrupos(node.data.id_menu,node,dados,true);
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
			tree = new YAHOO.widget.TreeView("arvoreMenus");
			tree.setDynamicLoad(loadNodeData, 1);
			var root = tree.getRoot();
			var tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.isLeaf = true;
			core_carregando("desativa");
		}
		buildTree();
	}();
   	montaNosMenus(dados);
   	tree.draw();
}
function temaIconMode()
{
	var newVal = parseInt(this.value);
	if (newVal != currentIconMode)
	{currentIconMode = newVal;}
}
//
//adiciona os menus na �rvore
//
function montaNosMenus(dados,redesenha)
{
	//verifica se foi passado um id pela url
	var root = tree.getRoot(),
		tempNode = null;
	for (var i=0, j=dados.length; i<j; i++)
	{
		if($id_menu == "" || $id_menu == dados[i].id_menu){
			var cor = "";
			if(dados[i].publicado_menu == "NAO")
			cor = "style='color:red'";
			var conteudo = "<b>&nbsp;<span "+cor+" >"+dados[i].nome_menu+"</span>";
			var d = {html:conteudo,id_menu:dados[i].id_menu,tipo:"menu"};
			tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		}
	}
	if(redesenha){tree.draw();}
	if($id_menu !== "" && tempNode)
	{tempNode.expand();}
}
//
//adiciona os grupos em um menu
//
/*
Function: montaNosGrupos

Monta os n�s com os grupos e permite abrir os subgrupos

<PEGASUBGRUPOS>
*/
function montaNosGrupos(idmenu,no,dados,redesenha)
{
	var tempNodeR = null;
	//pega os temas que ficam na raiz da �rvore
	if(!tree.getNodeByProperty("etiquetaTemasRaiz","menu_"+idmenu))
	{montaTemasRaiz(no,dados,true);}
	//pega os grupos do menu
	if(idmenu == undefined)
	{return;}
	if(!tree.getNodeByProperty("etiquetaGrupo","menu_"+idmenu))
	{
		var temp = "menu_"+idmenu;
		var d = {tipo:"etiqueta","etiquetaGrupo":temp,html:"<i style=color:gray >Grupos</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		if($id_grupo !== "" || $id_menu !== "")
		{tempNodeR.expand();}
		var conteudo = "<span onclick=\"novoGrupo('"+idmenu+"')\" style=\"cursor:pointer;\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i style=color:gray > Adicionar um novo</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		if($id_grupo !== "")
		{tempNode.expand();}
	}
	for (var i=0, j=dados.grupos.length; i<j; i++)
	{
		if($id_grupo == "" || $id_grupo == dados.grupos[i].id_n1){
			var conteudo = montaConteudoNo(dados.grupos[i].id_n1,dados.grupos[i].publicado,dados.grupos[i].nome_grupo,"grupo");
			var d = {idmenu:idmenu,html:conteudo,id_n1:dados.grupos[i].id_n1,tipo:"grupo"};
			if(tempNodeR){
				var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
				tempNode.setDynamicLoad(loadSubgruposData, temaIconMode, idmenu);
				if($id_grupo !== "")
				{tempNode.expand();}
			}
		}
	}
	if(redesenha){tree.draw();}
}
function loadSubgruposData(node, fnLoadComplete)
{
	var idmenu = node.data.idmenu;
	var sUrl = "../php/arvore.php?funcao=pegaSubGrupos&id_n1="+node.data.id_n1+"&id_menu="+idmenu+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			montaNosSubgrupos(idmenu,node,dados,true);
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
function loadTemasData(node, fnLoadComplete)
{
	var idmenu = node.data.idmenu;
	var sUrl = "../php/arvore.php?funcao=pegaTemas&id_n2="+node.data.id_n2+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			montaTemas(idmenu,node,dados,false);
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

/*
Function: montaNosSubgrupos

Monta os n�s com os temas

<PEGATEMAS>
*/
function montaNosSubgrupos(idmenu,no,dados,redesenha)
{
	var tempNodeR = null;
	if(!tree.getNodeByProperty("etiquetaTemasGrupo","grupo_"+no.data.id_n1))
	montaTemasRaizGrupo(idmenu,no,dados,true);
	if(idmenu == undefined)
	{return;}
	if(!tree.getNodeByProperty("etiquetaTemasSubGrupo",no.data.id_n1))
	{
		var d = {tipo:"etiqueta",etiquetaTemasSubGrupo:no.data.id_n1,html:"<i style=color:gray >Sub-grupos</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		if($id_subgrupo !== "" || $id_grupo !== "")
		{tempNodeR.expand();}

		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"novoSubGrupo('"+idmenu+"','"+no.data.id_n1+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i style=color:gray > Adicionar um novo</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		if($id_subgrupo !== "")
		{tempNode.expand();}
	}
	for (var i=0, j=dados.subgrupos.length; i<j; i++)
	{
		if(tempNodeR && $id_subgrupo == "" || $id_subgrupo == dados.subgrupos[i].id_n2){
			var conteudo = montaConteudoNo(dados.subgrupos[i].id_n2,dados.subgrupos[i].publicado,dados.subgrupos[i].nome_subgrupo,"subgrupo");
			var d = {idmenu:idmenu,html:conteudo,id_n2:dados.subgrupos[i].id_n2,tipo:"subgrupo"};
			var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
			tempNode.setDynamicLoad(loadTemasData, temaIconMode);
			if($id_subgrupo !== "")
			{tempNode.expand();}
		}
	}
	if(redesenha){tree.draw();}
}
function montaTemas(idmenu,no,dados,redesenha)
{
	var tempNodeR = null;
	if(!tree.getNodeByProperty("etiquetaTemas",no.data.id_n2))
	{
		var d = {tipo:"etiqueta",etiquetaTemas:no.data.id_n2,html:"<i style=color:gray >Temas</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		var conteudo = "<span onclick=\"novoTema('"+idmenu+"','"+no.data.id_n2+"')\" style=\"cursor:pointer;\"><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i style=color:gray > Adicionar um novo</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = montaConteudoNo(dados[i].id_n3,dados[i].publicado,dados[i].nome_tema,"tema");
		var d = {html:conteudo,id_n3:dados[i].id_n3,tipo:"tema"};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
function montaConteudoNo(id,publicado,nome,tipo){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','"+tipo+"','"+id+"')\" title=sobe src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','"+tipo+"','"+id+"')\" title=desce src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('"+tipo+"','"+id+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('"+tipo+"','"+id+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;";
	var cor = "";
	if(publicado == "NAO")
	{cor = "style='color:red'";}
	if(nome)
	conteudo += "<span "+cor+" >"+nome+"<span style='color:gray'> id: "+id+"</span></span>";
	else
	conteudo += "<span "+cor+" > ??? vc precisa editar esse n�</span>";
	return conteudo;
}
function montaTemasRaiz(no,dados,redesenha)
{
	var resultado = new Array(),
	tempNodeR = null;
	if(no.data.id_menu == undefined)
	{return;}
	if(!tree.getNodeByProperty("etiquetaTemasRaiz","menu_"+no.data.id_menu))
	{
		var temp = "menu_"+no.data.id_menu;
		var d = {id_menu:no.data.id_menu,tipo:"etiqueta",etiquetaTemasRaiz:temp,html:"<i style=color:gray >Temas na raiz do menu</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		var d = {tipo:"etiqueta",html:"<span style=\"cursor:pointer;\" onclick=\"novoTemaRaiz('"+no.data.id_menu+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i style=color:gray >Adicionar um novo</i></span>"};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.raiz.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','raizmenu','"+dados.raiz[i].id_raiz+"')\" title=sobe src=\"../imagens/34.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','raizmenu','"+dados.raiz[i].id_raiz+"')\" title=desce src=\"../imagens/33.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('raizmenu','"+dados.raiz[i].id_raiz+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('raizmenu','"+dados.raiz[i].id_raiz+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados.raiz[i].nome_tema+"</span>";
		var d = {html:conteudo,id_raiz:dados.raiz[i].id_raiz,tipo:"raizmenu"};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
		resultado.push(tempNode);
	}
	return resultado;
}
function montaTemasRaizGrupo(idmenu,no,dados,redesenha)
{
	var resultado = new Array(),
	tempNodeR = null;
	if(no.data.id_n1 == undefined)
	{return;}
	if(!tree.getNodeByProperty("etiquetaTemasGrupo","grupo_"+no.data.id_n1))
	{
		var temp = "grupo_"+no.data.id_n1;
		var d = {etiquetaTemasGrupo:temp,tipo:"etiqueta",html:"<i style=color:gray >Temas na raiz do grupo:</i>"};
		tempNodeR = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNodeR.isLeaf = false;
		var d = {tipo:"etiqueta",html:"<span onclick=\"novoTemaRaizGrupo('"+idmenu+"','"+no.data.id_n1+"')\" style=\"cursor:pointer;\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i style=color:gray >Adicionar um novo</i></span>"};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.raiz.length; i<j; i++)
	{
		var conteudo = montaConteudoNo(dados.raiz[i].id_raiz,"SIM",dados.raiz[i].nome_tema,"raizgrupo");
		var d = {html:conteudo,id_raiz:dados.raiz[i].id_raiz,tipo:"raizgrupo"};
		var tempNode = new YAHOO.widget.HTMLNode(d, tempNodeR,false,true);
		tempNode.isLeaf = true;
		resultado.push(tempNode);
	}
	return resultado;
}
/*
Function: novoTemaRaiz

Adiciona um novo tema na raiz de um menu

<ADICIONARTEMARAIZ>
*/
function novoTemaRaiz(id)
{
	core_carregando("ativa");
	var mensagem = " adicionando tema...";
	core_carregando(mensagem);
	var no = tree.getNodeByProperty("etiquetaTemasRaiz","menu_"+id);
	var sUrl = "../php/arvore.php?funcao=adicionarTemaRaiz&id_menu="+id+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			dados = dados.raiz[0];
			var conteudo = montaConteudoNo(dados.id_raiz,"SIM","","raizmenu");
			var d = {html:conteudo,id_raiz:dados.id_raiz,tipo:"raizmenu"};
			var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
			tempNode.isLeaf = true;
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: novoTemaRaizGrupo

Adiciona um novo tema na raiz de um grupo

<ADICIONARTEMARAIZGRUPO>
*/
function novoTemaRaizGrupo(idmenu,id)
{
	core_carregando("ativa");
	var mensagem = " adicionando tema...";
	core_carregando(mensagem);
	var no = tree.getNodeByProperty("etiquetaTemasGrupo","grupo_"+id);
	var sUrl = "../php/arvore.php?funcao=adicionarTemaRaizGrupo&id_n1="+id+"&id_menu="+idmenu+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			dados = dados.raiz[0];
			var conteudo = montaConteudoNo(dados.id_raiz,"SIM","","raizgrupo");
			var d = {html:conteudo,id_raiz:dados.id_raiz,tipo:"raizgrupo"};
			var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
			tempNode.isLeaf = true;
			tree.draw();
			core_carregando("desativa");
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: novoGrupo

Adiciona um novo grupo em um menu

<ADICIONARGRUPO>
*/
function novoGrupo(id_menu)
{
	core_carregando("ativa");
	var mensagem = " adicionando grupo...";
	core_carregando(mensagem);
	var sUrl = "../php/arvore.php?funcao=adicionarGrupo&id_menu="+id_menu+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var no = tree.getNodeByProperty("etiquetaGrupo","menu_"+id_menu);
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			dados = dados.grupos[0];
			var conteudo = montaConteudoNo(dados.id_n1,"NAO","","grupo");
			var d = {idmenu:id_menu,html:conteudo,id_n1:dados.id_n1,tipo:"grupo"};
			var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
			tempNode.isLeaf = false;
			tempNode.setDynamicLoad(loadSubgruposData, temaIconMode, id_menu);
			tree.draw();
			core_carregando("desativa");
			editar('grupo',dados.id_n1);
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: novoSubGrupo

Adiciona um novo subgrupo em um grupo

<ADICIONARSUBGRUPO>
*/
function novoSubGrupo(id_menu,id_n1)
{
	core_carregando("ativa");
	var mensagem = " adicionando Sub-grupo...";
	core_carregando(mensagem);
	var sUrl = "../php/arvore.php?funcao=adicionarSubGrupo&id_n1="+id_n1+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var no = tree.getNodeByProperty("etiquetaTemasSubGrupo",id_n1);
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			dados = dados.subgrupos[0];
			var conteudo = montaConteudoNo(dados.id_n2,dados.publicado,"","subgrupo");
			var d = {idmenu:id_menu,html:conteudo,id_n2:dados.id_n2,tipo:"subgrupo"};
			var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
			tempNode.isLeaf = false;
			tempNode.setDynamicLoad(loadTemasData, temaIconMode, id_menu);
			tree.draw();
			core_carregando("desativa");
			editar("subgrupo",dados.id_n2);
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: novoTema

Adiciona um novo tema

<ADICIONARTEMA>
*/
function novoTema(id_menu,id_n2)
{
	core_carregando("ativa");
	var mensagem = " adicionando tema...";
	core_carregando(mensagem);
	var sUrl = "../php/arvore.php?funcao=adicionarTema&id_n2="+id_n2+"&idioma="+idiomaSel();
	var callback =
	{
		success: function(oResponse)
		{
			var no = tree.getNodeByProperty("etiquetaTemas",id_n2);
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			dados = dados[0];
			var conteudo = montaConteudoNo(dados.id_n3,dados.publicado,"","tema");
			var d = {idmenu:id_menu,html:conteudo,id_n3:dados.id_n3,tipo:"tema"};
			var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
			tempNode.isLeaf = true;
			tree.draw();
			core_carregando("desativa");
			editar('tema',dados.id_n3);
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
function excluir(tipo,id)
{
	var mensagem = " excluindo o registro do id= "+id,
		no = null,
		sUrl = null;
	if(tipo == "raizgrupo" || tipo == "raizmenu")
	{
		no = tree.getNodeByProperty("id_raiz",id);
		sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_raiz&idioma="+idiomaSel();
	}

	if(tipo == "grupo")
	{
		no = tree.getNodeByProperty("id_n1",id);
		sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_n1&idioma="+idiomaSel();
	}
	if(tipo == "subgrupo")
	{
		no = tree.getNodeByProperty("id_n2",id);
		sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_n2&idioma="+idiomaSel();
	}
	if(tipo == "tema")
	{
		no = tree.getNodeByProperty("id_n3",id);
		sUrl = "../php/arvore.php?funcao=excluir&id="+id+"&tabela=i3geoadmin_n3&idioma="+idiomaSel();
	}
	if(no && sUrl)
	{core_excluiNoTree(sUrl,no,mensagem);}
}
function editar(tipo,id)
{
	core_carregando("ativa");
	core_carregando(" buscando dados");
	var sUrl = null;
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(tipo == "grupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('grupo','"+id+"')");
					$i("editor_bd").innerHTML = montaDivGrupo(dados);
					core_comboGrupos("comboGrupo","Eid_grupo",dados.id_grupo,"");
					core_comboPerfis("comboPerfil","Eperfil_grupo","","registraPerfil(this.value,\"En1_perfil\")");
				}
				if(tipo == "subgrupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('subgrupo','"+id+"')");
					$i("editor_bd").innerHTML = montaDivSubGrupo(dados);
					core_comboSubGrupos("comboSubGrupo","Eid_subgrupo",dados.id_subgrupo,"");
					core_comboPerfis("comboPerfil","Eperfil_subgrupo","","registraPerfil(this.value,\"En2_perfil\")");
				}
				if(tipo == "tema")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('tema','"+id+"')");
					$i("editor_bd").innerHTML = montaDivTema(dados);
					core_comboTemas("comboTema","Eid_tema",dados.id_tema,"");
					core_comboPerfis("comboPerfil","Eperfil_tema","","registraPerfil(this.value,\"En3_perfil\")");
				}
				if(tipo == "raizmenu" || tipo == "raizgrupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('"+tipo+"','"+id+"')");
					$i("editor_bd").innerHTML = montaDivRaiz(dados);
					core_comboTemas("comboTema","Eid_tema",dados.id_tema,"");
					core_comboPerfis("comboPerfil","Eperfil","","registraPerfil(this.value,\"Eperfil\")");
				}
				core_carregando("desativa");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	if(tipo == "grupo")
	{sUrl = "../php/arvore.php?funcao=pegaDadosGrupo&id="+id+"&idioma="+idiomaSel();}
	if(tipo == "subgrupo")
	{sUrl = "../php/arvore.php?funcao=pegaDadosSubGrupo&id="+id+"&idioma="+idiomaSel();}
	if(tipo == "tema")
	{sUrl = "../php/arvore.php?funcao=pegaDadosTema&id="+id+"&idioma="+idiomaSel();}
	if(tipo == "raizmenu" || tipo == "raizgrupo")
	{sUrl = "../php/arvore.php?funcao=pegaDadosRaiz&id="+id+"&idioma="+idiomaSel();}
	if(sUrl)
	{core_makeRequest(sUrl,callback);}
}
function montaDivGrupo(i)
{
	var ins = "<br>Escolha o grupo para esse n�:<br><br>";
	ins += "<div id=comboGrupo >Buscando...</div>";
	ins += "<p>Perfis que podem ver: </p>";
	ins += "<input size=50 type=text id='En1_perfil' value='"+i.n1_perfil+"' /></p>";
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br>Publicado?<br>";
	ins += "<select id='Epublicado' >";
	ins += core_combosimnao(i.publicado);
	ins += "</select>";
	ins += "<br><br><br><br>";
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />";
	return(ins);
}
function montaDivSubGrupo(i)
{
	var ins = "<br>Escolha o sub-grupo para esse n�:<br><br>";
	ins += "<div id=comboSubGrupo >Buscando...</div>";
	ins += "<p>Perfis que podem ver: </p>";
	ins += "<input size=50 type=text id='En2_perfil' value='"+i.n2_perfil+"' /></p>";
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br>Publicado?<br>";
	ins += "<select id='Epublicado' >";
	ins += core_combosimnao(i.publicado);
	ins += "</select>";
	ins += "<br><br><br><br>";
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />";
	return(ins);
}
function montaDivTema(i)
{
	var ins = "<br>Escolha o tema para esse n�:<br><br>";
	ins += "<div id=comboTema >Buscando...</div>";
	ins += "<p>Perfis que podem ver: </p>";
	ins += "<input type=text id='En3_perfil' value='"+i.n3_perfil+"' /></p>";
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br>Publicado?<br>";
	ins += "<select id='Epublicado' >";
	ins += core_combosimnao(i.publicado);
	ins += "</select>";
	ins += "<br>Ordem<br>";
	ins += "<input size=10 type=text value="+i.ordem+" id='Eordem' />";;
	return(ins);
}
function montaDivRaiz(i)
{
	var ins = "<br>Tema:<br><br>";
	ins += "<div id=comboTema >Buscando...</div>";
	ins += "<p>Perfis que podem ver: </p>";
	ins += "<input size=50 type=text id='Eperfil' value='"+i.perfil+"' /></p>";
	ins += "<div id=comboPerfil >Buscando...</div>";
	ins += "<br><br>Para criar um novo mapfile clique <a href='../html/editormapfile.html' target=_blank >aqui</a>.";
	ins += "<br><br>Para criar um novo perfil clique <a href='../html/perfis.html' target=_blank >aqui</a>.";
	ins += "<input type=hidden value="+i.ordem+" id='Eordem' />";
	return(ins);
}
function registraPerfil(valor,id)
{
	var inp = $i(id);
	var perfis = inp.value;
	if(perfis == "")
	inp.value = valor;
	else
	inp.value = perfis+" "+valor;
}
/*
Function: gravaDados

Altera dados de um n�

<ALTERARGRUPO>

<ALTERARSUBGRUPO>

<ALTERARTEMA>

<ALTERARRAIZ>
*/
function gravaDados(tipo,id)
{
	var campos = [];
	var par = null;
	var prog = null;
	if(tipo == "grupo")
	{
		campos = new Array("id_grupo","n1_perfil","publicado","ordem");
		par = "&id="+id;
		prog = "../php/arvore.php?funcao=alterarGrupo&idioma="+idiomaSel();
	}
	if(tipo == "subgrupo")
	{
		campos = new Array("id_subgrupo","n2_perfil","publicado","ordem");
		par = "&id="+id;
		prog = "../php/arvore.php?funcao=alterarSubGrupo&idioma="+idiomaSel();
	}
	if(tipo == "tema")
	{
		campos = new Array("id_tema","n3_perfil","publicado","ordem");
		par = "&id="+id;
		prog = "../php/arvore.php?funcao=alterarTema&idioma="+idiomaSel();
	}
	if(tipo == "raizmenu" || tipo == "raizgrupo")
	{
		campos = new Array("id_tema","perfil","ordem");
		par = "&id="+id;
		prog = "../php/arvore.php?funcao=alterarRaiz&idioma="+idiomaSel();
	}
	for (var i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i("E"+campos[i]).value);}
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
  					core_carregando("<span style=color:red >N�o foi poss�vel excluir. Verifique se n�o existem menus vinculados a este tema</span>");
  					setTimeout("core_carregando('desativa')",3000);
  				}
  				else
  				{
  					if(tipo == "grupo")
  					{
  						var texto = obj.options[obj.selectedIndex].text;
  						var objpub = document.getElementById("Epublicado");
  						var publicado = objpub.options[objpub.selectedIndex].value;
  						var no = tree.getNodeByProperty("id_n1",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto;

  						if(publicado == "NAO")
  						no.getContentEl().getElementsByTagName("span")[0].style.color = "red";
  						else
  						no.getContentEl().getElementsByTagName("span")[0].style.color = "black";

  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "subgrupo")
  					{
  						var texto = obj.options[obj.selectedIndex].text;

  						var objpub = document.getElementById("Epublicado");
  						var publicado = objpub.options[objpub.selectedIndex].value;

  						var no = tree.getNodeByProperty("id_n2",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto;

  						if(publicado == "NAO")
  						no.getContentEl().getElementsByTagName("span")[0].style.color = "red";
  						else
  						no.getContentEl().getElementsByTagName("span")[0].style.color = "black";

  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "tema")
  					{
  						var texto = obj.options[obj.selectedIndex].text;

  						var objpub = document.getElementById("Epublicado");
  						var publicado = objpub.options[objpub.selectedIndex].value;

  						var no = tree.getNodeByProperty("id_n3",id);

  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto;

  						if(publicado == "NAO")
  						no.getContentEl().getElementsByTagName("span")[0].style.color = "red";
  						else
  						no.getContentEl().getElementsByTagName("span")[0].style.color = "black";

  						no.html = no.getContentEl().innerHTML;
  					}
					if(tipo == "raizmenu" || tipo == "raizgrupo")
  					{
  						var texto = obj.options[obj.selectedIndex].text;
  						var no = tree.getNodeByProperty("id_raiz",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = texto;
  						no.html = no.getContentEl().innerHTML;
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
	core_makeRequest(sUrl,callback,'POST');
}
function sobeDesce(movimento,tipo,id)
{
	var no = null,
		movimenta = null;
	if(tipo == "raizmenu" || tipo == "raizgrupo")
	{
		no = tree.getNodeByProperty("id_raiz",id);
		movimenta = core_movimentaNo(movimento,no);
	}
	if(tipo == "grupo")
	{
		no = tree.getNodeByProperty("id_n1",id);
		movimenta = core_movimentaNo(movimento,no);
	}
	if(tipo == "subgrupo")
	{
		no = tree.getNodeByProperty("id_n2",id);
		movimenta = core_movimentaNo(movimento,no);
	}
	if(tipo == "tema")
	{
		no = tree.getNodeByProperty("id_n3",id);
		movimenta = core_movimentaNo(movimento,no);
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
		var sUrl = "../php/arvore.php?funcao=movimentaNo&tipo="+tipo+"&movimento="+movimento+"&id="+id+"&idioma="+idiomaSel();
		core_carregando("ativa");
		core_carregando(" modificando a ordem no banco de dados");
		core_makeRequest(sUrl,callback);
	}
}