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
i3GEOadmin.fontesmedida = {
		//variavel global indicando o elemento que recebera a lista de variaveis
		ondeLista: "",
		codigo_variavel: "",
		id_medida_variavel: "",
		listaDeFontes:"",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.fontesmedida.ondeLista = onde;
			i3GEOadmin.fontesmedida.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de variaveis
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.fontesmedida.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"id_medida_variavel=" + i3GEOadmin.fontesmedida.id_medida_variavel
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						i3GEOadmin.fontesmedida.listaDeFontes = json.fontes;
						//lista todas as variaveis
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.fontesmedida.dicionario,
										{
											"data": json.dados,
											"onExcluir": "i3GEOadmin.fontesmedida.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.fontesmedida.editarDialogo"
										}
								)
						);
						i3GEOadmin.fontesmedida.ondeLista.html(html);
						//monta um template para o modal de inclusao
						if(i3GEOadmin.fontesmedida.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.fontesmedida.dicionario,
											{
												"escondido": "hidden",
												"excluir": i3GEOadmin.fontesmedida.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.fontesmedida.adiciona",
												"listaDeFontes": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesFontes").html() + "{{/data}}",
															{"data":i3GEOadmin.fontesmedida.listaDeFontes}
														);
													return html;
												}
											}
									)
							);
							i3GEOadmin.fontesmedida.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.fontesmedida.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.fontesmedida.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_medida_variavel=" + i3GEOadmin.fontesmedida.id_medida_variavel
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.fontesmedida.ondeLista);
						i3GEOadmin.fontesmedida.lista();
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
					"mensagem": i3GEOadmin.fontesmedida.dicionario.confirma,
					"onBotao1": "i3GEOadmin.fontesmedida.excluir('"+id+"')",
					"botao1": i3GEOadmin.fontesmedida.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.fontesmedida.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_fonteinfo="+id + "&id_medida_variavel=" + i3GEOadmin.fontesmedida.id_medida_variavel
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.fontesmedida.lista();
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