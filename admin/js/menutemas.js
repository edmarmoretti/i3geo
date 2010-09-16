
function iniciaAdmin()
{
	verificaEditores()
}
function importarXmlMenu()
{
	$i("resultado").innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{$i("resultado").innerHTML = retorno.data}
	var p = "../php/menutemas.php?funcao=importarXmlMenu&nomemenu="+$i("nome").value+"&xml="+$i("arquivo").value;
	cPaint.call(p,"",retorna);
}
function montaParametros()
{
	var ins = ""
	for (i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>"
		ins += "<p><input style=font-size:10px onclick='pegaParametros()' type=button value='Listar existentes' />"
		ins += "&nbsp;Filtro:<input id=filtro style=font-size:10px type=text value='' size=30 title='Texto para filtrar' /></p>" 
		ins += "<p><input onclick='alterar(\""+$parametros.simples[i].variavel+"\",\"\")' type=button value='Adicionar um novo' /></p>"
		ins += "<div id='"+$parametros.simples[i].variavel+"' ></div>"
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>"
		ins += "<p><input onclick='alterar(\""+$parametros.simples[i].variavel+"\",\"\")' type=button value='Adicionar um novo' /></p>"
		ins += "</fieldset><br>"
	}
	document.body.innerHTML += ins
	$i("aguarde").style.display="none"
	//pegaParametros()
}
function pegaParametros(tipo)
{
	if(tipo == "perfis" || arguments.length == 0 && $i("perfis"))
	{
		var retornaPerfis = function(retorno)
		{
			var r = retorno.data
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td></td><td></td></tr>";
			for (i=0;i<r.length;i++)
			{
				ins += "<tr>"
				ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"perfis\",\""+r[i].id_perfil+"\")'/></td>"
				ins += "<td>"
				ins += "<div class=aplicar title='Aplicar' onclick='alterar(\"perfis\",\""+r[i].id_perfil+"\")'/>"
				ins += "</td>"
				ins += "<td><input onchange=this.style.color='blue' id='nomeperfil_"+r[i].id_perfil+"' type=text size=40 value='"+r[i].perfil+"'/></td>"
				ins += "</tr>"
			}
			ins += "</table>"
			$i("perfis").innerHTML = ins;
		}
		var p = "../php/menutemas.php?funcao=pegaPerfis";
		cPaint.call(p,"pegaPerfis",retornaPerfis);
	}
	if(tipo == "tags" || arguments.length == 0 && $i("tags"))
	{
		var retornaTags = function(retorno)
		{
			var r = retorno.data
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td></td><td></td></tr>";
			for (i=0;i<r.length;i++)
			{
				ins += "<tr>"
				ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"tags\",\""+r[i].id_tag+"\")'/></td>"
				ins += "<td>"
				ins += "<div class=aplicar title='Aplicar' onclick='alterar(\"tags\",\""+r[i].id_tag+"\")'/>"
				ins += "</td>"
				ins += "<td><input onchange=this.style.color='blue' id='nometag_"+r[i].id_tag+"' type=text size=40 value='"+r[i].nome+"'/></td>"
				ins += "</tr>"
			}
			ins += "</table>"
			$i("tags").innerHTML = ins;
		}
		var p = "../php/menutemas.php?funcao=pegaTags";
		cPaint.call(p,"pegaTags",retornaTags);
	}
	if(tipo == "menus" || arguments.length == 0 && $i("menus"))
	{
		var retornaMenus = function(retorno)
		{
			var r = retorno.data
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Publicado</td><td><b>Nome</td><td><b>Descrição</td><td><b>Aberto</td><td><b>Perfil</td><td></td></tr>";
			for (i=0;i<r.length;i++)
			{
				ins += "<tr>"
				ins += "<td>id= "+r[i].id_menu+"<div class=excluir title='Excluir' onclick='excluir(\"menus\",\""+r[i].id_menu+"\")'/></td>"
				ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\"menus\",\""+r[i].id_menu+"\")'/></td>"
				ins += "<td><select onchange=this.style.color='blue'  id='publicadomenu_"+r[i].id_menu+"' >"
				ins += combosimnao(r[i].publicado_menu)
				ins += "</td>"
				ins += "<td><input onchange=this.style.color='blue' id='nomemenu_"+r[i].id_menu+"' type=text size=40 value='"+r[i].nome_menu+"'/></td>"
				ins += "<td><input onchange=this.style.color='blue'  id='descmenu_"+r[i].id_menu+"' type=text size=20 value='"+r[i].desc_menu+"' /></td>"
				ins += "<td><select onchange=this.style.color='blue'  id='abertomenu_"+r[i].id_menu+"' >"
				ins += combosimnao(r[i].aberto)
				ins += "</td>"
				ins += "<td><input onchange=this.style.color='blue'  id='perfilmenu_"+r[i].id_menu+"' type=text size=20 value='"+r[i].perfil_menu+"' /></td>"
				var idtemp = 'perfilmenu_'+r[i].id_menu
				ins += "<td><select onchange=\"registraPerfil('"+idtemp+"',this.value);this.style.color='blue'\"  id='escolhePerfilMenu_"+r[i].id_menu+"' >"
				ins += comboObjeto($perfis,"perfil","perfil","")
				ins += "</select>"
				ins += "</td>"
				ins += "</tr>"
			}
			ins += "</table>"
			$i("menus").innerHTML = ins;
		}
		var p = "../php/menutemas.php?funcao=pegaMenus";
		cPaint.call(p,"pegaMenus",retornaMenus);
	}
	if(tipo == "grupos" || arguments.length == 0 && $i("grupos"))
	{
		var retornaGrupos = function(retorno)
		{
			var r = retorno.data
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Descrição</td></tr>";
			for (i=0;i<r.length;i++)
			{
				ins += montaOpcoes("grupo",r[i].id_grupo,r[i].nome_grupo,r[i].desc_grupo)
			}

			ins += "</table>"
			$i("grupos").innerHTML = ins;
		}
		var p = "../php/menutemas.php?funcao=pegaGrupos";
		cPaint.call(p,"pegaGrupos",retornaGrupos);
	}
	if(tipo == "subgrupos" || arguments.length == 0 && $i("subgrupos"))
	{
		var retornaSubGrupos = function(retorno)
		{
			var r = retorno.data
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Descrição</td></tr>";
			for (i=0;i<r.length;i++)
			{
				ins += montaOpcoes("subgrupo",r[i].id_subgrupo,r[i].nome_subgrupo,r[i].desc_subgrupo)
			}
			ins += "</table>"
			$i("subgrupos").innerHTML = ins;
		}
		var p = "../php/menutemas.php?funcao=pegaSubGrupos";
		cPaint.call(p,"pegaSubGrupos",retornaSubGrupos);
	}
	if(tipo == "temas" || arguments.length == 0 && $i("temas"))
	{
		var retornaTemas = function(retorno)
		{
			var r = retorno.data
			ins = ""
			for (var j=0;j<r.length;j++)
			{
				ins += "<div id=div_"+r[j].id_tema+" >"
				var temp = montaDivTemas(r[j])
				ins += temp+"</div>"
			}
			$i("temas").innerHTML = ins;
			ativaLegenda()
		}
		var p = "../php/menutemas.php?funcao=pegaTemas&filtro="+$i("filtro").value;
		cPaint.call(p,"pegaTemas",retornaTemas);
	}

	if(tipo == "arvore" || arguments.length == 0 && $i("arvore"))
	{
		var retornaArvore = function(retorno)
		{
			var r = retorno.data
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Descrição</td></tr>";
			for (i=0;i<r.length;i++)
			{
				ins += "<tr>"
				ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"subgrupos\",\""+r[i].id_subgrupo+"\")'/></td>"
				ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\"subgrupos\",\""+r[i].id_subgrupo+"\")'/></td>"
				ins += "<td><input onchange=this.style.color='blue'  id='nomesubgrupo_"+r[i].id_subgrupo+"' type=text size=40 value='"+r[i].nome_subgrupo+"'/></td>"
				ins += "<td><input onchange=this.style.color='blue'  id='descsubgrupo_"+r[i].id_subgrupo+"' type=text size=20 value='"+r[i].desc_subgrupo+"' /></td></tr>"
			}
			ins += "</table>"
			$i("subgrupos").innerHTML = ins;
		}
		var p = "../php/menutemas.php?funcao=pegaSubXGrupos";
		cPaint.call(p,"pegaSubXGrupos",retornaSubXGrupos);
	}
}
function montaOpcoes(prefixo,id,nome,desc,opc)
{
	var ins = "<tr>"
	ins += "<td><div class=excluir title='Excluir' onclick='excluir(\""+prefixo+"s\",\""+id+"\")'/></td>"
	ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\""+prefixo+"s\",\""+id+"\")'/></td>"
	ins += "<td><input onchange=this.style.color='blue' id='nome"+prefixo+"_"+id+"' type=text size=40 value='"+nome+"'/></td>"
	ins += "<td><input onchange=this.style.color='blue'  id='desc"+prefixo+"_"+id+"' type=text size=20 value='"+desc+"' /></td></tr>"
	return (ins)
}
function montaDivTemas(i)
{
	var ins = "<br><fieldset><legend>+- "+i.nome_tema+"</legend>"
	ins += "<div style=display:none > <table class=lista ><tr><td></td></tr>";
	var param = {
		"linhas":[
		{titulo:"Nome do tema",prefixoid:"nometema_",id:"id_tema",valor:"nome_tema"},
		{titulo:"Descrição",prefixoid:"desctema_",id:"id_tema",valor:"desc_tema"},
		{titulo:"Link para a fonte",prefixoid:"linktema_",id:"id_tema",valor:"link_tema"}
		]
	}
	ins += (geraLinhas(i,param,2));
	
	ins += "<tr><td>Tags (separe com espaço):</td><td>"
	ins += "<input type=text size=40 value='"+i.tags_tema+"' id='tagstema_"+i.id_tema+"' >"
	ins += "<select onchange='registraTag(\"tagstema_"+i.id_tema+"\",this.value)'>"
	ins += comboObjeto($listaTags,"nome","nome","")
	ins += "</select></td></tr>"
	
	ins += "<tr><td>Tipo:</td><td>"
	ins += "<select  id='tipoatema_"+i.id_tema+"' />"
	ins += "<option value='' "
	if (i.tipoa_tema == ""){ins += "selected";}
	ins += ">---</option>"
	ins += "<option value='WMS' "
	if (i.tipoa_tema == "WMS"){ins += "selected";}
	ins += " >WMS<option>"

	ins += "<tr><td>Mapfile:</td><td>"
	ins += "<select  id='codigotema_"+i.id_tema+"' >"
	ins += combolista($listaDeMapfiles,i.codigo_tema)
	ins += "</select></td></tr>"
	
	ins += "<tr><td>Permite acesso via WMS/WFS?</td><td>"
	ins += "<select  id='ogctema_"+i.id_tema+"' >"
	ins += combosimnao(i.ogc_tema)
	ins += "</select></td></tr>"
	
	ins += "<tr><td>Permite o download na aplicação datadownload.htm?</td><td>"
	ins += "<select  id='downloadtema_"+i.id_tema+"' >"
	ins += combosimnao(i.download_tema)
	ins += "</select></td></tr>"

	ins += "<tr><td>Permite acesso via kml?</td><td>"
	ins += "<select  id='kmltema_"+i.id_tema+"' >"
	ins += combosimnao(i.kml_tema)
	ins += "</select></td></tr>"
		
	ins += "</table>"
	ins += "<table><tr>";
	ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"temas\",\""+i.id_tema+"\")'/></td>"
	ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\"temas\",\""+i.id_tema+"\")'/></td></table>"

	ins += "</div></fieldset>"
	return(ins)
}
function registraTag(id,tag)
{
	var tags = $i(id).value
	if(tag == "")
	$i(id).value = tag
	else
	$i(id).value = $i(id).value+" "+tag
}
function alterar(prefixo,id)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function()
		{pegaParametros(prefixo);}
		if(prefixo == "perfis")
		{
			if (id != "")
			{
				var nome = $i("nomeperfil_"+id).value
			}
			else
			{
				var nome = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde
			var p = "../php/menutemas.php?funcao=alteraPerfis&perfil="+nome+"&id="+id;	
		}
		if(prefixo == "tags")
		{
			if (id != "")
			{
				var nome = $i("nometag_"+id).value
			}
			else
			{
				var nome = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde
			var p = "../php/menutemas.php?funcao=alteraTags&nome="+nome+"&id="+id;
			//window.open(p)		
		}
		if(prefixo == "menus")
		{
			if (id != "")
			{
				var nome = $i("nomemenu_"+id).value
				var desc = $i("descmenu_"+id).value
				var aberto = $i("abertomenu_"+id).value
				var perfil = $i("perfilmenu_"+id).value
				var publicado_menu = $i("publicadomenu_"+id).value
				if(nome == "null"){var nome = "";}
				if(desc == "null"){var desc = "";}
				if(aberto == "null"){var aberto = "";}
				if(perfil == "null"){var perfil = "";}
			}
			else
			{
				var nome = "";
				var desc = "";
				var aberto = "";
				var perfil = "";
				var publicado_menu = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde
			var p = "../php/menutemas.php?funcao=alteraMenus&publicado_menu="+publicado_menu+"&perfil="+perfil+"&nome="+nome+"&desc="+desc+"&id="+id+"&aberto="+aberto;
		}
		if(prefixo == "grupos")
		{
			if (id != "")
			{
				var nome = $i("nomegrupo_"+id).value
				var desc = $i("descgrupo_"+id).value
				if(nome == "null"){var nome = "";}
				if(desc == "null"){var desc = "";}
			}
			else
			{
				var nome = "";
				var desc = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde
			var p = "../php/menutemas.php?funcao=alteraGrupos&nome="+nome+"&desc="+desc+"&id="+id;
		}
		if(prefixo == "subgrupos")
		{
			if (id != "")
			{
				var nome = $i("nomesubgrupo_"+id).value
				var desc = $i("descsubgrupo_"+id).value
				if(nome == "null"){var nome = "";}
				if(desc == "null"){var desc = "";}
			}
			else
			{
				var nome = "";
				var desc = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde
			var p = "../php/menutemas.php?funcao=alteraSubGrupos&nome="+nome+"&desc="+desc+"&id="+id;
		}
		if(prefixo == "temas")
		{
			if (id != "")
			{
				var nome = $i("nometema_"+id).value
				var codigo = $i("codigotema_"+id).value
				var desc = $i("desctema_"+id).value
				var tipoa = $i("tipoatema_"+id).value
				var link = $i("linktema_"+id).value
				var ogc = $i("ogctema_"+id).value
				var kml = $i("kmltema_"+id).value
				var download = $i("downloadtema_"+id).value
				var tags = $i("tagstema_"+id).value
				if(nome == "null"){var nome = "";}
				if(codigo == "null"){var codigo = "";}
				if(desc == "null"){var desc = "";}
				if(tipoa == "null"){var tipoa = "";}
				if(link == "null"){var link = "";}
				if(ogc == "null"){var ogc = "";}
				if(kml == "null"){var kml = "";}
				if(download == "null"){var download = "";}
				if(tags == "null"){var tags = "";}
			}
			else
			{
				var nome = "";
				var codigo = "";
				var desc = "";
				var link = "";
				var tipoa = "";
				var ogc = "";
				var kml = "";
				var download = "";
				var tags = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde
			var p = "../php/menutemas.php?funcao=alteraTemas&tags="+tags+"&download="+download+"&kml="+kml+"&ogc="+ogc+"&tipoa="+tipoa+"&desc="+desc+"&link="+link+"&nome="+nome+"&codigo="+codigo+"&id="+id;
		}

		cPaint.call(p,"",retorna);	
	//}
}
function excluir(prefixo,id)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function()
		{pegaParametros(prefixo);}
		$i(prefixo).innerHTML = $mensagemAguarde
		var p = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela="+prefixo;
		cPaint.call(p,"",retorna);	
	}
}

function pegaMapfiles(retorna)
{
	var cPaint = new cpaint();
	//cPaint.set_async("true");
	cPaint.set_response_type("JSON");
	var p = "../php/menutemas.php?funcao=listaMapsTemas";
	cPaint.call(p,"listaMapsTemas",retorna);	
}
