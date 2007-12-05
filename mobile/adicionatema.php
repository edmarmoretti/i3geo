<?php
/*
Title: Adiciona um tema ao mapa

File: i3geo/mobile/adicionatema.php

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

error_reporting(0);
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include("../classesphp/classe_menutemas.php");
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
</style>
<body>
<form id='f' action='adicionatema.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='grupo' type=hidden name='grupo' value='' />
	<input id='subgrupo' type=hidden name='subgrupo' value='' />
	<input id='tid' type=hidden name='tid' value='' />
</form>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br><br>
<?php
if ($tipo == "listatemas")
{
	$m = new Menutemas($tmpfname,"","nao");
	$r = $m->pegaListaDeTemas($grupo,$subgrupo,"");
	echo "Escolha o tema:<br><br>";
	foreach($r as $l)
	{
		echo "<input type='radio' onclick='adicionatema(\"".$l["tid"]."\")' />".$l["nome"]."<br>";
	}
}
if($tipo == "adicionatema")
{
	include("../classesphp/classe_mapa.php");
	$m = new Mapa($tmpfname);
	$m->adicionaTema($tid,$locaplic);
	$m->salva();
	$urln = "mobile.php?tmpfname=".$tmpfname;
	echo "<meta http-equiv='refresh' content='0;url=$urln'>";
}
if ($tipo == "adicionar")
{
	$m = new Menutemas($tmpfname,"",$locsistemas);
	$r = $m->pegaListaDeGrupos("","nao");
	echo "Escolha o sub-grupo:<br><br>";
	for($rid=0;$rid<count($r);$rid++)
	{
		$g = $r[$rid];
		echo $g["nome"]."<br>";
		$sub = $g["subgrupos"];
		for($sid=0;$sid<count($sub);$sid++)
		{
			$s = $sub[$sid];
			echo "<input type='radio' onclick='listatemas(\"".$rid."\",\"".$sid."\")' /><span style='color:gray;font-size:12pt;'>".$s["nome"]."</span><br>";
		}
	}
}

	
?>
</body>
<script>
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
function listatemas(grupo,sub)
{
	document.getElementById("tipo").value = "listatemas";
	document.getElementById("grupo").value = grupo;
	document.getElementById("subgrupo").value = sub;
	document.getElementById('f').submit();	
}
function adicionatema(tid)
{
	document.getElementById("tipo").value = "adicionatema";
	document.getElementById("tid").value = tid;
	document.getElementById('f').submit();	
}
</script>
</html>