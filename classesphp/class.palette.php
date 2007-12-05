<?php
/*
Title: Degradê

About: Licença

Vladimir Guzmán
http://www.maintask.com
-----------------------
Este código es de uso absolutamente libre.
-----------------------
Adaptación del código de steve@slayeroffice.com
http://slayeroffice.com/tools/color_palette/
Basado a su vez en una idea de Andy Clarke:
http://www.stuffandnonsense.co.uk/archives/creating_colour_palettes.html

File: i3geo/classesphp/class.palette.php

19/6/2007
*/
/*
Class: palette

Gera um degradê de cores.
*/
class palette{

  protected $colors=array();  //Arreglo de colores por los cuales debe pasar la paleta
	/*
	Variable: $colorPath
	
	Array com os valores finais
	*/
  public $colorPath=array();  //Arreglo de colores finales de la paleta
	/*
	Variable: $colorRGB
	
	Array com os valores finais em RGB
	*/
  public $colorRGB=array();  //Arreglo de colores finales de la paleta em rgb
  protected $numSteps=10;
/*
Function: __construct

Cria o objeto palette 

parameters:

$colors - Array com as cores de início e fim de palette.

$numSteps - número de cores finais
*/
  public function __construct($colors=NULL,$numSteps=NULL){
    if($colors!=NULL) $this->colors=$colors;
    if($numSteps!=NULL) $this->numSteps=$numSteps;
    $this->generate();
  }

  public function generate(){
    if(sizeof($this->colors)<2) return(FALSE);
    $steps=floor($this->numSteps/(sizeof($this->colors)-1));
    $steps=ceil(($this->numSteps-sizeof($this->colors))/(sizeof($this->colors)-1))+1;
    for($i=0;$i<sizeof($this->colors)-1;$i++){
      $this->fade($this->colors[$i],$this->colors[$i+1],$steps);
    }
  }

  private function fade($from,$to,$steps){
    $from=$this->longHexToDec($from);
    if(sizeof($this->colorPath)==0) array_push($this->colorPath,$this->decToLongHex($from));
    $to=$this->longHexToDec($to);
    for($i=1;$i<$steps;$i++){
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
    for($i=0;$i<sizeof($this->colorPath);$i++){
      $string.="\t\t<td bgcolor=\"#" . $this->colorPath[$i] . "\">" . $this->colorPath[$i] . "</td>\n";
    }
    $string.="\t</tr>\n</table>\n";
    return($string);
  }
}
?>
