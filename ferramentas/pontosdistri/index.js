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
ativaGuias("")
mostraGuia("guia1")
//eventos das guias
$i("guia1").onclick = function()
{mostraGuia("guia1")}
$i("guia2").onclick = function()
{mostraGuia("guia2")}
$i("guia3").onclick = function()
{mostraGuia("guia3")}
aguarde("block")
comboTemasPt("temasPt",function(retorno)
{
	if (retorno.tipo == "dados")
	{	
		var ins = "Escolha o tema:<br><br>"
		ins += retorno.dados
		ins += "<br><br><div style=top:0px;left:0px;text-align:left; onclick='analiseDensidade()' ><input id=botao1 size=35  type=button value='densidade de pontos' /></div><br>"
		ins += "<div style=top:0px;left:0px;text-align:left; onclick='analiseDistancia()' ><input id=botao2 size=35  type=button value='dist&acirc;ncia entre pontos' /></div><br>"
		ins += "<div style=top:0px;left:0px;text-align:left; onclick='analiseKernel()' ><input id=botaokernel size=35  type=button value='Kernel' /></div><br>"
		ins += "<div style=top:0px;left:0px;text-align:left; onclick='analiseRelatorio()' ><input id=botao3 size=35  type=button value='relat&oacute;rio' /></div><br>"
		$i("guia1obj").innerHTML = ins;
		YAHOO.example.init = function ()
		{
			function onPushButtonsMarkupReady()
			{
				new YAHOO.widget.Button("botao1");
				new YAHOO.widget.Button("botao2");
				new YAHOO.widget.Button("botao3");
				new YAHOO.widget.Button("botao4");
				new YAHOO.widget.Button("botaokernel");
			}
    		YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
		}()
	}
	else
	{document.body.innerHTML = retorno.dados;}
	aguarde("none");		
})	

function vercores()
{
	//window.parent.borra("sim")
	var n = $i("numclasses").value
	var ci = $i("cori").value
	var cf = $i("corf").value
	aguarde("block")
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=verPaleta&numclasses="+n+"&cori="+ci+"&corf="+cf
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"verPaleta",mostracores);
}
function mostracores(retorno)
{
	aguarde("none")
	var retorno = retorno.data.split("*")
	var ins = "<br><br>"
	for (i=0;i<retorno.length;i++)
	{
		ins += "<div style=background-color:rgb("+retorno[i]+") >"+retorno[i]+"</div>"
	}
	$i("mostracores").innerHTML = ins
}
//abre a paleta de cores
function corj(obj)
{window.parent.abreCor("wdocai",obj)}

function analiseKernel()
{
	//window.parent.borra("sim")
	var n = $i("numclasses").value
	var ci = $i("cori").value
	var cf = $i("corf").value
	aguarde("block")
	var tema = $i("temasPt").value
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=analiseDistriPt&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=kernel"
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"analiseDistriPt",window.parent.ajaxredesenha);
}

function analiseDensidade()
{
	//window.parent.borra("sim")
	var n = $i("numclasses").value
	var ci = $i("cori").value
	var cf = $i("corf").value
	aguarde("block")
	var tema = $i("temasPt").value
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=analiseDistriPt&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=densidade"
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"analiseDistriPt",window.parent.ajaxredesenha);
}
function analiseDistancia()
{
	//window.parent.borra("sim")
	var n = $i("numclasses").value
	var ci = $i("cori").value
	var cf = $i("corf").value
	aguarde("block")
	var tema = $i("temasPt").value
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=analiseDistriPt&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=distancia"
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"analiseDistriPt",window.parent.ajaxredesenha);
}
function analiseRelatorio()
{
	//window.parent.borra("sim")
	var n = $i("numclasses").value
	var ci = $i("cori").value
	var cf = $i("corf").value
	aguarde("block")
	var tema = $i("temasPt").value
	var cp = new cpaint();
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=analiseDistriPt&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=relatorio"
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"analiseDistriPt",abreRelatorio);
}
function abreRelatorio(retorno)
{
	window.open(retorno.data)
	aguarde("none")
}
