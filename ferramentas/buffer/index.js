<<<<<<< .mine
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
var comboTemasOrigem = ""
comboTemasPt("temasOrigem",function(retorno){comboTemasOrigem = retorno.dados},"","sim")
comboTemasPt("temasDestino",function(retorno){comboTemasDestino = retorno.dados})
t0()

function t0()
{
	ins = "<p>O cálculo de dist&acirc;ncias é feito de um ponto em rela&ccedil;&atilde;o aos mais pr&oacute;ximos."
	ins += "<p>O ponto origem, deve estar selecionado em um dos temas existentes no mapa."
	ins += "<p>Os pontos de destino s&atilde;o selecionados em fun&ccedil;&atilde;o de uma dist&acirc;ncia fixa do ponto origem."
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	ins = "Tema que cont&eacute;m o ponto de origem (pelo menos um ponto deve estar selecionado):<br>"
	ins += comboTemasOrigem
	ins += "<br><br>Tema que cont&eacute;m o(s) ponto(s) de destino:<br>"
	ins += comboTemasDestino
	mostraOpcao("t0()","t2()",ins,"t1")
}
function t2()
{
	if(!$i("temasOrigem")){alert("Nenhum tema com seleção");return;}
	ins = "Dist&acirc;ncia do entorno do ponto de origem em metros"
	ins += "<br><br><input class=digitar id='d' type=text size=10 value='0'/>"
	mostraOpcao("t1()","t3()",ins,"t2")
}
function t3()
{
	ins = "Escolha os itens das tabelas de atributos dos temas de origem e de destino que ser&atilde;o acrescentados ao novo tema que ser&aacute; criado com o resultado do c&aacute;lculo."
	var temaOrigem = $i("temasOrigem").value
	var temaDestino = $i("temasDestino").value
	ins += "<br><br>Para o tema de origem:"
	comboitens("selItemOrigem",temaOrigem,function(retorno)
	{
	 	var comboDeOrigem = retorno.dados
	 	if(retorno.tipo == "erro")
	 	{ins += "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";}
	 	else
	 	{
	 		ins += "<br><br>"+comboDeOrigem;
			comboitens("selItemDestino",temaDestino,function(retorno)
			{
	 			ins += "<br><br>Para o tema de destino:"
	 			var comboDeDestino = retorno.dados
	 			if(retorno.tipo == "erro")
	 			{ins += "<br><br><span style='color:red'>erro ao ler os itens do tema de destino</span><br><br>";}
	 			else
	 			{
	 				ins += "<br><br>"+comboDeDestino;
		 			mostraOpcao("t1()","t4()",ins,"t3")
	 			}
			}
			)		 	
	 	}
	}
	)
}
function t4()
{
	ins = "O tema com o entorno e as dist&acirc;ncias ser&atilde;o adicionados ao mapa atual."
	ins += "<br><br><div onclick='calcula()' style='text-align:left;left:0px'><input id=botao1 size=18 class=executar type='buttom' value='Calcular' /></div>"
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
	var distancia = $i("d").value
	var temaOrigem = $i("temasOrigem").value
	var temaDestino = $i("temasDestino").value
	if ((distancia*1 > 0) && (temaOrigem != "") && (temaDestino != ""))
	{
		aguarde("block")
		var fim = function(retorno)
		{
			aguarde("none");
			if (retorno.data==undefined )
			{$i("fim").innerHTML = "Erro. A operação demorou muito.";}
			else
			{window.parent.i3GEO.atualiza("");}
		}
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=distanciaptpt&temaorigem="+temaOrigem+"&temadestino="+temaDestino+"&distancia="+distancia+"&itemorigem="+$i("selItemOrigem").value+"&itemdestino="+$i("selItemDestino").value
		var cp = new cpaint();
		//cp.set_debug(2);
		cp.set_response_type("JSON");
		//cp.set_persistent_connection(true);
		cp.call(p,"distanciaptpt",fim);
	}
	else
	{$i("fim").innerHTML = "Algum par&acirc;metro n&atilde;o foi preenchido.";}
}
=======
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
//
//detecta iframe id
//
/*
var frs = window.parent.document.getElementsByTagName("iframe")
var nframes = frs.length;

for(f=0;f<nframes;f++){
	if(frs[f].src == window.location.href){
		alert(frs[f].parentNode.parentNode.id)
	}
}
*/
comboTemasSel("temasComSel",function(retorno){comboTemas = retorno.dados;t0()})


function t0()
{
	ins = "<p>O entorno, ou buffer, &eacute; um pol&iacute;gono que circunda um elemento geogr&aacute;fico em uma dist&acirc;ncia fixa."
	ins += "<p>Para gerar o entorno, voc&ecirc; precisa selecionar alguns elementos de um tema. Utilize para isso a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de atributos do tema desejado."
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	ins = "Tema que ser&aacute; utilizado:<br><br>"
	ins += comboTemas
	mostraOpcao("t0()","t2()",ins,"t1")
}
function t2()
{
	ins = "Dist&acirc;ncia do entorno em metros"
	ins += "<br><input class=digitar id='d' type=text size=10 value='0'/><br><br>"
	ins += "Considerar os elementos selecionados como se fossem um s&oacute;?";
	ins += "<br><select id=unir ><option value=nao selected >n&atilde;o</option><option value=sim >sim</option></select>"
	mostraOpcao("t1()","t3()",ins,"t2")
}
function t3()
{
	ins = "O tema com o entorno ser&aacute; adicionado ao mapa atual."
	ins += "<br><br><div onclick='criarbuffer()' style='text-align:left;left:0px'><input id=botao1 size=18 class=executar type='buttom' value='Criar entorno' /></div>"
	mostraOpcao("t2()","",ins,"t3")
	YAHOO.example.init = function ()
	{
		function onPushButtonsMarkupReady()
		{new YAHOO.widget.Button("botao1");}
    	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
	}()	
}
function criarbuffer()
{
	$i("fim").innerHTML ="";
	var distancia = $i("d").value
	tema = $i("temasComSel").value
	if (distancia*1 != 0)
	{
		aguarde("block")
		var fim = function(retorno)
		{
			aguarde("none");
			if (retorno.data==undefined )
			{$i("fim").innerHTML = "Erro. A operação demorou muito.";}
			else
			{window.parent.i3GEO.atualiza("");}
		}
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=criabuffer&tema="+tema+"&distancia="+distancia+"&unir="+$i("unir").value
		var cp = new cpaint();
		//cp.set_debug(2);
		cp.set_response_type("JSON");
		//cp.set_persistent_connection(true);
		cp.call(p,"criaBuffer",fim);
	}
	else
	{alert("Distancia invalida")}
}
>>>>>>> .r1096
