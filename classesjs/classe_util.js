/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Utilit&aacute;rios

Arquivo:

i3geo/classesjs/classe_util.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
/*
Propriedade: navm

Verdadeiro (true) se o navegador for o Internet Explorer

Tipo:
{boolean}

Default:
{false}
*/
navm = false;
/*
Propriedade: navn

Verdadeiro (true) se o navegador for o Firefox

Tipo:
{boolean}

Default:
{false}

*/
navn = false;
/*
Propriedade: chro

Verdadeiro (true) se o navegador for o Chrome

Tipo:
{boolean}

Default:
{false}
*/
chro = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
/*
Propriedade: opera

Verdadeiro (true) se o navegador for o Opera

Tipo:
{boolean}

Default:
{false}
*/
opera = navigator.userAgent.toLowerCase().indexOf('opera') > -1;
if (navigator.appName.substring(0,1) === 'N'){navn=true;}
if (navigator.appName.substring(0,1) === 'M'){navm=true;}
if(opera === true)
{navn = true;}
/*
Variavel: g_operacao

Nome da ultima operacao que foi executada.

Dependendo do tipo de operacao sao aplicadas as atualizacoes necessarias aos componentes do mapa. Por exemplo, redesenha o corpo do mapa, atualiza a lista de temas, etc.

Essas operacoes sao controladas pela funcao ajaxiniciaparametros.
*/
g_operacao = "";
/*
Variavel: g_tipoacao

Tipo de acao que esta sendo executada.
Quando o usuario clica no mapa, essa variavel e pesquisada para definir o tipo de operacao que deve ser executada.
E definida quando o usuario seleciona uma determinada ferramenta do i3Geo.
*/
g_tipoacao = "zoomli";

/*
Function: $i

Obtem um elemento DOM a partir de seu id

Parametros:

id - {String} ID do elemento.

Returns:

{Object} Objeto.
*/
$i = function(id)
{return document.getElementById(id);};
/*
Function: Array.remove()

Extende os metodos de um objeto Array, permitindo remover um elemento.

*/
Array.prototype.remove=function(s){
	try{
		var n = this.length,i;
		for(i=0;i<n;i++){
			if(this[i] == s)
			{this.splice(i, 1);}
		}
	}catch(e){}
};

/*
Classe: i3GEO.util

Utilitarios.
*/
i3GEO.util = {
	/*
	Variavel: PINS

	Elementos IMG criados na funcao criaPin

	Tipo:
	{Array}
	*/
	PINS: [],
	/*
	Variavel:BOXES

	Elementos DIV criados na funcao criaBox

	Tipo:
	{Array}
	*/
	BOXES: [],
	/*
	Function: escapeURL

	Converte uma string em uma url valida

	Parametros:

	sUrl {String} - url que sera convertida

	Return:

	Tipo:
	{String}
	*/
	escapeURL: function(sUrl){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.escapeURL()");}
		var re;
		sUrl = escape(sUrl);
		re = new RegExp("%3F", "g");
		sUrl = sUrl.replace(re,'?');
		re = new RegExp("%3D", "g");
		sUrl = sUrl.replace(re,'=');
		re = new RegExp("%26", "g");
		sUrl = sUrl.replace(re,'&');
		return sUrl;
	},
	/*
	Function: insereCookie

	Cria um novo cookie.

	Parametros:

	nome - {String} Nome do cookie.

	valor - {String} Valor do cookie

	expira - {numerico} Dias que levara para expirar
	*/
	insereCookie: function(nome,valor,expira) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.insereCookie()");}
		if(!expira){
			expira = 10;
		}
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + expira);
		document.cookie = nome+"="+valor+"; expires="+exdate.toUTCString()+";path=/";
	},
	/*
	Function: pegaCookie

	Pega o valor de um cookie.

	Parametros:

	nome - {String} Nome do cookie.

	Returns:

	(String) - valor do cookie
	*/
	pegaCookie: function(nome){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.pegaCookie()");}
		var cookies,i,fim;
		cookies = document.cookie;
		i = cookies.indexOf(nome);
		if(i === -1)
		{return null;}
		fim = cookies.indexOf(";",i);
		if (fim === -1)
		{fim = cookies.length;}
		return (unescape(cookies.substring(i,fim))).split("=")[1];
	},
	/*
	Function: listaChaves

	Lista as chaves de um objeto.

	Parametros:

	obj - {Object}

	Return:

	(Array) - array com as chaves.
	*/
	listaChaves: function (obj) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.listaChaves()");}
		var keys,key = "";
		keys = [];
		for(key in obj){
			if(obj[key])
			{keys.push(key);}
		}
		return keys;
	},
	/*
	Function: criaBotaoAplicar

	Cria um botao flutuante do tipo aplicar.

	O novo botao e adicionado no DOM com ID "i3geo_aplicar" e posicionado sobre o objeto definido

	Parametros:

	nomeFuncao - {String} Nome da funcao que sera executada quando o botao for cllicado

	titulo - (opcional) {String} Titulo que sera mostrado no botao

	classe - (opcional) {String} Nome da classe (estilo) que sera aplicado ao botao.

	obj - (opcional) {Objeto} Objeto DOM que foi clicado para provocar a criacao do botao.

	Return:

	(Object) - Objeto DOM criado.

	*/
	criaBotaoAplicar: function (nomeFuncao,titulo,classe,obj) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.criaBotaoAplicar()");}
		try{
			if(typeof(tempoBotaoAplicar) !== 'undefined')
			{clearTimeout(tempoBotaoAplicar);}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
		var executar = new Function(nomeFuncao+"().call;clearTimeout(tempoBotaoAplicar);"),
			novoel,xy;
		//tempoBotaoAplicar = eval("setTimeout('"+nomeFuncao+"\(\)',(i3GEO.configura.tempoAplicar))");
		tempoBotaoAplicar = setTimeout(executar,(i3GEO.configura.tempoAplicar));
		//autoRedesenho("reinicia");
		if(arguments.length === 1)
		{titulo = "Aplicar";}
		if(arguments.length === 1 || arguments.length === 2)
		{classe = "i3geoBotaoAplicar";}
		if (!document.getElementById("i3geo_aplicar"))
		{
			novoel = document.createElement("input");
			novoel.id = 'i3geo_aplicar';
			novoel.type = 'button';
			novoel.value = titulo;
			novoel.style.cursor="pointer";
			novoel.style.fontSize="10px";
			novoel.style.zIndex = 15000;
			novoel.style.position="absolute";
			novoel.style.display="none";
			novoel.onmouseover = function(){this.style.display="block";};
			novoel.onmouseout = function(){this.style.display="none";};
			novoel.className = classe;
			document.body.appendChild(novoel);
		}
		else
		{novoel = document.getElementById("i3geo_aplicar");}
		novoel.onclick = function(){
			clearTimeout(i3GEO.parametros.tempo);
			i3GEO.parametros.tempo = "";
			this.style.display='none';
			eval(nomeFuncao+"\(\)");
		};
		//reposiciona o botao
		if(arguments.length === 4){
			novoel.style.display="block";
			xy = YAHOO.util.Dom.getXY(obj);
			YAHOO.util.Dom.setXY(novoel,xy);
		}
		return (novoel);
	},
	/*
	Function: arvore

	Cria uma arvore com base em um objeto contendo as propriedades.

	No objeto com as propriedades, se "url" for igual a "", sera incluido o texto original definido em "text".

	Caso contrario, o valor de "text" sera traduzido com $trad(). Nesse caso, utilize em "text" o codigo definido em dicionario.js

	Parametros:

	titulo - {String} cabecalho da arvore

	onde - {String} nome do id doelemento que contera a arvore

	obj - {Object} objeto contendo os parametros, exemplo

		g_listaPropriedades = {

		"propriedades": [

		{ text: "p2", url: "javascript:tipoimagem()" }

		]}

	*/
	arvore: function(titulo,onde,obj){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.arvore()");}
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
			{conteudo = "<a href='#' onclick='"+linha.url+"'>"+$trad(linha.text)+"</a>";}
			else
			{conteudo = linha.text;}
			d = {html:conteudo};
			temaNode = new YAHOO.widget.HTMLNode(d, tempNode, false,true);
			temaNode.enableHighlight = false;
		}
		arvore.collapseAll();
		arvore.draw();
	},
	/*
	Function: removeAcentos

	Remove acentos de uma palavra ou frase

	Parametros:

	palavra {String}

	Return:

	{String}
	*/
	removeAcentos: function(palavra) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.removeAcentos()");}
		var re;
		re = /á|à|ã|â/gi;
		palavra = palavra.replace(re,"a");
		re = /é|ê/gi;
		palavra = palavra.replace(re,"e");
		re = /í/gi;
		palavra = palavra.replace(re,"i");
		re = /ó|õ|ô/gi;
		palavra = palavra.replace(re,"o");
		re = /ç/gi;
		palavra = palavra.replace(re,"c");
		re = /ú/gi;
		palavra = palavra.replace(re,"u");
		return(palavra);
	},
	/*
	Function: protocolo

	Obtem o protocolo utilizado na URL atual

	Return:

	{String} - protocolo
	*/
	protocolo: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.protocolo()");}
		var u = window.location.href;
		u = u.split(":");
		return (u[0]);
	},
	/*
	Function: pegaPosicaoObjeto

	Retorna a posicao x,y de um objeto em relacao a tela do navegador

	Parametros:

	obj {Object} - objeto dom

	Return:

	{Array} - array com a posicao [x,y]
	*/
	pegaPosicaoObjeto: function(obj){
		if(obj)
		{
			if(!obj.style)
			{return [0,0];}
			var curleft = 0,curtop = 0;
			if(obj){
				if (obj.offsetParent) {
					do {
						curleft += obj.offsetLeft-obj.scrollLeft;
						curtop += obj.offsetTop-obj.scrollTop;
						//$i("posicaoDomouse").innerHTML = obj.id+" "+curleft;
						obj = obj.offsetParent;
					} while (obj);
				}
			}
			return [curleft+document.body.scrollLeft,curtop+document.body.scrollTop];
		}
		else
		{return [0,0];}
	},
	/*
		Function: pegaElementoPai

		Pega o elemento pai de um elemento clicado para identificar o codigo do tema.

		Parametros:

		e - elemento do DOM.

		Return:

		{Node} - objeto DOM
	*/
	pegaElementoPai: function(e){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.pegaElementoPai()");}
		var targ = document;
		if (!e)
		{e = window.event;}
		if (e.target)
		{targ = e.target;}
		else{
			if (e.srcElement)
			{targ = e.srcElement;}
		}
		if (targ.nodeType === 3)
		{targ = targ.parentNode;}
		if(targ.parentNode){
			tparent=targ.parentNode;
			return(tparent);
		}
		else
		{return targ;}
	},
	/*
	Function: mudaCursor

	Altera o cursor do ponteiro do mouse.

	Os cursores disponiveis sao definidos por default em classe_configura.js

	Exemplo i3GEO.util.mudaCursor("","crosshair")

	Parametros:

	cursores {i3GEO.configura.cursores} - objeto JSON com as URIs de cada cursor (veja i3GEO.configura.cursores)

	tipo {String} - tipo de cursor disponivel em cursores

	idobjeto {String} - id do objeto que tera o estilo alterado para o cursor desejado

	locaplic {String} - onde esta instalado o i3Geo
	*/
	mudaCursor: function(cursores,tipo,idobjeto,locaplic){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.mudaCursor("+idobjeto+")");}
		var os = [],
			o,
			i,
			c = "",
			n,
			cursor="",
			ext = ".ff";
		//
		//no caso da interface openlayers, o cursor deve ser definido no estilo
		//do elemento img de cada TILE de cada LAYER
		//para achar os img faz-se a busca pela classe css utilizada pelo OpenLayers nos img desse tipo
		//
		try{
			if(navm)
			{ext = ".ie";}
			os.push(document.getElementById(idobjeto));
			if(i3GEO.Interface.ATUAL === "openlayers"){
				os = YAHOO.util.Dom.getElementsByClassName('olTileImage', 'img');
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				os = document.getElementById(idobjeto).firstChild;
				os = os.getElementsByTagName("div");
			}
			n = os.length;
			if(tipo === "default" || tipo === "pointer" || tipo === "crosshair" || tipo === "help" || tipo === "move" || tipo === "text")
			{cursor = tipo;}
			else
			{c = eval("cursores."+tipo+ext);}
			//testa novamente
			if(c === "default" || c === "pointer" || c === "crosshair" || c === "help" || c === "move" || c === "text")
			{cursor = c;}
			if(cursor === "")
			{cursor = "URL(\""+locaplic+eval("cursores."+tipo+ext)+"\"),auto";}
			for(i=0;i<n;i++){
				o = os[i];
				if(o)
				{o.style.cursor = cursor;}
			}
		}
		catch(e){}
	},
	/*
	Function: criaBox

	Cria um elemento div na pagina atual.

	Esse elemento pode ser utilizado para desenhar retangulos sobre o mapa

	Parametros:

	id {String} - id do elemento que sera criado. Por default, sera 'boxg'
	*/
	criaBox: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.criaBox("+id+")");}
		if(arguments.length === 0)
		{id = "boxg";}
		if (!$i(id))
		{
			var novoel = document.createElement("div");
			novoel.id = id;
			novoel.style.zIndex=1;
			novoel.innerHTML = '<font face="Arial" size=0></font>';
			document.body.appendChild(novoel);
			novoel.onmouseover = function(){novoel.style.display='none';};
			novoel.onmouseout = function(){novoel.style.display='block';};
			i3GEO.util.BOXES.push(id);
		}
		else
		{$i(id).style.display="block";}
	},
	/*
	Function: escondeBox

	Esconde os BOXES com IDs registrados em i3GEO.util.BOXES

	Os ids sao criado pela funcao criaBox
	*/
	escondeBox: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.escondeBox()");}
		var l,i;
		l = i3GEO.util.BOXES.length;
		for (i=0; i<l; i++){
			if($i(i3GEO.util.BOXES[i]))
			{$i(i3GEO.util.BOXES[i]).style.display = "none";}
		}
	},
	/*
	Function: criaPin

	Cria um elemento imagem na pagina atual.

	Parametros:

	id {String} - (opcional) id do elemento que sera criado. Por default, sera 'boxpin'

	imagem {URL} - (opcional) endereco da imagem

	w {String} - (opcional) largura da imagem

	h {String} - (opcional) altura da imagem

	mouseover - funcao que sera executada no evento mouseover
	*/
	criaPin: function(id,imagem,w,h,mouseover){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.criaPin()");}
		if(arguments.length < 1 || id === ""){
			id = "boxpin";
		}
		if(arguments.length < 2 || imagem === ""){
			imagem = i3GEO.configura.locaplic+'/imagens/marker.png';
		}
		if(arguments.length < 3 || w === ""){
			w = 21;
		}
		if(arguments.length < 4 || h === ""){
			h = 25;
		}
		if (!$i(id))
		{
			var novoel = document.createElement("img");
			novoel.id = id;
			novoel.style.zIndex=10000;
			novoel.style.position="absolute";
			novoel.style.width=parseInt(w,10)+"px";
			novoel.style.height=parseInt(h,10)+"px";
			novoel.style.top="0px";
			novoel.style.left="0px";
			novoel.src = imagem;
			if(id === "boxpin")
			{novoel.onmouseover = function(){$i("boxpin").style.display="none";};}
			else if(mouseover){
				novoel.onmouseover = mouseover;
			}
			document.body.appendChild(novoel);
			i3GEO.util.PINS.push(id);
		}
		$i(id).style.display = "block";
	},
	/*
	Function: posicionaImagemNoMapa

	Posiciona uma imagem no mapa no local onde o mouse esta posicionado sobre o mapa

	Parametros:

	id {string} - id do elemento que sera posicionado

	x {posicao do pixel} - se nao for definida ou for vazia, sera utilizado o valor de objposicaocursor.telax

	y {posicao do pixel} - se nao for definida ou for vazia, sera utilizado o valor de objposicaocursor.telay

	Return:

	array[top,left] - valores em pixel da posicao calculada da imagem
	*/
	posicionaImagemNoMapa: function(id,x,y){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.posicionaImagemNoMapa()");}
		var i,mx,my;
		if(x && x != "")
		{objposicaocursor.telax = x;}
		if(y && y != "")
		{objposicaocursor.telay = y;}
		i = $i(id);
		mx = parseInt(i.style.width,10) / 2;
		my = parseInt(i.style.height,10) / 2;
		i.style.position = "absolute";
		i.style.top = objposicaocursor.telay - my + "px";
		i.style.left = objposicaocursor.telax - mx + "px";
		return [objposicaocursor.telay - my,objposicaocursor.telax - mx];
	},
	/*
	Function: escondePin

	Esconde os PINS com IDs registrados em i3GEO.util.PINS

	Os ids sao criados pela funcao criaPin
	*/
	escondePin: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.escondePin()");}
		var l,i;
		l = i3GEO.util.PINS.length;
		for (i=0; i<l; i++){
			if($i(i3GEO.util.PINS[i]))
			{$i(i3GEO.util.PINS[i]).style.display = "none";}
		}
	},
	/*
	Function: $im ou nome curto $im

	Retorna o caminho correto de uma imagem.

	Exemplo: $im("imagem.png")

	Parametros:

	g {String} - nome da imagem

	Retorno:

	string - caminho para a imagem
	*/
	$im: function(g){
		return i3GEO.configura.locaplic+"/imagens/visual/default/"+g;
	},
	/*
	Function $inputText ou nome curto $inputText

	Cria um elemento html do tipo input text com formata&ccedil;&atilde;o especial.

	Parametros:

	idPai {String} - id do elemento pai do input

	larguraIdPai {Integer} - largura em pixel

	idInput {String} - id do objeto input

	titulo {String} - texto que vai no title

	digitos {Integer} - numero de digitos do input

	valor {String} - valor do input

	nome {String} - name do input

	onch {String} - (opcional) string que sera inserida no evento "onchange"

	*/
	$inputText: function(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome,onch) {
		if(arguments.length === 6)
		{nome = "";}
		if(idPai !== ""){
			if(larguraIdPai !== "")
			{$i(idPai).style.width=larguraIdPai+"px";}
			$i(idPai).style.padding="3";
			$i(idPai).style.textAlign="center";
			//$i(idPai).onmouseover = function()
			//{this.className = "digitarMouseover";};
			//$i(idPai).onmouseout = function()
			//{this.className = "";};
		}
		if(!onch)
		{onch = "";}
		return "<input onchange=\""+onch+"\" tabindex='0' onmouseover='javascript:this.className=\"digitarOver\";' onmouseout='javascript:this.className=\"digitar\";' onclick='javascript:this.select();this.className=\"digitarMouseclick\";' id='"+idInput+"' title='"+titulo+"' type='text' size='"+digitos+"' class='digitar' value='"+valor+"' name='"+nome+"' />";
	},
	$inputTextMudaCor: function(obj){
		var n = obj.value.split(" ");
		obj.style.color = "rgb("+n[0]+","+n[1]+","+n[2]+")";
	},
	/*
	Function: $top ou nome curto $top

	Muda a posicao (superior) de um objeto tanto no IE como no Firefox.

	Exemplo: $top("imagem",100)

	Parametros:

	id - identificador do objeto

	valor - posicao em relacao ao topo.
	*/
	$top: function(id,valor){
		if (document.getElementById(id).style){
			if (document.getElementById(id).style.pixelTop)
			{document.getElementById(id).style.pixelTop=valor;}
			else
			{document.getElementById(id).style.top=valor+"px";}
		}
	},
	/*
	Function: $left ou nome curto $left

	Muda a posicao (esquerda) de um objeto tanto no IE como no Firefox.

	Exemplo: $left("imagem",100)

	Parametros:

	id - identificador do objeto

	valor - posicao em relacao a esquerda.
	*/
	$left: function(id,valor){
		if (document.getElementById(id).style){
			if (document.getElementById(id).style.pixelLeft)
			{document.getElementById(id).style.pixelLeft=valor;}
			else
			{document.getElementById(id).style.left=valor+"px";}
		}
	},
	/*
	Function: insereMarca

	Insere ou remove pontos no mapa.
	*/
	insereMarca:{
		/*
		Armazena o valor do ID do div criado para inserir pontos

		Tipo:
		{Array}
		*/
		CONTAINER: [],
		/*
		Function: cria

		Insere um ponto no mapa

		Os pontos sao inseridos em um contaier de pontos e mostrados temporariamente

		Parametros:

		xi {Numeric} - coordenada x no mapa (imagem).

		yi {Numeric} - coordenada y no mapa (imagem).

		funcaoOnclick {String} - funcao que sera executada quando a marca
		for clicada, se for "", o container sera esvaziado ao ser clicado na marca

		container {String} - id do container que recebera os pontos. Se nao existir um elemento com esse ID, sera criado um novo DIV. No caso da interface google Earth, e utilizado na definicao do nome da marca (setname).

		texto {String} - (apenas para interface Google Earth) nome que sera adicionado junto da marca

		srci {string} - (opcional) endereco da imagem (sera incluido em SRC do tag IMG)
		*/
		cria:function(xi,yi,funcaoOnclick,container,texto,srci){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.util.insereMarca.cria()");}
			if(!srci || srci === "")
			{srci = i3GEO.configura.locaplic+"/imagens/dot2.gif";}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				i3GEO.Interface.googleearth.insereMarca(texto,xi,yi,container);
				return;
			}
			try{
				var novoel,i,novoimg,temp;
				if(i3GEO.util.insereMarca.CONTAINER.toString().search(container) < 0)
				{i3GEO.util.insereMarca.CONTAINER.push(container);}
				//verifica se existe o container para os pontos
				if (!$i(container)){
					novoel = document.createElement("div");
					novoel.id = container;
					i = novoel.style;
					i.position = "absolute";
					if($i(i3GEO.Interface.IDCORPO)){
						i.top = parseInt($i(i3GEO.Interface.IDCORPO).style.top,10) + "px";
						i.left = parseInt($i(i3GEO.Interface.IDCORPO).style.left,10) + "px";
					}
					else{
						i.top = parseInt($i(i3GEO.Interface.IDMAPA).style.top,10) + "px";
						i.left = parseInt($i(i3GEO.Interface.IDMAPA).style.left,10) + "px";
					}
					document.body.appendChild(novoel);
				}
				container = $i(container);
				novoel = document.createElement("div");
				i = novoel.style;
				i.position = "absolute";
				i.zIndex=2000;
				i.top=(yi - 2)+"px";
				i.left=(xi - 2)+"px";
				i.width="5px";
				i.height="5px";
				novoimg = document.createElement("img");
				if (funcaoOnclick !== "")
				{novoimg.onclick = funcaoOnclick;}
				else
				{novoimg.onclick=function(){i3GEO.util.insereMarca.limpa();};}
				novoimg.src=srci;
				temp = novoimg.style;
				temp.width="5px";
				temp.height="5px";
				temp.zIndex=2000;
				novoel.appendChild(novoimg);
				container.appendChild(novoel);
				if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.util.insereMarca.limpa()") < 0)
				{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.util.insereMarca.limpa()");}
			}
			catch(e){alert("Ocorreu um erro. inseremarca"+e);}
		},
		limpa: function(){
			try{
				var n,i;
				n = i3GEO.util.insereMarca.CONTAINER.length;
				for(i=0;i<n;i++){
					if($i(i3GEO.util.insereMarca.CONTAINER[i]))
					{$i(i3GEO.util.insereMarca.CONTAINER[i]).innerHTML = "";}
				}
				i3GEO.util.insereMarca.CONTAINER = [];
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.util.insereMarca.limpa()");
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		}
	},
	/*
	Function: adicionaSHP

	Inclui um arquivo shapefile no mapa atual como uma nova camada

	Parametros:

	path {String} - caminho completo do shapefile
	*/
	adicionaSHP: function(path){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.adicionaSHP()");}
		var temp = path.split(".");
		if ((temp[1] === "SHP") || (temp[1] === "shp"))
		{i3GEO.php.adicionaTemaSHP(i3GEO.atualiza,path);}
		else
		{i3GEO.php.adicionaTemaIMG(i3GEO.atualiza,path);}
	},
	/*
	Function: abreCor

	Abre a janela flutuante para escolha de uma cor

	Parametros:

	janelaid {String} - id do conteudo da janela flutuante que chamou a funcao. Pode ser "" caso elemento exista em document

	elemento {String} - id do elemento que recebera os valores da cor selecionada

	tipo {String} - opcional pode ser definido como rgb ou hex indicando o tipo de retorno da cor
	*/
	abreCor: function(janelaid,elemento,tipo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.abreCor()");}
		if(!i3GEO.configura)
		{i3GEO.configura = {locaplic: "../"};}
		if(arguments.length === 2)
		{tipo = "rgb";}
		var janela,
			ins,
			novoel,
			wdocaiframe,
			wsrc = i3GEO.configura.locaplic+"/ferramentas/colorpicker/index.htm?doc="+janelaid+"&elemento="+elemento+"&tipo="+tipo,
			texto = "Cor",
			id = "i3geo_janelaCor",
			classe = "hd";
		if($i(id)){
			YAHOO.i3GEO.janela.manager.find(id).show();
			return;
		}
		ins = '<div id="'+id+'_cabecalho" class="hd">';
		ins += "<span><img id='i3geo_janelaCor_imagemCabecalho' style='visibility:hidden;' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>";
		ins += texto;
		ins += '</div><div id="i3geo_janelaCor_corpo" class="bd" style="padding:5px">';
		if(wsrc !== "")
		{ins += '<iframe name="'+id+'i" id="i3geo_janelaCori" valign="top" style="height:230px,border:0px white solid"></iframe>';}
		ins += '</div>';
		novoel = document.createElement("div");
		novoel.id = "i3geo_janelaCor";
		novoel.style.display="block";
		novoel.innerHTML = ins;
		if($i("i3geo"))
		{$i("i3geo").appendChild(novoel);}
		else
		{document.body.appendChild(novoel);}
		wdocaiframe = $i("i3geo_janelaCori");
		if (wdocaiframe)
		{
			wdocaiframe.style.display = "block";
			wdocaiframe.src = wsrc;
			wdocaiframe.style.height = "230px";
			wdocaiframe.style.width = "325px";
			wdocaiframe.style.border = "0px solid white";
		}
		janela = new YAHOO.widget.ResizePanel(id, { height:"290px",modal:false, width: "350px", fixedcenter: true, constraintoviewport: false, visible: true, iframe:false} );
		YAHOO.i3GEO.janela.manager.register(janela);
		janela.render();
		$i(id+'_cabecalho').className = classe;
	},
	/*
	Function: ajaxhttp

	Cria o objeto XMLHttpRequest para uso com funcoes proprias de chamada em ajax

	O uso dessa funcao nao e recomendado. De preferencia para uso da chamada ajax via YUI

	Return:

	{XMLHttpRequest}
	*/
	ajaxhttp: function(){
		var objhttp1;
		try
		{objhttp1 = new XMLHttpRequest();}
		catch(ee){
			try{objhttp1 = new ActiveXObject("Msxml2.XMLHTTP");}
			catch(e){
				try{objhttp1 = new ActiveXObject("Microsoft.XMLHTTP");}
				catch(E)
				{objhttp1 = false;}
			}
		}
		return(objhttp1);
	},
	/*
	Function: ajaxexecASXml

	Executa uma chamada ajax no modo assincrono retornando o resultado em XML.

	Parametros:

	programa {String} - URL do programa que sera executado no servidor.
	funcao {funcao} - funcao que tratara o resultado.

	Returns:

	O resultado em um objeto DOM. Se o retorno contiver a palavra "Erro", e gerado um alert.
	*/
	ajaxexecASXml: function(programa,funcao){
		var h,ohttp;
		if (programa.search("http") === 0){
			h = window.location.host;
			if (programa.search(h) < 0){
				alert("OOps! Nao e possivel chamar um XML de outro host.\nContacte o administrador do sistema.\nConfigure corretamente o ms_configura.php");
				return;
			}
		}
		ohttp = i3GEO.util.ajaxhttp();
		ohttp.open("GET",programa,true);
		ohttp.onreadystatechange=function(){
			var retorno,parser,dom;
			if (ohttp.readyState === 4){
				retorno = ohttp.responseText;
				if (retorno !== undefined){
					if (document.implementation.createDocument){
						parser = new DOMParser();
						dom = parser.parseFromString(retorno, "text/xml");
					}
					else{
						dom = new ActiveXObject("Microsoft.XMLDOM");
						dom.async="false";
						dom.load(programa);
					}
				}
				else
				{return "erro";}
				if (funcao !== "volta")
				{eval(funcao+'(dom)');}
				else
				{return dom;}
			}
		};
		ohttp.send(null);
	},
	/*
	Function: aparece

	Aplica efeito de aparecimento suave de um objetov

	Parametros:

	id {String} - id do objeto

	tempo {Integer} - tempo em milesegundos que levara o efeito

	intervalo {Integer} - intervalo entre uma imagem e outra
	*/
	aparece: function(id,tempo,intervalo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.aparece("+id+")");}
		var n,obj,opacidade,fadei = 0,tempoFadei = null;
		n = parseInt(tempo / intervalo,10);
		obj = $i(id);
		if(n === 1){
			obj.style.display = "block";
			if (navm)
			{obj.style.filter='alpha(opacity=100)';}
			else
			{obj.style.opacity= 1;}
		}
		tempo = n * intervalo;
		intervalo = (intervalo * 100) / tempo;
		opacidade = 0;
		if (navm)
		{obj.style.filter='alpha(opacity=0)';}
		else
		{obj.style.opacity= 0;}
		obj.style.display = "block";
		fadei = function(){
			opacidade += intervalo;
			if (navm)
			{obj.style.filter='alpha(opacity='+opacidade+')';}
			else
			{obj.style.opacity= opacidade/100;}
			if(opacidade < 100)
			{tempoFadei = setTimeout(fadei, tempo);}
			else{
				if(tempoFadei)
				{clearTimeout(tempoFadei);}
				if (navm)
				{obj.style.filter='alpha(opacity=100)';}
				else
				{obj.style.opacity= 1;}
			}
		};
		tempoFadei = setTimeout(fadei, tempo);
	},
	/*
	Function: desaparece

	Aplica efeito de desaparecimento suave de um objeto

	Parametros:

	id {String} - id do objeto

	tempo {Integer} - tempo em milesegundos que levara o efeito

	intervalo {Integer} - intervalo entre uma imagem e outra

	removeobj {Boolean} - remove ou nao o objeto no final
	*/
	desaparece: function(id,tempo,intervalo,removeobj){
		var n,obj,opacidade,fade = 0,p,tempoFade = null;
		n = parseInt(tempo / intervalo,10);
		obj = $i(id);
		if(n === 1){
			obj.style.display = "none";
			if(removeobj){
				p = obj.parentNode;
				if(p)
				{p.removeChild(obj);}
			}
			return;
		}
		tempo = n * intervalo;
		intervalo = (intervalo * 100) / tempo;
		opacidade = 100;
		if (navm)
		{obj.style.filter='alpha(opacity=100)';}
		else
		{obj.style.opacity= 1;}
		obj.style.display = "block";
		fade = function(){
			opacidade -= intervalo;
			if (navm)
			{obj.style.filter='alpha(opacity='+opacidade+')';}
			else
			{obj.style.opacity= opacidade/100;}
			if(opacidade > 0){
				tempoFade = setTimeout(fade, tempo);
			}
			else{
				if(tempoFade)
				{clearTimeout(tempoFade);}
				obj.style.display = "none";
				if (navm)
				{obj.style.filter='alpha(opacity=100)';}
				else
				{obj.style.opacity= 1;}
				if(removeobj){
					p = obj.parentNode;
					if(p)
					{p.removeChild(obj);}
				}
			}
		};
		tempoFade = setTimeout(fade, tempo);
	},
	/*
	Function: wkt2ext

	Calcula a extensao geografica de uma geometria fornecida no formato WKT

	Parametros:

	wkt {String} - geometria no formato wkt

	tipo {String} - tipo de geometria (polygon,point,line)

	Return:

	{String} - extensao geografica (xmin ymin xmax ymax)
	*/
	wkt2ext:function(wkt,tipo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.wkt2ext()");}
		var re,x,y,w,xMin,xMax,yMin,yMax,temp;
		tipo = tipo.toLowerCase();
		ext = false;
		if(tipo === "polygon"){
			try{
				re = new RegExp("POLYGON", "g");
				wkt = wkt.replace(re,"");
				wkt = wkt.split("(")[2].split(")")[0];
				wkt = wkt.split(",");
				x = [];
				y = [];
				for (w=0;w<wkt.length; w++){
					temp = wkt[w].split(" ");
					x.push(temp[0]);
					y.push(temp[1]);
				}
				x.sort(i3GEO.util.sortNumber);
				xMin = x[0];
				xMax = x[(x.length)-1];
				y.sort(i3GEO.util.sortNumber);
				yMin = y[0];
				yMax = y[(y.length)-1];
				return xMin+" "+yMin+" "+xMax+" "+yMax;
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		}
		if(tipo === "point"){
			try{
				re = new RegExp("POINT", "g");
				wkt = wkt.replace(re,"");
				wkt = wkt.split("(")[1].split(")")[0];
				wkt = wkt.split(" ");
				return (wkt[0]*1 - 0.01)+" "+ (wkt[1]*1 - 0.01) +" "+ (wkt[0]*1+0.01) + " " + (wkt[1]*1+0.01);
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		}
		return ext;
	},
	/*
	Function: sortNumber

	Ordena um array contendo numeros. Deve ser usado como parametro do metodo "sort", exemplo

	y.sort(i3GEO.util.sortNumber), onde y e um array de numeros
	*/
	sortNumber: function(a,b){
		return a - b;
	},
	/*
	Function: getScrollerWidth

	Calcula o tamanho da barra de rolagem, permitindo calcular o tamanho correto da area util do navegador

	http://www.fleegix.org/articles/2006-05-30-getting-the-scrollbar-width-in-pixels

	Return:

	altura
	*/
	getScrollerWidth: function() {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.getScrollerWidth()");}
		var scr = null,
			inn = null,
			wNoScroll = 0,
			wScroll = 0;
		scr = document.createElement('div');
		scr.style.position = 'absolute';
		scr.style.top = '-1000px';
		scr.style.left = '-1000px';
		scr.style.width = '100px';
		scr.style.height = '50px';
		// Start with no scrollbar
		scr.style.overflow = 'hidden';
		// Inner content div
		inn = document.createElement('div');
		inn.style.width = '100%';
		inn.style.height = '200px';
		// Put the inner div in the scrolling div
		scr.appendChild(inn);
		// Append the scrolling div to the doc
		document.body.appendChild(scr);
		// Width of the inner div sans scrollbar
		wNoScroll = inn.offsetWidth;
		// Add the scrollbar
		scr.style.overflow = 'auto';
		// Width of the inner div width scrollbar
		wScroll = inn.offsetWidth;
		// Remove the scrolling div from the doc
		document.body.removeChild(document.body.lastChild);
		// Pixel width of the scroller
		return (wNoScroll - wScroll);
	},
	/*
	Function: scriptTag

	Insere um javascript no documento HTML

	Parametros:

	js {String} - endereco do JS

	ini {String} - funcao que sera executada ao ser carregado o script (pode ser "")

	id - id do elemento script que sera criado

	aguarde {boolean} - mostra ou nao a janela de aguarde
	*/
	scriptTag: function(js,ini,id,aguarde){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.scriptTag()");}
		if(!aguarde){aguarde = false;}
		var head,script,
			tipojanela = i3GEO.janela.ESTILOAGUARDE;

		if(!$i(id) || id === ""){
			if(i3GEO.janela && aguarde === true){
				i3GEO.janela.ESTILOAGUARDE = "reduzida";
				i3GEO.janela.abreAguarde(id+"aguarde","Carregando JS");
			}
			head = document.getElementsByTagName('head')[0];
			script = document.createElement('script');
			script.type= 'text/javascript';
			if(ini !== ""){
				if(navm){
					script.onreadystatechange = function(){
						if(this.readyState === 'loaded' || this.readyState === 'complete')
						{
							if(i3GEO.janela){
								i3GEO.janela.fechaAguarde(id+"aguarde");
							}
							eval(ini);
						}
					};
				}
				else{
					script.onload=function(){
						if(i3GEO.janela){
							i3GEO.janela.fechaAguarde(id+"aguarde");
						}
						eval(ini);
					};
				}
				i3GEO.janela.ESTILOAGUARDE = tipojanela;
			}
			script.src= js;
			if(id !== "")
			{script.id = id;}
			head.appendChild(script);
		}
		else{
			if(ini !== ""){eval(ini);}
		}
	},
	/*
	Function: removeScriptTag

	Remove um javascript no documento HTML

	Parametros:

	id - id do elemento script que sera removido
	*/
	removeScriptTag: function(id){
		try{
			old = $i("loadscriptI3GEO");
			if (old !== null) {
				old.parentNode.removeChild(old);
				old = null;
				eval(id+" = null;");
			}
			old = $i(id);
			if (old !== null) {
				old.parentNode.removeChild(old);
			}
		}
		catch(erro){
			if(typeof(console) !== 'undefined'){console.error(erro);}
		}
	},
	/*
	Function: verificaScriptTag

	Verifica se um javascript esta carregado no documento.

	util para verificar se existe alguma ferramenta ativa ao procurar por i3GEOF.

	Parametros:

	texto - nome do javascript

	Retorno:

	{boolean}
	*/
	verificaScriptTag: function(texto){
		var s = document.getElementsByTagName("script"),
			n = s.length,
			i,
			t;
		try{
			for (i=0;i < n;i++){
				t = s[i].id;
				t = t.split(".");
				//
				//dicionario_script pode ter sido incluido por alguma ferramenta e nao foi removido
				//por isso, caso seja encontrado a funcao retorna false como se o script procurado nao existisse
				//
				if(t[2] && t[2] == "dicionario_script"){
					return false;
				}
				if(t[0] === texto)
				{return true;}
			}
			return false;
		}
		catch(e){return false;}
	},
	/*
	Function: mensagemAjuda

	Formata uma mensagem de texto com icone de ?

	Parametros:

	onde {String} - id do elemento que recebera a mensagem

	texto {String} - texto da mensagem
	*/
	mensagemAjuda: function(onde,texto){
		var ins = "<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 8pt; border: 1px solid #B1CDEB; text-align: left; padding-left: 7px;padding-right: 11px;'>";
		ins += '<div style="float:right"><img src="'+i3GEO.configura.locaplic+'/imagens/question.gif" /></div>';
		ins += '<div style="text-align:left;">';
		if (texto === "")
		{texto = $i(onde).innerHTML;}
		ins += texto;
		ins += '</div></th></tr></table>';
		if (onde !== "")
		{$i(onde).innerHTML = ins;}
		else
		{return(ins);}
	},
	/*
	Function: randomRGB

	Gera uma cor RGB de forma aleatoria

	Return:
	{String} - r,g,b
	*/
	randomRGB: function(){
		var v = Math.random(),
			r = parseInt(255*v,10),
			g;
		v = Math.random();
		g = parseInt(255*v,10);
		v = Math.random();
		b = parseInt(255*v,10);
		return (r+","+g+","+b);
	},
	/*
	Function: rgb2hex

	Converte uma cor RGB para HEX

	Parametro:

	str {String} - r,g,b

	Return:
	{String}
	*/
	rgb2hex: function(str) {
		var re = new RegExp(" ", "g"),
			rgb = str.replace(re,',');
		return YAHOO.util.Dom.Color.toHex("rgb("+rgb+")");
		/*
		function hex(x)  {
			var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"];
			return hexDigits[(x - x % 16) / 16] + hexDigits[x% 16];
		}
		return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
		*/
	},
	/*
	Function: comboTemas

	Cria um combo (caixa de selesao) com a lista de temas existentes no mapa e de determinado tipo

	Parametros:

	id {String} - id do elemento select que sera criado

	funcao {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera
		como parametros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo sera uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.

	nome {String} - valor que sera incluido no parametro "name" do elemento "select".

	multiplo {Booleano} - indica se o combo permite selecoes multiplas

	tipoCombo {String} - Tipo de temas que serao incluidos no combo ligados|selecionados|raster|pontosSelecionados|pontos|linhaDoTempo
	*/
	comboTemas: function(id,funcao,onde,nome,multiplo,tipoCombo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.comboTemas()");}
		if (arguments.length > 2)
		{i3GEO.util.defineValor(onde,"innerHTML","<span style=color:red;font-size:10px; >buscando temas...</span>");}
		if (arguments.length === 3)
		{nome = "";}
		if (arguments.length < 5)
		{multiplo = false;}
		var monta, temp, temp1, temp2;
		monta = function(retorno){
			var i,comboTemas,n,nome = "";
			if (retorno !== undefined)
			{
				if(retorno.data)
				{retorno = retorno.data;}
				n = retorno.length;
				if (n > 0)
				{
					if(multiplo)
					{comboTemas = "<select style='font-size:12px;' id='"+id+"' size='4' multiple='multiple' name='"+nome+"'>";}
					else
					{comboTemas = "<select style='font-size:12px;' id='"+id+"' name='"+nome+"'>";}
					comboTemas += "<option value=''>----</option>";
					for (i=0;i<n;i++){
						if(retorno[i].nome){
							nome = retorno[i].nome;
							tema = retorno[i].tema;
						}
						else{
							nome = retorno[i].tema;
							tema = retorno[i].name;
						}
						if(retorno[i].escondido !== "sim")
						{comboTemas += "<option value="+tema+" >"+nome+"</option>";}
					}
					comboTemas += "</select>";
					temp = {dados:comboTemas,tipo:"dados"};
				}
				else{
					if(tipoCombo === "poligonosSelecionados" || tipoCombo === "selecionados" || tipoCombo ==="pontosSelecionados")
					{temp = {dados:'<div class=alerta >Nenhum tema encontrado. <span style=cursor:pointer;color:blue onclick="i3GEO.mapa.dialogo.selecao()" > Selecionar...</span></div>',tipo:"mensagem"};}
					else
					{temp = {dados:'<div class=alerta >Nenhum tema encontrado. </div>',tipo:"mensagem"};}
				}
			}
			else
			{temp = {dados:"<p style=color:red >Ocorreu um erro<br>",tipo:"erro"};}
			eval("funcao(temp);");
		};
		if(tipoCombo === "ligados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{i3GEO.php.listaTemas(monta,"ligados",i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoCombo === "ligadosComTabela"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				temp1 = i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"menor",temp);
				temp2 = i3GEO.arvoreDeCamadas.filtraCamadas("type",8,"igual",temp);
				monta(temp1.concat(temp2));
			}
			else
			{i3GEO.php.listaTemas(monta,"ligados",i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoCombo === "editaveis"){
			i3GEO.php.listaTemasEditaveis(monta,i3GEO.configura.locaplic,i3GEO.configura.sid);
		}
		if(tipoCombo === "selecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{i3GEO.php.listaTemasComSel(monta,i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoCombo === "raster"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{i3GEO.php.listatemasTipo(monta,"raster",i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoCombo === "pontosSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoCombo === "pontos"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoCombo === "poligonos"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoCombo === "poligonosSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoCombo === "naolinearSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",1,"diferente",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoCombo === "linhaDoTempo"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("linhadotempo","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoCombo === ""){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type","","diferente",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert($trad("x13"));}
		}
	},
	/*
	Function: checkTemas

	Cria uma lista com check box de temas existentes no mapa e de determinado tipo

	Parametros:

	id {String} - id do elemento select que sera criado

	funcao {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera
		como parametros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo sera uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.

	nome {String} - valor que sera incluido no parametro "name" do elemento "select".

	tipoLista {String} - Tipo de temas que serao incluidos na lista ligados|selecionados|raster|pontosSelecionados|pontos|polraster

	prefixo {string} - Prefixo que sera usado no id de cada elemento

	size {numeric} - tamanho dos elementos input editaveis
	*/
	checkTemas: function(id,funcao,onde,nome,tipoLista,prefixo,size){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.checkTemas()");}
		if (arguments.length > 2)
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";}
		if (arguments.length === 3)
		{nome = "";}
		var monta, temp, temp1, n, i;
		monta = function(retorno){
			try{
				var i,comboTemas,n,nome;
				if (retorno !== undefined)
				{
					if(retorno.data)
					{retorno = retorno.data;}
					n = retorno.length;
					if (n > 0)
					{
						comboTemas = "<table class=lista3 >";
						for (i=0;i<n;i++){
							if(retorno[i].nome){
								nome = retorno[i].nome;
								tema = retorno[i].tema;
							}
							else{
								nome = retorno[i].tema;
								tema = retorno[i].name;
							}
							comboTemas += "<tr><td><input size=2 style='cursor:pointer' type=checkbox name='"+tema+"' /></td>";
							comboTemas += "<td>&nbsp;<input style='text-align:left; cursor:text;' onclick='javascript:this.select();' id='"+prefixo+tema+"' type=text size='"+size+"' value='"+nome+"' /></td></tr>";
						}
						comboTemas += "</table>";
						temp = {dados:comboTemas,tipo:"dados"};
					}
					else
					{temp = {dados:'<div class=alerta >Nenhum tema encontrado.</div>',tipo:"mensagem"};}
				}
				else
				{temp = {dados:"<p style=color:red >Ocorreu um erro<br>",tipo:"erro"};}
				eval("funcao(temp);");
			}catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		};
		if(tipoLista === "ligados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{i3GEO.php.listaTemas(monta,"ligados",i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoLista === "selecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{i3GEO.php.listaTemasComSel(monta,i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoLista === "raster"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{i3GEO.php.listatemasTipo(monta,"raster",i3GEO.configura.locaplic,i3GEO.configura.sid);}
		}
		if(tipoLista === "polraster"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				temp1 = i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				n = temp1.length;
				for (i=0;i<n;i++){
					temp.push(temp1[i]);
				}
				monta(temp);
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoLista === "pontosSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert($trad("x13"));}
		}
		if(tipoLista === "pontos"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert($trad("x13"));}
		}
	},
	/*
	Function: comboItens

	Cria um combo (caixa de selecao) com a lista de itens de um layer

	Parametros:

	id {String} - id do elemento select que sera criado

	tema {String} - codigo do tema (layer)

	funcao {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera
		como parametros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo sera uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.

	nome {String} - valor que sera incluido no parametro "name" do elemento "select".
	*/
	comboItens: function(id,tema,funcao,onde,nome){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.comboItens()");}
		if (arguments.length > 3)
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>";}
		if (arguments.length !== 5)
		{nome = "";}

		var monta = function(retorno)
		{
			var ins,temp,i;
			if (retorno.data !== undefined){
				ins = [];
				ins.push("<select  id='"+id+"' name='"+nome+"'>");
				ins.push("<option value='' >---</option>");
				temp = retorno.data.valores.length;
				for (i=0;i<temp; i++){
					if (retorno.data.valores[i].tema === tema)
					{ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>");}
				}
				ins.push("</select>");
				ins = ins.join('');
				temp = {dados:ins,tipo:"dados"};
			}
			else{
				temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};
			}
			eval("funcao(temp)");
		};
		i3GEO.php.listaItensTema(monta,tema);
	},
	/*
	Function: comboValoresItem

	Cria uma caixa de selecao com os valores de um item de um tema

	Parametros:

	id {String} - id do elemento select que sera criado

	tema {String} - codigo do tema (layer)

	itemTema {String} - nome do item

	funcao {Function} - funcao que sera executada ao terminar a montagem do combo. Essa funcao recebera
		como parametros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo sera uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	*/
	comboValoresItem: function(id,tema,itemTema,funcao,onde){
		if (arguments.length === 5)
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando valores...</span>";}
		var monta = function(retorno){
			var ins = [],
				i,
				pares,
				j,
				temp;
			if (retorno.data !== undefined){
				ins.push("<select  id="+id+" >");
				ins.push("<option value='' >---</option>");
				for (i=0;i<retorno.data[1].registros.length; i++){
					pares = retorno.data[1].registros[i].valores;
					for (j=0;j<pares.length;j++)
					{ins.push("<option value='"+pares[j].valor+"' >"+pares[j].valor+"</option>");}
				}
				ins.push("</select>");
				ins = ins.join('');
				temp = {dados:ins,tipo:"dados"};
			}
			else
			{temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
			funcao.apply(funcao,temp);
		};
		i3GEO.php.listaValoresItensTema(monta,tema,itemTema);
	},
	/*
	Function: comboFontes

	Cria um combo (caixa de selecao) com a lista fontes de texto disponiveis

	Parametros:

	id {String} - id do elemento select que sera criado

	onde {String} - id do elemento HTML que recebera o combo. e utilizado apenas para inserir uma mensagem de aguarde.
	*/
	comboFontes: function(id,onde){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.comboFontes()");}
		$i(onde).innerHTML = "<span style=color:red >buscando fontes...</span>";
		var monta = function(retorno){
			var ins = "",temp,i,dados;
			if (retorno.data !== undefined){
				ins += "<select  id='"+id+"'>";
				ins += "<option value='bitmap' >bitmap</option>";
				dados = retorno.data.split(",");
				temp = dados.length;
				for (i=0;i<temp; i++){
					ins += "<option value='"+dados[i]+"' >"+dados[i]+"</option>";
				}
				ins += "</select>";
			}
			$i(onde).innerHTML = ins;
		};
		i3GEO.php.listaFontesTexto(monta);
	},
	/*
	Function: comboSimNao

	Cria uma caixa de selecao com as palavras sim e nao

	Parametros:

	id [String} - id do elemento select que sera criado

	selecionado {string} - qual valor estara selecionado sim|nao

	Return:
	{string}
	*/
	comboSimNao: function(id,selecionado){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.comboSimNao()");}
		var combo = "<select name="+id+" id="+id+" >";
		combo+= "<option value='' >---</option>";
		if(selecionado.toLowerCase() === "sim")
		{combo+= "<option value=TRUE selected >"+$trad("x14")+"</option>";}
		else
		{combo+= "<option value=TRUE >"+$trad("x14")+"</option>";}
		if(selecionado === "nao")
		{combo += "<option value=FALSE selected >"+$trad("x15")+"</option>";}
		else
		{combo += "<option value=FALSE >"+$trad("x15")+"</option>";}
		combo += "</select>";
		return(combo);
	},
	/*
	Function: checkItensEditaveis

	Cria uma lista de elementos do tipo input com textos editaveis contendo a lista de itens de um tema.

	Parametros:

	tema {string} - codigo do layer existente no mapa

	funcao {function} - funcao que sera executada para montar a lista. Essa funcao recebera
	como parametro um array do tipo {dados:ins,tipo:"dados"}
	onde ins e um array com as linhas e tipo e o tipo de resultado, que pode ser "dados"|"erro"

	onde {string} - id do elemento que recebera a mensagem de aguarde

	size {numeric} - tamanho dos elementos input editaveis

	prefixo {string} - Prefixo que sera usado no id de cada elemento
	*/
	checkItensEditaveis: function(tema,funcao,onde,size,prefixo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.checkItensEditaveis()");}
		if (onde !== "")
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>";}
		var monta = function(retorno)
		{
			var ins = [],
				i,
				temp,
				n;
			if (retorno.data !== undefined)
			{
				ins.push("<table class=lista3 >");
				n = retorno.data.valores.length;
				for (i=0;i<n; i++){
					ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+prefixo+retorno.data.valores[i].item+"' /></td>");
					ins.push("<td><input style='text-align:left; cursor:text;' onclick='javascript:this.select();' id='"+prefixo+retorno.data.valores[i].item+retorno.data.valores[i].tema+"' type=text size='"+size+"' value='"+retorno.data.valores[i].item+"' /></td></tr>");
				}
				ins.push("</table>");
				ins = ins.join('');
				temp = {dados:ins,tipo:"dados"};
			}
			else
			{temp = {dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
			funcao.apply(funcao,temp);
		};
		i3GEO.php.listaItensTema(monta,tema);
	},
	/*
	Function: radioEpsg

	Cria uma lista de codigos EPSG para o usuario escolher um deles.

	A lista e mostrada como uma serie de elementos do tipo radio com "name" igual ao prefixo mais a palavra EPSG

	Parametros:

	funcao {function} - funcao que sera executada para montar a lista. Essa funcao recebera
	como parametro um array do tipo {dados:ins,tipo:"dados"}
	onde ins e um array com as linhas e tipo e o tipo de resultado, que pode ser "dados"|"erro"

	onde {string} - id do elemento que recebera a mensagem de aguarde

	prefixo {string} - Prefixo que sera usado no name de cada elemento
	*/
	radioEpsg: function (funcao,onde,prefixo){
		if (arguments.length === 2)
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando...</span>";}
		var monta = function(retorno){
			var ins = [],
				i,n,temp;
			if (retorno.data !== undefined){
				ins.push("<table class=lista2 >");
				ins.push("<tr><td><input size=2 style='border:0px solid white;cursor:pointer' name='"+prefixo+"EPSG' type=radio checked value='' /></td>");
				ins.push("<td>"+retorno.data[0].nome+"</td></tr>");
				ins.push("<tr><td><input size=2 style='border:0px solid white;cursor:pointer' name='"+prefixo+"EPSG' type=radio value='' /></td>");
				ins.push("<td>"+retorno.data[1].nome+"</td></tr>");
				n = retorno.data.length;
				for (i=2;i<n; i++){
					ins.push("<tr><td><input size=2 style='border:0px solid white;cursor:pointer' name='"+prefixo+"EPSG' type=radio value='"+retorno.data[i].codigo+"' /></td>");
					ins.push("<td>"+retorno.data[i].nome+"</td></tr>");
				}
				ins.push("</table>");
				ins = ins.join('');
				temp = {dados:ins,tipo:"dados"};
			}
			else
			{temp = {dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
			funcao(temp);
		};
		i3GEO.php.listaEpsg(monta);
	},
	/*
	Function: proximoAnterior

	Cria uma sequencia de opcoes com botao de anterior e proximo. e utilizado principalmente pelas
	ferramentas de analise espacial, onde o usuario segue uma sequencia de operacoes de escolha
	de parametros.

	Parametros:

	anterior {String} - nome da funcao que e executada para voltar a tela anterior. Pode ser "".

	proxima {String} - nome da funcao que e executada para avancar para a proxima tela. Pode ser "".

	texto {String} - texto que compora a tela atual

	idatual {String} - id do elemento DIV que sera criado para inserir o conteudo definido em 'texto"

	container {String} - id do elemento DIV ja existente que recebera as telas.
	*/
	proximoAnterior: function(anterior,proxima,texto,idatual,container,mantem){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.proximoAnterior()");}
		var temp = $i(idatual),
			ndiv = document.createElement("div"),
			nids,
			i,
			fundo;
		if(!mantem){
			mantem = false;
		}
		if(temp && mantem == false){$i(container).removeChild(temp);}
		if (!document.getElementById(idatual))
		{
			fundo = $i(container).style.backgroundColor;
			ndiv.id = idatual;
			texto += "<br><br><table style='width:100%;background-color:"+fundo+";' ><tr style='width:100%'>";
			if (anterior !== "")
			{texto += "<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:"+fundo+";'><input id='"+idatual+"anterior_' onclick='"+anterior+"' type='button' value='&nbsp;&nbsp;' /></td>";}
			if (proxima !== "")
			{texto += "<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:"+fundo+";'><input id='"+idatual+"proxima_' onclick='"+proxima+"' type='button' value='&nbsp;&nbsp;' /></td>";}
			ndiv.innerHTML = texto+"</tr></table>";

			$i(container).appendChild(ndiv);

			new YAHOO.widget.Button(idatual+"anterior_",{
				onclick:{fn: function(){
					eval(anterior+"()");
				},
				lazyloadmenu:true
			}});
			new YAHOO.widget.Button(idatual+"proxima_",
				{onclick:{fn: function(){
					eval(proxima+"()");
				},
				lazyloadmenu:true
			}});
			i = $i(idatual+"proxima_-button");
			if(i){
				i.style.backgroundImage = "url('"+i3GEO.configura.locaplic+"/imagens/player_avanca.png')";
				i.style.backgroundRepeat = "no-repeat";
				i.style.backgroundPosition = "center center";
			}
			i = $i(idatual+"anterior_-button");
			if(i){
				i.style.backgroundImage = "url('"+i3GEO.configura.locaplic+"/imagens/player_volta.png')";
				i.style.backgroundRepeat = "no-repeat";
				i.style.backgroundPosition = "center center";
			}
		}
		temp = $i(container).getElementsByTagName("div");
		nids = temp.length;
		for (i=0;i<nids;i++){
			temp[i].style.display="none";
		}
		$i(idatual).style.display="block";
	},
	/*
	Function: dialogoFerramenta

	Atalho para abrir a janela de dialogo de uma ferramenta padrao

	O script adicionado tera como ID "i3GEOF."+nome+"_script"

	Parametros:

	mensagem {string} - mensagem que sera enviada ao console no caso do Firefox

	dir {string} - diretorio em i3geo/ferramentas

	nome {string} - nome da classe da ferramenta
	*/
	dialogoFerramenta: function(mensagem,dir,nome){
		if(typeof(console) !== 'undefined'){console.info(mensagem);}
		var js = i3GEO.configura.locaplic+"/ferramentas/"+dir+"/index.js";
		if(!$i("i3GEOF."+nome+"_script")){
			i3GEO.janela.ESTILOAGUARDE = "reduzida";
			i3GEO.util.multiStep(
				[i3GEO.janela.abreAguarde,i3GEO.util.scriptTag],
				[["i3GEOF."+nome+"_script"+"aguarde","Carregando JS"],[js,"i3GEOF."+nome+".criaJanelaFlutuante()","i3GEOF."+nome+"_script"]],
				function(){}
			);
		}
		else
		{i3GEO.util.scriptTag(js,"i3GEOF."+nome+".criaJanelaFlutuante()","i3GEOF."+nome+"_script");}
	},
	/*
	Function: intersectaBox

	Verifica se um retangulo esta dentro de outro retangulo

	Parametros:

	box1 - retangulo que sera verificado

	box2 - retangulo de referencia

	Return:

	boolean
	*/
	intersectaBox: function(box1,box2){
		box1 = box1.split(" ");
		box2 = box2.split(" ");
		var	box1i = box2,
			box2i = box1,
			coordx,
			coordy;
		coordx = box1[0]*1;
		coordy = box1[1]*1;
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1){
			return true;
			coordx = box1[0]*1;
			coordy = box1[3]*1;
		}
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1)
		{return true;}
		coordx = box1[2]*1;
		coordy = box1[3]*1;
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1)
		{return true;}
		coordx = box1[2]*1;
		coordy = box1[1]*1;
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1)
		{return true;}

		box1 = box1i;
		box2 = box2i;

		coordx = box1[0]*1;
		coordy = box1[1]*1;
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1){
			return true;
			coordx = box1[0]*1;
			coordy = box1[3]*1;
		}
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1)
		{return true;}
		coordx = box1[2]*1;
		coordy = box1[3]*1;
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1)
		{return true;}
		coordx = box1[2]*1;
		coordy = box1[1]*1;
		if(coordx >= box2[0]*1 && coordx <= box2[2]*1 && coordy >= box2[1]*1 && coordy <= box2[3]*1)
		{return true;}

		return false;
	},
	/*
	Function: abreColourRamp

	Abre a janela flutuante para escolha de um degrade de cores

	Parametros:

	janelaid {String} - id do conteudo da janela flutuante que chamou a funcao. Pode ser "" caso elemento exista em document

	elemento {String} - id do elemento que recebera os valores da cor selecionada

	ncores {numerico} - numero de cores default ao abrir  o seletor de cores
	*/
	abreColourRamp: function(janelaid,elemento,ncores){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.abreColourRamp()");}
		var janela,
			ins,
			novoel,
			wdocaiframe,
			fix = false,
			wsrc = i3GEO.configura.locaplic+"/ferramentas/colourramp/index.php?ncores="+ncores+"&doc="+janelaid+"&elemento="+elemento, //+janela+"&elemento="+elemento+"&tipo="+tipo,
			nx = "",
			texto = "Cor",
			id = "i3geo_janelaCorRamp",
			classe = "hd";
		if($i(id)){
			janela = YAHOO.i3GEO.janela.manager.find(id);
			janela.show();
			janela.bringToTop();
			return;
		}
		ins = '<div id="'+id+'_cabecalho" class="hd">';
		ins += "<span><img id='i3geo_janelaCorRamp_imagemCabecalho' style='visibility:hidden;' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>";
		ins += texto;
		ins += '</div><div id="i3geo_janelaCorRamp_corpo" class="bd" style="padding:5px">';
		ins += '<iframe name="'+id+'i" id="i3geo_janelaCorRampi" valign="top" ></iframe>';
		ins += '</div>';
		novoel = document.createElement("div");
		novoel.id = "i3geo_janelaCorRamp";
		novoel.style.display="block";
		novoel.innerHTML = ins;
		if($i("i3geo"))
		{$i("i3geo").appendChild(novoel);}
		else
		{document.body.appendChild(novoel);}
		wdocaiframe = $i("i3geo_janelaCorRampi");
		wdocaiframe.style.display = "block";
		wdocaiframe.src = wsrc;
		wdocaiframe.style.height = "430px";
		wdocaiframe.style.width = "340px";
		wdocaiframe.style.border = "0px solid white";

		if(nx === "" || nx === "center"){fix = true;}
		janela = new YAHOO.widget.ResizePanel(id, { height:"480px",modal:false, width: "380px", fixedcenter: fix, constraintoviewport: false, visible: true, iframe:false} );
		YAHOO.i3GEO.janela.manager.register(janela);
		janela.render();
		$i(id+'_cabecalho').className = classe;
	},
	/*
	Function: localizai3GEO

	Tenta identificar onde os JS do i3Geo estao localizados

	Aplica o resultado a variavel i3GEO.configura.locaplic

	Return:

	{string} - url onde esta instalado o i3geo
	*/
	localizai3GEO: function(){
		var scriptLocation = "",
			scripts = document.getElementsByTagName('script'),
			i = 0,
			index,
			ns = scripts.length,
			src;
		for (i = 0; i < ns; i++) {
			src = scripts[i].getAttribute('src');
			if (src) {
				index = src.lastIndexOf("/classesjs/i3geo.js");
				// is it found, at the end of the URL?
				if ((index > -1) && (index + "/classesjs/i3geo.js".length === src.length)) {
					scriptLocation = src.slice(0, -"/classesjs/i3geo.js".length);
					break;
				}
				index = src.lastIndexOf("/classesjs/i3geonaocompacto.js");
				if ((index > -1) && (index + "/classesjs/i3geonaocompacto.js".length === src.length)) {
					scriptLocation = src.slice(0, -"/classesjs/i3geonaocompacto.js".length);
					break;
				}
			}
		}
		if(i3GEO.configura)
		{i3GEO.configura.locaplic = scriptLocation;}
		return scriptLocation;
	},
	/*
	Function: removeChild

	Remove um filho de um elemento DOM

	Pode-se especificar o pai e o filha a ser removido ou simplesmente o ID do no que se quer remover

	Parametros:

	id {string} - id do elemento que sera removido (filho)

	el {node} - (opcional) node (DOM) que contem o elemento. Se nao for definido, sera obtido o parent de id
	*/
	removeChild: function(id,el){
		var j = $i(id);
		if(j){
			if(!el){
				el = j.parentNode;
			}
			el.removeChild(j);
		}
	},
	/*
	Function: defineValor

	Aplica um valor a uma propriedade de um elemento

	Parametros:

	id {string} - id do elemento que sera removido (filho)

	prop {string} - propriedade que recebera o valor

	valor {string} - valor que sera aplicado
	*/
	defineValor: function(id,prop,valor){
		try
		{eval("$i('"+id+"')."+prop+"='"+valor+"';");}
		catch(e){}
	},
	/*
	Function: in_array

	Procura a ocorrencia de um elemento em um array

	Parametros:

	x - o que sera procurado

	matriz - array

	Return:

	{boolean}
	*/
	in_array: function(x, matriz){
		var txt = " " + matriz.join(" ") + " ";
		var er = new RegExp (" " + x + " ", "gim");
		return ( (txt.match (er)) ? true : false );
	},
	timedProcessArray: function(items,process,callback){
		var todo = items.concat();
		setTimeout(function() {
			var start = +new Date();
			do{
				process(todo.shift());
			} while (todo.length > 0 && (+new date() - start < 50));
			if (todo.length > 0){
				setTimeout(arguments.callee,25);
			}
			else{
				callback(items);
			}
		},25);
	},
	/*
	Function: multiStep

	Implementa a tecnica de particionamento para execussao de funcoes no modo assincrono

	Conforme pagina 144 do livro "Javascript de alto desempenho, Nicholas Zakas

	Parametros:

	steps {array} - funcoes que serao executadas

	args {array} - array de arrays com os argumentos de cada funcao

	callback {function} - funcao que sera executada ao terminar os processos
	*/
	multiStep: function(steps,args,callback){
		var tasks = steps.concat();//cria um clone
		setTimeout(function(){
			var task = tasks.shift(),
				a = args.shift();
			task.apply(null, a || []);
			if(tasks.length > 0){
				setTimeout(arguments.callee,25);
			} else {
				callback();
			}
		},25);
	},
	/*
	Function: tamanhoBrowser

	Calcula o tamanho da area util do navegador considerando-se as propriedades nativas do objeto window

	Return:
	{[w,h]}
	*/
	tamanhoBrowser: function(){
		var viewportwidth,viewportheight;
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if (typeof window.innerWidth != 'undefined')
		{
			viewportwidth = window.innerWidth,
			viewportheight = window.innerHeight;
		}

		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

		else if (typeof document.documentElement != 'undefined'
		&& typeof document.documentElement.clientWidth !=
		'undefined' && document.documentElement.clientWidth != 0)
		{
			viewportwidth = document.documentElement.clientWidth,
			viewportheight = document.documentElement.clientHeight;
		}

		// older versions of IE

		else
		{
			viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
			viewportheight = document.getElementsByTagName('body')[0].clientHeight;
		}
		viewportwidth = viewportwidth - i3GEO.util.getScrollerWidth();
		return [viewportwidth,viewportheight];
	},
	/*
	Function: detectaTablet

	Verifica se esta em uso um dispositivo do tipo movel

	Se for detectado, utiliza a interface alternativa definida em i3GEO.Interface.ALTTABLET

	A deteccao e feita com base em i3geo/pacotes/mobileesp/mdetect.js
	*/
	detectaTablet: function(){
		var p,
			c = DetectaMobile("DetectMobileLong");
		if(c === false)
		{return false;}
		p = confirm("Direciona para a versao adaptada para tablets?");
		if(p){
			window.location = i3GEO.configura.locaplic+'/interface/'+i3GEO.Interface.ALTTABLET+'?'+i3GEO.configura.sid;
			return true;
		}
	},
	/*
	Function: calculaDPI

	Calcula o valor de DPI do monitor.

	O valor e aproximado e utilizado principalmente na interface OpenLayers
	*/
	calculaDPI: function(){
		var novoel = document.createElement("div"),
			valor = 72;
		//novoel.id = 'testeCalculaDPI';
		novoel.style.height = "1in";
		novoel.style.left = "-100%";
		novoel.style.position = "absolute";
		novoel.style.top = "-100%";
		novoel.style.width = "1in";
		document.body.appendChild(novoel);
		if(novoel.offsetHeight)
		{valor = novoel.offsetHeight;}
		document.body.removeChild(novoel);
		return valor;
	},
	/*
	Function: ajustaDocType

	Ajusta o DOCTYPE do HTML para funcionar com CSS3
	*/
	ajustaDocType: function(){
		try{
			if(document.implementation.createDocumentType){
				var newDoctype = document.implementation.createDocumentType(
					'html',
					'-//W3C//DTD XHTML 1.0 Transitional//EN',
					'http://www.w3.org/TR/html4/loose.dtd'
				);
				if (document.doctype) {
					document.doctype.parentNode.replaceChild(newDoctype, document.doctype);
				}
			}
		}
		catch(e){}
	},
	/*
	Function: versaoNavegador

	Retorna algumas versoes de navegador
	*/
	versaoNavegador: function(){
		if(navm && navigator.userAgent.toLowerCase().indexOf('msie 8.') > -1)
		{return "IE8";}
		if(navn && navigator.userAgent.toLowerCase().indexOf('3.') > -1)
		{return "FF3";}
		return "";
	},
	/*
	Function: decimalPlaces

	Arredonda um numero

	Obtido de

		http://stackoverflow.com/questions/4868556/how-do-i-stop-parsefloat-from-stripping-zeroes-to-right-of-decimal/4868718#4868718


	Parameters:

	float {numer} - numero que sera arredondado

	length {number} - numero de casas decimais
	*/
	decimalPlaces: function(float,length) {
		var ret = "",
			str = float.toString(),
			array = str.split("."),
			i;
		if(array.length==2) {
			ret += array[0] + ".";
			for(i=0;i<length;i++) {
				if(i>=array[1].length) ret += '0';
				else ret+= array[1][i];
			}
		}
		else if(array.length == 1) {
			ret += array[0] + ".";
			for(i=0;i<length;i++) {
				ret += '0';
			}
		}
		return ret;
	},
	ajaxGet: function(sUrl,funcaoRetorno){
		var falhou = function(e){
				alert(e);
			},
			callback = {
		  		success:function(o){
		  			try	{
		  				funcaoRetorno.call("",YAHOO.lang.JSON.parse(o.responseText));
		  			}
		  			catch(e){
		  				falhou(e);
		  			}
		  		},
		  		failure:falhou,
		  		argument: { foo:"foo", bar:"bar" }
			};
		YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
	}
};
//
// YUI ACCORDION
// 1/22/2008 - Edwart Visser
//
// accordion
//
// REQUIRES: yahoo-dom-event.js, animation-min.js
//
//
try{
	YAHOO.namespace("lutsr");
	YAHOO.lutsr.accordion = {
		properties : {
			animation : true,
			animationDuration : 10,
			multipleOpen : false,
			Id: "sanfona",
			altura: 200,
			ativa: 0
		},

		init : function(animation,animationDuration,multipleOpen,Id,altura,ativa) {
			if(animation) {
				this.properties.animation = animation;
			}
			if(animationDuration) {
				this.properties.animationDuration = animationDuration;
			}
			if(multipleOpen) {
				this.properties.multipleOpen = multipleOpen;
			}
			if(Id) {
				this.properties.Id = Id;
			}
			if(altura) {
				this.properties.altura = altura;
			}
			if(ativa) {
				this.properties.ativa = ativa;
			}
			var accordionObject = document.getElementById(this.properties.Id),
				headers;
			if(accordionObject) {
				if(accordionObject.nodeName === "DL") {
					headers = accordionObject.getElementsByTagName("dt");
					this.attachEvents(headers,0);
				}
			}
		},
		attachEvents : function(headers,nr) {
			var i,headerProperties,parentObj,header;
			for(i=0; i<headers.length; i++) {
				headerProperties = {
					objRef : headers[i],
					nr : i,
					jsObj : this
				};
				YAHOO.util.Event.addListener(headers[i],"click",this.clickHeader,headerProperties);
			}
			parentObj = headers[this.properties.ativa].parentNode;
			headers = parentObj.getElementsByTagName("dd");
			header = headers[this.properties.ativa];

			this.expand(header);
		},

		clickHeader : function(e,headerProperties) {
			var parentObj = headerProperties.objRef.parentNode,
				headers = parentObj.getElementsByTagName("dd"),
				header = headers[headerProperties.nr],
				i;

			if(YAHOO.util.Dom.hasClass(header,"open")) {
				headerProperties.jsObj.collapse(header);
			} else {
				if(headerProperties.jsObj.properties.multipleOpen) {
					headerProperties.jsObj.expand(header);
				} else {
					for(i=0; i<headers.length; i++) {
						if(YAHOO.util.Dom.hasClass(headers[i],"open")) {
							headerProperties.jsObj.collapse(headers[i]);
						}
					}
					headerProperties.jsObj.expand(header);
				}
			}
		},
		collapse : function(header) {
			YAHOO.util.Dom.removeClass(YAHOO.util.Dom.getPreviousSibling(header),"selected");
			if(!this.properties.animation) {
				YAHOO.util.Dom.removeClass(header,"open");
			} else {
				this.initAnimation(header,"close");
			}
		},
		expand : function(header) {
			YAHOO.util.Dom.addClass(YAHOO.util.Dom.getPreviousSibling(header),"selected");
			if(!this.properties.animation) {
				YAHOO.util.Dom.addClass(header,"open");
			} else {
				this.initAnimation(header,"open");
			}
		},
		initAnimation : function(header,dir) {
			var attributes,animation,animationEnd;
			if(dir === "open") {
				YAHOO.util.Dom.setStyle(header,"visibility","hidden");
				YAHOO.util.Dom.setStyle(header,"height",this.properties.altura);
				YAHOO.util.Dom.addClass(header,"open");
				attributes = {
					height : {
						from : 0,
						to : this.properties.altura
					}
				};
				YAHOO.util.Dom.setStyle(header,"height",0);
				YAHOO.util.Dom.setStyle(header,"visibility","visible");
				animation = new YAHOO.util.Anim(header,attributes);
				animationEnd = function() {
					//alert(this.properties.altura+"px")
					header.style.height = this.properties.altura+"px";
				};
				animation.duration = this.properties.animationDuration;
				animation.useSeconds = false;
				animation.onComplete.subscribe(animationEnd);
				animation.animate();
			} else if ("close") {
				attributes = {
					height : {
						to : 0
					}
				};
				animationEnd = function() {
					YAHOO.util.Dom.removeClass(header,"open");
				};
				animation = new YAHOO.util.Anim(header,attributes);
				animation.duration = this.properties.animationDuration;
				animation.useSeconds = false;
				animation.onComplete.subscribe(animationEnd);
				animation.animate();
			}
		}
	};
}
catch(e){}
//
//alias
//
$im = function(g){
	return i3GEO.util.$im(g);
};
$inputText = function(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome,onch){
	if(arguments.length === 6)
	{nome = "";}
	return i3GEO.util.$inputText(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome,onch);
};
$top = function(id,valor){
	i3GEO.util.$top(id,valor);
};
$left = function(id,valor){
	i3GEO.util.$left(id,valor);
};