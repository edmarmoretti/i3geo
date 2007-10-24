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
$i("l").value = window.parent.objmapa.w
$i("a").value = window.parent.objmapa.h
parametrosURL()
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{new YAHOO.widget.Button("botao1");}
	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()
function executaf()
{
	var l = $i("l").value
	var a = $i("a").value
	if ((l > 5) && (a > 5))
	{
		var doc = window.parent.document
		window.parent.objmapa.w = l
		window.parent.objmapa.h = a
		var pos = "px"
		if (window.parent.navm){pos = ""}
		doc.getElementById("img").style.width= l+pos
		doc.getElementById("img").style.height= a+pos
		doc.getElementById("corpoMapa").style.width= l+pos
		doc.getElementById("corpoMapa").style.height= a+pos
		doc.getElementById("corpoMapa").style.clip = 'rect('+0+" "+(l*1+2)+" "+(a*1+2)+" "+0+')'
		var calc = 5;
		if (doc.getElementById("ferramentas"))
		{calc += parseInt(doc.getElementById("ferramentas").style.width);}
		if (doc.getElementById("contemFerramentas"))
		{calc += parseInt(doc.getElementById("contemFerramentas").style.width);}		
		doc.getElementById("mst").style.width = (l * 1) + calc + pos;
		doc.getElementById("contemImg").style.height= a+pos
		doc.getElementById("contemImg").style.width= l+pos
		window.parent.calcposf()
		window.parent.objaguarde.abre("ajaxredesenha","Aguarde...")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudatamanho&altura="+a+"&largura="+l
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaQS",window.parent.ajaxredesenha);
	}
}