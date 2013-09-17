/*
Title: Editor vetorial de limites de regi&otilde;es do sistema METAESTAT

Utilizado em i3geo/metaestat/editorlimites.php

Utiliza a API do Google Maps e pacotes/wicket/wicket.js (que cria o objeto Wkt com funcoes para processamento de Wkt)

Arquivo:

i3geo/ferramentas/metaestat/editorlimites.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Esse programa utiliza parcialmente os codigos da aplicacao calculadora de carbono desenvolvido pelo
IPAM - Instituto de Pesquisa Ambiental da Amazonia

Este programa e software livre; voce pode redistribui-lo
e/ou modifica-lo sob os termos da Licenca Publica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa e distribuido na expectativa de que seja util,
porem, SEM NENHUMA GARANTIA; nem mesmo a garantia implicita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPECIFICA.
Consulte a Licenca Publica Geral do GNU para mais detalhes.
Voce deve ter recebido uma copia da Licenca Publica Geral do
GNU junto com este programa; se nao, escreva para a
Free Software Foundation, Inc., no endereco
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.editorlimites

Fun&ccedil;&otilde;es de edi&ccedil;&atilde;o vetorial utilizadas pelo editor de regi&otilde;es do sistema METAESTAT
 */
i3GEOF.editorlimites = {
	/**
	 * Objeto DOM com a imagem de aguarde existente no cabecalho da janela
	 *
	*/
	aguarde: "",
	/**
	 * Guarda o Id do DIV que recebera o conteudo HTML do editor
	 */
	iddiv: "",
	/**
	 * Objeto criado com new google.maps.drawing.DrawingManager
	 */
	drawingManager: "",
	selectedShape: null,
	/**
	 * Array que guarda todos os objetos que estao atualmente no mapa
	 * E atualizado toda vez que uma figura e acrescentada ou removida
	 */
	shapes: [],
	/**
	 * guarda o mapeamento entre o codigo da regiao e o codigo do layer adicionado ao mapa
	 */
	regioestemas:{},
	/**
	 * Guarda o mapeamento entre o codigo da regiao e o codigo do layer adicionado ao mapa
	 */
	temasregioes:{},
	/**
	 * Guarda os dados descritivos sobre cada regiao obtidos na formacao no combo de escolha de regioes
	 */
	descregioes:[],
	/**
	 * Inicia o editor
	 *
	 * Cria o objeto da API do Google Maps com new google.maps.drawing.DrawingManager
	 * A janela flutuante que recebera os componentes do editor ja deve estar aberta (veja editorlimites.php)
	 * Executa i3GEOF.editorlimites.html
	 *
	 * @param Id do DIV que recebera o conteudo HTML do editor
	*/
	inicia: function(iddiv){
		var i,n,ics;
		//mensagem
		i3GEO.janela.tempoMsg("Aten&ccedil;&atilde;o: apenas tabelas no esquema i3geo_metaestat podem ser editadas.");
		i3GEOF.editorlimites.iddiv = iddiv;
		$i(iddiv).innerHTML = i3GEOF.editorlimites.html();
		ics = $i(iddiv).getElementsByTagName("button");
		n = ics.length;
		i3GEO.barraDeBotoes.ativaBotoes();
		i3GEOF.editorlimites.comboRegiaoEditavel();
		for(i=0;i<n;i++){
			ics[i].style.backgroundColor = "white";
			ics[i].className = "iconeGuiaMovel";
			ics[i].onmouseout = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOut";};
			ics[i].onmouseover = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOver";};
			ics[i].style.backgroundImage = "none";
			ics[i].style.height = "32px";
			ics[i].style.width = "32px";
			ics[i].style.border = "1px solid gray";
			ics[i].style.margin = "0px";
		}
		i3GEOF.editorlimites.drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: false,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [google.maps.drawing.OverlayType.POLYGON,google.maps.drawing.OverlayType.MARKER,google.maps.drawing.OverlayType.POLYLINE]
			},
			markerOptions: {
				icon: new google.maps.MarkerImage('http://www.example.com/icon.png')
			},
			polygonOptions: {
				fillColor: '#ffff00',
				fillOpacity: .5,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
				editable: true,
				tema: "",
				colunaid: "",
				valorid: "",
				colunanome: "",
				valornome: ""
			}
		});
		i3GEOF.editorlimites.drawingManager.setMap(i3GeoMap);
		i3GEOF.editorlimites.drawingManager.setDrawingMode(null);
		google.maps.event.addListener(i3GEOF.editorlimites.drawingManager, 'overlaycomplete', function(e) {
			if (e.type != google.maps.drawing.OverlayType.MARKER) {
				i3GEOF.editorlimites.drawingManager.setDrawingMode(null);
				i3GEOF.editorlimites.mudaicone();
				var newShape = e.overlay;
				newShape.type = e.type;
				newShape.tema = $i("i3geoCartoRegioesEditaveis").value;
				newShape.colunaid = "";
				newShape.valorid = "";
				newShape.colunanome = "";
				newShape.valornome = "";
				google.maps.event.addListener(newShape, 'click', function() {
					i3GEOF.editorlimites.setSelection(newShape);
				});
				i3GEOF.editorlimites.setSelection(newShape);
				i3GEOF.editorlimites.shapes.push(newShape);
			}
		});
		google.maps.event.addListener(
			i3GEOF.editorlimites.drawingManager,
			'drawingmode_changed',
			i3GEOF.editorlimites.clearSelection
		);
		google.maps.event.addListener(
			i3GeoMap,
			'click',
			i3GEOF.editorlimites.clearSelection
		);
	},
	/**
	 * Atualiza as camadas do mapa que sao oriundas do sistema METAESTAT
	 * Busca a lista de camadas com ferramentas/metaestat/analise.php?funcao=LISTACAMADASMETAESTAT
	 * Faz um loop para atualizar cada camada
	 */
	atualizaCamadasMetaestat: function(){
		var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=LISTACAMADASMETAESTAT&g_sid="+i3GEO.configura.sid,
			temp = function(retorno){
				var n = retorno.data.length,i;
				for(i=0;i<n;i++){
					i3GEO.Interface.atualizaTema("",retorno.data[i]);
				}
			};
		cpJSON.call(p,"foo",temp);
	},
	/**
	 * Monta o codigo HTML com o conteudo da ferramenta
	 * Define os botoes e demais elementos que serao preenchidos via codigo
	 * @return html
	 */
	html:function(){
		var ins = '<div style=margin-left:5px >' +
		'	<button title="Desenhar um polígono" onclick="i3GEOF.editorlimites.digitalizaPol(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/polygon-create.png" /></button>' +
		'	<button title="Capturar polígono de um tema" onclick="i3GEOF.editorlimites.capturaPoligonoTema.ativa(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/layer-import.png" /></button>' +
		'	<button title="Selecionar" onclick="i3GEOF.editorlimites.seleciona(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/select.png" /></button>' +
		'	<button title="Remove selecionado (n&atilde;o apaga)" onclick="i3GEOF.editorlimites.deleteSelectedShape()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/selected-delete.png" /></button>' +
		'	<button title="Salvar limite" onclick="i3GEOF.editorlimites.salvaLimite.inicia()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/vector-save.png" /></button>' +
		'	<button title="Editar atributos" onclick="i3GEOF.editorlimites.editarAtributos.ativa(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/annotation-form.png" /></button>' +
		'	<button title="Ajuda" onmousedown="i3GEOF.editorlimites.mudaicone()" onclick="i3GEOF.editorlimites.ajuda()" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/help-contents.png" /></button>' +
		'	<br><div id="i3geoCartoRegioesEditaveisDiv" ><img style="display:block;z-index:2" src="'+i3GEO.configura.locaplic+'/imagens/aguarde.gif" /></div></div>'; //combo para escolher a regiao
		return ins;
	},
	/**
	 * Atualiza a ferramenta quando a janela flutuante tem seu foco ativado
	 */
	ativaFoco: function(){
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEO.barraDeBotoes.ativaIcone("pan");
		i3GEOF.editorlimites.mudaicone();
		i3GEO.Interface.googlemaps.recalcPar();
	},
	/**
	 * Marca uma figura como selecionada
	 * @param objeto shape que sera marcado
	 */
	setSelection: function(shape){
		shape.setEditable(!shape.editable);
	},
	/**
	 * Marca todas as figuras como nao selecionadas
	 * As figuras existentes no mapa sao mantidas na variavel i3GEOF.editorlimites.shapes
	 */
	clearSelection: function(){
		var i,
			n = i3GEOF.editorlimites.shapes.length;
		for(i=0;i<n;i++){
			if(i3GEOF.editorlimites.shapes[i] != ""){
				i3GEOF.editorlimites.shapes[i].setEditable(false);
			}
		}
	},
	/**
	 * Remove do mapa as figuras que estiverem selecionadas
	 * @param boolean indica se deve ser feita uma confirmacao ou nao antes de apagar
	 */
	deleteSelectedShape: function(naoconfirma) {
		if(!naoconfirma){
			naoconfirma = false;
		}
		var i,
		n = i3GEOF.editorlimites.shapes.length;
		if(n > 0){
			if(naoconfirma === false){
				var x = window.confirm("Remove as figuras selecionadas?");
			}
			else{
				x = true;
			}
			if(x){
				for(i=0;i<n;i++){
					if(i3GEOF.editorlimites.shapes[i] != "" && i3GEOF.editorlimites.shapes[i].editable === true){
						i3GEOF.editorlimites.shapes[i].setMap(null);
						i3GEOF.editorlimites.shapes[i] = "";
					}
				}
			}
		}
		else{
			i3GEO.janela.tempoMsg("Selecione pelo menos uma figura");
		}
	},
	/**
	 * Lista as figuras que estao marcadas como selecionadas
	 * @return array de shapes
	 */
	selectedShapes: function() {
		var i,s = [],
		n = i3GEOF.editorlimites.shapes.length;
		for(i=0;i<n;i++){
			if(i3GEOF.editorlimites.shapes[i] != "" && i3GEOF.editorlimites.shapes[i].editable === true){
				s.push(i3GEOF.editorlimites.shapes[i]);
			}
		}
		return s;
	},
	/**
	 * Lista as coordenadas de todas as figuras existentes
	 * @return objeto contendo a indicacao do tipo de figura e o array com a lista de coordenadas
	 */
	getCoordenadas: function(){
		var coordenadas = [],
			lista = [],
			n = i3GEOF.editorlimites.shapes.length,
			tipo = "",
			ps,nps,j,p,i,r = {};

		for(i=0;i<n;i++){
			coordenadas = [];
			if(i3GEOF.editorlimites.shapes[i] != "" && i3GEOF.editorlimites.shapes[i].editable === true){
				if(tipo == ""){
					tipo = i3GEOF.editorlimites.shapes[i].type;
				}
				ps = i3GEOF.editorlimites.shapes[i].getPath();
				nps = ps.getLength();
				for(j=0;j<nps;j++){
					p = ps.getAt(j);
					coordenadas.push([p.lng()+" "+p.lat()]);
				}
				lista.push(coordenadas);
			}
		}
		r = {"tipo":tipo,"coordenadas":lista};
		return r;
	},
	/**
	 * Converte um objeto shape em uma string WKT
	 * @param shape
	 */
	toWKT: function(obj){
		var wkt = new Wkt.Wkt();
		wkt.fromObject(obj);
		return wkt.write();
	},
	/**
	 * Funcoes que controlam o processo de obtencao das coordenadas de um componente de uma camada existente no mapa
	 */
	capturaPoligonoTema:{
		/**
		 * Ativa a operaco de captura definindo o evento que sera executado no onclick do mouse sobre o mapa
		 * O evento executa i3GEOF.editorlimites.capturaPoligonoTema.captura
		 * @param botao da interface que foi pressionado
		 */
		ativa: function(botao){
			i3GEOF.editorlimites.mudaicone(botao);
			i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.editorlimites.capturaPoligonoTema.captura()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.editorlimites.capturaPoligonoTema.captura()");}
		},
		desativa: function(){
		},
		/**
		 * Realiza a captura de um componente do mapa quando o usuario faz o clique
		 * A captura e feita com classesphp/mapa_controle.php&funcao=identifica3
		 * O resultado e adicionado ao mapa como um novo objeto shape
		 */
		captura: function(){
			var temp,tema="",regiao="",p,par,
				aguarde = $i("janelaEditorLimites_imagemCabecalho");
			i3GEOF.editorlimites.mudaicone();
			if(!$i("i3geoCartoRegioesEditaveis")){
				i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.editorlimites.capturaPoligonoTema.captura()");
			}
			else{
				temp = function(retorno){
						var temp,n,i,WicketWkt,
							wkt = "",
							colunaid = i3GEOF.editorlimites.descregioes["a_"+regiao]["identificador"],
							valorid = "",
							colunanome = i3GEOF.editorlimites.descregioes["a_"+regiao]["colunanomeregiao"],
							valornome = "",
							aguarde = $i("janelaEditorLimites_imagemCabecalho");
						if(aguarde){
							aguarde.style.visibility = "hidden";
						}
						//obtem os dados buscando nos itens que vem da requisicao ao wms
						temp = retorno.data[0].resultado[0];
						n = temp.length;
						for(i=0;i<n;i++){
							if(temp[i].alias == "wkt"){
								wkt = temp[i].valor;
							}
							if(temp[i].alias == colunaid || temp[i].item == colunaid){
								valorid = temp[i].valor;
							}
							if(temp[i].alias == colunanome || temp[i].item == colunanome){
								valornome = temp[i].valor;
							}
						}
						//objeto do wicket ver pacotes/wicket
						WicketWkt = new Wkt.Wkt();
						//wkt = "MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)), ((20 35, 45 20, 30 5, 10 10, 10 30, 20 35), (30 20, 20 25, 20 15, 30 20)))";
						try { // Catch any malformed WKT strings
							WicketWkt.read(wkt);
						} catch (e1) {
							try {
								wkt.read(wkt.replace('\n', '').replace('\r', '').replace('\t', ''));
							} catch (e2) {
								if (e2.name === 'WKTError') {
									alert('Wicket could not understand the WKT string you entered. Check that you have parentheses balanced, and try removing tabs and newline characters.');
									return;
								}
							}
						}
						obj = WicketWkt.toObject(i3GeoMap.defaults);
						//obj.setMap(i3GeoMap); // Add it to the map
						//i3GEOF.editorlimites.shapes.push(obj);
						i3GEOF.editorlimites.adicionaPoligonos(obj,tema,colunaid,valorid,colunanome,valornome);
						i3GEO.eventos.MOUSECLIQUE = [];
					};
				regiao = $i("i3geoCartoRegioesEditaveis").value;
				if(regiao != ""){
					tema = i3GEOF.editorlimites.regioestemas["a"+regiao];
					if(aguarde && aguarde.style.visibility == "hidden"){
						aguarde.style.visibility = "visible";
						p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php";
						par = "funcao=identifica3&opcao=tema&xy="+objposicaocursor.ddx+","+objposicaocursor.ddy+"&resolucao=1&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten+"&listaDeTemas=&wkt=sim&tema="+tema;
						cpJSON.call(p,"identifica",temp,par);
					}
				}
			}
		}
	},
	/**
	 * Monta um combo com a lista de regioes cadastradas e que podem ser editadas pelo editor
	 * A regiao em edicao sera a escolhida nesse combo
	 * Ao ser escolhida, e adicionada uma camada no mapa
	 * @param opcional codigo da regiao no cadastro. Se nao for definido, busca todas
	 */
	comboRegiaoEditavel: function(codigo_tipo_regiao){
		if(!codigo_tipo_regiao){
			codigo_tipo_regiao = "";
		}
		var onde = $i("i3geoCartoRegioesEditaveisDiv"),
		temp = function(dados){
			var n = dados.length,
			ins = '<br><p class="paragrafo" >'+$trad(15,i3GEOF.metaestat.dicionario)+':</p>',
			i;
			ins += "<select onchange='i3GEOF.editorlimites.comboRegiaoEditavelOnchange(this)' id='i3geoCartoRegioesEditaveis' style='width:175px' ><option value=''>---</option>";
			for(i=0;i<n;i++){
				//so e possivel editar nesse esquema
				if(dados[i].esquemadb == "i3geo_metaestat"){
					ins += "<option value='"+dados[i].codigo_tipo_regiao+"'>"+dados[i].nome_tipo_regiao+"</option>";
					i3GEOF.editorlimites.descregioes["a_"+dados[i].codigo_tipo_regiao] = dados[i];
				}
			}
			ins += "</select>";
			if(onde){
				onde.innerHTML = ins;
			}
			return ins;
		};
		i3GEO.php.listaTipoRegiao(temp,codigo_tipo_regiao);
	},
	/**
	 * Funcao ativada no evento onchange do combo criado com comboRegiaoEditavel
	 * Executa i3GEO.php.mapfileTipoRegiao
	 */
	comboRegiaoEditavelOnchange: function(combo){
		if(combo.value === ""){
			return;
		}
		i3GEOF.editorlimites.editarAtributos.desativa();
		var temp = function(retorno){
			if(i3GEO.arvoreDeCamadas.pegaTema(retorno.layer) == ""){
				i3GEO.php.adtema(i3GEO.atualiza,retorno.mapfile);
				//guarda o codigo e relaciona com a regiao
				i3GEOF.editorlimites.regioestemas["a"+$i("i3geoCartoRegioesEditaveis").value] = retorno.layer;
				i3GEOF.editorlimites.temasregioes[retorno.layer] = $i("i3geoCartoRegioesEditaveis").value;
			}
		};
		i3GEO.php.mapfileTipoRegiao(temp,combo.value);
	},
	/**
	 * Altera as bordas dos icones e desativa eventos
	 * Desativa todos os botoes e ativa o indicado
	 * @param objeto DOM que representa o botao que sera focado
	 */
	mudaicone: function(botao){
		var c = $i(i3GEOF.editorlimites.iddiv),
			ci = c.getElementsByTagName("img"),
			n = ci.length,
			i;
		for(i=0;i<n;i++){
			ci[i].parentNode.style.backgroundColor = "#F5F5F5";
		}
		i3GEO.eventos.MOUSECLIQUE = [];
		i3GEOF.editorlimites.capturaPoligonoTema.desativa();
		i3GEOF.editorlimites.editarAtributos.desativa();
		if(botao && botao.style){
			botao.style.backgroundColor = "#cedff2";
		}
	},
	/**
	 * Ativa a digitalizacao de poligono
	 * @param objeto DOM que representa o botao que sera focado
	 */
	digitalizaPol: function(botao){
		i3GEOF.editorlimites.mudaicone(botao);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEOF.editorlimites.drawingManager.setOptions({
			drawingMode: google.maps.drawing.OverlayType.POLYGON
		});
	},
	/**
	 * Ativa a selecao de figuras
	 * @param objeto DOM que representa o botao que sera focado
	 */
	seleciona: function(botao){
		i3GEOF.editorlimites.mudaicone(botao);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEOF.editorlimites.drawingManager.setOptions({
			drawingMode: null
		});
	},
	/**
	 * Adiciona uma nova figura ao mapa (shape)
	 * @param objeto shape (API do Google)
	 * @param codigo do layer que sera vinculado ao shape
	 * @param coluna do tema que contem os identificadores de cada um de seus elementos (registros)
	 * @param valor do identificador
	 * @param coluna que cntem os nomes das regioes
	 * @param nome da regiao a ser adicionada
	 */
	adicionaPoligonos: function(obj,tema,colunaid,valorid,colunanome,valornome){
		if(!tema){
			tema = $i("i3geoCartoRegioesEditaveis").value;
		}
		if(!colunaid){
			colunaid = "";
		}
		if(!valorid){
			valorid = "";
		}
		if(!colunanome){
			colunanome = "";
		}
		if(!valornome){
			valornome = "";
		}
		var pol;
		if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
				for (i in obj) {
						if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
							pol = new google.maps.Polygon({
				path: obj[i].getPath(),
				map: i3GeoMap,
				fillColor: '#ffff00',
				fillOpacity: .5,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
				editable: true,
				tema: tema,
				colunaid: colunaid,
				valorid: valorid,
				colunanome: colunanome,
				valornome: valornome
			});
			google.maps.event.addListener(pol, 'click', function() {
				i3GEOF.editorlimites.setSelection(pol);
			});
			i3GEOF.editorlimites.shapes.push(pol);
						}
				}
				return;
		}
		if (obj.type === 'polygon' || obj.type === 'linestring'){
			pol = new google.maps.Polygon({
				paths: obj.getPaths(),
				map: i3GeoMap,
				fillColor: '#ffff00',
				fillOpacity: .5,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
				editable: true,
				tema: tema,
				colunaid: colunaid,
				valorid: valorid,
				colunanome: colunanome,
				valornome: valornome
			});
			google.maps.event.addListener(pol, 'click', function() {
				i3GEOF.editorlimites.setSelection(pol);
			});
			i3GEOF.editorlimites.shapes.push(pol);
			return;
		}
	},
	/**
	 * Salva um poligono no banco de dados
	 */
	salvaLimite: {
		/**
		 * Inicia a ferramenta definindo as funcoes dos botoes
		 * Executa i3GEOF.editorlimites.salvaLimite.criaJanelaFlutuante
		 */
		inicia: function(){
			if(i3GEO.login.verificaCookieLogin() === false){
				i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
				return;
			}
			var s = i3GEOF.editorlimites.selectedShapes(),
				n = s.length,
				janela = YAHOO.i3GEO.janela.manager.find("salvaLimite");
			if(janela){
				janela.destroy();
			}
			if(n == 1){
				s = s[0];
				i3GEOF.editorlimites.salvaLimite.criaJanelaFlutuante(i3GEOF.editorlimites.salvaLimite.html(
					s.colunaid,
					s.valorid,
					s.colunanome,
					s.valornome
				));
				new YAHOO.widget.Button(
						"i3GEOFmetaestati3GEOF.editorlimitesBotao1",
						{onclick:{fn: function(){
							i3GEOF.editorlimites.salvaLimite.gravaDados(true);
						}}}
				);
				new YAHOO.widget.Button(
						"i3GEOFmetaestati3GEOF.editorlimitesBotao2",
						{onclick:{fn: function(){
							i3GEOF.editorlimites.salvaLimite.gravaDados(false);
						}}}
				);
				new YAHOO.widget.Button(
						"i3GEOFmetaestati3GEOF.editorlimitesBotao3",
						{onclick:{fn: function(){
							i3GEOF.editorlimites.salvaLimite.excluiPoligono();
						}}}
				);
			}
			else{
				i3GEO.janela.tempoMsg("Selecione uma figura");
			}
		},
		/**
		 * Monta o HTML para o formulario que permite salvar os dados
		 */
		html:function(colunaIdElemento,valorIdElemento,colunaNomeElemento,valorNomeElemento){
			var ins = '' +
				'<p class=paragrafo >Se o valor do c&oacute;digo for vazio, ser&aacute; criado um novo elemento. Caso contr&aacute;rio, os valores atualmente registrados ser&atilde;o atualizados.</p>' +
				'<p class=paragrafo >Edite os atributos:</p>' +
				'<input type=hidden id="inputColunaIdElemento" value="'+colunaIdElemento+'" />' +
				'<input type=hidden id="inputColunaNomeElemento" value="'+colunaNomeElemento+'" />' +
				'<input type=hidden id="inputIdentificadorElemento" value="'+valorIdElemento+'" />' +
				'<input type=hidden id="inputNomeElemento" value="'+valorNomeElemento+'" />' +
				'<p class=paragrafo >C&oacute;digo:</p>' +
				'<p class=paragrafo ><input class=digitar type=text id="inputIdentificadorNovoElemento" value="'+valorIdElemento+'" style="width:180;cursor:text" /></p>' +
				'<p class=paragrafo >Nome:</p>' +
				'<p class=paragrafo ><input class=digitar type=text id="inputNomeNovoElemento" value="'+valorNomeElemento+'" style="width:180;cursor:text" /></p>' +
				'<p class=paragrafo >Escolha a opera&ccedil;&atilde;o desejada:</p>' +
				'<input id=i3GEOFmetaestati3GEOF.editorlimitesBotao1 type="button" value="Salvar tudo" />' +
				'&nbsp;<input id=i3GEOFmetaestati3GEOF.editorlimitesBotao2 type="button" value="Salvar apenas os atributos" />' +
				'<br><br><input id=i3GEOFmetaestati3GEOF.editorlimitesBotao3 type="button" value="Excluir pol&iacute;gono" />';
			return ins;
		},
		/**
		 * Cria a janela flutuante para receber os componentes da ferramenta
		 * @param html com o conteudo da ferramenta
		 */
		criaJanelaFlutuante: function(html){
			var titulo,cabecalho,minimiza,janela;
			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("salvaLimite");
			};
			titulo = "Salva limite&nbsp;&nbsp;&nbsp;</a>";
			janela = i3GEO.janela.cria(
				"350px",
				"265px",
				"",
				"",
				"",
				titulo,
				"salvaLimite",
				true,
				"hd",
				cabecalho,
				minimiza
			);
			$i("salvaLimite_corpo").style.backgroundColor = "white";
			$i("salvaLimite_corpo").innerHTML = html;
			YAHOO.util.Event.addListener(janela[0].close, "click", i3GEOF.editorlimites.mudaicone);
		},
		/**
		 * Aplica a operacao de salvar os dados no banco para o shape selecionado
		 * Executa admin/php/metaestat.php?funcao=mantemDadosRegiao
		 * @param boolean indica se as coordenadas serao salvas tambem
		 */
		gravaDados: function(comwkt){
			if(i3GEO.login.verificaCookieLogin() === false){
				i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
				return;
			}
			if(!window.confirm("Grava mesmo os dados?")){
				return;
			}
			var p,codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				identificadornovo = $i("inputIdentificadorNovoElemento").value,
				identificador = $i("inputIdentificadorElemento").value,
				nome = $i("inputNomeNovoElemento").value,
				wkt = "",
				temp = function(retorno){
					i3GEOF.editorlimites.deleteSelectedShape(true);
					var janela = YAHOO.i3GEO.janela.manager.find("salvaLimite");
					if(janela){
						janela.destroy();
					}
					i3GEO.Interface.redesenha();
				};
			if(comwkt === true){
				wkt = i3GEOF.editorlimites.toWKT(i3GEOF.editorlimites.selectedShapes()[0]);
			}
			else{
				if(identificadornovo === identificador && $i("inputNomeElemento").value === nome){
					i3GEO.janela.tempoMsg("Valores iguais ao original");
					return;
				}
			}
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=mantemDadosRegiao&tipo=";
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificadornovo="+identificadornovo+"&identificador="+identificador+"&nome="+nome+"&wkt="+wkt);
		},
		/**
		 * Exclui um registro do banco de dados
		 * Executa admin/php/metaestat.php?funcao=mantemDadosRegiao&tipo=excluir
		 */
		excluiPoligono: function(){
			if(i3GEO.login.verificaCookieLogin() === false){
				i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
				return;
			}
			if(!window.confirm("Exclui mesmo o poligono?")){
				return;
			}
			var codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				identificador = $i("inputIdentificadorElemento").value,
				temp = function(retorno){
					i3GEOF.editorlimites.deleteSelectedShape(true);
					var janela = YAHOO.i3GEO.janela.manager.find("salvaLimite");
					if(janela){
						janela.destroy();
					}
					i3GEO.Interface.redesenha();
				},
				p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=mantemDadosRegiao&tipo=excluir";
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificador="+identificador);
		}
	},
	/**
	 *Funcoes que controlam o processo de edicao de atributos de um shape
	 */
	editarAtributos: {
		aliascolunas: "", //guarda os nomes das colunas e seus aliases para permitir a criacao de novos registros
		x: "",
		y: "",
		/**
		 * Ativa a ferramenta
		 * Define os eventos de onclick para abrir formulario quando o usuario clica no mapa
		 * Para cada regiao sao obtidas todas as variaveis cadastradas
		 * Executa i3GEOF.editorlimites.editarAtributos.criaJanelaFlutuante
		 * Executa i3GEOF.editorlimites.editarAtributos.comboVariaveis();
		 */
		ativa: function(botao){
			if($i("i3geoCartoRegioesEditaveis").value == ""){
				i3GEO.janela.tempoMsg("Escolha uma regiao");
				return;
			}
			i3GEOF.editorlimites.mudaicone(botao);
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.editorlimites.editarAtributos.captura()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.editorlimites.editarAtributos.captura()");}
			var janela = YAHOO.i3GEO.janela.manager.find("editaAtributos");
			if(janela){
				$i("editarAtributosForm").innerHTML = "";
			}
			else{
				i3GEOF.editorlimites.editarAtributos.criaJanelaFlutuante(i3GEOF.editorlimites.editarAtributos.html());
				i3GEOF.editorlimites.editarAtributos.comboVariaveis();
			}
		},
		/**
		 * Fecha a janela de edicao
		 */
		desativa: function(){
			var janela = YAHOO.i3GEO.janela.manager.find("editaAtributos");
			if(janela){
				janela.destroy();
			}
		},
		criaJanelaFlutuante: function(html){
			var janela,titulo,cabecalho,minimiza;
			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("editaAtributos");
			};
			titulo = "Atributos&nbsp;&nbsp;&nbsp;</a>";
			janela = i3GEO.janela.cria(
				"250px",
				"265px",
				"",
				"",
				"",
				titulo,
				"editaAtributos",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			$i("editaAtributos_corpo").style.backgroundColor = "white";
			$i("editaAtributos_corpo").innerHTML = html;
			i3GEO.janela.tempoMsg("Ap&oacute;s escolher a medida da vari&aacute;vel, clique no mapa para escolher o limite geogr&aacute;fico.");
			YAHOO.util.Event.addListener(janela[0].close, "click", i3GEOF.editorlimites.mudaicone);
		},
		/**
		 * Fornece o HTML com os objetos que receberao os componentes da ferramenta
		 * @return html
		 */
		html: function(){
			var ins = '' +
				'<p class="paragrafo" ><div id="editarAtributosVariaveis" ></div></p>' +
				'<p class="paragrafo" ><div id="editarAtributosMedidasVariavel" ></div></p>' +
				'<p class="paragrafo" ><div id="editarAtributosRegiao" ></div></p>' +
				'<p class="paragrafo" ><div id="editarAtributosForm" ></div></p>' +
				'';
			return ins;
		},
		/**
		 * Monta um combo para escolha de uma variavel que sera editada
		 * Executa i3GEO.php.listaVariavel
		 */
		comboVariaveis: function(){
			var temp = function(dados){
				var i,n = dados.length, ins = '';
				ins += '<p class="paragrafo" >Escolha uma vari&aacute;vel para editar</p>';
				ins += "<select style='box-shadow:0 1px 5px gray;width:200px' onchange='i3GEOF.editorlimites.editarAtributos.comboMedidasVariavel(this)'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
				}
				ins += "</select>";
				$i("editarAtributosVariaveis").innerHTML = ins;
			};
			i3GEO.php.listaVariavel(temp,"i3geo_metaestat");
		},
		/**
		 * Monta um combo com as medidas de uma variavel
		 * Executa i3GEO.php.listaMedidaVariavel
		 * @param objeto DOM do tipo select que contem a lista de variaveis
		 */
		comboMedidasVariavel: function(comboMedidas){
			var temp = function(dados){
				var i,n = dados.length, ins = '';
				ins += '<p class="paragrafo" >Escolha uma medida da vari&aacute;vel para editar</p>';
				ins += "<select id='editarAtributosComboMedidas' style='box-shadow:0 1px 5px gray;width:200px' onchange=''><option value=''>---</option>";
				for(i=0;i<n;i++){
					if(dados[i].esquemadb == "i3geo_metaestat" && dados[i].codigo_tipo_regiao == $i("i3geoCartoRegioesEditaveis").value){
						ins += "<option value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
					}
				}
				ins += "</select>";
				$i("editarAtributosMedidasVariavel").innerHTML = ins;
			};
			if(comboMedidas.value !== ""){
				i3GEO.php.listaMedidaVariavel(comboMedidas.value,temp);
			}
		},
		/**
		 * Captura os atributos de um elemento do mapa
		 * Executa i3GEOF.editorlimites.editarAtributos.pegaDados();
		 */
		captura: function(){
			if(!YAHOO.i3GEO.janela.manager.find("editaAtributos")){
				i3GEOF.editorlimites.mudaicone(botao);
				return;
			}
			i3GEOF.editorlimites.editarAtributos.x = objposicaocursor.ddx;
			i3GEOF.editorlimites.editarAtributos.y = objposicaocursor.ddy;
			i3GEOF.editorlimites.editarAtributos.pegaDados();
		},
		/**
		 * Obtem os dados de um elemento de uma regiao
		 * Monta o formulario para edicao
		 * Executa admin/php/metaestat.php?funcao=listaAtributosMedidaVariavelXY
		 */
		pegaDados: function(){
			var p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaAtributosMedidaVariavelXY",
				codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				id_medida_variavel = $i("editarAtributosComboMedidas").value,
				temp = function(retorno){
					var atr = retorno.atributos,
						i = 0,
						n = atr.dados.length,
						j = 0,
						idunico = "",
						nj = atr.aliascolunas.length,
						ins = "" +
						'<p class=paragrafo >Limite geogr&aacute;fico escolhido:</p>' +
						'<p class=paragrafo ><b>Nome: </b>' + retorno.regiao.nomeregiao + '</p>' +
						'<p class=paragrafo ><b>C&oacute;digo: </b>' + retorno.regiao.identificador_regiao + '</p>' +
						'<input type=hidden id="editarAtributosidentificador_regiao" value="' + retorno.regiao.identificador_regiao + '" />' +
						'<p class=paragrafo >Atributos:</p>' +
						'<input id=editarAtributosAdicionar value="Adicionar um novo" />' +
						'&nbsp;<input id=editarAtributosSalvar value="Salvar" />';
					$i("editarAtributosRegiao").innerHTML = ins;
					ins = "";
					//registros
					for(i=0;i<n;i++){
						//descobre qual o indice que corresponde ao idunico do registro
						for(j=0;j<nj;j++){
							if(atr.aliascolunas[j] == "idunico"){
								idunico = atr.dados[i][atr.colunas[j]];
							}
						}
						ins += "<hr><div><p class=paragrafo style='color:blue;cursor:pointer' onclick='i3GEOF.editorlimites.editarAtributos.excluir("+idunico+")' >excluir</p>";
						//colunas
						for(j=0;j<nj;j++){
							if(atr.aliascolunas[j] !== "idunico"){
								ins += '<p class=paragrafo >'+atr.aliascolunas[j]+':<br>' +
								'<input class=digitar id="idunico_'+idunico+'" value="'+atr.dados[i][atr.colunas[j]]+'" name="'+atr.colunas[j]+'" /></p>';
							}
						}
					}
					$i("editarAtributosForm").innerHTML = ins;
					new YAHOO.widget.Button(
						"editarAtributosAdicionar",
						{onclick:{fn: function(){
							var novoel = document.createElement("div"),
								ins = "<hr><br>";
							for(j=0;j<nj;j++){
								if(atr.aliascolunas[j] !== "idunico"){
									ins += '<p class=paragrafo >'+atr.aliascolunas[j]+' - '+atr.descricao[j]+':<br>' +
									'<input class=digitar id="" value="" name="'+atr.colunas[j]+'" /></p>';
								}
							}
							ins + "<br></div>";
							novoel.innerHTML = ins;
							$i("editarAtributosForm").appendChild(novoel);
						}}}
					);
					new YAHOO.widget.Button(
						"editarAtributosSalvar",
						{onclick:{fn: function(){
							i3GEOF.editorlimites.editarAtributos.salva();
						}}}
					);
				};
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&id_medida_variavel="+id_medida_variavel+"&x="+i3GEOF.editorlimites.editarAtributos.x+"&y="+i3GEOF.editorlimites.editarAtributos.y);
		},
		//TODO redesenhar as camadas que sofrerem alterações em função do salvar ou excluir
		/**
		 * Exclui o valor de uma medida de variavel para o componente de uma regiao
		 */
		excluir: function(id){
			if(i3GEO.login.verificaCookieLogin() === false){
				i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
				return;
			}
			var p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=excluiAtributosMedidaVariavel",
				codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				id_medida_variavel = $i("editarAtributosComboMedidas").value,
				identificador_regiao = $i("editarAtributosidentificador_regiao").value,
				temp = function(retorno){
					i3GEOF.editorlimites.editarAtributos.pegaDados();
					i3GEO.janela.fechaAguarde("aguardeSalvaAtributos");
				};
			i3GEO.janela.AGUARDEMODAL = true;
			i3GEO.janela.abreAguarde("aguardeSalvaAtributos","Salvando...");
			i3GEO.janela.AGUARDEMODAL = false;
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificador_regiao="+identificador_regiao+"&id_medida_variavel="+id_medida_variavel+"&id="+id);

		},
		/**
		 * Salva os valores digitados
		 */
		salva: function(){
			if(i3GEO.login.verificaCookieLogin() === false){
				i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
				return;
			}
			var container = $i("editarAtributosForm"),
				divsT = container.getElementsByTagName("div"),
				n = divsT.length,
				i = 0,
				dv = "",
				inputs = "",
				codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				id_medida_variavel = $i("editarAtributosComboMedidas").value,
				identificador_regiao = $i("editarAtributosidentificador_regiao").value,
				nj,
				j,
				colunas = [],
				colunasT = [],
				valores = [],
				valoresT = [],
				idsunicosT = [],
				p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=salvaAtributosMedidaVariavel",
				re = new RegExp("idunico_", "g"),//prefixo usado para marcar o id dos elementos input que contem os valores que se quer obter
				temp = function(retorno){
					i3GEOF.editorlimites.editarAtributos.pegaDados();
					i3GEOF.editorlimites.atualizaCamadasMetaestat();
					i3GEO.janela.fechaAguarde("aguardeSalvaAtributos");
				};
			if(codigo_tipo_regiao == ""){
				i3GEO.janela.tempoMsg("Problemas com o codigo da regiao");
				return;
			}
			if(id_medida_variavel == ""){
				i3GEO.janela.tempoMsg("Escolha uma medida");
				return;
			}
			if(identificador_regiao == ""){
				i3GEO.janela.tempoMsg("Problemas com o identificador da regiao");
				return;
			}
			for(i=0;i<n;i++){
				dv = divsT[i];
				inputs = dv.getElementsByTagName("input");
				nj = inputs.length;
				colunas = [];
				valores = [];
				for(j=0;j<nj;j++){
					colunas.push(inputs[j].name);
					valores.push(inputs[j].value);
				}
				idsunicosT.push(inputs[0].id.replace(re,''));
				colunasT.push(colunas.join(";"));
				valoresT.push(valores.join(";"));
			}
			i3GEO.janela.AGUARDEMODAL = true;
			i3GEO.janela.abreAguarde("aguardeSalvaAtributos","Salvando...");
			i3GEO.janela.AGUARDEMODAL = false;
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificador_regiao="+identificador_regiao+"&id_medida_variavel="+id_medida_variavel+"&colunas="+colunasT[0]+"&valores="+valoresT.join("|")+"&idsunicos="+idsunicosT.join(";"));
		}
	},
	/**
	 * Abre a janela de ajuda sobre a operacao dos botoes do editor
	 */
	ajuda: function(){
		var titulo,cabecalho,minimiza,html = "";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("editaAtributosAjuda");
		};
		titulo = "Ajuda&nbsp;</a>";
		i3GEO.janela.cria(
			"400px",
			"350px",
			"",
			"",
			"",
			titulo,
			"editaAtributosAjuda",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		$i("editaAtributosAjuda_corpo").style.backgroundColor = "white";
		html += "<table class=lista8 >" +
		"<tr><td><img src='"+i3GEO.configura.locaplic+"/imagens/gisicons/polygon-create.png' /></td>" +
		"<td>Clique no mapa para tra&ccedil;ar um pol&iacute;gono novo. Cada clique corresponde a um v&eacute;rtice do pol&iacute;gono. Para encerrar o tra&ccedil;ado utilize um duplo clique. Ap&oacute;s tra&ccedil;ar um novo pol&iacute;gono pode-se selecion&aacute;-lo novamente e editar os v&eacute;rtices, se for necess&aacute;rio, ou mesmo apagar o pol&iacute;gono por completo. O novo pol&iacute;gono s&oacute; ser&aacute; salvo por meio da op&ccedil;&atilde;o espec&iacute;fica para isso.</td></tr>" +
		"<tr><td><img src='"+i3GEO.configura.locaplic+"/imagens/gisicons/layer-import.png' /></td>" +
		"<td>Utilize essa op&ccedil;&atilde;o para capturar os v&eacute;rtices de um pol&iacute;gono existente. O resultado da captura &eacute; uma figura que pode ser editada, ou seja, os v&eacute;rtices podem ser modificados de posi&ccedil;&atilde;o ou mesmo removidos. Ap&oacute;s editar, salve o novo pol&iacute;gono.</td></tr>" +
		"<tr><td><img src='"+i3GEO.configura.locaplic+"/imagens/gisicons/select.png' /></td>" +
		"<td>Ap&oacute;s ativar essa op&ccedil;&atilde;o clique no mapa sobre uma figura existente (que tenha sido capturada ou digtalizada). A figura passar&aacute; ent&atilde;o para o estado de 'selecionada' podendo ser utilizada por outras ferramentas de edi&ccedil;&atilde;o.</td></tr>" +
		"<tr><td><img src='"+i3GEO.configura.locaplic+"/imagens/gisicons/selected-delete.png' /></td>" +
		"<td>Remove da tela a figura que estiver selecionada. Essa opera&ccedil;&atilde;o n&atilde;o apaga o pol&iacute;gono do banco de dados, apenas remove do modo de edi&ccedil;&atilde;o.</td></tr>" +
		"<tr><td><img src='"+i3GEO.configura.locaplic+"/imagens/gisicons/vector-save.png' /></td>" +
		"<td>Salva no banco de dados a figura que estiver selecionada. Essa op&ccedil;&atilde;o altera apenas os atributos do limite geogr&aacute;fico, n&atilde;o afetando os valores armazenados em cada medida de vari&aacute;vel.</td></tr>" +
		"<tr><td><img src='"+i3GEO.configura.locaplic+"/imagens/gisicons/annotation-form.png' /></td>" +
		"<td>Abre um formul&aacute;rio que permite alterar os valores de uma medida de vari&aacute;vel relacionada a uma determinada regi&atilde;o. Ap&oacute;s abrir o formul&aacute;rio, clique no mapa sobre a regi&atilde;o desejada, mas escolha a medida da vari&aacute;vel primeiro. Os valores j&aacute; existentes poder&atilde;o ent&atilde;o ser alterados ou podem ser adicionados novos.</td></tr>" +
		"</table>";
		$i("editaAtributosAjuda_corpo").innerHTML = html;
	}
};