i3GEO.catalogoSistemas = {
	MIGALHA: [],
	DADOS: "",
	config: {
		'seletorTemplateDir': '#guia2objTemplateDir',
		'seletorTemplateTema': '#guia2objTemplateTema',
		'idCatalogoPrincipal': 'catalogoPrincipal',
		'idCatalogoNavegacao': 'catalogoNavegacao',
		'idOndeMigalha': 'catalogoMigalha'
	},
	aguarde: function(){
		$("#" + i3GEO.catalogoSistemas.config.idCatalogoNavegacao).html($trad("o1"));
	},
	atualizaMigalha: function(){
		var migalha = i3GEO.catalogoSistemas.MIGALHA;
		var n = migalha.length;

		var nome = migalha[n - 1].nome;
		var onclick = migalha[n - 2].onclick;

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoSistemas.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":nome,"onclick":"i3GEO.catalogoSistemas.MIGALHA.pop();i3GEO.catalogoSistemas.MIGALHA.pop();" + onclick}
			);

		$("#" + i3GEO.catalogoSistemas.config.idOndeMigalha).html(t);
		$("#i3GEOguiaMovelConteudo").scrollTop(0);
	},
	escondeCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoSistemas.config.idCatalogoPrincipal).hide();
	},
	mostraCatalogoPrincipal: function(){
		$("#" + i3GEO.catalogoSistemas.config.idCatalogoNavegacao).fadeOut( "fast", function(){
			$("#" + i3GEO.catalogoSistemas.config.idOndeMigalha).hide();
			$("#" + i3GEO.catalogoSistemas.config.idCatalogoPrincipal).show();
		});
	},
	adicionaTema : function(tid) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoSistemas.adicionaTema");

		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, true);
		} else {
			i3GEO.arvoreDeTemas.adicionaTemas([ tid ]);
		}
	},
	inicia: function(config){
		i3GEO.catalogoSistemas.MIGALHA = [
		{"nome":"","onclick":"i3GEO.catalogoSistemas.mostraCatalogoPrincipal()"},
		{"nome":$trad("a11"),"onclick":"i3GEO.catalogoSistemas.inicia()"}
		];
		i3GEO.catalogoSistemas.atualizaMigalha();

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.catalogoSistemas.config[i] = v;
			});
		}
		config = i3GEO.catalogoSistemas.config;

		i3GEO.catalogoSistemas.escondeCatalogoPrincipal();

		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoSistemas.inicia");

		var t = Mustache.to_html(
				$($("#" + i3GEO.catalogoSistemas.config.idOndeMigalha).attr("data-template")).html(),
				{"nome":$trad("x57"),"onclick":"i3GEO.catalogoSistemas.mostraCatalogoPrincipal()"}
			);

		i3GEO.catalogoSistemas.aguarde();
		i3GEO.catalogoSistemas.config = config;
		var lista = function(dados){
			var clone = [],
				t;
			i3GEO.catalogoSistemas.DADOS = dados;
			$.each( dados.data, function( i,v ) {
				v.onclick = "i3GEO.catalogoSistemas.listaFuncoes(" + i + ",'" + v.NOME + "')";
				v.nome = v.NOME;
				if(v.PUBLICADO.toLowerCase() != "nao"){
					v.nome = v.nome + " <small>(" + $trad("naoPublicado") + ")<small>";
				}
				if(i3GEO.configura.optUsuarioLogado == true || v.PUBLICADO.toLowerCase() != "nao"){
					clone.push(v);
				}
			});
			t = Mustache.to_html(
				"{{#data}}" + $(config.seletorTemplateDir).html() + "{{/data}}",
				{"data":clone}
			);
			$("#" + config.idCatalogoNavegacao).html(t);

			$("#" + i3GEO.catalogoSistemas.config.idCatalogoPrincipal).fadeOut( "fast", function(){
				$("#" + i3GEO.catalogoSistemas.config.idOndeMigalha).show();
				$("#" + i3GEO.catalogoSistemas.config.idCatalogoNavegacao).show();
			});
		};
		i3GEO.php.pegaSistemas(lista);
	},
	listaFuncoes: function(id, nome){
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.catalogoSistemas.listaCamadas");

		i3GEO.catalogoSistemas.MIGALHA.push({"nome": nome,"onclick":"i3GEO.catalogoSistemas.listaFuncoes(" + id + ",'" + nome + "')"});
		i3GEO.catalogoSistemas.atualizaMigalha();

		var clone = [],
			g = "",
			temas;

		//monta a lista com proximo nivel
		$.each( i3GEO.catalogoSistemas.DADOS.data[id].FUNCOES, function( i,v ) {
			v.onclick = "i3GEO.catalogoSistemas.adiciona('" + v.W + "px','" + v.H + "px','" + v.ABRIR + "')";
			v.nome = v.NOME;
			clone.push(v);
		});
		var t = Mustache.to_html(
				"{{#data}}" + $(i3GEO.catalogoSistemas.config.seletorTemplateTema).html() + "{{/data}}",
				{"data":clone}
			);
		$("#" + i3GEO.catalogoSistemas.config.idCatalogoNavegacao).html(t);

	},
	adiciona : function(w,h,f){
		i3GEO.janela.cria(w,h,f,'','',$trad("a11"));
	}
};