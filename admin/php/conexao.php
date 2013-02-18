<?php
/*
 Title: conexao.php

Define a conex&atilde;o com o banco de dados que cont&eacute;m as tabelas do sistema de administra&ccedil;&atilde;o do i3geo.

Verifique se sua instala&ccedil;&atilde;o do PHP suporta o uso da biblioteca PDO com sqlite

Por padr&atilde;o, a conex&atilde;o &eacute; feita com o banco de dados SQLITE i3geo/admin/admin.db mas vc pode usar outro banco de dados

Voc&ecirc; pode alterar a conex&atilde;o PDO modificando a vari&aacute;vel de configuara&ccedil;&atilde;o $conexaoadmin no i3geo/ms_configura.php

O programa define duas vari&aacute;veis que s&atilde;o usadas no acesso ao banco

dbhw - objeto PDO com a conex&atilde;o para leitura e escrita

dbh - objeto PDO com a conex&atilde;o para leitura

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

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

Arquivo: i3geo/admin/php/conexao.php

*/
if(isset($locaplic) && $locaplic != ""){
	include($locaplic."/ms_configura.php");
}
else{
	include(__DIR__."/../../ms_configura.php");
}
if(!isset($conexaoadmin)){
	$conexaoadmin = "";
}
if(!isset($esquemaadmin)){
	$esquemaadmin = "";
}
//
//indica se deve ser feita a convers&atilde;o para UTF8 ao gravar os dados
//
$convUTF = true;
if($conexaoadmin == ""){
	$arquivosqlite = $locaplic."/admin/admin.db";
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
	}
	catch (PDOException $e)	{
		print "Erro ao criar o objeto PDO!: " . $e->getMessage() . "<br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
		die();
	}
}
else
	include($conexaoadmin);

?>