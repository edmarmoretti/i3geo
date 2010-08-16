/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: i3Geo

Arquivo:

i3geo/classesjs/classe_i3geo.js

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
/*
Classe: i3GEO

A classe i3GEO possuí os métodos de criação e atualização do mapa. Todas as subclasses
são baseadas em i3GEO, por exemplo, para criar uma janela flutuante sobre o mapa,
utilize i3GEO.janela.cria()

Para inicializar o mapa, utilize i3GEO.inicia() e para atualizar o mapa, utilize i3GEO.atualiza().
Após terminado o processo de inicialização, pode-se executar uma função de ajuste. Essa função
deve ser definida em i3GEO.finaliza, por exemplo i3GEO.finaliza = "funcaoDeAjuste()"

Ao inicializar ou atualizar o i3Geo, é feita uma chamada em AJAX 
para a obtenção dos parâmetros necessários ao funcionamento do mapa. Esses parâmetros
são armazenados na variável i3GEO.parametros

Nessa classe estão disponíveis variáveis internas utilizadas em várias funções, como i3GEO.temaAtivo
*/
i3GEO = {
	
	/*
	Propriedade: parametros
	
	Parâmetros obtidos do mapa atual. Os parâmetros são fornecidos pelos programas
	PHP de redesenho e criação do mapa e atualizados sempre que o mapa é alterado.
	
	Exemplos:
	
	alert(i3GEO.parametros.mapexten);
	i3GEO.parametros.mapscale = 25000;
	
	Parametros:
	
	mapexten {String} - extensão geográfica do mapa no formato xmin ymin xmax ymax
	
	mapscale {Numeric} - denominador da escala do mapa
	
	mapres {Numeric} - resolução da imagem do mapa em DPI
	
	pixelsize {Numeric} - tamanho em unidades de terreno dos pixels da imagem
	
	mapfile {String} - nome do mapfile atualmente em uso
	
	cgi {String} - endereço do executável do mapserver no servidor acessível pela URL
	
	extentTotal {String} - extensão do mapa na inicialização
	
	mapimagem {String} - URL da imagem que compõe o mapa
	
	geoip {sim|nao} - indica se o geoip está instalado
	
	listavisual {String} - lista de visuais disponíveis
	
	utilizacgi {sim|nao} - indica se o mapa atual está no modo CGI
	
	versaoms {String} - versão do Mapserver instalado no servidor (maior)
	
	versaomscompleta {String} - versão do Mapserver instalado no servidor (completa)
	
	mensagens {String} - mensagens para uso no letreiro
	
	w {Integer} - largura do mapa atual
	
	h {Integer} - altura do mapa atual
	
	locsistemas {String} - endereço do xml com a lista de sistemas adicionais
	
	locidentifica {String} - endereço do xml com a lista de sistemas de identificação
	
	r {sim|nao} - indica se o software R está instalado no servidor
	
	locmapas {String} - endereço do xml com a lista de mapas
	
	extentref {String} - extensão geográfica do mapa de referência
	
	celularef {Numeric} - tamanho do pixel do mapa de referência em unidades do terreno
	
	kmlurl {String} - url de um arquivo kml que será inserido no mapa. Válido apenas na interface Google Maps

	mensagemInicia {String} - mensagem definida em ms_configura.php indicando a versão atual do i3Geo.
	
	interfacePadrao {String} - interface padrão definida em ms_configura
	
	embedLegenda {String} - sim|nao indica se na inicialização a legenda foi inserida no conteúdo do mapa ou não
	
	celularef {Numeric} - tamanho da célula do mapa de referência
	*/
	parametros: {
		mapexten: "",
		mapscale: "",
		mapres: "",
		pixelsize: "",
		mapfile: "",
		cgi: "",
		extentTotal: "",
		mapimagem: "",
		geoip: "",
		listavisual: "",
		utilizacgi:"",
		versaoms:"",
		versaomscompleta: "",
		mensagens:"",
		w: "",
		h: "",
		locsistemas:"",
		locidentifica:"",
		r:"",
		locmapas:"",
		celularef:"",
		kmlurl:"",
		mensageminicia:"",
		interfacePadrao:"geral.htm",
		embedLegenda:"nao",
		celularef:""
	},
	/*
	Propriedade: finaliza
	
	Armazena o nome de uma função que será executada após a inicialização do mapa
	
	Tipo:
	{string}
	
	Default:
	{""}
	*/
	finaliza:"",
	/*
	Variavel: temaAtivo
	
	Indica o último tema que foi ativado no mapa
	
	Permite que ao se passar de uma ferramenta
	para outra, os menus reflitam a última escolha.
	
	Tipo:
	{string}
	
	Default:
	{""}
	*/
	temaAtivo: "",
	/*
	Variavel: contadorAtualiza
	
	Essa variável é um contador utilizado para indicar quantos processos estão ativos e que
	farão o redesenho do mapa. O mapa só é atualizado quando o contador for menor que 1.
	Essi contador é utilizado no método i3GEO.atualiza e todas as funções que chamam esse
	método devem acrescentar 1 ao contador, por exemplo, i3GEO.contadoratualiza++
	O contador é necessário para evitar chamadas desnecessárias à função de redesenho do mapa.
	
	Tipo:
	{string}
	*/
	contadorAtualiza:0,
	/*
	Function: cria
	
	Cria e configura a visualização do mapa, definindo posicionamentos, tamanho etc
	
	Após as definições básicas, é executado o programa <i3GEO.Interface.cria> que irá
	realizar as operações conforme a interface atualmente em uso. A interface é definida
	em <i3GEO.Interface.ATUAL>
	
	Veja <i3GEO.Interface>
	*/
	cria:function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.cria()");}
		var temp,i,tamanho;
		if (window.location.href.split("?")[1]){
			i3GEO.configura.sid = window.location.href.split("?")[1];
			//
			//a biblioteca YUI, por algum motivo, acrescenta # na URL. O # precisa ser removido, caso contrário, a opção de reload da página pelo browser as vezes não funciona
			//
			if (i3GEO.configura.sid.split("#")[0])
			{i3GEO.configura.sid = i3GEO.configura.sid.split("#")[0];}
		}
		else
		{i3GEO.configura.sid = "";}
		//
		//para efeitos de compatibilidade
		//
		g_panM = "nao";
		g_sid = i3GEO.configura.sid;
		try {i3GEO.configura.locaplic = g_locaplic;}
		catch(e){
			g_locaplic = i3GEO.configura.locaplic;
		}
		try{i3GEO.configura.diminuixM = g_diminuixM;}catch(e){}
		try{i3GEO.configura.diminuixN = g_diminuixN;}catch(e){}
		try{i3GEO.configura.diminuiyM = g_diminuiyM;}catch(e){}
		try{i3GEO.configura.diminuiyN = g_diminuiyN;}catch(e){}			
		//
		//calcula o tamanho do mapa
		//
		tamanho = i3GEO.calculaTamanho();
		i3GEO.Interface.cria(tamanho[0],tamanho[1]);
		i3GEO.parametros = {
			mapexten: "",
			mapscale: "",
			mapres: "",
			pixelsize: "",
			mapfile: "",
			cgi: "",
			extentTotal: "",
			mapimagem: "",
			geoip: "",
			listavisual: "",
			utilizacgi:"",
			versaoms:"",
			versaomscompleta:"",
			mensagens:"",
			w: tamanho[0],
			h: tamanho[1],
			locsistemas:"",
			locidentifica:"",
			r:"",
			locmapas:"",
			extentref:"",
			kmlurl:"",
			mensageminicia:"",
			interfacePadrao:"geral.htm",
			embedLegenda:"nao",
			celularef: ""
		};
		if(tamanho[0] < 550){
			i = $i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml);
			if(i){i.style.display = "none";}
		}
	},
	/*
	Function: inicia
	
	Inicializa o mapa
	
	Verifica se o mapa apresenta algum problema no processamento no lado do servidor e
	realiza as operações de tentativa de recuperação, se for o caso
	
	No início do processo é executada a função <i3GEOmantemCompatibilidade>
	para realizar as operações necessárias de manutenção de compatibilidade da versão atual para as anteriores
	
	A inicialização é baseada em <i3GEO.php.inicia> cujo retorno é utilizado para definir a
	variável <i3GEO.parametros>
	
	Após a inicialização é executado <i3GEO.Interface.inicia>
	*/
	inicia:function(retorno){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.inicia()");}
		var montaMapa,mashup,tamanho;
		if(typeof("i3GEOmantemCompatibilidade") === 'function')
		{i3GEOmantemCompatibilidade();}
		montaMapa = function(retorno){
			var tempo,titulo,temp,abreJM;
			if(retorno === ""){
				alert("Ocorreu um erro no mapa - montaMapa");
				retorno = {data:{erro: "erro"}};
			}
			if(retorno.data.erro){
				i3GEO.janela.fechaAguarde("montaMapa");
				document.body.style.backgroundColor="white";
				document.body.innerHTML = "<br>Para abrir o i3Geo utilize o link:<br><a href="+i3GEO.configura.locaplic+"/ms_criamapa.php >"+i3GEO.configura.locaplic+"/ms_criamapa.php</a>";
				return("linkquebrado");
			}
			else{
				if(retorno.data.variaveis){
					//
					//executa com eval a string que é retornada pelo servidor (função inicia do mapa_controle.php
					//
					tempo = "";
					titulo = "";
					eval(retorno.data.variaveis);
					try{
						if (titulo !== "")
						{top.document.title = titulo;}
					}
					catch(e){
						if(typeof(console) !== 'undefined'){console.error(e);}
					}
					i3GEO.ajuda.mostraJanela("Tempo de desenho em segundos: "+tempo,"");
					try{
						i3GEO.parametros.mapexten= mapexten;
						i3GEO.parametros.mapscale= parseInt(mapscale,10);
						i3GEO.parametros.mapres= mapres;
						i3GEO.parametros.pixelsize= g_celula;
						i3GEO.parametros.mapfile= mapfile;
						i3GEO.parametros.cgi= cgi;
						i3GEO.parametros.extentTotal=mapexten;
						i3GEO.parametros.mapimagem= mapimagem;
						i3GEO.parametros.geoip= geoip;
						i3GEO.parametros.listavisual= listavisual;
						i3GEO.parametros.utilizacgi= utilizacgi;
						i3GEO.parametros.versaoms= versaoms;
						i3GEO.parametros.mensagens= mensagens;
						i3GEO.parametros.locsistemas = locsistemas;
						i3GEO.parametros.locidentifica = locidentifica;
						i3GEO.parametros.r = r;
						i3GEO.parametros.locmapas = locmapas;
						i3GEO.parametros.extentref = extentref;
						i3GEO.parametros.versaoms = versaoms;
						i3GEO.parametros.versaomscompleta = versaomscompleta;
						i3GEO.parametros.kmlurl = kmlurl;
						i3GEO.parametros.mensageminicia = mensagemInicia;
						i3GEO.parametros.interfacePadrao = interfacePadrao;
						i3GEO.parametros.embedLegenda = embedLegenda;
					}
					catch(e){alert("Erro durante a definicao de i3GEO.parametros "+e);}					
					i3GEO.arvoreDeCamadas.CAMADAS = retorno.data.temas;
					
					i3GEO.gadgets.quadros.inicia(10);
					i3GEO.gadgets.quadros.grava("extensao",mapexten);
					
					i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);

					i3GEO.gadgets.mostraBuscaRapida();
					i3GEO.gadgets.mostraVersao();
					i3GEO.guias.cria();
					
					if($i("arvoreAdicionaTema"))
					{i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,"arvoreAdicionaTema");}
					
					if($i("mst"))
					{$i("mst").style.display="block";}
					//
					//na interface padrão é necessário executar a atualização pois a geração do mapa
					//ainda não foi feita
					//
					if(i3GEO.Interface.ATUAL === "padrao")
					{i3GEO.atualiza(retorno);}
					//
					//calcula (opcional) o tamanho correto da tabela onde fica o mapa
					//se não for feito esse cálculo, o mapa fica ajustado à esquerda
					//			
					temp = 0;
					if ($i("contemFerramentas")){temp = temp + parseInt($i("contemFerramentas").style.width,10);}
					if ($i("ferramentas")){temp = temp + parseInt($i("ferramentas").style.width,10);}
					if($i("mst"))
					{$i("mst").style.width=i3GEO.parametros.w + temp + "px";}
					if (i3GEO.configura.entorno === "sim"){
						i3GEO.configura.entorno = "nao";
						i3GEO.navega.entorno.ativaDesativa();
					}
					i3GEO.navega.autoRedesenho.ativa();
					if ($i("i3geo_escalanum")){$i("i3geo_escalanum").value = i3GEO.parametros.mapscale;}
					if ((i3GEO.parametros.geoip === "nao") && ($i("ondeestou")))
					{$i("ondeestou").style.display="none";}
					i3GEO.Interface.inicia();
				}
				else
				{alert("Erro. Impossivel criar o mapa "+retorno.data);return;}
				//
				//ativa a janela de mensagens se for o caso
				//
				if(document.getElementById("ajuda")) //para efeitos de compatibilidade com as versões anteriores a 4.1
				{i3GEO.ajuda.DIVAJUDA = "ajuda";}
				abreJM = "sim";
				if(i3GEO.util.pegaCookie("g_janelaMen")){
					abreJM = i3GEO.util.pegaCookie("g_janelaMen");
					i3GEO.configura.iniciaJanelaMensagens = (abreJM === "sim") ? true : false;
				}
				if(i3GEO.configura.iniciaJanelaMensagens === true)
				{i3GEO.ajuda.abreJanela();}		
				i3GEO.janela.fechaAguarde("montaMapa");
				if (i3GEO.configura.liberaGuias === "sim")
				{i3GEO.guias.libera();}
			}
			if($i("mst")){$i("mst").style.visibility ="visible";}	
		};
		if (!$i("i3geo"))
		{document.body.id = "i3geo";}
		$i("i3geo").className = "yui-skin-sam";
		//if($i("mst"))
		//{$i("mst").style.visibility ="hidden";}
		//
		//se i3GEO.configura.sid = "", o html foi aberto diretamente
		//então, é necessário criar os arquivos temporários do mapa
		//essa operação deve ser assíncrona
		//
		if(i3GEO.configura.sid===""){
			mashup = function (retorno){
				i3GEO.configura.sid = retorno.data;
				i3GEO.inicia(retorno);
			};
			if(i3GEO.Interface.ATUAL !== "padrao")
			{i3GEO.configura.mashuppar += "&interface="+i3GEO.Interface.ATUAL;}
			i3GEO.php.criamapa(mashup,i3GEO.configura.mashuppar);
		}
		else{
			//YAHOO.log("Chamada AJAX para obter o mapa inicial", "i3geo");
			i3GEO.janela.abreAguarde("montaMapa",$trad("o5"));
			if(i3GEO.parametros.w === "" || i3GEO.parametros.h === ""){
				tamanho = i3GEO.calculaTamanho();
				i3GEO.parametros.w = tamanho[0];
				i3GEO.parametros.h = tamanho[1];
			}
			i3GEO.php.inicia(montaMapa,i3GEO.configura.embedLegenda,i3GEO.parametros.w,i3GEO.parametros.h);
		}
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.janela.fechaAguarde()") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.janela.fechaAguarde()");}
		eval(i3GEO.finaliza);
	},
	/*
	Function: atualiza
	
	Atualiza o mapa atual, altera a imagem do mapa os gadgets ativos e os parâmetros e
	verifica a integridade do mapa em uso (arquivo mapfile)
	
	O processo executa também a função de atualização específica da interface atual em uso, veja
	<i3GEO.Interface.redesenha>
	
	Os seguintes gadgets são processados
	
	<i3GEO.arvoreDeCamadas.atualiza>
	
	<i3GEO.arvoreDeCamadas.atualizaFarol>
	
	Os eventos definidos em <i3GEO.eventos.navegaMapa> são executados
	
	Parametro:
	
	retorno {String} - string com os parâmetros do novo mapa. Se retorno não
	for especificado ou se for vazio, será feita uma chamada em ajax para sua obtenção. O resultado
	dessa chamada é armazenada em i3GEO.parametros
	*/
	atualiza: function(retorno){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.atualiza()");}
		var corpoMapa,erro,tempo,mapscale,mapexten;
		if(i3GEO.contadorAtualiza > 1)
		{i3GEO.contadorAtualiza--;return;}
		if(i3GEO.contadorAtualiza > 0)
		{i3GEO.contadorAtualiza--;}
		corpoMapa = function(){
			if($i("ajaxCorpoMapa"))
			{return;}
			i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o1")+" atualizando");
			i3GEO.php.corpo(i3GEO.atualiza,i3GEO.configura.tipoimagem);		
		};
		if(arguments.length === 0){
			i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
			corpoMapa.call();
			return;
		}
		if(retorno === ""){
			corpoMapa.call();
			return;
		}
		if(!retorno.data){
			alert(retorno);
			i3GEO.mapa.recupera.inicia();
			//corpoMapa.call();
			return;
		}
		//verifica se o parâmetro retorno existe, caso contrário,
		//faz a chamada ao programa PHP para obter os parâmetros
		try{
			if (retorno.data === "erro"){
				alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");
				i3GEO.mapa.recupera.inicia();return;
			}
			else
			if(retorno.data === "ok" || retorno.data === "")
			{corpoMapa.call();return;}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
		erro = function(){
			var legimagem,c;
			legimagem = "";
			c = confirm("Ocorreu um erro, quer tentar novamente?");
			if(c){
				corpoMapa.call();
			}
			else{
				i3GEO.janela.fechaAguarde();
			}
			return;
		};
		try{
			eval(retorno.data.variaveis);
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
			erro.call();
			return;
		}
		if(arguments.length === 0 || retorno === "" || retorno.data.variaveis === undefined)
		{erro.call();return;}
		else{	
			if(arguments.length === 0){return;}
			i3GEO.mapa.verifica(retorno);
			tempo = "";
			if(i3GEO.desenho.richdraw)
			{i3GEO.desenho.richdraw.clearWorkspace();}
			mapscale = "";
			mapexten = "";
			//transforma o retorno em variáveis
			eval(retorno.data.variaveis);
			if(erro != "")
			{alert(erro);}			
			//
			//o try aqui é necessário pois na interface googlemaps os parâmetros retorno.data.variaveis não são gerados completamente
			//
			try{
				i3GEO.arvoreDeCamadas.atualiza(retorno.data.temas);
				if (i3GEO.parametros.mapscale !== mapscale)
				{i3GEO.arvoreDeCamadas.atualizaFarol(mapscale);}
				i3GEO.parametros.mapexten = mapexten;
				i3GEO.parametros.mapscale = mapscale;
				i3GEO.parametros.mapres = mapres;
				i3GEO.parametros.pixelsize = g_celula;
				i3GEO.parametros.mapimagem = mapimagem;
			}
			catch(e){}
			i3GEO.arvoreDeCamadas.CAMADAS = retorno.data.temas;
			i3GEO.Interface.redesenha();
			//caso esteja na função de identificação
			if($i("i3GEOidentificalistaTemas")){
				g_tipoacao = "identifica";
				g_operacao='identifica';
			}
			else
			{g_operacao = "";}
			//i3GEO.parametros.mapexten = mapexten;
			if ($i("mensagemt"))
			{$i("mensagemt").value = i3GEO.parametros.mapexten;}
			
			i3GEO.eventos.navegaMapa();
			if (i3GEO.configura.entorno === "sim"){
				i3GEO.navega.entorno.geraURL();
				i3GEO.navega.entorno.ajustaPosicao();
			}
			i3GEO.ajuda.mostraJanela("Tempo de redesenho em segundos: "+tempo,"");
		}	
	},
	/*
	Function: calculaTamanho
	
	Calcula o tamanho do mapa atual e define alguns elementos HTML do mapa
	
	Return:
	{array} - [w,h]
	*/
	calculaTamanho: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.calculaTamanho()");}
		var diminuix,diminuiy,menos,novow,novoh,w,h,temp;
		diminuix = (navm) ? i3GEO.configura.diminuixM : i3GEO.configura.diminuixN;
		diminuiy = (navm) ? i3GEO.configura.diminuiyM : i3GEO.configura.diminuiyN;
		//
		//subtrai barra de rolagem
		//
		try{diminuiy += i3GEO.util.getScrollerWidth();}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
		//
		menos = 0;
		if ($i("contemFerramentas"))
		{menos += parseInt($i("contemFerramentas").style.width,10);}
		if ($i("ferramentas"))
		{menos += parseInt($i("ferramentas").style.width,10);}
		novow = parseInt(screen.availWidth,10) - diminuix;
		novoh = parseInt(screen.availHeight,10) - diminuiy;
		if (window.top === window.self){//nao se aplica em iframe		
			window.resizeTo(screen.availWidth,screen.availHeight);
			window.moveTo(0,0);
		}
		//o try aqui é necessário por conta do uso possível do i3geo em um iframe
		try{
			if (novow < 800){
				novow = 800;
				novoh = 600;
			}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
		//novoh = 500
		document.body.style.width = novow - diminuix;
		document.body.style.height = novoh;
		w = novow - menos - diminuix;
		h = novoh - diminuiy;
		temp = $i("corpoMapa");
		if (temp){
			if(temp.style){
				if (temp.style.width){
					w = parseInt(temp.style.width,10);
					h = parseInt(temp.style.width,10);
				}
				if (temp.style.height)
				{h = parseInt(temp.style.height,10);}
			}
		}
		temp = $i("contemImg");
		if(temp){
			temp.style.height=h + "px";
			temp.style.width=w + "px";
		}
		return [w,h];	
	}
};
/*
Classe: i3GEOF

Esta classe recebe os métodos sob demanda por meio da injeção de javascripts por meio de script tag.
*/
i3GEOF = [];
//YAHOO.log("carregou classe i3geo", "Classes i3geo");