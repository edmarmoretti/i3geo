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
Title: upgradebanco46_47.php

Adiciona as novas tabelas utilizadas na vers&atilde;o 4.7

Se vc quiser recriar o banco de dados default, apague o arquivo
i3geo/admin/admin.db ou fa&ccedil;a uma cópia. Depois &eacute; só executar o programa i3geo/admin/php/criabanco.php.

Se a configura&ccedil;&atilde;o do arquivo de conex&atilde;o foi alterada (veja ms_configura.php), o novo
banco ir&aacute; ser criado conforme a nova string de conex&atilde;o.

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

i3geo/admin/php/criabanco.php
*/
/**
 *
 * TODO verificar se as tabelas estão ok para o novo sistema de admin de usuarios
 */
$funcao = "";
$locaplic = __DIR__."/../..";
include_once("admin.php");
include_once("conexao.php");

if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	formularioLoginMaster("upgradebanco46_47.php");
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
"CREATE TABLE ".$esquemaadmin."i3geoadmin_usuarios (ativo NUMERIC, data_cadastro TEXT, email TEXT, id_usuario INTEGER PRIMARY KEY, login TEXT, nome_usuario TEXT, senha TEXT)",
"CREATE TABLE ".$esquemaadmin."i3geoadmin_papelusuario (id_papel NUMERIC, id_usuario NUMERIC)",
"CREATE TABLE ".$esquemaadmin."i3geoadmin_papeis (descricao TEXT, id_papel INTEGER PRIMARY KEY, nome TEXT)",
"CREATE TABLE ".$esquemaadmin."i3geoadmin_operacoes (id_operacao INTEGER PRIMARY KEY, codigo TEXT, descricao TEXT)",
"CREATE TABLE ".$esquemaadmin."i3geoadmin_operacoespapeis (id_operacao NUMERIC, id_papel NUMERIC)"
);
foreach($tabelas as $tabela)
{
	if($dbhw->getAttribute(PDO::ATTR_DRIVER_NAME) == "pgsql")
	{
		$tabela = str_replace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$tabela);
	}
	$q = $dbhw->query($tabela);
   	if($q)
   	{
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
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_papeis VALUES('Podem executar qualquer tarefa, inclusive cadastrar novos administradores',1,'admin')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_papeis VALUES('Podem criar/editar qualquer tema (mapfile) mas nao podem editar a arvore do catalogo de temas',2,'editores')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_papeis VALUES('Podem alterar a arvore do catalogo e dos atlas',3,'publicadores')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_papeis VALUES('Podem editar dados geograficos',4,'editoresgeo')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_usuarios VALUES(1,'','',1,'admin','admin','admin')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_papelusuario VALUES(1,1)");

		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(1,'admin/html/editormapfile','editor de mapfiles do sistema de administracao')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(2,'admin/html/operacoes','abre o editor de operacoes')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(3,'teste/','teste')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(4,'admin/html/arvore','edicao da arvore do catalogo de temas')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(5,'admin/html/menus','edicao da lista de menus')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(6,'admin/html/ogcws','edicao das preferencias do servico WMS')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(7,'admin/html/atlas','edicao de atlas')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(8,'admin/html/identifica','lista de sistemas incluidos na ferramenta de identificacao')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(9,'admin/html/incluimap','adapta mapfiles antigos para versoes novas do Mapserver')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(10,'admin/html/mapas','lista de links para mapas')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(11,'admin/html/perfis','lista controlada de perfis')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(12,'admin/html/sistemas','lista de sistemas complementares que sao mostrados no catalogo')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(13,'admin/html/subirshapefile','upload de shapefile para uma pasta especifica no servidor')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(14,'admin/html/tags','edicao da lista controlada de tags')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoes VALUES(15,'admin/html/webservices','cadastro de links para webservices')");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(1,2)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(1,3)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(4,3)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(5,3)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(7,3)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(10,3)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(13,2)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(13,4)");
		$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_operacoespapeis VALUES(15,3)");
?>
</div>