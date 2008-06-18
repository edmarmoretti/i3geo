<?php
/*
Title: desligar.php

Desliga um tema que está visível no mapa

File: i3geo/mobile/desligar.php

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
	background-color:white;
}
h1
{
	font:16pt arial,helvetica,clean,sans-serif;
	color:brown;
}
</style>
<body>
<form id='f' action='desligar.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='tema' type=hidden name='tema' value='' />
</form>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br>
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
echo "<h1>Escolha o tema que vc não quer ver no mapa:</h1>";
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

