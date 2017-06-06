if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.legenda =
{
	/**
	 * Propriedade: incluiBotaoLibera
	 *
	 * Define se na legenda sera incluido o botao para liberar a legenda e inclui-la em uma janela flutuante
	 *
	 * Tipo:
	 *
	 * {boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	incluiBotaoLibera : true,
	/**
	 * Armazena o id definido na criacao da legenda
	 */
	ID : "",
	/**
	 * Armazena a lista de camadas que devem ficar escondidas na legenda
	 */
	CAMADASSEMLEGENDA : [],
	/**
	 * posicao apos mover
	 */
	POSICAO: "",
	CONFIG: {
		"idOnde":"",
		"idLegenda": ""
	},
	inicia : function(config) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.legenda.inicia()");

		if(config){
			$.each( config, function( i,v ) {
				i3GEO.legenda.CONFIG[i] = v;
			});
		}
		config = i3GEO.legenda.CONFIG;
		if (!$i(config.idOnde)) {
			return;
		}
		i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
		   "i3GEO.legenda.atualiza()"
		]);
		i3GEO.legenda.atualiza();
	},
	/**
	 * Function: atualiza
	 *
	 * Atualiza o elemento HTML do mapa utilizado para mostrar a legenda
	 */
	atualiza : function() {
		var idleg = $i(i3GEO.legenda.CONFIG.idLegenda);
		var tamanho = $($("#" + i3GEO.legenda.CONFIG.idLegenda).attr("data-template")).attr("data-size").split(",");

		if (idleg && idleg.style.display === "block") {
			i3GEO.php.criaLegendaJSON(i3GEO.legenda.montaLegenda, "", tamanho[0], tamanho[1]);
		}
	},
	montaLegenda : function(retorno){
		var legenda = "",
			t,idleg;

		idleg = $i(i3GEO.legenda.CONFIG.idLegenda);
		idleg.innerHTML = $trad("o1");

		if (retorno.data.legenda != "") {
			$(".legendaTemaSolto").remove();
			//ins = "<div id='legendaOpcoes' style='text-align:left; margin-bottom:10px;'></div>";
			//ins += "<div id='corpoLegi' class='i3GEOcorpoLegi'>" + legenda + "</div>";
			t = Mustache.to_html(
					"{{#data}}" + $($("#" + i3GEO.legenda.CONFIG.idLegenda).attr("data-template")).html() + "{{/data}}",
					{"data":retorno.data.legenda}
				);
			idleg.innerHTML = t;

			$("#" + i3GEO.legenda.CONFIG.idLegenda).find(".draggable").draggable({
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


			/*
			ins = [{
				text: $trad("mostraTodosLegenda"),
				url: "javascript:i3GEO.mapa.legendaHTML.mostraTodosOsTemas();"
			},{
				text: $trad("mostraSoLegenda"),
				url: "javascript:i3GEO.mapa.legendaHTML.mostraSoLegenda();"
			},{
				text: "PNG",
				url: "javascript:i3GEO.mapa.legendaHTML.png();"
			}];
			//mostra opcao que permite liberar a legenda (usado quando nao esta em uma janela flutuante)

			if (i3GEO.mapa.legendaHTML.incluiBotaoLibera === true) {
				ins.push({
					text: "Abre em uma janela",
					url: "javascript:i3GEO.mapa.legendaHTML.libera();"
				});
			}
			if($i("legendaOpcoes").getElementsByTagName("span").length == 0){
				new YAHOO.widget.Button({
					type: "menu",
					label: $trad("opcoes"),
					name: "legendaOpcoes",
					menu: ins,
					container: "legendaOpcoes"
				});
			}
			*/

		} else {
			idleg.innerHTML = "";
		}
		/*
		i3GEO.mapa.legendaHTML.escondeTemasMarcados();
		// desmarca as classes desligadas
		desativar = retorno.data.desativar;
		for (tema in desativar) {
			for (classe in desativar[tema]) {
				ins = $i("liblegendack_" + tema + "_" + desativar[tema][classe]);
				if (ins) {
					ins.checked = false;
				}
			}
		}
		*/
	},
	png: function() {
		var obj = $i("i3GEOconteudoLegenda");
		if($i("wlegenda")){
			obj.style.width = $i("wlegenda").style.width;
		}
		else{
			obj.style.width ="400px";
		}
		if($i("wlegenda_corpo")){
			obj.style.height = $i("wlegenda_corpo").style.height;
		}
		else{
			obj.style.height ="400px";
		}
		i3GEO.mapa.dialogo.html2canvas(obj);
	},
	mostraSoLegenda: function(){
		var n, i, temp, raiz = $i("corpoLegi").parentNode;
		temp = raiz.getElementsByClassName("i3GEOLegendaExcluiTema");
		n = temp.length;
		for (i = 0; i < n; i++) {
			temp[i].style.display = "none";
		}
		temp = raiz.getElementsByTagName("input");
		n = temp.length;
		for (i = 0; i < n; i++) {
			temp[i].style.display = "none";
		}
		temp = raiz.getElementsByClassName("temaSwitch");
		n = temp.length;
		for (i = 0; i < n; i++) {
			temp[i].style.display = "none";
		}
	},

	/**
	 * Liga ou desliga um unico tema. Utilizado pela legenda HTML, permitindo que um tema seja processado diretamente na legenda.
	 *
	 * Parametro:
	 *
	 * inputbox {object) - objeto do tipo input checkbox com a propriedade value indicando o codigo do tema que sera processado
	 */
	ativaDesativaTema : function(inputbox) {
		var temp = function() {
			// i3GEO.contadorAtualiza++;
			i3GEO.php.corpo(i3GEO.atualiza, i3GEO.configura.tipoimagem);
			i3GEO.arvoreDeCamadas.atualiza("");
			i3GEO.janela.fechaAguarde("redesenha");
		};
		if (!inputbox.checked) {
			i3GEO.php.ligatemas(temp, inputbox.value, "");
		} else {
			i3GEO.php.ligatemas(temp, "", inputbox.value);
		}
	},
	escondeTema : function(tema) {
		var d = $i("legendaLayer_" + tema);
		if (d) {
			d.style.display = "none";
			i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA.push(tema);
		}
	},
	escondeTemasMarcados : function() {
		var temas = i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA, n = temas.length, i, temp;
		for (i = 0; i < n; i++) {
			temp = $i(temas[i]);
			if (temp) {
				temp.style.display = "none";
			}
		}
	},
	mostraTodosOsTemas : function() {
		i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA = [];
		i3GEO.mapa.legendaHTML.atualiza();
	},
	/**
	 * Function: libera
	 *
	 * Libera a legenda criando uma janela flutuante sobre o mapa
	 *
	 * Parametros:
	 *
	 * {sim|nao} - (opcional) inclui ou nao o checkbox que permitem desligar a camada
	 *
	 * {numeric} - largura da janela
	 *
	 * {numeric} - altura
	 *
	 * {numeric} - posicao desde o topo
	 *
	 * {numeric} - posicao desde a esquerda
	 */
	libera : function(ck, largura, altura, topo, esquerda) {
		if (!ck) {
			ck = "nao";
		}
		if (!largura) {
			largura = 360;
		}
		if (!altura) {
			altura = 300;
		}
		var cabecalho, minimiza, janela, titulo;
		if(i3GEO.mapa.legendaHTML.POSICAO != ""){
			topo = i3GEO.mapa.legendaHTML.POSICAO[1];
			esquerda = i3GEO.mapa.legendaHTML.POSICAO[0];
		}
		//
		// remove se a legenda ja esta aberta em outro lugar
		//
		i3GEO.util.removeChild("corpoLegi");
		i3GEO.util.defineValor(i3GEO.mapa.legendaHTML.ID, "innerHTML", "");
		//
		// remove a janela se ja existir
		//
		janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
		if (janela) {
			i3GEO.janela.destroi("wlegenda");
		}
		cabecalho = function() {
		};
		minimiza = function() {
			var t = i3GEO.janela.minimiza("wlegenda", "100px");
			if (t === "min") {
				$i("legendaTituloI").style.display = "none";
			} else {
				$i("legendaTituloI").style.display = "block";
			}
		};
		titulo =
			"<span class='i3GEOiconeFerramenta i3GEOiconeLegenda' title='" + $trad("P3")
			+ "'></span>"
			+ "<div class='i3GeoTituloJanela' id='legendaTituloI'>"
			+ $trad("p3")
			+ "</div>";
		janela = i3GEO.janela.cria(largura + "px", altura + "px", "", "", "", titulo, "wlegenda", false, "hd", cabecalho, minimiza,"","","","","nao");
		$i("wlegenda_corpo").style.backgroundColor = "white";
		i3GEO.mapa.legendaHTML.ID = "wlegenda_corpo";
		i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
		                                             "i3GEO.mapa.legendaHTML.atualiza()"
		                                             ]);
		janela[0].moveEvent.subscribe(function(o,p){
			i3GEO.mapa.legendaHTML.POSICAO = p[0];
		}
		);
		i3GEO.mapa.legendaHTML.atualiza();
		if (topo && esquerda) {
			janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
			janela.moveTo(esquerda, topo);
		}
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
		var temp = function(retorno) {
			//i3GEO.atualiza();
			i3GEO.Interface.atualizaTema(retorno, leg.name);
		};
		i3GEO.php.inverteStatusClasse(temp, leg.name, leg.value);
	}
};
