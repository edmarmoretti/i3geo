/*
Title: Ferramentas

Abre ou executa determinadas operações de manipulação do mapa.

Normalmente, as funções abrem uma janela interna no i3geo

File: ferramentas.js

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
Section: funções de movimentação do mouse sobre o mapa
*/
/*
Function moveMede

Calcula a distância entre pontos e mostra na tela o resultado.
*/
function moveMede()
{
	if (g_tipoacao == "mede")
	{
		$i("mostradistancia").style.display="block";
		var n = pontosdistobj.xpt.length;
		if (n > 0)
		{
			var d = calculadistancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
			if (objmapa.scale > 500000)
			{var d = parseInt(d);}
			else
			{
				d= d + "";
				d = d.split(".");
				var decimal = d[1].substr(0,3);
				d = d[0]+"."+decimal;
				d = d * 1;
			}
			var da = d + pontosdistobj.dist[n-1];
			if ($i("mostradistancia_calculo"))
			{$i("mostradistancia_calculo").innerHTML = " Dist acum.= "+da+" atual= "+d+" km";}
		}
	}
}
/*
Function movePan

Desloca cursor de zoom box
*/
function movePan()
{
	if (((g_tipoacao == "zoomli") || (g_tipoacao == "selecaobox")) && ($i("box1").style.visibility == "visible"))
	{zoomboxf("desloca");}
}
/*
Function moveLonglat

Mostra os valores da coordenada do mouse.
*/
function moveLonglat()
{
	if ($i("longlat"))
	{$i("longlat").innerHTML = objposicaocursor.dmsx + "   " +  objposicaocursor.dmsy;}
}
/*
Function moveSelecaoPoli

Cria os elementos necessários à função de seleção por polígono.
*/
function moveSelecaoPoli()
{
	if (g_tipoacao == "selecaopoli")
	{
		var n = pontosdistobj.xpt.length;
		if (n > 0)
		{
			var d = calculadistancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
			if (objmapa.scale > 500000)
			{var d = parseInt(d);}
			else
			{
				d= d + "";
				d = d.split(".");
				var decimal = d[1].substr(0,3);
				d = d[0]+"."+decimal;
				d = d * 1;
			}
			var da = d + pontosdistobj.dist[n-1];
		}
	}
}
/*
Section: funções de clique sobre o mapa
*/
/*
Function: cliqueCapturaPt

Captura um ponto na tela e retorna o resultado para a janela interna que estiver aberta.

As coordenadas do ponto, em DMS, são repassadas para os campos do tipo input da janela interna que estiver aberta.
A janela aberta deve ter os seguintes elementos do tipo input (ids):
ixg,ixm,ixs,iyg,iym,iys
*/
function cliqueCapturaPt()
{
	if (g_tipoacao == "capturaponto")
	{
		if($i("wdocai"))
		{var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;}
		//convdmsf(objposicaocursor.ddx,objposicaocursor.ddx);
		var x = objposicaocursor.dmsx.split(" ");
		var y = objposicaocursor.dmsy.split(" ");
		if (doc.getElementById("ixg"))
		{doc.getElementById("ixg").value = x[0];}
		if (doc.getElementById("ixm"))
		{doc.getElementById("ixm").value = x[1];}
		if (doc.getElementById("ixs"))
		{doc.getElementById("ixs").value = x[2];}
		if (doc.getElementById("iyg"))
		{doc.getElementById("iyg").value = y[0];}
		if (doc.getElementById("iym"))
		{doc.getElementById("iym").value = y[1];}
		if (doc.getElementById("iys"))
		{doc.getElementById("iys").value = y[2];}

		
		//mudaiconf("pan");
	}
}
/*
Function: cliqueIdentifica

Abre a janela de identificação de elementos
*/
function cliqueIdentifica()
{
	if (g_tipoacao == "identifica")
	{
		wdocaf("450px","250px",g_locaplic+'/ferramentas/identifica/index.htm?&x='+objposicaocursor.ddx+'&y='+objposicaocursor.ddy+'&escala='+objmapa.scale,"","","Identifica");
	}
}
/*
Function: cliqueInserexy

Insere um ponto no mapa na posição clicada
*/
function cliqueInserexy()
{
	if (g_tipoacao == "inserexy")
	{
		var n = pontosdistobj.xpt.length;
		pontosdistobj.xpt[n] = objposicaocursor.ddx;
		pontosdistobj.ypt[n] = objposicaocursor.ddy;
		if ($i("wdoca").style.display == "none")
		{wdocaf("270px","200px",g_locaplic+'/ferramentas/inserexy2/index.htm',"");}
		var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		var ins = doc.getElementById("resultado").innerHTML;
		ins = ins + "<div style='font-size:12px' >" + objposicaocursor.ddx +" " + objposicaocursor.ddy + "</div><br>";
		doc.getElementById("resultado").innerHTML = ins;
		if (g_nomepin == ""){alert("Nenhum tema definido para editar");}
		else
		{
			objaguarde.abre("ajaxredesenha",$trad("o1"));
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&tema="+g_nomepin+"&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy+"&g_sid="+g_sid;
			cpObj.call(p,"insereSHP",ajaxredesenha);
		}
	}
}
/*
Function: cliqueInseregrafico

Insere um gráfico no mapa na posição clicada
*/
function cliqueInseregrafico()
{
	if (g_tipoacao == "inseregrafico")
	{
		if ($i("wdoca").style.display == "none")
		{wdocaf("270px","200px",g_locaplic+'/ferramentas/inseregrafico/index.htm',"");}
		var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		var tema = doc.getElementById("temasLigados").value;
		var width = doc.getElementById("w").value;
		var inclinacao = doc.getElementById("inclinacao").value;
		var shadow_height = doc.getElementById("sombra").value;
		if (tema == ""){alert("Nenhum tema definido para pegar os dados");}
		else
		{
			//pega os itens e as cores definidas
			var listadeitens = new Array();
			var g = doc.getElementById("listai");
			var iguias = g.getElementsByTagName("input");
			for (i=0;i<iguias.length; i++)
			{
				if (iguias[i].checked == true)
				{
					var it = iguias[i].id;
					var c = doc.getElementById("cor"+it).value;
					listadeitens.push(it+","+c);
				}
			}
			var itens = listadeitens.join("*");
			if (itens == "")
			{alert("Nenhum item foi escolhido");}
			else
			{
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+objposicaocursor.ddx+"&y="+objposicaocursor.ddy+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+g_sid;
				cpObj.call(p,"insereSHPgrafico",ajaxredesenha);
			}
		}
	}
}
/*
Function: cliqueInseretoponimo

Insere um texto no mapa na posição clicada
*/
function cliqueInseretoponimo()
{
	if (g_tipoacao == "textofid")
	{
		var n = pontosdistobj.xpt.length;
		pontosdistobj.xpt[n] = objposicaocursor.ddx;
		pontosdistobj.ypt[n] = objposicaocursor.ddy;
		if ($i("wdoca").style.display == "none")
		{textofid();}
		var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		texto = doc.getElementById("texto").value;
		var f = doc.getElementById("fonte").value;
		var t = doc.getElementById("tamanho").value;
		var a = doc.getElementById("angulo").value;
		var cf = doc.getElementById("fundoc").value;
		if (cf == ""){cf = "off";}
		var cs = doc.getElementById("sombra").value;
		if (cs == ""){cs = "off";}
		var xs = doc.getElementById("sombrax").value;
		var ys = doc.getElementById("sombray").value;
		var c = doc.getElementById("frente").value;
		var m = doc.getElementById("mascara").value;
		if (m == ""){m = "off";}
		var fcs = doc.getElementById("frentes").value;
		if (fcs == ""){fcs = "off";}
		var fxs = doc.getElementById("frentex").value;
		var fys = doc.getElementById("frentey").value;
		var forca = doc.getElementById("force").value;
		var md = doc.getElementById("mindistance").value;
		var mf = doc.getElementById("minfeaturesize").value;
		var ox = doc.getElementById("offsetx").value;
		var oy = doc.getElementById("offsety").value;
		var pl = doc.getElementById("partials").value;
		var pos = doc.getElementById("position").value;
		//o texto será digitado
		var digi = function(retorno)
		{
			//se texto for igual a vazio é pq o valor foi pego de um atributo
			if(texto == "")
			{
				objaguarde.fecha("ajaxredesenha");
				texto = retorno.data;
			}
			if (texto != " ")
			{
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+g_nomepin+"topo&tipo=ANNOTATION&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy+"&texto="+texto+"&position="+pos+"&partials="+pl+"&offsetx="+ox+"&offsety="+oy+"&minfeaturesize="+mf+"&mindistance="+md+"&force="+forca+"&shadowcolor="+fcs+"&shadowsizex="+fxs+"&shadowsizey="+fys+"&outlinecolor="+m+"&cor="+c+"&sombray="+ys+"&sombrax="+xs+"&sombra="+cs+"&fundo="+cf+"&angulo="+a+"&tamanho="+t+"&fonte="+f+"&g_sid="+g_sid;
				cpObj.call(p,"insereFeature",ajaxredesenha);
			}
		};
		if (doc.getElementById("tipoInsere").value == "digitando")
		{eval("digi('')");}
		else
		{
			//o texto será capturado de um atributo do elemento
			texto = "";
			if ((doc.getElementById("temasLigados")) && (doc.getElementById("itemsel")))
			{
				var tema = doc.getElementById("temasLigados").value;
				var item = doc.getElementById("itemsel").value;
				objaguarde.abre("ajaxredesenha",$trad("o1"));
				var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+objposicaocursor.ddx+","+objposicaocursor.ddy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+g_sid;
				cpObj.call(p,"identificaunico",digi);
			}			
		}
	}
}
/*
Function: cliqueSelecao

Seleciona um elemento de um tema do mapa
*/
function cliqueSelecao()
{
	if (g_tipoacao == "selecao")
	{
		var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		var tipo = "adiciona";
		//pega o tipo de operacao da janela de selecao
		if (doc.getElementById("tipoOperacao")){tipo = doc.getElementById("tipoOperacao").value;}
		if (objmapa.temaAtivo == ""){alert("Nenhum tema ativo");return;}
		var tolerancia = doc.getElementById("toleranciapt").value;
		//se tipo for limpa ou inverte, a operacao nao e executada no clique no mapa
		if ((tipo != "limpa") && (tipo != "inverte"))
		{
			objaguarde.abre("ajaxredesenha",$trad("o1"));
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=selecaopt&tema="+objmapa.temaAtivo+"&tipo="+tipo+"&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy+"&tolerancia="+tolerancia+"&g_sid="+g_sid;
			cpObj.call(p,"selecaoPT",ajaxredesenha);
		}
	}
}
/*
Function: cliqueMede

Executa as operações de medição de distâncias
*/
function cliqueMede()
{
	if (g_tipoacao == "mede")
	{
		var n = pontosdistobj.xpt.length;
		pontosdistobj.xpt[n] = objposicaocursor.ddx;
		pontosdistobj.ypt[n] = objposicaocursor.ddy;
		pontosdistobj.xtela[n] = objposicaocursor.telax;
		pontosdistobj.ytela[n] = objposicaocursor.telay;
		pontosdistobj.ximg[n] = objposicaocursor.imgx;
		pontosdistobj.yimg[n] = objposicaocursor.imgy;
		pontosdistobj.dist[n] = 0;
		window.status=n;
		if (n > 0)
		{
			var d = parseInt(calculadistancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));
			pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
		}
		inseremarcaf(objposicaocursor.telax,objposicaocursor.telay);
	}
}
/*
Function: cliqueSelecaoPoli

Executa as operações de seleção por polígono quando o mouse é movido sobre o mapa
*/
function cliqueSelecaoPoli()
{
	if (g_tipoacao == "selecaopoli")
	{
		var n = pontosdistobj.xpt.length;
		pontosdistobj.xpt[n] = objposicaocursor.ddx;
		pontosdistobj.ypt[n] = objposicaocursor.ddy;
		pontosdistobj.xtela[n] = objposicaocursor.telax;
		pontosdistobj.ytela[n] = objposicaocursor.telay;
		pontosdistobj.ximg[n] = objposicaocursor.imgx;
		pontosdistobj.yimg[n] = objposicaocursor.imgy;
		pontosdistobj.dist[n] = 0;
		window.status=n;
		inseremarcaf(objposicaocursor.telax,objposicaocursor.telay);
	}
}
/*
Section: propriedades do mapa
*/
/*
Function: salvaMapa

Salva o map file localmente
*/
function salvaMapa()
{wdocaf("300px","180px",g_locaplic+"/ferramentas/salvamapa/index.htm","","","Salva mapa");}
/*
Function: carregaMapa

Carrega um map file salvo
*/
function carregaMapa()
{wdocaf("300px","150px",g_locaplic+"/ferramentas/carregamapa/index.htm?urlatual="+window.location,"","","Carrega mapa");}
/*
Function: convertews

Converte mapa em web service
*/
function convertews()
{wdocaf("440px","280px",g_locaplic+"/ferramentas/convertews/index.htm","","","Web service");}
/*
Function: queryMap

Altera as propriedades da exibição dos elementos selecionados.
*/
function queryMap()
{wdocaf("210px","170px",g_locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Querymap");}
/*
Function: ativaLogo

Ativa ou desativa a logo marca.

*/
function ativaLogo()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+g_sid;
	cpObj.call(p,"ativalogo",ajaxredesenha);
}
/*
Function: tamanho

Muda o tamanho do mapa
*/
function tamanho()
{wdocaf("150px","170px",g_locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho");}
/*
Function: tipoimagem

Define um filtro sobre a imagem gerada alterando susas características
*/
function tipoimagem()
{wdocaf("300px","220px",g_locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem");}
/*
Function: corFundo

Altera a cor do fundo atual.
*/
function corFundo()
{wdocaf("210px","170px",g_locaplic+"/ferramentas/opcoes_fundo/index.htm","","","Fundo");}
/*
Section: propriedades de um tema
*/
/*
Function: destacaTema

Cria imagem de destaque

Parameters:

tema - id ue identifica o tema no map file.
*/
function destacaTema(tema)
{
	if ($i("img_d"))
	{$i("img_d").src = "";}
	if ($i(objmapa.guiaTemas+"obj"))
	{
		var iguias = $i(objmapa.guiaTemas+"obj").getElementsByTagName("input");
		for (i=0;i<iguias.length; i++)
		{
			if ((iguias[i].type == "checkbox") && (iguias[i].value == tema) && (iguias[i].checked == true))
			{alert("Desligue o tema antes de destacar");return;}
		}
	}
	objaguarde.abre("ajaxdestaca","Aguarde...gerando imagem");
	g_destaca = tema;
	var p =g_locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+g_sid;
	cpObj.call(p,"geraDestaque",ajaxdestaca);
}
/*
Function: excluitemaf

Exclui um tema do mapa

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function excluitemaf(tema)
{
	g_operacao = "excluitema";
	//remove o tema do DOM e seus filhos
	var p = document.getElementById("idx"+tema).parentNode.parentNode.parentNode;
	do
	{
		p.removeChild(p.childNodes[0]);
	}
	while (p.childNodes.length > 0);
	p.parentNode.removeChild(p);
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+g_sid;
	cpObj.call(p,"excluiTemas",ajaxredesenha);
	objmapa.temaAtivo = "";
}
/*
Function: sobetemaf

Sobe um tema na ordem de desenho

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function sobetemaf(tema)
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+g_sid;
	cpObj.call(p,"sobeTema",ajaxredesenha);
}
/*
Function: descetemaf

Desce um tema na ordem de desenho

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function descetemaf(tema)
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+g_sid;
	cpObj.call(p,"desceTema",ajaxredesenha);
}
/*
Function: zoomtemaf

Zoom para o tema

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function zoomtemaf(tema)
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+g_sid;
	cpObj.call(p,"zoomTema",ajaxredesenha);
}
/*
Function: limpaseltemaf

Limpa a selecao do tema

Parameters:

celula - objeto que foi clicado nas opções de um tema. Passado para a função pegatema.
*/
function limpaseltemaf(celula)
{
	g_operacao = "limpasel";
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+pegaTema(celula)+"&g_sid="+g_sid;
	cpObj.call(p,"selecaoLimpa",ajaxredesenha);
}
/*
Function: mudatranspf

Muda a transparencia de um tema

Parameters:

celula - objeto que foi clicado nas opções de um tema. Passado para a função pegatema.
*/
function mudatranspf(idtema)
{
	g_operacao = "transparencia";
	//o campo input com o valor possui o prefixo 'tr' seguido pelo código do tema
	if ($i("tr"+idtema))
	{var valor = $i("tr"+idtema).value;}
	else
	{alert("Ocorreu um erro");}
	if (valor != "")
	{
		objaguarde.abre("ajaxredesenha",$trad("o1"));
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+idtema+"&valor="+valor+"&g_sid="+g_sid;
		cpObj.call(p,"mudaTransparencia",ajaxredesenha);
	}
	else
	{alert("Valor não definido.");}
}
/*
Function: mudanomef

Muda o nome de um tema

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function mudanomef(idtema)
{
	g_operacao = "mudanome";
	if($i("nn"+idtema))
	{var valor = $i("nn"+idtema).value;}
	else
	{alert("Ocorreu um erro");}
	if (valor != "")
	{
		var p = $i("nometema"+idtema);
		$i("nometema"+idtema).innerHTML = valor;
		objaguarde.abre("ajaxredesenha",$trad("o1"));
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+idtema+"&valor="+valor+"&g_sid="+g_sid;
		cpObj.call(p,"mudaNome",ajaxredesenha);
	}
	else
	{alert("Nome não definido");}
}
/*
Function: toponimiaf

Opções de toponímia de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function toponimiaf(idtema)
{wdocaf("350px","340px",g_locaplic+"/ferramentas/toponimia/index.htm?tema="+idtema,"","","Topon&iacute;mia");}
/*
Function: filtrof

Opções de filtragem de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function filtrof(idtema)
{wdocaf("480px","250px",g_locaplic+"/ferramentas/filtro/index.htm?tema="+idtema,"","","Filtro");}
/*
Section: análise geográfica
*/
/*
Function selecao

Abre a janela com as opções de seleção de elementos no mapa
*/
function selecao()
{
	if (g_tipoacao != "selecao")
	{
		g_tipoacao = "selecao";
		mudaiconf("selecao");
		pontosdistobj = new pontosdist();
		objmapa.temaAtivo = "";
		wdocaf("360px","320px",g_locaplic+'/ferramentas/selecao/index.htm',"","","Sele&ccedil;&atilde;o");
	}
	else
	{mudaiconf("pan");}
}
/*
Function: pontosdistri

Análises de distribuição de pontos
*/
function pontosdistri()
{
	//a variável g_r indica se o R está instalado no servidor e é definida na inicialização do I3Geo
	if (g_r == "nao")
	{alert("Opção não disponível");}
	else
	{wdocaf("400px","300px",g_locaplic+"/ferramentas/pontosdistri/index.htm","","","Distribui&ccedil;&atilde;o de pontos");}
}

/*
Function: pontoempoligono

Cruza um tema de pontos com um ou mais temas poligonais e gera um novo tema
*/
function pontoempoligono()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/pontoempoligono/index.htm","","","Ponto em pol&iacute;gono");}
/*
Function: nptPol

Cruza um tema de pontos com um ou tema poligona e gera um novo tema com o número de pontos em cada polígono
*/
function nptPol()
{wdocaf("400px","200px",g_locaplic+"/ferramentas/nptpol/index.htm","","","Pontos por pol&iacute;gono");}
/*
Function: buffer

Gera um buffer em elementos selecionados
*/
function buffer()
{wdocaf("400px","180px",g_locaplic+"/ferramentas/buffer/index.htm","","","Entorno");}
/*
Function: centroide

Gera um tema com os centroides dos elementos selecionados
*/
function centroide()
{wdocaf("400px","180px",g_locaplic+"/ferramentas/centroide/index.htm","","","Centróide");}
/*
Function: analisaGeometrias

Sistema de análise de geometrias
*/
function analisaGeometrias()
{
	g_tipoacao = "selecao";
	mudaiconf("selecao");
	pontosdistobj = new pontosdist();
	objmapa.temaAtivo = "";
	wdocaf("500px","400px",g_locaplic+'/ferramentas/analisageometrias/index.htm',"","","Sele&ccedil;&atilde;o");
}
/*
Function: mede
	
Botão de medição de distâncias.

A medida é feita quando o usuário clica no mapa com esta opção ativa

Quando o botão é acionado, abre-se a janela que mostra o resultado da medida, o ícone que segue o mouse é alterado.

Para mostrar o resultado do cálculo, é incluído um div específico.
*/
function mede()
{
	//insere div para medida de distancias
	if (!$i("mostradistancia"))
	{
		var novoel = document.createElement("div");
		novoel.id = "mostradistancia";
		var ins = '<div class="hd" >&nbsp</div>';
		ins += '<div class="bd" style="text-align:left;padding:3px;" >';
		ins += '<div style="text-align:left;padding:3px;" id="mostradistancia_calculo" ></div>';
		ins += '<div style="text-align:left;font-size:10px" >';
		ins += "<span style='color:navy;cursor:pointer;text-align:left;' >";
		ins += '</div>';
		ins+= '</div>';
		novoel.innerHTML = ins;
		novoel.style.borderColor="gray";
		document.body.appendChild(novoel);
	}
	if (g_tipoacao != "mede")
	{
		YAHOO.namespace("janelaDocamede.xp");
		YAHOO.janelaDocamede.xp.panel = new YAHOO.widget.Panel("mostradistancia", {width:220,fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaDocamede.xp.panel.render();
		YAHOO.janelaDocamede.xp.panel.moveTo(imagemxi+150,imagemyi);
		var escondeWdocamede = function()
		{
			YAHOO.util.Event.removeListener(YAHOO.janelaDocamede.xp.panel.close, "click");
		};
		YAHOO.util.Event.addListener(YAHOO.janelaDocamede.xp.panel.close, "click", escondeWdocamede);
		mudaiconf("mede");
		pontosdistobj = new pontosdist();
		$i("mostradistancia").style.display="block";
		//
		//verifica se existe o div para incluir as geometrias temporárias via svg ou vml
		//
	}
	else
	{
		mudaiconf("pan");
		if($i("mostradistancia")){$i("mostradistancia").style.display="none";}
	}
}
/*
Function: inserexy
	
Ativa o botão de inserção de pontos (digitalização).
	
A inserção é feita quando o usuário clica no mapa com esta opção ativa
	
Quando o botão é acionado, abre-se a janela de opções, o ícone que segue o mouse é alterado
e a variável g_tipoacao é definida.
*/
function inserexy()
{
	if (g_tipoacao != "inserexy")
	{
		var temp = Math.random() + "a";
		temp = temp.split(".");
		g_nomepin = "pin"+temp[1];
		mudaiconf("inserexy");
		pontosdistobj = new pontosdist();
		wdocaf("400px","300px",g_locaplic+'/ferramentas/inserexy2/index.htm',"","","Insere");
	}
	else
	{mudaiconf("pan");}
}
/*
Function: inseregrafico

Inserção de gráficos.
	
A inserção é feita quando o usuário clica no mapa com esta opção ativa
	
Quando o botão é acionado, abre-se a janela de opções, o ícone que segue o mouse é alterado
e a variável g_tipoacao é definida.
*/
function inseregrafico()
{
	if (g_tipoacao != "inseregrafico")
	{
		var temp = Math.random() + "gr";
		temp = temp.split(".");
		g_nomepin = "pin"+temp[1];
		mudaiconf("inseregrafico");
		wdocaf("400px","300px",g_locaplic+'/ferramentas/inseregrafico/index.htm',"","","Insere");
	}
	else
	{mudaiconf("pan");}
}
/*
Section: grades
*/
/*
Function: gradePontos

Gera grade de pontos
*/
function gradePontos()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/gradepontos/index.htm","","","Grade de pontos");}
/*
Function: gradePoligonos

Gera grade de poligonos
*/
function gradePol()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/gradepol/index.htm","","","Grade de pol&iacute;gonos");}
/*
Function: gradeHex

Gera grade de hexágonos
*/
function gradeHex()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/gradehex/index.htm","","","Grade de hex&aacute;gonos");}

/*
Function: gradeCoord

Gera grade de coordenadas
*/
function gradeCoord()
{wdocaf("300px","180px",g_locaplic+"/ferramentas/gradecoord/index.htm","","","Grade de coordenadas");}
/*
Section: atributos
*/
/*
Function: procuraratribf

Procurar atributos na tabela do tema

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function procuraratribf(idtema)
{wdocaf("550px","340px",g_locaplic+"/ferramentas/busca/index.htm?tema="+idtema,"","","Procurar");}
/*
Function: tabelaf

Abre a tabela de atributos de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function tabelaf(idtema)
{wdocaf("500px","400px",g_locaplic+"/ferramentas/tabela/index.htm?tema="+idtema,"","","Tabela");}
/*
Function: etiquetas

Abre a tabela de atributos de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function etiquetas(idtema)
{wdocaf("400px","300px",g_locaplic+"/ferramentas/etiqueta/index.htm?tema="+idtema,"","","Etiquetas");}
/*
Section: legenda
*/
/*
Function: opcoesLegenda

Ativa ou desativa a legenda incluida na imagem do mapa e define seus parâmetros.

*/
function opcoesLegenda()
{wdocaf("300px","280px",g_locaplic+"/ferramentas/opcoes_legenda/index.htm","","","Legenda");}
/*
Function: abreCor

Abre a paleta de cores

Parameters:

janela - id da janela que disparou a janela de cores

elemento - elemento da janela que receberá os valores de cor selecionada
*/
function abreCor(janela,elemento)
{wdocaf2("390px","230px",g_locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento,"","","Cor");}
/*
Function: editaLegenda

Editor de legenda de um tema

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function editaLegenda(idtema)
{wdocaf("490px","340px",g_locaplic+"/ferramentas/legenda/index.htm?tema="+idtema,"","","Legenda");}
/*
Section: adição de temas
*/
/*
Function: navegacaoDir

Adiciona temas navegando pelos diretórios do servidor
*/
function navegacaoDir()
{wdocaf("550px","350px",g_locaplic+"/ferramentas/navegacaodir/index.htm","","","Diret&oacute;rios");}
/*
Function: conectarwms

Adiciona temas tendo como fonte um web service do tipo wms
*/
function conectarwms()
{wdocaf("400px","300px",g_locaplic+"/ferramentas/conectarwms/index.htm","","","WMS");}
/*
Function: conectarwfs

Adiciona temas tendo como fonte um web service do tipo wfs
*/
function conectarwfs()
{wdocaf("400px","300px",g_locaplic+"/ferramentas/conectarwfs/index.htm","","","WFS");}
/*
Function: conectargeorss

Adiciona temas tendo como fonte um georss
*/
function conectargeorss()
{wdocaf("400px","300px",g_locaplic+"/ferramentas/conectargeorss/index.htm","","","GeoRSS");}
/*
Function: abreSistema

Abre um programa definido no menu de sistemas.

A lista de sistemas é lida de um arquivo xml definido no ms_configura.php

Parameters:

endereco - programa que será executado.
w - largura da janela.
h - altura da janela.
*/
function abreSistema(endereco,w,h)
{
	if(endereco != "")
	{wdocaf(w+"px",h+"px",endereco,"","","Sistemas");}
	else
	{alert("Endereço não definido");}
}
/*
Function: upload

Faz o upload de shape file
*/
function upload()
{wdocaf("300px","200px",g_locaplic+"/ferramentas/upload/index.htm","","","Upload");}
/*
Section: navegação
*/
/*
Function: buscaRapida
	
Insere a opção de busca rápida.
	
*/	
function ativaBuscaRapida(iddiv)
{
	if($i("buscaRapida"))
	{
		var ins = "<input onclick='javascript:this.value=\"\"' id=valorBuscaRapida title='digite o texto para busca' type=text size=30 class=digitar value='"+$trad("o2")+"' />";
		ins += "<img  src='"+g_locaplic+"/imagens/tic.png' onclick='buscaRapida()' />";
		$i(iddiv).innerHTML = ins;
	}
}
/*
Function: buscaRapida

Realiza a busca por palavra no serviço geonames do MMA

Chama o web service e mostra os resultados na tela
*/
function buscaRapida()
{
	criaboxg();
	if ($i("buscaRapida"))
	{
		if ($i("valorBuscaRapida").value == "")
		{alert ("Digite uma palavra para busca!");return;}
		wdocaf("300px","280px",g_locaplic+"/ferramentas/buscarapida/index.htm","","","Busca rapida");
	}
}
/*
Function: wiki

Abre a janela de busca na wikipedia.
*/
function wiki()
{
	g_operacao = "navega";
	wdocaf("450px","190px",g_locaplic+"/ferramentas/wiki/index.htm","","","Wiki");
}
/*
Function: google

Abre a janela do google.
*/
function google()
{
	criaboxg();
	g_operacao = "navega";
	if(navn){wdocaf("340px","340px",g_locaplic+"/ferramentas/googlemaps/index.htm","","","Google maps");}
	else
	{wdocaf("360px","360px",g_locaplic+"/ferramentas/googlemaps/index.htm","","","Google maps");}
}
/*
Function: scielo

Abre a janela de busca de artigos científicos na base de dados Scielo.
*/
function scielo()
{
	g_operacao = "navega";
	wdocaf("450px","190px",g_locaplic+"/ferramentas/scielo/index.htm","","","Scielo");
}
/*
Function: confluence

Abre a janela de busca na base de dados confluence (documentos relativos a uma intersecção de coordenadas).
*/
function confluence()
{
	g_operacao = "navega";
	wdocaf("250px","190px",g_locaplic+"/ferramentas/confluence/index.htm","","","confluence");
	criaboxg();
}
/*
Function: lenteDeAumento

Cria a lente de aumento.

A lente de aumento permite visualizar a mesma imagem do mapa de forma ampliada, porém, em uma janela menor. A imagem é mostrada conforme a posição do mouse sobre o corpo do mapa.
*/
function lenteDeAumento()
{
	//insere lente de aumento
	if (!$i("lente"))
	{
		var novoel = document.createElement("div");
		novoel.id = 'lente';
		novoel.style.clip='rect(0px,0px,0px,0px)';
		var novoimg = document.createElement("img");
		novoimg.src="";
		novoimg.id='lenteimg';
		novoel.appendChild(novoimg);
		document.body.appendChild(novoel);
		var novoel = document.createElement("div");
		novoel.id = 'boxlente';
		document.body.appendChild(novoel);
	}
	with($i('boxlente').style){borderWidth='1' + g_postpx;borderColor="red";}
	if (g_lenteaberta == "sim")
	{
		$i("lente").style.display = "none";
		$i("boxlente").style.display = "none";
		$i('boxlente').style.borderWidth = 0;
		g_lenteaberta = "nao";
	}
	else
	{
		g_lenteaberta = "sim";
		objaguarde.abre("ajaxabrelente",$trad("o1"));
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid;
		cpObj.call(p,"lente",ajaxabrelente);
	}
}
/*
Section: outros
*/
/*
Function: abreDoc

Abre a documentacao do sistema.
*/
function abreDoc()
{window.open(g_locaplic+"/documentacao/index.html");}

/*
Function: downloadbase

Lista temas para download
*/
function downloadbase()
{window.open(g_locaplic+"/datadownload.htm");}
/*
Function: download

Faz o download de um tema

Parameters:

idtema - id ue identifica o tema no map file.
*/
function download(idtema)
{wdocaf("300px","150px",g_locaplic+"/ferramentas/download/index.htm?tema="+idtema,"","","Download");}
/*
Function: opcoesEscala

Opções da barra de escala.
*/
function opcoesEscala()
{wdocaf("250px","300px",g_locaplic+"/ferramentas/opcoes_escala/index.htm",objposicaomouse.x - 75,objposicaomouse.y - 260,"Escala");}
/*
Function: imprimir

Abre as opções de impressão do mapa
*/
function imprimir()
{wdocaf("320px","180px",g_locaplic+"/ferramentas/imprimir/index.htm","","","Imprimir");};
/*
Function: reiniciaMapa

Reinicia o mapa atual
*/
function reiniciaMapa()
{
	objaguarde.abre("ajaxredesenha",$trad("o1"));
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+g_sid;
	cpObj.call(p,"reiniciaMapa",ajaxredesenha);
}
/*
Function: textofid

Abre a ferramenta de inclusão de textos no mapa.

A inserção é feita quando o usuário clica no mapa com esta opção ativa
	
Quando o botão é acionado, abre-se a janela de opções, o ícone que segue o mouse é alterado
e a variável g_tipoacao é definida.
*/
function textofid()
{
	if (g_tipoacao != "textofid")
	{
		var temp = Math.random() + "b";
		temp = temp.split(".");
		g_nomepin = "pin"+temp[1];
		mudaiconf("textofid");
		pontosdistobj = new pontosdist();
		g_tipoacao = "textofid";
		wdocaf("360px","250px",g_locaplic+"/ferramentas/inseretxt/index.htm","","","Texto");
	}
	else
	{mudaiconf("pan");}
}
//testa se esse script foi carregado
function testaferramentas()
{}
