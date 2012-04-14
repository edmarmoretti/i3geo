/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Gadgets (objetos marginais do mapa)

Arquivo: i3geo/classesjs/classe_gadgets.js

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
Classe: i3GEO.gadgets

Inclui elementos especiais no mapa

Os elementos são opcionais e adicionam funcionalidades ao mapa.

Outras funcionalidades são definidas em botões. Veja <classe_configura.js>
*/
i3GEO.gadgets = {
	/*
	Propriedade: PARAMETROS

	Parametros de inicialização dos gadgets.

	Essa variável define os parâmetros individuais de cada gadget e o ID do elemento HTML onde
	o gadget será incluído (parâmetro "idhtml").
	
	Cada tipo de gadget pode ter parâmetros específicos, descritos a seguir.
	
	i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos = true|false //indica que os serviços de buscas externos ao i3Geo serão ou não mostrados
	i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa =  true|false //indica se a busca será feita ou não nas camadas existentes no mapa
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda = 0 //número de pixels que indica o quanto o menu será deslocado para a esquerda
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.finaliza = "" //nome de uma função que será executada quando a construção do menu tiver terminado
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.parametrosYUI = {} //objeto contendo parâmetros adicionais da API YUI para menus
	
	Você pode acessar os parâmetros da seguinte forma:

	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda = 400;

	Para evitar o funcionamento de um gadget experimente utilizar o seguinte exemplo:

	i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml = "";

	Default:

	i3GEO.gadgets.PARAMETROS = {

		"mostraInserirKml":

		{idhtml:"inserirKml"},

		"mostraEscalaNumerica":

		{idhtml:"escala"},

		"mostraEscalaGrafica":

		{idhtml:"escalaGrafica"},

		"mostraBuscaRapida":

		{idhtml:"buscaRapida",servicosexternos:true,temasmapa:false},

		"mostraVisual":

		{idhtml:"visual"},

		"mostraHistoricoZoom":

		{idhtml:"historicozoom"},

		"mostraMenuSuspenso":

		{idhtml:"menus",deslocaEsquerda:0,finaliza:"",parametrosYUI={}},
		
		"mostraMenuLista":
		
		{idhtml:"menuLista"},

		"mostraVersao":

		{idhtml:"versaoi3geo"},
		
		"mostraEmail":
		
		{idhtml:"emailInstituicao"}
	}

	Tipo:
	{JSON}
	*/
	PARAMETROS: {
		"mostraInserirKml":
		{idhtml:"inserirKml"},
		"mostraEscalaNumerica":
		{idhtml:"escala"},
		"mostraEscalaGrafica":
		{idhtml:"escalaGrafica"},
		"mostraBuscaRapida":
		{idhtml:"buscaRapida",servicosexternos:true,temasmapa:false},
		"mostraVisual":
		{idhtml:""},
		"mostraHistoricoZoom":
		{idhtml:"historicozoom"},
		"mostraMenuSuspenso":{
			idhtml:"menus",
			deslocaEsquerda:0,
			parametrosYUI: {iframe:false,autosubmenudisplay: false, showdelay: 200, hidedelay: 500, lazyload: false}
		},
		"mostraMenuLista":
		{idhtml:"menuLista"},
		"mostraVersao":
		{idhtml:"versaoi3geo"},
		"mostraEmail":
		{idhtml:"emailInstituicao"}
	},
	/*
	Function: mostraEmail

	Mostra o e-mail armazenado na variável i3GEO.parametros.emailInstituicao

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraEmail: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraEmail()");}
		if(arguments.length === 0 || id === "")
		{id = i3GEO.gadgets.PARAMETROS.mostraEmail.idhtml;}
		else
		{i3GEO.gadgets.PARAMETROS.mostraEmail.idhtml = id;}
		i3GEO.util.defineValor(id,"innerHTML",i3GEO.parametros.emailInstituicao);
	},	
	/*
	Function: mostraVersao

	Mostra a versão atual do i3Geo armazenada na variável i3GEO.parametros.mensageminicial

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraVersao: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraVersão()");}
		if(arguments.length === 0 || id === "")
		{id = i3GEO.gadgets.PARAMETROS.mostraVersao.idhtml;}
		else
		{i3GEO.gadgets.PARAMETROS.mostraVersao.idhtml = id;}
		i3GEO.util.defineValor(id,"innerHTML",i3GEO.parametros.mensageminicia);
	},
	/*
	Function: mostraCoordenadasUTM (depreciado utilize i3GEO.coordenadas)
	*/
	mostraCoordenadasUTM: function(id){
		try{
			i3GEO.coordenadas.mostraCoordenadasUTM.idhtml = i3GEO.gadgets.mostraCoordenadasUTM.idhtml;
		}
		catch(e){}
		i3GEO.coordenadas.mostraCoordenadasUTM(id);
	},
	/*
	Function: mostraCoordenadasGEO (depreciado utilize i3GEO.coordenadas)
	*/
	mostraCoordenadasGEO: function(id){
		try{
			i3GEO.coordenadas.mostraCoordenadasGEO.idhtml = i3GEO.gadgets.mostraCoordenadasGEO.idhtml;
		}
		catch(e){}
		i3GEO.coordenadas.mostraCoordenadasGEO(id);
	},
	/*
	Function: mostraInserirKml

	Mostra no mapa a a opção para inserir kml.

	Essa opção só funciona com a API do Google carregada

	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
	*/
	mostraInserirKml: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraInserirKml()");}
		var i,ins,temp;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml;}
		if($i(id)){
			if(!$i("i3geo_urlkml")){
				i = $inputText(id,"290","i3geo_urlkml","kml url","40","");
				ins = "<table><tr><td>Kml: "+i;
				temp = 'i3GEO.Interface.adicionaKml();';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				$i(id).innerHTML = ins;
			}
		}
	},
	/*
	Function: mostraEscalaNumerica

	Mostra no mapa a escala numérica.

	A escala numérica pode ser alterada pelo usuário digitando-se a nova escala.

	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraEscalaNumerica: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraEscalaNumerica()");}
		var i,ins,temp,onde;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;}
		onde = $i(id);
		if(onde){
			if(onde.style.display == "none")
			{onde.style.display = "block";}
			if(!$i("i3geo_escalanum")){
				i = "<form id='i3GEOescalanumForm' >"+$inputText(id,"100","i3geo_escalanum",$trad("d10"),"10",parseInt(i3GEO.parametros.mapscale,10))+"</form>";
				ins = "<table><tr><td>"+i;
				temp = 'var nova = document.getElementById("i3geo_escalanum").value;';
				temp += 'i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,nova);';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				onde.innerHTML = ins;
				$i("i3GEOescalanumForm").onsubmit = function(){
					i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,document.getElementById("i3geo_escalanum").value);
					return false;				
				};
			}
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.gadgets.atualizaEscalaNumerica()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.gadgets.atualizaEscalaNumerica()");}
		}
	},
	atualizaEscalaNumerica: function(escala){
		var e = $i("i3geo_escalanum");  
		if(!e){
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.gadgets.atualizaEscalaNumerica()");
			return;
		}
		if(arguments.length === 1)
		{e.value = escala;}
		else{
			if(i3GEO.parametros.mapscale !== ""){
				e.value = parseInt(i3GEO.parametros.mapscale,10);
			}
			else{
				e.value = 0;
			}
		}
	},
	
	/*
	Function: mostraEscalaGrafica

	Mostra no mapa a escala grafica como um elemento fora do mapa.

	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS(escala)

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraEscalaGrafica: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraEscalaGrafica()");}
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraEscalaGrafica.idhtml;}
		var e,temp,ins;
		if($i(id)){
			atualizaEscalaGrafica = function(){
				e = $i("imagemEscalaGrafica");  
				if(!e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaGrafica()");
					return;
				}
				temp = function(retorno){
					eval(retorno.data);
					$i("imagemEscalaGrafica").src = scaimagem;
				};
				i3GEO.php.escalagrafica(temp);
			};
			if(!$i("imagemEscalaGrafica")){
				ins = "<img class='menuarrow' src=\""+i3GEO.configura.locaplic+"/imagens/branco.gif\" title='op&ccedil;&otilde;es' onclick='i3GEO.mapa.dialogo.opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src='' />";
				$i(id).innerHTML = ins;
			}
			atualizaEscalaGrafica();
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaEscalaGrafica()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("atualizaEscalaGrafica()");}
		}
	},
	/*
	Function: mostraBuscaRapida

	Mostra a opção de busca rápida de lugares por palavra digitada.

	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (buscaRapida)
	
	Onde a busca será feita é controlado pela variável i3GEO.gadgets.PARAMETROS.mostraBuscaRapida
	
	Veja: ferramentas/<buscarapida>

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraBuscaRapida: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraBuscaRapida()");}
		var i,ins,temp,fbusca;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.idhtml;}
		i3GEO.gadgets.mostraBuscaRapida.id = id;
		if($i(id)){
			//depreciado na versão 4.5
			i3geo_buscaRapida = function(){
				alert("i3geo_buscaRapida foi depreciada");
			};
			i = "<form id=i3GEObotaoFormBuscaRapida"+id+" >"+$inputText(id,"256","valorBuscaRapida"+id,"Município, cidade, UC, endereço...","20",$trad("o2"))+"</form>";
			ins = "<table><tr><td><a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=71' >&nbsp;&nbsp;&nbsp;</a></td><td>"+i+"</td>";
			ins += "<td><img src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("p13")+"' class='ticPropriedades2' id=i3GEObotaoPropriedadesBuscaRapida"+id+" /></td>";
			ins += "<td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' id=i3GEObotaoBuscaRapida"+id+" /></td></tr></table>";
			temp = $i(id);
			if(temp){
				fbusca = function(){
					if(i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos === false && i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa === false)
					{alert("Escolha um tipo de busca nas propriedades");return;}
					if ($i("valorBuscaRapida"+id).value === "")
					{alert("Digite uma palavra para busca!");return;}
					i3GEO.janela.cria("300px","280px",i3GEO.configura.locaplic+"/ferramentas/buscarapida/index.htm","","","Busca rapida");
					return false;
				};
				temp.innerHTML = ins;
				$i("i3GEObotaoBuscaRapida"+id).onclick = fbusca;
				$i("i3GEObotaoFormBuscaRapida"+id).onsubmit = fbusca;
				$i("i3GEObotaoPropriedadesBuscaRapida"+id).onclick = function(){
					var ins,
						interno = "",
						externo = "";
					i3GEO.janela.cria("300px","150px","","","","Propriedades","i3GEOpropriedadesBuscaRapida"+id);
					if(i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos)
					{externo = "checked";}
					if(i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa)
					{interno = "checked";}
					ins = "<p class=paragrafo >Onde será feita a busca:</p>" +
						"<table class=lista3 >" +
						"<tr><td><input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos = this.checked' type=checkbox "+externo+" ></td><td>Serviços de busca externos (Google e MMA)</td></tr>" +
						"<tr><td><input style=cursor:pointer onclick='i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa = this.checked' type=checkbox "+interno+" ></td><td>Temas existentes no mapa</td></tr>" +
						"</table><br>" +
						"<p class=paragrafo >Apenas os temas especialmente configurados pelo administrador do i3Geo podem receber operações de busca.</p>";
					$i("i3GEOpropriedadesBuscaRapida"+id+"_corpo").innerHTML = ins;
				};	
			}
		}
	},
	/*
	Function: mostraHistoricoZoom

	Mostra na barra de zoom os ícones que controlam a visualização do histórico da navegação sobre o mapa

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraHistoricoZoom: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraHistoricoZoom()");}
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraHistoricoZoom.idhtml;}
		if($i(id)){
			marcadorZoom = "";
			var ins = "<table style='text-align:center;position:relative;left:";
			if(navm){ins += "0px;'>";}
			else
			{ins += "6px;'>";}
			ins += "<tr><td><img  id='i3geo_zoomanterior' class='zoomAnterior' title='anterior' src='"+i3GEO.util.$im("branco.gif")+"'  /></td>";
			ins += "<td>&nbsp;</td>";
			ins += "<td><img  id='i3geo_zoomproximo' class='zoomProximo' title='proximo' src='"+i3GEO.util.$im("branco.gif")+"'  /></td>";
			ins += "</tr></table>";
			$i(id).innerHTML = ins;
		}
	},
	/*
	Classe: i3GEO.gadgets.visual (depreciado)

	Gera os ícones e controla as opções de modificação do visual do mapa.

	O visual consiste na definição dos ícones utilizados no mapa. O visual pode
	ser modificado na inicialização ou então escolhido pelo usuário.

	Os visuais disponíveis são definidos no servidor e consistem em diretórios localizados
	em i3geo/imagens/visual. A lista de visuais disponíveis é obtida na inicialização do i3geo.

	Os ícones para mudança do visual são incluídos no elemento HTML definido em
	i3geo.gadgets.PARAMETROS.visual
	*/
	visual: {
		/*
		Function: inicia (depreciado)

		Constrói os ícones de escolha do visual.

		Parametro:

		id {String} - id do elemento que receberá os ícones (opcional)
		*/
		inicia: function(id){
			alert("A i3GEO.gadgets.visual foi depreciado");
		},
		/*
		Function: troca (depreciado)

		Troca o visual atual. A lista de visuais disponíveis é obtida em i3GEO.parametros.listavisual

		Parametro:

		visual {String} - nome do visual que será utilizado.
		*/
		troca: function(visual){
			alert("A i3GEO.gadgets.visual foi depreciado");
		}
	},
	/*
	Function: mostraMenuSuspenso

	Mostra o menu suspenso com opções extras de análise, ajuda, etc

	Paradefinir os ícones existentes nos elementos principais do menu, edite o arquivo i3geo/css/botoes2.css e acrescente
	o estilo desejado. Utilize # para se referenciar ao elemento, cujo identificador é composto por "menu"+chave, exemplo #menuinterface
	ou #menuajuda
	
	O objeto YAHOO.widget.MenuBar resultante pode ser obtido na variável i3GEOoMenuBar
	
	i3GEOoMenuBar pode ser manipulado com os métodos da biblioteca YUI, por exemplo,
	i3GEOoMenuBar.getMenuItem("omenudataInterface1").cfg.setProperty("text", "zzzzzz");
	i3GEOoMenuBar.getMenuItem("omenudataInterface1").destroy();
	
	Para executar uma operação após o menu ser montado, utilize a propriedade
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.finaliza, por exemplo (a string é executada por meio da função eval do javascript)
	
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.finaliza = 'i3GEOoMenuBar.getMenuItem("omenudataInterface1").cfg.setProperty("text", " ");'

	O conteúdo do menu é baseado na variável i3GEO.configura.oMenuData

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraMenuSuspenso: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraMenuSuspenso()");}
		var objid,n,i,estilo,t,onMenuBarBeforeRender,temp,ifr,i3GEOoMenuBarLocal,
			ms = i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso,
			confm = i3GEO.configura.oMenuData,
			ins = "",
			alinhamento = "";

		if(arguments.length === 0)
		{id = ms.idhtml;}
		else
		{ms.idhtml = id;}
		objid = $i(id);
		if(!objid)
		{return;}
		//cria o menu se ainda não existir
		if(objid && objid.innerHTML === ""){
			i3GEOoMenuBar = YAHOO.widget.MenuManager;
			if(objid){
				objid.className="yuimenubar";
				temp = $i("contemMenu");
				if(temp){
					temp.className="yui-navset";
				}
				if(ms.deslocaEsquerda){
					alinhamento = "left:"+ms.deslocaEsquerda*-1+"px;";
				}
				//ajusta a altura caso não tenha sido especificado no HTML
				if(!objid.style.height || parseInt(objid.style.height,10) === 0)
				{objid.style.height = "21px";}
				else{
					if(!temp.style.height || parseInt(temp.style.height) === 0)
					{temp.style.height = "21px";}
				}
				ins += '<div class="bd" style="top:0px;'+alinhamento+'display:block;align:right;border: 0px solid white;z-index:6000;line-height:1.4" >' +
					'<ul class="first-of-type" style="display:block;border:0px solid white;top:10px;">';
				n = confm.menu.length;
				estilo = "padding-bottom:3px;top:0px;border: 0px solid white;";
				for(i = 0;i < n;i += 1){
					t = "";
					if(confm.menu[i].target)
					{t = "target="+confm.menu[i].target;}
					if(confm.submenus[confm.menu[i].id].length > 0)
					{ins += '<li class="yuimenubaritem" style="padding-top:2px;"><a style="'+estilo+'" href="#" class="yuimenubaritemlabel" '+t+'id="menu'+confm.menu[i].id+'" >&nbsp;'+confm.menu[i].nome+'</a></li>';}
				}
				ins += '</ul>'; 
				ins += '</div>';
				objid.innerHTML=ins;
				if(i3GEO.Interface.ATUAL === "googleearth")
				{i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.parametrosYUI.iframe = true;}
				i3GEOoMenuBarLocal = new YAHOO.widget.MenuBar(id,i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.parametrosYUI);
				onMenuBarBeforeRender = function (p_sType, p_sArgs){
					var nomeMenu = "",nomeSub,
						subs = i3GEO.configura.oMenuData.submenus,
						conta = 0;
					for(nomeMenu in subs){
						if($i("menu"+nomeMenu)){
							nomeSub = subs[nomeMenu];
							if(nomeSub !== ""){
								i3GEOoMenuBarLocal.getItem(conta).cfg.setProperty(
									'submenu',
									{
										id:nomeMenu,
										itemdata: nomeSub
									}
								);
							}
							conta += 1;
						}
					}
				};
				i3GEOoMenuBar.addMenu(i3GEOoMenuBarLocal);
				i3GEOoMenuBarLocal.beforeRenderEvent.subscribe(onMenuBarBeforeRender);
				i3GEOoMenuBarLocal.render();
			}
		}
		//
		//marca o tipo de interface em uso
		//
		temp = ["omenudataInterface1","omenudataInterface2","omenudataInterface3","omenudataInterface4","omenudataInterface5"];
		n = temp.length;
		while(n > 0){
			n -= 1;
			i = i3GEOoMenuBar.getMenuItem(temp[n]);
			if(i)
			{i.cfg.setProperty("checked", false);}
		}
		try{
			temp = "";
			switch(i3GEO.Interface.ATUAL){
				case "openlayers":
					temp = "omenudataInterface2";
					break;
				case "googlemaps":
					temp = "omenudataInterface4";
					break;
				case "googleearth":
					temp = "omenudataInterface5";
					break;
			}
			if(temp != "" && $i(temp)){
				i3GEOoMenuBar.getMenuItem(temp).cfg.setProperty("checked", true);
			}			
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.warning("i3GEO.gadgets.mostraMenuSuspenso() "+ e);}
		}
		//
		//desabilita opções em interfaces específicas
		//
		temp = ["omenudataFerramentas7b","omenudataArquivos3","omenudataJanelas1","omenudataJanelas3","omenudataFerramentas2a"];
		n = temp.length;
		while(n > 0){
			n -= 1;
			i = i3GEOoMenuBar.getMenuItem(temp[n]);
			if(i)
			{i.cfg.setProperty("disabled", false);}
		}
		try{
			temp = [];
			switch(i3GEO.Interface.ATUAL){
				case "openlayers":
					temp = ["omenudataArquivos3","omenudataJanelas1"];
					break;
				case "googlemaps":
					temp = ["omenudataArquivos3","omenudataJanelas1","omenudataJanelas3"];
					break;
				case "googleearth":
					temp = ["omenudataFerramentas7b","omenudataArquivos3","omenudataJanelas3","omenudataFerramentas2a"];
					break;
			};
			n = temp.length;
			while(n > 0){
				n -= 1;
				i = i3GEOoMenuBar.getMenuItem(temp[n]);
				if(i)
				{i.cfg.setProperty("disabled", true);}
			}
		}
		catch(e){}
		//
		//corrige problemas de estilo
		//
		temp = objid.style;
		temp.backgroundPosition = "0px -1px";
		temp.border = "0px solid white";
		//if(navm)
		//{temp.borderBottom = "2px solid white";}
		//if(navm && i3GEO.Interface.ATUAL === "googlemaps")
		//{temp.border = "2px dotted white";}
		if(ms.finaliza && ms.finaliza != ""){
			eval(ms.finaliza);
		}
	},
	/*
	Function: mostraMenuLista
	
	Mostra as opções existentes no menu suspenso porém na forma de uma lista de opções

	O conteúdo do menu é baseado na variável i3GEO.configura.oMenuData

	Parametro:

	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraMenuLista: function(id){
		var objid,n,i,sub,
			nomeMenu = "",
			ms = i3GEO.gadgets.PARAMETROS.mostraMenuLista,
			confm = i3GEO.configura.oMenuData,
			ins = "",
			subs = i3GEO.configura.oMenuData.submenus;
		if(arguments.length === 0)
		{id = ms.idhtml;}
		else
		{ms.idhtml = id;}
		objid = $i(id);
		if(objid){
			n = confm.menu.length;
			for(i = 0;i < n;i += 1){
				ins += '<div class="listaMenuTitulo" id=menulista_'+confm.menu[i].id+'>'+confm.menu[i].nome+'</div>';
			}
			objid.innerHTML=ins;
			for(nomeMenu in subs){
				if($i("menulista_"+nomeMenu)){
					sub = subs[nomeMenu];
					n = sub.length;
					ins = "";
					for(i=0;i<n;i++){
						ins += "<p class='listaMenuItem' ><a href='"+sub[i].url+"' target='_blank'>"+sub[i].text+"</a>";
					}
					$i("menulista_"+nomeMenu).innerHTML += ins;
				}
			}
		}
	}
};
//YAHOO.log("carregou classe gadgets", "Classes i3geo");