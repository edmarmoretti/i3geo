/*
Title: Conex&atilde;o com WMS

Acrescenta ao mapa um novo tema com base em um endere&ccedil;o de WMS

O usu&aacute;rio pode indicar o endere&ccedil;o ou escolher de uma lista. A lista &eacute; pr&eacute;-definida por meio do sistema de administra&ccedil;&atilde;o
do i3Geo.

Veja:

<ADICIONATEMAWMS>

Arquivo:

i3geo/ferramentas/conectarwms/index.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

//parametrosURL();
//variaveis globais
g_tipo = ""; //tipo de tema
g_tema = ""; //tema selecionado do ws
g_legenda = ""; //legenda do tema
g_nometema = ""; //nome do tema
g_idws = "";
var g_tipows = "";//obtido do mapfile
ativaGuias("");
mostraGuia("guia1");
$i("guia1").onclick = function()
{
	mostraGuia("guia1");
	$i("resultadoget").innerHTML = "";
};
$i("guia2").onclick = function(){clickGuia2();};
$i("guia3").onclick = function(){clickGuia3();};
function aguarde(valor){
	document.getElementById("aguarde").style.display = valor;
}
/*
Function: listaRSS

Monta a lista de servi&ccedil;os WMS cadastrados no sistema de administra&ccedil;&atilde;o do i3Geo

Veja:

<LISTARSSWSARRAY>

Parametros:

g_RSS {Array} - array com a lista de RSS que cont&eacute;m a lista de WMS cadastrados. Se for um array com um &uacute;nico elemento vazio,
ser&aacute; utilizado o endere&ccedil;o default do i3GEO (g_RSS = new Array(""))

onde {Stribg} - id do elemento HTML que receber&aacute; a lista de endere&ccedil;os formatada
*/
function listaRSS(g_RSS,onde)
{
	var mostraRetornoRSS = function(retorno){
		aguarde("none");
		var reg = /Erro/gi;
		if (retorno.data.rss.search(reg) != -1)
		{
			i3GEO.janela.tempoMsg($trad('erro',i3GEOF.conectarwms.dicionario)+"\n"+retorno.data);
			return;
		}
		var canais = retorno.data.canais;
		var ncanais = canais.length;
		var ins = "<br>"+retorno.data.rss;
		for (var i=0;i<ncanais; i++)
		{
			var caso = canais[i];
			ins += "\<p class=clique onclick=\"registraws('"+caso.link+"','"+caso.id_ws+"','"+caso.tipo_ws+"')\" \>\<b\>"+caso.title+"\<\/b\>&nbsp;"+caso.description+"&nbsp;("+caso.author+")";
			if(caso.nacessos > 0)
			{
				var pc = (parseInt(caso.nacessosok) * 100) / parseInt(caso.nacessos);
				ins += " \<span style=color:gray \>("+$trad('disponibilidade',i3GEOF.conectarwms.dicionario)+": "+pc+"%, "+$trad('acessos',i3GEOF.conectarwms.dicionario)+": "+caso.nacessos+")\<\/span>\<\/p\>";
			}
		}
		document.getElementById(onde).innerHTML = ins+"<br><br>";
	};
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
	if ($i("servico").value == ""){i3GEO.janela.tempoMsg($trad('servico',i3GEOF.conectarwms.dicionario));}
	else
	{window.open($i("servico").value+"&service=wms&request=getcapabilities&version=1.1.1");}
}
/*
Function: clickGuia2

Mostra as principais informa&ccedil;&otilde;es sobre o WMS escolhido tendo como fonte o getcapabilities

Veja:

<GETCAPABILITIES2>
*/
function clickGuia2()
{
	mostraGuia("guia2");
	if ($i("servico").value == ""){i3GEO.janela.tempoMsg($trad('servico',i3GEOF.conectarwms.dicionario));}
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
				aguarde("none");
				$i("resultadoget").innerHTML = "<p style=color:red >"+$trad('erro',i3GEOF.conectarwms.dicionario)+"<br>";
			}
		};
		$i("guia2obj").style.display="block";
		aguarde("block");
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=getcapabilities2&servico="+$i("servico").value;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities2",metadados);
	}
}
/*
Function: clickGuia3

Lista as camadas existentes no WMS escolhido.

O resultado da chamada em PHP &eacute; uma string HTML j&aacute; formatada. O "radio" aponta para a fun&ccedil;&atilde;o "adiciona"

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
	};
	mostraGuia("guia3");
	if ($i("servico").value == ""){
		i3GEO.janela.tempoMsg($trad('servico',i3GEOF.conectarwms.dicionario));
	}
	else
	{
		$i("listatemas").innerHTML = "";
		aguarde("block");
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=temaswms&id_ws="+g_idws+"&servico="+$i("servico").value;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"temaswms",listatemas);
	}
}
/*
Function: registraws

Armazena em vari&aacute;veis locais os parametros do WMS escolhido e ativa a guia 3, mostrando a lista de camadas dispon&iacute;veis

Parametros:

nome {string} - nome do WMS

id_ws {String} - id do WMS
*/
function registraws(nome,id_ws,tipo)
{
	$i("servico").value = nome;
	g_tipo = ""; //tipo de tema
	g_tipows = "WMS"; //tipo de servico
	g_tema = ""; //tema selecionado do ws
	g_legenda = ""; //legenda do tema
	g_nometema = ""; //nome do tema
	if(arguments.length == 2)
	g_idws = id_ws;
	else
	g_idws = "";
	if(tipo){
		g_tipows = tipo;
	}
	clickGuia3();
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
			{i3GEO.janela.tempoMsg($trad('erro2',i3GEOF.conectarwms.dicionario));aguarde("none");}
			else
			{window.parent.i3GEO.atualiza();}
		};
		aguarde("block");
		var tiporep = $i("tiporep").value;
		var url = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid;
		if($i("servico").value.split("?").length === 1){
			$i("servico").value = $i("servico").value+"?";
		}
		if($i("proj").value === ""){
			$i("proj").value = "EPSG:4326";
		}
		var p = "&funcao=adicionatemawms&servico="+$i("servico").value+"&tema="+g_tema+"&nome="+g_nometema+"&proj="+$i("proj").value+"&formato="+$i("formatos").value+"&tipo="+g_tipo+"&versao="+$i("versao").value+"&nomecamada="+g_nomecamada+"&tiporep="+tiporep+"&suportasld="+g_sld+"&formatosinfo="+$i("formatosinfo").value;
		if(g_tipows == "WMS-Tile"){
			p += "&tile=1";
		}
		else{
			p += "&tile=0";
		}
		var cp = new cpaint();
		cp.set_transfer_mode("POST");
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(url,"adicionatemawms",retorno,p);
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
	var janelaeditor = window.parent.i3GEO.janela.cria(
			"1000",
			"500",
			s,
			parseInt(Math.random()*100,10),
			10,
			s,
			"janela"+window.parent.i3GEO.util.randomRGB(),
			false,
			"hd",
			"",
			"",
			"",
			true,
			window.parent.i3GEO.configura.locaplic+"/imagens/oxygen/16x16/application-x-smb-workgroup.png"
		);
	YAHOO.util.Event.addListener(janelaeditor[0].close, "click", iniciaListaWS,janelaeditor[0].panel,{id:janelaeditor[0].id},true);
}