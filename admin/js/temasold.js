/*
Title: Arvore

Funções javascript utilizadas no sistema de administração do menu de mapas

File: i3geo/admin/mapas.js

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

$i = function(i)
{return document.getElementById(i);};

YAHOO.namespace("example.container");

function pegaClasses(codigoMap,codigoLayer)
{
	var ins = "<br><fieldset style='background-color:beige'><legend>+- Classes</legend><div style=display:none >"
	ins += "<p><input onclick=adicionarClasse('"+codigoLayer+"',this) type=button value='Adicionar classe' /></p>"
	ins += "<br><fieldset><legend>+- Legenda (amostra)</legend><div style=display:none >"
	ins += "<img id='legenda_"+codigoLayer+"' src='../ogc.php?tema=bioma&service=wms&request=getlegendgraphic&layer="+codigoLayer+"&format=image/png' />"
	ins += "</div></fieldset>"
	var retorna = function(retorna)
	{
		var nc = retorna.data.length
		for(c=0;c<nc;c++)
		{
			d = retorna.data[c]
					
			ins += (geraLinhas2(d.dados,param,"salvarClasse"));

			var param = {
				"linhas":[
				]
			}

			ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >"
			ins += (geraLinhas2(d.dados,param,"salvarClasse"));
			ins += "</fieldset>"
			//labels
			ins += "<br><fieldset><legend style=color:brown >+- Label (para ativar, defina LABELITEM em caract. gerais)</legend><div style=display:none >"		
			var param = {
				"linhas":[
				]
			}

			
			ins += (geraLinhas2(d.dados,param,"salvarClasseLabel"));
			var param = {
				"linhas":[
				]
			}			
			ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >"
			ins += (geraLinhas2(d.dados,param,"salvarClasseLabel"));
			ins += "</fieldset>"

			ins += "</div></fieldset>"

			ins += "<br><fieldset><legend style=color:brown >+- Estilos</legend><div style=display:none >"
			ins += "<p><input onclick=adicionarEstilo('"+codigoLayer+"','"+d.id+"',this) type=button value='Adicionar estilo' /></p>"
			ins += "<div id='estilos_"+codigoLayer+"_"+d.id+"' ></div>"
			ins += "</div></fieldset>"
			ins += "</div></fieldset>"
		}
		ins += "</div></fieldset>"
		$i("classes_"+codigoLayer+"_"+codigoMap).innerHTML = ins
		pegaEstilos(codigoMap,codigoLayer)
	}
	var p = "../php/temas.php?funcao=pegaClasses&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);

}
function pegaEstilos(codigoMap,codigoLayer)
{

	}
	var p = "../php/temas.php?funcao=pegaEstilos&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);
}

function testarMap()
{
	var codigo = $i("temaAtivo").value
	window.open("../testamapfile.php?map="+codigo+".map")
}
function salvarLayer(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";}
	var valor = $i(parametro+"_"+layer).value
	$i(parametro+"_"+layer).style.color="black"
	var p = "../php/temas.php?funcao=alteraLayer&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarMetadados(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";}
	var valor = $i(parametro+"_"+layer).value
	$i(parametro+"_"+layer).style.color="black"
	var p = "../php/temas.php?funcao=alteraMetadados&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarClasse(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var temp = layer.split("_")
	var layer = temp[0]
	var classe = temp[1]
	var retorna = function(retorno)
	{
		icone.src="../imagens/02.png";
		contaN++
		$i('legenda_'+layer).src='../ogc.php?tema='+layer+'&service=wms&request=getlegendgraphic&layer='+layer+'&format=image/png&'+contaN
	}
	var valor = $i(parametro+"_"+layer+"_"+classe).value
	$i(parametro+"_"+layer+"_"+classe).style.color="black"
	var p = "../php/temas.php?funcao=alteraClasse&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarClasseLabel(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var temp = layer.split("_")
	var layer = temp[0]
	var classe = temp[1]
	var parametro = parametro.split(".");
	var parametro = parametro[1]
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";}
	var valor = $i("label_"+parametro+"_"+layer+"_"+classe).value
	$i("label_"+parametro+"_"+layer+"_"+classe).style.color="black"
	var p = "../php/temas.php?funcao=alteraClasseLabel&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarEstilo(estilo,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var temp = estilo.split("_")
	var layer = temp[1]
	var classe = temp[2]
	var estilo = temp[3]
	var retorna = function(retorno)
	{
		icone.src="../imagens/02.png";
		contaN++
		$i('legenda_'+layer).src='../ogc.php?tema='+layer+'&service=wms&request=getlegendgraphic&layer='+layer+'&format=image/png&'+contaN
	}
	var valor = $i(parametro+"_"+layer+"_"+classe+"_"+estilo).value
	$i(parametro+"_"+layer+"_"+classe+"_"+estilo).style.color="black"
	var p = "../php/temas.php?funcao=alteraEstilo&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&estilo="+estilo+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function adicionarClasse(codigoLayer,botao)
{
	botao.style.color="red"
	var o = botao.value
	botao.value = "Aguarde..."
	var codigoMap = $i("temaAtivo").value
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			pegaClasses(codigoMap,codigoLayer)
		}
		var p = "../php/temas.php?funcao=adicionarClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		cPaint.call(p,"",retorna);		
	}
}
function adicionarEstilo(codigoLayer,codigoClasse,botao)
{
	botao.style.color="red"
	var o = botao.value
	botao.value = "Aguarde..."
	var codigoMap = $i("temaAtivo").value
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			pegaEstilos(codigoMap,codigoLayer)
		}
		var p = "../php/temas.php?funcao=adicionarClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&codigoClasse="+codigoClasse;
		cPaint.call(p,"",retorna);		
	}
}
function excluirClasse(codigoLayer,codigoClasse,botao)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		botao.style.color="red"
		var o = botao.value
		botao.value = "Aguarde..."
		var codigoMap = $i("temaAtivo").value
		if(codigoMap != "")
		{
			var retorna = function(retorno)
			{
				pegaClasses(codigoMap,codigoLayer)
			}
			var p = "../php/temas.php?funcao=excluirClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&codigoClasse="+codigoClasse;
			cPaint.call(p,"",retorna);		
		}
	}
}
function excluirLayer(codigoLayer,botao)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		botao.style.color="red"
		var o = botao.value
		botao.value = "Aguarde..."
		var codigoMap = $i("temaAtivo").value
		if(codigoMap != "")
		{
			var retorna = function(retorno)
			{
				ativaTema(codigoMap)
			}
			var p = "../php/temas.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
			cPaint.call(p,"",retorna);		
		}
	}
}
YAHOO.util.Event.addListener(window, "load", initMenu);