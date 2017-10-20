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
i3GEOadmin.teste = {
	testaImg: function(locaplic,codigo,ondeMapa,ondeLegenda,ondeAmbos){
		if(ondeMapa && ondeMapa != ""){
			i3GEOadmin.core.iconeAguarde(ondeMapa);
		}
		if(ondeLegenda && ondeLegenda != ""){
			i3GEOadmin.core.iconeAguarde(ondeLegenda);
		}
		$.post(
				locaplic+"/admin/catalogo/mapfile/teste/exec.php?funcao=testaImg",
				"codigo=" + codigo
		)
		.done(
				function(data, status){
					//objeto json com os dados vindos do banco
					var json = jQuery.parseJSON(data);
					if(ondeMapa && ondeMapa != ""){
						ondeMapa.html("<img src='" + json.imgMapa + "'>");
					}
					if(ondeLegenda && ondeLegenda != ""){
						ondeLegenda.html("<img src='" + json.imgLegenda + "'>");
					}
					if(ondeAmbos && ondeAmbos != ""){
						ondeAmbos.html("<img src='" + json.imgMapa + "'><br><br><img src='" + json.imgLegenda + "'><br><br><p>Time: " + json.tempo + "<br>Erros: " + json.erro);
					}
				}
		)
		.fail(function(data){
			if(ondeMapa && ondeMapa != ""){
				ondeMapa.html("");
			}
			if(ondeLegenda && ondeLegenda != ""){
				ondeLegenda.html("");
			}
			i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
		});
	},
	testaTabela: function(locaplic,codigo,onde){
		if(onde && onde != ""){
			i3GEOadmin.core.iconeAguarde(onde);
		}
		$.post(
				locaplic+"/admin/catalogo/mapfile/teste/exec.php?funcao=testaTabela",
				"codigo=" + codigo
		)
		.done(
				function(data, status){
					//objeto json com os dados vindos do banco
					var json = jQuery.parseJSON(data);
					if(onde && onde != ""){
						onde.html(json);
					}
				}
		)
		.fail(function(data){
			if(onde && onde != ""){
				onde.html("");
			}

			i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
		});
	}
};