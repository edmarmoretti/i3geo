var OpenLayers={
	VERSION_NUMBER:"Release 2.11",
	singleFile:true,
	_getScriptLocation:(
		function(){
			var r=new RegExp("(^|(.*?\\/))(OpenLayers\.js)(\\?|$)"),
			s=document.getElementsByTagName('script'),
			src,
			m,
			l="";
			for(var i=0,len=s.length;i<len;i++){
				src=s[i].getAttribute('src');
				if(src){
					var m=src.match(r);
					if(m){
						l=m[1];
						break;
					}
				}
			}
			return(
				function(){
					return l;
				}
			);
		}
	)()
};
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.lastSeqID = 0;
OpenLayers.Util.isArray = function(a) {
	return (Object.prototype.toString.call(a) === '[object Array]');
};
OpenLayers.Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    }
    OpenLayers.Util.lastSeqID += 1; 
    return prefix + OpenLayers.Util.lastSeqID;        
};
OpenLayers.Util.createDiv = function(id, px, sz, imgURL, position, 
                                     border, overflow, opacity) {

    var dom = document.createElement('div');

    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position, 
                                     border, overflow, opacity);

    return dom;
};
OpenLayers.Util.modifyDOMElement = function(element, id, px, sz, position, 
                                            border, overflow, opacity) {

    if (id) {
        element.id = id;
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};
<?php
include("Class.js");
include("Panel.js");
include("Control.js");
?>
