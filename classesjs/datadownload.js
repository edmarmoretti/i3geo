/*
Sistema de download de dados geogr&aacute;ficos.

Lista os temas configurados no menu de temas e que permitem download.

Para utilizar esse sistema acesse http://localhost/i3geo/datadownload.htm

Pode-se usar um parametro para abrir o aplicativo e imediatamente mostrar os arquivos para download, por exemplo

datadownload.htm?bioma

Arquivo:

i3geo/classesjs/datadownload.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Veja:

<datadownload.htm>
*/
/*
Indica a localiza&ccedil;&atilde;o do i3geo. Por default, procura no diret&oacute;rio onde foi executada a plica&ccedil;&atilde;o datadownload.
No caso do datadownload.htm ser disparado de outro local, &eacute; necess&aacute;rio definir essa vari&aacute;vel antes de chamar a fun&ccedil;&atilde;o DDinicia
*/
loc = window.location.href;
g_locaplic = loc.split("/datadownload.htm");
g_locaplic = g_locaplic[0];

temp = loc.split("?");
if(temp[1])
{temaDownload = temp[1];}
else
{temaDownload = "";}

//
//para efeitos de compatibilidade
//
try{i3GEO.configura.locaplic = g_locaplic;}
catch(e){}
//
//diretorio onde esta o i3geo
//
g_i3geo = "";
//
//fun&ccedil;&atilde;o que ser&aacute; utilizada quando o usu&aacute;rio clicar na &aacute;rvore
//
g_arvoreClicks = "";
/*
Tipo de acesso aos dados.

g_tipo &eacute; uma vari&aacute;vel que pode ser definida antes de iniciar a funcao DDinicia
g_tipo = "menutemas", indica que a lista de temas para download ser&aacute; buscada no xml com a lista de temas do I3Geo
se g_tipo for "dir", a aplica&ccedil;&atilde;o entender&aacute; que se trata de uma busca em diret&oacute;rios
nesse caso, g_dirbase deve conter a raiz da busca no servidor, por exemplo:
g_dirbase = "/opt/www/html/geodados"
g_dirarquivos indica o diret&oacute;rio inicial para listagem dos arquivos
por default, g_tipo = "menutemas"

Exemplo que pode ser utilizado em um HTML armazenado no diret&oacute;rio vegetacao2002:

g_tipo = "dir"
g_dirbase = "/opt/www/html/geodados/brasil/vegetacao/vegetacao2002"
g_dirbaseDown = "http://"+window.location.host+"/geodados/brasil/vegetacao/vegetacao2002"
g_dirarquivos = "/opt/www/html/geodados/brasil/vegetacao/vegetacao2002"
g_i3geo = "/i3geo"
g_locaplic = "http://"+window.location.host+g_i3geo

Tipo:
{string}

Valores:

dir - indica que os dados ser&atilde;o buscados em diret&oacute;rios no servidor.

menutemas - indica que os dados ser&atilde;o buscados no arquivo menutemas/menutemas.xml ou
no sistema de administra&ccedil;&atilde;o do i3geo
*/
g_tipo = "menutemas";
/*
Url para o endere&ccedil;o definido em g_dirbase.
&Eacute; utilizada para montar o link de acesso aos arquivos quando g_tipo = 'dir'

Tipo:
{string}

*/
g_dirbaseDown = "";

/*
Endere&ccedil;o no servidor onde est&atilde;o os arquivos ou diret&oacute;rios que poder&atilde;o ser acessados

Tipo:
{string}

*/
g_dirbase = "";
/*
Endere&ccedil;o do diret&oacute;rio que ser&aacute; acessado na inicializa&ccedil;&atilde;o da aplica&ccedil;&atilde;o

Tipo:
{string}

*/
g_dirarquivos = "";
/*
Inicia o aplicativo montando a &aacute;rvore de op&ccedil;&otilde;es e preenchendo a DIV arvore.

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
		i3GEO.arvoreDeTemas.INCLUISISTEMAS = false;
		i3GEO.arvoreDeTemas.FILTRADOWNLOAD = true;
		i3GEO.arvoreDeTemas.INCLUIWMS = false;
		i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore = false;
		i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluibusca = false;
		//i3GEO.arvoreDeTemas.TIPOBOTAO = "radio";
		i3GEO.arvoreDeTemas.cria("",g_locaplic,"arvoreTemas","datadownload_download\(this\)");
	}
	if (g_tipo == "dir")
	{
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaDiretorios&map_file=&diretorio="+g_dirbase;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"listaDiretorios",processaDiretorios);
	}
	dataDownloadLinks(g_RSSl);
	if(temaDownload != ""){
		datadownload_download({"title":temaDownload});
	}
}
/*
Cahamado pela fun&ccedil;&atilde;o DDinicia. Recebe os dados da fun&ccedil;&atilde;o Ajax com a lista de diretorios.

Monta a &aacute;rvore para navega&ccedil;&atilde;o pelos diret&oacute;rios.

Parametros:

retorno - string formatada com os dados para montagem da &aacute;rvore.
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
		treeDir.createItem("raiz", "<b>Diret&oacute;rios</b>", g_locaplic+"/imagens/temas.png", true, true, true, null);
		treeDir.itemExpand = expandeDiretorio;
		for (var ig=0;ig<retorno.data.length; ig++)
		{
			var nomeDir = retorno.data[ig];
			treeDir.createItem(g_dirbase+"/"+nomeDir, nomeDir, g_locaplic+"/imagens/folder-s.gif", true, true, true, "raiz");
		}
	}
}
/*
Expande um diret&oacute;rio quando o usu&aacute;rio clica no n&oacute; da &aacute;rvore de diret&oacute;rios.

Definido na fun&ccedil;&atilde;o processaDiretorios. Ap&oacute;s serem mostrados os sub-diret&oacute;rios &eacute; disparada a fun&ccedil;&atilde;o listaArquivos para mostrar a lista de arquivos existentes no diret&oacute;rio selecionado.

Parametros:

id - id do n&oacute; clicado na &aacute;rvore treeview
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
			listaArquivos(id);
		}
	};
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaDiretorios&map_file=&diretorio="+id;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDiretorios",volta);
}
/*
Lista os arquivos de um diret&oacute;rio.

No HTML deve existir um DIV com id='corpo'. Nesse div ser&aacute; inclu&iacute;da a lista.

Parametros:

dir - diret&oacute;rio no servidor
*/
function listaArquivos(dir)
{
	if(!document.getElementById("corpo"))
	{
		alert("Nao foi encontrado o DIV corpo");
		return;
	}
	document.getElementById("corpo").innerHTML = "";
	var re = new RegExp(g_dirbase, "g");
	var d = dir.replace(re,'');
	var ins = "<div style=text-align:left; >Diret&oacute;rio: "+d+"<br><br>";
	var volta = function (retorno)
	{
		if ((retorno.data != "erro") && (retorno.data != undefined))
		{
			ins += "<b>Diret&oacute;rios:</b><br><br>";
			for (var ig=0;ig<retorno.data.diretorios.length; ig++){
				ins += "<span style=cursor:pointer onclick=listaArquivos('"+g_dirbase+d+"/"+retorno.data.diretorios[ig]+"') ><img src="+g_locaplic+"/imagens/folder-s.gif />"+retorno.data.diretorios[ig]+"</span><br><br>";
			}
			ins += "<b>Arquivos:</b><br><br>";
			for (var ig=0;ig<retorno.data.arquivos.length; ig++){
				ins += "<a href='"+g_dirbaseDown+d+"/"+retorno.data.arquivos[ig]+"' target=new >"+retorno.data.arquivos[ig]+"</a><br><br>";
			}
			document.getElementById("corpo").innerHTML = ins;
		}
	};
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaArquivos&map_file=&diretorio="+dir;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listaDiretorios",volta);
}
/*
Gera os arquivos para download do shape file de um tema.

*/
function datadownload_download(obj)
{
	if(!$i("panellistaarquivos")){
		YAHOO.namespace("datadownloadLista");
		YAHOO.datadownloadLista.panel = new YAHOO.widget.Panel("panellistaarquivos", {fixedcenter:true,zIndex:2000, iframe:true, width:"450px",align:"left", visible:false, draggable:true, close:true, modal:true } );
		YAHOO.datadownloadLista.panel.setHeader("Arquivos");
		YAHOO.datadownloadLista.panel.setBody("");
		YAHOO.datadownloadLista.panel.setFooter("");
		YAHOO.datadownloadLista.panel.render(document.body);
	};
	YAHOO.datadownloadLista.panel.setBody($trad("d28"));
	YAHOO.datadownloadLista.panel.show();
	YAHOO.datadownloadLista.panel.cfg.setProperty("y", 100); 
	//document.getElementById("corpo").innerHTML = "Aguarde. Gerando arquivos..."
	var p = g_locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=download3&tema="+obj.title;
	//caso a camada venha do sistema de metadados estatisticos e seja uma variavel
	if(obj.name && obj.name === "metaestat"){
		p = g_locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=download3&id_medida_variavel="+obj.title;
	}
	if(obj.name && obj.name === "regioesmetaestat"){
		p = g_locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=download3&codigo_tipo_regiao="+obj.title.replace("metaregiao_","");
	}

	temaEscolhidoDownload = obj.title;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"downloadTema2",mostraDownload);
}
/*
Mostra na tela os arquivos convertidos para shape file com link para download.
*/
function mostraDownload(retorno)
{
	var ins = "";
	if (retorno.data != undefined)
	{
		retorno = retorno.data;
		var arqs = retorno.arquivos.split(",");
		var n = arqs.length;
		if(retorno == "erro")
		{ins = "<p style=color:red >Ocorreu um erro. O tema n&atilde;o foi encontrado. Pode ser que o c&oacute;digo do tema n&atilde;o existe na defini&ccedil;&atilde;o do mapfile. Informe o administrador do sistema.<br>";}
		else
		{
			ins = "<b>Links de acesso:</b><br><br>";
			ins += "<a href='"+window.location.href.split("?")[0]+"?tema="+retorno.tema+"&temaDownload="+retorno.tema+"'>Link permanente de acesso<br><br>";
			ins += "<a href='"+window.location.protocol+"//"+window.location.host+"/"+retorno.mapfileurl+"' target=blank >Arquivo de configura&ccedil;&atilde;o Mapfile</a><br>";
			ins += "<a href='"+g_locaplic+"/classesphp/mapa_controle.php?funcao=TEMA2SLD&tema="+retorno.tema+"&map_file="+retorno.mapfile+"' target=blank >Arquivo de legenda SLD</a><br><br>";
			ins += "Servi&ccedil;o OGC: "+g_locaplic+"/ogc.php?tema="+retorno.tema+"<br><br>";
			ins += "<a href='"+g_locaplic+"/ogc.php?tema="+retorno.tema+"&SERVICE=WMS&VERSION=1.1.0&REQUEST=GetCapabilities' target=blank >OGC GetCapabilities</a><br><br>";
			ins += "<a href='"+g_locaplic+"/ogc.php?tema="+retorno.tema+"&SERVICE=WMS&VERSION=1.1.0&format=application/openlayers&bbox=-76.5125927,-39.3925675209,-29.5851853,9.49014852081' target=blank >Ver com OpenLayers</a><br><br>";
			ins += "<a href='"+g_locaplic+"/ogc.php?tema="+retorno.tema+"&SERVICE=WFS&VERSION=1.1.0&request=getfeature&OUTPUTFORMAT=shape-zip' target=blank >Download shapefile com WFS (arquivo compactado incluindo .prj)</a><br><br>";
			ins += "<a href='"+g_locaplic+"/ogc.php?tema="+retorno.tema+"&SERVICE=WFS&VERSION=1.1.0&request=getfeature&OUTPUTFORMAT=csv' target=blank >Download CSV com WFS (arquivo compactado)</a><br><br>";
			
			for (var arq=0;arq<n;arq++)
			{
				ins += "<a href='"+window.location.protocol+"//"+window.location.host+"/"+arqs[arq]+"'>"+arqs[arq]+"</a><br>";
			}
			ins += "<br><a href='"+g_locaplic+"/fontetema.php?tema="+temaEscolhidoDownload+"' target=blank >Fonte</a>";
			if(retorno.nreg)
			{ins += "<br><br>N&uacute;mero de registros ="+retorno.nreg;}
		}
	}
	else
	{
		ins = "<p style=color:red >Ocorreu um erro<br>";
	}
	YAHOO.datadownloadLista.panel.setBody(ins);
	YAHOO.datadownloadLista.panel.show();
}
/*
Mostra uma lista de links baseado em um arquivo rss.

Utilizado para acrescentar outros links no sistema de download

Por default, o rss &eacute; menutemas/linksdownload.xml

Parametros:

rss - endere&ccedil;o do arquivo rss.
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
		var linhas = retorno.data.split("|");
		var ins = "";
		var n = linhas.length;
		if(n == 1){return;}
		for (var i=0;i<n; i++)
		{
			var caso = linhas[i].split("#");
			if (i > 0)
			{
				ins += "<a style=text-align:left href='"+caso[2]+"' target=blank >"+caso[0]+"&nbsp;("+caso[1]+")</a>";
				ins += "<br>";
			}
			else
			{ins += "<p class=clique ><b>"+caso[0]+"</b>&nbsp;"+caso[1]+"&nbsp;</p>";}
		}
		document.getElementById("RSSl").innerHTML = ins;
	};
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
