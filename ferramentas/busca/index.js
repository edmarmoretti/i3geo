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

//monta a lista de itens
checkitensf(
	tema,
	function(retorno)
	{
		if (retorno.tipo == "dados")
		{$i("listai").innerHTML = retorno.dados}
		else
		{document.body.innerHTML = retorno.dados}
	}
	,"listai"
)

function procurar()
{
	aguarde("block")
	var inputs = $i("listai").getElementsByTagName("input")
	var listai = new Array;
	for (i=0;i<inputs.length; i++)
	{
		if (inputs[i].checked == true)
		{listai.push(inputs[i].id+";"+inputs[i].name)}
	}
	if (listai.length == 0)
	{alert("selecione um item");aguarde("none")}
	else
	{
		if ($i("palavra").value == "")
		{alert("digite uma palavra")}
		else
		{
			$i("resultado").innerHTML = "";
			var tipo = "exata";
			if ($i("qualquer").checked == true)
			{tipo = "qualquer"}
			var onde = "mapa";
			if ($i("regiao").checked == true)
			{onde = "regiao"}
			var palavra = $i("palavra").value;
			var palavra = removeAcentos(palavra);
			var l = listai.toString();
			var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listavaloresitens&palavra="+palavra+"&lista="+l+"&tipo="+tipo+"&onde="+onde
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("json");
			cp.call(p,"buscaRegistros",listaretornof);
		}
	}
}
//monta o resultado
function listaretornof(retorno)
{
	aguarde("none")
	var naoEncontrado = "<p style=color:red >Nenhum registro encontrado<br>"
	var ins = new Array()
	if (retorno.data != undefined)
	{
		var palavra = $i("palavra").value;
		for (tema=0;tema<retorno.data.length; tema++)
		{
		 var linhas = retorno.data[tema].resultado
		 for (linha=0;linha<linhas.length; linha++)
		 {
			ins.push("<table><tr><td onclick='zoomf(\""+linhas[linha].box+"\")'style='cursor:pointer;color:navy'>zoom</td><td onclick='pinf(\""+linhas[linha].box+"\")'style='color:navy;cursor:pointer;'>localiza</td></tr></table>")
			for (i=0;i<linhas[linha].valores.length; i++)
			{
				var er = new RegExp(palavra, "gi");
				var tr = (linhas[linha].valores[i].valor).replace(er,"<span style=color:red >"+palavra+"</span>")
				ins.push("&nbsp;" + linhas[linha].valores[i].item + ": " + tr + "<br><br>")
				var naoEncontrado = ""
			}
		 }
		}
		$i("resultado").innerHTML=naoEncontrado+ins.join("")
		$i("resultado").style.borderLeft = "1px solid rgb(235,235,235)"
		$i("resultado").style.backgroundColor = "rgb(250,250,250)"
	}
	else
	{$i("resultado").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
}