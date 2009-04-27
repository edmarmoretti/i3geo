servico = "http://onearth.jpl.nasa.gov/wms.cgi?REQUEST=GetMap&layers=daily_planet&styles=&srs=EPSG:4326&format=image/jpeg"
bbox = "-51.0347433181,-25.2688559441,-43.4155582517,-21.1417973665"
var time = "2008-01-01"
var w = 985
var h = 534
var d = w / 500
dw = 500
dh = parseInt(h / d)

var anoInicio = 2008
var mesInicio = 4
var diaInicio = 1

var anoFim = 2009
var mesFim = 4
var diaFim = 1

var tipoIntervalo = "mes"
var intervalo = 1
var dataFixa = "01"
var id = 1;
var ids = new Array()
var quantasLidas = 0
var onde = $i("imagens")
var ondeContador = $i("imagensLidas")
var ondeControle = $i("controle")
var idsValidos = new Array()
var idsTempo = new Array()
var parouQuantas = 0
var ondeMarcaTempo = $i("marcaTempo")
var ondeData = $i("marcaData")
var tempoAnima = 500

if(tipoIntervalo == "mes"){
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
	novoel.src = "../../imagens/atlas1.jpg"; //servico+"&width="+dw+"&height="+dh+"&bbox="+bbox+"&time="+tempo
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
		onde.removeChild(document.getElementById(id))
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
	ajustaIds()
	ativaQuadro(1)
}
function criaMarcadorTempo(){
	var nmarcas = ids.length
	distanciaMarcas = parseInt(dw / nmarcas)
	var ins = ""
	var ini = parseInt((distanciaMarcas*i - (distanciaMarcas/2)))
	for(i=1;i<=nmarcas;i++){
		ins += "<img style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas*i - (distanciaMarcas/2)))+"px;' src='../../imagens/dot1.gif' id='marcaTempo"+i+"' />"
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
function ajustaIds(){
	
}
