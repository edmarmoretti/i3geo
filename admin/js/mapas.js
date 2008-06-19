/*
Title: Arvore

Funções javascript utilizadas no sistema de administração do menu de mapas

File: i3geo/admin/mapas.js

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
}
function montaParametros()
{
	if(!$i("resultado"))
	{document.body.innerHTML += "<div id=resultado ></div>"}
	$i("resultado").innerHTML = $mensagemAguarde
	var p = "../php/mapas.php?funcao=pegaMapas";
	cPaint.call(p,"",listaMapas);
}
/*
Function: listaMapas

Monta o html com os parametros e os divs que receberão os dados dos formulários.

Para cada registro na variável $parameters, é montado um formulário.
*/
function listaMapas(retorno)
{
	ins = "<p><input style=font-size:10px onclick='alterarMapas(\"\",\"resultado\")' type=button value='Adicionar um novo mapa' /></p>"
	montaMapa(retorno,"resultado")
}
function montaMapa(retorno,onde)
{
	var d = retorno.data;
	var nm = retorno.data.length
	for (i=0;i<nm;i++)
	{
		if(!$i(d[i].id_mapa))
		ins += "<div id='"+d[i].id_mapa+"' >"
		ins += "<fieldset><legend style='background-color:white;'><b>+- "+d[i].nome_mapa+"</b></legend>"
	    ins += "<div style=display:none > <table class=lista ><tr><td></td><td></td></tr>";
		var param = {
			"linhas":[
			{titulo:"Nome",prefixoid:"nome_",id:"id_mapa",valor:"nome_mapa"},
			{titulo:"Descrição",prefixoid:"desc_",id:"id_mapa",valor:"desc_mapa"},
			{titulo:"Extensão",prefixoid:"ext_",id:"id_mapa",valor:"ext_mapa"},
			{titulo:"Imagem",prefixoid:"imagem_",id:"id_mapa",valor:"imagem_mapa"},
			{titulo:"Outros",prefixoid:"outros_",id:"id_mapa",valor:"outros_mapa"},
			{titulo:"Direto",prefixoid:"linkdireto_",id:"id_mapa",valor:"linkdireto_mapa"}
			]
		}
		ins += (geraLinhas(d[i],param,3));
		ins += "<tr>"
		ins += "<td>Temas: </td>"
		ins += "<td><input size=30 onchange='this.style.color=\"blue\"' type=text id='temas_"+d[i].id_mapa+"' value='"+d[i].temas_mapa+"' /></td>"
		ins += "<td><select onchange='adicionaTema(\""+d[i].id_mapa+"\",this.value)'>"
		ins += comboObjeto($temas,"codigo_tema","nome_tema","")
		ins += "</select>"
		ins += "</td>"
		ins += "</tr>"
		
		ins += "<tr>"
		ins += "<td>Perfis: </td>"
		ins += "<td><input size=30 onchange='this.style.color=\"blue\"' type=text id='perfis_"+d[i].id_mapa+"' value='"+d[i].perfil_mapa+"' /></td>"
		var idtemp = "perfis_"+d[i].id_mapa
		ins += "<td><select onchange=\"registraPerfil('"+idtemp+"',this.value);this.style.color='blue'\"  >"
		ins += comboObjeto($perfis,"perfil","perfil","")
		ins += "</select></td></tr>"

		ins += "</select>"
		ins += "</td>"
		ins += "</tr>"
		
		
		
		ins += "<tr>"
		ins += "<td>Ligados: </td>"
		ins += "<td><input size=30 onchange='this.style.color=\"blue\"' type=text id='ligados_"+d[i].id_mapa+"' value='"+d[i].ligados_mapa+"' /></td>"
		ins += "</tr>"
		ins += "</table>"
		ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluir(\""+d[i].id_mapa+"\")'/></td>"
		ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarMapas(\""+d[i].id_mapa+"\",\""+d[i].id_mapa+"\")'/></td>"
		ins += "</tr></table>"
		if(d[i].linkdireto_mapa != "")
		{var l = d[i].linkdireto_mapa;}
		else
		{
			var l = "../ms_criamapa.php?temasa="+d[i].temas_mapa+"&layers="+d[i].ligados_mapa
			if (d[i].ext_mapa != "")
			{l += "&mapext="+d[i].ext_mapa}
			if (d[i].outros_mapa != "")
			{l += "&"+d[i].outros_mapa}
		}
		ins += "<br>Testar: <a href='"+l+"' target=blank >"+l+"</a>"
		if(d[i].imagem_mapa != "")
		ins += "<br><img src='"+d[i].imagem_mapa+"' />"
		ins += "</div></fieldset><br>"
		if(!$i(d[i].id_mapa))
		ins += "</div>"
	}
	$i(onde).innerHTML = ins
	ativaLegenda()
}
function adicionaTema(id,codigo)
{
	var valor = $i("temas_"+id).value
	if(valor == "")
	$i("temas_"+id).value = codigo
	else
	$i("temas_"+id).value += " "+codigo
}
function alterarMapas(id_mapa,onde)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			if(id_mapa == "")
			listaMapas(retorno);
			else
			{ins = "";montaMapa(retorno,onde)}
		}
		if (id_mapa != "")
		{
			var nome = $i("nome_"+id_mapa).value
			var desc = $i("desc_"+id_mapa).value
			var ext = $i("ext_"+id_mapa).value
			var imagem = $i("imagem_"+id_mapa).value
			var outros = $i("outros_"+id_mapa).value
			var linkdireto = $i("linkdireto_"+id_mapa).value
			var temas = $i("temas_"+id_mapa).value
			var ligados = $i("ligados_"+id_mapa).value
			var perfil = $i("perfil_"+id_mapa).value
		}
		else
		{
			var id_mapa = "";
			var perfil = "";
		}
		var p = "../php/mapas.php?funcao=alterarMapas&id_mapa="+id_mapa+"&nome="+nome+"&desc="+desc+"&ext="+ext+"&imagem="+imagem+"&outros="+outros+"&linkdireto="+linkdireto+"&temas="+temas+"&ligados="+ligados+"&perfil="+perfil
		cPaint.call(p,"",retorna);	
	//}
}
function excluir(id)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		$i("resultado").innerHTML = $mensagemAguarde;
		var retorna = function()
		{
			montaParametros()	
		}
		var p = "../php/mapas.php?funcao=excluir&id="+id;
		cPaint.call(p,"",retorna);	
	}
}
function importarXmlMapas()
{
	$i("resultado").innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{$i("resultado").innerHTML = retorno.data}
	var p = "../php/mapas.php?funcao=importarXmlMapas&xml="+$i("arquivo").value;
	cPaint.call(p,"",retorna);
}