/*
Title: Arvore

Funções javascript utilizadas no sistema de administração do cadastro de web services

File: i3geo/admin/webservices.js

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
	var p = "../php/webservices.php?funcao=pegaWS";
	cPaint.call(p,"",listaWS);
}
/*
Function: listaWS

Monta o html com os parametros e os divs que receberão os dados dos formulários.
*/
function listaWS(retorno)
{
	ins = "<p><input style=font-size:10px onclick='alterarWS(\"\",\"resultado\")' type=button value='Adicionar um novo web service' /></p>"
	montaWS(retorno,"resultado")	
}
function montaWS(retorno,onde)
{
	var d = retorno.data;
	var nm = retorno.data.length
	for (i=0;i<nm;i++)
	{
		if(!$i(d[i].id_ws))
		{ins += "<div id="+d[i].id_ws+" >"}
		ins += "<fieldset><legend style='background-color:white;'><b>+- "+d[i].nome_ws+"</b></legend>"
	    ins += "<div style=display:none ><table class=lista ><tr><td></td><td></td></tr>";
		var param = {
			"linhas":[
			{titulo:"Nome",prefixoid:"nome_",id:"id_ws",valor:"nome_ws"},
			{titulo:"Descrição",prefixoid:"desc_",id:"id_ws",valor:"desc_ws"},
			{titulo:"Autor",prefixoid:"autor_",id:"id_ws",valor:"autor_ws"},
			{titulo:"Endereço",prefixoid:"link_",id:"id_ws",valor:"link_ws"},
			{titulo:"Nome",prefixoid:"nome_",id:"id_ws",valor:"nome_ws"}
			]
		}
		ins += (geraLinhas(d[i],param,2));
		ins += "<tr>"
		ins += "<td>Tipo: </td>"
		ins += "<td><select onchange='this.style.color=\"blue\"' id='tipo_"+d[i].id_ws+"' >"
		ins += combolista(tipos,d[i].tipo_ws)
		ins += "</select>"
		ins += "</td>"
		ins += "</tr>"
		ins += "</table>"
		ins += "<table><tr><td><div class=excluir title='Excluir' onclick='excluir(\""+d[i].id_ws+"\")'/></td>"
		ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarWS(\""+d[i].id_ws+"\",\""+d[i].id_ws+"\")'/></td>"
		ins += "</tr></table>"
		ins += "</div></fieldset><br>"
		if(!$i(d[i].id_ws))
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
function alterarWS(id_ws,onde)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			if(id_ws == "")
			listaWS(retorno);
			else
			{ins = "";montaWS(retorno,onde)}
		}
		if (id_ws != "")
		{
			var nome = $i("nome_"+id_ws).value
			var desc = $i("desc_"+id_ws).value
			var autor = $i("autor_"+id_ws).value
			var link = $i("link_"+id_ws).value
			var tipo = $i("tipo_"+id_ws).value
		}
		else
		{
			var id_ws = "";
			var nome = ""
			var desc = ""
			var autor = ""
			var link = ""
			var tipo = ""
		}
		var p = "../php/webservices.php?funcao=alterarWS&id_ws="+id_ws+"&nome="+nome+"&desc="+desc+"&autor="+autor+"&link="+link+"&tipo="+tipo
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
		var p = "../php/webservices.php?funcao=excluir&id="+id;
		cPaint.call(p,"",retorna);	
	}
}
function importarXmlWS()
{
	$i("resultado").innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{$i("resultado").innerHTML = retorno.data}
	var p = "../php/webservices.php?funcao=importarXmlWS&xml="+$i("arquivo").value+"&tipo="+$i("tipo").value;
	cPaint.call(p,"",retorna);
}