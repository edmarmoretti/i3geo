//
//Utilizado por editormapfile.js
//


/*
Function: editorEstilo

Abre o editor de dados gerais de um estilo

<PEGAESTILO>
*/
function editorEstilo(codigoMap,codigoLayer,indiceClasse,indiceEstilo)
{
	core_montaEditor("","450px","500px","","Estilo");
	var sUrl = "../php/editormapfile.php?funcao=pegaEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse+"&indiceEstilo="+indiceEstilo;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorEstilo");
}
function conteudoNoEstilo(codigoMap,codigoLayer,indice,estilo){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','estilo','"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title=sobe src=\"../imagens/34.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','estilo','"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title=desce src=\"../imagens/33.png\" />";
	conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirEstilo('"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;";
	conteudo += "<img width='10px' heigth='10px' style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editorEstilo('"+codigoMap+"','"+codigoLayer+"','"+indice+"','"+estilo+"')\" title='classes' src=\"../imagens/06.png\" />&nbsp;<span>"+estilo+"</span>";
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
		var mensagem = " excluindo "+indiceEstilo;
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
	var mensagem = "Exclui o estilo?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
function montaEditorEstilo(dados)
{
	var limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png";
		param = {
		"linhas":[
			{ajuda:"O s&iacute;mbolo a ser usado para representar as fei&ccedil;&otilde;es. Integer &eacute; o &iacute;ndice do s&iacute;mbolo no symbolset, come&ccedil;ando em 1 (o quinto s&iacute;mbolo &eacute; o s&iacute;mbolo 5). String &eacute; o nome do s&iacute;mbolo (como definido usando o par&acirc;metro SYMBOL NAME). Filename especifica o caminho para um arquivo contendo um s&iacute;mbolo. Por exemplo, um arquivo PNG. Especifique o caminho relativo ao diret&oacute;rio contendo o mapfile. URL especifica o endere&ccedil;o de um arquivo contendo um s&iacute;mbolo pixmap. Por exemplo, um arquivo PNG. Uma URL deve come&ccedil;ar com &#8220;http&#8221;. Exemplo: SYMBOL &#8220;http://myserver.org/path/to/file.png . [ATRIBUTO] permite representa&ccedil;&atilde;o individual de fei&ccedil;&otilde;es usando um atributo no conjunto de dados que especifica o nome do s&iacute;mbolo (como definido usando o par&acirc;metro SYMBOL NAME). S&atilde;o necess&aacute;rios os colchetes []. Se SYMBOL n&atilde;o for especificado, o comportamento depende do tipo de fei&ccedil;&atilde;o: Para pontos, nada ser&aacute; representado; Para linhas, SYMBOL s&oacute; &eacute; relevante se voc&ecirc; quer estilizar as linhas utilizando s&iacute;mbolos, ent&atilde;o a aus&ecirc;ncia de SYMBOL significa que voc&ecirc; ter&aacute; as linhas como especificadas utilizando os par&acirc;metros de representa&ccedil;&atilde;o de linhas (COLOR, WIDTH, PATTERN, LINECAP, etc.); Para pol&iacute;gonos, o interior dos pol&iacute;gonos ser&aacute; representado utilizando um preenchimento s&oacute;lido da cor especificada no par&acirc;metro COLOR.",
			titulo:"Symbolname (pode ser utilizado uma imagem, exemplo: /var/www/i3geo/imagensteste.png) :",id:"",value:dados.symbolname,tipo:"text",div:"<div id=cSymbolname ></div>"},
			{ajuda:"Cor a ser utilizada para desenhar fei&ccedil;&otilde;es.",
			titulo:"Color",id:"color",value:dados.color,tipo:"cor"},
			{ajuda:"Cor de fundo a ser utilizada para desenhar fei&ccedil;&otilde;es.",
			titulo:"Backgroundcolor",id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
			{ajuda:"Tamanho, em SIZEUNITS, do SYMBOL/PATTERN a ser usado. O valor padr&atilde;o depende do tipo do s&iacute;mbolo: para pixmap, o tamanho (em pixeis) do pixmap; para ellipse e vector, o valor m&aacute;ximo de y do par&acirc;metro SYMBOL POINTS; para hatch, 1,0; para truetype, 1,0. Quando a escala de s&iacute;mbolos &eacute; utilizada (SYMBOLSCALEDENOM &eacute; utilizado no n&iacute;vel da LAYER) o SIZE define o tamanho - de acordo com o SIZEUNITS da camada - do SYMBOL /PATTERN a ser usado na escala 1:SYMBOLSCALEDENOM. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia de centro a centro entre as linhas. [ATRIBUTO] especifica um atributo a ser usado para usar como valor de tamanho. Os colchetes [] s&atilde;o necess&aacute;rios.",
			titulo:"Size",id:"size",value:dados.size,tipo:"text"},
			{ajuda:"Cor usada para contornar pol&iacute;gonos e alguns s&iacute;mbolos de marcadores (marker). N&atilde;o possui efeito para linhas. A largura do contorno pode ser especificada usando WIDTH. Se n&atilde;o for especificado nenhum WIDTH, ser&aacute; tra&ccedil;ado um contorno de 1 pixel de largura. Se h&aacute; algum s&iacute;mbolo definido em STYLE, ser&aacute; criado um contorno para este s&iacute;mbolo (somente ellipse, truetype e polygon vector ganhar&atilde;o um contorno). Se n&atilde;o houver s&iacute;mbolo definido em STYLE, o pol&iacute;gono ganhar&aacute; um contorno. [ATRIBUTO] especifica um atributo a ser usado para usar como valor de cor. Os colchetes [] s&atilde;o necess&aacute;rios.",
			titulo:"Outlinecolor",id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
			{ajuda:"WIDTH se refere &agrave; espessura da linha desenhada, em pixeis. Padr&atilde;o &eacute; 1. Quando a escala de s&iacute;mbolos &eacute; utilizada (SYMBOLSCALEDENOM &eacute; utilizado no n&iacute;vel da LAYER) o WIDTH define a espessura da linha - de acordo com o SIZEUNITS da camada &#8211; em rela&ccedil;&atilde;o &agrave; escala 1:SYMBOLSCALEDENOM. Se utilizado com SYMBOL e OUTLINECOLOR, WIDTH define a espessura do contorno dos s&iacute;mbolos. Isto se aplica para os s&iacute;mbolos do tipo  ellipse, truetype e polygon vector. Para linhas, WIDTH especifica a espessura da linha. Para pol&iacute;gonos, se utilizado com OUTLINECOLOR, WIDTH especifica a espessura da linha do pol&iacute;gono. Para um s&iacute;mbolo do tipo hatch, WIDTH especifica a largura das linhas hachuradas. [ATRIBUTO] especifica o atributo a ser usado para valores de WIDTH. Os colchetes [] s&atilde;o necess&aacute;rios.",
			titulo:"Width",id:"width",value:dados.width,tipo:"text"},
			{ajuda:"Tamanho m&iacute;nimo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 0. S&oacute; &eacute; &uacute;til quando usada escala de s&iacute;mbolos. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia entre linhas hachuradas.",
			titulo:"Minsize",id:"minsize",value:dados.minsize,tipo:"text"},
			{ajuda:"Tamanho m&aacute;ximo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 500.",
			titulo:"Maxsize",id:"maxsize",value:dados.maxsize,tipo:"text"},
			{ajuda:"Valor de deslocamento no eixo x para s&iacute;mbolos com sombras, vazios etc.",
			titulo:"Offsetx",id:"offsetx",value:dados.offsetx,tipo:"text"},
			{ajuda:"Valor de deslocamento no eixo y para s&iacute;mbolos com sombras, vazios etc.",
			titulo:"Offsety",id:"offsety",value:dados.offsety,tipo:"text"},
			{ajuda:"Ativa ou desativa o antialias para fontes truetype.",
			titulo:"Antialias",id:"antialias",value:dados.antialias,tipo:"text"},
			{ajuda:"Tamanho m&iacute;nimo em pixeis para desenhar uma linha. Padr&atilde;o &eacute; 0.",
			titulo:"Minwidth",id:"minwidth",value:dados.minwidth,tipo:"text"},
			{ajuda:"Tamanho m&aacute;ximo em pixeis para desenhar uma linha. Padr&atilde;o &eacute; 32.",
			titulo:"Maxwidth",id:"maxwidth",value:dados.maxwidth,tipo:"text"},
			{ajuda:"&Acirc;ngulo, em graus, para rotacionar um s&iacute;mbolo (sentido anti-hor&aacute;rio). Padr&atilde;o &eacute; 0 (sem rota&ccedil;&atilde;o). Para pontos, especifica a rota&ccedil;&atilde;o de um s&iacute;mbolo em rela&ccedil;&atilde;o a seu centro. Para linhas estilizadas, o comportamento depende do valor do elemento GAP. Para valores de GAP negativos, ele especifica o rotacionamento de um s&iacute;mbolo relativo &agrave; dire&ccedil;&atilde;o da linha. Um &acirc;ngulo de 0 significa que o eixo x do s&iacute;mbolo &eacute; orientado juntamente com a dire&ccedil;&atilde;o da linha. Se o valor do GAP for positivo, ele especifica o rotacionamento do s&iacute;mbolo em rela&ccedil;&atilde;o ao seu pr&oacute;prio centro.",
			titulo:"Angle",id:"angle",value:dados.angle,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<input type='text' value='"+dados.symbolname+"' id='symbolname' size='50'>";
	temp += "<img onclick='selNavegador(\"symbolname\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
	temp += "<div id='listaSimbolos' style='overflow:auto;width:350px;height:50px;'></div>";
	$i("cSymbolname").innerHTML = temp;

	var temp = function()
	{salvarDadosEditor('estilo',dados.codigoMap,dados.codigoLayer,dados.indiceClasse,dados.indiceEstilo);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});

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
	core_carregando(" adicionando um novo estilo");
	sUrl = "../php/editormapfile.php?funcao=criarNovoEstilo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
				{
					core_carregando("<span style=color:red >Erro</span>");
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
