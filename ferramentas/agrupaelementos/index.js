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
tema = ""
comboTemasSel("temasComSel",function(retorno){comboTemas = retorno.dados})
t0()

function t0()
{
	ins = "<p>Essa ferramenta transforma v&aacute;rios elementos em um s&oacute; criando um pol&iacute;gono."
	ins += "<p>Para definir quais elementos devem ser unidos uns com os outros &eacute; preciso escolher um item da tabela de atributos do tema."
	ins += "Os elementos que possu&iacute;rem o mesmo valor ser&atilde;o considerados no mesmo grupo e suas divisas eliminadas. Caso n&atilde; tenha sido escolhido nenhum item, todas os elementos ser&atilde;o agrupados em um s&oacute;"
	ins += "<p>O resultado final ser&aacute; um novo tema com pol&iacute;gonos diferentes dos originais e cuja tabela de atributos conter&aacute; apenas o item escolhido."
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	ins = "Tema que cont&eacute;m os elementos (pelo menos um elemento deve estar selecionado):<br>"
	ins += comboTemas
	mostraOpcao("t0()","t2()",ins,"t1")
}
function t2()
{
	ins = "Escolha o item da tabela de atributos do tema que ser&aacute; utilizado para agregar. (opcional)"
	var tema = $i("temasComSel").value
	comboitens("selItem",tema,function(retorno)
	{
	 	var combo = retorno.dados
	 	if(retorno.tipo == "erro")
	 	{ins += "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";}
	 	else
	 	{
	 		ins += "<br><br>"+combo;
 			mostraOpcao("t1()","t4()",ins,"t3")
	 	}
	})
}
function t4()
{
	ins = "O tema com os pol&iacute;gonos novos ser&aacute; adicionado ao mapa atual."
	ins += "<br><br><div onclick='calcula()' style='text-align:left;left:0px'><input id=botao1 size=18 class=executar type='buttom' value='Continuar' /></div>"
	mostraOpcao("t3()","",ins,"t4")
	YAHOO.example.init = function ()
	{
		function onPushButtonsMarkupReady()
		{new YAHOO.widget.Button("botao1");}
    	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
	}()	
}
function calcula()
{
	$i("fim").innerHTML ="";
	var tema = $i("temasComSel").value
	var item = $i("selItem").value
	if(tema == ""){alert("Escolha um tema.");return;}
	//if(item == ""){alert("Escolha um item.");return;}
	aguarde("block")
	var fim = function(retorno)
	{
		aguarde("none");
		if (retorno.data==undefined )
		{$i("fim").innerHTML = "Erro. A operação demorou muito.";}
		else
		{window.parent.ajaxredesenha("");}
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=agrupaElementos&tema="+tema+"&item="+item
	var cp = new cpaint();
	//cp.set_debug(2);
	cp.set_response_type("JSON");
	//cp.set_persistent_connection(true);
	cp.call(p,"agrupaElementos",fim);
}
