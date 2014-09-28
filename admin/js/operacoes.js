/*
Title: operacoes.js

Fun&ccedil;&otilde;es que controlam o cadastro de funcionalidades

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

i3geo/admin/js/operacoes.js
*/
YAHOO.namespace("admin.container");
/*
Function: initMenu

Inicializa o editor
*/
function initMenu(){
	ativaBotaoAdicionaOperacao("../php/operacoes.php?funcao=alterarOperacoes","adiciona");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaOperacoes();
}
function ativaBotaoAdicionaOperacao(sUrl,idBotao){
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
					adicionaNosOperacoes(j,true);
					editar("operacoes",j[j.length-1].id_operacao);
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
/*
Function: pegaOperacoes

Obt&eacute;m a lista de atlas

<PEGAATLAS>
*/
function pegaOperacoes(){
	core_pegaDados("buscando opera&ccedil;&otilde;es...","../php/operacoes.php?funcao=pegaOperacoes","montaArvore");
}
/*
Function: montaArvore

Monta a &aacute;rvore de edi&ccedil;&atilde;o

<PEGAPRANCHAS>
*/
function montaArvore(dados){
	YAHOO.example.treeExample = new function()
	{
		tree = "";
		function changeIconMode()
		{
			buildTree();
		}
		function loadNodeData(node, fnLoadComplete){
			var sUrl = "../php/operacoes.php?funcao=pegaPapeisOperacao&id_operacao="+node.data.id_operacao;
			var callback = {
				success: function(oResponse){
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosPapeis(node,dados,false);
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
			tempNode.isLeaf = true;
			tempNode.enableHighlight = false;
			core_carregando("desativa");
		}
		buildTree();
	}();
		adicionaNosOperacoes(dados);
		tree.draw();
}
/*
Function: adicionaNosPapeis

Mostra os nós de uma operacao

<PEGATEMAS>
*/
function adicionaNosPapeis(no,dados,redesenha)
{
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
	if(!redesenha)
	{
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"editar('papel','"+no.data.id_operacao+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar novo papel</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('papel','"+dados[i].id_operacao+"','"+dados[i].id_papel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		if(dados[i].nome != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].nome+"</b> - "+dados[i].descricao+"</span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o papel!!!</span>";}
		var d = {html:conteudo,id_nopapel:dados[i].id_operacao+"_"+dados[i].id_papel,tipo:"papel"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosOperacoes(dados,redesenha){
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++){
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('operacao','"+dados[i].id_operacao+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].codigo != "")
		{conteudo += "&nbsp;<span>"+dados[i].codigo+" - "+dados[i].descricao+"</span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a opera&ccedil;&atilde;o!!!</span>";}
		var d = {html:conteudo,id_operacao:dados[i].id_operacao,tipo:"operacao"};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
/*
Function: editar

Abre o editor de um nó
*/
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
				if(tipo == "operacao")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('operacao','"+id+"')","","","","Opera&ccedil;&atilde;o",true,true,false);
					$i("editor_bd").innerHTML = montaDivOperacao(dados);
					core_carregando("desativa");
				}
				if(tipo == "papel")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('papel','"+id+"')","250px","100px","","Papel",true,true,false);
					$i("editor_bd").innerHTML = montaDivPapel(dados);
					document.getElementById("Eid_papel").style.width = "200px";
					core_carregando("desativa");
				}
				core_carregando("desativa");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	if(tipo == "operacao")
	{sUrl = "../php/operacoes.php?funcao=pegaDadosOperacao&id_operacao="+id;}
	if(tipo == "papel")
	{sUrl = "../php/operacoes.php?funcao=listaPapeis";}
	if(sUrl)
	{core_makeRequest(sUrl,callback);}
}
function montaDivOperacao(i){
	var param = {
		"linhas":[
		{titulo:"C&oacute;digo:",id:"Ecodigo",size:"50",value:i.codigo,tipo:"text",div:""},
		{titulo:"(opcional) Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	return(ins);
}
function montaDivPapel(dados){
	var ins = "<p><select id='Eid_papel' >";
	ins += core_comboObjeto(dados,"id_papel","nome","","descricao");
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
function excluir(tipo,id_operacao,id_papel)
{
	var mensagem = " excluindo o registro do id= "+id_operacao+" - "+id_papel;
	var no = null;
	var sUrl = null;
	if(tipo == "papel")
	{
		no = tree.getNodeByProperty("id_nopapel",id_operacao+"_"+id_papel);
		sUrl = "../php/operacoes.php?funcao=excluirPapelOperacao&id_papel="+id_papel+"&id_operacao="+id_operacao;
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
function gravaDados(tipo,id)
{
	var campos = null;
	var par = null;
	var prog = null;
	if(tipo == "operacao"){
		campos = new Array("codigo","descricao");
		par = "&id_operacao="+id;
		prog = "../php/operacoes.php?funcao=alterarOperacoes";
	}
	if(tipo == "papel"){
		campos = new Array("id_papel");
		par = "&id_operacao="+id;
		prog = "../php/operacoes.php?funcao=adicionaPapelOperacoes";
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
						if(tipo == "operacao"){
							var no = tree.getNodeByProperty("id_operacao",id);
							no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Ecodigo").value;
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
							no.html = no.getContentEl().innerHTML;
						}
						if(tipo == "papel"){
							var no = tree.getNodeByProperty("id_operacao",id);
							adicionaNosPapeis(no,YAHOO.lang.JSON.parse(o.responseText),true);
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