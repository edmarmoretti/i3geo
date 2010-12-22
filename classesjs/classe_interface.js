/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Interface

Arquivo:

i3geo/classesjs/classe_interface.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.Interface

Funcoes que controlam o comportamento específico de determinadas interfaces

As interfaces são definidas na inicialização do i3Geo, por exemplo, openlayers, flamingo,etc

A classe "interface" contém os métdos específicos utilizados nessas interfaces

Exemplo:

Para iniciar o i3geo com uma interface específica, utilize http://localhost/i3geo/ms_criamapa.php?interface=flamingo.htm
O HTML deve conter as definições da interface criada e deve estar armazenado em i3geo/aplicmap
*/
i3GEO.Interface = {
	/*
	Propriedade: OUTPUTFORMAT
	
	Formato de geração da imagem.
	
	Os formatos devem estar definidos no mapfile geral1windows.map e geral1.map. A definição dessa variável não afeta a interface padrão, que utiliza a definição que estiver ativa nos mapfiles de inicialização.
	
	Tipo:
	{MAPSERVER OUTPUTFORMAT}
	
	Default:
	{"AGG_Q"}
	*/
	OUTPUTFORMAT: "AGG_Q",
	/*
	Propriedade: BARRABOTOESTOP
	
	Distância da barra de botões em ralação ao topo do mapa.
	
	Tipo:
	{number}
	
	Default:
	{12}
	*/
	BARRABOTOESTOP: 12,
	/*
	Propriedade: BARRABOTOESLEFT
	
	Distância da barra de botões em ralação ao lado esquerdo do mapa.
	
	Tipo:
	{number}
	
	Default:
	{3}
	*/
	BARRABOTOESLEFT: 3,	

	/*
	Propriedade: ATUAL
	
	Interface atual em uso.
	
	Tipo:
	{string}
	
	Default:
	{"padrao"}
	*/
	ATUAL: "padrao",
	/*
	Propriedade: IDCORPO
	
	ID do elemento HTML que receberá o corpo do mapa
	
	Tipo:
	{string}
	
	Default:
	{"corpoMapa"}
	*/
	IDCORPO: "corpoMapa",
	/*
	Propriedade: ATIVAMENUCONTEXTO

	Indica se o menu de contexto deve ser ativado

	Tipo:
	{Boolean}

	Default:
	{true}
	*/
	ATIVAMENUCONTEXTO: false,
	/*
	Variavel: IDMAPA
	
	ID do elemento HTML criado para conter o mapa
	
	Esse elemento normalmente é criado dentro de IDCORPO dependendo da interface
	*/
	IDMAPA: "",
	/*
	Variavel: STATUS
	
	Indica o status atual do mapa.
	
	É utilizado para verificar o status do mapa e bloquear ou não determinadas funções.
	
	Por exemplo, na interface OpenLayers, identifica se as camadas estão sendo atualizadas
	
	STATUS = {
		atualizando: new Array() //guarda os códigos dos layers que estão sendo redesenhados
	}
	*/
	STATUS: {
		atualizando: []
	},
	/*
	Function: redesenha
	
	Aplica o método redesenha da interface atual. Em alguns casos, a função de redesenho aplica os mesmos
	processos da função de atualizar o mapa. Isso ocorre pq em alguns casos as funções são otimizadas para cada
	situação
	*/
	redesenha: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.redesenha()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.redesenha();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.redesenha();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.redesenha();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.redesenha();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.redesenha();}
	},
	/*
	Function: atualizaMapa
	
	Aplica o método atualizaMapa da interface atual. Em alguns casos, a função de redesenho aplica os mesmos
	processos da função de atualizar o mapa. Isso ocorre pq em alguns casos as funções são otimizadas para cada
	situação
	*/
	atualizaMapa: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.atualizaMapa()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.atualiza();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.atualizaMapa();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.redesenha();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.redesenha();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.redesenha();}
	},	
	/*
	Function: atualizaTema
	
	Aplica o método atualizaTema da interface atual
	
	Parametros:
	
	retorno {JSON} - objeto JSON com os parâmetros obtidos da função PHP de redesenho do mapa
	
	tema {string} - código do tema
	*/
	atualizaTema: function(retorno,tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.atualizaTema()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{return;}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.atualizaTema(retorno,tema);}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.atualizaTema(retorno,tema);}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.atualizaTema(retorno,tema);}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.atualizaTema(retorno,tema);}
	},
	/*
	Function: adicionaKml
	
	Aplica o método de adição de kml ao mapa conforme a interface atual
	*/
	adicionaKml: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.adicionaKml()");}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.adicionaKml("foo");}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.adicionaKml("foo");}
	},
	/*
	Function: cria
	
	Cria ou altera os elementos HTML necessários para a interface
	
	Essa função é executada na inicialização do i3geo
	
	Parametros:
	
	w {Integer} - largura do corpo do mapa em pixels
	
	h {Integer} - altura do corpo do mapa em pixels
	*/
	cria: function(w,h){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.cria()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.cria(w,h);}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.cria(w,h);}
	},
	/*
	Function: inicia
	
	Inicia a interface
	*/
	inicia: function(w,h){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.inicia()");}
		var temp;
		//
		//inicialização  que afeta todas as interfaces
		//
		if($i("i3GEOcurtirFB")){
			temp = window.location.href.split("?")[0];
			$i("i3GEOcurtirFB").innerHTML = "<iframe src='http://www.facebook.com/plugins/like.php?href="+temp+"&amp;layout=button_count&amp;show_faces=false&amp;width=200&amp;action=like&amp;colorscheme=light&amp;height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:220px; height:21px;' allowTransparency='true'></iframe>";
		}
		i3GEO.gadgets.quadros.inicia(10);
		i3GEO.gadgets.quadros.grava("extensao",i3GEO.parametros.extentTotal);					
		i3GEO.gadgets.mostraBuscaRapida();
		i3GEO.gadgets.mostraVersao();
		i3GEO.guias.cria();					
		if($i("arvoreAdicionaTema"))
		{i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,"arvoreAdicionaTema");}
		//
		//esse id é utilizado apenas para manter o mapa não visível até que tudo seja montado
		//
		if($i("mst"))
		{$i("mst").style.display="block";}
		if (i3GEO.configura.entorno === "sim"){
			i3GEO.configura.entorno = "nao";
			i3GEO.navega.entorno.ativaDesativa();
		}
		i3GEO.navega.autoRedesenho.ativa();
		if ($i("i3geo_escalanum")){$i("i3geo_escalanum").value = i3GEO.parametros.mapscale;}
		if ((i3GEO.parametros.geoip === "nao") && ($i("ondeestou")))
		{$i("ondeestou").style.display="none";}		
		//
		//inicialização específica de cada interface
		//
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.inicia();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.inicia();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.inicia();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.inicia();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.inicia();}
	},
	/*
	Function: alteraLayers
	
	Altera todos os layers do mapa modificando um determinado parâmetro
	*/
	alteraParametroLayers: function(parametro,valor){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.inicia()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.atualiza();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.alteraParametroLayers(parametro,valor);}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.alteraParametroLayers(parametro,valor);}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.alteraParametroLayers(parametro,valor);}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.atualiza();}
	},

	/*
	Function: ativaBotoes
	
	Ativa os botões de ferramentas
	*/
	ativaBotoes: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.ativaBotoes()");}
		if(i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.Interface.padrao.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "openlayers")
		{i3GEO.Interface.openlayers.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{i3GEO.Interface.googlemaps.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.Interface.googleearth.ativaBotoes();}
		if(i3GEO.Interface.ATUAL === "flamingo")
		{i3GEO.Interface.flamingo.ativaBotoes();}
	},
	/*
	Classe: i3GEO.Interface.padrao
	
	Interface padrão com motor de navegação do próprio i3Geo
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "padrao"
	*/
	padrao:{
		/*
		Propriedade: TRANSICAO
		
		Ativa ou não o modo de transição suave das imagens quando o mapa é redesenhado. 

		Default:
		true
		
		Tipo:
		{Boolean}
		*/
		TRANSICAO: false,
		redesenha:function(){
			var ndiv,i;
			if(!$i("img")){
				i3GEO.janela.fechaAguarde();
				return;
			}
			$i("img").onload =  function()
			{
				var imagem,temp;
				imagem = $i("img");
				imagem.onload = "";
				//atualiza quadro
				i3GEO.gadgets.quadros.grava("imagem",i3GEO.parametros.mapimagem);
				i3GEO.gadgets.quadros.grava("extensao",i3GEO.parametros.mapexten);
				temp = function(retorno){
					eval(retorno.data);
					i3GEO.gadgets.quadros.grava("legenda",legimagem);
				};
				if(i3GEO.gadgets.quadros.geraLegenda === true)
				{i3GEO.mapa.legendaIMAGEM.obtem(temp);}
				if(i3GEO.Interface.padrao.TRANSICAO === true){
					if ($i("imgtemp"))
					{i3GEO.util.desaparece("imgtemp",50,5,true);}
					i3GEO.util.aparece("img",50,5);
				}
				else{
					if ($i("imgtemp"))
					{i3GEO.util.desaparece("imgtemp",15,5,true);}
					i3GEO.util.aparece("img",5,5);
				}
				i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
			};
			if (!$i("imgtemp")){
				ndiv = document.createElement("div");
				ndiv.id = "imgtemp";
				ndiv.style.position = "absolute";
				ndiv.style.border = "1px solid blue";
				document.getElementById("corpoMapa").appendChild(ndiv);
			}
			if(g_tipoacao === "pan" && i3GEO.barraDeBotoes.BOTAOCLICADO === "pan"){
				$i("imgtemp").style.left = parseInt($i("img").style.left,10);
				$i("imgtemp").style.top = parseInt($i("img").style.top,10);
				$i("imgtemp").style.width = i3GEO.parametros.w;
				$i("imgtemp").style.height = i3GEO.parametros.h;
			}
			$i("imgtemp").style.backgroundImage = 'url("'+$i("img").src+'")';
			$i("imgtemp").style.display="block";
			i = $i("img");
			i.style.display="none";
			i.style.left = 0;
			i.style.top = 0;
			i.src=i3GEO.parametros.mapimagem;
		},
		cria:function(){
			var ins = "<input style='position:relative;top:0px;left:0px'' type=image src='' id='img' />",
				temp = $i(i3GEO.Interface.IDCORPO);
			if(temp)
			{temp.innerHTML = ins;}
			i3GEO.Interface.IDMAPA = "img";
		},
		/*
		Function: ativaMenuContexto
	
		Ativa o menu de contexto acionado com o botão direito do mouse
		*/
		ativaMenuContexto: function(){
			//remove o menu de contexto se existir
			var temp,oFieldContextMenuItemData,oFieldContextMenu,onFieldMenuRender;
			temp = $i("contexto_"+i3GEO.Interface.IDMAPA);
			if(temp){
				temp.parentNode.removeChild(temp);
			}
			oFieldContextMenuItemData = [
				{ text: "&nbsp;<span class='container-close'></span>"},
				{ text: "<img class='rosamais' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-4px;'> Aproxima</span>", onclick: { fn: i3GEO.navega.zoomin } },
				{ text: "<img class='rosamenos' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-4px;'> Afasta</span>", onclick: { fn: i3GEO.navega.zoomout } },
				{ text: "<img class='rosanorte' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Norte</span>", onclick: { fn: i3GEO.navega.panFixoNorte } },
				{ text: "<img class='rosasul' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Sul</span>", onclick: { fn: i3GEO.navega.panFixoSul } },
				{ text: "<img class='rosaleste' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Leste</span>", onclick: { fn: i3GEO.navega.panFixoLeste } },
				{ text: "<img class='rosaoeste' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Oeste</span>", onclick: { fn: i3GEO.navega.panFixoOeste } },
				{ text: "Captura", onclick: { fn:i3GEO.gadgets.quadros.listaImagens} }
			];
			oFieldContextMenu = new YAHOO.widget.ContextMenu(
				"contexto_"+i3GEO.Interface.IDMAPA,{
					trigger: i3GEO.Interface.IDMAPA,
					itemdata: oFieldContextMenuItemData,
					lazyload: true
				}
			);
			onFieldMenuRender = function(){
				var id = "contexto_"+i3GEO.Interface.IDMAPA;
				if(id)
				{$i(id).style.zIndex = 50000;}
			};
			oFieldContextMenu.subscribe("render", onFieldMenuRender);
		},		
		inicia:function(){
			var elemento,i,estilo;
			if ($i("contemImg"))
			{elemento = "contemImg";}
			else
			{elemento = "img";}
			i3GEO.mapa.ajustaPosicao(elemento);
			i = $i("img");
			if(!i){return;}
			i.style.width=i3GEO.parametros.w +"px";
			i.style.height=i3GEO.parametros.h +"px";
			estilo = $i(i3GEO.Interface.IDCORPO).style;
			estilo.width=i3GEO.parametros.w +"px";
			estilo.height=i3GEO.parametros.h +"px";
			estilo.clip = 'rect('+0+" "+(i3GEO.parametros.w)+" "+(i3GEO.parametros.h)+" "+0+')';
			objmapaparado = "nao"; //utilizado para verificar se o mouse esta parado
			i3GEO.gadgets.mostraMenuSuspenso();
			i3GEO.eventos.ativa(i);
			i3GEO.gadgets.mostraCoordenadasGEO();
			i3GEO.gadgets.mostraCoordenadasUTM();
			i3GEO.gadgets.mostraEscalaNumerica();
			i3GEO.gadgets.mostraEscalaGrafica();
			i3GEO.gadgets.visual.inicia();
			i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);
			//
			//i3GEO.arvoreDeCamadas.CAMADAS é definido na inicialização (classe_i3geo)
			//
			i3GEO.arvoreDeCamadas.cria("",i3GEO.arvoreDeCamadas.CAMADAS,i3GEO.configura.sid,i3GEO.configura.locaplic);

			i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);
			i3GEO.Interface.padrao.ativaBotoes();
			i3GEO.idioma.mostraSeletor();
			if (i3GEO.configura.mapaRefDisplay !== "none"){
				if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay"))
				{i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
				if (i3GEO.configura.mapaRefDisplay === "block")
				{i3GEO.maparef.inicia();}
			}
		},
		ativaBotoes: function(){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.padrao.ativaBotoes()");}
			var imagemxy,x1,y1,x2,y2;
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if ($i("barraDeBotoes1") || i3GEO.barraDeBotoes.AUTO === true){
				x1 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y1 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true){
				x2 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y2 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if (($i("barraDeBotoes1") && $i("barraDeBotoes2")) || i3GEO.barraDeBotoes.AUTO === true){
				x1 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT+40;
			}
			if ($i("barraDeBotoes1") || i3GEO.barraDeBotoes.AUTO === true)
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);}
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true)
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);}
			//ativa as funções dos botões
			i3GEO.barraDeBotoes.ativaBotoes();
			if (document.getElementById("botao3d")){
				if (i3GEO.configura.map3d === "")
				{document.getElementById("botao3d").style.display="none";}
			}
			if(i3GEO.Interface.ATIVAMENUCONTEXTO)
			{i3GEO.Interface.padrao.ativaMenuContexto();}
			if(i3GEO.configura.visual !== "default")
			{i3GEO.gadgets.visual.troca(i3GEO.configura.visual);}
		}
	},
	/*
	Classe: i3GEO.Interface.flamingo
	
	Interface com motor de navegação baseado no software Flamingo Map Components (flash)
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "flamingo"
	*/
	flamingo:{
		atualizaTema:function(retorno,tema){
			//
			//não se atualiza um tema único, mas o mapa todo
			//
			i3GEO.atualiza(retorno);
		},	
		redesenha: function(){
			var w = parseInt($i("flamingo").style.width,10);
			if (w === i3GEO.parametros.w)
			{$i("flamingo").style.height = parseInt($i("flamingo").style.height,10)+1;}
			else
			{$i("flamingo").style.height = parseInt($i("flamingo").style.height,10)-1;}
			i3GEO.janela.fechaAguarde();
		},
		cria: function(w,h){
			var i,f,ins;
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				f = $i("flamingo");
				if(!f){
					ins = '<div id=flamingo style="width:0px;height:0px;text-align:left;background-image:url(/"'+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg/")"></div>';
					i.innerHTML = ins;
				}
				f = $i("flamingo");
				f.style.width = w;
				f.style.height = h;
				i3GEO.Interface.IDMAPA = "flamingo";
			}
		},
		inicia: function(){
			var monta = function(retorno){
				$i("flamingo").style.height = i3GEO.parametros.h + 45;
				childPopups  = [];
				childPopupNr = 0;
				var so = new SWFObject(i3GEO.configura.locaplic+"/pacotes/flamingo/flamingo/flamingo.swf?config="+retorno.data, "flamingoi", "100%", "100%", "8", "#eaeaea");
				so.addParam("wmode","transparent"); 
				so.write("flamingo");
			};
			i3GEO.php.flamingo(monta);
			i3GEO.eventos.ativa($i("flamingo"));
			/*
			i3GEO.maparef.atualiza();
			if (i3GEO.configura.mapaRefDisplay !== "none")
			{
				if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay"))
				{i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
				if (i3GEO.configura.mapaRefDisplay === "block"){i3GEO.maparef.inicia();}
			}
			*/
			//
			//i3GEO.arvoreDeCamadas.CAMADAS é definido na inicialização (classe_i3geo)
			//
			i3GEO.arvoreDeCamadas.cria("",i3GEO.arvoreDeCamadas.CAMADAS,i3GEO.configura.sid,i3GEO.configura.locaplic);
			i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);
		},
		ativaBotoes: function(){
		}
	},
	/*
	Classe: i3GEO.Interface.openlayers
	
	Interface com motor de navegação baseado na API OpenLayers
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "openlayers"
	
	Cria o objeto i3geoOL que pode receber os métodos da API do OpenLayers
	
	Para detalhes sobre a configuração da interface, veja i3geo/aplicmap/openlayers.htm
	*/
	openlayers:{
		/*
		Propriedade: TILES
		
		Indica se será utilizado o modo de navegação em tiles
		
		Tipo:
		{boolean}
		
		Default:
		{false}
		*/
		TILES: false,	
		/*
		Propriedade: BUFFER
		
		Número de TILES na área não visível do mapa
		
		Tipo:
		{integer}
		
		Default:
		{0}
		*/
		BUFFER: 0,
		/*
		Propriedade: GADGETS
		
		Lista dos controles específicos da API do OpenLayers que serão inseridos ou não no mapa
		
		Tipo:
		{object}
		
		Default:
		{PanZoomBar:true,LayerSwitcher:true,ScaleLine:true,OverviewMap:true}
		*/
		GADGETS: {
			PanZoomBar:true,
			PanZoom:false,
			LayerSwitcher:true,
			ScaleLine:true,
			OverviewMap:false	
		},
		/*
		Propriedade: MINEXTENT
		
		Menor extensão geográfica que pode ser mostrada no mapa
		
		Tipo:
		{array}
		
		Default:
		{-0.001, -0.001, 0.001, 0.001]}
		*/
		MINEXTENT: [-0.001, -0.001, 0.001, 0.001],
		/*
		Propriedade: MAXEXTENT
		
		Maior extensão geográfica que pode ser mostrada no mapa
		
		Tipo:
		{array}
		
		Default:
		{[-180, -90, 180, 90]}
		*/		
		MAXEXTENT: [-180, -90, 180, 90],
		/*
		Propriedades: LAYERSADICIONAIS
		
		Array com objetos do tipo LAYER que serão adicionados após a crioação de todos os layers default.
		
		Tipo:
		{array}
		
		*/
		LAYERSADICIONAIS: [],
		redesenha: function(){
			//
			//são criados apenas os layers que ainda não existirem no mapa
			//mas que existem na arvore de camadas
			//
			i3GEO.Interface.openlayers.criaLayers();
			i3GEO.Interface.openlayers.ordenaLayers();
			i3GEO.Interface.openlayers.recalcPar();
			i3GEO.janela.fechaAguarde();
		},
		cria: function(w,h){
			var i,f,ins,
				mi = i3GEO.Interface.openlayers.MINEXTENT,
				ma = i3GEO.Interface.openlayers.MAXEXTENT
			;
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				f = $i("openlayers");
				if(!f){
					ins = '<div id=openlayers style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';
					i.innerHTML = ins;
				}
				f = $i("openlayers");
				f.style.width = w;
				f.style.height = h;
			}
			i3GEO.Interface.IDMAPA = "openlayers";
			i3GEO.barraDeBotoes.INCLUIBOTAO.zoomli = true;
			i3GEO.barraDeBotoes.INCLUIBOTAO.pan = true;
			i3GEO.barraDeBotoes.INCLUIBOTAO.zoomtot = true;
			i3geoOL = new OpenLayers.Map('openlayers', {
				controls: [],
				fractionalZoom: true,
				minResolution: "auto",
				minExtent: new OpenLayers.Bounds(mi[0],mi[1],mi[2],mi[3]),
				maxResolution: "auto",
				maxExtent: new OpenLayers.Bounds(ma[0],ma[1],ma[2],ma[3])
			});
		},
		inicia: function(){
			//
			//monta o mapa após receber o resultado da criação do mapfile temporário
			//
			var montaMapa = function(){
				var pz,pos,temp,propriedades,layers,nlayers,i,texto,estilo;
				i3GEO.Interface.openlayers.criaLayers();
				i3GEO.Interface.openlayers.registraEventos();
				i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.mapexten);
				if(i3GEO.Interface.openlayers.GADGETS.PanZoomBar == true){
					pz = new OpenLayers.Control.PanZoomBar();
					i3geoOL.addControl(pz);
					pz.div.style.zIndex = 5000;
					pz.div.style.top ="7px";
				}
				if(i3GEO.Interface.openlayers.GADGETS.PanZoom == true){
					pz = new OpenLayers.Control.PanZoom();
					i3geoOL.addControl(pz);
					pz.div.style.zIndex = 5000;
				}
				//
				//insere a lista de layers de fundo
				//
				temp = $i("listaLayersBase");
				if(temp){
					estilo = "cursor:pointer;vertical-align:top;padding-top:5px;";
					if(navm)
					{estilo = "border:0px solid white;cursor:pointer;vertical-align:middle;padding-top:0px;";}
					temp = {"propriedades": []};
					layers = i3geoOL.getLayersBy("isBaseLayer",true);
					layersn = layers.length;
					for(i=0;i<layersn;i++){
						texto = "<input type=radio style='"+estilo+"' onclick='i3GEO.Interface.openlayers.ativaFundo(this.value)' name=i3GEObaseLayer value='"+layers[i].id+"' />"+layers[i].name;
						temp.propriedades.push({ text: texto, url: ""});
					}
					i3GEO.util.arvore("<b>"+$trad("p16")+"</b>","listaLayersBase",temp);
				}
				else{
					if(i3GEO.Interface.openlayers.GADGETS.LayerSwitcher == true)
					{i3geoOL.addControl(new OpenLayers.Control.LayerSwitcher());}
				}
				if(i3GEO.Interface.openlayers.GADGETS.ScaleLine == true)
				{i3geoOL.addControl(new OpenLayers.Control.ScaleLine());}
				if(i3GEO.Interface.openlayers.GADGETS.OverviewMap == true)
				{i3geoOL.addControl(new OpenLayers.Control.OverviewMap());}
				//i3geoOL.addControl(new OpenLayers.Control.KeyboardDefaults());	
				//
				//estes controles ficam invisíveis e são usados quando os ícones default do i3geo são ativados
				//
				OLpan = new OpenLayers.Control.Navigation();
				OLzoom = new OpenLayers.Control.ZoomBox();
				OLpanel = new OpenLayers.Control.Panel();
				OLpanel.addControls([OLpan,OLzoom]);
				i3geoOL.addControl(OLpanel);
				i3GEO.Interface.openlayers.ativaBotoes();
				if (i3GEO.configura.mapaRefDisplay !== "none"){
					if (i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay"))
					{i3GEO.configura.mapaRefDisplay = i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay");}
					if (i3GEO.configura.mapaRefDisplay === "block")
					{i3GEO.maparef.inicia();}
				}

			};
			i3GEO.gadgets.mostraCoordenadasGEO();
			i3GEO.gadgets.mostraCoordenadasUTM();
			montaMapa();
			//i3GEO.php.openlayers(montaMapa);
			i3GEO.gadgets.mostraMenuSuspenso();
			i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);
			i3GEO.idioma.mostraSeletor();
			i3GEO.gadgets.mostraEscalaNumerica();
			i3GEO.arvoreDeCamadas.ATIVATEMA = "i3GEO.Interface.openlayers.ligaDesliga(this)";
			//
			//i3GEO.arvoreDeCamadas.CAMADAS é definido na inicialização (classe_i3geo)
			//
			i3GEO.arvoreDeCamadas.cria("",i3GEO.arvoreDeCamadas.CAMADAS,i3GEO.configura.sid,i3GEO.configura.locaplic);
			i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);
		},
		criaLayers: function(){
			var url = i3GEO.configura.locaplic+"/classesphp/mapa_openlayers.php?map="+i3GEO.parametros.mapfile+"&TIPOIMAGEM="+i3GEO.configura.tipoimagem,
				urlfundo = i3GEO.configura.locaplic+"/classesphp/mapa_openlayers.php?layer=&tipolayer=fundo&map="+i3GEO.parametros.mapfile.replace(".map","fundo.map")+"&TIPOIMAGEM="+i3GEO.configura.tipoimagem,
				nlayers = i3GEO.arvoreDeCamadas.CAMADAS.length,
				layer,
				camada,
				urllayer,
				opcoes,
				i,
				temp,
				fundoIsBase = true;
			//
			//verifica se algum layer adicional é do tipo baselayer. Se for, adiciona o layer fundo, mas não como base
			//
			try{
				temp = i3GEO.Interface.openlayers.LAYERSADICIONAIS.length;
				for(i=0;i<temp;i++){
					if(i3GEO.Interface.openlayers.LAYERSADICIONAIS[i].isBaseLayer === true && i3GEO.Interface.openlayers.LAYERSADICIONAIS[i].visibility === true)
					{fundoIsBase = false;}
				}
			}
			catch(e){}
			if(i3geoOL.getLayersByName("Nenhum").length == 0 && fundoIsBase === true){
				layer = new OpenLayers.Layer.WMS( "Nenhum", urlfundo,{map_imagetype:i3GEO.Interface.OUTPUTFORMAT},{ratio: 1,singleTile:true,isBaseLayer:true, opacity: 1,visibility:true});
				i3geoOL.addLayer(layer);
			}
			opcoes = {
				gutter:0,
				isBaseLayer:false,
				displayInLayerSwitcher:false,
				opacity: 1,
				singleTile:!(i3GEO.Interface.openlayers.TILES),
				ratio:1,
				buffer:i3GEO.Interface.openlayers.BUFFER,
				wrapDateLine:true,
				eventListeners:{
					"loadstart": i3GEO.Interface.openlayers.loadStartLayer,
					"loadend": i3GEO.Interface.openlayers.loadStopLayer
				}
			};
			for(i=nlayers-1;i>=0;i--){
				camada = i3GEO.arvoreDeCamadas.CAMADAS[i];
				if(i3geoOL.getLayersByName(camada.name).length == 0){
					urllayer = url+"&layer="+camada.name;
					try{
						if(camada.escondido === "sim" || camada.connectiontype === 10 || camada.type === 4 || camada.type === 8 )
						{opcoes.singleTile = true;}
						else{
							if(camada.type === 3) //raster
							{opcoes.singleTile = false;}
							else
							{opcoes.singleTile = !(i3GEO.Interface.openlayers.TILES);}
						}
						if(camada.type === 0)
						{opcoes.gutter = 20;}
						else
						{opcoes.gutter = 0;}
					}
					catch(e){}
					layer = new OpenLayers.Layer.WMS(camada.name, urllayer,{map_imagetype:i3GEO.Interface.OUTPUTFORMAT},opcoes);
					if(camada.escondido !== "sim")
					{layer.transitionEffect ="resize";}
					i3geoOL.addLayer(layer);
				}
				else
				{layer = i3geoOL.getLayersByName(camada.name)[0];}
				if(camada.status == 0)
				{layer.setVisibility(false);}
				else
				{layer.setVisibility(true);}				
			}
			try
			{i3geoOL.addLayers(i3GEO.Interface.openlayers.LAYERSADICIONAIS);}
			catch(e){}
		},
		inverteModoTile: function(){
			var nlayers = i3GEO.arvoreDeCamadas.CAMADAS.length,
				layer,
				i,
				camada;
			if(i3GEO.Interface.openlayers.TILES === true)
			{i3GEO.Interface.openlayers.TILES = false;}
			else
			{i3GEO.Interface.openlayers.TILES = true;}
			
			for(i=nlayers-1;i>=0;i--){
				camada = i3GEO.arvoreDeCamadas.CAMADAS[i];
				try{
					layer = i3geoOL.getLayersByName(camada.name)[0];
					if(camada.escondido !== "sim"){
						layer.singleTile = !i3GEO.Interface.openlayers.TILES;
					}
				}catch(e){}
			}
			i3GEO.Interface.openlayers.atualizaMapa();
		},
		alteraParametroLayers: function(parametro,valor){
			var layers = i3geoOL.layers,
				nlayers = layers.length,
				i,
				url,
				reg;
			for(i=0;i<nlayers;i++){
				url = layers[i].url;
				reg = new RegExp(parametro+"([=])+([a-zA-Z0-9_]*)");
				layers[i].url = url.replace(reg,"");
				eval("layers[i].mergeNewParams({"+parametro+":valor})");
				layers[i].redraw();
			}
		},
		loadStartLayer: function(event){
			i3GEO.Interface.STATUS.atualizando.push(event.object.name);
			var i = $i("ArvoreTituloTema"+event.object.name);
			if(i){
				i.style.backgroundColor = "RGB(240,240,240)";
			}
		},
		loadStopLayer: function(event){
			i3GEO.Interface.STATUS.atualizando.remove(event.object.name);
			var i = $i("ArvoreTituloTema"+event.object.name);
			if(i){
				i.style.backgroundColor = "";
			}
		},
		ordenaLayers:function(){
			var ordem = i3GEO.arvoreDeCamadas.CAMADAS,
				nordem = ordem.length,
				layer,
				layers,
				i,
				maiorindice;
			//maior indice
			layers = i3geoOL.layers;
			maiorindice = i3geoOL.getLayerIndex(layers[(layers.length)-1]);
			for(i=nordem-1;i>=0;i--){
				layers = i3geoOL.getLayersByName(ordem[i].name);
				layer = layers[0];
				i3geoOL.setLayerIndex(layer,maiorindice+i);
			}
		},
		sobeDesceLayer:function(tema,tipo){
			var layer = i3geoOL.getLayersByName(tema)[0],
				indice = i3geoOL.getLayerIndex(layer);
			if(tipo === "sobe")
			{i3geoOL.setLayerIndex(layer,indice + 1);}
			else
			{i3geoOL.setLayerIndex(layer,indice - 1);}			
		},
		ligaDesliga:function(obj){
			var layers = i3geoOL.getLayersByName(obj.value),
				temp = function(){i3GEO.mapa.legendaHTML.atualiza();},
				desligar = "",
				ligar = "";
			if(layers.length > 0){
				layers[0].setVisibility(obj.checked);
				if(obj.checked)
				{
					ligar = obj.value;
					i3GEO.arvoreDeCamadas.alteraPropCamadas("status","2",obj.value);
				}
				else
				{
					desligar = obj.value;
					i3GEO.arvoreDeCamadas.alteraPropCamadas("status","0",obj.value);
				}
				i3GEO.php.ligatemas(temp,desligar,ligar);
			}
		},
		ativaFundo: function(id){
			var layer = i3geoOL.getLayer(id);
			i3geoOL.setBaseLayer(layer);
		},
		atualizaMapa:function(){
			var layers = i3geoOL.layers,
				nlayers = layers.length,
				i;
			for(i=0;i<nlayers;i++){
				layers[i].mergeNewParams({r:Math.random()});
				if(layers[i].visibility === true){	
					layers[i].redraw();
				}
			}
		},
		atualizaTema:function(retorno,tema){
			var layer = i3geoOL.getLayersByName(tema)[0];
			layer.mergeNewParams({r:Math.random()});
			layer.redraw();
			i3GEO.Interface.openlayers.recalcPar();
			try
			{i3GEO.arvoreDeCamadas.atualiza(retorno.data.temas);}
			catch(e)
			{i3GEO.arvoreDeCamadas.atualiza();}
			i3GEO.janela.fechaAguarde();
		},
		registraEventos: function(){
			//
			//ativa os eventos específicos do i3geo
			//
			i3GEO.eventos.ativa($i("openlayers"));
			//
			//ativa os eventos controlados pela API do OL
			//
			i3geoOL.events.register("moveend",i3geoOL,function(e){
				i3GEO.Interface.openlayers.recalcPar();
				i3GEO.eventos.navegaMapa();
			});
			i3geoOL.events.register("mousemove", i3geoOL, function(e){
				//i3GEO.eventos.mousemoveMapa();
				var p,lonlat,d,dc,imgp,targ,pos,mousex,mousey,pos;
				p = e.xy;
				//altera o indicador de localizacao
				lonlat = i3geoOL.getLonLatFromPixel(p);
				d = i3GEO.calculo.dd2dms(lonlat.lon,lonlat.lat);
				try{
					objposicaocursor.ddx = lonlat.lon;
					objposicaocursor.ddy = lonlat.lat;
					objposicaocursor.dmsx = d[0];
					objposicaocursor.dmsy = d[1];

					//d = i3geoOL.getViewPortPxFromLonLat(lonlat);
					objposicaocursor.imgx = p.x;
					objposicaocursor.imgy = p.y;

					pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
					objposicaocursor.telax = p.x + pos[0];
					objposicaocursor.telay = p.y + pos[1];
					//i3GEO.ajuda.mostraJanela(p.x+" "+p.y);
					//console.error(objposicaocursor.telax+" "+objposicaocursor.telay);
				}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
			});		
		},
		ativaBotoes: function(){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.openlayers.ativaBotoes()");}
			var imagemxy,x1,y1,x2,y2;
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true){
				x2 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y2 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true)
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);}
			if(i3GEO.configura.visual !== "default")
			{i3GEO.gadgets.visual.troca(i3GEO.configura.visual);}
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		recalcPar: function(){
			var bounds = i3geoOL.getExtent().toBBOX().split(","),
				escalaAtual = i3geoOL.getScale();
			if (i3GEO.parametros.mapscale !== escalaAtual)
			{i3GEO.arvoreDeCamadas.atualizaFarol(escalaAtual);}			
    		i3GEO.parametros.mapexten = bounds[0]+" "+bounds[1]+" "+bounds[2]+" "+bounds[3];
			i3GEO.parametros.mapscale = escalaAtual;
			i3GEO.parametros.pixelsize = i3geoOL.getResolution();
			try{
				atualizaEscalaNumerica(parseInt(escalaAtual,10));
			}catch(e){}
		},
		zoom2ext: function(ext){
			var m,b;
			m = ext.split(" ");
			b = new OpenLayers.Bounds(m[0],m[1],m[2],m[3]);
			i3geoOL.zoomToExtent(b);		
		},
		pan2ponto:function(x,y){
			i3geoOL.panTo(new OpenLayers.LonLat(x,y));
		}
	},
	/*
	Classe: i3GEO.Interface.googlemaps
	
	Interface com motor de navegação baseado na API Google Maps
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "googlemaps"
	
	Cria o objeto i3GeoMap que pode receber os métodos da API.
	Cria também o objeto i3GeoMapOverlay do tipo Overlay, utilizado para cálculos ou para receber elementos gráficos.
	*/
	googlemaps:{
		/*
		Propriedade: OPACIDADE
		
		Valor da opacidade da camada i3geo do mapa
		
		Varia de 0 a 1
		
		Default:
		0.8
		
		Tipo:
		{Numeric}
		*/
		OPACIDADE: 0.8,
		/*
		Propriedade: TIPOMAPA
		
		Tipo de mapa que será usado como default, conforme constantes definidas na API do Google Maps.
		
		Default:
		"roadmap"
		
		Tipo:
		{string - Google API constante "satellite"|"roadmap"|"hybrid"|"terrain"}
		*/
		TIPOMAPA: "terrain",
		/*
		Variable: ZOOMSCALE
		
		Array com a lista de escalas em cada nivel de zoom utilizado pelo Google
		
		Tipo:
		{array}
		
		*/
		ZOOMSCALE: [591657550,295828775,147914387,73957193,36978596,18489298,9244649,4622324,2311162,1155581,577790,288895,144447,72223,36111,18055,9027,4513,2256,1128],
		/*
		Variable: PARAMETROSLAYER
		
		Parâmetros adicionais que são inseridos na URL que define cada layer
		
		Tipo:
		{string}
		*/
		PARAMETROSLAYER: "&TIPOIMAGEM="+i3GEO.configura.tipoimagem,
		/*
		Variable: posfixo
		
		String acrescentada à url de cada tile para garantir a remoção do cache local
		
		Type:
		{string}
		*/
		posfixo: "",
		atualizaTema:function(retorno,tema){
			//
			//não se atualiza um tema único, mas o mapa todo
			//
			//i3GEO.atualiza(retorno);
			var indice = i3GEO.Interface.googlemaps.retornaIndiceLayer(tema);
			i3GeoMap.overlayMapTypes.removeAt(indice);
			i3GEO.Interface.googlemaps.posfixo += "&";
			i3GEO.Interface.googlemaps.insereLayer(tema,indice);
			i3GEO.Interface.googlemaps.recalcPar();
			try
			{i3GEO.arvoreDeCamadas.atualiza(retorno.data.temas);}
			catch(e)
			{i3GEO.arvoreDeCamadas.atualiza();}
			i3GEO.janela.fechaAguarde();			
		},
		redesenha: function(){
   			//
			//remove todos os layers
			//
			i3GEO.Interface.googlemaps.posfixo += "&";
			var nlayers = i3GEO.arvoreDeCamadas.CAMADAS.length,
				i,
				camada,
				indice;
			for (i=0;i<nlayers;i++){
				camada = i3GEO.arvoreDeCamadas.CAMADAS[i];
				indice = i3GEO.Interface.googlemaps.retornaIndiceLayer(camada.name);
				//console.error(indice+" "+camada.name);
				if(indice !== false){				
					try{
						//console.error(indice+" "+camada.name);
						i3GeoMap.overlayMapTypes.removeAt(indice);
					}
					catch(e){
						if(typeof(console) !== 'undefined'){console.error(e+" "+camada.name);}
					}
				}
			}
			i3GEO.Interface.googlemaps.criaLayers();
		},
		cria: function(w,h){
			var i,f,ins,js;
			posfixo = "&";
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				f = $i("googlemapsdiv");
				if(!f){
					ins = '<div id=googlemapsdiv style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';
					i.innerHTML = ins;
				}
				f = $i("googlemapsdiv");
				f.style.width = w;
				f.style.height = h;
			}
			i3GeoMap = "";
			i3GEO.Interface.IDMAPA = "googlemapsdiv";
			i3GEO.barraDeBotoes.INCLUIBOTAO.zoomli = true;
			i3GEO.barraDeBotoes.INCLUIBOTAO.pan = true;
			i3GEO.barraDeBotoes.INCLUIBOTAO.zoomtot = true;			
		},
		ativaZoomBox: function(){
			i3GeoMap.enableKeyDragZoom({
				key: 'ctrl'
			});
		},
		inicia: function(){
    		var pol,ret,pt1,pt2,bottomLeft,bottomRight,i3GEOTile;
    		pol = i3GEO.parametros.mapexten;
    		ret = pol.split(" ");
			function montaMapa(retorno){
				var pos, sw,ne,z,myMapType;
				try{
					i3GeoMap = new google.maps.Map($i(i3GEO.Interface.IDMAPA),{scaleControl:true});
				}
				catch(e){alert(e);return;}
				//
				//carrega o javascript que permite fazer o zoom por box
				//
				js = i3GEO.configura.locaplic+"/pacotes/google/keydragzoom.js.php";
				i3GEO.util.scriptTag(js,"i3GEO.Interface.googlemaps.ativaZoomBox()","keydragzoom_script");
				
				i3GeoMap.setMapTypeId(i3GEO.Interface.googlemaps.TIPOMAPA);
				sw = new google.maps.LatLng(ret[1],ret[0]);
				ne = new google.maps.LatLng(ret[3],ret[2]);
				i3GeoMap.fitBounds(new google.maps.LatLngBounds(sw,ne));
				
				i3GeoMapOverlay = new google.maps.OverlayView();
				i3GeoMapOverlay.draw = function() {};
						
				i3GEO.Interface.googlemaps.criaLayers();
				i3GeoMapOverlay.setMap(i3GeoMap);
				i3GEO.Interface.googlemaps.registraEventos();
								
				i3GEO.gadgets.mostraInserirKml();
				i3GEO.Interface.googlemaps.ativaBotoes();
				i3GEO.eventos.ativa($i(i3GEO.Interface.IDMAPA));
				i3GEO.gadgets.mostraCoordenadasGEO();
				i3GEO.gadgets.mostraCoordenadasUTM();
				i3GEO.gadgets.mostraEscalaNumerica();
				i3GEO.gadgets.mostraMenuSuspenso();
				i3GEO.idioma.mostraSeletor();
				g_operacao = "";
				g_tipoacao = "";
				//i3GEO.parametros.mapscale = i3GEO.Interface.googlemaps.calcescala();
				//atualizaEscalaNumerica(parseInt(i3GEO.parametros.mapscale,10));
				//
				//i3GEO.arvoreDeCamadas.CAMADAS é definido na inicialização (classe_i3geo)
				//
				i3GEO.arvoreDeCamadas.ATIVATEMA = "i3GEO.Interface.googlemaps.ligaDesliga(this)";
				i3GEO.arvoreDeCamadas.cria("",i3GEO.arvoreDeCamadas.CAMADAS,i3GEO.configura.sid,i3GEO.configura.locaplic);
				i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);
				i3GEO.Interface.googlemaps.adicionaListaKml();
				if(i3GEO.parametros.kmlurl !== "")
				{i3GEO.Interface.googlemaps.adicionaKml(true,i3GEO.parametros.kmlurl);}
			};
			i3GEO.php.googlemaps(montaMapa);
		},
		criaLayers: function(){
			var nlayers = i3GEO.arvoreDeCamadas.CAMADAS.length,
				i,
				camada,
				indice;
			for (i=0;i<nlayers;i++){
				camada = i3GEO.arvoreDeCamadas.CAMADAS[i];
				indice = i3GEO.Interface.googlemaps.retornaIndiceLayer(camada.name);
				if(!indice){				
					if(camada.status !== 0){
						i3GEO.Interface.googlemaps.insereLayer(camada.name,0);
					}
				}
			}
		},
		criaImageMap: function(nomeLayer){
			var i3GEOTileO,s;
			s = "i3GEOTileO = new google.maps.ImageMapType({ "+
					"getTileUrl: function(coord, zoom) {" +
					"	var url = '" + i3GEO.configura.locaplic +"/classesphp/mapa_googlemaps.php?map=" + i3GEO.parametros.mapfile +
					"&Z=' + zoom + '&X=' + coord.x + '&Y=' + coord.y + '&layer=" + nomeLayer + i3GEO.Interface.googlemaps.PARAMETROSLAYER +"';" +
					"	return url+i3GEO.Interface.googlemaps.posfixo; " +
					"}, "+
					"tileSize: new google.maps.Size(256, 256)," +
					"isPng: true," +
					"name: '" + nomeLayer + "'" +
				"});";
			eval(s);
			return i3GEOTileO;
		},
		insereLayer: function(nomeLayer,indice){
			var i = i3GEO.Interface.googlemaps.criaImageMap(nomeLayer);
			i3GeoMap.overlayMapTypes.insertAt(indice, i);							
		},
		registraEventos: function(){
			var pos;
			google.maps.event.addListener(i3GeoMap, "dragstart", function() {
				g_operacao = "";
				g_tipoacao = "";
			});
			google.maps.event.addListener(i3GeoMap, "dragend", function() {
				i3GEO.Interface.googlemaps.recalcPar();
				i3GEO.eventos.navegaMapa();
			});
			google.maps.event.addListener(i3GeoMap, "tilesloaded", function() {
				i3GEO.Interface.googlemaps.recalcPar();
			});			
			google.maps.event.addListener(i3GeoMap, "bounds_changed", function() {
				i3GEO.Interface.googlemaps.recalcPar();
				g_operacao = "";
				g_tipoacao = "";
				i3GEO.eventos.navegaMapa();
			});
			pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
			google.maps.event.addListener(i3GeoMap, "mousemove", function(ponto) {
				var teladms,tela;
				ponto = ponto.latLng;
				teladms = i3GEO.calculo.dd2dms(ponto.lng(),ponto.lat());
				tela = i3GeoMapOverlay.getProjection().fromLatLngToContainerPixel(ponto);
				objposicaocursor = {
					ddx: ponto.lng(),
					ddy: ponto.lat(),
					dmsx: teladms[0],
					dmsy: teladms[1],
					imgx:tela.x,
					imgy:tela.y,
					telax: tela.x + pos[0],
					telay: tela.y + pos[1]
				};
			});		
		},
		retornaIndiceLayer: function(nomeLayer){
			var i = false;
			try{
				i3GeoMap.overlayMapTypes.forEach(
					function(elemento, number){
						//alert(nomeLayer+" "+elemento.name)
						if(elemento.name == nomeLayer)
						{i = number;}
						//console.error(i+" "+elemento.name+" "+nomeLayer);
					}
				);
				return i;
			}
			catch(e){
				return false;
			}
		},
		retornaObjetoLayer: function(nomeLayer){
			var i = false;
			try{
				i3GeoMap.overlayMapTypes.forEach(
					function(elemento, number){
						if(elemento.name == nomeLayer)
						{i = elemento;}
					}
				);
				return i;
			}
			catch(e){
				return false;
			}
		},
		retornaDivLayer: function(nomeLayer){
			var i = false,
				divmapa = $i("googlemapsdiv"),
				divlayer,
				divs,
				j,
				ndivs;
			try{
				i3GeoMap.overlayMapTypes.forEach(
					function(elemento, number){
						if(elemento.name == nomeLayer){
							divlayer = divmapa.firstChild;
							divlayer = divlayer.firstChild;
							divlayer = divlayer.firstChild;
							divs = divlayer.getElementsByTagName("div");
							ndivs = divs.length;
							for(j=0;j<ndivs;j++){
								if(divs[j].style.zIndex == number)
								{i = divs[j];}
							}
						}
					}
				);
				return i;
			}
			catch(e){
				return false;
			}
		},
		ligaDesliga:function(obj){
			var indice = i3GEO.Interface.googlemaps.retornaIndiceLayer(obj.value),
				temp = function(){i3GEO.mapa.legendaHTML.atualiza();},
				desligar = "",
				ligar = "";
			if(obj.checked && !indice){
				ligar = obj.value;
				i3GEO.Interface.googlemaps.insereLayer(obj.value,0);
				i3GEO.arvoreDeCamadas.alteraPropCamadas("status","2",obj.value);
			}
			else{
				if(indice !== false){
					desligar = obj.value;
					i3GeoMap.overlayMapTypes.removeAt(indice);
					i3GEO.arvoreDeCamadas.alteraPropCamadas("status","0",obj.value);
				}
			}
			if(desligar != "" || ligar != "")
			{i3GEO.php.ligatemas(temp,desligar,ligar);}
		},
		bbox: function(){
			var bd,so,ne,bbox;
			bd = i3GeoMap.getBounds();
			so = bd.getSouthWest();
			ne = bd.getNorthEast();
			bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat();
			return (bbox);
		},
		ativaBotoes: function(){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.googlemaps.ativaBotoes()");}
			var imagemxy,x1,y1,x2,y2;
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true){
				x2 = imagemxy[0]+i3GEO.Interface.BARRABOTOESLEFT;
				y2 = imagemxy[1]+i3GEO.Interface.BARRABOTOESTOP;
			}
			if ($i("barraDeBotoes2") || i3GEO.barraDeBotoes.AUTO === true)
			{i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);}
			if(i3GEO.configura.visual !== "default")
			{i3GEO.gadgets.visual.troca(i3GEO.configura.visual);}
			i3GEO.barraDeBotoes.ativaBotoes();
		},
		mudaOpacidade: function(valor){
			i3GEO.Interface.googlemaps.OPACIDADE = valor / 200;
			i3GEO.Interface.googlemaps.redesenha();
		},
		recalcPar: function(){
			try{
				var bounds,
					sw,
					ne,
					escalaAtual = i3GEO.parametros.mapscale;
				sw = i3GeoMap.getBounds().getSouthWest();
				ne = i3GeoMap.getBounds().getNorthEast();
				i3GEO.parametros.mapexten = sw.lng()+" "+sw.lat()+" "+ne.lng()+" "+ne.lat();
				i3GEO.parametros.mapscale = i3GEO.Interface.googlemaps.calcescala();
				sw = i3GeoMapOverlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(0,1));
				ne = i3GeoMapOverlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(1,0));
				i3GEO.parametros.pixelsize = sw.lng() - ne.lng();
				if(i3GEO.parametros.pixelsize < 0)
				{i3GEO.parametros.pixelsize = i3GEO.parametros.pixelsize * -1;}
				
				if (i3GEO.parametros.mapscale !== escalaAtual && escalaAtual !== 0)
				{i3GEO.arvoreDeCamadas.atualizaFarol(i3GEO.parametros.mapscale);}	
			}
			catch(e){
				i3GEO.parametros.mapexten = "0 0 0 0";
				i3GEO.parametros.mapscale = 0;
			}
		},
		calcescala:function(){
    		var zoom = i3GeoMap.getZoom();
			return (i3GEO.Interface.googlemaps.ZOOMSCALE[zoom]);		
		},
		escala2nzoom:function(escala){
			var n,i;
			n = i3GEO.Interface.googlemaps.ZOOMSCALE.length;
			for(i=0; i < n;i++){
				if(i3GEO.Interface.googlemaps.ZOOMSCALE[i] < escala){
					return(i);
				}
			}
		},
		zoom2extent:function(mapexten){
			var pol,ret,pt1,pt2,sw,ne,z;
			pol = mapexten;
    		ret = pol.split(" ");
			//
			//verifica se é geo
			//
    		pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    		pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
			sw = new google.maps.LatLng(ret[1],ret[0]);
			ne = new google.maps.LatLng(ret[3],ret[2]);
			i3GeoMap.fitBounds(new google.maps.LatLngBounds(sw,ne));		
		},
		pan2ponto: function(x,y){
			i3GeoMap.panTo(new google.maps.LatLng(y,x));
		},
		/*
		Function: adicionaKml
	
		Insere no mapa uma camada KML com base na API do Google Maps
	
		As camadas adicionadas são acrescentadas na árvore de camadas
	
		A lista de nomes dos objetos geoXml criados é mantida em i3GEO.mapas.GEOXML
	
		Parametros:
	
		pan {Boolean} - define se o mapa será deslocado para encaixar o KML
	
		url {String} - URL do arquivo KML. Se não for definido, a URL será obtida do INPUT com id = i3geo_urlkml (veja i3GEO.gadgets.mostraInserirKml)

		titulo {string} - titulo que aparecerá na árvore. Se não for definido, será calculado aleatoriamente.
		
		ativo {boolean} - indica se a camada estará ativa ou não. Se não for definido, será considerado como true
		*/
		adicionaKml: function(pan,url,titulo,ativo){
			var ngeoxml,i,zoom;
			if(!$i("arvoreCamadasKml"))
			{i3GEO.Interface.googlemaps.criaArvoreKML();}
			ngeoxml = "geoXml_"+i3GEO.mapa.GEOXML.length;
			if(arguments.length === 1){
				i = $i("i3geo_urlkml");
				if(i)
				{url = i.value;}
				else
				{url = "";}
				titulo = ngeoxml;
				ativo = true;
			}
			if(arguments.length === 2){
				titulo = ngeoxml;
				ativo = true;
			}
			if(url === "")
			{return;}
			//"http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss"
			i3GEO.mapa.GEOXML.push(ngeoxml);
			i3GEO.Interface.googlemaps.adicionaNoArvoreGoogle(url,titulo,ativo,ngeoxml);
		},
		adicionaListaKml: function(){
			var monta = function(retorno){
				var raiz,nraiz,i;
				raiz = retorno.data.canais;
				nraiz = raiz.length;
				for (i=0;i<nraiz; i++){
					i3GEO.Interface.googlemaps.adicionaKml(false,raiz[i].link,raiz[i].title,false);
				}
			};
			i3GEO.php.listaRSSwsARRAY(monta,"KML");
		},
		/*
		Function: adicionaNoArvoreGoogle
		
		Acrescenta na árvore de camadas um novo tema no nó que mostra os arquivos KML inseridos no mapa
		
		Os temas são incluídos em um nó chamado "Google Maps".
		
		Para obter esse nó utilize var node = i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idkml","raiz");
		
		Parametros:
		
		url {string} - url do arquivo KML
	
		nomeOverlay {string} - título do tema
		
		ativo {boolean} - indica o estado do checkbox
		
		id {string} - nome do objeto GGeoXml
		*/
		adicionaNoArvoreGoogle: function(url,nomeOverlay,ativo,id){
			var root,node,d,nodekml;
			if(!$i("arvoreCamadasKml"))
			{i3GEO.Interface.googlemaps.criaArvoreKML();}
			if(arguments.length === 2){
				ativo = true;
				id = nomeOverlay;
			}
			if(arguments.length === 2)
			{id = nomeOverlay;}
			root = i3GEO.Interface.googlemaps.ARVORE.getRoot();
			node = i3GEO.Interface.googlemaps.ARVORE.getNodeByProperty("idkml","raiz");
			html = "<input onclick='i3GEO.Interface.googlemaps.ativaDesativaCamadaKml(this,\""+url+"\")' class=inputsb style='cursor:pointer;' type='checkbox' value='"+id+"'";
			if(ativo === true)
			{html += " checked ";}
			html += "/>";
			if(navm)
			{estilo = "cursor:default;vertical-align:35%;padding-top:0px;";}
			else
			{estilo = "cursor:default;vertical-align:top;";}
			
			html += "&nbsp;<span style='"+estilo+"'>"+nomeOverlay+"</span>";
			d = {html:html};
			nodekml = new YAHOO.widget.HTMLNode(d, node, true,true); 
			nodekml.enableHighlight = false;   			
			nodekml.isleaf = true;
			i3GEO.Interface.googlemaps.ARVORE.draw();
			i3GEO.Interface.googlemaps.ARVORE.collapseAll();
			node.expand();
			if(ativo == true)
			{eval(id+" = new google.maps.KmlLayer('"+url+"',{map:i3GeoMap,preserveViewport:true});");}
		},
		criaArvoreKML: function(){
			var arvore,a,root,titulo,d,node;
			arvore = $i("arvoreCamadasKml");
			if(!arvore){
				d = document.createElement("div");
				d.id = "arvoreCamadasKml";
				d.style.top = "40px";
				a = $i(i3GEO.arvoreDeCamadas.IDHTML);
				if(a){
					a.parentNode.appendChild(d);
				}
				else{alert("Arvore de camadas nao encontrada. Nao e possivel adicionar a arvore de KML");return;}
			}
			i3GEO.Interface.googlemaps.ARVORE = new YAHOO.widget.TreeView("arvoreCamadasKml");
			root = i3GEO.Interface.googlemaps.ARVORE.getRoot();
			titulo = "<table><tr><td><b>Google Maps</b></td></tr></table>";
			d = {html:titulo,idkml:"raiz"};
			node = new YAHOO.widget.HTMLNode(d, root, true,true);
			node.enableHighlight = false;
		},
		/*
		Function: ativaDesativaCamadaKml
		
		Ativa ou desativa uma camada do nó de layers KML
			
		Parametro:
		
		obj {object} - objeto do tipo checkbox que foi ativado/desativado
		
		url {string} - url do KML
		*/
		ativaDesativaCamadaKml: function(obj,url){	
			if(!obj.checked)
			{eval(obj.value+".setMap(null);");}
			else{
				eval(obj.value+" = new google.maps.KmlLayer(url,{map:i3GeoMap,preserveViewport:true});");
			}
		},
		alteraParametroLayers: function(parametro,valor){
			parametro = parametro.toUpperCase();
			var reg = new RegExp(parametro+"([=])+([a-zA-Z0-9_]*)");
			i3GEO.Interface.googlemaps.PARAMETROSLAYER = i3GEO.Interface.googlemaps.PARAMETROSLAYER.replace(reg,"");
			i3GEO.Interface.googlemaps.PARAMETROSLAYER += "&"+parametro+"="+valor;
			i3GEO.Interface.googlemaps.redesenha();
		}
	},
	/*
	Classe: i3GEO.Interface.googleearth
	
	Interface com motor de navegação baseado na API Google Earth
	
	Utilizado quando 
	
	i3GEO.Interface.ATUAL = "googleearth"
	
	Cria o objeto i3GeoMap que pode receber os métodos da API do google Earth
	*/
	googleearth:{
		/*
		Variable: PARAMETROSLAYER
		
		Parâmetros adicionais que são inseridos na URL que define cada layer
		
		Tipo:
		{string}
		*/
		PARAMETROSLAYER: "&TIPOIMAGEM="+i3GEO.configura.tipoimagem,
		/*
		Variable: posfixo
		
		String acrescentada à url de cada tile para garantir a remoção do cache local
		
		Type:
		{string}
		*/
		posfixo: "",
		/*
		Propriedade: GADGETS
		
		Lista dos controles específicos da API do Google Earth que serão inseridos ou não no mapa
		
		Tipo:
		{object}
		
		Default:
		{}
		*/
		GADGETS: {
		    setMouseNavigationEnabled:true,
			setStatusBarVisibility:true,
			setOverviewMapVisibility:true,
			setScaleLegendVisibility:true,
			setAtmosphereVisibility:true,
			setGridVisibility:false,
			getSun:false,
			LAYER_BORDERS: true,
			LAYER_BUILDINGS: false,
			LAYER_ROADS: false,
			LAYER_TERRAIN: true
		},
		POSICAOTELA: [0,0],
		aguarde: "",
		ligaDesliga:function(obj){
			var layer = i3GEO.Interface.googleearth.retornaObjetoLayer(obj.value),
				temp = function(){i3GEO.mapa.legendaHTML.atualiza();},
				desligar = "",
				ligar = "";
			if(obj.checked){
				i3GEO.arvoreDeCamadas.alteraPropCamadas("status","2",obj.value);
				ligar = obj.value;
			}
			else{
				i3GEO.arvoreDeCamadas.alteraPropCamadas("status","0",obj.value);
				desligar = obj.value;
			}
			layer.setVisibility(obj.checked);
			if(desligar != "" || ligar != "")
			{i3GEO.php.ligatemas(temp,desligar,ligar);}
		},		
		atualizaTema:function(retorno,tema){
			var layer = i3GEO.Interface.googleearth.retornaObjetoLayer(tema);
			layer.getLink().setHref(layer.getLink().getHref()+"&");
			i3GEO.Interface.googleearth.recalcPar();
			try
			{i3GEO.arvoreDeCamadas.atualiza(retorno.data.temas);}
			catch(e)
			{i3GEO.arvoreDeCamadas.atualiza();}
			i3GEO.janela.fechaAguarde();
		},
		redesenha: function(){
			i3GEO.Interface.googleearth.posfixo += "&";
			var nlayers = i3GEO.arvoreDeCamadas.CAMADAS.length,
				i,
				camada,
				indice;
			for (i=0;i<nlayers;i++){
				camada = i3GEO.arvoreDeCamadas.CAMADAS[i];
				indice = i3GEO.Interface.googleearth.retornaObjetoLayer(camada.name);
				if(indice !== false){				
					try{
						i3GeoMap.getFeatures().removeChild(indice);
					}
					catch(e){
						if(typeof(console) !== 'undefined'){}
					}
				}
			}
			i3GEO.Interface.googleearth.criaLayers();
		},
		cria: function(w,h){
			var i,i3GeoMap3d,i3GeoMap,texto;
			/*
			i3GEO.configura.listaDePropriedadesDoMapa = {
				"propriedades": []
			};
			*/
			i3GEO.configura.listaDePropriedadesDoMapa = {
				"propriedades": [
				{ text: "p2", url: "javascript:i3GEO.mapa.dialogo.tipoimagem()"},		
				{ text: "p3", url: "javascript:i3GEO.mapa.dialogo.opcoesLegenda()"},
				{ text: "p4", url: "javascript:i3GEO.mapa.dialogo.opcoesEscala()"},
				{ text: "p8", url: "javascript:i3GEO.mapa.dialogo.queryMap()"},
				{ text: "p9", url: "javascript:i3GEO.mapa.dialogo.corFundo()"},
				{ text: "p10", url: "javascript:i3GEO.mapa.dialogo.gradeCoord()"}
				]
			};		
			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.setMouseNavigationEnabled == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getOptions().setMouseNavigationEnabled(this.checked)'" ;
			texto += "> "+$trad("ge1");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.setStatusBarVisibility == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getOptions().setStatusBarVisibility(this.checked)'" ;
			texto += "> "+$trad("ge2");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.setOverviewMapVisibility == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getOptions().setOverviewMapVisibility(this.checked)'" ;
			texto += "> "+$trad("ge3");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});				

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.setScaleLegendVisibility == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getOptions().setScaleLegendVisibility(this.checked)'" ;
			texto += "> "+$trad("ge4");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});				

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.setAtmosphereVisibility == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getOptions().setAtmosphereVisibility(this.checked)'" ;
			texto += "> "+$trad("ge5");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.setGridVisibility == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getOptions().setGridVisibility(this.checked)'" ;
			texto += "> "+$trad("ge6");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.getSun == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getSun().setVisibility(this.checked)'" ;
			texto += "> "+$trad("ge7");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.LAYER_BORDERS == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getLayerRoot().enableLayerById(i3GeoMap.LAYER_BORDERS, this.checked)'" ;
			texto += "> "+$trad("ge8");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.LAYER_BUILDINGS == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getLayerRoot().enableLayerById(i3GeoMap.LAYER_BUILDINGS, this.checked)'" ;
			texto += "> "+$trad("ge9");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.LAYER_ROADS == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getLayerRoot().enableLayerById(i3GeoMap.LAYER_ROADS, this.checked)'" ;
			texto += "> "+$trad("ge10");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			

			texto = "<input type=checkbox style='vertical-align:top;cursor:pointer' ";
			if(i3GEO.Interface.googleearth.GADGETS.LAYER_TERRAIN == true)
			{texto += "CHECKED ";}
			texto += " onclick='javascript:i3GeoMap.getLayerRoot().enableLayerById(i3GeoMap.LAYER_TERRAIN, this.checked)'" ;
			texto += "> "+$trad("ge11");
			i3GEO.configura.listaDePropriedadesDoMapa.propriedades.push({text: texto,url:""});			
			i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);
			
			i3GEO.barraDeBotoes.INCLUIBOTAO.zoomli = false;
			i3GEO.barraDeBotoes.INCLUIBOTAO.pan = false;
			i3GEO.barraDeBotoes.INCLUIBOTAO.zoomtot = false;			
			i3GEO.Interface.IDMAPA = "i3GeoMap3d";
			i3GEO.arvoreDeCamadas.ATIVATEMA = "i3GEO.Interface.googleearth.ligaDesliga(this)";
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				i3GeoMap3d = document.createElement("div");
				i3GeoMap3d.style.width = w;
				i3GeoMap3d.style.height = h;// + 45;
				i.style.height = h ;//+ 45;
				i3GeoMap3d.id = "i3GeoMap3d";
				i3GeoMap3d.style.zIndex = 0;
				i.appendChild(i3GeoMap3d);
			}
			google.load("earth", "1");
			i3GeoMap = null;
		},
		inicia: function(){
			google.earth.createInstance("i3GeoMap3d", i3GEO.Interface.googleearth.iniciaGE, i3GEO.Interface.googleearth.falha);
		},
		iniciaGE: function(object){
  			function montaMapa(retorno){
				i3GeoMap = object;
				i3GeoMap.getWindow().setVisibility(true);
				i3GEO.Interface.googleearth.zoom2extent(i3GEO.parametros.mapexten);
				i3GEO.Interface.googleearth.criaLayers();
				
				var options = i3GeoMap.getOptions(),
					layerRoot = i3GeoMap.getLayerRoot(),
					evento = function(e){
						i3GEO.Interface.googleearth.recalcPar();
						g_operacao = "";
						g_tipoacao = "";	
					};

				options.setMouseNavigationEnabled(i3GEO.Interface.googleearth.GADGETS.setMouseNavigationEnabled);
				options.setStatusBarVisibility(i3GEO.Interface.googleearth.GADGETS.setStatusBarVisibility);
				options.setOverviewMapVisibility(i3GEO.Interface.googleearth.GADGETS.setOverviewMapVisibility);
				options.setScaleLegendVisibility(i3GEO.Interface.googleearth.GADGETS.setScaleLegendVisibility);
				options.setAtmosphereVisibility(i3GEO.Interface.googleearth.GADGETS.setAtmosphereVisibility);
				options.setGridVisibility(i3GEO.Interface.googleearth.GADGETS.setGridVisibility);
				
				layerRoot.enableLayerById(i3GeoMap.LAYER_BORDERS, i3GEO.Interface.googleearth.GADGETS.LAYER_BORDERS);
				layerRoot.enableLayerById(i3GeoMap.LAYER_BUILDINGS, i3GEO.Interface.googleearth.GADGETS.LAYER_BUILDINGS);
				layerRoot.enableLayerById(i3GeoMap.LAYER_ROADS, i3GEO.Interface.googleearth.GADGETS.LAYER_ROADS);
				layerRoot.enableLayerById(i3GeoMap.LAYER_TERRAIN, i3GEO.Interface.googleearth.GADGETS.LAYER_TERRAIN);
				i3GeoMap.getSun().setVisibility(i3GEO.Interface.googleearth.GADGETS.getSun);				
				i3GeoMap.getNavigationControl().setVisibility(i3GeoMap.VISIBILITY_SHOW);
				
				i3GEO.Interface.googleearth.POSICAOTELA = YAHOO.util.Dom.getXY($i(i3GEO.Interface.IDCORPO));
				//
				//i3GEO.arvoreDeCamadas.CAMADAS é definido na inicialização (classe_i3geo)
				//
				i3GEO.arvoreDeCamadas.cria("",i3GEO.arvoreDeCamadas.CAMADAS,i3GEO.configura.sid,i3GEO.configura.locaplic);
				i3GEO.gadgets.mostraMenuSuspenso();
				i3GEO.Interface.googleearth.ativaBotoes();
				i3GEO.gadgets.mostraInserirKml("inserirKml");
				i3GEO.Interface.googleearth.adicionaListaKml();
				i3GEO.Interface.googleearth.registraEventos();
			};
			i3GEO.php.googleearth(montaMapa);
		},
		criaLayers: function(){
			var nlayers = i3GEO.arvoreDeCamadas.CAMADAS.length,
				i,
				camada,
				indice,
				layer;
			for (i=0;i<nlayers;i++){
				camada = i3GEO.arvoreDeCamadas.CAMADAS[i];
				indice = i3GEO.Interface.googleearth.retornaIndiceLayer(camada.name);
				layer = i3GEO.Interface.googleearth.retornaObjetoLayer(camada.name);
				if(indice === false){				
					layer = i3GEO.Interface.googleearth.insereLayer(camada.name);
				}
				try{
					if(camada.status !== 0)
					{layer.setVisibility(true);}
					else
					{layer.setVisibility(false);}
				}
				catch(e){}
			}
		},
		insereLayer: function(nomeLayer){
			var kmlUrl = i3GEO.configura.locaplic+"/classesphp/mapa_googleearth.php?REQUEST=GetKml&map="+i3GEO.parametros.mapfile+"&layer="+nomeLayer+i3GEO.Interface.googleearth.PARAMETROSLAYER,
				linki3geo = i3GeoMap.createLink('');
          	linki3geo.setHref(kmlUrl+i3GEO.Interface.googleearth.posfixo);
          	nl = i3GeoMap.createNetworkLink('');
          	nl.setLink(linki3geo);
          	nl.setFlyToView(false);
			nl.setName(nomeLayer);
          	i3GeoMap.getFeatures().appendChild(nl);
			return nl;
		},
		retornaIndiceLayer: function(nomeLayer){
			var n = i3GeoMap.getFeatures().getChildNodes().getLength(),
				indice = false;
			for(i=0;i<n;i++){
				if(i3GeoMap.getFeatures().getChildNodes().item(i).getName() == nomeLayer)
				{indice = i;}
			}	
			return indice;
		},
		retornaObjetoLayer: function(nomeLayer){
			var n = i3GeoMap.getFeatures().getChildNodes().getLength(),
				indice = false,
				i;
			for(i=0;i<n;i++){
				if(i3GeoMap.getFeatures().getChildNodes().item(i).getName() == nomeLayer)
				{indice = i3GeoMap.getFeatures().getChildNodes().item(i);}
			}
			return indice;
		},
		registraEventos: function(){
			google.earth.addEventListener(
				i3GeoMap.getView(),
				"viewchangeend",
				function(e){
					i3GEO.Interface.googleearth.recalcPar();
				}
			);
			google.earth.addEventListener(
				i3GeoMap.getGlobe(),
				'mousemove',
				function(event){
    				d = i3GEO.calculo.dd2dms(event.getLongitude(),event.getLatitude());
					objposicaocursor = {
						ddx: event.getLongitude(),
						ddy: event.getLatitude(),
						dmsx: d[0],
						dmsy: d[1],
						imgx: event.getClientX(),
						imgy: event.getClientY(),
						telax: event.getClientX() + i3GEO.Interface.googleearth.POSICAOTELA[0],
						telay: event.getClientY() + i3GEO.Interface.googleearth.POSICAOTELA[1]
					};
					i3GEO.eventos.mousemoveMapa();
				}
    		);
			google.earth.addEventListener(
				i3GeoMap.getGlobe(),
				'click',
				function(event){
					if(i3GEO.Interface.googleearth.aguarde.visibility === "hidden"){
						i3GEO.eventos.mousecliqueMapa();
					}
					else
					{i3GEO.Interface.googleearth.aguarde.visibility = "hidden";}
				}
    		);		
		},
		recalcPar: function(){
			var bounds;
			bounds = i3GeoMap.getView().getViewportGlobeBounds();
    		i3GEO.parametros.mapexten = bounds.getWest()+" "+bounds.getSouth()+" "+bounds.getEast()+" "+bounds.getNorth();
			//i3GEO.parametros.mapscale = i3GEO.Interface.googlemaps.calcescala();
		},
		falha: function()
		{alert("Falhou. Vc precisa do plugin instalado");},
		ativaBotoes: function(){
			var cabecalho = function(){};
			var minimiza = function(){
				i3GEO.janela.minimiza("i3GEOF.ferramentasGE");
			};
			var janela = i3GEO.janela.cria(
				"230px",
				"70px",
				"",
				"",
				"",
				"Ferramentas",
				"i3GEOF.ferramentasGE",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			i3GEO.barraDeBotoes.TEMPLATEBOTAO = '<div style="display:inline;background-color:rgb(250,250,250);"><img src="'+i3GEO.configura.locaplic+'/imagens/branco.gif" id="$$"/></div>&nbsp;';
			i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","",false,"200","200",janela[2].id);
			i3GEO.barraDeBotoes.ativaBotoes();
			i3GEO.Interface.googleearth.aguarde = $i("i3GEOF.ferramentasGE_imagemCabecalho").style;
			$i("i3GEOF.ferramentasGE_minimizaCabecalho").style.right = "0px";
			$i("i3GEOF.ferramentasGE").lastChild.style.display = "none";
			i3GEO.ajuda.abreJanela();
		},
		balao: function(texto,ddx,ddy){
			var placemark = i3GeoMap.createPlacemark('');
			var point = i3GeoMap.createPoint('');
			point.setLatitude(ddy);
			point.setLongitude(ddx);
			placemark.setGeometry(point);
			var b = i3GeoMap.createHtmlStringBalloon('');
			b.setContentString("<div style=text-align:left >"+texto+"</div>");
			b.setFeature(placemark);
			i3GeoMap.setBalloon(b);
			//i3GEO.Interface.googleearth.aguarde.visibility = "hidden";
		},
		insereMarca: function(description,ddx,ddy,name,snippet){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.googleearth.insereMarca()");}
			var placemark = i3GeoMap.createPlacemark('');
			placemark.setName(name);
			var point = i3GeoMap.createPoint('');
			point.setLatitude(ddy);
			point.setLongitude(ddx);
			placemark.setGeometry(point);
			if(description != "")
			{placemark.setDescription(description);}
			placemark.setSnippet(snippet);
			i3GeoMap.getFeatures().appendChild(placemark);
		},
		//
		//código obtido em http://code.google.com/intl/pt-BR/apis/earth/documentation/geometries.html
		//
		insereCirculo: function(centerLng,centerLat,radius,name,snippet){
			function makeCircle(centerLat, centerLng, radius) {
				var ring = i3GeoMap.createLinearRing('');
				var steps = 25;
				var pi2 = Math.PI * 2;
				for (var i = 0; i < steps; i++) {
					var lat = centerLat + radius * Math.cos(i / steps * pi2);
					var lng = centerLng + radius * Math.sin(i / steps * pi2);
					ring.getCoordinates().pushLatLngAlt(lat, lng, 0);
				}
				return ring;
			}
			var polygonPlacemark = i3GeoMap.createPlacemark('');
			var poly = i3GeoMap.createPolygon('');
			poly.setAltitudeMode(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
			polygonPlacemark.setGeometry(poly);
			var outer = i3GeoMap.createLinearRing('');
			polygonPlacemark.getGeometry().setOuterBoundary(makeCircle(centerLat, centerLng, radius));
			polygonPlacemark.setName(name);
			polygonPlacemark.setSnippet(snippet);
			polygonPlacemark.setStyleSelector(i3GeoMap.createStyle(''));
			var polyStyle = polygonPlacemark.getStyleSelector().getPolyStyle();
			polyStyle.setFill(0);
			i3GeoMap.getFeatures().appendChild(polygonPlacemark);
		},
		insereLinha: function(xi,yi,xf,yf,name,snippet){
			var lineStringPlacemark = i3GeoMap.createPlacemark('');
			lineStringPlacemark.setName(name);
			var lineString = i3GeoMap.createLineString('');
			lineString.setAltitudeMode(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
			lineStringPlacemark.setGeometry(lineString);
			lineString.getCoordinates().pushLatLngAlt(yi, xi, 0);
			lineString.getCoordinates().pushLatLngAlt(yf, xf, 0);
			
			lineStringPlacemark.setStyleSelector(i3GeoMap.createStyle(''));
			lineStringPlacemark.setSnippet(snippet);
			var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
			lineStyle.setWidth(3);
			
			i3GeoMap.getFeatures().appendChild(lineStringPlacemark);		
		},
		removePlacemark: function(nome){
			var features = i3GeoMap.getFeatures(),
				n = features.getChildNodes().getLength(),
				i,
				nfeatures = [];
			for(i=0;i<n;i++){
				try{
					if(features.getChildNodes().item(i).getName() == nome || features.getChildNodes().item(i).getDescription() == nome || features.getChildNodes().item(i).getSnippet() == nome){
						//features.getChildNodes().item(i).setVisibility(false);
						nfeatures.push(features.getChildNodes().item(i));
						//features.removeChild(features.getChildNodes().item(i));
					}
				}
				catch(e){}
			}
			n = nfeatures.length;
			for(i=0;i<n;i++){
				features.removeChild(nfeatures[i]);
			}
		},
		/*
		Function: adicionaKml
	
		Insere no mapa uma camada KML com base na API do Google Earth
	
		As camadas adicionadas são crescentadas na árvore de camadas
	
		A lista de nomes dos objetos geoXml criados é mantida em i3GEO.mapas.GEOXML
	
		Parametros:
	
		pan {Boolean} - define se o mapa será deslocado para encaixar o KML
	
		url {String} - URL do arquivo KML. Se não for definido, a URL será obtida do INPUT com id = i3geo_urlkml (veja i3GEO.gadgets.mostraInserirKml)

		titulo {string} - titulo que aparecerá na árvore. Se não for definido, será calculado aleatoriamente.
		
		ativo {boolean} - indica se a camada estará ativa ou não. Se não for definido, será considerado como true
		*/
		adicionaKml: function(pan,url,titulo,ativo){
			var ngeoxml,i,zoom;
			if(!$i("arvoreCamadasKml"))
			{i3GEO.Interface.googleearth.criaArvoreKML();}
			ngeoxml = "geoXml_"+i3GEO.mapa.GEOXML.length;
			if(arguments.length === 1){
				i = $i("i3geo_urlkml");
				if(i)
				{url = i.value;}
				else
				{url = "";}
				titulo = ngeoxml;
				ativo = false;
			}
			if(arguments.length === 2){
				titulo = ngeoxml;
				ativo = true;
			}
			if(arguments.length === 2)
			{ativo = true;}
			if(url === "")
			{return;}
			i3GEO.mapa.GEOXML.push(ngeoxml);
			linki3geokml = i3GeoMap.createLink('');
			if(url.split("http").length == 1)
			{url = i3GEO.util.protocolo()+"://"+window.location.host+url;}
          	linki3geokml.setHref(url);
			eval(ngeoxml+" = i3GeoMap.createNetworkLink('')");
			eval(ngeoxml+".setLink(linki3geokml)");
			i3GEO.Interface.googleearth.adicionaNoArvoreGoogle(url,titulo,ativo,ngeoxml);
		},
		adicionaListaKml: function(){
			var monta = function(retorno){
				var raiz,nraiz,i;
				raiz = retorno.data.canais;
				nraiz = raiz.length;
				for (i=0;i<nraiz; i++){
					i3GEO.Interface.googleearth.adicionaKml(false,raiz[i].link,raiz[i].title,false);
				}
			};
			i3GEO.php.listaRSSwsARRAY(monta,"KML");
		},
		/*
		Function: adicionaNoArvoreGoogle
		
		Acrescenta na árvore de camadas um novo tema no nó que mostra os arquivos KML inseridos no mapa
		
		Os temas são incluídos em um nó chamado "Google Earth".
		
		Para obter esse nó utilize var node = i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idkml","raiz");
		
		Parametros:
		
		url {string} - url do arquivo KML
	
		nomeOverlay {string} - título do tema
		
		ativo {boolean} - indica o estado do checkbox
		
		id {string} - nome do objeto GGeoXml
		*/
		adicionaNoArvoreGoogle: function(url,nomeOverlay,ativo,id){
			var root,node,d,nodekml;
			if(!$i("arvoreCamadasKml"))
			{i3GEO.Interface.googleearth.criaArvoreKML();}
			if(arguments.length === 2){
				ativo = true;
				id = nomeOverlay;
			}
			if(arguments.length === 2)
			{id = nomeOverlay;}
			root = i3GEO.Interface.googleearth.ARVORE.getRoot();
			node = i3GEO.Interface.googleearth.ARVORE.getNodeByProperty("idkml","raiz");
			html = "<input onclick='i3GEO.Interface.googleearth.ativaDesativaCamadaKml(this)' class=inputsb style='cursor:pointer;' type='checkbox' value='"+id+"'";
			if(ativo === true)
			{html += " checked ";}
			html += "/>";
			html += "&nbsp;<span style='cursor:move'>"+nomeOverlay+"</span>";
			d = {html:html};
			nodekml = new YAHOO.widget.HTMLNode(d, node, true,true); 
			nodekml.enableHighlight = false;   			
			nodekml.isleaf = true;
			i3GEO.Interface.googleearth.ARVORE.draw();
			i3GEO.Interface.googleearth.ARVORE.collapseAll();
			node.expand();
		},
		criaArvoreKML: function(){
			var arvore,a,root,titulo,d,node;
			arvore = $i("arvoreCamadasKml");
			if(!arvore){
				d = document.createElement("div");
				d.id = "arvoreCamadasKml";
				d.style.top = "40px";
				a = $i(i3GEO.arvoreDeCamadas.IDHTML);
				if(a){
					a.parentNode.appendChild(d);
				}
				else{alert("Arvore de camadas nao encontrada. Nao e possivel adicionar a arvore de KML");return;}
			}
			i3GEO.Interface.googleearth.ARVORE = new YAHOO.widget.TreeView("arvoreCamadasKml");
			root = i3GEO.Interface.googleearth.ARVORE.getRoot();
			titulo = "<table><tr><td><b>Google Earth Kml</b></td></tr></table>";
			d = {html:titulo,idkml:"raiz"};
			node = new YAHOO.widget.HTMLNode(d, root, true,true);
			node.enableHighlight = false;
		},
		existeLink: function(url){
			var existe = false,
				features = i3GeoMap.getFeatures(),
				n = features.getChildNodes().getLength(),
				i;
			for(i=0;i<n;i++){
				try{
					if(features.getChildNodes().item(i).getLink().getHref() == url){
						existe = true;
					}
				}
				catch(e){}
			}
			return (existe);
		},
		ativaDesativaLink: function(url,valor){
			var features = i3GeoMap.getFeatures(),
				n = features.getChildNodes().getLength(),
				i;
			for(i=0;i<n;i++){
				try{
					if(features.getChildNodes().item(i).getLink().getHref() == url){
						features.getChildNodes().item(i).setVisibility(valor);
					}
				}
				catch(e){}
			}
		},
		/*
		Function: ativaDesativaCamadaKml
		
		Ativa ou desativa uma camada do nó de layers KML
			
		Parametro:
		
		obj {object} - objeto do tipo checkbox que foi ativado/desativado
		*/
		ativaDesativaCamadaKml: function(obj){	
			var url = eval(obj.value+".getLink().getHref()");
			var existe = i3GEO.Interface.googleearth.existeLink(url);
			if(!obj.checked){
				{i3GEO.Interface.googleearth.ativaDesativaLink(url,false);}
			}
			else
			{
				if(existe == false)
				{eval("i3GeoMap.getFeatures().appendChild("+obj.value+")");}
				else
				{i3GEO.Interface.googleearth.ativaDesativaLink(url,true);}
			}
		},
		zoom2extent:function(mapexten){
			var r = 6378700,
			ret = mapexten.split(" "),
			fov = 32,
			camera = i3GeoMap.getView().copyAsCamera(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
			var lng2 = (ret[0]*1);
			var lng1 = (ret[2]*1);
			var lat1 = (ret[1]*1);
			var lat2 = (ret[3]*1);
			camera.setLatitude((lat1 + lat2) / 2.0); 
			camera.setLongitude((lng1 + lng2) / 2.0); 
			camera.setHeading(0.0); 
			camera.setTilt(0.0); 
			// determine if the rectangle is portrait or landscape
			var dy = Math.max(lat1, lat2) - Math.min(lat1, lat2); 
			var dx = Math.max(lng1, lng2) - Math.min(lng1, lng2); 
			// find the longest side
			var d = Math.max(dy, dx); 
			// convert the longest side degrees to radians
			d = d * Math.PI/180.0; 
			// find half the chord length
			var dist = r * Math.tan(d / 2); 
			// get the altitude using the chord length
			var alt = dist/(Math.tan(fov * Math.PI / 180.0)); 
			camera.setAltitude(alt); 
			i3GeoMap.getView().setAbstractView(camera);			
		},
		alteraParametroLayers: function(parametro,valor){
			parametro = parametro.toUpperCase();
			var reg = new RegExp(parametro+"([=])+([a-zA-Z0-9_]*)");
			i3GEO.Interface.googleearth.PARAMETROSLAYER = i3GEO.Interface.googleearth.PARAMETROSLAYER.replace(reg,"");
			i3GEO.Interface.googleearth.PARAMETROSLAYER += "&"+parametro+"="+valor;
			i3GEO.Interface.googleearth.redesenha();
		}		
	}
};
//
//para efeitos de compatibilidade
//
i3GEO.interface = i3GEO.Interface;
//YAHOO.log("carregou classe interface", "Classes i3geo");