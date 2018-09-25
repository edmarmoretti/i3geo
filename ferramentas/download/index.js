if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.download = {
	_parameters: {
	    "tema": "",
	    "namespace": "download"
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this;
	    p.tema = tema;
	    var c = i3GEO.arvoreDeCamadas.pegaTema(tema);
	    if(c.connectiontype === 7){
		var link = c.wmsurl.replace("wms","wfs")+"&typeName="+c.wmsname+"&SERVICE=wfs&REQUEST=getFeature";
		link = "<h5>Download</h5><a target='_blank' href='" + link + "' >" + link + "</a></div>";
		i3GEO.janela.closeMsg(link);
	    } else {
		i3GEO.janela.snackBar({content: $trad('download',i3GEOF.download.dicionario)});
		i3f.get({par: {funcao: "download"}});
	    }
	},
	get: function({snackbar = true, par = {}, prog = "exec", fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    par.g_sid = i3GEO.configura.sid;
	    par.tema = p.tema;
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/" + prog + ".php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela.fechaAguarde();
			if(data == "erro"){
			    i3GEO.janela.snackBar({content: $trad('erroTema',i3GEOF.download.dicionario), style:'red'});
			} else {
			    i3GEO.janela.snackBar({content: $trad('arquivook',i3GEOF.download.dicionario)});
			    var url = i3GEO.configura.locaplic + "/ferramentas/download/forcedownload.php?g_sid=" + i3GEO.configura.sid;
			    var link = document.createElement("a");
			    $(link).click(function(e) {
				e.preventDefault();
				window.location.href = url;
			    });
			    $(link).click();
			    if(fn){
				fn(data);
			    }
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: $trad('erroTema',i3GEOF.download.dicionario), style:'red'});
		    }
	    );
	}
};