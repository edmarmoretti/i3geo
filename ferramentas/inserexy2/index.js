if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.inserexy2 = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOinserexy2Container",
	    "namespace": "inserexy2"
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    p.mustache = r1;
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    i3GEO.eventos.cliquePerm.ativa();
	    i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.inserexy2.adiciona('xx yy')");
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });

	    i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.inserexy2.adiciona('xx yy')"]);
	    i3GEO.eventos.cliquePerm.desativa();

	    i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia1","i3GEOinserexy2guia");
	    //eventos das guias
	    $i("i3GEOinserexy2guia0").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia0","i3GEOinserexy2guia");
	    };
	    $i("i3GEOinserexy2guia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia1","i3GEOinserexy2guia");
	    };
	    $i("i3GEOinserexy2guia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia2","i3GEOinserexy2guia");
	    };
	    $i("i3GEOinserexy2guia3").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia3","i3GEOinserexy2guia");
	    };
	    $i("i3GEOinserexy2guia4").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia4","i3GEOinserexy2guia");
	    };
	    $i("i3GEOinserexy2guia5").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia5","i3GEOinserexy2guia");
	    };
	    $i("i3GEOinserexy2guia6").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexy2guia6","i3GEOinserexy2guia");
	    };
	    i3GEOF.inserexy2.montaComboLocal();
	    i3GEO.util.comboEpsg("i3GEOinserexy2epsg","i3GEOinserexy2listaepsg");


	},
	montaComboLocal: function(sel,titulo){
	    i3GEO.util.comboTemas(
		    "i3GEOinserexy2temasLocais",
		    function(combo){
			var c = combo._select + combo._option;
			if(sel != undefined){
			    c += "<option value='" + sel +"'>" + titulo  + "</option></select><b class='caret careti'></b>";
			    $i("i3GEOinserexy2shapefile").innerHTML = c;
			} else {
			    $i("i3GEOinserexy2shapefile").innerHTML = combo.dados;
			}
			if ($i("i3GEOinserexy2temasLocais")){
			    if(sel){
				$i("i3GEOinserexy2temasLocais").value = sel;
				i3GEOF.inserexy2.listaItens();
				i3GEOF.inserexy2.listaPontos();
			    }
			    $i("i3GEOinserexy2temasLocais").onchange = function(){
				i3GEOF.inserexy2.listaItens();
				i3GEOF.inserexy2.listaPontos();
			    };
			}
		    },
		    "i3GEOinserexy2shapefile",
		    "",
		    false,
		    "locais",
		    "",
		    false,
		    true,
		    "form-control"
	    );
	},
	get: function({snackbar = true, btn = false, par = {}, refresh = false, fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    par.tema = $i("i3GEOinserexy2temasLocais").value;
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + p.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			if(snackbar){
			    i3GEO.janela.snackBar({content: $trad('feito')});
			}
			if(refresh){
			    i3GEO.mapa.refresh();
			    i3GEOF.inserexy2.montaComboLocal();			}
			if(fn){
			    fn(data);
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	criatemaeditavel: function(btn){
	    var funcaoOK = function(data){
		i3GEOF.inserexy2.get({
		    snackbar: false,
		    fn: function(retorno){
			i3GEO.mapa.refresh();
			i3GEOF.inserexy2.montaComboLocal(retorno,$i("i3GEOjanelaprompt").value);
		    },
		    btn: btn,
		    par: {
			funcao: "criashpvazio",
			tituloTema: $i("i3GEOjanelaprompt").value
		    },
		    refresh: false
		});

	    };
	    i3GEO.janela.prompt($trad('tituloNovoTema',i3GEOF.inserexy2.dicionario),funcaoOK,$trad('pontosInseridos',i3GEOF.inserexy2.dicionario)+parseInt((Math.random() * 100),10));
	},
	listaItens: function(){
	    i3GEO.util.comboItens(
		    "i3GEOinserexy2Item",
		    $i("i3GEOinserexy2temasLocais").value,
		    function(retorno){
			$i("i3GEOinserexy2shapefileitem").innerHTML = retorno.dados;
			$i("i3GEOinserexy2opcitens").style.display = "block";
		    },
		    "i3GEOinserexy2shapefileitem",
		    "display:block",
		    "",
		    "",
		    "form-control"
	    );
	},
	adiciona: function(xy){
	    var temp,
	    n,
	    i,
	    xyn;

	    xyn = xy.split(" ");
	    n = xyn.length;
	    temp = "";
	    for(i=0;i<n;i = i + 2){
		temp += "<div class='pontosInseridos' style='font-size:12px' >" + xyn[i]+" "+xyn[i+1] + "</div><br>";
	    }
	    $i("i3GEOinserexy2guia6objCoord").innerHTML += temp;
	    i3GEOF.inserexy2.get({
		snackbar: false,
		fn: function(retorno){
		    i3GEO.Interface.atualizaTema("",$i("i3GEOinserexy2temasLocais").value);
		},
		btn: false,
		par: {
		    funcao: "insereSHP",
		    tema: $i("i3GEOinserexy2temasLocais").value,
		    item: $i("i3GEOinserexy2Item").value,
		    valoritem: $i("i3GEOinserexy2valorItem").value,
		    projecao: i3GEOF.inserexy2.pegaProjecao(),
		    xy: xy
		},
		refresh: false
	    });
	},
	listaPontos: function(){
	    i3GEOF.inserexy2.get({
		snackbar: true,
		fn: function(data){
		    var ins = [],i;
		    if (data != undefined){
			for (i=0;i<data.length; i++){
			    ins.push("<div class='pontosInseridos' style='font-size:12px'>"+data[i].x+" "+data[i].y+"</div><br>");
			}
			$i("i3GEOinserexy2guia6objCoord").innerHTML = ins.join("");
		    }
		    $i("i3GEOinserexy2guia6objCoord").innerHTML = ins.join("");
		},
		btn: false,
		par: {
		    funcao: "listaPontosShape",
		    tema: $i("i3GEOinserexy2temasLocais").value
		},
		refresh: false
	    });
	},
	inserirdd: function(){
	    try{
		var regv,xgv,xmv,xsv,direcao,divs,x,y,xy;
		regv = new RegExp(",", "g");
		xgv = $i("i3GEOinserexy2xgdd").value;
		xmv = $i("i3GEOinserexy2xmdd").value;
		xsv = $i("i3GEOinserexy2xsdd").value;
		xsv = xsv.replace(regv,".");
		direcao = i3GEO.calculo.dms2dd(xgv,xmv,xsv);
		//pega o &uacute;ltimo ponto
		divs = $i("i3GEOinserexy2guia6objCoord").getElementsByClassName("i3GEOinserexy2guia6obj");
		divs = divs[divs.length - 1];
		divs = divs.innerHTML.split(" ");
		x = divs[0];
		y = divs[1];
		xy = i3GEO.calculo.destinoDD(x,y,$i("i3GEOinserexy2distdd").value,direcao);
		i3GEOF.inserexy2.adiciona(xy[0]+" "+xy[1]);
	    }catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	inserir: function(){
	    try{
		var reg = new RegExp("w|W|l|L|o|O|'|G|r", "g"),
		regv = new RegExp(",", "g"),
		v,xgv = 0,xmv = 0,xsv = 0,vv,ygv = 0,ymv = 0,ysv = 0,x,y;
		if($i("i3GEOinserexy2tipodigcampo").checked){
		    if (!$i("i3GEOinserexy2longitude").value == ""){
			v = $i("i3GEOinserexy2longitude").value + " 0" + " 0";
			v = v.replace(reg,"");
			v = v.replace(regv,".");
			v = v.split(" ");
			xgv = v[0];
			xmv = v[1];
			xsv = v[2];
			xsv = xsv.replace(",",".");
		    }
		    if (!$i("i3GEOinserexy2latitude").value == ""){
			vv = $i("i3GEOinserexy2latitude").value  + " 0" + " 0";
			vv = vv.replace(reg,"");
			vv = vv.replace(regv,".");
			vv = vv.split(" ");
			ygv = vv[0];
			ymv = vv[1];
			ysv = vv[2];
			ysv = ysv.replace(regv,".");
		    }
		}
		if($i("i3GEOinserexy2tipodigmascara").checked){
		    xgv = $i("i3GEOinserexy2xg").value;
		    xmv = $i("i3GEOinserexy2xm").value;
		    xsv = $i("i3GEOinserexy2xs").value;
		    xsv = xsv.replace(regv,".");
		    ygv = $i("i3GEOinserexy2yg").value;
		    ymv = $i("i3GEOinserexy2ym").value;
		    ysv = $i("i3GEOinserexy2ys").value;
		    ysv = ysv.replace(regv,".");
		}
		x = i3GEO.calculo.dms2dd(xgv,xmv,xsv);
		y = i3GEO.calculo.dms2dd(ygv,ymv,ysv);
		i3GEOF.inserexy2.adiciona(x+" "+y);
	    }
	    catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	colar: function(){
	    var regv = new RegExp(",", "g"),
	    valores = $i("i3GEOinserexy2colar").value;
	    valores = valores.replace(regv,".");
	    i3GEOF.inserexy2.adiciona(valores);
	},
	escolhedig: function(q){
	    if(q === 0){
		q = "i3GEOinserexy2digmascara";
	    }
	    else{
		q = "i3GEOinserexy2digcampo";
	    }
	    $i("i3GEOinserexy2digmascara").style.display="none";
	    $i("i3GEOinserexy2digcampo").style.display="none";
	    $i(q).style.display="block";
	},
	pegaProjecao: function(){
	    return($i("i3GEOinserexy2epsg").value);
	},
	criaLin: function(btn){
	    i3GEOF.inserexy2.get({
		snackbar: true,
		fn: function(data){
		    i3GEO.mapa.refresh();
		},
		btn: btn,
		par: {
		    funcao: "sphPT2shp",
		    tema: $i("i3GEOinserexy2temasLocais").value,
		    ext: i3GEO.parametros.mapexten,
		    para: "linha"
		},
		refresh: false
	    });
	},
	criaPol: function(btn){
	    i3GEOF.inserexy2.get({
		snackbar: true,
		fn: function(data){
		    i3GEO.mapa.refresh();
		},
		btn: btn,
		par: {
		    funcao: "sphPT2shp",
		    tema: $i("i3GEOinserexy2temasLocais").value,
		    ext: i3GEO.parametros.mapexten,
		    para: "poligono"
		},
		refresh: false
	    });
	},
	wkt: function(btn){
	    var divs = $i("i3GEOinserexy2guia6objCoord").getElementsByClassName("pontosInseridos"),
	    n = divs.length,
	    xy = [],
	    i;
	    for (i=0;i<n;i++){
		xy.push(divs[i].innerHTML);
	    }
	    xy = xy.join(" ");
	    i3GEOF.inserexy2.get({
		snackbar: false,
		fn: function(data){
		    if (data !== undefined){
			var ins = "<textarea class='form-control input-lg' style=height:80px >"+data[0]+"</textarea><br>";
			ins += "<textarea class='form-control input-lg' style=height:80px >"+data[1]+"</textarea><br>";
			ins += "<textarea class='form-control input-lg' style=height:80px >"+data[2]+"</textarea><br>";
			i3GEO.janela.closeMsg(ins);
		    }
		},
		btn: btn,
		par: {
		    funcao: "mostrawkt",
		    xy: xy
		},
		refresh: false
	    });
	}
};
