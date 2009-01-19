/*
Class: i3GEO.arvoreDeCamadas.js

Monta a árvore com os temas existentes no mapa atual. A árvore contém as opções de ligar e desligar temas.

Permite controlar quais as opções que serão mostradas na árvore.

File: i3geo/classesjs/classe_arvoredecamadas.js

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
i3GEO.arvoreDeCamadas = {
	/*
	Property: i3GEO.arvoreDeCamadas.OPCOESTEMAS
	
	Inclui ou não o nó com as opções de manipulação de cada tema.
	
	Default:
	true
	
	Type:
	{Boolean}
	*/
	OPCOESTEMAS: true,
	/*
	Property: i3GEO.arvoreDeCamadas.OPCOESLEGENDA
	
	Inclui ou não o nó para mostrar a legenda do tema.
	
	Default:
	true
	
	Type:
	{Boolean}
	*/
	OPCOESLEGENDA: true,
	/*
	Variable: i3GEO.arvoreDeCamadas.CAMADAS
	
	Objeto com a lista de camadas existentes no mapa. É definido na inicialização ou no redesenho do mapa.
	
	Este objeto é construído nas operações em PHP de inicialização ou redesenho do mapa.
	
	Exemplo:
	
	"temas":[
		
		{
		
			"name":"estadosl", //código do layer
			
			"status":2, //ver constante MS_STATUS do Mapserver
			
			"tema":"Limite Estadual",
			
			"transparency":100,
			
			"type":1, //ver constante MS_TYPE do Mapserver
			
			"sel":"nao",
			
			"escala":"250000",
			
			"download":"",
			
			"features":"nao",
			
			"connectiontype":1, //ver constante MS_CONNECTIONTYPE do Mapserver
			
			"zoomtema":"sim",
			
			"contextoescala":"nao"
			
		}
	]
	
	Type:
	{JSON}
	*/
	CAMADAS: "",
	/*
	Variable: i3GEO.arvoreDeCamadas.ARVORE
	
	Objeto com a árvore criada com YAHOO.widget.TreeView

	Type:
	{YAHOO.widget.TreeView}
	*/
	ARVORE: null,
	/*
	Variable: i3GEO.arvoreDeCamadas.IDHTML
	
	Armazena o ID do elemento DOM onde a árvore foi inserida.
	
	Type:
	{String}
	*/
	IDHTML: null,
	/*
	Variable: i3GEO.arvoreDeCamadas.SID
	
	Código da seção aberta no servidor pelo i3Geo

	Type:
	{String}
	*/
	SID: null,
	/*
	Variable: i3GEO.arvoreDeCamadas.ATIVATEMA
	
	Nome da função que será incluída no evento onclick do elemento checkbox adicionado no início do nome de um tema.
	
	Type:
	{String}
	*/
	ATIVATEMA: "",
	/*
	Variable: i3GEO.arvoreDeCamadas.LOCAPLIC
	
	Endereço da aplicação i3geo. Utilizado para definir o caminho para a chamada em AJAX.
	
	Exemplo: 'http://localhost/i3geo'

	Type:
	{String}
	*/
	LOCAPLIC: null,
	/*
	Function: i3GEO.arvoreDeCamadas.cria
	
	Cria a árvore com as opções de manipulação das camadas existentes no mapa
	
	Parameters:
	
	onde {String} - ID do elemento DOM onde a árvore será inserida. Se for definido como "" o id será buscado da variável IDHTML.
	
	temas {JSON} - Objeto JSON com as camadas e propriedades
	
	g_sid {String} -  Código da seção PHP criada ao abrir o i3Geo

	funcaoTema {String} - (opcional) Nome da função que será executada quando o usuário clicar no checkbox de um tema
	*/
	cria: function(onde,temas,g_sid,g_locaplic,funcaoTema){
		//YAHOO.log("Criando a árvore de camadas", "i3geo");
		if(arguments.length == 5){
			i3GEO.arvoreDeCamadas.ATIVATEMA = funcaoTema;
		}
		this.SID = g_sid;
		this.LOCAPLIC = g_locaplic;
		if(onde != "")
		this.IDHTML = onde;
		if(this.IDHTML == ""){return;}
		this.atualiza(temas);
	},
	/*
	Function: i3GEO.arvoreDeCamadas.atualiza
	
	Atualiza a árvore de camadas.
	
	Antes de executar a atualização, essa função verifica se é necessário fazê-lo.
	O objeto CAMADAS é comparado com o parâmetro "temas" para verificar se existem diferenças que
	justifiquem a atualização.
	
	Parameters:
	
	temas {JSON} - Objeto com a lista de camadas e propriedades (veja CAMADAS)
	*/
	atualiza: function(temas){
		if(this.comparaTemas(temas,this.CAMADAS)){return;}
		//YAHOO.log("Atualizando a árvore de camadas", "i3geo");
		document.getElementById(i3GEO.arvoreDeCamadas.IDHTML).innerHTML = "";
		this.CAMADAS = temas;
		var currentIconMode;
		YAHOO.example.treeExample = new function(){
			function changeIconMode(){
				var newVal = parseInt(this.value);
				if (newVal != currentIconMode)
				{currentIconMode = newVal;}
				buildTree();
			}
        	function buildTree(){
				i3GEO.arvoreDeCamadas.ARVORE = new YAHOO.widget.TreeView(i3GEO.arvoreDeCamadas.IDHTML);
				var root = i3GEO.arvoreDeCamadas.ARVORE.getRoot();
				var tempNode = new YAHOO.widget.TextNode('', root, false);
				tempNode.isLeaf = false;
        	}
    		buildTree();
		}();
		var root = i3GEO.arvoreDeCamadas.ARVORE.getRoot();
		var titulo = "<table><tr><td><b>"+$trad("a7")+"</b></td><td><img id='i3geo_lixeira' title='"+$trad("t2")+"'  src='"+i3GEO.util.$im("branco.gif")+"' /></td></tr></table>";
		var d = {html:titulo};
		var tempNode = new YAHOO.widget.HTMLNode(d, root, true,true);
		var c = temas.length;
		for (var i=0, j=c; i<j; i++){
			var ltema = temas[i];		
			var d = {html:i3GEO.arvoreDeCamadas.montaTextoTema(ltema),id:temas[i].name,tipo:"tema"};
			var temaNode = new YAHOO.widget.HTMLNode(d, tempNode, false,true);
			temaNode.setDynamicLoad(i3GEO.arvoreDeCamadas.montaOpcoes, currentIconMode);
		}
		document.getElementById(i3GEO.arvoreDeCamadas.IDHTML).style.textAlign="left";
   		i3GEO.arvoreDeCamadas.ARVORE.draw();
   		this.ativaDragDrop();
	},
	ativaDragDrop: function(){
		//YAHOO.log("Ativando drag-drop da árvore de camadas", "i3geo");
		var Dom = YAHOO.util.Dom;
		var Event = YAHOO.util.Event;
		var DDM = YAHOO.util.DragDropMgr;
		YAHOO.example.DDList = "";
		YAHOO.example.DDApp = 
		{
    		init: function() 
    		{
        		if($i("i3geo_lixeira"))
        		{new YAHOO.util.DDTarget("i3geo_lixeira");}
        		var lista = i3GEO.arvoreDeCamadas.CAMADAS;
        		var i = lista.length-1;
        		if (i >= 0){
	       	 		do{
               			var ltema = lista[i];
               			if($i("arrastar_"+ltema.name))
               			{new YAHOO.example.DDList("arrastar_"+ltema.name);}
        			}
        			while(i--)
        		}
    		}
		};
		YAHOO.example.DDList = function(id, sGroup, config) {
		    YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);
		    this.logger = this.logger || YAHOO;
	    	var el = this.getDragEl();
	    	Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent
		    this.goingUp = false;
	   		this.lastY = 0;
		};
		YAHOO.extend(
			YAHOO.example.DDList, YAHOO.util.DDProxy, {
		    	startDrag: function(x, y){
    	    		this.logger.log(this.id + " startDrag");
		        	// make the proxy look like the source element
    		    	var dragEl = this.getDragEl();
        			var clickEl = this.getEl();
        			Dom.setStyle(clickEl, "visibility", "hidden");
	    	    	dragEl.innerHTML = clickEl.innerHTML;
	    	    	Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
   		 	   		Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
    	 	   		Dom.setStyle(dragEl, "border", "4px solid gray");
    	 	   		Dom.setStyle(dragEl, "z-index", "5000");
    			},
	    		endDrag: function(e){
	        		var srcEl = this.getEl();
    	    		var proxy = this.getDragEl();
	        		// Show the proxy element and animate it to the src element's location
    	    		Dom.setStyle(proxy, "visibility", "");
        			var a = new YAHOO.util.Motion( 
           				proxy,{ 
                			points:
                			{to: Dom.getXY(srcEl)}
    	        		}, 
        	   	 		0.2, 
            			YAHOO.util.Easing.easeOut
        			);
        			var proxyid = proxy.id;
        			var thisid = this.id;
	        		// Hide the proxy and show the source element when finished with the animation
	        		a.onComplete.subscribe(
	        			function(){
                			Dom.setStyle(proxyid, "visibility", "hidden");
                			Dom.setStyle(thisid, "visibility", "");
            			}
            		);
	        		a.animate();
	        		if ($i("i3geo_lixeira"))
	        		{$i("i3geo_lixeira").style.border = "0px solid blue";} 	
    			},
	    		onDragDrop: function(e, id){
	        		if (DDM.interactionInfo.drop.length === 1){
	            		var pt = DDM.interactionInfo.point; 
		            	var region = DDM.interactionInfo.sourceRegion; 
	            		if (!region.intersect(pt)){
	                		DDM.refreshCache();
	                		//exclui tema
   		             		if(DDM.getDDById(id).id == "i3geo_lixeira"){
                				i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o1"));
                				var tema = (this.getEl()).id.split("arrastar_")[1];
								var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+g_sid;
								var cp = new cpaint();
								//cp.set_debug(2)
								cp.set_response_type("JSON");
								cp.call(p,"excluiTemas",objmapa.atualizaCorpoMapa);
								objmapa.temaAtivo = "";
							}
							//muda ordem de desenho do tema
							else{
	                			i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
	                			var destEl = Dom.get(id);
   		             			var noid = id.split("arrastar_")[1];
   	    	         			destEl.appendChild(this.getEl()); 
 								var els = i3GEO.arvoreDeCamadas.listaLigadosDesligados();
 								var lista = els[2].join(",");
								var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
								var cp = new cpaint();
								//cp.set_debug(2)
								cp.set_response_type("JSON");
								cp.call(p,"reordenatemas",ajaxredesenha);
							}
        	    		}
	    	    	}
	    		},
	    		onDrag: function(e){
	        		// Keep track of the direction of the drag for use during onDragOver
	        		var y = Event.getPageY(e);
	        		if (y < this.lastY) 
	        		{this.goingUp = true;}
        			else
        			if (y > this.lastY)
        			{this.goingUp = false;}
	        		this.lastY = y;
	    		},
	    		onDragOver: function(e, id) {
	        		var srcEl = this.getEl();
	        		var destEl = Dom.get(id);
	        		// We are only concerned with list items, we ignore the dragover
	        		// notifications for the list.
	        		if ($i("i3geo_lixeira") && id == "i3geo_lixeira")
	        		{$i("i3geo_lixeira").style.border = "1px solid red";}
	        		else{destEl.style.textDecoration="underline";}
	    		},
	    		onDragOut: function(e, id)
	    		{$i(id).style.textDecoration="none";}
			}
		);
		Event.onDOMReady(YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);
	},
	/*
	Private: i3GEO.arvoreDeCamadas.montaOpcoes
	
	Abre o segundo nível da árvore de temas, mostrando as opções disponíveis para cada tema.
	
	Nesse segundo nível são mostrados alguns ícones como o farol, excluir, etc, além do nó de opções e legenda.
	
	Parameters:
	
	node {YAHOO.widget.HTMLNode} - Nó que foi clicado
	*/
	montaOpcoes: function(node){
		//YAHOO.log("Montando as opções da árvore de camadas", "i3geo");
		var idtema = node.data.id;
		var ltema = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		var farol = "maisamarelo.png";
		if (ltema.escala*1 < objmapa.scale*1){
	 		var farol = "maisverde.png";
	 		var mfarol = $trad("t9");
		}
		if (ltema.escala*1 > objmapa.scale*1){
	 		var farol = "maisvermelho.png";
			var mfarol = $trad("t10");
		}
		if (ltema.escala == 0){
	 		var farol = "maisamarelo.png";
			var mfarol = $trad("t11");
		}
		tnome = "&nbsp;<img id='farol"+ltema.name+"' src='"+i3GEO.util.$im(farol)+"' title='"+mfarol+"' \>";
		tnome += "&nbsp;<img  id='idx"+ltema.name+"' class='x' src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("t12")+"' onclick='i3GEO.tema.exclui(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t12a")+"','exclui')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";
		tnome += "&nbsp;<img class='sobe' src='"+i3GEO.util.$im("branco.gif") +"' title='"+$trad("t13")+"' onclick='i3GEO.tema.sobe(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t14")+"','sobe')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";
		tnome += "&nbsp;<img class='desce' src='"+i3GEO.util.$im("branco.gif") +"' title='"+$trad("t15")+"' onclick='i3GEO.tema.desce(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t16")+"','desce')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";
		//a operação de zoom para o tema não funciona na interface flamingo
		if( (ltema.zoomtema == "sim") && (!$i("flamingo")))
		{tnome += "&nbsp;<img class='extent' src='"+i3GEO.util.$im("branco.gif") +"' title='"+$trad("t17")+"' onclick='i3GEO.tema.zoom(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t18")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}
		var d = {html:tnome};
		var iconesNode = new YAHOO.widget.HTMLNode(d, node, false,true);
		iconesNode.isLeaf = true;
		if(i3GEO.arvoreDeCamadas.OPCOESTEMAS == true){
			var conteudo = $trad("t18a");
			var d = {html:conteudo,idopcoes:ltema.name};
			var opcoesNode = new YAHOO.widget.HTMLNode(d, node, false,true);
			opcoesNode.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraOpcoes, 1);
		}
		if(i3GEO.arvoreDeCamadas.OPCOESLEGENDA == true){
			var conteudo = $trad("p3");
			var d = {html:conteudo,idlegenda:ltema.name};
			var opcoesNode = new YAHOO.widget.HTMLNode(d, node, false,true);
			opcoesNode.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda, 1);
		}	
		node.loadComplete();
		//YAHOO.log("Opções OK", "i3geo");	
	},
	/*
	Private: i3GEO.arvoreDeCamadas.mostraOpcoes
	
	Monta os nós filhos do nó "opções"
	
	Parameter:
	
	node {YAHOO.widget.HTMLNode}
	*/
	mostraOpcoes: function(node){
		//YAHOO.log("Mostrando as opções da árvore de camadas", "i3geo");
		var idtema = node.data.idopcoes;
		var ltema = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		var tnome = "<span onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t19")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" >"+$trad("t20")+"</span> "+$inputText("","","tr"+ltema.name,"","3",ltema.transparency)+"<img  class='tic' style='position:relative;top:3px;' onclick='i3GEO.tema.mudatransp(\""+ltema.name+"\")' src='"+i3GEO.util.$im("branco.gif")+"' />";
		var d = {html:tnome};
		var n = new YAHOO.widget.HTMLNode(d, node, false,true);
		n.isLeaf = true;
		var tnome = "<span onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t21a")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" />"+$trad("t21")+" </span>"+$inputText("","","nn"+ltema.name,"","10","")+"<img  class='tic' style='position:relative;top:3px;' onclick='i3GEO.tema.mudanome(\""+ltema.name+"\")' src='"+i3GEO.util.$im("branco.gif")+"' />";
		var d = {html:tnome};
		var n = new YAHOO.widget.HTMLNode(d, node, false,true);
		n.isLeaf = true;
		if ((ltema.type < 3) && (ltema.connectiontype != 7)){
			var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t22")+"','');\" onclick='i3GEO.tema.dialogo.procuraratrib(\""+ltema.name+"\")'>"+$trad("t23")+" </a>";
			var d = {html:tnome};
			var n = new YAHOO.widget.HTMLNode(d, node, false,true);
			n.isLeaf = true;
			var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t24")+"','');\" onclick='i3GEO.tema.dialogo.toponimia(\""+ltema.name+"\")'>"+$trad("t25")+" </a>";
			var d = {html:tnome};
			var n = new YAHOO.widget.HTMLNode(d, node, false,true);
			n.isLeaf = true;
			var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t26")+"','');\" onclick='i3GEO.tema.dialogo.etiquetas(\""+ltema.name+"\")'>"+$trad("t27")+" </a>";
			var d = {html:tnome};
			var n = new YAHOO.widget.HTMLNode(d, node, false,true);
			n.isLeaf = true;
			var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t28")+"','');\" onclick='i3GEO.tema.dialogo.filtro(\""+ltema.name+"\")'>"+$trad("t29")+" </a>";
			var d = {html:tnome};
			var n = new YAHOO.widget.HTMLNode(d, node, false,true);
			n.isLeaf = true;
			var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t30")+"','');\" onclick='i3GEO.tema.dialogo.tabela(\""+ltema.name+"\")'>"+$trad("t31")+" </a>";
			var d = {html:tnome};
			var n = new YAHOO.widget.HTMLNode(d, node, false,true);
			n.isLeaf = true;
			if(objmapa.versaoms > 4){
				var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t37")+"','');\" onclick='i3GEO.tema.dialogo.graficotema(\""+ltema.name+"\")'>"+$trad("t37")+" </a>";
				var d = {html:tnome};
				var n = new YAHOO.widget.HTMLNode(d, node, false,true);
				n.isLeaf = true;
			}
		}
		if (ltema.type < 4){
			var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t32")+"','');\" onclick='i3GEO.tema.dialogo.editaLegenda(\""+ltema.name+"\")'>"+$trad("t33")+" </a>";
			var d = {html:tnome};
			var n = new YAHOO.widget.HTMLNode(d, node, false,true);
			n.isLeaf = true;
		}
		var tnome = "<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t34")+"','');\" onclick='i3GEO.navega.destacaTema.inicia(\""+ltema.name+"\")'>"+$trad("t35")+" </a>";
		var d = {html:tnome};
		var n = new YAHOO.widget.HTMLNode(d, node, false,true);
		n.isLeaf = true;
		node.loadComplete();
		//YAHOO.log("Opções OK", "i3geo");
	},
	/*
	Private: i3GEO.arvoreDeCamadas.mostraLegenda
	
	Monta os nós filhos do nó "legenda"
	
	Parameter:
	
	node - {YAHOO.widget.HTMLNode}
	*/
	mostraLegenda: function(node){
		//YAHOO.log("Mostrando a legenda da árvore de camadas", "i3geo");
		var idtema = node.data.idlegenda;
		var ltema = i3GEO.arvoreDeCamadas.pegaTema(idtema);
		var retorna = function(retorno){
			if (retorno.data.legenda){
				var original = retorno;
				var retorno = retorno.data.legenda;
				if (retorno[0]){
					if ((navn) && (!retorno[0].imagem)){var tabela = retorno;}
					else{
						var i = retorno[0].imagem;
						var re = new RegExp("tiff", "g");
						var i = i.replace(re,'png');
						var tabela = "<img src='"+i+"' />";
					}					
					retorno = "";
				}
				else{
					var linhas = retorno.split("#");
					if (linhas.length > 1){
						var linhas = retorno.split("|");
						var tabela = "<table >";
						var linha = linhas.length-1;
						if(linha >= 0){
							do{
								var colunas = linhas[linha].split("#");
								var id = colunas[0]+"-"+colunas[1];
								var re = new RegExp("'", "g");
								var exp = colunas[3].replace(re,'"');
								tabela += "<tr style='border-top:1px solid rgb(240,240,240);'><td><img src='"+colunas[4]+"' </td><td style='text-align:left'>"+colunas[2]+"</td></tr>";
							}
							while(linha--)
						}
						tabela += "</table><br>";
					}
					else{tabela = retorno;}
				}
			}
			else {var tabela = "<img src='"+retorno.data[0].imagem+"' />";} //o tema é um wms
			var incluir = "<div style='text-align:left' id='"+idtema+"verdiv"+"'>"+tabela+"</div>";
			var d = {html:incluir};
			var nodeLeg = new YAHOO.widget.HTMLNode(d, node, false,false);
			node.loadComplete();
			//
			//desliga os checkbox que foram desativados
			//pega os objetos input
			//
			var elementos = document.getElementById(idtema+"verdiv").getElementsByTagName("input");
			var nelementos = elementos.length;
			var inputs = new Array();
			var i = 0;
			if (nelementos > 0){
				do{
					if (elementos[i].type == "checkbox"){inputs.push(elementos[i]);}
					i++;
				}
				while(i < nelementos)
			}
			if(original.data.desativar){
				var desativar = original.data.desativar;
				var nindices = desativar.length;
				var i = 0;
				if (nindices > 0){
					do{
						inputs[desativar[i]].checked = false;
						i++;
					}
					while(i < nindices)
				}
			}
		};
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&template=legenda2.htm&tema="+idtema+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"criaLegenda",retorna);
	},
	/*
	Function: i3GEO.arvoreDeCamadas.atualizaLegenda
	
	Atualiza a legenda de um tema.
	
	A legenda precisa ser atualizada emalgumas circunstâncias, como quando é feitoumzoom no mapa.
	
	Parameter:
	
	id {String} - ID (name) do tema
	*/
	atualizaLegenda: function(idtema){
		//YAHOO.log("Atualizando a legenda da árvore de camadas", "i3geo");
		if(document.getElementById(idtema+"verdiv"))
		{
			var node = i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idlegenda",idtema);
			if(node)
			{
				i3GEO.arvoreDeCamadas.ARVORE.removeChildren(node);
				this.mostraLegenda(node);
			}
		}
		//YAHOO.log("Legenda OK", "i3geo");
	},
	/*
	Private: i3GEO.arvoreDeCamadas.inverteStatusClasse
	
	Liga ou desliga uma classe da legenda.
	
	A chamada dessa função é definida em aplicmap/legenda2.htm
	
	Parameters:
	
	leg {Object input} - objeto do tipo INPUT com o id da classe e o id do tema
	
	*/
	inverteStatusClasse: function (leg){
		//YAHOO.log("Invertendo o status da árvore de camadas", "i3geo");
		var temp = function()
		{ajaxredesenha("");};
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+i3GEO.arvoreDeCamadas.SID+"&tema="+leg.name+"&classe="+leg.value;
		cpObj.call(p,"inverteStatusClasse",temp);
	},	
	/*
	Private: i3GEO.arvoreDeCamadas.montaTextoTema
	
	Monta o texto com o título do tema. Esse texto é o que será mostrado nos nós principais da árvore e
	contém o checkbox para ligar e desligar o tema.
	
	Parameters:
	
	tema - {Object} - objeto JSON com as propriedades do tema
	
	Return:
	
	{String} - texto formatado
	*/
	montaTextoTema: function(tema){
		var ck = "";
		if(tema.status == 2){var ck = ' CHECKED ';}
		var html = "";
		html += "<p id='arrastar_"+tema.name+"' style='text-align:left;font-size:11px;' ><input class=inputsb style='cursor:pointer;' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t3")+"','ligadesliga')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" type='checkbox' name=\"layer\" value='"+tema.name+"' "+ ck ;

		if(i3GEO.arvoreDeCamadas.ATIVATEMA != "")
		html += "onclick=\""+i3GEO.arvoreDeCamadas.ATIVATEMA+"\"";
		else
		html += "onclick='i3GEO.util.criaBotaoAplicar(\"i3GEO.arvoreDeCamadas.aplicaTemas\",\""+$trad("p14")+"\",\"i3geoBotaoAplicarCamadas\",this)'";
		html += " />";
		if (tema.contextoescala == "sim")
		{html += "&nbsp;<img src="+i3GEO.util.$im("contextoescala.png")+" title='"+$trad("t36")+"' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t36")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}				
		if (tema.sel == "sim") //o tema tem selecao
		{html += "&nbsp;<img src="+i3GEO.util.$im("estasel.png")+" title='"+$trad("t4")+"' onclick='i3GEO.tema.limpasel(\""+tema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t5")+"','limpasel')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}
		if ((tema.download == "sim") || (tema.download == "SIM"))
		{html += "&nbsp;<img src="+i3GEO.util.$im("down1.gif") +" title='download' onclick='download(\""+tema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t7")+"','download')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}
		html += "&nbsp;<span style='cursor:move'>"+tema.tema+"</span>";
		html += "</p>";
		return(html);
	},
	/*
	Function: i3GEO.arvoreDeCamadas.atualizaFarol
	
	Atualiza o farol de cada tema.
	
	O farol identifica a compatibilidade da escala do mapa com a escala de cada tema
	
	Parameters:
	
	mapscale {Numeric} - escala de comparação com a escala de cada tema
	*/
	atualizaFarol: function(mapscale)
	{
		//YAHOO.log("Atualizando o farol da árvore de camadas", "i3geo");
		var farol = "maisamarelo.png";
		var l = i3GEO.arvoreDeCamadas.CAMADAS.length-1;
		if (l >= 0){
			do{
				var ltema = i3GEO.arvoreDeCamadas.CAMADAS[l];
				var escala = ltema.escala;
				if (escala*1 < mapscale*1)
				{var farol = "maisverde.png";}
				if (escala*1 > mapscale*1)
				{var farol = "maisvermelho.png";}
				if (escala*1 == 0)
				{var farol = "maisamarelo.png";}
				if ($i("farol"+ltema.name)){
					$i("farol"+ltema.name).src = g_locaplic+"/imagens/"+farol;
				}
			}
			while(l--)
		}
		//YAHOO.log("Farol OK", "i3geo");
	},
	/*
	Function: i3GEO.arvoreDeCamadas.aplicaTemas
	
	Refaz o mapa ligando e desligando os temas conforme consta na árvore de camadas
	*/
	aplicaTemas: function(){
		//YAHOO.log("Mudando status ligado/desligado de um tema", "i3geo");
		var t = i3GEO.arvoreDeCamadas.listaLigadosDesligados();
		//
		//zera o contador de tempo
		//
		var temp = function(){
			objmapa.atualizaCorpoMapa();
			i3GEO.janela.fechaAguarde("redesenha");
		};
		clearTimeout(objmapa.tempo);
		objmapa.tempo = "";
		i3GEO.janela.abreAguarde("redesenha",$trad("o1"));
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+(t[1].toString())+"&ligar="+(t[0].toString())+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"ligaDesligaTemas",temp);
	},
	/*
	Function: i3GEO.arvoreDeCamadas.listaLigadosDesligados
	
	Lista os temas que estão ligados e os que estão desligados.
	
	Return:
	{Array} - array com os códigos dos temas [0]=ligados [1]=desligados [2]=todos na ordem encontrada
	*/
	listaLigadosDesligados: function(){
		var nos = i3GEO.arvoreDeCamadas.ARVORE.getNodesByProperty("tipo","tema");
		var ligados = new Array();
		var desligados = new Array();
		var todos = new Array();
		var n = nos.length;
		var i=0;
		do{
			try{
				var no = nos[i].getEl();
				var cs = no.getElementsByTagName("input");
				var csn = cs.length;
				for(j=0;j<csn;j++){
					var c = cs[j];
					if(c.name=="layer"){
						if(c.checked == true)
						{ligados.push(c.value);}
						else
						{desligados.push(c.value);}
						todos.push(c.value);
					}
				}
				i++;
			} catch(e){i++;}
		}
		while(i<n)
		var lista = new Array(ligados,desligados,todos);
		return (lista);
	},
	/*
	Function: i3GEO.arvoreDeCamadas.comparaTemas
	
	Compara se dois objetos com as camadas são iguais
	
	Parameters:
	
	novo {JSON} - objeto novo
	
	atual {JSON} - objeto atual
	
	Return:
	
	{Boolean}
	*/
	comparaTemas: function(novo,atual){
		var novon = novo.length;
		if(novon != atual.length){return (false);}
		for (i=0;i<novon;i++){
			if(novo[i].name != atual[i].name){return (false);}
			if(novo[i].tema != atual[i].tema){return (false);}
			if(novo[i].sel != atual[i].sel){return (false);}
		}
		return(true);
	},
	/*
	Function: i3GEO.arvoreDeCamadas.pegaTema
	
	Procura um tema no objeto CAMADAS.
	
	Parameters:
	
	idtema - {String} ID do tema que será procurado
	
	Return:
	
	{JSON}
	*/
	pegaTema: function pegatema(idtema){
		var c = i3GEO.arvoreDeCamadas.CAMADAS.length;
		for (i=0; i<c; i++){
			if(i3GEO.arvoreDeCamadas.CAMADAS[i].name == idtema)
			{var ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];return (ltema);}
		}	
	}
};
//
//para efeitos de compatibilidade
i3GEO.arvoreDeCamadas.IDHTML = "listaTemas";