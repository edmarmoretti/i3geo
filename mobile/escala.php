<?php
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include("../classesphp/classe_escala.php");
?>
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
	color:black;
	cursor:pointer;
	background-color:white;
}
</style>
<body>
<form id='f' action='mobile.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='tema' type=hidden name='tema' value='' />
</form>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' />
</body>
<script>
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
</script>
</html>
<?php
$m = new Escala($tmpfname);
$escala = explode("'",$m->retornaBarraEscala());
echo "<br><br><img src='$escala[1]' />";
?>