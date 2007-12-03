<html>
<style>
body
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:rgb(100,100,100);
}
p
{
	font:12pt arial,helvetica,clean,sans-serif;
	color:black;
}
input
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:blue;
	cursor:pointer;
}
</style>
<body>
<img src='../imagens/i3geo1.jpg' /><br>

<?php
include_once("../classesphp/pega_variaveis.php");
require_once("../classesphp/funcoes_gerais.php");
include("../classesphp/classe_menutemas.php");
include("../ms_configura.php");
$m = new Menutemas($tmpfname,"");
$mapas = $m->pegaListaDeMapas($locmapas);
foreach($mapas["mapas"] as $obj)
{
	echo "<input type=radio onclick='ligar(\"".$obj["TEMAS"]."\")' />".$obj["NOME"]."<br><br>";
}
?>
<form id=f action='inicia.php' method='get' >
<input id='wmobile' type=hidden name='wmobile' value='' />
<input id='hmobile' type=hidden name='hmobile' value='' />
<input type=hidden id=temasa name=temasa value='' />
</form>
<hr>
<p>O i3Geo &eacute; um software livre desenvolvido pelo Minist&eacute;rio do Meio Ambiente. Veja:
<a href='http://mapas.mma.gov.br' >http://mapas.mma.gov.br</a></p>
</body>
<script>
document.getElementById('wmobile').value = screen.availWidth;
document.getElementById('hmobile').value = screen.availHeight;
function ligar(temas)
{
	document.getElementById('temasa').value = temas;
	document.getElementById('f').submit();
}
</script>
</html>