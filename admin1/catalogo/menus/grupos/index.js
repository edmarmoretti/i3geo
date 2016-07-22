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
		ondeRaiz: "",
		ondeNos: "",
		//conteudo html do formulario de adicao na raiz
		formAdicionaRaiz: "",
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
						i3GEOadmin.grupos.listaNos(json["grupos"]);
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
						templateRaiz,
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
		listaNos: function(dados){
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
				i3GEOadmin.core.filtra(i3GEOadmin.grupos.pegaFiltro());
			}
		},
		adicionaTemaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.grupos.formAdicionaRaiz);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaTemaRaiz: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeLista);
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
		excluirDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.grupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.grupos.excluir('"+id+"')",
					"botao1": i3GEOadmin.grupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.grupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_grupos=" + id + "&id_menu=" + i3GEOadmin.grupos.id_menu
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
					"mensagem": i3GEOadmin.grupos.dicionario.confirma,
					"onBotao1": "i3GEOadmin.grupos.salvar('"+id+"')",
					"botao1": i3GEOadmin.grupos.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.grupos.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = $("#form-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_grupos="+ id + "&"+parametros + "&id_menu=" + i3GEOadmin.grupos.id_menu
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.grupos.ondeLista);
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
		editarTemas: function(id_menu, id_grupos,titulo_grupos){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin + window.location.pathname + "?id_menu=" + id_menu + "&id_filtro=" + id_grupos;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "temas/index.php?id_grupos=" + id_grupos + "&titulo_grupos=" + titulo_grupos + "&id_menu=" + id_menu;
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};