<?php
/*
Title: class.palette.php

About: Licen&ccedil;a

Vladimir Guzm&aacute;n
http://www.maintask.com
-----------------------
Este código es de uso absolutamente libre.
-----------------------
Adaptación del código de steve@slayeroffice.com
http://slayeroffice.com/tools/color_palette/
Basado a su vez en una idea de Andy Clarke:
http://www.stuffandnonsense.co.uk/archives/creating_colour_palettes.html

Arquivo:

i3geo/classesphp/class.palette.php

19/6/2007
*/
/*
Classe: palette

Gera um degrad&ecirc; de cores ou lista as peletes existentes.

As cores pr&eacute;-definidas s&atilde;o armazenadas em i3geo/symbols/colourramp

Os arquivos .cores correspondem a um array serializado contendo as cores tipo $cor[0] = array("r"=>,"g"=>,"b"=>)

Para cada arquivo existe um .gif com a imagem da palete
*/
class palette{

  protected $colors=array();  //Arreglo de colores por los cuales debe pasar la paleta
	/*
	Variavel: $colorPath

	Array com os valores finais
	*/
  public $colorPath=array();  //Arreglo de colores finales de la paleta
	/*
	Variavel: $colorRGB

	Array com os valores finais em RGB
	*/
  public $colorRGB=array();  //Arreglo de colores finales de la paleta em rgb
  protected $numSteps=10;
/*
Function: __construct

Cria o objeto palette

parameters:

$colors - Array com as cores de in&iacute;cio e fim de palette.

$numSteps - n&uacute;mero de cores finais
*/
  public function __construct($colors=NULL,$numSteps=NULL){
    if($colors!=NULL && is_array($colors))
	{$this->colors=$colors;}
    if($numSteps!=NULL)
	{$this->numSteps=$numSteps;}
    if($colors==NULL || is_array($colors))
	$this->generate();
  }

  public function generate(){
    if(sizeof($this->colors)<2) return(FALSE);
    $steps=floor($this->numSteps/(sizeof($this->colors)-1));
    $steps=ceil(($this->numSteps-sizeof($this->colors))/(sizeof($this->colors)-1))+1;
    for($i=0;$i<sizeof($this->colors)-1;++$i){
      $this->fade($this->colors[$i],$this->colors[$i+1],$steps);
    }
  }

  private function fade($from,$to,$steps){
    $from=$this->longHexToDec($from);
    if(sizeof($this->colorPath)==0) array_push($this->colorPath,$this->decToLongHex($from));
    $to=$this->longHexToDec($to);
    for($i=1;$i<$steps;++$i){
      $nColor=$this->setColorHue($from,$i/$steps,$to);
      if(sizeof($this->colorPath)<$this->numSteps)
      {
      	 array_push($this->colorPath,$this->decToLongHex($nColor));
      	 array_push($this->colorRGB,$this->longHexToDec($this->decToLongHex($nColor)));
      }
    }
    if(sizeof($this->colorPath)<$this->numSteps)
    {
    	array_push($this->colorPath,$this->decToLongHex($to));
    	array_push($this->colorRGB,$this->longHexToDec($this->decToLongHex($to)));
    }
  }

  private function longHexToDec($hex){
    $r=hexdec(substr($hex,0,2));
    $g=hexdec(substr($hex,2,2));
    $b=hexdec(substr($hex,4,2));
    return(array($r,$g,$b));
  }

  private function decToLongHex($rgb){
    $r = str_pad(dechex($rgb[0]), 2, '0', STR_PAD_LEFT);
    $g = str_pad(dechex($rgb[1]), 2, '0', STR_PAD_LEFT);
    $b = str_pad(dechex($rgb[2]), 2, '0', STR_PAD_LEFT);
    return($r . $g . $b);
  }

  private function setColorHue($originColor,$opacityPercent,$maskRGB) {
    $returnColor=array();
    for($w=0;$w<sizeof($originColor);$w++) $returnColor[$w] = floor($originColor[$w]*(1.0-$opacityPercent)) + round($maskRGB[$w]*($opacityPercent));
    return $returnColor;
  }

  public function printTest(){
    $string="<table border=\"1\">\n\t<tr>\n";
    for($i=0;$i<sizeof($this->colorPath);++$i){
      $string.="\t\t<td bgcolor=\"#" . $this->colorPath[$i] . "\">" . $this->colorPath[$i] . "</td>\n";
    }
    $string.="\t</tr>\n</table>\n";
    return($string);
  }

  public function listaColourRamps($locaplic){
	$arquivos = array();
	if ($dh = opendir($locaplic."/symbols/colourramp"))
	{
		while (($file = readdir($dh)) !== false)
		{
			if(!stristr($file, '.cores') === FALSE)
			{
				$arquivos[] = str_replace(".cores","",basename($file));
			}
		}
	}
	closedir($dh);
	return $arquivos;
  }
  public function geraCoresColourRamp($locaplic="",$codigo=1,$inicio=0,$fim=255,$ncores=0){
	//error_reporting(0);
	$arq = $locaplic."/symbols/colourramp/".$codigo.".cores";
	$handle = fopen ($arq, "r");
	$conteudo = fread ($handle, filesize ($arq));
	fclose ($handle);
	$cores = unserialize($conteudo);
	if(count($cores) < 250){
		$arq = $locaplic."/symbols/colourramp/".$codigo.".dat";
		$handle = fopen ($arq, "r");
		$linhas = array();
		$cores = array();
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
			$cores[$linha[0]] = array("r"=>$linha[1],"g"=>$linha[2],"b"=>$linha[3]);
			//if($linha[4])
			$cores[$linha[4]] = array("r"=>$linha[5],"g"=>$linha[6],"b"=>$linha[7]);
			//if($linha[8])
			$cores[$linha[8]] = array("r"=>$linha[9],"g"=>$linha[10],"b"=>$linha[11]);
			//if($linha[12])
			$cores[$linha[12]] = array("r"=>$linha[13],"g"=>$linha[14],"b"=>$linha[15]);
		}
		fclose ($handle);
		rsort($cores);
		array_pop($cores);
	}
	//echo count($cores);exit;
	if($ncores == 0)
	{return $cores;}
	$coresfinais = array();
	$p = intval(($fim - $inicio) / $ncores);
	for($i=$inicio;$i<=$fim;$i = $i + $p){
		if(count($coresfinais) < $ncores){
			if($cores[$i])
			$coresfinais[] = $cores[$i];
		}
	}
	return $coresfinais;
  }
}
?>
