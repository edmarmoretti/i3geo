if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.geolocal =
{
	_timer: "",
	_delay: 2000,
	_pin: "",
	_snackbar: "",
	_atual: "",
	events: {
	    afterShowOrMovePoint: [],
	    add: function(type,fn){
		i3GEO.geolocal.events[type].push(fn);
	    },
	    dispatch: function (type,parameters){
		for( const e of i3GEO.geolocal.events[type]){
		    e.call(e,parameters);
		}
	    },
	    clear: function(){
		i3GEO.geolocal.events.afterShowOrMovePoint = [];
	    }
	},
	start: function(){
	    if(ol.has.GEOLOCATION == false){
		i3GEO.janela.snackBar({content: $trad("geolocfalse"), style: "red"});
		return false;
	    }
	    if(i3GEO.geolocal._timer != ""){
		i3GEO.geolocal.stop();
	    } else {
		var html = "<span class='text-center'> Geolocal. " + $trad("clickparar") + "</span><br><span id='geolocalresults' class='text-center'></span>";
		i3GEO.geolocal._snackbar = i3GEO.janela.snackBar({
		    content: html,
		    onClose: function(){
			i3GEO.geolocal.stop();
		    },
		    timeout: 0
		});
		i3GEO.geolocal.firstPoint();
	    }
	},
	firstPoint: function(){
	    var retorno = function(position) {
		//console.log(position);
		i3GEO.geolocal.showPoint(position);
		i3GEO.geolocal.createTimer();
	    };
	    navigator.geolocation.getCurrentPosition(retorno, i3GEO.geolocal.erro);
	},
	createTimer: function(){
	    i3GEO.geolocal._timer = setInterval(function() {
		i3GEO.geolocal.movePoint();
	    }, i3GEO.geolocal._delay);
	},
	stop: function(){
	    i3GEO.geolocal.events.clear();
	    clearInterval(i3GEO.geolocal._timer);
	    i3GEO.geolocal._timer = "";
	    i3GEO.geolocal._atual = "";
	    i3GEO.geolocal.removePoint();
	    $(i3GEO.geolocal._snackbar).snackbar("hide");
	    i3GEO.geolocal._snackbar = "";
	},
	showPoint: function(position){
	    var y = position.coords.latitude;
	    var x = position.coords.longitude;
	    i3GEO.geolocal._atual = x + "," + y;
	    i3GEO.navega.pan2ponto(x,y);
	    i3GEO.geolocal._pin = i3GEO.desenho.addPin({
		x: x,
		y: y,
		namespace: "pingeolocal"
	    });
	    $("#geolocalresults").html("lat: " + y + " lon: " + x);
	    i3GEO.geolocal.afterShowOrMovePoint(x,y);
	},
	movePoint: function(position){
	    var retorno = function(position) {
		var y = position.coords.latitude;
		var x = position.coords.longitude;
		if(i3GEO.geolocal._atual != x + "," + y){
		    i3GEO.geolocal._atual = x + "," + y;
		    i3GEO.geolocal.center(x,y);
		    i3GEO.desenho.movePin(i3GEO.geolocal._pin,x,y);
		    i3GEO.geolocal.afterShowOrMovePoint(x,y);
		}
	    };
	    navigator.geolocation.getCurrentPosition(retorno, i3GEO.geolocal.erro);
	},
	afterShowOrMovePoint: function(x,y){
	    i3GEO.geolocal.events.dispatch("afterShowOrMovePoint",[x,y]);
	},
	center: function(x,y){
	    var point = i3GEO.util.extGeo2OSM(new ol.geom.Point([x, y]));
	    if(i3geoOL.getExtent().getGeometry().intersectsCoordinate(point.getCoordinates()) == false){
		i3GEO.navega.pan2ponto(x,y);
	    }
	},
	removePoint: function(){
	    i3GEO.desenho.removePins("pingeolocal");
	},
	erro : function(error) {
	    i3GEO.geolocal.stop();
	    var erro = "";
	    switch (error.code) {
	    case error.PERMISSION_DENIED:
		erro = "User denied the request for Geolocation.";
		break;
	    case error.POSITION_UNAVAILABLE:
		erro = "Location information is unavailable.";
		break;
	    case error.TIMEOUT:
		erro = "The request to get user location timed out.";
		break;
	    case error.UNKNOWN_ERROR:
		erro = "An unknown error occurred.";
		break;
	    }
	    i3GEO.janela.snackBar({content: erro, style: "red"});
	}
}