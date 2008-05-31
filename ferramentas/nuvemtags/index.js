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
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{new YAHOO.widget.Button("botao1");}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()	
aguarde("block")
parametrosURL()
inicio = 0;
function montaNuvem(r)
{
	retorno = r;
	if(retorno.data)
	{
		var tags ="Clique na TAG para localizar temas relacionados<br><br><span onmouseout='this.style.textDecoration=\"none\"' onmouseover='this.style.textDecoration=\"underline\"' onclick='javascript:inicio = inicio+2;montaNuvem(retorno);' style='cursor:pointer;vertical-align:middle;color:navy;font-size:'12'pt;'>menos</span><span>&nbsp;</span>"
		tags +="<span onmouseout='this.style.textDecoration=\"none\"' onmouseover='this.style.textDecoration=\"underline\"' onclick='javascript:inicio = inicio-2;montaNuvem(retorno);' style='cursor:pointer;vertical-align:middle;color:navy;font-size:'12'pt;'>mais</span><br><br>"
		if((inicio < 0) || (inicio > retorno.data.length)){return;}
		for (i=0;i<retorno.data.length;i++)
		{
			if(retorno.data[i].temas.length*1 >= inicio)
			{
				var cor = "98,186,192";
				var h = retorno.data[i].temas.length*1 + 6
				if(h > 23){var h = 23;}
				{
					var linkrss = "";
					if(retorno.data[i].noticias.length > 0)
					{
						var cor = "255,0,0";
						for (r=0;r<retorno.data[i].noticias.length;r++)
						{
							linkrss += "<span><a href='"+retorno.data[i].noticias[r].link+"' target=blanck ><img style=cursor:pointer src='../../imagens/mais.png' title='"+retorno.data[i].noticias[r].titulo+"'/></a></span>" ;
						}
						
					}

					tags += "<span> </span> <span onmouseout='this.style.textDecoration=\"none\"' onmouseover='this.style.textDecoration=\"underline\"' onclick='procurar(this)' style='cursor:pointer;vertical-align:middle;color:rgb("+cor+");font-size:"+h+"pt;'>"+retorno.data[i].tag+"</span>"+linkrss
				}
			}
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
var p = "../../classesphp/mapa_controle.php?funcao=listaTags&rss=&nrss=&g_sid="+g_sid;
cp.call(p,"listaTags",montaNuvem);

function procurar(texto)
{
	if(window.parent.document.getElementById("buscatema"))
	{
		window.parent.document.getElementById("buscatema").value = texto.innerHTML
		window.parent.procurartemas()
	}
}

function buscarss()
{
	var rss = $i("texto").value
	if (rss == ""){alert("Digite um endereco RSS");return;}
	aguarde("block")
	$i("resultado").innerHTML = "Aguarde...";
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaTags&g_sid="+g_sid+"&rss="+rss+"&nrss="+$i("nrss").value;
	cp.call(p,"listaTags",montaNuvem);	
}