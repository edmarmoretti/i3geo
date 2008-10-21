/*
Title: core.js

Carrega os arquivos js e css básicos utilizados pela interface de administração e define algumas funções de uso geral

File: i3geo/admin/js/core.js

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
/*
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Parâmetros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
var $i = function(id)
{return document.getElementById(id);};
/*
Variable: $mapfiles

Armazena o objeto com a lista de mapfiles
*/
var $mapfiles = "";
/*
Variable: $tags

Armazena o objeto com a lista de tags
*/
var $tags = "";
/*
Variable: $perfis

Armazena o objeto com a lista de perfis
*/
var $perfis = "";
/*
Function: core_movimentaNo

Movimenta um nó para cima ou para baixo na árvore.

Essa função utiliza uma árvore que deve estar armazenada no objeto tree

Parameters:

tipo - sobe|desce

no - objeto no que será movimentado

Return:

true|false - se o movimento ocorreu
*/
function core_movimentaNo(tipo,no)
{
	var movimenta = false
	if(tipo == "sobe")
	{
		var noanterior = no.previousSibling
		if(noanterior)
		{
			if(noanterior.previousSibling && noanterior.data.tipo != "etiqueta")
			{
				tree.popNode(no)
				no.insertBefore(noanterior)
				tree.draw()
				var movimenta = true
			}	 
		}
	}
	if(tipo == "desce")
	{
		var noseguinte = no.nextSibling
		if(noseguinte)
		{
			tree.popNode(no)
			no.insertAfter(noseguinte)
			tree.draw()
			var movimenta = true
		}
	}
	return movimenta;
}
/*
Function: core_handleSuccess

Processa o retorno da chamada em ajax quando tiver sucesso. Esta é uma
função genérica, pouco usada.

Parameters:

o - string retornada pelo ajax
*/
function core_handleSuccess(o)
{
	//div onde será mostrado o log
	if(!$i('logajax'))
	{document.body.innerHTML += "<div id=logajax ></div>";}
	log = $i('logajax');
	YAHOO.log("The success handler was called.  tId: " + o.tId + ".", "info", "example");
	if(o.responseText !== undefined)
	{
		log.innerHTML = "<li>Transaction id: " + o.tId + "</li>";
		log.innerHTML += "<li>HTTP status: " + o.status + "</li>";
		log.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
		log.innerHTML += "<li>HTTP headers: <ul>" + o.getAllResponseHeaders + "</ul></li>";
		log.innerHTML += "<li>Server response: " + o.responseText + "</li>";
		log.innerHTML += "<li>Argument object: Object ( [foo] => " + o.argument.foo + " [bar] => " + o.argument.bar +" )</li>";
	}
}
/*
Function: core_handleFailure

Processa o retorno da chamada em ajax quando tiver falhado.

Parameters:

o - string retornada pelo ajax
*/
function core_handleFailure(o,texto)
{
	//div onde será mostrado o log
	if(!$i('logajax'))
	{return;}
	log = $i('logajax');
	YAHOO.log("The failure handler was called.  tId: " + o.tId + ".", "info", "example");
	if(o.responseText !== undefined)
	{
		log.innerHTML = "<ul><li>Transaction id: " + o.tId + "</li>";
		log.innerHTML += "<li>HTTP status: " + o.status + "</li>";
		log.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
		log.innerHTML += "<li>PHP message: " + texto + "</li></ul>";
	}
	if (!YAHOO.example.container.wait)
	{
    	YAHOO.example.container.wait = new YAHOO.widget.Panel("wait",{width: "240px",fixedcenter: true,close: true,draggable: false,zindex:4,modal: true,visible: false});
		YAHOO.example.container.wait.setHeader("Aguarde...");
		YAHOO.example.container.wait.render(document.body);
	}
	else
	{YAHOO.example.container.wait.setBody(log.innerHTML);}	
}
/*
Function: core_makeRequest

Executa uma chamada em ajax.

Parameters:

sUrl - url que será executada

callback - função que processará o retorno
*/
function core_makeRequest(sUrl,callback,tipo)
{
	if(arguments.length == 2)
	{var tipo = "GET";}
	var request = YAHOO.util.Connect.asyncRequest(tipo, sUrl, callback);
	YAHOO.log("Initiating request; tId: " + request.tId + ".", "info", "example");
}
/*
Function: core_carregando

Mostra uma janela de aguarde

Parameters:

tipo - ativa|desativa|string com uma mensagem
*/
function core_carregando(tipo)
{
	if (!YAHOO.example.container.wait)
	{
    	YAHOO.example.container.wait = new YAHOO.widget.Panel("wait",{width: "240px",fixedcenter: true,close: true,draggable: false,zindex:4,modal: true,visible: false});
		YAHOO.example.container.wait.setHeader("Aguarde...");
		YAHOO.example.container.wait.setBody("<img src=\"../../imagens/aguarde.gif\"/>");		
		YAHOO.example.container.wait.render(document.body);
	}
	YAHOO.example.container.wait.setBody("<img src=\"../../imagens/aguarde.gif\"/>");		
	if(tipo == "ativa")
	{YAHOO.example.container.wait.show();}
	if(tipo == "desativa")
	{YAHOO.example.container.wait.hide();}
	if(tipo != "ativa" && tipo != "desativa")
	{YAHOO.example.container.wait.setBody("<img src=\"../../imagens/aguarde.gif\"/> "+tipo);}	
}
/*
Function: core_dialogoContinua

Mostra um diálogo do tipo sim não

Parameters:

handleYes - função para sim

handleNo - função para não

mensagem - mensagem do diálogo

largura - largura do diálogo em px
*/
function core_dialogoContinua(handleYes,handleNo,mensagem,largura)
{
	// Instantiate the Dialog
	YAHOO.namespace("continua.container");
	YAHOO.continua.container.simpledialog1 = 
		new YAHOO.widget.SimpleDialog("simpledialog1", 
			 { width: largura+"px",
			   fixedcenter: true,
			   visible: false,
			   draggable: false,
			   close: true,
			   text: mensagem,
			   icon: YAHOO.widget.SimpleDialog.ICON_HELP,
			   modal: true,
			   constraintoviewport: true,
			   buttons: [ { text:"Sim", handler:handleYes, isDefault:true },
						  { text:"N&atilde;o",  handler:handleNo } ]
	} );
	YAHOO.continua.container.simpledialog1.setHeader("Tem certeza?");
	YAHOO.continua.container.simpledialog1.render(document.body);
	YAHOO.continua.container.simpledialog1.show();
}
/*
Function: core_ativaPainelAjuda

Parameters:

id - id do elemento que receberá o painel

botao - id do elemento que deverá ser lcicado para abrir o painel
*/
function core_ativaPainelAjuda(id,botao)
{
	if(!YAHOO.example.container.panelAjuda)
	{
		YAHOO.example.container.panelAjuda = new YAHOO.widget.Panel(id, { width:"350px", height:"200px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelAjuda.render();
	}
	if(arguments.length == 2)
	YAHOO.util.Event.addListener(botao, "click", YAHOO.example.container.panelAjuda.show, YAHOO.example.container.panelAjuda, true);
	else
	YAHOO.example.container.panelAjuda.show();
}
/*
Function: core_ativaPainelTexto

Parameters:

id - id do elemento que receberá o painel
*/
function core_ativaPainelTexto(id)
{
	YAHOO.example.container.panelTexto = new YAHOO.widget.Panel(id, { width:"350px", height:"200px",overflow:"auto", visible:false,constraintoviewport:true } );
	YAHOO.example.container.panelTexto.render();
	YAHOO.example.container.panelTexto.show();
}
/*
function: core_pegaPerfis

Pega a lista de perfis

Parameters:

funcao - (opcional) string com o nome da funcao que será executada após a chamada ajax ter tido sucesso

Return

$perfis - variável global com o objeto perfis

$perfisArray - array com a lista de perfis
*/
function core_pegaPerfis(funcao)
{
	if(arguments.length == 0)
	{var funcao = "";}
	//pega a lista de perfis
	var sUrl = "../php/menutemas.php?funcao=pegaPerfis";
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				$perfis = YAHOO.lang.JSON.parse(o.responseText);
  				$perfisArray = new Array();
  				for (i=0;i<$perfis.length;i++)
  				{$perfisArray.push($perfis[i].perfil);}
  				if(funcao != "")
  				eval(funcao);
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_carregando("buscando perfis...");
	core_makeRequest(sUrl,callback)
}
/*
function: core_pegaMapfiles

Pega a lista de mapfiles

Parameters:

funcao - (opcional) nome da funcao que será executada ao terminar a busca pelos dados
*/
function core_pegaMapfiles(funcaoM)
{
	if(arguments.length == 0)
	{var funcao = "";}
	var sUrl = "../php/menutemas.php?funcao=listaMapsTemas";
	var callbackM =
	{
  		success:function(o)
  		{
  			try
  			{
  				$mapfiles = YAHOO.lang.JSON.parse(o.responseText);
  				if(funcaoM != "")
  				eval(funcaoM);
  			}
  			catch(e){core_handleFailure(e.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callbackM)
}
/*
Function: core_comboMapfiles

Cria um combo para escolha do mapfile

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

funcao - string com o nome da função que será executada no evento onchange
*/
function core_comboMapfiles(onde,id,marcar,funcao)
{
	if(arguments.length == 3)
	{var funcao = "";}
	if($mapfiles == "")
	{
		core_pegaMapfiles("core_comboMapfiles('"+onde+"','"+id+"','"+marcar+"','"+funcao+"')")
	}
	else
	{
		if (funcao != "")
		{var funcao = "onchange='"+funcao+"'";}
		ins = "<select  id='"+id+"' "+funcao+" >"
		ins += core_comboObjeto($mapfiles,"","",marcar)
		ins += "</select></p>"
		$i(onde).innerHTML = ins;
	}
}
/*
Function: core_comboPerfis

Cria um combo para escolha de perfil

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

funcao - string com o nome da função que será executada no evento onchange
*/
function core_comboPerfis(onde,id,marcar,funcao)
{
	if(arguments.length == 3)
	{var funcao = "";}
	if($perfis == "")
	{
		core_pegaPerfis("core_comboPerfis('"+onde+"','"+id+"','"+marcar+"','"+funcao+"')")
	}
	else
	{
		if (funcao != "")
		{var funcao = "onchange='"+funcao+"'";}
		ins = "<select  id='"+id+"' "+funcao+" >"
		ins += core_comboObjeto($perfis,"perfil","perfil",marcar)
		ins += "</select></p>"
		$i(onde).innerHTML = ins;
	}
}
/*
Function: core_comboPranchas

Cria um combo para escolha de pranchas de um atlas

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

funcao - string com o nome da função que será executada no evento onchange
*/
function core_comboPranchas(onde,id,marcar,funcao,id_atlas)
{
	var sUrl = "../php/atlas.php?funcao=pegaPranchas&id_atlas="+id_atlas;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{var funcao = "";}
				if (funcao != "")
				{var funcao = "onchange='"+funcao+"'";}
				ins = "<select  id='"+id+"' "+funcao+" >"
				ins += core_comboObjeto(valores,"id_prancha","titulo_prancha",marcar)
				ins += "</select></p>"
				$i(onde).innerHTML = ins;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
/*
Function: core_comboGrupos

Cria um combo para escolha de um grupo

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

funcao - string com o nome da função que será executada no evento onchange
*/
function core_comboGrupos(onde,id,marcar,funcao)
{
	var sUrl = "../php/menutemas.php?funcao=pegaGrupos";
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{var funcao = "";}
				if (funcao != "")
				{var funcao = "onchange='"+funcao+"'";}
				ins = "<select  id='"+id+"' "+funcao+" >"
				ins += core_comboObjeto(valores,"id_grupo","nome_grupo",marcar)
				ins += "</select></p>"
				$i(onde).innerHTML = ins;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
/*
Function: core_comboSubGrupos

Cria um combo para escolha de um sub-grupo

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

funcao - string com o nome da função que será executada no evento onchange
*/
function core_comboSubGrupos(onde,id,marcar,funcao)
{
	var sUrl = "../php/menutemas.php?funcao=pegaSubGrupos";
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{var funcao = "";}
				if (funcao != "")
				{var funcao = "onchange='"+funcao+"'";}
				ins = "<select  id='"+id+"' "+funcao+" >"
				ins += core_comboObjeto(valores,"id_subgrupo","nome_subgrupo",marcar)
				ins += "</select></p>"
				$i(onde).innerHTML = ins;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
/*
Function: core_comboTemas

Cria um combo para escolha de um tema

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

funcao - string com o nome da função que será executada no evento onchange
*/
function core_comboTemas(onde,id,marcar,funcao)
{
	var sUrl = "../php/menutemas.php?funcao=pegaTemas2";
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{var funcao = "";}
				if (funcao != "")
				{var funcao = "onchange='"+funcao+"'";}
				ins = "<select  id='"+id+"' "+funcao+" >"
				ins += core_comboObjeto(valores,"id_tema","nome_tema",marcar)
				ins += "</select></p>"
				$i(onde).innerHTML = ins;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}

/*
function: core_pegaTags

Pega a lista de tags

Parameters:

funcao - (opcional) nome da funcao que será executada ao terminar a busca pelos dados
*/
function core_pegaTags(funcao)
{
	if(arguments.length == 0)
	{var funcao = "";}
	var sUrl = "../php/menutemas.php?funcao=pegaTags";
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				$tags = YAHOO.lang.JSON.parse(o.responseText);
  				if(funcao != "")
  				eval(funcao);
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
/*
Function: core_comboTags

Cria um combo para escolha de tags

Parameters:

onde - id do elemento que receberá o combo

id - id do combo que será criado

marcar - valor que será marcado como selecionado

change - nome da função do evento onchange
*/
function core_comboTags(onde,id,change)
{
	if($tags == "")
	{
		core_pegaTags("core_comboTags('"+onde+"','"+id+"','"+change+"')")
	}
	else
	{
		ins = "<select onchange=\""+change+"(this.value)\" id='"+id+"' >"
		ins += core_comboObjeto($tags,"nome","nome","")
		ins += "</select></p>"
		$i(onde).innerHTML = ins;
	}
}
/*
Function: gera uma janela flutuante com opções de escolha baseadas em checkbox

Parameters:

valores - array com os valores de cada checkbox

textos - array com os nomes de cada checkbox

selecionados - array com os valores marcados

target - objeto para receber o resultado

record - objeto record

key - chave (nome do item)
*/
function core_menuCheckBox(valores,textos,selecionados,target,record,key)
{
	function on_menuCheckBoxChange(p_oEvent)
	{
		var ins = "";
		if(p_oEvent.newValue.get("value") == "OK")
		{
			var cks = $i("core_menuCK_bd").getElementsByTagName("input");
			var ins = new Array();
			for (i=0;i<cks.length;i++)
			{
				if(cks[i].checked)
				ins.push(cks[i].value)
			}
			target.innerHTML = "<pre ><p>"+ins.toString()+"</pre>"
			record.setData(key,ins.toString());
		}
		YAHOO.example.container.panelCK.destroy();
		YAHOO.example.container.panelCK = null;
	};
	if(!YAHOO.example.container.panelCK)
	{
		var novoel = document.createElement("div");
		novoel.id =  "core_menuCK";
		var ndiv = document.createElement("div");
		ndiv.className= "yui-dt-editor";
		ndiv.style.height = "144px";
		ndiv.style.overflow = "auto";
		ndiv.innerHTML = "<div id='core_menuCK_bd'></div>";
		novoel.appendChild(ndiv);
		document.body.appendChild(novoel);
		var og_core = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id", name:"okcancel_checkbox_id", container:"core_menuCK_bd" });
		og_core.addButtons([
            { label: "OK", value: "OK", checked: false},
            { label: "Cancel", value: "CANCEL", checked: false }
        ]);
		og_core.on("checkedButtonChange", on_menuCheckBoxChange);	
		YAHOO.example.container.panelCK = new YAHOO.widget.Overlay("core_menuCK", { zindex:"100",close:false,underlay:false,width:"200px", height:"200px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelCK.render();
	}
	var onde = $i("core_menuCK_bd");
	onde.innerHTML = "";
	for (i=0;i<valores.length;i++)
	{
		var novoCK = document.createElement("div");
		var ck = "";
		for(j=0;j<selecionados.length;j++)
		{
			if(selecionados[j] == valores[i])
			var ck = "CHECKED";
		}
		var ins = "<input type=checkbox id='CK_"+valores[i]+"' value='"+valores[i]+"' "+ck+" />"+textos[i]+"<br>";
		novoCK.innerHTML = ins;
		onde.appendChild(novoCK);
	}
	YAHOO.example.container.panelCK.moveTo(YAHOO.util.Dom.getX(target),YAHOO.util.Dom.getY(target));
	YAHOO.example.container.panelCK.show();
}
/*
Function: core_combosimnao

Retorna os itens option de um combo sim nao
*/
function core_combosimnao(marcar)
{
	var ins = "<option value='' "
	if (marcar == ""){ins += "selected"}
	ins += ">---</option>";
	ins += "<option value='SIM' "
	if (marcar == "sim" || marcar == "SIM"){ins += "selected"}
	ins += ">sim</option>";
	ins += "<option value='NAO' "
	if (marcar == "nao" || marcar == "NAO"){ins += "selected"}
	ins += ">nao</option>";
	return(ins)
}
/*
Function: core_comboObjeto

Retorna os itens option de um combo baseado em um objeto json
*/
function core_comboObjeto(obj,valor,texto,marcar)
{
	var ins = "<option value='' "
	ins += ">---</option>";
	for (var k=0;k<obj.length;k++)
	{
		if(valor != "")
		var v = eval("obj[k]."+valor);
		else
		var v = obj[k];
		if(texto != "")
		var t = eval("obj[k]."+texto);
		else
		var t = obj[k];
		ins += "<option value='"+v+"' "
		if (marcar == v){ins += "selected"}
		ins += ">"+t+"</option>";
	}
	return(ins)
}
/*
Function: core_geraLinhas

Gera campos de formulário

Parameters:

dados - objeto no formato {"linhas":[{titulo:"Nome do tema:",size:"50",id:"Enome_tema",value:i.nome_tema,tipo:"text",div:""}]}
*/
function core_geraLinhas(dados)
{
	var nparam = dados.linhas.length;
	var contaParam = 0
	var resultado = "";
	do
	{
		var p = dados.linhas[contaParam];
		if(p.tipo == "text")
		{
			if(!p.size){p.size = "50";}
			if(p.ajuda)
			{
				var temp = "$i('"+contaParam+"_ajuda').style.display='block' "
				resultado += "<p><div onclick =\""+temp+"\" style=cursor:pointer title='ajuda' ><b>"+p.titulo+"</b></div><br>"
				resultado += "<div id='"+contaParam+"_ajuda' style=display:none >"+p.ajuda+"</div>"
			}
			else
			resultado += "<p><b>"+p.titulo+"</b><br>";
			if(p.texto)
			resultado += "<span style=color:gray >"+p.texto+"</span</p>"
			if(p.id != "")
			resultado += "<input size="+p.size+" type=text id="+p.id+" value='"+p.value+"' /></p>"
			if(p.div)
			{resultado += p.div;}
		}
		contaParam++
	}
	while(contaParam < nparam)
	return(resultado)
}
/*
Function: core_ativaBotaoAdicionaLinha

Ativa o botão que adiciona uma linha em uma tabela no banco de dados e na interface HTML

Essa função utiliza o objeto datatable que deve estar armazenado na variável myDataTable

Parameters:

myDataTable - objeto dataTable do YUI

sUrl - url com o programa que será executado no servidor

idBotao - id do elemento com o botão
*/
function core_ativaBotaoAdicionaLinha(sUrl,idBotao)
{
	if(arguments.length == 1)
	{var idBotao = "adiciona";}
	var adicionalinha = function()
	{
		core_carregando("ativa");
		core_carregando(" adicionando um novo registro");
		var callback =
		{
  			success:function(o)
  			{
  				try
  				{
  					myDataTable.addRow(YAHOO.lang.JSON.parse(o.responseText)[0],0);
  					core_carregando("desativa");
  				}
  				catch(e){core_handleFailure(e,o.responseText);}
  			},
  			failure:core_handleFailure,
  			argument: { foo:"foo", bar:"bar" }
		}; 
		core_makeRequest(sUrl,callback)
	};
	//cria o botão de adição de um novo menu
	var adiciona = new YAHOO.widget.Button(idBotao,{ onclick: { fn: adicionalinha } });
}
/*
Function: core_pegaDados

Busca dados no servidor via Ajax e executa uma função de retorno com os daods

Parameters:

mensagem - mensagem que será mostrada na tela

sUrl - url do programa que será executado no servidor

funcaoRetorno - funcao que será executada ao terminar a busca pelos dados
*/
function core_pegaDados(mensagem,sUrl,funcaoRetorno)
{
	core_carregando(mensagem);
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{eval(funcaoRetorno+"(YAHOO.lang.JSON.parse(o.responseText))");}
  			catch(e){core_handleFailure(o,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
/*
Function: core_gravaLinha

Grava um registro no banco de dados e atualiza o datatable atual

Essa função utiliza o objeto datatable que deve estar armazenado na variável myDataTable

Parameters:

mensagem - mensagem que será mostrada na tela

row - objeto row que foi clicado pelo usuário. Utilizado para se obter os daods do recordset

sUrl - url do programa que será executado
*/
function core_gravaLinha(mensagem,row,sUrl)
{
	core_carregando("ativa");
	core_carregando(mensagem);
	var callback =
	{
  		success:function(o)
  		{
			var rec = myDataTable.getRecordSet().getRecord(row);
			myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0])
  			core_carregando("desativa");
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
/*
Function: core_excluiLinha

Excluí um registro no banco de dados e atualiza o datatable.

Essa função utiliza o objeto datatable que deve estar armazenado na variável myDataTable

Parameters:

sUrl - url do programa que será executado

row - objeto row de um datatable

mensagem -
*/
function core_excluiLinha(sUrl,row,mensagem)
{
	//dialogo
	// Define various event handlers for Dialog
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		core_carregando(mensagem);
		var callback =
		{
  			success:function(o)
  			{
  				try
  				{
  					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  					{
  						core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem outras tabelas com registros vinculados a este</span>");
  						setTimeout("core_carregando('desativa')",3000)
  					}
  					else
  					{
  						myDataTable.deleteRow(row);
  						core_carregando("desativa");
  					}
  				}
  				catch(e){core_handleFailure(o,o.responseText);}
  			},
  			failure:core_handleFailure,
  			argument: { foo:"foo", bar:"bar" }
		}; 
		core_makeRequest(sUrl,callback)
	};
	var handleNo = function()
	{
		this.hide();
	};
	var mensagem = "Exclui o registro?";
	var largura = "300"
	core_dialogoContinua(handleYes,handleNo,mensagem,largura)	
}
/*
Function: core_excluiNoTree

Excluí um registro no banco de dados e atualiza o treeview.

Essa função utiliza o objeto treeview que deve estar armazenado na variável tree

Parameters:

sUrl - url do programa que será executado

no - objeto no de um treeview

mensagem -
*/
function core_excluiNoTree(sUrl,no,mensagem)
{
	//dialogo
	// Define various event handlers for Dialog
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		core_carregando(mensagem);
		var callback =
		{
  			success:function(o)
  			{
  				try
  				{
  					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  					{
  						core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem outras tabelas com registros vinculados a este</span>");
  						setTimeout("core_carregando('desativa')",3000)
  					}
  					else
  					{
						tree.removeNode(no);
						tree.draw()
  						core_carregando("desativa");
  					}
  				}
  				catch(e){core_handleFailure(o,o.responseText);}
  			},
  			failure:core_handleFailure,
  			argument: { foo:"foo", bar:"bar" }
		}; 
		core_makeRequest(sUrl,callback)
	};
	var handleNo = function()
	{
		this.hide();
	};
	var mensagem = "Exclui o registro?";
	var largura = "300"
	core_dialogoContinua(handleYes,handleNo,mensagem,largura)	
}
/**
Function: core_montaEditor

Monta uma janela flutuante com um formulário.

O editor possui um div com id=editor_bd que deve ser usado para incluir o formulário.

Parameters:

funcaoOK - string com o nome da função que será executada quando o botão OK for pressionado.
*/
function core_montaEditor(funcaoOK,w,h)
{	
	if(arguments.length == 0)
	{
		var funcaoOK = "";
		var w = "400px";
		var h = w;
	}
	if(arguments.length < 2)
	{
		var w = "400px";
		var h = w;
	}
	if(funcaoOK != "")
	{
		function on_editorCheckBoxChange(p_oEvent)
		{
			var ins = "";
			if(p_oEvent.newValue.get("value") == "OK")
			{
				eval(funcaoOK);
			}
			else
			{
				YAHOO.example.container.panelEditor.destroy();
				YAHOO.example.container.panelEditor = null;
			}
		};
	}
	if(!YAHOO.example.container.panelEditor)
	{
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor";
		var ins = '<div class="hd">Editor</div>';
		ins += "<div class='bd' style='height:354px;overflow:auto'>";
		ins += "<div id='okcancel_checkbox'></div><div id='editor_bd'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		if(funcaoOK != "")
		{
			var editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id", name:  "okcancel_checkbox_id", container:  "okcancel_checkbox" });
			editorBotoes.addButtons([
            	{ label: "Salva", value: "OK", checked: false},
            	{ label: "Cancela", value: "CANCEL", checked: false }
        	]);
			editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);	
		}
		YAHOO.example.container.panelEditor = new YAHOO.widget.Panel("janela_editor", { fixedcenter:true,close:true,width:w, overflow:"auto",modal: true,visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditor.render();
	}
	YAHOO.example.container.panelEditor.show();
}

//
//carregador de javascript
//
//define o local correto dos programas
//
var scriptLocation = "";
var scripts = document.getElementsByTagName('script');
var i = 0;
for (i = 0; i < scripts.length; i++) {
	var src = scripts[i].getAttribute('src');
	if (src) {
		var index = src.lastIndexOf("core.js");
		// is it found, at the end of the URL?
		if ((index > -1) && (index + "core.js".length == src.length)) {
			scriptLocation = src.slice(0, -"core.js".length);
			break;
		}
	}
}
//
//arquivos javascript que serão carregados
//
/*
<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
<?php if(extension_loaded('zlib')){ob_end_flush();}?>
*/
var jsfiles = new Array(
"../../pacotes/yui252/build/utilities/utilities.php",
"../../pacotes/yui252/build/yahoo-dom-event/yahoo-dom-event.php",
"../../pacotes/yui252/build/element/element-beta-min.js",
"../../pacotes/yui252/build/datasource/datasource-beta-min.js",
"../../pacotes/yui252/build/datatable/datatable-beta-min.php",
"../../pacotes/yui252/build/button/button-min.php",
"../../pacotes/yui252/build/dragdrop/dragdrop-min.php",
"../../pacotes/yui252/build/container/container-min.php",
"../../pacotes/yui252/build/connection/connection-min.js",
"../../pacotes/yui252/build/treeview/treeview-min.js",
"../../pacotes/yui252/build/json/json-min.js",
"../../pacotes/yui252/build/menu/menu-min.js",
"../../pacotes/yui252/build/editor/editor-beta-min.js"
);
//
//arquivos css
//
var cssfiles =new Array(
"../html/admin.css",
"../../pacotes/yui252/build/fonts/fonts-min.css",
"../../pacotes/yui252/build/datatable/assets/skins/sam/datatable.css",
"../../pacotes/yui252/build/button/assets/skins/sam/button.css",
"../../pacotes/yui252/build/container/assets/skins/sam/container.css",
"../../pacotes/yui252/build/treeview/assets/skins/sam/treeview.css",
"../../pacotes/yui252/build/editor/assets/skins/sam/editor.css"
);
//
//carrega os arquivos js
//
var allScriptTags = "";
for (i = 0; i < jsfiles.length; i++)
{
	var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
	allScriptTags += currentScriptTag;
}
document.write(allScriptTags);
//
//carrega os arquivos css
//
var allCssTags = "";
for (i = 0; i < cssfiles.length; i++)
{
	var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
	allCssTags += currentCssTag;
}
document.write(allCssTags);




