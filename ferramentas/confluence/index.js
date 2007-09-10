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
buscaconfluence()
//pega a lista de temas editaveis
function buscaconfluence()
{
	$i("resultadoconfluence").innerHTML = "Aguarde...";
	if (window.parent.objmapa.scale > 2000001)
	{
		$i("resultadoconfluence").innerHTML = "Aproxime mais o mapa (pelo menos até a escala 1:2.000.000)!";
		mensagemAjuda("resultadoconfluence","")
		return;
	}
	var ext = window.parent.objmapa.extent
	ext = ext.split(" ")
	var xini = parseInt(ext[0])
	var yini = parseInt(ext[1])
	var xfim = parseInt(ext[2])
	var yfim = parseInt(ext[3])
	var xs = new Array()
	for (i=xini;i<xfim;i++)
	{
		xs.push(i)
	}
	var ys = new Array()
	for (i=yini;i<yfim;i++)
	{
		ys.push(i)
	}
	var ins = mensagemAjuda("","Navegue pelo mapa para ver o resultado! Clique no link para abrir a p&aacute;gina sobre o ponto.")
	for (i=0;i<xs.length;i++)
	{
		for (j=0;j<ys.length;j++)
		{
			ins += "<br><a onmouseout='escondexy()' onmouseover='mostraxy(\""+ys[j]+","+xs[i]+"\")' href='http://www.confluence.org/confluence.php?lat="+ys[j]+"&lon="+xs[i]+" ' target=blank >Long. "+xs[i]+" Lat."+ys[j]+"</a><br>"
		}
	}
	$i("resultadoconfluence").innerHTML = ins;
}
function mostraxy(xy)
{
	var xy = xy.split(",")
 	var xy = window.parent.convddtela(xy[1]*1,xy[0]*1,window.parent.document)
	var box = window.parent.$i("boxg")
	box.style.display = "block"
	box.style.width = "5px"
	box.style.height = "5px"
	box.style.top = xy[1]+"px"
	box.style.left = xy[0]+"px"
}
function escondexy()
{
	var box = window.parent.$i("boxg")
	box.style.display = "none"
	box.style.top = "0px"
	box.style.left = "0px"
}