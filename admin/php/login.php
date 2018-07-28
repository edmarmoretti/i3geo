<?php
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/funcoesAdmin.php");
//verifica se o login pode ser realizado
if ($i3geoPermiteLogin == false) {
	header ( "HTTP/1.1 403 Login desativado" );
	exit ();
}
// checa a lista branca de IPs
if (! empty ( $i3geoPermiteLoginIp )) {
    $ipaddress = '';
    if (getenv ( 'HTTP_CLIENT_IP' ))
        $ipaddress = getenv ( 'HTTP_CLIENT_IP' );
        else if (getenv ( 'HTTP_X_FORWARDED_FOR' ))
            $ipaddress = getenv ( 'HTTP_X_FORWARDED_FOR' );
            else if (getenv ( 'HTTP_X_FORWARDED' ))
                $ipaddress = getenv ( 'HTTP_X_FORWARDED' );
                else if (getenv ( 'HTTP_FORWARDED_FOR' ))
                    $ipaddress = getenv ( 'HTTP_FORWARDED_FOR' );
                    else if (getenv ( 'HTTP_FORWARDED' ))
                        $ipaddress = getenv ( 'HTTP_FORWARDED' );
                        else if (getenv ( 'REMOTE_ADDR' ))
                            $ipaddress = getenv ( 'REMOTE_ADDR' );
                            else
                                $ipaddress = 'UNKNOWN';
                                if (! in_array ( $ipaddress, $i3geoPermiteLoginIp )) {
                                    header ( "HTTP/1.1 403 Login nao permitido para o ip" );
                                    exit ();
                                }
}
if(!function_exists("cpjson")){
    include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
}
error_reporting(0);
session_write_close();
session_name("i3GeoLogin");
//se o usuario estiver tentando fazer login
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$funcao = $_POST["funcao"];
if(!empty($_POST["usuario"]) && !empty($_POST["senha"])){
    logoutUsuario();
	session_regenerate_id();
	$_SESSION = array();
	session_start();
	$funcao = "login";
	$_SESSION["locaplic"] = $locaplic;
	$_SESSION["conexaoadmin"] = $conexaoadmin;
	if($esquemaadmin != ""){
	   $_SESSION["esquemaadmin"] = str_replace(".","",$esquemaadmin).".";
	} else {
	    $_SESSION["esquemaadmin"] = "";
	}
}
else{//se nao, verifica se o login ja existe realmente
	if(!empty($_COOKIE["i3geocodigologin"])){
		session_id($_COOKIE["i3geocodigologin"]);
		session_start();
		if($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"]){
			logoutUsuario();
			header("Content-type: application/json");
			echo json_encode("logout");
			exit;
		}
	}
	else{//caso nao exista, retorna um erro
		logoutUsuario();
		header("Content-type: application/json");
		echo json_encode("erro");
	}
}

$retorno = "logout"; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	/*
	Valor: LOGIN

	Verifica usu&aacute;rio e senha e registra id da sessao que guarda o resultado.

	*/
	case "LOGIN":
	    error_log("admin/php/login.php",0);
	    $usuario = $_POST["usuario"];
		$senha = $_POST["senha"];
		$teste = autenticaUsuario($usuario,$senha,$dir_tmp,$i3geomaster);
		if($teste == "muitas tentativas"){
			logoutUsuario();
			header ( "HTTP/1.1 403 Muitas tentativas" );
			exit;
		}
		if($teste != false){
			$_SESSION["usuario"] = $usuario;
			$_SESSION["id_usuario"] = $teste["usuario"]["id_usuario"];
			$_SESSION["senha"] = $senha;
			$_SESSION["papeis"] = $teste["papeis"];
			$_SESSION["operacoes"] = $teste["operacoes"];
			$_SESSION["gruposusr"] = $teste["gruposusr"];
			$fingerprint = 'I3GEOLOGIN' . $_SERVER['HTTP_USER_AGENT'];
			//var_dump($_SESSION["operacoes"]);exit;
			$_SESSION['fingerprint'] = md5($fingerprint . session_id());
			$editor = "nao";
			foreach($_SESSION["papeis"] as $p){
				if($p < 3){
					$editor = "sim";
				}
			}
			$retorno = array("id"=>session_id(),"nome"=>$teste["usuario"]["nome_usuario"],"editor"=>$editor);
			header("Content-type: application/json");
			echo json_encode($retorno);
			exit;
		}
		else{
			logoutUsuario();
			header("Content-type: application/json");
			echo json_encode("logout");
			exit;
		}
	break;
	/*
	Valor: VALIDAOPERACAOUSUARIO

	Verifica se um usuario pode executar uma operacao

	Para que o usuario possa executar a operacao, o papel ao qual ele pertence deve estar registrado em operacoespaeis no banco de administracao

	Se $operacao for vazio, e retornado "sim", o que permite que a verificacao apenas confirme que o login esta correto na sessao

	Paremeter:

	$operacao - operacao que sera verificada
	*/
	case "VALIDAOPERACAOSESSAO":
		$retorno = "nao";
		if($_GET["operacao"] == ""){
			$retorno = "sim";
		}
		else{
			if(verificaOperacaoSessao($_GET["operacao"]) == true){
				$retorno = "sim";
			}
			else{
				//logoutUsuario();
				$retorno = "naopermitido";
			}
		}
		cpjson($retorno);
	break;
	/*
	Valor: ALTERARSENHA

	Altera a senha de um usuario

	Paremeter:

	$usuario

	$novasenha
	*/
	case "ALTERARSENHA":
		$retorno = false;
		if(!empty($_POST["usuario"]) && !empty($_POST["novaSenha"])){
			$retorno = alterarSenha($_POST["usuario"],$_POST["novaSenha"]);
		}
		logoutUsuario();
		header("Content-type: application/json");
		echo json_encode($retorno);
		exit;
	break;
}
function alterarSenha($usuario,$novaSenha){
	include(dirname(__FILE__)."/conexao.php");

	if(function_exists("password_hash")){
	    $novaSenha = password_hash($novaSenha, PASSWORD_DEFAULT);
	} else {
	    $novaSenha = md5($novaSenha);
	}
    $dados = array();
	//por causa das versoes antigas do PHP
    if(strlen($_SESSION["senha"]) == 32 || !function_exists("password_hash") ){
	    $dados = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geousr_usuarios where senha = '".md5($_SESSION["senha"])."' and login = '$usuario' and ativo = 1",$locaplic);
	}
	else{
	    $usuarios = \admin\php\funcoesAdmin\pegaDados("select senha,id_usuario,nome_usuario from ".$esquemaadmin."i3geousr_usuarios where login = '$usuario' and ativo = 1",$dbh,false);
	    if (count($usuarios) == 1 && password_verify($_SESSION["senha"],$usuarios[0]["senha"])){
	        $dados[] = array("id_usuario"=>$usuarios[0]["id_usuario"],"nome_usuario"=>$usuarios[0]["nome_usuario"]);
	    }
	}
	if(count($dados) > 0){
		$dbhw->query("UPDATE ".$esquemaadmin."i3geousr_usuarios SET senha='".$novaSenha."' WHERE login = '$usuario'");
		$_SESSION["senha"] = $novaSenha;
		$to      = $dados[0]["email"];
		$subject = 'nova senha i3geo';
		$message = "Sua senha foi alterada";
		if($to != ""){
		  mail($to, $subject, $message);
		}
		return true;
	}
	else{
		return false;
	}
}
function recuperarSenha($usuario){
	include(dirname(__FILE__)."/conexao.php");
	$novaSenha = rand(9000,1000000);
	if(function_exists("password_hash")){
	    $novaSenha = password_hash($novaSenha, PASSWORD_DEFAULT);
	} else {
	    $novaSenha = md5($novaSenha);
	}
	$dados = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geousr_usuarios where login = '$usuario' and ativo = 1",$locaplic);
	if(count($dados) > 0){
		$dbhw->query("UPDATE ".$esquemaadmin."i3geousr_usuarios SET senha='".$novaSenha."' WHERE login = '$usuario'");
		$to      = $dados[0]["email"];
		$subject = 'nova senha i3geo';
		$message = $novaSenha;
		//mail($to, $subject, $message);
		return true;
	}
	else{
		return false;
	}
}
//
//verifica se um determinado papel esta registrado na variavel SESSION
//
function verificaPapelSessao($id_papel){
	$resultado = false;
	if(validaSessao()){
		foreach($_SESSION["papeis"] as $p){
			if($p["id_papel"] == 1 || $p["id_papel"] == $id_papel){
				return true;
			}
		}
	}
	return $resultado;
}
//
//verifica se uma determinada operacao esta registrada na variavel SESSION
//
function verificaOperacaoSessao($operacao){
	$resultado = false;
	//a validacao consulta $_SESSION, que e definida no login
	if(validaSessao()){
		//verifica se e administrador, caso positivo, permite qq operacao
		foreach($_SESSION["papeis"] as $p){
			if($p == 1){
				return true;
			}
		}
		if(!empty($_SESSION["operacoes"][$operacao])){
			$resultado = true;
		}
	}
	return $resultado;
}
//
//verifica se o usuario esta logado
//
function validaSessao(){
	$fingerprint = 'I3GEOLOGIN' . $_SERVER['HTTP_USER_AGENT'];
	if($_SESSION['fingerprint'] != md5($fingerprint . session_id())){
		return false;
	}
	if($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"]){
		return false;
	}
	return true;
}
//
//faz a autenticacao de um usuario baseado no login e senha
//registra as operacoes, papeis e grupos do usuario na SESSION
//
function autenticaUsuario($usuario,$senha,$dir_tmp,$i3geomaster){
    include(dirname(__FILE__)."/conexao.php");
	error_reporting(0);
	$senhamd5 = md5($senha);
	if(function_exists("password_hash")){
		$senhaHash = password_hash($senha, PASSWORD_DEFAULT);
	}

	//faz um teste de tentativas de acesso
	$nomeArquivo = $dir_tmp."/a".md5($usuario."testeTentativas").intval(time() / 1000);
	if(!file_exists($dir_tmp)){
		return false;
	}
	if(file_exists($nomeArquivo)){
		$tentativas = (int) file_get_contents($nomeArquivo);
		if($tentativas > 3){
			return "muitas tentativas";
		}
		$tentativas = $tentativas + 1;
		file_put_contents($nomeArquivo, $tentativas);
	}
	else {
		file_put_contents($nomeArquivo, 1);
	}

	//verifica se o usuario esta cadastrado no ms_configura.php em $i3geomaster
	//echo "select * from ".$esquemaadmin."i3geousr_usuarios where login = '$usuario' and (senha = '$senhamd5' or senha = '$senha') and ativo = 1";exit;
	//exit;
	if(\admin\php\funcoesAdmin\verificaMaster($usuario,$senha,$i3geomaster) == true){
		//$pa = pegaDados("select * from ".$esquemaadmin."i3geousr_papelusuario ",$dbh,false);
	    error_log("verificaMaster OK",0);
	    $pa = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geousr_papeis ",$dbh,false);
	    $op = \admin\php\funcoesAdmin\pegadados("SELECT O.codigo FROM ".$esquemaadmin."i3geousr_operacoes AS O",$dbh,false);
	    $gr = \admin\php\funcoesAdmin\pegadados("SELECT * from ".$esquemaadmin."i3geousr_grupos ",$dbh,false);

		$operacoes = array();
		foreach($op as $o){
			$operacoes[$o["codigo"]] = true;
		}
		$papeis = array();
		foreach($pa as $p){
			$papeis[] = $p["id_papel"];
		}
		$gruposusr = array();
		foreach($gr as $p){
			$gruposusr[] = $p["id_grupo"];
		}
		$master = array();
		$master["id_usuario"] = "master";
		$master["nome_usuario"] = "master";
		$r = array("usuario"=>$master,"papeis"=>$papeis,"operacoes"=>$operacoes,"gruposusr"=>$gruposusr);
		$dbh = null;
		$dbhw = null;
		file_put_contents($nomeArquivo, 1);
		return $r;
	}
	else{
		//verifica se a senha e uma string ou pode ser um md5
		$ok = false;
		$dados = array();
		//por causa das versoes antigas do PHP
		if(strlen($senha) == 32 || !function_exists("password_hash") ){
		    $dados = \admin\php\funcoesAdmin\pegaDados("select senha,login,id_usuario,nome_usuario from ".$esquemaadmin."i3geousr_usuarios where login = '$usuario' and senha = '$senhamd5' and ativo = 1",$dbh,false);
			if(count($dados) == 1 && $dados[0]["senha"] == $senhamd5 && $dados[0]["login"] == $usuario){
				$ok = true;
			}
		}
		else{
		    $usuarios = \admin\php\funcoesAdmin\pegaDados("select senha,id_usuario,nome_usuario from ".$esquemaadmin."i3geousr_usuarios where login = '$usuario' and ativo = 1",$dbh,false);
			if (count($usuarios) == 1 && password_verify($senha,$usuarios[0]["senha"])){
				$ok = true;
				$dados[] = array("id_usuario"=>$usuarios[0]["id_usuario"],"nome_usuario"=>$usuarios[0]["nome_usuario"]);
			}
			$usuarios = null;
		}
		if($ok == true){
		    $pa = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geousr_papelusuario where id_usuario = ".$dados[0]["id_usuario"],$dbh,false);
		    $op = \admin\php\funcoesAdmin\pegadados("SELECT O.codigo, PU.id_usuario FROM ".$esquemaadmin."i3geousr_operacoes AS O JOIN ".$esquemaadmin."i3geousr_operacoespapeis AS OP ON O.id_operacao = OP.id_operacao JOIN ".$esquemaadmin."i3geousr_papelusuario AS PU ON OP.id_papel = PU.id_papel	WHERE id_usuario = ".$dados[0]["id_usuario"],$dbh,false);
		    $gr = \admin\php\funcoesAdmin\pegadados("SELECT * from ".$esquemaadmin."i3geousr_grupousuario where id_usuario = ".$dados[0]["id_usuario"],$dbh,false);
			$operacoes = array();
			foreach($op as $o){
				$operacoes[$o["codigo"]] = true;
			}
			$papeis = array();
			foreach($pa as $p){
				$papeis[] = $p["id_papel"];
			}
			$gruposusr = array();
			foreach($gr as $p){
				$gruposusr[] = $p["id_grupo"];
			}
			$r = array("usuario"=>$dados[0],"papeis"=>$papeis,"operacoes"=>$operacoes,"gruposusr"=>$gruposusr);
			$dbh = null;
			$dbhw = null;
			file_put_contents($nomeArquivo, 1);
			return $r;
		}
		else{
			$dbh = null;
			$dbhw = null;
			return false;
		}
	}
}
//
//faz o logout do usuario destruindo os cookies e session
//
function logoutUsuario(){
	$_COOKIE = array();
	$_SESSION = array();
	if(session_status() == PHP_SESSION_ACTIVE){
		session_destroy();
	}
}
?>
