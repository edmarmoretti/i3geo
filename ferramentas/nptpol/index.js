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
temaPt = ""
temaPo = ""
aguarde("block")

t0()

function t0()
{
	aguarde("none")
	var ins = "<p><img src='../../imagens/ptpol.gif'> Ponto em pol&iacute;gono &eacute; uma opera&ccedil;&atilde;o que resulta em um novo tema contendo o cruzamento entre um tema com pontos e outro com pol&iacute;gono, que ficar&aacute; indicado na tabela do novo tema gerado."
	ins += "<p>Para gerar o cruzamento &eacute; necess&aacute;rio que no mapa exista pelo menos um tema poligonal e um com os pontos."
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	comboTemasPt("temasPt",function(retorno)
	{
 		var ins = "Escolha o tema que cont&eacute;m os pontos que ser&atilde;o contados:<br><br>"
		ins += retorno
		ins = mensagemOpcao("",ins)
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
			comboTemasPol("temasPol",function(retorno)
			{
 				ins = "Escolha o tema com os pol&iacute;gonos que ser&atilde;o utilizados para agregar os pontos:<br><br>"
				ins += retorno
				ins = mensagemOpcao("",ins)
				mostraOpcao("t1()","t3()",ins,"t2")
			})
		}	
	}
	else
	{mostraOpcao("t1()","",ins,"t2")}
}
function t3()
{
 	var ins = "<p class=alerta >Voc&ecirc; precisa selecionar um tema com os pol&iacute;gonos</p>"
	if ($i("temasPol"))
	{
		if ($i("temasPol").value != "")
		{
			ins = "O tema resultante ser&aacute; adicionado ao mapa atual.<br><br>"
			ins += "<br><br><div style=top:0px;left:0px;text-align:left; onclick='cruza()' ><input id=botao1 size=18 type='button' value='Cruzar temas' /></div>"
			ins = mensagemOpcao("",ins)
			mostraOpcao("t2()","",ins,"t3")
			YAHOO.example.init = function ()
			{
				function onPushButtonsMarkupReady()
				{new YAHOO.widget.Button("botao1");}
    			YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
			}()	
		}
		else
		{mostraOpcao("t2()","",ins,"t3")}
	}
	else
	{mostraOpcao("t2()","",ins,"t3")}
}
function cruza()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=nptPol&temaPt="+$i("temasPt").value+"&temaPo="+$i("temasPol").value
	aguarde("block")
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	window.parent.borra("sim");
	cp.call(p,"nptPol",window.parent.ajaxredesenha);
}
