if (typeof (i3GEOadmin) === 'undefined') {
	var i3GEOadmin = {};
}
i3GEOadmin.bdExplorer = {
		popOverTemplate: '<div class="popover" style="width:100%; color: black; background-color:white;" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
		templateListaPopOver: '<a href="javascript:void(0)" data-name="{{{destino}}}" data-value="{{{valor}}}" class="list-group-item">{{{valor}}}</a>',
		popOver: function(destino, conteudo){
			var pop = $("#modalGeral input[name='" + destino + "']").popover({
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
				$("#modalGeral input[name='" + e.target.getAttribute('data-name') + "']").val(e.target.getAttribute('data-value'));
				$(".popover").popover("destroy");
			})
		},
		listaEsquemas: function(destino){
			if($(".popover").length == 0){
				$.post(
						i3GEO.configura.locaplic + "/admin1/php/bdexplorer.php?funcao=listarEsquemas"
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
		}
};