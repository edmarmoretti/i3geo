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
YAHOO.namespace("example.container");
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
	YAHOO.example.treeExample = new function()
	{
		tree = "";
		function changeIconMode()
		{
			buildTree();
		}
        function loadNodeData(node, fnLoadComplete){
        	var sUrl = "../php/metaestat.php?funcao=listaMedidaVariavel&codigo_variavel="+node.data.codigo_variavel;
			var callback = {
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
            YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
        }
        function buildTree(){
			tree = new YAHOO.widget.TreeView("tabela");
			tree.setDynamicLoad(loadNodeData, 1);
			var root = tree.getRoot();
			var tempNode = new YAHOO.widget.TextNode('', root, false);
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
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadNodeData(node, fnLoadComplete){
    	var sUrl = "../php/metaestat.php?funcao=listaDimensao&id_medida_variavel="+node.data.id_medida_variavel;
		var callback = {
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
    }
    if(!redesenha)
    {
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"adicionarMedidaVariavel('"+no.data.codigo_variavel+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova medida da vari&aacute;vel</i></span>";
		var d = {html:conteudo,codigo_variavel:no.data.codigo_variavel};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"sql('medidaVariavel','"+dados[i].id_medida_variavel+"')\" title='ver sql' src=\"../imagens/database.png\" /><b>";

		if(dados[i].nomemedida != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].nomemedida+"</b> <span style='color:gray;'>"+dados[i].esquemadb+" - "+dados[i].tabela+" - "+dados[i].colunavalor+" id: "+dados[i].id_medida_variavel+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova medida!!!</span>";}
		var d = {html:conteudo,id_medida_variavel:dados[i].id_medida_variavel,tipo:"medida"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = false;
		tempNode.setDynamicLoad(loadNodeData, 1);
	}
	if(redesenha){tree.draw();}
}
/*
Function: adicionaNosDimensao

Mostra os nós de uma dimensao

<PEGATEMAS>
*/
function adicionaNosDimensao(no,dados,redesenha)
{
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    if(!redesenha)
    {
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"adicionarDimensaoMedida('"+no.data.id_medida_variavel+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar nova dimens&atilde;o</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('dimensaoMedida','"+dados[i].id_dimensao_medida+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('dimensaoMedida','"+dados[i].id_dimensao_medida+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nomedimensao != "")
		{conteudo += "&nbsp;<span><b>"+dados[i].nomedimensao+"</b><span style=color:gray > - "+dados[i].descricao+" id: "+dados[i].id_dimensao_medida+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a nova medida!!!</span>";}
		var d = {html:conteudo,id_dimensao_medida:dados[i].id_dimensao_medida,tipo:"dimensao"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosVariaveis(dados,redesenha){
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++){
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('variavel','"+dados[i].codigo_variavel+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('variavel','"+dados[i].codigo_variavel+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		if(dados[i].nome && dados[i].nome != "")
		{conteudo += "&nbsp;<span>"+dados[i].nome+" - <span style='color:gray;'>"+dados[i].descricao+" id: "+dados[i].codigo_variavel+"</span></span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir a vari&aacute;vel!!!</span>";}
		var d = {html:conteudo,codigo_variavel:dados[i].codigo_variavel,tipo:"variavel"};
		new YAHOO.widget.HTMLNode(d, root, false,true);
	}
	if(redesenha){tree.draw();}
}
function montaDivVariavel(i){
	var param = {
		"linhas":[
	          {titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""},
	          {titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
}
function montaDivMedidaVariavel(i){
	var param = {
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
	var ins = "";
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
	var param = {
		"linhas":[
	          {titulo:"Nome:",id:"Enomedimensao",size:"50",value:i.nomedimensao,tipo:"text",div:""},
	          {titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""},
	          {titulo:"Coluna:",id:"Ecoluna",size:"50",value:i.coluna,tipo:"text",div:""},
	          {titulo:"Agrega valores:",id:"",size:"50",value:i.agregavalores,tipo:"text",div:"<div id=Cagregavalores ></div>"}
		]
	};
	var ins = "";
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
/*
Function: adicionarMedidaVariavel

Adiciona uma nova medida em uma variavel

<ALTERAMEDIDAVARIAVEL>
*/
function adicionarMedidaVariavel(codigo_variavel)
{
	var no = tree.getNodeByProperty("codigo_variavel",codigo_variavel);
	var sUrl = "../php/metaestat.php?funcao=alteraMedidaVariavel&codigo_variavel="+codigo_variavel;
	var callback =
	{
    	success: function(oResponse)
		{
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
function adicionarDimensaoMedida(id_medida_variavel)
{
	var no = tree.getNodeByProperty("id_medida_variavel",id_medida_variavel);
	var sUrl = "../php/metaestat.php?funcao=alteraDimensaoMedida&id_medida_variavel="+id_medida_variavel;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			adicionaNosDimensao(no,[dados],true);
			editar('dimensaoMedida',dados.id_dimensao_medida);
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
	var sUrl = null;
	var callback = {
		success:function(o) {
			try	{
				if(tipo == "variavel"){
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('variavel','"+id+"')","450px","200px","","Editor de vari&aacute;vel");
					montaDivVariavel(dados);
					//document.getElementById("Eid_variavel").style.width = "200px";
				}
				if(tipo == "medidaVariavel"){
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('medidaVariavel','"+id+"')","450px","200px","","Editor de medidas");
					montaDivMedidaVariavel(dados);
					//document.getElementById("Eid_variavel").style.width = "200px";
				}
				if(tipo == "dimensaoMedida"){
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('dimensaoMedida','"+id+"')","450px","200px","","Editor de dimens&oatilde;es");
					montaDivDimensaoMedida(dados);
					//document.getElementById("Eid_variavel").style.width = "200px";
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
	var sUrl = null;
	var callback = {
		success:function(o) {
			try	{
				if(tipo == "medidaVariavel"){
					var ins = "",
						dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("","450px","200px","","SQL");
					ins = "<p><b>Select:</b><p>"+dados.sql;
					ins +="<p><input style='position:relative;top:2px' type='checkbox' id='incluirtodascolunas' />Incluir todas as colunas no resultado";
					ins +="<p>Filtro opcional (exemplo: valor = 1)<br>";
					ins += "<input type=text value='' id='filtrosql' />";
					ins += '<p><input type=button id="sqljson" value="JSON" />';
					//ins +="<p><a href='../php/metaestat.php?funcao=dadosMedidaVariavel&formato=json&id_medida_variavel="+id+"&filtro="+document.getElementById("filtrosql").value+"' target=_blank >JSON </a>";

					$i("editor_bd").innerHTML = ins;
					new YAHOO.widget.Button(sqljson);
					document.getElementById("sqljson-button").onclick = function(){
						var colunas = 0;
						if(document.getElementById("incluirtodascolunas").checked === true){
							colunas = 1;
						}
						window.open('../php/metaestat.php?funcao=dadosMedidaVariavel&formato=json&id_medida_variavel='+id+"&filtro="+document.getElementById("filtrosql").value+"&todasascolunas="+colunas);
					};
					//document.getElementById("Eid_variavel").style.width = "200px";
				}
				if(tipo == "dimensaoMedida"){
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('dimensaoMedida','"+id+"')","450px","200px","","Editor de dimens&oatilde;es");
					montaDivDimensaoMedida(dados);
					//document.getElementById("Eid_variavel").style.width = "200px";
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
function excluir(tipo,id)
{
	var mensagem = " excluindo o registro = "+id;
	var no = null;
	var sUrl = null;
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
  					if(tipo == "variavel"){
  						var no = tree.getNodeByProperty("codigo_variavel",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enome").value+"</b> - <span style='color:gray;'>"+document.getElementById("Edescricao").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "medidaVariavel"){
  						var no = tree.getNodeByProperty("id_medida_variavel",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enomemedida").value+"</b> - <span style='color:gray;'>"+document.getElementById("Eesquemadb").value+" - "+document.getElementById("Etabela").value+" - "+document.getElementById("Ecolunavalor").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "dimensaoMedida"){
  						var no = tree.getNodeByProperty("id_dimensao_medida",id);
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = "<b>"+document.getElementById("Enomedimensao").value+"</b><span style=color:gray > - "+document.getElementById("Edescricao").value+" id: "+id+"</span>";
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
  						no.html = no.getContentEl().innerHTML;
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
	if(prog && par){
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		var sUrl = prog+par;
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