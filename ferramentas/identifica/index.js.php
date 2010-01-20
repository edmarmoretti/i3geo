<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Ferramenta Identifica

File: i3geo/ferramentas/identifica/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Class: i3GEOF.identifica

Obtém os atributos de um tema para uma coordenada.

Abre uma janela com várias opções e lista de temas disponíveis no mapa atual.

Essa classe depende da classe i3geo/classesjs/classe_php.php
*/
i3GEOF.identifica = {
	/*
	Variavel: mostraLinkGeohack
	
	Mostra ou não o link para abrir o site GeoHack.
	
	Este site permite o uso de vários buscadores disponíveis na internet.
	
	Type:
	{boolean}
	*/
	mostraLinkGeohack: true,
	/*
	Variavel: mostraSistemasAdicionais
	
	Mostra ou não a lista de sistemas adicionais de busca de dados.

	Type:
	{boolean}
	*/	
	mostraSistemasAdicionais: true,
	/*
	Variavel: tema
	
	Código do tema que será pesquisado
	
	Type:
	{String}
	*/
	tema: "",
	/*
	Variavel: x
	
	Coordenada x
	
	Type:
	{Numeric}
	*/
	x: 0,
	/*
	Variavel: y
	
	Coordenada y
	
	Type:
	{Numeric}
	*/
	y: 0,
	/*
	Variavel: sistemasAdicionais
	
	Guarda a lista de sistemas adicionais que são incluídos na seleção de temas
	
	Type:
	{Array}
	*/
	sistemasAdicionais: [],
	/*
	Function: inicia
	
	Inicia a janela de informações
	
	Parameters:
	
	tema {String} - código do tema, existente no mapfile armazenado na seção, que será consultado já na inicialização

	x {Numeric} - coordenada x do ponto que será utilizado para busca dos atributos
	
	y {Numeric} - coordenada y do ponto
	
	iddiv {String} - id do elemento html onde o conteúdo da ferramenta será incluido
	
	mostraLinkGeohack {boolean} - mostra ou não o link para o site geohacks
	
	mostraSistemasAdicionais {boolean} - mostra ou não os sistemas adicionais de busca de dados
	*/
	inicia: function(tema,x,y,iddiv,mostraLinkGeohack,mostraSistemasAdicionais){
		try{
			var g_locidentifica;
			$i(iddiv).innerHTML += i3GEOF.identifica.html();
			i3GEOF.identifica.tema = tema;
			i3GEOF.identifica.x = x;
			i3GEOF.identifica.y = y;
			i3GEOF.identifica.mostraLinkGeohack = mostraLinkGeohack;
			i3GEOF.identifica.mostraSistemasAdicionais = mostraSistemasAdicionais;
			i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1","i3GEOidentificaguia");
			//eventos das guias
			$i("i3GEOidentificaguia1").onclick = function(){i3GEOF.identifica.listaTemas("ligados");i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1","i3GEOidentificaguia");};
			$i("i3GEOidentificaguia2").onclick = function(){i3GEOF.identifica.listaTemas("todos");i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1","i3GEOidentificaguia");};
			$i("i3GEOidentificaguia3").onclick = function(){i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia3","i3GEOidentificaguia");};
			$i("i3GEOidentificaguia4").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia4","i3GEOidentificaguia");
				new YAHOO.widget.Button("i3GEOidentificabotao1",{onclick:{fn: function(){
					//window.location.href = "../etiqueta/index.htm?tema="+tema;
					if(i3GEO.temaAtivo !== "")
					{i3GEO.tema.dialogo.etiquetas(i3GEO.temaAtivo);}
					else
					{alert("Nenhum tema definido");}
				}}});
			};
			i3GEOF.identifica.listaTemas("ligados");
			//
			//verifica se existem sistemas para identificar
			//
			if(i3GEOF.identifica.mostraSistemasAdicionais === true){
				if (i3GEO.parametros.locidentifica !== ""){
					if(i3GEO.tempXMLSISTEMAS === undefined)
					{i3GEO.util.ajaxexecASXml(i3GEO.parametros.locidentifica,"i3GEOF.identifica.montaListaSistemas");}
					else
					{i3GEOF.identifica.montaListaSistemas(i3GEO.tempXMLSISTEMAS);}
				}
			}
			if (i3GEO.temaAtivo !== "")
			{i3GEOF.identifica.buscaDadosTema(i3GEO.temaAtivo);}
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabeçalho da janela
		cabecalho = function(){
			i3GEO.barraDeBotoes.ativaIcone("identifica");
			g_tipoacao='identifica';
			g_operacao='identifica';
			i3GEOF.identifica.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.identifica");
		};
		//cria a janela flutuante
		titulo = "Identifica <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=70' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"450px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.identifica",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.identifica.inicia(i3GEO.temaAtivo,objposicaocursor.ddx,objposicaocursor.ddy,divid,true,true);
		$i("i3GEOF.identifica_corpo").style.backgroundColor = "white";
		if(i3GEO.Interface.ATUAL !== "googlemaps"){
			temp = function(){
				i3GEO.eventos.MOUSECLIQUE.remove("cliqueIdentifica()");
				i3GEO.barraDeBotoes.ativaBotoes();
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		}	
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEOF.identifica.listaTemas("ligados");
		var i = $i("i3GEOF.identifica_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEOidentificaguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia1" style="text-align:center;left:0px;" >Temas vis&iacute;veis</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia2" style="text-align:center;left:0px;" >Todos os temas</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia3" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia4" style="text-align:center;left:0px;" >Etiquetas</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div>';
		//ins += '<div class="geralFerramentas" style="left:0px;top:0px;width:98%;height:86%;">';
		ins += '	<div class=guiaobj id="i3GEOidentificaguia1obj" style="left:1px;90%">';
		ins += '		<div class="geralFerramentas" style="display:block;position:relative;top:-5px;left:0px;width:150px">';
		ins += '			<div style="left:0px;width:120px;text-align:left;" id="i3GEOidentificalistaTemas" >Aguarde...</div>';
		ins += '			<div style="left:0px;width:120px;text-align:left;" id="i3GEOidentificalistaSistemas" >Aguarde...</div>';
		ins += '		</div>';
		ins += '		<div id="i3GEOidentificaocorrencia" style="font-size: 10px;display:block;position:absolute;top:5px;left:160px;width:60%"></div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOidentificaguia2obj" style="left:1px">';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOidentificaguia3obj" style="left:1px;top:10px;display:none;font-size:12px;overflow:hidden" >';
		ins += '		Resolu&ccedil;&atilde;o de busca - n&uacute;mero de pixels, no entorno do ponto clicado no mapa, que ser&atilde;o utilizados na busca de dados:<br>  <input onclick="javascript:this.select();" type=text class=digitar value=5 id="i3GEOidentificaresolucao" size=2 />';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOidentificaguia4obj" style="left:1px;top:10px;display:none;font-size:12px;overflow:hidden" >';
		ins += '		As etiquetas são mostradas quando o mouse é estacionado sobre um elemento.';
		ins += '		<br><br><input id=i3GEOidentificabotao1 size=20  type=button value="Configurar etiquetas" />';
		ins += '	</div>';
		//ins += '</div>	';
		return ins;
	},
	/*
	Function: listaTemas
	
	Incluí a lista de temas para o usuário escolher
	
	Parametros:
	
	tipo {String} - ligados|todos lista apenas os temas que estão visíveis no mapa ou todos os temas
	*/
	listaTemas: function(tipo){
		if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
			var lista = i3GEO.arvoreDeCamadas.CAMADAS;
			if(tipo === "ligados")
			{lista = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",lista);}
			lista = i3GEO.arvoreDeCamadas.filtraCamadas("identifica","nao","diferente",lista);
			i3GEOF.identifica.montaListaTemas(lista);
		}
		else
		{i3GEO.php.listaTemas(i3GEOF.identifica.montaListaTemas,tipo,i3GEO.configura.locaplic,i3GEO.configura.sid);}		
	},
	/*
	Function: montaListaTemas
	
	Monta a lista de temas na forma de botões 'radio'
	
	O resultado é inserido no div com id "listaTemas"
	
	Parametros:
	
	retorno {JSON} - objeto retornado por i3GEO.php.listaTemas ou por i3GEO.arvoreDeCamadas.filtraCamadas
	*/
	montaListaTemas: function(retorno){
		var lista,linhas,linhas1,l,nome,tema,divResultado;
		if(retorno.data)
		{lista = retorno.data;}
		else
		{lista = retorno;}
		//
		//ativa o link para o site geohack
		//
		if(i3GEOF.identifica.mostraLinkGeohack === true)
		{linhas = i3GEOF.identifica.montaLinkGeohack();}
		else
		{linhas = "";}
		//
		//monta a lista de temas
		//	
		linhas += "Clique no tema para ver os dados";
		linhas1 = "";
		for (l=0;l<lista.length;l++)
		{
			if(lista[l].nome){
				nome = lista[l].nome;
				tema = lista[l].tema;
			}
			else{
				nome = lista[l].tema;
				tema = lista[l].name;
			}
			
			if(lista[l].identifica !== "nao")
			{linhas1 += "<tr><td style='border-top:1px solid beige;'><input onclick='i3GEOF.identifica.buscaDadosTema(\""+tema+"\")' style=cursor:pointer type=radio name=i3GEOidentificatema /></td><td style='border-top:1px solid beige;' >"+nome+"</td></tr>";}
		}
		divResultado = $i("i3GEOidentificalistaTemas");
		if(divResultado)
		{divResultado.innerHTML = linhas+"<table class=lista2 ><tr><td style=text-align:left ><input onclick='i3GEOF.identifica.buscaDadosTema(\"ligados\")' style=cursor:pointer type=radio name=i3GEOidentificatema /></td><td>Todos</td></tr>"+linhas1+"</table>";}
	},
	/*
	Function: montaLinkGeohack
	
	Monta o link para o site geohack
	
	Return:
	
	{String}
	*/
	montaLinkGeohack: function(){
		var b,x,y,w,s,param,url,linhas;
		b = i3GEO.calculo.dd2dms(i3GEOF.identifica.x,i3GEOF.identifica.y);
		x = b[0].split(" ");
		y = b[1].split(" ");
		w = "W";
		s = "S";
		if (x[0]*1 > 0)
		{w = "L";}
		if (y[0]*1 > 0)
		{s = "N";}
		if (x[0]*1 < 0)
		{x[0] = x[0]*-1;}
		if (y[0]*1 < 0)
		{y[0] = y[0]*-1;}
		param = y[0]+"_"+y[1]+"_"+y[2]+"_"+s+"_"+x[0]+"_"+x[1]+"_"+x[2]+"_"+w;
		url = "http://tools.wikimedia.de/~magnus/geo/geohack.php?params="+param;
		linhas = "<a href='"+url+"' target=blank >Buscadores web</a><br>";
		return linhas;
	},
	/*
	Function: montaListaSistemas
	
	Obtém a lista de sistemas especiais de consulta.
	
	O resultado é inserido no div com id "listaSistemas".
	
	A lista de sistemas é obtida de um XML definido no i3Geo na variável i3GEO.parametros.locidentifica
	
	Cada sistema consiste em uma URL para a qual serão passados os parâmetros x e y.
	
	Parametros:
	
	xmlDoc - documento xml
	*/
	montaListaSistemas: function(xmlDoc){
		var divins,sisig,sistema,pub,exec,temp,t,linhas,ltema;
		if (xmlDoc !== undefined)
		{
			i3GEO.tempXMLSISTEMAS = xmlDoc;
			divins = $i("i3GEOidentificalistaSistemas");
			sis = xmlDoc.getElementsByTagName("FUNCAO");
			for (ig=0;ig<sis.length;ig++)
			{	
				sistema = sis[ig].getElementsByTagName("NOMESIS")[0].firstChild.nodeValue;
				if(sis[ig].getElementsByTagName("PUBLICADO")[0])
				{
					if(sis[ig].getElementsByTagName("PUBLICADO")[0].firstChild)
					{
						pub = sis[ig].getElementsByTagName("PUBLICADO")[0].firstChild.nodeValue;
						if(pub === "NAO" || pub === "nao")
						{sistema = "<s>"+sistema+"</s>";}
					}
				}
				exec = sis[ig].getElementsByTagName("ABRIR")[0].firstChild.nodeValue;
				temp = exec.split('"');
				if(temp.length === 1)
				{exec = '"'+exec+'"';}
				temp = exec.split("?");
				if(temp.length !== 2)
				{exec += '+"?"';}
				t = "blank";
				if (sis[ig].getElementsByTagName("TARGET")[0])
				{t = sis[ig].getElementsByTagName("TARGET")[0].firstChild.nodeValue;}
				i3GEOF.identifica.sistemasAdicionais.push(sistema+","+exec+","+t);
			}
			if (i3GEOF.identifica.sistemasAdicionais.length > 0)
			{
				linhas = "";
				for (l=0;l<i3GEOF.identifica.sistemasAdicionais.length;l++)
				{
					ltema = i3GEOF.identifica.sistemasAdicionais[l].split(",");
					if (ltema.length > 1)
					{linhas += "<tr><td style='border-top:1px solid beige;'><input onclick='i3GEOF.identifica.mostraDadosSistema("+ltema[1]+",\""+ltema[2]+"\")' style=cursor:pointer type=radio name=i3GEOidentificatema /></td><td style='border-top:1px solid beige;' >"+ltema[0]+"</td></tr>";}
					
				}
				if(divins){
					divins.innerHTML = "<table class='lista2' >"+linhas+"</table>";
					return;
				}
			}
		}
		divins.innerHTML = "";
	},
	/*
	Function: buscaDadosTema
	
	Obtém os dados de um tema para o ponto de coordenadas clicado no mapa
	*/	
	buscaDadosTema: function(tema){
		var res,opcao,resolucao;
		$i("i3GEOidentificaocorrencia").innerHTML = "<img src='"+i3GEO.configura.locaplic+"/imagens/aguarde.gif' />";
		res = $i("i3GEOidentificaresolucao");
		if(res)
		{resolucao = res.value;}
		else
		{res = 5;}
		i3GEO.mapa.ativaTema(tema);
		//var resolucao = "0.01"
		if (tema === "ligados")
		{opcao = "ligados";}
		else
		{opcao = "tema";}
		i3GEO.php.identifica2(i3GEOF.identifica.mostraDadosTema,i3GEOF.identifica.x,i3GEOF.identifica.y,resolucao,opcao,i3GEO.configura.locaplic,i3GEO.configura.sid,tema);
	},
	/*
	Function: mostraDadosSistema
	
	Obtém os dados de um sistema para o ponto de coordenadas clicado no mapa
	
	Parametros:
	
	exec {String} - url que será aberta
	
	target {String} (depreciado) - _self|self| onde a url será aberta. Se for "self", será aberta na mesma janela, caso contrário, em uma nova página do navegador 
	*/	
	mostraDadosSistema: function(exec,target){
		exec += "&x="+i3GEOF.identifica.x+"&y="+i3GEOF.identifica.y;
		if(target === "target")
		{window.open(exec);}
		else {
			i3GEO.janela.cria("500","500",exec,parseInt(Math.random()*100,10),10,exec,"janela"+i3GEO.util.randomRGB(),false);
		}
	},
	/*
	Function: mostraDadosTema
	
	Mostra os dados obtidos de um ou mais temas.
	
	Recebe o resultado em JSON da operação de consulta realizada pelo servidor e formata os dados para apresentação na tela.
	
	Parametros:
	
	retorno {JSON} - objeto JSON com os dados <i3GEO.php.identifica2>
	*/
	mostraDadosTema: function(retorno){
		var res="",div0,ntemas,i,resultados,nres,cor,j;
		if (retorno.data !== undefined)
		{
			retorno = retorno.data;
			divO = $i("i3GEOidentificaocorrencia");
			divO.innerHTML="";
			ntemas = retorno.length;
			for(i=0;i<ntemas;i++)
			{
				resultados = retorno[i].resultado[0];
				if(resultados !== " ")
				{
					res += "<div style='padding-top:6px;left:2px;text-align:left;width:80%;' >"+retorno[i].nome+"</div>";	
					nres = resultados.length;
					cor = "RGB(250,250,250)";
					for(j=0;j<nres;j++)
					{
						if(resultados[j].link === "")
						{res +=  "<div style='width:80%;text-align:left;background-color:"+cor+"' >&nbsp;&nbsp;"+resultados[j].alias+":&nbsp;"+resultados[j].valor+"</div>";}
						else
						{res +=  "<div style='width:80%;text-align:left;background-color:"+cor+"' >&nbsp;&nbsp;"+resultados[j].alias+":&nbsp;<a href='"+resultados[j].link+"' target=_blank >"+resultados[j].valor+"</a></div>";}
						if(resultados[j].img !== "")
						{res +=  "<div style='width:80%;text-align:left;background-color:"+cor+"' >"+resultados[j].img+"</div>";}
						if (cor === "RGB(250,250,250)"){cor = "beige";}
						else
						{cor = "RGB(250,250,250)";}
					}
				}
			}
			$i("i3GEOidentificaocorrencia").innerHTML=res;
		}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>