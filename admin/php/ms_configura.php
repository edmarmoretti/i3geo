<?php
/*
Title: ms_configura.php

Funções utilizadas pelo editor do arquivo ms_configura

ms_configura.php contém uma série de variáveis de configuração do i3Geo.

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

i3geo/admin/php/ms_configura.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, ms_configura.php?funcao=PEGAPARAMETROSCONFIGURA

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
include_once("admin.php");
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}

//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: PEGAPARAMETROSCONFIGURA
	
	Lista os valores atuais das variáveis registradas no ms_configura
	
	Retorno:
	
	{JSON}
	*/
	case "PEGAPARAMETROSCONFIGURA":
		$vs = array(
			"\$dir_tmp",
			"\$mensagemInicia",
			"\$tituloInstituicao",
			"\$locaplic",
			"\$temasdir",
			"\$temasaplic",
			"\$locmapserv",
			"\$locsistemas",
			"\$locidentifica",
			"\$locmapas",
			"\$R_path",
			"\$postgis_con",
			"\$srid_area",
			"\$postgis_mapa",
			"\$utilizacgi",
			"\$atlasxml",
			"\$expoeMapfile",
			"\$menutemas",
			"\$conexaoadmin",
			"\$googleApiKey",
			"\$interfacePadrao"
		);
		$par = array();
		foreach ($vs as $v)
		{
			eval("\$s = $v;");
			if(is_array($s))
			{
				$par[$v] = $s;
			}
			else
			$par[$v] = utf8_encode($s);
		}
		retornaJSON($par);
		exit;
	break;
	/*
	Valor: SALVACONFIGURA
	
	Salva um novo valor de uma variável no ms_configura.php

	Parameters:

	variavel - nome da variável

	valor - novo valor
	
	Retorno:
	
	{JSON}
	*/
	case "SALVACONFIGURA":
		salvaConfigura($variavel,$valor);
		retornaJSON("ok");
	exit;
	break;
}
/*
Salva um novo valor de uma variável no ms_configura.php
*/
function salvaConfigura($variavel,$valor)
{
	//$valor = resolveAcentos($valor,"html");
	$handle = fopen ("../../ms_configura.php", "r");
	$linhas = array();
	while (!feof ($handle)) {
    	$buffer = fgets($handle);
    	$temp = explode("=",$buffer);
    	$temp = trim($temp[0]);
    	if ($temp == $variavel)
     	$linhas[] = $variavel." = '".$valor."';\n";
     	else
     	$linhas[] = $buffer;
	}
	fclose ($handle);
	unlink("../../ms_configura.php");
	$handle = fopen ("../../ms_configura.php", "w");
	foreach ($linhas as $linha)
	{
		fwrite($handle, $linha);
	}
	fclose($handle);
}
?>