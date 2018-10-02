/**
 * Title: C&aacute;lculos
 *
 * Utilit&aacute;rios para c&aacute;lculos.
 *
 * Namespace:
 *
 * i3GEO.calculo
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_calculo.js>
 */

/**
 *
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.calculo =
{
	/**
	 * Propriedade: metododistancia
	 *
	 * M&eacute;todo utilizado no c&aacute;lculo de distâncias
	 *
	 * vicenty|haversine
	 *
	 * Default: {vicenty}
	 */
	metododistancia : "vicenty",
	/**
	 * Function: dms2dd
	 *
	 * Converte coordenadas formatadas em DMS para DD
	 *
	 * Parametros:
	 *
	 * {Numeric} - grau (com sinal de - para sul e oeste)
	 *
	 * {Numeric} - minuto
	 *
	 * {Numeric} - segundo
	 *
	 * Return:
	 *
	 * {Numeric} - Coordenada em d&eacute;cimos de grau.
	 */
	dms2dd : function(cd, cm, cs) {
	    cd = cd.replace(",",".");
	    cm = cm.replace(",",".");
	    cs = cs.replace(",",".");
	    try {
		// converte dms em dd
		var sinal, spm, mpg, dd;
		sinal = 'positivo';
		if (cd < 0) {
		    cd = cd * -1;
		    sinal = 'negativo';
		}
		spm = cs / 3600;
		mpg = cm / 60;
		dd = (cd * 1) + (mpg * 1) + (spm * 1);
		if (sinal === 'negativo') {
		    dd = dd * -1;
		}
		return (dd);
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error(e.message)

		    return (0);
	    }
	},
	/**
	 * Function: dd2tela
	 *
	 * Converte coordenadas dd em coordenadas de tela.
	 *
	 * Parametros:
	 *
	 * {Numeric} - coordenada x.
	 *
	 * {Numeric} - coordenada y.
	 *
	 * {objeto} - objeto DOM que cont&eacute;m o objeto imagem
	 *
	 * {String} - (opcional) extens&atilde;o geogr&aacute;fica (espa&ccedil;o como separador) xmin ymin xmax ymax
	 *
	 * {Numeric} - (opcional) tamanho no terreno em DD de cada pixel da imagem
	 *
	 * Return:
	 *
	 * {Array} - Array com o valor de x [0] e y [1]
	 */
	dd2tela : function(vx, vy, docmapa, ext, cellsize) {
	    try {
		var pos, xyn, dc, imgext, c, xy;
		if (i3GEO.Interface.ATUAL === "googlemaps" && docmapa.id !== "mapaReferencia") {
		    pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
		    xyn = i3GeoMapOverlay.getProjection().fromLatLngToContainerPixel(new google.maps.LatLng(vy, vx));
		    xy = [];
		    return [
			(xyn.x) + pos[0],
			(xyn.y) + pos[1]
			];
		}
		if (i3GEO.Interface.ATUAL === "openlayers" && docmapa.id !== "mapaReferencia") {
		    pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
		    xy = i3GEO.util.extGeo2OSM(vx + " " + vy, true);
		    xy = i3geoOL.getPixelFromCoordinate([xy[0]*1, xy[1]*1]);
		    return [
			(xy[0]) + pos[0],
			(xy[1]) + pos[1]
			];
		}
		if (arguments.length === 3) {
		    ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		    cellsize = i3GEO.parametros.pixelsize;
		}
		if (arguments.length === 4) {
		    cellsize = i3GEO.parametros.pixelsize;
		}
		if (!docmapa) {
		    docmapa = window.document;
		}
		dc = docmapa;
		pos = i3GEO.util.pegaPosicaoObjeto(dc);
		imgext = ext.split(" ");
		vx = (vx * 1) - (imgext[0] * 1);
		vy = (vy * -1) + (imgext[3] * 1);
		c = cellsize * 1;
		return [
		    (vx / c) + pos[0],
		    (vy / c) + pos[1]
		    ];
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error(e.message)

		    return ([]);
	    }
	},
	/**
	 * Function: dd2dms
	 *
	 * Converte coordenadas de dd em dms.
	 *
	 * Parametros:
	 *
	 * {Numeric} - coordenada x.
	 *
	 * {Numeric} - coordenada y.
	 *
	 * Return:
	 *
	 * {Array} - Array com o valor de x [0] e y [1] no formato dd mm ss
	 */
	dd2dms : function(x, y) {
	    var res, restod = 0, sx = "00.00", sy = "00.00", mx, mm, restos, my, s, dx, dy;
	    dx = parseInt(x, 10);
	    if (x > 0) {
		restod = x - dx;
	    }
	    if (x < 0) {
		restod = (x * -1) - (dx * -1);
	    }
	    if (restod !== 0) {
		mm = restod * 60;
		mx = parseInt(restod * 60, 10);
		restos = mm - mx;
		if (restos !== 0) {
		    s = restos * 60;
		    s = (s + "").substring(0, 5);
		    sx = s;
		}
	    } else {
		mx = "00";
		sx = "00.00";
	    }
	    dy = parseInt(y, 10);
	    if (y > 0) {
		restod = y - dy;
	    }
	    if (y < 0) {
		restod = (y * -1) - (dy * -1);
	    }
	    if (restod !== 0) {
		mm = restod * 60;
		my = parseInt(restod * 60, 10);
		restos = mm - my;
		if (restos !== 0) {
		    s = restos * 60;
		    s = (s + "").substring(0, 5);
		    sy = s;
		}
	    } else {
		my = "00";
		sy = "00.00";
	    }
	    if(y < 0 && y > -1){
		dy = "-"+dy;
	    }
	    if(x < 0 && x > -1){
		dx = "-"+dx;
	    }
	    res = [
		dx + " " + mx + " " + sx,
		dy + " " + my + " " + sy
		];
	    return res;
	},
	/**
	 * Function: tela2dd
	 *
	 * Converte o x,y de unidades de tela para d&eacute;cimo de grau.
	 *
	 * Parametros:
	 *
	 * {Numeric} - x em valores de imagem.
	 *
	 * {Numeric} - y em coordenadas de imagem.
	 *
	 * {Numeric} - tamanho no terreno do pixel da imagem em dd.
	 *
	 * {String} - extens&atilde;o geogr&aacute;fica do mapa.
	 *
	 * {string} - (opcional) id do objeto que originou o c&aacute;lculo (&eacute; usado para identificar se o c&aacute;lculo
	 * est&aacute; sendo feito sobr o mapa de refer&ecirc;ncia ou n&atilde;o)
	 *
	 * Return:
	 *
	 * {Array} - Coordena em dd x[0] e y[1].
	 */
	tela2dd : function(xfign, yfign, g_celula, imgext, idorigem) {
	    try {
		var amext, longdd, latdd;
		if (i3GEO.Interface.ATUAL === "googlemaps" && arguments.length === 4) {
		    amext = i3GeoMapOverlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(xfign, yfign));
		    return [
			amext.lng(),
			amext.lat()
			];
		}
		if (navm) {
		    xfign = xfign - 2.2;
		    yfign = yfign - 2.7;
		} else {
		    xfign = xfign - 0.12;
		    yfign = yfign - 1.05;
		}
		amext = imgext.split(" ");
		longdd = (amext[0] * 1) + (g_celula * xfign);
		latdd = (amext[3] * 1) - (g_celula * yfign);
		return [
		    longdd,
		    latdd
		    ];
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error(e.message)

		    return (0);
	    }
	},
	/**
	 * Function area
	 *
	 * Calcula a &aacute;rea de um pol&iacute;gono.
	 *
	 * Os pontos s&atilde;o obtidos do objeto pontos
	 *
	 * Para o c&aacute;lculo da &aacute;rea, &eacute; feito o c&aacute;lculo do n&uacute;mero de pixel abrangido pelo pol&iacute;gono e
	 * multiplicado pela resolu&ccedil;&atilde;o de cada pixel.
	 *
	 * Refer&ecirc;ncia - http://www.mail-archive.com/mapserver-users@lists.umn.edu/msg07052.html
	 *
	 * Parametros:
	 *
	 * {Array} - array com a lista de pontos x
	 *
	 * {Array} - array com a lista de pontos y
	 *
	 * {Numeric} - &aacute;rea de cada pixel no mapa
	 *
	 * Return:
	 *
	 * {Numeric}
	 */
	area : function(x, y, pixel) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculo.area()");

	    var n = x.length, $polygon_area, $i;
	    try {
		if (n > 2) {
		    x.push(x[0]);
		    y.push(y[0]);
		    $polygon_area = 0;
		    for ($i = 0; $i < n; $i += 1) {
			$polygon_area += ((x[$i] * y[$i + 1]) - (y[$i] * x[$i + 1]));
		    }
		    $polygon_area = Math.abs($polygon_area) / 2;
		} else {
		    $polygon_area = 0;
		}
		return $polygon_area * pixel;
	    } catch (e) {

		if (typeof (console) !== 'undefined')
		    console.error(e.message)

		    return (0);
	    }
	},
	/**
	 * Function: distancia
	 *
	 * Calcula a distância em km entre dois pontos.
	 *
	 * O m&eacute;todo de c&aacute;lculo &eacute; definido na vari&aacute;vel i3GEO.calculo.metododistancia
	 *
	 * Parametros:
	 *
	 * {Numeric} - x inicial.
	 *
	 * {Numeric} - y inicial
	 *
	 * {Numeric} - x final
	 *
	 * {Numeric} - y final
	 *
	 * Return:
	 *
	 * {Numeric}
	 */
	distancia : function(lon1, lat1, lon2, lat2) {
	    if (i3GEO.calculo.metododistancia === "haversine") {
		return i3GEO.calculo.distHaversine(lon1, lat1, lon2, lat2);
	    }
	    if (i3GEO.calculo.metododistancia === "vicenty") {
		return i3GEO.calculo.distVincenty(lon1, lat1, lon2, lat2);
	    }
	},
	/**
	 * Function: distHaversine
	 *
	 * Calcula a distância em km entre dois pontos (m&eacute;todo Haversine).
	 *
	 * Baseado no site http://www.movable-type.co.uk/scripts/latlong.html (indicado por louriques@yahoo.com.br)
	 *
	 * Em vers&otilde;es anteriores utilizava-se o c&aacute;lculo proposto em http://www.wcrl.ars.usda.gov/cec/java/lat-long.htm
	 *
	 * Parametros:
	 *
	 * {Numeric} - x inicial.
	 *
	 * {Numeric} - y inicial
	 *
	 * {Numeric} - x final
	 *
	 * {Numeric} - y final
	 *
	 * Return:
	 *
	 * {Numeric}
	 */
	distHaversine : function(lon1, lat1, lon2, lat2) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculo.distancia()");

	    var dLat, dLon, a, c, d;
	    dLat = ((lat2 - lat1)) * Math.PI / 180;
	    dLon = ((lon2 - lon1)) * Math.PI / 180;
	    a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
		* Math.sin(dLon / 2) * Math.sin(dLon / 2);
	    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    d = 6378.137 * c;
	    return d;
	},
	/**
	 * Function: distVincenty
	 *
	 * Given two objects representing points with geographic coordinates, this calculates the distance between those points on the
	 * surface of an ellipsoid.
	 *
	 * Baseado em openLayers.Util.distVincenty
	 *
	 * Parametros:
	 *
	 * {Numeric} - x inicial.
	 *
	 * {Numeric} - y inicial
	 *
	 * {Numeric} - x final
	 *
	 * {Numeric} - y final
	 *
	 * Return:
	 *
	 * {Numeric} - The distance (in km) between the two input points as measured on an ellipsoid. Note that the input point objects must
	 * be in geographic coordinates (decimal degrees) and the return distance is in kilometers.
	 */
	distVincenty : function(lon1, lat1, lon2, lat2) {
	    var rad = function(x) {
		return x * Math.PI / 180;
	    }, ct = {
		    a : 6378137,
		    b : 6356752.3142,
		    f : 1 / 298.257223563
	    }, p1 = {
		    lat : lat1,
		    lon : lon1
	    }, p2 = {
		    lat : lat2,
		    lon : lon2
	    }, a = ct.a, b = ct.b, f = ct.f, L = rad(p2.lon - p1.lon), U1 = Math.atan((1 - f) * Math.tan(rad(p1.lat))), U2 =
		Math.atan((1 - f) * Math.tan(rad(p2.lat))), sinU1 = Math.sin(U1), cosU1 = Math.cos(U1), sinU2 = Math.sin(U2), cosU2 =
		    Math.cos(U2), lambda = L, lambdaP = 2 * Math.PI, iterLimit = 20, sinLambda, cosLambda, sinSigma = 0, cosSigma = 0, sigma =
			0, alpha, cosSqAlpha = 0, cos2SigmaM = 0, C, uSq, A, B, s, d, deltaSigma;
	    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
		sinLambda = Math.sin(lambda);
		cosLambda = Math.cos(lambda);
		sinSigma =
		    Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
			    * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
		if (sinSigma === 0) {
		    return 0; // co-incident points
		}
		cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
		sigma = Math.atan2(sinSigma, cosSigma);
		alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
		cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
		cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
		C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
		lambdaP = lambda;
		lambda =
		    L + (1 - C) * f * Math.sin(alpha)
		    * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
	    }
	    if (iterLimit === 0) {
		return NaN; // formula failed to converge
	    }
	    uSq = cosSqAlpha * (a * a - b * b) / (b * b);
	    A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
	    B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
	    deltaSigma =
		B
		* sinSigma
		* (cos2SigmaM + B
			/ 4
			* (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma)
				* (-3 + 4 * cos2SigmaM * cos2SigmaM)));
	    s = b * A * (sigma - deltaSigma);
	    d = s.toFixed(3) / 1000; // round to 1mm precision
	    return d;
	},
	/**
	 * Function: direcao
	 *
	 * Calcula a dire&ccedil;&atilde;o (0 a 360 graus) entre dois pontos.
	 *
	 * Baseado no site http://www.movable-type.co.uk/scripts/latlong.html (indicado por louriques@yahoo.com.br)
	 *
	 * Parametros:
	 *
	 * {Numeric} - x inicial.
	 *
	 * {Numeric} - y inicial
	 *
	 * {Numeric} - x final
	 *
	 * {Numeric} - y final
	 *
	 * Return:
	 *
	 * {Numeric} - &acirc;nngulo em d&eacute;cimos de grau
	 */
	direcao : function(lon1, lat1, lon2, lat2) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculo.direcao()");

	    var dLon, y, x, r;
	    lat1 = lat1 * (Math.PI / 180);
	    lat2 = lat2 * (Math.PI / 180);
	    dLon = (lon2 - lon1) * (Math.PI / 180);
	    y = Math.sin(dLon) * Math.cos(lat2);
	    x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
	    r = Math.atan2(y, x);
	    r = r * 180 / Math.PI;
	    r = r + 360;
	    return r % 360;
	},
	/**
	 * Function: destinoDD
	 *
	 * Calcula as coordenadas de um novo ponto em fun&ccedil;&atilde;o da posi&ccedil;&atilde;o de um ponto de origem, distância e
	 * dire&ccedil;&atilde;o
	 *
	 * O novo ponto &eacute; calculado em coordenadas geogr&aacute;ficas em DD
	 *
	 * Baseado no site http://www.movable-type.co.uk/scripts/latlong.html (indicado por louriques@yahoo.com.br)
	 *
	 * Parametros:
	 *
	 * {Numeric} - longitude (x) do ponto de origem
	 *
	 * {Numeric} - latitude do ponto de origem
	 *
	 * {Numeric} - distância em Km
	 *
	 * {Numeric} - ângulo desejado em d&eacute;cimos de grau (dire&ccedil;&atilde;o de 0 a 360)
	 *
	 * Return:
	 *
	 * {Array} - com a longitude e latitude em d&eacute;cimos de grau ([0] = longitude, [1] = latitude
	 *
	 */
	destinoDD : function(lon, lat, d, direcao) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculo.destinoDD()");

	    var R, lat1, lon1, brng, lat2, lon2;
	    R = 6371; // earth's mean radius in km
	    lat1 = lat * (Math.PI / 180);
	    lon1 = lon * (Math.PI / 180);
	    brng = direcao * (Math.PI / 180);
	    lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));
	    lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1), Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));
	    lon2 = (lon2 + Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180...+180
	    if (isNaN(lat2) || isNaN(lon2)) {
		return null;
	    }
	    return [
		(lon2 * 180 / Math.PI),
		(lat2 * 180 / Math.PI)
		];
	},
	/**
	 * Calcula a extens&atilde;o geogr&aacute;fica de um retângulo desenhado sobre o mapa.
	 *
	 * Parametros:
	 *
	 * {string} - id do elemento html com o retangulo
	 *
	 * {string} - extensao geografica do mapa onde est&aacute; o retangulo
	 *
	 * {inteiro} - tamanho do pixel do mapa em dd
	 *
	 * Return:
	 *
	 * {Array} - extens&atilde;o, xmin, ymin, xmax, ymax
	 */
	rect2ext : function(idrect, mapext, pixel) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculo.rect2ext()");

	    var bx, bxs, xfig, yfig, nx, ny, pos, amext, dy, x1, y1, x2, y2, pix = parseInt(document.getElementById(idrect).style.left, 10), piy =
		parseInt(document.getElementById(idrect).style.top, 10);
	    if ($i(idrect)) {
		bx = $i(idrect);
		bxs = bx.style;
	    } else {
		i3GEO.janela.tempoMsg("Box nao encontrado");
		return;
	    }
	    pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
	    xfig = pix + (parseInt(bxs.width, 10)) - pos[0];
	    yfig = piy + (parseInt(bxs.height, 10)) - pos[1];
	    amext = mapext.split(" ");
	    dy = ((amext[1] * 1) - (amext[3] * 1)) / -1;
	    if (dy < 0) {
		dy = dy * -1;
	    }
	    nx = pixel * xfig;
	    ny = pixel * yfig;
	    x1 = (amext[0] * 1) + nx;
	    y1 = (amext[3] * 1) - ny;
	    xfig = pix - pos[0];
	    yfig = piy - pos[1];
	    if (dy < 0) {
		dy = dy * -1;
	    }
	    nx = pixel * xfig;
	    ny = pixel * yfig;
	    x2 = (amext[0] * 1) + nx;
	    y2 = (amext[3] * 1) - ny;
	    return [
		x2 + " " + y2 + " " + x1 + " " + y1,
		x1,
		y1,
		x2,
		y2
		];
	},
	/**
	 * Function: ext2rect
	 *
	 * Calcula o posicionamento de um retângulo com base na extens&atilde;o geogr&aacute;fica.
	 *
	 * Parametros:
	 *
	 * {String} - id do elemento html com o retangulo, pode ser vazio
	 *
	 * {String} - extensao geografica do mapa onde est&aacute; o retangulo
	 *
	 * {String} - extensao geografica do retangulo
	 *
	 * {Number} - tamanho do pixel do mapa em dd
	 *
	 * {Objeto DOM} - objeto sob o qual o retângulo ser&aacute; posicionado
	 *
	 * Return:
	 *
	 * {Array} - width,heigth,top,left
	 */
	ext2rect : function(idrect, mapext, boxext, pixel, documento) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculo.ext2rect()");

	    var rectbox, xyMin, xyMax, w, h, tl, pos, t, l, d, box;
	    rectbox = boxext.split(" ");
	    xyMin = i3GEO.calculo.dd2tela(rectbox[0], rectbox[1], documento, boxext, pixel);
	    xyMax = i3GEO.calculo.dd2tela(rectbox[2], rectbox[3], documento, boxext, pixel);
	    w = xyMax[0] - xyMin[0];
	    h = xyMin[1] - xyMax[1];
	    tl = i3GEO.calculo.dd2tela(rectbox[0], rectbox[3], documento, mapext, pixel);

	    pos = i3GEO.util.pegaPosicaoObjeto(documento);
	    t = tl[1] - pos[1];
	    l = tl[0] - pos[0];
	    d = "block";
	    if ($i(idrect)) {
		box = $i(idrect);
		box.style.width = w + "px";
		box.style.height = h + "px";
		box.style.top = t + "px";
		box.style.left = l + "px";
		box.style.display = d;
	    }
	    return [
		w,
		h,
		xyMax[1],
		xyMin[0]
		];
	}
};