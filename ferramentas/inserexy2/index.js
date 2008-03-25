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
aguarde("block")
ativaGuias("")
mostraGuia("guia1")
//eventos das guias
$i("guia1").onclick = function()
{mostraGuia("guia1");$i("projecao").style.display="none";}
$i("guia2").onclick = function()
{mostraGuia("guia2");$i("projecao").style.display="block";}
$i("guia3").onclick = function()
{mostraGuia("guia3");$i("projecao").style.display="block";}
$i("guia4").onclick = function()
{mostraGuia("guia4");$i("projecao").style.display="none";}
$i("guia5").onclick = function()
{mostraGuia("guia5");$i("projecao").style.display="none";}

window.parent.g_nomepin = ""
mensagemAjuda("men1",$i("men1").innerHTML)
mensagemAjuda("men2",$i("men2").innerHTML)
mensagemAjuda("men3",$i("men3").innerHTML)

radioepsg
(
	function(retorno)
	{
		$i("listaepsg").innerHTML = retorno.dados
	},
	"listaepsg"
)

//pega a lista de temas editaveis
function montaComboLocal()
{
	comboTemasLocais
	(
		"temasLocais",
		function(retorno)
		{
 			aguarde("none")
 			if(retorno.tipo=="erro")
 			{document.body.innerHTML = retorno.dados;return;}
 			retorno = retorno.dados;
 			$i("shapefile").innerHTML = retorno+"<br><br><div style=top:0px;left:0px;text-align:left; onclick='criatemaeditavel()'><input id=botao1 type='button' size=18 value='Cria um novo tema' /></div>"
			YAHOO.example.init = function ()
			{
				function onPushButtonsMarkupReady()
				{
					new YAHOO.widget.Button("botao1");
					new YAHOO.widget.Button("botao2");
					new YAHOO.widget.Button("botao3");
					new YAHOO.widget.Button("botao4");
					new YAHOO.widget.Button("botao5");
					new YAHOO.widget.Button("botao6");
				}
    			YAHOO.util.Event.onContentReady("botao1", onPushButtonsMarkupReady);
			}() 	
 			if ($i("temasLocais"))
 			{
 	 			$i("temasLocais").onchange = function()
 	 			{
					tema = $i("temasLocais").value
					window.parent.g_nomepin=tema
					var cp = new cpaint();
					cp.set_response_type("JSON");
					//cp.set_debug(2)
					var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaPontosShape&tema="+tema;
					cp.call(p,"listaPontosShape",listaPontos);
 	 			}
 			}
		},
		"shapefile"
	)
}
montaComboLocal()
//monta a lista de pontos de um tema
function listaPontos(retorno)
{
	if (retorno.data != undefined)
	{
		var ins = new Array()
		for (i=0;i<retorno.data.length; i++)
		{ins.push("<div style='font-size:12px'>"+retorno.data[i].x+" "+retorno.data[i].y+"</div><br>")}
		$i("resultado").innerHTML = ins.join("");
	}
	else
	{$i("resultado").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
}
//converte o tema para linear
function criaLin()
{
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2) 
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=sphPT2shp&para=linha&tema="+window.parent.g_nomepin;
	cp.call(p,"sphPT2shp",window.parent.ajaxredesenha);
}
//converte o tema para poligonal
function criaPol()
{
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=sphPT2shp&para=poligono&tema="+window.parent.g_nomepin;
	cp.call(p,"sphPT2shp",window.parent.ajaxredesenha);
}
//cria um novo tema editavel
function criatemaeditavel()
{
	aguarde("block")
	$i("resultado").innerHTML = ""
	var cp = new cpaint();
	cp.set_response_type("JSON");
	cp.set_transfer_mode("POST");
	//cp.set_debug(2)
	//var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=criashpvazio";
	//cp.call(p,"criaSHPvazio",ativanovotema);
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid;
	cp.call(p,"criaSHPvazio",ativanovotema,"&funcao=criashpvazio");
}
//ativa o tema com o shape vazio
function ativanovotema(retorno)
{
	aguarde("none")
	if (retorno.data != undefined)
	{
		montaComboLocal()
		window.parent.g_nomepin = retorno.data
		if (window.parent.$i("openlayers"))
		{window.parent.atualizaOL();}
		else
		{window.parent.ajaxredesenha("")}
	}
	else
	{$i("shapefile").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
}
//remove um ponto da lista de pontos quando o mesmo for clicado
function remove(ponto)
{
	var p = ponto.parentNode
	alert("Opcao em implementacao")
}
//gera string wkt com as coordenadas
function wkt()
{
	aguarde("block")
	var divs = $i("resultado")
	var els = divs.childNodes
	var xy = new Array()
	var ultimo = ""
	for (i=0;i<els.length;i++)
	{
		if ((els[i].innerHTML) && (els[i].innerHTML.split(" ").length == 2))
		{
			xy.push(els[i].innerHTML)
			if (ultimo == ""){ultimo = els[i].innerHTML}
		}
	}
	xy = xy.join(" ")
	var cp = new cpaint();
	cp.set_response_type("JSON");
	//cp.set_debug(2)
	cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mostrawkt&xy="+xy,"xy2wkt",mostrawkt);
}
//mostra o formato wkt
function mostrawkt(retorno)
{
	if (retorno.data != undefined)
	{
		var ins = retorno.data[0]+"<br>"
		ins += retorno.data[1]+"<br>"
		ins += retorno.data[2]+"<br>"
		$i("wktres").innerHTML = ins+"<br>"
	}
	else
	{$i("wktres").innerHTML = "<p style=color:red >Ocorreu um erro<br>"}
	aguarde("none")
}
//insere um ponto digitando os valores dms
function inserir()
{
	aguarde("block")
	var reg = new RegExp("w|W|l|L|o|O|'|G|r", "g");
	var regv = new RegExp(",", "g");
	if($i("tipodigcampo").checked)
	{
		if (!$i("longitude").value == "")
		{
			var v = $i("longitude").value + " 0" + " 0"
			v = v.replace(reg,"");
			v = v.replace(regv,".");
			v = v.split(" ");
			var xgv = v[0]
			var xmv = v[1]
			var xsv = v[2]
			var xsv = xsv.replace(",",".");
		}
		if (!$i("latitude").value == "")
		{
			var vv = $i("latitude").value  + " 0" + " 0"
			vv = vv.replace(reg,"");
			vv = vv.replace(regv,".");
			vv = vv.split(" ");
			var ygv = vv[0]
			var ymv = vv[1]
			var ysv = vv[2]
			var ysv = ysv.replace(regv,".");
		}
	}
	if($i("tipodigmascara").checked)
	{		
		var xgv = $i("xg").value;
		var xmv = $i("xm").value;
		var xsv = $i("xs").value;
		var xsv = xsv.replace(regv,".");
		var ygv = $i("yg").value;
		var ymv = $i("ym").value;
		var ysv = $i("ys").value;
		var ysv = ysv.replace(regv,".");
	}
	var xxx = window.parent.convdmsddf(xgv,xmv,xsv);
	var yyy = window.parent.convdmsddf(ygv,ymv,ysv);
	var ins = $i("resultado").innerHTML
	ins = ins + "<div style='display:block;position:relative;top:5px;left:0px;font-size:12px' >" + xxx +" " + yyy + "</div><br>"
	$i("resultado").innerHTML = ins
	var fim = function()
	{aguarde("none");window.parent.ajaxredesenha("");}

	var inputs = $i("listaepsg").getElementsByTagName("input")
	var listai = new Array;
	for (i=0;i<inputs.length; i++)
	{
		if (inputs[i].checked == true)
		{var projecao = inputs[i].value}
	}
	var projecao = pegaProj()
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&"+window.parent.objmapa.sid+"&funcao=insereSHP&tema="+window.parent.g_nomepin+"&xy="+xxx+" "+yyy+"&projecao="+projecao;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"insereSHP",fim);
	$i("longitude").value = ""
	$i("latitude").value = ""
}
function verificaproj()
{
	var p = pegaProj()
	if (p != "")
	{
		escolhedig("digcampo")
		$i("tipodigcampo").checked = true;
	}
}
function pegaProj()
{
	var inputs = $i("listaepsg").getElementsByTagName("input")
	var listai = new Array;
	for (i=0;i<inputs.length; i++)
	{
		if (inputs[i].checked == true)
		{var projecao = inputs[i].value}
	}
	return (projecao)
}
function colar()
{
	var regv = new RegExp(",", "g");
	$i("colar").value = $i("colar").value.replace(regv,".")
	var xys = $i("colar").value.split(" ")
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=insereSHP&tema="+window.parent.g_nomepin+"&xy="+$i("colar").value;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"insereSHP",window.parent.ajaxredesenha);
	var ins = $i("resultado").innerHTML
	var n = new Array()
	for (i = 0;i < xys.length; i = i + 1)
	{if (xys[i] != ""){n.push(xys[i])}}
	for (i = 0;i < n.length; i = i + 2)
	{
		ins = ins + "<div style='font-size:12px'>" + n[i] +" " + n[i+1] + "</div><br>"
	}
	$i("resultado").innerHTML = ins
}
function escolhedig(q)
{
	$i("digmascara").style.display="none";
	$i("digcampo").style.display="none";
	$i(q).style.display="block";
}