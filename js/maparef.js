/**
 * Title: Mapa de refer&ecirc;ncia
 *
 * Cria e processa o mapa de refer&ecirc;ncia
 *
 * Para modificar o mapa de refer&ecirc;ncia, quando a op&ccedil;&atilde;o for din&acirc;mica,
 * edite o arquivo i3geo/aplicmap/referenciadinamica.map
 *
 * Namespace:
 *
 * i3GEO.maparef
 *
 * Exemplo:
 *
 * i3Geo.maparef.inicia()
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_maparef.js>
 */
/**
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
//TODO incluir template para montagem do mapa
i3GEO.maparef =
{
	/**
	 * Propriedade: fatorZoomDinamico
	 *
	 * Define o fator de zoom inicial do mapa de refer&ecirc;ncia quando o modo dinamico for ativado
	 *
	 * Tipo:
	 *
	 * {numeric}
	 *
	 * Default:
	 *
	 * -3
	 */
	fatorZoomDinamico : -3,
	/**
	 * Propriedade: TOP
	 *
	 * Posi&ccedil;&atilde;o da janela em rela&ccedil;&atilde;o ao topo do mapa
	 *
	 * Tipo:
	 *
	 * {Numeric}
	 *
	 * Default:
	 *
	 * 4
	 */
	TOP : 4,
	/**
	 * Propriedade: RIGHT
	 *
	 * Posi&ccedil;&atilde;o da janela em rela&ccedil;&atilde;o ao lado direito do mapa
	 *
	 * Tipo:
	 *
	 * {Numeric}
	 *
	 * Defaul:
	 *
	 * 50
	 */
	RIGHT : 120,
	//tipo de mapa que sera utilizado
	//wms: usa um wms definido em /aplicmap/referenciadinamica.map
	//map: utiliza o mapa atual
	//api: utiliza as fucoes da api em uso (implementado apenas para openlayers)
	DEFAULTMAP : "wms",
	//guarda o objeto criado pela api se for o caso
	APIOBJ : "",
	W : function() {
	    var w = parseInt(i3GEO.parametros.w, 10) / 5;
	    if (w < 150) {
		w = 150;
	    }
	    return parseInt(w, 10);
	},
	H : function() {
	    var h = parseInt(i3GEO.parametros.h, 10) / 5;
	    if (i3GEO.maparef.W() <= 150) {
		return 150;
	    } else {
		return parseInt(h, 10);
	    }
	},
	/**
	 * Function: inicia
	 *
	 * Inicializa o mapa de refer&ecirc;ncia
	 */
	inicia : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.inicia()");

	    if(i3GEO.maparef.DEFAULTMAP == "api" && i3GEO.Interface.ATUAL == "openlayers"){
		if(i3GEO.maparef.APIOBJ == ""){
		    i3GEO.maparef.APIOBJ = new ol.control.OverviewMap({
			collapsible: true,
			collapsed: false,
			layers: [i3geoOL.getLayerBase()],
			view: new ol.View(
	                        i3GEO.Interface.openlayers.parametrosView
	                )
		    });
		    i3GEO.maparef.APIOBJ.setMap(i3geoOL);
		} else {
		    i3GEO.maparef.APIOBJ.setCollapsed(!i3GEO.maparef.APIOBJ.getCollapsed());
		    if(i3GEO.maparef.APIOBJ.getCollapsed() == true){
			i3GEO.maparef.APIOBJ.setMap(null);
			i3GEO.maparef.APIOBJ = "";
		    }
		}
		return;

	    } else if (i3GEO.Interface.ATUAL == "googlemaps"){
		i3GEO.Interface.ATUAL = "wms";
	    }

	    var r, pos, novoel, ins, temp, moveX, moveY, escondeRef, janela;
	    if ($i("i3geo_winRef")) {
		janela = YAHOO.i3GEO.janela.manager.find("i3geo_winRef");
		janela.show();
		janela.bringToTop();
		return;
	    }
	    if (!$i("i3geo_winRef")) {
		novoel = document.createElement("div");
		novoel.id = "i3geo_winRef";
		novoel.style.display = "none";
		novoel.style.borderColor = "gray";
		ins = "";
		ins += '<div class="hd" style="border:0px solid black;text-align:left;z-index:20;padding-left: 0px;padding-bottom: 3px;padding-top: 1px;">';
		ins += '<span id=maparefmaismenosZoom style=display:none > ';
		temp = "javascript:if(i3GEO.maparef.fatorZoomDinamico == -1){i3GEO.maparef.fatorZoomDinamico = 1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico + 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";
		ins += "<button onclick='" + temp + "' class='btn btn-xs' style='margin:2px;padding:2px;'><span class='material-icons'>add_circle_outline</span></button>";
		temp = "javascript:if(i3GEO.maparef.fatorZoomDinamico == 1){i3GEO.maparef.fatorZoomDinamico = -1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico - 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";
		ins += "<button onclick='" + temp + "' class='btn btn-xs' style='margin:2px;padding:2px;'><span class='material-icons'>remove_circle_outline</span></button>";
		ins += "<div style='width: 100px;display:inline-table' class='form-group label-fixed condensed'>";
		ins += "<div style='width: 100%;' class='input-group'>";
		ins += "<select class='form-control' style='background-color:#094672' id='refDinamico' onchange='javascript:i3GEO.parametros.celularef=\"\";i3GEO.maparef.atualiza()'>";
		if(i3GEO.maparef.DEFAULTMAP == "map"){
		    ins += "<option value='mapa' >" + $trad("refMapaAtual") + "</option>";
		    ins += "<option value='dinamico' >" + $trad("refMapaDinamico") + "</option>";
		} else {
		    ins += "<option value='dinamico' >" + $trad("refMapaDinamico") + "</option>";
		    ins += "<option value='mapa'>" + $trad("refMapaAtual") + "</option>";
		}

		ins += "</select>";
		ins += "</div></div></div>";
		ins += '<div class="bd" style="border:0px solid black;text-align:left;padding:3px;height: ' + i3GEO.maparef.H()
		+ 'px;" id="mapaReferencia" onmouseover="this.onmousemove=function(exy){i3GEO.eventos.posicaoMouseMapa(exy)}"  >';
		ins +=
		    '<img style="cursor:pointer;display:none"class="img-rounded" onload="javascript:this.style.display = \'block\'" id="imagemReferencia" src="" onclick="javascript:i3GEO.maparef.click()">';
		ins += '</div>';
		novoel.innerHTML = ins;

		$(novoel).css("opacity", 1);
		document.body.appendChild(novoel);
	    }
	    if ($i("i3geo_winRef").style.display !== "block") {
		$i("i3geo_winRef").style.display = "block";

		janela = new YAHOO.widget.Panel("i3geo_winRef", {
		    height : i3GEO.maparef.H() + 47 + "px",
		    width : i3GEO.maparef.W() + 6 + "px",
		    fixedcenter : false,
		    constraintoviewport : false,
		    underlay : "shadow",
		    close : true,
		    visible : true,
		    draggable : true,
		    modal : false,
		    iframe : false,
		    strings: {close: "<span class='material-icons'>cancel</span>"}
		});
		YAHOO.i3GEO.janela.manager.register(janela);

		janela.cfg.setProperty("effect", [
		    {
			effect : YAHOO.widget.ContainerEffect.FADE,
			duration : 0.5
		    }
		    ]);

		janela.render();
		janela.show();
		try {
		    janela.header.style.height = "40px";
		} catch (e) {
		}
		;
		r = $i("i3geo_winRef_c");
		if (r) {
		    // r.style.clip = "rect(0px, 160px, 185px, 0px)";
		    r.style.position = "absolute";
		}
		pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
		$i("mapaReferencia").style.height = i3GEO.maparef.H() + "px";
		$i("i3geo_winRef").style.border = "0px solid gray";
		moveX = pos[0] + i3GEO.parametros.w - i3GEO.maparef.W() + 3 - i3GEO.maparef.RIGHT;
		moveY = pos[1] + i3GEO.maparef.TOP;
		if (i3GEO.Interface.ATUAL === "googlemaps") {
		    moveY += 30;
		}
		janela.moveTo(moveX, moveY);
		escondeRef = function() {
		    $i("imagemReferencia").src = "";
		    janela.destroy();
		};
		$(janela.close).click(escondeRef);
		if ($i("localizarxygeoProjxg")) {
		    var temp = function() {
			i3GEO.coordenadas.atualizaGeo(objposicaocursor.dmsx, objposicaocursor.dmsy, "localizarxygeoProj");
		    };
		    $("#imagemReferencia").mousemove(temp);
		}
	    }
	    i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEO.maparef.atualiza()"]);
	    i3GEO.maparef.atualiza(true);
	    $i("i3geo_winRef_h").className = "hd2";
	},
	/**
	 * Function: atualiza
	 *
	 * Atualiza o mapa de refer&ecirc;ncia.
	 *
	 * Se o modo cgi estiver ativado, o mapa de refer&ecirc;ncia &eacute; desenhado utilizando-se como src da imagem o programa cgi do
	 * Mapserver.
	 *
	 * No modo dinamico, a imagem &eacute; gerada de forma diferenciada. Nesse caso, o modo cgi &eacute; desabilitado.
	 *
	 * O atualizaReferencia &eacute; sempre chamado ap&oacute;s o mapa ser redesenhado.
	 *
	 * Se houve altera&ccedil;&atilde;o na extens&atilde;o, &eacute; preciso refazer o mapa de refer&ecirc;ncia se n&atilde;o, a imagem
	 * atual &eacute; armazenada no quado de anima&ccedil;&atilde;o
	 */
	atualiza : function(forca) {
	    if (arguments.length === 0) {
		forca = false;
	    }
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.atualiza()");

	    var tiporef, temp;
	    temp = $i("refDinamico") ? tiporef = $i("refDinamico").value : tiporef = "fixo";
	    if ($i("mapaReferencia")) {
		temp = $i("maparefmaismenosZoom");
		if (tiporef === "dinamico") {
		    i3GEO.php.referenciadinamica(
			    i3GEO.maparef.processaImagem,
			    i3GEO.maparef.fatorZoomDinamico,
			    tiporef,
			    i3GEO.maparef.W(),
			    i3GEO.maparef.H());
		    if (temp) {
			temp.style.display = "inline-table";
		    }
		}
		if (tiporef === "mapa") {
		    i3GEO.php.referenciadinamica(
			    i3GEO.maparef.processaImagem,
			    i3GEO.maparef.fatorZoomDinamico,
			    tiporef,
			    i3GEO.maparef.W(),
			    i3GEO.maparef.H());
		    if (temp) {
			temp.style.display = "inline-table";
		    }
		}
	    } else {
		i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEO.maparef.atualiza()"]);
	    }
	},
	/**
	 * Substitu&iacute; a imagem do mapa de refer&ecirc;ncia pela &uacute;ltima gerada.
	 *
	 * Esta fun&ccedil;&atilde;o processa os dados de uma chamada AJAX para atualizar o mapa de refer&ecirc;ncia
	 *
	 * Parametro:
	 *
	 * retorno - string no formato "var refimagem='nome da imagem'".
	 */
	processaImagem : function(retorno) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.processaImagem()");

	    var m, box, temp, tiporef = "fixo";
	    // i3GEO.janela.fechaAguarde("ajaxreferencia1");
	    if ((retorno.data !== "erro") && (retorno.data !== undefined)) {
		eval(retorno.data);
		i3GEO.parametros.celularef = g_celularef;
		i3GEO.parametros.extentref = extentref;
		temp = $i("imagemReferencia");
		if (temp) {
		    m = new Image();
		    m.src = refimagem;
		    temp.src = m.src;
		}

		temp = $i("refDinamico");
		if (temp) {
		    tiporef = temp.value;
		}
		if (tiporef !== "fixo") {
		    box = $i("boxref");
		    if (box) {
			box.style.display = "none";
		    }
		}
		i3GEO.maparef.atualizaBox();
	    }
	},
	/**
	 * Atualiza o tamanho e a posi&ccedil;&atilde;o do box que indica a extens&atilde;o geogr&aacute;fica do mapa atual
	 *
	 * O box &eacute; um div com id = "boxref".
	 *
	 */
	atualizaBox : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.atualizaBox()");

	    var box = i3GEO.maparef.criaBox(), w;
	    //
	    // aplica ao box um novo tamanho
	    //
	    i3GEO.calculo.ext2rect(
		    "boxref",
		    i3GEO.parametros.extentref,
		    i3GEO.parametros.mapexten,
		    i3GEO.parametros.celularef,
		    $i("mapaReferencia")
	    );
	    w = parseInt(box.style.width, 10);
	    if (w > 120) {
		box.style.display = "none";
		return;
	    }
	    box.style.display = "block";
	    box.style.top = parseInt(box.style.top, 10) + 4 + "px";
	    box.style.left = parseInt(box.style.left, 10) + 4 + "px";
	    if (w < 3) {
		box.style.width = "3px";
		box.style.height = "3px";
	    }
	},
	criaBox : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.criaBox()");

	    var box = $i("boxref");
	    if (!box) {
		novoel = document.createElement("div");
		novoel.id = "boxref";
		novoel.style.zIndex = 10;
		novoel.style.position = 'absolute';
		novoel.style.cursor = "move";
		novoel.style.backgroundColor = "RGB(120,220,220)";
		novoel.style.borderWidth = "3px";
		if (navm) {
		    novoel.style.filter = 'alpha(opacity=40)';
		} else {
		    novoel.style.opacity = 0.4;
		}
		$i("mapaReferencia").appendChild(novoel);
		//
		// aplica os eventos de movimenta&ccedil;&atilde;o sobre o box azul
		//
		//boxrefdd = new YAHOO.util.DD("boxref");
		//
		// atualiza o mapa principal quando o box &eacute; modificado manualmente
		//
		novoel.onmouseup =
		    function() {
		    var rect, telaminx, telamaxx, telaminy, m, x, ext;
		    rect = $i("boxref");
		    telaminx = parseInt(rect.style.left, 10);
		    telamaxy = parseInt(rect.style.top, 10);
		    telamaxx = telaminx + parseInt(rect.style.width, 10);
		    telaminy = telamaxy + parseInt(rect.style.height, 10);
		    m =
			i3GEO.calculo.tela2dd(
				telaminx,
				telaminy,
				i3GEO.parametros.celularef,
				i3GEO.parametros.extentref,
				"imagemReferencia");
		    x =
			i3GEO.calculo.tela2dd(
				telamaxx,
				telamaxy,
				i3GEO.parametros.celularef,
				i3GEO.parametros.extentref,
				"imagemReferencia");
		    ext = m[0] + " " + m[1] + " " + x[0] + " " + x[1];
		    i3GEO.navega.zoomExt(i3GEO.configura.locaplic, i3GEO.configura.sid, "", ext);
		};
		return novoel;
	    } else {
		return box;
	    }
	},
	/**
	 * Ocorre quando o usu&aacute;rio clica sobre o mapa de refer&ecirc;ncia, deslocando o mapa principal
	 */
	click : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.maparef.click()");
	    //FIXME nao funciona no OSM
	    if (i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps") {
		i3GEO.Interface[i3GEO.Interface.ATUAL].pan2ponto(objposicaocursor.ddx, objposicaocursor.ddy);
	    }
	}
};
