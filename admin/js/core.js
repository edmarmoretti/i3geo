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
				//alert("Login!");
				i3GEOadmin.core.mostraErro($trad("erroLogin",i3GEOadmin.principal.dicionario));
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
					//$.material.init();
				}
				$.material.init();
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
				//modalConfirmaTpl fica em head.php
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
/**
Function: core_montaEditor

Monta uma janela flutuante com um formul&aacute;rio.

O editor possui um div com id=editor_bd que deve ser usado para incluir o formul&aacute;rio.

Parameters:

funcaoOK - string com o nome da fun&ccedil;&atilde;o que ser&aacute; executada quando o bot&atilde;o OK for pressionado.

funcaoClose - nome da funcao que ser&aacute; executada quando a janela for fechada. Pode ser "" para escapar.

titulo - titulo da janela

modal - boolean

bsalva - boolean botao salvar

bcancela - boolean botao cancelar
*/
function core_montaEditor(funcaoOK,w,h,funcaoClose,titulo,modal,bsalva,bcancela)
{
	if(!funcaoOK){
		funcaoOK = "";
	}
	if(!w){
		w = "400px";
	}
	if(!h){
		h = "354px";
	}
	if(modal == undefined){
		modal = false;
	}
	if(bsalva == undefined){
		bsalva = true;
	}
	if(bcancela  == undefined){
		bcancela = true;
	}
	if(!titulo){
		titulo = "Editor";
	}
	if(!funcaoClose){
		funcaoClose = "";
	}
	if(!$i("janela_editor"))
	{
		var ins = "", temp = "", lb,
			salvai = "<input id=okcancel_checkboxOK type='buttom' value='Salva' />",
			cancelai = "<input id=okcancel_checkboxCANCEL type='buttom' value='Cancela' />",
			novoel = document.createElement("div");
		novoel.id =  "janela_editor";
		ins = '<div class="hd"><div id="okcancel_checkbox" ></div></div>' +
			"<div class='bd' style='height:"+h+";overflow:auto'>" +
			"<div id='editor_bd'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		if(funcaoOK != "")
		{
			lb = $i("okcancel_checkbox");
			if(bsalva === true){
				temp += salvai;
			}
			if(bcancela === true){
				temp += cancelai;
			}
			lb.innerHTML = temp + '<span style="margin-left:10px;position:relative;top:-5px">'+titulo+'</span>';
			if(bsalva === true){
				new YAHOO.widget.Button(
					"okcancel_checkboxOK",
					{onclick:{fn: function(){
						if(YAHOO.lang.isFunction(funcaoOK)){
							funcaoOK.call();
						}
						else{
							eval(funcaoOK);
						}
					}}}
				);
				var temp = $i("okcancel_checkbox");
				temp.style.top = "2px";
				temp.style.position = "relative";
				var temp = $i("okcancel_checkboxOK-button");
				temp.style.height = "23px";
			}
			if(bcancela === true){
				new YAHOO.widget.Button(
					"okcancel_checkboxCANCEL",
					{onclick:{fn: function(){
						YAHOO.admin.container.panelEditor.destroy();
						YAHOO.admin.container.panelEditor = null;
					}}}
				);
			}
		}
		YAHOO.admin.container.panelEditor = new YAHOO.widget.Panel(
		        "janela_editor",
		        {
		            fixedcenter:"contained",
		            close:true,
		            width:w,
		            overflow:"auto",
		            modal: modal,
		            visible:false,
		            constraintoviewport:true,
		            strings: {close: "<span class='material-icons'>cancel</span>"}
		            }
		        );
		YAHOO.admin.container.panelEditor.render();
	}
	else
	{
		if($i("editor_bd"))
		{$i("editor_bd").innerHTML == "?";}
	}
	var fecha = function()
	{
		try{
			YAHOO.admin.container.panelEditor.destroy();
			YAHOO.admin.container.panelEditor = null;
		}
		catch(e){}
		try{
			if(YAHOO.lang.isFunction(funcaoClose)){
				funcaoClose.call();
			}
			else if(funcaoClose != ""){
				eval(funcaoClose+"()");
			}
		}
		catch(e){};
	};
	YAHOO.util.Event.addListener(YAHOO.admin.container.panelEditor.close, "click", fecha);
	YAHOO.admin.container.panelEditor.show();
	//registra a janela no gerenciador de janelas default da classe i3GEO.janela caso ela exista
	try{
		YAHOO.i3GEO.janela.manager.register(YAHOO.admin.container.panelEditor);
	}
	catch(e){}
}
/*
Function: core_pegaDados

Busca dados no servidor via Ajax e executa uma fun&ccedil;&atilde;o de retorno com os daods

Parameters:

mensagem - mensagem que ser&aacute; mostrada na tela

sUrl - url do programa que ser&aacute; executado no servidor

funcaoRetorno - funcao que ser&aacute; executada ao terminar a busca pelos dados
*/
function core_pegaDados(mensagem,sUrl,funcaoRetorno)
{
	var callback =
	{
			success:function(o)
			{
				if(funcaoRetorno != ""){
					if(YAHOO.lang.isFunction(funcaoRetorno)){
						funcaoRetorno.call("",YAHOO.lang.JSON.parse(o.responseText));
					}
					else{
						eval(funcaoRetorno+"(YAHOO.lang.JSON.parse(o.responseText))");
					}
				}
			},
			argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
/*
Function: core_makeRequest

Executa uma chamada em ajax.

Parameters:

sUrl - url que ser&aacute; executada

callback - fun&ccedil;&atilde;o que processar&aacute; o retorno

tipo - GET ou POST

postpar - parametros quando o tipo for post
*/
function core_makeRequest(sUrl,callback,tipo,postpar)
{
	sUrl = escape(sUrl);
	re = new RegExp("%3F", "g");
	sUrl = sUrl.replace(re,'?');
	re = new RegExp("%3D", "g");
	sUrl = sUrl.replace(re,'=');
	re = new RegExp("%26", "g");
	sUrl = sUrl.replace(re,'&');

	re = new RegExp("%3A", "g");
	sUrl = sUrl.replace(re,':');

	if(arguments.length == 2)
	{tipo = "GET";}
	if(postpar){
		//YAHOO.util.Connect.setDefaultPostHeader('application/json;charset=ISO-8859-1');
		YAHOO.util.Connect.asyncRequest('POST', sUrl, callback, postpar);
	}
	else{
		YAHOO.util.Connect.asyncRequest(tipo, sUrl, callback);
	}
}