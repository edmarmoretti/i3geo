<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Class: i3GEOF.converteMapaWS

Converte um mapa em WMS
*/
i3GEOF.converteMapaWS = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta

	Parametros:
	
	divid {String} - id do div que receberá o conteudo HTML da ferramenta

	*/
	html:function(divid,endereco){
		try{
			var ins = '<p class="paragrafo" >Voc&ecirc; pode utilizar o endere&ccedil;o em softwares de geoprocessamento instalados em seu computador, como por exemplo, o <a href="http://www.openjump.org" target=blank >OpenJump</a> ou <a href="http://www.gvsig.gva.es/" target=blank > gvSig</a>' +
			'<p class="paragrafo" >O "web service" criado, utiliza o padr&atilde;o WMS, conforme definido pelo OGC. A disponibilidade do endere&ccedil;o &eacute; tempor&aacute;ria, permanecendo ativa apenas no dia em que foi criado.' +
			'<p class="paragrafo" >O Web Map Context (WMC) pode ou não ser gerado dependendo da configuração do servidor onde o i3Geo está instalado. <a href="'+endereco+'&service=WMS&request=GetContext&version=1.1.0" target=_blank >Clique para obter o Web Map Context</a>'+
			'<p class="paragrafo" ><b>WMS: </b></p>' +
			'<p class="paragrafo" > <textarea cols="65" rows="3" style=cursor:pointer onclick="javascript:this.select()">' +
			endereco + '</textarea></p>' +
			'<p class="paragrafo" >Para testar, utilize: ' +
			'<a href="' + endereco + '&request=getcapabilities&version=1.1.0&service=wms" target=blank >' +
			endereco + '&request=getcapabilities&version=1.1.0&service=wms';
			$i(divid).innerHTML += ins;
			i3GEOF.converteMapaWS.aguarde.visibility = "hidden";
		}catch(e){alert(e);i3GEOF.converteMapaWS.aguarde.visibility = "hidden";}
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,p,cp;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.converteMapaWS");
		};
		titulo = "WMS <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=12' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"440px",
			"280px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.converteMapaWS",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.converteMapaWS.aguarde = $i("i3GEOF.converteMapaWS_imagemCabecalho").style;
		i3GEOF.converteMapaWS.aguarde.visibility = "visible";
		temp = function(retorno){
			var endereco = "Ocorreu um erro ao criar o WMS";
			if (retorno.data != undefined){
				endereco = window.location.protocol+"//"+window.location.host+retorno.data+"&"+retorno.data+"&";
			}
			i3GEOF.converteMapaWS.html(divid,endereco);
		};
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=convertews&h="+window.location.host;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"converteWS",temp);		
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>