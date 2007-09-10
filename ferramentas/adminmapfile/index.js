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
//eventos das guias
$i("guia1").onclick = function()
{$i("guia1obj").style.display="block";carregaMapFileAtual()}
$i("guia2").onclick = function()
{$i("guia2obj").style.display="block";listaMapsTemas()}
$i("guia3").onclick = function()
{$i("guia3obj").style.display="block";listaCamadasAtuais()}
carregaMapFileAtual()
if(navm)
{
 	$i("mapfileatual").cols = 55
 	$i("mapfileatual").rows = 19
 	$i("mapfiletema").cols = 55
 	$i("mapfiletema").rows = 19
}
function salvaTemaAtual()
{
	var testaMapa = function testaMapa(retorno)
	{
		alert(retorno.data)
	}
	if(window.confirm("O arquivo "+$i("nometemaatual").value+".map será sobreposto. Continua?"))
	{	
		var texto = $i("mapfiletemaatual").value
		var r = new RegExp("\\n","g")
 		texto = texto.replace(r,"###");
 		var r = new RegExp("\\t","g")
 		texto = texto.replace(r,"  ");
		var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=salvaMapFileTema"
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.set_transfer_mode('POST');
		cp.call(p,"salvaMapFileTema",testaMapa,texto,"x",$i("nometemaatual").value+".map"); 
	}
}
function testaTemaAtual()
{
	var testaMapa = function testaMapa()
	{
		window.open("../../testamapfile.php?map=temas/testamapa.map")
	}
	var texto = $i("mapfiletemaatual").value
	var r = new RegExp("\\n","g")
 	texto = texto.replace(r,"###");
 	var r = new RegExp("\\t","g")
 	texto = texto.replace(r,"  ");
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=salvaMapFileTema"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.set_transfer_mode('POST');
	cp.call(p,"salvaMapFileTema",testaMapa,texto,"x","testamapa.map"); 
}
//le o mapfile atual
function carregaMapFileAtual()
{
	$i("mapfileatual").value = ""
	aguarde("block")
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=carregaMapFileAtual"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	var executa = function(retorno)
	{
		 $i("mapfileatual").value = retorno.data;
		 aguarde("none")
	}
	cp.call(p,"carregaMapFileAtual",executa); 	
}
function salvaMapFileAtual()
{
 	aguarde("block")
	var texto = $i("mapfileatual").value
	var r = new RegExp("\\n","g")
	texto = texto.replace(r,"###");
	var r = new RegExp("\\t","g")
	texto = texto.replace(r,"  ");
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=salvaMapFileAtual"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.set_transfer_mode('POST');
	cp.call(p,"salvaMapFileAtual",window.parent.remapaf(),texto,"x");
}
function listaCamadasAtuais()
{
	$i("mapfiletemaatual").value = ""
	aguarde("block")
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=listaCamadasAtuais"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	var executa = function(retorno)
	{
	 	if (retorno.data)
	 	{
	 		var combo = "<select id='comboCamadas' onchange='carregaCamadaAtual()'>"
			combo += '<option value="" selected >----</option>'
			var lista = retorno.data.split(",")
			for (i=0;i<lista.length;i++)
			{combo +='<option value="'+lista[i]+'">'+lista[i]+'</option>'}
			combo += "</select>"
			$i("listaCamadas").innerHTML = combo;
		}
		else
		{$i("listaCamadas").innerHTML = "<span style=color:red >Nenhum tema para editar.</span>"}
		aguarde("none")
	}
	cp.call(p,"listaCamadasAtuais",executa); 	
}
function carregaCamadaAtual()
{
	$i("mapfiletemaatual").value = ""
	var tema = $i("comboCamadas").value
	if (tema != "")
	{
		var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=textoCamadaAtual&tema="+tema
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		var executa = function(retorno)
		{
			$i("mapfiletemaatual").value = retorno.data
		}
		cp.call(p,"textoCamadaAtual",executa);
	}
	$i("nometemaatual").value = tema
}
function listaMapsTemas()
{
	$i("mapfiletema").value = ""
	aguarde("block")
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=listaMapsTemas"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	var executa = function(retorno)
	{
	 	var combo = "<select id='comboMaps' onchange='carregaMapFileTema()'>"
		combo += '<option value="0" selected >----</option>'
		var lista = retorno.data.split(",")
		for (i=0;i<lista.length;i++)
		{combo +='<option value="'+lista[i]+'">'+lista[i]+'</option>'}
		combo += "</select>"
		$i("listaMaps").innerHTML = combo;
		aguarde("none")
	}
	cp.call(p,"listaMapsTemas",executa); 	
}
function carregaMapFileTema()
{
	$i("nomemap").value = $i("comboMaps").value
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=carregaMapFileTema&tema="+$i("comboMaps").value
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	var executa = function(retorno)
	{
		 $i("mapfiletema").value = retorno.data;
	}
	cp.call(p,"carregaMapFileTema",executa); 	
}
function testaMapFileTema()
{
	var testaMapa = function testaMapa()
	{
		window.open("../../testamapfile.php?map=temas/testamapa.map")
	}
	var texto = $i("mapfiletema").value
	var r = new RegExp("\\n","g")
 	texto = texto.replace(r,"###");
 	var r = new RegExp("\\t","g")
 	texto = texto.replace(r,"  ");
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=salvaMapFileTema"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.set_transfer_mode('POST');
	cp.call(p,"salvaMapFileTema",testaMapa,texto,"x","testamapa.map"); 
}
function salvaMapFileTema()
{
	var testaMapa = function testaMapa(retorno)
	{
		alert(retorno.data)
	}
	if(window.confirm("O arquivo "+$i("nomemap").value+" será sobreposto. Continua?"))
	{	
		var texto = $i("mapfiletema").value
		var r = new RegExp("\\n","g")
 		texto = texto.replace(r,"###");
 		var r = new RegExp("\\t","g")
 		texto = texto.replace(r,"  ");
		var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=salvaMapFileTema"
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.set_transfer_mode('POST');
		cp.call(p,"salvaMapFileTema",testaMapa,texto,"x",$i("nomemap").value); 
	}
}
function incluirTema()
{
	var testaMapa = function testaMapa(retorno)
	{
		window.parent.remapaf()
	}
	var p = g_locaplic+"/classesphp/admin.php?g_sid="+g_sid+"&funcao=incluirTema&tema="+$i("nomemap").value
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.set_transfer_mode('GET');
	cp.call(p,"incluirTema",testaMapa); 
}