/*
Title: usuarios.js

Fun&ccedil;&otilde;es que controlam o cadastro de usuarios

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

i3geo/admin/js/usuarios.js
*/
YAHOO.namespace("admin.container");
/*
Function: initMenu

Inicializa o editor
*/
function initMenu(){
	ativaBotaoAdicionaUsuario("../php/usuarios.php?funcao=alterarUsuarios","adiciona");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaUsuarios();
}
function ativaBotaoAdicionaUsuario(sUrl,idBotao){
	var botao, adiciona = function()
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
					adicionaNosUsuarios(j,true);
					editar("usuarios",j[j.length-1].id_usuario);
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
Function: pegaOperacoes

Obt&eacute;m a lista de operacoes

<PEGAOPERACOES>
*/
function pegaUsuarios(){
	core_pegaDados("buscando usu&aacute;rios...","../php/usuarios.php?funcao=pegaUsuarios","montaArvore");
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
			var sUrl = "../php/usuarios.php?funcao=pegaPapeisUsuario&id_usuario="+node.data.id_usuario;
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
		adicionaNosUsuarios(dados);
		tree.draw();
}
/*
Function: adicionaNosPapeis

Mostra os nos de uma operacao

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
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"editar('papel','"+no.data.id_usuario+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar novo papel</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
		tempNode.enableHighlight = false;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		if(!tree.getNodeByProperty("id_nopapel",dados[i].id_usuario+"_"+dados[i].id_papel)){
			var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('papel','"+dados[i].id_usuario+"','"+dados[i].id_papel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
			if(dados[i].nome != "")
			{conteudo += "&nbsp;<span><b>"+dados[i].nome+"</b> - "+dados[i].descricao+"</span>";}
			else
			{conteudo += "&nbsp;<span style=color:red >Edite para definir o papel!!!</span>";}
			var d = {html:conteudo,id_nopapel:dados[i].id_usuario+"_"+dados[i].id_papel,tipo:"papel"};
			var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
			tempNode.isLeaf = true;
			tempNode.enableHighlight = false;
		}
	}
	if(redesenha){tree.draw();}
}
function adicionaNosUsuarios(dados,redesenha){
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++){
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('usuario','"+dados[i].id_usuario+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('usuario','"+dados[i].id_usuario+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px;width:25px;\" onclick=\"emailsenha('"+dados[i].id_usuario+"')\" title='enviar senha' src=\"../imagens/07.png\" /><b>";
		if(dados[i].nome_usuario && dados[i].nome_usuario != "")
		{conteudo += "&nbsp;<span>"+dados[i].nome_usuario+" - "+dados[i].login+" - ativo: "+dados[i].ativo+"</span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o usu&aacute;rio!!!</span>";}
		var d = {html:conteudo,id_usuario:dados[i].id_usuario,tipo:"usuario"};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		tempNode.enableHighlight = false;
	}
	if(redesenha){tree.draw();}
}
/*
Function: editar

Abre o editor de um no
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
				if(tipo == "usuario")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					montaDivUsuario(dados);
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
	if(tipo == "usuario")
	{sUrl = "../php/usuarios.php?funcao=pegaDadosUsuario&id_usuario="+id;}
	if(tipo == "papel")
	{sUrl = "../php/usuarios.php?funcao=listaPapeis";}
	if(sUrl)
	{core_makeRequest(sUrl,callback);}
}
function montaDivUsuario(i){
	var temp = function(){
		gravaDados('usuario',i.id_usuario);
	};
	core_montaEditor(temp,"450px","380px","","Usu&aacute;rio",true,true,false);
	var param = {
		"linhas":[
				{titulo:"Nome:",id:"Enome_usuario",size:"50",value:i.nome_usuario,tipo:"text",div:""},
				{titulo:"Login:",id:"Elogin",size:"50",value:i.login,tipo:"text",div:""},
				{ajuda:"Se o usu&aacute;rio j&aacute; existir, preencha para alterar a senha. Se for mantido em branco, o sistema gerar&aacute; uma senha aleat&oacute;ria no caso de novos usu&aacute;rios. Envie a senha por e-mail ap&oacute;s o cadastro.",titulo:"Nova senha:",id:"Esenha",size:"50",value:"",tipo:"text",div:""},
				{titulo:"E-mail:",id:"Eemail",size:"50",value:i.email,tipo:"text",div:""},
				{titulo:"Data de cadastro:",id:"Edata_cadastro",size:"50",value:i.data_cadastro,tipo:"text",div:""},
				{titulo:"Ativo:",id:"",size:"50",value:i.ativo,tipo:"text",div:"<div id=cAtivo ></div>"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("cAtivo")){
		temp = "<select id='Eativo' >";
		temp += "<option value='1' >Sim</option>";
		temp += "<option value='0' >N&atilde;o</option>";
		temp += "</select>";
		$i("cAtivo").innerHTML = temp;
		$i("Eativo").value = i.ativo;
	}
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
function excluir(tipo,id_usuario,id_papel)
{
	var mensagem = " excluindo o registro do usu&aacute;rio= "+id_usuario;
	var no = null;
	var sUrl = null;
	if(tipo == "usuario")	{
		no = tree.getNodeByProperty("id_usuario",id_usuario);
		sUrl = "../php/usuarios.php?funcao=excluirUsuario&id_usuario="+id_usuario;
	}
	if(tipo == "papel")	{
		no = tree.getNodeByProperty("id_nopapel",id_usuario+"_"+id_papel);
		sUrl = "../php/usuarios.php?funcao=excluirPapelUsuario&id_papel="+id_papel+"&id_usuario="+id_usuario;
	}
	if(sUrl)
	{core_excluiNoTree(sUrl,no,mensagem);}
}
/*
Function: emailsenha

Enviar senha por email
*/
function emailsenha(id_usuario)
{
	var callback = {
			success:function(o){
				try	{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
						core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel enviar");
						setTimeout("core_carregando('desativa')",3000);
					}
					else{
						core_carregando("desativa");
					}
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_carregando("ativa");
	core_carregando("Enviando e-mail");
	var sUrl = "../php/usuarios.php?funcao=enviarSenhaEmail&id_usuario="+id_usuario;
	core_makeRequest(sUrl,callback,'POST');
}
/*
Function: gravaDados

Altera dados de um elemento do cadastro

<ALTERARATLAS>

<ALTERARPRANCHA>

<ALTERARTEMA>
*/
function gravaDados(tipo,id)
{
	var campos = null;
	var par = null;
	var prog = null;
	if(tipo == "usuario"){
		campos = ["nome_usuario","login","senha","data_cadastro","email","ativo"];
		par = "&id_usuario="+id;
		prog = "../php/usuarios.php?funcao=alterarUsuarios";
	}
	if(tipo == "papel"){
		campos = ["id_papel"];
		par = "&id_usuario="+id;
		prog = "../php/usuarios.php?funcao=adicionaPapelUsuario";
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
						if(tipo == "usuario"){
							var no = tree.getNodeByProperty("id_usuario",id);
							no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Enome_usuario").value+" "+document.getElementById("Elogin").value+" ativo: "+document.getElementById("Eativo").value;
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
							no.html = no.getContentEl().innerHTML;
						}
						if(tipo == "papel"){
							var no = tree.getNodeByProperty("id_usuario",id);
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
