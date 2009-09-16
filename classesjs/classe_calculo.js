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
			var sinal = 'positivo';
			if (cd < 0)
			{
				cd = cd * -1;
				sinal = 'negativo';
			}
			spm = cs / 3600;
			mpg = cm / 60;
			var dd = (cd * 1) + (mpg * 1) + (spm * 1);
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
			if(i3GEO.Interface.ATUAL == "googlemaps"){
				var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
				var latlng = new GLatLng(vy,vx);
				var xyn = i3GeoMap.fromLatLngToContainerPixel(latlng);
				var xy = [];
				return [(xyn.x)+pos[0],(xyn.y)+pos[1]];
			}
			if(i3GEO.Interface.ATUAL == "openlayers"){
				var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
				var xy = i3geoOL.getViewPortPxFromLonLat(new OpenLayers.LonLat(vx,vy));
				return [(xy.x)+pos[0],(xy.y)+pos[1]];
			}
			if(arguments.length == 3){
				var ext = i3GEO.parametros.mapexten;
				var cellsize = i3GEO.parametros.pixelsize;
			}
			if(arguments.length == 4){
				var cellsize = i3GEO.parametros.pixelsize;
			}

			if(!docmapa)
			{var docmapa = window.document;}
			var dc = docmapa;	
			var pos = i3GEO.util.pegaPosicaoObjeto(dc);
			var imgext = ext; //i3GEO.parametros.mapexten;
			var imgext = imgext.split(" ");
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
		var m = 0;
		var s = 0;
		var dx = parseInt(x);
		if (dx > 0)
		{var restod = x - dx;}
		if (dx < 0)
		{restod = (x * -1) - (dx * -1);}
		dx = dx;
		if (restod != 0){
			var mm = restod * 60;
			var m = parseInt(restod * 60);
			var restos = mm - m;
			var mx = m;
			if (restos != 0){
				var s = restos * 60;
				var s = (s+"_").substring(0,5);
				var sx = s;
			}
			else  { s = "00.00" }
		}
		else{
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
		if (restod != 0){
			var mm = restod * 60;
			var m = parseInt(restod * 60);
			var restos = mm - m;
			var my = m;
			if (restos != 0){
				var s = restos * 60;
				s = (s+"_").substring(0,5);
				var sy = s;
			}
			else  { var s = "00.00";}
		}
		else{
			var my = "00";
			var sy = "00.00";
		}
		if (m.length == 2){m = "0"+m;}
		if (s*1 < 10){s = "0"+s;}
		var yv = dy+" "+my+" "+sy;
		var res = [];
		res[0] = xv;
		res[1] = yv;
		return res;
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
			if (navm){
				xfign = xfign - 2.2;
				yfign = yfign - 2.7;
			}
			else{
				xfign = xfign - 0.12;
				yfign = yfign - 1.05;
			}
			var nx = g_celula * xfign;
			var ny = g_celula * yfign;
			var amext = imgext.split(" ");
			var longdd = (amext[0] * 1) + nx;
			var latdd = (amext[3] * 1) - ny;
			var res = [];
			res[0] = longdd;
			res[1] = latdd;
			return (res);
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
		try{
			if(pontos.xpt.length > 2){
				var $array_length = pontos.xpt.length;
				pontos.xtela.push(pontos.xtela[0]);
				pontos.ytela.push(pontos.ytela[0]);
				pontos.xtela.push(pontos.xtela[0]);
				pontos.ytela.push(pontos.ytela[1]);
				var $polygon_area = 0;
				for (var $i=0;$i <= $array_length;$i++)
				{$polygon_area += ((pontos.xtela[$i] * pontos.ytela[$i+1])-(pontos.ytela[$i] * pontos.xtela[$i+1]));}
				$polygon_area = Math.abs($polygon_area) / 2;
			}
			else
			{$polygon_area = "Sao necessarios pelo menos tres pontos para o calculo";}
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
		var R = 6371; // km
		var dLat = ((lat2-lat1))* Math.PI / 180;
		var dLon = ((lon2-lon1)) * Math.PI / 180; 
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       	Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
       	Math.sin(dLon/2) * Math.sin(dLon/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
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
		lat1 = lat1 * (Math.PI / 180);
		lat2 = lat2 * (Math.PI / 180);
		var dLon = (lon2-lon1) * (Math.PI / 180);
		var y = Math.sin(dLon) * Math.cos(lat2);
		var x = Math.cos(lat1)*Math.sin(lat2) -
		Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
		var r = Math.atan2(y, x);
		var r = r  * 180 / Math.PI;
		var r = r + 360;
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
		var R = 6371; // earth's mean radius in km
  		var lat1 = lat * (Math.PI / 180);
  		var lon1 = lon * (Math.PI / 180);
  		var brng = direcao * (Math.PI / 180);
		var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
		var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
		lon2 = (lon2+Math.PI)%(2*Math.PI) - Math.PI;  // normalise to -180...+180
		if (isNaN(lat2) || isNaN(lon2)) return null;
		return new Array((lon2 * 180 / Math.PI),(lat2 * 180 / Math.PI));
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
		eval ('pix = parseInt(document.getElementById("'+idrect+'").style.' + g_tipoleft + ")");
		eval ('piy = parseInt(document.getElementById("'+idrect+'").style.' + g_tipotop + ")");
		if($i(idrect)){
			var bx = $i(idrect);
			var bxs = bx.style;
		}
		else
		{alert("Box nao encontrado");return;}
		var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
		var xfig0 = parseInt(bxs.width) - pos[0];
		var yfig0 = parseInt(bxs.height) - pos[1];
		var xfig = pix + (parseInt(bxs.width)) - pos[0];
		var yfig = piy + (parseInt(bxs.height)) - pos[1];
		var amext = mapext.split(" ");
		var dx = ((amext[0] * -1) - (amext[2] * -1)) / -1;
		var dy = ((amext[1] * 1) - (amext[3] * 1)) / -1;
		if (dy < 0) dy=dy * -1;
		var nx = pixel * xfig;
		var ny = pixel * yfig;
		var x1 = (amext[0] * 1) + nx;
		var y1 = (amext[3] * 1) - ny;
		var xfig = pix - pos[0];
		var yfig = piy - pos[1];
		if (dy < 0) dy=dy * -1;
		var nx = pixel * xfig;
		var ny = pixel * yfig;
		var x2 = (amext[0] * 1) + nx;
		var y2 = (amext[3] * 1) - ny;
		var v = x2+" "+y2+" "+x1+" "+y1;
		var res = new Array(v,x1,y1,x2,y2);
		return (res);
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
   		var rectbox = boxext.split(" ");
   		var rectmap = mapext.split(" ");
   		var xyMin = i3GEO.calculo.dd2tela(rectbox[0],rectbox[1],documento,boxext,pixel);
   		var xyMax = i3GEO.calculo.dd2tela(rectbox[2],rectbox[3],documento,boxext,pixel);
		var w = xyMax[0]-xyMin[0];
		var h = xyMin[1]-xyMax[1];
   		var tl = i3GEO.calculo.dd2tela(rectbox[0],rectbox[3],documento,mapext,pixel);  		
		var pos = i3GEO.util.pegaPosicaoObjeto(documento);
		var t = tl[1] - pos[1];
		var l = tl[0] - pos[0];
		var d = "block";
		if($i(idrect)){
			var box = $i(idrect);
			box.style.width = w;
			box.style.height = h;
			box.style.top = t + "px";
			box.style.left = l + "px";
   			box.style.display=d;
   		}
		return new Array(w,h,xyMax[1],xyMin[0]);
	}
};
//YAHOO.log("carregou classe calculo", "Classes i3geo");