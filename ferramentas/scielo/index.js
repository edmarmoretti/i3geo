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
buscascielo()
//pega a lista de temas editaveis
function buscascielo()
{
	$i("resultadoscielo").innerHTML = "Aguarde...";
	if (window.parent.objmapa.scale > 150001)
	{
		var ins = "Aproxime mais o mapa <br>(pelo menos até a escala 1:150.000)!";
		ins += "<br><br><div style=width:80px onclick='ajustarescala()' ></div>" //<input  id=botao1 size=20  type=button value='Ajustar escala' /></div>"
		$i("resultadoscielo").innerHTML = ins;
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
	var p = g_locaplic+"/ferramentas/scielo/funcoes.php?funcao=listaartigos&ret="+window.parent.objmapa.extent;
	cp.call(p,"listaartigos",listaartigos);
}
function listaartigos(retorno)
{
	$link = "http://www.scielo.br/scielo.php?script=sci_abstract&pid=";
	if(retorno.data == "")
	{$i("resultadoscielo").innerHTML = "N&atilde;o foi poss&iacute;vel acessar os dados";return}
	var res = retorno.data.scielo
	var ins = "<span style=color:red>Navegue pelo mapa para ver o resultado!</span><br><br>"
	if (res.length == 0)
	{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
	else
	{
		for (i=0;i<res.length;i++)
		{
			ins += "<br><a href='"+$link+res[i].codigo+"' target=blank >"+res[i].titulo+"</a><br><br>"
		}
	}
	$i("resultadoscielo").innerHTML = ins;
}
function ajustarescala()
{
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&g_sid="+g_sid+"&escala=150000";
	cp.call(p,"mudaescala",window.parent.ajaxredesenha);
}