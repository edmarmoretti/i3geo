<?php
/*
Title: sqlite.php

Lista as defini&ccedil;&otilde;es do banco de dados de administra&ccedil;&atilde;o

Obt&eacute;m as defini&ccedil;&otilde;es do arquivo i3geo/menutemas/admin.db

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

i3geo/admin/php/sqlite.php
*/
if(!file_exists("../admin.db"))
{
	echo "O arquivo menutemas/admin.db n&atilde;o existe. Utilize i3geo/admin/criasqlite.php para criar o banco de dados SQLITE.";
	exit;
}
echo "<pre>";
$dbh = new PDO('sqlite:../admin.db');
echo "<br><br><span style=color:red >Lista de tabelas</span><br><br>";
$q = $dbh->query("SELECT name FROM (SELECT * FROM sqlite_master UNION ALL SELECT * FROM sqlite_temp_master) WHERE type='table' ORDER BY name",PDO::FETCH_ASSOC);
$resultado = $q->fetchAll();
foreach ($resultado as $r)
echo $r["name"]."<br>";
$q = $dbh->query("select * from sqlite_master",PDO::FETCH_ASSOC);
$resultado = $q->fetchAll();
echo "<br><br><span style=color:red >SQL no padr&atilde;o SQLITE</span><br><br>";
foreach($resultado as $r)
{
	echo $r["sql"]."<br>";
}
echo "<br><br><span style=color:red >SQL no padr&atilde;o POSTGRES</span><br><br>";
echo "<br><br>Após criar as tabelas no Postgres, vc deve definir as permiss&otilde;es para os usu&aacute;rios.<br><br>";
echo "<br><br>Para usar outro banco de dados que n&atilde;o seja o default (SQLITE), voc&ecirc; ter&aacute; de alterar o programa i3geo/admin/php/conexao.php<br><br>";
foreach($resultado as $r)
{
	echo str_ireplace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$r["sql"])."<br>";
}
echo "<br><br><span style=color:red >Listagem completa</span><br><br>";

var_dump($resultado);
$dbh = null;
$dbhw = null;
?>