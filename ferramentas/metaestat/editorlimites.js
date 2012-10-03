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
editorlimites = {
	/**
	 * Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela
	 *
	*/
	aguarde: "",
	iddiv: "",
	drawingManager: "",
	selectedShape: null,
	shapes: [],
	/**
	 * Inicia o editor
	 *
	 * @param {String} Id do DIV que receberá o conteúdo HTML do editor
	 * @return
	*/
	inicia: function(iddiv){
		var i,n,ics;
		editorlimites.iddiv = iddiv;
		$i(iddiv).innerHTML = editorlimites.html();
		ics = $i(iddiv).getElementsByTagName("button");
		n = ics.length;
		i3GEO.barraDeBotoes.ativaBotoes();
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
				editable: true
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

	Gera o código html para apresentação das opções da ferramenta

	Retorno:

	String com o código html
	*/
	html:function(){
		var ins = '' +
		'	<button title="Desenhar um polígono" onclick="editorlimites.digitalizaPol(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/polygon-create.png" /></button>' +
		'	<button title="Capturar polígono de um tema" onclick="editorlimites.ativaCaptura()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/layer-import.png" /></button>' +
		'	<button title="Selecionar" onclick="editorlimites.seleciona(this)"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/select.png" /></button>' +
		'	<button title="Apagar selecionado" onclick="editorlimites.deleteSelectedShape()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/selected-delete.png" /></button>' +
		//'	<button title="Converter em shapefile, adiciona ao mapa e download" onclick="editorlimites.criatema()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/vector-save.png" /></button>' +
		//'	<button title="Upload de shapefile" onclick="editorlimites.upload.criaJanelaFlutuante()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/open.png" /></button>' +
		//'	<button title="Relatório CMAS" onmousedown="editorlimites.mudaicone()" onclick="editorlimites.relatorioCmas()" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/table.png" /></button>' +
		//'	<button onmousedown="editorlimites.mudaicone()" id="pan" ><img  src="'+i3GEO.configura.locaplic+'/imagens/gisicons/pan.png" /></button>' +
		//'	<button onmousedown="editorlimites.mudaicone()" id="zoomli" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/zoom-region.png" /></button>' +
		//'	<button onmousedown="editorlimites.mudaicone()" id="zoomtot" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/zoom-extent.png" /></button>' +
		//'	<button onmousedown="editorlimites.mudaicone()" id="identifica" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/identify.png" /></button>' +
		//'	<button onmousedown="editorlimites.mudaicone()" id="mede" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/length-measure.png" /></button>' +
		//'	<button onmousedown="editorlimites.mudaicone()" id="area" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/area-measure.png" /></button>' +
		//'	<button title="Imprimir" onmousedown="editorlimites.mudaicone()" onclick="editorlimites.imprimir()" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/print.png" /></button>' +
		'	<button title="Ajuda" onmousedown="editorlimites.mudaicone()" onclick="editorlimites.Ajuda()" ><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/help-contents.png" /></button>';
		return ins;
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
		/*
		if (editorlimites.selectedShape) {
			editorlimites.selectedShape.setEditable(false);
			editorlimites.selectedShape = null;
		}
		*/
	},
	deleteSelectedShape: function() {
		var i,
		n = editorlimites.shapes.length;
		if(n > 0){
			var x = window.confirm("Exclui os elementos selecionados?");
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
			alert("Selecione pelo menos uma figura");
		}
		/*
		if (editorlimites.selectedShape) {
        	editorlimites.selectedShape.setMap(null);
        }
        */
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
	ativaCaptura: function(){
		var cabecalho,minimiza,janela,temp;
		editorlimites.mudaicone();
		if($i("capturaPoligono_corpo"))	{
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("editorlimites.capturaPoligonoTema()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("editorlimites.capturaPoligonoTema()");}
			return;
		}
		cabecalho = function(){
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("editorlimites.capturaPoligonoTema()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("editorlimites.capturaPoligonoTema()");}
		};
		minimiza = function(){
			i3GEO.janela.minimiza("capturaPoligono");
		};
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		janela = i3GEO.janela.cria(
			"250px",
			"100px",
			"",
			"",
			"",
			"Captura polígono",
			"capturaPoligono",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		$i("capturaPoligono_corpo").style.backgroundColor = "white";
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("editorlimites.capturaPoligonoTema()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.util.comboTemas(
			"editorlimitesComboTemasPol",
			function(retorno){
				$i("capturaPoligono_corpo").innerHTML = "<p class='paragrafo'>Escolha o tema e clique no mapa para obter o polígono que poderá ser utilizado para gerar o relatório:<br><br>"+retorno.dados;
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("editorlimites.capturaPoligonoTema()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("editorlimites.capturaPoligonoTema()");}
				$i("editorlimitesComboTemasPol").style.width = "200px";
			},
			"capturaPoligono_corpo",
			"",
			false,
			"poligonos"
		);
	},
	capturaPoligonoTema: function(){
		var temp,tema,p,par,
			aguarde = $i("capturaPoligono_imagemCabecalho");
		if(!$i("editorlimitesComboTemasPol")){
			i3GEO.eventos.MOUSECLIQUE.remove("editorlimites.capturaPoligonoTema()");
		}
		else{
			temp = function(retorno){
					var re,n,i,j,
						wkt = retorno.data[0].resultado[0][0].wkt,
						pontos = [],
						aguarde = $i("capturaPoligono_imagemCabecalho");
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
					editorlimites.upload.adicionaPoligonos([pontos]);
				};
			tema = $i("editorlimitesComboTemasPol").value;
			if(tema != ""){
				if(aguarde && aguarde.style.visibility == "hidden"){
					aguarde.style.visibility = "visible";
					p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php";
					par = "funcao=identifica2&opcao=tema&xy="+objposicaocursor.ddx+","+objposicaocursor.ddy+"&resolucao=1&g_sid="+i3GEO.configura.sid+"&ext=&listaDeTemas=&wkt=sim&tema="+tema;
					cpJSON.call(p,"identifica",temp,par);
				}
			}
		}
	},
	/*
	Function: mudaicone

	Altera as bordas dos ícones
	*/
	mudaicone: function(){
		var c = $i(editorlimites.iddiv),
			ci = c.getElementsByTagName("img"),
			n = ci.length,
			i;
		for(i=0;i<n;i++){
			ci[i].parentNode.style.backgroundColor = "#F5F5F5";
		}
		i3GEO.eventos.MOUSECLIQUE = [];
	},
	digitalizaPol: function(botao){
		editorlimites.mudaicone();
		botao.style.backgroundColor = "#cedff2";
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		editorlimites.drawingManager.setOptions({
			drawingMode: google.maps.drawing.OverlayType.POLYGON
		});
	},
	seleciona: function(botao){
		editorlimites.mudaicone();
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		botao.style.backgroundColor = "#cedff2";
		editorlimites.drawingManager.setOptions({
			drawingMode: null
		});
	},
	criatema: function(botao){
		var c = editorlimites.getCoordenadas(),
			temp,wkt;
		editorlimites.mudaicone();
		if(c.coordenadas.length > 0){
			temp = function(retorno){
				if(i3GEO.janela){
					i3GEO.janela.fechaAguarde("i3GEO.editorPoli");
				}
				i3GEO.atualiza();
				i3GEO.tema.dialogo.download(retorno.data);
			};
			wkt = editorlimites.toWKT(c);
			if(wkt == ""){
				alert("Selecione um polígono");
				return;
			}
			i3GEO.janela.abreAguarde("i3GEO.editorPoli","Poligonos");
			i3GEO.php.funcoesGeometriasWkt(temp,wkt,"converteSHP");
		}
		else{
			alert("Selecione pelo menos uma figura");
			return false;
		}
	},
	relatorioCmas: function(){
		var wkt,cabecalho,minimiza,ins,
		  c = editorlimites.getCoordenadas();
		editorlimites.mudaicone();
		if(c.coordenadas.length > 0){
			if($i("parano_corpo"))
			{return;}
			cabecalho = function(){
			};
			minimiza = function(){
				i3GEO.janela.minimiza("parano");
			};
			i3GEO.janela.cria(
				"210px",
				"100px",
				"",
				"",
				"",
				"Relatório",
				"parano",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			$i("parano_corpo").style.backgroundColor = "white";
			ins = "<p class='paragrafo'>Selecione o ano:<br><br><select id='anoRel'><option value='2003'>2003</option><option value='2005'>2005</option><option value='2007'>2007</option><option value='2008'>2008</option><option value='2009'>2009</option></select>";
			ins += "<br><br><input id=botaorelatorio type='button' value='Criar relatório' />";
			$i("parano_corpo").innerHTML = ins;
			new YAHOO.widget.Button(
				"botaorelatorio",
				{onclick:{fn: function(){
					alert("O relatório será aberto em uma nova aba do navegador");
					wkt = editorlimites.toWKT(editorlimites.getCoordenadas());
					if(wkt == ""){
						alert("Selecione um polígono");
						return;
					}
					$i("relatorioCMAS_wkt").value = wkt;
					$i("relatorioCMAS_ano").value = $i("anoRel").value;
					$i("relatorioCMAS_g_sid").value = i3GEO.configura.sid;
					$i("relatorioCMAS_formato").value = "html";
					$i("relatorioCMAS").action = i3GEO.configura.locaplic+"/ipam/relatoriocmas.php";
					$i("relatorioCMAS").submit();
				}}}
			);
		}
		else{
			alert("Selecione pelo menos uma figura");
			return false;
		}
	},
	upload: {
		aguarde: "",
		adicionaPoligonos: function(listaDePontos){
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
					editable: true
				});
				google.maps.event.addListener(pol, 'click', function() {
					editorlimites.setSelection(pol);
				});
				editorlimites.shapes.push(pol);
			}
		},
		inicia: function(iddiv){
			try{
				$i(iddiv).innerHTML += editorlimites.upload.html();
				new YAHOO.widget.Button(
					"i3GEOuploadbotao1",
					{onclick:{fn: editorlimites.upload.submete}}
				);
				i3GEO.util.radioEpsg(
					function(retorno)
					{$i("i3GEOuploadListaepsg").innerHTML = retorno.dados;},
					"i3GEOuploadListaepsg",
					"upload"
				);
			}
			catch(erro){alert(erro);}
		},
		html:function(){
			var ins = '<form id=i3GEOuploadf target="i3GEOuploadiframe" action="'+i3GEO.configura.locaplic+'/ipam/editor/upload.php" method="post" ENCTYPE="multipart/form-data">' +
			'<p class="paragrafo" >shp: <br><input class=digitar type="file" size=42 name="i3GEOuploadshp" style="top:0px;left:0px;cursor:pointer;"></p>' +
			'<p class="paragrafo" >shx: <br><input class=digitar type="file" size=42 name="i3GEOuploadshx" style="top:0px;left:0px;cursor:pointer;"></p>' +
			'<p class="paragrafo" >dbf: <br><input class=digitar type="file" size=42 name="i3GEOuploaddbf" style="top:0px;left:0px;cursor:pointer;"></p>';
			if(i3GEO.parametros.editor === "sim")
			{ins += '<p class="paragrafo" >pasta no servidor onde os dados<br>serão armazenados (opcional):<br><input class=digitar type="text" size=45 name="dirDestino" style="top:0px;left:0px;cursor:pointer;"></p>';}
			ins += '<p class="paragrafo" >Tipo de geometria: ' +
			'	<select id=tipo name=tipo >' +
			'	<option value="">não conhecido</option>' +
			'	<option value="1">pontual</option>' +
			'	<option value="5">poligonal</option>' +
			'	<option value="3">linear</option>' +
			'	</select>' +
			'</p>' +
			'<p class=paragrafo >Proje&ccedil;&atilde;o:</p>' +
			'<div id=i3GEOuploadListaepsg width="98%" style="text-align:left;border:1px solid gray;left:0px;overflow:auto;height:60px"></div>' +
			'<br><p class="paragrafo" ><input id=i3GEOuploadbotao1 type="button" value="Enviar" size=12 name="submit">' +
			'<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >' +
			'<input type="hidden" name="MAX_FILE_SIZE" value="1000000">' +
			'</form>' +
			"<p class='paragrafo' style=color:red >Não utilize '_' no nome do arquivo. Apenas letras e números são aceitos!!!</p>" +
			'<iframe name=i3GEOuploadiframe style="text-align:left;border:1px solid gray;" width="98%" height="60px"></iframe>';
			return ins;
		},
		criaJanelaFlutuante: function(){
			var janela,divid,titulo,cabecalho,minimiza;
			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOF.upload");
			};
			titulo = "Upload de shapefile <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=27' >&nbsp;&nbsp;&nbsp;</a>";
			janela = i3GEO.janela.cria(
				"355px",
				"470px",
				"",
				"",
				"",
				titulo,
				"editorlimites.upload",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			divid = janela[2].id;
			$i("editorlimites.upload_corpo").style.backgroundColor = "white";
			editorlimites.upload.aguarde = $i("editorlimites.upload_imagemCabecalho").style;
			editorlimites.upload.inicia(divid);
		},
		submete: function(){
			if(editorlimites.upload.aguarde.visibility==="visible")
			{return;}
			editorlimites.upload.aguarde.visibility="visible";
			$i("i3GEOuploadf").submit();
		}
	},
	imprimir: function(){
		var wkt,cabecalho,minimiza,ins;
		if($i("parimprimir_corpo"))
		{return;}
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("parimprimir");
		};
		i3GEO.janela.cria(
				"210px",
				"100px",
				"",
				"",
				"",
				"Imprimir",
				"parimprimir",
				false,
				"hd",
				cabecalho,
				minimiza
		);
		$i("parimprimir_corpo").style.backgroundColor = "white";
		ins = "<p class='paragrafo'>Título:<br><br><input style='width:180px;cursor:text' id='tituloMapa' />";
		ins += "<br><br><input id=botaoimprimirmapa type='button' value='Imprimir' />";
		$i("parimprimir_corpo").innerHTML = ins;
		new YAHOO.widget.Button(
				"botaoimprimirmapa",
				{onclick:{fn: function(){
					wkt = editorlimites.toWKT(editorlimites.getCoordenadas());
					$i("mapaCMAS_wkt").value = wkt;
					$i("mapaCMAS_titulo").value = $i("tituloMapa").value;
					$i("mapaCMAS_g_sid").value = i3GEO.configura.sid;
					$i("mapaCMAS_formato").value = "pdf";
					$i("mapaCMAS_mapexten").value = i3GEO.parametros.mapexten;
					$i("mapaCMAS").action = i3GEO.configura.locaplic+"/ipam/a4lpaisagempdf.php";
					$i("mapaCMAS").submit();
				}}}
		);
	}
};