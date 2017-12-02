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
i3GEOadmin.mapfile = {};
i3GEOadmin.editor = {
		init: function(onde,codigo,id_tema){

		},
		salvar: function(){
			i3GEOadmin.core.iconeAguarde($("#titulo"));
			$("#form1").submit();
		},
		undo: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=undo",
					"codigomap=" + codigo
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						$("#form2").submit();
						//window.history.back(1);
						//window.location.reload();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.mapfile.parametrosSalvar = '';
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		testar: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			i3GEOadmin.teste.testaImg("../../../..",codigo,"","",$("#modalGeral .modal-body"));
		},
		testaTabela: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			i3GEOadmin.teste.testaTabela("../../../..",codigo,$("#modalGeral .modal-body"));
		},
		preview: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			var w = $("#modalGeral .modal-body").width() - 20;
			var p = "<iframe style='width:" + w + "px;height:650px;border:0px solid white;' src='../../../../mashups/openlayers.php?fundo=wsm&DESLIGACACHE=sim&controles=navigation,panzoombar,scaleline,mouseposition&ativarodadomouse=true&botoes=identifica&largura=" + (w - 40) + "&altura=600&temas=" + codigo + "'>";
			$("#modalGeral .modal-body").html(p);
		}
};