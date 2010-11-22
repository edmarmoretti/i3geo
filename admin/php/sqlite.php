<?php
/*
Title: sqlite.php

Lista as definições do banco de dados de administração

Obtém as definições do arquivo i3geo/menutemas/admin.db

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

i3geo/admin/php/sqlite.php
*/
if(!file_exists("../../menutemas/admin.db"))
{
	echo "O arquivo menutemas/admin.db não existe. Utilize i3geo/admin/criasqlite.php para criar o banco de dados SQLITE.";
	exit;
}
echo "<pre>";
$dbh = new PDO('sqlite:../../menutemas/admin.db');
echo "<br><br><span style=color:red >Lista de tabelas</span><br><br>";
$q = $dbh->query("SELECT name FROM (SELECT * FROM sqlite_master UNION ALL SELECT * FROM sqlite_temp_master) WHERE type='table' ORDER BY name",PDO::FETCH_ASSOC);
$resultado = $q->fetchAll();
foreach ($resultado as $r)
echo $r["name"]."<br>";
$q = $dbh->query("select * from sqlite_master",PDO::FETCH_ASSOC);
$resultado = $q->fetchAll();
echo "<br><br><span style=color:red >SQL no padrão SQLITE</span><br><br>";
foreach($resultado as $r)
{
	echo $r["sql"]."<br>";
}
echo "<br><br><span style=color:red >SQL no padrão POSTGRES</span><br><br>";
echo "<br><br>Após criar as tabelas no Postgres, vc deve definir as permissões para os usuários.<br><br>";
echo "<br><br>Para usar outro banco de dados que não seja o default (SQLITE), você terá de alterar o programa i3geo/admin/php/conexao.php<br><br>";
foreach($resultado as $r)
{
	echo str_ireplace("INTEGER PRIMARY KEY","SERIAL",$r["sql"])."<br>";
}
echo "<br><br><span style=color:red >Listagem completa</span><br><br>";

var_dump($resultado);
$dbh = null;
$dbhw = null;
?>