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
59 Temple Stredisponibilidadeet, Suite 330, Boston, MA 02111-1307 USA.

 */
i3GEOadmin.mapfile = {};
i3GEOadmin.conexaolocal = {
		inicia: function(codigo, id_tema){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=lista",
					"codigo="+codigo
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data);

						$("#corpo").html(
								Mustache.to_html(
										$("#templateFormConexaoLocal").html(),
										$.extend(
												{},
												i3GEOadmin.conexaolocal.dicionario,
												json.dados,
												{
													"codigo": codigo,
													"id_tema": id_tema,
													"onSalvar": "i3GEOadmin.conexaolocal.salvar",
													"convcaracter": function(){
														var hash = {
																"sim": i3GEOadmin.conexaolocal.dicionario.sim,
																"nao": i3GEOadmin.conexaolocal.dicionario.nao,
																"NAO-sel" : "",
																"SIM-sel": ""
															};
														hash[json.dados.convcaracter + "-sel"] = "selected";
														return Mustache.to_html(
																$("#templateOpcoesPublicado").html(),
																hash
														);
													},
													"metaestat":  function(){
														var hash = {
																"sim": i3GEOadmin.conexaolocal.dicionario.sim,
																"nao": i3GEOadmin.conexaolocal.dicionario.nao,
																"NAO-sel" : "",
																"SIM-sel": ""
															};
														hash[json.dados.metaestat + "-sel"] = "selected";
														return Mustache.to_html(
																$("#templateOpcoesPublicado").html(),
																hash
														);
													},
													"type": function(){
														var hash = {};
														hash[json.dados.type + "-sel"] = "selected";
														return Mustache.to_html(
																$("#templateTiposLayer").html(),
																hash
														);
													},
													"connectiontype": function(){
														var hash = {};
														hash[json.dados.connectiontype + "-sel"] = "selected";
														return Mustache.to_html(
																$("#templateTiposConexao").html(),
																hash
														);
													}
												}
										)
								)
						);
						$.material.init();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		salvar: function(codigo,id_tema){
			var parametros = $("#form-edicao-conexaolocal").serialize();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"codigo=" + codigo + "&id_tema="+ id_tema+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.conexaolocal.inicia(codigo,id_tema);
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		testa: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			i3GEOadmin.teste.testaImg("../../../../..",codigo,"","",$("#modalGeral .modal-body"))
		}
};