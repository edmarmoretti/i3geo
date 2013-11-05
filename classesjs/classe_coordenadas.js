/*
Title: Coordenadas

i3GEO.coordenadas

Inclui elementos HTML especiais no mapa para apresenta&ccedil;&atilde;o de coordenadas.

Cont&eacute;m fun&ccedil;&otilde;es que permitem a convers&atilde;o de coordenadas, entre sistemas de proje&ccedil;&atilde;o deiferentes, com base na biblioteca Proj4js.
Cria tamb&eacute;m o bloco de apresenta&ccedil;&atilde;o de coordenadas com base na posi&ccedil;&atilde;o do mouse sobre o mapa.
Mais informa&ccedil;&otilde;es em http://trac.osgeo.org/proj4js/
Para adicionar novas proje&ccedil;&otilde;es ou modificar as atuais, edit a vari&aacute;vel i3GEO.coordenadas.config e defOrigem


Arquivo: i3geo/classesjs/classe_coordenadas.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
i3GEO.coordenadas = {
	/*
	Propriedade: formato

	Formato de apresenta&ccedil;&atilde;o das coordenadas

	Type:
	{string}

	Default:
	"lista"

	Valores:

	bloco - mostra apenas um dos tipos e uma caixa de sele&ccedil;&atilde;o

	separado - mostra todos os tipos em lugares diferentes conforme o valor de idhtml

	lista - mostra cada tipo em um lugar diferente conforme o valor de idhtml

	janela - cria uma janela flutuante para mostrar os dados

	*/
	formato: "bloco", //bloco,separado,lista,janela
	/*
	Propriedade: padrao

	Indica qual tipo de coordenada &eacute; mostrado como padr&atilde;o quando formato for igual a "bloco".

	Deve existir em i3GEO.coordenadas.config

	Default:
	"geoProj"
	*/
	padrao: "geoProj", //so faz sentido se formato for bloco
	/*
	Propriedade: defOrigem

	CRS que define a proje&ccedil;&atilde;o original das coordenadas capturadas na tela. Deve ser o mesmo
	parâmetro definido no mapfile de inicializa&ccedil;&atilde;o do mapa (veja em i3geo/aplicmap/geral1.map ou geral1windows.map)

	Default:
	"+proj=longlat +ellps=GRS67 +no_defs"
	*/
	defOrigem: "+proj=longlat +ellps=GRS67 +no_defs", //sad69 geo
	/*
	Propriedade: config

	Define as configura&ccedil;&otilde;es de cada tipo de coordenada que ser&aacute; utilizada e/ou mostrada no mapa

	Para alterar os parâmetros ou acrescentar novas proje&ccedil;&otilde;es, altere esse objeto

	Para mais detalhes, veja i3geo/classesjs/classe_coordenada.js

	Para desativar a apresenta&ccedil;&atilde;o de uma proje&ccedil;&atilde;o altere o valor de "ativo".
	*/
	config: {
		"geoProj":{
			idhtml: "localizarxy",
			tipo: "geo",
			titulo: "Geo",
			ativo: true,
			defepsg: ""
		},
		"dd":{
			idhtml: "localizarxy",
			tipo: "metrica",
			titulo: "D&eacute;c. de grau",
			ativo: true,
			defepsg: ""
		},
		"policonicaSad69":{
			idhtml: "localizarxy",
			tipo: "metrica",
			titulo: "Polic SAD-69",
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
			titulo: "UTM Sirgas",
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
	Parametros de inicializa&ccedil;&atilde;o dos componentes.

	Essa vari&aacute;vel define os parâmetros individuais de cada componente que pode ser utilizado no mapa.

	Voc&ecirc; pode acessar os parâmetros da seguinte forma:

	i3GEO.coordenadas.PARAMETROS.mostraCoordenadas.idhtml = "";

	Nas vers&otilde;es anteriores à 4.5 do i3Geo utilizava-se um

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
	Variavel: MODOTEXTO

	Representa&ccedil;&atilde;o das coordenadas no modo texto
	*/
	MODOTEXTO: "",
	/*
	Function: mostraCoordenadasUTM

	Obt&eacute;m e mostra as coordenadas UTM da posi&ccedil;&atilde;o do mouse sobre o mapa por meio de um c&aacute;lculo realizado no servidor.

	Essa fun&ccedil;&atilde;o deixou de ser utilizada na vers&atilde;o 4.5 do i3Geo.

	As coordenadas s&atilde;o obtidas por meio de uma chamada AJAX.

	Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML existente no mapa que contenha o
	id definido em i3GEO.coordenadas.PARAMETROS (mostraCoordenadasUTM) ou altere a vari&aacute;vel i3GEO.eventos.MOUSEPARADO

	Se i3GEO.coordenadas.mostraCoordenadasUTM.idhtml for igual a i3GEO.coordenadas.mostraCoordenadasGEO.idhtml

	os valores mostrados ser&atilde;o intercalados entre GEO e UTM

	Parametro:

	id {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de
	i3GEO.coordenadas.PARAMETROS

	Return:

	{JSON} - objeto com x e y
	*/
	mostraCoordenadasUTM: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.coordenadas.mostraCoordenadasUTM()");}
		try{
			if(arguments.length === 0 || id === "" || typeof(id) === 'undefined')
			{id = this.PARAMETROS.mostraCoordenadasUTM.idhtml;}
			else
			{this.PARAMETROS.mostraCoordenadasUTM.idhtml = id;}
			if (!$i(id) || this.PARAMETROS.mostraCoordenadasUTM.idhtml === ""){
				if(i3GEO.eventos.MOUSEPARADO.toString().search("atualizaCoordenadasUTM()") >= 0)
				{i3GEO.eventos.MOUSEPARADO.remove("atualizaCoordenadasUTM()");}
				return;
			}
			atualizaCoordenadasUTM = function()
			{
				if(this.PARAMETROS.mostraCoordenadasUTM.idhtml === ""){
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
				//
				//cancela se existir alguma ferramenta ativa
				//
				if(i3GEO.util.verificaScriptTag("i3GEOF") === true)
				{return;}
				var tempUtm = function(retorno){
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
		catch(e){i3GEO.janela.tempoMsg("mostraCoordenadasUtm: "+e.description);}
	},
	/*
	Function: mostraCoordenadasGEO

	Obt&eacute;m e mostra as coordenadas Geogr&aacute;ficas da posi&ccedil;&atilde;o do mouse sobre o mapa.

	Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML que contenha o
	id definido em i3GEO.coordenadas.PARAMETROS, por default &eacute; "localizarxy"

	Parametro:

	id {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de
	i3GEO.coordenadas.PARAMETROS
	*/
	mostraCoordenadasGEO: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.coordenadas.mostraCoordenadasGEO()");}
		try{
			if(arguments.length === 0 || id === "" || typeof(id) === 'undefined')
			{id = this.PARAMETROS.mostraCoordenadasGEO.idhtml;}
			else
			{this.PARAMETROS.mostraCoordenadasGEO.idhtml = id;}
			if($i(id)){
				if(!$i("coordgeotabela")){
					$i(id).innerHTML = i3GEO.coordenadas.criaMascaraDMS("coordgeotabela");
					atualizaLocalizarGeo = function(){
						var temp = $i("coordgeotabela");
						if(temp && temp.style.display === "block")
						{i3GEO.coordenadas.atualizaGeo(objposicaocursor.dmsx,objposicaocursor.dmsy,"coordgeotabela");}
					};
					if(i3GEO.Interface.TABLET === true){
						if(i3GEO.eventos.MOUSECLIQUE.toString().search("atualizaLocalizarGeo()") < 0)
						{i3GEO.eventos.MOUSECLIQUE.push("atualizaLocalizarGeo()");}
					}
					else{
						if(i3GEO.eventos.MOUSEMOVE.toString().search("atualizaLocalizarGeo()") < 0)
						{i3GEO.eventos.MOUSEMOVE.push("atualizaLocalizarGeo()");}
					}
				}
			}
		}
		catch(e){i3GEO.janela.tempoMsg("mostraCoordenadasGeo: "+e.description);}
	},
	/*
	Function: geo2zonaUtm

	Determina qual &eacute; a zona UTM de um par de coordenadas geogr&aacute;ficas

	Parametros:

	long - longitude em d&eacute;cimos de grau

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

	Cria uma tabela para mostrar as coordenadas no padr&atilde;o grau minuto e segundo

	A tabela criada receber&aacute; o id = prefixo

	Parametro:

	prefixo {string} - prefixo para batizar os ids dos elementos que ser&atilde;o criados

	Retorno:

	{string} - html com a tabela
	*/
	criaMascaraDMS: function(prefixo,titulo,caixa){
		var ins = '<table class="i3GeoMascaraCoord" id='+prefixo+' ><tr>' +
				"<td>"+caixa+"&nbsp;</td>" +
				'<td style=width:10px;text-align:right >&nbsp;X:&nbsp;</td>' +
				'<td>'+$inputText('','',prefixo+'xg','grau','3','-00')+'</td>' +
				'<td>'+$inputText('','',prefixo+'xm','minuto','2','00')+'</td>' +
				'<td>'+$inputText('','',prefixo+'xs','segundo','5','00.00')+'</td>' +
				'<td>&nbsp;Y:&nbsp;'+$inputText('','',prefixo+'yg','grau','3','-00')+'</td>' +
				'<td>'+$inputText('','',prefixo+'ym','minuto','2','00')+'</td>' +
				'<td>'+$inputText('','',prefixo+'ys','segundo','5','00.00')+'</td>',
			temp = 'var '+prefixo+'xxx = i3GEO.calculo.dms2dd($i(\''+prefixo+'xg\').value,$i(\''+prefixo+'xm\').value,$i(\''+prefixo+'xs\').value);' +
				'var '+prefixo+'yyy = i3GEO.calculo.dms2dd($i(\''+prefixo+'yg\').value,$i(\''+prefixo+'ym\').value,$i(\''+prefixo+'ys\').value);' +
				'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,'+prefixo+'xxx,'+prefixo+'yyy);';
		ins += '<td><img class=tic title=zoom onclick="'+temp+'" src="'+i3GEO.util.$im("branco.gif")+'" /></td>' +
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
		i3GEO.coordenadas.MODOTEXTO += "DMS - Latitude: "+y[0]+" "+y[1]+" "+y[2]+" Longitude: "+x[0]+" "+x[1]+" "+x[2]+"<br>";
	},
	/*
	Function: criaMascaraMetrica

	Cria uma tabela para mostrar as coordenadas no padr&atilde;o m&eacute;trico (x e y)

	A tabela criada receber&aacute; o id prefixo+"tabela"

	Parametro:

	prefixo {string} - prefixo para batizar os ids dos elementos que ser&atilde;o criados

	cixa {string} - (opcional) caixa de sele&ccedil;&atilde;o de tipos

	Retorno:

	{string} - html com a tabela
	*/
	criaMascaraMetrica: function(prefixo,titulo,caixa){
		var ins = "<table id="+prefixo+" class='i3GeoMascaraCoord' ><tr>" +
		"<td>"+caixa+"&nbsp;<td>" +
		"<td style=width:100px;text-align:right >"+titulo+" X:&nbsp;</td>" +
		"<td>"+$inputText("","",prefixo+"X","X","12","00")+"&nbsp;</td>" +
		"<td>Y:"+$inputText("","",prefixo+"Y","Y","12","00")+"&nbsp;</td>" +
		"<td>Zn:"+$inputText("","",prefixo+"ZN","Zona","2","--")+"&nbsp;</td>" +
		"</tr></table>";
		return ins;
	},
	/*
	Atualiza os valores em uma tabela do tipo x e y com base na biblioteca Proj4

	http://trac.osgeo.org/proj4js/wiki/UserGuide

	Parametros:

	configProj {string}

	*/
	atualizaProj4: function(onde,configProj,x,y){
		var zona,temp,p,
			destino = "",
			iu = i3GEO.util;
		try{
			if(!$i(onde+configProj+"ZN"))
			{return;}
		}
		catch(e){return;}
		temp = i3GEO.coordenadas.config[configProj];
		try{
			if($i(onde+configProj).style.display === "none")
			{return;}
		}
		catch(men){}
		if(temp.tipo === "metrica"){
			destino = temp.defepsg;
		}
		if(typeof(x) === 'undefined')
		{x = objposicaocursor.ddx;}
		if(typeof(y) === 'undefined')
		{y = objposicaocursor.ddy;}
		if(temp.tipo === "utm"){
			zona = i3GEO.coordenadas.geo2zonaUtm(x);
			$i(onde+configProj+"ZN").value = zona;
			if(objposicaocursor.ddy*1 > 0)
			{destino = temp.zona[zona+"N"];}
			else
			{destino = temp.zona[zona+"S"];}
			if(typeof(destino) === 'undefined'){
				iu.defineValor(onde+configProj+"X","value","?");
				iu.defineValor(onde+configProj+"Y","value","?");
				return;
			}
		}
		//
		//no caso de dd
		//
		if(temp.defepsg === "" && temp.tipo === "metrica")
		{p = {x:x,y:y};}
		else
		{p = i3GEO.coordenadas.calculaProj4(i3GEO.coordenadas.defOrigem,destino,x,y);}
		iu.defineValor(onde+configProj+"X","value",p.x);
		iu.defineValor(onde+configProj+"Y","value",p.y);
		i3GEO.coordenadas.MODOTEXTO += temp.titulo+" - X: "+p.x+" Y: "+p.y+"<br>";
	},
	/*
	Function: calculaProj4

	Faz a proje&ccedil;&atilde;o de x e y da origem para o destino

	Parametros:

	origem {string} - CRS contendo o c&oacute;digo da proje&ccedil;&atilde;o de origem

	destino {string} - CRS contendo o c&oacute;digo da proje&ccedil;&atilde;o de destino

	x {numerico} - coordenada x ou longitude

	y {numerico} - coordenada y ou latitude

	Retorno:

	{Proj4js.transform}
	*/
	calculaProj4: function(origem,destino,x,y){
		Proj4js.defs = {
			'ORIGEM' : origem,
			'DESTINO': destino
		};
		//para corrigir o path do proj4js
		//var url = Proj4js.getScriptLocation() + 'defs/' + this.srsAuth.toUpperCase() + this.srsProjNumber + '.js';
		Proj4js.getScriptLocation = function(){
			return i3GEO.configura.locaplic + "/pacotes/proj4js/lib/";
		};
		var source = new Proj4js.Proj("ORIGEM"),
			dest = new Proj4js.Proj("DESTINO"),
			p = new Proj4js.Point(x,y);
		Proj4js.transform(source, dest, p);
		return p;
	},
	/*
	Mostra um tipo de coordenada e esconde os outros.

	Mostra o que estiver definido em i3GEO.coordenadas.padrao
	*/
	ativaBloco: function(prefixo){
		var tipos = i3GEO.util.listaChaves(i3GEO.coordenadas.config),
			n = tipos.length,
			temp,
			i = 0;
		//
		//cria o HTML e a caixa de sele&ccedil;&atilde;o
		//
		for(i=0;i<n;i++){
			temp = i3GEO.coordenadas.config[tipos[i]];
			if(temp.ativo === true){
				if(tipos[i] === this.padrao)
				{$i(prefixo+tipos[i]).style.display = "block";}
				else
				{$i(prefixo+tipos[i]).style.display = "none";}
			}
		}
	},
	/*
	Muda o tipo de coordenada que est&aacute; sendo mostrada no formato "bloco".

	Parametro:

	tipo {string} - tipo de coordenada
	*/
	mudaTipo: function(obj,onde){
		if(obj.value === "janela"){
			this.formato = "janela";
			this.mostraCoordenadas();
			return;
		}
		this.padrao = obj.value;
		obj.selectedIndex = 0;
		i3GEO.coordenadas.ativaBloco(onde);
	},
	/*
	Function: mostraCoordenadas

	Constr&oacute;i o conjunto de elementos HTML para mostrar as coordenadas e define as fun&ccedil;&otilde;es de atualiza&ccedil;&atilde;o.

	Parametro:

	ativaMovimento {boolean} - (opcional) aplica ou n&atilde;o as fun&ccedil;&otilde;es ligadas à movimenta&ccedil;&atilde;o do mouse

	onde {string} - (opcional) id onde o resultado ser&aacute; mostrado (ir&aacute; ignorar os ids definidos em coordenadas.config)
	*/
	mostraCoordenadas: function(ativaMovimento,onde,x,y){
		try{
			var tipos = i3GEO.util.listaChaves(i3GEO.coordenadas.config),
				n = tipos.length,
				temp,
				ins = "",
				i = 0,
				caixa,
				janela;
			i3GEO.coordenadas.MODOTEXTO = "";
			if(arguments.length === 0){
				ativaMovimento = true;
				onde = "";
			}
			//
			//cria o HTML
			//
			if(onde === "")
			{onde = i3GEO.coordenadas.config[tipos[0]].idhtml;}
			caixa = "<select onchange='javascript:i3GEO.coordenadas.mudaTipo(this,\""+onde+"\");' class='i3geoCoordenadasComboTipo' ><option>---</option><option value='janela' >janela</option>";
			//
			//cria a caixa de sele&ccedil;&atilde;o
			//
			for(i=0;i<n;i += 1){
				temp = i3GEO.coordenadas.config[tipos[i]];
				if(temp.ativo === true){
					caixa += "<option value='"+tipos[i]+"'>"+temp.titulo+"</option>";
				}
			}
			caixa += "</select>";
			if(i3GEO.coordenadas.formato !== "bloco")
			{caixa = "";}
			for(i=0;i<n;i += 1){
				temp = i3GEO.coordenadas.config[tipos[i]];
				if(temp.ativo === true){
					if(temp.tipo === "geo"){
						ins += i3GEO.coordenadas.criaMascaraDMS(onde+tipos[i],temp.titulo,caixa);
						if(i3GEO.coordenadas.formato === "separado"){
							try{$i(temp.idhtml).innerHTML = ins;}
							catch(e){}
							ins = "";
						}
					}
					else{
						ins += i3GEO.coordenadas.criaMascaraMetrica(onde+tipos[i],temp.titulo,caixa);
					}
				}
			}
			if(this.formato === "janela"){
				janela = i3GEO.janela.cria(
					"450px",
					"120px",
					"",
					"",
					"",
					$trad("x49"),
					"i3GEOJanelaCoordenadas",
					false,
					"hd",
					"",
					""
				);
				YAHOO.util.Event.addListener(janela[0].close, "click", function(){i3GEO.coordenadas.formato = "bloco",i3GEO.coordenadas.mostraCoordenadas();});
				temp = $i("i3GEOJanelaCoordenadas_corpo");
				temp.style.backgroundColor = "white";
				temp.style.textAlign = "left";
				temp = $i("i3GEOJanelaCoordenadas");
				temp.onmouseover = "";
				temp.onmouseout = "";
				if($i(onde))
				{$i(onde).innerHTML = "";}
				onde = "i3GEOJanelaCoordenadas_corpo";

				ins += "<br><a href='#' style='cursor:pointer;color:blue' onclick='new YAHOO.util.KeyListener(document.body,{alt:true,keys:67},{fn: function(type, args, obj){i3GEO.janela.tempoMsg(i3GEO.coordenadas.MODOTEXTO);}}).enable();' >" +
					"Clique aqui para ativar Alt+C para poder capturar as coordenadas</a>";
			}
			if(onde !== "" && $i(onde))
			{$i(onde).innerHTML = ins;}
			//
			//aplica as fun&ccedil;&otilde;es de movimenta&ccedil;&atilde;o do mouse
			//
			atualizaLocalizarGeo = function(id,x,y){
				if(typeof(x) === 'undefined')
				{x = objposicaocursor.dmsx;}
				if(typeof(y) === 'undefined')
				{y = objposicaocursor.dmsy;}
				temp = $i(id);
				if(temp && temp.style.display === "block")
				{i3GEO.coordenadas.atualizaGeo(x,y,id);}
			};
			for(i=0;i<n;i += 1){
				temp = i3GEO.coordenadas.config[tipos[i]];
				if(temp.ativo === true){
					if(temp.tipo === "geo"){
						if(ativaMovimento === true){
							if(i3GEO.Interface.TABLET === true){
								if(i3GEO.eventos.MOUSECLIQUE.toString().search("atualizaLocalizarGeo('"+onde+tipos[i]+"')") < 0)
								{i3GEO.eventos.MOUSECLIQUE.push("atualizaLocalizarGeo('"+onde+tipos[i]+"')");}
							}
							else{
								if(i3GEO.eventos.MOUSEMOVE.toString().search("atualizaLocalizarGeo('"+onde+tipos[i]+"')") < 0)
								{i3GEO.eventos.MOUSEMOVE.push("atualizaLocalizarGeo('"+onde+tipos[i]+"')");}
							}
						}
						if(typeof(x) !== 'undefined'){
							atualizaLocalizarGeo(onde+tipos[i],i3GEO.calculo.dd2dms(x)[0],i3GEO.calculo.dd2dms(y)[0]);
						}
					}
					else{
						if(ativaMovimento === true){
							if(i3GEO.Interface.TABLET === true){
								if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.coordenadas.atualizaProj4('"+onde+"','"+tipos[i]+"')") < 0)
								{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.coordenadas.atualizaProj4('"+onde+"','"+tipos[i]+"')");}
							}
							else{
								if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.coordenadas.atualizaProj4('"+onde+"','"+tipos[i]+"')") < 0)
								{i3GEO.eventos.MOUSEMOVE.push("i3GEO.coordenadas.atualizaProj4('"+onde+"','"+tipos[i]+"')");}
							}
						}
						if(typeof(x) !== 'undefined'){
							i3GEO.coordenadas.atualizaProj4(onde,tipos[i],x,y);
						}
					}
				}
			}
			if(ativaMovimento === true){
				if(i3GEO.Interface.TABLET === true){
					if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.coordenadas.limpaModoTexto()") < 0)
					{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.coordenadas.limpaModoTexto()");}
				}
				else{
					if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.coordenadas.limpaModoTexto()") < 0)
					{i3GEO.eventos.MOUSEMOVE.push("i3GEO.coordenadas.limpaModoTexto()");}
				}
			}
			if(i3GEO.coordenadas.formato === "bloco")
			{i3GEO.coordenadas.ativaBloco(onde);}
		}
		catch(men){}
	},
	limpaModoTexto: function(){
		i3GEO.coordenadas.MODOTEXTO = "";
	}
};
