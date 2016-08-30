<?php
//
//bloqueia o funcionamento de uma ferramenta com base
//no conteudo da variavel $i3geoBlFerramentas
//
function verificaBlFerramentas($dir,$i3geoBlFerramentas="",$js=true){
	if($i3geoBlFerramentas == ""){
		include_once(dirname(__FILE__)."/../ms_configura.php");
	}
	if(!empty($i3geoBlFerramentas)){
		if(in_array($dir,$i3geoBlFerramentas) == true){
			if($js != true){
				header ( "HTTP/1.1 403 operacao nao permitida" );
			} else {
				echo "alert('operacao nao permitida');";
			}
			exit;
		}
	}
}
?>