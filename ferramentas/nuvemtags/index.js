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
aguarde("block")
parametrosURL()

var montaNuvem = function(retorno)
{
	if(retorno.data)
	{
		var tags = ""
		for (i=0;i<retorno.data.length;i++)
		{
			//eval("var h = retorno.data."+tag)
			var h = retorno.data[i].temas.length*1 + 7
			tags += "<span> </span> <span onmouseout='this.style.textDecoration=\"none\"' onmouseover='this.style.textDecoration=\"underline\"' onclick='procurar(this)' style='cursor:pointer;vertical-align:middle;color:rgb(98,186,192);font-size:"+h+"pt;'>"+retorno.data[i].tag+"</span"
		}
	}
	else
	{var tags = "Nenhum tag encontrado"}
	$i("resultado").innerHTML = tags;
	aguarde("none")
}

//pega a lista de tags
$i("resultado").innerHTML = "Aguarde...";
var cp = new cpaint();
cp.set_response_type("JSON");
//cp.set_debug(2)
var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaTags&sid="+g_sid;
cp.call(p,"listaTags",montaNuvem);

function procurar(texto)
{
	if(window.parent.document.getElementById("buscatema"))
	{
		window.parent.document.getElementById("buscatema").value = texto.innerHTML
		window.parent.procurartemas()
	}
}