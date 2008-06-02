/*-----------------------------------------------------------------------------
Copyright (C) 2006  Menko Kroeske

This file is part of Flamingo MapComponents.

Flamingo MapComponents is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-----------------------------------------------------------------------------*/
class ArcIMSConnector {
	//meta
	var version:String = "2.0.1";
	//algemeen
	var server:String = "";
	var service:String = "";
	var servlet:String = "servlet/com.esri.esrimap.Esrimap";
	var xmlheader:String = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
	//getServiceInfo defaults
	var renderer:Boolean = false;
	var extensions:Boolean = false;
	var fields:Boolean = false;
	//getImage defaults
	var outputtype:String = "png24";
	var map:Boolean = true;
	var backgroundcolor:Number = 0xFBFBFB;
	var transcolor:Number = 0xFBFBFB;
	var layerliststring:String = "";
	var legend:Boolean = false;
	var legendcolor:Number = 0xffffff;
	var legendwidth:Number = 250;
	var legendfont:String = "arial";
	var titlefontsize:Number = 12;
	var valuefontsize:Number = 12;
	var layerfontsize:Number = 12;
	var legendcolumns:Number = 1;
	//getFeatures defaults
	var featurelimit:Number = 10;
	var skipfeatures:Boolean = false;
	var geometry:Boolean = false;
	var envelope:Boolean = false;
	var beginrecord:Number = 1;
	var request:String;
	var response:String;
	var responsetime:Number;
	var error:String;
	var url:String;
	var requestid:Number = 0;
	var requesttype:String;
	//-----------------------
	private var busy:Boolean = false;
	private var layerid:String;
	private var events:Object;
	//private var requesttype:String;
	//private var url:String;
	//private var xrequest:XML;
	//private var xresponse:XML;
	//private var error:String;
	//private var time:Date;
	//-----------------------
	//-----------------------
	function addListener(listener:Object) {
		events.addListener(listener);
	}
	function removeListener(listener:Object) {
		events.removeListener(listener);
	}
	function ArcIMSConnector(server:String) {
		this.server = server;
		events = new Object();
		AsBroadcaster.initialize(events);
	}
	private function _getUrl(srequest:String):String {
		var _server:String = this.server;
		var _service:String = this.service;
		var _servlet:String = this.servlet;
		if (_server == "") {
			_server = _root._url;
			var p:Number = _server.indexOf("//", 0);
			p = _server.indexOf("/", p+2);
			_server = _server.substr(0, p);
		}
		if (_server.substr(_server.length-1, 1).toLowerCase() != "/") {
			_server = _server+"/";
		}
		if (_server.substr(0, 4).toLowerCase() != "http" and _server.substr(0, 4).toLowerCase() != "file") {
			_server = "http://"+_server;
		}
		var extra = "";
		if (_servlet.substr(0, 1).toLowerCase() == "/") {
			_servlet = _servlet.substr(1, _servlet.length-1);
		}
		var extra:String = "";
		var service:String = "";
		if (srequest == "getServices") {
			_service = "catalog";
		}
		if (srequest == "getFeatures") {
			extra = "&CustomService=Query";
		}
		return (_server+_servlet+"?ServiceName="+_service+"&ClientVersion=4.0&Form=false&Encode=false"+extra);
	}
	private function _sendrequest(sxml:String, requesttype:String, objecttag:Object):Number {
		if (this.busy) {
			this.error = "busy processing request...";
			this.events.broadcastMessage("onError", this.error, objecttag, this.requestid);
			return;
		}
		this.requestid++;
		this.requesttype = requesttype;
		this.busy = true;
		this.url = this._getUrl(requesttype);
		this.request = sxml;
		var xrequest:XML = new XML(sxml);
		xrequest.contentType = "text/xml";
		var xresponse:XML = new XML();
		xresponse.ignoreWhite = true;
		var thisObj:Object = this;
		this.error = "";
		this.response = "";
		this.events.broadcastMessage("onRequest", this);
		xresponse.onLoad = function(success:Boolean):Void  {
			thisObj.response = this.toString();
			thisObj.responsetime = (new Date()-starttime)/1000;
			if (success) {
				if (this.firstChild.nodeName == "ERROR") {
					thisObj.error = this.firstChild.childNodes[0].nodeValue;
					thisObj.events.broadcastMessage("onResponse", thisObj);
					thisObj.events.broadcastMessage("onError", thisObj.error, objecttag, thisObj.requestid);
				} else if (this.firstChild.firstChild.nodeName == "ERROR") {
					thisObj.error = this.firstChild.firstChild.childNodes[0].nodeValue;
					thisObj.events.broadcastMessage("onResponse", thisObj);
					thisObj.events.broadcastMessage("onError", thisObj.error, objecttag, thisObj.requestid);
				} else if (this.firstChild.firstChild.firstChild.nodeName == "ERROR") {
					error = this.firstChild.firstChild.firstChild.childNodes[0].nodeValue;
					thisObj.events.broadcastMessage("onResponse", thisObj);
					thisObj.events.broadcastMessage("onError", thisObj.error, objecttag, thisObj.requestid);
				} else {
					thisObj.events.broadcastMessage("onResponse", thisObj);
					switch (requesttype) {
					case "getServices" :
						thisObj._processServices(this, objecttag, thisObj.requestid);
						break;
					case "getImage" :
						thisObj._processImage(this, objecttag, thisObj.requestid);
						break;
					case "getRasterInfo" :
						thisObj._processRasterInfo(this, objecttag, thisObj.requestid);
						break;
					case "getServiceInfo" :
						thisObj._processServiceInfo(this, objecttag, thisObj.requestid);
						break;
					case "getFeatures" :
						thisObj._processFeatures(this, objecttag, thisObj.requestid);
						break;
					}
				}
			} else {
				thisObj.error = "connection failed...";
				thisObj.events.broadcastMessage("onResponse", thisObj);
				thisObj.events.broadcastMessage("onError", thisObj.error, objecttag, thisObj.requestid);
			}
			thisObj.busy = false;
			delete this;
		};
		var starttime:Date = new Date();
		xrequest.sendAndLoad(url, xresponse);
		return (thisObj.requestid);
	}
	function getServices(objecttag:Object):Number {
		var sxml:String = this.xmlheader+"\n<GETCLIENTSERVICES/>";
		return (this._sendrequest(sxml, "getServices", objecttag));
	}
	private function _processServices(xml:XML, objecttag:Object, requestid:Number):Void {
		var services:Object = new Object();
		var xnSERVICES = xml.firstChild.firstChild.firstChild.childNodes;
		for (var i = 0; i<xnSERVICES.length; i++) {
			if (xnSERVICES[i].nodeName == "SERVICE") {
				var s:Object = new Object();
				s.name = xnSERVICES[i].attributes.name;
				s.servicegroup = xnSERVICES[i].attributes.servicegroup;
				s.access = xnSERVICES[i].attributes.access;
				s.type = xnSERVICES[i].attributes.type;
				s.version = xnSERVICES[i].attributes.version;
				s.status = xnSERVICES[i].attributes.status;
				services[s.name] = s;
			}
		}
		this.events.broadcastMessage("onGetServices", services, objecttag, requestid);
	}
	function getServiceInfo(service:String, objecttag:Object):Number {
		if (service != undefined) {
			this.service = service;
		}
		var str:String = this.xmlheader+"\n";
		str = str+"<ARCXML version=\"1.1\">\n";
		str = str+"<REQUEST>\n";
		str = str+"<GET_SERVICE_INFO  dpi = \"96\" envelope=\"false\" renderer=\""+String(this.renderer)+"\" extensions=\""+String(this.extensions)+"\" fields=\""+String(this.fields)+"\"/>\n";
		str = str+"</REQUEST>\n";
		str = str+"</ARCXML>";
		return (this._sendrequest(str, "getServiceInfo", objecttag));
	}
	private function _processServiceInfo(xml:XML, objecttag:Object, requestid:Number):Void {
		var layer:Object;
		var field:Object;
		var layers = new Object();
		var extent = new Object();
		var xnSI = xml.firstChild.firstChild.firstChild.childNodes;
		for (var i:Number = 0; i<xnSI.length; i++) {
			switch (xnSI[i].nodeName) {
			case "LAYERINFO" :
				layer = new Object();
				layer.type = xnSI[i].attributes.type;
				if (layer.type == "featureclass") {
					layer.fclasstype = xnSI[i].firstChild.attributes.type;
				}
				layer.visible = false;
				layer.legend = false;
				if (xnSI[i].attributes.visible == "true") {
					layer.visible = true;
					layer.legend = true;
				}
				layer.name = xnSI[i].attributes.name;
				layer.id = xnSI[i].attributes.id;
				layer.minscale = this._asNumber(xnSI[i].attributes.minscale);
				layer.maxscale = this._asNumber(xnSI[i].attributes.maxscale);
				layer.fields = new Object();
				layer.query = "";
				//veld informatie
				var xnFCLASS:Array = xnSI[i].childNodes;
				for (var j:Number = 0; j<xnFCLASS.length; j++) {
					if (xnFCLASS[j].nodeName == "FCLASS") {
						var xnFIELD = xnFCLASS[j].childNodes;
						for (var k:Number = 0; k<xnFIELD.length; k++) {
							if (xnFIELD[k].nodeName == "FIELD") {
								field = new Object();
								field.name = xnFIELD[k].attributes.name;
								field.shortname = this._stripGeodatabase(field.name);
								field.type = xnFIELD[k].attributes.type;
								field.size = xnFIELD[k].attributes.size;
								field.precision = xnFIELD[k].attributes.precision;
								layer.fields[field.name] = field;
							}
						}
					}
				}
				layers[layer.id] = layer;
				break;
			case "PROPERTIES" :
				var xnPROPERTIES:Array = xnSI[i].childNodes;
				for (var j:Number = 0; j<xnPROPERTIES.length; j++) {
					if (xnPROPERTIES[j].nodeName == "ENVELOPE") {
						extent.name = xnPROPERTIES[j].attributes.name;
						extent.minx = this._asNumber(xnPROPERTIES[j].attributes.minx);
						extent.miny = this._asNumber(xnPROPERTIES[j].attributes.miny);
						extent.maxx = this._asNumber(xnPROPERTIES[j].attributes.maxx);
						extent.maxy = this._asNumber(xnPROPERTIES[j].attributes.maxy);
					}
				}
				break;
			case "ENVIRONMENT" :
				break;
			}
		}
		this.events.broadcastMessage("onGetServiceInfo", extent, layers, objecttag, requestid);
	}
	function getImage(service:String, extent:Object, size:Object, layers:Object, objecttag:Object):Number {
		if (service != undefined) {
			this.service = service;
		}
		var str:String = this.xmlheader+"\n";
		str = str+"<ARCXML version=\"1.1\">\n";
		str = str+"<REQUEST>\n";
		str = str+"<GET_IMAGE autoresize=\"true\">\n";
		str = str+"<PROPERTIES>\n";
		var rgb1:Object = _getRGB(this.backgroundcolor);
		if (not isNaN(this.transcolor)) {
			var rgb2:Object = _getRGB(this.transcolor);
			str = str+"<BACKGROUND  color=\""+rgb1.r+","+rgb1.g+","+rgb1.b+"\""+" transcolor=\""+rgb2.r+","+rgb2.g+","+rgb2.b+"\"  />\n";
		} else {
			str = str+"<BACKGROUND  color=\""+rgb1.r+","+rgb1.g+","+rgb1.b+"\"  />\n";
		}
		str = str+"<ENVELOPE minx=\""+String(extent.minx)+"\" miny=\""+String(extent.miny)+"\" maxx=\""+String(extent.maxx)+"\" maxy=\""+String(extent.maxy)+"\" />\n";
		if (not this.map) {
			str = str+"<DRAW map = \"false\" />";
		}
		str = str+"<IMAGESIZE width=\""+size.width+"\" height=\""+size.height+"\" />\n";
		str = str+"<OUTPUT type=\""+this.outputtype+"\" />";
		if (this.layerliststring.length>0) {
			str = str+this.layerliststring;
		} else {
			if (layers != undefined) {
				str = str+"<LAYERLIST order=\"false\" >\n";
				for (var id in layers) {
					if (layers[id].visible != undefined) {
						if (not layers[id].visible) {
							str = str+"<LAYERDEF id=\""+id+"\" visible=\""+String(layers[id].visible)+"\"/>\n";
						} else {
							str = str+"<LAYERDEF id=\""+id+"\" visible=\""+String(layers[id].visible)+"\">\n";
							if (layers[id].layerdefstring.length>0) {
								str = str+layers[id].layerdefstring;
							}
							if (layers[id].query.length>0) {
								str = str+"<SPATIALQUERY where=\""+layers[id].query+"\" />";
							}
							str = str+"\n</LAYERDEF>";
						}
					}
				}
				str = str+"</LAYERLIST>";
			}
		}
		if (this.legend) {
			var rgb:Object = _getRGB(this.legendcolor);
			str = str+"<LEGEND width =\""+String(this.legendwidth)+"\" font=\""+this.legendfont+"\" titlefontsize=\""+String(this.titlefontsize)+"\" valuefontsize=\""+String(this.valuefontsize)+"\" layerfontsize=\""+String(this.layerfontsize)+"\" autoextend=\"true\"  backgroundcolor=\""+rgb.r+","+rgb.g+","+rgb.b+"\" columns=\""+String(this.legendcolumns)+"\"  cansplit=\""+"true"+"\" >\n";
			if (layers != undefined) {
				str = str+"<LAYERS>\n";
				for (var id in layers) {
					if (layers[id].legend == false) {
						str = str+"<LAYER id=\""+id+"\"/>\n";
					}
				}
				str = str+"</LAYERS>\n";
			}
			str = str+"</LEGEND>\n";
		}
		str = str+"</PROPERTIES>\n";
		str = str+"</GET_IMAGE>\n";
		str = str+"</REQUEST>\n";
		str = str+"</ARCXML>";
		return (this._sendrequest(str, "getImage", objecttag));
	}
	private function _processImage(xml:XML, objecttag:Object, requestid:Number):Void {
		var extent = new Object();
		var imageurl:String;
		var legendurl:String;
		var xnIMAGE:Array = xml.firstChild.firstChild.firstChild.childNodes;
		for (var i:Number = 0; i<xnIMAGE.length; i++) {
			switch (xnIMAGE[i].nodeName) {
			case "ENVELOPE" :
				extent.minx = this._asNumber(xnIMAGE[i].attributes.minx);
				extent.miny = this._asNumber(xnIMAGE[i].attributes.miny);
				extent.maxx = this._asNumber(xnIMAGE[i].attributes.maxx);
				extent.maxy = this._asNumber(xnIMAGE[i].attributes.maxy);
				break;
			case "OUTPUT" :
				imageurl = xnIMAGE[i].attributes.url;
				break;
			case "LEGEND" :
				legendurl = xnIMAGE[i].attributes.url;
				break;
			}
		}
		this.events.broadcastMessage("onGetImage", extent, imageurl, legendurl, objecttag, requestid);
	}
	private function _processRasterInfo(xml:XML, objecttag:Object, requestid:Number):Void {
		var data:Array = new Array();
		var xRASTERINFO:Array = xml.firstChild.firstChild.firstChild.childNodes;
		for (var i:Number = 0; i<xRASTERINFO.length; i++) {
			switch (xRASTERINFO[i].nodeName) {
			case "BANDS" :
				var record:Object = new Object();
				var xBANDS = xRASTERINFO[i].childNodes;
				for (var j:Number = xBANDS.length-1; j>=0; j--) {
					if (xBANDS[j].nodeName == "BAND") {
						var nr = xBANDS[j].attributes.number;
						var val = xBANDS[j].attributes.value;
						record["band_"+nr] = val;
					}
				}
				data.push(record);
				break;
			}
		}
		this.events.broadcastMessage("onGetRasterInfo", this.layerid, data, objecttag, requestid);
	}
	function getRasterInfo(service:String, layerid:String, point:Object, coordsys:String, objecttag:Object):Number {
		this.layerid = layerid;
		if (service != undefined) {
			this.service = service;
		}
		var str:String = this.xmlheader+"\n";
		str = str+"<ARCXML version=\"1.1\">\n";
		str = str+"<REQUEST>\n";
		str = str+"<GET_RASTER_INFO x='"+point.x+"' y='"+point.y+"' layerid='"+layerid+"' >";
		if (coordsys != undefined) {
			str = str+"<COORDSYS id='"+coordsys+"' />";
		}
		str = str+"</GET_RASTER_INFO>";
		str = str+"</REQUEST>\n";
		str = str+"</ARCXML>";
		//trace(str);
		return (this._sendrequest(str, "getRasterInfo", objecttag));
	}
	function getFeatures(service:String, layerid:String, extent:Object, subfields:String, query:String, objecttag:Object):Number {
		this.layerid = layerid;
		if (service != undefined) {
			this.service = service;
		}
		if (subfields == undefined) {
			subfields = "#ALL#";
		}
		if (query == undefined) {
			query = "";
		}
		var str:String = this.xmlheader+"\n";
		str = str+"<ARCXML version=\"1.1\">\n";
		str = str+"<REQUEST>\n";
		if (this.skipfeatures) {
			str = str+"<GET_FEATURES skipfeatures=\"true\" outputmode=\"newxml\">\n";
		} else {
			str = str+"<GET_FEATURES geometry=\""+String(this.geometry)+"\" compact=\"true\" checkesc=\"true\" envelope=\""+String(this.envelope)+"\" featurelimit=\""+String(this.featurelimit)+"\" beginrecord=\""+String(this.beginrecord)+"\" outputmode=\"newxml\">\n";
		}
		//str = str+"<ENVIRONMENT>\n";
		//str = str+"<SEPARATORS cs=\"\" ts=\";\" />\n";
		//str = str+"</ENVIRONMENT>\n";
		str = str+"<LAYER id=\""+layerid+"\" />\n";
		var sf:String = subfields;
		if ((this.geometry or this.envelope) and subfields != "#ALL#") {
			sf = "#SHAPE# "+subfields;
		}
		if (extent == undefined) {
			str = str+"<QUERY subfields =\""+sf+"\" featurelimit=\""+String(this.featurelimit)+"\" searchorder=\"optimize\" where=\""+query+"\"/>\n";
		} else {
			str = str+"<SPATIALQUERY subfields =\""+sf+"\" featurelimit=\""+String(this.featurelimit)+"\" searchorder=\"optimize\" where=\""+query+"\">\n";
			str = str+"<SPATIALFILTER relation=\"area_intersection\">\n";
			str = str+"<ENVELOPE maxx=\""+String(extent.maxx)+"\" maxy=\""+String(extent.maxy)+"\" minx=\""+String(extent.minx)+"\" miny=\""+String(extent.miny)+"\" /> \n";
			str = str+"</SPATIALFILTER>\n";
			str = str+"</SPATIALQUERY>\n";
		}
		str = str+"</GET_FEATURES>\n";
		str = str+"</REQUEST>\n";
		str = str+"</ARCXML>";
		//trace(str);
		return (this._sendrequest(str, "getFeatures", objecttag));
	}
	private function _processFeatures(xml:XML, objecttag:Object, requestid:Number):Void {
		//trace(xml);
		var count:Number = 0;
		var hasmore:Boolean = false;
		var data:Array = new Array();
		var FEATURES = xml.firstChild.firstChild.firstChild.childNodes;
		for (var i = FEATURES.length; i>=0; i--) {
			switch (FEATURES[i].nodeName) {
			case "FEATURECOUNT" :
				count = Number(FEATURES[i].attributes.count);
				if (FEATURES[i].attributes.hasmore.toLowerCase() == "true") {
					hasmore = true;
				}
				break;
			case "FEATURE" :
				var record:Object = new Object();
				var FEATURE = FEATURES[i].childNodes;
				for (var j = 0; j<FEATURE.length; j++) {
					switch (FEATURE[j].nodeName) {
					case "FIELDS" :
						var FIELDS = FEATURE[j].childNodes;
						for (var k = 0; k<FIELDS.length; k++) {
							record[FIELDS[k].attributes.name] = FIELDS[k].attributes.value;
						}
						break;
					case "ENVELOPE" :
						var ext:Object = new Object();
						ext.minx = this._asNumber(FEATURE[j].attributes.minx);
						ext.miny = this._asNumber(FEATURE[j].attributes.miny);
						ext.maxx = this._asNumber(FEATURE[j].attributes.maxx);
						ext.maxy = this._asNumber(FEATURE[j].attributes.maxy);
						record["SHAPE.ENVELOPE"] = ext;
						break;
					case "MULTIPOINT" :
						var multipoint:Array = new Array();
						var xmultipoint = FEATURE[j].childNodes;
						for (var k = 0; k<xmultipoint.length; k++) {
							if (xmultipoint[k].nodeName == "COORDS") {
								var COORDS = xmultipoint[k].childNodes;
								for (var l = 0; l<COORDS.length; l++) {
									var xy:Array = COORDS[l].nodeValue.split(" ");
									multipoint.push({x:this._asNumber(xy[0]), y:this._asNumber(xy[1])});
								}
							}
						}
						//record["SHAPE.MULTIPOINT"] = FEATURE[j].childNodes;
						record["SHAPE.MULTIPOINT"] = multipoint;
						break;
					case "POLYLINE" :
						record["SHAPE.POLYLINE"] = FEATURE[j].childNodes;
						break;
					case "POLYGON" :
						record["SHAPE.POLYGON"] = FEATURE[j].childNodes;
						break;
					}
				}
				data.push(record);
				break;
			}
		}
		this.events.broadcastMessage("onGetFeatures", this.layerid, data, count, hasmore, objecttag, requestid);
	}
	private function _asNumber(s:String):Number {
		if (s == undefined) {
			return (undefined);
		}
		if (s.indexOf(",", 0) != -1) {
			var a:Array = s.split(",");
			s = a[0]+"."+a[1];
		}
		return (Number(s));
	}
	private function _stripGeodatabase(s:String):String {
		var a:Array = s.split(".");
		return (a[a.length-1]);
	}
	private function _getRGB(hex:Number):Object {
		return ({r:hex >> 16, g:(hex & 0x00FF00) >> 8, b:hex & 0x0000FF});
	}
}
