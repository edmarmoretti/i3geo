<?php

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit;
}

//error_reporting(0);
$bl = array("exec ","exec(","password","select","_decode","passthru","shell_exec","escapeshellarg","escapeshellcmd","proc_close","proc_open","popen","delete","drop","update","insert","system",";");
if (isset($_GET)) {
    foreach (array_keys($_GET) as $k) {
        $k = str_ireplace($bl, "", $k);
        $k = filter_var($k, FILTER_SANITIZE_STRING);
        if ($_GET[$k] != "''") {
            $v = strip_tags($_GET[$k]);
            $v = str_ireplace($bl, "", $v);
            $_GET[$k] = trim($v);
        }
    }
}
if (isset($_POST)) {
    foreach (array_keys($_POST) as $k) {
        $k = str_ireplace($bl, "", $k);
        $k = filter_var($k, FILTER_SANITIZE_STRING);
        $_POST[$k] = str_ireplace($bl, "", $_POST[$k]);
        if (($_POST[$k] != "''")) {
            $_POST[$k] = strip_tags(trim($_POST[$k]));
        }
    }
}
