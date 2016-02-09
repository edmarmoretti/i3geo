<?php
/*
Title: classe_estatistica.php

Gera c&aacute;lculos estat&iacute;sticos de uma s&eacute;rie de dados

Licenca:

GPL2


i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/classe_estatistica.php
*/
/*
Classe: estatistica
*/

class estatistica
{
	var $resultado;  //array com os calculos
	var $indice; //nomes dos indices calculados
/*
function: calcula

Executa c&aacute;lculos sobre um conjunto de dados

parameters:
$valores - array com os valores

return:
$resultado - valores de cada par&acirc;metro calculado

$indice - nome de cada par&acirc;metro
*/
	function calcula($valores)
	{
		$resultado['ocorrencias'] = count($valores);
		$indice['ocorrencias'] = "N&uacute;mero de valores";
		$resultado['min'] = min($valores);
		$indice['min'] = "M&iacute;nimo";
		$resultado['max'] = max($valores);
		$indice['max'] = "M&aacute;ximo";
		$resultado['soma'] = array_sum($valores);
		$indice['soma'] = "Soma";
		$resultado['intervalo'] = $resultado['max'] - $resultado['min'];
		$indice['intervalo'] = "Intervalo";
		$resultado['media'] = $resultado['soma'] / count($valores);
		$indice['media'] = "M&eacute;dia";
		//mediana
		$div2 = count($valores) / 2;
		$temparray = $valores;
		sort($temparray);
		reset($temparray);
		if (round($div2) == $div2) //o numero e par
		{
			$lugar = (count($valores))/2;
			$resultado['mediana'] = (($temparray[$lugar - 1]) + ($temparray[$lugar]))/2;
			$indice['mediana'] = "Mediana";
		}
		else
		{
			$lugar = ((count($valores))+1)/2;
			$resultado['mediana'] = $temparray[$lugar - 1];
			$indice['mediana'] = "Mediana";
		}
		//quartil
		$resultado['quartil2'] = $resultado['mediana'];
		$indice['quartil2'] = "Segundo quartil";
		foreach ($temparray as $temp)
		{if ($temp < $resultado['mediana']){$q1array[] = $temp;}}
		$div2 = count($q1array) / 2;
		if (round($div2) == $div2) //o n&uacute;mero &eacute; par
		{
			$lugar = (count($q1array))/2;
			$resultado['quartil1'] = (($q1array[$lugar - 1]) + ($q1array[$lugar]))/2;
			$indice['quartil1'] = "Primeiro quartil";
		}
		else
		{
			$lugar = ((count($q1array))+1)/2;
			$resultado['quartil1'] = $q1array[$lugar - 1];
			$indice['quartil1'] = "Primeiro quartil";
		}
		foreach ($temparray as $temp)
		{if ($temp > $resultado['mediana']){$q3array[] = $temp;}}
		$div2 = count($q3array) / 2;
		if (round($div2) == $div2) //o numero e par
		{
			$lugar = (count($q3array))/2;
			$resultado['quartil3'] = (($q3array[$lugar - 1]) + ($q3array[$lugar]))/2;
			$indice['quartil3'] = "Terceiro quartil";
		}
		else
		{
			$lugar = ((count($q3array))+1)/2;
			$resultado['quartil3'] = $q3array[$lugar - 1];
			$indice['quartil3'] = "Terceiro quartil";
		}
		//desvio medio
		$dmmedia = 0;
		$dmmediana = 0;
		foreach ($valores as $valor)
		{
			$dmmedia = (abs($valor - $resultado['media'])) + $dmmedia;
			$dmmediana = (abs($valor - $resultado['mediana'])) + $dmmediana;
		}
		$dmmedia = $dmmedia / count($valores);
		$dmmediana = $dmmediana / count($valores);
		$resultado['desviomediomediana'] = $dmmediana; //desvio medio mediana
		$indice['desviomediomediana'] = "Desvio m&eacute;dio - mediana";
		$resultado['desviomediomedia'] = $dmmedia; //desvio medio (media)
		$indice['desviomediomedia'] = "Desvio m&eacute;dio - m&eacute;dia";
		//desvio padrao
		$dpadrao = 0;
		foreach ($valores as $valor)
		{$dpadrao = (pow(($valor - $resultado['media']),2)) + $dpadrao;}
		$dpadrao = sqrt($dpadrao/(count($valores)));
		$resultado['desviopadrao'] = $dpadrao;
		$indice['desviopadrao'] = "Desvio padr&atilde;o";
		$resultado['cvq'] = (($resultado["quartil3"] - $resultado["quartil1"])/($resultado["quartil3"] + $resultado["quartil1"])) * 100;
		$indice['cvq'] = "Coeficiente quart&iacute;lico de varia&ccedil;&atilde;o ((Q3-Q1)(Q3+Q1))x100";
		$resultado['variancia'] = pow($dpadrao,2);
		$indice['variancia'] = "Vari&acirc;ncia";
		$resultado['desvioquartilico'] = ($resultado['quartil3'] - $resultado['quartil1']) / 2; //desvio quartil (Q3-Q1)/2
		$indice['desvioquartilico'] = "Desvio quartil (Q3-Q1)/2";
		$this->resultado = $resultado; //resultados dos calculos
		$this->indice = $indice; //nomes dos indices
	}
}
?>