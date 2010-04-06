<?php
/*
Title: graficos.php

Funções de representação gráfica de dados com o software R.
Gera scripts na linguagem R para ser executados como CGI.

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/graficos.php
*/
/*
* Gera gráfico de pizza.
*/
function graficoPizza()
{
	global $cp,$map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
	global $percentual,$nome,$margem,$margemexterna,$margeminterna,$border,$las,$radius,$lwd,$lty,$fontsub,$fontmain,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$fg,$colmain,$font,$cex,$nval,$main,$cexmain,$sub,$cexsub;
	//error_reporting(E_ALL);
	//gera os nomes dos arquivos com os dados
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic);
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
* Gera gráfico de barras.
*/
function graficoBarras()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
	global $setasdv,$percentual,$nome,$margem,$margemexterna,$margeminterna,$grid,$border,$cexaxis,$las,$space,$lwd,$fontlab,$collab,$cexlab,$xlab,$ylab,$fontsub,$fontmain,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$fg,$colmain,$font,$main,$cexmain,$sub,$cexsub;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic);
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
* Gera gráfico de histograma.
*/
function graficoHist()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
	global $densidade,$percentual,$nome,$margem,$margemexterna,$margeminterna,$corbarras,$grid,$breaks,$border,$cexaxis,$las,$lwd,$fontlab,$collab,$cexlab,$xlab,$ylab,$fontsub,$fontmain,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$fg,$colmain,$font,$main,$cexmain,$sub,$cexsub;
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$itemvalores = $itemclasses;
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic);
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
* Gera gráfico de linhas.
*/
function graficoLinhas()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
	global $percentual,$nome,$margem,$margemexterna,$margeminterna,$xlab,$ylab,$grid,$ppontos,$spline,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$nome;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic);
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
* Gera gráfico de distribuição de pontos (scatter).
*/
function graficoScatter()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
	global $percentual,$nome,$margem,$margemexterna,$margeminterna,$corlinha,$grid,$ppontos,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$ylab,$xlab;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,"xy",$percentual);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic);
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
* Gera gráfico de distribuição de pontos (scatter) com agrupamento em pixels.
*/
function graficoScatterBins()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
	global $plota3d,$nbins,$percentual,$nome,$margem,$margemexterna,$margeminterna,$corlinha,$grid,$ppontos,$locaplic,$dir_tmp,$gw,$gh,$res,$bg,$collab,$colaxis,$cexlab,$cexaxis,$fontlab,$las,$tck,$cexmain,$border,$lty,$lwd,$lty,$lwd,$pch,$tpt,$main,$colmain,$fontmain,$ylab,$xlab;
	//pega os valores
	$dir = dirname(dirname($map_file));
	if($nome == "")
	{
		$temp = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,"xy",$percentual);
		$nnval = $temp["dados"];
		$nome = $dir."/".nomeRandomico(20);
		gravaDados($nnval,$nome);
	}
	$gfile_name = nomeRandomico(20);
	$rcode = iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic);
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
* Gera gráfico de estrelas.
*/
function graficoEstrela()
{
	global $map_file,$itemvalores,$itemclasses,$tema,$exclui,$tipo,$R_path;
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
function iniciaParGrafico($gw,$gh,$res,$dir_tmp,$gfile_name,$margem,$margemexterna,$margeminterna,$locaplic)
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{$lib = '.libPaths("'.$locaplic.'/pacotes/rlib/win")';}
	else
	{
		if(file_exists($locaplic."/pacotes/rlib/linux"))
		$lib = '.libPaths("'.$locaplic.'/pacotes/rlib/linux")';
	}
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
function iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual)
{
	//pega os valores
	$map = ms_newMapObj($map_file);
	$selecionados = "sim";
	$qyfile = str_replace(".map",".qy",$map_file);
	if (file_exists($qyfile))
	{$map->loadquery($qyfile);}
	else
	{$selecionados = "nao";}
	$layer = $map->getLayerByName($tema);
	if ($selecionados == "sim")
	{
		$layer->open();
		$res_count = $layer->getNumresults();
		$layer->close();
		if ($res_count < 1)
		{$selecionados = "nao";}	
	}
	if ($exclui == ""){$exclui = "nulo";}
	$valores = pegaValoresM($map,$layer,array($itemclasses,$itemvalores),$exclui,$selecionados);
	$dados = agrupaValores($valores,0,1,$tipo);
	//calcula os parametros para o grafico	
	$nval = count($dados);
	$max = max($dados);
	$soma = array_sum($dados);
	$tempm = array_keys($dados);
	if ($tipo != "xy")
	{
		$nnval[] = "n;x";
		for ($i=0;$i < $nval; ++$i)
		{
			if ($dados[$tempm[$i]] > 0)
			{
				$pp = ($dados[$tempm[$i]] * 100) / $soma;
				if ($percentual == "TRUE")
				{$nnval[] = "'".$tempm[$i]." (".round($pp,0)."%)';".$dados[$tempm[$i]];}
				else
				{$nnval[] = "'".$tempm[$i]."';".$dados[$tempm[$i]];}
			}
		}
	}
	else
	{
		$nnval[] = "x;y";
		foreach ($valores as $v)
		{
			$nnval[] = $v[0].";".$v[1];
		}	
	}
	return array("dados"=>$nnval,"ndados"=>$nval,"max"=>$max);
}
function dadosLinhaDoTempo($map_file,$tema)
{
	$map = ms_newMapObj($map_file);
	$selecionados = "sim";
	$qyfile = str_replace(".map",".qy",$map_file);
	if (file_exists($qyfile))
	{$map->loadquery($qyfile);}
	else
	{$selecionados = "nao";}
	$layer = $map->getLayerByName($tema);
	if ($selecionados == "sim")
	{
		$layer->open();
		$res_count = $layer->getNumresults();
		$layer->close();
		if ($res_count < 1)
		{$selecionados = "nao";}	
	}
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
	$dados = pegaValoresM($map,$layer,$itens,$exclui,$selecionados,true,true);
	$eventos = array();
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
		if (function_exists("mb_convert_encoding")){
			$titulo = mb_convert_encoding($titulo,"UTF-8","ISO-8859-1");
			$desc = mb_convert_encoding($desc,"UTF-8","ISO-8859-1");
		}
		if($dado[$iteminicio] != 0 && $dado[$iteminicio] != '-'){
			$eventos[] = array(
				'start'=>$dado[$iteminicio],
				'end'=>$fim,
				'title'=>"<span title='clique para selecionar' onclick='tituloclique(\"".$dado["centroide"]."\")' onmouseover='tituloover(\"".$dado["centroide"]."\")' onmouseout='tituloout()'>".$titulo."</span>",
				'description'=>$dado[$iteminicio]." ".$fim."<br>".$desc,
				'icon'=>$icone,
				'image'=>$image,
				'link'=>$link
			);
		}
	}
	//echo "<pre>";
	return array(
		"dateTimeFormat"=>$layer->getmetadata("ltempoformatodata"),
		"wikiURL"=>"",
		"wikiSection"=>"",		
		"events"=>$eventos
	);
}
?>