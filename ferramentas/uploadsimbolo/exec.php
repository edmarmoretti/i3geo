<?php
include(dirname(__FILE__)."/../safe.php");
include_once(dirname(__FILE__)."/../../admin/php/login.php");
if(verificaOperacaoSessao("admin/html/subirshapefile") == false){
	echo "Vc nao pode realizar essa operacao.";exit;
}
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "NOMEPASTA":
		$locaplic = basename($locaplic);
		$retorno = $locaplic."/temas";
		if($customDir != "interface"){
			$teste = $locaplic."/".$customDir;
			if(file_exists($teste)){
				$retorno = $teste;
			}
			$teste = $locaplic."/".$customDir."/images";
			if(file_exists($teste)){
				$retorno = $teste;
			}
			$teste = $locaplic."/".$customDir."/imagens";
			if(file_exists($teste)){
				$retorno = $teste;
			}
		}
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);

?>