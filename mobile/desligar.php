<?php
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include("../classesphp/classe_vermultilayer.php");
include("../classesphp/classe_mapa.php");
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
}
</style>
<body>
<form id='f' action='desligar.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='tema' type=hidden name='tema' value='' />
</form>
<?php
$m = New Mapa($tmpfname);
if(isset($tema) && $tema != '')
{
	$m->ligaDesligaTemas("","$tema");
	$m->salva();
}
$m = New Mapa($tmpfname);
$par = $m->parametrosTemas();
$par = mb_convert_encoding($par,"ISO-8859-1","UTF-8");
$par = explode("'",$par);
$par = explode(";",$par[1]);
echo "Escolha o tema que vc não quer ver no mapa:<br><br>";
$existe = false;
foreach($par as $p)
{
	$p = explode("*",$p);
	if($p[1] == 2)
	{
		$existe=true;
		echo "<input type=radio value='$p[0]' onclick='desligar(this.value)' />".$p[2]."<br>";
	}
}
if (!$existe)
echo "<span style='color:red' >Nenhum tema dispon&iacute;vel.</br>";
?>
<br><input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' />
</body>
<script>
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
function desligar(tema)
{
	document.getElementById('tema').value=tema;
	document.getElementById('f').submit();
}
</script>
</html>

