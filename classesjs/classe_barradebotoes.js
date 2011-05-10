/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Barra de botões

Arquivo:

i3geo/classesjs/classe_barradebotoes.js

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
Classe: i3GEO.barradebotoes

Constrói a barra de botões flutuante

Veja também classe_interface.js (i3GEO.Interface) que possuí parâmetros que permitem ajustar a posição das barras no mapa
*/
i3GEO.barraDeBotoes = {
	/*
	Propriedade: AJUDA

	Mostra um texto de ajuda colado ao ícone da ferramenta

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	AJUDA: true,
	/*
	Propriedade: ORIENTACAO

	Orientação vertical ou horizontal da barra

	Tipo:
	{string}

	Valores:
	{"horizontal","vertical"}
	
	Default:
	{"vertical"}
	*/
	ORIENTACAO: "vertical",
	/*
	Propriedade: HORIZONTALW

	Largura da barra quando ORIENTACAO = "horizontal"

	Tipo:
	{numeric}
	
	Default:
	{350}
	*/
	HORIZONTALW: 350,	
	/*
	Propriedade: TIPOAJUDA

	Tipo do balão de ajuda que é mostrado colado ao ícone da ferramenta

	Tipo:
	{string}

	Valores:
	{"horizontal","vertical"}
	
	Default:
	{"horizontal"}
	*/
	TIPOAJUDA: "horizontal",
	/*
	Propriedade: SOICONES

	Esconde as bordas das barras e o fundo, mostrando apenas os ícones

	Default:
	{false}

	Tipo:
	{boolean}
	*/
	SOICONES: false,
	/*
	Propriedade: AUTOALTURA

	Ajusta automaticamente a altura das barras conforme a altura do mapa.

	Esta opção não tem efeito se a barra contiver a barra de zoom (isso ocorre em função de um bug do YIU, que causa erro na barra nessas condições)

	Tipo:
	{boolean}
	*/
	AUTOALTURA: false,
	/*
	Propriedade: TRANSICAOSUAVE

	Altera a transparência das barras quando o mouse sobrepõe a barra e quando sai da barra

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	TRANSICAOSUAVE: true,
	/*
	Propriedade: OPACIDADE

	Valor da opacidade miníma utilizada quando TRANSICAOSUAVE for igual a true.

	Varia de 0 a 100

	Tipo:
	{numeric}

	Default:
	{65}
	*/
	OPACIDADE: 65,
	/*
	Propriedade: PERMITEFECHAR

	Mostra o botão para fechar as barras ou não.

	Tipo:
	{boolean}
	*/
	PERMITEFECHAR: true,
	/*
	Propriedade: PERMITEDESLOCAR

	Permite deslocar as barras ou não.

	Tipo:
	{boolean}
	*/
	PERMITEDESLOCAR: true,
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
	Propriedade: AUTO

	Cria as barras de botões automaticamente, utilizando os botões padrão sem considerar a lista de botões definidas no HTML da interface.

	A lista de botões é definida em i3GEO.configura

	Tipo:
	{Boolean}

	Default:
	{false}
	*/
	AUTO: false,
	/*
	Propriedade: LISTABOTOES

	Objeto com a lista de botões e suas propriedades, como por exemplo, a função a ser executada ao se clicar no botão.

	Essa lista não indica quais os botões que serão inseridos. Para definir os botões que serão inseridos, inclua no HTML da interface
	os botões desejados (veja em i3geo/exemplos). Se vc utilizar a opção i3GEO.barraDeBotoes.AUTO = true , os botões serão inseridos
	automaticamente. Nesse caso, utilize a opção i3GEO.barraDeBotoes.INCLUIRBOTOES para indicar os botões desejados.

	Por default utiliza os botoes definidos em i3GEO.configura.funcoesBotoes.botoes

	Tipo:
	{JSON}
	*/
	LISTABOTOES: i3GEO.configura.funcoesBotoes.botoes,
	/*
	Propriedade: INCLUIBOTAO

	Objeto que indica quais os botões que serão inseridos na barra de botões 2.

	Essa opção só funciona se i3GEO.barraDeBotoes.AUTO = true

	Vc pode também alterar a ordem dos botoes.

	Default:

	INCLUIBOTAO: {

		zoomli: false,

		pan: false,

		zoomtot:false,

		identifica: true,

		identificaBalao: true,

		mede: true,

		area: true,

		imprimir: true,

		reinicia: true,

		exten: true,

		referencia: true,

		inserexy: true,

		textofid: true,

		selecao: true,

		google: true,

		buscafotos: true,

		wiki: true,

		metar: true,

		lentei: true,

		confluence: true,

		inseregrafico: true,

		v3d: true
	}

	Tipo:
	{JSON}
	*/
	INCLUIBOTAO: {
		zoomli: true,
		pan: true,
		zoomtot:true,
		identifica: true,
		identificaBalao: true,
		mede: true,
		area: true,
		imprimir: true,
		reinicia: true,
		exten: true,
		referencia: true,
		inserexy: true,
		textofid: true,
		selecao: true,
		google: true,
		buscafotos: true,
		wiki: true,
		metar: true,
		lentei: true,
		confluence: true,
		inseregrafico: true,
		v3d: true
	},
	/*
	Propriedade: TEMPLATEBOTAO

	Template HTML que será utilizado na construção automática dos botões da barra 2.

	Utilize a string $$ para indicar onde será incluído o código do botão.

	Default:

	"<div style='display:inline;background-color:rgb(250,250,250);'><p style='font-size:2px;'>&nbsp;</p><img src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' id='$$'/></div>"

	Tipo:
	{string}
	*/
	TEMPLATEBOTAO: "",
	/*
	Propriedade: BOTAOPADRAO

	Botão que será ativado ao inicializar os botões com ativaBotoes.

	Correpsonde ao item iddiv de LISTABOTOES

	Tipo:
	{String}
	*/
	BOTAOPADRAO: "pan",
	/*
	Propriedade: COMPORTAMENTO

	Define o comportamento dos botões quando é pressionado

	Tipo:
	{String}

	Valores:

	"padrao" - comportamento padrão, com bordas da esquerda e inferiores ativadas

	"destacado" - destaca apenas o botão atualmente pressionado

	"vermelho" - destaca com fundo vermelho

	"laranja" - destaca com fundo laranja

	"cinza" - destaca com fundo cinza

	*/
	COMPORTAMENTO: "padrao",
	/*
	Variavel: BARRAS

	Array com os objetos YAHOO.janelaBotoes.xp.panel criados
	*/
	BARRAS: [],
	/*
	Variavel: BOTAOCLICADO

	Último icone que foi clicado

	Tipo:
	{String}
	*/
	BOTAOCLICADO: "",
	/*
	Function: ativaPadrao

	Ativa o botão definido como padrão, executando a função definida em onclick

	Utilizado para restaurar o status padrão da barra, principalmente por ferramentas que alteram ícones e outras propriedades do mapa
	*/
	ativaPadrao: function(){
		try{
			$i(i3GEO.barraDeBotoes.BOTAOPADRAO).onclick.apply(); //call não funciona no IE
		}
		catch(e){}
	},
	/*
	Function: ativaIcone

	Altera as bordas de um ícone aplicando um efeito de ícone realçado.

	Todos os demais ícones definidos em LISTABOTOES e que tiverem o tipo = "dinamico"
	serão processados para alterar as bordas dando o efeito de não ativo.

	Parametro:

	icone {String} - id do icone que será ativado. Esse id é o mesmo definido em LISTABOTOES
	*/
	ativaIcone: function(icone){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.ativaIcone()");}
		//
		//desativa a função de zoom por box nativa do OpenLayers
		//
		if(i3GEO.Interface.ATUAL==="openlayers"){
			try
			{i3GEO.Interface.openlayers.OLzoom.deactivate();}
			catch(e){}
		}
		var estilo,temp,ist,cor,ko;
		this.BOTAOCLICADO = icone;
		ko = this.LISTABOTOES.length-1;
		if(this.COMPORTAMENTO === "padrao"){
			if(ko >= 0){
				do{
					temp = $i(this.LISTABOTOES[ko].iddiv);
					if (this.LISTABOTOES[ko].tipo==="dinamico" && temp){
						ist = temp.style;
						ist.borderWidth="1px";
						ist.borderColor='white';
						if(this.SOICONES === true){
							ist.borderLeftColor='rgb(50,50,50)';
							ist.borderBottomColor='rgb(50,50,50)';
						}
					}
				}
				while(ko--);
			}
			//ativa o icone
			if($i(icone)){
				estilo = $i(icone).style;
				if(this.SOICONES === false){
					estilo.borderColor='white';
					estilo.borderWidth="1px";
				}
			}
		}
		if(this.COMPORTAMENTO === "destacado"){
			if(ko >= 0){
				do{
					temp = $i(this.LISTABOTOES[ko].iddiv);
					if (temp){
						ist = temp.style;
						ist.borderWidth="1px";
						ist.borderColor='white';
					}
				}
				while(ko--);
			}
			//ativa o icone
			if($i(icone)){
				estilo = $i(icone).style;
				if(this.SOICONES === false){
					estilo.borderColor='black';
					estilo.borderWidth="1px";
				}
			}
		}
		if(i3GEO.util.in_array(this.COMPORTAMENTO,["laranja","vermelho","cinza"])){
			if(ko >= 0){
				do{
					temp = $i(this.LISTABOTOES[ko].iddiv);
					if (temp){
						ist = temp.style;
						if(this.SOICONES === false){
							ist.borderWidth="1px";
							ist.borderColor='white';
							ist.backgroundColor='white';
						}
						else
						{ist.backgroundColor='';}
					}
				}
				while(ko--);
			}
			switch(this.COMPORTAMENTO){
				case "laranja":
					cor = "orange";
					break;
				case "vermelho":
					cor = "red";
					break;
				case "cinza":
					cor = "gray";
					break;
				default:
					cor = "yellow";
			};
			//ativa o icone
			if($i(icone)){
				estilo = $i(icone).style;
				if(this.SOICONES === false){
					estilo.borderColor='black';
					estilo.borderWidth="1px";
				}
				//else
				//{estilo.border = "0px solid white";}
				estilo.backgroundColor = cor;
			}
		}
	},
	/*
	Function: ativaBotoes

	Ativa os botoes definidos em LISTABOTOES

	Os botoes são construídos e as funções definidas são embutidas no evento onclick

	Parametro:

	padrao (String} - botao que será mostrado como ativo (opcional).
	Se não for definido, será utilizado o botão especificado em BOTAOPADRAO.
	O nome do botao deve estar em LISTABOTOES na propriedade iddiv
	*/
	ativaBotoes:function(padrao){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.ativaBotoes()");}
		var l,b,d,temp;
		if(arguments.length === 0)
		{padrao = this.BOTAOPADRAO;}
		this.BOTAOCLICADO = padrao;
		l = this.LISTABOTOES;
		b = l.length-1;
		if (b >= 0){
			do{
				temp = $i(l[b].iddiv);
				if (temp){
					if(l[b].conteudo)
					{temp.innerHTML = l[b].conteudo;}
					if(l[b].dica){
						eval('$i("'+l[b].iddiv+'").onmouseover = function(){i3GEO.barraDeBotoes.mostraJanela(this,"'+l[b].dica+'","");}');
						eval('$i("'+l[b].iddiv+'").onmouseout = function(){i3GEO.barraDeBotoes.mostraJanela(this,"");};');
					}
					if(l[b].funcaoonclick){
						temp.onclick = l[b].funcaoonclick;
						if(l[b].iddiv == padrao)
						{l[b].funcaoonclick();}
					}
					if(l[b].constroiconteudo)
					{eval(l[b].constroiconteudo);}
				}
				YAHOO.util.Event.addListener($i(l[b].iddiv), "click", YAHOO.util.Event.preventDefault);
				YAHOO.util.Event.addListener($i(l[b].iddiv), "click", YAHOO.util.Event.stopPropagation);
				YAHOO.util.Event.addFocusListener($i(l[b].iddiv), YAHOO.util.Event.preventDefault);
				//$i("i3geo_barra2").onclick = function(){alert("oi");}
			}
			while (b--);
		}
		if(padrao === "")
		{this.ativaIcone("");}
	},
	/*
	Function: inicializaBarra

	Inicializa a barra de botões

	A barra de zoom é inserida automaticamente na barra de botoes 1

	Exemplo:

	if ($i("barraDeBotoes1"))

	i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);

	if ($i("barraDeBotoes2"))

	i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);

	Os objetos criados são armazenados no array BARRAS, dessa forma, para acessar uma barra utilize
	por exemplo:

	i3GEO.barraDeBotoes.BARRAS[1].show();

	Parametros:

	idconteudo {String} - id do elemento existente no HTML e que contém as definições dos botões

	idconteudonovo {String} - id do elemento que será criado para adicionar os botoões

	barraZoom {boolean} - indica se a barra de zoom será incluída

	x {Numeric} - posição x (pixels) da barra em relação ao mapa

	y {Numeric} - posição y (pixels) da barra em relação ao mapa

	onde {String} - (opcional) id do elemento HTML onde os botões serão inseridos
	*/
	inicializaBarra:function(idconteudo,idconteudonovo,barraZoom,x,y,onde){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.inicializaBarra()");}
		if(this.TEMPLATEBOTAO === "" && i3GEO.Interface.TABLET === false)
		{this.TEMPLATEBOTAO = "<div style='display:inline;background-color:rgb(250,250,250);'><img style='border:0px solid white;' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' id='$$'/></div>";}
		if(this.TEMPLATEBOTAO === "" && i3GEO.Interface.TABLET === true)
		{this.TEMPLATEBOTAO = "<div style='display:inline;background-color:rgb(250,250,250);'><img style='margin:4px;border:0px solid white;' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' id='$$'/></div>";}

		var ticone,tipo,mostra,i,temp,elementos,e,wj,recuo,novoel,alturadisponivel,n,chaves,re,estilo,
			numerobotoes = 0,
			nelementos = 0,
			Dom = YAHOO.util.Dom,
			branco = i3GEO.configura.locaplic+'/imagens/branco.gif';
		if(navm)
		{i3GEO.barraDeBotoes.TRANSICAOSUAVE = false;}
		if(this.AUTO === true){
			if(idconteudo === "barraDeBotoes1"){
				novoel = document.createElement("div");
				novoel.id = "barraDeBotoes1";
				temp = '<table style="width:100%"><tr><td style="background-color:rgb(250,250,250);"><div ID="historicozoom" ></div></td></tr><tr><td style=height:5px ></td></tr></table>' +
					"<div style='display:inline;background-color:rgb(250,250,250);'>" +
					'<img title="zoom" alt="zoom" src="'+branco+'" id="zoomli"/>' +
					"</div>" +
					"<div style='display:inline;background-color:rgb(250,250,250);'>" +
					'<img title="desloca" alt="desloca" src="'+branco+'" id="pan"/>' +
					"</div>" +
					"<div style='display:inline;background-color:rgb(250,250,250);'>" +
					'<img title="geral" alt="geral" src="'+branco+'" id="zoomtot"/>' +
					"</div>";
				novoel.innerHTML = temp;
				document.body.appendChild(novoel);
			}
			if(idconteudo === "barraDeBotoes2"){
				temp = "";
				chaves = i3GEO.util.listaChaves(i3GEO.barraDeBotoes.INCLUIBOTAO);
				n = chaves.length;
				for(i=0;i<n;i+=1){
					if(i3GEO.barraDeBotoes.INCLUIBOTAO[chaves[i]] === true){
						temp += i3GEO.barraDeBotoes.TEMPLATEBOTAO.replace("$$",chaves[i]);
					}
				}
				if(typeof(onde) === 'undefined'){
					novoel = document.createElement("div");
					novoel.id = "barraDeBotoes2";
					estilo = "font-size:2px;";
					if(this.SOICONES === true)
					{estilo = "font-size:0px;";}
					novoel.innerHTML = "<table style='width:100%'>"+
						"<tr><td style='background-color:rgb(250,250,250);'><img title='' alt='sobe' src='"+branco+"' id='sobeferramentas'/></td></tr>"+
						"</table>" +temp+
						"<table style='width:100%;'><tr><td style='background-color:rgb(250,250,250);'><img title='desce' alt='' src='"+branco+"' id='desceferramentas'/></td></tr></table>";
					document.body.appendChild(novoel);
				}
				else{
					$i(onde).innerHTML = temp;
					return;
				}
			}
		}
		else{
			if(idconteudo === "barraDeBotoes2" && onde !== undefined){
				$i(onde).innerHTML = $i(idconteudo);
			}
		}
		wj = "36px";
		recuo = "0px";
		novoel = document.createElement("div");
		novoel.id = idconteudonovo;
		novoel.style.display="block";
		if(this.SOICONES === false){
			novoel.style.border="1px solid gray";
			novoel.style.background="white";
		}
		else
		{novoel.style.border="0px solid white";}
		if(i3GEO.barraDeBotoes.TRANSICAOSUAVE)
		{Dom.setStyle(novoel,"opacity",this.OPACIDADE / 100);}
		temp = "";
		if (barraZoom === true)
		{temp += i3GEO.navega.barraDeZoom.cria();}
		temp += '<div id="'+idconteudonovo+'_" style="left:'+recuo+';top:0px;"  ></div>';
		novoel.innerHTML = temp;
		novoel.onmouseover = function(){
			YAHOO.util.Dom.setStyle("i3geo_rosa","display","none");
			if(i3GEO.barraDeBotoes.TRANSICAOSUAVE){
				YAHOO.util.Dom.setStyle(novoel,"opacity",1);
			}
			if(i3GEO.Interface.TABLET === true){
				//i3GEO.barraDeBotoes.BARRAS[0].cfg.setProperty("height", "");
				//$i(i3GEO.barraDeBotoes.BARRAS[0].id+"_").style.top = "0px";
			}
		};
		novoel.onmouseout = function(){
			if(i3GEO.barraDeBotoes.TRANSICAOSUAVE){
				YAHOO.util.Dom.setStyle(novoel,"opacity",i3GEO.barraDeBotoes.OPACIDADE / 100);
			}
			if(i3GEO.Interface.TABLET === true){
				//i3GEO.barraDeBotoes.BARRAS[0].cfg.setProperty("height", "10px");
				//$i(i3GEO.barraDeBotoes.BARRAS[0].id+"_").style.top = "-200px";
			}
		};
		document.body.appendChild(novoel);
		if(this.ATIVAMENUCONTEXTO)
		{i3GEO.util.mudaCursor(i3GEO.configura.cursores,"contexto",idconteudonovo,i3GEO.configura.locaplic);}
		//copia os botoes do HTML para a janela
		ticone = 28;
		alturadisponivel = i3GEO.parametros.h - i3GEO.Interface.BARRABOTOESTOP - ticone - 38 - 38;
		if(this.AUTOALTURA === true)
		{alturadisponivel += 28;}
		numerobotoes = parseInt(alturadisponivel / ticone,10);
		if($i(idconteudo))
		{
			$i(idconteudonovo+"_").innerHTML = $i(idconteudo).innerHTML;
			$i(idconteudo).innerHTML = "";
			elementos = $i(idconteudonovo+"_").getElementsByTagName("img");
			nelementos = elementos.length;
			if(i3GEO.barraDeBotoes.ORIENTACAO === "horizontal")
			{numerobotoes = 100;}			
			//faz o cálculo do número de botões que devem ficar visíveis em função do tamanho da barra
			if(this.AUTOALTURA === true ||(numerobotoes < nelementos)){
				if(elementos[0].id === "sobeferramentas"){
					try{
						elementos = $i(idconteudonovo+"_").getElementsByTagName("div");
						nelementos = elementos.length;
						i = 0;
						do{
							elementos[i].style.display = "none";
							i = i + 1;
						}
						while(i < nelementos);
						i = 0;
						do{
							if(elementos[i] != undefined)
							{elementos[i].style.display = "inline";}
							i = i + 1;
						}
						while(i < numerobotoes-1);
					}catch(men){
						if(typeof(console) !== 'undefined'){console.error(men);}
					}
				}
			}
			if(elementos.length <= numerobotoes){
				Dom.setStyle(["sobeferramentas","desceferramentas"],"display","none");
			}
		}
		YAHOO.namespace("janelaBotoes.xp");
		if(i3GEO.barraDeBotoes.ORIENTACAO === "horizontal"){
			YAHOO.janelaBotoes.xp.panel = new YAHOO.widget.Panel(idconteudonovo, {zIndex:20000,height:40,width:i3GEO.barraDeBotoes.HORIZONTALW, fixedcenter: false, constraintoviewport: false, underlay:"none", close:i3GEO.barraDeBotoes.PERMITEFECHAR, visible:true, draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR, modal:false,iframe:false } );
		}
		else{
			if(this.AUTOALTURA === false || barraZoom === true || (elementos.length > numerobotoes))
			{YAHOO.janelaBotoes.xp.panel = new YAHOO.widget.Panel(idconteudonovo, {zIndex:20000,width:wj, fixedcenter: false, constraintoviewport: false, underlay:"none", close:i3GEO.barraDeBotoes.PERMITEFECHAR, visible:true, draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR, modal:false,iframe:false } );}
			else
			{YAHOO.janelaBotoes.xp.panel = new YAHOO.widget.Panel(idconteudonovo, {zIndex:20000,height:i3GEO.parametros.h - 4,width:wj, fixedcenter: false, constraintoviewport: false, underlay:"none", close:i3GEO.barraDeBotoes.PERMITEFECHAR, visible:true, draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR, modal:false,iframe:false } );}
		}
		if(this.SOICONES === true){
			Dom.setStyle(["i3geo_barra2","i3geo_barra1"],"borderWidth","0 0 0 0");
		}
		if((barraZoom === true) && i3GEO.Interface.ATUAL === "padrao")
		{i3GEO.navega.barraDeZoom.ativa();}
		YAHOO.janelaBotoes.xp.panel.render();
		YAHOO.janelaBotoes.xp.panel.moveTo(x,y);
		if($i("sobeferramentas")){
			$i("sobeferramentas").onclick = function(){
				elementos = $i(idconteudonovo+"_").getElementsByTagName("div");
				nelementos = elementos.length;
				if(elementos[0].style.display === "inline" && elementos[0].id === "")
				{return;}
				if(nelementos > 0){
					mostra = elementos[0];
					i = 0;
					do{
						if(elementos[i].style){
							if(elementos[i].style.display === "inline" && elementos[i].id === "")
							{break;}
							if(elementos[i].style.display === "none" && elementos[i].id === "")
							{mostra = elementos[i];}
						}
						i = i + 1;
					}
					while(i < nelementos);
					mostra.style.display="inline";
					//esconde o último botao
					i = nelementos + 1;
					mostra = elementos[i];
					do{
						if(elementos[i]){
							if(elementos[i].style){
								if(elementos[i].style.display === "inline")
								{mostra = elementos[i];break;}
							}
						}
						i = i - 1;
					}
					while(i >= 0);
					mostra.style.display="none";
				}
			};
		}
		if($i("desceferramentas")){
			$i("desceferramentas").onclick = function(){
				tipo = "inline";
				if($i(idconteudonovo+"_")){
					elementos = $i(idconteudonovo+"_").getElementsByTagName("div");
					if(elementos[elementos.length - 1].style.display === tipo)
					{return;}
					nelementos = elementos.length;
					if(nelementos > 0){
						//esconde o primeiro botao
						i = 0;
						do{
							e = elementos[i];
							if(e.style){
								if((e.style.display === "block") || (e.style.display === "inline") || (e.style.display === "")){
									if(e.id === "")
									{e.style.display="none";break;}
								}
							}
							i = i + 1;
						}
						while(i < nelementos);
						//mostra o último botao
						i = nelementos-1;
						var mostra = elementos[i];
						do{
							e = elementos[i];
							if(e.style){
								if(e.style.display === tipo)
								{break;}
								if(e.style.display === "none")
								{mostra = e;}
							}
							i = i - 1;
						}
						while(i >= 0);
						mostra.style.display=tipo;
					}
				}
			};
		}
		this.BARRAS.push(YAHOO.janelaBotoes.xp.panel);
		YAHOO.janelaBotoes.xp.panel.show();
		if(i3GEO.Interface.TABLET === true){
			YAHOO.janelaBotoes.xp.panel.moveTo((i3GEO.parametros.w / 2) - (i3GEO.barraDeBotoes.HORIZONTALW / 2),"");
		}
		//
		//menu de contexto
		//
		if(this.ATIVAMENUCONTEXTO){
			this.ativaMenuContexto(idconteudonovo);
		}
		Dom.replaceClass(idconteudonovo+"_h","hd2");
	},
	/*
	Function: ativaMenuContexto (depreciado na versão 4.5)

	Ativa o menu de contexto acionado com o botão direito do mouse

	Parametro:

	idbarra - {string} id da barra de botões onde o evento será ativado
	*/
	ativaMenuContexto: function(idbarra){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.ativaMenuContexto()");}
		var oFieldContextMenuItemData,oFieldContextMenu,onFieldMenuRender,id;
		function executar(a,b,c)
		{eval(c);}
		oFieldContextMenuItemData = [
			{ text: "&nbsp;<span class='container-close'></span>"},
			{ text: "Fechar barra", onclick: { fn: executar, obj: "i3GEO.barraDeBotoes.fecha('"+idbarra+"')" } },
			{ text: "Barra normal", onclick: { fn: executar, obj:"i3GEO.barraDeBotoes.AUTOALTURA=false;i3GEO.barraDeBotoes.PERMITEFECHAR=true;i3GEO.barraDeBotoes.PERMITEDESLOCAR=true;i3GEO.barraDeBotoes.recria('"+idbarra+"')" } },
			{ text: "Barra fixa", onclick: { fn: executar, obj:"i3GEO.barraDeBotoes.AUTOALTURA=true;i3GEO.barraDeBotoes.PERMITEFECHAR=false;i3GEO.barraDeBotoes.PERMITEDESLOCAR=false;i3GEO.barraDeBotoes.recria('"+idbarra+"')" } },
			{ text: "Remove transição", onclick: { fn: executar, obj:"i3GEO.barraDeBotoes.TRANSICAOSUAVE=false;" } },
			{ text: "Ativa transição", onclick: { fn: executar, obj:"i3GEO.barraDeBotoes.TRANSICAOSUAVE=true;" } }
		];
		oFieldContextMenu = new YAHOO.widget.ContextMenu(
			"contexto_"+idbarra,{
				trigger: idbarra,
				itemdata: oFieldContextMenuItemData,
				lazyload: true
			}
		);
		onFieldMenuRender = function(){
			eval("var id = 'contexto_"+idbarra+"'");
			$i(id).style.zIndex = 50000;
		};
		oFieldContextMenu.subscribe("render", onFieldMenuRender);
	},
	/*
	Function: reativa

	Reativa as barras de ferramentas já criadas

	Essa opção apenas aplica o método "show" aos objetos armazenados em i3GEO.barraDeBotoes.BARRAS

	Se a barra não existir previamente, nada irá contecer

	Parametro:

	indice {Integer} - índice do array BARRAS que guarda os objetos YAHOO com 
	as barras Se não for definido, todas as barras serão reativadas
	*/
	reativa: function(indice){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.reativa()");}
		var abre = function(){
				var i,
					n = i3GEO.barraDeBotoes.BARRAS.length;
				for(i=0;i<n;i+=1)
				{i3GEO.barraDeBotoes.BARRAS[i].show();}
			};
		try{
			if(arguments.length === 1)
			{i3GEO.barraDeBotoes.BARRAS[indice].show();}
			else{
				abre.call();
			}
		}
		catch(e){abre.call();}
	},
	/*
	Function: recria

	Recria uma barra de ferramentas já aberta aplicando os parâmetros de configuração definidos (variáveis)

	Parametro:

	id {String} - id da barra
	*/
	recria: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.recria()");}
		var n,temp,novoel,barraZoom,x,y,
			BARRAS = i3GEO.barraDeBotoes.BARRAS, 
			iu = i3GEO.util;
		i3GEO.barraDeBotoes.BARRAS = [];
		n = BARRAS.length;
		for(i=0;i<n;i+=1){
			if(BARRAS[i].id === id){
				//remove o menu de contexto
				iu.removeChild("contexto_"+id);
				if(!$i("barraTemporaria"+i)){
					novoel = document.createElement("div");
					novoel.id = "barraTemporaria"+i;
					document.body.appendChild(novoel);
				}
				novoel = $i("barraTemporaria"+i);
				novoel.innerHTML = $i(BARRAS[i].id+"_").innerHTML;
				
				//verifica se tem o slide de zoom
				barraZoom = false;
				temp = $i("vertMaisZoom");
				if(temp){
					temp = navm ? temp.parentNode : temp.parentNode.parentNode;
					if(temp.id === id)
					{barraZoom = true;}
				}
				x = parseInt($i(BARRAS[i].id+"_c").style.left,10);
				y = parseInt($i(BARRAS[i].id+"_c").style.top,10);
				if(i3GEO.barraDeBotoes.PERMITEFECHAR === true)
				{y = y-10;}
				BARRAS[i].destroy();
				i3GEO.barraDeBotoes.inicializaBarra(novoel.id,BARRAS[i].id,barraZoom,x,y);
			}
		}
		i3GEO.barraDeBotoes.ativaBotoes();
	},
	/*
	Function: fecha

	Fecha uma barra de ferramentas

	Parametro:

	id {String} - id que identifica a barra. Corresponde ao parâmetro idconteudonovo da função de inicialização das barras
	*/
	fecha: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.barraDeBotoes.fecha()");}
		var n = this.BARRAS.length;
		for(i=0;i<n;i+=1){
			if(this.BARRAS[i].id === id){
				$i(id+"_c").style.visibility = "hidden";
			}
		}
	},
	mostraJanela: function(objeto,mensagem){
		var divmensagem = $i("divMensagemBarraDeBotoes"),
			pos = YAHOO.util.Dom.getXY(objeto);
		if(this.AJUDA === false || $i("janelaMenTexto")){
			i3GEO.ajuda.mostraJanela(mensagem);
			i3GEO.barraDeBotoes.escondeJanelaAjuda();
			return;
		}
		if(i3GEO.Interface.ATUAL === "googleearth"){
			objeto.title = mensagem;
			return;
		}
		if(!divmensagem){
			divmensagem = document.createElement("div");
			divmensagem.id = "divMensagemBarraDeBotoes";
			divmensagem.style.border = "0px solid rgb(120 120 120)";
			divmensagem.style.position = "absolute";
			divmensagem.style.zIndex = 20000;
			if($i("i3geo"))
			{$i("i3geo").appendChild(divmensagem);}
			else
			{document.body.appendChild(divmensagem);}
			if(this.TIPOAJUDA === "horizontal")
			{divmensagem.innerHTML = "<table style='z-index:20000' ><tr><td id='imgMensagemBarraDeBotoes' style='background:none;padding-top:2px;padding-right:3px;vertical-align:top'><img src='"+$im("left.png")+"' ></td><td style='text-align:left;border-left:1px solid rgb(210,210,210)'><span style='text-align:right;cursor:pointer;color:blue;' onclick='javascript:i3GEO.util.insereCookie(\"botoesAjuda\",\"nao\");i3GEO.barraDeBotoes.AJUDA = false;'>fecha</span><br><div style='vertical-align:middle;text-align:left;width:250px;border: 0px solid black;border-left:1px;' id='divMensagemBarraDeBotoesCorpo'></div></td></tr></table>";}
			if(this.TIPOAJUDA === "vertical")
			{divmensagem.innerHTML = "<table style='z-index:20000' ><tr><td id='imgMensagemBarraDeBotoes' style='background:none;padding-top:2px;padding-right:3px;vertical-align:top'><img src='"+$im("top.png")+"' ></td><td style='text-align:left;border-left:1px solid rgb(210,210,210)'><span style='text-align:right;cursor:pointer;color:blue;' onclick='javascript:i3GEO.util.insereCookie(\"botoesAjuda\",\"nao\");i3GEO.barraDeBotoes.AJUDA = false;'>fecha</span><br><div style='vertical-align:middle;text-align:left;width:250px;border: 0px solid black;border-left:1px;' id='divMensagemBarraDeBotoesCorpo'></div></td></tr></table>";}
		}
		if(mensagem !== ""){
			if(this.TIPOAJUDA === "horizontal"){
				divmensagem.style.left = parseInt(YAHOO.util.Dom.getStyle(objeto,"width"),10)+pos[0]+10+"px";
				divmensagem.style.top = pos[1]-2+(parseInt(YAHOO.util.Dom.getStyle(objeto,"height"),10) / 2)+"px";
			}
			if(this.TIPOAJUDA === "vertical"){
				divmensagem.style.left = (parseInt(YAHOO.util.Dom.getStyle(objeto,"width"),10)/2)+pos[0]-5+"px";
				divmensagem.style.top = pos[1]+5+parseInt(YAHOO.util.Dom.getStyle(objeto,"height"),10)+"px";
			}
			$i("divMensagemBarraDeBotoesCorpo").innerHTML = mensagem;
			divmensagem.style.display="block";
			try{clearTimeout(timeAjudaBotoes);}catch(e){}
			timeAjudaBotoes = setTimeout(function(){i3GEO.barraDeBotoes.escondeJanelaAjuda();},3000);
		}
	},
	escondeJanelaAjuda:function(){
		YAHOO.util.Dom.setStyle("divMensagemBarraDeBotoes","display","none");
		try
		{clearTimeout(timeAjudaBotoes);}
		catch(e){}
	}
};
//YAHOO.log("carregou classe barradebotoes", "Classes i3geo");