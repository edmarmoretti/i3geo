if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.graficotema = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelista": "",
	    "idContainer": "i3GEOgraficotemaContainer",
	    "namespace": "graficotema",
	    "comboItens": ""
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/templateLista_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2)).done(function(r1,r2) {
		    p.mustache = r1[0];
		    p.mustachelista = r2[0];
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
	    //nao use this aqui
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
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia1","i3GEOgraficotemaguia");
	    $i("i3GEOgraficotemaguia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia1","i3GEOgraficotemaguia");
	    };
	    $i("i3GEOgraficotemaguia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia2","i3GEOgraficotemaguia");
	    };
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3GEO.tema.itens(i3f.montaListaItens,p.tema);
	},
	montaListaItens: function(data){
	    var i3f = i3GEOF.graficotema,
	    p = i3f._parameters,
	    ins = [],i,n, temp = {}, mustache = [];

	    n = data.valores.length;

	    for (i=0;i<n; i++){
		temp = {};
		temp.item = data.valores[i].item;
		temp.rcor = i3GEO.util.randomRGB();
		mustache.push(temp);
	    }
	    ins = Mustache.render(
		    p.mustachelista,
		    $.extend(
			    {},
			    {
				"linhas" :  mustache
			    },
			    i3GEO.idioma.objetoIdioma(i3f.dicionario)
		    )
	    );
	    $i("i3GEOgraficotemalistai").innerHTML = ins;
	    i3GEO.util.aplicaAquarela("i3GEOgraficotemalistai");
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
	    par.tema = p.tema;
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.graficotema._parameters.tema);
			}
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
	},
	getFormData: function(){
	    var data = i3GEO.util.getFormData("#i3GEOgraficotemaguia2obj form");
	    if (data.tipo === "PIE"){
		data.tamanho = data.largura;
	    }
	    else{
		data.tamanho = data.largura + " " + data.altura;
	    }
	    return data
	},
	pegaItensMarcados: function(){
	    var listadeitens = [],
	    inputs = $i("i3GEOgraficotemalistai").getElementsByTagName("input"),
	    i,
	    it,
	    c,
	    n;
	    n = inputs.length;
	    for (i=0;i<n; i++)
	    {
		if (inputs[i].checked === true)
		{
		    it = inputs[i].id;
		    c = $i(it+"cor").value;
		    listadeitens.push(it.replace("i3GEOgraficotema","")+","+c);
		}
	    }
	    return(listadeitens.join("*"));
	},
	criaNovoTema: function(btn){
	    var lista = i3GEOF.graficotema.pegaItensMarcados(),
	    nlista = lista.split("*").length;
	    if(nlista < 2){
		i3GEO.janela.snackBar({content: $trad('msgSelecionaItens',i3GEOF.graficotema.dicionario)});
		return;
	    }
	    var par = i3GEOF.graficotema.getFormData();
	    par.funcao = "graficotema";
	    par.lista = lista;

	    i3GEOF.graficotema.get({
		snackbar: false,
		fn: false,
		btn: btn,
		par: par,
		refresh: true
	    });
	}
};
i3GEOF.graficoTema = i3GEOF.graficotema;