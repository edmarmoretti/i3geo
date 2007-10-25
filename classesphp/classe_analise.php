<?php
/*
Title: Análise

Gera análises espaciais, como buffer, calculo de centróides, etc.

About: Licença

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

File: classe_analise.php

19/6/2007
*/
/*
Class: Analise

*/
class Analise
{
	/*
	Variable: $mapa
	
	Objeto mapa
	*/
	protected $mapa;
	/*
	Variable: $arquivo
	
	Arquivo map file
	*/
	protected $arquivo;
	/*
	Variable: $layer
	
	Objeto layer
	*/
	protected $layer;
	/*
	Variable: $nome
	
	Nome do layer
	*/
	protected $nome;
	/*
	Variable: $diretorio
	
	Diretório do arquivo map_file
	*/
	protected $diretorio;
/*
Function: __construct

Cria um objeto Analise 

parameters:

$map_file - Endereço do mapfile no servidor.

$tema - Nome do tema que será processado
*/  
	function __construct($map_file,$tema="")
	{
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
 		$this->layer = $this->mapa->getlayerbyname($tema);
  		$this->nome = $tema;
  		$this->diretorio = dirname($this->arquivo);
	}
/*
Method: salva

Salva o mapfile atual 
*/	
 	function salva()
 	{
	  	if (connection_aborted()){exit();}
	  	$this->mapa->save($this->arquivo);
	}

/*
function: analiseDistriPt

Gera análise de distribuição de pontos.

Executa script R para gerar a imagem.

parameters:
$locaplic - Localização da aplicação I3Geo

$dir_tmp - Diretório temporário do mapserver

$R_path - Onde fica o R

$numclasses - Número de classes que serão representadas

$tipo - Tipo de análise.

$cori - Cor inicial em rgb.

$corf - Cor final em rgb.

$tmpurl - Url com o nome da imagem final

Include:
<class.palette.php>
*/
	function analiseDistriPt($locaplic,$dir_tmp,$R_path,$numclasses,$tipo,$cori,$corf,$tmpurl)
	{
		$layerPt = $this->layer;
		$layerPt->set("template","none.htm");
		$nomefinal = nomeRandomico();
		$nomearq = $this->diretorio."/".$nomefinal;
		$itemspt = pegaItens($layerPt);
		$existesel = "nao";
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		if ($layerPt->getNumresults() > 0){$existesel = "sim";}
		if ($existesel == "nao")
		{
			$qstring = "/.*/";
			if($layerPt->connectiontype == MS_POSTGIS)
			{$layerPt->queryByrect($this->mapa->extent);}
			//$qstring = $itemspt[0].' ~* \'^.\'  ';
			else
			{$layerPt->queryByAttributes($itemspt[0], $qstring, 1);}
		}
		$res_count = $layerPt->getNumresults();
		$pontos = array();
		//pega um shape especifico
		$layerPt->open();
		for ($i = 0; $i < $res_count; $i++)
		{
			$result = $layerPt->getResult($i);
			$shp_index  = $result->shapeindex;
			$shape = $layerPt->getshape(-1, $shp_index);
			$lineo = $shape->line(0);
			$pt = $lineo->point(0);
			$pontos[] = $pt->x."  ".$pt->y."\n";
			$pontosx[] = $pt->x;
			$pontosy[] = $pt->y;
		}
		$layerPt->close();
		//grava o arquivo com os pontos em x
		$f = fopen($nomearq."x",w);
		foreach ($pontosx as $pt)
		{fwrite($f,$pt."\n");}
		fclose($f);
		//grava o arquivo com os pontos em y
		$f = fopen($nomearq."y",w);
		foreach ($pontosy as $pt)
		{fwrite($f,$pt."\n");}
		fclose($f);
/*
		$xi = (intval(min($pontosx)))-1;
		$xf = (intval(max($pontosx)))+1;
		$yi = (intval(min($pontosy)))-1;
		$yf = (intval(max($pontosy)))+1;
*/
		$xi = (min($pontosx));
		$xf = (max($pontosx));
		$yi = (min($pontosy));
		$yf = (max($pontosy));

		$dimx = "c(".$xi.",".$xf.")";
		$dimy = "c(".$yi.",".$yf.")";
		if ($tipo == "kernel")
		{$this->mapaKernel($nomearq,$dimx,$dimy,$dir_tmp,$R_path,$locaplic);}
		if ($tipo == "densidade")
		{$this->mapaDensidade($nomearq,$dimx,$dimy,$dir_tmp,$R_path,$locaplic);}
		if ($tipo == "distancia")
		{$this->mapaDistancia($nomearq,$dimx,$dimy,$dir_tmp,$R_path,$locaplic);}
		if ($tipo == "relatorio")
		{
			$r = $this->mapaRelatorioAnaliseDist($nomearq,$dimx,$dimy,$dir_tmp,$R_path,$locaplic);
			return($tmpurl.basename($this->diretorio)."/".basename($nomearq).'.htm');
		}
		//cria a imagem
		$minmax = criaImagemR($nomearq);
		//cria as cores
		include("class.palette.php");
		$cori = RGB2hex(explode(",",$cori));
		$corf = RGB2hex(explode(",",$corf));
		$myPalette=new palette(array($cori,$corf),($numclasses + 1));
		//cria os parametros das classes
		$cls = classesRasterI($minmax[0],$minmax[1],$numclasses,$myPalette->colorRGB);
		if (count($cls) != $numclasses){return("erro.");}
		//adiciona o novo tema
		if (file_exists($nomearq.".png"))
		{
			$novolayer = criaLayer($this->mapa,MS_LAYER_RASTER,MS_DEFAULT,($tipo." (".$this->nome.")"),$metaClasse="SIM");
			$novolayer->set("data",$nomearq.".png");
			$novolayer->set("template","none.htm");
			//classes
			$numclassesatual = $novolayer->numclasses;
			for ($i=0; $i < $numclassesatual; $i++)
			{
				$classe = $novolayer->getClass($i);
				$classe->set("status",MS_DELETE);
			}
			for ($i=0; $i < $numclasses; $i++)
			{
				$classe = ms_newClassObj($novolayer);
				$novoestilo = ms_newStyleObj($classe);
				$ncor = $novoestilo->color;
				$cores = $cls[$i]["cores"];
				$ncor->setrgb($cores[0],$cores[1],$cores[2]);
				$classe->setexpression($cls[$i]["expressao"]);
				$classe->set("name",$cls[$i]["nomeclasse"]);
			}
		}
		else
		{return("erro");}
		return("ok");
	}
/*
function: mapaRelatorioAnaliseDist

Gera um relatório da análise de distribuição de pontos.

Executa script R para gerar relatório .

parameters:

$arqpt - Prefixo dos arquivos em disco com os pontos.

$dimx - Range em x no formato R c(-54,-53).

$dimy - Range em y no formato R c(-25,-23).

$dir_tmp - Diretório temporário do mapserver.

$R_path - Onde fica o R.

$locaplic - Onde fica o I3Geo.
*/
	function mapaRelatorioAnaliseDist($arqpt,$dimx,$dimy,$dir_tmp,$R_path,$locaplic)
	{
		$nomedir = dirname($arqpt)."/";
		$rcode[] = 'dadosx<-scan("'.$arqpt.'x")';
		$rcode[] = 'dadosy<-scan("'.$arqpt.'y")';
		$tipoimg = "bitmap";
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			$lib = '.libPaths("'.$locaplic.'/pacotes/rlib/win")';
			$tipoimg = "png";
		}
		else
		{
			if(file_exists($locaplic."/pacotes/rlib/linux"))
			$lib = '.libPaths("'.$locaplic.'/pacotes/rlib/linux")';
		}
		$rcode[] = $lib;		
		$rcode[] = 'library(spatstat)';
		$rcode[] = 'oppp <- ppp(dadosx, dadosy, '.$dimx.','.$dimy.')';
		$rcode[] = 'img<-distmap(oppp)';
		$rcode[] = 'zz <- file("'.$arqpt.'.htm", "w")';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><b>Distância</b>\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'distancia.png")';
		$rcode[] = 'plot(img,main="")';
		$rcode[] = 'points(oppp$x,oppp$y,pch="x",col=1)';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br></pre><img src=distancia.png />\n", file = zz)';
		$rcode[] = 'cat("<br>Resumo<pre>\n", file = zz)';
		$rcode[] = 'summary(img)';
		$rcode[] = 'cat("<br></pre>Quartis<pre>\n", file = zz)';
		$rcode[] = 'quantile.im(img)';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br>Histograma\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'histdistancia.png")';
		$rcode[] = 'hist.im(img,main="")';
		$rcode[] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><img src=histdistancia.png />\n", file = zz)';
		$rcode[] = 'cat("<br></pre>Perspectiva\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'perspdistancia.png")';
		$rcode[] = 'p<-persp.im(img,colmap=terrain.colors(128),shade=0.3,theta=30,phi=45,main="")';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><img src=perspdistancia.png />\n", file = zz)';
		$rcode[] = 'cat("<br></pre>Contorno\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'contordistancia.png")';
		$rcode[] = 'contour.im(img,main="")';
		$rcode[] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><img src=contordistancia.png />\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = 'img<-density.ppp(oppp)';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><b>Densidade</b>\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'densidade.png")';
		$rcode[] = 'plot(img,main="")';
		$rcode[] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br></pre><img src=densidade.png />\n", file = zz)';
		$rcode[] = 'cat("<br>Resumo<pre>\n", file = zz)';
		$rcode[] = 'summary(img)';
		$rcode[] = 'cat("<br></pre>Quartis<pre>\n", file = zz)';
		$rcode[] = 'quantile.im(img)';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br>Histograma\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'histdensidade.png")';
		$rcode[] = 'hist.im(img,main="")';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><img src=histdensidade.png />\n", file = zz)';
		$rcode[] = 'cat("<br></pre>Perspectiva\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'perspdensidade.png")';
		$rcode[] = 'p<-persp.im(img,colmap=terrain.colors(128),shade=0.3,theta=30,phi=45,main="")';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><img src=perspdensidade.png />\n", file = zz)';
		$rcode[] = 'cat("<br></pre>Contorno\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = $tipoimg.'(file="'.$nomedir.'contordensidade.png")#,height =600, width = 600, res = 72)';
		$rcode[] = 'contour.im(img,main="")';
		$rcode[] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode[] = 'dev.off()';
		$rcode[] = 'sink(zz)';
		$rcode[] = 'cat("<br><img src=contordensidade.png />\n", file = zz)';
		$rcode[] = 'sink()';
		$rcode[] = 'close(zz)';
		$r = executaR($rcode,$dir_tmp,$R_path);
	}
/*
function: mapaKernel

Gera um mapa de kernel.

Executa script R para gerar a imagem.

parameters:
$arqpt - Prefixo dos arquivos em disco com os pontos.

$dimx - Range em x no formato R c(-54,-53).

$dimy - Range em y no formato R c(-25,-23).

$dir_tmp - Diretório temporário do mapserver.

$R_path - Onde fica o R.

$locaplic - Onde fica o I3Geo.
*/
	function mapaKernel($arqpt,$dimx,$dimy,$dir_tmp,$R_path,$locaplic)
	{
		$gfile_name = nomeRandomico(20);
		$graf = "png";
		$rcode[] = 'dadosx<-scan("'.$arqpt.'x")';
		$rcode[] = 'dadosy<-scan("'.$arqpt.'y")';
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$lib = '.libPaths("'.$locaplic.'/pacotes/r/win/library")';}
		$rcode[] = $lib;
		$rcode[] = 'library(spatstat)';
		$rcode[] = 'pt <- ppp(dadosx, dadosy, '.$dimx.','.$dimy.')';
		$rcode[] = 'img <- ksmooth.ppp(pt)';
		$rcode[] = 'cat(img$v,file="'.$arqpt.'img",fill=FALSE)';
		$rcode[] = 'cat(img$xstep,file="'.$arqpt.'h",fill=TRUE)';
		$rcode[] = 'cat(img$ystep,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$xrange,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$yrange,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$dim,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$r = executaR($rcode,$dir_tmp,$R_path,$gfile_name);
		return "ok";
	}
/*
function: mapaDensidade

Gera um mapa de densidade de pontos.

Executa script R para gerar a imagem.

parameters:
$arqpt - Prefixo dos arquivos em disco com os pontos.

$dimx - Range em x no formato R c(-54,-53).

$dimy - Range em y no formato R c(-25,-23).

$dir_tmp - Diretório temporário do mapserver.

$R_path - Onde fica o R.

$locaplic - Onde fica o I3Geo.
*/
	function mapaDensidade($arqpt,$dimx,$dimy,$dir_tmp,$R_path,$locaplic)
	{
		$gfile_name = nomeRandomico(20);
		$graf = "png";
		$rcode[] = 'dadosx<-scan("'.$arqpt.'x")';
		$rcode[] = 'dadosy<-scan("'.$arqpt.'y")';
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$lib = '.libPaths("'.$locaplic.'/pacotes/r/win/library")';}
		$rcode[] = $lib;
		$rcode[] = 'library(spatstat)';
		$rcode[] = 'pt <- ppp(dadosx, dadosy, '.$dimx.','.$dimy.')';
		$rcode[] = 'img <- density.ppp(pt)';
		$rcode[] = 'cat(img$v,file="'.$arqpt.'img",fill=FALSE)';
		$rcode[] = 'cat(img$xstep,file="'.$arqpt.'h",fill=TRUE)';
		$rcode[] = 'cat(img$ystep,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$xrange,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$yrange,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$dim,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$r = executaR($rcode,$dir_tmp,$R_path,$gfile_name);
		return "ok";
	}
/*
function: mapaDistancia

Gera um mapa de distancia de pontos.

Executa script R para gerar a imagem.

parameters:

$arqpt - Prefixo dos arquivos em disco com os pontos.

$dimx - Range em x no formato R c(-54,-53).

$dimy - Range em y no formato R c(-25,-23).

$dir_tmp - Diretório temporário do mapserver.

$R_path - Onde fica o R.

$locaplic - Onde fica o I3Geo.
*/
	function mapaDistancia($arqpt,$dimx,$dimy,$dir_tmp,$R_path,$locaplic)
	{
		$gfile_name = nomeRandomico(20);
		$graf = "png";
		$rcode[] = 'dadosx<-scan("'.$arqpt.'x")';
		$rcode[] = 'dadosy<-scan("'.$arqpt.'y")';
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$lib = '.libPaths("'.$locaplic.'/pacotes/r/win/library")';}
		$rcode[] = $lib;
		$rcode[] = 'library(spatstat)';
		$rcode[] = 'pt <- ppp(dadosx, dadosy, '.$dimx.','.$dimy.')';
		$rcode[] = 'img <- distmap(pt)';
		$rcode[] = 'cat(img$v,file="'.$arqpt.'img",fill=FALSE)';
		$rcode[] = 'cat(img$xstep,file="'.$arqpt.'h",fill=TRUE)';
		$rcode[] = 'cat(img$ystep,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$xrange,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$yrange,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$rcode[] = 'cat(img$dim,file="'.$arqpt.'h",append=TRUE,fill=TRUE)';
		$r = executaR($rcode,$dir_tmp,$R_path,$gfile_name);
		return "ok";
	}
/*
function: pontoEmPoligono

Cruza um tema pontual com temas poligonais ou raster.

Salva o mapa acrescentando um novo layer com o resultado.

parameters:

$temaPt - Tema de pontos que será utilizado.

$temaPo - Temas poligonais separados por virgula.

$locaplic - Localização do I3geo.
*/
	function pontoEmPoligono($temaPt,$temasPo,$locaplic)
	{
		require_once "../pacotes/phpxbase/api_conversion.php";
		$layerPt = $this->mapa->getlayerbyname($temaPt);
		$layerPt->set("template","none.htm");
		//define o nome do novo shapefile que será criado
		$nomefinal = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomefinal;
		//pega os shapes selecionados
		$itemspt = pegaItens($layerPt);
		$existesel = "nao";
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		if ($layerPt->getNumresults() > 0){$existesel = "sim";}
		if ($existesel == "nao")
		{
			$qstring = "/.*/";
			if($layerPt->connectiontype == MS_POSTGIS)
			{$layerPt->queryByrect($this->mapa->extent);}
			//$qstring = $itemspt[0].' ~* \'^.\'  ';
			else
			{$layerPt->queryByAttributes($itemspt[0], $qstring, 1);}
		}
		$res_count = $layerPt->getNumresults();
		$pontos = array();
		//pega um shape especifico
		$layerPt->open();
		for ($i = 0; $i < $res_count; $i++)
		{
			$result = $layerPt->getResult($i);
			$shp_index  = $result->shapeindex;
			$shape = $layerPt->getshape(-1, $shp_index);
			$pontos[] = $shape;
		}
		$layerPt->close();
		//gera o novo arquivo shape file
		// cria o shapefile
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POINT);
		// cria o dbf
		$def = array();
		foreach ($itemspt as $ni)
		{$def[] = array($ni,"C","254");}
		//pega os itens dos temas poligonais
		$layersPol = array();
		$temas = explode(",",$temasPo);
		foreach ($temas as $tema)
		{
			$l = $this->mapa->getlayerbyname($tema);
			$layers[] = $l;
		}
		$nomesitens = array(); //guarda os nomes dos temas e seus itens
		$conta = 0;
		foreach ($layers as $layer)
		{
			$items = pegaItens($layer);
			foreach ($items as $ni)
			{
				$def[] = array("I".$conta,"C","254");
				$nomesitens[] = "Tema: ".$layer->name.", Item: ".$ni." Novo: I".$conta."<br>";
				$conta = $conta + 1;
			}
		}
		$db = xbase_create($nomeshp.".dbf", $def);
		//acrescenta os pontos no novo shapefile
		$dbname = $nomeshp.".dbf";
		foreach($pontos as $ponto)
		{
			$layerPt->open();
			foreach ($itemspt as $ni)
			{$reg[] = $ponto->values[$ni];}
			$layerPt->close();
			$novoshpf->addShape($ponto);
			$lineo = $ponto->line(0);
			$pt = $lineo->point(0);
			//faz a pesquisa
			foreach ($layers as $layer)
			{
				$layer->set("template","none.htm");
				$layer->set("toleranceunits",MS_PIXELS);
				$layer->set("tolerance",1);
				$ident = @$layer->queryByPoint($pt, 0, 0);
				$itens = pegaItens($layer);
				$res_count = $layer->getNumresults();
				$layer->open();
				if ($res_count > 0)
				{
					$result = $layer->getResult(0);
					$shp_index  = $result->shapeindex;
					$shape = $layer->getshape(-1, $shp_index);
					foreach ($itens as $item)
					{$reg[] = $shape->values[$item];}
				}
				else
				{
					foreach ($itens as $item)
					{$reg[] = "???";}
				}
				$layer->close();
			}
			xbase_add_record($db,$reg);
			$reg = array();
		}
		$novoshpf->free();
		xbase_close($db);
		$novolayer = ms_newLayerObj($this->mapa, $layerPt);
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->set("name",$nomefinal);
		$novolayer->setmetadata("TEMA","Cruzamento (".$nomefinal.")");
		$novolayer->setmetadata("TEMALOCAL","SIM");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->setmetadata("ITENS"," ");
		$novolayer->setmetadata("ITENSDESC"," ");
		$novolayer->set("connectiontype",MS_SHAPEFILE);
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return(implode(" ",$nomesitens));
	}
/*
function - criaBuffer

Gera entorno (buffer) nos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com o buffer.

$distancia - Distância em km.

$locaplic - Localização do I3geo.
*/
	function criaBuffer($distancia,$locaplic)
	{
		//para manipular dbf
		require_once "../pacotes/phpxbase/api_conversion.php";
		//define o nome do novo shapefile que será criado
		$nomebuffer = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomebuffer;
		//pega os shapes selecionados
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		if (@$this->layer->open() == MS_SUCCESS)
		{
			$items = pegaItens($this->layer);
			$this->layer->open();
			$res_count = $this->layer->getNumresults();
			$buffers = array();
			//pega um shape especifico
			for ($i = 0; $i < $res_count; $i++)
			{
				$result = $this->layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $this->layer->getshape(-1, $shp_index);
				//calcula a extensão geografica
				$rect = $shape->bounds;
				$projInObj = ms_newprojectionobj("proj=latlong");
				$projOutObj = ms_newprojectionobj("proj=poly,ellps=GRS67,lat_0=0,lon_0=".$rect->miny.",x_0=5000000,y_0=10000000");
				$poPoint = ms_newpointobj();
				$poPoint->setXY($rect->minx, $rect->miny);
				$dd1 = ms_newpointobj();
				$dd1->setXY($rect->minx, $rect->miny);
				$poPoint->project($projInObj, $projOutObj);
				$dd2 = ms_newpointobj();
				$dd2->setXY(($poPoint->x + $distancia), $poPoint->y);
				$dd2->project($projOutObj,$projInObj);
				$d = $dd1->distanceToPoint($dd2);
				if ($d < 0){$d = $d * -1;}
				//calcula a distancia 29100
				//gera o buffer
				$buffers[] = $shape->buffer($d);
				$shapes[] = $shape;
			}
		}
		$fechou = $this->layer->close();
		//gera o novo arquivo shape file
		// cria o shapefile
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);
		$items = pegaItens($this->layer);
		// cria o dbf
		$def = array();
		foreach ($items as $ni)
		{$def[] = array($ni,"C","254");}
		$db = xbase_create($nomeshp.".dbf", $def);
		//acrescenta os pontos no novo shapefile
		$dbname = $nomeshp.".dbf";
		for($i = 0;$i < count($buffers);$i++)
		{
			foreach ($items as $ni)
			{$reg[] = $shapes[$i]->values[$ni];}
			$novoshpf->addShape($buffers[$i]);
			xbase_add_record($db,$reg);
			$reg = array();
		}
		$novoshpf->free();
		xbase_close($db);
		//adiciona no mapa atual o novo tema
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$mapt = ms_newMapObj($locaplic."\\aplicmap\\novotema.map");}
		else
		{$mapt = ms_newMapObj($locaplic."/aplicmap/novotema.map");}
		$novolayer = criaLayer($this->mapa,MS_LAYER_POLYGON,MS_DEFAULT,("Buffer (".$nomebuffer.")"),$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->set("template","none.htm");
		//limpa selecao
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return("ok");
	}
/*
function - criaCentroide

Gera centroide dos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com os pontos.

Parameters:

$locaplic - Localização do I3geo.
*/
	function criaCentroide($locaplic)
	{
		//para manipular dbf
		require_once "../pacotes/phpxbase/api_conversion.php";
		//define o nome do novo shapefile que será criado
		$nomeCentroides = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomeCentroides;
		//pega os shapes selecionados
		if (file_exists(($this->arquivo)."qy"))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		if (@$this->layer->open() == MS_SUCCESS)
		{
			$items = pegaItens($this->layer);
			$this->layer->open();
			$res_count = $this->layer->getNumresults();
			$centroides = array();
			$shapes = array();
			//pega um shape especifico
			for ($i = 0; $i < $res_count; $i++)
			{
				$result = $this->layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $this->layer->getshape(-1, $shp_index);
				$LineObj = ms_newLineObj();
				$LineObj->add($shape->getCentroid());
				$ShapeObj = ms_newShapeObj(MS_SHAPE_POINT);
				$ShapeObj->add($LineObj);
				$centroides[] = $ShapeObj;
				$shapes[] = $shape;
			}
		}
		$fechou = $this->layer->close();
		//gera o novo arquivo shape file
		// cria o shapefile
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POINT);
		$items = pegaItens($this->layer);
		// cria o dbf
		$def = array();
		foreach ($items as $ni)
		{$def[] = array($ni,"C","254");}
		$db = xbase_create($nomeshp.".dbf", $def);
		//acrescenta os pontos no novo shapefile
		$dbname = $nomeshp.".dbf";
		for($i = 0;$i < count($centroides);$i++)
		{
			foreach ($items as $ni)
			{$reg[] = $shapes[$i]->values[$ni];}
			$novoshpf->addShape($centroides[$i]);
			xbase_add_record($db,$reg);
			$reg = array();
		}
		$novoshpf->free();
		xbase_close($db);
		//adiciona no mapa atual o novo tema
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$mapt = ms_newMapObj($locaplic."\\aplicmap\\novotema.map");}
		else
		{$mapt = ms_newMapObj($locaplic."/aplicmap/novotema.map");}
		$novolayer = criaLayer($this->mapa,MS_LAYER_POINT,MS_DEFAULT,("Centróide (".$nomecentroide.")"),$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->set("template","none.htm");
		//limpa selecao
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return("ok");
	}
/*
function: gradeDePontos

Gera uma grade de pontos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade de coordenadas.

$ddx - Espaçamento em x.

$ddy - Espaçamento em y.

$px - X do primeiro ponto (superior esquerdo)

$py - Y do primeiro ponto.

$locaplic - Endereço da aplicação.

$nptx - Número de pontos em X (opcional)

$npty - Número de pontos em Y (opcional)
*/
	function gradeDePontos($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty)
	{
		//para manipular dbf
		require_once "../pacotes/phpxbase/api_conversion.php";
		//define o nome do novo shapefile que será criado
		$nomegrade = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomegrade;
		$this->mapa->preparequery();
		$ext = $this->mapa->extent;
		$fx = $ext->maxx;
		$fy = $ext->miny;
		//calcula a distância entre os pontos em dd
		$distx = $fx - $px;
		$disty = $fy - $py;
		if ($distx < 0){$distx = $distx * -1;}
		if ($disty < 0){$disty = $disty * -1;}
		if ($nptx == "")
		{$nptx = round(($distx / $xdd),0);}
		if ($npty == "")
		{$npty = round(($disty / $ydd),0);}
		// cria o shapefile
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POINT);
		$def = array();
		$def[] = array("x","C","20");
		$def[] = array("y","C","20");
		$db = xbase_create($nomeshp.".dbf", $def);
		//acrescenta os pontos no novo shapefile
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$w = $this->mapa->width;
		$h = $this->mapa->height;
		if ($h > $w)
		{
			$valorlinha = $py;
			for ($linha = 0; $linha < $npty; $linha++)
			{
				$y = $valorlinha;
				$valorcoluna = $px;
				for ($coluna = 0; $coluna < $nptx; $coluna++)
				{
					$x = $valorcoluna;
					$valorcoluna = $valorcoluna + $xdd;
					$poPoint = ms_newpointobj();
					$poPoint->setXY($x,$y);
					$novoshpf->addpoint($poPoint);
					$reg[] = $x;
					$reg[] = $y;
					xbase_add_record($db,$reg);
					$reg = array();
				}
				$valorlinha = $valorlinha - $ydd;
			}
		}
		else
		{
			$valorcoluna = $px;
			for ($coluna = 0; $coluna < $nptx; $coluna++)
			{
				$x = $valorcoluna;
				$valorlinha = $py;
				for ($linha = 0; $linha < $npty; $linha++)
				{
					$y = $valorlinha;
					$valorlinha = $valorlinha - $ydd;
					$poPoint = ms_newpointobj();
					$poPoint->setXY($x,$y);
					$novoshpf->addpoint($poPoint);
					$reg[] = $x;
					$reg[] = $y;
					xbase_add_record($db,$reg);
					$reg = array();
				}
				$valorcoluna = $valorcoluna + $xdd;
			}
		}
		$novoshpf->free();
		xbase_close($db);
		//adiciona o novo tema no mapa
		$novolayer = criaLayer($this->mapa,MS_LAYER_POINT,MS_DEFAULT,("Grade (".$nomegrade.")"),$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->setmetadata("TEMALOCAL","SIM");
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return("ok");
	}
/*
function: gradeDePol

Gera uma grade de polígonos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

parameters:

$xdd - Espaçamento em x.

$ydd - Espaçamento em y.

$x - X do primeiro ponto (superior esquerdo)

$y - Y do primeiro ponto.

$locaplic - Endereço da aplicação.

$nptx - Número de pontos em X (opcional)

$npty - Número de pontos em Y (opcional)
*/
	function gradeDePol($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty)
	{
		//para manipular dbf
		require_once "../pacotes/phpxbase/api_conversion.php";
		$nomegrade = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomegrade;
		//pega a extensão geográfica do mapa
		$this->mapa->preparequery();
		$ext = $this->mapa->extent;
		$fx = $ext->maxx;
		$fy = $ext->miny;
		//calcula a distância entre os pontos em dd
		$distx = $fx - $px;
		$disty = $fy - $py;
		if ($distx < 0){$distx = $distx * -1;}
		if ($disty < 0){$disty = $disty * -1;}
		if ($nptx == "")
		{$nptx = round(($distx / $xdd),0);}
		if ($npty == "")
		{$npty = round(($disty / $ydd),0);}
		// cria o shapefile
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);
		$def = array();
		$def[] = array("id","C","20");
		$db = xbase_create($nomeshp.".dbf", $def);
		//acrescenta os pontos no novo shapefile
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$w = $this->mapa->width;
		$h = $this->mapa->height;
		if ($h > $w)
		{
			$valorlinha = $py;
			for ($linha = 0; $linha < $npty; $linha++)
			{
				$y = $valorlinha;
				$valorcoluna = $px;
				for ($coluna = 0; $coluna < $nptx; $coluna++)
				{
					$x = $valorcoluna;
					$valorcoluna = $valorcoluna + $xdd;
					$poPoint1 = ms_newpointobj();
					$poPoint2 = ms_newpointobj();
					$poPoint3 = ms_newpointobj();
					$poPoint4 = ms_newpointobj();
					$poPoint1->setXY($x,$y);
					$poPoint2->setXY(($x + $xdd),$y);
					$poPoint3->setXY(($x + $xdd),($y - $ydd));
					$poPoint4->setXY($x,($y - $ydd));
					$linhas = ms_newLineObj();
					$linhas->add($poPoint1);
					$linhas->add($poPoint2);
					$linhas->add($poPoint3);
					$linhas->add($poPoint4);
					$linhas->add($poPoint1);
					$shapen = ms_newShapeObj(MS_SHP_POLYGON);
					$shapen->add($linhas);
					$novoshpf->addShape($shapen);
					$reg[] = $linha."-".$coluna;
					xbase_add_record($db,$reg);
					$reg = array();
				}
				$valorlinha = $valorlinha - $ydd;
			}
		}
		else
		{
			$valorcoluna = $px;
			for ($coluna = 0; $coluna < $nptx; $coluna++)
			{
				$x = $valorcoluna;
				$valorlinha = $py;
				for ($linha = 0; $linha < $npty; $linha++)
				{
					$y = $valorlinha;
					$valorlinha = $valorlinha - $ydd;
					$poPoint1 = ms_newpointobj();
					$poPoint2 = ms_newpointobj();
					$poPoint3 = ms_newpointobj();
					$poPoint4 = ms_newpointobj();
					$poPoint1->setXY($x,$y);
					$poPoint2->setXY(($x + $xdd),$y);
					$poPoint3->setXY(($x + $xdd),($y - $ydd));
					$poPoint4->setXY($x,($y - $ydd));
					$linhas = ms_newLineObj();
					$linhas->add($poPoint1);
					$linhas->add($poPoint2);
					$linhas->add($poPoint3);
					$linhas->add($poPoint4);
					$linhas->add($poPoint1);
					$shapen = ms_newShapeObj(MS_SHP_POLYGON);
					$shapen->add($linhas);
					$novoshpf->addShape($shapen);
					$reg[] = $linha."-".$coluna;
					xbase_add_record($db,$reg);
					$reg = array();
				}
			$valorcoluna = $valorcoluna + $xdd;
			}
		}
		$novoshpf->free();
		xbase_close($db);
		//adiciona o novo tema no mapa
		$novolayer = criaLayer($this->mapa,MS_LAYER_POLYGON,MS_DEFAULT,("Grade (".$nomegrade.")"),$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->setmetadata("TEMALOCAL","SIM");
		$novolayer->set("transparency","50");
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return("ok");
	}
/*
function: gradeDeHex

Gera uma grade de polígonos hexagonais definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

parameters:
$xdd - Espaçamento em x.

$ydd - Espaçamento em y.

$px - X do primeiro ponto (superior esquerdo)

$py - Y do primeiro ponto.

$locaplic - Endereço da aplicação.

$nptx - Número de pontos em X (opcional)

$npty - Número de pontos em Y (opcional)
*/
	function gradeDeHex($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty)
	{
		//para manipular dbf
		require_once "../pacotes/phpxbase/api_conversion.php";
		$nomegrade = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomegrade;
		//pega a extensão geográfica do mapa
		$this->mapa->preparequery();
		$ext = $this->mapa->extent;
		$fx = $ext->maxx;
		$fy = $ext->miny;
		//calcula a distância entre os pontos em dd
		$distx = $fx - $px;
		$disty = $fy - $py;
		if ($distx < 0){$distx = $distx * -1;}
		if ($disty < 0){$disty = $disty * -1;}
		if ($nptx == "")
		{$nptx = round(($distx / $xdd),0);}
		if ($npty == "")
		{$npty = round(($disty / $ydd),0);}
		// cria o shapefile
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);
		$def = array();
		$def[] = array("id","C","20");
		$db = xbase_create($nomeshp.".dbf", $def);
		//acrescenta os pontos no novo shapefile
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$w = $this->mapa->width;
		$h = $this->mapa->height;
		if ($h > $w)
		{
			$valorlinha = $py;
			for ($linha = 0; $linha < $npty; $linha++)
			{
				$y = $valorlinha;
				$valorcoluna = $px;
				for ($coluna = 0; $coluna < $nptx; $coluna++)
				{
					$x = $valorcoluna;
					$valorcoluna = $valorcoluna + $xdd;
					$poPoint1 = ms_newpointobj();
					$poPoint2 = ms_newpointobj();
					$poPoint3 = ms_newpointobj();
					$poPoint4 = ms_newpointobj();
					$poPoint1->setXY($x,$y);
					$poPoint2->setXY(($x + $xdd),$y);
					$poPoint3->setXY(($x + $xdd),($y - $ydd));
					$poPoint4->setXY($x,($y - $ydd));
					$linhas = ms_newLineObj();
					$linhas->add($poPoint1);
					$linhas->add($poPoint2);
					$linhas->add($poPoint3);
					$linhas->add($poPoint4);
					$linhas->add($poPoint1);
					$shapen = ms_newShapeObj(MS_SHP_POLYGON);
					$shapen->add($linhas);
					$novoshpf->addShape($shapen);
					$reg[] = $linha."-".$coluna;
					xbase_add_record($db,$reg);
					$reg = array();
				}
				$valorlinha = $valorlinha - $ydd;
			}
		}
		else
		{
			$valorcoluna = $px;
			for ($coluna = 0; $coluna < $nptx; $coluna++)
			{
				$x = $valorcoluna;
				$valorlinha = $py;
				$par = true;
				for ($linha = 0; $linha < $npty; $linha++)
				{
					$y = $valorlinha;
					$valorlinha = $valorlinha - $ydd - ($ydd/2);
					$poPoint1 = ms_newpointobj();
					$poPoint2 = ms_newpointobj();
					$poPoint3 = ms_newpointobj();
					$poPoint4 = ms_newpointobj();
					$poPoint5 = ms_newpointobj();
					$poPoint6 = ms_newpointobj();
					$poPoint1->setXY($x,$y);
					$poPoint2->setXY(($x + ($xdd/2)),$y+($ydd/2));
					$poPoint3->setXY($x + $xdd,$y);
					$poPoint4->setXY($x + $xdd,$y - $ydd);
					$poPoint5->setXY(($x + ($xdd/2)),$y - $ydd - ($ydd/2));
					$poPoint6->setXY($x,$y - $ydd);
					$linhas = ms_newLineObj();
					$linhas->add($poPoint1);
					$linhas->add($poPoint2);
					$linhas->add($poPoint3);
					$linhas->add($poPoint4);
					$linhas->add($poPoint5);
					$linhas->add($poPoint6);
					$linhas->add($poPoint1);
					$shapen = ms_newShapeObj(MS_SHP_POLYGON);
					$shapen->add($linhas);
					$novoshpf->addShape($shapen);
					$reg[] = $linha."-".$coluna;
					xbase_add_record($db,$reg);
					$reg = array();
					if ($par)
					{$x=$x+($xdd/2);$par=false;}
					else
					{$x=$x-($xdd/2);$par=true;}
				}
				$valorcoluna = $valorcoluna + $xdd;
			}
		}
		$novoshpf->free();
		xbase_close($db);
		//adiciona o novo tema no mapa
		$novolayer = criaLayer($this->mapa,MS_LAYER_POLYGON,MS_DEFAULT,("Grade (".$nomegrade.")"),$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->setmetadata("TEMALOCAL","SIM");
		$novolayer->set("transparency","50");
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return("ok");
	}
/*
function: nptPol

Conta o número de pontos em polígono cruzando dois temas.

Salva o mapa acrescentando um novo layer com o resultado.

parameters:
$temaPt - Tema de pontos.

$temaPo - Tema poligonal.

$locaplic - Localização do I3geo
*/
	function nptPol($temaPt,$temaPo,$locaplic)
	{
		//para manipular dbf
		require_once "../pacotes/phpxbase/api_conversion.php";
		$layerPt = $this->mapa->getlayerbyname($temaPt);
		$layerPt->set("template","none.htm");
		$layerPo = $this->mapa->getlayerbyname($temaPo);
		$layerPo->set("template","none.htm");
		//define o nome do novo shapefile que será criado
		$nomefinal = nomeRandomico();
		$nomeshp = $this->diretorio."/".$nomefinal;
		$itenspo = pegaItens($layerPo);
		$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);
		// cria o dbf
		$def = array();
		foreach ($itenspo as $ni)
		{$def[] = array($ni,"C","254");}
		$def[] = array("npontos","N","10","0");
		$db = xbase_create($nomeshp.".dbf", $def);
		$dbname = $nomeshp.".dbf";
		$layerPo->open();
		$layerPo->whichShapes($this->mapa->extent);
		while ($shape = $layerPo->nextShape())
		{
			$novoreg = array();
			foreach($itenspo as $ipo)
			{$novoreg[] = $shape->values[$ipo];}
			$layerPt->querybyshape($shape);
			$novoreg[] = $layerPt->getNumresults();
			$novoshpf->addShape($shape);
			xbase_add_record($db,$novoreg);
		}
		$novoshpf->free();
		xbase_close($db);
		//adiciona o novo tema no mapa
		$novolayer = criaLayer($this->mapa,MS_LAYER_POLYGON,MS_DEFAULT,"N pontos",$metaClasse="SIM");
		$novolayer->set("data",$nomeshp.".shp");
		$novolayer->setmetadata("DOWNLOAD","SIM");
		$novolayer->setmetadata("TEMALOCAL","SIM");
		$novolayer->set("transparency","80");
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		return("ok");
	}
/*
function: funcoesGeometrias

Funções de análise de geometrias da ferramenta Geometrias.

parameters:
$dir_tmp - Diretório temporário do mapserver

$imgdir - Diretório das imagens do mapa atual

$lista - Arquivos com as geometrias

$operacao - Tipo de análise.
*/
	function funcoesGeometrias($dir_tmp,$imgdir,$lista,$operacao)
	{
		$lista = explode(",",$lista);
		$dir = $dir_tmp."/".$imgdir."/";
		//if ($postgis_con == "")
		//{return ("erro. Nao foi definida a conexao com o Postgis.");}
		$geometrias = array();
		$valoresoriginais = array();
		$calculo = array();
		foreach ($lista as $l)
		{
			$geos = &$this->unserializeGeo($dir.$l);
			//pega todas as geometrias
			foreach ($geos["dados"] as $geo)
			{
				//$geometrias[] = "GeomFromText('".$geo["wkt"]."')";
				$geometrias[] = ms_shapeObjFromWkt($geo["wkt"]);
				$valoresoriginais = array_merge($valoresoriginais,$geo["valores"]);
			}
		}	
		if (count($geometrias) == 1)
		{
			eval("\$nShape = \$geometrias[0]->".$operacao."();");
			$calculo[]["gwkt"] = $nShape->toWkt();
		}		
		if (count($geometrias) == 2)
		{
			eval("\$nShape = \$geometrias[0]->".$operacao."(\$geometrias[1]);");
			$calculo[]["gwkt"] = $nShape->toWkt();
		}
		if (count($geometrias) > 2)
		{
			$geoc = $geometrias[0];
			for($i=1;$i<count($geometrias);$i++)
			{
				eval("\$geoc = \$geoc->".$operacao."(\$geometrias[\$i]);");
			}
			$calculo[]["gwkt"] = $geoc->toWkt();
		}
		$nomegeo = "";
		if (count($calculo)>0)
		{
			$final["layer"] = $operacao." ".(implode(" ",$lista));
			$final["dados"][] = array("id"=>"0","wkt"=>($calculo[0]["gwkt"]),"valores"=>$valoresoriginais,"imagem"=>"");
			$nomegeo = $dir.(nomerandomico(10)).".geo";
			$this->serializeGeo($nomegeo,$final);
			$ext = $this->mapa->extent;
			$minx = $ext->minx;
			$miny = $ext->miny;
			$maxx = $ext->maxx;
			$maxy = $ext->maxy;
			$h = $this->mapa->height;
			$w = $this->mapa->width;
			$nomelayer = $this->incmapageometrias($dir_tmp,$imgdir,basename($nomegeo));
			if ($nomelayer != "erro")
			{
				
				$nlayer = $this->mapa->getlayerbyname($nomelayer);
				$bounds = $nlayer->getExtent();
				$this->mapa->setsize(30,30);
				$sb = $this->mapa->scalebar;
				$statusoriginal = $sb->status;
				$sb->set("status",MS_OFF);
	
				$ext->setextent(($bounds->minx),($bounds->miny),($bounds->maxx),($bounds->maxy));
	 			
	 			$imgo = $this->mapa->draw();
				$nomei = ($imgo->imagepath).nomeRandomico().".png";
				$imgo->saveImage($nomei);
				$nomei = ($imgo->imageurl).basename($nomei);
				$imgo->free();

				$this->mapa->setsize($w,$h);
				$ext->setextent($minx,$miny,$maxx,$maxy);			

				$nlayer->set("status",MS_DELETE);
				$sb->set("status",$statusoriginal);
				$this->salva();
				$final = array();
				$final["layer"] = $operacao." ".(implode(" ",$lista));
				$final["dados"][] = array("id"=>"0","wkt"=>($calculo[0]["gwkt"]),"valores"=>$valoresoriginais,"imagem"=>$nomei);
				$this->serializeGeo($nomegeo,$final);
			}
		}
		return($nomegeo);	
	}
	
/*
function: calculaGeometrias

Funções de cálculo de geometrias da ferramenta Geometrias.

parameters:
$dir_tmp - Diretório temporário do mapserver

$imgdir - Diretório das imagens do mapa atual

$lista - Arquivos com as geometrias

$operacao - Tipo de análise.
*/
	function calculaGeometrias($dir_tmp,$imgdir,$lista,$operacao,$postgis_con,$srid_area)
	{
		$lista = explode(",",$lista);
		$dir = $dir_tmp."/".$imgdir."/";
		if ($postgis_con == "")
		{return ("erro. Nao foi definida a conexao com o Postgis.");}
		foreach ($lista as $l)
		{
			$geos = &$this->unserializeGeo($dir.$l);
			foreach ($geos["dados"] as &$geo)
			{
				$g = $geo["wkt"];
				$pgconn = pg_connect($postgis_con);
				switch ($operacao)
				{
					case "perimetro":
						$sql = "select perimeter(transform( GeomFromText('$g',4291),$srid_area))::float as perim";
						$result=pg_query($pgconn, $sql);
						pg_close($pgconn);	
						$calculo = pg_fetch_all($result);
						$geo["valores"][] = array("item"=>"P_perim_metros","valor"=>$calculo[0]["perim"]);
					break;
					case "area":
						$sql = "select area(transform( GeomFromText('$g',4291),$srid_area))::float as aream";
						$result=pg_query($pgconn, $sql);
						pg_close($pgconn);	
						$calculo = pg_fetch_all($result);
						$geo["valores"][] = array("item"=>"P_area_metros","valor"=>$calculo[0]["aream"]);
					break;
					case "comprimento":
						$sql = "select length(transform( GeomFromText('$g',4291),$srid_area))::float as compm";
						$result=pg_query($pgconn, $sql);
						pg_close($pgconn);	
						$calculo = pg_fetch_all($result);
						$geo["valores"][] = array("item"=>"P_compr_metros","valor"=>$calculo[0]["compm"]);	
					break;
				}
			}
			$this->serializeGeo($dir.$l,$geos);
		}
		return("ok");	


		
		/* utiliza o geos
		$lista = explode(",",$lista);
		$dir = $dir_tmp."/".$imgdir."/";
		foreach ($lista as $l)
		{
			$geos = &$this->unserializeGeo($dir.$l);
			foreach ($geos["dados"] as &$geo)
			{
				//cria objeto projecao
				$projInObj = ms_newprojectionobj("proj=latlong,ellps=GRS67");
				$projOutObj = ms_newprojectionobj("proj=laea,ellps=GRS67,lat_0=-12,lon_0=-52,x_0=500000,y_0=10000000,units=m");				
				$g = ms_shapeObjFromWkt($geo["wkt"]);
				$p = $g->project($projInObj,$projOutObj);
				switch ($operacao)
				{
					case "comprimento":
						$valor = $g->getLength();
						$geo["valores"][] = array("item"=>"P_perim_metros","valor"=>$valor);
					break;
					case "area":
						$valor = $g->getArea();
						$geo["valores"][] = array("item"=>"P_area_metros","valor"=>$valor);
					break;
				}
			}
			$this->serializeGeo($dir.$l,$geos);
		}
		return("ok");
		*/	
	}
/*
function: incmapageometrias

Insere geometrias como tema no mapa.

parameters:
$dir_tmp - Diretório temporário do mapserver

$imgdir - Diretório das imagens do mapa atual

$lista - Nomes, sem o caminho, dos arquivos com as geometrias, separados por vírgula.

$operacao - Tipo de análise.

*/
	function incmapageometrias($dir_tmp,$imgdir,$lista)
	{
		$lista = explode(",",$lista);
		$dir = $dir_tmp."/".$imgdir."/";
		//if ($postgis_con == "")
		//{return ("erro. Nao foi definida a conexao com o Postgis.");}
		$shapes = array();
		$valoresoriginais = array();
		foreach ($lista as $l)
		{
			$geos = &$this->unserializeGeo($dir.$l);
			//pega todas as geometrias
			foreach ($geos["dados"] as $geo)
			{
				//echo $geo["wkt"]."<br>";
				$shapes[] = ms_shapeObjFromWkt(str_replace("'","",$geo["wkt"]));
				foreach ($geo["valores"] as $v)
				{$valorestemp[] = $v["item"]."=".$v["valor"];}
				$valoresoriginais[] = implode(" ",$valorestemp);
			}
		}
		//verifica o tipo
		if (count($shapes) == 0){return("erro.");}
		$tiposhape = $shapes[0]->type;
		$tiposhapefile = MS_SHP_POLYGON;
		if ($tiposhape == 0){$tiposhapefile = MS_SHP_MULTIPOINT;}
		if ($tiposhape == 1){$tiposhapefile = MS_SHP_ARC;}
		//cria o shapefile
		require_once "../pacotes/phpxbase/api_conversion.php";
		$diretorio = dirname($this->arquivo);
		$novonomelayer = nomeRandomico();
		$nomeshp = $diretorio."/".$novonomelayer;
		$l = criaLayer($this->mapa,$tiposhape,MS_DEFAULT,"Ins","SIM");
		$novoshpf = ms_newShapefileObj($nomeshp, $tiposhapefile);
		$def[] = array("ID","C","250");
		$db = xbase_create($nomeshp.".dbf", $def);
		$conta = 0;
		foreach ($shapes as $s)
		{
			$reg = array();
			$reg[] = $valoresoriginais[$conta];
			xbase_add_record($db,$reg);
			$novoshpf->addshape($s);
			$conta = $conta + 1;
		}
		xbase_close($db);
		$novoshpf->free();
		$l->setmetadata("tema",$novonomelayer." geometria");
		$l->setmetadata("TEMALOCAL","SIM");
		$l->setmetadata("DOWNLOAD","sim");
		$l->set("data",$nomeshp);
		$l->set("name",$novonomelayer);
		$classe = $l->getclass(0);
		$estilo = $classe->getstyle(0);
		if ($tiposhape == 0)
		{
			$estilo->set("symbolname","ponto");
			$estilo->set("size",6);
		}
		$cor = $estilo->color;
		$cor->setrgb(255,210,0);
		$cor = $estilo->outlinecolor;
		$cor->setrgb(255,0,0);
		$this->salva();
		return($novonomelayer);
	}
/*
function unserializeGeo

Deserializa um arquivo de geometrias.

Parameters:
$arquivo - arquivo que será processado
*/ 	 	
	public function unserializeGeo($arq)
	{
		$handle = fopen ($arq, "r");
		$conteudo = fread ($handle, filesize ($arq));
		fclose ($handle);
		return(unserialize($conteudo));
	}
/*
function serializeGeo

Deserializa um arquivo de geometrias.

Parameters:
$arquivo - arquivo que será processado

$geos - array com os dados
*/ 	 	
	public function serializeGeo($arq,$geos)
	{
		if (file_exists($arq))
		{unlink($arq);}
		$fp = fopen($arq,"w");
		$r = serialize($geos);
		fwrite($fp,$r);
		fclose($fp);
	}
}
?>