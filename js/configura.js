/**
 * Title: Configura&ccedil;&otilde;es gerais
 *
 * Configura&ccedil;&atilde;o do i3geo
 *
 * Vc pode alterar com esta classe a maioria dos par&acirc;metros que controlam o funcionamento do i3geo.
 *
 * Namespace:
 *
 * i3GEO.configura
 *
 * Exemplo:
 *
 * i3GEO.configura.embedLegenda = "nao"
 *
 * i3GEO.configura.cursores.ff = "/imagens/cursores/identifica2.png"
 *
 * i3GEO.configura.cursores.ie = "/imagens/cursores/identifica2.cur"
 *
 * alert(i3GEO.configura.locaplic)
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_configura.js>
 *
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.configura =
{
	/**
	 * Propriedade: ferramentasLayers
	 *
	 * Armazena fun&ccedil;&otilde;es e objetos que s&atilde;o utilizados para configurar ferramentas
	 *
	 * que possuem par&acirc;metros definidos em cada mapfile. Normalmente, os par&acirc;metros
	 *
	 * s&atilde;o utilizados no mashup para criar &iacute;cones que executam opera&ccedil;&otilde;es especiais
	 *
	 * Veja também mashups/openlayers.php variavel $listaFerramentas
	 */
	ferramentasLayers : {
	    //lista de ferramentas que aceitam parametros embutidos em mapfiles
	    param : ["tme","storymap","animagif","wmstime"],
	    "tme" : {
		"arvoreDeCamadas" : true,
		"metadata" : "tme",
		"classe" : "i3GEOiconeTme",
		init : function (codigo){
		    window.open(i3GEO.configura.locaplic+"/ferramentas/tme/cesium.php?&tema="+codigo);
		},
		icone : function(layer) {
		    var l, icone;
		    if(typeof layer != "string"){
			if(layer.params.LAYERS){
			    l = layer.params.LAYERS;
			} else{
			    l = layer.layername;
			}
		    }
		    else{
			l = layer;
		    }
		    icone =
			"<img class='i3GEOiconeTme' onclick='i3GEO.util.animaClique(this);"
			+ "i3GEO.configura.ferramentasLayers.tme.init(\""
			+ l
			+ "\");return false;'"
			+ "title='3d' "
			+ "src='"
			+ i3GEO.configura.locaplic
			+ "/imagens/branco.gif' />";
		    return icone;
		}
	    },
	    "storymap" : {
		"arvoreDeCamadas" : true,
		"metadata" : "storymap",
		"classe" : "i3GEOiconeStorymap",
		init : function (codigo){
		    window.open(i3GEO.configura.locaplic+"/ferramentas/storymap/default.php?&tema="+codigo);
		},
		icone : function(layer) {
		    var l, icone;
		    if(typeof layer != "string"){
			if(layer.params.LAYERS){
			    l = layer.params.LAYERS;
			} else{
			    l = layer.layername;
			}
		    }
		    else{
			l = layer;
		    }
		    icone =
			"<img class='i3GEOiconeStorymap' onclick='i3GEO.util.animaClique(this);"
			+ "i3GEO.configura.ferramentasLayers.storymap.init(\""
			+ l
			+ "\");return false;'"
			+ "title='StoryMap' "
			+ "src='"
			+ i3GEO.configura.locaplic
			+ "/imagens/branco.gif' />";
		    return icone;
		}
	    },
	    "animagif" : {
		"arvoreDeCamadas" : true,
		"metadata" : "animagif",
		"classe" : "i3GEOiconeAnimagif",
		init : function (codigo){
		    window.open(i3GEO.configura.locaplic+"/ferramentas/animagif/index.php?&tema="+codigo);
		},
		icone : function(layer) {
		    var l, icone;
		    if(typeof layer != "string"){
			if(layer.params.LAYERS){
			    l = layer.params.LAYERS;
			} else{
			    l = layer.layername;
			}
		    }
		    else{
			l = layer;
		    }
		    icone =
			"<img class='i3GEOiconeAnimagif' onclick='i3GEO.util.animaClique(this);"
			+ "i3GEO.configura.ferramentasLayers.animagif.init(\""
			+ l
			+ "\");return false;'"
			+ "title='Animagif' "
			+ "src='"
			+ i3GEO.configura.locaplic
			+ "/imagens/branco.gif' />";
		    return icone;
		}
	    },
	    "wmstime" : {
		parametrosForm: function(temaObj){
		    if (typeof (console) !== 'undefined')
			     console.info("configura wmstime parametrosForm");

		    var html = [],
		    	parametros = temaObj.ferramentas.wmstime,
		    	times = parametros.times.split("|");

		    html.push("<div style='width: 100%;' class='form-group label-fixed condensed'>");
		    html.push("<div style='width: 100%;' class='input-group'>");
		    html.push("<select name='" + temaObj.name + "' onchange='i3GEO.configura.ferramentasLayers.wmstime.changeTime(this)' class='form-control' >");
		    $.each(times,function(i,v){
			var s = "";
			if(v == parametros.time){
			    s = "selected";
			}
			html.push("<option " + s + " value='" + v + "'>" + v + "</option>");
		    });

		    html.push("</select>");
		    html.push("<b class='caret careti'></b>");
		    html.push("</div></div>");

		    return html.join("");
		},
		changeTime: function(obj){
		    var time = obj.value,
		    	temaObj = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[obj.name];
		    i3GEO.janela.abreAguarde();
		    $.post(
			    i3GEO.configura.locaplic+"/ferramentas/wmstime/exec.php",
			    {
				funcao: "alteratime",
				g_sid: i3GEO.configura.sid,
				layer: temaObj.name,
				time: time,
				times: temaObj.ferramentas.wmstime.times
			    }
		    )
		    .done(
			    function(data, status){

				i3GEO.janela.fechaAguarde();
				if(data.errorMsg != ""){
				    i3GEO.janela.snackBar({content: data.errorMsg, style:'red'});
				} else {
				    i3GEO.Interface.atualizaTema("",temaObj.name);
				    i3GEO.janela.snackBar({content: $trad("camadaatualizada")});
				}

			    }
		    )
		    .fail(
			    function(data){
				i3GEO.janela.fechaAguarde();
				i3GEO.janela.snackBar({content: data.status, style:'red'});
			    }
		    );
		}
	    }
	},
	/**
	 * Propriedade: ferramentas
	 *
	 * Parametros que sao utilizados para configurar ferramentas especificas
	 *
	 * O codigo index.js deve permitir o uso dessas configuracoes
	 *
	 */
	ferramentas: {
	    identifica : {
		resolution : 8 //utilizado em verificaTipDefault (i3GEO.mapa)
	    }
	},
	/**
	 * Propriedade: grupoLayers
	 *
	 * Lista de grupos e seus respectivos layers, para montagem da &aacute;rvore de camadas.
	 *
	 * Se essa propriedade estiver definida, as camadas ser&atilde;o agrupadas na &aacute;rvore de camadas conforme os grupos definidos.
	 *
	 * Layers que n&atilde;o constarem nessa propriedade ser&atilde;o inclu&iacute;dos no grupo "outros"
	 *
	 * Ao definir grupos, a &aacute;rvore n&atilde;o conter&aacute; as op&ccedil;&otilde;es de mudan&ccedil;a da prdem de desenho das
	 * camadas ( veja http://localhost/i3geo/exemplos/legenda2.htm )
	 *
	 * Por exemplo i3GEO.configura.grupoLayers = [ {nome:"Grupo 1",icone:true,dinamico:true,expandido:true,layers:["zee","estadosl"]},
	 * {nome:"Grupo 2",icone:false,dinamico:true,expandido:false,layers:["mundo"]} ];
	 *
	 * Onde "icone" indica se o &iacute;cone de ligar/desligar todos os temas do grupo ser&aacute; mostrado, "dinamico" significa que o
	 * n&oacute; pode ser expandido ou n&atilde;o, e "expandido" significa que o n&oacute; inicia aberto se a &aacute;rvore for
	 * din&acirc;mica
	 *
	 * Type:
	 *
	 * {Objeto}
	 *
	 * Default:
	 *
	 * ""
	 */
	//TODO implementar a funcionalidade de agrupamento
	grupoLayers : "",
	/**
	 * Propriedade: guardaExtensao
	 *
	 * Indica se a extensao geografica do mapa sera armazenada como um cookie
	 *
	 * Se for true a extensao geografica e armazenada sempre que o evento de navegacoa no mapa for disparado
	 *
	 * Tipo:
	 *
	 * {boolean}
	 *
	 * Default:
	 *
	 * {true}
	 */
	guardaExtensao : true,
	/**
	 * Propriedade: tipoimagem
	 *
	 * Indica o tipo de filtro de imagem que est&aacute; ativo. O filtro ativo &eacute; aplicado sobre a imagem toda a vez que o mapa
	 * &eacute; refeito.
	 *
	 * Veja <classe_imagem.php> para obter os tipos poss&iacute;veis
	 *
	 * Tipo:
	 *
	 * {string}
	 *
	 * Default:
	 *
	 * "nenhum"
	 */
	tipoimagem : "nenhum",
	/**
	 * Propriedade: alturatip
	 *
	 * Altura em pixel do tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
	 * estaciona o mouse sobre o mapa
	 *
	 * Tipo:
	 *
	 * {string}
	 *
	 * Default:
	 *
	 * 200px
	 */
	alturatip : "100px",
	/**
	 * Propriedade: larguratip
	 *
	 * Largura em pixel do tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
	 * estaciona o mouse sobre o mapa
	 *
	 * Tipo:
	 *
	 * {string}
	 *
	 * Default:
	 *
	 * 200px
	 */
	larguratip : "200px",
	/**
	 * Propriedade: mashuppar
	 *
	 * Define os par&acirc;metros que devem ser aplicados no modo mashup
	 *
	 * O modo mashup possibilita que o i3Geo seja embutido dentro de uma p&aacute;gina HTML. Nesse caso, o mapa n&atilde;o &eacute;
	 * criado no modo convencional, que utiliza o programa i3geo/ms_criamapa.php A variavel mashuppar deve conter os par&acirc;metros
	 * que s&atilde;o utilizados pelo programa ms_criamapa
	 *
	 * Exemplo:
	 *
	 * i3GEO.configura.mashuppar = "&pontos=-54 -12&temasa=biomas&layers=biomas"
	 *
	 * Tipo:
	 *
	 * string
	 *
	 * Default:
	 *
	 * ""
	 */
	mashuppar : "",
	/**
	 * C&oacute;digo da se&ccedil;&atilde;o aberta pelo i3Geo no servidor.
	 *
	 * O c&oacute;digo &eacute; gerado na inicializa&ccedil;&atilde;o do i3Geo pelo programa ms_criamapa.php
	 *
	 * Tipo:
	 *
	 * {String}
	 */
	sid : "",
	/**
	 * Localiza&ccedil;&atilde;o da instala&ccedil;&atilde;o do i3geo (URI)
	 *
	 * Por default, &eacute; definida na inicializa&ccedil;&atilde;o do i3Geo
	 *
	 * Tipo:
	 *
	 * {string}
	 */
	locaplic : ""
};
