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
parametrosURL()

if($i("temas")){
	aguarde("block")
	comboTemasLigados("tema",function(retorno)
	{
 		$i("temas").innerHTML = retorno.dados
 		aguarde("none")
 		$i("tema").onchange = function()
		{
	 		$i("itens").innerHTML = "";
			comboitens("item",$i("tema").value,function(retorno)
			{
	 			$i("itens").innerHTML = retorno.dados
			},"itens","item")
			if ($i("temas").value == "")
			alert("Selecione um tema");
		}
	},"temas","tema")	
}
//document.getElementById("g_sid").value = g_sid
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()
function submete()
{
	$i("f").submit()
}
if($i("listaepsg"))
{
	radioepsg
	(
		function(retorno)
		{
		$i("listaepsg").innerHTML = retorno.dados
		},
		"listaepsg"
	)
}