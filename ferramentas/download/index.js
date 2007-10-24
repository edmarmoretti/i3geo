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
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		aguarde("none")
		var arqs = retorno.split(",")
		var ins = "Clique nos links para pegar os arquivos e gravar em seu computador. Caso vc deseje alterar os nomes, mantenha as extensões e use o mesmo nome para cada arquivo.<br><br>"
		for (arq=0;arq<arqs.length;arq++)
		{
			var temp = arqs[arq].split(".");
			arqs[arq] = temp[0];
			ins += "<a href='"+window.location.protocol+"//"+window.location.host+arqs[arq]+".shp'>"+arqs[arq]+".shp<br>"
			ins += "<a href='"+window.location.protocol+"//"+window.location.host+arqs[arq]+".dbf'>"+arqs[arq]+".dbf<br>"
			ins += "<a href='"+window.location.protocol+"//"+window.location.host+arqs[arq]+".shx'>"+arqs[arq]+".shx<br><br>"
		}
		$i("resultado").innerHTML = ins
	}
	else
	{
		$i("resultado").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
	aguarde("none")
}