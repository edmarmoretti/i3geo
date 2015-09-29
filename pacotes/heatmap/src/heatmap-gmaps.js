/*
 * heatmap.js GMaps overlay
 *
 * Copyright (c) 2011, Patrick Wied (http://www.patrick-wied.at)
 * Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
 */

//i3GeoMapOverlay vem de i3GEO.Interface e e usado para calcular projecao
//http://stackoverflow.com/questions/1538681/how-to-call-fromlatlngtodivpixel-in-google-maps-api-v3

function HeatmapOverlay(map, name, cfg) {
	if(document.getElementById("i3GeoHeatmapGm"+name)){
		return;
	}
	var me = this;
	me.name = name;
	me.heatmap = null;
	me.conf = cfg;
	me.latlngs = [];
	me.bounds = null;
	me.setMap(map);
	me.eventoDraw = google.maps.event.addListener(map, 'bounds_changed', function() {
		me.draw();
	});
}

HeatmapOverlay.prototype = new google.maps.OverlayView();

HeatmapOverlay.prototype.onAdd = function() {

	var panes = this.getPanes(), w = this.getMap().getDiv().clientWidth, h = this
			.getMap().getDiv().clientHeight, el = document.createElement("div");

	el.id = "i3GeoHeatmapGm"+this.name;
	el.style.cssText = "position:absolute;top:0;left:0;width:" + w
			+ "px;height:" + h + "px;";

	this.conf.element = el;
	panes.overlayLayer.appendChild(el);

	this.heatmap = h337.create(this.conf);
};

HeatmapOverlay.prototype.onRemove = function() {
	// Empty for now.
};

HeatmapOverlay.prototype.draw = function() {

	var me = this, overlayProjection = i3GeoMapOverlay.getProjection(), // me.getProjection(),
	currentBounds = me.map.getBounds();
	var leg = this.heatmap.get("legend").getElement();
	if(leg && leg.style && leg.style.display && leg.style.display === "none"){
		return;
	}
	if (currentBounds.equals(me.bounds)) {
		return;
	}
	me.bounds = currentBounds;

	var ne = overlayProjection.fromLatLngToDivPixel(currentBounds
			.getNorthEast()), sw = overlayProjection
			.fromLatLngToDivPixel(currentBounds.getSouthWest()), topY = ne.y, leftX = sw.x, h = sw.y
			- ne.y, w = ne.x - sw.x;

	me.conf.element.style.left = leftX + 'px';
	me.conf.element.style.top = topY + 'px';
	me.conf.element.style.width = w + 'px';
	me.conf.element.style.height = h + 'px';
	me.heatmap.store.get("heatmap").resize();

	if (this.latlngs.length > 0) {
		this.heatmap.clear();

		var len = this.latlngs.length, projection = i3GeoMapOverlay
				.getProjection(); // this.getProjection();
		d = {
			max : this.heatmap.store.max,
			data : []
		};

		while (len--) {
			var latlng = this.latlngs[len].latlng;
			if (!currentBounds.contains(latlng)) {
				continue;
			}

			// DivPixel is pixel in overlay pixel coordinates... we need
			// to transform to screen coordinates so it'll match the canvas
			// which is continually repositioned to follow the screen.
			var divPixel = projection.fromLatLngToDivPixel(latlng), screenPixel = new google.maps.Point(
					divPixel.x - leftX, divPixel.y - topY);

			var roundedPoint = this.pixelTransform(screenPixel);

			d.data.push({
				x : roundedPoint.x,
				y : roundedPoint.y,
				count : this.latlngs[len].c
			});
		}
		this.heatmap.store.setDataSet(d);
	}
};

HeatmapOverlay.prototype.pixelTransform = function(p) {
	var w = i3GEO.parametros.w, // this.heatmap.get("width"),
	h = i3GEO.parametros.h; // this.heatmap.get("height");

	while (p.x < 0) {
		p.x += w;
	}

	while (p.x > w) {
		p.x -= w;
	}

	while (p.y < 0) {
		p.y += h;
	}

	while (p.y > h) {
		p.y -= h;
	}

	p.x = (p.x >> 0);
	p.y = (p.y >> 0);

	return p;
};

HeatmapOverlay.prototype.setDataSet = function(data) {

	var me = this, currentBounds = me.map.getBounds(), mapdata = {
		max : data.max,
		data : []
	}, d = data.data, dlen = d.length, projection = i3GeoMapOverlay
			.getProjection(), // me.getProjection(),
	latlng, point;

	me.latlngs = [];

	while (dlen--) {
		latlng = new google.maps.LatLng(d[dlen].lat, d[dlen].lng);

		if (!currentBounds.contains(latlng)) {
			continue;
		}

		me.latlngs.push({
			latlng : latlng,
			c : d[dlen].count
		});
		point = me.pixelTransform(projection.fromLatLngToDivPixel(latlng));
		mapdata.data.push({
			x : point.x,
			y : point.y,
			count : d[dlen].count
		});
	}
	if (me.heatmap) {
		me.heatmap.clear();
		me.heatmap.store.setDataSet(mapdata);
	}
};

HeatmapOverlay.prototype.addDataPoint = function(lat, lng, count) {
	var projection = i3GeoMapOverlay.getProjection(), // this.getProjection(),
	latlng = new google.maps.LatLng(lat, lng), point = this
			.pixelTransform(projection.fromLatLngToDivPixel(latlng));

	this.heatmap.store.addDataPoint(point.x, point.y, count);
	this.latlngs.push({
		latlng : latlng,
		c : count
	});
};
HeatmapOverlay.prototype.destroy = function() {
	this.heatmap.clear();
	this.heatmap.cleanup();
	var e = this.heatmap.get("element");
	if(e){
		e.parentNode.removeChild(e);
	}
	google.maps.event.removeListener(this.eventoDraw);
	//this.delete();
	
};
HeatmapOverlay.prototype.toggle = function() {
	var leg = this.heatmap.get("legend").getElement();
	if(leg && leg.style && leg.style.display){
		leg.style.display === "block";
	}
	this.heatmap.toggleDisplay();
};
HeatmapOverlay.prototype.desliga = function() {
	var leg = this.heatmap.get("legend").getElement();
	if(leg){
		leg.style.display = "none";
	}
	this.heatmap.toggleDisplay();
};
HeatmapOverlay.prototype.liga = function() {
	this.heatmap.toggleDisplay();
	var leg = this.heatmap.get("legend").getElement();
	if(leg){
		leg.style.display = "block";
	}
	this.draw();
};
