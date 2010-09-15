<?php
/*
Title: Exemplo de arquivo de conexão alternativo

Esse programa pode ser incluído em ms_configura.php caso se queira alterar o banco de dados default e usar um banco Postgres

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
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/admin/php/conexaomma.php

*/
try
{
	$dbh = new PDO('pgsql:dbname=geodados;user=geodados;password=geodados;host=pgsql1.mma.gov.br');
	$dbhw = new PDO('pgsql:dbname=geodados;user=pgsql;password=pgsql;host=pgsql1.mma.gov.br');
}
catch (PDOException $e)
{
   	print "Erro ao criar o objeto PDO!: " . $e->getMessage() . "<br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
   	die();
}
$convUTF = false;
?>
