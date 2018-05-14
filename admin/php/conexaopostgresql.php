<?php
//$dbh usuario somente leitura
//$dbhw usuario com direito de escrita
try
{
	$dbh = new PDO('pgsql:dbname=i3geosaude;user=postgres;password=postgres;host=localhost');
	$dbhw = new PDO('pgsql:dbname=i3geosaude;user=postgres;password=postgres;host=localhost');
	//
	//Voce pode querer usar variaveis de ambiente
	//
	/*
	 if(getenv('DB_HOST')){
    	 $envhost = getenv('DB_HOST');
    	 $envport = getenv('DB_PORT');
    	 $envdatabase = getenv('DB_DATABASE');
    	 $envuser = getenv('DB_USER');
    	 $envpassw = getenv('DB_PASSWORD');
    	 $dbh = new PDO('pgsql:dbname={$envdatabase};user={$envuser};password={$envpassw};host={$envhost}');
    	 $dbhw = new PDO('pgsql:dbname={$envdatabase};user={$envuser};password={$envpassw};host={$envhost}');
	 }
	 */
}
catch (PDOException $e)
{
	print "Erro : " . " " . "<br/> Se vc estiver usando SQLITE, talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
	die();
}
$convUTF = true;
?>
