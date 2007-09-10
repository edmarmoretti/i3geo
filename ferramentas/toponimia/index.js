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
mensagemOpcao("opc1","")
//preenche a lista de itens
radioitensf(tema,function(retorno){$i("listai").innerHTML = retorno})
YAHOO.example.init = function ()
{
	function onPushButtonsMarkupReady()
	{
		new YAHOO.widget.Button("botao1");
	}
   	YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
}()
//eventos das guias
$i("guia1").onclick = function()
{$i("guia1obj").style.display="block";}
$i("guia2").onclick = function()
{$i("guia2obj").style.display="block";}
$i("guia3").onclick = function()
{$i("guia3obj").style.display="block";}
$i("guia4").onclick = function()
{$i("guia4obj").style.display="block";}
$i("guia5").onclick = function()
{$i("guia5obj").style.display="block";testa()}
//executa a operacao
$i("executar").onclick = function()
{
	var g = $i("listai")
	//se for vazio o tema nao possui tabela, mas a toponimia pode existir
	var tema = "";
	var item = "";
	if (g.innerHTML != "")
	{
		var ipt = g.getElementsByTagName("input")
		for (i=0;i<ipt.length; i++)
		{
			if (ipt[i].checked)
			{
				//listai[conta] = ipt[i].id+";"+ipt[i].name //nome do item e nome do layer
				var temp = (ipt[i].id).split(";")
				var tema = temp[1]
				var item = temp[0]
			}
		}
	}
	else {var tema = ipt[i].id;var item = ""}
	if (tema == "")
	{alert("selecione um item");aguarde("none");}
	else
	{
		var f = $i("fonte_i").value
		var t = $i("tamanho_i").value
		var a = $i("angulo_i").value
		var cf = $i("fundoc_i").value
		if (cf == ""){cf = "off"}
		var cs = $i("sombra_i").value
		if (cs == ""){cs = "off"}
		var xs = $i("sombrax_i").value
		var ys = $i("sombray_i").value
		var c = $i("frente_i").value
		var m = $i("mascara_i").value
		if (m == ""){m = "off"}
		var fcs = $i("frentes_i").value
		if (fcs == ""){fcs = "off"}
		var fxs = $i("frentex_i").value
		var fys = $i("frentey_i").value
		var forca = $i("force_i").value
		var md = $i("mindistance_i").value
		var mf = $i("minfeaturesize_i").value
		var ox = $i("offsetx_i").value
		var oy = $i("offsety_i").value
		var pl = $i("partials_i").value
		var pos = $i("position_i").value
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=criatoponimia&position="+pos+"&partials="+pl+"&offsetx="+ox+"&offsety="+oy+"&minfeaturesize="+mf+"&mindistance="+md+"&force="+forca+"&shadowcolor="+fcs+"&shadowsizex="+fxs+"&shadowsizey="+fys+"&outlinecolor="+m+"&cor="+c+"&sombray="+ys+"&sombrax="+xs+"&sombra="+cs+"&fundo="+cf+"&angulo="+a+"&tamanho="+t+"&fonte="+f+"&item="+item+"&tema="+tema
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"criaToponimia",window.parent.remapaf);
	}
}
function testa()
{
	var monta = function(retorno)
	{
	 	$i("teste").innerHTML= "<img src='"+retorno.data+"' >"
	}
	$i("teste").innerHTML="Aguarde..."
	var g = $i("listai")
	//se for vazio o tema nao possui tabela, mas a toponimia pode existir
	var listai = new Array;
	if (g.innerHTML != "")
	{
		var ipt = g.getElementsByTagName("input")
		for (i=0;i<ipt.length; i++)
		{
			if (ipt[i].checked)
			{
				var temp = (ipt[i].id).split(";")
				var tema = temp[1]
				var item = temp[0]
			}
		}
	}
	else {var tema = ipt[i].id;var item = ""}
	if (tema == "")
	{alert("selecione um item");aguarde("none");}
	else
	{
		var f = $i("fonte_i").value
		var t = $i("tamanho_i").value
		var a = $i("angulo_i").value
		var cf = $i("fundoc_i").value
		if (cf == ""){cf = "off"}
		var cs = $i("sombra_i").value
		if (cs == ""){cs = "off"}
		var xs = $i("sombrax_i").value
		var ys = $i("sombray_i").value
		var c = $i("frente_i").value
		var m = $i("mascara_i").value
		if (m == ""){m = "off"}
		var fcs = $i("frentes_i").value
		if (fcs == ""){fcs = "off"}
		var fxs = $i("frentex_i").value
		var fys = $i("frentey_i").value
		var forca = $i("force_i").value
		var md = $i("mindistance_i").value
		var mf = $i("minfeaturesize_i").value
		var ox = $i("offsetx_i").value
		var oy = $i("offsety_i").value
		var pl = $i("partials_i").value
		var pos = $i("position_i").value
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=criatoponimia&position="+pos+"&partials="+pl+"&offsetx="+ox+"&offsety="+oy+"&minfeaturesize="+mf+"&mindistance="+md+"&force="+forca+"&shadowcolor="+fcs+"&shadowsizex="+fxs+"&shadowsizey="+fys+"&outlinecolor="+m+"&cor="+c+"&sombray="+ys+"&sombrax="+xs+"&sombra="+cs+"&fundo="+cf+"&angulo="+a+"&tamanho="+t+"&fonte="+f+"&tipo=teste&tema="+tema+"&item="+item
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"criaToponimia",monta);
	}
}
//preenche a lista de fontes
var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype"
var cp = new cpaint();
//cp.set_debug(2)
cp.set_response_type("JSON");
cp.call(p,"listaTrueType",listafontesf);

//monta a lista de fontes
function listafontesf(retorno)
{
	var retorno = retorno.data
	var lista = retorno.split(",")
	var ins = "<select id=fonte_i >"
	ins = ins + "<option value=bitmap >bitmap</option>"
	for (i=0;i<lista.length;i++)
	{ins = ins + "<option value="+lista[i]+" >"+lista[i]+"</option>"}
	ins = ins + "</select>"
	$i("listaf").innerHTML = ins
	aguarde("none")
}
//termina
function concluidof()
{
	window.parent.remapaf()
}
//muda cor do input
//abre a paleta de cores
function corj(obj)
{window.parent.abreCor("wdocai",obj)}
