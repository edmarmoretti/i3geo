
//tipo = 1 anual, 2 mensal, 3 diario
wms_configura = {
	"1": {
		titulo: "JPL NASA - Daily planet",
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_planet&styles=&srs=EPSG:4326&format=image/jpeg",
		descricao:"Dados diários disponíveis desde 12 de janeiro de 2007. A contiunously updating composite of visual images from TERRA MODIS scenes, see http://modis.gsfc.nasa.gov for details about MODIS. This dataset is built local on the OnEarth server, it updates as soon as scenes are available, usually with a 6 to 24 hour delay from real time. Images are produced from MODIS scenes using the HDFLook application. Base resolution is 8 arcseconds per pixel.",
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
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_afternoon&styles=&srs=EPSG:4326&format=image/jpeg",
		descricao:"Dados diários disponíveis desde 12 de janeiro de 2008. A contiunously updating composite of visual images from AQUA MODIS scenes, see http://modis.gsfc.nasa.gov for details about MODIS. This dataset is built local on the OnEarth server, it updates as soon as scenes are available, usually with a 6 to 24 hour delay from real time. Images are produced from MODIS scenes using the HDFLook application. Base resolution is 8 arcseconds per pixel.",
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
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_terra_721&styles=&srs=EPSG:4326&format=image/jpeg",
		descricao:"Dados diários disponíveis desde 1 de janeiro de 2006 até 12 de março de 2008. This layer is no longer updated. Daily generated mosaic of TERRA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
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
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_aqua_721&styles=&srs=EPSG:4326&format=image/jpeg",
		descricao:"Dados diários disponíveis desde 1 de janeiro de 2006 até 12 de março de 2008. This layer is no longer updated. Daily generated mosaic of AQUA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
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
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_terra_ndvi&styles=&srs=EPSG:4326&format=image/jpeg",
		descricao:"Dados diários disponíveis desde 1 de janeiro de 2006 até 12 de março de 2008. This layer is no longer updated. Daily generated mosaic of TERRA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
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
		servico:"http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_aqua_ndvi&styles=&srs=EPSG:4326&format=image/jpeg",
		descricao:"Dados diários disponíveis desde 1 de janeiro de 2006 até 12 de março de 2008. This layer is no longer updated. Daily generated mosaic of AQUA images released by the MODIS Rapid Response System, http://rapidfire.gsfc.nasa.gov/. Updates every day, at about 1200Z, with images taken during the previous day. Maximum resolution is 8 arcseconds per pixel",
		anoInicio: 2006,
		mesInicio: 1,
		diaInicio: 1,
		anoFim: 2006,
		mesFim: 1,
		diaFim: 12,
		tipo: 3
	}
}
var ins = "<p>Escolha o serviço de dados</p>"
ins += "<select onchange='escolheuServico(this.value)'>"
ins += "<option value='' >---</option>"
for(var key in wms_configura){
	ins += "<option value='"+key+"'>"+wms_configura[key].titulo+"</option>"
}
ins += "</select>";
ins += "<p><TEXTAREA id='WMS_descricao' rows='2' cols='30' ></TEXTAREA></p>";
ins += "<table style='text-align:left'>"
ins += "<tr><td style='text-align:left'>Ano inicial: </td><td><input type=text value='0' id=WMS_anoinicio size=4 /></tr>"
ins += "<tr><td style='text-align:left'>Mês inicial: </td><td><input type=text value='nulo' id=WMS_mesinicio size=4 /></tr>"
ins += "<tr><td style='text-align:left'>Dia inicial: </td><td><input type=text value='nulo' id=WMS_diainicio size=4 /></tr>"

ins += "<tr><td style='text-align:left'>Ano final: </td><td><input type=text value='0' id=WMS_anofim size=4 /></tr>"
ins += "<tr><td style='text-align:left'>Mês final: </td><td><input type=text value='nulo' id=WMS_mesfim size=4 /></tr>"
ins += "<tr><td style='text-align:left'>Dia final: </td><td><input type=text value='nulo' id=WMS_diafim size=4 /></tr>"
ins += "</table>"

ins += "<p>Obter uma imagem por:</p>"
ins += "<select id='umaImagemPor'>"
ins += "<option value='' >---</option></select>" 

ins += "<div onclick='iniciaImagens()' style='text-align:left;left:0px;top:10px;'><input id='botao1' size=18 type='button' value='Continuar' /></div>"
$i("parametros").innerHTML = ins

new YAHOO.widget.Button("botao1");

function escolheuServico(idWMS){
	tipoServico = wms_configura[idWMS].tipo
	servico = wms_configura[idWMS].servico
	$i("WMS_descricao").value = wms_configura[idWMS].descricao
	
	$i("WMS_anoinicio").value = wms_configura[idWMS].anoInicio
	if(tipoServico > 1)
	$i("WMS_mesinicio").value = wms_configura[idWMS].mesInicio
	if(tipoServico > 2)
	$i("WMS_diainicio").value = wms_configura[idWMS].diaInicio
	$i("WMS_anofim").value = wms_configura[idWMS].anoFim
	if(tipoServico > 1)
	$i("WMS_mesfim").value = wms_configura[idWMS].mesFim
	if(tipoServico > 2)
	$i("WMS_diafim").value = wms_configura[idWMS].diaFim

	if(tipoServico == 1){
		var ins = "<option value='ano' selected >Ano</option>"
	}
	if(tipoServico == 2){
		var ins = "<option value='ano' >Ano</option>"
		ins += "<option value='mes' selected >Mês</option>"
	}
	if(tipoServico == 3){
		var ins = "<option value='ano'  >Ano</option>"
		ins += "<option value='mes' >Mês</option>"
		ins += "<option value='dia' selected >Dia</option>"
	}
	$i("umaImagemPor").innerHTML = ins;
}
function iniciaImagens(){
	$i("parametros").style.display="none"
	$i("quadroAnima").style.display="block"
	bbox = "-51.0347433181,-25.2688559441,-43.4155582517,-21.1417973665"
	//var time = "2008-01-01"
	w = 985
	h = 534
	d = w / 500
	dw = 500
	dh = parseInt(h / d)

	anoInicio = $i("WMS_anoinicio").value
	mesInicio = $i("WMS_mesinicio").value
	diaInicio = $i("WMS_diainicio").value

	anoFim = $i("WMS_anofim").value
	mesFim = $i("WMS_mesfim").value
	diaFim = $i("WMS_diafim").value

	intervalo = 1
	id = 1;
	
	ids = new Array()
	quantasLidas = 0
	onde = $i("imagens")
	ondeContador = $i("imagensLidas")
	ondeControle = $i("controle")
	idsValidos = new Array()
	idsTempo = new Array()
	parouQuantas = 0
	ondeMarcaTempo = $i("marcaTempo")
	ondeData = $i("marcaData")
	tempoAnima = 500

	if($i("umaImagemPor").value == "mes"){
		dataFixa = diaInicio;
		if(dataFixa < 10){var dataFixa = "0"+dataFixa;}
		var anoAtual = anoInicio;
		var mesAtual = mesInicio;
		while (anoAtual <= anoFim){
			while (mesAtual < 13){
				var mes = mesAtual;
				if(mes < 10){var mes = "0"+mes;}
				criaImg(anoAtual+"-"+dataFixa+"-"+mes,id)
				criaImgStatus(anoAtual+"-"+dataFixa+"-"+mes,id)
				ids.push(id)
				idsTempo.push(anoAtual+"-"+dataFixa+"-"+mes)
				id++
				mesAtual++
				if(anoAtual == anoFim && mesAtual > mesFim){var mesAtual = 13}
			}
			var mesAtual = 1
			anoAtual++;
		}
	}
	if($i("umaImagemPor").value == "dia"){
		var anoAtual = anoInicio;
		var mesAtual = mesInicio;
		var diaAtual = diaInicio
		while (anoAtual <= anoFim){
			while (mesAtual < 13){
				var mes = mesAtual;
				if(mes < 10){var mes = "0"+mes;}
				while (diaAtual < 31){
					var dia = diaAtual;
					if(diaAtual < 10){var dia = "0"+dia;}
					criaImg(anoAtual+"-"+dia+"-"+mes,id)
					criaImgStatus(anoAtual+"-"+dia+"-"+mes,id)
					ids.push(id)
					idsTempo.push(anoAtual+"-"+dia+"-"+mes)
					id++
					diaAtual++
					if(mesAtual == mesFim && diaAtual > diaFim){var diaAtual = 32}
				}
				mesAtual++
				if(anoAtual == anoFim && mesAtual > mesFim){var mesAtual = 13}
			}
			var mesAtual = 1
			anoAtual++;
		}
	}
}
function criaImg(tempo,id){
	var novoel = document.createElement("img");
	var p = "absolute"
	if(id==1){var p = "relative"}
	novoel.id = id;
	novoel.style.position = p
	novoel.style.top = "0px"
	novoel.style.left = "0px"
	novoel.style.width = dw+"px";
	novoel.style.height = dh+"px";
	novoel.src = servico+"&width="+dw+"&height="+dh+"&bbox="+bbox+"&time="+tempo //"../../imagens/atlas1.jpg";
	novoel.onload = function(){
		$i("status"+this.id).innerHTML = " <span style=color:red >OK</span>"
		idsValidos.push(this.id)
		parouQuantas++
		if(idsValidos.length == ids.length)
		{pararStatus()}
	}
	onde.appendChild(novoel);
}
function criaImgStatus(tempo,id){
	var novoel = document.createElement("div");
	novoel.id = "lida"+id;
	novoel.style.width="200px"
	novoel.innerHTML = "Imagem: "+tempo+"...<span style=cursor:pointer;color:blue onclick='pararImagem(\""+id+"\")' id='status"+id+"' >parar</span>"
	ondeContador.appendChild(novoel);
}
function pararImagem(id){
	if($i(id)){
		$i(id).src = "";
		//onde.removeChild(document.getElementById(id))
		idsValidos.push(id)
		$i("status"+id).innerHTML = "excluído"
		parouQuantas++
		if(parouQuantas == ids.length)
		{pararStatus()}
	}
	else
	{alert("Imagem excluída")}
}
function pararStatus(){
	ondeContador.style.display = "none"
	ondeControle.style.display="block"
	ondeMarcaTempo.style.display="block"
	ondeMarcaTempo.style.top = "10px"
	ondeControle.style.top = dh + 50 + "px"
	ondeData.style.top = dh + 30 + "px"
	ondeData.style.width = dw+"px"
	desativaQuadros()
	criaMarcadorTempo()
	//ajustaIds()
	ativaQuadro(1)
}
function ajustaIds(){

}
function criaMarcadorTempo(){
	var nmarcas = ids.length
	distanciaMarcas = parseInt(dw / nmarcas)
	var ins = ""
	var ini = parseInt((distanciaMarcas*i - (distanciaMarcas/2)))
	for(i=1;i<=nmarcas;i++){
		ins += "<img onmouseover='mostraI(\""+i+"\")' onmouseout='escondeI(\""+i+"\")' style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas*i - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1.gif' id='marcaTempo"+i+"' />"
	}
	ins += "<img style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1red.gif' id='marcaDeTempo' />"
	ins += "<img style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1cinza.gif' id='marcaGranulo' />"
	ngranulo = nmarcas;
	tgranulo = (parseInt((distanciaMarcas*i - (distanciaMarcas/2))) - ini) / 10;
	tempoGranulo = tempoAnima / 10
	ondeMarcaTempo.innerHTML = ins
	marcaVermelha = $i("marcaDeTempo");
	imgGranulo = $i("marcaGranulo")
	pararFilme()
}
function mostraI(obj){
	$i(obj).style.display="block";
	ondeData.innerHTML = idsTempo[obj-1]
	if($i(quadroAtual))
	$i(quadroAtual).style.display = "none"
	else
	$i("1").style.display = "none"
}
function escondeI(obj){
	$i(obj).style.display="none";
	ondeData.innerHTML = ""
	if($i(quadroAtual))
	$i(quadroAtual).style.display = "block"
	else
	$i("1").style.display = "block"
}

function desativaQuadros(){
	var n = idsValidos.length
	for(i=0;i<n;i++){
		$i(idsValidos[i]).style.display = "none"
	}
}
function ativaQuadro(i){
	var q = $i(i)
	if(q){
		q.style.position = "relative"
		q.style.display = "block"
	}
	marcaVermelha.style.left = $i("marcaTempo"+(i)).style.left
}
function pausarFilme(){
	pulaGranulo = 11
	try{
		clearTimeout(ganima)
	}catch(e){}
}
function pararFilme(){
	imgGranulo.style.left = parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px";
	quadroAtual = 0;
	desativaQuadros();
	ativaQuadro(ids[0])
	imgGranulo.style.display="none";
	ondeData.innerHTML = ""
	try{
		//clearTimeout(tanima)
		clearTimeout(ganima)
	}catch(e){}
}
function iniciarFilme(){
	imgGranulo.style.display="block"
	//tanima = setTimeout("anima()",tempoAnima)
	//ganima = setTimeout("animacaoGranulo()",tempoGranulo)
	anima()
}
function anima(){
	desativaQuadros()
	ativaQuadro(ids[quadroAtual])
	ondeData.innerHTML = idsTempo[quadroAtual]
	quadroAtual++
	if(quadroAtual < idsValidos.length){
		//tanima = setTimeout("anima()",tempoAnima)
		pulaGranulo = 0
		imgGranulo.style.left = $i("marcaTempo"+quadroAtual).style.left
		ganima = setTimeout("animacaoGranulo()",tempoGranulo)
	}
	else{
		imgGranulo.style.display="none"
		pararFilme()
	}
}
function animacaoGranulo(){
	imgGranulo.style.left = parseInt(imgGranulo.style.left) +  tgranulo + "px"
	pulaGranulo++
	//if(quadroAtual < idsValidos.length)
	if(pulaGranulo <= 10)
	ganima = setTimeout("animacaoGranulo()",tempoGranulo)
	else
	anima()
}
function maisrapido(){
	tempoGranulo = tempoGranulo - 10
}
function maislento(){
	tempoGranulo = tempoGranulo + 10
}

