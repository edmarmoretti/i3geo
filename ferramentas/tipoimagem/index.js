if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}

i3GEOF.tipoimagem = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOtipoimagemContainer",
	    "namespace": "tipoimagem"
	},
	start: function(iddiv){
	    var i3f = this,
	    p = i3f._parameters;
	    if(p.mustache === ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/" + p.namespace +"/template_mst.html", function(template) {
		    p.mustache = template;
		    i3f.html();
		});
		return;
	    } else {
		i3f.html();
	    }
	},
	html:function(){
	    var p = this._parameters,
	    i3f = this;
	    var hash = i3GEO.idioma.objetoIdioma(i3f.dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["namespace"] = p.namespace;
	    hash["idContainer"] = p.idContainer;
	    this.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    if(i3GEO.configura.tipoimagem != "nenhum"){
		var aplica = i3GEO.configura.tipoimagem.split(" ");
		$( "#tipoimagemForm input" ).each(function( index ) {
		    if(jQuery.inArray($( this ).prop("name"), aplica) !== -1){
			$( this ).prop("checked",true);
		    }
		});
	    }
	    i3GEO.janela.snackBar({content: $trad("selecionaFiltro",i3f.dicionario)})
	},
	aplicar: function(){
	    var f = [];
	    $( "#tipoimagemForm input:checked" ).each(function( index ) {
		f.push($( this ).prop("name"));
	    });
	    if(f.length == 0){
		f.push("nenhum");
	    }
	    i3GEO.configura.tipoimagem = f.join(" ");
	    i3GEO.Interface.alteraParametroLayers("TIPOIMAGEM",f.join(" "));
	    i3GEO.Interface.atualizaMapa();
	}
};