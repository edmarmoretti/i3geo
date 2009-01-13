/*
Class: i3GEO.navega

Realiza operações de navegação do mapa, como zoom, pan, etc..

File: i3geo/classesjs/classe_navega.js

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
i3GEO.navega = {
	/*
	Property: FATORZOOM
	
	Valor utilizado nas operações de zoom in e out. Fator de zoom.
	
	O valor default é 2.
	
	Type:
	{Integer}
	*/
	FATORZOOM: 2,
	/*
	Function: zoomin
	
	Aproxima o mapa
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	*/
	zoomin: function(locaplic,sid){
		YAHOO.log("zoomin", "i3geo");
		if(arguments.length == 0){
			var locaplic = i3GEO.configura.locaplic;
			var sid = i3GEO.configura.sid;
		}
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel="+i3GEO.navega.FATORZOOM+"&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"aproxima",ajaxredesenha);
	},
	/*
	Function: zoomout
	
	Afasta o mapa
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	*/
	zoomout: function(locaplic,sid){
		YAHOO.log("zoomout", "i3geo");
		if(arguments.length == 0){
			var locaplic = i3GEO.configura.locaplic;
			var sid = i3GEO.configura.sid;
		}
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel="+i3GEO.navega.FATORZOOM+"&g_sid="+sid;
		//g_operacao = "navega";
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"afasta",ajaxredesenha);
	},
	/*
	Function: zoomponto
	
	Centraliza o mapa em um ponto e acrescenta o ponto como uma nova camada no mapa
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	
	x {Numeric} - coordenada em décimos de grau da longitude
	
	y {Numeric} - coordenada em décimos de grau da latitude
	*/
	zoomponto: function(locaplic,sid,x,y){
		YAHOO.log("zoomponto", "i3geo");
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+x+" "+y+"&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"zoomPonto",ajaxredesenha);
	},
	/*
	Function: zoompontoIMG
	
	Centraliza o mapa em um ponto de coordenadas medidas na imagem do mapa
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	
	x {Numeric} - coordenada x da imagem
	
	y {Numeric} - coordenada y da imagem
	*/
	zoompontoIMG: function(locaplic,sid,x,y){
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=pan&x="+x+"&y="+y+"&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"zoomPonto",ajaxredesenha);
	},
	/*
	Function: xy2xy
	
	Desloca o mapa de um ponto de coordenadas xy para um segundo ponto
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	
	xi {Numeric} - coordenada x inicial
	
	yi {Numeric} - coordenada y inicial
	
	xf {Numeric} - coordenada x final
	
	yf {Numeric} - coordenada y final
	
	ext {String} - extensão geográfica do mapa
	
	tipoimagem {String} - tipo de imagem atual do mapa (sepia,nenhum,cinza)
	*/
	xy2xy: function(locaplic,sid,xi,yi,xf,yf,ext,tipoimagem){
		var disty = (yi * -1) + yf;
		var distx = (xi * -1) + xf;
		var ex = ext.split(" ");
		var novoxi = (ex[0] * 1) - distx;
		var novoxf = (ex[2] * 1) - distx;
		var novoyi = (ex[1] * 1) - disty;
		var novoyf = (ex[3] * 1) - disty;
		if ((distx == 0)||(disty == 0))
		{return false;}
		else{
			var nex = novoxi+" "+novoyi+" "+novoxf+" "+novoyf;
			i3GEO.navega.zoomExt(locaplic,sid,tipoimagem,nex);
			return true;
		}
	},	
	/*
	Function: localizaIP
	
	Localiza as coordenadas baseadas no número IP do usuário.
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	
	funcao {Function} - função que será executada ao concluir a chamada AJAX. Essa função receberá o objeto JSON obtido.
	*/	
	localizaIP: function(locaplic,sid,funcao){
		YAHOO.log("localizaIP", "i3geo");
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"IP",funcao);
	},
	/*
	Function: zoomIP
	
	Mostra no mapa um ponto baseado na localização do usuário.

	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	*/
	zoomIP: function(locaplic,sid){
		try
		{
			if(arguments.length == 0){
				var locaplic = i3GEO.configura.locaplic;
				var sid = i3GEO.configura.sid;
			}
			var mostraIP = function(retorno)
			{
				if (retorno.data.latitude != null)
				{
					i3GEO.navega.zoomponto(locaplic,sid,retorno.data.longitude,retorno.data.latitude);
				}
				else
				{alert("Nao foi possivel identificar a localizacao.");}
			};
			i3GEO.navega.localizaIP(locaplic,sid,mostraIP);
		}
		catch(e){var e = "";}
	},
	/*
	Function: zoomExt
	
	Aplica uma nova extensão geográfica ao mapa.

	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	
	tipoimagem {String} - Utlize "" para aplicar o default. Tipo de imagem que será retornada na imagem do mapa que será criada

	ext {String} - Extensão geográfica no formato xmin ymin xmax ymax
	*/
	zoomExt: function(locaplic,sid,tipoimagem,ext){
		YAHOO.log("zoomExt", "i3geo");
		if(tipoimagem == "")
		{var tipoimagem = "nenhum";}
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+tipoimagem+"&ext="+ext+"&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"mudaExtensao",ajaxredesenha);
	},
	/*
	Function: aplicaEscala
	
	Aplica ao mapa um novo valor de escala tendo como base o valor do denminador

	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo
	
	escala {Numeric} - denominador da escala
	*/	
	aplicaEscala: function(locaplic,sid,escala){
		YAHOO.log("aplicaescala", "i3geo");
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+escala+"&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"mudaEscala",ajaxredesenha);
	},
	/*
	Function: panFixo
	
	Desloca o mapa para uma determinada direção com uma distância fixa.
	
	Parameters:
	
	locaplic {String} - endereço do i3geo utilizado na geração da URL para fazer a chamada AJAX
	
	sid {String} - código da seção aberta no servidor pelo i3geo

	direcao {String} - norte,sul,leste,oeste,sudeste,sudoeste,nordeste,noroeste
	
	w {Numeric} - largura da imagem do mapa em pixels
	
	h {Numeric} - altura da imagem do mapa em pixels
	
	escala {Numeric} - escala do mapa
	*/
	panFixo: function(locaplic,sid,direcao,w,h,escala){
		YAHOO.log("panfixo", "i3geo");
		if (direcao == "norte"){
			var y = h / 6;
			var x = w / 2;
		}
		if (direcao == "sul"){
			var y = h - (h / 6);
			var x = w / 2;
		}
		if (direcao == "leste"){
			var x = w - (w / 6);
			var y = h / 2;
		}
		if (direcao == "oeste"){
			var x = w / 6;
			var y = h / 2;
		}
		if (direcao == "nordeste"){
			var y = h / 6;
			var x = w - (w / 6);
		}
		if (direcao == "sudeste"){
			var y = h - (h / 6);
			var x = w - (w / 6);
		}
		if (direcao == "noroeste"){
			var y = h / 6;
			var x = w / 6;
		}
		if (direcao == "sudoeste"){
			var y = h - (h / 6);
			var x = w / 6;
		}
		i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
		var p = locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+escala+"&x="+x+"&y="+y+"&g_sid="+sid;
		var cp = new cpaint();
		cp.set_async("true");
		cp.set_response_type("JSON");
		cp.call(p,"pan",ajaxredesenha);
	},
	/*
	Function: mostraRosaDosVentos
	
	Mostra sobre o mapa a rosa dos ventos.
	
	A rosa permite que o usuário navegue no mapa sem ter de alterar a opção atual de navegação.
	
	A rosa é mostrada apenas se a variável i3GEO.configura.mostraRosaDosVentos for = a "sim".<b> 

	Para que a rosa seja mostrada, é necessário que esta função esteja registrada em
	
	i3GEO.eventos.MOUSEPARADO
	*/
	mostraRosaDosVentos: function(){
		try{
			if(i3GEO.configura.mostraRosaDosVentos == "nao"){return;}
			if(g_tipoacao == "area"){return;}
		}
		catch(e){};
		if(objposicaocursor.imgx < 10 || objposicaocursor.imgy < 10 || objposicaocursor.imgy > (objmapa.h - 10))
		{return;}
		if (!$i("i3geo_rosa")){
			var novoel = document.createElement("div");
			novoel.id = "i3geo_rosa";
			novoel.style.position="absolute";
			novoel.style.zIndex=5000;
			if(navn)
			{novoel.style.opacity=".7";}
			else
			{novoel.style.filter = "alpha(opacity=70)";}
			document.body.appendChild(novoel);
		}
		var setas = "<table id='rosaV' >";
		setas += "<tr onclick=\"javascript:i3GEO.configura.mostraRosaDosVentos='nao'\"><td></td><td></td><td style=cursor:pointer >x</td></tr><tr>";
		setas += "<td><img class='rosanoroeste' title='noroeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','noroeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
		setas += "<td><img class='rosanorte' title='norte' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','norte','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
		setas += "<td><img class='rosanordeste' title='nordeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','nordeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td></tr>";
		setas += "<tr><td><img class='rosaoeste' title='oeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','oeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
		setas += "<td><table><tr>";
		setas += "<td><img class='rosamais' title='aproxima' onclick=\"i3GEO.navega.zoomin('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"')\" src='"+$im("branco.gif")+"' </td>";
		setas += "<td><img class='rosamenos' title='afasta' onclick=\"i3GEO.navega.zoomout('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"')\" src='"+$im("branco.gif")+"' </td>";
		setas += "</tr></table></td>";
		setas += "<td><img class='rosaleste' title='leste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','leste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td></tr>";
		setas += "<tr><td><img class='rosasudoeste' title='sudoeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','sudoeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
		setas += "<td><img class='rosasul' title='sul' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','sul','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td>";
		setas += "<td><img class='rosasudeste' title='sudeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','sudeste','"+objmapa.w+"','"+objmapa.h+"','"+objmapa.scale+"')\" /></td></tr></table>";
		var i = $i("i3geo_rosa");
		i.innerHTML = setas;	
		i.style.top = objposicaocursor.telay - 27;
		i.style.left = objposicaocursor.telax - 27;
		i.style.display="block";
		var escondeRosa = function(){
			var i = $i("i3geo_rosa");
			i.style.display="none";
			YAHOO.util.Event.removeListener(escondeRosa);
		}
		if($i("img"))
		YAHOO.util.Event.addListener($i("img"),"mousemove", escondeRosa);
		i3GEO.ajuda.mostraJanela('Clique nas pontas da rosa para navegar no mapa. Clique em x para parar de mostrar essa opção.');
	},
	autoRedesenho: {
		INTERVALO: 0,
		ID: "tempoRedesenho",
		ativa: function(id){
			if(arguments.length == 0){var id = "tempoRedesenho";}
			i3GEO.navega.autoRedesenho.ID = id;
			if (($i(id)) && i3GEO.navega.autoRedesenho.INTERVALO > 0)
			{$i(id).style.display = "block";}
			if (i3GEO.navega.autoRedesenho.INTERVALO > 0)
			{i3GEO.navega.tempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.redesenha()',i3GEO.navega.autoRedesenho.INTERVALO);}
			if (($i(id)) && (i3GEO.navega.autoRedesenho.INTERVALO > 0)){
				$i(id).innerHTML = i3GEO.navega.autoRedesenho.INTERVALO/1000;
				i3GEO.navega.contaTempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.contagem()',1000);
			}
		},
		desativa:function(){
			i3GEO.navega.autoRedesenho.INTERVALO = 0;
			clearTimeout(i3GEO.navega.tempoRedesenho);
			clearTimeout(i3GEO.navega.contaTempoRedesenho);
			i3GEO.navega.tempoRedesenho = "";
			i3GEO.navega.contaTempoRedesenho = "";
			if ($i(i3GEO.navega.autoRedesenho.ID))
			{$i(i3GEO.navega.autoRedesenho.ID).style.display = "none";}
		},
		redesenha: function(){
			clearTimeout(i3GEO.navega.tempoRedesenho);
			clearTimeout(i3GEO.navega.contaTempoRedesenho);
			ajaxredesenha("");
			i3GEO.navega.autoRedesenho.ativa(i3GEO.navega.autoRedesenho.ID);
		},
		contagem: function(){
			if ($i(i3GEO.navega.autoRedesenho.ID)){$i(i3GEO.navega.autoRedesenho.ID).innerHTML = parseInt($i(i3GEO.navega.autoRedesenho.ID).innerHTML) - 1;}
			i3GEO.navega.contaTempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.contagem()',1000);
		}
	}
};
