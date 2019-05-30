if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.wiki = {
	_parameters: {
	    snackbar: "",
	    marca: false,
	    startDate: 0
	},
	start: function(){
	    var html = "Wikipedia. " + $trad("clickparar");
	    i3GEOF.wiki._parameters.snackbar = i3GEO.janela.snackBar({
		content: "<div id='wikiresults' style='max-width: 220px;'>" + html + "</div>",
		timeout: 0,
		onClose: function(){
		    i3GEO.desenho.removePins("wikiresults");
		    i3GEO.desenho.removePins("wiki");
		    i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.wiki.getData()"]);
		}
	    });
	    $(i3GEOF.wiki._parameters.snackbar).snackbar("show");
	    this.getData();
	    i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEOF.wiki.getData()"]);
	},
	show: function(data){
	    var html = "";
	    i3GEO.desenho.removePins("wikiresults");
	    for (const r of data) {
		var link = "<a onclick='window.open(\"http://pt.wikipedia.org/wiki?curid=" + r.pageid + "\");return false;' href='javascript:void(0);' target=blank >Abrir Wikpedia</a>";
		i3GEO.desenho.addPin({
		    x: r.lon*1,
		    y: r.lat*1,
		    w: 32,
		    h: 37,
		    imagem: i3GEO.configura.locaplic+'/imagens/mapicons/information.png',
		    namespace: "wikiresults",
		    tooltiptext: r.title,
		    nameLayer: "Wikipedia",
		    fat: {"Link": link}
		});
	    }
	    if(data[0] == "aproxmais"){
		html = "Wikipedia. " + $trad("clickparar") + "<br>" + $trad("aproxmais");
	    }
	    if(html.length == 0){
		html = "Wikipedia. " + $trad("clickparar") + "<br>" + $trad("nadaenc");
	    }
	    $("#wikiresults").html(html);
	},
	getData: function(){
	    if(parseInt(i3GEOF.wiki._parameters.startDate / 2000,10) == parseInt(Date.now() / 2000,10)){
		return;
	    }
	    i3GEOF.wiki._parameters.startDate = Date.now();
	    var bbox = i3geoOL.getView().calculateExtent();
	    var line = new ol.geom.LineString([[bbox[0],bbox[1]],[bbox[0],bbox[3]]]);
	    if (i3GEO.Interface.googleLike === false){
		line = line.transform("EPSG:4326","EPSG:3857");
	    }
	    var raio = line.getLength() / 2;
	    if(isNaN(raio)){
		raio = 10001;
	    }
	    if(raio >= 10000){
		i3GEOF.wiki.show(["aproxmais"]);
	    } else {
		$("#wikiresults").html("Wikipedia <span class='glyphicon glyphicon-repeat normal-right-spinner'></span>");
		$.get(
			i3GEO.configura.locaplic + "/ferramentas/wiki/geosearch.php",
			{
			    g_sid: i3GEO.configura.sid,
			    funcao: "listaartigos",
			    ext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten),
			    raio: parseInt(raio,10)
			}
		).done(function(data) {
		    i3GEOF.wiki.show(data);
		}).fail(function() {
		    i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    return;
		});
	    }
	}
};