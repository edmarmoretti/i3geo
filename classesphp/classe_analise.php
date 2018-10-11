<?php
/*
 * Title: classe_analise.php
 *
 * Gera an&aacute;lises espaciais, como buffer, calculo de centr�ides, etc.
 *
 * Licenca:
 *
 * GPL2
 *
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo:
 *
 * i3geo/classesphp/classe_analise.php
 */
/*
 * Classe: Analise
 *
 */
class Analise {
	/*
	 * Variavel: $mapa
	 *
	 * Objeto mapa
	 */
	public $mapa;
	/*
	 * Variavel: $arquivo
	 *
	 * Arquivo map file
	 */
	protected $arquivo;
	/*
	 * Variavel: $layer
	 *
	 * Objeto layer
	 */
	protected $layer;
	/*
	 * Variavel: $nome
	 *
	 * Nome do layer
	 */
	protected $nome;
	/*
	 * Variavel: $diretorio
	 *
	 * Diret&oacute;rio do arquivo map_file
	 */
	protected $diretorio;
	/*
	 * Variavel: $qyfile
	 *
	 * Nome do arquivo de sele&ccedil;&atilde;o (.qy)
	 */
	public $qyfile;
	/*
	 * Variavel: $v
	 *
	 * Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
	 */
	public $v;
	/*
	 * Variavel: $dbaseExiste
	 *
	 * Indica se a biblioteca dbase est&aacute; carregada
	 */
	protected $dbaseExiste;
	/*
	 * Function: __construct
	 *
	 * Cria um objeto Analise
	 *
	 * parameters:
	 *
	 * $map_file - Endere&ccedil;o do mapfile no servidor.
	 *
	 * $tema - Nome do tema que ser&aacute; processado
	 *
	 * $ext - Extens&atilde;o geogr&aacute;fica do mapa
	 */
	function __construct($map_file, $tema = "", $locaplic = "", $ext = "") {
		include (dirname ( __FILE__ ) . "/../ms_configura.php");
		$this->postgis_mapa = $postgis_mapa;

		$this->qyfile = str_replace ( ".map", ".qy", $map_file );
		include_once (dirname ( __FILE__ ) . "/funcoes_gerais.php");
		if (empty ( $locaplic )) {
			$locaplic = dirname ( __FILE__ ) . "/..";
		}
		$this->v = versao ();
		$this->v = $this->v ["principal"];
		$this->dbaseExiste = false;
		if (function_exists ( "dbase_create" )) {
			$this->dbaseExiste = true;
		}
		$this->locaplic = $locaplic;
		$this->mapa = ms_newMapObj ( $map_file );
		substituiConObj ( $this->mapa, $postgis_mapa );

		$this->arquivo = str_replace ( ".map", "", $map_file ) . ".map";
		if ($tema != "" && @$this->mapa->getlayerbyname ( $tema )) {
			$this->layer = $this->mapa->getlayerbyname ( $tema );
		}
		$this->nome = $tema;
		$this->diretorio = dirname ( $this->arquivo );
		if ($ext && $ext != "") {
			$e = explode ( " ", $ext );
			$extatual = $this->mapa->extent;
			$extatual->setextent ( (min ( $e [0], $e [2] )), (min ( $e [1], $e [3] )), (max ( $e [0], $e [2] )), (max ( $e [1], $e [3] )) );
		}
	}
	/*
	 * Method: criaDefDb
	 *
	 * Cria um array contendo as defini&ccedil;&otilde;es das colunas que ser&atilde;o criadas em uma tabela DBF conforme as exig&ecirc;ncias de arquivos dbf
	 *
	 * parameters:
	 *
	 * $itens - array com os nomes originais das colunas
	 *
	 * return:
	 * {array}
	 */
	function criaDefDb($itens, $unico = true) {
		$c = 0;
		$def = array ();
		foreach ( $itens as $ni ) {
			$ni = strtoupper ( $ni );
			if ($unico == true) {
				$def [] = array (
						substr ( $ni, 0, 8 ) . $c,
						"C",
						"254"
				);
			} else {
				$def [] = array (
						$ni,
						"C",
						"254"
				);
			}
			$c = $c + 1;
		}
		return $def;
	}
	/*
	 * Method: truncaS
	 *
	 * Trunca o comprimento de uma string em 255 caracteres
	 *
	 * parameters:
	 *
	 * $s - string
	 *
	 * return
	 * {string}
	 */
	function truncaS($s) {
		if (strlen ( $s ) > 255) {
			$s = substr ( $s, 0, 255 );
		}
		return $s;
	}
	/*
	 * Method: salva
	 *
	 * Salva o mapfile atual
	 */
	function salva() {
		restauraConObj ( $this->mapa, $this->postgis_mapa );
		$this->mapa->save ( $this->arquivo );
	}

	/*
	 * function: analiseDistriPt
	 *
	 * Gera an&aacute;lise de distribui&ccedil;&atilde;o de pontos.
	 *
	 * Executa script R para gerar a imagem.
	 *
	 * parameters:
	 *
	 * $locaplic - Localiza&ccedil;&atilde;o da aplica&ccedil;&atilde;o I3Geo
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver
	 *
	 * $R_path - Onde fica o R
	 *
	 * $numclasses - N&uacute;mero de classes que ser&atilde;o representadas
	 *
	 * $tipo - Tipo de an&aacute;lise.
	 *
	 * $cori - Cor inicial em rgb.
	 *
	 * $corf - Cor final em rgb.
	 *
	 * $tmpurl - Url com o nome da imagem final (apenas para relatorio)
	 *
	 * $sigma - desvio padr&atilde;o para a op&ccedil;&atilde;o kernel
	 *
	 * $limitepontos - "TRUE"|"FALSE" limita o resultado ao limite geogr&aacute;fico dos pontos se "TRUE" ou ao limite do mapa se "FALSE"
	 *
	 * $extendelimite - extende o limite dos pontos em um determinado percentual em rela&ccedil;&atilde;o a &aacute;rea final de abrang&ecirc;ncia
	 *
	 * $item - item contendo os pesos utilizado na operacao de calculo de densidade (opcional)
	 *
	 * Include:
	 * <class.palette.php>
	 */
	function analiseDistriPt($locaplic, $dir_tmp, $R_path, $numclasses, $tipo, $cori, $corf, $tmpurl, $sigma = "", $limitepontos = "TRUE", $tema2 = "", $extendelimite = 5, $item = "") {
		set_time_limit ( 120 );
		//error_reporting(0);
		//
		// pega os dados do tema dois para as fun&ccedil;&otilde;es que o utilizam
		//
		$dados1 = $this->gravaCoordenadasPt ( $this->nome, $limitepontos, $extendelimite, $item );
		$nomearq = $dados1 ["prefixoarquivo"];
		$dimx = $dados1 ["dimx"];
		$dimy = $dados1 ["dimy"];
		$dimz = @$dados1 ["dimz"];

		if (isset ( $tema2 ) && $tema2 != "") {
			$dados2 = $this->gravaCoordenadasPt ( $tema2, $limitepontos, $extendelimite );
			$nomearq2 = $dados2 ["prefixoarquivo"];
			$dimx2 = $dados2 ["dimx"];
			$dimy2 = $dados2 ["dimy"];
		}
		switch ($tipo) {
			// cluster espacial
			case "cluster" :
				$this->mapaCluster ( $nomearq, $nomearq2, $dimx, $dimy, $dir_tmp, $R_path, $locaplic );
				return "ok";
				break;
			// delaunay e voronoi
			case "deldir" :
				// //error_reporting(0);
				$this->mapaDeldir ( $nomearq, $dir_tmp, $R_path, $locaplic );
				$this->deldirDir2shp ( $nomearq . "dirsgs", $dir_tmp, $locaplic );
				$this->deldirDel2shp ( $nomearq . "delsgs", $dir_tmp, $locaplic );
				return "ok";
				break;
			case "kernel" :
				$this->mapaKernel ( $nomearq, $dimx, $dimy, $dir_tmp, $R_path, $locaplic, $sigma );
				break;
			case "densidade" :
				$this->mapaDensidade ( $nomearq, $dimx, $dimy, $dir_tmp, $R_path, $locaplic, $dimz );
				break;
			case "distancia" :
				$this->mapaDistancia ( $nomearq, $dimx, $dimy, $dir_tmp, $R_path, $locaplic );
				break;
			case "relatorio" :
				$r = $this->mapaRelatorioAnaliseDist ( $nomearq, $dimx, $dimy, $dir_tmp, $R_path, $locaplic );
				return file_get_contents($nomearq);
				break;
		}
		// cria a imagem
		$minmax = $this->criaImagemR ( $nomearq );
		// cria as cores
		include_once ("class.palette.php");
		$cori = RGB2hex ( explode ( ",", $cori ) );
		$corf = RGB2hex ( explode ( ",", $corf ) );
		$myPalette = new palette ( array (
				$cori,
				$corf
		), ($numclasses + 1) );
		// cria os parametros das classes
		$cls = $this->classesRasterI ( $minmax [0], $minmax [1], $numclasses, $myPalette->colorRGB );

		if (count ( $cls ) != $numclasses) {
			return false;
		}
		// adiciona o novo tema
		if (file_exists ( $nomearq . ".png" )) {
			$novolayer = criaLayer ( $this->mapa, MS_LAYER_RASTER, MS_DEFAULT, ($tipo . " (" . $this->nome . ")"), $metaClasse = "SIM" );
			$novolayer->set ( "data", $nomearq . ".png" );
			$novolayer->set ( "template", "none.htm" );
			$novolayer->setmetadata ( "download", "sim" );
			// classes
			$numclassesatual = $novolayer->numclasses;
			for($i = 0; $i < $numclassesatual; ++ $i) {
				$classe = $novolayer->getClass ( $i );
				$classe->set ( "status", MS_DELETE );
			}
			for($i = 0; $i < $numclasses; ++ $i) {
				$classe = ms_newClassObj ( $novolayer );
				$novoestilo = ms_newStyleObj ( $classe );
				$ncor = $novoestilo->color;
				$cores = $cls [$i] ["cores"];
				$ncor->setrgb ( $cores [0], $cores [1], $cores [2] );
				$classe->setexpression ( $cls [$i] ["expressao"] );
				$classe->set ( "name", $cls [$i] ["nomeclasse"] );
			}
			$of = $this->mapa->outputformat;
			// $of->set("imagemode",MS_IMAGEMODE_RGB);
			//
			// reposiciona o layer
			//
			$layer = $this->mapa->getlayerbyname ( $this->nome );
			if ($layer != "") {
				$temp = ms_newLayerObj ( $this->mapa, $novolayer );
				$novolayer->set ( "status", MS_DELETE );
				$temp = ms_newLayerObj ( $this->mapa, $layer );
				$layer->set ( "status", MS_DELETE );
			} else {
				$indicel = $novolayer->index;
				$numlayers = $this->mapa->numlayers;
				$nummove = 0;
				for($i = $numlayers - 1; $i > 0; $i --) {
					$layerAbaixo = $this->mapa->getlayer ( $i );
					$tipo = $layerAbaixo->type;
					if (($tipo != 2) && ($tipo != 3)) {
						$nummove ++;
					}
				}
				if ($nummove > 2) {
					for($i = 0; $i <= ($nummove - 3); ++ $i) {
						$this->mapa->movelayerup ( $indicel );
					}
				}
			}
		} else {
			return false;
		}
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return ($novolayer->name);
	}
	/*
	 * function: mapaRelatorioAnaliseDist
	 *
	 * Gera um relat�rio da an&aacute;lise de distribui&ccedil;&atilde;o de pontos.
	 *
	 * Executa script R para gerar relat�rio .
	 *
	 * parameters:
	 *
	 * $arqpt - Prefixo dos arquivos em disco com os pontos.
	 *
	 * $dimx - Range em x no formato R c(-54,-53).
	 *
	 * $dimy - Range em y no formato R c(-25,-23).
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver.
	 *
	 * $R_path - Onde fica o R.
	 *
	 * $locaplic - Onde fica o I3Geo.
	 */
	function mapaRelatorioAnaliseDist($arqpt, $dimx, $dimy, $dir_tmp, $R_path, $locaplic) {
		set_time_limit ( 180 );
		$nomedir = dirname ( $arqpt ) . "/";
		$nomeurl = str_replace("/tmp","",$nomedir);
		$rcode [] = 'dadosx<-scan("' . $arqpt . 'x")';
		$rcode [] = 'dadosy<-scan("' . $arqpt . 'y")';
		$tipoimg = "bitmap";
		if (strtoupper ( substr ( PHP_OS, 0, 3 ) == 'WIN' )) {
			$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/win")';
			if (file_exists ( $locaplic . '/pacotes/rlib/win' ))
				$rcode [] = $lib;
			$tipoimg = "png";
		} else {
			if (file_exists ( $locaplic . "/pacotes/rlib/linux" )) {
				$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/linux")';
				$rcode [] = $lib;
			}
		}
		$rcode [] = 'library(spatstat)';
		$rcode [] = 'oppp <- ppp(dadosx, dadosy, ' . $dimx . ',' . $dimy . ')';
		$rcode [] = 'img<-distmap(oppp)';
		$rcode [] = 'zz <- file("' . $arqpt . '", "w")';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><b>Dist&acirc;ncia</b>\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'distancia.png")';
		$rcode [] = 'plot(img,main="")';
		$rcode [] = 'points(oppp$x,oppp$y,pch="x",col=1)';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br></pre><img src='.$nomeurl.'/distancia.png />\n", file = zz)';
		$rcode [] = 'cat("<br>Resumo<pre>\n", file = zz)';
		$rcode [] = 'summary(img)';
		$rcode [] = 'cat("<br></pre>Quartis<pre>\n", file = zz)';
		$rcode [] = 'quantile.im(img)';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br>Histograma\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'histdistancia.png")';
		$rcode [] = 'hist.im(img,main="")';
		$rcode [] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><img src='.$nomeurl.'/histdistancia.png />\n", file = zz)';
		$rcode [] = 'cat("<br></pre>Perspectiva\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'perspdistancia.png")';
		$rcode [] = 'p<-persp.im(img,colmap=terrain.colors(128),shade=0.3,theta=30,phi=45,main="")';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><img src='.$nomeurl.'/perspdistancia.png />\n", file = zz)';
		$rcode [] = 'cat("<br></pre>Contorno\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'contordistancia.png")';
		$rcode [] = 'contour.im(img,main="")';
		$rcode [] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><img src='.$nomeurl.'/contordistancia.png />\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = 'img<-density.ppp(oppp)';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><b>Densidade</b>\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'densidade.png")';
		$rcode [] = 'plot(img,main="")';
		$rcode [] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br></pre><img src='.$nomeurl.'/densidade.png />\n", file = zz)';
		$rcode [] = 'cat("<br>Resumo<pre>\n", file = zz)';
		$rcode [] = 'summary(img)';
		$rcode [] = 'cat("<br></pre>Quartis<pre>\n", file = zz)';
		$rcode [] = 'quantile.im(img)';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br>Histograma\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'histdensidade.png")';
		$rcode [] = 'hist.im(img,main="")';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><img src='.$nomeurl.'/histdensidade.png />\n", file = zz)';
		$rcode [] = 'cat("<br></pre>Perspectiva\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'perspdensidade.png")';
		$rcode [] = 'p<-persp.im(img,colmap=terrain.colors(128),shade=0.3,theta=30,phi=45,main="")';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><img src='.$nomeurl.'/perspdensidade.png />\n", file = zz)';
		$rcode [] = 'cat("<br></pre>Contorno\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = $tipoimg . '(file="' . $nomedir . 'contordensidade.png")#,height =600, width = 600, res = 72)';
		$rcode [] = 'contour.im(img,main="")';
		$rcode [] = 'points(oppp$x,oppp$y,pch="x",col=2)';
		$rcode [] = 'dev.off()';
		$rcode [] = 'sink(zz)';
		$rcode [] = 'cat("<br><img src='.$nomeurl.'/contordensidade.png />\n", file = zz)';
		$rcode [] = 'sink()';
		$rcode [] = 'close(zz)';
		$r = $this->executaR ( $rcode, $dir_tmp, $R_path );
	}
	/*
	 * function: mapaCluster
	 *
	 * Gera um mapa de cluster.
	 *
	 * Executa script R para gerar os dados.
	 *
	 * parameters:
	 *
	 * $arqpt - Prefixo dos arquivos em disco com os pontos.
	 *
	 * $dimx - Range em x no formato R c(-54,-53).
	 *
	 * $dimy - Range em y no formato R c(-25,-23).
	 *
	 * $dir_tmp - Diretorio tempor&aacute;rio do mapserver.
	 *
	 * $R_path - Onde fica o R.
	 *
	 * $locaplic - Onde fica o I3Geo.
	 *
	 * $sigma - Bandwidth for kernel smoother in "smooth" option.
	 */
	function mapaCluster($arqpt, $arqpt2, $dimx, $dimy, $dir_tmp, $R_path, $locaplic) {
		$gfile_name = nomeRandomico ( 20 );
		$rcode [] = 'dadosx<-scan("' . $arqpt . 'x")';
		$rcode [] = 'dadosy<-scan("' . $arqpt . 'y")';
		$rcode [] = 'dadosx2<-scan("' . $arqpt2 . 'x")';
		$rcode [] = 'dadosy2<-scan("' . $arqpt2 . 'y")';
		$rcode [] = 'd1<-data.frame(cbind(dadosx,dadosy))';
		$rcode [] = 'names(d1)<-(c("x","y"))';
		$rcode [] = 'd2<-data.frame(cbind(dadosx2,dadosy2))';
		$rcode [] = 'names(d2)<-(c("col1","col2"))';
		$rcode [] = 'd2<-as.matrix.data.frame(d2)';
		if (strtoupper ( substr ( PHP_OS, 0, 3 ) == 'WIN' )) {
			$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/win")';
			if (file_exists ( $locaplic . '/pacotes/rlib/win' ))
				$rcode [] = $lib;
		} else {
			if (file_exists ( $locaplic . "/pacotes/rlib/linux" )) {
				$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/linux")';
				$rcode [] = $lib;
			}
		}
		$rcode [] = 'library(spatclus)';
		$rcode [] = 'RES <- clus(d1,d2,limx=' . $dimx . ',limy=' . $dimy . ',eps=0.2)';
		// var_dump($rcode);
		$r = $this->executaR ( $rcode, $dir_tmp, $R_path, $gfile_name );
		return "ok";
	}

	/*
	 * function: mapaKernel
	 *
	 * Gera um mapa de kernel.
	 *
	 * Executa script R para gerar a imagem.
	 *
	 * parameters:
	 * $arqpt - Prefixo dos arquivos em disco com os pontos.
	 *
	 * $dimx - Range em x no formato R c(-54,-53).
	 *
	 * $dimy - Range em y no formato R c(-25,-23).
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver.
	 *
	 * $R_path - Onde fica o R.
	 *
	 * $locaplic - Onde fica o I3Geo.
	 *
	 * $sigma - Bandwidth for kernel smoother in "smooth" option.
	 */
	function mapaKernel($arqpt, $dimx, $dimy, $dir_tmp, $R_path, $locaplic, $sigma = "") {
		$gfile_name = nomeRandomico ( 20 );
		$graf = "png";
		$rcode [] = 'dadosx<-scan("' . $arqpt . 'x")';
		$rcode [] = 'dadosy<-scan("' . $arqpt . 'y")';
		if (strtoupper ( substr ( PHP_OS, 0, 3 ) == 'WIN' )) {
			$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/win")';
			if (file_exists ( $locaplic . '/pacotes/rlib/win' ))
				$rcode [] = $lib;
			$tipoimg = "png";
		} else {
			if (file_exists ( $locaplic . "/pacotes/rlib/linux" )) {
				$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/linux")';
				$rcode [] = $lib;
			}
		}
		$rcode [] = 'library(spatstat)';
		$rcode [] = 'pt <- ppp(dadosx, dadosy, ' . $dimx . ',' . $dimy . ')';
		$rcode [] = 'img <- ksmooth.ppp(pt';
		if (is_numeric ( $sigma )) {
			$rcode [] = ',sigma=' . $sigma . ')';
		} else {
			$rcode [] = ')';
		}
		$rcode [] = 'cat(img$v,file="' . $arqpt . 'img",fill=FALSE)';
		$rcode [] = 'cat(img$xstep,file="' . $arqpt . 'h",fill=TRUE)';
		$rcode [] = 'cat(img$ystep,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$xrange,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$yrange,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$dim,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		// var_dump($rcode);
		$r = $this->executaR ( $rcode, $dir_tmp, $R_path, $gfile_name );
		return "ok";
	}
	/*
	 * function: mapaDensidade
	 *
	 * Gera um mapa de densidade de pontos.
	 *
	 * Executa script R para gerar a imagem.
	 *
	 * parameters:
	 * $arqpt - Prefixo dos arquivos em disco com os pontos.
	 *
	 * $dimx - Range em x no formato R c(-54,-53).
	 *
	 * $dimy - Range em y no formato R c(-25,-23).
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver.
	 *
	 * $R_path - Onde fica o R.
	 *
	 * $locaplic - Onde fica o I3Geo.
	 *
	 * $dimz - arquivo opcional com os valores de z
	 */
	function mapaDensidade($arqpt, $dimx, $dimy, $dir_tmp, $R_path, $locaplic, $dimz = "") {
		$gfile_name = nomeRandomico ( 20 );
		$graf = "png";
		$rcode [] = 'dadosx<-scan("' . $arqpt . 'x")';
		$rcode [] = 'dadosy<-scan("' . $arqpt . 'y")';
		$rcode [] = 'dadosz<-scan("' . $arqpt . 'z")';
		if (strtoupper ( substr ( PHP_OS, 0, 3 ) == 'WIN' )) {
			$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/win")';
			if (file_exists ( $locaplic . '/pacotes/rlib/win' ))
				$rcode [] = $lib;
			$tipoimg = "png";
		} else {
			if (file_exists ( $locaplic . "/pacotes/rlib/linux" )) {
				$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/linux")';
				$rcode [] = $lib;
			}
		}
		$rcode [] = 'library(spatstat)';
		$rcode [] = 'pt <- ppp(dadosx, dadosy, ' . $dimx . ',' . $dimy . ')';
		if ($dimz == "") {
			$rcode [] = 'img <- density.ppp(pt)';
		} else {
			$rcode [] = 'img <- smooth.ppp(pt, weights = dadosz)';
		}
		$rcode [] = 'cat(img$v,file="' . $arqpt . 'img",fill=FALSE)';
		$rcode [] = 'cat(img$xstep,file="' . $arqpt . 'h",fill=TRUE)';
		$rcode [] = 'cat(img$ystep,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$xrange,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$yrange,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$dim,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$r = $this->executaR ( $rcode, $dir_tmp, $R_path, $gfile_name );
		return "ok";
	}
	/*
	 * function: mapaDistancia
	 *
	 * Gera um mapa de distancia de pontos.
	 *
	 * Executa script R para gerar a imagem.
	 *
	 * parameters:
	 *
	 * $arqpt - Prefixo dos arquivos em disco com os pontos.
	 *
	 * $dimx - Range em x no formato R c(-54,-53).
	 *
	 * $dimy - Range em y no formato R c(-25,-23).
	 *
	 * $dir_tmp - Diretorio tempor&aacute;rio do mapserver.
	 *
	 * $R_path - Onde fica o R.
	 *
	 * $locaplic - Onde fica o I3Geo.
	 */
	function mapaDistancia($arqpt, $dimx, $dimy, $dir_tmp, $R_path, $locaplic) {
		$gfile_name = nomeRandomico ( 20 );
		$graf = "png";
		$rcode [] = 'dadosx<-scan("' . $arqpt . 'x")';
		$rcode [] = 'dadosy<-scan("' . $arqpt . 'y")';
		if (strtoupper ( substr ( PHP_OS, 0, 3 ) == 'WIN' )) {
			$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/win")';
			if (file_exists ( $locaplic . '/pacotes/rlib/win' ))
				$rcode [] = $lib;
			$tipoimg = "png";
		} else {
			if (file_exists ( $locaplic . "/pacotes/rlib/linux" )) {
				$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/linux")';
				$rcode [] = $lib;
			}
		}
		$rcode [] = 'library(spatstat)';
		$rcode [] = 'pt <- ppp(dadosx, dadosy, ' . $dimx . ',' . $dimy . ')';
		$rcode [] = 'img <- distmap(pt)';
		$rcode [] = 'cat(img$xstep,file="' . $arqpt . 'h",fill=TRUE)';
		$rcode [] = 'cat(img$ystep,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$xrange,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$yrange,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$dim,file="' . $arqpt . 'h",append=TRUE,fill=TRUE)';
		$rcode [] = 'cat(img$v,file="' . $arqpt . 'img",fill=FALSE)';
		$r = $this->executaR ( $rcode, $dir_tmp, $R_path, $gfile_name );
		return "ok";
	}
	/*
	 * function: mapaDeldir
	 *
	 * Calcula a triangula&ccedil;&atilde;o de Delaunay e diagrama de Voronoi.
	 *
	 * Para funcionar, &eacute; necess&aacute;rio a instala&ccedil;&atilde;o da biblioteca deldir do R.
	 *
	 * http://cran.r-project.org/web/packages/deldir
	 *
	 * parameters:
	 *
	 * $arqpt - Prefixo dos arquivos em disco com os pontos.
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver.
	 *
	 * $R_path - Onde fica o R.
	 *
	 * $locaplic - Onde fica o I3Geo.
	 */
	function mapaDeldir($arqpt, $dir_tmp, $R_path, $locaplic) {
		$gfile_name = nomeRandomico ( 20 );
		$rcode [] = 'dadosx<-scan("' . $arqpt . 'x")';
		$rcode [] = 'dadosy<-scan("' . $arqpt . 'y")';
		if (strtoupper ( substr ( PHP_OS, 0, 3 ) == 'WIN' )) {
			$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/win")';
			if (file_exists ( $locaplic . '/pacotes/rlib/win' ))
				$rcode [] = $lib;
		} else {
			if (file_exists ( $locaplic . "/pacotes/rlib/linux" )) {
				$lib = '.libPaths("' . $locaplic . '/pacotes/rlib/linux")';
				$rcode [] = $lib;
			}
		}
		$rcode [] = 'library(deldir)';

		$rcode [] = 'pt <- deldir(dadosx, dadosy)';
		$rcode [] = 'write.csv(pt$delsgs,file="' . $arqpt . 'delsgs")';
		$rcode [] = 'write.csv(pt$dirsgs,file="' . $arqpt . 'dirsgs")';
		$r = $this->executaR ( $rcode, $dir_tmp, $R_path, $gfile_name );
		return "ok";
	}
	/*
	 * function deldirDel2shp
	 *
	 * L&ecirc; um arquivo CSV gerado pelo software R com os dados referentes a triangula&ccedil;&atilde;o de Delaunay.
	 *
	 * O arquivo CSV &eacute; lido e convertido em um shape file que &eacute; ent&atilde;o adicionado ao mapa.
	 *
	 * Parametros:
	 *
	 * $nomearq - nome do arquivo CSV
	 *
	 * $dir_tmp - diretorio tempor&aacute;rio do Mapserver
	 *
	 * $locaplic - diretorio da aplica&ccedil;&atilde;o i3geo
	 */
	function deldirDel2shp($nomearq, $dir_tmp, $locaplic) {
		if (file_exists ( $nomearq )) {
			if ($this->dbaseExiste == false) {
				include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
			}
			// define o nome do novo shapefile que ser&aacute; criado
			$nomefinal = nomeRandomico ();
			$nomeshp = $this->diretorio . "/" . $nomefinal;
			// cria o shape file
			$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_ARC );
			// cria o dbf
			$def [] = array (
					"x1",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"y1",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"x2",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"y2",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"ind1",
					"N",
					"5",
					"0"
			);
			$def [] = array (
					"ind2",
					"N",
					"5",
					"0"
			);
			if ($this->dbaseExiste == false) {
				$db = xbase_create ( $nomeshp . ".dbf", $def );
			} else {
				$db = dbase_create ( $nomeshp . ".dbf", $def );
			}
			$dbname = $nomeshp . ".dbf";
			// le o arquivo linha a linha, pulando a primeira
			// acrescenta os pontos no shape file formando as linhas
			$abre = fopen ( $nomearq, "r" );
			$buffer = fgets ( $abre );
			$poligonos = array ();
			while ( ! feof ( $abre ) ) {
				$buffer = fgets ( $abre );
				$i = explode ( ",", $buffer );
				if (is_array ( $i )) {
					$i1 = floatval ( $i [1] );
					$i2 = floatval ( $i [2] );
					$i3 = floatval ( $i [3] );
					$i4 = floatval ( $i [4] );
					$i5 = floatval ( $i [5] );
					$i6 = floatval ( $i [6] );
					$poPoint1 = ms_newpointobj ();
					$poPoint1->setXY ( $i1, $i2 );
					$poPoint2 = ms_newpointobj ();
					$poPoint2->setXY ( $i3, $i4 );
					$linha = ms_newLineObj ();
					$linha->add ( $poPoint1 );
					$linha->add ( $poPoint2 );
					$ShapeObj = ms_newShapeObj ( MS_SHAPE_LINE );
					$ShapeObj->add ( $linha );
					$novoshpf->addShape ( $ShapeObj );
					$registro = array (
							$i1,
							$i2,
							$i3,
							$i4,
							$i5,
							$i6
					);
					if ($this->dbaseExiste == false)
						xbase_add_record ( $db, $registro );
					else
						dbase_add_record ( $db, $registro );
				}
			}
			if ($this->dbaseExiste == false)
				xbase_close ( $db );
			else
				dbase_close ( $db );
			fclose ( $abre );
			// adiciona no mapa atual o novo tema
			$novolayer = criaLayer ( $this->mapa, MS_LAYER_LINE, MS_DEFAULT, ("Delaunay (" . $nomefinal . ")"), $metaClasse = "SIM" );
			$novolayer->set ( "data", $nomeshp . ".shp" );
			$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
			$novolayer->set ( "template", "none.htm" );
			$classe = $novolayer->getclass ( 0 );
			$estilo = $classe->getstyle ( 0 );
			//$estilo->set ( "symbolname", "linha" );
			$estilo->set ( "width", 2 );
			$cor = $estilo->color;
			$cor->setrgb ( 255, 50, 0 );
		}
	}
	/*
	 * function deldirDir2shp
	 *
	 * L&ecirc; um arquivo CSV gerado pelo software R com os dados referentes ao diagrama de Voronoi.
	 *
	 * O arquivo CSV &eacute; lido e convertido em um shape file que &eacute; ent&atilde;o adicionado ao mapa.
	 *
	 * Parametros:
	 *
	 * $nomearq - nome do arquivo CSV
	 *
	 * $dir_tmp - diretorio tempor&aacute;rio do Mapserver
	 *
	 * $locaplic - diretorio da aplica&ccedil;&atilde;o i3geo
	 */
	function deldirDir2shp($nomearq, $dir_tmp, $locaplic) {
		if (file_exists ( $nomearq )) {
			if ($this->dbaseExiste == false) {
				include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
			}
			//
			// define os nomes dos novos shapefiles que ser&atilde;o criados
			//
			$nomeLinhas = nomeRandomico ();
			$nomePoligonos = nomeRandomico ();
			$nomeshpLinhas = $this->diretorio . "/" . $nomeLinhas;
			$nomeshpPoligonos = $this->diretorio . "/" . $nomePoligonos;
			// cria o shape file
			$novoshpLinhas = ms_newShapefileObj ( $nomeshpLinhas, MS_SHP_ARC );
			$novoshpPoligonos = ms_newShapefileObj ( $nomeshpPoligonos, MS_SHP_POLYGON );
			//
			// cria o dbf para o shapefile linear
			//
			$def [] = array (
					"x1",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"y1",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"x2",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"y2",
					"N",
					"12",
					"5"
			);
			$def [] = array (
					"ind1",
					"N",
					"5",
					"0"
			);
			$def [] = array (
					"ind2",
					"N",
					"5",
					"0"
			);
			$def [] = array (
					"b1",
					"C",
					"6"
			);
			$def [] = array (
					"b2",
					"C",
					"6"
			);
			if ($this->dbaseExiste == false) {
				$dbLinhas = xbase_create ( $nomeshpLinhas . ".dbf", $def );
			} else {
				$dbLinhas = dbase_create ( $nomeshpLinhas . ".dbf", $def );
			}
			$dbnameLinhas = $nomeshpLinhas . ".dbf";
			//
			// cria o dbf para o shapefile poligonal
			//
			$def = array ();
			$def [] = array (
					"area",
					"N",
					"12",
					"5"
			);
			if ($this->dbaseExiste == false) {
				$dbPoligonos = xbase_create ( $nomeshpPoligonos . ".dbf", $def );
			} else {
				$dbPoligonos = dbase_create ( $nomeshpPoligonos . ".dbf", $def );
			}
			$dbnamePoligonos = $nomeshpPoligonos . ".dbf";
			//
			// constr�i as linhas do diagrama
			//
			// le o arquivo linha a linha, pulando a primeira
			// acrescenta os pontos no shape file formando as linhas
			// cria o array para criar os pol&iacute;gonos
			//
			$abre = fopen ( $nomearq, "r" );
			$buffer = fgets ( $abre );
			$borda = array (); // guarda os pontos que ficam na borda
			$poligonos = array ();
			while ( ! feof ( $abre ) ) {
				$buffer = fgets ( $abre );
				$i = explode ( ",", $buffer );
				if (is_array ( $i )) {
					$i1 = floatval ( $i [1] );
					$i2 = floatval ( $i [2] );
					$i3 = floatval ( $i [3] );
					$i4 = floatval ( $i [4] );
					$i5 = floatval ( $i [5] );
					$i6 = floatval ( $i [6] );
					$poPoint1 = ms_newpointobj ();
					$poPoint1->setXY ( $i1, $i2 );
					$poPoint2 = ms_newpointobj ();
					$poPoint2->setXY ( $i3, $i4 );
					if (trim ( $i [7] ) == "TRUE") {
						$borda [] = $poPoint1;
					}
					if (trim ( $i [8] ) == "TRUE") {
						$borda [] = $poPoint2;
					}
					$linha = ms_newLineObj ();
					$linha->add ( $poPoint1 );
					$linha->add ( $poPoint2 );
					if ($poligonos [$i [5]])
						$poligonos [$i [5]] = array_merge ( array (
								$linha
						), $poligonos [$i [5]] );
					else
						$poligonos [$i [5]] = array (
								$linha
						);
					if ($poligonos [$i [6]])
						$poligonos [$i [6]] = array_merge ( array (
								$linha
						), $poligonos [$i [6]] );
					else
						$poligonos [$i [6]] = array (
								$linha
						);
					$ShapeObj = ms_newShapeObj ( MS_SHAPE_LINE );
					$ShapeObj->add ( $linha );
					$novoshpLinhas->addShape ( $ShapeObj );
					$registro = array (
							$i1,
							$i2,
							$i3,
							$i4,
							$i5,
							$i6,
							$i [7],
							$i [8]
					);
					if ($this->dbaseExiste == false)
						xbase_add_record ( $dbLinhas, $registro );
					else
						dbase_add_record ( $dbLinhas, $registro );
				}
			}
			//
			// adiciona os poligonos
			//
			foreach ( $poligonos as $p ) {
				$ShapeObjp = ms_newShapeObj ( MS_SHAPE_LINE );
				foreach ( $p as $o ) {
					$ShapeObjp->add ( $o );
				}
				$ns = $ShapeObjp->convexhull ();
				$novoshpPoligonos->addShape ( $ns );
				$registro = array (
						$ns->getArea ()
				);
				if ($this->dbaseExiste == false)
					xbase_add_record ( $dbPoligonos, $registro );
				else
					dbase_add_record ( $dbPoligonos, $registro );
			}
			if ($this->dbaseExiste == false)
				xbase_close ( $dbPoligonos );
			else
				dbase_close ( $dbPoligonos );
				//
				// adiciona o layer com os pol&iacute;gonos no mapa
				//
			$novolayerp = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, ("Voronoi - poligonos (" . $nomePoligonos . ")"), $metaClasse = "SIM" );
			$novolayerp->set ( "data", $nomeshpPoligonos . ".shp" );
			$novolayerp->setmetadata ( "DOWNLOAD", "SIM" );
			$novolayerp->set ( "template", "none.htm" );
			$classe = $novolayerp->getclass ( 0 );
			$estilo = $classe->getstyle ( 0 );
			$cor = $estilo->color;
			$cor->setrgb ( 240, 240, 240 );
			//
			// adiciona no mapa atual o novo tema com as linhas do diagrama
			//
			if (count ( $borda > 2 )) {
				$linha = ms_newLineObj ();
				foreach ( $borda as $ponto ) {
					$linha->add ( $ponto );
				}
				$ShapeObj = ms_newShapeObj ( MS_SHAPE_LINE );
				$ShapeObj->add ( $linha );
				$novoshpLinhas->addShape ( $ShapeObj->convexhull () );
				$registro = array (
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0
				);
				if ($this->dbaseExiste == false)
					xbase_add_record ( $dbLinhas, $registro );
				else
					dbase_add_record ( $dbLinhas, $registro );
			}
			if ($this->dbaseExiste == false)
				xbase_close ( $dbLinhas );
			else
				dbase_close ( $dbLinhas );
			fclose ( $abre );
			$novolayer = criaLayer ( $this->mapa, MS_LAYER_LINE, MS_DEFAULT, ("Voronoi (" . $nomeLinhas . ")"), $metaClasse = "SIM" );
			$novolayer->set ( "data", $nomeshpLinhas . ".shp" );
			$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
			$novolayer->set ( "template", "none.htm" );
			$classe = $novolayer->getclass ( 0 );
			$estilo = $classe->getstyle ( 0 );
			//$estilo->set ( "symbolname", "linha" );
			$estilo->set ( "width", 4 );
			$cor = $estilo->color;
			$cor->setrgb ( 255, 210, 0 );
		}
	}
	/*
	 * function: pontoEmPoligono
	 *
	 * Cruza um tema pontual com temas poligonais ou raster.
	 *
	 * Salva o mapa acrescentando um novo layer com o resultado.
	 *
	 * parameters:
	 *
	 * $temaPt - Tema de pontos que ser&aacute; utilizado.
	 *
	 * $temaPo - Temas poligonais separados por virgula.
	 *
	 * $locaplic - Localiza&ccedil;&atilde;o do I3geo.
	 */
	function pontoEmPoligono($temaPt, $temasPo, $locaplic) {
		set_time_limit ( 3000 );
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$layerPt = $this->mapa->getlayerbyname ( $temaPt );
		$layerPt->set ( "template", "none.htm" );
		$layerPt->set ( "tolerance", 0 );
		// define o nome do novo shapefile que ser&aacute; criado
		$nomefinal = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomefinal;
		//
		$spts = retornaShapesSelecionados ( $layerPt, $this->arquivo, $this->mapa );
		if (count ( $spts ) == 0) {
			$spts = retornaShapesMapext ( $layerPt, $this->mapa );
		}
		//
		$itemspt = pegaItens ( $layerPt );
		// gera o novo arquivo shape file
		// cria o dbf
		$def = $this->criaDefDb ( $itemspt, false );
		// pega os itens dos temas poligonais
		$layersPol = array ();
		$temas = explode ( ",", $temasPo );
		$layers = array ();
		$nomesitens = array (); // guarda os nomes dos temas e seus itens
		$conta = 0;
		$listaItens = array ();
		foreach ( $temas as $tema ) {
			$layer = $this->mapa->getlayerbyname ( $tema );
			$layer->set ( "template", "none.htm" );
			$layer->set ( "status", MS_DEFAULT );
			$items = pegaItens ( $layer );
			if ($layer->type == MS_LAYER_RASTER) {
				$lineo = $spts [0]->line ( 0 );
				$pt = $lineo->point ( 0 );
				$layer->queryByPoint ( $pt, 0, 0 );
			}
			$layers [] = $layer;

			if (! $items) {
				return "erro ao obter a lista de itens do tema $layer->name";
			}
			$listaItens [$layer->name] = $items;
			foreach ( $items as $ni ) {
				$def [] = array (
						"I" . $conta,
						"C",
						"254"
				);
				$nomesitens [] = "Tema: " . $layer->name . ", Item: " . $ni . " Novo: I" . $conta . "<br>";
				$conta = $conta + 1;
			}
		}
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
			// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POINT );
		foreach ( $spts as $spt ) {
			foreach ( $itemspt as $ni ) {
				$reg [] = $this->truncaS ( $spt->values [$ni] );
			}
			$novoshpf->addShape ( $spt );
			$lineo = $spt->line ( 0 );
			$pt = $lineo->point ( 0 );
			// faz a pesquisa
			// //error_reporting(0);
			foreach ( $layers as $layer ) {
				$layer->set ( "template", "none.htm" );
				$layer->set ( "toleranceunits", MS_PIXELS );
				$layer->set ( "tolerance", 1 );
				$ident = @$layer->queryByPoint ( $pt, 0, 0 );
				if ($ident == "MS_SUCCESS") {
					$itens = $listaItens [$layer->name];
					$sopen = $layer->open ();
					if ($sopen == MS_FAILURE) {
						return "erro";
					}
					if ($layer->getResult ( 0 ) !== FALSE) {
						if ($this->v >= 6) {
							$shape = $layer->getShape ( $layer->getResult ( 0 ) );
						} else {
							$result = $layer->getResult ( 0 );
							$shp_index = $result->shapeindex;
							$shape = $layer->getfeature ( $shp_index, - 1 );
						}
						foreach ( $itens as $item ) {
							$p = $this->truncaS ( $shape->values [$item] );
							if (empty ( $p )) {
								$p = "-";
							}
							$reg [] = $p;
						}
					} else {
						foreach ( $itens as $item ) {
							$reg [] = "???";
						}
					}
				} else {
					foreach ( $itens as $item ) {
						$reg [] = "???";
					}
				}
				$layer->close ();
			}
			if ($this->dbaseExiste == false)
				xbase_add_record ( $db, $reg );
			else
				dbase_add_record ( $db, $reg );
			$reg = array ();
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
		$novolayer = ms_newLayerObj ( $this->mapa, $layerPt );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->set ( "name", $nomefinal );
		$novolayer->setmetadata ( "TEMA", "Cruzamento (" . $nomefinal . ")" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "ITENS", "" );
		$novolayer->setmetadata ( "ITENSDESC", "" );
		$novolayer->setmetadata ( "CACHE", "" );
		if (ms_GetVersionInt () > 50201) {
			$novolayer->setconnectiontype ( MS_SHAPEFILE );
		} else {
			$novolayer->set ( "connectiontype", MS_SHAPEFILE );
		}
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return (implode ( " ", $nomesitens ));
	}
	/*
	 * function: distanciaptpt
	 *
	 * Calcula a distancia entre um ponto de origem e os pontos em um tema.
	 *
	 * S&atilde;o considerados apenas os pontos dentro de um tema de overlay.
	 *
	 * parameters:
	 *
	 * temaorigem - nome do layer com o ponto de origem
	 *
	 * temadestino - nome do tema com os pontos de destino
	 *
	 * temaoverlay - tema que ser&aacute; utilizado para selecionar o tema de destino
	 *
	 * locapli - endere&ccedil;o da aplica&ccedil;&atilde;o i3geo
	 *
	 * itemorigem - nome do item na tabela de atributos do tema de origem que ser&aacute; acrescentado ao tema que ser&aacute; criado
	 *
	 * itemdestino - nome do item na tabela de atributos do tema de origem que ser&aacute; acrescentado ao tema que ser&aacute; criado
	 *
	 */
	function distanciaptpt($temaorigem, $temadestino, $temaoverlay, $locaplic, $itemorigem = "", $itemdestino = "") {
		set_time_limit ( 180 );
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		//error_reporting(E_ALL);
		// define o nome do novo shapefile que ser&aacute; criado
		$nomefinal = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomefinal;

		$existesel = carregaquery2 ( $this->arquivo, $this->layer, $this->mapa );
		if ($existesel == "nao") {
			return "errox";
		}

		$layerorigem = $this->mapa->getlayerbyname ( $temaorigem );
		$layerdestino = $this->mapa->getlayerbyname ( $temadestino );
		$layeroverlay = $this->mapa->getlayerbyname ( $temaoverlay );

		$shapesorigem = retornaShapesSelecionados ( $layerorigem, $this->arquivo, $this->mapa );
		if (count ( $shapesorigem ) == 0) {
			return "erro";
		}
		$layeroverlay->set ( "tolerance", 0 );
		$layerdestino->set ( "tolerance", 0 );
		$layeroverlay->queryByrect ( $this->mapa->extent );
		$layerdestino->queryByFeatures ( $layeroverlay->index );

		$sopen = $layerdestino->open ();
		if ($sopen == MS_FAILURE) {
			return "erro";
		}
		$res_count = $layerdestino->getNumresults ();

		for($i = 0; $i < $res_count; ++ $i) {
			if ($this->v >= 6) {
				$shapesdestino [] = $layerdestino->getShape ( $layerdestino->getResult ( $i ) );
			} else {
				$result = $layerdestino->getResult ( $i );
				$shp_index = $result->shapeindex;
				$shapesdestino [] = $layerdestino->getshape ( - 1, $shp_index );
			}
		}
		$layerdestino->close ();
		$rect = $this->mapa->extent;
		$projInObj = $layerorigem->getProjection ();
		if ($projInObj == "") {
			$projInObj = ms_newprojectionobj ( "proj=longlat,ellps=WGS84,datum=WGS84,no_defs" );
		} else {
			$projInObj = ms_newprojectionobj($projInObj);
		}
		$projOutObj = ms_newprojectionobj ( "proj=poly,ellps=GRS67,lat_0=" . $rect->miny . ",lon_0=" . $rect->minx . ",x_0=5000000,y_0=10000000" );
		$origemdestino = array ();
		if (count ( $shapesorigem ) == 0) {
			return "erro";
		}
		if (count ( $shapesdestino ) == 0) {
			return "erro";
		}

		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_ARC );
		// cria o dbf
		$def [] = array (
				"dist_m",
				"N",
				"10",
				"2"
		);
		$def [] = array (
				"origem",
				"C",
				"255"
		);
		$def [] = array (
				"destino",
				"C",
				"255"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );

		foreach ( $shapesorigem as $sorigem ) {
			if ($itemorigem != "") {
				$valororigem = $sorigem->values [$itemorigem];
			} else {
				$valororigem = "";
			}

			foreach ( $shapesdestino as $sdestino ) {
				$linha = ms_newLineObj ();
				$linha->add ( $sorigem->getCentroid () );
				$linha->add ( $sdestino->getCentroid () );

				if ($itemdestino != "") {
					$valordestino = $sdestino->values [$itemdestino];
				} else {
					$valordestino = "";
				}
				$ShapeObj = ms_newShapeObj ( MS_SHAPE_LINE );
				$ShapeObj->add ( $linha );
				$novoshpf->addShape ( $ShapeObj );

				$ShapeObj->project ( $projInObj, $projOutObj );

				$distancia = $ShapeObj->getLength ();

				$registro = array (
						$distancia,
						$valororigem,
						$valordestino
				);
				if ($this->dbaseExiste == false)
					xbase_add_record ( $db, $registro );
				else
					dbase_add_record ( $db, $registro );
			}
		}

		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );


		// adiciona no mapa atual o novo tema
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_LINE, MS_DEFAULT, ("Distancias (" . $nomefinal . ")"), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->set ( "template", "none.htm" );
		$classe = $novolayer->getclass ( 0 );
		$estilo = $classe->getstyle ( 0 );
		//$estilo->set ( "symbolname", "linha" );
		$estilo->set ( "width", 2 );
		$cor = $estilo->color;
		$cor->setrgb ( 255, 210, 0 );
		// limpa selecao
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return ($nomeshp . ".shp");
	}
	/*
	 * Function: criaBuffer
	 *
	 * Gera entorno (buffer) nos elementos selecionados de um tema.
	 *
	 * Salva o mapa acrescentando um novo layer com o buffer.
	 *
	 * Parametros:
	 *
	 * $distancia - Dist&acirc;ncia em metros.
	 *
	 * $locaplic - Localiza&ccedil;&atilde;o do I3geo.
	 *
	 * $unir - sim|nao indica se os elementos selecionados dever&atilde;o ser unidos em um s� antes do buffer ser criado
	 *
	 * $wkt - (opcional) elemento no formato wkt para o qual o buffer ser&aacute; gerado. S� de ve ser definido se $this->nome for vazio, ou seja
	 * se o par&acirc;metro "tema" n&atilde;o tiver sido fornecido ao construtor da classe
	 *
	 * $multiplicar - (opcional) multiplicar os valores por
	 *
	 * $itemdistancia - (opcional) coluna com os valores
	 *
	 * return:
	 *
	 * nome do layer criado com o buffer.
	 */
	function criaBuffer($distancia, $locaplic, $unir = "nao", $wkt = "", $multiplicar = 1, $itemdistancia = "") {
		set_time_limit ( 180 );
		//error_reporting ( 0 );
		if ($this->nome != "") {
			$items = pegaItens ( $this->layer );
		} else {
			$items = array ();
		}
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$nomebuffer = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomebuffer;
		$listaShapes = array ();
		if ($this->nome != "") {
			$listaShapes = retornaShapesSelecionados ( $this->layer, $this->arquivo, $this->mapa );
		} else {
			$s = ms_shapeObjFromWkt ( $wkt );
			$s->values ["ID"] = 0;
			$items [] = "ID";
			$listaShapes [] = $s;
		}
		foreach ( $listaShapes as $shape ) {
			// calcula a extens&atilde;o geografica
			$rect = $shape->bounds;
			// proj=longlat,ellps=WGS84,datum=WGS84,no_defs
			// proj=latlong
			$projInObj = ms_newprojectionobj ( "proj=longlat,ellps=WGS84,datum=WGS84,no_defs" );
			$projOutObj = ms_newprojectionobj ( "proj=poly,ellps=GRS67,lat_0=" . $rect->miny . ",lon_0=" . $rect->minx . ",x_0=5000000,y_0=10000000" );
			$poPoint = ms_newpointobj ();
			$poPoint->setXY ( $rect->minx, $rect->miny );
			$dd1 = ms_newpointobj ();
			$dd1->setXY ( $rect->minx, $rect->miny );
			$poPoint->project ( $projInObj, $projOutObj );
			$dd2 = ms_newpointobj ();
			if ($itemdistancia != "") {
				$distancia = $shape->values [$itemdistancia];
			}
			if (is_numeric ( $distancia )) {
				$dd2->setXY ( ($poPoint->x) + ($distancia * $multiplicar), $poPoint->y );
				$dd2->project ( $projOutObj, $projInObj );
				$d = $dd1->distanceToPoint ( $dd2 );
				if ($distancia < 0) {
					$d = $d * - 1;
				}
				// calcula a distancia 29100
				// gera o buffer
				$buffers [] = $shape->buffer ( $d );
				$shapes [] = $shape;
			}
		}
		// faz a uni&atilde;o dos elementos se necess&aacute;rio
		if ($unir == "sim") {
			$ns = $buffers [0];
			for($s = 1; $s < count ( $buffers ); $s ++) {
				$ns = $ns->union ( $buffers [$s] );
			}
			$buffers = array (
					$ns
			);
			$shapes = array (
					$shapes [0]
			);
		}
		// gera o novo arquivo shape file
		// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POLYGON );
		// cria o dbf
		$def = $this->criaDefDb ( $items );
		$def [] = array (
				"i3geo",
				"C",
				"254"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		for($i = 0; $i < count ( $buffers ); ++ $i) {
			foreach ( $items as $ni ) {
				if (! empty ( $shapes [$i]->values [$ni] )) {
					$reg [] = $this->truncaS ( $shapes [$i]->values [$ni] );
				} else {
					$reg [] = "";
				}
			}
			$reg [] = $i;
			$novoshpf->addShape ( $buffers [$i] );
			if ($this->dbaseExiste == false)
				xbase_add_record ( $db, $reg );
			else
				dbase_add_record ( $db, $reg );

			$reg = array ();
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			// adiciona no mapa atual o novo tema
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, ("Buffer (" . $nomebuffer . ")"), $metaClasse = "SIM", false );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->set ( "template", "none.htm" );
		$classe = $novolayer->getclass ( 0 );
		$estilo = $classe->getstyle ( 0 );
		$estilo->set ( "symbolname", "p4" );
		$estilo->set ( "size", 5 );
		$cor = $estilo->color;
		$cor->setrgb ( 255, 0, 0 );
		$coro = $estilo->outlinecolor;
		$coro->setrgb ( 255, 0, 0 );
		return ($novolayer->name);
	}
	/*
	 * function: centroMassa
	 *
	 * Calcula o centro m&eacute;dio.
	 *
	 * Se "item" for diferente de vazio, calcula o centro m&eacute;dio ponderado baseado no item
	 *
	 * Parametros:
	 *
	 * $item {string} - (opcional) Item q ser&aacute; utilizado para ponderar os valores.
	 */
	function centroMassa($item = "") {
		if (! $this->layer) {
			return "erro";
		}
		set_time_limit ( 180 );
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		// //error_reporting(0);
		$nomeCentro = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomeCentro;
		// pega os shapes selecionados
		$lshapes = retornaShapesSelecionados ( $this->layer, $this->arquivo, $this->mapa );
		if (count ( $lshapes ) == 0) {
			$lshapes = retornaShapesMapext ( $this->layer, $this->mapa );
		}
		$pondera = 1;
		$xs = 0;
		$ys = 0;
		foreach ( $lshapes as $shape ) {
			if ($item != "") {
				$pondera = $shape->values [$item];
			}
			$pt = $shape->line ( 0 )->point ( 0 );
			$xs += ($pt->x * $pondera);
			$ys += ($pt->y * $pondera);
		}
		// gera o novo arquivo shape file
		// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POINT );
		// cria o dbf
		$def [] = array (
				"id",
				"C",
				"254"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		$reg [] = "";
		$res_count = count ( $lshapes );
		$shp = ms_newShapeObj ( MS_SHP_POINT );
		$linha = ms_newLineObj ();
		$linha->addXY ( ($xs / $res_count), ($ys / $res_count) );
		$shp->add ( $linha );

		$novoshpf->addShape ( $shp );
		if ($this->dbaseExiste == false)
			xbase_add_record ( $db, $reg );
		else
			dbase_add_record ( $db, $reg );
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			// adiciona no mapa atual o novo tema
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POINT, MS_DEFAULT, ("Centro de massa (" . $nomeCentro . ")"), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->set ( "template", "none.htm" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		$classe = $novolayer->getclass ( 0 );
		$estilo = $classe->getstyle ( 0 );
		$estilo->set ( "size", "14" );
		// limpa selecao
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return true;
	}
	/*
	 * function: criaCentroide
	 *
	 * Gera centroide dos elementos selecionados de um tema.
	 *
	 * Salva o mapa acrescentando um novo layer com os pontos.
	 *
	 * Parametros:
	 *
	 * $locaplic - Localiza&ccedil;&atilde;o do I3geo.
	 */
	function criaCentroide($locaplic) {
		if (! $this->layer) {
			return "erro";
		}
		$items = pegaItens ( $this->layer );
		set_time_limit ( 180 );
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$nomeCentroides = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomeCentroides;
		$shapes = retornaShapesSelecionados ( $this->layer, $this->arquivo, $this->mapa );

		// $shapes = $shape[0];
		foreach ( $shapes as $shape ) {
			$LineObj = ms_newLineObj ();
			$LineObj->add ( $shape->getCentroid () );
			$ShapeObj = ms_newShapeObj ( MS_SHAPE_POINT );
			$ShapeObj->add ( $LineObj );
			$centroides [] = $ShapeObj;
		}
		// gera o novo arquivo shape file
		// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POINT );
		// cria o dbf
		$def = $this->criaDefDb ( $items );
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		for($i = 0; $i < count ( $centroides ); ++ $i) {
			foreach ( $items as $ni ) {
				$reg [] = $this->truncaS ( $shapes [$i]->values [$ni] );
			}
			$novoshpf->addShape ( $centroides [$i] );
			if ($this->dbaseExiste == false)
				xbase_add_record ( $db, $reg );
			else
				dbase_add_record ( $db, $reg );
			$reg = array ();
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			// adiciona no mapa atual o novo tema
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POINT, MS_DEFAULT, ("Centroide (" . $nomeCentroides . ")"), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->set ( "template", "none.htm" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		// limpa selecao
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return true;
	}

	/*
	 * function: gradeDePontos
	 *
	 * Gera uma grade de pontos com espa&ccedil;amento regular definido em d&eacute;cimos de grau.
	 *
	 * Salva o mapa acrescentando um novo layer com a grade de coordenadas.
	 *
	 * $ddx - Espa&ccedil;amento em x.
	 *
	 * $ddy - Espa&ccedil;amento em y.
	 *
	 * $px - X do primeiro ponto (superior esquerdo)
	 *
	 * $py - Y do primeiro ponto.
	 *
	 * $locaplic - Endere&ccedil;o da aplica&ccedil;&atilde;o.
	 *
	 * $nptx - N&uacute;mero de pontos em X (opcional)
	 *
	 * $npty - N&uacute;mero de pontos em Y (opcional)
	 */
	function gradeDePontos($xdd, $ydd, $px, $py, $locaplic, $nptx, $npty, $proj = false) {
		set_time_limit ( 180 );
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$nomegrade = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomegrade;
		$this->mapa->preparequery ();
		$r = $this->mapa->extent;
		$ext = ms_newRectObj ();
		$ext->setextent ( $r->minx, $r->miny, $r->maxx, $r->maxy );
		if ($proj == true) {
			// caso precise projetar
			$projInObj = ms_newprojectionobj ( "proj=latlong,a=6378137,b=6378137" );
			$projOutObj = ms_newprojectionobj ( "proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m" );

			$ext->project ( $projInObj, $projOutObj );

			$pt = ms_newpointobj ();
			$pt->setXY ( $px, $py );

			$pt->project ( $projInObj, $projOutObj );

			$px = $pt->x;
			$py = $pt->y;
		}

		$fx = $ext->maxx;
		$fy = $ext->miny;
		// calcula a dist&acirc;ncia entre os pontos em dd
		$distx = $fx - $px;
		$disty = $fy - $py;
		if ($distx < 0) {
			$distx = $distx * - 1;
		}
		if ($disty < 0) {
			$disty = $disty * - 1;
		}
		if ($nptx == "") {
			$nptx = round ( ($distx / $xdd), 0 );
		}
		if ($npty == "") {
			$npty = round ( ($disty / $ydd), 0 );
		}
		// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POINT );
		$def = array ();
		$def [] = array (
				"x",
				"C",
				"20"
		);
		$def [] = array (
				"y",
				"C",
				"20"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		$reg = array ();
		$valorcoluna = $px;
		for($coluna = 0; $coluna < $nptx; $coluna ++) {
			$x = $valorcoluna;
			$valorlinha = $py;
			for($linha = 0; $linha < $npty; $linha ++) {
				$y = $valorlinha;
				$valorlinha = $valorlinha - $ydd;
				$poPoint = ms_newpointobj ();
				$poPoint->setXY ( $x, $y );
				if ($proj == true) {
					$poPoint->project ( $projOutObj, $projInObj );
				}
				$novoshpf->addpoint ( $poPoint );
				$reg [] = $x;
				$reg [] = $y;
				if ($this->dbaseExiste == false)
					xbase_add_record ( $db, $reg );
				else
					dbase_add_record ( $db, $reg );
				$reg = array ();
			}
			$valorcoluna = $valorcoluna + $xdd;
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			// adiciona o novo tema no mapa
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POINT, MS_DEFAULT, ("Grade (" . $nomegrade . ")"), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return ("ok");
	}
	/*
	 * function: gradeDePol
	 *
	 * Gera uma grade de pol&iacute;gonos com espa&ccedil;amento regular definido em d&eacute;cimos de grau.
	 *
	 * Salva o mapa acrescentando um novo layer com a grade.
	 *
	 * parameters:
	 *
	 * $xdd - Espa&ccedil;amento em x.
	 *
	 * $ydd - Espa&ccedil;amento em y.
	 *
	 * $x - X do primeiro ponto (superior esquerdo)
	 *
	 * $y - Y do primeiro ponto.
	 *
	 * $locaplic - Endere&ccedil;o da aplica&ccedil;&atilde;o.
	 *
	 * $nptx - N&uacute;mero de pontos em X (opcional)
	 *
	 * $npty - N&uacute;mero de pontos em Y (opcional)
	 */
	function gradeDePol($xdd, $ydd, $px, $py, $locaplic, $nptx, $npty, $proj = false) {
		set_time_limit ( 180 );

		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}

		$nomegrade = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomegrade;
		// pega a extens&atilde;o geogr&aacute;fica do mapa
		$this->mapa->preparequery ();
		$r = $this->mapa->extent;
		$ext = ms_newRectObj ();
		$ext->setextent ( $r->minx, $r->miny, $r->maxx, $r->maxy );
		if ($proj == true) {

			$projInObj = ms_newprojectionobj ( "proj=latlong,a=6378137,b=6378137" );
			$projOutObj = ms_newprojectionobj ( "proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m" );

			$ext->project ( $projInObj, $projOutObj );

			$pt = ms_newpointobj ();
			$pt->setXY ( $px, $py );

			$pt->project ( $projInObj, $projOutObj );

			$px = $pt->x;
			$py = $pt->y;
		}
		$fx = $ext->maxx;
		$fy = $ext->miny;
		// calcula a dist&acirc;ncia entre os pontos em dd
		$distx = $fx - $px;
		$disty = $fy - $py;
		if ($distx < 0) {
			$distx = $distx * - 1;
		}
		if ($disty < 0) {
			$disty = $disty * - 1;
		}
		if ($nptx == "") {
			$nptx = round ( ($distx / $xdd), 0 );
		}
		if ($npty == "") {
			$npty = round ( ($disty / $ydd), 0 );
		}

		// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POLYGON );
		$def = array ();
		$def [] = array (
				"id",
				"C",
				"20"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		$reg = array ();
		$valorcoluna = $px;
		for($coluna = 0; $coluna < $nptx; $coluna ++) {
			$x = $valorcoluna;
			$valorlinha = $py;
			for($linha = 0; $linha < $npty; $linha ++) {
				$y = $valorlinha;
				$valorlinha = $valorlinha - $ydd;
				$poPoint1 = ms_newpointobj ();
				$poPoint2 = ms_newpointobj ();
				$poPoint3 = ms_newpointobj ();
				$poPoint4 = ms_newpointobj ();
				$poPoint1->setXY ( $x, $y );
				$poPoint2->setXY ( ($x + $xdd), $y );
				$poPoint3->setXY ( ($x + $xdd), ($y - $ydd) );
				$poPoint4->setXY ( $x, ($y - $ydd) );

				if ($proj == true) {
					$poPoint1->project ( $projOutObj, $projInObj );
					$poPoint2->project ( $projOutObj, $projInObj );
					$poPoint3->project ( $projOutObj, $projInObj );
					$poPoint4->project ( $projOutObj, $projInObj );
				}

				$linhas = ms_newLineObj ();
				$linhas->add ( $poPoint1 );
				$linhas->add ( $poPoint2 );
				$linhas->add ( $poPoint3 );
				$linhas->add ( $poPoint4 );
				$linhas->add ( $poPoint1 );
				$shapen = ms_newShapeObj ( MS_SHP_POLYGON );
				$shapen->add ( $linhas );
				$novoshpf->addShape ( $shapen );
				$reg [] = $linha . "-" . $coluna;
				if ($this->dbaseExiste == false)
					xbase_add_record ( $db, $reg );
				else
					dbase_add_record ( $db, $reg );
				$reg = array ();
			}
			$valorcoluna = $valorcoluna + $xdd;
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			// adiciona o novo tema no mapa
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, ("Grade (" . $nomegrade . ")"), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		$novolayer->set ( "opacity", 50 );
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return true;
	}
	/*
	 * function: gradeDeHex
	 *
	 * Gera uma grade de pol&iacute;gonos hexagonais regulares definido em d&eacute;cimos de grau.
	 *
	 * Salva o mapa acrescentando um novo layer com a grade.
	 *
	 * parameters:
	 *
	 * $dd - Comprimento dos lados (em metros se $proj=true)
	 *
	 * $px - X do primeiro ponto (superior esquerdo)
	 *
	 * $py - Y do primeiro ponto.
	 *
	 * $locaplic - Endere&ccedil;o da aplica&ccedil;&atilde;o.
	 *
	 * $nptx - N&uacute;mero de pontos em X (opcional)
	 *
	 * $npty - N&uacute;mero de pontos em Y (opcional)
	 *
	 * $proj - A grade deve ser gerada em unidades metricas e projetada para geografica
	 */
	function gradeDeHex($dd, $px, $py, $locaplic, $nptx, $npty, $proj = false) {
		set_time_limit ( 180 );
		// http://gmc.yoyogames.com/index.php?showtopic=336183
		$hh = (sin ( deg2rad ( 30 ) ) * $dd);
		$rr = (cos ( deg2rad ( 30 ) ) * $dd);
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$nomegrade = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomegrade;
		// pega a extens&atilde;o geogr&aacute;fica do mapa
		$this->mapa->preparequery ();
		$r = $this->mapa->extent;
		$ext = ms_newRectObj ();
		$ext->setextent ( $r->minx, $r->miny, $r->maxx, $r->maxy );
		if ($proj == true) {
			// caso precise projetar
			$projInObj = ms_newprojectionobj ( "proj=latlong,a=6378137,b=6378137" );
			$projOutObj = ms_newprojectionobj ( "proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m" );

			$ext->project ( $projInObj, $projOutObj );

			$pt = ms_newpointobj ();
			$pt->setXY ( $px, $py );

			$pt->project ( $projInObj, $projOutObj );

			$px = $pt->x;
			$py = $pt->y;
		}

		$fx = $ext->maxx;
		$fy = $ext->miny;

		// calcula a dist&acirc;ncia entre os pontos em dd se nao tiver sido especificada ou for 0
		$distx = $fx - $px;
		$disty = $fy - $py;
		if ($distx < 0) {
			$distx = $distx * - 1;
		}
		if ($disty < 0) {
			$disty = $disty * - 1;
		}
		if ($nptx == "") {
			$nptx = round ( ($distx / $dd), 0 );
		}
		if ($npty == "") {
			$npty = round ( ($disty / $dd), 0 );
		}
		// cria o shapefile
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POLYGON );
		$def = array ();
		$def [] = array (
				"id",
				"C",
				"20"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		$reg = array ();
		$w = $this->mapa->width;
		$h = $this->mapa->height;

		$valorcoluna = $px;
		$par = false;
		for($coluna = 0; $coluna < $nptx; $coluna ++) {
			$x = $valorcoluna;
			$valorlinha = $py;

			if ($par == true) {
				$valorlinha = $valorlinha - $rr;
				$par = false;
			} else {
				// $y = $y + $hh;
				$par = true;
			}

			for($linha = 0; $linha < $npty; $linha ++) {
				$y = $valorlinha;
				$valorlinha = $valorlinha - (2 * $rr);

				$poPoint1 = ms_newpointobj ();
				$poPoint2 = ms_newpointobj ();
				$poPoint3 = ms_newpointobj ();
				$poPoint4 = ms_newpointobj ();
				$poPoint5 = ms_newpointobj ();
				$poPoint6 = ms_newpointobj ();

				// Point 0: $x, $y
				// Point 1: x + s, y
				// Point 2: x + s + h, y + r
				// Point 3: x + s, y + r + r
				// Point 4: x, y + r + r
				// Point 5: x - h, y + r
				$poPoint1->setXY ( $x, $y );
				$poPoint2->setXY ( ($x + $dd), $y );
				$poPoint3->setXY ( $x + $dd + $hh, $y - $rr );
				$poPoint4->setXY ( $x + $dd, $y - $rr - $rr );
				$poPoint5->setXY ( $x, $y - $rr - $rr );
				$poPoint6->setXY ( $x - $hh, $y - $rr );

				if ($proj == true) {
					$poPoint1->project ( $projOutObj, $projInObj );
					$poPoint2->project ( $projOutObj, $projInObj );
					$poPoint3->project ( $projOutObj, $projInObj );
					$poPoint4->project ( $projOutObj, $projInObj );
					$poPoint5->project ( $projOutObj, $projInObj );
					$poPoint6->project ( $projOutObj, $projInObj );
				}

				$linhas = ms_newLineObj ();
				$linhas->add ( $poPoint1 );
				$linhas->add ( $poPoint2 );
				$linhas->add ( $poPoint3 );
				$linhas->add ( $poPoint4 );
				$linhas->add ( $poPoint5 );
				$linhas->add ( $poPoint6 );
				$linhas->add ( $poPoint1 );
				$shapen = ms_newShapeObj ( MS_SHP_POLYGON );
				$shapen->add ( $linhas );
				$novoshpf->addShape ( $shapen );
				$reg [] = $linha . "-" . $coluna;
				if ($this->dbaseExiste == false)
					xbase_add_record ( $db, $reg );
				else
					dbase_add_record ( $db, $reg );
				$reg = array ();
			}
			$valorcoluna = $valorcoluna + $dd + $hh;
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			// adiciona o novo tema no mapa

		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, ("Grade (" . $nomegrade . ")"), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		$novolayer->set ( "opacity", 50 );
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return (true);
	}
	/*
	 * function: nptPol
	 *
	 * Conta o n&uacute;mero de pontos em pol&iacute;gono cruzando dois temas.
	 *
	 * Salva o mapa acrescentando um novo layer com o resultado.
	 *
	 * parameters:
	 * $temaPt - Tema de pontos.
	 *
	 * $temaPo - Tema poligonal.
	 *
	 * $locaplic - Localiza&ccedil;&atilde;o do I3geo
	 */
	function nptPol($temaPt, $temaPo, $locaplic, $somaritem = "") {
		// //error_reporting(0);
		set_time_limit ( 180 );
		// para manipular dbf
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$layerPt = $this->mapa->getlayerbyname ( $temaPt );
		$layerPt->set ( "template", "none.htm" );
		$layerPt->set ( "tolerance", 0 );
		$layerPo = $this->mapa->getlayerbyname ( $temaPo );
		$layerPo->set ( "template", "none.htm" );
		// define o nome do novo shapefile que ser&aacute; criado
		$nomefinal = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomefinal;
		$itenspo = pegaItens ( $layerPo );
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POLYGON );
		// cria o dbf
		$def = array ();
		foreach ( $itenspo as $ni ) {
			$def [] = array (
					substr ( $ni, 0, 10 ),
					"C",
					"254"
			);
		}
		$def [] = array (
				"npontos",
				"N",
				"10",
				"0"
		);
		$def [] = array (
				"soma",
				"N",
				"10",
				"0"
		);
		$def [] = array (
				"media",
				"N",
				"10",
				"0"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false) {
			$db = xbase_open ( $dbname, 2 );
		} else {
			$db = dbase_open ( $dbname, 2 );
		}
		$shapes = retornaShapesMapext ( $layerPo, $this->mapa );
		foreach ( $shapes as $shape ) {
			$novoreg = array ();
			foreach ( $itenspo as $ipo ) {
				$novoreg [] = $shape->values [$ipo];
			}
			$layerPt->querybyshape ( $shape );
			if ($somaritem != "") {
				$soma = 0;
				$layerPt->open ();
				$res_count = $layerPt->getNumresults ();
				for($i = 0; $i < $res_count; ++ $i) {
					if ($this->v >= 6) {
						$s = $layerPt->getShape ( $layerPt->getResult ( $i ) );
					} else {
						$result = $layerPt->getResult ( $i );
						$shp_index = $result->shapeindex;
						$s = $layerPt->getfeature ( $shp_index, - 1 );
					}
					$soma += $s->values [$somaritem];
				}
				$fechou = $layerPt->close ();
				$novoreg [] = $res_count;
				$novoreg [] = $soma;
				$novoreg [] = $soma / $res_count;
			} else {
				$novoreg [] = $layerPt->getNumresults ();
				$novoreg [] = 0;
				$novoreg [] = 0;
			}
			$novoshpf->addShape ( $shape );
			if ($this->dbaseExiste == false) {
				xbase_add_record ( $db, $novoreg );
			} else {
				dbase_add_record ( $db, $novoreg );
			}
		}
		if ($this->dbaseExiste == false) {
			xbase_close ( $db );
		} else {
			dbase_close ( $db );
		}
		// adiciona o novo tema no mapa
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, "N pontos", $metaClasse = "SIM", false );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		$novolayer->set ( "opacity", 80 );
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}
		return (true);
	}
	/*
	 * Function: agrupaElementos
	 *
	 * Agrupa elementos em um pol&iacute;gono.
	 *
	 * Salva o mapa acrescentando um novo layer com o resultado.
	 */
	function agrupaElementos($item, $locaplic) {
		if (! $this->layer) {
			return "erro";
		}
		set_time_limit ( 180 );
		// para manipular dbf
		if (! isset ( $item )) {
			$item = "";
		}
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$shapes = retornaShapesSelecionados ( $this->layer, $this->arquivo, $this->mapa );
		$indices = array ();
		foreach ( $shapes as $shape ) {
			if ($item != "") {
				$valor = $shape->values [$item];
			} else {
				$valor = "nenhum";
			}
			if (! isset ( $indices [$valor] )) {
				$indices [$valor] = array (
						$shape
				);
			} else
				$indices [$valor] = array_merge ( $indices [$valor], array (
						$shape
				) );
		}
		$dissolve = array ();
		foreach ( $indices as $shapes ) {
			foreach ( $shapes as $shape ) {
				if ($item != "")
					$valor = $shape->values [$item];
				else
					$valor = "nenhum";
				if (! isset ( $dissolve [$valor] )) {
					$dissolve [$valor] = $shape;
				} else {
					$tipo = $shape->type;
					if ($tipo == 2) {
						for($l = 0; $l < ($shape->numlines); $l ++) {
							$shape1 = $dissolve [$valor];
							$linha = $shape->line ( $l );
							$shape1->add ( $linha );
						}
						$dissolve [$valor] = $shape1;
					} else {
						$dissolve [$valor] = $shape->union ( $dissolve [$valor] );
					}
				}
			}
		}
		//
		// cria o novo shapefile
		//
		$nomefinal = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomefinal;
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POLYGON );
		// cria o dbf
		$def = array ();
		if ($item == "") {
			$item = "nenhum";
		}
		$def [] = array (
				$item,
				"C",
				"254"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		$classes = array_keys ( $dissolve );
		foreach ( $classes as $classe ) {
			$novoshpf->addShape ( $dissolve [$classe]->convexhull () );
			if ($this->dbaseExiste == false)
				xbase_add_record ( $db, array (
						$classe
				) );
			else
				dbase_add_record ( $db, array (
						$classe
				) );
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			//
			// adiciona o novo layer no mapa
			//
		$n = pegaNome ( $this->layer );
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, ("Agrupamento de " . $n), $metaClasse = "SIM", false );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		return true;
	}

	/*
	 * function: dissolvePoligono
	 *
	 * Dissolve as bordas entre pol&iacute;gonos com o mesmo atributo.
	 *
	 * Salva o mapa acrescentando um novo layer com o resultado.
	 *
	 * $item - item utilizado para agregar os pol&iacute;gonos
	 *
	 * $locaplic - Localiza&ccedil;&atilde;o do I3geo
	 */
	function dissolvePoligono($item, $locaplic) {
		if (! $this->layer) {
			return "erro";
		}
		set_time_limit ( 180 );
		// para manipular dbf
		if (! isset ( $item )) {
			$item = "";
		}
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		error_reporting(E_ALL);
		$shapes = retornaShapesSelecionados ( $this->layer, $this->arquivo, $this->mapa );
		$indices = array ();
		foreach ( $shapes as $shape ) {
			if ($item != "") {
				$valor = "V" . $shape->values [$item];
			} else {
				$valor = "nenhum";
			}
			if (! isset ( $indices [$valor] )) {
				$indices [$valor] = array (
						$shape
				);
			} else {
				array_push ( $indices [$valor], $shape );
			}
		}
		$dissolve = array ();

		foreach ( $indices as $shapes ) {
			foreach ( $shapes as $shape ) {
				if ($item != ""){
					$valor = "V".$shape->values [$item];
				}
				else{
					$valor = "nenhum";
				}
				if (! isset ( $dissolve [$valor] )) {
					$dissolve [$valor] = $shape;
				} else {
					if ($shape->type != MS_SHAPE_POLYGON) {
						for($l = 0; $l < ($shape->numlines); $l ++) {
							$shape1 = $dissolve [$valor];
							$linha = $shape->line ( $l );
							$shape1->add ( $linha );
						}
						$dissolve [$valor] = $shape1;
					} else {
						$dissolve [$valor] = $shape->union ( $dissolve [$valor] );
					}
				}
			}
		}

		//
		// cria o novo shapefile
		//
		$nomefinal = nomeRandomico ();
		$nomeshp = $this->diretorio . "/" . $nomefinal;
		$novoshpf = ms_newShapefileObj ( $nomeshp, MS_SHP_POLYGON );
		// cria o dbf
		$def = array ();
		if ($item == "") {
			$item = "nenhum";
		}
		$def [] = array (
				$item,
				"C",
				"254"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false)
			$db = xbase_open ( $dbname, 2 );
		else
			$db = dbase_open ( $dbname, 2 );
		$classes = array_keys ( $dissolve );
		foreach ( $classes as $classe ) {
			$novoshpf->addShape ( $dissolve [$classe] );
			if ($this->dbaseExiste == false)
				xbase_add_record ( $db, array (
						$classe
				) );
			else
				dbase_add_record ( $db, array (
						$classe
				) );
		}
		if ($this->dbaseExiste == false)
			xbase_close ( $db );
		else
			dbase_close ( $db );
			//
			// adiciona o novo layer no mapa
			//
		$n = pegaNome ( $this->layer );
		$novolayer = criaLayer ( $this->mapa, MS_LAYER_POLYGON, MS_DEFAULT, ("Dissolve de " . $n), $metaClasse = "SIM" );
		$novolayer->set ( "data", $nomeshp . ".shp" );
		$novolayer->setmetadata ( "DOWNLOAD", "SIM" );
		$novolayer->setmetadata ( "TEMALOCAL", "SIM" );
		if (file_exists ( $this->qyfile )) {
			unlink ( $this->qyfile );
		}

		return true;
	}
	/*
	 * Function aplicaFuncaoListaWKT
	 *
	 * Aplica uma fun&ccedil;&atilde;o do Mapserver � uma lista de geometrias no formato WKT
	 *
	 * Parametros:
	 *
	 * $geometrias {Array} - lista de WKT
	 *
	 * $operacao {String} - opera&ccedil;&atilde;o suportada pelo Mapserver, por exemplo, union, intersects, etc. converteSHP ir&aacute; converter as geometrias em um tema e adicion&aacute;-lo ao mapa
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver. Utilizado apenas se $operacao = "converteSHP"
	 *
	 * $imgdir - Diret&oacute;rio das imagens do mapa atual. Utilizado apenas se $operacao = "converteSHP"
	 *
	 * Return:
	 *
	 * {string wkt}
	 */
	function aplicaFuncaoListaWKT($geometrias, $operacao, $dir_tmp = "", $imgdir = "") {
		$permitido = array (
				'converteSHP',
				'union',
				'intersection',
				'difference',
				'symdifference',
				'convexhull',
				'area',
				'perimeter'
		);
		if (! in_array ( $operacao, $permitido )) {
			return;
		}
		if ($operacao === "converteSHP") {
			$nomelayer = $this->incmapageometrias ( $dir_tmp, $imgdir, $geometrias, $tipoLista = "arraywkt" );
			return $nomelayer;
		}
		$geos = array ();
		foreach ( $geometrias as $geo ) {
			$geos [] = ms_shapeObjFromWkt ( $geo );
		}
		$n = count ( $geos );
		if ($n == 1) {
			eval ( "\$nShape = \$geos[0]->" . $operacao . "();" );
			return $nShape->toWkt ();
		}
		if ($n == 2) {
			eval ( "\$nShape = \$geos[0]->" . $operacao . "(\$geos[1]);" );
			return $nShape->toWkt ();
		}
		if ($n > 2) {
			$geoc = $geos [0];
			for($i = 1; $i < $n; ++ $i) {
				eval ( "\$geoc = \$geoc->" . $operacao . "(\$geos[\$i]);" );
			}
			return $geoc->toWkt ();
		}
	}
	/*
	 * function: funcoesGeometrias
	 *
	 * Fun&ccedil;&otilde;es de an&aacute;lise de geometrias da ferramenta Geometrias.
	 *
	 * parameters:
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver
	 *
	 * $imgdir - Diret&oacute;rio das imagens do mapa atual
	 *
	 * $lista - String com a lista de nomes dos arquivos serializados que cont&eacute;m as geometrias
	 *
	 * $operacao - Tipo de an&aacute;lise.
	 */
	function funcoesGeometrias($dir_tmp, $imgdir, $lista, $operacao) {
		$lista = explode ( ",", $lista );
		$dir = $dir_tmp . "/" . $imgdir . "/";
		$geometrias = array ();
		$valoresoriginais = array ();
		$calculo = array ();
		foreach ( $lista as $l ) {
			$geos = $this->unserializeGeo ( $dir . $l );
			foreach ( $geos ["dados"] as $geo ) {
				$geometrias [] = $geo ["wkt"];
				$valoresoriginais = array_merge ( $valoresoriginais, $geo ["valores"] );
			}
		}
		$calculo [] ["gwkt"] = $this->aplicaFuncaoListaWKT ( $geometrias, $operacao );
		$nomegeo = "";
		if (count ( $calculo ) > 0) {
			$final ["layer"] = $operacao . " " . (implode ( " ", $lista ));
			$final ["dados"] [] = array (
					"id" => "0",
					"wkt" => ($calculo [0] ["gwkt"]),
					"valores" => $valoresoriginais,
					"imagem" => ""
			);
			$nomegeo = $dir . (nomerandomico ( 10 )) . "keo";
			$this->serializeGeo ( $nomegeo, $final );
			$ext = $this->mapa->extent;
			$minx = $ext->minx;
			$miny = $ext->miny;
			$maxx = $ext->maxx;
			$maxy = $ext->maxy;
			$h = $this->mapa->height;
			$w = $this->mapa->width;
			$nomelayer = $this->incmapageometrias ( $dir_tmp, $imgdir, basename ( $nomegeo ) );
			if ($nomelayer != "erro") {

				$nlayer = $this->mapa->getlayerbyname ( $nomelayer );
				$bounds = $nlayer->getExtent ();
				$this->mapa->setsize ( 30, 30 );
				$sb = $this->mapa->scalebar;
				$statusoriginal = $sb->status;
				$sb->set ( "status", MS_OFF );
				$ext->setextent ( ($bounds->minx), ($bounds->miny), ($bounds->maxx), ($bounds->maxy) );
				$imagem = gravaImagemMapa ( $this->mapa );
				$this->mapa->setsize ( $w, $h );
				$ext->setextent ( $minx, $miny, $maxx, $maxy );
				$nlayer->set ( "status", MS_DELETE );
				$sb->set ( "status", $statusoriginal );
				$this->salva ();
				$final = array ();
				$final ["layer"] = $operacao . " " . (implode ( " ", $lista ));
				$final ["dados"] [] = array (
						"id" => "0",
						"wkt" => ($calculo [0] ["gwkt"]),
						"valores" => $valoresoriginais,
						"imagem" => ($imagem ["url"])
				);
				$this->serializeGeo ( $nomegeo, $final );
			}
		}
		return ($nomegeo);
	}

	/*
	 * function: calculaGeometrias
	 *
	 * Fun&ccedil;&otilde;es de c&aacute;lculo de geometrias da ferramenta Geometrias.
	 *
	 * parameters:
	 *
	 * $dir_tmp - Diret&oacute;rio tempor&aacute;rio do mapserver
	 *
	 * $imgdir - Diret&oacute;rio das imagens do mapa atual
	 *
	 * $lista - Arquivos com as geometrias
	 *
	 * $operacao - Tipo de an&aacute;lise.
	 */
	function calculaGeometrias($dir_tmp, $imgdir, $lista, $operacao) {
		// //error_reporting(0);
		$lista = explode ( ",", $lista );
		$dir = $dir_tmp . "/" . $imgdir . "/";
		foreach ( $lista as $l ) {
			$geos = $this->unserializeGeo ( $dir . $l );
			//
			// verifica a vers&atilde;o do mapserver
			// se for anterior a 5, utiliza a conex&atilde;o com o postgis para fazer o processamento dos daods
			//
			$v = versao ();
			if (($v ["principal"] < 5)) {
				return ("erro. E necessario uma vers&atilde;o maior que 5.0 do Mapserver.");
			}
			foreach ( $geos ["dados"] as &$geo ) {
				$g = $geo ["wkt"];
				switch ($operacao) {
					case "perimetro" :
						$shape = ms_shapeObjFromWkt ( $g );
						$rect = $shape->bounds;
						$projInObj = ms_newprojectionobj ( "proj=longlat,ellps=WGS84,datum=WGS84,no_defs" );
						$projOutObj = ms_newprojectionobj ( "proj=poly,ellps=GRS67,lat_0=" . $rect->miny . ",lon_0=" . $rect->minx . ",x_0=5000000,y_0=10000000,units=m" );
						$shape->project ( $projInObj, $projOutObj );
						$s = $shape->towkt ();
						$shape = ms_shapeObjFromWkt ( $s );
						$area = $shape->getLength ();
						$geo ["valores"] [] = array (
								"item" => "P_perim_metros",
								"valor" => $area
						);
						break;
					case "area" :
						$shape = ms_shapeObjFromWkt ( $g );
						$rect = $shape->bounds;
						$projInObj = ms_newprojectionobj ( "proj=longlat,ellps=WGS84,datum=WGS84,no_defs" );
						$projOutObj = ms_newprojectionobj ( "proj=laea,lat_0=" . $rect->miny . ",lon_0=" . $rect->minx . ",x_0=500000,y_0=10000000,ellps=GRS67,units=m,no_defs" );
						$shape->project ( $projInObj, $projOutObj );
						$s = $shape->towkt ();
						$shape = ms_shapeObjFromWkt ( $s );
						$area = $shape->getArea ();
						$geo ["valores"] [] = array (
								"item" => "P_area_metros",
								"valor" => $area
						);
						break;
					case "comprimento" :
						break;
				}
			}
			$this->serializeGeo ( $dir . $l, $geos );
		}
		return ("ok");
	}
	/*
	 * Function: incmapageometrias
	 *
	 * Insere geometrias como tema no mapa.
	 *
	 * parameters:
	 *
	 * $dir_tmp - Diretorio tempor&aacute;rio do mapserver
	 *
	 * $imgdir - Diretorio das imagens do mapa atual
	 *
	 * $lista - Nomes, sem o caminho, dos arquivos com as geometrias, separados por v&iacute;rgula.
	 *
	 * $tipoLista - tipo de valores que s&atilde;o passados em $lista stringArquivos|arraywkt. O default &eacute; stringArquivos
	 */
	function incmapageometrias($dir_tmp, $imgdir, $lista, $tipoLista = "stringArquivos") {
		$dir = $dir_tmp . "/" . $imgdir . "/";
		$tituloTema = " geometria";
		if ($tipoLista == "stringArquivos") {
			$lista = explode ( ",", $lista );
			$shapes = array ();
			$valoresoriginais = array ();
			foreach ( $lista as $l ) {
				$geos = $this->unserializeGeo ( $dir . $l );
				// pega todas as geometrias
				foreach ( $geos ["dados"] as $geo ) {
					// echo $geo["wkt"]."<br>";
					$shapes [] = ms_shapeObjFromWkt ( str_replace ( "'", "", $geo ["wkt"] ) );
					foreach ( $geo ["valores"] as $v ) {
						$valorestemp [] = $v ["item"] . "=" . $v ["valor"];
					}
					$valoresoriginais [] = implode ( " ", $valorestemp );
				}
			}
		}
		if ($tipoLista == "arraywkt") {
			$shapes = array ();
			$valoresoriginais = array ();
			foreach ( $lista as $l ) {
				$shapes [] = ms_shapeObjFromWkt ( $l );
			}
		}
		if ($tipoLista == "marcadores") {
			$shapes = array ();
			$valoresoriginais = array ();
			foreach ( $lista as $l ) {
				$valoresoriginais [] = $l ["nome"];
				$p = explode ( " ", $l ["ext"] );
				$l = "POLYGON ((" . $p [0] . " " . $p [1] . "," . $p [0] . " " . $p [3] . "," . $p [2] . " " . $p [3] . "," . $p [2] . " " . $p [1] . "," . $p [0] . " " . $p [1] . "))";
				$shapes [] = ms_shapeObjFromWkt ( $l );
			}
			$tituloTema = " marcadores";
		}
		// verifica o tipo
		if (count ( $shapes ) == 0) {
			return ("erro.");
		}
		$tiposhape = $shapes [0]->type;
		$tiposhapefile = MS_SHP_POLYGON;
		if ($tiposhape == 0) {
			$tiposhapefile = MS_SHP_MULTIPOINT;
		}
		if ($tiposhape == 1) {
			$tiposhapefile = MS_SHP_ARC;
		}
		// cria o shapefile
		if ($this->dbaseExiste == false) {
			include_once dirname ( __FILE__ ) . "/../pacotes/phpxbase/api_conversion.php";
		}
		$diretorio = dirname ( $this->arquivo );
		$novonomelayer = nomeRandomico ();
		$nomeshp = $diretorio . "/" . $novonomelayer;
		$l = criaLayer ( $this->mapa, $tiposhape, MS_DEFAULT, "Ins", "SIM" );
		$novoshpf = ms_newShapefileObj ( $nomeshp, $tiposhapefile );
		$def [] = array (
				"ID",
				"C",
				"250"
		);
		if ($this->dbaseExiste == false) {
			$db = xbase_create ( $nomeshp . ".dbf", $def );
			xbase_close ( $db );
		} else {
			$db = dbase_create ( $nomeshp . ".dbf", $def );
			dbase_close ( $db );
		}
		// acrescenta os pontos no novo shapefile
		$dbname = $nomeshp . ".dbf";
		if ($this->dbaseExiste == false){
			$db = xbase_open ( $dbname, 2 );
		}
		else {
			$db = dbase_open ( $dbname, 2 );
		}
		$conta = 0;
		foreach ( $shapes as $s ) {
			$reg = array ();
			$reg [] = $valoresoriginais [$conta];
			if ($this->dbaseExiste == false){
				xbase_add_record ( $db, $reg );
			}
			else {
				dbase_add_record ( $db, $reg );
			}
			$novoshpf->addshape ( $s );
			$conta = $conta + 1;
		}
		if ($this->dbaseExiste == false){
			xbase_close ( $db );
		}
		else {
			dbase_close ( $db );
		}
		$l->set ( "opacity", 80 );
		$l->setmetadata ( "tema", $novonomelayer . $tituloTema );
		$l->setmetadata ( "TEMALOCAL", "SIM" );
		$l->setmetadata ( "DOWNLOAD", "sim" );
		$l->set ( "data", $nomeshp );
		$l->set ( "name", $novonomelayer );
		$classe = $l->getclass ( 0 );
		$estilo = $classe->getstyle ( 0 );
		if ($tiposhape == 0) {
			$estilo->set ( "symbolname", "ponto" );
			$estilo->set ( "size", 6 );
		}

		$cor = $estilo->color;
		$cor->setrgb ( 255, 210, 0 );
		$cor = $estilo->outlinecolor;
		$cor->setrgb ( 255, 0, 0 );
		$this->salva ();
		return ($novonomelayer);
	}
	/*
	 * function: gravaCoordenadasPt
	 *
	 * L&ecirc; as coordenadas de um tema pontual e grava em arquivos.
	 *
	 * Essa fun&ccedil;&atilde;o &eacute; utilizada nas op&ccedil;&otilde;es que utilizam o R para c&aacute;lculos e necessitam ler as coordenadas dos pontos.
	 *
	 * Parametros:
	 *
	 * tema - nome do tema com os pontos
	 *
	 * limitepontos - FALSE para considerar a extens&atilde;o geogr&aacute;fica do mapa atual e TRUE para considerar como limite as ocorr&ecirc;ncias pontuais do tema
	 *
	 * extendelimite - percentual utilizado para extender o limite da &aacute;rea resultante
	 *
	 * item - item com os valors de peso (opcional)
	 *
	 * return:
	 *
	 * array com as dimens&otilde;es em x e y e nome dos arquivos com x e y gerados.
	 */
	function gravaCoordenadasPt($tema, $limitepontos = "TRUE", $extendelimite, $item = "") {
		$prjMapa = $this->mapa->getProjection ();
		$layerPt = $this->mapa->getlayerbyname ( $tema );
		$prjTema = $layerPt->getProjection ();
		$layerPt->set ( "tolerance", 0 );
		$layerPt->set ( "template", "none.htm" );
		$nomefinal = nomeRandomico ();
		$nomearq = $this->diretorio . "/" . $nomefinal;

		$itemspt = pegaItens ( $layerPt );
		$shapes = retornaShapesSelecionados ( $layerPt, $this->arquivo, $this->mapa );
		if (count ( $shapes ) == 0) {
			$shapes = retornaShapesMapext ( $layerPt, $this->mapa );
		}
		$pontos = array ();
		$pontosz = array ();
		if (($prjTema != "") && ($prjMapa != $prjTema)) {
			$projInObj = ms_newprojectionobj ( $prjTema );
			$projOutObj = ms_newprojectionobj ( $prjMapa );
		}
		foreach ( $shapes as $shape ) {
			$pt = $shape->getCentroid ();
			if (($prjTema != "") && ($prjMapa != $prjTema)) {
				$pt->project ( $projInObj, $projOutObj );
			}
			$pontos [] = $pt->x . "  " . $pt->y . "\n";
			$pontosx [] = $pt->x;
			$pontosy [] = $pt->y;
			if ($item != "") {
				$pontosz [] = trim ( $shape->values [$item] );
			}
		}
		$layerPt->close ();
		// grava o arquivo com os pontos em x
		$f = fopen ( $nomearq . "x", "w" );
		foreach ( $pontosx as $pt ) {
			fwrite ( $f, $pt . "\n" );
		}
		fclose ( $f );
		// grava o arquivo com os pontos em y
		$f = fopen ( $nomearq . "y", "w" );
		foreach ( $pontosy as $pt ) {
			fwrite ( $f, $pt . "\n" );
		}
		fclose ( $f );
		// grava o arquivo com os pontos em z
		$f = fopen ( $nomearq . "z", "w" );
		foreach ( $pontosz as $pt ) {
			fwrite ( $f, $pt . "\n" );
		}
		fclose ( $f );
		if ($limitepontos == "TRUE") {
			$xi = (min ( $pontosx ));
			$xf = (max ( $pontosx ));
			$yi = (min ( $pontosy ));
			$yf = (max ( $pontosy ));
		} else {
			$ext = $this->mapa->extent;
			$xi = $ext->minx;
			$xf = $ext->maxx;
			$yi = $ext->miny;
			$yf = $ext->maxy;
		}
		if ($extendelimite > 0) {
			$dx = $xf - $xi;
			$dy = $yf - $yi;
			$maisx = ($dx * $extendelimite) / 100;
			$maisy = ($dy * $extendelimite) / 100;
			$xi = $xi - $maisx;
			$xf = $xf + $maisx;
			$yi = $yi - $maisy;
			$yf = $yf + $maisy;
		}
		$dimx = "c(" . $xi . "," . $xf . ")";
		$dimy = "c(" . $yi . "," . $yf . ")";
		return array (
				"dimx" => $dimx,
				"dimy" => $dimy,
				"arqx" => ($nomearq . "x"),
				"arqy" => ($nomearq . "y"),
				"arqz" => ($nomearq . "z"),
				"prefixoarquivo" => $nomearq
		);
	}
	/*
	 * function unserializeGeo
	 *
	 * Deserializa um arquivo de geometrias.
	 *
	 * Parametros:
	 * $arquivo - arquivo que ser&aacute; processado
	 */
	public function unserializeGeo($arq) {
		$handle = fopen ( $arq, "r" );
		$conteudo = fread ( $handle, filesize ( $arq ) );
		fclose ( $handle );
		return (unserialize ( $conteudo ));
	}
	/*
	 * function serializeGeo
	 *
	 * Deserializa um arquivo de geometrias.
	 *
	 * Parametros:
	 * $arquivo - arquivo que ser&aacute; processado
	 *
	 * $geos - array com os dados
	 */
	public function serializeGeo($arq, $geos) {
		if (file_exists ( $arq )) {
			unlink ( $arq );
		}
		$fp = fopen ( $arq, "w" );
		$r = serialize ( $geos );
		fwrite ( $fp, $r );
		fclose ( $fp );
	}
	/*
	 * Function: classesRasterI
	 *
	 * Gera par&acirc;metros para classifica&ccedil;&atilde;o de imagens.
	 *
	 * Gera a express&atilde;o e as cores para uso em classes com intervalos iguais para representa&ccedil;&atilde;o de imagens raster.
	 *
	 * Parametros:
	 *
	 * $minvalor {numeric} - Menor valor existente na s&eacute;rie
	 *
	 * $maxvalor {numeric} - Maior valor
	 *
	 * $nclasses {numeric} - N&uacute;mero de classes
	 *
	 * $cores {array} - Cores. Array de array de cores cores[0] = array(r,g,b)
	 *
	 * Retorno:
	 *
	 * (start code)
	 * array(
	 * array(
	 * "nomeclasse"=>,
	 * "expressao"=>,
	 * "cores"=>
	 * )
	 * )
	 * (end)
	 */
	// //error_reporting(0);
	function classesRasterI($minvalor, $maxvalor, $nclasses, $cores) {
		$resultado = array ();
		$intervalo = intval ( 250 / $nclasses );
		$trans = 250 / ($maxvalor - $minvalor);
		$intervalo = (($maxvalor * $trans) - ($minvalor * $trans)) / $nclasses;
		$conta = 0;
		for($i = 0; $i < $nclasses; ++ $i) {
			$expressao = "([pixel]>=" . $conta . " and [pixel]<" . ($conta + $intervalo) . ")";
			$nomeclasse = ">= " . ($conta / $trans) . " e < que " . (($conta + $intervalo) / $trans);
			$resultado [] = array (
					"nomeclasse" => $nomeclasse,
					"expressao" => $expressao,
					"cores" => $cores [$i]
			);
			$conta = $conta + $intervalo;
		}
		return $resultado;
	}
	function executaR($rcode, $dir_tmp, $R_path, $gfile_name = "") {
		$R_options = "--slave --no-save";
		$r_name = nomeRandomico ( 20 );
		$r_input = $dir_tmp . "/" . $r_name . ".R";
		$r_output = $dir_tmp . "/" . $r_name . ".Rout";
		gravaDados ( $rcode, $r_input );
		$command = $R_path . " $R_options < $r_input > $r_output";
		$result = "";
		$error = "";
		$exec_result = exec ( $command, $result, $error );
		// corta a imagem final
		// include_once("classe_imagem.php");
		// $m = new Imagem($dir_tmp."/".$gfile_name.".png");
		// $i = $m->cortaBorda();
		// imagepng($i,$dir_tmp."/".$gfile_name.".png");
		return ($r_input);
	}
	/*
	 * Function: criaImagemR
	 *
	 * Cria uma imagem png a partir de dados armazenados em disco.
	 *
	 * Utilizado para gerar uma imagem com base nos resultados de comandos R.
	 *
	 * O nome da imagem criada ser&aacute; o mesmo nome de $nomearq, por&eacute;m com extens&atilde;o .png
	 *
	 * Parametros:
	 *
	 * $nomearq {string} - Nome do arquivo no servidor que ser&aacute; utilizado para gerar a imagem.
	 *
	 * Retorno:
	 *
	 * {array($minpixel,$maxpixel)} - tamanho da imagem gerada.
	 */
	function criaImagemR($nomearq) {
		if (! file_exists ( $nomearq . "img" )) {
			return "erro";
		}
		// pega os parametros
		$abre = fopen ( $nomearq . "h", "r" );
		while ( ! feof ( $abre ) ) {
			$buffer = fgets ( $abre );
			$pararray [] = $buffer;
		}
		fclose ( $abre );

		$xsize = $pararray [0];
		$ysize = $pararray [1];
		$xdim = $pararray [2];
		$ydim = $pararray [3];
		$wh = explode ( " ", $pararray [4] );
		// pega os valores dos pixels
		$abre = fopen ( $nomearq . "img", "r" );
		$buffer = fgets ( $abre );
		fclose ( $abre );
		$pixelimg = explode ( " ", $buffer );
		$minpixel = min ( $pixelimg );
		$maxpixel = max ( $pixelimg );
		$trans = 250 / ($maxpixel - $minpixel);
		$img = imagecreatetruecolor ( $wh [0], $wh [1] );
		$celula = 0;
		for($x = 0; $x < $wh [0]; ++ $x) {
			for($y = ($wh [1] - 1); $y >= 0; $y --) {
				$cor = imagecolorresolve ( $img, $pixelimg [$celula] * $trans, $pixelimg [$celula] * $trans, $pixelimg [$celula] * $trans );
				imagesetpixel ( $img, $x, $y, $cor );
				$celula = $celula + 1;
			}
		}

		Imagepng ( $img, $nomearq . ".png" );
		ImageDestroy ( $nomearq . ".png" );
		$dadosw [] = trim ( $xsize );
		$dadosw [] = 0;
		$dadosw [] = 0;
		$dadosw [] = trim ( $ysize * - 1 );
		$temp = explode ( " ", $xdim );
		$dadosw [] = trim ( $temp [0] );
		$temp = explode ( " ", $ydim );
		$dadosw [] = trim ( $temp [1] );
		$fp = fopen ( $nomearq . ".wld", "w" );
		foreach ( $dadosw as $dado ) {
			fwrite ( $fp, $dado . "\n" );
		}
		fclose ( $fp );
		$retorno = array (
				$minpixel,
				$maxpixel
		);
		return $retorno;
	}
}
?>
