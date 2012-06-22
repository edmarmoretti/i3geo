<?php
/*
Title: conexao.php

Define a conexão com o banco de dados que contém as tabelas do sistema de administração do i3geo.

Verifique se sua instalação do PHP suporta o uso da biblioteca PDO com sqlite

Por padrão, a conexão é feita com o banco de dados SQLITE i3geo/admin/admin.db mas vc pode usar outro banco de dados

Você pode alterar a conexão PDO modificando a variável de configuaração $conexaoadmin no i3geo/ms_configura.php

O programa define duas variáveis que são usadas no acesso ao banco

dbhw - objeto PDO com a conexão para leitura e escrita

dbh - objeto PDO com a conexão para leitura

Licença:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/admin/php/conexao.php

*/
if(isset($locaplic) && $locaplic != "")
{include($locaplic."/ms_configura.php");}
else
{
	if (file_exists("../../../ms_configura.php"))
	{include("../../../ms_configura.php");}
	else
	{
		if (file_exists("../../ms_configura.php"))
		{include("../../ms_configura.php");}
		else
		{
			if (file_exists("../ms_configura.php"))
			{include("../ms_configura.php");}
			else
			if (file_exists("ms_configura.php"))
			{include("ms_configura.php");}
		}
	}
}
if(!isset($conexaoadmin))
{$conexaoadmin = "";}
if(!isset($conexaoadmin))
{$esquemaadmin = "";}
//
//indica se deve ser feita a conversão para UTF8 ao gravar os dados
//
$convUTF = true;

if($conexaoadmin == "")
{
	$arquivosqlite = $locaplic."/admin/admin.db";
	if(!file_exists($arquivosqlite))
	{
		echo "O arquivo admin.db não existe. Utilize i3geo/admin/criabanco.php para criar o banco de dados SQLITE.";
		exit;
	}
	$conAdmin = "sqlite:$arquivosqlite";
	$conAdminw = "sqlite:$arquivosqlite";
	if(!extension_loaded("PDO")){
		echo "A extensao do PHP 'PDO' nao esta instalada.";
	}
	try
	{
		//para escrita
		$dbhw = new PDO($conAdminw);
		//para leitura
		$dbh = new PDO($conAdmin);
	}
	catch (PDOException $e)
	{
    	print "Erro ao criar o objeto PDO!: " . $e->getMessage() . "<br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
    	die();
	}

}
else
include($conexaoadmin);

?>