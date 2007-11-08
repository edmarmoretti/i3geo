/*
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
//inicializa
parametrosURL()
buscawiki()
//pega a lista de temas editaveis
function buscawiki()
{
	$i("resultadowiki").innerHTML = "Aguarde...";
	if (window.parent.objmapa.scale > 500001)
	{
		var ins = "Aproxime mais o mapa (pelo menos até a escala 1:500.000)!";
		ins += "<br><br><div onclick='ajustarescala()' ><input  id=botao1 size=20  type=button value='Ajustar escala' /></div>"
		$i("resultadowiki").innerHTML = ins;
		YAHOO.example.init = function ()
		{
			function onPushButtonsMarkupReady()
			{new YAHOO.widget.Button("botao1");}
   			YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
		}() 	
		return;
	}
	//pega a lista de temas locais do mapfile
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	var p = g_locaplic+"/ferramentas/wiki/funcoes.php?funcao=listaartigos&ret="+window.parent.objmapa.extent;
	cp.call(p,"listaartigos",listaartigos);
}
function listaartigos(retorno)
{
	var ins = "<p>A busca no Mediawiki traz apenas os 20 primeiros resultados"
	ins += "<p>Se a abrang&ecirc;ncia geogr&aacute;fica de busca for muito grande, pode ocorrer erro devido ao tempo de processamento."
	ins += '<p>Mais detalhes sobre a busca, veja <a href="http://www.geonames.org" >Geonames</a>'
	$i("resultadowiki").innerHTML = retorno.data+ins;
}
function ajustarescala()
{
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&g_sid="+g_sid+"&escala=500000";
	cp.call(p,"mudaescala",window.parent.ajaxredesenha);
}