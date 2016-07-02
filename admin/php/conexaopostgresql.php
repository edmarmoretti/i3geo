<?php
//$dbh usuario somente leitura
//$dbhw usuario com direito de escrita
try
{
	$dbh = new PDO('pgsql:dbname=geodados;user=postgres;password=postgres;host=localhost');
	$dbhw = new PDO('pgsql:dbname=geodados;user=postgres;password=postgres;host=localhost');
}
catch (PDOException $e)
{
	print "Erro : " . " " . "<br/> Se vc estiver usando SQLITE, talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
	die();
}
$convUTF = true;
?>
