/*
Class:: i3GEO.gadgets

Inclui elementos especiais no mapa

Os elementos são opcionais e adicionam funcionalidades ao mapa.

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
		"mostraBuscaRapida":
		{idhtml:"buscaRapida"},
		"mostraVisual":
		{idhtml:"visual"}
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
	
	locaplic {String} - localização da instalação do i3GEO. Por default será utilizado
	i3GEO.configura.locapli
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	
	sid {String} - código da seção i3Geo no servidor
	
	Return:
	
	{JSON} - objeto com x e y
	*/
	mostraCoordenadasUTM: function(locaplic,id,sid){
		if(objposicaocursor.imgx < 10 || objposicaocursor.imgy < 10)
		{return;}
		if(arguments.length == 0 || locaplic == "")
		{var locaplic = i3GEO.configura.locaplic;}
		if(arguments.length < 2 || locaplic == "" || id == "")
		{var id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml;}
		if(arguments.length < 3 || locaplic == "" || id == "" || sid == "")
		{var sid = i3GEO.configura.sid;}
		var temp = $i(id);
		if (!temp){return;}
		if(temp.style.display == "block"){return;}
		var mostra = function(retorno)
		{
			temp.style.display="block";
			temp.innerHTML = "UTM: x="+retorno.data.x+" y="+retorno.data.y+" zona="+retorno.data.zona+" datum="+retorno.data.datum;
			return (retorno.data);
		};
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+objposicaocursor.ddx+"&y="+objposicaocursor.ddy+"&g_sid="+sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_persistent_connection(true);
		cp.set_response_type("JSON");
		cp.call(p,"geo2utm",mostra);
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
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml;}
		atualizaLocalizarxy = function(){
			var x = objposicaocursor.dmsx.split(" ");
			var y = objposicaocursor.dmsy.split(" ");
			$i3geo_temp_xg.value = x[0];
			$i3geo_temp_xm.value = x[1];
			$i3geo_temp_xs.value = x[2];
			$i3geo_temp_yg.value = y[0];
			$i3geo_temp_ym.value = y[1];
			$i3geo_temp_ys.value = y[2];
		};
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
				var temp = 'var xxx = i3GEO.util.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);';
				temp +=	'var yyy = i3GEO.util.dms2dd($i("yg").value,$i("ym").value,$i("ys").value);';
				temp +=	'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,xxx,yyy);';		
				ins += "<td><img  class='tic' title='zoom' onclick='"+temp+"' src='"+$im("branco.gif")+"' id=procurarxy /></td>";
				ins += "</tr></table>";
				$i(id).innerHTML = ins;
				$i3geo_temp_xg = $i("xg");
				$i3geo_temp_xm = $i("xm");
				$i3geo_temp_xs = $i("xs");
				$i3geo_temp_yg = $i("yg");
				$i3geo_temp_ym = $i("ym");
				$i3geo_temp_ys = $i("ys");
				if($i("img"))
				{$i("img").addEventListener('mousemove',atualizaLocalizarxy,false);}
			}
		}
	},
	/*
	Function: mostraEscalaNumerica
	
	Mostra no mapa a escala numérica.
	
	A escala numérica pode ser alterada pelo usuário digitando-se a nova escala.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (escala)
	
	Parameters:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/		
	mostraEscalaNumerica: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;}
		if($i(id)){
			atualizaEscalaNumerica = function(escala){
				if(arguments.length == 1)
				$i("i3geo_escalanum").value = escala;
				else
				$i("i3geo_escalanum").value = parseInt(objmapa.scale);
			};
			if(!$i("i3geo_escalanum")){
				var i = $inputText(id,"138","i3geo_escalanum",$trad("d10"),"19","");
				var ins = "<table><tr><td>1:"+i;
				var temp = 'var nova = document.getElementById("i3geo_escalanum").value;';
				temp += 'i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,nova);';
				ins += "</td><td><img src='"+$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				$i(id).innerHTML = ins;
			}
			if(g_funcoesNavegaMapaDefault.toString().search("atualizaEscalaNumerica()") < 0)
			{g_funcoesNavegaMapaDefault.push("atualizaEscalaNumerica()");}		
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
			ins += "</td><td><img src='"+$im("branco.gif")+"' class='tic' onclick='i3geo_buscaRapida()' /></td></tr></table>";
			$i(id).innerHTML = ins;
		}	
	},
	visual: {
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
					var elementos = new Array("vertMaisZoom","vertMenosZoom","foldermapa","foldermapa1","tic");
					var i = elementos.length-1;
					if(i >= 0){
						do{
							if ($i(elementos[i])){
								$i(elementos[i]).style.backgroundImage = "url('"+caminho+"sprite.png')";
								for (var j=0;j < imgs.length; j++){
									var busca = imgs[j].split(".");
									if (busca[0] == elementos[i])
									{$i(elementos[i]).style.backgroundImage = "url('"+caminho+imgs[j]+"')";}
								}				
							}
						}
						while(i--)
					}
					g_visual = visual;
				}
				catch(e){alert("Ocorreu um erro. mudaVisual"+e);i3GEO.janela.fechaAguarde("ajaxredesenha");}
			};
			//
			//pega a lista de imagens no diretório do i3geo correspondente ao visual selecionado
			//
			i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaArquivos&g_sid="+i3GEO.configura.sid+"&diretorio=imagens/visual/"+visual;
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"mudaVisual",monta);
		}
	}
};