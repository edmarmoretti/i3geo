<?php
try
{
	$dbh = new PDO('pgsql:dbname=geodados;user=geodados;password=geodados;host=pgsql1.mapas.mma.gov.br');
	$dbhw = new PDO('pgsql:dbname=geodados;user=pgsql;password=pgsql;host=pgsql1.mapas.mma.gov.br');
}
catch (PDOException $e)
{
   	print "Erro ao criar o objeto PDO!: " . $e->getMessage() . "<br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
   	die();
}
$convUTF = false;
?>