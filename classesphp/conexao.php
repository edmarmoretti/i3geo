<?php
//
//Em admin existe tambem um conexao.php, mas ele nao faz a critica a variavel $i3GeoRegistraAcesso
//
//classesphp/conexao.php e utilizado preferencialmente para acesso de apenas leitura ao sistema de administracao
//
include(dirname(__FILE__)."/../ms_configura.php");
if(!isset($i3GeoRegistraAcesso)){
    $i3GeoRegistraAcesso = false;
}
if(!isset($conexaoadmin)){
	$conexaoadmin = "";
}
if(!isset($esquemaadmin)){
	$esquemaadmin = "";
}
if($esquemaadmin != ""){
	$esquemaadmin = str_replace(".","",$esquemaadmin).".";
}
if(!isset($logTransacoes)){
	$logTransacoes = false;
}
//
//indica se deve ser feita a convers&atilde;o para UTF8 ao gravar os dados
//
$convUTF = true;
if($conexaoadmin == ""){
	$arquivosqlite = $locaplic."/admin/admin.db";
	//chmod($arquivosqlite,0774);
	//echo $arquivosqlite;exit;
	if(!file_exists($arquivosqlite)){
		echo "O arquivo admin.db n&atilde;o existe. Utilize i3geo/admin/criabanco.php para criar o banco de dados SQLITE.";
		exit;
	}
	$conAdmin = "sqlite:$arquivosqlite";
	$conAdminw = "sqlite:$arquivosqlite";
	if(!extension_loaded("PDO")){
		echo "<span style=color:red >A extensao do PHP 'PDO' nao esta instalada.";
		exit;
	}
	if (!extension_loaded( "pdo_sqlite")){
		echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a pdo_sqlite<br></span>";
		exit;
	}
	if (!extension_loaded( "SQLite") && !extension_loaded( "sqlite3")){
		echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a SQLite<br></span>";
		exit;
	}
	try	{
		//para escrita
		$dbhw = new PDO($conAdminw);
		//para leitura
		$dbh = new PDO($conAdmin);
		if($i3GeoRegistraAcesso == false){
		    $dbhw = $dbh;
		}
	}
	catch (PDOException $e)	{
		print "Erro ao criar o objeto PDO!: <br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
		die();
	}
}
else {
	if(file_exists($conexaoadmin)){
		include($conexaoadmin);
		if($i3GeoRegistraAcesso == false){
		    $dbhw = $dbh;
		}
	} else {
		echo "Arquivo de conexao nao existe";
		exit;
	}
}
?>