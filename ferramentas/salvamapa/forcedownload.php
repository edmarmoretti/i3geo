<?php
//forca o download de um arquivo
$fName = basename($_GET['file']);
header("Content-Type:text/plain");
header('Content-Disposition: attachment; filename="'.$fName.'"');

fpassthru($fName);
?>