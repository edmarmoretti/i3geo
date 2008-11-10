<?php
$funcao = "";
include_once("admin.php");
if(file_exists("../../menutemas/admin.db"))
{echo "Arquivo menutemas/admin.db ja existe";exit;}
$banco = sqlite_open("../../menutemas/admin.db",0666);
$banco = null;
$dbh = new PDO('sqlite:../../menutemas/admin.db');
$tabelas = array(
"CREATE TABLE i3geoadmin_grupos (desc_grupo TEXT, id_grupo INTEGER PRIMARY KEY, nome_grupo TEXT)",
"CREATE TABLE i3geoadmin_sistemasf (abrir_funcao TEXT, h_funcao NUMERIC, id_funcao INTEGER PRIMARY KEY, id_sistema NUMERIC, nome_funcao TEXT, perfil_funcao TEXT, w_funcao NUMERIC)",
"CREATE TABLE i3geoadmin_subgrupos (desc_subgrupo TEXT, id_subgrupo INTEGER PRIMARY KEY, nome_subgrupo TEXT)",
"CREATE TABLE i3geoadmin_temas (id_tema INTEGER PRIMARY KEY, kml_tema , ogc_tema , download_tema , tags_tema , tipoa_tema , link_tema , desc_tema , nome_tema , codigo_tema )",
"CREATE TABLE i3geoadmin_ws (autor_ws TEXT, desc_ws TEXT, id_ws INTEGER PRIMARY KEY, link_ws TEXT, nome_ws TEXT, tipo_ws TEXT)",
"CREATE TABLE i3geoadmin_tags (id_tag INTEGER PRIMARY KEY, nome TEXT)",
"CREATE TABLE i3geoadmin_perfis (id_perfil INTEGER PRIMARY KEY, perfil TEXT)",
"CREATE TABLE i3geoadmin_atlasp (ordem_prancha NUMERIC, desc_prancha TEXT, h_prancha NUMERIC, icone_prancha TEXT, id_atlas NUMERIC, id_prancha INTEGER PRIMARY KEY, link_prancha TEXT, mapext_prancha TEXT, titulo_prancha TEXT, w_prancha NUMERIC)",
"CREATE TABLE i3geoadmin_atlast (ordem_tema NUMERIC, codigo_tema TEXT, id_prancha TEXT, id_tema INTEGER PRIMARY KEY, ligado_tema TEXT)",
"CREATE TABLE i3geoadmin_menus (publicado_menu TEXT, perfil_menu TEXT, aberto TEXT, desc_menu TEXT, id_menu INTEGER PRIMARY KEY, nome_menu TEXT)",
"CREATE TABLE i3geoadmin_mapas (publicado_mapa TEXT, ordem_mapa NUMERIC, perfil_mapa TEXT, ligados_mapa TEXT, temas_mapa TEXT, desc_mapa TEXT, ext_mapa TEXT, id_mapa INTEGER PRIMARY KEY, imagem_mapa TEXT, linkdireto_mapa TEXT, nome_mapa TEXT, outros_mapa TEXT)",
"CREATE TABLE i3geoadmin_atlas (publicado_atlas TEXT, ordem_atlas NUMERIC, basemapfile_atlas TEXT, desc_atlas TEXT, h_atlas NUMERIC, icone_atlas TEXT, id_atlas INTEGER PRIMARY KEY, link_atlas TEXT, pranchadefault_atlas TEXT, template_atlas TEXT, tipoguias_atlas TEXT, titulo_atlas TEXT, w_atlas NUMERIC)",
"CREATE TABLE i3geoadmin_sistemas (publicado_sistema TEXT, id_sistema INTEGER PRIMARY KEY, nome_sistema TEXT, perfil_sistema TEXT)",
"CREATE TABLE i3geoadmin_identifica (publicado_i TEXT, abrir_i TEXT, id_i INTEGER PRIMARY KEY, nome_i TEXT, target_i TEXT)",
"CREATE TABLE i3geoadmin_raiz (ordem NUMERIC, id_tema NUMERIC, id_menu NUMERIC, id_nivel NUMERIC, id_raiz INTEGER PRIMARY KEY, nivel NUMERIC, perfil TEXT)",
"CREATE TABLE i3geoadmin_n1 (publicado TEXT, ordem NUMERIC, id_menu NUMERIC, id_grupo NUMERIC, id_n1 INTEGER PRIMARY KEY, n1_perfil TEXT)",
"CREATE TABLE i3geoadmin_n2 (publicado TEXT, ordem NUMERIC, id_n1 NUMERIC, id_n2 INTEGER PRIMARY KEY, id_subgrupo NUMERIC, n2_perfil TEXT)",
"CREATE TABLE i3geoadmin_n3 (publicado TEXT, ordem NUMERIC, id_n2 NUMERIC, id_n3 INTEGER PRIMARY KEY, id_tema NUMERIC, n3_perfil TEXT)"
);
foreach($tabelas as $tabela)
{
	$q = $dbh->query($tabela);
}
$banco = null;
?>