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
//pega o elemento boxref para desenhar um retângulo no mapa de referência

//inicializa alguns parâmetros.
parametrosURL()
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()
$i("extatual").innerHTML = window.parent.i3GEO.parametros.mapexten
function aplicar()
{
	try
	{
		$i("extatual").innerHTML = "Para ver a nova extensão aplicada, abra novamente esta ferramenta";
		var x = window.parent.i3GEO.calculo.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);
		var xx = window.parent.i3GEO.calculo.dms2dd($i("xxg").value,$i("xxm").value,$i("xxs").value);
		var y = window.parent.i3GEO.calculo.dms2dd($i("yg").value,$i("ym").value,$i("ys").value);
		var yy = window.parent.i3GEO.calculo.dms2dd($i("yyg").value,$i("yym").value,$i("yys").value);
		if ((x == xx) || (y == yy))
		{alert("Digite coordenadas válidas");return;}
		if ((x > xx) || (y > yy))
		{alert("Digite coordenadas válidas");return;}
		window.parent.i3GEO.navega.zoomExt(g_locaplic,g_sid,window.parent.i3GEO.parametros.tipoimagem,(x+" "+y+" "+xx+" "+yy))
	}
	catch(e){alert(e+" Erro. Digite coordenadas válidas");}
}
//muda o box no mapa de referência
function mudabox()
{
	if((boxref) && !window.parent.document.getElementById("refDinamico").checked)
	{
		var x = window.parent.i3GEO.calculo.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);
		var xx = window.parent.i3GEO.calculo.dms2dd($i("xxg").value,$i("xxm").value,$i("xxs").value);
		var y = window.parent.i3GEO.calculo.dms2dd($i("yg").value,$i("ym").value,$i("ys").value);
		var yy = window.parent.i3GEO.calculo.dms2dd($i("yyg").value,$i("yym").value,$i("yys").value);
		if ((x == xx) || (y == yy))
		{return;}
		if ((x > xx) || (y > yy))
		{return;}
		//calculo da nova posição do box
		var extr = window.parent.objmapa.extentref.split(" ");
		boxref.style.left = ((extr[0] - x) / window.parent.g_celularef) * -1
		boxref.style.width = ((xx - x) / window.parent.g_celularef)
		boxref.style.top = ((extr[3] - yy) / window.parent.g_celularef)
		boxref.style.height = ((yy - y) / window.parent.g_celularef)
	}
}