<?php
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])){
	exit;
}

//error_reporting(0);
$bl = array("exec ","exec(","password","select","_decode","passthru","shell_exec","escapeshellarg","escapeshellcmd","proc_close","proc_open","popen","delete","drop","update","insert","system",";");
if (isset($_GET)){
	foreach(array_keys($_GET) as $k)	{
		$k = str_ireplace($bl,"",$k);
		$k = filter_var($k, FILTER_SANITIZE_STRING);
		if ($_GET[$k] != "''"){
			$v = strip_tags($_GET[$k]);
			$v = str_ireplace($bl,"",$v);
			$_GET[$k] = trim($v);
		}
	}
}
//array(3) { ["cpaint_function"]=> string(8) "criaMapa" ["cpaint_argument"]=> array(1) { [0]=> string(54) ""funcao=criaMapa&&desligar=mundo&interface=openlayers"" } ["cpaint_response_type"]=> string(4) "JSON" }
if (isset($_POST)){
	if (isset($_POST["cpaint_argument"]) && $_POST["cpaint_argument"][0] != "")
	{
		//var_dump( $_POST["cpaint_argument"]);exit;
		$argumento_ = $_POST["cpaint_argument"][0];
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
			//$argumento_ = str_replace("\\\"","",$argumento_);
            $argumento_ = str_replace("\"","",$argumento_);
		}
		else{
			$argumento_ = str_replace("\"","",$argumento_);
		}
		$argumento_ = explode('"',$argumento_);
		$argumento_ = implode("&",$argumento_);
		$parametros_ = explode("&",$argumento_);
		foreach($parametros_ as $parametro_){
			$p_ = explode("=",$parametro_);
			$parametro = $p_[0];
			$p_ = array_slice($p_, 1, count($p_));
			$valor_ = implode("=",$p_);
			if($parametro != ""){
				$valor_ = str_replace("'","*#*",$valor_);
				$valor_ = trim($valor_);
				$parametro = filter_var($parametro, FILTER_SANITIZE_STRING);
				$valor_ = filter_var($valor_, FILTER_SANITIZE_STRING);
				$_POST[$parametro] = str_replace('*#*',"'",$valor_);
			}
		}
	}
	else{
		foreach(array_keys($_POST) as $k){
			$k = str_ireplace($bl,"",$k);
			$k = filter_var($k, FILTER_SANITIZE_STRING);
			$_POST[$k] = str_ireplace($bl,"",$_POST[$k]);
			if (($_POST[$k] != "''")){
				$_POST[$k] = strip_tags(trim($_POST[$k]));
			}
		}
	}
}
?>