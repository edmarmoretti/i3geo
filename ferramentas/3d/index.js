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
t0()
function t0()
{
	aguarde("none")
	ins = "<p><img src='../../imagens/3d.png'> Essa &eacute; uma fun&ccedil;&atilde;o ainda experimental!"
	ins += "<p>O modelo 3d do mapa ser&aacute; gerado em WRML. Ap&oacute;s o processamento, o arquivo ficar&aacute; dispon&iacute;vel para download."
	ins += " Para ver o arquivo em 3d vc precisar&aacute; de um software espec&iacute;fico."
	ins += " Experimente utilizar o <a href='http://www.parallelgraphics.com/products/cortona/' target=blank >Cortona</a> ou <a href=http://sourceforge.net/projects/flux target=blank >FLUX</a>"
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	ins = "<p>O tempo de processamento pode variar em fun&ccedil;&atilde;o do tamanho da imagem do mapa."
	ins += "<p>Para obter um melhor resultado, o mapa é sempre reduzido para 400x400 pixels'."
	mostraOpcao("t0()","t2()",ins,"t1")
}
function t2()
{
	ins = "<div style=left:0px;top:0px; >Diminuir o exagero vertical em:</div><br>"
	ins += "<input id=fz size=2 class=digitar type=text value=10 /> x "
 	ins += "<div class=destaca id=dest style=top:10px;display:none ></div>"
	ins += "<div onclick='criar3d()' id=temasRaster style=left:0px;top:0px;width:90% >"
	ins += "<br><input id=botao1 size=20 type='button' value='Criar modelo 3d' /></div>"
	var ins = mensagemOpcao("",ins)
	mostraOpcao("t1()","",ins,"t2")
	YAHOO.example.init = function ()
	{
		function onPushButtonsMarkupReady()
		{new YAHOO.widget.Button("botao1");}
    	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
	}()	
	comboTemasRaster("listaRaster",function(retorno)
	{
		$i("dest").innerHTML = retorno
		if ($i("listaRaster"))
		{$i("dest").style.display="block";$i("dest").innerHTML = "Escolha o tema com os valores de Z ou use o default:"}
		else
		{$i("dest").style.display="none"}
 	})
}
function criar3d()
{
    var raster = ""
    if ($i("listaRaster")){var raster = $i("listaRaster").value}
	var p = g_locaplic+"/ferramentas/3d/3d.php?map3d="+window.parent.g_3dmap+"&fz="+$i("fz").value+"&temaz="+raster
    window.open(p)
}
