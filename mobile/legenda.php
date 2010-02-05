<?php
/*
Title: legenda.php

Mostra a legenda do mapa


Licenca

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

Arquivo: i3geo/mobile/legenda.php

Parametro:

tmpfname {string} - nome do mapfile em uso
*/
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include("../classesphp/classe_legenda.php");
include("../ms_configura.php");
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
<form id='f' action='mobile.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='tema' type=hidden name='tema' value='' />
</form>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br>
<?php
/*
$m = new Legenda($tmpfname,$locaplic,"",$template);
$r = $m->criaLegenda();
if(!$r){$r = "erro. Legenda nao disponivel";}
$r = mb_convert_encoding($r["legenda"],"ISO-8859-1","UTF-8");
echo $r;
*/
$map = ms_newMapObj($tmpfname);
$temas = $map->getalllayernames();
foreach ($temas as $tema)
{
	$layer = $map->getlayerbyname($tema);
	if (($layer->data != "") && ($layer->getmetadata("escondido") != "SIM") && ($layer->getmetadata("tema") != "NAO"))
	{
		if ($layer->numclasses > 0)
		{
			$classe = $layer->getclass(0);
			if (($classe->name == "") || ($classe->name == " "))
			{$classe->set("name",$layer->getmetadata("tema"));}
		}
	}
}
$nomeImagem = nomeRandomico();
$legenda = $map->legend;
$legenda->set("keysizex",20);
$legenda->set("keysizey",20);
$label = $legenda->label;
$label->set("size",14);

$legenda->set("status",MS_DEFAULT);
$imgo = $map->drawlegend();
$nomer = ($imgo->imagepath)."leg".$nomeImagem.".PNG";
$nomei = ($imgo->imageurl).basename($nomer);
$imgo->saveImage($nomer);
$pathlegenda = $dir_tmp."/".basename($imgo->imageurl)."/".basename($nomer);
echo "<img src='".$nomei."' />";
?>
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