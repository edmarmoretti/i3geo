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
		$this->dbaseExiste = true;
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

}
?>
