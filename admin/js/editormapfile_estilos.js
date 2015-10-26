//
//Utilizado por editormapfile.js
//
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//

/*
Function: editorEstilo

Abre o editor de dados gerais de um estilo

<PEGAESTILO>
*/
function editorEstilo(codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorEstilo");
}
function conteudoNoEstilo(codigoMap,codigoLayer,indice,estilo){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','estilo','"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title="+ $trad("sobe",i3GEOadmin.core.dicionario) +" src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','estilo','"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title="+ $trad("desce",i3GEOadmin.core.dicionario) +" src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirEstilo('"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title="+ $trad("excluir",i3GEOadmin.core.dicionario) +" width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;";
	conteudo += "<img width='10px' heigth='10px' style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editorEstilo('"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title='"+ $trad("classes",i3GEOadmin.core.dicionario) +"' src=\"../imagens/06.png\" />&nbsp;<span>"+estilo+"</span>";
	var d = {estilos:codigoMap+"_"+codigoLayer+"_"+indice,html:conteudo,id:codigoMap+"_"+codigoLayer+"_"+indice+"_"+estilo,codigoMap:codigoMap,codigoLayer:codigoLayer,indiceClasse:indice,indiceEstilo:estilo};
	return d;
}
/*
Function: excluirEstilo

Exclui um estilo

<EXCLUIRESTILO>
*/
function excluirEstilo(codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		var mensagem = $trad("msgExcluiMap",i3GEOadmin.core.dicionario)+indiceEstilo;
		core_carregando(mensagem);
		var sUrl = "../php/editormapfile.php?funcao=excluirEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
		var callback =
		{
			success:function(o)
			{
				try
				{
					var no = tree.getNodesByProperty("id",codigoMap+"_"+codigoLayer+"_"+indiceClasse+"_"+indiceEstilo);
					tree.removeNode(no[0]);
					tree.draw();
					core_carregando("desativa");
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	var handleNo = function()
	{this.hide();};
	var mensagem = $trad("excluiEstilo",i3GEOadmin.editormapfile.dicionario);
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
function montaEditorEstilo(dados)
{
	var temp = function(){
		salvarDadosEditor('estilo',dados.codigoMap,dados.codigoLayer,dados.indiceClasse,dados.indiceEstilo);
	};
	core_montaEditor(temp,"450px","650px","","Estilo",true,true,false);

	var limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png";
		param = {
		"linhas":[
			{ajuda:$trad("symbolname",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("symbolnameTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.symbolname,tipo:"text",div:"<div id=cSymbolname ></div>"},
			{ajuda:$trad("color",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("colorTitulo",i3GEOadmin.editormapfile.dicionario),id:"color",value:dados.color,tipo:"cor"},
			{ajuda:$trad("backgroundcolor",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("backgroundcolorTitulo",i3GEOadmin.editormapfile.dicionario),id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
			{ajuda:$trad("size",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("sizeTitulo",i3GEOadmin.editormapfile.dicionario),id:"size",value:dados.size,tipo:"text"},
			{ajuda:$trad("outlinecolor",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("outlinecolorTitulo",i3GEOadmin.editormapfile.dicionario),id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
			{ajuda:$trad("width",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("widthTitulo",i3GEOadmin.editormapfile.dicionario),id:"width",value:dados.width,tipo:"text"},
			{ajuda:$trad("minsize",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("minsizeTitulo",i3GEOadmin.editormapfile.dicionario),id:"minsize",value:dados.minsize,tipo:"text"},
			{ajuda:$trad("maxsize",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("maxsizeTitulo",i3GEOadmin.editormapfile.dicionario),id:"maxsize",value:dados.maxsize,tipo:"text"},
			{ajuda:$trad("offsetx",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("offsetxTitulo",i3GEOadmin.editormapfile.dicionario),id:"offsetx",value:dados.offsetx,tipo:"text"},
			{ajuda:$trad("offsety",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("offsetyTitulo",i3GEOadmin.editormapfile.dicionario),id:"offsety",value:dados.offsety,tipo:"text"},
			{ajuda:$trad("antialias",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("antialiasTitulo",i3GEOadmin.editormapfile.dicionario),id:"antialias",value:dados.antialias,tipo:"text"},
			{ajuda:$trad("minwidth",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("minwidthTitulo",i3GEOadmin.editormapfile.dicionario),id:"minwidth",value:dados.minwidth,tipo:"text"},
			{ajuda:$trad("maxwidth",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("maxwidthTitulo",i3GEOadmin.editormapfile.dicionario),id:"maxwidth",value:dados.maxwidth,tipo:"text"},
			{ajuda:$trad("angle",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("angleTitulo",i3GEOadmin.editormapfile.dicionario),id:"angle",value:dados.angle,tipo:"text"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<input type='text' value='"+dados.symbolname+"' id='symbolname' size='50'>";
	temp += "<img onclick='selNavegador(\"symbolname\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
	temp += "<div id='listaSimbolos' style='overflow:auto;width:350px;height:50px;'></div>";
	$i("cSymbolname").innerHTML = temp;

	escolheSimbolo = function(nome){
		$i("symbolname").value = nome;
	};
	//lista os simbolos
	var sUrl = "../php/editormapfile.php?funcao=editasimbolo&tipo="+dados.type+"&opcao=listaSimbolos&onclick=escolheSimbolo(this.title)";
	var callback =
	{
			success:function(o)
			{
				try
				{
				var re = new RegExp("ms_tmp", "g");
				var t = o.responseText.replace(re,"../../../ms_tmp/");
				var re = new RegExp("\\\\", "g");
				t = t.replace(re,"");
				$i("listaSimbolos").innerHTML = t;
				}
				catch(e){}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback,'POST');
}
/*
Function: adicionaNovoEstilo

Adiciona um novo estilo

<CRIARNOVOESTILO>
*/
function adicionaNovoEstilo(codigoMap,codigoLayer,indiceClasse)
{
	core_carregando("ativa");
	core_carregando($trad("msgNovoEstilo",i3GEOadmin.editormapfile.dicionario));
	sUrl = "../php/editormapfile.php?funcao=criarNovoEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >"+ $trad("erro",i3GEOadmin.core.dicionario) +"</span>");
					setTimeout("core_carregando('desativa')",3000);
				}
				else
				{
					var no = tree.getNodeByProperty("etiquetaEstilo",codigoMap+"_"+codigoLayer+"_"+indiceClasse);
					var dados = YAHOO.lang.JSON.parse(o.responseText);
					var d = conteudoNoEstilo(codigoMap,codigoLayer,indiceClasse,dados[0].estilo);
					var tempNode = new YAHOO.widget.HTMLNode(d,no, false,true);
					tempNode.isLeaf = true;
					tempNode.enableHighlight = false;
					tree.draw();
					core_carregando("desativa");
				}
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
