/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: PHP

Arquivo:

i3geo/classesjs/classe_php.js

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
/*
Propriedade: cpJSON

Objeto CPAINT (ver biblioteca CPAINT) utilizado nas chamadas AJAX assíncronas com retorno no formato JSON

Exemplo:

	cpJSON.call()
	
Return:
	
	O objeto CPAINT retorna os dados encapsulados em um objeto JSON. Os programas PHP
	que fazem uso dessa biblioteca (CPAINT) devem fazer o include da mesma.
	Os dados de interesse retornados no objeto JSON, ficam embutidos na propriedade "data", por exemplo:
	
	var temp = function(retorno){alert(retorno.data);}
	
	cpJSON.call(p,"teste",temp);
	
	onde, p contém o nome do programa PHP e seus parâmetros
	"teste" é o nome da função PHP (no caso do i3Geo, isso não afeta em nada)
	e temp é a função que tratará o retorno dos dados.
	
*/
cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
/*
Classe: i3GEO.php

Chamadas em AJAX que executam programas no lado do servidor

Muitos dos parâmetros exigidos pelos programas em PHP são obtidos da variável
de seção aberta no servidor quando o i3Geo é inicializado, é o caso por exemplo do nome
do arquivo correspondente ao mapfile atualmente em uso

Quando classe_php.js é carregado, é criado o objeto cpJSON que necessita da biblioteca CPAINT. Esse objeto
é utilizado nas chamadas AJAX.

O objeto cpJSON possuí um método .call que executa a operação AJAX. Esse método utiliza basicamente dois parâmetros,
sendo o primeiro o endereço do programa PHP que será executado no servidor e o outro é o nome da função que irá
receber e processar os resultados do programa. Exemplo:

cpJSON.call(p,"",funcao);

"p" é a URL e funcao o nome da função

Para compor "p" o i3geo utiliza normalmente a variável i3GEO.configura.locaplic e i3GEO.configura.sid, por exemplo:

var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&g_sid="+i3GEO.configura.sid

Para mais detalhes sobre as funções, veja <mapa_controle.php>
*/
i3GEO.php = {
	/*
	Function: verifica
	
	Verifica se as variáveis i3GEO.configura.locaplic e i3GEO.configura.sid existem
	*/
	verifica: function(){
		if(i3GEO.configura.locaplic === undefined)
		{alert("variavel i3GEO.configura.locaplic não esta definida");}
		if(i3GEO.configura.sid === undefined)
		{alert("variavel i3GEO.configura.locaplic não esta definida");}
	},
	/*
	Function: insereSHPgrafico
	
	<INSERESHPGRAFICO>
	*/
	insereSHPgrafico: function(funcao,tema,x,y,itens,shadow_height,width,inclinacao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+x+"&y="+y+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHPgrafico",funcao);
	},
	/*
	Function: insereSHP
	
	<INSERESHP>
	*/
	insereSHP: function(funcao,tema,item,valoritem,xy,projecao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&item="+item+"&valor="+valoritem+"&tema="+tema+"&xy="+xy+"&projecao="+projecao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHP",funcao);
	},
	/*
	Function: pegaMensagens

	<PEGAMENSAGENS>	
	*/
	pegaMensagens: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMensagens&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaMensagem",funcao);	
	},
	/*
	Function: areaPixel

	<AREAPIXEL>	
	*/
	areaPixel: function(funcao,g_celula){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=areaPixel&celsize="+g_celula+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"areaPixel",funcao);	
	},
	/*
	Function: excluitema

	<EXCLUITEMA>	
	*/
	excluitema: function(funcao,tema){
		var layer;
		i3GEO.php.verifica();
		var retorno = function(retorno){
			if(i3GEO.Interface.ATUAL === "openlayers"){
				layers = i3geoOL.getLayersByName(tema);
				if(layers.length > 0)
				{i3geoOL.removeLayer(layers[0]);}
			}
			funcao.call(retorno);
		};
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"excluitema",retorno);	
	},
	/*
	Function: reordenatemas

	<REORDENATEMAS>	
	*/
	reordenatemas: function(funcao,lista){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"reordenatemas",funcao);	
	},
	/*
	Function: criaLegendaHTML

	<CRIALEGENDAHTML>	
	*/
	criaLegendaHTML: function(funcao,tema,template){
		i3GEO.php.verifica();
		if(arguments.length === 1){
			tema = "";
			template = "legenda2.htm";
		}
		if(arguments.length === 2)
		{template = "legenda2.htm";}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&tema="+tema+"&templateLegenda="+template+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"criaLegendaHTML",funcao);	
	},
	/*
	Function: inverteStatusClasse

	<INVERTESTATUSCLASSE>	
	*/
	inverteStatusClasse: function(funcao,tema,classe){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+i3GEO.arvoreDeCamadas.SID+"&tema="+tema+"&classe="+classe;
		cpJSON.call(p,"inverteStatusClasse",funcao);	
	},
	/*
	Function: ligatemas

	<LIGATEMAS>	
	*/
	ligatemas: function(funcao,desligar,ligar,adicionar){
		i3GEO.php.verifica();
		if(arguments.length === 3)
		{adicionar = "nao";}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+desligar+"&ligar="+ligar+"&adicionar="+adicionar+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"ligaDesligaTemas",funcao);	
	},
	/*
	Function: pegalistademenus

	<PEGALISTADEMENUS>	
	*/
	pegalistademenus: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+i3GEO.configura.sid+"&map_file=&idioma="+i3GEO.idioma.ATUAL;
		cpJSON.call(p,"pegalistademenus",funcao);	
	},
	/*
	Function: pegalistadegrupos

	<PEGALISTADEGRUPOS>	
	*/
	pegalistadegrupos: function(funcao,id_menu,listasgrupos){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&map_file=&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&listasistemas=nao&listasgrupos="+listasgrupos+"&idioma="+i3GEO.idioma.ATUAL;
		cpJSON.call(p,"pegalistadegrupos",funcao);	
	},
	/*
	Function: pegalistadeSubgrupos

	<PEGALISTADESUBGRUPOS>	
	*/
	pegalistadeSubgrupos: function(funcao,id_menu,id_grupo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&map_file=&idioma="+i3GEO.idioma.ATUAL;
		cpJSON.call(p,"pegalistadeSubgrupos",funcao);	
	},
	/*
	Function: pegalistadetemas

	<PEGALISTADETEMAS>	
	*/
	pegalistadetemas: function(funcao,id_menu,id_grupo,id_subgrupo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&subgrupo="+id_subgrupo+"&map_file=&idioma="+i3GEO.idioma.ATUAL;
		cpJSON.call(p,"pegalistadetemas",funcao);	
	},
	/*
	Function: listaTemas

	<LISTATEMAS>	
	*/
	listaTemas: function(funcao,tipo,locaplic,sid){
		if(arguments.length === 2){
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=listatemas&g_sid="+sid+"&tipo="+tipo;
		cpJSON.call(p,"listaTemas",funcao);	
	},
	/*
	Function: listaTemasEditaveis

	<LISTATEMASLOCAIS>	
	*/
	listaTemasEditaveis: function(funcao,locaplic,sid){
		if(arguments.length === 1){
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=listatemaslocais&g_sid="+sid;
		cpJSON.call(p,"listatemaslocais",funcao);	
	},

	/*
	Function: listaTemasComSel

	<LISTATEMASCOMSEL>	
	*/
	listaTemasComSel: function(funcao,locaplic,sid){
		if(arguments.length === 1){
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=listatemascomsel&g_sid="+sid;
		cpJSON.call(p,"listaTemasComSel",funcao);	
	},
	/*
	Function: listatemasTipo

	<LISTATEMASTIPO>	
	*/
	listatemasTipo: function(funcao,tipo,locaplic,sid){
		if(arguments.length === 2){
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=&funcao=listatemasTipo&tipo="+tipo+"&g_sid="+sid;
		cpJSON.call(p,"listatemasTipo",funcao);	
	},
	/*
	Function: pegaSistemas

	<PEGASISTEMAS>	
	*/
	pegaSistemas: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemas&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: listadrives

	<LISTADRIVES>	
	*/
	listadrives: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaDrives&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"listaDrives",funcao);	
	},
	/*
	Function: listaarquivos

	<LISTAARQUIVOS>	
	*/
	listaarquivos: function(funcao,caminho){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaArquivos&diretorio="+caminho;
		cpJSON.call(p,"listaArquivos",funcao);	
	},
	/*
	Function: geo2utm

	<GEO2UTM>	
	*/
	geo2utm: function(funcao,x,y){
		i3GEO.php.verifica();
		if($i("aguardeGifAberto") || x < -180)
		{return;}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"geo2utm",funcao);	
	},
	/*
	Function: desativacgi

	<DESATIVACGI>
	*/
	desativacgi: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=desativacgi&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"desativacgi",funcao);	
	},
	/*
	Function: pegaMapas

	<PEGALISTADEMAPAS>
	*/
	pegaMapas: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: mudatamanho

	<MUDATAMANHO>
	*/
	mudatamanho: function(funcao,altura,largura){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+altura+"&largura="+largura+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: ativalogo

	<ATIVALOGO>
	*/
	ativalogo: function(funcao,altura,largura){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"ativalogo",funcao);	
	},
	/*
	Function: insereAnnotation

	<INSEREFEATURE>
	*/
	insereAnnotation: function(funcao,pin,xy,texto,position,partials,offsetx,offsety,minfeaturesize,mindistance,force,shadowcolor,shadowsizex,shadowsizey,outlinecolor,cor,sombray,sombrax,sombra,fundo,angulo,tamanho,fonte){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+pin+"&tipo=ANNOTATION&xy="+xy+"&texto="+texto+"&position="+position+"&partials="+partials+"&offsetx="+offsetx+"&offsety="+offsety+"&minfeaturesize="+minfeaturesize+"&mindistance="+mindistance+"&force="+force+"&shadowcolor="+shadowcolor+"&shadowsizex="+shadowsizex+"&shadowsizey="+shadowsizey+"&outlinecolor="+outlinecolor+"&cor="+cor+"&sombray="+sombray+"&sombrax="+sombrax+"&sombra="+sombra+"&fundo="+fundo+"&angulo="+angulo+"&tamanho="+tamanho+"&fonte="+fonte+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"inserefeature",funcao);	
	},
	/*
	Function: identificaunico

	<IDENTIFICAUNICO>
	*/
	identificaunico: function(funcao,xy,tema,item){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+xy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"identificaunico",funcao);	
	},
	/*
	Function: recuperamapa

	<RECUPERAMAPA>
	*/
	recuperamapa: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"recuperamapa",funcao);	
	},
	/*
	Function: criaLegendaImagem

	<CRIALEGENDAIMAGEM>
	*/
	criaLegendaImagem: function(funcao){
		i3GEO.php.verifica();
		var p =i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"criaLegendaImagem",funcao);	
	},
	/*
	Function: referenciadinamica

	<REFERENCIADINAMICA>
	*/
	referenciadinamica: function(funcao,zoom,tipo){
		i3GEO.php.verifica();
		if(arguments.length === 2)
		{tipo = "dinamico";}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referenciadinamica&g_sid="+i3GEO.configura.sid+"&zoom="+zoom+"&tipo="+tipo+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"retornaReferenciaDinamica",funcao);
	},
	/*
	Function: referencia

	<REFERENCIA>	
	*/
	referencia: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"retornaReferencia",funcao);	
	},
	/*
	Function: pan

	<PAN>
	*/
	pan: function(funcao,escala,tipo,x,y){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+escala+"&tipo="+tipo+"&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pan",funcao);
	},
	/*
	Function: aproxima

	<APROXIMA>	
	*/
	aproxima: function(funcao,nivel){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"aproxima",funcao);	
	},
	/*
	Function: afasta

	<AFASTA>	
	*/
	afasta: function(funcao,nivel){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"afasta",funcao);	
	},
	/*
	Function: zoomponto

	<ZOOMPONTO>	
	*/
	zoomponto: function(funcao,x,y){
		i3GEO.php.verifica();
		var retorno = function(retorno){
			if(i3GEO.Interface.ATUAL === "openlayers"){
				i3GEO.Interface.openlayers.pan2ponto(x,y);
    			i3GEO.janela.fechaAguarde();			
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				i3GEO.Interface.googlemaps.pan2ponto(x,y);
    			i3GEO.janela.fechaAguarde();			
			}
			funcao.call(retorno);
		};
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+x+" "+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"zoomponto",retorno);	
	},
	/*
	Function: localizaIP

	<LOCALIZAIP>
	*/
	localizaIP: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"localizaIP",funcao);	
	},
	/*
	Function: mudaext

	O parâmetro "atualiza" é do tipo booleano e indica se o redesenho do mapa será feito ou não.
	
	O parâmetro "geo" é do tipo booleano e indica se as coordenadas deverão ser convertidas para geográficas ao serem salvas no mapfile
	
	<MUDAEXT>	
	*/
	mudaext: function(funcao,tipoimagem,ext,locaplic,sid,atualiza,geo){
		var retorno,p;
		if(arguments.length === 3){
			i3GEO.php.verifica();
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
			atualiza = true;
			geo = false;
		}
		if(geo === undefined)
		{geo = false;}
		if(atualiza === undefined)
		{atualiza = true;}
		if(ext === undefined)
		{alert("extensao nao definida");return;}
		retorno = function(retorno){
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				if(atualiza === true)
				{i3GEO.Interface.googlemaps.zoom2extent(ext);}
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				i3GEO.Interface.googleearth.redesenha();
			}
			if(i3GEO.Interface.ATUAL === "openlayers"){
				i3GEO.Interface.openlayers.zoom2ext(ext);			
			}
			i3GEO.janela.fechaAguarde();
			//
			//o try é necessario para não dar erro
			//
			try{
				funcao.call(retorno);
			}
			catch(e){}
		};
		p = locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+tipoimagem+"&ext="+ext+"&g_sid="+sid+"&geo="+geo;
		cpJSON.call(p,"mudaext",retorno);	
	},
	/*
	Function: mudaescala

	<MUDAESCALA>	
	*/
	mudaescala: function(funcao,escala){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+escala+"&g_sid="+i3GEO.configura.sid+"&tipoimagem="+i3GEO.configura.tipoimagem;
		cpJSON.call(p,"mudaescala",funcao);	
	},
	/*
	Function: aplicaResolucao

	<crialente>	
	*/
	aplicaResolucao: function(funcao,resolucao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao="+resolucao+"&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"crialente",funcao);
	},
	/*
	Function: geradestaque

	<GERADESTAQUE>	
	*/
	geradestaque: function(funcao,tema,ext){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+i3GEO.configura.sid+"&ext="+ext;
		cpJSON.call(p,"geradestaque",funcao);	
	},
	/*
	Function: selecaopt

	<SELECAOPT>	
	*/
	selecaopt: function(funcao,tema,xy,tipo,tolerancia){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaopt&tema="+tema+"&tipo="+tipo+"&xy="+xy+"&tolerancia="+tolerancia+"&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"selecaoPT",funcao);	
	},
	/*
	Function: selecaobox

	<SELECAOBOX>	
	*/
	selecaobox: function(funcao,tema,tipo,box){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+box+"&g_sid="+i3GEO.configura.sid+"&tipo="+tipo+"&tema="+tema+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"selecaobox",funcao);	
	},
	/*
	Function: selecaoext

	<SELECAOEXT>	
	*/
	selecaoext: function(funcao,tema,tipo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoext&tema="+tema+"&tipo="+tipo+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"selecaobox",funcao);	
	},
	/*
	Function: selecaoatrib2

	<SELECAOATRIB2>	
	*/
	selecaoatrib2: function(funcao,tema,filtro,tipo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoatrib2&tema="+tema+"&filtro="+filtro+"&tipo="+tipo+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"selecaoatrib2",funcao);	
	},
	/*
	Function: selecaotema

	<SELECAOTEMA>	
	*/
	selecaotema: function(funcao,temao,tema,tipo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaotema&temao="+temao+"&tema="+tema+"&tipo="+tipo+"&ext="+i3GEO.parametros.mapexten;
		cpJSON.call(p,"selecaotema",funcao);	
	},
	/*
	Function: sobetema

	<SOBETEMA>	
	*/
	sobetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"sobetema",funcao);	
	},
	/*
	Function: descetema

	<DESCETEMA>
	*/
	descetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"descetema",funcao);	
	},
	/*
	Function: fontetema

	<FONTETEMA>	
	*/
	fontetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=fontetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"fontetema",funcao);	
	},
	/*
	Function: zoomtema

	<ZOOMTEMA>	
	*/
	zoomtema: function(funcao,tema){
		i3GEO.php.verifica();
		var retorno,p;
		retorno = function(retorno){
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				eval(retorno.data.variaveis);
				i3GEO.Interface.googlemaps.zoom2extent(mapexten);
    			i3GEO.janela.fechaAguarde();
			}
			if(i3GEO.Interface.ATUAL === "openlayers"){
				eval(retorno.data.variaveis);
				i3GEO.Interface.openlayers.zoom2ext(mapexten);
    			i3GEO.janela.fechaAguarde();
			}
			if(i3GEO.Interface.ATUAL === "padrao")
			{i3GEO.atualiza(retorno);}
		};
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"zoomtema",retorno);	
	},
	/*
	Function: zoomsel

	<ZOOMSEL>	
	*/
	zoomsel: function(funcao,tema){
		i3GEO.php.verifica();
		var retorno,p;
		retorno = function(retorno){
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				eval(retorno.data.variaveis);
				i3GEO.Interface.googlemaps.zoom2extent(mapexten);
    			i3GEO.janela.fechaAguarde();
			}
			if(i3GEO.Interface.ATUAL === "openlayers"){
				eval(retorno.data.variaveis);
				i3GEO.Interface.openlayers.zoom2ext(mapexten);
    			i3GEO.janela.fechaAguarde();
			}
			if(i3GEO.Interface.ATUAL === "padrao")
			{i3GEO.atualiza(retorno);}
		};
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomsel&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"zoomsel",retorno);
	},
	/*
	Function: limpasel

	<LIMPASEL>	
	*/
	limpasel: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"limpasel",funcao);	
	},
	/*
	Function: invertestatuslegenda

	<INVERTESTATUSLEGENDA>	
	*/
	invertestatuslegenda: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=invertestatuslegenda&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"invertestatuslegenda",funcao);	
	},
	/*
	Function: mudatransp

	<MUDATRANSP>	
	*/
	mudatransp: function(funcao,tema,valor){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudatransp",funcao);	
	},	
	/*
	Function: mudanome

	<MUDANOME>	
	*/
	mudanome: function(funcao,tema,valor){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudanome",funcao);	
	},
	/*
	Function: adicionaTemaWMS

	<ADICIONATEMAWMS>	
	*/
	adicionaTemaWMS: function(funcao,servico,tema,nome,proj,formato,versao,nomecamada,tiporep,suportasld,formatosinfo,locaplic,sid){
		if(arguments.length === 11){
			i3GEO.php.verifica();
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		var p = locaplic+"/classesphp/mapa_controle.php?g_sid="+sid+"&funcao=adicionatemawms&servico="+servico+"&tema="+tema+"&nome="+nome+"&proj="+proj+"&formato="+formato+"&versao="+versao+"&nomecamada="+nomecamada+"&tiporep="+tiporep+"&suportasld="+suportasld+"&formatosinfo="+formatosinfo;
		cpJSON.call(p,"adicionatemawms",funcao);	
	},
	/*
	Function: adicionaTemaSHP

	<ADICIONATEMASHP>	
	*/
	adicionaTemaSHP: function(funcao,path){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaSHP&arq="+path;
		cpJSON.call(p,"adicionaTemaSHP",funcao);	
	},
	/*
	Function: adicionaTemaIMG

	<ADICIONATEMAIMG>	
	*/
	adicionaTemaIMG: function(funcao,path){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaIMG&arq="+path;
		cpJSON.call(p,"adicionaTemaIMG",funcao);	
	},
	/*
	Function: identifica
	
	Depreciado na versão 4.2 (utilize "identifica2")	
	*/
	identifica: function(funcao,x,y,resolucao,locaplic,sid){
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=identifica&opcao=tip&xy="+x+","+y+"&resolucao=5&g_sid="+sid;
		cpJSON.call(p,"identifica",funcao);	
	},
	/*
	Function: identifica2

	<IDENTIFICA2>	
	*/
	identifica2: function(funcao,x,y,resolucao,opcao,locaplic,sid,tema,ext,listaDeTemas){
		if(arguments.length === 4){
			opcao = "tip";
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
			ext = "";
			listaDeTemas = "";
		}
		if(arguments.length === 5){
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
			ext = "";
			listaDeTemas = "";
		}
		if(listaDeTemas === undefined)
		{listaDeTemas = "";}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=identifica2&opcao="+opcao+"&xy="+x+","+y+"&resolucao=5&g_sid="+sid+"&ext="+ext+"&listaDeTemas="+listaDeTemas;
		if(opcao !== "tip")
		{p += "&tema="+tema;}
		cpJSON.call(p,"identifica",funcao);	
	},
	/*
	Function: reiniciaMapa

	<REINICIAMAPA>
	*/
	reiniciaMapa: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"reiniciaMapa",funcao);	
	},
	/*
	Depreciado na versão 4.4	
	*/
	procurartemas: function(funcao,procurar,locaplic){
		if(arguments.length === 2)
		{locaplic = i3GEO.configura.locaplic;}
		try{
			var p = locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&map_file=&procurar="+procurar+"&idioma="+i3GEO.idioma.ATUAL;
			cpJSON.call(p,"procurartemas",funcao);
		}catch(e){}
	},
	/*
	Function: procurartemas2

	<PROCURARTEMAS2>	
	*/
	procurartemas2: function(funcao,procurar,locaplic){
		if(arguments.length === 2)
		{locaplic = i3GEO.configura.locaplic;}
		try{
			var p = locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas2&map_file=&procurar="+procurar+"&idioma="+i3GEO.idioma.ATUAL;
			cpJSON.call(p,"procurartemas",funcao);
		}catch(e){}
	},
	/*
	Function: adtema

	<ADTEMA>	
	*/
	adtema: function(funcao,temas,locaplic,sid){
		if(arguments.length === 2){
			i3GEO.php.verifica();
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+temas+"&g_sid="+sid;
		cpJSON.call(p,"adtema",funcao);	
	},
	/*
	Function: escalagrafica

	<ESCALAGRAFICA>	
	*/
	escalagrafica: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"escalagrafica",funcao);	
	},
	/*
	Function: flamingo

	<MONTAFLAMINGO>	
	*/
	flamingo: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=montaFlamingo&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"montaFlamingo",funcao);	
	},
	/*
	Function: googlemaps

	<GOOGLEMAPS>	
	*/
	googlemaps: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=googlemaps&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"googlemaps",funcao);	
	},

	/*
	Function: openlayers

	<OPENLAYERS>	
	*/
	openlayers: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=openlayers&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"openlayers",funcao);	
	},
	/*
	Function: corpo

	<CORPO>	
	*/
	corpo: function(funcao,tipoimagem){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&tipoimagem="+tipoimagem+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL;
		//recalcula a extensão geográfica do parametro i3GEO.parametros.mapexten
		if(i3GEO.Interface.ATUAL === "googleearth"){
			i3GEO.Interface.googleearth.recalcPar();
			p += "&mapexten="+i3GEO.parametros.mapexten;
		}
		cpJSON.call(p,"corpo",funcao);	
	},
	/*
	Function: criamapa

	<CRIAMAPA>	
	*/
	criamapa: function(funcao,parametros){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa&"+parametros;
		cpJSON.call(p,"criaMapa",funcao);	
	},
	/*
	Function: inicia

	<INICIA>	
	*/
	inicia: function(funcao,embedLegenda,w,h){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+embedLegenda+"&w="+w+"&h="+h+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL;
		cpJSON.call(p,"iniciaMapa",funcao);	
	},
	/*
	Function: chaveGoogle

	<CHAVEGOOGLE>	
	*/
	chaveGoogle: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=chavegoogle&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"chavegoogle",funcao);	
	},
	/*
	Function: listaRSSwsARRAY

	<LISTARSSWSARRAY>	
	*/
	listaRSSwsARRAY: function(funcao,tipo){
		var p = i3GEO.configura.locaplic+"/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss="+["|"]+"&tipo="+tipo;
		cpJSON.call(p,"listaRSSwsARRAY",funcao);	
	},
	/*
	Function: listaLayersWMS

	<LISTALAYERSWMS>	
	*/
	listaLayersWMS: function(funcao,servico,nivel,id_ws,nomelayer){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaLayersWMS&servico="+servico+"&nivel="+nivel+"&id_ws="+id_ws+"&nomelayer="+nomelayer;
		cpJSON.call(p,"listaLayersWMS",funcao);	
	},
	/*
	Function: buscaRapida

	<BUSCARAPIDA>	
	*/
	buscaRapida: function(funcao,locaplic,servico,palavra){
		var p = locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=buscaRapida&palavra="+palavra+"&servico="+servico;
		cpJSON.call(p,"buscaRapida",funcao);	
	},
	/*
	Function: listaItensTema

	<LISTAITENS>	
	*/
	listaItensTema: function(funcao,tema){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaitens&tema="+tema;
	 	cpJSON.call(p,"listaItensTema",funcao);
	},
	/*
	Function: listaValoresItensTema

	<LISTAREGISTROS>	
	*/
	listaValoresItensTema: function(funcao,tema,itemTema){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema;
	 	cpJSON.call(p,"listaRegistros",funcao);
	},
	/*
	Function: extRegistros

	<EXTREGISTROS>	
	*/
	extRegistros: function(funcao,tema,reg){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=extregistros&registro="+reg+"&tema="+tema;
		cpJSON.call(p,"listaItensTema",funcao);
	},
	/*
	Function: listaFontesTexto
	
	<LISTATRUETYPE>	
	*/
	listaFontesTexto: function(funcao){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listatruetype";
		cpJSON.call(p,"listaTrueType",funcao);
	},
	/*
	Function: listaEpsg
	
	<LISTAEPSG>	
	*/
	listaEpsg: function(funcao){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaEpsg";
		cpJSON.call(p,"listaEpsg",funcao);
	},
	/*
	Function: criatemasel

	<CRIATEMASEL>	
	*/
	criatemaSel: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criatemasel&tema="+tema+"&nome=Novo tema "+tema;
		cpJSON.call(p,"chavegoogle",funcao);	
	},
	/*
	Function: pegaData

	<PEGADATA>	
	*/
	pegaData: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pegadata&tema="+tema;
		cpJSON.call(p,"pegadata",funcao);	
	},
	/*
	Function: alteraData

	<ALTERADATA>	
	*/
	alteraData: function(funcao,tema,data){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=alteradata&tema="+tema+"&novodata="+data;
		cpJSON.call(p,"alteradata",funcao);	
	}
};