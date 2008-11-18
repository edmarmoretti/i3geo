/*
Title: i3geo.arvoreDeTemas

Monta a árvore com os temas disponíveis para ser adicionados ao mapa.

Namespace:

i3GEO.arvoreDeTemas

Dependências:

pacotes/yui252/build/treeview/treeview-min.js

pacotes/yui252/build/treeview/assets/skins/sam/treeview.css

File: i3geo/classesjs/classe_arvodetemas.js

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}

i3GEO.arvoreDeTemas = {
	/*
	Variable: OPCOESADICIONAIS
	
	Objeto com a definição das propriedades que serão utilizadas na inclusão dos ícones adicionais de adição de temas.

	Example:
	
	var obj = {
	
		idOnde: "",
		
		incluiArvore: true,
		
		uploaddbf: true,
		
		uploadlocal: true,
		
		downloadbase: true,
		
		conectarwms: true,
		
		conectargeorss: true,
		
		nuvemTags:true,
		
		navegacaoDir:false,
		
		incluibusca: true
		
	}
	
	*/
	OPCOESADICIONAIS: {
		idonde: "",
		incluiArvore: true,
		uploaddbf: true,
		uploadlocal: true,
		downloadbase: true,
		conectarwms: true,
		conectargeorss: true,
		nuvemTags:true,
		navegacaoDir:false,
		incluibusca:true
	},
	/*
	Variable: INCLUISISTEMAS
	
	Inclui na árvore a lista de sistemas adicionais definidos no i3geo?
	*/
	INCLUISISTEMAS: true,
	/*
	Variable: SISTEMAS
	
	Objeto JSON com a lista de sistemas existentes
	*/
	SISTEMAS: null,
	/*
	Variable: ATIVATEMA
	
	Nome da função que será incluída no evento onclick do elemento checkbox adicionado no início do noome de um tema.
	*/
	ATIVATEMA: "",
	/*
	Variable: IDSMENUS
	
	Array com a lista de ids que serão considerados na montagem da árvore. Por default é vazio, o que significa que todos os menus serão considerados.
	*/
	IDSMENUS: new Array(),
	/*
	Variable: MENUS
	
	Armazena o objeto JSON com a lista de menus resultante da função listaMenus
	*/
	MENUS: null,
	/*
	Variable: GRUPOS
	
	Armazena o objeto JSON com a última lista de grupos obtida
	*/
	GRUPOS: null,
	/*
	Variable: SUBGRUPOS
	
	Armazena o objeto JSON com a última lista de sub-grupos obtida
	*/
	SUBGRUPOS: null,
	/*
	Variable: TEMAS
	
	Armazena o objeto JSON com a última lista de temas obtida
	*/
	TEMAS: null,
	/*
	Variable: IDHTML
	
	Armazena o ID do elemento HTML onde a árvore será incluida
	*/
	IDHTML: null,
	/*
	Variable: LOCAPLIC
	
	Endereço da aplicação i3geo. Utilizado para definir o caminho para a chamada em AJAX.
	*/
	LOCAPLIC: null,
	/*
	Variable: SID
	
	Código dda seção aberta no servidor pelo i3Geo
	*/
	SID: null,
	/*
	Variable: ARVORE
	
	Objeto com a árvore criada com YAHOO.widget.TreeView
	*/
	ARVORE: null,
	/*
	Function: listaMenus
	Lista os menus disponíveis. 

	Parameters:
	
	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	funcao - nome da função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaMenus: function(g_sid,g_locaplic,funcao) {
		var retorno = function(retorno) {
			if(i3GEO.arvoreDeTemas.IDSMENUS.length == 0)
				i3GEO.arvoreDeTemas.MENUS = retorno.data;
			else{
				i3GEO.arvoreDeTemas.MENUS = new Array();
				var c = retorno.data.length;
				var m = i3GEO.arvoreDeTemas.IDSMENUS.length;
				for (var i=0, j=c; i<j; i++){
					for (var k=0, jj=m; k<jj; k++){
						if(retorno.data[i].idmenu == i3GEO.arvoreDeTemas.IDSMENUS[k]) 
						i3GEO.arvoreDeTemas.MENUS.push(retorno.data[i]);
					}
				}
			}
			if(funcao != "")
				eval(funcao+"(retorno)");
		};
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+g_sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"pegalistademenus",retorno);
	},
	/*
	Function: listaGrupos
	Lista os grupos de um menu. 

	Parameters:
	
	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp
	
	id_menu - {String} Id do menu que contem os grupos

	funcao - função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaGrupos: function(g_sid,g_locaplic,id_menu,funcao) {
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.GRUPOS = retorno.data;
			if(funcao != "")
			funcao.call();
		};
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&g_sid="+g_sid+"&idmenu="+id_menu+"&listasistemas=nao&listasgrupos=nao";
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"pegalistadegrupos",retorno);
	},
	/*
	Function: listaSubGrupos
	Lista os sub-grupos de um grupo. 

	Parameters:
	
	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp
	
	id_menu - {String} Id do menu que contem os grupos
	
	id_grupo - {String} Id do grupo que contem os sub-grupos

	funcao - função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaSubGrupos: function(g_sid,g_locaplic,id_menu,id_grupo,funcao) {
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.SUBGRUPOS = retorno.data;
			if(funcao != "")
			funcao.call();
		};
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&g_sid="+g_sid+"&idmenu="+id_menu+"&grupo="+id_grupo;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"pegalistadesubgrupos",retorno);
	},
	/*
	Function: listaTemas
	Lista os temas de um sub-grupo. 

	Parameters:
	
	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp
	
	id_menu - {String} Id do menu que contem os grupos
	
	id_grupo - {String} Id do grupo que contem os sub-grupos
	
	id_subgrupo - {String} Id do sub-grupo que contem os temas

	funcao - função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaTemas: function(g_sid,g_locaplic,id_menu,id_grupo,id_subgrupo,funcao) {
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.TEMAS = retorno.data;
			if(funcao != "")
			funcao.call();
		};
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&g_sid="+g_sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&subgrupo="+id_subgrupo;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"pegalistadetemas",retorno);
	},
	/*
	Function: listaSistemas
	Lista os sistemas especiais de adição de temas. 

	Parameters:
	
	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	funcao - função que será executada quando a lista for recebida. Se for "", não é chamada.
	*/
	listaSistemas: function(g_sid,g_locaplic,funcao) {
		var retorno = function(retorno) {
			i3GEO.arvoreDeTemas.SISTEMAS = retorno.data;
			if(funcao != "")
			funcao.call();
		};
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemas&g_sid="+g_sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"pegasistemas",retorno);
	},

	/*
	Function: cria
	Cria a árvore com os menus disponíveis. 

	Parameters:
	
	g_sid - {String} Código da seção PHP criada ao abrir o i3Geo

	g_locaplic - {String} Endereço da aplicação (i3geo) onde fica o diretório classesphp

	idhtml - {String} Id do elemento onde a árvore será inserida
	
	funcaoTema - {String} Nome da função que será executada quando o usuário clicar no checkbox de um tema

	objOpcoes - {Object} Objeto com as opções necessárias para criação dos ícones com as opções adicionais de adição de temas
	*/
	cria: function(g_sid,g_locaplic,idhtml,funcaoTema,objOpcoes) {
		var nargs = arguments.length;
		if(nargs == 4 || nargs == 5)
		{i3GEO.arvoreDeTemas.ATIVATEMA = funcaoTema;}
		if(nargs == 5)
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS = objOpcoes;}
		i3GEO.arvoreDeTemas.IDHTML = idhtml;
		i3GEO.arvoreDeTemas.LOCAPLIC = g_locaplic;
		i3GEO.arvoreDeTemas.SID = g_sid;
		this.listaMenus(g_sid,g_locaplic,"i3GEO.arvoreDeTemas.montaArvore");
	},
	/*
	Function: montaArvore
	Monta a árvore incluindo os nós do primeiro nível. 

	A opção de carga dinâmica dos nós filhos é definida para a montagem dos grupos.
	*/
	montaArvore: function() {
		var currentIconMode;
		YAHOO.example.treeExample = new function()
		{
			
			function changeIconMode()
			{
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
				buildTree();
			}
        	function buildTree()
        	{
				i3GEO.arvoreDeTemas.ARVORE = new YAHOO.widget.TreeView(i3GEO.arvoreDeTemas.IDHTML);
				//i3GEO.arvoreDeTemas.ARVORE.setDynamicLoad(i3GEO.arvoreDeTemas.montaGrupos, currentIconMode);
				var root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
				var tempNode = new YAHOO.widget.TextNode('', root, false);
				tempNode.isLeaf = false;
        	}
    		buildTree();
		}();
		var root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		//opção de busca de temas
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluibusca == true){
			var insp = "<br><br><table  cellspacing='0' cellpadding='0' ><tr><td style='text-align:left;font-size:10px;'>";
			insp += "<span style='font-size:12px'>&nbsp;"+$trad("a1")+"</span><input class='digitar' type='text' id='i3geo_buscatema' size='15' value=''  /><img  class='tic' title='"+$trad("a1")+"' src='"+$im("branco.gif")+"' onclick='i3GEO.arvoreDeTemas.buscaTema(document.getElementById(\"i3geo_buscatema\").value)' style='cursor:pointer;top:2px;position:relative;' /></p></td></tr></table>&nbsp;";
			var d = {html:insp};
			var tempNode = new YAHOO.widget.HTMLNode(d, root, false,false);
			//tempNode.isLeaf = true;		
		}
		//icones com as outras opções
		var outrasOpcoes = i3GEO.arvoreDeTemas.outrasOpcoesHTML();
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde != "")
		{document.getElementById(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde).innerHTML = outrasOpcoes;}
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore == true){
			var d = {html:outrasOpcoes+"&nbsp;<br>"};
			var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
			tempNode.isLeaf = true;
		}
		//
		//adiciona na árvore a raiz de cada menu
		//
		var dados = i3GEO.arvoreDeTemas.MENUS;
		var c = dados.length;
		for (var i=0, j=c; i<j; i++)
		{
			var desc = dados[i].desc
			if(dados[i].publicado != "NAO")
			var conteudo = "<b>&nbsp;<span title='"+desc+"'>"+dados[i].nomemenu+"</span>"
			else
			var conteudo = "<b>&nbsp;<span title='nao publicado' style=color:red; >"+dados[i].nomemenu+"</span>"
			var d = {html:conteudo,idmenu:dados[i].idmenu};
			var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
			tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaGrupos, currentIconMode);
			if(dados[i].status == "aberto")
			{i3GEO.arvoreDeTemas.montaGrupos(tempNode);}
		}
		if(i3GEO.arvoreDeTemas.INCLUISISTEMAS){
			var retorno = function(){
				var conteudo = "<b>Sistemas</b>";
				var d = {html:conteudo};
				var tempNode = new YAHOO.widget.HTMLNode(d,root, false,true);
				var sis = i3GEO.arvoreDeTemas.SISTEMAS;
				var iglt = sis.length;
				var ig=0;
				do{
					var nomeSis = sis[ig].NOME;
					if(sis[ig].PUBLICADO){
						if(sis[ig].PUBLICADO == "NAO" || sis[ig].PUBLICADO == "nao")
						{var nomeSis = "<s>"+sis[ig].NOME+"</s>";}
					}
					var d = {html:nomeSis};
					var sisNode = new YAHOO.widget.HTMLNode(d, tempNode, false,true);
					var funcoes = sis[ig].FUNCOES;
					var tempf = funcoes.length;
					for (var ig2=0;ig2<tempf;ig2++){
						var executar = funcoes[ig2].ABRIR;
						var w = funcoes[ig2].W;
						var h = funcoes[ig2].H;
						var nomeFunc = "<a href='#' onclick='abreSistema(\""+executar+"\",\""+w+"\",\""+h+"\")'>"+funcoes[ig2].NOME+"</a>";
						var d = {html:nomeFunc};
						var funcNode = new YAHOO.widget.HTMLNode(d, sisNode, false,true);
						funcNode.isLeaf = true;
					}
					ig++;
				}
				while(ig<iglt)
				i3GEO.arvoreDeTemas.ARVORE.draw();
			};
			i3GEO.arvoreDeTemas.listaSistemas(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,retorno);
		}
		document.getElementById(i3GEO.arvoreDeTemas.IDHTML).style.textAlign="left";
   		if(!i3GEO.arvoreDeTemas.INCLUISISTEMAS)
   		i3GEO.arvoreDeTemas.ARVORE.draw();
	},
	/*
	Function: montaGrupos
	Monta a lista de grupos de um nó principal da árvore. 

	A opção de carga dinâmica dos nós filhos é definida para a montagem dos sub-grupos.
	*/
	montaGrupos: function(node){		
		var temp=function(){
			var grupos = i3GEO.arvoreDeTemas.GRUPOS.grupos;
			var c = grupos.length - 3;
			var raiz = grupos[c].temasraiz;
			var nraiz = raiz.length
			for (i=0;i<nraiz; i++){
				var html = i3GEO.arvoreDeTemas.montaTextoTema("gray",raiz[i])
				var d = {html:html};
				var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
				tempNode.isLeaf = true;
			}
			for (i=0;i<c; i++){
				var d = {html:grupos[i].nome,idmenu:node.data.idmenu,idgrupo:i}
				var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaSubGrupos, 1);
				tempNode.isLeaf = false;
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaGrupos(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,temp)
	},
	/*
	Function: montaSubGrupos
	Monta a lista de sub-grupos de um nó do tipo grupo. 

	A opção de carga dinâmica dos nós filhos é definida para a montagem dos temas.
	*/
	montaSubGrupos: function(node){		
		var temp=function(){
			var subgrupos = i3GEO.arvoreDeTemas.SUBGRUPOS.subgrupo;
			var c = subgrupos.length;
			
			var raiz = i3GEO.arvoreDeTemas.SUBGRUPOS.temasgrupo;
			var nraiz = raiz.length;
			for (i=0;i<nraiz; i++){
				var html = i3GEO.arvoreDeTemas.montaTextoTema("gray",raiz[i])
				var d = {html:html};
				var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
				tempNode.isLeaf = true;
			}

			for (i=0;i<c; i++){
				var d = {html:subgrupos[i].nome,idmenu:node.data.idmenu,idgrupo:node.data.idgrupo,idsubgrupo:i}
				var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaTemas, 1);
				tempNode.isLeaf = false;
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaSubGrupos(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,node.data.idgrupo,temp)
	},
	/*
	Function: montaTemas
	Monta a lista de temas de um nó do tipo sub-grupo. 
	*/
	montaTemas: function(node){		
		var temp=function(){
			var temas = i3GEO.arvoreDeTemas.TEMAS.temas;
			var c = temas.length;
			var cor = "rgb(51, 102, 102)";
			for (i=0;i<c; i++){
				htmli = i3GEO.arvoreDeTemas.montaTextoTema(cor,temas[i]);
				var d = {html:htmli,idtema:temas[i].tid,fonte:temas[i].link,ogc:temas[i].ogc}
				var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
				tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.propTemas, 1);
				tempNode.isLeaf = false;
				if(cor == "rgb(51, 102, 102)")
				{var cor = "rgb(47, 70, 50)";}
				else{var cor = "rgb(51, 102, 102)";}
			}
			node.loadComplete();
		};
		i3GEO.arvoreDeTemas.listaTemas(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,node.data.idgrupo,node.data.idsubgrupo,temp)
	},
	/*
	Function: montaTextoTema
	Monta o texto com o título do tema.
	
	Parameters:
	
	cor - {String} - cor que será utilizada no estilo "color"
	
	tema - {Object} - objeto JSON com as propriedades do tema
	
	Return:
	
	{String} - texto formatado
	*/
	montaTextoTema: function(cor,tema){
		var html = "<span style='color:"+cor+"'><input style='cursor:pointer;border:solid 0 white;' onclick=\""+i3GEO.arvoreDeTemas.ATIVATEMA+"\"  type='checkbox' value='"+tema.tid+"' /> ";
		html += tema.nome;
		html += "</span>";
		return(html);
	},
	/*
	Function: propTemas
	Monta o nó com informações adicionais sobre o tema.
	
	Parameters:
	
	node - {Object} - objeto com o nó que foi clicado
	*/
	propTemas: function(node){		
		var g_locaplic = i3GEO.arvoreDeTemas.LOCAPLIC;
		html = "<a href='"+node.data.fonte+"' target='_blank' >Fonte</a>";
		var d = {html:html}
		var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
		tempNode.isLeaf = true;
		
		var lkmini = g_locaplic+"/testamapfile.php?map="+node.data.idtema+".map&tipo=mini";
		var lkmini1 = g_locaplic+"/testamapfile.php?map="+node.data.idtema+".map&tipo=grande";
		var html = "<a onmouseover='mostradicasf(this,\"<img src="+lkmini+" />\")' href='"+lkmini1+"' target='blank' >Miniatura</a>";	
		var d = {html:html}
		var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
		tempNode.isLeaf = true;

		if (node.data.ogc != "nao"){
			var html = "<span style='cursor:pointer;text-decoration:underline;' onclick='abreKml(\""+node.data.idtema+"\")' target='blank' >Kml</span>";		
			var d = {html:html}
			var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
			tempNode.isLeaf = true;

			var ogc = g_locaplic+"/ogc.php?tema="+node.data.idtema+"&service=wms&request=getcapabilities";
			var html = "<a href='"+ogc+"' target='blank' >WMS - OGC</a>";	
			var d = {html:html}
			var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
			tempNode.isLeaf = true;
		}
		var lkgrcode = g_locaplic+"/pacotes/qrcode/php/qr_html.php?d="+g_locaplic+"/mobile/index.php?temasa="+node.data.idtema;
		var lkgrcode1 = g_locaplic+"/pacotes/qrcode/php/qr_img.php?d="+g_locaplic+"/mobile/index.php?temasa="+node.data.idtema;
		var html = "<a onmouseover='mostradicasf(this,\"<img src="+lkgrcode1+" />\")' href='"+lkgrcode+"' target='blank' >Qrcode</a>";	
		var d = {html:html}
		var tempNode = new YAHOO.widget.HTMLNode(d, node, false,true);
		tempNode.isLeaf = true;
		node.loadComplete();
	},
	/*
	Function: outrasOpcoesHTML
	Constrói o HTML com as opções adicionais de inclusão de temas (upload de shp, etc.).
	
	Return:
	
	{String} - html gerado
	*/
	outrasOpcoesHTML: function(){
		var ins = "<table width='120px' ><tr>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf == true)
		ins += "<td><div id='updbf' style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='uploaddbf()'><img class='uploaddbf' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left' title='"+$trad("a2b")+"'/></div><td>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploadlocal == true)
		ins += "<td><div id='uplocal' style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='upload()'><img class='upload' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left' title='"+$trad("a2")+"'/></div><td>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.downloadbase == true)
		ins += "<td><div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='downloadbase()'><img class='download' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a3")+"'/></div><td>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwms == true)
		ins += "<td><div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='conectarwms()'><img class='conectarwms' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a4")+"'/></div><td>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectargeorss == true)
		ins += "<td><div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='conectargeorss()'><img class='conectargeorss' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a5")+"'/></div><td>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.nuvemTags == true)
		ins += "<td><div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='nuvemTags()'><img class='nuvemtags' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a5a")+"'/></div><td>";
		if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir == true)
		ins += "<td><div style='width:98%;left:5px;cursor:pointer;text-align:left;font-size:11px;' onclick='navegacaoDir()'><img class='conectarservidor' src='"+$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a6")+"'/></div><td>";
		ins += "</tr></table>";
		return(ins);
	},
	/*
	Function: desativaCheckbox
	Desmarca todos os checkbox dos temas marcados na árvore.
	
	*/
	desativaCheckbox: function(){
		var o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
		var inputs = o.getElementsByTagName("input");
		var n = inputs.length;
		var i=0;
		do{
			inputs[i].checked = false;
			i++;
		}
		while(i<n)	
	},
	/*
	Function: listaTemasAtivos
	Lista os temas comcheckbox marcados.
	
	Return:
	{Array} - array comoscódigos dos temas
	*/
	listaTemasAtivos: function(){
		var o = document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);
		var inputs = o.getElementsByTagName("input");
		var n = inputs.length;
		var i=0;
		var lista = new Array();
		do{
			if(inputs[i].checked == true)
			{lista.push(inputs[i].value);}
			i++;
		}
		while(i<n)
		return (lista);
	},
	/*
	Function: buscaTema
	Procura temas na árvore de temas (a busca é feita no servidor e não na árvore atual).
	
	Parameter:
	
	palavra {String}
	*/
	buscaTema: function(palavra){
		var procurar = i3GEO.util.removeAcentos(palavra);
		var resultadoProcurar = function(retorno)
		{
			if(!retorno.data)
			{alert("Ocorreu um erro");}
			else{
				var retorno = retorno.data;
				var conta = 0;
				if ((retorno != "erro") && (retorno != undefined)){
					var ig = retorno.length-1;
					if(ig >= 0){
						do{
							var ngSgrupo = retorno[ig].subgrupos;
							var tempn = ngSgrupo.length;
							for (var sg=0;sg<tempn;sg++){
								var nomeSgrupo = ngSgrupo[sg].subgrupo;
								var ngTema = ngSgrupo[sg].temas;
								var tempng = ngTema.length;
								for (var st=0;st<tempng;st++){
									//var tid = ngTema[st].tid;
									var d = i3GEO.arvoreDeTemas.montaTextoTema("gray",ngTema[st])
									var lk = "";
									if ( ngTema[st].link != " ")
									{var lk = "<a href='"+ngTema[st].link+"' target='blank'>&nbsp;fonte</a>";}
									d += " ("+nomeSgrupo+") "+lk;
									var tempNode = new YAHOO.widget.HTMLNode(d, nodePalavra, false,true);
									tempNode.isLeaf = true;
									conta++;
								}
							}
						}
						while(ig--)
					}
					else{
						var d = "<span style='color:red'>Nada encontrado<br><br></span>";
						var tempNode = new YAHOO.widget.HTMLNode(d, nodePalavra, false,true);
						tempNode.isLeaf = true;
					}
				}
			}
			nodePalavra.loadComplete();
		};
		//
		//funcao que será executada para buscar os temas
		//
		var busca = function(){
			var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&procurar="+procurar+"&g_sid="+i3GEO.arvoreDeTemas.SID;
			cpObj.call(p,"procurartemas",resultadoProcurar);
		};
		//
		//recolhe todos os nós e acrescenta um novo
		//
		i3GEO.arvoreDeTemas.ARVORE.collapseAll();
		var root = i3GEO.arvoreDeTemas.ARVORE.getRoot();
		if(!i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados")){
			var d = {html:"Temas encontrados",id:"temasEncontrados"}
			var tempNode = new YAHOO.widget.HTMLNode(d, root, false,true);
		}
		else
		{var tempNode = i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados");}
		var d = {html:palavra}
		nodePalavra = new YAHOO.widget.HTMLNode(d, tempNode, false,true);
		i3GEO.arvoreDeTemas.ARVORE.draw();
		tempNode.expand();
		nodePalavra.setDynamicLoad(busca, 1);
		nodePalavra.expand();
	}
};
//
//para efeitos de compatibilidade, as opções são definidas aqui
//
try {
	if (g_uploaddbf == "nao")
	{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf = false;}
}
catch(e){};
try {
	if (g_uploadlocal == "nao")
	{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploadlocal = false;}
}
catch(e){};
try {
	if (g_downloadbase == "nao")
	{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.downloadbase = false;}
}
catch(e){};
try {
	if (g_conectarwms == "nao")
	{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwms = false;}
}
catch(e){};
try {
	if (g_conectargeorss == "nao")
	{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectargeorss = false;}
}
catch(e){};
try {
	if (g_nuvemTags == "nao")	
	{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.nuvemTags = false;}
}
catch(e){};