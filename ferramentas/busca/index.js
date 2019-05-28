if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.busca = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEObuscaContainer",
	    "namespace": "busca",
	    "nbuscas": 0
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    p.tema = tema;
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
	    //nao use this aqui
	    //i3GEOF.busca._parameters.mustache = "";
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
	    i3GEO.guias.mostraGuiaFerramenta("i3GEObuscaguia1","i3GEObuscaguia");
	    $i("i3GEObuscaguia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEObuscaguia1","i3GEObuscaguia");
	    };
	    $i("i3GEObuscaguia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEObuscaguia2","i3GEObuscaguia");
	    };
	    $i("i3GEObuscaguia3").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEObuscaguia3","i3GEObuscaguia");
	    };
	    i3GEO.tema.itens(
		    i3GEOF.busca.montaListaItens,
		    p.tema
	    );
	},
	montaListaItens: function(data){
	    var ins = "",
	    hash = [],
	    i,
	    n;
	    n = data.valores.length;
	    for (i=0;i<n; i++){
		hash.push({
		    label: data.valores[i].item,
		    value: data.valores[i].item,
		    name: data.valores[i].item
		});
	    }
	    var template = '<div class="form-group">' + i3GEO.template.checkbox + '</div>';
	    ins = Mustache.to_html(
		    "{{#data}}" + template + "{{/data}}",
		    {"data":hash});


	    $i("i3GEObuscalistai").innerHTML = ins;
	},
	get: function({snackbar = true, par = {}, prog = "exec", fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    par.g_sid = i3GEO.configura.sid;
	    par.tema = p.tema;
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/" + prog + ".php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(fn){
			    fn(data);
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
	procurar: function(){
	    var inputs = $i("i3GEObuscalistai").getElementsByTagName("input"),
	    n = inputs.length,
	    listai = [],
	    i,
	    tipo = "exata",
	    onde = "mapa",
	    palavra = $i("i3GEObuscapalavra").value;
	    for (i=0;i<n; i++){
		if (inputs[i].checked === true){
		    //e necessario concatenar o nome do tema, uma vez que a funcao de busca usa multiplos layers
		    listai.push(inputs[i].name + "," + i3GEOF.busca._parameters.tema);
		}
	    }
	    if (listai.length === 0){
		i3GEO.janela.snackBar({content: $trad('selecionaItem',i3GEOF.busca.dicionario)});
	    }
	    else{
		if ($i("i3GEObuscapalavra").value === ""){
		    i3GEO.janela.snackBar({content: "Digite uma palavra"});
		}
		else{
		    if ($i("i3GEObuscaqualquer").checked === true){
			tipo = "qualquer";
		    }
		    if ($i("i3GEObuscaregiao").checked === true){
			onde = "regiao";
		    }
		    palavra = i3GEO.util.removeAcentos(palavra);
		    i3GEOF.busca.get({
			par: {
			    funcao: "listavaloresitens",
			    palavra: palavra,
			    lista: listai.join("|"),
			    tipo: tipo,
			    onde: onde,
			    ext: i3GEO.parametros.mapexten
			},
			fn: i3GEOF.busca.mostraBusca
		    });
		}
	    }
	},
	mostraBusca: function(data){
	    var palavra = $i("i3GEObuscapalavra").value,
	    naoEncontrado = true,
	    ins = [],
	    linhas,
	    nlinhas,
	    linha,
	    nlinha,
	    valores,
	    x,
	    y,
	    i,
	    er,
	    tr,
	    tema;

	    i3GEOF.busca.nbuscas++;
	    if (data !== undefined)
	    {
		nlinhas = data.length;
		for (tema=0;tema<nlinhas; tema++){
		    linhas = data[tema].resultado;
		    nlinha = linhas.length;
		    for (linha=0;linha<nlinha; linha++){
			valores = (linhas[linha].box).split(" ");
			x = (valores[0] * 1) + ((((valores[0] * -1) - (valores[2] * -1)) / 2) * 1);
			y = (valores[1] * 1) + ((((valores[1] * -1) - (valores[3] * -1)) / 2) * 1);

			ins.push("<button title='zoom' onclick='i3GEO.navega.zoomExt(\"\",\"\",\"\",\""+linhas[linha].box+"\")' class='btn btn-xs' ><span class='material-icons'>gps_fixed</span></button>");
			ins.push("<button title='pin' onclick='i3GEO.navega.zoomponto(\"\",\"\","+x+","+y+")'' class='btn btn-xs' ><span class='material-icons'>room</span></button>");
			for (i=0;i<linhas[linha].valores.length; i++){
			    er = new RegExp(palavra, "gi");
			    tr = (linhas[linha].valores[i].valor).replace(er,"<span style=color:red;text-align:left >"+palavra+"</span>");
			    ins.push(linhas[linha].valores[i].item + " : " + tr );
			    ins.push("<hr>");
			    naoEncontrado = false;
			}
		    }
		}
		if(naoEncontrado == true){
		    i3GEO.janela.snackBar({content: $trad('semRegistro',i3GEOF.busca.dicionario)});
		} else {
		    i3GEO.guias.mostraGuiaFerramenta("i3GEObuscaguia2","i3GEObuscaguia");
		    $i("i3GEObuscaguia2obj").innerHTML =" <div class='container-fluid'>"+ins.join("")+"</div></div>";
		}
	    }
	    else{
		i3GEO.janela.snackBar({content: $trad('erro',i3GEOF.busca.dicionario)});
	    }
	}
};
