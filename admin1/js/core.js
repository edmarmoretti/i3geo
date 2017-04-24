//veja tambem aplicmap black_editor.php
/*
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Par&acirc;metros:

id - id do objeto

Retorno:

object - objeto javaScript
 */
$i = function(id)
{return document.getElementById(id);};
/*
Variable: $mapfiles

Armazena o objeto com a lista de mapfiles
 */
$mapfiles = "";
/*
Variable: $tags

Armazena o objeto com a lista de tags
 */
$tags = "";
/*
Variable: $perfis

Armazena o objeto com a lista de perfis
 */
$perfis = "";

//funcoes jquery + bootstrap
if (typeof (i3GEOadmin) === 'undefined') {
	var i3GEOadmin = {};
}
if(typeof jQuery != 'undefined' ){
	i3GEOadmin.core = {
			//valor do filtro utilizado ao iniciar a pagina
			//usado para enviar parametros pela URL ao iniciar uma pagina
			initFiltro: "",
			defineSelecionados: function(idForm,hash){
				$("#"+idForm + " select").each(
					function(i){
						$(this).val(hash[$(this).attr("name")]);
					}
				);
			},
			erroLogin: function(){
				$("#loginOff").css("display","");
				$("#loginOn").css("display","none");
				alert("Login!");
			},
			loginOn: function(){
				$("#loginOff").css("display","none");
				$("#loginOn").css("display","");
			},
			mostraErro: function(erro){
				var html = '<div class="alert alert-danger alert-dismissible" role="alert">'
					+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					+ '<strong>Erro!</strong> '
					+ erro;
				$(".navbar-fixed-bottom .container").html(html);
			},
			fechaModal: function(id){
				$("#"+id).modal("hide");
			},
			abreModal: function(id,conteudo){
				$("#"+id+" .modal-body").html(conteudo);
				if($("#"+id).css("display") == "none"){
					$("#"+id).modal("show");

					$.material.init();
				}
			},
			fechaModalGeral: function(){
				i3GEOadmin.core.fechaModal("modalGeral");
			},
			abreModalGeral: function(conteudo){
				i3GEOadmin.core.abreModal("modalGeral",conteudo);
				$("#body-form-modal").collapse('show');
			},
			fechaModalConfirma: function(){
				i3GEOadmin.core.fechaModal("modalGeral");
			},
			abreModalConfirma: function(hash){
				var conteudo = Mustache.to_html(
						$("#modalConfirmaTpl").html(),
						hash
				);
				i3GEOadmin.core.abreModal("modalGeral",conteudo);
			},
			modalAguarde: function(open){
				if(open === true){
					i3GEOadmin.core.abreModalGeral($("#iconeAguardeTpl").html());
				}
				else{
					i3GEOadmin.core.fechaModalGeral();
				}
			},
			iconeAguarde: function(onde){
				if(onde.html){
					onde.html($("#iconeAguardeTpl").html());
				}
				else{
					$("#"+onde).html($("#iconeAguardeTpl").html());
				}
			},
			pegaFiltro: function(){
				return $i("filtro");
			},
			valorFiltro: function(){
				var v = "";
				//verifica se o valor do filtro foi passado pela url
				if(i3GEOadmin.core.initFiltro != ""){
					v = i3GEOadmin.core.initFiltro;
					i3GEOadmin.core.initFiltro = "";
				}
				else{
					v = i3GEOadmin.core.pegaFiltro().value;
				}
				return v;
			},
			defineFiltro: function(valor){
				i3GEOadmin.core.pegaFiltro().value = valor;
			},
			filtra: function(obj){
				$("#corpo .panel").each(
						function(i,el){
							if(obj.value == ""){
								$(el).show();
								$("#body-"+el.id).collapse('hide');
							}
							else {
								$(el).hide();
							}
						}
				);
				$("#corpo .list-group-item").each(
						function(i,el){
							if(obj.value == ""){
								$(el).show();
							}
							else {
								$(el).hide();
							}
						}
				);
				if(obj.value != ""){
					$("#"+obj.value).show();
					$("#body-"+obj.value).collapse('show');
				}
			}
	};
	function core_parseMustacheBody (hashMustache){
		var re = new RegExp("&amp;", "g"), m;
		m = Mustache.render(document.body.innerHTML, i3GEO.idioma.objetoIdioma(hashMustache));
		m = m.replace(re, '&');
		document.body.innerHTML = m;
	}
	//autocomlete
	(function( $ ) {
		$.widget( "custom.combobox", $.ui.autocomplete, {

			_create: function() {
				this.wrapper = $( "<span>" )
				.addClass( "custom-combobox" )
				.insertAfter( this.element );

				this.element.hide();
				this._createAutocomplete();
				this._createShowAllButton();
			},

			_createAutocomplete: function() {
				var selected = this.element.children( ":selected" ),
				value = selected.val() ? selected.text() : "";
				//console.info(this.element.context);
				this.input = $( "<input>" )
				.appendTo( this.wrapper )
				.val( value )
				.attr( "title", "" )
				.addClass( "form-control" )
				.autocomplete({
					delay: 0,
					minLength: 0,
					source: $.proxy( this, "_source" ),
					select: function( event, ui ) {
						ui.item.el.context.value = ui.item.option.value;
						ui.item.el.context.onchange.call(ui.item.el.context);
					}
				});

				this._on( this.input, {
					autocompleteselect: function( event, ui ) {
						ui.item.option.selected = true;
						this._trigger( "select", event, {
							item: ui.item.option
						});
					},
					autocompletechange: "_removeIfInvalid"
				});
			},

			_createShowAllButton: function() {
				var input = this.input,
				wasOpen = false;
				$( "<span>" )
				.attr( "tabIndex", -1 )
				.appendTo( this.wrapper )
				.removeClass( "ui-corner-all" )
				.addClass( "glyphicon glyphicon-search" )
				.mousedown(function() {
					wasOpen = input.autocomplete( "widget" ).is( ":visible" );
				})
				.click(function() {
					input.focus();
					// Close if already visible
					if ( wasOpen ) {
						return;
					}
					// Pass empty string as value to search for, displaying all results
					input.autocomplete( "search", "" );
				});
			},
			_source: function( request, response ) {
				var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
				var el = this.element;
				response( this.element.children( "option" ).map(function() {
					var text = $( this ).text();
					if ( ( !request.term || matcher.test(text) ) )
						return {
							label: text,
							value: text,
							option: this,
							el: el
						};
					}
				) );
			},

			_removeIfInvalid: function( event, ui ) {
				// Selected an item, nothing to do
				if ( ui.item ) {
					return;
				}
				// Search for a match (case-insensitive)
				var value = this.input.val(),
				valueLowerCase = value.toLowerCase(),
				valid = false;
				this.element.children( "option" ).each(function() {
					if ( $( this ).text().toLowerCase() === valueLowerCase ) {
						this.selected = valid = true;
						return false;
					}
				});
				// Found a match, nothing to do
				if ( valid ) {
					return;
				}
				// Remove invalid value
				this.input.val( "" );
				this.element.val( "" );
				this.input.autocomplete( "instance" ).term = "";
			},
			_destroy: function() {
				this.wrapper.remove();
				this.element.show();
			}
		});
	})( jQuery );
}