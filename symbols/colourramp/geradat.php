<?php
exit;
echo "<pre>";
for($i=1;$i<23;$i++)
{
	if(file_exists($i.".dat"))
	{$arq = $i;}
	else
	{$arq = "0".$i;}
	//unserialize
	/*
		$handle = fopen ($arq.".cores", "r");
		$conteudo = fread ($handle, filesize ($arq.".cores"));
		fclose ($handle);
		var_dump(unserialize($conteudo));
	*/
	//serialize

	//echo $i.".dat";
	$handle = fopen ($i.".dat", "r");
	$linhas = array();
	$r = array();
	while (!feof ($handle)) {
    	$buffer = fgets($handle);
    	$buffer = str_replace("     "," ",$buffer);
    	$buffer = str_replace("    "," ",$buffer);
    	$buffer = str_replace("   "," ",$buffer);
    	$buffer = str_replace("  "," ",$buffer);
		$ts = explode(" ",$buffer);
		$linha = array();
		foreach ($ts as $t){
			if($t != ""){
				$linha[] = intval($t);
			}
		}
		//var_dump($linha);
		//if($linha[1])
		$r[$linha[0]] = array("r"=>$linha[1],"g"=>$linha[2],"b"=>$linha[3]);
		//if($linha[4])
		$r[$linha[4]] = array("r"=>$linha[5],"g"=>$linha[6],"b"=>$linha[7]);
		//if($linha[8])
		$r[$linha[8]] = array("r"=>$linha[9],"g"=>$linha[10],"b"=>$linha[11]);
		//if($linha[12])
		$r[$linha[12]] = array("r"=>$linha[13],"g"=>$linha[14],"b"=>$linha[15]);
	}
	fclose ($handle);
	rsort($r);
	array_pop($r);
	//var_dump($r);
	if (file_exists($arq.".cores"))
	{unlink($arq.".cores");}
	$rr = serialize($r);
	$fp = fopen($arq.".cores","w");
	fwrite($fp,$rr);
	fclose($fp);
	echo $arq.".cores<br>";
	$handle = fopen ($arq.".cores", "r");
	$conteudo = fread ($handle, filesize ($arq.".cores"));
	fclose ($handle);
	$cores = unserialize($conteudo);
	echo count($cores)."<br>";
}
	//var_dump($r);
?>