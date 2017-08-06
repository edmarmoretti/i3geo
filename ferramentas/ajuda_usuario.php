<?php
$dicionario = file_get_contents("../js/dicionario_ajuda.json");
$dicionario = json_decode($dicionario,true);
echo json_encode($dicionario["dicionario_ajuda"]["ferramentas"][$_GET["idajuda"]]);
?>