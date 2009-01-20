/*
Class:: i3GEO.php

Faz a chamadas em AJAX que executa programas no lado do servidor

File: i3geo/classesjs/classe_php.js

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
Variable: cpJSON

Objeto CPAINT (ver biblioteca CPAINT) utilizado nas chamadas AJAX assíncronas com retorno no formato JSON

Exemplo:

	cpJSON.call()
	
Return:
	
	O objeto CPAINT retorna os dados encapsulados em um objeto JSON. Os programas PHP
	que fazem uso dessa biblioteca (CPAINT) devem fazer o include da mesma.
	Os dados de interesse retornados no objeto JSON, ficam embutidos na propriedade "data", por exemplo:
	
	var temp = function(retorno){alert(retorno.data);}
	
	cpJSON.call(p,"teste",temp);
	
	onde, p contém o nome do programa PHP e seus parâmetros
	"teste" é o nome da função PHP (no caso do i3Geo, isso não afeta em nada)
	e temp é a função que tratará o retorno dos dados.
	
*/
cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
i3GEO.php = {
	insereSHPgrafico: function(funcao,tema,x,y,itens,shadow_height,width,inclinacao){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+x+"&y="+y+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHPgrafico",funcao);
	}
};