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

/*
Title: i3geo mobile

Inicializa a versão do i3geo para dispositivos móveis.

A lista de mapas mostrada na tela é obtida do arquivo menutemas/mapas.xml ou outro que estiver definido na variável de configuração $locmapas (definido no i3geo/ms_configura.php) 

Faz o cálculo do tamanho da tela do dispositivo e repassa a variável para o programa inicia.php.

File: i3geo/mobile/index.php

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

*/

include_once("../classesphp/pega_variaveis.php");
require_once("../classesphp/funcoes_gerais.php");
include("../classesphp/classe_menutemas.php");
include("../classesphp/carrega_ext.php");
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
var w = screen.availWidth;
var h = screen.availHeight;
if (w > 600){var w = w/2;}
if (h > 600){var h = h/2;}
document.getElementById('wmobile').value = w;
document.getElementById('hmobile').value = h;
/*
Function: ligar

Inicializa o i3geo mobile passando a lista de temas que devem ser ativados

Parameter:

temas - lista de códigos de temas
*/
function ligar(temas)
{
	document.getElementById('temasa').value = temas;
	document.getElementById('f').submit();
}
</script>
</html>