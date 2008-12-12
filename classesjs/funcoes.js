/*
Title: funcoes.js

Funções de uso geral para processamento de dados

File: i3geo/classesjs/funcoes.js

About: Licençamento

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
Function: $im

Retorna o caminho correto de uma imagem incluindo o endereço da aplicação e do visual em uso.

Exemplo: $im("imagem.png")

Parâmetros:

g - nome da imagem

Retorno:

string - caminho para a imagem
*/
$im = function(g)
{return g_locaplic+"/imagens/visual/"+g_visual+"/"+g;};
/*
Function $inputText

Cria um elemento html do tipo input text com formatação especial.

Parameters:

idPai - id do elemento pai do input

larguraIdPai - largura em pixel

idInput - id do objeto input

titulo - texto que vai no title

digitos - numero de dígitos do input

valor - valor do input
*/
$inputText = function (idPai,larguraIdPai,idInput,titulo,digitos,valor)
{
	if(idPai != "")
	{
		if(larguraIdPai != "")
		{$i(idPai).style.width=larguraIdPai+"px";}
		$i(idPai).style.padding="3";
		$i(idPai).style.textAlign="center";
		$i(idPai).onmouseover = function()
		{this.className = "digitarMouseover";};
		$i(idPai).onmouseout = function()
		{this.className = "";};	
	}
	var i = "<input onmouseover='javascript:this.className=\"digitarOver\";' onmouseout='javascript:this.className=\"digitar\";' onclick='javascript:this.className=\"digitarMouseclick\";' id="+idInput+" title='"+titulo+"' type=text size="+digitos+" class=digitar value='"+valor+"' />";
	return i;
};
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
	if (document.getElementById(id).style)
	{
		if (document.getElementById(id).style.pixelTop)
		{document.getElementById(id).style.pixelTop=valor;}
		else
		{document.getElementById(id).style.top=valor+"px";}
	}
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
	if (document.getElementById(id).style)
	{
		if (document.getElementById(id).style.pixelLeft)
		{document.getElementById(id).style.pixelLeft=valor;}
		else
		{document.getElementById(id).style.left=valor+"px";}
	}
};
/*
Function: trataErro

Fecha o objeto aguarde quando ocorre um erro.
*/
function trataErro()
{
	i3GEO.janela.fechaAguarde("ajaxdestaca");
	i3GEO.janela.fechaAguarde("ajaxabrelente");
	i3GEO.janela.fechaAguarde("ajaxiniciaParametros");
	i3GEO.janela.fechaAguarde("ajaxredesenha");
	i3GEO.janela.fechaAguarde("ajaxCorpoMapaEntorno");
	i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
	i3GEO.janela.fechaAguarde("ajaxLegenda");
	i3GEO.janela.fechaAguarde("ajaxReferencia");
	i3GEO.janela.fechaAguarde("ajaxEscalaGrafica");
	i3GEO.janela.fechaAguarde("montaMapa");
	i3GEO.janela.fechaAguarde("aguardedoc");
	i3GEO.janela.fechaAguarde("ajaxCorpoMapa1");
}
/*
Section: interface
*/
/*
Function: sobeferramentas

Sobe a pilha de ícones na barra de ferramentas.

Utilizado na barra de ferramentas 2 quando o usuário clica no ícone para subir a lista de ícones.
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
/*
Function: desceferramentas

Desce a pilha de ícones na barra de ferramentas.

Utilizado na barra de ferramentas 2 quando o usuário clica no ícone para descer a lista de ícones.
*/
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
			var pos = pegaPosicaoObjeto($i("img"));
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
/*
Function: mudaVisual

Muda o visual do mapa atual (ícones).

Busca as imagens existentes na interface aberta e substituí pelas imagens existentes no diretório
correspondente ao visual selecionado.

As imagens existentes no mapa são comparadas com as existentes no diretório i3geo/imagens/visual/<visual> 
caso ocorra correspondência são então substituídas.

A lista de visuais disponíveis é obtida na inicialização do i3geo e corresponde à lista de diretórios existentes em i3geo/imagens/visual

Parameters:

visual - nome do novo visual. Obtido na inicialização do I3Geo e armazenado na variável objmapa.listavisual
*/
function mudaVisual(visual)
{
	//
	//refaz o layout conforme os parâmetros obtidos da chamada ajax
	//
	var monta = function(retorno)
	{
		try
		{
			i3GEO.janela.fechaAguarde("ajaxredesenha");
			//
			//pega todas as imagens da interface
			//
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
		catch(e){alert("Ocorreu um erro. mudaVisual"+e);i3GEO.janela.fechaAguarde("ajaxredesenha");}
	};
	//
	//pega a lista de imagens no diretório do i3geo correspondente ao visual selecionado
	//
	i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=listaArquivos&g_sid="+g_sid+"&diretorio=imagens/visual/"+visual;
	cpObj.call(p,"mudaQS",monta);
}
/*
Function: docaguias

Coloca as guias de navegação em uma janela interna do mapa e altera o tamanho do mapa para ajustá-lo à nova situação.

O conteúdo da nova janela é aquele que estiver dentro de um DIV com id= "contemFerramentas"
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
		var temp = function()
		{
			//carrega janela
			var novoel = document.createElement("div");
			novoel.id = "janelaguias";
			novoel.style.display="block";
			var temp = '<div class="hd">Guias</div>';
			temp += '<div class="bd" id="conteudojanelaguias"></div>';
			novoel.innerHTML = temp;
			if($i("i3geo"))
			{$i("i3geo").appendChild(novoel);}
			else
			{document.body.appendChild(novoel);}
			$i("conteudojanelaguias").innerHTML = novono;
			YAHOO.namespace("janelaguias.xp");
			YAHOO.janelaguias.xp.panel = new YAHOO.widget.Panel("janelaguias", {width:"268px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
			YAHOO.janelaguias.xp.panel.render();
			if($i(objmapa.guiaMenu+"obj"))
			{
				$i(objmapa.guiaMenu+"obj").innerHTML = "";
			}
			//ativaGuias();
			if($i("listaTemas"))
			{$i("listaTemas").innerHTML = "";}
			if($i("listaPropriedades"))
			{$i("listaPropriedades").innerHTML = "";objmapa.ativaListaPropriedades("listaPropriedades");}
			remapaf();
		};	
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+a+"&largura="+l+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaQS",temp);
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

Quando o usuário clica em uma guia, todas as guias são escondidas e a guia clicada é ativada.

Algumas guias só são preenchidas quando o usuário clicar nelas pela primeira vez.

O preenchimento sob demanda dessas guias torna necessário a definição da função que será executada quando o clique ocorrer.

Essas funções são definidas por default nas guias principais.

As guias principais são definidas nos objetos

objmapa.guiaTemas

objmapa.guiaMenu

objmapa.guiaLegenda

objmapa.guiaListaMapas

*/
function ativaGuias()
{
	//ajusta as guias da versão antiga do YUI para a nova
	//
	//pega o elemento onde as guias serão colocadas
	//
	for(var g=0;g<12;g++)
	{
		if ($i("guia"+g))
		var gpai = $i("guia"+g).parentNode;
	}
	//
	//monta as guias
	//
	if(gpai)
	{
		gpai.id = "guiasYUI";
		gpai.className = "yui-navset";
		var ins = '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		//
		//define os títulos das guias padrão
		//
		if($i(objmapa.guiaTemas))
		{$i(objmapa.guiaTemas).innerHTML = $trad("g1");}
		if($i(objmapa.guiaMenu))
		{$i(objmapa.guiaMenu).innerHTML = $trad("g2");}
		if($i(objmapa.guiaLegenda))
		{$i(objmapa.guiaLegenda).innerHTML = $trad("g3");}
		if($i(objmapa.guiaListaMapas))
		{$i(objmapa.guiaListaMapas).innerHTML = $trad("g4");}
		//
		//
		for(var g=0;g<12;g++)
		{
			if ($i("guia"+g))
			{
				//
				//pega os títulos das guias, inclusive as que não são padrão
				//
				var tituloguia = $i("guia"+g).innerHTML;
				//
				//remove os espaços em branco 
				//necessário para manter compatibilidade com versões antigas do i3geo
				//
				var re = new RegExp("&nbsp;", "g");
				var tituloguia = tituloguia.replace(re,'');
				//
				//monta o título das guias
				//
				ins += '<li><a href="#"><em><div id="guia'+g+'" >'+tituloguia+'</div></em></a></li>';
			}
		}
		ins += "</ul>";
		//
		//insere as guias em gpai
		//
		gpai.innerHTML = ins;
		for(var g=0;g<12;g++)
		{
			if ($i("guia"+g))
			{
				eval('$i("guia'+g+'").onclick = function(){g_guiaativa = "guia'+g+'";mostraguiaf('+g+');}');
				$i("guia"+g).onmouseover = function()
				{
					var bcg = this.parentNode.parentNode.style;
					var cor = bcg.background.split(" ")[0];
					if(cor != "white")
					bcg.background = "#bfdaff";
				};
				$i("guia"+g).onmouseout = function()
				{
					var bcg = this.parentNode.parentNode.style;
					var cor = bcg.background.split(" ")[0];
					if(cor != "white")
					bcg.background = "transparent";
				};
				if($i("guia"+g+"obj"))
				{
					$i("guia"+g+"obj").style.overflow="auto";
					$i("guia"+g+"obj").style.height = objmapa.h;
				}
			}
		}
	}
	//
	//define a função que será executada quando o usuário clica em uma guia padrão
	//
	if ($i(objmapa.guiaTemas))
	{
		$i(objmapa.guiaTemas).onclick = function()
		{
			g_guiaativa = objmapa.guiaTemas;mostraguiaf(1);
		};
	}
	if ($i(objmapa.guiaMenu))
	{
		$i(objmapa.guiaMenu).onclick = function()
		{
			g_guiaativa = objmapa.guiaMenu;
			mostraguiaf(2);
			//pega a lista de árvores que devem ser montadas
			//é executado apenas se não existir o id=arvoreAdicionaTema
			//caso contrário, a árvore é montada na inicialização do i3geo
			if(!$i("arvoreAdicionaTema"))
			{var ondeArvore = objmapa.guiaMenu+"obj";}
			else
			{var ondeArvore = "arvoreAdicionaTema";}
			//
			//para efeitos de compatibilidade
			//
			if(document.getElementById("outrasOpcoesAdiciona"))
			{
				i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde = "outrasOpcoesAdiciona";
				i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore = false;
			}
			//
			//cria a árvore
			//
			i3GEO.arvoreDeTemas.cria(g_sid,g_locaplic,ondeArvore);
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

A ativação consiste em tornar visível os elementos correspondentes a uma determinada guia.
Esses elementos devem estar contidos em um DIV cujo id deve ser composto pela palavra "guia" seguida do número da
guia e a palavra "obj", por exemplo, guia9obj.

Parâmetros:

guia - número da guia que será ativada.
*/
function mostraguiaf(guia)
{
	if ($i("guia"+guia))
	{
		var fs=[1,2,3,4,5,6,7,8,9,10,11,12];
		for (var j=0;j<10; j++)
		{
			if ($i("guia"+fs[j]))
			{
				jj = fs[j];
				if ($i("guia"+jj+"obj"))
				{$i("guia"+jj+"obj").style.display="none";}
				$i("guia"+fs[j]).parentNode.parentNode.style.background="transparent";
			}
		}
		if ($i("guia"+guia+"obj"))
		{
			$i("guia"+guia+"obj").style.display="block";
		}
		else
		{alert("O objeto guia"+guia+"obj nao existe.");}
		$i("guia"+guia).parentNode.parentNode.style.background="white";
	}
}
/**
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
			}
			if ($i("tip"))
			{$i("tip").style.display="none";}
		}
		catch(e){var e = "";}
		this.onmousemove=function(exy)
		{
			try
			{
				if ($i("mostraUTM")){$i("mostraUTM").style.display="none";}
				if ($i("tip"))
				{$i("tip").style.display="none";}
				try
				{clearTimeout(objmapa.tempoParado);}
				catch(e){var a = e;}
				objmapa.tempoParado = setTimeout('objmapa.verificaMouseParado()',g_tempotip);
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
	docMapa.onmousedown = function(exy)
	{
		try
		{
			capturaposicao(exy);
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
			//
			//realiza o pan (deslocamento) do mapa em função de dois pontos
			//
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
					i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
					var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pan&x="+objposicaocursor.imgx+"&y="+objposicaocursor.imgy+"&g_sid="+g_sid;
					cpObj.call(p,"pan",ajaxredesenha);
					return;
				}
				var nex = novoxi+" "+novoyi+" "+novoxf+" "+novoyf;
				i3GEO.navega.zoomExt(g_locaplic,g_sid,g_tipoimagem,nex);
			}
		}
		catch(e){var e = "";}
	};
}
/*
Section: navegação
*/
/*
Function: zoomAnterior

Retorna ao zoom anterior do mapa.

A memória das extensões geográficas são mantidas nos quador s de animação (objeto quadrosfilme).
*/
function zoomAnterior()
{
	try
	{
		var n = quadrosfilme.length;
		//
		//pega o quadro anterior com extensão diferente da atual
		//
		var muda = 0;
		for (var i = (n - 1); i > 0; i--)
		{
			if (quadrosfilme[i].extensao != ' ' && quadrosfilme[i].extensao == objmapa.extent)
			{
				var muda = i - 1;break;
			}
		}
		if(quadrosfilme[muda].extensao != " ")
		{
			g_zoomProximo.push(objmapa.extent);
			i3GEO.navega.zoomExt(g_locaplic,g_sid,g_tipoimagem,quadrosfilme[muda].extensao);
			for (var i = n-1; i > muda; i--)
			{
				$i("f"+(i)).className = "quadro";
				var qu = new quadrofilme();
				quadrosfilme[i] = qu;
			}
		}
	}
	catch(e){var e = "";}
}
/*
Function: zoomProximo

Avança para o zoom definido antes de aplciar o zoom anterior.

A memória das extensões geográficas são mantidas no array g_zoomProximo.
*/
function zoomProximo()
{
	try
	{
		var n = g_zoomProximo.length;
		if (n > 0 && g_zoomProximo[n-1] != objmapa.extent)
		{
			i3GEO.navega.zoomExt(g_locaplic,g_sid,g_tipoimagem,g_zoomProximo[n-1]);
			g_zoomProximo.pop();
		}
	}
	catch(e){var e = "";}	
}
/*
Function: pegaCoordenadaUTM

Mostra as coordenadas do mouse em UTM.

Disparada apenas quando o mouse é estacionado por alguns instantes sobre o mapa.<b> 

Para que esta função seja executada, é necessário existir um DIV com id=mostraUTM
*/
function pegaCoordenadaUTM()
{
	if (!$i("mostraUTM")){return;}
	var mostra = function(retorno)
	{
		$i("mostraUTM").style.display="block";
		$i("mostraUTM").innerHTML = "UTM: x="+retorno.data.x+" y="+retorno.data.y+" zona="+retorno.data.zona+" datum="+retorno.data.datum;
	};
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+objposicaocursor.ddx+"&y="+objposicaocursor.ddy+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_persistent_connection(true);
	cp.set_response_type("JSON");
	cp.call(p,"geo2utm",mostra);
}
/*
Function: mostraRosaDosVentos

Mostra a rosa dos ventos quando o mouse é estacionado por alguns instantes sobre o mapa.

Executado apenas se a variável g_mostraRosa = "sim"
*/
function mostraRosaDosVentos()
{
	if (g_mostraRosa == "nao"){return;}
	if (!$i("tip"))
	{
		var novoel = document.createElement("div");
		novoel.id = "tip";
		novoel.style.position="absolute";
		novoel.style.zIndex=5000;
		document.body.appendChild(novoel);
	}
	//mostra opção sobre o mouse quando está na função pan
	if (($i("box1")) &&  (document.getElementById("imgh").style.display=="block") && ($i("box1").style.visibility != "visible"))
	{
		if ((g_tipoacao == "zoomli") || (g_tipoacao == "zoomlo") || (g_tipoacao == "pan"))
		{
			if(g_mostraRosa == "sim")
			{
				if($i("tip"))
				{
					if($i("tip").style.opacity)
					{$i("tip").style.opacity=".7";}
					else
					{$i("tip").style.filter = "alpha(opacity=70)";}		
				}
				var setas = "<table id='rosaV' >";
				setas += "<tr onclick=\"javascript:g_mostraRosa='nao'\"><td></td><td></td><td style=cursor:pointer >x</td></tr><tr>";
				setas += "<td><img class='rosanoroeste' title='noroeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','noroeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
				setas += "<td><img class='rosanorte' title='norte' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','norte','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
				setas += "<td><img class='rosanordeste' title='nordeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','nordeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td></tr>";
				setas += "<tr><td><img class='rosaoeste' title='oeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','oeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
				setas += "<td><table><tr>";
				setas += "<td><img class='rosamais' title='aproxima' onclick='i3GEO.navega.zoomin()' src='"+$im("branco.gif")+"' </td>";
				setas += "<td><img class='rosamenos' title='afasta' onclick='i3GEO.navega.zoomout()' src='"+$im("branco.gif")+"' </td>";
				setas += "</tr></table></td>";
				setas += "<td><img class='rosaleste' title='leste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','leste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td></tr>";
				setas += "<tr><td><img class='rosasudoeste' title='sudoeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','sudoeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
				setas += "<td><img class='rosasul' title='sul' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','sul','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
				setas += "<td><img class='rosasudeste' title='sudeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+g_locaplic+"','"+g_sid+"','sudeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td></tr></table>";
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
}
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
	if ((qual == 1) && (!$i("maisBotoes1"))  && ($i("barraDeBotoes1")))
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
				if ($i("i3geo_escalanum"))
				{$i("i3geo_escalanum").value=ns;}
			};
		}		
		return;
	}
	if ((qual == 1) && ($i("maisBotoes1")) )
	{YAHOO.janelaBotoes1.xp.panel.show();}
	//janela de botoes 2
	if ((qual == 2) && (!$i("maisBotoes2"))  && ($i("barraDeBotoes2")))
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
		ins += '<img style="cursor:pointer;" id=imagemReferencia src="" >';
		ins += '<div id=boxRef style="position:absolute;top:0px;left:0px;width:10px;height:10px;border:2px solid blue;display:none"></div></div>';
		ins += '<div style="text-align:left;font-size:0px" id="refmensagem" ></div></div>';
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		$i("imagemReferencia").style.height = objmapa.refheight+"px";
	}
	if($i("winRef").style.display != "block")
	{
		$i("winRef").style.display = "block";
		YAHOO.namespace("janelaRef.xp");
		YAHOO.janelaRef.xp.panel = new YAHOO.widget.Panel("winRef", { width:"156px", fixedcenter: false, constraintoviewport: true, underlay:"shadow", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaRef.xp.panel.render();
		var pos = pegaPosicaoObjeto($i("img"));
		if (navm){YAHOO.janelaRef.xp.panel.moveTo((pos[0]+objmapa.w-160),pos[1]+4);}
		else
		{YAHOO.janelaRef.xp.panel.moveTo((pos[0]+objmapa.w-160),pos[1]+4);}
		var escondeRef = function()
		{
			YAHOO.util.Event.removeListener(YAHOO.janelaRef.xp.panel.close, "click");
			YAHOO.janelaRef.xp.panel.destroy();	
			i3GEO.util.insereCookie("g_mapaRefDisplay","none");
		};
		YAHOO.util.Event.addListener(YAHOO.janelaRef.xp.panel.close, "click", escondeRef);	
		i3GEO.util.insereCookie("g_mapaRefDisplay","block");
	}
	objmapa.atualizaReferencia();
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
				var pos = pegaPosicaoObjeto($i("img"));
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
	var pos = pegaPosicaoObjeto($i("img"));
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
				i3GEO.navega.zoomExt(g_locaplic,g_sid,g_tipoimagem,v);
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
Function: clicouRef

Altera a abrangência do mapa quando o mapa de referência é clicado
*/
function clicouRef()
{
	try
	{
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+objmapa.scale+"&tipo=ref&x="+objposicaocursor.refx+"&y="+objposicaocursor.refy+"&g_sid="+g_sid;
		cpObj.call(p,"pan",ajaxredesenha);
	}
	catch(e){var e = "";i3GEO.janela.fechaAguarde("ajaxredesenha");}
}
/*
Function: movimentoRef

Pega a coordenada do cursor sobre o mapa de referência
*/
function movimentoRef(obj)
{
	obj.onmousemove =function(exy)
	{
		capturaposicao(exy);
	};
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
Section: atributos
*/
/*
Function: verificaTip

Verifica se a opção de identificação está ativa e se o mouse está parado.
Se o mouse estiver parado, chama a função de mostrar tip.

A função de busca dos dados para a etiqueta é definida na variável de configuração g_funcaoTip

Pode-se definir uma outra função qualquer, sem a necessidade de alteração do código original do i3geo, definindo-se
no HTML da interface a variável, por exemplo, gfuncaoTip = "minhasEtiquetas()"

Por default, utiliza-se a função verificaTipDefault()
*/
function verificaTip()
{
	if (g_operacao != "identifica"){return;}
	//insere div para tips
	if (!$i("tip"))
	{
		var novoel = document.createElement("div");
		novoel.id = "tip";
		novoel.style.position="absolute";
		novoel.style.zIndex=5000;
		if (navm)
		{novoel.style.filter = "alpha(opacity=90)";}
		document.body.appendChild(novoel);
	}
	if ((g_operacao == "identifica") && ($i("tip").style.display!="block"))
	{
		var i = $i("tip");
		var ist = i.style;
		ist.top = objposicaocursor.telay +20;
		ist.left = objposicaocursor.telax;
		i.innerHTML = "<table style='text-align:left'><tr><td style='text-align:left'>Pesquisando...</td></tr></table>";
		ist.display="block";
		eval(g_funcaoTip);
	}
}
/*
Function: verificaTipDefault

Executa a operação de identificação para mostrar uma etiqueta no mapa.

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

Mostra a descrição de um elemento do mapa como uma etiqueta na posição do mouse.

Para que um tema tenha uma etiqueta, é necessário configurar o metadata TIP no map file.

Parameters:

retorno - retorno da função ajax com os dados para montar a etiqueta.
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
Section: sistemas de busca e navegação
*/
/*
Function: atualizagoogle

Atualiza o box do google se a função google estiver ativa
*/
function atualizagoogle()
{
	if (frames["wdocai"])
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
Function: pegaMapas

Recebe a lista de mapas (banners) e monta a apresentação na guia "mapas".

Adiciona na guia mapas os banners que dão acesso direto a mapas especiais.

A indicação do arquivo xml é feita em ms_configura.php ou no sistema de administração

Parameters:

retorno - objeto JSON com a lista de mapas
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
			if(mapa[ig1].PUBLICADO)
			{
				if(mapa[ig1].PUBLICADO == "NAO" || mapa[ig1].PUBLICADO == "nao")
				{var nome = "<s>"+nome+"</s>";}
			}
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

Marca o checkbox de adição de temas

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
	//
	//zera o contador de tempo
	//
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
		var remapaAdicNovos = function remapaAdicNovos(retorno)
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
					var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+(ta.toString())+"&g_sid="+g_sid;
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
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+(tsd.toString())+"&ligar="+(tsl.toString())+"&g_sid="+g_sid;
			cpObj.call(p,"ligaDesligaTemas",remapaAdicNovos);
		}
		else{remapaAdicNovos();}
		i3GEO.janela.fechaAguarde("remapa");
	}
	else
	{remapaAdicNovos();}
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
	}
	catch(e){alert("Ocorreu um erro. calcposf"+e);}
}
/*
Function: movecursor

Move o ícone que segue o mouse quando da movimentação sobre o mapa
*/
function movecursor()
{
	//
	//se a interface openlayers ou flamingo estiver sendo usada, o ícone não é mostrado
	//'obj' é o elemento que guarda o ícone que segue o mouse
	//
	if ($i("obj"))
	{
		if ($i("openlayers") || $i("flamingo"))
		{$i("obj").style.display = "none";}
		else
		{
			var obje = $i("obj").style;
			if ($i("img"))
			{
				eval ("obje." + g_tipotop + "= objposicaocursor.telay + 9 + g_postpx");
				eval ("obje." + g_tipoleft + "= objposicaocursor.telax + 9 + g_postpx");
			}
			else
			{
				eval ("obje." + g_tipotop + "= objposicaocursor.telay - 15 + g_postpx");
				eval ("obje." + g_tipoleft + "= objposicaocursor.telax + 15 + g_postpx");
			}
		}
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
	{targ = $i("img");}
	//
	//se estiver no modo pan, o movimento deve ser obtido do elemento
	//onde está a imagem do mapa e não diretamente sobre o elemento 'img'
	//se não for feito assim, o deslocamento do mapa não é capturado
	//
	if (g_panM == "sim")
	{var pos = pegaPosicaoObjeto(targ.parentNode);}
	else
	{var pos = pegaPosicaoObjeto(targ);}
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
	if(targ.id == "imagemReferencia")
	{
		var c = g_celularef;
		var ex = objmapa.extentref;
	}
	//$i("visual").innerHTML=c
	var teladd = calcddf(xfig,yfig,c,ex);
	var teladms = convdmsf(teladd[0],teladd[1]);
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
	//
	//aqui é feita a verificação da função de etiquetas
	//toda vez que o mouse é movimentado o tip é zerado
	//e é identificado que o mouse não está parado, obviamente
	//
	//objmapa.tempoParado = setTimeout('objmapa.verificaMouseParado()',g_tempotip);
	//if (objmapa.parado!="cancela")
	//{objmapa.parado = "nao";}
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
			//
			//verifica se todos os quadros estão cheios
			//
			if (quadrosfilme[nquadros - 1].imagem != " ")
			{
				//
				//se estiverem cheios, esvazia o primeiro e acrescenta o novo
				//
				//rebobinaf();
				quadrosfilme.shift();
				var qu = new quadrofilme();
				quadrosfilme.push(qu);
			}
			for (var i = 0; i < nquadros; i++)
			{
				if ((eval("quadrosfilme["+i+"]."+variavel+" == ' '")) && (muda < 0))
				{var muda = i;}
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
			for (var i = 0; i < nquadros; i++)
			{
				if ((quadrosfilme[i].imagem == " ") && (muda < 0))
				{var muda = i;}
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

o - objeto quadro ou número do quadro
*/
function filmezf(o)
{
	if(o.id)
	{var quadro = (o.id).replace("f","");}
	else
	{var quadro = o;}
	if (quadrosfilme[quadro].extensao != " ")
	{
		i3GEO.navega.zoomExt(g_locaplic,g_sid,g_tipoimagem,quadrosfilme[quadro].extensao);
	}
	else{alert("Extensao nao definida");}
}
/*
Function: filmeanimaf

Carrega as imagens armazenadas nos quadros de animação.
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

Para o cálculo da área, é feito o cálculo do número de pixel abrangido pelo polígono e multiplicado pela resolução de cada pixel.

O cálculo da resolução é feito quando a ferramenta de cálculo é ativada e armazenado na variável g_areapixel

Referência - http://www.mail-archive.com/mapserver-users@lists.umn.edu/msg07052.html
*/
function calculaArea()
{
	try
	{
		if(pontosdistobj.xpt.length > 2)
		{
			var $array_length = pontosdistobj.xpt.length;
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
		if(docmapa.getElementById("contemImg"))
		var dc = docmapa.getElementById("contemImg");
		else
		var dc = docmapa.getElementById("img");
		var pos = pegaPosicaoObjeto(dc);
		var imgext = objmapa.extent;
		var imgext = imgext.split(" ");
		vx = (vx * 1) - (imgext[0] * 1);
		vy = (vy * -1) + (imgext[3] * 1);
		c = objmapa.cellsize * 1;
		xy = new Array();
		return [(vx  / c) + pos[0],(vy / c) + pos[1]];
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
		var pos = pegaPosicaoObjeto($i("img"));
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
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao="+f+"&arq="+path;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,f,ajaxredesenha);
}
/*
Function: i3geo_pegaElementoPai

Pega o elemento pai de um elemento clicado para identificar o código do tema.

Parameters:

e - elemento do DOM.
*/
function i3geo_pegaElementoPai(e)
{
	var targ;
	if (!e)
	{var e = window.event;}
	if (e.target)
	{targ = e.target;}
	else
	if (e.srcElement)
	{targ = e.srcElement;}
	if (targ.nodeType == 3)
   	{targ = targ.parentNode;}
	var tname;
	tparent=targ.parentNode;
	return(tparent);
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


/*
Function: pegaPosicaoObjeto

Retorna a posição x,y de um objeto em relação a tela do navegador
*/
function pegaPosicaoObjeto(obj)
{
	if(obj)
	{
		if(obj.style.position == "absolute")
		{
			return [(parseInt(obj.style.left)),(parseInt(obj.style.top))];
		}
		else
		{
			var curleft = curtop = 0;
			if(obj)
			{
				if (obj.offsetParent) {
					do {
						curleft += obj.offsetLeft-obj.scrollLeft;
						curtop += obj.offsetTop-obj.scrollTop;
					} while (obj = obj.offsetParent);
				}
			}
			return [curleft+document.body.scrollLeft,curtop+document.body.scrollTop];
		}
	}
	else
	{return [0,0];}
}
/*
Function: recuperamapa

Tenta recuperar o último mapa, caso tenha ocorrido algum erro.
*/
function recuperamapa()
{
	g_recupera = 1;
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"recuperamapa",remapaf);
}
/*
Function: protocolo

Retorna o protocolo utilizado na url.
*/
function protocolo()
{
	var u = window.location.href;
	var u = u.split(":");
	return (u[0]);
}
//Mantido aqui apenas para fins de compatibilidade
function borra()
{}
//testa se esse script foi carregado
function testafuncoes()
{}
