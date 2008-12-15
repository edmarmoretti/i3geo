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

i3GEO.util = {
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
	
	Cria uma árvore combaseem um objeto contendo aspropriedades.
	
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
		YAHOO.log("arvore", "i3geo");
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
		var titulo = "<table><tr><td><b>"+titulo+"</b></td><td><img style='position:relative;top:-3px' title='"+$trad("t2")+"'  src='"+$im("branco.gif")+"' /></td></tr></table>";
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
   		YAHOO.log("Fim arvore", "i3geo");
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
	Function: dms2dd
	
	Converte coordenadas formatadas em DMS para DD
	
	Parameters:
	
	cd {Numeric} - grau
	
	cm {Numeric} - minuto
	
	cs {Numeric} - segundo
	
	Return:
	
	{Numeric} - Coordenada em décimos de grau.
	*/
	dms2dd: function(cd,cm,cs){
		try
		{
			YAHOO.log("dms2dd", "i3geo");
			//converte dms em dd
			var sinal = 'positivo';
			if (cd < 0)
			{
				cd = cd * -1;
				sinal = 'negativo';
			}
			spm = cs / 3600;
			mpg = cm / 60;
			var dd = (cd * 1) + (mpg * 1) + (spm * 1);
			if (sinal == 'negativo')
			{dd = dd * -1;}
			YAHOO.log("Fim dms2dd", "i3geo");
			return (dd);
		}
		catch(e){return (0);}
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
	Function: dd2tela

	Converte coordenadas dd em coordenadas de tela.

	Parameters:

	vx {Numeric} - coordenada x.

	vy {Numeric} - coordenada y.

	docmapa - objeto DOM que contém o objeto imagem
	
	ext {String} - extensão geográfica (espaço comoseparador) xmin ymin xmax ymax
	
	cellsize {Numeric} - tamanho no terreno em DD de cada pixel da imagem

	Returns:

	{Array} - Array com o valor de x [0] e y [1]
	*/
	dd2tela: function (vx,vy,docmapa,ext,cellsize){
		try
		{
			if(!docmapa)
			{var docmapa = window.document;}
			var dc = docmapa.getElementsByTagName("img")[0];
			var pos = i3GEO.util.pegaPosicaoObjeto(dc);
			var imgext = objmapa.extent;
			var imgext = imgext.split(" ");
			vx = (vx * 1) - (imgext[0] * 1);
			vy = (vy * -1) + (imgext[3] * 1);
			c = cellsize * 1;
			xy = new Array();
			return [(vx  / c) + pos[0],(vy / c) + pos[1]];
		}
		catch(e){return(new Array());}
	},
	/*
	Function: dd2dms

	Converte coordenadas de dd em dms.

	Parameters:

	x {Numeric} - coordenada x.

	y {Numeric} - coordenada y.

	Returns:

	{Array} - Array com o valor de x [0] e y [1] no formato dd mm ss
	*/
	dd2dms: function(x,y){
		var m = 0;
		var s = 0;
		var dx = parseInt(x);
		if (dx > 0)
		{var restod = x - dx;}
		if (dx < 0)
		{restod = (x * -1) - (dx * -1);}
		dx = dx;
		if (restod != 0){
			var mm = restod * 60;
			var m = parseInt(restod * 60);
			var restos = mm - m;
			var mx = m;
			if (restos != 0){
				var s = restos * 60;
				var s = (s+"_").substring(0,5);
				var sx = s;
			}
			else  { s = "00.00" }
		}
		else{
			var mx = "00";
			var sx = "00.00";
		}
		if (m.length == 2){m = "0"+m+"";}
		if (s*1 < 10){s = "0"+s;}
		var xv = dx+" "+mx+" "+sx;
		var m = 0;
		var s = 0;
		var dy = parseInt(y);
		if (dy > 0)
		{var restod = y - dy;}
		if (dy < 0)
		{var restod = (y * -1) - (dy * -1);}
		dy = dy;
		if (restod != 0){
			var mm = restod * 60;
			var m = parseInt(restod * 60);
			var restos = mm - m;
			var my = m;
			if (restos != 0){
				var s = restos * 60;
				s = (s+"_").substring(0,5);
				var sy = s;
			}
			else  { var s = "00.00";}
		}
		else{
			var my = "00";
			var sy = "00.00";
		}
		if (m.length == 2){m = "0"+m;}
		if (s*1 < 10){s = "0"+s;}
		var yv = dy+" "+my+" "+sy;
		var res = new Array();
		res[0] = xv;
		res[1] = yv;
		return res;
	},
	/*
	Function: tela2dd

	Converte o x,y de unidades de tela para décimo de grau.

	Parameters:

	xfign {Numeric} - x em valores de imagem.

	yfign {Numeric} - y em coordenadas de imagem.

	g_celula {Numeric} - tamanho no terreno do pixel da imagem em dd.

	imgext {String} - extensão geográfica do mapa.

	Returns:

	{Array} - Coordena em dd x[0] e y[1].
	*/
	tela2dd: function(xfign,yfign,g_celula,imgext){
		try
		{
			if (navm){
			xfign = xfign - 2.2;
			yfign = yfign - 2.7;
			}
			else{
			xfign = xfign - 0.12;
			yfign = yfign - 1.05;
			}
			var nx = g_celula * xfign;
			var ny = g_celula * yfign;
			var amext = imgext.split(" ");
			var longdd = (amext[0] * 1) + nx;
			var latdd = (amext[3] * 1) - ny;
			var res = new Array();
			res[0] = longdd;
			res[1] = latdd;
			return (res);
		}
		catch(e){return(0);}
	}
};