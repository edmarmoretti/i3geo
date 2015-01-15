if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.atalhosedicao
 */
//TODO verificar se o parametro cache esta funcionando
i3GEOF.atalhosedicao =
{
	tema: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.atalhosedicao.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	 * Function: iniciaDicionario (Depreciado na versao 6.0)
	 *
	 */
	iniciaDicionario : function() {
		i3GEOF.atalhosedicao.iniciaJanelaFlutuante();
	},
	/*
	 * Function: inicia
	 *
	 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	 *
	 * Parametro:
	 *
	 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia : function(iddiv, idjanela) {
		var tema, temp;
		i3GEO.janela.comboCabecalhoTemas(
			"i3GEOFatalhosedicaoComboCabeca",
			"i3GEOFatalhosedicaoComboCabecaSel",
			"atalhosedicao",
		"ligadosComTabela");
		if(i3GEOF.atalhosedicao.tema === ""){
			i3GEOF.atalhosedicao.tema = i3GEO.temaAtivo;
		}
		$i(iddiv).innerHTML = i3GEOF.atalhosedicao.html(idjanela);

		new YAHOO.widget.Button("i3GEOFatalhosedicaoLegenda", {
			onclick : {
				fn : function() {
					i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
					i3GEO.tema.dialogo.editaLegenda();
				}
			}
		});
		$i("i3GEOFatalhosedicaoLegenda-button").style.width = "200px";

		new YAHOO.widget.Button("i3GEOFatalhosedicaoSalva", {
			onclick : {
				fn : function() {
					//obtem os parametros que devem ficar no objeto camada
					i3GEOF.atalhosedicao.metadata($i("i3GEOFatalhosedicaoCache"),true);
					i3GEO.tema.dialogo.salvaMapfile(i3GEOF.atalhosedicao.tema);
				}
			}
		});
		$i("i3GEOFatalhosedicaoSalva-button").style.width = "200px";

		new YAHOO.widget.Button("i3GEOFatalhosedicaoTabela", {
			onclick : {
				fn : function() {
					i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
					i3GEO.tema.dialogo.tabela();
				}
			}
		});
		$i("i3GEOFatalhosedicaoTabela-button").style.width = "200px";

		new YAHOO.widget.Button("i3GEOFatalhosedicaoTexto", {
			onclick : {
				fn : function() {
					i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
					i3GEO.tema.dialogo.toponimia();
				}
			}
		});
		$i("i3GEOFatalhosedicaoTexto-button").style.width = "200px";

		new YAHOO.widget.Button("i3GEOFatalhosedicaoEtiqueta", {
			onclick : {
				fn : function() {
					i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
					i3GEO.tema.dialogo.etiquetas();
				}
			}
		});
		$i("i3GEOFatalhosedicaoEtiqueta-button").style.width = "200px";

		new YAHOO.widget.Button("i3GEOFatalhosedicaoFiltro", {
			onclick : {
				fn : function() {
					i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
					i3GEO.tema.dialogo.filtro();
				}
			}
		});
		$i("i3GEOFatalhosedicaoFiltro-button").style.width = "200px";

		new YAHOO.widget.Button("i3GEOFatalhosedicaoOpacidadeB", {
			onclick : {
				fn : function() {
					var valor = $i("i3GEOFatalhosedicaoOpacidade").value;
					i3GEO.tema.mudatransp(i3GEOF.atalhosedicao.tema,valor);
				}
			}
		});
		$i("i3GEOFatalhosedicaoOpacidadeB-button").style.width = "50px";
		//
		//atualiza os campos que dependem de parametros de cada camada
		//
		tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhosedicao.tema);
		if(tema.cache.toLowerCase() === "sim"){
			$i("i3GEOFatalhosedicaoCache").checked = true;
		}
		$i("i3GEOFatalhosedicaoOpacidade").value = tema.transparency;
	},
	/*
	 * Function: html
	 *
	 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
	 *
	 * Retorno:
	 *
	 * String com o c&oacute;digo html
	 */
	html : function(idjanela) {
		var ins = Mustache.render(i3GEOF.atalhosedicao.MUSTACHE, i3GEOF.atalhosedicao.mustacheHash());
		return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
		var minimiza, cabecalho, janela, divid, temp, titulo;

		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza("i3GEOFatalhosedicao");
		};
		// cria a janela flutuante
		titulo =
			"<div  id='i3GEOFatalhosedicaoComboCabeca' class='comboTemasCabecalho'></div>&nbsp;&nbsp;&nbsp;";
		janela =
			i3GEO.janela.cria(
				"250px",
				"300px",
				"",
				"",
				"",
				titulo,
				"i3GEOF.atalhosedicao",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true,
				i3GEO.configura.locaplic + "/imagens/oxygen/16x16/games-config-custom.png"
			);
		divid = janela[2].id;
		janela[0].moveTo(100,60);
		$i("i3GEOF.atalhosedicao_corpo").style.backgroundColor = "white";
		i3GEOF.atalhosedicao.inicia(divid, "i3GEOF.atalhosedicao");
	},
	/**
	 * Aplica ao objeto CAMADAS o parametro definido
	 * Esse parametro e usado na hora de salvar o mapa
	 * Para isso, a funcao salvarmapfile deve ser preparada para obter o parametro
	 * e enviar para a funcao php
	 * veja em i3GEOF.salvamapfile.salva
	 * 
	 * conv indica se deve ser feita a conversao de checked para sim/nao
	 */
	metadata: function(obj,conv){
		var valor,tema;
		if(conv){
			if(obj.checked){
				valor = "sim";
			}
			else{
				valor = "nao";
			}
		}
		else{
			valor = obj.value
		}
		tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhosedicao.tema);
		tema[obj.name] = valor;
	}
};
