<html>
<style>
body
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:blue;
	margin:2px;
}
p
{
	font:12pt arial,helvetica,clean,sans-serif;
	color:black;
}
input
{
	font:12pt arial,helvetica,clean,sans-serif;
	color:black;
	cursor:pointer;
	background-color:white;
}
</style>
<body>

<?php

include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
require_once("../classesphp/funcoes_gerais.php");
include("../ms_configura.php");
if ($tipo=="zoommais")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->aproxima(3);
	$m->salva();		
}
if ($tipo=="zoommenos")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->afasta(3);
	$m->salva();		
}
if ($tipo=="norte")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$x = $m->mapa->width;
	$x = $x/2;
	$y = 0;
	$m->pan($x,$y,"","");
	$m->salva();		
}
if ($tipo=="sul")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$x = $m->mapa->width;
	$x = $x/2;
	$y = $m->mapa->height;
	$m->pan($x,$y,"","");
	$m->salva();		
}
if ($tipo=="leste")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$x = $m->mapa->width;
	$y = $m->mapa->height/2;
	$m->pan($x,$y,"","");
	$m->salva();		
}
if ($tipo=="oeste")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$x = 0;
	$y = $m->mapa->height/2;
	$m->pan($x,$y,"","");
	$m->salva();		
}
if ($tipo=="ligar")
{
	include("ligar.php");
	exit;	
}
if ($tipo=="desligar")
{
	include("desligar.php");
	exit;	
}
$mapa = ms_newMapObj($tmpfname);
$w = $mapa->width;
$h = $mapa->height;

$imgo = $mapa->draw();
$nome = ($imgo->imagepath).nomeRandomico().".png";
$imgo->saveImage($nome);
$nomeimagem = ($imgo->imageurl).basename($nome);
?>
<div id='botoes' >
	<input type='button' value='+' onclick='zoommais()' />
	<input type='button' value='-' onclick='zoommenos()' />
	<input type='button' value='N' onclick='norte()' />
	<input type='button' value='S' onclick='sul()' />
	<input type='button' value='L' onclick='leste()' />
	<input type='button' value='O' onclick='oeste()' />
	<select id='op' name='op' onchange='op(this.value)'>
		<option value=''>Op&ccedil;&otilde;es</option>
		<option value='ligar'>ligar</option>
		<option value='desligar'>desligar</option>
	</select>
</div>
<form id='f' action='mobile.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname;?>' />
	<input id='tipo' type=hidden name='tipo' value='' />
</form>
<img id='mapa' src='<?php echo $nomeimagem; ?>' />
</body>
<script>
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
pan = ""
function zoommais()
{
	document.getElementById('tipo').value = 'zoommais';
	document.getElementById('f').submit();
}
function zoommenos()
{
	document.getElementById('tipo').value = 'zoommenos';
	document.getElementById('f').submit();
}
function norte()
{
	document.getElementById('tipo').value = 'norte';
	document.getElementById('f').submit();
}
function sul()
{
	document.getElementById('tipo').value = 'sul';
	document.getElementById('f').submit();
}
function leste()
{
	document.getElementById('tipo').value = 'leste';
	document.getElementById('f').submit();
}
function oeste()
{
	document.getElementById('tipo').value = 'oeste';
	document.getElementById('f').submit();
}
function op(valor)
{
	document.getElementById('tipo').value = valor;
	document.getElementById('f').submit();
}
</script>
</html>
