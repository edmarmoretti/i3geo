/**
 * Title: Temas
 *
 * Funcoes de dialogo e processamento de propriedades de um tema existente no mapa
 *
 * Em i3GEO.tema.dialogo estao as funcoes de abertura dos dialogos para alteracao das propriedades do tema,
 *
 * Namespace:
 *
 * i3GEO.tema
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_tema.js>
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
//TODO nova ferramenta para definir GEOMTRANSFORM
i3GEO.tema =
{
	/**
	 * Objeto que contem os identificadores dos temporizadores (setInterval) estabelecidos para cada camada
	 *
	 * Type: {objeto} - {idtema:{idtemporizador:,tempo:}}
	 */
	TEMPORIZADORESID : {},
	/**
	 * Function: ativaFerramentas
	 *
	 * Verifica se uma camada possuí ferramentas configuradas e que devem ser abertas ao ser adicionada ao mapa
	 *
	 * Parametros:
	 *
	 * {objeto} - objeto camada ver em i3GEO.arvoreDeCamadas.CAMADAS
	 */
	ativaFerramentas : function(camada){
	    if(camada.ferramentas && camada.ferramentas != ""){
		var f = camada.ferramentas;
		if(f.tme && f.tme.auto && f.tme.auto.toLowerCase() === "sim"){
		    if (typeof (console) !== 'undefined')
			console.info("i3GEO.tema.ativaFerramentas tme " + camada.name);

		    i3GEO.tema.dialogo.tme(camada.name);
		}
		if(f.storymap && f.storymap.auto && f.storymap.auto.toLowerCase() === "sim"){
		    if (typeof (console) !== 'undefined')
			console.info("i3GEO.tema.ativaFerramentas storymap " + camada.name);

		    i3GEO.tema.dialogo.storymap(camada.name);
		}
		if(f.animagif && f.animagif.auto && f.animagif.auto.toLowerCase() === "sim"){
		    if (typeof (console) !== 'undefined')
			console.info("i3GEO.tema.ativaFerramentas animagif " + camada.name);

		    i3GEO.tema.dialogo.animagif(camada.name);
		}
	    }
	},
	/**
	 * Function: exclui
	 *
	 * Exclui um tema do mapa
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 *
	 * {boolean} - confirma exclusao
	 */
	exclui : function(tema,confirma) {
	    if(confirma && confirma === true){
		i3GEO.janela.confirma($trad("removerDoMapa"), 300, $trad("x14"),
			"", function() {
		    i3GEO.tema.exclui(tema);
		});
		return;
	    }
	    try {
		i3GEO.pluginI3geo.removeCamada(tema);
	    } catch (r) {}
	    var excluir = [tema];
	    var camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[tema];

	    $.each(i3GEO.arvoreDeCamadas.CAMADAS, function( index, v ) {
		if((camada.group != "" && camada.group == v.group) || camada.name == v.group){
		    excluir.push(v.name);
		}
	    });

	    i3GEO.php.excluitema(function(){i3GEO.atualiza();}, excluir);
	    i3GEO.mapa.ativaTema();
	    i3GEO.temaAtivo = "";
	},
	/**
	 * Function: fonte
	 *
	 * Abre os metadados registrados para o tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 *
	 * {boolean} - abre em um popup
	 */
	fonte : function(tema, popup, link) {
	    i3GEO.mapa.ativaTema(tema);
	    if(!link){
		link = i3GEO.configura.locaplic + "/ferramentas/abrefontemapfile.php?tema=" + tema;
	    }
	    if (!popup) {
		window.open(link);
	    } else {
		i3GEO.janela.cria(
			(i3GEO.parametros.w / 2) + 25 + "px",
			(i3GEO.parametros.h / 2) + 18 + "px",
			link,
			"",
			"",
			"<div class='i3GeoTituloJanela'>Metadata</div>",
			"metadata" + tema
		);
	    }
	},
	/**
	 * Sobe um tema na ordem de desenho
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 */
	sobe : function(tema) {
	    i3GEO.php.sobetema(function(retorno) {
		//
		// atualiza apenas remonta a arvore
		// no caso de interfaces como openlayers
		// e necessario mover o DIV tbm
		//
		i3GEO.atualiza(retorno);
		if (i3GEO.Interface.ATUAL === "openlayers") {
		    i3GEO.Interface.openlayers.ordenaLayers();
		}
	    }, tema);
	},
	/**
	 * Desce um tema na ordem de desenho
	 *
	 * Parametros:
	 *
	 * tema - codigo do tema
	 */
	desce : function(tema) {
	    i3GEO.php.descetema(function(retorno) {
		//
		// atualiza apenas remonta a arvore
		// no caso de interfaces como openlayers
		// e necessario mover o DIV tbm
		//
		i3GEO.atualiza(retorno);
		if (i3GEO.Interface.ATUAL === "openlayers") {
		    i3GEO.Interface.openlayers.ordenaLayers();
		}
	    }, tema);
	},
	/**
	 * Function: zoom
	 *
	 * Zoom para o tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 */
	zoom : function(tema) {
	    i3GEO.mapa.ativaTema(tema);
	    i3GEO.php.zoomtema(i3GEO.atualiza, tema);
	},
	/**
	 * Function: zoomsel
	 *
	 * Zoom para os elementos selecionados de um tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 */
	zoomsel : function(tema) {
	    i3GEO.mapa.ativaTema(tema);
	    i3GEO.php.zoomsel(i3GEO.atualiza, tema);
	},
	/**
	 * Function: limpasel
	 *
	 * Limpa a selecao do tema
	 *
	 * Parametros:
	 *
	 * {string} - ID (name) do tema clicado
	 */
	limpasel : function(tema) {
	    i3GEO.mapa.ativaTema(tema);
	    i3GEO.php.limpasel(function(retorno) {
		i3GEO.atualiza(retorno);
		i3GEO.Interface.atualizaTema(retorno, tema);
	    }, tema);
	},
	/**
	 * Function: mudatransp
	 *
	 * Muda a transparencia de um tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 *
	 * {numeric} - valor da transparencia
	 */
	mudatransp : function(idtema, valor) {
	    i3GEO.mapa.ativaTema(idtema);
	    // o campo input com o valor possui o prefixo 'tr' seguido pelo codigo do tema
	    if (!valor) {
		if ($i("tr" + idtema)) {
		    valor = $i("tr" + idtema).value;
		}
	    }
	    if (valor !== "") {
		i3GEO.php.mudatransp(function(retorno) {
		    i3GEO.atualiza(retorno);
		    i3GEO.Interface.atualizaTema(retorno, idtema);
		}, idtema, valor);
	    } else {
		i3GEO.janela.tempoMsg($trad("x16"));
	    }
	},
	/**
	 * Function: invertestatuslegenda
	 *
	 * Inverte o status atual do metadata CLASSE, permitindo esconder ou mostrar a legenda do tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 */
	invertestatuslegenda : function(idtema) {
	    //i3GEO.janela.tempoMsg($trad("x17"));
	    i3GEO.mapa.ativaTema(idtema);
	    i3GEO.php.invertestatuslegenda(function(retorno) {
		i3GEO.atualiza(retorno);
		i3GEO.arvoreDeCamadas.atualiza();
	    }, idtema);
	},
	/**
	 * Function: alteracorclasse
	 *
	 * Altera a cor de uma classe de um tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 *
	 * {numeric} - id da classe
	 *
	 * {string} - nova cor (r,g,b)
	 */
	alteracorclasse : function(idtema, idclasse, rgb, objImg) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.tema.alteracorclasse()");

	    var w = 25, h = 25, temp;
	    if(objImg && objImg.style && objImg.style.width){
		w = parseInt(objImg.style.width,10);
		h = parseInt(objImg.style.height,10);
	    }

	    i3GEO.mapa.ativaTema(idtema);
	    temp = function(retorno) {
		if(objImg){
		    objImg.src = retorno.data;
		} else {
		    i3GEO.legenda.CAMADAS = "";
		    i3GEO.atualiza();
		}
		i3GEO.Interface.atualizaTema("", idtema);
	    };
	    i3GEO.php.aplicaCorClasseTema(temp, idtema, idclasse, rgb, w, h);
	},
	/**
	 * Function: mudanome
	 *
	 * Muda o nome de um tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 */
	mudanome : function(idtema,valor) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.tema.mudanome() " + valor);

	    i3GEO.mapa.ativaTema(idtema);
	    if (!valor) {
		return;
	    }
	    if (valor !== "") {
		i3GEO.php.mudanome(i3GEO.atualiza, idtema, valor);
	    } else {
		i3GEO.janela.tempoMsg($trad("x18"));
	    }
	},
	/**
	 * Function: copia
	 *
	 * Adiciona ao mapa uma copia do tema
	 *
	 * Parametros:
	 *
	 * {string} - codigo do tema
	 */
	copia : function(idtema) {
	    i3GEO.php.copiatema(i3GEO.atualiza, idtema);
	},
	/**
	 * Liga ou desliga o contorno das classes
	 */
	contorno: function(idtema) {
	    var temp = function(){
		i3GEO.atualiza();
		i3GEO.Interface.atualizaTema("", idtema);
		i3GEO.arvoreDeCamadas.atualizaLegenda(idtema);
	    };
	    i3GEO.php.contorno(temp, idtema);
	},
	/**
	 * Function: temporizador
	 *
	 * Aplica um temporizador para que a camada seja redesenhada em determinado intervalo de tempo.
	 *
	 * O campo com o valor de tempo (em segundos) e composto por "temporizador"+idtema
	 *
	 * Parametros:
	 *
	 * {string} - id que identifica o tema no map file.
	 */
	temporizador : function(idtema, tempo) {
	    var t;
	    if(!tempo){
		if ($i("temporizador" + idtema)) {
		    tempo = $i("temporizador" + idtema).value;
		}
		else{
		    tempo = 0;
		}
	    }
	    if (tempo != "" && parseInt(tempo, 10) > 0) {
		//eval('i3GEO.tema.TEMPORIZADORESID.' + idtema + ' = {tempo: ' + tempo + ',idtemporizador: setInterval(function(' + idtema
		//	+ '){if(!$i("arrastar_' + idtema + '")){delete(i3GEO.tema.TEMPORIZADORESID.' + idtema
		//	+ ');return;}i3GEO.Interface.atualizaTema("",idtema);},parseInt(' + tempo + ',10)*1000)};');
		t = function(){
		    if(!$i("arrastar_" + idtema)){
			delete(i3GEO.tema.TEMPORIZADORESID[idtema]);
			return;
		    }
		    i3GEO.Interface.atualizaTema("",idtema);
		};

		i3GEO.tema.TEMPORIZADORESID[idtema] = {
			tempo: tempo,
			idtemporizador: setInterval(t,
				parseInt(tempo,10)*1000
			)
		};
	    } else {
		try {
		    window.clearInterval(i3GEO.tema.TEMPORIZADORESID[idtema].idtemporizador);
		    delete (i3GEO.tema.TEMPORIZADORESID[idtema]);
		} catch (e) {
		}
	    }
	},
	cortina : {
	    _cortinaCompose: "",
	    _slide: "",
	    start : function(obj,tema){
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.tema.cortina.start()");

		var layer = i3geoOL.getLayersByName(tema)[0];

		if(i3GEO.tema.cortina._cortinaCompose == ""){
		    var a = layer.on('precompose', function(event) {
			var ctx = event.context;
			var width = ctx.canvas.width * (obj.value / 100);
			ctx.save();
			ctx.beginPath();
			ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
			ctx.clip();
		    });

		    var b = layer.on('postcompose', function(event) {
			var ctx = event.context;
			ctx.restore();
		    });

		    i3GEO.tema.cortina._cortinaCompose = [a,b];

		    obj.addEventListener('input', function() {
			i3geoOL.render();
		    }, false);
		}
	    },
	    stop : function(){
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.tema.cortina.stop()");

		ol.Observable.unByKey(i3GEO.tema.cortina._cortinaCompose);
		i3GEO.tema.cortina._cortinaCompose = "";
		//i3GEO.tema.cortina._slide.value = 50;
		i3geoOL.renderSync();
	    }
	},
	/**
	 * Section: i3GEO.tema.dialogo
	 *
	 * Abre as telas de dialogo das opcoes de manipulacao de um tema
	 */
	dialogo : {
	    /**
	     * Function: animagif
	     *
	     * Abre a ferramenta animagif
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     */
	    animagif : function(tema) {
		if(!tema){
		    tema = "";
		}
		var temp = function(){
		    i3GEOF.animagif.start(tema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.animagif()",
			"animagif",
			"animagif",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: storymap
	     *
	     * Abre a ferramenta storymap
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     */
	    storymap : function(tema) {
		if(!tema){
		    tema = "";
		}
		var temp = function(){
		    i3GEOF.storymap.start(tema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.storymap()",
			"storymap",
			"storymap",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: tme
	     *
	     * Abre a ferramenta TME
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     */
	    tme : function(tema) {
		if(!tema){
		    tema = "";
		}
		var temp = function(){
		    i3GEOF.tme.start(tema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.tme()",
			"tme",
			"tme",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: mostraWms
	     *
	     * Mostra a url que da acesso ao WMS de um tema
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     */
	    mostraWms : function(tema) {
		i3GEO.janela.mensagemSimples(i3GEO.configura.locaplic + "/ogc.php?tema=" + tema, "WMS url");
	    },
	    /**
	     * Function: comentario
	     *
	     * Abre a janela de dialogo para o usuario ver e inserir comentarios em um tema
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     */
	    comentario : function(tema) {
		i3GEO.janela
		.cria(
			"530px",
			"330px",
			i3GEO.configura.locaplic + "/ferramentas/comentarios/index.php?tema=" + tema + "&g_sid=" + i3GEO.configura.sid
			+ "&locaplic=" + i3GEO.configura.locaplic,
			"",
			"",
			"<img src='"
			+ i3GEO.configura.locaplic
			+ "/imagens/player_volta.png' style=cursor:pointer onclick='javascript:history.go(-1)'><span style=position:relative;top:-2px; > "
			+ $trad("x19") + " " + tema + "</span><a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
			+ "/ajuda_usuario.php?idcategoria=7&idajuda=68' ><b> </b></a>",
			"comentario" + Math.random());
	    },
	    /**
	     * Function: mmscale
	     *
	     * Abre a janela de dialogo que permite definir o comportamento do mapa em fun&ccedil;&atilde;o da escala
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     *
	     */
	    mmscale : function(tema) {
		var temp = function(){
		    i3GEOF.mmscale.start(tema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.mmscale()",
			"mmscale",
			"mmscale",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: atalhoscamada
	     *
	     * Abre a janela de dialogo que abre os atalhos de configura&ccedil;&atilde;o de um tema (utilizad na &aacute;rvore de camadas)
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     *
	     */
	    atalhoscamada : function(tema) {
		i3GEO.mapa.ativaTema(tema);
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.atalhoscamada()",
			"atalhoscamada",
			"atalhoscamada",
			"dependencias.php",
		"i3GEOF.atalhoscamada.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: abreKml
	     *
	     * Abre a janela de dialogo da ferramenta convertekml
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema escolhido
	     *
	     * {string} - tipo de kml - kml|kmz , o tipo kmz permite acessar os dados via kml (por meio de um WMS) e via kml vetorial.
	     */
	    abreKml : function(tema, tipo) {
		if (arguments.lenght === 1) {
		    tipo = "kml";
		}
		if (typeof (i3GEOF.converteKml) === 'undefined') {
		    i3GEO.util.scriptTag(
			    i3GEO.configura.locaplic + "/ferramentas/convertekml/index.js",
			    "i3GEOF.converteKml.criaJanelaFlutuante('" + tema + "','" + tipo + "')",
		    "i3GEOF.converteKml_script");
		} else {
		    i3GEOF.converteKml.criaJanelaFlutuante(tema, tipo);
		}
	    },
	    /**
	     * Function: salvaMapfile
	     *
	     * Abre a janela de dialogo da ferramenta salvamapfile
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema
	     */
	    salvaMapfile : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.salvaMapfile()", "salvamapfile", "salvamapfile");
	    },
	    /**
	     * Function: graficotema
	     *
	     * Abre a janela de dialogo da ferramenta graficotema
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema
	     *
	     */
	    graficotema : function(idtema) {
		if(idtema && idtema != ""){
		    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		    if(t.status < 2){
			i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
			return;
		    }
		}
		var temp = function(){
		    i3GEOF.graficoTema.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.graficotema()",
			"graficotema",
			"graficotema",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: toponimia
	     *
	     * Abre a janela de dialogo da ferramenta toponimia
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema
	     */
	    toponimia : function(idtema) {
		var temp = function(){
		    i3GEOF.toponimia.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.toponimia()",
			"toponimia",
			"toponimia",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: filtro
	     *
	     * Abre a janela de dialogo da ferramenta filtro
	     *
	     * Parametros:
	     *
	     * {string} - codigo do tema
	     *
	     * {boolean} - indica o modo de calculadora, que permite retornar o filtro para um ID
	     *
	     * {string} - id do elemento que recebera o filtro
	     */
	    filtro : function(idtema) {
		if(idtema && idtema != ""){
		    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		    if(t.status < 2){
			i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
			return;
		    }
		}
		i3GEO.mapa.ativaTema(idtema);
		var temp = function(){
		    //i3GEOF.filtro.iniciaJanelaFlutuante(modoCalculadora,idRetorno);
		    i3GEOF.filtro.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.filtro()",
			"filtro",
			"filtro",
			"dependencias.php",
			temp);
	    },
	    msQueryBuilder : function(idtema,id) {
		var temp = function(){
		    i3GEOF.msquerybuilder.start(idtema,id);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.msQueryBuilder()",
			"msquerybuilder",
			"msquerybuilder",
			"dependencias.php",
			temp);
	    },
	    busca : function(idtema) {
		var temp = function(){
		    i3GEOF.busca.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.busca()",
			"busca",
			"busca",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: tabela
	     *
	     * Abre a janela de dialogo da ferramenta tabela
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema conforme definido no map file
	     */
	    tabela : function(idtema) {
		if(idtema && idtema != ""){
		    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		    if(t.status < 2){
			i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
			return;
		    }
		}
		var temp = function(){
		    i3GEOF.tabela.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.tabela()",
			"tabela",
			"tabela",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: etiquetas
	     *
	     * Abre a janela de dialogo da ferramenta etiqueta
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema conforme definido no map file
	     */
	    etiquetas : function(idtema) {
		var temp = function(){
		    i3GEOF.etiqueta.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.etiqueta()",
			"etiqueta",
			"etiqueta",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: funcaojstip
	     *
	     * Abre a janela de dialogo da ferramenta funcaojstip. Utilizado na ferramenta atalhosedicao
	     * Permite alterar o metadata que controla a lista de funcoes JS que são mostradas no balao de
	     * informacoes quando o usuario clica no mapa
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema conforme definido no map file
	     */
	    funcaojstip : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.funcaojstip()",
			"funcaojstip",
			"funcaojstip",
			"dependencias.php",
		"i3GEOF.funcaojstip.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: editaLegenda
	     *
	     * Abre a janela de dialogo da ferramenta legenda
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema conforme definido no map file
	     */
	    editaLegenda : function(idtema) {
		if(idtema && idtema != ""){
		    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		    if(t.status < 2){
			i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
			return;
		    }
		}
		var temp = function(){
		    i3GEOF.legenda.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.editaLegenda()",
			"legenda",
			"legenda",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: editaClasseLegenda
	     *
	     * Abre a janela de dialogo da ferramenta legenda deiretamente no editor de simbolo de uma classe especifica
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema conforme definido no map file
	     */
	    editaClasseLegenda : function(idtema,idclasse) {
		var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		if(t.status < 2){
		    i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
		    return;
		}
		i3GEO.mapa.ativaTema(idtema);
		var temp = function() {
		    i3GEOF.legenda.aposIniciar = function(){
			i3GEOF.legenda.classe = 0;
			i3GEOF.legenda.estilo = 0;
			i3GEOF.legenda.editaSimbolo('i3GEOlegendaid_'+idtema+"-"+idclasse);
			i3GEOF.legenda.aposIniciar = function(){};
		    };
		    i3GEOF.legenda.iniciaJanelaFlutuante(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.editaLegenda()",
			"legenda",
			"legenda",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: download
	     *
	     * Abre a janela de dialogo da ferramenta download
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema no map file.
	     */
	    download : function(idtema) {
		var temp = function(){
		    i3GEOF.download.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.download()",
			"download",
			"download",
			"dependencias.php",
			temp);
	    },
	    /**
	     * Function: ogcwindow
	     *
	     * Abre uma aba no navegador com as opcoes de acesso aos dados de um tema via OGC
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema no map file.
	     */
	    ogcwindow : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		window.open(i3GEO.configura.locaplic+"/ogc.htm?temaOgc="+idtema);
	    },
	    /**
	     * Function: sld
	     *
	     * Converte a legenda do tema para o formato SLD (utilizado em requisicoes de Web Services OGC)
	     *
	     * O SLD e mostrado em uma janela sobre o mapa
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema no map file.
	     */
	    sld : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		i3GEO.janela.cria("500px", "350px", i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?funcao=tema2sld&tema="
			+ idtema + "&g_sid=" + i3GEO.configura.sid, "", "", "<div class='i3GeoTituloJanela'>SLD<a class=ajuda_usuario target=_blank href='"
			+ i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=41' ><b> </b></a></div>");
	    },
	    /**
	     * Function: aplicarsld
	     *
	     * Fax o upload de um arquivo SLD (xml) e aplica ao tema
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema no map file.
	     */
	    aplicarsld : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.aplicarsld()",
			"aplicarsld",
			"aplicarsld",
			"dependencias.php",
		"i3GEOF.aplicarsld.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: editorsql
	     *
	     * Abre a janela de dialogo da ferramenta editorsql
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema no map file.
	     */
	    editorsql : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.editorsql()",
			"editorsql",
			"editorsql",
			"dependencias.php",
		"i3GEOF.editorsql.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: mudanome
	     *
	     * Abre uma janela para o usuario definir o novo nome do tema
	     *
	     * Parametros:
	     *
	     * {string} - id que identifica o tema no map file.
	     */
	    mudanome : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		var temp = function(){
		    var valor = $i("i3GEOjanelaprompt").value;
		    i3GEO.tema.mudanome(idtema,valor);
		};
		i3GEO.janela.prompt($trad("novonome"),temp);
	    },
	    selecao : function(idtema) {
		if(idtema && idtema != ""){
		    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		    if(t.status < 2){
			i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
			return;
		    }
		}
		var temp = function(){
		    i3GEOF.selecao.start(idtema);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.tema.dialogo.selecao()",
			"selecao",
			"selecao",
			"dependencias.php",
			temp
		);
	    },
	}
};
