<?php
/*
Title: upgradebanco44_45.php

Adiciona as novas tabelas utilizadas na versão 4.5

Se vc quiser recriar o banco de dados default, apague o arquivo
i3geo/admin/admin.db ou faça uma cópia. Depois é só executar esse programa.

Se a configuração do arquivo de conexão foi alterada (veja ms_configura.php), o novo
banco irá ser criado conforme a nova string de conexão.

Licenca:

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

Arquivo:

i3geo/admin/php/criabanco.php
*/
$funcao = "";
include_once("admin.php");
error_reporting(0);
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}

$tabelas = array(
"CREATE TABLE i3geoadmin_comentarios (comentario TEXT, data TEXT, openidnome TEXT, openidimagem TEXT, openidservico TEXT, openidusuario TEXT, openidurl TEXT, id_tema NUMERIC)"
);
if($conexaoadmin == "")
{
	$banco = sqlite_open("../admin.db",0666);
	$banco = null;
	$dbhw = new PDO('sqlite:../admin.db');
}
else
{
	include($conexaoadmin);	
}
foreach($tabelas as $tabela)
{
	if($dbhw->getAttribute(PDO::ATTR_DRIVER_NAME) == "pgsql")
	{
		$tabela = str_replace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$tabela);
	}
	$q = $dbhw->query($tabela);
}
$banco = null;
echo "Feito!!!";
?>