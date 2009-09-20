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
	i3GEO = [];
}
/*
Classe: i3GEO.barradebotoes

Constrói a barra de botões flutuante

Veja também classe_interface.js (i3GEO.Interface) que possuí parâmetros que permitem ajustar a posição das barras no mapa
*/
i3GEO.barraDeBotoes = {
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
	Propriedade: LISTABOTOES
	
	Objeto com a lista de botões.
	
	Por default utiliza os botoes definidos em i3GEO.configura.funcoesBotoes.botoes
	
	Tipo:
	{JSON}
	*/
	LISTABOTOES: i3GEO.configura.funcoesBotoes.botoes,
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
	Function: ativaIcone
	
	Altera as bordas de um ícone aplicando um efeito de ícone realçado.
	
	Todos os demais ícones definidos em LISTABOTOES e que tiverem o tipo = "dinamico"
	serão processados para alterar as bordas dando o efeito de não ativo.
	
	Parametro:
	
	icone {String} - id do icone que será ativado. Esse id é o mesmo definido em LISTABOTOES
	*/
	ativaIcone: function(icone){
		var estilo,temp,ist,cor,ko;
		i3GEO.barraDeBotoes.BOTAOCLICADO = icone;
		ko = i3GEO.barraDeBotoes.LISTABOTOES.length-1;
		if(i3GEO.barraDeBotoes.COMPORTAMENTO == "padrao"){
			if(ko >= 0){
				do{
					temp = $i(i3GEO.barraDeBotoes.LISTABOTOES[ko].iddiv);
					if (i3GEO.barraDeBotoes.LISTABOTOES[ko].tipo=="dinamico" && temp){
						ist = temp.style;
						ist.borderWidth="1px";
						ist.borderColor='white';
						ist.borderLeftColor='rgb(50,50,50)';
						ist.borderBottomColor='rgb(50,50,50)';
					}
				}
				while(ko--);
			}
			//ativa o icone
			if($i(icone)){
				estilo = $i(icone).style;
				if(i3GEO.barraDeBotoes.SOICONES === false){
					estilo.borderColor='white';
					estilo.borderWidth="1px";
				}
			}
		}
		if(i3GEO.barraDeBotoes.COMPORTAMENTO == "destacado"){
			if(ko >= 0){
				do{
					temp = $i(i3GEO.barraDeBotoes.LISTABOTOES[ko].iddiv);
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
				if(i3GEO.barraDeBotoes.SOICONES === false){
					estilo.borderColor='black';
					estilo.borderWidth="1px";
				}
			}
		}
		if(i3GEO.barraDeBotoes.COMPORTAMENTO == "laranja" || i3GEO.barraDeBotoes.COMPORTAMENTO == "vermelho" || i3GEO.barraDeBotoes.COMPORTAMENTO == "cinza"){
			if(ko >= 0){
				do{
					temp = $i(i3GEO.barraDeBotoes.LISTABOTOES[ko].iddiv);
					if (temp){
						ist = temp.style;
						if(i3GEO.barraDeBotoes.SOICONES === false){
							ist.borderWidth="1px";
							ist.borderColor='white';
							ist.backgroundColor='white';
						}
						else{ist.backgroundColor='';}
					}
				}
				while(ko--);
			}
			if(i3GEO.barraDeBotoes.COMPORTAMENTO == "laranja"){cor = "orange";}
			if(i3GEO.barraDeBotoes.COMPORTAMENTO == "vermelho"){cor = "red";}
			if(i3GEO.barraDeBotoes.COMPORTAMENTO == "cinza"){cor = "gray";}
			//ativa o icone
			if($i(icone)){
				estilo = $i(icone).style;
				if(i3GEO.barraDeBotoes.SOICONES === false){
					estilo.borderColor='black';
					estilo.borderWidth="1px";
				}
				backgroundColor=cor;
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
		var l,b;
		if(arguments.length === 0)
		{padrao = i3GEO.barraDeBotoes.BOTAOPADRAO;}
		i3GEO.barraDeBotoes.BOTAOCLICADO = padrao;
		l = i3GEO.barraDeBotoes.LISTABOTOES;
		b = l.length-1;
		if (b >= 0){
			do{
				if ($i(l[b].iddiv)){
					if(l[b].conteudo)
					{eval('$i(l[b].iddiv).innerHTML = "'+l[b].conteudo+'"');}
					if(l[b].dica){
						eval('$i("'+l[b].iddiv+'").onmouseover = function(){i3GEO.ajuda.mostraJanela("'+l[b].dica+'","");}');
						eval('$i("'+l[b].iddiv+'").onmouseout = function(){i3GEO.ajuda.mostraJanela("");};');
					}
					if(l[b].funcaoonclick){
						$i(l[b].iddiv).onclick = l[b].funcaoonclick;
						if(l[b].iddiv == padrao)
						{l[b].funcaoonclick();}
					}
					if(l[b].constroiconteudo)
					{eval(l[b].constroiconteudo);}
				}
			}
			while (b--);
		}
	},
	/*
	Function: inicializaBarra
	
	Inicializa a barra de botões
	
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
	*/
	inicializaBarra:function(idconteudo,idconteudonovo,barraZoom,x,y){
		var tipo,mostra,numerobotoes,i,temp,elementos,nelementos,e,wj,recuo,novoel,alturadisponivel;
		wj = "36px";
		recuo = "0px";
		novoel = document.createElement("div");
		novoel.id = idconteudonovo;
		novoel.style.display="block";
		if(i3GEO.barraDeBotoes.SOICONES === false){
			novoel.style.border="1px solid gray";
			novoel.style.background="white";
		}
		if(i3GEO.barraDeBotoes.TRANSICAOSUAVE){
			if (navm){novoel.style.filter='alpha(opacity='+i3GEO.barraDeBotoes.OPACIDADE+')';}
			else{novoel.style.opacity= i3GEO.barraDeBotoes.OPACIDADE / 100;}
		}
		else{
			if (navm){novoel.style.filter='alpha(opacity=90)';}
			else{novoel.style.opacity= 0.85;}
		}
		temp = "";
		if (barraZoom === true)
		{temp += i3GEO.navega.barraDeZoom.cria();}
		temp += '<div id="'+idconteudonovo+'_" style="left:'+recuo+';top:-6px;"  ></div>';
		novoel.innerHTML = temp;
		novoel.onmouseover = function(){
			//objposicaocursor.imgx = 0;
			if($i("i3geo_rosa"))
			{$i("i3geo_rosa").style.display="none";}
			if(i3GEO.barraDeBotoes.OPACIDADE){
				if (navm)
				{novoel.style.filter='alpha(opacity=90)';}
				else
				{novoel.style.opacity = 0.85;}
			}
		};
		novoel.onmouseout = function(){
			if(i3GEO.barraDeBotoes.TRANSICAOSUAVE){
				if (navm)
				{novoel.style.filter='alpha(opacity='+i3GEO.barraDeBotoes.OPACIDADE+')';}
				else
				{novoel.style.opacity= i3GEO.barraDeBotoes.OPACIDADE / 100;}
			}		
		};
		document.body.appendChild(novoel);
		if(i3GEO.barraDeBotoes.ATIVAMENUCONTEXTO)
		{i3GEO.util.mudaCursor(i3GEO.configura.cursores,"contexto",idconteudonovo,i3GEO.configura.locaplic);}
		//copia os botoes do HTML para a janela
		if ($i(idconteudo))
		{
			$i(idconteudonovo+"_").innerHTML = $i(idconteudo).innerHTML;
			$i(idconteudo).innerHTML = "";
			//faz o cálculo do número de botões que devem ficar visíveis em função do tamanho da barra
			if(i3GEO.barraDeBotoes.AUTOALTURA){
				elementos = $i(idconteudonovo+"_").getElementsByTagName("img");
				if(elementos[0].id == "sobeferramentas"){
					try{
						elementos = $i(idconteudonovo+"_").getElementsByTagName("div");
						alturadisponivel = i3GEO.parametros.h - 4;
						numerobotoes = parseInt(alturadisponivel / 30,10);
						nelementos = elementos.length;
						i = 0;
						do{
							elementos[i].style.display = "none";
							i = i + 1;
						}
						while(i < nelementos);
						i = 0;
						do{
							elementos[i].style.display = "inline";
							i = i + 1;
						}
						while(i < numerobotoes);
					}catch(e){}
					//alert(i+" "+numerobotoes)
					if(i <= numerobotoes){
						if($i("sobeferramentas")){$i("sobeferramentas").style.display="none";}
						if($i("desceferramentas")){$i("desceferramentas").style.display="none";}
					}
				}		
			}
		}
		YAHOO.namespace("janelaBotoes.xp");
		if(i3GEO.barraDeBotoes.AUTOALTURA === false || barraZoom === true )
		{YAHOO.janelaBotoes.xp.panel = new YAHOO.widget.Panel(idconteudonovo, {width:wj, fixedcenter: false, constraintoviewport: false, underlay:"none", close:i3GEO.barraDeBotoes.PERMITEFECHAR, visible:true, draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR, modal:false,iframe:false } );}
		else
		{YAHOO.janelaBotoes.xp.panel = new YAHOO.widget.Panel(idconteudonovo, {height:i3GEO.parametros.h - 4,width:wj, fixedcenter: false, constraintoviewport: false, underlay:"none", close:i3GEO.barraDeBotoes.PERMITEFECHAR, visible:true, draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR, modal:false,iframe:false } );}
		
		if(i3GEO.barraDeBotoes.SOICONES === true){
			temp = $i("i3geo_barra2");
			if(temp)
			{temp.style.borderWidth="0 0 0 0";}
			temp = $i("i3geo_barra1");
			if(temp)
			{temp.style.borderWidth="0 0 0 0";}
		}
		if((barraZoom === true) && i3GEO.Interface.ATUAL == "padrao")
		{i3GEO.navega.barraDeZoom.ativa();}
		YAHOO.janelaBotoes.xp.panel.render();
		if(i3GEO.barraDeBotoes.AUTOALTURA === true){
			y = y - i3GEO.Interface.BARRABOTOESTOP + 2;
			x = x - 3;
		}
		YAHOO.janelaBotoes.xp.panel.moveTo(x,y);
		if($i("sobeferramentas")){
			$i("sobeferramentas").onclick = function(){
				elementos = $i(idconteudonovo+"_").getElementsByTagName("div");
				nelementos = elementos.length;
				if(elementos[0].style.display == "inline" && elementos[0].id === "")
				{return;}
				if(elementos[1].style.display == "inline" && elementos[1].id === "")
				{return;}
				if(nelementos > 0){
					mostra = elementos[0];
					i = 0;
					do{
						if(elementos[i].style){
							if(elementos[i].style.display == "inline" && elementos[i].id === "")
							{break;}
							if(elementos[i].style.display == "none" && elementos[i].id === "")
							{mostra = elementos[i];}
						}
						i = i + 1;
					}
					while(i < nelementos);
					mostra.style.display="inline";
					//esconde o último botao
					i = nelementos - 1;
					mostra = elementos[i];
					do{
						if(elementos[i].style){
							if(elementos[i].style.display == "inline")
							{mostra = elementos[i];break;}
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
					if(elementos[elementos.length - 1].style.display == tipo)
					{return;}
					nelementos = elementos.length;
					if(nelementos > 0){
						//esconde o primeiro botao
						i = 0;
						do{
							e = elementos[i];
							if(e.style){
								if((e.style.display == "block") || (e.style.display == "inline") || (e.style.display === "")){
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
								if(e.style.display == tipo)
								{break;}
								if(e.style.display == "none")
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
		i3GEO.barraDeBotoes.BARRAS.push(YAHOO.janelaBotoes.xp.panel);
		YAHOO.janelaBotoes.xp.panel.show();
		//
		//menu de contexto
		//
		if(i3GEO.barraDeBotoes.ATIVAMENUCONTEXTO){
			i3GEO.barraDeBotoes.ativaMenuContexto(idconteudonovo);
		}	
		if($i(idconteudonovo+"_h"))
		{$i(idconteudonovo+"_h").className = "hd2";}
	},
	/*
	Function: ativaMenuContexto
	
	Ativa o menu de contexto acionado com o botão direito do mouse
	
	Parametro:
	
	idbarra - {string} id da barra de botões onde o evento será ativado
	*/
	ativaMenuContexto: function(idbarra){
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
		var n,i;
		if(arguments.length == 1)
		{i3GEO.barraDeBotoes.BARRAS[indice].show();}
		else{
			n = i3GEO.barraDeBotoes.BARRAS.length;
			for(i=0;i<n;i++)
			{i3GEO.barraDeBotoes.BARRAS[i].show();}
		}
	},
	/*
	Function: recria
	
	Recria uma barra de ferramentas já aberta aplicando os parâmetros de configuração definidos (variáveis)
	
	Parametro:
	
	id {String} - id da barra
	*/
	recria: function(id){
		var n,temp,novoel,barraZoom,x,y;
		n = i3GEO.barraDeBotoes.BARRAS.length;
		for(i=0;i<n;i++){
			if(i3GEO.barraDeBotoes.BARRAS[i].id == id){
				//remove o menu de contexto
				temp = $i("contexto_"+id);
				if(temp){
					temp.parentNode.removeChild(temp);
				}
				novoel = document.createElement("div");
				novoel.id = "barraTemporaria"+i;
				novoel.innerHTML = $i(i3GEO.barraDeBotoes.BARRAS[i].id+"_").innerHTML;
				document.body.appendChild(novoel);
				//verifica se tem o slide de zoom
				barraZoom = false;
				temp = $i("vertMaisZoom");
				if(temp){
					if(navm)
					{temp = temp.parentNode;}
					else
					{temp = temp.parentNode.parentNode;}
					if(temp.id == id)
					{barraZoom = true;}
				}
				x = parseInt($i(i3GEO.barraDeBotoes.BARRAS[i].id+"_c").style.left,10);
				y = parseInt($i(i3GEO.Interface.IDCORPO).style.top,10)+10;//parseInt($i(i3GEO.barraDeBotoes.BARRAS[i].id+"_c").style.top);
				i3GEO.barraDeBotoes.BARRAS[i].destroy();
				i3GEO.barraDeBotoes.inicializaBarra(novoel.id,i3GEO.barraDeBotoes.BARRAS[i].id+"x",barraZoom,x,y);
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
		var n = i3GEO.barraDeBotoes.BARRAS.length;
		for(i=0;i<n;i++){
			if(i3GEO.barraDeBotoes.BARRAS[i].id == id){
				$i(id+"_c").style.visibility = "hidden";
			}
		}	
	}
};
//YAHOO.log("carregou classe barradebotoes", "Classes i3geo");