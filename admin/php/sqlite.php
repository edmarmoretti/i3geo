<?php
echo "<pre>";
$dbh = new PDO('sqlite:../menutemas/admin.db');
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
foreach($resultado as $r)
{
	echo str_ireplace("INTEGER PRIMARY KEY","SERIAL",$r["sql"])."<br>";
}
echo "<br><br><span style=color:red >Listagem completa</span><br><br>";

var_dump($resultado);
$dbh = null;
?>