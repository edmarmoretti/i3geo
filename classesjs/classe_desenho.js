/*
Title: Desenho de elementos gráficos

Arquivo:

i3geo/classesjs/classe_desenho.js

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
	i3GEO = new Array();
}
/*
Classe: i3GEO.desenho

Controla as operações de desenho sobre o mapa

Por desenho, entende-se elementos que são incluídos graficamente no mapa,
como por exemplo, linhas, pontos, círculos, etc e que não compõem layers
com dados

As operações de desenho são baseadas na biblioteca Richdraw (i3geo/pacotes/richdraw)

Link:

http://starkravingfinkle.org/blog/2006/04/richdraw-simple-vmlsvg-editor/

*/
i3GEO.desenho = {
	/*
	Variavel: richdraw
	
	Objeto richdraw criado por criaContainerRichdraw
	
	Tipo:
	{richdraw object}
	*/
	richdraw: "",
	/*
	Function: criaContainerRichdraw

	Cria os elementos 'dom' necessários ao uso das funções de desenho sobre o mapa.

	As ferramentas de cálculo de distâncias e áreas utilizam esse container.

	Richdraw é uma biblioteca utilizada pelo i3geo para abstrair as diferenças entre as linguagens svg e vml.

	Essa abstração é necessária devido às diferenças entre os navegadores.
	
	O container é criado dentro de um DIV chamado "divGeometriasTemp"
	
	Essa função cria também o objeto pontosdistobj que é utilizado para armazenar
	os dados obtidos da movimentação do mouse sobre o mapa
	
	*/
	criaContainerRichdraw: function(){
		pontosdistobj = {
			xpt: new Array(),
			ypt: new Array(),
			dist: new Array(),
			xtela: new Array(),
			ytela: new Array(),
			ximg: new Array(),
			yimg: new Array(),
			linhas: new Array()
		};
		try{
			var divgeo = i3GEO.desenho.criaDivContainer();
			divgeo.innerHTML = "";
			var renderer;
			//
			//cria o objeto renderer conforme o browser em uso
			//esse objeto será utilizado nas funções de desenho
			//mais detalhes, veja em pacotes/richdraw
			//Conforme a resposta do navegador, utiliza-se a criação VML ou SVG
			//
			try{
				renderer = new VMLRenderer();
				i3GEO.desenho.richdraw = new RichDrawEditor(divgeo, renderer);
			}
			catch(e){
				renderer = new SVGRenderer();
				i3GEO.desenho.richdraw = new RichDrawEditor(divgeo, renderer);
			}
			//
			//definição dos símbolos default para os elementos gráficos
			//
			i3GEO.desenho.richdraw.editCommand('fillcolor', 'red');
			i3GEO.desenho.richdraw.editCommand('linecolor', 'gray');
			i3GEO.desenho.richdraw.editCommand('linewidth', '1px');
			i3GEO.desenho.richdraw.editCommand('mode', 'line');
			divgeo.style.display="block";
			//
			//após o container ser criado, é necessário que as funções
			//de clique sobre o mapa sejam ativadas
			//para funcionarem sobre o container
			//
			i3GEO.eventos.ativa(divgeo);
		}
		catch(e){alert("Erro ao tentar criar container richdraw");}
	},
	/*
	Function: criaDivContainer
	
	Cria o elemento DIV que será utilizado para renderizar os elementos gráficos.
	Nesse DIV serão incluídos os elementos de desenho em SVG ou VML 
	
	O DIV recebe como ID "divGeometriasTemp"
	
	Return:
	
	DOM object
	*/
	criaDivContainer: function(){
		if (!$i("divGeometriasTemp")){
			//
			//pega a posição da imagem do mapa para posicionar corretamente o container
			//
			var pos = [0,0];
			var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));
			//
			//cria o container
			//
			var novoel = document.createElement("div");
			novoel.id = "divGeometriasTemp";
			var ne = novoel.style;
			ne.cursor="crosshair";
			ne.zIndex=0;
			ne.position="absolute";
			ne.width=i3GEO.parametros.w;
			ne.height=i3GEO.parametros.h;
			ne.border="1px solid black";
			ne.display="none";
			ne.top=pos[1];
			ne.left=pos[0];
			document.body.appendChild(novoel);
		}
		return ($i("divGeometriasTemp"));	
	},
	/*
	Function: aplica

	Desenha ou reposiciona elementos na tela usando a biblioteca richdraw

	Parametros:

	tipo {string} - resizelinha|resizePoligono|insereCirculo tipo de operação

	objeto {object} - objeto gráfico existente no container richdraw

	n {numeric} - índice do elemento no array pontosdistobj
	
	texto {string} - texto que será inserido no tipo "insereTexto"
	*/	
	aplica: function(tipo,objeto,n,texto){
		if(i3GEO.desenho.richdraw && $i(i3GEO.interface.IDCORPO)){
			var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));
			//
			//faz o reposicionamento de linhas quando o mouse é movido e a linha está ativa
			//
			if((tipo=="resizeLinha") || (tipo=="resizePoligono") && navn){
				try
				{i3GEO.desenho.richdraw.renderer.resize(objeto,0,0,objposicaocursor.imgx,objposicaocursor.imgy);}
				catch(e){window.status=n+" erro ao movimentar a linha ";}
			}
			if((tipo=="resizeLinha") && navm){
				try{
					//
					//no caso do ie, a linha tem de ser removida e desenhada novamente
					//
					var r = $i(i3GEO.desenho.richdraw.container.id);
					//verifica se o elemento é do tipo texto, se for, pega o anterior a ele
					var elemento = r.lastChild;
					if(elemento.innerHTML != ""){
						var elementos = r.childNodes;
						var elemento = elementos[elementos.length - 2];
					}
					r.removeChild(elemento);
					var dy = objposicaocursor.imgy;
					var dx = objposicaocursor.imgx - (i3GEO.parametros.w/2);
					i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2)-1,pontosdistobj.yimg[n-1]-3,dx,dy-3);
				}
				catch(e){window.status=n+" erro ao movimentar a linha ";}			
			}
			if((tipo=="resizePoligono") && navm){
				try{
					var r = $i(i3GEO.desenho.richdraw.container.id);
					r.removeChild(r.lastChild);
					r.removeChild(r.lastChild);
					var dy = objposicaocursor.imgy;
					var dx = objposicaocursor.imgx - (i3GEO.parametros.w/2);
					i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2)-1,pontosdistobj.yimg[n-1]-3,dx,dy-3);
					i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[0])-(i3GEO.parametros.w/2)-1,pontosdistobj.yimg[0]-3,dx,dy-3);
				}
				catch(e){window.status=n+" erro ao movimentar a linha ";}			
			}
			if(tipo=="insereCirculo"){
				var dx = Math.pow(((pontosdistobj.xtela[n])*1) - ((pontosdistobj.xtela[n-1])*1),2);
				var dy = Math.pow(((pontosdistobj.ytela[n])*1) - ((pontosdistobj.ytela[n-1])*1),2);
				var w = Math.sqrt(dx + dy);
				if (navn){
					try{
						i3GEO.desenho.richdraw.renderer.create('circ', '', 'rgb(250,250,250)', i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],w,w);
					}
					catch(e){}
				}
				else{
					try{
						i3GEO.desenho.richdraw.renderer.create('circ', '', 'rgb(250,250,250)', i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n-1]-w,pontosdistobj.yimg[n-1]-w,w*2,w*2);
					}
					catch(e){}
				}
			}
			if(tipo=="insereTexto"){
				try{
					i3GEO.desenho.richdraw.renderer.create('text', '', 'rgb(250,250,250)', i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],"","",texto);
				}
				catch(e){}
			}
		}
	}
};
//YAHOO.log("carregou classe desenho", "Classes i3geo");