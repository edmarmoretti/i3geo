i3GEO.catalogoOgc = {
	WMS: "",
	MIGALHA: [],
	config: {
	    'templateDir': 'templates/dir',
	    'templateTema': 'templates/tema',
	    'idCatalogoPrincipal': 'catalogoPrincipal',
	    'idCatalogoNavegacao': 'catalogoNavegacao',
	    'idOndeMigalha': 'catalogoMigalha'
	},
	carregaTemplates: function(){
	    var t1 = i3GEO.catalogoOgc.config.templateDir,
	    t2 = i3GEO.catalogoOgc.config.templateTema,
	    t3 = $("#" + i3GEO.catalogoOgc.config.idOndeMigalha).attr("data-template");
	    $.when( $.get(t1),$.get(t2),$.get(t3) ).done(function(r1,r2,r3) {
		i3GEO.template.dir = r1[0];
		i3GEO.template.tema = r2[0];
		i3GEO.template.catalogoMigalha = r3[0];
		i3GEO.caixaDeFerramentas.inicia();
	    }).fail(function() {
		i3GEO.janela.closeMsg($trad("erroTpl"));
		return;
	    });
	},
	aguarde: function(){
	    $("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
	    var migalha = i3GEO.catalogoOgc.MIGALHA;
	    var n = migalha.length;
	    var nome = migalha[n - 1].nome;
	    if(migalha[n - 2]){
		var onclick = migalha[n - 2].onclick;
	    } else {
		var onclick = i3GEO.catalogoOgc.inicia;
	    }
	    var t = Mustache.to_html(
		    i3GEO.template.catalogoMigalha,
		    {"nome":nome,"onclick":"i3GEO.catalogoOgc.MIGALHA.pop();i3GEO.catalogoOgc.MIGALHA.pop();" + onclick}
	    );
	    $("#" + i3GEO.catalogoOgc.config.idOndeMigalha).html(t);
	    $("#i3GEOguiaMovelConteudo").scrollTop(0);
	},
	escondeCatalogoPrincipal: function(){
	    $("#" + i3GEO.catalogoOgc.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
	    $("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).fadeOut( "fast", function(){
		$("#" + i3GEO.catalogoOgc.config.idOndeMigalha).hide();
		$("#" + i3GEO.catalogoOgc.config.idCatalogoPrincipal).show();
	    });
	},
	inicia: function(config){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.catalogoOgc.inicia");

	    if(config){
		$.each( config, function( i,v ) {
		    i3GEO.catalogoOgc.config[i] = v;
		});
	    }
	    i3GEO.catalogoOgc.aguarde();
	    if(!i3GEO.template.dir || !i3GEO.template.tema || !i3GEO.template.catalogoMigalha){
		i3GEO.catalogoOgc.carregaTemplates();
		return;
	    } else {
		i3GEO.catalogoOgc.MIGALHA = [
		    {"nome":"","onclick":"i3GEO.catalogoOgc.mostraCatalogoPrincipal()"},
		    {"nome":"Webservices","onclick":"i3GEO.catalogoOgc.inicia()"}
		    ];
		i3GEO.catalogoOgc.atualizaMigalha();

		config = i3GEO.catalogoOgc.config;

		i3GEO.catalogoOgc.escondeCatalogoPrincipal();

		var t = Mustache.to_html(
			i3GEO.template.catalogoMigalha,
			{"nome":'Webservices',"onclick":"i3GEO.catalogoOgc.mostraCatalogoPrincipal()"}
		);

		i3GEO.catalogoOgc.config = config;

		var lista = function(dados){
		    var clone = [],
		    t;

		    //ajusta o nome
		    //verifica se o menu esta na lista de ids definidos em i3GEO.catalogoOgc.IDSMENUS
		    $.each( dados, function( i,v ) {
			v.nome = v.title;
			v.tipo = v.tipo_ws;
			v.descricao = v.description;
			v.onclick = "i3GEO.catalogoOgc.listaCamadas('" + v.nome + "'," + v.id_ws + ",'" + v.nome + "','" + v.link + "',0" + ",'" + v.tipo_ws + "','" + v.layer + "')";
			if(v.tipo_ws == "KML"){
			    v.onclick = "i3GEO.catalogoOgc.addkml('" + v.link + "')";
			    v.hiddenfolder = "hidden";
			}
			if(v.tipo_ws == "WMS-Time"){
			    v.onclick = "i3GEO.catalogoOgc.addwmstime('" + v.link + "','" + v.id_ws + "','" + v.nome + "')";
			    v.hiddenfolder = "hidden";
			}
			if(v.tipo_ws == "GEORSS"){
			    v.onclick = "i3GEO.catalogoOgc.addgeorss('" + v.link + "')";
			    v.hiddenfolder = "hidden";
			}
			if(v.tipo_ws == "GEOJSON"){
			    v.onclick = "i3GEO.catalogoOgc.addgeojson('" + v.link + "')";
			    v.hiddenfolder = "hidden";
			}
			clone.push(v);
		    });
		    t = Mustache.to_html(
			    "{{#data}}" + i3GEO.template.dir + "{{/data}}",
			    {"data":clone}
		    );
		    $("#" + config.idCatalogoNavegacao).html(i3GEO.catalogoOgc.getAddSercicesBtn() + t);

		    $("#" + i3GEO.catalogoOgc.config.idCatalogoPrincipal).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoOgc.config.idOndeMigalha).show();
			$("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).show();
		    });
		};
		var t1 = i3GEO.configura.locaplic + "/classesphp/wscliente.php?funcao=listaRSSwsARRAY&tipo=WMS,ARCGISREST,KML,GEORSS,GEOJSON&rss="+["|"];
		$.get(t1).done(function(r1) {
		    var dados = [];
		    if(r1.data){
			dados = r1.data;
		    }
		    lista(dados.sort(i3GEO.util.dynamicSortString("title")));
		}).fail(function() {
		    i3GEO.janela.closeMsg($trad("erroTpl"));
		    return;
		});
	    }
	},
	listaCamadas: function(nomeMigalha, id_ws, nome, url, nivel, tipo_ws, layer){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.catalogoOgc.listaCamadas");

	    var monta;

	    i3GEO.catalogoOgc.MIGALHA.push({"nome": nome,"onclick":"i3GEO.catalogoOgc.listaCamadas('" + nome + "','" + id_ws + "','" + nome + "','" + url + "','" + nivel + "','" + tipo_ws + "','" + layer + "')"});
	    i3GEO.catalogoOgc.atualizaMigalha();

	    i3GEO.catalogoOgc.aguarde();

	    if(tipo_ws == "ARCGISREST"){
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.catalogoOgc.listaCamadas ARCGISREST");

		monta = function(retorno){
		    //a resposta do ARCGIS no primeiro nivel eh uma lista
		    //de diretorios no elemento folders
		    //na sequencia, retorna lista com os servicos
		    //no ultimo nivel, ao listar o WMS, contem o elemento supportedExtensions
		    var data = retorno.data.folders,
		    clone = [],
		    g = "",
		    onclick = "",
		    temas;
		    if(retorno.data.services && retorno.data.services.length > 0){
			data = retorno.data.services;
		    }
		    //verifica se o proximo nivel e um wms
		    if(!retorno.data.supportedExtensions){
			$.each( data, function( i,v ) {
			    if (v) {
				if (!v.name) {
				    onclick = "i3GEO.catalogoOgc.listaCamadas('" + v + "'," + id_ws + ",'/" + v + "','" + url + "','','ARCGISREST','" + v + "')";
				    clone.push({
					"nome": v,
					"descricao": "",
					"onclick": onclick
				    });
				} else {
				    var s = '/' + v.name;
				    var n = v.name;
				    if(v.type && v.type == "MapServer"){
					s = '/' + v.name + '/MapServer';
				    }
				    onclick = "i3GEO.catalogoOgc.listaCamadas('" + n + "'," + id_ws + ",'" + s + "','" + url + "','','ARCGISREST','" + n + "')";
				    clone.push({
					"nome": v.name,
					"descricao": "",
					"onclick": onclick
				    });
				}
			    }
			});
			if(clone.length > 0){
			    g = Mustache.to_html(
				    "{{#data}}" + i3GEO.template.dir + "{{/data}}",
				    {"data":clone}
			    );
			    $("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).html(g);
			}
		    }else {
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.catalogoOgc.listaCamadas camadas wms");

			i3GEO.catalogoOgc.listaCamadas(
				"WMSServer",
				id_ws,
				retorno.data.serviceDescription,
				url.replace("rest/","") + nome + "/WMSServer?",
				0,
				'wms',
				'undefined'
			);
		    }

		};

		if(nomeMigalha == nome){//busca a primeira lista de diretorios
		    i3GEO.php.listaLayersARCGISREST(monta, id_ws, "");
		} else {
		    i3GEO.php.listaLayersARCGISREST(monta, id_ws, nome);
		}
	    } else {
		monta = function(dados){
		    var data = dados.data,
		    clone = [],
		    g = "",
		    temas;

		    //monta a lista com proximo nivel
		    if(data.length > 0){
			$.each( data, function( i,v ) {
			    if (v.nome + " - " + v.titulo !== "undefined - undefined") {
				v.descricao = v.titulo;
				if (!v.estilos) {
				    v.onclick = "i3GEO.catalogoOgc.listaCamadas('" + nome + "'," + id_ws + ",'" + v.nome + "','" + url + "'," + (nivel*1 + 1) + ",'" + tipo_ws + "','" + v.titulo + "')";
				    clone.push(v);
				} else {
				    i3GEO.catalogoOgc.temas({
					"estilos": v.estilos,
					"servico": url,
					"layer": v.nome,
					"proj": v.srs.toString(),
					"formatoimg": v.formats.toString(),
					"versao": v.version.toString(),
					"formatoinfo": v.formatsinfo.toString()
				    });
				}
			    }
			});
			if(clone.length > 0){
			    g = Mustache.to_html(
				    "{{#data}}" + i3GEO.template.dir + "{{/data}}",
				    {"data":clone}
			    );
			    $("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).html(g);
			}

		    } else {
			i3GEO.janela.snackBar({content: "Erro", style:'red'});
			$("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).html("");
		    }
		};
		i3GEO.php.listaLayersWMS(monta, url, (nivel * 1) + 1, id_ws, layer,
			tipo_ws);
	    }
	},
	temas: function(config){
	    if (typeof (console) !== 'undefined')
		    console.info(config);

	    var clone = [],
	    estilos = config.estilos;

	    $.each( estilos, function( i,v ) {
		if(v.titulo == "default"){
		    v.titulo = i3GEO.catalogoOgc.MIGALHA[i3GEO.catalogoOgc.MIGALHA.length - 1].nome;
		}
		if(config.proj == ""){
		    config.proj = i3geoOL.getView().getProjection().getCode();
		}
		v.onclick = "i3GEO.php.adicionaTemaWMS('','"
		    + config.servico + "','"
		    + config.layer + "','"
		    + v.nome + "','"
		    + config.proj + "','"
		    + config.formatoimg + "','"
		    + config.versao + "','"
		    + v.titulo + "','','nao','"
		    + config.formatoinfo + "','','',"
		    + "true)";
		v.nome = estilos[i].nome + " - " + estilos[i].titulo;
		clone.push(v);
	    });
	    var t = Mustache.to_html(
		    "{{#data}}" + i3GEO.template.tema + "{{/data}}",
		    {"data":clone}
	    );
	    $("#" + i3GEO.catalogoOgc.config.idCatalogoNavegacao).html(t);
	},
	getAddSercicesBtn: function(){
	    var itens = [];
	    itens.push({
		title : "",
		text: "KML",
		onclick : "i3GEO.catalogoOgc.kml()"
	    },{
		title : "",
		text: "GeoRSS",
		onclick : "i3GEO.catalogoOgc.georss()"
	    },{
		title : "",
		text: "GeoJson",
		onclick : "i3GEO.catalogoOgc.geojson()"
	    },{
		title : "",
		text: "WMS",
		onclick : "i3GEO.catalogoOgc.wms()"
	    });
	    //TODO incluir essa opcao para permitir digitar uma nova url
	    /*,{
		title : "",
		text: "WMS-Time",
		onclick : "i3GEO.catalogoOgc.wmst()"
	    });
	     */
	    var t = Mustache.to_html(
		    "{{#data}}" + i3GEO.template.botoes.opcoes + "{{/data}}",
		    {"data":itens}
	    );
	    var btn = ""
		+ "<div class='servicesbtn container-fluid container-tools'>"
		+ "<div class='form-group condensed'>"
		+ t
		+ "</div>"
		+ "</div>";
	    return btn;
	},
	kml: function() {
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectarkml/dependencias.php",
		    "i3GEOF.conectarkml.start()",
	    "i3GEOF.conectarkml_script");
	},
	geojson: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectargeojson/dependencias.php",
		    "i3GEOF.conectargeojson.start()",
	    "i3GEOF.conectargeojson_script");
	},
	georss: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectargeorss/dependencias.php",
		    "i3GEOF.conectargeorss.start()",
	    "i3GEOF.conectargeorss_script");
	},
	wmst: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/wmstime/dependencias.php",
		    "i3GEOF.wmstime.start()",
	    "i3GEOF.wmstime_script");
	},
	wms: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectarwms/dependencias.php",
		    "i3GEOF.conectarwms.start()",
	    "i3GEOF.conectarwms_script");
	},
	addwmstime: function(url,id_ws,titulo){
	    var temp = function(){
		i3GEOF.wmstime.start(url,id_ws,titulo);
	    };
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/wmstime/dependencias.php",
		    temp,
	    "i3GEOF.wmstime_script");
	},
	addkml: function(url){
	    i3GEO.janela.abreAguarde();
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "crialayer",
		    url: url
	    };
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/conectarkml/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.atualiza();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: $trad("camadaadic")});
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
	addgeorss: function(url){
	    i3GEO.janela.abreAguarde();
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "adicionaTemaGeoRSS",
		    url: url
	    };
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/conectargeorss/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.atualiza();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: $trad("camadaadic")});
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
	addgeojson: function(url){
	    i3GEO.janela.abreAguarde();
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "crialayer",
		    url: url
	    };
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/conectargeojson/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.atualiza();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: $trad("camadaadic")});
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	}
};