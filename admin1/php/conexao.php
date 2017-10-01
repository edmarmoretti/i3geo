<?php
if(empty($_SESSION["locaplic"])){
	echo "locaplic nao definido em conexao.php";
	exit;
}
$conexaoadmin = $_SESSION["conexaoadmin"];
if(!isset($conexaoadmin)){
	$conexaoadmin = "";
}
if(!isset($logTransacoes)){
	$logTransacoes = false;
}
$esquemaadmin = $_SESSION["esquemaadmin"];
if(!isset($esquemaadmin)){
    $esquemaadmin = "";
}
if($esquemaadmin == "."){
    $esquemaadmin = "";
}
//
//indica se deve ser feita a convers&atilde;o para UTF8 ao gravar os dados
//
$convUTF = true;
if($conexaoadmin == ""){
	$arquivosqlite = $_SESSION["locaplic"]."/admin/admin.db";
	//chmod($arquivosqlite,0774);
	//echo $arquivosqlite;exit;
	if(!file_exists($arquivosqlite)){
		header ( "HTTP/1.1 500 O arquivo admin.db nao existe. Utilize i3geo/admin/criabanco.php para criar o banco de dados SQLITE." );
		exit;
	}
	$conAdmin = "sqlite:$arquivosqlite";
	$conAdminw = "sqlite:$arquivosqlite";
	if(!extension_loaded("PDO")){
		header ( "HTTP/1.1 500 PDO nao instalado" );
		exit;
	}
	if (!extension_loaded( "pdo_sqlite")){
		header ( "HTTP/1.1 500 pdo_sqlite nao instalado" );
		exit;
	}
	if (!extension_loaded( "SQLite") && !extension_loaded( "sqlite3")){
		header ( "HTTP/1.1 500 sqlite nao instalado" );
		exit;
	}
	try	{
		//para escrita
		$dbhw = new PDO($conAdminw);
		//para leitura
		$dbh = new PDO($conAdmin);
	}
	catch (PDOException $e)	{
		print "Erro ao criar o objeto PDO!: <br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
		die();
	}
}
else {
	include($conexaoadmin);
}
$_SESSION["convUTF"] = $convUTF;
unset ($convUTF);
?>