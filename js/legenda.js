if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.legenda =
{
	/**
	 * Armazena os ids definido na criacao da legenda
	 */
	IDS : [],
	//utilizado para comparar as camadas e ver se e necessario atualizar a legenda
	CAMADAS : "",
	//utilizado para guardar o objeto imagem que foi clicado para alterar a cor
	objImg: "",
	config: {
	    "idLegenda": "legendaHtml",
	    "templateLegenda": "templates/legenda.html",
	    "janela": false
	},
	carregaTemplates: function(){
	    $.get(i3GEO.legenda.config.templateLegenda, function(template) {
		i3GEO.template.legenda = template;
		i3GEO.legenda.inicia();
	    });
	},
	inicia : function(config) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.legenda.inicia()");

	    if(config){
		$.each( config, function( i,v ) {
		    i3GEO.legenda.config[i] = v;
		});
	    }
	    if(!i3GEO.template.legenda){
		i3GEO.legenda.carregaTemplates();
		return;
	    } else {
		config = i3GEO.legenda.config;
		if (!$i(config.idLegenda)) {
		    return;
		}
		i3GEO.eventos.adicionaEventos("NAVEGAMAPA", ["i3GEO.legenda.atualiza()"]);
		i3GEO.legenda.registra(config.idLegenda);
		i3GEO.legenda.atualiza();
	    }
	},
	registra : function(idleg){
	    if($i(idleg) && i3GEO.legenda.IDS.indexOf(idleg) == -1){
		i3GEO.legenda.IDS.push(idleg);
	    }
	},
	off : function(idleg){
	    i3GEO.legenda.IDS.remove(idleg);
	},
	/**
	 * Function: atualiza
	 *
	 * Atualiza o elemento HTML do mapa utilizado para mostrar a legenda
	 */
	atualiza : function({force = false}={}) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.legenda.atualiza()");

	    if(force == true){
	        i3GEO.legenda.CAMADAS = [];
	    }
	    //a legenda nao foi inicializada ainda
	    if(i3GEO.template.legenda == undefined){
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.template.legenda undefined");

		return;
	    }
	    var temp, i, tamanho, atualiza = false;
	    if (force == false && i3GEO.arvoreDeCamadas.comparaTemas(i3GEO.legenda.CAMADAS, i3GEO.arvoreDeCamadas.CAMADAS)) {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.legenda.atualiza() nao precisa atualizar");

		return;
	    }
	    //podem existir mais de um lugar para inserir a legenda
	    temp = function(retorno){
		$.each(i3GEO.legenda.IDS, function( index, value ) {
		    i3GEO.legenda.montaLegenda(retorno,value);
		});
	    };
	    //verifica se tem algo pra atualizar
	    tamanho = [35,25];
	    $.each(i3GEO.legenda.IDS, function( index, value ) {
		i = $i(value);
		if (i && i.style.display !== "none") {
		    atualiza = true;
		    try{
			tamanho = $("#" + value).attr("data-size").split(",");
		    } catch (e){};
		    i.innerHTML = $trad("o1");
		} else {
		    i.innerHTML = "";
		}
	    });
	    if (atualiza == true) {
		i3GEO.legenda.CAMADAS = i3GEO.util.cloneObj(i3GEO.arvoreDeCamadas.CAMADAS);
		i3GEO.legenda.getLegendParameters(tamanho[0], tamanho[1],temp);
	    }
	},
	getLegendParameters : function(w, h, after){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.legenda.getLegendParameters");

	    i3GEO.request.get({
		snackbar: false,
		snackbarmsg: false,
		btn: false,
		par: {
		    w : w,
		    h : h
		},
		prog: "/mapserverapi/map/" + i3GEO.configura.sid + "/getLegendParameters",
		fn: function(data){
		    if (after){
			after.call(after, data);
		    }
		}
	    });
	},
	montaLegenda : function(retorno,idOndeLegenda){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.legenda.montaLegenda()");

	    if(retorno.data){
		retorno = retorno.data;
	    }
	    var legenda = "",
	    t,idleg, template;

	    if(!idOndeLegenda){
		idleg = $i(i3GEO.legenda.config.idLegenda);
	    } else {
		idleg = $i(idOndeLegenda);
	    }
	    if (retorno.legenda != "") {
		$.each(retorno.legenda, function( index, value ) {
		    if(value.tipo == "imagem"){
			value.classes[0].checkbox = "hidden";
		    }
		    //altera a legenda quando for uma classe unica
		    if(!value.classes[1] && value.tipo != "imagem"){
			value.hiddenTitle = "hidden";
			value.classes[0].nome = value.nome;
			if(i3geoOL.getLayersByName(value.layer)[0].getVisible() == true){
			    value.classes[0].checked = "checked";
			} else {
			    value.classes[0].checked = "";
			}

		    }
		});
		$(".legendaTemaSolto").remove();
		t = Mustache.to_html(
			"{{#data}}" + i3GEO.template.legenda + "{{/data}}",
			{
			    "data":retorno.legenda,
			    "altera": $trad("p9")
			}
		);
		idleg.innerHTML = t;

		$("#" + i3GEO.legenda.config.idLegenda).find(".draggable").draggable({
		    delay: 800,
		    helper: "clone",
		    appendTo: "body",
		    start: function(event, ui) {
			$(this).hide();
		    },
		    stop: function(event, ui) {
			$(this).css({"position":"absolute","top":(event.clientY - event.offsetY),"left": (event.clientX - event.offsetX)});
			$(this).addClass("legendaTemaSolto");
			$("body").append($(this));
			$(this).show();
		    }
		});
		$("#" + i3GEO.legenda.config.idLegenda + " img").bind('click',function (e) {
		    e.stopPropagation();
		},false);
	    } else {
		idleg.innerHTML = "";
	    }
	},
	ativaDesativaTema : function(inputbox) {
	    console.error("Removido na versao 8");
	},
	/**
	 * Liga ou desliga uma classe da legenda.
	 *
	 * A chamada dessa fun&ccedil;&atilde;o &eacute; definida em aplicmap/legenda2.htm
	 *
	 * Parametro:
	 *
	 * {Object input} - objeto do tipo INPUT com o id da classe e o id do tema
	 */
	inverteStatusClasse : function(leg) {
	    var inverte = function(tema, classe, after){
	        i3GEO.request.get({
	            snackbar: false,
	            snackbarmsg: false,
	            btn: false,
	            par: {
                        classIds: classe
                    },
	            prog: "/mapserverapi/layer/" + i3GEO.configura.sid + "/" + tema + "/toggleStatusClass",
	            fn: function(data){
	                if (after){
	                    after.call(after, data);
	                } else {
	                    i3GEO.Interface.atualizaTema(data, leg.name);
	                }
	            }
	        });
	    };
	    //verifica se tem apenas uma classe para desligar a camada e nao a classe
	    if(i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[leg.name].numclasses == 1){
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.legenda.inverteStatusClasse() altera layer");
	
			var chkb = i3GEO.arvoreDeCamadas.capturaCheckBox(leg.name);
			if(chkb){
			    i3geoOL.getLayersByName(leg.name)[0].setVisibility(leg.checked);
			} else {
			    inverte(leg.name, leg.value);
			}
		 } else {
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.legenda.inverteStatusClasse() altera classe");
	
			inverte(leg.name, leg.value);
	     }
	},
	mudaCorClasse : function(tema,idclasse,objImg) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.legenda.mudaCorClasse() cria um input hidden com id=tempinputcorclasse e abre o colorpicker");

	    var obj, novoel;
	    i3GEO.legenda.objImg = objImg;
	    if (!$i("tempinputcorclasse")) {
		novoel = document.createElement("input");
		novoel.id = "tempinputcorclasse";

		novoel.type = "hidden";
		novoel.onchange = function() {
		    var obj = $("#tempinputcorclasse");
		    i3GEO.tema.alteracorclasse(false,obj.attr("tema"), obj.attr("idclasse"), obj.val(),i3GEO.legenda.objImg);
		};
		document.body.appendChild(novoel);
	    }
	    $("#tempinputcorclasse").attr({"tema":tema,"idclasse":idclasse});
	    i3GEO.util.abreCor("", "tempinputcorclasse");
	}
};
