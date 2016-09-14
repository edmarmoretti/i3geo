<?php
function removeCabecalhoMapfile($arq,$symbolset=true){
	if(!file_exists($arq)){
		return false;
	}
	$arq = str_replace(".map","",$arq).".map";
	$handle = fopen($arq, "r");
	if ($handle){
		$cabeca = array();
		if($symbolset){
			$cabeca[] = "MAP\n";
			//$final[] = "SYMBOLSET ../symbols/simbolos.sym\n";
			//$final[] = "FONTSET   ".'"'."../symbols/fontes.txt".'"'."\n";
		}
		$grava = false;
		while (!feof($handle)){
			$linha = fgets($handle);
			if($symbolset){
				if(strpos(strtoupper($linha),"SYMBOLSET") !== false){
					$cabeca[] = $linha;
				}
				if(strpos(strtoupper($linha),"FONTSET") !== false){
					$cabeca[] = $linha;
				}
			}
			if(strtoupper(trim($linha)) == "LAYER"){
				$grava = true;
			}
			if($grava){
				$final[] = rtrim($linha, "\r\n") . PHP_EOL;
			}
		}
		fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	if($handle !== false){
		$testar = array("LEGENDAWMS","LEGENDAIMG","KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA","TRANSITIONEFFECT");
		foreach ($final as $f){
			//
			//remove resultados em branco
			//e grava a linha
			//
			$teste = strtoupper($f);
			$teste = trim($teste);
			$teste = str_replace(array(" ","'",'"'),"",$teste);
			//$teste = str_replace("'","",$teste);
			//$teste = str_replace('"',"",$teste);
			$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
			$passou = true;
			foreach ($testar as $t)
			{
				if($teste == $t){
					$passou = false;
				}
			}
			if($passou == true){
				fwrite($handle,$f);
			}
		}
		fclose($handle);
		return true;
	}
	else{
		return false;
	}
}
?>