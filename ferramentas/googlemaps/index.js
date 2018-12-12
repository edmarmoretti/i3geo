if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.googlemaps = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "namespace": "googlemaps"
	},
	start: function(){
	    var i3f = i3GEOF.googlemaps,
	    url = i3GEO.configura.locaplic + "/ferramentas/googlemaps/index.php",
	    ins = '<iframe src="' + url + '" valign="top" style="border:0px white solid;width:100%;height: calc(100% + 1px)"></iframe>';

	    i3f.renderFunction.call(
		    this,
		    {
			texto: ins,
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEO.desenho.removePins("boxOndeGoogle");
	    i3GEO.desenho.removePins("googlemaps");
	}
};