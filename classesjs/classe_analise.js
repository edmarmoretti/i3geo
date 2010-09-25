/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Análise geográfica

Arquivo:

i3geo/classesjs/classe_analise.js

Licenca:

GPL2

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
	i3GEO = [];
}
/*
Classe: i3GEO.analise

Funções de geração das análises e abertura dos diálogos das opções de análise espacial

Em i3GEO.analise.dialogo estão as funções de abertura dos diálogos
*/
i3GEO.analise = {
	/*
	Classe: i3GEO.analise.dialogo
	
	Abre as telas de diálogo das opções de análise
	
	Exemplo:

	Para abrir a mensagem de diálogo de geração de buffer, utilize
	
	i3GEO.analise.dialogo.buffer()
	*/
	dialogo:{
		/*
		Function: graficoInterativo

		Abre a janela de diálogo da ferramenta graficointerativo
		*/
		graficoInterativo: function(){
			if(typeof(i3GEOF.graficointerativo) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.graficoInterativo()","graficointerativo","graficointerativo");}
		},
		/*
		Function: linhaDoTempo

		Abre a janela de diálogo da ferramenta linhadotempo
		*/
		linhaDoTempo: function(){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.analise.dialogo.linhaDoTempo()");}
			i3GEO.janela.cria("450px","300px",i3GEO.configura.locaplic+"/ferramentas/linhadotempo/index.php","","","Linha do tempo <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=88' >&nbsp;&nbsp;&nbsp;</a>");
			atualizaLinhaDoTempo = function(){
				var doc;
				try{
					if (navn){
						if ($i("wdocai"))
						{doc = $i("wdocai").contentDocument;}
					}
					else{
						if(document.frames("wdocai"))
						{doc = document.frames("wdocai").document;}
					}
					if(doc.getElementById("tl"))
					{window.parent.wdocai.carregaDados();}
					else{
						i3GEO.eventos.NAVEGAMAPA.remove("atualizaLinhaDoTempo()");
					}
				}
				catch(e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaLinhaDoTempo()");
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
			};		
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaLinhaDoTempo()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("atualizaLinhaDoTempo()");}
		},
		/*
		Function: gradePontos

		Abre a janela de diálogo da ferramenta gradepontos
		*/
		gradePontos: function(){
			if(typeof(i3GEOF.gradeDePontos) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.gradePontos()","gradepontos","gradeDePontos");}
		},
		/*
		Function: gradePol

		Abre a janela de diálogo da ferramenta gradepol
		*/
		gradePol: function(){
			if(typeof(i3GEOF.gradeDePontos) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.gradePol()","gradepol","gradeDePoligonos");}
		},
		/*
		Function: gradeHex

		Abre a janela de diálogo da ferramenta gradehex
		*/
		gradeHex: function(){
			if(typeof(i3GEOF.gradeDeHex) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.gradeHex()","gradehex","gradeDeHex");}
		},
		/*
		Function: analisaGeometrias

		Abre a janela de diálogo da ferramenta analisageometrias
		*/
		analisaGeometrias: function(){
			if(typeof(i3GEOF.analisaGeometrias) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.analisaGeometrias()","analisageometrias","analisaGeometrias");}
		},
		/*
		Function: pontosdistri

		Abre a janela de diálogo da ferramenta pontosdistri
		*/
		pontosdistri: function(){
			if (i3GEO.parametros.r == "nao")
			{alert("Opção não disponível");}
			else{
				if(typeof(i3GEOF.pontosDistri) === 'undefined')
				{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.pontosdistri()","pontosdistri","pontosDistri");}
			}
		},
		/*
		Function: pontoempoligono

		Abre a janela de diálogo da ferramenta pontoempoligono
		*/
		pontoempoligono: function(){
			if(typeof(i3GEOF.pontoEmPoligono) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.pontoempoligono()","pontoempoligono","pontoEmPoligono");}
		},
		/*
		Function: nptPol

		Abre a janela de diálogo da ferramenta nptpol
		*/
		nptPol: function(){
			if(typeof(i3GEOF.nptpol) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.nptPol()","nptpol","nptpol");}
		},
		/*
		Function: buffer

		Abre a janela de diálogo da ferramenta buffer
		*/
		buffer: function(){
			if(typeof(i3GEOF.buffer) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.buffer()","buffer","buffer");}
		},
		/*
		Function: distanciaptpt

		Abre a janela de diálogo da ferramenta distanciaptpt
		*/
		distanciaptpt: function(){
			if(typeof(i3GEOF.distanciaptpt) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.distanciaptpt()","distanciaptpt","distanciaptpt");}
		},
		/*
		Function: centroide

		Abre a janela de diálogo da ferramenta centroide
		*/
		centroide: function(){
			if(typeof(i3GEOF.centroide) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.centroide()","centroide","centroide");}
		},
		/*
		Function: dissolve

		Abre a janela de diálogo da ferramenta dissolve
		*/
		dissolve: function(){
			if(typeof(i3GEOF.dissolve) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.dissolve()","dissolve","dissolve");}
		},
		/*
		Function: agrupaElementos

		Abre a janela de diálogo da ferramenta agrupaelementos
		*/
		agrupaElementos: function(){
			if(typeof(i3GEOF.agrupaElementos) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.agrupaElementos()","agrupaelementos","agrupaElementos");}
		}
	},
	/*
	Classe: i3GEO.analise.medeDistancia
	
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
			if(typeof(console) !== 'undefined'){console.info("i3GEO.analise.medeDistancia.inicia()");}
			pontosdistobj = {
				xpt: [],
				ypt: [],
				dist: [],
				distV: [],
				xtela: [],
				ytela: [],
				ximg: [],
				yimg: [],
				linhas: []
			};
			i3GEO.analise.medeDistancia.criaJanela();
			if (g_tipoacao != "mede"){
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeDistancia.clique()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeDistancia.clique()");}
				if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeDistancia.movimento()") < 0)
				{i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeDistancia.movimento()");}
				$i("mostradistancia").style.display="block";
				if(i3GEO.Interface.ATUAL != "googleearth"){
					i3GEO.desenho.criaContainerRichdraw();
					i3GEO.desenho.richdraw.lineColor = "black";
					i3GEO.desenho.richdraw.lineWidth = "1px";
				}
				g_tipoacao = "mede";
			}
			else{
				if(i3GEO.Interface.ATUAL != "googleearth")
				{i3GEO.desenho.richdraw.fecha();}
				if($i("mostradistancia")){$i("mostradistancia").style.display="none";}
				if($i("pontosins")){$i("pontosins").style.display="none";}
			}	
		},
		/*
		Function: criaJanela
		
		Cria a janela para mostrar os resultados da medição
		*/
		criaJanela: function(){
			var novoel,ins,imagemxy;
			if (!$i("mostradistancia")){
				novoel = document.createElement("div");
				novoel.id = "mostradistancia";
				ins = '<div class="hd" >&nbsp;  <a class=ajuda_usuario target=_blank href="'+i3GEO.configura.locaplic+'/ajuda_usuario.php?idcategoria=6&idajuda=50" >&nbsp;&nbsp;&nbsp;</a></div>';
				ins += '<div class="bd" style="text-align:left;padding:3px;" >';
				ins += '<div style="text-align:left;padding:3px;" id="mostradistancia_calculo" ></div>';
				ins += '<div style="text-align:left;font-size:10px" >';
				ins += "<span style='color:navy;cursor:pointer;text-align:left;' >";
				ins += "<table><tr><td><input style='cursor:pointer' type='checkbox' id='pararraios' checked /></td><td>Raios</td><td>&nbsp;</td>";
				
				if(i3GEO.Interface.ATUAL !== "googleearth"){
					ins += "<td>";
					ins += "<input style='cursor:pointer' type='checkbox' id='parartextos' checked />";
					ins += "</td><td>Textos<td>";
				}
				ins += "</tr></table></span>";
				ins += '</div>';
				ins += '</div>';
				//ins += "<a href='http://www.movable-type.co.uk/scripts/latlong.html' target='_blank'>sobre o cálculo</a>";
				novoel.innerHTML = ins;
				novoel.style.borderColor="gray";
				document.body.appendChild(novoel);
			}
			else{
				if ($i("mostradistancia_calculo"))
				{$i("mostradistancia_calculo").innerHTML = "";}
			}
			YAHOO.namespace("janelaDocamede.xp");
			YAHOO.janelaDocamede.xp.panel = new YAHOO.widget.Panel("mostradistancia", {width:300,fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
			YAHOO.janelaDocamede.xp.panel.render();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			YAHOO.janelaDocamede.xp.panel.moveTo(imagemxy[0]+150,imagemxy[1]);
			YAHOO.util.Event.addListener(YAHOO.janelaDocamede.xp.panel.close, "click", i3GEO.analise.medeDistancia.fechaJanela);
		},
		/*
		Function: fechaJanela
		
		Fecha a janela e os elementos gráficos criados para a ferramenta de medição
		*/
		fechaJanela: function(){
			if(i3GEO.Interface.ATUAL != "googleearth")
			{i3GEO.desenho.richdraw.fecha();}
			else
			{i3GEO.Interface.googleearth.removePlacemark("divGeometriasTemp");}
			if($i("pontosins")){document.body.removeChild($i("pontosins"));}
			YAHOO.util.Event.removeListener(YAHOO.janelaDocamede.xp.panel.close, "click");
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.analise.medeDistancia.clique()");
			i3GEO.eventos.MOUSEMOVE.remove("i3GEO.analise.medeDistancia.movimento()");
			if($i("mostradistancia_c")){document.body.removeChild($i("mostradistancia_c"));}
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		/*
		Function: clique
		
		Adiciona uma marca na tela e realiza o cálculo de distância dos pontos inseridos
		*/
		clique: function(){
			var n,d,decimal,dd,dV;
			if (g_tipoacao == "mede"){
				n = pontosdistobj.xpt.length;
				pontosdistobj.xpt[n] = objposicaocursor.ddx;
				pontosdistobj.ypt[n] = objposicaocursor.ddy;
				pontosdistobj.xtela[n] = objposicaocursor.telax;
				pontosdistobj.ytela[n] = objposicaocursor.telay;
				pontosdistobj.ximg[n] = objposicaocursor.imgx;
				pontosdistobj.yimg[n] = objposicaocursor.imgy;
				pontosdistobj.dist[n] = 0;
				//cria a linha que será utilizada para seguir a posição do mouse e o último ponto
				if(i3GEO.Interface.ATUAL === "padrao" || i3GEO.Interface.ATUAL === "openlayers"  || i3GEO.Interface.ATUAL === "googlemaps"){
					try{
						if (navn)
						{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1),(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1));}
					}
					catch(e){
						if(typeof(console) !== 'undefined'){console.error("i3GEO.desenho.richdraw "+e);}
					}
				}
				if (n > 0){
					d = i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
					decimal = 0;
					d = d + "";
					d = d.split(".");
					decimal = d[1].substr(0,5);
					d = d[0]+"."+decimal;
					d = d * 1;
					pontosdistobj.dist[n] = d + pontosdistobj.dist[n-1];
					if(navm)
					{i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n-1],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n]);}
					if($i("pararraios") && $i("pararraios").checked === true ){
						if(i3GEO.Interface.ATUAL === "padrao"  || i3GEO.Interface.ATUAL === "openlayers"  || i3GEO.Interface.ATUAL === "googlemaps"){
							i3GEO.desenho.aplica("insereCirculo","",n);
						}
						if(i3GEO.Interface.ATUAL === "googleearth"){
							dd = Math.sqrt(((Math.pow((pontosdistobj.xpt[n] - pontosdistobj.xpt[n-1]),2)) + (Math.pow((pontosdistobj.ypt[n] - pontosdistobj.ypt[n-1]),2)) ));
							i3GEO.Interface.googleearth.insereCirculo(pontosdistobj.xpt[n],pontosdistobj.ypt[n],dd,"divGeometriasTemp");
						}
					}
					if($i("parartextos") && $i("parartextos").checked === true ){
						if(i3GEO.Interface.ATUAL === "padrao"  || i3GEO.Interface.ATUAL === "openlayers"  || i3GEO.Interface.ATUAL === "googlemaps"){
							i3GEO.desenho.aplica("insereTexto","",n,d+" km");
						}
					}
					//cria a linha ligando os dois últimos pontos
					if(i3GEO.Interface.ATUAL === "googleearth"){
						i3GEO.Interface.googleearth.insereLinha(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],pontosdistobj.xpt[n],pontosdistobj.ypt[n],"divGeometriasTemp");
					}
				}
				if(i3GEO.Interface.ATUAL === "padrao" || i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps")
				{i3GEO.util.insereMarca.cria(objposicaocursor.imgx,objposicaocursor.imgy,i3GEO.analise.medeDistancia.fechaJanela,"divGeometriasTemp");}
				if(i3GEO.Interface.ATUAL === "googleearth")
				{i3GEO.util.insereMarca.cria(objposicaocursor.ddx,objposicaocursor.ddy,i3GEO.analise.medeDistancia.fechaJanela,"divGeometriasTemp","");}
			}
		},
		/*
		Function: movimento
		
		Realiza os cálculos e desenho da linha conforme o usuário movimenta o mouse
		*/
		movimento: function(){
			var n,d,r,decimal,da,mostra,texto;
			if (g_tipoacao == "mede"){
				if($i("mostradistancia"))
				{$i("mostradistancia").style.display="block";}
				n = pontosdistobj.xpt.length;
				try{
					if (n > 0){
						d = i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
						r = i3GEO.calculo.direcao(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);
						r = i3GEO.calculo.dd2dms(r,r);
						r = r[0];
						
						d = d + "";
						d = d.split(".");
						decimal = d[1].substr(0,5);
						d = d[0]+"."+decimal;
						d = d * 1;
						da = d + pontosdistobj.dist[n-1];
						da = da + "";
						da = da.split(".");
						decimal = da[1].substr(0,5);
						da = da[0]+"."+decimal;
						da = da * 1;
						
						mostra = $i("mostradistancia_calculo");
						if (mostra){
							texto = " Dist acum.= "+da+" km <br>atual= "+d+" km <br> Direção (DMS)= "+r;
							texto += "<br>Método cálculo de distâncias: "+i3GEO.calculo.metododistancia;
							mostra.innerHTML = texto;
						}
						if(i3GEO.Interface.ATUAL != "googleearth")
						{i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);}
					}
				}
				catch(e){}
			}
		}
	},
	/*
	Classe: i3GEO.analise.medeArea
	
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
			if(typeof(console) !== 'undefined'){console.info("i3GEO.analise.medeArea.inicia()");}
			var temp,x,y,ll1,ll2,d,
				montacontainer = function(){
					$i("mostraarea_calculo").innerHTML = "Clique no mapa para desenhar o poligono. Clique duas vezes para concluir";
					i3GEO.barraDeBotoes.ativaIcone("area");
					g_tipoacao = "area";
					i3GEO.desenho.criaContainerRichdraw();
					i3GEO.desenho.richdraw.lineColor = "green";
					i3GEO.desenho.richdraw.lineWidth = "2px";				
				};
			pontosdistobj = {
				xpt: [],
				ypt: [],
				dist: [],
				xtela: [],
				ytela: [],
				ximg: [],
				yimg: [],
				linhas: []
			};
			i3GEO.analise.medeArea.criaJanela();
			if (g_tipoacao != "area"){
				$i("mostraarea_calculo").innerHTML = "";
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeArea.clique()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeArea.clique()");}
				if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeArea.movimento()") < 0)
				{i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeArea.movimento()");}		
				YAHOO.util.Event.addListener(YAHOO.janelaDocaarea.xp.panel.close, "click", i3GEO.analise.medeArea.fechaJanela);
				//
				//é necessário pegar a resolução de cada pixel do servidor
				//via mapscript
				//
				if(i3GEO.Interface.ATUAL == "padrao"){
					temp = function(retorno){
						i3GEO.janela.fechaAguarde("i3GEO.atualiza");
						g_areapixel = retorno.data;
						if (g_areapixel < 0)
						{alert("Nao e possivel calcular a area. Entre em contato com o administrador do sistema.");}
						else{
							montacontainer();
						}
					};
					i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
					i3GEO.php.areaPixel(temp,i3GEO.parametros.pixelsize);
				}
				//
				//a API do Openlayers e GoogleMaps tem uma função própria de obtenção da resolução de cada pixel
				//essa função é embutida em i3GEO.calculo.tela2dd
				//
				if(i3GEO.Interface.ATUAL == "googlemaps" || i3GEO.Interface.ATUAL == "openlayers"){
					x = parseInt(i3GEO.parametros.w / 2,10);
					y = parseInt(i3GEO.parametros.h / 2,10);
					ll1 = i3GEO.calculo.tela2dd(x,y,"","");
					ll2 = i3GEO.calculo.tela2dd(x + 1,y,"","");
					d = i3GEO.calculo.distancia(ll1[0],ll1[1],ll2[0],ll2[1]);
					d = d * 1000;
					g_areapixel = d * d;
					if (g_areapixel < 0)
					{alert("Nao e possivel calcular a area. Entre em contato com o administrador do sistema.");}
					else{
						montacontainer();				
					}
				}
			}
			else{i3GEO.desenho.richdraw.fecha();}
		},
		/*
		Function: criaJanela
		
		Cria a janela para mostrar os resultados da medição
		*/
		criaJanela: function(){
			var novoel,ins,imagemxy;
			if (!$i("mostraarea")){
				novoel = document.createElement("div");
				novoel.id = "mostraarea";
				ins = "<div class='hd' >&Aacute;rea aproximada <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=6&idajuda=51' >&nbsp;&nbsp;&nbsp;</a></div>";
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
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			YAHOO.janelaDocaarea.xp.panel.moveTo(imagemxy[0]+150,imagemxy[1]);
			YAHOO.util.Event.addListener(YAHOO.janelaDocaarea.xp.panel.close, "click", i3GEO.analise.medeArea.fechaJanela);
		},
		/*
		Function: fechaJanela
		
		Fecha a janela e os elementos gráficos criados para a ferramenta de medição
		*/
		fechaJanela: function(){
			i3GEO.desenho.richdraw.fecha();
			if($i("pontosArea")){document.body.removeChild($i("pontosArea"));}
			YAHOO.util.Event.removeListener(YAHOO.janelaDocaarea.xp.panel.close, "click");
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.analise.medeArea.clique()");
			i3GEO.eventos.MOUSEMOVE.remove("i3GEO.analise.medeArea.movimento()");
			if($i("mostraarea_c")){document.body.removeChild($i("mostraarea_c"));}
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		/*
		Function: clique
		
		Adiciona uma marca na tela e realiza o cálculo de distância dos pontos inseridos
		*/
		clique: function(){
			var n,m;
			if (g_tipoacao == "area"){
				n = pontosdistobj.xpt.length;
				pontosdistobj.xpt[n] = objposicaocursor.ddx;
				pontosdistobj.ypt[n] = objposicaocursor.ddy;
				pontosdistobj.xtela[n] = objposicaocursor.telax;
				pontosdistobj.ytela[n] = objposicaocursor.telay;
				pontosdistobj.ximg[n] = objposicaocursor.imgx;
				pontosdistobj.yimg[n] = objposicaocursor.imgy;
				pontosdistobj.dist[n] = 0;
				//inclui a linha para ligar com o ponto inicial
				if (n === 0){
					try	{
						if (navn)
						{pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[0]-1,pontosdistobj.yimg[0]-1);}
					}
					catch(e){
						if(typeof(console) !== 'undefined'){console.error(e);}
					}
				}
				else{
					if(navm)
					{i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n-1],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n]);}				
				}
				try{
					if (navn)
					{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1);}
				}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}

				m = i3GEO.calculo.area(pontosdistobj,g_areapixel);
				if($i("mostraarea_calculo"))
				{$i("mostraarea_calculo").innerHTML = "<br>m2</b>= "+m.toFixed(2)+"<br><b>km2</b>= "+(m/1000000).toFixed(2)+"<br><b>ha</b>= "+(m/10000).toFixed(2);}
				if(i3GEO.Interface.ATUAL === "padrao" || i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps")
				{i3GEO.util.insereMarca.cria(objposicaocursor.imgx,objposicaocursor.imgy,i3GEO.analise.medeArea.fechaJanela,"divGeometriasTemp");}
				if(i3GEO.Interface.ATUAL === "googleearth")
				{i3GEO.util.insereMarca.cria(objposicaocursor.ddx,objposicaocursor.ddy,i3GEO.analise.medeArea.fechaJanela,"divGeometriasTemp","");}
			}
		},
		/*
		Function: movimento
		
		Realiza o desenho do poligono conforme o usuário movimenta o mouse
		*/
		movimento: function(){
			var n,d,decimal,da,m;
			if (g_tipoacao == "area"){
				n = pontosdistobj.xpt.length;
				if (n > 0){
					i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhastemp,1);
					i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);
				}
			}
		}
	}
};
//YAHOO.log("carregou classe analise", "Classes i3geo");