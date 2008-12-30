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
	Variable: MOUSEPARADO

	Nome das funções padrão que serão executadas quando o usuário estaciona o mouse sobre o mapa 
	por alguns instantes.
	*/
	MOUSEPARADO: new Array(
		"i3GEO.gadgets.mostraCoordenadasUTM()",
		"verificaTip()",
		"i3GEO.navega.mostraRosaDosVentos()"
	),
	/*
	Function: mouseParado
	
	Executa as funções definidas em MOUSEPARADO quando é detectado que o mouse está estacionado.
	
	A execução desse evento é controlado por um timer definido no evento onmousemove (sobre o mapa).
	
	*/
	mouseParado: function()	{
		try
		{clearTimeout(objmapa.tempoParado);}
		catch(e){objmapa.tempoParado = "";}
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
	}
}