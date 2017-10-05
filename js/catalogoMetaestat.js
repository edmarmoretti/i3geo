i3GEO.catalogoMetaestat = {
	WMS: "",
	MIGALHA: [],
	config: {
		'templateDir': 'templates/dir.html',
		'templateTema': 'templates/tema.html',
		'idCatalogoPrincipal': 'catalogoPrincipal',
		'idCatalogoNavegacao': 'catalogoNavegacao',
		'idOndeMigalha': 'catalogoMigalha'
	},
	carregaTemplates: function(){
		var t1 = i3GEO.catalogoMetaestat.config.templateDir,
			t2 = i3GEO.catalogoMetaestat.config.templateTema,
			t3 = $("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).attr("data-template");
		$.when( $.get(t1),$.get(t2),$.get(t3) ).done(function(r1,r2,r3) {
			i3GEO.template.dir = r1[0];
			i3GEO.template.tema = r2[0];
			i3GEO.template.catalogoMigalha = r3[0];
			i3GEO.catalogoMetaestat.inicia();
		}).fail(function() {
		    i3GEO.janela.closeMsg($trad("erroTpl"));
		    return;
		});
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
				i3GEO.template.catalogoMigalha,
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
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoMetaestat.inicia");

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.catalogoMetaestat.config[i] = v;
			});
		}
		i3GEO.catalogoMetaestat.aguarde();
		if(!i3GEO.template.dir || !i3GEO.template.tema || !i3GEO.template.catalogoMigalha){
			i3GEO.catalogoMetaestat.carregaTemplates();
			return;
		} else {
			i3GEO.catalogoMetaestat.MIGALHA = [
			{"nome":"","onclick":"i3GEO.catalogoMetaestat.mostraCatalogoPrincipal()"},
			{"nome":$trad("x57"),"onclick":"i3GEO.catalogoMetaestat.inicia()"}
			];
			i3GEO.catalogoMetaestat.atualizaMigalha();

			config = i3GEO.catalogoMetaestat.config;

			i3GEO.catalogoMetaestat.escondeCatalogoPrincipal();

			var t = Mustache.to_html(
					i3GEO.template.catalogoMigalha,
					{"nome":$trad("x57"),"onclick":"i3GEO.catalogoMetaestat.mostraCatalogoPrincipal()"}
				);

			var lista = function(dados){
				var clone = [],
					t;

				$.each( dados, function( i,v ) {
					v.onclick = "i3GEO.catalogoMetaestat.listaMedidas(" + v.codigo_variavel + ",'" + v.nome + "')";
					clone.push(v);
				});
				t = Mustache.to_html(
					"{{#data}}" + i3GEO.template.dir + "{{/data}}",
					{"data":clone}
				);
				$("#" + config.idCatalogoNavegacao).html(t);

				$("#" + i3GEO.catalogoMetaestat.config.idCatalogoPrincipal).fadeOut( "fast", function(){
					$("#" + i3GEO.catalogoMetaestat.config.idOndeMigalha).show();
					$("#" + i3GEO.catalogoMetaestat.config.idCatalogoNavegacao).show();
				});

			};
			i3GEO.php.listaVariavel(lista);
		}
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
					"{{#data}}" + i3GEO.template.tema + "{{/data}}",
					{"data":clone}
				);
			$("#" + i3GEO.catalogoMetaestat.config.idCatalogoNavegacao).html(t);
		};
		i3GEO.php.listaMedidaVariavel(codigo_variavel, monta);
	},
	adiciona : function(id_medida_variavel,nomemedida){
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.metaestat()",
			"metaestat",
			"metaestat",
			"dependencias.php",
			"i3GEOF.metaestat.inicia('flutuanteSimples',''," + id_medida_variavel + ",'" + nomemedida + "')"
		);
	}
};