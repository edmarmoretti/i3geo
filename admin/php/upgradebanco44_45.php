<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../html/admin.css">
</head>
<body class="yui-skin-sam fundoPonto" >
<div class="bordaSuperior"  >&nbsp;</div>
<div class="mascaraPrincipal" id="divGeral" style=text-align:left >
Upgrade do banco de administra&ccedil;&atilde;o<br><br>
<?php
/*
Title: upgradebanco44_45.php

Adiciona as novas tabelas utilizadas na vers&atilde;o 4.5

Se vc quiser recriar o banco de dados default, apague o arquivo
i3geo/admin/admin.db ou fa&ccedil;a uma cópia. Depois &eacute; só executar esse programa.

Se a configura&ccedil;&atilde;o do arquivo de conex&atilde;o foi alterada (veja ms_configura.php), o novo
banco ir&aacute; ser criado conforme a nova string de conex&atilde;o.

Licenca:

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

Arquivo:

i3geo/admin/php/criabanco.php
*/
$funcao = "";
include_once("admin.php");
include_once("conexao.php");

if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	formularioLoginMaster("upgradebanco44_45.php");
	exit;
}
else{
	$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
	if($continua == false){
		echo "Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
		exit;
	}
}
error_reporting(E_ALL);
$tabelas = array(
"CREATE TABLE i3geoadmin_comentarios (comentario TEXT, data TEXT, openidnome TEXT, openidimagem TEXT, openidservico TEXT, openidusuario TEXT, openidurl TEXT, id_tema NUMERIC)",
"CREATE TABLE i3geoadmin_acessostema (codigo_tema TEXT, nacessos NUMERIC,dia NUMERIC, mes NUMERIC, ano NUMERIC)"
);
/*
if($conexaoadmin == "")
{
	//$banco = sqlite_open("../admin.db",0666);
	//$banco = null;
	$dbhw = new PDO('sqlite:../admin.db');
}
else
{
	include($conexaoadmin);	
}
*/
foreach($tabelas as $tabela)
{
	if($dbhw->getAttribute(PDO::ATTR_DRIVER_NAME) == "pgsql")
	{
		$tabela = str_replace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$tabela);
	}
	$q = $dbhw->query($tabela);
   	if($q)
   	{
		$banco = null;
		echo "<br>Feito!!!<pre>";
		var_dump($tabelas);
   	}
   	else
   	{
		echo "<pre>Ocorreu algum problema. Tabelas que deveriam ter sido criadas:\n";
		var_dump($tabelas);
		$e = $dbhw->errorInfo();
		throw new Exception($e[2]);
   	}
}

?>
</div>