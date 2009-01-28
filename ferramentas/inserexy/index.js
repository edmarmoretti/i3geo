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
//eventos das guias
$i("guia1").onclick = function()
{$i("guia1obj").style.display="block";}
$i("guia2").onclick = function()
{$i("guia2obj").style.display="block";}
$i("guia3").onclick = function()
{$i("guia3obj").style.display="block";}
$i("guia4").onclick = function()
{$i("guia4obj").style.display="block";wkt();}
aguarde("none")
//remove um ponto da lista de pontos quando o mesmo for clicado
function remove(ponto)
{
	var p = ponto.parentNode
	p.removeChild(ponto)
	aplicar("limpaponto")
}
//gera string wkt com as coordenadas
function wkt()
{
	aguarde("block")
	var divs = $i("resultado")
	var els = divs.childNodes
	var xy = new Array()
	var ultimo = ""
	for (i=0;i<els.length;i++)
	{
		if ((els[i].innerHTML) && (els[i].innerHTML.split(" ").length == 2))
		{
			xy.push(els[i].innerHTML)
			if (ultimo == ""){ultimo = els[i].innerHTML}
		}
	}
	xy = xy.join(" ")
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mostrawkt&xy="+xy,"xy2wkt",mostrawkt);
}
//mostra o formato wkt
function mostrawkt(retorno)
{
	if (retorno.data != undefined)
	{
		var ins = retorno.data[0]+"<br>"
		ins += retorno.data[1]+"<br>"
		ins += retorno.data[2]+"<br>"
		$i("wktres").innerHTML = ins+"<br>"
		//var w = window.open()
		//w.document.write(ins)
	}
	else
	{$i("wktres").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
	aguarde("none")
}
//limpa os pontos do mapa e inclui novos pontos conforme existirem no div resultado
function aplicar(tipo)
{
	var divs = $i("resultado")
	var els = divs.childNodes
	var xy = new Array()
	var ultimo = ""
	for (i=0;i<els.length;i++)
	{
		if ((els[i].innerHTML) && (els[i].innerHTML.split(" ").length == 2))
		{
			xy.push(els[i].innerHTML)
			if (ultimo == ""){ultimo = els[i].innerHTML}
		}
	}
	if (tipo == "ponto")
	{
		tipo = "POINT"
		var pos = "ponto"
	}
	if (tipo == "linha")
	{
		tipo = "LINE"
		var pos = "linha"
	}
	if (tipo == "poligono")
	{
		tipo = "POLYGON"
		var pos = "pol"
		xy.push(ultimo)
	}
	if (tipo == "limpaponto")
	{
		var pos = "ponto"
	}
	xy = xy.join(" ")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=inserefeature&tipo="+tipo+"&pin="+window.parent.g_nomepin+pos+"&xy="+xy
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"insereFeature",window.parent.i3GEO.atualiza);
}
//insere um ponto digitando os valores dms
function inserir()
{
	var xgv = $i("xg").value;
	var xmv = $i("xm").value;
	var xsv = $i("xs").value;
	var ygv = $i("yg").value;
	var ymv = $i("ym").value;
	var ysv = $i("ys").value;
	var xxx = window.parent.convdmsddf(xgv,xmv,xsv);
	var yyy = window.parent.convdmsddf(ygv,ymv,ysv);
	var ins = $i("resultado").innerHTML
	ins = ins + "<div style='cursor:pointer; display:block;position:relative;top:5px;left:0px;' title='clique para remover' onclick='remove(this)'>" + xxx +" " + yyy + "</div><br>"
	$i("resultado").innerHTML = ins
	aplicar("ponto")
}
function colar()
{
	var xys = $i("colar").value.split(" ")
	var ins = $i("resultado").innerHTML
	var n = new Array()
	for (i = 0;i < xys.length; i = i + 1)
	{if (xys[i] != ""){n.push(xys[i])}}
	for (i = 0;i < n.length; i = i + 2)
	{
		ins = ins + "<div title='clique para remover' style='cursor:pointer' onclick='remove(this)'>" + n[i] +" " + n[i+1] + "</div><br>"
	}
	$i("resultado").innerHTML = ins
	aplicar("ponto")
}