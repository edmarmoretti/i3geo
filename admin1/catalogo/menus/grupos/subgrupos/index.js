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
i3GEOadmin.subgrupos = {
		id_menu: "",
		nome_menu: "",
		id_n1: "",
		nome_grupo: "",
		ondeRaiz: "",
		ondeNos: "",
		//conteudo html do formulario de adicao na raiz
		formAdicionaRaiz: "",
		formAdicionaNo: "",
		init: function(ondenos,onderaiz){
			i3GEOadmin.subgrupos.ondeRaiz = onderaiz;
			i3GEOadmin.subgrupos.ondeNos = ondenos;
			i3GEOadmin.subgrupos.lista();
		},
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.subgrupos.ondeRaiz);
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.subgrupos.ondeNos);

			$.post(
					"exec.php?funcao=lista&id_n1=" + i3GEOadmin.subgrupos.id_n1 + "&id_menu=" + i3GEOadmin.subgrupos.id_menu
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
						i3GEOadmin.subgrupos.listaRaiz(json["raiz"],opcoesPerfil,json["temas"]);
						i3GEOadmin.subgrupos.listaNos(json["subgrupos"],opcoesPerfil,json["tiposSubGrupos"]);
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.subgrupos.ondeRaiz.html("");
				i3GEOadmin.subgrupos.ondeNos.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		listaRaiz: function(dados,opcoesPerfil,temas){
			var templateRaiz = $("#templateRaiz").html();
			var html = Mustache.to_html(
					"{{#data}}" + templateRaiz + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.subgrupos.dicionario,
							{
								"data": dados,
								"opcoesPerfil": opcoesPerfil,
								"onExcluir": "i3GEOadmin.subgrupos.excluirTemaDialogo",//funcao
								"onSalvar": "i3GEOadmin.subgrupos.salvarTemaDialogo",//funcao
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
			i3GEOadmin.subgrupos.ondeRaiz.html(html);

			//monta um template para o modal de inclusao de novo tema
			if(i3GEOadmin.subgrupos.formAdicionaRaiz == ""){
				html = Mustache.to_html(
						$("#templateRaiz").html(),
						$.extend(
								{},
								i3GEOadmin.subgrupos.dicionario,
								{
									"id_raiz": "modal",
									"escondido": "hidden",
									"opcoesPerfil": opcoesPerfil,
									"excluir": i3GEOadmin.subgrupos.dicionario.cancelar,
									"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
									"onSalvar": "i3GEOadmin.subgrupos.adicionaTemaRaiz",//funcao
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
				i3GEOadmin.subgrupos.formAdicionaRaiz = html;
			}
		},
		listaNos: function(dados,opcoesPerfil,subgrupos){
			var templateNos = $("#templateNos").html();
			var html = Mustache.to_html(
					"{{#data}}" + templateNos + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.subgrupos.dicionario,
							{
								"data": dados,
								"opcoesPerfil": opcoesPerfil,
								"onExcluir": "i3GEOadmin.subgrupos.excluirNoDialogo",//funcao
								"onSalvar": "i3GEOadmin.subgrupos.salvarNoDialogo",//funcao
								"opcoesPublicado": function(){
									var hash = {};
									hash[this.publicado + "-sel"] = "selected";
									hash["sim"] = i3GEOadmin.subgrupos.dicionario.sim;
									hash["nao"] = i3GEOadmin.subgrupos.dicionario.nao;
									return Mustache.to_html(
											$("#templateOpcoesPublicado").html(),
											hash
									);
								},
								"opcoesNo": function(){
									var p = this.id_subgrupo;
									var id = "";
									//marca o selecionado
									$(subgrupos).each(
										function(i,el){
											if(el.id_subgrupo == p){
												subgrupos[i]["selected"] = "selected";
												id = i;
											}
											else{
												subgrupos[i]["selected"] = "";
											}
										}
									);
									var html = '<option value="">---</option>' + Mustache.to_html(
										"{{#data}}" + $("#templateOpcoesNo").html() + "{{/data}}",
										{"data":subgrupos}
									);
									//volta ao normal
									subgrupos[id]["selected"] = "";
									return html;
								}
							}
					)
			);
			i3GEOadmin.subgrupos.ondeNos.html(html);
			//valor do filtro atual
			var filtro = i3GEOadmin.core.valorFiltro();
			//filtro
			html = Mustache.to_html(
					"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
					{"data":dados}
			);
			$("#filtro").html("<option value='' >Todos</option>" + html);
			$("#filtro").combobox();
			if(filtro != ""){
				i3GEOadmin.core.defineFiltro(filtro);
				i3GEOadmin.core.filtra(i3GEOadmin.core.pegaFiltro());
			}
			if(i3GEOadmin.subgrupos.formAdicionaNo == ""){
				html = Mustache.to_html(
						templateNos,
						$.extend(
								{},
								i3GEOadmin.subgrupos.dicionario,
								{
									"id_n2": "modal",
									"escondido": "hidden",
									"excluir": i3GEOadmin.subgrupos.dicionario.cancelar,
									"opcoesPerfil": opcoesPerfil,
									"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
									"onSalvar": "i3GEOadmin.subgrupos.adicionaNo",//funcao
									"opcoesPublicado": function(){
										var hash = {};
										hash["sim"] = i3GEOadmin.subgrupos.dicionario.sim;
										hash["nao"] = i3GEOadmin.subgrupos.dicionario.nao;
										return Mustache.to_html(
												$("#templateOpcoesPublicado").html(),
												hash
										);
									},
									"opcoesNo": function(){
										var html = '<option value="">---</option>' + Mustache.to_html(
											"{{#data}}" + $("#templateOpcoesNo").html() + "{{/data}}",
											{"data":subgrupos}
										);
										return html;
									}
								}
						)
				);
				i3GEOadmin.subgrupos.formAdicionaNo = html;
			}
		},
		adicionaTemaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.subgrupos.formAdicionaRaiz);
			$("#body-formRaiz-modal").collapse('show');
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaTemaRaiz: function(){
			var parametros = $("#formRaiz-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"execraiz.php?funcao=adicionar",
					parametros + "&id_menu=" + i3GEOadmin.subgrupos.id_menu + "&id_n1=" + i3GEOadmin.subgrupos.id_n1
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.subgrupos.ondeRaiz);
						i3GEOadmin.subgrupos.lista();
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
					"mensagem": i3GEOadmin.subgrupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.subgrupos.excluirTema('"+id+"')",
					"botao1": i3GEOadmin.subgrupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.subgrupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirTema: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"execraiz.php?funcao=excluir",
					"id_raiz=" + id + "&id_menu=" + i3GEOadmin.subgrupos.id_menu
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
					"mensagem": i3GEOadmin.subgrupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.subgrupos.salvarTema('"+id+"')",
					"botao1": i3GEOadmin.subgrupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.subgrupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarTema: function(id){
			var parametros = $("#formRaiz-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"execraiz.php?funcao=alterar",
					"id_raiz="+ id + "&"+parametros + "&id_menu=" + i3GEOadmin.subgrupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.subgrupos.ondeRaiz);
						i3GEOadmin.subgrupos.lista();
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.subgrupos.formAdicionaNo);
			$("#body-formNo-modal").collapse('show');
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaNo: function(){
			var parametros = $("#formNo-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_menu=" + i3GEOadmin.subgrupos.id_menu + "&id_n1=" + i3GEOadmin.subgrupos.id_n1
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.subgrupos.ondeNos);
						i3GEOadmin.subgrupos.lista();
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
					"mensagem": i3GEOadmin.subgrupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.subgrupos.excluirNo('"+id+"')",
					"botao1": i3GEOadmin.subgrupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.subgrupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirNo: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_n2=" + id
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
					"mensagem": i3GEOadmin.subgrupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.subgrupos.salvarNo('"+id+"')",
					"botao1": i3GEOadmin.subgrupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.subgrupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarNo: function(id){
			var parametros = $("#formNo-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_n2="+ id + "&"+parametros + "&id_menu=" + i3GEOadmin.subgrupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.subgrupos.ondeNos);
						i3GEOadmin.subgrupos.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		editarTemas: function(id,titulo){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin
			+ window.location.pathname
			+ "?id_filtro=" + id + "&id_menu=" + i3GEOadmin.subgrupos.id_menu + "&nome_menu=" + i3GEOadmin.subgrupos.nome_menu
			+ "&nome_grupo=" + i3GEOadmin.subgrupos.nome_grupo + "&id_n1=" + i3GEOadmin.subgrupos.id_n1
			+ "&nome_subgrupo=" + titulo + "&id_n2=" + id;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "temas/index.php?id_n1=" + i3GEOadmin.subgrupos.id_n1 + "&nome_grupo=" + i3GEOadmin.subgrupos.nome_grupo + "&id_n2=" + id + "&nome_subgrupo=" + titulo + "&id_menu=" + i3GEOadmin.subgrupos.id_menu + "&nome_menu=" + i3GEOadmin.subgrupos.nome_menu;
		},
		editarListaDeSubGrupos: function(id,titulo){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin
			+ window.location.pathname
			+ "?id_filtro=" + id + "&id_menu=" + i3GEOadmin.subgrupos.id_menu + "&nome_menu=" + i3GEOadmin.subgrupos.nome_menu
			+ "&nome_grupo=" + i3GEOadmin.subgrupos.nome_grupo + "&id_n1=" + i3GEOadmin.subgrupos.id_n1 + "&nome_subgrupo=" + titulo + "&id_n2=" + id;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "listadesubgrupos/index.php?id_n2=" + id + "&nome_subgrupo=" + titulo + "&id_menu=" + i3GEOadmin.subgrupos.id_menu + "&nome_menu=" + i3GEOadmin.subgrupos.nome_menu + "&nome_grupo=" + i3GEOadmin.subgrupos.nome_grupo + "&id_n1=" + i3GEOadmin.subgrupos.id_n1;
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};