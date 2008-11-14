/*
Title: i3geo.idioma

Tradução da interface principal.

Fornece os métodos para traduzir frases para idiomas específicos.

O dicionário é definido em i3geo/classesjs/dicionario.js

Se você está customizando o i3geo,acrescentandonovas funcionalidades,
utilize o método alteraDicionario para acrescentar novas traduções, dessa forma,
quandoo usuário escolher oidioma ainterface será adaptada corretamente.

Namespace:

i3GEO.idioma

Dependências:

i3GEO.util <classe_util.js>

Exemplos:

i3GEO.idioma.define("pt");

i3GEO.idioma.defineDicionario(g_traducao);

i3GEO.idioma.alteraDicionario("d22","novo oi");

alert($trad("d22"))

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
i3GEO.idioma = {
	/*
	Function: define
	Define qual o idioma em uso. O default é "pt". 
   
	Parameters:
	codigo - {String} Código do idioma.
	*/
	define: function(codigo) {
		this.ATUAL = codigo;
		i3GEO.util.insereCookie("i3geolingua",codigo);
	},
	/*
	Function: retornaAtual
	Retorna o idioma atual. 
       
	Returns:
	{string} Código do idioma.
	*/	
	retornaAtual: function() {
		return (this.ATUAL);
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
		this.DICIONARIO = obj;
	},
	/*
	Function: alteraDicionario
	Altera um texto do dicionario ou acresecenta um novo texto para o idioma atual. 
   
	Parameters:
	id - {String} Código do texto.
	novo - (String) Novo texto.
     
	*/
	alteraDicionario: function(id,novo) {
		this.DICIONARIO[id][0][this.ATUAL] = novo;
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
		if(this.DICIONARIO[id]){
			var t = this.DICIONARIO[id][0];
			return t[this.ATUAL];
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
		for (k in novodic) { this.DICIONARIO[k] = novodic[k]; }
	},
	/*
	Function: mostraDicionario
	Abre uma nova janela do navegador com a lista de palavras do dicionário.
	*/
	mostraDicionario: function() {
		var w = window.open();
		for (k in this.DICIONARIO) { w.document.write(k+" = "+i3GEO.idioma.traduzir(k)+"<br>"); }
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
		for (k in this.DICIONARIO){
			return (i3GEO.util.listaChaves(this.DICIONARIO[k][0]));
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
//para efeitos de compatibilidade define as variaveis g_traducao e g_linguagem
//define pt como default
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
catch(e){alert(e);};
