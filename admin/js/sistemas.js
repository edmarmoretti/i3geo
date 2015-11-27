/*
Title: sistemas.js

Fun&ccedil;&otilde;es que controlam a interface do editor de sistemas

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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/sistemas.js
*/
YAHOO.namespace("admin.container");
/*
Function: initMenu

Inicializa o editor

<ALTERARSISTEMAS>
*/
function initMenu()
{
	ativaBotaoAdicionaRaiz("../php/sistemas.php?funcao=alterarSistemas","adiciona");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaPerfis("pegaSistemas()");
}
function ativaBotaoAdicionaRaiz(sUrl,idBotao)
{
	var botao, adiciona = function()
	{
		core_carregando("ativa");
		core_carregando($trad("msgNovoRegistro",i3GEOadmin.core.dicionario));
		var callback =
		{
				success:function(o)
				{
					try
					{
						adicionaNosRaiz(YAHOO.lang.JSON.parse(o.responseText),true);
						core_carregando("desativa");
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	botao = new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
	botao.addClass("rodar");
}
/*
Function: pegaSistemas

Obt&eacute;m a lista de sistemas

<PEGASISTEMAS>
*/
function pegaSistemas()
{
	core_pegaDados($trad("msgBuscaSistema",i3GEOadmin.sistemas.dicionario),"../php/sistemas.php?funcao=pegaSistemas","montaArvore");
}
/*
Function: montaArvore

Monta a &aacute;rvore de edi&ccedil;&atilde;o

<PEGAFUNCOES>
*/
function montaArvore(dados)
{
	YAHOO.example.treeExample = new function()
	{
		tree = "";
		function changeIconMode()
		{
			buildTree();
		}
		function loadNodeData(node, fnLoadComplete)
		{
			var sUrl = "../php/sistemas.php?funcao=pegaFuncoes&id_sistema="+node.data.id_sistema;
			var callback =
			{
				success: function(oResponse)
				{
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNos(node,dados,false);
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
			var tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.isLeaf = true;
			tempNode.enableHighlight = false;
			core_carregando("desativa");
		}
		buildTree();
	}();
		adicionaNosRaiz(dados);
		tree.draw();
}
function adicionaNos(no,dados,redesenha)
{
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('funcao','"+dados[i].id_funcao+"')\" title="+ $trad('excluir',i3GEOadmin.core.dicionario) +" width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('funcao','"+dados[i].id_funcao+"')\" title="+ $trad('editar',i3GEOadmin.core.dicionario) +" width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados[i].nome_funcao+"</span>";
		var d = {html:conteudo,id_funcao:dados[i].id_funcao,tipo:"funcao"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosRaiz(dados,redesenha)
{
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"excluir('sistema','"+dados[i].id_sistema+"')\" title="+ $trad('excluir',i3GEOadmin.core.dicionario) +" src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"adicionarFuncao('"+dados[i].id_sistema+"')\" title="+ $trad('adicionaFuncao',i3GEOadmin.sistemas.dicionario) +" src=\"../imagens/05.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('sistema','"+dados[i].id_sistema+"')\" title="+ $trad('editar',i3GEOadmin.core.dicionario) +" src=\"../imagens/06.png\" /><b>&nbsp;<span>"+dados[i].nome_sistema+"</span>";
		var d = {html:conteudo,id_sistema:dados[i].id_sistema,tipo:"sistema"};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
/*
Function: editar

Monta o editor espec&iacute;fico de um no

<PEGAFUNCAO>

<PEGASISTEMA>
*/
function editar(tipo,id)
{
	if(tipo == "funcao")
	{
		core_carregando("ativa");
		core_carregando($trad("msgBuscaDados",i3GEOadmin.core.dicionario));
		var callback =
		{
			success:function(o)
			{
				try
				{
					montaEditorFuncoes(YAHOO.lang.JSON.parse(o.responseText)[0],id);
					core_carregando("desativa");
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		var sUrl = "../php/sistemas.php?funcao=pegaFuncao&id_funcao="+id;
		core_makeRequest(sUrl,callback);
	}
	if(tipo == "sistema")
	{
		core_carregando("ativa");
		core_carregando($trad("msgBuscaDados",i3GEOadmin.core.dicionario));
		var callback =
		{
			success:function(o)
			{
				try
				{
					montaEditorSistemas(YAHOO.lang.JSON.parse(o.responseText)[0],id);
					core_carregando("desativa");
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		var sUrl = "../php/sistemas.php?funcao=pegaSistema&id_sistema="+id;
		core_makeRequest(sUrl,callback);
	}
}
function montaEditorSistemas(dados,id)
{
	core_montaEditor("gravaDadosSistema('"+id+"')","","","",$trad("sistema",i3GEOadmin.sistemas.dicionario),true,true,false);
	$i("editor_bd").innerHTML = montaDivSistemas(dados);
	core_carregando("desativa");
	core_comboPerfis("comboPerfis","selPerfil","","registraPerfil(this.value,\"Eperfil_sistema\")");
}
function montaEditorFuncoes(dados,id)
{
	core_montaEditor("gravaDadosFuncao('"+id+"')","","","",$trad("funcao",i3GEOadmin.sistemas.dicionario),true,true,false);
	$i("editor_bd").innerHTML = montaDivFuncoes(dados);
	core_carregando("desativa");
	core_comboPerfis("comboPerfis","selPerfil","","registraPerfil(this.value,\"Eperfil_funcao\")");
}
function registraPerfil(valor,id)
{
	var inp = $i(id);
	var tags = inp.value;
	if(tags == "")
	inp.value = valor;
	else
	inp.value = tags+" "+valor;
}
function montaDivSistemas(i)
{
	var param =
	{
		"linhas":[
		{titulo:$trad("nome",i3GEOadmin.sistemas.dicionario),id:"Enome_sistema",size:"50",value:i.nome_sistema,tipo:"text",div:""},
		{titulo:$trad("perfil",i3GEOadmin.sistemas.dicionario),id:"Eperfil_sistema",size:"50",value:i.perfil_sistema,tipo:"text",div:"<div id=comboPerfis >Buscando...</div>"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br>"+ $trad("publicado",i3GEOadmin.sistemas.dicionario) +"<br>";
	ins += "<select id='Epublicado_sistema' >";
	ins += core_combosimnao(i.publicado_sistema);
	ins += "</select>";
	return(ins);
}
function montaDivFuncoes(i)
{
	var param =
	{
		"linhas":[
		{titulo:$trad("publicado",i3GEOadmin.sistemas.dicionario),id:"Enome_funcao",size:"50",value:i.nome_funcao,tipo:"text",div:""},
		{titulo:$trad("programa",i3GEOadmin.sistemas.dicionario),id:"Eabrir_funcao",size:"50",value:i.abrir_funcao,tipo:"text",div:""},
		{titulo:$trad("largura",i3GEOadmin.sistemas.dicionario),id:"Ew_funcao",size:"5",value:i.w_funcao,tipo:"text",div:""},
		{titulo:$trad("altura",i3GEOadmin.sistemas.dicionario),id:"Eh_funcao",size:"5",value:i.h_funcao,tipo:"text",div:""},
		{titulo:$trad("perfilLista",i3GEOadmin.sistemas.dicionario),id:"Eperfil_funcao",size:"50",value:i.perfil_funcao,tipo:"text",div:"<div id=comboPerfis >Buscando...</div>"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	return(ins);
}
/*
Function: excluir

Exclui um no espec&iacute;fico

<EXCLUIRSISTEMA>

<EXCLUIRFUNCAO>
*/
function excluir(tipo,id)
{
	var mensagem = $trad("msgExclui",i3GEOadmin.core.dicionario)+id;
	var no = "", sUrl = "";
	if(tipo == "sistema")
	{
		no = tree.getNodeByProperty("id_sistema",id);
		sUrl = "../php/sistemas.php?funcao=excluirSistema&id="+id+"&tabela=sistemas";
	}
	if(tipo == "funcao")
	{
		no = tree.getNodeByProperty("id_funcao",id);
		sUrl = "../php/sistemas.php?funcao=excluirFuncao&id="+id+"&tabela=funcoes";
	}
	core_excluiNoTree(sUrl,no,mensagem);
}
/*
Function: adicionarFuncao

Adiciona uma nova fun&ccedil;&atilde;o

<ALTERARFUNCOES>
*/
function adicionarFuncao(id)
{
	var no = tree.getNodeByProperty("id_sistema",id);
	var sUrl = "../php/sistemas.php?funcao=alterarFuncoes&id_sistema="+id;
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			adicionaNos(no,dados,true);
		},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};

	core_makeRequest(sUrl,callback);
}
/*
Function: gravaDadosFuncao

Altera uma fun&ccedil;&atilde;o

<ALTERARFUNCOES>
*/
function gravaDadosFuncao(id)
{
	var campos = new Array("perfil","w","h","abrir","nome");
	var par = "";
	for (var i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"_funcao="+($i("E"+campos[i]+"_funcao").value);}
	par += "&id_funcao="+id;
	core_carregando("ativa");
	core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
	var sUrl = "../php/sistemas.php?funcao=alterarFuncoes"+par;
	var callback =
	{
			success:function(o)
			{
				try
				{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
					{
						core_carregando("<span style=color:red >"+ $trad("msgNaoExclui",i3GEOadmin.sistemas.dicionario) +"</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else
					{
						var no = tree.getNodeByProperty("id_funcao",id);
						no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Enome_funcao").value;
						no.html = no.getContentEl().innerHTML;
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
	core_makeRequest(sUrl,callback);
}
/*
Function: gravaDadosSistema

Altera um sistema

<ALTERARSISTEMAS>
*/
function gravaDadosSistema(id)
{
	var campos = new Array("perfil","nome","publicado");
	var par = "";
	for (var i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"_sistema="+($i("E"+campos[i]+"_sistema").value);}
	par += "&id_sistema="+id;
	core_carregando("ativa");
	core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
	var sUrl = "../php/sistemas.php?funcao=alterarSistemas"+par;
	var callback =
	{
			success:function(o)
			{
				try
				{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
					{
						core_carregando("<span style=color:red >"+ $trad("msgNaoExclui",i3GEOadmin.sistemas.dicionario) +"</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else
					{
						var no = tree.getNodeByProperty("id_sistema",id);
						no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Enome_sistema").value;
						no.html = no.getContentEl().innerHTML;
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
	core_makeRequest(sUrl,callback);
}
