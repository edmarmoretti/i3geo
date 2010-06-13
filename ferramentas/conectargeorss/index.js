/*
Title: Conexão com georss

Arquivo:

i3geo/ferramentas/conectargeorss/index.js

Licenca:

GPL2

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

parametrosURL()
ativaGuias("")
mostraGuia("guia1")
//variaveis globais
g_tipo = ""; //tipo de tema
g_tema = ""; //tema selecionado do ws
g_legenda = ""; //legenda do tema
g_nometema = ""; //nome do tema

$i("guia1").onclick = function()
{
	mostraGuia("guia1")
	$i("resultadoget").innerHTML = "";
}
$i("guia2").onclick = function(){clickGuia2();}

function clickGuia2()
{
	mostraGuia("guia2")
	$i("resultadoget").innerHTML = "";
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		$i("guia2obj").style.display="block";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=georssCanais&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"georssCanais",listaCanais);
	}
}
function registraws(nome,id_ws)
{
	$i("servico").value = nome;
	if(arguments.length == 2)
	g_idws = id_ws
	else
	g_idws = ""
	clickGuia2()
}
function listaCanais(retorno)
{
	var ins = "Clique no bot&atilde;o 'mapa' para incluir os dados do canal desejado<br>"
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		for (i=0;i<retorno.length; i++)
		{
			ins += "<p style=cursor:pointer onclick=adicionatema('"+i+"') ><input type=radio name=cn value=mapa >&nbsp;<b>"+retorno[i].title+ "</b></p>"
			ins += "<br><a href="+retorno[i].link+" target=blank >"+retorno[i].link+"</a>"
			ins += "<br><i>Descri&ccedil;&atilde;o:</i> "+retorno[i].description
			ins += "<br><i>Categoria: </i>"+retorno[i].category
		}
		$i("resultadoget").innerHTML = ins
	}
	else
	{
		$i("resultadoget").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
	aguarde("none")
}
function adicionatema(id)
{
	aguarde("block")
	var redesenha = function()
	{
		aguarde("none")
		window.parent.i3GEO.atualiza("")
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=adicionaTemaGeoRSS&canal="+id+"&servico="+$i("servico").value
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"adicionaTemaGeoRSS",redesenha);
}