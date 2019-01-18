if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
/*
Classe: i3GEOF.vinde
 */
i3GEOF.vinde = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	 */
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.vinde.dicionario);
	    return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	arvore {YAHOO.widget.TreeView} (opcional) arvore onde o no da inde sera criado
	 */
	inicia: function(iddiv,arvore){
	    if(i3GEOF.vinde.MUSTACHE == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/vinde/template_mst.html", function(template) {
		    i3GEOF.vinde.MUSTACHE = template;
		    i3GEOF.vinde.inicia(iddiv);
		});
		return;
	    }
	    if($i("i3GEOF.vinde_imagemCabecalho")){
		i3GEOF.vinde.aguarde.visibility = "visible";
	    }
	    var p = i3GEO.configura.locaplic+"/ferramentas/vinde/wmsindejson.php",
	    funcao = function(retorno){
		try{
		    if(iddiv && iddiv != ""){
			$i(iddiv).innerHTML = i3GEOF.vinde.html();
		    }
		    if($i("i3GEOF.vinde_imagemCabecalho")){
			i3GEOF.vinde.aguarde.visibility = "hidden";
		    }
		    i3GEOF.vinde.arvore(retorno,arvore);
		}
		catch(e){
		    if(typeof(console) !== 'undefined'){console.info("Erro ao acessar a INDE");}
		}
	    };
	    i3GEO.util.ajaxGet(p,funcao);
	},
	arvore: function(dados,arvore){
	    var root,tempNode,d,criaNo;
	    if(arvore == undefined ){
		arvore = new YAHOO.widget.TreeView($i("i3GEOFvindeArvore"));
	    }
	    root = arvore.getRoot();
	    try{
		tempNode = new YAHOO.widget.TextNode('', root, false);
		tempNode.isLeaf = false;
		tempNode.className = "i3GeoFolder";
		tempNode.enableHighlight = true;
	    }
	    catch(e){
		if(typeof(console) !== 'undefined'){console.error(e);}
	    }
	    titulo = "<table><tr><td>INDE-Br</td><td></td></tr></table>";
	    d = {html:titulo};
	    tempNode = new YAHOO.widget.HTMLNode(d, root, true,true);
	    tempNode.enableHighlight = true;
	    criaNo = function(obj,noDestino){
		var chaves,i,n,texto,layer,temp, epsg = 'EPSG:4326';
		if(!YAHOO.lang.isString(obj)){
		    if(YAHOO.lang.isArray(obj)){
			chaves = obj;
		    }
		    else{
			chaves = i3GEO.util.listaChaves(obj);
		    }
		    n = chaves.length;
		    for (i=0;i<n;i++){
			if(YAHOO.lang.isString(obj[chaves[i]])){
			    texto = obj[chaves[i]];
			}
			else{
			    texto = chaves[i];
			}
			temp = texto.split("#");
			layer = dados.layers[temp[1]];
			if(layer){
			    layer = layer[1];
			    texto = i3GEO.arvoreDeTemas.montaTextoTemaWMS(
				    layer.url,
				    layer.layers,
				    '',
				    temp[0],
				    epsg,
				    "text/plain",
				    '1.1.1',
				    layer.format,
				    'black',
				    layer.metadataURL
			    );
			    //i3GEO.arvoreDeTemas.TIPOBOTAO = tipo;
			}
			temaNode = new YAHOO.widget.HTMLNode({html:texto}, noDestino, false,true);
			temaNode.enableHighlight = false;
			if(obj[chaves[i]] != undefined){
			    criaNo(obj[chaves[i]],temaNode);
			}
		    }
		}
	    };
	    criaNo(dados.arvore,tempNode);
	    //adiciona um no para expandir o espaco onde fica a arvore
	    titulo = " ";
	    d = {html:titulo};
	    tempNode = new YAHOO.widget.HTMLNode(d, root, true,true);

	    if(arvore){
		tempNode.collapseAll();
		arvore.draw();
		return arvore;
	    }
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	 */
	html: function() {
	    var ins = Mustache.render(i3GEOF.vinde.MUSTACHE, i3GEOF.vinde.mustacheHash());
	    return ins;
	}
};
