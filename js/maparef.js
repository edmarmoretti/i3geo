if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
//TODO incluir template para montagem do mapa
i3GEO.maparef =
{
	APIOBJ : "",
	inicia : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.inicia()");

	    if(i3GEO.maparef.APIOBJ == ""){
		i3GEO.maparef.APIOBJ = new ol.control.OverviewMap({
		    collapsible: true,
		    collapsed: false,
		    layers: [i3geoOL.getLayerBase()],
		    view: new ol.View(
			    i3GEO.Interface.parametrosView
		    )
		});
		i3GEO.maparef.APIOBJ.setMap(i3geoOL);
	    } else {
		i3GEO.maparef.APIOBJ.setCollapsed(!i3GEO.maparef.APIOBJ.getCollapsed());
		if(i3GEO.maparef.APIOBJ.getCollapsed() == true){
		    i3GEO.maparef.APIOBJ.setMap(null);
		    i3GEO.maparef.APIOBJ = "";
		}
	    }
	}
};
