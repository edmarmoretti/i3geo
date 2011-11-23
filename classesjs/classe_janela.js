/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
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
YAHOO.namespace("janelaDoca.xp");
YAHOO.janelaDoca.xp.manager = new YAHOO.widget.OverlayManager();
/*
Classe: i3GEO.janela

Abre janelas flutuantes

As janelas são criadas por meio da biblioteca YUI
*/
i3GEO.janela = {
	/*
	Propriedade: ESTILOABD

	Estilo que será aplicado ao elemento body da janela (class='bd')

	Tipo:
	{String}

	Default:
	{display:block;padding:5px 0px 5px 2px}
	*/
	ESTILOBD: "display:block;padding:5px 2px 5px 2px;",
	/*
	Propriedade: ESTILOAGUARDE

	Estilo da janela de aguarde

	Pode ser normal|reduzida|minima

	Tipo:
	{String}

	Default:
	{normal}
	*/
	ESTILOAGUARDE: "normal",
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
	ANTESCRIA: ["i3GEO.janela.prepara()"],
	/*
	Propriedade: ANTESFECHA

	Lista com os nomes das funções que serão executadas antes de fechar a janela.

	Este é um array que pode ser modificado utilizando-se as funções javascript de
	manipulação de arrays.

	Tipo:
	{Array}

	Default:
	{[]}
	*/
	ANTESFECHA: [],
	/*
	Propriedade: TRANSICAOSUAVE

	Altera a transparência das janelas quando o mouse sobrepõe e quando sai (não é ativado no navegador IE)

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	TRANSICAOSUAVE: true,
	/*
	Propriedade: OPACIDADE

	Valor da opacidade miníma utilizada quando TRANSICAOSUAVE for igual a true.

	Varia de 0 a 100

	Tipo:
	{numeric}

	Default:
	{65}
	*/
	OPACIDADE: 65,
	/*
	Propriedade: OPACIDADEAGUARDE

	Valor da opacidade da janela de aguarde.

	Varia de 0 a 100

	Tipo:
	{numeric}

	Default:
	{50}
	*/
	OPACIDADEAGUARDE: 50,	
	/*
	Variavel: TIPS

	Lista os tips inseridos no mapa, possibilitando sua remoção em lote
	*/
	TIPS: [],
	/*
	Variavel: ULTIMOZINDEX

	Cada vez que uma janela flutuante é criada, esse valor é acrescido de 1
	*/
	ULTIMOZINDEX : 0,
	/*
	Variavel: JANELASAGUARDE

	Guarda os ids das janelas 'aguarde' que foram abertos
	*/
	JANELASAGUARDE: [],
	/*
	Function: prepara

	Executa funções default antes de abrir a janela
	*/
	prepara: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.prepara()");}
		//
		//esconde o box de zoom e outros objetos temporários se estiverem visíveis
		//
		var iu = i3GEO.util;
		iu.escondePin();
		iu.escondeBox();
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

	classe {String} - (opcional) classe CSS que será aplicada à barra de menu. Por default o valor é hd2. Na interface Google Earth, esse valor é sempre alterado para "hd".

	funcaoCabecalho {function} - (opcional) funcao que será executada quando o usuário clicar no cabecalho

	funcaoMinimiza {function} - (opcional) funcao que será executada para minimizar a janela

	Return:

	{Array} Array contendo: objeto YAHOO.panel criado,elemento HTML com o cabecalho, elemento HTML com o corpo
	*/
	cria: function(wlargura,waltura,wsrc,nx,ny,texto,id,modal,classe,funcaoCabecalho,funcaoMinimiza){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.cria()");}
		var i,wlargurA ,ins,novoel,wdocaiframe,pos,temp,fix,underlay,ifr;
		if(navm && !chro)
		{this.TRANSICAOSUAVE = false;}
		if(this.ANTESCRIA){
			for(i=0;i<this.ANTESCRIA.length;i++)
			{eval(this.ANTESCRIA[i]);}
		}
		//
		//por default o id será 'wdoca'
		//
		if (arguments.length < 7 || id === ""){
			id = "wdoca";
			modal = false;
			classe = "hd";
			funcaoCabecalho = null;
			funcaoMinimiza = null;
		}
		if (arguments.length === 7){
			modal = false;
			classe = "hd";
			funcaoCabecalho = null;
			funcaoMinimiza = null;
		}
		if (arguments.length === 8){
			classe = "hd";
			funcaoCabecalho = null;
			funcaoMinimiza = null;
		}
		if (arguments.length === 9){
			funcaoCabecalho = null;
			funcaoMinimiza = null;
		}
		if (arguments.length === 10){
			funcaoMinimiza = null;
		}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{
			classe = "hd";
			i3GEO.janela.TRANSICAOSUAVE = false;
		}
		//if((navm) && i3GEO.Interface.ATUAL === "googleearth")
		//{funcaoMinimiza = null;}
		wlargurA = parseInt(wlargura,10)+2+"px";
		if($i(id))
		{YAHOO.janelaDoca.xp.panel.destroy();}
		i3GEO.util.removeChild(id+"_c");
		i3GEO.util.removeChild(id);

		ins = '<div id="'+id+'_cabecalho" class="'+classe+'" style="background-color:white;">';
		if(i3GEO.configura !== undefined)
		{ins += "<img id='"+id+"_imagemCabecalho' style='z-index:2;position:absolute;left:3px;top:2px;visibility:hidden;' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";}
		ins += texto;
		if(funcaoMinimiza)
		{ins += "<div id='"+id+"_minimizaCabecalho' class='container-minimiza'></div>";}
		ins += '</div><div id="'+id+'_corpo" class="bd" style="'+this.ESTILOBD+'">';
		if(wsrc !== "")
		{ins += '<iframe name="'+id+'i" id="'+id+'i" valign="top" style="border:0px white solid"></iframe>';}
		ins += '</div>';
		novoel = document.createElement("div");
		novoel.id = id;
		novoel.style.display="block";
		//novoel.style.border = "1px solid rgb(120 120 120)";
		novoel.innerHTML = ins;
		if(this.TRANSICAOSUAVE ){
			novoel.onmouseover = function(){
				YAHOO.util.Dom.setStyle(novoel,"opacity",1);
			};
			novoel.onmouseout = function(){
				YAHOO.util.Dom.setStyle(novoel,"opacity",i3GEO.janela.OPACIDADE / 100);
			};
			YAHOO.util.Dom.setStyle(novoel,"opacity",1);
		}
		document.body.appendChild(novoel);
		wdocaiframe = $i(id+"i");
		if(wdocaiframe){
			temp = wdocaiframe.style;
			temp.width = parseInt(wlargura,10)-12;
			temp.height = waltura;
			temp.display = "block";
			wdocaiframe.src = wsrc;
		}
		else{
			if(waltura !== "auto")
			{$i(id+'_corpo').style.height=parseInt(waltura,10);}
			$i(id+'_corpo').style.width=parseInt(wlargura,10);
			if(navm)
			{$i(id+'_corpo').style.width=parseInt(wlargura,10)+2;}
		}
		fix = false;
		if(nx === "" || nx === "center")
		{fix = true;}
		if(modal === true)
		{underlay = "none";}
		else
		{underlay = "shadow";}
		if(i3GEO.Interface.ATUAL === "googleearth" || i3GEO.Interface.ATUAL === "flamingo")
		{ifr = true;}
		else
		{ifr = false;}
		if(waltura === "auto")
		{YAHOO.janelaDoca.xp.panel = new YAHOO.widget.Panel(id, { iframe:ifr,modal:modal, width: wlargurA,underlay:"none", fixedcenter: fix, constraintoviewport: false, visible: true,monitorresize:false,dragOnly:true,keylisteners:null} );}
		else{YAHOO.janelaDoca.xp.panel = new YAHOO.widget.ResizePanel(id, { iframe:ifr,underlay:underlay, modal:modal, width: wlargurA, fixedcenter: fix, constraintoviewport: false, visible: true,monitorresize:false,dragOnly:true,keylisteners:null} );}
		if(nx !== "" && nx !== "center"){
			YAHOO.janelaDoca.xp.panel.moveTo(nx,ny + 50);
		}
		YAHOO.janelaDoca.xp.manager.register(YAHOO.janelaDoca.xp.panel);
		if(this.TRANSICAOSUAVE ){
			YAHOO.janelaDoca.xp.panel.cfg.setProperty("effect",[
					{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.5}
			]);
		}
		YAHOO.janelaDoca.xp.panel.render();
		if(navm && id !== "i3geo_janelaMensagens" && i3GEO.Interface.ATUAL === "googleearth")
		{YAHOO.janelaDoca.xp.panel.moveTo(0,0);}
		if(ifr === true)
		{YAHOO.janelaDoca.xp.panel.iframe.style.zIndex = 0;}
		if(modal === true){
			if($i(id+"_mask")){
				$i(id+"_mask").style.zIndex = 9000 + i3GEO.janela.ULTIMOZINDEX + 1;
				i3GEO.janela.ULTIMOZINDEX = 9000 + i3GEO.janela.ULTIMOZINDEX + 1;
			}
		}
		if($i(id+"_c")){
			$i(id+"_c").style.zIndex = 23000 + i3GEO.janela.ULTIMOZINDEX + 1;
			i3GEO.janela.ULTIMOZINDEX = 23000 + i3GEO.janela.ULTIMOZINDEX + 1;
		}
		if(funcaoCabecalho)
		{$i(id+'_cabecalho').onclick = funcaoCabecalho;}
		if(funcaoMinimiza)
		{$i(id+"_minimizaCabecalho").onclick = funcaoMinimiza;}
		YAHOO.util.Event.addListener(YAHOO.janelaDoca.xp.panel.close, "click", i3GEO.janela.fecha,YAHOO.janelaDoca.xp.panel,{id:id},true);
		i3GEO.janela.ULTIMOZINDEX++;
		return([YAHOO.janelaDoca.xp.panel,$i(id+"_cabecalho"),$i(id+"_corpo")]);
	},
	/*
	function: minimiza

	Minimiza ou maximiza a janela

	Parametro:

	id {string} - prefixo utilizado na composição do id da janela
	*/
	minimiza: function(id){
		var temp = $i(id+"_corpo"),
			n,
			i,
			m = YAHOO.janelaDoca.xp.manager.find(id);
		if(temp){
			if(temp.style.display === "block"){
				temp.style.display = "none";
				if(m)
				{m.hideIframe;}
			}
			else{
				temp.style.display = "block";
				if(m)
				{m.showIframe;}
			}
		}
		temp = $i(id+"_resizehandle");
		if(temp){
			if(temp.style.display === "none")
			{temp.style.display = "block";}
			else
			{temp.style.display = "none";}
		}
		temp = $i(id+"_c");
		if(temp){
			temp = temp.getElementsByTagName("div");
			n = temp.length;
			for(i=0;i<n;i++){
				if(temp[i].className === "underlay" || temp[i].className === "bd"){
					if(temp[i].style.display === "none")
					{temp[i].style.display = "block";}
					else
					{temp[i].style.display = "none";}
				}
			}
		}
		temp = $i(id+"_corpo");
		if(temp){
			if(temp.style.display === "none")
			{temp.style.display = "block";}
			else
			{temp.style.display = "none";}
		}
	},
	/*
	Function: fecha

	Aplica a opção definida em ANTESFECHA e elimina alguns objetos que são comumente adicionados por algumas operações do i3geo
	como richdraw, box, pin

	Parametros:

	id {String} - id da janela que será fechada
	*/
	fecha: function(event){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.fecha()");}
		var i,old,id,
			iu = i3GEO.util;
		//esconde elementos gráficos q a ferramenta pode ter aberto
		iu.escondePin();
		iu.escondeBox();
		//fecha o container de desenho de elementos na tela
		//if($i("divGeometriasTemp"))
		//{i3GEO.desenho.richdraw.fecha();}
		//executa as funções de fechamento
		if(this.ANTESFECHA){
			for(i=0;i<this.ANTESFECHA.length;i++)
			{eval(this.ANTESFECHA[i]);}
		}
		//YAHOO.janelaDoca.xp.panel.destroy();
		if(this.id)
		{id = this.id;}
		else
		{id = event.id;}
		iu.removeChild(id+"_c");
		iu.removeChild(id);
		iu.removeChild(id+"_mask");
		//
		//remove script tag se houver
		//
		iu.removeScriptTag(id+"_script");
		YAHOO.janelaDoca.xp.manager.remove(YAHOO.janelaDoca.xp.manager.find(id));
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
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.alteraTamanho()");}
		var i;
		if(arguments.length === 3)
		{i = $i(id);}
		else
		{i = $i("wdoca");}
		if(i){
			i.style.width = w;
			i.style.height = h;
		}
	},
	/*
	Function: abreAguarde

	Abre uma janela com a mensagem de aguarde

	Parametros:

	id {String} - id da nova janela

	texto {String} - texto da janela
	*/
	abreAguarde: function(id,texto){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.abreAguarde()");}
		var pos,index,contador,temp;
		document.body.style.cursor = "wait";
		i3GEO.util.removeChild(id+"_mask");
		i3GEO.util.removeChild(id+"_c");
		YAHOO.namespace("aguarde."+id);
		pos = [0,0];
		if($i(i3GEO.Interface.IDCORPO))
		{pos = YAHOO.util.Dom.getXY($i(i3GEO.Interface.IDCORPO));}
		else if ($i("contemImg"))
		{pos = YAHOO.util.Dom.getXY($i("contemImg"));}
		if(i3GEO.janela.AGUARDEMODAL == true)
		{texto += "<br><span style='color:navy;cursor:pointer;font-size:9px;' onclick='javascript:if(i3GEO.janela.AGUARDEMODAL == true){i3GEO.janela.AGUARDEMODAL = false;}else{i3GEO.janela.AGUARDEMODAL = true;}'>bloquear/desbloquear</span>";}
		contador = "";
		for(index=0; index<i3GEO.contadorAtualiza; index++) {
			contador = contador + ".";
		}
		eval('YAHOO.aguarde.'+id+' = new YAHOO.widget.Panel("'+id+'",{width:"240px",fixedcenter:false,underlay:"none",close:true,draggable:false,modal:'+i3GEO.janela.AGUARDEMODAL.toString()+',monitorresize:false})');
		i3GEO.janela.JANELASAGUARDE.push(id);
		if(i3GEO.janela.ESTILOAGUARDE === "normal" || i3GEO.janela.ESTILOAGUARDE === "reduzida"){
			eval('YAHOO.aguarde.'+id+'.setBody(texto)');
			eval('YAHOO.aguarde.'+id+'.body.style.padding="5px"');
		}
		if(i3GEO.janela.ESTILOAGUARDE === "normal" || i3GEO.janela.ESTILOAGUARDE === "minima")
		{eval('YAHOO.aguarde.'+id+'.setHeader("<span><img id=aguardeGifAberto src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>&nbsp;<span style=font-size:8px >'+contador+'</span>")');}
		eval('YAHOO.aguarde.'+id+'.render(document.body)');
		if(i3GEO.parametros.w > 0)
		{eval('YAHOO.aguarde.'+id+'.moveTo('+(pos[0] + (i3GEO.parametros.w / 2) - 120)+','+pos[1]+')');}
		else
		{eval('YAHOO.aguarde.'+id+'.moveTo('+pos[0]+','+pos[1]+')');}
		eval('YAHOO.aguarde.'+id+'.show()');
		if($i(id+"_mask"))
		{$i(id+"_mask").style.zIndex=25000;}
		temp = $i(id+"_c");
		if(temp){
			temp.style.zIndex=26000;
			temp.style.backgroundColor = "";
		}
		YAHOO.util.Dom.setStyle(temp,"opacity",i3GEO.janela.OPACIDADEAGUARDE / 100);
	},
	/*
	Function: ativaAlerta

	Substitui a janelça de alerta padrão do sistema operacional por uma outra customizada

	Parametros:

	texto {String} - texto da mensagem
	*/
	ativaAlerta: function(){
		YAHOO.namespace("dialogInfo");
		YAHOO.dialogInfo = new YAHOO.widget.SimpleDialog("simpledialog1",
		{
			width: "300px",
			fixedcenter: true,
			visible: false,
			draggable: false,
			zIndex: 100000,
			textAlign: "left",
			close: true,
			modal: true,
			effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25},
			constraintoviewport: true,
			buttons: [ { text:"fecha", handler: function(){this.hide();}, isDefault:true }],
			icon: YAHOO.widget.SimpleDialog.ICON_WARN,
			text: ""
		});
		//YAHOO.dialogInfo.cfg.setProperty("icon",YAHOO.widget.SimpleDialog.ICON_WARN);
		YAHOO.dialogInfo.setHeader("Alerta");
		YAHOO.dialogInfo.render(document.body);
		window.alert = function(texto){
			YAHOO.dialogInfo.cfg.setProperty("text",texto);
			YAHOO.dialogInfo.show();
		};
	},
	/*
	Function: mensagemSimples

	Mostra uma janela simples com uma mensagem

	Parametros:

	texto {String} - texto da mensagem
	*/
	mensagemSimples: function(texto,cabecalho){
		if(!$i("mensagemSimples1")){
			YAHOO.namespace("mensagemSimples");
			YAHOO.mensagemSimples = new YAHOO.widget.SimpleDialog("mensagemSimples1",
			{
				width: "300px",
				fixedcenter: true,
				visible: true,
				draggable: true,
				zIndex: 100000,
				textAlign: "left",
				close: true,
				modal: false,
				effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25},
				constraintoviewport: true,
				text: ""
			});
		}
		YAHOO.mensagemSimples.setHeader(cabecalho);
		YAHOO.mensagemSimples.render(document.body);
		YAHOO.mensagemSimples.cfg.setProperty("text",texto);
		YAHOO.mensagemSimples.show();
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
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.tip()");}
		var Nid,i,novoel,res;
		if(arguments.length === 0){cabecalho = "fixar";}
		Nid = YAHOO.util.Dom.generateId();
		i = $i("i3geo_rosa");
		if(i)
		{i.style.display="none";}
		if ($i(i3GEO.Interface.IDCORPO))
		{$i("img").title = "";}
		//insere div para tips
		novoel = document.createElement("div");
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
		res = "<div id='"+Nid+"cabecatip' style='text-align:left;background-color:rgb(240,240,240)'>";
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
		if(typeof(console) !== 'undefined'){console.info("i3GEO.janela.excluiTips()");}
		var ot,i;
		if(arguments.length === 0)
		{tipo = "todos";}
		if(i3GEO.janela.TIPS.length > 0){
			ot = i3GEO.janela.TIPS.length-1;
			if (ot >= 0){
				do{
					if(tipo === 'todos'){
						if(i3GEO.janela.TIPS[ot]){
							i = $i(i3GEO.janela.TIPS[ot].id);
							document.body.removeChild(i);
						}
					}
					if(tipo === 'naofixos'){
						if ($i(i3GEO.janela.TIPS[ot])){
							if($i(i3GEO.janela.TIPS[ot].id+"cabecatip").innerHTML !== ""){
								document.body.removeChild($i(i3GEO.janela.TIPS[ot].id));
							}
						}
					}
				}
				while(ot--);
				if(tipo === "todos")
				{i3GEO.janela.TIPS = [];}
			}
		}
	},
	slider: function(funcao,inicial){
		var tickSize,keyIncrement,scaleFactor,bottomConstraint,topConstraint,janela,novoel,Event,Dom,lang,slider,bg,thumb,valuearea,textfield;
		janela = i3GEO.janela.cria(230,200,"","","","Opacidade","opacidadeG");
		novoel = document.createElement("div");
		novoel.id = "slider-bg";
		novoel.tabindex = "-1";
		novoel.innerHTML = '<div style="cursor:default;position:absolute;top:4px" id="slider-thumb"><img src="'+i3GEO.configura.locaplic+'/imagens/thumb-n.gif"></div>';
		janela[2].appendChild(novoel);
		Event = YAHOO.util.Event;
		Dom   = YAHOO.util.Dom;
		lang  = YAHOO.lang;
		bg="slider-bg";
		thumb="slider-thumb"; 
		valuearea="slider-value";
		textfield="slider-converted-value";
		novoel.style.position = "relative";
		novoel.style.background= 'url('+i3GEO.configura.locaplic+'/imagens/bg-fader.gif) 5px 0 no-repeat';
		novoel.style.height = "28px";
		novoel.style.width= "228px"; 
		// The slider can move 0 pixels up
		topConstraint = 0;
		// The slider can move 200 pixels down
		bottomConstraint = 200;
		// Custom scale factor for converting the pixel offset into a real value
		scaleFactor = 1;
		// The amount the slider moves when the value is changed with the arrow
		// keys
		keyIncrement = 20;
		tickSize = 20;
		Event.onDOMReady(function() {
			slider = YAHOO.widget.Slider.getHorizSlider(bg,thumb, topConstraint, bottomConstraint, 20);
			slider.setValue(parseInt(inicial,10));
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
		if(arguments.length > 0 && typeof(id) !== 'undefined'){
			try{
				if($i(id+"_c"))
				{eval('YAHOO.aguarde.'+id+'.destroy()');}
				if($i(id+"_c"))
				{$i("i3geo").removeChild($i(id+"_c"));}
				if($i(id+"_mask"))
				{$i("i3geo").removeChild($i(id+"_mask"));}
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		}
		else{
			try{
				var id,i,
					n = this.JANELASAGUARDE.length,
					iu = i3GEO.util;
				for(i=0;i<n;i += 1){
					id = this.JANELASAGUARDE[i];
					if($i(id+"_c"))
					{eval('YAHOO.aguarde.'+id+'.destroy()');}
					iu.removeChild(id+"_c");
					iu.removeChild(id+"_mask");
				}
				this.JANELASAGUARDE = [];
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		}
	},
	/*
	Function: comboCabecalhoTemas
	
	Adiciona no cabeçalho da janela um combo com a lista de temas para janelas abertas por ferramentas
	
	Essa função é utilizada pelas ferramentas que operam sobre um determinado tema. O combo permite que o usuário
	selecione um tema e ative a ferramenta para funcionar com esse tema
	
	Parametros:
	
	idDiv {string} - id do elemento HTML que receberá o combo
	
	idCombo {string} - id do combo que será criado
	
	ferramenta {string} - nome da ferramenta (namespace da classe, por exemplo "tabela" para a classe i3GEOF.tabela
	
	tipo {string} - tipo de combo
	*/
	comboCabecalhoTemas: function(idDiv,idCombo,ferramenta,tipo){
		var temp = $i(idDiv);
		if(temp){
			temp.innerHTML = "";
			i3GEO.util.comboTemas(
				temp.id+"Sel",
				function(retorno){
					var container = $i(idDiv),
						c;
					container.innerHTML = retorno.dados;
					container.style.left = "0px";
					container.styletextAlign = "left";
					c = $i(idCombo);
					c.style.width = "150px";
					c.style.border = "solid #B4B4B4 1px";
					c.style.top = "1px";
					if(navm){
						c.style.top = "-4px";
					}
					c.style.left = "2px";
					c.style.position = "relative";
					c.style.fontSize = "10px";
					c.style.color = "#686868";
					if(i3GEO.temaAtivo !== "")
					{c.value = i3GEO.temaAtivo;}
					if(i3GEOF[ferramenta].tema)
					{c.value = i3GEOF[ferramenta].tema;}
					if(c.value === ""){
						i3GEOF[ferramenta].tema = "";
						$i("i3GEOF."+ferramenta+"_corpo").innerHTML = "";
					}
					c.onchange = function(){
						var valor = $i(idCombo).value;
						if(valor !== ""){
							i3GEO.mapa.ativaTema(valor);	
							i3GEOF[ferramenta].tema = valor;
							$i("i3GEOF."+ferramenta+"_corpo").innerHTML = "";
							eval("i3GEOF."+ferramenta+".inicia('i3GEOF."+ferramenta+"_corpo');");							
						}
					};
				},
				temp.id,
				"",
				false,
				tipo
			);				
		}
		temp = "i3GEO.janela.comboCabecalhoTemas('"+idDiv+"','"+idCombo+"','"+ferramenta+"','"+tipo+"')";
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search(temp) < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push(temp);}		
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
						if (YAHOO.env.ua.ie && document.compatMode  === "BackCompat")
						{nBodyOffset = 0;}
						else{
							nBodyBorderTopWidth = parseInt(Dom.getStyle(oBody, "borderTopWidth"), 10);
							nBodyBorderBottomWidth = parseInt(Dom.getStyle(oBody, "borderBottomWidth"), 10);
							nBodyTopPadding = parseInt(Dom.getStyle(oBody, "paddingTop"), 10);
							nBodyBottomPadding = parseInt(Dom.getStyle(oBody, "paddingBottom"), 10);
							nBodyOffset = nBodyBorderTopWidth + nBodyBorderBottomWidth + nBodyTopPadding + nBodyBottomPadding;
						}
						//
						//ajusta o tamanho do body no IE qd a janela é redimensionada
						//
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
						if(navm)
						{nNewWidth = nNewWidth - 2;}
						oBody.style.width = nNewWidth - 2 +"px";
						if (nBodyHeight < 0)
						{nBodyHeight = 0;}
						oBody.style.height =  nBodyHeight + "px";
						if ($i("wdocai")){
							$i("wdocai").style.height = nBodyHeight;
							$i("wdocai").style.width = oBody.style.width;
						}
					};
					this.ddResize.onMouseUp = this.ddResize.onDrag.call();
				}
				function onBeforeShow(){
					initResizeFunctionality.call(this);
					this.unsubscribe("beforeShow", onBeforeShow);
				}
				function onBeforeRender(){
					if (!this.footer)
					{this.setFooter("");}
					if (this.cfg.getProperty("visible"))
					{initResizeFunctionality.call(this);}
					else
					{this.subscribe("beforeShow", onBeforeShow);}
					this.unsubscribe("beforeRender", onBeforeRender);
				}
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
catch(e){
	if(typeof(console) !== 'undefined'){console.error(e);}
}
//YAHOO.log("carregou classe janela", "Classes i3geo");
