if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.confluence = {
	_parameters: {
	    snackbar: "",
	    marca: false,
	    startDate: 0
	},
	start: function(){
	    var html = "Confluence. " + $trad("clickparar");
	    i3GEOF.confluence._parameters.snackbar = i3GEO.janela.snackBar({
		content: "<div id='confluenceresults' style='max-width: 220px;'>" + html + "</div>",
		timeout: 0,
		onClose: function(){
		    i3GEO.desenho.removePins("confluenceresults");
		    i3GEO.desenho.removePins("confluence");
		    i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.confluence.getData()"]);
		}
	    });
	    $(i3GEOF.confluence._parameters.snackbar).snackbar("show");
	    this.getData();
	    i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEOF.confluence.getData()"]);
	},
	show: function(data){
	    var html = "";
	    i3GEO.desenho.removePins("confluenceresults");
	    for (const r of data) {
		var link = "<a onclick='window.open(\"http://www.confluence.org/confluence.php?lat=" + r.lat + "&lon=" + r.lon + "\");return false;' href='javascript:void(0);' target=blank >Abrir Confluence</a>";
		i3GEO.desenho.addPin({
		    x: r.lon*1,
		    y: r.lat*1,
		    w: 32,
		    h: 37,
		    imagem: i3GEO.configura.locaplic+'/imagens/mapicons/flag-export.png',
		    namespace: "confluenceresults",
		    tooltiptext: r.title,
		    nameLayer: "Confluence",
		    fat: {
			"Link": link,
			"Lat/Lon": r.lat + " / " + r.lon
		    }
		});
	    }
	    if(data.length == 0){
		if(i3geoOL.getScale() > 8000000){
		    html = "Confluence. " + $trad("clickparar") + "<br>" + $trad("aproxmais");
		} else {
		    html = "Confluence. " + $trad("clickparar") + "<br>" + $trad("nadaenc");
		}
	    } else {
		html = "Confluence. " + $trad("clickparar") + "<br>";
	    }
	    $("#confluenceresults").html(html);
	},
	getData: function(){
	    if(parseInt(i3GEOF.confluence._parameters.startDate / 2000,10) == parseInt(Date.now() / 2000,10)){
		return;
	    }
	    i3GEOF.confluence._parameters.startDate = Date.now();
	    if(i3geoOL.getScale() > 8000000){
		i3GEOF.confluence.show([]);
	    } else {
		$("#confluenceresults").html("Confluence <span class='glyphicon glyphicon-repeat normal-right-spinner'></span>");
		var ins = "",yi,xi,ext,xini,yini,xfim,yfim,xs,dx,ys = [];
		ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		ext = ext.split(" ");
		xini = parseInt(ext[0],10);
		yini = parseInt(ext[1],10);
		xfim = parseInt(ext[2],10);
		yfim = parseInt(ext[3],10);
		data = [];
		dx = xfim - xini;
		if ((dx > 1) || (dx < -1)){
		    for (yi=yini;yi<yfim;yi++){
			for (xi=xini;xi<xfim;xi++){
			    data.push({
				lon: xi,
				lat: yi,
				title: "Lat: " + yi + " Lon: " + xi
			    });
			}
		    }
		}
		i3GEOF.confluence.show(data);
	    }
	}
};