i3GEO.catalogoRegioes = {
	config: {
		'seletorTemplateDir': '#guia2objTemplateDir',
		'seletorTemplateTema': '#guia2objTemplateTema',
		'idCatalogoPrincipal': 'catalogoPrincipal',
		'idCatalogoNavegacao': 'catalogoNavegacao',
		'idOndeMigalha': 'catalogoMigalha'
	},
	DADOS: "",
	aguarde: function(){
		$("#" + i3GEO.catalogoRegioes.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
		var migalha = i3GEO.catalogoRegioes.MIGALHA;
		var n = migalha.length;

		var nome = migalha[n - 1].nome;
		var onclick = migalha[n - 2].onclick;

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoRegioes.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":nome,"onclick":"i3GEO.catalogoRegioes.MIGALHA.pop();i3GEO.catalogoRegioes.MIGALHA.pop();" + onclick}
			);
		$("#" + i3GEO.catalogoRegioes.config.idOndeMigalha).html(t);
		$("#i3GEOguiaMovelConteudo").scrollTop(0);

	},
	escondeCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoRegioes.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoRegioes.config.idCatalogoNavegacao).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoRegioes.config.idOndeMigalha).hide();
			$("#" + i3GEO.catalogoRegioes.config.idCatalogoPrincipal).show();
		});
		i3GEO.catalogoRegioes.DADOS = "";
	},
	adicionaTema : function(tid) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoRegioes.adicionaTema");

		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, true);
		} else {
			var layer = i3GEO.catalogoRegioes.DADOS.layers[tid][1];

			i3GEO.php.adicionaTemaWMS(
					'',
					layer.url,
					layer.layers,
					i3GEO.catalogoRegioes.DADOS.layers[tid][0],
					'EPSG:4326',
					layer.format,
					'1.1.1',
					i3GEO.catalogoRegioes.DADOS.layers[tid][0],
					'',
					'nao',
					"text/plain",
					'',
					'',
					true
			);
		}
	},
	inicia: function(config){
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoRegioes.inicia");

		i3GEO.catalogoRegioes.DADOS = "";

		i3GEO.catalogoRegioes.MIGALHA = [
		{"nome":"","onclick":"i3GEO.catalogoRegioes.mostraCatalogoPrincipal()"},
		{"nome":$trad("x87"),"onclick":"i3GEO.catalogoRegioes.inicia()"}
		];
		i3GEO.catalogoRegioes.atualizaMigalha();

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.catalogoRegioes.config[i] = v;
			});
		}
		config = i3GEO.catalogoRegioes.config;

		i3GEO.catalogoRegioes.escondeCatalogoPrincipal();
		i3GEO.catalogoRegioes.aguarde();
		$("#" + i3GEO.catalogoRegioes.config.idCatalogoNavegacao).show();

		var lista = function(dados){
			var clone = [],
				t;

			$.each( dados, function( i,v ) {
				clone.push({
					"nome": v.nome_tipo_regiao,
					"descricao": v.descricao_tipo_regiao,
					"onclick": "i3GEO.catalogoRegioes.adiciona(" + v.codigo_tipo_regiao + ")"
				});
			});
			t = Mustache.to_html(
				"{{#data}}" + $(config.seletorTemplateTema).html() + "{{/data}}",
				{"data":clone}
			);
			$("#" + config.idCatalogoNavegacao).html(t);

			$("#" + i3GEO.catalogoRegioes.config.idCatalogoPrincipal).fadeOut( "fast", function(){
				$("#" + i3GEO.catalogoRegioes.config.idOndeMigalha).show();
				$("#" + i3GEO.catalogoRegioes.config.idCatalogoNavegacao).show();
			});
		};
		i3GEO.php.listaTipoRegiao(lista);
	},
	adiciona: function(codigo_tipo_regiao){
		var p = i3GEO.configura.locaplic
			+ "/ferramentas/metaestat/analise.php?funcao=adicionaLimiteRegiao"
			+ "&codigo_tipo_regiao="
			+ codigo_tipo_regiao
			+ "&g_sid="
			+ i3GEO.configura.sid;
		var funcao = function() {
			i3GEO.atualiza();
		};
		cpJSON.call(p, "foo", funcao);
	}
};