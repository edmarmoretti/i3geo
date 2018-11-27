/*
Title: Geolocalizacao

Abre a ferramenta que captura a posicao do usuario e mostra no mapa

Veja:

<i3GEO.mapa.dialogo.geolocal>

Arquivo:

i3geo/ferramentas/geolocal/index.js.php

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
if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
/*
 * Classe: i3GEOF.geolocal
 */
i3GEOF.geolocal =
{
	/*
	 * Variavel: posicoes
	 *
	 * Objetos capturados
	 */
	posicoes : [],
	contador : 0,
	tempo : null,
	/*
	 * Variavel: aguarde
	 *
	 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	 */
	aguarde : "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MUSTACHELISTA : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.geolocal.dicionario);
	    dicionario["locaplic"] = i3GEO.configura.locaplic;
	    return dicionario;
	},
	/*
	 * Function: inicia
	 *
	 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	 *
	 * Parametro:
	 *
	 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia : function(iddiv) {
	    if(i3GEOF.geolocal.MUSTACHE == ""){
		var t1 = i3GEO.configura.locaplic + "/ferramentas/geolocal/template_mst.html",
		t2 = i3GEO.configura.locaplic + "/ferramentas/geolocal/template_lista_mst.html";

		$.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
		    i3GEOF.geolocal.MUSTACHE = r1[0];
		    i3GEOF.geolocal.MUSTACHELISTA = r2[0];
		    i3GEOF.geolocal.inicia(iddiv);
		}).fail(function() {
		    i3GEO.janela.closeMsg($trad("erroTpl"));
		    return;
		});
		return;
	    }
	    // se nao permitir a localizacao, retorna uma mensagem
	    if (navigator.geolocation) {
		$i(iddiv).innerHTML = i3GEOF.geolocal.html();
		$i("i3GEOFgeolocalFormTempo").onsubmit = i3GEOF.geolocal.capturaTempo;
		i3GEOF.geolocal.capturaCoordenada();
	    } else {
		$i(iddiv).innerHTML = $trad('msgNavegador', i3GEOF.geolocal.dicionario);
	    }
	},
	/*
	 * Function: html
	 *
	 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
	 *
	 * Retorno:
	 *
	 * String com o c&oacute;digo html
	 */
	html : function() {
	    var ins = Mustache.render(i3GEOF.geolocal.MUSTACHE, i3GEOF.geolocal.mustacheHash());
	    return ins;
	},
	/*
	 * Function: iniciaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
	    var janela, divid, temp, titulo, cabecalho, minimiza;
	    if ($i("i3GEOF.geolocal")) {
		return;
	    }
	    cabecalho = function() {
	    };
	    minimiza = function() {
		i3GEO.janela.minimiza("i3GEOF.geolocal",200);
	    };
	    // cria a janela flutuante
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad('localizaUsuario',i3GEOF.geolocal.dicionario) + "</span></div>";
	    janela = i3GEO.janela.cria(
		    "410",
		    "230",
		    "",
		    "",
		    "",
		    titulo,
		    "i3GEOF.geolocal",
		    false,
		    "hd",
		    cabecalho,
		    minimiza,
		    "",
		    true,
		    "",
		    "",
		    "",
		    "",
		    "118"
	    );
	    divid = janela[2].id;
	    $i("i3GEOF.geolocal_corpo").style.backgroundColor = "white";
	    $i("i3GEOF.geolocal_corpo").style.textAlign = "left";
	    i3GEOF.geolocal.aguarde = $i("i3GEOF.geolocal_imagemCabecalho").style;
	    i3GEOF.geolocal.inicia(divid);
	    temp = function() {
		var api;
		api = i3GEO.Interface["ATUAL"];
		i3GEOF.geolocal[api].removeLayer();
		i3GEOF.geolocal.paraTempo();
	    };
	    YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	capturaCoordenada : function() {
	    if (i3GEOF.geolocal.aguarde.visibility == "visible") {
		return;
	    }
	    i3GEOF.geolocal.aguarde.visibility = "visible";
	    var retorno = function(position) {
		position.id = i3GEOF.geolocal.contador;
		i3GEOF.geolocal.posicoes[i3GEOF.geolocal.contador] = position;
		i3GEOF.geolocal.contador = i3GEOF.geolocal.contador + 1;
		var n = parseInt($i("i3GEOFgeolocalMaximo").value, 10);
		if (n > 0 && i3GEOF.geolocal.posicoes.length > n) {
		    i3GEOF.geolocal.posicoes.splice(0, (i3GEOF.geolocal.posicoes.length - n));
		}
		i3GEOF.geolocal.listaCoord(position);
	    };
	    navigator.geolocation.getCurrentPosition(retorno, i3GEOF.geolocal.erro);
	},
	capturaTempo : function() {
	    var tempo = parseInt($i("i3GEOFgeolocalTempo").value, 10);
	    if (tempo) {
		if (tempo > 0) {
		    i3GEOF.geolocal.tempo = setInterval("i3GEOF.geolocal.capturaCoordenada()", tempo * 1000);
		} else {
		    clearInterval(i3GEOF.geolocal.tempo);
		}
	    }
	    return false;
	},
	paraTempo : function() {
	    if ($i("i3GEOFgeolocalTempo")) {
		$i("i3GEOFgeolocalTempo").value = 0;
	    }
	    clearInterval(i3GEOF.geolocal.tempo);
	},
	erro : function(error) {
	    i3GEOF.geolocal.paraTempo();
	    var erro = "";
	    switch (error.code) {
	    case error.PERMISSION_DENIED:
		erro = "User denied the request for Geolocation.";
		break;
	    case error.POSITION_UNAVAILABLE:
		erro = "Location information is unavailable.";
		break;
	    case error.TIMEOUT:
		erro = "The request to get user location timed out.";
		break;
	    case error.UNKNOWN_ERROR:
		erro = "An unknown error occurred.";
		break;
	    }
	    i3GEO.janela.tempoMsg(erro);
	    i3GEOF.geolocal.aguarde.visibility = "hidden";
	},
	listaCoord : function(position) {
	    var ps = i3GEOF.geolocal.posicoes;
	    var dados = {
		    "limpa": $trad('limpa', i3GEOF.geolocal.dicionario),
		    "locaplic": i3GEO.configura.locaplic,
		    "longitude": position.coords.longitude,
		    "latitude": position.coords.latitude,
		    "id": position.id
	    };
	    var ntr = document.createElement("tr");
	    ntr.id = "linhaGeolocal"+position.id;
	    var temp = Mustache.render(
		    "{{#data}}" + i3GEOF.geolocal.MUSTACHELISTA + "{{/data}}",
		    {"data":dados}
	    );
	    $(ntr).html(temp);
	    var tabela = $i("i3GEOFgeolocalListaDePontos");
	    tabela.appendChild(ntr);
	    $i("i3GEOFgeolocalNcoord").innerHTML = ps.length;

	    api = i3GEO.Interface["ATUAL"];
	    i3GEOF.geolocal[api].desenha();
	    i3GEOF.geolocal.aguarde.visibility = "hidden";
	},
	limpa : function() {
	    i3GEOF.geolocal.posicoes = [];
	    api = i3GEO.Interface["ATUAL"];
	    i3GEOF.geolocal[api].removeLayer();
	    var tabela = $i("i3GEOFgeolocalListaDePontos");
	    var cabecalho = tabela.getElementsByTagName("tr");
	    tabela.innerHtml = "";
	    tabela.appendChild(cabecalho);
	},
	excluiLinha : function(i) {
	    i3GEOF.geolocal.posicoes[i] = "";
	    var linha = $i("linhaGeolocal"+i);
	    linha.parentNode.removeChild(linha);
	},
	panLinha : function(i) {
	    var posicao = i3GEOF.geolocal.posicoes[i];
	    // @FIXME o pan nao funciona no OSM
	    if (posicao != undefined && i3GEO.Interface.openlayers.googleLike != true) {
		i3GEO.navega.pan2ponto((posicao.coords.longitude), (posicao.coords.latitude));
	    }
	},
	info : function(i) {
	    i3GEO.mapa.dialogo.cliqueIdentificaDefault(
		    i3GEOF.geolocal.posicoes[i].coords.longitude,
		    i3GEOF.geolocal.posicoes[i].coords.latitude);
	},
	mostraxy : function(i) {
	    if (i3GEO.Interface.ATUAL === "googleearth") {
		return;
	    }
	    var posicao = i3GEOF.geolocal.posicoes[i];
	    i3GEO.desenho.addPin(
		    posicao.coords.longitude,
		    posicao.coords.latitude,
		    "",
		    "",
		    i3GEO.configura.locaplic + '/imagens/google/confluence.png',
	    "pingeolocal");
	},
	escondexy : function() {
	    i3GEO.desenho.removePins("pingeolocal");
	},
	posicoes2pontos : function() {
	    var ps = i3GEOF.geolocal.posicoes, n = ps.length, i, pontos = [];
	    for (i = 0; i < n; i++) {
		pontos.push((ps[i].coords.longitude) + " " + ps[i].coords.latitude);
	    }
	    return pontos;
	},
	criaShp : function() {
	    function ativanovotema(retorno) {
		var pontos = i3GEOF.geolocal.posicoes2pontos(), temaNovo = retorno.data, converteParaLinha =
		    function() {
		    var cp = new cpaint();
		    cp.set_response_type("JSON");
		    var p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=sphPT2shp&para=linha&tema="
			+ temaNovo;
		    cp.call(p, "sphPT2shp", i3GEO.atualiza);
		};
		var p =
		    window.parent.i3GEO.configura.locaplic + "/ferramentas/inserexy2/exec.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=insereSHP&tema="
		    + retorno.data;
		var cp = new cpaint();
		cp.set_response_type("JSON");
		cp.set_transfer_mode('POST');
		cp.call(p, "insereSHP", converteParaLinha, "&xy=" + pontos.join(" "));
	    }
	    var cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.set_transfer_mode("POST");
	    var p = window.parent.i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid=" + i3GEO.configura.sid;
	    cp.call(p, "criaSHPvazio", ativanovotema, "&funcao=criashpvazio");
	},
	openlayers : {
	    desenha : function() {
		if (!i3GEO.desenho.layergrafico) {
		    i3GEO.desenho.openlayers.criaLayerGrafico();
		}
		i3GEOF.geolocal.openlayers.removeFiguras();
		var ps = i3GEOF.geolocal.posicoes, n = ps.length, i, feature;
		for (i = 0; i < n; i++) {
		    feature = new ol.Feature({
			geometry : new ol.geom.Point([
			    ps[i].coords.longitude, ps[i].coords.latitude
			    ])
		    });
		    feature.setProperties({
			origem : "i3GEOFgeolocal"
		    });
		    feature.setId(i3GEO.util.uid());
		    feature.setStyle(
			    new ol.style.Style({
				image: new ol.style.Circle({
				    radius: 6,
				    fill: new ol.style.Fill({
					color: 'red'
				    }),
				    stroke: new ol.style.Stroke({
					color: 'white',
					width: 2
				    })
				})
			    })
		    );
		    i3GEO.editor.setStyleDefault(feature);
		    i3GEO.desenho.layergrafico.getSource().addFeature(feature);
		    // linha
		    if (ps[i + 1]) {
			feature = new ol.Feature({
			    geometry : new ol.geom.LineString([
				[
				    ps[i].coords.longitude, ps[i].coords.latitude
				    ], [
					ps[i + 1].coords.longitude, ps[i + 1].coords.latitude
					]
				])
			});
			feature.setProperties({
			    origem : "i3GEOFgeolocal"
			});
			feature.setStyle(
				new ol.style.Style({
				    stroke: new ol.style.Stroke({
					color: 'white)',
					width: 2
				    }),
				    fill: new ol.style.Fill({
					color: 'red'
				    })
				})
			);
			feature.setId(i3GEO.util.uid());
			i3GEO.editor.setStyleDefault(feature);
			i3GEO.desenho.layergrafico.getSource().addFeature(feature);

		    }
		}
	    },
	    removeFiguras : function() {
		var s, features, n, f, i, remover = [];
		s = i3GEO.desenho.layergrafico.getSource();
		features = s.getFeatures();
		n = features.length;
		for(i = 0; i < n; i++){
		    f = features[i];
		    if(f.getProperties().origem === "i3GEOFgeolocal"){
			remover.push(f.getId());
		    }
		}
		n = remover.length;
		if(n > 0){
		    for(i = 0; i < n; i++){
			f = s.getFeatureById(remover[i]);
			i3GEO.desenho.layergrafico.getSource().removeFeature(f);
		    }
		}
	    },
	    removeLayer : function() {
		var temp = window.confirm($trad("x94"));
		if (temp) {
		    i3GEOF.geolocal.openlayers.removeFiguras();
		}
	    }
	},
	googlemaps : {
	    linhas : null,
	    marca : null,
	    desenha : function() {
		var ps = i3GEOF.geolocal.posicoes, n = ps.length, i, l, pointFeature = [];
		for (i = 0; i < n; i++) {
		    l = new google.maps.LatLng(ps[i].coords.latitude, ps[i].coords.longitude);
		    pointFeature.push(l);
		}
		i3GEOF.geolocal.googlemaps.removeLayer();
		i3GEOF.geolocal.googlemaps.marca = new google.maps.Marker({
		    position : new google.maps.LatLng(ps[0].coords.latitude, ps[0].coords.longitude),
		    map : i3GeoMap
		});
		i3GEOF.geolocal.googlemaps.linhas = new google.maps.Polyline({
		    path : pointFeature,
		    geodesic : true,
		    strokeColor : 'blue',
		    strokeOpacity : 1.0,
		    strokeWeight : 2,
		    name : "Coordenadas"
		});
		i3GEOF.geolocal.googlemaps.linhas.setMap(i3GeoMap);
		i3GEOF.geolocal.panLinha(n - 1);
	    },
	    removeLayer : function() {
		if (i3GEOF.geolocal.googlemaps.linhas) {
		    i3GEOF.geolocal.googlemaps.linhas.setMap(null);
		}
		if (i3GEOF.geolocal.googlemaps.marca) {
		    i3GEOF.geolocal.googlemaps.marca.setMap(null);
		}
	    }
	},
	// @TODO implementar desenho dos pontos e linhas
	googleearth : {
	    desenha : function() {
	    },
	    removeLayer : function() {
	    }
	}
};
