i3GEO.catalogoInde = {
	config: {
	    'templateDir': 'templates/dir.html',
	    'templateTema': 'templates/tema.html',
	    'idCatalogoPrincipal': 'catalogoPrincipal',
	    'idCatalogoNavegacao': 'catalogoNavegacao',
	    'idOndeMigalha': 'catalogoMigalha'
	},
	wait: false,
	DADOS: "",
	carregaTemplates: function(){
	    var t1 = i3GEO.catalogoInde.config.templateDir,
	    t2 = i3GEO.catalogoInde.config.templateTema,
	    t3 = $("#" + i3GEO.catalogoInde.config.idOndeMigalha).attr("data-template");
	    $.when( $.get(t1),$.get(t2),$.get(t3) ).done(function(r1,r2,r3) {
		i3GEO.template.dir = r1[0];
		i3GEO.template.catalogoMigalha = r2[0];
		i3GEO.template.ferramentasMigalha = r3[0];
		i3GEO.catalogoInde.inicia();
	    }).fail(function() {
		i3GEO.janela.closeMsg($trad("erroTpl"));
		return;
	    });
	},
	aguarde: function(){
	    $("#" + i3GEO.catalogoInde.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
	    var migalha = i3GEO.catalogoInde.MIGALHA;
	    var n = migalha.length;

	    var nome = migalha[n - 1].nome;
	    var onclick = migalha[n - 2].onclick;

	    var t = Mustache.to_html(
		    i3GEO.template.catalogoMigalha,
		    {"nome":nome,"onclick":"i3GEO.catalogoInde.MIGALHA.pop();i3GEO.catalogoInde.MIGALHA.pop();" + onclick}
	    );
	    $("#" + i3GEO.catalogoInde.config.idOndeMigalha).html(t);
	    $("#i3GEOguiaMovelConteudo").scrollTop(0);

	},
	escondeCatalogoPrincipal: function(){
	    $("#" + i3GEO.catalogoInde.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
	    $("#" + i3GEO.catalogoInde.config.idCatalogoNavegacao).fadeOut( "fast", function(){
		$("#" + i3GEO.catalogoInde.config.idOndeMigalha).hide();
		$("#" + i3GEO.catalogoInde.config.idCatalogoPrincipal).show();
	    });
	    //i3GEO.catalogoInde.DADOS = "";
	},
	adicionaTema : function(url,layer,id,nome) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.catalogoInde.adicionaTema");

	    // confirma se o tema existe no mapa
	    if (i3GEO.arvoreDeCamadas.pegaTema(id) !== "") {
		i3GEO.arvoreDeCamadas.ligaDesligaTemas(id, true);
	    } else {
		if(url.indexOf("?") == -1){
		    url = url + "?";
		}
		i3GEO.mapa.adicionaTemaWMS({
		    wms_name: layer,
		    url: url,
		    proj: 'EPSG:4326',
		    formatlist: 'image/png',
		    version: '1.1.1',
		    infoformat: "text/plain",
		    layerTitle: nome
		});
	    }
	},
	inicia: function(config){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.catalogoInde.inicia");

	    if(i3GEO.catalogoOgc.wait == true){
		return;
	    }
	    i3GEO.catalogoOgc.wait = true;

	    if(config){
		$.each( config, function( i,v ) {
		    i3GEO.catalogoInde.config[i] = v;
		});
	    }
	    i3GEO.catalogoInde.aguarde();
	    if(!i3GEO.template.dir || !i3GEO.template.tema || !i3GEO.template.catalogoMigalha){
		i3GEO.catalogoOgc.wait = false;
		i3GEO.catalogoInde.carregaTemplates();
		return;
	    } else {
		//i3GEO.catalogoInde.DADOS = "";
		i3GEO.catalogoInde.MIGALHA = [
		    {"nome":"","onclick":"i3GEO.catalogoInde.mostraCatalogoPrincipal()"},
		    {"nome":"INDE-Br","onclick":"i3GEO.catalogoInde.inicia()"}
		    ];
		i3GEO.catalogoInde.atualizaMigalha();

		config = i3GEO.catalogoInde.config;

		i3GEO.catalogoInde.escondeCatalogoPrincipal();

		$("#" + i3GEO.catalogoInde.config.idCatalogoNavegacao).show();

		var lista = function(){
		    var dados = i3GEO.catalogoInde.DADOS;
		    var clone = [],
		    t;
		    $.each( dados, function( i,v ) {
			if(v.url.trim() != ""){
			    clone.push({
				"nome": v.descricao,
				"onclick": "i3GEO.catalogoInde.listaTemas('" + v.url + "','" + v.descricao + "','" + v.id + "')"
			    });
			}
		    });
		    t = Mustache.to_html(
			    "{{#data}}" + i3GEO.template.dir + "{{/data}}",
			    {"data":clone}
		    );
		    $("#" + config.idCatalogoNavegacao).html(t);
		    $("#" + i3GEO.catalogoInde.config.idOndeMigalha).show();
		    $("#" + i3GEO.catalogoInde.config.idCatalogoPrincipal).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoInde.config.idCatalogoNavegacao).show();
		    });
		    i3GEO.janela.snackBar({content: $trad("catatua"),style: 'green'});
		};
		if(i3GEO.catalogoInde.DADOS == ""){
		    i3GEO.catalogoInde.aguarde();
		    $.get(
			    i3GEO.configura.locaplic + "/ferramentas/vinde/buscacamada.php",
			    {g_sid: i3GEO.configura.sid}
		    ).done(function(data) {
			i3GEO.catalogoOgc.wait = false;
			i3GEO.catalogoInde.DADOS = data;
			lista();
		    }).fail(function() {
			i3GEO.catalogoOgc.wait = false;
			i3GEO.janela.snackBar({content: $trad("erroLoad"),style: 'red'});
			$("#" + config.idCatalogoNavegacao).html("");
			$("#" + i3GEO.catalogoInde.config.idOndeMigalha).show();
			return;
		    });
		} else {
		    i3GEO.catalogoOgc.wait = false;
		    lista();
		}
	    }
	},
	listaTemas: function(url,descricao,id){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.catalogoInde.listaGrupos");

	    if(i3GEO.catalogoOgc.wait == true){
		return;
	    }
	    i3GEO.catalogoOgc.wait = true;
	    i3GEO.catalogoInde.MIGALHA.push({"nome": descricao,"onclick":"i3GEO.catalogoInde.listaTemas('" + url + "','" + descricao + "','" + id + "')"});
	    i3GEO.catalogoInde.atualizaMigalha();
	    i3GEO.catalogoInde.aguarde();
	    var lista = function(data){
		var clone = [],
		temp;
		$.each( data, function( i,v ) {
		    var link = "";
		    if(v.UuidMetadado != ""){
			link = "<a href='http://www.metadados.inde.gov.br/geonetwork/srv/br/pdf?uuid=" + v.UuidMetadado + "' target='_blank' >Metadata</a>";
		    }
		    clone.push({
			"nome": v.Titulo,
			"onclick": "i3GEO.catalogoInde.adicionaTema('" + url + "','" + v.Camada + "','inde" + id + "-" + v.$id + "','" + v.Titulo + "')",
			"link": link
		    });
		});
		var t = Mustache.to_html(
			"{{#data}}" + i3GEO.template.tema + "{{/data}}",
			{"data":clone}
		);
		$("#" + i3GEO.catalogoInde.config.idCatalogoNavegacao).html(t);
		i3GEO.janela.snackBar({content: $trad("catatua"),style: 'green'});
	    };
	    $.get(
		    i3GEO.configura.locaplic + "/ferramentas/vinde/geoservicoget.php",
		    {
			g_sid: i3GEO.configura.sid,
			url: url
		    }
	    ).done(function(data) {
		i3GEO.catalogoOgc.wait = false;
		lista(data);
	    }).fail(function() {
		i3GEO.catalogoOgc.wait = false;
		i3GEO.janela.snackBar({content: $trad("erroLoad"),style: 'red'});
		return;
	    });
	}
};