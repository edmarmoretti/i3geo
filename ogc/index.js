ogc = {};
ogc.menus = {
	//variavel global indicando o elemento que recebera a lista de menus
	ondeLista: "",
	init: function(onde){
	    ogc.menus.ondeLista = onde;
	    //ogc.menus.lista();
	    ogc.menus.listaCompleta();
	},
	/*
Function: lista

Lista de menus
	 */
	lista: function(){
	    $.post(
		    "exec.php",
		    "funcao=lista"
	    )
	    .done(
		    function(data, status){
			var json = jQuery.parseJSON(data);
			var html = Mustache.to_html(
				"{{#data}}" + $("#templateLista").html() + "{{/data}}",
				$.extend(
					{},
					ogc.menus.dicionario,
					{
					    "data": json["dados"],
					    "onclick": "ogc.menus.proximoNivel"
					}
				)
			);
			ogc.menus.ondeLista.html(html);
			$.material.init();
		    }
	    )
	    .fail(function(data){
		ogc.menus.ondeLista.html('<div class="alert alert-danger alert-dismissible" role="alert">' + data.status + " " +data.statusText + '</div>');
	    });
	},
	proximoNivel: function(id,nome){
	    window.location.href = "menu/index.php?id_menu=" + id + "&nome_menu=" + nome;
	},
	mostraLinksServico: function(codigo_tema){
	    $(".modal-body").html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span>');
	    var html;
	    tradLinks["tema"] = codigo_tema;
	    html = Mustache.to_html(
		    $("#templateLinksOgc").html(),
		    tradLinks
	    );
	    $(".modal-body").html(html);
	},
	mostraLinksDownload: function(codigo_tema){
	    $(".modal-body").html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span>');
	    tradLinks["tema"] = codigo_tema;
	    $.get(
		    "../serverapi/catalog/index.php/?funcao=downloadlayer&tema="+codigo_tema
	    )
	    .done(
		    function(data, status){
			var html,arqs,i,n,ins = "";
			tradLinks["mapfile"] = window.location.protocol + "//" + window.location.host + "/" + data.mapfileurl;
			tradLinks["sldurl"] = tradLinks["urli3geo"] + "/ferramentas/legenda/exec.php?funcao=TEMA2SLD&tema=" + data.tema + "&map_file=" + data.mapfile;
			arqs = data.arquivos.split(",");
			n = arqs.length;
			for (i=0; i<n; i++){
			    ins += "<p><a href='"+window.location.protocol+"//"+window.location.host+"/"+arqs[i]+"'>"+arqs[i]+"</a></p>";
			}
			tradLinks["shp"] = ins;
			html = Mustache.to_html(
				$("#templateLinksDownload").html(),
				tradLinks
			);
			tradLinks["shp"] = "";
			tradLinks["mapfile"] = "";
			tradLinks["sldurl"] = "";
			$(".modal-body").html(html);
		    }
	    )
	    .fail(function(data){
		ogc.grupo.ondeLista.html('<div class="alert alert-danger alert-dismissible" role="alert">' + data.status + " " +data.statusText + '</div>');
	    });
	},

	listaCompleta: function (onde){
	    $.post(
		    "exec.php",
		    "funcao=listatodas"
	    )
	    .done(
		    function(data, status){
			var json = jQuery.parseJSON(data);
			//
			//monta a lista de camadas
			//
			var htmlcamadas = Mustache.to_html(
				"{{#data}}" + $("#templateCamadas").html() + "{{/data}}",
				$.extend(
					{},
					ogc.menus.dicionario,
					{
					    "data": json["camadas"],
					    "dominio": "ogc.menus",
					    "disabledlink": function(){
						if(this.link_tema == ""){
						    return "hidden";
						}
						else {
						    return "";
						}
					    },
					    "disableddown": function(){
						if(this.download_tema != "nao"){
						    return "";
						}
						else {
						    return "hidden";
						}
					    },
					    "disabledogc": function(){
						if(this.ogc_tema != "nao"){
						    return "";
						}
						else {
						    return "hidden";
						}
					    }
					}
				)
			);
			ogc.menus.ondeLista.html(htmlcamadas);
			$.material.init();
		    }
	    )
	    .fail(function(data){
		ogc.menus.ondeLista.html('<div class="alert alert-danger alert-dismissible" role="alert">' + data.status + " " +data.statusText + '</div>');
	    });
	}
};