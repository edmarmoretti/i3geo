/*
Title: Seleção de elementos

File: i3geo/classesjs/classe_selecao.js

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
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
/*
Class: i3GEO.selecao

Realiza operações de seleção de elementos do mapa
*/
i3GEO.selecao = {
	/*
	Function: porxy
	
	Executa a seleção de elementos de um tema com base em um par de coordenadas xy
	
	Parameters:
	
	tema {String} - código do tema
	
	tipo {String} - tipo de operação adiciona|retira
	
	tolerancia {Integer} - tolerância de busca
	*/
	porxy: function(tema,tipo,tolerancia){
		var retorna = function(retorno)
		{ajaxredesenha(retorno);};
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		i3GEO.php.selecaopt(retorna,tema,objposicaocursor.ddx+" "+objposicaocursor.ddy,tipo,tolerancia);
	},
	/*
	Function: porbox
	
	Seleciona elementos de um tema com base em um retângulo
	
	Parameters:
	
	tema {String} - código do tema
	
	tipo {String} - tipo de operação adiciona|retira
	
	box {String} - xmin ymin xmax ymax
	*/
	porbox: function(tema,tipo,box){
		var retorna = function(retorno)
		{ajaxredesenha(retorno);};
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		i3GEO.php.selecaobox(retorna,tema,tipo,box);
	},
	/*
	Function: janelaOpcoes
	
	Abre a janela de opções da ferramenta de seleção.
	
	A janela terá como id "wdocai"
	*/
	janelaOpcoes: function(){
		g_tipoacao = "selecao";
		objmapa.temaAtivo = "";
		var janela = i3GEO.janela.cria("430px","320px",i3GEO.configura.locaplic+'/ferramentas/selecao/index.htm',"","","Sele&ccedil;&atilde;o");
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.selecao.clique()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.selecao.clique()");}
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.selecao.atualizaGrafico()") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.selecao.atualizaGrafico()");}

		var temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.selecao.clique()");
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.selecao.atualizaGrafico()");
			try{
				i3GEO.desenho.richdraw.fecha();
			}
			catch(e){}
			if($i("pontosins")){document.body.removeChild($i("pontosins"));}
			i3GEO.barraDeBotoes.ativaBotoes();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: atualizaGrafico
	
	Atualiza o gráfico de barras da ferramenta de seleção
	
	O gráfico é atualizado sempre que ocorrer uma nova seleção no mapa, o que implica no redesnho do mapa e
	disparo do evento NAVEGAMAPA
	*/
	atualizaGrafico: function(){
		if(g_tipoacao == "selecao"){
			var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			if(doc.getElementById("guia5obj")){
				if(doc.getElementById("guia5obj").style.display=="block"){
					if(window.parent.frames["wdocai"].atualizaGrafico)
					{window.parent.frames["wdocai"].atualizaGrafico();}
				}
			}
		}		
	},
	/*
	Function: clique
	
	Seleciona elementos clicando no mapa
	*/
	clique: function(){
		if (g_tipoacao == "selecao"){
			var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			var tipo = "adiciona";
			//pega o tipo de operacao da janela de selecao
			if (doc.getElementById("tipoOperacao")){var tipo = doc.getElementById("tipoOperacao").value;}
			if (objmapa.temaAtivo == ""){alert("Nenhum tema ativo");return;}
			var tolerancia = doc.getElementById("toleranciapt").value;
			//se tipo for limpa ou inverte, a operacao nao e executada no clique no mapa
			if ((tipo != "limpa") && (tipo != "inverte"))
			{i3GEO.selecao.porxy(objmapa.temaAtivo,tipo,tolerancia);}
		}
	},
	/*
	Class: i3GEO.selecao.box
	
	Controla o desenho do box para a seleção e executa a função de seleção
	*/
	box: {
		/*
		Function: inicia
		
		Marca o início do desenho do box, capturando a posição do mouse
		*/
		inicia: function(){
			if(g_tipoacao!='selecaobox'){return;}
			if(!$i("i3geoboxSel"))
			i3GEO.selecao.box.criaBox();
			var i = $i("i3geoboxSel").style;
			i.width=0;
			i.height=0;
			i.visibility="visible";
			i.display="block";
			i.left = objposicaocursor.telax + g_postpx;
			i.top = objposicaocursor.telay + g_postpx;
			boxxini = objposicaocursor.telax;
			boxyini = objposicaocursor.telay;
			tamanhox = 0;
			tamanhoy = 0;
			if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.selecao.box.desloca()") < 0)
			{i3GEO.eventos.MOUSEMOVE.push("i3GEO.selecao.box.desloca()");}
			if(i3GEO.eventos.MOUSEUP.toString().search("i3GEO.selecao.box.termina()") < 0)
			{i3GEO.eventos.MOUSEUP.push("i3GEO.selecao.box.termina()");}
		},
		/*
		Function: criaBox
		
		Cria o DIV que será utilizado para desenhar o box no mapa
		*/
		criaBox: function(){
			if(!$i("i3geoboxSel")){
				var novoel = document.createElement("div");
				novoel.style.width = "0px";
				novoel.style.height = "0px";
				novoel.id = "i3geoboxSel";
				novoel.style.display = "none";
				novoel.style.fontSize = "0px";
				if(navn)
				{novoel.style.opacity = .25;}
				novoel.style.backgroundColor = "yellow";
				novoel.style.position="absolute";
				novoel.style.border = "2px solid #ff0000";		
				if (navm)
				{novoel.style.filter = "alpha(opacity=25)";}
				novoel.onmousemove = function(){
					var b = $i("i3geoboxSel").style;
					var wb = parseInt(b.width);
					var hb = parseInt(b.height);
					if (navm){
						if(wb > 2)
						{b.width = wb - 2;}
						if(hb > 2)
						{b.height = hb - 2;}
					}
					else{
						b.width = wb - 2 + "px";
						b.height = hb - 2 + "px";
					}
				};
				novoel.onmouseup = function(){i3GEO.selecao.box.termina()};
				document.body.appendChild(novoel);
			}
			i3GEO.util.mudaCursor(i3GEO.configura.cursores,"zoom","i3geoboxSel",i3GEO.configura.locaplic);
			if($i("img")){
				$i("img").title = "";
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"zoom","img",i3GEO.configura.locaplic);
			}
		},
		/*
		Function: desloca
		
		Desloca o box conforme o mouse é movimentado
		*/
		desloca: function(){
			if(g_tipoacao!='selecaobox'){return;}
			var bxs = $i("i3geoboxSel").style;
			if(bxs.display != "block"){return;}
			ppx = objposicaocursor.telax;
			py = objposicaocursor.telay;
			if (navm){
				if ((ppx > boxxini) && ((ppx - boxxini - 2) > 0))
				{bxs.width = ppx - boxxini - 2;}
				if ((py > boxyini) && ((py - boxyini - 2) > 0))
				{bxs.height = py - boxyini - 2;}
				if (ppx < boxxini)
				{bxs.left = ppx;bxs.width = boxxini - ppx + 2;}
				if (py < boxyini)
				{bxs.top = py;bxs.height = boxyini - py + 2;}
			}
			else{
				if (ppx > boxxini)
				{bxs.width = ppx - boxxini + "px";}
				if (py > boxyini)
				{bxs.height = py - boxyini + "px";}
				if (ppx < boxxini)
				{bxs.left = ppx + "px";bxs.width = boxxini - ppx + "px";}
				if (py < boxyini)
				{bxs.top = py + "px";bxs.height = boxyini - py + "px";}
			}
		},
		/*
		Function: termina
		
		Para o desenho do box, captura seu tamanho e faz o zoom no mapa
		*/
		termina: function(){
			if(g_tipoacao!='selecaobox'){return;}
			try{
				var valor = i3GEO.calculo.rect2ext("i3geoboxSel",objmapa.extent,g_celula);
				var v = valor[0];
				var x1 = valor[1];
				var y1 = valor[2];
				var x2 = valor[3];
				var y2 = valor[4];
				var limpa = function(){
					var bxs = $i("i3geoboxSel").style;
					bxs.display="none";
					bxs.visibility="hidden";
					bxs.width = 0;
					bxs.height = 0;
				};
				if((x1 == x2) || (y1 == y2))
				{limpa.call();return;}
				// se o retangulo for negativo pula essa parte para nï¿½ gerar erro
				objmapa.extent=v;
				limpa.call();
				i3GEO.eventos.MOUSEMOVE.remove("i3GEO.selecao.box.desloca()");
				i3GEO.eventos.MOUSEUP.remove("i3GEO.selecao.box.termina()");

				var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
				var tipo = "adiciona";
				//pega o tipo de operacao da janela de selecao
				if (doc.getElementById("tipoOperacao")){var tipo = doc.getElementById("tipoOperacao").value;}

				if ((tipo != "limpa") && (tipo != "inverte"))
				{i3GEO.selecao.porbox(objmapa.temaAtivo,tipo,v);}
			}
			catch(e){limpa.call();return;}
		}
	},
	/*
	Class: i3GEO.selecao.poligono
	
	Realiza a seleção desenhando um polígono no mapa
	*/
	poligono:{
		/*
		Function: inicia
		
		Inicia o desenho do polígono
		*/
		inicia: function(){
			try{i3GEO.desenho.richdraw.fecha()}catch(e){}
			i3GEO.util.insereMarca.limpa()
			g_tipoacao = "selecaopoli";
			alert("Clique no mapa para desenhar o polígono.")
			i3GEO.desenho.criaContainerRichdraw();
			i3GEO.desenho.richdraw.lineColor = "red";
			i3GEO.desenho.richdraw.lineWidth = "2px";
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.selecao.clique()");
			if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.selecao.poligono.move()") < 0)
			{i3GEO.eventos.MOUSEMOVE.push("i3GEO.selecao.poligono.move()");}
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.selecao.poligono.clique()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.selecao.poligono.clique()");}
		},
		/*
		Function: move
		
		Modifica o polígono conforme o usuário cria vértices
		*/
		move: function(){
			if (g_tipoacao == "selecaopoli"){
				var n = pontosdistobj.xpt.length;
				if (n > 0){
					var d = i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
					if (objmapa.scale > 500000)
					{var d = parseInt(d);}
					else{
						d= d + "";
						d = d.split(".");
						var decimal = d[1].substr(0,3);
						d = d[0]+"."+decimal;
						d = d * 1;
					}
					var da = d + pontosdistobj.dist[n-1];
					if(navn){i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhastemp,0);}
					i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhas[n-1],n);
				}
			}
		},
		/*
		Function: clique
		
		Inclui um novo vértice no polígono
		*/
		clique: function(){
			if (g_tipoacao != "selecaopoli"){return;}
			var n = pontosdistobj.xpt.length;
			pontosdistobj.xpt[n] = objposicaocursor.ddx;
			pontosdistobj.ypt[n] = objposicaocursor.ddy;
			pontosdistobj.xtela[n] = objposicaocursor.telax;
			pontosdistobj.ytela[n] = objposicaocursor.telay;
			pontosdistobj.ximg[n] = objposicaocursor.imgx;
			pontosdistobj.yimg[n] = objposicaocursor.imgy;
			pontosdistobj.dist[n] = 0;
			//inclui a linha para ligar com o ponto inicial
			if (n == 0){
				try{
					if (navn){
						pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[0]-1,pontosdistobj.yimg[0]-1);
					}
					else{
						pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[0])-(objmapa.w/2),pontosdistobj.yimg[0]);	
					}				
				}
				catch(e){}
			}
			try{
				if (navn){
					pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n],pontosdistobj.yimg[n],pontosdistobj.ximg[n],pontosdistobj.yimg[n]);
				}
				else{
					pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);
				}				
			}
			catch(e){}
			if (n > 0){
				var d = parseInt(i3GEO.util.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));
				pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
			}
			i3GEO.util.insereMarca.cria(objposicaocursor.telax,objposicaocursor.telay,i3GEO.selecao.poligono.termina,"pontospoli");
		},
		/*
		Function: termina
		
		Termina o desenho do polígono e executa a operação de seleção
		*/
		termina: function(){
			var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			var pontos = pontosdistobj;
			i3GEO.desenho.richdraw.fecha();
			var n = pontos.xpt.length;
			objmapa.temaAtivo = doc.getElementById("comboTemas").value;
			var xs = pontos.xpt.toString(",");
			var ys = pontos.ypt.toString(",");
			var retorna = function(){
				i3GEO.janela.fechaAguarde("ajaxredesenha",$trad("o1"));
				ajaxredesenha("");
			};
			i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoPoli";
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_transfer_mode('POST');
			cp.set_response_type("JSON");
			cp.call(p,"selecaoPoli",retorna,xs,ys,doc.getElementById("comboTemas").value,doc.getElementById("tipoOperacao").value);
		}
	}
};
