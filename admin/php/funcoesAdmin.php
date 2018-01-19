<?php
namespace admin\php\funcoesAdmin;
use PDO;
use PDOException;
use Services_JSON;

function listaConexaoMetaestat(){
    if(!isset($_SESSION["postgis_mapa"])){
        include(dirname(__FILE__)."/../../ms_configura.php");
    } else {
        $postgis_mapa = $_SESSION["postgis_mapa"];
    }
    if(isset($postgis_mapa["metaestat"])){
        $m = $postgis_mapa["metaestat"];
        if($m == ""){
            return false;
        }
        $lista = explode(" ",$m);
        $con = array();
        foreach($lista as $l){
            $teste = explode("=",$l);
            $con[trim($teste[0])] = trim($teste[1]);
        }
        $c = array(
            "codigo_estat_conexao" => "metaestat",
            "bancodedados" => $con["dbname"],
            "host" => $con["host"],
            "porta" => $con["port"],
            "usuario" => $con["user"],
            "senha" => $con["password"],
            "fonte" => "ms_configura"
        );
        return $c;
    } else {
        return false;
    }
}
//
// verifica se um determinado papel esta registrado na variavel SESSION
//
function verificaPapelSessao($id_papel) {
	$resultado = false;
	if (\admin\php\funcoesAdmin\validaSessao ()) {
		foreach ( $_SESSION ["papeis"] as $p ) {
			if ($p ["id_papel"] == 1 || $p ["id_papel"] == $id_papel) {
				return true;
			}
		}
	}
	return $resultado;
}
//
// verifica se o usuario esta logado
//
function validaSessao() {
	if ($_SESSION ["usuario"] != $_COOKIE ["i3geousuariologin"]) {
		return false;
	}
	return true;
}
function testaSafeNumerico($valores) {
	foreach ( $valores as $valor ) {
		if (! empty ( $valor ) && ! is_numeric ( $valor )) {
			ob_clean ();
			header ( "HTTP/1.1 403 valor nao numerico" );
			exit ();
		}
	}
}
function verificaOperacaoSessao($operacao) {
    $resultado = false;
	// a validacao consulta $_SESSION, que e definida no login
	if (\admin\php\funcoesAdmin\validaSessao ()) {
		// verifica se e administrador, caso positivo, permite qq operacao
		foreach ( $_SESSION ["papeis"] as $p ) {
			if ($p == 1) {
				return true;
			}
		}
		if (! empty ( $_SESSION ["operacoes"] [$operacao] )) {
			$resultado = true;
		}
	}
	return $resultado;
}
/*
 * Testa se os elementos de um array sao numericos
 * Utilizado para evitar injecao de SQL
 */
function testaNumerico($valores){
	foreach ($valores as $valor) {
		if(!empty($valor) && !is_numeric($valor)) {
			ob_clean();
			header ( "HTTP/1.1 403 valor nao numerico" );
			exit;
		}
	}
}

/*
 Function: \admin\php\funcoesAdmin\retornaJSON

Converte um array em um objeto do tipo JSON utilizando a biblioteca CPAINT

Parametro:

obj {array}

Retorno:

Imprime na saida a string JSON
*/
function retornaJSON($obj)
{
	$locaplic = $_SESSION["locaplic"];
	include_once($locaplic."/pacotes/cpaint/JSON/json2.php");
	//error_reporting (E_ALL);
	ob_end_clean();
	$j = new Services_JSON();
	$texto = $j->encode($obj);
	if (!mb_detect_encoding($texto,"UTF-8",true)){
		$texto = utf8_encode($texto);
	}
	echo $texto;
}
/*
 Function: \admin\php\funcoesAdmin\verificaDuplicados

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

Utiliza variaveis globais para fazer a consulta ao banco

Globals:

tabela - nome da tabela

coluna - nome da coluna

id - valor
*/
//depreciar em favor de excluiRegistro
function exclui($tabela,$coluna,$id){
	try {
		include("conexao.php");
		$sql = "DELETE from $tabela WHERE $coluna = ?";
		$prep = $dbhw->prepare($sql);
		$prep->execute(array($id));
		\admin\php\funcoesAdmin\i3GeoAdminInsertLog($dbhw,$sql,array($id));
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e) {
		return "Error!: ";
	}
}
//usar esse para nao haver confusao com o nome "exclui"
function i3GeoAdminExclui($tabela,$coluna,$id,$dbhw="",$close=true){
	try {
		if($dbh == "" || is_string($dbh)){
			include(dirname(__FILE__)."/conexao.php");
		}
		$sql = "DELETE from $tabela WHERE $coluna = ?";
		$prep = $dbhw->prepare($sql);
		$prep->execute(array($id));
		\admin\php\funcoesAdmin\i3GeoAdminInsertLog($dbhw,$sql,array($id));
		if($close == true){
			$dbh = null;
			$dbhw = null;
		}
		return "ok";
	}
	catch (PDOException $e) {
		return "Error!: ";
	}
}
/*
 Function: \admin\php\funcoesAdmin\pegaDados

Executa um sql de busca de dados

Parametros:

sql {string} - sql que serao executado

Retorno:

Array originada de fetchAll
*/
function pegaDados($sql,$dbh="",$close=true)
{
	//error_reporting (E_ALL);
	$resultado = array();
	//is_string para efeitos de compatibilidade
	if($dbh == "" || is_string($dbh)){
		include(dirname(__FILE__)."/conexao.php");
	}
	//$dbh deve ser definido com somente leitura, mas por prevencao:
	$sql = str_ireplace(array("update","delete","insert","--","drop",";"),"",$sql);
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	if($q){
		$resultado = $q->fetchAll();
		if($close == true){
			$dbh = null;
			$dbhw = null;
		}
		return $resultado;
	}
	else{
		if($close == true){
			$dbh = null;
			$dbhw = null;
		}
		//throw new Exception(" erro admin.php funcao \admin\php\funcoesAdmin\pegaDados");
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
	$esquemaadmin = $_SESSION["esquemaadmin"];
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
		return "Error!: ";
	}
	try {
		$exec = $prep->execute(array_values($data));
		\admin\php\funcoesAdmin\i3GeoAdminInsertLog($pdo,$sql,array_values($data));
		return true;
	} catch (PDOException $e) {
		//echo $e->getMessage( );
		return "Error!: ";
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
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$keys = array_keys($data);
	$fields = implode(",",$keys);
	$placeholder = str_repeat("?,",count($keys));
	$placeholder = trim($placeholder,",");
	$sql = "INSERT INTO ".$esquemaadmin."$tabela($fields) VALUES ($placeholder)";
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	try {
		$prep = $pdo->prepare($sql);
	} catch (PDOException $e) {
		return "prepare ";
	}
	try {
		$exec = $prep->execute(array_values($data));
		//atualiza o log
		\admin\php\funcoesAdmin\i3GeoAdminInsertLog($pdo,$sql,array_values($data));
		return true;
	} catch (PDOException $e) {
		return "execute ";
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
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$idtemp = (rand (9000,10000)) * -1;
	$data[$colTemp] = $idtemp;

	$q = \admin\php\funcoesAdmin\i3GeoAdminInsert(
		$pdo,
		$tabela,
		$data
	);
	if($q !== true){
		echo "Error! insert "; exit;
	}
	try {
		$id = $pdo->query("SELECT $colId FROM ".$esquemaadmin."$tabela WHERE $colTemp = '$idtemp'");
	} catch (PDOException $e) {
		return "SELECT ID ";
	}
	try {
		$id = $id->fetchAll();
		$id = $id[0][$colId];
		$sql = "UPDATE ".$esquemaadmin."$tabela SET $colTemp = '' WHERE $colId = $id AND $colTemp = '$idtemp'";
		$pdo->query($sql);
		\admin\php\funcoesAdmin\i3GeoAdminInsertLog($pdo,$sql);
		return $id;
	} catch (PDOException $e) {
		return "UPDATE ID ";
	}
}
//
//o array $ordem contem a lista de ids na ordem desejada
//
function i3GeoAdminOrdena($pdo,$ordem,$tabela,$colunaid){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$arr = array();
	$n = count($ordem) + 1;
	for($i = 1; $i < $n; $i++){
		$arr[$ordem[$i - 1]] = $i;
	}
	$str_ids = implode(',', array_keys($arr));
	$str_when_then = "";
	foreach($arr as $id => $ordem) {
		$str_when_then .= sprintf(" WHEN " . $colunaid . " = %d THEN %s ",
			$id,
			$ordem // note, you'd sanitize this if from user input
		);
	}
	//whitespace + appends included in example for readability
	$template =   "UPDATE ".$esquemaadmin . $tabela." "
		. "   SET ordem = CASE "
		. "     %s "
		. "   END "
		. " WHERE " . $colunaid . " IN (%s);";
	$sql = sprintf($template, $str_when_then, $str_ids);

	try {
		$resultado = $pdo->query($sql);
	} catch (PDOException $e) {
		return false;
	}
	\admin\php\funcoesAdmin\i3GeoAdminInsertLog($pdo,$sql,array());
	return true;
}
//$logTransacoes vem do ms_configura.php
function i3GeoAdminInsertLog($pdo,$sql,$data=array()){
	$logTransacoes = $_SESSION["logTransacoes"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($logTransacoes == "" || $logTransacoes !== true){
		return;
	}
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
		echo "insert log";exit;
	}
}
/*
 Function: \admin\php\funcoesAdmin\resolveAcentos

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
 Function: \admin\php\funcoesAdmin\formularioLoginMaster

Mostra formul&aacute;rio para login quando &eacute; necess&aacute;rio o uso da vari&aacute;vel $i3geomaster cadastrada em ms_configura.php

Parametros:

action {string} - php que ser&aacute; executado no submit do formul&aacute;rio
*/
function formularioLoginMaster($action){
	echo "<form id=\admin\php\funcoesAdmin\formularioLoginMaster method=post action=$action >";
	echo "<br>Essa conex&atilde;o pode n&atilde;o ser segura e os dados de usu&aacute;rio/senha podem ser descobertos<br><br>";
	echo "Nome do usu&aacute;rio master cadastrado em ms_configura.php:<br> <input type=text name=usuario /><br>";
	echo "Senha:<br> <input type=password name=senha /><br>";
	echo "<br><input type=submit />";
}
/*
 Function: \admin\php\funcoesAdmin\verificaMaster

Verifica se um usu&aacute;rio e senha est&aacute; cadastrado no ms_configura

Parametros:

usuario {string}

senha {string}

i3geomaster {array} - vari&aacute;vel existente no ms_configura.php com o cadastro de usu&aacute;rios masters
*/
function verificaMaster($usuario,$senha,$i3geomaster){
    foreach($i3geomaster as $teste){
		if(!empty($usuario) && !empty($senha) && $teste["usuario"] == $usuario && $teste["senha"] == $senha){
			return true;
		}
	}
	return false;
}
function nomeRandomico($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}
/*
 Function: \admin\php\funcoesAdmin\substituiCon

 Substitu&iacute; a string de conex&atilde;o com o banco postgis pela string definida na inicializa&ccedil;&atilde;o (ms_configura.php)

 Parametros:

 $map_file {string} - arquivo mapfile

 $postgis_mapa {array} - lista de strings de conex&atilde;o com o banco

 Retorno:

 {boleano}
 */
function substituiCon($map_file,$postgis_mapa)
{
	//error_reporting (E_ALL);
	if (!empty($postgis_mapa) && (file_exists($map_file)))
	{
		if(!@ms_newMapObj($map_file)){return false;}
		$objMap = ms_newMapObj($map_file);
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS)
			{
				$lcon = $layer->connection;
				if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
				{
					//
					//o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
					//
					if(($lcon == " ") || ($lcon == ""))
					{
						$layer->set("connection",$postgis_mapa);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
					else
					{
						$layer->set("connection",$postgis_mapa[$lcon]);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
				}
			}
		}
		$objMap->save($map_file);
	}
	return true;
}
function substituiConObj($objMap,$postgis_mapa){
	//error_reporting (E_ALL);
	if (!empty($postgis_mapa)){
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i){
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS){
				$lcon = $layer->connection;
				if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))	{
					//
					//o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
					//
					if(($lcon == " ") || ($lcon == ""))	{
						$layer->set("connection",$postgis_mapa);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
					else{
						$layer->set("connection",$postgis_mapa[$lcon]);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
				}
			}
		}
	}
}
/*
 Function: \admin\php\funcoesAdmin\restauraCon

 Esconde a string de conex&atilde;o com o banco, caso necess&aacute;rio

 Parametros:

 $map_file {string} - arquivo mapfile

 $postgis_mapa {string} - lista de conex&atilde;o com o banco
 */
function restauraCon($map_file,$postgis_mapa)
{
	if(!@ms_newMapObj($map_file)){return;}
	if (!empty($postgis_mapa))
	{
		$objMap = ms_newMapObj($map_file);
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS)
			{
				if (!is_array($postgis_mapa) && $layer->connection == $postgis_mapa)
				{$layer->set("connection"," ");}
				if($layer->getmetadata("conexaooriginal") != "")
				{$layer->set("connection",$layer->getmetadata("conexaooriginal"));}
			}
		}
		$objMap->save($map_file);
	}
}
function restauraConObj($objMap,$postgis_mapa)
{
	if (!empty($postgis_mapa))
	{
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS)
			{
				if (!is_array($postgis_mapa) && $layer->connection == $postgis_mapa)
				{$layer->set("connection"," ");}
				if($layer->getmetadata("conexaooriginal") != "")
				{$layer->set("connection",$layer->getmetadata("conexaooriginal"));}
			}
		}
	}
}
/*
 Function: \admin\php\funcoesAdmin\versao

 Retorna a vers&atilde;o do Mapserver.

 Retorno:

 {array} - array("completa"=>,"principal"=>)
 */
function versao()
{
	$v = "5.0.0";
	$vs = explode(" ",ms_GetVersion());
	$cvs = count($vs);
	for ($i=0;$i<$cvs;++$i)
	{
		if(trim(strtolower($vs[$i])) == "version")
		{$v = $vs[$i+1];}
	}
	$versao["completa"] = $v;
	$v = explode(".",$v);
	$versao["principal"] = $v[0];
	$versao["inteiro"] = ms_GetVersionInt();
	return $versao;
}
function seems_utf8($Str) { # by bmorel at ssi dot fr
	$length = strlen($Str);
	for ($i = 0; $i < $length; $i++) {
		if (ord($Str[$i]) < 0x80) continue; # 0bbbbbbb
		elseif ((ord($Str[$i]) & 0xE0) == 0xC0) $n = 1; # 110bbbbb
		elseif ((ord($Str[$i]) & 0xF0) == 0xE0) $n = 2; # 1110bbbb
		elseif ((ord($Str[$i]) & 0xF8) == 0xF0) $n = 3; # 11110bbb
		elseif ((ord($Str[$i]) & 0xFC) == 0xF8) $n = 4; # 111110bb
		elseif ((ord($Str[$i]) & 0xFE) == 0xFC) $n = 5; # 1111110b
		else return false; # Does not match any model
		for ($j = 0; $j < $n; $j++) { # n bytes matching 10bbbbbb follow ?
			if ((++$i == $length) || ((ord($Str[$i]) & 0xC0) != 0x80))
				return false;
		}
	}
	return true;
}
function removeAcentos($string){
	if (!preg_match('/[\x80-\xff]/', $string)){
		return $string;
	}
	if (\admin\php\funcoesAdmin\seems_utf8($string)) {
		$chars = array(
				// Decompositions for Latin-1 Supplement
				chr(195).chr(128) => 'A', chr(195).chr(129) => 'A',
				chr(195).chr(130) => 'A', chr(195).chr(131) => 'A',
				chr(195).chr(132) => 'A', chr(195).chr(133) => 'A',
				chr(195).chr(135) => 'C', chr(195).chr(136) => 'E',
				chr(195).chr(137) => 'E', chr(195).chr(138) => 'E',
				chr(195).chr(139) => 'E', chr(195).chr(140) => 'I',
				chr(195).chr(141) => 'I', chr(195).chr(142) => 'I',
				chr(195).chr(143) => 'I', chr(195).chr(145) => 'N',
				chr(195).chr(146) => 'O', chr(195).chr(147) => 'O',
				chr(195).chr(148) => 'O', chr(195).chr(149) => 'O',
				chr(195).chr(150) => 'O', chr(195).chr(153) => 'U',
				chr(195).chr(154) => 'U', chr(195).chr(155) => 'U',
				chr(195).chr(156) => 'U', chr(195).chr(157) => 'Y',
				chr(195).chr(159) => 's', chr(195).chr(160) => 'a',
				chr(195).chr(161) => 'a', chr(195).chr(162) => 'a',
				chr(195).chr(163) => 'a', chr(195).chr(164) => 'a',
				chr(195).chr(165) => 'a', chr(195).chr(167) => 'c',
				chr(195).chr(168) => 'e', chr(195).chr(169) => 'e',
				chr(195).chr(170) => 'e', chr(195).chr(171) => 'e',
				chr(195).chr(172) => 'i', chr(195).chr(173) => 'i',
				chr(195).chr(174) => 'i', chr(195).chr(175) => 'i',
				chr(195).chr(177) => 'n', chr(195).chr(178) => 'o',
				chr(195).chr(179) => 'o', chr(195).chr(180) => 'o',
				chr(195).chr(181) => 'o', chr(195).chr(182) => 'o',
				chr(195).chr(182) => 'o', chr(195).chr(185) => 'u',
				chr(195).chr(186) => 'u', chr(195).chr(187) => 'u',
				chr(195).chr(188) => 'u', chr(195).chr(189) => 'y',
				chr(195).chr(191) => 'y',
				// Decompositions for Latin Extended-A
				chr(196).chr(128) => 'A', chr(196).chr(129) => 'a',
				chr(196).chr(130) => 'A', chr(196).chr(131) => 'a',
				chr(196).chr(132) => 'A', chr(196).chr(133) => 'a',
				chr(196).chr(134) => 'C', chr(196).chr(135) => 'c',
				chr(196).chr(136) => 'C', chr(196).chr(137) => 'c',
				chr(196).chr(138) => 'C', chr(196).chr(139) => 'c',
				chr(196).chr(140) => 'C', chr(196).chr(141) => 'c',
				chr(196).chr(142) => 'D', chr(196).chr(143) => 'd',
				chr(196).chr(144) => 'D', chr(196).chr(145) => 'd',
				chr(196).chr(146) => 'E', chr(196).chr(147) => 'e',
				chr(196).chr(148) => 'E', chr(196).chr(149) => 'e',
				chr(196).chr(150) => 'E', chr(196).chr(151) => 'e',
				chr(196).chr(152) => 'E', chr(196).chr(153) => 'e',
				chr(196).chr(154) => 'E', chr(196).chr(155) => 'e',
				chr(196).chr(156) => 'G', chr(196).chr(157) => 'g',
				chr(196).chr(158) => 'G', chr(196).chr(159) => 'g',
				chr(196).chr(160) => 'G', chr(196).chr(161) => 'g',
				chr(196).chr(162) => 'G', chr(196).chr(163) => 'g',
				chr(196).chr(164) => 'H', chr(196).chr(165) => 'h',
				chr(196).chr(166) => 'H', chr(196).chr(167) => 'h',
				chr(196).chr(168) => 'I', chr(196).chr(169) => 'i',
				chr(196).chr(170) => 'I', chr(196).chr(171) => 'i',
				chr(196).chr(172) => 'I', chr(196).chr(173) => 'i',
				chr(196).chr(174) => 'I', chr(196).chr(175) => 'i',
				chr(196).chr(176) => 'I', chr(196).chr(177) => 'i',
				chr(196).chr(178) => 'IJ',chr(196).chr(179) => 'ij',
				chr(196).chr(180) => 'J', chr(196).chr(181) => 'j',
				chr(196).chr(182) => 'K', chr(196).chr(183) => 'k',
				chr(196).chr(184) => 'k', chr(196).chr(185) => 'L',
				chr(196).chr(186) => 'l', chr(196).chr(187) => 'L',
				chr(196).chr(188) => 'l', chr(196).chr(189) => 'L',
				chr(196).chr(190) => 'l', chr(196).chr(191) => 'L',
				chr(197).chr(128) => 'l', chr(197).chr(129) => 'L',
				chr(197).chr(130) => 'l', chr(197).chr(131) => 'N',
				chr(197).chr(132) => 'n', chr(197).chr(133) => 'N',
				chr(197).chr(134) => 'n', chr(197).chr(135) => 'N',
				chr(197).chr(136) => 'n', chr(197).chr(137) => 'N',
				chr(197).chr(138) => 'n', chr(197).chr(139) => 'N',
				chr(197).chr(140) => 'O', chr(197).chr(141) => 'o',
				chr(197).chr(142) => 'O', chr(197).chr(143) => 'o',
				chr(197).chr(144) => 'O', chr(197).chr(145) => 'o',
				chr(197).chr(146) => 'OE',chr(197).chr(147) => 'oe',
				chr(197).chr(148) => 'R',chr(197).chr(149) => 'r',
				chr(197).chr(150) => 'R',chr(197).chr(151) => 'r',
				chr(197).chr(152) => 'R',chr(197).chr(153) => 'r',
				chr(197).chr(154) => 'S',chr(197).chr(155) => 's',
				chr(197).chr(156) => 'S',chr(197).chr(157) => 's',
				chr(197).chr(158) => 'S',chr(197).chr(159) => 's',
				chr(197).chr(160) => 'S', chr(197).chr(161) => 's',
				chr(197).chr(162) => 'T', chr(197).chr(163) => 't',
				chr(197).chr(164) => 'T', chr(197).chr(165) => 't',
				chr(197).chr(166) => 'T', chr(197).chr(167) => 't',
				chr(197).chr(168) => 'U', chr(197).chr(169) => 'u',
				chr(197).chr(170) => 'U', chr(197).chr(171) => 'u',
				chr(197).chr(172) => 'U', chr(197).chr(173) => 'u',
				chr(197).chr(174) => 'U', chr(197).chr(175) => 'u',
				chr(197).chr(176) => 'U', chr(197).chr(177) => 'u',
				chr(197).chr(178) => 'U', chr(197).chr(179) => 'u',
				chr(197).chr(180) => 'W', chr(197).chr(181) => 'w',
				chr(197).chr(182) => 'Y', chr(197).chr(183) => 'y',
				chr(197).chr(184) => 'Y', chr(197).chr(185) => 'Z',
				chr(197).chr(186) => 'z', chr(197).chr(187) => 'Z',
				chr(197).chr(188) => 'z', chr(197).chr(189) => 'Z',
				chr(197).chr(190) => 'z', chr(197).chr(191) => 's',
				// Euro Sign
				chr(226).chr(130).chr(172) => 'E',
				// GBP (Pound) Sign
				chr(194).chr(163) => '');
		$string = strtr($string, $chars);
	} else {
		// Assume ISO-8859-1 if not UTF-8
		$chars['in'] = chr(128).chr(131).chr(138).chr(142).chr(154).chr(158)
		.chr(159).chr(162).chr(165).chr(181).chr(192).chr(193).chr(194)
		.chr(195).chr(196).chr(197).chr(199).chr(200).chr(201).chr(202)
		.chr(203).chr(204).chr(205).chr(206).chr(207).chr(209).chr(210)
		.chr(211).chr(212).chr(213).chr(214).chr(216).chr(217).chr(218)
		.chr(219).chr(220).chr(221).chr(224).chr(225).chr(226).chr(227)
		.chr(228).chr(229).chr(231).chr(232).chr(233).chr(234).chr(235)
		.chr(236).chr(237).chr(238).chr(239).chr(241).chr(242).chr(243)
		.chr(244).chr(245).chr(246).chr(248).chr(249).chr(250).chr(251)
		.chr(252).chr(253).chr(255);
		$chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";
		$string = strtr($string, $chars['in'], $chars['out']);
		$double_chars['in'] = array(chr(140), chr(156), chr(198), chr(208), chr(222), chr(223), chr(230), chr(240), chr(254));
		$double_chars['out'] = array('OE', 'oe', 'AE', 'DH', 'TH', 'ss', 'ae', 'dh', 'th');
		$string = str_replace($double_chars['in'], $double_chars['out'], $string);
	}
	return $string;
}
function removeCabecalhoMapfile($arq,$symbolset=true){
	if(!file_exists($arq)){
		return false;
	}
	$arq = str_replace(".map","",$arq).".map";
	$handle = fopen($arq, "r");
	if ($handle){
		$cabeca = array();
		if($symbolset){
			$cabeca[] = "MAP\n";
			//$final[] = "SYMBOLSET ../symbols/simbolos.sym\n";
			//$final[] = "FONTSET   ".'"'."../symbols/fontes.txt".'"'."\n";
		}
		$grava = false;
		while (!feof($handle)){
			$linha = fgets($handle);
			if($symbolset){
				if(strpos(strtoupper($linha),"SYMBOLSET") !== false){
					$cabeca[] = $linha;
				}
				if(strpos(strtoupper($linha),"FONTSET") !== false){
					$cabeca[] = $linha;
				}
			}
			if(strtoupper(trim($linha)) == "LAYER"){
				$grava = true;
			}
			if($grava){
				$final[] = rtrim($linha, "\r\n") . PHP_EOL;
			}
		}
		fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	if($handle !== false){
		//$testar = array("LEGENDAWMS","LEGENDAIMG","KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA","TRANSITIONEFFECT");
	    $testar = array(
	        "TEMPORIZADOR",
	        "PALLETESTEP",
	        "LTEMPOITEMIMAGEM",
	        "METAESTAT_ID_MEDIDA_VARIAVEL",
	        "GMOPACITY",
	        "GMSTATUS",
	        "ICONETEMA",
	        "LTEMPOITEMTITULO",
	        "DESCRIPTION_TEMPLATE",
	        "LTEMPOITEMLINK",
	        "TILES",
	        "METAESTAT_CODIGO_TIPO_REGIAO",
	        "ARQUIVOTEMAORIGINAL",
	        "PALLETEFILE",
	        "NOMEORIGINAL",
	        "OLSTATUS",
	        "PERMITEDOWNLOAD",
	        "LTEMPOFORMATODATA",
	        "FILTROORIGINAL",
	        "PERMITECOMENTARIO",
	        "LTEMPOITEMICONE",
	        "DATAORIGINAL",
	        "PLUGINI3GEO",
	        "METAESTAT",
	        "ITEMBUSCARAPIDA",
	        "ARQUIVODOWNLOAD",
	        "ARQUIVOKMZ",
	        "PERMITEKML",
	        "PERMITEOGC",
	        "CONVCARACTER",
	        "CORTEPIXELS",
	        "EDITORSQL",
	        "LTEMPOCONVENCODE",
	        "LTEMPOITEMFIM",
	        "OLOPACITY",
	        "LEGENDAWMS",
	        "LEGENDAIMG",
	        "KEYIMAGE",
	        "TILEINDEX",
	        "TILEITEM",
	        "SYMBOL",
	        "LABELITEM",
	        "FILTERITEM",
	        "GROUP",
	        "ENCODING",
	        "TIP",
	        "CLASSE",
	        "ITENSDESC",
	        "CLASSESNOME",
	        "ITENSLINK",
	        "ESCALA",
	        "CLASSESSIMBOLO",
	        "MENSAGEM",
	        "EXTENSAO",
	        "CLASSESITEM",
	        "ESCONDIDO",
	        "CLASSESCOR",
	        "DOWNLOAD",
	        "CLASSESTAMANHO",
	        "ITENS",
	        "TEMA",
	        "APLICAEXTENSAO",
	        "IDENTIFICA",
	        "TRANSITIONEFFECT",
	        "CONEXAOORIGINAL"
	    );
	    foreach ($final as $f){
			//
			//remove resultados em branco
			//e grava a linha
			//
			$teste = strtoupper($f);
			$teste = trim($teste);
			$teste = str_replace(array(" ","'",'"'),"",$teste);
			//$teste = str_replace("'","",$teste);
			//$teste = str_replace('"',"",$teste);
			$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
			$passou = true;
			foreach ($testar as $t)
			{
				if($teste == $t){
					$passou = false;
				}
			}
			if($passou == true){
				fwrite($handle,$f);
			}
		}
		fclose($handle);
		return true;
	}
	else{
		return false;
	}
}
function fileContemString($arq,$s){
	if(!file_exists($arq)){
		return false;
	}
	$handle = fopen($arq, 'r');
	$valid = false; // init as false
	while(! feof($handle)) {
		$buffer = fgets($handle);
		if (strpos($buffer, $s) !== false) {
			$valid = TRUE;
			break; // Once you find the string, you should break out the loop.
		}
	}
	fclose($handle);
	return $valid;
}
function limpaCacheImg($locaplic, $codigo, $cachedir, $dir_tmp){
	if(empty($dir_tmp)){
		return false;
	}
	$mapfile = $locaplic . "/temas/" . $codigo . ".map";
	if (! file_exists ( $mapfile )) {
		return false;
	}
	$mapa = ms_newMapObj ( $mapfile );
	$nomes = $mapa->getalllayernames ();
	if ($cachedir != "") {
		$d = $cachedir;
	} else {
		$d = $dir_tmp . "/cache";
	}
	foreach ( $nomes as $nome ) {
		$nome = str_replace ( ".", "", $nome );
		$nome = strip_tags ( $nome );
		$nome = htmlspecialchars ( $nome, ENT_QUOTES );
		$dirs [] = $d . "/" . $nome;
		$dirs [] = $d . "/googlemaps/" . $nome;
		$dirs [] = $d . "/wmts/" . $nome;
		foreach ( $dirs as $dir ) {
			\admin\php\funcoesAdmin\rrmdirImg ( $dir );
		}
	}
	$nome = $nomes[0];
	if(file_exists($d . "/" . $nome) || file_exists($d . "/googlemaps/" . $nome) || file_exists($d . "/wmts/" . $nome)){
		return false;
	} else {
		return true;
	}
}
function rrmdirImg($dir) {
	if (is_dir ( $dir )) {
		$objects = scandir ( $dir );
		foreach ( $objects as $object ) {
			if ($object != "." && $object != "..") {
				if (filetype ( $dir . "/" . $object ) == "dir") {
					\admin\php\funcoesAdmin\rrmdirImg ( $dir . "/" . $object );
				} else {
					$object = str_replace ( ".png", "", $object ) . ".png";
					$file_name = $dir . "/" . $object;
                    chmod ( realpath($file_name), 0777 );
                    unlink(realpath($file_name));
				}
			}
		}
		reset ( $objects );
	}
}
?>
