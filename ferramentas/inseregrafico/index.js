if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.inseregrafico = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOinseregraficoContainer",
	    "namespace": "inseregrafico"
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    p.tema = tema;
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
	    //nao use this aqui
	    i3GEO.eventos.cliquePerm.ativa();
	    i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.inseregrafico.get('xx yy')"]);
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
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");
	    //eventos das guias
	    $i("i3GEOinseregraficoguia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");
	    };
	    $i("i3GEOinseregraficoguia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia2","i3GEOinseregraficoguia");
	    };
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.inseregrafico.get('xx yy')"]);
	    temp = Math.random() + "a";
	    temp = temp.split(".");
	    g_nomepin = "pin"+temp[1];
	    i3GEOF.inseregrafico.comboTemas();
	},
	comboTemas: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOinseregraficotemasLigados",
		    function(retorno){
			$i("i3GEOinseregraficotemasi").innerHTML = retorno.dados;
			$i("i3GEOinseregraficotemasLigados").onchange = function(){
			    i3GEO.tema.itens(
				    i3GEOF.inseregrafico.listaItens,
				    $i("i3GEOinseregraficotemasLigados").value
			    );
			};
		    },
		    "i3GEOinseregraficotemasi",
		    "",
		    false,
		    "ligados",
		    " ",
		    false,
		    true,
		    "form-control"
	    );
	},
	listaItens: function(data){
	    var i,c,
	    n,
	    ins = "";
	    n = data.valores.length;
	    for (i=0;i<n; i++){
		ins += '<li><div class="form-group condensed"><div style="display:inline;width:100px;" class="checkbox text-left"><label>'
		    + '<input type="checkbox" name="'
		    + data.valores[i].item + '">'
		    + '<span class="checkbox-material noprint"><span class="check"></span></span> '
		    + data.valores[i].item
		    + '</label></div>';

		ins += 	'&nbsp;<div style="display:inline-block;" class="form-group label-fixed condensed" >'
		    + '<input style="width:100px;" class="form-control input-lg i3geoFormIconeAquarela" type="text" value="' + i3GEO.util.randomRGB() + '" id="cliqueGr' + i + '"/></div></div></li>';
	    }
	    $i("i3GEOinseregraficolistai").innerHTML = ins;
	    i3GEO.util.aplicaAquarela("i3GEOinseregraficolistai");
	},
	pegaItensMarcados: function(){
	    var listadeitens = [],
	    inputs = $i("i3GEOinseregraficolistai").getElementsByTagName("li"),
	    i,linah,
	    it,
	    n;
	    n = inputs.length;
	    for (i=0;i<n; i++){
		it = inputs[i].getElementsByTagName("input");
		if (it[0].checked === true)	{
		    listadeitens.push(it[0].name+","+it[1].value);
		}
	    }
	    return(listadeitens.join("*"));
	},
	getFormData: function(){
	    var data = {
		    tema: $i("i3GEOinseregraficotemasLigados").value,
		    itens: [],
		    ...i3GEO.util.getFormData("#i3GEOinseregraficoguia2obj form")
	    };

	    var inputs = $i("i3GEOinseregraficolistai").getElementsByTagName("li"),
	    i,
	    it,
	    n;
	    n = inputs.length;
	    for (i=0;i<n; i++){
		it = inputs[i].getElementsByTagName("input");
		if (it[0].checked === true)	{
		    data.itens.push(it[0].name+","+it[1].value);
		}
	    }
	    data.itens = data.itens.join("*");
	    return data;
	},
	get: function(xy){
	    var p = this._parameters,
	    i3f = this,
	    par = this.getFormData();

	    xy = xy.split(" ");
	    par.x = xy[0];
	    par.y = xy[1];
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    par.funcao = "insereSHPgrafico";
	    par.tipo = "pizza";

	    i3GEO.janela.abreAguarde();

	    par.g_sid = i3GEO.configura.sid;
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + p.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela.fechaAguarde();
			i3GEO.mapa.refresh();
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	}
};