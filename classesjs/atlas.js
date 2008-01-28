/*
Title: Atlas

Executa as operações da interface Atlas.

File: i3geo/classesjs/atlas.js

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
/*
Function: iniciaAtlas

Inicializa o Atlas
*/
function iniciaAtlas()
{
	cpObjAtlas = new cpaint();
	cpObjAtlas.set_async("true");
	cpObjAtlas.set_response_type("JSON");
	pegaListaDeAtlas();
}
/*
Function: pegaListaDeAtlas

Pega a lista de Atlas e características principais de cada um.

*/
function pegaListaDeAtlas()
{
	var local = document.getElementById("listaAtlas");
	if (local)
	{
		var monta = function (retorno)
		{
			var texto = "";
			listaAtlas = retorno.data.atlas;
			var i = 0;
			do
			{
				if (listaAtlas[i].ID)
				{
					texto += "<div class='titulo' ><input type='radio' name='atlas' value='"+listaAtlas[i].ID+"'/>&nbsp;";
					texto += listaAtlas[i].TITULO+"</div>";
					texto += "<div class='descricao' >"+listaAtlas[i].DESCRICAO+"</div><br>";
				}
				var i = i + 1;
			}
			while(listaAtlas[i])
			local.innerHTML = texto;
			document.getElementById("tituloinstituicao").innerHTML = retorno.data.tituloinstituicao
		}
		var p = g_locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDeAtlas";
		cpObjAtlas.call(p,"pegaListaDeAtlas",monta);
	}
	else
	{alert("Div listaAtlas nao existe");}
}
