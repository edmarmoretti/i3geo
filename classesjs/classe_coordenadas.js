/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Coordenadas (apresentação de coordenadas no mapa)

Arquivo: i3geo/classesjs/classe_coordenadas.js

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
Classe: i3GEO.coordenadas

Inclui elementos especiais no mapa para apresentação de coordenadas

*/
i3GEO.coordenadas = {
	/*
	Propriedade: formato
	
	Formato de apresentação das coordenadas
	
	Type:
	{string}
	
	Default:
	"lista"
	
	Valores:
	
	bloco - mostra apenas um dos tipos e uma caixa de seleção
	
	separado - mostra todos os tipos em lugares diferentes conforme o valor de idhtml
	
	lista - mostra cada tipo em um lugar diferente conforme o valor de idhtml
	*/
	formato: "bloco", //bloco,separado,lista,janela
	/*
	Propriedade: padrao
	
	Indica qual tipo de coordenada é mostrado como padrão. Deve existir em i3GEO.coordenadas.config
	
	Default:
	"geoProj"
	*/
	padrao: "geoProj", //so faz sentido se formato for bloco
	/*
	Propriedade: defOrigem
	
	CRS que define a projeção original das coordenadas capturadas na tela. Deve ser o mesmo
	parâmetro definido no mapfile de inicialização do mapa (veja em i3geo/aplicmap/geral1.map ou geral1windows.map)
	
	Default:
	"+proj=longlat +ellps=GRS67 +no_defs"
	*/
	defOrigem: "+proj=longlat +ellps=GRS67 +no_defs", //sad69 geo
	/*
	Propriedade: config
	
	Define as configurações de cada tipo de coordenada mostrada
	
	Para alterar os parâmetros ou acrescentar novas projeções, altere esse objeto por meio de javascript
	
	Para mais detalhes, veja i3geo/classesjs/classe_coordenada.js
	
	Para desativar a apresentação de uma projeção altere o valor de "ativo".
	*/
	config: {
		"geoProj":{
			idhtml: "localizarxy",
			tipo: "geo",
			titulo: "Geo",
			ativo: true,
			defepsg: ""
		},
		"policonicaSad69":{
			idhtml: "localizarxy",
			tipo: "metrica",
			titulo: "Policônica SAD-69",
			ativo: true,
			defepsg: "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=aust_SA +units=m +no_defs"
		},		
		"utmSad69Proj":{
			idhtml: "localizarxy",
			tipo: "utm",
			titulo: "UTM Sad-69",
			ativo: true,
			defepsg: "",
			zona:{
				"19N":"+proj=utm +zone=19 +ellps=aust_SA +units=m +no_defs",
				"20N":"+proj=utm +zone=20 +ellps=aust_SA +units=m +no_defs",
				"21N":"+proj=utm +zone=21 +ellps=aust_SA +units=m +no_defs",
				"22N":"+proj=utm +zone=22 +ellps=aust_SA +units=m +no_defs",
				"17S":"+proj=utm +zone=17 +south +ellps=aust_SA +units=m +no_defs",
				"18S":"+proj=utm +zone=18 +south +ellps=aust_SA +units=m +no_defs",
				"19S":"+proj=utm +zone=19 +south +ellps=aust_SA +units=m +no_defs",
				"20S":"+proj=utm +zone=20 +south +ellps=aust_SA +units=m +no_defs",
				"21S":"+proj=utm +zone=21 +south +ellps=aust_SA +units=m +no_defs",
				"22S":"+proj=utm +zone=22 +south +ellps=aust_SA +units=m +no_defs",
				"23S":"+proj=utm +zone=23 +south +ellps=aust_SA +units=m +no_defs",
				"24S":"+proj=utm +zone=24 +south +ellps=aust_SA +units=m +no_defs",
				"25S":"+proj=utm +zone=25 +south +ellps=aust_SA +units=m +no_defs"			
			}
		},		
		"utmSirgas2000Proj":{
			idhtml: "localizarxy",
			tipo: "utm",
			titulo: "UTM Sirgas 2000",
			ativo: true,
			defepsg: "",
			zona:{
				"11N":"+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"12N":"+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"13N":"+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"14N":"+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"15N":"+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"16N":"+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"17N":"+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"18N":"+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"19N":"+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"20N":"+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"21N":"+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"22N":"+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"17S":"+proj=utm +zone=17 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"18S":"+proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"19S":"+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"20S":"+proj=utm +zone=20 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"21S":"+proj=utm +zone=21 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"22S":"+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"23S":"+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"24S":"+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				"25S":"+proj=utm +zone=25 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
			}
		}
	},
	/*
	Propriedade: PARAMETROS (depreciado)
	
	Parametros de inicialização dos componentes.
	
	Essa variável define os parâmetros individuais de cada componente que pode ser utilizado no mapa.
	
	Você pode acessar os parâmetros da seguinte forma:
	
	i3GEO.coordenadas.PARAMETROS.mostraCoordenadas.idhtml = "";
	
	Nas versões anteriores à 4.5 do i3Geo utilizava-se um 
	
	Default:
	
	i3GEO.coordenadas.PARAMETROS = {

		"mostraCoordenadasUTM":

		{idhtml:"mostraUTM"},

		"mostraCoordenadasGEO":

		{idhtml:"localizarxy"}
	}
	
	Tipo:
	{objeto}
	*/
	PARAMETROS: {
		"mostraCoordenadasUTM":
		{idhtml:"localizarxy"},
		"mostraCoordenadasGEO":
		{idhtml:"localizarxy"}	
	},
	/*
	Function: mostraCoordenadasUTM
	
	Obtém e mostra as coordenadas UTM da posição do mouse sobre o mapa por meio de um cálculo realizado no servidor.
	
	Essa função deixou de ser utilizada na versão 4.5 do i3Geo.
	
	As coordenadas são obtidas por meio de uma chamada AJAX.
	
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.coordenadas.PARAMETROS (mostraCoordenadasUTM) ou altere a variável i3GEO.eventos.MOUSEPARADO
	
	Se i3GEO.coordenadas.mostraCoordenadasUTM.idhtml for igual a i3GEO.coordenadas.mostraCoordenadasGEO.idhtml
	
	os valores mostrados serão intercalados entre GEO e UTM
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.coordenadas.PARAMETROS

	Return:
	
	{JSON} - objeto com x e y
	*/
	mostraCoordenadasUTM: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.coordenadas.mostraCoordenadasUTM()");}
		try{
			if(arguments.length === 0 || id === "" || id == undefined)
			{id = i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml;}
			else
			{i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml = id;}
			if (!$i(id) || i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml == ""){
				if(i3GEO.eventos.MOUSEPARADO.toString().search("atualizaCoordenadasUTM()") >= 0)
				{i3GEO.eventos.MOUSEPARADO.remove("atualizaCoordenadasUTM()");}
				return;
			}
			atualizaCoordenadasUTM = function()
			{
				if(i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml == ""){
					if(i3GEO.eventos.MOUSEPARADO.toString().search("atualizaCoordenadasUTM()") >= 0)
					{i3GEO.eventos.MOUSEPARADO.remove("atualizaCoordenadasUTM()");}
					return;
				}
				if(i3GEO.Interface.STATUS.atualizando.length > 0)
				{return;}
				if(typeof(console) !== 'undefined'){console.info("atualizaCoordenadasUTM()");}
				if(objposicaocursor.imgx < 10 || objposicaocursor.imgy < 10)
				{return;}
				if($i("wdoca")){return;}
				var tempUtm,s,n,i,t;
				//
				//cancela se existir alguma ferramenta ativa
				//
				if(i3GEO.util.verificaScriptTag("i3GEOF") === true)
				{return;}
				tempUtm = function(retorno){
					var funcao,temp,texto;
					funcao = "$i(i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml).style.display='none';"+
					"if(i3GEO.coordenadas.PARAMETROS.mostraCoordenadasGEO.idhtml == i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml)"+
					"{$i(i3GEO.coordenadas.PARAMETROS.mostraCoordenadasGEO.idhtml).style.display='block';i3GEO.coordenadas.mostraCoordenadasGEO();}";
					idSetTimeoutMostraUTM = setTimeout(funcao,3400);
					temp = $i(i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml);
					if(retorno.data){
						temp.style.display="block";
						texto = "<div onclick='javascript:clearTimeout(idSetTimeoutMostraUTM);i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml = \"\";i3GEO.coordenadas.mostraCoordenadasGEO();' style='width:300px;font-size:10px;' >UTM: x="+retorno.data.x+" y="+retorno.data.y+" zn="+retorno.data.zona+" "+retorno.data.datum +
						" &nbsp;<img  class='x' src='"+i3GEO.util.$im("branco.gif")+"' /></div>";
						temp.innerHTML = texto;
					}
				};
				i3GEO.php.geo2utm(tempUtm,objposicaocursor.ddx,objposicaocursor.ddy);
			};
			if(i3GEO.eventos.MOUSEPARADO.toString().search("atualizaCoordenadasUTM()") < 0)
			{i3GEO.eventos.MOUSEPARADO.push("atualizaCoordenadasUTM()");}
		}
		catch(e){alert("mostraCoordenadasUtm: "+e.description);}			
	},
	/*
	Function: mostraCoordenadasGEO
	
	Obtém e mostra as coordenadas Geográficas da posição do mouse sobre o mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML que contenha o 
	id definido em i3GEO.coordenadas.PARAMETROS, por default é "localizarxy"
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.coordenadas.PARAMETROS
	*/	
	mostraCoordenadasGEO: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.coordenadas.mostraCoordenadasGEO()");}
		try{
			var ins,temp;
			if(arguments.length === 0 || id === "" || id == undefined)
			{id = i3GEO.coordenadas.PARAMETROS.mostraCoordenadasGEO.idhtml;}
			else
			{i3GEO.coordenadas.PARAMETROS.mostraCoordenadasGEO.idhtml = id;}
			if($i(id)){
				if(!$i("coordgeotabela")){
					$i(id).innerHTML = i3GEO.coordenadas.criaMascaraDMS("coordgeotabela");
					atualizaLocalizarGeo = function(){
						var temp = $i("coordgeotabela");
						if(temp && temp.style.display === "block")
						{i3GEO.coordenadas.atualizaGeo(objposicaocursor.dmsx,objposicaocursor.dmsy,"coordgeotabela");}
					};
					if(i3GEO.eventos.MOUSEMOVE.toString().search("atualizaLocalizarGeo()") < 0)
					{i3GEO.eventos.MOUSEMOVE.push("atualizaLocalizarGeo()");}
				}
			}
		}
		catch(e){alert("mostraCoordenadasGeo: "+e.description);}
	},
	/*
	Function: geo2zonaUtm
	
	Determina qual é a zona UTM de um par de coordenadas geográficas
	
	Parametros:
	
	long - longitude em décimos de grau
	
	Return:
	
	{number} - zona UTM
	*/
	geo2zonaUtm: function(long){
		long = (long * 1) + 180;
		long = long / 6;
		return parseInt(long,10) + 1;
	},
	/*
	Function: criaMascaraDMS
	
	Cria uma tabela para mostrar as coordenadas no padrão grau minuto e segundo
	
	A tabela criada receberá o id = prefixo
	
	Parametro:
	
	prefixo {string} - prefixo para batizar os ids dos elementos que serão criados
	
	Retorno:
	
	{string} - html com a tabela
	*/
	criaMascaraDMS: function(prefixo,titulo,caixa){
		var ins = "<table id="+prefixo+" style=display:block;text-align:center ><tr style='border-bottom:2px solid white' >" +
		"<td style=width:150px;text-align:right >"+titulo+" X:&nbsp;</td>" +
		"<td>"+$inputText("","315",prefixo+"xg","grau","3","-00")+"&nbsp;</td>" +
		"<td>"+$inputText("","",prefixo+"xm","minuto","3","00")+"&nbsp;</td>" +
		"<td>"+$inputText("","",prefixo+"xs","segundo","5","00.00")+"&nbsp;</td>" +
		"<td>Y:"+$inputText("","",prefixo+"yg","grau","3","-00")+"&nbsp;</td>" +
		"<td>"+$inputText("","",prefixo+"ym","minuto","3","00")+"&nbsp;</td>" +
		"<td>"+$inputText("","",prefixo+"ys","segundo","5","00.00")+"</td>";
		temp = 'var '+prefixo+'xxx = i3GEO.calculo.dms2dd($i("'+prefixo+'xg").value,$i("'+prefixo+'xm").value,$i("'+prefixo+'xs").value);' +
		'var '+prefixo+'yyy = i3GEO.calculo.dms2dd($i("'+prefixo+'yg").value,$i("'+prefixo+'ym").value,$i("'+prefixo+'ys").value);' +
		'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,'+prefixo+'xxx,'+prefixo+'yyy);';		
		ins += '<td><img  class=tic title=zoom onclick="'+temp+'" src="'+i3GEO.util.$im("branco.gif")+'" /></td>' +
		"<td>"+caixa+"<td>" +
		"</tr></table>";
		return ins;
	},
	/*
	Function: atualizaGeo
	
	Atualiza os valores em uma tabela do tipo DMS
	
	Parametros:
	
	dmsx {string} - valors de longitude em "d m s"

	dmsy {string} - valors de latitude em "d m s"
	
	prefixo {string} - prefixo da tabela (veja criaMascaraDMS)
	
	*/
	atualizaGeo: function(dmsx,dmsy,prefixo){
		var x = dmsx.split(" "),
			y = dmsy.split(" ");
		$i(prefixo+"xg").value = x[0];
		$i(prefixo+"xm").value = x[1];
		$i(prefixo+"xs").value = x[2];
		$i(prefixo+"yg").value = y[0];
		$i(prefixo+"ym").value = y[1];
		$i(prefixo+"ys").value = y[2];
	},
	/*
	Function: criaMascaraMetrica
	
	Cria uma tabela para mostrar as coordenadas no padrão métrico (x e y)
	
	A tabela criada receberá o id prefixo+"tabela"
	
	Parametro:
	
	prefixo {string} - prefixo para batizar os ids dos elementos que serão criados
	
	cixa {string} - (opcional) caixa de seleção de tipos
	
	Retorno:
	
	{string} - html com a tabela
	*/
	criaMascaraMetrica: function(prefixo,titulo,caixa){
		var ins = "<table id="+prefixo+" style=display:block;text-align:center ><tr style='border-bottom:2px solid white' >" +
		"<td style=width:150px;text-align:right >"+titulo+" X:&nbsp;</td>" +
		"<td>"+$inputText("","",prefixo+"X","X","12","00")+"&nbsp;</td>" +
		"<td>Y:"+$inputText("","",prefixo+"Y","Y","12","00")+"&nbsp;</td>" +
		"<td>Zn:"+$inputText("","",prefixo+"ZN","Zona","2","--")+"&nbsp;</td>" +
		"<td>"+caixa+"<td>" +
		"</tr></table>";
		return ins;
	},
	/*
	Function: atualizaProj4
	
	Atualiza os valores em uma tabela do tipo x e y com base na biblioteca Proj4
	
	http://trac.osgeo.org/proj4js/wiki/UserGuide
	
	Parametros:
	
	configProj {string}
	
	*/
	atualizaProj4: function(configProj){
		eval("temp = i3GEO.coordenadas.config."+configProj+";");
		try{
			if($i(configProj).style.display == "none")
			{return;}
		}
		catch(e){}
		if(temp.tipo === "metrica"){
			var destino = temp.defepsg;
		}
		if(temp.tipo === "utm"){
			var zona = i3GEO.coordenadas.geo2zonaUtm(objposicaocursor.ddx);
			$i(configProj+"ZN").value = zona
			if(objposicaocursor.ddy*1 > 0)
			{var destino = temp.zona[zona+"N"];}
			else
			{var destino = temp.zona[zona+"S"];}
			if(destino == undefined){
				i3GEO.util.defineValor(configProj+"X","value","?");
				i3GEO.util.defineValor(configProj+"Y","value","?");
				return;
			}
		}		
		Proj4js.defs = {
			'ORIGEM' : i3GEO.coordenadas.defOrigem,
			'DESTINO': destino
		};
		var source = new Proj4js.Proj("ORIGEM"),
			dest = new Proj4js.Proj("DESTINO"),
			p = new Proj4js.Point(objposicaocursor.ddx,objposicaocursor.ddy);
		Proj4js.transform(source, dest, p);
		i3GEO.util.defineValor(configProj+"X","value",p.x);
		i3GEO.util.defineValor(configProj+"Y","value",p.y);
	},
	/*
	Function: ativaBloco
	
	Mostra um tipo de coordenada e esconde os outros.
	
	Mostra o que estiver definido em i3GEO.coordenadas.padrao
	*/
	ativaBloco: function(){
		var tipos = i3GEO.util.listaChaves(i3GEO.coordenadas.config),
			n = tipos.length,
			temp,
			i = 0;
		//
		//cria o HTML e a caixa de seleção
		//
		for(i=0;i<n;i++){
			eval("temp = i3GEO.coordenadas.config."+tipos[i]+";");
			if(temp.ativo === true){
				if(tipos[i] == i3GEO.coordenadas.padrao)
				{$i(tipos[i]).style.display = "block";}
				else
				{$i(tipos[i]).style.display = "none";}
			}
		}
	},
	/*
	Function: mudaTipo
	
	Muda o tipo de coordenada que está sendo mostrada no formato "bloco".
	
	Parametro:
	
	tipo {string} - tipo de coordenada
	*/	
	mudaTipo: function(obj){
		if(obj.value === "janela"){
			i3GEO.coordenadas.formato = "janela";
			i3GEO.coordenadas.mostraCoordenadas();
			return;
		}
		i3GEO.coordenadas.padrao = obj.value;
		obj.selectedIndex = 0;
		i3GEO.coordenadas.ativaBloco();
	},
	/*
	Function: mostraCoordenadas
	
	Constrói o conjunto de elementos HTML para mostrar as coordenadas e define as funções de atualização.
	*/
	mostraCoordenadas: function(){
		try{
			var tipos = i3GEO.util.listaChaves(i3GEO.coordenadas.config),
				n = tipos.length,
				temp,
				ins = "",
				onde = "",
				i = 0,
				caixa = "<select onchange='javascript:i3GEO.coordenadas.mudaTipo(this);' style='font-size:10px;height:15px;width:50px;' ><option>---</option><option value='janela' >janela</option>";
			//
			//cria a caixa de seleção
			//			
			for(i=0;i<n;i++){
				eval("temp = i3GEO.coordenadas.config."+tipos[i]+";");
				if(temp.ativo === true){
					caixa += "<option value='"+tipos[i]+"'>"+temp.titulo+"</option>";
				}
			}
			caixa += "</select>";
			if(i3GEO.coordenadas.formato !== "bloco")
			{caixa = "";}			
			//
			//cria o HTML
			//
			for(i=0;i<n;i++){
				eval("temp = i3GEO.coordenadas.config."+tipos[i]+";");
				if(temp.ativo === true){
					if(temp.tipo === "geo"){
						ins += i3GEO.coordenadas.criaMascaraDMS(tipos[i],temp.titulo,caixa);
						if(i3GEO.coordenadas.formato === "separado"){
							try{$i(temp.idhtml).innerHTML = ins;}
							catch(e){}
							ins = "";
						}
						else
						{onde = temp.idhtml;}
					}
					else{
						ins += i3GEO.coordenadas.criaMascaraMetrica(tipos[i],temp.titulo,caixa);
					}
				}
			}
			if(i3GEO.coordenadas.formato === "janela"){
				var janela = i3GEO.janela.cria(
					"450px",
					"90px",
					"",
					"",
					"",
					"Coordenadas aproximadas",
					"i3GEOJanelaCoordenadas",
					false,
					"hd",
					"",
					""
				);
				temp = $i("i3GEOJanelaCoordenadas_corpo");
				temp.style.backgroundColor = "white";
				temp.style.textAlign = "left";
				temp = $i("i3GEOJanelaCoordenadas");
				temp.onmouseover = "";
				temp.onmouseout = "";
				if($i(onde))
				{$i(onde).innerHTML = "";}
				onde = "i3GEOJanelaCoordenadas_corpo";
			}
			if($i(onde))
			{$i(onde).innerHTML = ins;}
			//
			//aplica as funções de movimentação do mouse
			//
			for(i=0;i<n;i++){
				eval("temp = i3GEO.coordenadas.config."+tipos[i]+";");
				if(temp.ativo === true){
					if(temp.tipo === "geo"){
						atualizaLocalizarGeo = function(id){
							temp = $i(id);
							if(temp && temp.style.display == "block")
							{i3GEO.coordenadas.atualizaGeo(objposicaocursor.dmsx,objposicaocursor.dmsy,id);}
						};
						if(i3GEO.eventos.MOUSEMOVE.toString().search("atualizaLocalizarGeo('"+tipos[i]+"')") < 0)
						{i3GEO.eventos.MOUSEMOVE.push("atualizaLocalizarGeo('"+tipos[i]+"')");}
					}
					else{
						if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.coordenadas.atualizaProj4('"+tipos[i]+"')") < 0)
						{i3GEO.eventos.MOUSEMOVE.push("i3GEO.coordenadas.atualizaProj4('"+tipos[i]+"')");}
					}
				}
			}
			if(i3GEO.coordenadas.formato === "bloco")
			{i3GEO.coordenadas.ativaBloco();}
		}
		catch(e){}
	}
};