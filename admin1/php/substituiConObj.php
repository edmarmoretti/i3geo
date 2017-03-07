<?php
//substituiu a palavra chave pela string de conexao com o banco de dados em um objeto map
function substituiConObj($mapa,$postgis_mapa){
	error_reporting(0);
	if (!empty($postgis_mapa)){
		$numlayers = $objMap->numlayers;
		for ($i=0;$i < $numlayers;++$i){
			$layer = $objMap->getlayer($i);
			if ($layer->connectiontype == MS_POSTGIS){
				$lcon = $layer->connection;
				if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))	{
					//
					//o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
					//
					if(($lcon == " ") || ($lcon == ""))	{
						$layer->set("connection",$postgis_mapa);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
					else{
						$layer->set("connection",$postgis_mapa[$lcon]);
						$layer->setmetadata("CONEXAOORIGINAL",$lcon);
					}
				}
			}
		}
	}
}
?>