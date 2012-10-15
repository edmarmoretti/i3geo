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

Ver MER i3geo/documentacao/diagramas/cadastrodeusuarios.erm

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
/**
 *
 * TODO verificar se as tabelas estão ok para o novo sistema de admin de usuarios
 */

/**
 * TODO incluir a base de dados de testes no erm
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
				"CREATE TABLE ".$esquemaadmin."i3geousr_usuarios (ativo NUMERIC, data_cadastro TEXT, email TEXT, id_usuario INTEGER PRIMARY KEY, login TEXT, nome_usuario TEXT, senha TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_papelusuario (id_papel NUMERIC, id_usuario NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_papeis (descricao TEXT, id_papel INTEGER PRIMARY KEY, nome TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_operacoes (id_operacao INTEGER PRIMARY KEY, codigo TEXT, descricao TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_operacoespapeis (id_operacao NUMERIC, id_papel NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_grupousuario (id_usuario NUMERIC, id_grupo NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_grupotema (id_grupo NUMERIC, id_tema NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_grupos (id_grupo INTEGER PRIMARY KEY, nome TEXT)",
				"create table ".$esquemaadmin."i3geoestat_conexao (codigo_estat_conexao integer primary key,bancodedados text,host text,porta text,usuario text,senha text)",
				"create table ".$esquemaadmin."i3geoestat_tipo_regiao(codigo_tipo_regiao integer primary key,nome_tipo_regiao text,descricao_tipo_regiao text,codigo_estat_conexao integer,esquemadb text,tabela text,colunageo text,data text,identificador integer,colunanomeregiao text,srid text,colunacentroide text)",
				"create table ".$esquemaadmin."i3geoestat_agregaregiao(id_agregaregiao integer primary key,codigo_tipo_regiao integer,codigo_tipo_regiao_pai integer,colunaligacao_regiaopai text)",
				"create table ".$esquemaadmin."i3geoestat_tipo_periodo(codigo_tipo_periodo integer primary key,nome text,descricao text)",
				"create table ".$esquemaadmin."i3geoestat_unidade_medida(codigo_unidade_medida integer primary key,nome text,sigla text,permitesoma integer default 0,permitemedia integer default 0)",
				"create table ".$esquemaadmin."i3geoestat_variavel(codigo_variavel integer primary key,nome text,descricao text)",
				"create table ".$esquemaadmin."i3geoestat_medida_variavel(id_medida_variavel integer primary key,codigo_unidade_medida integer,codigo_tipo_periodo integer,codigo_variavel integer,codigo_tipo_regiao integer,codigo_estat_conexao integer,esquemadb text,tabela text,colunavalor text,colunaidgeo text,filtro text,nomemedida text,colunaidunico text)",
				"create table ".$esquemaadmin."i3geoestat_classificacao(id_classificacao integer primary key,nome text,id_medida_variavel integer,observacao text)",
				"create table ".$esquemaadmin."i3geoestat_classes(id_classe integer primary key,expressao text,titulo text,vermelho text,verde text,azul text,id_classificacao integer,tamanho text,simbolo text,overmelho text,overde text,oazul text,otamanho text)",
				"create table ".$esquemaadmin."i3geoestat_fonteinfo(id_fonteinfo integer primary key,titulo text unique,link text)",
				"create table ".$esquemaadmin."i3geoestat_fonteinfo_medida(id_medida_variavel integer not null,id_fonteinfo integer not null)",
				"create table ".$esquemaadmin."i3geoestat_medida_variavel_link(link text,id_medida_variavel integer,nome text,id_link integer primary key)",
				"create table ".$esquemaadmin."i3geoestat_parametro_medida(id_parametro_medida integer primary key,coluna text,nome text,descricao text,id_pai integer default 0,id_medida_variavel integer)"
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
		echo "<pre>Ocorreu algum problema na criação das tabelas. Tabelas que deveriam ter sido criadas:\n";

		//$e = $dbhw->errorInfo();
		//throw new Exception($e[2]);
   	}
}
echo "Tabelas:\n";
var_dump($tabelas);
echo "Inserindo os registros default\n";
$teste = lista("select * from ".$esquemaadmin."i3geousr_papeis","id_papel");
if(!in_array($teste,1))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem executar qualquer tarefa, inclusive cadastrar novos administradores',1,'admin')");
if(!in_array($teste,2))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem criar/editar qualquer tema (mapfile) mas nao podem editar a arvore do catalogo de temas',2,'editores')");
if(!in_array($teste,3))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem alterar a arvore do catalogo e dos atlas',3,'publicadores')");
if(!in_array($teste,4))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem editar dados geograficos',4,'editoresgeo')");

$teste = lista("select * from ".$esquemaadmin."i3geousr_usuarios","id_usuario");
if(!in_array($teste,1))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_usuarios VALUES(1,'','',1,'admin','admin','admin')");

$teste = lista("select * from ".$esquemaadmin."i3geousr_papelusuario","id_usuario","id_papel");
if(!in_array($teste,"1-1"))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papelusuario VALUES(1,1)");

$teste = lista("select * from ".$esquemaadmin."i3geousr_operacoes","id_operacao");
if(!in_array($teste,1))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(1,'admin/html/editormapfile','editor de mapfiles do sistema de administracao')");
if(!in_array($teste,2))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(2,'admin/html/operacoes','abre o editor de operacoes')");
if(!in_array($teste,3))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(3,'teste/','teste')");
if(!in_array($teste,4))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(4,'admin/html/arvore','edicao da arvore do catalogo de temas')");
if(!in_array($teste,5))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(5,'admin/html/menus','edicao da lista de menus')");
if(!in_array($teste,6))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(6,'admin/html/ogcws','edicao das preferencias do servico WMS')");
if(!in_array($teste,7))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(7,'admin/html/atlas','edicao de atlas')");
if(!in_array($teste,8))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(8,'admin/html/identifica','lista de sistemas incluidos na ferramenta de identificacao')");
if(!in_array($teste,9))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(9,'admin/html/incluimap','adapta mapfiles antigos para versoes novas do Mapserver')");
if(!in_array($teste,10))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(10,'admin/html/mapas','lista de links para mapas')");
if(!in_array($teste,11))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(11,'admin/html/perfis','lista controlada de perfis')");
if(!in_array($teste,12))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(12,'admin/html/sistemas','lista de sistemas complementares que sao mostrados no catalogo')");
if(!in_array($teste,13))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(13,'admin/html/subirshapefile','upload de shapefile para uma pasta especifica no servidor')");
if(!in_array($teste,14))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(14,'admin/html/tags','edicao da lista controlada de tags')");
if(!in_array($teste,15))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(15,'admin/html/webservices','cadastro de links para webservices')");
if(!in_array($teste,16))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(16,'admin/php/editortexto','editor de texto para mapfiles')");
if(!in_array($teste,17))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES('17', 'admin/html/usuarios', 'cadastro de usuarios')");


$teste = lista("select * from ".$esquemaadmin."i3geousr_operacoes","id_operacao","id_papel");
if(!in_array($teste,'1-2'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(1,2)");
if(!in_array($teste,'1-3'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(1,3)");
if(!in_array($teste,'4-3'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(4,3)");
if(!in_array($teste,'5-3'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(5,3)");
if(!in_array($teste,'7-3'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(7,3)");
if(!in_array($teste,'10-3'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(10,3)");
if(!in_array($teste,'13-2'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(13,2)");
if(!in_array($teste,'13-4'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(13,4)");
if(!in_array($teste,'15-3'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(15,3)");
if(!in_array($teste,'16-2'))
	$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(16,2)");
//cria o banco de dados de metadados estatisticos
if(file_exists("../../admin/metaestat.db"))	{
	echo "<br>Arquivo admin/metaestat.db ja existe. Vc deve apag&aacute;-lo para poder cri&aacute;-lo novamente caso precise";
}
else{
	$banco = sqlite_open("../../admin/metaestat.db",0666);
	$banco = null;
}
echo "<br>Feito!";
function lista($sql,$coluna,$coluna1=""){
	global $dbh;
	$lista = array();
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	if($q)
	{
		$resultado = $q->fetchAll();
		foreach($resultado as $r){
			if($coluna1 == "")
				$lista[] = $r[$coluna];
			else
				$lista[] = $r[$coluna]."-".$r[$coluna1];
		}
	}
	return $lista;
}
?>
</div>