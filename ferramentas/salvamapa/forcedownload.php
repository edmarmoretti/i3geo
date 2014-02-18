<?php
//forca o download de um arquivo
include("../../ms_configura.php");
$f = $_GET['file'];
$fName = basename($f);
$d1 = basename(dirname($f));
$fd = $dir_tmp."/".$d1."/".$fName;
$fp = fopen($fd, 'rb');
header("Content-Type:text/plain");
header('Content-Disposition: attachment; filename="'.$fName.'"');
fpassthru($fp);
?>
