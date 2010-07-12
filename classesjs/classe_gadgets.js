/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Gadgets (objetos marginais do mapa)

Arquivo: i3geo/classesjs/classe_gadgets.js

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
	
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda = 400
	
	Default:
	
	i3GEO.gadgets.PARAMETROS = {

		"mostraCoordenadasUTM":

		{idhtml:"mostraUTM"},

		"mostraCoordenadasGEO":

		{idhtml:"localizarxy"},
		
		"mostraInserirKml":
		
		{idhtml:"inserirKml"},

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

		{idhtml:"historicozoom"},

		"mostraMenuSuspenso":

		{idhtml:"menus",deslocaEsquerda:0},
		
		"mostraVersao":
		
		{idhtml:"versaoi3geo"}
	}	
	
	Tipo:
	{JSON}
	*/	
	PARAMETROS: {
		"mostraCoordenadasUTM":
		{idhtml:"localizarxy"},
		"mostraCoordenadasGEO":
		{idhtml:"localizarxy"},
		"mostraInserirKml":
		{idhtml:"inserirKml"},
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
		{idhtml:"historicozoom"},
		"mostraMenuSuspenso":
		{idhtml:"menus",deslocaEsquerda:0},
		"mostraVersao":
		{idhtml:"versaoi3geo"}
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
		var temp = $i(id);
		try
		{
			if(temp)
			{temp.innerHTML = i3GEO.parametros.mensageminicia;}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
	},
	/*
	Function: mostraCoordenadasUTM
	
	Obtém as coordenadas UTM da posição do mouse sobre o mapa.
	
	As coordenadas são obtidas por meio de uma chamada AJAX.
	
	Para o funcionamento correto é necessário incluir essa função no evento que identifica quando o mouse
	está estacionado sobre o mapa. Por default isso já é feito pelo i3Geo.
	
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (mostraCoordenadasUTM) ou altere a variável i3GEO.eventos.MOUSEPARADO
	
	Se i3GEO.gadgets.mostraCoordenadasUTM.idhtml for igual a i3GEO.gadgets.mostraCoordenadasGEO.idhtml
	
	os valores mostrados serão intercalados entre GEO e UTM
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS

	Return:
	
	{JSON} - objeto com x e y
	*/
	mostraCoordenadasUTM: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraCoordenadasUTM()");}
		if(arguments.length === 0 || id === "")
		{id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml;}
		else
		{i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml = id;}
		if (!$i(id)){return;}
		atualizaCoordenadasUTM = function()
		{
			if(i3GEO.Interface.STATUS.atualizando.length > 0)
			{return;}
			if(typeof(console) !== 'undefined'){console.info("atualizaCoordenadasUTM()");}
			//if($i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml).style.display == "block"){return;}
			if(objposicaocursor.imgx < 10 || objposicaocursor.imgy < 10)
			{return;}
			if($i("wdoca")){return;}
			var tempUtm,s,n,i,t;
			//
			//cancela se existir alguma ferramenta ativa
			//
			s = document.getElementsByTagName("script");
			n = s.length;
			for (i=0;i < n;i++){
				t = s[i].id;
				t = t.split(".");
				if(t[0] === "i3GEOF")
				{return;}
			}
			tempUtm = function(retorno){
				var funcao,temp;
				funcao = "$i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml).style.display='none';";
				funcao += "if(i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml == i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml)";
				funcao += "{$i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml).style.display='block';i3GEO.gadgets.mostraCoordenadasGEO();}";
				setTimeout(funcao,3400);
				temp = $i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml);
				if(retorno.data){
					temp.style.display="block";
					temp.innerHTML = "<div>UTM: x="+retorno.data.x+" y="+retorno.data.y+" zn="+retorno.data.zona+" "+retorno.data.datum+"</div>";
					//return (retorno.data);
				}
			};
			i3GEO.php.geo2utm(tempUtm,objposicaocursor.ddx,objposicaocursor.ddy);
		};
		if(i3GEO.eventos.MOUSEPARADO.toString().search("atualizaCoordenadasUTM()") < 0)
		{i3GEO.eventos.MOUSEPARADO.push("atualizaCoordenadasUTM()");}		
	},
	/*
	Function: mostraCoordenadasGEO
	
	Obtém as coordenadas Geográficas da posição do mouse sobre o mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (localizarxy)
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/	
	mostraCoordenadasGEO: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraCoordenadasGEO()");}
		try{
			//
			//ativa o evento que preenche os campos de coordenadas
			//
			var ins,temp;
			if(arguments.length === 0)
			{id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml;}
			else
			{i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml = id;}
			if($i(id)){
				if(!$i("xm")){
					ins = "<table style='text-align:center'><tr>";
					ins += "<td>X:&nbsp;</td>";
					ins += "<td>"+$inputText(id,"315","xg","grau","3","-00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","xm","minuto","3","00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","xs","segundo","5","00.00")+"&nbsp;</td>";
					ins += "<td>Y:"+$inputText("","","yg","grau","3","-00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","ym","minuto","3","00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","ys","segundo","5","00.00")+"</td>";
					temp = 'var xxx = i3GEO.calculo.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);';
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
						var x,y;
						try{
							x = objposicaocursor.dmsx.split(" ");
							y = objposicaocursor.dmsy.split(" ");
							$i3geo_temp_xg.value = x[0];
							$i3geo_temp_xm.value = x[1];
							$i3geo_temp_xs.value = x[2];
							$i3geo_temp_yg.value = y[0];
							$i3geo_temp_ym.value = y[1];
							$i3geo_temp_ys.value = y[2];
						}
						catch(m){
							if(typeof(console) !== 'undefined'){console.error(m);}
						}
					};
					//if($i(i3GEO.Interface.IDMAPA))
					//{YAHOO.util.Event.addListener($i(i3GEO.Interface.IDMAPA),"mousemove", atualizaLocalizarxy);}
					if(i3GEO.eventos.MOUSEMOVE.toString().search("atualizaLocalizarxy()") < 0)
					{i3GEO.eventos.MOUSEMOVE.push("atualizaLocalizarxy()");}
				}
			}
		}
		catch(e){alert("mostraCoordenadasGeo: "+e.description);}
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
				i = $inputText(id,"280","i3geo_urlkml","kml url","40","");
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
		var i,ins,temp;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;}
		if($i(id)){
			atualizaEscalaNumerica = function(escala){
				var e = $i("i3geo_escalanum");  
				if(!e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaNumerica()");
					return;
				}
				if(arguments.length === 1)
				{e.value = escala;}
				else
				{e.value = parseInt(i3GEO.parametros.mapscale,10);}
			};
			if(!$i("i3geo_escalanum")){
				i = $inputText(id,"155","i3geo_escalanum",$trad("d10"),"15",parseInt(i3GEO.parametros.mapscale,10));
				ins = "<table><tr><td>1:"+i;
				temp = 'var nova = document.getElementById("i3geo_escalanum").value;';
				temp += 'i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,nova);';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				$i(id).innerHTML = ins;
			}
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaEscalaNumerica()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("atualizaEscalaNumerica()");}		
		}
		else{
			atualizaEscalaNumerica = function(){}
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
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/	
	mostraBuscaRapida: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraBuscaRapida()");}
		var i,ins,temp;
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.idhtml;}
		if($i(id)){
			i3geo_buscaRapida = function(){
				if ($i("valorBuscaRapida").value === "")
				{alert ("Digite uma palavra para busca!");return;}
				wdocaf("300px","280px",i3GEO.configura.locaplic+"/ferramentas/buscarapida/index.htm","","","Busca rapida");
			};
			i = $inputText(id,"210","valorBuscaRapida","digite o texto para busca","30",$trad("o2"));
			ins = "<table><tr><td><a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=71' >&nbsp;&nbsp;&nbsp;</a></td><td>"+i;
			ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='i3geo_buscaRapida()' /></td></tr></table>";
			temp = $i(id);
			if(temp){
				temp.innerHTML = ins;
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
			if (i3GEO.parametros.utilizacgi === "sim"){
				i3GEO.parametros.utilizacgi = "nao";
				var volta = function(){
					alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");
				};
				i3GEO.php.desativacgi(volta);
			}
			else{
				if(typeof(i3GEOF.opcoesQuadros) === 'undefined'){
					var js = i3GEO.configura.locaplic+"/ferramentas/opcoes_quadros/index.js.php";
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
			if (i3GEO.parametros.utilizacgi === "sim"){
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
	
	O objeto YAHOO.widget.MenuBar resultante pode ser obtido na variável i3GEOoMenuBar

	O conteúdo do menu é baseado na variável i3GEO.configura.oMenuData
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraMenuSuspenso: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.gadgets.mostraMenuSuspenso()");}
		if(arguments.length === 0)
		{id = i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.idhtml;}
		else
		{i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.idhtml = id;}
		var objid,ins,sobe,alinhamento,n,i,estilo,t,onMenuBarBeforeRender,temp;
		objid = $i(id);
		if(objid){
			objid.className="yuimenubar";
			if($i("contemMenu")){
				$i("contemMenu").className="yui-navset";
			}
			//default dos cabeçalhos se a variável i3GEO.configura.oMenuData.menu não existir
			if(!i3GEO.configura.oMenuData.menu){
				ins = "";
				ins += '<div class="bd" style="display:block;align:right;border: 0px solid white;z-index:6000;line-height:1.4" >';
				ins += '<ul class="first-of-type" style="display:block;border:0px solid white;top:10px;">';
 				sobe = "";
 				if(navn){sobe = "line-height:0px;";}
				ins += '<li class="yuimenubaritem" style="padding-bottom:5px" ><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuajuda" >&nbsp;&nbsp;'+$trad("s1")+'</a></li>';
				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuanalise" >&nbsp;&nbsp;'+$trad("s2")+'</a></li>';
 				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menujanelas" >&nbsp;&nbsp;'+$trad("s3")+'</a></li>';
 				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuarquivos" >&nbsp;&nbsp;'+$trad("s4")+'</a></li>';
 				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuinterface" >&nbsp;&nbsp;'+$trad("d27")+'</a></li>';
 				ins += '</ul>'; 
 				ins += '</div>';
 				objid.innerHTML=ins;
 			}
 			else{
 				ins = "";
 				alinhamento = "";
 				if(i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda){
 					alinhamento = "left:"+i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda*-1+"px;";
 				}
				ins += '<div class="bd" style="top:0px;'+alinhamento+'display:block;align:right;border: 0px solid white;z-index:6000;line-height:1.4" >';
				ins += '<ul class="first-of-type" style="display:block;border:0px solid white;top:10px;">';
 				n = i3GEO.configura.oMenuData.menu.length;
 				for(i = 0;i < n;i++){
 					if(i3GEO.parametros.w < 550){
 						i3GEO.configura.oMenuData.menu[i].id = "";
 						estilo = "padding-bottom:3px;top:0px;border: 0px solid white;";
 					}
 					else
 					{estilo = "padding-bottom:3px;top:0px;border: 0px solid white;";}
 					t = "";
 					if(i3GEO.configura.oMenuData.menu[i].target)
 					{t = "target="+i3GEO.configura.oMenuData.menu[i].target;}
 					ins += '<li class="yuimenubaritem" style="padding-top:2px;"><a style="'+estilo+'" href="#" class="yuimenubaritemlabel" '+t+'id="menu'+i3GEO.configura.oMenuData.menu[i].id+'" >&nbsp;'+i3GEO.configura.oMenuData.menu[i].nome+'</a></li>'; 				
 				}
 				ins += '</ul>'; 
 				ins += '</div>';
 				objid.innerHTML=ins;
 			}
			onMenuBarBeforeRender = function (p_sType, p_sArgs){
				var conta,nomeMenu;
				if(i3GEO.parametros.w >= 500)
				{conta = 0;}
				else
				{conta = 0;}
				for(nomeMenu in i3GEO.configura.oMenuData.submenus){
					if($i("menu"+nomeMenu)){
						if(i3GEO.configura.oMenuData.submenus[nomeMenu] !== ""){
							i3GEOoMenuBar.getItem(conta).cfg.setProperty(
								'submenu',
								{
									id:nomeMenu,
									itemdata: i3GEO.configura.oMenuData.submenus[nomeMenu]
								}
							);
						}
						conta=conta+1;
					}
				}
			};
 			i3GEOoMenuBar=new YAHOO.widget.MenuBar(id,{autosubmenudisplay: true, showdelay: 100, hidedelay: 500, lazyload: false});
 			YAHOO.widget.MenuManager.addMenu(i3GEOoMenuBar);
 			i3GEOoMenuBar.beforeRenderEvent.subscribe(onMenuBarBeforeRender);
 			i3GEOoMenuBar.render();
 			//
 			//marca o tipo de interface em uso
 			//
 			try{
	 			if(i3GEO.Interface.ATUAL === "padrao" && $i("omenudataInterface1")){
	 				YAHOO.widget.MenuManager.getMenuItem("omenudataInterface1").cfg.setProperty("checked", true);
	 			}
	 			if(i3GEO.Interface.ATUAL === "openlayers" && $i("omenudataInterface2")){
	 				YAHOO.widget.MenuManager.getMenuItem("omenudataInterface2").cfg.setProperty("checked", true);
	 			}
	 			if(i3GEO.Interface.ATUAL === "flamingo" && $i("omenudataInterface3")){
	 				YAHOO.widget.MenuManager.getMenuItem("omenudataInterface3").cfg.setProperty("checked", true);
	 			}
	 			if(i3GEO.Interface.ATUAL === "googlemaps" && $i("omenudataInterface4")){
	 				YAHOO.widget.MenuManager.getMenuItem("omenudataInterface4").cfg.setProperty("checked", true);
	 			}
	 			if(i3GEO.Interface.ATUAL === "googleearth" && $i("omenudataInterface5")){
	 				YAHOO.widget.MenuManager.getMenuItem("omenudataInterface5").cfg.setProperty("checked", true);
	 			}
 			}catch(e){
 				if(typeof(console) !== 'undefined'){console.warning("i3GEO.gadgets.mostraMenuSuspenso() "+ e);}
 			}
			//
			//desabilita opções em interfaces específicas
			//
			if(i3GEO.Interface.ATUAL !== "padrao" && $i("omenudataArquivos3")){
				YAHOO.widget.MenuManager.getMenuItem("omenudataArquivos3").cfg.setProperty("disabled", true);
			}
			
			//
			//corrige problemas de estilo
			//
			temp = objid.style;
			temp.backgroundPosition = "0px -1px";
			if(navn)
			{temp.border = "0px solid white";}
			else
			{temp.border = "1px dotted white";}
		}
	}
};
//YAHOO.log("carregou classe gadgets", "Classes i3geo");