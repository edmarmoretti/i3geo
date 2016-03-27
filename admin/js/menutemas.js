
function iniciaAdmin()
{
	verificaEditores();
}
function montaParametros()
{
	var ins = "";
	for (var i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>";
		ins += "<p><input style=font-size:10px onclick='pegaParametros()' type=button value='Listar existentes' />";
		ins += "&nbsp;Filtro:<div class='i3geoForm i3geoFormSemIcone'><input id=filtro style=font-size:10px type=text value='' size=30 title='Texto para filtrar' /></div></p>";
		ins += "<p><input onclick='alterar(\""+$parametros.simples[i].variavel+"\",\"\")' type=button value='Adicionar um novo' /></p>";
		ins += "<div id='"+$parametros.simples[i].variavel+"' ></div>";
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>";
		ins += "<p><input onclick='alterar(\""+$parametros.simples[i].variavel+"\",\"\")' type=button value='Adicionar um novo' /></p>";
		ins += "</fieldset><br>";
	}
	document.body.innerHTML += ins;
	$i("aguarde").style.display="none";
}
function pegaParametros(tipo)
{
	if(tipo == "perfis" || arguments.length == 0 && $i("perfis"))
	{
		var retornaPerfis = function(retorno)
		{
			var r = retorno.data;
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td></td><td></td></tr>";
			for (var i=0;i<r.length;i++)
			{
				ins += "<tr>";
				ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"perfis\",\""+r[i].id_perfil+"\")'/></td>";
				ins += "<td>";
				ins += "<div class=aplicar title='Aplicar' onclick='alterar(\"perfis\",\""+r[i].id_perfil+"\")'/>";
				ins += "</td>";
				ins += "<td><input onchange=this.style.color='blue' id='nomeperfil_"+r[i].id_perfil+"' type=text size=40 value='"+r[i].perfil+"'/></td>";
				ins += "</tr>";
			}
			ins += "</table>";
			$i("perfis").innerHTML = ins;
		};
		var p = "../php/menutemas.php?funcao=pegaPerfis";
		cPaint.call(p,"pegaPerfis",retornaPerfis);
	}
	if(tipo == "tags" || arguments.length == 0 && $i("tags"))
	{
		var retornaTags = function(retorno)
		{
			var r = retorno.data;
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td></td><td></td></tr>";
			for (var i=0;i<r.length;i++)
			{
				ins += "<tr>";
				ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"tags\",\""+r[i].id_tag+"\")'/></td>";
				ins += "<td>";
				ins += "<div class=aplicar title='Aplicar' onclick='alterar(\"tags\",\""+r[i].id_tag+"\")'/>";
				ins += "</td>";
				ins += "<td><input onchange=this.style.color='blue' id='nometag_"+r[i].id_tag+"' type=text size=40 value='"+r[i].nome+"'/></td>";
				ins += "</tr>";
			}
			ins += "</table>";
			$i("tags").innerHTML = ins;
		};
		var p = "../php/menutemas.php?funcao=pegaTags";
		cPaint.call(p,"pegaTags",retornaTags);
	}
	if(tipo == "menus" || arguments.length == 0 && $i("menus"))
	{
		var retornaMenus = function(retorno)
		{
			var r = retorno.data;
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Publicado</td><td><b>Nome</td><td><b>Descri&ccedil;&atilde;o</td><td><b>Aberto</td><td><b>Perfil</td><td></td></tr>";
			for (var i=0;i<r.length;i++)
			{
				ins += "<tr>";
				ins += "<td>id= "+r[i].id_menu+"<div class=excluir title='Excluir' onclick='excluir(\"menus\",\""+r[i].id_menu+"\")'/></td>";
				ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\"menus\",\""+r[i].id_menu+"\")'/></td>";
				ins += "<td><select onchange=this.style.color='blue'  id='publicadomenu_"+r[i].id_menu+"' >";
				ins += combosimnao(r[i].publicado_menu);
				ins += "</td>";
				ins += "<td><input onchange=this.style.color='blue' id='nomemenu_"+r[i].id_menu+"' type=text size=40 value='"+r[i].nome_menu+"'/></td>";
				ins += "<td><input onchange=this.style.color='blue'  id='descmenu_"+r[i].id_menu+"' type=text size=20 value='"+r[i].desc_menu+"' /></td>";
				ins += "<td><select onchange=this.style.color='blue'  id='abertomenu_"+r[i].id_menu+"' >";
				ins += combosimnao(r[i].aberto);
				ins += "</td>";
				ins += "<td><input onchange=this.style.color='blue'  id='perfilmenu_"+r[i].id_menu+"' type=text size=20 value='"+r[i].perfil_menu+"' /></td>";
				var idtemp = 'perfilmenu_'+r[i].id_menu;
				ins += "<td><select onchange=\"registraPerfil('"+idtemp+"',this.value);this.style.color='blue'\"  id='escolhePerfilMenu_"+r[i].id_menu+"' >";
				ins += comboObjeto($perfis,"perfil","perfil","");
				ins += "</select>";
				ins += "</td>";
				ins += "</tr>";
			}
			ins += "</table>";
			$i("menus").innerHTML = ins;
		};
		var p = "../php/menutemas.php?funcao=pegaMenus";
		cPaint.call(p,"pegaMenus",retornaMenus);
	}
	if(tipo == "grupos" || arguments.length == 0 && $i("grupos"))
	{
		var retornaGrupos = function(retorno)
		{
			var r = retorno.data;
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Descri&ccedil;&atilde;o</td></tr>";
			for (var i=0;i<r.length;i++)
			{
				ins += montaOpcoes("grupo",r[i].id_grupo,r[i].nome_grupo,r[i].desc_grupo);
			}

			ins += "</table>";
			$i("grupos").innerHTML = ins;
		};
		var p = "../php/menutemas.php?funcao=pegaGrupos";
		cPaint.call(p,"pegaGrupos",retornaGrupos);
	}
	if(tipo == "subgrupos" || arguments.length == 0 && $i("subgrupos"))
	{
		var retornaSubGrupos = function(retorno)
		{
			var r = retorno.data;
			var ins = "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Descri&ccedil;&atilde;o</td></tr>";
			for (var i=0;i<r.length;i++)
			{
				ins += montaOpcoes("subgrupo",r[i].id_subgrupo,r[i].nome_subgrupo,r[i].desc_subgrupo);
			}
			ins += "</table>";
			$i("subgrupos").innerHTML = ins;
		};
		var p = "../php/menutemas.php?funcao=pegaSubGrupos";
		cPaint.call(p,"pegaSubGrupos",retornaSubGrupos);
	}
	if(tipo == "temas" || arguments.length == 0 && $i("temas"))
	{
		var retornaTemas = function(retorno)
		{
			var r = retorno.data;
			ins = "";
			for (var j=0;j<r.length;j++)
			{
				ins += "<div id=div_"+r[j].id_tema+" >";
				var temp = montaDivTemas(r[j]);
				ins += temp+"</div>";
			}
			$i("temas").innerHTML = ins;
			ativaLegenda();
		};
		var p = "../php/menutemas.php?funcao=pegaTemas&filtro="+$i("filtro").value;
		cPaint.call(p,"pegaTemas",retornaTemas);
	}

	if(tipo == "arvore" || arguments.length == 0 && $i("arvore"))
	{
		var p = "../php/menutemas.php?funcao=pegaSubXGrupos";
		cPaint.call(p,"pegaSubXGrupos",retornaSubXGrupos);
	}
}
function montaOpcoes(prefixo,id,nome,desc,opc)
{
	var ins = "<tr>";
	ins += "<td><div class=excluir title='Excluir' onclick='excluir(\""+prefixo+"s\",\""+id+"\")'/></td>";
	ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\""+prefixo+"s\",\""+id+"\")'/></td>";
	ins += "<td><input onchange=this.style.color='blue' id='nome"+prefixo+"_"+id+"' type=text size=40 value='"+nome+"'/></td>";
	ins += "<td><input onchange=this.style.color='blue'  id='desc"+prefixo+"_"+id+"' type=text size=20 value='"+desc+"' /></td></tr>";
	return (ins);
}
function montaDivTemas(i)
{
	var ins = "<br><fieldset><legend>+- "+i.nome_tema+"</legend>";
	ins += "<div style=display:none > <table class=lista ><tr><td></td></tr>";
	var param = {
		"linhas":[
		{titulo:"Nome do tema",prefixoid:"nometema_",id:"id_tema",valor:"nome_tema"},
		{titulo:"Descri&ccedil;&atilde;o",prefixoid:"desctema_",id:"id_tema",valor:"desc_tema"},
		{titulo:"Link para a fonte",prefixoid:"linktema_",id:"id_tema",valor:"link_tema"}
		]
	};
	ins += (geraLinhas(i,param,2));
	
	ins += "<tr><td>Tags (separe com espa&ccedil;o):</td><td>";
	ins += "<input type=text size=40 value='"+i.tags_tema+"' id='tagstema_"+i.id_tema+"' >";
	ins += "<select onchange='registraTag(\"tagstema_"+i.id_tema+"\",this.value)'>";
	ins += comboObjeto($listaTags,"nome","nome","");
	ins += "</select></td></tr>";
	
	ins += "<tr><td>Tipo:</td><td>";
	ins += "<select  id='tipoatema_"+i.id_tema+"' />";
	ins += "<option value='' ";
	if (i.tipoa_tema == ""){ins += "selected";}
	ins += ">---</option>";
	ins += "<option value='WMS' ";
	if (i.tipoa_tema == "WMS"){ins += "selected";}
	ins += " >WMS<option>";

	ins += "<tr><td>Mapfile:</td><td>";
	ins += "<select  id='codigotema_"+i.id_tema+"' >";
	ins += combolista($listaDeMapfiles,i.codigo_tema);
	ins += "</select></td></tr>";
	
	ins += "<tr><td>Permite acesso via WMS/WFS?</td><td>";
	ins += "<select  id='ogctema_"+i.id_tema+"' >";
	ins += combosimnao(i.ogc_tema);
	ins += "</select></td></tr>";
	
	ins += "<tr><td>Permite o download na aplica&ccedil;&atilde;o datadownload.htm?</td><td>";
	ins += "<select  id='downloadtema_"+i.id_tema+"' >";
	ins += combosimnao(i.download_tema);
	ins += "</select></td></tr>";

	ins += "<tr><td>Permite acesso via kml?</td><td>";
	ins += "<select  id='kmltema_"+i.id_tema+"' >";
	ins += combosimnao(i.kml_tema);
	ins += "</select></td></tr>";
		
	ins += "</table>";
	ins += "<table><tr>";
	ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"temas\",\""+i.id_tema+"\")'/></td>";
	ins += "<td><div class=aplicar title='Aplicar' onclick='alterar(\"temas\",\""+i.id_tema+"\")'/></td></table>";

	ins += "</div></fieldset>";
	return(ins);
}
function registraTag(id,tag)
{
	if(tag == "")
	$i(id).value = tag;
	else
	$i(id).value = $i(id).value+" "+tag;
}
function alterar(prefixo,id)
{
	//if(confirm("Voc&ecirc; realmente quer fazer isso?"))
	//{
		var retorna = function()
		{pegaParametros(prefixo);};
		var p = "",nome = "", publicado_menu = "", desc = "", aberto = "", perfil = "";
		if(prefixo == "perfis")
		{
			if (id != "")
			{
				nome = $i("nomeperfil_"+id).value;
			}
			else
			{
				nome = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde;
			p = "../php/menutemas.php?funcao=alteraPerfis&perfil="+nome+"&id="+id;	
		}
		if(prefixo == "tags")
		{
			if (id != "")
			{
				nome = $i("nometag_"+id).value;
			}
			else
			{
				nome = "";
			}
			$i(prefixo).innerHTML = $mensagemAguarde;
			p = "../php/menutemas.php?funcao=alteraTags&nome="+nome+"&id="+id;
			//window.open(p)		
		}
		if(prefixo == "menus")
		{
			if (id != "")
			{
				nome = $i("nomemenu_"+id).value;
				desc = $i("descmenu_"+id).value;
				aberto = $i("abertomenu_"+id).value;
				perfil = $i("perfilmenu_"+id).value;
				publicado_menu = $i("publicadomenu_"+id).value;
				if(nome == "null"){nome = "";}
				if(desc == "null"){desc = "";}
				if(aberto == "null"){aberto = "";}
				if(perfil == "null"){perfil = "";}
			}
			else
			{
				nome = "";
				desc = "";
				aberto = "";
				perfil = "";
				publicado_menu = "";
			}
			$i(prefixo).innerHTML = $mensagemAguarde;
			p = "../php/menutemas.php?funcao=alteraMenus&publicado_menu="+publicado_menu+"&perfil="+perfil+"&nome="+nome+"&desc="+desc+"&id="+id+"&aberto="+aberto;
		}
		if(prefixo == "grupos")
		{
			if (id != "")
			{
				nome = $i("nomegrupo_"+id).value;
				desc = $i("descgrupo_"+id).value;
				if(nome == "null"){nome = "";}
				if(desc == "null"){desc = "";}
			}
			else
			{
				nome = "";
				desc = "";
			}
			$i(prefixo).innerHTML = $mensagemAguarde;
			p = "../php/menutemas.php?funcao=alteraGrupos&nome="+nome+"&desc="+desc+"&id="+id;
		}
		if(prefixo == "subgrupos")
		{
			if (id != "")
			{
				nome = $i("nomesubgrupo_"+id).value;
				desc = $i("descsubgrupo_"+id).value;
				if(nome == "null"){nome = "";}
				if(desc == "null"){desc = "";}
			}
			else
			{
				nome = "";
				desc = "";
			}
			$i(prefixo).innerHTML = $mensagemAguarde;
			p = "../php/menutemas.php?funcao=alteraSubGrupos&nome="+nome+"&desc="+desc+"&id="+id;
		}
		if(prefixo == "temas")
		{
			if (id != "")
			{
				nome = $i("nometema_"+id).value;
				var codigo = $i("codigotema_"+id).value;
				desc = $i("desctema_"+id).value;
				var tipoa = $i("tipoatema_"+id).value;
				var link = $i("linktema_"+id).value;
				var ogc = $i("ogctema_"+id).value;
				var kml = $i("kmltema_"+id).value;
				var download = $i("downloadtema_"+id).value;
				var tags = $i("tagstema_"+id).value;
				if(nome == "null"){nome = "";}
				if(codigo == "null"){codigo = "";}
				if(desc == "null"){desc = "";}
				if(tipoa == "null"){tipoa = "";}
				if(link == "null"){link = "";}
				if(ogc == "null"){ogc = "";}
				if(kml == "null"){kml = "";}
				if(download == "null"){download = "";}
				if(tags == "null"){tags = "";}
			}
			else
			{
				nome = "";
				codigo = "";
				desc = "";
				link = "";
				tipoa = "";
				ogc = "";
				kml = "";
				download = "";
				tags = "";
			}
			$i(prefixo).innerHTML =$mensagemAguarde;
			p = "../php/menutemas.php?funcao=alteraTemas&tags="+tags+"&download="+download+"&kml="+kml+"&ogc="+ogc+"&tipoa="+tipoa+"&desc="+desc+"&link="+link+"&nome="+nome+"&codigo="+codigo+"&id="+id;
		}
		cPaint.call(p,"",retorna);	
	//}
}
function excluir(prefixo,id)
{
	if(confirm("Voc&ecirc; realmente quer fazer isso?"))
	{
		var retorna = function()
		{pegaParametros(prefixo);};
		$i(prefixo).innerHTML = $mensagemAguarde;
		var p = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela="+prefixo;
		cPaint.call(p,"",retorna);	
	}
}
function pegaMapfiles(retorna)
{
	var cPaint = new cpaint();
	cPaint.set_response_type("JSON");
	var p = "../php/menutemas.php?funcao=listaMapsTemas";
	cPaint.call(p,"listaMapsTemas",retorna);	
}
