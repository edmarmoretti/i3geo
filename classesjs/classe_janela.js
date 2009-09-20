/*
Title: Janelas

Arquivo:

i3geo/classesjs/classe_janela.js

Licenca:

GPL2

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
	i3GEO = [];
}
/*
Classe: i3GEO.janela

Abre janelas flutuantes

As janelas são criadas por meio da biblioteca YUI
*/
i3GEO.janela = {
	/*
	Propriedade: AGUARDEMODAL
	
	Indica se a janela de aguarde será do tipo MODAL, ou seja, se irá ou não bloquear as opções do mapa.
	
	Tipo:
	{Boolean}
	
	Default:
	{false}
	*/
	AGUARDEMODAL: false,
	/*
	Propriedade: ANTESCRIA
	
	Lista com os nomes das funções que serão executadas antes de abrir a janela.
	
	Este é um array que pode ser modificado utilizando-se as funções javascript de
	manipulação de arrays.
	
	Tipo:
	{Array}
	
	Default:
	{"i3GEO.janela.prepara()"}
	*/
	ANTESCRIA: new Array(
		"i3GEO.janela.prepara()"
	),
	/*
	Propriedade: ANTESFECHA
	
	Lista com os nomes das funções que serão executadas após fechar a janela.
	
	Este é um array que pode ser modificado utilizando-se as funções javascript de
	manipulação de arrays.
	
	Tipo:
	{Array}
	
	Default:
	{[]}
	*/
	ANTESFECHA: [],
	/*
	Variavel: TIPS
	
	Lista os tips inseridos no mapa, possibilitando sua remoção em lote
	*/
	TIPS: [],
	/*
	Function: prepara
	
	Executa funções default antes de abrir a janela
	*/
	prepara: function(){
		//
		//esconde o box de zoom e outros objetos temporários se estiverem visíveis
		//
		i3GEO.util.escondePin();
		i3GEO.util.escondeBox();
	},
	/*
	Function: cria
	
	Cria uma janela flutuante.
	
	Vc pode obter o elemento HTML interno da janela por meio de:
	
	{retorno}[2].innerHTML
	
	Parametros:
	
	wlargura {integer} - largura da janela em pixels
	
	waltura {integer} - altura da janela em pixels
	
	wsrc {String} - URL que será incluída no SRC do iframe interno da janela. Se for "", o iframe não será criado
	
	nx {Integer} - posição x da janela em pixels. Se for "" será fixada no centro
	
	ny {Integer} - posição y da janela em pixels. Se for "" será fixada no centro

	texto {String} - texto do cabeçalho
	
	id {String} - (opcional) nome que será dado ao id que conterá a janela. Se não for definido, será usado o id="wdoca". O
		id do iframe interno é sempre igual ao id + a letra i. Por default, será "wdocai".
		O id do cabçalho será igual a id+"_cabecalho" e o id do corpo será id+"_corpo".
		O id também é utilizado na função de fechamento da janela. Quando for usada a técnica de
		script tag, ao fechar a janela a função de mesmo nome do id será definida como "null".
	
	modal {Boolean} - (opcional) indica se a janela bloqueará as inferiores ou não. Por default é false
	
	classe {String} - (opcional) classe CSS que será aplicada à barra de menu. Por default o valor é hd2

	Return:
	
	{Array} Array contendo: objeto YAHOO.panel criado,elemento HTML com o cabecalho, elemento HTML com o corpo
	*/
	cria: function(wlargura,waltura,wsrc,nx,ny,texto,id,modal,classe,funcaoCabecalho){
		if(i3GEO.janela.ANTESCRIA){
			for(i=0;i<i3GEO.janela.ANTESCRIA.length;i++)
			{eval(i3GEO.janela.ANTESCRIA[i]);}
		}
		//
		//por default o id será 'wdoca'
		//
		if (arguments.length < 7 || id == ""){
			var id = "wdoca";
			var modal = false;
			var classe = "hd";
			var funcaoCabecalho = null;
		}
		if (arguments.length == 7){
			var modal = false;
			var classe = "hd";
			var funcaoCabecalho = null;
		}
		if (arguments.length == 8){
			var classe = "hd";
			var funcaoCabecalho = null;
		}
		if (arguments.length == 9){
			var funcaoCabecalho = null;
		}
		var wlargura_ = parseInt(wlargura)+0+"px";
		YAHOO.namespace("janelaDoca.xp");
		if ($i(id))
		{YAHOO.janelaDoca.xp.panel.destroy();}
		if($i(id+"_c"))
		{$i("i3geo").removeChild($i(id+"_c"));}
		if($i(id))
		{$i("i3geo").removeChild($i(id));}
		var ins = '<div id="'+id+'_cabecalho" class="hd">';
		ins += "<span><img id='"+id+"_imagemCabecalho' style='visibility:hidden;' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>";
		ins += texto;
		ins += '</div><div id="'+id+'_corpo" class="bd" style="padding:5px">';
		if(wsrc != "")
		ins += '<iframe name="'+id+'i" id="'+id+'i" valign="top" style="border:0px white solid"></iframe>';
		ins += '</div>';
		var novoel = document.createElement("div");
		novoel.id = id;
		novoel.style.display="block";
		novoel.innerHTML = ins;
		if($i("i3geo"))
		{$i("i3geo").appendChild(novoel);}
		else
		{document.body.appendChild(novoel);}
		var wdocaiframe = $i(id+"i");
		if(wdocaiframe)
		{
			with (wdocaiframe.style){width = parseInt(wlargura)-12;height=waltura;};
			wdocaiframe.style.display = "block";
			wdocaiframe.src = wsrc;
		}
		else{
			$i(id+'_corpo').style.height=waltura;
		}
		var fix = false;
		if(nx == "" || nx == "center"){var fix = true;}
		if(waltura == "auto")
		YAHOO.janelaDoca.xp.panel = new YAHOO.widget.Panel(id, { zIndex:15000, modal:modal, width: wlargura_,underlay:"none", fixedcenter: fix, constraintoviewport: false, visible: true,monitorresize:false,dragOnly:true,keylisteners:null} );	
		else
		YAHOO.janelaDoca.xp.panel = new YAHOO.widget.ResizePanel(id, { zIndex:15000, modal:modal, width: wlargura_, fixedcenter: fix, constraintoviewport: false, visible: true,monitorresize:false,dragOnly:true,keylisteners:null} );
		if(nx != "" && nx != "center"){
			var pos = new Array(nx,ny);
			YAHOO.janelaDoca.xp.panel.moveTo(pos[0],pos[1]+50);
		}
		YAHOO.janelaDoca.xp.panel.render();
		if(i3GEO.Interface.ATUAL=="googleearth"){var classe = "bd";}
		var temp = $i(id+'_cabecalho');
		temp.className = classe;
		if(funcaoCabecalho)
		{temp.onclick = funcaoCabecalho;}
		YAHOO.util.Event.addListener(YAHOO.janelaDoca.xp.panel.close, "click", i3GEO.janela.fecha,YAHOO.janelaDoca.xp.panel,{id:id},true);
		return(new Array(YAHOO.janelaDoca.xp.panel,$i(id+"_cabecalho"),$i(id+"_corpo")));
	},
	/*
	Function: fecha
	
	Aplica a opção definida em ANTESFECHA e elimina alguns objetos que são comumente adicionados por algumas operações do i3geo
	como richdraw, box, pin
	
	Parametros:
	
	id {String} - id da janela que será fechada
	*/
	fecha: function(event){
		if(i3GEO.Interface.ATUAL == "googleearth"){
			//YAHOO.janelaDoca.xp.panel.moveTo(-2000,-2000);
		}
		//esconde o box do google
		i3GEO.util.escondePin();
		i3GEO.util.escondeBox();
		//fecha o container de desenho de elementos na tela
		if($i("divGeometriasTemp"))
		{i3GEO.desenho.richdraw.fecha();}
		if($i("flamingoi")){$i("flamingoi").style.display="block";}
		//executa as funções de fechamento
		if(i3GEO.janela.ANTESFECHA){
			for(i=0;i<i3GEO.janela.ANTESFECHA.length;i++)
			{eval(i3GEO.janela.ANTESFECHA[i]);}
		}
		//YAHOO.janelaDoca.xp.panel.destroy();
		if($i(this.id+"_c"))
		document.body.removeChild($i(this.id+"_c"));
		if($i(this.id))
		document.body.removeChild($i(this.id));
		//
		//remove script tag se houver
		//
		try{
			var old = $i("loadscriptI3GEO");
			if (old != null) {
				old.parentNode.removeChild(old);
				delete old;
				if(this.id)
				eval(this.id+" = null;");
			}
			var old = $i(this.id+"_script");
			if (old != null) {
				old.parentNode.removeChild(old);
				delete old;
				eval("delete " + this.id);
			}
		}
		catch(erro){}
	},
	/*
	Function: alteraTamanho
	
	Altera o tamanho de uma janela aberta
	
	Parametros:
	
	w {Integer} - nova largura
	
	h {Integer} - nova altura
	
	id {String} - (opcional) id que identifica a janela aberta, por padrão utiliza "wdoca"
	*/
	alteraTamanho: function(w,h,id){
		if(arguments.length == 3)
		{var i = $i(id);}
		else
		{var i = $i("wdoca");}
		if(i){
			i.style.width = w;
			i.style.height = h;
		}
	},
	/*
	Function: abreAguarde
	
	Abre uma janela com a mensagem de agurde e bloqueia cliques nomapa
	
	Parametros:
	
	id {String} - id danovajanela
	
	texto {String} - texto da janela
	*/
	abreAguarde: function(id,texto){
		//YAHOO.log("abreAguarde", "janela");
		document.body.style.cursor = "wait";
		if($i(id+"_mask"))
		{document.body.removeChild($i(id+"_mask"));}
		if($i(id+"_c"))
		{document.body.removeChild($i(id+"_c"));}
		YAHOO.namespace("aguarde."+id);
		var pos = [0,0];
		if($i("corpoMapa"))
		{var pos = YAHOO.util.Dom.getXY($i("corpoMapa"));}
		else if ($i("contemImg"))
		{var pos = YAHOO.util.Dom.getXY($i("contemImg"));}
		texto += "<br><span style='color:navy;cursor:pointer;font-size:9px;' onclick='javascript:if(i3GEO.janela.AGUARDEMODAL == true){i3GEO.janela.AGUARDEMODAL = false;}else{i3GEO.janela.AGUARDEMODAL = true;}'>bloquear/desbloquear</span>";
		var contador = "";
		for(var index=0; index<i3GEO.contadorAtualiza; index++) {
			contador = contador + ".";
		}
		eval ('YAHOO.aguarde.'+id+' = new YAHOO.widget.Panel("'+id+'",{width:"240px",fixedcenter:false,underlay:"none",close:true,draggable:false,modal:'+i3GEO.janela.AGUARDEMODAL.toString()+',monitorresize:false})');
		eval ('YAHOO.aguarde.'+id+'.setBody(texto)');
		eval ('YAHOO.aguarde.'+id+'.body.style.padding="5px"');
		eval ('YAHOO.aguarde.'+id+'.setHeader("<span><img id=aguardeGifAberto src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>&nbsp;<span style=font-size:8px >'+contador+'</span>")');
		eval ('YAHOO.aguarde.'+id+'.render(document.body)');
		if($i("flamingo"))
		{eval ('YAHOO.aguarde.'+id+'.moveTo(0,0)');}
		else
		{eval ('YAHOO.aguarde.'+id+'.moveTo('+pos[0]+','+pos[1]+')');}
		eval ('YAHOO.aguarde.'+id+'.show()');
		if($i(id+"_mask")){$i(id+"_mask").style.zIndex=5000;}
		if($i(id+"_c"))
		{$i(id+"_c").style.zIndex=6000;}
		//YAHOO.log("Fim abreAguarde", "janela");	
	},
	/*
	Function: tip
	
	Cria um DIV e posiciona sobre o mapa na posição do mouse.
	
	Parametro:
	
	cabecalho {String} - texto que será usado no cabeçalho (opção fixar) (opcional)
	
	Return:
	
	ID do DIV criado
	*/
	tip: function(cabecalho){
		if(arguments.length == 0){var cabecalho = "fixar";}
		var Nid = YAHOO.util.Dom.generateId();
		var i = $i("i3geo_rosa");
		if(i)
		i.style.display="none";
		if ($i(i3GEO.Interface.IDCORPO))
		{$i("img").title = "";}
		//insere div para tips
		var novoel = document.createElement("div");
		novoel.id = Nid;
		novoel.style.position="absolute";
		novoel.style.zIndex=5000;
		novoel.style.textAlign="left";
		novoel.style.background="white";
		if (navm)
		{novoel.style.filter = "alpha(opacity=90)";}
		else
		{novoel.style.opacity = ".9";}
		document.body.appendChild(novoel);
		i3GEO.janela.TIPS.push($i(Nid));
		//
		//monta o TIP com o id único criado
		//quando o usuário escolhe a opção de fixar,
		//o div é incluido no array i3GEO.janela.TIPS
		//quando o mapa é redesenhado, esses elementos são excluídos do mapa
		//
		var res = "<div id='"+Nid+"cabecatip' style='text-align:left;background-color:rgb(240,240,240)'>";
		res += "<span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:$i(\""+Nid+"cabecatip\").innerHTML =\"\";' >"+cabecalho+"</span></div>";
		novoel.innerHTML = "<table style='text-align:left'><tr><td style='text-align:left'>"+res+"</td></tr></table>";
		ist = novoel.style;
		ist.top = objposicaocursor.telay - 9;
		ist.left = objposicaocursor.telax - 5;
		ist.display="block";
		//
		//registra a função de eliminação dos tips
		//
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.janela.excluiTips('todos')") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.janela.excluiTips('todos')");}	
		if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.janela.excluiTips('naofixos')") < 0)
		{i3GEO.eventos.MOUSEMOVE.push("i3GEO.janela.excluiTips('naofixos')");}		
		//
		return(Nid);
	},
	/*
	Function: excluiTips
	
	Exclui os tips armazenados na variável i3GEO.janela.TIPS
	
	Parametro:
	
	tipo {String} - todos|naofixos tipos de tips que serão excluídos
	*/
	excluiTips: function(tipo){
		if(arguments.length == 0){var tipo = "todos";}
		if(i3GEO.janela.TIPS.length > 0){
			var ot = i3GEO.janela.TIPS.length-1;
			if (ot >= 0){
				do{
					if(tipo == 'todos'){
						if(i3GEO.janela.TIPS[ot]){
							var i = $i(i3GEO.janela.TIPS[ot].id);
							document.body.removeChild(i);
						}
					}
					if(tipo == 'naofixos'){
						if ($i(i3GEO.janela.TIPS[ot])){
							if($i(i3GEO.janela.TIPS[ot].id+"cabecatip").innerHTML != ""){
								document.body.removeChild($i(i3GEO.janela.TIPS[ot].id));
							}
						}
					}
				}
				while(ot--)
				if(tipo == "todos")
				{i3GEO.janela.TIPS = [];}
			}
		}
	},
	slider: function(funcao,inicial){
		var janela = i3GEO.janela.cria(230,200,"","","","Opacidade","opacidadeG");
		var novoel = document.createElement("div");
		novoel.id = "slider-bg";
		novoel.tabindex = "-1";
		novoel.innerHTML = '<div style="cursor:default;position:absolute;top:4px" id="slider-thumb"><img src="'+i3GEO.configura.locaplic+'/imagens/thumb-n.gif"></div>';
		janela[2].appendChild(novoel);
    	var Event = YAHOO.util.Event;
        var	Dom   = YAHOO.util.Dom;
        var	lang  = YAHOO.lang;
        var	slider; 
        var	bg="slider-bg";
        var thumb="slider-thumb"; 
        var	valuearea="slider-value";
        var textfield="slider-converted-value";
		novoel.style.position = "relative";
        novoel.style.background= 'url('+i3GEO.configura.locaplic+'/imagens/bg-fader.gif) 5px 0 no-repeat';
        novoel.style.height = "28px";
        novoel.style.width= "228px"; 
    	// The slider can move 0 pixels up
    	var topConstraint = 0;
    	// The slider can move 200 pixels down
    	var bottomConstraint = 200;
    	// Custom scale factor for converting the pixel offset into a real value
    	var scaleFactor = 1;
    	// The amount the slider moves when the value is changed with the arrow
    	// keys
    	var keyIncrement = 20;
    	var tickSize = 20;
    	Event.onDOMReady(function() {
        	slider = YAHOO.widget.Slider.getHorizSlider(bg,thumb, topConstraint, bottomConstraint, 20);
        	slider.setValue(parseInt(inicial));
        	slider.getRealValue = function() {
            	return Math.round(this.getValue() * scaleFactor);
        	};
        	slider.subscribe("slideEnd", function(offsetFromStart) {
            	var actualValue = slider.getRealValue();
            	eval(funcao+"("+actualValue+")");
			});
        });
        // Use setValue to reset the value to white:
        Event.on("putval", "click", function(e) {
            slider.setValue(100, false); //false here means to animate if possible
        });
	},
	/*
	Function: fechaAguarde
	
	Fecha uma janela do tipo aguarde
	
	Paremeters:
	
	id {String} - id da janela que será fechada. Se não for definido, tenta fechar as janelas principais.
	*/
	fechaAguarde: function(id){
		document.body.style.cursor = "default";
		if(arguments.length > 0){
			try{
				eval('YAHOO.aguarde.'+id+'.destroy()');
				if($i(id+"_c"))
				{$i("i3geo").removeChild($i(id+"_c"));}
				if($i(id+"_mask"))
				{$i("i3geo").removeChild($i(id+"_mask"));}
			}
			catch(e){};
		}
		else{
			try{
				i3GEO.janela.fechaAguarde("ajaxdestaca");
				i3GEO.janela.fechaAguarde("ajaxabrelente");
				i3GEO.janela.fechaAguarde("ajaxiniciaParametros");
				i3GEO.janela.fechaAguarde("i3GEO.atualiza");
				i3GEO.janela.fechaAguarde("ajaxCorpoMapaEntorno");
				i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
				i3GEO.janela.fechaAguarde("ajaxLegenda");
				i3GEO.janela.fechaAguarde("ajaxReferencia");
				i3GEO.janela.fechaAguarde("ajaxEscalaGrafica");
				i3GEO.janela.fechaAguarde("montaMapa");
				i3GEO.janela.fechaAguarde("aguardedoc");
				i3GEO.janela.fechaAguarde("ajaxCorpoMapa1");
			}
			catch(e){}	
		}
	}
};
try{
	//controle dos painéis que podem ser redimensionados
	YAHOO.widget.ResizePanel = function(el, userConfig)
	{
    	if (arguments.length > 0) 
    	{YAHOO.widget.ResizePanel.superclass.constructor.call(this, el, userConfig);}
	};
	YAHOO.widget.ResizePanel.CSS_PANEL_RESIZE = "yui-resizepanel";
	YAHOO.widget.ResizePanel.CSS_RESIZE_HANDLE = "resizehandle";
	YAHOO.extend(
		YAHOO.widget.ResizePanel, YAHOO.widget.Panel,{
   			init: function(el, userConfig){
    			YAHOO.widget.ResizePanel.superclass.init.call(this, el);
       			this.beforeInitEvent.fire(YAHOO.widget.ResizePanel);
       			var Dom = YAHOO.util.Dom,
           			Event = YAHOO.util.Event,
           			oInnerElement = this.innerElement,
           			oResizeHandle = document.createElement("DIV"),
           			sResizeHandleId = this.id + "_resizehandle";
       			oResizeHandle.id = sResizeHandleId;
       			oResizeHandle.className = YAHOO.widget.ResizePanel.CSS_RESIZE_HANDLE;
       			Dom.addClass(oInnerElement, YAHOO.widget.ResizePanel.CSS_PANEL_RESIZE);
       			this.resizeHandle = oResizeHandle;
       			function initResizeFunctionality(){
           			var me = this,
               			oHeader = this.header,
               			oBody = this.body,
               			oFooter = this.footer,
               			nStartWidth,
               			nStartHeight,
               			aStartPos,
               			nBodyBorderTopWidth,
               			nBodyBorderBottomWidth,
               			nBodyTopPadding,
               			nBodyBottomPadding,
               			nBodyOffset;
           			oInnerElement.appendChild(oResizeHandle);
           			this.ddResize = new YAHOO.util.DragDrop(sResizeHandleId, this.id);
           			this.ddResize.setHandleElId(sResizeHandleId);
           			this.ddResize.onMouseDown = function(e){
               			nStartWidth = oInnerElement.offsetWidth;
               			nStartHeight = oInnerElement.offsetHeight;
               			if (YAHOO.env.ua.ie && document.compatMode == "BackCompat")
               			{nBodyOffset = 0;}
               			else{
                   			nBodyBorderTopWidth = parseInt(Dom.getStyle(oBody, "borderTopWidth"), 10);
                   			nBodyBorderBottomWidth = parseInt(Dom.getStyle(oBody, "borderBottomWidth"), 10);
                   			nBodyTopPadding = parseInt(Dom.getStyle(oBody, "paddingTop"), 10);
                   			nBodyBottomPadding = parseInt(Dom.getStyle(oBody, "paddingBottom"), 10);
                   			nBodyOffset = nBodyBorderTopWidth + nBodyBorderBottomWidth + nBodyTopPadding + nBodyBottomPadding;
               			}
               			me.cfg.setProperty("width", nStartWidth + "px");
               			aStartPos = [Event.getPageX(e), Event.getPageY(e)];
           			};
           			this.ddResize.onDrag = function(e){
               			var aNewPos = [Event.getPageX(e), Event.getPageY(e)],
                   			nOffsetX = aNewPos[0] - aStartPos[0],
                   			nOffsetY = aNewPos[1] - aStartPos[1],
                   			nNewWidth = Math.max(nStartWidth + nOffsetX, 10),
                   			nNewHeight = Math.max(nStartHeight + nOffsetY, 10),
                   			nBodyHeight = (nNewHeight - (oFooter.offsetHeight + oHeader.offsetHeight + nBodyOffset));
               			me.cfg.setProperty("width", nNewWidth + "px");
               			if (nBodyHeight < 0)
               			{nBodyHeight = 0;}
               			oBody.style.height =  nBodyHeight + "px";
               			if ($i("wdocai"))
               			{$i("wdocai").style.height = nBodyHeight;}
           			};
       			};
       			function onBeforeShow(){
       				initResizeFunctionality.call(this);
       				this.unsubscribe("beforeShow", onBeforeShow);
       			};
       			function onBeforeRender(){
           			if (!this.footer)
           			{this.setFooter("");}
           			if (this.cfg.getProperty("visible"))
           			{initResizeFunctionality.call(this);}
           			else
           			{this.subscribe("beforeShow", onBeforeShow);}
       				this.unsubscribe("beforeRender", onBeforeRender);
       			};
       			this.subscribe("beforeRender", onBeforeRender);
       			if (userConfig)
       			{this.cfg.applyConfig(userConfig, true);}
       			this.initEvent.fire(YAHOO.widget.ResizePanel);
   			},
   			toString: function()
   			{return "ResizePanel " + this.id;}
		}
	);
}
catch(e){};
//YAHOO.log("carregou classe janela", "Classes i3geo");
