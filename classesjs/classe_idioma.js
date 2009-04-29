/*
Title: Idioma

File: i3geo/classesjs/classe_idioma.js

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
Class: i3geo.idioma

Tradução da interface principal.

Fornece os métodos para traduzir frases para idiomas específicos.

O dicionário é definido em i3geo/classesjs/dicionario.js

Se você está customizando o i3geo,acrescentandonovas funcionalidades,
utilize o método alteraDicionario para acrescentar novas traduções, dessa forma,
quandoo usuário escolher oidioma ainterface será adaptada corretamente.

Exemplos:

i3GEO.idioma.define("pt");

i3GEO.idioma.defineDicionario(g_traducao);

i3GEO.idioma.alteraDicionario("d22","novo oi");

alert($trad("d22"))
*/
i3GEO.idioma = {
	/*
	Property: MOSTRASELETOR
	
	Define se o i3Geo irá incluir no mapa as bandeiras de seleção de idiomas
	
	Type:
	{Boolean}
	
	Default:
	true
	*/
	MOSTRASELETOR: true,
	/*
	Property: IDSELETOR
	
	Define o id do elemento HTML que receberá o seletor. Se não for definido, o seletor será
	posicionado automaticamente pelo i3Geo
	
	Type:
	{String}
	
	Default:
	""
	*/
	IDSELETOR: "",
	/*
	Property: SELETORES
	
	Lista os seletores (bandeiras) que serão incluídas no seletor
	
	Type:
	{Array}
	
	Default:
	"pt","en","es","it"
	*/
	SELETORES: new Array("pt","en","es","it"),
	/*
	Property: DICIONARIO
	
	Define o objeto com o dicionário utilizado
	*/
	DICIONARIO: g_traducao,
	/*
	Function: define
	
	Define qual o idioma em uso. O default é "pt". 
   
	Parameters:
	codigo - {String} Código do idioma.
	*/
	define: function(codigo) {
		i3GEO.idioma.ATUAL = codigo;
		i3GEO.util.insereCookie("i3geolingua",codigo);
	},
	/*
	Function: retornaAtual
	
	Retorna o idioma atual. 
       
	Returns:
	{string} Código do idioma.
	*/	
	retornaAtual: function() {
		return (i3GEO.idioma.ATUAL);
	},
	/*
	Function: defineDicionario
	
	Define o objeto com as traduções. O default é "g_traducao"
   
	Parameters:
	obj - {Object} Objeto com a tradução.
     
	Example:
	
	g_traducao = {
	
	"p1": [{
	
		pt:"texto em portugues",
		
		en:"texto em ingles",
		
		es:"texto em espanhol"
		
		}]
		
	}
	*/
	defineDicionario: function(obj) {
		i3GEO.idioma.DICIONARIO = obj;
	},
	/*
	Function: alteraDicionario
	
	Altera um texto do dicionario ou acresecenta um novo texto para o idioma atual. 
   
	Parameters:
	id - {String} Código do texto.
	novo - (String) Novo texto.
     
	*/
	alteraDicionario: function(id,novo) {
		i3GEO.idioma.DICIONARIO[id][0][i3GEO.idioma.ATUAL] = novo;
	},
	/*
	Function: traduzir
	
	Traduz um texto para o idioma escolhido
   
	Parameters:
	id - {String} Código do texto.
     
	Returns:
	{String} Texto traduzido.
	*/
	traduzir: function(id) {
		if(i3GEO.idioma.DICIONARIO[id]){
			//YAHOO.log("traduzir", "i3geo");
			var t = i3GEO.idioma.DICIONARIO[id][0];
			//YAHOO.log("Fim traduzir", "i3geo");
			return t[i3GEO.idioma.ATUAL];
		}
		else return;
	},
	/*
	Function: adicionaDicionario
	
	Adiciona novos registros ao dicionário atual
   
	Parameters:
	novodic - {Object} Objeto novo dicionário.
     
	Example:
	
	var novodic ={ 	"pp": [{
	
		pt:"texto em portugues",
		
		en:"texto em ingles",
		
		es:"texto em espanhol"
		
		}]}
		
	i3GEO.idioma.adicionaDicionario(novodic)
	
	alert($trad("pp"))
	*/
	adicionaDicionario: function(novodic) {
		for (k in novodic) { i3GEO.idioma.DICIONARIO[k] = novodic[k]; }
	},
	/*
	Function: mostraDicionario
	
	Abre uma nova janela do navegador com a lista de palavras do dicionário.
	*/
	mostraDicionario: function() {
		var w = window.open();
		for (k in i3GEO.idioma.DICIONARIO) { w.document.write(k+" = "+i3GEO.idioma.traduzir(k)+"<br>"); }
	},

	/*
	Function: trocaIdioma
	
	Troca o idioma atual por outro.
	
	A troca é baseada na definição de um cookie e reload da página.
   
	Parameters:
	codigo - {String} Código do idioma (p.e. "en")
	*/
	trocaIdioma: function(codigo) {
		i3GEO.util.insereCookie("i3geolingua",codigo);
		window.location.reload(true)
	},
	/*
	Function: listaIdiomas
	
	Lista os idiomas disponíveis no dicionário ativo
   
	Returns:
	{Array} Array com os códigos de idioma disponíveis.
	*/
	listaIdiomas: function() {
		for (k in i3GEO.idioma.DICIONARIO){
			return (i3GEO.util.listaChaves(i3GEO.idioma.DICIONARIO[k][0]));
		}
	},
	/*
	Function: mostraSeletor
	
	Inclui as bandeiras no mapa permitindo a seleção do idioma
	
	As imagens das bandeiras devem estar definidas no CSS do i3geo, recebendo como identificadores
	os ids uk,brasil,italiano,espanhol
	*/
	mostraSeletor: function(){
		//alert(i3GEO.idioma.MOSTRASELETOR)
		if(!i3GEO.idioma.MOSTRASELETOR){return;}
		//
		//monta o elemento HTML com as bandeiras
		//
		var ins = "";
		var n = i3GEO.idioma.SELETORES.length;
		if(i3GEO.parametros.w < 550)
		{var w = "width:12px;"}
		else {var w = "";}
		for(i=0;i<n;i++){
			ins += '<img  style="'+w+'padding:0 0px;top:-7px;padding-right:0px;border: 1px solid white;" src="'+i3GEO.util.$im("branco.gif")+'" onclick="i3GEO.idioma.trocaIdioma(\''+i3GEO.idioma.SELETORES[i]+'\')" ';
			if(i3GEO.idioma.SELETORES[i] == "en")
			ins += 'alt="Ingles" id="uk" />';
			if(i3GEO.idioma.SELETORES[i] == "pt")
			ins += 'alt="Portugues" id="brasil" />';
			if(i3GEO.idioma.SELETORES[i] == "es")
			ins += 'alt="Espanhol" id="espanhol" />';
			if(i3GEO.idioma.SELETORES[i] == "it")
			ins += 'alt="Italiano" id="italiano" />';
		}
		if(i3GEO.idioma.IDSELETOR != "" && $i(i3GEO.idioma.IDSELETOR))
		{$i(i3GEO.idioma.IDSELETOR).innerHTML = ins;}
		else{
			var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDMAPA))
			if(!$i("i3geoseletoridiomas")){
				var novoel = document.createElement("div");
				novoel.innerHTML = ins;
				novoel.id = "i3geoseletoridiomas";
				document.body.appendChild(novoel);
			}
			else
			{var novoel = $i("i3geoseletoridiomas");}
			novoel.style.position = "absolute";
			novoel.style.top = pos[1] - 17 +"px";
			novoel.style.left = pos[0]+"px";
			novoel.style.zIndex = 5000;
		}
	}
};
/*
Function: $trad

Atalho para a função de tradução
  
Parameters:
id - {String} Código do texto.
    
Returns:
{String} Texto traduzido.
*/
var $trad = function(id){return (i3GEO.idioma.traduzir(id))};
//
	try {
		var c = i3GEO.util.pegaCookie("i3geolingua");
		if(c) {
			i3GEO.idioma.define(c);
			g_linguagem = c;
		}
		else {
			if(typeof(g_linguagem) != "undefined")
			{i3GEO.idioma.define(g_linguagem);}
			else {
				g_linguagem = "pt";
				i3GEO.idioma.define("pt");
			}
		}
		if(typeof('g_traducao') != "undefined")
		{i3GEO.idioma.defineDicionario(g_traducao);}
	}
	catch(e){alert("Problemas com idiomas "+e);};
//YAHOO.log("carregou classe idioma", "Classes i3geo");