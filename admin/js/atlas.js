YAHOO.namespace("example.container");
function initMenu()
{
	ativaBotaoAdicionaAtlas("../php/atlas.php?funcao=alterarAtlas","adiciona")
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaPerfis("pegaAtlas()");
}
function ativaBotaoAdicionaAtlas(sUrl,idBotao)
{
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
  					adicionaNosAtlas(YAHOO.lang.JSON.parse(o.responseText),true);
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
	var adiciona = new YAHOO.widget.Button(idBotao,{ onclick: { fn: adiciona } });
}
function pegaAtlas()
{
	core_pegaDados("buscando atlas...","../php/atlas.php?funcao=pegaAtlas","montaArvore")
}
function montaArvore(dados)
{
	YAHOO.example.treeExample = new function()
	{
		var currentIconMode;
		tree = "";
		function changeIconMode()
		{
			var newVal = parseInt(this.value);
			if (newVal != currentIconMode)
			{currentIconMode = newVal;}
			buildTree();
		}
        function loadNodeData(node, fnLoadComplete)
        {
			var sUrl = "../php/atlas.php?funcao=pegaPranchas&id_atlas="+node.data.id_atlas;
			var callback =
			{
                success: function(oResponse)
                {
                    var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
					adicionaNosPranchas(node,dados,false)
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
			tree.setDynamicLoad(loadNodeData, currentIconMode);
			var root = tree.getRoot();
			var tempNode = new YAHOO.widget.TextNode('', root, false);
			tempNode.isLeaf = true;
			core_carregando("desativa");
        }
    	buildTree();
	}();
   	adicionaNosAtlas(dados)
   	tree.draw();
}
function adicionaNosTemas(no,dados,redesenha)
{
	if(!redesenha)
	{
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"adicionarTema('"+no.data.id_prancha+"')\" title='adiciona tema' width='10px' heigth='10px' src=\"../imagens/05.png\" />"
		var d = {html:conteudo+"<i>Temas:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','tema','"+dados[i].id_tema+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','tema','"+dados[i].id_tema+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('tema','"+dados[i].id_tema+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('tema','"+dados[i].id_tema+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados[i].codigo_tema+"</span>"
		var d = {html:conteudo,id_tema:dados[i].id_tema,tipo:"tema"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	if(redesenha){tree.draw();}
}
function adicionaNosPranchas(no,dados,redesenha)
{
	function temaIconMode()
	{
		var newVal = parseInt(this.value);
		if (newVal != currentIconMode)
		{currentIconMode = newVal;}
	}
    function loadTemasData(node, fnLoadComplete)
    {
		var sUrl = "../php/atlas.php?funcao=pegaTemas&id_prancha="+node.data.id_prancha;
		var callback =
		{
            success: function(oResponse)
            {
                var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
				adicionaNosTemas(node,dados,false)
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
		var conteudo = "<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"adicionarPrancha('"+no.data.id_atlas+"')\" title='adiciona prancha' src=\"../imagens/05.png\" />"
		var d = {html:conteudo+"<i>Pranchas:</i>"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		tempNode.isLeaf = true;
	}
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','prancha','"+dados[i].id_prancha+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','prancha','"+dados[i].id_prancha+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluir('prancha','"+dados[i].id_prancha+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"editar('prancha','"+dados[i].id_prancha+"')\" title=editar width='10px' heigth='10px' src=\"../imagens/06.png\" />&nbsp;<span>"+dados[i].titulo_prancha+"</span>"
		var d = {html:conteudo,id_prancha:dados[i].id_prancha,tipo:"prancha"}
		var tempNode = new YAHOO.widget.HTMLNode(d, no, false,true);
		//tempNode.isLeaf = true;
		tempNode.setDynamicLoad(loadTemasData, temaIconMode);
	}
	if(redesenha){tree.draw();}
}

function adicionaNosAtlas(dados,redesenha)
{
	var root = tree.getRoot();
	for (var i=0, j=dados.length; i<j; i++)
	{
		var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('sobe','atlas','"+dados[i].id_atlas+"')\" title=sobe src=\"../imagens/34.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"sobeDesce('desce','atlas','"+dados[i].id_atlas+"')\" title=desce src=\"../imagens/33.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"excluir('atlas','"+dados[i].id_atlas+"')\" title=excluir src=\"../imagens/01.png\" />"
		conteudo += "&nbsp;<img style=\"position:relative;cursor:pointer;top:2px\" onclick=\"editar('atlas','"+dados[i].id_atlas+"')\" title=editar src=\"../imagens/06.png\" /><b>&nbsp;<span>"+dados[i].titulo_atlas+"</span>"
		var d = {html:conteudo,id_atlas:dados[i].id_atlas,tipo:"atlas"};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
	}
	if(redesenha){tree.draw();}
}
function editar(tipo,id)
{
	core_carregando("ativa");
	core_carregando(" buscando dados");
	var callback =
	{
		success:function(o)
		{
			try
			{
				if(tipo == "atlas")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('atlas','"+id+"')")
					$i("editor_bd").innerHTML = montaDivAtlas(dados)
					core_carregando("desativa");
					core_comboPranchas("comboPranchaIni","Epranchadefault_atlas",dados.pranchadefault_atlas,"",id)
				}
				if(tipo == "prancha")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('prancha','"+id+"')")
					$i("editor_bd").innerHTML = montaDivPrancha(dados)
					core_carregando("desativa");
				}
				if(tipo == "tema")
				{
					var dados = YAHOO.lang.JSON.parse(o.responseText)[0];
					core_montaEditor("gravaDados('tema','"+id+"')")
					$i("editor_bd").innerHTML = montaDivTema(dados)
					core_carregando("desativa");
					core_comboMapfiles("comboTemaIni","Ecodigo_tema",dados.codigo_tema,"",id)
				}
				core_carregando("desativa");
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	}; 
	if(tipo == "atlas")
	{var sUrl = "../php/atlas.php?funcao=pegaDadosAtlas&id_atlas="+id;}
	if(tipo == "prancha")
	{var sUrl = "../php/atlas.php?funcao=pegaDadosPrancha&id_prancha="+id;}
	if(tipo == "tema")
	{var sUrl = "../php/atlas.php?funcao=pegaDadosTema&id_tema="+id;}
	core_makeRequest(sUrl,callback)
}
function montaDivTema(i)
{
	var ins = ""
	ins += "<br>Código do tema:<br>"
	ins += "<div id=comboTemaIni ></div>"

	ins += "Ligado (ao abrir a prancha, esse tema estará visível)?<br>"
	ins += "<select id='Eligado_tema' >"
	ins += core_combosimnao(i.ligado_tema)
	ins += "</select>"
	ins += "<input type=hidden value='"+i.ordem_tema+"' id='Eordem_tema' />"
	return(ins)
}
function montaDivPrancha(i)
{
	var param =
	{
		"linhas":[
		{titulo:"Título:",id:"Etitulo_prancha",size:"50",value:i.titulo_prancha,tipo:"text",div:""},
		{titulo:"(opcional) Descrição:",id:"Edesc_prancha",size:"50",value:i.desc_prancha,tipo:"text",div:""},
		{titulo:"(opcional) Link para o texto que será mostrado na inicialização:",id:"Elink_prancha",size:"50",value:i.link_prancha,tipo:"text",div:""},
		{titulo:"Largura da janela do texto inicial:",id:"Ew_prancha",size:"5",value:i.w_prancha,tipo:"text",div:""},
		{titulo:"Altura:",id:"Eh_prancha",size:"5",value:i.h_prancha,tipo:"text",div:""},
		{titulo:"(opcional) Ícone que será utilizado na apresentação da prancha:",id:"Eicone_prancha",size:"50",value:i.icone_prancha,tipo:"text",div:""},
		{titulo:"Extensão geográfica:",id:"Emapext_prancha",size:"30",value:i.mapext_prancha,tipo:"text",div:""}
		]
	}
	var ins = ""
	ins += core_geraLinhas(param)
	ins += "<input type=hidden value='"+i.ordem_prancha+"' id='Eordem_prancha' />"
	
	return(ins)
}
function montaDivAtlas(i)
{
	var param =
	{
		"linhas":[
		{titulo:"Título:",id:"Etitulo_atlas",size:"50",value:i.titulo_atlas,tipo:"text",div:""},
		{titulo:"(opcional) Descrição:",id:"Edesc_atlas",size:"50",value:i.desc_atlas,tipo:"text",div:""},
		{titulo:"(opcional) Link para o texto que será mostrado na inicialização do Atlas:",id:"Elink_atlas",size:"50",value:i.link_atlas,tipo:"text",div:""},
		{titulo:"Largura da janela do texto inicial:",id:"Ew_atlas",size:"5",value:i.w_atlas,tipo:"text",div:""},
		{titulo:"Altura:",id:"Eh_atlas",size:"5",value:i.h_atlas,tipo:"text",div:""},
		{titulo:"(opcional) Mapfile inicial (mapfile que será usado como base para montagem do mapa inicial. Se não for definido, será usado o default do i3geo. Utilize o endereço completo do aquivo mapfile no servidor.):",id:"Ebasemapfile_atlas",size:"50",value:i.basemapfile_atlas,tipo:"text",div:""},
		{titulo:"(opcional) Ícone que será utilizado na montagem da lista de todos os Atlas:",id:"Eicone_atlas",size:"50",value:i.icone_atlas,tipo:"text",div:""},
		{titulo:"(opcional) Template HTML (se não for especificado, será usado o default do i3geo. Utilize o caminho completo do arquivo html no servidor):",id:"Etemplate_atlas",size:"50",value:i.template_atlas,tipo:"text",div:""}
		]
	}
	var ins = ""
	ins += core_geraLinhas(param)
	ins += "Prancha inicial (será mostrada quando iniciar o atlas):<br>"
	ins += "<div id=comboPranchaIni ></div><br>"
	ins += "Tipo da apresentação das guias:<br>"
	ins += "<select  id='Etipoguias_atlas' />"
	ins += "<option value='' >---</option>"
	ins += "<option value='automatica' "
	if (i.tipoguias_atlas == "automatica"){ins += "selected";}
	ins += " >automática</option>"	
	ins += "<option value='expandida' "
	if (i.tipoguias_atlas == "expandida"){ins += "selected";}
	ins += " >expandida</option></select><br><br>"
	ins += "Publicado (os não publicados são mostrados apenas para os usuários administradores)?<br>"
	ins += "<select id='Epublicado_atlas' >"
	ins += core_combosimnao(i.publicado_atlas)
	ins += "</select>"
	ins += "<input type=hidden value='"+i.ordem_atlas+"' id='Eordem_atlas' />"

	return(ins)
}
function sobeDesce(movimento,tipo,id)
{
	if(tipo == "atlas")
	{
		var no = tree.getNodeByProperty("id_atlas",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	if(tipo == "prancha")
	{
		var no = tree.getNodeByProperty("id_prancha",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	if(tipo == "tema")
	{
		var no = tree.getNodeByProperty("id_tema",id)
		var movimenta = core_movimentaNo(movimento,no)
	}
	var callback =
	{
    	success: function(oResponse)
		{core_carregando("desativa");},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	if (movimenta)
	{
		var sUrl = "../php/atlas.php?funcao=movimentaNo&tipo="+tipo+"&movimento="+movimento+"&id="+id;		
		core_carregando("ativa");
		core_carregando(" modificando a ordem no banco de dados");
		core_makeRequest(sUrl,callback)
	}
}
function excluir(tipo,id)
{
	var mensagem = " excluindo o registro do id= "+id;
	if(tipo == "atlas")
	{
		var no = tree.getNodeByProperty("id_atlas",id)
		var sUrl = "../php/atlas.php?funcao=excluirAtlas&id="+id;
	}
	if(tipo == "prancha")
	{
		var no = tree.getNodeByProperty("id_prancha",id)
		var sUrl = "../php/atlas.php?funcao=excluirPrancha&id="+id;
	}
	if(tipo == "tema")
	{
		var no = tree.getNodeByProperty("id_tema",id)
		var sUrl = "../php/atlas.php?funcao=excluirTema&id="+id;
	}
	core_excluiNoTree(sUrl,no,mensagem)
}
function adicionarTema(id)
{
	var mensagem = " adicionando tema...";
	var no = tree.getNodeByProperty("id_prancha",id)
	var sUrl = "../php/atlas.php?funcao=alterarTema&id_prancha="+id;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			adicionaNosTemas(no,dados,true)
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
function adicionarPrancha(id)
{
	var mensagem = " adicionando prancha...";
	var no = tree.getNodeByProperty("id_atlas",id)
	var sUrl = "../php/atlas.php?funcao=alterarPrancha&id_atlas="+id;
	var callback =
	{
    	success: function(oResponse)
		{
			var dados = YAHOO.lang.JSON.parse(oResponse.responseText)
			adicionaNosPranchas(no,dados,true)
		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback)
}
function gravaDados(tipo,id)
{
	if(tipo == "atlas")
	{
		var campos = new Array("publicado_atlas","ordem_atlas","basemapfile_atlas","desc_atlas","h_atlas","w_atlas","icone_atlas","link_atlas","pranchadefault_atlas","template_atlas","tipoguias_atlas","titulo_atlas")
		var par = "&id_atlas="+id
		var prog = "../php/atlas.php?funcao=alterarAtlas"
	}
	if(tipo == "prancha")
	{
		var campos = new Array("ordem_prancha","desc_prancha","h_prancha","icone_prancha","link_prancha","mapext_prancha","titulo_prancha","w_prancha");
		var par = "&id_prancha="+id;
		var prog = "../php/atlas.php?funcao=alterarPrancha"
	}
	if(tipo == "tema")
	{
		var campos = new Array("codigo_tema","ordem_tema","ligado_tema");
		var par = "&id_tema="+id;
		var prog = "../php/atlas.php?funcao=alterarTema"
	}
	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i("E"+campos[i]).value)}
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = prog+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem menus vinculados a este tema</span>");
  					setTimeout("core_carregando('desativa')",3000)
  				}
  				else
  				{
  					if(tipo == "atlas")
  					{
  						var no = tree.getNodeByProperty("id_atlas",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Etitulo_atlas").value
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "prancha")
  					{
  						var no = tree.getNodeByProperty("id_prancha",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Etitulo_prancha").value
  						no.html = no.getContentEl().innerHTML;
  					}
  					if(tipo == "tema")
  					{
  						var no = tree.getNodeByProperty("id_tema",id)
  						no.getContentEl().getElementsByTagName("span")[0].innerHTML = document.getElementById("Ecodigo_tema").value
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
	core_makeRequest(sUrl,callback,'POST')
}
YAHOO.util.Event.addListener(window, "load", initMenu);