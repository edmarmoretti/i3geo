<?php
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