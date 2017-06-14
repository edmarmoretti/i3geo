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

/**
 * Licen&ccedil;a:
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
	 * Objeto com a defini&ccedil;&atilde;o das propriedades que ser&atilde;o
	 * utilizadas na inclus&atilde;o dos &iacute;cones adicionais de
	 * adi&ccedil;&atilde;o de temas e no item de descri&ccedil;&atilde;o de
	 * cada tema.
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
	 * metaestat - inclui um n&oacute; que mostra os dados cadastrados no
	 * sistema metaestat
	 *
	 *
	 * &Iacute;cones iniciais:
	 *
	 * uploadarquivo - agregador que abre uma &uacute;nica janela das
	 * op&ccedil;&otilde;es de upload de arquivos
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
	 * refresh - &iacute;cone que permite reconstruir a &aacute;rvore do
	 * cat&aacute;logo
	 *
	 * carousel - visualizador de temas na forma de carousel
	 *
	 * inde - busca camadas no geonetwork da IDE cadastrada
	 *
	 * Op&ccedil;&otilde;es inclu&iacute;das nos n&oacute;s de cada tema:
	 *
	 * kml - op&ccedil;&atilde;o para obter KML da camada em foco
	 *
	 * estrelas - mostra o n&uacute;mero de estrelas (temas mais acesssados
	 * possuem mais estrelas)
	 *
	 * qrcode - op&ccedil;&atilde;o para obter QRCODE da camada em foco
	 *
	 * mini - op&ccedil;&atilde;o para obter imagem miniatura da camada em foco
	 *
	 * comentarios - permite que os usu&aacute;rios comentem temas
	 *
	 * bookmark - permite que os usu&aacute;rios marquem um tema em
	 * servi&ccedil;os de bookmark
	 *
	 * importarwmc - permite importar um arquivo do tipo map context
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	OPCOESADICIONAIS : {
		uploadarquivo : true,
		downloadbase : true,
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
		comentarios : true,
		bookmark : true,
		importarwmc : true,
		googleearth : true,
		metaestat : true,
		idonde : "arvoreCatOpcoes"
	},
	/**
	 * Propriedade: INCLUISISTEMAS
	 *
	 * Inclui na &aacute;rvore a lista de sistemas adicionais definidos no
	 * i3geo?
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
	 * Inclui na &aacute;rvore a lista de de regi&otilde;es cadatsradas no
	 * sistema de metadados estat&iacute;sticos
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
	 * Inclui na &aacute;rvore a lista de Web Services WMS advindos do sistema
	 * de metadados estat&iacute;sticos?
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
	 * Inclui na &aacute;rvore a lista de mapas cadastrados do sistema de
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
	INCLUIMAPASCADASTRADOS : true,
	/**
	 * Propriedade: INCLUIESTRELAS
	 *
	 * Inclui na &aacute;rvore um no com a lista de temas classificados conforme
	 * o numero de estrelas que possui
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
	 * Nome da fun&ccedil;&atilde;o que ser&aacute; incluida no evento onclick
	 * do elemento checkbox adicionado no in&iacute;cio do nome de um tema.
	 *
	 * Tipo:
	 *
	 * {String}
	 *
	 * Default:
	 *  ""
	 */
	ATIVATEMA : "",
	/**
	 * Propriedade: IDSMENUS
	 *
	 * Array com a lista de ids de menus cadastrados que ser&atilde;o
	 * considerados na montagem da &aacute;rvore. Por default &eacute; vazio, o
	 * que significa que todos os menus serao considerados.
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *  []
	 */
	IDSMENUS : [],
	/**
	 * Propriedade: RETORNAGUIA
	 *
	 * Guia que ser&aacute; ativada ap&oacute;s uma opera&ccedil;&atilde;o de
	 * adi&ccedil;&atilde;o de temas ter sido concluida.
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
	 *  ""
	 */
	RETORNAGUIA : "",
	/**
	 * Objeto com a lista de drives no servidor que podem ser abertos na opcao
	 * de navegacao pelos diretorios
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
	 * Armazena o objeto com a lista de menus resultante da funcao listaMenus
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	MENUS : [],
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
	// contador utilizado para definir um ID para cada texto de WMS
	CONTATEMAWMS : 0,


	/**
	 * Lista as regioes ou localidades cadastradas no METAESTAT
	 */
	listaRegioes : function() {

	},
	/**
	 * Lista as variaveis cadastradas no sistema METAESTAT preenchendo
	 */
	listaVariaveisMetaestat : function() {

	},
	/**
	 * Lista as medidas de variaveis cadastradas no sistema METAESTAT
	 */
	listaMedidasVariavel : function(node) {

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
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio classesphp
	 *
	 * {String} - Id do menu que contem os grupos
	 *
	 * {Function} - funcao que sera executada quando a lista for recebida. Se
	 * for "", nao e chamada.
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
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio classesphp
	 *
	 * {String} - Id do menu que contem os grupos
	 *
	 * {String} - Id do grupo que contem os sub-grupos
	 *
	 * {Function} - funcao que sera executada quando a lista for recebida. Se
	 * for "", nao e chamada.
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
	 * {String} - Endereco da aplicacao (i3geo) onde fica o diretorio classesphp
	 *
	 * {String} - Id do menu que contem os grupos
	 *
	 * {String} - Id do grupo que contem os sub-grupos
	 *
	 * {String} - Id do sub-grupo que contem os temas
	 *
	 * {Function} - funcao que sera executada quando a lista for recebida. Se
	 * for "", nao e chamada.
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
	 * {String} Endereco da aplicacao (i3geo) onde fica o diretorio classesphp
	 *
	 * {String} Id do elemento onde a arvore sera inserida. Se for vazio, sera
	 * utilizado o ID definido em IDHTML
	 *
	 * {String} (opcional) Nome da funcao que sera executada quando o usuario
	 * clicar no checkbox de um tema
	 *
	 * {Object} (opcional) Objeto com as opcoes necessarias para criacao dos
	 * icones com as opcoes adicionais de adicao de temas
	 *
	 * {String} (opcional) checkbox|radio|download tipo de botao que sera
	 * mostrado para o usuario escolher o tema
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
		$i(i3GEO.arvoreDeTemas.IDHTML).className = "i3GEOarvCat";
		i3GEO.arvoreDeTemas.listaMenus(g_sid, g_locaplic,
				i3GEO.arvoreDeTemas.montaArvore);
	},
	listaMenus: function(){
		i3GEO.arvoreDeTemas.montaArvore();
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

		var ig, mais = "", tempNode, tempNode1, retorno, root, insp = "", outrasOpcoes, dados, c, i, j, conteudo, editor;

		if (!i3GEO.arvoreDeTemas.INCLUISISTEMAS) {
			if (i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir === false) {
				i3GEO.arvoreDeTemas.ARVORE.draw();
			} else if (mais != "") {
				i3GEO.arvoreDeTemas.adicionaNoNavegacaoDir();
			}
		}
	},
	adicionaNoNavegacaoDir : function(drives, arvore) {

	},
	/**
	 * Monta a lista de grupos de um no principal da arvore.
	 *
	 * A opcao de carga dinamica dos nos filhos e definida para a montagem dos
	 * sub-grupos.
	 */
	montaGrupos : function(node) {

	},
	/**
	 * Monta a lista de sub-grupos de um no do tipo grupo.
	 *
	 * A opcao de carga dinamica dos nos filhos e definida para a montagem dos
	 * temas.
	 */
	montaSubGrupos : function(node) {

	},
	/**
	 * Monta a lista de temas de um no.
	 */
	montaTemas : function(node) {
	},
	/**
	 * Inclui na arvore o navegador de diretorios
	 *
	 * Parametro:
	 *
	 * {node} - no onde sera criada a lista
	 */
	montaDir : function(node) {
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
			html += "<input id='"
					+ tema.tid
					+ "ckboxc' title='"
					+ tema.tid
					+ "' style='position:relative;top:3px;width:12px;height:12px;cursor:pointer;border:solid 0 white;' ";
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
			html += " type='" + i3GEO.arvoreDeTemas.TIPOBOTAO + "' value='"
					+ tema.tid + "' />";
		html += "<label for='"
				+ tema.tid
				+ "ckboxc' title='"
				+ tema.tid
				+ "' onmouseout='javascript:this.style.color=\""
				+ cor
				+ "\";' onmouseover='javascript:this.style.color=\"blue\";' style='cursor:pointer;text-align:left;color:"
				+ cor + ";padding-left:0px;position:relative;top:1px;' "
				+ clique + ">";
		html += tema.nome;
		html += "</label></td>";
		return (html);
	},
	/**
	 * Funcao default que adiciona o tema ao mapa Verifica se o tema ja existe
	 * ou nao e decide se deve desligar ou ligar
	 */
	verificaStatusTema : function(obj, tid) {
		if (obj.tagName != "INPUT") {
			return;
		}
		// confirma se o tema existe no mapa
		if (i3GEO.arvoreDeCamadas.pegaTema(tid) !== "") {
			if (i3GEO.arvoreDeCamadas.ARVORE) {
				i3GEO.arvoreDeCamadas.ligaDesligaTemas(tid, obj.checked);
			} else {
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
		if (i3GEO.arvoreDeTemas.ARVORE) {
			o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
			if (o) {
				inputs = o.getElementsByTagName("input");
				n = inputs.length;
				i = 0;
				do {
					if (inputs[i].value === valor) {
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
							//aqui vai a saida. antes era arvore
						}
						conta += 1;
					}
				}
			};
		};

		//
		// funcao que sera executada para buscar os temas
		//
		busca = function() {
			i3GEO.php.procurartemas2(resultadoProcurar, i3GEO.util
					.removeAcentos(palavra));
		};
	},
	/**
	 * Function: adicionaTemas
	 *
	 * Adiciona ao mapa os temas selecionados na arvore
	 *
	 * Parametro:
	 *
	 * {array} - (opcional) codigo do tema que sera adicionado ao mapa. Se nao
	 * for especificado, a lista de codigos sera obtida da arvore de temas
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
	 * {String} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
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
	 * {String} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
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
	 * {String} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
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
	 * {string} - nome da funcao que sera executada quando o usuario escolhe um
	 * grupo
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
			i3GEO.janela
					.cria("550px", "350px", i3GEO.configura.locaplic
							+ "/ferramentas/navegacaodir/index.htm", "", "",
							"<div class='i3GeoTituloJanela'>" + $trad("x45")
									+ "</div>");
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
					+ "/ferramentas/conectarwfs/index.htm", "", "",
					"<div class='i3GeoTituloJanela'>WFS</div>");
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