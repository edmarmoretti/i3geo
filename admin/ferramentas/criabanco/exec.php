<?php
include "index.php";
?>
<div class="container">
	<div class="row center-block">
		<div class="col-sm-12">
			<div class="row">
				<div class="col-md-12">
					<div class="well">
						<?php
						$funcao = "";
						include ("../../../admin/php/funcoesAdmin.php");

						// valida o usuario e aplica
						$exts = get_loaded_extensions ();
						if (empty ( $_POST ["senha"] ) || empty ( $_POST ["usuario"] )) {
							exit ();
						} else {
							$continua = \admin\php\funcoesAdmin\verificaMaster ( $_POST ["usuario"], $_POST ["senha"], $i3geomaster );
							if ($continua === false) {
								echo "<div class='alert alert-warning'>Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster</div>";
								exit ();
							}
						}
						if($esquemaadmin != ""){
							$esquemaadmin = $esquemaadmin.".";
						}
						$tabelas = array (
								// tabelas gerais do sistema de administracao
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_grupos (desc_grupo TEXT, id_grupo INTEGER PRIMARY KEY, nome_grupo TEXT, it TEXT, es TEXT, en TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_sistemasf (abrir_funcao TEXT, h_funcao NUMERIC, id_funcao INTEGER PRIMARY KEY, id_sistema NUMERIC, nome_funcao TEXT, perfil_funcao TEXT, w_funcao NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_subgrupos (desc_subgrupo TEXT, id_subgrupo INTEGER PRIMARY KEY, nome_subgrupo TEXT, it TEXT, es TEXT, en TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_temas (id_tema INTEGER PRIMARY KEY, nacessos INTEGER, kml_tema TEXT, kmz_tema TEXT, ogc_tema TEXT, download_tema TEXT, tags_tema TEXT, tipoa_tema TEXT, link_tema TEXT, desc_tema TEXT, nome_tema TEXT, codigo_tema TEXT, it TEXT, es TEXT, en TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_ws (nacessos INTEGER, nacessosok INTEGER, autor_ws TEXT, desc_ws TEXT, id_ws INTEGER PRIMARY KEY, link_ws TEXT, nome_ws TEXT, tipo_ws TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_tags (id_tag INTEGER PRIMARY KEY, nome TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_perfis (id_perfil INTEGER PRIMARY KEY, perfil TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_atlasp (ordem_prancha NUMERIC, desc_prancha TEXT, h_prancha NUMERIC, icone_prancha TEXT, id_atlas NUMERIC, id_prancha INTEGER PRIMARY KEY, link_prancha TEXT, mapext_prancha TEXT, titulo_prancha TEXT, w_prancha NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_atlast (ordem_tema NUMERIC, codigo_tema TEXT, id_prancha TEXT, id_tema INTEGER PRIMARY KEY, ligado_tema TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_menus (publicado_menu TEXT, perfil_menu TEXT, aberto TEXT, desc_menu TEXT, id_menu INTEGER PRIMARY KEY, nome_menu TEXT, it TEXT, es TEXT, en TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_mapas (publicado_mapa TEXT, ordem_mapa NUMERIC, perfil_mapa TEXT, ligados_mapa TEXT, temas_mapa TEXT, desc_mapa TEXT, ext_mapa TEXT, id_mapa INTEGER PRIMARY KEY, imagem_mapa TEXT, linkdireto_mapa TEXT, nome_mapa TEXT, outros_mapa TEXT, mapfile TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_atlas (publicado_atlas TEXT, ordem_atlas NUMERIC, basemapfile_atlas TEXT, desc_atlas TEXT, h_atlas NUMERIC, icone_atlas TEXT, id_atlas INTEGER PRIMARY KEY, link_atlas TEXT, pranchadefault_atlas TEXT, template_atlas TEXT, tipoguias_atlas TEXT, titulo_atlas TEXT, w_atlas NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_sistemas (publicado_sistema TEXT, id_sistema INTEGER PRIMARY KEY, nome_sistema TEXT, perfil_sistema TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_identifica (publicado_i TEXT, abrir_i TEXT, id_i INTEGER PRIMARY KEY, nome_i TEXT, target_i TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_raiz (ordem NUMERIC, id_tema NUMERIC, id_menu NUMERIC, id_nivel NUMERIC, id_raiz INTEGER PRIMARY KEY, nivel NUMERIC, perfil TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_n1 (publicado TEXT, ordem NUMERIC, id_menu NUMERIC, id_grupo NUMERIC, id_n1 INTEGER PRIMARY KEY, n1_perfil TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_n2 (publicado TEXT, ordem NUMERIC, id_n1 NUMERIC, id_n2 INTEGER PRIMARY KEY, id_subgrupo NUMERIC, n2_perfil TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_n3 (publicado TEXT, ordem NUMERIC, id_n2 NUMERIC, id_n3 INTEGER PRIMARY KEY, id_tema NUMERIC, n3_perfil TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_comentarios (comentario TEXT, data TEXT, openidnome TEXT, openidimagem TEXT, openidservico TEXT, openidusuario TEXT, openidurl TEXT, id_tema NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_acessostema (codigo_tema TEXT, nacessos NUMERIC,dia NUMERIC, mes NUMERIC, ano NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geoadmin_log (id_log INTEGER PRIMARY KEY,sql TEXT,serializedata TEXT,usuario TEXT,ip TEXT,timestamp TEXT,outros TEXT)",
								// tabelas do sistema de controle de usuarios
								"CREATE TABLE " . $esquemaadmin . "i3geousr_usuarios (ativo NUMERIC, data_cadastro TEXT, email TEXT, id_usuario INTEGER PRIMARY KEY, login TEXT, nome_usuario TEXT, senha TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_papelusuario (id_papel NUMERIC, id_usuario NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_papeis (descricao TEXT, id_papel INTEGER PRIMARY KEY, nome TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_operacoes (id_operacao INTEGER PRIMARY KEY, codigo TEXT, descricao TEXT)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_operacoespapeis (id_operacao NUMERIC, id_papel NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_grupousuario (id_usuario NUMERIC, id_grupo NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_grupotema (id_grupo NUMERIC, id_tema NUMERIC)",
								"CREATE TABLE " . $esquemaadmin . "i3geousr_grupos (id_grupo INTEGER PRIMARY KEY, nome TEXT, descricao TEXT)",
								// tabelas do sistema metaestat
								"create table " . $esquemaadmin . "i3geoestat_conexao (codigo_estat_conexao INTEGER PRIMARY KEY,bancodedados text,host text,porta text,usuario text,senha text)",
								"create table " . $esquemaadmin . "i3geoestat_tipo_regiao(codigo_tipo_regiao INTEGER PRIMARY KEY,nome_tipo_regiao text,descricao_tipo_regiao text,codigo_estat_conexao integer,esquemadb text,tabela text,colunageo text,data text,identificador text,colunanomeregiao text,srid text,colunacentroide text, colunasvisiveis text, apelidos text)",
								"create table " . $esquemaadmin . "i3geoestat_agregaregiao(id_agregaregiao INTEGER PRIMARY KEY,codigo_tipo_regiao integer,codigo_tipo_regiao_pai integer,colunaligacao_regiaopai text)",
								"create table " . $esquemaadmin . "i3geoestat_tipo_periodo(codigo_tipo_periodo INTEGER PRIMARY KEY,nome text,descricao text)",
								"create table " . $esquemaadmin . "i3geoestat_unidade_medida(codigo_unidade_medida INTEGER PRIMARY KEY,nome text,sigla text,permitesoma integer default 0,permitemedia integer default 0)",
								"create table " . $esquemaadmin . "i3geoestat_variavel(codigo_variavel INTEGER PRIMARY KEY,nome text,descricao text)",
								"create table " . $esquemaadmin . "i3geoestat_medida_variavel(id_medida_variavel INTEGER PRIMARY KEY,codigo_unidade_medida integer,codigo_tipo_periodo integer,codigo_variavel integer,codigo_tipo_regiao integer,codigo_estat_conexao integer,esquemadb text,tabela text,colunavalor text,colunaidgeo text,filtro text,nomemedida text,colunaidunico text)",
								"create table " . $esquemaadmin . "i3geoestat_classificacao(id_classificacao INTEGER PRIMARY KEY,nome text,id_medida_variavel integer,observacao text)",
								"create table " . $esquemaadmin . "i3geoestat_classes(id_classe INTEGER PRIMARY KEY,expressao text,titulo text,vermelho text,verde text,azul text,id_classificacao integer,tamanho text,simbolo text,overmelho text,overde text,oazul text,otamanho text)",
								"create table " . $esquemaadmin . "i3geoestat_fonteinfo(id_fonteinfo INTEGER PRIMARY KEY,titulo text unique,link text)",
								"create table " . $esquemaadmin . "i3geoestat_fonteinfo_medida(id_medida_variavel integer not null,id_fonteinfo integer not null)",
								"create table " . $esquemaadmin . "i3geoestat_medida_variavel_link(link text,id_medida_variavel integer,nome text,id_link INTEGER PRIMARY KEY)",
								"create table " . $esquemaadmin . "i3geoestat_parametro_medida(id_parametro_medida INTEGER PRIMARY KEY,coluna text,nome text,descricao text,id_pai integer default 0,id_medida_variavel integer, tipo integer default 0)",
								"create table " . $esquemaadmin . "i3geoestat_mapa(id_mapa INTEGER PRIMARY KEY,titulo text,template text,logoesquerdo text,logodireito text,publicado integer)",
								"create table " . $esquemaadmin . "i3geoestat_mapa_grupo(id_mapa_grupo INTEGER PRIMARY KEY,id_mapa integer,titulo text)",
								"create table " . $esquemaadmin . "i3geoestat_mapa_tema (id_mapa_tema INTEGER PRIMARY KEY,id_mapa_grupo integer,titulo text,id_medida_variavel integer)"
						);

						if ($conexaoadmin == "") {
							if ($_POST ["mostraSoSQL"] != "on") {
								if (file_exists ( "../../../admin/admin.db" )) {
									echo "<div class='alert alert-warning'>Arquivo admin/admin.db ja existe. Vc deve apag&aacute;-lo para poder cri&aacute;-lo novamente caso precise</div>";
								} else {
									// TODO verificar ao fechar \admin\php\funcoesAdmin\versao - caso tenha havido alteracoes no banco, gerar banco vazio
									copy ( "../../../admin/admin_vazio.db", "../../../admin/admin.db" );
									chmod ( "../../../admin/admin.db", 0777 );
									if (file_exists ( "../../../admin/admin.db" )) {
										echo "Banco copiado ../../../admin/admin.db !!!";
										$dbhw = new PDO ( 'sqlite:../../../admin/admin.db' );
									} else {
										echo "erro";
									}
								}
							} else {
								$dbhw = new PDO ( 'sqlite:../../../admin/admin.db' );
							}
						} else {
							include ($conexaoadmin);
						}
						if (empty ( $dbhw )) {
							echo "<div class='alert alert-warning'>Conexao com o banco n&atilde;o pode ser estabelecida</div>";
							exit ();
						}
						$drivename = $dbhw->getAttribute ( PDO::ATTR_DRIVER_NAME );
						if ($_POST ["mostraSoSQL"] != "on") {
							foreach ( $tabelas as $tabela ) {
								if ($drivename == "pgsql") {
									$tabela = str_replace ( "INTEGER PRIMARY KEY", "SERIAL PRIMARY KEY NOT NULL", $tabela );
								}
								$q = $dbhw->query ( $tabela );
							}
						}
						echo "<h4>Tabelas</h4>";
						foreach ( $tabelas as $tabela ) {
							if ($drivename == "pgsql") {
								$tabela = str_replace ( "INTEGER PRIMARY KEY", "SERIAL PRIMARY KEY NOT NULL", $tabela );
							}
							echo "<p>" . $tabela . ";</p>";
						}
						echo "<h4>Inserindo os registros default<h4>";
						if ($_POST ["mostraSoSQL"] != "on") {
							$teste = listaSql ( "select * from " . $esquemaadmin . "i3geousr_papeis", "id_papel" );
						} else {
							$teste = array ();
						}
						$sql = array ();

						if (! in_array ( 1, $teste ) || $_POST ["mostraSoSQL"] == "on") {
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_papeis VALUES('Podem executar qualquer tarefa, inclusive cadastrar novos administradores',1,'admin')";
						}
						if (! in_array ( 2, $teste ) || $_POST ["mostraSoSQL"] == "on") {
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_papeis VALUES('Podem criar/editar qualquer tema (mapfile) mas nao podem editar a arvore do catalogo de temas',2,'editores')";
						}
						if (! in_array ( 3, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_papeis VALUES('Podem alterar a arvore do catalogo e dos atlas',3,'publicadores')";
						if (! in_array ( 4, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_papeis VALUES('Podem editar dados geograficos',4,'editoresgeo')";
						if (! in_array ( 5, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_papeis VALUES ('Podem administrar o sistema METAESTAT','5', 'adminmetaestat')";

						if ($_POST ["mostraSoSQL"] != "on") {
							$teste = listaSql ( "select * from " . $esquemaadmin . "i3geousr_usuarios", "id_usuario" );
						} else {
							$teste = array ();
						}

						if (! in_array ( 1, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_usuarios VALUES(1,'','',0,'admingeral','admingeral','admingeral')";

						if ($_POST ["mostraSoSQL"] != "on") {
							$teste = listaSql ( "select * from " . $esquemaadmin . "i3geousr_papelusuario", "id_usuario", "id_papel" );
						} else {
							$teste = array ();
						}
						if (! in_array ( "1-1", $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_papelusuario VALUES(1,1)";

						if ($_POST ["mostraSoSQL"] != "on") {
							$teste = listaSql ( "select * from " . $esquemaadmin . "i3geousr_operacoes", "id_operacao" );
						} else {
							$teste = array ();
						}
						if (! in_array ( 1, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(1,'admin/html/editormapfile','editor de mapfiles do sistema de administracao')";
						if (! in_array ( 2, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(2,'admin/html/operacoes','abre o editor de operacoes')";
						if (! in_array ( 3, $teste ))
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(3,'teste/','teste')";
						if (! in_array ( 4, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(4,'admin/html/arvore','edicao da arvore do catalogo de temas')";
						if (! in_array ( 5, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(5,'admin/html/menus','edicao da lista de menus')";
						if (! in_array ( 6, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(6,'admin/html/ogcws','edicao das preferencias do servico WMS')";
						if (! in_array ( 7, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(7,'admin/html/atlas','edicao de atlas')";
						if (! in_array ( 8, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(8,'admin/html/identifica','lista de sistemas incluidos na ferramenta de identificacao')";
						if (! in_array ( 9, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(9,'admin/html/incluimap','adapta mapfiles antigos para versoes novas do Mapserver')";
						if (! in_array ( 10, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(10,'admin/html/mapas','lista de links para mapas')";
						if (! in_array ( 11, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(11,'admin/html/perfis','lista controlada de perfis')";
						if (! in_array ( 12, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(12,'admin/html/sistemas','lista de sistemas complementares que sao mostrados no catalogo')";
						if (! in_array ( 13, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(13,'admin/html/subirshapefile','upload de shapefile para uma pasta especifica no servidor')";
						if (! in_array ( 14, $teste ))
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(14,'admin/html/tags','edicao da lista controlada de tags')";
						if (! in_array ( 15, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(15,'admin/html/webservices','cadastro de links para webservices')";
						if (! in_array ( 16, $teste ))
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES(16,'admin/php/editortexto','editor de texto para mapfiles')";
						if (! in_array ( 17, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES('17', 'admin/html/usuarios', 'cadastro de usuarios')";
						if (! in_array ( 18, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES('18', 'admin/metaestat/geral', 'permite edicoes mais comuns do sistema de metadados estatisticos')";
						if (! in_array ( 19, $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoes VALUES('19', 'admin/metaestat/editorbanco', 'permite gerenciar as tabelas do banco')";

						if ($_POST ["mostraSoSQL"] != "on") {
							$teste = listaSql ( "select * from " . $esquemaadmin . "i3geousr_operacoespapeis", "id_operacao", "id_papel" );
						} else {
							$teste = array ();
						}
						if (! in_array ( '1-2', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(1,2)";
						if (! in_array ( '1-3', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(1,3)";
						if (! in_array ( '4-3', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(4,3)";
						if (! in_array ( '5-3', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(5,3)";
						if (! in_array ( '7-3', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(7,3)";
						if (! in_array ( '10-3', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(10,3)";
						if (! in_array ( '13-2', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(13,2)";
						if (! in_array ( '13-4', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(13,4)";
						if (! in_array ( '15-3', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(15,3)";
						if (! in_array ( '16-2', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(16,2)";
						if (! in_array ( '18-1', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES(18,1)";
						if (! in_array ( '18-5', $teste ) || $_POST ["mostraSoSQL"] == "on")
							$sql [] = "INSERT INTO " . $esquemaadmin . "i3geousr_operacoespapeis VALUES (18,5)";

						$sql [] = "INSERT INTO " . $esquemaadmin . "i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('1', 'Anual', '')";
						$sql [] = "INSERT INTO " . $esquemaadmin . "i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('2', 'Mensal', '')";
						$sql [] = "INSERT INTO " . $esquemaadmin . "i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('3', 'Diário', '')";
						$sql [] = "INSERT INTO " . $esquemaadmin . "i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('4', 'Horário', '')";

						echo "<h4>Inserts:</h4>";
						foreach ( $sql as $s ) {
							if ($_POST ["mostraSoSQL"] != "on") {
								$dbhw->query ( $s );
							}
							echo "<p>" . $s . ";<p>";
						}
						?>
					</div>
					<div class='alert alert-success'>Feito!</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
<?php
function listaSql($sql, $coluna, $coluna1 = "") {
	global $dbh;
	$lista = array ();
	$q = $dbh->query ( $sql, PDO::FETCH_ASSOC );
	if ($q) {
		$resultado = $q->fetchAll ();
		foreach ( $resultado as $r ) {
			if ($coluna1 == "")
				$lista [] = $r [$coluna];
			else
				$lista [] = $r [$coluna] . "-" . $r [$coluna1];
		}
	}
	return $lista;
}
?>
