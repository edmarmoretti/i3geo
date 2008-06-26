/*
Title: core.js

Carrega os arquivos js e css básicos utilizados pela interface de administração e define algumas funções de uso geral

File: i3geo/admin/js/core.js

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
/*
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Parâmetros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
var $i = function(id)
{return document.getElementById(id);};
/*
Function: core_handleSuccess

Processa o retorno da chamada em ajax quando tiver sucesso. Esta é uma
função genérica, pouco usada.

Parameters:

o - string retornada pelo ajax
*/
function core_handleSuccess(o)
{
	//div onde será mostrado o log
	if(!$i('logajax'))
	{document.body.innerHTML += "<div id=logajax ></div>";}
	log = $i('logajax');
	YAHOO.log("The success handler was called.  tId: " + o.tId + ".", "info", "example");
	if(o.responseText !== undefined)
	{
		log.innerHTML = "<li>Transaction id: " + o.tId + "</li>";
		log.innerHTML += "<li>HTTP status: " + o.status + "</li>";
		log.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
		log.innerHTML += "<li>HTTP headers: <ul>" + o.getAllResponseHeaders + "</ul></li>";
		log.innerHTML += "<li>Server response: " + o.responseText + "</li>";
		log.innerHTML += "<li>Argument object: Object ( [foo] => " + o.argument.foo + " [bar] => " + o.argument.bar +" )</li>";
	}
}
/*
Function: core_handleFailure

Processa o retorno da chamada em ajax quando tiver falhado.

Parameters:

o - string retornada pelo ajax
*/
function core_handleFailure(o,texto)
{
	//div onde será mostrado o log
	if(!$i('logajax'))
	{document.body.innerHTML += "<div id=logajax ></div>";}
	log = $i('logajax');
	YAHOO.log("The failure handler was called.  tId: " + o.tId + ".", "info", "example");
	if(o.responseText !== undefined)
	{
		log.innerHTML = "<ul><li>Transaction id: " + o.tId + "</li>";
		log.innerHTML += "<li>HTTP status: " + o.status + "</li>";
		log.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
		log.innerHTML += "<li>PHP message: " + texto + "</li></ul>";
	}
	if (!YAHOO.example.container.wait)
	{
    	YAHOO.example.container.wait = new YAHOO.widget.Panel("wait",{width: "240px",fixedcenter: true,close: true,draggable: false,zindex:4,modal: true,visible: false});
		YAHOO.example.container.wait.setHeader("Aguarde...");
		YAHOO.example.container.wait.render(document.body);
	}
	else
	{YAHOO.example.container.wait.setBody(log.innerHTML);}	
}
/*
Function: core_makeRequest

Executa uma chamada em ajax.

Parameters:

sUrl - url que será executada

callback - função que processará o retorno
*/
function core_makeRequest(sUrl,callback)
{
	var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	YAHOO.log("Initiating request; tId: " + request.tId + ".", "info", "example");
}
/*
Function: core_carregando

Mostra uma janela de aguarde
*/
function core_carregando()
{
	if (!YAHOO.example.container.wait)
	{
    	YAHOO.example.container.wait = new YAHOO.widget.Panel("wait",{width: "240px",fixedcenter: true,close: true,draggable: false,zindex:4,modal: true,visible: false});
		YAHOO.example.container.wait.setHeader("Aguarde...");
		YAHOO.example.container.wait.setBody("<img src=\"../../imagens/aguarde.gif\"/>");		
		YAHOO.example.container.wait.render(document.body);
	}
	YAHOO.example.container.wait.show();
}
/*
Function: core_dialogoContinua

Mostra um diálogo do tipo sim não

Parameters:

handleYes - função para sim

handleNo - função para não

mensagem - mensagem do diálogo

largura - largura do diálogo em px
*/
function core_dialogoContinua(handleYes,handleNo,mensagem,largura)
{
	if(!$i("dialogoContinua"))
	{document.body.innerHTML += "<div id='dialogoContinua'></div>";}
	// Instantiate the Dialog
	YAHOO.namespace("continua.container");
	YAHOO.continua.container.simpledialog1 = 
		new YAHOO.widget.SimpleDialog("simpledialog1", 
			 { width: largura+"px",
			   fixedcenter: true,
			   visible: false,
			   draggable: false,
			   close: true,
			   text: mensagem,
			   icon: YAHOO.widget.SimpleDialog.ICON_HELP,
			   modal: true,
			   constraintoviewport: true,
			   buttons: [ { text:"Sim", handler:handleYes, isDefault:true },
						  { text:"N&atilde;o",  handler:handleNo } ]
	} );
	YAHOO.continua.container.simpledialog1.setHeader("Tem certeza?");
	YAHOO.continua.container.simpledialog1.render("dialogoContinua");
	YAHOO.continua.container.simpledialog1.show();
}
/*
Function: core_ativaPainelAjuda

Parameters:

id - id do elemento que receberá o painel

botao - id do elemento que deverá ser lcicado para abrir o painel
*/
function core_ativaPainelAjuda(id,botao)
{
	YAHOO.example.container.panelAjuda = new YAHOO.widget.Panel(id, { width:"350px", height:"200px",overflow:"auto", visible:false,constraintoviewport:true } );
	YAHOO.example.container.panelAjuda.render();
	YAHOO.util.Event.addListener(botao, "click", YAHOO.example.container.panelAjuda.show, YAHOO.example.container.panelAjuda, true);
}

//
//define o local correto dos programas
var scriptLocation = "";
var scripts = document.getElementsByTagName('script');
var i = 0;
for (i = 0; i < scripts.length; i++) {
	var src = scripts[i].getAttribute('src');
	if (src) {
		var index = src.lastIndexOf("core.js");
		// is it found, at the end of the URL?
		if ((index > -1) && (index + "core.js".length == src.length)) {
			scriptLocation = src.slice(0, -"core.js".length);
			break;
		}
	}
}
//
//arquivos javascript que serão carregados
//
var jsfiles = new Array(
"../../pacotes/yui252/build/utilities/utilities.js",
"../../pacotes/yui252/build/yahoo-dom-event/yahoo-dom-event.js",
"../../pacotes/yui252/build/element/element-beta-min.js",
"../../pacotes/yui252/build/datasource/datasource-beta-min.js",
"../../pacotes/yui252/build/datatable/datatable-beta-min.js",
"../../pacotes/yui252/build/button/button-min.js",
"../../pacotes/yui252/build/dragdrop/dragdrop-min.js",
"../../pacotes/yui252/build/container/container-min.js",
"../../pacotes/yui252/build/connection/connection-min.js",
"../../pacotes/yui252/build/json/json-min.js"
);
//
//arquivos css
//
var cssfiles =new Array(
"../html/admin.css",
"../../pacotes/yui252/build/fonts/fonts-min.css",
"../../pacotes/yui252/build/datatable/assets/skins/sam/datatable.css",
"../../pacotes/yui252/build/button/assets/skins/sam/button.css",
"../../pacotes/yui252/build/container/assets/skins/sam/container.css"
);
//
//carrega os arquivos js
//
var allScriptTags = "";
for (i = 0; i < jsfiles.length; i++)
{
	var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
	allScriptTags += currentScriptTag;
}
document.write(allScriptTags);
//
//carrega os arquivos css
//
var allCssTags = "";
for (i = 0; i < cssfiles.length; i++)
{
	var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
	allCssTags += currentCssTag;
}
document.write(allCssTags);




