if (typeof (i3GEOadmin) === 'undefined') {
	var i3GEOadmin = {};
}
i3GEOadmin.bdExplorer = {
		popOverTemplate: '<div class="popover" style="width:100%; color: black; background-color:white;" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
		templateListaPopOver: '<a href="javascript:void(0)" data-name="{{{destino}}}" data-value="{{{valor}}}" class="list-group-item">{{{valor}}}</a>',
		templateListaPopOver1: '<a href="javascript:void(0)" data-name="{{{destino}}}" data-value="{{{valor}}}" class="list-group-item">{{{chave}}}</a>',
		popOver: function(destino, conteudo){
			if($("#modalGeral input[name='" + destino + "']").length > 0 ){
				var onde = "#modalGeral input[name='" + destino + "']";
			} else {
				var onde = "input[name='" + destino + "']";
			}

			var pop = $(onde).popover({
				"content": conteudo,
				"placement": function(a){a.style.left = "0px";},
				"title": "",
				"template": i3GEOadmin.bdExplorer.popOverTemplate,
				"html": true,
				"animation": false
			});
			pop.popover('toggle');
			$(".popover").css("left","0px");
			$(".popover").css("top","45px")
			$(".popover").on('click', function (e) {
				if($("#modalGeral input[name='" + e.target.getAttribute('data-name') + "']").length > 0){
					$("#modalGeral input[name='" + e.target.getAttribute('data-name') + "']").val(e.target.getAttribute('data-value'));
				} else {
					$("input[name='" + e.target.getAttribute('data-name') + "']").val(e.target.getAttribute('data-value'));
				}
				$(".popover").popover("destroy");
			})
		},
		listaEsquemas: function(destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin/php/bdexplorer.php?funcao=listarEsquemas"
				)
				.done(
						function(data, status){
							var c = "", json = jQuery.parseJSON(data);
							c = Mustache.to_html(
									"{{#data}}" + i3GEOadmin.bdExplorer.templateListaPopOver  + "{{/data}}",
									{
										"data":json,
										"destino": destino,
										"valor": function() {
											return this;
										}
									}
							);
							i3GEOadmin.bdExplorer.popOver(destino,c);
						}
				)
				.fail(
						function(data){
							i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
						}
				);
			} else {
				$(".popover").popover("destroy");
			}
		},
		listaEsquemasUpload: function(destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin/php/bdexplorer.php?funcao=listarEsquemasUpload"
				)
				.done(
						function(data, status){
							var c = "", json = jQuery.parseJSON(data);
							c = Mustache.to_html(
									"{{#data}}" + i3GEOadmin.bdExplorer.templateListaPopOver  + "{{/data}}",
									{
										"data":json,
										"destino": destino,
										"valor": function() {
											return this;
										}
									}
							);
							i3GEOadmin.bdExplorer.popOver(destino,c);
						}
				)
				.fail(
						function(data){
							i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
						}
				);
			} else {
				$(".popover").popover("destroy");
			}
		},
		listaTabelas: function(codigo_estat_conexao,esquema,destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin/php/bdexplorer.php?funcao=listarTabelas",
						"esquema=" + esquema + "&codigo_estat_conexao=" + codigo_estat_conexao
				)
				.done(
						function(data, status){
							var c = "", json = jQuery.parseJSON(data);
							c = Mustache.to_html(
									"{{#data}}" + i3GEOadmin.bdExplorer.templateListaPopOver  + "{{/data}}",
									{
										"data":json,
										"destino": destino,
										"valor": function() {
											return this;
										}
									}
							);

							i3GEOadmin.bdExplorer.popOver(destino,c);
						}
				)
				.fail(
						function(data){
							i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
						}
				);
			} else {
				$(".popover").popover("destroy");
			}
		},
		listaTabelasUpload: function(esquema,destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin/php/bdexplorer.php?funcao=listarTabelasUpload",
						"esquema=" + esquema
				)
				.done(
						function(data, status){
							var c = "", json = jQuery.parseJSON(data);
							c = Mustache.to_html(
									"{{#data}}" + i3GEOadmin.bdExplorer.templateListaPopOver  + "{{/data}}",
									{
										"data":json,
										"destino": destino,
										"valor": function() {
											return this;
										}
									}
							);
							i3GEOadmin.bdExplorer.popOver(destino,c);
						}
				)
				.fail(
						function(data){
							i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
						}
				);
			} else {
				$(".popover").popover("destroy");
			}
		},
		listaColunas: function(codigo_estat_conexao,esquema,tabela,destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin/php/bdexplorer.php?funcao=listarColunas",
						"tabela=" + tabela + "&esquema=" + esquema + "&codigo_estat_conexao=" + codigo_estat_conexao
				)
				.done(
						function(data, status){
							var c = "", json = jQuery.parseJSON(data);
							c = Mustache.to_html(
									"{{#data}}" + i3GEOadmin.bdExplorer.templateListaPopOver  + "{{/data}}",
									{
										"data":json,
										"destino": destino,
										"valor": function() {
											return this;
										}
									}
							);
							i3GEOadmin.bdExplorer.popOver(destino,c);
						}
				)
				.fail(
						function(data){
							i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
						}
				);
			} else {
				$(".popover").popover("destroy");
			}
		},
		listaCodigosConexao: function(destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin/php/bdexplorer.php?funcao=listarCodigosConexao"
				)
				.done(
						function(data, status){
							var c = "", json = jQuery.parseJSON(data);
							c = Mustache.to_html(
									"{{#data}}" + i3GEOadmin.bdExplorer.templateListaPopOver1  + "{{/data}}",
									{
										"data":json,
										"destino": destino
									}
							);
							i3GEOadmin.bdExplorer.popOver(destino,c);
						}
				)
				.fail(
						function(data){
							i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
						}
				);
			} else {
				$(".popover").popover("destroy");
			}
		}
};