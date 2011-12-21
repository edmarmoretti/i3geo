<?php
/*
Title: localizarxy.php

Constrói e apresenta na tela um formulário para o usuário indicar um par de coordenadas para inserir um ponto no mapa

Licenca

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/mobile/localizar.php

Parametro:

tmpfname {string} - nome do mapfile em uso

x {numerico} - coordenada x em dms

y {numerico} - coordenada y em dms
*/
error_reporting(E_ALL);
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include_once("../classesphp/funcoes_gerais.php");
include("../ms_configura.php");

if (isset($x) && $x != "")
{
	include("../classesphp/classe_temas.php");
	$m = new Temas($tmpfname);
	$m->insereFeature("ponto","POINT",($x." ".$y),"","","","","","","","","","","","","","","","","","","12","");
	$m->salva();
	echo "Coordenadas $x e $y inseridas.<br>Clique em 'retornar' para voltar ao mapa.<br><br>";
}
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
h1
{
	font:16pt arial,helvetica,clean,sans-serif;
	color:brown;
}
</style>
<body>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br><br>
<form id='f' action='localizarxy.php?' method='get'>
	Digite as coordenadas do ponto desejado. Utilize coordenadas na proje&ccedil;&atilde;o geogr&aacute;fica em graus, minutos e segundos.
	Ao digitar o valor de grau, utilize o sinal de "-" antes do valor para indicar que a coordenada est&aacute; ao sul do equador ou oeste,
	por exemplo: -54 00 00 e -12 00 00. Ao digitar os segundos, utilize "." como separador de decimal caso seja necess&aacute;rio.
	Coordenadas X correspondem à longitude e coordenadas y à latitude.<br><br>
	Coordenada X:<br>
	<input type=text name=x id=x value="" size=14 /><br>
	Coordenada Y:<br>
	<input type=text name=y id=y value="" size=14 /><br>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
</form>
<input type='button' id='localizar' value='localizar' style='cursor:pointer;' onclick='localizar()' /><br><br>


</body>
<script>
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
function convdmsdd(cd,cm,cs)
{
	var sinal = 'positivo';
	if (cd < 0)
	{
		cd = cd * -1;
		sinal = 'negativo';
	}
	spm = cs / 3600;
	mpg = cm / 60;
	var dd = (cd * 1) + (mpg * 1) + (spm * 1);
	if (sinal == 'negativo')
	{dd = dd * -1;}
	return (dd);
}
function localizar()
{
	var x = document.getElementById("x").value.split(" ")
	if(!x[1]) x[1] = 0;
	if(!x[2]) x[2] = 0;
	var x = convdmsdd(x[0],x[1],x[2]);
	document.getElementById("x").value = x
	var y = document.getElementById("y").value.split(" ")
	if(!y[1]) y[1] = 0;
	if(!y[2]) y[2] = 0;
	var y = convdmsdd(y[0],y[1],y[2]);
	document.getElementById("y").value = y	
	document.getElementById('tipo').value='executa';
	document.getElementById('f').submit();	
}

</script>
</html>