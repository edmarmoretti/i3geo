<?php
/*
 Title: Fun&ccedil;&otilde;es de uso geral

Fun&ccedil;&otilde;es utilizadas por outros programas do sistema de administra&ccedil;&atilde;o.

No inicio do programa &eacute; feita a inclus&atilde;o do i3geo/ms_configura.php e i3geo/classesphp/funcoes_gerais.php

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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
i3geo/testamapfile.php

Arquivo:

i3geo/admin/php/admin.php
*/
if(!isset($locaplic) || !isset($dir_tmp)){
	$locaplic = "";
	include(dirname(__FILE__)."/../../ms_configura.php");
}
if(!file_exists($dir_tmp)){
	@mkdir ($dir_tmp,0777);
	chmod($dir_tmp,0777);
}
include_once($locaplic."/classesphp/pega_variaveis.php");
error_reporting(0);

//
//carrega o phpmapscript
//
include_once ($locaplic."/classesphp/carrega_ext.php");
include_once ($locaplic."/classesphp/funcoes_gerais.php");

$mapfile = mapfilebase($base,$locaplic);
//
//processa a variavel $esquemaadmin definida em ms_configura.php
//essa variavel precisa ter um . no final quando nao for vazia, evitando erros na inclusao dentro dos SQLs
//
if(!empty($esquemaadmin)){
	$esquemaadmin = str_replace(".","",$esquemaadmin).".";
}

/*
 * Testa se os elementos de um array sao numericos
 * Utilizado para evitar injecao de SQL
 */
function testaNumerico($valores){
	foreach ($valores as $valor) {
		if(!empty($valor) && !is_numeric($valor)) {
			echo "valor nao numerico";
			exit;
		}
	}
}

/*
 Function: retornaJSON

Converte um array em um objeto do tipo JSON utilizando a biblioteca CPAINT

Parametro:

obj {array}

Retorno:

Imprime na sa&Atilde;�da a string JSON
*/
function retornaJSON($obj)
{
	global $locaplic;
	//if(function_exists("json_encode"))
	//{echojson(json_encode($obj));}
	//else
	//{
	include_once($locaplic."/pacotes/cpaint/JSON/json2.php");
	error_reporting(0);
	ob_end_clean();
	$j = new Services_JSON();
	$texto = $j->encode($obj);
	if (!mb_detect_encoding($texto,"UTF-8",true))
		$texto = utf8_encode($texto);
	echo $texto;
}
/*
 Function: verificaDuplicados

Verifica se o resultado de um SQL retorna mais de um registro

Parametros:

sql {string} - sql que ser&Atilde;� executado

dbh {PDO} - objeto PDO de conex&Atilde;�o com o banco

Retorno:

{boolean}
*/
function verificaDuplicados($sql,$dbh)
{
	$res = $dbh->query($sql,PDO::FETCH_ASSOC);
	if(count($res->fetchAll())>0)
		return true;
	else
		return false;
}
/*
 Function: exclui

Exlcui um registro de uma tabela do banco de dados de administra&Atilde;�&Atilde;�o

Utiliza vari&Atilde;�veis globais para fazer a consulta ao banco

Globals:

tabela - nome da tabela

coluna - nome da coluna

id - valor
*/
function exclui()
{
	global $tabela,$coluna,$id,$esquemaadmin;
	try
	{
		include("conexao.php");
		$tabela = $esquemaadmin.$tabela;
		$dbhw->query("DELETE from $tabela WHERE $coluna = $id");
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Function: pegaDados

Executa um sql de busca de dados

Parametros:

sql {string} - sql que ser&Atilde;� executado

locaplic {string} - endere&Atilde;�o do i3Geo no sistema de arquivos

Retorno:

Array originada de fetchAll
*/
function pegaDados($sql,$locaplic="")
{
	$resultado = array();
	/*
	if($locaplic == "")
		include("conexao.php");
	else
		include("$locaplic/admin/php/conexao.php");
	*/
	include(dirname(__FILE__)."/conexao.php");
	error_reporting(0);
	//$dbh deve ser definido com somente leitura, mas por prevencao:
	$sql = str_ireplace(array("update","delete","insert","--","drop",";"),"",$sql);
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	if($q)
	{
		$resultado = $q->fetchAll();
		$dbh = null;
		$dbhw = null;
		return $resultado;
	}
	else
	{
		$e = $dbh->errorInfo();
		//$e1 = $dbhw->errorInfo();
		$dbh = null;
		$dbhw = null;
		//echo " erro: ".$e[2];
		throw new Exception(" erro admin.php funcao pegaDados: <br><span style=color:red >".$e[2]."<br><span style=color:green >");
	}
}
/**
 * Faz o update dos dados de um registro em uma tabela do sistema de administracao
 *
 * @param obj $pdo - objeto pdo
 * @param string $tabela - nome da tabela que sofrera o update
 * @param array $data - array com os nomes dos campos da tabela e os valores
 * @param string $filtro - filtro WHERE que sera utilizado para selecionar os registros que sofrerao o update
 * @return boolean
 */
function i3GeoAdminUpdate($pdo,$tabela,$data,$filtro=""){
	global $esquemaadmin;
	$keys = array_keys($data);
	$sset = array();
	foreach($keys as $k){
		$sset[] = $k."=?";
	}
	$sql = "UPDATE ".$esquemaadmin."$tabela SET ".implode($sset,",")." ".$filtro;
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	try {
		$prep = $pdo->prepare($sql);
	} catch (PDOException $e) {
		return $e->getMessage();
	}
	try {
		$exec = $prep->execute(array_values($data));
		i3GeoAdminInsertLog($pdo,$sql,array_values($data));
		return true;
	} catch (PDOException $e) {
		return $e->getMessage();
	}
}
/**
 * Faz o insert de um novo registro em uma tabela do sistema de administracao
 *
 * @param obj $pdo - objeto pdo
 * @param string $tabela - nome da tabela que sofreara o insert
 * @param array $data - array com os nomes dos campos da tabela e os valores
 * @return boolean
 */
function i3GeoAdminInsert($pdo,$tabela,$data){
	global $esquemaadmin;
	$keys = array_keys($data);
	//$fields = "'".implode("','",$keys)."'";
	$fields = implode(",",$keys);
	$placeholder = str_repeat("?,",count($keys));
	$placeholder = trim($placeholder,",");
	$sql = "INSERT INTO ".$esquemaadmin."$tabela($fields) VALUES ($placeholder)";
	//echo $sql;exit;
	//var_dump($data);exit;
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	try {
	    $prep = $pdo->prepare($sql);
	} catch (PDOException $e) {
	    return "prepare ".$e->getMessage();
	}
	try {
		$exec = $prep->execute(array_values($data));
		//atualiza o log
		i3GeoAdminInsertLog($pdo,$sql,array_values($data));
		return true;
	} catch (PDOException $e) {
		return "execute ".$e->getMessage();
	}
}
/**
 * Faz o insert de um registro e retorna o ID unico criado
 *
 * @param obj $pdo - objeto pdo
 * @param string $tabela - nome da tabela que sofreara o insert
 * @param array $data - array com os nomes dos campos da tabela e os valores
 * @param string $colTemp - coluna do tipo text que recebera um valor temporario para poder recuperar o registro inserido
 * @param string $colId - coluna com id unico, cujo calculo e automatico
 * @return string
 */
function i3GeoAdminInsertUnico($pdo,$tabela,$data,$colTemp,$colId){
	global $esquemaadmin;
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$idtemp = (rand (9000,10000)) * -1;
	$data[$colTemp] = $idtemp;
	$q = i3GeoAdminInsert(
		$pdo,
		$tabela,
		$data
	);
	if($q !== true){
		echo "Error! insert: " . $q; exit;
	}
	try {
		$id = $pdo->query("SELECT $colId FROM ".$esquemaadmin."$tabela WHERE $colTemp = '$idtemp'");
	} catch (PDOException $e) {
		return "SELECT ID ".$e->getMessage();
	}
	try {
		$id = $id->fetchAll();
		$id = $id[0][$colId];
		$sql = "UPDATE ".$esquemaadmin."$tabela SET $colTemp = '' WHERE $colId = $id AND $colTemp = '$idtemp'";
		$pdo->query($sql);
		i3GeoAdminInsertLog($pdo,$sql);
		return $id;
	} catch (PDOException $e) {
		return "UPDATE ID ".$e->getMessage();
	}
}
function i3GeoAdminInsertLog($pdo,$sql,$data=array()){
	global $esquemaadmin;
	$s = "INSERT INTO ".$esquemaadmin."i3geoadmin_log(sql,serializedata,usuario,ip,timestamp,outros) VALUES (?,?,?,?,?,?)";
	$ip = "UNKNOWN";
	if (getenv("HTTP_CLIENT_IP")){
		$ip = getenv("HTTP_CLIENT_IP");
	}
	else if(getenv("HTTP_X_FORWARDED_FOR")){
		$ip = getenv("HTTP_X_FORWARDED_FOR");
	}
	else if(getenv("REMOTE_ADDR")) {
		$ip = getenv("REMOTE_ADDR");
	}
	try {
		$prep = $pdo->prepare($s);
		$exec = $prep->execute(
			array(
				$sql,
				serialize($data),
				$_SESSION["usuario"],
				$ip,
				time()."(".date('r').")",
				""
			)
		);
		return true;
	} catch (PDOException $e) {
		echo $e->getMessage();exit;
	}
}
/*
 Function: verificaFilhos

Verifica se o pai tem filhos nos componentes hier&Atilde;�rquicos do banco de administra&Atilde;�&Atilde;�o

Por exemplo, pode-se verificar se um grupo possu&Atilde;� subgrupos, indicando-se como tabela i3geoadmin_grupos e o id do grupo

Variaveis globais:

tabela {string} - tabela do banco de dados

id {string} - valor a ser procurado

Retorno:

{booleano}
*/
function verificaFilhos()
{
	global $tabela,$id,$esquemaadmin;
	try
	{
		$res = false;
		if($tabela == "i3geoestat_mapa_grupo")
		{
			$grupo = pegaDados("select * from ".$esquemaadmin."i3geoestat_mapa_tema where id_mapa_grupo=$id");
			if(count($grupo) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_mapa")
		{
			$grupo = pegaDados("select * from ".$esquemaadmin."i3geoestat_mapa_grupo where id_mapa=$id");
			if(count($grupo) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_classificacao")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoestat_classes where id_classificacao=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_conexao")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_estat_conexao=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_tipo_periodo")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_tipo_periodo=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_unidade_medida")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_unidade_medida=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_fonteinfo")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoestat_fonteinfo_medida where id_fonteinfo=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_variavel")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_variavel=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoestat_medida_variavel")
		{
			$link = pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel_link where id_medida_variavel=$id");
			$parametro = pegaDados("select * from ".$esquemaadmin."i3geoestat_parametro_medida where id_medida_variavel=$id");
			$fonte = pegaDados("select * from ".$esquemaadmin."i3geoestat_fonteinfo_medida where id_medida_variavel=$id");
			if(count($link) > 0 || count($parametro) > 0 || count($fonte) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_n2")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoadmin_n3 where id_n2=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geousr_grupos")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geousr_gruposusuario where id_grupo=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geousr_usuarios")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geousr_papelusuario where id_usuario=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_n1")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoadmin_n2 where id_n1=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_menus")
		{
			$r = pegaDados("select * from ".$esquemaadmin."i3geoadmin_n1 where id_menu=$id");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_grupos")
		{
			$r = pegaDados("select n1.id_grupo from ".$esquemaadmin."i3geoadmin_n1 as n1, ".$esquemaadmin."i3geoadmin_n2 as n2 where n1.id_n1 = n2.id_n1 and n1.id_grupo = '$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_subgrupos")
		{
			$r = pegaDados("select n2.id_subgrupo from ".$esquemaadmin."i3geoadmin_n3 as n3, ".$esquemaadmin."i3geoadmin_n2 as n2 where n2.id_n2 = n3.id_n3 and n2.id_subgrupo = '$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_temas")
		{
			$r = pegaDados("select id_tema from ".$esquemaadmin."i3geoadmin_n3 where id_tema = '$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_sistemas")
		{
			$r = pegaDados("SELECT id_sistema from ".$esquemaadmin."i3geoadmin_sistemasf where id_sistema ='$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_atlas")
		{
			$r = pegaDados("SELECT id_atlas from ".$esquemaadmin."i3geoadmin_atlasp where id_atlas ='$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_atlasp")
		{
			$r = pegaDados("SELECT id_prancha from ".$esquemaadmin."i3geoadmin_atlast where id_prancha ='$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_n2")
		{
			$r = pegaDados("SELECT id_n3 from ".$esquemaadmin."i3geoadmin_n3 where id_n2 ='$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "i3geoadmin_n1")
		{
			$r = pegaDados("SELECT id_n2 from ".$esquemaadmin."i3geoadmin_n2 where id_n1 ='$id'");
			if(count($r) > 0)
				$res = true;
			$r = pegaDados("SELECT id_raiz from ".$esquemaadmin."i3geoadmin_raiz where nivel='1' and id_nivel ='$id'");
			if(count($r) > 0)
				$res = true;
		}
		if($tabela == "mapfiles")
		{
			$r = pegaDados("SELECT id_tema from ".$esquemaadmin."i3geoadmin_n3 where id_tema ='$id'");
			if(count($r) > 0)
				$res = true;
		}
		return $res;
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Function: resolveAcentos

Converte uma string para uma codifica&Atilde;�&Atilde;�o de caracteres determinada

Parametros:

palavra {string} - palavra a ser convertida

tipo {string} - ISO|UTF

Retorno:

{string}
*/
function resolveAcentos($palavra,$tipo)
{
	if($tipo == "ISO")
	{
		$palavra = mb_convert_encoding($palavra,"AUTO","ISO-8859-1");
	}
	if($tipo == "UTF")
	{
		$palavra = mb_convert_encoding($palavra,"AUTO","UTF-8");
	}
	if($tipo == "html")
		$palavra = htmlentities($palavra);
	if($tipo == "palno")
		$palavra = urldecode($palavra);
	return $palavra;
}
/*
 Function: formularioLoginMaster

Mostra formul&aacute;rio para login quando &eacute; necess&aacute;rio o uso da vari&aacute;vel $i3geomaster cadastrada em ms_configura.php

Parametros:

action {string} - php que ser&aacute; executado no submit do formul&aacute;rio
*/
function formularioLoginMaster($action){
	echo "<form id=formularioLoginMaster method=post action=$action >";
	echo "<br>Essa conex&atilde;o pode n&atilde;o ser segura e os dados de usu&aacute;rio/senha podem ser descobertos<br><br>";
	echo "Nome do usu&aacute;rio master cadastrado em ms_configura.php:<br> <input type=text name=usuario /><br>";
	echo "Senha:<br> <input type=password name=senha /><br>";
	echo "<br><input type=submit />";
}
/*
 Function: verificaMaster

Verifica se um usu&aacute;rio e senha est&aacute; cadastrado no ms_configura

Parametros:

usuario {string}

senha {string}

i3geomaster {array} - vari&aacute;vel existente no ms_configura.php com o cadastro de usu&aacute;rios masters
*/
function verificaMaster($usuario,$senha,$i3geomaster){
	global $i3geomaster;
	foreach($i3geomaster as $teste){
		if(!empty($usuario) && !empty($senha) && $teste["usuario"] == $usuario && $teste["senha"] == $senha){
			return true;
		}
	}
	return false;
}
function mapfilebase($base,$locaplic){
	$versao = versao();
	$versao = $versao["principal"];
	if(isset($base) && $base != ""){
		if(file_exists($base))
		{
			$f = $base;
		}
		else
		{$f = $locaplic."/aplicmap/".$base.".map";
		}
	}
	else
	{
		$f = "";
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
		}
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
			{
				$f = $locaplic."/aplicmap/geral1v".$versao.".map";
			}
		}
	}
	return $f;
}
?>
