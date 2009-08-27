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
if(tema == "undefined"){tema = "";}
//preenche a lista de itens
checkitensf
(
	tema,
	function(retorno)
	{
		$i("listai").innerHTML = retorno.dados
	},
	"listai"
)
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
		new YAHOO.widget.Button("botao2");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()	
//executa a operacao
$i("executar").onclick = function()
{
	//se for vazio o tema nao possui tabela, mas a toponimia pode existir
	var listai = new Array;
	var tema = "";
	var itens = new Array();
	if ($i("listai").innerHTML != "")
	{
		var ipt = $i("listai").getElementsByTagName("input")
		for (i=0;i<ipt.length; i++)
		{
			if (ipt[i].checked)
			{
				itens.push(ipt[i].id);
				var tema = ipt[i].name;
			}
		}
	}
	else {var tema = ipt[i].id;var item = ""}
	if (tema == "")
	{alert("selecione um item");aguarde("none");}
	else
	{
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=ativaEtiquetas&tema="+tema+"&item="+itens.toString(",")
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"ativaEtiquetas",concluido);
	}
}
//remove a etiqueta
$i("remover").onclick = function()
{
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=removeEtiquetas&tema="+tema
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"removeEtiquetas",concluido);
}
function concluido()
{
	aguarde("none")
}