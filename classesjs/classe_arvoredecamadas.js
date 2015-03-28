/**
 * Title: &Aacute;rvore de camadas
 *
 * Monta a &aacute;rvore com os temas existentes no mapa atual. A &aacute;rvore
 * cont&eacute;m as op&ccedil;&otilde;es de ligar e desligar temas,
 * altera&ccedil;&atilde;o na ordem de desenho, links para acesso a
 * funcionalidades, etc.
 *
 * Por padr&atilde;o, a &aacute;rvore &eacute; inserida no elemento HTML da interface do mapa cujo ID for igual a listaTemas
 *
 * i3GEO.arvoreDeCamadas permite controlar quais as op&ccedil;&otilde;es que
 * ser&atilde;o mostradas na &aacute;rvore e seu comportamento em diferentes
 * situa&ccdil;&otilde;s.
 *
 * Alguns itens s&atilde;o inclu&iacute;dos caso sejam localizados na interface elementos html com os seguintes ID
 *
 * listaLayersBase - lista os layers de fundo na interface OpenLayers
 *
 * buscaRapida - formul&aacute;rio de busca de dados em camadas
 *
 * listaPropriedades - conjunto de atalhos para ferramentas que controlam algumas caracter&iacute;sticas do mapa (na vers&atilde;o 6 do i3Geo esses atalhos constam em outros lugares, sendo desnecess&aacute;rio manter essa lista ativa na &aacute;rvore)
 *
 *
 * Namespace:
 *
 * i3GEO.arvoreDeCamadas
 *
 * Exemplo:
 *
 * Para alterar as op&ccedil;&otilde;es da &aacute;rvore, modifique as
 * propriedades colocando um c&oacute;digo como o seguinte no javascript
 * utilizado na interface de mapa que estiver sendo utilizada
 *
 * i3GEO.arvoreDeCamadas.INCLUILFUNDO = false;
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_arvoredecamadas.js>
 */

/**
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.arvoreDeCamadas =
	{
		/**
		 * Constant: ARVORE
		 *
		 * Objeto com a &aacute;rvore criada com YAHOO.widget.TreeView Pode ser usado para receber m&eacute;todos da API do YAHOO
		 *
		 * Tipo:
		 *
		 * {YAHOO.widget.TreeView}
		 */
		ARVORE : null,
		/**
		 * Constant: IDHTML
		 *
		 * Armazena o ID do elemento DOM onde a &aacute;rvore foi inserida.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * "listaTemas"
		 */
		IDHTML : "listaTemas",
		/**
		 * Constant: CAMADASINICIAIS
		 *
		 * O mesmo que CAMADAS mas guarda de forma permanente as camadas que iniciaram o mapa
		 *
		 * Tipo:
		 *
		 * {objeto}
		 */
		CAMADASINICIAIS : "",
		/**
		 * Variavel: CAMADAS
		 *
		 * Objeto com a lista de camadas existentes no mapa. &Eacute; definido na inicializa&ccedil;&atilde;o ou no redesenho do mapa.
		 *
		 * Este objeto &eacute; constru&iacute;do nas opera&ccedil;&otilde;es em PHP de inicializa&ccedil;&atilde;o ou redesenho do mapa e
		 * lista todos os layers existentes no mapfile tempor&aacute;rio em uso.
		 *
		 * classesphp/classe_mapas.php
		 *
		 * parametrosTemas
		 *
		 * Tipo:
		 *
		 * {objeto}
		 */
		CAMADAS : "",
		//TODO remover em 6.1
		/**
		 * Propriedade: FINALIZA
		 *
		 * Fun&ccedil;&atilde;o ou nome de uma fun&ccedil;&atilde;o que ser&aacute; executada ap&oacute;s a &aacute;rvore ter sido montada A
		 * fun&ccedil;o permite ajustar a &aacute;rvore conforme o programador desejar. &Eacute; executada apenas na cria&ccedil;&atilde;o
		 * da &aacute;rvore
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *  ""
		 */
		FINALIZA : "",
		finaliza : "",
		/**
		 * Propriedade: NOTEMA
		 *
		 * Objeto com os par&acirc;metros que s&atilde;o utilizados na &aacute;rvore de camadas para incluir os
		 * n&oacute;s correspondentes a cada tema
		 *
		 * Esse objeto segue as defini&ccedil;&otilde;es da API da biblioteca YUI2
		 *
		 * http://yui.github.io/yui2/docs/yui_2.9.0_full/docs/YAHOO.widget.Node.html
		 *
		 */
		NOTEMA : {
			expanded : true,
			hasIcon : false,
			enableHighlight : false
		},
		/**
		 * Propriedade: NOTEMAICON
		 *
		 * Objeto com os par&acirc;metros que s&atilde;o utilizados na &aacute;rvore de camadas para incluir os
		 * n&oacute;s correspondentes aos &iacute;cones de op&ccedil;&otilde;es de cada tema
		 *
		 * Esse objeto segue as defini&ccedil;&otilde;es da API da biblioteca YUI2
		 *
		 * http://yui.github.io/yui2/docs/yui_2.9.0_full/docs/YAHOO.widget.Node.html
		 *
		 */
		NOTEMAICONES : {
			expanded : false,
			hasIcon : true,
			enableHighlight : false
		},
		/**
		 * Propriedade: INCLUILFUNDO
		 *
		 * Inclui ou n&atilde;o na &aacute;rvore as camadas do tipo baselayer (layers de fundo). Afeta apenas os mapas baseados no OpenLayers.
		 * Ser&aacute; considerado como false caso exista no mapa outro local marcado para receber a lista de layers de fundo, ou seja,
		 * ser&aacute; sempre false caso o i3Geo localize algum elemento HTML com id &quot;listaLayersBase&quot;
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 * true
		 */
		INCLUILFUNDO : true,
		/**
		 * Propriedade: ATIVATEMA
		 *
		 * Nome da fun&ccedil;&atilde;o que ser&aacute; inclu&iacute;da no evento onclick do elemento checkbox adicionado no in&iacute;cio
		 * do nome de um camada
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *  ""
		 */
		ATIVATEMA : "",
		/**
		 * Propriedade: TEMPLATELEGENDA
		 *
		 * Nome do template HTML que sera usado para compor a legenda de cada tema. O HTML deve ser armazenado em i3geo/aplicmap. Templates
		 * de legenda seguem a sintaxe definida pelo software Mapserver
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * legenda5.htm
		 */
		TEMPLATELEGENDA : "legenda5.htm",
		/**
		 * Propriedade: BARRAPROGRESSO
		 *
		 * Mostra uma barra na parte superior do mapa que indica o progresso do desenho das camadas do mapa
		 *
		 * Funciona apenas na interface Openlayers
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		BARRAPROGRESSO : true,
		/**
		 * Propriedade: MOSTRALISTAKML
		 *
		 * Mostra na &aacute;rvore a lista de endere&ccedil;os de arquivos KML cadastrados no sistema de administra&ccedil;&atilde;o. Quando
		 * presente no mapa, o usu&aacute;rio pode escolher um KML de uma lista pr&eacute;-definida para ser adicionado
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		MOSTRALISTAKML : false,
		/**
		 * Propriedade: FILTRO
		 *
		 * Filtro que ser&aacute; aplicado para restringir os tipos de camadas mostradas na &aacute;rvore
		 *
		 * Tipo:
		 *
		 * {ligados|desligados|selecionados|download|wms|raster|toponimia}
		 *
		 * Default:
		 *  ""
		 */
		FILTRO : "",
		/**
		 * Propriedade: VERIFICAABRANGENCIATEMAS
		 *
		 * Verifica ou n&atilde;o se um tema da &aacute;rvore est&aacute; dentro da abrang&ecirc;ncia do mapa atual, marcando esses temas na
		 * &aacute;rvore
		 *
		 * A verifica&ccedil;&atilde;o s&oacute; &eacute; feita se o tema possuir a extens&atilde;o geogr&aacute;fica registrada (veja o
		 * sistema de administra&ccedil;&atilde;o)
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		VERIFICAABRANGENCIATEMAS : false,
		/**
		 * Propriedade: EXPANDESOLEGENDA
		 *
		 * Ao expandir um tema mostra apenas a legenda, sem as outras op&ccedil;&otilde;es
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		EXPANDESOLEGENDA : false,
		/**
		 * Propriedade: PERMITEEXPANDIRTEMAS
		 *
		 * Permite que as op&ccedil;&otilde;es abaixo dos n&oacute;s referentes a cada tema sejam mostradas
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		PERMITEEXPANDIRTEMAS : true,
		/**
		 * Propriedade: ARRASTARORDEM
		 *
		 * Ativa a op&ccedil;&atilde;o de arrastar um tema para alterar a ordem de desenho das camadas
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		ARRASTARORDEM : true,
		/**
		 * depreciado em 6.0
		 */
		REFRESH : true,
		/**
		 * depreciado em 6.0
		 */
		ARRASTARLIXEIRA : true,
		/**
		 * depreciado em 6.0
		 */
		ALTERAOPACIDADE : false,
		/**
		 * depreciado em 6.0
		 */
		FERRAMENTAS : true,
		/**
		 * depreciado em 6.0
		 */
		IMPRIMIR : false,
		/**
		 * depreciado em 6.0
		 */
		ANIMAMAPA : false,
		/**
		 * depreciado em 6.0
		 */
		LIGARDESLIGARTODOS : true,
		/**
		 * depreciado em 6.0
		 */
		FILTRAR : true,
		/**
		 * depreciado em 6.0
		 */
		ABRELEGENDA : true,
		/**
		 * Propriedade: EXPANDIDA
		 *
		 * Indica se a &aacute;rvore ser&aacute; montada de forma expandida ou n&atilde;o. Se true, os n&oacute;s do primeiro n&iacute;vel
		 * ser&atilde;o abertos na inicializa&ccedil;&atilde;o da &aacute;rvore.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		EXPANDIDA : false,
		/**
		 * Propriedade: LEGENDAEXPANDIDA
		 *
		 * Indica se a legenda da &aacute;rvore ser&aacute; montada de forma expandida ou n&atilde;o.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		LEGENDAEXPANDIDA : false,
		/**
		 * Propriedade: MOSTRATITULO
		 *
		 * Indica se o t&iacute;tulo da &aacute;rvore ser&aacute; inclu&iacute;do ou n&atilde;o
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		MOSTRATITULO : true,
		/**
		 * Propriedade: OPCOESICONES
		 *
		 * Inclui ou n&atilde;o os &iacute;cones de op&ccedil;&otilde;es em cada tema (farol, zoom para o tema, etc)
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		OPCOESICONES : true,
		/**
		 * depreciado em 6.0
		 */
		OPCOESTEMAS : true,
		/**
		 * Propriedade: OPCOESLEGENDA
		 *
		 * Inclui ou n&atilde;o o n&oacute; para mostrar a legenda do tema.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		OPCOESLEGENDA : true,
		/**
		 * Propriedade: OPCOESARVORE
		 *
		 * Inclui ou n&atilde;o as op&ccedil;&otilde;es de &iacute;cones mostradas na raiz da &aacute;vore
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		OPCOESARVORE : true,
		/**
		 * Propriedade: AGUARDALEGENDA
		 *
		 * Ativa a op&ccedil;&atilde;o de aguarde para mostrar a legenda de um tema quando o usu&aacute;rio estaciona o mouse sobre o nome
		 * de um tema.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		AGUARDALEGENDA : false,
		/**
		 * Propriedade: ICONETEMA
		 *
		 * Mostra ou n&atilde;o o &iacute;cone do tema caso exista.
		 *
		 * O &iacute;cone &eacute; definido no METADATA ICONETEMA no mapfile correspondente ao tema (veja o sistema de
		 * administra&ccedil;&atilde;o
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		ICONETEMA : true,
		/**
		 * depreciado em 6.0
		 */
		FUNCOES : {
			farolescala : true,
			excluir : true,
			sobe : true,
			desce : true,
			fonte : true,
			zoomtema : true,
			compartilhar : true,
			opacidade : true,
			mudanome : true,
			procurar : true,
			toponimia : true,
			etiquetas : true,
			filtrar : true,
			tabela : true,
			grafico : true,
			editorlegenda : true,
			destacar : true,
			cortina : true,
			sql : true,
			comentar : true,
			temporizador : true,
			wms : true,
			tme : true,
			copia : true
		},
		/**
		 * C&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3Geo
		 */
		SID : null,
		/**
		 * Endere&ccedil;o da aplica&ccedil;&atilde;o i3geo. Utilizado para definir o caminho para a chamada em AJAX.
		 */
		LOCAPLIC : null,
		/**
		 * Propriedade: CONFIGICONES
		 * 
		 * Define as configura&ccedil;&otilde;es dos &iacute;cones mostrados na raiz da &aacute;rvore e na raiz de cada tema
		 * 
		 * Cada &iacute;cone possu&iacute; um nome e propriedades, descritas a seguir, e que sao usadas no formato
		 * 
		 * i3GEO.arvoreDeCamadas.CONFIGICONES.refresh (onde refresh &eacute; o nome do &iacute;cone)
		 * 
		 * &Iacute;cones dispon&iacute;veis:
		 * 
		 * refresh - Mostra ou n&atilde;o a op&ccedil;&atilde;o que permite atualizar a &acute;rvore
		 * 
		 * opacidade - Mostra ou n&atilde;o a op&ccedil;&atilde;o que permite alterar a transpar&ecirc;ncia das camadas existentes no mapa
		 * 
		 * ferramentas - Mostra ou n&atilde;o a op&ccedil;&atilde;o que permite abrir os atalhos para as ferramentas que atuam sobre o mapa
		 * 
		 * imprimir - Mostra ou n&atilde;o a op&ccedil;&atilde;o que permite abrir a ferramenta de impress&atilde;o
		 * 
		 * animacao - Mostra ou n&atilde;o a op&ccedil;&atilde;o que permite gerar uma anima&ccedil;&atilde;o do mapa, ligando e desligando camadas
		 * 
		 * olhoaberto
		 * 
		 * olhofechado
		 * 
		 * Propriedades de cada &iacute;cone:
		 * 
		 * tipo - arvore|tema
		 * 
		 * icone - caminho para a imagem relativo a localiza&ccedil;&atilde;o do i3Geo
		 * 
		 * classe - nome da classe CSS que define o estilo do &iacute;cone
		 * 
		 * funcao - string com a fun&ccedil;&atilde;o inserida em onclick
		 * 
		 * title - string inserida em title
		 * 
		 * dica - ajuda sobre como usar a ferramenta
		 * 
		 * id - id que ser&aacute; inserido no &iacute;cone
		 * 
		 * status - true|false ser&aacute; ou n&atilde;o inclu&#297;do na &aacute;rvore
		 * 
		 * flag - true|false indicador tempor&aacute;rio se o &iacute;cone deve ou n&atilde;o ser inserido (o flag muda durante a montagem dos icones dos temas)
		 * 
		 */
		CONFIGICONES : {
			"refresh" : {
				tipo : "arvore",
				icone : "",
				classe : "i3geo_refresh2",
				funcao : "i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true)",
				title : "Refresh",
				dica : $trad("refresh"),
				id : "i3geo_refresh",
				status : true
			},
			"lixeira" : {
				tipo : "arvore",
				icone : "",
				classe : "i3geo_lixeira",
				funcao : "i3GEO.arvoreDeCamadas.dialogo.excluir()",
				title : $trad("t2"),
				dica : $trad("lixeira"),
				id : "i3geo_lixeira",
				status : true
			},
			"filtro" : {
				tipo : "arvore",
				icone : "",
				classe : "i3geo_filtro",
				funcao : "i3GEO.arvoreDeCamadas.dialogo.filtro()",
				title : $trad("t2a"),
				dica : $trad("filtraCam"),
				id : "i3geo_filtro",
				status : true
			},
			"legenda" : {
				tipo : "arvore",
				icone : "",
				classe : "soltaleg2",
				funcao : "i3GEO.mapa.legendaHTML.libera()",
				title : $trad("t2b"),
				dica : $trad("legenda"),
				id : "soltaleg2",
				status : true
			},
			"opacidade" : {
				tipo : "arvore",
				icone : "",
				classe : "opacidadeMapa",
				funcao : "i3GEO.mapa.dialogo.opacidade()",
				title : $trad("t20"),
				dica : "",
				id : "opacidadeMapa",
				status : false
			},
			"animacao" : {
				tipo : "arvore",
				icone : "",
				classe : "animaMapa",
				funcao : "i3GEO.mapa.dialogo.animacao()",
				title : $trad("p21"),
				dica : "",
				id : "animaMapa",
				status : false
			},
			"imprimir" : {
				tipo : "arvore",
				icone : "",
				classe : "imprimirMapa",
				funcao : "i3GEO.mapa.dialogo.imprimir()",
				title : $trad("d12"),
				dica : "",
				id : "imprimirMapa",
				status : false
			},
			"ferramentas" : {
				tipo : "arvore",
				icone : "",
				classe : "ferramentasMapa",
				funcao : "i3GEO.mapa.dialogo.ferramentas()",
				title : $trad("u15a"),
				dica : $trad("ferramMapa"),
				id : "ferramentasMapa",
				status : true
			},
			"ajuda" : {
				tipo : "arvore",
				icone : "",
				classe : "ajudaMapa",
				funcao : "i3GEO.arvoreDeCamadas.ajudaEmLista()",
				title : $trad("s1"),
				dica : "",
				id : "ajudaMapa",
				status : true
			},
			"olhoaberto" : {
				tipo : "arvore",
				icone : "",
				classe : "olhoAberto",
				funcao : "i3GEO.arvoreDeCamadas.aplicaTemas(\"ligartodos\")",
				title : $trad("t3a"),
				dica : $trad("t3a"),
				id : "olhoAberto",
				status : true
			},
			"olhofechado" : {
				tipo : "arvore",
				icone : "",
				classe : "olhoFechado",
				funcao : "i3GEO.arvoreDeCamadas.aplicaTemas(\"desligartodos\")",
				title : $trad("t3b"),
				dica : $trad("t3b"),
				id : "olhoFechado",
				status : true
			},
			"ferramentasTema" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/configure-shortcuts.png",
				classe : "arvCamFerramentas",
				funcao : "i3GEO.tema.dialogo.atalhoscamada",
				title : $trad("u15a"),
				dica : $trad("ferramCamadas"),
				id : "",
				status : true,
				flag : true
			},
			"removerTema" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/draw-x.png",
				classe : "arvCamRemoveLayer",
				funcao : "i3GEO.tema.exclui",
				title : $trad("t12"),
				dica : $trad("t12a"),
				id : "",
				status : true,
				flag : true
			},
			"zoomtema" : {
				tipo : "tema",
				icone : "imagens/gisicons/zoom-layer.png",
				classe : "arvCamZoomLayer",
				funcao : "i3GEO.tema.zoom",
				title : $trad("t17"),
				dica : $trad("t18"),
				id : "",
				status : true,
				flag : true
			},
			"sobe" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/draw-triangle3.png",
				classe : "arvCamSobeLayer",
				funcao : "i3GEO.tema.sobe",
				title : $trad("t13"),
				dica : $trad("t14"),
				id : "",
				status : true,
				flag : true
			},
			"desce" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/draw-triangle4.png",
				classe : "arvCamDesceLayer",
				funcao : "i3GEO.tema.desce",
				title : $trad("t15"),
				dica : $trad("t16"),
				id : "",
				status : true,
				flag : true
			},
			"contextoescala" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/task-attempt.png",
				classe : "arvCamDependeEscala",
				funcao : "",
				title : $trad("t36"),
				dica : $trad("t36"),
				id : "",
				status : true,
				flag : true
			},
			"selecionado" : {
				tipo : "tema",
				icone : "imagens/gisicons/select-cancel.png",
				classe : "arvCamSelecionado",
				funcao : "i3GEO.tema.limpasel",
				title : $trad("t4"),
				dica : $trad("t5"),
				id : "",
				status : true,
				flag : true
			},
			"zoomsel" : {
				tipo : "tema",
				icone : "imagens/gisicons/zoom-selection.png",
				classe : "arvCamZoomSelecionado",
				funcao : "i3GEO.tema.zoomsel",
				title : $trad("t4a"),
				dica : $trad("t5"),
				id : "",
				status : true,
				flag : true
			},
			"link" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/help-about.png",
				classe : "arvCamFonte",
				funcao : "i3GEO.tema.fonte",
				title : $trad("a9"),
				dica : $trad("a9"),
				id : "",
				status : true,
				flag : true
			},
			"download" : {
				tipo : "tema",
				icone : "imagens/oxygen/16x16/download.png",
				classe : "arvCamDownload",
				funcao : "i3GEO.tema.download",
				title : "Download",
				dica : $trad("t6"),
				id : "",
				status : true,
				flag : true
			}
		},

		/**
		 * Function: cria
		 *
		 * Cria a &aacute;rvore com as op&ccedil;&otilde;es de manipula&ccedil;&atilde;o das camadas existentes no mapa
		 *
		 * Parametros:
		 *
		 * {string} - (opcional) ID do elemento DOM onde a &aacute;rvore ser&aacute; inserida. Se for definido como "" o id ser&aacute;
		 * buscado da vari&aacute;vel IDHTML.
		 *
		 * {objeto} - (opcional) Objeto com as camadas e propriedades. Se n&atilde;o for definido ou for vazio, ser&aacute; utilizado
		 * i3GEO.arvoreDeCamadas.CAMADAS
		 *
		 * {string} - (opcional) C&oacute;digo da se&ccedil;&atilde;o PHP criada ao abrir o i3Geo
		 *
		 * {string} - (opcional) Endere&ccedil;o da aplica&ccedil;&atilde;o
		 *
		 * {string} - (opcional) Nome da fun&ccedil;&atilde;o que ser&aacute; incluida no evento disparado quando o usu&aacute;rio clicar no
		 * checkbox de um tema
		 */
		cria : function(onde, temas, g_sid, g_locaplic, funcaoTema) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.cria()");

			if (!YAHOO.lang.isUndefined(funcaoTema)) {
				i3GEO.arvoreDeCamadas.ATIVATEMA = funcaoTema;
			}
			var novoel, temp;
			// inclui o div para a barra de progresso
			if (i3GEO.arvoreDeCamadas.BARRAPROGRESSO === true && i3GEO.Interface.ATUAL === "openlayers") {
				if (!$i("i3GEOprogressoDiv")) {
					novoel = document.createElement("div");
					novoel.id = "i3GEOprogressoDiv";
					novoel.style.position = "absolute";
					novoel.style.top = "0px";
					novoel.style.zIndex = "50000";
					novoel.style.left = ((i3GEO.parametros.w / 2) - 75) + "px";
					// novoel.style.display = "none";
					$i(i3GEO.Interface.IDMAPA).appendChild(novoel);
					i3GEO.arvoreDeCamadas.progressBar = new YAHOO.widget.ProgressBar({
						height : 5,
						width : 150,
						minValue : 1,
						maxValue : 0,
						value : 0
					}).render("i3GEOprogressoDiv");
				}
			}
			i3GEO.arvoreDeCamadas.SID = typeof (g_sid) !== 'undefined' ? g_sid : i3GEO.configura.sid;
			i3GEO.arvoreDeCamadas.LOCAPLIC = typeof (g_locaplic) !== 'undefined' ? g_locaplic : i3GEO.configura.locaplic;
			if (onde !== "") {
				i3GEO.arvoreDeCamadas.IDHTML = onde;
			}
			if (i3GEO.arvoreDeCamadas.IDHTML === "") {
				return;
			}
			temp = $i(i3GEO.arvoreDeCamadas.IDHTML);
			if (!temp) {
				return;
			}
			if (temp.className === "") {
				temp.className = "i3GEOarvCam";
			}

			if (YAHOO.lang.isUndefined(temas) || temas === "") {
				temas = i3GEO.arvoreDeCamadas.CAMADAS;
			}
			i3GEO.arvoreDeCamadas.atualiza(temas);
			if (i3GEO.arvoreDeCamadas.finaliza !== "") {
				alert("i3GEO.arvoreDeCamadas.finaliza depreciado. Utilize i3GEO.arvoreDeCamadas.FINALIZA");
				i3GEO.arvoreDeCamadas.FINALIZA = i3GEO.arvoreDeCamadas.finaliza;
				eval(i3GEO.arvoreDeCamadas.finaliza);
			}
			if (i3GEO.arvoreDeCamadas.FINALIZA !== "") {
				if (YAHOO.lang.isFunction(i3GEO.arvoreDeCamadas.FINALIZA)) {
					i3GEO.arvoreDeCamadas.FINALIZA.call();
				} else {
					if (i3GEO.arvoreDeCamadas.FINALIZA != "") {
						eval(i3GEO.arvoreDeCamadas.FINALIZA);
					}
				}
			}
		},
		/**
		 * Function: inicia
		 *
		 * Essa fun&ccedil;&atilde;o cria e inicializa a &aacute;rvore de camadas utilizando o objeto default que cont&eacute;m os
		 * par&acirc;metros de cada camada. Faz o encadeamento das fun&ccedil;&otilde;es i3GEO.arvoreDeCamadas.cria e atualiza
		 *
		 * i3GEO.arvoreDeCamadas.FINALIZA tamb&eacute;m &eacute; executado se existir
		 *
		 * Parametros:
		 *
		 * string - id do elemento HTML onde a &aacute;rvore ser&aacute; inserida
		 */
		inicia : function(id) {
			i3GEO.arvoreDeCamadas.cria(id);
			i3GEO.arvoreDeCamadas.atualiza();
			if (i3GEO.arvoreDeCamadas.FINALIZA !== "") {
				if (YAHOO.lang.isFunction(i3GEO.arvoreDeCamadas.FINALIZA)) {
					i3GEO.arvoreDeCamadas.FINALIZA.call();
				} else {
					if (i3GEO.arvoreDeCamadas.FINALIZA != "") {
						eval(i3GEO.arvoreDeCamadas.FINALIZA);
					}
				}
			}
		},
		/**
		 * Function: atualiza
		 *
		 * Atualiza a &aacute;rvore de camadas.
		 *
		 * Antes de executar a atualiza&ccedil;&atilde;o, essa fun&ccedil;&atilde;o verifica se &eacute; necess&aacute;rio faz&ecirc;-lo. O
		 * objeto CAMADAS &eacute; comparado com o parametro "temas" para verificar se existem diferen&ccedil;as que justifiquem a
		 * atualiza&ccedil;&atilde;o.
		 *
		 * Parametros:
		 *
		 * {objeto} - Objeto com a lista de camadas e propriedades (veja CAMADAS). Se n&atilde;o existir, a &aacute;rvore &eacute;
		 * redesenhada
		 *
		 * {boolean} - for&ccedil;a a atualiza&ccedil;&atilde;o da &aacute;rvore, sem verificar automaticamente se a
		 * atualiza&ccedil;&atilde;o deve ou n&atilde;o ser feita
		 */
		atualiza : function(temas, forca) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.atualiza()");

			if (arguments.length === 0) {
				temas = i3GEO.arvoreDeCamadas.CAMADAS;
				i3GEO.arvoreDeCamadas.CAMADAS = "";
				forca = false;
			}
			var temp, newVal, root, tempNode, titulo = "", d, c, ltema, temaNode, temaNodeFilho = "", i, j, n, nk, k, noGrupo, incluidos = [], grupoNode =
				"", grupoLayers = i3GEO.configura.grupoLayers, textoTema = "";
			//
			// essa verificacao &eacute; necessaria quando a arvore &eacute; criada
			// fora dos padr&otilde;es normais
			//
			temp = $i(i3GEO.arvoreDeCamadas.IDHTML);
			if (temp) {
				if (forca === true) {
					temp.innerHTML = "";
				}
				if (temp.innerHTML !== "") {
					if (i3GEO.arvoreDeCamadas.comparaTemas(temas, i3GEO.arvoreDeCamadas.CAMADAS)) {
						i3GEO.arvoreDeCamadas.CAMADAS = temas;
						return;
					}
				}
			} else {
				return;
			}
			i3GEO.util.defineValor(i3GEO.arvoreDeCamadas.IDHTML, "innerHTML", "");
			i3GEO.arvoreDeCamadas.CAMADAS = temas;
			if (i3GEO.arvoreDeCamadas.CAMADASINICIAIS === "") {
				i3GEO.arvoreDeCamadas.CAMADASINICIAIS = temas;
			}
			(function() {
				function changeIconMode() {
					var currentIconMode = "";
					newVal = parseInt(this.value, 10);
					if (newVal !== currentIconMode) {
						currentIconMode = newVal;
					}
					buildTree();
				}
				function buildTree() {
					i3GEO.arvoreDeCamadas.ARVORE = new YAHOO.widget.TreeView(i3GEO.arvoreDeCamadas.IDHTML);
					// root = i3GEO.arvoreDeCamadas.ARVORE.getRoot();
				}
				buildTree();
			})();
			root = i3GEO.arvoreDeCamadas.ARVORE.getRoot();
			if(i3GEO.arvoreDeCamadas.MOSTRATITULO === true){
				titulo = $trad("t1");
			}
			tempNode = new YAHOO.widget.HTMLNode({
				expanded : true,
				html : titulo,
				hasIcon : i3GEO.arvoreDeCamadas.MOSTRATITULO,
				enableHighlight : true
			}, root);
			if (i3GEO.arvoreDeCamadas.OPCOESARVORE === true) {
				new YAHOO.widget.HTMLNode({
					expanded : false,
					html : i3GEO.arvoreDeCamadas.montaOpcoesArvore(),
					hasIcon : false,
					enableHighlight : false
				}, tempNode);
			}
			//
			// monta a &aacute;rvore.
			// se i3GEO.configura.grupoLayers estiver definido
			// o processo &eacute; diferenciado
			//
			if (grupoLayers === "") {
				c = temas.length;
				for (i = 0, j = c; i < j; i += 1) {
					ltema = temas[i];
					try {
						if ((ltema.escondido).toLowerCase() !== "sim") {
							textoTema = i3GEO.arvoreDeCamadas.montaTextoTema(ltema);
							if (textoTema !== "") {
								temp = i3GEO.arvoreDeCamadas.NOTEMA;
								temp.html = textoTema;
								temp.idlegenda = ltema.name;
								temp.tipo = "tema";
								temaNode = new YAHOO.widget.HTMLNode( temp, tempNode);
								if (i3GEO.arvoreDeCamadas.OPCOESICONES === true) {
									textoTema = i3GEO.arvoreDeCamadas.montaIconesTema(ltema);
									temp = i3GEO.arvoreDeCamadas.NOTEMAICONES;
									temp.id = ltema.name;
									temp.html = textoTema;
									temp.isLeaf = !i3GEO.arvoreDeCamadas.PERMITEEXPANDIRTEMAS;
									temaNodeFilho = new YAHOO.widget.HTMLNode(temp, temaNode);
								}
								if (ltema.classe !== "NAO" && this.PERMITEEXPANDIRTEMAS) {
									temaNodeFilho.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda, 1);
									if (i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA === true) {
										temaNodeFilho.expand();
									}
								}
							}
							YAHOO.util.Event.addListener($i("arrastar_" + ltema), "click", YAHOO.util.Event.preventDefault);
							YAHOO.util.Event.addFocusListener($i("arrastar_" + ltema), YAHOO.util.Event.preventDefault);
						}
					} catch (e) {
						if (typeof (console) !== 'undefined')
							console.error(e);
					}
				}
				//
				//inclui os nos correspondentes aos layers base na interface Openlayers
				//
				if(i3GEO.Interface.ATUAL === "openlayers" && i3GEO.arvoreDeCamadas.INCLUILFUNDO === true){
					c = i3GEO.Interface.openlayers.LAYERSADICIONAIS;
					n = c.length;
					k = "i3GEOarvCamTema";
					// verifica se a versao do IE e menor que 9
					if (navm && parseInt(YAHOO.env.ua.ie, 10) < 9) {
						k = "i3GEOarvCamTemaIE";
					}
					temaNode = new YAHOO.widget.HTMLNode(
						{
							html : $trad("p16"),
							isLeaf : false,
							hasIcon : true
						}, root
					);
					for (i = 0; i < n; i++) {
						temp =
							"<div class='" + k + "' onclick='i3GEO.Interface.openlayers.ativaFundo(\"" + c[i].name + "\")'>"
							+ "<input name=layer type=checkbox ";
						if(c[i].visibility === true){
							temp += " checked ";
						}
						temp += " value='" + c[i].name + "' id='CK" + c[i].id + "'/>"
							+ " <label for='CK" + c[i].id + "'>" + c[i].name + "</label></div>";
						new YAHOO.widget.HTMLNode(
							{
								html : temp,
								tipo : "fundo",
								isLeaf : true,
								hasIcon : false
							}, temaNode
						);
					}
				}
			} else {
				nk = temas.length;
				c = grupoLayers.length;
				// grupos
				for (i = 0; i < c; i += 1) {
					noGrupo = "";
					if (grupoLayers[i].icone && grupoLayers[i].icone === true) {
						noGrupo +=
							"<p><input class=inputsb style=cursor:pointer onclick='i3GEO.arvoreDeCamadas.ligaDesligaTemas(\""
								+ i3GEO.configura.grupoLayers[i].layers
								+ "\",this.checked)' type=checkbox title='Ligar/desligar temas do grupo' />&nbsp;";
					}
					noGrupo += "<div class='i3GEOarvCamGrupo'>" + grupoLayers[i].nome + "</div>";
					n = grupoLayers[i].layers.length;

					// layers de um grupo
					for (j = 0; j < n; j += 1) {
						// busca na lista de temas
						for (k = 0; k < nk; k += 1) {
							ltema = temas[k];
							if (ltema.name === grupoLayers[i].layers[j] && ltema.escondido === "nao") {
								if (noGrupo !== "") {
									grupoNode = new YAHOO.widget.HTMLNode({
										enableHighlight : false,
										hasIcon : false,
										html : noGrupo,
										expanded : true
									}, tempNode);
									noGrupo = "";
								}
								textoTema = i3GEO.arvoreDeCamadas.montaTextoTema(ltema);
								if (textoTema !== "") {
									d = {
										expanded : true,
										hasIcon : false,
										html : textoTema,
										idlegenda : ltema.name,
										tipo : "tema",
										enableHighlight : false
									};
									temaNode = new YAHOO.widget.HTMLNode(d, grupoNode);

									// if (i3GEO.arvoreDeCamadas.OPCOESICONES === true) {
									textoTema = i3GEO.arvoreDeCamadas.montaIconesTema(ltema);
									temaNodeFilho = new YAHOO.widget.HTMLNode({
										id : ltema.name,
										expanded : false,
										html : textoTema,
										enableHighlight : false,
										isLeaf : !this.PERMITEEXPANDIRTEMAS
									}, temaNode);
									// }
									if (ltema.classe !== "NAO" && this.PERMITEEXPANDIRTEMAS) {
										temaNodeFilho.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda, 1);
										if (i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA === true) {
											temaNodeFilho.expand();
										}
									}

									YAHOO.util.Event.addListener($i("arrastar_" + ltema), "click", YAHOO.util.Event.preventDefault);
									YAHOO.util.Event.addFocusListener($i("arrastar_" + ltema), YAHOO.util.Event.preventDefault);
									incluidos.push(ltema.name);
								}
							}
						}
					}
				}
				// inclui os temas n&atilde;o agrupados
				grupoNode = new YAHOO.widget.HTMLNode({
					expanded : true,
					hasIcon : false,
					enableHighlight : false,
					html : "<div class='i3GEOarvCamGrupo'>Outros</div>"
				}, tempNode);
				c = incluidos.length;
				for (k = 0; k < nk; k += 1) {
					ltema = temas[k];
					n = false;
					for (j = 0; j < c; j += 1) {
						if (incluidos[j] === ltema.name || ltema.escondido.toLowerCase() === "sim") {
							n = true;
						}
					}
					if (n === false) {
						textoTema = i3GEO.arvoreDeCamadas.montaTextoTema(ltema);
						if (textoTema !== "") {
							d = {
								expanded : true,
								hasIcon : false,
								html : textoTema,
								idlegenda : ltema.name,
								tipo : "tema",
								enableHighlight : false
							};
							temaNode = new YAHOO.widget.HTMLNode(d, grupoNode);
							// if (i3GEO.arvoreDeCamadas.OPCOESICONES === true) {
							textoTema = i3GEO.arvoreDeCamadas.montaIconesTema(ltema);
							temaNodeFilho = new YAHOO.widget.HTMLNode({
								id : ltema.name,
								expanded : false,
								html : textoTema,
								enableHighlight : false,
								isLeaf : !this.PERMITEEXPANDIRTEMAS
							}, temaNode);
							// }
							if (ltema.classe !== "NAO" && this.PERMITEEXPANDIRTEMAS) {
								temaNodeFilho.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda, 1);
								if (i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA === true) {
									temaNodeFilho.expand();
								}
							}

							YAHOO.util.Event.addListener($i("arrastar_" + ltema), "click", YAHOO.util.Event.preventDefault);
							YAHOO.util.Event.addFocusListener($i("arrastar_" + ltema), YAHOO.util.Event.preventDefault);
							incluidos.push(ltema.name);
						}

					}
				}
			}
			document.getElementById(i3GEO.arvoreDeCamadas.IDHTML).style.textAlign = "left";
			i3GEO.arvoreDeCamadas.ARVORE.draw();
			if (i3GEO.arvoreDeCamadas.ARRASTARORDEM === true || i3GEO.arvoreDeCamadas.ARRASTARLIXEIRA === true) {
				i3GEO.arvoreDeCamadas.ativaDragDrop();
			}
			//
			// verifica se a ferramenta identifica est&aacute; ativa para atualizar
			// a lista de temas
			//
			i3GEO.mapa.ativaTema(i3GEO.temaAtivo);
			i3GEO.arvoreDeCamadas.verificaAbrangenciaTemas();
			if (i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS === true) {
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
					"i3GEO.arvoreDeCamadas.verificaAbrangenciaTemas()"
				]);
			}
			i3GEO.eventos.executaEventos(i3GEO.eventos.ATUALIZAARVORECAMADAS);
		},
		/**
		 * Monta os &iacute;cones de op&ccedil;&otilde;es gerais da &aacute;rvore, como a lixira, ligar todos, etc.
		 *
		 * Return:
		 *
		 * {string} - html contendo os &iacute;cones
		 */
		montaOpcoesArvore : function() {
			var n, i=null, c, ins = "", imb = i3GEO.configura.locaplic + "/imagens/branco.gif", estilo =
				function(i) {
					return " onmouseout='javascript:this.className = \"" + i
						+ " iconeMini iconeGuiaMovelMouseOut\";' onmouseover='javascript:this.className = \"" + i
						+ " iconeMini iconeGuiaMovelMouseOver\";' class='" + i + " iconeMini iconeGuiaMovelMouseOut' src='" + imb
						+ "' style='cursor:pointer;text-align:left' ";
				};
			n = this.CONFIGICONES;
			for (i in n){
				c = n[i];
				if(c.status === true && c.tipo === "arvore"){
					ins +=
						"<img "
						+ estilo(c.classe)
						+ " onclick='i3GEO.util.animaClique(this);" 
						+ c.funcao 
						+ "' title='" 
						+ c.title 
						+ "' id='" 
						+ c.id 
						+ "'/>";
				}
			}
			return ins;
		},
		/**
		 * Function: ligaDesligaTemas
		 *
		 * Marca ou desmarca os checkbox da &aacute;rvore de uma lista de temas
		 *
		 * Parametros:
		 *
		 * {string} - lista, separada por v&iacute;rgulas, dos c&oacute;digos dos temas
		 *
		 * {boolean} - marca ou desmarca
		 */
		ligaDesligaTemas : function(lista, status) {
			var c, n, i, aplica = false;
			lista = lista.split(",");
			n = lista.length;
			for (i = 0; i < n; i += 1) {
				c = i3GEO.arvoreDeCamadas.capturaCheckBox(lista[i]);
				if (c) {
					if (c.checked !== status) {
						aplica = true;
					}
					c.checked = status;
					if (aplica === true) {
						c.onclick();
					}
				}
			}
		},
		/**
		 * Ativa a funcionalidade de arrastar um tema para mudar sua ordem de desenho ou excluir do mapa
		 */
		ativaDragDrop : function() {
			var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;
			YAHOO.example.DDList = "";
			YAHOO.example.DDApp = {
				init : function() {
					var i, ltema;
					if ($i("i3geo_lixeira") && i3GEO.arvoreDeCamadas.ARRASTARLIXEIRA === true) {
						new YAHOO.util.DDTarget("i3geo_lixeira");
					}
					i = i3GEO.arvoreDeCamadas.CAMADAS.length - 1;
					if (i3GEO.arvoreDeCamadas.CAMADAS.length - 1 >= 0) {
						do {
							ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];
							if ($i("arrastar_" + ltema.name)) {
								new YAHOO.example.DDList("arrastar_" + ltema.name);
							}
						} while (i--);
					}
				}
			};
			YAHOO.example.DDList = function(id, sGroup, config) {
				YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);
				this.logger = this.logger || YAHOO;
				YAHOO.util.Dom.setStyle(this.getDragEl(), "opacity", 0.67); // The
				// proxy
				// is
				// slightly
				// transparent
				this.goingUp = false;
				this.lastY = 0;
			};
			YAHOO.extend(YAHOO.example.DDList, YAHOO.util.DDProxy, {
				startDrag : function(x, y) {
					var dragEl, clickEl, Dom = YAHOO.util.Dom;
					//this.logger.log(this.id + " startDrag");
					// make the proxy look like the source element
					dragEl = this.getDragEl();
					clickEl = this.getEl();
					Dom.setStyle(clickEl, "visibility", "hidden");
					dragEl.innerHTML = clickEl.innerHTML;
					Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
					Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
					Dom.setStyle(dragEl, "border", "4px solid gray");
					Dom.setStyle(dragEl, "padding", "5px");
					Dom.setStyle(dragEl, "z-index", "5000");
				},
				endDrag : function(e) {
					var srcEl, proxy, a, thisid, proxyid;
					srcEl = this.getEl();
					proxy = this.getDragEl();
					// Show the proxy element and animate it to the
					// src element's location
					Dom.setStyle(proxy, "visibility", "");
					a = new YAHOO.util.Motion(proxy, {
						points : {
							to : Dom.getXY(srcEl)
						}
					}, 0.2, YAHOO.util.Easing.easeOut);
					proxyid = proxy.id;
					thisid = this.id;
					// Hide the proxy and show the source element
					// when finished with the animation
					a.onComplete.subscribe(function() {
						var Dom = YAHOO.util.Dom;
						Dom.setStyle(proxyid, "visibility", "hidden");
						Dom.setStyle(thisid, "visibility", "");
						$i(proxyid).innerHTML = "";
					});
					a.animate();
					YAHOO.util.Dom.setStyle('i3geo_lixeira', 'border', '0px solid blue');
				},
				onDragDrop : function(e, id) {
					var pt, region, tema, destEl, els, lista, temp, DDM = YAHOO.util.DragDropMgr, Dom = YAHOO.util.Dom;
					if (DDM.interactionInfo.drop.length === 1) {
						pt = DDM.interactionInfo.point;
						region = DDM.interactionInfo.sourceRegion;
						if (!region.intersect(pt)) {
							DDM.refreshCache();
							// exclui tema
							if (DDM.getDDById(id).id === "i3geo_lixeira") {
								if (i3GEO.arvoreDeCamadas.ARRASTARLIXEIRA === true) {
									(new YAHOO.util.Anim("i3geo_lixeira", {
										opacity : {
											from : 0,
											to : 1
										}
									}, 3, YAHOO.util.Easing.easeOutStrong)).animate();
									tema = (this.getEl()).id.split("arrastar_")[1];
									i3GEO.tema.exclui(tema);
								}
							}
							// muda ordem de desenho do tema
							else {
								if (i3GEO.arvoreDeCamadas.ARRASTARORDEM === true) {
									destEl = Dom.get(id);
									destEl.appendChild(this.getEl());
									els = i3GEO.arvoreDeCamadas.listaLigadosDesligados();
									lista = els[2].join(",");
									temp = function(retorno) {
										i3GEO.atualiza(retorno);
										if (i3GEO.Interface.ATUAL === "openlayers") {
											i3GEO.Interface.openlayers.ordenaLayers();
										}
										i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true);
									};
									i3GEO.php.reordenatemas(temp, lista);
								} else {
									i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS, true);
								}
							}
						}
					}
				},
				onDrag : function(e) {
					// Keep track of the direction of the drag for
					// use during onDragOver
					var y;
					y = Event.getPageY(e);
					if (y < this.lastY) {
						this.goingUp = true;
					} else if (y > this.lastY) {
						this.goingUp = false;
					}
					this.lastY = y;
					if (i3GEO.guias.TIPO === "movel") {
						YAHOO.util.Dom.setStyle("i3GEOguiaMovelMolde", "opacity", 0.9);
					}
				},
				onDragOver : function(e, id) {
					var destEl;
					destEl = YAHOO.util.Dom.get(id);
					var dragEl = this.getDragEl();
					Dom.setStyle(dragEl, "border", "4px solid red");
					// We are only concerned with list items, we
					// ignore the dragover
					// notifications for the list.
					if ($i("i3geo_lixeira") && id === "i3geo_lixeira") {
						$i("i3geo_lixeira").style.border = "2px solid red";
					} else {
						destEl.style.textDecoration = "underline";
					}
				},
				onDragOut : function(e, id) {
					$i(id).style.textDecoration = "none";
					var dragEl = this.getDragEl();
					Dom.setStyle(dragEl, "border", "4px solid gray");
				}
			});
			Event.onDOMReady(YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);
		},
		/**
		 * Depreciado na versao 6
		 */
		montaOpcoes : function(node) {

		},
		/**
		 * Monta os n&oacute;s filhos do n&oacute; "op&ccedil;&otilde;es"
		 *
		 * Depreciado na versao 6.0
		 */
		mostraOpcoes : function(node) {
		},
		/**
		 * Adiciona uma nova op&ccedil;&atilde;o no n&oacute; de op&ccedil;&otilde;es de um tema
		 *
		 * Parametros:
		 *
		 * {String} - dica que ser&aacute; mostrada na janela de mensagens do mapa quando o usu&aacute;rio sobrepoem o mouse
		 *
		 * {String} - t&iacute;tulo que ser&aacute; mostrado no n&oacute;
		 *
		 * {String} - string que define o evento onclick sobre o t&iacute;tulo da op&ccedil;&atilde;o
		 *
		 * {String} - objeto node da &aacute;rvore (YUI) que receber&aacute; o novo n&oacute;
		 */
		adicionaOpcaoTema : function(dica, titulo, onclick, node) {
			var tnome =
				"<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('" + dica + "','');\" onclick=" + onclick + ">" + titulo
					+ " </a>";
			new YAHOO.widget.HTMLNode({
				html : tnome,
				enableHighlight : false,
				isLeaf : true,
				expanded : false
			}, node);
		},
		/**
		 * Monta os n&oacute;s filhos do n&oacute; "legenda"
		 *
		 * Parametro:
		 *
		 * {YAHOO.widget.HTMLNode}
		 */
		mostraLegenda : function(node) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.mostraLegenda()");

			var retorna, idtema = node.data.id;
			retorna =
				function(retorno) {
					var original = {
						data : ""
					}, i, re, tabela, linhas, linha, colunas, incluir, elementos, nelementos, inputs, desativar, nindices;
					if (retorno.data.legenda) {
						original = retorno;
						retorno = retorno.data.legenda;
						if (retorno[0]) {
							if ((navn) && (!retorno[0].imagem)) {
								tabela = retorno;
							} else {
								i = retorno[0].imagem;
								re = new RegExp("tiff", "g");
								i = i.replace(re, 'png');
								tabela = "<img src='" + i + "' />";
							}
							retorno = "";
						} else {
							linhas = retorno.split("#");
							if (linhas.length > 1) {
								linhas = retorno.split("|");
								tabela = "<table>";
								linha = linhas.length - 1;
								if (linha >= 0) {
									do {
										colunas = linhas[linha].split("#");
										re = new RegExp("'", "g");
										tabela +=
											"<tr style='border-top:1px solid rgb(240,240,240);'><td><img src='" + colunas[4]
												+ "' </td><td style='text-align:left'>" + colunas[2] + "</td></tr>";
									} while (linha--);
								}
								tabela += "</table><br>";
							} else {
								tabela = retorno;
							}
						}
					} else {
						tabela = "<img src='" + retorno.data[0].imagem + "' />";
					} // o tema &eacute; um wms
					incluir = "<div style='text-align:left' id='" + idtema + "verdiv" + "'>" + tabela + "</div>";
					new YAHOO.widget.HTMLNode({
						html : incluir,
						enableHighlight : false,
						expanded : false
					}, node);
					node.loadComplete();
					//
					// desliga os checkbox que foram desativados
					// pega os objetos input
					//
					elementos = document.getElementById(idtema + "verdiv").getElementsByTagName("input");
					nelementos = elementos.length;
					inputs = [];
					i = 0;
					if (nelementos > 0) {
						do {
							if (elementos[i].type === "checkbox") {
								inputs.push(elementos[i]);
							}
							i++;
						} while (i < nelementos);
					}
					if (original.data.desativar[idtema]) {
						desativar = original.data.desativar[idtema];
						nindices = desativar.length;
						i = 0;
						if (nindices > 0) {
							do {
								inputs[desativar[i]].checked = false;
								i++;
							} while (i < nindices);
						}
					}
				};
			if (i3GEO.arvoreDeCamadas.TEMPLATELEGENDA !== "") {
				i3GEO.php.criaLegendaHTML(retorna, idtema, i3GEO.arvoreDeCamadas.TEMPLATELEGENDA);
			} else {
				i3GEO.php.criaLegendaHTML(retorna, idtema);
			}
		},
		/**
		 * Function: atualizaLegenda
		 *
		 * Atualiza a legenda de um tema.
		 *
		 * A legenda precisa ser atualizada em algumas circunst&acirc;ncias, como quando &eacute; feitoumzoom no mapa.
		 *
		 * Parametro:
		 *
		 * {String} - ID (name) do tema
		 */
		atualizaLegenda : function(idtema) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.atualizaLegenda()");

			var node;
			if (document.getElementById(idtema + "verdiv")) {
				node = i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("id", idtema);
				if (node) {
					i3GEO.arvoreDeCamadas.ARVORE.removeChildren(node);
					this.mostraLegenda(node);
					// atualiza as janelas individuais com as legendas de cada tema
					if ($i("janelaLegenda" + idtema + "_corpo")) {
						i3GEO.tema.mostralegendajanela(idtema, "", "abrejanela");
					}
				}
			}
		},
		/**
		 * Abre uma janela para escolher uma nova cor para o s&iacute;mbolo da classe.
		 *
		 * A chamada dessa fun&ccedil;&atilde;o &eacute; definida em aplicmap/legenda2.htm
		 *
		 * Parametro:
		 *
		 * {Object input} - objeto do tipo INPUT com o id da classe e o id do tema
		 */
		escolheCorClasse : function(leg) {
			// cria um elemento que receber&aacute; a escolha da cor e que
			// ir&aacute; disparar a fun&ccedil;&atilde;o de mudan&ccedil;a de cor
			// da classe
			var obj, novoel;
			leg = leg.parentNode.getElementsByTagName("input")[0];
			if (!$i("tempinputcorclasse")) {
				novoel = document.createElement("input");
				novoel.id = "tempinputcorclasse";
				novoel.style.display = "none";
				novoel.alt = "objeto criado para guardar dados da funcao escolohercorclasse";
				novoel.onchange = "";
				document.body.appendChild(novoel);
			}
			obj = $i("tempinputcorclasse");
			obj.value = "";
			obj.tema = leg.name;
			obj.idclasse = leg.value;
			obj.onchange = function() {
				var obj = $i("tempinputcorclasse");
				i3GEO.tema.alteracorclasse(obj.tema, obj.idclasse, obj.value);
			};
			i3GEO.util.abreCor("", "tempinputcorclasse");
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
				i3GEO.atualiza();
				i3GEO.Interface.atualizaTema(retorno, leg.name);
				// obtem o objeto checkbox
				var ck = "";
				// verifica se existe o checkbox da legenda mostrada em outra janela
				// legendack_ e incluido via template da legenda
				if (leg.id && leg.id === "legendack_" + leg.name + "_" + leg.value) {
					ck = $i("liblegendack_" + leg.name + "_" + leg.value);
				} else if (leg.id && leg.id === "liblegendack_" + leg.name + "_" + leg.value) {
					ck = $i("legendack_" + leg.name + "_" + leg.value);
				}
				if (ck && ck != "") {
					ck.checked = leg.checked;
				}
			};
			i3GEO.php.inverteStatusClasse(temp, leg.name, leg.value);
		},
		/**
		 * Monta o texto com o t&iacute;tulo do tema. Esse texto &eacute; o que ser&aacute; mostrado nos n&oacute;s principais da
		 * &aacute;rvore e cont&eacute;m o checkbox para ligar e desligar o tema.
		 *
		 * Parametro:
		 *
		 * {Object} - objeto JSON com as propriedades do tema
		 *
		 * Return:
		 *
		 * {string} - texto formatado
		 */
		montaTextoTema : function(tema) {
			var ck, html, estilo, f;
			if (tema.status * 1 === 2) {
				ck = ' CHECKED ';
			} else {
				ck = "";
			}
			//
			// verifica se o filtro de camadas esta ativo
			// se nao passar no filtro, retorna vazio
			//
			f = this.FILTRO;
			if (f !== "") {
				if (f === "desligados" && ck !== "") {
					return "";
				}
				if (f === "ligados" && ck === "") {
					return "";
				}
				if (f === "selecionados" && tema.sel.toLowerCase() !== "sim") {
					return "";
				}
				if (f === "download" && tema.download.toLowerCase() !== "sim") {
					return "";
				}
				if (f === "wms" && tema.connectiontype * 1 !== 7) {
					return "";
				}
				if (f === "raster" && tema.type * 1 !== 3) {
					return "";
				}
				if (f === "toponimia" && tema.type * 1 !== 4) {
					return "";
				}
			}
			estilo = "i3GEOarvCamTema";
			// verifica se a versao do IE e menor que 9
			if (navm && parseInt(YAHOO.env.ua.ie, 10) < 9) {
				estilo = "i3GEOarvCamTemaIE";
			}
			// inicia o div
			html = "<div onclick='i3GEO.mapa.ativaTema(\"" + tema.name + "\")' id='arrastar_" + tema.name + "' class='" + estilo + "' >";
			// estilo = navm ? "cursor:pointer;vertical-align:15%;" : "cursor:pointer;";
			html +=
				"<input type='checkbox' name=\"layer\" value='" + tema.name + "' " + "id='" + tema.name + "ckbox'" + ck + "onclick=\""
					+ i3GEO.arvoreDeCamadas.ATIVATEMA + "\"" + " /><label for='" + tema.name + "ckbox'  ";
			//
			// inclui icone do tema
			//
			if (tema.iconetema !== "" && i3GEO.arvoreDeCamadas.ICONETEMA === true) {
				html += "&nbsp;<img class='i3GEOiconeTema' src='" + tema.iconetema + "' />";
			}
			tema.AGUARDALEGENDA = i3GEO.arvoreDeCamadas.AGUARDALEGENDA;
			//
			// ajusta as propriedades conforme as caracteristicas de cada plugin
			// verifica se o tema e do tipo plugin antes
			// nao e necessario clonar
			//
			tema = i3GEO.pluginI3geo.aplicaPropriedades(tema);

			estilo = "";
			if (tema.AGUARDALEGENDA) {
				html +=
					" id='ArvoreTituloTema" + tema.name + "' style='position:relative;top:2px;'"
						+ " onclick=\"i3GEO.tema.mostralegendajanela('" + tema.name + "','" + tema.tema
						+ "','abrejanela');\" onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('" + $trad("t7a")
						+ "','');i3GEO.tema.mostralegendajanela('" + tema.name + "','" + tema.tema
						+ "','ativatimer');\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('');i3GEO.tema.mostralegendajanela('"
						+ tema.name + "','','desativatimer');\" >" + tema.tema;
			} else {
				html +=
					" id='ArvoreTituloTema" + tema.name + "' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"
						+ $trad("t7") + "','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" >" + tema.tema;
			}
			html += "</label></div>";
			// adiciona o temporizador
			// que redesenha o tema de tempos em tempos
			if (i3GEO.tema.TEMPORIZADORESID[tema.name] == undefined && tema.temporizador != "") {
				i3GEO.tema.temporizador(tema.name, tema.temporizador);
			}
			return (html);
		},
		montaIconesTema : function(tema) {
			var iconePlugin, n, i = null, c, html, estilo, farol, mfarol, imb = i3GEO.configura.locaplic + "/imagens/branco.gif";

			estilo = "i3GEOarvCamTemaIco";
			// verifica se a versao do IE e menor que 9
			if (navm && parseInt(YAHOO.env.ua.ie, 10) < 9) {
				estilo = "i3GEOarvCamTemaIcoIE";
			}
			// inicia o div
			html = "<div class='" + estilo + "' >";
			//
			// ajusta as propriedades conforme as caracteristicas de cada plugin
			// verifica se o tema e do tipo plugin antes
			// nao e necessario clonar
			//
			tema = i3GEO.pluginI3geo.aplicaPropriedades(tema);
			//
			// define o farol indicativo da compatibilidade de escala do mapa
			// com a fonte do layer
			//
			if (tema.escala != 0) {
				farol = "maisamarelo.png";
				mfarol = "";
				if (tema.escala * 1 < i3GEO.parametros.mapscale * 1) {
					farol = "maisverde.png";
					mfarol = $trad("t9");
				}
				if (tema.escala * 1 > i3GEO.parametros.mapscale * 1) {
					farol = "maisvermelho.png";
					mfarol = $trad("t10");
				}
				if (tema.escala === 0) {
					farol = "maisamarelo.png";
					mfarol = $trad("t11");
				}
				html +=
					"&nbsp;<img class='arvCamFarol' id='farol" + tema.name + "' src='" + i3GEO.configura.locaplic + "/imagens/" + farol
						+ "' title='" + mfarol + "' />";
			}
			//
			//modifica o flag dos icones conforme as caracteristicas do tema
			//
			this.CONFIGICONES.zoomtema.flag = false;
			if (tema.zoomtema.toLowerCase() === "sim"){
				this.CONFIGICONES.zoomtema.flag = true;
			}
			this.CONFIGICONES.contextoescala.flag = false;
			if (tema.contextoescala.toLowerCase() === "sim") {
				this.CONFIGICONES.contextoescala.flag = true;
			}
			this.CONFIGICONES.selecionado.flag = false;
			this.CONFIGICONES.zoomsel.flag = false;
			if (tema.sel.toLowerCase() === "sim") {
				this.CONFIGICONES.selecionado.flag = true;
				this.CONFIGICONES.zoomsel.flag = true;
			}
			this.CONFIGICONES.link.flag = false;
			if (tema.link_tema != "" && tema.features.toLowerCase() !== "sim" && tema.name != "mundo") {
				this.CONFIGICONES.link.flag = true;
			}
			this.CONFIGICONES.download.flag = false;
			if (tema.download.toLowerCase() === "sim" || tema.download === "" && tema.features.toLowerCase() !== "sim") {
				this.CONFIGICONES.download.flag = true;
			}
			//
			//monta os icones
			//
			n = this.CONFIGICONES;
			for (i in n){
				c = n[i];
				if(c.status === true && c.tipo === "tema" && c.flag === true){
					html +=
						"<img "
						+ "class='" 
						+ c.classe
						+ "' onclick='i3GEO.util.animaClique(this);" 
						+ c.funcao 
						+ "(\"" + tema.name + "\",true,\"" + tema.link_tema + "\")"
						+ "' title='" 
						+ c.title 
						+ "' id='" 
						+ c.id
						+ "' src='"
						+ imb
						+ "'/>";
				}
			}
			//inclui o icone especifico quando o tema e baseado em algum plugin
			iconePlugin = i3GEO.pluginI3geo.iconeArvoreDeCamadas(tema);
			if(iconePlugin){
				html += iconePlugin;
			}
			html += "</div>";
			return (html);
		},
		/**
		 * Atualiza o farol de cada tema.
		 *
		 * O farol identifica a compatibilidade da escala do mapa com a escala de cada tema
		 *
		 * Parametro:
		 *
		 * {Numeric} - escala de compara&ccedil;&atilde;o com a escala de cada tema
		 */
		atualizaFarol : function(mapscale) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.atualizaFarol()");

			// YAHOO.log("Atualizando o farol da &aacute;rvore de camadas",
			// "i3geo");
			var farol, l, ltema, escala, iu = i3GEO.util, im = i3GEO.configura.locaplic + "/imagens/", camadas =
				i3GEO.arvoreDeCamadas.CAMADAS;
			farol = "maisamarelo.png";
			l = camadas.length - 1;
			if (l >= 0) {
				do {
					ltema = camadas[l];
					escala = ltema.escala;
					if (escala * 1 < mapscale * 1) {
						farol = "maisverde.png";
					}
					if (escala * 1 > mapscale * 1) {
						farol = "maisvermelho.png";
					}
					if (escala * 1 === 0) {
						farol = "maisamarelo.png";
					}
					iu.defineValor("farol" + ltema.name, "src", im + farol);
				} while (l--);
			}
		},
		/**
		 * Function: aplicaTemas
		 *
		 * Refaz o mapa ligando e desligando os temas conforme consta na &aacute;rvore de camadas ou ligando/desligando todos
		 *
		 * Parametro:
		 *
		 * {normal|ligartodos|desligartodos} - tipo de opera&ccedil;&atilde;o A op&ccedil;&atilde;o 'normal' ir&aacute; desligar/ligar o que
		 * estiver marcado
		 */
		aplicaTemas : function(tipo) {
			if (arguments.length === 0) {
				tipo = "normal";
			}
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.aplicaTemas()");

			var t = "", temp;
			if (tipo === "normal") {
				t = i3GEO.arvoreDeCamadas.listaLigadosDesligados("mantem");
			}
			if (tipo === "ligartodos") {
				t = i3GEO.arvoreDeCamadas.listaLigadosDesligados("marca");
				if (i3GEO.util.in_array(i3GEO.Interface.ATUAL, [
					"googleearth",
					"openlayers",
					"googlemaps"
				])) {
					return;
				}
			}
			if (tipo === "desligartodos") {
				t = i3GEO.arvoreDeCamadas.listaLigadosDesligados("desmarca");
				if (i3GEO.util.in_array(i3GEO.Interface.ATUAL, [
					"googleearth",
					"openlayers",
					"googlemaps"
				])) {
					return;
				}
			}
			//
			// zera o contador de tempo
			//
			temp = function() {
				i3GEO.atualiza();
				i3GEO.janela.fechaAguarde("redesenha");
			};
			if (tipo === "normal") {
				i3GEO.php.ligatemas(temp, t[1].toString(), t[0].toString());
				return;
			}
			if (tipo === "ligartodos") {
				i3GEO.php.ligatemas(temp, "", t[2].toString());
				return;
			}
			if (tipo === "desligartodos") {
				i3GEO.php.ligatemas(temp, t[2].toString(), "");
			}
		},
		/**
		 * Function: listaLigadosDesligados
		 *
		 * Lista os temas que est&atilde;o ligados e os que est&atilde;o desligados tendo como fonte de busca os checkbox existentes na
		 * &aacute;rvore.
		 *
		 * Esse m&eacute;todo &eacute; mais demorado pois varre a &aacute;rvore toda. Por&eacute;m, obt&eacute;m o status verdadeiro do
		 * tema.
		 *
		 * Parametro:
		 *
		 * {String} - mantem|marca|desmarca marca, desmarca ou mant&eacute;m o checkbox ap&oacute;s identificar seu status atual
		 *
		 * Return:
		 *
		 * {Array} - array de arrays com os c&oacute;digos dos temas [0]=ligados [1]=desligados [2]=todos na ordem encontrada
		 */
		listaLigadosDesligados : function(tipo) {
			if (!$i(i3GEO.arvoreDeCamadas.IDHTML)) {
				return [
					[],
					[],
					[]
				];
			}
			if (arguments.length === 0) {
				tipo = "manter";
			}
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.listaLigadosDesligados()");

			var no, cs, csn, j, c, nos = i3GEO.arvoreDeCamadas.ARVORE.getNodesByProperty("tipo", "tema"), ligados = [], desligados = [], todos =
				[], n = nos.length, i = 0, ATUAL = i3GEO.Interface.ATUAL;
			do {
				try {
					no = nos[i].getEl();
					cs = no.getElementsByTagName("input");
					csn = cs.length;
					for (j = 0; j < csn; j += 1) {
						c = cs[j];
						if (c.name === "layer") {
							c.checked === true ? ligados.push(c.value) : desligados.push(c.value);
							todos.push(c.value);
							if (tipo === "marca") {
								c.checked = true;
								if (i3GEO.util.in_array(ATUAL, [
									"googleearth",
									"openlayers",
									"googlemaps"
								])) {
									i3GEO.Interface[ATUAL].ligaDesliga(c);
								}
							}
							if (tipo === "desmarca") {
								c.checked = false;
								if (i3GEO.util.in_array(ATUAL, [
									"googleearth",
									"openlayers",
									"googlemaps"
								])) {
									i3GEO.Interface[ATUAL].ligaDesliga(c);
								}
							}
						}
					}
					i++;
				} catch (e) {
					i += 1;
				}
			} while (i < n);
			return ([
				ligados,
				desligados,
				todos
			]);
		},
		/**
		 * Function: capturaCheckBox
		 *
		 * Retorna o objeto input (check box) que corresponde a uma determinada camada na &aacute;rvore.
		 *
		 * Parametro:
		 *
		 * {String} - c&oacute;digo do tema ao qual o elemento se refere
		 *
		 * Return:
		 *
		 * {Objeto DOM} - objeto do tipo checkbox
		 */
		capturaCheckBox : function(tema) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.capturaCheckBox()");

			if (!$i(i3GEO.arvoreDeCamadas.IDHTML)) {
				return;
			}
			var nos, n, i, no, cs, csn, j, c;
			nos = i3GEO.arvoreDeCamadas.ARVORE.getNodesByProperty("tipo", "tema");
			n = nos.length;
			i = 0;
			do {
				try {
					no = nos[i].getEl();
					cs = no.getElementsByTagName("input");
					csn = cs.length;
					for (j = 0; j < csn; j += 1) {
						c = cs[j];
						if (c.name === "layer" && c.value === tema) {
							return c;
						}
					}
					i += 1;
				} catch (e) {
					i += 1;
				}
			} while (i < n);
			return (null);
		},
		/**
		 * Compara se dois objetos com as camadas s&atilde;o iguais
		 *
		 * Parametros:
		 *
		 * {objeto} - objeto novo
		 *
		 * {objeto} - objeto atual
		 *
		 * Return:
		 *
		 * {boolean}
		 */
		comparaTemas : function(novo, atual) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.comparaTemas()");

			try {
				var novon = novo.length, i;
				if (novon !== atual.length) {
					return (false);
				}

				for (i = 0; i < novon; i += 1) {
					if (novo[i].name !== atual[i].name) {
						return (false);
					}
					if (novo[i].tema !== atual[i].tema) {
						return (false);
					}
					if (novo[i].sel !== atual[i].sel) {
						return (false);
					}
					if (novo[i].status !== atual[i].status) {
						return (false);
					}
				}
				return (true);
			} catch (e) {
				return true;
			}
		},
		/**
		 * Function: pegaTema
		 *
		 * Procura um tema no objeto CAMADAS.
		 *
		 * Parametro:
		 *
		 * {String} valor do parametro
		 *
		 * {Objeto} - objeto com a lista de temas (escape com "" para usar o default)
		 *
		 * {string} - parametro que sera procurado
		 *
		 * Return:
		 *
		 * {objeto}
		 */
		pegaTema : function(valor, camadas, parametro) {
			var i;
			if (!camadas || camadas == "") {
				camadas = i3GEO.arvoreDeCamadas.CAMADAS;
			} else {
				// converte o objeto camadas para a forma valida caso contenha a
				// forma chave/valor, implementada na versao 6.0 do i3Geo
				camadas = i3GEO.arvoreDeCamadas.converteChaveValor2normal(camadas);
			}
			if (!parametro) {
				parametro = "name";
			}
			i = camadas.length;
			while (i > 0) {
				i -= 1;
				if (camadas[i][parametro] === valor) {
					return camadas[i];
				}
			}
			return "";
		},
		/**
		 * Busca temas na vari&aacute;vel i3GEO.arvoreDeCamadas.CAMADAS aplicando um filtro
		 *
		 * Parameters:
		 *
		 * {string} - propriedade de CAMADAS que ser&aacute; filtrado
		 *
		 * {string} - valor do filtro
		 *
		 * {string} - operador entre propriedade e valor igual|diferente|menor
		 *
		 * {objeto} - array do tipo i3GEO.arvoreDeCamadas.CAMADAS
		 *
		 * Return: {Array} - lista de camadas
		 */
		filtraCamadas : function(propriedade, valor, operador, camadas) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.filtraCamadas()");

			if(!camadas){
				camadas = i3GEO.arvoreDeCamadas.CAMADAS;
			}
			var resultado = [], i = 0, temp, nelementos = camadas.length, ltema;
			if (nelementos > 0) {
				do {
					ltema = camadas[i];
					if (ltema.escondido.toLowerCase() !== "sim") {
						temp = ltema[propriedade];
						if (operador === "igual") {
							if (temp+"".toLowerCase() == valor+"".toLowerCase()) // n&atilde;o usar === aqui
							{
								resultado.push(ltema);
							}
						}
						if (operador === "diferente") {
							if (temp+"".toLowerCase() !== valor+"".toLowerCase()) {
								resultado.push(ltema);
							}
						}
						if (operador === "menor") {
							if (temp+"".toLowerCase() < valor+"".toLowerCase()) {
								resultado.push(ltema);
							}
						}
					}
					i += 1;
				} while (i < nelementos);
			}
			return resultado;
		},
		/**
		 * Function: alteraPropCamadas
		 *
		 * Altera o valor de uma propriedade de um tema do objeto i3GEO.arvoreDeCamadas.CAMADAS
		 *
		 * Parameters:
		 *
		 * {string} - propriedade que ser&aacute; modificada
		 *
		 * {string} - novo valor
		 *
		 * {string} - c&oacute;digo da camada
		 */
		alteraPropCamadas : function(propriedade, valor, camada) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.alteraPropCamadas()");

			var i = 0, nelementos = i3GEO.arvoreDeCamadas.CAMADAS.length, ltema;
			if (nelementos > 0) {
				do {
					ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];
					if (ltema.name === camada) {
						ltema[propriedade] = valor;
					}
					i += 1;
				} while (i < nelementos);
			}
		},
		/**
		 * Verifica se um tema est&aacute; ou n&atilde;o na abrang&ecirc;ncia espacial do mapa atual modificando a cor com que o nome
		 * &eacute; mostrado na &aacute;rvore
		 */
		verificaAbrangenciaTemas : function() {
			if (i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS === false) {
				return;
			}
			try {
				var i = 0, temp, nelementos = i3GEO.arvoreDeCamadas.CAMADAS.length, ltema;
				if (nelementos > 0) {
					do {
						ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];
						temp = ltema.exttema;

						if (temp !== "") {
							if (i3GEO.util.intersectaBox(temp, i3GEO.parametros.mapexten) === false) {
								$i("ArvoreTituloTema" + ltema.name).style.color = "gray";
							} else {
								$i("ArvoreTituloTema" + ltema.name).style.color = "black";
							}
						}
						i += 1;
					} while (i < nelementos);
				}
			} catch (e) {
			}
		},
		/**
		 * Verifica se algum tema est&aacute; marcado com o metadado Aplicaextensao. Retorna a primeira ocorr&ecirc;ncia se houver
		 *
		 * Return:
		 *
		 * {string} - c&oacute;digo do tema ou ""
		 */
		verificaAplicaExtensao : function() {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.arvoreDeCamadas.verificaAplicaExtensao()");

			var i = 0, temp = "", nelementos = i3GEO.arvoreDeCamadas.CAMADAS.length, ltema;
			try {
				if (nelementos > 0) {
					do {
						ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];
						if (ltema.aplicaextensao.toLowerCase() === "sim") {
							temp = ltema.name;
						}
						i += 1;
					} while (i < nelementos);
				}
			} catch (e) {
				return "";
			}
			return temp;
		},
		/**
		 * Converte um objeto com a lsita de camadas do formato chave/valor para o formato normal O formato chave/valor foi introduzido na
		 * versao 6.0 do i3Geo e e fornecido como padrao pelo servidor O objeto i3GEO.arvoreDeCamadas.CAMADAS utiliza o formato normal do
		 * tipo {chave: valor},{chave: valor} Ja o objeto fornecido pelo servidor evita redundancias utilizando o formato
		 * {chaves:{},valores:{}}
		 */
		converteChaveValor2normal : function(obj) {
			if (obj.chaves) {
				var i, tema, j, t, chaves = obj.chaves, temas = obj.valores, ntemas = temas.length, nchaves = chaves.length, novo = [];
				for (i = 0; i < ntemas; i++) {
					tema = temas[i];
					t = {};
					for (j = 0; j < nchaves; j++) {
						t[chaves[j]] = tema[j];
					}
					novo.push(t);
				}
				return novo;
			} else {
				return obj;
			}
		},
		/**
		 * Guarda um objeto contendo as definicoes das camadas conforme o padrao utilizado pela arvore de camadas
		 */
		registaCamadas : function(obj) {
			obj = i3GEO.arvoreDeCamadas.converteChaveValor2normal(obj);
			i3GEO.arvoreDeCamadas.CAMADAS = obj;
		},
		/**
		 * Abre uma janela com a descricao de cada botao
		 */
		ajudaEmLista : function(){
			var n,i = null, ins = "",b, imb = i3GEO.configura.locaplic + "/imagens/branco.gif", g;
			n = i3GEO.arvoreDeCamadas.CONFIGICONES;
			ins += "<table class=lista8 >";
			for(i in n){
				b = n[i];
				if(b.dica != ""){
					if(b.icone != ""){
						g = "<img src='" + i3GEO.configura.locaplic + "/" + b.icone + "' />";
					}
					else{
						g = "<img src='" + imb + "' class='" + b.classe + "'/>";
					}
					ins += "<tr><td>" + g + "</td><td>" + b.dica + "</td></tr>";
				}
			}
			ins += "</table>";
			i3GEO.janela.mensagemSimples("<div style='overflow:auto;height:100%'>"+ins+"</div>","");
		},
		/**
		 * Section: i3GEO.arvoreDeCamadas.dialogo
		 *
		 * Abre as telas de di&aacute;logo das op&ccedil;&otilde;es de manipula&ccedil;&atilde;o da &aacute;rvore
		 */
		dialogo : {
			/**
			 * Function: filtro
			 *
			 * Abre a janela de di&aacute;logo para o usu&aacute;rio escolher ou alterar o filtro aplicado a &aacute;rvore
			 */
			filtro : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.arvoreDeCamadas.dialogo.filtro()",
					"filtroarvore",
					"filtroarvore",
					"dependencias.php",
					"i3GEOF.filtroarvore.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: excluir
			 *
			 * Abre a janela de di&aacute;logo para o usu&aacute;rio escolher os temas que ser&atilde;o exclu&iacute;dos da &aacute;rvore
			 */
			excluir : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.arvoreDeCamadas.dialogo.excluir()", "excluirarvore", "excluirarvore");
			}
		}
	};
