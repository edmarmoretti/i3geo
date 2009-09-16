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
$i("l").value = window.parent.i3GEO.parametros.w
$i("a").value = window.parent.i3GEO.parametros.h
parametrosURL()

new YAHOO.widget.Button("botao1");

function executaf()
{
	var l = $i("l").value
	var a = $i("a").value
	if ((l > 5) && (a > 5))
	{
		var doc = window.parent.document
		window.parent.i3GEO.parametros.w = l
		window.parent.i3GEO.parametros.h = a
		var pos = "px"
		if (window.parent.navm){pos = ""}
		doc.getElementById(window.parent.i3GEO.Interface.IDMAPA).style.width= l+pos
		doc.getElementById(window.parent.i3GEO.Interface.IDMAPA).style.height= a+pos
		doc.getElementById(window.parent.i3GEO.Interface.IDCORPO).style.width= l+pos
		doc.getElementById(window.parent.i3GEO.Interface.IDCORPO).style.height= a+pos
		doc.getElementById(window.parent.i3GEO.Interface.IDCORPO).style.clip = 'rect('+0+" "+(l*1+2)+" "+(a*1+2)+" "+0+')'
		var calc = 5;
		if (doc.getElementById("ferramentas"))
		{calc += parseInt(doc.getElementById("ferramentas").style.width);}
		if (doc.getElementById("contemFerramentas"))
		{calc += parseInt(doc.getElementById("contemFerramentas").style.width);}		
		if(doc.getElementById("mst"))
		doc.getElementById("mst").style.width = (l * 1) + calc + pos;
		if(doc.getElementById("contemImg"))
		{
			doc.getElementById("contemImg").style.height= a+pos
			doc.getElementById("contemImg").style.width= l+pos
		}
		/*
		for(var g=0;g<12;g++)
		{
			if (window.parent.document.getElementById("guia"+g))
			{
				window.parent.document.getElementById("guia"+g+"obj").style.height = window.parent.objmapa.h;
			}
		}
		*/
		//window.parent.calcposf()
		//window.parent.objaguarde.abre("i3GEO.atualiza","Aguarde...")
		var temp = function(){
			window.parent.i3GEO.atualiza();
			window.parent.i3GEO.guias.ajustaAltura();
			aguarde("none")
		}
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudatamanho&altura="+a+"&largura="+l
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaQS",temp);
	}
}