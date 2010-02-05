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
<script>
//limpa a tela caso tenha sido enviada alguma mensagem pelo ms_criamapa.php
if(document.body)
document.body.innerHTML="";
</script>
<body>

<?php
/*
Title: mobile.php

Interface de apresentação do mapa. Inicializa o mapa interativo da versão mobile.

A estrutura de funcionamento do mapa é baseada no reload da página toda vez que uma operação é executada.

Os parâmetros descritos abaixo são passados via URL.

Licenca:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

Arquivo:

i3geo/mobile/mobile.php

Parametros:

&tmpfname {string} - nome do mapfile em uso

&tipo {string} - tipo de operação que será executada
*/
/*
Section: PHP

Operações executadas do lado do servidor

Valores que o parâmetro "tipo" pode assumir.

Exemplo:

mobile.php?tipo=zoommais&tmpfname=xxxxxxx
*/
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
require_once("../classesphp/funcoes_gerais.php");
include("../ms_configura.php");
/*
Valor: zoommais

Aproxima o mapa no nível de zoom 5.
*/
if ($tipo=="zoommais")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->aproxima(5);
	$m->salva();		
}
/*
Valor: zoommais1

Aproxima o mapa no nível de zoom 3.
*/
if ($tipo=="zoommais1")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->aproxima(3);
	$m->salva();		
}
/*
Valor: zoommais2

Aproxima o mapa no nível de zoom 2.
*/
if ($tipo=="zoommais2")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->aproxima(2);
	$m->salva();		
}
/*
Valor: zoommenos

Afasta o mapa no nível de zoom 5.
*/
if ($tipo=="zoommenos")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->afasta(5);
	$m->salva();		
}
/*
Valor: zoommenos

Afasta o mapa no nível de zoom 3.
*/
if ($tipo=="zoommenos1")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->afasta(3);
	$m->salva();		
}
/*
Valor: zoommenos

Afasta o mapa no nível de zoom 2.
*/
if ($tipo=="zoommenos2")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->afasta(2);
	$m->salva();		
}
/*
Valor: norte

Desloca o mapa para o norte.
*/
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
/*
Valor: sul

Desloca o mapa para o sul.
*/
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
/*
Valor: leste

Desloca o mapa para o leste.
*/
if ($tipo=="leste")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$x = $m->mapa->width;
	$y = $m->mapa->height/2;
	$m->pan($x,$y,"","");
	$m->salva();		
}
/*
Valor: oeste

Desloca o mapa para o oeste.
*/
if ($tipo=="oeste")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$x = 0;
	$y = $m->mapa->height/2;
	$m->pan($x,$y,"","");
	$m->salva();		
}
/*
Valor: localizar

Abre formulário para busca geográfica.
*/
if ($tipo=="localizar")
{
	include("localizar.php");
	exit;
}
/*
Valor: localizarxy

Abre formulário para incluir um ponto no mapa
*/
if ($tipo=="localizarxy")
{
	include("localizarxy.php");
	exit;
}
/*
Valor: autopan

Desloca o mapa de forma interativa.
*/
if ($tipo =="autopan")
{
	include("../classesphp/classe_navegacao.php");
	$m = new Navegacao($tmpfname);
	$m->pan($x,$y,"","");
	$m->salva();
}
$mapa = ms_newMapObj($tmpfname);
$w = $mapa->width;
$h = $mapa->height;
error_reporting(E_ALL);
$imgo = $mapa->draw();
$nome = ($imgo->imagepath).nomeRandomico().".png";
$imgo->saveImage($nome);
$nomeimagem = ($imgo->imageurl).basename($nome);
//funde com a imagem da barra de navegacao
$ims = imagecreatefrompng("navegacao.png");
$img = imagecreatefrompng($nome);
$wdst = imagesx($img);
$hdst = imagesy($img);
$wsrc = imagesx($ims);
$hsrc = imagesy($ims);
$xdst = abs(($wdst - $wsrc) / 2);
$ydst = abs(($hdst - $hsrc) / 2);
$branco = imagecolorresolve($ims,255,255,255);
imagecopymerge($img,$ims,0,0,0,0,$wsrc,$hsrc,80);
ImagePNG($img, $nome);
if(!isset($maparef)){$maparef = "";}
?>
<div id='botoes' style="position:relative;top:1px;left:1px" >
	<select tabindex=13 id='op' name='op' onchange='op(this.value)'>
		<option value=''>Op&ccedil;&otilde;es</option>
		<option value='reiniciar'>reiniciar</option>
		<option value='ligar'>ligar camadas</option>
		<option value='desligar'>desligar camadas</option>
		<option value='adicionar'>adicionar camadas</option>
		<option value='ativatexto'>ativar textos</option>
		<option value='legenda'>ver a legenda</option>
		<option value='localizar'>localizar lugares</option>
		<option value='localizarxy'>localizar coordenada</option>
	</select>
	<div id=mensagem style=font-size:10pt; >
		<a href=# title="aproxima" onclick="zoommais()">+</a>&nbsp;
		<a href=# onclick="zoommenos()">-</a>&nbsp;
		<a href=# onclick="norte()">N</a>&nbsp;
		<a href=# onclick="sul()">S</a>&nbsp;
		<a href=# onclick="leste()">L</a>&nbsp;
		<a href=# onclick="oeste()">O</a>&nbsp;
	</div>
</div>
<form id='f' action='mobile.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname;?>' />
	<input id='tipo' type=hidden name='tipo' value='' />
	<input id='x' type=hidden name='x' value='' />
	<input id='y' type=hidden name='y' value='' />
	<input id='referencia' type=hidden name='maparef' value='<?php echo $maparef;?>' />
</form>
<map name="sample">
<area tabindex=1 onblur="mensagem('')" onfocus="mensagem('aproxima')" shape="rect" coords="0,0,40,23" onclick='zoommais()'>
<area tabindex=8 onblur="mensagem('')" onfocus="mensagem('aproxima+')" shape="rect" coords="0,24,40,31" onclick='zoommais1()'>
<area tabindex=9 onblur="mensagem('')" onfocus="mensagem('aproxima++')" shape="rect" coords="0,32,40,38" onclick='zoommais2()'>
<area tabindex=2 onblur="mensagem('')" onfocus="mensagem('afasta')" shape="rect" coords="0,57,40,77" onclick='zoommenos()'>
<area tabindex=10 onblur="mensagem('')" onfocus="mensagem('afasta+')" shape="rect" coords="0,43,40,49" onclick='zoommenos2()'>
<area tabindex=11 onblur="mensagem('')" onfocus="mensagem('afasta++')" shape="rect" coords="0,50,40,56" onclick='zoommenos1()'>

<area tabindex=3 onblur="mensagem('')" onfocus="mensagem('norte')" shape="rect" coords="0,78,40,90" onclick='norte()'>
<area tabindex=4 onblur="mensagem('')" onfocus="mensagem('leste')" shape="rect" coords="22,91,40,104" onclick='leste()'>
<area tabindex=5 onblur="mensagem('')" onfocus="mensagem('sul')" shape="rect" coords="0,106,40,119" onclick='sul()'>
<area tabindex=6 onblur="mensagem('')" onfocus="mensagem('oeste')" shape="rect" coords="0,91,18,105" onclick='oeste()'>
<area tabindex=7 onblur="mensagem('')" onfocus="mensagem('identifica')" shape="rect" coords="0,120,40,150" onclick='identifica()'>
</map>
<img id='mapa' tabindex=0 onclick='autopan(event)' style="position:relative;top:1px;left:1px;z-index:0;" src='<?php echo $nomeimagem; ?>' usemap="#sample" />
<br>
<a href=# tabindex=12 onclick="maparef()">Ativar/desativar mapa de referência</a>
<?php
if ((isset($maparef)) && ($maparef == "sim"))
{
	//$ref = $mapa->reference;
	$imgo = $mapa->drawreferencemap();
	$nome = ($imgo->imagepath).nomeRandomico().".png";
	$imgo->saveImage($nome);
	$nomeimagem = ($imgo->imageurl).basename($nome);
	echo "<br><img style=position:relative;top:1px;left:1px src='".$nomeimagem."' />";
		
}
?>
</body>
<script>
/*
Section: Javascript

Operações executadas pelo navegador
*/
modooperacao = ""
navn = false
navm = false
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
pan = ""
/*
Function: mensagem

Inclui uma mensagem no elemento HTML com id=mensagem

Parametro:

m {string} - mensagem
*/
function mensagem(m)
{
	if(m == ""){var m = "-";}
	document.getElementById("mensagem").innerHTML = m
}
/*
Function: zoommais

Executa a operação zoommais
*/
function zoommais()
{
	document.getElementById('tipo').value = 'zoommais';
	document.getElementById('f').submit();
}
/*
Function: zoommais1

Executa a operação zoommais1
*/
function zoommais1()
{
	document.getElementById('tipo').value = 'zoommais1';
	document.getElementById('f').submit();
}
/*
Function: zoommais2

Executa a operação zoommais2
*/
function zoommais2()
{
	document.getElementById('tipo').value = 'zoommais2';
	document.getElementById('f').submit();
}
/*
Function: zoommenos

Executa a operação zoommenos
*/
function zoommenos()
{
	document.getElementById('tipo').value = 'zoommenos';
	document.getElementById('f').submit();
}
/*
Function: zoommenos1

Executa a operação zoommenos1
*/
function zoommenos1()
{
	document.getElementById('tipo').value = 'zoommenos1';
	document.getElementById('f').submit();
}
/*
Function: zoommenos2

Executa a operação zoommenos2
*/
function zoommenos2()
{
	document.getElementById('tipo').value = 'zoommenos2';
	document.getElementById('f').submit();
}
/*
Function: norte

Executa a operação norte
*/
function norte()
{
	document.getElementById('tipo').value = 'norte';
	document.getElementById('f').submit();
}
/*
Function: sul

Executa a operação sul
*/
function sul()
{
	document.getElementById('tipo').value = 'sul';
	document.getElementById('f').submit();
}
/*
Function: leste

Executa a operação leste
*/
function leste()
{
	document.getElementById('tipo').value = 'leste';
	document.getElementById('f').submit();
}
/*
Function: oeste

Executa a operação oeste
*/
function oeste()
{
	document.getElementById('tipo').value = 'oeste';
	document.getElementById('f').submit();
}
/*
Function: op

Abre um novo formulário PHP

Parametro:

valor {string} - indica qual formulário deve ser aberto
*/
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
	if (valor=="reiniciar")
	{document.getElementById('f').action = "index.php?"}
	if (valor=="ativatexto")
	{document.getElementById('f').action = "ativatexto.php?"}
	if (valor=="localizarxy")
	{document.getElementById('f').action = "localizarxy.php?"}
	document.getElementById('f').submit();
}
/*
Function: maparef

Mostra na tela o mapa de referência
*/
function maparef()
{
	var temp = document.getElementById("referencia").value;
	if (temp == "sim")
	{document.getElementById("referencia").value = "";}
	else
	{document.getElementById("referencia").value = "sim";}
	document.getElementById('tipo').value = "";
	document.getElementById('f').submit();
}
/*
Function: autopan

Captura os parâmetros para executar a operação de deslocamento dinâmico do mapa
*/
function autopan(exy)
{
	var xy = capturaposicao(exy)
	if((xy[0] > 40) || (xy[1] > 150) )
	{
		document.getElementById('x').value = xy[0]
		document.getElementById('y').value = xy[1]
		document.getElementById('tipo').value = "autopan";
		document.getElementById('f').action = "mobile.php"
		if (modooperacao == "identifica")
		{document.getElementById('f').action = "identifica.php?"}
		document.getElementById('f').submit();
	}
}
/*
Function: identifica

Altera o modo de operação do mapa de forma que ao ser clicado, o resultado será a abertura de um formulário com os resultados do clique
*/
function identifica()
{
	modooperacao = "identifica"
	document.getElementById("botoes").innerHTML = "Clique no mapa"
}
/*
Function: capturaposicao

Calcula a posição do clique sobre o mapa

Retorno:

{array}
*/
function capturaposicao(exy)
{
	//var e = (navn) ? exy : window.event;
	var e = (document) ? exy : window.event;
	var xfig = e.clientX;
	var yfig = e.clientY;
	var obj = document.getElementById("mapa")
	var pos = findPos(obj)
	var xfig = xfig - pos[0]
	var yfig = yfig - pos[1]
	return [xfig,yfig]
}
/*
Function: findPos

Calcula a posição de um elemento HTML na tela

Retorno:

{array}
*/
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}
</script>
</html>
