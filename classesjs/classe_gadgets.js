/*
Title: Gadgets (objetos marginais do mapa)

File: i3geo/classesjs/classe_gadgets.js

About: Licença

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
	i3GEO = new Array();
}
/*
Class: i3GEO.gadgets

Inclui elementos especiais no mapa

Os elementos são opcionais e adicionam funcionalidades ao mapa.
*/
i3GEO.gadgets = {
	/*
	Variable: PARAMETROS
	
	Parametros de inicialização dos gadgets
	
	Type:
	{JSON}
	*/	
	PARAMETROS: {
		"mostraCoordenadasUTM":
		{idhtml:"mostraUTM"},
		"mostraCoordenadasGEO":
		{idhtml:"localizarxy"},
		"mostraEscalaNumerica":
		{idhtml:"escala"},
		"mostraEscalaGrafica":
		{idhtml:"escalaGrafica"},
		"mostraBuscaRapida":
		{idhtml:"buscaRapida"},
		"mostraVisual":
		{idhtml:"visual"},
		"mostraQuadros":
		{idhtml:"lugarquadros"},
		"mostraHistoricoZoom":
		{idhtml:"historicozoom"}
	},
	/*
	Function: mostraCoordenadasUTM
	
	Obtém as coordenadas UTM da posição do mouse sobre o mapa.
	
	As coordenadas são obtidas por meio de uma chamada AJAX.
	
	Para o funcionamento correto é necessário incluir essa função no evento que identifica quando o mouse
	está estacionado sobre o mapa. Por default isso já é feito pelo i3Geo.
	
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (mostraUTM) ou altere a variável i3GEO.eventos.MOUSEPARADO
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS

	Return:
	
	{JSON} - objeto com x e y
	*/
	mostraCoordenadasUTM: function(id){
		if(objposicaocursor.imgx < 10 || objposicaocursor.imgy < 10)
		{return;}
		if(arguments.length == 0 || id == "")
		{var id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml;}
		var temp = $i(id);
		if (!temp){return;}
		if(temp.style.display == "block"){return;}
		var mostra = function(retorno)
		{
			if(retorno.data){
				temp.style.display="block";
				temp.innerHTML = "UTM: x="+retorno.data.x+" y="+retorno.data.y+" zona="+retorno.data.zona+" datum="+retorno.data.datum;
				tempoUTM = setTimeout("$i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml).style.display='none';clearTimeout(tempoUTM)",3400);
				return (retorno.data);
			}
		};
		i3GEO.php.geo2utm(mostra,objposicaocursor.ddx,objposicaocursor.ddy);
	},
	/*
	Function: mostraCoordenadasGEO
	
	Obtém as coordenadas Geográficas da posição do mouse sobre o mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (localizarxy)
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/	
	mostraCoordenadasGEO: function(id){
		try{
			//
			//ativa o evento que preenche os campos de coordenadas
			//
			if(arguments.length == 0)
			{var id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml;}
			if($i(id)){
				if(!$i("xm")){
					var ins = "<table style='text-align:center'><tr>";
					ins += "<td>localiza X:&nbsp;</td>";
					ins += "<td>"+$inputText(id,"315","xg","grau","3","-00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","xm","minuto","3","00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","xs","segundo","5","00.00")+"&nbsp;</td>";
					ins += "<td>Y:"+$inputText("","","yg","grau","3","-00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","ym","minuto","3","00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","ys","segundo","5","00.00")+"</td>";
					var temp = 'var xxx = i3GEO.calculo.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);';
					temp +=	'var yyy = i3GEO.calculo.dms2dd($i("yg").value,$i("ym").value,$i("ys").value);';
					temp +=	'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,xxx,yyy);';		
					ins += "<td><img  class='tic' title='zoom' onclick='"+temp+"' src='"+i3GEO.util.$im("branco.gif")+"' id=procurarxy /></td>";
					ins += "</tr></table>";
					$i(id).innerHTML = ins;
					$i3geo_temp_xg = $i("xg");
					$i3geo_temp_xm = $i("xm");
					$i3geo_temp_xs = $i("xs");
					$i3geo_temp_yg = $i("yg");
					$i3geo_temp_ym = $i("ym");
					$i3geo_temp_ys = $i("ys");
					atualizaLocalizarxy = function(){
						try{
							var x = objposicaocursor.dmsx.split(" ");
							var y = objposicaocursor.dmsy.split(" ");
							$i3geo_temp_xg.value = x[0];
							$i3geo_temp_xm.value = x[1];
							$i3geo_temp_xs.value = x[2];
							$i3geo_temp_yg.value = y[0];
							$i3geo_temp_ym.value = y[1];
							$i3geo_temp_ys.value = y[2];
						}
						catch(m){};
					};
					if($i("img"))
					{YAHOO.util.Event.addListener($i("img"),"mousemove", atualizaLocalizarxy);}
				}
			}
		}
		catch(e){alert("mostraCoordenadasGeo: "+e.description);}
	},
	/*
	Function: mostraEscalaNumerica
	
	Mostra no mapa a escala numérica.
	
	A escala numérica pode ser alterada pelo usuário digitando-se a nova escala.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/		
	mostraEscalaNumerica: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;}
		if($i(id)){
			atualizaEscalaNumerica = function(escala){
				var e = $i("i3geo_escalanum");  
				if(!e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaNumerica()");
					return;
				}
				if(arguments.length == 1)
				e.value = escala;
				else
				e.value = parseInt(objmapa.scale);
			};
			if(!$i("i3geo_escalanum")){
				var i = $inputText(id,"138","i3geo_escalanum",$trad("d10"),"19","");
				var ins = "<table><tr><td>1:"+i;
				var temp = 'var nova = document.getElementById("i3geo_escalanum").value;';
				temp += 'i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,nova);';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				$i(id).innerHTML = ins;
			}
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaEscalaNumerica()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("atualizaEscalaNumerica()");}		
		}
	},
	/*
	Function: mostraEscalaGrafica
	
	Mostra no mapa a escala grafica como um elemento fora do mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS(escala)
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/		
	mostraEscalaGrafica: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraEscalaGrafica.idhtml;}
		if($i(id)){
			atualizaEscalaGrafica = function(){
				var e = $i("imagemEscalaGrafica");  
				if(!e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaGrafica()");
					return;
				}
				var temp = function(retorno){
				
					eval(retorno.data);
					i3GEO.gadgets.quadros.grava("escala",scaimagem);
					$i("imagemEscalaGrafica").src = scaimagem;
				};
				i3GEO.php.escalagrafica(temp);
			};
			if(!$i("imagemEscalaGrafica")){
				
				var ins = "<img class='menuarrow' src=\""+g_localimg+"/branco.gif\" title='op&ccedil;&otilde;es' onclick='i3GEO.mapa.dialogo.opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src='' />"
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
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/	
	mostraBuscaRapida: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.idhtml;}
		if($i(id)){
			i3geo_buscaRapida = function(){
				if ($i("valorBuscaRapida").value == "")
				{alert ("Digite uma palavra para busca!");return;}
				wdocaf("300px","280px",i3GEO.configura.locaplic+"/ferramentas/buscarapida/index.htm","","","Busca rapida");
			}
			var i = $inputText(id,"180","valorBuscaRapida","digite o texto para busca","30",$trad("o2"));
			var ins = "<table><tr><td>"+i;
			ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='i3geo_buscaRapida()' /></td></tr></table>";
			$i(id).innerHTML = ins;
		}	
	},
	/*
	Function: mostraHistoricoZoom
	
	Mostra na barra de zoom os ícones que controlam a visualização do histórico da navegação sobre o mapa
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraHistoricoZoom: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraHistoricoZoom.idhtml;}
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
				if(marcadorZoom == ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
				if(i3GEO.gadgets.quadros.quadroatual > 0){
					marcadorZoom = marcadorZoom - 1;
					if(marcadorZoom >= 0)
					i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);
					else
					marcadorZoom = 0;
				}
			};
			$i("i3geo_zoomproximo").onclick = function(){
				if(marcadorZoom == ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
				if(i3GEO.gadgets.quadros.quadroatual < i3GEO.gadgets.quadros.quadrosfilme.length){
					marcadorZoom = marcadorZoom + 1
					if(marcadorZoom < i3GEO.gadgets.quadros.quadrosfilme.length)
					i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);
				}
				else
				marcadorZoom = i3GEO.gadgets.quadros.quadrosfilme.length;
			};
		}
	},
	/*
	Class: i3GEO.gadgets.visual
	
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
		
		Parameters:
		
		id {String} - id do elemento que receberá os ícones (opcional)
		*/
		inicia: function(id){
			if(arguments.length == 0)
			{var id = i3GEO.gadgets.PARAMETROS.mostraVisual.idhtml;}
			if($i(id)){
				if (objmapa.listavisual != ""){
					var l = objmapa.listavisual.split(",");
					var visuais = "";
					var li = l.length-1;
					if(li >= 0){
						do{visuais += "<img title='"+l[li]+"' style=cursor:pointer onclick='i3GEO.gadgets.visual.troca(\""+l[li]+"\")' src='"+i3GEO.configura.locaplic+"/imagens/visual/"+l[li]+".png' />&nbsp;";}
						while(li--)
					}
					$i(id).innerHTML = visuais;
					$i(id).onmouseover = function(){i3GEO.ajuda.mostraJanela($trad("d26"));};
					$i(id).onmouseout = function(){i3GEO.ajuda.mostraJanela("");};
				}		
			}
		},
		/*
		Function: troca
		
		Troca o visual atual. A lista de visuais disponíveis é obtida em objmapa.listavisual
		
		Parameters:
		
		visual {String} - nome do visual que será utilizado.
		*/
		troca: function(visual){
			var monta = function(retorno){
				try{
					i3GEO.janela.fechaAguarde("ajaxredesenha");
					//
					//pega todas as imagens da interface
					//
					var imgstemp = retorno.data.arquivos;
					var imgs = new Array();
					var i = imgstemp.length-1;
					if(i >= 0){
						do{
							var temp = imgstemp[i].split(".");
							if ((temp[1] == "png") || (temp[1] == "gif") || (temp[1] == "jpg"))
							{imgs.push(imgstemp[i]);}
						}
						while(i--)
					}
					var elementos = document.getElementsByTagName("img");
					var elt = elementos.length;
					var caminho = i3GEO.configura.locaplic+"/imagens/visual/"+visual+"/";
					//faz a troca em imagens
					var j = imgs.length-1;
					if(j >= 0){
						do{
							for (var i=0;i < elt; i++){
								if ((elementos[i].src.search("branco") > -1) && ((elementos[i].className != "") || (elementos[i].id != "")))
								{elementos[i].src = caminho+"branco.gif";}
								if (elementos[i].src.search("visual") > -1)
								{elementos[i].style.backgroundImage = "url('"+caminho+imgs[j]+"')";}
							}
						}
						while(j--)
					}	
					//faz a troca em ids
					var j = imgs.length-1;
					if(j >= 0){
						do{
							var busca = imgs[j].split(".");
							if ($i(busca[0]))
							{$i(busca[0]).src = caminho+imgs[j];}
						}
						while(j--)
					}
					//faz a troca em bg
					var elementos = new Array("barraSuperior","barraInferior","vertMaisZoom","vertMenosZoom","foldermapa","foldermapa1","tic");
					var i = elementos.length-1;
					if(i >= 0){
						do{
							if ($i(elementos[i])){
								var nimagem = $i(elementos[i]).style.backgroundImage.replace(i3GEO.configura.visual,visual);
								$i(elementos[i]).style.backgroundImage = nimagem;
								//$i(elementos[i]).style.backgroundImage = "url('"+caminho+"sprite.png')";
							}
						}
						while(i--)
					}
					i3GEO.configura.visual = visual;
				}
				catch(e){alert("Ocorreu um erro. mudaVisual"+e);i3GEO.janela.fechaAguarde("ajaxredesenha");}
			};
			//
			//pega a lista de imagens no diretório do i3geo correspondente ao visual selecionado
			//
			i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
			i3GEO.php.listaarquivos(monta,"imagens/visual/"+visual);
		}
	},
	/*
	Class: i3GEO.gadgets.quadros
	
	Cria e controla o funcionamento dos quadros de animação.
	
	Os quadros são mostrados no mapa como uma sequência de quadros de um filme.
	As imagens que são produzidas no mapa são armazenadas em cada quadro, permitindo sua recuperação.
	
	Os quadros armazenam também a extensão geográfica de cada imagem, permitindo sua recuperação.
	*/
	quadros: {
		/*
		Variable: quadrosfilme
		
		Armazena cada quadro individualmente com as suas propriedades
		
		Type:
		{Array}
		*/
		quadrosfilme: new Array(),
		/*
		Variable: quadroatual
		
		Valor do índice do quadro atual
		
		Type:
		{Integer}
		*/
		quadroatual: 0,
		/*
		Function: inicia
		
		Gera os quadros e inicializa os objetos para armazenar as imagens
		
		Parameters:
		
		qs {Integer} - número de quadros
		
		lugarquadros {String} - id do elemento HTML que receberá os quadros (opcional)
		*/
		inicia: function(qs,lugarquadros){
			if(arguments.length == 1)
			{var lugarquadros = i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml;}
			var q = "<table class=tablefilme ><tr><td><div class='menuarrow'  title='op&ccedil;&otilde;es' onclick='i3GEO.gadgets.quadros.opcoes(this)' style='cursor:pointer'></div></td>";
			for (var i = 0; i < qs; i++){
				q += "<td><img class='quadro' src=\""+i3GEO.configura.locaplic+"/imagens/branco.gif\" id='quadro"+i+"' ";
				q += "onmouseover='i3GEO.gadgets.quadros.trocaMapa(this.id);i3GEO.ajuda.mostraJanela(\"Clique para aplicar a extensão geográfica do quadro ao mapa\")' ";
				q += "onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" ";
				q += "onclick='i3GEO.gadgets.quadros.zoom(this.id)' /></td>";
				i3GEO.gadgets.quadros.quadrosfilme[i] = new Array();
			}
			q += "</tr></table>";
			if($i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml)){
				document.getElementById(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml).innerHTML = q;
				$i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml).onmouseout = function(){
					if($i("imgClone")){
						$i("imgClone").style.display = "none";
						$i("img").style.display = "block";
					}
				};
			}
			i3GEO.gadgets.quadros.quadroatual = 0;
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.gadgets.quadros.avanca()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.gadgets.quadros.avanca()");}
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.gadgets.quadros.grava('extensao',objmapa.extent)") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.gadgets.quadros.grava('extensao',objmapa.extent)");}
		},
		/*
		Function: grava

		Armazena um determinado valor em uma determinada característica de um objeto quadro.

		Parameters:

		variavel {String} - parâmetro do objeto quadro.

		valor - {String} valor que será aplicado.
		*/
		grava: function(variavel,valor){
			eval("i3GEO.gadgets.quadros.quadrosfilme["+i3GEO.gadgets.quadros.quadroatual+"]."+variavel+" = '"+valor+"'");
			if($i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml))
			{$i("quadro"+i3GEO.gadgets.quadros.quadroatual).className = "quadro1";}
		},
		/*
		Function: avanca

		Avança um quadro na lista de quadros, mudando a imagem utilizada na sua representação.
		*/		
		avanca: function(){
			try{
				var nquadros = i3GEO.gadgets.quadros.quadrosfilme.length;
				if ((nquadros - 1) == (i3GEO.gadgets.quadros.quadroatual))
				{i3GEO.gadgets.quadros.inicia(nquadros);}
				else{i3GEO.gadgets.quadros.quadroatual++;}
			}
			catch(e){var e = "";}		
		},
		/*
		Function: zoom
		
		Aplica o zoom no mapa para a extensão geográfica armazenada em um quadro
		
		Parameter:
		
		quadro {String} - id do quadro que será utilizado
		*/
		zoom: function(quadro){
			var indice = quadro.replace("quadro","");
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[indice].extensao)
		},
		/*
		Function: trocaMapa
		
		Troca a imagem do mapa atual pela que estiver armazenada em quadro
		
		A imagem mostrada no mapa é um clone do mapa atual, preservando o mapa.
		
		Parameters:
		
		quadro {String} - id do quadro que terá a imagem recuperada
		*/
		trocaMapa: function(quadro){
			var indice = quadro.replace("quadro","");
			var i = $i("img");
			var c = $i("imgClone");
			if(i){
				if(!c){
					var iclone=document.createElement('IMG');
					iclone.style.position = "relative";
					iclone.id = "imgClone";
					iclone.style.border="1px solid blue";
					i.parentNode.appendChild(iclone);
					iclone.src = corpo.src;
					iclone.style.width = objmapa.w;
					iclone.style.heigth = objmapa.h;
					iclone.style.top = corpo.style.top;
					iclone.style.left = corpo.style.left;		
				}
				try{
					if(!i3GEO.gadgets.quadros.quadrosfilme[indice].imagem){return;}
					c.src = i3GEO.gadgets.quadros.quadrosfilme[indice].imagem;
					c.style.display = "block";
					i.style.display = "none";
				}
				catch(e){var e = "";}
			}
		},
		/*
		Function: opcoes
		
		Abre a janela de opções que controla as características do quado e permite disparar a animação.
		
		Parameters:
		
		obj {Object} - objeto clicado
		*/
		opcoes: function(obj){
			if (objmapa.utilizacgi == "sim"){
				objmapa.utilizacgi = "nao";
				var volta = function(){
					alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");
				};
				i3GEO.php.desativacgi(volta);
			}
			else
			{i3GEO.janela.cria("150px","150px",i3GEO.configura.locaplic+"/ferramentas/opcoes_quadros/index.htm","center","","Quadros");}
		},
		/*
		Function: anima
		
		Mostra as imagens armazenadas nos quadros em uma sequência animada
		
		Parameters:
		
		Qanima {Integer} - quadro atual na sequência de animação
		
		t {Numeric} - tempo em milisegundos entre cada quadro
		*/
		anima: function(Qanima,t){
			if(arguments.length == 0){
				Qanima = 0;
				var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
				var t = doc.getElementById("tempoanima").value;
			}
			if(Qanima > i3GEO.gadgets.quadros.quadrosfilme.length){
				clearTimeout(tAnima);
				$i("imgClone").style.display = "none";	
				$i("img").style.display="block";
				return;
			}
			//$i("img").src = preLoad[janima].src;
			//$i("f"+janima).className = "quadro1";
			i3GEO.gadgets.quadros.trocaMapa("quadro"+Qanima);
			Qanima++;
			tAnima = setTimeout('i3GEO.gadgets.quadros.anima('+Qanima+','+t+')',t);
		},
		/*
		Function: listaImagens
		
		Lista as imagens armazenadas em uma nova página no navegador
		*/
		listaImagens: function(){
			if (objmapa.utilizacgi == "sim"){
				objmapa.utilizacgi = "nao";
				var volta = function()
				{alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");};
				i3GEO.php.desativacgi(volta);
			}
			else{
				var wi = window.open("");//"",null,"width=550,height=650,resizable=yes,scrollbars=yes");
				//pega os dados do objeto quadrosfilme e escreve na nova janela
				var mensagem = "<br><b>N&atilde;o existem imagens guardadas.";
				wi.document.write("<html><body><p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Click com o bot&atilde;o da direita do mouse sobre a imagem para fazer o download<br>");	
				var i = i3GEO.gadgets.quadros.quadrosfilme.length-1;
				if(i >= 0){
					do{
						if (i3GEO.gadgets.quadros.quadrosfilme[i].imagem){
							wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Imagem: "+i+"<br>");
							wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Abrangência: "+i3GEO.gadgets.quadros.quadrosfilme[i].extensao+"<br>");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].imagem+"' />");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].referencia+"' />");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].legenda+"' />");
						}
						i--
					}
					while(i>=0)
				}
				wi.document.write("<br>Fim</body></html>");
			}
		}
	}
};