<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../html/admin.css">
</head>
<body class="yui-skin-sam fundoPonto">
	<div class="bordaSuperior">&nbsp;</div>
	<div class="mascaraPrincipal" id="divGeral" style="text-align: left">
		Cria&ccedil;&atilde;o do banco de administra&ccedil;&atilde;o<br> <br>
		<?php
		/*
		 Title: criabanco.php

		Cria um novo banco de dados de administra&ccedil;&atilde;o.

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
		//echo __DIR__;
		include("admin.php");
		error_reporting(E_ALL);
		$tabelas = array(
				//tabelas gerais do sistema de administracao
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_grupos (desc_grupo TEXT, id_grupo INTEGER PRIMARY KEY, nome_grupo TEXT, it TEXT, es TEXT, en TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_sistemasf (abrir_funcao TEXT, h_funcao NUMERIC, id_funcao INTEGER PRIMARY KEY, id_sistema NUMERIC, nome_funcao TEXT, perfil_funcao TEXT, w_funcao NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_subgrupos (desc_subgrupo TEXT, id_subgrupo INTEGER PRIMARY KEY, nome_subgrupo TEXT, it TEXT, es TEXT, en TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_temas (id_tema INTEGER PRIMARY KEY, nacessos INTEGER, kml_tema TEXT, kmz_tema TEXT, ogc_tema TEXT, download_tema TEXT, tags_tema TEXT, tipoa_tema TEXT, link_tema TEXT, desc_tema TEXT, nome_tema TEXT, codigo_tema TEXT, it TEXT, es TEXT, en TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_ws (nacessos INTEGER, nacessosok INTEGER, autor_ws TEXT, desc_ws TEXT, id_ws INTEGER PRIMARY KEY, link_ws TEXT, nome_ws TEXT, tipo_ws TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_tags (id_tag INTEGER PRIMARY KEY, nome TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_perfis (id_perfil INTEGER PRIMARY KEY, perfil TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_atlasp (ordem_prancha NUMERIC, desc_prancha TEXT, h_prancha NUMERIC, icone_prancha TEXT, id_atlas NUMERIC, id_prancha INTEGER PRIMARY KEY, link_prancha TEXT, mapext_prancha TEXT, titulo_prancha TEXT, w_prancha NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_atlast (ordem_tema NUMERIC, codigo_tema TEXT, id_prancha TEXT, id_tema INTEGER PRIMARY KEY, ligado_tema TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_menus (publicado_menu TEXT, perfil_menu TEXT, aberto TEXT, desc_menu TEXT, id_menu INTEGER PRIMARY KEY, nome_menu TEXT, it TEXT, es TEXT, en TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_mapas (publicado_mapa TEXT, ordem_mapa NUMERIC, perfil_mapa TEXT, ligados_mapa TEXT, temas_mapa TEXT, desc_mapa TEXT, ext_mapa TEXT, id_mapa INTEGER PRIMARY KEY, imagem_mapa TEXT, linkdireto_mapa TEXT, nome_mapa TEXT, outros_mapa TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_atlas (publicado_atlas TEXT, ordem_atlas NUMERIC, basemapfile_atlas TEXT, desc_atlas TEXT, h_atlas NUMERIC, icone_atlas TEXT, id_atlas INTEGER PRIMARY KEY, link_atlas TEXT, pranchadefault_atlas TEXT, template_atlas TEXT, tipoguias_atlas TEXT, titulo_atlas TEXT, w_atlas NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_sistemas (publicado_sistema TEXT, id_sistema INTEGER PRIMARY KEY, nome_sistema TEXT, perfil_sistema TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_identifica (publicado_i TEXT, abrir_i TEXT, id_i INTEGER PRIMARY KEY, nome_i TEXT, target_i TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_raiz (ordem NUMERIC, id_tema NUMERIC, id_menu NUMERIC, id_nivel NUMERIC, id_raiz INTEGER PRIMARY KEY, nivel NUMERIC, perfil TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_n1 (publicado TEXT, ordem NUMERIC, id_menu NUMERIC, id_grupo NUMERIC, id_n1 INTEGER PRIMARY KEY, n1_perfil TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_n2 (publicado TEXT, ordem NUMERIC, id_n1 NUMERIC, id_n2 INTEGER PRIMARY KEY, id_subgrupo NUMERIC, n2_perfil TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_n3 (publicado TEXT, ordem NUMERIC, id_n2 NUMERIC, id_n3 INTEGER PRIMARY KEY, id_tema NUMERIC, n3_perfil TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_comentarios (comentario TEXT, data TEXT, openidnome TEXT, openidimagem TEXT, openidservico TEXT, openidusuario TEXT, openidurl TEXT, id_tema NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geoadmin_acessostema (codigo_tema TEXT, nacessos NUMERIC,dia NUMERIC, mes NUMERIC, ano NUMERIC)",
				//tabelas do sistema de controle de usuarios
				"CREATE TABLE ".$esquemaadmin."i3geousr_usuarios (ativo NUMERIC, data_cadastro TEXT, email TEXT, id_usuario INTEGER PRIMARY KEY, login TEXT, nome_usuario TEXT, senha TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_papelusuario (id_papel NUMERIC, id_usuario NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_papeis (descricao TEXT, id_papel INTEGER PRIMARY KEY, nome TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_operacoes (id_operacao INTEGER PRIMARY KEY, codigo TEXT, descricao TEXT)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_operacoespapeis (id_operacao NUMERIC, id_papel NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_grupousuario (id_usuario NUMERIC, id_grupo NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_grupotema (id_grupo NUMERIC, id_tema NUMERIC)",
				"CREATE TABLE ".$esquemaadmin."i3geousr_grupos (id_grupo INTEGER PRIMARY KEY, nome TEXT)",
				//tabelas do sistema metaestat
				"create table ".$esquemaadmin."i3geoestat_conexao (codigo_estat_conexao integer primary key,bancodedados text,host text,porta text,usuario text,senha text)",
				"create table ".$esquemaadmin."i3geoestat_tipo_regiao(codigo_tipo_regiao integer primary key,nome_tipo_regiao text,descricao_tipo_regiao text,codigo_estat_conexao integer,esquemadb text,tabela text,colunageo text,data text,identificador integer,colunanomeregiao text,srid text,colunacentroide text, colunasvisiveis text, apelidos text)",
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
				"create table ".$esquemaadmin."i3geoestat_parametro_medida(id_parametro_medida integer primary key,coluna text,nome text,descricao text,id_pai integer default 0,id_medida_variavel integer)",
				"create table ".$esquemaadmin."i3geoestat_mapa(id_mapa integer not null unique primary key autoincrement,titulo text,template text,logoesquerdo text,logodireito text,publicado integer)",
				"create table ".$esquemaadmin."i3geoestat_mapa_grupo(id_mapa_grupo integer not null unique primary key autoincrement,id_mapa integer,titulo text,foreign key (id_mapa) references i3geoestat_mapa (id_mapa))",
				"create table ".$esquemaadmin."i3geoestat_mapa_tema (id_mapa_tema integer not null unique primary key autoincrement,id_mapa_grupo integer,titulo text,id_medida_variavel integer,foreign key (id_mapa_grupo) references i3geoestat_mapa_grupo (id_mapa_grupo),foreign key (id_medida_variavel) references i3geoestat_medida_variavel (id_medida_variavel))"
		);
		//valida o usuario e aplica
		if($conexaoadmin == ""){
			if(empty($_POST["senha"]) || empty($_POST["usuario"])){
				criabancoformularioLoginMaster("criabanco.php");
				exit;
			}
			else{
				$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
				if($continua == false){
					echo "Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
					exit;
				}
			}
			if(file_exists("../../admin/admin.db"))	{
				echo "<br>Arquivo admin/admin.db ja existe. Vc deve apag&aacute;-lo para poder cri&aacute;-lo novamente caso precise";
			}
			else{
				if(function_exists("sqlite_open")){
					//cria o banco de dados de administracao
					$banco = sqlite_open("../../admin/admin.db",0666);
					$banco = null;
					$dbhw = new PDO('sqlite:../../admin/admin.db');
				}
				else{
					//TODO RC2 criar um arquivo sqlite vazio apenas com as tabelas
					echo "<br>A fun&ccedil;&atilde;o de cria&ccedil;&atilde;o do banco sqlite n&atilde;o existe no PHP. Vc pode usar o arquivo i3geo/admin/adminvazio.db e renome&aacute;-lo para admin.db.";
				}
			}
			if(file_exists("../../admin/metaestat.db"))	{
				echo "<br>Arquivo admin/metaestat.db ja existe. Vc deve apag&aacute;-lo para poder cri&aacute;-lo novamente caso precise";
			}
			else{
				//FIXME nao funciona
				//if(function_exists("SQLite3")){
				//cria o banco de dados de metadados estatisticos
				//$banco = new SQLite3("../../admin/metaestat.db",SQLITE3_OPEN_CREATE);
				//$banco->close();
				//}
				//else{
					//echo "<br>A fun&ccedil;&atilde;o de cria&ccedil;&atilde;o do banco sqlite3 n&atilde;o existe no PHP. N&atilde;o foi poss&iacute;vel criar o bando para o sistema de metadados.";
					//exit;
				//}
			}
		}
		else{
			include($conexaoadmin);
		}
		if(empty($dbhw)){
			echo "<br>Fim";exit;
		}
		foreach($tabelas as $tabela){
			if($dbhw->getAttribute(PDO::ATTR_DRIVER_NAME) == "pgsql"){
				$tabela = str_replace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$tabela);
			}
			//echo $tabela."<br>";
			$q = $dbhw->query($tabela);
		}
		//insercao de dados default
		if(!empty($banco)){
			//papeis
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem executar qualquer tarefa, inclusive cadastrar novos administradores',1,'admin')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem criar/editar qualquer tema (mapfile) mas nao podem editar a arvore do catalogo de temas',2,'editores')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem alterar a arvore do catalogo e dos atlas',3,'publicadores')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES('Podem editar dados geograficos',4,'editoresgeo')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papeis VALUES ('Podem administrar o sistema METAESTAT','5', 'adminmetaestat')");
			//usuarios - inclui apenas o admin
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_usuarios VALUES(1,'','',0,'admingeral','admingeral','admingeral')");
			//papel do usuario
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_papelusuario VALUES(1,1)");
			//operacoes controladas
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(1,'admin/html/editormapfile','editor de mapfiles do sistema de administracao')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(2,'admin/html/operacoes','abre o editor de operacoes')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(3,'teste/','teste')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(4,'admin/html/arvore','edicao da arvore do catalogo de temas')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(5,'admin/html/menus','edicao da lista de menus')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(6,'admin/html/ogcws','edicao das preferencias do servico WMS')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(7,'admin/html/atlas','edicao de atlas')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(8,'admin/html/identifica','lista de sistemas incluidos na ferramenta de identificacao')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(9,'admin/html/incluimap','adapta mapfiles antigos para versoes novas do Mapserver')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(10,'admin/html/mapas','lista de links para mapas')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(11,'admin/html/perfis','lista controlada de perfis')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(12,'admin/html/sistemas','lista de sistemas complementares que sao mostrados no catalogo')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(13,'admin/html/subirshapefile','upload de shapefile para uma pasta especifica no servidor')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(14,'admin/html/tags','edicao da lista controlada de tags')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES(15,'admin/html/webservices','cadastro de links para webservices')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES('16', 'admin/php/editortexto', 'editor de textos para edicao de mapfiles')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES('17', 'admin/html/usuarios', 'cadastro de usuarios')");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoes VALUES('18', 'admin/metaestat/geral', 'permite edicoes mais comuns do sistema de metadados estatisticos')");
			//papeis por operacao
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(1,2)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(1,3)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(4,3)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(5,3)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(7,3)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(10,3)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(13,2)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(13,4)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(15,3)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(16,2)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES(18,1)");
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geousr_operacoespapeis VALUES ('18', '5')");

			$banco = null;
			echo "Banco criado!!! administrador: admin / admin  - n&atilde;o esque&ccedil;a de alterar essa senha na op&ccedil;&atilde;o de edi&ccedil;&atilde;o do cadastro de usu&aacute;rios";
		}
		function criabancoformularioLoginMaster($action){
			echo "<form method=post action=$action >";
			echo "<br>Essa conex&atilde;o pode n&atilde;o ser segura e os dados de usu&aacute;rio/senha podem ser descobertos<br><br>";
			echo "Nome do usu&aacute;rio master cadastrado em ms_configura.php:<br> <input type=text name=usuario /><br>";
			echo "Senha:<br> <input type=password name=senha /><br>";
			echo "<input type=submit />";
		}

		?>
	</div>