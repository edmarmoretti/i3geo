/*
Title: WMS Time

Acessa um servi&ccedil;o WMS-T, baseado em uma lista pr&eacute;-definida, e monta as imagens em uma sequ&ecirc;ncia temporal.
As imagens podem ser apresentadas em sequ&ecirc;ncia, simulando uma anima&ccedil;ão.

Veja:

<i3GEO.arvoreDeTemas.conectarwmst>

Arquivo:

i3geo/ferramentas/wmstime/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
//parametrosURL();
//tipo = 1 anual, 2 mensal, 3 diario
wms_configura = {
	"1": {
		titulo: "JPL NASA - Daily planet",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?",
		layers:"daily_planet",
		styles:"",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados di&aacute;rios dispon&iacute;veis desde 12 de janeiro de 2007. A contiunously updating composite of visual images from TERRA MODIS scenes, see http://modis.gsfc.nasa.gov for details about MODIS. This dataset is built local on the OnEarth server, it updates as soon as scenes are available, usually with a 6 to 24 hour delay from real time. Images are produced from MODIS scenes using the HDFLook application. Base resolution is 8 arcseconds per pixel.",
		anoInicio: 2008,
		mesInicio: 11,
		diaInicio: 7,
		anoFim: 2008,
		mesFim: 11,
		diaFim: 12,
		tipo: 3
	},
	"2": {
		titulo: "JPL NASA - Daily afternoon",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?",
		layers:"daily_afternoon",
		styles:"",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados di&aacute;rios dispon&iacute;veis desde 12 de janeiro de 2008. A contiunously updating composite of visual images from AQUA MODIS scenes, see http://modis.gsfc.nasa.gov for details about MODIS. This dataset is built local on the OnEarth server, it updates as soon as scenes are available, usually with a 6 to 24 hour delay from real time. Images are produced from MODIS scenes using the HDFLook application. Base resolution is 8 arcseconds per pixel.",
		anoInicio: 2008,
		mesInicio: 11,
		diaInicio: 7,
		anoFim: 2008,
		mesFim: 11,
		diaFim: 12,
		tipo: 3
	},
	"3": {
		titulo: "JPL NASA - Daily terra 721 pseudocolor",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?",
		layers:"daily_terra_721",
		styles:"",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados di&aacute;rios dispon&iacute;veis desde 1 de janeiro de 2006 at&eacute; 12 de mar&ccedil;o de 2008. This layer is no longer updated. Daily generated mosaic of TERRA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
		anoInicio: 2006,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2006,
		mesFim: 1,
		diaFim: 12,
		tipo: 3
	},
	"4": {
		titulo: "JPL NASA - Daily aqua 721 pseudocolor",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?",
		layers:"daily_aqua_721",
		styles:"",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados di&aacute;rios dispon&iacute;veis desde 1 de janeiro de 2006 at&eacute; 12 de mar&ccedil;o de 2008. This layer is no longer updated. Daily generated mosaic of AQUA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
		anoInicio: 2006,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2006,
		mesFim: 1,
		diaFim: 12,
		tipo: 3
	},
	"5": {
		titulo: "JPL NASA - Terra NDVI",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?",
		layers:"daily_terra_ndvi",
		styles:"",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados di&aacute;rios dispon&iacute;veis desde 1 de janeiro de 2006 at&eacute; 12 de mar&ccedil;o de 2008. This layer is no longer updated. Daily generated mosaic of TERRA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
		anoInicio: 2006,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2006,
		mesFim: 1,
		diaFim: 12,
		tipo: 3
	},
	"6": {
		titulo: "JPL NASA - Aqua NDVI",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?",
		layers:"daily_aqua_ndvi",
		styles:"",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados di&aacute;rios dispon&iacute;veis desde 1 de janeiro de 2006 at&eacute; 12 de mar&ccedil;o de 2008. This layer is no longer updated. Daily generated mosaic of AQUA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
		anoInicio: 2006,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2006,
		mesFim: 1,
		diaFim: 12,
		tipo: 3
	},
	"7": {
		titulo: "Active Fires (1 month - Terra/MODIS)",
		servico:"http://neowms.sci.gsfc.nasa.gov/wms/wms?",
		layers:"MOD14A1_M_FIRE",
		styles:"rgb",
		srs:"EPSG:4326",
		format:"image/jpeg",
		descricao:"Dados acumulados de um m&ecirc;s mar&ccedil;o de 2000 a mar&ccedil;o de 2009. Fire is a recurring part of nature.  Wildfires can be caused by lightning striking a forest canopy or, in a few isolated cases, by lava or hot rocks ejected from erupting volcanoes.  Most fires worldwide are started by humans, sometimes accidentally and sometimes on purpose.  Not all fires are bad.  Fire clears away dead and dying underbrush, which can help restore forest ecosystems to good health.  Humans use fire as a tool in slash-and-burn agriculture to speed up the process of breaking down unwanted vegetation into the soil.  Humans also use fire to clear away old-growth forests to make room for living spaces, roads, and fields for raising crops and cattle.  But not all fires are good.  Wildfires can destroy natural resources and human structures.  Globally, fire plays a major role in Earth&apos;s carbon cycle by releasing carbon into the air, and by consuming trees that would otherwise absorb carbon from the air during photosynthesis.  These maps show the locations of actively burning fires around the world, detected by instruments aboard NASA satellites.",
		anoInicio: 2006,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2006,
		mesFim: 12,
		diaFim: 1,
		tipo: 2
	}
};
ins = "<p>Escolha o servi&ccedil;o de fornecimento de dados (WMS-T)</p>";
ins += "<select style='width:353px;border:1px solid gray;' onchange='escolheuServico(this.value)'>";
ins += "<option value='' >---</option>";
for(key in wms_configura){
	ins += "<option value='"+key+"'>"+wms_configura[key].titulo+"</option>";
}
ins += "</select>";
ins += "<p><input onclick='javascript:this.select();' type=text id=iServico size=54 />";
ins += "<p><TEXTAREA id='WMS_descricao' rows='3' cols='52' ></TEXTAREA></p>";
ins += "<table style='text-align:left'>";
ins += "<tr><td style='text-align:left'>Ano inicial: </td><td><input onclick='javascript:this.select();' type=text value='0' id=WMS_anoinicio size=4 />";
ins += "<td style='text-align:left'>Ano final: </td><td><input onclick='javascript:this.select();' type=text value='0' id=WMS_anofim size=4 /></tr>";

ins += "<tr><td style='text-align:left'>M&ecirc;s inicial: </td><td><input onclick='javascript:this.select();' type=text value='nulo' id=WMS_mesinicio size=4 />";
ins += "<td style='text-align:left'>M&ecirc;s final: </td><td><input onclick='javascript:this.select();' type=text value='nulo' id=WMS_mesfim size=4 /></tr>";

ins += "<tr><td style='text-align:left'>Dia inicial: </td><td><input onclick='javascript:this.select();' type=text value='nulo' id=WMS_diainicio size=4 />";
ins += "<td style='text-align:left'>Dia final: </td><td><input onclick='javascript:this.select();' type=text value='nulo' id=WMS_diafim size=4 /></tr>";

ins += "</table>";
//ins += "<div style='position:absolute;left:120px;top:180px'>"
ins += "<p>Obter uma imagem por: ";
ins += "<div id='divumaImagemPor'></div>";


ins += "<div onclick='iniciaImagens()' style='text-align:left;left:0px;top:20px;'><input id='botao1' size=18 type='button' value='Continuar' /></div>";
ins += "</div>";
$i("parametros").innerHTML = ins;

//new YAHOO.widget.Button("botao1");
/*
Function: escolheuServico

Monta a tela de parâmetros ap&oacute;s um servi&ccedil;o ter sido escolhido

Parametro:

idWMS {String} - id do servi&ccedil;o escolhido
*/
function escolheuServico(idWMS){
	tipoServico = wms_configura[idWMS].tipo;
	servico = wms_configura[idWMS].servico+"&VERSION=1.1.1&REQUEST=GetMap&layers="+wms_configura[idWMS].layers+"&styles="+wms_configura[idWMS].styles+"&srs="+wms_configura[idWMS].srs+"&format="+wms_configura[idWMS].format;
	$i("iServico").value = servico;
	$i("WMS_descricao").value = wms_configura[idWMS].descricao;

	$i("WMS_anoinicio").value = wms_configura[idWMS].anoInicio;
	//if(tipoServico > 1)
	$i("WMS_mesinicio").value = wms_configura[idWMS].mesInicio;
	//if(tipoServico > 2)
	$i("WMS_diainicio").value = wms_configura[idWMS].diaInicio;
	$i("WMS_anofim").value = wms_configura[idWMS].anoFim;
	//if(tipoServico > 1)
	$i("WMS_mesfim").value = wms_configura[idWMS].mesFim;
	//if(tipoServico > 2)
	$i("WMS_diafim").value = wms_configura[idWMS].diaFim;

	var ins = "<select id='umaImagemPor' style='border:1px solid gray'>";
	if(tipoServico == 1){
		ins += "<option value='ano' selected >Ano</option></select>";
	}
	if(tipoServico == 2){
		ins += "<option value='ano' >Ano</option>";
		ins += "<option value='mes' selected >M&ecirc;s</option></select>";
	}
	if(tipoServico == 3){
		ins += "<option value='ano'  >Ano</option>";
		ins += "<option value='mes' >M&ecirc;s</option>";
		ins += "<option value='dia' selected >Dia</option></select>";
	}
	$i("divumaImagemPor").innerHTML = ins;
}
/*
Function: iniciaImagens

Inicia a tela de apresenta&ccedil;ão das imagens
*/
function iniciaImagens(){
	$i("imagens").innerHTML = "";
	$i("imagensLidas").innerHTML = "";
	$i("marcaTempo").innerHTML = "";
	$i("parametros").style.display="none";
	$i("quadroAnima").style.display="block";
	if(window.parent.i3GEO.parametros.mapexten){
		bbox = window.parent.i3GEO.parametros.mapexten.split(" ");
		bbox = bbox.toString();
	}
	else
	bbox = "-51.0347433181,-25.2688559441,-43.4155582517,-21.1417973665";
	//var time = "2008-01-01"
	w = window.parent.i3GEO.parametros.w; //985
	h = window.parent.i3GEO.parametros.h;
	dw = w / 2;
	dh = h / 2;

	anoInicio = $i("WMS_anoinicio").value;
	mesInicio = $i("WMS_mesinicio").value;
	diaInicio = $i("WMS_diainicio").value;

	anoFim = $i("WMS_anofim").value;
	mesFim = $i("WMS_mesfim").value;
	diaFim = $i("WMS_diafim").value;

	intervalo = 1;
	id = 1;

	ids = new Array();
	quantasLidas = 0;
	onde = $i("imagens");
	ondeContador = $i("imagensLidas");
	ondeContador.style.display="block";
	ondeControle = $i("controle");
	idsValidos = new Array();
	idsTempo = new Array();
	parouQuantas = 0;
	ondeMarcaTempo = $i("marcaTempo");
	ondeData = $i("marcaData");
	tempoAnima = 500;

	if($i("umaImagemPor").value == "mes"){
		dataFixa = diaInicio;
		if(dataFixa < 10){dataFixa = "0"+dataFixa;}
		var anoAtual = anoInicio;
		var mesAtual = mesInicio;
		while (anoAtual <= anoFim){
			while (mesAtual < 13){
				var mes = mesAtual;
				if(mes < 10){mes = "0"+mes;}
				criaImg(anoAtual+"-"+mes+"-"+dataFixa,id);
				criaImgStatus(anoAtual+"-"+mes+"-"+dataFixa,id);
				ids.push(id);
				idsTempo.push(anoAtual+"-"+mes+"-"+dataFixa);
				id++;
				mesAtual++;
				if(anoAtual == anoFim && mesAtual > mesFim){mesAtual = 13;}
			}
			mesAtual = 1;
			anoAtual++;
		}
	}
	if($i("umaImagemPor").value == "dia"){
		var anoAtual = anoInicio;
		var mesAtual = mesInicio;
		var diaAtual = diaInicio;
		while (anoAtual <= anoFim){
			while (mesAtual < 13){
				var mes = mesAtual;
				if(mes < 10){mes = "0"+mes;}
				while (diaAtual < 31){
					var dia = diaAtual;
					if(diaAtual < 10){dia = "0"+dia;}
					criaImg(anoAtual+"-"+mes+"-"+dia,id);
					criaImgStatus(anoAtual+"-"+mes+"-"+dia,id);
					ids.push(id);
					idsTempo.push(anoAtual+"-"+mes+"-"+dia);
					id++;
					diaAtual++;
					if(mesAtual == mesFim && diaAtual > diaFim){diaAtual = 32;}
				}
				mesAtual++;
				if(anoAtual == anoFim && mesAtual > mesFim){mesAtual = 13;}
			}
			mesAtual = 1;
			anoAtual++;
		}
	}
}
/*
function: criaImg

Cria um elemento do tipo IMG com base no servi&ccedil;o escolhido e nos parâmetros de tempo

Parametros:

tempo {string} - data da imagem que ser&aacute; requisitada

id {string} - id que ser&aacute; definido para a imagem
*/
function criaImg(tempo,id){
	var novoel = document.createElement("img");
	var p = "absolute";
	//if(id==1){var p = "relative"}
	novoel.id = id;
	novoel.style.position = p;
	novoel.style.top = "0px";
	novoel.style.left = "0px";
	novoel.style.width = dw+"px";
	novoel.style.height = dh+"px";
	novoel.src = $i("iServico").value+"&width="+dw+"&height="+dh+"&bbox="+bbox+"&time="+tempo; //"../../imagens/atlas1.jpg";
	novoel.onload = function(){
		$i("status"+this.id).innerHTML = " <span style=color:red >OK</span>";
		idsValidos.push(this.id);
		parouQuantas++;
		if(idsValidos.length == ids.length)
		{pararStatus();}
	};
	onde.appendChild(novoel);
}
/*
Function: criaImgStatus

Cria um &iacute;cone que permite parar a apresenta&ccedil;ão da anima&ccedil;ão em uma determinada imagem

Parametros:

tempo {string} - data da imagem

id {string} - id da imagem
*/
function criaImgStatus(tempo,id){
	var novoel = document.createElement("div");
	novoel.id = "lida"+id;
	novoel.style.width="200px";
	novoel.innerHTML = "Imagem: "+tempo+"...<span style=cursor:pointer;color:blue onclick='pararImagem(\""+id+"\")' id='status"+id+"' >parar</span>";
	ondeContador.appendChild(novoel);
}
/*
Function: pararImagem

Parar a apresenta&ccedil;ão da anima&ccedil;ão em uma determinada imagem

Parametro:

id {string} - id da imagem
*/
function pararImagem(id){
	if($i(id)){
		$i(id).src = "";
		//onde.removeChild(document.getElementById(id))
		idsValidos.push(id);
		$i("status"+id).innerHTML = "exclu&iacute;do";
		parouQuantas++;
		if(parouQuantas == ids.length)
		{pararStatus();}
	}
	else
	{alert("Imagem exclu&iacute;da");}
}
/*
Function: pararStatus

Para o gr&aacute;fico que mostra o status das imagens
*/
function pararStatus(){
	ondeContador.style.display = "none";
	ondeControle.style.display="block";
	ondeMarcaTempo.style.display="block";
	ondeMarcaTempo.style.top = "10px";
	ondeControle.style.top = dh + 50 + "px";
	ondeData.style.top = dh + 30 + "px";
	ondeData.style.width = dw+"px";
	desativaQuadros();
	criaMarcadorTempo();
	//ajustaIds()
	ativaQuadro(1);
}
function ajustaIds(){

}
/*
Function: criaMarcadorTempo

Cria o gr&aacute;fico que mostra as imagens dispon&iacute;veis. Serve de base para indicar qual imagem est&aacute; sendo mostrada
*/
function criaMarcadorTempo(){
	var nmarcas = ids.length;
	distanciaMarcas = parseInt(dw / nmarcas);
	var ins = "";
	var ini = parseInt((distanciaMarcas*i - (distanciaMarcas/2)));
	for(var i=1;i<=nmarcas;i++){
		ins += "<img title='clique para adicionar ao mapa' onclick='adicionaMapa(\""+i+"\")' onmouseover='mostraI(\""+i+"\")' onmouseout='escondeI(\""+i+"\")' style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas*i - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1.gif' id='marcaTempo"+i+"' />";
	}
	ins += "<img style='position:absolute;top:"+(dh + 5)+"px;left:"+parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1red.gif' id='marcaDeTempo' />";
	ins += "<img style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1cinza.gif' id='marcaGranulo' />";
	ngranulo = nmarcas;
	tgranulo = (parseInt((distanciaMarcas*i - (distanciaMarcas/2))) - ini) / 10;
	tempoGranulo = tempoAnima / 10;
	ondeMarcaTempo.innerHTML = ins;
	marcaVermelha = $i("marcaDeTempo");
	imgGranulo = $i("marcaGranulo");
	pararFilme();
	iniciarFilme();
}
/*
Function: mostraI

Mostra uma imagem espec&iacute;fica

Parametro:

obj {dom} - objeto contendo a imagem
*/
function mostraI(obj){
	$i(obj).style.display="block";
	ondeData.innerHTML = "YYMMDD: "+idsTempo[obj-1];
	if($i(quadroAtual))
	$i(quadroAtual).style.display = "none";
	else
	$i("1").style.display = "none";
}
/*
Function: escondeI

Esconde uma imagem

Parametro:

obj {dom} - objeto contendo a imagem
*/
function escondeI(obj){
	$i(obj).style.display="none";
	ondeData.innerHTML = "";
	if($i(quadroAtual))
	$i(quadroAtual).style.display = "block";
	else
	$i("1").style.display = "block";
}
/*
Function: adicionaMapa

Adiciona uma camada ao mapa baseado na imagem vista na tela

*/
function adicionaMapa(obj){
	aguarde("block");
	var serv = wms_configura[obj-1];
	var fim = function(retorno){
		aguarde("none");
		if (retorno.data.erro)
		{alert(retorno.data.erro);}
		else
		{window.parent.i3GEO.atualiza("");}
	};
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=adicionatemawms";
	p += "&servico="+serv.servico;
	if(serv.styles == "")
	p += "&nome=";
	else
	p += "&nome="+serv.styles;
	p += "&tema="+serv.layers;
	p += "&proj="+serv.srs;
	p += "&formato="+serv.format;
	p += "&tipo=estilo";
	p += "&versao=1.1.1";
	p += "&nomecamada="+serv.titulo+" "+idsTempo[obj-1];
	p += "&tiporep=&suportasld=nao";
	p += "&formatosinfo=text/plain,application/vnd.ogc.gml";
	p += "&time="+idsTempo[obj-1];
	var cp = new cpaint();
	cp.set_response_type("JSON");
	cp.call(p,"wmstime",fim);

}
function desativaQuadros(){
	var n = idsValidos.length;
	for(var i=0;i<n;i++){
		$i(idsValidos[i]).style.display = "none";
	}
}
function ativaQuadro(i){
	var q = $i(i);
	if(q){
		q.style.position = "relative";
		q.style.display = "block";
	}
	marcaVermelha.style.left = $i("marcaTempo"+(i)).style.left;
}
function pausarFilme(){
	pulaGranulo = 11;
	try{
		clearTimeout(ganima);
	}catch(e){}
}
function pararFilme(){
	imgGranulo.style.left = parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px";
	quadroAtual = 0;
	desativaQuadros();
	ativaQuadro(ids[0]);
	imgGranulo.style.display="none";
	ondeData.innerHTML = "";
	try{
		//clearTimeout(tanima)
		clearTimeout(ganima);
	}catch(e){}
}
function iniciarFilme(){
	imgGranulo.style.display="block";
	//tanima = setTimeout("anima()",tempoAnima)
	//ganima = setTimeout("animacaoGranulo()",tempoGranulo)
	anima();
}
function anima(){
	desativaQuadros();
	ativaQuadro(ids[quadroAtual]);
	ondeData.innerHTML = idsTempo[quadroAtual];
	quadroAtual++;
	if(quadroAtual < idsValidos.length){
		//tanima = setTimeout("anima()",tempoAnima)
		pulaGranulo = 0;
		imgGranulo.style.left = $i("marcaTempo"+quadroAtual).style.left;
		ganima = setTimeout("animacaoGranulo()",tempoGranulo);
	}
	else{
		imgGranulo.style.display="none";
		pararFilme();
	}
}
function animacaoGranulo(){
	imgGranulo.style.left = parseInt(imgGranulo.style.left) +  tgranulo + "px";
	pulaGranulo++;
	//if(quadroAtual < idsValidos.length)
	if(pulaGranulo <= 10)
	ganima = setTimeout("animacaoGranulo()",tempoGranulo);
	else
	anima();
}
function maisrapido(){
	tempoGranulo = tempoGranulo - 10;
}
function maislento(){
	tempoGranulo = tempoGranulo + 10;
}