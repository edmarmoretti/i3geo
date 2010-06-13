parametrosURL()
mensagemAjuda("men1","")
mensagemOpcao("opc1","")
xpt = unescape(((((window.location.href).split("x="))[1]).split("&"))[0] );
ypt = unescape(((((window.location.href).split("y="))[1]).split("&"))[0] );

$i("guia1").onclick = function()
{
	$i("guia1obj").style.display="block";
}
$i("guia2").onclick = function()
{
	$i("guia2obj").style.display="block";
	$i("coord").innerHTML = "Você clicou nas coordenadas <br>x: "+xpt+"<br>y: "+ypt
}
$i("guia3").onclick = function()
{
	$i("guia3obj").style.display="block";
	alert("voce clicou na guia 3")
}

