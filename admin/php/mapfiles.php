<?php
/*
Title: mapfiles.php

Funções utilizadas pelo editor dos mapfiles de inicialização

É utilizado nas funções em AJAX da interface de edição que permite alterar os mapfiles geral1.map ou geral1windows.map

O mapfile que deve ser editado é obtido por meio do programa <admin.php>

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

Arquivo:

i3geo/admin/php/mapfiles.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, arvore.php?funcao=pegaGrupos.

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
require_once("admin.php");
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: PEGAPARAMETROSCONFIGURA
	
	Pega os parâmetros principais de configuração do mapfile
		
	Retorno:
	
	{JSON}
	*/
	case "PEGAPARAMETROSCONFIGURA":
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
	//depreciado
	case "RESTAURACONFIGURA":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$cp->register('restauraConfigura');
		unlink($temasaplic."/".$mapfile.".map");
		copy ($temasaplic."/".$mapfile.".default",$temasaplic."/".$mapfile.".map");
		$cp->set_data("ok");
		$cp->return_data();
	break;
	/*
	Valor: SALVACONFIGURA
	
	Salva o valor de um parâmetro no mapfile em edição
	
	Parametros:
	
	variavel
	
	valor
		
	Retorno:
	
	{JSON}
	*/
	case "SALVACONFIGURA":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		salvaConfigura($variavel,$valor,$mapfile,$temasaplic);
		retornaJSON("ok");
		exit;
	break;
}
/*
Salva um novo valor de uma variável no ms_configura.php
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