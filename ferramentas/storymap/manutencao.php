<?php
include_once(dirname(__FILE__)."/../inicia.php");
include_once(dirname(__FILE__)."/../../admin/php/login.php");
$funcoesEdicao = array(
		"REMOVE",
		"INCLUI"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/editormapfile") == false){
		retornaJSON("Vc nao pode realizar essa operacao. Tente fazer login novamente.");exit;
	}
}
error_reporting(0);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "REMOVE":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata("storymap","");
			$mapa->save($map_file);
		}
		$arq = $locaplic."/temas/".$tema.".map";
		if(file_exists($arq)){
			$mapa = ms_newMapObj($arq);
			$l = $mapa->getlayerbyname($tema);
			if($l != ""){
				$l->setmetadata("storymap","");
				$mapa->save($arq);
				removeCabecalho($arq);
			}
		}
		$retorno = "ok";
	break;
	case "INCLUI":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata("storymap",base64_decode($storymap));
			$mapa->save($map_file);
		}
		$arq = $locaplic."/temas/".$tema.".map";
		if(file_exists($arq)){
			$mapa = ms_newMapObj($arq);
			$l = $mapa->getlayerbyname($tema);
			if($l != ""){
				$l->setmetadata("storymap",base64_decode($storymap));
				$mapa->save($arq);
				removeCabecalho($arq);
			}
		}
		$retorno = "ok";
	break;
}
cpjson($retorno);
//TODO colocar essa funcao em algum lugar que permita reaproveitamento
function removeCabecalho($arq,$symbolset=true)
{
	$handle = fopen($arq, "r");
	if ($handle)
	{
		$cabeca = array();
		if($symbolset)
		{
			$cabeca[] = "MAP\n";
		}
		$grava = false;
		while (!feof($handle))
		{
			$linha = fgets($handle);
			if($symbolset)
			{
				if(strpos(strtoupper($linha),"SYMBOLSET") !== false)
				{
					$cabeca[] = $linha;
				}
				if(strpos(strtoupper($linha),"FONTSET") !== false)
				{
					$cabeca[] = $linha;
				}
			}
			if(strtoupper(trim($linha)) == "LAYER")
			{
				$grava = true;
			}
			if($grava)
			{
				$final[] = rtrim($linha, "\r\n") . PHP_EOL;
			}
		}
		fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	foreach ($final as $f)
	{
		//
		//remove resultados em branco
		//e grava a linha
		//
		$teste = strtoupper($f);
		$teste = trim($teste);
		$teste = str_replace(" ","",$teste);
		$teste = str_replace("'","",$teste);
		$teste = str_replace('"',"",$teste);
		$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
		$testar = array("KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA");
		$passou = true;
		foreach ($testar as $t)
		{
			if($teste == $t){
				$passou = false;
			}
		}
		if($passou)
			fwrite($handle,$f);
	}
	fclose($handle);
	chmod($arq, 0666);
}
?>