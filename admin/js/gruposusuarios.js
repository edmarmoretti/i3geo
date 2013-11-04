/*
Title: gruposusuarios.js

Fun&ccedil;&otilde;es que controlam o cadastro de grupos de usuarios

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

i3geo/admin/js/gruposusuarios.js
*/
YAHOO.namespace("admin.container");
/*
Function: initMenu

Inicializa o editor
*/
function initMenu(){
	ativaBotaoAdicionaGrupo("../php/gruposusuarios.php?funcao=alterarGrupos","adiciona");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaGrupos();
}
function ativaBotaoAdicionaGrupo(sUrl,idBotao){
	var adiciona = function()
	{
		core_carregando("ativa");
		core_carregando(" adicionando um novo registro");
		var callback =
		{
				success:function(o)
				{
					try
					{
						var j = YAHOO.lang.JSON.parse(o.responseText);
					adicionaNosGrupos(j,true);
					editar("grupo",j[j.length-1].id_grupo);
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
	new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
}
function pegaGrupos(){
	core_pegaDados("buscando usu&aacute;rios...","../php/gruposusuarios.php?funcao=pegaGrupos","montaArvore");
}
/*
Function: montaArvore

Monta a &aacute;rvore de edi&ccedil;&atilde;o

<PEGAPRANCHAS>
*/
function montaArvore(dados){
	YAHOO.example.treeExample = new function()	{
		tree = "";
		function changeIconMode(){
			buildTree();
		}
		function loadNodeData(node, fnLoadComplete){
			var sUrl = "../php/gruposusuarios.php?funcao=pegaUsuariosGrupo&id_grupo="+node.data.id_grupo;
			var callback = {
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosUsuarios(node,dados,false);
					oResponse.argument.fnLoadComplete();
				},
				failure: function(oResponse){
					oResponse.argument.fnLoadComplete();
				},
				argument:{
					"node": node,
					"fnLoadComplete": fnLoadComplete
				},
				timeout: 25000
			};
			YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
		}
		function buildTree(){
			tree = new YAHOO.widget.TreeView("tabela");
			tree.setDynamicLoad(loadNodeData, 1);
			var root = tree.getRoot();
			var tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.enableHighlight = false;
			tempNode.isLeaf = true;
			core_carregando("desativa");
		}
		buildTree();
	}();
		adicionaNosGrupos(dados);
		tree.draw();
}
function adicionaNosUsuarios(no,dados,redesenha)
{
	function temaIconMode(){
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
	if(!redesenha){
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"editar('usuario','"+no.data.id_grupo+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar novo usu&aacute;rio</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	for (var i=0, j=dados.length; i<j; i++){
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('usuario','"+dados[i].id_grupo+"','"+dados[i].id_usuario+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		if(dados[i].nome != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].login+"</b></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o papel!!!</span>";}
		var d = {html:conteudo,id_nousuario:dados[i].id_usuario+"_"+dados[i].id_grupo,tipo:"usuario"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosGrupos(dados,redesenha){
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++){
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('grupo','"+dados[i].id_grupo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('grupo','"+dados[i].id_grupo+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nome && dados[i].nome != "")
		{conteudo += "&nbsp;<span>"+dados[i].nome+" id: "+dados[i].id_grupo+"</span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o grupo!!!</span>";}
		var d = {html:conteudo,id_grupo:dados[i].id_grupo,tipo:"grupo"};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
/*
Function: editar

Abre o editor de um nó
*/
function editar(tipo,id){
	core_carregando("ativa");
	core_carregando(" buscando dados");
	var sUrl = null;
	var callback =	{
		success:function(o)		{
			try			{
				if(tipo == "grupo")				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("","450px","280px","","Grupo");
					montaDivGrupo(dados);
					core_carregando("desativa");
				}
				if(tipo == "usuario")				{
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('usuario','"+id+"')","250px","100px");
					$i("editor_bd").innerHTML = montaDivUsuario(dados);
					document.getElementById("Eid_usuario").style.width = "200px";
					core_carregando("desativa");
				}
				core_carregando("desativa");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	if(tipo == "grupo")
	{sUrl = "../php/gruposusuarios.php?funcao=pegaDadosGrupo&id_grupo="+id;}
	if(tipo == "usuario")
	{sUrl = "../php/gruposusuarios.php?funcao=listaUsuarios";}
	if(sUrl)
	{core_makeRequest(sUrl,callback);}
}
function montaDivGrupo(i){
	var param = {
		"linhas":[
				{titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
				{titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditorGrupo />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	var temp = function()
	{gravaDados('grupo',i.id_grupo);};
	new YAHOO.widget.Button("salvarEditorGrupo",{ onclick: { fn: temp }});
}
function montaDivUsuario(dados){
	var ins = "<p><select id='Eid_usuario' >";
	ins += core_comboObjeto(dados,"id_usuario","login","","ativo");
	ins += "</select>";
	return(ins);
}
/*
Function: excluir

Exclui um elemento do atlas

<EXCLUIRATLAS>

<EXCLUIRPRANCHA>

<EXCLUIRTEMA>
*/
function excluir(tipo,id_grupo,id_usuario)
{
	var mensagem = " excluindo o registro do usu&aacute;rio= "+id_usuario;
	var no = null;
	var sUrl = null;
	if(tipo == "grupo")	{
		no = tree.getNodeByProperty("id_grupo",id_grupo);
		sUrl = "../php/gruposusuarios.php?funcao=excluirGrupo&id_grupo="+id_grupo;
	}
	if(tipo == "usuario")	{
		no = tree.getNodeByProperty("id_nousuario",id_usuario+"_"+id_grupo);
		sUrl = "../php/gruposusuarios.php?funcao=excluirUsuarioGrupo&id_grupo="+id_grupo+"&id_usuario="+id_usuario;
	}
	if(sUrl)
	{core_excluiNoTree(sUrl,no,mensagem);}
}
/*
Function: gravaDados

Altera dados de um elemento do Atlas

<ALTERARATLAS>

<ALTERARPRANCHA>

<ALTERARTEMA>
*/
function gravaDados(tipo,id){
	var campos = null;
	var par = null;
	var prog = null;
	if(tipo == "grupo"){
		campos = new Array("nome","descricao");
		par = "&id_grupo="+id;
		prog = "../php/gruposusuarios.php?funcao=alterarGrupos";
	}
	if(tipo == "usuario"){
		campos = new Array("id_usuario");
		par = "&id_grupo="+id;
		prog = "../php/gruposusuarios.php?funcao=adicionaUsuarioGrupo";
	}
	for (var i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i("E"+campos[i]).value);}

	var callback = {
			success:function(o){
				try	{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
						core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem menus vinculados a este tema</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else{
						if(tipo == "grupo"){
							var no = tree.getNodeByProperty("id_grupo",id);
							no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Enome").value+" id:"+id;
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
							no.html = no.getContentEl().innerHTML;
						}
						if(tipo == "usuario"){
							var no = tree.getNodeByProperty("id_grupo",id);
							adicionaNosUsuarios(no,YAHOO.lang.JSON.parse(o.responseText),true);
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
	if(prog && par){
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		var sUrl = prog+par;
		core_makeRequest(sUrl,callback,'POST');
	}
}