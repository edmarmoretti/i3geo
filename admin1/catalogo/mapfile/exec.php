<?php
/*
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Edmar Moretti
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
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
error_reporting ( 0 );
//
// pega as variaveis passadas com get ou post
//

include_once (dirname ( __FILE__ ) . "/../../../admin/php/login.php");
$funcoesEdicao = array (
		"LISTA",
		"ADICIONAR",
		"EXCLUIR",
		"LIMPACACHE",
		"CLONARMAPFILE"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");

// $id_mapa = $_POST["id_mapa"];
// testaSafeNumerico([$id_mapa]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$codigo = $_POST ["codigo"];
		$codigo = str_replace ( " ", "", removeAcentos ( $codigo ) );
		$codigo = str_replace ( ".", "", $codigo );
		$codigo = strip_tags ( $codigo );
		$codigo = htmlspecialchars ( $codigo, ENT_QUOTES );
		$arq = $locaplic . "/temas/" . $codigo . ".map";
		if ($codigo == "" || file_exists ( $arq )) {
			header ( "HTTP/1.1 400 arquivo ja existe" );
			exit ();
		}
		$novo = adicionar ( $locaplic, $_POST["titulolegenda"], $_POST ["link_tema"], $codigo, $_POST ["acessopublico"], $_POST ["metaestat"], $_POST ["titulo"], $_POST ["desc_tema"], $_POST ["tituloEN"], $_POST ["tituloES"], true, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( array (
				"codigo" => $codigo
		) );
		exit ();
		break;
	case "EXCLUIR" :
		$codigo = $_POST ["codigo"];
		$codigo = str_replace ( " ", "", removeAcentos ( $codigo ) );
		$codigo = str_replace ( ".", "", $codigo );
		$codigo = strip_tags ( $codigo );
		$codigo = htmlspecialchars ( $codigo, ENT_QUOTES );
		$retorna = excluir ( $codigo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 400 $retorna" );
			exit ();
		}
		retornaJSON ( array (
				"codigo" => $codigo
		) );
		exit ();
		break;
	case "LISTA" :
		$retorna = lista ( $dbh, $_POST ["filtro"], $_POST ["palavra"], $_POST ["validar"] );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $retorna );
		exit ();
		break;
	case "LIMPACACHE" :
		$mapfile = $locaplic . "/temas/" . $_POST ["codigo"] . ".map";
		if (! file_exists ( $mapfile )) {
			header ( "HTTP/1.1 403 arquivo nao existe" );
			exit ();
		}
		$mapa = ms_newMapObj ( $mapfile );
		$nomes = $mapa->getalllayernames ();
		// $cachedir e $dir_tmp vem de ms_configura.php
		if ($cachedir != "") {
			$d = $cachedir;
		} else {
			$d = $dir_tmp . "/cache";
		}
		foreach ( $nomes as $nome ) {
			$nome = str_replace ( ".", "", $nome );
			$nome = strip_tags ( $nome );
			$nome = htmlspecialchars ( $nome, ENT_QUOTES );
			$dirs [] = $d . "/" . $nome;
			$dirs [] = $d . "/googlemaps/" . $nome;
			$dirs [] = $d . "/wmts/" . $nome;
			foreach ( $dirs as $dir ) {
				rrmdir ( $dir );
			}
		}
		retornaJSON ( "ok" );
		exit ();
		break;
	case "CLONARMAPFILE" :
		$codigo = $_POST ["codigo"];
		$codigo = str_replace ( " ", "", removeAcentos ( $codigo ) );
		$codigo = str_replace ( ".", "", $codigo );
		$codigo = strip_tags ( $codigo );
		$codigo = htmlspecialchars ( $codigo, ENT_QUOTES );

		$novocodigo = $_POST ["novocodigo"];
		$novocodigo = str_replace ( " ", "", removeAcentos ( $novocodigo ) );
		$novocodigo = str_replace ( ".", "", $novocodigo );
		$novocodigo = strip_tags ( $novocodigo );
		$novocodigo = htmlspecialchars ( $novocodigo, ENT_QUOTES );

		$arq = $locaplic . "/temas/" . $codigo . ".map";
		$arqnovo = $locaplic . "/temas/" . $novocodigo . ".map";

		if ($codigo == "" || !file_exists ( $arq )) {
			header ( "HTTP/1.1 400 arquivo nao existe" );
			exit ();
		}
		if ($novocodigo == "" || file_exists ( $arqnovo )) {
			header ( "HTTP/1.1 400 arquivo ja existe" );
			exit ();
		}
		//obtem os dados do banco do tema existente
		$dados = pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoadmin_temas WHERE codigo_tema = '" . $codigo . "'", $dbh, false );
		if (count ( $dados ) > 0) {
			//o mapfile esta registrado como um tema no banco de adm
			$dataCol = array (
				"link_tema" => $dados [0] ["link_tema"],
				"kml_tema" => $dados [0] ["kml_tema"],
				"kmz_tema" => $dados [0] ["kmz_tema"],
				"ogc_tema" => $dados [0] ["ogc_tema"],
				"download_tema" => $dados [0] ["download_tema"],
				"desc_tema" => "",
				"tipoa_tema" => $dados [0] ["tipoa_tema"],
				"tags_tema" => '',
				"nome_tema" => $_POST["titulo"],
				"codigo_tema" => $novocodigo,
				"it" => "",
				"es" => "",
				"en" => ""
			);
			$acessopublico = $dados [0] ["download_tema"];
		} else {
			$acessopublico = "";
		}
		//faz a copia do mapfile
		$mapa = ms_newMapObj($arq);
		$layer = @$mapa->getlayerbyname($codigo);
		$layer->set("name",$novocodigo);
		$layer->setmetadata("TEMA",$_POST["titulo"]);
		$mapa->save($arqnovo);
		include(dirname(__FILE__)."/../../php/removeCabecalhoMapfile.php");
		removeCabecalhoMapfile($arqnovo);

		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		} elseif (count ( $dados ) > 0) {
			//registra no banco de dados caso nao tenha ocorrido erro ao criar o mapfile
			i3GeoAdminInsert ( $dbhw, "i3geoadmin_temas", $dataCol );
		}
		retornaJSON ( array (
				"codigo" => $novocodigo
		) );
		exit ();
		break;
}
cpjson ( $retorno );
function excluir($codigo, $dbhw) {
	global $locaplic, $esquemaadmin;
	// pega o id do tema
	// se o mapfile nao estiver registrado, $id sera vazio
	$dados = pegaDados ( "SELECT id_tema from " . $esquemaadmin . "i3geoadmin_temas WHERE codigo_tema = '" . $codigo . "'", $dbhw, false );
	if (count ( $dados ) > 0) {
		$id = $dados [0] ["id_tema"];
	} else {
		$id = "";
	}
	// verifica se o tema esta em uso
	if ($id != "") {
		$r = pegaDados ( "SELECT id_tema from " . $esquemaadmin . "i3geoadmin_n3 where id_tema ='$id'", $dbhw, false );
		if (count ( $r ) > 0) {
			return "o tema e utilizado em algum subgrupo";
		}
		$r = pegaDados ( "SELECT id_tema from " . $esquemaadmin . "i3geoadmin_raiz where id_tema ='$id'", $dbhw, false );
		if (count ( $r ) > 0) {
			return "o tema e utilizado em alguma raiz";
		}
	}
	if (! file_exists ( "$locaplic/temas/" . $codigo . ".map" )) {
		return "o arquivo mapfile nao existe";
	}
	// verifica se pode escrever
	$handle = fopen ( "$locaplic/temas/" . $codigo . ".map", "r+" );
	if ($handle == false) {
		return "o arquivo nao pode ser apagado verifique as permissoes";
	}
	fclose ( $handle );
	// tenta excluir do banco
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_temas", "id_tema", $id, $dbhw, true );
	if ($resultado === false) {
		return "nao foi possivel excluir do banco de dados";
	}
	unlink ( "$locaplic/temas/" . $codigo . ".map" );
	return true;
}
function adicionar($locaplic, $titulolegenda, $link_tema, $codigo, $acessopublico, $metaestat, $titulo, $desc_tema, $tituloEN, $tituloES, $registraBanco, $dbhw) {
	global $convUTF, $esquemaadmin;
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if (empty ( $acessopublico ) || $acessopublico == "on") {
		$acessopublico = "SIM";
	} else {
		$acessopublico = "SIM";
	}
	if(mb_detect_encoding($titulolegenda,'UTF-8, ISO-8859-1') == "UTF-8"){
		$titulolegenda = utf8_decode($titulolegenda);
	}
	$tipoLayer = "line";
	$dados [] = "MAP";
	$dados [] = "SYMBOLSET ../symbols/simbolosv6.sym";
	$dados [] = 'FONTSET   "../symbols/fontes.txt"';
	$dados [] = "LAYER";
	$dados [] = '	NAME "' . $codigo . '"';
	$dados [] = '	TEMPLATE "none.htm"';
	if (! empty ( $metaestat ) && $metaestat == "SIM") {
		$dados [] = '	CONNECTIONTYPE POSTGIS';
		$tipoLayer = "polygon";
	}
	$dados [] = "	TYPE " . $tipoLayer;
	$dados [] = '	DATA ""';
	$dados [] = '	CONNECTION ""';
	$dados [] = '	STATUS OFF';
	$dados [] = '	METADATA';
	$dados [] = '		TEMA "' . $titulolegenda . '"';
	$dados [] = '		CLASSE "SIM"';
	$tipoa_tema = "";
	if (! empty ( $metaestat ) && $metaestat == "SIM") {
		$dados [] = '		METAESTAT "SIM"';
		// para marcar no banco de dados de administracao
		$tipoa_tema = "META";
	}
	$dados [] = '		permiteogc "' . $acessopublico . '"';
	$dados [] = '		permitedownload "' . $acessopublico . '"';
	$dados [] = '		permitekml "' . $acessopublico . '"';
	$dados [] = '		permitekmz "' . $acessopublico . '"';
	$dados [] = '	END';
	$dados [] = '    CLASS';
	$dados [] = '        NAME ""';
	$dados [] = '        STYLE';
	$dados [] = '        	COLOR 0 0 0';
	$dados [] = '        	SIZE 12';
	$dados [] = '        END';
	$dados [] = '    END';
	$dados [] = "END";
	$dados [] = "END";

	// abre o arquivo para ver se nao deu erro antes de adicionar ao banco
	$fp = fopen ( $arq, "w" );
	if ($fp === false) {
		return false;
	}
	if ($convUTF != true) {
		$titulo = utf8_decode ( $titulo );
		$desc_tema = utf8_decode ( $desc_tema );
	}
	if($registraBanco == true){
		try {
			$dataCol = array (
					"link_tema" => $link_tema,
					"kml_tema" => $acessopublico,
					"kmz_tema" => $acessopublico,
					"ogc_tema" => $acessopublico,
					"download_tema" => $acessopublico,
					"desc_tema" => $desc_tema,
					"tipoa_tema" => $tipoa_tema,
					"tags_tema" => '',
					"nome_tema" => $titulo,
					"codigo_tema" => $codigo,
					"it" => "",
					"es" => $tituloES,
					"en" => $tituloEN
			);
			i3GeoAdminInsert ( $dbhw, "i3geoadmin_temas", $dataCol );
			// salva o arquivo mapfile
			foreach ( $dados as $dado ) {
				fwrite ( $fp, $dado . "\n" );
			}
			fclose ( $fp );
			return true;
		} catch ( PDOException $e ) {
			return false;
		}
	} else {
		return true;
	}
}
function lista($dbh, $filtro = "", $palavra = "", $validar = "") {
	global $convUTF, $locaplic, $esquemaadmin;
	$arquivos = array ();
	if (is_dir ( $locaplic . "/temas" )) {
		if ($dh = opendir ( $locaplic . "/temas" )) {
			while ( ($file = readdir ( $dh )) !== false ) {
				if (! stristr ( $file, '.map' ) === FALSE) {
					$file = str_replace ( ".map", "", $file );
					// verifica se existe um filtro de palavra
					if ($palavra != "") {
						if (stripos ( $file, $palavra ) !== false) {
							$arquivos [] = array (
									"nome" => $file
							);
						}
					} else {
						$arquivos [] = array (
								"nome" => $file
						);
					}
				}
			}
		}
		closedir ( $dh );
	}
	sort ( $arquivos );

	//
	// pega o nome de cada tema filtrando a listagem se for o caso
	//
	$regs = pegaDados ( "select * from " . $esquemaadmin . "i3geoadmin_temas ", $dbh, false );

	$nomes = array ();
	$ids = array ();
	$dadosBanco = array ();
	foreach ( $regs as $reg ) {
		if ($convUTF != true) {
			$reg ["nome_tema"] = utf8_decode ( $reg ["nome_tema"] );
		}
		$nomes [$reg ["codigo_tema"]] = $reg ["nome_tema"];
		$ids [$reg ["codigo_tema"]] = $reg ["id_tema"];
		$dadosBanco [$reg ["id_tema"]] = $reg;
	}
	$lista = array ();
	foreach ( $arquivos as $arq ) {
		$arq = $arq ["nome"];
		$nT = explode ( ".", $arq );
		$n = $nomes [$nT [0]];
		if (! $n) {
			$n = "";
		}
		$id = $ids [$nT [0]];
		//o mapfile nao esta registrado no banco
		if (! $id && empty($validar)) {
			$id = "";
		} else {
			//aplica as validacoes. Se nao passar na validacao $id ficara vazio, para nao mostrar no resultado final
			switch ($validar) {
				case 1 :
					if($dadosBanco[$id]["link_tema"] !== ""){
						$id = "";
					}
				break;
				case 2 :
					if($dadosBanco[$id]["nome_tema"] == ""){
						$id = "-";
					} else {
						$id = "";
					}
				break;
				case 3 :
					if($dadosBanco[$id]["nome_tema"] == ""){
						$id = "";
					}
				break;
				case 4 :
					if(strtolower($dadosBanco[$id]["download_tema"]) !== "sim"){
						$id = "";
					}
				break;
				case 5 :
					if(strtolower($dadosBanco[$id]["download_tema"]) !== "nao"){
						$id = "";
					}
				break;
				case 6 :
					if(strtolower($dadosBanco[$id]["ogc_tema"]) !== "sim"){
						$id = "";
					}
				break;
				case 7 :
					if(strtolower($dadosBanco[$id]["ogc_tema"]) !== "nao"){
						$id = "";
					}
				break;
				case 8 :
					if(strtolower($dadosBanco[$id]["kml_tema"]) !== "sim"){
						$id = "";
					}
				break;
				case 9 :
					if(strtolower($dadosBanco[$id]["kml_tema"]) !== "nao"){
						$id = "";
					}
				break;
				case 10 :
					if(strtolower($dadosBanco[$id]["kmz_tema"]) !== "sim"){
						$id = "";
					}
				break;
				case 11 :
					if(strtolower($dadosBanco[$id]["kmz_tema"]) !== "nao"){
						$id = "";
					}
				break;
			}
		}
		$imagem = "";
		if (file_exists ( $locaplic . "/temas/miniaturas/" . $arq . ".map.mini.png" )) {
			$imagem = $arq . ".map.mini.png";
		}

		if ($validar == 12) {
			if (file_exists ( $locaplic . "/temas/" . $arq . ".map" )) {
				$handle = fopen ( $locaplic . "/temas/" . $arq . ".map", "r" );
				while ( ! feof ( $handle ) ) {
					$linha = fgets ( $handle );
					if (stripos ( $linha, "'TEMA'" ) !== false || stripos ( $linha, '"TEMA"' ) !== false) {
						$ntema = str_replace ( array (
								"'TEMA'",
								'"TEMA"',
								"'tema'",
								'"tema"'
						), "", $linha );
						$ntema = trim ( str_replace ( array (
								"'",
								'"'
						), "", $ntema ) );
						$temp = $n;
						if ($n != $ntema && utf8_decode($temp) != $ntema && $n != "") {
							$n .= "<span style=color:red;margin-left:5px >" . utf8_encode($ntema) . "</span>";
						} else {
							$n .= "<span style=color:lightslategray;margin-left:5px >" . utf8_encode($ntema) . "</span>";
						}
						break;
					}
				}
				fclose ( $handle );
			}
		}
		if ($validar == 13) {
			if (file_exists ( $locaplic . "/temas/" . $arq . ".map" )) {
				$handle = fopen ( $locaplic . "/temas/" . $arq . ".map", "r" );
				// deve buscar dentro de LAYER pois pode haver simbolos antes
				$elayer = false;
				while ( ! feof ( $handle ) ) {
					$linha = trim ( fgets ( $handle ) );
					if (stripos ( $linha, "LAYER" ) === 0) {
						$elayer = true;
					}
					if ($elayer == true && stripos ( $linha, "NAME" ) === 0) {
						$ntema = ltrim ( $linha, "NAMEname" );
						$ntema = trim ( str_replace ( array (
								"'",
								'"'
						), "", $ntema ) );
						if ($arq != $ntema) {
							$n .= "<span style=color:red;margin-left:5px >" . $ntema . "</span>";
						}
						break;
					}
				}
				fclose ( $handle );
			}
		}
		//se id for vazio, nao consta no banco, por isso, se validar for definido, nao pode ser aplicado
		if(empty($validar) || (!empty($validar) && $id != "")){
			$lista [] = array (
					"id_tema" => $id,
					"nome" => $n,
					"codigo" => $arq,
					"imagem" => $imagem,
					"extensao" => ""
			);
		}
	}
	return $lista;
}
function rrmdir($dir) {
	if (is_dir ( $dir )) {
		$objects = scandir ( $dir );
		foreach ( $objects as $object ) {
			if ($object != "." && $object != "..") {
				if (filetype ( $dir . "/" . $object ) == "dir") {
					rrmdir ( $dir . "/" . $object );
				} else {
					$object = str_replace ( ".png", "", $object ) . ".png";
					chmod ( $dir . "/" . $object, 077 );
					unlink ( $dir . "/" . $object );
				}
			}
		}
		reset ( $objects );
		// rmdir($dir);
	}
}
?>
