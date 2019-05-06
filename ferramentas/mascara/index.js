if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.mascara = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOmascaraContainer",
	    "namespace": "mascara"
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    p.mustache = r1;
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    i3GEOF.mascara.selMascara();
	    i3GEOF.mascara.listaDeCamadas();
	},
	listaDeCamadas: function(marcar){
	    var camadas = i3GEO.arvoreDeCamadas.CAMADAS,
	    n = camadas.length, c,
	    ins = "";
	    if(!marcar){
		marcar = [];
	    }
	    while(n > 0){
		n -= 1;
		if(camadas[n].tema !== ""){
		    c = "";
		    if(marcar.indexOf(camadas[n].tema) >= 0){
			c = "checked";
		    }
		    ins += '<div class="checkbox text-left"><label>'
			+ '<input name="' + camadas[n].name + '" type="checkbox" ' + c + ' >'
			+ '<span class="checkbox-material noprint"><span class="check"></span></span>&nbsp;'
			+ camadas[n].tema
			+ '</label></div>';
		}
	    }
	    ins += "</table>";
	    $i("i3GEOFmascaraLista").innerHTML = ins;
	},
	selMascara: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOFmascaraSelTema",
		    function(retorno){
			$i("i3GEOmascaraTema").innerHTML = retorno.dados;
			$i("i3GEOFmascaraSelTema").onchange = function(){
			    i3GEOF.mascara.mascaraAtual($i("i3GEOFmascaraSelTema").value);
			};
		    },
		    "i3GEOmascaraTema",
		    "",
		    false,
		    "",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	listaTemas: function(){
	    var temp = [],
	    cs = $i("i3GEOFmascaraLista").getElementsByTagName("input"),
	    n = cs.length;
	    while(n > 0){
		n -= 1;
		if(cs[n].checked === true){
		    temp.push(cs[n].name);
		}
	    }
	    return temp;
	},
	aplicar : function(btn){
	    var p = this._parameters,
	    i3f = this,
	    tema = $i("i3GEOFmascaraSelTema").value,
	    mascarar = i3GEOF.mascara.listaTemas(), p, fim;

	    if(tema === ""){
		i3GEO.janela.tempoMsg($trad("tema",i3GEOF.mascara.dicionario));
		return;
	    }
	    i3f.get({
		snackbar: true,
		fn: function(retorno){
		    i3GEO.Interface.atualizaMapa();
		},
		btn: true,
		par: {
		    funcao: "aplicar",
		    tema: tema,
		    mascarar: mascarar.join(",")
		},
		refresh: false
	    });
	},
	mascaraAtual: function(tema){
	    var p = this._parameters,
	    i3f = this;
	    if(tema === ""){
		return;
	    }

	    i3f.get({
		snackbar: false,
		fn: function(retorno){
		    i3GEOF.mascara.listaDeCamadas(retorno.data);
		},
		btn: false,
		par: {
		    funcao: "listaTemas",
		    tema: tema
		},
		refresh: false
	    });
	},
	get: function({snackbar = true, btn = false, par = {}, refresh = false, fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    $.get(
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
			    i3GEO.mapa.refresh();			}
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
