if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.wkt2layer = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOwkt2layerContainer",
	    "namespace": "wkt2layer",
	    "parDefault": {
		position: "MS_UR",
		partials: 1,
		offsetx: 0,
		offsety: 0,
		minfeaturesize: "auto",
		mindistance: "auto",
		force: 0,
		shadowsizex: 1,
		shadowsizey: 1,
		cor: "0 0 0",
		sombray: 1,
		sombrax: 1,
		angulo: 0,
		tamanho: 12,
		fonte: "arial",
		fundo: "off",
		sombra: "off",
		outlinecolor: "255,255,255",
		shadowcolor: "off",
		wrap: ""
	    }
	},
	start : function(wkt,texto){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    p.mustache = r1;
		    i3f.html(wkt,texto);
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html(wkt,texto);
	    }
	},
	destroy: function(){
	},
	html:function(wkt,texto) {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    if(wkt == undefined){
		wkt = $trad("wkt",i3GEOF.wkt2layer.dicionario);
	    }
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    wkt: wkt,
		    valortexto: texto,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    $i("i3GEOFwkt2layerWkt").value = wkt;
	},
	feature: function() {
	    var wkt = $i("i3GEOFwkt2layerWkt").value;
	    wkt = $.trim(wkt.replace(/[\t\n]+/g,' '));
	    if(wkt.length < 5){
		i3GEO.janela.tempoMsg($trad("mensagem",i3GEOF.wkt2layer.dicionario));
	    }
	    else{
		i3GEOF.wkt2layer.insere();
	    }
	},
	layer: function() {
	    var wkt = $i("i3GEOFwkt2layerWkt").value;
	    wkt = $.trim(wkt.replace(/[\t\n]+/g,' '));
	    if(wkt.length < 5){
		i3GEO.janela.tempoMsg($trad("mensagem",i3GEOF.wkt2layer.dicionario));
	    }
	    else{
		i3GEOF.wkt2layer.shapefile();
	    }
	},
	pegaPar: function(){
	    var par = i3GEOF.wkt2layer._parameters.parDefault,
	    nometema,
	    temp;
	    if($i("i3GEOFwkt2layerTitulo").value !== ""){
		nometema = $i("i3GEOFwkt2layerTitulo").value;
	    }
	    else{
		temp = Math.random() + "_wkt2layer";
		temp = temp.split(".");
		nometema = temp[1];
	    }
	    par.nometema = nometema;
	    if($i("i3GEOFwkt2layerTexto").value !== ""){
		texto = $i("i3GEOFwkt2layerTexto").value;
	    }
	    else{
		texto = "";
	    }
	    par.texto = texto;
	    return par;
	},
	insere: function(){
	    var p = this._parameters,
	    i3f = this,
	    wkt = $i("i3GEOFwkt2layerWkt").value,
	    par = i3GEOF.wkt2layer.pegaPar();
	    wkt = $.trim(wkt.replace(/[\t]+/g,' '));
	    wkt = wkt.split("\n").join("|");
	    par.funcao = "feature";
	    par.xy = wkt;
	    i3f.post({
		snackbar: false,
		fn: function(retorno){
		    i3GEO.atualiza();
		    i3GEO.janela.tempoMsg($trad('fim',i3GEOF.wkt2layer.dicionario));
		},
		btn: btn,
		par: par,
		refresh: false
	    });
	},
	shapefile: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    wkt = $i("i3GEOFwkt2layerWkt").value,
	    par = i3GEOF.wkt2layer.pegaPar();
	    wkt = $.trim(wkt.replace(/[\t]+/g,' '));
	    wkt = wkt.split("\n").join("|");
	    par.funcao = "shapefile";
	    par.xy = wkt;
	    i3f.post({
		snackbar: false,
		fn: function(retorno){
		    i3GEO.atualiza();
		    i3GEO.janela.tempoMsg($trad('fim',i3GEOF.wkt2layer.dicionario));
		},
		btn: btn,
		par: par,
		refresh: false
	    });
	},
	post: function({snackbar = true, btn = false, par = {}, refresh = false, fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    $.post(
		    i3GEO.configura.locaplic+"/ferramentas/" + p.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			if(snackbar){
			    i3GEO.janela.snackBar({content: $trad('feito')});
			}
			if(refresh){
			    i3GEO.atualiza();			}
			if(fn){
			    fn(data);
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	}
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("wkt2layer")){
    jQuery.each( i3GEO.configura.ferramentas.wkt2layer, function(index, value) {
	i3GEOF.wkt2layer._parameters[index] = i3GEO.configura.ferramentas.wkt2layer[index];
    });
}