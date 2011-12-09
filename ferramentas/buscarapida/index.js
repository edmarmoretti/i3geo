/*
Title: Busca rápida

Procura um lugar

Busca em um serviço de busca, na árvore de temas do i3geo e no serviço do Google.
O resultado é mostrado como uma listagem, permitindo adicionar um novo tema ao mapa conforme o que foi encontrado.

Veja:

<i3GEO.gadgets.mostraBuscaRapida>

Arquivo:

i3geo/ferramentas/buscarapida/index.js

About: Licença

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

/*
Classe: i3GEObuscaRapida
*/
i3GEObuscaRapida = {
	/*
	Property: servico
	
	Endereço do serviço de busca que será utilizado. Esse serviço deve ser um Web Service no padrão reconhecido pelo i3Geo.
	
	Type:
	{String}
	
	Default:
	{http://mapas.mma.gov.br/webservices/geonames.php}
	*/
	servico:"http://mapas.mma.gov.br/webservices/geonames.php",
	/*
	Property: servicowms
	
	Endereço do serviço de busca que será utilizado para retornar a representação cartográfica do elemento encontrado.
	
	Esse serviço deve ser um Web Service no padrão OGC com o parâmetro adicional "gid" indicando o id do elemento que será mostrado na tela.
	
	Type:
	{String}
	
	Default:
	{http://mapas.mma.gov.br/webservices/geonameswms.php}
	*/
	servicowms:"http://mapas.mma.gov.br/webservices/geonameswms.php",
	/*
	Property: funcaoZoom
	
	Nome da função que será executada ao ser clicado o botão de zoom para o elemento encontrado.
	
	O botão de zoom é mostrado logo após cada elemento encontrado na busca.
	
	Alterando-se essa opção, pode-se executar o busca rápida como um gadget.
	
	Veja i3GEObuscaRapida.zoom para conhecer os parâmetros que essa função irá receber
	
	Type:
	{String}
	
	Default:
	{i3GEObuscaRapida.zoom}
	*/
	funcaozoom: "i3GEObuscaRapida.zoom",
	/*
	Property: idresultado
	
	Id do elemento HTML que receberá o resultado da busca
	
	Type:
	{String}
	
	Default:
	{resultado}
	*/
	idresultado:"resultado",
	/*
	Property: buscatemas
	
	Indica se deve ser feita a busca na árvore de temas
	
	Type:
	{boolean}
	
	Default:
	{true}
	*/
	buscaemtemas: true,
	/*
	Variable: palavra
	
	Palavra que será buscada
	
	Type:
	{String}
	*/
	palavra:"",
	/*
	Variable: locaplic
	
	Endereço do i3geo (url)
	
	Type:{String}
	*/
	locaplic:"",
	/*
	Function: inicia
	
	Inicia a busca de uma palavra e mostra o resultado na tela
	
	Veja:
	
	<i3GEO.php.buscaRapida>
	
	Parametros:
	
	palavra {String} - palavra que será procurada
	
	locaplic {String} - url onde o i3geo está instalado, pe, http://localhost/i3geo
	
	resultado {Function} - função que será executada para processar o resultado da busca no servico definido em i3GEObuscaRapida.servicowms. O default é i3GEObuscaRapida.montaResultado
	
	servicosexternos {boolean} - indica se a busca será feita nos serviços de busca externos
	
	temasmapa {boolean} - indica se a busca será feita nos temas existentes no mapa
	*/
	inicia: function(palavra,locaplic,resultado,servicosexternos,temasmapa){
		$i(i3GEObuscaRapida.idresultado).style.display = "none";
		var palavra = i3GEO.util.removeAcentos(palavra);
		i3GEObuscaRapida.palavra = palavra;
		i3GEObuscaRapida.locaplic = locaplic;
		if(servicosexternos === true){
			aguarde("block")
			$i("resultado").innerHTML = "Aguarde..."
			i3GEO.php.buscaRapida(resultado,locaplic,i3GEObuscaRapida.servico,palavra);
		}
		if(temasmapa === true){
			try{
				var verificaTema = window.parent.i3GEO.arvoreDeCamadas.filtraCamadas("itembuscarapida","","diferente",window.parent.i3GEO.arvoreDeCamadas.CAMADAS);
				if(verificaTema.length === 0){
					alert("Nenhum tema configurado para busca");
					return;
				}
				aguarde("block")
				$i("resultadoTemas").innerHTML = "Aguarde..."
				i3GEO.php.buscaRapida(i3GEObuscaRapida.montaResultadoTemas,locaplic,"temas",palavra);
			}
			catch(e){}
		}		
	},
	/*
	Function: montaResultadoTemas
	
	Mostra o resultado da busca nos atributos dos temas existentes no mapa

	Parametro:
	
	retorno {JSON} - resultado da função i3GEO.php.buscaRapida
	*/
	montaResultadoTemas: function(retorno){
		var ins = "Nada encontrado nos temas ou nenhum tema permite busca.<br>";
		try{
			if(retorno.data){
				ins = "<table >";
				for (i=0;i<retorno.data.length; i++){
					ins += "<tr><td style='text-align:left'>"
					ins += retorno.data[i].valor;
					var ext = retorno.data[i].box;
					ins += "</td><td onclick='i3GEObuscaRapida.zoomExt(\""+ext+"\")' onmouseover=\"i3GEObuscaRapida.mostraxy('"+ext+"','extent')\" onmouseout='i3GEObuscaRapida.escondexy()' style='color:blue;cursor:pointer'><img title='localizar' src='../../imagens/branco.gif' class='tic' /></td></tr>"
				}
				ins += "</table>"
			}
		}
		catch(e){var ins = "Nada encontrado nos temas ou nenhum tema permite busca.<br>";}
		$i("resultadoTemas").style.display = "block";
		$i("resultadoTemas").innerHTML = ins;
		aguarde("none");
	},	
	/*
	Function: montaResultado
	
	Mostra o resultado da busca. Esta é a função default utilizada pelo método inicia
	
	Após o resultado ser mostrado, é feita a busca na base de temas, executando-se o método buscaemtemas 
	
	Parametro:
	
	retorno {JSON} - resultado da função i3GEO.php.buscaRapida
	*/
	montaResultado: function(retorno){
		var ins = "Nada encontrado em "+i3GEObuscaRapida.servicowms+"<br>";
		try{
			if(retorno.data){
				if (retorno.data.geonames){
					ins = "";
					for (i=0;i<retorno.data.geonames.length; i++){
						if (i == 0){var ins = "<table >";}
						ins += "<tr><td style='width:30%;text-align:left;background-color:rgb(220,220,220)' colspan=2 ><b>"+retorno.data.geonames[i].tema+"</b></td></tr>";
						var layer = retorno.data.geonames[i].layer
						for (j=0;j<retorno.data.geonames[i].lugares.length; j++){
							ins += "<tr><td style='text-align:left'>"
							var nm = retorno.data.geonames[i].lugares[j].nome;
							ins += nm;
							var wkt = retorno.data.geonames[i].lugares[j].limite
							ins += " "+retorno.data.geonames[i].lugares[j].centroide;
							var gid = retorno.data.geonames[i].lugares[j].gid
							ins += "</td><td onclick=\""+i3GEObuscaRapida.funcaozoom+"('"+wkt+"','"+layer+"','"+gid+"','"+nm+"')\" onmouseover=\"i3GEObuscaRapida.mostraxy('"+wkt+"','wkt')\" onmouseout='i3GEObuscaRapida.escondexy()' style='color:blue;cursor:pointer'><img title='localizar' src='../../imagens/branco.gif' class='tic' /></td></tr>"
						}
					}
				}
				ins += "</table>"
			}
		}
		catch(e){var ins = "Erro ao acessar o serviço "+i3GEObuscaRapida.servico+"<br>";}
		$i(i3GEObuscaRapida.idresultado).style.display = "block";
		$i(i3GEObuscaRapida.idresultado).innerHTML = ins
		aguarde("none")
		if(i3GEObuscaRapida.buscaemtemas){	
			try{
				window.parent.i3GEO.php.procurartemas2(i3GEObuscaRapida.resultadoTemas,i3GEObuscaRapida.palavra,i3GEObuscaRapida.locaplic);	
			}catch(e){}
		}
	},
	/*
	Function: resultadoTemas
	
	Acrescenta nos resultados encontrados os dados localizados na base de temas do i3geo
	
	Essa função é cahamda pelo método montaResultado
	
	Parameters:
	
	retorno {Json} - resultado de 
	*/
	resultadoTemas: function(retorno){
		var retorno = retorno.data;
		if ((retorno != "erro") && (retorno != undefined)){
			var ins = "";
			for (ig=0;ig<retorno.length;ig++){
				var ngSgrupo = retorno[ig].subgrupos;
				for (sg=0;sg<ngSgrupo.length;sg++){
					var nomeSgrupo = ngSgrupo[sg].subgrupo;
					var ngTema = ngSgrupo[sg].temas;
					for (st=0;st<ngTema.length;st++){
						if (ngTema[st].link != " ")
						{var lk = "<a href="+ngTema[st].link+" target=blank>&nbsp;fonte</a>";}
						var tid = ngTema[st].tid;
						var inp = "<input style='text-align:left;cursor:pointer;' onclick='i3GEObuscaRapida.adicionatema(this)' class=inputsb style='cursor:pointer' type=\"checkbox\" value='"+tid+"'  /> ("+nomeSgrupo+")";
						var nomeTema = inp+(ngTema[st].nome)+lk+"<br>";
						ins += nomeTema;
					}
				}
			}
			if (ins != ""){	$i(i3GEObuscaRapida.idresultado).innerHTML += "<br><b>Temas:</b><br>"+ins}
		}
	},
	/*
	Function: zoom
	
	Aplica a operação de zoom quando o usuário clica no botão de adição de um resultado ao mapa.
	
	Essa é a função default utilizada pela ferramenta, podendo ser substituída por outra se desejado.
	
	Além de enquadrar o mapa à uma extensão geográfica específica, uma nova camada é adicionada, mostrando o limite da ocorrência desejada.
	
	Veja:
	
	<i3GEO.php.mudaext>
	
	Parameters:
	
	wkt {String} - string no formato wkt que será usado para definir a abrangência do zoom
	
	layer {String} - nome do layer existente no serviço definido em i3GEObuscaRapida.servicowms e que será adicionado ao mapa como uma camada WMS
	
	gid {String} - identificador que será utilizado no WMS para selecionar o elemento desejado
	
	nm {String} - nome que será dado à acamada que será adicionada ao mapa
	*/
	zoom: function(wkt,layer,gid,nm){
    	var adicionaCamada = function(layer,gid,nm,ext){
	 		var s = i3GEObuscaRapida.servicowms+"?gid="+gid+"&";
			i3GEO.php.adicionaTemaWMS(window.parent.i3GEO.atualiza,s,layer,"default","EPSG:4291","image/png","1.1.0",nm+" - "+layer,"","nao","",i3GEObuscaRapida.locaplic,window.parent.i3GEO.configura.sid);
			i3GEObuscaRapida.zoomExt(ext);
		};
		var ext = i3GEO.util.wkt2ext(wkt,"polygon");
		if(ext == false){alert("wkt invalido");return;}
		try{window.parent.i3GEO.janela.abreAguarde("i3GEO.atualiza","Aguarde...");}catch(e){if(typeof(console) !== 'undefined'){console.error(e);}}
		i3GEO.php.mudaext(adicionaCamada(layer,gid,nm,ext),window.parent.i3GEO.configura.tipoimagem,ext,i3GEObuscaRapida.locaplic,window.parent.i3GEO.configura.sid);
	},
	zoomExt: function(ext){
		if(window.parent.i3GEO.Interface.ATUAL == "googlemaps"){
			window.parent.i3GEO.Interface.googlemaps.zoom2extent(ext);
		}
		if(window.parent.i3GEO.Interface.ATUAL == "googleearth"){
			window.parent.i3GEO.Interface.googleearth.zoom2extent(ext);
		}			
		if(window.parent.i3GEO.Interface.ATUAL == "openlayers"){
			window.parent.i3GEO.Interface.openlayers.zoom2ext(ext);
		}	
	},
	/*
	Function: adicionatema
	
	Adiciona um tema ao mapa quando a busca localiza uma ocorrência nos menus de camadas
	
	Nesse caso, o tema é adicionado ao mapa
	
	Veja:
	
	<i3GEO.php.adtema>
	
	Parameters:
	
	obj {Object dom} - objeto DOM do tipo INPUT tendo como valor o código do tema
	*/
	adicionatema:function(obj){
		if (obj.checked)
		{
			window.parent.i3GEO.janela.abreAguarde("i3GEO.atualiza","Aguarde...");
			var temp = function()
			{window.parent.i3GEO.atualiza("");}
			i3GEO.php.adtema(temp,obj.value,i3GEObuscaRapida.locaplic,window.parent.i3GEO.configura.sid);
		}
		else
		{alert("Escolha um tema");}
	},
	/*
	Function: mostraxy
	
	Mostra no mapa um retângulo representando a extensão geográfica de uma ocorrência encontrada na busca
	
	Parameters:
	
	texto {String} - coordenadas representando a extensão geográfica do elemento
	
	tipo {string} - wkt|extent
	*/
	mostraxy:function mostraxy(texto,tipo){
		try{
			if(!window.parent){return;}
			if(!window.parent.i3GEO){return;}
			if(!window.parent.i3GEO.calculo){return;}
			if(window.parent.i3GEO.Interface.ATUAL === "googleearth")
			{return;}
		}
		catch(e){if(typeof(console) !== 'undefined'){console.error(e);};return;}
		if(tipo === "wkt")
		{var ext = i3GEO.util.wkt2ext(texto,"polygon");}
		else
		{var ext = texto;}
		if(ext == false){alert("texto invalido");return;}	
		var ext = ext.split(" ");
		var xMin = ext[0];
		var xMax = ext[2];
		var yMin = ext[1];
		var yMax = ext[3];
		var docmapa = window.parent.document.getElementById(window.parent.i3GEO.Interface.IDCORPO)
 		var xyMin = window.parent.i3GEO.calculo.dd2tela(xMin,yMin,docmapa,window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)
 		var xyMax = window.parent.i3GEO.calculo.dd2tela(xMax,yMax,docmapa,window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)

		window.parent.i3GEO.util.criaBox("boxg");
		var box = window.parent.$i("boxg");
		var w = xyMax[0]-xyMin[0];
		var h = xyMin[1]-xyMax[1];
		box.style.display = "block";
		box.style.width = w + "px";
		box.style.height = h + "px";
		box.style.top = xyMax[1]+"px";
		box.style.left = xyMin[0]+"px";
	},
	/*
	Function: escondexy
	
	Esconde o box criado com mostraxy
	*/
	escondexy: function(){
		window.parent.i3GEO.util.escondeBox()
	}
}