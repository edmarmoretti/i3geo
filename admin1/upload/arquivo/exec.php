<?php
include_once (dirname ( __FILE__ ) . "/../../../admin/php/login.php");

if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/subirshapefile" ) == false) {
	\admin\php\funcoesAdmin\retornaJSON ( "Vc nao pode realizar essa operacao." );
	exit ();
}

if (isset ( $_GET ["tipo"] )) {
	$tipo = $_GET ["tipo"];
}
// locaplic e usado para definir a pasta de destino
if (empty ( $locaplic )) {
	exit ();
}
error_reporting ( 0 );
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../../css/input.css" />
<link rel="stylesheet" type="text/css" href="../../../css/geral.css" />
<script src="../../../classesjs/classe_util.js"></script>
<title></title>
</head>
<body bgcolor="white" style="background-color: white; text-align: left;">
	<p>
<?php
if (isset ( $_FILES ['i3GEOuploadshp'] ['name'] )) {
	$dirDestino = $_POST ["dirDestino"];
	$dirDestino = str_replace(".","",$dirDestino);
	if (empty ( $dirDestino )) {
		echo "Pasta n&atilde;o encontrada";
		exit ();
	}
	$checaDestino = dirname ( $locaplic );
	$dirDestino = str_replace ( $checaDestino, "", $dirDestino );
	$dirDestino = $checaDestino . "/" . $dirDestino;

	if (isset ( $logExec ) && $logExec ["upload"] == true) {
		i3GeoLog ( "prog: upload filename:" . $_FILES ['i3GEOuploadshp'] ['name'], $dir_tmp );
	}

	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush ();
	flush ();
	sleep ( 1 );
	$dirmap = $dirDestino;
	if (! file_exists ( $dirmap ) || $dirmap == dirname ( $locaplic ) || $dirmap == dirname ( $locaplic )."/") {
		echo "<p class='paragrafo' >Pasta n&atilde;o existe no servidor ou o local n&atilde;o &eacute; permitido";
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
		echo "<p class='paragrafo' >J&aacute; existe um SHP com o nome ";
		paraAguarde ();
		exit ();
	}
	$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".shp" );
	if ($status != 1) {
		echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHP. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo ou permiss&atilde;o de escrita na pasta indicada.";
		paraAguarde ();
		exit ();
	}

	$Arquivo = $_FILES ['i3GEOuploadshx'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".shx" );
	if ($status != 1) {
		echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHX";
		paraAguarde ();
		exit ();
	}

	$Arquivo = $_FILES ['i3GEOuploaddbf'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".dbf" );
	if ($status != 1) {
		echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo DBF";
		paraAguarde ();
		exit ();
	}

	if ($_FILES ['i3GEOuploadprj'] ['name'] != "") {
		$Arquivo = $_FILES ['i3GEOuploadprj'] ['tmp_name'];
		$status = move_uploaded_file ( $Arquivo, $dirmap . "/" . $nomePrefixo . ".prj" );
		if ($status != 1) {
			echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo PRJ";
			paraAguarde ();
			exit ();
		}
	}

	if (! file_exists ( $dirmap . "/" . $nomePrefixo . ".shp" )) {
		echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ";
		paraAguarde ();
		exit ();
	}

	$checkphp = fileContemString ( $dirmap . "/" . $nomePrefixo . ".prj", "<?" );
	if ($checkphp == true) {
		echo "Arquivo prj invalido";
		unlink ( $dirmap . "/" . $nomePrefixo . ".shp" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".dbf" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".shx" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".prj" );
		exit ();
	}
	$checkphp = fileContemString ( $dirmap . "/" . $nomePrefixo . ".shx", "<?" );
	if ($checkphp == true) {
		echo "Arquivo shx invalido";
		unlink ( $dirmap . "/" . $nomePrefixo . ".shp" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".dbf" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".shx" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".prj" );
		exit ();
	}
	$checkphp = fileContemString ( $dirmap . "/" . $nomePrefixo . ".dbf", "<?" );
	if ($checkphp == true) {
		echo "Arquivo dbf invalido";
		unlink ( $dirmap . "/" . $nomePrefixo . ".shp" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".dbf" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".shx" );
		unlink ( $dirmap . "/" . $nomePrefixo . ".prj" );
		exit ();
	}
	echo "<p class='paragrafo' >Arquivo enviado.</p>";
	echo "<p class='paragrafo'></p>";
	if ($i3GEOuploadCriaMapfile == "on") {
		// verifica se o usuario marcou a opcao de cria mapfile
		// nesse caso o aplicativo de upload esta sendo executado de dentro do sistema de administracao, e o mapfile devera
		// ser criado e registrado no sistema
		$nome = $nomePrefixo;
		$codigo = $nomePrefixo;
		$it = $nomePrefixo;
		$en = $nomePrefixo;
		$es = $nomePrefixo;
		$sfileObj = ms_newShapefileObj ( $dirmap . "/" . $nomePrefixo . ".shp", - 1 );
		if (! isset ( $tipo ) || $tipo == "") {
			$tipo = $sfileObj->type;
		}
		if ($tipo == 1) {
			$tipoLayer = "point";
		}
		if ($tipo == 3) {
			$tipoLayer = "line";
		}
		if ($tipo == 5) {
			$tipoLayer = "polygon";
		}
		$funcao = "CRIARNOVOMAP";
		$output = "retorno";
		$data = $dirmap . "/" . $nomePrefixo . ".shp";
		include_once ($locaplic . "/admin/php/editormapfile.php");
		echo "<b><p class='paragrafo' >Criado!!!<br>";
		echo "Para editar clique: <a href='../../admin/html/editormapfile.html' target=_blank >editar</a>";
		echo "<script>window.scrollTo(0,10000);i3GEO.util.insereCookie('I3GEOletraAdmin','" . $nomePrefixo . "');</script>";
	}
	echo "<p class='paragrafo'>Pode fechar essa janela.</p>";
} else {
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
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
		paraAguarde ();
		exit ();
	}
}
?>


</body>
</html>
