<?php
/*
Title: criabanco.php

Cria um novo banco de dados de administração.

Se vc quiser recriar o banco de dados default, apague o arquivo
i3geo/admin/admin.db ou faça uma cópia. Depois é só executar esse programa.

Se a configuração do arquivo de conexão foi alterada (veja ms_configura.php), o novo
banco irá ser criado conforme a nova string de conexão.

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/criabanco.php
*/
$funcao = "";
include_once("admin.php");
error_reporting(E_ALL);
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}

$tabelas = array(
"CREATE TABLE i3geoadmin_grupos (desc_grupo TEXT, id_grupo INTEGER PRIMARY KEY, nome_grupo TEXT, it TEXT, es TEXT, en TEXT)",
"CREATE TABLE i3geoadmin_sistemasf (abrir_funcao TEXT, h_funcao NUMERIC, id_funcao INTEGER PRIMARY KEY, id_sistema NUMERIC, nome_funcao TEXT, perfil_funcao TEXT, w_funcao NUMERIC)",
"CREATE TABLE i3geoadmin_subgrupos (desc_subgrupo TEXT, id_subgrupo INTEGER PRIMARY KEY, nome_subgrupo TEXT, it TEXT, es TEXT, en TEXT)",
"CREATE TABLE i3geoadmin_temas (id_tema INTEGER PRIMARY KEY, nacessos INTEGER, kml_tema TEXT, kmz_tema TEXT, ogc_tema TEXT, download_tema TEXT, tags_tema TEXT, tipoa_tema TEXT, link_tema TEXT, desc_tema TEXT, nome_tema TEXT, codigo_tema TEXT, it TEXT, es TEXT, en TEXT)",
"CREATE TABLE i3geoadmin_ws (nacessos INTEGER, nacessosok INTEGER, autor_ws TEXT, desc_ws TEXT, id_ws INTEGER PRIMARY KEY, link_ws TEXT, nome_ws TEXT, tipo_ws TEXT)",
"CREATE TABLE i3geoadmin_tags (id_tag INTEGER PRIMARY KEY, nome TEXT)",
"CREATE TABLE i3geoadmin_perfis (id_perfil INTEGER PRIMARY KEY, perfil TEXT)",
"CREATE TABLE i3geoadmin_atlasp (ordem_prancha NUMERIC, desc_prancha TEXT, h_prancha NUMERIC, icone_prancha TEXT, id_atlas NUMERIC, id_prancha INTEGER PRIMARY KEY, link_prancha TEXT, mapext_prancha TEXT, titulo_prancha TEXT, w_prancha NUMERIC)",
"CREATE TABLE i3geoadmin_atlast (ordem_tema NUMERIC, codigo_tema TEXT, id_prancha TEXT, id_tema INTEGER PRIMARY KEY, ligado_tema TEXT)",
"CREATE TABLE i3geoadmin_menus (publicado_menu TEXT, perfil_menu TEXT, aberto TEXT, desc_menu TEXT, id_menu INTEGER PRIMARY KEY, nome_menu TEXT, it TEXT, es TEXT, en TEXT)",
"CREATE TABLE i3geoadmin_mapas (publicado_mapa TEXT, ordem_mapa NUMERIC, perfil_mapa TEXT, ligados_mapa TEXT, temas_mapa TEXT, desc_mapa TEXT, ext_mapa TEXT, id_mapa INTEGER PRIMARY KEY, imagem_mapa TEXT, linkdireto_mapa TEXT, nome_mapa TEXT, outros_mapa TEXT)",
"CREATE TABLE i3geoadmin_atlas (publicado_atlas TEXT, ordem_atlas NUMERIC, basemapfile_atlas TEXT, desc_atlas TEXT, h_atlas NUMERIC, icone_atlas TEXT, id_atlas INTEGER PRIMARY KEY, link_atlas TEXT, pranchadefault_atlas TEXT, template_atlas TEXT, tipoguias_atlas TEXT, titulo_atlas TEXT, w_atlas NUMERIC)",
"CREATE TABLE i3geoadmin_sistemas (publicado_sistema TEXT, id_sistema INTEGER PRIMARY KEY, nome_sistema TEXT, perfil_sistema TEXT)",
"CREATE TABLE i3geoadmin_identifica (publicado_i TEXT, abrir_i TEXT, id_i INTEGER PRIMARY KEY, nome_i TEXT, target_i TEXT)",
"CREATE TABLE i3geoadmin_raiz (ordem NUMERIC, id_tema NUMERIC, id_menu NUMERIC, id_nivel NUMERIC, id_raiz INTEGER PRIMARY KEY, nivel NUMERIC, perfil TEXT)",
"CREATE TABLE i3geoadmin_n1 (publicado TEXT, ordem NUMERIC, id_menu NUMERIC, id_grupo NUMERIC, id_n1 INTEGER PRIMARY KEY, n1_perfil TEXT)",
"CREATE TABLE i3geoadmin_n2 (publicado TEXT, ordem NUMERIC, id_n1 NUMERIC, id_n2 INTEGER PRIMARY KEY, id_subgrupo NUMERIC, n2_perfil TEXT)",
"CREATE TABLE i3geoadmin_n3 (publicado TEXT, ordem NUMERIC, id_n2 NUMERIC, id_n3 INTEGER PRIMARY KEY, id_tema NUMERIC, n3_perfil TEXT)",
"CREATE TABLE i3geoadmin_comentarios (comentario TEXT, data TEXT, openidnome TEXT, openidimagem TEXT, openidservico TEXT, openidusuario TEXT, openidurl TEXT, id_tema NUMERIC)"

);
if($conexaoadmin == "")
{
	if(file_exists("../../admin/admin.db"))
	{echo "Arquivo admin/admin.db ja existe";exit;}
	$banco = sqlite_open("../../admin/admin.db",0666);
	$banco = null;
	$dbhw = new PDO('sqlite:../../admin/admin.db');
}
else
{
	include($conexaoadmin);	
}
foreach($tabelas as $tabela)
{
	if($dbhw->getAttribute(PDO::ATTR_DRIVER_NAME) == "pgsql")
	{
		$tabela = str_replace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$tabela);
	}
	//echo $tabela."<br>";
	$q = $dbhw->query($tabela);
	/*
GRANT SELECT ON TABLE i3geoadmin_atlas TO geodados;
GRANT SELECT ON TABLE i3geoadmin_atlasp TO geodados;
GRANT SELECT ON TABLE i3geoadmin_atlast TO geodados;
GRANT SELECT ON TABLE i3geoadmin_grupos TO geodados;
GRANT SELECT ON TABLE i3geoadmin_identifica TO geodados;
GRANT SELECT ON TABLE i3geoadmin_mapas TO geodados;
GRANT SELECT ON TABLE i3geoadmin_menus TO geodados;
GRANT SELECT ON TABLE i3geoadmin_n1 TO geodados;
GRANT SELECT ON TABLE i3geoadmin_n2 TO geodados;
GRANT SELECT ON TABLE i3geoadmin_n3 TO geodados;
GRANT SELECT ON TABLE i3geoadmin_perfis TO geodados;
GRANT SELECT ON TABLE i3geoadmin_raiz TO geodados;
GRANT SELECT ON TABLE i3geoadmin_sistemas TO geodados;
GRANT SELECT ON TABLE i3geoadmin_sistemasf TO geodados;
GRANT SELECT ON TABLE i3geoadmin_subgrupos TO geodados;
GRANT SELECT ON TABLE i3geoadmin_atlas TO geodados;
GRANT SELECT ON TABLE i3geoadmin_tags TO geodados;
GRANT SELECT ON TABLE i3geoadmin_temas TO geodados;
GRANT SELECT ON TABLE i3geoadmin_ws TO geodados;	
	*/
	
}
$banco = null;
echo "Banco criado!!!";
?>