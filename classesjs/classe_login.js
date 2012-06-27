/*
Title: Controle de usu&aacute;rio

Arquivo: i3geo/classesjs/classe_login.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; você pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Você deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.login

Controla o sistema de login e &aacute;rea restrita dos usu&aacute;rios
*/
i3GEO.login = {
	dialogo: {
		abrelogin: function(locaplic){
			if(!locaplic){
				locaplic = i3GEO.configura.locaplic;
			}
			if(typeof(console) !== 'undefined'){console.info("i3GEO.login.dialogo.abrelogin()");}
			if(typeof(i3GEOF.loginusuario) === 'undefined'){
				var js = locaplic+"/ferramentas/loginusuario/index.js";
				i3GEO.util.scriptTag(js,"i3GEOF.loginusuario.criaJanelaFlutuante()","i3GEOF.loginusuario_script");
			}
			else
			{i3GEOF.loginusuario.criaJanelaFlutuante();}
		},
		abrelogout: function(){}
	}
};