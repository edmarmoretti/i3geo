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
	Propriedade: PARAMETROS
	
	Parametros de inicialização dos componentes.
	
	Essa variável define os parâmetros individuais de cada componente que pode ser utilizado no mapa.
	
	Você pode acessar os parâmetros da seguinte forma:
	
	i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml = "";
	
	Para evitar o funcionamento de um componente, experimente utilizar o seguinte exemplo:
	
	i3GEO.coordenadas.PARAMETROS.mostraCoordenadasUTM.idhtml = "";
	
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
	
	Obtém as coordenadas UTM da posição do mouse sobre o mapa.
	
	As coordenadas são obtidas por meio de uma chamada AJAX.
	
	Para o funcionamento correto é necessário incluir essa função no evento que identifica quando o mouse
	está estacionado sobre o mapa. Por default isso já é feito pelo i3Geo.
	
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
	
	Obtém as coordenadas Geográficas da posição do mouse sobre o mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.coordenadas.PARAMETROS (localizarxy)
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.coordenadas.PARAMETROS
	*/	
	mostraCoordenadasGEO: function(id){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.coordenadas.mostraCoordenadasGEO()");}
		try{
			//
			//ativa o evento que preenche os campos de coordenadas
			//
			var ins,temp;
			if(arguments.length === 0 || id === "" || id == undefined)
			{id = i3GEO.coordenadas.PARAMETROS.mostraCoordenadasGEO.idhtml;}
			else
			{i3GEO.coordenadas.PARAMETROS.mostraCoordenadasGEO.idhtml = id;}
			if($i(id)){
				if(!$i("xm")){
					ins = "<table style='text-align:center'><tr>" +
					"<td>X:&nbsp;</td>" +
					"<td>"+$inputText(id,"315","xg","grau","3","-00")+"&nbsp;</td>" +
					"<td>"+$inputText("","","xm","minuto","3","00")+"&nbsp;</td>" +
					"<td>"+$inputText("","","xs","segundo","5","00.00")+"&nbsp;</td>" +
					"<td>Y:"+$inputText("","","yg","grau","3","-00")+"&nbsp;</td>" +
					"<td>"+$inputText("","","ym","minuto","3","00")+"&nbsp;</td>" +
					"<td>"+$inputText("","","ys","segundo","5","00.00")+"</td>";
					temp = 'var xxx = i3GEO.calculo.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);' +
					'var yyy = i3GEO.calculo.dms2dd($i("yg").value,$i("ym").value,$i("ys").value);' +
					'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,xxx,yyy);';		
					ins += "<td><img  class='tic' title='zoom' onclick='"+temp+"' src='"+i3GEO.util.$im("branco.gif")+"' id=procurarxy /></td>" +
					"</tr></table>";
					$i(id).innerHTML = ins;
					atualizaLocalizarxy = function(){
						try{
							var x = objposicaocursor.dmsx.split(" ");
							var y = objposicaocursor.dmsy.split(" ");
							$i("xg").value = x[0];
							$i("xm").value = x[1];
							$i("xs").value = x[2];
							$i("yg").value = y[0];
							$i("ym").value = y[1];
							$i("ys").value = y[2];
						}
						catch(m){
							if(typeof(console) !== 'undefined'){console.error(m);}
						}
					};
					if(i3GEO.eventos.MOUSEMOVE.toString().search("atualizaLocalizarxy()") < 0)
					{i3GEO.eventos.MOUSEMOVE.push("atualizaLocalizarxy()");}
				}
			}
		}
		catch(e){alert("mostraCoordenadasGeo: "+e.description);}
	}
};