parametrosURL()
mytreeview2 = new Object();
aguarde("block")
listaDrives();
function listaDrives()
{
	var montaListaDrives = function(retorno)
	{
		retorno = retorno.data[0];
		if ((retorno != "erro") && (retorno != undefined))
		{
			mytreeview2 = treeviewNew("mytreeview2", "default", "arvoreL", null);
			mytreeview2.createItem("drives", "<b>Drives</b>", g_locaplic+"/imagens/temas.png", true, true, true, null);
			mytreeview2.itemExpand = expandeItem;
			for (ig=0;ig<retorno.length;ig++)
			{
				mytreeview2.createItem(retorno[ig].caminho, retorno[ig].nome, g_locaplic+"/imagens/folder-s.gif", true, true, true, "drives");
			}
		}
		aguarde("none")
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaDrives";
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDrives",montaListaDrives);
}
function expandeItem(itemID)
{
	aguarde("block")
	var montaLista = function(retorno)
	{
		if ((retorno.data != "erro") && (retorno.data != undefined))
		{
			for (ig=0;ig<retorno.data.length;ig++)
			{
				if (!$i(itemID+"/"+retorno.data[ig]))
				var id = itemID+"/"+retorno.data[ig]
				var nome = "<span style=cursor:pointer;color:blue title='Clique para ver os arquivos' onclick='listaarquivos(\""+id+"\")'>"+retorno.data[ig]+"</span>"
				mytreeview2.createItem(id, nome, g_locaplic+"/imagens/folder-s.gif", true, true, true, itemID);
			}
		}
		listaarquivos(itemID)
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaDiretorios&diretorio="+itemID;
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
	cp.call(p,f,window.parent.ajaxredesenha);
}
