/*
Title: core.js

Fun&ccedil;&otilde;es de uso comum das interfaces dos editores

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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/core.js
*/

/*
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Par&acirc;metros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
$i = function(id)
{return document.getElementById(id);};
/*
Variable: $mapfiles

Armazena o objeto com a lista de mapfiles
*/
$mapfiles = "";
/*
Variable: $tags

Armazena o objeto com a lista de tags
*/
$tags = "";
/*
Variable: $perfis

Armazena o objeto com a lista de perfis
*/
$perfis = "";
function cabecalhoMetaestat(id,excluir){
	var i,n,temp,
		ins = "<fieldset><legend>Op&ccedil;&otilde;es principais</legend>",
		u = i3GEO.util.pegaCookie("i3geousuarionome"),
		botoes = [
			{id:"principal",titulo:"In&iacute;cio",link:"../index.html"},
			{id:"arvore",titulo:"&Aacute;rvore completa",link:"estat_variavel.html"},
			{id:"unidade_medida",titulo:"Unidades",link:"estat_unidade_medida.html"},
			{id:"periodo_tempo",titulo:"Per&iacute;odos",link:"estat_tipo_periodo.html"},
			{id:"conexao",titulo:"Conex&otilde;es",link:"estat_conexao.html"},
			{id:"tipo_regiao",titulo:"Regi&otilde;es",link:"estat_tipo_regiao.html"},
			{id:"fonteinfo",titulo:"Fonte",link:"estat_fonteinfo.html"},
			{id:"editor",titulo:"Gerenciador BD/Upload",link:"estat_editor.html"},
			//{id:"uploaddados",titulo:"Upload",link:"estat_uploaddados.html"},
			{id:"mapa",titulo:"Publicador",link:"estat_mapa.html"},
			{id:"login",titulo:"Login",js:"i3GEO.login.dialogo.abreLogin()"}
		];
	n = botoes.length;
	for(i=0;i<n;i++){
		if(botoes[i].id !== excluir){
			ins += '<input type=button id="'+botoes[i].id+'" value="'+botoes[i].titulo+'" />';
		}
	}
	if(!u){
		u = "-";
	}
	ins += "<div id='i3GEONomeLogin' style=width:100%; > Login: "+u+"</div>";
	ins += "</fieldset>";
	temp = $i(id);
	temp.innerHTML = ins;
	for(i=0;i<n;i++){
		if(excluir === "principal" && botoes[i].link)
		{botoes[i].link = "html/"+botoes[i].link;}
		if(botoes[i].id !== excluir){
			new YAHOO.widget.Button(botoes[i].id);
			if(botoes[i].link){
				eval('$i("'+botoes[i].id+'-button'+'").onclick = function(){window.location = \''+botoes[i].link+'\';}');
			}
			else{
				eval('$i("'+botoes[i].id+'-button'+'").onclick = function(){'+botoes[i].js+';}');
			}

		}
	}
	try{
		i3GEO.login.recarrega = true;
	}
	catch(e){ }
	//temp.style.border = "solid 1px gray";
	//temp.style.padding = "10px";
}

function cabecalhoUsuarios(id,excluir){
	var i,n,temp,
		ins = "<fieldset ><legend>Op&ccedil;&otilde;es principais</legend>",
		u = i3GEO.util.pegaCookie("i3geousuarionome"),
		botoes = [
			{id:"principal",titulo:"In&iacute;cio",link:"../index.html"},
			{id:"operacoes",titulo:"Opera&ccedil;&otilde;es",link:"operacoes.html"},
			{id:"usuarios",titulo:"Usu&aacute;rios",link:"usuarios.html"},
			{id:"gruposusuarios",titulo:"Grupos e Usu&aacute;rios",link:"gruposusuarios.html"},
			{id:"login",titulo:"Login",js:"i3GEO.login.dialogo.abreLogin()"}
		];
	n = botoes.length;
	for(i=0;i<n;i++){
		if(botoes[i].id !== excluir){
			ins += '<input type=button id="'+botoes[i].id+'" value="'+botoes[i].titulo+'" />';
		}
	}
	if(!u){
		u = "-";
	}
	ins += "<div id='i3GEONomeLogin' style=width:100%; > Login: "+u+"</div>";
	ins += "</fieldset>";
	temp = $i(id);
	temp.innerHTML = ins;
	for(i=0;i<n;i++){
		if(excluir === "principal" && botoes[i].link)
		{botoes[i].link = "html/"+botoes[i].link;}
		if(botoes[i].id !== excluir){
			new YAHOO.widget.Button(botoes[i].id);
			if(botoes[i].link){
				eval('$i("'+botoes[i].id+'-button'+'").onclick = function(){window.location = \''+botoes[i].link+'\';}');
			}
			else{
				eval('$i("'+botoes[i].id+'-button'+'").onclick = function(){'+botoes[i].js+';}');
			}

		}
	}
	try{
		i3GEO.login.recarrega = true;
	}
	catch(e){ }
	//temp.style.border = "solid 1px gray";
	//temp.style.padding = "10px";
}
function cabecalhoGeral(id,excluir){
	var i,n,temp,
		ins = "<fieldset ><legend>Op&ccedil;&otilde;es principais</legend>",
		u = i3GEO.util.pegaCookie("i3geousuarionome"),
		botoes = [
			{id:"principal",titulo:"In&iacute;cio",link:"../index.html"},
			{id:"menus",titulo:"Menus",link:"menus.html"},
			{id:"arvore",titulo:"&Aacute;rvore de temas",link:"arvore.html"},
			{id:"editormapfile",titulo:"Mapfiles",link:"editormapfile.html"},
			{id:"atlas",titulo:"Atlas",link:"atlas.html"},
			{id:"login",titulo:"Login",js:"i3GEO.login.dialogo.abreLogin()"}
		];
	n = botoes.length;
	for(i=0;i<n;i++){
		if(botoes[i].id !== excluir){
			ins += '<input type=button id="'+botoes[i].id+'" value="'+botoes[i].titulo+'" />';
		}
	}
	if(!u){
		u = "-";
	}
	ins += "<div id='i3GEONomeLogin' style=width:100%; > Login: "+u+"</div>";
	ins += "</fieldset>";
	temp = $i(id);
	temp.innerHTML = ins;
	for(i=0;i<n;i++){
		if(excluir === "principal" && botoes[i].link)
		{botoes[i].link = "html/"+botoes[i].link;}
		if(botoes[i].id !== excluir){
			new YAHOO.widget.Button(botoes[i].id);
			if(botoes[i].link){
				eval('$i("'+botoes[i].id+'-button'+'").onclick = function(){window.location = \''+botoes[i].link+'\';}');
			}
			else{
				eval('$i("'+botoes[i].id+'-button'+'").onclick = function(){'+botoes[i].js+';}');
			}

		}
	}
	try{
		i3GEO.login.recarrega = true;
	}
	catch(e){ }
	//temp.style.border = "solid 1px gray";
	//temp.style.padding = "10px";
}
/*
Function: core_arvore

Cria uma arvore com base em um objeto contendo as propriedades.

No objeto com as propriedades, se "url" for igual a "", sera incluido o texto original definido em "text".

Parametros:

titulo - {String} cabecalho da arvore

onde - {String} nome do id doelemento que contera a arvore

obj - {Object} objeto contendo os parametros, exemplo

	g_listaPropriedades = {

	"propriedades": [

	{ text: "p2", url: "javascript:tipoimagem()" }

	]}

*/
function core_arvore(titulo,onde,obj){
	var arvore,root,tempNode,d,c,i,linha,conteudo,j,temaNode;
	if(!$i(onde)){return;}
	arvore = new YAHOO.widget.TreeView(onde);
	root = arvore.getRoot();
	try{
		tempNode = new YAHOO.widget.TextNode('', root, false);
		tempNode.isLeaf = false;
		tempNode.enableHighlight = false;
	}
	catch(e){
		if(typeof(console) !== 'undefined'){console.error(e);}
	}
	titulo = "<table><tr><td><b>"+titulo+"</b></td><td></td></tr></table>";
	d = {html:titulo};
	tempNode = new YAHOO.widget.HTMLNode(d, root, true,true);
	tempNode.enableHighlight = false;
	c = obj.propriedades.length;
	for (i=0, j=c; i<j; i++){
		linha = obj.propriedades[i];
		if(linha.url !== "")
		{conteudo = "<a href='#' onclick='"+linha.url+"'>"+linha.text+"</a>";}
		else
		{conteudo = linha.text;}
		d = {html:conteudo};
		temaNode = new YAHOO.widget.HTMLNode(d, tempNode, false,true);
		temaNode.enableHighlight = false;
	}
	arvore.collapseAll();
	arvore.draw();
}
/*
Function: core_movimentaNo

Movimenta um nó para cima ou para baixo na &aacute;rvore.

Essa fun&ccedil;&atilde;o utiliza uma &aacute;rvore que deve estar armazenada no objeto tree

Parameters:

tipo - sobe|desce

no - objeto no que ser&aacute; movimentado

Return:

true|false - se o movimento ocorreu
*/
function core_movimentaNo(tipo,no)
{
	var movimenta = false;
	if(tipo == "sobe")
	{
		var noanterior = no.previousSibling;
		if(noanterior)
		{
			if(noanterior.previousSibling && noanterior.data.tipo != "etiqueta")
			{
				tree.popNode(no);
				no.insertBefore(noanterior);
				tree.draw();
				movimenta = true;
			}
		}
	}
	if(tipo == "desce")
	{
		var noseguinte = no.nextSibling;
		if(noseguinte)
		{
			tree.popNode(no);
			no.insertAfter(noseguinte);
			tree.draw();
			movimenta = true;
		}
	}
	return movimenta;
}
/*
Function: core_handleSuccess

Processa o retorno da chamada em ajax quando tiver sucesso. Esta &eacute; uma
fun&ccedil;&atilde;o gen&eacute;rica, pouco usada.

Parameters:

o - string retornada pelo ajax
*/
function core_handleSuccess(o)
{
	//div onde ser&aacute; mostrado o log
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
	//div onde ser&aacute; mostrado o log
	//alert(texto)
	if(!$i('logajax'))
	{return;}
	log = $i('logajax');
	//YAHOO.log("The failure handler was called.  tId: " + o.tId + ".", "info", "example");
	if(o.responseText !== undefined)
	{
		if(o.statusText != "OK"){
			log.innerHTML = "<ul><li>Transaction id: " + o.tId + "</li>";
			log.innerHTML += "<li>HTTP status: " + o.status + "</li>";
			log.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
			log.innerHTML += "<li>PHP message: " + texto + "</li></ul>";
		}
	}
	if (!YAHOO.carregando.container.wait)
	{
		YAHOO.carregando.container.wait = new YAHOO.widget.Panel("wait",{width: "240px",fixedcenter: true,close: true,draggable: false,zindex:4,modal: true,visible: false});
		YAHOO.carregando.container.wait.setHeader("Aguarde...");
		YAHOO.carregando.container.wait.render(document.body);
	}
	else
	{YAHOO.carregando.container.wait.setBody(log.innerHTML);}
}
/*
Function: core_makeRequest

Executa uma chamada em ajax.

Parameters:

sUrl - url que ser&aacute; executada

callback - fun&ccedil;&atilde;o que processar&aacute; o retorno

tipo - GET ou POST

postpar - parametros quando o tipo for post
*/
function core_makeRequest(sUrl,callback,tipo,postpar)
{
	sUrl = escape(sUrl);
	re = new RegExp("%3F", "g");
	sUrl = sUrl.replace(re,'?');
	re = new RegExp("%3D", "g");
	sUrl = sUrl.replace(re,'=');
	re = new RegExp("%26", "g");
	sUrl = sUrl.replace(re,'&');

	re = new RegExp("%3A", "g");
	sUrl = sUrl.replace(re,':');

	if(arguments.length == 2)
	{tipo = "GET";}
	if(postpar){
		//YAHOO.util.Connect.setDefaultPostHeader('application/json;charset=ISO-8859-1');
		YAHOO.util.Connect.asyncRequest('POST', sUrl, callback, postpar);
	}
	else{
		YAHOO.util.Connect.asyncRequest(tipo, sUrl, callback);
	}
}
/*
Function: core_carregando

Mostra uma janela de aguarde

Parameters:

tipo - ativa|desativa|string com uma mensagem
*/
function core_carregando(tipo)
{
	var img = "../../imagens/aguarde.gif";
	if(i3GEO && i3GEO.configura.locaplic){
		img = i3GEO.configura.locaplic+"/imagens/aguarde.gif";
	}
	YAHOO.namespace("carregando.container");
	if (!YAHOO.carregando.container.wait)
	{
		YAHOO.carregando.container.wait = new YAHOO.widget.Panel("wait",{width: "240px",fixedcenter: true,close: true,draggable: false,zindex:4,modal: true,visible: false});
		YAHOO.carregando.container.wait.setHeader("Aguarde...");

		YAHOO.carregando.container.wait.setBody("<img src=\""+img+"\"/>");
		YAHOO.carregando.container.wait.render(document.body);
	}
	else
	{YAHOO.carregando.container.wait.show();}
	YAHOO.carregando.container.wait.setBody("<img src=\""+img+"\"/>");
	if(tipo == "ativa")
	{YAHOO.carregando.container.wait.show();}
	if(tipo == "desativa")
	{YAHOO.carregando.container.wait.hide();}
	if(tipo != "ativa" && tipo != "desativa")
	{YAHOO.carregando.container.wait.setBody("<img src=\""+img+"\"/> "+tipo);}
}
/*
Function: core_dialogoContinua

Mostra um di&aacute;logo do tipo sim n&atilde;o

Parameters:

handleYes - fun&ccedil;&atilde;o para sim

handleNo - fun&ccedil;&atilde;o para n&atilde;o

mensagem - mensagem do di&aacute;logo

largura - largura do di&aacute;logo em px
*/
function core_dialogoContinua(handleYes,handleNo,mensagem,largura,cabecalho)
{
	if(!cabecalho || cabecalho === ""){
		cabecalho = "Tem certeza?";
	}
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
	YAHOO.continua.container.simpledialog1.setHeader(cabecalho);
	YAHOO.continua.container.simpledialog1.render(document.body);
	YAHOO.continua.container.simpledialog1.show();
}
/*
Function: core_dialogoPergunta

Mostra um di&aacute;logo do tipo sim n&atilde;o com uma pergunta

Parameters:

handleYes - fun&ccedil;&atilde;o para sim

handleNo - fun&ccedil;&atilde;o para n&atilde;o

mensagem - mensagem do di&aacute;logo

largura - largura do di&aacute;logo em px
*/
function core_dialogoPergunta(handleYes,handleNo,mensagem,largura)
{
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
				icon: "",
				modal: true,
				constraintoviewport: true,
				buttons: [ { text:"Continua", handler:handleYes, isDefault:true },
							{ text:"Cancela",  handler:handleNo } ]
	} );
	//YAHOO.continua.container.simpledialog1.setHeader("Tem certeza?");
	YAHOO.continua.container.simpledialog1.render(document.body);
	YAHOO.continua.container.simpledialog1.show();
}
/*
Function: core_ativaPainelAjuda

Parameters:

id - id do elemento que receber&aacute; o painel

botao - id do elemento que dever&aacute; ser lcicado para abrir o painel
*/
function core_ativaPainelAjuda(id,botao)
{
	$i(id).style.display = "block";
	if(!YAHOO.admin.container.panelAjuda)
	{
		YAHOO.admin.container.panelAjuda = new YAHOO.widget.Panel(id, { width:"350px", height:"200px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.admin.container.panelAjuda.render();
	}
	if(arguments.length == 2)
	YAHOO.util.Event.addListener(botao, "click", YAHOO.admin.container.panelAjuda.show, YAHOO.admin.container.panelAjuda, true);
	else
	YAHOO.admin.container.panelAjuda.show();
}
/*
Function: core_ativaPainelTexto

Parameters:

id - id do elemento que receber&aacute; o painel
*/
function core_ativaPainelTexto(id)
{
	YAHOO.admin.container.panelTexto = new YAHOO.widget.Panel(id, { width:"350px", height:"200px",overflow:"auto", visible:false,constraintoviewport:true } );
	YAHOO.admin.container.panelTexto.render();
	YAHOO.admin.container.panelTexto.show();
}
/*
function: core_pegaPerfis

Pega a lista de perfis

<PEGAPERFIS>

Parameters:

funcao - (opcional) string com o nome da funcao que ser&aacute; executada após a chamada ajax ter tido sucesso

Return

$perfis - vari&aacute;vel global com o objeto perfis

$perfisArray - array com a lista de perfis
*/
function core_pegaPerfis(funcao)
{
	if(arguments.length == 0)
	{funcao = "";}
	//pega a lista de perfis
	var sUrl = "../php/menutemas.php?funcao=pegaPerfis";
	var callback =
	{
			success:function(o)
			{
				try
				{
					$perfis = YAHOO.lang.JSON.parse(o.responseText);
					$perfisArray = new Array();
					for (var i=0;i<$perfis.length;i++)
					{$perfisArray.push($perfis[i].perfil);}
					if(funcao != "")
					eval(funcao);
				}
				catch(e){core_handleFailure(o,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
function: core_pegaMapfiles

Pega a lista de mapfiles

<LISTAMAPSTEMAS>

Parameters:

funcaoM - (opcional) nome da funcao que ser&aacute; executada ao terminar a busca pelos dados

letra - (opcional) letra inicial utilizada para filtrar a lista

filtro - (opcional) string com o filtro, por exemplo, "'download_tema' = 'SIM'"
*/
function core_pegaMapfiles(funcaoM,letra,filtro)
{
	if(arguments.length == 0){
		letra = "";
		filtro = "";
		funcaoM = "";
	}
	if(arguments.length == 1){
		letra = "";
		filtro = "";
	}
	if(arguments.length == 2){
		filtro = "";
	}
	var sUrl = "../php/menutemas.php?funcao=listaMapsTemas&letra="+letra+"&filtro="+filtro;
	var callbackM =
	{
			success:function(o)
			{
				try
				{
					$mapfiles = YAHOO.lang.JSON.parse(o.responseText);
					if(funcaoM != "")
					eval(funcaoM);
				}
				catch(e){core_handleFailure(o,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callbackM);
}
/*
Function: core_comboMapfiles

Cria um combo para escolha do mapfile

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

funcao - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada no evento onchange

recarrega {booblean} - for&ccedil;a recarregar o combo de mapfiles
*/
function core_comboMapfiles(onde,id,marcar,funcao,recarrega)
{
	if(arguments.length == 3)
	{funcao = "";}
	if(!recarrega)
	{recarrega = false;}
	if($mapfiles == "" || recarrega === true)
	{
		core_pegaMapfiles("core_comboMapfiles('"+onde+"','"+id+"','"+marcar+"','"+funcao+"')");
	}
	else
	{
		if (funcao != "")
		{funcao = "onchange='"+funcao+"'";}
		ins = "<select  id='"+id+"' "+funcao+" >";
		ins += core_comboObjeto($mapfiles,"codigo","codigo",marcar);
		ins += "</select></p>";
		$i(onde).innerHTML = ins;
	}
}
/*
Function: core_comboPerfis

Cria um combo para escolha de perfil

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

funcao - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada no evento onchange
*/
function core_comboPerfis(onde,id,marcar,funcao)
{
	if(arguments.length == 3)
	{funcao = "";}
	if($perfis == "")
	{
		core_pegaPerfis("core_comboPerfis('"+onde+"','"+id+"','"+marcar+"','"+funcao+"')");
	}
	else
	{
		if (funcao != "")
		{funcao = "onchange='"+funcao+"'";}
		ins = "<select  id='"+id+"' "+funcao+" >";
		ins += core_comboObjeto($perfis,"perfil","perfil",marcar);
		ins += "</select></p>";
		$i(onde).innerHTML = ins;
	}
}
/*
Function: core_comboPranchas

Cria um combo para escolha de pranchas de um atlas

<PEGAPRANCHAS>

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

funcao - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada no evento onchange
*/
function core_comboPranchas(onde,id,marcar,funcao,id_atlas)
{
	var sUrl = "../php/atlas.php?funcao=pegaPranchas&id_atlas="+id_atlas;
	var callback =
	{
			success:function(o)
			{
				try
				{
					var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{funcao = "";}
				if (funcao != "")
				{funcao = "onchange='"+funcao+"'";}
				ins = "<select  id='"+id+"' "+funcao+" >";
				ins += core_comboObjeto(valores,"id_prancha","titulo_prancha",marcar);
				ins += "</select></p>";
				$i(onde).innerHTML = ins;
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_comboGrupos

Cria um combo para escolha de um grupo

<PEGAGRUPOS>

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

funcao - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada no evento onchange
*/
function core_comboGrupos(onde,id,marcar,funcao)
{
	var sUrl = "../php/menutemas.php?funcao=pegaGrupos";
	var callback =
	{
			success:function(o)
			{
				try
				{
					var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{funcao = "";}
				if (funcao != "")
				{funcao = "onchange='"+funcao+"'";}
				ins = "<select size=6 style='width:370px' id='"+id+"' "+funcao+" >";
				ins += core_comboObjeto(valores,"id_grupo","nome_grupo",marcar);
				ins += "</select></p>";
				$i(onde).innerHTML = ins;
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_comboSubGrupos

Cria um combo para escolha de um sub-grupo

<PEGASUBGRUPOS>

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

funcao - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada no evento onchange
*/
function core_comboSubGrupos(onde,id,marcar,funcao)
{
	var sUrl = "../php/menutemas.php?funcao=pegaSubGrupos";
	var callback =
	{
			success:function(o)
			{
				try
				{
					var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{funcao = "";}
				if (funcao != "")
				{funcao = "onchange='"+funcao+"'";}
				ins = "<select size=6 style='width:370px' id='"+id+"' "+funcao+" >";
				ins += core_comboObjeto(valores,"id_subgrupo","nome_subgrupo",marcar);
				ins += "</select></p>";
				$i(onde).innerHTML = ins;
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_comboTemas

Cria um combo para escolha de um tema

<PEGATEMAS2>

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

funcao - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada no evento onchange
*/
function core_comboTemas(onde,id,marcar,funcao)
{
	var sUrl = "../php/menutemas.php?funcao=pegaTemas2";
	var callback =
	{
			success:function(o)
			{
				try
				{
					var valores = YAHOO.lang.JSON.parse(o.responseText);
				if(arguments.length == 3)
				{funcao = "";}
				if (funcao != "")
				{funcao = "onchange='"+funcao+"'";}
				ins = "<select size=6 style='width:370px' id='"+id+"' "+funcao+" >";
				ins += core_comboObjeto(valores,"id_tema","nome_tema",marcar,"codigo_tema");
				ins += "</select></p>";
				$i(onde).innerHTML = ins;
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}

/*
function: core_pegaTags

Pega a lista de tags

<PEGATAGS>

Parameters:

funcao - (opcional) nome da funcao que ser&aacute; executada ao terminar a busca pelos dados
*/
function core_pegaTags(funcao)
{
	if(arguments.length == 0)
	{funcao = "";}
	var sUrl = "../php/menutemas.php?funcao=pegaTags";
	var callback =
	{
			success:function(o)
			{
				try
				{
					$tags = YAHOO.lang.JSON.parse(o.responseText);
					if($tags == ""){$tags = " ";}
					if(funcao != "")
					eval(funcao);
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_comboTags

Cria um combo para escolha de tags

Parameters:

onde - id do elemento que receber&aacute; o combo

id - id do combo que ser&aacute; criado

marcar - valor que ser&aacute; marcado como selecionado

change - nome da fun&ccedil;&atilde;o do evento onchange
*/
function core_comboTags(onde,id,change)
{
	if($tags == "")
	{
		core_pegaTags("core_comboTags('"+onde+"','"+id+"','"+change+"')");
	}
	else
	{
		ins = "<select onchange=\""+change+"(this.value)\" id='"+id+"' >";
		ins += core_comboObjeto($tags,"nome","nome","");
		ins += "</select></p>";
		$i(onde).innerHTML = ins;
	}
}
/*
Function: gera uma janela flutuante com op&ccedil;&otilde;es de escolha baseadas em checkbox

Parameters:

valores - array com os valores de cada checkbox

textos - array com os nomes de cada checkbox

selecionados - array com os valores marcados

target - objeto para receber o resultado

record - objeto record (utilize "" para escapar)

key - chave (nome do item) (utilize "" para escapar)

unico - sim|nao indicando se apenas um pode ser escolhido
*/
function core_menuCheckBox(valores,textos,selecionados,target,record,key,unico){
	if(!unico){
		unico = "nao";
	}
	function on_menuCheckBoxChange(p_oEvent){
		var cks,i,
		ins = [],
		status = "OK";
		if(p_oEvent && p_oEvent.newValue){
			status = p_oEvent.newValue.get("value");
		}
		if(status == "OK")	{
			cks = $i("core_menuCK_bd").getElementsByTagName("input");
			ins = [];
			for (i=0;i<cks.length;i++){
				if(cks[i].checked){
					ins.push(cks[i].value);
				}
			}
			if(record && record != ""){
				target.innerHTML = "<pre ><p>"+ins.toString()+"</pre>";
				record.setData(key,ins.toString());
			}
			else{
				target.value = ins.toString();
			}
		}
		YAHOO.admin.container.panelCK.destroy();
		YAHOO.admin.container.panelCK = null;
	};
	var novoel,ndiv,og_core,onde,ins,i,novoCK,ck,j;
	if(!YAHOO.admin.container.panelCK){
		novoel = document.createElement("div");
		novoel.id =  "core_menuCK";
		ndiv = document.createElement("div");
		ndiv.className= "yui-dt-editor";
		ndiv.style.backgroundColor = "white";
		ndiv.style.height = "144px";
		ndiv.style.width = "100%";
		ndiv.style.overflow = "auto";
		ndiv.innerHTML = "<div id='core_botoesCabecalho' ></div><br>" +
			"<div id='core_menuCK_bd' style='background:white;text-align:left;border:1px solid gray'></div>";
		novoel.appendChild(ndiv);
		document.body.appendChild(novoel);
		og_core = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id", name:"okcancel_checkbox_id", container:"core_botoesCabecalho" });
		og_core.addButtons([
			{ label: "OK", value: "OK", checked: false},
			{ label: "Fecha", value: "CANCEL", checked: false }
		]);
		og_core.on("checkedButtonChange", on_menuCheckBoxChange);
		YAHOO.admin.container.panelCK = new YAHOO.widget.Panel("core_menuCK", { draggable:false,modal:true,zindex:"100",close:false,underlay:false,width:"200px", height:"158px",overflow:"auto", visible:false,constraintoviewport:false } );
		YAHOO.admin.container.panelCK.render();
	}
	onde = $i("core_menuCK_bd");
	ins = [];
	onde.innerHTML = "";
	for (i=0;i<valores.length;i++){
		novoCK = document.createElement("div");
		novoCK.onclick = on_menuCheckBoxChange;
		ck = "";
		for(j=0;j<selecionados.length;j++){
			if(selecionados[j] == valores[i])
			ck = "CHECKED";
		}
		if(unico === "nao"){
			ins.push("<input style='cursor:pointer;' type=checkbox id='CK_"+valores[i]+"' value='"+valores[i]+"' "+ck+" />"+textos[i]+"<br>");
		}
		else{
			ins.push("<input style='position:relative;top:2px;cursor:pointer;' type=radio name=escolha_core_menuCheckBox id='CK_"+valores[i]+"' value='"+valores[i]+"' "+ck+" />"+textos[i]+"<br>");
		}
	}
	if(valores.length > 0){
		ins.push("<br>");
		novoCK.innerHTML = ins.join(" ");
		novoCK.style.width = "100%";
		onde.appendChild(novoCK);
	}
	YAHOO.admin.container.panelCK.moveTo(YAHOO.util.Dom.getX(target),YAHOO.util.Dom.getY(target));
	YAHOO.admin.container.panelCK.show();
	$i("core_menuCK_bd").getElementsByTagName("div")[0].style.textAlign = "left";
}
/*
Function: core_combosimnao

Retorna os itens option de um combo sim nao
*/
function core_combosimnao(marcar)
{
	var ins = "<option value='' ";
	if (marcar == ""){ins += "selected";}
	ins += ">---</option>";
	ins += "<option value='SIM' ";
	if (marcar == "sim" || marcar == "SIM"){ins += "selected";}
	ins += ">sim</option>";
	ins += "<option value='NAO' ";
	if (marcar == "nao" || marcar == "NAO"){ins += "selected";}
	ins += ">nao</option>";
	return(ins);
}
/*
Function: core_comboObjeto

Retorna os itens option de um combo baseado em um objeto json
*/
function core_comboObjeto(obj,valor,texto,marcar,texto2)
{
	var ins = "<option value='' ";
	var v;
	var t;
	ins += ">---</option>";
	for (var k=0;k<obj.length;k++)
	{
		if(valor != "")
		v = eval("obj[k]."+valor);
		else
		v = obj[k];
		if(texto != "")
		t = eval("obj[k]."+texto);
		else
		t = obj[k];

		if(texto2){
			t += " ("+eval("obj[k]."+texto2)+")";
		}

		ins += "<option value='"+v+"' ";
		if (marcar && marcar == v){ins += "selected";}
		ins += " title='"+t+"'  >"+t+"</option>";
	}
	return(ins);
}
/*
Function: core_geraLinhas

Gera campos de formul&aacute;rio

Parameters:

dados - objeto no formato {"linhas":[{titulo:"Nome do tema:",size:"50",id:"Enome_tema",value:i.nome_tema,tipo:"text",div:""}]}
*/
function core_geraLinhas(dados)
{
	var nparam = dados.linhas.length;
	var contaParam = 0;
	var resultado = "";
	core_geralinhasEscondeAjuda = function(id){
		var a = $i(id+"_ajuda"),
			i = $i(id+"_imgajuda");

		if(a.style.display == "block"){
			a.style.display = "none";
			i. src = "../../imagens/desce.gif";
		}
		else{
			a.style.display = "block";
			i. src = "../../imagens/sobe.gif";
		}
	};
	do
	{
		var p = dados.linhas[contaParam];
		if(p.tipo == "text" || p.tipo == "cor")
		{
			if(!p.size){p.size = "50";}
			if(p.ajuda)
			{
				var idajuda;
				if(p.id !== "")
				{idajuda = p.id + contaParam;}
				else{
					idajuda = "a"+parseInt(255*(Math.random()),10);
				}
				//var temp = "$i('"+idajuda+"_ajuda').style.display='block' "
				resultado += "<p><div onclick='core_geralinhasEscondeAjuda(\""+idajuda+"\")' style=cursor:pointer title='ajuda' ><img id='"+idajuda+"_imgajuda' src='../../imagens/desce.gif' >&nbsp;<b>"+p.titulo+"</b></div>";
				resultado += "<div id='"+idajuda+"_ajuda' style=display:none >"+p.ajuda+"</div>";
			}
			else
			resultado += "<p><b>"+p.titulo+"</b><br>";
			if(p.texto)
			resultado += "<span style=color:gray >"+p.texto+"</span</p>";
			if(p.id != "")
			{
				if(!p.value)
				p.value = "";
				resultado += "<input style=width:90%; type=text id="+p.id+" value=\""+p.value+"\" />";
				if(p.tipo == "cor")
				{
					resultado += "&nbsp;<img src='../../imagens/aquarela.gif' style='cursor:pointer;' onclick='core_abreCor(\"\",\""+p.id+"\");' />";
				}
				resultado += "</p>";
			}
			if(p.div)
			{resultado += p.div;}
		}
		contaParam++;
	}
	while(contaParam < nparam)
	return(resultado);
}
/*
Function: core_ativaBotaoAdicionaLinha

Ativa o bot&atilde;o que adiciona uma linha em uma tabela no banco de dados e na interface HTML

Essa fun&ccedil;&atilde;o utiliza o objeto datatable que deve estar armazenado na vari&aacute;vel myDataTable

Parameters:

myDataTable - objeto dataTable do YUI

sUrl - url com o programa que ser&aacute; executado no servidor

idBotao - id do elemento com o bot&atilde;o

nomeFuncao - nome da fun&ccedil;&atilde;o que ser&aacute; executada ao concluir a adi&ccedil;&atilde;o da linha
*/
function core_ativaBotaoAdicionaLinha(sUrl,idBotao,nomeFuncao)
{
	if(arguments.length == 1){
		idBotao = "adiciona";
	}
	if(arguments.length < 3){
		nomeFuncao = "";
	}
	var adicionalinha = function(){
		core_carregando("ativa");
		core_carregando(" adicionando um novo registro");
		var callback = {
			success:function(o){
				var texto = "";
				try{
					core_carregando("desativa");
					if(nomeFuncao != ""){
						if(YAHOO.lang.isFunction(nomeFuncao)){
							nomeFuncao.call(o);
						}
						else{
							eval(nomeFuncao+"()");
						}
					}
					else{
						texto = YAHOO.lang.JSON.parse(o.responseText)[0];
						if(texto === ""){
							texto = "Clique para editar";
						}
						myDataTable.addRow(texto,0);
					}
				}
				catch(e){
					core_handleFailure(e,o.responseText);
				}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	//cria o bot&atilde;o de adi&ccedil;&atilde;o de um novo menu
	new YAHOO.widget.Button(idBotao,{ onclick: { fn: adicionalinha } });
}
/*
Function: core_pegaDados

Busca dados no servidor via Ajax e executa uma fun&ccedil;&atilde;o de retorno com os daods

Parameters:

mensagem - mensagem que ser&aacute; mostrada na tela

sUrl - url do programa que ser&aacute; executado no servidor

funcaoRetorno - funcao que ser&aacute; executada ao terminar a busca pelos dados
*/
function core_pegaDados(mensagem,sUrl,funcaoRetorno)
{
	if("mensagem" != "")
	core_carregando(mensagem);
	var callback =
	{
			success:function(o)
			{
				try
				{
					if(funcaoRetorno != "")
					{eval(funcaoRetorno+"(YAHOO.lang.JSON.parse(o.responseText))");}
					core_carregando("desativa");
				}
				catch(e)
				{
					if("mensagem" != "")
					{core_carregando("desativa");}
					core_handleFailure(o,o.responseText);
				}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_gravaLinha

Grava um registro no banco de dados e atualiza o datatable atual

Essa fun&ccedil;&atilde;o utiliza o objeto datatable que deve estar armazenado na vari&aacute;vel myDataTable

Parameters:

mensagem - mensagem que ser&aacute; mostrada na tela

row - objeto row que foi clicado pelo usu&aacute;rio. Utilizado para se obter os daods do recordset

sUrl - url do programa que ser&aacute; executado

nomeFuncao - nome da funcao que sera executada após gravar os dados (opcional)
*/
function core_gravaLinha(mensagem,row,sUrl,nomeFuncao)
{
	core_carregando("ativa");
	core_carregando(mensagem);
	if(arguments.length < 4)
	nomeFuncao = "";
	var callback =
	{
			success:function(o)
			{
			core_carregando("desativa");
			var rec = myDataTable.getRecordSet().getRecord(row);
			var linha = myDataTable.getTrEl(rec);
			if(nomeFuncao != "")
			{
				eval(nomeFuncao+"()");
				try
				{myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);}
				catch(e){}
			}
			else
			{
				myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
				}
			linha.style.color = "";
			linha.style.textDecoration = "none";
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_excluiLinha

Exclu&iacute; um registro no banco de dados e atualiza o datatable.

Essa fun&ccedil;&atilde;o utiliza o objeto datatable que deve estar armazenado na vari&aacute;vel myDataTable

Parameters:

sUrl - url do programa que ser&aacute; executado

row - objeto row de um datatable

mensagem -
*/
function core_excluiLinha(sUrl,row,mensagem,cabecalho,tabela)
{
	if(!cabecalho){
		cabecalho = "";
	}
	//dialogo
	// Define various event handlers for Dialog
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		core_carregando(mensagem);
		var callback =
		{
				success:function(o)
				{
					try
					{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
						{
							core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem outras tabelas com registros vinculados a este</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else
						{
							if(tabela){
								tabela.deleteRow(row);
							}
							else{
								myDataTable.deleteRow(row);
							}
							core_carregando("desativa");
						}
					}
					catch(e){core_handleFailure(o,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	var handleNo = function(){
		this.hide();
	};
	var mensagem = "Exclui o registro?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura,cabecalho);
}
/*
Function: core_excluiNoTree

Exclu&iacute; um registro no banco de dados e atualiza o treeview.

Essa fun&ccedil;&atilde;o utiliza o objeto treeview que deve estar armazenado na vari&aacute;vel tree

Parameters:

sUrl - url do programa que ser&aacute; executado

no - objeto no de um treeview

mensagem -
*/
function core_excluiNoTree(sUrl,no,mensagem,cabecalho)
{
	if(!cabecalho){
		cabecalho = "";
	}
	//dialogo
	// Define various event handlers for Dialog
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		core_carregando(mensagem);
		var callback =
		{
				success:function(o)
				{
					try
					{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
						{
							core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem outras tabelas com registros vinculados a este</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else
						{
						if(no){
							tree.removeNode(no);
							tree.draw();
							}
						core_carregando("desativa");
						}
					}
					catch(e){core_handleFailure(o,o.responseText);}
				},
				failure:core_handleFailure,
				argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	var handleNo = function()
	{
		this.hide();
	};
	var mensagem = "Exclui o registro?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura,cabecalho);
}
/**
Function: core_montaEditor

Monta uma janela flutuante com um formul&aacute;rio.

O editor possui um div com id=editor_bd que deve ser usado para incluir o formul&aacute;rio.

Parameters:

funcaoOK - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada quando o bot&atilde;o OK for pressionado.

funcaoClose - nome da funcao que ser&aacute; executada quando a janela for fechada. Pode ser "" para escapar.

titulo - titulo da janela

modal - boolean
*/
function core_montaEditor(funcaoOK,w,h,funcaoClose,titulo,modal)
{
	if(arguments.length == 0)
	{
		funcaoOK = "";
		w = "400px";
		h = "354px";
		modal == true;
	}
	if(arguments.length < 2)
	{
		w = "400px";
		h = "354px";
		modal == true;
	}
	if(!titulo){
		titulo = "Editor";
		modal == true;
	}
	if(!funcaoClose){
		funcaoClose = "";
		modal == true;
	}
	if(!$i("janela_editor"))
	{
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor";
		var ins = '<div class="hd">'+titulo+'</div>';
		ins += "<div class='bd' style='height:"+h+";overflow:auto'>";
		ins += "<div id='okcancel_checkbox'></div>";
		ins += "<div id='editor_bd'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		if(funcaoOK != "")
		{
			var lb = $i("okcancel_checkbox");
			lb.innerHTML = "<input id=okcancel_checkboxOK type='buttom' value='Salva' /><input id=okcancel_checkboxCANCEL type='buttom' value='Cancela' />";
			new YAHOO.widget.Button(
				"okcancel_checkboxOK",
				{onclick:{fn: function(){
					eval(funcaoOK);
				}}}
			);
			new YAHOO.widget.Button(
				"okcancel_checkboxCANCEL",
				{onclick:{fn: function(){
					YAHOO.admin.container.panelEditor.destroy();
					YAHOO.admin.container.panelEditor = null;
				}}}
			);
		}
		YAHOO.admin.container.panelEditor = new YAHOO.widget.Panel("janela_editor", { fixedcenter:"contained",close:true,width:w, overflow:"auto",modal: modal,visible:false,constraintoviewport:true } );
		YAHOO.admin.container.panelEditor.render();
	}
	else
	{
		if($i("editor_bd"))
		{$i("editor_bd").innerHTML == "";}
	}
	var fecha = function()
	{
		try{
			YAHOO.admin.container.panelEditor.destroy();
			YAHOO.admin.container.panelEditor = null;
		}
		catch(e){}
		try{
			if(funcaoClose != "")
			{eval(funcaoClose+"()");}
		}
		catch(e){};
	};
	YAHOO.util.Event.addListener(YAHOO.admin.container.panelEditor.close, "click", fecha);
	YAHOO.admin.container.panelEditor.show();
	//registra a janela no gerenciador de janelas default da classe i3GEO.janela caso ela exista
	try{
		YAHOO.i3GEO.janela.manager.register(YAHOO.admin.container.panelEditor);
	}
	catch(e){}
}
/*
Function idiomaSel

Retorna o idioma selecionado pesquisando no elemento select com id = "idioma"
*/
function idiomaSel(){
	var idioma = "pt";
	if($i("idioma"))
	{idioma = $i("idioma").value;}
	return idioma;
}
function core_abreCor(janela,elemento)
{
	if(i3GEO.configura == undefined )
	{i3GEO.configura = {locaplic: "../.."};}
	i3GEO.util.abreCor("",elemento,"rgb");
	$i("i3geo_janelaCori").style.width = "350px";
	$i("i3geo_janelaCori").style.height = "290px";
	//i3GEO.janela.cria("350px","250px","../../ferramentas/colorpicker/index.htm?doc=&elemento="+elemento+"&tipo=rgb","","","Cor","i3geo_janelaCor",true);
}
function core_desativaforms(lista){
	var n = lista.length,
		i,t;
	for (i=0;i<n;i++){
		t = $i(lista[i]);
		if(t){
			//t.style.background = "pink";
			t.disabled = true;
		}
	}
}
function core_ativaforms(lista){
	var n = lista.length,
		i,t;
	for (i=0;i<n;i++){
		t = $i(lista[i]);
		if(t){
			//t.style.background = "white";
			t.disabled = false;
		}
	}
}
function core_listaDeLetras(onde,nomeFuncao){
	//letraAtual guarda a última letra clicada
	var o,i,ins= "<p><b>",
		letras = ["Todos","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z","_","1","2","3","4","5","6","7","8","9"],
		nletras = letras.length;
	if(!i3GEO.util){
		alert("Erro i3GEO.util ???");
		return;
	}
	letraAtual = "";
	if(i3GEO.util.pegaCookie("I3GEOletraAdmin")) {
		letraAtual = i3GEO.util.pegaCookie("I3GEOletraAdmin");
	}
	for (i = 0; i < nletras; i++) {
		ins += "<span onclick='"+nomeFuncao+"(\""
				+ letras[i]
				+ "\")' style='color:blue;cursor:pointer;padding:1px;border: 1px solid #C8C8FA'>"
				+ letras[i] + "</span>&nbsp;";
	}
	ins += "</b></p>";
	if(onde != ""){
		o = document.getElementById(onde);
		if(o){
			o.innerHTML = "<fieldset style=padding:2px; class=letras ><form id=forminiciais ><p><b>Iniciais: <input name='' onchange='' value='"+letraAtual+"' id=iniciaisLetras type=text style=width:40px;cursor:pointer /> ou </form><div style=position:relative;top:1px; id='_listaDeLetras' >"+ins+"</div></b></p></fieldset>";
			document.getElementById("forminiciais").onsubmit = function(){
				var v = document.getElementById("iniciaisLetras").value;
				i3GEO.util.insereCookie("I3GEOletraAdmin", v);
				eval(nomeFuncao+"('"+v+"');");
				return false;
			};
			document.getElementById("_listaDeLetras").onclick = function(){
				document.getElementById("iniciaisLetras").value = letraAtual;
			};
		}
	}
	else{
		return ins;
	}
}
//
//carregador de javascript
//
//define o local correto dos programas
//
(function(){
	var scriptLocation = "";
	var scripts = document.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
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
	//arquivos javascript que ser&atilde;o carregados
	//
	/*
	<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
	<?php if(extension_loaded('zlib')){ob_end_flush();}?>
	*/
	var jsfiles = [];
	var cssfiles = [];
	if(typeof(i3GEO) !== 'undefined' && i3GEO.locaplic){
		scriptLocation = "";
		jsfiles = [];
		//
		//arquivos css
		//
		cssfiles =new Array(
			i3GEO.configura.locaplic+"/admin/html/admin.css"
		);
	}
	else{
		jsfiles = new Array(
		"../../pacotes/yui290/build/utilities/utilities.js",
		"../../pacotes/yui290/build/yahoo-dom-event/yahoo-dom-event.js",
		"../../pacotes/yui290/build/element/element-min.js",
		"../../pacotes/yui290/build/datasource/datasource-min.js",
		"../../pacotes/yui290/build/datatable/datatable-min.js",
		"../../pacotes/yui290/build/button/button-min.js",
		"../../pacotes/yui290/build/dragdrop/dragdrop-min.js",
		"../../pacotes/yui290/build/container/container-min.js",
		"../../pacotes/yui290/build/connection/connection-min.js",
		"../../pacotes/yui290/build/treeview/treeview.js",
		"../../pacotes/yui290/build/json/json-min.js",
		"../../pacotes/yui290/build/menu/menu-min.js",
		"../../pacotes/yui290/build/editor/editor-min.js",
		"../../classesjs/compactados/classe_util_compacto.js",
		"../../classesjs/compactados/classe_login_compacto.js",
		"../../classesjs/compactados/classe_janela_compacto.js",
		"../../classesjs/compactados/dicionario_compacto.js",
		"../../classesjs/compactados/classe_idioma_compacto.js",
		"../../classesjs/compactados/classe_guias_compacto.js",
		"../../pacotes/cpaint/cpaint2.inc.compressed.js"
		);
		//
		//arquivos css
		//
		cssfiles =new Array(
		"../../pacotes/yui290/build/tabview/assets/skins/sam/tabview.css",
		"../../pacotes/yui290/build/button/assets/skins/sam/button.css",
		"../html/admin.css",
		"../../pacotes/yui290/build/fonts/fonts-min.css",
		"../../pacotes/yui290/build/datatable/assets/skins/sam/datatable.css",
		"../../pacotes/yui290/build/container/assets/skins/sam/container.css",
		"../../pacotes/yui290/build/treeview/assets/skins/sam/treeview.css",
		"../../pacotes/yui290/build/editor/assets/skins/sam/editor.css"
		);
	}
	//
	//carrega os arquivos js
	//
	var allScriptTags = "";
	for (var i = 0; i < jsfiles.length; i++)
	{
		var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
		allScriptTags += currentScriptTag;
	}
	document.write(allScriptTags);
	//
	//carrega os arquivos css
	//
	var allCssTags = "";
	for (var i = 0; i < cssfiles.length; i++)
	{
		var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
		allCssTags += currentCssTag;
	}
	document.write(allCssTags);
})();



