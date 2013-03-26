<?php
/**
 * Faz a compactacao dos codigos javascripts que sao usados para producao dos graficos
 * Compacta as bibliotecas do CCC2 e gera o arquivo ccc2sage.js
 *
 * @author Edmar Moretti
 *
 * Esse programa faz parte do pacote ccc2sage - veja licenca
 **/

echo "<pre>";

$originais = array(
"pvc/pvc.js",
"pvc/pvc.text.js",
"pvc/pvc.color.js",
"pvc/pvc.trends.js",
"pvc/pvc.options.js",
"pvc/data/_data.js",
"pvc/data/meta/DimensionType.js",
"pvc/data/meta/ComplexType.js",
"pvc/data/meta/ComplexTypeProject.js",
"pvc/data/translation/TranslationOper.js",
"pvc/data/translation/MatrixTranslationOper.js",
"pvc/data/translation/CrosstabTranslationOper.js",
"pvc/data/translation/RelationalTranslationOper.js",
"pvc/data/Atom.js",
"pvc/data/Complex.js",
"pvc/data/ComplexView.js",
"pvc/data/Datum.js",
"pvc/data/Dimension.js",
"pvc/data/Data.js",
"pvc/data/Data.selected.js",
"pvc/data/GroupingSpec.js",
"pvc/data/DataOper.js",
"pvc/data/GroupingOper.js",
"pvc/data/LinearInterpolationOper.js",
"pvc/data/LinearInterpolationOperSeriesState.js",
"pvc/data/ZeroInterpolationOper.js",
"pvc/data/ZeroInterpolationOperSeriesState.js",
"pvc/data/Data.operations.js",
"pvc/data/Data.compat.js",
"pvc/visual/Role.js",
"pvc/visual/Scene.js",
"pvc/visual/Var.js",
"pvc/visual/sign/BasicSign.js",
"pvc/visual/sign/Sign.js",
"pvc/visual/sign/Panel.js",
"pvc/visual/sign/Label.js",
"pvc/visual/sign/Dot.js",
"pvc/visual/sign/Line.js",
"pvc/visual/sign/Area.js",
"pvc/visual/sign/Bar.js",
"pvc/visual/sign/PieSlice.js",
"pvc/visual/sign/Rule.js",
"pvc/visual/Context.js",
"pvc/visual/OptionsBase.js",
"pvc/visual/Axis.js",
"pvc/visual/CartesianAxis.js",
"pvc/visual/CartesianAxisRootScene.js",
"pvc/visual/CartesianAxisTickScene.js",
"pvc/visual/CartesianFocusWindow.js",
"pvc/visual/ColorAxis.js",
"pvc/visual/SizeAxis.js",
"pvc/visual/Legend.js",
"pvc/visual/legend/BulletRootScene.js",
"pvc/visual/legend/BulletGroupScene.js",
"pvc/visual/legend/BulletItemScene.js",
"pvc/visual/legend/BulletItemSceneSelection.js",
"pvc/visual/legend/BulletItemSceneVisibility.js",
"pvc/visual/legend/BulletItemRenderer.js",
"pvc/visual/legend/BulletItemDefaultRenderer.js",
"pvc/visual/plot/Plot.js",
"pvc/visual/plot/CartesianPlot.js",
"pvc/visual/plot/CategoricalPlot.js",
"pvc/visual/plot/BarPlotAbstract.js",
"pvc/visual/plot/BarPlot.js",
"pvc/visual/plot/NormalizedBarPlot.js",
"pvc/visual/plot/WaterfallPlot.js",
"pvc/visual/plot/PointPlot.js",
"pvc/visual/plot/MetricXYPlot.js",
"pvc/visual/plot/MetricPointPlot.js",
"pvc/visual/plot/PiePlot.js",
"pvc/visual/plot/HeatGridPlot.js",
"pvc/visual/plot/BoxPlot.js",
"pvc/visual/plot/BulletPlot.js",
"pvc/pvcAbstract.js",
"pvc/pvcBaseChart.js",
"pvc/pvcBaseChart.visualRoles.js",
"pvc/pvcBaseChart.data.js",
"pvc/pvcBaseChart.plots.js",
"pvc/pvcBaseChart.axes.js",
"pvc/pvcBaseChart.panels.js",
"pvc/pvcBaseChart.selection.js",
"pvc/pvcBaseChart.extension.js",
"pvc/pvcBasePanel.js",
"pvc/pvcPlotPanel.js",
"pvc/pvcMultiChartPanel.js",
"pvc/pvcTitlePanelAbstract.js",
"pvc/pvcTitlePanel.js",
"pvc/pvcLegendPanel.js",
"pvc/pvcCartesianAbstract.js",
"pvc/pvcGridDockingPanel.js",
"pvc/pvcCartesianGridDockingPanel.js",
"pvc/pvcCartesianAbstractPanel.js",
"pvc/pvcPlotBgPanel.js",
"pvc/pvcCategoricalAbstract.js",
"pvc/pvcCategoricalAbstractPanel.js",
"pvc/pvcAxisPanel.js",
"pvc/pvcAxisTitlePanel.js",
"pvc/pvcPiePanel.js",
"pvc/pvcPieChart.js",
"pvc/pvcBarAbstractPanel.js",
"pvc/pvcBarAbstract.js",
"pvc/pvcBarPanel.js",
"pvc/pvcBarChart.js",
"pvc/pvcNormalizedBarPanel.js",
"pvc/pvcNormalizedBarChart.js",
"pvc/visual/legend/WaterfallBulletGroupScene.js",
"pvc/pvcWaterfallPanel.js",
"pvc/pvcWaterfallChart.js",
"pvc/pvcPointPanel.js",
"pvc/pvcPoint.js",
"pvc/pvcHeatGridPanel.js",
"pvc/pvcHeatGridChart.js",
"pvc/pvcMetricXYAbstract.js",
"pvc/data/translation/MetricPointChartTranslationOper.js",
"pvc/pvcMetricPointPanel.js",
"pvc/pvcMetricPoint.js",
"pvc/pvcBulletChart.js",
"pvc/pvcParallelCoordinates.js",
"pvc/pvcDataTree.js",
"pvc/data/translation/BoxplotChartTranslationOper.js",
"pvc/pvcBoxplotPanel.js",
"pvc/pvcBoxplotChart.js"
);
$jsfiles = array();
foreach($originais as $o){
	packer($o,"compacto/".basename($o),"Normal");
	$jsfiles[] = "compacto/".basename($o);
}
echo "<br><br>junta tudo<br>";

$buffer = "";
salvatudojs($jsfiles,$buffer,"ccc2sage.js","js");

function inicia($arquivo)
{
	$abre = fopen($arquivo, "r");
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$maparray[] = $buffer."kkkk";
	}
	fclose($abre);
	$c = compress(implode("",$maparray));
	$c = str_replace("kkkk","\n",$c);
	$c = str_replace("kkk","",$c);
	$c = str_replace(";\n",";",$c);
	$c = str_replace("{\n","{",$c);
	$c = str_replace("\n}","}",$c);
	$c = str_replace(")\n",")",$c);
	$c = str_replace(" \n","",$c);
	$c = str_replace("\n}","}\n",$c);
	return $c;
}
function compress($code)
{ // Remove multiline comment
$mlcomment = '/\/\*(?!-)[\x00-\xff]*?\*\//';
$code = preg_replace($mlcomment,"",$code);

// Remove single line comment
$slcomment = '/[^:]\/\/.*/';
$code = preg_replace($slcomment,"",$code);

// Remove extra spaces
$extra_space = '/\s+/';
$code = preg_replace($extra_space," ",$code);

// Remove spaces that can be removed
$removable_space = '/\s?([\{\};\=\(\)\\\/\+\*-])\s?/';
$code = preg_replace('/\s?([\{\};\=\(\)\/\+\*-])\s?/',"\\1",$code);
return $code;
}
function packer($src,$out,$tipo="None")
{
	if(file_exists($out))
	{unlink($out);}
	require_once '../packer/class.JavaScriptPacker.php';
	$script = file_get_contents($src);
	$script = str_replace("if(typeof(console)","//if(typeof(console)",$script);
	$t1 = microtime(true);
	$packer = new JavaScriptPacker($script, 0, true, false);
	$packed = $packer->pack();
	$t2 = microtime(true);
	$time = sprintf('%.4f', ($t2 - $t1) );
	echo 'script ', $src, ' packed in ' , $out, ', in ', $time, ' s.', "\n";
	file_put_contents($out, $packed);
	chmod($out,0777);
}
function salvatudojs($jsfiles,$buffer,$final,$tipo)
{
	//junta todos os js em um unico
	if(file_exists($final))
	{unlink($final);}
	foreach ($jsfiles as $f)
	{
		echo $f;
		$linhas = file($f);
		foreach($linhas as $linha){
			$linha = trim(preg_replace('#[\r\n]#', '', $linha));
			if($linha != "")
			{$buffer .= $linha."\n";}
		}
	}
	$abre = fopen($final, "wt");
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);
	chmod($final,0777);
}
?>
