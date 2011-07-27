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

Cria e controla os blocos de opções ativados por meio de guias ou botões 

Para configurar as guias do mapa principal utilize i3GEO.guias.configura = ...

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
			icone:"imagens/gisicons/show-layers.png",
			titulo:$trad("g4a"),
			id:"guia1",
			idconteudo:"guia1obj",
			click:""
		},
		"adiciona":{
			icone:"imagens/gisicons/show-catalog.png",
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
			icone:"imagens/gisicons/show-legend.png",
			titulo:$trad("g3"),
			id:"guia4",
			idconteudo:"guia4obj",
			click: function(){
				i3GEO.guias.mostra("legenda");
				i3GEO.mapa.legendaHTML.cria("guia4obj");
			}
		},
		"mapas":{
			icone:"imagens/gisicons/show-links.png",
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

	Ordem de inclusão das guias no mapa. Essa opção é mais útil no caso do tipo sanfona, pois nesse caso,
	a primeira guia é sempre a que fica ativa. Se esse parâmetro for uma string vazia, a ordem
	utilizada será a ordem existente em i3GEO.guias.CONFIGURA.
	
	Ao ser definida, apenas as guias indicadas no array serão incluídas

	Exemplo:

	i3GEO.guias.ORDEM = ["temas","adiciona","legenda"];

	Tipo:
	{array}

	Default:
	{""}
	*/
	ORDEM: "",
	/*
	Propriedade: TIPO

	Tipo de guia
	
	Quando TIPO = "movel", a inicialização da guia é feita em i3GEO.inicia
	Isso é ne cessário pq a guia móvel só pode ser criada após o posicionamento do corpo do mapa

	Tipo:
	{string}

	Default:
	{"guia"}

	Values:
	guia|sanfona|tablet|movel
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

	Cria as guias com base na variável i3GEO.guias.CONFIGURA

	As guias podem ser definidas no HTML do mapa, sem necessariamente estarem na variável configura.<b> 
	As guias, nesse caso, devem ter como ID "guia'n'", por exemplo id="guia6". Para cada uma dessas guias
	deve haver um DIV com o conteúdo. Esse DIV deve ter como ID "guia'n'obj", por exemplo id="guia6obj".
	No caso de ser utilizado a guia móvel, com i3GEO.guias.TIPO = "movel" , "guia'n" não é necessário, uma vez que são
	utilizados os ícones definidos em i3GEO.guias.CONFIGURA

	Parametro:

	onde {String} - id do elemento que conterá as guias
	*/
	cria: function(onde){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.cria()");}
		//
		//obtém outras guias que podem existir no mapa
		//
		var nguiasreal = 0,onf,outf,guiaconteudo,id,guia,guias,g,re,ng,tituloguia,i,ins,largura,altura,temp,preload,
			CONFIGURA = i3GEO.guias.CONFIGURA,
			guias = i3GEO.util.listaChaves(CONFIGURA),
			nguias = guias.length;
		//
		//no caso de TIPO === "movel", as guias não são construídas de imediato, apenas é criado um objeto
		//com os parâmetros necessários para a criação das guias
		//
		if(i3GEO.guias.TIPO === "movel"){
			i3GEO.guias.IDGUIAS = "i3GEOguiaMovelConteudo";
			for(ng=0;ng<nguias;ng++){
				if($i(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo)){
					i3GEO.guias.guiaMovel.config.guias.ids.push(i3GEO.guias.CONFIGURA[guias[ng]].id);
					i3GEO.guias.guiaMovel.config.guias.idsconteudos.push(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo);
					if(i3GEO.guias.CONFIGURA[guias[ng]].icone !== undefined)
					{i3GEO.guias.guiaMovel.config.guias.icones.push(i3GEO.guias.CONFIGURA[guias[ng]].icone);}
					else
					{i3GEO.guias.guiaMovel.config.guias.icones.push("imagens/gisicons/open1.png");}
					i3GEO.guias.guiaMovel.config.guias.titulos.push(i3GEO.guias.CONFIGURA[guias[ng]].titulo);
					i3GEO.guias.guiaMovel.config.guias.chaves.push(guias[ng]);
				}
			}
			return;
		}
		try{
			
			for(g=0;g<12;g++){
				tituloguia = "";
				if($i("guia"+g)){
					tituloguia = $i("guia"+g).innerHTML;
					re = new RegExp("&nbsp;", "g");
					tituloguia = tituloguia.replace(re,'');
					for(ng=0;ng<nguias;ng++){
						if(CONFIGURA[guias[ng]].id === "guia"+g){
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
			{guias = i3GEO.util.listaChaves(CONFIGURA);}
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
				i3GEO.guias.ALTURACORPOGUIAS = altura;
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
		var guia,guias,nguias,temp,temps,n,i,
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
				if(this.TIPO === "sanfona"){
					guia.style.height = altura;
					temp = $i("guiasYUI");
					if(temp){
						temp.style.height = altura;
						temps = temp.getElementsByTagName("dd");
						n = temps.length;
						for(i=0;i<n;i++){
							if(temps[i].style.visibility == "visible")
							{temps[i].style.height = altura;}
						}
					}
					YAHOO.lutsr.accordion.properties.altura = altura;
				}
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
		for(g=0;g<nguias;g++){
			temp = $i(this.CONFIGURA[guias[g]].idconteudo);
			if(temp){
				if(i3GEO.guias.TIPO === "tablet" && temp.style.display === "block"){
					temp.style.overflow = "hidden";
					attributes = {
						height: { to: 0 },
						id: this.CONFIGURA[guias[g]].idconteudo
					};
					anim = new YAHOO.util.Anim(temp, attributes, 1, YAHOO.util.Easing.easeNone);				
					anim.onComplete.subscribe(function(){
						var temp = $i(anim.attributes.id);
						temp.style.overflow = "auto";
						temp.style.display="none";
						i3GEO.barraDeBotoes.BARRAS[0].show();
					});
					anim.animate();				
				}
				else
				{temp.style.display="none";}
			}
			if($i(this.CONFIGURA[guias[g]].id) && i3GEO.guias.TIPO !== "movel")
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
		//
		//se a guia clicada já estiver aberta na interface com TABLET
		//
		if($i(i3GEO.guias.CONFIGURA[guia].idconteudo).style.display === "block" && i3GEO.guias.TIPO === "tablet"){
			i3GEO.guias.escondeGuias();
			return;
		}
		if(i3GEO.guias.TIPO !== "movel"){
			for(g=0;g<nguias;g++){
				if($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo))
				{$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.display="none";}
				if($i(i3GEO.guias.CONFIGURA[guias[g]].id))
				{$i(i3GEO.guias.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background="transparent";}
			}
		}
		//
		//verifica se o nome da guia passado como parametro está correto ou é o id da guia
		//
		if(i3GEO.guias.CONFIGURA.toString().search(guia) < 0){
			for(g=0;g<nguias;g++){
				if(i3GEO.guias.CONFIGURA[guias[g]].id === guia)
				{guia = guias[g];}
			}
		}
		if(i3GEO.guias.CONFIGURA[guia]){
			temp = $i(i3GEO.guias.CONFIGURA[guia].idconteudo);
			if(temp){
				if(i3GEO.guias.TIPO === "tablet"){
					i3GEO.barraDeBotoes.BARRAS[0].hide();
					temp.style.left = (i3GEO.parametros.w / 2) - 150 + "px";
					temp.style.height = 0;//i3GEO.parametros.h - 10 + "px";
					temp.style.display = "block";
					temp.style.zIndex = 9000;
					temp.style.overflow = "hidden";
					attributes = {
						height: { to: i3GEO.parametros.h - 10 }
					};
					anim = new YAHOO.util.Anim(temp, attributes, 1, YAHOO.util.Easing.easeNone);				
					anim.onComplete.subscribe(function(){
						temp.style.overflow = "auto";
						temp.style.display = "block";
					});
					if(DetectaMobile("DetectAndroid") === true){
						temp.style.height = "";
						temp.style.overflow = "auto";
					}					
					else
					{anim.animate();}
				}
				else
				{temp.style.display="block";}
				if(i3GEO.guias.TIPO !== "movel")
				{$i(i3GEO.guias.CONFIGURA[guia].id).parentNode.parentNode.style.backgroundColor="white";}
				i3GEO.guias.ATUAL = guia;
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

			if (i3GEO.configura.entorno.toLowerCase() === "sim"){
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
	},
	/*
	Function: guiaMovel
	
	Controla as guias do tipo "movel", que apresenta uma janela retrátil onde as opções são mostradas
	*/
	guiaMovel: {
		/*
		Propriedade: ABERTA
		
		Indica se a guia inicializará aberta
		
		Type:
		{boolean}
		*/
		ABERTA: false,
		/*
		Propriedade: config
		
		Define os valores de posicionamento dos elementos que compõem a guia
		*/
		config: {
			larguraPuxador: 50,
			alturaPuxador: 319,
			alturaGuiaMovel: 0,
			larguraGuiaMovel: 320,
			guias: {
				icones: [],
				ids: [],
				idsconteudos: [],
				titulos: [],
				chaves: []
			}
		},
		/*
		Variavel: left
		
		Valor de posicionamento à esquerda, calculado na inicialização
		*/
		left: 0,
		/*
		Function: inicia
		
		Inicializa a guia móvel
		*/
		inicia: function(){
			var posMapa = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA)),
				centroY = posMapa[1] + (i3GEO.parametros.h / 2),
				config = i3GEO.guias.guiaMovel.config,
				ins = "",
				temp;
			
			if(i3GEO.guias.ALTURACORPOGUIAS === 0 && config.alturaGuiaMovel === 0)
			{i3GEO.guias.guiaMovel.config.alturaGuiaMovel = i3GEO.parametros.h - 100;}
			else
			{i3GEO.guias.guiaMovel.config.alturaGuiaMovel = i3GEO.guias.ALTURACORPOGUIAS;}
			config = i3GEO.guias.guiaMovel.config;
			
			temp = $i("i3GEOguiaMovel").style;
			temp.height = config.alturaGuiaMovel + "px";
			temp.left = (posMapa[0] + i3GEO.parametros.w - config.larguraPuxador) + "px";
			//aberta temp.left = (posMapa[0] + i3GEO.parametros.w - config.larguraPuxador - config.larguraGuiaMovel) + "px";
			i3GEO.guias.guiaMovel.left = parseInt(temp.left,10);
			temp.top = (centroY - ((config.alturaGuiaMovel - 50) / 2)) + "px";
			temp.width = config.larguraPuxador + "px";
			//aberta temp.width = config.larguraPuxador + config.larguraGuiaMovel + "px";

			temp = $i("i3GEOguiaMovelMolde").style;
			temp.top = "0px";
			temp.left = config.larguraPuxador + "px";
			temp.width = "0px"; //config.larguraGuiaMovel + "px";
			temp.height = config.alturaGuiaMovel + "px";		
			
			temp = $i("i3GEOguiaMovelPuxador").style;
			temp.top = ((config.alturaGuiaMovel  - config.alturaPuxador) / 2 ) + "px";
			temp.left = "0px";
			temp.width = config.larguraPuxador + "px";
			temp.height = config.alturaPuxador + "px";
			
			temp = $i("i3GEOguiaMovelIcones").style;
			temp.left = "3px";
			temp.top = "3px";
			temp.width = (config.larguraGuiaMovel - 3) + "px";
			temp.height = "30px";
			
			temp = $i("i3GEOguiaMovelConteudo").style;
			temp.left = "3px";
			temp.top = "33px";
			temp.height = (config.alturaGuiaMovel - 36) +"px";
			temp.width = (config.larguraGuiaMovel - 7) + "px";
			temp.paddingLeft = "4px";

			YAHOO.util.Dom.setStyle("i3GEOguiaMovelConteudo", "opacity", 0.90);
			YAHOO.util.Dom.setStyle("i3GEOguiaMovelIcones", "opacity", 0.90);
			YAHOO.util.Dom.setStyle("i3GEOguiaMovelMolde", "opacity", 0.10);

			$i("i3GEOguiaMovelMolde").onmouseover = function(){
				if($i("i3GEOguiaMovelConteudo").style.display === "block")
				{YAHOO.util.Dom.setStyle("i3GEOguiaMovelMolde", "opacity", 0.8);}
			};
			$i("i3GEOguiaMovelMolde").onmouseout = function(){
				YAHOO.util.Dom.setStyle("i3GEOguiaMovelMolde", "opacity", 0.20);
			};
			i3GEO.guias.guiaMovel.ativa(i3GEO.guias.ATUAL);
			if(i3GEO.guias.guiaMovel.ABERTA === true)
			{i3GEO.guias.guiaMovel.abreFecha();}
		},
		/*
		Function: mostraIcones
		
		Mostra os ícones que acionam cada guia
		*/
		mostraIcones: function(){
			if($i("i3GEOguiaMovelIcones").innerHTML != "")
			{return;}
			var n = i3GEO.guias.guiaMovel.config.guias.icones.length,
				i,
				temp = i3GEO.guias.guiaMovel.config.guias,
				ins = "";
			if(i3GEO.guias.ORDEM !== "")
			{temp.chaves = i3GEO.guias.ORDEM;}
			for(i=0;i<n;i++){
				if(temp.chaves[i])
				{ins += "<button onclick='i3GEO.guias.guiaMovel.ativa(\""+temp.chaves[i]+"\")' style='background-image:none;margin-left:8px;'><img id='"+temp.ids[i]+"' src='"+i3GEO.configura.locaplic+"/"+temp.icones[i]+"' title='"+temp.titulos[i]+"' style='cursor:pointer;border:solid 0px white;' /></button>";}
			}
			$i("i3GEOguiaMovelIcones").innerHTML = ins;
		},
		/*
		Function: ativa
		
		Ativa o conteúdo de determinada guia
		
		Parametro:
		
		chave {string} - código da guia, definido em i3GEO.guias.CONFIGURA
		*/
		ativa: function(chave){
			if(i3GEO.guias.CONFIGURA[chave].click)
			{i3GEO.guias.CONFIGURA[chave].click.call();}
			i3GEO.guias.escondeGuias();
			i3GEO.guias.mostra(chave);
			i3GEO.guias.ATUAL = chave;
		},
		/*
		Function: reposiciona
		
		Reposiciona a guia móvel quando o mapa muda de tamanho
		*/
		reposiciona: function(){
			i3GEO.guias.guiaMovel.config.guias.icones = [];
			i3GEO.guias.guiaMovel.config.guias.ids = [];
			i3GEO.guias.guiaMovel.config.guias.idsconteudos = [];
			i3GEO.guias.guiaMovel.config.guias.titulos = [];
			i3GEO.guias.guiaMovel.config.guias.chaves = [];
			i3GEO.guias.guiaMovel.config.alturaGuiaMovel = 0;
			i3GEO.guias.ALTURACORPOGUIAS = 0;
			$i("i3GEOguiaMovelIcones").style.display = "none";
			$i("i3GEOguiaMovelConteudo").style.display = "none";
			$i("i3GEOguiaMovelMolde").style.display = "none";			
			i3GEO.guias.escondeGuias();
			i3GEO.guias.guiaMovel.inicia();
		},
		/*
		Function: abreFecha
		
		Abre ou fecha a guia móvel
		*/
		abreFecha: function(){
			var conteudo = $i("i3GEOguiaMovelConteudo"),
				molde = $i("i3GEOguiaMovelMolde"),
				guia = $i("i3GEOguiaMovel"),
				attributes,
				anim,
				anim1;
			if(molde.style.display === "block"){//esconde
				$i("i3GEOguiaMovelIcones").style.display = "none";
				$i("i3GEOguiaMovelConteudo").style.display = "none";
				attributes = {
					left: { to: i3GEO.guias.guiaMovel.left },
					id: "i3GEOguiaMovel"
				};
				anim = new YAHOO.util.Anim(guia, attributes, 1, YAHOO.util.Easing.easeNone);
				attributes = {
					width: { to: 0 },
					id: "i3GEOguiaMovelMolde"
				};
				anim1 = new YAHOO.util.Anim(molde, attributes, 1, YAHOO.util.Easing.easeNone);					
				anim.animate();
				anim1.animate();
				anim1.onComplete.subscribe(function(){
					molde.style.display = "none";
				});				
			}
			else{
				//conteudo.style.display = "block";
				molde.style.display	= "block";		
				attributes = {
					left: { to: parseInt(guia.style.left,10) - i3GEO.guias.guiaMovel.config.larguraGuiaMovel },
					id: "i3GEOguiaMovel"
				};
				anim = new YAHOO.util.Anim(guia, attributes, 1, YAHOO.util.Easing.easeNone);
				
				attributes = {
					width: { to: i3GEO.guias.guiaMovel.config.larguraGuiaMovel },
					id: "i3GEOguiaMovelMolde"
				};
				anim1 = new YAHOO.util.Anim(molde, attributes, 1, YAHOO.util.Easing.easeNone);					
				
				anim.animate();
				anim1.animate();
				anim1.onComplete.subscribe(function(){
					$i("i3GEOguiaMovelIcones").style.display = "block";
					$i("i3GEOguiaMovelConteudo").style.display = "block";
					i3GEO.guias.guiaMovel.mostraIcones();
					//YAHOO.util.Dom.setStyle("i3GEOguiaMovelMolde", "opacity", 0.8);
				});
			}
		}
	}
};