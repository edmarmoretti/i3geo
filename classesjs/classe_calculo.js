/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Cálculos

Arquivo:

i3geo/classesjs/classe_calculo.js

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
Classe: i3GEO.calculo

Utilitários para cálculos.
*/
i3GEO.calculo = {
	/*
	Function: dms2dd
	
	Converte coordenadas formatadas em DMS para DD
	
	Parametros:
	
	cd {Numeric} - grau (com sinal de - para sul e oeste)
	
	cm {Numeric} - minuto
	
	cs {Numeric} - segundo
	
	Return:
	
	{Numeric} - Coordenada em décimos de grau.
	*/
	dms2dd: function(cd,cm,cs){
		try
		{
			//YAHOO.log("dms2dd", "i3geo");
			//converte dms em dd
			var sinal,spm,mpg,dd;
			sinal = 'positivo';
			if (cd < 0)
			{
				cd = cd * -1;
				sinal = 'negativo';
			}
			spm = cs / 3600;
			mpg = cm / 60;
			dd = (cd * 1) + (mpg * 1) + (spm * 1);
			if (sinal == 'negativo')
			{dd = dd * -1;}
			//YAHOO.log("Fim dms2dd", "i3geo");
			return (dd);
		}
		catch(e){return (0);}
	},
	/*
	Function: dd2tela

	Converte coordenadas dd em coordenadas de tela.

	Parametros:

	vx {Numeric} - coordenada x.

	vy {Numeric} - coordenada y.

	docmapa - objeto DOM que contém o objeto imagem
	
	ext {String} - (opcional) extensão geográfica (espaço como separador) xmin ymin xmax ymax
	
	cellsize {Numeric} - (opcional) tamanho no terreno em DD de cada pixel da imagem

	Returns:

	{Array} - Array com o valor de x [0] e y [1]
	*/
	dd2tela: function (vx,vy,docmapa,ext,cellsize){
		try{
			var pos,latlng,xyn,dc,imgext,c,xy;
			if(i3GEO.Interface.ATUAL == "googlemaps"){
				pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
				xyn = i3GeoMapOverlay.getProjection().fromLatLngToContainerPixel(new google.maps.LatLng(vy,vx));
				xy = [];
				console.info(xyn.x);
				return [(xyn.x)+pos[0],(xyn.y)+pos[1]];
			}
			if(i3GEO.Interface.ATUAL == "openlayers" && docmapa.id != "mapaReferencia"){
				pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
				xy = i3geoOL.getViewPortPxFromLonLat(new OpenLayers.LonLat(vx,vy));
				return [(xy.x)+pos[0],(xy.y)+pos[1]];
			}
			if(arguments.length == 3){
				ext = i3GEO.parametros.mapexten;
				cellsize = i3GEO.parametros.pixelsize;
			}
			if(arguments.length == 4){
				cellsize = i3GEO.parametros.pixelsize;
			}
			if(!docmapa)
			{docmapa = window.document;}
			dc = docmapa;	
			pos = i3GEO.util.pegaPosicaoObjeto(dc);
			imgext = ext.split(" ");
			vx = (vx * 1) - (imgext[0] * 1);
			vy = (vy * -1) + (imgext[3] * 1);
			c = cellsize * 1;
			//var xy = [];
			return [(vx  / c) + pos[0],(vy / c) + pos[1]];
		}
		catch(e){return([]);}
	},
	/*
	Function: dd2dms

	Converte coordenadas de dd em dms.

	Parametros:

	x {Numeric} - coordenada x.

	y {Numeric} - coordenada y.

	Returns:

	{Array} - Array com o valor de x [0] e y [1] no formato dd mm ss
	*/
	dd2dms: function(x,y){
		var restod,mx,sx,mm,restos,my,sy,s,dx,dy;
		dx = parseInt(x,10);
		if (dx > 0)
		{restod = x - dx;}
		if (dx < 0)
		{restod = (x * -1) - (dx * -1);}
		if (restod !== 0){
			mm = restod * 60;
			mx = parseInt(restod * 60,10);
			restos = mm - mx;
			if (restos !== 0){
				s = restos * 60;
				s = (s+"_").substring(0,5);
				sx = s;
			}
		}
		else{
			mx = "00";
			sx = "00.00";
		}
		dy = parseInt(y,10);
		if (dy > 0)
		{restod = y - dy;}
		if (dy < 0)
		{restod = (y * -1) - (dy * -1);}
		if (restod !== 0){
			mm = restod * 60;
			my = parseInt(restod * 60,10);
			restos = mm - my;
			if (restos !== 0){
				s = restos * 60;
				s = (s+"_").substring(0,5);
				sy = s;
			}
		}
		else{
			my = "00";
			sy = "00.00";
		}
		return [dx+" "+mx+" "+sx,dy+" "+my+" "+sy];
	},
	/*
	Function: tela2dd

	Converte o x,y de unidades de tela para décimo de grau.

	Parametros:

	xfign {Numeric} - x em valores de imagem.

	yfign {Numeric} - y em coordenadas de imagem.

	g_celula {Numeric} - tamanho no terreno do pixel da imagem em dd.

	imgext {String} - extensão geográfica do mapa.

	Returns:

	{Array} - Coordena em dd x[0] e y[1].
	*/
	tela2dd: function(xfign,yfign,g_celula,imgext){
		try
		{
			var amext,longdd,latdd;
			if(i3GEO.Interface.ATUAL == "googlemaps"){
				amext = i3GeoMapOverlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(xfign,yfign));
				return [amext.lng(),amext.lat()];
			}
			if(i3GEO.Interface.ATUAL == "openlayers"){
				amext = i3geoOL.getLonLatFromPixel(new OpenLayers.Pixel(xfign,yfign));
				return [amext.lon,amext.lat];
			}
			if (navm){
				xfign = xfign - 2.2;
				yfign = yfign - 2.7;
			}
			else{
				xfign = xfign - 0.12;
				yfign = yfign - 1.05;
			}
			amext = imgext.split(" ");
			longdd = (amext[0] * 1) + (g_celula * xfign);
			latdd = (amext[3] * 1) - (g_celula * yfign);
			return [longdd,latdd];
		}
		catch(e){return(0);}
	},
	/*
	Function area

	Calcula a área de um polígono.

	Os pontos são obtidos do objeto pontos

	Para o cálculo da área, é feito o cálculo do número de pixel abrangido pelo polígono e multiplicado pela resolução de cada pixel.

	Referência - http://www.mail-archive.com/mapserver-users@lists.umn.edu/msg07052.html
	
	Parametros:
	
	pontos {Array} - array com a lista de pontos pontos.xtela corresponde a um array com os valores de x e pontos.ytela aos valores de y
	
	pixel {Numeric} - área de cada pixel no mapa
	
	Return:
	
	Type:
	{Numeric}
	*/
	area: function(pontos,pixel){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculo.area()");}
		var $polygon_area,$i,$array_length;
		try{
			if(pontos.xpt.length > 2){
				$array_length = pontos.xpt.length;
				pontos.xtela.push(pontos.xtela[0]);
				pontos.ytela.push(pontos.ytela[0]);
				$polygon_area = 0;
				for ($i=0;$i < $array_length;$i++)
				{$polygon_area += ((pontos.xtela[$i] * pontos.ytela[$i+1])-(pontos.ytela[$i] * pontos.xtela[$i+1]));}
				$polygon_area = Math.abs($polygon_area) / 2;
			}
			else
			{$polygon_area = 0;}
			return $polygon_area*pixel;
		}
		catch(e){return (0);}
	},
	/*
	Function: distancia

	Calcula a distância em km entre dois pontos.

	Baseado no site http://www.movable-type.co.uk/scripts/latlong.html (indicado por louriques@yahoo.com.br)
	
	Em versões anteriores utilizava-se o cálculo proposto em http://www.wcrl.ars.usda.gov/cec/java/lat-long.htm
	
	Parametros:

	lon1 {Numeric} - x inicial.

	lat1 {Numeric} - y inicial

	lon2 {Numeric} - x final

	lat2 {Numeric} - y final
	
	Return:
	
	Type:
	{Numeric}
	*/	
	distancia: function(lon1,lat1,lon2,lat2){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculo.distancia()");}
		var dLat,dLon,a,c,d;
		dLat = ((lat2-lat1))* Math.PI / 180;
		dLon = ((lon2-lon1)) * Math.PI / 180; 
		a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       	Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
       	Math.sin(dLon/2) * Math.sin(dLon/2); 
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		d = 6371 * c;
		return d;
	},
	/*
	Function: direcao

	Calcula a direção (0 a 360 graus) entre dois pontos.

	Baseado no site http://www.movable-type.co.uk/scripts/latlong.html (indicado por louriques@yahoo.com.br)
	
	Parametros:

	lon1 {Numeric} - x inicial.

	lat1 {Numeric} - y inicial

	lon2 {Numeric} - x final

	lat2 {Numeric} - y final
	
	Return:
	
	Ângulo em décimos de grau
	
	Type:
	{Numeric}
	*/	
	direcao: function(lon1,lat1,lon2,lat2){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculo.direcao()");}
		var dLon,y,x,r;
		lat1 = lat1 * (Math.PI / 180);
		lat2 = lat2 * (Math.PI / 180);
		dLon = (lon2-lon1) * (Math.PI / 180);
		y = Math.sin(dLon) * Math.cos(lat2);
		x = Math.cos(lat1)*Math.sin(lat2) -
		Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
		r = Math.atan2(y, x);
		r = r  * 180 / Math.PI;
		r = r + 360;
		return r % 360;
	},
	/*
	Function: destinoDD
	
	Calcula as coordenadas de um novo ponto em função da posição de um ponto de origem, distância e direção
	
	O novo ponto é calculado em coordenadas geográficas em DD
	
	Baseado no site http://www.movable-type.co.uk/scripts/latlong.html (indicado por louriques@yahoo.com.br)
	
	Parametros:
	
	lon {Numeric} - longitude (x) do ponto de origem
	
	lat {Numeric} - latitude do ponto de origem
	
	d {Numeric} - distância em Km
	
	direção {Numeric} - ângulo desejado em décimos de grau (direção de 0 a 360)
	
	Return:
	
	Array com a longitude e latitude em décimos de grau ([0] = longitude, [1] = latitude
	
	Type:
	{Array}
	*/
	destinoDD: function(lon,lat,d,direcao){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculo.destinoDD()");}
		var R,lat1,lon1,brng,lat2,lon2;
		R = 6371; // earth's mean radius in km
  		lat1 = lat * (Math.PI / 180);
  		lon1 = lon * (Math.PI / 180);
  		brng = direcao * (Math.PI / 180);
		lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
		lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
		lon2 = (lon2+Math.PI)%(2*Math.PI) - Math.PI;  // normalise to -180...+180
		if (isNaN(lat2) || isNaN(lon2))
		{return null;}
		return [(lon2 * 180 / Math.PI),(lat2 * 180 / Math.PI)];
	},
	/*
	Function: rect2ext
	
	Calcula a extensão geográfica de um retângulo desenhado sobre o mapa.
	
	Parametros:
	
	idrect - id do elemento html com o retangulo
	
	mapext - extensao geografica do mapa onde está o retangulo
	
	pixel - tamanho do pixel do mapa em dd
	
	return:
	
	{Array} - extensão, xmin, ymin, xmax, ymax
	*/
	rect2ext: function(idrect,mapext,pixel){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculo.rect2ext()");}
		var bx,bxs,xfig,yfig,nx,ny,pix,piy,pos,amext,dx,dy,x1,y1,x2,y2;
		eval ('pix = parseInt(document.getElementById("'+idrect+'").style.' + g_tipoleft + ")");
		eval ('piy = parseInt(document.getElementById("'+idrect+'").style.' + g_tipotop + ")");
		if($i(idrect)){
			bx = $i(idrect);
			bxs = bx.style;
		}
		else
		{alert("Box nao encontrado");return;}
		pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
		xfig = pix + (parseInt(bxs.width,10)) - pos[0];
		yfig = piy + (parseInt(bxs.height,10)) - pos[1];
		amext = mapext.split(" ");
		dx = ((amext[0] * -1) - (amext[2] * -1)) / -1;
		dy = ((amext[1] * 1) - (amext[3] * 1)) / -1;
		if (dy < 0)
		{dy=dy * -1;}
		nx = pixel * xfig;
		ny = pixel * yfig;
		x1 = (amext[0] * 1) + nx;
		y1 = (amext[3] * 1) - ny;
		xfig = pix - pos[0];
		yfig = piy - pos[1];
		if (dy < 0)
		{dy=dy * -1;}
		nx = pixel * xfig;
		ny = pixel * yfig;
		x2 = (amext[0] * 1) + nx;
		y2 = (amext[3] * 1) - ny;
		return [x2+" "+y2+" "+x1+" "+y1,x1,y1,x2,y2];
	},
	/*
	Function: ext2rect
	
	Calcula o posicionamento de um retângulo com base na extensão geográfica.
	
	Parametros:
	
	idrect {String} - id do elemento html com o retangulo, pode ser vazio
	
	mapext {String} - extensao geografica do mapa onde está o retangulo
	
	boxext {String} - extensao geografica do retangulo
	
	pixel {Number} - tamanho do pixel do mapa em dd
	
	documento {Object DOM} - objeto sob o qual o retângulo será posicionado
	
	Return:
	
	{Array} - width,heigth,top,left
	*/
	ext2rect: function(idrect,mapext,boxext,pixel,documento){
   		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculo.ext2rect()");}
   		var rectbox,rectmap,xyMin,xyMax,w,h,tl,pos,t,l,d,box;
   		rectbox = boxext.split(" ");
   		rectmap = mapext.split(" ");
   		xyMin = i3GEO.calculo.dd2tela(rectbox[0],rectbox[1],documento,boxext,pixel);
   		xyMax = i3GEO.calculo.dd2tela(rectbox[2],rectbox[3],documento,boxext,pixel);
		w = xyMax[0]-xyMin[0];
		h = xyMin[1]-xyMax[1];
   		tl = i3GEO.calculo.dd2tela(rectbox[0],rectbox[3],documento,mapext,pixel);  		
		pos = i3GEO.util.pegaPosicaoObjeto(documento);
		t = tl[1] - pos[1];
		l = tl[0] - pos[0];
		d = "block";
		if($i(idrect)){
			box = $i(idrect);
			box.style.width = w;
			box.style.height = h;
			box.style.top = t + "px";
			box.style.left = l + "px";
   			box.style.display=d;
   		}
		return [w,h,xyMax[1],xyMin[0]];
	}
};
//YAHOO.log("carregou classe calculo", "Classes i3geo");