YAHOO.namespace("admin.container");
/*
Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2012 Edmar Moretti
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

*/
/*
Function: initMenu

Inicializa o editor de mapas
*/
function initMenu()
{
	ativaBotaoAdiciona("../php/metaestat.php?funcao=alteraMapa","adiciona");
	new YAHOO.widget.Button("upload",{ onclick: { fn: function(){
		core_montaEditor();
		$i("editor_bd").innerHTML = formUploadImagem();
	} } });
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaDados("buscando mapas...","../php/metaestat.php?funcao=listaMapas","montaArvore");
}
function ativaBotaoAdiciona(sUrl,idBotao)
{
	var adiciona = function(){
		core_carregando("ativa");
		core_carregando(" adicionando um novo registro");
		var callback =
		{
				success:function(o)
				{
					try
					{
						var j = YAHOO.lang.JSON.parse(o.responseText);
					adicionaNosMapa([j],true);
					editar("mapa",j.id_mapa);
						core_carregando("desativa");
					}
					catch(e){core_handleFailure(e,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
}
function formUploadImagem(){
	var ins = '' +
	'<form id=uploadimagem target="i3GEOuploadiframe" action="../php/metaestat_mapa_uploadimagem.php" method="post" ENCTYPE="multipart/form-data" >' +
		'<p>Imagem (jpg ou png) se o arquivo j&aacute; existir, ser&aacute; substitu&iacute;do: <br><input type="file" size=22 name="uploadimagem" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p><input type="submit" size=12 name="submit">' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="1000000">' +
	'</form>' +
	'<iframe name=i3GEOuploadiframe style="text-align:left;border:1px solid gray;" width="98%" height="160px"></iframe>';
	return ins;
}
/*
Function: montaArvore

Monta a &aacute;rvore de edi&ccedil;&atilde;o

<PEGAPRANCHAS>
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
			var sUrl = "../php/metaestat.php?funcao=listaGruposMapa&id_mapa="+node.data.id_mapa;
			var callback =
			{
				success: function(oResponse)
				{
					var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
					adicionaNosGrupos(node,dados,false);
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
			tree.setDynamicLoad(loadNodeData, 1);
			var root = tree.getRoot();
			var tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.isLeaf = true;
			core_carregando("desativa");
		}
		buildTree();
	}();
		adicionaNosMapa(dados);
		tree.draw();
}
function testarMapfile(codigoMap)
{
	window.open("../../testamapfile.php?map="+codigoMap+".map");
}
function adicionaNosTemas(no,dados,redesenha)
{
	if(!redesenha)
	{
		var conteudo = "<span onclick=\"adicionarTema('"+no.data.id_mapa_grupo+"')\" style=\"cursor:pointer;\" ><img style=\"position:relative;top:0px\" width='10px' heigth='10px' src=\"../imagens/05.png\" /><i>Adicionar novo tema:</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		if(dados[i].titulo == "null" || !dados[i].titulo || dados[i].id_mapa_tema == "")
		{dados[i].titulo = "";}
		var conteudo = "";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('tema','"+dados[i].id_mapa_tema+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('tema','"+dados[i].id_mapa_tema+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />";
		if(dados[i].id_mapa_tema != "")
		{conteudo += "&nbsp;<span>"+dados[i].titulo+"</span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o tema!!!</span>";}
		var d = {html:conteudo,id_mapa_tema:dados[i].id_mapa_tema,tipo:"tema"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosGrupos(no,dados,redesenha)
{
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
	function loadTemasData(node, fnLoadComplete)
	{
		var sUrl = "../php/metaestat.php?funcao=listaTemasMapa&id_mapa_grupo="+node.data.id_mapa_grupo;
		var callback =
		{
			success: function(oResponse)
			{
				var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
				adicionaNosTemas(node,dados,false);
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
	if(!redesenha)
	{
		var conteudo = "<span style=\"cursor:pointer;\" onclick=\"adicionarGrupo('"+no.data.id_mapa+"')\" ><img style=\"position:relative;top:2px\" src=\"../imagens/05.png\" /><i>Adicionar grupo de temas</i></span>";
		var d = {html:conteudo};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('grupo','"+dados[i].id_mapa_grupo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('grupo','"+dados[i].id_mapa_grupo+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />";
		if(dados[i].titulo != "")
		{conteudo += "&nbsp;<span>"+dados[i].titulo+"</span>";}
		else
		{conteudo += "&nbsp;<span style=color:red >Edite para definir o grupo!!!</span>";}
		var d = {html:conteudo,id_mapa_grupo:dados[i].id_mapa_grupo,tipo:"grupo"};
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		//tempNode.isLeaf = true;
		tempNode.setDynamicLoad(loadTemasData, temaIconMode);
	}
	if(redesenha){tree.draw();}
}
function adicionaNosMapa(dados,redesenha)
{
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"excluir('mapa','"+dados[i].id_mapa+"')\" title=excluir src=\"../imagens/01.png\" />";
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('mapa','"+dados[i].id_mapa+"')\" title=editar src=\"../imagens/06.png\" /><b>";
		conteudo += "&nbsp;<img style=\"width:25px;position:relative;cursor:pointer;top:2px\" onclick=\"testaMapaTemplate(\'"+dados[i].template+"\',"+dados[i].id_mapa+")\" title=editar src=\"../../imagens/i3geo2.jpg\" /><b>";
		if(dados[i].titulo != "")
		{conteudo += "&nbsp;id "+dados[i].id_mapa+" - <span>"+dados[i].titulo+"</span>";}
		else
		{conteudo += "&nbsp;id "+dados[i].id_mapa+" - <span style=color:red >Edite para definir o Mapa!!!</span>";}
		var d = {html:conteudo,id_mapa:dados[i].id_mapa,tipo:"mapa"};
		new YAHOO.widget.HTMLNode(d, root, false,true);
	}
	if(redesenha){tree.draw();}
}
function testaMapaTemplate(template,id_mapa){
	if(template == ""){
		alert("Template nao definido");
		return;
	}
	var p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaTemplatesMapa";
	i3GEO.util.ajaxGet(p,function(retorno){
		var url = i3GEO.configura.locaplic+retorno.metaestatTemplates+"/"+template+"?id="+id_mapa;
		window.open(url,"_blank");
	});
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
				if(tipo == "mapa")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('mapa','"+id+"')");
					$i("editor_bd").innerHTML = montaDivMapa(dados);
					core_carregando("desativa");
				}
				if(tipo == "grupo")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('grupo','"+id+"')");
					$i("editor_bd").innerHTML = montaDivGrupo(dados);
					core_carregando("desativa");
				}
				if(tipo == "tema")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					core_montaEditor("gravaDados('tema','"+id+"')");
					montaDivTema(dados);
					core_carregando("desativa");
				}
				core_carregando("desativa");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	if(tipo == "mapa")
	{sUrl = "../php/metaestat.php?funcao=listaMapas&id_mapa="+id;}
	if(tipo == "grupo")
	{sUrl = "../php/metaestat.php?funcao=listaGruposMapa&id_mapa_grupo="+id;}
	if(tipo == "tema")
	{sUrl = "../php/metaestat.php?funcao=listaTemasMapa&id_mapa_tema="+id;}
	if(sUrl)
	{core_makeRequest(sUrl,callback);}
}
function montaDivTema(i){
	var sUrl = "../php/metaestat.php?funcao=arvoreVar&dadosGerenciais=nao&detalhes=nao",
		ins = "",
		callback = {
			success:function(o){
				var o = YAHOO.lang.JSON.parse(o.responseText),
					n = o.length,
					m,i,j,filhos,a,b;
				//monta os divs onde entrarao as arvores
				for(i=0;i<n;i++){
					ins += "<div id=arvore_"+i+" >"+o[i].titulo+"</div>";
				}
				$i("editor_bd").innerHTML = ins;
				//monta as arvores
				for(i=0;i<n;i++){
					a = [];
					filhos = o[i].filhos;
					m = filhos.length;
					for(j=0;j<m;j++){
						b = {};
						b.text = filhos[j].titulo;
						b.url = 'javascript:$i(\"Eid_medida_variavel\").value=\"'+filhos[j].id+'\"';
						a.push(b);
					}
					core_arvore(o[i].titulo,"arvore_"+i,{"propriedades":a});

				}
				//ins += "<br><div>"+YAHOO.lang.JSON.parse(o.responseText)+"</div>";
				//$i("editor_bd").innerHTML = ins;
			},
			failure: function(){return ins;},
			argument: { foo:"foo", bar:"bar" }
		},
		param = {
			"linhas":[
			{titulo:"T&iacute;tulo:",id:"Etitulo",size:"50",value:i.titulo,tipo:"text",div:""},
			{titulo:"ID da medida de uma vari&aacute;vel (clique nos links abaixo para escolher):",id:"Eid_medida_variavel",size:"50",value:i.id_medida_variavel,tipo:"text",div:""}
			]
		};
	ins += core_geraLinhas(param);
	core_makeRequest(sUrl,callback);
}
function montaDivGrupo(i)
{
	var param =
	{
		"linhas":[
		{titulo:"T&iacute;tulo:",id:"Etitulo",size:"50",value:i.titulo,tipo:"text",div:""}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	return(ins);
}
function montaDivMapa(i)
{
	var limg=i3GEO.configura.locaplic+"/imagens/crialeg.jpg",
		param =
		{
			"linhas":[
			{titulo:"T&iacute;tulo:",id:"Etitulo",size:"50",value:i.titulo,tipo:"text",div:""},
			{titulo:"Template (<a href='../php/metaestat_templates.php' target='_blank'>pr&eacute;via</a>) <img onclick='selTemplate(\"Etemplate\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>:",id:"Etemplate",size:"50",value:i.template,tipo:"text",div:""},
			{titulo:"Logo (esquerdo) <img onclick='selLogo(\"Elogoesquerdo\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>:",id:"Elogoesquerdo",size:"50",value:i.logoesquerdo,tipo:"text",div:""},
			{titulo:"Logo (direito) <img onclick='selLogo(\"Elogodireito\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>::",id:"Elogodireito",size:"50",value:i.logodireito,tipo:"text",div:""}
			]
		},
		ins = "";
	ins += core_geraLinhas(param);
	ins += "Publicado?<br>";
	ins += "<select id='Epublicado' >";
	ins += core_combosimnao(i.publicado);
	ins += "</select>";
	return(ins);
}
function selLogo(id){
	var callback = {
		success:function(o){
			try	{
				var dados = YAHOO.lang.JSON.parse(o.responseText).nomes,
				n = dados.length,
				i,
				valores = [],
				textos = [],
				selecionados = [$i(id).value];
				for(i=0;i<n;i++){
					valores.push(dados[i]);
					textos.push(dados[i]);
				}
				core_menuCheckBox(valores,textos,selecionados,$i(id),"","","sim");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaLogosMapa",callback);
}
function selTemplate(id){
	var callback = {
		success:function(o){
			try	{
				var dados = YAHOO.lang.JSON.parse(o.responseText).nomes,
				n = dados.length,
				i,
				valores = [],
				textos = [],
				selecionados = [$i(id).value];
				for(i=0;i<n;i++){
					if(dados[i].split(".")[1] === "php"){
						valores.push(dados[i]);
						textos.push(dados[i]);
					}
				}
				core_menuCheckBox(valores,textos,selecionados,$i(id),"","","sim");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaTemplatesMapa",callback);
}
function excluir(tipo,id)
{
	var mensagem = " excluindo o registro do id= "+id;
	var no = null;
	var sUrl = null;
	if(tipo == "mapa")
	{
		no = tree.getNodeByProperty("id_mapa",id);
		sUrl = "../php/metaestat.php?funcao=excluirMapa&id_mapa="+id;
	}
	if(tipo == "grupo")
	{
		no = tree.getNodeByProperty("id_mapa_grupo",id);
		sUrl = "../php/metaestat.php?funcao=excluirMapaGrupo&id_mapa_grupo="+id;
	}
	if(tipo == "tema")
	{
		no = tree.getNodeByProperty("id_tema",id);
		sUrl = "../php/metaestat.php?funcao=excluirMapaTema&id_mapa_tema="+id;
	}
	if(sUrl)
	{core_excluiNoTree(sUrl,no,mensagem);}
}
/*
Function: adicionarTema

Adiciona um novo tema

<ALTERARTEMA>
*/
function adicionarTema(id)
{
	var no = tree.getNodeByProperty("id_mapa_grupo",id);
	var sUrl = "../php/metaestat.php?funcao=alteraMapaTema&id_mapa_grupo="+id;
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			adicionaNosTemas(no,[dados],true);
			editar('tema',dados.id_mapa_tema);
		},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
function adicionarGrupo(id_mapa)
{
	var no = tree.getNodeByProperty("id_mapa",id_mapa);
	var sUrl = "../php/metaestat.php?funcao=alteraMapaGrupo&id_mapa="+id_mapa;
	var callback =
	{
		success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText);
			adicionaNosGrupos(no,[dados],true);
			editar('grupo',dados.id_mapa_grupo);
		},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: gravaDados

Altera dados de um elemento do Mapa

<ALTERARATLAS>

<ALTERARPRANCHA>

<ALTERARTEMA>
*/
function gravaDados(tipo,id)
{
	var campos = null;
	var par = null;
	var prog = null;
	if(tipo == "mapa")
	{
		campos = new Array("titulo","template","logoesquerdo","logodireito","publicado");
		par = "&id_mapa="+id;
		prog = "../php/metaestat.php?funcao=alteraMapa";
	}
	if(tipo == "grupo")
	{
		campos = new Array("titulo");
		par = "&id_mapa_grupo="+id;
		prog = "../php/metaestat.php?funcao=alteraMapaGrupo";
	}
	if(tipo == "tema")
	{
		campos = new Array("titulo","id_medida_variavel");
		par = "&id_mapa_tema="+id;
		prog = "../php/metaestat.php?funcao=alteraMapaTema";
	}
	for (var i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i("E"+campos[i]).value);}

	var callback =
	{
			success:function(o)
			{
				try
				{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
					{
						core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem menus vinculados a este tema</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else
					{
						if(tipo == "mapa")
						{
							var no = tree.getNodeByProperty("id_mapa",id);
							no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Etitulo").value;
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
							no.html = no.getContentEl().innerHTML;
						}
						if(tipo == "grupo")
						{
							var no = tree.getNodeByProperty("id_mapa_grupo",id);
							no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Etitulo").value;
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
							no.html = no.getContentEl().innerHTML;
						}
						if(tipo == "tema")
						{
							var no = tree.getNodeByProperty("id_mapa_tema",id);
							no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Etitulo").value;
						no.getContentEl().getElementsByTagName("span")[0].style.color = "";
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
	if(prog && par){
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		var sUrl = prog+par;
		core_makeRequest(sUrl,callback,'POST');
	}
}
/*
Function: abreMapa

Abre o Mapa para teste
*/
function abreMapa(id){
	window.open("../../classesphp/atlas_controle.php?atlasId_="+id+"&funcao=criaMapa","blank");
}
