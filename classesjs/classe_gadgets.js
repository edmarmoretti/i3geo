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
	o gadget será incluído.

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

		"mostraQuadros":

		{idhtml:"lugarquadros"},

		"mostraHistoricoZoom":

		{idhtml:"historicozoom"},

		"mostraMenuSuspenso":

		{idhtml:"menus",deslocaEsquerda:0,finaliza:""},
		
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
		{idhtml:"visual"},
		"mostraQuadros":
		{idhtml:"lugarquadros"},
		"mostraHistoricoZoom":
		{idhtml:"historicozoom"},
		"mostraMenuSuspenso":
		{idhtml:"menus",deslocaEsquerda:0},
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
		var i,ins,temp,
			onde;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;}
		onde = $i(id);
		if(onde){
			if(onde.style.display == "none")
			{onde.style.display = "block";}
			if(!$i("i3geo_escalanum")){
				i = $inputText(id,"100","i3geo_escalanum",$trad("d10"),"9",parseInt(i3GEO.parametros.mapscale,10));
				ins = "<table><tr><td>"+i;
				temp = 'var nova = document.getElementById("i3geo_escalanum").value;';
				temp += 'i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,nova);';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				onde.innerHTML = ins;
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
					i3GEO.gadgets.quadros.grava("escala",scaimagem);
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
		var i,ins,temp;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.idhtml;}
		i3GEO.gadgets.mostraBuscaRapida.id = id;
		if($i(id)){
			//depreciado na versão 4.5
			i3geo_buscaRapida = function(){
				alert("i3geo_buscaRapida foi depreciada");
			};
			i = $inputText(id,"225","valorBuscaRapida"+id,"Município, cidade, UC, endereço...","30",$trad("o2"));
			ins = "<table><tr><td><a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=71' >&nbsp;&nbsp;&nbsp;</a></td><td>"+i+"</td>";
			ins += "<td><img src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("p13")+"' class='ticPropriedades2' id=i3GEObotaoPropriedadesBuscaRapida"+id+" /></td>";
			ins += "<td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' id=i3GEObotaoBuscaRapida"+id+" /></td></tr></table>";
			temp = $i(id);
			if(temp){
				temp.innerHTML = ins;
				$i("i3GEObotaoBuscaRapida"+id).onclick = function(){
					if(i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos === false && i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa === false)
					{alert("Escolha um tipo de busca nas propriedades");return;}

					if ($i("valorBuscaRapida"+id).value === "")
					{alert("Digite uma palavra para busca!");return;}
					i3GEO.janela.cria("300px","280px",i3GEO.configura.locaplic+"/ferramentas/buscarapida/index.htm","","","Busca rapida");				
				};
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
			$i("i3geo_zoomanterior").onclick = function(){
				if(marcadorZoom === ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
				if(i3GEO.gadgets.quadros.quadroatual > 0){
					marcadorZoom = marcadorZoom - 1;
					if(marcadorZoom >= 0)
					{i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);}
					else
					{marcadorZoom = 0;}
				}
			};
			$i("i3geo_zoomproximo").onclick = function(){
				if(marcadorZoom === ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
				if(i3GEO.gadgets.quadros.quadroatual < i3GEO.gadgets.quadros.quadrosfilme.length){
					marcadorZoom = marcadorZoom + 1;
					if(marcadorZoom < i3GEO.gadgets.quadros.quadrosfilme.length)
					{i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);}
				}
				else
				{marcadorZoom = i3GEO.gadgets.quadros.quadrosfilme.length;}
			};
		}
	},
	/*
	Classe: i3GEO.gadgets.visual

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
		Function: inicia

		Constrói os ícones de escolha do visual.

		Parametro:

		id {String} - id do elemento que receberá os ícones (opcional)
		*/
		inicia: function(id){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.inicia()");}
			var l,visuais,li;
			if(arguments.length === 0)
			{id = i3GEO.gadgets.PARAMETROS.mostraVisual.idhtml;}
			if($i(id)){
				if (i3GEO.parametros.listavisual !== ""){
					l = i3GEO.parametros.listavisual.split(",");
					visuais = "";
					li = l.length-1;
					if(li >= 0){
						do{visuais += "<img title='"+l[li]+"' style=cursor:pointer onclick='i3GEO.gadgets.visual.troca(\""+l[li]+"\")' src='"+i3GEO.configura.locaplic+"/imagens/visual/"+l[li]+".png' />&nbsp;";}
						while(li--);
					}
					$i(id).innerHTML = visuais;
					$i(id).onmouseover = function(){i3GEO.ajuda.mostraJanela($trad("d26"));};
					$i(id).onmouseout = function(){i3GEO.ajuda.mostraJanela("");};
				}
			}
		},
		/*
		Function: troca

		Troca o visual atual. A lista de visuais disponíveis é obtida em i3GEO.parametros.listavisual

		Parametro:

		visual {String} - nome do visual que será utilizado.
		*/
		troca: function(visual){
			var monta = function(retorno){
				var imgstemp,imgs,i,temp,elementos,elt,caminho,j,busca,nimagem;
				try{
					i3GEO.janela.fechaAguarde("i3GEO.atualiza");
					//
					//pega todas as imagens da interface
					//
					imgstemp = retorno.data.arquivos;
					imgs = [];
					i = imgstemp.length-1;
					if(i >= 0){
						do{
							temp = imgstemp[i].split(".");
							if ((temp[1] === "png") || (temp[1] === "gif") || (temp[1] === "jpg"))
							{imgs.push(imgstemp[i]);}
						}
						while(i--);
					}
					elementos = document.getElementsByTagName("img");
					elt = elementos.length;
					caminho = i3GEO.configura.locaplic+"/imagens/visual/"+visual+"/";
					//faz a troca em imagens
					j = imgs.length-1;
					if(j >= 0){
						do{
							for (i=0;i < elt; i++){
								if ((elementos[i].src.search("branco") > -1) && ((elementos[i].className !== "") || (elementos[i].id !== "")))
								{elementos[i].src = caminho+"branco.gif";}
								if (elementos[i].src.search("visual") > -1){
									elementos[i].style.backgroundImage = "url('"+caminho+"sprite.png')";
								}
							}
						}
						while(j--);
					}
					j = imgs.length-1;
					if(j >= 0){
						do{
							busca = imgs[j].split(".");
							if ($i(busca[0]))
							{$i(busca[0]).src = caminho+imgs[j];}
						}
						while(j--);
					}
					//faz a troca em bg
					elementos = ["barraSuperior","barraInferior","vertMaisZoom","vertMenosZoom","foldermapa","foldermapa1","tic"];
					i = elementos.length-1;
					if(i >= 0){
						do{
							if ($i(elementos[i])){
								nimagem = $i(elementos[i]).style.backgroundImage.replace(i3GEO.configura.visual,visual);
								$i(elementos[i]).style.backgroundImage = nimagem;
								//$i(elementos[i]).style.backgroundImage = "url('"+caminho+"sprite.png')";
							}
						}
						while(i--);
					}
					i3GEO.configura.visual = visual;
				}
				catch(e){alert("Ocorreu um erro. mudaVisual"+e);i3GEO.janela.fechaAguarde("i3GEO.atualiza");}
			};
			//
			//pega a lista de imagens no diretório do i3geo correspondente ao visual selecionado
			//
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			i3GEO.php.listaarquivos(monta,"imagens/visual/"+visual);
		}
	},
	/*
	Classe: i3GEO.gadgets.quadros

	Cria e controla o funcionamento dos quadros de animação.

	Os quadros são mostrados no mapa como uma sequência de quadros de um filme.
	As imagens que são produzidas no mapa são armazenadas em cada quadro, permitindo sua recuperação.

	Os quadros armazenam também a extensão geográfica de cada imagem, permitindo sua recuperação.
	*/
	quadros: {
		/*
		Variavel: quadrosfilme

		Armazena cada quadro individualmente com as suas propriedades

		Tipo:
		{Array}
		*/
		quadrosfilme: [],
		/*
		Variavel: quadroatual

		Valor do índice do quadro atual

		Tipo:
		{Integer}
		*/
		quadroatual: 0,
		/*
		Propriedade: geraLegenda

		Gera ou não a legenda quando o mapa é redesenhado. Ativando essa opção, o i3Geo fica um pouco mais lento

		Type:
		{boolean}

		Default:
		{false}
		*/
		geraLegenda: false,
		/*
		Function: inicia

		Gera os quadros e inicializa os objetos para armazenar as imagens

		Parametros:

		qs {Integer} - número de quadros

		lugarquadros {String} - id do elemento HTML que receberá os quadros (opcional)
		*/
		inicia: function(qs,lugarquadros){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.quadros.inicia()");}
			if(i3GEO.Interface.ATUAL !== "padrao")
			{return;}
			if(arguments.length === 1)
			{lugarquadros = i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml;}
			var q,i,temp,p;
			q = "<table class=tablefilme ><tr><td><div class='menuarrow'  title='op&ccedil;&otilde;es' onclick='i3GEO.gadgets.quadros.opcoes(this)' style='cursor:pointer'></div></td>";
			for (i = 0; i < qs; i++){
				q += "<td><img class='quadro' src=\""+i3GEO.configura.locaplic+"/imagens/branco.gif\" id='quadro"+i+"' ";
				q += "onmouseover='i3GEO.gadgets.quadros.trocaMapa(this.id);i3GEO.ajuda.mostraJanela(\"Clique para aplicar a extensão geográfica do quadro ao mapa\")' ";
				q += "onclick='i3GEO.gadgets.quadros.zoom(this.id)' /></td>";
				i3GEO.gadgets.quadros.quadrosfilme[i] = [];
			}
			q += "</tr></table>";
			if($i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml)){
				document.getElementById(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml).innerHTML = q;
				$i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml).onmouseout = function(){
					$i("img").style.display = "block";
					if($i("imgClone")){
						temp = $i("imgClone");
						p = temp.parentNode;
						p.removeChild(temp);
						i3GEO.ajuda.mostraJanela('');
					}
				};
			}
			i3GEO.gadgets.quadros.quadroatual = 0;
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.gadgets.quadros.avanca()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.gadgets.quadros.avanca()");}
		},
		/*
		Function: grava

		Armazena um determinado valor em uma determinada característica de um objeto quadro.

		Parametros:

		variavel {String} - parâmetro do objeto quadro.

		valor - {String} valor que será aplicado.
		*/
		grava: function(variavel,valor){
			if(i3GEO.Interface.ATUAL !== "padrao")
			{return;}
			eval("i3GEO.gadgets.quadros.quadrosfilme["+i3GEO.gadgets.quadros.quadroatual+"]."+variavel+" = '"+valor+"'");
			if($i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml))
			{$i("quadro"+i3GEO.gadgets.quadros.quadroatual).className = "quadro1";}
		},
		/*
		Function: avanca

		Avança um quadro na lista de quadros, mudando a imagem utilizada na sua representação.
		*/
		avanca: function(){
			if(i3GEO.Interface.ATUAL !== "padrao")
			{return;}
			try{
				var nquadros = i3GEO.gadgets.quadros.quadrosfilme.length;
				if ((nquadros - 1) === (i3GEO.gadgets.quadros.quadroatual))
				{i3GEO.gadgets.quadros.inicia(nquadros);}
				else{i3GEO.gadgets.quadros.quadroatual++;}
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		},
		/*
		Function: zoom

		Aplica o zoom no mapa para a extensão geográfica armazenada em um quadro

		Parametro:

		quadro {String} - id do quadro que será utilizado
		*/
		zoom: function(quadro){
			var indice = quadro.replace("quadro","");
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[indice].extensao);
		},
		/*
		Function: trocaMapa

		Troca a imagem do mapa atual pela que estiver armazenada em quadro

		A imagem mostrada no mapa é um clone do mapa atual, preservando o mapa.

		Parametro:

		quadro {String} - id do quadro que terá a imagem recuperada
		*/
		trocaMapa: function(quadro){
			var indice,i,c,iclone;
			indice = quadro.replace("quadro","");
			i = $i(i3GEO.Interface.IDMAPA);
			c = $i("imgClone");
			if(i){
				if(!c){
					iclone=document.createElement('IMG');
					iclone.style.position = "relative";
					iclone.id = "imgClone";
					iclone.style.border="1px solid blue";
					i.parentNode.appendChild(iclone);
					iclone.src = i.src;
					iclone.style.width = i3GEO.parametros.w;
					iclone.style.heigth = i3GEO.parametros.h;
					iclone.style.top = i.style.top;
					iclone.style.left = i.style.left;
					c = $i("imgClone");
				}
				try{
					if(!i3GEO.gadgets.quadros.quadrosfilme[indice].imagem){return;}
					c.src = i3GEO.gadgets.quadros.quadrosfilme[indice].imagem;
					c.style.display = "block";
					i.style.display = "none";
				}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
			}
		},
		/*
		Function: opcoes

		Abre a janela de opções que controla as características do quado e permite disparar a animação.

		Parametro:

		obj {Object} - objeto clicado
		*/
		opcoes: function(obj){
			var js,volta;
			if (i3GEO.parametros.utilizacgi.toLowerCase() === "sim"){
				i3GEO.parametros.utilizacgi = "nao";
				volta = function(){
					alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");
				};
				i3GEO.php.desativacgi(volta);
			}
			else{
				if(typeof(i3GEOF.opcoesQuadros) === 'undefined'){
					js = i3GEO.configura.locaplic+"/ferramentas/opcoes_quadros/index.js.php";
					i3GEO.util.scriptTag(js,"i3GEOF.opcoesQuadros.criaJanelaFlutuante()","i3GEOF.opcoesQuadros_script");
				}
			}
		},
		/*
		Function: anima

		Mostra as imagens armazenadas nos quadros em uma sequência animada

		Parametros:

		Qanima {Integer} - quadro atual na sequência de animação

		t {Numeric} - tempo em milisegundos entre cada quadro
		*/
		anima: function(Qanima,t){
			var doc;
			if(arguments.length === 0){
				Qanima = 0;
				doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
				t = doc.getElementById("tempoanima").value;
			}
			if(Qanima > i3GEO.gadgets.quadros.quadrosfilme.length){
				clearTimeout(tAnima);
				$i("imgClone").style.display = "none";
				$i("img").style.display="block";
				return;
			}
			i3GEO.gadgets.quadros.trocaMapa("quadro"+Qanima);
			Qanima++;
			tAnima = setTimeout('i3GEO.gadgets.quadros.anima('+Qanima+','+t+')',t);
		},
		/*
		Function: listaImagens

		Lista as imagens armazenadas em uma nova página no navegador
		*/
		listaImagens: function(){
			var volta,wi,mensagem,i;
			if (i3GEO.parametros.utilizacgi.toLowerCase() === "sim"){
				i3GEO.parametros.utilizacgi = "nao";
				volta = function()
				{alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");};
				i3GEO.php.desativacgi(volta);
			}
			else{
				wi = window.open("");
				//pega os dados do objeto quadrosfilme e escreve na nova janela
				mensagem = "<br><b>N&atilde;o existem imagens guardadas.";
				wi.document.write("<html><body><p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Click com o bot&atilde;o da direita do mouse sobre a imagem para fazer o download<br>");
				i = i3GEO.gadgets.quadros.quadrosfilme.length-1;
				if(i >= 0){
					do{
						if (i3GEO.gadgets.quadros.quadrosfilme[i].imagem){
							wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Imagem: "+i+"<br>");
							wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Abrangência: "+i3GEO.gadgets.quadros.quadrosfilme[i].extensao+"<br>");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].imagem+"' />");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].referencia+"' />");
							if(i3GEO.gadgets.quadros.geraLegenda === true)
							{wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].legenda+"' />");}
						}
						i--;
					}
					while(i >= 0);
				}
				wi.document.write("<br>Fim</body></html>");
				wi.document.close();
			}
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
		var objid,sobe,n,i,estilo,t,onMenuBarBeforeRender,temp,ifr,i3GEOoMenuBarLocal,
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
				onMenuBarBeforeRender = function (p_sType, p_sArgs){
					var conta,nomeMenu,nomeSub,
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
				if(i3GEO.Interface.ATUAL === "googleearth" || i3GEO.Interface.ATUAL === "flamingo")
				{ifr = true;}
				else
				{ifr = false;}
				i3GEOoMenuBarLocal = new YAHOO.widget.MenuBar(id,{iframe:ifr,autosubmenudisplay: true, showdelay: 100, hidedelay: 500, lazyload: false});
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
				case "padrao":
					temp = "omenudataInterface1";
					break;
				case "googlemaps":
					temp = "omenudataInterface4";
					break;
				case "googleearth":
					temp = "omenudataInterface5";
					break;
				case "flamingo":
					temp = "omenudataInterface3";
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
				case "padrao":
					temp = ["omenudataJanelas1","omenudataJanelas3","omenudataFerramentas2a"];
					break;
				case "googlemaps":
					temp = ["omenudataArquivos3","omenudataJanelas1","omenudataJanelas3"];
					break;
				case "googleearth":
					temp = ["omenudataFerramentas7b","omenudataArquivos3","omenudataJanelas3","omenudataFerramentas2a"];
					break;
				case "flamingo":
					temp = ["omenudataArquivos3","omenudataJanelas1","omenudataJanelas3","omenudataFerramentas2a"];
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
		var objid,n,i,estilo,t,temp,nomeMenu,sub,
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