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
ins = ""
t0()
function t0()
{
	ins = "<p>Ponto em pol&iacute;gono &eacute; uma opera&ccedil;&atilde;o que resulta em um novo tema contendo o cruzamento entre um tema com pontos e outros com pol&iacute;gonos."
	ins += "<p>As informa&ccedil;&otilde;es do tema poligonal ser&atilde;o agregadas a tabela do novo tema gerado."
	ins += "<p>Para gerar o cruzamento &eacute; necess&aacute;rio que no mapa exista pelo menos um tema poligonal e um com os pontos."
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	comboTemasPt("temasPt",function(retorno)
	{
 		var ins = "Escolha o tema que cont&eacute;m os pontos:<br><br>"
		ins += retorno.dados
 		mostraOpcao("t0()","t2()",ins,"t1")
	})
}
function t2()
{
	var ins = "<div class=alerta >Voc&ecirc; precisa selecionar um tema com os pontos</div>"
	if ($i("temasPt"))
	{
		if ($i("temasPt").value == "")
		{mostraOpcao("t1()","",ins,"t2")}
		else
		{
			checkTemasPolRaster(function(retorno)
			{
 				ins = "Escolha os temas com os pol&iacute;gonos que ser&atilde;o utilizados para cruzar com os pontos:"
				ins += "<br><br><div id=temasPoRaster style=width:90%;height:100px;overflow:auto >"+retorno.dados+"</div>"
				mostraOpcao("t1()","t3()",ins,"t2")
			})
		}	
	}
	else
	{mostraOpcao("t1()","",ins,"t2")}
}
function t3()
{
	ins = "O tema resultante ser&aacute; adicionado ao mapa atual."
	ins += "<br><br><div style=top:0px;left:0px;text-align:left; onclick='cruza()' ><input id=botao1 size=18 type='button' value='Cruzar temas' /></div>"
	mostraOpcao("t2()","",ins,"t3")
	YAHOO.example.init = function ()
	{
		function onPushButtonsMarkupReady()
		{new YAHOO.widget.Button("botao1");}
		YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
	}()	
}
function cruza()
{
	var t = $i("temasPoRaster").getElementsByTagName("input");
	var tsl = new Array(); //temas poligonais
	for (i=0;i<t.length; i++)
	{
		if (t[i].type == "checkbox")
		{
			if (t[i].checked == true)
			{tsl.push(t[i].value);}
		}
	}
	if (tsl == 0)
	{alert("Escolha um tema pelo menos");}
	else
	{
		var fim = function(retorno)
		{
			aguarde("none");
			if (retorno.data==undefined )
			{$i("fim").innerHTML = "Erro. A operação demorou muito.";}
			else
			{
				window.parent.i3GEO.atualiza("");
				$i("fim").innerHTML = retorno.data
			}
		}
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=pontoEmPoligono&temaPt="+$i("temasPt").value+"&temasPo="+tsl.join(",")
		aguarde("block")
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"pontoEmPoligono",fim);
	}
}
