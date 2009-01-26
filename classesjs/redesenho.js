/*
Title: redesenho.js

Executa as operações de redesenho do mapa.

Obtém os parâmetros necessários ao funcionamento da interface, como resolução, escala, etc.

File: i3geo/classesjs/redesenho.js

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
/*
Function: ajaxredesenha

Prepara o mapa para receber os elementos que comporão o mapa e chama a função que irá gerar os novos elementos.

Parameters:

retorno - string indicando se houve erro na função que chamou.
*/
function ajaxredesenha(retorno)
{
	if(arguments.length == 0 || retorno == ""){
		var legimagem = "";
		i3GEO.janela.abreAguarde("ajaxiniciaParametros",$trad("o1"));
		i3GEO.php.corpo(ajaxIniciaParametros,g_tipoimagem);
	}
	else{	
		i3GEO.janela.abreAguarde("ajaxiniciaParametros",$trad("o1"));
		ajaxIniciaParametros(retorno);
	}
}
/*
Function: ajaxIniciaParametros

Refaz o mapa e os elementos marginais, como legenda, escala, lista de temas, etc.

Parameters:

retorno - objeto JSON.
*/
function ajaxIniciaParametros(retorno)
{
	if(arguments.length == 0){return;}
	//YAHOO.log("ajaxIniciaParametros", "redesenho");
	i3GEO.mapa.corpo.verifica(retorno);
	var tempo = "";
	if(i3GEO.desenho.richdraw)
	{i3GEO.desenho.richdraw.clearWorkspace();}
	//try
	//{
		mapscale = "";
		mapexten = "";
		eval(retorno.data.variaveis);
		objmapa.mapimagem = mapimagem;
		i3GEO.interface.redesenha();
		//
		//verifica se precisa mudar a lista de temas
		//
		i3GEO.arvoreDeCamadas.atualiza(retorno.data.temas);
		//
		//atualiza o indicador de compatibilidade de escala se houve um processo de navegacao
		//
		if (objmapa.scale != mapscale)
		i3GEO.arvoreDeCamadas.atualizaFarol(mapscale);
		//
		//atualliza os valores do objmapa
		//
		objmapa.scale = mapscale;
		g_operacao = "";
		i3GEO.arvoreDeCamadas.CAMADAS = retorno.data.temas;
		objmapa.cellsize = g_celula;
		objmapa.extent = mapexten;
		//
		//atualiza a janela com o valor da extensão geográfica do mapa se for o caso
		//
		if ($i("mensagemt"))
		{$i("mensagemt").value = objmapa.extent;}
		//
		//atualiza as ferramentas de consulta que dependem da extensão geográfica
		//
		i3GEO.eventos.navegaMapa();
		//
		//atualiza as imagens do entorno do mapa caso essa opçãoestiver ativa
		//
		if (i3GEO.configura.entorno == "sim")
		{
			i3GEO.navega.entorno.geraURL();
			i3GEO.navega.entorno.ajustaPosicao();
		}
		//YAHOO.log("Fim ajaxIniciaParametros", "redesenho");
	//}
	//catch(e){alert("erro no mapa ajaxiniciaparametros "+e);}
	i3GEO.ajuda.mostraJanela("Tempo de redesenho em segundos: "+tempo,"");
}
//testa se esse script foi carregado
function testaajax()
{}