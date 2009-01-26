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
	padrao:{
		redesenha:function(){
			$i("img").onload =  function()
			{
				$i("img").onload = "";
				//atualiza quadro
				i3GEO.gadgets.quadros.grava("imagem",objmapa.mapimagem);
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
				$i("imgtemp").style.width = objmapa.w;
				$i("imgtemp").style.height = objmapa.h;
				$i("imgtemp").style.display="block";
				$i("imgtemp").style.backgroundImage = 'url("'+$i("img").src+'")';
			}		
			$i("img").style.left = 0;
			$i("img").style.top = 0;
			$i("img").src=objmapa.mapimagem;
		},
		cria:function(){
			var ins = "<table>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN' /></td><td class=verdeclaro ></td></tr>";
			ins += "<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL' /></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img' /></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO' /></td></tr>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS' /></td><td class=verdeclaro ></td></tr>";
			ins += "</table>";
			$i(i3GEO.interface.IDCORPO).innerHTML = ins;		
		},
		inicia:function(){
			var i = $i("img");
			i.style.width=objmapa.w +"px";
			i.style.height=objmapa.h +"px";
			var estilo = $i(i3GEO.interface.IDCORPO).style;
			estilo.width=objmapa.w +"px";
			estilo.height=objmapa.h +"px";
			estilo.clip = 'rect('+0+" "+(objmapa.w)+" "+(objmapa.h)+" "+0+')';
			objmapa.parado = "nao"; //utilizado para verificar se o mouse esta parado
			i3GEO.eventos.ativa(i);	
		}
	},
	/*
	Function: flamingo
	
	Interface baseada no software flamingo (flash)
	*/
	flamingo:{
		redesenha: function(){
			var w = parseInt($i("flamingo").style.width);
			if (w == objmapa.w)
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
			}
		},
		inicia: function(){
			var monta = function(retorno){
				$i("flamingo").style.height = objmapa.h + 45;
				childPopups  = new Array();
				childPopupNr = 0;
				var so = new SWFObject(i3GEO.configura.locaplic+"/pacotes/flamingo/flamingo/flamingo.swf?config="+retorno.data, "flamingoi", "100%", "100%", "8", "#eaeaea");
				so.addParam("wmode","window"); 
				so.write("flamingo");
			}
			i3GEO.php.flamingo(monta);
		}
	},
	/*
	Function: openlayers
	
	Interface baseada no software openlayers
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
		},
		inicia: function(){
			var montaMapa = function(){
				var url = window.location.protocol+"//"+window.location.host+objmapa.cgi+"?";
				url += "map="+objmapa.mapfile+"&mode=map&SRS=epsg:4326&";
				i3geoOL = new OpenLayers.Map('openlayers', { controls: [] });
				i3geoOLlayer = new OpenLayers.Layer.WMS( "Temas I3Geo", url,{layers:'estadosl'},{'buffer':0},{isBaseLayer:true, opacity: 1});
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
				$i("OpenLayers_Control_PanZoom_pandown").style.top=parseInt($i("OpenLayers_Control_PanZoom_pandown").style.top)+5;
				$i("OpenLayers_Control_PanZoom_panup").style.top=parseInt($i("OpenLayers_Control_PanZoom_panup").style.top)+5;
				$i("OpenLayers_Control_PanZoom_panleft").style.top=parseInt($i("OpenLayers_Control_PanZoom_panleft").style.top)+5;
				$i("OpenLayers_Control_PanZoom_panright").style.top=parseInt($i("OpenLayers_Control_PanZoom_panright").style.top)+5;
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

    			botoesadic.addControls([
       				new OpenLayers.Control.ZoomToMaxExtent()
    			]);
    			i3geoOL.addControl(botoesadic);
    			botoesadic.div.style.left="10px";
    			botoesadic.div.style.top=parseInt($i("OpenLayers_Control_PanZoom_zoomout").style.top)+77;
	
				i3geoOL.addControl(new OpenLayers.Control.LayerSwitcher());

				var m = objmapa.extent.split(" ");
				var b = new OpenLayers.Bounds(m[0],m[1],m[2],m[3]);
				i3geoOL.zoomToExtent(b);

				i3geoOL.addControl(new OpenLayers.Control.Scale("escalanumerica"));
				i3geoOL.addControl(new OpenLayers.Control.KeyboardDefaults());	
				//var ol_overview = new OpenLayers.Layer.WMS( "OpenLayers WMS", "http://labs.metacarta.com/wms/vmap0",{layers: 'basic'});
				//var options = {layers: [ol_overview],minRatio: 8,maxRatio: 128};
				//var overview = new OpenLayers.Control.OverviewMap(options);
				//i3geoOL.addControl(overview);
				i3GEO.eventos.ativa($i("openlayers"));
			};
			i3GEO.php.openlayers(montaMapa);
		}
	}

}