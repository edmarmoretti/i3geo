
if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.etiqueta = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelista": "",
	    "idContainer": "i3GEOetiquetaContainer",
	    "namespace": "etiqueta"
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
	    //i3GEOF.legenda._parameters.mustache = "";
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    aplica: $trad("p14"),
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

	    i3GEO.php.listaItensTema(
		    i3GEOF.etiqueta.montaListaItens,
		    p.tema
	    );
	},
	montaListaItens: function(retorno){
	    var data = retorno.data;
	    var funcao = function(lista){
		var mustache = [], ins,i,n,itensatuais,item, ck = '',temp;
		itensatuais = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.etiqueta._parameters.tema);
		itensatuais = itensatuais.etiquetas.split(",");
		n = data.valores.length;
		for (i=0;i<n; i++){
		    temp = {};
		    item = data.valores[i].item;
		    temp.item = item;
		    if(i3GEO.util.in_array(item,lista.itens) || i3GEO.util.in_array(item,itensatuais) || lista.itembuscarapida[item]){
			temp.ckIdentifica = "checked";
		    }
		    else{
			temp.ckIdentifica = "";
		    }
		    if(i3GEO.util.in_array(item,itensatuais)){
			temp.ckEtiquetaTip = "checked";
		    }
		    else{
			temp.ckEtiquetaTip = "";
		    }
		    //utfdata
		    if(lista.utfdata === item){
			temp.ckUtfdata = "checked";
		    }
		    else{
			temp.ckUtfdata = "";
		    }
		    //buscarapida
		    if(lista.itembuscarapida === item){
			temp.ckBuscaRapida = "checked";
		    }
		    else{
			temp.ckBuscaRapida = "";
		    }
		    if(lista.itensdesc[item]){
			temp.ckitensdesc = lista.itensdesc[item];
		    }
		    else{
			temp.ckitensdesc = item;
		    }
		    //links
		    if(lista.itenslink[item]){
			temp.ckitem = lista.itenslink[item];
		    }
		    else{
			temp.ckitem = "";
		    }
		    mustache.push(temp);
		}
		ins = Mustache.render(
			i3GEOF.etiqueta._parameters.mustachelista,
			$.extend(
				{},
				{
				    "linhas" :  mustache,
				},
				i3GEO.idioma.objetoIdioma(i3GEOF.etiqueta.dicionario)
			)
		);
		$i("i3GEOetiquetalistai").innerHTML = ins;
		//enable
		lista = $i("i3GEOetiquetalistai").getElementsByTagName("input");
		n = lista.length;
		for (i=0;i<n; i++){
		    if(lista[i].name === "identifica"){
			i3GEOF.etiqueta.ativaLinha(lista[i]);
		    }
		}
	    };
	    i3GEOF.etiqueta.get({
		snackbar: false,
		fn: funcao,
		btn: false,
		par: {funcao: "pegaDadosEtiquetas"},
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.etiqueta._parameters.tema);
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
	ativaLinha: function(obj){
	    var linha = obj.parentNode.parentNode,
	    objs = linha.getElementsByTagName("input"),
	    n = objs.length,
	    i;
	    for(i=0;i<n;i++){
		if(objs[i].name != "identifica"){
		    objs[i].disabled = !obj.checked;
		}
	    }
	},
	pegaItensMarcados: function(){
	    var tips = [],
	    itens = [],
	    itensdesc = [],
	    itenslink = [],
	    itembuscarapida = "",
	    utfdata = "",
	    inputs = $i("i3GEOetiquetalistai").getElementsByTagName("input"),
	    i,
	    el,
	    it,
	    n = inputs.length;
	    for (i=0;i<n; i++){
		el = inputs[i];
		if (el.checked === true && el.name == "identifica"){
		    itens.push(el.value);
		}
	    }
	    for (i=0;i<n; i++){
		el = inputs[i];
		if($.inArray( $(el).attr('data-col'), itens ) < 0 ){
		    continue;
		}
		if (el.checked === true && el.name == "etiquetaTip"){
		    tips.push(el.value);
		}
		if (el.name == "itensdesc"){
		    itensdesc.push(el.value);
		}
		if (el.name == "itenslink"){
		    itenslink.push(el.value);
		}
		if (el.checked === true && el.name == "itembuscarapida"){
		    itembuscarapida = el.value;
		}
		if (el.checked === true && el.name == "utfdata"){
		    utfdata = el.value;
		}
	    }
	    return([tips,itens,itensdesc,itenslink,itembuscarapida,utfdata]);
	},
	ativa: function(btn){
	    var lista = i3GEOF.etiqueta.pegaItensMarcados();
	    var par = {
		funcao: "ativaEtiquetas",
		tips: lista[0].toString(","),
		itens: lista[1].toString(","),
		itensdesc: lista[2].toString(","),
		itenslink: lista[3].toString(","),
		itembuscarapida: lista[4],
		utfdata: lista[5]
	    };
	    i3GEOF.etiqueta.get({
		snackbar: false,
		fn: false,
		btn: btn,
		par: par,
		refresh: true
	    });
	},
	desativa: function(btn){
	    i3GEOF.etiqueta.get({
		snackbar: false,
		fn: function(){
		    i3GEO.php.listaItensTema(
			    i3GEOF.etiqueta.montaListaItens,
			    i3GEOF.etiqueta._parameters.tema
		    );
		},
		btn: btn,
		par: {funcao: "removeEtiquetas"},
		refresh: true
	    });
	}
};