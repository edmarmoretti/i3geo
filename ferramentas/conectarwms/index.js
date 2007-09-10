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
		//wms esri so aceita 1.1.1
		window.open($i("servico").value+"&service=wms&request=getcapabilities&version=1.1.1")
	}
}

function clickGuia2()
{
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		$i("guia2obj").style.display="block";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=getcapabilities2&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities2",metadados);
	}
}
function clickGuia3()
{
	$i("guia3obj").style.display="block";
	$i("guia1obj").style.display="none";
	$i("listatemas").innerHTML = "";
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=temaswms&servico="+$i("servico").value
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"temaswms",listatemas);
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
		g_tipo = ""; //tipo de tema
		g_tema = ""; //tema selecionado do ws
		g_legenda = ""; //legenda do tema
		g_nometema = ""; //nome do tema
		g_sld = "";
		if ($i("suportasld"))
		{
			if ($i("suportasld").value != "nao")
			{
				if ($i("textoSLD"))
				$i("textoSLD").style.display = "block";
			}
		}
	}
	else
	{$i("listatemas").innerHTML = "erro";}
}
function seltema(tipo,tema,legenda,nometema,nomecamada,sldflag)
{
	g_tipo = tipo; //tipo de tema
	g_tema = tema; //tema selecionado do ws
	g_legenda = legenda; //legenda do tema
	g_nometema = nometema; //nome do tema
	g_nomecamada = nomecamada; //nome que vai na legenda
	g_sld = sldflag; //suporta ou nao sld
	adiciona();
}
function adiciona()
{
	if (g_tema != "")
	{
		var retorno = function(retorno)
		{
			if(retorno.data != "ok")
			{alert("Ooops! Problemas ao acessar o serviço.");aguarde("none");}
			else
			{window.parent.remapaf()}
		}
		aguarde("block");
		var tiporep = $i("tiporep").value
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=adicionatemawms&servico="+$i("servico").value+"&tema="+g_tema+"&nome="+g_nometema+"&proj="+$i("proj").value+"&formato="+$i("formatos").value+"&tipo="+g_tipo+"&versao="+$i("versao").value+"&nomecamada="+g_nomecamada+"&tiporep="+tiporep+"&suportasld="+g_sld
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"adicionatemawms",retorno);
	}
}