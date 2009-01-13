/*
Class:: i3GEO.eventos

Controla as operações que são executadas em eventos que ocorrem no mapa.

As listas de operações consistem em variáveis com nomes de funções.

As listas são inicializadas com algunmas funções já embutidas, mas podem ser acrescentadas outras.

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
		"i3GEO.gadgets.mostraCoordenadasUTM()",
		"i3GEO.navega.mostraRosaDosVentos()"
	),
	/*
	Variable: MOUSEMOVE

	Nome das funções que serão executadas quando o usuário move o mouse sobre o mapa 
	
	Type:
	{Array}
	*/
	MOUSEMOVE: new Array(
		"movePan()",
		"moveLonglat()",
		"moveSelecaoPoli()"
	),
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
		"cliqueSelecaoPoli()",
		"cliqueCapturaPt()"	
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
		if (i3GEO.eventos.MOUSEPARADO.length > 0 && objposicaocursor.imgy > 0 && objposicaocursor.imgx > 0)
		{
			var f = i3GEO.eventos.MOUSEPARADO.length-1;
			if (f >= 0)
			{
				do
				{
					if(objposicaocursor.imgx > 0)
					{eval(i3GEO.eventos.MOUSEPARADO[f]);}
				}
				while(f--)
			}
		}
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
					if(eval('typeof ' + temp) == 'function')
					eval(i3GEO.eventos.NAVEGAMAPA[f]);
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
					if(eval('typeof ' + temp) == 'function')
					eval(i3GEO.eventos.MOUSEMOVE[f]);
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
					if(eval('typeof ' + temp) == 'function')
					eval(i3GEO.eventos.MOUSEDOWN[f]);
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
					if(eval('typeof ' + temp) == 'function')
					eval(i3GEO.eventos.MOUSEUP[f]);
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
				}
				while(f--)
			}
		}
		if (i3GEO.eventos.MOUSECLIQUE.length > 0){
			var lle = i3GEO.eventos.MOUSECLIQUE.length;
			for (var f=0;f<lle; f++){
				eval(i3GEO.eventos.MOUSECLIQUE[f]);
			}
		}
	
	}
}