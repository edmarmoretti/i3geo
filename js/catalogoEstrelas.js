i3GEO.catalogoEstrelas = {
	MIGALHA: [],
	config: {
		'seletorTemplateDir': '#guia2objTemplateDir',
		'seletorTemplateTema': '#guia2objTemplateTema',
		'idCatalogoPrincipal': 'catalogoPrincipal',
		'idCatalogoNavegacao': 'catalogoNavegacao',
		'idOndeMigalha': 'catalogoMigalha',
		'valorEstrela': 5,
		'numEstrelas' : 3
	},
	aguarde: function(){
		$("#" + i3GEO.catalogoEstrelas.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
		var migalha = i3GEO.catalogoEstrelas.MIGALHA;
		var n = migalha.length;

		var nome = migalha[n - 1].nome;
		var onclick = migalha[n - 2].onclick;

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoEstrelas.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":nome,"onclick":"i3GEO.catalogoEstrelas.MIGALHA.pop();i3GEO.catalogoEstrelas.MIGALHA.pop();" + onclick}
			);

		$("#" + i3GEO.catalogoEstrelas.config.idOndeMigalha).html(t);
		$("#i3GEOguiaMovelConteudo").scrollTop(0);
	},
	escondeCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoEstrelas.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoEstrelas.config.idCatalogoNavegacao).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoEstrelas.config.idOndeMigalha).hide();
			$("#" + i3GEO.catalogoEstrelas.config.idCatalogoPrincipal).show();
		});
	},
	adicionaTema : function(tid) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoEstrelas.adicionaTema");

		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, true);
		} else {
			i3GEO.arvoreDeTemas.adicionaTemas([ tid ]);
		}
	},
	inicia: function(config){
		i3GEO.catalogoEstrelas.MIGALHA = [
		{"nome":"","onclick":"i3GEO.catalogoEstrelas.mostraCatalogoPrincipal()"},
		{"nome":$trad("t46"),"onclick":"i3GEO.catalogoEstrelas.inicia()"}
		];
		i3GEO.catalogoEstrelas.atualizaMigalha();

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.catalogoEstrelas.config[i] = v;
			});
		}
		config = i3GEO.catalogoEstrelas.config;

		i3GEO.catalogoEstrelas.escondeCatalogoPrincipal();

		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoEstrelas.inicia");

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoEstrelas.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":$trad("x57"),"onclick":"i3GEO.catalogoEstrelas.mostraCatalogoPrincipal()"}
			);

		i3GEO.catalogoEstrelas.aguarde();

		var dados= [],
			estrela = '<span class="material-icons">star</span>',
			estrelas = [],
			t,i;

		for(i=config.numEstrelas;i<6;i++){
			estrelas = [];
			for (var n = 0; n < i; n++){
				estrelas.push(estrela);
			}
			dados.push({
				"nome": estrelas.join(""),
				"onclick": "i3GEO.catalogoEstrelas.listaCamadas(" + i + ")"
			});
		}
		t = Mustache.to_html(
			"{{#data}}" + $(config.seletorTemplateDir).html() + "{{/data}}",
			{"data":dados}
		);
		$("#" + config.idCatalogoNavegacao).html(t);

		$("#" + i3GEO.catalogoEstrelas.config.idCatalogoPrincipal).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoEstrelas.config.idOndeMigalha).show();
			$("#" + i3GEO.catalogoEstrelas.config.idCatalogoNavegacao).show();
		});
	},
	listaCamadas: function(numEstrelas){
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoEstrelas.listaCamadas");

		i3GEO.catalogoEstrelas.MIGALHA.push({"nome": numEstrelas,"onclick":"i3GEO.catalogoEstrelas.listaCamadas(" + numEstrelas + ")"});
		i3GEO.catalogoEstrelas.atualizaMigalha();

		i3GEO.catalogoEstrelas.aguarde();

		var lista = function(dados){
			//pega os registros
			data = dados.data;
			var clone = [];
			$.each( data, function( i,v ) {
				var temas,subgrupos;
				temas = v.temas;
				$.each( temas, function( i,v ) {
					clone.push({
						"nome":v.nome,
						"descricao":"",
						"link":"",
						"onclick":"i3GEO.catalogoEstrelas.adiciona('" + v.codigo_tema + "');"
					});
				});
				subgrupos = v.subgrupos;
				$.each( subgrupos, function( i,v ) {
					var temas = v.temas;
					$.each( temas, function( i,v ) {
						clone.push({
							"nome":v.nome,
							"descricao":"",
							"link":"",
							"onclick":"i3GEO.catalogoEstrelas.adiciona('" + v.codigo_tema + "');"
						});
					});
				});
			});
			var t = Mustache.to_html(
					"{{#data}}" + $(i3GEO.catalogoEstrelas.config.seletorTemplateTema).html() + "{{/data}}",
					{"data":clone}
				);
			$("#" + i3GEO.catalogoEstrelas.config.idCatalogoNavegacao).html(t);
		};
		i3GEO.php.procurartemasestrela(lista,numEstrelas * 1,i3GEO.catalogoEstrelas.config.valorEstrela * 1);
	},
	adiciona : function(tid){
		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, true);
		} else {
			i3GEO.php.adtema(i3GEO.atualiza, tid);
		}
	}
};