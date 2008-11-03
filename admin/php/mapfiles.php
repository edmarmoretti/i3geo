<?php
/*
Title: Administração dos mapfiles principais

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

File: i3geo/admin/mapfiles.php

19/6/2007

*/
require_once("admin.php");
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//pega os parâmetros do ms_configura
	case "pegaParametrosConfigura":
	$vs = array(
		"FONTSET ",
		"SYMBOLSET ",
		"SHAPEPATH ",
		"EXTENT ",
		"IMAGE ",
		"IMAGEPATH ",
		"IMAGEURL "
	);
	$par = array();
	foreach ($vs as $v)
	{
		$handle = fopen ($temasaplic."/".$mapfile.".map", "r");
		while (!feof ($handle)) {
    		$buffer = fgets($handle);
			if(!(stristr($buffer, $v) === FALSE))
			{
    			$temp = explode(trim($v),$buffer);
    			if(trim($temp[0]) != "#")
    			{
    				$temp = trim($temp[1]);
    				$par[trim($v)] = $temp;
    				fclose ($handle);
    				break;
    			}
  			}    		
		}
	}
	retornaJSON($par);
	exit;
	break;
	
	//retorna o mapfile atual como texto
	case "restauraConfigura":
	$cp->register('restauraConfigura');
	unlink($temasaplic."/".$mapfile.".map");
	copy ($temasaplic."/".$mapfile.".default",$temasaplic."/".$mapfile.".map");
	$cp->set_data("ok");
	$cp->return_data();
	break;
	
	//salva um novo valor para uma variável do ms_configura
	case "salvaConfigura":
	salvaConfigura($variavel,$valor,$mapfile,$temasaplic);
	retornaJSON("ok");
	exit;
	break;
}
/*
Function: salvaConfigura

Salva um novo valor de uma variável no ms_configura.php

Parameters:

variavel - nome da variável

valor - novo valor
*/
function salvaConfigura($variavel,$valor,$mapfile,$temasaplic)
{
	$handle = fopen ($temasaplic."/".$mapfile.".map", "r");
	$linhas = array();
	$valor = str_replace("\\\"",'"',$valor);
	while (!feof ($handle)) {

    	$buffer = fgets($handle);
		if(!(stristr($buffer, $variavel) === FALSE))
		{
    		$temp = explode(trim($variavel),$buffer);
    		if(trim($temp[0]) != "#")
    		{
    			$temp = trim($temp[1]);
    			$par[trim($variavel)] = $temp;
    			$linhas[] = $variavel." ".$valor."\n";
    			$variavel = "______________";
    		}
    		else{$linhas[] = $buffer;}
  		}    		
		else
		$linhas[] = $buffer;
	}
	fclose ($handle);
	unlink($temasaplic."/".$mapfile.".map");
	$handle = fopen ($temasaplic."/".$mapfile.".map", "w");
	foreach ($linhas as $linha)
	{
		fwrite($handle, $linha);
	}
	fclose($handle);
}

?>