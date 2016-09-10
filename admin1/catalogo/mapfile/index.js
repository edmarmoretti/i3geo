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
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//combo com temas
						var opcoesTema = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateTemas").html() + "{{/data}}",
								{"data":json["temas"]}
						);
						//combo com perfis
						var opcoesPerfil = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateOpcoesPerfil").html() + "{{/data}}",
								{"data":json["perfis"]}
						);
						//lista todas as menus
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.mapfile.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.mapfile.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.mapfile.salvarDialogo",//funcao
											"opcoesPublicado": function(){
												var hash = {};
												hash["sim"] = i3GEOadmin.mapfile.dicionario.sim;
												hash["nao"] = i3GEOadmin.mapfile.dicionario.nao;
												if(this.publicado_mapa == ""){
													this.publicado_mapa = "SIM";
												}
												hash[this.publicado_mapa + "-sel"] = "selected";
												return Mustache.to_html(
														$("#templateOpcoesPublicado").html(),
														hash
												);
											},
											"opcoesPerfil": opcoesPerfil,
											"opcoesTema": opcoesTema
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
								"data": "modal",
								"onExcluir": "i3GEOadmin.core.fechaModalGeral",
								"onSalvar": "i3GEOadmin.mapfile.salvarDialogo"
							}
					)
			);
			i3GEOadmin.core.abreModalGeral(html);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
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
					"id_mapa="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data)*1;
						$("#form-" + json).remove();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		salvarDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.mapfile.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapfile.salvar('"+id+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = $("#form-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_mapa="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
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
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
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
			if(i3GEO.util.in_array(codigoTema,i3GEOadmin.mapfile.favoritosArray)){
				i3GEOadmin.mapfile.favoritosArray.remove(codigoTema);
			} else {
				i3GEOadmin.mapfile.favoritosArray.push(codigoTema);
			}
			i3GEO.util.insereCookie("I3GEOfavoritosEditorMapfile", i3GEOadmin.mapfile.favoritosArray.toString(","));
			i3GEOadmin.mapfile.montaFavoritos();
		},
		montaFavoritos: function(){
			var mapfile, i, conteudo = [], n, codigo;
			n = i3GEOadmin.mapfile.favoritosArray.length;
			for (i=0; i<n; i++){
				codigo = i3GEOadmin.mapfile.favoritosArray[i];
				mapfile = '<div class="panel panel-default">' + $("#form-" + codigo + " .panel-heading").html();
				conteudo.push(mapfile);
				mapfile = '<div class="panel-body">' + $("#form-" + codigo + " .panel-footer").html() + "</div></div>";
				conteudo.push(mapfile);
			}
			$("#body-favoritos").html(conteudo.join("\n"));
		}

};