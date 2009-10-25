/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Eventos

Arquivo:

i3geo/classesjs/classe_eventos.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
objposicaocursor = {
	ddx: "",
	ddy: "",
	dmsx: "",
	dmsy: "",
	telax: "",
	telay: "",
	imgx: "",
	imgy: "",
	refx: "",
	refy: ""
};

/*
Classe: i3GEO.eventos

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
	Propriedade: NAVEGAMAPA
	
	Armazena as funções que serão executadas quando é feita uma operação de navegação sobre o mapa.
	
	Tipo:
	{Array}
	
	Default:
	{["atualizaEscalaNumerica()"]}
	*/
	NAVEGAMAPA: [],
	/*
	Propriedade: MOUSEPARADO

	Armazena as funções que serão executadas quando o usuário estaciona o mouse sobre o mapa 
	por alguns instantes.
	
	Tipo:
	{Array}
	
	Default:
	{["i3GEO.navega.mostraRosaDosVentos()"]}
	*/
	MOUSEPARADO: ["i3GEO.navega.mostraRosaDosVentos()"],
	/*
	Propriedade: MOUSEMOVE

	Armazena as funções que serão executadas quando o usuário move o mouse sobre o mapa 
	
	Tipo:
	{Array}
	
	Default:
	{[]}
	*/
	MOUSEMOVE: [],
	/*
	Propriedade: MOUSEDOWN

	Armazena as funções que serão executadas quando o usuário pressiona o botão do mouse sobre o mapa 
	
	Tipo:
	{Array}

	Default:
	{[]}
	*/
	MOUSEDOWN: [],
	/*
	Propriedade: MOUSEUP

	Armazena as funções que serão executadas quando o usuário solta o botão do mouse sobre o mapa 
	
	Tipo:
	{Array}
	
	Default:
	{[]}
	*/
	MOUSEUP: [],
	/*
	Propriedade: MOUSECLIQUE

	Armazena as funções que serão executadas quando o usuário clica sobre o mapa 
	
	Tipo:
	{Array}
	
	Default:
	{["i3GEO.eventos.cliqueCapturaPt()"]}
	*/
	MOUSECLIQUE: ["i3GEO.eventos.cliqueCapturaPt()"],
	/*
	Variavel: TIMERPARADO
	
	Timer utilizado pelo contador do mouse parado
	
	Tipo:
	{Timeout}
	*/
	TIMERPARADO: "",
	/*
	Function: mouseParado
	
	Executa as funções definidas em MOUSEPARADO quando é detectado que o mouse está estacionado.
	
	A execução desse evento é controlado por um timer definido no evento onmousemove (sobre o mapa).
	
	*/
	mouseParado: function()	{
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.mouseParado()");}
		try
		{clearTimeout(i3GEO.eventos.TIMERPARADO);}
		catch(e){i3GEO.eventos.TIMERPARADO = "";}
		if(objposicaocursor.dentroDomapa === false){return;}
		try{
			if(objposicaocursor.imgy === ""){
				objposicaocursor.imgy = 1;
				objposicaocursor.imgx = 1;
			}
			if (i3GEO.eventos.MOUSEPARADO.length > 0 && objposicaocursor.imgy > 0 && objposicaocursor.imgx > 0){
				if(objposicaocursor.imgx > 0){
					i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSEPARADO);
				}
			}
		}catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
	},
	/*
	Function: navegaMapa
	
	Executa as funções armazenadas em NAVEGAMAPA, ou seja, operações executadas quando o mapa tem sua extensão geográfica alterada.
	*/
	navegaMapa: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.navegaMapa()");}
		i3GEO.eventos.executaEventos(i3GEO.eventos.NAVEGAMAPA);
	},
	/*
	Function: mousemoveMapa
	
	Executa as funções armazenadas em MOUSEMOVE.
	*/
	mousemoveMapa: function(){
		i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSEMOVE);
	},
	/*
	Function: mousedownMapa
	
	Executa as funções armazenadas em MOUSEDOWN.
	*/
	mousedownMapa: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.mousedownMapa()");}
		i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSEDOWN);
	},
	/*
	Function: mouseupMapa
	
	Executa as funções armazenadas em MOUSEUP.
	*/
	mouseupMapa: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.mouseupMapa()");}
		i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSEUP);
		/*
		if (i3GEO.eventos.MOUSEUP.length > 0){
			var f,temp;
			f = i3GEO.eventos.MOUSEUP.length-1;
			if (f >= 0){
				do{
					temp = i3GEO.eventos.MOUSEUP[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function'){
						eval(i3GEO.eventos.MOUSEUP[f]);
						//YAHOO.log("mouseupMapa", "i3geo");
					}
				}
				while(f--);
			}
		}
		*/	
	},
	/*
	Function: mousecliqueMapa
	
	Executa as funções armazenadas em MOUSECLIQUE.
	*/
	mousecliqueMapa: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.mousecliqueMapa()");}
		i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSECLIQUE);
	},
	/*
	Function: executaEventos
	
	Executa a pilha de nomes de funções armazenados em um array
	
	Parameter:
	
	eventos {array} - array com os nomes das funções
	*/
	executaEventos: function(eventos){
		try{
			var f,temp;
			if (eventos.length > 0){
				f = eventos.length-1;
				if (f >= 0){
					do{eval(eventos[f]);}
					while(f--);
				}
			}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){"executaEventos "+console.error(e);}
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
		//os eventos da interface googlemaps são definidos em i3GEO.Interface
		//se a interface for googlemaps ou openlayers, os eventos são controlados
		//pelas respectivas apis
		//caso contrário, o i3geo irá controlar os cálculos
		//Entretanto, nas ferramentas que usam o richdraw (distância e área) o posicionamento
		//deve ser controlado pelo i3geo
		//
		var teladd,teladms,container,targ,pos,mousex,mousey,xfig,yfig,xreffig,yreffig,xtela,ytela,c,ex,r;
		try{
			//verifica se o richdraw está sendo usaado
			container = e.target.parentNode.id;
		}
		catch(erro){
			if(typeof(console) !== 'undefined'){console.error(erro);}
		}
		if (container !== "divGeometriasTemp"){
			if((i3GEO.Interface.ATUAL === "googlemaps") || (i3GEO.Interface.ATUAL === "openlayers"))
			{return;}
		}
		if (!e){e = window.event;}
		//
		//verifica sob qual objeto o mouse está se movendo
		//
		if (e.target)
		{targ = e.target;}
		else if (e.srcElement) {targ = e.srcElement;}
		if(targ.id === "" && $i(i3GEO.Interface.IDMAPA))
		{targ = $i(i3GEO.Interface.IDMAPA);}
		//
		//se estiver no modo pan, o movimento deve ser obtido do elemento
		//onde está a imagem do mapa e não diretamente sobre o elemento 'img'
		//se não for feito assim, o deslocamento do mapa não é capturado
		//
		try{
			if(g_panM !== 'undefined' && g_panM === "sim")
			{pos = i3GEO.util.pegaPosicaoObjeto(targ.parentNode);}
			else
			{pos = i3GEO.util.pegaPosicaoObjeto(targ);}
			if((i3GEO.configura.entorno === "sim") && (g_panM === "sim")){
				pos[0] = pos[0] - i3GEO.parametros.w;
				pos[1] = pos[1] - i3GEO.parametros.h;
			}
		}
		catch(m){pos = i3GEO.util.pegaPosicaoObjeto(targ);}
		//
		//pega a posicao correta do mouse
		//
		mousex = 0;
		mousey = 0;
		if (e.pageX || e.pageY){
			mousex = e.pageX;
			mousey = e.pageY;
		}
		else if (e.clientX || e.clientY){
			mousex = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			mousey = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		//
		//faz os cálculos de posicionamento
		//fig e reffig são a mesma coisa por enquanto
		//
		xfig = mousex - pos[0];
		yfig = mousey - pos[1];
		xreffig = xfig;
		yreffig = yfig;
		xtela = mousex;
		ytela = mousey;
		//
		//celula e extent são necessários para se fazer a
		//conversão de coordenadas de tela para coordenadas geográficas
		//esses valores são obtidos das funções ajax que redesenham ou inicializam o mapa
		// 
		c = i3GEO.parametros.pixelsize;
		ex = i3GEO.parametros.mapexten;
		try{
			if(targ.id === "imagemReferencia"){
				c = i3GEO.parametros.celularef;
				ex = i3GEO.parametros.extentref;
				r = $i("i3geo_rosa");
				if(r)
				{r.style.display = "none";}
			}
		}
		catch(e){i3GEO.parametros.celularef = 0;}
		teladd = i3GEO.calculo.tela2dd(xfig,yfig,c,ex);
		teladms = i3GEO.calculo.dd2dms(teladd[0],teladd[1]);
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
			refy: yreffig,
			dentroDomapa: true
		};
	},
	/*
	Function: ativa

	Ativa os eventos sobre o mapa

	Define o que será executado quando o mouse é clicado ou movido sobre o mapa.

	Além das funções padrão,são ativadas aquelas definidas nas variáveis de configuração (veja classe_configura.js)

	Parametro:

	docMapa {DOM node} - objeto que será alvo da ativação dos cliques
	*/
	ativa: function(docMapa){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.ativa()");}
		docMapa.onmouseover = function(){
			objposicaocursor.dentroDomapa = true;
			this.onmousemove=function(exy){
				i3GEO.eventos.posicaoMouseMapa(exy);
				try{
					try
					{clearTimeout(i3GEO.eventos.TIMERPARADO);}
					catch(e){
						if(typeof(console) !== 'undefined'){console.error(e);}
					}
					i3GEO.eventos.TIMERPARADO = setTimeout('i3GEO.eventos.mouseParado()',i3GEO.configura.tempoMouseParado);
				}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
				try
				{i3GEO.eventos.mousemoveMapa();}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
			};
		};
		docMapa.onmouseout = function(){
			objposicaocursor.dentroDomapa = true;
			try
			{objmapaparado="parar";}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		};
		docMapa.onmousedown = function(exy){
			if(!i3GEO.eventos.botaoDireita(exy))
			{i3GEO.eventos.mousedownMapa();}
		};
		docMapa.onclick = function(exy){
			if(!i3GEO.eventos.botaoDireita(exy))
			{i3GEO.eventos.mousecliqueMapa();}
		};
		docMapa.onmouseup = function(exy){
			if(!i3GEO.eventos.botaoDireita(exy))
			{i3GEO.eventos.mouseupMapa();}
		};
	},
	/*
	Function: botaoDireita
	
	Retorna true se o botão da direita foi utilizado no evento do mouse
	
	Parametro:
	
	exy - evento
	
	Return:
	{boolean}
	*/
	botaoDireita: function(exy){
		try{
			var k;
			if(navm)
			{k = event.button;}
			else
			{k = exy.button;}
			if(k !== 2)				
			{return false;}
			else
			{return true;}
		}
		catch(e){return false;}	
	},
	/*
	Function: cliqueCapturaPt

	Captura um ponto na tela e retorna o resultado para a janela interna que estiver aberta.

	As coordenadas do ponto, em DMS, são repassadas para os campos do tipo input da janela interna que estiver aberta.
	A janela aberta deve ter os seguintes elementos do tipo input (ids):
	ixg,ixm,ixs,iyg,iym,iys
	*/
	cliqueCapturaPt: function(ixg,ixm,ixs,iyg,iym,iys){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.eventos.cliqueCapturaPt()");}
		if(arguments.length === 0){
			var ixg = "ixg",
				ixm = "ixm",
				ixs = "ixs",
				iyg = "iyg",
				iym = "iym",
				iys = "iys",
				x,y;
			if($i("wdocai"))
			{doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;}
		}
		else{
			var doc = document; 
			x,
			y;
		}
		if (g_tipoacao !== "capturaponto"){return;}
		else{
			try{
				x = objposicaocursor.dmsx.split(" ");
				y = objposicaocursor.dmsy.split(" ");
				if (doc.getElementById(ixg))
				{doc.getElementById(ixg).value = x[0];}
				if (doc.getElementById(ixm))
				{doc.getElementById(ixm).value = x[1];}
				if (doc.getElementById(ixs))
				{doc.getElementById(ixs).value = x[2];}
				if (doc.getElementById(iyg))
				{doc.getElementById(iyg).value = y[0];}
				if (doc.getElementById(iym))
				{doc.getElementById(iym).value = y[1];}
				if (doc.getElementById(iys))
				{doc.getElementById(iys).value = y[2];}
			}
			catch(m){
				if(typeof(console) !== 'undefined'){console.error(m);}
			}
		}
	}
};
//YAHOO.log("carregou classe eventos", "Classes i3geo");