/*
Title: Busca rápida

Arquivo:

i3geo/ferramentas/buscarapida/index.js

About: Licença

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
/*
Class: i3GEObuscaRapida

Procura a ocorrência de uma palavra em um serviço de busca, na árvore de temas do i3geo e no serviço do Google.

O resultado é mostrado como uma listagem, permitindo-se adicionar um novo tema ao mapa conforme o que foi encontrado.

Essa classe depende da classe i3geo/classesjs/classe_php.php
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
	
	Parameters:
	
	palavra {String} - palavra que será procurada
	
	locaplic {String} - url onde o i3geo está instalado, pe, http://localhost/i3geo
	
	resultado {Function} (opcional) - função que será executada para processar o resultado da busca default é i3GEObuscaRapida.montaResultado
	*/
	inicia: function(palavra,locaplic,resultado){
		if(arguments.length == 2)
		{var resultado = i3GEObuscaRapida.montaResultado;}
		aguarde("block")
		$i("resultado").innerHTML = "Aguarde..."
		var palavra = i3GEO.util.removeAcentos(palavra);
		i3GEObuscaRapida.palavra = palavra;
		i3GEObuscaRapida.locaplic = locaplic;
		i3GEO.php.buscaRapida(resultado,locaplic,i3GEObuscaRapida.servico,palavra);
		//i3GEObuscaRapida.montaResultado()
	},
	/*
	Function: montaResultado
	
	Mostra o resultado da busca. Esta é a função default utilizada pelo método inicia
	
	Após o resultado ser mostrado, é feita a busca na base de temas, executando-se o método buscaemtemas 
	
	Parameters:
	
	retorno {JSON} - resultado da função i3GEO.php.buscaRapida
	*/
	montaResultado: function(retorno){
		var ins = "Nada encontrado em "+i3GEObuscaRapida.servico+"<br>";
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
							ins += "</td><td onclick=\""+i3GEObuscaRapida.funcaozoom+"('"+wkt+"','"+layer+"','"+gid+"','"+nm+"')\" onmouseover=\"i3GEObuscaRapida.mostraxy('"+wkt+"')\" onmouseout='i3GEObuscaRapida.escondexy()' style='color:blue;cursor:pointer'><img title='localizar' src='../../imagens/branco.gif' class='tic' /></td></tr>"
						}
					}
				}
				ins += "</table>"
			}
		}
		catch(e){var ins = "Erro ao acessar o serviço "+i3GEObuscaRapida.servico+"<br>";}
		$i(i3GEObuscaRapida.idresultado).innerHTML = ins
		aguarde("none")
		if(i3GEObuscaRapida.buscaemtemas){	
			try{
				window.parent.i3GEO.php.procurartemas(i3GEObuscaRapida.resultadoTemas,i3GEObuscaRapida.palavra,i3GEObuscaRapida.locaplic);	
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
			if(window.parent.i3GEO.Interface.ATUAL == "googlemaps"){
				window.parent.i3GEO.Interface.googlemaps.zoom2extent(ext);
			}
			if(window.parent.i3GEO.Interface.ATUAL == "openlayers"){
				window.parent.i3GEO.Interface.openlayers.zoom2ext(ext);
			}
		};
		var ext = i3GEO.util.wkt2ext(wkt,"polygon");
		if(ext == false){alert("wkt invalido");return;}
		try{window.parent.objaguarde.abre("i3GEO.atualiza","Aguarde...");}catch(e){if(typeof(console) !== 'undefined'){console.error(e);}}
		i3GEO.php.mudaext(adicionaCamada(layer,gid,nm,ext),window.parent.i3GEO.configura.tipoimagem,ext,i3GEObuscaRapida.locaplic,window.parent.i3GEO.configura.sid);
	},
	/*
	Function: adicionatema
	
	Adiciona um tema ao mapa quando a busca localiza uma ocorrência nos menus de camadas
	
	Nesse caso, o tema é adicionado ao mapa
	
	Parameters:
	
	obj {Object dom} - objeto DOM do tipo INPUT tendo como valor o código do tema
	*/
	adicionatema:function(obj){
		if (obj.checked)
		{
			window.parent.objaguarde.abre("i3GEO.atualiza","Aguarde...");
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
	
	wkt {String} - coordenadas em wkt do tipo polígono representando a extensão geográfica do elemento
	*/
	mostraxy:function mostraxy(wkt){
		try{
			if(!window.parent){return;}
			if(!window.parent.i3GEO){return;}
			if(!window.parent.i3GEO.calculo){return;}
		}
		catch(e){if(typeof(console) !== 'undefined'){console.error(e);};return;}
		var ext = i3GEO.util.wkt2ext(wkt,"polygon");
		if(ext == false){alert("wkt invalido");return;}	
		var ext = ext.split(" ");
		var xMin = ext[0];
		var xMax = ext[2];
		var yMin = ext[1];
		var yMax = ext[3];

 		var xyMin = window.parent.i3GEO.calculo.dd2tela(xMin,yMin,window.parent.document.getElementById("img"),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)
 		var xyMax = window.parent.i3GEO.calculo.dd2tela(xMax,yMax,window.parent.document.getElementById("img"),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)

		window.parent.i3GEO.util.criaBox("boxg");
		var box = window.parent.$i("boxg");
		var w = xyMax[0]-xyMin[0];
		var h = xyMin[1]-xyMax[1];
		box.style.display = "block";
		box.style.width = w;
		box.style.height = h;
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