<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Identifica

Obtém os atributos de um ou mais temas para uma coordenada.
Abre uma janela com várias opções e lista de temas disponíveis no mapa atual.

Veja:

<i3GEO.mapa.dialogo.cliqueIdentificaDefault>

File: i3geo/ferramentas/identifica/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.identifica

*/
i3GEOF.identifica = {
	/*
	Propriedade: mostraLinkGeohack
	
	Mostra ou não o link para abrir o site GeoHack.
	
	Este site permite o uso de vários buscadores disponíveis na internet.
	
	Type:
	{boolean}
	*/
	mostraLinkGeohack: true,
	/*
	Propriedade: mostraSistemasAdicionais
	
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
	Variavel: dadosIdentifica
	
	Guarda os dados obtidos com a chamada em AJAX de identificação
	
	Type:
	{Array}
	*/
	dadosIdentifica: [],	
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
			var g_locidentifica, temp;
			$i(iddiv).innerHTML += i3GEOF.identifica.html();
			i3GEOF.identifica.tema = tema;
			i3GEOF.identifica.x = x;
			i3GEOF.identifica.y = y;
			i3GEOF.identifica.mostraLinkGeohack = mostraLinkGeohack;
			i3GEOF.identifica.mostraSistemasAdicionais = mostraSistemasAdicionais;
			//se o usuário for editor, força mostrar a lista de sistemas
			if(i3GEO.parametros.editor == "sim")
			{i3GEOF.identifica.mostraSistemasAdicionais == true;}
			i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1","i3GEOidentificaguia");
			//eventos das guias
			$i("i3GEOidentificaguia1").onclick = function(){
				i3GEOF.identifica.listaTemas("ligados");
				i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1","i3GEOidentificaguia");
				if(i3GEO.temaAtivo === "")
				{$i("i3GEOidentificaocorrencia").innerHTML = "Escolha um tema da lista";}
			};
			$i("i3GEOidentificaguia2").onclick = function(){i3GEOF.identifica.listaTemas("todos");i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1","i3GEOidentificaguia");};
			$i("i3GEOidentificaguia3").onclick = function(){i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia3","i3GEOidentificaguia");};
			$i("i3GEOidentificaguia4").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia4","i3GEOidentificaguia");
				new YAHOO.widget.Button("i3GEOidentificabotao1",{onclick:{fn: function(){
					if(i3GEO.temaAtivo !== ""){
						var ltema = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
						if(ltema.identifica == "nao" || ltema.identifica == "NAO")
						{alert("Esse tema não permite etiquetas");}
						else
						{i3GEO.tema.dialogo.etiquetas(i3GEO.temaAtivo);}
						$i("i3GEOidentificaocorrencia").innerHTML = "";
					}
					else
					{$i("i3GEOidentificaocorrencia").innerHTML = "Escolha um tema da lista";}
				}}});
			};
			$i("i3GEOidentificaguia5").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia5","i3GEOidentificaguia");
				var ins = "",retorna;
				i3GEO.coordenadas.formato = "lista";
				i3GEO.coordenadas.mostraCoordenadas(false,"i3GEOidentificacoordtexto",i3GEOF.identifica.x,i3GEOF.identifica.y);
				$i("i3GEOidentificacoordtexto").innerHTML = i3GEO.coordenadas.MODOTEXTO+"</span>";
			};
			
			i3GEOF.identifica.listaTemas("ligados");
			//
			//verifica se existem sistemas para identificar
			//
			i3GEOF.identifica.atualizaSistemas();
			if(i3GEO.temaAtivo !== ""){
				//verifica se o tema ativo pode ser identificado
				temp = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
				if(temp.identifica.toLowerCase() !== "nao")
				{i3GEOF.identifica.buscaDadosTema(i3GEO.temaAtivo);}
			}
		}
		catch(erro){alert(erro);}

		var Dom = YAHOO.util.Dom,
			Event = YAHOO.util.Event,
			col1 = null,
			col2 = null;

        col1 = Dom.get('i3GEOidentificatemaativo');
        col2 = Dom.get('i3GEOidentificaocorrencia');
        var resize = new YAHOO.util.Resize('i3GEOidentificatemaativo', {
            handles: ['r'],
			maxWidth: 180
        });
        resize.on('resize', function(ev) {
            var w = ev.width;
            Dom.setStyle(col1, 'height', '');
			//150 é o tamanho inicial da parte esquerda, corresponde a 40%
			var w1 = parseInt(col1.style.width);
			var dif = parseInt((w1 * 40) / 150,10);
			Dom.setStyle(col2, 'width', 40 - dif + 60 + '%');
			Dom.setStyle(col2, 'left', w1 + 15 + 'px');
			if(navm){
				$i("yui-gen6").style.height = "250px";
				$i("yui-gen6").style.width = "5px";
			}			
        });
        resize.resize(null, null, null, 0, 0, true);
	},
	atualizaSistemas: function(){
		if(i3GEOF.identifica.mostraSistemasAdicionais === true){
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemasIdentificacao&g_sid="+i3GEO.configura.sid;
			cpJSON.call(p,"foo",i3GEOF.identifica.montaListaSistemas);	
		}	
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
		if(i3GEO.Interface.ATUAL !== "googleearth"){
			temp = function(){
				i3GEO.eventos.MOUSECLIQUE.remove("cliqueIdentifica()");
				i3GEO.barraDeBotoes.ativaBotoes();
				i3GEOF.identifica.limpaMarca();
				if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEOF.identifica") > 0)
				{i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.identifica.limpaMarca()");}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		}
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("cliqueIdentifica()") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.identifica.limpaMarca()");}
	},
	limpaMarca: function(){
		try{
			i3GEO.util.escondePin();
		}
		catch(e){}
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEOF.identifica.listaTemas("ligados");
		var i = $i("i3GEOF.identifica_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		temp = "identifica";
		if(i3GEO.Interface.ATIVAMENUCONTEXTO && i3GEO.Interface.ATUAL !== "googlemaps")
		{temp = "identifica_contexto";}
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
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
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia2" style="text-align:center;left:0px;" >Todos</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia4" style="text-align:center;left:0px;" >Etiquetas</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia5" style="text-align:center;left:0px;" >XY</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOidentificaguia3" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div>';
		//ins += '<div class="geralFerramentas" style="left:0px;top:0px;width:98%;height:86%;">';
		ins += '	<div class=guiaobj id="i3GEOidentificaguia1obj" style="left:1px;90%">';
		ins += '		<div id="i3GEOidentificatemaativo" class="geralFerramentas" style="overflow: hidden;display:block;position:relative;top:-5px;left:0px;width:150px">';
		ins += '			<div style="left:0px;width:150px;text-align:left;" id="i3GEOidentificalistaTemas" >Aguarde...</div>';
		ins += '			<div style="left:0px;width:150px;text-align:left;" id="i3GEOidentificalistaSistemas" >Aguarde...</div>';
		ins += '		</div>';
		ins += '		<div id="i3GEOidentificaocorrencia" style="overflow: hidden;font-size: 10px;display:block;position:absolute;top:5px;left:165px;width:60%"></div>';
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
		ins += '	<div class=guiaobj id="i3GEOidentificaguia5obj" style="left:1px;top:10px;display:none;font-size:12px;overflow:hidden" >';
		ins += '		<b>Valores para o ponto indicado no mapa<br></b>';
		ins += '		<div id=i3GEOidentificacoord ></div><br>';
		ins += '		<div id=i3GEOidentificacoordtexto style=text-align:left ></div>';

		ins += '	</div>';		
		//ins += '</div>	';
		return ins;
	},
	/*
	Function: listaTemas
	
	Incluí a lista de temas para o usuário escolher
	
	Veja:
	
	<i3GEO.php.listaTemas>
	
	Parametros:
	
	tipo {String} - ligados|todos lista apenas os temas que estão visíveis no mapa ou todos os temas
	*/
	listaTemas: function(tipo){
		if(i3GEO.arvoreDeCamadas.CAMADAS !== ""){
			var lista = i3GEO.arvoreDeCamadas.CAMADAS;
			if(tipo === "ligados")
			{lista = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",lista);}
			lista = i3GEO.arvoreDeCamadas.filtraCamadas("identifica","NAO","diferente",lista);
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
		var lista,linhas,linhas1,l,nome,tema,divResultado,marcado="";
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
		linhas += "<span style=color:gray; >Clique no tema para ver os dados</span>";
		linhas1 = "";
		for (l=0;l<lista.length;l++)
		{
			marcado="";
			if(lista[l].nome){
				nome = lista[l].nome;
				tema = lista[l].tema;
			}
			else{
				nome = lista[l].tema;
				tema = lista[l].name;
			}
			if(tema == i3GEO.temaAtivo)
			{marcado = "CHECKED";}
			if(lista[l].identifica !== "nao")
			{linhas1 += "<tr><td style='border-top:1px solid beige;'><input onclick='i3GEOF.identifica.buscaDadosTema(\""+tema+"\")' style='border:0px solid white;cursor:pointer;' type=radio "+marcado+" name=i3GEOidentificatema /></td><td style='border-top:1px solid beige;' >"+nome+"</td></tr>";}
		}
		divResultado = $i("i3GEOidentificalistaTemas");
		if(divResultado)
		{divResultado.innerHTML = linhas+"<table class=lista2 ><tr><td style=text-align:left ><input onclick='i3GEOF.identifica.buscaDadosTema(\"ligados\")' style='border:0px solid white;;cursor:pointer' type=radio name=i3GEOidentificatema /></td><td>Todos</td></tr>"+linhas1+"</table>";}
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
		//url = i3GEO.configura.locaplic+"/ferramentas/identifica/twitter.php?geocode="+i3GEOF.identifica.x+","+i3GEOF.identifica.y+",5km";
		//linhas = "<a href='"+url+"' target=blank >Twitter</a><br>";
		return linhas;
	},
	/*
	Function: montaListaSistemas
	
	Obtém a lista de sistemas especiais de consulta.
	
	O resultado é inserido no div com id "listaSistemas".
	
	Cada sistema consiste em uma URL para a qual serão passados os parâmetros x e y.
	
	*/
	montaListaSistemas: function(retorno){
		var divins,sisig,sistema,pub,exec,temp,t,linhas,ltema;
		if (retorno !== undefined)
		{
			divins = $i("i3GEOidentificalistaSistemas");
			sis = retorno.data;
			for (ig=0;ig<sis.length;ig++)
			{	
				sistema = sis[ig].NOME;
				if(sis[ig].PUBLICADO)
				{
					if(sis[ig].PUBLICADO)
					{
						pub = sis[ig].PUBLICADO;
						if(pub === "NAO" || pub === "nao")
						{sistema = "<s>"+sistema+"</s>";}
					}
				}
				exec = sis[ig].ABRIR;
				temp = exec.split('"');
				if(temp.length === 1)
				{exec = '"'+exec+'"';}
				temp = exec.split("?");
				if(temp.length !== 2)
				{exec += '+"?"';}
				t = "blank";
				if (sis[ig].TARGET)
				{t = sis[ig].TARGET;}
				i3GEOF.identifica.sistemasAdicionais.push(sistema+","+exec+","+t);
			}
			if (i3GEOF.identifica.sistemasAdicionais.length > 0)
			{
				linhas = "";
				for (l=0;l<i3GEOF.identifica.sistemasAdicionais.length;l++)
				{
					ltema = i3GEOF.identifica.sistemasAdicionais[l].split(",");
					if (ltema.length > 1)
					{linhas += "<tr><td style='border-top:1px solid beige;'><input onclick='i3GEOF.identifica.mostraDadosSistema("+ltema[1]+",\""+ltema[2]+"\")' style='border:0px solid white;cursor:pointer' type=radio name=i3GEOidentificatema /></td><td style='border-top:1px solid beige;' >"+ltema[0]+"</td></tr>";}
					
				}
				if(divins){
					if(i3GEO.parametros.editor == "sim"){
						temp = "<p class=paragrafo ><a href='#' title='Opção visível apenas para quem é editor' style=color:red onclick=\"i3GEOF.identifica.abrejanelaIframe('1050','500','"+i3GEO.configura.locaplic+"/admin/html/webservices.html');\" >Editar a lista de sistemas adicionais</a></p>";
					}
					else
					{temp = "";}
					divins.innerHTML = temp+"<table class='lista2' >"+linhas+"</table>";
					return;
				}
			}
		}
		divins.innerHTML = "";
	},
	/*
	Function: buscaDadosTema
	
	Obtém os dados de um tema para o ponto de coordenadas clicado no mapa
	
	Veja:
	
	<i3GEO.php.identifica2>
	*/	
	buscaDadosTema: function(tema){
		var res,opcao,resolucao,listaDeTemas="",temp;
		try{
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
			temp = function(retorno){
				i3GEOF.identifica.dadosIdentifica = retorno.data;
				if(retorno !== undefined)
				{i3GEOF.identifica.mostraDadosTema(i3GEOF.identifica.dadosIdentifica);}
				else
				{i3GEOF.identifica.mostraDadosTema(undefined);}
			}
			i3GEO.php.identifica2(temp,i3GEOF.identifica.x,i3GEOF.identifica.y,resolucao,opcao,i3GEO.configura.locaplic,i3GEO.configura.sid,tema,i3GEO.parametros.mapexten,listaDeTemas);
		}
		catch(e){i3GEOF.identifica.criaJanelaFlutuante()}
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
			i3GEOF.identifica.abrejanelaIframe("500","500",exec);
		}
		var i = $i("i3GEOmarcaIdentifica");
		if(i)
		{i.style.display = "block";}		
	},
	/*
	Function abrejanelaIframe
	
	Abre uma janela flutuante contendo um iframe
	
	Parametros:
	
	w {string} - largura
	
	h {string} - altura
	
	s {string} - src do iframe
	*/
	abrejanelaIframe: function(w,h,s){
		var janelaeditor = i3GEO.janela.cria(w,h,s,parseInt(Math.random()*100,10),10,s,"janela"+i3GEO.util.randomRGB(),false);
		var temp = function(){
			i3GEOF.identifica.sistemasAdicionais = [];
			i3GEOF.identifica.atualizaSistemas();
		};
		YAHOO.util.Event.addListener(janelaeditor[0].close, "click", temp,janelaeditor[0].panel,{id:janelaeditor[0].id},true);
	},
	/*
	Function: mostraDadosTema
	
	Mostra os dados obtidos de um ou mais temas.
	
	Recebe o resultado em JSON da operação de consulta realizada pelo servidor e formata os dados para apresentação na tela.
	
	Parametros:
	
	retorno {JSON} - objeto JSON com os dados <i3GEO.php.identifica2>
	*/
	mostraDadosTema: function(retorno){
		var res="",div0,ntemas,i,resultados,nres,cor,j,itens,nitens,k,atualN = "todas",inicio=0,numResultados,tip;
		if($i("i3GEOFidentificaNocorrencias"))
		{atualN = $i("i3GEOFidentificaNocorrencias").value;}
		$i("i3GEOF.identifica_corpo").scrollTop = 0;
		if(retorno == "")
		{$i("i3GEOidentificaocorrencia").innerHTML="Nada encontrado";}
		var i = $i("i3GEOmarcaIdentifica");
		if(i)
		{i.style.display = "block";}		
		if (retorno !== undefined)
		{
			divO = $i("i3GEOidentificaocorrencia");
			divO.innerHTML="";
			ntemas = retorno.length;
			for(i=0;i<ntemas;i++)
			{
				resultados = retorno[i].resultado;
				res += "<div style='padding-top:6px;left:2px;text-align:left;width:100%;' >"+retorno[i].nome+"</div>";	
				if(resultados[0] !== " ")
				{
					nres = resultados.length;
					numResultados = nres;
					cor = "RGB(250,250,250)";
					if(atualN != "todas"){
						nres = atualN*1;
						inicio = atualN*1 - 1;
					}
					for(j=inicio;j<nres;j++)
					{
						nitens = resultados[j].length;
						for(k=0;k<nitens;k++){
							tip = "&nbsp;&nbsp;";
							if(resultados[j][k].tip == "sim"){
								tip = "<img style='margin-right:2px;position:relative;top:3px;width:12px;' src='"+i3GEO.configura.locaplic+"/imagens/tips.png' title='Etiqueta ativa' />";
							}
							else{
								tip = "<img style='margin-right:2px;position:relative;top:3px;width:12px;' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' title='' />";
							}							
							if(resultados[j][k].link === "")
							{res +=  "<div style='width:100%;text-align:left;background-color:"+cor+"' >"+tip+resultados[j][k].alias+":&nbsp;"+resultados[j][k].valor+"</div>";}
							else
							{res +=  "<div style='width:100%;text-align:left;background-color:"+cor+"' >"+tip+resultados[j][k].alias+":&nbsp;<a href='"+resultados[j][k].link+"' target=_blank >"+resultados[j][k].valor+"</a></div>";}
							if(resultados[j][k].img !== "")
							{res +=  "<div style='width:100%;text-align:left;background-color:"+cor+"' >"+resultados[j][k].img+"</div>";}
							if (cor === "RGB(250,250,250)"){cor = "beige";}
							else
							{cor = "RGB(250,250,250)";}
						}
						res += "<br>";
					}
				}
				else
				{res += "Nada encontrado";}
			}
			if(ntemas == 1)
			{res = i3GEOF.identifica.montaOpcoesIdentificaOcorrencia(atualN,numResultados) + res;}
			$i("i3GEOidentificaocorrencia").innerHTML=res;
		}
	},
	montaOpcoesIdentificaOcorrencia: function(atual,nres){
		var ins,select,i,nocor;
		if(!atual){
			atual = "todas";
		}
		sel = "";
		select = "<select id=i3GEOFidentificaNocorrencias onchange='i3GEOF.identifica.mostraDadosTema(i3GEOF.identifica.dadosIdentifica)'>";
		if(atual == "todas")
		{sel = "SELECTED";}
		select += "<option value='todas' "+sel+" >todas</option>";
		nocor = nres + 1;
		for(i=1;i<nocor;i++)		
		{
			sel = "";
			if(atual == i)
			{sel = "SELECTED";}
			select += "<option value="+i+" "+sel+" >"+i+"</option>";
		}
		select += "</select>";
		ins = "<table><tr>";
		ins += "<td>Mostra a ocorrência: </td>";
		ins += "<td> "+select+"</td>";
		ins += "</tr></table>";
		if(nres == 1)
		{ins = "";}
		return ins;
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>