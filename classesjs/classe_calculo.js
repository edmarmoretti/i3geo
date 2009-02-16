/*
Title: Cálculos

File: i3geo/classesjs/classe_calculo.js

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
Class: i3GEO.calculo

Utilitários para cálculos.
*/
i3GEO.calculo = {
	/*
	Function: dms2dd
	
	Converte coordenadas formatadas em DMS para DD
	
	Parameters:
	
	cd {Numeric} - grau
	
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

	Parameters:

	vx {Numeric} - coordenada x.

	vy {Numeric} - coordenada y.

	docmapa - objeto DOM que contém o objeto imagem
	
	ext {String} - extensão geográfica (espaço como separador) xmin ymin xmax ymax
	
	cellsize {Numeric} - tamanho no terreno em DD de cada pixel da imagem

	Returns:

	{Array} - Array com o valor de x [0] e y [1]
	*/
	dd2tela: function (vx,vy,docmapa,ext,cellsize){
		try
		{
			if(i3GEO.interface.ATUAL == "googlemaps"){
				var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));
				var latlng = new GLatLng(vy,vx);
				var xyn = i3GeoMap.fromLatLngToContainerPixel(latlng);
				var xy = new Array();
				return [(xyn.x)+pos[0],(xyn.y)+pos[1]];
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
			var dc = docmapa.getElementById("img");
			if(!dc){var dc = docmapa;}
			var pos = i3GEO.util.pegaPosicaoObjeto(dc);
			var imgext = ext; //i3GEO.parametros.mapexten;
			var imgext = imgext.split(" ");
			vx = (vx * 1) - (imgext[0] * 1);
			vy = (vy * -1) + (imgext[3] * 1);
			c = cellsize * 1;
			var xy = new Array();
			return [(vx  / c) + pos[0],(vy / c) + pos[1]];
		}
		catch(e){return(new Array());}
	},
	/*
	Function: dd2dms

	Converte coordenadas de dd em dms.

	Parameters:

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
		var res = new Array();
		res[0] = xv;
		res[1] = yv;
		return res;
	},
	/*
	Function: tela2dd

	Converte o x,y de unidades de tela para décimo de grau.

	Parameters:

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
			var res = new Array();
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
	
	Parameters:
	
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

	Calcula a distância entre dois pontos.
	
	Baseado no site http://www.wcrl.ars.usda.gov/cec/java/lat-long.htm

	Parameters:

	lga {Numeric} - x inicial.

	lta {Numeric} - y inicial

	lgb {Numeric} - x final

	ltb {Numeric} - y final
	
	Return:
	
	Type:
	{Numeric}
	*/	
	distancia: function(lga,lta,lgb,ltb){
		try{
			var er = 6366.707;
			var radlat1 = Math.PI * lta/180;
			var radlat2 = Math.PI * ltb/180;
			var radlong1 = Math.PI * lga/180;
			var radlong2 = Math.PI * lgb/180;
			if (lta > 0) {radlat1=Math.PI/2-radlat1;}
			if (lta < 0) {radlat1=Math.PI/2+radlat1;}
			if (lga < 0) {radlong1=Math.PI*2-radlong1;}
			if (ltb > 0) {radlat2=Math.PI/2-radlat2;}
			if (ltb < 0) {radlat2=Math.PI/2+radlat2;}
			if (lgb < 0) {radlong2=Math.PI*2-radlong2;}
			var x1 = er * Math.cos(radlong1)*Math.sin(radlat1);
			var y1 = er * Math.sin(radlong1)*Math.sin(radlat1);
			var z1 = er * Math.cos(radlat1);
			var x2 = er * Math.cos(radlong2)*Math.sin(radlat2);
			var y2 = er * Math.sin(radlong2)*Math.sin(radlat2);
			var z2 = er * Math.cos(radlat2);
			var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
			//side, side, side, law of cosines and arccos
			var theta = Math.acos((er*er+er*er-d*d)/(2*er*er));
			return theta*er;
		}
		catch(e){return (0);}
	},
	/*
	Function: rect2ext
	
	Calcula a extensão geográfica de um retângulo desenhado sobre o mapa.
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
		var pos = i3GEO.util.pegaPosicaoObjeto($i("img"));
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
		var nx = i3GEO.parametros.pixelsize * xfig;
		var ny = i3GEO.parametros.pixelsize * yfig;
		var x2 = (amext[0] * 1) + nx;
		var y2 = (amext[3] * 1) - ny;
		var v = x2+" "+y2+" "+x1+" "+y1;
		var res = new Array(v,x1,y1,x2,y2);
		return (res);
	}
};
//YAHOO.log("carregou classe calculo", "Classes i3geo");