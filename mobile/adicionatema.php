<?php
/*
Title: adicionatema.php

Adiciona um tema ao mapa

Monta e apresenta um formulário com a lista de grupos, subgrupos e temas

O usuário deve primeiro escolher um grupo para depois escolher um tema

Licenca:

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

Arquivo: i3geo/mobile/adicionatema.php

Parametro:

$tmpfname {string} - nome do mapfile em uso

$tipo {string} - tipo de operação
*/

error_reporting(E_ALL);
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include("../classesphp/classe_menutemas.php");
include("../ms_configura.php");
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
</head>
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
<form id='f' action='adicionatema.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='grupo' type=hidden name='grupo' value='' />
	<input id='subgrupo' type=hidden name='subgrupo' value='' />
	<input id='tid' type=hidden name='tid' value='' />
	<input id='idmenu' type=hidden name='idmenu' value='' />
</form>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br>
<?php
//
//identifica qual a url do i3geo
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = strtolower($protocolo[0]) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/mobile/adicionatema.php","",$protocolo.$_SERVER["PHP_SELF"]);
if ($tipo == "listatemas")
{
	$m = new Menutemas("","",$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
	$r = $m->pegaListaDeTemas($grupo,$subgrupo,$idmenu);
	echo "<h1>Escolha o tema:</h1>";
	foreach($r as $l)
	{
		echo "<input type='radio' onclick='adicionatema(\"".$l["tid"]."\")' />".converte($l["nome"])."<br>";
	}
	echo "<br>";
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
	echo "<h1>Escolha o sub-grupo:</h1>";
	$m = new Menutemas("","",$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
	$menus = $m->pegaListaDeMenus();
	
	foreach ($menus as $menu)
	{
		if($menu["publicado"] != "NAO")
		{
			$r = $m->pegaListaDeGrupos($menu["idmenu"],"nao","sim");
			error_reporting(0);
			//echo "<pre>";var_dump($r);exit;
			for($rid=0;$rid<count($r);$rid++)
			{
				if($r[$rid])
				{
					$g = $r[$rid];
					$idgrupo = $rid;
					if($g["id_n1"])
					{$idgrupo = $g["id_n1"];}
					if($g["subgrupos"])
					{
						echo converte($g["nome"])."<br>";
						$sub = $g["subgrupos"];
						if(count($sub) > 0)
						{
							for($sid=0;$sid<count($sub);$sid++)
							{
								$s = $sub[$sid];
								$idsubgrupo = $sub;
								if($s["id_n2"])
								{$idsubgrupo = $s["id_n2"];}								
								if($s["nome"] != "")
								echo "&nbsp;&nbsp;&nbsp;<input type='radio' onclick='listatemas(\"".$idgrupo."\",\"".$idsubgrupo."\",\"".$menu["idmenu"]."\")' /><span style='color:gray;font-size:12pt;'>".converte($s["nome"])."</span><br>";
							}
						}
					}
				}
			}
		}
	}
	echo "<br>";
}
function converte($texto){
	$texto = mb_convert_encoding($texto,"ISO-8859-1",mb_detect_encoding($texto));
	return $texto;	
}

?>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br>
</body>
<script>
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
function listatemas(grupo,sub,menu)
{
	document.getElementById("tipo").value = "listatemas";
	document.getElementById("grupo").value = grupo;
	document.getElementById("subgrupo").value = sub;
	document.getElementById("idmenu").value = menu;
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