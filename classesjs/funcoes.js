/*
Title: funcoes.js

Funções de uso geral para processamento de dados

File: i3geo/classesjs/funcoes.js

About: Licenciamento

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
//
//verifica se $i existe, se não cria.
//isso é necessário nos casos em que funcoes.js é utilizado separadamente
//
try
{
	$i("i3geo");
}
catch(e)
{
	$i = function(i)
	{return document.getElementById(i);};
}
/*
Section: interface
*/
/*
Function: criaContainerRichdraw

Cria os elementos 'dom' necessários ao uso das funções de desenho sobre o mapa.

As ferramentas de cálculo de distâncias e áreas utilizam esse container.

Richdraw é uma biblioteca utilizada pelo i3geo para abstrair as diferenças entre as linguagens svg e vml.

Essa abstração é necessária devido às diferenças entre os navegadores.
*/
function criaContainerRichdraw()
{
	try
	{
		//
		//cria o container para uso da função de desenho usando
		//svg ou vml
		//esse container é sobreposto exatamente sobre o mapa
		//O id do containner é divGeometriasTemp
		//
		if (!$i("divGeometriasTemp"))
		{
			//
			//pega a posição da imagem do mapa para posicionar corretamente o container
			//
			var pos = [0,0];
			if($i("img"))
			var pos = i3GEO.util.pegaPosicaoObjeto($i("img"));
			//
			//cria o container
			//
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
			ne.top=pos[1];
			ne.left=pos[0];
			document.body.appendChild(novoel);
		}
		//
		//como o container já poderia ter sido criado antes é necessário esvaziá-lo
		//
		var divgeo = $i("divGeometriasTemp");
		divgeo.innerHTML = "";
		var renderer;
		//
		//cria o objeto renderer conforme o browser em uso
		//esse objeto será utilizado nas funções de desenho
		//mais detalhes, veja em pacotes/richdraw
		//Conforme a resposta do navegador, utiliza-se a criação VML ou SVG
		//
		try
		{
			renderer = new VMLRenderer();
			richdraw = new RichDrawEditor(divgeo, renderer);
		}
		catch(e)
		{
			renderer = new SVGRenderer();
			richdraw = new RichDrawEditor(divgeo, renderer);
		}
		//
		//definição dos símbolos default para os elementos gráficos
		//
		richdraw.editCommand('fillcolor', 'red');
		richdraw.editCommand('linecolor', 'gray');
		richdraw.editCommand('linewidth', '1px');
		richdraw.editCommand('mode', 'line');
		divgeo.style.display="block";
		//
		//após o container ser criado, é necessário que as funções
		//de clique sobre o mapa sejam ativadas
		//para funcionarem sobre o container
		//
		ativaClicks(divgeo);
		
	}
	catch(e){alert("Erro ao tentar criar container richdraw");}
}
/**
Function: mudaiconf

Muda as bordas dos ícones de ferramentas, passando todos para normal.
Aplica uma borda sobre um ícone específico e executa outras operações.

Utilizado para indicar que uma determinada opção está em uso.

Como esta função é executada quando um ícone é clicado, algumas operações são definidas aqui
como por exemplo, definir o ícone que segue o mouse. 

Parameters:

i - id do ícone que receberá a borda.
*/
function mudaiconf(i)
{
	try
	{
		YAHOO.log("mudaiconf", "i3geo");
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
		g_tipoacao = i;
		if ($i("divGeometriasTemp"))
		{$i("divGeometriasTemp").style.display = "none";}
		YAHOO.log("Fim mudaiconf", "i3geo");
	}
	catch(e){alert("Ocorreu um erro. mudaiconf"+e);}
}
/*
Function: ativaClicks

Ativa as operações de clique sobre o mapa

Define o que será executado quando o mouse é clicado ou movido sobre o mapa.

Além das funções padrão,são ativadas aquelas definidas nas variáveis de configuração (veja configura.js)

Parameters:

docMapa - objeto que será alvo da ativação dos cliques
*/
function ativaClicks(docMapa)
{
	docMapa.onmouseover = function()
	{
		this.onmousemove=function(exy)
		{
			try
			{
				try
				{clearTimeout(i3GEO.eventos.TIMERPARADO);}
				catch(e){var a = e;}
				i3GEO.eventos.TIMERPARADO = setTimeout('i3GEO.eventos.mouseParado()',i3GEO.configura.tempoMouseParado);
				capturaposicao(exy);
				if (g_destaca != "")
				{$i("div_d").style.clip = 'rect('+(objposicaocursor.imgy - destacaTamanho)+" "+(objposicaocursor.imgx - 10)+" "+(objposicaocursor.imgy - 10)+" "+(objposicaocursor.imgx - destacaTamanho)+')';}
			}
			catch(e){var e = "";}
			try
			{i3GEO.eventos.mousemoveMapa();}
			catch(e){var e = "";}
		};
	};
	docMapa.onmouseout = function()
	{
		try
		{
			objmapa.parado="parar";
			mostradicasf(this,'');
		}
		catch(e){var e = "";}
	};
	docMapa.onmousedown = function(exy)
	{
		try
		{
			capturaposicao(exy);
			//verifica se esta na opÃ¯Â¿Â½o de zoom box
			if ((g_tipoacao == "zoomli") || (g_tipoacao == "selecaobox"))
			{
				if($i("box1"))
				{
					var i = $i("box1").style;
					i.width=0;
					i.height=0;
					i.visibility="visible";
					i.display="none";
					i.left = objposicaocursor.telax + g_postpx;
					i.top = objposicaocursor.telay + g_postpx;
				}
				boxxini = objposicaocursor.telax;
				boxyini = objposicaocursor.telay;
				tamanhox = 0;
				tamanhoy = 0;
			}
			i3GEO.eventos.mousedownMapa();
		}
		catch(e){var e = "";}
	};
	docMapa.onclick = function()
	{
		try
		{i3GEO.eventos.mousecliqueMapa();}
		catch(e){var e = "";}
	};
	docMapa.onmouseup = function()
	{
		try
		{
			if (g_tipoacao == "zoomli"){zoomboxf("termina");}
			if (g_tipoacao == "selecaobox"){zoomboxf("termina");}
			i3GEO.eventos.mouseupMapa();
		}
		catch(e){var e = "";}
	};
}
/*
Function: movelentef

Move a imagem na lente de aumento conforme o movimento do mouse sobre o mapa.

A lente de aumento é uma ferramenta do i3geo.

Esta função é executada sempre que o mouse é movido sobre o mapa e se o elemento "lente" estiver visível.
*/
function movelentef()
{
	try
	{
		if ($i("lente"))
		{
			if ($i("lente").style.visibility=="visible")
			{
				var pos = i3GEO.util.pegaPosicaoObjeto($i("img"));
				var esq = (objposicaocursor.telax - pos[0]) * 2.25;
				var topo = (objposicaocursor.telay - pos[1]) * 2.25;
				var clipt = "rect("+ (topo - 40) + " " + (esq + 40) + " " + (topo + 40) + " " + (esq - 40) +")";
				var i = $i("lente").style;
				i.clip = clipt;
				eval("i." + g_tipotop + "= (pos[1] - (topo - 40)) + g_postpx");
				eval("i." + g_tipoleft +  "= (pos[0] - (esq - 40)) + g_postpx");
			}
		}
	}
	catch(e){var e = "";}
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
function zoomboxf(tipo)
{
	var pos = i3GEO.util.pegaPosicaoObjeto($i("img"));
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
			{bxs.width = ppx - boxxini + "px";}
			if (py > boxyini)
			{bxs.height = py - boxyini + "px";}
			if (ppx < boxxini)
			{bxs.left = ppx + "px";bxs.width = boxxini - ppx + "px";}
			if (py < boxyini)
			{bxs.top = py + "px";bxs.height = boxyini - py + "px";}
		}
		break;
		case "termina":
		// finaliza o retï¿½gulo de zoom
		md = 1;
		eval ('pix = parseInt(document.getElementById("box1").style.' + g_tipoleft + ")");
		eval ('piy = parseInt(document.getElementById("box1").style.' + g_tipotop + ")");
		xfig0 = parseInt(bxs.width) - pos[0];
		yfig0 = parseInt(bxs.height) - pos[1];
		xfig = pix + (parseInt(bxs.width)) - pos[0];
		yfig = piy + (parseInt(bxs.height)) - pos[1];
		amext = objmapa.extent.split(" ");
		dx = ((amext[0] * -1) - (amext[2] * -1)) / (tamanhox - 1);
		dy = ((amext[1] * 1) - (amext[3] * 1)) / (tamanhoy - 1);
		if (dy < 0) dy=dy * -1;
		nx = g_celula * xfig;
		ny = g_celula * yfig;
		x1 = (amext[0] * 1) + nx;
		y1 = (amext[3] * 1) - ny;
		xfig = pix - pos[0];
		yfig = piy - pos[1];
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
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,g_tipoimagem,v);
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
						i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
						var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+v+"&g_sid="+i3GEO.configura.sid+"&tipo="+tipo+"&tema="+objmapa.temaAtivo;
						cpObj.call(p,"selecaobox",ajaxredesenha);
					}
				}
				catch(e){var e = "";}
			}
		}		
		bxs.visibility="hidden";
		bxs.width = 0;
		bxs.height = 0;
		break;
	}
}

/*
Function: ativaEntorno

Ativa ou desativa a carga do entorno.

Com o entorno ativo, são produzidas imagens no entorno do mapa, no estilo Google.
*/
function ativaEntorno()
{
	if(objmapa.mapfile == "")
	{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
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

Gera as urls que farão parte dos divs de desenho do entorno do mapa.
Essas URLs utilizam o mapserver no modo CGI
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
	u += "&mode=map&imgext="+objmapa.extent+"&mapsize="+nnx+" "+oy;
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

Ajusta o tamanho do mapa e das imagens do entorno, quando a opção de desenho do entorno estiver ativa.

Os valores que definem o tamanho do mapa são obtidos do objeto objmapa (métodos w e h)
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
Section: menu de temas e outras listagens
*/
/*
Function: i3geo_comboGruposMenu

Busca a lista de grupos existentes no menu de temas do i3geo e monta um combo com o resultado.

Ao escolher uma opção do combo, a função de retorno receberá como parâmetro o id do grupo.

Parameters:

funcaoOnchange - nome da funcao que será executada quando o usuário escolhe um grupo

idDestino - id do elemento HTML que receberá o combo

idCombo - id do combo que será criado

largura - largura em pixels do combo

altura - altura do combo em linhas
*/
function i3geo_comboGruposMenu(funcaoOnchange,idDestino,idCombo,largura,altura)
{
	var combo = function (retorno)
	{
		obGrupos = retorno.data;
		var ins = "<select id='"+idCombo+"' SIZE="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"(this.value)' ><option value='' >Escolha um grupo:</option>";
		for (ig=0;ig<obGrupos.grupos.length; ig++)
		{
			if(obGrupos.grupos[ig].nome)
			ins += "<option value="+ig+" >"+obGrupos.grupos[ig].nome+"</option>";
		}
		$i(idDestino).innerHTML = ins+"</select>";
	};
	var p = "classesphp/mapa_controle.php?funcao=pegalistadegrupos&map_file=''&listasgrupos=nao";
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"pegalistadegrupos",combo);
}
/*
Function: i3geo_comboSubGruposMenu

Monta um combo com a lista de subgrupos de um grupo do menu de temas do i3geo.

Ao escolher um subgrupo, a função de retorno receberá o id do grupo e o id do subgrupo.

Parameters:

funcaoOnchange - nome da funcao que será executada quando o usuário escolhe um grupo

idDestino - id do elemento HTML que receberá o combo

idCombo - id do combo que será criado

idGrupo - identificador do grupo que será pesquisado

largura - largura em pixels do combo

altura - altura do combo em linhas
*/
function i3geo_comboSubGruposMenu(funcaoOnchange,idDestino,idCombo,idGrupo,largura,altura)
{
	if(idGrupo != "")
	{
		var combo = function(retorno)
		{
			var ins = "<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"("+idGrupo+",this.value)' ><option value='' >Escolha um sub-grupo:</option>";
			if (retorno.data.subgrupo)
			{
				var sg = retorno.data.subgrupo;
				for (ig=0;ig<sg.length; ig++)
				{	
					ins += "<option value="+ig+" >"+sg[ig].nome+"</option>";
				}
			}
			$i(idDestino).innerHTML = ins+"</select>";
		};
		var p = "classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&map_file=''&grupo="+idGrupo;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"pegalistadeSubgrupos",combo);
	}
}
/*
Function: i3geo_comboTemasMenu

Monta um combo com a lista de subgrupos de um grupo do menu de temas do i3geo.

Ao escolher um subgrupo, a função de retorno receberá o id do grupo e o id do subgrupo.

Parameters:

funcaoOnchange - nome da funcao que será executada quando o usuário escolhe um grupo

idDestino - id do elemento HTML que receberá o combo

idCombo - id do combo que será criado

idGrupo - identificador do grupo que será pesquisado

idSubGrupo - id do subgrupo

largura - largura em pixels do combo

altura - altura do combo em linhas
*/
function i3geo_comboTemasMenu(funcaoOnchange,idDestino,idCombo,idGrupo,idSubGrupo,largura,altura)
{
	var combo = function(retorno)
	{
		var ins = "<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"("+idGrupo+","+idSubGrupo+",this.value)' ><option value='' >Escolha um tema:</option>";
		if (retorno.data.temas[i])
		{
			var sg = retorno.data.temas;
			for (ig=0;ig<sg.length; ig++)
			{	
				ins += "<option value="+sg[ig].tid+" >"+sg[ig].nome+"</option>";
			}
		}
		$i(idDestino).innerHTML = ins+"</select>";
	};
	var p = "classesphp/mapa_controle.php?funcao=pegalistadetemas&map_file=''&grupo="+idGrupo+"&subgrupo="+idSubGrupo;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"pegalistadetemas",combo);
}
/*
Section: redesenho do mapa
*/
/*
Function: remapaf

Prepara o redesenho do mapa de acordo com o que esta visivel ou nao.

Chamado por algumas funções que necessitam refazer o desenho do mapa.

Verifica na lista de temas já adicionados, os temas que estão ligados e desligados,
Chama a função que verifica na lista de temas adicionais.
*/
function remapaf()
{
	//
	//zera o contador de tempo
	//
	YAHOO.log("remapaf", "i3geo");
	clearTimeout(objmapa.tempo);
	objmapa.tempo = "";
	objmapa.temaAtivo = "";
	if ($i(objmapa.guiaTemas+"obj"))
	{
		//
		//se g_operacao = 'legenda' significa que o usuário clicou em um tema na guia legenda
		//nesse caso, a busca dos temas que devem ser ligados e desligados deve ser feita no id='legenda'
		//
		if(g_operacao == "legenda")
		{var iguias = $i("legenda").getElementsByTagName("input");}
		else
		{var iguias = $i(objmapa.guiaTemas+"obj").getElementsByTagName("input");}
		var tsl = new Array();
		var tsd = new Array();
		var i = iguias.length-1;
		if (i >= 0)
		{
			do
			{
				if (iguias[i].type == "checkbox")
				{
					if(iguias[i].name == "layer")
					{
						if (iguias[i].checked == false)
						{tsd.push(iguias[i].value);}
						if (iguias[i].checked == true)
						{tsl.push(iguias[i].value);}
					}
				}
			}
			while(i--)
		}
		var remapaAdicNovos = function (retorno)
		{
			if ($i("buscatema"))
			{
				var g = $i(objmapa.guiaMenu+"obj");
				if($i("arvoreAdicionaTema"))
				{var g = $i("arvoreAdicionaTema");}
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
					i3GEO.janela.fechaAguarde("remapa");
					i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
					var temp = function(retorno)
					{
						i3GEO.janela.fechaAguarde("ajaxredesenha");
						if(retorno.data.erro)
						{
							alert(retorno.data.erro);
							return;
						}
						ajaxredesenha("");					
					};
					var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+(ta.toString())+"&g_sid="+i3GEO.configura.sid;
					cpObj.call(p,"adicionaTema",temp);
				}
				else
				{
					i3GEO.janela.fechaAguarde("remapa");
					i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
					ajaxredesenha("");
				}
			}
			else
			{
				i3GEO.janela.fechaAguarde("remapa");
				i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
				ajaxredesenha("");
			}
		};
		if ((tsd.length > 0) || (tsl.length > 0))
		{
			i3GEO.janela.abreAguarde("remapa",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+(tsd.toString())+"&ligar="+(tsl.toString())+"&g_sid="+i3GEO.configura.sid;
			cpObj.call(p,"ligaDesligaTemas",remapaAdicNovos);
		}
		else{remapaAdicNovos();}
		i3GEO.janela.fechaAguarde("remapa");
	}
	else
	{eval(remapaAdicNovos);}
	YAHOO.log("Fim remapaf", "i3geo");
}
/*
Section: eventos
*/

/*
Function: calcposf

Calcula a posição do corpo do mapa e posiciona-o corretamente na tela.
*/
function calcposf()
{
	try
	{
		YAHOO.log("calcposf", "i3geo");
		imagemxi = 0;
		imagemyi = 0;
		imagemxref = 0;
		imagemyref = 0;
		if(!$i("i3geo")){return;}
		if ($i("i3geo").style.left){imagemxi += parseInt($i("i3geo").style.left);}
		if ($i("i3geo").style.top){imagemyi += parseInt($i("i3geo").style.top);}	
		var dc = $i("i3geo");
		if ($i("contemImg"))
		{var dc = $i("contemImg");}
		else
		{var dc = $i("img");}
		if ($i("openlayers"))
		{var dc = $i("openlayers");}
		if ($i("flamingo"))
		{var dc = $i("flamingo");}
		while ((dc.offsetParent) && (dc.offsetParent.id != "i3geo"))
		{
			dc = dc.offsetParent;
			imagemxi = imagemxi + dc.offsetLeft;
			imagemyi = imagemyi + dc.offsetTop;
		}
		if ($i("corpoMapa"))
		{
			$i("corpoMapa").style.position="absolute";
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
		YAHOO.log("Fim calcposf", "i3geo");
	}
	catch(e){alert("Ocorreu um erro. calcposf"+e);}
}
/*
Function: capturaposicao

Captura a posição do mouse em função do evento onmousemove sobre o corpo do mapa ou sobre o mapa de referência.

Atualiza o objeto objposicaocursor.
A função de mostrar etiquetas é definida como "" quando o mouse é movimentado.

Parameters:

exy - objeto evento.
*/
function capturaposicao(e)
{
	if (!e) var e = window.event;
	//
	//verifica sob qual objeto o mouse está se movendo
	//
	if (e.target)
	{var targ = e.target;}
	else if (e.srcElement) var targ = e.srcElement;
	if(targ.id == "" && $i("img"))
	{var targ = $i("img");}
	//
	//se estiver no modo pan, o movimento deve ser obtido do elemento
	//onde está a imagem do mapa e não diretamente sobre o elemento 'img'
	//se não for feito assim, o deslocamento do mapa não é capturado
	//
	if (g_panM == "sim")
	{var pos = i3GEO.util.pegaPosicaoObjeto(targ.parentNode);}
	else
	{var pos = i3GEO.util.pegaPosicaoObjeto(targ);}
	if((g_entorno == "sim") && (g_panM == "sim"))
	{
		pos[0] = pos[0] - objmapa.w;
		pos[1] = pos[1] - objmapa.h;
	}
	//
	//pega a posicao correta do mouse
	//
	var mousex = 0;
	var mousey = 0;
	if (e.pageX || e.pageY) 	{
		mousex = e.pageX;
		mousey = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		mousex = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		mousey = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	//
	//faz os cálculos de posicionamento
	//fig e reffig são a mesma coisa por enquanto
	//
	var xfig = mousex - pos[0];
	var yfig = mousey - pos[1];
	var xreffig = xfig;
	var yreffig = yfig;
	var xtela = mousex;
	var ytela = mousey;
	//
	//celula e extent são necessários para se fazer a
	//conversão de coordenadas de tela para coordenadas geográficas
	//esses valores são obtidos das funções ajax que redesenham ou inicializam o mapa
	// 
	var c = g_celula;
	var ex = objmapa.extent;
	try{
		if(targ.id == "imagemReferencia"){
			var c = g_celularef;
			var ex = objmapa.extentref;
			var r = $i("i3geo_rosa");
			if(r)
			r.style.display = "none"
		}
	}
	catch(e){g_celularef = 0;}
	var teladd = i3GEO.calculo.tela2dd(xfig,yfig,c,ex);
	var teladms = i3GEO.calculo.dd2dms(teladd[0],teladd[1]);
	objposicaocursor.ddx = teladd[0];
	objposicaocursor.ddy = teladd[1];
	objposicaocursor.dmsx = teladms[0];
	objposicaocursor.dmsy = teladms[1];
	objposicaocursor.telax = xtela;
	objposicaocursor.telay = ytela;
	objposicaocursor.imgx = xfig;
	objposicaocursor.imgy = yfig;
	objposicaocursor.refx = xreffig;
	objposicaocursor.refy = yreffig;
	ajaxTip = "";
}
/*
Section: calculos
*/
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

Cria o objeto que irá armazenaa as coordenadas para calculo de distancia

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
	if (richdraw && $i("img"))
	{
		var pos = i3GEO.util.pegaPosicaoObjeto($i("img"));
		//
		//faz o reposicionamento de linhas quando o mouse é movido e a linha está ativa
		//
		if((tipo=="resizeLinha") || (tipo=="resizePoligono") && navn)
		{
			try
			{richdraw.renderer.resize(objeto,0,0,objposicaocursor.imgx,objposicaocursor.imgy);}
			catch(e){window.status=n+" erro ao movimentar a linha ";}
		}
		if((tipo=="resizeLinha") && navm)
		{
			try
			{
				//
				//no caso do ie, a linha tem de ser removida e desenhada novamente
				//
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
					richdraw.renderer.create('circ', '', 'rgb(250,250,250)', richdraw.lineWidth, pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],w,w);
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
Function: incluir

Inclui um arquivo shapefile no mapa atual como uma nova camada

Parameters:

path - caminho completo do shapefile
*/
function incluir(path)
{
	i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
	var temp = path.split(".");
	if ((temp[1] == "SHP") || (temp[1] == "shp"))
	{var f = "adicionaTemaSHP";}
	else
	{var f = "adicionaTemaIMG";}
	var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao="+f+"&arq="+path;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,f,ajaxredesenha);
}
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
		novoimg.src=i3GEO.configura.locaplic+"/imagens/dot1.gif";
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
Function: recuperamapa

Tenta recuperar o último mapa, caso tenha ocorrido algum erro.
*/
function recuperamapa()
{
	g_recupera = 1;
	var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"recuperamapa",remapaf);
}
//testa se esse script foi carregado
function testafuncoes()
{}
