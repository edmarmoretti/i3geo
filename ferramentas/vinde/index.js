//['2013 - Agricultura Irrigada', 'http://www.geoservicos.inde.gov.br/geoserver/wms', {layers: 'MPOG:Agricultura_Irrigada', format: 'image/png', transparent: true}, {isBaseLayer: false, visibility: false, group: 'PPA/Anexo III/2013 - Agricultura Irrigada', metadataURL: 'http://www.metadados.inde.gov.br/geonetwork/srv/br/metadata.show.embedded?uuid=045663f7-5691-447a-8d06-ab692522328c', legendURL: 'http://www.geoservicos.inde.gov.br/geoserver/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=MPOG:Agricultura_Irrigada&format=image/png',kmlURL: 'http://www.geoservicos.inde.gov.br/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=MPOG:Agricultura_Irrigada&width=1024&height=768&bbox=-74,-34,-29,6&format=application/vnd.google-earth.kmz+xml',sldtema: '','maxExtent': new OpenLayers.Bounds(-55.389,-22.229,-37.808,-2.922), isBaseGroup: false, displayInLayerSwitcher: false, removable: false, groupOfKeeper: 'MP/2013 - Agricultura Irrigada', groupOfTheme: 'PPA/Anexo III/2013 - Agricultura Irrigada'],

/*
Title: Vinde

Mostra uma arvore de servicos WMS existentes na INDE

Veja:

<i3GEO.tema.dialogo.vinde>

Arquivo:

i3geo/ferramentas/vinde/index.js

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
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro:

	tema {string} - codigo do tema

	mx {numero} - (opcional) posi&ccedil;&atilde;o em x para onde a janela ser&aacute; movida ap&oacute;s ser criada

	my {numero} - (opcional) posi&ccedil;&atilde;o em y para onde a janela ser&aacute; movida ap&oacute;s ser criada
	*/
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.vinde")){
			i3GEOF.vinde.inicia("i3GEOF.vinde_corpo");
			return;
		}
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.vinde",200);
		};
		var janela,divid,titulo;
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad('indeBrasil',i3GEOF.vinde.dicionario)+"</span></div>";
		janela = i3GEO.janela.cria(
			"300px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.vinde",
			false,
			"hd",
			"",
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"114"
		);
		divid = janela[2].id;
		i3GEOF.vinde.janela = janela[0];
		$i("i3GEOF.vinde_corpo").style.backgroundColor = "white";
		$i("i3GEOF.vinde_corpo").style.textAlign = "left";
		i3GEOF.vinde.aguarde = $i("i3GEOF.vinde_imagemCabecalho").style;
		i3GEOF.vinde.inicia(divid);
	}
};
