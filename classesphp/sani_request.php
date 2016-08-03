<?php
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])){
	exit;
}
error_reporting(0);
$bl = array("_decode","php","eval","passthru","shell_exec","escapeshellarg","escapeshellcmd","proc_close","proc_open","dl","popen","contents","delete","drop","update","insert","exec","system",";");
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
if (isset($_POST)){
	foreach(array_keys($_POST) as $k){
		$k = str_ireplace($bl,"",$k);
		$k = filter_var($k, FILTER_SANITIZE_STRING);
		$_POST[$k] = str_ireplace($bl,"",$_POST[$k]);
		if (($_POST[$k] != "''")){
			$_POST[$k] = strip_tags(trim($_POST[$k]));
		}

		if (($_POST[$k] != "''") && ($k == "cpaint_argument"))
		{
			foreach($_POST["cpaint_argument"] as $argumento_)
			{
				if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
				{$argumento_ = str_replace("\\\"","",$argumento_);}
				else
				{$argumento_ = str_replace("\"","",$argumento_);}
				$argumento_ = explode('"',$argumento_);
				$argumento_ = implode("&",$argumento_);
				$parametros_ = explode("&",$argumento_);
				foreach($parametros_ as $parametro_)
				{
					$p_ = explode("=",$parametro_);
					$parametro = $p_[0];
					$p_ = array_slice($p_, 1, count($p_));
					$valor_ = implode("=",$p_);
					if($parametro != ""){
						$valor_ = str_replace("'","*#*",$valor_);
						$valor_ = trim($valor_);
						$parametro = filter_var($parametro, FILTER_SANITIZE_STRING);
						$valor = filter_var($valor, FILTER_SANITIZE_STRING);
						$_POST[$parametro] = str_replace('*#*',"'",$valor_);
						//eval("\$".$parametro."='".(trim($valor_))."';");
						//eval("\$".$parametro."=str_replace('*#*','\'',\$".$parametro.");");
					}
				}
			}
		}
	}
}
?>