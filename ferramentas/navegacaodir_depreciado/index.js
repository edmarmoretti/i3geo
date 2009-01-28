
function listaDrives()
{
	var montaListaDrives = function(retorno)
	{
		var currentIconMode;
		YAHOO.example.treeExample = new function(){
			function changeIconMode(){
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
				buildTree();
			}
        	function buildTree(){
				arvore = new YAHOO.widget.TreeView("arvoreL");
				var root = arvore.getRoot();
				var tempNode = new YAHOO.widget.TextNode('', root, false);
				tempNode.isLeaf = false;
        	}
    		buildTree();
		}();
		var root = arvore.getRoot();
		//
		//adiciona na árvore a raiz de cada menu
		//
		var c = retorno.data[0];
		for (ig=0;ig<c.length;ig++)
		{
			var conteudo = c[ig].nome;
			var d = {html:conteudo,caminho:c[ig].caminho};
			var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
			tempNode.setDynamicLoad(expandeItem, currentIconMode);
		}
   		arvore.draw();
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaDrives";
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDrives",montaListaDrives);
}
function expandeItem(node)
{
	var montaLista = function(retorno)
	{
		var dirs = retorno.data
		for (ig=0;ig<dirs.length;ig++)
		{
			var conteudo = dirs[ig];
			var d = {html:conteudo,caminho:node.data.caminho+"/"+conteudo};
			var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
			tempNode.setDynamicLoad(expandeItem, 1);
		}
		node.loadComplete();
		//listaarquivos(itemID)
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaDiretorios&diretorio="+node.data.caminho;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDrives",montaLista);
}
function listaarquivos(id)
{
	var montaLista = function(retorno)
	{
		aguarde("none")
		var ins = "<span style=color:gray >"+id+"</span><br><br>"
		if ((retorno.data != "erro") && (retorno.data != undefined))
		{
			var cor = "rgb(240,240,240)"
			for (ig=0;ig<retorno.data.arquivos.length;ig++)
			{
				var verifica = retorno.data.arquivos[ig].split(".")
				if ((verifica[1] == "shp") || (verifica[1] == "SHP") || (verifica[1] == "tif") || (verifica[1] == "TIF"))
				{
					ins += "<span title='Clique para incluir no mapa' onclick='incluir(\""+id+"/"+retorno.data.arquivos[ig]+"\")' style='cursor:pointer;background-color:"+cor+"' >"+retorno.data.arquivos[ig]+"</span><br>"
					if (cor == "rgb(240,240,240)")
					{var cor = "white"}
					else
					{cor = "rgb(240,240,240)"}
				}
			}

		}
		$i("arquivosL").innerHTML = ins;
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaArquivos&diretorio="+id;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDrives",montaLista);
}
function incluir(path)
{
	var temp = path.split(".")
	if ((temp[1] == "SHP") || (temp[1] == "shp"))
	{var f = "adicionaTemaSHP";}
	else
	{var f = "adicionaTemaIMG";}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao="+f+"&arq="+path;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,f,window.parent.i3GEO.atualiza);
}
