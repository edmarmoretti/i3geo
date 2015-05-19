/**
 * Title: &Aacute;rvore de temas
 *
 * Monta a &aacute;rvore com os temas dispon&iacute;veis para ser adicionados ao
 * mapa
 *
 * Namespace:
 *
 * i3GEO.arvoreDeTemas
 *
 * Exemplos:
 *
 * Para alterar as op&ccedil;&otilde;es da &aacute;rvore, modifique as
 * propriedades colocando um c&oacute;digo como o seguinte no javascript
 * utilizado na interface de mapa que estiver sendo utilizada
 *
 * i3GEO.arvoreDeTemas.INCLUISISTEMAS = false;
 *
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_arvoredetemas.js>
 */

 /** Licen&ccedil;a:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente
 * Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja
 * &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE
 * ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para
 * mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.arvoreDeTemas = {
	/**
	 * Constant: IDHTML
	 *
	 * Armazena o ID do elemento HTML onde a arvore sera incluida
	 *
	 * Tipo:
	 *
	 * {String}
	 */
	IDHTML : "arvoreAdicionaTema",
	/**
	 * Constant: ARVORE
	 *
	 * Objeto com a arvore criada com YAHOO.widget.TreeView
	 *
	 * Tipo:
	 *
	 * {YAHOO.widget.TreeView}
	 */
	ARVORE : null,
	/**
	 * Constant: FATORESTRELA
	 *
	 * Valor que sera utilizado para dividir o valor bruto do numero de acessos
	 * de cada tema.
	 *
	 * A divisao e utilizada para definir quantas estrelas serao mostradas na
	 * arvore de opcoes adicionais.<b>
	 *
	 * Tipo:
	 *
	 * {Numeric}
	 */
	FATORESTRELA : 10,
	/**
	 * Propriedade: OPCOESADICIONAIS
	 *
	 * Objeto com a defini&ccedil;&atilde;o das propriedades que ser&atilde;o utilizadas na inclus&atilde;o
	 * dos &iacute;cones adicionais de adi&ccedil;&atilde;o de temas e no item de descri&ccedil;&atilde;o de cada
	 * tema.
	 *
	 * "uploadarquivo" quando "true" indica que sera mostrado o icone de upload
	 * de arquivos e o icone de conex&atilde;o com servi&ccedil;os
	 *
	 * Exemplo:
	 *
	 * i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf = false;
	 *
	 * Op&ccedil;&otilde;es:
	 *
	 * idonde - id DOM onde as op&ccedil;&otilde;es ser&atilde;o inseridas
	 *
	 * incluibusca - inclu&iacute; a op&ccedil;&atilde;o de busca de camadas
	 *
	 * navegacaoDir - permite navega&ccedil;&atilde;o em pastas no servidor
	 *
	 * googleearth - mostra um link para abrir o menu no Googleearth
	 *
	 * flutuante - permite abrir o cat&aacute;logo em uma janela flutuante
	 *
	 * metaestat - inclui um n&oacute; que mostra os dados cadastrados no sistema metaestat
	 *
	 * incluiArvore - inclui na &aacute;rvore do cat&aacute;logo os &iacute;cones de op&ccedil;&otilde;es
	 *
	 * &Iacute;cones iniciais:
	 *
	 * uploadarquivo - agregador que abre uma &uacute;nica janela das op&ccedil;&otilde;es de upload de arquivos
	 *
	 * uploaddbf- upload de arquivos dbf
	 *
	 * uploadlocal - upload de shapefile
	 *
	 * uploadgpx - upload de arquivos GPX
	 *
	 * downloadbase - download de dados
	 *
	 * nuvemTags - nuvem de tags (palavras chave cadastradas)
	 *
	 * nuvemTagsFlash - nuvem de tags no formato flash
	 *
	 * refresh - &iacute;cone que permite reconstruir a &aacute;rvore do cat&aacute;logo
	 *
	 * carousel - visualizador de temas na forma de carousel
	 *
	 * inde - busca camadas no geonetwork da IDE cadastrada
	 *
	 * Op&ccedil;&otilde;es inclu&iacute;das nos n&oacute;s de cada tema:
	 *
	 * kml - op&ccedil;&atilde;o para obter KML da camada em foco
	 *
	 * estrelas - mostra o n&uacute;mero de estrelas (temas mais acesssados possuem mais estrelas)
	 *
	 * qrcode - op&ccedil;&atilde;o para obter QRCODE da camada em foco
	 *
	 * mini - op&ccedil;&atilde;o para obter imagem miniatura da camada em foco
	 *
	 * comentarios - permite que os usu&aacute;rios comentem temas
	 *
	 * bookmark - permite que os usu&aacute;rios marquem um tema em servi&ccedil;os de bookmark
	 *
	 * importarwmc - permite importar um arquivo do tipo map context
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	OPCOESADICIONAIS : {
		incluiArvore : true,
		uploaddbf : true, //depreciado na versao 6.0
		uploadlocal : true, //depreciado na versao 6.0
		uploadarquivo : true,
		downloadbase : true,
		conectarwms : true, //depreciado na versao 6.0
		conectarwmst : true, //depreciado na versao 6.0
		conectargeorss : true, //depreciado na versao 6.0
		conectargeojson : true, //depreciado na versao 6.0
		nuvemTags : true,
		nuvemTagsFlash : false,
		navegacaoDir : true,
		incluibusca : true,
		kml : true,
		qrcode : true,
		mini : true,
		estrelas : true,
		refresh : true,
		carousel : true,
		inde : true,
		uploadgpx : true, //depreciado na versao 6.0
		comentarios : true,
		bookmark : true,
		importarwmc : true,
		googleearth : true,
		carregaKml : true, //depreciado na versao 6.0
		flutuante : true,
		metaestat : true,
		idonde : ""
	},
	/**
	 * Propriedade: INCLUISISTEMAS
	 *
	 * Inclui na &aacute;rvore a lista de sistemas adicionais definidos no i3geo?
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUISISTEMAS : true,
	/**
	 * Propriedade: INCLUIWMS
	 *
	 * Inclui na &aacute;rvore a lista de Web Services WMS cadastrados?
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUIWMS : true,
	/**
	 * Propriedade: INCLUIREGIOES
	 *
	 * Inclui na &aacute;rvore a lista de de regi&otilde;es cadatsradas no sistema de
	 * metadados estat&iacute;sticos
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUIREGIOES : true,
	/**
	 * Propriedade: INCLUIINDIBR
	 *
	 * Inclui na &aacute;rvore a lista de servi&ccedil;os da INDE Br
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUIINDIBR : true,
	/**
	 * Propriedade: INCLUIWMSMETAESTAT
	 *
	 * Inclui na &aacute;rvore a lista de Web Services WMS advindos do sistema de
	 * metadados estat&iacute;sticos?
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUIWMSMETAESTAT : true,
	/**
	 * Propriedade: INCLUIMAPASCADASTRADOS
	 *
	 * Inclui na &aacute;rvore a lista de mapas cadastrados do sistema de metadados
	 * estat&iacute;sticos?
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUIMAPASCADASTRADOS : true,
	/**
	 * Propriedade: INCLUIESTRELAS
	 *
	 * Inclui na &aacute;rvore um no com a lista de temas classificados conforme o
	 * numero de estrelas que possui
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * true
	 */
	INCLUIESTRELAS : true,
	/**
	 * Propriedade: FILTRADOWNLOAD
	 *
	 * Mostra apenas os temas que permitem download
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * false
	 */
	FILTRADOWNLOAD : false,
	/**
	 * Propriedade: FILTRAOGC
	 *
	 * Mostra apenas os temas que permitem o uso de servi&ccedil;os OGC
	 *
	 * Tipo:
	 *
	 * {Boolean}
	 *
	 * Default:
	 *
	 * false
	 */
	FILTRAOGC : false,
	/**
	 * Propriedade: TIPOBOTAO
	 *
	 * Tipo de bot&atilde;o que sera usado para clicar no tema
	 *
	 * Tipo:
	 *
	 * {checkbox|radio}
	 *
	 * Default:
	 *
	 * checkbox
	 */
	TIPOBOTAO : "checkbox",
	/**
	 * Propriedade: ATIVATEMA
	 *
	 * Nome da fun&ccedil;&atilde;o que ser&aacute; incluida no evento onclick do elemento checkbox
	 * adicionado no in&iacute;cio do nome de um tema.
	 *
	 * Tipo:
	 *
	 * {String}
	 *
	 * Default:
	 *
	 * ""
	 */
	ATIVATEMA : "",
	/**
	 * Propriedade: IDSMENUS
	 *
	 * Array com a lista de ids de menus cadastrados que ser&atilde;o
	 * considerados na montagem da &aacute;rvore. Por default &eacute; vazio, o que
	 * significa que todos os menus serao considerados.
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *
	 * []
	 */
	IDSMENUS : [],
	/**
	 * Propriedade: RETORNAGUIA
	 *
	 * Guia que ser&aacute; ativada ap&oacute;s uma opera&ccedil;&atilde;o de adi&ccedil;&atilde;o de temas ter sido
	 * concluida.
	 *
	 * Se for vazia, a guia atual sera mantida.
	 *
	 * A string corresponde ao nome da guia que deve estar definida em
	 * i3GEO.guias.CONFIGURA, por exemplo i3GEO.arvoreDeTemas.RETORNAGUIA =
	 * "temas"
	 *
	 * Tipo:
	 *
	 * {String}
	 *
	 * Default:
	 *
	 * ""
	 */
	RETORNAGUIA : "",
	/**
	 * Objeto com a lista de drives no servidor que podem ser abertos na
	 * opcao de navegacao pelos diretorios
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	DRIVES : null,
	/**
	 * Objeto com a lista de sistemas existentes
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	SISTEMAS : null,
	/**
	 * Armazena o objeto com a lista de menus resultante da funcao
	 * listaMenus
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	MENUS : null,
	/**
	 * Armazena o objeto com a ultima lista de grupos obtida
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	GRUPOS : null,
	/**
	 * Armazena o objeto com a ultima lista de sub-grupos obtida
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	SUBGRUPOS : null,
	/**
	 * Armazena o objeto com a ultima lista de temas obtida
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	TEMAS : null,
	/**
	 * Endereco da aplicacao i3geo. Utilizado para definir o caminho para a
	 * chamada em AJAX.
	 *
	 * Tipo:
	 *
	 * {String}
	 */
	LOCAPLIC : null,
	/**
	 * Codigo da secao aberta no servidor pelo i3Geo
	 *
	 * Tipo:
	 *
	 * {String}
	 */
	SID : null,
	/**
	 * Function: flutuante
	 *
	 * Abre o catalogo em uma janela flutuante
	 */
	flutuante : function() {
		var janela, temp, cabecalho, minimiza, idold, corpo, altura;
		cabecalho = function() {
		};
		if ($i("i3GEOFcatalogo_corpo")) {
			return;
		}
		minimiza = function() {
			i3GEO.janela.minimiza("i3GEOFcatalogo");
		};
		altura = i3GEO.parametros.w - 150;
		if (altura > 500) {
			altura = 500;
		}
		janela = i3GEO.janela.cria("360px", altura + "px", "", "", "",
				"<span class='i3GEOiconeFerramenta i3GEOiconeCatalogo'></span><div class='i3GeoTituloJanela'>" + $trad("g1a") + "</div>", "i3GEOFcatalogo", false, "hd", cabecalho,
				minimiza);
		temp = function() {
			delete (i3GEO.arvoreDeTemas.ARVORE);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		corpo = $i("i3GEOFcatalogo_corpo");
		corpo.style.backgroundColor = "white";
		corpo.innerHTML = $trad("o1");
		corpo.style.overflow = "auto";
		if ($i(i3GEO.arvoreDeTemas.IDHTML)) {
			$i(i3GEO.arvoreDeTemas.IDHTML).innerHTML = "";
		}
		idold = i3GEO.arvoreDeTemas.IDHTML;
		delete (i3GEO.arvoreDeTemas.ARVORE);
		i3GEO.arvoreDeTemas.IDHTML = "i3GEOFcatalogo_corpo";
		i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid, i3GEO.configura.locaplic,
				"");
		window.setTimeout("i3GEO.arvoreDeTemas.IDHTML = '" + idold + "';", 520);
	},
	/**
	 * Lista os WMS cadastrados preenchendo o no OGC-WMS
	 */
	listaWMS : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaWMS()");
		var monta = function(retorno) {
			var node, raiz, nraiz, i, html, tempNode;
			node = i3GEO.arvoreDeTemas.ARVORE
					.getNodeByProperty("idwms", "raiz");
			raiz = retorno.data.canais;
			nraiz = raiz.length;
			for (i = 0; i < nraiz; i += 1) {
				html = "<span title='" + raiz[i].description + "'> "
						+ raiz[i].title;
				if (raiz[i].nacessos > 0) {
					html += " ("
							+ ((raiz[i].nacessosok * 100) / (raiz[i].nacessos * 1))
							+ "%)</span>";
				} else {
					html += " (% de acessos n&atilde;o definido)</span>";
				}
				html += "<hr>";
				tempNode = new YAHOO.widget.HTMLNode({
					html : html,
					id_ws : raiz[i].id_ws,
					tipo_ws : raiz[i].tipo_ws,
					url : raiz[i].link,
					nivel : 0,
					expanded : false,
					hasIcon : true,
					enableHighlight : true,
					className: "i3GeoFolder"
				}, node);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaLayersWMS, 1);
			}
			node.loadComplete();
		};
		i3GEO.php.listaRSSwsARRAY(monta, "WMS");
	},
	/**
	 * Lista as regioes ou localidades cadastradas no METAESTAT
	 */
	listaRegioes : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaRegioes()");

		var monta = function(retorno) {
			var node, nraiz, i, html;
			node = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("idregioes",
					"raiz");
			nraiz = retorno.length;
			for (i = 0; i < nraiz; i += 1) {
				// nameInput he incluido como 'name' no objeto input para que a
				// funcao de clique no input saiba
				// que se trata de uma camada vinda do sistema metaestat
				tema = {
					"nameInput" : "regioesmetaestat",
					"tid" : "metaregiao_" + retorno[i].codigo_tipo_regiao,
					"nome" : retorno[i].nome_tipo_regiao
				}, html = i3GEO.arvoreDeTemas.montaTextoTema("gray", tema),
						new YAHOO.widget.HTMLNode({
							isleaf : true,
							html : html,
							expanded : false,
							hasIcon : true,
							className: "i3GeoFolder",
							enableHighlight : false,
							tipoa_tema : "METAREGIAO",
							codigo_tipo_regiao : retorno[i].codigo_tipo_regiao,
							idtema : "metaregiao_"
									+ retorno[i].codigo_tipo_regiao
						}, node);
			}
			node.loadComplete();
		};
		i3GEO.php.listaTipoRegiao(monta);
	},
	/**
	 * Lista os mapas cadastrados
	 */
	listaMapasCadastrados : function() {
		var monta = function(retorno) {
			var node, nraiz, i, html, tema;
			retorno = retorno.data.mapas;
			node = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty(
					"idmapacadastrado", "raiz");
			nraiz = retorno.length;
			for (i = 0; i < nraiz; i += 1) {
				tema = {
					"nameInput" : "mapaCadastrado",
					"tid" : "mapaCadastrado_" + retorno[i].ID_MAPA,
					"nome" : retorno[i].NOME
				}, html = i3GEO.arvoreDeTemas.montaTextoTema("gray", tema),
						new YAHOO.widget.HTMLNode({
							id_mapaCadastrado : retorno[i].ID_MAPA,
							html : html,
							expanded : false,
							hasIcon : true,
							enableHighlight : true
						}, node);
			}
			node.loadComplete();
		};
		i3GEO.php.pegaMapas(monta);
	},
	/**
	 * Lista as variaveis cadastradas no sistema METAESTAT preenchendo
	 */
	listaVariaveisMetaestat : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaVariaveisMetaestat()");

		var monta = function(retorno) {
			var node, nraiz, i, html, tempNode;
			node = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty(
					"idwmsmetaestat", "raiz");
			nraiz = retorno.length;
			for (i = 0; i < nraiz; i += 1) {
				html = "<span title='" + retorno[i].descricao + "'> "
						+ retorno[i].nome;
				html += "<hr>";
				tempNode = new YAHOO.widget.HTMLNode({
					codigo_variavel : retorno[i].codigo_variavel,
					html : html,
					expanded : false,
					hasIcon : true,
					enableHighlight : true,
					className: "i3GeoFolder"
				}, node);
				tempNode.setDynamicLoad(
						i3GEO.arvoreDeTemas.listaMedidasVariavel, 1);
			}
			node.loadComplete();
		};
		i3GEO.php.listaVariavel(monta);
	},
	/**
	 * Lista as medidas de variaveis cadastradas no sistema METAESTAT
	 */
	listaMedidasVariavel : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaMedidasVariavel()");

		var monta = function(retorno) {
			var tema, html, i, n;
			n = retorno.length;
			for (i = 0; i < n; i++) {
				// nameInput he incluido como 'name' no objeto input para que a
				// funcao de clique no input saiba
				// que se trata de uma camada vinda do sistema metaestat
				tema = {
					"nameInput" : "metaestat",
					"id_medida_variavel" : retorno[i].id_medida_variavel,
					"tid" : "metaestat_" + retorno[i].id_medida_variavel,
					"nome" : retorno[i].nomemedida
				}, html = i3GEO.arvoreDeTemas.montaTextoTema("gray", tema),
						new YAHOO.widget.HTMLNode({
							isleaf : true,
							html : html,
							expanded : false,
							hasIcon : true,
							enableHighlight : true,
							tipoa_tema : "META",
							idtema : "metaestat_"
									+ retorno[i].id_medida_variavel,
							id_medida_variavel : retorno[i].id_medida_variavel
						}, node);
			}
			node.loadComplete();
		};
		i3GEO.php.listaMedidaVariavel(node.data.codigo_variavel, monta);
	},
	/**
	 * Lista os layers de um WMS e preenche o no OGC-WMS
	 */
	listaLayersWMS : function(node) {
		// node = no;
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaLayersWMS()");

		var monta = function(retorno) {
			var n, cor, i, cabeca, tempNode, ns, j, temp;
			n = 0;
			try {
				n = retorno.data.length;
			} catch (m) {
				node.loadComplete();
				return;
			}
			cor = "rgb(51, 102, 102)";
			html = "";
			for (i = 0; i < n; i += 1) {
				temp = retorno.data[i];
				cabeca = temp.nome + " - " + temp.titulo;
				if (cabeca !== "undefined - undefined") {
					tempNode = new YAHOO.widget.HTMLNode({
						html : "<span style='color:" + cor + "' >" + cabeca,
						url : node.data.url,
						nivel : (node.data.nivel * 1 + 1),
						id_ws : "",
						layer : temp.nome,
						enableHighlight : false,
						expanded : false,
						hasIcon : true
					}, node);
					if (!temp.estilos) {
						tempNode.setDynamicLoad(
								i3GEO.arvoreDeTemas.listaLayersWMS, 1);
					}
					if (temp.estilos) {
						ns = temp.estilos.length;
						for (j = 0; j < ns; j += 1) {
							new YAHOO.widget.HTMLNode({
								html : i3GEO.arvoreDeTemas.montaTextoTemaWMS(
										node.data.url, temp.nome,
										temp.estilos[j].nome,
										temp.estilos[j].titulo, temp.srs
												.toString(), temp.formatsinfo
												.toString(), temp.version
												.toString(), temp.formats
												.toString(), cor),
								enableHighlight : false,
								expanded : false,
								hasIcon : true
							}, tempNode);
							tempNode.isleaf = true;
						}
					}
					cor = (cor === "rgb(51, 102, 102)") ? "rgb(47, 70, 50)"
							: "rgb(51, 102, 102)";
				}
			}
			node.loadComplete();
		};
		i3GEO.php.listaLayersWMS(monta, node.data.url,
				(node.data.nivel * 1 + 1), node.data.id_ws, node.data.layer,
				node.data.tipo_ws);
	},
	/**
	 * Monta o texto que sera mostrado ao lado de cada layer de um WMS,
	 * permitindo incluir o layer no mapa.
	 */
	montaTextoTemaWMS : function(servico, layer, estilo, titulo, proj,
			formatoinfo, versao, formatoimg, cor, link) {
		var html, temp, adiciona;
		html = "<td style='vertical-align:top;padding-top:5px;'><span ><input style='cursor:pointer;border:solid 0 white;' ";
		temp = function() {
			i3GEO.janela.fechaAguarde("ajaxredesenha");
			i3GEO.atualiza();
		};
		adiciona = "i3GEO.php.adicionaTemaWMS(" + temp + "," + "\"" + servico
				+ "\"," + "\"" + layer + "\"," + "\"" + estilo + "\"," + "\""
				+ proj + "\"," + "\"" + formatoimg + "\"," + "\"" + versao
				+ "\"," + "\"" + titulo + "\"," + "\"\"," + "\"nao\"," + "\""
				+ formatoinfo + "\"," + "\"\"," + "\"\"," + "this.checked)";
		html += "onclick='javascript:"
				+ adiciona
				+ "' "
				+ " type='radio'  /></td><td style='padding-top:4px;vertical-align:top;text-align:left;padding-left:3px;color:"
				+ cor + ";' >";
		if (link) {
			html += "<a href='" + link + "' target=_blank >" + layer + " - "
					+ titulo + "</a>";
		} else {
			html += layer + " - " + titulo;
		}
		html += "</td></span>";
		return (html);
	},
	/**
	 * Function: listaMenus
	 *
	 * Lista os menus
	 *
	 * Pesquisa no banco de dados administrativo ou na vari&aacute;vel de configura&ccedil;&atilde;o
	 * (veja ms_configura.php) a lista de menus disponiveis.
	 *
	 * O resultado e incluido em i3GEO.arvoreDeTemas.MENUS.
	 *
	 * A propriedade i3GEO.arvoreDetemas.IDSMENUS pode ser utilizada para
	 * filtrar a lista de menus que sera utilizada.
	 *
	 * Parametros:
	 *
	 * {String} - Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {String} - nome da funcao que sera executada quando a lista for
	 * recebida. Se for "", nao e chamada.
	 */
	listaMenus : function(g_sid, g_locaplic, funcao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaMenus()");

		var r = function(retorno) {
			var c, m, i, k, jj, j;
			if (i3GEO.arvoreDeTemas.IDSMENUS.length === 0) {
				i3GEO.arvoreDeTemas.MENUS = retorno.data;
			} else {
				i3GEO.arvoreDeTemas.MENUS = [];
				c = retorno.data.length;
				m = i3GEO.arvoreDeTemas.IDSMENUS.length;
				for (i = 0, j = c; i < j; i += 1) {
					for (k = 0, jj = m; k < jj; k += 1) {
						if (retorno.data[i].idmenu === i3GEO.arvoreDeTemas.IDSMENUS[k]) {
							i3GEO.arvoreDeTemas.MENUS.push(retorno.data[i]);
						}
					}
				}
			}
			//necessario usar arguments por causa do compactador de scripts
			if (funcao !== "") {
				eval(funcao + "(arguments[0]);");
			}
		};
		i3GEO.php.pegalistademenus(r);
	},
	/**
	 * Function: listaGrupos
	 *
	 * Lista os grupos de um menu.
	 *
	 * O resultado e armazenado em i3GEO.arvoreDetemas.GRUPOS
	 *
	 * Parametros:
	 *
	 * {String} - Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {String} - Id do menu que contem os grupos
	 *
	 * {Function} - funcao que sera executada quando a lista for
	 * recebida. Se for "", nao e chamada.
	 */
	listaGrupos : function(g_sid, g_locaplic, id_menu, funcao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaGrupos()");

		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.GRUPOS = retorno.data;
			if (funcao !== "") {
				funcao.call();
			}
		};
		if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD || i3GEO.arvoreDeTemas.FILTRAOGC) {
			i3GEO.php.pegalistadegrupos(retorno, id_menu, "sim");
		} else {
			i3GEO.php.pegalistadegrupos(retorno, id_menu, "nao");
		}
	},
	/**
	 * Function: listaSubGrupos
	 *
	 * Lista os sub-grupos de um grupo.
	 *
	 * O resultado e armazenado emi3GEO.arvoreDetemas.SUBGRUPOS
	 *
	 * Parametros:
	 *
	 * {String} - Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {String} - Id do menu que contem os grupos
	 *
	 * {String} - Id do grupo que contem os sub-grupos
	 *
	 * {Function} - funcao que sera executada quando a lista for
	 * recebida. Se for "", nao e chamada.
	 */
	listaSubGrupos : function(g_sid, g_locaplic, id_menu, id_grupo, funcao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaSubGrupos()");

		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.SUBGRUPOS = retorno.data;
			if (funcao !== "") {
				funcao.call();
			}
		};
		i3GEO.php.pegalistadeSubgrupos(retorno, id_menu, id_grupo);
	},
	/**
	 * Function: listaTemas
	 *
	 * Lista os temas de um sub-grupo.
	 *
	 * O resultado e armazenado em i3GEO.arvoreDeTemas.TEMAS
	 *
	 * Parametros:
	 *
	 * {String} - Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {String} - Id do menu que contem os grupos
	 *
	 * {String} - Id do grupo que contem os sub-grupos
	 *
	 * {String} - Id do sub-grupo que contem os temas
	 *
	 * {Function} - funcao que sera executada quando a lista for
	 * recebida. Se for "", nao e chamada.
	 */
	listaTemas : function(g_sid, g_locaplic, id_menu, id_grupo, id_subgrupo,
			funcao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaTemas()");

		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.TEMAS = retorno.data;
			if (funcao !== "") {
				funcao.call();
			}
		};
		i3GEO.php.pegalistadetemas(retorno, id_menu, id_grupo, id_subgrupo);
	},
	/**
	 * Function: listaSistemas
	 *
	 * Lista os sistemas especiais de adicao de temas.
	 *
	 * O resultado e armazenado em i3GEO.arvoreDeTemas.SISTEMAS
	 *
	 * Parametros:
	 *
	 * {String} - Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {Function} - funcao que sera executada quando a lista for
	 * recebida. Se for "", nao e chamada.
	 */
	listaSistemas : function(g_sid, g_locaplic, funcao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaSistemas()");

		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.SISTEMAS = retorno.data;
			if (funcao !== "") {
				funcao.call();
			}
		};
		i3GEO.php.pegaSistemas(retorno);
	},
	/**
	 * Lista os enderecos no servidor dos drives que podem ser abertos pela
	 * opcao de navegacao em arquivos no servidor.
	 *
	 * Alista de drives deve ser definida emi3geo/ms_configura.php
	 *
	 * Parametros:
	 *
	 * {String} - Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {Function} - funcao que sera executada quando a lista for
	 * recebida. Se for "", nao e chamada.
	 */
	listaDrives : function(g_sid, g_locaplic, funcao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaDrives()");

		var retorno = function(retorno) {
			try {
				i3GEO.arvoreDeTemas.DRIVES = retorno.data.drives;
				if (i3GEO.arvoreDeTemas.DRIVES == "") {
					return;
				}
				if (funcao !== "") {
					funcao.call();
				}
			} catch (e) {
				i3GEO.arvoreDeTemas.DRIVES = "";
			}
		};
		i3GEO.php.listadrives(retorno);
	},
	/**
	 * Busca e insere na arvore de temas os temas que contem um certo nivel de
	 * estrelas
	 *
	 * Parametros:
	 *
	 * {objeto} - no da arvore que foi expandido pelo usuario
	 */
	listaEstrelas : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaEstrelas()");

		var montanos = function(retorno) {
			try {
				var ig, montaTexto = function(ngSgrupo) {
					var tempn, ngTema, tempng, mostra, d, lk = "", st, sg;
					tempn = ngSgrupo.length;
					for (sg = 0; sg < tempn; sg += 1) {
						ngTema = ngSgrupo[sg].temas;
						tempng = ngTema.length;
						for (st = 0; st < tempng; st += 1) {
							mostra = true;
							try {
								if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
										&& ngTema[st].download === "nao") {
									mostra = false;
								}
								if (i3GEO.arvoreDeTemas.FILTRAOGC
										&& ngTema[st].ogc === "nao") {
									mostra = false;
								}
							} catch (e) {
							}
							if (mostra) {
								d = i3GEO.arvoreDeTemas.montaTextoTema("gray",
										ngTema[st]);
								if (ngTema[st].link !== " ") {
									lk = "<a href='"
											+ ngTema[st].link
											+ "' target='blank'>&nbsp;fonte</a>";
								}
								if (ngSgrupo[sg].subgrupo) {
									d += "<td style='text-allign:left'> ("
											+ (ngSgrupo[sg].subgrupo) + ") "
											+ lk + "</td>";
								} else {
									d += "<td style='text-allign:left'> ("
											+ (ngSgrupo[sg].grupo) + ")" + lk
											+ "</td>";
								}
								tempNode = new YAHOO.widget.HTMLNode({
									html : d,
									expanded : false,
									hasIcon : true,
									isLeaf : true,
									enableHighlight : true
								}, node);
							}
							conta += 1;
						}
					}
				};
				if (!retorno.data) {
					i3GEO.janela.tempoMsg("Ocorreu um erro");
				} else {
					retorno = retorno.data;
					conta = 0;
					if ((retorno !== "erro")
							&& (typeof (retorno) !== 'undefined')) {
						ig = retorno.length - 1;
						if (ig >= 0) {
							do {
								montaTexto([ retorno[ig] ]);
								montaTexto(retorno[ig].subgrupos);
							} while (ig--);
						} else {
							tempNode = new YAHOO.widget.HTMLNode(
									{
										html : "<span style='color:red'>Nada encontrado<br><br></span>",
										isLeaf : true,
										expanded : false,
										hasIcon : true,
										enableHighlight : false
									}, node);
						}
					}
				}
				node.loadComplete();
			} catch (e) {
			}
		};
		i3GEO.php.procurartemasestrela(montanos, node.data.nivel,
				i3GEO.arvoreDeTemas.FATORESTRELA * 1);
	},
	/**
	 * Function: cria
	 *
	 * Cria a arvore com os menus dispon&iacute;veis.
	 *
	 * A arvore contem opcionalmente a opcao de busca, os icones adicionais e a
	 * lista de sistemas.
	 *
	 * Ao ser criada, os parametros utilizados sao armazenados em variaveis que
	 * podem ser acessadas com
	 * i3geo.arvoreDeTemas.[ATIVATEMA,OPCOESADICIONAIS,IDHTML,LOCAPLIC,SID]
	 *
	 * Parametros:
	 *
	 * {String} Codigo da secao PHP criada ao abrir o i3Geo
	 *
	 * {String} Endereco da aplicacao (i3geo) onde fica o diretorio
	 * classesphp
	 *
	 * {String} Id do elemento onde a arvore sera inserida. Se for
	 * vazio, sera utilizado o ID definido em IDHTML
	 *
	 * {String} (opcional) Nome da funcao que sera executada quando o usuario clicar no checkbox de um tema
	 *
	 * {Object} (opcional) Objeto com as opcoes necessarias para
	 * criacao dos icones com as opcoes adicionais de adicao de temas
	 *
	 * {String} (opcional) checkbox|radio|download tipo de botao que
	 * sera mostrado para o usuario escolher o tema
	 */
	cria : function(g_sid, g_locaplic, idhtml, funcaoTema, objOpcoes, tipoBotao) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.cria()");

		if (i3GEO.arvoreDeTemas.ARVORE) {
			return;
		}
		if (!idhtml) {
			idhtml = "";
		}
		if (idhtml !== "") {
			i3GEO.arvoreDeTemas.IDHTML = idhtml;
		}
		if (!funcaoTema) {
			funcaoTema = "";
		}
		if (funcaoTema !== "") {
			i3GEO.arvoreDeTemas.ATIVATEMA = funcaoTema;
		}
		if (!objOpcoes) {
			objOpcoes = "";
		}
		if (objOpcoes !== "") {
			i3GEO.arvoreDeTemas.OPCOESADICIONAIS = objOpcoes;
		}
		if (!tipoBotao) {
			tipoBotao = "";
		}
		if (tipoBotao !== "") {
			i3GEO.arvoreDeTemas.TIPOBOTAO = tipoBotao;
		}

		i3GEO.arvoreDeTemas.LOCAPLIC = g_locaplic;
		i3GEO.arvoreDeTemas.SID = g_sid;
		if (i3GEO.arvoreDeTemas.IDHTML === "") {
			return;
		}
		i3GEO.arvoreDeTemas.listaMenus(g_sid, g_locaplic,
				"i3GEO.arvoreDeTemas.montaArvore");
	},
	/**
	 * Function: atualiza
	 *
	 * Refaz a &aacute;rvore atual
	 */
	atualiza : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.atualiza()");

		if ($i(i3GEO.arvoreDeTemas.IDHTML)) {
			i3GEO.arvoreDeTemas.ARVORE = null;
			i3GEO.arvoreDeTemas.cria(i3GEO.arvoreDeTemas.SID,
					i3GEO.arvoreDeTemas.LOCAPLIC, i3GEO.arvoreDeTemas.IDHTML);
		}
	},
	/**
	 * Monta a arvore incluindo os nos do primeiro nivel.
	 *
	 * A opcao de carga dinamica dos nos filhos e definida para a montagem dos
	 * grupos.
	 */
	montaArvore : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.montaArvore()");

		var mais = "", tempNode, tempNode1, retorno, root, insp, outrasOpcoes, dados, c, i, j, conteudo, editor;
		(function() {
			function changeIconMode() {
				buildTree();
			}
			function buildTree() {
				i3GEO.arvoreDeTemas.ARVORE = new YAHOO.widget.TreeView(
						i3GEO.arvoreDeTemas.IDHTML);
			}
			buildTree();
		})();
		// opcao de busca de temas
		root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluibusca === true) {
			insp = "<table><tr>"
					+ "<td><span style='font-size:12px'>&nbsp;"
					+ $trad("a1")
					+ "<a class=ajuda_usuario target=_blank href='"
					+ i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=4&idajuda=31' >&nbsp;&nbsp;&nbsp;&nbsp;</a></span></td>"
					+ "<td>"
					+ "<div><input onclick='javascript:this.select();' class='digitar' type='text' id='i3geo_buscatema' style=width:112px; value=''  /></div>"
					+ "</td>" + "<td><img  class='ticfind' ";
			if (navm) {
				insp += "style='top:0px; margin-left: 4px;'";
			} else {
				insp += "style='top:4px;margin-left: 4px;'";
			}
			insp += " src='"
					+ i3GEO.configura.locaplic + "/imagens/branco.gif"
					+ "' onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.buscaTema2(document.getElementById(\"i3geo_buscatema\").value)' /></td>";
			insp += "</tr></table>&nbsp;";

			tempNode = new YAHOO.widget.HTMLNode({
				html : insp,
				enableHighlight : false,
				expanded : false,
				hasIcon : false
			}, root);
		}
		//titulo do catalogo
		tempNode = new YAHOO.widget.HTMLNode(
			{
				html : "<b>" + $trad("g1a") + "</b>",
				idmenu : "",
				enableHighlight : false,
				expanded : false,
				hasIcon : false
			}, root);
		// icones com as outras opcoes
		// conforme definido em i3GEO.arvoreDeTemas.OPCOESADICIONAIS
		outrasOpcoes = i3GEO.arvoreDeTemas.outrasOpcoesHTML();
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde !== "") {
			document
					.getElementById(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde).innerHTML = outrasOpcoes;
		}
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore === true) {
			tempNode = new YAHOO.widget.HTMLNode({
				html : outrasOpcoes + "&nbsp;<br>",
				isLeaf : true,
				enableHighlight : true,
				expanded : false,
				hasIcon : true
			}, root);
		}
		//
		// opcoes para abrir o sistema de administracao
		//
		if (i3GEO.parametros.editor === "sim") {
			tempNode = new YAHOO.widget.HTMLNode({
				html : "<a style='color:red' title='" + $trad("x7")
						+ "' href='../admin' target=blank >" + $trad("x8")
						+ "</a>",
				idmenu : "",
				enableHighlight : false,
				expanded : false
			}, root);
			tempNode = new YAHOO.widget.HTMLNode({
				html : "<a style='color:red' title='" + $trad("x7")
						+ "' href='../admin/html/arvore.html' target=blank >"
						+ $trad("x9") + "</a>",
				idmenu : "",
				enableHighlight : false,
				expanded : false
			}, root);
			tempNode = new YAHOO.widget.HTMLNode(
					{
						html : "<span style='color:red;cursor:pointer' title='"
								+ $trad("x7")
								+ "' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""
								+ i3GEO.configura.locaplic
								+ "/admin/html/menus.html\")' target=blank >"
								+ $trad("x10") + "</span>",
						idmenu : "",
						enableHighlight : false,
						expanded : false
					}, root);
		}
		//
		// abrir no google earth
		//
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.googleearth === true) {
			tempNode = new YAHOO.widget.HTMLNode(
					{
						html : "<a href='"
								+ i3GEO.configura.locaplic
								+ "/kml.php?tipoxml=kml' target=blank > <img src='"
								+ i3GEO.configura.locaplic
								+ "/imagens/branco.gif' class='abregoogleearth'> "
								+ $trad("a13") + "</a>",
						idmenu : "",
						enableHighlight : false,
						expanded : false,
						hasIcon : true
					}, root);
		}
		//
		// abrir catalogo em janela flutuante
		//
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.flutuante === true) {
			tempNode = new YAHOO.widget.HTMLNode(
					{
						html : "<a href='#' onclick='i3GEO.arvoreDeTemas.flutuante()' >Abrir em janela flutuante</a><br>",
						idmenu : "",
						enableHighlight : false,
						expanded : false,
						hasIcon : true
					}, root);
		}
		//agrupamento de outras funcoes
		if(i3GEO.arvoreDeTemas.INCLUISISTEMAS === true || i3GEO.arvoreDeTemas.INCLUIESTRELAS === true || i3GEO.arvoreDeTemas.INCLUIMAPASCADASTRADOS === true || i3GEO.arvoreDeTemas.INCLUIWMS === true || i3GEO.arvoreDeTemas.INCLUIREGIOES === true || i3GEO.arvoreDeTemas.INCLUIWMSMETAESTAT === true){
			mais = new YAHOO.widget.HTMLNode({
				html : $trad("mais"),
				enableHighlight : false,
				expanded : false,
				idmais: "idmais",
				className: "i3GeoFolder"
			}, root);
			//
			// wms
			//
			if (i3GEO.arvoreDeTemas.INCLUIWMS === true) {
				if (i3GEO.parametros.editor === "sim") {
					editor = "<img title='Editar lista' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""
							+ i3GEO.configura.locaplic
							+ "/admin/html/webservices.html?tipo=WMS\")' style='width:11px;position:relative;left:3px' src='"
							+ i3GEO.configura.locaplic + "/imagens/edit.gif' />";
				} else {
					editor = "";
				}
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html : "<span style='position:relative;'>OGC-WMS</span>"
									+ "<a class=ajuda_usuario style=left:3px; target=_blank href='"
									+ i3GEO.configura.locaplic
									+ "/ajuda_usuario.php?idcategoria=4&idajuda=33' ><b> </b></a>"
									+ editor,
							idwms : "raiz",
							expanded : false,
							className: "i3GeoFolder",
							enableHighlight : false
						}, mais);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaWMS, 1);
			}
			//
			// regioes
			//
			if (i3GEO.arvoreDeTemas.INCLUIREGIOES === true) {
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html : "<span style='position:relative;'>"
									+ $trad("x87")
									+ "</span>"
									+ "<a class=ajuda_usuario style=left:3px; target=_blank href='"
									+ i3GEO.configura.locaplic
									+ "/ajuda_usuario.php?idcategoria=4&idajuda=33' ><b> </b></a>",
							idregioes : "raiz",
							expanded : false,
							className: "i3GeoFolder",
							enableHighlight : false
						}, mais);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaRegioes, 1);
			}
			//
			// wmsmetaestat
			//
			if (i3GEO.arvoreDeTemas.INCLUIWMSMETAESTAT === true) {
				tempNode = new YAHOO.widget.HTMLNode(
						{
							html : "<span style='position:relative;'>"
									+ $trad("x57")
									+ "</span>"
									+ "<a class=ajuda_usuario style=left:3px; target=_blank href='"
									+ i3GEO.configura.locaplic
									+ "/ajuda_usuario.php?idcategoria=4&idajuda=112' ><b> </b></a>",
							idwmsmetaestat : "raiz",
							expanded : false,
							className: "i3GeoFolder",
							enableHighlight : false
						}, mais);
				tempNode.setDynamicLoad(
						i3GEO.arvoreDeTemas.listaVariaveisMetaestat, 1);
			}
			//
			// mapas cadastrados
			//
			if (i3GEO.arvoreDeTemas.INCLUIMAPASCADASTRADOS === true) {
				tempNode = new YAHOO.widget.HTMLNode({
					html : "<span style='position:relative;'>"
							+ $trad("x90") + "</span>",
					idmapacadastrado : "raiz",
					expanded : false,
					className: "i3GeoFolder",
					enableHighlight : true
				}, mais);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaMapasCadastrados,
						1);
			}
			//
			// estrelas
			//
			if (i3GEO.arvoreDeTemas.INCLUIESTRELAS === true) {
				tempNode = new YAHOO.widget.HTMLNode(
						{
							expanded : false,
							html : "<span style='position:relative;' >"
									+ $trad("t46")
									+ "</span><a class=ajuda_usuario style=left:3px; target=_blank href='"
									+ i3GEO.configura.locaplic
									+ "/ajuda_usuario.php?idcategoria=4&idajuda=95' ><b> </b></a>",
							enableHighlight : false,
							className: "i3GeoFolder"
						}, mais);
				ig = 5;
				do {
					tempNode1 = new YAHOO.widget.HTMLNode({
						expanded : false,
						html : "<img src='" + i3GEO.configura.locaplic + "/imagens/e" + ig + ".png ' />",
						enableHighlight : true,
						nivel : ig
					}, tempNode);
					tempNode1.setDynamicLoad(i3GEO.arvoreDeTemas.listaEstrelas, 1);
					ig -= 1;
				} while (ig > 0);
			}
			if (i3GEO.arvoreDeTemas.INCLUISISTEMAS) {
				retorno = function() {
					var sis, iglt, tempNode, ig, nomeSis, sisNode, funcoes, tempf, ig2, abre, nomeFunc;
					try {
						sis = i3GEO.arvoreDeTemas.SISTEMAS;
						iglt = sis.length;
						tempNode = new YAHOO.widget.HTMLNode(
								{
									html : $trad("a11")
											+ "<a class=ajuda_usuario style=left:3px; target=_blank href='"
											+ i3GEO.configura.locaplic
											+ "/ajuda_usuario.php?idcategoria=4&idajuda=34' ><b> </b></a>",
									expanded : false,
									enableHighlight : false
								}, mais);
					} catch (e) {
						i3GEO.arvoreDeTemas.ARVORE.draw();
						return;
					}
					ig = 0;
					if (sis.length > 0) {
						do {
							nomeSis = sis[ig].NOME;
							if (sis[ig].PUBLICADO) {
								if (sis[ig].PUBLICADO.toLowerCase() === "nao") {
									nomeSis = "<span style='color:red'>"
											+ sis[ig].NOME + "</span>";
								}
							}
							sisNode = new YAHOO.widget.HTMLNode({
								html : nomeSis,
								expanded : false,
								enableHighlight : false
							}, tempNode);
							funcoes = sis[ig].FUNCOES;
							tempf = funcoes.length;
							for (ig2 = 0; ig2 < tempf; ig2 += 1) {
								abre = "i3GEO.janela.cria('" + (funcoes[ig2].W)
										+ "px','" + (funcoes[ig2].H) + "px','"
										+ (funcoes[ig2].ABRIR) + "','','','"
										+ $trad("a11") + "')";
								nomeFunc = "<a href='#' onclick=\"" + abre + "\">"
										+ funcoes[ig2].NOME + "</a>";
								new YAHOO.widget.HTMLNode({
									html : nomeFunc,
									expanded : false,
									enableHighlight : false,
									isLeaf : true
								}, sisNode);
							}
							ig += 1;
						} while (ig < iglt);
					}
					if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir === false) {
						i3GEO.arvoreDeTemas.ARVORE.draw();
					} else {
						i3GEO.arvoreDeTemas.adicionaNoNavegacaoDir();
					}
				};
				i3GEO.arvoreDeTemas.listaSistemas(i3GEO.arvoreDeTemas.SID,
						i3GEO.arvoreDeTemas.LOCAPLIC, retorno);
			}
		}
		//
		// wms indi br
		if (i3GEO.arvoreDeTemas.INCLUIINDIBR === true) {
			var temp = function() {
				i3GEOF.vinde.inicia("", i3GEO.arvoreDeTemas.ARVORE);
			};
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/vinde/dependencias.php", temp,
					"i3GEOF.vinde_script");
		}

		//
		// adiciona na arvore a raiz de cada menu
		//
		dados = i3GEO.arvoreDeTemas.MENUS;
		c = dados.length;
		for (i = 0, j = c; i < j; i += 1) {
			if (!dados[i].nomemenu) {
				dados[i].nomemenu = dados[i].idmenu;
			}
			if (i3GEO.parametros.editor === "sim") {
				editor = "<img title='Editar grupos' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""
						+ i3GEO.configura.locaplic
						+ "/admin/html/arvore.html?id_menu="
						+ dados[i].idmenu
						+ "\")' style='width:11px;position:relative;left:3px;top:2px;' src='"
						+ i3GEO.configura.locaplic + "/imagens/edit.gif' />";
			} else {
				editor = "";
			}
			if (!dados[i].publicado) {
				dados[i].publicado = "sim";
			}
			if (dados[i].publicado.toLowerCase() !== "nao") {
				conteudo = "<span style='position:relative;' title='"
						+ (dados[i].desc)
						+ "'>"
						+ dados[i].nomemenu
						+ "</span>" + editor;
			} else {
				conteudo = "<span title='nao publicado' style='color:red'>"
						+ dados[i].nomemenu + "</span>" + editor;
			}
			tempNode = new YAHOO.widget.HTMLNode({
				html : conteudo,
				idmenu : dados[i].idmenu,
				enableHighlight : true,
				expanded : false,
				className: "i3GeoFolder"
			}, root);
			tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaGrupos, 1);
			if (dados[i].status === "aberto") {
				tempNode.expand();
			}
		}
		document.getElementById(i3GEO.arvoreDeTemas.IDHTML).style.textAlign = "left";
		if (!i3GEO.arvoreDeTemas.INCLUISISTEMAS) {
			if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir === false) {
				i3GEO.arvoreDeTemas.ARVORE.draw();
			} else if(mais != ""){
				i3GEO.arvoreDeTemas.adicionaNoNavegacaoDir();
			}
		}
	},
	adicionaNoNavegacaoDir : function(drives, arvore) {
		var temp = function() {
			var iglt, ig, drive, tempNode;
			if (!drives) {
				drives = i3GEO.arvoreDeTemas.DRIVES;
			}
			if (!arvore) {
				arvore = i3GEO.arvoreDeTemas.ARVORE;
			}
			if (drives == undefined || drives == "" || drives.length === 0) {
				arvore.draw();
				return;
			}
			iglt = drives.length;
			tempNode = new YAHOO.widget.HTMLNode(
					{
						html : ""
								+ $trad("a6")
								+ "<a class=ajuda_usuario style=left:3px; target=_blank href='"
								+ i3GEO.configura.locaplic
								+ "/ajuda_usuario.php?idcategoria=4&idajuda=32' ><b> </b></a>",
						enableHighlight : false,
						expanded : false,
						className: "i3GeoFolder"
					}, i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("idmais","idmais")
				);
			ig = 0;
			do {
				drive = new YAHOO.widget.HTMLNode({
					listaShp : true,
					listaImg : true,
					listaFig : false,
					html : drives[ig].nome,
					caminho : drives[ig].caminho,
					enableHighlight : true,
					expanded : false,
					className: "i3GeoFolder"
				}, tempNode);
				drive.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir, 1);
				ig += 1;
			} while (ig < iglt);
			arvore.draw();
		};
		i3GEO.arvoreDeTemas.listaDrives(i3GEO.arvoreDeTemas.SID,
				i3GEO.arvoreDeTemas.LOCAPLIC, temp);
	},
	/**
	 * Monta a lista de grupos de um no principal da arvore.
	 *
	 * A opcao de carga dinamica dos nos filhos e definida para a montagem dos
	 * sub-grupos.
	 */
	montaGrupos : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.montaGrupos()");

		var temp = function() {
			var grupos, c, raiz, nraiz, mostra, i, d, editor;
			grupos = i3GEO.arvoreDeTemas.GRUPOS.grupos;
			c = grupos.length - 3;
			raiz = grupos[c].temasraiz;
			nraiz = raiz.length;
			for (i = 0; i < nraiz; i += 1) {
				mostra = true;
				if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
						&& raiz[i].download === "nao") {
					mostra = false;
				}
				if (i3GEO.arvoreDeTemas.FILTRAOGC && raiz[i].ogc === "nao") {
					mostra = false;
				}
				if (mostra && raiz[i].nome != "") {
					tempNode = new YAHOO.widget.HTMLNode({
						isLeaf : false,
						enableHighlight : false,
						expanded : false,
						html : i3GEO.arvoreDeTemas.montaTextoTema("gray",
								raiz[i])
					}, node);
				}
			}
			for (i = 0; i < c; i += 1) {
				mostra = true;
				if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
						&& grupos[i].download === "nao") {
					mostra = false;
				}
				if (i3GEO.arvoreDeTemas.FILTRAOGC && grupos[i].ogc === "nao") {
					mostra = false;
				}
				if (i3GEO.parametros.editor === "sim") {
					editor = "<img title='Editar subgrupos' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""
							+ i3GEO.configura.locaplic
							+ "/admin/html/arvore.html?id_menu="
							+ node.data.idmenu
							+ "&id_grupo="
							+ grupos[i].id_n1
							+ "\")' style='width:11px;position:relative;left:3px;top:2px;' src='"
							+ i3GEO.configura.locaplic
							+ "/imagens/edit.gif' />";
				} else {
					editor = "";
				}
				if (mostra && grupos[i].nome != undefined) {
					// se id_n1 existir, significa que os grupos possuem id,
					// pois sao oriundos do sistema
					// de administracao
					// no caso do uso de menu de temas com base em arquivos xml,
					// o id nao existe
					// sendo necessario o uso da ordem dos grupos como
					// identificador
					if (grupos[i].publicado) {
						if (grupos[i].publicado === "NAO") {
							grupos[i].nome = "<span title='nao publicado' style='color:red'>"
									+ grupos[i].nome + "</span>";
						}
					}
					d = {
						html : "<span style='position:relative;'>"
								+ grupos[i].nome + editor + "</span>",
						idmenu : node.data.idmenu,
						className: "i3GeoFolder",
						idgrupo : i
					};
					if (grupos[i].id_n1) {
						d = {
							html : grupos[i].nome + editor,
							idmenu : node.data.idmenu,
							className: "i3GeoFolder",
							idgrupo : grupos[i].id_n1
						};
					}
					tempNode = new YAHOO.widget.HTMLNode(d, node, false, true);
					tempNode.enableHighlight = true;
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaSubGrupos,
							1);
					tempNode.isLeaf = false;
				}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaGrupos(i3GEO.arvoreDeTemas.SID,
				i3GEO.arvoreDeTemas.LOCAPLIC, node.data.idmenu, temp);
	},
	/**
	 * Monta a lista de sub-grupos de um no do tipo grupo.
	 *
	 * A opcao de carga dinamica dos nos filhos e definida para a montagem dos
	 * temas.
	 */
	montaSubGrupos : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.montaSubGrupos()");

		var temp = function() {
			var i, c, mostra, d, tempNode, nraiz, subgrupos, raiz;
			subgrupos = i3GEO.arvoreDeTemas.SUBGRUPOS.subgrupo;
			c = subgrupos.length;
			raiz = i3GEO.arvoreDeTemas.SUBGRUPOS.temasgrupo;
			nraiz = raiz.length;
			for (i = 0; i < nraiz; i += 1) {
				mostra = true;
				if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
						&& raiz[i].download === "nao") {
					mostra = false;
				}
				if (i3GEO.arvoreDeTemas.FILTRAOGC && raiz[i].ogc === "nao") {
					mostra = false;
				}
				if (mostra) {
					tempNode = new YAHOO.widget.HTMLNode({
						nacessos : raiz[i].nacessos,
						html : i3GEO.arvoreDeTemas.montaTextoTema("gray",
								raiz[i]),
						idtema : raiz[i].tid,
						fonte : raiz[i].link,
						ogc : raiz[i].ogc,
						kmz : raiz[i].kmz,
						permitecomentario : raiz[i].permitecomentario,
						download : raiz[i].download,
						expanded : false,
						enableHighlight : false,
						isLeaf : false
					}, node);
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.propTemas, 1);
				}
			}
			for (i = 0; i < c; i += 1) {
				mostra = true;
				if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
						&& subgrupos[i].download === "nao") {
					mostra = false;
				}
				if (i3GEO.arvoreDeTemas.FILTRAOGC && subgrupos[i].ogc === "nao") {
					mostra = false;
				}
				// coloca ou nao icone que permite editar no sistema de
				// administracao
				if (i3GEO.parametros.editor === "sim") {
					editor = "<img title='Editar temas' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""
							+ i3GEO.configura.locaplic
							+ "/admin/html/arvore.html?id_menu="
							+ node.data.idmenu
							+ "&id_grupo="
							+ node.data.idgrupo
							+ "&id_subgrupo="
							+ subgrupos[i].id_n2
							+ "\")' style='width:11px;position:relative;left:3px;top:2px;' src='"
							+ i3GEO.configura.locaplic
							+ "/imagens/edit.gif' />";
				} else {
					editor = "";
				}
				if (mostra && subgrupos[i].nome != undefined) {
					// se id_n2 existir, significa que os grupos possuem id,
					// pois sao oriundos do sistema
					// de administracao
					// no caso do uso de menu de temas com base em arquivos xml,
					// o id nao existe
					// sendo necessario o uso da ordem dos grupos como
					// identificador
					if (subgrupos[i].publicado) {
						if (subgrupos[i].publicado === "NAO") {
							subgrupos[i].nome = "<span title='nao publicado' style='color:red'>"
									+ subgrupos[i].nome + "</span>";
						}
					}
					d = {
						html : "<span style='position:relative;'>"
								+ subgrupos[i].nome + editor + "</span>",
						idmenu : node.data.idmenu,
						idgrupo : node.data.idgrupo,
						className: "i3GeoFolder",
						idsubgrupo : i
					};
					if (subgrupos[i].id_n2) {
						d = {
							html : subgrupos[i].nome + editor,
							idmenu : node.data.idmenu,
							idgrupo : node.data.idgrupo,
							idsubgrupo : subgrupos[i].id_n2,
							className: "i3GeoFolder"
						};
					}
					tempNode = new YAHOO.widget.HTMLNode(d, node, false, true);
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaTemas, 1);
					tempNode.isLeaf = false;
					tempNode.enableHighlight = true;
				}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaSubGrupos(i3GEO.arvoreDeTemas.SID,
				i3GEO.arvoreDeTemas.LOCAPLIC, node.data.idmenu,
				node.data.idgrupo, temp);
	},
	/**
	 * Monta a lista de temas de um no.
	 */
	montaTemas : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.montaTemas()");

		var temp = function() {
			var i, cor, temas, c, mostra, tempNode;
			temas = i3GEO.arvoreDeTemas.TEMAS.temas;
			c = temas.length;
			cor = "rgb(51, 102, 102)";
			for (i = 0; i < c; i += 1) {
				mostra = true;
				if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
						&& temas[i].download === "nao") {
					mostra = false;
				}
				if (i3GEO.arvoreDeTemas.FILTRAOGC && temas[i].ogc === "nao") {
					mostra = false;
				}
				if (mostra) {
					if (temas[i].publicado) {
						if (temas[i].publicado === "NAO") {
							temas[i].nome = "<span title='nao publicado' style='color:red' >"
									+ temas[i].nome + "</span>";
						}
					}
					tempNode = new YAHOO.widget.HTMLNode({
						nacessos : temas[i].nacessos,
						html : i3GEO.arvoreDeTemas
								.montaTextoTema(cor, temas[i]),
						idtema : temas[i].tid,
						fonte : temas[i].link,
						ogc : temas[i].ogc,
						kmz : temas[i].kmz,
						download : temas[i].download,
						permitecomentario : temas[i].permitecomentario,
						tipoa_tema : temas[i].tipoa_tema,
						bookmark : "sim",
						expanded : false,
						isLeaf : false,
						enableHighlight : false
					}, node);
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.propTemas, 1);
					cor = (cor === "rgb(51, 102, 102)") ? "rgb(47, 70, 50)"
							: "rgb(51, 102, 102)";
				}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaTemas(i3GEO.arvoreDeTemas.SID,
				i3GEO.arvoreDeTemas.LOCAPLIC, node.data.idmenu,
				node.data.idgrupo, node.data.idsubgrupo, temp);
	},
	/**
	 * Inclui na arvore o navegador de diretorios
	 *
	 * Parametro:
	 *
	 * {node} - no onde sera criada a lista
	 */
	montaDir : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.montaDir()");

		var montaLista = function(retorno) {
			var ig, conteudo, dirs, tempNode, arquivos, prefixo = "", funcaoClick = "i3GEO.util.adicionaSHP";
			dirs = retorno.data.diretorios;
			if (!node.data.retornaDir) {
				node.data.retornaDir = false;
			}
			for (ig = 0; ig < dirs.length; ig += 1) {
				if (node.data.funcaoClick) {
					funcaoClick = node.data.funcaoClick;
				}
				if (node.data.retornaDir === true) {
					prefixo = "<input type=radio onclick='i3GEOF.navegarquivos.retorna(\""
							+ node.data.caminho + "/" + dirs[ig] + "\")' />";
				}

				tempNode = new YAHOO.widget.HTMLNode({
					html : prefixo + dirs[ig],
					caminho : node.data.caminho + "/" + dirs[ig],
					expanded : false,
					enableHighlight : false,
					listaImg : node.data.listaImg,
					listaFig : node.data.listaFig,
					listaShp : node.data.listaShp,
					retornaDir : node.data.retornaDir,
					funcaoClick : funcaoClick,
					className: "i3GeoFolder"
				}, node);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir, 1);
			}
			arquivos = retorno.data.arquivos;
			for (ig = 0; ig < arquivos.length; ig += 1) {
				conteudo = arquivos[ig];
				if (node.data.funcaoClick) {
					funcaoClick = node.data.funcaoClick;
				}
				if ((node.data.listaFig === true && (conteudo.search(".png") > 1
						|| conteudo.search(".jpg") > 1 || conteudo
						.search(".PNG") > 1))
						|| (node.data.listaImg === true && (conteudo
								.search(".img") > 1
								|| conteudo.search(".tif") > 1 || conteudo
								.search(".TIF") > 1))
						|| (node.data.listaShp === true && (conteudo
								.search(".shp") > 1 || conteudo.search(".SHP") > 1))) {
					conteudo = "<a href='#' title='" + $trad("g2")
							+ "' onclick='" + funcaoClick + "(\""
							+ node.data.caminho + "/" + conteudo + "\")' >"
							+ conteudo + "</a>";
					//if (retorno.data.urls && retorno.data.urls[ig] != "") {
						// conteudo += "&nbsp;<img
						// src='"+i3GEO.configura.locaplic+"/.."+retorno.data.urls[ig]+"'
						// style='height:20px;width:20px'/>";
					//}
					new YAHOO.widget.HTMLNode({
						isLeaf : true,
						enableHighlight : false,
						expanded : false,
						html : conteudo,
						caminho : node.data.caminho + "/" + conteudo
					}, node);
				}
			}
			node.loadComplete();
		};
		i3GEO.php.listaarquivos(montaLista, node.data.caminho);
	},
	/**
	 * Monta o texto com o titulo do tema.
	 *
	 * Parametros:
	 *
	 * {String} - cor que sera utilizada no estilo "color"
	 *
	 * {Object} - objeto com as propriedades do tema
	 *
	 * Return:
	 *
	 * {String} - texto formatado
	 */
	montaTextoTema : function(cor, tema) {
		var html, clique;
		html = "<td class='ygtvcontent' style='text-align:left;'>";
		// verifica que tipo de botao sera usado para o usuario clicar
		if (i3GEO.arvoreDeTemas.TIPOBOTAO !== "download") {
			html += "<input title='"
					+ tema.tid
					+ "' style='position:relative;top:3px;width:12px;height:12px;cursor:pointer;border:solid 0 white;' ";
		} else {
			html += "<img style='position:relative;top:3px;' title='"
					+ tema.tid + "' src='" + i3GEO.configura.locaplic + "/imagens/down1.gif'";
		}
		// verifica se existe uma funcao alternativa de ativacao do tema
		if (i3GEO.arvoreDeTemas.ATIVATEMA !== "") {
			clique = "onclick=\"" + i3GEO.arvoreDeTemas.ATIVATEMA + "\"";
		} else {
			clique = "onclick='i3GEO.arvoreDeTemas.verificaStatusTema(this,\""
					+ tema.tid + "\")'";
		}
		html += clique;
		// se o icone nao for do tipo download, define os valores do input
		if (tema.nameInput) {
			html += " name='" + tema.nameInput + "' ";
		}
		if (i3GEO.arvoreDeTemas.TIPOBOTAO !== "download") {
			html += " type='" + i3GEO.arvoreDeTemas.TIPOBOTAO + "' value='"
					+ tema.tid + "' />";
		} else {
			html += " /> ";
		}
		html += "<span title='"
				+ tema.tid
				+ "' onmouseout='javascript:this.style.color=\""
				+ cor
				+ "\";' onmouseover='javascript:this.style.color=\"blue\";' style='left:4px;cursor:pointer;text-align:left;color:"
				+ cor + ";padding-left:0px;position:relative;top:1px;' "
				+ clique + ">";
		html += tema.nome;
		html += "</span></td>";
		return (html);
	},
	/**
	 * Funcao default que adiciona o tema ao mapa Verifica se o tema ja existe
	 * ou nao e decide se deve desligar ou ligar
	 */
	verificaStatusTema : function(obj, tid) {
		//i3GEO.mapa.ativaTema(tid)
		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			if(i3GEO.arvoreDeCamadas.ARVORE){
				i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, obj.checked);
			}
			else{
				var temp = function() {
					i3GEO.php.corpo(i3GEO.atualiza, i3GEO.configura.tipoimagem);
					i3GEO.janela.fechaAguarde("redesenha");
				};
				if (!obj.checked) {
					i3GEO.php.ligatemas(temp, tid, "");
				} else {
					i3GEO.php.ligatemas(temp, "", tid);
				}
			}
		} else {
			i3GEO.arvoreDeTemas.adicionaTemas([ tid ]);
		}
	},
	/**
	 * Monta o no com informacoes adicionais sobre o tema.
	 *
	 * Parametro:
	 *
	 * {Object} - objeto com o no que foi clicado
	 */
	propTemas : function(node) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.propTemas()");

		var html, lkmini, lkmini1, lkgrcode, lkgrcode1, n, ogc;
		if (node.data.fonte && node.data.fonte !== ""
				&& node.data.fonte !== " ") {
			tempNode = new YAHOO.widget.HTMLNode({
				isLeaf : true,
				enableHighlight : false,
				expanded : false,
				html : "<a title='' href='" + node.data.fonte
						+ "' target='_blank' >Fonte</a>"
			}, node);
		}
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.mini === true) {
			lkmini = i3GEO.arvoreDeTemas.LOCAPLIC + "/testamapfile.php?map="
					+ node.data.idtema + ".map&tipo=mini";
			lkmini1 = i3GEO.arvoreDeTemas.LOCAPLIC + "/testamapfile.php?map="
					+ node.data.idtema + ".map&tipo=grande";
			new YAHOO.widget.HTMLNode(
					{
						isLeaf : true,
						enableHighlight : false,
						expanded : false,
						html : "<a title='' onmouseover='i3GEO.ajuda.mostraJanela(\"<img src="
								+ lkmini
								+ " />\")' href='"
								+ lkmini1
								+ "' target='blank' >Miniatura</a>"
					}, node);
		}
		if (node.data.ogc && node.data.ogc !== "nao") {
			if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.kml === true) {
				html = "<a href='#' title='' onclick='i3GEO.tema.dialogo.abreKml(\""
						+ node.data.idtema + "\",\"kml\")' >Kml</a>";
				if (node.data.kmz.toLowerCase() === "sim") {
					html = "<a href='#' title='' onclick='i3GEO.tema.dialogo.abreKml(\""
							+ node.data.idtema + "\",\"kmz\")' >Kml</a>";
				}
				new YAHOO.widget.HTMLNode({
					isLeaf : true,
					enableHighlight : false,
					expanded : false,
					html : html
				}, node);
			}
			ogc = i3GEO.arvoreDeTemas.LOCAPLIC + "/ogc.php?tema="
					+ node.data.idtema + "&service=wms&request=getcapabilities";
			new YAHOO.widget.HTMLNode({
				isLeaf : true,
				enableHighlight : false,
				expanded : false,
				html : "<a title='getcapabilities' href='" + ogc
						+ "' target='blank' >WMS - OGC</a>"
			}, node);
		}
		if (node.data.download && node.data.download.toLowerCase() !== "nao"
				&& i3GEO.arvoreDeTemas.TIPOBOTAO !== "download") {
			html = "<a href='" + i3GEO.configura.locaplic
					+ "/datadownload.htm?" + node.data.idtema
					+ "' target='_blank'>Download</a>";
			new YAHOO.widget.HTMLNode({
				isLeaf : true,
				enableHighlight : false,
				expanded : false,
				html : html
			}, node);
		}
		if (node.data.permitecomentario
				&& node.data.permitecomentario !== "nao"
				&& i3GEO.arvoreDeTemas.OPCOESADICIONAIS.comentarios === true) {
			html = "<a href='#' title='' onclick='i3GEO.tema.dialogo.comentario(\""
					+ node.data.idtema
					+ "\",\"comentario\")' >"
					+ $trad("x19")
					+ "</a>";
			new YAHOO.widget.HTMLNode({
				isLeaf : true,
				enableHighlight : false,
				expanded : false,
				html : html
			}, node);
		}
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.qrcode === true) {
			lkgrcode = i3GEO.arvoreDeTemas.LOCAPLIC
					+ "/pacotes/qrcode/php/qr_html.php?d="
					+ i3GEO.arvoreDeTemas.LOCAPLIC
					+ "/ms_criamapa.php?interface="
					+ i3GEO.parametros.interfacePadrao + "&temasa="
					+ node.data.idtema + "&layers=" + node.data.idtema;
			lkgrcode1 = i3GEO.arvoreDeTemas.LOCAPLIC
					+ "/pacotes/qrcode/php/qr_img.php?d="
					+ i3GEO.arvoreDeTemas.LOCAPLIC
					+ "/ms_criamapa.php?interface="
					+ i3GEO.parametros.interfacePadrao + "&temasa="
					+ node.data.idtema + "&layers=" + node.data.idtema;
			new YAHOO.widget.HTMLNode(
					{
						isLeaf : true,
						enableHighlight : false,
						expanded : false,
						html : "<a title='' onmouseover='i3GEO.ajuda.mostraJanela(\"<img src="
								+ lkgrcode1
								+ " />\")' href='"
								+ lkgrcode
								+ "' target='blank' >Qrcode</a>"
					}, node);
		}
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.estrelas === true) {
			n = parseInt(node.data.nacessos
					/ (i3GEO.arvoreDeTemas.FATORESTRELA * 1), 10);
			if (n >= 5) {
				n = 5;
			}
			html = (n > 0) ? "<img src='" + i3GEO.configura.locaplic + "/imagens/e" + n + ".png"
					+ "'/>" : "<img src='" + i3GEO.configura.locaplic + "/imagens/e0.png'/>";
			new YAHOO.widget.HTMLNode({
				isLeaf : true,
				enableHighlight : false,
				expanded : false,
				html : html
			}, node);
		}
		if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.bookmark === true) {
			html = i3GEO.social.bookmark(i3GEO.configura.locaplic
					+ "/ms_criamapa.php?layers=" + node.data.idtema);
			new YAHOO.widget.HTMLNode({
				isLeaf : true,
				enableHighlight : false,
				expanded : false,
				html : html
			}, node);
		}
		node.loadComplete();
	},
	/**
	 * Constroi o HTML com as opcoes adicionais de inclusao de temas (upload de
	 * shp, etc.).
	 *
	 * Return:
	 *
	 * {String} - html gerado
	 */
	outrasOpcoesHTML : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.outrasOpcoesHTML()");

		var ins = "", t = 0, imb = i3GEO.configura.locaplic + "/imagens/branco.gif", OPCOESADICIONAIS = i3GEO.arvoreDeTemas.OPCOESADICIONAIS, estilo = function(
				i) {
			return " onmouseout='javascript:this.className = \""
					+ i
					+ " iconeMini iconeGuiaMovelMouseOut\";' onmouseover='javascript:this.className = \""
					+ i + " iconeMini iconeGuiaMovelMouseOver\";' class='" + i
					+ " iconeMini iconeGuiaMovelMouseOut' src='" + imb
					+ "' style='cursor:pointer;text-align:left' ";
		};
		if (OPCOESADICIONAIS.refresh === true) {
			ins += "<td><img "
					+ estilo("i3geo_refresh2")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.atualiza()' title='Refresh'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.uploadarquivo === true) {
			ins += "<td><img "
					+ estilo("conectarwms")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.conectaservico()' title='"
					+ $trad("a15") + "'/></td>";
			t += 20;
			ins += "<td><img "
					+ estilo("upload")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.uploadarquivo()' title='"
					+ $trad("a14") + "'/></td>";
			t += 20;
		} else {
			//depreciado na versao 6.0
			/*
			if (OPCOESADICIONAIS.uploadgpx === true) {
				ins += "<td><img "
						+ estilo("uploadgpx")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.uploadgpx()' title='upload GPX'/></td>";
				t += 20;
			}
			if (OPCOESADICIONAIS.uploaddbf === true) {
				ins += "<td><img "
						+ estilo("uploaddbf")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.uploaddbf()' title='"
						+ $trad("a2b") + "'/></td>";
				t += 20;
			}
			if (OPCOESADICIONAIS.uploadlocal === true) {
				ins += "<td><img "
						+ estilo("upload")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.upload()' title='"
						+ $trad("a2") + "'/></td>";
				t += 20;
			}
			if (OPCOESADICIONAIS.carregaKml === true) {
				ins += "<td><img "
						+ estilo("carregarKml")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.carregaKml()' title='Kml'/></td>";
				t += 20;
			}
			if (OPCOESADICIONAIS.conectarwms === true) {
				ins += "<td><img "
						+ estilo("conectarwms")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.conectarwms()' title='"
						+ $trad("a4") + "'/></td>";
				t += 20;
			}
			if (OPCOESADICIONAIS.conectarwmst === true) {
				ins += "<td><img "
						+ estilo("conectarwmst")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.conectarwmst()' title='"
						+ $trad("a4b") + "'/></td>";
				t += 20;
			}
			if (OPCOESADICIONAIS.conectargeorss === true) {
				ins += "<td><img "
						+ estilo("conectargeorss")
						+ " onclick='i3GEO.arvoreDeTemas.dialogo.conectargeorss()' title='"
						+ $trad("a5") + "'/></td>";
				t += 20;
			}
			*/
		}
		if (OPCOESADICIONAIS.downloadbase === true) {
			ins += "<td><img "
					+ estilo("download")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.downloadbase()' title='"
					+ $trad("a3") + "'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.importarwmc === true) {
			ins += "<td><img "
					+ estilo("importarwmc")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.importarwmc()' title='"
					+ $trad("a3a") + "'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.nuvemTags === true) {
			ins += "<td><img "
					+ estilo("nuvemtags")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.nuvemTags()' title='"
					+ $trad("a5a") + "'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.nuvemTagsFlash === true) {
			ins += "<td><img "
					+ estilo("nuvemtags")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.nuvemTagsFlash()' title='"
					+ $trad("a5a") + "'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.carousel === true) {
			ins += "<td><img "
					+ estilo("carouselTemas")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.carouselTemas()' title='Miniaturas'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.inde === true) {
			ins += "<td><img "
					+ estilo("buscaInde")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.arvoreDeTemas.dialogo.buscaInde()' title='Pesquisa na INDE'/></td>";
			t += 20;
		}
		if (OPCOESADICIONAIS.metaestat === true) {
			ins += "<td><img "
					+ estilo("iconeMetaestat")
					+ " onclick='i3GEO.util.animaClique(this);i3GEO.mapa.dialogo.metaestat()' title='Cartogramas estatisticos'/></td>";
			t += 20;
		}
		return ("<table width='" + t + "px' ><tr>" + ins + "</tr></table>");
	},
	/**
	 * Function: desativaCheckbox
	 *
	 * Desmarca todos os checkbox dos temas marcados na arvore
	 */
	desativaCheckbox : function(valor) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.desativaCheckbox()");

		var o, inputs, n, i;
		o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
		inputs = o.getElementsByTagName("input");
		n = inputs.length;
		i = 0;
		do {
			inputs[i].checked = false;
			i += 1;
		} while (i < n);
	},
	/**
	 * Function: buscaCheckbox
	 *
	 * Retorna um input com determinado value
	 */
	buscaCheckbox : function(valor) {
		var o, inputs, n, i;
		if(i3GEO.arvoreDeTemas.ARVORE){
			o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
			if(o){
				inputs = o.getElementsByTagName("input");
				n = inputs.length;
				i = 0;
				do {
					if(inputs[i].value === valor){
						return inputs[i];
					}
					i += 1;
				} while (i < n);
			}
		}
		return false;
	},
	/**
	 * Lista os temas com checkbox marcados.
	 *
	 * Return:
	 *
	 * {Array} - array com os codigos dos temas
	 */
	listaTemasAtivos : function() {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.listaTemasAtivos()");

		var o, inputs, n, i, lista;
		o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
		inputs = o.getElementsByTagName("input");
		n = inputs.length;
		i = 0;
		lista = [];
		do {
			if (inputs[i].checked === true) {
				lista.push(inputs[i].value);
			}
			i += 1;
		} while (i < n);
		return (lista);
	},
	/**
	 * Depreciado na versao 4.4
	 *
	 * Procura temas na arvore de temas (a busca e feita no servidor e nao na
	 * arvore atual).
	 *
	 * Parametro:
	 *
	 * {String}
	 */
	buscaTema : function(palavra) {
		if (palavra === "") {
			return;
		}
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.buscaTema()");

		var busca, root, nodePalavra = "";
		resultadoProcurar = function(retorno) {
			var mostra, tempNode, d, conta, ig, ngSgrupo, tempn, sg, ngTema, tempng, st, lk = "";
			if (!retorno.data) {
				i3GEO.janela.tempoMsg("Ocorreu um erro");
			} else {
				retorno = retorno.data;
				conta = 0;
				if ((retorno !== "erro") && (typeof (retorno) !== 'undefined')) {
					ig = retorno.length - 1;
					if (ig >= 0) {
						do {
							ngSgrupo = retorno[ig].subgrupos;
							tempn = ngSgrupo.length;
							for (sg = 0; sg < tempn; sg += 1) {
								ngTema = ngSgrupo[sg].temas;
								tempng = ngTema.length;
								for (st = 0; st < tempng; st += 1) {
									mostra = true;
									if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
											&& ngTema[st].download === "nao") {
										mostra = false;
									}
									if (i3GEO.arvoreDeTemas.FILTRAOGC
											&& ngTema[st].ogc === "nao") {
										mostra = false;
									}
									if (mostra) {
										d = i3GEO.arvoreDeTemas.montaTextoTema(
												"gray", ngTema[st]);
										if (ngTema[st].link !== " ") {
											lk = "<a href='"
													+ ngTema[st].link
													+ "' target='blank'>&nbsp;fonte</a>";
										}
										d += "<td style='text-allign:left'> ("
												+ (ngSgrupo[sg].subgrupo)
												+ ") " + lk + "</td>";
										tempNode = new YAHOO.widget.HTMLNode(d,
												nodePalavra, false, true);
										tempNode.isLeaf = true;
										tempNode.enableHighlight = false;
									}
									conta += 1;
								}
							}
						} while (ig--);
					} else {
						d = "<span style='color:red'>Nada encontrado<br><br></span>";
						tempNode = new YAHOO.widget.HTMLNode(d, nodePalavra,
								false, true);
						tempNode.isLeaf = true;
						tempNode.enableHighlight = false;
					}
				}
			}
			nodePalavra.loadComplete();
		};
		//
		// funcao que sera executada para buscar os temas
		//
		busca = function() {
			i3GEO.php.procurartemas2(resultadoProcurar, i3GEO.util
					.removeAcentos(palavra));
		};
		//
		// recolhe todos os nos e acrescenta um novo
		//
		i3GEO.arvoreDeTemas.ARVORE.collapseAll();
		root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if (!i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id",
				"temasEncontrados")) {
			tempNode = new YAHOO.widget.HTMLNode({
				html : "Temas encontrados",
				id : "temasEncontrados"
			}, root, false, true);
			tempNode.enableHighlight = false;
		} else {
			tempNode = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id",
					"temasEncontrados");
		}
		nodePalavra = new YAHOO.widget.HTMLNode({
			html : palavra
		}, tempNode, false, true);
		nodePalavra.enableHighlight = false;
		i3GEO.arvoreDeTemas.ARVORE.draw();
		tempNode.expand();
		nodePalavra.setDynamicLoad(busca, 1);
		nodePalavra.expand();
	},
	/**
	 * Function: buscaTema2
	 *
	 * Procura temas na arvore de temas (a busca e feita no servidor e nao na
	 * arvore atual).
	 *
	 * Parametro:
	 *
	 * {String}
	 */
	buscaTema2 : function(palavra) {
		if (palavra === "") {
			return;
		}
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.buscaTema()");

		var busca, root, nodePalavra = "";
		resultadoProcurar = function(retorno) {
			var ig, montaTexto = function(ngSgrupo) {
				var tempn, ngTema, tempng, mostra, d, lk = "", st, sg;
				tempn = ngSgrupo.length;
				for (sg = 0; sg < tempn; sg += 1) {
					ngTema = ngSgrupo[sg].temas;
					tempng = ngTema.length;
					for (st = 0; st < tempng; st += 1) {
						mostra = true;
						try {
							if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
									&& ngTema[st].download === "nao") {
								mostra = false;
							}
							if (i3GEO.arvoreDeTemas.FILTRAOGC
									&& ngTema[st].ogc === "nao") {
								mostra = false;
							}
						} catch (e) {
						}
						if (mostra) {
							d = i3GEO.arvoreDeTemas.montaTextoTema("gray",
									ngTema[st]);
							if (ngTema[st].link !== " ") {
								lk = "<a href='" + ngTema[st].link
										+ "' target='blank'>&nbsp;fonte</a>";
							}
							if (ngSgrupo[sg].subgrupo) {
								d += "<td style='text-allign:left'> ("
										+ (ngSgrupo[sg].subgrupo) + ") " + lk
										+ "</td>";
							} else {
								d += "<td style='text-allign:left'> ("
										+ (ngSgrupo[sg].grupo) + ")" + lk
										+ "</td>";
							}
							new YAHOO.widget.HTMLNode({
								enableHighlight : false,
								isLeaf : true,
								html : d,
								expanded : false
							}, nodePalavra);
						}
						conta += 1;
					}
				}
			};
			if (!retorno.data) {
				i3GEO.janela.tempoMsg("Ocorreu um erro");
			} else {
				retorno = retorno.data;
				conta = 0;
				if ((retorno !== "erro") && (typeof (retorno) !== 'undefined')) {
					ig = retorno.length - 1;
					if (ig >= 0) {
						do {
							montaTexto([ retorno[ig] ]);
							montaTexto(retorno[ig].subgrupos);
						} while (ig--);
					} else {
						new YAHOO.widget.HTMLNode(
								{
									enableHighlight : false,
									isLeaf : true,
									expanded : false,
									html : "<span style='color:red'>Nada encontrado<br><br></span>"
								}, nodePalavra);
					}
				}
			}
			nodePalavra.loadComplete();
		};

		//
		// funcao que sera executada para buscar os temas
		//
		busca = function() {
			i3GEO.php.procurartemas2(resultadoProcurar, i3GEO.util
					.removeAcentos(palavra));
		};
		//
		// recolhe todos os nos e acrescenta um novo
		//
		i3GEO.arvoreDeTemas.ARVORE.collapseAll();
		root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if (!i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id",
				"temasEncontrados")) {
			tempNode = new YAHOO.widget.HTMLNode({
				enableHighlight : false,
				expanded : false,
				html : "Temas encontrados",
				id : "temasEncontrados"
			}, root);
		} else {
			tempNode = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id",
					"temasEncontrados");
		}
		nodePalavra = new YAHOO.widget.HTMLNode({
			enableHighlight : false,
			expanded : false,
			html : palavra
		}, tempNode);
		i3GEO.arvoreDeTemas.ARVORE.draw();
		tempNode.expand();
		nodePalavra.setDynamicLoad(busca, 1);
		nodePalavra.expand();
	},
	/**
	 * Function: adicionaTemas
	 *
	 * Adiciona ao mapa os temas selecionados na arvore
	 *
	 * Parametro:
	 *
	 * {array} - (opcional) codigo do tema que sera adicionado ao mapa. Se
	 * nao for especificado, a lista de codigos sera obtida da arvore de temas
	 */
	adicionaTemas : function(tsl) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.adicionaTemas()");

		var exec, tempAdiciona = function(retorno) {
			i3GEO.atualiza();
			//
			// verifica se deve ser ativada uma outra guia que nao a atual
			//
			if (i3GEO.arvoreDeTemas.RETORNAGUIA !== "") {
				if (i3GEO.arvoreDeTemas.RETORNAGUIA !== i3GEO.guias.ATUAL) {
					i3GEO.guias.escondeGuias();
					i3GEO.guias.mostra(i3GEO.arvoreDeTemas.RETORNAGUIA);
				}
			}
			//
			// verifica se a janela da ferramenta identifica esta ativa para
			// atualizar a lista de temas
			//
			try {
				if ($i("i3GEOidentificalistaTemas")) {
					i3GEOF.identifica.listaTemas();
				}
			} catch (r) {
				if (typeof (console) !== 'undefined')
					console.error(r);
			}
		};
		i3GEO.mapa.ativaTema();
		//
		// pega os temas ativados na arvore de menus
		//
		if (arguments.length !== 1) {
			tsl = i3GEO.arvoreDeTemas.listaTemasAtivos();
		}
		if (tsl.length > 0) {
			exec = function(tsl) {
				var no, p, funcao;
				// verifica se o tema esta vinculado ao sistema de metadados
				// estatisticos
				if (i3GEO.arvoreDeTemas.ARVORE) {
					no = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("idtema",
							tsl[0]);
					// refere-se a uma camada que advem do sistema de metadados
					// estatisticos
					if (no && no.data.tipoa_tema === "META") {
						// se o id_medida_variavel for vazio, e necessario obter
						// o id guardado no mapfile
						// isso ocorre pq alguns temas do catalogo podem ter
						// sido inseridos
						// como um mapfile normal que tem vinculo com o sistema
						// de metadados
						//
						if (no.data.id_medida_variavel != undefined
								&& no.data.id_medida_variavel != "") {
							i3GEO.util.dialogoFerramenta(
									"i3GEO.mapa.dialogo.metaestat()",
									"metaestat", "metaestat", "index.js",
									"i3GEOF.metaestat.inicia('flutuanteSimples','',"
											+ no.data.id_medida_variavel + ")");
						} else {
							// faz uma chamada para obter o id_medida_variavel
							p = i3GEO.configura.locaplic
									+ "/ferramentas/metaestat/analise.php?funcao=pegaMetadadosMapfile"
									+ "&idtema=" + no.data.idtema + "&g_sid="
									+ i3GEO.configura.sid;
							funcao = function(retorno) {
								i3GEO.util
										.dialogoFerramenta(
												"i3GEO.mapa.dialogo.metaestat()",
												"metaestat",
												"metaestat",
												"index.js",
												"i3GEOF.metaestat.inicia('flutuanteSimples','',"
														+ retorno.data.id_medida_variavel
														+ ")");
							};
							cpJSON.call(p, "foo", funcao);

						}
					} else if (no && no.data.tipoa_tema === "METAREGIAO") {
						p = i3GEO.configura.locaplic
								+ "/ferramentas/metaestat/analise.php?funcao=adicionaLimiteRegiao"
								+ "&codigo_tipo_regiao="
								+ no.data.codigo_tipo_regiao + "&g_sid="
								+ i3GEO.configura.sid;
						funcao = function() {
							// i3GEO.janela.fechaAguarde("aguardeMostraRegiao");
							i3GEO.atualiza();
						};
						// i3GEO.janela.abreAguarde("aguardeMostraRegiao","...");
						cpJSON.call(p, "foo", funcao);
					} else {
						i3GEO.php.adtema(tempAdiciona, tsl.toString());
					}
				} else {
					i3GEO.php.adtema(tempAdiciona, tsl.toString());
				}
			};
			//
			// se forem encontrados temas ativos na arvore de menus, o mapa e
			// redesenhado com a adicao de novos temas
			//
			// verifica se o tema ja existe no mapa
			//
			if (i3GEO.arvoreDeCamadas.pegaTema(tsl[0]) !== "") {
				i3GEO.janela.confirma($trad("x76"), 300, $trad("x14"),
						$trad("x15"), function() {
							exec(tsl);
						});
			} else {
				exec.call(this, tsl);
			}
		}
	},
	/**
	 * Function: comboMenus
	 *
	 * Busca a lista de menus existentes no i3geo e monta um combo com o
	 * resultado.
	 *
	 * Ao escolher uma opcao do combo, a funcao de retorno recebera como
	 * parametro o id do menu.
	 *
	 * Parametros:
	 *
	 * {String} - endereco do i3geo
	 *
	 * {String} - nome da funcao que sera executada quando o
	 * usuario escolhe um grupo
	 *
	 * {String} - id do elemento HTML que recebera o combo
	 *
	 * {String} - id do combo que sera criado
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 */
	comboMenus : function(locaplic, funcaoOnchange, idDestino, idCombo,
			largura, altura) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboMenus()");

		i3GEO.configura.locaplic = locaplic;
		var combo = function(retorno) {
			var ob, ins, ig;
			ob = retorno.data;
			ins = "<select id='"
					+ idCombo
					+ "' SIZE="
					+ altura
					+ " style=width:"
					+ largura
					+ "px onchange='"
					+ funcaoOnchange
					+ "(this.value)' ><option value='' >Escolha um menu:</option>";
			for (ig = 0; ig < ob.length; ig += 1) {
				if (ob[ig].publicado !== "nao" && ob[ig].publicado !== "NAO") {
					if (ob[ig].nomemenu) {
						ins += "<option value=" + ob[ig].idmenu + " >"
								+ ob[ig].nomemenu + "</option>";
					}
				}
			}
			$i(idDestino).innerHTML = ins + "</select>";
			return retorno.data;
		};
		i3GEO.php.pegalistademenus(combo);
	},
	/**
	 * Function: comboGruposMenu
	 *
	 * Busca a lista de grupos existentes no menu de temas do i3geo e monta um
	 * combo com o resultado.
	 *
	 * Ao escolher uma opcao do combo, a funcao de retorno recebera como
	 * parametro o id do grupo.
	 *
	 * Parametros:
	 *
	 * {String} - endereco do i3geo
	 *
	 * {String} - nome da funcao que sera executada quando o
	 * usuario escolhe um grupo
	 *
	 * {String} - id do elemento HTML que recebera o combo
	 *
	 * {String} - id do combo que sera criado
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 *
	 * {inteiro} - id do menu que sera utilizado para obter os dados
	 */
	comboGruposMenu : function(locaplic, funcaoOnchange, idDestino, idCombo,
			largura, altura, id_menu) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboGruposMenu()");

		i3GEO.configura.locaplic = locaplic;
		i3GEO.arvoreDeTemas.temasRaizGrupos = [];
		var combo = function(retorno) {
			var ins, ig, obGrupos = retorno.data;
			ins = "<select id='"
					+ idCombo
					+ "' SIZE="
					+ altura
					+ " style=width:"
					+ largura
					+ "px onchange='"
					+ funcaoOnchange
					+ "(this.value)' ><option value='' >Escolha um grupo:</option>";
			for (ig = 0; ig < obGrupos.grupos.length; ig += 1) {
				if (obGrupos.grupos[ig].nome) {
					ins += "<option value=" + obGrupos.grupos[ig].id_n1 + " >"
							+ obGrupos.grupos[ig].nome + "</option>";
				}
				i3GEO.arvoreDeTemas.temasRaizGrupos[obGrupos.grupos[ig].id_n1] = obGrupos.grupos[ig].temasgrupo;
			}
			$i(idDestino).innerHTML = ins + "</select>";
		};
		i3GEO.php.pegalistadegrupos(combo, id_menu, "nao");
	},
	/**
	 * Function: comboSubGruposMenu
	 *
	 * Monta um combo com a lista de subgrupos de um grupo do menu de temas do
	 * i3geo.
	 *
	 * Ao escolher um subgrupo, a funcao de retorno recebera o id do grupo e o
	 * id do subgrupo.
	 *
	 * Parametros:
	 *
	 * {String} - endereco do i3geo
	 *
	 * {String} - nome da funcao que sera executada quando o
	 * usuario escolhe um grupo
	 *
	 * {String} - id do elemento HTML que recebera o combo
	 *
	 * {String} - id do combo que sera criado
	 *
	 * {String} - identificador do grupo que sera pesquisado
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 */
	comboSubGruposMenu : function(locaplic, funcaoOnchange, idDestino, idCombo,
			idGrupo, largura, altura) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboSubGruposMenu()");

		if (idGrupo !== "") {
			var combo = function(retorno) {
				var ins, sg, ig;
				ins = "<select id='"
						+ idCombo
						+ "' size="
						+ altura
						+ " style=width:"
						+ largura
						+ "px onchange='"
						+ funcaoOnchange
						+ "(\""
						+ idGrupo
						+ "\",this.value)' ><option value='' >Escolha um sub-grupo:</option>";
				if (retorno.data.subgrupo) {
					sg = retorno.data.subgrupo;
					for (ig = 0; ig < sg.length; ig += 1) {
						ins += "<option value=" + sg[ig].id_n2 + " >"
								+ sg[ig].nome + "</option>";
					}
				}
				$i(idDestino).innerHTML = ins + "</select>";
			};
			i3GEO.php.pegalistadeSubgrupos(combo, "", idGrupo);
		}
	},
	/**
	 * Function: comboTemasMenu
	 *
	 * Monta um combo com a lista de temas do i3geo.
	 *
	 * Parametros:
	 *
	 * {string} - endereco do i3geo
	 *
	 * {string} - nome da funcao que sera executada quando o usuario
	 * escolhe um grupo
	 *
	 * {string} - id do elemento HTML que recebera o combo
	 *
	 * {string} - id do combo que sera criado
	 *
	 * {string} - identificador do grupo que sera pesquisado
	 *
	 * {string} - id do subgrupo
	 *
	 * {inteiro} - largura em pixels do combo
	 *
	 * {inteiro} - altura do combo em linhas
	 *
	 * {string} - id do menu escolhido
	 *
	 * {objeto} - (opcional) objeto contendo a lista de temas
	 */
	comboTemasMenu : function(locaplic, funcaoOnchange, idDestino, idCombo,
			idGrupo, idSubGrupo, largura, altura, id_menu, temas) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeTemas.comboTemasMenu()");

		var combo = function(retorno) {
			var ins, sg, ig;
			if (idSubGrupo != "") {
				ins = "<select id='"
						+ idCombo
						+ "' size="
						+ altura
						+ " style=width:"
						+ largura
						+ "px onchange='"
						+ funcaoOnchange
						+ "("
						+ idGrupo
						+ ","
						+ idSubGrupo
						+ ",this.value)' ><option value='' >Escolha um tema:</option>";
			} else {
				ins = "<select id='"
						+ idCombo
						+ "' size="
						+ altura
						+ " style=width:"
						+ largura
						+ "px onchange='"
						+ funcaoOnchange
						+ "("
						+ idGrupo
						+ ",\"\",this.value)' ><option value='' >Escolha um tema:</option>";
			}

			if (typeof (retorno.data) !== 'undefined') {
				retorno = retorno.data.temas;
			}
			sg = retorno.length;
			for (ig = 0; ig < sg; ig++) {
				ins += "<option value=" + retorno[ig].tid + " >"
						+ retorno[ig].nome + "</option>";
			}
			$i(idDestino).innerHTML = ins + "</select>";
		};
		if (typeof (temas) === 'undefined' || temas === "") {
			i3GEO.php.pegalistadetemas(combo, id_menu, idGrupo, idSubGrupo);
		} else {
			combo(temas);
		}
	},
	/**
	 * Abre uma janela flutuante contendo um iframe
	 *
	 * Parametros:
	 *
	 * {string} - largura
	 *
	 * {string} - altura
	 *
	 * {string} - src do iframe
	 */
	abrejanelaIframe : function(w, h, s) {
		var i = parseInt(Math.random() * 100, 10), janelaeditor = i3GEO.janela
				.cria(w, h, s, i, 10, s, "janela" + i, false), wdocaiframe = "";
		wdocaiframe = $i("janela" + i + "i");
		if (wdocaiframe) {
			wdocaiframe.style.width = "100%";
			wdocaiframe.style.height = "100%";
		}
		YAHOO.util.Event.addListener(janelaeditor[0].close, "click",
				i3GEO.arvoreDeTemas.atualiza, janelaeditor[0].panel, {
					id : janelaeditor[0].id
				}, true);
	},
	/**
	 * Section: i3GEO.arvoreDeTemas.dialogo
	 *
	 * Abre as janelas de dialogo com as opcoes adicionais que permitem
	 * acrescentar temas ao mapa
	 *
	 * Por exemplo, para abrir a janela de upload de arquivos dbf, utilize
	 *
	 * i3GEO.arvoreDeTemas.dialogo.uploaddbf()
	 */
	dialogo : {
		/**
		 * Function: dialogo.uploadarquivo
		 *
		 * Abre uma janela flutunate que permite abrir outras ferramentas para o
		 * upload de arquivos de determinados tipos
		 */
		uploadarquivo : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
				+ "/ferramentas/uploadarquivos/dependencias.php",
				"i3GEOF.uploadarquivos.iniciaJanelaFlutuante()",
				"i3GEOF.uploadarquivos_script");
		},
		/**
		 * Function: dialogo.conectaservico
		 *
		 * Abre uma janela flutunate que permite abrir outras ferramentas para
		 * conexao com servicos externos
		 */
		conectaservico : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
				+ "/ferramentas/conectarservicos/dependencias.php",
				"i3GEOF.conectarservicos.iniciaJanelaFlutuante()",
				"i3GEOF.conectarservicos_script");
		},
		/**
		 * Function: dialogo.carouselTemas
		 *
		 * Abre a janela flutuante para o usuario adicionar temas baseado nas
		 * imagens miniatura
		 */
		carouselTemas : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/carouseltemas/index.js",
					"i3GEOF.carouseltemas.criaJanelaFlutuante()",
					"i3GEOF.carouseltemas_script");
		},
		/**
		 * Function: dialogo.buscaInde
		 *
		 * Abre a janela flutuante para o usuario procurar metadados na INDE
		 */
		buscaInde : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/buscainde/dependencias.php",
					"i3GEOF.buscainde.iniciaJanelaFlutuante()",
					"i3GEOF.buscainde_script");
		},
		/**
		 * Function: dialogo.vinde
		 *
		 * Abre a janela flutuante com os servi&ccedil;os cadastrados no visualizador da INDE
		 */
		vinde : function() {
			i3GEO.util
					.scriptTag(i3GEO.configura.locaplic
							+ "/ferramentas/vinde/dependencias.php",
							"i3GEOF.vinde.iniciaJanelaFlutuante()",
							"i3GEOF.vinde_script");
		},
		/**
		 * Function: dialogo.nuvemTags
		 *
		 * Mostra a nuvem de tags para escolha de temas baseado nos tags
		 * registrados nos menus de temas
		 */
		nuvemTags : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/nuvemtags/dependencias.php",
					"i3GEOF.nuvemtags.iniciaJanelaFlutuante()",
					"i3GEOF.nuvemtags_script");
		},
		/**
		 * Function: dialogo.nuvemTagsFlash
		 *
		 * Mostra a nuvem de tags para escolha de temas baseado nos tags
		 * registrados nos menus de temas.
		 *
		 * Essa ferramenta e alternativa a ferramenta nuvemTags, mostrando tbm a
		 * nuvem com um aplicativo em flash
		 */
		nuvemTagsFlash : function() {
			i3GEO.janela.cria("550px", "350px", i3GEO.configura.locaplic
					+ "/ferramentas/nuvemtagsflash/index.htm", "", "",
					$trad("x44"));
		},
		/**
		 * Function: dialogo.navegacaoDir
		 *
		 * Abre a janela para adicionar temas navegando pelos diretorios do
		 * servidor
		 */
		navegacaoDir : function() {
			i3GEO.janela.cria("550px", "350px", i3GEO.configura.locaplic
					+ "/ferramentas/navegacaodir/index.htm", "", "",
					"<div class='i3GeoTituloJanela'>"+$trad("x45")+"</div>");
		},
		/**
		 * Function: dialogo.importarwmc
		 *
		 * Abre a janela para importar um arquivo WMC (Web Map Context)
		 */
		importarwmc : function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/importarwmc/dependencias.php",
					"i3GEOF.importarwmc.iniciaJanelaFlutuante()",
					"i3GEOF.importarwmc_script");
		},
		/**
		 * Function: dialogo.conectarwfs
		 *
		 * Abre a janela para adicionar temas tendo como fonte um web service do
		 * tipo wfs
		 */
		conectarwfs : function() {
			i3GEO.janela.cria("400px", "300px", i3GEO.configura.locaplic
					+ "/ferramentas/conectarwfs/index.htm", "", "", "<div class='i3GeoTituloJanela'>WFS</div>");
		},
		/**
		 * Function: dialogo.downloadbase
		 *
		 * Abre o aplicativo datadownload
		 */
		downloadbase : function() {
			window.open(i3GEO.configura.locaplic + "/datadownload.htm");
		}
	}
};