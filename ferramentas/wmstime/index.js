if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.wmstime = {
	//configure aqui os parametros do servico ja cadastrado no sistema de administracao
	//o indice deve ter o mesmo valor do ID do registro do servico
	configura: {
	    "91": {
		layers:"MOD14A1_M_FIRE",
		styles:"rgb",
		srs:"EPSG:4326",
		format:"image/jpeg",
		anoInicio: 2017,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2017,
		mesFim: 12,
		diaFim: 1,
		tipo: 2,
		outros: ""
	    }
	},
	_parameters : {
	    mustache: "",
	    namespace: "wmstime",
	    idServico : "",
	    tempoAnima : 500,
	    idContainer: "i3GEOwmstimeContainer",
	    w: i3GEO.parametros.w,
	    h: i3GEO.parametros.h,
	    dw: 540,
	    dh: 245,
	},
	renderFunction: i3GEO.janela.formModal,
	quadroAtual: 0,
	emPausa: true,
	start : function(url,id_ws,title){
	    var i3f = this;
	    var p = this._parameters;
	    p.idServico = id_ws;
	    this.configura[id_ws].url = url;
	    this.configura[id_ws].title = title;

	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		var t1 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/template_mst.html";
		$.get(t1).done(function(r1) {
		    i3GEO.janela.fechaAguarde();
		    p.mustache = r1;
		    i3f.html();
		}).fail(function() {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.tempoMsg($trad("erroTpl"));
		});
	    } else {
		i3f.html();
	    }
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    tipoServico = i3f.configura[p.idServico].tipo,
	    hash;
	    var divumaImagemPor = "";
	    if(tipoServico == 1){
		divumaImagemPor += "<option value='ano' selected >"+$trad(10,i3GEOF.wmstime.dicionario)+"</option></select>";
	    }
	    if(tipoServico == 2){
		divumaImagemPor += "<option value='ano' >"+$trad(10,i3GEOF.wmstime.dicionario)+"</option>";
		divumaImagemPor += "<option value='mes' selected >"+$trad(11,i3GEOF.wmstime.dicionario)+"</option></select>";
	    }
	    if(tipoServico == 3){
		divumaImagemPor += "<option value='ano'  >"+$trad(10,i3GEOF.wmstime.dicionario)+"</option>";
		divumaImagemPor += "<option value='mes' >"+$trad(11,i3GEOF.wmstime.dicionario)+"</option>";
		divumaImagemPor += "<option value='dia' selected >"+$trad(12,i3GEOF.wmstime.dicionario)+"</option></select><b class='caret careti'></b>";
	    }
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    divumaImagemPor: divumaImagemPor,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario),
		    ...{
			values: i3f.configura[p.idServico]
		    }
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy
		    });
	},
	getFormData: function(){
	    var data = i3GEO.util.getFormData("#" + this._parameters.idContainer + " form");
	    return data
	},
	addLayer: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    service = i3f.configura[p.idServico],
	    timeParams = i3f.getTimeParams();
	    i3f.add2map(timeParams,btn);
	},
	getTimeParams: function(){
	    var i3f = this;
	    var p = i3f._parameters;
	    var times = [];
	    formData = i3f.getFormData();
	    var id = 1;
	    var dataFixa;
	    if(formData.umaImagemPor == "mes"){
		dataFixa = formData.diaInicio;
		if(dataFixa < 10){
		    dataFixa = "0" + dataFixa;
		}
		var anoAtual = formData.anoInicio;
		var mesAtual = formData.mesInicio;
		while (anoAtual <= formData.anoFim){
		    while (mesAtual < 13){
			var mes = mesAtual;
			if(mes < 10){
			    mes = "0"+mes;
			}
			times.push(anoAtual+"-"+mes+"-"+dataFixa);
			id++;
			mesAtual++;
			if(anoAtual == formData.anoFim && mesAtual > formData.mesFim){
			    mesAtual = 13;
			}
		    }
		    mesAtual = 1;
		    anoAtual++;
		}
	    }
	    if(formData.umaImagemPor == "dia"){
		var anoAtual = formData.anoInicio;
		var mesAtual = formData.mesInicio;
		var diaAtual = formData.diaInicio;
		while (anoAtual <= anoFim){
		    while (mesAtual < 13){
			var mes = mesAtual;
			if(mes < 10){mes = "0"+mes;}
			while (diaAtual < 31){
			    var dia = diaAtual;
			    if(diaAtual < 10){
				dia = "0"+dia;
			    }
			    times.push(anoAtual+"-"+mes+"-"+dia);
			    id++;
			    diaAtual++;
			    if(mesAtual == formData.mesFim && diaAtual > formData.diaFim){
				diaAtual = 32;
			    }
			}
			mesAtual++;
			if(anoAtual == anoFim && mesAtual > mesFim){
			    mesAtual = 13;
			}
		    }
		    mesAtual = 1;
		    anoAtual++;
		}
	    }
	    return times;
	},
	add2map: function(timeParams,btn){
	    $(btn).button("disable").find("span").removeClass("hidden");
	    var p = this._parameters,
	    i3f = this,
	    serv = i3f.configura[p.idServico];
	    i3GEO.janela.abreAguarde();
	    var par = ""
		+ "g_sid=" + i3GEO.configura.sid
	    	+ "&funcao=adiciona"
	    	+ "&servico="+serv.url
	    	+ "&nome="+serv.styles
	    	+ "&tema="+serv.layers
	    	+ "&proj="+serv.srs
	    	+ "&formato="+serv.format
	    	+ "&tipo=estilo"
	    	+ "&versao=1.1.1"
	    	+ "&nomecamada=" + serv.title
	    	+ "&tiporep=&suportasld=nao"
	    	+ "&formatosinfo=text/plain,application/vnd.ogc.gml"
	    	+ "&time=" + timeParams[timeParams.length-1]
	    	+ "&times=" + timeParams.join("|")
    	    	+ serv.outros;

	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			$(btn).button("disable").find("span").addClass("hidden");
			i3GEO.janela.fechaAguarde();
			if(data.errorMsg != ""){
			    i3GEO.janela.snackBar({content: data.errorMsg, style:'red'});
			} else {
				i3f.renderFunction();
				i3GEO.janela.snackBar({content: $trad("concluido",i3f.dicionario)});
				i3GEO.mapa.refresh();
			}

		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
			$(btn).button("disable").find("span").addClass("hidden");
		    }
	    );
	}
};