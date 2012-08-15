/*
Title: usuarios.js

Fun&ccedil;&otilde;es que controlam o cadastro de usuarios

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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

i3geo/admin/js/usuarios.js
*/
YAHOO.namespace("admin.container");
//armazena os dados das tabelas auxiliares, como tipos de unidades de medida, etc
var dadosAuxiliares = [];
/*
Function: initMenu

Inicializa o editor
*/
function initMenu(){
	listaDadosAuxiliares();
	ativaBotaoAdicionaVariavel("../php/metaestat.php?funcao=alteraVariavel","adiciona");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaVariaveis();
}
function ativaBotaoAdicionaVariavel(sUrl,idBotao){
	var adiciona = function(){
		core_carregando("ativa");
		core_carregando(" adicionando um novo registro");
		var callback = {
  			success:function(o){
  				try	{
  					core_carregando("desativa");
  					var j = YAHOO.lang.JSON.parse(o.responseText);
					adicionaNosVariaveis([j],true);
					editar("variavel",j.codigo_variavel);
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
Function: pegaVariaveis

Obt&eacute;m a lista de variaveis

<PEGAVARIAVEIS>
*/
function pegaVariaveis(){
	core_pegaDados("buscando vari&aacute;veis...","../php/metaestat.php?funcao=listaVariavel","montaArvore");
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
        	var sUrl = "../php/metaestat.php?funcao=listaMedidaVariavel&codigo_variavel="+node.data.codigo_variavel,
				callback = {
	                success: function(oResponse){
	                    var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
						adicionaNosMedidas(node,dados,false);
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
            if(node.data.codigo_variavel){
            	YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
            }
            else{
            	fnLoadComplete.call();
            }
        }
        function buildTree(){
			tree = new YAHOO.widget.TreeView("tabela");
			tree.setDynamicLoad(loadNodeData, 1);
			var root = tree.getRoot(),
				tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.isLeaf = true;
			core_carregando("desativa");
        }
    	buildTree();
	}();
   	adicionaNosVariaveis(dados);
   	tree.draw();
}
/*
Function: adicionaNosMedidas

Mostra os nós de uma medida

<PEGATEMAS>
*/
function adicionaNosMedidas(no,dados,redesenha)
{
	var tempNode,tempNode1,tempNode2,tempNode3,tempNode4,tempNode5,i,conteudo,d,j;
	function temaIconMode(){
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadNodeData(node, fnLoadComplete){
    	var sUrl = "../php/metaestat.php?funcao=listaDimensao&id_medida_variavel="+node.data.no_dimensoes,
			callback = {
	            success: function(oResponse){
	                var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosDimensao(node,dados,false);
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
    };
    function loadNodeDataClasses(node, fnLoadComplete){
    	var sUrl = "../php/metaestat.php?funcao=listaClassificacaoMedida&id_medida_variavel="+node.data.no_classificacao,
			callback = {
	            success: function(oResponse){
	                var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosClassificacao(node,dados,false);
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
    };
    function loadNodeDataLinks(node, fnLoadComplete){
    	var sUrl = "../php/metaestat.php?funcao=listaLinkMedida&id_medida_variavel="+node.data.no_link,
			callback = {
	            success: function(oResponse){
	                var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosLink(node,dados,false);
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
    };
    function loadNodeDataFonteinfo(node, fnLoadComplete){
    	var sUrl = "../php/metaestat.php?funcao=listaFonteinfoMedida&id_medida_variavel="+node.data.no_fonteinfo,
			callback = {
	            success: function(oResponse){
	            	var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosFonteinfo(node,dados,false);
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
    };
    if(!redesenha && !(tree.getNodeByProperty("etiqueta_adiciona_variavel",no.data.codigo_variavel))){
		tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style=\"cursor:pointer;\" onclick=\"adicionarMedidaVariavel('"+no.data.codigo_variavel+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova medida da vari&aacute;vel</i></span>",
					etiqueta_adiciona_variavel:no.data.codigo_variavel
				},
				no,
				false,
				true
			);
		tempNode.isLeaf = true;
	}
	for (i=0, j=dados.length; i<j; i++)	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"sql('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title='ver sql' src=\"../imagens/database.png\" /><b>";

		if(dados[i].nomemedida != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].nomemedida+"</b> <span style='color:gray;'>"+dados[i].esquemadb+" - "+dados[i].tabela+" - "+dados[i].colunavalor+" id: "+dados[i].id_medida_variavel+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova medida!!!</span>";}
		d = {html:conteudo,id_medida_variavel:dados[i].id_medida_variavel,tipo:"medida"};
		tempNode1 = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode1.isLeaf = false;
		//tempNode1.setDynamicLoad(temp, 1);
		conteudo = "&nbsp;Dimens&otilde;es";
		d = {html:conteudo,no_dimensoes:dados[i].id_medida_variavel};
		tempNode2 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
		tempNode2.isLeaf = false;
		tempNode2.setDynamicLoad(loadNodeData, 1);
		conteudo = "&nbsp;Classifica&ccedil;&otilde;es";
		d = {html:conteudo,no_classificacao:dados[i].id_medida_variavel};
		tempNode3 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
		tempNode3.isLeaf = false;
		tempNode3.setDynamicLoad(loadNodeDataClasses, 1);
		conteudo = "&nbsp;Links";
		d = {html:conteudo,no_link:dados[i].id_medida_variavel};
		tempNode4 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
		tempNode4.isLeaf = false;
		tempNode4.setDynamicLoad(loadNodeDataLinks, 1);
		conteudo = "&nbsp;Fontes";
		d = {html:conteudo,no_fonteinfo:dados[i].id_medida_variavel};
		tempNode5 = new YAHOO.widget.HTMLNode(d, tempNode1, false,true);
		tempNode5.isLeaf = false;
		tempNode5.setDynamicLoad(loadNodeDataFonteinfo, 1);
	}

	if(redesenha){tree.draw();}
}
/*
Function: adicionaNosDimensao

Mostra os nós de uma dimensao
*/
function adicionaNosDimensao(no,dados,redesenha){
	var tempNode,i,j,conteudo,d;
	function temaIconMode()	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    if(!redesenha)    {
		tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style=\"cursor:pointer;\" onclick=\"adicionarDimensaoMedida('"+no.data.no_dimensoes+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova dimens&atilde;o</i></span>"
				},
				no,
				false,
				true
			);
		tempNode.isLeaf = true;
	}
	for (i=0, j=dados.length; i<j; i++)	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('dimensaoMedida','"+dados[i].id_dimensao_medida+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('dimensaoMedida','"+dados[i].id_dimensao_medida+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nomedimensao != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].nomedimensao+"</b><span style=color:gray > - "+dados[i].descricao+" id: "+dados[i].id_dimensao_medida+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova medida!!!</span>";}
		d = {html:conteudo,id_dimensao_medida:dados[i].id_dimensao_medida,tipo:"dimensao"};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
/*
Function: adicionaNosClassificacao

Mostra os nós de uma dimensao
*/
function adicionaNosClassificacao(no,dados,redesenha){
	var tempNode,i,j,conteudo,d;
	function temaIconMode()	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadNodeData(node, fnLoadComplete){
    	var sUrl = "../php/metaestat.php?funcao=listaClasseClassificacao&id_classificacao="+node.data.id_classificacao,
			callback = {
	            success: function(oResponse){
	                var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosClasses(node,dados,false);
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
    };
    if(!redesenha)    {
		tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style=\"cursor:pointer;\" onclick=\"adicionarClassificacaoMedida('"+no.data.no_classificacao+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova classifica&ccedil;&atilde;o</i></span>"
				},
				no,
				false,
				true
			);
		tempNode.isLeaf = true;
	}
	for (i=0, j=dados.length; i<j; i++)	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('classificacaoMedida','"+dados[i].id_classificacao+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('classificacaoMedida','"+dados[i].id_classificacao+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nomedimensao != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].nome+"</b><span style=color:gray > Obs.: "+dados[i].observacao+" id: "+dados[i].id_classificacao+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova classifica&ccedil;&atilde;o!!!</span>";}
		d = {html:conteudo,id_classificacao:dados[i].id_classificacao,tipo:"classificacao"};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = false;
		tempNode.setDynamicLoad(loadNodeData, 1);
	}
	if(redesenha){tree.draw();}
}
/*
Function: adicionaNosClasses

Mostra os nós de uma classificacao
*/
function adicionaNosClasses(no,dados,redesenha){
	var tempNode,i,j,conteudo,d;
	function temaIconMode()	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    if(!redesenha)    {
		tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style=\"cursor:pointer;\" onclick=\"adicionarClasseClassificacao('"+no.data.id_classificacao+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova classe</i></span>"
				},
				no,
				false,
				true
			);
		tempNode.isLeaf = true;
	}
	for (i=0, j=dados.length; i<j; i++)	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('classeClassificacao','"+dados[i].id_classe+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('classeClassificacao','"+dados[i].id_classe+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nomedimensao != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].titulo+"</b><span style=color:gray >  id: "+dados[i].id_classe+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova classe!!!</span>";}
		d = {html:conteudo,id_classe:dados[i].id_classe,tipo:"classeClassificacao"};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
/*
Function: adicionaNosLink

Mostra os nós de links
*/
function adicionaNosLink(no,dados,redesenha){
	var tempNode,i,j,conteudo,d;
	function temaIconMode()	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    if(!redesenha)    {
		tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style=\"cursor:pointer;\" onclick=\"adicionarLinkMedida('"+no.data.no_link+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar novo link</i></span>"
				},
				no,
				false,
				true
			);
		tempNode.isLeaf = true;
	}
	for (i=0, j=dados.length; i<j; i++)	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('linkMedida','"+dados[i].id_link+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('linkMedida','"+dados[i].id_link+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nome != "")
		{conteudo += "&nbsp;<span><a href='"+dados[i].link+"' >"+dados[i].nome+"</a><span style=color:gray > - "+dados[i].link+" - id: "+dados[i].id_link+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o novo link!!!</span>";}
		d = {html:conteudo,id_link:dados[i].id_link,tipo:"link"};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
/*
Function: adicionaNosFonteinfo

Mostra os nós de fontes
*/
function adicionaNosFonteinfo(no,dados,redesenha){
	var tempNode,i,j,conteudo,d;
	function temaIconMode()	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    if(!redesenha)    {
		tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style=\"cursor:pointer;\" onclick=\"editar('fonteinfo','"+no.data.no_fonteinfo+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova fonte</i></span>"
				},
				no,
				false,
				true
			);
		tempNode.isLeaf = true;
	}
	for (i=0, j=dados.length; i<j; i++)	{
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('fonteinfo','"+dados[i].id_fonteinfo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		if(dados[i].titulo != "")
		{conteudo += "&nbsp;<span><a href='"+dados[i].link+"' >"+dados[i].titulo+"</a><span style=color:gray > - "+dados[i].link+" - id: "+dados[i].id_fonteinfo+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova fonte!!!</span>";}
		d = {html:conteudo,id_medida_variavel_fonteinfo:no.data.no_fonteinfo,id_fonteinfo:dados[i].id_fonteinfo,tipo:"fonteinfo"};
		tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosVariaveis(dados,redesenha){
	var i,j,d,conteudo,
		root = tree.getRoot();
	for (i=0, j=dados.length; i<j; i++){
		conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('variavel','"+dados[i].codigo_variavel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('variavel','"+dados[i].codigo_variavel+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nome && dados[i].nome != "")
		{conteudo += "&nbsp;<span>"+dados[i].nome+" - <span style='color:gray;'>"+dados[i].descricao+" id: "+dados[i].codigo_variavel+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a vari&aacute;vel!!!</span>";}
		d = {html:conteudo,codigo_variavel:dados[i].codigo_variavel,tipo:"variavel"};
		new YAHOO.widget.HTMLNode(d, root, false,true);
	}
	if(redesenha){tree.draw();}
}
function montaDivVariavel(i){
	var ins = "",
		param = {
			"linhas":[
		          {titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
		          {titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""}
			]
		};
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
}
function montaDivMedidaVariavel(i){
	var temp,ins = "",
		param = {
			"linhas":[
		          {titulo:"Nome:",id:"Enomemedida",size:"50",value:i.nomemedida,tipo:"text",div:""},
		          {titulo:"Unidade de medida:",id:"",size:"50",value:i.codigo_unidade_medida,tipo:"text",div:"<div id=Ccodigo_unidade_medida ></div>"},
		          {titulo:"Tipo de período:",id:"",size:"50",value:i.codigo_tipo_periodo,tipo:"text",div:"<div id=Ccodigo_tipo_periodo ></div>"},
		          {titulo:"Tipo de regi&atilde;o:",id:"",size:"50",value:i.codigo_tipo_regiao,tipo:"text",div:"<div id=Ccodigo_tipo_regiao ></div>"},
		          {titulo:"Conex&atilde;o:",id:"",size:"50",value:i.codigo_estat_conexao,tipo:"text",div:"<div id=Ccodigo_estat_conexao ></div>"},
		          {titulo:"Esquema do banco:",id:"Eesquemadb",size:"50",value:i.esquemadb,tipo:"text",div:""},
		          {titulo:"Tabela do banco:",id:"Etabela",size:"50",value:i.tabela,tipo:"text",div:""},
		          {titulo:"Coluna com os valores:",id:"Ecolunavalor",size:"50",value:i.colunavalor,tipo:"text",div:""},
		          {titulo:"Coluna com os IDs da tabela GEO:",id:"Ecolunaidgeo",size:"50",value:i.colunaidgeo,tipo:"text",div:""},
		          {titulo:"Filtro adicional:",id:"Efiltro",size:"50",value:i.filtro,tipo:"text",div:""}
			]
		};
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("Ccodigo_unidade_medida")){
		temp = "<select id='Ecodigo_unidade_medida' >";
		temp += core_comboObjeto(dadosAuxiliares.unidade_medida,"codigo_unidade_medida","nome",i.codigo_unidade_medida);
		temp += "</select>";
		$i("Ccodigo_unidade_medida").innerHTML = temp;
	}
	if($i("Ccodigo_tipo_periodo")){
		temp = "<select id='Ecodigo_tipo_periodo' >";
		temp += core_comboObjeto(dadosAuxiliares.tipo_periodo,"codigo_tipo_periodo","nome",i.codigo_tipo_periodo);
		temp += "</select>";
		$i("Ccodigo_tipo_periodo").innerHTML = temp;
	}
	if($i("Ccodigo_tipo_regiao")){
		temp = "<select id='Ecodigo_tipo_regiao' >";
		temp += core_comboObjeto(dadosAuxiliares.tipo_regiao,"codigo_tipo_regiao","nome_tipo_regiao",i.codigo_tipo_regiao);
		temp += "</select>";
		$i("Ccodigo_tipo_regiao").innerHTML = temp;
	}
	if($i("Ccodigo_estat_conexao")){
		temp = "<select id='Ecodigo_estat_conexao' >";
		temp += core_comboObjeto(dadosAuxiliares.conexao,"codigo_estat_conexao","bancodedados",i.codigo_estat_conexao);
		temp += "</select>";
		$i("Ccodigo_estat_conexao").innerHTML = temp;
	}
}
function montaDivDimensaoMedida(i){
	var temp,ins = "",
		param = {
			"linhas":[
		          {titulo:"Nome:",id:"Enomedimensao",size:"50",value:i.nomedimensao,tipo:"text",div:""},
		          {titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""},
		          {titulo:"Coluna:",id:"Ecoluna",size:"50",value:i.coluna,tipo:"text",div:""},
		          {titulo:"Agrega valores:",id:"",size:"50",value:i.agregavalores,tipo:"text",div:"<div id=Cagregavalores ></div>"}
			]
		};
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("Cagregavalores")){
		temp = "<select id='Eagregavalores' >";
		temp += core_comboObjeto([{"nome":"sim","valor":"1"},{"nome":"nao","valor":"0"}],"valor","nome",i.agregavalores);
		temp += "</select>";
		$i("Cagregavalores").innerHTML = temp;
	}
}
function montaDivClassificacaoMedida(i){
	var ins = "",
		param = {
			"linhas":[
		          {titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
		          {titulo:"Observa&ccedil;&atilde;o:",id:"Eobservacao",size:"50",value:i.observacao,tipo:"text",div:""}
			]
		};
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
}

function montaDivClasseClassificacao(i){
	var ins = "",
		param = {
			"linhas":[
		          {titulo:"T&iacute;tulo:",id:"Etitulo",size:"50",value:i.titulo,tipo:"text",div:""},
		          {titulo:"Express&atilde;o (no estilo Mapserver)<br> exemplo (([nu_farm_funcionando] > 0) and ([nu_farm_funcionando] < 5)):",id:"Eexpressao",size:"50",value:i.expressao,tipo:"text",div:""},
		          {titulo:"S&iacute;mbolo:",id:"Esimbolo",size:"10",value:i.simbolo,tipo:"text",div:""},
		          {titulo:"Tamanho do s&iacute;mbolo:",id:"Etamanho",size:"10",value:i.tamanho,tipo:"text",div:""},
		          {titulo:"Vermelho:",id:"Evermelho",size:"10",value:i.vermelho,tipo:"text",div:""},
		          {titulo:"Verde:",id:"Everde",size:"10",value:i.verde,tipo:"text",div:""},
		          {titulo:"Azul:",id:"Eazul",size:"10",value:i.azul,tipo:"text",div:""},
		          {titulo:"Contorno - tamanho do s&iacute;mbolo:",id:"Eotamanho",size:"10",value:i.otamanho,tipo:"text",div:""},
		          {titulo:"Contorno - Vermelho:",id:"Eovermelho",size:"10",value:i.overmelho,tipo:"text",div:""},
		          {titulo:"Contorno - Verde:",id:"Eoverde",size:"10",value:i.overde,tipo:"text",div:""},
		          {titulo:"Contorno - Azul:",id:"Eoazul",size:"10",value:i.oazul,tipo:"text",div:""}
			]
		};
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
}
function montaDivLinkMedida(i){
	var ins = "",
		param = {
			"linhas":[
		          {titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
		          {titulo:"Link:",id:"Elink",size:"50",value:i.link,tipo:"text",div:""}
			]
		};
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
}
function montaDivFonteinfo(dados){
	ins = "<br><b>Escolha a Fonte:</b><br><br>";
	ins += "<select style='width:400px;' id='Eid_fonteinfo' >";
	ins += core_comboObjeto(dadosAuxiliares.fonteinfo,"id_fonteinfo","titulo");
	ins += "</select>";
	$i("editor_bd").innerHTML = ins;
}
/*
Function: adicionarMedidaVariavel

Adiciona uma nova medida em uma variavel

<ALTERAMEDIDAVARIAVEL>
*/
function adicionarMedidaVariavel(codigo_variavel){
	var no = tree.getNodeByProperty("codigo_variavel",codigo_variavel),
		sUrl = "../php/metaestat.php?funcao=alteraMedidaVariavel&codigo_variavel="+codigo_variavel,
		callback = {
	    	success: function(oResponse){
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosMedidas(no,[dados],true);
				editar('medidaVariavel',dados.id_medida_variavel);
			},
	  		failure:core_handleFailure,
	  		argument: { foo:"foo", bar:"bar" }
		};
	core_makeRequest(sUrl,callback);
}
/*
Function: adicionarDimensaoMedida

Adiciona uma nova dimensao a uma medida de variavel

<ADICIONARDIMENSAOMedida>
*/
function adicionarDimensaoMedida(id_medida_variavel){
	var no = tree.getNodeByProperty("id_medida_variavel",id_medida_variavel),
		sUrl = "../php/metaestat.php?funcao=alteraDimensaoMedida&id_medida_variavel="+id_medida_variavel,
		callback = 	{
	    	success: function(oResponse){
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosDimensao(no,[dados],true);
				editar('dimensaoMedida',dados.id_dimensao_medida);
			},
	  		failure:core_handleFailure,
	  		argument: { foo:"foo", bar:"bar" }
		};
	core_makeRequest(sUrl,callback);
}
function adicionarLinkMedida(id_medida_variavel){
	var no = tree.getNodeByProperty("no_link",id_medida_variavel),
		sUrl = "../php/metaestat.php?funcao=alteraLinkMedida&id_medida_variavel="+id_medida_variavel,
		callback = 	{
	    	success: function(oResponse){
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosLink(no,[dados],true);
				editar('linkMedida',dados.id_link);
			},
	  		failure:core_handleFailure,
	  		argument: { foo:"foo", bar:"bar" }
		};
	core_makeRequest(sUrl,callback);
}
function adicionarFonteinfoMedida(id_medida_variavel,id_fonteinfo){
	var no = tree.getNodeByProperty("no_fonteinfo",id_medida_variavel),
		sUrl = "../php/metaestat.php?funcao=alteraFonteinfo&id_medida_variavel="+id_medida_variavel,
		callback = 	{
	    	success: function(oResponse){
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosLink(no,[dados],true);
				editar('fonteinfo',dados.id_fonteinfo);
			},
	  		failure:core_handleFailure,
	  		argument: { foo:"foo", bar:"bar" }
		};
	core_makeRequest(sUrl,callback);
}
/*
Function: adicionarClassificacaoMedida

Adiciona uma nova classificacao a uma medida de variavel
*/
function adicionarClassificacaoMedida(id_medida_variavel){
	var no = tree.getNodeByProperty("no_classificacao",id_medida_variavel),
		sUrl = "../php/metaestat.php?funcao=alteraClassificacaoMedida&id_medida_variavel="+id_medida_variavel,
		callback = 	{
	    	success: function(oResponse){
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosClassificacao(no,[dados],true);
				editar('classificacaoMedida',dados.id_classificacao);
			},
	  		failure:core_handleFailure,
	  		argument: { foo:"foo", bar:"bar" }
		};
	core_makeRequest(sUrl,callback);
}
/*
Function: adicionarClasseClassificacao

Adiciona uma nova classe a uma classificacao
*/
function adicionarClasseClassificacao(id_classificacao){
	var no = tree.getNodeByProperty("id_classificacao",id_classificacao),
		sUrl = "../php/metaestat.php?funcao=alteraClasseClassificacao&id_classificacao="+id_classificacao,
		callback = 	{
	    	success: function(oResponse){
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosClasses(no,[dados],true);
				editar('classeClassificacao',dados.id_classe);
			},
	  		failure:core_handleFailure,
	  		argument: { foo:"foo", bar:"bar" }
		};
	core_makeRequest(sUrl,callback);
}
/*
Function: editar

Abre o editor de um nó
*/
function editar(tipo,id) {
	core_carregando("ativa");
	core_carregando(" buscando dados");
	var sUrl = null,
		callback = {
			success:function(o) {
				try	{
					var dados;
					if(tipo == "variavel"){
						dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("gravaDados('variavel','"+id+"')","450px","200px","","Editor de vari&aacute;vel");
						montaDivVariavel(dados);
					}
					if(tipo == "medidaVariavel"){
						dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("gravaDados('medidaVariavel','"+id+"')","450px","200px","","Editor de medidas");
						montaDivMedidaVariavel(dados);
					}
					if(tipo == "dimensaoMedida"){
						dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("gravaDados('dimensaoMedida','"+id+"')","450px","200px","","Editor de dimens&oatilde;es");
						montaDivDimensaoMedida(dados);
					}
					if(tipo == "classificacaoMedida"){
						dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("gravaDados('classificacaoMedida','"+id+"')","450px","200px","","Editor de classifica&ccedil;&atilde;o");
						montaDivClassificacaoMedida(dados);
					}
					if(tipo == "classeClassificacao"){
						dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("gravaDados('classeClassificacao','"+id+"')","450px","200px","","Editor de classe");
						montaDivClasseClassificacao(dados);
					}
					if(tipo == "linkMedida"){
						dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("gravaDados('linkMedida','"+id+"')","450px","200px","","Editor de links");
						montaDivLinkMedida(dados);
					}
					core_carregando("desativa");
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
	if(tipo == "variavel"){
		sUrl = "../php/metaestat.php?funcao=listaVariavel&codigo_variavel="+id;
	}
	if(tipo == "medidaVariavel"){
		sUrl = "../php/metaestat.php?funcao=listaMedidaVariavel&id_medida_variavel="+id;
	}
	if(tipo == "dimensaoMedida"){
		sUrl = "../php/metaestat.php?funcao=listaDimensao&id_dimensao_medida="+id;
	}
	if(tipo == "classificacaoMedida"){
		sUrl = "../php/metaestat.php?funcao=listaClassificacaoMedida&id_classificacao="+id;
	}
	if(tipo == "classeClassificacao"){
		sUrl = "../php/metaestat.php?funcao=listaClasseClassificacao&id_classe="+id;
	}
	if(tipo == "linkMedida"){
		sUrl = "../php/metaestat.php?funcao=listaLinkMedida&id_link="+id;
	}
	if(tipo == "fonteinfo"){
		core_montaEditor("gravaDados('fonteinfo','"+id+"')","450px","200px","","Editor de fontes");
		montaDivFonteinfo();
		core_carregando("desativa");
	}
	if(sUrl){
		core_makeRequest(sUrl,callback);
	}
}
/*
Function: sql

Mostra o sql que acessa os dados
*/
function sql(tipo,id) {
	core_carregando("ativa");
	core_carregando(" buscando dados");
	var sUrl = null,
		callback = {
			success:function(o) {
				try	{
					if(tipo == "medidaVariavel"){
						var ins = "",
							dados = YAHOO.lang.JSON.parse(o.responseText);
						core_montaEditor("","480px","300px","","SQL");
						ins = "<p><b>Select simples:</b> "+dados.sql;
						ins += "<p><b>Mapserver:</b> "+dados.sqlmapserver;
						ins += "<p><b>Última URL:</b><div id='ultimaUrl'></div> ";
						ins += "<p><b>Colunas:</b> "+dados.colunas;
						ins +="<p><input style='position:relative;top:2px' type='checkbox' id='incluirtodascolunas' />Incluir todas as colunas no resultado";
						ins +="<p>Filtro opcional (exemplo: valor = 1)<br>";
						ins += "<input type=text value='' id='filtrosql' />";
						ins +="<p>Agrupar pela coluna<br>";
						ins += "<input type=text value='' id='agruparsql' />";
						ins +="<p>Tipo de layer (para o caso de mapas ou mapfiles, podendo ser point,line ou polygon)<br>";
						ins += "<input type=text value='' id='tipolayer' />";
						ins +="<p>Codigo da classifica&ccedil;&atilde;o que ser&aacute; usada para mostrar o mapa<br>";
						ins += "<input type=text value='' id='classificacao' />";
						ins += '  <p><input type=button id="sqljson" value="JSON" />';
						ins += '  <input type=button id="sumarioestat" value="Sum&aacute;rio" />';
						ins += '  <input type=button id="graficoestat" value="Gr&aacute;fico" />';
						ins += '  <input type=button id="mapfileestat" value="Mapfile" />';
						ins += '  <input type=button id="i3geoestat" value="i3Geo" /><br><br>';
						ins += '  <input type=button id="kmzestat" value="Kmz (vetorial)" />';
						ins += '  <input type=button id="kmlestat" value="Kml (wms)" />';
						ins += '  <input type=button id="kml3destat" value="Kml 3d" />';

						$i("editor_bd").innerHTML = ins;
						new YAHOO.widget.Button("sqljson");
						document.getElementById("sqljson-button").onclick = function(){
							var u,colunas = 0;
							if($i("incluirtodascolunas").checked === true){
								colunas = 1;
							}
							u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=dadosMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&agruparpor="+$i("agruparsql").value;
							$i("ultimaUrl").innerHTML = u;
							window.open(u);
						};
						new YAHOO.widget.Button("sumarioestat");
						$i("sumarioestat-button").onclick = function(){
							var u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=sumarioMedidaVariavel&formato=json&id_medida_variavel='+id+"&agruparpor="+$i("agruparsql").value+"&filtro="+$i("filtrosql").value;
							$i("ultimaUrl").innerHTML = u;
							window.open(u);
						};
						new YAHOO.widget.Button("mapfileestat");
						$i("mapfileestat-button").onclick = function(){
							var u,colunas = 0;
							if($i("incluirtodascolunas").checked === true){
								colunas = 1;
							}
							u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=mapfileMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value;
							$i("ultimaUrl").innerHTML = u;
							window.open(u);
						};
						new YAHOO.widget.Button("kmzestat");
						$i("kmzestat-button").onclick = function(){
							var u,colunas = 0;
							if($i("incluirtodascolunas").checked === true){
								colunas = 1;
							}
							u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=kmlmedidavariavel&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value+"&formato=kmz";
							$i("ultimaUrl").innerHTML = u;
							window.open(u);
						};
						new YAHOO.widget.Button("kmlestat");
						$i("kmlestat-button").onclick = function(){
							var u,colunas = 0;
							if($i("incluirtodascolunas").checked === true){
								colunas = 1;
							}
							u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=kmlmedidavariavel&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value+"&formato=kml";
							$i("ultimaUrl").innerHTML = u;
							window.open(u);
						};
						new YAHOO.widget.Button("kml3destat");
						$i("kml3destat-button").onclick = function(){
							var u,colunas = 0;
							if($i("incluirtodascolunas").checked === true){
								colunas = 1;
							}
							u = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=kmlmedidavariavel&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value+"&formato=kml3d";
							$i("ultimaUrl").innerHTML = u;
							window.open(u);
						};
						new YAHOO.widget.Button("i3geoestat");
						$i("i3geoestat-button").onclick = function(){
							var u,sUrl,callback = 	{
							    	success: function(oResponse){
										var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
										u = i3GEO.configura.locaplic+"/ms_criamapa.php?temasa="+dados.mapfile+"&layers="+dados.layer;
										$i("ultimaUrl").innerHTML = u;
										window.open(u);
										core_carregando("desativa");
									},
							  		failure:core_handleFailure,
							  		argument: { foo:"foo", bar:"bar" }
								},
								colunas = 0;
							if($i("incluirtodascolunas").checked === true){
								colunas = 1;
							}
							sUrl = i3GEO.configura.locaplic+'/admin/php/metaestat.php?funcao=mapfileMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+$i("filtrosql").value+"&todasascolunas="+colunas+"&tipolayer="+$i("tipolayer").value+"&id_classificacao="+$i("classificacao").value+"&agruparpor="+$i("agruparsql").value;
							core_carregando("ativa");
							core_makeRequest(sUrl,callback);
						};
						new YAHOO.widget.Button("graficoestat");
						$i("graficoestat-button").onclick = function(){
							var callback = 	{
							    	success: function(oResponse){
										var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
										dados = dados.grupos;
										if(dados == ""){
											dados = dados.histograma;
										}
										//converte os dados para o padrao usado no grafico
										abreDados = function(){
											i3GEOF.graficointerativo.dados = dados;
											i3GEOF.graficointerativo.montaTabelaDados = function(dados){
												var i=0,
													v,
													ins,
													key = "",
													id,
													cor = "#C11515";
												n = dados.lenght;
												v = [];
												ins = [];
												ins.push("<p class=paragrafo >Tabela de dados para o gr&aacute;fico. Os valores podem ser editados</p><table class=lista4 id=i3GEOgraficointerativotabeladados ><tr><td></td>");
												ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,1)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> nome</td>");
												ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,2)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> valor</td>");
												ins.push("<td style=background-color:yellow >cor</td><td></td></tr>");
												for(key in dados){
													v[0] = key;
													v[1] = dados[key];
													id = "i3GEOgraficointerativoDados"+i; //layer+indice da classe
													ins.push("<tr><td>");
													ins.push("<img style='cursor:pointer' title='clique para excluir' onclick='i3GEOF.graficointerativo.excluilinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='excluir' /></td>");
													ins.push("</td><td>");
													ins.push($inputText("","",id+"_nome","digite o novo nome",20,v[0],"nome"));
													ins.push("</td><td>");
													ins.push($inputText("","",id+"_valor","digite o novo valor",12,v[1],"valor"));
													ins.push("</td><td>");
													if($i("i3GEOgraficointerativoCoresA").checked){
														cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
													}
													//verifica se no objeto com os dados existe um terceiro valor com as cores
													if(v[2]){
														cor = i3GEO.util.rgb2hex(v[2]);
													}
													ins.push($inputText("","",id+"_cor","",12,cor,"cor"));
													ins.push("</td><td>");
													ins.push("<img alt='aquarela.gif' style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo.corj(\""+id+"_cor\")' />");
													ins.push("</td></tr>");
													i++;
												}
												ins.push("</table><br>");
												//ins.push("<input type=hidden id=i3GEOgraficointerativoComboXid />");
												//ins.push("<input type=hidden id=i3GEOgraficointerativoComboYid />");
												$i("i3GEOgraficointerativoDados").innerHTML = ins.join("");
												if($i("agruparsql").value != ""){
													//$i("i3GEOgraficointerativoComboXid").value = $i("agruparsql").value;
													//$i("i3GEOgraficointerativoComboYid").value = "Soma";
												}
											};
											i3GEOF.graficointerativo.criaJanelaFlutuante();
											core_carregando("desativa");
										};
										i3GEO.util.scriptTag(
											"../../ferramentas/graficointerativo/index.js",
											"abreDados()",
											"i3GEOF.graficointerativo_script"
										);
									},
							  		failure:core_handleFailure,
							  		argument: { foo:"foo", bar:"bar" }
								},
								sUrl = '../php/metaestat.php?funcao=sumarioMedidaVariavel&formato=json&id_medida_variavel='+id+"&agruparpor="+$i("agruparsql").value+"&filtro="+document.getElementById("filtrosql").value;
							core_carregando("ativa");
							core_makeRequest(sUrl,callback);
						};
					}
					if(tipo == "dimensaoMedida"){

					}
					core_carregando("desativa");
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
	if(tipo == "medidaVariavel"){
		sUrl = "../php/metaestat.php?funcao=sqlMedidaVariavel&id_medida_variavel="+id;
	}
	if(tipo == "dimensaoMedida"){
		sUrl = "../php/metaestat.php?funcao=listaDimensao&id_dimensao_medida="+id;
	}
	if(sUrl){
		core_makeRequest(sUrl,callback);
	}
}

/*
Function: excluir

Exclui um elemento
*/
function excluir(tipo,id){
	var mensagem = " excluindo o registro = "+id,
		no = null,
		sUrl = null;
	if(tipo == "variavel")	{
		no = tree.getNodeByProperty("codigo_variavel",id);
		sUrl = "../php/metaestat.php?funcao=excluirVariavel&codigo_variavel="+id;
	}
	if(tipo == "medidaVariavel")	{
		no = tree.getNodeByProperty("id_medida_variavel",id);
		sUrl = "../php/metaestat.php?funcao=excluirMedidaVariavel&id_medida_variavel="+id;
	}
	if(tipo == "dimensaoMedida")	{
		no = tree.getNodeByProperty("id_dimensao_medida",id);
		sUrl = "../php/metaestat.php?funcao=excluirDimensaoMedida&id_dimensao_medida="+id;
	}
	if(tipo == "classificacaoMedida")	{
		no = tree.getNodeByProperty("id_classificacao",id);
		sUrl = "../php/metaestat.php?funcao=excluirClassificacaoMedida&id_classificacao="+id;
	}
	if(tipo == "classeClassificacao")	{
		no = tree.getNodeByProperty("id_classe",id);
		sUrl = "../php/metaestat.php?funcao=excluirClasseClassificacao&id_classe="+id;
	}
	if(tipo == "linkMedida")	{
		no = tree.getNodeByProperty("id_link",id);
		sUrl = "../php/metaestat.php?funcao=excluirLinkMedida&id_link="+id;
	}
	if(tipo == "fonteinfo")	{
		no = tree.getNodeByProperty("id_fonteinfo",id);
		sUrl = "../php/metaestat.php?funcao=excluirFonteinfoMedida&id_fonteinfo="+id+"&id_medida_variavel="+no.data.id_medida_variavel_fonteinfo;
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
	var sUrl,i,campos = null,
		par = null,
		prog = null;
	if(tipo == "variavel"){
		campos = new Array("nome","descricao");
		par = "&codigo_variavel="+id;
		prog = "../php/metaestat.php?funcao=alteraVariavel";
	}
	if(tipo == "medidaVariavel"){
		campos = new Array(	"codigo_unidade_medida","codigo_tipo_periodo","codigo_tipo_regiao","codigo_estat_conexao","esquemadb","tabela","colunavalor","colunaidgeo","filtro","nomemedida");
		par = "&id_medida_variavel="+id;
		prog = "../php/metaestat.php?funcao=alteraMedidaVariavel";
	}
	if(tipo == "dimensaoMedida"){
		campos = new Array("nomedimensao","descricao","coluna","agregavalores");
		par = "&id_dimensao_medida="+id;
		prog = "../php/metaestat.php?funcao=alteraDimensaoMedida";
	}
	if(tipo == "classificacaoMedida"){
		campos = new Array("nome","observacao");
		par = "&id_classificacao="+id;
		prog = "../php/metaestat.php?funcao=alteraClassificacaoMedida";
	}
	if(tipo == "classeClassificacao"){
		campos = new Array("titulo","expressao","azul","verde","vermelho","tamanho","simbolo","otamanho","overde","oazul","overmelho");
		par = "&id_classe="+id;
		prog = "../php/metaestat.php?funcao=alteraClasseClassificacao";
	}
	if(tipo == "linkMedida"){
		campos = new Array("nome","link");
		par = "&id_link="+id;
		prog = "../php/metaestat.php?funcao=alteraLinkMedida";
	}
	if(tipo == "fonteinfo"){
		campos = new Array("id_fonteinfo");
		par = "&id_medida_variavel="+id;
		prog = "../php/metaestat.php?funcao=adicionaFonteinfoMedida";
	}
	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i("E"+campos[i]).value);}

	var callback = {
  		success:function(o){
  			try	{
  				var no;
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
  					core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem menus vinculados a este tema</span>");
  					setTimeout("core_carregando('desativa')",3000);
  				}
  				else{
  					if(tipo == "variavel"){
  						no = tree.getNodeByProperty("codigo_variavel",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enome").value+"</b> - <span style='color:gray;'>"+document.getElementById("Edescricao").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "medidaVariavel"){
  						no = tree.getNodeByProperty("id_medida_variavel",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enomemedida").value+"</b> - <span style='color:gray;'>"+document.getElementById("Eesquemadb").value+" - "+document.getElementById("Etabela").value+" - "+document.getElementById("Ecolunavalor").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "dimensaoMedida"){
  						no = tree.getNodeByProperty("id_dimensao_medida",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enomedimensao").value+"</b><span style=color:gray > - "+document.getElementById("Edescricao").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "classificacaoMedida"){
  						no = tree.getNodeByProperty("id_classificacao",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enome").value+"</b><span style=color:gray > Obs.: "+document.getElementById("Eobservacao").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "classeClassificacao"){
  						no = tree.getNodeByProperty("id_classe",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Etitulo").value+"</b><span style=color:gray > id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "linkMedida"){
  						no = tree.getNodeByProperty("id_link",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<a href='"+document.getElementById("Elink").value+"' >"+document.getElementById("Enome").value+"</a><span style=color:gray > - "+document.getElementById("Elink").value+" - id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "fonteinfo"){
  						no = tree.getNodeByProperty("no_fonteinfo",id);
  						adicionaNosFonteinfo(no,[YAHOO.lang.JSON.parse(o.responseText)],true);
  						//no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<a href='"+document.getElementById("Elink").value+"' >"+document.getElementById("Etitulo").value+"</a><span style=color:gray > - "+document.getElementById("Elink").value+" - id: "+id+"</span>";
						//no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						//no.html = no.getContentEl().innerHTML;
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
		sUrl = prog+par;
		core_makeRequest(sUrl,callback,'GET');
	}
}
/*
Function: listaDadosAuxiliares

Lista os dados das tabelas auxiliares e guarda no objeto dadosAuxiliares
*/
function listaDadosAuxiliares(){
	var callback = {
  		success:function(o){
  			try	{
  				dadosAuxiliares = YAHOO.lang.JSON.parse(o.responseText);
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest("../php/metaestat.php?funcao=listaDadosTabelasAuxiliares",callback);
}