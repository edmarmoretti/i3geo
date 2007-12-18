/*
Title: Redesenho

Executa as operações de redesenho do mapa.

Obtém os parâmetros necessários ao funcionamento da interface, como resolução, escala, etc.

File: i3geo/classesjs/redesenho.js

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
Function: ajaxhttp (depreciado)

Cria o objeto http utilizado nas funções Ajax.

Returns:

Objeto httprequest.

See Also:

<ajaxexecAS>
*/
function ajaxhttp()
{
	try
	{var objhttp1 = new XMLHttpRequest();}
	catch(ee)
	{
		try{var objhttp1 = new ActiveXObject("Msxml2.XMLHTTP");}
		catch(e)
		{
			try{var objhttp1 = new ActiveXObject("Microsoft.XMLHTTP");}
			catch(E)
			{var objhttp1 = false;}
		}
	}
	return(objhttp1);
}
/*
Function: ajaxexecAS (depreciado)

Executa uma chamada ajax no modo assíncrono.

Parameters:

programa - programa que será executado.
funcao - função que tratará o resultado.

Returns:

O resultado em uma variável. Se o retorno contiver a palavra "Erro", é gerado um alert.

See Also:

<ajaxhttp>
*/
function ajaxexecAS(programa,funcao)
{
	var ohttp = ajaxhttp();
	ohttp.open("POST",programa,true);
	var retorno = "";
	ohttp.onreadystatechange=function()
	{
		if (ohttp.readyState==4)
		{
			retorno = ohttp.responseText;
			var reg = /Warning/gi;
			if (retorno.search(reg) != -1)
			{
				alert("OOps! Ocorreu um erro\n"+retorno);
				return;
			}
			var reg = /erro/gi;
			if (retorno.search(reg) != -1)
			{
				alert("OOps! Ocorreu um erro\n"+retorno);
				return;
			}
			if (funcao != "volta")
			{eval(funcao+'("'+retorno+'")');}
		}
	};
	ohttp.send(null);
}
/*
Function: ajaxexec (depreciado)

Executa uma chamada ajax no modo síncrono.

Parameters:

programa - programa que será executado.
funcao - função que tratará o resultado.

Returns:

O resultado em uma variável. Se o retorno contiver a palavra "Erro", é gerado um alert.

See Also:

<ajaxhttp>
*/
function ajaxexec(programa,funcao)
{
	var objhttp = ajaxhttp();
	objhttp.open('GET', programa, false);
	objhttp.send(null);
	if(objhttp.status == 200)
	{
		if (funcao != "volta")
		{eval(funcao+'("'+objhttp.responseText+'")');}
		else
		{return objhttp.responseText;}
	}
}
/*
Function: ajaxexecASXml

Executa uma chamada ajax no modo assíncrono retornando o resultado em XML.

Parameters:

programa - programa que será executado.
funcao - função que tratará o resultado.

Returns:

O resultado em um objeto DOM. Se o retorno contiver a palavra "Erro", é gerado um alert.

See Also:

<ajaxhttp>
*/
function ajaxexecASXml(programa,funcao)
{
	if (programa.search("http") == 0)
	{
		var h = window.location.host;
		if (programa.search(h) < 0)
		{
			alert("OOps! Nao e possivel chamar um XML de outro host.\nContacte o administrador do sistema.\nConfigure corretamente o ms_configura.php");
			return;
		}
	}	
	var ohttp = ajaxhttp();
	ohttp.open("GET",programa,true);
	var retorno = "";
	ohttp.onreadystatechange=function()
	{
		if (ohttp.readyState==4)
		{
			var retorno = ohttp.responseText;
			if (retorno != undefined)
			{
				if (document.implementation.createDocument)
				{
					var parser = new DOMParser();
					var dom = parser.parseFromString(retorno, "text/xml");
				}
				else
				{
					var dom = new ActiveXObject("Microsoft.XMLDOM");
					dom.async="false";
					dom.load(programa);
				}
			}
			else
			{var dom = "erro";}
			if (funcao != "volta")
			{eval(funcao+'(dom)');}
			else
			{return dom;}
		}
	};
	ohttp.send(null);
}
/*
Function: ajaxEscalaGrafica

Substituí a imagem da escala gráfica pela última gerada.

Parameters:

retorno - string no formato "var scaimagem='nome da imagem'".

*/
function ajaxEscalaGrafica(retorno)
{
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		eval(retorno.data);
		if ($i("imagemEscalaGrafica"))
		{
			var m = new Image();
			m.src = scaimagem;
			$i("imagemEscalaGrafica").src=m.src;
			//atualiza quadro
			gravaQuadro("escala",scaimagem);
		}
	}
}
/*
Function: ajaxReferencia

Substituí a imagem do mapa de referência pela última gerada.

Parameters:

retorno - string no formato "var refimagem='nome da imagem'".
*/
function ajaxReferencia(retorno)
{
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		eval(retorno.data);
		if ($i("imagemReferencia"))
		{
			var m = new Image();
			m.src = refimagem;
			$i("imagemReferencia").src=m.src;
			if ((objmapa.scale < 15000000) && (objmapa.scale > 10000000))
			{
				$i("refmensagem").innerHTML = "Para navegar no mapa principal, voc&ecirc; pode clicar em um ponto no mapa de refer&ecirc;ncia.";
				$i("refmensagem").style.fontSize="10px";
			}
			else
			{
				$i("refmensagem").innerHTML = "";
				$i("refmensagem").style.fontSize="0px";
			}
		}
		gravaQuadro("referencia",refimagem);
	}
}
/*
Function: ajaxLegendaHTML

Substituí a legenda do mapa pela última gerada.

Parameters:

retorno - string HTML com a legenda.
*/
function ajaxLegendaHTML(retorno)
{
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		var s = g_locaplic+"/imagens/solta.gif";
		$i("legenda").innerHTML = "<img src="+s+" title='clique para liberar'/><div id='corpoLegi' >"+ retorno.data.legenda + "</div>";
		g_legendaHTML = retorno.data.legenda;
		//
		//verifica se a janela móvel existe e preenche com a legenda se for o caso
		//
		if ($i("moveLegi"))
		{$i("wlegenda").innerHTML = g_legendaHTML;}
		//
		//abre a janela móvel com a legenda quando o usuário clica no ícone solta.gif definido acima
		//
		$i("legenda").onclick = function()
		{
			//
			//cria a janela móvel para a legenda se já não existir
			//
			if (!$i("moveLegi"))
			{
				var novoel = document.createElement("div");
				novoel.id = "moveLegi";
				novoel.style.display="block";
				var temp = '<div class="hd">Legenda</div>';
				temp += '<div id="wlegenda" style="text-align:left;background-color:white" >';
				temp += g_legendaHTML+"</div>";
				novoel.innerHTML = temp;
				document.body.appendChild(novoel);
				YAHOO.namespace("moveLegi.xp");
				YAHOO.moveLegi.xp.panel = new YAHOO.widget.Panel("moveLegi", {width:"300px", fixedcenter: true, constraintoviewport: false, underlay:"shadow", close:true, visible:true, draggable:true, modal:false } );
			}
			YAHOO.moveLegi.xp.panel.render();
			YAHOO.moveLegi.xp.panel.show();
		};
	}
}
/*
Function: ajaxLegendaImagem

Armazena a imagem da legenda na lista de quadros de animação.

Parameters:

retorno - string no formato "var legimagem='nome da imagem'".
*/
function ajaxLegendaImagem(retorno)
{
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		eval(retorno.data);
		if ($i("lugarquadros"))
		{gravaQuadro("legenda",legimagem);}
	}
}
/*
Function: ajaxCorpoMapa

Atualiza a imagem do corpo do mapa e redesenha o entorno se for necessário.

Parameters:

retorno - string no formato "var mapimagem='nome da imagem'".
*/
function ajaxCorpoMapa(retorno)
{
	$i("mst").style.display="block";
	if (!$i("img")){return;}
	objaguarde.abre("ajaxCorpoMapa1",$trad("o3"));
	//retorno não é um objeto CPAINT
	if (retorno.data){retorno = retorno.data;}
	if ((retorno != "erro") && (retorno != undefined))
	{
		eval(retorno);
		$i("img").onload =  function()
		{
			//atualiza quadro
			avancaQuadro();
			gravaQuadro("imagem",mapimagem);
			g_quadrooriginal = mapimagem;
			if ($i("banners"))
			{$i("banners").style.height = objmapa.h;}
			if ($i("legenda"))
			{$i("legenda").style.height = objmapa.h;}
			$i("img").style.width = objmapa.w;
			$i("img").style.height = objmapa.h;
			calcposf();
			objaguarde.fecha("ajaxCorpoMapa1");
			if ($i("imgtemp"))
			{$i("imgtemp").style.display="none";}
			$i("img").onload = "";
		};
		$i("img").src=mapimagem;
	}
	else
	{
		calcposf();
		trataErro();
		alert("Erro no mapa");
	}
}
/*
Function: ajaxredesenha

Prepara o mapa para receber os elementos que comporão o mapa e chama a função que irá gerar os novos elementos.

Parameters:

retorno - string indicando se houve erro na função que chamou.
*/
function ajaxredesenha(retorno)
{
	try
	{richdraw.clearWorkspace();}catch(e){};
	var original = retorno;
	if (retorno.data)
	{var retorno = retorno.data;}
	else {retorno = "";}
	if ((retorno != "erro") && (retorno != undefined))
	{
		if (retorno.search("var mapimagem=") > -1)
		{objaguarde.abre("ajaxiniciaParametros",$trad("o1"));ajaxIniciaParametros(original);}
		else
		{
			//algumas variï¿½eis nï¿½ sï¿½ retornadas, conforme o programa, entï¿½ devem ser declaradas
			var legimagem = "";
			//pega os parametros do mapa e redesenha
			if($i("img"))
			{
				objaguarde.abre("ajaxiniciaParametros",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=corpo&tipoimagem="+g_tipoimagem+"&g_sid="+g_sid;
				var cp = new cpaint();
				//cp.set_debug(2)
				cp.set_response_type("JSON");
				cp.call(p,"redesenhaCorpo",ajaxIniciaParametros);
			}
			objaguarde.fecha("ajaxredesenha");
			if ($i("img_d"))
			{$i("img_d").style.display = "none";}
			g_destaca = "";
			//
			//utilizado na interface openlayers
			//
			//OL = objeto map do openlayers
			//OLI3Geo = objeto layer do openlayers com o mapa do I3Geo
			//
			if ($i("openlayers"))
			{
				$i("openlayers").innerHTML = "";
				var b = objmapa.OL.getExtent();
				criaOL(Math.random()+Math.random()+Math.random()+Math.random());
				objmapa.OL.zoomToExtent(b);
			}
		}
	}
}
/*
Function: ajaxIniciaParametros

Refaz o mapa e os elementos marginais, como legenda, escala, lista de temas, etc.

Parameters:

retorno - string no formato "var variavel='valor'".
*/
function ajaxIniciaParametros(retorno)
{
	var tempo = "";
	if ($i("openlayers"))
	{
		$i("openlayers").innerHTML = "";
		var b = objmapa.OL.getExtent();
		criaOL(Math.random()+Math.random()+Math.random()+Math.random());
		objmapa.OL.zoomToExtent(b);
	}
	//
	//limpa os objetos tips da tela
	//
	if(objmapa.objtips.length > 0)
	{
		var ot = objmapa.objtips.length-1;
		if (ot >= 0)
		{
			do
			{
				if (objmapa.objtips[ot])
				{	
					objmapa.objtips[ot].innerHTML = "";
					objmapa.objtips[ot].style.display="none";
				}
			}
			while(ot--)
		}
	}
	objmapa.objtips = new Array();
	//
	//limpa os pontos digitados no calculo de distancia
	//
	limpacontainerf();
	//
	//mostra a figura que segue o mouse
	//
	if($i("imgh"))
	{$i("imgh").style.display="block";}
	if(retorno.data)
	{var retorno = retorno.data;}
	if ((retorno != "erro") && (retorno != undefined))
	{
		if ($i("imgL"))
		{
			var letras=["N","S","L","O"];
			for (var l=0;l<4; l++)
			{$i("img"+letras[l]).src="";}
		}
		temas = "";
		mapscale = "";
		mapexten = "";
		if (retorno != "")
		{eval(retorno);}
		if($i("img"))
		{
			if (!$i("imgtemp"))
			{
				var ndiv = document.createElement("div");
				ndiv.id = "imgtemp";
				ndiv.style.position = "absolute";
				ndiv.style.border = "1px solid blue";
				document.getElementById("corpoMapa").appendChild(ndiv);
			}
			if(g_tipoacao == "pan")
			{
				$i("imgtemp").style.left = parseInt($i("img").style.left);
				$i("imgtemp").style.top = parseInt($i("img").style.top);
				$i("imgtemp").style.width = objmapa.w;
				$i("imgtemp").style.height = objmapa.h;
				$i("imgtemp").style.display="block";
				$i("imgtemp").style.backgroundImage = 'url("'+$i("img").src+'")';
			}		
			$i("img").style.width = 0;
			$i("img").style.height = 0;
			$i("img").src = "";
			$i("img").style.left = 0;
			$i("img").style.top = 0;
			ajaxCorpoMapa(retorno);
		}
		//
		//atualiza a legenda
		//
		objmapa.atualizaLegendaHTML();
		//
		//verifica se precisa mudar a lista de temas
		//
		objmapa.atualizaListaTemas(temas);
		//
		//atualiza o indicador de compatibilidade de escala se houve um processo de navegacao
		//
		objmapa.atualizaFarol(mapscale);
		//
		//atualiza mapa de referencia
		//
		objmapa.atualizaReferencia(mapexten);
		//
		//atualliza os valores do objmapa
		//
		objmapa.scale = mapscale;
		g_operacao = "";
		objmapa.temas = temas;
		objmapa.cellsize = g_celula;
		objmapa.extent = mapexten;
		objmapa.temas = temas;
		//
		//arredonda o valor da escala numerica e mostra no mapa se for o caso
		//
		if ($i("escalanum"))
		{$i("escalanum").value=parseInt(mapscale);}
		//
		//atualiza a janela com o valor da extensão geográfica do mapa se for o caso
		//
		if ($i("mensagemt"))
		{$i("mensagemt").value = mapexten;}
		//
		//grava a extensao geográfica nova no quadro de animação
		//
		gravaQuadro("extensao",mapexten);
		//
		//fecha as janelas de aguarde
		//
		objaguarde.fecha("ajaxiniciaParametros");
		objaguarde.fecha("aguardedoc");
		objaguarde.fecha("ajaxredesenha");
		if (g_lenteaberta == "sim")
		{
			objaguarde.abre("ajaxabrelente",$trad("o4"));
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid;
			var cp = new cpaint();
			//cp.set_debug(2);
			cp.set_response_type("JSON");
			cp.call(p,"lente",ajaxabrelente);
		}
		//
		//atualiza as ferramentas de consulta que dependem da extensão geográfica
		//
		objmapa.verificaNavegaMapa;
		//
		//atualiza as imagens do entorno do mapa caso essa opçãoestiver ativa
		//
		if (g_entorno == "sim")
		{
			geraURLentorno();
			ajustaEntorno();
		}
	}
	mostradicasf("","Tempo de redesenho em segundos: "+tempo,"");
}
/*
Function: ajaxabrelente

Substituí a imagem da lente de aumento e mostra no mapa.

Parameters:

retorno - string no formato "largura,altura,imagem".
*/
function ajaxabrelente(retorno)
{
	try
	{
		var retorno = retorno.data;
		if (retorno == "erro"){alert("A lente nao pode ser criada");return;}
		var volta = retorno.split(",");
		var nimg = volta[2];
		var olente = $i('lente');
		var oboxlente = $i('boxlente');
		var olenteimg = $i('lenteimg');
		olenteimg.src = nimg;
		olenteimg.style.width=volta[0] * 1.5;
		olenteimg.style.height=volta[1] * 1.5;
		olente.style.zIndex=1000;
		olenteimg.style.zIndex=1000;
		oboxlente.style.zIndex=1000;
		eval ("olente.style." + g_tipoleft + " = imagemxi + g_posicaoLenteX + g_postpx");
		eval ("olente.style." + g_tipotop + " = imagemyi + g_posicaoLenteY + g_postpx");
		eval ("oboxlente.style." + g_tipoleft + " = imagemxi + g_posicaoLenteX + g_postpx");
		eval ("oboxlente.style." + g_tipotop + " = imagemyi + g_posicaoLenteY + g_postpx");
		oboxlente.style.display='block';
		oboxlente.style.visibility='visible';
		olente.style.display='block';
		olente.style.visibility='visible';
		objaguarde.fecha("ajaxabrelente");
	}
	catch(e){trataErro();}
}
/*
Function: ajaxdestaca

Prepara a imagem utilizada na opção de abertura de um tema em uma janela.

Parameters:

retorno - nome da imagem.
*/
function ajaxdestaca(retorno)
{
	var retorno = retorno.data;
	var m = new Image();
	m.src = retorno;
	if (!$i("img_d"))
	{
		var novoel = document.createElement("div");
		novoel.id = "div_d";
		document.body.appendChild(novoel);
		$i("div_d").innerHTML = "<input style='position:relative;top:0px;left:0px'' type=image src='' id='img_d' />";
		$i("div_d").style.left = parseInt($i("corpoMapa").style.left);
		$i("div_d").style.top = parseInt($i("corpoMapa").style.top);
		$i("img_d").style.left = 0;
		$i("img_d").style.top = 0;
		$i("img_d").style.width = objmapa.w;
		$i("img_d").style.height = objmapa.h;
		$i("div_d").style.clip = 'rect(0 75 75 0)';
		$i("img_d").src=retorno;
		var novoeli = document.createElement("div");
		novoeli.id = "div_di";
		novoel.appendChild(novoeli);
		$i("div_di").innerHTML = "<p style='position:absolute;top:0px;left:0px'>+-</p>";
	}
	$i("div_d").innerHTML = "";
	var novoel = document.createElement("input");
	novoel.id = "img_d";
	novoel.style.position = "relative";
	novoel.style.top = "0px";
	novoel.style.left = "0px";
	novoel.type = "image";
	novoel.src = m.src;
	novoel.style.display = "block";
	$i("div_d").appendChild(novoel);
	objaguarde.fecha("ajaxdestaca");
}
//testa se esse script foi carregado
function testaajax()
{}