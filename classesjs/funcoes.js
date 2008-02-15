/*
Title: Funções gerais

Funções de uso geral para processamento de dados

File: i3geo/classesjs/funcoes.js

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
Function: $im

Retorna o caminho correto de uma imagem.

Exemplo: $im("imagem.png")

Parâmetros:

g - nome da imagem

Retorno:

string - caminho para a imagem
*/
$im = function(g)
{return g_locaplic+"/imagens/visual/"+g_visual+"/"+g;};
/*
Function: $top

Muda a posição (superior) de um objeto tanto no IE como no Firefox.

Exemplo: $top("imagem",100)

Parâmetros:

id - identificador do objeto

valor - posição em relação ao topo.
*/
$top = function(id,valor)
{
	if (navm)
	{document.getElementById(id).style.pixelTop=valor;}
	else
	{document.getElementById(id).style.top=valor+"px";}
};
/*
Function: $left

Muda a posição (esquerda) de um objeto tanto no IE como no Firefox.

Exemplo: $left("imagem",100)

Parâmetros:

id - identificador do objeto

valor - posição em relação a esquerda.
*/
$left = function(id,valor)
{
	if (navm)
	{document.getElementById(id).style.pixelLeft=valor;}
	else
	{document.getElementById(id).style.left=valor+"px";}
};
/*
Function: trataErro

Trata o erro de um try cacth.
*/
function trataErro()
{
	objaguarde.fecha("ajaxdestaca");
	objaguarde.fecha("ajaxabrelente");
	objaguarde.fecha("ajaxiniciaParametros");
	objaguarde.fecha("ajaxredesenha");
	objaguarde.fecha("ajaxCorpoMapaEntorno");
	objaguarde.fecha("ajaxCorpoMapa");
	objaguarde.fecha("ajaxLegenda");
	objaguarde.fecha("ajaxReferencia");
	objaguarde.fecha("ajaxEscalaGrafica");
	objaguarde.fecha("montaMapa");
	objaguarde.fecha("aguardedoc");
}
/*
Function: iCookie

Insere um cookie.
*/
function iCookie(nome,valor)
{
	document.cookie = nome+"="+valor;
}
/*
Function: pCookie

Pega um cookie.
*/
function pCookie(nome)
{
	var cookies = document.cookie;
	var i = cookies.indexOf(nome);
	if(i == -1)
	{return null;}
	var fim = cookies.indexOf(";",i);
	if (fim == -1)
	{var fim = cookies.length;}
	return (unescape(cookies.substring(i,fim))).split("=")[1];
}
/*
Section: interface
*/
function sobeferramentas()
{
	if($i("maisBotoes2"))
	{
		var elementos = $i("maisBotoes2").getElementsByTagName("div");
		if(elementos[0].style.display == "inline")
		{return;}
		if(elementos.length > 0)
		{
			//mostra o primeiro botão
			var mostra = elementos[0];
			var i = 0;
			do
			{
				if(elementos[i].style)
				{
					if(elementos[i].style.display == "inline")
					{break;}
					if(elementos[i].style.display == "none")
					{var mostra = elementos[i];}
				}
				var i = i + 1;
			}
			while(i < elementos.length)
			mostra.style.display="inline";
			//esconde o último botao
			var i = elementos.length - 1;
			var mostra = elementos[i];
			do
			{
				if(elementos[i].style)
				{
					if(elementos[i].style.display == "inline")
					{var mostra = elementos[i];break;}
				}
				var i = i - 1;
			}
			while(i >= 0)
			mostra.style.display="none";
		}
	}

}
function desceferramentas()
{
	var tipo = "inline";
	if($i("maisBotoes2"))
	{
		var elementos = $i("maisBotoes2").getElementsByTagName("div");
		if(elementos[elementos.length - 1].style.display == tipo)
		{return;}
		if(elementos.length > 0)
		{
			//esconde o primeiro botao
			var i = 0;
			do
			{
				if(elementos[i].style)
				{
					if((elementos[i].style.display == "block") || (elementos[i].style.display == "inline") || (elementos[i].style.display == ""))
					{elementos[i].style.display="none";break;}
				}
				var i = i + 1;
			}
			while(i < elementos.length)
			//mostra o último botao
			var i = elementos.length-1;
			var mostra = elementos[i];
			do
			{
				if(elementos[i].style)
				{
					if(elementos[i].style.display == tipo)
					{break;}
					if(elementos[i].style.display == "none")
					{var mostra = elementos[i];}
				}
				var i = i - 1;
			}
			while(i >= 0)
			mostra.style.display=tipo;
		}
	}
}
/*
Function: trocallingua

Troca a linguagem atual.

Parameters:

lingua
*/
function trocalingua(l)
{
	try
	{
		iCookie("i3geolingua",l);
		window.location.reload(true)	
	}
	catch(e){alert("Erro ao mudar lingua");}
}
/*
Function: criaContainerRichdraw

Cria os elementos dom necessários ao uso das funções de desenho sobre o mapa.
*/
function criaContainerRichdraw()
{
	try
	{
		if (!$i("divGeometriasTemp"))
		{
			var novoel = document.createElement("div");
			novoel.id = "divGeometriasTemp";
			var ne = novoel.style;
			ne.cursor="crosshair";
			ne.zIndex=0;
			ne.position="absolute";
			ne.width=objmapa.w;
			ne.height=objmapa.h;
			ne.border="1px solid black";
			ne.display="none";
			ne.top=imagemyi;
			ne.left=imagemxi;
			document.body.appendChild(novoel);
		}
		var divgeo = $i("divGeometriasTemp");
		divgeo.innerHTML = "";
		var renderer;
		if (navn) {renderer = new SVGRenderer();}
		else {renderer = new VMLRenderer();}
		richdraw = new RichDrawEditor(divgeo, renderer);
		richdraw.editCommand('fillcolor', 'red');
		richdraw.editCommand('linecolor', 'gray');
		richdraw.editCommand('linewidth', '1px');
		richdraw.editCommand('mode', 'line');
		divgeo.style.display="block";
		ativaClicks(divgeo);
	}
	catch(e){alert("Erro ao tentar criar container richdraw");}
}
/*
Function: mudaVisual

Muda o visual do mapa atual

Parameters:

visual - nome do novo visual. Obtido na inicialização do I3Geo e armazenado na variável objmapa.listavisual
*/
function mudaVisual(visual)
{
	var monta = function(retorno)
	{
		try
		{
			objaguarde.fecha("ajaxredesenha");
			var imgstemp = retorno.data.arquivos;
			var imgs = new Array();
			var i = imgstemp.length-1;
			if(i >= 0)
			{
				do
				{
					var temp = imgstemp[i].split(".");
					if ((temp[1] == "png") || (temp[1] == "gif") || (temp[1] == "jpg"))
					{
						imgs.push(imgstemp[i]);
					}
				}
				while(i--)
			}
			var elementos = document.getElementsByTagName("img");
			var elt = elementos.length;
			var caminho = g_locaplic+"/imagens/visual/"+visual+"/";
			//faz a troca em imagens
			var j = imgs.length-1;
			if(j >= 0)
			{
				do
				{
					for (var i=0;i < elt; i++)
					{
						if ((elementos[i].src.search("branco") > -1) && ((elementos[i].className != "") || (elementos[i].id != "")))
						{elementos[i].src = caminho+"branco.gif";}
						if (elementos[i].src.search("visual") > -1)
						{elementos[i].style.backgroundImage = "url('"+caminho+imgs[j]+"')";}
					}
				}
				while(j--)
			}	
			//faz a troca em ids
			var j = imgs.length-1;
			if(j >= 0)
			{
				do
				{
					var busca = imgs[j].split(".");
					if ($i(busca[0]))
					{$i(busca[0]).src = caminho+imgs[j];}
				}
				while(j--)
			}
			//faz a troca em bg
			var elementos = new Array("vertMaisZoom","vertMenosZoom","foldermapa","foldermapa1","tic");
			var i = elementos.length-1;
			if(i >= 0)
			{
				do
				{
					if ($i(elementos[i]))
					{
						$i(elementos[i]).style.backgroundImage = "url('"+caminho+"sprite.png')";
						for (var j=0;j < imgs.length; j++)
						{
							var busca = imgs[j].split(".");
							if (busca[0] == elementos[i])
							{$i(elementos[i]).style.backgroundImage = "url('"+caminho+imgs[j]+"')";}
						}				
					}
				}
				while(i--)
			}
			g_visual = visual;
		}
		catch(e){alert("Ocorreu um erro. mudaVisual"+e);objaguarde.fecha("ajaxredesenha");}
	};
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaArquivos&g_sid="+g_sid+"&diretorio=imagens/visual/"+visual;
	cpObj.call(p,"mudaQS",monta);
}
/*
Function: initJanelaMen

Abre a janela com as mensagens de ajuda ao usuário

*/
function initJanelaMen()
{
	try
	{
		if (!$i("janelaMen"))
		{
			var novoel = document.createElement("div");
			novoel.id = "janelaMen";
			novoel.style.display="block";
			novoel.style.border="1px solid rgb(170,170,170)";
			novoel.innerHTML = '<div class="hd">&nbsp;</div><div class="bd" ><div id="janelaMenTexto" style="color:rgb(170,170,170)">'+g_mensagempadrao+'</div></div>';
			document.body.appendChild(novoel);
			var i = ($i("janelaMenTexto")).style;
			i.textAlign="left";
			i.fontSize="10px";
			YAHOO.namespace("janelaMen.xp");
			YAHOO.janelaMen.xp.panel = new YAHOO.widget.Panel("janelaMen", { width:"266px", height:"auto", fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
			YAHOO.janelaMen.xp.panel.render();
			var escondeMen = function()
			{
				YAHOO.util.Event.removeListener(YAHOO.janelaMen.xp.panel.close, "click");
				YAHOO.janelaMen.xp.panel.destroy();	
				iCookie("g_janelaMen","nao");	
			};
			YAHOO.util.Event.addListener(YAHOO.janelaMen.xp.panel.close, "click", escondeMen);
			iCookie("g_janelaMen","sim");
		}
		YAHOO.janelaMen.xp.panel.show();
		YAHOO.janelaMen.xp.panel.moveTo(imagemxi - 267 ,objmapa.h - 70);
	}
	catch(e){alert("Nao foi possivel criar a janela de mensagens. initJanelaMen"+e);}
}
/*
Function: docaguias

Coloca as guias de navegação em uma janela interna do mapa e altera o tamanho do mapa para ajustar o novo tamanho.
*/
function docaguias()
{
	if (!$i("conteudojanelaguias"))
	{
		if($i("guiasYUI")){$i("guiasYUI").style.display="none";}
		if (!$i("contemFerramentas")){return;}
		var novono = $i("contemFerramentas").innerHTML;
		$i("contemFerramentas").innerHTML = "";
		var wef = 0;
		if ($i("encolheFerramentas"))
		{wef = parseInt($i("encolheFerramentas").style.width);}
		var w = parseInt($i("contemFerramentas").style.width) - wef;
		$i("contemFerramentas").style.width="0px";
		if ($i("visual"))
		{$i("visual").style.width="0px";$i("visual").innerHTML="";}
		var pos = "px";
		var a = objmapa.h;
		var l = objmapa.w + w;
		objmapa.h = a;
		objmapa.w = l;
		if (navm){pos = "";}
		$i("img").style.width= l+pos;
		$i("img").style.height= a+pos;
		$i("corpoMapa").style.width= l+pos;
		$i("corpoMapa").style.height= a+pos;
		$i("corpoMapa").style.clip = 'rect('+0+" "+(l*1+2)+" "+(a*1+2)+" "+0+')';
		$i("mst").style.width = l + 1 + wef + pos;
		$i("contemImg").style.height= a+pos;
		$i("contemImg").style.width= l+pos;
		// entorno
		if (g_entorno == "sim")
		{
			var letras=["L","O"];
			for (var l=0;l<2; l++)
			{
				if ($i("img"+letras[l]))
				{
					$i("img"+letras[l]).style.width = objmapa.w+pos;
					$i("img"+letras[l]).style.height = objmapa.h+pos;
					$i("corpoMapa"+letras[l]).style.width=objmapa.w+pos;
					$i("corpoMapa"+letras[l]).style.height=objmapa.h+pos+pos;
					$i("corpoMapa"+letras[l]).style.clip = 'rect(0 0 0 0)';
				}
			}
			var letras=["N","S"];
			for (var l=0;l<2; l++)
			{
				if ($i("img"+letras[l]))
				{
					$i("img"+letras[l]).style.width = objmapa.w * 2+pos;
					$i("img"+letras[l]).style.height = objmapa.h * 2+pos;
					$i("corpoMapa"+letras[l]).style.width=objmapa.w * 3+pos;
					$i("corpoMapa"+letras[l]).style.height=objmapa.h+pos;
					$i("corpoMapa"+letras[l]).style.clip = 'rect(0 0 0 0)';
				}
			}
		}
		calcposf();
		objaguarde.abre("ajaxredesenha",$trad("o1"));
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+a+"&largura="+l+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaQS",ajaxredesenha);
		//carrega janela
		var novoel = document.createElement("div");
		novoel.id = "janelaguias";
		novoel.style.display="block";
		var temp = '<div class="hd">Guias</div>';
		temp += '<div class="bd" id="conteudojanelaguias"></div>';
		novoel.innerHTML = temp;
		document.body.appendChild(novoel);
		$i("conteudojanelaguias").innerHTML = novono;
		YAHOO.namespace("janelaguias.xp");
		YAHOO.janelaguias.xp.panel = new YAHOO.widget.Panel("janelaguias", {width:"268px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaguias.xp.panel.render();
		if($i(objmapa.guiaMenu+"obj"))
		{
			$i(objmapa.guiaMenu+"obj").innerHTML = "";
		}
		ativaGuias();
	}
	else
	{
		YAHOO.janelaguias.xp.panel.render();
		YAHOO.janelaguias.xp.panel.show();
	}
}
/*
Function: ativaGuias

Ativa as guias principais do mapa, definindo as funções que serão executadas quando a guia é escolhida.

As guias principais são definidas nos objetos

objmapa.guiaTemas

objmapa.guiaMenu

objmapa.guiaLegenda

objmapa.guiaListaMapas

*/
function ativaGuias()
{
	//ajusta as guias da versão antiga do YUI
	//pega o elemento onde estão os tabs
	for(var g=0;g<12;g++)
	{
		if ($i("guia"+g))
		var gpai = $i("guia"+g).parentNode;
	}
	if(gpai)
	{
		gpai.id = "guiasYUI";
		gpai.className = "yui-navset";
		var ins = '<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
		if($i(objmapa.guiaTemas))
		{$i(objmapa.guiaTemas).innerHTML = $trad("g1");}
		if($i(objmapa.guiaMenu))
		{$i(objmapa.guiaMenu).innerHTML = $trad("g2");}
		if($i(objmapa.guiaLegenda))
		{$i(objmapa.guiaLegenda).innerHTML = $trad("g3");}
		if($i(objmapa.guiaListaMapas))
		{$i(objmapa.guiaListaMapas).innerHTML = $trad("g4");}
		for(var g=0;g<12;g++)
		{
			if ($i("guia"+g))
			{
				var tituloguia = $i("guia"+g).innerHTML;
				var re = new RegExp("&nbsp;", "g");
				var tituloguia = tituloguia.replace(re,'');
				ins += '<li><a href="#"><em><div id="guia'+g+'" >'+tituloguia+'</div></em></a></li>';
			}
		}
		ins += "</ul>";
		gpai.innerHTML = ins;
		for(var g=0;g<12;g++)
		{
			if ($i("guia"+g))
			{
				eval('$i("guia'+g+'").onclick = function(){g_guiaativa = "guia'+g+'";mostraguiaf('+g+');}');
				if($i("guia"+g+"obj"))
				{
					$i("guia"+g+"obj").style.overflow="auto";
					$i("guia"+g+"obj").style.height = objmapa.h;
				}
			}
		}
	}
	//guias
	if ($i(objmapa.guiaTemas))
	{
		$i(objmapa.guiaTemas).onclick = function()
		{g_guiaativa = objmapa.guiaTemas;mostraguiaf(1);};
	}
	if ($i(objmapa.guiaMenu))
	{
		$i(objmapa.guiaMenu).onclick = function()
		{
			g_guiaativa = objmapa.guiaMenu;
			mostraguiaf(2);
			if (!$i("buscatema"))
			{
				var pegalistademenus = function(retorno)
				{
					if (retorno.data == "")
					{pegaListaDeGrupos("","sim");}
					else
					{
						var j = retorno.data.length-1;
						if(j >= 0)
						{
							do
							{
								if(j == retorno.data.length-1)
								{pegaListaDeGrupos(retorno.data[j].idmenu,"sim");}
								else
								{pegaListaDeGrupos(retorno.data[j].idmenu,"nao");}
							}
							while(j--)
						}
					}
				};
				//pega a lista de árvores que devem ser montadas
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+g_sid;
				cpObj.call(p,"pegalistademenus",pegalistademenus);
			}
		};
	}
	if ($i(objmapa.guiaLegenda))
	{
		$i(objmapa.guiaLegenda).onclick = function()
		{g_guiaativa = objmapa.guiaLegenda;mostraguiaf(4);objmapa.atualizaLegendaHTML();};
	}
	if ($i(objmapa.guiaListaMapas))
	{
		$i(objmapa.guiaListaMapas).onclick = function()
		{
			g_guiaativa = objmapa.guiaListaMapas;
			mostraguiaf(5);
			if ($i("banners"))
			{
				$i("banners").innerHTML == $trad("o1");
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+g_sid;
				cpObj.call(p,"pegaMapas",pegaMapas);
			}
			else
			{alert("id banners nao encontrado");}
		};
	}
}
/*
Function: mensagemf

Abre uma mensagem na tela em um DIV.

Parameters:

m - mensagem que será mostrada.
*/
function mensagemf(m)
{
	try
	{
		//insere o div para mensagens
		if (!$i("mensagem"))
		{
			var novoel = document.createElement("div");
			novoel.id = 'mensagem';
			novoel.innerHTML = '<table width="50" style="border: 1px solid #000000;"> <tr> <td onclick="mensagemf()" style="text-align:left;cursor:pointer" class="tdclara"> <img src="'+g_locaplic+'/imagens/excluir.png" /> </td> <td style="text-align:left" class="tdclara"> <input style="text-align:left" class="textocb" type="text" id="mensagemt" size="50" value="" /> </td></tr> </table>';
			document.body.appendChild(novoel);
		}
		if (m == null)
		{$i("mensagem").style.visibility = "hidden";}
		else
		{
			$i("mensagemt").value = m;
			$i("mensagem").style.visibility = "visible";
		}
		eval ('document.getElementById("mensagem").style.' + g_tipoleft + ' = imagemxi + g_postpx');
		eval ('document.getElementById("mensagem").style.' + g_tipotop + ' = imagemyi + g_postpx');
	}
	catch(e){alert("Impossivel criar mensagem."+e);}
}
/*
Function: wdocaf

Abre a janela docável para executar algum programa.

Parameters:

wlargura - largura da nova janela

waltura - altura da nova janela

wsrc - endereço do conteúdo que será aberto

nx - posição da janela em x. Pode ser definido como "center"

ny - posição da janela em y

texto - texto que será mostrado no título da janela
*/
function wdocaf(wlargura,waltura,wsrc,nx,ny,texto)
{
	try
	{
		if($i("boxg"))
		{$i("boxg").style.display = "none";}
		if($i("boxpin"))
		{$i("boxpin").style.display = "none";}
		var wlargura_ = parseInt(wlargura)+0+"px";
		YAHOO.namespace("janelaDoca.xp");
		if ($i("wdoca"))
		{YAHOO.janelaDoca.xp.panel.destroy();}
		var ins = '<div class="hd">'+texto+'</div><div class="bd"><iframe name="wdocai" id="wdocai" valign="top" style="border:0px white solid"></iframe></div>';
		var novoel = document.createElement("div");
		novoel.id = "wdoca";
		novoel.style.display="block";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		if ($i("wdocai"))
		{
			with ($i("wdocai").style){width = "100%";height=waltura;};
			$i("wdoca").style.display = "block";
			$i("wdocai").src = wsrc;
		}
		var fix = false;
		if(nx == "center"){var fix = true;}
		YAHOO.janelaDoca.xp.panel = new YAHOO.widget.ResizePanel("wdoca", { width: wlargura_, fixedcenter: fix, constraintoviewport: false, visible: true, iframe:false} );
		YAHOO.janelaDoca.xp.panel.moveTo(imagemxi,imagemyi+50);
		YAHOO.janelaDoca.xp.panel.render();
		var escondeWdoca = function()
		{
			$i("wdoca").style.display = "none";
			$i("wdocai").src = "";
			YAHOO.util.Event.removeListener(YAHOO.janelaDoca.xp.panel.close, "click");
			YAHOO.janelaDoca.xp.panel.destroy();
			if ((g_tipoacao == "selecaobox") || (g_tipoacao == "inseregrafico") || (g_tipoacao == "selecao") || (g_tipoacao == "inserexy") || (g_tipoacao == "textofid"))
			{mudaiconf("pan");}
			//esconde o box do google
			if ($i("boxg"))
			{$i("boxg").style.display = "none";}
			if ($i("boxpin"))
			{$i("boxpin").style.display = "none";}
			//fecha o container de desenho de elementos na tela
			if($i("divGeometriasTemp"))
			{richdraw.fecha();}
			limpacontainerf();
		};
		YAHOO.util.Event.addListener(YAHOO.janelaDoca.xp.panel.close, "click", escondeWdoca);
	}
	catch(e){alert("Ocorreu um erro. wdocaf"+e);}
}
/*
Function: redimwdocaf

Redimensiona a janela docável.

Parameters:

wlargura - largura da nova janela

waltura - altura da nova janela

*/
function redimwdocaf(wlargura,waltura)
{
	try
	{
		if ($i("wdoca"))
		{
			var i = $i("wdoca");
			i.style.width = wlargura;
			i.style.height = waltura;
		}
	}
	catch(e){alert("Ocorreu um erro. redimwdocaf"+e);}
}
/*
Function: wdocaf2

Abre uma segunda janela docável para executar algum programa relativo a outra janela.

Parameters:

wlargura - largura da nova janela

waltura - altura da nova janela

wsrc - endereço do conteúdo que será aberto

nx - posição da janela em x

ny - posição da janela em y

texto - texto que será mostrado no título da janela
*/
function wdocaf2(wlargura,waltura,wsrc,nx,ny,texto)
{
	try
	{
		if (!$i("wdoca2"))
		{
			var ins = '<div class="hd">&nbsp;</div><div class="bd"><iframe name="wdocai2" id="wdocai2"  valign="top" ></iframe></div></div>';
			var novoel = document.createElement("div");
			novoel.id = "wdoca2";
			novoel.style.display="none";
			novoel.innerHTML = ins;
			document.body.appendChild(novoel);
		}
		YAHOO.namespace("janelaDoca2.xp");
		YAHOO.janelaDoca2.xp.panel = new YAHOO.widget.Panel("wdoca2", {width:wlargura, fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:true } );
		YAHOO.janelaDoca2.xp.panel.moveTo(imagemxi,imagemyi);
		YAHOO.janelaDoca2.xp.panel.render();
		YAHOO.janelaDoca2.xp.panel.show();
		with ($i("wdocai2").style){width = "100%";height = waltura;}
		$i("wdoca2").style.display = "block";
		$i("wdocai2").src = wsrc;
		var escondeWdoca2 = function()
		{
			$i("wdoca2").style.display = "none";
			$i("wdocai2").src = "";
			YAHOO.util.Event.removeListener(YAHOO.janelaDoca2.xp.panel.close, "click");
		};
		YAHOO.util.Event.addListener(YAHOO.janelaDoca2.xp.panel.close, "click", escondeWdoca2);
	}
	catch(e){alert("Ocorreu um erro. wdocaf2"+e);}
}
/*
Function: wdocafechaf

Fecha uma janela docável.

Depreciado

Parameters:

odoca - objeto janela
*/
function wdocafechaf(odoca)
{
	try
	{
		$i(odoca).style.display="none";
		if ((odoca != "wdocaref") && (odoca != "wdocac"))
		{
			if($i("wdocain")){$i("wdocain").value = "";}
			if($i("wdocadiv")){$i("wdocadiv").innerHTML = "";$i("wdocadiv").display="none";}
			if ($i("temp")){$i("temp").value == "";}
			$i("wdocai").src = "";
			$i("imgh").style.visibility="visible";
		}
		if ((g_tipoacao == "selecaobox") || (g_tipoacao == "inseregrafico") || (g_tipoacao == "selecao") || (g_tipoacao == "inserexy") || (g_tipoacao == "textofid"))
		{mudaiconf("pan");}
	}
	catch(e){alert("Ocorreu um erro. wdocafechaf"+e);}
}
/*
Function: mostradicasf

Mostra dicas sobre uma função quando o mouse passa sobre um botão ou outra opção qualquer.

Parameters:

objeto - objeto sobre o qual o mouse está sobreposto.

dica - dica que aparece no mapa.

hlpt - depreciado

*/
function mostradicasf(objeto,dica,hlpt)
{
	try
	{
		if ($i("ajuda"))
		{
			if (dica == ""){$i("ajuda").innerHTML="-";}
			else
			{
				g_hlpt = hlpt;
				$i("ajuda").innerHTML= "<b>"+dica+" </b>";
			}
		}
		if ($i("janelaMenTexto"))
		{
			if (dica == ""){dica = g_mensagempadrao;}
			$i("janelaMenTexto").innerHTML= "<b>"+dica+" </b>";
		}
	}
	catch(e){alert("Ocorreu um erro. mostradicasf"+e);}
}	
/*
Function: mudaiconf

Muda as bordas dos ícones de ferramentas, passando todos para normal.
Aplica uma borda sobre um ícone específico

Parameters:

i - id do ícone que receberá a borda.
*/
function mudaiconf(i)
{
	try
	{
		//limpa o container com os tips fixos na tela
		if(objmapa.objtips.length > 0)
		{
			var ot = objmapa.objtips.length-1;
			if(ot >= 0)
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
		limpacontainerf();
		var objetos=["area","inseregrafico","textofid","zoomli","zoomlo","zoomiauto","zoomoauto","pan","identifica","mede","inserexy","selecao"];
		var ko = objetos.length-1;
		if(ko >= 0)
		{
			do
			{
				if ($i(objetos[ko]))
				{
					var ist = $i(objetos[ko]).style;
					ist.borderWidth=0;
					ist.borderBottomWidth=1;
					ist.borderLeftWidth=1;
					ist.borderColor='rgb(50,50,50)';
				}
			}
			while(ko--)
		}
		g_tipoacao = i;
		if($i(i))
		{
			with ($i(i).style){borderLeftWidth='0px';borderBottomWidth='0px';borderColor='black';}
		}
		$i("imgh").style.display="block";
		if ($i("divGeometriasTemp"))
		{$i("divGeometriasTemp").style.display = "none";}
		switch(i)
		{
			case "zoomli":
			$i("imgh").src= g_localimg + "/" + "ic_zoom.png";
			if($i("img")){$i("img").title = "";}
			break;
			case "pan":
			$i("imgh").src= g_localimg + "/" + "icon_pan.gif";
			if($i("img")){$i("img").title = "";}
			break;
			case "mede":
			$i("imgh").src= g_localimg + "/" + "mede.gif";
			case "area":
			$i("imgh").src= g_localimg + "/" + "mede.gif";
			break;
			case "inserexy":
			$i("imgh").src= g_localimg + "/" + "ic_xy.png";
			if($i("img")){$i("img").title = "clique para inserir um ponto";}
			break;
			case "textofid":
			$i("imgh").src= g_localimg + "/" + "ic_xy.png";
			if($i("img")){$i("img").title = "clique para inserir o texto";}
			break;
			case "selecao":
			$i("imgh").src= g_localimg + "/" + "ic_seleciona.png";
			if($i("img")){$i("img").title = "";}
			break;
			case "inseregrafico":
			$i("imgh").src= g_localimg + "/" + "ic_seleciona.png";
			if($i("img")){$i("img").title = "clique para incluir o gráfico";}
			break;
			case "identifica":
			$i("imgh").src= g_localimg + "/" + "ic_identifica.png";
			if($i("img")){$i("img").title = "";}
			break;
		}
	}
	catch(e){alert("Ocorreu um erro. mudaiconf"+e);}
}
/*
Function: mostraguiaf

Ativa a visualização de uma determinada guia.

Parâmetros:

guia - número da guia que será ativada.
*/
function mostraguiaf(guia)
{
	if ($i("guia"+guia))
	{
		var fs=[1,2,3,4,5,6,7,8,9,10];
		for (var j=0;j<10; j++)
		{
			if ($i("guia"+fs[j]))
			{
				jj = fs[j];
				if ($i("guia"+jj+"obj"))
				{$i("guia"+jj+"obj").style.display="none";}
			}
		}
		if ($i("guia"+guia+"obj"))
		{$i("guia"+guia+"obj").style.display="block";}
		else
		{alert("O objeto guia"+guia+"obj nao existe.");}
	}
}
/*
Function: aguarde

Cria um objeto aguarde.
O objeto é um banner mostrado na tela quando uma função ajax é executada.

Method:

abre - abre o banner

Parâmetros:

aguardeId - identificador do banner

texto - texto do banner

Method:

fecha - fecha o banner

Parâmetros:

aguardeId - identificador do banner

*/
function aguarde()
{
	this.abre = function(aguardeId,texto)
	{
		if($i("wait_mask"))
		{
			document.body.removeChild($i("wait_mask"));
		}
		if($i("wait_c"))
		{
			document.body.removeChild($i("wait_c"));
		}
		YAHOO.namespace("aguarde."+aguardeId);
		eval ('YAHOO.aguarde.'+aguardeId+' = new YAHOO.widget.Panel("wait",{width:"240px",fixedcenter:false,underlay:"none",close:true,draggable:false,modal:true})');
		eval ('YAHOO.aguarde.'+aguardeId+'.setBody("<span style=font-size:12px; >"+texto+"</span>")');
		eval ('YAHOO.aguarde.'+aguardeId+'.body.style.height="20px"');
		eval ('YAHOO.aguarde.'+aguardeId+'.setHeader("<span><img src=\'"+g_locaplic+"/imagens/aguarde.gif\' /></span>")');
		eval ('YAHOO.aguarde.'+aguardeId+'.render(document.body)');
		eval ('YAHOO.aguarde.'+aguardeId+'.moveTo('+imagemxi+','+imagemyi+')');
		eval ('YAHOO.aguarde.'+aguardeId+'.show()');
	};
	this.fecha = function(aguardeId)
	{
		if ($i("wait"))
		{
			if (eval('YAHOO.aguarde.'+aguardeId))
			{
				if ($i(eval('YAHOO.aguarde.'+aguardeId+".id")))
				{eval('YAHOO.aguarde.'+aguardeId+'.destroy()');}
			}
		}
	};
}
/*
Function: ativaClicks

Ativa as operações de clique sobre o mapa

Define o que será executado quando o mouse é clicado ou movido sobre o mapa
*/
function ativaClicks(docMapa)
{
	docMapa.onmouseover = function()
	{
		try
		{
			if ($i("imgh")){$i("imgh").style.display="block";}
			if ($i("janelaMenu"))
			{$i("janelaMenu").style.display="none";}
			this.src=g_quadrooriginal;
			//verifica se o mouse esta parado
			if (objmapa.parado!="cancela")
			{
				objmapa.parado="nao";
				verificaTip();
			}
			if ($i("tip"))
			{$i("tip").style.display="none";}
		}
		catch(e){var e = "";}
		this.onmousemove=function(exy)
		{
			try
			{
				if ($i("tip"))
				{$i("tip").style.display="none";}
				capturaposicao(exy);
				if (g_destaca != "")
				{$i("imgh").style.display="none";$i("div_d").style.clip = 'rect('+(objposicaocursor.imgy - destacaTamanho)+" "+(objposicaocursor.imgx - 10)+" "+(objposicaocursor.imgy - 10)+" "+(objposicaocursor.imgx - destacaTamanho)+')';}
				if ($i("img") && (g_panM == "sim"))
				{
					var nx = objposicaocursor.telax - leftinicial - clicinicialx;
					var ny = objposicaocursor.telay - topinicial - clicinicialy;
					if (g_entorno == "nao")
					{
						var l = 0;
						if (parseInt($i("i3geo").style.left))
						{var l = parseInt($i("i3geo").style.left);}
						$i("img").style.left = nx - l;
						var t = 0;
						if (parseInt($i("i3geo").style.top))
						{var t = parseInt($i("i3geo").style.top);}
						$i("img").style.top = ny - t;
					}
					else
					{
						$left("img",objmapa.w*-1 + nx);
						$left("imgS",objmapa.w*-1 + nx);
						$left("imgL",objmapa.w + nx);
						$left("imgO",objmapa.w*-3 + nx);
						$left("imgN",objmapa.w*-1 + nx);
						$top("img",objmapa.h*-1 + ny);
						$top("imgS",objmapa.h*-1 + ny);
						$top("imgL",objmapa.h*-1 + ny);
						$top("imgN",objmapa.h*-1 + ny);
						$top("imgO",objmapa.h*-1 + ny);
					}
				}
			}
			catch(e){var e = "";}
			try
			{objmapa.verificaMousemoveMapa();}
			catch(e){var e = "";}
		};
	};
	docMapa.onmouseout = function()
	{
		try
		{
			objmapa.parado="parar";
			mostradicasf(this,'');
			if ($i("imgh")){$i("imgh").style.display="none";}
		}
		catch(e){var e = "";}
	};
	docMapa.onmousedown = function()
	{
		try
		{
			if ($i("imgh"))
			$i("imgh").style.display="none";
			//verifica se esta na opÃ¯Â¿Â½o de zoom box
			if ((g_tipoacao == "zoomli") || (g_tipoacao == "selecaobox"))
			{
				// inicia retÃ¯Â¿Â½gulo de zoom
				if ($i("imgh"))
				$i("imgh").style.display="none";
				if($i("box1"))
				{
					var i = $i("box1").style;
					i.width=0;
					i.height=0;
					i.visibility="visible";
					i.display="none";
				}
				boxxini = objposicaocursor.telax;
				boxyini = objposicaocursor.telay;
				tamanhox = 0;
				tamanhoy = 0;
			}
			if ($i("img") && (g_tipoacao == "pan"))
			{
				g_panM = "sim";
				if($i("corpoMapa"))
				{
					leftinicial = parseInt($i("corpoMapa").style.left);
					topinicial = parseInt($i("corpoMapa").style.top);
				}
				clicinicialx = objposicaocursor.imgx;
				clicinicialy = objposicaocursor.imgy;
				ddinicialx = objposicaocursor.ddx;
				ddinicialy = objposicaocursor.ddy;
			}
		}
		catch(e){var e = "";}
	};
	docMapa.onclick = function()
	{
		try
		{
			objmapa.verificaClickMapa();
		}
		catch(e){var e = "";}
	};
	docMapa.onmouseup = function()
	{
		try
		{
			if (g_tipoacao == "zoomli"){zoomboxf("termina");}
			if (g_tipoacao == "selecaobox"){zoomboxf("termina");}
			if ($i("img") && (g_tipoacao == "pan"))
			{
				g_panM = "nao";
				var disty = (ddinicialy * -1) + objposicaocursor.ddy; //teladd[1]
				var distx = (ddinicialx * -1) + objposicaocursor.ddx; //teladd[0]
				var ex = objmapa.extent;
				var ex = ex.split(" ");
				var novoxi = (ex[0] * 1) - distx;
				var novoxf = (ex[2] * 1) - distx;
				var novoyi = (ex[1] * 1) - disty;
				var novoyf = (ex[3] * 1) - disty;
				if ((distx == 0)||(disty == 0))
				{
					objaguarde.abre("ajaxredesenha",$trad("o1"));
					var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pan&x="+objposicaocursor.imgx+"&y="+objposicaocursor.imgy+"&g_sid="+g_sid;
					cpObj.call(p,"pan",ajaxredesenha);
					return;
				}
				var nex = novoxi+" "+novoyi+" "+novoxf+" "+novoyf;
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+nex+"&g_sid="+g_sid;
				cpObj.call(p,"mudaExtensao",ajaxredesenha);
			}
		}
		catch(e){var e = "";}
	};
}
/*
Section: navegação
*/
/*
Function: initJanelaZoom

Abre a janela com as ferramentas de zoom

Parametros:

qual - Qual janela (1 ou 2)
*/
function initJanelaZoom(qual)
{
	//janela de botoes 1
	var wj = "36px";
	var recuo = "0px";
	if ((qual == 1) && (!$i("maisBotoes1")))
	{
		var novoel = document.createElement("div");
		novoel.id = "janelaBotoes1";
		novoel.style.display="block";
		novoel.style.border="1px solid gray";
		if (navm)
		{novoel.style.filter='alpha(opacity=90)';}
		else
		{novoel.style.opacity= .85;}
		var temp = '<div class="hd">&nbsp;</div>';
		temp += '<div class="bd" style="background-color:rgb(250,250,250);width='+wj+'px"  >';
		//barra de zoom
		if ($i("zoomli"))
		{
			if (navn){temp += '<div style="text-align:center;position:relative;left:9px" >';}
			temp += '<div id="vertMaisZoom" onmouseover="mostradicasf(this,\'Amplia o mapa mantendo o centro atual.\',\'\')" onclick="zoomiauto()" ></div><div id="vertBGDiv" name="vertBGDiv" tabindex="0" x2:role="role:slider" state:valuenow="0" state:valuemin="0" state:valuemax="200" title="Zoom" >';
			temp += '<div id="vertHandleDiv" ><img alt="" class="slider" src="'+$im("branco.gif")+'" /></div></div>';
			temp += '<div id=vertMenosZoom onmouseover="mostradicasf(this,\'Reduz o mapa mantendo o centro atual.\',\'\')" onclick="zoomoauto()"  ></div>';
			if (navn){temp += '</div>';}
		}
		temp += '<div id="maisBotoes1" style="left:'+recuo+'" ></div></div>';
		novoel.innerHTML = temp;
		document.body.appendChild(novoel);
		//copia os botoes do HTML para a janela
		if ($i("barraDeBotoes1"))
		{
			$i("maisBotoes1").innerHTML = $i("barraDeBotoes1").innerHTML+"<table><tr><td>&nbsp;</td></tr></table>";
			$i("barraDeBotoes1").innerHTML = "";
		}
		YAHOO.namespace("janelaBotoes1.xp");
		YAHOO.janelaBotoes1.xp.panel = new YAHOO.widget.Panel("janelaBotoes1", {width:wj, fixedcenter: false, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaBotoes1.xp.panel.render();
		verticalSlider = YAHOO.widget.Slider.getVertSlider("vertBGDiv","vertHandleDiv", 0, 70);
		verticalSlider.onChange = function(offsetFromStart)
		{g_fatordezoom = (offsetFromStart - 35) / 5;};
		verticalSlider.setValue(35,true);
		if ($i("vertBGDiv"))
		{
			$i("vertBGDiv").onmouseup = function()
			{
				aplicaescala();
				g_fatordezoom = 0;
				verticalSlider.setValue(35,true);
			};
		}
		//altera o tamanho da imagem do mapa
		if($i("vertHandleDiv"))
		{
			$i("vertHandleDiv").onmousemove = function()
			{
				var nw = objmapa.w;
				var nh = objmapa.h;
				var nt = 0;
				var nl = 0;
				var ns = parseInt(objmapa.scale);
				if ((g_fatordezoom > 0) && (g_fatordezoom < 7))
				{
					g_fatordezoom = g_fatordezoom + 1;
					var velhoh = parseInt($i("img").style.height);
					var velhow = parseInt($i("img").style.width);
					nh = objmapa.h / g_fatordezoom;
					nw = objmapa.w / g_fatordezoom;
					var t = parseInt($i("img").style.top);
					var l = parseInt($i("img").style.left);
					nt=t + ((velhoh - nh)*.5);
					if (navm){nl=0;}
					else
					{nl=l + ((velhow - nw)*.5);}
					var fatorEscala = nh/objmapa.h;
					ns=parseInt(objmapa.scale / fatorEscala);
				}
				if ((g_fatordezoom < 0) && (g_fatordezoom > -7))
				{
					g_fatordezoom = g_fatordezoom - 1;
					var velhoh = parseInt($i("img").style.height);
					var velhow = parseInt($i("img").style.width);
					nh = objmapa.h * g_fatordezoom * -1;
					nw = objmapa.w * g_fatordezoom * -1;
					var t = parseInt($i("img").style.top);
					var l = parseInt($i("img").style.left);
					nt = t - ((nh - velhoh)*.5);
					nl = l - ((nw - velhow)*.5);
					var fatorEscala = nh/objmapa.h;
					ns=parseInt(objmapa.scale / fatorEscala);
				}
				$i("img").style.width = nw;
				$i("img").style.height = nh;
				$top("img",nt);
				$left("img",nl);
				if ($i("escalanum"))
				{$i("escalanum").value=ns;}
			};
		}		
		return;
	}
	if ((qual == 1) && ($i("maisBotoes1")))
	{YAHOO.janelaBotoes1.xp.panel.show();}
	//janela de botoes 2
	if ((qual == 2) && (!$i("maisBotoes2")))
	{
		var novoel = document.createElement("div");
		novoel.id = "janelaBotoes2";
		novoel.style.display="block";
		novoel.style.border="1px solid gray";
		if (navm)
		{novoel.style.filter='alpha(opacity=90)';}
		else
		{novoel.style.opacity= .85;}
		var temp = '<div class="hd">&nbsp;</div>';
		temp += '<div class="bd" style="background-color:rgb(250,250,250);width='+wj+'px"  >';		
		temp += '<div id="maisBotoes2" style="left:'+recuo+';top:-6px;"  ></div></div>';
		novoel.innerHTML = temp;
		document.body.appendChild(novoel);
		//copia os botoes do HTML para a janela
		if ($i("barraDeBotoes2"))
		{
			$i("maisBotoes2").innerHTML = $i("barraDeBotoes2").innerHTML;
			$i("barraDeBotoes2").innerHTML = "";
		}
		YAHOO.namespace("janelaBotoes2.xp");
		YAHOO.janelaBotoes2.xp.panel = new YAHOO.widget.Panel("janelaBotoes2", {width:wj, fixedcenter: false, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaBotoes2.xp.panel.render();
		return;
	}
	if ((qual == 2) && ($i("maisBotoes2")))
	{YAHOO.janelaBotoes2.xp.panel.show();}
}
/*
Function: initJanelaRef

Abre a janela com o mapa de referencia

*/
function initJanelaRef()
{
	if (!$i("winRef"))
	{
		var novoel = document.createElement("div");
		novoel.id = "winRef";
		novoel.style.display="none";
		novoel.style.borderColor="gray";
		var ins = '<div class="hd">';
		var temp = "javascript:if(g_zoomRefDinamico == -1){g_zoomRefDinamico = 1};g_zoomRefDinamico = g_zoomRefDinamico + 1 ;$i(\"refDinamico\").checked = true;objmapa.atualizaReferencia();";
		ins += "<img class=mais onclick='"+temp+"' src="+$im("branco.gif")+" />";
		var temp = "javascript:if(g_zoomRefDinamico == 1){g_zoomRefDinamico = -1};g_zoomRefDinamico = g_zoomRefDinamico - 1 ;$i(\"refDinamico\").checked = true;objmapa.atualizaReferencia();";
		ins += "<img class=menos onclick='"+temp+"' src="+$im("branco.gif")+" />&nbsp;";
		ins += '<input style="cursor:pointer" onclick="javascript:objmapa.atualizaReferencia()" type="checkbox" id="refDinamico" />&nbsp;'+$trad("o6")+'</div>';
		ins += '<div class="bd" style="text-align:left;padding:3px;" id="mapaReferencia" onmouseover="javascript:movimentoRef(this)" onclick="javascript:clicouRef()">';
		ins += '<img style="cursor:pointer;" id=imagemReferencia src="" />';
		ins += '<div style="text-align:left;font-size:0px" id="refmensagem" ></div></div>';
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		$i("imagemReferencia").style.height = objmapa.refheight+"px";
	}
	$i("winRef").style.display = "block";
	YAHOO.namespace("janelaRef.xp");
	YAHOO.janelaRef.xp.panel = new YAHOO.widget.Panel("winRef", { width:"156px", fixedcenter: false, constraintoviewport: true, underlay:"shadow", close:true, visible:true, draggable:true, modal:false } );
	YAHOO.janelaRef.xp.panel.render();
	if (navm){YAHOO.janelaRef.xp.panel.moveTo((imagemxi+objmapa.w-160),imagemyi+4);}
	else
	{YAHOO.janelaRef.xp.panel.moveTo((imagemxi+objmapa.w-160),imagemyi+4);}
	var escondeRef = function()
	{
		YAHOO.util.Event.removeListener(YAHOO.janelaRef.xp.panel.close, "click");
		YAHOO.janelaRef.xp.panel.destroy();	
		iCookie("g_mapaRefDisplay","none");	
	};
	//YAHOO.util.Event.addListener(YAHOO.janelaRef.xp.panel.close, "click", escondeRef);	
	iCookie("g_mapaRefDisplay","block");
	objmapa.atualizaReferencia();
}
/*
Function: mudaboxnf

Posiciona o botao aplicar quando o check box que liga/desliga um tema é pressionado.

Parâmetros:

tipo - de onde veio a requisicao ligadesliga|adicionatema
*/
function mudaboxnf(tipo)
{
	try
	{
		g_operacao = tipo;
		clearTimeout(objmapa.tempo);
		objmapa.tempo = setTimeout('remapaf()',(4000));
		autoRedesenho("reinicia");
		if ($i("aplicari"))
		{
			$i("aplicari").style.display="block";
			if (navm)
			{
				mx = objposicaomouse.x - 10;
				my = objposicaomouse.y - 15;
				var i = $i("aplicari").style;
				i.pixelLeft = mx+document.body.scrollLeft;
				i.pixelTop = my+document.body.scrollTop;
			}
			if (navn)
			{
				var l = objposicaomouse.x;
				var t = objposicaomouse.y+document.body.scrollTop;
				var i = $i("aplicari").style;
				i.left = l;
				i.top = t;
			}
		}
	}
	catch(e){var e = "";}
}
/*
Function: movelentef

Move a imagem na lente de aumento conforme o movimento do mouse sobre o mapa.
*/
function movelentef()
{
	try
	{
		if ($i("lente"))
		{
			if ($i("lente").style.visibility=="visible")
			{
				var esq = (objposicaocursor.telax - imagemxi) * 2.25;
				var topo = (objposicaocursor.telay - imagemyi) * 2.25;
				var clipt = "rect("+ (topo - 40) + " " + (esq + 40) + " " + (topo + 40) + " " + (esq - 40) +")";
				var i = $i("lente").style;
				i.clip = clipt;
				eval("i." + g_tipotop + "= (imagemyi - (topo - 40)) + g_postpx");
				eval("i." + g_tipoleft +  "= (imagemxi - (esq - 40)) + g_postpx");
			}
		}
	}
	catch(e){var e = "";}
}
/*
Function: zoomiauto

Aproxima o mapa tendo o centro como referência.
*/
function zoomiauto()
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	g_fatordezoom = 0;
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel=2&g_sid="+g_sid;
	g_operacao = "navega";
	cpObj.call(p,"aproxima",ajaxredesenha);
}
/*
Function: zoomoauto

Afasta o mapa tendo o centro como referência.
*/
function zoomoauto()
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	g_fatordezoom = 0;
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel=2&g_sid="+g_sid;
	g_operacao = "navega";
	cpObj.call(p,"afasta",ajaxredesenha);
}
/*
Function: zoomboxf

Faz o zoom no mapa utilizando a opção de desenhar um retângulo.

As coordenadas de tela devem estar no objeto "objposicaocursor".
A opção "desloca" altera a posição do box (box1) na tela. A opção "termina", pega as coordenadas
de tela do box1 e chama a função ajax que redesenha o mapa.

Parameters:

tipo - desloca|termina
*/
function zoomboxf (tipo)
{
	if($i("box1"))
	{
		var bx = $i("box1");
		var bxs = bx.style;
	}
	else
	{alert("Box nao encontrado");return;}
	switch(tipo)
	{
		case "desloca":
		// muda o retï¿½gulo de zoom conforme deslocamento do mouse
		bxs.display="block";
		ppx = objposicaocursor.telax;
		py = objposicaocursor.telay;
		if (navm)
		{
			if ((ppx > boxxini) && ((ppx - boxxini - 2) > 0))
			{bxs.width = ppx - boxxini - 2;}
			if ((py > boxyini) && ((py - boxyini - 2) > 0))
			{
				bxs.height = py - boxyini - 2;
			}
			if (ppx < boxxini)
			{bxs.left = ppx;bxs.width = boxxini - ppx + 2;}
			if (py < boxyini)
			{bxs.top = py;bxs.height = boxyini - py + 2;}
		}
		else
		{
			if (ppx > boxxini)
			{bxs.width = ppx - boxxini - 15 + "px";}
			if (py > boxyini)
			{bxs.height = py - boxyini - 15 + "px";}
			if (ppx < boxxini)
			{bxs.left = ppx + "px";bxs.width = boxxini - ppx + 15 + "px";}
			if (py < boxyini)
			{bxs.top = py + "px";bxs.height = boxyini - py + 15 + "px";}
		}
		break;
		case "termina":
		// finaliza o retï¿½gulo de zoom
		md = 1;
		eval ('pix = parseInt(document.getElementById("box1").style.' + g_tipoleft + ")");
		eval ('piy = parseInt(document.getElementById("box1").style.' + g_tipotop + ")");
		xfig0 = parseInt(bxs.width) - imagemxi;
		yfig0 = parseInt(bxs.height) - imagemyi;
		xfig = pix + (parseInt(bxs.width)) - imagemxi;
		yfig = piy + (parseInt(bxs.height)) - imagemyi;
		amext = objmapa.extent.split(" ");
		dx = ((amext[0] * -1) - (amext[2] * -1)) / (tamanhox - 1);
		dy = ((amext[1] * 1) - (amext[3] * 1)) / (tamanhoy - 1);
		if (dy < 0) dy=dy * -1;
		nx = g_celula * xfig;
		ny = g_celula * yfig;
		x1 = (amext[0] * 1) + nx;
		y1 = (amext[3] * 1) - ny;
		xfig = pix - imagemxi;
		yfig = piy - imagemyi;
		if (dy < 0) dy=dy * -1;
		nx = g_celula * xfig;
		ny = g_celula * yfig;
		x2 = (amext[0] * 1) + nx;
		y2 = (amext[3] * 1) - ny;
		v = x2+" "+y2+" "+x1+" "+y1;
		// se o retangulo for negativo pula essa parte para nï¿½ gerar erro
		if (g_tipoacao != "selecaobox")
		{
			if (x1 != x2)
			{
				objmapa.extent=v;
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+v+"&g_sid="+g_sid;
				cpObj.call(p,"mudaExtensao",ajaxredesenha);
			}
		}
		else
		{
			if (x1 != x2)
			{
				try
				{
					var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
					var tipo = "adiciona";
					//pega o tipo de operacao da janela de selecao
					if (doc.getElementById("tipoOperacao")){tipo = doc.getElementById("tipoOperacao").value;}
					if (objmapa.temaAtivo == ""){alert("Nenhum tema ativo");return;}
					//se tipo for limpa ou inverte, a operacao nao e executada no clique no mapa
					if ((tipo != "limpa") && (tipo != "inverte"))
					{
						objaguarde.abre("ajaxredesenha",$trad("o1"));
						var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+v+"&g_sid="+g_sid+"&tipo="+tipo+"&tema="+objmapa.temaAtivo;
						cpObj.call(p,"selecaobox",ajaxredesenha);
					}
				}
				catch(e){var e = "";}
			}
		}		
		bxs.visibility="hidden";
		bxs.width = 0;
		bxs.height = 0;
		document.getElementById("imgh").style.display="block";
		break;
	}
}
/*
Function: zoomIP

Localiza no mapa o usuário baseado em seu número IP.
*/
function zoomIP()
{
	try
	{
		var xxx = convdmsddf($i("xg").value,$i("xm").value,$i("xs").value);
		var yyy = convdmsddf($i("yg").value,$i("ym").value,$i("ys").value);
		var mostraIP = function(retorno)
		{
			if (retorno.data.latitude != null)
			{
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&tamanho=14&xy="+retorno.data.longitude+" "+retorno.data.latitude+"&g_sid="+g_sid;
				cpObj.call(p,"zoomPonto",ajaxredesenha);
			}
			else
			{alert("Nao foi possivel identificar a localizacao.");}
		};
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+g_sid;
		cpObj.call(p,"localizaIP",mostraIP);	
	}
	catch(e){var e = "";}
}
/*
Function: zoomPonto

Localiza uma coordenada no mapa.
*/
function zoomPonto()
{
	try
	{
		if ($i("xg"))
		{
			var xxx = convdmsddf($i("xg").value,$i("xm").value,$i("xs").value);
			var yyy = convdmsddf($i("yg").value,$i("ym").value,$i("ys").value);
			objaguarde.abre("ajaxredesenha",$trad("o1"));
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+xxx+" "+yyy+"&g_sid="+g_sid;
			cpObj.call(p,"zoomPonto",ajaxredesenha);
		}
	}
	catch(e){var e = "";}
}
/*
Function: clicouRef

Altera a abrangência do mapa quando o mapa de referência é clicado

*/
function clicouRef()
{
	try
	{
		objaguarde.abre("ajaxredesenha",$trad("o1"));
		objposicaocursor.refx = objposicaocursor.refx - parseInt(YAHOO.janelaRef.xp.panel.element.style.left) - 5;
		objposicaocursor.refy = objposicaocursor.refy - parseInt(YAHOO.janelaRef.xp.panel.element.style.top) - 25;
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+objmapa.scale+"&tipo=ref&x="+objposicaocursor.refx+"&y="+objposicaocursor.refy+"&g_sid="+g_sid;
		cpObj.call(p,"pan",ajaxredesenha);
	}
	catch(e){var e = "";objaguarde.fecha("ajaxredesenha");}
}
/*
Function: movimentoRef

Pega a coordenada do cursor sobre o mapa de referência

*/
function movimentoRef(obj)
{
	obj.onmousemove =function(exy)
	{
		if (navm){capturaposicao(obj);}
		else{capturaposicao(exy);}
	};
}
/*
Function: aplicaescala

Aplica a escala numerica definida no formulário existente no mapa.
*/
function aplicaescala()
{
	if ($i("escalanum"))
	{var nova = $i("escalanum").value;}
	else
	{var nova = objmapa.scale;}
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+nova+"&g_sid="+g_sid;
	g_operacao = "outras";
	cpObj.call(p,"mudaEscala",ajaxredesenha);
}
/*
Function: zoomtot

Zoom para a extensão default.
*/
function zoomtot()
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+objmapa.extentTotal+"&g_sid="+g_sid;
	g_operacao = "navega";
	cpObj.call(p,"mudaExtensao",ajaxredesenha);
}
/*
Function: panFixo

Desloca o mapa em uma direção determinada.
*/
function panFixo(direcao)
{
	if (direcao == "norte")
	{
		var y = objmapa.h / 6;
		var x = objmapa.w / 2;
	}
	if (direcao == "sul")
	{
		var y = objmapa.h - (objmapa.h / 6);
		var x = objmapa.w / 2;
	}
	if (direcao == "leste")
	{
		var x = objmapa.w - (objmapa.w / 6);
		var y = objmapa.h / 2;
	}
	if (direcao == "oeste")
	{
		var x = objmapa.w / 6;
		var y = objmapa.h / 2;
	}
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+objmapa.scale+"&x="+x+"&y="+y+"&g_sid="+g_sid;
	g_operacao = "navega";
	cpObj.call(p,"pan",ajaxredesenha);
}
/*
Function: ativaEntorno

Ativa ou desativa a carga do entorno.

Com o entorno ativo, são produzidas imagens no entorno do mapa, no estilo Google.
*/
function ativaEntorno()
{
	//if (navn)
	//{alert("opção em desenvolvimento");return;}
	if (g_entorno == "sim")
	{
		var letras=["L","O","N","S"];
		for (var l=0;l<4; l++)
		{
			if ($i("img"+letras[l]))
			{
				$i("img"+letras[l]).style.display = "none";
				$i("img"+letras[l]).src = "";
			}
		}
		$left("img",0);
		$top("img",0);
		g_entorno = "nao";
		alert("Entorno desativado");
		$i("img").style.visibility = "visible";
		$i("img").style.display = "block";
	}
	else
	{
		geraURLentorno();
		var letras=["L","O","N","S"];
		for (var l=0;l<4; l++)
		{
			if ($i("img"+letras[l]))
			{
				$i("img"+letras[l]).style.width = objmapa.w;
				$i("img"+letras[l]).style.height = objmapa.h;
				$i("img"+letras[l]).style.display = "block";
			}
		}
		g_entorno = "sim";
		ajustaEntorno();
		alert("Entorno ativado. o desenho do mapa pode demorar mais.");
	}
}
/*
Function: geraURLentorno

Gera as urls que farão parte dos divs de desenho do entorno do mapa
*/
function geraURLentorno()
{
	var nny = (objmapa.h / 2) * -1;
	var nnx = objmapa.w / 2;
	var sy = objmapa.h + (objmapa.h / 2);
	var sx = objmapa.w / 2;
	var lx = objmapa.w + (objmapa.w / 2);
	var ly = objmapa.h / 2;
	var ox = (parseInt(objmapa.w/2)) * -1;
	var oy = objmapa.h / 2;
	var u = window.location.protocol+"\/\/"+window.location.host+objmapa.cgi+"?map="+objmapa.mapfile;
	u += "&mode=map&imgext="+objmapa.extent+"&mapsize="+nnx+" "+oy+"&map_scalebar_status=off";
	var sul = u+"&imgxy="+sx/2+" "+sy/2;
	var norte = u+"&imgxy="+nnx/2+" "+nny/2;
	var leste = u+"&imgxy="+lx/2+" "+ly/2;
	var oeste = u+"&imgxy="+ox/2+" "+oy/2;
	$i("imgS").src=sul;
	$i("imgN").src=norte;
	$i("imgL").src=leste;
	$i("imgO").src=oeste;
}
/*
Function: ajustaEntorno

Ajusta o tamanho do mapa e das imagens do entorno
*/
function ajustaEntorno()
{
	$left("img",objmapa.w*-1);
	$left("imgS",objmapa.w*-1);
	$left("imgL",objmapa.w);
	$left("imgO",objmapa.w*-3);
	$left("imgN",objmapa.w*-1);
	$top("img",objmapa.h*-1);
	$top("imgS",objmapa.h*-1);
	$top("imgL",objmapa.h*-1);
	$top("imgN",objmapa.h*-1);
	$top("imgO",objmapa.h*-1);
}
/*
Section: atributos
*/
/*
Function: verificaTip

Verifica se a opção de identificação está ativa e se o mouse está parado.
Se o mouse estiver parado, chama a função de mostrar tip.
*/
function verificaTip()
{
	//insere div para tips
	if (!$i("tip"))
	{
		var novoel = document.createElement("div");
		novoel.id = "tip";
		novoel.style.position="absolute";
		if (navm)
		{novoel.style.filter = "alpha(opacity=90)";}
		document.body.appendChild(novoel);
	}
	if ((objmapa.parado == "parar") || (objmapa.parado=="cancela")){return;}
	if ((objmapa.parado == "sim") && (g_operacao == "identifica") && ($i("tip").style.display!="block"))
	{
		var i = $i("tip");
		var ist = i.style;
		ist.top = objposicaocursor.telay +20;
		ist.left = objposicaocursor.telax;
		i.innerHTML = "<table style='text-align:left'><tr><td style='text-align:left'>Pesquisando...</td></tr></table>";
		ist.display="block";
		eval(g_funcaoTip);
	}
	//mostra opção sobre o mouse quando está na função pan
	if (($i("box1")) && (objmapa.parado == "sim") && (document.getElementById("imgh").style.display=="block") && ($i("box1").style.visibility != "visible"))
	{
		if ((g_tipoacao == "zoomli") || (g_tipoacao == "zoomlo") || (g_tipoacao == "pan"))
		{
			if(g_mostraRosa == "sim")
			{
				if (navm)
				{$i("tip").style.filter = "alpha(opacity=0)";}
				else
				{$i("tip").style.opacity="5";}
				var setas = "<table id='rosaV' ><tr>";
				if (navm){var s = " style=\"filter:'alpha(opacity=0)'\" ";}
				if (navn){var s = " style='opacity:0' ";}
				setas += "<td "+s+" ></td>";
				setas += "<td><img class='rosanorte' title='norte' src='"+$im("branco.gif")+"' onclick=\"panFixo('norte')\" /></td>";
				setas += "<td "+s+" ></td></tr>";
				setas += "<tr><td><img class='rosaoeste' title='oeste' src='"+$im("branco.gif")+"' onclick=\"panFixo('oeste')\" /></td>";
				setas += "<td><table><tr>";
				setas += "<td><img class='rosamais' title='aproxima' onclick='zoomiauto()' src='"+$im("branco.gif")+"' </td>";
				setas += "<td><img class='rosamenos' title='afasta' onclick='zoomoauto()' src='"+$im("branco.gif")+"' </td>";
				setas += "</tr></table></td>";
				setas += "<td><img class='rosaleste' title='leste' src='"+$im("branco.gif")+"' onclick=\"panFixo('leste')\" /></td></tr>";
				setas += "<tr><td "+s+" ></td><td><img class='rosasul' title='sul' src='"+$im("branco.gif")+"' onclick=\"panFixo('sul')\" /></td><td "+s+" ></td></tr></table>";
				var i = $i("tip");
				i.innerHTML = setas;
				i.style.top = objposicaocursor.telay - 27;
				i.style.left = objposicaocursor.telax - 27;
				i.style.display="block";
				mostradicasf('','Clique nas pontas da rosa para navegar no mapa. Clique em x para parar de mostrar essa opção.','');
				return;
			}
		}
	}
	if ((objmapa.parado!="cancela") && ($i("tip").style.display!="block"))
	{objmapa.parado = "sim";}
	setTimeout('verificaTip()',g_tempotip);
}
/*
Function: verificaTipDefault

Executa a operação de identificação para mostrar um TIP.

Esta é a função default, definida na variável g_funcaoTip
*/
function verificaTipDefault()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=identifica&opcao=tip&xy="+objposicaocursor.ddx+","+objposicaocursor.ddy+"&resolucao=5&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_persistent_connection(true);
	cp.set_response_type("JSON");
	cp.call(p,"identifica",mostraTip);
}
/*
Function: mostraTip

Mostra a descrição de um elemento do mapa como um tip na posição do mouse.

Para que um tema tenha um tip, é necessário configurar o metadata TIP no map file.

Parameters:

retorno - retorno da função ajax.
*/
function mostraTip(retorno)
{
	var retorno = retorno.data;
	if ((retorno != "erro") && (retorno != undefined))
	{
		if ($i("img"))
		{$i("img").title = "";}
		if (retorno != "")
		{
			var res = "<div id='cabecatip' style='text-align:left;background-color:rgb(240,240,240)'><span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:objmapa.parado=\"cancela\"'>parar&nbsp;&nbsp;</span>";
			res += "<span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:objmapa.objtips.push($i(\"tip\"));$i(\"tip\").id=\"\";$i(\"cabecatip\").innerHTML =\"\";$i(\"cabecatip\").id =\"\"' >fixar</span></div>";
			var temas = retorno.split("!");
			var tema = temas.length-1;
			if(tema >= 0)
			{
				do
				{
					var titulo = temas[tema].split("@");
					if (g_tipotip == "completo")
					{
						res += "<span style='text-align:left;font-size:9pt'><b>"+titulo[0]+"</b></span><br>";
					}
					var ocorrencias = titulo[1].split("*");
					var ocorrencia = ocorrencias.length-1;
					if(ocorrencia >= 0)
					{
						do
						{
							if (ocorrencias[ocorrencia] != "")
							{
								var pares = ocorrencias[ocorrencia].split("##");
								var paresi = pares.length;
								for (var par=0;par<paresi; par++)
								{
									var valores = pares[par].split("#");
									if (g_tipotip == "completo")
									{
										res = res + "<span class='tiptexto' style='text-align:left;font-size:9pt'>" + valores[0] + " <i>" + valores[1] + "</i></span><br>";
									}
									else
									{
										res = res + "<span class='tiptexto' style='text-align:left;font-size:9pt'><i>" + valores[1] + "</i></span><br>";
									}
								}
							}
						}
						while(ocorrencia--)
					}
				}
				while(tema--)
			}
			if ($i("janelaMen"))
			{
				$i("janelaMenTexto").innerHTML = res;
			}
			else
			{
				var i = $i("tip");
				i.innerHTML = "<table style='text-align:left'><tr><td style='text-align:left'>"+res+"</td></tr></table>";
				ist = i.style;
				ist.top = objposicaocursor.telay - 10;
				ist.left = objposicaocursor.telax - 20;
				ist.display="block";
			}
		}
	}
}
/*
Section: legenda
*/
/*
Function: legendaGrafico

Mostra a legenda dos gráficos adicionados no mapa.

Chamado pela ferramenta de inclusão de gráficos

Parâmetros:

par - string com os parâmetros item*r,g,b*item....
*/
function legendaGrafico(par)
{
	try
	{
		var temp = par.split("*");
		var par = "<table>";
		var i = temp.length-1;
		if(i >= 0)
		{
			do
			{
				var t = temp[i];
				var t = t.split(",");
				par += "<tr style='text-align:left'><td style='background-color:rgb("+t[1]+","+t[2]+","+t[3]+")'>&nbsp;&nbsp;</td><td style='text-align:left'>"+t[0]+"</td></tr>";
			}
			while(i--)
		}
		par += "</table>";
		if (!$i("legendagr"))
		{
			var novoel = document.createElement("div");
			var temp = '<div class="hd">Legenda</div>';
			temp += '<div class="bd">';
			temp += '<div id="contemleggr" ></div></div>';
			novoel.id = "legendagr";
			novoel.style.display="block";
			novoel.style.textAlign="left";
			novoel.innerHTML = temp;
			document.body.appendChild(novoel);
			YAHOO.namespace("legendagr.xp");
			YAHOO.legendagr.xp.panel = new YAHOO.widget.Panel("legendagr", {width:"250px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		}
		$i("contemleggr").innerHTML = par;
		YAHOO.legendagr.xp.panel.render();
		YAHOO.legendagr.xp.panel.show();
	}
	catch(e){alert("Ocorreu um erro. legendaGrafico"+e);}
}
/*
Function: inverteStatusClasse

Ativa ou desativa a visualização de uma classe de um tema.

Parameters:

leg - objeto input clicado no mapa
*/
function inverteStatusClasse(leg)
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+g_sid+"&tema="+leg.name+"&classe="+leg.value;
	cpObj.call(p,"inverteStatusClasse",ajaxredesenha);
}
/*
Section: sistemas de busca e navegação
*/
/*
Function: atualizagoogle

Atualiza o box do google se a função google estiver ativa
*/
function atualizagoogle()
{
	if (window.parent.frames["wdocai"])
	{
		if (navn)
		{
			if ($i("wdocai"))
			{var doc = $i("wdocai").contentDocument;}
		}
		else
		{
			if(document.frames("wdocai"))
			{var doc = document.frames("wdocai").document;}
		}
		if(doc)
		{
			if (doc.getElementById("map"))
			{
				if(window.parent.frames["wdocai"].panTogoogle)
				{window.parent.frames["wdocai"].panTogoogle();}
			}
		}
	}
}
/*
Function: atualizascielo

Atualiza a lista de dados na opção de busca Scielo
*/
function atualizascielo()
{
	if ($i("wdocai"))
	{
		if (window.parent.frames["wdocai"])
		{
			var docel = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			if (docel.getElementById("resultadoscielo"))
			{
				$i("wdocai").src = g_locaplic+"/ferramentas/scielo/index.htm";
			}
		}
	}
}	
/*
Function: atualizaconfluence

Atualiza a lista de dados na opção de busca confluence
*/
function atualizaconfluence()
{
	if($i("wdocai"))
	{
		if (window.parent.frames["wdocai"])
		{
			var docel = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			if (docel.getElementById("resultadoconfluence"))
			{
				$i("wdocai").src = g_locaplic+"/ferramentas/confluence/index.htm";
			}
		}
	}
}
/*
Function: atualizawiki

Atualiza a lista de dados na opção de busca wiki
*/
function atualizawiki()
{
	if ($i("wdocai"))
	{
		if (window.parent.frames["wdocai"])
		{
			var docel = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			if (docel.getElementById("resultadowiki"))
			{
				$i("wdocai").src = g_locaplic+"/ferramentas/wiki/index.htm";
			}
		}
	}
}
/*
Section: menu de temas e outras listagens
*/
/*
Function: procurartemas

Localiza um tema no menu de temas.
*/
function procurartemas()
{
	var procurar = removeAcentos(document.getElementById("buscatema").value);
	var resultadoProcurar = function(retorno)
	{
		if(!retorno.data)
		{$i("achados").innerHTML = "<span style='color:red'>Nada encontrado<br><br></span>";return;}
		var retorno = retorno.data;
		if ((retorno != "erro") && (retorno != undefined))
		{
			var ins = "";
			var ig = retorno.length-1;
			if(ig >= 0)
			{
				do
				{
					var ngSgrupo = retorno[ig].subgrupos;
					var tempn = ngSgrupo.length;
					for (var sg=0;sg<tempn;sg++)
					{
						var nomeSgrupo = ngSgrupo[sg].subgrupo;
						var ngTema = ngSgrupo[sg].temas;
						var tempng = ngTema.length;
						for (var st=0;st<tempng;st++)
						{
								if ( ngTema[st].link != " ")
								{var lk = "<a href='"+ngTema[st].link+"' target='blank'>&nbsp;fonte</a>";}
								var tid = ngTema[st].tid;
								var inp = "<input style='text-align:left;cursor:pointer;' onclick='mudaboxnf(\"adiciona\")' class='inputsb' style='cursor:pointer' type='checkbox' value='"+tid+"' onmouseover=\"javascript:mostradicasf(this,'Clique para ligar ou desligar esse tema, mostrando-o ou não no mapa. Após alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no botão aplicar que será mostrado.','ligadesliga')\" onmouseout=\"javascript:mostradicasf(this,'')\" /> ("+nomeSgrupo+")";
								var nomeTema = inp+(ngTema[st].nome)+lk+"<br>";
								ins += nomeTema;
						}
					}
				}
				while(ig--)
			}
			if (ins != "")
			{
				$i("achados").innerHTML = ins+"<br>";
			}
			else
			{$i("achados").innerHTML = "<span style='color:red'>Nada encontrado<br><br></span>";}
		}
	};
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&procurar="+procurar+"&g_sid="+g_sid;
	cpObj.call(p,"procurartemas",resultadoProcurar);
}
/*
Function: expandeTema

Busca dados sobre um tema quando o botão de expandir tema (guia1) é clicado.

Parameters:

itemID - string Id do nó que foi expandido na árvore de grupos e subgrupos.
*/
function expandeTema(itemID)
{
	var lista = (objmapa.temas).split(";");
	if (!document.getElementById("idx"+itemID))
	{
		var l = lista.length-1;
		if(l >= 0)
		{
			do
			{
				var ltema = lista[l].split("*");
				//codigo,status,nome,transparencia,tipo,selecao,escala,download,tem features,conexao,tem wfs
				if (ltema[0] == itemID)
				{
					var farol = "maisamarelo.png";
					if (ltema[8] == undefined){ltema[8] = "nao";}
					if (ltema[6]*1 < objmapa.scale*1)
					{
				 		var farol = "maisverde.png";
				 		var mfarol = $trad("t9");
					}
					if (ltema[6]*1 > objmapa.scale*1)
					{
				 		var farol = "maisvermelho.png";
						var mfarol = $trad("t10");
					}
					if (ltema[6] == 0)
					{
				 		var farol = "maisamarelo.png";
						var mfarol = $trad("t11");
					}
					tnome = "&nbsp;<img id='farol"+ltema[0]+"' src='"+$im(farol)+"' title='"+mfarol+"' \>";
					tnome += "&nbsp;<img  id='idx"+ltema[0]+"' class='x' src='"+$im("branco.gif")+"' title='"+$trad("t12")+"' onclick='excluitemaf(\""+ltema[0]+"\")' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t12a")+"','exclui')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";
					tnome += "&nbsp;<img class='sobe' src='"+$im("branco.gif") +"' title='"+$trad("t13")+"' onclick='sobetemaf(\""+ltema[0]+"\")' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t14")+"','sobe')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";
					tnome += "&nbsp;<img class='desce' src='"+$im("branco.gif") +"' title='"+$trad("t15")+"' onclick='descetemaf(\""+ltema[0]+"\")' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t16")+"','desce')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";
					if(ltema[11] == "sim")
					{tnome += "&nbsp;<img class='extent' src='"+$im("branco.gif") +"' title='"+$trad("t17")+"' onclick='zoomtemaf(\""+ltema[0]+"\")' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t18")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";}
					mytreeview1.createItem("temap0"+ltema[0], tnome, imgBranco, false, true, true, ltema[0]);
					if (g_opcoesTemas == "sim")
					{mytreeview1.createItem("opc"+ltema[0], $trad("t18a"), imgBranco, true, true, true, ltema[0]);}
					mytreeview1.createItem("legenda"+ltema[0], $trad("t18b"), imgBranco, true, true, true, ltema[0]);
					if (g_opcoesTemas == "sim")
					{
						var im = "";
						if (navn)
						{var im = "<img src='"+g_locaplic+"/imagens/branco.gif' width='0' height='13' />";}
						//transparencia
						if ((ltema[4] != 0) || (ltema[8] == "sim"))
						{
							tnome = "<span onclick='mudatranspf(\""+ltema[0]+"\")'>"+im+"<img class='tic' src='"+$im("branco.gif")+"' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t19")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t20")+" </span><input  class=digitar type=text size=3 value='"+ltema[3]+"' id='tr"+ltema[0]+"' />";
							mytreeview1.createItem("temap1"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
						}
						//muda nome
						tnome = "<span onclick='mudanomef(\""+ltema[0]+"\")'>"+im+"<img class='tic' src='"+$im("branco.gif")+"' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t21a")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t21")+" </span><input class=digitar type=text size=10 value='' id='nn"+ltema[0]+"' />";
						mytreeview1.createItem("temap2"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
						if ((ltema[4] < 3) && (ltema[9] != 7))
						{
							tnome = "<span onclick='procuraratribf(\""+ltema[0]+"\")'>"+im+"<img class='tic' src="+$im("branco.gif")+" onmouseover=\"javascript:mostradicasf(this,'"+$trad("t22")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t23")+" </span>";
							mytreeview1.createItem("temap3"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
							tnome = "<span onclick='toponimiaf(\""+ltema[0]+"\")'>"+im+"<img class='tic' src="+$im("branco.gif") + " onmouseover=\"javascript:mostradicasf(this,'"+$trad("t24")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t25")+" </span>";
							mytreeview1.createItem("temap4"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
							tnome = "<span onclick='etiquetas(\""+ltema[0]+"\")'>"+im+"<img class='tic' src="+$im("branco.gif") + " onmouseover=\"javascript:mostradicasf(this,'"+$trad("t26")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t27")+" </span>";
							mytreeview1.createItem("temap7"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
							tnome = "<span onclick='filtrof(\""+ltema[0]+"\")'>"+im+"<img class='tic' src="+$im("branco.gif") + " onmouseover=\"javascript:mostradicasf(this,'"+$trad("t28")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t29")+" </span>";
							mytreeview1.createItem("temap5"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
							tnome = "<span onclick='tabelaf(\""+ltema[0]+"\")'>"+im+"<img class='tic' src="+$im("branco.gif") + " onmouseover=\"javascript:mostradicasf(this,'"+$trad("t30")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t31")+" </span>";
							mytreeview1.createItem("temap6"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
						}
						if (ltema[4] < 4)
						{
							tnome = "<span onclick='editaLegenda(\""+ltema[0]+"\")'>"+im+"<img class='tic' src='"+$im("branco.gif") + "' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t32")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t33")+" </span>";
							mytreeview1.createItem("temap7"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
						}
						tnome = "<span onclick='destacaTema(\""+ltema[0]+"\")'>"+im+"<img class='tic' src='"+$im("branco.gif") + "' onmouseover=\"javascript:mostradicasf(this,'"+$trad("t34")+"','')\" onmouseout=\"javascript:mostradicasf(this,'')\" />&nbsp;"+$trad("t35")+" </span>";
						mytreeview1.createItem("temap8"+ltema[0], tnome, imgBranco, false, true, false, "opc"+ltema[0]);
					}
					mytreeview1.createItem("","", imgBranco, false, true, true, ltema[0]);
					break;
				}
			}
			while(l--)
		}
	}
	//verifica se clicou para expandir a legenda
	var tema = itemID.split("legenda");
	if (tema.length == 2)
	{
		var expandeLegendaVer = function (retorno)
		{
			if (retorno.data != undefined)
			{
				var original = retorno;
				//é um tema normal
				if (retorno.data.legenda)
				{
					var retorno = retorno.data.legenda;
					if (retorno[0])
					{
						if ((navn) && (!retorno[0].imagem))
						{tabela = retorno;}
						else
						{
							var i = retorno[0].imagem;
							var re = new RegExp("tiff", "g");
							var i = i.replace(re,'png');
							var tabela = "<img src='"+i+"' />";
						}					
						retorno = "";
					}
					else
					{
						var linhas = retorno.split("#");
						if (linhas.length > 1)
						{
							var linhas = retorno.split("|");
							var tabela = "<table >";
							var linha = linhas.length-1;
							if(linha >= 0)
							{
								do
								{
									var colunas = linhas[linha].split("#");
									var id = colunas[0]+"-"+colunas[1];
									var re = new RegExp("'", "g");
									var exp = colunas[3].replace(re,'"');
									tabela += "<tr style='border-top:1px solid rgb(240,240,240);'><td><img src='"+colunas[4]+"' </td><td style='text-align:left'>"+colunas[2]+"</td></tr>";
								}
								while(linha--)
							}
							tabela += "</table><br>";
						}
						else
						{tabela = retorno;}
					}
				}
				else //o tema é um wms
				{
					var tabela = "<img src='"+retorno.data[0].imagem+"' />";
				}
				if (!$i(g_arvoreClick+"verdiv"))
				{
					incluir = "<div style='text-align:left' id='"+g_arvoreClick+"verdiv"+"'>"+tabela+"</div>";
					mytreeview1.createItem(g_arvoreClick+"ver", incluir, imgBranco, false, true, true, g_arvoreClick);
				}
				else
				{
					$i(g_arvoreClick+"verdiv").innerHTML = tabela;
				}
				//desliga os checkbox que foram desativados
				//pega os objetos input
				var elementos = $i(g_arvoreClick+"verdiv").getElementsByTagName("input");
				var nelementos = elementos.length;
				var inputs = new Array();
				var i = 0;
				if (nelementos > 0)
				{
					do
					{
						if (elementos[i].type == "checkbox")
						{inputs.push(elementos[i]);}
						i++;
					}
					while(i < nelementos)
				}
				if(original.data.desativar)
				{
					var desativar = original.data.desativar;
					var nindices = desativar.length;
					var i = 0;
					if (nindices > 0)
					{
						do
						{
							inputs[desativar[i]].checked = false;
							i++;
						}
						while(i < nindices)
					}
				}	
			}
		};
		g_arvoreClick = itemID;
		tema = tema[1];
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&template=legenda2.htm&tema="+tema+"&g_sid="+g_sid;
		cpObj.call(p,"criaLegenda",expandeLegendaVer);
	}
}
/*
Function: expandeGrupo

Chama a função ajax que pega a lista de temas de um subgrupo no menu de temas.

Parameters:

itemID - string Id do nó que foi expandido na árvore de grupos e subgrupos.
*/
function expandeGrupo(itemID)
{
	g_arvoreClick = itemID;
	if ((itemID.search("sgrupo") > -1) && (g_arvoreClicks.search(itemID) == -1 ))
	{
		var codigos = itemID.split("_");
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&grupo="+codigos[1]+"&subgrupo="+codigos[2]+"&g_sid="+g_sid+"&idmenu="+codigos[3];
		cpObj.call(p,"pegaListaDeTemas",processaTemas);
	}
}
/*
Function: pegaListaDeGrupos

Pega a lista de grupos de uma árvore de tremas.

Parameters:

idmenu - id que identifica a árvore. Esse id é definido no ms_configura, variável $menutemas. Se idmenu for vazio, será considerado o arquivo de menus default do I3Geo, existente no diretório menutemas.

listasistemas - sim|nao pega a lista de sistemas para montar a árvore de sistemas
*/
function pegaListaDeGrupos(idmenu,listasistemas)
{			
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&g_sid="+g_sid+"&idmenu="+idmenu+"&listasistemas="+listasistemas;
	cpObj.call(p,"pegaListaDeGrupos",processaGrupos);
}
/*
Function: processaGrupos

Recebe os dados da função Ajax com a lista de grupos e subgrupos.

Monta a árvore para adição de um novo tema no mapa.

Parameters:

retorno - string formatada com os dados para montagem da árvore.
*/
function processaGrupos(retorno)
{
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		var idarvore = retorno.data.grupos[retorno.data.grupos.length - 2].idmenu;
		if ($i("buscatema"))
		{var busca = $i("buscatema").value;}
		//$i(objmapa.guiaMenu+"obj").innerHTML = "";
		if (!document.getElementById("buscatema"))
		{
			var insp = "<div style='text-align:left;'><table  cellspacing='0' cellpadding='0' ><tr><td style='text-align:left;font-size:10px;'>";
			insp = insp + "<img src='"+g_locaplic+"/imagens/branco.gif'  height=0 />";
			insp = insp + "<p>&nbsp;"+$trad("a1")+"<input class='digitar' type='text' id='buscatema' size='15' value=''  /><img  class='tic' title='"+$trad("a1")+"' src='"+$im("branco.gif")+"' onclick='procurartemas()' style='cursor:pointer'/></td></tr></table><br>";
			$i(objmapa.guiaMenu+"obj").innerHTML = insp+"<div style='text-align:left;font-size:10px;' id='achados' ></div></div>";
		}
		if (!$i("uplocal"))
		{
			var upload = "";
			if (g_uploadlocal == "sim")
			{upload += "<div id='uplocal' style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='upload()'><img class='upload' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  />&nbsp;"+$trad("a2")+"</div>";}
			if (g_downloadbase == "sim")
			{upload += "<div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='downloadbase()'><img class='download' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  />&nbsp;"+$trad("a3")+"</div>";}
			if (g_conectarwms == "sim")
			{upload += "<div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='conectarwms()'><img class='conectarwms' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  />&nbsp;"+$trad("a4")+"</div>";}
			if (g_conectargeorss == "sim")
			{upload += "<div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='conectargeorss()'><img class='conectargeorss' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  />&nbsp;"+$trad("a5")+"</div>";}
			$i(objmapa.guiaMenu+"obj").innerHTML += upload;
			if (objmapa.navegacaoDir == "sim")
			{
				var temp = "<div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='navegacaoDir()'><img class='conectarservidor' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  />&nbsp;"+$trad("a6")+"</div>";
				$i(objmapa.guiaMenu+"obj").innerHTML += temp;
			}
		}
		//arvore de menus
		mytreeview2 = new Object();
		mytreeview2 = treeviewNew("mytreeview2"+idarvore, "default", objmapa.guiaMenu+"obj", null);
		var nometemas = $trad("a7");
		if (idarvore != ""){nometemas += " - "+idarvore;}
		mytreeview2.createItem("item1"+idarvore, "<b>"+nometemas+"</b>", "foldermapa", true, true, true, null);
		mytreeview2.itemExpand = expandeGrupo;
		var ilt = retorno.data.grupos.length;
		var i = 0;
		do
		{
			if (retorno.data.grupos[i].nome)
			{
				mytreeview2.createItem("grupo"+i+"a"+idarvore, retorno.data.grupos[i].nome, "folder", true, true, true, "item1"+idarvore);
				var ngSgrupo = retorno.data.grupos[i].subgrupos;
				var cor = "rgb(230,230,230)";
				var sglt = ngSgrupo.length;
				if (sglt>0)
				{
					var sg = 0;
					do
					{
						if (navm)
						var nomeSgrupo = "<span style='background-color:"+cor+"' >"+ngSgrupo[sg].nome+"</span>";
						else
						var nomeSgrupo = "<span style='background-color:"+cor+"' ><img src='"+g_locaplic+"/imagens/branco.gif' width='0' height='15' />"+ngSgrupo[sg].nome+"</span>";
						mytreeview2.createItem("sgrupo_"+i+"_"+sg+"a"+"grupo"+i+"_"+idarvore, nomeSgrupo, imgBranco, true, true, false, "grupo"+i+"a"+idarvore);
						if (cor == "rgb(230,230,230)"){var cor = "rgb(255,255,255)";}
						else
						{var cor = "rgb(230,230,230)";}
						sg++;
					}
					while(sg<sglt)
				}
				var ngtSgrupo = retorno.data.grupos[i].temasgrupo;
				var sgtlt = ngtSgrupo.length;
				if(sgtlt > 0)
				{
					var sgt=0;
					do
					{
						var no = ngtSgrupo[sgt];
						var nome = no.nome;
						var lk = no.link;
						if ( lk != " ")
						{var lk = "<a href="+lk+" target='blank'>&nbsp;fonte</a>";}
						var tid = no.tid;
						var inp = "<input style='text-align:left;cursor:pointer;' onclick='mudaboxnf(\"adiciona\")' class='inputsb' style='cursor:pointer' type=\"checkbox\" value="+tid+" onmouseover=\"javascript:mostradicasf(this,'"+$trad("a8")+"','ligadesliga')\" onmouseout=\"javascript:mostradicasf(this,'')\" />";
						if(navm)
						nomeTema = "&nbsp;"+inp+nome+lk;
						else
						nomeTema = "<span><img src='"+g_locaplic+"/imagens/branco.gif' width='0' height='15' />"+inp+nome+lk+"</span>";
						mytreeview2.createItem("sgrupo_"+i+"_"+sg+"_"+sgt+"_"+idarvore, nomeTema, imgBranco, false, true, false, "grupo"+i+"a"+idarvore);
						sgt++;
					}
					while(sgt<sgtlt)
				}		
			}
			if (retorno.data.grupos[i].temasraiz)
			{
				var stlt = retorno.data.grupos[i].temasraiz.length;
				var st = 0;
				if(stlt > 0)
				{
					do
					{
						var no = retorno.data.grupos[i].temasraiz[st];
						var nome = no.nome;
						var lk = no.link;
						if ( lk != " ")
						{var lk = "<a href="+lk+" target='blank'>&nbsp;fonte</a>";}
						var tid = no.tid;
						var inp = "<input style='text-align:left;cursor:pointer;' onclick='mudaboxnf(\"adiciona\")' class='inputsb' style='cursor:pointer' type='checkbox' value="+tid+" onmouseover=\"javascript:mostradicasf(this,'"+$trad("a8")+"','ligadesliga')\" onmouseout=\"javascript:mostradicasf(this,'')\" />";
						if(navm)
						nomeTema = "&nbsp;"+inp+nome+lk;
						else
						nomeTema = "<span><img src='"+g_locaplic+"/imagens/branco.gif' width='0' height='15' />"+inp+nome+lk+"</span>";
						mytreeview2.createItem("tema"+i+""+st+"a"+idarvore, nomeTema, imgBranco, false, true, true, "item1"+idarvore);
						st++;
					}
					while(st<stlt)
				}
				mytreeview2.createItem("", "", imgBranco, false, true, true, "item1"+idarvore);
			}
			i++;
		}
		while(i<ilt)
		if (g_locsistemas != "")
		{pegavalSistemas(retorno.data.grupos[retorno.data.grupos.length - 1].sistemas);}		
	}
}
/*
Function: processaTemas

Recebe os dados da função Ajax com a lista de temas de um subgrupo.

Monta a árvore para adição de um novo tema no mapa.

Parameters:

retorno - string formatada com os dados para montagem da árvore.
*/
function processaTemas(retorno)
{
	if ((retorno.data != "erro") && (retorno.data != undefined))
	{
		var cor = "rgb(251,246,184)";
		var stlt = retorno.data.temas.length;
		if(stlt > 0)
		{
			var st = 0;
			var sg = g_arvoreClick;
			do
			{
				var nome = retorno.data.temas[st].nome;
				var lk = retorno.data.temas[st].link;
				if ( lk != " ")
				{var lk = "<a href="+lk+" target='blank'>&nbsp;"+$trad("a9")+"</a>";}
				var tid = retorno.data.temas[st].tid;
				//
				//inclui o link para abrir o qrcode e kml
				//
				var inp = "<input style='text-align:left;cursor:pointer;' onclick='mudaboxnf(\"adiciona\")' class='inputsb' style='cursor:pointer' type=\"checkbox\" value="+tid+" onmouseover=\"javascript:mostradicasf(this,'"+$trad("a8")+"','ligadesliga')\" onmouseout=\"javascript:mostradicasf(this,'')\" />";
				var lkgrcode = g_locaplic+"/pacotes/qrcode/php/qr_html.php?d="+g_locaplic+"/mobile/index.php?temasa="+tid;
				var lkgrcode1 = g_locaplic+"/pacotes/qrcode/php/qr_img.php?d="+g_locaplic+"/mobile/index.php?temasa="+tid;
				var qrcode = "&nbsp;<a onmouseover='mostradicasf(this,\"<img src="+lkgrcode1+" />\")' href='"+lkgrcode+"' target='blank' >qrcode</a>";	
				var kml = "&nbsp;<span style='cursor:pointer;text-decoration:underline;' onclick='abreKml(\""+tid+"\")' target='blank' >kml</span>";	
				if ((g_kml != "sim") && (retorno.data.temas[st].ogc != "nao"))
				{var kml = "";}
				var mini = "";
				var lkmini = g_locaplic+"/testamapfile.php?map="+tid+".map&tipo=mini";
				var lkmini1 = g_locaplic+"/testamapfile.php?map="+tid+".map&tipo=grande";
				var mini = "&nbsp;<a onmouseover='mostradicasf(this,\"<img src="+lkmini+" />\")' href='"+lkmini1+"' target='blank' >mini</a>";	
				
				if (g_qrcode == "nao"){qrcode = "";}
				if(navm)
				nomeTema = "<span style='background-color:"+cor+"' title='"+$trad("a10")+" "+tid+"'>"+inp+nome+lk+qrcode+kml+mini+"</span>";
				else
				nomeTema = "<span style='background-color:"+cor+"' title='"+$trad("a10")+" "+tid+"'><img src='"+g_locaplic+"/imagens/branco.gif' width='0' height='15' />"+inp+nome+lk+qrcode+kml+mini+"</span>";
				mytreeview2.createItem("tema"+sg+""+st, nomeTema, imgBranco, false, true, true, g_arvoreClick);
				if (cor == "rgb(251,246,184)"){var cor = "rgb(255,255,255)";}
				else
				{var cor = "rgb(251,246,184)";}
				st++;
			}
			while(st<stlt)
		}
		//inclui um item em branco
		mytreeview2.createItem("vazio", "", imgBranco, false, true, true, g_arvoreClick);
		g_arvoreClicks += ","+g_arvoreClick;
	}
}
/*
Function: pegavalSistemas

Adiciona uma árvore no menu de adição de temas, contendo os sistemas que podem ser executados.

Parameters:

sis - objeto com a lista de sistemas.
*/
function pegavalSistemas(sis)
{
	if(sis.length > 0)
	{
		mytreeviewS = new Object();
		mytreeviewS = treeviewNew("mytreeviewS", "default", objmapa.guiaMenu+"obj", null);
		mytreeviewS.createItem("Sitem1", "<b>"+$trad("a11")+"</b>", "foldermapa", true, true, true, null);
		var iglt = sis.length;
		var ig=0;
		do
		{
			var nomeSis = sis[ig].NOME;
			mytreeviewS.createItem("sis"+ig, nomeSis, "folder", true, true, true, "Sitem1");
			var funcoes = sis[ig].FUNCOES;
			var tempf = funcoes.length;
			for (var ig2=0;ig2<tempf;ig2++)
			{
				var nomeFunc = funcoes[ig2].NOME;
				var executar = funcoes[ig2].ABRIR;
				var w = funcoes[ig2].W;
				var h = funcoes[ig2].H;
				var inp = "<img class='folder' title='"+$trad("a12")+"' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left' onclick='abreSistema(\""+executar+"\",\""+w+"\",\""+h+"\")' />&nbsp;";
				mytreeviewS.createItem("sis"+ig+"func"+ig2, inp+nomeFunc, imgBranco, false, true, false, "sis"+ig);
			}
			ig++;
		}
		while(ig<iglt)
	}
}
/*
Function: pegaMapas

Recebe a lista de mapas (banners) e monta a apresentação.

Adiciona na guia mapas os banners que dão acesso direto a mapas especiais.

A indicação do arquivo xml é feita em ms_configura.php

*/
function pegaMapas(retorno)
{
	var ins = "<br>";
	var mapa = retorno.data.mapas;
	var ig1lt = mapa.length;
	var ig1=0;
	if(ig1lt > 0)
	{
		do
		{
			var nome = mapa[ig1].NOME;
			var descricao = mapa[ig1].DESCRICAO;
			var imagem = mapa[ig1].IMAGEM;
			var temas = mapa[ig1].TEMAS;
			var ligados = mapa[ig1].LIGADOS;
			var extensao = mapa[ig1].EXTENSAO;
			var outros = mapa[ig1].OUTROS;
			var lkd = mapa[ig1].LINK;
			var link = g_locaplic+"/ms_criamapa.php?temasa="+temas+"&layers="+ligados;
			if (extensao != "")
			{link += "&mapext="+extensao;}
			if (outros != "")
			{link += "&"+outros;}
			if (lkd != "")
			{var link = lkd;}
			ins += "<div><a href='"+link+"'><img src='"+imagem+"'></a></div><br>";
			ins += "<div><p>"+nome+"</p></div><br>";
			ig1++;
		}
		while(ig1<ig1lt)
	}
	$i("banners").innerHTML = ins;
}
/*
Function: arvoreclick

Adiciona um tema no mapa quando o usuário clica em um novo tema no menu de adição de temas.

Parameters:

itemID - ID que identifica qual tema foi clicado. O ID é definido no arquivo .map e no arquivo menutemas/menutemas.xml
*/
function arvoreclick(itemID)
{
	if (itemID.search("tema") == 0)
	{
		if ($i(itemID).checked == true)
		{$i(itemID).checked = false;}
		else
		{$i(itemID).checked = true;}
	}
}
/*
Function: pegaTema

Pega o tema de um no na guia de temas.

Utilizado nas opções que operam sobre um tema específico.

Parameters:

celula - objeto que foi clicado

Returns:

Id do tema.
*/
function pegaTema(celula)
{
	var nos = celula.parentNode.childNodes;
	var tempi = nos.length;
	for (var no=0;no<tempi; no++){if (nos[no].type == "checkbox"){return nos[no].value;}}
}
/*
Section: redesenho do mapa
*/
/*
Function: autoRedesenho

Controla a opção de redesenho automático temporizado

Para funcionar, a variável de inicialização g_autoRedesenho deve ser > 0

Parameters:

opcao: ativa|desativa|redesenha
*/
function autoRedesenho(opcao)
{
	if (opcao == "desativa")
	{
		g_autoRedesenho = 0;
		clearTimeout(objmapa.tempoRedesenho);
		clearTimeout(objmapa.contaTempoRedesenho);
		objmapa.tempoRedesenho = "";
		objmapa.contaTempoRedesenho = "";
		objmapa.tempoRedesenho = "";
		if ($i("tempoRedesenho"))
		{$i("tempoRedesenho").style.display = "none";}
	}
	if (opcao == "ativa")
	{
		if (($i("tempoRedesenho")) && (g_autoRedesenho > 0))
		{$i("tempoRedesenho").style.display = "block";}
		if (g_autoRedesenho > 0)
		{objmapa.tempoRedesenho = setTimeout('autoRedesenho("redesenha")',g_autoRedesenho);}
		if (($i("tempoRedesenho")) && (g_autoRedesenho > 0))
		{
			$i("tempoRedesenho").innerHTML = g_autoRedesenho/1000;
			objmapa.contaTempoRedesenho = setTimeout('autoRedesenho("contagem")',1000);
		}
	}
	if (opcao == "redesenha")
	{
		clearTimeout(objmapa.tempoRedesenho);
		clearTimeout(objmapa.contaTempoRedesenho);
		remapaf();
		autoRedesenho("ativa");
	}
	if (opcao == "contagem")
	{
		if ($i("tempoRedesenho"))
		{
			$i("tempoRedesenho").innerHTML = parseInt($i("tempoRedesenho").innerHTML) - 1;
			objmapa.contaTempoRedesenho = setTimeout('autoRedesenho("contagem")',1000);
		}
	}
}
/*
Function: remapaf

Prepara o redesenho do mapa de acordo com o que esta visivel ou nao.

Chamado por algumas funções que necessitam refazer o desenho do mapa.

Verifica na lista de temas já adicionados, os temas que estão ligados e desligados,
Chama a função que verifica na lista de temas adicionais.
*/
function remapaf()
{
	clearTimeout(objmapa.tempo);
	objmapa.tempo = "";
	objmapa.temaAtivo = "";
	if ($i(objmapa.guiaTemas+"obj"))
	{
		var iguias = $i(objmapa.guiaTemas+"obj").getElementsByTagName("input");
		var tsl = new Array();
		var tsd = new Array();
		var i = iguias.length-1;
		if (i >= 0)
		{
			do
			{
				if (iguias[i].type == "checkbox")
				{
					if (iguias[i].checked == false)
					{tsd.push(iguias[i].value);}
					if (iguias[i].checked == true)
					{tsl.push(iguias[i].value);}
				}
			}
			while(i--)
		}
		var remapaAdicNovos = function remapaAdicNovos(retorno)
		{
			if ($i("buscatema"))
			{
				var g = $i(objmapa.guiaMenu+"obj");
				var iguias = g.getElementsByTagName("input");
				var ta = new Array();
				var i = iguias.length-1;
				if (i >= 0)
				{
					do
					{
						if (iguias[i].type == "checkbox")
						{
							if (iguias[i].checked == true)
							{
								ta.push(iguias[i].value);
								iguias[i].checked = false;
							}
						}
					}
					while(i--)
				}
				if (ta.length > 0)
				{
					objaguarde.fecha("remapa");
					objaguarde.abre("ajaxredesenha",$trad("o1"));
					var temp = function(retorno)
					{
						objaguarde.fecha("ajaxredesenha");
						if(retorno.data.erro)
						{
							alert(retorno.data.erro);
							return;
						}
						ajaxredesenha("");					
					};
					var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+(ta.toString())+"&g_sid="+g_sid;
					cpObj.call(p,"adicionaTema",temp);
				}
				else
				{
					objaguarde.fecha("remapa");
					objaguarde.abre("ajaxredesenha",$trad("o1"));
					ajaxredesenha("");
				}
			}
			else
			{
				objaguarde.fecha("remapa");
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				ajaxredesenha("");
			}
		};
		if ((tsd.length > 0) || (tsl.length > 0))
		{
			objaguarde.abre("remapa",$trad("o1"));
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+(tsd.toString())+"&ligar="+(tsl.toString())+"&g_sid="+g_sid;
			cpObj.call(p,"ligaDesligaTemas",remapaAdicNovos);
		}
		else{remapaAdicNovos();}
		objaguarde.fecha("remapa");
	}
	else
	{remapaAdicNovos();}
}
/*
Section: eventos
*/
/*
Function: processevent1 (depreciado)

Captura a posição do mouse tendo como referência o navegador.

Atualiza o objeto objposicaomouse e movimenta as janelas docáveis.

Recalcula a posição correta da imagem do mapa.

Parameters:

exy1 - objeto evento.
*/
function processevent1(exy1)
{}
/*
Function: calcposf

Calcula a posição correta do corpo do mapa e posiciona-o.

Atualiza as variáveis imagemxi,imagemyi,imagemxref e imagemyref
*/
function calcposf()
{
	try
	{
		imagemxi = 0;
		imagemyi = 0;
		imagemxref = 0;
		imagemyref = 0;
		if(!$i("i3geo")){return;}
		if ($i("i3geo").style.left){imagemxi += parseInt($i("i3geo").style.left);}
		if ($i("i3geo").style.top){imagemyi += parseInt($i("i3geo").style.top);}	
		var dc = $i("i3geo");
		if ($i("img"))
		{var dc = $i("contemImg");}
		if ($i("openlayers_OpenLayers_Container"))
		{var dc = $i("openlayers_OpenLayers_Container");}
		while ((dc.offsetParent) && (dc.offsetParent.id != "i3geo"))
		{
			dc = dc.offsetParent;
			imagemxi = imagemxi + dc.offsetLeft;
			imagemyi = imagemyi + dc.offsetTop;
		}

		if ($i("img"))
		{
			$left("corpoMapa",imagemxi);
			$top("corpoMapa",imagemyi);
			if ($i("i3geo").style.left){$left("corpoMapa",imagemxi - parseInt($i("i3geo").style.left));}
			if ($i("i3geo").style.top){$top("corpoMapa",imagemyi - parseInt($i("i3geo").style.top));}
		}
		if ($i("ref"))
		{
			var dc = $i("ref");
			while (dc.offsetParent.id != "i3geo")
			{
				dc = dc.offsetParent;
				imagemxref = imagemxref + dc.offsetLeft;
				imagemyref = imagemyref + dc.offsetTop;
			}
		}
		if ($i("aguarde"))
		{
			$top("aguarde",imagemyi);
			$left("aguarde",imagemxi);
		}
	}
	catch(e){alert("Ocorreu um erro. calcposf"+e);}
}
/*
Function: movecursor

Move o ícone que segue o mouse quando da movimentação sobre o mapa
*/
function movecursor()
{
	var obje = $i("obj").style;
	if ($i("img"))
	{
		eval ("obje." + g_tipotop + "= objposicaocursor.telay + 5 + g_postpx");
		eval ("obje." + g_tipoleft + "= objposicaocursor.telax + 5 + g_postpx");
	}
	else
	{
		eval ("obje." + g_tipotop + "= objposicaocursor.telay - 15 + g_postpx");
		eval ("obje." + g_tipoleft + "= objposicaocursor.telax + 15 + g_postpx");
	}	
	if($i("box1"))
	{
		var bx = $i("box1");
		if (bx.style.visibility != "visible")
		{
			//move o box para a posição correta
			bx.style.left = objposicaocursor.telax + g_postpx;
			bx.style.top = objposicaocursor.telay + g_postpx;
		}
	}
}
/*
Function: capturaposicao

Captura a posição do mouse em função do evento onmousemove sobre o corpo do mapa.

Atualiza o objeto objposicaocursor.
A função de mostrar TIP é definida como "" quando o mouse é movimentado.

Parameters:

exy - objeto evento.
*/
function capturaposicao(exy)
{
	var e = (navn) ? exy : window.event;
	if (navm)
	{
		var storage = e.clientY+document.body.scrollTop;
		var storage1 = e.clientX+document.body.scrollLeft;
		calcposf(); 
		var xfig = e.clientX - imagemxi + document.body.scrollLeft;
		var yfig = e.clientY - imagemyi + document.body.scrollTop;
		var xreffig = e.clientX - imagemxref + document.body.scrollLeft;
		var yreffig = e.clientY - imagemyref + document.body.scrollTop;
	}
	else
	{
		var storage = e.clientY+window.pageYOffset;
		var storage1 = e.clientX+window.pageXOffset;
		calcposf(); 
		var xfig = e.clientX - imagemxi + pageXOffset;
		var yfig = e.clientY - imagemyi + pageYOffset;
		var xreffig = e.clientX - imagemxref + pageXOffset;
		var yreffig = e.clientY - imagemyref + pageYOffset;
	}
	var teladd = calcddf(xfig,yfig,g_celula,objmapa.extent);
	var teladms = convdmsf(teladd[0],teladd[1]);
	objposicaocursor.ddx = teladd[0];
	objposicaocursor.ddy = teladd[1];
	objposicaocursor.dmsx = teladms[0];
	objposicaocursor.dmsy = teladms[1];
	objposicaocursor.telax = storage1;
	objposicaocursor.telay = storage;
	objposicaocursor.imgx = xfig;
	objposicaocursor.imgy = yfig;
	objposicaocursor.refx = xreffig;
	objposicaocursor.refy = yreffig;
	if (objmapa.parado!="cancela")
	{objmapa.parado = "nao";}
	ajaxTip = "";
}

/*
Section: quadro de animação
*/
/*
Function: gerafilmef

Cria os quadros que serão utilizados na função de animação e mostrados no mapa.

Cada novo quadro é criado como um objeto quadrofilme. Os quadros criados são armazenados no
array global quadrosfilme.

Parameters:

qs - número de quadros
*/
function gerafilmef(qs)
{
	try
	{
		if ($i("lugarquadros"))
		{
			var q = "<table class=tablefilme ><tr><td><div class='menuarrow'  title='op&ccedil;&otilde;es' onclick='opcoesQuadros()' style='cursor:pointer'></div></td>";
			for (var i = 0; i < qs; i++)
			{
				q = q + "<td><img class='quadro' src=\""+g_localimg+"/branco.gif\" id=f"+i+"  onmouseover='filmef(this);mostradicasf(this,\"Quadro - clique para restaurar\",\"quadro\")' onmouseout=\"javascript:mostradicasf(this,'')\" onclick='filmezf(this)' /></td>";
				var qu = new quadrofilme();
				quadrosfilme[i] = qu;
			}
			var finalq = "</tr></table>";
			document.getElementById("lugarquadros").innerHTML = q+finalq;
		}
	}
	catch(e){var e = "";}
}
/*
Function: gravaQuadro

Armazena um determinado valor em uma determinada característica de um objeto quadro.

Parameters:

variavel - parâmetro do objeto quadro.

valor - valor que será aplicado.
*/
function gravaQuadro(variavel,valor)
{
	try
	{
		var muda = -1;
		if ($i("lugarquadros"))
		{
			var nquadros = quadrosfilme.length;
			if (quadrosfilme[nquadros - 1].imagem != " ")
			{rebobinaf();}
			for (var i = 0; i < nquadros; i++)
			{
				if ((eval("quadrosfilme["+i+"]."+variavel+" == ' '")) && (muda < 0))
				{muda = i;}
			}
			if (eval("quadrosfilme["+(muda)+"]"))
			{eval("quadrosfilme["+(muda)+"]."+variavel+"='"+ valor+"'");}
		}
	}
	catch(e){var e = "";}
}
/*
Function: avancaQuadro

Avança um quadro na lista de quadros, mudando a imagem utilizada na sua representação.
*/
function avancaQuadro()
{
	try
	{
		var muda = -1;
		if ($i("lugarquadros"))
		{
			var nquadros = quadrosfilme.length;
			if (quadrosfilme[nquadros - 1].imagem != " ")
			{rebobinaf();}
			for (var i = 0; i < nquadros; i++)
			{
				if ((quadrosfilme[i].imagem == " ") && (muda < 0))
				{muda = i;}
			}
			$i("f"+muda).className = "quadro1";
		}
	}
	catch(e){var e = "";}
}
/*
Function: filmef

Mostra a imagem armazenada em um quadro no lugar do corpo do mapa.

Parameters:

o - quadro
*/
function filmef(o)
{
	try
	{
		if ($i("lugarquadros"))
		{
			var v = (o.id).replace("f","");
			if (quadrosfilme[v].imagem != " ")
			{$i("img").src = quadrosfilme[v].imagem;}
		}
	}
	catch(e){var e = "";}
}
/*
Function: rebobinaf

Rebobina as imagens dos quadros, limpando os parâmetros armazenados.
*/
function rebobinaf()
{
	try
	{
		janima = 0;
		var nquadros = quadrosfilme.length;
		for (var i = 0; i < nquadros; i++)
		{
			$i("f"+i).className = "quadro";
			with (quadrosfilme[i]){imagem = " ";escala = " ";legenda = " ";extensao = " ";referencia = " ";}
		}
	}
	catch(e){var e = "";}
}
/*
Function: filmezf

Muda a extensão geográfica do mapa conforme o valor armazenado em um quado de animação.

Parameters:

o - quadro
*/
function filmezf(o)
{
	var quadro = (o.id).replace("f","");
	if (quadrosfilme[quadro].extensao != " ")
	{
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+quadrosfilme[quadro].extensao+"&g_sid="+g_sid;
		objaguarde.abre("ajaxredesenha",$trad("o1"));
		cpObj.call(p,"mudaExtensao",ajaxredesenha);
	}
	else{alert("Extensao nao definida");}
}
/*
Function: filmeanimaf

Carrega as imagens armazenadas nos quadros de animação quadros.
*/
function filmeanimaf()
{
	preLoad = new Array();
	var tempi = quadrosfilme.length;
	for (var i = 0; i < tempi; i++)
	{
		$i("f"+i).className = "quadro";
		if (quadrosfilme[i].imagem != " ")
		{
			preLoad[i] = new Image();
			preLoad[i].src = quadrosfilme[i].imagem;
		}
	}
	filmeanimarodaf(0);
}
/*
Function: filmeanimarodaf

Roda a animacao usando as imagens armazenadas nos quadros de animação quadros.
*/
function filmeanimarodaf(janima)
{
	if (janima < quadrosfilme.length)
	{
		$i("img").src = preLoad[janima].src;
		$i("f"+janima).className = "quadro1";
		janima = janima + 1;
		var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		var ti = doc.getElementById("tempoanima").value;
		t = setTimeout('filmeanimarodaf('+janima+')',ti);
	}
}
/*
Function: quadrofilme

Cria um objeto quadro de animação. Cada quadro é utilizado para armazenar parâmetros de um mapa que foi visto na tela.
É utilizado pela função que lista as imagens já vistas no mapa e pela função que retorna a um determinado zoom do mapa.

Methods:

imagem - URL da imagem

escala - escala do mapa

legenda - URL da legenda do mapa

extensao - extensão geográfica do mapa com valores separados por espaço

referencia - URL do mapa de referência
*/
function quadrofilme()
{
	this.imagem = " ";
	this.escala = " ";
	this.legenda = " ";
	this.extensao = " ";
	this.referencia = " ";
}
/*
Section: calculos
*/
/*
Function calculaArea

Calcula a área de um polígono.

Os pontos são obtidos do objeto pontosdistobj

Referência - http://www.mail-archive.com/mapserver-users@lists.umn.edu/msg07052.html
*/
function calculaArea()
{
	try
	{
		if(pontosdistobj.xpt.length > 2)
		{
			var $array_length = pontosdistobj.xpt.length;
			// add the first coordinates at the end to close de polygon
			//array_push($polygon_coordinates,array($polygon_coordinates[0][0],$polygon_coordinates[0][1]));
			pontosdistobj.xtela.push(pontosdistobj.xtela[0]);
			pontosdistobj.ytela.push(pontosdistobj.ytela[0]);
			pontosdistobj.xtela.push(pontosdistobj.xtela[0]);
			pontosdistobj.ytela.push(pontosdistobj.ytela[1]);
			var $polygon_area = 0;
			for (var $i=0;$i <= $array_length;$i++)
			{
				$polygon_area += ((pontosdistobj.xtela[$i] * pontosdistobj.ytela[$i+1])-(pontosdistobj.ytela[$i] * pontosdistobj.xtela[$i+1]));
			}
			$polygon_area = Math.abs($polygon_area) / 2;
		}
		else
		{$polygon_area = "Sao necessarios pelo menos tres pontos para o calculo";}
		//g_areapixel precisa estar definida
		return $polygon_area*g_areapixel;
	}
	catch(e){return (0);}
}
/*
Function: calculadistancia

Calcula a distância entre dois pontos.

Parameters:

lga - x inicial.

lta - y inicial

lgb - x final

ltb - y final
*/
function calculadistancia(lga,lta,lgb,ltb) //0ms
{
	//calculo baseado no site http://www.wcrl.ars.usda.gov/cec/java/lat-long.htm
	try
	{
		var er = 6366.707;
		var radlat1 = Math.PI * lta/180;
		var radlat2 = Math.PI * ltb/180;
		var radlong1 = Math.PI * lga/180;
		var radlong2 = Math.PI * lgb/180;
		if (lta > 0) {radlat1=Math.PI/2-radlat1;}
		if (lta < 0) {radlat1=Math.PI/2+radlat1;}
		if (lga < 0) {radlong1=Math.PI*2-radlong1;}
		if (ltb > 0) {radlat2=Math.PI/2-radlat2;}
		if (ltb < 0) {radlat2=Math.PI/2+radlat2;}
		if (lgb < 0) {radlong2=Math.PI*2-radlong2;}
		var x1 = er * Math.cos(radlong1)*Math.sin(radlat1);
		var y1 = er * Math.sin(radlong1)*Math.sin(radlat1);
		var z1 = er * Math.cos(radlat1);
		var x2 = er * Math.cos(radlong2)*Math.sin(radlat2);
		var y2 = er * Math.sin(radlong2)*Math.sin(radlat2);
		var z2 = er * Math.cos(radlat2);
		var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
		//side, side, side, law of cosines and arccos
		var theta = Math.acos((er*er+er*er-d*d)/(2*er*er));
		return theta*er;
	}
	catch(e){return (0);}
}
/*
Function: convdmsddf

Converte dms em dd.

Parameters:

cd - grau.

cm - minuto.

cs - segundo

Returns:

Coordenada em dd.
*/
function convdmsddf(cd,cm,cs)
{
	try
	{
		//converte dms em dd
		var sinal = 'positivo';
		if (cd < 0)
		{
			cd = cd * -1;
			sinal = 'negativo';
		}
		spm = cs / 3600;
		mpg = cm / 60;
		var dd = (cd * 1) + (mpg * 1) + (spm * 1);
		if (sinal == 'negativo')
		{dd = dd * -1;}
		return (dd);
	}
	catch(e){return (0);}
}
/*
Function: calcddf

Converte o x,y de unidades de tela para décimo de grau.

Parameters:

xfign - x em valores de imagem.

yfign - y em coordenadas de imagem.

g_celula - tamanho no terreno do pixel da imagem.

imgext - extensão geográfica do mapa.

Returns:

Coordena em dd.
*/
function calcddf(xfign,yfign,g_celula,imgext)
{
	try
	{
		if (navm)
		{
		 xfign = xfign - 2.2;
		 yfign = yfign - 2.7;
		}
		if (navn)
		{
		 xfign = xfign - 0.12;
		 yfign = yfign - 1.05;
		}
		var nx = g_celula * xfign;
		var ny = g_celula * yfign;
		var amext = imgext.split(" ");
		var longdd = (amext[0] * 1) + nx;
		var latdd = (amext[3] * 1) - ny;
		var res = new Array();
		res[0] = longdd;
		res[1] = latdd;
		return (res);
	}
	catch(e){return(0);}
}
/*
Function: convdmsf

Converte dd em dms.

Parameters:

x - coordenada x.

y - coordenada y.

Returns:

Array com o valor de x [0] e y [1] no formato dd mm ss
*/
function convdmsf(x,y)
{
	var m = 0;
	var s = 0;
	var dx = parseInt(x);
	if (dx > 0)
	{var restod = x - dx;}
	if (dx < 0)
	{restod = (x * -1) - (dx * -1);}
	dx = dx;
	if (restod != 0)
	{
		var mm = restod * 60;
		var m = parseInt(restod * 60);
		var restos = mm - m;
		var mx = m;
		if (restos != 0)
		{
			var s = restos * 60;
			var s = (s+"_").substring(0,5);
			var sx = s;
		}
		else  { s = "00.00" }
	}
	else
	{
		var mx = "00";
		var sx = "00.00";
	}
	if (m.length == 2){m = "0"+m+"";}
	if (s*1 < 10){s = "0"+s;}
	var xv = dx+" "+mx+" "+sx;
	var m = 0;
	var s = 0;
	var dy = parseInt(y);
	if (dy > 0)
	{var restod = y - dy;}
	if (dy < 0)
	{var restod = (y * -1) - (dy * -1);}
	dy = dy;
	if (restod != 0)
	{
		var mm = restod * 60;
		var m = parseInt(restod * 60);
		var restos = mm - m;
		var my = m;
		if (restos != 0)
		{
			var s = restos * 60;
			s = (s+"_").substring(0,5);
			var sy = s;
		}
		else  { var s = "00.00";}
	}
	else
	{
		var my = "00";
		var sy = "00.00";
	}
	if (m.length == 2){m = "0"+m;}
	if (s*1 < 10){s = "0"+s;}
	var yv = dy+" "+my+" "+sy;
	var res = new Array();
	res[0] = xv;
	res[1] = yv;
	if ($i("localizarxy"))
	{
		$i("xg").value = dx;
		$i("xm").value = mx;
		$i("xs").value = sx;
		$i("yg").value = dy;
		$i("ym").value = my;
		$i("ys").value = sy;

	}
	return res;
}
/*
Function: convddtela

Converte coordenadas dd em coordenadas de tela.

Parameters:

vx - coordenada x.

vy - coordenada y.

docmapa - objeto que contém o objeto imagem.

Returns:

Array com o valor de x [0] e y [1]
*/
function convddtela(vx,vy,docmapa)
{
	try
	{
		if(!docmapa)
		{var docmapa = window.document;}
		var dc = docmapa.getElementById("img");
		imgext = objmapa.extent;
		varimgext = imgext.split(" ");
		vx = (varimgext[0] * -1) - (vx * -1);
		vy = (vy * -1) + (varimgext[3] * 1);
		c = objmapa.cellsize * 1;
		xy = new Array();
		xy[0] = (vx  / c) + imagemxi;
		xy[1]  = (vy / c) + imagemyi;
		return (xy);
	}
	catch(e){return(new Array());}
}
/*
Function: posicaomouse

Cria um objeto que guarda a posição do mouse na tela. A posição é medida em relação a janela do navegador.

Methods:

x - coordenada x em valores de tela

y - coordenada y em valores de tela
*/
function posicaomouse()
{
	this.x = 0;
	this.y = 0;
}
/*
Function: posicaocursor

Cria um objeto que guarda a posição do mouse no corpo do mapa. A posição é medida em relação à posição do mapa no navegador.

Methods:

ddx - coordenada x em décimo de grau

ddy - coordenada y em décimo de grau

dmsx - coordenada x em grau, minuto e segundo

dmsy - coordenada y em grau, minuto e segundo

telax - coordenada x em valores de tela

telay - coordenada y em valores de tela

imgx - coordenada x em relação ao mapa

imgy - coordenada y em relação ao mapa

refx - coordenada x em relação ao mapa de referência

refy - coordenada y em relação ao mapa de referência
*/
function posicaocursor()
{
	this.ddx = 0;
	this.ddy = 0;
	this.dmsx = '';
	this.dmsy = '';
	this.telax = 0;
	this.telay = 0;
	this.imgx = 0;
	this.imgy = 0;
	this.refx = 0;
	this.refy = 0;
}
/*
Function: pontosdist

Armazena coordenadas no objeto pontosdist para calculo de distancia

Parameters:

xpt - coordenadas x em dd

ypt - coordenadas y em dd

dist - distância entre os dois últimos pontos

xtela - coordenada x na tela

ytela - coordenada y na tela

ximg - coordenada x na imagem do mapa

yimg - coordenada y na imagem do mapa

linhas - lista de objetos criados pela biblioteca richdraw utilizados no desenho da linha de medição
*/
function pontosdist()
{
	this.xpt = new Array();
	this.ypt = new Array();
	this.dist = new Array();
	this.xtela = new Array();
	this.ytela = new Array();
	this.ximg = new Array();
	this.yimg = new Array();
	this.linhas = new Array();
}
/*
Section: desenho sobre o mapa
*/
/*
Function: desenhoRichdraw

Desenha elementos na tela usando a biblioteca richdraw

Parameters:

tipo - tipo de operação

objeto - objeto gráfico do container richdraw

n - índice do elemento no array pontosdistobj
*/
function desenhoRichdraw(tipo,objeto,n)
{
	if (richdraw)
	{
		if((tipo=="resizeLinha") || (tipo=="resizePoligono") && navn)
		{
			try
			{
				richdraw.renderer.resize(objeto,0,0,objposicaocursor.imgx,objposicaocursor.imgy);
			}
			catch(e){window.status=n+" erro ao movimentar a linha ";}
		}
		if((tipo=="resizeLinha") && navm)
		{
			try
			{
				var r = $i(richdraw.container.id);
				r.removeChild(r.lastChild);
				var dy = objposicaocursor.imgy;
				var dx = objposicaocursor.imgx - (objmapa.w/2);
				richdraw.renderer.create(richdraw.mode, richdraw.fillColor, richdraw.lineColor, richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(objmapa.w/2)-1,pontosdistobj.yimg[n-1]-3,dx,dy-3);
			}
			catch(e){window.status=n+" erro ao movimentar a linha ";}			
		}
		if((tipo=="resizePoligono") && navm)
		{
			try
			{
				var r = $i(richdraw.container.id);
				r.removeChild(r.lastChild);
				r.removeChild(r.lastChild);
				var dy = objposicaocursor.imgy;
				var dx = objposicaocursor.imgx - (objmapa.w/2);
				richdraw.renderer.create(richdraw.mode, richdraw.fillColor, richdraw.lineColor, richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(objmapa.w/2)-1,pontosdistobj.yimg[n-1]-3,dx,dy-3);
				richdraw.renderer.create(richdraw.mode, richdraw.fillColor, richdraw.lineColor, richdraw.lineWidth, (pontosdistobj.ximg[0])-(objmapa.w/2)-1,pontosdistobj.yimg[0]-3,dx,dy-3);
			}
			catch(e){window.status=n+" erro ao movimentar a linha ";}			
		}
		if(tipo=="insereCirculo")
		{
			if (navn)
			{
				var dx = Math.pow(((pontosdistobj.xtela[n])*1) - ((pontosdistobj.xtela[n-1])*1),2);
				var dy = Math.pow(((pontosdistobj.ytela[n])*1) - ((pontosdistobj.ytela[n-1])*1),2);
				var w = Math.sqrt(dx + dy);
				try
				{
					richdraw.renderer.create('circ', '', 'rgb(250,250,250)', richdraw.lineWidth, pontosdistobj.xtela[n-1] - imagemxi,pontosdistobj.ytela[n-1] - imagemyi,w,w);
				}
				catch(e){window.status=n+" erro ao desenhar o raio";}
			}
			else
			{
				var dx = Math.pow(((pontosdistobj.xtela[n])*1) - ((pontosdistobj.xtela[n-1])*1),2);
				var dy = Math.pow(((pontosdistobj.ytela[n])*1) - ((pontosdistobj.ytela[n-1])*1),2);
				var w = Math.sqrt(dx + dy);
				try
				{
					richdraw.renderer.create('circ', '', 'rgb(250,250,250)', richdraw.lineWidth, pontosdistobj.ximg[n-1]-w,pontosdistobj.yimg[n-1]-w,w*2,w*2);
				}
				catch(e){window.status=n+" erro ao desenhar o raio";}
			}
		}
	}
}
/*
Section: outros
*/
/*
Function: inseremarcaf

Insere um ponto no mapa.

Os pontos são inseridos em um contaier de pontos e mostrados temporáriamente como uma imagem.
Utilizado pela função de medição de distâncias.

Parameters:

xi - coordenada x.

yi - coordenada y.

funcaoonclick - funcao que sera executada quando a marca for clicada
*/
function inseremarcaf(xi,yi,funcaoOnclick)
{
	try
	{
		//verifica se existe o container para os pontos
		if (!$i("pontosins") )
		{
			var novoel = document.createElement("div");
			novoel.id = "pontosins";
			var i = novoel.style;
			i.position = "absolute";
			i.top = parseInt($i("img").style.top);
			i.left = parseInt($i("img").style.left);
			document.body.appendChild(novoel);
		}
		var container = $i("pontosins");
		var novoel = document.createElement("div");
		var i = novoel.style;
		i.position = "absolute";
		i.zIndex=2000;
		i.top=(yi - 4)+"px";
		i.left=(xi - 4)+"px";
		i.width="4px";
		i.height="4px";
		var novoimg = document.createElement("img");
		if (arguments.length == 2)
		{funcaoOnclick = "";}
		if (funcaoOnclick != "")
		{novoimg.onclick = funcaoOnclick;}
		novoimg.src=g_locaplic+"/imagens/dot1.gif";
		with (novoimg.style){width="6px";height="6px";zIndex=2000;}
		novoel.appendChild(novoimg);
		container.appendChild(novoel);
	}
	catch(e){alert("Ocorreu um erro. inseremarcaf"+e);}
}
/*
Function: limpacontainerf

Limpa o container de pontos.
*/
function limpacontainerf()
{
	if ($i("pontosins"))
	{$i("pontosins").innerHTML = "";}
	if ($i("mostradistancia"))
	{$i("mostradistancia").style.display="none";}
}
/*
Function: criaboxg

Cria o div boxg utilizado nas operações de navegação, google, etc.

O boxg é utilizado para o desenho de retângulos na tela.
*/
function criaboxg()
{
	if (!$i("boxg"))
	{
		var novoel = document.createElement("div");
		novoel.id = "boxg";
		novoel.style.zIndex=1;
		novoel.innerHTML = '<font face="Arial" size=0></font>';
		novoel.onmouseover = function(){$i("boxg").style.display="none";};
		document.body.appendChild(novoel);
	}
	if (!$i("boxpin"))
	{
		var novoel = document.createElement("img");
		novoel.id = "boxpin";
		novoel.style.zIndex=10000;
		novoel.style.position="absolute";
		novoel.style.width="21px";
		novoel.style.height="25px";
		novoel.src = g_locaplic+'/imagens/marker.png';
		//novoel.innerHTML = '<img src="'+g_locaplic+'/imagens/marker.png" />';
		novoel.onmouseover = function(){$i("boxpin").style.display="none";};
		document.body.appendChild(novoel);
	}
}
//controle dois painéis que podem ser redimensionados
YAHOO.widget.ResizePanel = function(el, userConfig)
{
    if (arguments.length > 0) 
    {YAHOO.widget.ResizePanel.superclass.constructor.call(this, el, userConfig);}
};
YAHOO.widget.ResizePanel.CSS_PANEL_RESIZE = "yui-resizepanel";
YAHOO.widget.ResizePanel.CSS_RESIZE_HANDLE = "resizehandle";
YAHOO.extend
(
	YAHOO.widget.ResizePanel, YAHOO.widget.Panel,
	{
   		init: function(el, userConfig) 
   		{
    		YAHOO.widget.ResizePanel.superclass.init.call(this, el);
       		this.beforeInitEvent.fire(YAHOO.widget.ResizePanel);
       		var Dom = YAHOO.util.Dom,
           		Event = YAHOO.util.Event,
           		oInnerElement = this.innerElement,
           		oResizeHandle = document.createElement("DIV"),
           		sResizeHandleId = this.id + "_resizehandle";
       		oResizeHandle.id = sResizeHandleId;
       		oResizeHandle.className = YAHOO.widget.ResizePanel.CSS_RESIZE_HANDLE;
       		Dom.addClass(oInnerElement, YAHOO.widget.ResizePanel.CSS_PANEL_RESIZE);
       		this.resizeHandle = oResizeHandle;
       		function initResizeFunctionality()
       		{
           		var me = this,
               		oHeader = this.header,
               		oBody = this.body,
               		oFooter = this.footer,
               		nStartWidth,
               		nStartHeight,
               		aStartPos,
               		nBodyBorderTopWidth,
               		nBodyBorderBottomWidth,
               		nBodyTopPadding,
               		nBodyBottomPadding,
               		nBodyOffset;
           		oInnerElement.appendChild(oResizeHandle);
           		this.ddResize = new YAHOO.util.DragDrop(sResizeHandleId, this.id);
           		this.ddResize.setHandleElId(sResizeHandleId);
           		this.ddResize.onMouseDown = function(e)
           		{
               		nStartWidth = oInnerElement.offsetWidth;
               		nStartHeight = oInnerElement.offsetHeight;
               		if (YAHOO.env.ua.ie && document.compatMode == "BackCompat")
               		{nBodyOffset = 0;}
               		else
               		{
                   		nBodyBorderTopWidth = parseInt(Dom.getStyle(oBody, "borderTopWidth"), 10),
                   		nBodyBorderBottomWidth = parseInt(Dom.getStyle(oBody, "borderBottomWidth"), 10),
                   		nBodyTopPadding = parseInt(Dom.getStyle(oBody, "paddingTop"), 10),
                   		nBodyBottomPadding = parseInt(Dom.getStyle(oBody, "paddingBottom"), 10),
                   		nBodyOffset = nBodyBorderTopWidth + nBodyBorderBottomWidth + nBodyTopPadding + nBodyBottomPadding;
               		}
               		me.cfg.setProperty("width", nStartWidth + "px");
               		aStartPos = [Event.getPageX(e), Event.getPageY(e)];
           		};
           		this.ddResize.onDrag = function(e)
           		{
               		var aNewPos = [Event.getPageX(e), Event.getPageY(e)],
                   		nOffsetX = aNewPos[0] - aStartPos[0],
                   		nOffsetY = aNewPos[1] - aStartPos[1],
                   		nNewWidth = Math.max(nStartWidth + nOffsetX, 10),
                   		nNewHeight = Math.max(nStartHeight + nOffsetY, 10),
                   		nBodyHeight = (nNewHeight - (oFooter.offsetHeight + oHeader.offsetHeight + nBodyOffset));
               		me.cfg.setProperty("width", nNewWidth + "px");
               		if (nBodyHeight < 0)
               		{nBodyHeight = 0;}
               		oBody.style.height =  nBodyHeight + "px";
               		if ($i("wdocai"))
               		{$i("wdocai").style.height = nBodyHeight;}
           		};
       		};
       		function onBeforeShow()
       		{
       			initResizeFunctionality.call(this);
       			this.unsubscribe("beforeShow", onBeforeShow);
       		};
       		function onBeforeRender()
       		{
           		if (!this.footer)
           		{this.setFooter("");}
           		if (this.cfg.getProperty("visible"))
           		{initResizeFunctionality.call(this);}
           		else
           		{this.subscribe("beforeShow", onBeforeShow);}
       			this.unsubscribe("beforeRender", onBeforeRender);
       		};
       		this.subscribe("beforeRender", onBeforeRender);
       		if (userConfig)
       		{this.cfg.applyConfig(userConfig, true);}
       		this.initEvent.fire(YAHOO.widget.ResizePanel);
   		},
   		toString: function()
   		{return "ResizePanel " + this.id;}
	}
);
/*
Function: ativaDragDrop

Ativa a funcionalidade de arrastar e soltar para alteração da ordem de desenho dos temas e para excluir um tema do mapa.
*/
function ativaDragDrop()
{
	var Dom = YAHOO.util.Dom;
	var Event = YAHOO.util.Event;
	var DDM = YAHOO.util.DragDropMgr;
	YAHOO.example.DDList = "";
	YAHOO.example.DDApp = 
	{
    	init: function() 
    	{
        	if($i("lixeira"))
        	{new YAHOO.util.DDTarget("lixeira");}
        	var lista = objmapa.temas.split(";");
        	var i = lista.length-1;
        	if (i >= 0)
        	{
	        	do
	        	{
               		var ltema = lista[i].split("*");
               		if($i("arrastar_"+ltema[0]))
               		{new YAHOO.example.DDList("arrastar_"+ltema[0]);}
        		}
        		while(i--)
        	}
    	}
	};
	YAHOO.example.DDList = function(id, sGroup, config) 
	{
	    YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);
	    this.logger = this.logger || YAHOO;
    	var el = this.getDragEl();
    	Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent
	    this.goingUp = false;
   		this.lastY = 0;
	};
	YAHOO.extend
	(
		YAHOO.example.DDList, YAHOO.util.DDProxy, 
		{
	    	startDrag: function(x, y) 
	    	{
        		this.logger.log(this.id + " startDrag");
	        	// make the proxy look like the source element
    	    	var dragEl = this.getDragEl();
        		var clickEl = this.getEl();
        		Dom.setStyle(clickEl, "visibility", "hidden");
	        	dragEl.innerHTML = clickEl.innerHTML;
	        	Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
   		    	Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
    	    	Dom.setStyle(dragEl, "border", "4px solid gray");
    	    	Dom.setStyle(dragEl, "z-index", "5000");
    		},
	    	endDrag: function(e) 
	    	{
	        	var srcEl = this.getEl();
    	    	var proxy = this.getDragEl();
	        	// Show the proxy element and animate it to the src element's location
    	    	Dom.setStyle(proxy, "visibility", "");
        		var a = new YAHOO.util.Motion
        		( 
           			proxy,
            		{ 
                		points:
                		{to: Dom.getXY(srcEl)}
    	        	}, 
        	   	 	0.2, 
            		YAHOO.util.Easing.easeOut
        		);
        		var proxyid = proxy.id;
        		var thisid = this.id;
	        	// Hide the proxy and show the source element when finished with the animation
	        	a.onComplete.subscribe
	        	(
	        		function() 
	        		{
                		Dom.setStyle(proxyid, "visibility", "hidden");
                		Dom.setStyle(thisid, "visibility", "");
            		}
            	);
	        	a.animate();
	        	if ($i("lixeira"))
	        	{$i("lixeira").style.border = "0px solid blue";} 	
    		},
	    	onDragDrop: function(e, id)
	    	{
	        	// If there is one drop interaction, the li was dropped either on the list,
	        	// or it was dropped on the current location of the source element.
	        	if (DDM.interactionInfo.drop.length === 1)
	        	{
	            	// The position of the cursor at the time of the drop (YAHOO.util.Point)
	            	var pt = DDM.interactionInfo.point; 
	            	// The region occupied by the source element at the time of the drop
	            	var region = DDM.interactionInfo.sourceRegion; 
	            	// Check to see if we are over the source element's location.  We will
	            	// append to the bottom of the list once we are sure it was a drop in
	            	// the negative space (the area of the list without any list items)
	            	if (!region.intersect(pt))
	            	{
                		var destEl = Dom.get(id);
                		//var destDD = DDM.getDDById(id);
                		if(DDM.getDDById(id).id != "lixeira")
                		{
                 			if(navn)
							{
								 var brd = document.createElement("br");
	                			 brd.appendChild(this.getEl());
    	            			 destEl.appendChild(brd);
							}
							else
							{destEl.appendChild(this.getEl());}		
                		}
                		//destDD.isEmpty = false;
                		DDM.refreshCache();
                		//exclui tema
                		if(DDM.getDDById(id).id == "lixeira")
                		{
                			var tema = (this.getEl()).id.split("arrastar_")[1];
                			objaguarde.abre("ajaxredesenha",$trad("o1"));
							var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+g_sid;
							cpObj.call(p,"excluiTemas",ajaxredesenha);
							objmapa.temaAtivo = "";
						}
						//muda ordem de desenho do tema
						else
						{
 							var els = $i("mytreeview1").getElementsByTagName("input");
 							var lista = new Array();
 							var tempie = els.length;
 							for (var i=0;i<tempie;i=i+1)
 							{
 								if(els[i].type == "checkbox")
 								{
 									var itema = els[i].value;
 									lista.push(itema);
 								}								
 							}
 							var lista = lista.join(',');
 							if($i("listaTemas")){$i("listaTemas").innerHTML = "";}
							var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+g_sid;
							var cp = new cpaint();
							//cp.set_debug(2)
							cp.set_response_type("JSON");
							cp.call(p,"reordenatemas",ajaxredesenha);
						}
            		}
	        	}
	    	},
	    	onDrag: function(e) 
	    	{
	        	// Keep track of the direction of the drag for use during onDragOver
	        	var y = Event.getPageY(e);
	        	if (y < this.lastY) 
	        	{this.goingUp = true;}
        		else
        		if (y > this.lastY)
        		{this.goingUp = false;}
	        	this.lastY = y;
	    	},
	    	onDragOver: function(e, id) 
	    	{
	        	var srcEl = this.getEl();
	        	var destEl = Dom.get(id);
	        	// We are only concerned with list items, we ignore the dragover
	        	// notifications for the list.
	        	if ($i("lixeira") && id == "lixeira")
	        	{$i("lixeira").style.border = "1px solid red";}
	        	else
	        	{
	        		destEl.style.textDecoration="underline";
	        	}
	    	},
	    	onDragOut: function(e, id)
	    	{
	    		$i(id).style.textDecoration="none";
	    	}
		}
	);
	Event.onDOMReady(YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);
}
/*
Function: removeAcentos

Remove acentos de uma palavra ou frase

Parameters:

palavra -
*/
function removeAcentos(palavra)
{
	var re = /ã|á|à|â/gi;
	palavra = palavra.replace(re,"a");
	var re = /é/gi;
	palavra = palavra.replace(re,"e");
	var re = /í/gi;
	palavra = palavra.replace(re,"i");
	var re = /ó|õ/gi;
	palavra = palavra.replace(re,"o");
	var re = /ç/gi;
	palavra = palavra.replace(re,"c");
	var re = /ú/gi;
	palavra = palavra.replace(re,"u");
	return(palavra);
}
//Mantido aqui apenas para fins de compatibilidade
function borra()
{}
//testa se esse script foi carregado
function testafuncoes()
{}
