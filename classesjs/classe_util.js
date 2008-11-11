/*
Title: i3geo.util

Utilitários.

Funções gerais de processamento.

Namespace:

i3GEO.util

Exemplos:



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

	Returns:
	(Array) - array com as chaves.
	*/
	listaChaves: function (obj) {
		var keys = [];
		for(var key in obj){
   			keys.push(key);
		}
		return keys;
	}
};