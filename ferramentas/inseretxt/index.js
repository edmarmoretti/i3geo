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
aguarde("block")
ativaGuias("")
mostraGuia("guia1")
comboi = ""
mensagemAjuda("men2",$i("men2").innerHTML);
//eventos das guias
$i("guia1").onclick = function()
{mostraGuia("guia1");$i("tipoInsere").value = "digitando"}
$i("guia2").onclick = function()
{
	mostraGuia("guia2");
	$i("tipoInsere").value = "clicando"
	comboTemasLigados("temasLigados",function(retorno)
	{
 		$i("temasi").innerHTML = retorno.dados
 		aguarde("none")
 		if ($i("temasLigados"))
 		{
 			$i("temasLigados").onchange = function()
 			{
				aguarde("block")
				var tema = $i("temasLigados").value
				$i("men1").style.display = "block"
				var cp = new cpaint();
				//cp.set_debug(2)
				cp.set_response_type("JSON");
				cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",listaItens);
 			}
		}
	},"temasi");
}
$i("guia3").onclick = function()
{mostraGuia("guia3")}
$i("guia4").onclick = function()
{mostraGuia("guia4")}
$i("guia5").onclick = function()
{mostraGuia("guia5")}
mensagemAjuda("men1",$i("men1").innerHTML)
//preenche a lista de fontes
comboTrueType(function(retorno)
{
	$i("listaf").innerHTML = retorno.dados
	aguarde("none")
},"listaf")
function listaItens()
{
	comboitens(
		"itemsel",
		$i("temasLigados").value,
		function(retorno)
		{
			if (retorno.tipo == "dados")
			{$i("listai").innerHTML = retorno.dados}
			else
			{document.body.innerHTML = retorno.dados}
			aguarde("none");
		}
		,"listai"
	)
}

function corj(obj)
{window.parent.abreCor("wdocai",obj)}