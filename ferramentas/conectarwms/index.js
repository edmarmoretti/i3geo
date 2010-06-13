parametrosURL()
//variaveis globais
g_tipo = ""; //tipo de tema
g_tema = ""; //tema selecionado do ws
g_legenda = ""; //legenda do tema
g_nometema = ""; //nome do tema
g_idws = ""
ativaGuias("")
mostraGuia("guia1")
$i("guia1").onclick = function()
{
	mostraGuia("guia1")
	$i("resultadoget").innerHTML = "";
}
$i("guia2").onclick = function(){clickGuia2();}
$i("guia3").onclick = function(){clickGuia3();}

function getcapabilities()
{
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		//wms esri so aceita 1.1.1
		window.open($i("servico").value+"&service=wms&request=getcapabilities&version=1.1.1")
	}
}

function clickGuia2()
{
	mostraGuia("guia2")
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		$i("guia2obj").style.display="block";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=getcapabilities2&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"getcapabilities2",metadados);
	}
}
function clickGuia3()
{
	mostraGuia("guia3")
	if ($i("servico").value == ""){alert("Serviço não definido");}
	else
	{
		$i("listatemas").innerHTML = "";
		aguarde("block")
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=temaswms&id_ws="+g_idws+"&servico="+$i("servico").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"temaswms",listatemas);
	}
}
function registraws(nome,id_ws)
{
	$i("servico").value = nome;
	g_tipo = ""; //tipo de tema
	g_tema = ""; //tema selecionado do ws
	g_legenda = ""; //legenda do tema
	g_nometema = ""; //nome do tema
	if(arguments.length == 2)
	g_idws = id_ws
	else
	g_idws = ""
	clickGuia3()
}

function metadados(retorno)
{
	if (retorno.data != undefined)
	{
		aguarde("none");
		$i("resultadoget").innerHTML = retorno.data;
	}
	else
	{
		aguarde("none")
		$i("resultadoget").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}
function listatemas(retorno)
{
	g_idws = "";
	aguarde("none");
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		$i("listatemas").innerHTML = retorno.data;
		g_tipo = ""; //tipo de tema
		g_tema = ""; //tema selecionado do ws
		g_legenda = ""; //legenda do tema
		g_nometema = ""; //nome do tema
		g_sld = "";
		if ($i("suportasld"))
		{
			if ($i("suportasld").value != "nao")
			{
				if ($i("textoSLD"))
				$i("textoSLD").style.display = "block";
			}
		}
	}
	else
	{$i("listatemas").innerHTML = "erro";}
}
function seltema(tipo,tema,legenda,nometema,nomecamada,sldflag)
{
	g_tipo = tipo; //tipo de tema
	g_tema = tema; //tema selecionado do ws
	g_legenda = legenda; //legenda do tema
	g_nometema = nometema; //nome do tema
	g_nomecamada = nomecamada; //nome que vai na legenda
	g_sld = sldflag; //suporta ou nao sld
	adiciona();
}
function adiciona()
{
	if (g_tema != "")
	{
		var retorno = function(retorno)
		{
			aguarde("none")
			if(retorno.data != "ok")
			{alert("Ooops! Problemas ao acessar o serviço.");aguarde("none");}
			else
			{window.parent.i3GEO.atualiza()}
		}
		aguarde("block");
		var tiporep = $i("tiporep").value
		var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=adicionatemawms&servico="+$i("servico").value+"&tema="+g_tema+"&nome="+g_nometema+"&proj="+$i("proj").value+"&formato="+$i("formatos").value+"&tipo="+g_tipo+"&versao="+$i("versao").value+"&nomecamada="+g_nomecamada+"&tiporep="+tiporep+"&suportasld="+g_sld+"&formatosinfo="+$i("formatosinfo").value
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"adicionatemawms",retorno);
	}
}