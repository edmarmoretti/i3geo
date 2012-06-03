/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Árvore de temas

Arquivo:

i3geo/classesjs/classe_arvoredetemas.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.arvoreDeTemas

Monta a árvore com os temas disponíveis para ser adicionados ao mapa.
*/
i3GEO.arvoreDeTemas = {
	/*
	Propriedade: OPCOESADICIONAIS

	Objeto com a definição das propriedades que serão utilizadas na inclusão dos ícones adicionais de adição de temas e no item de descrição de cada tema.

	"uploadarquivo" quando "true" indica que será mostrado o ícone de upload de arquivos e o íconde de conexão com serviços
	
	Example:

	var obj = {

		idonde: "",

		incluiArvore: true,

		uploaddbf: false,

		uploadlocal: false,

		downloadbase: true,

		conectarwms: true,

		conectarwmst: true,

		conectargeorss: true,
		
		conectargeojson: true,

		nuvemTags: true,

		nuvemTagsFlash: true,
		
		carregaKml: true,

		navegacaoDir: false,

		incluibusca: true,

		kml: true,

		qrcode: true,

		mini: true,

		estrelas:true,

		refresh: true,

		carousel: true,
		
		inde: true,

		uploadgpx: false,

		comentarios: true,

		bookmark: true,
		
		importarwmc: true,
		
		googleearth: true,
		
		uploadarquivo: true //upload de GPX, SHAPEFILE, DBF, CSV e KML
	}

	Tipo:
	{Object}
	*/
	OPCOESADICIONAIS: {
		idonde: "",
		incluiArvore: true,
		uploaddbf: true,
		uploadlocal: true,
		uploadarquivo:true,
		downloadbase: true,
		conectarwms: true,
		conectarwmst: true,
		conectargeorss: true,
		conectargeojson: true,
		nuvemTags: true,
		nuvemTagsFlash: false,
		navegacaoDir: false,
		incluibusca: true,
		kml: true,
		qrcode: true,
		mini: true,
		estrelas: true,
		refresh: true,
		carousel: true,
		inde: true,
		uploadgpx: true,
		comentarios: true,
		bookmark: true,
		importarwmc: true,
		googleearth: true,
		carregaKml: true
	},
	/*
	Propriedade: FATORESTRELA

	Valor que será utilizado para dividir o valor bruto do número de acessos de cada tema.

	A divisão é utilizada para definir quantas estrelas serão mostradas na árvore de opções adicionais.<b> 

	Tipo:
	{Numeric}
	*/
	FATORESTRELA: "10",
	/*
	Propriedade: INCLUISISTEMAS

	Inclui na árvore a lista de sistemas adicionais definidos no i3geo?

	Tipo:
	{Boolean}
	*/
	INCLUISISTEMAS: true,
	/*
	Propriedade: INCLUIWMS

	Inclui na árvore a lista de Web Services WMS?

	Tipo:
	{Boolean}
	*/
	INCLUIWMS: true,
	/*
	Propriedade: INCLUIESTRELAS

	Inclui na árvore um nó com a lista de temas classificados conforme o número de estrelas que possuí

	Tipo:
	{Boolean}
	*/
	INCLUIESTRELAS: true,
	/*
	Propriedade: FILTRADOWNLOAD

	Não mostra na árvore os nós que não possuem temas para download

	Tipo:
	{Boolean}
	*/
	FILTRADOWNLOAD: false,
	/*
	Propriedade: FILTRAOGC

	Não mostra na árvore os nós que não permitem a geração de WMS

	Tipo:
	{Boolean}
	*/
	FILTRAOGC: false,
	/*
	Propriedade: TIPOBOTAO

	Tipo de botao que sera usado para clicar no tema

	Tipo:
	{String}

	Valores:
	{checkbox|radio}

	Default:
	{checkbox}
	*/
	TIPOBOTAO: "checkbox",
	/*
	Propriedade: ATIVATEMA

	Nome da função que será incluída no evento onclick do elemento checkbox adicionado no início do nome de um tema.

	Tipo:
	{String}
	*/
	ATIVATEMA: "",
	/*
	Propriedade: ATIVATEMAIMEDIATO

	Adiciona ao mapa o tema clicado imediatamente, sem a definição de um temporizador ou necessidade de se clicar no botao "aplicar".

	Tipo:
	{boolean}

	Default:
	{false}
	*/
	ATIVATEMAIMEDIATO: false,
	/*
	Propriedade: IDSMENUS

	Array com a lista de ids que serão considerados na montagem da árvore. Por default é vazio, o que significa que todos os menus serão considerados.

	Tipo:
	{Array}
	*/
	IDSMENUS: [],
	/*
	Propriedade: RETORNAGUIA

	Guia que será ativada após uma operação de adição de temas ter sido concluída.

	Se for vazia, a guia atual será mantida.

	A string corresponde ao nome da guia que deve estar definida em i3GEO.guias.CONFIGURA, por exemplo i3GEO.arvoreDeTemas.RETORNAGUIA = "temas"

	Tipo:
	{String}

	Default: ""
	*/
	RETORNAGUIA: "",
	/*
	Variavel: IDHTML

	Armazena o ID do elemento HTML onde a árvore será incluida

	Tipo:
	{String}
	*/
	IDHTML: "arvoreAdicionaTema",
	/*
	Variavel: LOCAPLIC

	Endereço da aplicação i3geo. Utilizado para definir o caminho para a chamada em AJAX.

	Tipo:
	{String}
	*/
	LOCAPLIC: null,
	/*
	Variavel: SID

	Código da seção aberta no servidor pelo i3Geo

	Tipo:
	{String}
	*/
	SID: null,
	/*
	Variavel: ARVORE

	Objeto com a árvore criada com YAHOO.widget.TreeView

	Tipo:
	{YAHOO.widget.TreeView}
	*/
	ARVORE: null,
	/*
	Variavel: DRIVES

	Objeto JSON com a lista de drives no servidor que podem ser abertos na opção de navegação pelos diretórios

	Tipo:
	{JSON}
	*/
	DRIVES: null,
	/*
	Variavel: SISTEMAS

	Objeto JSON com a lista de sistemas existentes

	Tipo:
	{JSON}
	*/
	SISTEMAS: null,
	/*
	Variavel: MENUS

	Armazena o objeto JSON com a lista de menus resultante da função listaMenus

	Tipo:
	{JSON}
	*/
	MENUS: null,
	/*
	Variavel: GRUPOS

	Armazena o objeto JSON com a última lista de grupos obtida

	Tipo:
	{JSON}
	*/
	GRUPOS: null,
	/*
	Variavel: SUBGRUPOS

	Armazena o objeto JSON com a última lista de sub-grupos obtida

	Tipo:
	{JSON}
	*/
	SUBGRUPOS: null,
	/*
	Variavel: TEMAS

	Armazena o objeto JSON com a última lista de temas obtida

	Tipo:
	{JSON}
	*/
	TEMAS: null,
	/*
	Function: listaWMS

	Lista os WMS cadastrados preenchendo o nó OGC-WMS
	*/
	listaWMS: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaWMS()");}
		var monta = function(retorno){
			var node,raiz,nraiz,i,html,tempNode;
			node = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("idwms","raiz");
			raiz = retorno.data.canais;
			nraiz = raiz.length;
			for (i=0;i<nraiz; i += 1){
				html = "<span title='"+raiz[i].description+"'> "+raiz[i].title;
				if(raiz[i].nacessos > 0){
					html += " ("+((raiz[i].nacessosok * 100) / (raiz[i].nacessos*1))+"%)</span>";
				}
				else
				{html += " (% de acessos não definido)</span>";}
				html += "<hr>";
				tempNode = new YAHOO.widget.HTMLNode(
					{html:html,id_ws:raiz[i].id_ws,url:raiz[i].link,nivel:0,expanded:false,enableHighlight:false},
					node
				);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaLayersWMS, 1); 
			}
			node.loadComplete();
		};
		i3GEO.php.listaRSSwsARRAY(monta,"WMS");
	},
	/*
	Function: listaLayersWMS

	Lista os layers de um WMS e preenche o nó OGC-WMS
	*/
	listaLayersWMS: function(node){
		//node = no;
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaLayersWMS()");}
		var monta = function(retorno){
			var n,cor,i,cabeca,tempNode,ns,j,temp;
			n = 0;
			try{n = retorno.data.length;}
			catch(m){node.loadComplete();return;}
			cor = "rgb(51, 102, 102)";
			html = "";
			for(i=0;i<n; i += 1){
				temp = retorno.data[i];
				cabeca = temp.nome+" - "+temp.titulo;
				if (cabeca !== "undefined - undefined"){
					tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<span style='color:"+cor+"' >"+cabeca,
							url:node.data.url,
							nivel:(node.data.nivel*1 + 1),
							id_ws:"",
							layer:temp.nome,
							enableHighlight: false,
							expanded: false
						},
						node
					);
					if(!temp.estilos)
					{tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaLayersWMS, 1);}
					if(temp.estilos){
						ns = temp.estilos.length;
						for (j=0;j<ns; j += 1){
							new YAHOO.widget.HTMLNode(
								{
									html:i3GEO.arvoreDeTemas.montaTextoTemaWMS(
										node.data.url,
										temp.nome,
										temp.estilos[j].nome,
										temp.estilos[j].titulo,
										temp.srs.toString(),
										temp.formatsinfo.toString(),
										temp.version.toString(),
										temp.formats.toString(),
										cor
									),
									enableHighlight: false,
									expanded: false
								},
								tempNode
							);
							tempNode.isleaf = true;
						}
					}
					cor = (cor === "rgb(51, 102, 102)") ? "rgb(47, 70, 50)" : "rgb(51, 102, 102)";
				}
			}
			node.loadComplete();
		};
		i3GEO.php.listaLayersWMS(monta,node.data.url,(node.data.nivel*1 + 1),node.data.id_ws,node.data.layer);
	},
	/*
	Function: montaTextoTemaWMS

	Monta o texto que será mostrado ao lado de cada layer de um WMS, permitindo incluir o layer no mapa.
	*/
	montaTextoTemaWMS: function(servico,layer,estilo,titulo,proj,formatoinfo,versao,formatoimg,cor){
		var html,temp,adiciona;
		html = "<td style='vertical-align:top;padding-top:5px;'><span ><input style='cursor:pointer;border:solid 0 white;' ";
		temp = function(){
			i3GEO.janela.fechaAguarde("ajaxredesenha");
			i3GEO.atualiza();
		};
		adiciona = "i3GEO.arvoreDeTemas.checked=false;i3GEO.php.adicionaTemaWMS("+temp+"," +
		"\""+servico+"\"," +
		"\""+layer+"\"," +
		"\""+estilo+"\"," +
		"\""+proj+"\"," +
		"\""+formatoimg+"\"," +
		"\""+versao+"\"," +
		"\""+titulo+"\"," +
		"\"\"," +
		"\"nao\"," +
		"\""+formatoinfo+"\")";
		html += "onclick='javascript:"+adiciona+"' " +
		" type='radio'  /></td><td style='padding-top:4px;vertical-align:top;text-align:left;padding-left:3px;color:"+cor+";' >" +
		layer+" - "+titulo +
		"</td></span>";
		return(html);
	},
	/*
	Function: listaMenus

	Lista os menus disponíveis.

	Pesquisa no banco de dados administrativo ou na variável de configuração (veja ms_configura.php) a lista de menus disponíveis.

	O resultado é incluído em i3GEO.arvoreDeTemas.MENUS.

	A propriedade i3GEO.arvoreDetemas.IDSMENUS pode ser utilizada para filtrar alista de menus que será utilizada.

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	funcao - {String} nome da função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaMenus: function(g_sid,g_locaplic,funcao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaMenus()");}
		var retorno = function(retorno) {
			var c,m,i,k,jj,j;
			if(i3GEO.arvoreDeTemas.IDSMENUS.length === 0)
			{i3GEO.arvoreDeTemas.MENUS = retorno.data;}
			else{
				i3GEO.arvoreDeTemas.MENUS = [];
				c = retorno.data.length;
				m = i3GEO.arvoreDeTemas.IDSMENUS.length;
				for (i=0, j=c; i<j; i += 1){
					for (k=0, jj=m; k<jj; k +=1 ){
						if(retorno.data[i].idmenu === i3GEO.arvoreDeTemas.IDSMENUS[k]) 
						{i3GEO.arvoreDeTemas.MENUS.push(retorno.data[i]);}
					}
				}
			}
			if(funcao !== "")
			{eval(funcao+"(retorno)");}
		};
		i3GEO.php.pegalistademenus(retorno);
	},
	/*
	Function: listaGrupos

	Lista os grupos de um menu.

	O resultado é armazenado em i3GEO.arvoreDetemas.GRUPOS 

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	id_menu - {String} Id do menu que contem os grupos

	funcao - {Function} função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaGrupos: function(g_sid,g_locaplic,id_menu,funcao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaGrupos()");}
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.GRUPOS = retorno.data;
			if(funcao !== "")
			{funcao.call();}
		};
		if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD || i3GEO.arvoreDeTemas.FILTRAOGC)
		{i3GEO.php.pegalistadegrupos(retorno,id_menu,"sim");}
		else
		{i3GEO.php.pegalistadegrupos(retorno,id_menu,"nao");}
	},
	/*
	Function: listaSubGrupos

	Lista os sub-grupos de um grupo.

	O resultado é armazenado emi3GEO.arvoreDetemas.SUBGRUPOS

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	id_menu - {String} Id do menu que contem os grupos

	id_grupo - {String} Id do grupo que contem os sub-grupos

	funcao - {Function} função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaSubGrupos: function(g_sid,g_locaplic,id_menu,id_grupo,funcao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaSubGrupos()");}
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.SUBGRUPOS = retorno.data;
			if(funcao !== "")
			{funcao.call();}
		};
		i3GEO.php.pegalistadeSubgrupos(retorno,id_menu,id_grupo);
	},
	/*
	Function: listaTemas

	Lista os temas de um sub-grupo.

	O resultado é armazenado em i3GEO.arvoreDeTemas.TEMAS

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	id_menu - {String} Id do menu que contem os grupos

	id_grupo - {String} Id do grupo que contem os sub-grupos

	id_subgrupo - {String} Id do sub-grupo que contem os temas

	funcao - {Function} função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaTemas: function(g_sid,g_locaplic,id_menu,id_grupo,id_subgrupo,funcao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaTemas()");}
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.TEMAS = retorno.data;
			if(funcao !== "")
			{funcao.call();}
		};
		i3GEO.php.pegalistadetemas(retorno,id_menu,id_grupo,id_subgrupo);
	},
	/*
	Function: listaSistemas

	Lista os sistemas especiais de adição de temas.

	O resultado é armazenado em i3GEO.arvoreDeTemas.SISTEMAS

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	funcao - {Function} função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaSistemas: function(g_sid,g_locaplic,funcao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaSistemas()");}
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.SISTEMAS = retorno.data;
			if(funcao !== "")
			{funcao.call();}
		};
		i3GEO.php.pegaSistemas(retorno);
	},
	/*
	Function: listaDrives

	Lista os endereços no servidor dos drives que podem ser abertos pela opção de navegação em arquivos no servidor.

	Alista de drives deve ser definida emi3geo/ms_configura.php

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	funcao - {Function} função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaDrives: function(g_sid,g_locaplic,funcao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaDrives()");}
		var retorno = function(retorno) {
			try{
				i3GEO.arvoreDeTemas.DRIVES = retorno.data[0];
				if(i3GEO.arvoreDeTemas.DRIVES == "")
				{return;}
				if(funcao !== "")
				{funcao.call();}
			}
			catch(e){i3GEO.arvoreDeTemas.DRIVES = "";}
		};
		i3GEO.php.listadrives(retorno);
	},
	/*
	Function: listaEstrelas

	Busca e insere na árvore de temas os temas que contém um certo nível de estrelas

	Parametros:

	node {objeto} - nó da árvore que foi expandido pelo usuário
	*/
	listaEstrelas: function(node){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaEstrelas()");}
		var montanos = function(retorno){
			try{
			var ig,
				montaTexto = function(ngSgrupo){
					var tempn,ngTema,tempng,mostra,d,
						lk = "",
						st,sg;
					tempn = ngSgrupo.length;
					for(sg=0;sg<tempn;sg+=1){
						ngTema = ngSgrupo[sg].temas;
						tempng = ngTema.length;
						for (st=0;st<tempng;st+=1){
							mostra = true;
							try{
								if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && ngTema[st].download === "nao")
								{mostra = false;}
								if(i3GEO.arvoreDeTemas.FILTRAOGC && ngTema[st].ogc === "nao")
								{mostra = false;}
							}
							catch(e){}
							if(mostra){
								d = i3GEO.arvoreDeTemas.montaTextoTema("gray",ngTema[st]);
								if ( ngTema[st].link !== " ")
								{lk = "<a href='"+ngTema[st].link+"' target='blank'>&nbsp;fonte</a>";}
								if(ngSgrupo[sg].subgrupo)
								{d += "<td style='text-allign:left'> ("+(ngSgrupo[sg].subgrupo)+") "+lk+"</td>";}
								else
								{d += "<td style='text-allign:left'> ("+(ngSgrupo[sg].grupo)+")"+lk+"</td>";}
								tempNode = new YAHOO.widget.HTMLNode({html:d,expanded:false,isLeaf:true,enableHighlight:false}, node);
							}
							conta += 1;
						}
					}
				};
			if(!retorno.data)
			{alert("Ocorreu um erro");}
			else{
				retorno = retorno.data;
				conta = 0;
				if ((retorno !== "erro") && (typeof(retorno) !== 'undefined')){
					ig = retorno.length-1;
					if(ig >= 0){
						do{
							montaTexto([retorno[ig]]);
							montaTexto(retorno[ig].subgrupos);
						}
						while(ig--);
					}
					else{
						tempNode = new YAHOO.widget.HTMLNode({html:"<span style='color:red'>Nada encontrado<br><br></span>",isLeaf:true,expanded:false,enableHighlight:false}, node);
					}
				}
			}
			node.loadComplete();
		}
		catch(e){}
		};
		i3GEO.php.procurartemasestrela(montanos,node.data.nivel,i3GEO.arvoreDeTemas.FATORESTRELA*1);
	},
	/*
	Function: cria

	Cria a árvore com os menus disponíveis.

	A árvore contém opcionalmente a opção de busca, os ícones adicionais e a lista de sistemas.

	Ao ser criada, os parâmetros utilizados são armazenados em variáveis que podem ser acessadas com
	i3geo.arvoreDeTemas.[ATIVATEMA,OPCOESADICIONAIS,IDHTML,LOCAPLIC,SID]

	Parametros:

	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	idhtml - {String} Id do elemento onde a árvore será inserida. Se for vazio, será utilizado o ID definido em IDHTML

	funcaoTema - {String} (opcional) Nome da função que será executada quando o usuário clicar no checkbox de um tema

	objOpcoes - {Object} (opcional) Objeto com as opções necessárias para criação dos ícones com as opções adicionais de adição de temas

	tipoBotao - {String} (opcional) checkbox|radio|download tipo de botão que será mostrado para o usuário escolher o tema
	*/
	cria: function(g_sid,g_locaplic,idhtml,funcaoTema,objOpcoes,tipoBotao) {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.cria()");}
		if(i3GEO.arvoreDeTemas.ARVORE){return;}
		if(!idhtml)
		{idhtml = "";}
		if(idhtml !== "")
		{i3GEO.arvoreDeTemas.IDHTML = idhtml;}
		if(!funcaoTema)
		{funcaoTema = "";}
		if(funcaoTema !== "")
		{i3GEO.arvoreDeTemas.ATIVATEMA = funcaoTema;}
		if(!objOpcoes)
		{objOpcoes = "";}
		if(objOpcoes !== "")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS = objOpcoes;}
		if(!tipoBotao)
		{tipoBotao = "";}
		if(tipoBotao !== "")
		{i3GEO.arvoreDeTemas.TIPOBOTAO = tipoBotao;}

		i3GEO.arvoreDeTemas.LOCAPLIC = g_locaplic;
		i3GEO.arvoreDeTemas.SID = g_sid;
		if(i3GEO.arvoreDeTemas.IDHTML === ""){return;}
		i3GEO.arvoreDeTemas.listaMenus(g_sid,g_locaplic,"i3GEO.arvoreDeTemas.montaArvore");
	},
	/*
	Function: atualiza

	Refaz a árvore atual
	*/
	atualiza: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.atualiza()");}
		i3GEO.arvoreDeTemas.ARVORE = null;
		i3GEO.arvoreDeTemas.cria(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,i3GEO.arvoreDeTemas.IDHTML);
	},
	/*
	Function: montaArvore

	Monta a árvore incluindo os nós do primeiro nível. 

	A opção de carga dinâmica dos nós filhos é definida para a montagem dos grupos.
	*/
	montaArvore: function() {
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.montaArvore()");}
		var tempNode,tempNode1,retorno,root,insp,outrasOpcoes,dados,c,i,j,conteudo,editor;
		(function(){
			function changeIconMode(){
				buildTree();
			}
			function buildTree(){
				i3GEO.arvoreDeTemas.ARVORE = new YAHOO.widget.TreeView(i3GEO.arvoreDeTemas.IDHTML);
			}
			buildTree();
		})();
		//opção de busca de temas
		root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluibusca === true){
			insp = "<br><br><table><tr>" +
			"<td><span style='font-size:12px'>&nbsp;"+$trad("a1")+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=31' >&nbsp;&nbsp;&nbsp;</a></span></td>" +
			"<td><input onclick='javascript:this.select();' class='digitar' type='text' id='i3geo_buscatema' size='15' value=''  /></td>" +
			"<td><img  class='tic' ";
			if(navm){insp += "style='top:0px;'";}
			else
			{insp += "style='top:4px;'";}
			insp += " src='"+i3GEO.util.$im("branco.gif")+"' onclick='i3GEO.arvoreDeTemas.buscaTema2(document.getElementById(\"i3geo_buscatema\").value)' /></td>";
			insp += "</tr></table>&nbsp;";
			tempNode = new YAHOO.widget.HTMLNode(
				{html:insp,enableHighlight:false,expanded:false,hasIcon:false},
				root
			);
		}
		//icones com as outras opções
		//conforme definido em i3GEO.arvoreDeTemas.OPCOESADICIONAIS
		outrasOpcoes = i3GEO.arvoreDeTemas.outrasOpcoesHTML();
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde !== "")
		{document.getElementById(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde).innerHTML = outrasOpcoes;}
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore === true){
			tempNode = new YAHOO.widget.HTMLNode(
				{html:outrasOpcoes+"&nbsp;<br>",isLeaf:true,enableHighlight:false,expanded:false,hasIcon:false},
				root
			);
		}
		//
		//opções para abrir o sistema de administração
		//
		if(i3GEO.parametros.editor === "sim"){
			tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<a style='color:red' title='opção visível apenas para editores' href='../admin' target=blank >Sistema de administração</a>",
					idmenu:"",enableHighlight:false,expanded:false
				},
				root
			);
			tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<a style='color:red' title='opção visível apenas para editores' href='../admin/html/arvore.html' target=blank >Editar árvore</a>",
					idmenu:"",enableHighlight:false,expanded:false
				},
				root
			);
			tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<span style='color:red;cursor:pointer' title='opção visível apenas para editores' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""+i3GEO.configura.locaplic+"/admin/html/menus.html\")' target=blank >Editar menus</span>",
					idmenu:"",enableHighlight:false,expanded:false
				},
				root
			);
		}
		//
		//abrir no google earth
		//
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.googleearth === true){
			tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<a href='"+i3GEO.configura.locaplic+"/kml.php?tipoxml=kml' target=blank > <img src='"+i3GEO.configura.locaplic+"/imagens/visual/default/branco.gif' class='abregoogleearth'> "+$trad("a13")+"</a>",
					idmenu:"",enableHighlight:false,expanded:false
				},
				root
			);
		}
		//
		//wms
		//
		if(i3GEO.arvoreDeTemas.INCLUIWMS === true){
			if(i3GEO.parametros.editor === "sim")
			{editor = "<img title='Editar lista' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""+i3GEO.configura.locaplic+"/admin/html/webservices.html?tipo=WMS\")' style='width:11px;position:relative;left:3px' src='"+i3GEO.configura.locaplic+"/imagens/edit.gif' />";}
			else
			{editor = "";}
			tempNode = new YAHOO.widget.HTMLNode(
				{
					html:"<b>&nbsp;OGC-WMS</b>"+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=33' >&nbsp;&nbsp;&nbsp;</a>"+editor,
					idwms:"raiz",expanded:false,enableHighlight:false
				},
				root
			);
			tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaWMS, 1);
		}
		//
		//estrelas
		//
		if(i3GEO.arvoreDeTemas.INCLUIESTRELAS === true){
			tempNode = new YAHOO.widget.HTMLNode(
				{expanded:false,html:"<b>&nbsp;"+$trad("t46")+"</b> <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=95' >&nbsp;&nbsp;&nbsp;</a>",enableHighlight: false},
				root
			);
			ig=5;
			do{
				tempNode1 = new YAHOO.widget.HTMLNode(
					{expanded:false,html:"<img src='"+$im("e"+ig+".png")+"' />",enableHighlight: false,nivel:ig},
					tempNode
				);
				tempNode1.setDynamicLoad(i3GEO.arvoreDeTemas.listaEstrelas,1);
				ig -= 1;
			}
			while(ig > 0);
		}
		//
		//adiciona na árvore a raiz de cada menu
		//
		dados = i3GEO.arvoreDeTemas.MENUS;
		c = dados.length;
		for (i=0, j=c; i<j; i+=1)
		{
			if(!dados[i].nomemenu)
			{dados[i].nomemenu = dados[i].idmenu;}
			if(i3GEO.parametros.editor === "sim")
			{editor = "<img title='Editar grupos' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""+i3GEO.configura.locaplic+"/admin/html/arvore.html?id_menu="+dados[i].idmenu+"\")' style='width:11px;position:relative;left:3px;top:2px;' src='"+i3GEO.configura.locaplic+"/imagens/edit.gif' />";}
			else
			{editor = "";}
			if(!dados[i].publicado){dados[i].publicado = "sim";}
			if(dados[i].publicado.toLowerCase() !== "nao")
			{conteudo = "<b>&nbsp;<span title='"+(dados[i].desc)+"'>"+dados[i].nomemenu+"</span>"+editor;}
			else
			{conteudo = "<b>&nbsp;<span title='nao publicado' ><s>"+dados[i].nomemenu+"</s></span>"+editor;}
			tempNode = new YAHOO.widget.HTMLNode(
				{html:conteudo,idmenu:dados[i].idmenu,enableHighlight:false,expanded:false},
				root
			);
			tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaGrupos, 1);
			if(dados[i].status === "aberto")
			{tempNode.expand();}
		}
		if(i3GEO.arvoreDeTemas.INCLUISISTEMAS){
			retorno = function(){
				var sis,iglt,tempNode,ig,nomeSis,sisNode,funcoes,tempf,ig2,abre,nomeFunc;
				try{
					sis = i3GEO.arvoreDeTemas.SISTEMAS;
					iglt = sis.length;
					tempNode = new YAHOO.widget.HTMLNode(
						{
							html:"<b>Sistemas</b>"+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=34' >&nbsp;&nbsp;&nbsp;</a>",
							expanded:false,enableHighlight:false
						},
						root
					);
				}catch(e){i3GEO.arvoreDeTemas.ARVORE.draw();return;}
				ig=0;
				do{
					nomeSis = sis[ig].NOME;
					if(sis[ig].PUBLICADO){
						if(sis[ig].PUBLICADO.toLowerCase() === "nao")
						{nomeSis = "<s>"+sis[ig].NOME+"</s>";}
					}
					sisNode = new YAHOO.widget.HTMLNode(
						{html:nomeSis,expanded:false,enableHighlight:false},
						tempNode
					);
					funcoes = sis[ig].FUNCOES;
					tempf = funcoes.length;
					for (ig2=0;ig2<tempf;ig2+=1){
						abre = "i3GEO.janela.cria('"+(funcoes[ig2].W)+"px','"+(funcoes[ig2].H)+"px','"+(funcoes[ig2].ABRIR)+"','','','Sistemas')";
						nomeFunc = "<a href='#' onclick=\""+abre+"\">"+funcoes[ig2].NOME+"</a>";
						new YAHOO.widget.HTMLNode(
							{html:nomeFunc,expanded:false,enableHighlight:false,isLeaf:true},
							sisNode
						);
					}
					ig+=1;
				}
				while(ig<iglt);
				if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir === false)
				{i3GEO.arvoreDeTemas.ARVORE.draw();}
				else
				{i3GEO.arvoreDeTemas.adicionaNoNavegacaoDir();}
			};
			i3GEO.arvoreDeTemas.listaSistemas(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,retorno);
		}
		document.getElementById(i3GEO.arvoreDeTemas.IDHTML).style.textAlign="left";
		if(!i3GEO.arvoreDeTemas.INCLUISISTEMAS){
			if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir === false)
			{i3GEO.arvoreDeTemas.ARVORE.draw();}
			else
			{i3GEO.arvoreDeTemas.adicionaNoNavegacaoDir();}
		}
	},
	adicionaNoNavegacaoDir: function(){
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir === true){
			var temp = function(){
				var drives,iglt,ig,drive,tempNode;
				drives = i3GEO.arvoreDeTemas.DRIVES;
				if(drives == undefined || drives == "" || drives.length === 0){
					i3GEO.arvoreDeTemas.ARVORE.draw();
					return;
				}
				iglt = drives.length;
				tempNode = new YAHOO.widget.HTMLNode(
					{
						html:"&nbsp;"+$trad("a6")+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=32' >&nbsp;&nbsp;&nbsp;</a>",
						enableHighlight:false,expanded:false
					},
					i3GEO.arvoreDeTemas.ARVORE.getRoot()
				);
				ig=0;
				do{
					drive = new YAHOO.widget.HTMLNode(
						{html:drives[ig].nome,caminho:drives[ig].caminho,enableHighlight:false,expanded:false},
						tempNode
					);
					drive.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir, 1);
					ig+=1;
				}
				while(ig<iglt);
				i3GEO.arvoreDeTemas.ARVORE.draw();
			};
			i3GEO.arvoreDeTemas.listaDrives(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,temp);
		}	
	},
	/*
	Function: montaGrupos

	Monta a lista de grupos de um nó principal da árvore. 

	A opção de carga dinâmica dos nós filhos é definida para a montagem dos sub-grupos.
	*/
	montaGrupos: function(node){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.montaGrupos()");}
		var temp=function(){
			var grupos,c,raiz,nraiz,mostra,i,d,editor;
			grupos = i3GEO.arvoreDeTemas.GRUPOS.grupos;
			c = grupos.length - 3;
			raiz = grupos[c].temasraiz;
			nraiz = raiz.length;
			for (i=0;i<nraiz; i+=1){
				mostra = true;
				if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && raiz[i].download === "nao")
				{mostra = false;}
				if(i3GEO.arvoreDeTemas.FILTRAOGC && raiz[i].ogc === "nao")
				{mostra = false;}
				if(mostra && raiz[i].nome != ""){
					tempNode = new YAHOO.widget.HTMLNode(
						{isLeaf:false,enableHighlight:false,expanded:false,html:i3GEO.arvoreDeTemas.montaTextoTema("gray",raiz[i])},
						node
					);
				}
			}
			for (i=0;i<c; i+=1){
				mostra = true;
				if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && grupos[i].download === "nao")
				{mostra = false;}
				if(i3GEO.arvoreDeTemas.FILTRAOGC && grupos[i].ogc === "nao")
				{mostra = false;}
				if(i3GEO.parametros.editor === "sim")
				{editor = "<img title='Editar subgrupos' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""+i3GEO.configura.locaplic+"/admin/html/arvore.html?id_menu="+node.data.idmenu+"&id_grupo="+grupos[i].id_n1+"\")' style='width:11px;position:relative;left:3px;top:2px;' src='"+i3GEO.configura.locaplic+"/imagens/edit.gif' />";}
				else
				{editor = "";}
				if(mostra && grupos[i].nome != undefined ){
					//se id_n1 existir, significa que os grupos possuem id, pois são oriundos do sistema
					//de administração
					//no caso do uso de menu de temas com base em arquivos xml, o id não existe
					//sendo necessário o uso da ordem dos grupos como identificador
					if(grupos[i].publicado){
						if(grupos[i].publicado === "NAO"){
							grupos[i].nome = "<span title='nao publicado' ><s>"+grupos[i].nome+"</s></span>";
						}
					}
					d = {html:grupos[i].nome+editor,idmenu:node.data.idmenu,idgrupo:i};
					if(grupos[i].id_n1)
					{d = {html:grupos[i].nome+editor,idmenu:node.data.idmenu,idgrupo:grupos[i].id_n1};}
					tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
					tempNode.enableHighlight = false;
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaSubGrupos, 1);
					tempNode.isLeaf = false;
				}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaGrupos(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,temp);
	},
	/*
	Function: montaSubGrupos

	Monta a lista de sub-grupos de um nó do tipo grupo. 

	A opção de carga dinâmica dos nós filhos é definida para a montagem dos temas.
	*/
	montaSubGrupos: function(node){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.montaSubGrupos()");}
		var temp=function(){
			var i,c,mostra,d,tempNode,nraiz,subgrupos,raiz;
			subgrupos = i3GEO.arvoreDeTemas.SUBGRUPOS.subgrupo;
			c = subgrupos.length;
			raiz = i3GEO.arvoreDeTemas.SUBGRUPOS.temasgrupo;
			nraiz = raiz.length;
			for (i=0;i<nraiz; i+=1){
				mostra = true;
				if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && raiz[i].download === "nao")
				{mostra = false;}
				if(i3GEO.arvoreDeTemas.FILTRAOGC && raiz[i].ogc === "nao")
				{mostra = false;}
				if(mostra){
					tempNode = new YAHOO.widget.HTMLNode(
						{
							nacessos:raiz[i].nacessos,
							html:i3GEO.arvoreDeTemas.montaTextoTema("gray",raiz[i]),
							idtema:raiz[i].tid,
							fonte:raiz[i].link,
							ogc:raiz[i].ogc,
							kmz:raiz[i].kmz,
							permitecomentario:raiz[i].permitecomentario,
							download:raiz[i].download,
							expanded:false,
							enableHighlight:false,
							isLeaf:false
						},
						node
					);
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.propTemas, 1);
				}
			}
			for (i=0;i<c; i+=1){
				mostra = true;
				if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && subgrupos[i].download === "nao")
				{mostra = false;}
				if(i3GEO.arvoreDeTemas.FILTRAOGC && subgrupos[i].ogc === "nao")
				{mostra = false;}
				if(i3GEO.parametros.editor === "sim")
				{editor = "<img title='Editar temas' onclick='i3GEO.arvoreDeTemas.abrejanelaIframe(\"900\",\"500\",\""+i3GEO.configura.locaplic+"/admin/html/arvore.html?id_menu="+node.data.idmenu+"&id_grupo="+node.data.idgrupo+"&id_subgrupo="+subgrupos[i].id_n2+"\")' style='width:11px;position:relative;left:3px;top:2px;' src='"+i3GEO.configura.locaplic+"/imagens/edit.gif' />";}
				else
				{editor = "";}
				if(mostra && subgrupos[i].nome != undefined ){
					//se id_n2 existir, significa que os grupos possuem id, pois são oriundos do sistema
					//de administração
					//no caso do uso de menu de temas com base em arquivos xml, o id não existe
					//sendo necessário o uso da ordem dos grupos como identificador
					if(subgrupos[i].publicado){
						if(subgrupos[i].publicado === "NAO"){
							subgrupos[i].nome = "<span title='nao publicado' ><s>"+subgrupos[i].nome+"</s></span>";
						}
					}
					d = {html:subgrupos[i].nome+editor,idmenu:node.data.idmenu,idgrupo:node.data.idgrupo,idsubgrupo:i};
					if(subgrupos[i].id_n2)
					{d = {html:subgrupos[i].nome+editor,idmenu:node.data.idmenu,idgrupo:node.data.idgrupo,idsubgrupo:subgrupos[i].id_n2};}
					tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaTemas, 1);
					tempNode.isLeaf = false;
					tempNode.enableHighlight = false;
				}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaSubGrupos(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,node.data.idgrupo,temp);
	},
	/*
	Function: montaTemas

	Monta a lista de temas de um nó. 
	*/
	montaTemas: function(node){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.montaTemas()");}
		var temp=function(){
			var i,cor,temas,c,mostra,tempNode;
			temas = i3GEO.arvoreDeTemas.TEMAS.temas;
			c = temas.length;
			cor = "rgb(51, 102, 102)";
			for (i=0;i<c; i+=1){
				mostra = true;
				if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && temas[i].download === "nao")
				{mostra = false;}
				if(i3GEO.arvoreDeTemas.FILTRAOGC && temas[i].ogc === "nao")
				{mostra = false;}
				if(mostra){
					if(temas[i].publicado){
						if(temas[i].publicado === "NAO"){
							temas[i].nome = "<span title='nao publicado' ><s>"+temas[i].nome+"</s></span>";
						}
					}
					tempNode = new YAHOO.widget.HTMLNode(
						{
							nacessos:temas[i].nacessos,
							html:i3GEO.arvoreDeTemas.montaTextoTema(cor,temas[i]),
							idtema:temas[i].tid,
							fonte:temas[i].link,
							ogc:temas[i].ogc,
							kmz:temas[i].kmz,
							download:temas[i].download,
							permitecomentario:temas[i].permitecomentario,
							bookmark:"sim",
							expanded:false,
							isLeaf:false,
							enableHighlight:false
						},
						node
					);
					tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.propTemas, 1);
					cor = (cor === "rgb(51, 102, 102)") ? "rgb(47, 70, 50)" : "rgb(51, 102, 102)";
				}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaTemas(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,node.data.idgrupo,node.data.idsubgrupo,temp);
	},
	/*
	Function: montaDir

	Incluí na árvore o navegador de diretórios

	Parametro:

	node {node} - nó onde será criada a lista 
	*/
	montaDir: function(node){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.montaDir()");}
		var montaLista = function(retorno)
		{
			var ig,conteudo,dirs,tempNode,arquivos;
			dirs = retorno.data.diretorios;
			for (ig=0;ig<dirs.length;ig+=1)
			{
				tempNode = new YAHOO.widget.HTMLNode(
					{
						html:dirs[ig],
						caminho:node.data.caminho+"/"+dirs[ig],
						expanded:false,
						enableHighlight:false
					},
					node
				);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir, 1);
			}
			arquivos = retorno.data.arquivos;
			for (ig=0;ig<arquivos.length;ig+=1)
			{
				conteudo = arquivos[ig];
				if(conteudo.search(".img") > 1 || conteudo.search(".tif") > 1 || conteudo.search(".TIF") > 1 || conteudo.search(".shp") > 1 || conteudo.search(".SHP") > 1)
				{
					conteudo = "<a href='#' title='"+$trad("g2")+"' onclick='i3GEO.util.adicionaSHP(\""+node.data.caminho+"/"+conteudo+"\")' >"+conteudo+"</a>";
					new YAHOO.widget.HTMLNode(
						{isLeaf:true,enableHighlight:false,expanded:false,html:conteudo,caminho:node.data.caminho+"/"+conteudo},
						node
					);
				}
			}
			node.loadComplete();
		};
		i3GEO.php.listaarquivos(montaLista,node.data.caminho);
	},
	/*
	Function: montaTextoTema

	Monta o texto com o título do tema.

	Parametros:

	cor - {String} - cor que será utilizada no estilo "color"

	tema - {Object} - objeto JSON com as propriedades do tema

	Return:

	{String} - texto formatado
	*/
	montaTextoTema: function(cor,tema){
		var html,
			estilo = "",
			clique;
		if(navm)
		{estilo = "padding-top:1px;";}
		html = "<td style='"+estilo+"'><span>";
		if(i3GEO.arvoreDeTemas.TIPOBOTAO !== "download")
		{html += "<input title='"+tema.tid+"' style='width:12px;height:12px;cursor:pointer;border:solid 0 white;' ";}
		else
		{html += "<img title='"+tema.tid+"' src='"+$im("down1.gif")+"'";}
		if(i3GEO.arvoreDeTemas.ATIVATEMA !== "")
		{clique = "onclick=\""+i3GEO.arvoreDeTemas.ATIVATEMA+"\"";}
		else{
			if(i3GEO.arvoreDeTemas.ATIVATEMAIMEDIATO === false)
			{clique = "onclick='i3GEO.util.criaBotaoAplicar(\"i3GEO.arvoreDeTemas.adicionaTemas\",\""+$trad("p14")+"\",\"i3geoBotaoAplicar\",this)'";}
			else
			{clique = "onclick='i3GEO.arvoreDeTemas.adicionaTemas([\""+tema.tid+"\"])'";}
		}
		html += clique;
		if(i3GEO.arvoreDeTemas.TIPOBOTAO !== "download")
		{html += " type='"+i3GEO.arvoreDeTemas.TIPOBOTAO+"' value='"+tema.tid+"' />";}
		else
		{html += " /> ";}
		html += "</td><td title='"+tema.tid+"' onmouseout='javascript:this.style.color=\""+cor+"\";' onmouseover='javascript:this.style.color=\"blue\";' style='cursor:pointer;font-size:11px;text-align:left;color:"+cor+";padding-left:0px;' "+clique+">";
		html += tema.nome;
		html += "</td></span>";
		return(html);
	},
	/*
	Function: propTemas

	Monta o nó com informações adicionais sobre o tema.

	Parametro:

	node - {Object} - objeto com o nó que foi clicado
	*/
	propTemas: function(node){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.propTemas()");}
		var html,lkmini,lkmini1,lkgrcode,lkgrcode1,n,ogc;
		if(node.data.fonte && node.data.fonte !== "" && node.data.fonte !== " "){
			tempNode = new YAHOO.widget.HTMLNode(
				{isLeaf:true,enableHighlight:false,expanded:false,html:"<a title='' href='"+node.data.fonte+"' target='_blank' >Fonte</a>"},
				node
			);
		}
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.mini === true){
			lkmini = i3GEO.arvoreDeTemas.LOCAPLIC+"/testamapfile.php?map="+node.data.idtema+".map&tipo=mini";
			lkmini1 = i3GEO.arvoreDeTemas.LOCAPLIC+"/testamapfile.php?map="+node.data.idtema+".map&tipo=grande";
			new YAHOO.widget.HTMLNode(
				{isLeaf:true,enableHighlight:false,expanded:false,html:"<a title='' onmouseover='i3GEO.ajuda.mostraJanela(\"<img src="+lkmini+" />\")' href='"+lkmini1+"' target='blank' >Miniatura</a>"},
				node
			);
		}
		if (node.data.ogc && node.data.ogc !== "nao"){
			if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.kml === true){
				html = "<a href='#' title='' onclick='i3GEO.tema.dialogo.abreKml(\""+node.data.idtema+"\",\"kml\")' >Kml</a>";
				if (node.data.kmz.toLowerCase() === "sim")
				{html = "<a href='#' title='' onclick='i3GEO.tema.dialogo.abreKml(\""+node.data.idtema+"\",\"kmz\")' >Kml</a>";}
				new YAHOO.widget.HTMLNode(
					{isLeaf:true,enableHighlight:false,expanded:false,html:html},
					node
				);
			}
			ogc = i3GEO.arvoreDeTemas.LOCAPLIC+"/ogc.php?tema="+node.data.idtema+"&service=wms&request=getcapabilities";
			new YAHOO.widget.HTMLNode(
				{isLeaf:true,enableHighlight:false,expanded:false,html:"<a title='getcapabilities' href='"+ogc+"' target='blank' >WMS - OGC</a>"},
				node
			);
		}
		if(node.data.download && node.data.download.toLowerCase() !== "nao" && i3GEO.arvoreDeTemas.TIPOBOTAO !== "download"){
			html = "<a href='"+i3GEO.configura.locaplic+"/datadownload.htm?"+node.data.idtema+"' target='_blank'>Download</a>";
			new YAHOO.widget.HTMLNode(
				{isLeaf:true,enableHighlight:false,expanded:false,html:html},
				node
			);
		}		
		if (node.data.permitecomentario && node.data.permitecomentario !== "nao" && i3GEO.arvoreDeTemas.OPCOESADICIONAIS.comentarios === true){
			html = "<a href='#' title='' onclick='i3GEO.tema.dialogo.comentario(\""+node.data.idtema+"\",\"comentario\")' >Comentário</a>";
			new YAHOO.widget.HTMLNode(
				{isLeaf:true,enableHighlight:false,expanded:false,html:html},
				node
			);
		}
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.qrcode === true){
			lkgrcode = i3GEO.arvoreDeTemas.LOCAPLIC+"/pacotes/qrcode/php/qr_html.php?d="+i3GEO.arvoreDeTemas.LOCAPLIC+"/ms_criamapa.php?interface=openlayers_t.htm&temasa="+node.data.idtema+"&layers="+node.data.idtema;
			lkgrcode1 = i3GEO.arvoreDeTemas.LOCAPLIC+"/pacotes/qrcode/php/qr_img.php?d="+i3GEO.arvoreDeTemas.LOCAPLIC+"/ms_criamapa.php?interface=openlayers_t.htm&temasa="+node.data.idtema+"&layers="+node.data.idtema;
			new YAHOO.widget.HTMLNode(
				{isLeaf:true,enableHighlight:false,expanded:false,html:"<a title='' onmouseover='i3GEO.ajuda.mostraJanela(\"<img src="+lkgrcode1+" />\")' href='"+lkgrcode+"' target='blank' >Qrcode</a>"},
				node
			);
		}
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.estrelas === true){
			n = parseInt(node.data.nacessos / (i3GEO.arvoreDeTemas.FATORESTRELA*1),10);
			if(n >= 5){n = 5;}
			html = (n > 0) ? "<img src='"+i3GEO.util.$im("e"+n+".png")+"'/>" : "<img src='"+i3GEO.util.$im("e0.png")+"'/>";
			new YAHOO.widget.HTMLNode({isLeaf:true,enableHighlight:false,expanded:false,html:html}, node);
		}
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.bookmark === true){
			html = i3GEO.social.bookmark(i3GEO.configura.locaplic+"/ms_criamapa.php?layers="+node.data.idtema);
			new YAHOO.widget.HTMLNode({isLeaf:true,enableHighlight:false,expanded:false,html:html}, node);
		}
		node.loadComplete();
	},
	/*
	Function: outrasOpcoesHTML

	Constrói o HTML com as opções adicionais de inclusão de temas (upload de shp, etc.).

	Return:

	{String} - html gerado
	*/
	outrasOpcoesHTML: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.outrasOpcoesHTML()");}
		var ins = "",
			t = 0,
			imb = i3GEO.util.$im("branco.gif"),
			OPCOESADICIONAIS = i3GEO.arvoreDeTemas.OPCOESADICIONAIS,
			estilo = function(i){
				return " onmouseout='javascript:this.className = \""+i+" iconeMini iconeGuiaMovelMouseOut\";' onmouseover='javascript:this.className = \""+i+" iconeMini iconeGuiaMovelMouseOver\";' class='"+i+" iconeMini iconeGuiaMovelMouseOut' src='"+imb+"' style='cursor:pointer;text-align:left' ";
			};
		if(OPCOESADICIONAIS.refresh === true){
			ins += "<td><img "+estilo("refresh")+" onclick='i3GEO.arvoreDeTemas.atualiza()' title='Refresh'/></td>";
			t += 20;
		}
		if(OPCOESADICIONAIS.uploadarquivo === true){
			ins += "<td><img "+estilo("conectarwms")+" onclick='i3GEO.arvoreDeTemas.dialogo.conectaservico()' title='"+$trad("a15")+"'/></td>";
			t += 20;
			ins += "<td><img "+estilo("upload")+" onclick='i3GEO.arvoreDeTemas.dialogo.uploadarquivo()' title='"+$trad("a14")+"'/></td>";
			t += 20;
		}
		else{
			if(OPCOESADICIONAIS.uploadgpx === true){
				ins += "<td><img "+estilo("uploadgpx")+" onclick='i3GEO.arvoreDeTemas.dialogo.uploadgpx()' title='upload GPX'/></td>";
				t += 20;
			}
			if(OPCOESADICIONAIS.uploaddbf === true){
				ins += "<td><img "+estilo("uploaddbf")+" onclick='i3GEO.arvoreDeTemas.dialogo.uploaddbf()' title='"+$trad("a2b")+"'/></td>";
				t += 20;
			}
			if(OPCOESADICIONAIS.uploadlocal === true){
				ins += "<td><img "+estilo("upload")+" onclick='i3GEO.arvoreDeTemas.dialogo.upload()' title='"+$trad("a2")+"'/></td>";
				t += 20;
			}
			if(OPCOESADICIONAIS.carregaKml === true){
				ins += "<td><img "+estilo("carregarKml")+" onclick='i3GEO.arvoreDeTemas.dialogo.carregaKml()' title='Kml'/></td>";
				t += 20;
			}		
			if(OPCOESADICIONAIS.conectarwms === true){
				ins += "<td><img "+estilo("conectarwms")+" onclick='i3GEO.arvoreDeTemas.dialogo.conectarwms()' title='"+$trad("a4")+"'/></td>";
				t += 20;
			}
			if(OPCOESADICIONAIS.conectarwmst === true){
				ins += "<td><img "+estilo("conectarwmst")+" onclick='i3GEO.arvoreDeTemas.dialogo.conectarwmst()' title='"+$trad("a4b")+"'/></td>";
				t += 20;
			}
			if(OPCOESADICIONAIS.conectargeorss === true){
				ins += "<td><img "+estilo("conectargeorss")+" onclick='i3GEO.arvoreDeTemas.dialogo.conectargeorss()' title='"+$trad("a5")+"'/></td>";
				t += 20;
			}
		}
		if(OPCOESADICIONAIS.downloadbase === true){
			ins += "<td><img "+estilo("download")+" onclick='i3GEO.arvoreDeTemas.dialogo.downloadbase()' title='"+$trad("a3")+"'/></td>";
			t += 20;
		}
		if(OPCOESADICIONAIS.importarwmc === true){
			ins += "<td><img "+estilo("importarwmc")+" onclick='i3GEO.arvoreDeTemas.dialogo.importarwmc()' title='"+$trad("a3a")+"'/></td>";
			t += 20;
		}
		if(OPCOESADICIONAIS.nuvemTags === true){
			ins += "<td><img "+estilo("nuvemtags")+" onclick='i3GEO.arvoreDeTemas.dialogo.nuvemTags()' title='"+$trad("a5a")+"'/></td>";
			t += 20;
		}
		if(OPCOESADICIONAIS.nuvemTagsFlash === true){
			ins += "<td><img "+estilo("nuvemtags")+" onclick='i3GEO.arvoreDeTemas.dialogo.nuvemTagsFlash()' title='"+$trad("a5a")+"'/></td>";
			t += 20;
		}
		if(OPCOESADICIONAIS.carousel === true){
			ins += "<td><img "+estilo("carouselTemas")+" onclick='i3GEO.arvoreDeTemas.dialogo.carouselTemas()' title='Miniaturas'/></td>";
			t += 20;
		}
		if(OPCOESADICIONAIS.inde === true){
			ins += "<td><img "+estilo("buscaInde")+" onclick='i3GEO.arvoreDeTemas.dialogo.buscaInde()' title='Pesquisa na INDE'/></td>";
			t += 20;
		}
		return("<table width='"+t+"px' ><tr>"+ins+"</tr></table>");
	},
	/*
	Function: desativaCheckbox

	Desmarca todos os checkbox dos temas marcados na árvore.
	*/
	desativaCheckbox: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.desativaCheckbox()");}
		var o,inputs,n,i;
		o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
		inputs = o.getElementsByTagName("input");
		n = inputs.length;
		i=0;
		do{
			inputs[i].checked = false;
			i+=1;
		}
		while(i<n);
	},
	/*
	Function: listaTemasAtivos

	Lista os temas com checkbox marcados.

	Return:
	{Array} - array com os códigos dos temas
	*/
	listaTemasAtivos: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.listaTemasAtivos()");}
		var o,inputs,n,i,lista;
		o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
		inputs = o.getElementsByTagName("input");
		n = inputs.length;
		i=0;
		lista = [];
		do{
			if(inputs[i].checked === true)
			{lista.push(inputs[i].value);}
			i+=1;
		}
		while(i<n);
		return (lista);
	},
	/*
	Depreciado na versão 4.4

	Procura temas na árvore de temas (a busca é feita no servidor e não na árvore atual).

	Parametro:

	palavra {String}
	*/
	buscaTema: function(palavra){
		if(palavra === ""){return;}
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.buscaTema()");}
		var busca,root,nodePalavra = "";
		resultadoProcurar = function(retorno)
		{
			var mostra,tempNode,d,conta,ig,ngSgrupo,tempn,sg,ngTema,tempng,st,lk = "";
			if(!retorno.data)
			{alert("Ocorreu um erro");}
			else{
				retorno = retorno.data;
				conta = 0;
				if ((retorno !== "erro") && (typeof(retorno) !== 'undefined')){
					ig = retorno.length-1;
					if(ig >= 0){
						do{
							ngSgrupo = retorno[ig].subgrupos;
							tempn = ngSgrupo.length;
							for (sg=0;sg<tempn;sg+=1){
								ngTema = ngSgrupo[sg].temas;
								tempng = ngTema.length;
								for (st=0;st<tempng;st+=1){
									mostra = true;
									if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && ngTema[st].download === "nao")
									{mostra = false;}
									if(i3GEO.arvoreDeTemas.FILTRAOGC && ngTema[st].ogc === "nao")
									{mostra = false;}
									if(mostra){
										d = i3GEO.arvoreDeTemas.montaTextoTema("gray",ngTema[st]);
										if ( ngTema[st].link !== " ")
										{lk = "<a href='"+ngTema[st].link+"' target='blank'>&nbsp;fonte</a>";}
										d += "<td style='text-allign:left'> ("+(ngSgrupo[sg].subgrupo)+") "+lk+"</td>";
										tempNode = new YAHOO.widget.HTMLNode(d, nodePalavra, false,true);
										tempNode.isLeaf = true;
										tempNode.enableHighlight = false;
									}
									conta+=1;
								}
							}
						}
						while(ig--);
					}
					else{
						d = "<span style='color:red'>Nada encontrado<br><br></span>";
						tempNode = new YAHOO.widget.HTMLNode(d, nodePalavra, false,true);
						tempNode.isLeaf = true;
						tempNode.enableHighlight = false;
					}
				}
			}
			nodePalavra.loadComplete();
		};
		//
		//funcao que será executada para buscar os temas
		//
		busca = function(){
			i3GEO.php.procurartemas2(resultadoProcurar,i3GEO.util.removeAcentos(palavra));
		};
		//
		//recolhe todos os nós e acrescenta um novo
		//
		i3GEO.arvoreDeTemas.ARVORE.collapseAll();
		root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if(!i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados")){
			tempNode = new YAHOO.widget.HTMLNode(
				{html:"Temas encontrados",id:"temasEncontrados"},
				root,
				false,
				true
			);
			tempNode.enableHighlight = false;
		}
		else
		{tempNode = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados");}
		nodePalavra = new YAHOO.widget.HTMLNode({html:palavra}, tempNode, false,true);
		nodePalavra.enableHighlight = false;
		i3GEO.arvoreDeTemas.ARVORE.draw();
		tempNode.expand();
		nodePalavra.setDynamicLoad(busca, 1);
		nodePalavra.expand();
	},
	/*
	Function: buscaTema2

	Procura temas na árvore de temas (a busca é feita no servidor e não na árvore atual).

	Parametro:

	palavra {String}
	*/
	buscaTema2: function(palavra){
		if(palavra === ""){return;}
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.buscaTema()");}
		var busca,root,nodePalavra = "";
		resultadoProcurar = function(retorno)
		{
			var ig,
				montaTexto = function(ngSgrupo){
					var tempn,ngTema,tempng,mostra,d,lk = "",st,sg;
					tempn = ngSgrupo.length;
					for(sg=0;sg<tempn;sg+=1){
						ngTema = ngSgrupo[sg].temas;
						tempng = ngTema.length;
						for (st=0;st<tempng;st+=1){
							mostra = true;
							try{
								if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD && ngTema[st].download === "nao")
								{mostra = false;}
								if(i3GEO.arvoreDeTemas.FILTRAOGC && ngTema[st].ogc === "nao")
								{mostra = false;}
							}
							catch(e){}
							if(mostra){
								d = i3GEO.arvoreDeTemas.montaTextoTema("gray",ngTema[st]);
								if ( ngTema[st].link !== " ")
								{lk = "<a href='"+ngTema[st].link+"' target='blank'>&nbsp;fonte</a>";}
								if(ngSgrupo[sg].subgrupo)
								{d += "<td style='text-allign:left'> ("+(ngSgrupo[sg].subgrupo)+") "+lk+"</td>";}
								else
								{d += "<td style='text-allign:left'> ("+(ngSgrupo[sg].grupo)+")"+lk+"</td>";}
								new YAHOO.widget.HTMLNode({enableHighlight:false,isLeaf:true,html:d,expanded:false}, nodePalavra);
							}
							conta+=1;
						}
					}
				};
			if(!retorno.data)
			{alert("Ocorreu um erro");}
			else{
				retorno = retorno.data;
				conta = 0;
				if ((retorno !== "erro") && (typeof(retorno) !== 'undefined')){
					ig = retorno.length-1;
					if(ig >= 0){
						do{
							montaTexto([retorno[ig]]);
							montaTexto(retorno[ig].subgrupos);
						}
						while(ig--);
					}
					else{
						new YAHOO.widget.HTMLNode({enableHighlight:false,isLeaf:true,expanded:false,html:"<span style='color:red'>Nada encontrado<br><br></span>"}, nodePalavra);
					}
				}
			}
			nodePalavra.loadComplete();
		};

		//
		//funcao que será executada para buscar os temas
		//
		busca = function(){
			i3GEO.php.procurartemas2(resultadoProcurar,i3GEO.util.removeAcentos(palavra));
		};
		//
		//recolhe todos os nós e acrescenta um novo
		//
		i3GEO.arvoreDeTemas.ARVORE.collapseAll();
		root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if(!i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados")){
			tempNode = new YAHOO.widget.HTMLNode(
				{enableHighlight:false,expanded:false,html:"Temas encontrados",id:"temasEncontrados"},
				root
			);
		}
		else
		{tempNode = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados");}
		nodePalavra = new YAHOO.widget.HTMLNode({enableHighlight:false,expanded:false,html:palavra}, tempNode);
		i3GEO.arvoreDeTemas.ARVORE.draw();
		tempNode.expand();
		nodePalavra.setDynamicLoad(busca, 1);
		nodePalavra.expand();
	},
	/*
	Function: adicionaTemas

	Adiciona ao mapa os temas selecionados na árvore

	Parametro:

	tsl {array} - (opcional) código do tema que será adicionado ao mapa. Se não for especificado, a lista de códigos será obtida da árvore de temas
	*/
	adicionaTemas: function(tsl){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.adicionaTemas()");}
		var temp;
		//
		//zera o contador de tempo
		//
		try{
			clearTimeout(tempoBotaoAplicar);
		}catch(e){}
		tempoBotaoAplicar = "";
		i3GEO.mapa.ativaTema("");
		//
		//pega os temas ativados na árvore de menus
		//
		if(arguments.length !== 1)
		{tsl = i3GEO.arvoreDeTemas.listaTemasAtivos();}
		//i3GEO.arvoreDeTemas.desativaCheckbox();
		//
		//se forem encontrados temas ativos na árvore de menus, o mapa é redesenhado com a adição de novos temas
		//
		//verifica se o tema já existe no mapa
		//
		if(tsl.length === 1 && i3GEO.arvoreDeCamadas.pegaTema(tsl[0]) !== ""){
			temp = window.confirm("O tema já existe no mapa. Adiciona novamente?");
			if(!temp){return;}
		}
		if(tsl.length > 0){
			temp = function(retorno){
				i3GEO.atualiza();
				//
				//verifica se deve ser ativada uma outra guia que não a atual
				//
				if(i3GEO.arvoreDeTemas.RETORNAGUIA !== ""){
					if(i3GEO.arvoreDeTemas.RETORNAGUIA !== i3GEO.guias.ATUAL){
						i3GEO.guias.escondeGuias();
						i3GEO.guias.mostra(i3GEO.arvoreDeTemas.RETORNAGUIA);
					}
				}
				//
				//verifica se a janela da ferramenta identifica está ativa para atualizar a lista de temas
				//
				try{
					if($i("i3GEOidentificalistaTemas")){
						i3GEOF.identifica.listaTemas();
						g_tipoacao = "identifica";
					}
				}
				catch(r){
					if(typeof(console) !== 'undefined'){console.error(r);}
				}
			};
			i3GEO.php.adtema(temp,tsl.toString());
		}
	},
	/*
	Function: comboMenus

	Busca a lista de menus existentes no i3geo e monta um combo com o resultado.

	Ao escolher uma opção do combo, a função de retorno receberá como parâmetro o id do menu.

	Parametros:

	locaplic {String} - endereço do i3geo

	funcaoOnchange {String} - nome da funcao que será executada quando o usuário escolhe um grupo

	idDestino {String} - id do elemento HTML que receberá o combo

	idCombo {String} - id do combo que será criado

	largura {Numeric} - largura em pixels do combo

	altura {Numeric} - altura do combo em linhas
	*/
	comboMenus: function(locaplic,funcaoOnchange,idDestino,idCombo,largura,altura){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.comboMenus()");}
		i3GEO.configura.locaplic = locaplic;
		var combo = function (retorno){
			var ob,ins,ig;
			ob = retorno.data;
			ins = "<select id='"+idCombo+"' SIZE="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"(this.value)' ><option value='' >Escolha um menu:</option>";
			for (ig=0;ig<ob.length; ig+=1){
				if(ob[ig].publicado !== "nao" && ob[ig].publicado !== "NAO"){
					if(ob[ig].nomemenu)
					{ins += "<option value="+ob[ig].idmenu+" >"+ob[ig].nomemenu+"</option>";}
				}
			}
			$i(idDestino).innerHTML = ins+"</select>";
		};
		i3GEO.php.pegalistademenus(combo);
	},
	/*
	Function: comboGruposMenu

	Busca a lista de grupos existentes no menu de temas do i3geo e monta um combo com o resultado.

	Ao escolher uma opção do combo, a função de retorno receberá como parâmetro o id do grupo.

	Parametros:

	locaplic {String} - endereço do i3geo

	funcaoOnchange {String} - nome da funcao que será executada quando o usuário escolhe um grupo

	idDestino {String} - id do elemento HTML que receberá o combo

	idCombo {String} - id do combo que será criado

	largura {Numeric} - largura em pixels do combo

	altura {Numeric} - altura do combo em linhas

	id_menu {Numeric} - id do menu que será utilizado para obter os dados
	*/
	comboGruposMenu: function(locaplic,funcaoOnchange,idDestino,idCombo,largura,altura,id_menu){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.comboGruposMenu()");}
		i3GEO.configura.locaplic = locaplic;
		i3GEO.arvoreDeTemas.temasRaizGrupos = [];
		var combo = function (retorno){
			var ins,ig,
				obGrupos = retorno.data;
			ins = "<select id='"+idCombo+"' SIZE="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"(this.value)' ><option value='' >Escolha um grupo:</option>";
			for (ig=0;ig<obGrupos.grupos.length; ig+=1){
				if(obGrupos.grupos[ig].nome)
				{ins += "<option value="+obGrupos.grupos[ig].id_n1+" >"+obGrupos.grupos[ig].nome+"</option>";}
				i3GEO.arvoreDeTemas.temasRaizGrupos[obGrupos.grupos[ig].id_n1] = obGrupos.grupos[ig].temasgrupo;
			}
			$i(idDestino).innerHTML = ins+"</select>";
		};
		i3GEO.php.pegalistadegrupos(combo,id_menu,"nao");
	},
	/*
	Function: comboSubGruposMenu

	Monta um combo com a lista de subgrupos de um grupo do menu de temas do i3geo.

	Ao escolher um subgrupo, a função de retorno receberá o id do grupo e o id do subgrupo.

	Parametros:

	locaplic {String} - endereço do i3geo

	funcaoOnchange {String} - nome da funcao que será executada quando o usuário escolhe um grupo

	idDestino {String} - id do elemento HTML que receberá o combo

	idCombo {String} - id do combo que será criado

	idGrupo {String} - identificador do grupo que será pesquisado

	largura {Numeric} - largura em pixels do combo

	altura {Numeric} - altura do combo em linhas
	*/
	comboSubGruposMenu: function(locaplic,funcaoOnchange,idDestino,idCombo,idGrupo,largura,altura){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.comboSubGruposMenu()");}
		if(idGrupo !== ""){
			var combo = function(retorno){
				var ins,sg,ig;
				ins = "<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"(\""+idGrupo+"\",this.value)' ><option value='' >Escolha um sub-grupo:</option>";
				if (retorno.data.subgrupo){
					sg = retorno.data.subgrupo;
					for (ig=0;ig<sg.length; ig+=1){
						ins += "<option value="+sg[ig].id_n2+" >"+sg[ig].nome+"</option>";
					}
				}
				$i(idDestino).innerHTML = ins+"</select>";
			};
			i3GEO.php.pegalistadeSubgrupos(combo,"",idGrupo);
		}
	},
	/*
	Function: comboTemasMenu

	Monta um combo com a lista de temas do i3geo.

	Parametros:

	locaplic {String} - endereço do i3geo

	funcaoOnchange - nome da funcao que será executada quando o usuário escolhe um grupo

	idDestino - id do elemento HTML que receberá o combo

	idCombo - id do combo que será criado

	idGrupo - identificador do grupo que será pesquisado

	idSubGrupo - id do subgrupo

	largura - largura em pixels do combo

	altura - altura do combo em linhas

	id_menu - id do menu escolhido

	temas - (opcional) objeto contendo a lista de temas
	*/
	comboTemasMenu: function(locaplic,funcaoOnchange,idDestino,idCombo,idGrupo,idSubGrupo,largura,altura,id_menu,temas){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.arvoreDeTemas.comboTemasMenu()");}
		var combo = function(retorno){
			var ins,sg,ig;
			if(idSubGrupo != "")
			{ins = "<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"("+idGrupo+","+idSubGrupo+",this.value)' ><option value='' >Escolha um tema:</option>";}
			else
			{ins = "<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"("+idGrupo+",\"\",this.value)' ><option value='' >Escolha um tema:</option>";}
			
			if(typeof(retorno.data) !== 'undefined')
			{retorno = retorno.data.temas;}
			sg = retorno.length;
			for (ig=0;ig<sg; ig+=1){
				ins += "<option value="+retorno[ig].tid+" >"+retorno[ig].nome+"</option>";
			}
			$i(idDestino).innerHTML = ins+"</select>";
		};
		if(typeof(temas) === 'undefined' || temas === "")
		{i3GEO.php.pegalistadetemas(combo,id_menu,idGrupo,idSubGrupo);}
		else
		{combo(temas);}
	},
	/*
	Classe: dialogo

	Abre as janelas de diálogo com as opções adicionais que permitem acrescentar temas ao mapa

	Por exemplo, para abrir a janela de upload de arquivos dbf, utilize

	i3GEO.arvoreDeTemas.dialogo.uploaddbf()
	*/
	dialogo:{
		/*
		Function: uploadarquivo

		Abre uma janela flutunate que permite abrir outras ferramentas para o upload de arquivos de determinados tipos
		*/
		uploadarquivo: function(){
			var janela,ins,titulo,cabecalho,minimiza,
				OPCOESADICIONAIS = i3GEO.arvoreDeTemas.OPCOESADICIONAIS;

			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOFuploadarquivo");
			};
			titulo = "Upload de arquivo</a>";
			janela = i3GEO.janela.cria(
				"250px",
				"150px",
				"",
				"",
				"",
				titulo,
				"i3GEOFuploadarquivo",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			$i("i3GEOFuploadarquivo_corpo").style.backgroundColor = "white";
			$i("i3GEOFuploadarquivo_corpo").style.overflow = "hidden";
			ins = "" +
			"	<p class=paragrafo style='width:90%' ><b>Tipo de arquivo</b><br><br>" +
			"	<table class=lista6 style=left:20px;position:relative >";
			if(OPCOESADICIONAIS.uploadlocal === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivo onclick='i3GEO.arvoreDeTemas.dialogo.upload()' /></td>" +
				"			<td>Shape file</td>" +
				"		</tr>";
			}
			if(OPCOESADICIONAIS.uploaddbf === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivo onclick='i3GEO.arvoreDeTemas.dialogo.uploaddbf()' /></td>" +
				"			<td>DBF ou CSV</td>" +
				"		</tr>";
			}
			if(OPCOESADICIONAIS.uploadgpx === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivo onclick='i3GEO.arvoreDeTemas.dialogo.uploadgpx()' /></td>" +
				"			<td>GPX</td>" +
				"		</tr>" +
				"		<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivo onclick='i3GEO.arvoreDeTemas.dialogo.uploadkml()' /></td>" +
				"			<td>KML ou KMZ</td>" +
				"		</tr>";
			}
			ins += "	</table>";			
			$i(janela[2].id).innerHTML = ins;;
		},
		/*
		Function: conectaservico

		Abre uma janela flutunate que permite abrir outras ferramentas para conexão com serviços externos
		*/
		conectaservico: function(){
			var janela,ins,titulo,cabecalho,minimiza,
				OPCOESADICIONAIS = i3GEO.arvoreDeTemas.OPCOESADICIONAIS;

			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOFconectaservico");
			};
			titulo = "Conexão com serviços</a>";
			janela = i3GEO.janela.cria(
				"260px",
				"150px",
				"",
				"",
				"",
				titulo,
				"i3GEOFconectaservico",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			$i("i3GEOFconectaservico_corpo").style.backgroundColor = "white";
			$i("i3GEOFconectaservico_corpo").style.overflow = "hidden";
			ins = "" +
			"	<p class=paragrafo style='width:90%' ><b>Tipo de conexão</b><br><br>" +
			"	<table class=lista6 style=left:20px;position:relative >";
			
			if(OPCOESADICIONAIS.carregaKml === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivoc onclick='i3GEO.arvoreDeTemas.dialogo.carregaKml()' /></td>" +
				"			<td>KML</td>" +
				"		</tr>";
			}
			if(OPCOESADICIONAIS.conectarwms === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivoc onclick='i3GEO.arvoreDeTemas.dialogo.conectarwms()' /></td>" +
				"			<td>WMS</td>" +
				"		</tr>";
			}
			if(OPCOESADICIONAIS.conectarwmst === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivoc onclick='i3GEO.arvoreDeTemas.dialogo.conectarwmst()' /></td>" +
				"			<td>WMS-T</td>" +
				"		</tr>";
			}
			if(OPCOESADICIONAIS.conectargeorss === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivoc onclick='i3GEO.arvoreDeTemas.dialogo.conectargeorss()' /></td>" +
				"			<td>GeoRSS</td>" +
				"		</tr>";
			}
			if(OPCOESADICIONAIS.conectargeojson === true){
				ins += "<tr>" +
				"			<td><input type=radio style=cursor:pointer name=i3GEOFtipoArquivoc onclick='i3GEO.arvoreDeTemas.dialogo.conectargeojson()' /></td>" +
				"			<td>GeoJson</td>" +
				"		</tr>";
			}			
			ins += "	</table>";			
			$i(janela[2].id).innerHTML = ins;;
		},

		/*
		Function: carregaKml

		Abre a janela flutuante para o usuário adicionar temas baseado em arquivos KML
		*/
		carregaKml: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/carregakml/index.js.php","i3GEOF.carregakml.criaJanelaFlutuante()","i3GEOF.carregakml_script");
		},
		/*
		Function: carouselTemas

		Abre a janela flutuante para o usuário adicionar temas baseado nas imagens miniatura
		*/
		carouselTemas: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/carouseltemas/index.js.php","i3GEOF.carouseltemas.criaJanelaFlutuante()","i3GEOF.carouseltemas_script");
		},
		/*
		Function: buscaInde

		Abre a janela flutuante para o usuário procurar metadados na INDE
		*/
		buscaInde: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/buscainde/index.js.php","i3GEOF.buscainde.criaJanelaFlutuante()","i3GEOF.buscainde_script");
		},	
		/*
		Function: nuvemTags

		Mostra a nuvem de tags para escolha de temas baseado nos tags registrados nos menus de temas
		*/
		nuvemTags: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/nuvemtags/index.js.php","i3GEOF.nuvemtags.criaJanelaFlutuante()","i3GEOF.nuvemtags_script");
		},
		/*
		Function: nuvemTagsFlash

		Mostra a nuvem de tags para escolha de temas baseado nos tags registrados nos menus de temas.

		Essa ferramenta é alternativa a ferramenta nuvemTags, mostrando tbm a nuvem com um aplicativo em flash
		*/
		nuvemTagsFlash: function()
		{i3GEO.janela.cria("550px","350px",i3GEO.configura.locaplic+"/ferramentas/nuvemtagsflash/index.htm","","","Nuvem Flash");},
		/*
		Function: navegacaoDir

		Abre a janela para adicionar temas navegando pelos diretórios do servidor
		*/
		navegacaoDir: function()
		{i3GEO.janela.cria("550px","350px",i3GEO.configura.locaplic+"/ferramentas/navegacaodir/index.htm","","","Diret&oacute;rios");},
		/*
		Function: importarwmc

		Abre a janela para importar um arquivo WMC (Web Map Context)
		*/
		importarwmc: function()
		{i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/importarwmc/index.js.php","i3GEOF.importarwmc.criaJanelaFlutuante()","i3GEOF.importarwmc_script");},
		/*
		Function: conectarwms

		Abre a janela para adicionar temas tendo como fonte um web service do tipo wms
		*/
		conectarwms: function()
		{i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/conectarwms/index.htm","","","Conexão WMS <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=28' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: conectarwmst

		Abre a janela para adicionar temas tendo como fonte um web service do tipo wms-t (time)
		*/
		conectarwmst: function(){
			var l,a;
			if(i3GEO.parametros.w)
			{l = i3GEO.parametros.w + 150;}
			else
			{l = 400;}
			if(i3GEO.parametros.h)
			{a = i3GEO.parametros.h + 200;}
			else
			{a = 350;}
			i3GEO.janela.cria(l/2 + "px",a/2 + "px",i3GEO.configura.locaplic+"/ferramentas/wmstime/index.htm","","","Conexão WMS-T <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=76' >&nbsp;&nbsp;&nbsp;</a>");
		},
		/*
		Function: conectarwfs

		Abre a janela para adicionar temas tendo como fonte um web service do tipo wfs
		*/
		conectarwfs: function()
		{i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/conectarwfs/index.htm","","","WFS");},
		/*
		Function: conectargeojson

		Abre a janela para adicionar temas tendo como fonte uma url no formato geojson
		*/
		conectargeojson: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/conectargeojson/index.js.php","i3GEOF.conectargeojson.criaJanelaFlutuante()","i3GEOF.conectargeojson_script");
		},
		/*
		Function: conectargeorss

		Abre a janela para adicionar temas tendo como fonte um georss
		*/
		conectargeorss: function()
		{i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/conectargeorss/index.htm","","","Conexão GeoRSS <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=29' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: upload

		Abre a janela para o upload de shape file
		*/
		upload: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/upload/index.js.php","i3GEOF.upload.criaJanelaFlutuante()","i3GEOF.upload_script");
		},
		/*
		Function: uploaddbf

		Abre a janela para o upload de um arquivo dbf
		*/
		uploaddbf: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/uploaddbf/index.js.php","i3GEOF.uploaddbf.criaJanelaFlutuante()","i3GEOF.uploaddbf_script");
		},
		/*
		Function: downloadbase

		Abre o aplicativo datadownload
		*/
		downloadbase: function()
		{window.open(i3GEO.configura.locaplic+"/datadownload.htm");},
		/*
		Function: uploadgpx

		Abre a janela para o upload de um arquivo gpx
		*/
		uploadgpx: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/uploadgpx/index.js.php","i3GEOF.uploadgpx.criaJanelaFlutuante()","i3GEOF.uploadgpx_script");
		},
		/*
		Function: uploadkml

		Abre a janela para o upload de um arquivo kml
		*/
		uploadkml: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/uploadkml/index.js.php","i3GEOF.uploadkml.criaJanelaFlutuante()","i3GEOF.uploadkml_script");
		}
	},
	/*
	Function abrejanelaIframe

	Abre uma janela flutuante contendo um iframe

	Parametros:

	w {string} - largura

	h {string} - altura

	s {string} - src do iframe
	*/
	abrejanelaIframe: function(w,h,s){
		var janelaeditor = i3GEO.janela.cria(w,h,s,parseInt(Math.random()*100,10),10,s,"janela"+i3GEO.util.randomRGB(),false);
		YAHOO.util.Event.addListener(janelaeditor[0].close, "click", i3GEO.arvoreDeTemas.atualiza,janelaeditor[0].panel,{id:janelaeditor[0].id},true);
	}
};
//YAHOO.log("carregou classe arvoredetemas", "Classes i3geo");
