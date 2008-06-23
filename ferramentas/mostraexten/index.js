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
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()
$i("extatual").innerHTML = window.parent.objmapa.extent
function aplicar()
{
	try
	{
		var temp = function (retorno)
		{
			eval(retorno.data)
			$i("extatual").innerHTML = mapexten
			window.parent.ajaxredesenha("")
		}
		var x = window.parent.convdmsddf($i("xg").value,$i("xm").value,$i("xs").value);
		var xx = window.parent.convdmsddf($i("xxg").value,$i("xxm").value,$i("xxs").value);
		var y = window.parent.convdmsddf($i("yg").value,$i("ym").value,$i("ys").value);
		var yy = window.parent.convdmsddf($i("yyg").value,$i("yym").value,$i("yys").value);
		if ((x == xx) || (y == yy))
		{alert("Digite coordenadas válidas");return;}
		var cp = new cpaint();
		cp.set_response_type("JSON");
		//cp.set_debug(2) 
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+window.parent.g_tipoimagem+"&ext="+x+" "+y+" "+xx+" "+yy+"&g_sid="+window.parent.g_sid;
		cp.call(p,"sphPT2shp",temp);
	}
	catch(e){alert("Digite coordenadas válidas");}
}
