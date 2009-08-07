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
download()
function download()
{
	aguarde("block")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=download&tema="+tema;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"downloadTema",mostraDownload);
}
function mostraDownload(retorno)
{

	aguarde("none")
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		var arqs = retorno.split(",")
		var n = arqs.length;
		if(retorno == "erro")
		{var ins = "<p style=color:red >Ocorreu um erro. O tema não foi encontrado. Pode ser que o código do tema não existe na definição do mapfile. Informe o administrador do sistema.<br>";}
		else
		{
			var ins = "<b>Clique nos links para pegar os arquivos.</b><br><br>"
			for (var arq=0;arq<n;arq++)
			{
				ins += "<a href='"+window.location.protocol+"//"+window.location.host+"/"+arqs[arq]+"'>"+arqs[arq]+"<br>"
			}
		}
	}
	else
	{
		var ins = "<p style=color:red >Ocorreu um erro<br>"
	}
	document.getElementById("resultado").innerHTML = ins

}