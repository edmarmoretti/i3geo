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
/*
Title: Interface do mapa

File: i3geo/mobile/mobile.php

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

Parameters:

tmpfname - nome do mapfile em uso
*/
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
$mapa = ms_newMapObj($tmpfname);
$w = $mapa->width;
$h = $mapa->height;
if (isset($utilizacgi) && strtolower($utilizacgi) == "sim")
{$nomeimagem = $locmapserv."?map=".$tmpfname."&mode=map";}
else
{
	$imgo = $mapa->draw();
	$nome = ($imgo->imagepath).nomeRandomico().".png";
	$imgo->saveImage($nome);
	$nomeimagem = ($imgo->imageurl).basename($nome);
}
?>
<div id='botoes' style="position:relative;top:1px;left:1px" >
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
		<option value='legenda'>legenda</option>
		<option value='escala'>escala</option>
		<option value='localizar'>localizar</option>
		<option value='adicionar'>adicionar</option>
	</select>
</div>
<form id='f' action='mobile.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname;?>' />
	<input id='tipo' type=hidden name='tipo' value='' />
</form>
<img id='mapa' style="position:relative;top:1px;left:1px" src='<?php echo $nomeimagem; ?>' />
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
	if (valor=="escala")
	{document.getElementById('f').action = "escala.php?"}
	if (valor=="ligar")
	{document.getElementById('f').action = "ligar.php?"}
	if (valor=="desligar")
	{document.getElementById('f').action = "desligar.php?"}
	if (valor=="legenda")
	{document.getElementById('f').action = "legenda.php?"}
	if (valor=="localizar")
	{document.getElementById('f').action = "localizar.php?"}
	if (valor=="adicionar")
	{document.getElementById('f').action = "adicionatema.php?"}
	document.getElementById('f').submit();
}
</script>
</html>
