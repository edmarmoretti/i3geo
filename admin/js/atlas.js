/*
Title: Atlas

Funções javascript utilizadas no sistema de administração do cadastro de web services

File: i3geo/admin/atlas.js

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
Function: iniciaAdmin

Inicializa as variáveis globais e checa o cadastro do editor do sistema de administração

Ao retornar, por default, executa a função montaParametros()
*/
function iniciaAdmin()
{
	verificaEditores()
	tipos = ["expandida","automatica"]
}
function montaParametros()
{
	if(!$i("resultado"))
	{document.body.innerHTML += "<div id=resultado ></div>"}
	listaAtlas()
}
/*
Function: listaAtlas

Monta o html com os parametros e os divs que receberão os dados dos formulários.
*/
function listaAtlas()
{
	$i("resultado").innerHTML = $mensagemAguarde
	var ins = "<fieldset><legend>Atlas</legend>"
	var comboAtlas = function(retorno)
	{
		var d = retorno.data;
		var nm = retorno.data.length
		ins += "<p><table><tr><td><b>Selecione o atlas:</b></td><td></td></tr>"
		ins += "<tr><td><input style=font-size:10px onclick='alterarAtlas(\"\")' type=button value='Adicionar um novo atlas' /></td><td><select onchange='pegaDadosAtlas(this.value)'>"
		ins += "<option>---</option>"
		for (i=0;i<nm;i++)
		{
			ins += "<option value='"+d[i].id_atlas+"'>"+d[i].titulo_atlas+"</option>"
		}
		$i("resultado").innerHTML = ins+"</select></tr></table></p><p><div id='dadosAtlas'></div></fieldset>"
	}
	var cp = new cpaint();
	cp.set_response_type("JSON");
	var p = "../php/atlas.php?funcao=pegaAtlas";
	cp.call(p,"pegaAtlas",comboAtlas);
}
function pegaDadosAtlas(id_atlas)
{
	$i("dadosAtlas").innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{
		//parametros atlas
	    var d = retorno.data.atlas[0]  
	    var ins = "<table class=lista ><tr><td></td><td></td></tr>";
		var param = {
			"linhas":[
			{titulo:"Nome",prefixoid:"titulo_",id:"id_atlas",valor:"titulo_atlas"},
			{titulo:"Descrição",prefixoid:"desc_",id:"id_atlas",valor:"desc_atlas"},
			{titulo:"Ícone",prefixoid:"icone_",id:"id_atlas",valor:"icone_atlas"},
			{titulo:"Link",prefixoid:"link_",id:"id_atlas",valor:"link_atlas"},
			{titulo:"Template",prefixoid:"template_",id:"id_atlas",valor:"template_atlas"},
			{titulo:"Prancha aberta",prefixoid:"pranchadefault_",id:"id_atlas",valor:"pranchadefault_atlas"},
			{titulo:"Largura da janela do texto exlicativo",prefixoid:"w_",id:"id_atlas",valor:"w_atlas"},
			{titulo:"Altura",prefixoid:"h_",id:"id_atlas",valor:"h_atlas"},
			{titulo:"Mapfile base",prefixoid:"basemapfile_",id:"id_atlas",valor:"basemapfile_atlas"},
			{titulo:"Ordem de apresentação",prefixoid:"ordematlas_",id:"id_atlas",valor:"ordem_atlas"}
			]
		}
		ins += (geraLinhas(d,param,2));
		ins += "<tr>"
		ins += "<td>Tipo das guias: </td>"
		ins += "<select onchange='this.style.color=\"blue\"' id='tipoguias_"+d.id_atlas+"' >"
		ins += combolista(tipos,d.tipoguias_atlas)
		ins += "</select>"
		ins += "</td>"
		ins += "</tr>"
		ins += "</table>"
		ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluir(\""+d.id_atlas+"\")'/></td>"
		ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarAtlas(\""+d.id_atlas+"\",\""+d.id_atlas+"\")'/></td>"
		ins += "</tr></table>"
		ins += "<br>"

		var d = retorno.data.pranchas;
		var nm = d.length		
		ins += "<fieldset><legend>Pranchas</legend><p><table><tr><td><b>Selecione a prancha:</b></td><td></td></tr>"
		ins += "<tr><td><input style=font-size:10px onclick='alterarPranchas(\"\",\""+id_atlas+"\")' type=button value='Adicionar uma nova prancha' /></td><td><select onchange='pegaDadosPrancha(this.value,\""+id_atlas+"\")'>"
		ins += "<option>---</option>"
		for (i=0;i<nm;i++)
		{
			ins += "<option value='"+d[i].id_prancha+"'>"+d[i].titulo_prancha+"</option>"
		}
		ins += "</select></tr></table></p>"	
		ins += "<div id='dadosPranchas'></div></fieldset>"
		$i("dadosAtlas").innerHTML = ins
	}
	var cp = new cpaint();
	cp.set_response_type("JSON");
	var p = "../php/atlas.php?funcao=pegaDadosAtlas&id_atlas="+id_atlas;
	cp.call(p,"pegaDadosAtlas",retorna);
}
function pegaDadosPrancha(id_prancha,id_atlas)
{
	$i("dadosPranchas").innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{
		var ins = ""
		if(retorno.data.prancha[0])
		{
			var d = retorno.data.prancha[0]
    		ins += "<div><table class=lista ><tr><td></td><td></td></tr>";
			var param = {
			"linhas":[
			{titulo:"Nome",prefixoid:"tituloP_",id:"id_prancha",valor:"titulo_prancha"},
			{titulo:"Descrição",prefixoid:"descP_",id:"id_prancha",valor:"desc_prancha"},
			{titulo:"Ícone",prefixoid:"iconeP_",id:"id_prancha",valor:"icone_prancha"},
			{titulo:"Link",prefixoid:"linkP_",id:"id_prancha",valor:"link_prancha"},
			{titulo:"Largura da janela do texto exlicativo",prefixoid:"wP_",id:"id_prancha",valor:"w_prancha"},
			{titulo:"Altura",prefixoid:"hP_",id:"id_prancha",valor:"h_prancha"},
			{titulo:"Extensão geográfica",prefixoid:"mapextP_",id:"id_prancha",valor:"mapext_prancha"},
			{titulo:"Ordem de apresentação",prefixoid:"ordemP_",id:"id_prancha",valor:"ordem_prancha"}
			]
			}
			ins += (geraLinhas(d,param,2));
			ins += "</table>"
			ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluirPranchas(\""+id_atlas+"\",\""+id_prancha+"\")'/></td>"
			ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarPranchas(\""+id_prancha+"\",\""+id_atlas+"\")'/></td>"
			ins += "</tr></table>"
		}
		ins += "<br><fieldset><legend>Temas</legend><input style=font-size:10px onclick='alterarTemas(\""+id_prancha+"\",\"\")' type=button value='Adicionar um novo tema' />"
		ins += "<input style=font-size:10px onclick='listaTemas(\""+id_prancha+"\",\""+id_atlas+"\")' type=button value='Listar temas' />"

		ins += "<div id='dadosTemas'></div></fieldset>"
		$i("dadosPranchas").innerHTML = ins
	}
	var cp = new cpaint();
	cp.set_response_type("JSON");
	var p = "../php/atlas.php?funcao=pegaDadosPranchas&id_atlas="+id_atlas+"&id_prancha="+id_prancha;
	cp.call(p,"pegaDadosPranchas",retorna);
}
function listaTemas(id_prancha,id_atlas)
{
	$i("dadosTemas").innerHTML = $mensagemAguarde
	var comboTemas = comboObjeto($temas,"codigo_tema","nome_tema","")
	var retorna = function (retorno)
	{
		$i("dadosTemas").innerHTML = ""
		var param = {
			"linhas":[
			{titulo:"Ordem",prefixoid:"ordem_",id:"id_tema",valor:"ordem_tema"}
			]
		}
		var d = retorno.data;
		var nt = retorno.data.length
		var ins = ""
		for(k=0;k<nt;k++)
		{
			ins += "<div><table class=lista ><tr><td></td><td></td></tr>";
			ins += (geraLinhas(d[k],param,2));
			ins += "<tr>"
			ins += "<td>Nome: </td>"
			ins += "<td><select onchange='this.style.color=\"blue\"' id='codigo_"+d[k].id_tema+"' >"
			ins += comboTemas
			ins += "</select></td></tr>"
			ins += "</tr>"
			ins += "<tr>"
			ins += "<td>Ligado: </td>"
			ins += "<td>"
			ins += "<select onchange='this.style.color=\"blue\"' id='ligado_"+d[k].id_tema+"' >"
			ins += combosimnao(d[k].ligado_tema)
			ins += "</select></td>"
			ins += "</tr>"
			ins += "</table>"
			ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluirTemas(\""+d[k].id_tema+"\",\""+id_prancha+",\",\""+id_atlas+"\")'/></td>"
			ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarTemas(\""+id_prancha+"\",\""+d[k].id_tema+"\")'/></td>"
			ins += "</tr></table></div>"
		}
		$i("dadosTemas").innerHTML = ins
		for(k=0;k<nt;k++)
		$i('codigo_'+d[k].id_tema).value = d[k].codigo_tema
	}
	var cp = new cpaint();
	cp.set_response_type("JSON");
	var p = "../php/atlas.php?funcao=pegaTemas&id_prancha="+id_prancha;
	cp.call(p,"pegaTemas",retorna);	
}

function alterarTemas(id_prancha,id_tema)
{
	var retorna = function(retorno)
	{
		listaTemas(id_prancha);
	}
	if (id_tema != "")
	{
		var codigo_tema = document.getElementById("codigo_"+id_tema).value
		var ligado_tema = document.getElementById("ligado_"+id_tema).value
		var ordem_tema = document.getElementById("ordem_"+id_tema).value
	}
	else
	{
		var id_tema = "";
		var codigo_tema = ""
		var ligado_tema = ""
		var ordem_tema = 0
	}
	var p = "../php/atlas.php?funcao=alterarTemas&ordem_tema="+ordem_tema+"&id_tema="+id_tema+"&codigo_tema="+codigo_tema+"&ligado_tema="+ligado_tema+"&id_prancha="+id_prancha
	cPaint.call(p,"",retorna);	
}
function alterarPranchas(id_prancha,id_atlas)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			if(id_prancha == "")
			pegaDadosAtlas(id_atlas)
			else
			pegaDadosPrancha(id_prancha,id_atlas);
		}
		if (id_prancha != "")
		{
			var desc_prancha = document.getElementById("descP_"+id_prancha).value
			var h_prancha = document.getElementById("hP_"+id_prancha).value
			var w_prancha = document.getElementById("wP_"+id_prancha).value
			var icone_prancha = document.getElementById("iconeP_"+id_prancha).value
			var link_prancha = document.getElementById("linkP_"+id_prancha).value
			var titulo_prancha = document.getElementById("tituloP_"+id_prancha).value
			var mapext_prancha = document.getElementById("mapextP_"+id_prancha).value
			var ordem_prancha = document.getElementById("ordemP_"+id_prancha).value

		}
		else
		{
			var id_prancha = "";
			var desc_prancha = ""
			var h_prancha = "250"
			var w_prancha = "250"
			var icone_prancha = ""
			var link_prancha = ""
			var ordem_prancha = 0
			var titulo_prancha = prompt("Nome da nova prancha","");
			if (titulo_prancha==null || titulo_prancha=="")
  			{
  				return;
  			}

			var mapext_prancha = "";
		}
		var p = "../php/atlas.php?funcao=alterarPranchas&ordem_prancha="+ordem_prancha+"&id_atlas="+id_atlas+"&id_prancha="+id_prancha+"&titulo_prancha="+titulo_prancha+"&desc_prancha="+desc_prancha+"&h_prancha="+h_prancha+"&w_prancha="+w_prancha+"&icone_prancha="+icone_prancha+"&link_prancha="+link_prancha
		cPaint.call(p,"",retorna);	
	//}
}

function alterarAtlas(id_atlas,onde)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			if (id_atlas == "")
			{listaAtlas()}
			else
			pegaDadosAtlas(id_atlas);
		}
		if (id_atlas != "")
		{
			var titulo_atlas = document.getElementById("titulo_"+id_atlas).value
			var desc_atlas = document.getElementById("desc_"+id_atlas).value
			var h_atlas = document.getElementById("h_"+id_atlas).value
			var w_atlas = document.getElementById("w_"+id_atlas).value
			var icone_atlas = document.getElementById("icone_"+id_atlas).value
			var link_atlas = document.getElementById("link_"+id_atlas).value
			var pranchadefault_atlas = document.getElementById("pranchadefault_"+id_atlas).value
			var template_atlas = document.getElementById("template_"+id_atlas).value
			var tipoguias_atlas = document.getElementById("tipoguias_"+id_atlas).value
			var basemapfile_atlas = document.getElementById("basemapfile_"+id_atlas).value
			var ordem_atlas = document.getElementById("ordematlas_"+id_atlas).value
		}
		else
		{
			var id_atlas = "";
			var desc_atlas = ""
			var h_atlas = "250"
			var w_atlas = "250"
			var icone_atlas = ""
			var link_atlas = ""
			var pranchadefault_atlas = ""
			var template_atlas = ""
			var tipoguias_atlas = "expandida"
			var ordem_atlas = 0
			var titulo_atlas = prompt("Nome do novo Atlas","");
			if (titulo_atlas==null || titulo_atlas=="")
  			{
  				return;
  			}
			var basemapfile_atlas = "";
		}
		var p = "../php/atlas.php?funcao=alterarAtlas&ordem_atlas="+ordem_atlas+"&id_atlas="+id_atlas+"&basemapfile_atlas="+basemapfile_atlas+"&titulo_atlas="+titulo_atlas+"&desc_atlas="+desc_atlas+"&h_atlas="+h_atlas+"&w_atlas="+w_atlas+"&icone_atlas="+icone_atlas+"&link_atlas="+link_atlas+"&pranchadefault_atlas="+pranchadefault_atlas+"&template_atlas="+template_atlas+"&tipoguias_atlas="+tipoguias_atlas
		cPaint.call(p,"",retorna);	
	//}
}
function excluir(id)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function(retorno)
		{
			if(retorno.data == "erro")
			{
				alert("Nao foi possivel excluir.Exclua as pranchas primeiro")
			}
			else
			{
				$i("resultado").innerHTML = $mensagemAguarde;
				montaParametros()	
			}
		}
		var p = "../php/atlas.php?funcao=excluir&id="+id;
		cPaint.call(p,"",retorna);	
	}
}
function excluirPranchas(id_atlas,id_prancha)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function(retorno)
		{
			if(retorno.data == "erro")
			{
				alert("Nao foi possivel excluir.Exclua os temas primeiro")
			}
			else
			{
				pegaDadosAtlas(id_atlas)	
			}
		}
		var p = "../php/atlas.php?funcao=excluirPranchas&id="+id_prancha;
		cPaint.call(p,"",retorna);	
	}
}
function excluirTemas(id_tema,id_prancha,id_atlas)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function()
		{
			listaTemas(id_prancha,id_atlas)
		}
		var p = "../php/atlas.php?funcao=excluirTemas&id="+id_tema;
		cPaint.call(p,"",retorna);	
	}
}

function importarXmlAtlas()
{
	$i("resultado").innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{$i("resultado").innerHTML = retorno.data}
	var p = "../php/atlas.php?funcao=importarXmlAtlas&xml="+$i("arquivo").value;
	cPaint.call(p,"",retorna);
}