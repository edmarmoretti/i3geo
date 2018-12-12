<?php
/*
Title: graficos.php

Fun&ccedil;&otilde;es de representa&ccedil;&atilde;o gr&aacute;fica de dados com o software R.
Gera scripts na linguagem R para ser executados como CGI.

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

i3geo/classesphp/graficos.php
*/
/*
* Gera gr&aacute;fico de pizza.
*/
function graficoPizza()
{
	global $cp,$map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $percentual,$nome,$margem,$margemexterna,$margeminterna,$border,$las,$radius,$lwd,$lty,$fontsub,$fontmain,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$fg,$colmain,$font,$cex,$nval,$main,$cexmain,$sub,$cexsub;
	//error_reporting(0);
	//gera os nomes dos arquivos com os dados
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual,"",false);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath);
	$rcode[] =  'valores=read.table("'.$nome.'",header=TRUE,sep=";")';
	$rcode[] =  'attach(valores)';
	$parametros = 'border='.$border.',radius='.$radius.',lty='.$lty.',font.sub='.$fontsub.',font.main='.$fontmain.',pty="m",font='.$font.',col.main='.$colmain.',cex='.$cex.',col=terrain.colors(NROW(x)),cex.main='.$cexmain.',cex.sub='.$cexsub;
	if ($main != "")
	{$parametros .= ',main="'.$main.'"';}
	if ($sub != "")
	{$parametros .= ',sub="'.$sub.'"';}
	$rcode[] = 'pie(x,n,'.$parametros.')';
	$rcode[]='close.screen(all = TRUE)';
	$rcode[] = 'dev.off()';
	//print_r(implode("\n",$rcode));
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	$cp->set_data($url.$gfile_name.".png,".$url.(basename($nome)).",".$nome);
}
/**
* Gera gr&aacute;fico de barras.
*/
function graficoBarras()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $setasdv,$percentual,$nome,$margem,$margemexterna,$margeminterna,$grid,$border,$cexaxis,$las,$space,$lwd,$fontlab,$collab,$cexlab,$xlab,$ylab,$fontsub,$fontmain,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$fg,$colmain,$font,$main,$cexmain,$sub,$cexsub;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual,"",false);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath);
	$rcode[] =  'valores=read.table("'.$nome.'",header=TRUE,sep=";")';
	$rcode[] =  'attach(valores)';
	$rcode[] = 'names(x)= n';
	$parametros = 'border='.$border.',cex.names='.$cexaxis.',las='.$las.',space='.$space.',font.lab='.$fontlab.',col.lab='.$collab.',cex.lab='.$cexlab.',font.sub='.$fontsub.',font.main='.$fontmain.',pty="m",font='.$font.',col.main='.$colmain.',col=terrain.colors(NROW(x)),cex.main='.$cexmain.',cex.sub='.$cexsub;
	if ($ylab != "")
	{$parametros .= ',ylab="'.$ylab.'"';}
	if ($xlab != "")
	{$parametros .= ',xlab="'.$xlab.'"';}
	if ($main != "")
	{$parametros .= ',main="'.$main.'"';}
	if ($sub != "")
	{$parametros .= ',sub="'.$sub.'"';}
	//$rcode[] = 'par(bg='.$bg.')';
	$rcode[] = 'bar <- barplot(x,'.$parametros.',axes=FALSE)';
	if ($setasdv == "TRUE")
	{
		$rcode[] = "stdev <- x/5; arrows(bar, x, bar, x + stdev, length=0.15, angle = 90)";
		$rcode[] = "arrows(bar, x, bar, x + -(stdev), length=0.15, angle = 90)";
	}
	if ($grid == "TRUE")
	$rcode[] = "grid()";
	$rcode[] = 'abline(h = 0, lty = 1, col = "black", lwd = 1)';
	$rcode[] = 'abline(h = (max(x)/2), lty = 2, col = "gray", lwd = 1)';
	$rcode[] = "axis(2, at=seq(0,max(x),max(x)/10),cex.axis=".$cexaxis.")";
	$rcode[]='close.screen(all = TRUE)';
	$rcode[] = 'dev.off()';
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	return($url.$gfile_name.".png,".$url.(basename($nome)).",".$nome);
}
/**
* Gera gr&aacute;fico de histograma.
*/
function graficoHist()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $densidade,$percentual,$nome,$margem,$margemexterna,$margeminterna,$corbarras,$grid,$breaks,$border,$cexaxis,$las,$lwd,$fontlab,$collab,$cexlab,$xlab,$ylab,$fontsub,$fontmain,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$fg,$colmain,$font,$main,$cexmain,$sub,$cexsub;
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$itemvalores = $itemclasses;
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual,"",false);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath);
	$rcode[] =  'valores=read.table("'.$nome.'",header=TRUE,sep=";")';
	$rcode[] =  'attach(valores)';
	$parametros = 'cex.axis='.$cexaxis.',breaks='.$breaks.',border='.$border.',las='.$las.',lwd='.$lwd.',font.lab='.$fontlab.',col.lab='.$collab.',cex.lab='.$cexlab.',font.sub='.$fontsub.',font.main='.$fontmain.',pty="m",font='.$font.',col.main='.$colmain.',cex.main='.$cexmain.',cex.sub='.$cexsub;
	if ($ylab != "")
	{$parametros .= ',ylab="'.$ylab.'"';}
	if ($xlab != "")
	{$parametros .= ',xlab="'.$xlab.'"';}
	if ($main != "")
	{$parametros .= ',main="'.$main.'"';}
	if ($sub != "")
	{$parametros .= ',sub="'.$sub.'"';}
	if ($densidade == "TRUE")
	{$rcode[] = 'hist(x,'.$parametros.',freq=F,col="'.$corbarras.'")';}
	else
	{$rcode[] = 'hist(x,'.$parametros.',freq=T,col="'.$corbarras.'")';}
	$rcode[] = 'abline(h = 0, lty = 1, col = "black", lwd = 1)';
	$rcode[] = "axis(2,cex.axis=".$cexaxis.")";
	if ($grid == "TRUE")
	$rcode[] = "grid()";
	$rcode[] = "rug(x,col='gray')";
	if ($densidade == "TRUE")
	{$rcode[] = "curve(dnorm(x, mean = mean(x), sd = sd(x)),add=TRUE,col='red')";}
	$rcode[]='close.screen(all = TRUE)';
	$rcode[] = 'dev.off()';
	//echo implode("\n",$rcode);
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	return($url.$gfile_name.".png,".$url.(basename($nome)).",".$nome);
}
/**
* Gera gr&aacute;fico de linhas.
*/
function graficoLinhas()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $percentual,$nome,$margem,$margemexterna,$margeminterna,$xlab,$ylab,$grid,$ppontos,$spline,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$nome;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual,"",false);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath);
	$rcode[] =  'valores=read.table("'.$nome.'",header=TRUE,sep=";")';
	$rcode[] =  'attach(valores)';
	$rcode[] = 'names(x)= n';
	$parametros = 'col.lab='.$collab.',col.axis='.$colaxis.',cex.lab='.$cexlab.',cex.axis='.$cexaxis.',font.lab='.$fontlab.',las='.$las.',tck='.$tck.',cex.main='.$cexmain;
	$rcode[] = 'par(pty="s")';
	$rcode[] = 'plot(x,'.$parametros.', type = "n", axes = FALSE, ann = FALSE)';
	if ($grid == "TRUE")
	$rcode[] = "grid()";
	if ($spline=="FALSE")
	{$rcode[] = 'lines(x,col='.$border.',lty='.$lty.',lwd='.$lwd.')';}
	else
	{$rcode[] = 'lines(spline(x),col='.$border.',lty='.$lty.',lwd='.$lwd.')';}
	if ($ppontos=="TRUE")
	{$rcode[] = 'points(x, pch ="'.$pch.'", bg = "light grey", cex ='.$tpt.')';}
	$rcode[] = "axis(2,lines=NA)";
	$rcode[] = 'axis(1, lines=NA)';
	$rcode[] = 'box()';
	$rcode[] = 'title(xlab = "'.$xlab.'")';
	$rcode[] = 'title(ylab = "'.$ylab.'")';
	$rcode[] = 'title(main = "'.$main.'",col.main='.$colmain.',font.main='.$fontmain.')';
	$rcode[]='close.screen(all = TRUE)';
	$rcode[] = 'dev.off()';
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	return($url.$gfile_name.".png,".$url.(basename($nome)).",".$nome);
}
/**
* Gera gr&aacute;fico de distribui&ccedil;&atilde;o de pontos (scatter).
*/
function graficoScatter()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $percentual,$nome,$margem,$margemexterna,$margeminterna,$corlinha,$grid,$ppontos,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$ylab,$xlab;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,"xy",$percentual,"",false);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath);
	$rcode[] =  'valores=read.table("'.$nome.'",header=TRUE,sep=";")';
	$rcode[] =  'attach(valores)';
	$parametros = 'pty="m",main = "'.$main.'",col.main='.$colmain.',font.main='.$fontmain.',ylab = "'.$ylab.'",xlab = "'.$xlab.'",cex ='.$tpt.',pch ="'.$pch.'",lty='.$lty.',lwd='.$lwd.',col.lab='.$collab.',col.axis='.$colaxis.',cex.lab='.$cexlab.',cex.axis='.$cexaxis.',font.lab='.$fontlab.',las='.$las.',tck='.$tck.',cex.main='.$cexmain;
	$rcode[] = 'par(pty="s",'.$parametros.')';
	$rcode[] = 'plot(x,y,'.$parametros.')';
	$rcode[] = 'abline(lm(y ~ x),col='.$corlinha.',lwd='.$lwd.')';
	$rcode[]='close.screen(all = TRUE)';
	$rcode[] = 'dev.off()';
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	return ($url.$gfile_name.".png,".$url.(basename($nome)).",".$nome);
}
/**
* Gera gr&aacute;fico de distribui&ccedil;&atilde;o de pontos (scatter) com agrupamento em pixels.
*/
function graficoScatterBins()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $plota3d,$nbins,$percentual,$nome,$margem,$margemexterna,$margeminterna,$corlinha,$grid,$ppontos,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$ylab,$xlab;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,"xy",$percentual,"",false);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath);
	$rcode[] =  'valores=read.table("'.$nome.'",header=TRUE,sep=";")';
	$rcode[] =  'attach(valores)';
	$rcode[] = 'library(gplots)';
	$parametros = 'pty="m",main = "'.$main.'",col.main='.$colmain.',font.main='.$fontmain.',ylab = "'.$ylab.'",xlab = "'.$xlab.'",cex ='.$tpt.',pch ="'.$pch.'",lty='.$lty.',lwd='.$lwd.',col.lab='.$collab.',col.axis='.$colaxis.',cex.lab='.$cexlab.',cex.axis='.$cexaxis.',font.lab='.$fontlab.',las='.$las.',tck='.$tck.',cex.main='.$cexmain;
	if($plota3d == "FALSE")
	{
		$rcode[] = "hist2d(x,y, nbins=".$nbins.", col = c('white',heat.colors(16)),".$parametros.")";
		$rcode[] = "rug(x,side=1)";
		$rcode[] = "rug(y,side=2)";
		$rcode[] = "grid()";
		$rcode[] = "box()";
	}
	else
	{
		$rcode[] = "h2d <- hist2d(x,y,show=FALSE, same.scale=TRUE, nbins=".$nbins.")";
		$rcode[] = 'persp( h2d$x, h2d$y, h2d$counts,ticktype="detailed", theta=30, phi=30,expand=0.5, shade=0.5, col="cyan", ltheta=-30,'.$parametros.')';
	}
	$rcode[]='close.screen(all = TRUE)';
	$rcode[] = 'dev.off()';
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	return($url.$gfile_name.".png,".$url.(basename($nome)).",".$nome);
}

/**
* Gera gr&aacute;fico de estrelas.
*/
function graficoEstrela()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path,$R_libpath;
	global $font,$cex,$grid,$ppontos,$locaplic,$dir_tmp,$w,$h,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$ylab,$xlab;
	//pega os valores
	$map = ms_newMapObj($map_file);
	$layer = $map->getLayerByName($tema);
	if ($exclui == ""){$exclui = "nulo";}
	$dados[] = "x";
	foreach (explode(",",$itemclasses) as $i)
	{$dados = array_merge($dados,pegaValoresM($map,$layer,array($i),$exclui));}
	$nval = count($dados);
	if ($nval == 0){$cp->set_data("erro");return;}
	$dir = dirname(dirname($map_file));
	$nomeV = $dir."/".nomeRandomico(20);
	gravaDados($dados,$nomeV);
	$numcol = count(explode(",",$itemclasses));
	$numrow = $nval / $numcol;
	$graf = "png";
	if (strtoupper(substr(PHP_OS, 0, 3) != 'WIN'))
	{
		$graf = "bitmap";
		$h = $h / $res;
		$w = $w / $res;
	}
	$gfile_name = nomeRandomico(20);
	$rcode[] = $graf.'(file="'.$dir_tmp."/".$gfile_name.'.png",height = '.$h.', width = '.$w.', res = '.$res.', type = "png16m"))';
	$rcode[] =  'valores=read.table("'.$nomeV.'",sep=",",header=TRUE)';
	$rcode[] =  'attach(valores)';
	$rcode[] = 'mx = matrix(x, ncol = '.$numrow.', nrow = '.$numcol.', byrow = TRUE, dimnames = NULL)';
	//$parametros = 'pty="m",scale=FALSE,full=FALSE,key.loc = c ('.$w.',0),key.labels='.$itemvalores.',lty='.$lty.',font='.$font.',col.main='.$colmain.',cex='.$cex.',main="'.$main.'",cex.main='.$cexmain;
	$parametros = 'pty="m",scale=FALSE,full=FALSE,key.loc = c ('.$w.',0),lty='.$lty.',font='.$font.',col.main='.$colmain.',cex='.$cex.',main="'.$main.'",cex.main='.$cexmain;
	$rcode[] = 'par(bg='.$bg.')';
	$rcode[] = 'palette(rainbow(12, s = 0.6, v = 0.75))';
	//$rcode[] = 'stars(radius=FALSE,len=0.8,mx,draw.segments = TRUE,labels = '.$itemvalores.','.$parametros.')'; // full = TRUE, scale = TRUE, radius = TRUE,labels = NULL)';
	$rcode[] = 'stars(radius=FALSE,len=0.8,mx,draw.segments = TRUE,'.$parametros.')'; // full = TRUE, scale = TRUE, radius = TRUE,labels = NULL)';
	$rcode[] = 'dev.off()';
	$r = executaR($rcode,$dir_tmp,$R_path);
	$map = ms_newMapObj($map_file);
	$webo = $map->web;
	$url = dirname($webo->imageurl)."/";
	return($url.$gfile_name.".png,".$url.(basename($nomeV)));
}
function iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic,$R_libpath)
{
	$lib = '.libPaths("'.$R_libpath.'")';
	/*
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{$lib = '.libPaths("'.$locaplic.'/pacotes/rlib/win")';}
	else
	{
		if(file_exists($locaplic."/pacotes/rlib/linux"))
		$lib = '.libPaths("'.$locaplic.'/pacotes/rlib/linux")';
	}
	*/
	$rcode[] = $lib;
	$graf = "png";
	if (strtoupper(substr(PHP_OS, 0, 3) != 'WIN'))
	{
		$graf = "bitmap";
		$gh = ($gh / $res);
		$gw = ($gw / $res);
	}
	if (strtoupper(substr(PHP_OS, 0, 3) != 'WIN'))
	{$rcode[] = $graf.'(file="'.$dir_tmp."/".$gfile_name.'.png",height = '.$gh.', width = '.$gw.', res = '.$res.', type = "png16m")';}
	else
	{$rcode[] = $graf.'(file="'.$dir_tmp."/".$gfile_name.'.png",height = '.$gh.', width = '.$gw.', res = '.$res.')';}
	$rcode[] = 'split.screen(c(1,1))';
	if ($margem == "TRUE")
	{
		if (strtoupper(substr(PHP_OS, 0, 3) != 'WIN'))
		{$rcode[] = 'par(fin=c('.($gw-(0.1)).','.($gh-(0.1)).'),xpd=TRUE)';}
		else
		{$rcode[] = 'par(xpd=TRUE)';}
		$rcode[] = 'rect(-1, -1, 2, 2, col='.$margemexterna.')';
		$rcode[] = 'box("figure")';
		$rcode[] = 'par(xpd=FALSE)';
		$rcode[] = 'rect(-1, -1, 2, 2, col='.$margeminterna.')';
		$rcode[] = 'box("plot", lty="dashed")';
	}
	$rcode[] = 'screen(1, new=FALSE)';
	return $rcode;
}
function iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual,$ext="",$incluicores=true,$ordenax="nao")
{
    $map = ms_newMapObj($map_file);
	if($ext && $ext != ""){
		$e = explode(" ",$ext);
		$extatual = $map->extent;
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
	}
	$layer = $map->getLayerByName($tema);
	//verifica se tem selecao
	$selecionados = carregaquery2($map_file,$layer,$map);
	if ($exclui == ""){
	    $exclui = "nulo";
	}

	//pega os valores
	//$itemvalores pode ser um array de intens
	$nnval = array();
	if(!is_array($itemvalores)){
		$valores = pegaValoresM($map,$layer,array($itemclasses,$itemvalores),$exclui,$selecionados);
		//agrupa se for o caso
		$dados = agrupaValores($valores,0,1,$tipo);
		foreach($valores as $valor){
			if(!empty($valor[0])){
				$cores[$valor[0]] = $valor["cores"];
			}
		}
		//calcula os parametros para o grafico
		$nval = count($dados);
		$max = max($dados);
		$soma = array_sum($dados);
		$tempm = array_keys($dados);
		$tempval = array();
		$nnval[] = "n;x";
		if ($tipo != "xy"){
			for ($i=0;$i < $nval; ++$i){
				if ($tempm[$i] != "" && $dados[$tempm[$i]] > 0){
					$pp = ($dados[$tempm[$i]] * 100) / $soma;
					if ($percentual == "TRUE"){
						$temp = "'".$tempm[$i]." (".round($pp,0)."%)';".$dados[$tempm[$i]];
						if($incluicores == true){
							$temp = $temp.";".$cores[$tempm[$i]];
						}
					}
					else{
						$temp = "'".$tempm[$i]."';".$dados[$tempm[$i]];
						if($incluicores == true){
							$temp = $temp.";".$cores[$tempm[$i]];
						}
					}
					$tempval[] = $temp;
				}
			}
			$nval = count($tempval);
		}
		else{
			foreach ($valores as $v){
				$temp = $v[0].";".$v[1];
				if($incluicores == true){
					$temp = $temp.";".$cores[$v[0]];
				}
				$tempval[] = $temp;
			}
		}
		if($ordenax == "sim"){
			sort($tempval);
		}
		$nnval = array_merge($nnval,$tempval);
	}
	else{
		$colunas = array_merge(array($itemclasses),$itemvalores);
		$valores = pegaValoresM($map,$layer,$colunas,$exclui,$selecionados);
		$nval = count($dados);
		$nnval[] = implode(";",$colunas);
		foreach($valores as $valor){
			$nnval[] = implode(";",$valor);
		}
		$max = "";
	}
	return array("dados"=>$nnval,"ndados"=>$nval,"max"=>$max);
}
function dadosLinhaDoTempo($map_file,$tema,$ext="")
{
	$map = ms_newMapObj($map_file);

	if($ext && $ext != ""){
		$e = explode(" ",$ext);
		$extatual = $map->extent;
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
	}

	$layer = $map->getLayerByName($tema);
	$selecionados = carregaquery2($map_file,$layer,$map);
	if ($exclui == ""){$exclui = "nulo";}
	//define os itens para pegar os dados
	$itens = array();
	if($layer->getmetadata("ltempoformatodata") == "")
	{return "Nao esta definido o metadata com o formato do campo";}

	if($layer->getmetadata("ltempoiteminicio") != ""){
		$iteminicio = $layer->getmetadata("ltempoiteminicio");
		$itens[] = $iteminicio;
	}
	else
	{return "Nao esta definido o metadata com o item inicial";}

	$itemi = "";
	if($layer->getmetadata("ltempoitemimagem") != ""){
		$itemi = $layer->getmetadata("ltempoitemimagem");
		$itens[] = $itemi;
	}
	$itemicone = "";
	if($layer->getmetadata("ltempoitemicone") != ""){
		$itemicone = $layer->getmetadata("ltempoitemicone");
		$itens[] = $itemicone;
	}
	$itemfim = "";
	if($layer->getmetadata("ltempoitemfim") != ""){
		$itemfim = $layer->getmetadata("ltempoitemfim");
		$itens[] = $itemfim;
	}
	$itemtitulo = $iteminicio;
	if($layer->getmetadata("ltempoitemtitulo") != ""){
		$itemtitulo = $layer->getmetadata("ltempoitemtitulo");
		$itens[] = $itemtitulo;
	}
	$itemdescricao = $itemtitulo;
	if($layer->getmetadata("ltempoitemdescricao") != ""){
		$itemdescricao = $layer->getmetadata("ltempoitemdescricao");
		$itens[] = $itemdescricao;
	}
	$itemtip = $itemdescricao;
	if($layer->getmetadata("ltempoitemtip") != ""){
		$itemtip = $layer->getmetadata("ltempoitemtip");
		$itens[] = $itemtip;
	}
	$itemlink = "";
	if($layer->getmetadata("ltempoitemlink") != ""){
		$itemlink = $layer->getmetadata("ltempoitemlink");
		$itens[] = $itemlink;
	}
	$converteE = "sim";
	if($layer->getmetadata("ltempoconvencode") != ""){
		$converteE = $layer->getmetadata("ltempoconvencode");
	}
	$dados = pegaValoresM($map,$layer,$itens,$exclui,$selecionados,true,true);
	$eventos = array();
	$anos = array();
	foreach($dados as $dado){
		if($itemi == "")
		{$image = '';}
		else {$image = $dado[$itemi];}
		if($itemicone == "")
		{$icone = 'dark-red-circle.png';}
		else {$icone = $dado[$itemicone];}
		if($itemfim == "")
		{$fim = '';}
		else {$fim = $dado[$itemfim];}
		if($itemlink == "")
		{$link = '';}
		else {$link = $dado[$link];}
		$titulo = $dado[$itemtitulo];
		$desc = $dado[$itemdescricao];
		if(function_exists("mb_convert_encoding") && strtolower($converteE) == "sim"){
		    $titulo = mb_convert_encoding($titulo,"UTF-8",mb_detect_encoding($titulo));
		    $desc = mb_convert_encoding($desc,"UTF-8",mb_detect_encoding($desc));
		}
		if($dado[$iteminicio] != 0 && $dado[$iteminicio] != '-'){
			$eventos[] = array(
				'start'=>$dado[$iteminicio],
				'end'=>$fim,
				'title'=>"<span onmouseover='tituloover(\"".$dado["centroide"]."\")' onmouseout='tituloout()'>".$titulo."</span>",
				'description'=>$dado[$iteminicio]." ".$fim."<br>".$desc,
				'icon'=>$icone,
				'image'=>$image,
				'link'=>$link
			);
			$anos[] = $fim;
			$anos[] = $dado[$iteminicio];
		}
	}
	//echo "<pre>";
	return array(
		"dateTimeFormat"=>$layer->getmetadata("ltempoformatodata"),
		"wikiURL"=>"",
		"wikiSection"=>"",
		"events"=>$eventos,
		"menorano"=>min($anos),
		"maiorano"=>max($anos)
	);
}
//
//opcao pode ser "google" ou o código de um tema. Nesse &uacute;ltimo caso, deve-se definir $item
//
function dadosPerfilRelevo($pontos,$opcao,$amostragem,$item="",$map_file=""){
	$urlGoogle = "http://maps.google.com/maps/api/elevation/json?sensor=false&path=";
	$pontos = str_replace(",","|",$pontos);
	$pontos = str_replace(" ",",",$pontos);
	$urlGoogle .= $pontos."&samples=".$amostragem;
	$curl = curl_init();
	if(!isset($i3geo_proxy_server)){
		include(dirname(__FILE__)."/../ms_configura.php");
	}
	curl_setopt ($curl, CURLOPT_URL, $urlGoogle);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($curl, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$result = curl_exec($curl);
	curl_close ($curl);
	$result = json_decode( $result, true );

	if($opcao != "google"){
		include_once("classe_atributos.php");
		$m = New Atributos($map_file,$opcao);
		$rs = array();
		foreach($result["results"] as $r){
			$l = $r["location"];
			$rs[] = $m->identificaQBP2("",$l["lng"],$l["lat"],"",5,$item,"googlerelevo",$etip=false,$ext="");
		}
		$result = array("results"=>$rs,"status"=>"OK");
	}
	return $result;
}
/*
Function: executaR

Executa comandos do R.

Parametros:

$rcode {array} - Código que ser&aacute; executado.

$dir_tmp {string} - Diretório tempor&aacute;rio onde ficar&atilde;o os arquivos para processamento.

$R_path {string} - Execut&aacute;vel do R.

$gfile_name {string} - nome da imagem que ser&aacute; criada

Retorno:

{string} - nome do arquivo com o código R que foi executado
*/

function executaR($rcode,$dir_tmp,$R_path,$gfile_name="")
{
	$R_options = "--slave --no-save";
	$r_name = nomeRandomico(20);
	$r_input = $dir_tmp."/".$r_name.".R";
	$r_output = $dir_tmp."/".$r_name.".Rout";
	gravaDados($rcode,$r_input);
	$command = $R_path." $R_options < $r_input > $r_output";
	$result = "";
	$error = "";
	$exec_result = exec($command,$result,$error);
	//corta a imagem final
	//include_once("classe_imagem.php");
	//$m = new Imagem($dir_tmp."/".$gfile_name.".png");
	//$i = $m->cortaBorda();
	//imagepng($i,$dir_tmp."/".$gfile_name.".png");
	return($r_input);
}
/*
Function: pegaValoresM

Pega os valores de m&uacute;ltiplos itens de um tema.

Se for passado apenas um item, o array de retorno ser&aacute; unidimensional.

Parametros:

$layer {objeto} - Layer que ser&aacute; processado.

$itens {array} - Itens que ser&atilde;o processados.

$exclui {string} - O registro n&atilde;o ser&aacute; considerado se um dos valores for igual a esse valor.

$selecionados {string} - sim|nao Utiliza apenas os selecionados ou todos

$chaves {boolean} - inclui ou n&atilde;o os nomes dos itens como chave no array resultante

$centroide {boolean} - captura ou n&atilde;o o WKT com o centroide do elemento

Retorno:

{array}
*/
function pegaValoresM($mapa,$layer,$itens,$exclui="nulo",$selecionados="nao",$chaves=false,$centroide=false)
{
	$versao = versao();
	$versao = $versao["principal"];
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$layer->set("template","none.htm");
	//$layer->setfilter("");

	$indicesel = array();
	//pega os valores dos indices dos elementos selecionados para comparacao posterior
	if ($selecionados == "sim"){
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();
		for ($i = 0; $i < $res_count; ++$i)
		{
			$result = $layer->getResult($i);
			$indicesel[] = $result->shapeindex;
		}
		$layer->close();
	}
	$valores = array();
	$nclasses = $layer->numclasses;
	if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS){
		//$layer->draw();
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();
		//echo $res_count;echo "\n";
		for ($i=0;$i<$res_count;++$i){
			if($versao >= 6){
				$shape = $layer->getShape($layer->getResult($i));
				$shp_index = $shape->index;
			}
			else{
				$result = $layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $layer->getfeature($shp_index,-1);
			}
			if (($selecionados == "sim") && (array_search($shp_index,$indicesel) === FALSE))
			{continue;}
			$considera = "sim";
			//verifica se no registro deve ser considerado
			if ($exclui != "nulo"){
				foreach ($itens as $item)
				{if($shape->values[$item] == $exclui){$considera = "nao";}}
			}
			//pega os valores
			$v = array();
			if ($considera == "sim"){
				//pega os valores dos itens do registro
				foreach ($itens as $item){
					$vitem = $shape->values[$item];
					if (!mb_detect_encoding($vitem,"UTF-8",true)){
						$vitem = mb_convert_encoding($vitem,"UTF-8","ISO-8859-1");
					}
					if($chaves == false)
					{$v[] = $vitem;}
					else
					{$v[$item] = $vitem;}
				}
				//pega o centroide
				//echo $i;echo "\n";
				if($centroide == true){
					$c = $shape->getCentroid();
					if (($prjTema != "") && ($prjMapa != $prjTema)){
						$projOutObj = ms_newprojectionobj($prjTema);
						$projInObj = ms_newprojectionobj($prjMapa);
						$c->project($projInObj, $projOutObj);
					}
					$v["centroide"] = "POINT(".$c->x." ".$c->y.")";
				}
				//echo $i;echo "---\n";
				//pega a cor da classe onde cai o registro
				if($nclasses > 0 && $versao >= 6){
					$cx = $layer->getClassIndex($shape);
					if($cx > -1){
						$classe = $layer->getclass($cx);
						$cor = $classe->getstyle(0)->color;
						$v["cores"] = $cor->red." ".$cor->green." ".$cor->blue;
					}
				}
				if (count($v) == 1){
					$valores[] = $v[0];
				}
				else{
					$valores[] = $v;
				}
			}
		}
		$layer->close();
	}
	return ($valores);
}
/*
Function: agrupaValores

Agrupa os valores de um array por um m&eacute;todo de c&aacute;lculo.

No caso de soma e m&eacute;dia, ser&aacute; considerado apenas um item e uma chave.

Parametros:

$lista {array} - Lista com os arrays contendo os dados que ser&atilde;o processados.

$indiceChave {string} - &Iacute;ndice do array da lista que ser&aacute; considerado como a chave do array.

$indiceValor {string} - &Iacute;ndice do array da lista que ser&aacute; considerado como o valor.

$tipo {string} - Tipo de processamento soma|media|contagem|nenhum.

Retorno:

{array}
*/
function agrupaValores($lista,$indiceChave,$indiceValor,$tipo)
{
	$valores = null;
	foreach ($lista as $linha){
		$c = $linha[$indiceChave];
		$v = $linha[$indiceValor];
		if ($tipo == "conta"){
			if(@$valores[$c])
			$valores[$c] = $valores[$c] + 1;
			else
			$valores[$c] = 1;
		}
		if (($tipo == "soma"))
		{
			if (($v != "") && (is_numeric($v))){
				if(@$valores[$c])
				$valores[$c] = $valores[$c] + $v;
				else
				$valores[$c] = $v;
			}
		}
		if ($tipo == "media"){
			if (($v != "") && (is_numeric($v))){
				if(@$soma[$c])
				$soma[$c] = $soma[$c] + $v;
				else
				$soma[$c] = $v;

				if(@$conta[$c])
				$conta[$c] = $conta[$c] + 1;
				else
				$conta[$c] = 1;
			}
		}
		if ($tipo == "nenhum"){
			//if (($v != "") && (is_numeric($v)))
			//{
				$valoresn[] = $v;
			//}
			$valores = $valoresn;
		}
	}
	if ($tipo == "media"){
		$chaves = array_keys($conta);
		foreach ($chaves as $c){
			$valores[$c] = $soma[$c] / $conta[$c];
		}
	}
	return ($valores);
}

?>
