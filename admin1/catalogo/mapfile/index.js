/*
Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

 */
i3GEOadmin.mapfile = {
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		favoritosArray: [],
		init: function(onde){
			i3GEOadmin.mapfile.ondeLista = onde;
			i3GEOadmin.mapfile.lista();
			i3GEOadmin.mapfile.retornaFavoritosArray();
		},
		/*
Function: lista

Obt&eacute;m a lista
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
			$.post(
					"exec.php?funcao=lista"
			)
			.done(
					function(data, status){

						//valor do filtro atual
						var filtro = i3GEOadmin.core.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						var templateLista = $("#templateLista").html();
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.mapfile.dicionario,
										{
											"data": json
										}
								)
						);
						i3GEOadmin.mapfile.ondeLista.html(html);
						i3GEOadmin.mapfile.montaFavoritos();
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						$(".ui-autocomplete-input").attr( "title", "Filtro" );

						if(filtro != ""){
							i3GEOadmin.core.defineFiltro(filtro);
							i3GEOadmin.core.filtra(i3GEOadmin.mapfile.pegaFiltro());
						}

						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.mapfile.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaDialogo: function(){
			var html = Mustache.to_html(
					"{{#data}}" + $("#templateAdicionarTema").html() + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.mapfile.dicionario,
							{
								"data": "modal"
							}
					)
			);
			i3GEOadmin.core.abreModalGeral(html);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#form-modal-adiciona").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
						i3GEOadmin.mapfile.favoritosArray.push(json.codigo);
						i3GEOadmin.mapfile.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.mapfile.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapfile.excluir('"+id+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"codigo="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data);
						$("#form-" + json.codigo).remove();
						i3GEOadmin.mapfile.registraFavoritos(json.codigo);
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		retornaFavoritosArray: function(){
			var temp = i3GEO.util.pegaCookie("I3GEOfavoritosEditorMapfile");
			if(temp){
				i3GEOadmin.mapfile.favoritosArray = temp.split(",");
			}
			else{
				i3GEOadmin.mapfile.favoritosArray = [];
			}
			return i3GEOadmin.mapfile.favoritosArray;
		},
		registraFavoritos: function(codigoTema){
			i3GEOadmin.mapfile.favoritosArray.remove("NaN");
			if(i3GEO.util.in_array(codigoTema,i3GEOadmin.mapfile.favoritosArray)){
				i3GEOadmin.mapfile.favoritosArray.remove(codigoTema);
			} else {
				i3GEOadmin.mapfile.favoritosArray.push(codigoTema);
			}
			i3GEO.util.insereCookie("I3GEOfavoritosEditorMapfile", i3GEOadmin.mapfile.favoritosArray.toString(","));
			i3GEOadmin.mapfile.montaFavoritos();
		},
		montaFavoritos: function(){
			var mapfile, i, conteudo = [], n, codigo, h;
			n = i3GEOadmin.mapfile.favoritosArray.length;
			for (i=0; i<n; i++){
				codigo = i3GEOadmin.mapfile.favoritosArray[i];
				h = $("#form-" + codigo + " .panel-heading").html();
				if(h != undefined){
					mapfile = '<div class="panel panel-default">' + h;
					conteudo.push(mapfile);
					mapfile = '<div class="panel-body">' + $("#form-" + codigo + " .panel-body").html() + "</div></div>";
					conteudo.push(mapfile);
				}
			}
			$("#body-favoritos").html(conteudo.join("\n"));
		},
		limpaCacheDialogo: function(codigo){
			var hash = {
					"mensagem": i3GEOadmin.mapfile.dicionario.excluiCache,
					"onBotao1": "i3GEOadmin.mapfile.limpaCache('"+codigo+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		limpaCache: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=limpaCache",
					"codigo="+codigo
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		}
};