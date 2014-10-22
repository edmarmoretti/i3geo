/*
 *   Esse plugin e parte do software livre i3Geo
 *
 *   Baseado em ChartPlus IT4biz IT Solutions Ltda
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * changed by edmar.moretti@gmail.com
 */

var i3GeoMap = Backbone.View.extend({
	opcoes: {cores:"",size:0,tipo:"",indicecoluna:"",cores:"",coluna:"",locaplic:"",outlinecolor:""},
	coreshex:  ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5" ],
	initialize: function(args) {
		this.workspace = args.workspace;

		// Create a unique ID for use as the CSS selector
		this.id = _.uniqueId("i3GeoMap_");
		$(this.el).attr({ id: this.id });

		// Bind map rendering to query result event
		_.bindAll(this, "render", "receive_data", "process_data", "show",
				"setOptions");

		this.workspace.bind('query:result', this.receive_data);

		// Add chart button
		this.add_button();
		this.workspace.toolbar.i3GeoMap = this.show;

		// Listen to adjust event and rerender chart
		//this.workspace.bind('workspace:adjust', this.render);
		// Create navigation
		this.nav = $("" +
			"<div style='overflow: hidden;padding: 10px 5px;' >"+
			"<div class='fields_list' style='height:34px;'>"+
				"<div class='fields_list_header limit'><span class='i18n_translated'>Mapa</span></div>"+
				"<div class='fields_list_body filter' style='margin:4px 5px 5px 5px'>"+
					//"<ul class='connectable ui-sortable' style=''>"+
						"<input type=button name=mapaBarras value='Barras' />"+
						"<input type=button name=mapaPizzas value='Pizzas' />"+
						"&nbsp;<input type=button name=raiosProporcionais value='Raios' />"+
						"&nbsp;<input type=button name=circulosProporcionais value='C&iacute;rculos' />"+
						"&nbsp;<input type=button name=coresChapadas value='Cores' />"+
						"&nbsp;<input type=button name=calor value='Calor' />"+
						"&nbsp;<input type=button name=atualizarMapa value='Atualiza' />"+
						"&nbsp;<input type=button name=reiniciarMapa value='Reinicia' />"+
						"&nbsp;<input type=button name=fecharMapa value='Fecha' />"+
					//"</ul>"+
				"</div>"+
			"</div>"+
			"</div>"+
			"<div id='message'></div>"+
			"<form id='formi3GeoMap' method='post' target='iframei3GeoMap' action='"+parametroUrl("locaplic")+"/ferramentas/saiku/cartograma.php' >"+
			"<input type=hidden name=opcoes id=formi3GeoMapOpcoes value='' />"+
			"<input type=hidden name=g_sid id=formi3GeoMapg_sid value='"+parametroUrl("g_sid")+"' />"+
			"<input type=hidden name=dados id=formi3GeoMapdados value='' />"+
			"<input type=hidden name=metadados id=formi3GeoMapmetadados value='' />"+
			"</form>" +
			"<iframe id='iframei3GeoMap' name='iframei3GeoMap' style='width:100%;height:200px;display:block' />"
				);
		this.nav.find('input').click(this.setOptions);

		// Append chart to workspace
		$(this.workspace.el).find('.workspace_results')
			.prepend($(this.el).hide())
			.prepend(this.nav.hide());
	},
	add_button: function() {
		var $chart_button =
				$('<a href="#i3GeoMap" class="i3GeoMap button disabled_toolbar i18n" title="Mapa com i3Geo"></a>')
				.css({  'background-image': "url('js/saiku/plugins/i3GeoMap/mapa.png')",
								'background-repeat':'no-repeat',
								'background-position':'20% 50%'
						});

		var $chart_li = $('<li class="seperator"></li>').append($chart_button);
		$(this.workspace.toolbar.el).find("ul").append($chart_li);
	},
	fecha: function(){
		$(this.workspace.toolbar.el).find('.i3GeoMap').removeClass('on');
		$(this.el).hide();
		$(this.nav).hide();
		this.workspace.processing.hide();
		this.workspace.adjust();
		$(this.workspace.el).find('.workspace_results table').show();
		this.workspace.table.render({ data: this.workspace.query.result.lastresult() });
	},
	atualizarMapa: function(){
		document.getElementById('formi3GeoMap').submit();
	},
	reiniciarMapa: function(){
		document.getElementById('formi3GeoMapdados').value = "";
		this.opcoes.locaplic = parametroUrl("locaplic");
		this.opcoes.mapext = parametroUrl("mapext");
		document.getElementById("formi3GeoMapOpcoes").value = JSON.stringify(this.opcoes);
		document.getElementById('formi3GeoMap').submit();
	},
	show: function(event, ui) {
		//$(this.workspace.el).find('.workspace_results table').toggle();
		$(this.el).toggle();
		$(this.nav).toggle();
		$(event.target).toggleClass('on');
		$("#message").html("");
		this.nav.find('input').show();
		if ($(event.target).hasClass('on')) {
			this.process_data({ data: this.workspace.query.result.lastresult() });
			//this.render();
		}
	},

	setOptions: function(event) {
		var type = $(event.target).attr('name');
		this.opcoes.coluna = "";
		this.opcoes.indicecoluna = "";
		this.opcoes.cores = "";
		this.opcoes.outlinecolor = "";
		this[type](this);
		return false;
	},
	fecharMapa: function(){
		var i = document.getElementById("iframei3GeoMap");
		if(i){
			i.src = "";
			i.style.display = "none";
			i.style.height = "0px";
		}
	},
	mapaPizzas: function(s){
		this.opcoes.size = 50;
		this.opcoes.cores = coresHex2Rgb(this.coreshex);
		$.fancybox("Cor do contorno:  "+this.cores("corContorno")+
				"Tamanho das pizzas (em pixels):<br><input type=text value='"+this.opcoes.size+"' size=6 id='mapaPizzasSize' />" +
				"<br><input type=button value='OK' id='mapaPizzasOk' />" +
				"&nbsp; <input type=button value='Cancela' id='mapaPizzasCancela' />"
				,
				{
					'autoDimensions'    : false,
					'autoScale'         : false,
					'height'            :  250,
					'width'             :  350,
					'transitionIn'      : 'none',
					'transitionOut'     : 'none',
					'showCloseButton'	: false,
					'modal'				: false
				}
		);
		document.getElementById("mapaPizzasOk").onclick = function(){
			s.opcoes.tipo = "mapaPizzas";
			s.opcoes.size = document.getElementById("mapaPizzasSize").value;
			s.opcoes.indicecoluna = [];
			var cori = $('input[name="corContorno"]').val();
			s.opcoes.outlinecolor = hex2rgb(cori);
			s.render();
			$.fancybox.close();
		};
		document.getElementById("mapaPizzasCancela").onclick = function(){
			$.fancybox.close();
			s.fecharMapa();
		};
		jQuery('select[name="corContorno"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
	},

	mapaBarras: function(s){
		this.opcoes.size = 50;
		this.opcoes.cores = coresHex2Rgb(this.coreshex);
		$.fancybox("Cor do contorno:  "+this.cores("corContorno")+
				"Tamanho das barras (em pixels):<br><input type=text value='"+this.opcoes.size+"' size=6 id='mapaBarrasSize' />" +
				"<br><input type=button value='OK' id='mapaBarrasOk' />" +
				"&nbsp; <input type=button value='Cancela' id='mapaBarrasCancela' />"
				,
				{
					'autoDimensions'    : false,
					'autoScale'         : false,
					'height'            :  250,
					'width'             :  350,
					'transitionIn'      : 'none',
					'transitionOut'     : 'none',
					'showCloseButton'	: false,
					'modal'				: false
				}
		);
		document.getElementById("mapaBarrasOk").onclick = function(){
			s.opcoes.tipo = "mapaBarras";
			s.opcoes.size = document.getElementById("mapaBarrasSize").value;
			s.opcoes.indicecoluna = [];
			var cori = $('input[name="corContorno"]').val();
			s.opcoes.outlinecolor = hex2rgb(cori);
			s.render();
			$.fancybox.close();
		};
		document.getElementById("mapaBarrasCancela").onclick = function(){
			$.fancybox.close();
			s.fecharMapa();
		};
		jQuery('select[name="corContorno"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
	},
	coresChapadas: function(s){
		this.opcoes.size = 0;
		$.fancybox("Cor inicial:  "+this.cores("corInicial")+
				"Cor final:  "+this.cores("corFinal")+
				"Coluna com os valores:<br>"+
				"<select id='coresChapadasColuna' style='border:1px solid #BBBBBB;'>"+this.opcoesColunas()+"</select>" +
				"<br><input type=button value='OK' id='coresChapadasOk' />" +
				"&nbsp; <input type=button value='Cancela' id='coresChapadasCancela' />"
				,
				{
					'autoDimensions'    : false,
					'autoScale'         : false,
					'height'            :  250,
					'width'             :  350,
					'transitionIn'      : 'none',
					'transitionOut'     : 'none',
					'showCloseButton'	: false,
					'modal'				: false
				}
		);
		document.getElementById("coresChapadasOk").onclick = function(){
			s.opcoes.tipo = "coresChapadas";
			s.opcoes.size = 0;
			s.opcoes.indicecoluna = [parseInt(document.getElementById("coresChapadasColuna").value,10)];
			var cori = $('input[name="corInicial"]').val();
			var corf = $('input[name="corFinal"]').val();
			s.opcoes.cores = [hex2rgb(cori),hex2rgb(corf)];
			s.render();
			$.fancybox.close();
		};
		document.getElementById("coresChapadasCancela").onclick = function(){
			$.fancybox.close();
			s.fecharMapa();
		};
		jQuery('select[name="corInicial"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
		$('input[name="corInicial"]')[0].value = "ffffc7";

		jQuery('select[name="corFinal"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
		$('input[name="corFinal"]')[0].value = "643403";
	},
	raiosProporcionais: function(s){
		this.opcoes.size = 10;
		$.fancybox("Escolha uma cor:  "+this.cores()+
				"Tamanho inicial do c&iacute;rculo (em pixels):<br><input type=text value='"+this.opcoes.size+"' size=6 id='raiosProporcionaisSize' />" +
				"<br>Coluna com os valores:<br>"+
				"<select id='raiosProporcionaisColuna' style='border:1px solid #BBBBBB;'>"+this.opcoesColunas()+"</select>" +
				"<br><input type=button value='OK' id='raiosProporcionaisOk' />" +
				"&nbsp; <input type=button value='Cancela' id='raiosProporcionaisCancela' />"
				,
				{
					'autoDimensions'    : false,
					'autoScale'         : false,
					'height'            :  250,
					'width'             :  350,
					'transitionIn'      : 'none',
					'transitionOut'     : 'none',
					'showCloseButton'	: false,
					'modal'				: false
				}
		);
		document.getElementById("raiosProporcionaisOk").onclick = function(){
			s.opcoes.tipo = "raiosProporcionais";
			s.opcoes.size = document.getElementById("raiosProporcionaisSize").value;
			s.opcoes.indicecoluna = [parseInt(document.getElementById("raiosProporcionaisColuna").value,10)];
			var cor = $('input[name="colour"]').val();
			s.opcoes.cores = [hex2rgb(cor)];
			s.render();
			$.fancybox.close();
		};
		document.getElementById("raiosProporcionaisCancela").onclick = function(){
			$.fancybox.close();
			s.fecharMapa();
		};
		jQuery('select[name="colour"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
	},
	circulosProporcionais: function(s){
		this.opcoes.size = 10;
		$.fancybox("Escolha uma cor:  "+this.cores()+
				"Tamanho inicial do c&iacute;rculo (em pixels):<br><input type=text value='"+this.opcoes.size+"' size=6 id='circulosProporcionaisSize' />" +
				"<br>Coluna com os valores:<br>"+
				"<select id='circulosProporcionaisColuna' style='border:1px solid #BBBBBB;'>"+this.opcoesColunas()+"</select>" +
				"<br><input type=button value='OK' id='circulosProporcionaisOk' />" +
				"&nbsp; <input type=button value='Cancela' id='circulosProporcionaisCancela' />"
				,
				{
					'autoDimensions'    : false,
					'autoScale'         : false,
					'height'            :  250,
					'width'             :  350,
					'transitionIn'      : 'none',
					'transitionOut'     : 'none',
					'showCloseButton'	: false,
					'modal'				: false
				}
		);
		document.getElementById("circulosProporcionaisOk").onclick = function(){
			s.opcoes.tipo = "circulosProporcionais";
			s.opcoes.size = document.getElementById("circulosProporcionaisSize").value;
			s.opcoes.indicecoluna = [parseInt(document.getElementById("circulosProporcionaisColuna").value,10)];
			var cor = $('input[name="colour"]').val();
			s.opcoes.cores = [hex2rgb(cor)];
			s.render();
			$.fancybox.close();
		};
		document.getElementById("circulosProporcionaisCancela").onclick = function(){
			$.fancybox.close();
			s.fecharMapa();
		};
		jQuery('select[name="colour"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
	},
	calor: function(s){
		this.opcoes.size = 10;
		$.fancybox("Raio de um ponto em pixels:<br><input type=text value='10' size=6 id='calorRaio' /><br>" +
				"<br>Coluna com os valores:<br>"+
				"<select id='calorColuna' style='border:1px solid #BBBBBB;'>" +
				"<option value=''>---</option>" +
				this.opcoesColunas() +
				"</select>" +
				"<br>Ou valor de cada ponto:<br><input type=text value='1' size=6 id='valorPonto' /><br>" +
				"<br><input type=button value='OK' id='calorOk' />" +
				"&nbsp; <input type=button value='Cancela' id='calorCancela' />"
				,
				{
					'autoDimensions'    : false,
					'autoScale'         : false,
					'height'            :  250,
					'width'             :  350,
					'transitionIn'      : 'none',
					'transitionOut'     : 'none',
					'showCloseButton'	: false,
					'modal'				: false
				}
		);
		document.getElementById("calorOk").onclick = function(){
			s.opcoes.tipo = "calor";
			s.opcoes.valorPonto = document.getElementById("valorPonto").value;
			s.opcoes.indicecoluna = [parseInt(document.getElementById("calorColuna").value,10)];
			s.opcoes.raio = document.getElementById("calorRaio").value;
			s.render();
			$.fancybox.close();
		};
		document.getElementById("calorCancela").onclick = function(){
			$.fancybox.close();
			s.fecharMapa();
		};
		jQuery('select[name="colour"]').colourPicker({
				ico:    'js/jquery/jquery.colourPicker.gif',
				title:    false
		});
	},

	opcoesColunas: function(){
		var m = this.data.metadata,
			n = m.length,
			i = 0,
			ins = [];
		for(i=1;i<n;i++){
			ins.push("<option value='"+m[i].colIndex+"' >"+m[i].colName+"</option>");
		}
		return ins.join("");
	},
	cores: function(nome){
		if(!nome){
			nome = "colour";
		}
		var cor = "<div id='jquery-colour-picker-example' >" +
			"<p><select name='"+nome+"'>"+
			"<option value='ffffff' selected='selected'>#ffffff</option>"+
			"<option value='ffccc9'>#ffccc9</option>"+
			"<option value='ffce93'>#ffce93</option>"+
			"<option value='fffc9e'>#fffc9e</option>"+
			"<option value='ffffc7'>#ffffc7</option>"+
			"<option value='9aff99'>#9aff99</option>"+
			"<option value='96fffb'>#96fffb</option>"+
			"<option value='cdffff'>#cdffff</option>"+
			"<option value='cbcefb'>#cbcefb</option>"+
			"<option value='cfcfcf'>#cfcfcf</option>"+
			"<option value='fd6864'>#fd6864</option>"+
			"<option value='fe996b'>#fe996b</option>"+
			"<option value='fffe65'>#fffe65</option>"+
			"<option value='fcff2f'>#fcff2f</option>"+
			"<option value='67fd9a'>#67fd9a</option>"+
			"<option value='38fff8'>#38fff8</option>"+
			"<option value='68fdff'>#68fdff</option>"+
			"<option value='9698ed'>#9698ed</option>"+
			"<option value='c0c0c0'>#c0c0c0</option>"+
			"<option value='fe0000'>#fe0000</option>"+
			"<option value='f8a102'>#f8a102</option>"+
			"<option value='ffcc67'>#ffcc67</option>"+
			"<option value='f8ff00'>#f8ff00</option>"+
			"<option value='34ff34'>#34ff34</option>"+
			"<option value='68cbd0'>#68cbd0</option>"+
			"<option value='34cdf9'>#34cdf9</option>"+
			"<option value='6665cd'>#6665cd</option>"+
			"<option value='9b9b9b'>#9b9b9b</option>"+
			"<option value='cb0000'>#cb0000</option>"+
			"<option value='f56b00'>#f56b00</option>"+
			"<option value='ffcb2f'>#ffcb2f</option>"+
			"<option value='ffc702'>#ffc702</option>"+
			"<option value='32cb00'>#32cb00</option>"+
			"<option value='00d2cb'>#00d2cb</option>"+
			"<option value='3166ff'>#3166ff</option>"+
			"<option value='6434fc'>#6434fc</option>"+
			"<option value='656565'>#656565</option>"+
			"<option value='9a0000'>#9a0000</option>"+
			"<option value='ce6301'>#ce6301</option>"+
			"<option value='cd9934'>#cd9934</option>"+
			"<option value='999903'>#999903</option>"+
			"<option value='009901'>#009901</option>"+
			"<option value='329a9d'>#329a9d</option>"+
			"<option value='3531ff'>#3531ff</option>"+
			"<option value='6200c9'>#6200c9</option>"+
			"<option value='343434'>#343434</option>"+
			"<option value='680100'>#680100</option>"+
			"<option value='963400'>#963400</option>"+
			"<option value='986536'>#986536</option>"+
			"<option value='646809'>#646809</option>"+
			"<option value='036400'>#036400</option>"+
			"<option value='34696d'>#34696d</option>"+
			"<option value='00009b'>#00009b</option>"+
			"<option value='303498'>#303498</option>"+
			"<option value='000000'>#000000</option>"+
			"<option value='330001'>#330001</option>"+
			"<option value='643403'>#643403</option>"+
			"<option value='663234'>#663234</option>"+
			"<option value='343300'>#343300</option>"+
			"<option value='013300'>#013300</option>"+
			"<option value='003532'>#003532</option>"+
			"<option value='010066'>#010066</option>"+
			"<option value='340096'>#340096</option></select></p></div>";
		return cor;
	},
	render: function() {
		if (! $(this.workspace.toolbar.el).find('.i3GeoMap').hasClass('on')) {
			this.fecha();
			this.fecharMapa();
			return;
		}
		var series=[];
		//nome das colunas
		var column=[];
		var columnGeoCod = "";
		var indiceColumnGeoCod = "";
		var metadata = [];
		var indicecoluna = "";
		for(var i=0; i < this.data.metadata.length; i++){
			if(this.opcoes.indicecoluna == this.data.metadata[i].colIndex){
				indicecoluna = i;
			}
			column[i] = this.data.metadata[i].colName;
			//se o usuario escolheu uma coluna, as demais sao marcadas com o nome vazio
			if(this.opcoes.indicecoluna != ""){
				//if(this.opcoes.indicecoluna.indexOf(this.data.metadata[i].colIndex) != -1)
				if(this.opcoes.indicecoluna.indexOf(this.data.metadata[i].colIndex) != -1 || column[i].search("GeoCod") > 0){
					metadata.push(this.data.metadata[i]);
				}
			}
			else{
				metadata.push(this.data.metadata[i]);
			}
			//pega a coluna GeoCod
			if(column[i].search("GeoCod") > 0){
				//verifica se tem mais de um GeoCod
				if(columnGeoCod != ""){
					alert("Existem mais de uma coluna GeoCod!");
					this.fecha();
					$.fancybox.close();
					return;
				}
				columnGeoCod = column[i];
				indiceColumnGeoCod = i;
			}
		}
		if(columnGeoCod === ""){
			alert("Coluna GeoCod nao existe!");
			this.fecha();
			$.fancybox.close();
			//this.nav.find('input').hide();
			return;
		}
		series[0]=column;
		var dados = [];
		if(indicecoluna != ""){
			if (this.data.resultset.length > 0 ) {
				$.each(this.data.resultset, function(key, value) {
					dados.push([value[indiceColumnGeoCod],value[indicecoluna]]);
				});
			}
		}
		else{
			if (this.data.resultset.length > 0 ) {
				$.each(this.data.resultset, function(key, value) {
					var aux=value[0]+'';
					aux = aux.split(" \/ ");
					aux = aux[indiceColumnGeoCod];
					value[0]=aux;
					dados.push(value);
				});
			}
		}
		//preenche os dados do formulario
		this.opcoes.locaplic = parametroUrl("locaplic");
		this.opcoes.mapext = parametroUrl("mapext");
		//alert(JSON.stringify(this.opcoes))
		document.getElementById("formi3GeoMapOpcoes").value = JSON.stringify(this.opcoes);
		document.getElementById("formi3GeoMapdados").value = JSON.stringify(dados);
		document.getElementById("formi3GeoMapmetadados").value = JSON.stringify(metadata);
		document.getElementById("iframei3GeoMap").style.height = parseInt($(this.workspace.el).find('.workspace_results')[0].style.height) - 50 +"px";
		document.getElementById("formi3GeoMap").submit();
		document.getElementById("iframei3GeoMap").style.display = "block";
	},
	receive_data: function(args) {
		if ($(this.workspace.toolbar.el).find('.i3GeoMap').hasClass('on')) {
			this.fecha();
			this.fecharMapa();
			return false;
		}
		return _.delay(this.process_data, 0, args);
	},
	process_data: function(args) {
		this.data = {};
		this.data.resultset = [];
		this.data.metadata = [];
		this.data.height = 0;
		this.data.width = 0;
		if (! $(this.workspace.toolbar.el).find('.i3GeoMap').hasClass('on')) {
			this.fecha();
			this.fecharMapa();
			return;
		}
		var cellset = args.data.cellset;
		var nome = "";
		var colunaGeocod = "";
		var colunaGeocodIndice = "";
		if (cellset && cellset.length > 0) {
			var lowest_level = 0;
			var data_start = 0;
			for (var row = 0; data_start == 0 && row < cellset.length; row++) {
				this.data.metadata = [];
				for (var field = 0; field < cellset[row].length; field++) {
					var firstHeader = [];

					while (cellset[row][field].type == "COLUMN_HEADER" && cellset[row][field].value == "null") {
						row++;
					}
					nome = "";
					//colunaGeocod = "";
					//colunaGeocodIndice = "";
					if (cellset[row][field].type == "ROW_HEADER_HEADER") {
						while(cellset[row][field].type == "ROW_HEADER_HEADER") {
							nome = cellset[row][field].value;
							firstHeader.push(nome);
							if(nome.search("GeoCod") > 0){
								colunaGeocod = nome;
								colunaGeocodIndice = field;
							}
							field++;
						}
						tipo = "linha";
						identificador = cellset[row][field-1].properties.level;
						if(firstHeader.join('/').search("GeoCod") > 0){
							this.data.metadata.push({
								colIndex: 0,
								colType: "String",
								colName: colunaGeocod,
								tipo: tipo,
								identificador: identificador
							});
							lowest_level = field - 1;
						}

					}
					if (cellset[row][field].type == "COLUMN_HEADER" && cellset[row][field].value != "null") {
						var lowest_col_header = 0;
						var colheader = [];
						while(lowest_col_header <= row) {
							colheader.push(cellset[lowest_col_header][field].value);
							lowest_col_header++;
						}

						tipo = "coluna";
						identificador = cellset[row][lowest_col_header].properties.uniquename;

						this.data.metadata.push({
							colIndex: field - lowest_level + 1,
							colType: "Numeric",
							colName: colheader.join('/'),
							tipo: tipo,
							identificador: identificador
						});
						data_start = row+1;
					}
				}
			}

			for (var row = data_start; row < cellset.length; row++) {
				if (cellset[row][0].value !== "") {
					var record = [];
					this.data.width = cellset[row].length - lowest_level + 1;
					var label = "";
					if(cellset[row][colunaGeocodIndice]){
						label = cellset[row][colunaGeocodIndice].value;
					}
					/*
					if(label in labelsSet) {
						labelsSet[label] = labelsSet[label]+1;
						label = label + ' [' + (labelsSet[label] + 1) + ']';
					} else {
						labelsSet[label] = 0;
					}
					*/
					record.push(label);

					for (var col = lowest_level + 1; col < cellset[row].length; col++) {
						var cell = cellset[row][col];
						var value = cell.value || 0;
						// check if the resultset contains the raw value, if not try to parse the given value
						var raw = cell.properties.raw;
						if (raw && raw !== "null") {
								value = parseFloat(raw);
						} else if (typeof(cell.value) !== "number" && parseFloat(cell.value.replace(/[^a-zA-Z 0-9.]+/g,''))) {
								value = parseFloat(cell.value.replace(/[^a-zA-Z 0-9.]+/g,''));
						}
						record.push(value);
					}
					this.data.resultset.push(record);
				}
			}
			//makeSureUniqueLabels(this.data.resultset);
			this.hasProcessed = true;
			this.data.height = this.data.resultset.length;
			//this.cccOptions = this.getQuickOptions(this.cccOptions);
			//this.render();
		} else {
			$(this.el).find('.canvas_wrapper').text("No results").show();
			this.workspace.processing.hide();
			this.workspace.adjust();
		}
	}
});
function hex2rgb(hex,tipo) {
	if(!tipo){
		tipo = "array";
	}
	if (hex[0]=="#") hex=hex.substr(1);
	if (hex.length==3) {
		var temp=hex; hex='';
		temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
		for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
	}
	var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
	if(tipo == "array"){
		return {
			red:   parseInt(triplets[0],16),
			green: parseInt(triplets[1],16),
			blue:  parseInt(triplets[2],16)
		};
	}
	else{
		return parseInt(triplets[0],16)+ " " + parseInt(triplets[1],16) + " " + parseInt(triplets[2],16);
	}
}
function coresHex2Rgb(lista){
	var n = lista.length,
		i =0,
		f = [];
	for(i=0;i<n;i++){
		f.push(hex2rgb(lista[i]," "));
	}
	return f;
}
function loadCSS(file){
	var headID = document.getElementsByTagName("head")[0];
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = file;
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
}

function loadJS(file){
	var headID = document.getElementsByTagName("head")[0];
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.src = file;
	headID.appendChild(newScript);
}

function messageUser(msg){
	$("#message").html(msg).show('slow');
	setTimeout(function(){ jQuery("#message").hide('slow'); }, 2000);
}

function parametroUrl(parametro){
	var params = window.location.search.replace("?","").split("&"),
		n = params.length,
		valor = "",
		i,param;
	for(i=0;i<n;i++){
		param = params[i].split("=");
		if(param[0] == parametro){
			valor = param[1];
		}
	}
	return valor;
}
/**
 * Start Plugin
 */
Saiku.events.bind('session:new', function(session) {
	function new_workspace(args) {
		// Add stats element
			if (typeof args.workspace.i3GeoMap == "undefined") {
				args.workspace.i3GeoMap = new i3GeoMap({ workspace: args.workspace });
			}
	}

	function clear_workspace(args) {
			if (typeof args.workspace.i3GeoMap != "undefined") {
				$(args.workspace.i3GeoMap.nav).hide();
					$(args.workspace.i3GeoMap.el).parents().find('.workspace_results table').show();
					$(args.workspace.i3GeoMap.el).hide();
			}
	}


	// Attach stats to existing tabs
	for(var i = 0; i < Saiku.tabs._tabs.length; i++) {
			var tab = Saiku.tabs._tabs[i];
			new_workspace({
					workspace: tab.content
			});
	};

	// Attach stats to future tabs
	Saiku.session.bind("workspace:new", new_workspace);
	Saiku.session.bind("workspace:clear", clear_workspace);
});
