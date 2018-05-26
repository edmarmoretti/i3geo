<?php
/****************************************************************/
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../php/checaLogin.php");
\admin\php\login\checaLogin ();
// funcoes de administracao
include ($_SESSION ["locaplic"] . "/admin/php/funcoesAdmin.php");
//
// carrega outras funcoes e extensoes do PHP
//
include ($_SESSION ["locaplic"] . "/classesphp/carrega_ext.php");
//
// conexao com o banco de administracao
// cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION ["locaplic"] . "/admin/php/conexao.php");
/**
 * ************************************************************
 */
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/subirshapefile" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}
if (! isset ( $idioma ) || $idioma == "") {
	$idioma = "pt";
}

if (isset ( $_GET ["tipo"] )) {
	$tipo = $_GET ["tipo"];
}
if (! isset ( $_FILES ['i3GEOuploadshp'] ['name'] )) {
	return;
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<META HTTP-EQUIV="Content-Type">
<meta charset='utf-8'>
<meta http-equiv='X-UA-Compatible' content='IE=edge'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<link rel='stylesheet' type='text/css' href='../../../pacotes/jquery/jquery-ui/jquery-ui.min.css'>
<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>
<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/icon?family=Material+Icons'>
<!-- Bootstrap core CSS -->
<link href='../../../pacotes/bootstrap/css/bootstrap.min.css' rel='stylesheet'>
<!-- Bootstrap Material Design -->
<link rel='stylesheet' type='text/css' href='../../../pacotes/bootstrap-material-design/dist/css/bootstrap-material-design.min.css'>
<link rel='stylesheet' type='text/css' href='../../../pacotes/bootstrap-material-design/dist/css/ripples.min.css'>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<link href='../../../pacotes/bootstrap/css/ie10-viewport-bug-workaround.css' rel='stylesheet'>
<!-- Custom styles for this template -->
<link href='../../../pacotes/font-awesome/css/font-awesome.min.css' rel='stylesheet'>

<link href='../../../pacotes/bootstrap-accessibility-plugin/plugins/css/bootstrap-accessibility.css' rel='stylesheet'>
<script src='../../../admin/headjs.php'></script>
<script src="../../../js/util.js"></script>
</head>
<body bgcolor="white" style="background-color: white; text-align: left;">
	<p>
<?php
ob_flush ();flush (); sleep ( 2 );
if (isset ( $_FILES ['i3GEOuploadshp'] ['name'] )) {
	$i3GEOuploadCriaMapfile = $_POST ["i3GEOuploadCriaMapfile"];
	$dirDestino = $_SESSION ["i3geoUploadDataWL"] ["arquivos"] [$_POST ["dirDestino"]];
	$dirDestino = str_replace ( ".", "", $dirDestino );
	if (empty ( $dirDestino )) {
		echo "<div class='alert alert-danger' role='alert'>Pasta n&atilde;o encontrada</div>";
		exit ();
	}
	// $checaDestino = dirname ( $_SESSION["locaplic"] );
	// $dirDestino = str_replace ( $checaDestino, "", $dirDestino );
	// $dirDestino = $checaDestino . "/" . $dirDestino;

	if (isset ( $logExec ) && $logExec ["upload"] == true) {
		i3GeoLog ( "prog: upload filename:" . $_FILES ['i3GEOuploadshp'] ['name'], $dir_tmp );
	}

	echo "<div class='alert alert-success' role='alert'>Carregando o arquivo...</div>";

	ob_flush ();flush (); sleep ( 2 );

	$dirmap = $dirDestino;
	if (! file_exists ( $dirmap ) || $dirmap == dirname ( $_SESSION ["locaplic"] ) || $dirmap == dirname ( $_SESSION ["locaplic"] ) . "/") {
		echo "<div class='alert alert-danger' role='alert'>Pasta n&atilde;o existe no servidor ou o local n&atilde;o &eacute; permitido</div>";
		exit ();
	}
	// verifica nomes
	verificaNome ( $_FILES ['i3GEOuploadshp'] ['name'] );
	verificaNome ( $_FILES ['i3GEOuploadshx'] ['name'] );
	verificaNome ( $_FILES ['i3GEOuploaddbf'] ['name'] );

	if ($_FILES ['i3GEOuploadprj'] ['name'] != "") {
		verificaNome ( $_FILES ['i3GEOuploadprj'] ['name'] );
	}

	// remove acentos
	$nomePrefixo = str_replace ( " ", "_", \admin\php\funcoesAdmin\removeAcentos ( str_replace ( ".shp", "", $_FILES ['i3GEOuploadshp'] ['name'] ) ) );

	$nomePrefixo = str_replace ( ".", "", $nomePrefixo );
	$nomePrefixo = strip_tags ( $nomePrefixo );
	$nomePrefixo = htmlspecialchars ( $nomePrefixo, ENT_QUOTES );

	// sobe arquivo
	$Arquivo = $_FILES ['i3GEOuploadshp'] ['tmp_name'];
	if (file_exists ( $dirmap . "/" . $nomePrefixo . ".shp" )) {
		echo "<div class='alert alert-danger' role='alert'>J&aacute; existe um SHP com o nome!</div>";
		exit ();
	}
	$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".shp" );
	if ($status != 1) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo SHP. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo ou permiss&atilde;o de escrita na pasta indicada.</div>";
		exit ();
	}

	$Arquivo = $_FILES ['i3GEOuploadshx'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".shx" );
	if ($status != 1) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo SHX</div>";
		exit ();
	}

	$Arquivo = $_FILES ['i3GEOuploaddbf'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".dbf" );
	if ($status != 1) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo DBF</div>";
		exit ();
	}

	if ($_FILES ['i3GEOuploadprj'] ['name'] != "") {
		$Arquivo = $_FILES ['i3GEOuploadprj'] ['tmp_name'];
		$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".prj" );
		if ($status != 1) {
			echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo PRJ</div>";
			exit ();
		}
	}

	if (! file_exists ( $dirmap . "/" . $nomePrefixo . ".shp" )) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu algum problema no envio do arquivo</div>";
		exit ();
	}

	$checkphp = \admin\php\funcoesAdmin\fileContemString ( $dirmap . "/" . $nomePrefixo . ".prj", "<?php" );
	if ($checkphp == true) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo prj invalido</div>";
		unlink ( $dirmap . "/" . $nomePrefixo . ".shp" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".dbf" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".shx" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".prj" );
		exit ();
	}
	$checkphp = \admin\php\funcoesAdmin\fileContemString ( $dirmap . "/" . $nomePrefixo . ".shx", "<?php" );
	if ($checkphp == true) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo shx invalido</div>";
		unlink ( $dirmap . "/" . $nomePrefixo . ".shp" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".dbf" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".shx" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".prj" );
		exit ();
	}
	$checkphp = \admin\php\funcoesAdmin\fileContemString ( $dirmap . "/" . $nomePrefixo . ".dbf", "<?php" );
	if ($checkphp == true) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo dbf invalido</div>";
		unlink ( $dirmap . "/" . $nomePrefixo . ".shp" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".dbf" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".shx" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".prj" );
		exit ();
	}
	echo "<div class='alert alert-success' role='alert'>Arquivo enviado.</div>";
	ob_flush ();flush (); sleep ( 2 );
	if ($i3GEOuploadCriaMapfile == "on" && file_exists ( $_SESSION ["locaplic"] . "/temas/" . $nomePrefixo . ".map" )) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo mapfile com esse nome j&aacute; existe.</div>";
		$i3GEOuploadCriaMapfile = "";
	}
	if ($i3GEOuploadCriaMapfile == "on") {
		echo "<div class='alert alert-success' role='alert'>Criando mapfile...</div>";
		ob_flush ();flush (); sleep ( 2 );
		// verifica se o usuario marcou a opcao de cria mapfile
		// nesse caso o aplicativo de upload esta sendo executado de dentro do sistema de administracao, e o mapfile devera
		// ser criado e registrado no sistema
		$nome = $nomePrefixo;
		$codigo = $nomePrefixo;
		$it = $nomePrefixo;
		$en = $nomePrefixo;
		$es = $nomePrefixo;
		$sfileObj = ms_newShapefileObj ( $dirmap . "/" . $nomePrefixo . ".shp", - 1 );
		$tipo = $sfileObj->type;
		if ($tipo == 1) {
			$tipoLayer = MS_LAYER_POINT;
		}
		if ($tipo == 3) {
			$tipoLayer = MS_LAYER_LINE;
		}
		if ($tipo == 5) {
			$tipoLayer = MS_LAYER_POLYGON;
		}
		$data = $dirmap . "/" . $nomePrefixo . ".shp";
		include ($_SESSION ["locaplic"] . "/admin/catalogo/mapfile/funcoes.php");
		$cria = \admin\catalogo\mapfile\adicionar ( $_SESSION ["locaplic"], $nomePrefixo, "", $codigo, "", "", $nomePrefixo, "", $nomePrefixo, $nomePrefixo, true, $dbhw );
		if ($cria == true && file_exists ( $_SESSION ["locaplic"] . "/temas/" . $codigo . ".map" )) {
			$mapa = ms_newMapObj ( $_SESSION ["locaplic"] . "/temas/" . $codigo . ".map" );
			$layer = $mapa->getLayerByName ( $codigo );
			$layer->set ( "data", $data );
			$layer->set ( "type", $tipoLayer );
			if(file_exists($dirmap . "/" . $nomePrefixo . ".prj")){
				$layer->setprojection("AUTO");
			}
			$mapa->save ( $_SESSION ["locaplic"] . "/temas/" . $codigo . ".map" );
			\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $_SESSION ["locaplic"] . "/temas/" . $codigo . ".map" );
			echo "<div class='alert alert-success' role='alert'>Mapfile $nomePrefixo criado!!!</div>";
		} else {
			echo "<div class='alert alert-danger' role='alert'>Mapfile n&atilde;o pode ser criado criado!!!</div>";
		}
	}
	echo "<div class='alert alert-success' role='alert'>Pode fechar essa janela.</div>";
} else {
	echo "<div class='alert alert-danger' role='alert'>Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</div>";
}
if (file_exists ( $_SESSION ["locaplic"] . "/temas/" . $nomePrefixo . ".map" )) {
	echo "<div class='alert alert-info' role='alert'><a href='#' onclick=\"abreEditor('$nomePrefixo')\" class='alert-link'>Editar mapfile</a></div>";
}
function verificaNome($nome) {
	if (strlen ( basename ( $nome ) ) > 200) {
		exit ();
	}
	$nome = strtolower ( $nome );
	$lista = explode ( ".", $nome );
	$extensao = $lista [count ( $lista ) - 1];
	if (($extensao != "dbf") && ($extensao != "shx") && ($extensao != "shp") && ($extensao != "prj")) {
		echo "Nome de arquivo inv&aacute;lido. $nome";
		exit ();
	}
}
?>
<script>
function abreEditor (codigo){
	window.parent.location.href = "../../catalogo/mapfile/opcoes/index.php?codigo=" + codigo + "&id_tema";
}
</script>
</body>
</html>
