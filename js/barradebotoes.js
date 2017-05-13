/**
 * Title: Barra de bot&otilde;es
 *
 * Constr&oacute;i a barra de bot&otilde;es flutuante
 *
 * Veja tamb&eacute;m classe_interface.js (i3GEO.Interface) que possu&iacute; par&acirc;metros que permitem ajustar a posi&ccedil;&atilde;o
 * das barras no mapa
 *
 * Namespace:
 *
 * i3GEO.barraDeBotoes
 *
 * Exemplo:
 *
 * Para alterar as op&ccedil;&otilde;es modifique as propriedades colocando um c&oacute;digo como o seguinte no javascript utilizado na
 * interface de mapa que estiver sendo utilizada
 *
 * i3GEO.barraDeBotoes.tipo = "olhodepeixe1";
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_barradebotoes.js>
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.barraDeBotoes =
	{
		/**
		 * Variavel: BARRAS
		 *
		 * Array com os objetos YAHOO.i3GEO.janela.botoes criados
		 *
		 * Tipo:
		 *
		 * {array}
		 */
		BARRAS : [],
		/**
		 * Variavel: BOTAOCLICADO
		 *
		 * &Uacute;ltimo icone que foi clicado
		 *
		 * Tipo:
		 *
		 * {String}
		 */
		BOTAOCLICADO : "",
		/**
		 * Propriedade: ATIVA
		 *
		 * Indica se a barra de bot&otilde;es ser&aacute; ou n&atilde;o cosntru&iacute;da automaticamente no processo de
		 * inicializa&ccedil;&atilde;o do mapa.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		ATIVA : true,
		/**
		 * Propriedade: TIPO
		 *
		 * Tipo de barra.
		 *
		 * Por padr&atilde;o, utiliza a biblioteca YUI para construir a barra, opcionalmente pode-se utilizar outro tipo.
		 *
		 * Se for utilizado o padr&atilde;o YUI e os elementos para compor a barra n&atilde;o forem encontrados, a barra n&atilde;o
		 * ser&aacute; criada.
		 *
		 * O tipo emlinha insere os bot&otilde;es em um elemento html qualquer j&aacute; existente na p&aacute;gina. Nesse caso a barra
		 * n&atilde;o &eacute; iniciada automaticamente, sendo necess&aacute;rio usar a fun&ccedil;&atilde;o
		 *
		 * i3GEO.barraDeBotoes.inicializaBarra("","",false,0,0,onde)
		 *
		 * Caso o par&acirc;metro &quot;onde&quot; seja omitido ou o o elemento HTML com esse ID n&atilde;o for encontrado, ser&aacute;
		 * criado um elemento do tipo DIV no contexto do mapa.
		 *
		 * Se voc&ecirc; quer usar a barra do tipo olho de peixe e seu mapa tiver tamanho fixo, utilize o tipo &quot;olhodepeixe1&quot;
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * {yui}
		 *
		 * Valores:
		 *
		 * {"yui","olhodepeixe","olhodepeixe1","emlinha"}
		 */
		TIPO : "yui",
		/**
		 * Propriedade: OFFSET
		 *
		 * Ajuste do deslocamento vertical da barra (v&aacute;lido apenas para o tipo "olhodepeixe")
		 *
		 * Desloca a barra em uma determinada quantidade de pixels. Valores negativos fazem a barra subir.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * {-205}
		 */
		OFFSET : -205,
		/**
		 * Propriedade: POSICAO
		 *
		 * Define o posicionamento da barra de bot&otilde;es do tipo olhodepeixe
		 *
		 * Valores:
		 *
		 * {"top","bottom"}
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * {"bottom"}
		 */
		POSICAO : "bottom",
		/**
		 * Propriedade: MAXBOTOES
		 *
		 * N&uacute;mero de bot&otilde;es iniciais (v&aacute;lido apenas para os tipos olho de peixe)
		 *
		 * Se for 0, todos os bot&otilde;es ser&atilde;o mostrados
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * {13}
		 */
		MAXBOTOES : 13,
		/**
		 * Propriedade: AJUDA
		 *
		 * Mostra um texto de ajuda colado ao &iacute;cone da ferramenta
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * {true}
		 */
		AJUDA : true,
		/**
		 * Propriedade: ORIENTACAO
		 *
		 * Orienta&ccedil;&atilde;o vertical ou horizontal da barra (n&atilde;o se aplica aos tipos olhos de peixe)
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * {"horizontal","vertical"}
		 *
		 * Default:
		 *
		 * {"vertical"}
		 */
		ORIENTACAO : "vertical",
		/**
		 * Propriedade: HORIZONTALW
		 *
		 * Largura da barra quando ORIENTACAO = "horizontal" (n&atilde;o se aplica aos tipos olhos de peixe)
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * {350}
		 */
		HORIZONTALW : 350,
		/**
		 * Propriedade: TIPOAJUDA
		 *
		 * Tipo do bal&atilde;o de ajuda que &eacute; mostrado colado ao &iacute;cone da ferramenta
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * {"horizontal","vertical","balao"}
		 *
		 * Default:
		 *
		 * {"horizontal"}
		 */
		TIPOAJUDA : "balao",
		/**
		 * Propriedade: AUTOALTURA
		 *
		 * Ajusta automaticamente a altura das barras conforme a altura do mapa.
		 *
		 * Esta op&ccedil;&atilde;o n&atilde;o tem efeito se a barra contiver a barra de zoom (isso ocorre em fun&ccedil;&atilde;o de um bug
		 * do YIU, que causa erro na barra nessas condi&ccedil;&otilde;es)
		 *
		 * Tipo:
		 *
		 * {boolean}
		 */
		AUTOALTURA : false,
		/**
		 * Propriedade: PERMITEFECHAR
		 *
		 * Mostra o bot&atilde;o para fechar as barras ou n&atilde;o.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 */
		PERMITEFECHAR : false,
		/**
		 * Propriedade: PERMITEDESLOCAR
		 *
		 * Permite deslocar as barras ou n&atilde;o.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 */
		PERMITEDESLOCAR : true,
		/**
		 * ATIVAMENUCONTEXTO depreciado na versao 6.0
		 */
		ATIVAMENUCONTEXTO : false,
		/**
		 * Propriedade: AUTO
		 *
		 * Cria as barras de bot&otilde;es automaticamente, utilizando os bot&otilde;es padr&atilde;o sem considerar a lista de
		 * bot&otilde;es definidas no HTML da interface.
		 *
		 * A lista de bot&otilde;es &eacute; definida em i3GEO.configura
		 *
		 * Tipo:
		 *
		 * {Boolean}
		 *
		 * Default:
		 *
		 * {false}
		 */
		AUTO : false,
		/**
		 * Propriedade: LISTABOTOES
		 *
		 * Objeto com a lista de bot&otilde;es e suas propriedades, como por exemplo, a fun&ccedil;&atilde;o a ser executada ao se clicar no
		 * bot&atilde;o.
		 *
		 * Essa lista n&atilde;o indica quais os bot&otilde;es que ser&atilde;o inseridos. Para definir os bot&otilde;es que ser&atilde;o
		 * inseridos, inclua no HTML da interface os bot&otilde;es desejados (veja em i3geo/exemplos). Se vc utilizar a op&ccedil;&atilde;o
		 * i3GEO.barraDeBotoes.AUTO = true , os bot&otilde;es ser&atilde;o inseridos automaticamente. Nesse caso, utilize a
		 * op&ccedil;&atilde;o i3GEO.barraDeBotoes.INCLUIRBOTOES para indicar os bot&otilde;es desejados.
		 *
		 * Por default utiliza os botoes definidos em i3GEO.configura.funcoesBotoes.botoes
		 *
		 * Tipo:
		 *
		 * {objeto}
		 */
		LISTABOTOES : i3GEO.configura.funcoesBotoes.botoes,
		/**
		 * Propriedade: INCLUIBOTAO
		 *
		 * Objeto que indica quais os bot&otilde;es que ser&atilde;o inseridos na barra de bot&otilde;es 2.
		 *
		 * Essa op&ccedil;&atilde;o s&oacute; funciona se i3GEO.barraDeBotoes.AUTO = true
		 *
		 * Vc pode tamb&eacute;m alterar a ordem dos botoes ou adicionar novos
		 *
		 * Na barra de bot&otilde;es do tipo "yui", as chaves ser&atilde;o adicionadas como o atributo "id" em cada bot&atilde;o. Nesse
		 * caso, &eacute; poss&iacute;vel definir o estilo CSS para cada bot&atilde;o (veja em i3geo/css/botoes2.css).
		 *
		 * A ativa&ccedil;&atilde;o de cada bot&atilde;o, ou seja, a fun&ccedil;&atilde;o que &eacute; executada ao ser feito o clique,
		 * &eacute; definida em i3GEO.configura.funcoesBotoes
		 *
		 * Default:
		 *
		 * INCLUIBOTAO: {
		 *
		 * abreJanelaLegenda: false,
		 *
		 * zoomli: false,
		 *
		 * zoomiauto: false,
		 *
		 * zoomoauto: false
		 *
		 * pan: false,
		 *
		 * zoomtot:false,
		 *
		 * identifica: true,
		 *
		 * identificaBalao: true,
		 *
		 * mede: true,
		 *
		 * area: true,
		 *
		 * imprimir: true,
		 *
		 * reinicia: true,
		 *
		 * exten: true,
		 *
		 * referencia: true,
		 *
		 * inserexy: true,
		 *
		 * textofid: true,
		 *
		 * selecao: true,
		 *
		 * barraedicao: false,
		 *
		 * google: true,
		 *
		 * buscafotos: true,
		 *
		 * wiki: true,
		 *
		 * metar: true,
		 *
		 * lentei: true,
		 *
		 * confluence: true,
		 *
		 * inseregrafico: true,
		 *
		 * v3d: true,
		 *
		 * localizar: true,
		 *
		 * zoomproximo: true,
		 *
		 * zoomanterior: true }
		 *
		 * Tipo:
		 *
		 * {objeto}
		 */
		INCLUIBOTAO : {
			abreJanelaLegenda : false,
			localizar : false,
			zoomanterior : true,
			zoomli : true,
			zoomproximo : true,
			zoomiauto : false,
			zoomoauto : false,
			pan : true,
			zoomtot : true,
			identifica : true,
			identificaBalao : true,
			mede : true,
			area : true,
			selecao : false,
			barraedicao : false,
			imprimir : false,
			google : false,
			referencia : false,
			exten : false,
			inserexy : false,
			textofid : false,
			reinicia : false,
			buscafotos : false,
			wiki : false,
			metar : false,
			lentei : false,
			confluence : false,
			inseregrafico : false,
			v3d : false
		},
		// TODO colocar os icones como propriedade das definicoes do botao
		/**
		 * Propriedade: ICONEBOTAO
		 *
		 * &Iacute;cones utilizados em cada um dos bot&otilde;es da barra.
		 *
		 * Esses &iacute;cones s&atilde;o utilizados apenas se i3GEO.barraDeBotoes.TIPO = "olhodepeixe" e "olhodepeixe1". Para cada elemento
		 * existente em i3GEO.barraDeBotoes.INCLUIBOTAO deve existir um elemento nesse objeto. A chave de cada elemento &eacute; a mesma do
		 * objeto INCLUIBOTAO. O endere&ccedil;o da imagem ser&aacute; complementado pelo i3geo, adicionando no in&iacute;cio da string o
		 * valor da vari&aacute;vel i3GEO.configura.locaplic
		 *
		 * Default:
		 *
		 * ICONEBOTAO: {
		 *
		 * zoomli: "/imagens/gisicons/eudock/zoom-region.png",
		 *
		 * zoomproximo: "/imagens/gisicons/eudock/zoom-next.png",
		 *
		 * zoomanterior: "/imagens/gisicons/eudock/zoom-last.png",
		 *
		 * pan: "/imagens/gisicons/eudock/pan.png",
		 *
		 * zoomtot: "/imagens/gisicons/eudock/zoom-extent.png",
		 *
		 * identifica: "/imagens/gisicons/eudock/identify.png",
		 *
		 * identificaBalao: "/imagens/gisicons/eudock/tips.png",
		 *
		 * mede: "/imagens/gisicons/eudock/length-measure.png",
		 *
		 * area: "/imagens/gisicons/eudock/area-measure.png",
		 *
		 * imprimir: "/imagens/gisicons/eudock/print.png",
		 *
		 * reinicia: "/imagens/gisicons/eudock/redraw.png",
		 *
		 * exten: "/imagens/gisicons/eudock/map-extent-info.png",
		 *
		 * referencia: "/imagens/gisicons/eudock/map-reference.png",
		 *
		 * inserexy: "/imagens/gisicons/eudock/point-create.png",
		 *
		 * textofid: "/imagens/gisicons/eudock/text-add.png",
		 *
		 * selecao: "/imagens/gisicons/eudock/select.png",
		 *
		 * google: "/imagens/gisicons/eudock/google-map.png",
		 *
		 * buscafotos: "/imagens/gisicons/eudock/fotos.png",
		 *
		 * wiki: "/imagens/gisicons/eudock/wiki.png",
		 *
		 * metar: "/imagens/gisicons/eudock/metar.png",
		 *
		 * lentei: "/imagens/gisicons/eudock/lente.png",
		 *
		 * confluence: "/imagens/gisicons/eudock/confluence.png",
		 *
		 * inseregrafico: "/imagens/gisicons/eudock/grafico.png",
		 *
		 * v3d: "/imagens/gisicons/eudock/v3d.png",
		 *
		 * barraedicao: "/imagens/gisicons/eudock/editopen.png",
		 *
		 * localizar: "/imagens/gisicons/eudock/search.png",
		 *
		 * abreJanelaLegenda: "/imagens/gisicons/eudock/legenda.png" }
		 *
		 * Type:
		 *
		 * {objeto}
		 */
		ICONEBOTAO : {
			zoomli : "/imagens/gisicons/eudock/zoom-region.png",
			zoomproximo : "/imagens/gisicons/eudock/zoom-next.png",
			zoomanterior : "/imagens/gisicons/eudock/zoom-last.png",
			zoomiauto : "/imagens/gisicons/eudock/zoom-in.png",
			zoomoauto : "/imagens/gisicons/eudock/zoom-out.png",
			pan : "/imagens/gisicons/eudock/pan.png",
			zoomtot : "/imagens/gisicons/eudock/zoom-extent.png",
			identifica : "/imagens/gisicons/eudock/identify.png",
			identificaBalao : "/imagens/gisicons/eudock/tips.png",
			mede : "/imagens/gisicons/eudock/length-measure.png",
			area : "/imagens/gisicons/eudock/area-measure.png",
			imprimir : "/imagens/gisicons/eudock/print.png",
			reinicia : "/imagens/gisicons/eudock/redraw.png",
			exten : "/imagens/gisicons/eudock/map-extent-info.png",
			referencia : "/imagens/gisicons/eudock/map-reference.png",
			inserexy : "/imagens/gisicons/eudock/point-create.png",
			textofid : "/imagens/gisicons/eudock/text-add.png",
			selecao : "/imagens/gisicons/eudock/select.png",
			google : "/imagens/gisicons/eudock/google-map.png",
			buscafotos : "/imagens/gisicons/eudock/fotos.png",
			wiki : "/imagens/gisicons/eudock/wiki.png",
			metar : "/imagens/gisicons/eudock/metar.png",
			lentei : "/imagens/gisicons/eudock/lente.png",
			confluence : "/imagens/gisicons/eudock/confluence.png",
			inseregrafico : "/imagens/gisicons/eudock/grafico.png",
			v3d : "/imagens/gisicons/eudock/v3d.png",
			barraedicao : "/imagens/gisicons/eudock/editopen.png",
			localizar : "/imagens/gisicons/eudock/search.png",
			abreJanelaLegenda : "/imagens/gisicons/eudock/show-legend.png"
		},
		/**
		 * Propriedade: TEMPLATEBOTAO
		 *
		 * Template HTML que ser&aacute; utilizado na constru&ccedil;&atilde;o autom&aacute;tica dos bot&otilde;es da barra 2.
		 *
		 * Utilize a string $$ para indicar onde ser&aacute; inclu&iacute;do o c&oacute;digo do bot&atilde;o.
		 *
		 * Default: "<div style='display:inline;background-color:rgb(250,250,250);'>
		 * <p style='font-size:2px;'>
		 * &nbsp;
		 * </p>
		 * <img src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' id='$$'/></div>"
		 *
		 * Tipo:
		 *
		 * {string}
		 */
		TEMPLATEBOTAO : "",
		/**
		 * Propriedade: BOTAOPADRAO
		 *
		 * Bot&atilde;o que ser&aacute; ativado ao inicializar os bot&otilde;es com ativaBotoes.
		 *
		 * Correpsonde ao item iddiv de LISTABOTOES
		 *
		 * Tipo:
		 *
		 * {String}
		 */
		BOTAOPADRAO : "pan",
		/**
		 * Function: adicionaBotao
		 *
		 * Adiciona um novo botao nas definicoes da barra de botoes
		 *
		 * O Objeto deve ser como no exemplo abaixo
		 *
		 * i3GEO.barraDeBotoes.adicionaBotao( { iddiv:"meubotao", tipo:"", dica:"Meu Bot&atilde;o", titulo: "Meu Bot&atilde;o", icone:
		 * "/imagens/oxygen/22x22/user-online.png", funcaoonclick:function(){ alert("Meu novo botao com ID = meubotao"); } } );
		 */
		adicionaBotao : function(obj) {
			i3GEO.barraDeBotoes.LISTABOTOES.push(obj);
			i3GEO.barraDeBotoes.ICONEBOTAO[obj.iddiv] = "/imagens/oxygen/22x22/user-online.png";
			i3GEO.barraDeBotoes.INCLUIBOTAO[obj.iddiv] = true;
		},
		/**
		 * Function: ativaPadrao
		 *
		 * Ativa o bot&atilde;o definido como padr&atilde;o, executando a fun&ccedil;&atilde;o definida em onclick
		 *
		 * Utilizado para restaurar o status padr&atilde;o da barra, principalmente por ferramentas que alteram &iacute;cones e outras
		 * propriedades do mapa
		 */
		ativaPadrao : function() {
			if (i3GEO.barraDeBotoes.ATIVA === true) {
				try {
					var botao = i3GEO.barraDeBotoes.defBotao(i3GEO.barraDeBotoes.BOTAOPADRAO);
					if (botao.funcaoonclick) {
						botao.funcaoonclick.call();
					}
				} catch (e) {
				}
			}
		},
		/**
		 * Function: ativaIcone
		 *
		 * Altera as bordas de um &iacute;cone aplicando um efeito de &iacute;cone real&ccedil;ado.
		 *
		 * Todos os demais &iacute;cones definidos em LISTABOTOES e que tiverem o tipo = "dinamico" ser&atilde;o processados para alterar as
		 * bordas dando o efeito de n&atilde;o ativo.
		 *
		 * Parametro:
		 *
		 * {String} - id do icone que ser&aacute; ativado. Esse id &eacute; o mesmo definido em LISTABOTOES
		 */
		ativaIcone : function(icone) {

		},
		/**
		 * Function: ativaBotoes
		 *
		 * Ativa os botoes definidos em LISTABOTOES
		 *
		 * Os botoes s&atilde;o constru&iacute;dos e as fun&ccedil;&otilde;es definidas s&atilde;o embutidas no evento onclick
		 *
		 * Parametro:
		 *
		 * {String} - botao que ser&aacute; mostrado como ativo (opcional). Se n&atilde;o for definido, ser&aacute; utilizado o bot&atilde;o
		 * especificado em BOTAOPADRAO. O nome do botao deve estar em LISTABOTOES na propriedade iddiv
		 */
		ativaBotoes : function(padrao) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.barraDeBotoes.ativaBotoes()");

			var atrib, l, b, temp;
			if (arguments.length === 0) {
				padrao = this.BOTAOPADRAO;
			}
			this.BOTAOCLICADO = padrao;
			l = this.LISTABOTOES;
			b = l.length - 1;
			if (b >= 0) {
				do {
					temp = $i(l[b].iddiv);
					if (temp) {
						atrib = document.createAttribute("indxBotao");
						atrib.value = b;
						temp.setAttributeNode(atrib);
						if (l[b].conteudo) {
							temp.innerHTML = l[b].conteudo;
						}
						if (l[b] && l[b].funcaoonclick) {
							temp.onclick = l[b].funcaoonclick;
							if (l[b].iddiv == padrao) {
								l[b].funcaoonclick();
							}
						}
						if (l[b] && l[b].constroiconteudo) {
							eval(l[b].constroiconteudo);
						}
					}
				} while (b--);
			}
			if (padrao === "") {
				this.ativaIcone("");
			}
		},
		/**
		 * Function: execBotao
		 *
		 * Com base no c&oacute;digo de um bot&atilde;o (iddiv), obt&eacute;m a fun&ccedil;&atilde;o armazenada em
		 * i3GEO.barraDeBotoes.LISTABOTOES e executa.
		 *
		 * Parametros:
		 *
		 * {string} - identificador do bot&atilde;o, conforme definido no elemento iddiv de i3GEO.barraDeBotoes.LISTABOTOES
		 *
		 * {numeric} - (opcional) posi&ccedil;&atilde;o em pixels da tela onde foi feito o clique do mouse
		 *
		 * {numeric} - (opcional) posi&ccedil;&atilde;o em pixels da tela onde foi feito o clique do mouse
		 */
		execBotao : function(id, x, y, posX, posY) {
			if (i3GEO.barraDeBotoes.ATIVA === false) {
				return;
			}
			var botao = i3GEO.barraDeBotoes.defBotao(id);
			i3GEO.barraDeBotoes.BOTAOCLICADO = id;
			if (botao === false) {
				return;
			}
			try {
				if (botao.funcaoonclick) {
					botao.funcaoonclick.call();
				}
			} catch (e) {
				if (typeof (console) !== 'undefined')
					console.error("Erro no botao " + id + " " + e);
			}
		},
		/**
		 * Function: defBotao
		 *
		 * Obt&eacute;m as defini&ccedil;&otilde;es de um bot&atilde;o conforme o seu c&oacute;digo (iddiv)
		 *
		 * Retorno:
		 *
		 * {objeto} - ver i3GEO.barraDeBotoes.LISTABOTOES
		 */
		defBotao : function(iddiv) {
			var l = i3GEO.barraDeBotoes.LISTABOTOES, b = l.length - 1;
			if (b >= 0) {
				do {
					// temp = l[b].iddiv;
					if (l[b].iddiv === iddiv) {
						return l[b];
					}
				} while (b--);
			}
			return false;
		},
		/**
		 * Function: inicializaBarraOP
		 *
		 * Inicializa a barra de bot&otilde;es quando for do tipo "olhodepeixe" ou "olhodepeixe1"
		 *
		 * O objeto euEnv armazena todas as caracter&iacute;sticas da barra
		 *
		 * "olhodepeixe1" substitui a antiga "olhodepeixe" e nao precisa de ajustes de posicionamento
		 *
		 */
		inicializaBarraOP : function(onde,numBotoes) {
		},
		/**
		 * Function: inicializaBarra
		 *
		 * Inicializa a barra de bot&otilde;es
		 *
		 * A barra de zoom &eacute; inserida automaticamente na barra de botoes 1 se esta existir
		 *
		 * Caso i3GEO.barraDeBotoes.TIPO === "olhodepeixe" os par&acirc;metros s&atilde;o ignorados.
		 *
		 * Exemplo:
		 *
		 * if ($i("barraDeBotoes1"))
		 *
		 * i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);
		 *
		 * if ($i("barraDeBotoes2"))
		 *
		 * i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);
		 *
		 * Os objetos criados s&atilde;o armazenados no array BARRAS, dessa forma, para acessar uma barra utilize por exemplo:
		 *
		 * i3GEO.barraDeBotoes.BARRAS[1].show();
		 *
		 * Parametros:
		 *
		 * {String} - id do elemento existente no HTML e que cont&eacute;m as defini&ccedil;&otilde;es dos bot&otilde;es
		 *
		 * {String} - id do elemento que ser&aacute; criado para adicionar os boto&otilde;es
		 *
		 * {boolean} - indica se a barra de zoom ser&aacute; inclu&iacute;da
		 *
		 * {Numeric} - posi&ccedil;&atilde;o x (pixels) da barra em rela&ccedil;&atilde;o ao mapa
		 *
		 * {Numeric} - posi&ccedil;&atilde;o y (pixels) da barra em rela&ccedil;&atilde;o ao mapa
		 *
		 * {String} - (opcional) id do elemento HTML onde os bot&otilde;es ser&atilde;o inseridos
		 */
		inicializaBarra : function(idconteudo, idconteudonovo, barraZoom, x, y, onde) {
		},
		/**
		 * Function: reativa
		 *
		 * Reativa as barras de ferramentas j&aacute; criadas
		 *
		 * Essa op&ccedil;&atilde;o apenas aplica o m&eacute;todo "show" aos objetos armazenados em i3GEO.barraDeBotoes.BARRAS
		 *
		 * Se a barra n&atilde;o existir previamente, nada ir&aacute; contecer
		 *
		 * Parametro:
		 *
		 * {Integer} - &iacute;ndice do array BARRAS que guarda os objetos YAHOO com as barras Se n&atilde;o for definido, todas as barras
		 * ser&atilde;o reativadas
		 */
		reativa : function(indice) {
			if (i3GEO.barraDeBotoes.ATIVA === false) {
				return;
			}
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.barraDeBotoes.reativa()");

			var abre = function() {
				var i, n = i3GEO.barraDeBotoes.BARRAS.length;
				for (i = 0; i < n; i += 1) {
					if (i3GEO.barraDeBotoes.BARRAS[i]) {
						i3GEO.barraDeBotoes.BARRAS[i].show();
					}
				}
			};
			try {
				if (arguments.length === 1) {
					i3GEO.barraDeBotoes.BARRAS[indice].show();
				} else {
					abre.call();
				}
			} catch (e) {
				abre.call();
			}
		},
		/**
		 * Function: recria
		 *
		 * Recria uma barra de ferramentas j&aacute; aberta aplicando os par&acirc;metros de configura&ccedil;&atilde;o definidos
		 * (vari&aacute;veis)
		 *
		 * Parametro:
		 *
		 * {String} - id da barra
		 */
		recria : function(id) {

		},
		/**
		 * Function: fecha
		 *
		 * Fecha uma barra de ferramentas
		 *
		 * Parametro:
		 *
		 * {String} - id que identifica a barra. Corresponde ao parametro idconteudonovo da fun&ccedil;&atilde;o de
		 * inicializa&ccedil;&atilde;o das barras
		 */
		fecha : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.barraDeBotoes.fecha()");

			var i, n = this.BARRAS.length;
			for (i = 0; i < n; i += 1) {
				if (this.BARRAS[i] && this.BARRAS[i].id === id) {
					$i(id + "_c").style.visibility = "hidden";
				}
			}
		},
		/**
		 * Section: i3GEO.barraDeBotoes.editor
		 *
		 * Editor vetorial
		 */
		editor : {
			/**
			 * Function: inicia
			 *
			 * Abre as op&ccedil;&otilde;es do editor conforme a interface em uso
			 */
			inicia : function() {
				i3GEO.eventos.cliquePerm.desativa();
				i3GEO.barraDeBotoes.editor[i3GEO.Interface.ATUAL].inicia("janelaEditorVetorial");
			},
			// carrega as opcoes de edicao se a interface for do googlemaps
			googlemaps : {
				inicia : function(idjanela) {
					var temp =
						function() {
							var cabecalho, minimiza, fecha, janela = YAHOO.i3GEO.janela.manager.find("i3GEOjanelaEditor");
							if (janela) {
								janela.destroy();
							}
							cabecalho = function() {
							};
							minimiza = function() {
								i3GEO.janela.minimiza("i3GEOjanelaEditor");
							};
							janela =
								i3GEO.janela.cria(
									"350px",
									"100px",
									"",
									"",
									"",
									"<div class='i3GeoTituloJanela'>Editor</div>",
									"i3GEOjanelaEditor",
									false,
									"hd",
									cabecalho,
									minimiza);
							$i("i3GEOjanelaEditor_corpo").style.backgroundColor = "white";
							i3GEO.editorGM.inicia("i3GEOjanelaEditor_corpo");
							fecha = function() {
								var temp = window.confirm($trad("x94"));
								if (i3GEO.eventos) {
									i3GEO.eventos.cliquePerm.ativa();
								}
								if (temp === true) {
									i3GEO.desenho.googlemaps.destroyFeatures(i3GEO.desenho.googlemaps.shapes);
								}
							};
							$( janela[0].close ).click(fecha);
						};
					// @TODO incluir o js compactado ao inves do original
					if (!i3GEO.editorGM) {
						i3GEO.util.scriptTag(
							i3GEO.configura.locaplic + "/ferramentas/editorgm/editorgm_compacto.js",
							temp,
							"editorgm.js",
							true);
					} else {
						temp.call();
					}
				}
			},
			openlayers : {
				inicia : function(idjanela) {
					//TODO mudar carga do JS do editor para o compactado
					if (!i3GEO.editorOL) {
						//a barra de botoes utiliza codigo do Opelayers2
						i3GEO.util.scriptTag(
							i3GEO.configura.locaplic + "/ferramentas/editorol/editorol.js",
							"i3GEO.barraDeBotoes.editor.openlayers.ativaPainel('" + idjanela + "')",
							"editorol.js",
							true);
					} else {
						if (!i3GEO.desenho.layergrafico) {
							i3GEO.desenho.openlayers.criaLayerGrafico();
							i3GEO.editorOL.mapa.addLayers([
								i3GEO.desenho.layergrafico
							]);
						}
						if (!i3GEO.editorOL.backup) {
							i3GEO.editorOL.backup = new ol.layer.Vector({
								source : new ol.source.Vector({
									features : new ol.Collection(),
									useSpatialIndex : false,
									name : "Backup"
								}),
								visible: false
							});
							i3GEO.editorOL.backup.setMap(i3geoOL);
							i3GEO.editorOL.backup.getFeatures = function(){
								return i3GEO.editorOL.backup.getSource().getFeatures();
							};
						}
						i3GEO.editorOL.criaBotoes(i3GEO.editorOL.botoes);
					}
				},
				criaJanela : function() {
					if ($i("i3GEOjanelaEditor")) {
						return "i3GEOjanelaEditor";
					}
					var janela, divid, titulo, cabecalho, minimiza;
					cabecalho = function() {
					};
					minimiza = function() {
						i3GEO.janela.minimiza("i3GEOjanelaEditor");
					};
					// cria a janela flutuante
					titulo = "<div class='i3GeoTituloJanela'>"+$trad("u29")+"</div>";
					janela = i3GEO.janela.cria("300px", "200px", "", "", "", titulo, "i3GEOjanelaEditor", false, "hd", cabecalho, minimiza);
					divid = janela[2].id;
					$i("i3GEOjanelaEditor_corpo").style.backgroundColor = "white";
					$i("i3GEOjanelaEditor_corpo").style.textAlign = "left";
					return divid;
				},
				ativaPainel : function(idjanela) {
					i3GEO.editorOL.fundo = "";// i3GEO.editorOL &eacute; criado pelo script carregado
					i3GEO.editorOL.mapa = i3geoOL;
					i3GEO.editorOL.maxext = "";
					i3GEO.editorOL.controles = [];
					i3GEO.editorOL.botoes = {
						'zoomin' : true,
						'zoomout' : true,
						'pan' : true,
						'zoombox' : true,
						'zoomtot' : true,
						'legenda' : true,
						'distancia' : true,
						'area' : true,
						'identifica' : true,
						'linha' : true,
						'ponto' : true,
						'poligono' : true,
						'texto' : true,
						'corta' : true,
						'edita' : true,
						'listag' : true,
						'selecao' : true,
						'selecaotudo' : true,
						'apaga' : true,
						'procura' : false,
						'propriedades' : true,
						'salva' : true,
						'ajuda' : true,
						'fecha' : true,
						'tools' : true,
						'undo' : true,
						'frente' : true
					};
					if (!i3GEO.desenho.layergrafico) {
						i3GEO.desenho.openlayers.criaLayerGrafico();
					}
					if (idjanela) {
						i3GEO.editorOL.criaBotoes(i3GEO.editorOL.botoes);
					}
				}
			}
		}
	};