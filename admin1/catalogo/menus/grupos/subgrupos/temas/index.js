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
i3GEOadmin.temas = {
		id_menu: "",
		nome_menu: "",
		id_n1: "",
		nome_grupo: "",
		id_n2: "",
		nome_subgrupo: "",
		onde: "",
		//conteudo html do formulario de adicao na raiz
		formAdiciona: "",
		init: function(onde){
			i3GEOadmin.temas.onde = onde;
			i3GEOadmin.temas.lista();
		},
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.temas.onde);

			$.post(
					"exec.php?funcao=lista",
					"id_n2=" + i3GEOadmin.temas.id_n2
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//combo com perfis
						var opcoesPerfil = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateOpcoesPerfil").html() + "{{/data}}",
								{"data":json["perfis"]}
						);
						//valor do filtro atual
						var filtro = i3GEOadmin.core.valorFiltro();
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["dados"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						$(".ui-autocomplete-input").attr( "title", "Filtro" );

						if(filtro != ""){
							i3GEOadmin.core.defineFiltro(filtro);
							i3GEOadmin.core.filtra(i3GEOadmin.core.pegaFiltro());
						}
						i3GEOadmin.temas.listaTemas(json["dados"],opcoesPerfil,json["temas"]);

						//torna os paineis ordenavies
						i3GEOadmin.temas.onde.sortable({
							update: function( event, ui ) {
								var data = i3GEOadmin.temas.onde.sortable('toArray', {attribute: "data-id"});
								i3GEOadmin.temas.ordena(data);
							}
						});

						//faz com que seja mostrado um icone de ordenamento no mouseover
						$('.panel').hover(
						        function(){
						            $(this).find('.move').fadeIn(400);
						        },
						        function(){
						            $(this).find('.move').fadeOut(250);
						        }
						    );

						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.temas.onde.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		listaTemas: function(dados,opcoesPerfil,temas){
			var template = $("#templateTemas").html();
			var html = Mustache.to_html(
					"{{#data}}" + template + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.temas.dicionario,
							{
								"data": dados,
								"opcoesPerfil": opcoesPerfil,
								"onExcluir": "i3GEOadmin.temas.excluirTemaDialogo",//funcao
								"onSalvar": "i3GEOadmin.temas.salvarTemaDialogo",//funcao
								"opcoesTema": function(){
									var p = this.codigo_tema;
									var id = "";
									//marca o selecionado
									$(temas).each(
											function(i,el){
												if(el.codigo_tema == p){
													temas[i]["selected"] = "selected";
													id = i;
												}
												else{
													temas[i]["selected"] = "";
												}
											}
									);
									var html = '<option value="">---</option>' + Mustache.to_html(
											"{{#data}}" + $("#templateOpcoesTema").html() + "{{/data}}",
											{"data":temas}
									);
									//volta ao normal
									temas[id]["selected"] = "";
									return html;
								}
							}
					)
			);
			i3GEOadmin.temas.onde.html(html);

			//monta um template para o modal de inclusao de novo tema
			if(i3GEOadmin.temas.formAdiciona == ""){
				html = Mustache.to_html(
						$("#templateTemas").html(),
						$.extend(
								{},
								i3GEOadmin.temas.dicionario,
								{
									"id_n3": "modal",
									"escondido": "hidden",
									"opcoesPerfil": opcoesPerfil,
									"excluir": i3GEOadmin.temas.dicionario.cancelar,
									"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
									"onSalvar": "i3GEOadmin.temas.adicionaTema",//funcao
									"opcoesTema": function(){
										var html = '<option value="">---</option>' + Mustache.to_html(
												"{{#data}}" + $("#templateOpcoesTema").html() + "{{/data}}",
												{"data":temas}
										);
										return html;
									}
								}
						)
				);
				i3GEOadmin.temas.formAdiciona = html;
			}
		},
		adicionaTemaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.temas.formAdiciona);
			$("#body-form-modal").collapse('show');
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaTema: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_menu=" + i3GEOadmin.temas.id_menu + "&id_n2=" + i3GEOadmin.temas.id_n2
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.temas.onde);
						i3GEOadmin.temas.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirTemaDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.temas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.temas.excluirTema('"+id+"')",
					"botao1": i3GEOadmin.temas.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.temas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirTema: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_n3=" + id
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
		salvarTemaDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.temas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.temas.salvarTema('"+id+"')",
					"botao1": i3GEOadmin.temas.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.temas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarTema: function(id){
			var parametros = $("#form-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_n3="+ id + "&"+parametros + "&id_menu=" + i3GEOadmin.temas.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.temas.onde);
						i3GEOadmin.temas.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		ordena: function(data){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
				"exec.php?funcao=ordena",
				"id_n2=" + i3GEOadmin.temas.id_n2 + "&ordem=" + data.join(" ")
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.temas.ondeNos);
						i3GEOadmin.temas.lista();
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
		}
};