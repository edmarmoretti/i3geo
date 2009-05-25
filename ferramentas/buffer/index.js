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
