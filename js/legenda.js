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
			} else {
				config = i3GEO.legenda.config;
				if (!$i(config.idLegenda)) {
					return;
				}
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA", ["i3GEO.legenda.atualiza()"]);
				if(config.janela == false){
					i3GEO.legenda.atualiza(config.idLegenda);
				} else {
					i3GEO.legenda.janela();
					i3GEO.legenda.atualiza();
				}
			}
		},
		/**
		 * Function: atualiza
		 *
		 * Atualiza o elemento HTML do mapa utilizado para mostrar a legenda
		 */
		atualiza : function(idOndeLegenda) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.legenda.atualiza()");

			if (i3GEO.arvoreDeCamadas.comparaTemas(i3GEO.legenda.CAMADAS, i3GEO.arvoreDeCamadas.CAMADAS)) {
				return;
			}
			i3GEO.legenda.CAMADAS = i3GEO.util.cloneObj(i3GEO.arvoreDeCamadas.CAMADAS);
			var idleg, temp, i, tamanho;
			if(!idOndeLegenda){
				idleg = i3GEO.legenda.config.idLegenda;
			} else {
				idleg = idOndeLegenda;
			}
			if(i3GEO.legenda.IDS.indexOf(idleg) == -1){
				i3GEO.legenda.IDS.push(idleg);
			}
			//podem existir mais de um lugar para inserir a legenda
			temp = function(retorno){
				$.each(i3GEO.legenda.IDS, function( index, value ) {
					i3GEO.legenda.montaLegenda(retorno,value);
				});
			};
			i = $i(idleg);
			if (i && i.style.display !== "none") {
				try{
					tamanho = $("#" + idleg).attr("data-size").split(",");
				} catch (e){
					tamanho = [35,25];
				};
				i3GEO.php.criaLegendaJSON(temp, "", tamanho[0], tamanho[1]);
			}
		},
		montaLegenda : function(retorno,idOndeLegenda){
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.legenda.montaLegenda()");

			var legenda = "",
			t,idleg;

			if(!idOndeLegenda){
				idleg = $i(i3GEO.legenda.config.idLegenda);
			} else {
				idleg = $i(idOndeLegenda);
			}
			idleg.innerHTML = $trad("o1");

			if (retorno.data.legenda != "") {
				$(".legendaTemaSolto").remove();
				t = Mustache.to_html(
						"{{#data}}" + i3GEO.template.legenda + "{{/data}}",
						{
							"data":retorno.data.legenda,
							"altera": $trad("p9")
						}
				);
				idleg.innerHTML = t;

				$("#" + i3GEO.legenda.config.idLegenda).find(".draggable").draggable({
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
		},
		mudaCorClasse : function(tema,idclasse) {
			var obj, novoel;
			if (!$i("tempinputcorclasse")) {
				novoel = document.createElement("input");
				novoel.id = "tempinputcorclasse";
				novoel.style.display = "none";
				novoel.type = "hidden";
				novoel.onchange = function() {
					var obj = $("#tempinputcorclasse");
					i3GEO.tema.alteracorclasse(obj.attr("tema"), obj.attr("idclasse"), obj.val());
				};
				document.body.appendChild(novoel);
			}
			$("#tempinputcorclasse").attr({"tema":tema,"idclasse":idclasse});
			i3GEO.util.abreCor("", "tempinputcorclasse");
		},
		janela : function(largura, altura, topo, esquerda) {
			if (!largura) {
				largura = 360;
			}
			if (!altura) {
				altura = 300;
			}
			var cabecalho, minimiza, janela, titulo;
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
			i3GEO.legenda.atualiza("wlegenda_corpo");
			if (topo && esquerda) {
				janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
				janela.moveTo(esquerda, topo);
			}
		}
};
