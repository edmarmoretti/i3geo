/*
Title: Data download

Sistema de download de dados geográficos.

Lista os temas configurados no menu de temas e que permitem download.

Para utilizar esse sistema acesse http://localhost/i3geo/datadownload.htm

Pode-se usar um parâmetro para abrir o aplicativo e imediatamente mostrar os arquivos para download, por exemplo

datadownload.htm?bioma

Arquivo:

i3geo/classesjs/datadownload.js

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

Veja:

<datadownload.htm>
*/
/*
Propriedade: g_locaplic

Indica a localização do i3geo. Por default, procura no diretório onde foi executada a plicação datadownload.
No caso do datadownload.htm ser disparado de outro local, é necessário definir essa variável antes de chamar a função DDinicia
*/
var loc = window.location.href;
g_locaplic = loc.split("/datadownload.htm");
g_locaplic = g_locaplic[0]

var temp = loc.split("?");
if(temp[1])
{temaDownload = temp[1]}
else
{temaDownload = ""}

//
//para efeitos de compatibilidade
//
try{i3GEO.configura.locaplic = g_locaplic}
catch(e){}
//
//diretorio onde esta o i3geo
//
g_i3geo = ""
//
//função que será utilizada quando o usuário clicar na árvore
//
g_arvoreClicks = ""
/*
Propriedade: g_tipo

Tipo de acesso aos dados.

g_tipo é uma variável que pode ser definida antes de iniciar a funcao DDinicia
g_tipo = "menutemas", indica que a lista de temas para download será buscada no xml com a lista de temas do I3Geo
se g_tipo for "dir", a aplicação entenderá que se trata de uma busca em diretórios
nesse caso, g_dirbase deve conter a raiz da busca no servidor, por exemplo:
g_dirbase = "/opt/www/html/geodados"
g_dirarquivos indica o diretório inicial para listagem dos arquivos
por default, g_tipo = "menutemas"

Exemplo que pode ser utilizado em um HTML armazenado no diretório vegetacao2002:

g_tipo = "dir"
g_dirbase = "/opt/www/html/geodados/brasil/vegetacao/vegetacao2002"
g_dirbaseDown = "http://"+window.location.host+"/geodados/brasil/vegetacao/vegetacao2002"
g_dirarquivos = "/opt/www/html/geodados/brasil/vegetacao/vegetacao2002"
g_i3geo = "/i3geo"
g_locaplic = "http://"+window.location.host+g_i3geo

Tipo:
{string}

Valores:

dir - indica que os dados serão buscados em diretórios no servidor.

menutemas - indica que os dados serão buscados no arquivo menutemas/menutemas.xml ou 
no sistema de administração do i3geo
*/
g_tipo = "menutemas"
/*
Propriedade: g_dirbaseDown

Url para o endereço definido em g_dirbase.
É utilizada para montar o link de acesso aos arquivos quando g_tipo = 'dir'

Tipo:
{string}

*/
g_dirbaseDown = ""

/*
Propriedade: g_dirbase

Endereço no servidor onde estão os arquivos ou diretórios que poderão ser acessados

Tipo:
{string}

*/
g_dirbase = ""
/*
Propriedade: g_dirarquivos

Endereço do diretório que será acessado na inicialização da aplicação

Tipo:
{string}

*/
g_dirarquivos = ""
/*
Function: DDinicia

Inicia o aplicativo montando a árvore de opções e preenchendo a DIV arvore.

Deve existir no HTML um DIV com id='arvore'.
*/
function DDinicia()
{
	if(!document.getElementById("arvoreTemas"))
	{
		alert("Nao foi encontrado o DIV arvoreTemas");
		return;
	}
	if (g_tipo == "menutemas")
	{
		i3GEO.arvoreDeTemas.INCLUISISTEMAS = false
		i3GEO.arvoreDeTemas.FILTRADOWNLOAD = true
		i3GEO.arvoreDeTemas.INCLUIWMS = false
		i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore = false
		i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluibusca = false
		i3GEO.arvoreDeTemas.TIPOBOTAO = "radio";
		i3GEO.arvoreDeTemas.cria("",g_locaplic,"arvoreTemas","datadownload_download\(this.value\)");
	}
	if (g_tipo == "dir")
	{
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaDiretorios&map_file=&diretorio="+g_dirbase;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"listaDiretorios",processaDiretorios);
	}
	dataDownloadLinks(g_RSSl)
	if(temaDownload != ""){
		datadownload_download(temaDownload);
	}
}
/*
Function: processaDiretorios

Cahamado pela função DDinicia. Recebe os dados da função Ajax com a lista de diretorios.

Monta a árvore para navegação pelos diretórios.

Parametros:

retorno - string formatada com os dados para montagem da árvore.
*/
function processaDiretorios(retorno)
{
	if(!document.getElementById("arvoreTemas"))
	{
		alert("Nao foi encontrado o DIV arvoreTemas");
		return;
	}
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		treeDir = new Object();
		treeDir = treeviewNew("treeDir", "default", "arvoreTemas", null);
		treeDir.createItem("raiz", "<b>Diretórios</b>", g_locaplic+"/imagens/temas.png", true, true, true, null);
		treeDir.itemExpand = expandeDiretorio;
		for (var ig=0;ig<retorno.data.length; ig++)
		{
			var nomeDir = retorno.data[ig];
			treeDir.createItem(g_dirbase+"/"+nomeDir, nomeDir, g_locaplic+"/imagens/folder-s.gif", true, true, true, "raiz");
		}
	}
}
/*
Function: expandeDiretorio

Expande um diretório quando o usuário clica no nó da árvore de diretórios.

Definido na função processaDiretorios. Após serem mostrados os sub-diretórios é disparada a função listaArquivos para mostrar a lista de arquivos existentes no diretório selecionado.

Parametros:

id - id do nó clicado na árvore treeview
*/
function expandeDiretorio(id)
{
	var volta = function (retorno)
	{
		if ((retorno.data != "erro") && (retorno.data != undefined))
		{
			for (var ig=0;ig<retorno.data.length; ig++)
			{
				var nomeDir = retorno.data[ig];
				if (!document.getElementById(id+"/"+nomeDir))
				treeDir.createItem(id+"/"+nomeDir, nomeDir, g_locaplic+"/imagens/folder-s.gif", true, true, true, id);
			}
			listaArquivos(id)
		}
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaDiretorios&map_file=&diretorio="+id;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDiretorios",volta);	
}
/*
Function: listaArquivos

Lista os arquivos de um diretório.

No HTML deve existir um DIV com id='corpo'. Nesse div será incluída a lista.

Parametros:

dir - diretório no servidor 
*/
function listaArquivos(dir)
{
	if(!document.getElementById("corpo"))
	{
		alert("Nao foi encontrado o DIV corpo");
		return;
	}
	document.getElementById("corpo").innerHTML = ""
	var re = new RegExp(g_dirbase, "g");
	var d = dir.replace(re,'')
	var ins = "<div style=text-align:left; >Diretório: "+d+"<br><br>"
	var volta = function (retorno)
	{
		if ((retorno.data != "erro") && (retorno.data != undefined))
		{
			ins += "<b>Diretórios:</b><br><br>"
			for (var ig=0;ig<retorno.data.diretorios.length; ig++)
			{
				ins += "<span style=cursor:pointer onclick=listaArquivos('"+g_dirbase+d+"/"+retorno.data.diretorios[ig]+"') ><img src="+g_locaplic+"/imagens/folder-s.gif />"+retorno.data.diretorios[ig]+"</span><br><br>" 
			}
			ins += "<b>Arquivos:</b><br><br>"
			for (var ig=0;ig<retorno.data.arquivos.length; ig++)
			{
				ins += "<a href='"+g_dirbaseDown+d+"/"+retorno.data.arquivos[ig]+"' target=new >"+retorno.data.arquivos[ig]+"</a><br><br>" 
			}
			document.getElementById("corpo").innerHTML = ins
		}
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaArquivos&map_file=&diretorio="+dir;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDiretorios",volta);
}
/*
Function: download

Gera os arquivos para download do shape file de um tema.

Parametros:

tema - código do tema para download
*/
function datadownload_download(tema)
{
	if(!$i("panellistaarquivos")){
		YAHOO.namespace("datadownloadLista");
		YAHOO.datadownloadLista.panel = new YAHOO.widget.Panel("panellistaarquivos", {zIndex:2000, iframe:false, width:"450px", visible:false, draggable:true, close:true, modal:true } );
		YAHOO.datadownloadLista.panel.setHeader("Arquivos");
		YAHOO.datadownloadLista.panel.setBody("");
		YAHOO.datadownloadLista.panel.setFooter("");
		YAHOO.datadownloadLista.panel.render(document.body);
		YAHOO.datadownloadLista.panel.center();
	};
	YAHOO.datadownloadLista.panel.setBody($trad("d28"));
	YAHOO.datadownloadLista.panel.show();
	//document.getElementById("corpo").innerHTML = "Aguarde. Gerando arquivos..."
	var p = g_locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=download&tema="+tema;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"downloadTema",mostraDownload);
}
/*
Function: mostraDownload

Mostra na tela os arquivos convertidos para shape file com link para download.
*/
function mostraDownload(retorno)
{
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		var arqs = retorno.split(",")
		var n = arqs.length;
		if(retorno == "erro")
		{var ins = "<p style=color:red >Ocorreu um erro. O tema não foi encontrado. Pode ser que o código do tema não existe na definição do mapfile. Informe o administrador do sistema.<br>";}
		else
		{
			var ins = "<b>Clique nos links para pegar os arquivos. Para obter os metadados, veja o link na árvore ao lado (o link é mostrado ao expandir o nó correspondente ao tema).</b><br><br>"
			for (var arq=0;arq<n;arq++)
			{
				ins += "<a href='"+window.location.protocol+"//"+window.location.host+"/"+arqs[arq]+"'>"+arqs[arq]+"<br>"
			}
		}
	}
	else
	{
		var ins = "<p style=color:red >Ocorreu um erro<br>"
	}
	YAHOO.datadownloadLista.panel.setBody(ins);
	YAHOO.datadownloadLista.panel.show();
}
/*
Function: dataDownloadLinks

Mostra uma lista de links baseado em um arquivo rss.

Utilizado para acrescentar outros links no sistema de download

Por default, o rss é menutemas/linksdownload.xml

Parametros:

rss - endereço do arquivo rss.
*/
function dataDownloadLinks(rss)
{
	var monta = function(retorno)
	{
		var reg = /Erro/gi;
		if (retorno.data.search(reg) != -1)
		{
			alert("OOps! Ocorreu um erro\n"+retorno.data);
			return;
		}
		var linhas = retorno.data.split("|")
		var ins = ""
		var n = linhas.length;
		if(n == 1){return;}
		for (var i=0;i<n; i++)
		{
			var caso = linhas[i].split("#")
			if (i > 0)
			{
				ins += "<a style=text-align:left href='"+caso[2]+"' target=blank >"+caso[0]+"&nbsp;("+caso[1]+")</a>"
				ins += "<br>"
			}
			else
			{ins += "<p class=clique ><b>"+caso[0]+"</b>&nbsp;"+caso[1]+"&nbsp;</p>"}
		}
		document.getElementById("RSSl").innerHTML = ins
	}
	if (document.getElementById("RSSl"))
	{
		if (rss.length > 0)
		{
			var p = g_locaplic+"/classesphp/wscliente.php?funcao=listaRSSws2&rss="+rss.join("|")+"&tipo=DOWNLOAD";
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"listaRSSws2",monta);
		}
	}
}