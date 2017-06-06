i3GEO.catalogoDir = {
	MIGALHA: [],
	config: {
		'seletorTemplateDir': '#guia2objTemplateDir',
		'seletorTemplateTema': '#guia2objTemplateTema',
		'idCatalogoPrincipal': 'catalogoPrincipal',
		'idCatalogoNavegacao': 'catalogoNavegacao',
		'idOndeMigalha': 'catalogoMigalha'
	},
	aguarde: function(){
		$("#" + i3GEO.catalogoDir.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
		var migalha = i3GEO.catalogoDir.MIGALHA;
		var n = migalha.length;

		var nome = migalha[n - 1].nome;
		var onclick = migalha[n - 2].onclick;

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoDir.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":nome,"onclick":"i3GEO.catalogoDir.MIGALHA.pop();i3GEO.catalogoDir.MIGALHA.pop();" + onclick}
			);

		$("#" + i3GEO.catalogoDir.config.idOndeMigalha).html(t);
		$("#i3GEOguiaMovelConteudo").scrollTop(0);
	},
	escondeCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoDir.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoDir.config.idCatalogoNavegacao).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoDir.config.idOndeMigalha).hide();
			$("#" + i3GEO.catalogoDir.config.idCatalogoPrincipal).show();
		});
	},
	adicionaTema : function(tid) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoDir.adicionaTema");

		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, true);
		} else {
			i3GEO.arvoreDeTemas.adicionaTemas([ tid ]);
		}
	},
	inicia: function(config){
		i3GEO.catalogoDir.MIGALHA = [
		{"nome":"","onclick":"i3GEO.catalogoDir.mostraCatalogoPrincipal()"},
		{"nome":$trad("a6"),"onclick":"i3GEO.catalogoDir.inicia()"}
		];
		i3GEO.catalogoDir.atualizaMigalha();

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.catalogoDir.config[i] = v;
			});
		}
		config = i3GEO.catalogoDir.config;

		i3GEO.catalogoDir.escondeCatalogoPrincipal();

		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoDir.inicia");

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoDir.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":$trad("a6"),"onclick":"i3GEO.catalogoDir.mostraCatalogoPrincipal()"}
			);

		i3GEO.catalogoDir.aguarde();
		i3GEO.catalogoDir.config = config;
		var lista = function(retorno){
			var dados = retorno.data,
				clone = [],
				t;

			//ajusta o nome
			//verifica se o menu esta na lista de ids definidos em i3GEO.catalogoDir.IDSMENUS
			$.each( dados, function( i,v ) {
				clone.push({"nome":v,"descricao":"","onclick": "i3GEO.catalogoDir.listaDir('" + v +  "','" + v + "/')"});
			});
			t = Mustache.to_html(
				"{{#data}}" + $(config.seletorTemplateDir).html() + "{{/data}}",
				{"data":clone}
			);
			$("#" + config.idCatalogoNavegacao).html(t);

			$("#" + i3GEO.catalogoDir.config.idCatalogoPrincipal).fadeOut( "fast", function(){
				$("#" + i3GEO.catalogoDir.config.idOndeMigalha).show();
				$("#" + i3GEO.catalogoDir.config.idCatalogoNavegacao).show();
			});
		};
		i3GEO.php.listadrives(lista);
	},
	listaDir: function(nome,path){
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoDir.listaCamadas");

		i3GEO.catalogoDir.MIGALHA.push({"nome": nome,"onclick":"i3GEO.catalogoDir.listaDir('" + nome + "','" + path + "')"});
		i3GEO.catalogoDir.atualizaMigalha();

		i3GEO.catalogoDir.aguarde();

		var monta = function(dados){
			var data = dados.data,
				clone = [],
				g = "",
				t = "",
				temas;

			$.each( data.diretorios, function( i,v ) {
				clone.push({
					"nome": v,
					"onclick": "i3GEO.catalogoDir.listaDir('" + v +  "','" + data.path + "/" + v + "')",
				});
			});
			if(clone.length > 0){
				g = Mustache.to_html(
					"{{#data}}" + $(i3GEO.catalogoDir.config.seletorTemplateDir).html() + "{{/data}}",
					{"data":clone}
				);
			}
			clone = [];
			$.each( data.arquivos, function( i,v ) {
				clone.push({
					"nome": v,
					"onclick": "i3GEO.catalogoDir.adiciona('" + data.path + "/" + v + "')",
				});
			});
			if(clone.length > 0){
				t = Mustache.to_html(
					"{{#data}}" + $(i3GEO.catalogoDir.config.seletorTemplateTema).html() + "{{/data}}",
					{"data":clone}
				);
			}
			$("#" + i3GEO.catalogoDir.config.idCatalogoNavegacao).html(t+g);
		};
		i3GEO.php.listaarquivos(monta, path);
	},
	adiciona: function(path){
		i3GEO.util.adicionaSHP(path);
	}
};