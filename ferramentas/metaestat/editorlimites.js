/*
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


//TODO traduzir
var editorlimites = {
	/**
	 * Estilo do objeto DOM com a imagem de aguarde existente no cabecalho da janela
	 *
	*/
	aguarde: "",
	iddiv: "",
	drawingManager: "",
	selectedShape: null,
	shapes: [],
	regioestemas:{},//guarda o mapeamento entre o codigo da regiao e o codigo do layer adicionado ao mapa
	temasregioes:{},//guarda o mapeamento entre o codigo da regiao e o codigo do layer adicionado ao mapa
	descregioes:[],//guarda os dados descritivos sobre cada regiao obtidos na formacao no combo de escolha de regioes
	/**
	 * Inicia o editor
	 *
	 * @param {String} Id do DIV que recebera o conteudo HTML do editor. Ja deve estar criado no HTML
	 * @return
	*/
	inicia: function(iddiv){
		var i,n,ics;
		editorlimites.iddiv = iddiv;
		$i(iddiv).innerHTML = editorlimites.html();
		ics = $i(iddiv).getElementsByTagName("button");
		n = ics.length;
		i3GEO.barraDeBotoes.ativaBotoes();
		editorlimites.comboRegiaoEditavel();
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
		editorlimites.drawingManager = new google.maps.drawing.DrawingManager({
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
		editorlimites.drawingManager.setMap(i3GeoMap);
		editorlimites.drawingManager.setDrawingMode(null);
		google.maps.event.addListener(editorlimites.drawingManager, 'overlaycomplete', function(e) {
			if (e.type != google.maps.drawing.OverlayType.MARKER) {
				editorlimites.drawingManager.setDrawingMode(null);
				editorlimites.mudaicone();
				var newShape = e.overlay;
				newShape.type = e.type;
				newShape.tema = $i("i3geoCartoRegioesEditaveis").value;
				newShape.colunaid = "";
				newShape.valorid = "";
				newShape.colunanome = "";
				newShape.valornome = "";
				google.maps.event.addListener(newShape, 'click', function() {
					editorlimites.setSelection(newShape);
				});
				editorlimites.setSelection(newShape);
				editorlimites.shapes.push(newShape);
			}
		});
        google.maps.event.addListener(
        	editorlimites.drawingManager,
        	'drawingmode_changed',
        	editorlimites.clearSelection
        );
        google.maps.event.addListener(
        	i3GeoMap,
        	'click',
        	editorlimites.clearSelection
        );
	},
	/*
	Function: html

	Gera o código html para apresentaç&atilde;o das opções da ferramenta

	Retorno:

	String com o código html
	*/
	html:function(){
		var ins = '' +
		'	<button title="Desenhar um polígono" onclick="editorlimites.digitalizaPol(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/polygon-create.png" /></button>' +
		'	<button title="Capturar polígono de um tema" onclick="editorlimites.capturaPoligonoTema.ativa(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/layer-import.png" /></button>' +
		'	<button title="Selecionar" onclick="editorlimites.seleciona(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/select.png" /></button>' +
		'	<button title="Remove selecionado (n&atilde;o apaga)" onclick="editorlimites.deleteSelectedShape()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/selected-delete.png" /></button>' +
		'	<button title="Salvar limite" onclick="editorlimites.salvaLimite.inicia()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/vector-save.png" /></button>' +
		'	<button title="Editar atributos" onclick="editorlimites.editarAtributos.ativa(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/annotation-form.png" /></button>' +
		'	<button title="Ajuda" onmousedown="editorlimites.mudaicone()" onclick="editorlimites.Ajuda()" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/help-contents.png" /></button>' +
		'	<br><div id="i3geoCartoRegioesEditaveisDiv" ><img style="display:block;z-index:2" src="'+i3GEO.configura.locaplic+'/imagens/aguarde.gif" /></div>'; //combo para escolher a regiao
		return ins;
		//TODO texto do botao de ajuda
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEO.barraDeBotoes.ativaIcone("pan");
		editorlimites.mudaicone();
		i3GEO.Interface.googlemaps.recalcPar();
	},
	setSelection: function(shape){
		//editorlimites.clearSelection();
		//editorlimites.selectedShape = shape;
		shape.setEditable(!shape.editable);
	},
	clearSelection: function(){
		var i,
			n = editorlimites.shapes.length;
		for(i=0;i<n;i++){
			if(editorlimites.shapes[i] != ""){
				editorlimites.shapes[i].setEditable(false);
			}
		}
	},
	deleteSelectedShape: function(naoconfirma) {
		if(!naoconfirma){
			naoconfirma = false;
		}
		var i,
		n = editorlimites.shapes.length;
		if(n > 0){
			if(naoconfirma === false){
				var x = window.confirm("Remove as figuras selecionadas?");
			}
			else{
				x = true;
			}
			if(x){
				for(i=0;i<n;i++){
					if(editorlimites.shapes[i] != "" && editorlimites.shapes[i].editable === true){
						editorlimites.shapes[i].setMap(null);
						editorlimites.shapes[i] = "";
					}
				}
			}
		}
		else{
			i3GEO.janela.tempoMsg("Selecione pelo menos uma figura");
		}
	},
	selectedShapes: function() {
		var i,s = [],
		n = editorlimites.shapes.length;
		for(i=0;i<n;i++){
			if(editorlimites.shapes[i] != "" && editorlimites.shapes[i].editable === true){
				s.push(editorlimites.shapes[i]);
			}
		}
		return s;
	},
	getCoordenadas: function(){
		var coordenadas = [],
			lista = [],
			n = editorlimites.shapes.length,
			tipo = "",
			ps,nps,j,p,i;

		for(i=0;i<n;i++){
			coordenadas = [];
			if(editorlimites.shapes[i] != "" && editorlimites.shapes[i].editable === true){
				if(tipo == ""){
					tipo = editorlimites.shapes[i].type;
				}
				ps = editorlimites.shapes[i].getPath();
				nps = ps.getLength();
				for(j=0;j<nps;j++){
					p = ps.getAt(j);
					coordenadas.push([p.lng()+" "+p.lat()]);
				}
				lista.push(coordenadas);
			}
		}
		return {"tipo":tipo,"coordenadas":lista};
	},
	toWKT: function(obj){
		var wkt = "",
			coordenadas = obj.coordenadas,
			n = coordenadas.length,
			lista = [],
			i,c;
		if(obj.tipo == "polygon" || obj.tipo == "" || obj.tipo == undefined ){
			if(n == 1 && coordenadas[0] != ""){
				coordenadas.push(coordenadas[0][0]);
				wkt = "POLYGON(("+coordenadas.toString()+"))";
			}
			else{
				for(i=0;i<n;i++){
					c = coordenadas[i];
					c.push(c[0][0]);
					lista.push("(("+c.toString()+"))");
				}
				if(lista.length > 0)
				{wkt = "MULTIPOLYGON("+lista.toString()+")";}
			}
		}
		if(obj.tipo == "point"){

		}
		if(obj.tipo == "polyline"){

		}
		return wkt;
	},
	capturaPoligonoTema:{
		ativa: function(botao){
			editorlimites.mudaicone(botao);
			i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("editorlimites.capturaPoligonoTema.captura()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("editorlimites.capturaPoligonoTema.captura()");}
		},
		desativa: function(){
		},
		captura: function(){
			var temp,tema="",regiao="",p,par,
				aguarde = $i("janelaEditorLimites_imagemCabecalho");
			editorlimites.mudaicone();
			if(!$i("i3geoCartoRegioesEditaveis")){
				i3GEO.eventos.MOUSECLIQUE.remove("editorlimites.capturaPoligonoTema.captura()");
			}
			else{
				temp = function(retorno){
						var temp,re,n,i,j,
							wkt = "",
							colunaid = editorlimites.descregioes["a_"+regiao]["identificador"],
							valorid = "",
							colunanome = editorlimites.descregioes["a_"+regiao]["colunanomeregiao"],
							valornome = "",
							pontos = [],
							aguarde = $i("janelaEditorLimites_imagemCabecalho");
						//obtem os dados buscando nos itens que vem da requisicao ao wms
						temp = retorno.data[0].resultado[0];
						n = temp.length;
						for(i=0;i<n;i++){
							if(temp[i].alias == "wkt"){
								wkt = temp[i].valor;
							}
							if(temp[i].alias == colunaid){
								valorid = temp[i].valor;
							}
							if(temp[i].alias == colunanome){
								valornome = temp[i].valor;
							}
						}
						if(aguarde){
							aguarde.style.visibility = "hidden";
						}
						re = new RegExp("POLYGON \\(\\(", "g");
						wkt = wkt.replace(re,'');
						re = new RegExp("\\)\\)", "g");
						wkt = wkt.replace(re,'');
						re = new RegExp(", ", "g");
						wkt = wkt.replace(re,',');
						wkt = wkt.split(",");
						n = wkt.length;
						for(i=0;i<n;i++){
							j = wkt[i].split(" ");
							pontos.push([j[0],j[1]]);
						}
						editorlimites.adicionaPoligonos([pontos],tema,colunaid,valorid,colunanome,valornome);
						i3GEO.eventos.MOUSECLIQUE = [];
					};
				regiao = $i("i3geoCartoRegioesEditaveis").value;
				if(regiao != ""){
					tema = editorlimites.regioestemas["a"+regiao];
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
	/*
	Function: mudaicone

	Altera as bordas dos ícones e desativa eventos anteriores
	*/
	mudaicone: function(botao){
		var c = $i(editorlimites.iddiv),
			ci = c.getElementsByTagName("img"),
			n = ci.length,
			i;
		for(i=0;i<n;i++){
			ci[i].parentNode.style.backgroundColor = "#F5F5F5";
		}
		i3GEO.eventos.MOUSECLIQUE = [];
		editorlimites.capturaPoligonoTema.desativa();
		editorlimites.editarAtributos.desativa();
		if(botao && botao.style){
			botao.style.backgroundColor = "#cedff2";
		}
	},
	digitalizaPol: function(botao){
		editorlimites.mudaicone(botao);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		editorlimites.drawingManager.setOptions({
			drawingMode: google.maps.drawing.OverlayType.POLYGON
		});
	},
	seleciona: function(botao){
		editorlimites.mudaicone(botao);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		editorlimites.drawingManager.setOptions({
			drawingMode: null
		});
	},
	comboRegiaoEditavel: function(codigo_tipo_regiao){
		if(!codigo_tipo_regiao){
			codigo_tipo_regiao = "";
		}
		var onde = $i("i3geoCartoRegioesEditaveisDiv"),
		temp = function(dados){
			var n = dados.length,
			ins = '<br><p class="paragrafo" >'+$trad(15,i3GEOF.metaestat.dicionario)+':</p>',
			i;
			ins += "<select onchange='editorlimites.comboRegiaoEditavelOnchange(this)' id='i3geoCartoRegioesEditaveis' style='width:175px' ><option value=''>---</option>";
			for(i=0;i<n;i++){
				//so e possivel editar nesse esquema
				if(dados[i].esquemadb == "i3geo_metaestat"){
					ins += "<option value='"+dados[i].codigo_tipo_regiao+"'>"+dados[i].nome_tipo_regiao+"</option>";
					editorlimites.descregioes["a_"+dados[i].codigo_tipo_regiao] = dados[i];
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
	comboRegiaoEditavelOnchange: function(combo){
		if(combo.value === ""){
			return;
		}
		editorlimites.editarAtributos.desativa();
		var temp = function(retorno){
			if(i3GEO.arvoreDeCamadas.pegaTema(retorno.layer) == ""){
				i3GEO.php.adtema(i3GEO.atualiza,retorno.mapfile);
				//guarda o codigo e relaciona com a regiao
				editorlimites.regioestemas["a"+$i("i3geoCartoRegioesEditaveis").value] = retorno.layer;
				editorlimites.temasregioes[retorno.layer] = $i("i3geoCartoRegioesEditaveis").value;
			}
		};
		i3GEO.php.mapfileTipoRegiao(temp,combo.value);
	},
	adicionaPoligonos: function(listaDePontos,tema,colunaid,valorid,colunanome,valornome){
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
		var n = listaDePontos.length,
		i = 0,
		nn,
		temp,
		j,
		pol,
		pontos = [];
		for(i=0;i<n;i++){
			pontos = [];
			nn = listaDePontos[i].length;
			for(j=0;j<nn;j++){
				temp = listaDePontos[i][j];
				pontos.push(new google.maps.LatLng(temp[1],temp[0]));
			}
			pontos.push(pontos[0]);
			pol = new google.maps.Polygon({
				path: pontos,
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
				editorlimites.setSelection(pol);
			});
			editorlimites.shapes.push(pol);
		}
	},
	salvaLimite: {
		inicia: function(){
			var s = editorlimites.selectedShapes(),
				n = s.length,
				janela = YAHOO.i3GEO.janela.manager.find("salvaLimite");
			if(janela){
				janela.destroy();
			}
			if(n == 1){
				s = s[0];
				editorlimites.salvaLimite.criaJanelaFlutuante(editorlimites.salvaLimite.html(
					s.colunaid,
					s.valorid,
					s.colunanome,
					s.valornome
				));
				new YAHOO.widget.Button(
						"i3GEOFmetaestatEditorLimitesBotao1",
						{onclick:{fn: function(){
							editorlimites.salvaLimite.gravaDados(true);
						}}}
				);
				new YAHOO.widget.Button(
						"i3GEOFmetaestatEditorLimitesBotao2",
						{onclick:{fn: function(){
							editorlimites.salvaLimite.gravaDados(false);
						}}}
				);
				new YAHOO.widget.Button(
						"i3GEOFmetaestatEditorLimitesBotao3",
						{onclick:{fn: function(){
							editorlimites.salvaLimite.excluiPoligono();
						}}}
				);
			}
			else{
				i3GEO.janela.tempoMsg("Selecione uma figura");
			}
		},
		//altera um poligono que ja existia
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
				'<input id=i3GEOFmetaestatEditorLimitesBotao1 type="button" value="Salvar tudo" />' +
				'&nbsp;<input id=i3GEOFmetaestatEditorLimitesBotao2 type="button" value="Salvar apenas os atributos" />' +
				'<br><br><input id=i3GEOFmetaestatEditorLimitesBotao3 type="button" value="Excluir pol&iacute;gono" />';
			return ins;
		},
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
			YAHOO.util.Event.addListener(janela[0].close, "click", editorlimites.mudaicone);
		},
		gravaDados: function(comwkt){
			//TODO verificar login ao salvar
			if(!window.confirm("Grava mesmo os dados?")){
				return;
			}
			var p,codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				identificadornovo = $i("inputIdentificadorNovoElemento").value,
				identificador = $i("inputIdentificadorElemento").value,
				nome = $i("inputNomeNovoElemento").value,
				wkt = "",
				temp = function(retorno){
					editorlimites.deleteSelectedShape(true);
					var janela = YAHOO.i3GEO.janela.manager.find("salvaLimite");
					if(janela){
						janela.destroy();
					}
					i3GEO.Interface.redesenha();
				};
			if(comwkt === true){
				wkt = editorlimites.toWKT(editorlimites.getCoordenadas(editorlimites.selectedShapes()[0]));
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
		excluiPoligono: function(){
			//TODO verificar login
			if(!window.confirm("Exclui mesmo o poligono?")){
				return;
			}
			var codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				identificador = $i("inputIdentificadorElemento").value,
				temp = function(retorno){
					editorlimites.deleteSelectedShape(true);
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
	editarAtributos: {
		aliascolunas: "", //guarda os nomes das colunas e seus aliases para permitir a criacao de novos registros
		x: "",
		y: "",
		ativa: function(botao){
			if($i("i3geoCartoRegioesEditaveis").value == ""){
				i3GEO.janela.tempoMsg("Escolha uma regiao");
				return;
			}
			editorlimites.mudaicone(botao);
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("editorlimites.editarAtributos.captura()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("editorlimites.editarAtributos.captura()");}
			var janela = YAHOO.i3GEO.janela.manager.find("editaAtributos");
			if(janela){
				$i("editarAtributosForm").innerHTML = "";
			}
			else{
				editorlimites.editarAtributos.criaJanelaFlutuante(editorlimites.editarAtributos.html());
				editorlimites.editarAtributos.comboVariaveis();
			}
		},
		desativa: function(){
			var janela = YAHOO.i3GEO.janela.manager.find("editaAtributos");
			if(janela){
				janela.destroy();
			}
		},
		captura: function(){
			if(!YAHOO.i3GEO.janela.manager.find("editaAtributos")){
				editorlimites.mudaicone(botao);
				return;
			}
			editorlimites.editarAtributos.x = objposicaocursor.ddx;
			editorlimites.editarAtributos.y = objposicaocursor.ddy;
			editorlimites.editarAtributos.pegaDados();
		},
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
						'<p class=paragrafo >Regi&atilde;o escolhida:</p>' +
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
						ins += "<hr><br>";
						//descobre qual o indice que corresponde ao idunico do registro
						for(j=0;j<nj;j++){
							if(atr.colunas[j] !== "idunico"){
								idunico = atr.dados[i][j];
							}
						}
						//colunas
						for(j=0;j<nj;j++){
							if(atr.colunas[j] !== "idunico"){
								ins += '<p class=paragrafo >'+atr.aliascolunas[j]+':<br>' +
								'<input class=digitar id="idunico_'+idunico+'" value="'+atr.dados[i][j]+'" name="'+atr.colunas[j]+'" /></p>';
							}
						}
					}
					$i("editarAtributosForm").innerHTML = ins;
					new YAHOO.widget.Button(
						"editarAtributosAdicionar",
						{onclick:{fn: function(){
							var ins = "<hr><br><div>";
							for(j=0;j<nj;j++){
								if(atr.colunas[j] !== "idunico"){
									ins += '<p class=paragrafo >'+atr.aliascolunas[j]+':<br>' +
									'<input class=digitar id="" value="" name="'+atr.colunas[j]+'" /></p>';
								}
							}
							$i("editarAtributosForm").innerHTML += ins + "</div><br>";
						}}}
					);
					new YAHOO.widget.Button(
						"editarAtributosSalvar",
						{onclick:{fn: function(){
							editorlimites.editarAtributos.salva();
						}}}
					);
				};
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&id_medida_variavel="+id_medida_variavel+"&x="+editorlimites.editarAtributos.x+"&y="+editorlimites.editarAtributos.y);
		},
		salva: function(){
			var container = $i("editarAtributosForm"),
				divsT = container.getElementsByTagName("div"),
				n = divsT.length,
				i = 0,
				dv = "",
				inputs = "",
				codigo_tipo_regiao = $i("i3geoCartoRegioesEditaveis").value,
				id_medida_variavel = $i("editarAtributosComboMedidas").value,
				identificador_regiao = $i("editarAtributosidentificador_regiao"),
				nj,
				j,
				colunas = [],
				colunasT = [],
				valores = [],
				valoresT = [],
				idsunicosT = [],
				idsunicos = [],
				p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=salvaAtributosMedidaVariavel",
				re = new RegExp("idunico_", "g"),//prefixo usado para marcar o id dos elementos input que contem os valores que se quer obter
				temp = function(retorno){
					//TODO nao esquecer de refazer a lista
					editorlimites.editarAtributos.pegaDados();
					i3GEO.janela.AGUARDEMODAL = false;
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
				idsunicos = [];
				for(j=0;j<nj;j++){
					colunas.push(inputs[j].name);
					valores.push(inputs[j].value);
					idsunicos.push(inputs[j].id.replace(re,''));
				}
				colunasT.push(colunas.join(";"));
				valoresT.push(valores.join(";"));
				idsunicosT.push(idsunicos.join(";"));
			}
			i3GEO.janela.AGUARDEMODAL = true;
			i3GEO.janela.abreAguarde("aguardeSalvaAtributos","Salvando...");
			cpJSON.call(p,"foo",temp,"&codigo_tipo_regiao="+codigo_tipo_regiao+"&identificador_regiao="+identificador_regiao+"&id_medida_variavel="+id_medida_variavel+"&colunas="+colunasT[0]+"&valores="+valoresT.join("|")+"&idsunicos="+idsunicosT[0]);
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
			i3GEO.janela.tempoMsg("Ap&oacute;s escolher a medida da vari&aacute;vel, clique no mapa para escolher a regi&atilde;o.");
			YAHOO.util.Event.addListener(janela[0].close, "click", editorlimites.mudaicone);
		},
		html: function(){
			var ins = '' +
				'<p class="paragrafo" ><div id="editarAtributosVariaveis" ></div></p>' +
				'<p class="paragrafo" ><div id="editarAtributosMedidasVariavel" ></div></p>' +
				'<p class="paragrafo" ><div id="editarAtributosRegiao" ></div></p>' +
				'<p class="paragrafo" ><div id="editarAtributosForm" ></div></p>' +
				'';
			return ins;
		},
		comboVariaveis: function(){
			 var temp = function(dados){
				var i,n = dados.length, ins = '';
				ins += '<p class="paragrafo" >Escolha uma vari&aacute;vel para editar</p>';
				ins += "<select style='box-shadow:0 1px 5px gray;width:200px' onchange='editorlimites.editarAtributos.comboMedidasVariavel(this)'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
				}
				ins += "</select>";
				$i("editarAtributosVariaveis").innerHTML = ins;
			};
			i3GEO.php.listaVariavel(temp,"i3geo_metaestat");
		},
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
		}
	}
};