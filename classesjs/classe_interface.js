/*
Title: Interface

File: i3geo/classesjs/classe_interface.js

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
Class: i3GEO.interface

Funcoes que controlam o comportamento específico de determinadas interfaces

As interfaces são definidas na inicialização do i3Geo, por exemplo, openlayers, flamingo,etc

A classe "interface" contém os métdos específicos utilizados nessas interfaces

Exemplo:

Para iniciar o i3geo com uma interface específica, utilize http://localhost/i3geo/ms_criamapa.php?interface=flamingo.htm
O HTML deve conter as definições da interface criada e deve estar armazenado em i3geo/aplicmap
*/
i3GEO.interface = {
	/*
	Property: ATUAL
	
	Interface atual em uso.
	
	Default:
	padrao
	*/
	ATUAL: "padrao",
	/*
	Property: IDCORPO
	
	ID do elemento HTML que receberá o corpo do mapa
	*/
	IDCORPO: "corpoMapa",
	/*
	Variable: IDMAPA
	
	ID do elemento HTML criado para conter o mapa
	Esse elemento normalmente é criado dentro de IDCORPO dependendo da interface
	*/
	IDMAPA: "",
	/*
	Function: redesenha
	
	Aplica o método redesenha da interface atual
	*/
	redesenha: function(){
		eval("i3GEO.interface."+i3GEO.interface.ATUAL+".redesenha()");
	},
	/*
	Function: cria
	
	Cria ou altera os elementos HTML necessários para a interface
	
	Essa função é executada na inicialização do i3geo
	
	Parameters:
	
	w {Integer} - largura do corpo do mapa em pixels
	
	h {Integer} - altura do corpo do mapa em pixels
	*/
	cria: function(w,h){
		eval("i3GEO.interface."+i3GEO.interface.ATUAL+".cria("+w+","+h+")");
	},
	/*
	Function: inicia
	
	Inicia a interface
	*/
	inicia: function(w,h){
		eval("i3GEO.interface."+i3GEO.interface.ATUAL+".inicia()");
	},
	/*
	Function: ativaBotoes
	
	Ativa os botões de ferramentas
	*/
	ativaBotoes: function(){
		eval("i3GEO.interface."+i3GEO.interface.ATUAL+".ativaBotoes()");
	},
	padrao:{
		redesenha:function(){
			$i("img").onload =  function()
			{
				$i("img").onload = "";
				//atualiza quadro
				
				i3GEO.gadgets.quadros.grava("imagem",i3GEO.parametros.mapimagem);
				i3GEO.gadgets.quadros.grava("extensao",i3GEO.parametros.mapexten);
				var temp = function(retorno){
					eval(retorno.data);
					i3GEO.gadgets.quadros.grava("legenda",legimagem);
				};
				i3GEO.mapa.legendaIMAGEM.obtem(temp);
				if ($i("imgtemp"))
				{$i("imgtemp").style.display="none";}
				//necessário na função de zoom por slide
				if ($i("imgClone"))
				$i("imgClone").style.display = "none";
				$i("img").style.display = "block";			
				i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
			};
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
				$i("imgtemp").style.width = i3GEO.parametros.w;
				$i("imgtemp").style.height = i3GEO.parametros.h;
				$i("imgtemp").style.display="block";
				$i("imgtemp").style.backgroundImage = 'url("'+$i("img").src+'")';
			}		
			$i("img").style.left = 0;
			$i("img").style.top = 0;
			$i("img").src=i3GEO.parametros.mapimagem;
		},
		cria:function(){
			var ins = "<table>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN' /></td><td class=verdeclaro ></td></tr>";
			ins += "<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL' /></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img' /></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO' /></td></tr>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS' /></td><td class=verdeclaro ></td></tr>";
			ins += "</table>";
			$i(i3GEO.interface.IDCORPO).innerHTML = ins;
			i3GEO.interface.IDMAPA = "img";	
		},
		inicia:function(){
			if ($i("contemImg"))
			{var elemento = "contemImg";}
			else
			{var elemento = "img";}
			i3GEO.mapa.ajustaPosicao(elemento);
			var i = $i("img");
			i.style.width=i3GEO.parametros.w +"px";
			i.style.height=i3GEO.parametros.h +"px";
			var estilo = $i(i3GEO.interface.IDCORPO).style;
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
			i3GEO.idioma.mostraSeletor();
			i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);
			i3GEO.interface.padrao.ativaBotoes();
			
			if (i3GEO.configura.mapaRefDisplay != "none")
			{
				if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")){i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
				if (i3GEO.configura.mapaRefDisplay == "block"){i3GEO.maparef.inicia();}
			}
		},
		ativaBotoes: function(){
			var imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));
			if ($i("barraDeBotoes1")){
				var x1 = imagemxy[0]+40;
				var y1 = imagemxy[1]+10;
			}
			if ($i("barraDeBotoes2")){
				var x2 = imagemxy[0];
				var y2 = imagemxy[1]+10;
			}
			else{
				if ($i("barraDeBotoes1")){
					var x1 = imagemxy[0];
					var x2 = imagemxy[1]+10;
				}
			}
			if ($i("barraDeBotoes1"))
			i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);
			if ($i("barraDeBotoes2"))
			i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);
			//ativa as funções dos botões
			i3GEO.barraDeBotoes.ativaBotoes();
			if (document.getElementById("botao3d"))
			{
				if (i3GEO.configura.map3d == ""){document.getElementById("botao3d").style.display="none";}
			}
		}
	},
	/*
	Function: flamingo
	
	Interface baseada no software flamingo (flash)
	*/
	flamingo:{
		redesenha: function(){
			var w = parseInt($i("flamingo").style.width);
			if (w == i3GEO.parametros.w)
			{$i("flamingo").style.height = parseInt($i("flamingo").style.height)+1;}
			else
			{$i("flamingo").style.height = parseInt($i("flamingo").style.height)-1;}
			i3GEO.janela.fechaAguarde();
		},
		cria: function(w,h){
			var i = $i(i3GEO.interface.IDCORPO);
			if(i){
				var f = $i("flamingo");
				if(!f){
					var ins = '<div id=flamingo style="width:0px;height:0px;text-align:left;background-image:url(/"'+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg/")"></div>';
					i.innerHTML = ins;
				}
				var f = $i("flamingo");
				f.style.width = w;
				f.style.height = h;
				i3GEO.interface.IDMAPA = "flamingo";
			}
		},
		inicia: function(){
			var monta = function(retorno){
				$i("flamingo").style.height = i3GEO.parametros.h + 45;
				childPopups  = new Array();
				childPopupNr = 0;
				var so = new SWFObject(i3GEO.configura.locaplic+"/pacotes/flamingo/flamingo/flamingo.swf?config="+retorno.data, "flamingoi", "100%", "100%", "8", "#eaeaea");
				so.addParam("wmode","transparent"); 
				so.write("flamingo");
			}
			i3GEO.php.flamingo(monta);
			i3GEO.eventos.ativa($i("flamingo"));
			
			i3GEO.maparef.atualiza();
			if (i3GEO.configura.mapaRefDisplay != "none")
			{
				if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")){i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
				if (i3GEO.configura.mapaRefDisplay == "block"){i3GEO.maparef.inicia();}
			}
			
		},
		ativaBotoes: function(){
		}
	},
	/*
	Function: openlayers
	
	Interface baseada no software openlayers
	
	O objeto openlayers criado nessa função pode ser acessado na variável i3geoOL
	*/
	openlayers:{
		redesenha: function(){
			if($i("openlayers_OpenLayers_Container")){
				var no = $i("openlayers_OpenLayers_Container");
				var divs1 = no.getElementsByTagName("div");
				var n1 = divs1.length;
				for(a=0;a<n1;a++){
					var divs2 = divs1[a].getElementsByTagName("div");
					var n2 = divs2.length;
					for(b=0;b<n2;b++){
						var imgs = divs2[b].getElementsByTagName("img");
						var nimg = imgs.length;
						for(c=0;c<nimg;c++){
							imgs[c].src += "&x";
						}
					}
				}
			}
			i3GEO.janela.fechaAguarde();
		},
		cria: function(w,h){
			var i = $i(i3GEO.interface.IDCORPO);
			if(i){
				var f = $i("openlayers");
				if(!f){
					var ins = '<div id=openlayers style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';
					i.innerHTML = ins;
				}
				var f = $i("openlayers");
				f.style.width = w;
				f.style.height = h;
			}
			i3GEO.interface.IDMAPA = "openlayers";
		},
		inicia: function(){
			var montaMapa = function(){
				var url = window.location.protocol+"//"+window.location.host+i3GEO.parametros.cgi+"?";
				url += "map="+i3GEO.parametros.mapfile+"&mode=map&SRS=epsg:4326&";
				i3geoOL = new OpenLayers.Map('openlayers', { controls: [] });
				i3geoOLlayer = new OpenLayers.Layer.MapServer( "Temas I3Geo", url,{layers:'estadosl'},{'buffer':1},{isBaseLayer:true, opacity: 1});
				i3geoOLlayer.setVisibility(true);
				i3geoOL.addLayer(i3geoOLlayer);
				i3geoOL.events.register("mousemove", i3geoOL, function(e){
					//pega as coordenadas do cursor
					if (navm)
					{var p = new OpenLayers.Pixel(e.x,e.y);}
					else
					{var p = e.xy;}
					//altera o indicador de localizacao
					var lonlat = i3geoOL.getLonLatFromViewPortPx(p);
					var d = i3GEO.calculo.dd2dms(lonlat.lon,lonlat.lat);
					try{
						objposicaomouse.x = p.x;
						objposicaomouse.y = p.y;
						objposicaocursor.ddx = lonlat.lon;
						objposicaocursor.ddy = lonlat.lat;
						objposicaocursor.telax = p.x;
						objposicaocursor.telay = p.y;
						var dc = $i("i3geo");
						if ($i("openlayers_OpenLayers_Container")){var dc = $i("openlayers_OpenLayers_Container");}
						while (dc.offsetParent){
							dc = dc.offsetParent;
							objposicaocursor.telax = objposicaocursor.telax + dc.offsetLeft;
							objposicaocursor.telay = objposicaocursor.telay + dc.offsetTop;
						}
						//movecursor();
					}
					catch(e){}
				});
				var pz = new OpenLayers.Control.PanZoomBar({numZoomLevels: 5});
				i3geoOL.addControl(pz);
				pz.div.style.zIndex = 5000;
				/*
				$i("OpenLayers_Control_PanZoom_pandown").style.top=parseInt($i("OpenLayers_Control_PanZoom_pandown").style.top)+5;
				$i("OpenLayers_Control_PanZoom_panup").style.top=parseInt($i("OpenLayers_Control_PanZoom_panup").style.top)+5;
				$i("OpenLayers_Control_PanZoom_panleft").style.top=parseInt($i("OpenLayers_Control_PanZoom_panleft").style.top)+5;
				$i("OpenLayers_Control_PanZoom_panright").style.top=parseInt($i("OpenLayers_Control_PanZoom_panright").style.top)+5;
				*/
				var navc = new OpenLayers.Control.NavToolbar();
				i3geoOL.addControl(navc);
				navc.div.style.left="8px";
				navc.div.style.top="-20px";
				navc.div.onclick = function(){
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pan","img",i3GEO.configura.locaplic);
					g_operacao="navega";
				};
    			zb = new OpenLayers.Control.ZoomToMaxExtent();
				var botoesadic = new OpenLayers.Control.Panel();
    			/*
    			botoesadic.addControls([
       				new OpenLayers.Control.ZoomToMaxExtent()
    			]);
    			i3geoOL.addControl(botoesadic);
    			botoesadic.div.style.left="10px";
    			botoesadic.div.style.top=parseInt($i("OpenLayers_Control_PanZoom_zoomout").style.top)+77;
				*/
				i3geoOL.addControl(new OpenLayers.Control.LayerSwitcher());

				var m = i3GEO.parametros.mapexten.split(" ");
				var b = new OpenLayers.Bounds(m[0],m[1],m[2],m[3]);
				i3geoOL.zoomToExtent(b);

				i3geoOL.addControl(new OpenLayers.Control.Scale("escalanumerica"));
				i3geoOL.addControl(new OpenLayers.Control.KeyboardDefaults());	
				//var ol_overview = new OpenLayers.Layer.WMS( "OpenLayers WMS", "http://labs.metacarta.com/wms/vmap0",{layers: 'basic'});
				//var options = {layers: [ol_overview],minRatio: 8,maxRatio: 128};
				//var overview = new OpenLayers.Control.OverviewMap(options);
				//i3geoOL.addControl(overview);
				i3GEO.eventos.ativa($i("openlayers"));
				var pos = i3GEO.util.pegaPosicaoObjeto($i("openlayers"));
				if ($i("aguarde")){
					$top("aguarde",pos[1]);
					$left("aguarde",pos[0]);
				}
			};
			i3GEO.php.openlayers(montaMapa);
		},
		ativaBotoes: function(){
		}
	},
	/*
	Function: googlemaps
	
	Interface baseada no software googlemaps
	
	O objeto criado com a API do google maps pode ser acessado na variável i3GeoMap
	*/
	googlemaps:{
		/*
		Property: OPACIDADE
		
		Valor da opacidade da camada i3geo do mapa
		
		Varia de 0 a 1
		
		Default:
		0.8
		
		Type:
		{Numeric}
		*/
		OPACIDADE: 0.8,
		redesenha: function(){
   			if(i3GeoMap != ""){
   				posfixo = posfixo + "&";
				if(tile == false){
   					i3GeoMap.removeOverlay(wmsmap);
   					wmsmap = new GGroundOverlay(i3GEO.interface.googlemaps.criaWMS()+posfixo, i3GeoMap.getBounds());
					i3GeoMap.addOverlay(wmsmap);
   				}
   				else{
   					i3GeoMap.removeOverlay(i3GEOTileO);
   					var i3GEOTile = new GTileLayer(null,0,18,{
                     	tileUrlTemplate:i3GEO.interface.googlemaps.criaTile()+posfixo,
                     	isPng:true,
                     	opacity:i3GEO.interface.googlemaps.OPACIDADE });
                	i3GEOTileO = new GTileLayerOverlay(i3GEOTile);
    				i3GeoMap.addOverlay(i3GEOTileO);
				}
			}
			//atualiza a lista de KMLs na árvore de temas
			var n = i3GEO.mapa.GEOXML.length;
			for(i=0;i<n;i++){
				i3GEO.mapa.criaNoArvoreGoogle(i3GEO.mapa.GEOXML[i],i3GEO.mapa.GEOXML[i]);
			}
		},
		cria: function(w,h){
			posfixo = "&";
			var i = $i(i3GEO.interface.IDCORPO);
			if(i){
				var f = $i("googlemapsdiv");
				if(!f){
					var ins = '<div id=googlemapsdiv style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';
					i.innerHTML = ins;
				}
				var f = $i("googlemapsdiv");
				f.style.width = w;
				f.style.height = h;
			}
			i3GeoMap = "";
			i3GEO.interface.IDMAPA = "googlemapsdiv";
		},
		inicia: function(){
    		tile = false;
    		var ver = i3GEO.parametros.versaomscompleta.split(".");
    		if(parseInt(i3GEO.parametros.versaoms) >= 5 && parseInt(ver[1]) > 1)
    		{tile = true;}
    		var pol = i3GEO.parametros.mapexten;
    		var ret = pol.split(" ");
    		var pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    		var pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
    		i3GeoMap = new GMap2($i(i3GEO.interface.IDMAPA));
    		i3GeoMap.setMapType(G_SATELLITE_MAP);
    		i3GeoMap.addControl(new GLargeMapControl());
    		i3GeoMap.addControl(new GMapTypeControl());
    		var bottomLeft = new GControlPosition(G_ANCHOR_BOTTOM_LEFT,new GSize(0,40));
    		i3GeoMap.addControl(new GScaleControl(),bottomLeft);
    		var bottomRight = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT);
    		i3GeoMap.addControl(new GOverviewMapControl(),bottomRight);
    		i3GeoMap.setCenter(new GLatLng(pt2,pt1), 4);   		
			if(tile == false){
    			wmsmap = new GGroundOverlay(i3GEO.interface.googlemaps.criaWMS(), i3GeoMap.getBounds());
				i3GeoMap.addOverlay(wmsmap);
    			GEvent.addListener(i3GeoMap, "zoomend", function() {
    				i3GeoMap.removeOverlay(wmsmap);
    				wmsmap = new GGroundOverlay(i3GEO.interface.googlemaps.criaWMS(), i3GeoMap.getBounds());
					i3GeoMap.addOverlay(wmsmap);
    				i3GEO.interface.googlemaps.recalcPar();
    				g_operacao = "";
    				g_tipoacao = "";
    			});
    			GEvent.addListener(i3GeoMap, "dragend", function() {
    				i3GeoMap.removeOverlay(wmsmap);
    				wmsmap = new GGroundOverlay(i3GEO.interface.googlemaps.criaWMS(), i3GeoMap.getBounds());
					i3GeoMap.addOverlay(wmsmap);
    				i3GEO.interface.googlemaps.recalcPar();
    			});
    			GEvent.addListener(i3GeoMap, "dragstart", function() {
    				g_operacao = "";
    				g_tipoacao = "";
    			});
    		}
    		else{
    			//i3GEO.janela.slider("i3GEO.interface.googlemaps.mudaOpacidade","150");
    			//http://mapgadgets.googlepages.com/cta.kml
    			var i3GEOTile = new GTileLayer(null,0,18,{
                     tileUrlTemplate:i3GEO.interface.googlemaps.criaTile(),
                     isPng:true,
                     opacity:i3GEO.interface.googlemaps.OPACIDADE });
    			i3GEOTileO = new GTileLayerOverlay(i3GEOTile);
    			i3GeoMap.addOverlay(i3GEOTileO);
    			var myMapType = new GMapType([i3GEOTile], new GMercatorProjection(18), 'i3Geo');
    			i3GeoMap.addMapType(myMapType);
    			GEvent.addListener(i3GeoMap, "dragstart", function() {
    				g_operacao = "";
    				g_tipoacao = "";
    			});
    			GEvent.addListener(i3GeoMap, "dragend", function() {
    				i3GEO.interface.googlemaps.recalcPar();
    			});
    			GEvent.addListener(i3GeoMap, "zoomend", function() {
    				i3GEO.interface.googlemaps.recalcPar();
    				g_operacao = "";
    				g_tipoacao = "";
    			});
    			
			}
			i3GEO.interface.googlemaps.ativaBotoes();
			i3GEO.eventos.ativa($i(i3GEO.interface.IDMAPA));
			i3GEO.gadgets.mostraCoordenadasGEO();
			i3GEO.gadgets.mostraMenuSuspenso();
			i3GEO.gadgets.mostraInserirKml();
			var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDMAPA));
			GEvent.addListener(i3GeoMap, "mousemove", function(ponto) {
    			var teladms = i3GEO.calculo.dd2dms(ponto.lng(),ponto.lat());
    			var tela = i3GeoMap.fromLatLngToContainerPixel(ponto);
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
    		if(i3GEO.parametros.kmlurl != "")
    		{i3GEO.mapa.insereKml(true,i3GEO.parametros.kmlurl)}
		},
		bbox: function(){
			var bd = i3GeoMap.getBounds();
			var so = bd.getSouthWest();
			var ne = bd.getNorthEast();
			var bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat();
			return (bbox);
		},
		criaWMS: function(){
		   	var cgi = i3GEO.configura.locaplic+"/classesphp/parse_cgi.php?g_sid="+i3GEO.configura.sid;
    		var parametros = "&map_size="+parseInt($i(i3GEO.interface.IDMAPA).style.width);
    		parametros += ","+parseInt($i(i3GEO.interface.IDMAPA).style.height);
    		parametros += "&mapext="+i3GEO.interface.googlemaps.bbox();
    		parametros += "&map_imagecolor=-1 -1 -1&map_transparent=on";
    		return(cgi+parametros);
		},
		criaTile: function(){
		   	var cgi = i3GEO.util.protocolo()+"://"+window.location.host+i3GEO.parametros.cgi+"?";
    		var parametros = "map="+i3GEO.parametros.mapfile;
        	parametros += '&mode=tile';
        	parametros += '&tilemode=gmap';
        	parametros += '&tile={X}+{Y}+{Z}';
    		//alert(cgi+parametros)
    		return(cgi+parametros);		
		},
		ativaBotoes: function(){
			var imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));
			if ($i("barraDeBotoes2")){
				var x2 = imagemxy[0]+80;
				var y2 = imagemxy[1]+10;
			}
			if ($i("barraDeBotoes2"))
			i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);
			//ativa as funções dos botões
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		mudaOpacidade: function(valor){
			//$i("xg").value = valor / 200;
			i3GEO.interface.googlemaps.OPACIDADE = valor / 200;
			i3GEO.interface.googlemaps.redesenha();
		},
		recalcPar: function(){
			g_operacao = "";
			g_tipoacao = "";
			var bounds = i3GeoMap.getBounds();
    		var sw = bounds.getSouthWest();
    		var ne = bounds.getNorthEast();
    		i3GEO.parametros.mapexten = sw.lng()+" "+sw.lat()+" "+ne.lng()+" "+ne.lat();
		}
	},
	/*
	Function: googleearth
	
	Interface baseada no software googlemaps
	
	O objeto criado com a API do google maps pode ser acessado na variável i3GeoMap
	*/
	googleearth:{
		redesenha: function(){
			try{
				
				linki3geo.setHref(linki3geo.getHref()+"&");
			}
			catch(e){};
		},
		cria: function(w,h){
			var i = $i(i3GEO.interface.IDCORPO);
			if(i){
				var i3GeoMap3d = document.createElement("div");
				i3GeoMap3d.style.width = w;
				i3GeoMap3d.style.height = h + 45;
				i.style.height = h + 45;
				i3GeoMap3d.id = "i3GeoMap3d";
				i.appendChild(i3GeoMap3d);
			}
			i3GEO.interface.IDMAPA = "i3GeoMap3d";
			google.load("earth", "1");
			var i3GeoMap = null;
		},
		inicia: function(){
			google.earth.createInstance("i3GeoMap3d", i3GEO.interface.googleearth.iniciaGE, i3GEO.interface.googleearth.falha);
		},
		iniciaGE: function(object){
  			i3GeoMap = object;
  			i3GeoMap.getWindow().setVisibility(true);
  			kmlUrl = i3GEO.configura.locaplic+"/pacotes/kmlmapserver/kmlservice.php?map="+i3GEO.parametros.mapfile+"&typename=estadosl&request=kml&mode=map&"
  			//alert(kmlUrl)
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
		falha: function(){alert("Falhou. Vc precisa do plugin instalado");},
		ativaBotoes: function(){}
	}
};
//YAHOO.log("carregou classe interface", "Classes i3geo");