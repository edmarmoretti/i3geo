<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="admin/html/admin.css">
</head>
<script>
try
{var objhttp1 = new XMLHttpRequest();}
catch(ee)
{
	try{var objhttp1 = new ActiveXObject("Msxml2.XMLHTTP");}
	catch(e)
	{
		try{var objhttp1 = new ActiveXObject("Microsoft.XMLHTTP");}
		catch(E)
		{document.write("<H1>Seu navegador n&atilde;o aceita AJAX. O mapa nao vai funcionar!!!</H1><br>");}
	}
}
</script>
<body class="yui-skin-sam fundoPonto" >

<div class="bordaSuperior"  >&nbsp;</div>
<div class="mascaraPrincipal" id="divGeral" style=text-align:left >
<?php
/*
Testa a instala&ccedil;&atilde;o do i3Geo

Executa testes e aponta erros na instala&ccedil;&atilde;o.

Licenca

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

*/
$locaplic = dirname(__FILE__);
include_once("admin/php/admin.php");
include_once("ms_configura.php");
if($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin" ){
	echo "<p style='font-size:14px;color:red'>ATEN&Ccedil;&Atilde;O!!! Essa instala&ccedil;&atilde;o est&aacute; vulner&aacute;vel: edite o arquivo i3geo/ms_configura.php e altere o login e senha da vari&aacute;vel i3geomaster</p>";
}

if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	formularioLoginMaster("testainstal.php");
	//opcoes de criacao de pastas
	if (strtoupper(substr(PHP_OS, 0, 3) != 'WIN')){
		echo "<script>";
		echo "var f = document.getElementById('formularioLoginMaster');";
		echo "var ins = '<br><br><input type=checkbox name=criaPastaMstmp unchecked /> Cria a pasta $dir_tmp <br><br>';";
		echo "ins += '<input type=checkbox name=criaLink unchecked /> Cria o link simbolico ".dirname(__FILE__)."/../ms_tmp <br><br>';";
		echo "ins += '<input type=checkbox name=permPastaI3geo unchecked /> Altera as permissoes da pasta $locaplic <br>';";
		echo "f.innerHTML += ins;";

		echo "</script>";
	}
	exit;
}
else{
	$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
	if($continua == false){
		echo "Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
		exit;
	}
}
error_reporting(0);
//echo "<pre>\n";
echo "<span style=font-size:10px >Observa&ccedil;&atilde;o: se voc&ecirc; estiver usando Linux e a biblioteca CAIRO estiver instalada corretamente no Mapserver, edite os arquivos i3geo/aplicmap/geral1fedorav6.map e geral1debianv6.map para remover os coment&aacute;rios do OUTPUTFORMAT que utiliza SVG com o drive Cairo</span><br>\n";
echo "<br><b>TESTE DE INSTALACAO DO i3Geo</b><br>\n";
include ("versao.php");
echo "<br><b>$mensagemInicia </b><br><br> \n";
//ip
$ip = "UNKNOWN";
if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
else $ip = "UNKNOWN";
echo "<br>Seu endere&ccedil;o IP: ".$ip."<br><br>\n";

echo "<br><br>PHP (a vers&atilde;o deve ser a 5x): ";
echo "<br>".phpversion()."<br>\n";
include_once("classesphp/carrega_ext.php");
include_once("classesphp/funcoes_gerais.php");
$versao = versao();
$versao = $versao["principal"];
$exts = get_loaded_extensions();
echo "MapServer (a vers&atilde;o deve ser &gt;= 5.2 para que a sobreposi&ccedil;&atilde;o de temas funcione na interface Google Maps): <br>";
echo ms_GetVersion()."<br><br>";
if(!function_exists("ms_GetVersion"))
{echo "<span style=color:red >PARECE QUE O MAPSERVER NAO ESTA INSTALADO!!!<br><br>";}
echo "---<br>";

if (get_cfg_var("safe_mode") == 1){
	echo "<span style=color:red >Problema: safe_mode no php.ini deveria estar como 'Off'. O i3Geo n&atilde;o ir&aacute; funcionar!!!<br></span>";
}

//executa as opcoes linux definidas no formulario
if(!empty($_POST["criaPastaMstmp"]) && $_POST["criaPastaMstmp"] == "on"){
	echo "<br>Criando a pasta $dir_tmp \n";
	if(!file_exists($dir_tmp)){
		@mkdir ($dir_tmp,0777);
	}
	else{
		chmod($dir_tmp,0777);
	}
	if(!file_exists($dir_tmp)){
		echo "<span style=color:red >Arquivo $dir_tmp n&atilde;o pode ser criado\n";
	}
	else{
		echo "...OK\n";
	}
}
if(!empty($_POST["criaPastaMstmp"]) && $_POST["criaLink"] == "on"){
	$d = dirname(__FILE__)."/../ms_tmp";
	echo "<br>Criando o link simb&oacute;lico $d \n";
	if(!file_exists($d)){
		@symlink($dir_tmp,$d);
	}
	else{
		chmod($d,0777);
	}
	if(!file_exists("/var/www/ms_tmp")){
		echo "<span style=color:red >Link $d n&atilde;o pode ser criado\n";
	}
	else{
		echo "...OK\n";
	}
}
if(!empty($_POST["criaPastaMstmp"]) && $_POST["permPastaI3geo"] == "on"){
	echo "<br>Alterando permiss&otilde;es i3geo i3geo/temas i3geo/admin i3geo/admin/admin.db\n";
	if(file_exists($locaplic)){
		chmod($locaplic,0777);
		chmod($locaplic."/temas",0777);
		chmod($locaplic."/admin",0777);
		chmod($locaplic."/admin/admin.db",0777);
		echo "...OK\n";
	}
}
echo "<br><pre>Extens&otilde;es:<br>";
if (!extension_loaded("curl")){
	echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a curl que pode afetar algumas funcionalidades do i3Geo<br></span>";
}
if (!extension_loaded("imagick")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a imagick<br></span>";}
if (!extension_loaded("libxml")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a libxml<br></span>";}
if (!extension_loaded( "PDO")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a PDO<br></span>";}
if (!extension_loaded( "pdo_sqlite")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a pdo_sqlite<br></span>";}
if (!extension_loaded( "SQLite") && !extension_loaded( "sqlite3")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a SQLite<br></span>";}
if (!extension_loaded( "SimpleXML")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a SimpleXML<br></span>";}
if (!extension_loaded( "dom")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a dom<br></span>";}
if (!extension_loaded( "xml")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a xml<br></span>";}
if (!extension_loaded( "zlib")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a zlib <br></span>";}
if (!extension_loaded( "gd")){echo "<span style=color:red >Problema: n&atilde;o est&aacute; instalado a gd<br></span>";}
if (!extension_loaded( "gd2")){echo "<span style=color:red >Obs: n&atilde;o est&aacute; instalado a gd2 - o que n&atilde;o &eacute; muito cr&iacute;tico....<br></span>";}
if (!extension_loaded( "mbstring")){echo "<span style=color:red >Obs: n&atilde;o est&aacute; instalado a mbstring<br></span>";}

var_dump( $exts );

echo "</pre>Existe o ms_configura.php? <br>";
if(file_exists("ms_configura.php")) echo "Sim\n"; else {echo "Nao";saindo(" ms_configura n&atilde;o encontrado");}
echo "Incluindo...\n<br>";
include ("ms_configura.php");
echo "Mensagem de inicializa&ccedil;&atilde;o: <b>$mensagemInicia </b><br><br> \n";
echo "dir_tmp = $dir_tmp \n<br>";
echo "locmapserv = $locmapserv \n";
echo "\n<br>";
echo "Este php est&aacute; em ".getcwd()."\n";
echo "<br>O diretório de arquivos SESSION tempor&aacute;rio &eacute;: ".session_save_path()."<br>\n";
if($conexaoadmin == "" && file_exists($locaplic."/admin/admin.db")){
	echo "<br>As permiss&otilde;es do banco de dados $locaplic/admin/admin.db s&atilde;o (se o arquivo estiver bloqueado, o sistema de administra&ccedil;&atilde;o n&atilde;o ir&aacute; funcionar):<br>";
	echo permissoesarquivo($locaplic."/admin/admin.db")."<br>";
}
echo "<pre>";
include_once("admin/php/conexao.php");
echo "verificando banco de dados de administra&ccedil;&atilde;o...\n";
/**
 *
 * TODO V5.0 verificar tabelas antes de fechar versao
 */
$tabelas = array(
	"i3geoadmin_sistemasf"=>"abrir_funcao,h_funcao,id_funcao,id_sistema,nome_funcao,perfil_funcao,w_funcao",
	"i3geoadmin_tags"=>"id_tag,nome",
	"i3geoadmin_perfis"=>"id_perfil,perfil",
	"i3geoadmin_atlasp"=>"ordem_prancha,desc_prancha,h_prancha,icone_prancha,id_atlas,id_prancha,link_prancha,mapext_prancha,titulo_prancha,w_prancha",
	"i3geoadmin_atlast"=>"ordem_tema,codigo_tema,id_prancha,id_tema,ligado_tema",
	"i3geoadmin_mapas"=>"publicado_mapa,ordem_mapa,perfil_mapa,ligados_mapa,temas_mapa,desc_mapa,ext_mapa,id_mapa,imagem_mapa,linkdireto_mapa,nome_mapa,outros_mapa,mapfile",
	"i3geoadmin_atlas"=>"publicado_atlas,ordem_atlas,basemapfile_atlas,desc_atlas,h_atlas,icone_atlas,id_atlas,link_atlas,pranchadefault_atlas,template_atlas,tipoguias_atlas,titulo_atlas,w_atlas",
	"i3geoadmin_sistemas"=>"publicado_sistema,id_sistema,nome_sistema,perfil_sistema",
	"i3geoadmin_identifica"=>"publicado_i,abrir_i,id_i,nome_i,target_i",
	"i3geoadmin_raiz"=>"ordem,id_tema,id_menu,id_nivel,id_raiz,nivel,perfil",
	"i3geoadmin_n1"=>"publicado,ordem,id_menu,id_grupo,id_n1,n1_perfil",
	"i3geoadmin_n2"=>"publicado,ordem,id_n1,id_n2,id_subgrupo,n2_perfil",
	"i3geoadmin_n3"=>"publicado,ordem,id_n2,id_n3,id_tema,n3_perfil",
	"i3geoadmin_ws"=>"nacessosok,nacessos,autor_ws,desc_ws,id_ws,link_ws,nome_ws,tipo_ws",
	"i3geoadmin_grupos"=>"it,es,en,desc_grupo,id_grupo,nome_grupo",
	"i3geoadmin_subgrupos"=>"it,es,en,desc_subgrupo,id_subgrupo,nome_subgrupo",
	"i3geoadmin_temas"=>"it,es,en,kmz_tema,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema",
	"i3geoadmin_menus"=>"it,es,en,publicado_menu,perfil_menu,aberto,desc_menu,id_menu,nome_menu",
	"i3geoadmin_comentarios"=>"comentario,data,openidnome,openidimagem,openidservico,openidusuario,openidurl,id_tema",
	"i3geoadmin_acessostema"=>"codigo_tema,nacessos,dia,mes,ano",
	"i3geousr_usuarios"=>"id_usuario,ativo,data_cadastro,email,login,nome_usuario,senha",
	"i3geousr_papeis"=> "id_papel,nome,descricao",
	"i3geousr_papelusuario"=> "id_usuario,id_papel",
	"i3geousr_operacoes" => "id_operacao,codigo,descricao",
	"i3geousr_operacoespapeis" => "id_operacao,id_papel",
	"i3geousr_grupos" => "id_grupo,nome,descricao",
	"i3geousr_grupotema" => "id_grupo,id_tema",
	"i3geousr_grupousuario" => "id_usuario,id_grupo",
	"i3geoestat_conexao" => "codigo_estat_conexao,bancodedados,host,porta,usuario,senha",
	"i3geoestat_tipo_regiao" => "codigo_tipo_regiao,nome_tipo_regiao,descricao_tipo_regiao,codigo_estat_conexao,esquemadb,tabela,colunageo,data,identificador,colunanomeregiao,srid,colunacentroide,colunasvisiveis,apelidos",
	"i3geoestat_agregaregiao" => "id_agregaregiao,codigo_tipo_regiao,codigo_tipo_regiao_pai,colunaligacao_regiaopai",
	"i3geoestat_tipo_periodo" => "codigo_tipo_periodo,nome,descricao",
	"i3geoestat_unidade_medida" => "codigo_unidade_medida,nome,sigla,permitesoma,permitemedia",
	"i3geoestat_variavel" => "codigo_variavel,nome,descricao",
	"i3geoestat_medida_variavel" => "id_medida_variavel,codigo_unidade_medida,codigo_tipo_periodo,codigo_variavel,codigo_tipo_regiao,codigo_estat_conexao,esquemadb,tabela,colunavalor,colunaidgeo,filtro,nomemedida,colunaidunico",
	"i3geoestat_classificacao" => "id_classificacao,nome,id_medida_variavel,observacao",
	"i3geoestat_classes" => "id_classe,expressao,titulo,vermelho,verde,azul,id_classificacao,tamanho,simbolo,overmelho,overde,oazul,otamanho",
	"i3geoestat_fonteinfo" => "id_fonteinfo,titulo,link",
	"i3geoestat_fonteinfo_medida" => "id_medida_variavel,id_fonteinfo",
	"i3geoestat_medida_variavel_link" => "link,id_medida_variavel,nome,id_link",
	"i3geoestat_parametro_medida" => "id_parametro_medida,coluna,nome,descricao,id_pai,id_medida_variavel,tipo"
);
include_once("admin/php/conexao.php");
if(!empty($esquemaadmin)){
	$esquemaadmin = str_replace(".","",$esquemaadmin).".";
}

foreach(array_keys($tabelas) as $tabela)
{
	echo "     Tabela: <b>".$tabela."</b>";
	$sql = "select * from ".$esquemaadmin.$tabela;
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	if($q !== false)
	{
		$resultado = $q->fetchAll();
		if(count($resultado) > 0)
		{
			echo "...ok\n";
			foreach(explode(",",$tabelas[$tabela]) as $coluna)
			{
				echo "         coluna: ".$coluna;
				if(in_array($coluna,array_keys($resultado[0])))
				{echo "...ok\n";}
				else
				{echo "<span style=color:red >..n&atilde;o encontrada. Consulte o i3geo/guia_de_migracao.txt</span>\n";}
			}
		}
		else
		{echo "<span style=color:red >...n&atilde;o existem registros cadastrados</span>\n";}
	}
	else
	{echo "<span style=color:red >..n&atilde;o encontrada. Consulte o i3geo/guia_de_migracao.txt</span>\n";}
}
echo "\n";
echo "</pre><br>localizando o cgi...\n";
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$enderecocgi = $proto.$server.$locmapserv;
echo "Voc&ecirc; pode testar o CGI clicando <a href='".$enderecocgi."' target='_blank'>aqui</a>, se o programa responder corretamente, dever&aacute; aparecer na tela algo como 'No query information to decode. QUERY_STRING is set, but empty.'\n" ;

$f = @fopen("temas/teste.txt",w);
@fclose($f);
if (!file_exists("temas/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever na pasta temas. O sistema de administracao pode nao funcionar corretamente</span><br>";
}

echo "<br>Escrevendo nos diret&oacute;rios tempor&aacute;rios...<br>";
$f = @fopen($dir_tmp."/teste.txt",w);
@fclose($f);
if (file_exists($dir_tmp."/teste.txt")) echo "do Mapserver ok<br>\n"; else saindo("\nN&atilde;o foi poss&iacute;vel gravar no diret&oacute;rio tempor&aacute;rio $dir_tmp");

$f = @fopen(session_save_path()."/teste.txt",w);
@fclose($f);
if (file_exists(session_save_path()."/teste.txt")) echo "da SESSION PHP ok<br>\n"; else saindo("\nN&atilde;o foi poss&iacute;vel gravar no diret&oacute;rio tempor&aacute;rio da SESSION");

echo " \n";
echo "Carregando o map_file base...\n";
$versao = versao();
$versao = $versao["principal"];
if(isset($base) && $base != ""){
	if(file_exists($base))
	{$f = $base;}
	else
	{$f = $locaplic."/aplicmap/".$base.".map";}
	if(!file_exists($base)){
		echo "<span style=color:red >ARQUIVO $base N&Acirc;O FOI ENCONTRADO. CORRIJA ISSO EM ms_configura.php";
		exit;
	}
}
else
{
	$f = "";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";}
	else
	{
		if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
			$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
		}
		if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
		}
		if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
		}
		if($f == "")
		{$f = $locaplic."/aplicmap/geral1v".$versao.".map";}
	}
}
$mapa = ms_newMapObj($f);
echo "<br>O arquivo mapfile de iniciliza&ccedil;&atilde;o &eacute;: $f<br>\n";
echo "<b>E agora..desenhando o mapa (se o mapa n&atilde;o aparecer &eacute; um problema...\nverifique os caminhos no ms_configura.php e no $f):</b>\n";
$imgo = $mapa->draw();
$nome = ($imgo->imagepath)."teste.png";
echo "<p>Nome da imagem gerada: $nome </p>";
$imgo->saveImage($nome);
$nome = ($imgo->imageurl).basename($nome);
echo "<p><img src=$nome /></p>";

echo " \n";
$error = "";
ms_ResetErrorList();
echo "Carregando o map_file geral1... e acrescentando os limites estaduais (aplicmap/estadosl...) \n";
if(isset($estadosl))
{$maptemp = ms_newMapObj($locaplic."/aplicmap/".$estadosl.".map");}
else{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{$maptemp = ms_newMapObj($locaplic."/aplicmap/estadoslwindows.map");}
	else
	{$maptemp = ms_newMapObj($locaplic."/aplicmap/estadosl.map");}
}
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
echo "<b>E agora..desenhando o mapa (se o mapa n&atilde;o aparecer &eacute; um problema...\nverifique os caminhos no ms_configura.php e no estadosl.map ou estadoslwindows.map):</b>\n";
echo "Um problema bastante comum &eacute; o n&atilde;o reconhecimento do diret&oacute;rio ms_tmp pelo Apache. \nO diretório ms_tmp &eacute; utilizado pelo Mapserver e pelo i3geo para armazenar dados tempor&aacute;rios. \n&Eacute; nesse diretório que ficam as imagens do mapa.\n";
echo "Quando o Apache n&atilde;o consegue utilizar esse diret&oacute;rio, a imagem n&atilde;o ser&aacute; mostrada,\n apesar de ser gerada dentro do ms_tmp (vc pode verificar se as imagens do \nmapa est&atilde;o sendo criadas no ms_tmp após rodar o testainstal.php).\n";
echo "Para solucionar esse problema, vc pode criar um link simb&oacute;lico (nos sistemas linux),\n no mesmo local onde est&aacute; instalado o i3geo, apontando para o local \nf&iacute;sico onde est&aacute; o ms_tmp.\n";
echo "<b>O nome do link simbólico deve ser o mesmo que estiver definido em aplicmap/geral1.map ou geral1debian.map na linha IMAGEURL. Esse nome por default &eacute; definido como ms_tmp.\n";
echo "No wiki do portal do software p&uacute;blico vc poder&aacute; encontrar mais detalhes sobre isso.\n";

for($i=0;$i<($maptemp->numlayers);$i++)
{
	$layern = $maptemp->getLayer($i);
	if ($layern->name == "estadosl")
	{$layern->set("data",$locaplic."/aplicmap/dados/estados.shp");}
	ms_newLayerObj($mapa, $layern);
}
$imgo = $mapa->draw();
$nome = ($imgo->imagepath)."teste1.png";
echo "<p>Nome da imagem gerada: $nome </p>";
$imgo->saveImage($nome);
$nome = ($imgo->imageurl).basename($nome);
echo "<p><img src=$nome /></p></body></html>";

function saindo($men){echo "<span style=color:red ><br><b>Erro. Saindo...".$men;}
/*
Retorna as permiss&otilde;es de um arquivo

Parametros:

$arquivo
*/
function permissoesarquivo($arquivo){
	$perms = fileperms($arquivo);

	if (($perms & 0xC000) == 0xC000) {
		// Socket
		$info = 's';
	} elseif (($perms & 0xA000) == 0xA000) {
		// Symbolic Link
		$info = 'l';
	} elseif (($perms & 0x8000) == 0x8000) {
		// Regular
		$info = '-';
	} elseif (($perms & 0x6000) == 0x6000) {
		// Block special
		$info = 'b';
	} elseif (($perms & 0x4000) == 0x4000) {
		// Directory
		$info = 'd';
	} elseif (($perms & 0x2000) == 0x2000) {
		// Character special
		$info = 'c';
	} elseif (($perms & 0x1000) == 0x1000) {
		// FIFO pipe
		$info = 'p';
	} else {
		// Unknown
		$info = 'u';
	}

	// Owner
	$info .= (($perms & 0x0100) ? 'r' : '-');
	$info .= (($perms & 0x0080) ? 'w' : '-');
	$info .= (($perms & 0x0040) ?
			(($perms & 0x0800) ? 's' : 'x' ) :
			(($perms & 0x0800) ? 'S' : '-'));

	// Group
	$info .= (($perms & 0x0020) ? 'r' : '-');
	$info .= (($perms & 0x0010) ? 'w' : '-');
	$info .= (($perms & 0x0008) ?
			(($perms & 0x0400) ? 's' : 'x' ) :
			(($perms & 0x0400) ? 'S' : '-'));

	// World
	$info .= (($perms & 0x0004) ? 'r' : '-');
	$info .= (($perms & 0x0002) ? 'w' : '-');
	$info .= (($perms & 0x0001) ?
			(($perms & 0x0200) ? 't' : 'x' ) :
			(($perms & 0x0200) ? 'T' : '-'));

	return $info;
}

?>
</div>

</body>
</html>
