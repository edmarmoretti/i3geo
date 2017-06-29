/**
 * Title: Configura&ccedil;&otilde;es gerais
 *
 * Configura&ccedil;&atilde;o do i3geo
 *
 * Vc pode alterar com esta classe a maioria dos par&acirc;metros que controlam o funcionamento do i3geo.
 *
 * Namespace:
 *
 * i3GEO.configura
 *
 * Exemplo:
 *
 * i3GEO.configura.embedLegenda = "nao"
 *
 * i3GEO.configura.cursores.ff = "/imagens/cursores/identifica2.png"
 *
 * i3GEO.configura.cursores.ie = "/imagens/cursores/identifica2.cur"
 *
 * alert(i3GEO.configura.locaplic)
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_configura.js>
 *
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.configura =
	{
		/**
		 * Propriedade: tipoimagem
		 *
		 * Indica o tipo de filtro de imagem que est&aacute; ativo. O filtro ativo &eacute; aplicado sobre a imagem toda a vez que o mapa
		 * &eacute; refeito.
		 *
		 * Veja <classe_imagem.php> para obter os tipos poss&iacute;veis
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * "nenhum"
		 */
		tipoimagem : "nenhum",
		/**
		 * Propriedade: tipotip
		 *
		 * Tipo de tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio estaciona o
		 * mouse sobre o mapa
		 *
		 * Pode ser um id de um elemento existente no HTML
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * completo|simples|balao|id
		 *
		 * Default:
		 *
		 * "balao"
		 */
		tipotip : "balao",
		/**
		 * Propriedade: alturatip
		 *
		 * Altura em pixel do tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
		 * estaciona o mouse sobre o mapa
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * 200px
		 */
		alturatip : "100px",
		/**
		 * Propriedade: larguratip
		 *
		 * Largura em pixel do tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
		 * estaciona o mouse sobre o mapa
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * 200px
		 */
		larguratip : "200px",
		/**
		 * Propriedade: diminuixM
		 *
		 * Diminui a largura do mapa em pixels no caso do navegador ser o IE. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 13
		 */
		diminuixM : 0,
		/**
		 * Propriedade: diminuixN
		 *
		 * Diminui a largura do mapa em pixels no caso do navegador ser o FF. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 11
		 */
		diminuixN : 0,
		/**
		 * Propriedade: diminuiyM
		 *
		 * Diminui a altura do mapa em pixels no caso do navegador ser o IE. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 106
		 */
		diminuiyM : 0,
		/**
		 * Propriedade: diminuiyN
		 *
		 * Diminui a altura do mapa em pixels no caso do navegador ser o FF. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 103
		 */
		diminuiyN : 0,
		/**
		 * Propriedade: autotamanho
		 *
		 * Calcula o tamanho do mapa conforme o tamanho da janela do navegador (false) ou calcula o tamanho do mapa conforme o tamanho da
		 * tela do monitor (true)
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		autotamanho : false,
		/**
		 * Vari&aacute;vel que define o nome do map_file que possu&iacute; o layer para uso na fun&ccedil;&atilde;o 3d. Pode ser utilizado o
		 * caminho completo, se n&atilde;o, busca no diret&oacute;rio aplicmap.
		 *
		 * O mapfile deve conter um layer para c&aacute;lculo dos valores de Z para compor o modelo do relevo sobre o qual o mapa
		 * ser&aacute; desenhado.
		 *
		 * Por padr&atilde;o, o i3geo utiliza o mapfile aplicmpa/3dmap.map
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * ""
		 */
		//TODO verificar se pode ser removida na versao 7
		map3d : "",
		/**
		 * Propriedade: embedLegenda
		 *
		 * Indica se a legenda deve ser incluida no corpo do mapa.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * sim|nao
		 *
		 * Default:
		 *
		 * nao
		 */
		//TODO verificar se pode ser removida na versao 7
		embedLegenda : "nao",
		/**
		 * Propriedade: templateLegenda
		 *
		 * Template HTML que ser&aacute; utilizado na gera&ccedil;&atilde;o da legenda HTML.
		 *
		 * A sintaxe utilizada na montagem do template &eacute; baseado na sintaxe do pr&oacute;prio Mapserver. O HTML pode ser armazenado
		 * em i3geo/aplicmap ou em um outro endere&ccedil;o no servidor. O template serve para definir o layout da legenda que &eacute;
		 * mostrada quando a guia legenda &eacute; ativada. Se for definido como "", &eacute; utilizado o template
		 * i3geo/aplicmap/legenda.htm.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * ""
		 */
		templateLegenda : "legenda11.htm",
		/**
		 * Propriedade: mashuppar
		 *
		 * Define os par&acirc;metros que devem ser aplicados no modo mashup
		 *
		 * O modo mashup possibilita que o i3Geo seja embutido dentro de uma p&aacute;gina HTML. Nesse caso, o mapa n&atilde;o &eacute;
		 * criado no modo convencional, que utiliza o programa i3geo/ms_criamapa.php A variavel mashuppar deve conter os par&acirc;metros
		 * que s&atilde;o utilizados pelo programa ms_criamapa
		 *
		 * Exemplo:
		 *
		 * i3GEO.configura.mashuppar = "&pontos=-54 -12&temasa=biomas&layers=biomas"
		 *
		 * Tipo:
		 *
		 * string
		 *
		 * Default:
		 *
		 * ""
		 */
		mashuppar : "",
		/**
		 * C&oacute;digo da se&ccedil;&atilde;o aberta pelo i3Geo no servidor.
		 *
		 * O c&oacute;digo &eacute; gerado na inicializa&ccedil;&atilde;o do i3Geo pelo programa ms_criamapa.php
		 *
		 * Tipo:
		 *
		 * {String}
		 */
		sid : "",
		/**
		 * Localiza&ccedil;&atilde;o da instala&ccedil;&atilde;o do i3geo (URI)
		 *
		 * Por default, &eacute; definida na inicializa&ccedil;&atilde;o do i3Geo
		 *
		 * Tipo:
		 *
		 * {string}
		 */
		locaplic : "",
		/**
		 * Propriedade: mapaRefDisplay
		 *
		 * Indica se o mapa de refer&ecirc;ncia dever&aacute; ser aberto quando o i3Geo for inicializado.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * "block"
		 *
		 * Valores:
		 *
		 * block|none
		 */
		mapaRefDisplay : "block",
		/**
		 * Tipo de visual que ser&aacute; utilizado no mapa.
		 *
		 * A lista de visuais existentes &eacute; obtida na inicializa&ccedil;&atilde;o do i3geo.
		 *
		 * Veja o diret&oacute;rio i3geo/imagens/visual
		 *
		 * Tipo:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * default
		 */
		//TODO verificar se pode ser removida na versao 7
		visual : "default",
		/**
		 * Propriedade: cursores
		 *
		 * Imagens utilizadas para os cursores do mouse mostrados no mapa
		 *
		 * A manipula&ccedil;&atilde;o dos cursores &eacute; feita com i3GEO.util.mudaCursor
		 *
		 * &Eacute; poss&iacute;vel utilizar tamb&eacute;m um dos tipos default, pointer, crosshair, help, move, text
		 *
		 * Tipo:
		 *
		 * {Objeto}
		 */
		//TODO verificar se pode ser removida na versao 7
		cursores : {
			"identifica" : {
				ff : "pointer",
				ie : "pointer"
			},
			"pan" : {
				ff : "/imagens/cursores/pan.png",
				ie : "/imagens/cursores/pan.cur"
			},
			"area" : {
				ff : "crosshair",
				ie : "crosshair"
			},
			"distancia" : {
				ff : "crosshair",
				ie : "crosshair"
			},
			"zoom" : {
				ff : "/imagens/cursores/zoom.png",
				ie : "/imagens/cursores/zoom.cur"
			},
			"contexto" : {
				ff : "/imagens/cursores/contexto.png",
				ie : "/imagens/cursores/contexto.cur"
			},
			"identifica_contexto" : {
				ff : "pointer",
				ie : "pointer"
			},
			"pan_contexto" : {
				ff : "/imagens/cursores/pan_contexto.png",
				ie : "/imagens/cursores/pan_contexto.cur"
			},
			"zoom_contexto" : {
				ff : "/imagens/cursores/zoom_contexto.png",
				ie : "/imagens/cursores/zoom_contexto.cur"
			}
		},
		/**
		 * Propriedade: listaDePropriedadesDoMapa
		 *
		 * Lista com as fun&ccedil;&otilde;es que s&atilde;o inclu&iacute;das no item "Propriedades do mapa"
		 *
		 * Tipo:
		 *
		 * {Objeto}
		 */
		//TODO verificar se pode ser removida na versao 7
		listaDePropriedadesDoMapa : {
			"propriedades" : [
				//
				{
					text : "p2",
					url : "javascript:i3GEO.mapa.dialogo.tipoimagem()"
				},
				//
				{
					text : "p3",
					url : "javascript:i3GEO.mapa.dialogo.opcoesLegenda()"
				},
				//
				{
					text : "p4",
					url : "javascript:i3GEO.mapa.dialogo.opcoesEscala()"
				},
				//
				{
					text : "p5",
					url : "javascript:i3GEO.mapa.dialogo.tamanho()"
				},
				//
				{
					text : "p7",
					url : "javascript:i3GEO.mapa.ativaLogo()"
				},
				//
				{
					text : "p8",
					url : "javascript:i3GEO.mapa.dialogo.queryMap()"
				},
				//
				{
					text : "p9",
					url : "javascript:i3GEO.mapa.dialogo.corFundo()"
				},
				{
					text : "p10",
					url : "javascript:i3GEO.mapa.dialogo.gradeCoord()"
				},
				{
					text : "p12",
					url : "javascript:i3GEO.mapa.dialogo.autoredesenha()"
				}
			]
		},
		/**
		 * Propriedade: tempoAplicar
		 *
		 * Tempo em milisegundos que ser&aacute; esperado at&eacute; que o mapa seja desenhado automaticamente.
		 *
		 * Utilizado no bot&atilde;o Aplicar, quando o usu&aacute;rio liga/desliga ou adiciona umtema
		 *
		 * Tipo:
		 *
		 * {Numeric}
		 *
		 * Default:
		 *
		 * 4000
		 */
		//TODO verificar se pode ser removida na versao 7
		tempoAplicar : 4000,
		/**
		 * Propriedade: tempoMouseParado
		 *
		 * Tempo em milisegundos que ser&aacute; esperado para detectar que o mouse est&aacute; parado.
		 *
		 * Controla o lapso de tempo utilizado para disparar as fun&ccedil;&otilde;es que ocorrem quando o mouse est&aacute; parado sobre o
		 * mapa
		 *
		 * Tipo:
		 *
		 * {Numeric}
		 *
		 * Default:
		 *
		 * 3500
		 */
		//TODO verificar se pode ser removida na versao 7
		tempoMouseParado : 1800,
		/**
		 * Propriedade: iniciaJanelaMensagens
		 *
		 * Inicia o i3geo com a janela de mensagens aberta ou fechada.
		 *
		 * Se o cookie g_janelaMen estiver definido, essa vari&aacute;vel n&atilde;o ter&aacute; efeito
		 *
		 * Tipo:
		 *
		 * {Boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		//TODO verificar se pode ser removida na versao 7
		iniciaJanelaMensagens : false,
		//TODO separar em um novo arquivo js
		/**
		 * Propriedade: iniciaFerramentas
		 *
		 * Ferramentas que ser&atilde;o inicializadas com o mapa
		 * Esse objeto cont&eacute;m a fun&ccedil;&atilde;o de inicializa&ccedil;&atilde;o e a lista de ferramentas e seus par&acirc;metros internos
		 *
		 * Cada ferramenta cont&eacute;m uma propriedade chamada &quot;ativa&quot; que indica se ser&aacute; inicializada ou n&atilde;o com o mapa
		 *
		 * A defini&ccedil;&atilde;o de ativa ou n&atilde;o pode ser feita com uso do menu de prefer&ecirc;ncias do i3Geo
		 *
		 * Ao modificar os par&acirc;metros, atualize a ferramenta i3geo/ferramentas/preferencias
		 *
		 * Ferramentas dispon&iacute;veis:
		 *
		 * legenda|locregiao|metaestat
		 *
		 * Exemplo:
		 *
		 * i3GEO.configura.iniciaFerramentas.quais.legenda.ativa = true;
		 *
		 * Tipo:
		 *
		 * {Objeto}
		*/
		//TODO incluir a ferramenta visualizador da INDE
		iniciaFerramentas : {
			executa : function() {
				var q = i3GEO.configura.iniciaFerramentas.quais, i = 0;
				for (i in q) {
					if (q[i].ativa === true) {
						q[i].funcao.call();
					}
				}
			},
			"quais" : {
				legenda : {
					ativa : false,
					largura : 302,
					altura : 300,
					topo : 50,
					esquerda : 100,
					funcao : function() {
						var q = i3GEO.configura.iniciaFerramentas.quais.legenda;
						i3GEO.mapa.legendaHTML.libera("sim", q.largura, q.altura, q.topo, q.esquerda);
					}
				},
				locregiao : {
					ativa : false,
					largura : 215,
					altura : "",
					topo : 150,
					esquerda : 150,
					funcao : function() {
						var q = i3GEO.configura.iniciaFerramentas.quais.locregiao;
						i3GEO.mapa.dialogo.locregiao(q.largura, q.altura, q.topo, q.esquerda);
					}
				},
				metaestat : {
					ativa : false,
					largura : 215,
					altura : "",
					topo : 150,
					esquerda : 150,
					funcao : function() {
						var q = i3GEO.configura.iniciaFerramentas.quais.metaestat;
						i3GEO.mapa.dialogo.metaestat(q.largura, q.altura, q.topo, q.esquerda);
					}
				}
			}
		},
		/**
		 * Propriedade: ferramentasLayers
		 *
		 * Armazena fun&ccedil;&otilde;es e objetos que s&atilde;o utilizados para configurar ferramentas
		 *
		 * que possuem par&acirc;metros definidos em cada mapfile. Normalmente, os par&acirc;metros
		 *
		 * s&atilde;o utilizados no mashup para criar &iacute;cones que executam opera&ccedil;&otilde;es especiais
		 *
		 * Veja também mashups/openlayers.php variavel $listaFerramentas
		 */
		ferramentasLayers : {
			//lista de ferramentas que aceitam parametros embutidos em mapfiles
			param : ["tme","storymap","animagif"],
			"tme" : {
				"arvoreDeCamadas" : true,
				"metadata" : "tme",
				"classe" : "i3GEOiconeTme",
				init : function (codigo){
					window.open(i3GEO.configura.locaplic+"/ferramentas/tme/cesium.php?&tema="+codigo);
				},
				icone : function(layer) {
					var l, icone;
					if(typeof layer != "string"){
						if(layer.params.LAYERS){
							l = layer.params.LAYERS;
						} else{
							l = layer.layername;
						}
					}
					else{
						l = layer;
					}
					icone =
						"<img class='i3GEOiconeTme' onclick='i3GEO.util.animaClique(this);"
							+ "i3GEO.configura.ferramentasLayers.tme.init(\""
							+ l
							+ "\");return false;'"
							+ "title='3d' "
							+ "src='"
							+ i3GEO.configura.locaplic
							+ "/imagens/branco.gif' />";
					return icone;
				}
			},
			"storymap" : {
				"arvoreDeCamadas" : true,
				"metadata" : "storymap",
				"classe" : "i3GEOiconeStorymap",
				init : function (codigo){
					window.open(i3GEO.configura.locaplic+"/ferramentas/storymap/default.php?&tema="+codigo);
				},
				icone : function(layer) {
					var l, icone;
					if(typeof layer != "string"){
						if(layer.params.LAYERS){
							l = layer.params.LAYERS;
						} else{
							l = layer.layername;
						}
					}
					else{
						l = layer;
					}
					icone =
						"<img class='i3GEOiconeStorymap' onclick='i3GEO.util.animaClique(this);"
							+ "i3GEO.configura.ferramentasLayers.storymap.init(\""
							+ l
							+ "\");return false;'"
							+ "title='StoryMap' "
							+ "src='"
							+ i3GEO.configura.locaplic
							+ "/imagens/branco.gif' />";
					return icone;
				}
			},
			"animagif" : {
				"arvoreDeCamadas" : true,
				"metadata" : "animagif",
				"classe" : "i3GEOiconeAnimagif",
				init : function (codigo){
					window.open(i3GEO.configura.locaplic+"/ferramentas/animagif/index.php?&tema="+codigo);
				},
				icone : function(layer) {
					var l, icone;
					if(typeof layer != "string"){
						if(layer.params.LAYERS){
							l = layer.params.LAYERS;
						} else{
							l = layer.layername;
						}
					}
					else{
						l = layer;
					}
					icone =
						"<img class='i3GEOiconeAnimagif' onclick='i3GEO.util.animaClique(this);"
							+ "i3GEO.configura.ferramentasLayers.animagif.init(\""
							+ l
							+ "\");return false;'"
							+ "title='Animagif' "
							+ "src='"
							+ i3GEO.configura.locaplic
							+ "/imagens/branco.gif' />";
					return icone;
				}
			}
		},
		/**
		 * Propriedade: ferramentas
		 *
		 * Parametros que sao utilizados para configurar ferramentas especificas
		 *
		 * i3GEO.ferramentas.buscainde.csw - endereco do servico csw utilizado na ferramenta de busca de metadados em IDE
		 */
		ferramentas: {
			"buscainde" : {
				"csw" : "http://www.metadados.inde.gov.br/geonetwork/srv/br"
			}
		},
		/**
		 * Propriedade: grupoLayers
		 *
		 * Lista de grupos e seus respectivos layers, para montagem da &aacute;rvore de camadas.
		 *
		 * Se essa propriedade estiver definida, as camadas ser&atilde;o agrupadas na &aacute;rvore de camadas conforme os grupos definidos.
		 *
		 * Layers que n&atilde;o constarem nessa propriedade ser&atilde;o inclu&iacute;dos no grupo "outros"
		 *
		 * Ao definir grupos, a &aacute;rvore n&atilde;o conter&aacute; as op&ccedil;&otilde;es de mudan&ccedil;a da prdem de desenho das
		 * camadas ( veja http://localhost/i3geo/exemplos/legenda2.htm )
		 *
		 * Por exemplo i3GEO.configura.grupoLayers = [ {nome:"Grupo 1",icone:true,dinamico:true,expandido:true,layers:["zee","estadosl"]},
		 * {nome:"Grupo 2",icone:false,dinamico:true,expandido:false,layers:["mundo"]} ];
		 *
		 * Onde "icone" indica se o &iacute;cone de ligar/desligar todos os temas do grupo ser&aacute; mostrado, "dinamico" significa que o
		 * n&oacute; pode ser expandido ou n&atilde;o, e "expandido" significa que o n&oacute; inicia aberto se a &aacute;rvore for
		 * din&acirc;mica
		 *
		 * Type:
		 *
		 * {Objeto}
		 *
		 * Default:
		 *
		 * ""
		 */
		grupoLayers : "",
		/**
		 * Propriedade: guardaExtensao
		 *
		 * Indica se a extensao geografica do mapa sera armazenada como um cookie
		 *
		 * Se for true a extensao geografica e armazenada sempre que o evento de navegacoa no mapa for disparado
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * {true}
		 */
		guardaExtensao : true
	};
