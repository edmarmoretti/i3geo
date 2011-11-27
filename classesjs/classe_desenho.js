/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Desenho de elementos gráficos

Arquivo:

i3geo/classesjs/classe_desenho.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
if (typeof(i3GEO) === 'undefined'){
	i3GEO = [];
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
	Propriedade: estilos

	Estilos que podem ser utilizados para desenhar os elementos
	*/
	estilos: {
		"normal":{
			fillcolor: 'red',
			linecolor: 'black',
			linewidth: '1',
			circcolor: 'white',
			textcolor: 'gray'
		},
		"palido":{
			fillcolor: 'gray',
			linecolor: 'gray',
			linewidth: '1',
			circcolor: 'gray',
			textcolor: 'gray'
		},
		"vermelho":{
			fillcolor: 'gray',
			linecolor: 'red',
			linewidth: '1',
			circcolor: 'pink',
			textcolor: 'brown'
		},
		"verde":{
			fillcolor: 'gray',
			linecolor: 'green',
			linewidth: '1',
			circcolor: 'DarkGreen',
			textcolor: 'GreenYellow'
		}
	},
	/*
	Propriedade: estiloPadrao

	Estilo utilizado como padrão
	*/
	estiloPadrao: "normal",
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
		if(typeof(console) !== 'undefined'){console.info("i3GEO.desenho.criaContainerRichdraw()");}
		pontosdistobj = {
			xpt: [],
			ypt: [],
			dist: [],
			distV: [],
			xtela: [],
			ytela: [],
			ximg: [],
			yimg: [],
			linhas: []
		};
		if(i3GEO.Interface.ATUAL === "googleearth")
		{return;}
		try{
			var divgeo,renderer;
			divgeo = i3GEO.desenho.criaDivContainer();
			divgeo.innerHTML = "";
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
			catch(erro){
				renderer = new SVGRenderer();
				i3GEO.desenho.richdraw = new RichDrawEditor(divgeo, renderer);
			}
			//
			//definição dos símbolos default para os elementos gráficos
			//
			i3GEO.desenho.definePadrao(i3GEO.desenho.estiloPadrao);
			i3GEO.desenho.richdraw.editCommand('mode', 'line');
			divgeo.style.display="block";
			//
			//após o container ser criado, é necessário que as funções
			//de clique sobre o mapa sejam ativadas
			//para funcionarem sobre o container
			//
			i3GEO.eventos.ativa(divgeo);
			if($i("localizarxygeoProjxg")){
				var temp = function(){
					i3GEO.coordenadas.atualizaGeo(objposicaocursor.dmsx,objposicaocursor.dmsy,"localizarxygeoProj");
				};
				YAHOO.util.Event.addListener(divgeo,"mousemove", temp);
			}
		}
		catch(men){alert("Erro ao tentar criar container richdraw "+men);}
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
		desenhoUltimaLinha = "";
		desenhoUltimaLinhaPol = "";
		if (!$i("divGeometriasTemp")){
			var pos,novoel,ne;
			//
			//pega a posição da imagem do mapa para posicionar corretamente o container
			//
			pos = [0,0];
			pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			//
			//cria o container
			//
			novoel = document.createElement("div");
			novoel.id = "divGeometriasTemp";
			ne = novoel.style;
			ne.cursor="crosshair";
			ne.zIndex=0;
			if(i3GEO.Interface.TABLET === true)
			{ne.zIndex=5000;}
			ne.position="absolute";
			ne.width=i3GEO.parametros.w;
			ne.height=i3GEO.parametros.h;
			ne.border="0px solid black";
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
		var pos,r,elemento,elementos,dy,dx,w,i,nindice,ix,iy,dm;
		if(i3GEO.desenho.richdraw && $i(i3GEO.Interface.IDCORPO)){
			//pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			//
			//faz o reposicionamento de linhas quando o mouse é movido e a linha está ativa
			//
			if((tipo==="resizeLinha") || (tipo==="resizePoligono") && navn){
				try
				{i3GEO.desenho.richdraw.renderer.resize(objeto,0,0,objposicaocursor.imgx,objposicaocursor.imgy);}
				catch(erro){
					if(typeof(console) !== 'undefined'){console.error(erro);}
				}
			}
			if((tipo==="resizeLinha") && navm){
				r = $i(i3GEO.desenho.richdraw.container.id);
				elementos = r.childNodes;
				if(desenhoUltimaLinha !== "")
				{r.removeChild(desenhoUltimaLinha);}
				dy = objposicaocursor.imgy;
				dx = objposicaocursor.imgx - (i3GEO.parametros.w/2);
				i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n-1],dx,dy);				
				desenhoUltimaLinha = r.childNodes[$i(i3GEO.desenho.richdraw.container.id).childNodes.length - 1];
			}
			if((tipo==="resizePoligono") && navm){
				try{
					r = $i(i3GEO.desenho.richdraw.container.id);
					elementos = r.childNodes;
					if(desenhoUltimaLinhaPol !== "")
					{r.removeChild(desenhoUltimaLinhaPol);}
					dy = objposicaocursor.imgy;
					dx = objposicaocursor.imgx - (i3GEO.parametros.w/2);
					i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n-1],dx,dy);
					desenhoUltimaLinhaPol = r.childNodes[$i(i3GEO.desenho.richdraw.container.id).childNodes.length - 1];
				}
				catch(men){
					if(typeof(console) !== 'undefined'){console.error(men);}
				}
			}
			if(tipo==="insereCirculo"){
				dx = Math.pow(((pontosdistobj.xtela[n])*1) - ((pontosdistobj.xtela[n-1])*1),2);
				dy = Math.pow(((pontosdistobj.ytela[n])*1) - ((pontosdistobj.ytela[n-1])*1),2);
				w = Math.sqrt(dx + dy);
				i3GEO.desenho.insereCirculo(pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],w);
			}
			if(tipo==="insereTexto"){
				try{
					i3GEO.desenho.richdraw.renderer.create('text', '', i3GEO.desenho.richdraw.textColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],"","",texto);
				}
				catch(men){
					if(typeof(console) !== 'undefined'){console.error(men);}
				}
			}
		}
	},
	/*
	Function: insereCirculo

	Insere um circulo no container de elementos gráficos

	Parametros:

	x {numerico} - posição do ponto em coordenadas de imagem

	y {numerico} - posição do ponto em coordenadas de imagem

	w {numerico} - raio do círculo em pixels
	*/
	insereCirculo: function(x,y,w){
		if (navn){
			try{
				i3GEO.desenho.richdraw.renderer.create('circ', '', i3GEO.desenho.richdraw.circColor, i3GEO.desenho.richdraw.lineWidth, x,y,w,w);
			}
			catch(men){
				if(typeof(console) !== 'undefined'){console.error(men);}
			}
		}
		else{
			try{
				i3GEO.desenho.richdraw.renderer.create('circ', '', i3GEO.desenho.richdraw.circColor, i3GEO.desenho.richdraw.lineWidth, x-w,y-w,w*2,w*2);
			}
			catch(men){
				if(typeof(console) !== 'undefined'){console.error(men);}
			}
		}
	},
	/*
	Function: definePadrao

	Aplica um determinado padrao de estilos para os novos elementos que serão adicionados

	Parametro:

	padrao {string} - nome do estilo
	*/
	definePadrao: function(padrao){
		padrao = i3GEO.desenho.estilos[padrao];
		i3GEO.desenho.richdraw.editCommand('fillcolor', padrao.fillcolor);
		i3GEO.desenho.richdraw.editCommand('linecolor', padrao.linecolor);
		i3GEO.desenho.richdraw.editCommand('linewidth', padrao.linewidth);
		i3GEO.desenho.richdraw.editCommand('circcolor', padrao.circcolor);
		i3GEO.desenho.richdraw.editCommand('textcolor', padrao.textcolor);
	},
	/*
	Function: caixaEstilos

	Cria uma caixa de seleção para escolha do estilo a ser utilizado
	*/
	caixaEstilos: function(){
		var lista = i3GEO.util.listaChaves(i3GEO.desenho.estilos),
			n = lista.length,
			i,
			caixa,
			sel;
		caixa = "<select onchange='i3GEO.desenho.definePadrao(this.value)'>";
		for(i=0;i<n;i+=1){
			sel = "";
			if(lista[i] === i3GEO.desenho.estiloPadrao)
			{sel = "select";}
			caixa += "<option value='"+lista[i]+"' sel >"+lista[i]+"</option>";
		}
		caixa += "</select>";
		return caixa;
	}
};
//YAHOO.log("carregou classe desenho", "Classes i3geo");