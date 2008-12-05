/*
Title: Admin

Funções javascript utilizadas no sistema de administração

File: i3geo/admin/admin.js

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
YAHOO.namespace("example.container");
/*
Function: iniciaAdmin

Inicializa as variáveis globais e checa o cadastro do editor do sistema de administração
*/
function initMenu()
{
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	new YAHOO.widget.Button("botao2",{ onclick: { fn: function(){window.open('../../testainstal.php') }} });
	$parametros = {
	"simples": [
	{ mensagem: "Mensagem mostrada sempre que o i3geo é inicializado.",cabeca: "Mensagem de inicialização", variavel: "$mensagemInicia"},
	{ mensagem: "Texto mostrado na barra superior do navegador e em alguns aplicativos do i3geo, como a versão mobile.",cabeca: "Título", variavel: "$tituloInstituicao"},
	{ mensagem: "Diretório (caminho absoluto) utilizado para armazenar os mapfiles temporários e outros arquivos utilizados durante a operação do i3geo. Em sistemas Linux, você pode criar um link simbólico para esse diretório.",cabeca: "Diretório temporário", variavel: "$dir_tmp"},
	{ mensagem: "Chave utilizada pelo Google Maps",cabeca: "Google maps", variavel: "$googleApiKey"},
	{ mensagem: "Local no servidor (caminho absoluto) onde o i3geo está armazenado.",cabeca: "Localização do i3geo", variavel: "$locaplic"},
	{ mensagem: "Diretório onde ficam os arquivos mapfiles dos temas disponíveis para uso na guia de adição de temas.",cabeca: "Diretório com os temas", variavel: "$temasdir"},
	{ mensagem: "Diretório onde ficam armazenados os arquivos de template HTML e mapfiles iniciais",cabeca: "Diretório aplicmap", variavel: "$temasaplic"},
	{ mensagem: "Onde está armazenado o mapserv CGI no servidor",cabeca: "Mapserv CGI", variavel: "$locmapserv"},
	{ mensagem: "Endereço do arquivo XML ou programa PHP que gera o xml com a lista de sistemas que são incluídos na guia de adição de temas. Se você deixar em branco, será utilizado o banco de dados administrativo ao invés do arquivo XML em disco.",cabeca: "XML sistemas", variavel: "$locsistemas"},
	{ mensagem: "Endereço do arquivo XML ou programa PHP que gera o xml com a lista de programas especiais executados na ferramenta de identificação. Se você deixar em branco, será utilizado o banco de dados administrativo ao invés do arquivo XML em disco.",cabeca: "XML identifica", variavel: "$locidentifica"},
	{ mensagem: "Endereço do arquivo XML ou programa PHP que gera o xml com a lista de mapas que são mostrados na versão mobile e na guia mapas. Se você deixar em branco, será utilizado o banco de dados administrativo ao invés do arquivo XML em disco.",cabeca: "XML mapas", variavel: "$locmapas"},
	{ mensagem: "(opcional) Endereço do arquivo XML ou programa PHP que gera o xml com a lista de atlas e pranchas utilizadas na interface Atlas do i3geo. Se você deixar em branco, será utilizado o banco de dados administrativo ao invés do arquivo XML em disco.",cabeca: "XML Atlas", variavel: "$atlasxml"},
	{ mensagem: "Caminho onde fica o arquivo executável do software R. Se você incluiu o caminho do R como uma variável de ambiente, inclua a qui apenas o nome do executável.",cabeca: "Caminho para o R", variavel: "$R_path"},
	{ mensagem: "(depreciado) string de conexão com o banco de dados postgis para a realização de cálculos geométricos, como área. Na versão 5.x do mapserver não é mais necessário",cabeca: "Conexão postgis para cálculos", variavel: "$postgis_con"},
	{ mensagem: "(depreciado) código da projeção definida no banco de dados postgis para cálculos de área",cabeca: "SRID postgis", variavel: "$srid_area"},
	{ mensagem: "(opcional) string de conexão com o banco de dados para substituir o item CONECTION quando o mesmo estiver vazio",cabeca: "Substituição de conexão", variavel: "$postgis_mapa"},
	{ mensagem: "sim|nao Define se o desenho da imagem do mapa será feito por meio do CGI ou não. A escolha do uso do CGI ou não deve ser testada para verificar qual a melhor performance em cada instalação.",cabeca: "Utiliza CGI", variavel: "$utilizacgi"},
	{ mensagem: "sim|nao Expõe ou não o endereço do arquivo mapfile utilizado no mapa que está sendo usado. Quando essa variável for definida como nao algumas das funcionalidades do i3geo poderão ficar prejudicadas, mas sem comprometimento das funções principais",cabeca: "Expõe o mapfile", variavel: "$expoeMapfile"},	
	{ mensagem: "Arquivo (PHP) que define a conexão com o banco de dados administrativo. Mantendo esse valor como vazio, o i3geo irá utilizar o banco de dados padrão em SQLITE. Veja i3geo/ms_configura.php e i3geo/admin/conexao.php para maiores informações sobre como utilizar outros bancos de dados.",cabeca: "Conexão com o banco de dados administrativo", variavel: "$conexaoadmin"}	
	]};
	core_carregando("ativa");
	core_pegaDados("buscando parâmetros...","../php/ms_configura.php?funcao=pegaParametrosConfigura","pegaParametros")
}
/*
Function: pegaParametros

Pega os parâmetros do ms_configura.php

*/
function pegaParametros(retorno)
{
	var ins = ""
	for (i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>"
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>"
		ins += "<table><tr><td><img style=cursor:pointer src=../imagens/02.png title='aplicar' onclick='salva(\""+$parametros.simples[i].variavel+"\")' /></td>"
		ins += "<td><input onchange=\"this.style.color='blue'\" type=text size=70 id='"+$parametros.simples[i].variavel+"' /></td></tr></table>"
		ins += "</fieldset><br>"	
	}
	$i("tabela").innerHTML += ins
	retorno.$postgis_mapa = "Esta variável só pode ser definida editando-se diretamente o arquivo ms_configura.php"
	for (i=0;i<$parametros.simples.length;i++)
	{
		if($i($parametros.simples[i].variavel))
		{$i($parametros.simples[i].variavel).value = eval("retorno."+$parametros.simples[i].variavel);}
	}
	core_carregando("desativa");
}
/*
Function - salva

Salva o novo valor de uma variável
*/
function salva(variavel)
{
	if(variavel == "$postgis_mapa")
	{alert("erro")}
	else
	{
		var original = $i(variavel).value;
		$i(variavel).value = "gravando...";
		core_pegaDados("gravando...","../php/ms_configura.php?funcao=salvaConfigura&variavel="+variavel+"&valor="+original,"")
		$i(variavel).style.color = ""
		$i(variavel).value = original;
	}
}
YAHOO.util.Event.addListener(window, "load", initMenu);