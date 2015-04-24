/*
Title: Tela remota

Mostra um link que permite clonar o mapa atual e exib&iacute;-lo em uma outra tela. O mapa clonado &eacute; atualizado de tempos em tempos, permitindo a visualiza&ccedil;&atilde;o remota do mapa aberto poroutro usu&aacute;rio.

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.telaremota
*/
i3GEOF.telaremota = {
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(tema){
		i3GEOF.telaremota.iniciaDicionario(tema);
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(tema){
		if(typeof(i3GEOF.telaremota.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/telaremota/dicionario.js",
				"i3GEOF.telaremota.iniciaJanelaFlutuante('"+tema+"')",
				"i3GEOF.telaremota.dicionario_script"
			);
		}
		else{
			i3GEOF.telaremota.iniciaJanelaFlutuante(tema);
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Veja:

	<TELAREMOTA>

	Parametros:

	divid {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	html:function(divid,tema){
		var cp,p,ins;
		ins = '<p class="paragrafo" >'+$trad('linkMapa',i3GEOF.telaremota.dicionario)+'</p>';
		ins += '<p class="paragrafo" >'+$trad('naoFechaJanela',i3GEOF.telaremota.dicionario)+'</p>';
		ins += '<p class="paragrafo" ><div id=i3GEOtelaremotaResultado style=text-align:left ></div>';
		$i(divid).innerHTML += ins;
		mostraLink = function(retorno){
			var ins = "";
			var url1 = "?tempo=7000&telaR="+retorno.data+"&g_sid="+i3GEO.configura.sid;
			var url2 = i3GEO.configura.locaplic+"/ferramentas/telaremota/openlayers1.php"+url1;
			ins += "<p style='font-size:13px;text-align:left' >Openlayers:</p><br>";
			ins += "<a href="+url2+" target=_blank >"+url2+"</a>";
			var url2 = i3GEO.configura.locaplic+"/ferramentas/telaremota/googlemaps1.php"+url1;
			ins += "<br><br><p style='font-size:13px;text-align:left' >Google Maps:</p><br>";
			ins += "<a href="+url2+" target=_blank >"+url2+"</a>";
			var url2 = i3GEO.configura.locaplic+"/ferramentas/telaremota/googleearth1.php"+url1;
			ins += "<br><br><p style='font-size:13px;text-align:left' >Google Earth:</p><br>";
			ins += "<a href="+url2+" target=_blank >"+url2+"</a>";
			$i("i3GEOtelaremotaResultado").innerHTML = ins;
			i3GEOF.telaremota.aguarde.visibility = "hidden";
		};
		p = i3GEO.configura.locaplic+"/ferramentas/telaremota/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=telaremota";
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"telaremota",mostraLink);
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametros:

	tema {String} - c&oacute;digo do tema
	*/
	iniciaJanelaFlutuante: function(tema){
		var janela,divid,temp,titulo;
		if ($i("i3GEOF.telaremota")) {
			return;
		}
		if(arguments.length == 0)
		{tema = i3GEO.temaAtivo;}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.telaremota");
		};
		titulo = "<div class='i3GeoTituloJanela'>" + $trad("p20")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=99' ><b> </b></a></div>";
		janela = i3GEO.janela.cria(
			"400px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.telaremota",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.telaremota.aguarde = $i("i3GEOF.telaremota_imagemCabecalho").style;
		i3GEOF.telaremota.aguarde.visibility = "visible";
		i3GEOF.telaremota.html(divid,tema);
		i3GEOF.telaremota.gravaExtent();
		temp = function(){
			i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.telaremota.gravaExtent()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEOF.telaremota.gravaExtent()"]);
	},
	/*
	Function: gravaExtent

	Grava a extens&atilde;o geogr&aacute;fica do mapa atual na section PHP aberta pelo mapa atual.
	*/
	gravaExtent: function(){
		var p,cp,temp;
		temp = function(){};
		p = i3GEO.configura.locaplic+"/ferramentas/telaremota/recuperamapa.php?funcao=registra&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"recuperamapa",temp);
	}
};
