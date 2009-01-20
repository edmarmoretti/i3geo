/*
Class:: i3GEO.analise

Funções geração e abertura dos diálogos das opções de análise espacial

Em i3GEO.analise.dialogo estão as funções de abertura dos diálogos 

File: i3geo/classesjs/classe_analise.js

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
i3GEO.analise = {
	/*
	Function: dialogo
	
	Abre as telas de diálogo das opções de análise
	*/
	dialogo:{
		/*
		Function: gradePontos

		Abre a janela que gera grade de pontos
		*/
		gradePontos: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradepontos/index.htm","","","Grade de pontos");},
		/*
		Function: gradePoligonos

		Abre a janela que gera grade de poligonos
		*/
		gradePol: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradepol/index.htm","","","Grade de pol&iacute;gonos");},
		/*
		Function: gradeHex

		Abre a janela que gera grade de hexágonos
		*/
		gradeHex: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradehex/index.htm","","","Grade de hex&aacute;gonos");},
		/*
		Function: analisaGeometrias

		Abre a janela com o sistema de análise de geometrias
		*/
		analisaGeometrias: function(){
			g_tipoacao = "selecao";
			objmapa.temaAtivo = "";
			i3GEO.janela.cria("500px","400px",i3GEO.configura.locaplic+'/ferramentas/analisageometrias/index.htm',"","","Sele&ccedil;&atilde;o");
		},
		/*
		Function: pontosdistri

		Abre a janela para executar análises de distribuição de pontos
		*/
		pontosdistri: function(){
			//a variável g_r indica se o R está instalado no servidor e é definida na inicialização do I3Geo
			if (g_r == "nao")
			{alert("Opção não disponível");}
			else
			{i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/pontosdistri/index.htm","","","Distribui&ccedil;&atilde;o de pontos");}
		},
		/*
		Function: pontoempoligono

		Abre a janela para cruzar um tema de pontos com um ou mais temas poligonais e gerar um novo tema
		*/
		pontoempoligono: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/index.htm","","","Ponto em pol&iacute;gono");},
		/*
		Function: nptPol

		Abre a janela para cruzar um tema de pontos com um ou tema poligona e gerar um novo tema com o número de pontos em cada polígono
		*/
		nptPol: function()
		{i3GEO.janela.cria("400px","200px",i3GEO.configura.locaplic+"/ferramentas/nptpol/index.htm","","","Pontos por pol&iacute;gono");},
		/*
		Function: buffer

		Gera um buffer em elementos selecionados
		*/
		buffer: function()
		{i3GEO.janela.cria("400px","180px",i3GEO.configura.locaplic+"/ferramentas/buffer/index.htm","","","Entorno");},
		/*
		Function: distanciaptpt

		Abre a janela para calcular a distância entre um ponto e outros pontos próximos
		*/
		distanciaptpt: function()
		{i3GEO.janela.cria("400px","220px",i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/index.htm","","","Dist&acirc;ncia");},
		/*
		Function: centroide

		Abre a janela que gera um tema com os centroides dos elementos selecionados
		*/
		centroide: function()
		{i3GEO.janela.cria("400px","180px",i3GEO.configura.locaplic+"/ferramentas/centroide/index.htm","","","Centróide");},
		/*
		Function: dissolve

		Abre a janela que gera um tema dissolvendo as divisas entre polígonos.
		*/
		dissolve: function()
		{i3GEO.janela.cria("400px","230px",i3GEO.configura.locaplic+"/ferramentas/dissolve/index.htm","","","Dissolve");},
		/*
		Function: agrupaElementos

		Abre a janela que gera um tema poligonal agrupando elementos de um tema.
		*/
		agrupaElementos: function()
		{i3GEO.janela.cria("400px","230px",i3GEO.configura.locaplic+"/ferramentas/agrupaelementos/index.htm","","","Agrupa");},
	},
	/*
	Function: medeDistancia
	
	Ativa e controla a opção de medição de distâncias.

	A medida é feita quando o usuário clica no mapa com esta opção ativa

	Quando o botão é acionado, abre-se a janela que mostra o resultado da medida, o ícone que segue o mouse é alterado.

	Para mostrar o resultado do cálculo, é incluído um div específico.
	*/
	medeDistancia:{
		/*
		Function: inicia
		
		Inicia a operação de medição, abrindo a janela de resultados e criando os componentes necessários
		
		São registrados os eventos de clique sobre o mapa e fechamento da janela de resultados
		*/
		inicia: function(){
			i3GEO.analise.medeDistancia.criaJanela();
			if (g_tipoacao != "mede"){
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeDistancia.clique()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeDistancia.clique()");}
				if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeDistancia.movimento()") < 0)
				{i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeDistancia.movimento()");}
				$i("mostradistancia").style.display="block";
				i3GEO.desenho.criaContainerRichdraw();
				i3GEO.desenho.richdraw.lineColor = "black";
				i3GEO.desenho.richdraw.lineWidth = "1px";
				g_tipoacao = "mede";
			}
			else{
				i3GEO.desenho.richdraw.fecha();
				if($i("mostradistancia")){$i("mostradistancia").style.display="none";}
				if($i("pontosins")){$i("pontosins").style.display="none";}
			}	
		},
		/*
		Function: criaJanela
		
		Cria a janela para mostrar os resultados da medição
		*/
		criaJanela: function(){
			if (!$i("mostradistancia")){
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
			YAHOO.namespace("janelaDocamede.xp");
			YAHOO.janelaDocamede.xp.panel = new YAHOO.widget.Panel("mostradistancia", {width:220,fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
			YAHOO.janelaDocamede.xp.panel.render();
			YAHOO.janelaDocamede.xp.panel.moveTo(imagemxi+150,imagemyi);
			YAHOO.util.Event.addListener(YAHOO.janelaDocamede.xp.panel.close, "click", i3GEO.analise.medeDistancia.fechaJanela);
		},
		/*
		Function: fechaJanela
		
		Fecha a janela e os elementos gráficos criados para a ferramenta de medição
		*/
		fechaJanela: function(){
			i3GEO.desenho.richdraw.fecha();
			if($i("pontosins")){document.body.removeChild($i("pontosins"));}
			YAHOO.util.Event.removeListener(YAHOO.janelaDocamede.xp.panel.close, "click");
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.analise.medeDistancia.clique()");
			i3GEO.eventos.MOUSEMOVE.remove("i3GEO.analise.medeDistancia.movimento()");
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		/*
		Function: clique
		
		Adiciona uma marca na tela e realiza o cálculo de distância dos pontos inseridos
		*/
		clique: function(){
			if (g_tipoacao == "mede"){
				var n = pontosdistobj.xpt.length;
				pontosdistobj.xpt[n] = objposicaocursor.ddx;
				pontosdistobj.ypt[n] = objposicaocursor.ddy;
				pontosdistobj.xtela[n] = objposicaocursor.telax;
				pontosdistobj.ytela[n] = objposicaocursor.telay;
				pontosdistobj.ximg[n] = objposicaocursor.imgx;
				pontosdistobj.yimg[n] = objposicaocursor.imgy;
				pontosdistobj.dist[n] = 0;
				try{
					if (navn)
					{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1),(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1));}
					else
					{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);}				
				}
				catch(e){window.status=n+" erro ao desenhar a linha base "+e.message;}
				if (n > 0){
					var d = parseInt(i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));
					pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
					if($i("pararraios") && $i("pararraios").checked == true ){
						i3GEO.desenho.aplica("insereCirculo","",n);
						if(navm)
						{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(objmapa.w/2),pontosdistobj.yimg[n-1],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);}
					}
				}
				i3GEO.util.insereMarca.cria(objposicaocursor.telax,objposicaocursor.telay,i3GEO.analise.medeDistancia.fechaJanela,"pontosins");
			}
		},
		/*
		Function: movimento
		
		Realiza os cálculos e desenho da linha conforme o usuário movimenta o mouse
		*/
		movimento: function(){
			if (g_tipoacao == "mede"){
				if($i("mostradistancia"))
				$i("mostradistancia").style.display="block";
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
					if ($i("mostradistancia_calculo"))
					{$i("mostradistancia_calculo").innerHTML = " Dist acum.= "+da+" atual= "+d+" km";}
					i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);
				}
			}
		}
	},
	/*
	Function: medeArea
	
	Ativa e controla a opção de medição de área.

	A medida é feita quando o usuário clica no mapa com esta opção ativa

	Quando o botão é acionado, abre-se a janela que mostra o resultado da medida, o ícone que segue o mouse é alterado.

	Para mostrar o resultado do cálculo, é incluído um div específico.
	*/
	medeArea:{
		/*
		Function: inicia
		
		Inicia a operação de medição, abrindo a janela de resultados e criando os componentes necessários
		
		São registrados os eventos de clique sobre o mapa e fechamento da janela de resultados
		*/
		inicia: function(){
			i3GEO.analise.medeArea.criaJanela();
			if (g_tipoacao != "area"){
				$i("mostraarea_calculo").innerHTML = "";
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeArea.clique()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeArea.clique()");}
				if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeArea.movimento()") < 0)
				{i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeArea.movimento()");}		
				YAHOO.util.Event.addListener(YAHOO.janelaDocaarea.xp.panel.close, "click", i3GEO.analise.medeArea.fechaJanela);
				var temp = function(retorno){
					i3GEO.janela.fechaAguarde("ajaxredesenha");
					g_areapixel = retorno.data;
					if (g_areapixel < 0)
					{alert("Nao e possivel calcular a area. Entre em contato com o administrador do sistema.");}
					else{
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
				var cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"areaPixel",temp);			
			}
			else{i3GEO.desenho.richdraw.fecha();}
		},
		/*
		Function: criaJanela
		
		Cria a janela para mostrar os resultados da medição
		*/
		criaJanela: function(){
			if (!$i("mostraarea")){
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
			YAHOO.namespace("janelaDocaarea.xp");
			YAHOO.janelaDocaarea.xp.panel = new YAHOO.widget.Panel("mostraarea", {width:220,fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
			YAHOO.janelaDocaarea.xp.panel.render();
			YAHOO.janelaDocaarea.xp.panel.moveTo(imagemxi+150,imagemyi);
		},
		/*
		Function: fechaJanela
		
		Fecha a janela e os elementos gráficos criados para a ferramenta de medição
		*/
		fechaJanela: function(){
			i3GEO.desenho.richdraw.fecha();
			if($i("pontosArea")){document.body.removeChild($i("pontosArea"));}
			i3GEO.eventos.MOUSECLIQUE.remove("cliqueArea()");
			i3GEO.eventos.MOUSEMOVE.remove("moveArea()");
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		/*
		Function: clique
		
		Adiciona uma marca na tela e realiza o cálculo de distância dos pontos inseridos
		*/
		clique: function(){
			if (g_tipoacao == "area"){
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
					try	{
						if (navn)
						{pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[0]-1,pontosdistobj.yimg[0]-1);}
						else
						{pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[0])-(objmapa.w/2),pontosdistobj.yimg[0]);	}				
					}
					catch(e){}
				}
				try{
					if (navn)
					{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1);}
					else
					{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(objmapa.w/2),pontosdistobj.yimg[n]);}				
				}
				catch(e){}
				var m = i3GEO.calculo.area(pontosdistobj,g_areapixel);
				if($i("mostraarea_calculo"))
				{$i("mostraarea_calculo").innerHTML = "<br>m2</b>= "+m+"<br><b>km2</b>= "+m/1000000+"<br><b>ha</b>= "+m/10000;}
				if (n > 3){
				//var d = parseInt(i3GEO.util.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));
				//pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
				}
				i3GEO.util.insereMarca.cria(objposicaocursor.telax,objposicaocursor.telay,i3GEO.analise.medeArea.fechaJanela,"pontosArea");
			}
		},
		/*
		Function: movimento
		
		Realiza os cálculos e desenho da linha conforme o usuário movimenta o mouse
		*/
		movimento: function(){
			if (g_tipoacao == "area"){
				var n = pontosdistobj.xpt.length;
				if (n > 0){
					//
					//conforme a escala, os dados são arredondados
					// 
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
					//
					//desenha as linhas na tela com o objeto richdraw
					//
					if(navn){i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhastemp,0);}
					i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);
				}
			}
		}
	}
};