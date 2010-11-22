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
			titulo:"+"+$trad("g1"),
			id:"guia2",
			idconteudo:"guia2obj",
			click: function(){
				var ondeArvore;
				i3GEO.guias.mostra("adiciona");
				if(!$i("arvoreAdicionaTema"))
				{
					ondeArvore = "guia2obj";
					if(typeof(objmapa) !== 'undefined'){
						if (typeof(objmapa.guiaMenu) !== 'undefined')
						{ondeArvore = objmapa.guiaMenu+"obj";}
					}
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
					var ins,mapa,ig1lt,ig1,nome,lkd,link;
					ins = "<br><div id='banners' style='overflow:auto;text-align:left'>";
					mapa = retorno.data.mapas;
					ig1lt = mapa.length;
					ig1=0;
					if(ig1lt > 0){
						do{
							nome = mapa[ig1].NOME;
							if(mapa[ig1].PUBLICADO){
								if(mapa[ig1].PUBLICADO === "NAO" || mapa[ig1].PUBLICADO === "nao")
								{nome = "<s>"+nome+"</s>";}
							}
							lkd = mapa[ig1].LINK;
							link = i3GEO.configura.locaplic+"/ms_criamapa.php?temasa="+mapa[ig1].TEMAS+"&layers="+mapa[ig1].LIGADOS;
							if (mapa[ig1].EXTENSAO !== "")
							{link += "&mapext="+mapa[ig1].EXTENSAO;}
							if (mapa[ig1].OUTROS !== "")
							{link += "&"+mapa[ig1].OUTROS;}
							if (lkd !== "")
							{link = lkd;}
							ins += "<div><a href='"+link+"'><img src='"+mapa[ig1].IMAGEM+"'></a></div><br>";
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
	guia|sanfona
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
						eval("i3GEO.guias.CONFIGURA.guia"+g+"=[]");
						eval("i3GEO.guias.CONFIGURA.guia"+g+".titulo = '"+tituloguia+"'");
						eval("i3GEO.guias.CONFIGURA.guia"+g+".id = 'guia"+g+"'");
						eval("i3GEO.guias.CONFIGURA.guia"+g+".idconteudo = 'guia"+g+"obj'");
						if($i('guia'+g).onclick){
							eval("i3GEO.guias.CONFIGURA.guia"+g+".click = "+$i("guia"+g).onclick);
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
			if(i3GEO.guias.TIPO === "guia"){
				ins = '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
				for(ng=0;ng<nguias;ng++){
					if($i(i3GEO.guias.CONFIGURA[guias[ng]].id)){
						if($i(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo))
						{ins += '<li><a href="#"><em><div id="'+i3GEO.guias.CONFIGURA[guias[ng]].id+'" >'+i3GEO.guias.CONFIGURA[guias[ng]].titulo+'</div></em></a></li>';}
					}
				}
				ins += "</ul>";
				onde.innerHTML = ins;
				onf = function(){
					var bcg,cor;
					bcg = this.parentNode.parentNode.style;
					cor = bcg.background.split(" ")[0];
					if(cor !== "white")
					{bcg.background = "#bfdaff";}
				};
				outf = function(){
					var bcg,cor;
					bcg = this.parentNode.parentNode.style;
					cor = bcg.background.split(" ")[0];
					if(cor !== "white")
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
							ins += '<dt style=height:17px id="'+i3GEO.guias.CONFIGURA[guias[ng]].id+'" >';
							//ins += i3GEO.guias.CONFIGURA[guias[ng]].titulo+'<img id="" src="'+i3GEO.configura.locaplic+'/imagens/branco.gif" style="width:10px;" /></dt>';
							ins += '<table class=accordiontable ><tr><td width="98%" >'+i3GEO.guias.CONFIGURA[guias[ng]].titulo+'</td><td width="2%" ><img id="" src="'+i3GEO.configura.locaplic+'/imagens/branco.gif" style="width:10px;" /></td></tr></table>';
							ins += '<dd clas=close >';
							ins += '<div class=bd >';
							ins += '<div id="'+id+'" >'+guiaconteudo+'</div></div></dd>';
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
					{eval('$i("'+id+'").onclick = function(){i3GEO.guias.mostra("'+guias[g]+'");}');}
					else
					{guiaconteudo.onclick = guia.click;}
					guiaconteudo.onmouseover = onf;
					guiaconteudo.onmouseout = outf;
					temp = $i(guia.idconteudo);
					if(temp){
						temp.style.overflow="auto";
						if(i3GEO.guias.TIPO === "guia")
						{temp.style.height = i3GEO.parametros.h;}
						else
						{temp.style.height = onde.style.height;}
					}
				}
			}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}	
		i3GEO.guias.mostra(i3GEO.guias.ATUAL);
		i3GEO.guias.ativa(i3GEO.guias.ATUAL);
	},
	/*
	Function: ajustaAltura
	
	Ajusta a altura das guias conforme a altura da imagem do mapa
	*/
	ajustaAltura: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.ajustaAltura()");}
		var guia,guias,nguias;
		guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
		nguias = guias.length;
		for(g=0;g<nguias;g++){
			guia = $i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo);
			if(guia){
				guia.style.overflow="auto";
				if(i3GEO.guias.TIPO === "guia")
				{guia.style.height = i3GEO.parametros.h;}
			}	
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
		var guias,nguias,g;
		guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
		nguias = guias.length;
		for(g=0;g<nguias;g++){
			if($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo))
			{$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.display="none";}
			if($i(i3GEO.guias.CONFIGURA[guias[g]].id))
			{$i(i3GEO.guias.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background="transparent";}
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
			if($i(i3GEO.guias.CONFIGURA[guia].idconteudo)){
				$i(i3GEO.guias.CONFIGURA[guia].idconteudo).style.display="block";
				$i(i3GEO.guias.CONFIGURA[guia].id).parentNode.parentNode.style.background="white";
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
			if(i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].click !== "")
			{i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].click.call();}
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
			if($i(i3GEO.guias.IDGUIAS))
			{$i(i3GEO.guias.IDGUIAS).style.display="none";}
			i = $i("contemFerramentas");
			if(i)
			{i.style.display = "none";}
			w = parseInt($i("contemFerramentas").style.width,10);
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
			i = $i("img");
			if(i){
				i.style.width= l+pos;
				i.style.height= a+pos;
			}
			i = $i("corpoMapa");
			if(i){
				i.style.width= l+pos;
				i.style.height= a+pos;
				i.style.clip = 'rect('+0+" "+(l*1+2)+" "+(a*1+2)+" "+0+')';
			}
			i = $i("mst");
			if(i)
			{i.style.width = l + 1 + pos;}
			i = $i("contemImg");
			if(i){
				i.style.height= a+pos;
				i.style.width= l+pos;
			}
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
				temp = '<div class="hd">Guias</div>';
				temp += '<div class="bd" id="conteudojanelaguias"></div>';
				novoel.innerHTML = temp;
				if($i("i3geo"))
				{$i("i3geo").appendChild(novoel);}
				else
				{document.body.appendChild(novoel);}
				YAHOO.namespace("janelaguias.xp");
				YAHOO.janelaguias.xp.panel = new YAHOO.widget.Panel("janelaguias", {width:"270px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false,iframe:false } );
				YAHOO.janelaguias.xp.panel.render();
				i = $i(i3GEO.guias.IDGUIAS);
				$i("janelaguias").appendChild(i);
				i.style.borderLeft="1px solid black";
				i.style.borderRight="1px solid black";
				guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
				nguias = guias.length;
				for(g=0;g<nguias;g++){
					if($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo)){
						$i("janelaguias").appendChild($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo));
						$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.background="white";
						$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.border="1px solid black";
						$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.borderTop="0px solid black";
						$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.width="270px";
						$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.left="-1px";
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
	
	namespace {String} - Todas elementos html que tiverem como id o namespace, seguindo por um número e "obj", terão seu estilo alterado para none, tornando-se invisíveis
	
	*/
	mostraGuiaFerramenta: function(guia,namespace){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.guias.mostraGuiaFerramenta()");}
		var g;
		if(arguments.length === 1)
		{namespace = "guia";}
		for(g=0;g<12;g++)
		{
			if ($i(namespace+g+"obj")){
				$i(namespace+g+"obj").style.display="none";
			}
		}
		if ($i(guia+"obj")){
			$i(guia+"obj").style.display="block";
		}	
	}
};
//YAHOO.log("carregou classe guias", "Classes i3geo");