<?php
//para rodar, comente a linha abaixo
exit;
include("admin.php");
$dados = pegaDados("select * from ".$esquemaadmin."i3geoadmin_log");
//["serializedata"]=> string(96) "a:5:{i:0;s:22:"administrador do i3geo";i:1;s:10:"admingeral";i:2;s:0:"";i:3;s:1:"1";i:4;s:0:"";}" ["usuario"]=> string(5) "admin" ["ip"]=> string(9) "127.0.0.1" ["timestamp"]=> string(43) "1458610085(Mon, 21 Mar 2016 22:28:05 -0300)" ["outros"]=> string(0) "" } } 
foreach($dados as $d){
	echo "<b>id_log:</b> ".$d["id_log"]."<br> \n";
	echo "timestamp = ".$d["timestamp"] ."<br> \n";
	echo "usuario = ".$d["usuario"] ."<br> \n";
	echo "ip = ".$d["ip"] ."<br> \n";
	echo "sql = ".$d["sql"] ."<br> \n";
	echo "dados = '".implode("','",unserialize($d["serializedata"])) ."'<br> \n";
	echo "outros = ".$d["outros"] ."<br><br> \n";
}
?>