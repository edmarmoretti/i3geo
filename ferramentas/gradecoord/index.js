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
mensagemAjuda("men1",$i("men1").innerHTML)
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()
//preenche a lista de fontes
var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype"
var cp = new cpaint();
//cp.set_debug(2)
cp.set_response_type("JSON");
cp.call(p,"listaTrueType",listafontesf);

//monta a lista de fontes
function listafontesf(retorno)
{
	var retorno = retorno.data
	var lista = retorno.split(",")
	var ins = "<select id=fonte >"
	ins = ins + "<option value=bitmap >bitmap</option>"
	for (i=0;i<lista.length;i++)
	{ins = ins + "<option value="+lista[i]+" >"+lista[i]+"</option>"}
	ins = ins + "</select>"
	$i("listaf").innerHTML = ins
	aguarde("none")
}
function executa()
{
	if (($i("intervalo").value == 0) || ($i("intervalo").value == ""))
	{alert("Entre com a distância entre os pontos")}
	else
	{
		var temp = function()
		{
			aguarde("none")
			window.parent.i3GEO.atualiza("")
		}
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=gradeCoord"
		p += "&intervalo="+$i("intervalo").value
		p += "&corlinha="+$i("corlinha").value
		p += "&larguralinha="+$i("larguralinha").value
		p += "&tipolinha="+$i("tipolinha").value
		p += "&tamanhotexto="+$i("tamanhotexto").value
		p += "&cortexto="+$i("cortexto").value
		p += "&incluitexto="+$i("incluitexto").value
		p += "&mascara="+$i("mascara_i").value
		p += "&shadowcolor="+$i("shadowcolor").value
		p += "&shadowsizex="+$i("shadowsizex").value
		p += "&shadowsizey="+$i("shadowsizey").value
		p += "&fonte="+$i("fonte").value
		
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"gradeCoord",temp);
	}
}
function corj(obj)
{window.parent.i3GEO.util.abreCor("wdocai",obj)}