
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
/*
Title: Metar

Busca as esta&ccedil;&otilde;es meteorol&oacute;gicas da rede METAR na extensão geogr&aacute;fica do mapa atual.

Veja:

<i3GEO.navega.dialogo.metar>

<metarextensao>

<metarproxima>

Arquivo:

i3geo/ferramentas/metar/index.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.metar

*/
i3GEOF.metar = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.metar.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.metar.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/metar/dicionario.js",
				"i3GEOF.metar.iniciaJanelaFlutuante()",
				"i3GEOF.metar.dicionario_script"
			);
		}
		else{
			i3GEOF.metar.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.metar.html();
			i3GEOF.metar.ativaFoco();
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.metar.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
   				metarDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {i3GEOF.metar.lista();});
   				metarZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {i3GEOF.metar.lista();});
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
   				metarDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.metar.lista();});
			}
			i3GEOF.metar.lista();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEOmetarLista style=display:block;background-color:white;text-align:left; ></div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.metar.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.metar");
		};
		//cria a janela flutuante
		titulo = "Metar <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=87' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"250px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.metar",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.metar.aguarde = $i("i3GEOF.metar_imagemCabecalho").style;
		i3GEOF.metar.inicia(divid);
		temp = function(){
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.metar.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				google.maps.event.removeListener(metarDragend);
				google.maps.event.removeListener(metarZoomend);
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				google.earth.removeEventListener(metarDragend);
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
		var i = $i("i3GEOF.metar_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: lista

	Lista as esta&ccedil;&otilde;es consultando o webservice http://ws.geonames.org/weatherJSON
	*/
	lista: function(){
		$i("i3GEOmetarLista").innerHTML = "";
		if(i3GEOF.metar.aguarde.visibility === "visible")
		{return;}
		i3GEOF.metar.aguarde.visibility = "visible";
		var montaResultado = {
	  		success:function(o){
	  			var ins,dados,ndados,i,temp,temp1;
				i3GEOF.metar.aguarde.visibility = "hidden";
				ins = "<p class=paragrafo >Navegue no mapa para atualizar a lista de resultados (são mostradas apenas as 10 primeiras esta&ccedil;&otilde;es encontradas)</p>";
				try{
					dados = YAHOO.lang.JSON.parse(o.responseText)[0].weatherObservations;
					ndados = dados.length;
					ins += "<table class=lista4 >";
					for(i=0;i<ndados;i++){
						temp = "i3GEOF.metar.mostraxy("+dados[i].lng+","+dados[i].lat+")";
						temp1 = "i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,"+dados[i].lng+","+dados[i].lat+")";
						ins += 	"<tr><td style=background:yellow ><b>Esta&ccedil;ão</b></td><td style=background:yellow ><b>" + dados[i].stationName + "</b></td></tr>" +
								"<tr><td></td><td><a href='#' onclick='"+temp1+"' onmouseover='"+temp+"' onmouseout='i3GEO.util.escondeBox()' >long: " + dados[i].lng + ", lat: "+dados[i].lat+"</a></td></tr>" +
								"<tr><td>temperatura</td><td>" + dados[i].temperature + " C</td></tr>" +
								"<tr><td>condi&ccedil;ão</td><td>" + dados[i].weatherCondition + "</td></tr>" +
								"<tr><td>observa&ccedil;ão</td><td>" + dados[i].observation + "</td></tr>" +
								"<tr><td>nuvens</td><td>" + dados[i].clouds + "</td></tr>" +
								"<tr><td>dire&ccedil;ão do vento</td><td>" + dados[i].windDirection + "</td></tr>" +
								"<tr><td>ponto de orvalho</td><td>" + dados[i].dewPoint + " C</td></tr>" +
								"<tr><td>velocidade do vento</td><td>" + dados[i].windSpeed + " mph</td></tr>" +
								"<tr><td>humidade</td><td>" + dados[i].humidity + " %</td></tr>" +
								"<tr><td>data</td><td>" + dados[i].datetime + "</td></tr>" +
								"<tr><td>pressão</td><td>" + dados[i].hectoPascAltimeter +" hpa</td></tr>" +
								"<tr><td>ICAO</td><td>" + dados[i].ICAO + "</td></tr>";
					}
					$i("i3GEOmetarLista").innerHTML = ins+"</table>";
				}
				catch(e){$i("i3GEOmetarLista").innerHTML = ins + "Ocorreu um erro ou nada foi encontrado";}
	  		},
	  		failure: function(o){
	 			$i("i3GEOmetarLista").innerHTML = "Erro. A opera&ccedil;ão demorou muito.";
	 			i3GEOF.metar.aguarde.visibility = "hidden";
				return;
	  		},
	  		argument: { foo:"foo", bar:"bar" }
		};
		if(i3GEO.parametros.mapexten)
		{ext = i3GEO.parametros.mapexten;}
		else
		{ext = "-49.1774741355 -16.379556709 -47.2737662565 -14.9806872512";} //apenas para exemplo
		p = i3GEO.configura.locaplic+"/ferramentas/metar/metarextensao.php?ret="+ext;
		YAHOO.util.Connect.asyncRequest("GET", p, montaResultado);
	},
	/*
	Function: mostraxy

	Indica no mapa a localiza&ccedil;ão de uma esta&ccedil;ão

	Parametros:

	x {Numero} - longitude em dd

	y {Numero} - latitude em dd
	*/
	mostraxy: function(x,y){
		if(i3GEO.Interface.ATUAL === "googleearth")
		{return;}
		i3GEO.util.criaPin("pinmetar",i3GEO.configura.locaplic+'/imagens/google/metar.png');
		xy = i3GEO.calculo.dd2tela(x*1,y*1,$i(i3GEO.Interface.IDCORPO),i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);
		var box = $i("pinmetar");
		box.style.display = "block";
		box.style.width = "27px";
		box.style.height = "27px";
		box.style.top = parseInt(xy[1],10)-27+"px";
		box.style.left = parseInt(xy[0],10)-13+"px";
		box.style.position = "absolute";
		box.style.border = "solid 0px red";
		box.style.zIndex = 5000;
	}
};
