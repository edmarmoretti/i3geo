/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Guias

Arquivo:

i3geo/classesjs/classe_guias.js

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
Classe: i3GEO.guias

Cria e controla as guias de opções mostradas no mapa principal e as guias das ferramentas

Para configurar as guias do mapa principal utilize i3GEO.guias.configura = ...

As guias das ferramentas são configuradas nos scripts específicos de cada ferramenta
*/
i3GEO.guias = {
	/*
	Variavel: ATUAL

	Guia que está ativa

	O nome da guia é a definida na variável i3GEO.guias.CONFIGURA

	Tipo:
	{string}

	Default:
	{"temas"}
	*/
	ATUAL: "temas",
	/*
	Propriedade: ALTURACORPOGUIAS
	
	Altura em pixels que será aplicado em cada guia
	
	Por default, a altura é calculada automaticamente, mas em alguns casos, pode ser necessário especificar o valor para permitir um melhor ajuste do layout do mapa
	
	Mantenha como 0 para que o cálculo seja automático
	
	Tipo:
	{numeric}
	
	Default: 0
	*/
	ALTURACORPOGUIAS: 0,
	/*
	Propriedade: CONFIGURA

	Define os parâmetros de cada guia que será mostrada no mapa, como título, conteúdo, etc.

	Você pode modificar o nome de uma guia como no exemplo

	i3GEO.guias.CONFIGURA.legenda.titulo = "nome diferente";

	Por padrão são definidas as guias legenda, temas, adiciona e mapas (links)

	Exemplo

	i3GEO.guias.CONFIGURA.legenda = {
			titulo:"Legenda do mapa",
			id:"guia4",
			idconteudo:"guia4obj",//id do elemento HTML que contém o conteúdo da guia
			click: function(){
				i3GEO.guias.mostra("legenda");//mostra a guia
				i3GEO.mapa.legendaHTML.cria("guia4obj");
			}
		}

	Tipo:
	{JSON}
	*/
	CONFIGURA: {
		"temas":{
			titulo:$trad("g4a"),
			id:"guia1",
			idconteudo:"guia1obj",
			click:""
		},
		"adiciona":{
			titulo:$trad("g1a"),
			id:"guia2",
			idconteudo:"guia2obj",
			click: function(){
				var ondeArvore;
				i3GEO.guias.mostra("adiciona");
				if(!$i("arvoreAdicionaTema"))
				{
					try{ondeArvore = objmapa.guiaMenu+"obj";}
					catch(e){ondeArvore = "guia2obj";}
				}
				else
				{ondeArvore = "arvoreAdicionaTema";}
				//para efeitos de compatibilidade
				if(document.getElementById("outrasOpcoesAdiciona")){
					i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde = "outrasOpcoesAdiciona";
					i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore = false;
				}
				i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,ondeArvore);
			}
		},
		"legenda":{
			titulo:$trad("g3"),
			id:"guia4",
			idconteudo:"guia4obj",
			click: function(){
				i3GEO.guias.mostra("legenda");
				i3GEO.mapa.legendaHTML.cria("guia4obj");
			}
		},
		"mapas":{
			titulo:"Links",
			id:"guia5",
			idconteudo:"guia5obj",
			click: function(){
				var pegaMapas = function(retorno){
					var ins,mapa,ig1lt,ig1,nome,lkd,link,temp;
					ins = "<br><div id='banners' style='overflow:auto;text-align:left'>";
					mapa = retorno.data.mapas;
					ig1lt = mapa.length;
					ig1=0;
					if(ig1lt > 0){
						do{
							temp = mapa[ig1];
							nome = temp.NOME;
							if(temp.PUBLICADO){
								if(temp.PUBLICADO.toLowerCase() === "nao")
								{nome = "<s>"+nome+"</s>";}
							}
							lkd = temp.LINK;
							link = i3GEO.configura.locaplic+"/ms_criamapa.php?temasa="+temp.TEMAS+"&layers="+temp.LIGADOS;
							if (temp.EXTENSAO !== "")
							{link += "&mapext="+temp.EXTENSAO;}
							if (temp.OUTROS !== "")
							{link += "&"+temp.OUTROS;}
							if (lkd !== "")
							{link = lkd;}
							ins += "<div><a href='"+link+"'><img src='"+temp.IMAGEM+"'></a></div><br>";
							ins += "<div><p style=text-align:center >"+nome+"</p></div><br>";
							ig1++;
						}
						while(ig1<ig1lt);
					}
					$i(i3GEO.guias.CONFIGURA.mapas.idconteudo).innerHTML = ins+"</div>";
				};
				$i(i3GEO.guias.CONFIGURA.mapas.idconteudo).innerHTML = "Aguarde...";
				i3GEO.guias.mostra("mapas");
				i3GEO.php.pegaMapas(pegaMapas);
			}
		}
	},
	/*
	Propriedade: ORDEM

	Ordem de inclusão das guias no mapa. Essa opção é mais útil no caso do tipo sanfona, pois
	a primeira guia é sempre a que fica ativa. Se esse parâmetro for uma string vazia, a ordem
	utilizada será a ordem existente em CONFIGURA

	Exemplo:

	i3GEO.guias.ORDEM = ["temas","adiciona","legenda"];

	Tipo:
	{array}

	Default:
	{""}

	Values:

	*/
	ORDEM: "",

	/*
	Propriedade: TIPO

	Tipo de guia

	Tipo:
	{string}

	Default:
	{"guia"}

	Values:
	guia|sanfona|tablet
	*/
	TIPO: "guia",
	/*
	Propriedade: idguias

	ID do elemento DOM, criado pelo YUI, onde serão inseridas as guias

	Tipo:
	{String}

	Default:
	{"guiasYUI"}
	*/
	IDGUIAS: "guiasYUI",
	/*
	Function: cria

	Cria as guias com base na variável configura.

	As guias podem ser definidas no HTML do mapa, sem necessariamente estarem na variável configura.<b> 
	As guias, nesse caso, devem ter como ID "guia'n'", por exemplo id="guia6". Para cada uma dessas guias
	deve haver um DIV com o conteúdo. Esse DIV deve ter como ID "guia'n'obj", por exemplo id="guia6obj"

	Parametro:

	onde {String} - id do elemento que conterá as guias
	*/
	cria: function(onde){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.cria()");}
		//
		//obtém outras guias que podem existir no mapa
		//
		var nguiasreal = 0,onf,outf,guiaconteudo,id,guia,guias,nguias,g,re,ng,tituloguia,i,ins,largura,altura;
		guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
		try{
			nguias = guias.length;
			for(g=0;g<12;g++){
				tituloguia = "";
				if($i("guia"+g)){
					tituloguia = $i("guia"+g).innerHTML;
					re = new RegExp("&nbsp;", "g");
					tituloguia = tituloguia.replace(re,'');
					for(ng=0;ng<nguias;ng++){
						if(i3GEO.guias.CONFIGURA[guias[ng]].id === "guia"+g){
							tituloguia = "";
						}
					}
					if (tituloguia !== ""){
						i3GEO.guias.CONFIGURA["guia"+g] = [];
						i3GEO.guias.CONFIGURA["guia"+g].titulo = tituloguia;
						i3GEO.guias.CONFIGURA["guia"+g].id = "guia"+g;
						i3GEO.guias.CONFIGURA["guia"+g].idconteudo = "guia"+g+"obj";
						if($i('guia'+g).onclick){
							i3GEO.guias.CONFIGURA["guia"+g].click = $i("guia"+g).onclick;
						}
					}
				}
			}
			if(i3GEO.guias.ORDEM === "")
			{guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);}
			else
			{guias = i3GEO.guias.ORDEM;}
			nguias = guias.length;
			//
			//verifica o div que contém as guias caso não tenha sido passado como parâmetro
			//
			if(arguments.length === 0){
				for(ng=0;ng<nguias;ng++){
					i = $i(i3GEO.guias.CONFIGURA[guias[ng]].id);
					if(i){onde = i.parentNode;}
				}
			}
			else
			{onde = $i(onde);}
			if(!onde){return;}
			onde.id = i3GEO.guias.IDGUIAS;
			onde.className = "yui-navset";
			//
			//constroi as TAGs para as guias
			//
			if(i3GEO.guias.TIPO === "guia" || i3GEO.guias.TIPO === "tablet"){
				ins = '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;text-align:center;">';
				if(i3GEO.guias.TIPO === "tablet"){
					ins += '<li><a alt="" title=""><em><div id="i3GEOguiaEsconde" onclick=i3GEO.guias.escondeGuias();  >x</div></em></a></li>';
				}
				for(ng=0;ng<nguias;ng++){
					if($i(i3GEO.guias.CONFIGURA[guias[ng]].id)){
						if($i(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo))
						{ins += '<li><a alt="" title=""><em><div id="'+i3GEO.guias.CONFIGURA[guias[ng]].id+'" >'+i3GEO.guias.CONFIGURA[guias[ng]].titulo+'</div></em></a></li>';}
					}
				}
				//adiciona uma guia que permite esconder todas as outras guias se for do tipo tablet
				ins += "</ul>";
				onde.innerHTML = ins;
				
				onf = function(event){
					var bcg,cor;
					YAHOO.util.Event.stopEvent(event);
					bcg = this.parentNode.parentNode.style;
					cor = bcg.background.split(" ")[0];
					if(cor !== "white" && bcg.backgroundColor !== "white")
					{bcg.background = "#bfdaff";}
				};
				outf = function(event){
					var bcg,cor;
					YAHOO.util.Event.stopEvent(event);
					bcg = this.parentNode.parentNode.style;
					cor = bcg.background.split(" ")[0];
					if(cor !== "white" && bcg.backgroundColor !== "white")
					{bcg.background = "transparent";}
				};
			}
			if(i3GEO.guias.TIPO === "sanfona"){
				ins = '<dl id=sanfona'+onde.id+' class="accordion" >';
				//verifica a quantidade certa de guias
				if(i3GEO.guias.ORDEM === ""){
					for(ng=0;ng<nguias;ng++){
						if($i(i3GEO.guias.CONFIGURA[guias[ng]].id)){
							nguiasreal++;
						}
					}
				}
				else
				{nguiasreal = i3GEO.guias.ORDEM.length;}
				
				if(navn)
				{altura = i3GEO.parametros.h - (nguiasreal * 25) - 1;}
				else
				{altura = i3GEO.parametros.h - (nguiasreal * 23) + 1;}
				for(ng=0;ng<nguias;ng++){
					if($i(i3GEO.guias.CONFIGURA[guias[ng]].id)){
						id = i3GEO.guias.CONFIGURA[guias[ng]].idconteudo;
						temp = $i(id);
						if(temp){
							guiaconteudo = temp.innerHTML;
							temp.innerHTML = "";
							temp.style.display = "none";
							temp.id = "";
							ins += '<dt style=height:17px id="'+i3GEO.guias.CONFIGURA[guias[ng]].id+'" >' +
								'<table class=accordiontable ><tr><td width="98%" >'+i3GEO.guias.CONFIGURA[guias[ng]].titulo+'</td><td width="2%" ><img id="" src="'+i3GEO.configura.locaplic+'/imagens/branco.gif" style="width:10px;" /></td></tr></table>' +
								'<dd clas=close >' +
								'<div class=bd >' +
								'<div id="'+id+'" >'+guiaconteudo+'</div></div></dd>';
						}
					}
				}
				ins += "</dl>";
				onde.innerHTML = ins;
				onde.style.height = altura+"px";
				onf = function(){};
				outf = function(){};
				YAHOO.lutsr.accordion.init(true,5,false,"sanfona"+onde.id,altura);
			}
			for(g=0;g<nguias;g++)
			{
				guia = i3GEO.guias.CONFIGURA[guias[g]];
				id = guia.id;
				guiaconteudo = $i(id);
				if(guiaconteudo){
					if(guia.click === "" || guia.click === undefined)
					{eval('$i("'+id+'").onclick = function(event){i3GEO.guias.mostra("'+guias[g]+'");}');}
					else
					{guiaconteudo.onclick = guia.click;}
					YAHOO.util.Event.addListener($i(id), "click", YAHOO.util.Event.preventDefault);
					YAHOO.util.Event.addListener($i(id), "click", YAHOO.util.Event.stopPropagation);
					YAHOO.util.Event.addFocusListener($i(id), YAHOO.util.Event.preventDefault);
					guiaconteudo.onmouseover = onf;
					guiaconteudo.onmouseout = outf;
					temp = $i(guia.idconteudo);
					if(temp){
						temp.style.overflow="auto";
						if(i3GEO.guias.TIPO === "guia"){
							if(i3GEO.guias.ALTURACORPOGUIAS === 0)
							{temp.style.height = i3GEO.parametros.h;}
							else
							{temp.style.height = i3GEO.guias.ALTURACORPOGUIAS;}
						}
						else
						{temp.style.height = onde.style.height;}
					}
				}
			}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
		if(i3GEO.guias.TIPO !== "tablet"){
			i3GEO.guias.mostra(i3GEO.guias.ATUAL);
			i3GEO.guias.ativa(i3GEO.guias.ATUAL);
			temp = $i("i3GEOguiaEsconde");
			YAHOO.util.Event.addListener(temp, "click", YAHOO.util.Event.preventDefault);
			YAHOO.util.Event.addListener(temp, "click", YAHOO.util.Event.stopPropagation);
			YAHOO.util.Event.addFocusListener(temp, YAHOO.util.Event.preventDefault);
			temp.onmouseover = onf;
			temp.onmouseout = outf;
		}
		else
		{i3GEO.guias.escondeGuias();}
	},
	/*
	Function: ajustaAltura

	Ajusta a altura das guias conforme a altura da imagem do mapa
	*/
	ajustaAltura: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.ajustaAltura()");}
		var guia,guias,nguias,
			altura=0;
		if(i3GEO.guias.ALTURACORPOGUIAS != 0)
		{altura = i3GEO.guias.ALTURACORPOGUIAS;}
		guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
		nguias = guias.length;
		for(g=0;g<nguias;g++){
			guia = $i(this.CONFIGURA[guias[g]].idconteudo);
			if(guia){
				guia.style.overflow="auto";
				if(this.TIPO === "guia")
				{guia.style.height = altura;}
			}
		}
	},
	/*
	Function: escondeGuias
	
	Esconde todas as guias
	*/
	escondeGuias: function(){
		var guias,nguias,g,temp,attributes,anim;
		guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
		nguias = guias.length;
		temp = $i("i3GEOguiaEsconde");
		if(temp){
			if(!navm){
				temp.style.height = "0px";	
				temp.style.visibility = "hidden";
			}
			temp.parentNode.parentNode.style.background="transparent";
		}
		for(g=0;g<nguias;g++){
			temp = $i(this.CONFIGURA[guias[g]].idconteudo);
			if(temp){
				if(i3GEO.guias.TIPO === "tablet" && temp.style.display === "block"){
					temp.style.overflow = "hidden";
					attributes = {
						height: { to: 0 }
					};
					anim = new YAHOO.util.Anim(temp, attributes, 1, YAHOO.util.Easing.easeNone);				
					anim.onComplete.subscribe(function(){
						temp.style.overflow = "auto";
						temp.style.display="none";
						i3GEO.barraDeBotoes.BARRAS[0].show();
					});
					anim.animate();				
				}
				else
				{temp.style.display="none";}
			}
			if($i(this.CONFIGURA[guias[g]].id))
			{$i(this.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background="transparent";}
		}	
	},
	/*
	Function: mostra

	Mostra no mapa uma determinada guia

	Parametro:

	guia {String} - nome da guia
	*/
	mostra: function(guia){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.mostra()");}
		var guias,nguias,g,temp,temp1,attributes,anim;
		guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
		nguias = guias.length;
		for(g=0;g<nguias;g++){
			if($i(this.CONFIGURA[guias[g]].idconteudo))
			{$i(this.CONFIGURA[guias[g]].idconteudo).style.display="none";}
			if($i(this.CONFIGURA[guias[g]].id))
			{$i(this.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background="transparent";}
		}
		//
		//verifica se o nome da guia passado como parametro está correto ou é o id da guia
		//
		if(this.CONFIGURA.toString().search(guia) < 0){
			for(g=0;g<nguias;g++){
				if(this.CONFIGURA[guias[g]].id === guia)
				{guia = guias[g];}
			}
		}
		if(this.CONFIGURA[guia]){
			temp = $i(this.CONFIGURA[guia].idconteudo);
			if(temp){
				if(i3GEO.guias.TIPO === "tablet"){
					i3GEO.barraDeBotoes.BARRAS[0].hide();
					temp.style.left = (i3GEO.parametros.w / 2) - 150 + "px";
					temp.style.height = 0;//i3GEO.parametros.h - 10 + "px";
					temp.style.display = "block";
					temp.style.zIndex = 9000;
					temp.style.overflow = "hidden";
					temp1 = $i("i3GEOguiaEsconde");
					if(!navm){
						temp1.style.height = "15px";
						temp1.style.visibility = "visible";
					}
					temp1.parentNode.parentNode.style.background="transparent";
					attributes = {
						height: { to: i3GEO.parametros.h - 10 }
					};
					anim = new YAHOO.util.Anim(temp, attributes, 1, YAHOO.util.Easing.easeNone);				
					anim.onComplete.subscribe(function(){
						temp.style.overflow = "auto";
						temp.style.display = "block";
					});
					anim.animate();
				}
				else
				{temp.style.display="block";}
				$i(this.CONFIGURA[guia].id).parentNode.parentNode.style.backgroundColor="white";
				this.ATUAL = guia;
			}
		}
	},
	/*
	Function: ativa

	Ativa uma determinada guia

	Parametro:

	guia {String} - guia que será ativada
	*/
	ativa: function(guia){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.ativa()");}
		try{
			if(this.CONFIGURA[this.ATUAL].click !== "")
			{this.CONFIGURA[this.ATUAL].click.call();}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
	},
	/*
	Function: libera

	Libera as guias do local atual, colocando-as em uma janela móvel sobre o mapa.
	*/
	libera: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.libera()");}
		if (!$i("conteudojanelaguias")){
			var i,w,pos,a,l,letras,temp;
			$i(i3GEO.Interface.IDCORPO).style.left = "0px";
			if($i(this.IDGUIAS))
			{$i(this.IDGUIAS).style.display="none";}
			i = $i("contemFerramentas");
			//if(i)
			//{i.style.display = "none";}
			w = parseInt($i("contemFerramentas").style.width,10);
			$i("contemFerramentas").style.width = "0px";
			i = $i("visual");
			if (i)
			{i.style.width="0px";i.innerHTML="";}
			pos = "px";
			a = i3GEO.parametros.h;
			l = i3GEO.parametros.w + w;
			i3GEO.parametros.h = a;
			i3GEO.parametros.w = l;
			if (navm)
			{pos = "";}
			i = $i(i3GEO.Interface.IDCORPO);
			if(i){
				i.style.width= l+pos;
				i.style.height= a+pos;
			}
			i = $i(i3GEO.Interface.IDMAPA);
			if(i){
				i.style.width= l+pos;
				i.style.height= a+pos;
				i.style.clip = 'rect('+0+" "+(l*1+2)+" "+(a*1+2)+" "+0+')';
			}
			i = $i("mst");
			if(i)
			{i.style.width = l + 1 + pos;}

			if (i3GEO.configura.entorno === "sim"){
				letras=["L","O"];
				for (l=0;l<2; l++){
					if ($i("img"+letras[l])){
						$i("img"+letras[l]).style.width = i3GEO.parametros.w+pos;
						$i("img"+letras[l]).style.height = i3GEO.parametros.h+pos;
						$i("corpoMapa"+letras[l]).style.width=i3GEO.parametros.w+pos;
						$i("corpoMapa"+letras[l]).style.height=i3GEO.parametros.h+pos+pos;
						$i("corpoMapa"+letras[l]).style.clip = 'rect(0 0 0 0)';
					}
				}
				letras=["N","S"];
				for (l=0;l<2; l++){
					if ($i("img"+letras[l])){
						$i("img"+letras[l]).style.width = i3GEO.parametros.w * 2+pos;
						$i("img"+letras[l]).style.height = i3GEO.parametros.h * 2+pos;
						$i("corpoMapa"+letras[l]).style.width=i3GEO.parametros.w * 3+pos;
						$i("corpoMapa"+letras[l]).style.height=i3GEO.parametros.h+pos;
						$i("corpoMapa"+letras[l]).style.clip = 'rect(0 0 0 0)';
					}
				}
			}
			i3GEO.mapa.ajustaPosicao();
			temp = function(retorno){
				//carrega janela
				var novoel,temp,i,g,guias,nguias;
				novoel = document.createElement("div");
				novoel.id = "janelaguias";
				novoel.style.display="block";
				novoel.innerHTML = '<div class="hd">Guias <div onclick ="i3GEO.janela.minimiza(\'conteudojanelaguias\')" id="janelaguias_minimizaCabecalho" class="container-minimiza" ></div></div><div class="bd" id="conteudojanelaguias_corpo" style=padding:0px ></div>';
				temp = $i("i3geo") ? $i("i3geo").appendChild(novoel) : document.body.appendChild(novoel);
				YAHOO.namespace("janelaguias.xp");
				YAHOO.janelaguias.xp.panel = new YAHOO.widget.Panel("janelaguias", {width:"270px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:false, visible:true, draggable:true, modal:false,iframe:true } );
				YAHOO.janelaguias.xp.panel.render();
				YAHOO.janelaguias.xp.panel.cfg.setProperty("y", 0);
				YAHOO.janelaDoca.xp.manager.register(YAHOO.janelaDoca.xp.panel);
				i = $i(i3GEO.guias.IDGUIAS);
				$i("conteudojanelaguias_corpo").appendChild(i);
				i.style.borderLeft="1px solid black";
				i.style.borderRight="1px solid black";
				guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
				nguias = guias.length;
				for(g=0;g<nguias;g++){
					if($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo)){
						$i("conteudojanelaguias_corpo").appendChild($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo));
						temp = $i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style;
						temp.background="white";
						temp.border="1px solid black";
						temp.borderTop="0px solid black";
						temp.width="270px";
						temp.left="-1px";
						temp.height = i3GEO.parametros.h - 90;
					}
				}
				i3GEO.atualiza("");
				i.style.display="block";
				i.style.left = "-1px";
				i.style.width = "270px";
			};
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			i3GEO.php.mudatamanho(temp,a,l);
		}
		else{
			YAHOO.janelaguias.xp.panel.render();
			YAHOO.janelaguias.xp.panel.show();
		}
	},
	/*
	Function: mostraGuiaFerramenta

	Mostra uma determinada guia em uma janela do tipo ferramenta.

	As guias são construídas pelo construtor da ferramenta

	Parametros:

	guia {String} - O elemento html cujo id for igual a guia+"obj" terá seu estilo (display) definido como block, tornando-o visível

	namespace {String} - Todos os elementos html que tiverem como id o namespace, seguindo por um número e "obj", terão seu estilo alterado para none, tornando-se invisíveis

	*/
	mostraGuiaFerramenta: function(guia,namespace){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.mostraGuiaFerramenta()");}
		var g, Dom = YAHOO.util.Dom;
		if(!namespace)
		{namespace = "guia";}
		for(g=0;g<12;g++){
			Dom.setStyle(namespace+g+"obj","display","none");
		}
		Dom.setStyle(guia+"obj","display","block");
	}
};