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
i3GEOadmin.gruposusuarios = {
		//variavel global indicando o elemento que recebera a lista de usuarios
		ondeListaGrupos: "",
		//conteudo html do formulario de adicao de operacao
		formAdicionaGrupo: "",
		init: function(onde){
			i3GEOadmin.gruposusuarios.ondeListaGrupos = onde;
			i3GEOadmin.gruposusuarios.pegaGrupos();
		},
		/*
Function: pegaGrupos

Obt&eacute;m a lista de grupos
		 */
		pegaGrupos: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeListaGrupos);
			$.post(
					"exec.php?funcao=pegaGruposEusuarios"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.gruposusuarios.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template dos checkbox
						var templateUsuarios = $("#templateInputUsuarios").html();
						//template do form de cada operacao
						var templateGrupos = $("#templateGrupos").html();
						//lista todas as usuarios
						var html = Mustache.to_html(
								"{{#data}}" + templateGrupos + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.gruposusuarios.dicionario,
										{
											"data": json["grupos"],
											"onExcluir": "i3GEOadmin.gruposusuarios.excluirGrupoDialogo",//funcao
											"onSalvar": "i3GEOadmin.gruposusuarios.salvarGrupoDialogo",//funcao
											"excluir": i3GEOadmin.gruposusuarios.dicionario.excluir,
											"inputUsuarios": function(){
												//marca os checkbox
												var p = this.usuarios;
												$(json["usuarios"]).each(
														function(i,el){
															if(p && el.id_usuario && p[el.id_usuario]){
																json["usuarios"][i]["checked"] = "checked";
															}
															else{
																json["usuarios"][i]["checked"] = "";
															}
														}
												);
												return Mustache.to_html(
														"{{#data}}" + templateUsuarios + "{{/data}}",
														{
															"data":json["usuarios"]
														}
												);
											}
										}
								)
						);
						i3GEOadmin.gruposusuarios.ondeListaGrupos.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["grupos"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.gruposusuarios.defineFiltro(filtro);
							i3GEOadmin.gruposusuarios.filtra(i3GEOadmin.gruposusuarios.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.gruposusuarios.formAdicionaGrupo == ""){
							html = Mustache.to_html(
									$("#templateGrupos").html(),
									$.extend(
											{},
											i3GEOadmin.gruposusuarios.dicionario,
											{
												"id_grupo": "modal",
												"excluir": i3GEOadmin.gruposusuarios.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.gruposusuarios.adicionaGrupo",//funcao
												"nome": "",
												"descricao": "",
												"inputUsuarios": function(){
													return Mustache.to_html(
															"{{#data}}" + templateUsuarios + "{{/data}}",
															{
																"data":json["usuarios"]
															}
													);
												}
											}
									)
							);
							i3GEOadmin.gruposusuarios.formAdicionaGrupo = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.gruposusuarios.ondeListaGrupos.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaGrupoDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.gruposusuarios.formAdicionaGrupo);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaGrupo: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionarGrupo",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeListaGrupos);
						i3GEOadmin.gruposusuarios.pegaGrupos();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirGrupoDialogo: function(id_grupo){
			var hash = {
					"mensagem": i3GEOadmin.gruposusuarios.dicionario.confirma,
					"onBotao1": "i3GEOadmin.gruposusuarios.excluirGrupo('"+id_grupo+"')",
					"botao1": i3GEOadmin.gruposusuarios.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.gruposusuarios.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirGrupo: function(id_grupo){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluirGrupo",
					"id_grupo="+id_grupo
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
		salvarGrupoDialogo: function(id_grupo){
			var hash = {
					"mensagem": i3GEOadmin.gruposusuarios.dicionario.confirma,
					"onBotao1": "i3GEOadmin.gruposusuarios.salvarGrupo('"+id_grupo+"')",
					"botao1": i3GEOadmin.gruposusuarios.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.gruposusuarios.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarGrupo: function(id_grupo){
			var parametros = $("#form-" + id_grupo + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterarGrupo",
					"id_grupo="+ id_grupo+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeListaGrupos);
						i3GEOadmin.gruposusuarios.pegaGrupos();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		pegaFiltro: function(){
			return $i("filtro");
		},
		valorFiltro: function(){
			return i3GEOadmin.gruposusuarios.pegaFiltro().value;
		},
		defineFiltro: function(valor){
			i3GEOadmin.gruposusuarios.pegaFiltro().value = valor;
		},
		filtra: function(obj){
			$("#corpo .panel").each(
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
			}
		}
};