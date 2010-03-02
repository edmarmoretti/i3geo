/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Interface

Arquivo:

i3geo/classesjs/classe_interface.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.Interface

Funcoes que controlam o comportamento específico de determinadas interfaces

As interfaces são definidas na inicialização do i3Geo, por exemplo, openlayers, flamingo,etc

A classe "interface" contém os métdos específicos utilizados nessas interfaces

Exemplo:

Para iniciar o i3geo com uma interface específica, utilize http://localhost/i3geo/ms_criamapa.php?interface=flamingo.htm
O HTML deve conter as definições da interface criada e deve estar armazenado em i3geo/aplicmap
*/
i3GEO.Interface = {
	/*
	Propriedade: OUTPUTFORMAT
	
	Formato de geração da imagem.
	
	Os formatos devem estar definidos no mapfile geral1windows.map e geral1.map. A definição dessa variável não afeta a interface padrão, que utiliza a definição que estiver ativa nos mapfiles de inicialização.
	
	Tipo:
	{MAPSERVER OUTPUTFORMAT}
	
	Default:
	{"AGG_Q"}
	*/
	OUTPUTFORMAT: "AGG_Q",
	/*
	Propriedade: BARRABOTOESTOP
	
	Distância da barra de botões em ralação ao topo do mapa.
	
	Tipo:
	{number}
	
	Default:
	{12}
	*/
	BARRABOTOESTOP: 12,
	/*
	Propriedade: BARRABOTOESLEFT
	
	Distância da barra de botões em ralação ao lado esquerdo do mapa.
	
	Tipo:
	{number}
	
	Default:
	{3}
	*/
	BARRABOTOESLEFT: 3,	

	/*
	Propriedade: ATUAL
	
	Interface atual em uso.
	
	Tipo:
	{string}
	
	Default:
	{"padrao"}
	*/
	ATUAL: "padrao",
	/*
	Propriedade: IDCORPO
	
	ID do elemento HTML que receberá o corpo do mapa
	
	Tipo:
	{string}
	
	Default:
	{"corpoMapa"}
	*/
	IDCORPO: "corpoMapa",
	/*
	Propriedade: ATIVAMENUCONTEXTO

	Indica se o menu de contexto deve ser ativado

	Tipo:
	{Boolean}

	Default:
	{true}
	*/
	ATIVAMENUCONTEXTO: false,
	/*
	Variavel: IDMAPA
	ID do elemento HTML criado para conter o mapa
	Esse elemento normalmente é criado dentro de IDCORPO dependendo da interface
	*/
	IDMAPA: "",
	/*
	Function: redesenha
	
	Aplica o método redesenha da interface atual
	*/
	redesenha: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.redesenha()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.redesenha();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.redesenha();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.redesenha();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.redesenha();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.redesenha();}
	},
	/*
	Function: cria
	
	Cria ou altera os elementos HTML necessários para a interface
	
	Essa função é executada na inicialização do i3geo
	
	Parametros:
	
	w {Integer} - largura do corpo do mapa em pixels
	
	h {Integer} - altura do corpo do mapa em pixels
	*/
	cria: function(w,h){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.cria()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.cria(w,h);}
	},
	/*
	Function: inicia
	
	Inicia a interface
	*/
	inicia: function(w,h){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.inicia()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.inicia();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.inicia();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.inicia();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.inicia();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.inicia();}
	},
	/*
	Function: ativaBotoes
	
	Ativa os botões de ferramentas
	*/
	ativaBotoes: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.ativaBotoes()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.ativaBotoes();}
	},
	/*
	Classe: i3GEO.Interface.padrao
	
	Interface padrão com motor de navegação do próprio i3Geo
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "padrao"
	*/
	padrao:{
		/*
		Propriedade: TRANSICAO
		
		Ativa ou não o modo de transição suave das imagens quando o mapa é redesenhado. 

		Default:
		true
		
		Tipo:
		{Boolean}
		*/
		TRANSICAO: false,
		redesenha:function(){
			var ndiv,i;
			if(!$i("img")){
				i3GEO.janela.fechaAguarde();
				return;
			}
			$i("img").onload =  function()
			{
				var imagem,temp;
				imagem = $i("img");
				imagem.onload = "";
				//atualiza quadro
				i3GEO.gadgets.quadros.grava("imagem",i3GEO.parametros.mapimagem);
				i3GEO.gadgets.quadros.grava("extensao",i3GEO.parametros.mapexten);
				temp = function(retorno){
					eval(retorno.data);
					i3GEO.gadgets.quadros.grava("legenda",legimagem);
				};
				if(i3GEO.gadgets.quadros.geraLegenda === true)
				{i3GEO.mapa.legendaIMAGEM.obtem(temp);}
				if(i3GEO.Interface.padrao.TRANSICAO === true){
					if ($i("imgtemp"))
					{i3GEO.util.desaparece("imgtemp",50,5,true);}
					i3GEO.util.aparece("img",50,5);
				}
				else{
					if ($i("imgtemp"))
					{i3GEO.util.desaparece("imgtemp",15,5,true);}
					i3GEO.util.aparece("img",5,5);
				}
				i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
			};
			if (!$i("imgtemp")){
				ndiv = document.createElement("div");
				ndiv.id = "imgtemp";
				ndiv.style.position = "absolute";
				ndiv.style.border = "1px solid blue";
				document.getElementById("corpoMapa").appendChild(ndiv);
			}
			if(g_tipoacao === "pan" && i3GEO.barraDeBotoes.BOTAOCLICADO === "pan"){
				$i("imgtemp").style.left = parseInt($i("img").style.left,10);
				$i("imgtemp").style.top = parseInt($i("img").style.top,10);
				$i("imgtemp").style.width = i3GEO.parametros.w;
				$i("imgtemp").style.height = i3GEO.parametros.h;
			}
			$i("imgtemp").style.backgroundImage = 'url("'+$i("img").src+'")';
			$i("imgtemp").style.display="block";
			i = $i("img");
			i.style.display="none";
			i.style.left = 0;
			i.style.top = 0;
			i.src=i3GEO.parametros.mapimagem;
		},
		cria:function(){
			var ins = "<input style='position:relative;top:0px;left:0px'' type=image src='' id='img' />",
				temp = $i(i3GEO.Interface.IDCORPO);
			/*
			var ins = "<table>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN' /></td><td class=verdeclaro ></td></tr>";
			ins += "<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL' /></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img' /></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO' /></td></tr>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS' /></td><td class=verdeclaro ></td></tr>";
			ins += "</table>";
			*/
			if(temp)
			{temp.innerHTML = ins;}
			i3GEO.Interface.IDMAPA = "img";
		},
		/*
		Function: ativaMenuContexto
	
		Ativa o menu de contexto acionado com o botão direito do mouse
		*/
		ativaMenuContexto: function(){
			//remove o menu de contexto se existir
			var temp,oFieldContextMenuItemData,oFieldContextMenu,onFieldMenuRender;
			temp = $i("contexto_"+i3GEO.Interface.IDMAPA);
			if(temp){
				temp.parentNode.removeChild(temp);
			}
			oFieldContextMenuItemData = [
				{ text: "&nbsp;<span class='container-close'></span>"},
				{ text: "<img class='rosamais' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-4px;'> Aproxima</span>", onclick: { fn: i3GEO.navega.zoomin } },
				{ text: "<img class='rosamenos' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-4px;'> Afasta</span>", onclick: { fn: i3GEO.navega.zoomout } },
				{ text: "<img class='rosanorte' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Norte</span>", onclick: { fn: i3GEO.navega.panFixoNorte } },
				{ text: "<img class='rosasul' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Sul</span>", onclick: { fn: i3GEO.navega.panFixoSul } },
				{ text: "<img class='rosaleste' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Leste</span>", onclick: { fn: i3GEO.navega.panFixoLeste } },
				{ text: "<img class='rosaoeste' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Oeste</span>", onclick: { fn: i3GEO.navega.panFixoOeste } },
				{ text: "Captura", onclick: { fn:i3GEO.gadgets.quadros.listaImagens} }
			];
			oFieldContextMenu = new YAHOO.widget.ContextMenu(
				"contexto_"+i3GEO.Interface.IDMAPA,{
					trigger: i3GEO.Interface.IDMAPA,
					itemdata: oFieldContextMenuItemData,
					lazyload: true
				}
			);
			onFieldMenuRender = function(){
				var id = "contexto_"+i3GEO.Interface.IDMAPA;
				if(id)
				{$i(id).style.zIndex = 50000;}
			};
			oFieldContextMenu.subscribe("render", onFieldMenuRender);
		},		
		inicia:function(){
			var elemento,i,estilo;
			if ($i("contemImg"))
			{elemento = "contemImg";}
			else
			{elemento = "img";}
			i3GEO.mapa.ajustaPosicao(elemento);
			i = $i("img");
			if(!i){return;}
			i.style.width=i3GEO.parametros.w +"px";
			i.style.height=i3GEO.parametros.h +"px";
			estilo = $i(i3GEO.Interface.IDCORPO).style;
			estilo.width=i3GEO.parametros.w +"px";
			estilo.height=i3GEO.parametros.h +"px";
			estilo.clip = 'rect('+0+" "+(i3GEO.parametros.w)+" "+(i3GEO.parametros.h)+" "+0+')';
			objmapaparado = "nao"; //utilizado para verificar se o mouse esta parado
			i3GEO.gadgets.mostraMenuSuspenso();
			i3GEO.eventos.ativa(i);
			i3GEO.gadgets.mostraCoordenadasGEO();
			i3GEO.gadgets.mostraCoordenadasUTM();
			i3GEO.gadgets.mostraEscalaNumerica();
			i3GEO.gadgets.mostraEscalaGrafica();
			i3GEO.gadgets.visual.inicia();
			
			i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);
			i3GEO.Interface.padrao.ativaBotoes();
			i3GEO.idioma.mostraSeletor();
			if (i3GEO.configura.mapaRefDisplay !== "none"){
				if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay"))
				{i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
				if (i3GEO.configura.mapaRefDisplay === "block")
				{i3GEO.maparef.inicia();}
			}
		},
		ativaBotoes: function(){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.padrao.ativaBotoes()");}
			var imagemxy,x1,y1,x2,y2;
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if ($i("barraDeBotoes1") || i3GEO.barraDeBotoes.AUTO === true){
				x1 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y1 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true){
				x2 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y2 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if (($i("barraDeBotoes1") && $i("barraDeBotoes2")) || i3GEO.barraDeBotoes.AUTO === true){
				x1 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT+40;
			}
			if ($i("barraDeBotoes1") || i3GEO.barraDeBotoes.AUTO === true)
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);}
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true)
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);}
			//ativa as funções dos botões
			i3GEO.barraDeBotoes.ativaBotoes();
			if (document.getElementById("botao3d")){
				if (i3GEO.configura.map3d === "")
				{document.getElementById("botao3d").style.display="none";}
			}
			if(i3GEO.Interface.ATIVAMENUCONTEXTO)
			{i3GEO.Interface.padrao.ativaMenuContexto();}
			if(i3GEO.configura.visual !== "default")
			{i3GEO.gadgets.visual.troca(i3GEO.configura.visual);}
		}
	},
	/*
	Classe: i3GEO.Interface.flamingo
	
	Interface com motor de navegação baseado no software Flamingo Map Components (flash)
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "flamingo"
	*/
	flamingo:{
		redesenha: function(){
			var w = parseInt($i("flamingo").style.width,10);
			if (w === i3GEO.parametros.w)
			{$i("flamingo").style.height = parseInt($i("flamingo").style.height,10)+1;}
			else
			{$i("flamingo").style.height = parseInt($i("flamingo").style.height,10)-1;}
			i3GEO.janela.fechaAguarde();
		},
		cria: function(w,h){
			var i,f,ins;
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				f = $i("flamingo");
				if(!f){
					ins = '<div id=flamingo style="width:0px;height:0px;text-align:left;background-image:url(/"'+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg/")"></div>';
					i.innerHTML = ins;
				}
				f = $i("flamingo");
				f.style.width = w;
				f.style.height = h;
				i3GEO.Interface.IDMAPA = "flamingo";
			}
		},
		inicia: function(){
			var monta = function(retorno){
				$i("flamingo").style.height = i3GEO.parametros.h + 45;
				childPopups  = [];
				childPopupNr = 0;
				var so = new SWFObject(i3GEO.configura.locaplic+"/pacotes/flamingo/flamingo/flamingo.swf?config="+retorno.data, "flamingoi", "100%", "100%", "8", "#eaeaea");
				so.addParam("wmode","transparent"); 
				so.write("flamingo");
			};
			i3GEO.php.flamingo(monta);
			i3GEO.eventos.ativa($i("flamingo"));
			
			i3GEO.maparef.atualiza();
			if (i3GEO.configura.mapaRefDisplay !== "none")
			{
				if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")){i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
				if (i3GEO.configura.mapaRefDisplay === "block"){i3GEO.maparef.inicia();}
			}
			
		},
		ativaBotoes: function(){
		}
	},
	/*
	Classe: i3GEO.Interface.openlayers
	
	Interface com motor de navegação baseado na API OpenLayers
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "openlayers"
	
	Cria o objeto i3geoOL que pode receber os métodos da API
	*/
	openlayers:{
		redesenha: function(){
			if($i("openlayers_OpenLayers_Container")){
				var a,b,c,no,divs1,n1,divs2,n2,imgs,nimg;
				no = $i("openlayers_OpenLayers_Container");
				divs1 = no.getElementsByTagName("div");
				n1 = divs1.length;
				for(a=0;a<n1;a++){
					divs2 = divs1[a].getElementsByTagName("div");
					n2 = divs2.length;
					for(b=0;b<n2;b++){
						imgs = divs2[b].getElementsByTagName("img");
						nimg = imgs.length;
						for(c=0;c<nimg;c++){
							imgs[c].src += "&x";
						}
					}
				}
				i3GEO.Interface.openlayers.recalcPar();
			}
			i3GEO.janela.fechaAguarde();
		},
		cria: function(w,h){
			var i,f,ins;
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				f = $i("openlayers");
				if(!f){
					ins = '<div id=openlayers style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';
					i.innerHTML = ins;
				}
				f = $i("openlayers");
				f.style.width = w;
				f.style.height = h;
			}
			i3GEO.Interface.IDMAPA = "openlayers";
		},
		inicia: function(){
			var montaMapa = function(){
				var url,pz,pos;
				url = window.location.protocol+"//"+window.location.host+i3GEO.parametros.cgi+"?";
				url += "map="+i3GEO.parametros.mapfile+"&mode=map&SRS=epsg:4326&";
				i3geoOL = new OpenLayers.Map('openlayers', { controls: [] });
				i3geoOLlayer = new OpenLayers.Layer.MapServer( "Temas I3Geo", url,{map_imagetype:i3GEO.Interface.OUTPUTFORMAT},{'buffer':1},{isBaseLayer:true, opacity: 1});
				i3geoOLlayer.setVisibility(true);
				i3geoOL.addLayer(i3geoOLlayer);
				i3geoOL.events.register("moveend",i3geoOL,function(e){
					i3GEO.Interface.openlayers.recalcPar();
   					g_operacao = "";
   					g_tipoacao = "";	
				});
				i3geoOL.events.register("mousemove", i3geoOL, function(e){
					//pega as coordenadas do cursor
					var p,lonlat,d,dc;
					if (navm)
					{p = new OpenLayers.Pixel(e.x,e.y);}
					else
					{p = e.xy;}
					//altera o indicador de localizacao
					lonlat = i3geoOL.getLonLatFromPixel(p);
					d = i3GEO.calculo.dd2dms(lonlat.lon,lonlat.lat);
					try{
						objposicaocursor.ddx = lonlat.lon;
						objposicaocursor.ddy = lonlat.lat;
						objposicaocursor.telax = p.x;
						objposicaocursor.telay = p.y;
						objposicaocursor.dmsx = d[0];
						objposicaocursor.dmsy = d[1];
						dc = $i("i3geo");
						if ($i("openlayers_OpenLayers_Container")){dc = $i("openlayers_OpenLayers_Container");}
						while (dc.offsetParent){
							dc = dc.offsetParent;
							objposicaocursor.telax = objposicaocursor.telax + dc.offsetLeft;
							objposicaocursor.telay = objposicaocursor.telay + dc.offsetTop;
						}
					}
					catch(e){
						if(typeof(console) !== 'undefined'){console.error(e);}
					}
				});
				pz = new OpenLayers.Control.PanZoomBar({numZoomLevels: 5});
				i3geoOL.addControl(pz);
				pz.div.style.zIndex = 5000;
				i3geoOL.addControl(new OpenLayers.Control.LayerSwitcher());

				i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.mapexten);

				//i3geoOL.addControl(new OpenLayers.Control.Scale("escalanumerica"));
				i3geoOL.addControl(new OpenLayers.Control.ScaleLine());
				i3geoOL.addControl(new OpenLayers.Control.OverviewMap());
				i3geoOL.addControl(new OpenLayers.Control.KeyboardDefaults());	
				
				i3GEO.eventos.ativa($i("openlayers"));
				
				pos = i3GEO.util.pegaPosicaoObjeto($i("openlayers"));
				if ($i("aguarde")){
					$top("aguarde",pos[1]);
					$left("aguarde",pos[0]);
				}
				//
				//estes controles ficam invisíveis e são usados quando os ícones default do i3geo são ativados
				//
				OLpan = new OpenLayers.Control.Navigation();
				OLzoom = new OpenLayers.Control.ZoomBox();
				OLpanel = new OpenLayers.Control.Panel();
				OLpanel.addControls([OLpan,OLzoom]);
				i3geoOL.addControl(OLpanel);
				
				i3GEO.Interface.openlayers.ativaBotoes();
			};
			i3GEO.php.openlayers(montaMapa);
			i3GEO.gadgets.mostraMenuSuspenso();
			i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);
			i3GEO.idioma.mostraSeletor();
			i3GEO.gadgets.mostraCoordenadasGEO();
			i3GEO.gadgets.mostraCoordenadasUTM();
			i3GEO.gadgets.mostraEscalaNumerica();		
		},
		ativaBotoes: function(){
			var imagemxy,x2,y2;
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if ($i("barraDeBotoes2")){
				x2 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y2 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if ($i("barraDeBotoes2"))
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);}
			//ativa as funções dos botões
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		recalcPar: function(){
			g_operacao = "";
			g_tipoacao = "";
			var bounds = i3geoOL.getExtent().toBBOX().split(",");
    		i3GEO.parametros.mapexten = bounds[0]+" "+bounds[1]+" "+bounds[2]+" "+bounds[3];
			i3GEO.parametros.mapscale = i3geoOL.getScale();
			atualizaEscalaNumerica(parseInt(i3GEO.parametros.mapscale,10));
		},
		zoom2ext: function(ext){
			var m,b;
			m = ext.split(" ");
			b = new OpenLayers.Bounds(m[0],m[1],m[2],m[3]);
			i3geoOL.zoomToExtent(b);		
		}
	},
	/*
	Classe: i3GEO.Interface.googlemaps
	
	Interface com motor de navegação baseado na API Google Maps
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "googlemaps"
	
	Cria o objeto i3GeoMap que pode receber os métodos da API
	*/
	googlemaps:{
		/*
		Propriedade: OPACIDADE
		
		Valor da opacidade da camada i3geo do mapa
		
		Varia de 0 a 1
		
		Default:
		0.8
		
		Tipo:
		{Numeric}
		*/
		OPACIDADE: 0.8,
		/*
		Propriedade: TIPOMAPA
		
		Tipo de mapa que será usado como default, conforme constantes definidas na API do Google Maps.
		
		Default:
		"G_PHYSICAL_MAP"
		
		Tipo:
		{string - Google API constante GMapType "G_SATELLITE_MAP"|"G_PHYSICAL_MAP"|"G_HYBRID_MAP"}
		*/
		TIPOMAPA: "G_PHYSICAL_MAP",
		/*
		Variable
		
		Array com a lista de escalas em cada nivel de zoom utilizado pelo Google
		
		Tipo:
		{array}
		
		*/
		ZOOMSCALE: [591657550,295828775,147914387,73957193,36978596,18489298,9244649,4622324,2311162,1155581,577790,288895,144447,72223,36111,18055,9027,4513,2256,1128],

		redesenha: function(){
   			try{
   				if(i3GeoMap !== ""){
   					posfixo = posfixo + "&";
					i3GeoMap.removeOverlay(i3GEOTileO);
					var i3GEOTile = new GTileLayer(null,0,18,{
               		tileUrlTemplate:i3GEO.Interface.googlemaps.criaTile()+posfixo,
               		isPng:true,
               		opacity:i3GEO.Interface.googlemaps.OPACIDADE });
              		i3GEOTileO = new GTileLayerOverlay(i3GEOTile);
   					i3GeoMap.addOverlay(i3GEOTileO);
				}
			}catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		},
		cria: function(w,h){
			var i,f,ins;
			posfixo = "&";
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				f = $i("googlemapsdiv");
				if(!f){
					ins = '<div id=googlemapsdiv style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';
					i.innerHTML = ins;
				}
				f = $i("googlemapsdiv");
				f.style.width = w;
				f.style.height = h;
			}
			i3GeoMap = "";
			i3GEO.Interface.IDMAPA = "googlemapsdiv";
		},
		inicia: function(){
    		var pos,myMapType,pol,ret,pt1,pt2,bottomLeft,bottomRight,sw,ne,z,i3GEOTile;
    		pol = i3GEO.parametros.mapexten;
    		ret = pol.split(" ");
    		pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    		pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
    		
    		i3GeoMap = new GMap2($i(i3GEO.Interface.IDMAPA));
    		i3GeoMap.addMapType(G_PHYSICAL_MAP);
    		if(i3GEO.Interface.googlemaps.TIPOMAPA === "G_SATELLITE_MAP")
    		{i3GeoMap.setMapType(G_SATELLITE_MAP);}
    		if(i3GEO.Interface.googlemaps.TIPOMAPA === "G_PHYSICAL_MAP")
    		{i3GeoMap.setMapType(G_PHYSICAL_MAP);}
    		if(i3GEO.Interface.googlemaps.TIPOMAPA === "G_HYBRID_MAP")
    		{i3GeoMap.setMapType(G_HYBRID_MAP);}			
    		i3GeoMap.addControl(new GLargeMapControl());
    		i3GeoMap.addControl(new GMapTypeControl());
    		bottomLeft = new GControlPosition(G_ANCHOR_BOTTOM_LEFT,new GSize(0,40));
    		i3GeoMap.addControl(new GScaleControl(),bottomLeft);
    		bottomRight = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT);
    		i3GeoMap.addControl(new GOverviewMapControl(),bottomRight);
    		
    		sw = new GLatLng(ret[1],ret[0]);
    		ne = new GLatLng(ret[3],ret[2]);
    		z = i3GeoMap.getBoundsZoomLevel(new GLatLngBounds(sw,ne));

    		i3GeoMap.setCenter(new GLatLng(pt2,pt1), z);

   			i3GEOTile = new GTileLayer(null,0,18,{
                    tileUrlTemplate:i3GEO.Interface.googlemaps.criaTile(),
                    isPng:true,
                    opacity:i3GEO.Interface.googlemaps.OPACIDADE });
                    
   			i3GEOTileO = new GTileLayerOverlay(i3GEOTile);
   			i3GeoMap.addOverlay(i3GEOTileO);
   			myMapType = new GMapType([i3GEOTile], new GMercatorProjection(18), 'i3Geo');
   			i3GeoMap.addMapType(myMapType);
   			GEvent.addListener(i3GeoMap, "dragstart", function() {
   				g_operacao = "";
   				g_tipoacao = "";
   			});
   			GEvent.addListener(i3GeoMap, "dragend", function() {
   				i3GEO.Interface.googlemaps.recalcPar();
   			});
   			GEvent.addListener(i3GeoMap, "zoomend", function() {
   				i3GEO.Interface.googlemaps.recalcPar();
   				g_operacao = "";
   				g_tipoacao = "";
   			});
			i3GEO.Interface.googlemaps.ativaBotoes();
			i3GEO.eventos.ativa($i(i3GEO.Interface.IDMAPA));
			i3GEO.gadgets.mostraCoordenadasGEO();
			i3GEO.gadgets.mostraMenuSuspenso();
			i3GEO.gadgets.mostraInserirKml();
			pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
			GEvent.addListener(i3GeoMap, "mousemove", function(ponto) {
    			var teladms,tela;
    			teladms = i3GEO.calculo.dd2dms(ponto.lng(),ponto.lat());
    			tela = i3GeoMap.fromLatLngToContainerPixel(ponto);
    			objposicaocursor = {
					ddx: ponto.lng(),
					ddy: ponto.lat(),
					dmsx: teladms[0],
					dmsy: teladms[1],
					imgx:tela.x,
					imgy:tela.y,
					telax: tela.x + pos[0],
					telay: tela.y + pos[1]
				};
    		});
    		g_operacao = "";
    		g_tipoacao = "";
    		if(i3GEO.parametros.kmlurl !== "")
    		{i3GEO.mapa.insereKml(true,i3GEO.parametros.kmlurl);}
    		i3GEO.parametros.mapscale = i3GEO.Interface.googlemaps.calcescala();
   			i3GEO.Interface.googlemaps.adicionaListaKml();
		},
		bbox: function(){
			var bd,so,ne,bbox;
			bd = i3GeoMap.getBounds();
			so = bd.getSouthWest();
			ne = bd.getNorthEast();
			bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat();
			return (bbox);
		},
		criaWMS: function(){
		   	var cgi,parametros;
		   	cgi = i3GEO.configura.locaplic+"/classesphp/parse_cgi.php?g_sid="+i3GEO.configura.sid;
    		parametros = "&map_size="+parseInt($i(i3GEO.Interface.IDMAPA).style.width,10);
    		parametros += ","+parseInt($i(i3GEO.Interface.IDMAPA).style.height,10);
    		parametros += "&mapext="+i3GEO.Interface.googlemaps.bbox();
    		parametros += "&map_imagecolor=-1 -1 -1&map_transparent=on";
    		return(cgi+parametros);
		},
		criaTile: function(){
		   	var cgi,parametros;
		   	cgi = i3GEO.util.protocolo()+"://"+window.location.host+i3GEO.parametros.cgi+"?";
    		parametros = "map="+i3GEO.parametros.mapfile;
        	parametros += '&mode=tile';
        	parametros += '&tilemode=gmap';
        	parametros += '&tile={X}+{Y}+{Z}';
        	parametros += '&map_imagetype='+i3GEO.Interface.OUTPUTFORMAT;
    		//alert(cgi+parametros)
    		return(cgi+parametros);		
		},
		ativaBotoes: function(){
			var imagemxy,x2,y2;
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if ($i("barraDeBotoes2")){
				x2 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT+70;
				y2 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if ($i("barraDeBotoes2"))
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);}
			//ativa as funções dos botões
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		mudaOpacidade: function(valor){
			//$i("xg").value = valor / 200;
			i3GEO.Interface.googlemaps.OPACIDADE = valor / 200;
			i3GEO.Interface.googlemaps.redesenha();
		},
		recalcPar: function(){
			var bounds,sw,ne;
			g_operacao = "";
			g_tipoacao = "";
			bounds = i3GeoMap.getBounds();
    		sw = bounds.getSouthWest();
    		ne = bounds.getNorthEast();
    		i3GEO.parametros.mapexten = sw.lng()+" "+sw.lat()+" "+ne.lng()+" "+ne.lat();
			i3GEO.parametros.mapscale = i3GEO.Interface.googlemaps.calcescala();
		},
		calcescala:function(){
    		var zoom = i3GeoMap.getZoom();
			return (i3GEO.Interface.googlemaps.ZOOMSCALE[zoom]);		
		},
		escala2nzoom:function(escala){
			var n,i;
			n = i3GEO.Interface.googlemaps.ZOOMSCALE.length;
			for(i=0; i < n;i++){
				if(i3GEO.Interface.googlemaps.ZOOMSCALE[i] < escala){
					return(i);
				}
			}
		},
		zoom2extent:function(mapexten){
			var pol,ret,pt1,pt2,sw,ne,z;
			pol = mapexten;
    		ret = pol.split(" ");
    		pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    		pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
    		sw = new GLatLng(ret[1],ret[0]);
    		ne = new GLatLng(ret[3],ret[2]);
    		z = i3GeoMap.getBoundsZoomLevel(new GLatLngBounds(sw,ne));
    		i3GeoMap.setCenter(new GLatLng(pt2,pt1), z);		
		},
		/*
		Function: adicionaKml
	
		Insere no mapa uma camada KML com base na API do Google Maps
	
		As camadas adicionadas são crescentadas na árvore de camadas
	
		A lista de nomes dos objetos geoXml criados é mantida em i3GEO.mapas.GEOXML
	
		Parametros:
	
		pan {Boolean} - define se o mapa será deslocado para encaixar o KML
	
		url {String} - URL do arquivo KML. Se não for definido, a URL será obtida do INPUT com id = i3geo_urlkml (veja i3GEO.gadgets.mostraInserirKml)

		titulo {string} - titulo que aparecerá na árvore. Se não for definido, será calculado aleatoriamente.
		
		ativo {boolean} - indica se a camada estará ativa ou não. Se não for definido, será considerado como true
		*/
		adicionaKml: function(pan,url,titulo,ativo){
			var ngeoxml,i,zoom;
			if(!$i("arvoreCamadasKml"))
			{i3GEO.Interface.googlemaps.criaArvoreKML();}
			ngeoxml = "geoXml_"+i3GEO.mapa.GEOXML.length;
			if(arguments.length === 1){
				i = $i("i3geo_urlkml");
				if(i)
				{url = i.value;}
				else
				{url = "";}
				titulo = ngeoxml;
				ativo = true;
			}
			if(arguments.length === 2){
				titulo = ngeoxml;
				ativo = true;
			}
			if(arguments.length === 2)
			{ativo = true;}
			if(url === "")
			{return;}
			//"http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss"
			i3GEO.mapa.GEOXML.push(ngeoxml);
			zoom = function(){
				if(pan){
					eval("var ll = "+ngeoxml+".getDefaultCenter()");
					eval(ngeoxml+".gotoDefaultViewport(i3GeoMap)");
				}
			};
			eval(ngeoxml+" = new GGeoXml(url,zoom)");
			if(ativo === true)
			{eval("i3GeoMap.addOverlay("+ngeoxml+")");}

			i3GEO.Interface.googlemaps.adicionaNoArvoreGoogle(url,titulo,ativo,ngeoxml);
		},
		adicionaListaKml: function(){
			var monta = function(retorno){
				var raiz,nraiz,i;
				raiz = retorno.data.canais;
				nraiz = raiz.length;
				for (i=0;i<nraiz; i++){
					i3GEO.Interface.googlemaps.adicionaKml(false,raiz[i].link,raiz[i].title,false);
				}
			};
			i3GEO.php.listaRSSwsARRAY(monta,"KML");
		},
		/*
		Function: adicionaNoArvoreGoogle
		
		Acrescenta na árvore de camadas um novo tema no nó que mostra os arquivos KML inseridos no mapa
		
		Os temas são incluídos em um nó chamado "Google Maps".
		
		Para obter esse nó utilize var node = i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idkml","raiz");
		
		Parametros:
		
		url {string} - url do arquivo KML
	
		nomeOverlay {string} - título do tema
		
		ativo {boolean} - indica o estado do checkbox
		
		id {string} - nome do objeto GGeoXml
		*/
		adicionaNoArvoreGoogle: function(url,nomeOverlay,ativo,id){
			var root,node,d,nodekml;
			if(!$i("arvoreCamadasKml"))
			{i3GEO.Interface.googlemaps.criaArvoreKML();}
			if(arguments.length === 2){
				ativo = true;
				id = nomeOverlay;
			}
			if(arguments.length === 2)
			{id = nomeOverlay;}
			root = i3GEO.Interface.googlemaps.ARVORE.getRoot();
			node = i3GEO.Interface.googlemaps.ARVORE.getNodeByProperty("idkml","raiz");
			html = "<input onclick='i3GEO.Interface.googlemaps.ativaDesativaCamadaKml(this)' class=inputsb style='cursor:pointer;' type='checkbox' value='"+id+"'";
			if(ativo === true)
			{html += " checked ";}
			html += "/>";
			html += "&nbsp;<span style='cursor:move'>"+nomeOverlay+"</span>";
			d = {html:html};
			nodekml = new YAHOO.widget.HTMLNode(d, node, true,true); 
			nodekml.enableHighlight = false;   			
			nodekml.isleaf = true;
			i3GEO.Interface.googlemaps.ARVORE.draw();
			i3GEO.Interface.googlemaps.ARVORE.collapseAll();
			node.expand();
		},
		criaArvoreKML: function(){
			var arvore,a,root,titulo,d,node;
			arvore = $i("arvoreCamadasKml");
			if(!arvore){
				d = document.createElement("div");
				d.id = "arvoreCamadasKml";
				d.style.top = "40px";
				a = $i(i3GEO.arvoreDeCamadas.IDHTML);
				if(a){
					a.parentNode.appendChild(d);
				}
				else{alert("Arvore de camadas nao encontrada. Nao e possivel adicionar a arvore de KML");return;}
			}
			i3GEO.Interface.googlemaps.ARVORE = new YAHOO.widget.TreeView("arvoreCamadasKml");
			root = i3GEO.Interface.googlemaps.ARVORE.getRoot();
			titulo = "<table><tr><td><b>Google Maps</b></td></tr></table>";
			d = {html:titulo,idkml:"raiz"};
			node = new YAHOO.widget.HTMLNode(d, root, true,true);
			node.enableHighlight = false;
		},
		/*
		Function: ativaDesativaCamadaKml
		
		Ativa ou desativa uma camada do nó de layers KML
			
		Parametro:
		
		obj {object} - objeto do tipo checkbox que foi ativado/desativado
		*/
		ativaDesativaCamadaKml: function(obj){	
			if(!obj.checked){
				eval("i3GeoMap.removeOverlay("+obj.value+")");
			}
			else
			{eval("i3GeoMap.addOverlay("+obj.value+")");}
		}
	},
	/*
	Classe: i3GEO.Interface.googleearth
	
	Interface com motor de navegação baseado na API Google Earth
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "googleearth"
	
	Cria o objeto i3GeoMap que pode receber os métodos da API do google Earth
	*/
	googleearth:{
		redesenha: function(){
			try{
				if(typeof(linki3geo) !== 'undefined')
				{linki3geo.setHref(linki3geo.getHref()+"&");}
			}
			catch(e){
				alert(e);
			}
		},
		cria: function(w,h){
			var i,i3GeoMap3d,i3GeoMap;
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				i3GeoMap3d = document.createElement("div");
				i3GeoMap3d.style.width = w;
				i3GeoMap3d.style.height = h + 45;
				i.style.height = h + 45;
				i3GeoMap3d.id = "i3GeoMap3d";
				i.appendChild(i3GeoMap3d);
			}
			i3GEO.Interface.IDMAPA = "i3GeoMap3d";
			google.load("earth", "1");
			i3GeoMap = null;
		},
		inicia: function(){
			google.earth.createInstance("i3GeoMap3d", i3GEO.Interface.googleearth.iniciaGE, i3GEO.Interface.googleearth.falha);
		},
		iniciaGE: function(object){
  			i3GeoMap = object;
  			i3GeoMap.getWindow().setVisibility(true);
  			kmlUrl = i3GEO.configura.locaplic+"/pacotes/kmlmapserver/kmlservice.php?map="+i3GEO.parametros.mapfile+"&typename=estadosl&request=kml&mode=map&";
  			linki3geo = i3GeoMap.createLink('');
          	linki3geo.setHref(kmlUrl);
          	nl = i3GeoMap.createNetworkLink('');
          	nl.setLink(linki3geo);
          	nl.setFlyToView(true);          
          	i3GeoMap.getFeatures().appendChild(nl);
          	var options = i3GeoMap.getOptions();
          	options.setMouseNavigationEnabled(true);
			options.setStatusBarVisibility(true);
			options.setOverviewMapVisibility(true);
			options.setScaleLegendVisibility(true);
          	i3GeoMap.getNavigationControl().setVisibility(i3GeoMap.VISIBILITY_SHOW);
		},
		falha: function()
		{alert("Falhou. Vc precisa do plugin instalado");},
		ativaBotoes: function(){}
	}
};
//
//para efeitos de compatibilidade
//
i3GEO.interface = i3GEO.Interface;
//YAHOO.log("carregou classe interface", "Classes i3geo");