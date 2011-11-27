/*
Title: Conexão com WMS

Acrescenta ao mapa um novo tema com base em um endereço de WMS

O usuário pode indicar o endereço ou escolher de uma lista. A lista é pré-definida por meio do sistema de administração
do i3Geo.

Veja:

<ADICIONATEMAWMS>

Arquivo:

i3geo/ferramentas/conectarwms/index.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

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
g_idws = ""
ativaGuias("")
mostraGuia("guia1")
$i("guia1").onclick = function()
{
	mostraGuia("guia1")
	$i("resultadoget").innerHTML = "";
}
$i("guia2").onclick = function(){clickGuia2();}
$i("guia3").onclick = function(){clickGuia3();}

/*
Function: listaRSS

Monta a lista de serviços WMS cadastrados no sistema de administração do i3Geo

Veja:

<LISTARSSWSARRAY>

Parametros:

g_RSS {Array} - array com a lista de RSS que contém a lista de WMS cadastrados. Se for um array com um único elemento vazio,
será utilizado o endereço default do i3GEO (g_RSS = new Array(""))

onde {Stribg} - id do elemento HTML que receberá a lista de endereços formatada
*/ 
function listaRSS(g_RSS,onde)
{
	var mostraRetornoRSS = function(retorno){
		aguarde("none")
		var reg = /Erro/gi;
		if (retorno.data.rss.search(reg) != -1)
		{
			alert("OOps! Ocorreu um erro\n"+retorno.data);
			return;
		}
		var canais = retorno.data.canais
		var ncanais = canais.length
		var ins = "<br>"+retorno.data.rss
		for (i=0;i<ncanais; i++)
		{
			var caso = canais[i]
			ins += "\<p class=clique onclick=\"registraws('"+caso.link+"','"+caso.id_ws+"')\" \>\<b\>"+caso.title+"\<\/b\>&nbsp;"+caso.description+"&nbsp;("+caso.author+")"
			if(caso.nacessos > 0)
			{
				var pc = (parseInt(caso.nacessosok) * 100) / parseInt(caso.nacessos)
				ins += " \<span style=color:gray \>(disponibilidade: "+pc+"%, acessos considerados: "+caso.nacessos+")\<\/span>\<\/p\>";
			}
		}
		document.getElementById(onde).innerHTML = ins+"<br><br>"
	}
	if (document.getElementById(onde))
	{
		if (g_RSS.length > 0)
		{
			var p = "../../classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss="+g_RSS.join("|")+"&tipo=GEORSS";
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"listaRSSwsARRAY",mostraRetornoRSS);
		}
	}
}
/*
Function: getcapabilities

Abre uma nova janela com o resultado da chamada GETCAPABILITIES sobre o WMS escolhido
*/
function getcapabilities()
{
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{window.open($i("servico").value+"&service=wms&request=getcapabilities&version=1.1.1")}
}
/*
Function: clickGuia2

Mostra as principais informações sobre o WMS escolhido tendo como fonte o getcapabilities

Veja:

<GETCAPABILITIES2>
*/
function clickGuia2()
{
	mostraGuia("guia2")
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		var metadados = function(retorno){
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
		};
		$i("guia2obj").style.display="block";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=getcapabilities2&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities2",metadados);
	}
}
/*
Function: clickGuia3

Lista as camadas existentes no WMS escolhido.

O resultado da chamada em PHP é uma string HTML já formatada. O "radio" aponta para a função "adiciona"

Veja:

<TEMASWMS>
*/
function clickGuia3()
{
	var listatemas = function(retorno)
	{
		g_idws = "";
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
	mostraGuia("guia3")
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		$i("listatemas").innerHTML = "";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=temaswms&id_ws="+g_idws+"&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"temaswms",listatemas);
	}
}
/*
Function: registraws

Armazena em variáveis locais os parâmetros do WMS escolhido e ativa a guia 3, mostrando a lista de camadas disponíveis

Parametros:

nome {string} - nome do WMS

id_ws {String} - id do WMS
*/
function registraws(nome,id_ws)
{
	$i("servico").value = nome;
	g_tipo = ""; //tipo de tema
	g_tema = ""; //tema selecionado do ws
	g_legenda = ""; //legenda do tema
	g_nometema = ""; //nome do tema
	if(arguments.length == 2)
	g_idws = id_ws
	else
	g_idws = ""
	clickGuia3()
}
/*
Function: seltema

Inclui um LAYER, escolhido de um WMS, no mapa atual

Veja:

<ADICIONATEMAWMS>

*/
function seltema(tipo,tema,legenda,nometema,nomecamada,sldflag)
{
	g_tipo = tipo; //tipo de tema
	g_tema = tema; //tema selecionado do ws
	g_legenda = legenda; //legenda do tema
	g_nometema = nometema; //nome do tema
	g_nomecamada = nomecamada; //nome que vai na legenda
	g_sld = sldflag; //suporta ou nao sld
	if (g_tema != "")
	{
		var retorno = function(retorno)
		{
			aguarde("none");
			if(retorno.data != "ok")
			{alert("Ooops! Problemas ao acessar o serviço.");aguarde("none");}
			else
			{window.parent.i3GEO.atualiza()}
		}
		aguarde("block");
		var tiporep = $i("tiporep").value
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=adicionatemawms&servico="+$i("servico").value+"&tema="+g_tema+"&nome="+g_nometema+"&proj="+$i("proj").value+"&formato="+$i("formatos").value+"&tipo="+g_tipo+"&versao="+$i("versao").value+"&nomecamada="+g_nomecamada+"&tiporep="+tiporep+"&suportasld="+g_sld+"&formatosinfo="+$i("formatosinfo").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"adicionatemawms",retorno);
	}
}
/*
Function abrejanelaIframe

Abre uma janela flutuante contendo um iframe

Parametros:

w {string} - largura

h {string} - altura

s {string} - src do iframe
*/
function abrejanelaIframe(){
	var s = g_locaplic+"/admin/html/webservices.html?tipo=wms";
	var janelaeditor = window.parent.i3GEO.janela.cria("1000","500",s,parseInt(Math.random()*100,10),10,s,"janela"+window.parent.i3GEO.util.randomRGB(),false);
	YAHOO.util.Event.addListener(janelaeditor[0].close, "click", iniciaListaWS,janelaeditor[0].panel,{id:janelaeditor[0].id},true);
}