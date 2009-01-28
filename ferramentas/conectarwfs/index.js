/*
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
parametrosURL()
//variaveis globais
g_tipo = ""; //tipo de tema
g_tema = ""; //tema selecionado do ws
g_legenda = ""; //legenda do tema
g_nometema = ""; //nome do tema
aguarde("none");
$i("guia1").onclick = function()
{
	$i("guia1obj").style.display="block";
	$i("resultadoget").innerHTML = "";
}
$i("guia2").onclick = function(){clickGuia2();}
$i("guia3").onclick = function(){clickGuia3();}

function getcapabilities()
{
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		window.open($i("servico").value+"&service=wfs&request=getcapabilities&version=1.1.0")
	}
}

function clickGuia2()
{
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		$i("guia2obj").style.display="block";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=getcapabilities3&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities3",metadados);
	}
}
function clickGuia3()
{
	$i("guia3obj").style.display="block";
	$i("guia1obj").style.display="none";
	$i("listatemas").innerHTML = "";
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=temaswfs&servico="+$i("servico").value
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"temaswfs",listatemas);
}
function registraws(nome)
{
	$i("servico").value = nome;
	g_tipo = ""; //tipo de tema
	g_tema = ""; //tema selecionado do ws
	g_legenda = ""; //legenda do tema
	g_nometema = ""; //nome do tema
	clickGuia3()
}

function metadados(retorno)
{
	if (retorno.data != undefined)
	{
		aguarde("none");
		$i("resultadoget").innerHTML = retorno.data;
	}
	else
	{
		aguarde("none")
		$i("resultadoget").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}
function listatemas(retorno)
{
	aguarde("none");
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		$i("listatemas").innerHTML = retorno.data;
	}
	else
	{$i("listatemas").innerHTML = "erro";}
}
function seltema(nome,titulo,prj,serv)
{
	var par = "&nome="+nome+"&titulo="+titulo+"&prj="+prj+"&wfs="+serv;
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=importawfs&servico="+$i("servico").value+par
	var cp = new cpaint();
	cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"importawfs",window.parent.i3GEO.atualiza);	
}
