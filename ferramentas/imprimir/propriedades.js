//eventos das guias
document.getElementById("guia1").onclick = function()
{escondeGuias();document.getElementById("guia1obj").style.display="block";};
document.getElementById("guia2").onclick = function()
{escondeGuias();document.getElementById("guia2obj").style.display="block";};
document.getElementById("guia3").onclick = function()
{escondeGuias();document.getElementById("guia3obj").style.display="block";};
document.getElementById("guia5").onclick = function()
{escondeGuias();document.getElementById("guia5obj").style.display="block";};
document.getElementById("guia6").onclick = function()
{
	window.parent.document.getElementById("wdoca").style.display="none";
	//window.parent.print(); 
};
function escondeGuias()
{
	document.getElementById("guia1obj").style.display="none";
	document.getElementById("guia2obj").style.display="none";
	document.getElementById("guia3obj").style.display="none";
	document.getElementById("guia5obj").style.display="none";
	document.getElementById("guia6obj").style.display="none";
}
objtitulo = new prop();
objtitulo.id = "titulo";
objtitulo.idtopo = "tituloTopo";
objtitulo.idesquerda = "tituloEsquerda";
objtitulo.idtamanho = "tituloTamanho";
objtitulo.idlargura = "tituloLargura";
objtitulo.idcor = "tituloCor";
objtitulo.idfundo = "tituloFundo";
objtitulo.idborda = "tituloBorda";
objtitulo.idbordacor = "tituloBordacor";
objtitulo.idbordaestilo = "tituloBordaestilo";
objtitulo.idpadding = "tituloPadding";
objtitulo.idordem = "tituloOrdem";

objlegenda = new prop();
objlegenda.id = "legenda";
objlegenda.idtopo = "legendaTopo";
objlegenda.idesquerda = "legendaEsquerda";
objlegenda.idtamanho = "legendaTamanho";
objlegenda.idlargura = "legendaLargura";
objlegenda.idcor = "legendaCor";
objlegenda.idfundo = "legendaFundo";
objlegenda.idborda = "legendaBorda";
objlegenda.idbordacor = "legendaBordacor";
objlegenda.idbordaestilo = "legendaBordaestilo";
objlegenda.idpadding = "legendaPadding";
objlegenda.idordem = "legendaOrdem";

objescalanumerica = new prop();
objescalanumerica.id = "escalanumerica";
objescalanumerica.idtopo = "escalanumericaTopo";
objescalanumerica.idesquerda = "escalanumericaEsquerda";
objescalanumerica.idtamanho = "escalanumericaTamanho";
objescalanumerica.idlargura = "escalanumericaLargura";
objescalanumerica.idcor = "escalanumericaCor";
objescalanumerica.idfundo = "escalanumericaFundo";
objescalanumerica.idborda = "escalanumericaBorda";
objescalanumerica.idbordacor = "escalanumericaBordacor";
objescalanumerica.idbordaestilo = "escalanumericaBordaestilo";
objescalanumerica.idpadding = "escalanumericaPadding";
objescalanumerica.idordem = "escalanumericaOrdem";

objmapa = new prop();
objmapa.id = "mapa";
objmapa.idtopo = "mapaTopo";
objmapa.idesquerda = "mapaEsquerda";
objmapa.idtamanho = "mapaTamanho";
objmapa.idlargura = "mapaLargura";
objmapa.idcor = "mapaCor";
objmapa.idfundo = "mapaFundo";
objmapa.idborda = "mapaBorda";
objmapa.idbordacor = "mapaBordacor";
objmapa.idbordaestilo = "mapaBordaestilo";
objmapa.idpadding = "mapaPadding";
objmapa.idordem = "mapaOrdem";

function prop()
{
	this.texto = function()
	{window.parent.document.getElementById(this.id).innerHTML = document.getElementById(this.id).value;};
	this.ordem = function()
	{
		var valor = document.getElementById(this.idordem).value;
		window.parent.document.getElementById(this.id).style.zIndex = valor;
	};
	this.topo = function()
	{
		var valor = document.getElementById(this.idtopo).value;
		window.parent.document.getElementById(this.id).style.top = valor + "px";
	};
	this.esquerda = function()
	{
		var valor = document.getElementById(this.idesquerda).value;
		window.parent.document.getElementById(this.id).style.left = valor + "px";
	};
	this.tamanho = function()
	{
		var valor = document.getElementById(this.idtamanho).value;
		window.parent.document.getElementById(this.id).style.fontSize = valor;
	};
	this.largura = function()
	{
		var valor = document.getElementById(this.idlargura).value;
		window.parent.document.getElementById(this.id).style.width = valor + "px";
	};
	this.cor = function()
	{
		var valor = document.getElementById(this.idcor).value;
		window.parent.document.getElementById(this.id).style.color = "RGB("+valor+")";
	};
	this.fundo = function()
	{
		var valor = document.getElementById(this.idfundo).value;
		window.parent.document.getElementById(this.id).style.backgroundColor = "RGB("+valor+")";
	};
	this.borda = function()
	{
		var valor = document.getElementById(this.idborda).value;
		window.parent.document.getElementById(this.id).style.borderWidth = valor;
	};
	this.bordacor = function()
	{
		var valor = document.getElementById(this.idbordacor).value;
		window.parent.document.getElementById(this.id).style.borderColor = "RGB("+valor+")";
	};
	this.bordaestilo = function()
	{
		var valor = document.getElementById(this.idbordaestilo).value;
		window.parent.document.getElementById(this.id).style.borderStyle = valor;
	};
	this.padding = function()
	{
		var valor = document.getElementById(this.idpadding).value;
		window.parent.document.getElementById(this.id).style.padding = valor;
	};
}