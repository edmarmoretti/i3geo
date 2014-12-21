/*
Title: Confluencias

Mostra os pontos de conflu&ecirc;ncia de coordenadas geogr&aacute;ficas de 1 por 1 grau.

Em cada conflu&ecirc;ncia &eacute; mostrado um link para o site www.confluence.org.
Os pontos s&atilde;o mostrados conforme a extens&atilde;o geogr&aacute;fica vista no mapa.

Veja:

<i3GEO.navega.dialogo.confluence>

Arquivo: i3geo/ferramentas/confluence/index.js.php

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
Classe: i3GEOF.confluence
*/
i3GEOF.confluence = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MARCA: false,
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.confluence.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.confluence.html();
			i3GEOF.confluence.ativaFoco();
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.confluence.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
					confluenceDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {i3GEOF.confluence.lista();});
					confluenceZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {i3GEOF.confluence.lista();});
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
					confluenceDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.confluence.lista();});
			}
			i3GEOF.confluence.lista();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.confluence.MUSTACHE, i3GEOF.confluence.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		i3GEOF.confluence.MARCA = false;
		cabecalho = function(){
			i3GEOF.confluence.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.confluence");
		};
		//cria a janela flutuante
		titulo = "Confluence <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=75' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"250px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.confluence",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.confluence.aguarde = $i("i3GEOF.confluence_imagemCabecalho").style;
		i3GEOF.confluence.inicia(divid);
		temp = function(){
			i3GEOF.confluence.escondexy();
			if(i3GEO.Interface.ATUAL !== "googlemaps"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.confluence.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				google.maps.event.removeListener(confluenceDragend);
				google.maps.event.removeListener(confluenceZoomend);
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				google.earth.removeEventListener(confluenceDragend);
			}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		g_operacao = "navega";
		var i = $i("i3GEOF.confluence_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: escondexy

	Esconde a marca mostrada no mapa
	*/
	escondexy: function(){
		i3GEO.desenho.removePins("confluence");
		i3GEOF.confluence.MARCA = false;
	},
	/*
	Function: mostraxy

	Indica a conflu&ecirc;ncia no mapa
	*/
	mostraxy: function(xy){
		if(i3GEO.Interface.ATUAL === "googleearth")
		{return;}
		xy = xy.split(",");
		if(i3GEOF.confluence.MARCA === false){
			i3GEOF.confluence.MARCA = i3GEO.desenho.addPin(xy[1]*1,xy[0]*1,"","",i3GEO.configura.locaplic+'/imagens/google/confluence.png',"confluence");
		}
		else{
			i3GEO.desenho.movePin(i3GEOF.confluence.MARCA,xy[1]*1,xy[0]*1);
		}
	},
	/*
	Function: lista

	Lista os pontos de conflu&ecirc;ncia
	*/
	lista: function(){
		try{
			var ins = "",i,j,ext,xini,yini,xfim,yfim,xs,dx,ys = [];
			if(i3GEO.parametros.mapexten){
				ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
			}
			else{
				ext = "-49.1774741355 -16.379556709 -47.2737662565 -14.9806872512";
			} //apenas para exemplo
			ext = ext.split(" ");
			xini = parseInt(ext[0],10);
			yini = parseInt(ext[1],10);
			xfim = parseInt(ext[2],10);
			yfim = parseInt(ext[3],10);
			xs = [];
			dx = xfim - xini;
			if ((dx > 1) || (dx < -1)){
				for (i=xini;i<xfim;i++){
					xs.push(i);
				}
				ys = [];
				for (i=yini;i<yfim;i++){
					ys.push(i);
				}
			}
			ins = "<p class='paragrafo' >"+$trad('ajuda',i3GEOF.confluence.dicionario)+"</p>";
			if(xs.length === 0){
				ins += "<br><br>"+$trad('msgCoordenada',i3GEOF.confluence.dicionario)+" <br><br>"+$trad('msgZoom',i3GEOF.confluence.dicionario);
			}
			else{
				for (i=0;i<xs.length;i++){
					for (j=0;j<ys.length;j++){
						ins += "<br><a onmouseover='i3GEOF.confluence.mostraxy(\""+ys[j]+","+xs[i]+"\")' href='http://www.confluence.org/confluence.php?lat="+ys[j]+"&lon="+xs[i]+" ' target=blank >Long. "+xs[i]+" Lat."+ys[j]+"</a><br>";
					}
				}
			}
			$i("i3GEOconfluenceLista").innerHTML = ins+"<br><br>";
			i3GEOF.confluence.aguarde.visibility = "hidden";
		}
		catch(e){
			return true;
		}
	}
};
