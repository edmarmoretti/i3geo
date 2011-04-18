/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Utilitários

Arquivo:

i3geo/classesjs/classe_util.js

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
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
var app = navigator.appName.substring(0,1);
if (app==='N'){navn=true;}
if (app==='M'){navm=true;}
if(opera === true)
{navn = true;}
/*
Variavel: g_operacao

Nome da última operação que foi executada.

Dependendo do tipo de operação são aplicadas as atualizações necessárias aos componentes do mapa. Por exemplo, redesenha o corpo do mapa, atualiza a lista de temas, etc.

Essas operações são controladas pela função ajaxiniciaparametros.
*/
g_operacao = "";
/*
Variavel: g_tipoacao

Tipo de ação que está sendo executada.
Quando o usuário clica no mapa, essa variável é pesquisada para definir o tipo de operação que deve ser executada.
É definida quando o usuário seleciona uma determinada ferramenta do i3Geo.
*/
g_tipoacao = "zoomli";

/*
g_postpx = "px";
g_tipotop = "top";
g_tipoleft = "left";
if (navm)
{
	g_postpx = "";  //utilizado para crossbrowser
	g_tipotop = "pixelTop"; //utilizado para crossbrowser
	g_tipoleft = "pixelLeft"; //utilizado para crossbrowser
}
*/
/*
Function: $i

Obtém um elemento DOM a partir de seu id
  
Parametros:

id - {String} ID do elemento.

Returns:

{Object} Objeto.
*/
$i = function(id)
{return document.getElementById(id);};
/*
Function: Array.remove()

Extende os métodos de um objeto Array, permitindo remover um elemento.

*/
Array.prototype.remove=function(s){
	try{
		//var i = this.indexOf(s);
		//if(i !== -1){this.splice(i, 1);}
		var n = this.length,i;
		for(i=0;i<n;i++){
			if(this[i] == s)
			{this.splice(i, 1);}
		}
	}catch(e){}
};

/*
Classe: i3GEO.util

Utilitários.
*/
i3GEO.util = {
	/*
	Variavel: PINS

	Elementos IMG criados na função criaPin

	Tipo:
	{Array}
	*/
	PINS: [],
	/*
	Variavel:BOXES

	Elementos DIV criados na função criaBox

	Tipo:
	{Array}
	*/
	BOXES: [],
	/*
	Function: escapeURL

	Converte uma string em uma url válida

	Parametros:

	sUrl {String} - url que será convertida

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

	valor - (String) Valor do cookie
	*/
	insereCookie: function(nome,valor) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.insereCookie()");}
		document.cookie = nome+"="+valor+";path=/";
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
		var keys,key;
		keys = [];
		for(key in obj){
			if(obj[key])
			{keys.push(key);}
		}
		return keys;
	},
	/*
	Function: criaBotaoAplicar

	Cria um botão flutuante do tipo aplicar.

	O novo botão é adicionado no DOM com ID "i3geo_aplicar" e posicionado sobre o objeto definido
   
	Parametros:

	nomeFuncao - {String} Nome da função que será executada quando o botão for cllicado

	titulo - (opcional) {String} Título que será mostrado no botão

	classe - (opcional) {String} Nome da classe (estilo) que será aplicado ao botão.

	obj - (opcional) {Objeto} Objeto DOM que foi clicado para provocar a criação do botão.

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
		autoRedesenho("reinicia");
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

	Cria uma árvore com base em um objeto contendo aspropriedades.

	No objeto com as propriedades, se "url" for igual a "", será incluído o texto original definido em "text".

	Caso contrário, o valor de "text" será traduzido com $trad(). Nesse caso, utilize em "text" o código definido em dicionario.js

	Parametros:

	titulo - {String} cabeçaljo da árvore

	onde - {String} nome do id doelemento que conterá a árvore

	obj - {Object} objeto contendo os parâmetros, exemplo

		g_listaPropriedades = {

		"propriedades": [

		{ text: "p2", url: "javascript:tipoimagem()" }

		]}

	*/
	arvore: function(titulo,onde,obj){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.arvore()");}
		//YAHOO.log("arvore", "i3geo");
		var arvore,root,tempNode,currentIconMode,d,c,i,linha,conteudo;
		if(!$i(onde)){return;}
		try{
			arvore = new YAHOO.widget.TreeView(onde);
			root = arvore.getRoot();
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
		re = /ã|á|à|â/gi;
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

	Obtém o protocolo utilizado na URL atual

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

	Retorna a posição x,y de um objeto em relação a tela do navegador

	Parametros:

	obj {Object} - objeto dom

	Return:

	{Array} - array com a posição [x,y]
	*/
	pegaPosicaoObjeto: function(obj){
		if(obj)
		{
			if(!obj.style)
			{return [0,0];}
			var curleft = 0,curtop = 0,teste;
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

		Pega o elemento pai de um elemento clicado para identificar o código do tema.

		Parametros:

		e - elemento do DOM.

		Return:

		{Node} - objeto DOM
	*/
	pegaElementoPai: function(e){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.pegaElementoPai()");}
		var targ;
		if (!e)
		{e = window.event;}
		if (e.target)
		{targ = e.target;}
		else
		if (e.srcElement)
		{targ = e.srcElement;}
		if (targ.nodeType === 3)
		{targ = targ.parentNode;}
		tparent=targ.parentNode;
		return(tparent);
	},
	/*
	Function: mudaCursor

	Altera o cursor do ponteiro do mouse.

	Os cursores disponíveis são definidos por default em classe_configura.js

	Parametros:

	cursores {i3GEO.configura.cursores} - objeto JSON com as URIs de cada cursor (veja i3GEO.configura.cursores)

	tipo {String} - tipo de cursor disponível em cursores

	idobjeto {String} - id do objeto que terá o estilo alterado para o cursor desejado

	locaplic {String} - onde está instalado o i3Geo
	*/
	mudaCursor: function(cursores,tipo,idobjeto,locaplic){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.mudaCursor("+idobjeto+")");}
		var os = [],
			o,
			i,
			c,
			n,
			layers,
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

	Cria um elemento div na página atual.

	Esse elemento pode ser utilizado para desenhar retângulos sobre o mapa

	Parametros:

	id {String} - id do elemento que será criado. Por default, será 'boxg'
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

	Os ids são criado pela função criaBox
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

	Cria um elemento imagem na página atual.

	Parametros:

	id {String} - (opcional) id do elemento que será criado. Por default, será 'boxpin'

	imagem {URL} - (opcional) endereço da imagem

	w {String} - (opcional) largura da imagem

	h {String} - (opcional) altura da imagem

	mouseover - função que será executada no evento mouseover
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
			w = "21px";
		}
		if(arguments.length < 4 || h === ""){
			h = "25px";
		}
		if (!$i(id))
		{
			var novoel = document.createElement("img");
			novoel.id = id;
			novoel.style.zIndex=10000;
			novoel.style.position="absolute";
			novoel.style.width=w;
			novoel.style.height=h;
			novoel.src = imagem;
			if(id === "boxpin")
			{novoel.onmouseover = function(){$i("boxpin").style.display="none";};}
			else if(mouseover){
				novoel.onmouseover = mouseover;
			}
			document.body.appendChild(novoel);
			i3GEO.util.PINS.push(id);
		}
	},
	/*
	Function: posicionaImagemNoMapa

	Posiciona uma imagem no mapa no local onde o mouse está posicionado sobre o mapa

	Parametros:

	id {string} - id do elemento que será posicionado
	*/
	posicionaImagemNoMapa: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.posicionaImagemNoMapa()");}
		var i,mx,my;
		i = $i(id);
		mx = parseInt(i.style.width,10) / 2;
		my = parseInt(i.style.height,10) / 2;
		i.style.position = "absolute";
		i.style.top = objposicaocursor.telay - my;
		i.style.left = objposicaocursor.telax - mx;
	},
	/*
	Function: escondePin

	Esconde os PINS com IDs registrados em i3GEO.util.PINS

	Os ids são criado pela função criaPin
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

	Retorna o caminho correto de uma imagem incluindo o endereço da aplicação e do visual em uso.

	Exemplo: $im("imagem.png")

	Parametros:

	g {String} - nome da imagem

	Retorno:

	string - caminho para a imagem
	*/
	$im: function(g){
		return i3GEO.configura.locaplic+"/imagens/visual/"+i3GEO.configura.visual+"/"+g;
	},
	/*
	Function $inputText ou nome curto $inputText

	Cria um elemento html do tipo input text com formatação especial.

	Parametros:

	idPai {String} - id do elemento pai do input

	larguraIdPai {Integer} - largura em pixel

	idInput {String} - id do objeto input

	titulo {String} - texto que vai no title

	digitos {Integer} - numero de dígitos do input

	valor {String} - valor do input

	nome {String - name do input
	*/
	$inputText: function(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome) {
		if(arguments.length === 6)
		{nome = "";}
		if(idPai !== ""){
			if(larguraIdPai !== "")
			{$i(idPai).style.width=larguraIdPai+"px";}
			$i(idPai).style.padding="3";
			$i(idPai).style.textAlign="center";
			$i(idPai).onmouseover = function()
			{this.className = "digitarMouseover";};
			$i(idPai).onmouseout = function()
			{this.className = "";};
		}
		return "<input tabindex='0' onmouseover='javascript:this.className=\"digitarOver\";' onmouseout='javascript:this.className=\"digitar\";' onclick='javascript:this.select();this.className=\"digitarMouseclick\";' id='"+idInput+"' title='"+titulo+"' type='text' size='"+digitos+"' class='digitar' value='"+valor+"' name='"+nome+"' />";
	},
	$inputTextMudaCor: function(obj){
		var n = obj.value.split(" ");
		obj.style.color = "rgb("+n[0]+","+n[1]+","+n[2]+")";
	},
	/*
	Function: $top ou nome curto $top

	Muda a posição (superior) de um objeto tanto no IE como no Firefox.

	Exemplo: $top("imagem",100)

	Parametros:

	id - identificador do objeto

	valor - posição em relação ao topo.
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

	Muda a posição (esquerda) de um objeto tanto no IE como no Firefox.

	Exemplo: $left("imagem",100)

	Parametros:

	id - identificador do objeto

	valor - posição em relação a esquerda.
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

		Os pontos são inseridos em um contaier de pontos e mostrados temporáriamente

		Parametros:

		xi {Numeric} - coordenada x no mapa.

		yi {Numeric} - coordenada y no mapa.

		funcaoOnclick {String} - funcao que sera executada quando a marca 
		for clicada, se for "", o container será esvaziado ao ser clicado na marca

		container {String} - id do container que receberá os pontos. Se não existir um elemento com esse ID, será criado um novo DIV. No caso da interface google Earth, é utilizado na definição do nome da marca (setname).

		texto {String} - (apenas para interface Google Earth) nome que será adicionado junto da marca

		srci {string} - (opcional) endereço da imagem (será incluido em SRC do tag IMG)
		*/
		cria:function(xi,yi,funcaoOnclick,container,texto,srci){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.util.insereMarca.cria()");}
			if(!srci)
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
						i.top = parseInt($i(i3GEO.Interface.IDCORPO).style.top,10);
						i.left = parseInt($i(i3GEO.Interface.IDCORPO).style.left,10);
					}
					else{
						i.top = parseInt($i(i3GEO.Interface.IDMAPA).style.top,10);
						i.left = parseInt($i(i3GEO.Interface.IDMAPA).style.left,10);
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
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		var temp = path.split(".");
		//i3GEO.contadorAtualiza++;
		if ((temp[1] === "SHP") || (temp[1] === "shp"))
		{i3GEO.php.adicionaTemaSHP(i3GEO.atualiza,path);}
		else
		{i3GEO.php.adicionaTemaIMG(i3GEO.atualiza,path);}
	},
	/*
	Function: abreCor

	Abre a janela flutuante para escolha de uma cor

	Parametros:

	janela {String} - id do conteúdo da janela flutuante que chamou a função. Pode ser "" caso elemento exista em document

	elemento {String} - id do elemento que receberá os valores da cor selecionada

	tipo {String} - opcional pode ser definido como rgb ou hex indicando o tipo de retorno da cor
	*/
	abreCor: function(janela,elemento,tipo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.abreCor()");}
		//i3GEO.janela.cria("400","240",i3GEO.configura.locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento,"","","Cor","i3geo_janelaCor",true);
		if(arguments.length === 2)
		{tipo = "rgb";}
		var ins,
			temp,
			novoel,
			wdocaiframe,
			fix = false,
			wlargura = "300",
			waltura = "250",
			wsrc = i3GEO.configura.locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento+"&tipo="+tipo,
			nx = "",
			ny = "",
			texto = "Cor",
			id = "i3geo_janelaCor",
			modal = true,
			classe = "hd";
		YAHOO.namespace("janelaCor.xp");
		if ($i(id))
		{YAHOO.janelaCor.xp.panel.destroy();}
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
			wdocaiframe.style.height = "250px";
			wdocaiframe.style.width = "325px";
			wdocaiframe.style.border = "0px solid white";
		}
		if(nx === "" || nx === "center"){fix = true;}
		YAHOO.janelaCor.xp.panel = new YAHOO.widget.ResizePanel(id, { height:"300px",zIndex:5000, modal:modal, width: "350px", fixedcenter: fix, constraintoviewport: false, visible: true, iframe:false} );
		YAHOO.janelaCor.xp.panel.render();
		$i(id+'_cabecalho').className = classe;
	},
	/*
	Function: ajaxhttp

	Cria o objeto XMLHttpRequest para uso com funções próprias de chamada em ajax

	O uso dessa função não é recomendado. Dê preferência para uso da chamada ajax via YUI

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

	Executa uma chamada ajax no modo assíncrono retornando o resultado em XML.

	Parametros:

	programa {String} - URL do programa que será executado no servidor.
	funcao {funcao} - função que tratará o resultado.

	Returns:

	O resultado em um objeto DOM. Se o retorno contiver a palavra "Erro", é gerado um alert.
	*/
	ajaxexecASXml: function(programa,funcao){
		var h,ohttp,retorno;
		if (programa.search("http") === 0){
			h = window.location.host;
			if (programa.search(h) < 0){
				alert("OOps! Nao e possivel chamar um XML de outro host.\nContacte o administrador do sistema.\nConfigure corretamente o ms_configura.php");
				return;
			}
		}
		ohttp = i3GEO.util.ajaxhttp();
		ohttp.open("GET",programa,true);
		retorno = "";
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
				{dom = "erro";}
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

	tempo {Integer} - tempo em milesegundos que levará o efeito

	intervalo {Integer} - intervalo entre uma imagem e outra
	*/
	aparece: function(id,tempo,intervalo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.aparece("+id+")");}
		var n,obj,opacidade,fadei,tempoFadei;
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
				clearTimeout(tempoFadei);
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

	tempo {Integer} - tempo em milesegundos que levará o efeito

	intervalo {Integer} - intervalo entre uma imagem e outra

	removeobj {Boolean} - remove ou não o objeto no final
	*/
	desaparece: function(id,tempo,intervalo,removeobj){
		var n,obj,opacidade,fade,p,tempoFade;
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
				clearTimeout(tempoFade);
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

	Calcula a extensão geográfica de uma geometria fornecida no formato WKT

	Parametros:

	wkt {String} - geometria no formato wkt

	tipo {String} - tipo de geometria (polygon,point,line)

	Return:

	{String} - extensão geográfica (xmin ymin xmax ymax)
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

	Ordena um array contendo números. Deve ser usado como parâmetro do método "sort", exemplo

	y.sort(i3GEO.util.sortNumber), onde y é um array de números
	*/
	sortNumber: function(a,b){
		return a - b;
	},
	/*
	Function: getScrollerWidth

	Calcula o tamanho da barra de rolagem, permitindo calcular o tamanho correto da área útil do navegador

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

	ini - funcao do JS que será executada ao ser carregado o script (pode ser "")

	id - id do elemento script que será criado

	aguarde {boolean} - mostra ou não a janela de aguarde
	*/
	scriptTag: function(js,ini,id,aguarde){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.scriptTag()");}
		if(!aguarde){aguarde = true;}
		var head,script, tipojanela = i3GEO.janela.ESTILOAGUARDE;
		if(!$i(id) || id === ""){
			//i3GEO.janela.ESTILOAGUARDE = "reduzida";
			//i3GEO.janela.abreAguarde(id+"aguarde","Carregando JS");
			head= document.getElementsByTagName('head')[0];
			script= document.createElement('script');
			script.type= 'text/javascript';
			if(ini !== ""){
				if(navm){
					script.onreadystatechange = function(){
						if(this.readyState === 'loaded' || this.readyState === 'complete')
						{
							i3GEO.janela.fechaAguarde(id+"aguarde");
							i3GEO.janela.ESTILOAGUARDE = tipojanela;
							eval(ini);
						}
					};
				}
				else{
					script.onload=function(){
						i3GEO.janela.fechaAguarde(id+"aguarde");
						i3GEO.janela.ESTILOAGUARDE = tipojanela;
						eval(ini);
					};
				}
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

	id - id do elemento script que será removido
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

	Verifica se um javascript está carregado no documento.

	Útil para verificar se existe alguma ferramenta ativa ao procurar por i3GEOF.

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
		for (i=0;i < n;i++){
			t = s[i].id;
			t = t.split(".");
			if(t[0] === texto)
			{return true;}
		}
		return false;
	},
	/*
	Function: mensagemAjuda

	Formata uma mensagem de texto com ícone de ?

	Parametros:

	onde {String} - id do elemento que receberá a mensagem

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

	Gera uma cor RGB de forma aleatória

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
		var rgb = str.split(",");
		function hex(x)  {
			var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"];
			return hexDigits[(x - x % 16) / 16] + hexDigits[x% 16];
		}
		return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
	},
	/*
	Function: comboTemas

	Cria um combo (caixa de seleção) com a lista de temas existentes no mapa e de determinado tipo

	Parametros:

	id {String} - id do elemento select que será criado

	funcao {Function} - função que será executada ao terminar a montagem do combo. Essa função receberá
		como parâmetros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo será uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que receberá o combo. É utilizado apenas para inserir uma mensagem de aguarde.

	nome {String} - valor que será incluido no parametro "name" do elemento "select".

	multiplo {Booleano} - indica se o combo permite seleções múltiplas

	tipoCombo {String} - Tipo de temas que serão incluídos no combo ligados|selecionados|raster|pontosSelecionados|pontos|linhaDoTempo
	*/
	comboTemas: function(id,funcao,onde,nome,multiplo,tipoCombo){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.comboTemas()");}
		if (arguments.length > 2)
		{i3GEO.util.defineValor(onde,"innerHTML","<span style=color:red;font-size:10px; >buscando temas...</span>");}
		if (arguments.length === 3)
		{nome = "";}
		if (arguments.length < 5)
		{multiplo = false;}
		var monta, lista, temp;
		monta = function(retorno){
			var i,comboTemas,temp,n,nome;
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
				else
				{temp = {dados:'<div class=alerta >Nenhum tema encontrado.</div>',tipo:"mensagem"};}
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
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoCombo === "pontos"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoCombo === "poligonos"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoCombo === "poligonosSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoCombo === "naolinearSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",1,"diferente",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoCombo === "linhaDoTempo"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("linhadotempo","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoCombo === ""){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type","","diferente",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
	},
	/*
	Function: checkTemas

	Cria uma lista com check box de temas existentes no mapa e de determinado tipo

	Parametros:

	id {String} - id do elemento select que será criado

	funcao {Function} - função que será executada ao terminar a montagem do combo. Essa função receberá
		como parâmetros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo será uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que receberá o combo. É utilizado apenas para inserir uma mensagem de aguarde.

	nome {String} - valor que será incluido no parametro "name" do elemento "select".

	tipoLista {String} - Tipo de temas que serão incluídos na lista ligados|selecionados|raster|pontosSelecionados|pontos|polraster

	prefixo {string} - Prefixo que será usado no id de cada elemento

	size {numeric} - tamanho dos elementos input editáveis
	*/
	checkTemas: function(id,funcao,onde,nome,tipoLista,prefixo,size){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.checkTemas()");}
		if (arguments.length > 2)
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>";}
		if (arguments.length === 3)
		{nome = "";}
		var monta, lista, temp, temp1, n, i;
		monta = function(retorno){
			try{
				var i,comboTemas,temp,n,nome;
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
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoLista === "pontosSelecionados"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				temp = i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS);
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
		if(tipoLista === "pontos"){
			if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
				monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS));
			}
			else
			{alert("Arvore de camadas não encontrada");}
		}
	},
	/*
	Function: comboItens

	Cria um combo (caixa de seleção) com a lista de itens de um layer

	Parametros:

	id {String} - id do elemento select que será criado

	tema {String} - código do tema (layer)

	funcao {Function} - função que será executada ao terminar a montagem do combo. Essa função receberá
		como parâmetros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo será uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que receberá o combo. É utilizado apenas para inserir uma mensagem de aguarde.

	nome {String} - valor que será incluido no parametro "name" do elemento "select".
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

	Cria uma caixa de seleção com os valores de um item de um tema

	Parametros:

	id {String} - id do elemento select que será criado

	tema {String} - código do tema (layer)

	itemTema {String} - nome do item

	funcao {Function} - função que será executada ao terminar a montagem do combo. Essa função receberá
		como parâmetros um Array associativo contendo os dados em HTML gerados e o tipo de resultado. P.ex.:
		{dados:comboTemas,tipo:"dados"}
		tipo será uma string que pode ser "dados"|"mensagem"|"erro" indicando o tipo de retorno.

	onde {String} - id do elemento HTML que receberá o combo. É utilizado apenas para inserir uma mensagem de aguarde.
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
			eval("funcao(temp)");
		};
		i3GEO.php.listaValoresItensTema(monta,tema,itemTema);
		//cp = new cpaint();
		//cp.set_debug(2)
		//cp.set_response_type("JSON");
		//cp.call( g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);
	},
	/*
	Function: comboFontes

	Cria um combo (caixa de seleção) com a lista fontes de texto disponíveis

	Parametros:

	id {String} - id do elemento select que será criado

	onde {String} - id do elemento HTML que receberá o combo. É utilizado apenas para inserir uma mensagem de aguarde.
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

	Cria uma caixa de seleção com as palavras sim e não

	Parametros:

	id [String} - id do elemento select que será criado

	selecionado {string} - qual valor estará selecionado sim|nao

	Return:
	{string}
	*/
	comboSimNao: function(id,selecionado){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.comboSimNao()");}
		var combo = "<select name="+id+" id="+id+" >";
		combo+= "<option value='' >---</option>";
		if(selecionado === "sim")
		{combo+= "<option value=TRUE selected >sim</option>";}
		else
		{combo+= "<option value=TRUE >sim</option>";}
		if(selecionado === "nao")
		{combo += "<option value=FALSE selected >não</option>";}
		else
		{combo += "<option value=FALSE >não</option>";}
		combo += "</select>";
		return(combo);
	},
	/*
	Function: checkItensEditaveis

	Cria uma lista de elementos do tipo input com textos editáveis contendo a lista de itens de um tema.

	Parametros:

	tema {string} - código do layer existente no mapa

	funcao {function} - função que será executada para montar a lista. Essa função receberá
	como parâmetro um array do tipo {dados:ins,tipo:"dados"}
	onde ins é um array com as linhas e tipo é o tipo de resultado, que pode ser "dados"|"erro"

	onde {string} - id do elemento que receberá a mensagem de aguarde

	size {numeric} - tamanho dos elementos input editáveis

	prefixo {string} - Prefixo que será usado no id de cada elemento
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
			eval("funcao(temp)");
		};
		i3GEO.php.listaItensTema(monta,tema);
	},
	/*
	Function: radioEpsg

	Cria uma lista de códigos EPSG para o usuário escolher um deles.

	A lista é mostrada como uma série de elementos do tipo radio com "name" igual ao prefixo mais a palavra EPSG

	Parametros:

	funcao {function} - função que será executada para montar a lista. Essa função receberá
	como parâmetro um array do tipo {dados:ins,tipo:"dados"}
	onde ins é um array com as linhas e tipo é o tipo de resultado, que pode ser "dados"|"erro"

	onde {string} - id do elemento que receberá a mensagem de aguarde

	prefixo {string} - Prefixo que será usado no name de cada elemento
	*/
	radioEpsg: function (funcao,onde,prefixo){
		if (arguments.length === 2)
		{$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando...</span>";}
		var cp,monta = function(retorno){
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
			eval("funcao(temp)");
		};
		i3GEO.php.listaEpsg(monta);
	},
	/*
	Function: proximoAnterior

	Cria uma sequência de opções com botão de anterior e próximo. É utilizado principalmente pelas
	ferramentas de análise espacial, onde o usuário segue uma sequência de operações de escolha
	de parâmetros.

	Parametros:

	anterior {String} - nome da função que é executada para voltar à tela anterior. Pode ser "".

	proxima {String} - nome da função que é executada para avançar para a próxima tela. Pode ser "".

	texto {String} - texto que comporá a tela atual

	idatual {String} - id do elemento DIV que será criado para inserir o conteúdo definido em 'texto"

	container {String} - id do elemento DIV já existente que receberá as telas.
	*/
	proximoAnterior: function(anterior,proxima,texto,idatual,container){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.proximoAnterior()");}
		var temp = $i(idatual),
			ndiv = document.createElement("div"),
			nids,
			i,
			fundo,
			b;

		if(temp){$i(container).removeChild(temp);}
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

			b = new YAHOO.widget.Button(idatual+"anterior_",{
				onclick:{fn: function(){
					eval(anterior+"()");
				},
				lazyloadmenu:true 
			}});
			b = new YAHOO.widget.Button(idatual+"proxima_",
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

	Atalho para abrir a janela de diálogo de uma ferramenta padrão

	O script adicionado terá como ID "i3GEOF."+nome+"_script"

	Parametros:

	mensagem {string} - mensagem que será enviada ao console no caso do Firefox

	dir {string} - diretório em i3geo/ferramentas

	nome {string} - nome da classe da ferramenta
	*/
	dialogoFerramenta: function(mensagem,dir,nome){
		if(typeof(console) !== 'undefined'){console.info(mensagem);}
		var js = i3GEO.configura.locaplic+"/ferramentas/"+dir+"/index.js.php";
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

	Verifica se um retângulo está dentro de outro retângulo

	Parametros:

	box1 - retângulo que será verificado

	box2 - retângulo de referência

	Return:

	boolean
	*/
	intersectaBox: function(box1,box2){
		box1 = box1.split(" ");
		box2 = box2.split(" ");
		var	box1i = box2,
			box2i = box1,
			coordx,
			coordy,
			i;
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

	Abre a janela flutuante para escolha de um degradê de cores

	Parametros:

	janela {String} - id do conteúdo da janela flutuante que chamou a função. Pode ser "" caso elemento exista em document

	elemento {String} - id do elemento que receberá os valores da cor selecionada

	ncores {numerico} - número de cores default ao abrir  o seletor de cores
	*/
	abreColourRamp: function(janela,elemento,ncores){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.util.abreColourRamp()");}
		var ins,
			temp,
			novoel,
			wdocaiframe,
			fix = false,
			wlargura = "300",
			waltura = "480",
			wsrc = i3GEO.configura.locaplic+"/ferramentas/colourramp/index.php?ncores="+ncores+"&doc="+janela+"&elemento="+elemento, //+janela+"&elemento="+elemento+"&tipo="+tipo,
			nx = "",
			ny = "",
			texto = "Cor",
			id = "i3geo_janelaCorRamp",
			modal = true,
			classe = "hd";
		YAHOO.namespace("janelaCorRamp.xp");
		if ($i(id))
		{YAHOO.janelaCorRamp.xp.panel.destroy();}
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
		YAHOO.janelaCorRamp.xp.panel = new YAHOO.widget.ResizePanel(id, { height:"480px",zIndex:5000, modal:modal, width: "350px", fixedcenter: fix, constraintoviewport: false, visible: true, iframe:false} );
		YAHOO.janelaCorRamp.xp.panel.render();
		$i(id+'_cabecalho').className = classe;
	},
	/*
	Function: localizai3GEO

	Tenta identificar onde os JS do i3Geo estão localizados

	Aplica o resultado à variável i3GEO.configura.locaplic

	Return:

	{string} - url onde está instalado o i3geo
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

	Pode-se especificar o pai e o filha a ser removido ou simplesmente o ID do nó que se quer remover

	Parametros:

	id {string} - id do elemento que será removido (filho)

	el {node} - (opcional) node (DOM) que contém o elemento. Se não for definido, será obtido o parent de id
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

	id {string} - id do elemento que será removido (filho)

	prop {string} - propriedade que receberá o valor

	valor {string} - valor que será aplicado
	*/
	defineValor: function(id,prop,valor){
		try
		{eval("$i('"+id+"')."+prop+"='"+valor+"';");}
		catch(e){}
	},
	/*
	Function: in_array

	Procura a ocorrência de um elemento em um array

	Parametros:

	x - o que será procurado

	matriz - array

	Return:

	{boolean}
	*/
	in_array: function(x, matriz){
		var txt = "¬" + matriz.join("¬") + "¬";
		var er = new RegExp ("¬" + x + "¬", "gim");
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
	
	Implementa a técnica de particionamento para execussão de funções no modo assíncrono
	
	Conforme página 144 do livro "Javascript de alto desempenho, Nicholas Zakas
	
	Parâmetros:
	
	steps {array} - funções que serão executadas
	
	args {array} - array de arrays com os argumentos de cada função
	
	callback {function} - função que será executada ao terminar os processos
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
	}	
};
//++++++++++++++++++++++++++++++++++++
// YUI ACCORDION
// 1/22/2008 - Edwart Visser
//
// accordion
//
// REQUIRES: yahoo-dom-event.js, animation-min.js
//
// TODO: build hover script for highlighting header in IE
// TODO: attach behaviour based on rel attribute
//++++++++++++++++++++++++++++++++++++
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
				headers,
				bodies;
			if(accordionObject) {
				if(accordionObject.nodeName === "DL") {
					headers = accordionObject.getElementsByTagName("dt");
					bodies = headers[0].parentNode.getElementsByTagName("dd");
				}
				this.attachEvents(headers,0);
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
	}
}
catch(e){}
//
//alias
//
$im = function(g){
	return i3GEO.util.$im(g);
};
$inputText = function(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome){
	if(arguments.length === 6)
	{nome = "";}
	return i3GEO.util.$inputText(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome);
};
$top = function(id,valor){
	i3GEO.util.$top(id,valor);
};
$left = function(id,valor){
	i3GEO.util.$left(id,valor);
};