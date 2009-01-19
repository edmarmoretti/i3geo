/*
Title: ferramentas.js

Funções que executam determinadas operações de manipulação do mapa ou que abrem janelas internas para
a realização de operações sobre o mapa.

Normalmente, as funções abrem uma janela interna no i3geo

File: i3geo/classesjs/ferramentas.js

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

Utiliza os objetos pontosdistobj e objposicaocursor para obter as coordenadas para o cálculo.

O resultado do cálculo é mostrado no DIV com id="mostradistancia_calculo" 
*/
function moveMede()
{
	if (g_tipoacao == "mede")
	{
		if($i("mostradistancia"))
		$i("mostradistancia").style.display="block";
		var n = pontosdistobj.xpt.length;
		if (n > 0)
		{
			var d = i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
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
			i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);
		}
	}
}
/*
Function moveLonglat

Mostra os valores da coordenada do mouse em latitude e longitude como uma única string.

Os dados são obtidos do objeto objposicaocursor e incluídos no DIV = "longlat"
*/
function moveLonglat()
{
	if ($i("longlat"))
	{$i("longlat").innerHTML = objposicaocursor.dmsx + "   " +  objposicaocursor.dmsy;}
}
/*
Function moveArea

Cria os elementos necessários à função de cálculo de área.
*/
function moveArea()
{
	if (g_tipoacao == "area")
	{
		var n = pontosdistobj.xpt.length;
		if (n > 0)
		{
			//
			//conforme a escala, os dados são arredondados
			// 
			var d = i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
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
			//
			//desenha as linhas na tela com o objeto richdraw
			//
			if(navn){i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhastemp,0);}
			i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);
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
	}
}
/*
Function: cliqueInserexy

Insere um ponto no mapa na posição clicada

Os pontos são obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
*/
function cliqueInserexy()
{
	if (g_tipoacao == "inserexy")
	{
		var n = pontosdistobj.xpt.length;
		pontosdistobj.xpt[n] = objposicaocursor.ddx;
		pontosdistobj.ypt[n] = objposicaocursor.ddy;
		if ($i("wdoca").style.display == "none")
		{wdocaf("270px","200px",i3GEO.configura.locaplic+'/ferramentas/inserexy2/index.htm',"");}
		var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		var ins = doc.getElementById("resultado").innerHTML;
		ins = ins + "<div style='font-size:12px' >" + objposicaocursor.ddx +" " + objposicaocursor.ddy + "</div><br>";
		doc.getElementById("resultado").innerHTML = ins;
		var item = "";
		var valoritem = "";
		if((doc.getElementById("valorItem")) && (doc.getElementById("itemtema")))
		{
			var item = doc.getElementById("itemtema").value;
			var valoritem = doc.getElementById("valorItem").value;
		}
		if (g_nomepin == ""){alert("Nenhum tema definido para editar");}
		else
		{
			i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&item="+item+"&valor="+valoritem+"&tema="+g_nomepin+"&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy+"&g_sid="+i3GEO.configura.sid;
			cpObj.call(p,"insereSHP",ajaxredesenha);
		}
	}
}
/*
Function: cliqueInseregrafico

Insere um gráfico no mapa na posição clicada

Os pontos são obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
*/
function cliqueInseregrafico()
{
	if (g_tipoacao == "inseregrafico")
	{
		if ($i("wdoca").style.display == "none")
		{wdocaf("270px","200px",i3GEO.configura.locaplic+'/ferramentas/inseregrafico/index.htm',"");}
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
			var i = iguias.length-1;
			if (i >= 0)
			{
				do
				{
					if (iguias[i].checked == true)
					{
						var it = iguias[i].id;
						var c = doc.getElementById("cor"+it).value;
						listadeitens.push(it+","+c);
					}
				}
				while(i--)
			}
			var itens = listadeitens.join("*");
			if (itens == "")
			{alert("Nenhum item foi escolhido");}
			else
			{
				i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+objposicaocursor.ddx+"&y="+objposicaocursor.ddy+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;
				cpObj.call(p,"insereSHPgrafico",ajaxredesenha);
			}
		}
	}
}
/*
Function: cliqueInseretoponimo

Insere um texto no mapa na posição clicada

Os pontos são obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
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
				i3GEO.janela.fechaAguarde("ajaxredesenha");
				texto = retorno.data;
			}
			if (texto != " ")
			{
				i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+g_nomepin+"topo&tipo=ANNOTATION&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy+"&texto="+texto+"&position="+pos+"&partials="+pl+"&offsetx="+ox+"&offsety="+oy+"&minfeaturesize="+mf+"&mindistance="+md+"&force="+forca+"&shadowcolor="+fcs+"&shadowsizex="+fxs+"&shadowsizey="+fys+"&outlinecolor="+m+"&cor="+c+"&sombray="+ys+"&sombrax="+xs+"&sombra="+cs+"&fundo="+cf+"&angulo="+a+"&tamanho="+t+"&fonte="+f+"&g_sid="+i3GEO.configura.sid;
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
				i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+objposicaocursor.ddx+","+objposicaocursor.ddy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+i3GEO.configura.sid;
				cpObj.call(p,"identificaunico",digi);
			}			
		}
	}
}
/*
Function: cliqueMede

Executa as operações de medição de distâncias.

Os pontos são obtidos do objeto objposicaocursor
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
		try
		{
			if (navn)
			{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1),(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1));}
			else
			{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);}				
		}
		catch(e){window.status=n+" erro ao desenhar a linha base "+e.message;}
		if (n > 0)
		{
			var d = parseInt(i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));
			pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
			if($i("pararraios") && $i("pararraios").checked == true )
			{
				i3GEO.desenho.aplica("insereCirculo","",n);
				if(navm)
				{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(objmapa.w/2),pontosdistobj.yimg[n-1],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);}
			}
		}
		var temp = function()
		{
			i3GEO.desenho.richdraw.fecha();
			i3GEO.util.insereMarca.limpa();
			YAHOO.util.Event.removeListener(YAHOO.janelaDocamede.xp.panel.close, "click");
			i3GEO.barraDeBotoes.ativaBotoes();
		};
		i3GEO.util.insereMarca.cria(objposicaocursor.telax,objposicaocursor.telay,temp,"pontosins");
	}
}
/*
Function: cliqueArea

Executa as operações de cálculo de área quando o usuário clica no mapa  e a opção de cálculo estiver ativa
*/
function cliqueArea()
{
	if (g_tipoacao == "area")
	{
		var n = pontosdistobj.xpt.length;
		pontosdistobj.xpt[n] = objposicaocursor.ddx;
		pontosdistobj.ypt[n] = objposicaocursor.ddy;
		pontosdistobj.xtela[n] = objposicaocursor.telax;
		pontosdistobj.ytela[n] = objposicaocursor.telay;
		pontosdistobj.ximg[n] = objposicaocursor.imgx;
		pontosdistobj.yimg[n] = objposicaocursor.imgy;
		pontosdistobj.dist[n] = 0;
		//inclui a linha para ligar com o ponto inicial
		if (n == 0)
		{
			try
			{
				if (navn)
				{pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[0]-1,pontosdistobj.yimg[0]-1);}
				else
				{pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[0])-(objmapa.w/2),pontosdistobj.yimg[0]);	}				
			}
			catch(e){}
		}
		try
		{
			if (navn)
			{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1);}
			else
			{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);}				
		}
		catch(e){}
		var m = i3GEO.calculo.area(pontosdistobj,g_areapixel);
		if($i("mostraarea_calculo"))
		{$i("mostraarea_calculo").innerHTML = "<br>m2</b>= "+m+"<br><b>km2</b>= "+m/1000000+"<br><b>ha</b>= "+m/10000;}
		if (n > 3)
		{
			//var d = parseInt(i3GEO.util.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));
			//pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
		}
		var temp = function()
		{
			i3GEO.desenho.richdraw.fecha();
			if($i("pontosArea")){document.body.removeChild($i("pontosArea"));}
			i3GEO.eventos.MOUSECLIQUE.remove("cliqueArea()");
			i3GEO.eventos.MOUSEMOVE.remove("moveArea()");
			i3GEO.barraDeBotoes.ativaBotoes();
		};
		i3GEO.util.insereMarca.cria(objposicaocursor.telax,objposicaocursor.telay,temp,"pontosArea");
	}
}

/*
Function: 
	
Ativa a opção de medição de área.

A medida é feita quando o usuário clica no mapa com esta opção ativa
*/
function area()
{
	if (!$i("mostraarea"))
	{
		var novoel = document.createElement("div");
		novoel.id = "mostraarea";
		var ins = '<div class="hd" >&Aacute;rea aproximada</div>';
		ins += '<div class="bd" style="text-align:left;padding:3px;" >';
		ins += '<div style="text-align:left;padding:3px;font-size:10px" id="mostraarea_calculo" ></div>';
		ins+= '</div>';
		novoel.innerHTML = ins;
		novoel.style.borderColor="gray";
		document.body.appendChild(novoel);
	}
	if (g_tipoacao != "area")
	{
		$i("mostraarea_calculo").innerHTML = "";
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueArea()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("cliqueArea()");}
		if(i3GEO.eventos.MOUSEMOVE.toString().search("moveArea()") < 0)
		{i3GEO.eventos.MOUSEMOVE.push("moveArea()");}		
		YAHOO.namespace("janelaDocaarea.xp");
		YAHOO.janelaDocaarea.xp.panel = new YAHOO.widget.Panel("mostraarea", {width:220,fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaDocaarea.xp.panel.render();
		YAHOO.janelaDocaarea.xp.panel.moveTo(imagemxi+150,imagemyi);
		var escondeWdocaarea = function()
		{
			i3GEO.desenho.richdraw.fecha();
			if($i("pontosArea")){document.body.removeChild($i("pontosArea"));}
			i3GEO.eventos.MOUSECLIQUE.remove("cliqueArea()");
			i3GEO.eventos.MOUSEMOVE.remove("moveArea()");
			i3GEO.barraDeBotoes.ativaBotoes();
		};
		YAHOO.util.Event.addListener(YAHOO.janelaDocaarea.xp.panel.close, "click", escondeWdocaarea);
		var temp = function(retorno)
		{
			i3GEO.janela.fechaAguarde("ajaxredesenha");
			g_areapixel = retorno.data;
			if (g_areapixel < 0)
			{alert("Nao e possivel calcular a area. Entre em contato com o administrador do sistema.");}
			else
			{
				alert("Clique no mapa para desenhar o poligono. Clique duas vezes para concluir");
				i3GEO.barraDeBotoes.ativaIcone("area");
				g_tipoacao = "area";
				i3GEO.desenho.criaContainerRichdraw();
				i3GEO.desenho.richdraw.lineColor = "green";
				i3GEO.desenho.richdraw.lineWidth = "2px";
			}
		};
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=areaPixel&celsize="+g_celula+"&g_sid="+i3GEO.configura.sid;
		cpObj.call(p,"areaPixel",temp);			
	}
	else
	{
		//i3GEO.barraDeBotoes.ativaIcone("pan");
		i3GEO.desenho.richdraw.fecha();
	}
}
/*
Function: mede
	
Ativa a opção de medição de distâncias.

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
		ins += "<input style='cursor:pointer' type='checkbox' id='pararraios' 'checked' />Raios</span>";
		ins += '</div>';
		ins+= '</div>';
		novoel.innerHTML = ins;
		novoel.style.borderColor="gray";
		document.body.appendChild(novoel);
		$i('pararraios').checked=true;
	}
	if (g_tipoacao != "mede")
	{
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueMede()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("cliqueMede()");}
		if(i3GEO.eventos.MOUSEMOVE.toString().search("moveMede()") < 0)
		{i3GEO.eventos.MOUSEMOVE.push("moveMede()");}
		YAHOO.namespace("janelaDocamede.xp");
		YAHOO.janelaDocamede.xp.panel = new YAHOO.widget.Panel("mostradistancia", {width:220,fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
		YAHOO.janelaDocamede.xp.panel.render();
		YAHOO.janelaDocamede.xp.panel.moveTo(imagemxi+150,imagemyi);
		var escondeWdocamede = function()
		{
			i3GEO.desenho.richdraw.fecha();
			if($i("pontosins")){document.body.removeChild($i("pontosins"));}
			YAHOO.util.Event.removeListener(YAHOO.janelaDocamede.xp.panel.close, "click");
			i3GEO.eventos.MOUSECLIQUE.remove("cliqueMede()");
			i3GEO.eventos.MOUSEMOVE.remove("moveMede()");
			i3GEO.barraDeBotoes.ativaBotoes();
		};
		YAHOO.util.Event.addListener(YAHOO.janelaDocamede.xp.panel.close, "click", escondeWdocamede);
		$i("mostradistancia").style.display="block";
		//
		//verifica se existe o div para incluir as geometrias temporárias via svg ou vml
		//
		i3GEO.desenho.criaContainerRichdraw();
		i3GEO.desenho.richdraw.lineColor = "black";
		i3GEO.desenho.richdraw.lineWidth = "1px";
		g_tipoacao = "mede";
	}
	else
	{
		i3GEO.desenho.richdraw.fecha();
		if($i("mostradistancia")){$i("mostradistancia").style.display="none";}
		if($i("pontosins")){$i("pontosins").style.display="none";}
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
		i3GEO.barraDeBotoes.ativaIcone("inserexy");
		//pontosdistobj = new pontosdist();
		wdocaf("400px","300px",i3GEO.configura.locaplic+'/ferramentas/inserexy2/index.htm',"","","Insere");
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueInserexy()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("cliqueInserexy()");}
	}
	//else
	//{i3GEO.barraDeBotoes.ativaIcone("pan");}
}
/*
Function: inseregrafico

Ativa a opção de inserção de gráficos.
	
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
		i3GEO.barraDeBotoes.ativaIcone("inseregrafico");
		wdocaf("400px","300px",i3GEO.configura.locaplic+'/ferramentas/inseregrafico/index.htm',"","","Insere");
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueInseregrafico()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("cliqueInseregrafico()");}
	}
	//else
	//{i3GEO.barraDeBotoes.ativaIcone("pan");}
}

/*
Section: legenda
*/
/*
Function: abreCor

Abre a paleta de cores

Parameters:

janela - id da janela que disparou a janela de cores

elemento - elemento da janela que receberá os valores de cor selecionada
*/
function abreCor(janela,elemento)
{i3GEO.janela.cria("400","240",i3GEO.configura.locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento,"","","Cor","i3geo_janelaCor",true);}
/*
Function: abreSistema

Abre em uma janela o programa escolhido pelo usuário e definido no menu de sistemas.

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
Section: navegação
*/
/*
Function: ativaHistoricoZoom
	
Insere na interface a opção para mostrar o zoom anterior ou o próximo.

Parameters:

iddiv - id do elemento HTML que receberá os ícones
*/	
function ativaHistoricoZoom(iddiv)
{
	if($i(iddiv))
	{
		marcadorZoom = "";
		var ins = "<table style='text-align:center;position:relative;left:";
		if(navm){ins += "0px;'>";}
		else
		{ins += "6px;'>";}
		ins += "<tr><td><img  id='i3geo_zoomanterior' class='zoomAnterior' title='anterior' src='"+i3GEO.util.$im("branco.gif")+"'  /></td>";
		ins += "<td>&nbsp;</td>";
		ins += "<td><img  id='i3geo_zoomproximo' class='zoomProximo' title='proximo' src='"+i3GEO.util.$im("branco.gif")+"'  /></td>";
		ins += "</tr></table>";
		$i(iddiv).innerHTML = ins;
		$i("i3geo_zoomanterior").onclick = function(){
			if(marcadorZoom == ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
			if(i3GEO.gadgets.quadros.quadroatual > 0){
				marcadorZoom = marcadorZoom - 1;
				if(marcadorZoom >= 0)
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);
				else
				marcadorZoom = 0;
			}
		};
		$i("i3geo_zoomproximo").onclick = function(){
			if(marcadorZoom == ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
			if(i3GEO.gadgets.quadros.quadroatual < i3GEO.gadgets.quadros.quadrosfilme.length){
				marcadorZoom = marcadorZoom + 1
				if(marcadorZoom < i3GEO.gadgets.quadros.quadrosfilme.length)
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);
			}
			else
			marcadorZoom = i3GEO.gadgets.quadros.quadrosfilme.length;
		};
	}
}
/*
Section: outros
*/

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
		i3GEO.barraDeBotoes.ativaIcone("textofid");
		//pontosdistobj = new pontosdist();
		g_tipoacao = "textofid";
		wdocaf("360px","250px",i3GEO.configura.locaplic+"/ferramentas/inseretxt/index.htm","","","Texto");
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueInseretoponimo()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("cliqueInseretoponimo()");}
	}
	//else
	//{i3GEO.barraDeBotoes.ativaIcone("pan");}
}
//testa se esse script foi carregado
function testaferramentas()
{}
