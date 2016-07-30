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
i3GEOadmin.grupos = {
		id_menu: "",
		nome_menu: "",
		ondeRaiz: "",
		ondeNos: "",
		//conteudo html do formulario de adicao na raiz
		formAdicionaRaiz: "",
		formAdicionaNo: "",
		init: function(ondenos,onderaiz){
			i3GEOadmin.grupos.ondeRaiz = onderaiz;
			i3GEOadmin.grupos.ondeNos = ondenos;
			i3GEOadmin.grupos.lista();
		},
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeRaiz);
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeNos);

			$.post(
					"exec.php?funcao=lista&id_menu=" + i3GEOadmin.grupos.id_menu
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
						i3GEOadmin.grupos.listaRaiz(json["raiz"],opcoesPerfil,json["temas"]);
						i3GEOadmin.grupos.listaNos(json["grupos"],opcoesPerfil,json["tiposGrupos"]);
						//torna os paineis ordenavies
						i3GEOadmin.grupos.ondeNos.sortable({
							update: function( event, ui ) {
								var data = i3GEOadmin.grupos.ondeNos.sortable('toArray', {attribute: "data-id"});
								i3GEOadmin.grupos.ordenaNos(data);
							}
						});
						i3GEOadmin.grupos.ondeRaiz.sortable({
							update: function( event, ui ) {
								var data = i3GEOadmin.grupos.ondeRaiz.sortable('toArray', {attribute: "data-id"});
								i3GEOadmin.grupos.ordenaRaiz(data);
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
				i3GEOadmin.grupos.ondeRaiz.html("");
				i3GEOadmin.grupos.ondeNos.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		listaRaiz: function(dados,opcoesPerfil,temas){
			var templateRaiz = $("#templateRaiz").html();
			var html = Mustache.to_html(
					"{{#data}}" + templateRaiz + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.grupos.dicionario,
							{
								"data": dados,
								"opcoesPerfil": opcoesPerfil,
								"onExcluir": "i3GEOadmin.grupos.excluirTemaDialogo",//funcao
								"onSalvar": "i3GEOadmin.grupos.salvarTemaDialogo",//funcao
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
			i3GEOadmin.grupos.ondeRaiz.html(html);

			//monta um template para o modal de inclusao de novo tema
			if(i3GEOadmin.grupos.formAdicionaRaiz == ""){
				html = Mustache.to_html(
						$("#templateRaiz").html(),
						$.extend(
								{},
								i3GEOadmin.grupos.dicionario,
								{
									"id_raiz": "modal",
									"escondido": "hidden",
									"opcoesPerfil": opcoesPerfil,
									"excluir": i3GEOadmin.grupos.dicionario.cancelar,
									"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
									"onSalvar": "i3GEOadmin.grupos.adicionaTemaRaiz",//funcao
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
				i3GEOadmin.grupos.formAdicionaRaiz = html;
			}
		},
		listaNos: function(dados,opcoesPerfil,grupos){
			var templateNos = $("#templateNos").html();
			var html = Mustache.to_html(
					"{{#data}}" + templateNos + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.grupos.dicionario,
							{
								"data": dados,
								"opcoesPerfil": opcoesPerfil,
								"onExcluir": "i3GEOadmin.grupos.excluirNoDialogo",//funcao
								"onSalvar": "i3GEOadmin.grupos.salvarNoDialogo",//funcao
								"opcoesPublicado": function(){
									var hash = {};
									hash[this.publicado + "-sel"] = "selected";
									hash["sim"] = i3GEOadmin.grupos.dicionario.sim;
									hash["nao"] = i3GEOadmin.grupos.dicionario.nao;
									return Mustache.to_html(
											$("#templateOpcoesPublicado").html(),
											hash
									);
								},
								"opcoesNo": function(){
									var p = this.id_grupo;
									var id = "";
									//marca o selecionado
									$(grupos).each(
										function(i,el){
											if(el.id_grupo == p){
												grupos[i]["selected"] = "selected";
												id = i;
											}
											else{
												grupos[i]["selected"] = "";
											}
										}
									);
									var html = '<option value="">---</option>' + Mustache.to_html(
										"{{#data}}" + $("#templateOpcoesNo").html() + "{{/data}}",
										{"data":grupos}
									);
									//volta ao normal
									grupos[id]["selected"] = "";
									return html;
								}
							}
					)
			);
			i3GEOadmin.grupos.ondeNos.html(html);
			//valor do filtro atual
			var filtro = i3GEOadmin.core.valorFiltro();
			//filtro
			html = Mustache.to_html(
					"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
					{"data":dados}
			);
			$("#filtro").html("<option value='' >Todos</option>" + html);
			$("#filtro").combobox();
						$(".ui-autocomplete-input").attr( "title", "Filtro" );

			if(filtro != ""){
				i3GEOadmin.core.defineFiltro(filtro);
				i3GEOadmin.core.filtra(i3GEOadmin.core.pegaFiltro());
			}
			if(i3GEOadmin.grupos.formAdicionaNo == ""){
				html = Mustache.to_html(
						templateNos,
						$.extend(
								{},
								i3GEOadmin.grupos.dicionario,
								{
									"id_n1": "modal",
									"escondido": "hidden",
									"excluir": i3GEOadmin.grupos.dicionario.cancelar,
									"opcoesPerfil": opcoesPerfil,
									"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
									"onSalvar": "i3GEOadmin.grupos.adicionaNo",//funcao
									"opcoesPublicado": function(){
										var hash = {};
										hash["sim"] = i3GEOadmin.grupos.dicionario.sim;
										hash["nao"] = i3GEOadmin.grupos.dicionario.nao;
										return Mustache.to_html(
												$("#templateOpcoesPublicado").html(),
												hash
										);
									},
									"opcoesNo": function(){
										var html = '<option value="">---</option>' + Mustache.to_html(
											"{{#data}}" + $("#templateOpcoesNo").html() + "{{/data}}",
											{"data":grupos}
										);
										return html;
									}
								}
						)
				);
				i3GEOadmin.grupos.formAdicionaNo = html;
			}
		},
		adicionaTemaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.grupos.formAdicionaRaiz);
			$("#body-formRaiz-modal").collapse('show');
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaTemaRaiz: function(){
			var parametros = $("#formRaiz-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"execraiz.php?funcao=adicionar",
					parametros + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeRaiz);
						i3GEOadmin.grupos.lista();
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
					"mensagem": i3GEOadmin.grupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.grupos.excluirTema('"+id+"')",
					"botao1": i3GEOadmin.grupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.grupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirTema: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"execraiz.php?funcao=excluir",
					"id_raiz=" + id + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data)*1;
						$("#formRaiz-" + json).remove();
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
					"mensagem": i3GEOadmin.grupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.grupos.salvarTema('"+id+"')",
					"botao1": i3GEOadmin.grupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.grupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarTema: function(id){
			var parametros = $("#formRaiz-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"execraiz.php?funcao=alterar",
					"id_raiz="+ id + "&"+parametros + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeRaiz);
						i3GEOadmin.grupos.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		adicionaNoDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.grupos.formAdicionaNo);
			$("#body-formNo-modal").collapse('show');
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaNo: function(){
			var parametros = $("#formNo-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeNos);
						i3GEOadmin.grupos.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirNoDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.grupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.grupos.excluirNo('"+id+"')",
					"botao1": i3GEOadmin.grupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.grupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirNo: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_n1=" + id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data)*1;
						$("#formNo-" + json).remove();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		salvarNoDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.grupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.grupos.salvarNo('"+id+"')",
					"botao1": i3GEOadmin.grupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.grupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarNo: function(id){
			var parametros = $("#formNo-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_n1="+ id + "&"+parametros + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeNos);
						i3GEOadmin.grupos.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		ordenaNos: function(data){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
				"exec.php?funcao=ordena",
				"id_menu=" + i3GEOadmin.grupos.id_menu + "&ordem=" + data.join(" ")
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeNos);
						i3GEOadmin.grupos.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		ordenaRaiz: function(data){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
				"execraiz.php?funcao=ordena",
				"id_menu=" + i3GEOadmin.grupos.id_menu + "&ordem=" + data.join(" ")
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeNos);
						i3GEOadmin.grupos.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		editarSubGrupos: function(id,titulo){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin
			+ window.location.pathname
			+ "?id_filtro=" + id + "&id_menu=" + i3GEOadmin.grupos.id_menu + "&nome_menu=" + i3GEOadmin.grupos.nome_menu
			+ "&nome_grupo=" + titulo + "&id_n1=" + id;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "subgrupos/index.php?id_n1=" + id + "&nome_grupo=" + titulo + "&id_menu=" + i3GEOadmin.grupos.id_menu + "&nome_menu=" + i3GEOadmin.grupos.nome_menu;
		},
		editarListaDeGrupos: function(id,titulo){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin
			+ window.location.pathname
			+ "?id_filtro=" + id + "&id_menu=" + i3GEOadmin.grupos.id_menu + "&nome_menu=" + i3GEOadmin.grupos.nome_menu
			+ "&nome_grupo=" + titulo + "&id_n1=" + id;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "listadegrupos/index.php?id_n1=" + id + "&nome_grupo=" + titulo + "&id_menu=" + i3GEOadmin.grupos.id_menu + "&nome_menu=" + i3GEOadmin.grupos.nome_menu;
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};