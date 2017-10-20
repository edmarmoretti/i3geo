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
i3GEOadmin.cdados = {
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
										$("#templateFormCdados").html(),
										$.extend(
												{},
												i3GEOadmin.cdados.dicionario,
												json.dados,
												{
													"codigo": codigo,
													"id_tema": id_tema,
													"onSalvar": "i3GEOadmin.cdados.salvar",
													"encoding": function(){
														if(json.dados.encoding == "notInVersion"){
															return i3GEOadmin.cdados.dicionario["notInVersion"];
														}
														return json.dados.encoding;
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
			var parametros = $("#form-edicao-cdados").serialize();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"codigo=" + codigo + "&id_tema="+ id_tema+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.cdados.inicia(codigo,id_tema);
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		calcularExtensao: function(codigo,id_tema){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=calculaextensao",
					"codigo=" + codigo + "&id_tema="+ id_tema
			)
			.done(
					function(data, status){
						i3GEOadmin.cdados.inicia(codigo,id_tema);
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