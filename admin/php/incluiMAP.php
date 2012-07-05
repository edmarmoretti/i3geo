<?php
/*
 Title: incluiMAP.php

Ajusta mapfiles antigos incluindo a palavra MAP na primeira linha.

Esse ajuste &eacute; necess&aacute;rio em vers&otilde;es do Mapserver posteriores à 5.2

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/incluiMAP.php
*/

$funcao = "";
$locaplic = __DIR__."/../..";
include_once("admin.php");
include_once("conexao.php");
if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	formularioLoginMaster("incluiMAP.php");
	exit;
}
else{
	$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
	if($continua == false){
		echo "Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
		exit;
	}
}

$arquivos = array();
if (is_dir($locaplic."/temas"))
{
	if ($dh = opendir($locaplic."/temas"))
	{
		while (($file = readdir($dh)) !== false)
		{
			if(!stristr($file, '.map') === FALSE)
			{
				$arquivos[] = $file;
			}
		}
	}
	closedir($dh);
}
echo "Arquivos convertidos: <br>";
foreach($arquivos as $arquivo)
{
	$mapExiste = false;
	$arq = $locaplic."/temas/".$arquivo;
	$abre = fopen($arq, "r");
	$maparray = array();
	$maparray[] = "MAP";
	$maparray[] = "\n";
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$buffer = str_replace(PHP_EOL,"",rtrim($buffer));
		if(trim($buffer) != "MAP" && $buffer != "")
		{
			$maparray[] = $buffer;
		}
		else
		{$mapExiste = true;
		}
	}
	fclose($abre);
	$search = array(
			"transparency ",
			"LABELANGLEITEM ",
			"LABELMAXSCALE ",
			"LABELMINSCALE ",
			"LABELMINSCALE ",
			"LABELSIZEITEM ",
			"MAXSCALE ",
			"MINSCALE ",
			"SYMBOLSCALE "
	);
	$replace = array(
			"OPACITY ",
			"#LABELANGLEITEM ",
			"LABELMAXSCALEDENOM ",
			"LABELMINSCALEDENOM ",
			"LABELMINSCALEDENOM ",
			"#LABELSIZEITEM ",
			"MAXSCALEDENOM ",
			"MINSCALEDENOM ",
			"SYMBOLSCALEDENOM "
	);
	str_ireplace($search,$replace,$maparray);
	$abre = fopen($arq, "wt");
	foreach($maparray as $linha)
	{
		fwrite ($abre,$linha);
		fwrite ($abre,"\n");
	}
	$fecha = fclose ($abre);
	echo $arquivo."<br>";
}

?>