/*
Title: ms_configura.js

Fun&ccedil;&otilde;es que controlam a interface do editor das vari&aacute;veis de inicializa&ccedil;&atilde;o

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

Arquivo:

i3geo/admin/js/ms_configura.js
*/
YAHOO.namespace("admin.container");
/*
Function: initMenu

Inicializa o editor

<PEGAPARAMETROSCONFIGURA>
*/
function initMenu()
{
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	new YAHOO.widget.Button("botao2",{ onclick: { fn: function(){window.open('../../testainstal.php');}} });
	$parametros = {
	"simples": [
	{ mensagem: "Mensagem mostrada sempre que o i3geo &eacute; inicializado.",cabeca: "Mensagem de inicializa&ccedil;&atilde;o", variavel: "$mensagemInicia"},
	{ mensagem: "Texto mostrado na barra superior do navegador e em alguns aplicativos do i3geo, como a vers&atilde;o mobile.",cabeca: "T&iacute;tulo", variavel: "$tituloInstituicao"},
	{ mensagem: "Diret&oacute;rio (caminho absoluto) utilizado para armazenar os mapfiles tempor&aacute;rios e outros arquivos utilizados durante a opera&ccedil;&atilde;o do i3geo. Em sistemas Linux, voc&ecirc; pode criar um link simb&oacute;lico para esse diret&oacute;rio.",cabeca: "Diret&oacute;rio tempor&aacute;rio", variavel: "$dir_tmp"},
	{ mensagem: "Chave utilizada pelo Google Maps",cabeca: "Google maps", variavel: "$googleApiKey"},
	{ mensagem: "Local no servidor (caminho absoluto) onde o i3geo est&aacute; armazenado.",cabeca: "Localiza&ccedil;&atilde;o do i3geo", variavel: "$locaplic"},
	{ mensagem: "Diret&oacute;rio onde ficam armazenados os arquivos de template HTML e mapfiles iniciais",cabeca: "Diret&oacute;rio aplicmap", variavel: "$temasaplic"},
	{ mensagem: "Onde est&aacute; armazenado o mapserv CGI no servidor",cabeca: "Mapserv CGI", variavel: "$locmapserv"},
	{ mensagem: "Endere&ccedil;o do arquivo XML ou programa PHP que gera o xml com a lista de sistemas que s&atilde;o inclu&iacute;dos na guia de adi&ccedil;&atilde;o de temas. Se voc&ecirc; deixar em branco, ser&aacute; utilizado o banco de dados administrativo ao inv&eacute;s do arquivo XML em disco.",cabeca: "XML sistemas", variavel: "$locsistemas"},
	{ mensagem: "Endere&ccedil;o do arquivo XML ou programa PHP que gera o xml com a lista de programas especiais executados na ferramenta de identifica&ccedil;&atilde;o. Se voc&ecirc; deixar em branco, ser&aacute; utilizado o banco de dados administrativo ao inv&eacute;s do arquivo XML em disco.",cabeca: "XML identifica", variavel: "$locidentifica"},
	{ mensagem: "Endere&ccedil;o do arquivo XML ou programa PHP que gera o xml com a lista de mapas que s&atilde;o mostrados na vers&atilde;o mobile e na guia mapas. Se voc&ecirc; deixar em branco, ser&aacute; utilizado o banco de dados administrativo ao inv&eacute;s do arquivo XML em disco.",cabeca: "XML mapas", variavel: "$locmapas"},
	{ mensagem: "(opcional) Endere&ccedil;o do arquivo XML ou programa PHP que gera o xml com a lista de atlas e pranchas utilizadas na interface Atlas do i3geo. Se voc&ecirc; deixar em branco, ser&aacute; utilizado o banco de dados administrativo ao inv&eacute;s do arquivo XML em disco.",cabeca: "XML Atlas", variavel: "$atlasxml"},
	{ mensagem: "Caminho onde fica o arquivo execut&aacute;vel do software R. Se voc&ecirc; incluiu o caminho do R como uma vari&aacute;vel de ambiente, inclua a qui apenas o nome do execut&aacute;vel.",cabeca: "Caminho para o R", variavel: "$R_path"},
	{ mensagem: "(depreciado) string de conex&atilde;o com o banco de dados postgis para a realiza&ccedil;&atilde;o de c&aacute;lculos geom&eacute;tricos, como &aacute;rea. Na vers&atilde;o 5.x do mapserver n&atilde;o &eacute; mais necess&aacute;rio",cabeca: "Conex&atilde;o postgis para c&aacute;lculos", variavel: "$postgis_con"},
	{ mensagem: "(depreciado) c&oacute;digo da proje&ccedil;&atilde;o definida no banco de dados postgis para c&aacute;lculos de &aacute;rea",cabeca: "SRID postgis", variavel: "$srid_area"},
	{ mensagem: "(opcional) string de conex&atilde;o com o banco de dados para substituir o item CONECTION quando o mesmo estiver vazio",cabeca: "Substitui&ccedil;&atilde;o de conex&atilde;o", variavel: "$postgis_mapa"},
	{ mensagem: "sim|nao Define se o desenho da imagem do mapa ser&aacute; feito por meio do CGI ou n&atilde;o. A escolha do uso do CGI ou n&atilde;o deve ser testada para verificar qual a melhor performance em cada instala&ccedil;&atilde;o.",cabeca: "Utiliza CGI", variavel: "$utilizacgi"},
	{ mensagem: "sim|nao Exp&otilde;e ou n&atilde;o o endere&ccedil;o do arquivo mapfile utilizado no mapa que est&aacute; sendo usado. Quando essa vari&aacute;vel for definida como nao algumas das funcionalidades do i3geo poder&atilde;o ficar prejudicadas, mas sem comprometimento das fun&ccedil;&otilde;es principais",cabeca: "Exp&otilde;e o mapfile", variavel: "$expoeMapfile"},	
	{ mensagem: "Arquivo (PHP) que define a conex&atilde;o com o banco de dados administrativo. Mantendo esse valor como vazio, o i3geo ir&aacute; utilizar o banco de dados padr&atilde;o em SQLITE. Veja i3geo/ms_configura.php e i3geo/admin/conexao.php para maiores informa&ccedil;&otilde;es sobre como utilizar outros bancos de dados.",cabeca: "Conex&atilde;o com o banco de dados administrativo", variavel: "$conexaoadmin"},
	{ mensagem: "Interface padr&atilde;o utilizada para mostrar o mapa. essa &eacute; a interface utilizada quando o i3Geo &eacute; inicializado sem a passagem de par&acirc;metros para defini&ccedil;&atilde;o da interface a ser usada.",cabeca: "Interface padr&atilde;o", variavel: "$interfacePadrao"}	
	]};
	core_carregando("ativa");
	core_pegaDados("buscando par&acirc;metros...","../php/ms_configura.php?funcao=pegaParametrosConfigura","pegaParametros");
}
function pegaParametros(retorno)
{
	var ins = "";
	for (var i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>";
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>";
		ins += "<table><tr><td><img style=cursor:pointer src=../imagens/02.png title='aplicar' onclick='salva(\""+$parametros.simples[i].variavel+"\")' /></td>";
		ins += "<td><input onchange=\"this.style.color='blue'\" type=text size=70 id='"+$parametros.simples[i].variavel+"' /></td></tr></table>";
		ins += "</fieldset><br>";
	}
	$i("tabela").innerHTML += ins;
	retorno.$postgis_mapa = "Esta vari&aacute;vel s&oacute; pode ser definida editando-se diretamente o arquivo ms_configura.php";
	for (var i=0;i<$parametros.simples.length;i++)
	{
		if($i($parametros.simples[i].variavel))
		{$i($parametros.simples[i].variavel).value = eval("retorno."+$parametros.simples[i].variavel);}
	}
	core_carregando("desativa");
}
/*
Function: salva

Aplica as altera&ccedil;&otilde;es feitas em uma vari&aacute;vel

<SALVACONFIGURA>
*/
function salva(variavel)
{
	if(variavel == "$postgis_mapa")
	{alert("erro");}
	else
	{
		var original = $i(variavel).value;
		$i(variavel).value = "gravando...";
		core_pegaDados("gravando...","../php/ms_configura.php?funcao=salvaConfigura&variavel="+variavel+"&valor="+original,"");
		$i(variavel).style.color = "";
		$i(variavel).value = original;
	}
}
YAHOO.util.Event.addListener(window, "load", initMenu);