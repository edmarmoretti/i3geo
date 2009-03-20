/*
Title: Eventos

File: i3geo/classesjs/classe_eventos.js

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
/*
Class: i3GEO.eventos

Controla as operações que são executadas em eventos que ocorrem no mapa.

As listas de operações consistem em variáveis com nomes de funções.

As listas são inicializadas com algunmas funções já embutidas, mas podem ser acrescentadas outras.

Exemplos:

	Para incluir uma função em um determinado evento utilize

	if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaEscalaNumerica()") < 0)
	
	{i3GEO.eventos.NAVEGAMAPA.push("atualizaEscalaNumerica()");}		

	Para remover utilize
	
	i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaNumerica()");
*/
i3GEO.eventos = {
	/*
	Variable: NAVEGAMAPA
	
	Armazena as funções que serão executadas quando é feita uma operação de navegação sobre o mapa.
	
	Type:
	{Array}
	*/
	NAVEGAMAPA: new Array(
		"atualizaEscalaNumerica()"
	),
	/*
	Variable: MOUSEPARADO

	Nome das funções padrão que serão executadas quando o usuário estaciona o mouse sobre o mapa 
	por alguns instantes.
	
	Type:
	{Array}
	*/
	MOUSEPARADO: new Array(
		"i3GEO.navega.mostraRosaDosVentos()"
	),
	/*
	Variable: MOUSEMOVE

	Nome das funções que serão executadas quando o usuário move o mouse sobre o mapa 
	
	Type:
	{Array}
	*/
	MOUSEMOVE: new Array(),
	/*
	Variable: MOUSEDOWN

	Nome das funções que serão executadas quando o usuário pressiona o botão do mouse sobre o mapa 
	
	Type:
	{Array}
	*/
	MOUSEDOWN: new Array(),
	/*
	Variable: MOUSEUP

	Nome das funções que serão executadas quando o usuário solta o botão do mouse sobre o mapa 
	
	Type:
	{Array}
	*/
	MOUSEUP: new Array(),
	/*
	Variable: MOUSECLIQUE

	Nome das funções que serão executadas quando o usuário clica sobre o mapa 
	
	Type:
	{Array}
	*/
	MOUSECLIQUE: new Array(
		"i3GEO.eventos.cliqueCapturaPt()"	
	),
	/*
	Variable: TIMERPARADO
	
	Timer utilizado pelo contador do mouse parado
	
	Type:
	{Timeout}
	*/
	TIMERPARADO: "",
	/*
	Function: mouseParado
	
	Executa as funções definidas em MOUSEPARADO quando é detectado que o mouse está estacionado.
	
	A execução desse evento é controlado por um timer definido no evento onmousemove (sobre o mapa).
	
	*/
	mouseParado: function()	{
		try
		{clearTimeout(i3GEO.eventos.TIMERPARADO);}
		catch(e){i3GEO.eventos.TIMERPARADO = "";}
		try{
			if (i3GEO.eventos.MOUSEPARADO.length > 0 && objposicaocursor.imgy > 0 && objposicaocursor.imgx > 0){
				var f = i3GEO.eventos.MOUSEPARADO.length-1;
				if (f >= 0){
					do{
						if(objposicaocursor.imgx > 0)
						{eval(i3GEO.eventos.MOUSEPARADO[f]);}
					}
					while(f--)
				}
			}
		}catch(e){}
	},
	/*
	Function: navegaMapa
	
	Executa as funções armazenadas em NAVEGAMAPA, ou seja, operações executadas quando o mapa tem sua extensão geográfica alterada.
	*/
	navegaMapa: function(){
		if (i3GEO.eventos.NAVEGAMAPA.length > 0){
			var f = i3GEO.eventos.NAVEGAMAPA.length-1;
			if (f >= 0){
				do{
					var temp = i3GEO.eventos.NAVEGAMAPA[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function'){
						eval(i3GEO.eventos.NAVEGAMAPA[f]);
						//YAHOO.log("navegaMapa", "i3geo");
					}
				}
				while(f--)
			}
		}
	},
	/*
	Function: mousemoveMapa
	
	Executa as funções armazenadas em MOUSEMOVE.
	*/
	mousemoveMapa: function(){
		if (i3GEO.eventos.MOUSEMOVE.length > 0){
			var f = i3GEO.eventos.MOUSEMOVE.length-1;
			if (f >= 0){
				do{
					var temp = i3GEO.eventos.MOUSEMOVE[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function'){
						eval(i3GEO.eventos.MOUSEMOVE[f]);
						//YAHOO.log("mousemoveMapa", "i3geo");
					}
				}
				while(f--)
			}
		}	
	},
	/*
	Function: mousedownMapa
	
	Executa as funções armazenadas em MOUSEDOWN.
	*/
	mousedownMapa: function(){
		if (i3GEO.eventos.MOUSEDOWN.length > 0){
			var f = i3GEO.eventos.MOUSEDOWN.length-1;
			if (f >= 0){
				do{
					var temp = i3GEO.eventos.MOUSEDOWN[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function'){
						eval(i3GEO.eventos.MOUSEDOWN[f]);
						//YAHOO.log("mousedownMapa", "i3geo");
					}
				}
				while(f--)
			}
		}
	},
	/*
	Function: mouseupMapa
	
	Executa as funções armazenadas em MOUSEUP.
	*/
	mouseupMapa: function(){
		if (i3GEO.eventos.MOUSEUP.length > 0){
			var f = i3GEO.eventos.MOUSEUP.length-1;
			if (f >= 0){
				do{
					var temp = i3GEO.eventos.MOUSEUP[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function'){
						eval(i3GEO.eventos.MOUSEUP[f]);
						//YAHOO.log("mouseupMapa", "i3geo");
					}
				}
				while(f--)
			}
		}	
	},
	/*
	Function: mousecliqueMapa
	
	Executa as funções armazenadas em MOUSECLIQUE.
	*/
	mousecliqueMapa: function(){
		if (i3GEO.eventos.MOUSECLIQUE.length > 0){
			var f = i3GEO.eventos.MOUSECLIQUE.length-1;
			if (f >= 0){
				do{
					eval(i3GEO.eventos.MOUSECLIQUE[f]);
					//YAHOO.log("mousecliqueMapa", "i3geo");
				}
				while(f--)
			}
		}
	},
	/*
	Function posicaoMouseMapa
	
	Captura a posição do mouse sobre um mapa. O cálculo pode ser feito sobre o corpo do mapa principal ou sob o corpo do mapa de referência
	
	O resultado dos cálculos são armazenados no objeto objposicaocursor
	esse objeto terá as seguintes propriedades:
	
			objposicaocursor.ddx valor de x em décimos de grau
			
			objposicaocursor.ddy valor de y em décimos de grau
			
			objposicaocursor.dmsx valor de x em dms
			
			objposicaocursor.dmsy valor de y em dms
			
			objposicaocursor.telax posicao x na tela em pixels
			
			objposicaocursor.telay posicao y na tela em pixels
			
			objposicaocursor.imgx posicao x no mapa em pixels
			
			objposicaocursor.imgy: posicao y no mapa em pixels
			
			objposicaocursor.refx: posicao x no mapa de referência em pixels
			
			objposicaocursor.refy: posicao x no mapa de referência em pixels
	
	Parameters:
	
	e {Event object} - objeto do tipo evento disparado sobre o objeto em foco
	*/
	posicaoMouseMapa: function(e){
		//
		//os eventos da interface googlemaps são definidos em i3GEO.interface
		//
		if(i3GEO.interface.ATUAL == "googlemaps")
		{return;}	
		if (!e) var e = window.event;
		//
		//verifica sob qual objeto o mouse está se movendo
		//
		if (e.target)
		{var targ = e.target;}
		else if (e.srcElement) var targ = e.srcElement;
		if(targ.id == "" && $i(i3GEO.interface.IDMAPA))
		{var targ = $i(i3GEO.interface.IDMAPA);}
		//
		//se estiver no modo pan, o movimento deve ser obtido do elemento
		//onde está a imagem do mapa e não diretamente sobre o elemento 'img'
		//se não for feito assim, o deslocamento do mapa não é capturado
		//
		try{
			if(g_panM != 'undefined' && g_panM == "sim")
			{var pos = i3GEO.util.pegaPosicaoObjeto(targ.parentNode);}
			else
			{var pos = i3GEO.util.pegaPosicaoObjeto(targ);}
			if((i3GEO.configura.entorno == "sim") && (g_panM == "sim")){
				pos[0] = pos[0] - i3GEO.parametros.w;
				pos[1] = pos[1] - i3GEO.parametros.h;
			}
		}
		catch(m){var pos = i3GEO.util.pegaPosicaoObjeto(targ);}
		//
		//pega a posicao correta do mouse
		//
		var mousex = 0;
		var mousey = 0;
		if (e.pageX || e.pageY){
			var mousex = e.pageX;
			var mousey = e.pageY;
		}
		else if (e.clientX || e.clientY){
			var mousex = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
			var mousey = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
		}
		//
		//faz os cálculos de posicionamento
		//fig e reffig são a mesma coisa por enquanto
		//
		var xfig = mousex - pos[0];
		var yfig = mousey - pos[1];
		var xreffig = xfig;
		var yreffig = yfig;
		var xtela = mousex;
		var ytela = mousey;
		//
		//celula e extent são necessários para se fazer a
		//conversão de coordenadas de tela para coordenadas geográficas
		//esses valores são obtidos das funções ajax que redesenham ou inicializam o mapa
		// 
		var c = i3GEO.parametros.pixelsize;
		var ex = i3GEO.parametros.mapexten;
		try{
			if(targ.id == "imagemReferencia"){
				var c = i3GEO.parametros.celularef;
				var ex = i3GEO.parametros.extentref;
				var r = $i("i3geo_rosa");
				if(r)
				r.style.display = "none"
			}
		}
		catch(e){i3GEO.parametros.celularef = 0;}
		var teladd = i3GEO.calculo.tela2dd(xfig,yfig,c,ex);
		var teladms = i3GEO.calculo.dd2dms(teladd[0],teladd[1]);
		objposicaocursor = {
			ddx: teladd[0],
			ddy: teladd[1],
			dmsx: teladms[0],
			dmsy: teladms[1],
			telax: xtela,
			telay: ytela,
			imgx: xfig,
			imgy: yfig,
			refx: xreffig,
			refy: yreffig
		};
	},
	/*
	Function: ativa

	Ativa as operações de clique sobre o mapa

	Define o que será executado quando o mouse é clicado ou movido sobre o mapa.

	Além das funções padrão,são ativadas aquelas definidas nas variáveis de configuração (veja configura.js)

	Parameters:

	docMapa {DOM node} - objeto que será alvo da ativação dos cliques
	*/
	ativa: function(docMapa){
		docMapa.onmouseover = function(){
			this.onmousemove=function(exy){
				i3GEO.eventos.posicaoMouseMapa(exy);
				try{
					try
					{clearTimeout(i3GEO.eventos.TIMERPARADO);}
					catch(e){var a = e;}
					i3GEO.eventos.TIMERPARADO = setTimeout('i3GEO.eventos.mouseParado()',i3GEO.configura.tempoMouseParado);
				}
				catch(e){var e = "";}
				try
				{i3GEO.eventos.mousemoveMapa();}
				catch(e){var e = "";}
			};
		};
		docMapa.onmouseout = function(){
			try
			{objmapaparado="parar";}
			catch(e){var e = "";}
		};
		docMapa.onmousedown = function(exy){
			try{
				i3GEO.eventos.posicaoMouseMapa(exy);
				i3GEO.eventos.mousedownMapa();
			}
			catch(e){var e = "";}
		};
		docMapa.onclick = function(){
			try
			{i3GEO.eventos.mousecliqueMapa();}
			catch(e){var e = "";}
		};
		docMapa.onmouseup = function(){
			try
			{i3GEO.eventos.mouseupMapa();}
			catch(e){var e = "";}
		};
	},
	/*
	Function: cliqueCapturaPt

	Captura um ponto na tela e retorna o resultado para a janela interna que estiver aberta.

	As coordenadas do ponto, em DMS, são repassadas para os campos do tipo input da janela interna que estiver aberta.
	A janela aberta deve ter os seguintes elementos do tipo input (ids):
	ixg,ixm,ixs,iyg,iym,iys
	*/
	cliqueCapturaPt: function(){
		if (g_tipoacao != "capturaponto"){return;}
		else{
			if($i("wdocai"))
			{var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;}
			try{
				var x = objposicaocursor.dmsx.split(" ");
				var y = objposicaocursor.dmsy.split(" ");
				if (doc.getElementById("ixg"))
				{doc.getElementById("ixg").value = x[0];}
				if (doc.getElementById("ixm"))
				{doc.getElementById("ixm").value = x[1];}
				if (doc.getElementById("ixs"))
				{doc.getElementById("ixs").value = x[2];}
				if (doc.getElementById("iyg"))
				{doc.getElementById("iyg").value = y[0];}
				if (doc.getElementById("iym"))
				{doc.getElementById("iym").value = y[1];}
				if (doc.getElementById("iys"))
				{doc.getElementById("iys").value = y[2];}
			}
			catch(m){}
		}
	}
};
//YAHOO.log("carregou classe eventos", "Classes i3geo");