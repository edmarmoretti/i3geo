i3GEO.catalogoMetaestat = {
	WMS: "",
	MIGALHA: [],
	config: {
		'seletorTemplateDir': '#guia2objTemplateDir',
		'seletorTemplateTema': '#guia2objTemplateTema',
		'idCatalogoPrincipal': 'catalogoPrincipal',
		'idCatalogoNavegacao': 'catalogoNavegacao',
		'idOndeMigalha': 'catalogoMigalha'
	},
	aguarde: function(){
		$("#" + i3GEO.catalogoMetaestat.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
		var migalha = i3GEO.catalogoMetaestat.MIGALHA;
		var n = migalha.length;

		var nome = migalha[n - 1].nome;
		var onclick = migalha[n - 2].onclick;

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":nome,"onclick":"i3GEO.catalogoMetaestat.MIGALHA.pop();i3GEO.catalogoMetaestat.MIGALHA.pop();" + onclick}
			);

		$("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).html(t);
		$("#i3GEOguiaMovelConteudo").scrollTop(0);
	},
	escondeCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoMetaestat.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoMetaestat.config.idCatalogoNavegacao).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).hide();
			$("#" + i3GEO.catalogoMetaestat.config.idCatalogoPrincipal).show();
		});
	},
	adicionaTema : function(tid) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoMetaestat.adicionaTema");

		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, true);
		} else {
			i3GEO.arvoreDeTemas.adicionaTemas([ tid ]);
		}
	},
	inicia: function(config){
		i3GEO.catalogoMetaestat.MIGALHA = [
		{"nome":"","onclick":"i3GEO.catalogoMetaestat.mostraCatalogoPrincipal()"},
		{"nome":$trad("x57"),"onclick":"i3GEO.catalogoMetaestat.inicia()"}
		];
		i3GEO.catalogoMetaestat.atualizaMigalha();

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.catalogoMetaestat.config[i] = v;
			});
		}
		config = i3GEO.catalogoMetaestat.config;

		i3GEO.catalogoMetaestat.escondeCatalogoPrincipal();

		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoMetaestat.inicia");

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":$trad("x57"),"onclick":"i3GEO.catalogoMetaestat.mostraCatalogoPrincipal()"}
			);

		i3GEO.catalogoMetaestat.aguarde();
		i3GEO.catalogoMetaestat.config = config;
		var lista = function(dados){
			var clone = [],
				t;

			$.each( dados, function( i,v ) {
				v.onclick = "i3GEO.catalogoMetaestat.listaMedidas(" + v.codigo_variavel + ",'" + v.nome + "')";
				clone.push(v);
			});
			t = Mustache.to_html(
				"{{#data}}" + $(config.seletorTemplateDir).html() + "{{/data}}",
				{"data":clone}
			);
			$("#" + config.idCatalogoNavegacao).html(t);

			$("#" + i3GEO.catalogoMetaestat.config.idCatalogoPrincipal).fadeOut( "fast", function(){
				$("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).show();
				$("#" + i3GEO.catalogoMetaestat.config.idCatalogoNavegacao).show();
			});

		};
		i3GEO.php.listaVariavel(lista);
	},
	listaMedidas: function(codigo_variavel, nome){
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoMetaestat.listaCamadas");

		i3GEO.catalogoMetaestat.MIGALHA.push({"nome": nome,"onclick":"i3GEO.catalogoMetaestat.listaMedidas(" + codigo_variavel + ",'" + nome + "')"});
		i3GEO.catalogoMetaestat.atualizaMigalha();

		i3GEO.catalogoMetaestat.aguarde();

		var monta = function(data){
			var clone = [],
				g = "",
				temas;

			//monta a lista com proximo nivel
			$.each( data, function( i,v ) {
				v.onclick = "i3GEO.catalogoMetaestat.adiciona(" + v.id_medida_variavel + ",'" + v.nomemedida + "')";
				v.nome = v.nomemedida;
				clone.push(v);
			});
			var t = Mustache.to_html(
					"{{#data}}" + $(i3GEO.catalogoMetaestat.config.seletorTemplateTema).html() + "{{/data}}",
					{"data":clone}
				);
			$("#" + i3GEO.catalogoMetaestat.config.idCatalogoNavegacao).html(t);
		};
		i3GEO.php.listaMedidaVariavel(codigo_variavel, monta);
	},
	adiciona : function(id_medida_variavel,nomemedida){
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.metaestat()",
			"metaestat", "metaestat", "index.js",
			"i3GEOF.metaestat.inicia('flutuanteSimples',''," + id_medida_variavel + ")"
		);
	}
};