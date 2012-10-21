/*
Title: Conex&atilde;o com georss

Acrescenta ao mapa um novo tema com base em um endere&ccedil;o de GEORSS

GEORSS &eacute; um servi&ccedil;o de not&iacute;cias que traz a coordenada geogr&aacute;fica da ocorr&ecirc;ncia (ou envelope).
O usu&aacute;rio pode indicar o endere&ccedil;o ou escolher de uma lista. A lista &eacute; pr&eacute;-definida por meio do sistema de administra&ccedil;&atilde;o
do i3Geo.

Veja:

<ADICIONATEMAGEORSS>

Arquivo:

i3geo/ferramentas/conectargeorss/index.js

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
ativaGuias("");
mostraGuia("guia1");
//variaveis globais
g_tipo = ""; //tipo de tema
g_tema = ""; //tema selecionado do ws
g_legenda = ""; //legenda do tema
g_nometema = ""; //nome do tema

$i("guia1").onclick = function()
{
	mostraGuia("guia1");
	$i("resultadoget").innerHTML = "";
};
$i("guia2").onclick = function(){clickGuia2();};

/*
Function: clickGuia2

Faz a busca dos RSS cadastrados no sistema de administra&ccedil;&atilde;o do i3Geo

Veja:

<GEORSSCANAIS>
*/
function clickGuia2()
{
	mostraGuia("guia2");
	$i("resultadoget").innerHTML = "";
	if ($i("servico").value == ""){i3GEO.janela.tempoMsg("Servi&ccedil;o n&atilde;o definido");}
	else
	{
		$i("guia2obj").style.display="block";
		aguarde("block");
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=georssCanais&servico="+$i("servico").value;
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
	g_idws = id_ws;
	else
	g_idws = "";
	clickGuia2();
}
/*
Function: listaCanais

Monta a lista com os canais existentes no RSS escolhido

Parametro:

retorno {JSON} - retorno da fun&ccedil;&atilde;o clickGuia2
*/
function listaCanais(retorno)
{
	var i,ins = "Clique no bot&atilde;o 'mapa' para incluir os dados do canal desejado<br>";
	if (retorno.data != undefined)
	{
		retorno = retorno.data;
		for (i=0;i<retorno.length; i++)
		{
			ins += "<p style=cursor:pointer onclick=adicionatema('"+i+"') ><input type=radio name=cn value=mapa >&nbsp;<b>"+retorno[i].title+ "</b></p>";
			ins += "<br><a href="+retorno[i].link+" target=blank >"+retorno[i].link+"</a>";
			ins += "<br><i>Descri&ccedil;&atilde;o:</i> "+retorno[i].description;
			ins += "<br><i>Categoria: </i>"+retorno[i].category;
		}
		$i("resultadoget").innerHTML = ins;
	}
	else
	{
		$i("resultadoget").innerHTML = "<p style=color:red >Ocorreu um erro<br>";
	}
	aguarde("none");
}
/*
Function: adicionatema

Adiciona ao mapa um tema com base no canal RSS escolhido

Veja:

<ADICIONATEMAGEORSS>

Parametro:

id {string} - id do canal (conforme a ordem que aparece no RSS
*/
function adicionatema(id)
{
	aguarde("block");
	var redesenha = function()
	{
		aguarde("none");
		window.parent.i3GEO.atualiza();
	};
	var p = g_locaplic+"/ferramentas/conectargeorss/exec.php?g_sid="+g_sid+"&funcao=adicionaTemaGeoRSS&canal="+id+"&servico="+$i("servico").value;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"adicionaTemaGeoRSS",redesenha);
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
	var s = window.parent.i3GEO.configura.locaplic+"/admin/html/webservices.html?tipo=GEORSS";
	var janelaeditor = window.parent.i3GEO.janela.cria("700","500",s,parseInt(Math.random()*100,10),10,s,"janela"+window.parent.i3GEO.util.randomRGB(),false);
	YAHOO.util.Event.addListener(janelaeditor[0].close, "click", iniciaListaGEORSS,janelaeditor[0].panel,{id:janelaeditor[0].id},true);
}