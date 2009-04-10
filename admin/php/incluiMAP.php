<?php
/*
Title: Inclui teg MAP

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

19/6/2007

*/

include_once("admin.php");
error_reporting(0);
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}

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
	}
	fclose($abre);
	//echo "<pre>";
	//var_dump($maparray);
	//exit;
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