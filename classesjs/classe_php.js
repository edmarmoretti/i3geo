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
	
	PHP:
	classesphp/classe_shp.php
	
	<SHP->__construct>
	
	<SHP->insereSHPgrafico>
	*/
	insereSHPgrafico: function(funcao,tema,x,y,itens,shadow_height,width,inclinacao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+x+"&y="+y+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHPgrafico",funcao);
	},
	/*
	Function: insereSHP
	
	PHP:
	classesphp/classe_shp.php
	
	<SHP->__construct>
	
	<SHP->insereSHP>
	*/
	insereSHP: function(funcao,tema,item,valoritem,xy){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&item="+item+"&valor="+valoritem+"&tema="+tema+"&xy="+xy+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHPgrafico",funcao);
	},
	/*
	Function: pegaMensagens

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->pegaMensagens>	
	*/
	pegaMensagens: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMensagens&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaMensagem",funcao);	
	},
	/*
	Function: areaPixel

	PHP:
	classesphp/funcoes_gerais.php
	
	<calculaAreaPixel>	
	*/
	areaPixel: function(funcao,g_celula){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=areaPixel&celsize="+g_celula+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"areaPixel",funcao);	
	},
	/*
	Function: excluitema

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->excluiTemas>	
	*/
	excluitema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"excluitema",funcao);	
	},
	/*
	Function: reordenatemas

	PHP:
	classesphp/classe_temas.php
	
	<Temas->reordenatemas>	
	*/
	reordenatemas: function(funcao,lista){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"reordenatemas",funcao);	
	},
	/*
	Function: criaLegendaHTML

	PHP:
	classesphp/classe_legenda.php
	
	<Legenda->__construct>
	
	<Legenda->criaLegenda>	
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

	PHP:
	classesphp/classe_alteraclasse.php
	
	<Alteraclasse->__construct>
	
	<Alteraclasse->inverteStatusClasse>	
	*/
	inverteStatusClasse: function(funcao,tema,classe){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+i3GEO.arvoreDeCamadas.SID+"&tema="+tema+"&classe="+classe;
		cpJSON.call(p,"inverteStatusClasse",funcao);	
	},
	/*
	Function: ligatemas

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->ligaDesligaTemas>	
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

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeMenus>	
	*/
	pegalistademenus: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+i3GEO.configura.sid+"&map_file=";
		cpJSON.call(p,"pegalistademenus",funcao);	
	},
	/*
	Function: pegalistademenus

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeGrupos>	
	*/
	pegalistadegrupos: function(funcao,id_menu,listasgrupos){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&map_file=&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&listasistemas=nao&listasgrupos="+listasgrupos;
		cpJSON.call(p,"pegalistadegrupos",funcao);	
	},
	/*
	Function: pegalistadeSubgrupos

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeSubGrupos>	
	*/
	pegalistadeSubgrupos: function(funcao,id_menu,id_grupo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&map_file=";
		cpJSON.call(p,"pegalistadeSubgrupos",funcao);	
	},
	/*
	Function: pegalistadetemas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeTemas>	
	*/
	pegalistadetemas: function(funcao,id_menu,id_grupo,id_subgrupo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&subgrupo="+id_subgrupo+"&map_file=";
		cpJSON.call(p,"pegalistadetemas",funcao);	
	},
	/*
	Function: listaTemas

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->listaTemas>	
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
	Function: listaTemasComSel

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->listaTemasComSel>	
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

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->listatemasTipo>	
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

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaSistemas>	
	*/
	pegaSistemas: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemas&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: listadrives

	<listaDrives>	
	*/
	listadrives: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaDrives&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"listaDrives",funcao);	
	},
	/*
	Function: listaarquivos

	<listaArquivos>	
	*/
	listaarquivos: function(funcao,caminho){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaArquivos&diretorio="+caminho;
		cpJSON.call(p,"listaArquivos",funcao);	
	},
	/*
	Function: geo2utm

	<geo2utm>	
	*/
	geo2utm: function(funcao,x,y){
		i3GEO.php.verifica();
		if($i("aguardeGifAberto"))
		{return;}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"geo2utm",funcao);	
	},
	/*
	Function: desativacgi

	<desativacgi>
	*/
	desativacgi: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=desativacgi&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"desativacgi",funcao);	
	},
	/*
	Function: pegaMapas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeMapas>
	*/
	pegaMapas: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: mudatamanho

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->mudaQS>
	*/
	mudatamanho: function(funcao,altura,largura){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+altura+"&largura="+largura+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: ativalogo

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->ativalogo>
	*/
	ativalogo: function(funcao,altura,largura){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"ativalogo",funcao);	
	},
	/*
	Function: insereAnnotation

	PHP:
	classesphp/classe_temas.php
	
	<Temas->insereFeature>
	*/
	insereAnnotation: function(funcao,pin,xy,texto,position,partials,offsetx,offsety,minfeaturesize,mindistance,force,shadowcolor,shadowsizex,shadowsizey,outlinecolor,cor,sombray,sombrax,sombra,fundo,angulo,tamanho,fonte){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+pin+"&tipo=ANNOTATION&xy="+xy+"&texto="+texto+"&position="+position+"&partials="+partials+"&offsetx="+offsetx+"&offsety="+offsety+"&minfeaturesize="+minfeaturesize+"&mindistance="+mindistance+"&force="+force+"&shadowcolor="+shadowcolor+"&shadowsizex="+shadowsizex+"&shadowsizey="+shadowsizey+"&outlinecolor="+outlinecolor+"&cor="+cor+"&sombray="+sombray+"&sombrax="+sombrax+"&sombra="+sombra+"&fundo="+fundo+"&angulo="+angulo+"&tamanho="+tamanho+"&fonte="+fonte+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"inserefeature",funcao);	
	},
	/*
	Function: identificaunico

	PHP:
	classesphp/classe_atributos.php
	
	<Atributos->identificaQBP>
	*/
	identificaunico: function(funcao,xy,tema,item){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+xy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"identificaunico",funcao);	
	},
	/*
	Function: recuperamapa

	PHP:
	classesphp/mapa_controle.php
	
	<recuperamapa>
	*/
	recuperamapa: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"recuperamapa",funcao);	
	},
	/*
	Function: criaLegendaImagem

	PHP:
	classesphp/classe_legenda.php
	
	<Atributos->legendaGrafica>
	*/
	criaLegendaImagem: function(funcao){
		i3GEO.php.verifica();
		var p =i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"criaLegendaImagem",funcao);	
	},
	/*
	Function: referenciadinamica

	PHP:
	classesphp/funcoes_gerais.php
	
	<retornaReferenciaDinamica>
	*/
	referenciadinamica: function(funcao,zoom,tipo){
		i3GEO.php.verifica();
		if(arguments.length === 2)
		{tipo = "dinamico";}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referenciadinamica&g_sid="+i3GEO.configura.sid+"&zoom="+zoom+"&tipo="+tipo;
		cpJSON.call(p,"retornaReferenciaDinamica",funcao);	
	},
	/*
	Function: referencia

	PHP:
	classesphp/funcoes_gerais.php
	
	<retornaReferencia>	
	*/
	referencia: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"retornaReferencia",funcao);	
	},
	/*
	Function: pan

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->pan>
	*/
	pan: function(funcao,escala,tipo,x,y){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+escala+"&tipo="+tipo+"&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pan",funcao);
	},
	/*
	Function: aproxima

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->aproxima>	
	*/
	aproxima: function(funcao,nivel){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"aproxima",funcao);	
	},
	/*
	Function: afasta

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->afasta>	
	*/
	afasta: function(funcao,nivel){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"afasta",funcao);	
	},
	/*
	Function: zoomponto

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->zoomponto>	
	*/
	zoomponto: function(funcao,x,y){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+x+" "+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"zoomponto",funcao);	
	},
	/*
	Function: localizaIP

	PHP:
	classesphp/funccoes_gerais.php
	*/
	localizaIP: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"localizaIP",funcao);	
	},
	/*
	Function: mudaext

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->mudaExtensao>	
	*/
	mudaext: function(funcao,tipoimagem,ext,locaplic,sid){
		var retorno,p;
		if(arguments.length === 3){
			i3GEO.php.verifica();
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;
		}
		if(ext === 'undefined')
		{alert("extensao nao definida");return;}
		retorno = function(retorno){
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				i3GEO.Interface.googlemaps.zoom2extent(ext);
    			i3GEO.janela.fechaAguarde();
			}
			if(i3GEO.Interface.ATUAL === "openlayers"){
				i3GEO.Interface.openlayers.zoom2ext(ext);
    			i3GEO.janela.fechaAguarde();			
			}
			if(i3GEO.Interface.ATUAL === "padrao")
			{i3GEO.atualiza(retorno);}
		};
		p = locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+tipoimagem+"&ext="+ext+"&g_sid="+sid;
		cpJSON.call(p,"mudaext",retorno);	
	},
	/*
	Function: mudaescala

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->mudaEscala>	
	*/
	mudaescala: function(funcao,escala){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+escala+"&g_sid="+i3GEO.configura.sid+"&tipoimagem="+i3GEO.configura.tipoimagem;
		cpJSON.call(p,"mudaescala",funcao);	
	},
	/*
	Function: aplicaResolucao

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->aplicaResolucao>	
	*/
	aplicaResolucao: function(funcao,resolucao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao="+resolucao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"crialente",funcao);	
	},
	/*
	Function: geradestaque

	PHP:
	classesphp/classe_temas.php
	
	<Temas->geraDestaque>	
	*/
	geradestaque: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"geradestaque",funcao);	
	},
	/*
	Function: selecaopt

	PHP:
	classesphp/classe_selecao.php
	
	<Selecao->selecaoPT>	
	*/
	selecaopt: function(funcao,tema,xy,tipo,tolerancia){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaopt&tema="+tema+"&tipo="+tipo+"&xy="+xy+"&tolerancia="+tolerancia+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"selecaoPT",funcao);	
	},
	/*
	Function: selecaobox

	PHP:
	classesphp/classe_selecao.php
	
	<Selecao->selecaoBOX>	
	*/
	selecaobox: function(funcao,tema,tipo,box){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+box+"&g_sid="+i3GEO.configura.sid+"&tipo="+tipo+"&tema="+tema;
		cpJSON.call(p,"selecaobox",funcao);	
	},
	/*
	Function: sobetema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->sobeTema>	
	*/
	sobetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"sobetema",funcao);	
	},
	/*
	Function: descetema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->desceTema>
	*/
	descetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"descetema",funcao);	
	},
	/*
	Function: fontetema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->fonteTema>	
	*/
	fontetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=fontetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"fontetema",funcao);	
	},
	/*
	Function: zoomtema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->zoomTema>	
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

	PHP:
	classesphp/classe_temas.php
	
	<Temas->zoomSel>	
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

	PHP:
	classesphp/classe_selecao.php
	
	<Selecao->selecaoLimpa>	
	*/
	limpasel: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"limpasel",funcao);	
	},
	/*
	Function: mudatransp

	PHP:
	classesphp/classe_temas.php
	
	<Temas->mudaTransparencia>	
	*/
	mudatransp: function(funcao,tema,valor){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudatransp",funcao);	
	},
	/*
	Function: mudanome

	PHP:
	classesphp/classe_temas.php
	
	<Temas->mudaTransparencia>	
	*/
	mudanome: function(funcao,tema,valor){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudanome",funcao);	
	},
	/*
	Function: adicionaTemaWMS

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionatemawms>	
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

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionaTemaSHP>	
	*/
	adicionaTemaSHP: function(funcao,path){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaSHP&arq="+path;
		cpJSON.call(p,"adicionaTemaSHP",funcao);	
	},
	/*
	Function: adicionaTemaIMG

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionaTemaIMG>	
	*/
	adicionaTemaIMG: function(funcao,path){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaIMG&arq="+path;
		cpJSON.call(p,"adicionaTemaIMG",funcao);	
	},
	/*
	Function: identifica
	
	Depreciado na versão 4.2 (utilize "identifica2")
	
	PHP:
	classesphp/classe_atributos.php
	
	<Atributos->identifica>	
	*/
	identifica: function(funcao,x,y,resolucao,locaplic,sid){
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=identifica&opcao=tip&xy="+x+","+y+"&resolucao=5&g_sid="+sid;
		cpJSON.call(p,"identifica",funcao);	
	},
	/*
	Function: identifica2

	PHP:
	classesphp/classe_atributos.php
	
	<Atributos->identifica2>	
	*/
	identifica2: function(funcao,x,y,resolucao,opcao,locaplic,sid,tema){
		if(arguments.length === 4){
			opcao = "tip";
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;		
		}
		if(arguments.length === 5){
			locaplic = i3GEO.configura.locaplic;
			sid = i3GEO.configura.sid;		
		}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=identifica2&opcao="+opcao+"&xy="+x+","+y+"&resolucao=5&g_sid="+sid;
		if(opcao !== "tip")
		{p += "&tema="+tema;}
		cpJSON.call(p,"identifica",funcao);	
	},

	/*
	Function: reiniciaMapa

	PHP:
	classesphp/mapa_controle.php
	*/
	reiniciaMapa: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"reiniciaMapa",funcao);	
	},
	/*
	Function: procurartemas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->procurartemas>	
	*/
	procurartemas: function(funcao,procurar,locaplic){
		if(arguments.length === 2)
		{locaplic = i3GEO.configura.locaplic;}
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&map_file=&procurar="+procurar;
		cpJSON.call(p,"procurartemas",funcao);	
	},
	/*
	Function: adtema

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionaTema>	
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

	PHP:
	classesphp/classe_escala.php
	
	<Escala->retornaBarraEscala>	
	*/
	escalagrafica: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"escalagrafica",funcao);	
	},
	/*
	Function: flamingo

	PHP:
	classesphp/mapa_controle.php
	
	<montaFlamingo>	
	*/
	flamingo: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=montaFlamingo&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"montaFlamingo",funcao);	
	},
	/*
	Function: openlayers

	PHP:
	classesphp/mapa_controle.php
	
	<openlayers>	
	*/
	openlayers: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=openlayers&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"openlayers",funcao);	
	},
	/*
	Function: corpo

	PHP:
	classesphp/mapa_controle.php
	
	<redesenhaMapa>	
	*/
	corpo: function(funcao,tipoimagem){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&tipoimagem="+tipoimagem+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL;
		cpJSON.call(p,"corpo",funcao);	
	},
	/*
	Function: criamapa

	PHP:
	classesphp/mapa_controle.php
	
	<criaMapa>	
	*/
	criamapa: function(funcao,parametros){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa&"+parametros;
		cpJSON.call(p,"criaMapa",funcao);	
	},
	/*
	Function: inicia

	PHP:
	classesphp/mapa_controle.php
	
	<iniciaMapa>	
	*/
	inicia: function(funcao,embedLegenda,w,h){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+embedLegenda+"&w="+w+"&h="+h+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL;
		cpJSON.call(p,"iniciaMapa",funcao);	
	},
	/*
	Function: chaveGoogle

	PHP:
	classesphp/mapa_controle.php
	
	<chavegoogle>	
	*/
	chaveGoogle: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=chavegoogle&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"chavegoogle",funcao);	
	},
	/*
	Function: listaRSSwsARRAY

	PHP:
	classesphp/wscliente.php
	
	<listaRSSwsARRAY>	
	*/
	listaRSSwsARRAY: function(funcao,tipo){
		var p = i3GEO.configura.locaplic+"/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss="+["|"]+"&tipo="+tipo;
		cpJSON.call(p,"listaRSSwsARRAY",funcao);	
	},
	/*
	Function: listaLayersWMS

	PHP:
	classesphp/wmswfs.php
	
	<listaLayersWMS>	
	*/
	listaLayersWMS: function(funcao,servico,nivel,id_ws,nomelayer){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaLayersWMS&servico="+servico+"&nivel="+nivel+"&id_ws="+id_ws+"&nomelayer="+nomelayer;
		cpJSON.call(p,"listaLayersWMS",funcao);	
	},
	/*
	Function: buscaRapida

	PHP:
	classesphp/funcoes_gerais.php
	
	<buscaRapida>	
	*/
	buscaRapida: function(funcao,locaplic,servico,palavra){
		var p = locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=buscaRapida&palavra="+palavra+"&servico="+servico;
		cpJSON.call(p,"buscaRapida",funcao);	
	},
	/*
	Function: listaItensTema

	PHP:
	classesphp/classe_atributos.php
	
	<listaItens>	
	*/
	listaItensTema: function(funcao,tema){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaitens&tema="+tema;
	 	cpJSON.call(p,"listaItensTema",funcao);
	},
	/*
	Function: listaValoresItensTema

	PHP:
	classesphp/classe_atributos.php
	
	<listaRegistros>	
	*/
	listaValoresItensTema: function(funcao,tema,itemTema){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema;
	 	cpJSON.call(p,"listaRegistros",funcao);
	},
	/*
	Function: extRegistros

	PHP:
	classesphp/classe_atributos.php
	
	<extensaoRegistro>	
	*/
	extRegistros: function(funcao,tema,reg){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=extregistros&registro="+reg+"&tema="+tema;
		cpJSON.call(p,"listaItensTema",funcao);
	},
	/*
	Function: listaFontesTexto
	
	<listaTrueType>	
	*/
	listaFontesTexto: function(funcao){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listatruetype";
		cpJSON.call(p,"listaTrueType",funcao);
	},
	/*
	Function: listaEpsg
	
	<listaEpsg>	
	*/
	listaEpsg: function(funcao){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaEpsg";
		cpJSON.call(p,"listaEpsg",funcao);
	}
};
//incluisel - tabela
//criatemasel - tabela
//estatistica - tabela
//verPaleta - pontosdistri
//analisedistri - pontosdistri
//download - download