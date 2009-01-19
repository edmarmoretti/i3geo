/*
Class:: i3GEO.util

Utilitários.

Funções gerais de processamento.

File: i3geo/classesjs/classe_util.js

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
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
/*
Function: $i

Obtém um elemento DOM a partir de seu id
  
Parameters:

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
	var i = this.indexOf(s);
	if(i != -1) this.splice(i, 1);
};
i3GEO.util = {
	/*
	Variable: PINS
	Elementos IMG criados na função criaPin
	
	Type:
	{Array}
	*/
	PINS: new Array(),
	/*
	Variable: BOXES
	Elementos DIV criados na função criaBox
	
	Type:
	{Array}
	*/
	BOXES: new Array(),	
	/*
	Function: insereCookie
	Cria um novo cookie. 
   
	Parameters:
	nome - {String} Nome do cookie.
	
	valor - (String) Valor do cookie
	*/
	insereCookie: function(nome,valor) {
		document.cookie = nome+"="+valor;
	},
	/*
	Function: pegaCookie
	Pega o valor de um cookie. 
   
	Parameters:
	nome - {String} Nome do cookie.

	Returns:
	(String) - valor do cookie
	*/
	pegaCookie: function(nome){
		var cookies = document.cookie;
		var i = cookies.indexOf(nome);
		if(i == -1)
		{return null;}
		var fim = cookies.indexOf(";",i);
		if (fim == -1)
		{var fim = cookies.length;}
		return (unescape(cookies.substring(i,fim))).split("=")[1];
	},
	/*
	Function: listaChaves
	Lista as chaves de um objeto. 
   
	Parameters:
	obj - {Object}

	Return:
	(Array) - array com as chaves.
	*/
	listaChaves: function (obj) {
		var keys = [];
		for(var key in obj){
   			keys.push(key);
		}
		return keys;
	},
	/*
	Function: criaBotaoAplicar
	Cria um botão flutuante do tipo aplicar.
	
	O novo botão é adicionado no DOM com ID "i3geo_aplicar" e posicionado sobre o objeto definido
   
	Parameters:
	
	nomeFuncao - {String} Nome da função que será executada quando o botão for cllicado
	
	titulo - (opcional) {String} Título que será mostrado no botão
	
	classe - (opcional) {String} Nome da classe (estilo) que será aplicado ao botão.
	
	obj - (opcional) {Objeto} Objeto DOM que foi clicado para provocar a criação do botão.

	Return:
	(Object) - Objeto DOM criado.

	*/
	criaBotaoAplicar: function (nomeFuncao,titulo,classe,obj) {
		clearTimeout(objmapa.tempo);
		objmapa.tempo = eval("setTimeout('"+nomeFuncao+"\(\)',(i3GEO.configura.tempoAplicar))");
		autoRedesenho("reinicia");
		if(arguments.length == 1)
		{var titulo = "Aplicar";}
		if(arguments.length == 1 || arguments.length == 2)
		{var classe = "i3geoBotaoAplicar";}
		if (!document.getElementById("i3geo_aplicar"))
		{
			var novoel = document.createElement("input");
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
		{var novoel = document.getElementById("i3geo_aplicar");}
		novoel.onclick = function(){
			clearTimeout(objmapa.tempo);
			objmapa.tempo = "";
			this.style.display='none';
			eval(nomeFuncao+"\(\)");
		};
		//reposiciona o botao
		if(arguments.length == 4){
			novoel.style.display="block";
			var xy = YAHOO.util.Dom.getXY(obj);
			YAHOO.util.Dom.setXY(novoel,xy);
		}
		return (novoel);
	},
	/*
	Function: arvore
	
	Cria uma árvore com base em um objeto contendo aspropriedades.
	
	Parameters:
	
	titulo - {String} cabeçaljo da árvore
	
	onde - {String} nome do id doelemento que conterá a árvore
	
	obj - {Object} objeto contendo os parâmetros, exemplo
	
		g_listaPropriedades = {
	
		"propriedades": [
	
		{ text: "p2", url: "javascript:tipoimagem()" }
	
		]}
	
	*/
	arvore: function(titulo,onde,obj){
		//YAHOO.log("arvore", "i3geo");
		if(!$i(onde)){return;}
		var currentIconMode;
		YAHOO.example.treeExample = new function(){
        	function buildTree(){
				arvore = new YAHOO.widget.TreeView(onde);
				root = arvore.getRoot();
				var tempNode = new YAHOO.widget.TextNode('', root, false);
				tempNode.isLeaf = false;
        	}
    		buildTree();
		}();
		var titulo = "<table><tr><td><b>"+titulo+"</b></td><td></td></tr></table>";
		var d = {html:titulo};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, true,true);
		var c = obj.propriedades.length;
		for (var i=0, j=c; i<j; i++){
			var linha = obj.propriedades[i];
			var conteudo = "<a href='#' onclick='"+linha.url+"'>"+$trad(linha.text)+"</a>";
			var d = {html:conteudo};
			var temaNode = new YAHOO.widget.HTMLNode(d, tempNode, false,true);
		}
		arvore.collapseAll();
   		arvore.draw();
   		//YAHOO.log("Fim arvore", "i3geo");
	},
	/*
	Function: removeAcentos

	Remove acentos de uma palavra ou frase

	Parameters:

	palavra {String}
	
	Return:
	
	{String}
	*/
	removeAcentos: function(palavra) {
		var re = /ã|á|à|â/gi;
		palavra = palavra.replace(re,"a");
		var re = /é/gi;
		palavra = palavra.replace(re,"e");
		var re = /í/gi;
		palavra = palavra.replace(re,"i");
		var re = /ó|õ/gi;
		palavra = palavra.replace(re,"o");
		var re = /ç/gi;
		palavra = palavra.replace(re,"c");
		var re = /ú/gi;
		palavra = palavra.replace(re,"u");
		return(palavra);
	},
	/*
	Function protocolo
	
	Obtém o protocoloutilizado na URL atual
	
	Return:
	
	{String} - protocolo
	*/
	protocolo: function(){
		var u = window.location.href;
		var u = u.split(":");
		return (u[0]);	
	},
	/*
	Function: pegaPosicaoObjeto

	Retorna a posição x,y de um objeto em relação a tela do navegador
	
	Parameters:
	
	obj {Object} - objeto dom
	
	Return:
	
	{Array} - array com a posição [x,y]
	*/
	pegaPosicaoObjeto: function(obj){
		if(obj)
		{
			if(obj.style.position == "absolute")
			{return [(parseInt(obj.style.left)),(parseInt(obj.style.top))];}
			else{
				var curleft = curtop = 0;
				if(obj){
					if (obj.offsetParent) {
						do {
							curleft += obj.offsetLeft-obj.scrollLeft;
							curtop += obj.offsetTop-obj.scrollTop;
						} while (obj = obj.offsetParent);
					}
				}
				return [curleft+document.body.scrollLeft,curtop+document.body.scrollTop];
			}
		}
		else
		{return [0,0];}
	},
	/*
		Function: i3geo_pegaElementoPai

		Pega o elemento pai de um elemento clicado para identificar o código do tema.

		Parameters:

		e - elemento do DOM.
		
		Return:
		
		{Node} - objeto DOM
	*/
	pegaElementoPai: function(e){
		var targ;
		if (!e)
		{var e = window.event;}
		if (e.target)
		{targ = e.target;}
		else
		if (e.srcElement)
		{targ = e.srcElement;}
		if (targ.nodeType == 3)
   		{targ = targ.parentNode;}
		var tname;
		tparent=targ.parentNode;
		return(tparent);
	},
	/*
	Function: mudaCursor
	
	Altera o cursor do ponteiro do mouse.
	
	Os cursores disponíveis são definidos por default em classe_configura.js
	
	Parameters:
	
	cursores {i3GEO.configura.cursores} - objeto JSON com as URIs de cada cursor (veja i3GEO.configura.cursores)
	
	tipo {String} - tipo de cursor disponível em cursores
	
	idobjeto {String} - id do objeto que terá o estilo alterado para o cursor desejado
	
	locaplic {String} - onde está instalado o i3Geo
	*/
	mudaCursor: function(cursores,tipo,idobjeto,locaplic){
		var o = document.getElementById(idobjeto);
		if(o){
			if(navm){
				o.style.cursor = "URL(\""+locaplic+eval("cursores."+tipo+".ie")+"\"),auto";
			}
			else{
				o.style.cursor = "URL(\""+locaplic+eval("cursores."+tipo+".ff")+"\"),auto";
			}			
		}
	},
	/*
	Function: criaBox
	
	Cria um elemento div na página atual.
	
	Esse elemento pode ser utilizado para desenhar retângulos sobre o mapa
	
	Parameters:
	
	id {String} - id do elemento que será criado. Por default, será 'boxg'
	*/
	criaBox: function(id){
		if(arguments.length == 0)
		{var id = "boxg"}
		if (!$i(id))
		{
			var novoel = document.createElement("div");
			novoel.id = id;
			novoel.style.zIndex=1;
			novoel.innerHTML = '<font face="Arial" size=0></font>';
			document.body.appendChild(novoel);
			//YAHOO.util.Event.addListener($i(id),"mouseover", "this.style.display='none'");
			//novoel.onmouseover = eval("$i('"+id+"').style.display='none';");
			novoel.onmouseover = function(){novoel.style.display='none';};
			novoel.onmouseout = function(){novoel.style.display='block';};
			i3GEO.util.BOXES.push(id);
		}
	},
	/*
	Function: escondeBox
	
	Esconde os BOXES com IDs registrados em i3GEO.util.BOXES
	
	Os ids são criado pela função criaBox
	*/
	escondeBox: function(){
		var l = i3GEO.util.BOXES.length;
		for (i=0; i<l; i++){
			if($i(i3GEO.util.BOXES[i]))
			{$i(i3GEO.util.BOXES[i]).style.display = "none";}
		}
	},
	/*
	Function: criaPin
	
	Cria um elemento imagem na página atual.
	
	Esse elemento pode ser utilizado para desenhar pontos sobre o mapa
	
	Parameters:
	
	id {String} - id do elemento que será criado. Por default, será 'boxpin'
	*/
	criaPin: function(id){
		if(arguments.length == 0)
		{var id = "boxpin"}	
		if (!$i(id))
		{
			var novoel = document.createElement("img");
			novoel.id = id;
			novoel.style.zIndex=10000;
			novoel.style.position="absolute";
			novoel.style.width="21px";
			novoel.style.height="25px";
			novoel.src = i3GEO.configura.locaplic+'/imagens/marker.png';
			novoel.onmouseover = function(){$i("boxpin").style.display="none";};
			document.body.appendChild(novoel);
			i3GEO.util.PINS.push(id);
		}	
	},
	/*
	Function: escondePin
	
	Esconde os PINS com IDs registrados em i3GEO.util.PINS
	
	Os ids são criado pela função criaPin
	*/
	escondePin: function(){
		var l = i3GEO.util.PINS.length;
		for (i=0; i<l; i++){
			if($i(i3GEO.util.PINS[i]))
			{$i(i3GEO.util.PINS[i]).style.display = "none";}
		}
	},
	/*
	Function: $im ou nome curto $im

	Retorna o caminho correto de uma imagem incluindo o endereço da aplicação e do visual em uso.

	Exemplo: $im("imagem.png")

	Parâmetros:

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

	Parameters:

	idPai {String} - id do elemento pai do input

	larguraIdPai {Integer} - largura em pixel

	idInput {String} - id do objeto input

	titulo {String} - texto que vai no title

	digitos {Integer} - numero de dígitos do input

	valor {String} - valor do input
	*/
	$inputText: function(idPai,larguraIdPai,idInput,titulo,digitos,valor) {
		if(idPai != "")
		{
			if(larguraIdPai != "")
			{$i(idPai).style.width=larguraIdPai+"px";}
			$i(idPai).style.padding="3";
			$i(idPai).style.textAlign="center";
			$i(idPai).onmouseover = function()
			{this.className = "digitarMouseover";};
			$i(idPai).onmouseout = function()
			{this.className = "";};	
		}
		var i = "<input onmouseover='javascript:this.className=\"digitarOver\";' onmouseout='javascript:this.className=\"digitar\";' onclick='javascript:this.className=\"digitarMouseclick\";' id="+idInput+" title='"+titulo+"' type=text size="+digitos+" class=digitar value='"+valor+"' />";
		return i;
	},
	/*
	Function: $top ou nome curto $top

	Muda a posição (superior) de um objeto tanto no IE como no Firefox.

	Exemplo: $top("imagem",100)

	Parâmetros:

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

	Parâmetros:

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
		Variable: CONTAINER
		
		Armazena o valor do ID do div criado para inserir pontos
		
		Type:
		{Array}
		*/
		CONTAINER: new Array(),
		/*
		Function: cria
		
		Insere um ponto no mapa
		
		Os pontos são inseridos em um contaier de pontos e mostrados temporáriamente

		Parameters:

		xi {Numeric} - coordenada x.

		yi {Numeric} - coordenada y.

		funcaoOnclick {String} - funcao que sera executada quando a marca 
		for clicada, se for "", o container será esvaziado ao ser clicado na marca
	
		container {String} - id do container que receberá os pontos
		*/
		cria:function(xi,yi,funcaoOnclick,container){
			try{
				if(i3GEO.util.insereMarca.CONTAINER.toString().search(container) < 0)
				i3GEO.util.insereMarca.CONTAINER.push(container);
				//verifica se existe o container para os pontos
				if (!$i(container)){
					var novoel = document.createElement("div");
					novoel.id = container;
					var i = novoel.style;
					i.position = "absolute";
					i.top = parseInt($i("img").style.top);
					i.left = parseInt($i("img").style.left);
					document.body.appendChild(novoel);
				}
				var container = $i(container);
				var novoel = document.createElement("div");
				var i = novoel.style;
				i.position = "absolute";
				i.zIndex=2000;
				i.top=(yi - 4)+"px";
				i.left=(xi - 4)+"px";
				i.width="4px";
				i.height="4px";
				var novoimg = document.createElement("img");
				if (funcaoOnclick != "")
				{novoimg.onclick = funcaoOnclick;}
				else
				{novoimg.onclick=function(){i3GEO.util.insereMarca.limpa();}}
				novoimg.src=i3GEO.configura.locaplic+"/imagens/dot1.gif";
				with (novoimg.style){width="6px";height="6px";zIndex=2000;}
				novoel.appendChild(novoimg);
				container.appendChild(novoel);
			}
			catch(e){alert("Ocorreu um erro. inseremarca"+e);}
		},
		limpa: function(){
			try{
				var n = i3GEO.util.insereMarca.CONTAINER.length;
				for(i=0;i<n;i++){
					if($i(i3GEO.util.insereMarca.CONTAINER[i]))
					$i(i3GEO.util.insereMarca.CONTAINER[i]).innerHTML = "";
				}
				i3GEO.util.insereMarca.CONTAINER = new Array();
			}
			catch(e){}
		}
	},
	/*
	Function: adicionaSHP

	Inclui um arquivo shapefile no mapa atual como uma nova camada

	Parameters:

	path {String} - caminho completo do shapefile
	*/	
	adicionaSHP: function(path){
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var temp = path.split(".");
		if ((temp[1] == "SHP") || (temp[1] == "shp"))
		{var f = "adicionaTemaSHP";}
		else
		{var f = "adicionaTemaIMG";}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao="+f+"&arq="+path;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,f,ajaxredesenha);
	}
};
//
//alias
//
$im = function(g){
	return i3GEO.util.$im(g);
};
$inputText = function(idPai,larguraIdPai,idInput,titulo,digitos,valor){
	return i3GEO.util.$inputText(idPai,larguraIdPai,idInput,titulo,digitos,valor);
};
$top = function(id,valor){
	i3GEO.util.$top(id,valor);
};
$left = function(id,valor){
	i3GEO.util.$left(id,valor);
};