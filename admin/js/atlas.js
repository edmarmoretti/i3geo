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
	$i("resultado").innerHTML = $mensagemAguarde
	var p = "../php/atlas.php?funcao=pegaAtlas";
	cPaint.call(p,"",listaAtlas);
}
/*
Function: listaAtlas

Monta o html com os parametros e os divs que receberão os dados dos formulários.
*/
function listaAtlas(retorno)
{
	ins = "<p><input style=font-size:10px onclick='alterarAtlas(\"\",\"resultado\")' type=button value='Adicionar um novo atlas' /></p>"
	montaAtlas(retorno,"resultado")
}
function montaAtlas(retorno,onde)
{
	var d = retorno.data;
	var nm = retorno.data.length
	for (i=0;i<nm;i++)
	{
		if(!$i(d[i].id_atlas))
		{ins += "<div id="+d[i].id_atlas+" >"}
		ins += "<fieldset><legend style='background-color:white;'><b>+- "+d[i].titulo_atlas+"</b></legend>"
	    ins += "<div style=display:none ><table class=lista ><tr><td></td><td></td></tr>";
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
			{titulo:"Mapfile base",prefixoid:"basemapfile_",id:"id_atlas",valor:"basemapfile_atlas"}
			]
		}
		ins += (geraLinhas(d[i],param,2));
		ins += "<tr>"
		ins += "<td>Tipo das guias: </td>"
		ins += "<select onchange='this.style.color=\"blue\"' id='tipoguias_"+d[i].id_atlas+"' >"
		ins += combolista(tipos,d[i].tipoguias_atlas)
		ins += "</select>"
		ins += "</td>"
		ins += "</tr>"
		ins += "</table>"
		ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluir(\""+d[i].id_atlas+"\")'/></td>"
		ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarAtlas(\""+d[i].id_atlas+"\",\""+d[i].id_atlas+"\")'/></td>"
		ins += "</tr></table>"
		ins += "<fieldset><legend>+- Pranchas</legend>"
		ins += "<div style=display:none ><p><input style=font-size:10px onclick='alterarPranchas(\"\",\""+d[i].id_atlas+"\")' type=button value='Adicionar uma nova prancha' /></p>"
		ins += "<div id=pranchas_"+d[i].id_atlas+" ></div>"
		ins += "</div></fieldset>"
		if(!$i(d[i].id_atlas))
		ins += "</div>"
		ins += "</div></fieldset>"
	}
	$i(onde).innerHTML = ins
	listaPranchas(retorno)
}
function listaPranchas(retorno)
{
	var d = retorno.data;
	var nm = retorno.data.length
	for (i=0;i<nm;i++)
	{	
		var ins = ""
		var nf = d[i].pranchas.length
		for (j=0;j<nf;j++)
		{
			ins += "<fieldset><legend>+- "+d[i].pranchas[j].titulo_prancha+"</legend>"
	    	ins += "<div style=display:none ><table class=lista ><tr><td></td><td></td></tr>";
			var param = {
				"linhas":[
				{titulo:"Nome",prefixoid:"tituloP_",id:"id_prancha",valor:"titulo_prancha"},
				{titulo:"Descrição",prefixoid:"descP_",id:"id_prancha",valor:"desc_prancha"},
				{titulo:"Ícone",prefixoid:"iconeP_",id:"id_prancha",valor:"icone_prancha"},
				{titulo:"Link",prefixoid:"linkP_",id:"id_prancha",valor:"link_prancha"},
				{titulo:"Largura da janela do texto exlicativo",prefixoid:"wP_",id:"id_prancha",valor:"w_prancha"},
				{titulo:"Altura",prefixoid:"hP_",id:"id_prancha",valor:"h_prancha"},
				{titulo:"Extensão geográfica",prefixoid:"mapextP_",id:"id_prancha",valor:"mapext_prancha"}
				]
			}
			ins += (geraLinhas(d[i].pranchas[j],param,2));
			ins += "</table>"
			ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluirPranchas(\""+d[i].pranchas[j].id_prancha+"\")'/></td>"
			ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarPranchas(\""+d[i].pranchas[j].id_prancha+"\",\""+d[i].id_atlas+"\")'/></td>"
			ins += "</tr></table>"
			
			ins += "<fieldset><legend>+- Temas</legend>"
			ins += "<div style=display:none ><p><input style=font-size:10px onclick='alterarTemas(\"\",\""+d[i].pranchas[j].id_prancha+"\")' type=button value='Adicionar um novo tema' /></p>"
			ins += "<div id=temas_"+d[i].pranchas[j].id_prancha+" ></div>"
			ins += "</div></fieldset>"
			ins += "</div></fieldset><br>"		
		}
		if(document.getElementById("pranchas_"+d[i].id_atlas))
		{document.getElementById("pranchas_"+d[i].id_atlas).innerHTML = ins}
	}
	listaTemas(retorno)
}
function listaTemas(retorno)
{
	var d = retorno.data;
	var nm = retorno.data.length
	for (i=0;i<nm;i++)
	{	
		var nf = d[i].pranchas.length
		for (j=0;j<nf;j++)
		{
			var ins = ""
			var nt = d[i].pranchas[j].temas.length
			for(k=0;k<nt;k++)
			{
				ins += "<fieldset><legend>"+d[i].pranchas[j].temas[k].codigo_tema+"</legend>"
	    		ins += "<div style=display:none ><table class=lista ><tr><td></td><td></td></tr>";
				ins += "<tr>"
				ins += "<td>Nome: </td>"
				ins += "<td><select onchange='this.style.color=\"blue\"' id='codigo_"+d[i].pranchas[j].temas[k].id_tema+"' >"
				ins += comboObjeto($temas,"codigo_tema","nome_tema",d[i].pranchas[j].temas[k].codigo_tema)
				ins += "</select></td></tr>"
				ins += "</tr>"
				ins += "<tr>"
				ins += "<td>Ligado: </td>"
				ins += "<td>"
				ins += "<select onchange='this.style.color=\"blue\"' id='ligado_"+d[i].pranchas[j].temas[k].id_tema+"' >"
				ins += combosimnao(d[i].pranchas[j].temas[k].ligado_tema)
				ins += "</select></td>"
				ins += "</tr>"
				ins += "</table>"
				ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluirTemas(\""+d[i].pranchas[j].temas[k].id_tema+"\")'/></td>"
				ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarTemas(\""+d[i].pranchas[j].temas[k].id_tema+"\",\""+d[i].pranchas[j].id_prancha+"\")'/></td>"
				ins += "</tr></table>"
				ins += "</div></fieldset><br>"
			}
			if(document.getElementById("temas_"+d[i].pranchas[j].id_prancha))
			{document.getElementById("temas_"+d[i].pranchas[j].id_prancha).innerHTML = ins}
		}
	}
	ativaLegenda()
}

function alterarTemas(id_tema,id_prancha)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			listaTemas(retorno);
		}
		if (id_tema != "")
		{
			var codigo_tema = document.getElementById("codigo_"+id_tema).value
			var ligado_tema = document.getElementById("ligado_"+id_tema).value
		}
		else
		{
			var id_tema = "";
			var codigo_tema = ""
			var ligado_tema = "250"
		}
		var p = "../php/atlas.php?funcao=alterarTemas&id_prancha="+id_prancha+"&id_tema="+id_tema+"&codigo_tema="+codigo_tema+"&ligado_tema="+ligado_tema
		cPaint.call(p,"",retorna);	
	//}
}
function alterarPranchas(id_prancha,id_atlas)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			listaPranchas(retorno);
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
		}
		else
		{
			var id_prancha = "";
			var desc_prancha = ""
			var h_prancha = "250"
			var w_prancha = "250"
			var icone_prancha = ""
			var link_prancha = ""
			var titulo_prancha = "";
			var mapext_prancha = "";
		}
		var p = "../php/atlas.php?funcao=alterarPranchas&id_atlas="+id_atlas+"&id_prancha="+id_prancha+"&titulo_prancha="+titulo_prancha+"&desc_prancha="+desc_prancha+"&h_prancha="+h_prancha+"&w_prancha="+w_prancha+"&icone_prancha="+icone_prancha+"&link_prancha="+link_prancha
		cPaint.call(p,"",retorna);	
	//}
}

function alterarAtlas(id_atlas,onde)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			if(id_atlas == "")
			listaAtlas(retorno);
			else
			{ins = "";montaAtlas(retorno,onde)}
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
			var titulo_atlas = "";
			var basemapfile_atlas = "";
		}
		var p = "../php/atlas.php?funcao=alterarAtlas&id_atlas="+id_atlas+"&basemapfile_atlas="+basemapfile_atlas+"&titulo_atlas="+titulo_atlas+"&desc_atlas="+desc_atlas+"&h_atlas="+h_atlas+"&w_atlas="+w_atlas+"&icone_atlas="+icone_atlas+"&link_atlas="+link_atlas+"&pranchadefault_atlas="+pranchadefault_atlas+"&template_atlas="+template_atlas+"&tipoguias_atlas="+tipoguias_atlas
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
function excluirPranchas(id)
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
				$i("resultado").innerHTML = $mensagemAguarde;
				montaParametros()	
			}
		}
		var p = "../php/atlas.php?funcao=excluirPranchas&id="+id;
		cPaint.call(p,"",retorna);	
	}
}
function excluirTemas(id)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		$i("resultado").innerHTML = $mensagemAguarde;
		var retorna = function()
		{
			montaParametros()	
		}
		var p = "../php/atlas.php?funcao=excluirTemas&id="+id;
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