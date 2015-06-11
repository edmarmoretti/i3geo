<?php
/*
 * Faz o upload de shapefile e insere no banco de dados
 */
include_once("admin.php");
include_once("login.php");
set_time_limit(0);
if(verificaOperacaoSessao("admin/metaestat/editorbanco") == false){
	echo "Vc nao pode realizar essa operacao.";exit;
}
error_reporting(0);
if (ob_get_level() == 0) ob_start();
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white;text-align:left;">
<p>

<?php
if($_POST["tabelaDestino"] == ""){
	echo "Nome da tabela n&atilde;o definido";
	exit;
}
if($_POST["insrid"] == ""){
	echo "SRID n&atilde;o definido";
	exit;
}
if ($_FILES['i3GEOuploadshp']['name'] == ""){
	echo "Arquivo n&atilde;o definido";
	exit;
}
if (isset($_FILES['i3GEOuploadshp']['name'])){
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	ob_flush();
	flush();
	sleep(1);
	$arqshp = $_FILES['i3GEOuploadshp']['tmp_name'];
	//verifica nomes e sobe arquivo
	verificaNome($_FILES['i3GEOuploadshp']['name'],"shp");
	$nomePrefixo = str_replace(" ","_",removeAcentos(str_replace(".shp","",$_FILES['i3GEOuploadshp']['name'])));
	$nomePrefixo = $nomePrefixo."_".(nomeRandomico(4));

	$Arquivo = $_FILES['i3GEOuploadshp']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dir_tmp."/".$nomePrefixo.".shp");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHP";exit;}
	$Arquivo = $_FILES['i3GEOuploadshx']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dir_tmp."/".$nomePrefixo.".shx");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo SHX";exit;}
	$Arquivo = $_FILES['i3GEOuploaddbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dir_tmp."/".$nomePrefixo.".dbf");
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo DBF";exit;}

	if(!file_exists($dir_tmp."/".$nomePrefixo.".shp"))
	{echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ".$dir_tmp."/".$nomePrefixo;paraAguarde();exit;}
	$arqshp = $dir_tmp."/".$nomePrefixo.".shp";

	//pega os parametros de conexao
	include("classe_metaestat.php");
	$m = new Metaestat();
	$conexao = $m->listaConexao($_POST["i3GEOuploadcodigoconexao"],true);
	//array(5) { ["codigo_estat_conexao"]=> string(1) "1" ["bancodedados"]=> string(8) "geosaude" ["host"]=> string(9) "localhost" ["porta"]=> string(4) "5432" ["usuario"]=> string(8) "postgres" }
	//pega as colunas do shapefile
	$shapefileObj = ms_newShapefileObj($arqshp,-1);
	$numshapes = $shapefileObj->numshapes;
	$mapObj = ms_newMapObjFromString("MAP END");
	$layer = ms_newLayerObj($mapObj);
	$layer->set("data",$arqshp);
	$layer->open();
	$colunasTemp = $layer->getItems();
	$colunas = array();
	foreach($colunasTemp as $c){
		//abaixo gid e forcado a entrar
		if(!is_numeric($c) && strtolower($c) != "gid"){
			$colunas[] = $c;
		}
	}
	echo "<br>Numshapes existentes no SHP: ". $numshapes;
	$tipo = $shapefileObj->type;
	echo "<br>Tipo: ". $tipo;
	echo "<br>Colunas: ";
	var_dump($colunas);
	ob_flush();
	flush();
	sleep(1);
	$sqinsert = array();
	//verifica o tipo de coluna
	$tipoColuna = array();
	$testar = $numshapes;
	if($numshapes > 50){
		$testar = 50;
	}
	foreach($colunas as $coluna){
		$tipo = "numeric";
		for ($i=0; $i<$testar;$i++){
			$s = $layer->getShape(new resultObj($i));
			$v = $s->getValue($layer,$coluna);
			if(!is_numeric($v)){
				$tipo = "varchar";
			}
		}
		$tipoColuna[$coluna] = $tipo;
	}
	echo "<br>Tipos das colunas: <pre>";
	var_dump($tipoColuna);
	echo "</pre>";
	ob_flush();
	flush();
	sleep(1);

	try {
		$dbh = new PDO('pgsql:dbname='.$conexao["bancodedados"].';user='.$conexao["usuario"].';password='.$conexao["senha"].';host='.$conexao["host"].';port='.$conexao["porta"]);
	} catch (PDOException $e) {
		echo '<span style=color:red >Connection failed: ' . $e->getMessage();
		exit;
	}

	//gera o script para criar a tabela
	//verifica se a tabela ja existe
	$sql = "SELECT table_name FROM information_schema.tables where table_schema = '".$_POST["i3GEOuploadesquema"]."' AND table_name = '".$_POST["tabelaDestino"]."'";
	$res = $dbh->query($sql,PDO::FETCH_ASSOC);
	if(count($res->fetchAll())>0){
		$tabelaExiste = true;
	}
	else{
		$tabelaExiste = false;
	}
	//encoding do banco de dados
	$sql = "SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname = '".$conexao["bancodedados"]."'";
	$res = $dbh->query($sql,PDO::FETCH_ASSOC);
	$encodingdb = $res->fetchAll();
	$encodingdb = $encodingdb[0];
	$encodingdb = $encodingdb["pg_encoding_to_char"];
	if($encodingdb == "UTF8"){
		$encodingdb = "UTF-8";
	}
	if($encodingdb == "LATIN1"){
		$encodingdb = "ISO-8859-1";
	}
	//a tabela nao existe e e do tipo create
	$sqltabela = array();
	if($tabelaExiste == false && $_POST["tipoOperacao"] == "criar"){
		$sql = "CREATE TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]."(the_geom geometry";
		foreach($colunas as $coluna){
			$sql .= ",".remove_accents(strtolower($coluna))." ".$tipoColuna[$coluna];
		}
		$sql .= ")WITH(OIDS=FALSE)";
		$sqltabela[] = $sql;
		$sqltabela[] = "ALTER TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." OWNER TO ".$conexao["usuario"];
		$sqltabela[] = "CREATE INDEX ".$_POST["tabelaDestino"]."_indx_thegeom ON ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." USING gist (the_geom )";
		if(!empty($_POST["comentarioShp"])){
			$enc = mb_detect_encoding($texto);
			$_POST["comentarioShp"] = mb_convert_encoding($_POST["comentarioShp"],$encodingdb,$enc);
			$sqltabela[] = "COMMENT ON TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." IS '".$_POST["comentarioShp"]."'";
		}
		echo "<br>Sql tabela: <pre>";
		var_dump($sqltabela);
		echo "</pre>";
		ob_flush();
		flush();
		sleep(1);
	}
	if($tabelaExiste == true && $_POST["tipoOperacao"] == "criar"){
		echo "<span style=color:red >A tabela existe. N&atilde;o pode ser criada.</span>";
		exit;
	}
	//se a tabela existe e e para remover os registros
	if($tabelaExiste == true && $_POST["tipoOperacao"] == "apagar"){
		$sqltabela[] = "delete from ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"];
	}
	if($tabelaExiste == true && $_POST["tipoOperacao"] == "apagar" && $_POST["i3GEOuploadesquema"] != "i3geo_metaestat"){
		echo "<span style=color:red >N&atilde;o &eacute; poss&iacute;vel executar essa opera&ccedil;&atilde;o nesse esquema.</span>";
		exit;
	}
	//gera o script para inserir os dados
	$linhas = array();
	$insert = "INSERT INTO ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." (".strtolower(implode(",",$colunas)).",the_geom)";
	echo "<br>Preparando inclus&atilde;o de dados";
	ob_flush();
	flush();
	sleep(1);
	$srid = 4326;
	$escapar = "'";
	for ($i=0; $i<$numshapes;$i++){
		$s = $layer->getShape(new resultObj($i));
		$vs = array();

		foreach($colunas as $coluna){
			$escape = "";
			if($tipoColuna[$coluna] == "varchar"){
				$texto = $s->getValue($layer,$coluna);
				//echo $i." - ".mb_detect_encoding($texto)."<br>";
				//$texto = str_replace("'","",$texto);
				$enc = mb_detect_encoding($texto);
				$textosl = addcslashes($texto,$escapar);
				if($textosl != $texto){
					$escape = "E";
				}
				if($enc != "" && $enc != $encodingdb){
					$textosl = "$escape'".mb_convert_encoding($textosl,$encodingdb,$enc)."'";
				}
				else{
					$textosl = "$escape'".$textosl."'";
				}
				if($textosl == "''"){
					$textosl = 'null';
				}
				$vs[] = $textosl;
			}
			else{
				$valor = $s->getValue($layer,$coluna);
				if($valor == "" || (empty($valor) && $valor != 0)){
					$valor = 'nulo';
				}
				$vs[] = $valor;
			}
		}
		if(($_POST["insrid"] == $_POST["outsrid"]) || $_POST["outsrid"] == ""){
			$vs[] = "st_geomfromtext('".$s->toWkt()."','".$_POST["insrid"]."')";
			$srid = $_POST["insrid"];
		}
		else{
			$vs[] = "st_transform(st_geomfromtext('".$s->toWkt()."','".$_POST["insrid"]."'),'".$_POST["outsrid"]."')";
			$srid = $_POST["outsrid"];
		}
		$str = implode(",",$vs);
		$str = str_replace("nulo",'null',$str);
		$linhas[] = $insert."VALUES(".$escape."".$str.")";
	}
	//echo $linhas[0];exit;
	//echo "<pre>".var_dump($linhas);exit;
	$layer->close();
	echo "<br>Incluindo dados";
	echo "<script>window.scrollTo(0,10000);</script>";
	ob_flush();
	flush();
	sleep(1);
	if($_POST["incluiserialshp"] == "on" || $_POST["i3GEOuploadCriaMapfile"] == "on"){
		$linhas[] = "alter table ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." add gid serial CONSTRAINT ".$_POST["tabelaDestino"]."_gid_pkey PRIMARY KEY";
		echo "<br>alter table ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." add gid serial CONSTRAINT ".$_POST["tabelaDestino"]."_gid_pkey PRIMARY KEY";
	}

	foreach($sqltabela as $linha){
		try {
			$dbh->query($linha);
		} catch (PDOException $e) {
			echo 'Erro: ' . $e->getMessage();
		}
	}
	$bdcon = pg_connect('dbname='.$conexao["bancodedados"].' user='.$conexao["usuario"].' password='.$conexao["senha"].' host='.$conexao["host"].' port='.$conexao["porta"]."options='-c client_encoding=LATIN1'");
	foreach($linhas as $linha){
		try {
			$res = $dbh->query($linha);
			if($res == false){
				$res = pg_query($bdcon,$linha);
				if($res == false){
					$linha = remove_accents($linha);
					$res = $dbh->query($linha);
					if($res == false){
						$res = pg_query($bdcon,$linha);
						if($res == false){
							echo "<br><br><span style=color:red >Erro em: </span>".$linha;
						}
					}
					else{
						echo "<br><br><span style=color:red >Linha com acentos removidos: </span>".$linha;
					}
				}
			}
		} catch (PDOException $e) {
			echo 'Erro: ' . $e->getMessage();
		}
	}
	$sql = "select * from ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"];
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	$r = $q->fetchAll();
	if($numshapes != count($r)){
		echo "<span style='color:red'>";
	}
	echo "<br>Registros existentes no SHP: ". $numshapes;

	echo "<br>Registros na tabela final: ". count($r);
	echo "</span><br>Diferen&ccedil;as podem ocorrer em fun&ccedil;&atilde;o de caracteres acentuados n&atilde;o suportados pelo banco de dados";
	echo "<br><b>Feito!!!<br>Fa&ccedil;a o reload da p&aacute;gina";
	if($_POST["i3GEOuploadCriaMapfile"] == "on"){
		//verifica se o usuario marcou a opcao de cria mapfile
		//nesse caso o aplicativo de upload esta sendo executado de dentro do sistema de administracao, e o mapfile devera
		//ser criado e registrado no sistema
		$nome = $_POST["tabelaDestino"];
		$codigo = $_POST["tabelaDestino"];
		$it = $_POST["tabelaDestino"];
		$en = $_POST["tabelaDestino"];
		$es = $_POST["tabelaDestino"];
		//descobre o tipo de geometria
		$tipo = "select ST_Dimension(the_geom) as d from ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." limit 1";
		$q = $dbh->query($tipo,PDO::FETCH_ASSOC);
		$tipo = $q->fetchAll();
		$tipo = $tipo[0]["d"];
		$tipoLayer = "polygon";
		if ($tipo == 0){
			$tipoLayer = "point";
		}
		if ($tipo == 1){
			$tipoLayer = "line";
		}
		$funcao = "CRIARNOVOMAP";
		$output = "retorno";
		$data = "the_geom from ($sql) as foo using unique gid using srid=$srid ";
		$conexao = 'dbname='.$conexao["bancodedados"].' user='.$conexao["usuario"].' password='.$conexao["senha"].' host='.$conexao["host"].' port='.$conexao["porta"];
		include_once("editormapfile.php");
		echo "<b><p class='paragrafo' >Criado o mapfile!!!<br>";
		echo "Para editar clique: <a href='../../admin/html/editormapfile.html' target=_blank >".$nome."</a>";
		echo "<script>window.scrollTo(0,10000);i3GEO.util.insereCookie('I3GEOletraAdmin','".$nome."');</script>";
	}
	echo "<br><br>Fim";
}
else{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}
function verificaNome($nome,$ext){
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != $ext){
		echo "Nome de arquivo inv&aacute;lido.";
		exit;
	}
}
function remove_accents($string) {
	if (!preg_match('/[\x80-\xff]/', $string))
		return $string;
	if (seems_utf8($string)) {
		$chars = array(
				// Decompositions for Latin-1 Supplement
				chr(195).chr(128) => 'A', chr(195).chr(129) => 'A',
				chr(195).chr(130) => 'A', chr(195).chr(131) => 'A',
				chr(195).chr(132) => 'A', chr(195).chr(133) => 'A',
				chr(195).chr(135) => 'C', chr(195).chr(136) => 'E',
				chr(195).chr(137) => 'E', chr(195).chr(138) => 'E',
				chr(195).chr(139) => 'E', chr(195).chr(140) => 'I',
				chr(195).chr(141) => 'I', chr(195).chr(142) => 'I',
				chr(195).chr(143) => 'I', chr(195).chr(145) => 'N',
				chr(195).chr(146) => 'O', chr(195).chr(147) => 'O',
				chr(195).chr(148) => 'O', chr(195).chr(149) => 'O',
				chr(195).chr(150) => 'O', chr(195).chr(153) => 'U',
				chr(195).chr(154) => 'U', chr(195).chr(155) => 'U',
				chr(195).chr(156) => 'U', chr(195).chr(157) => 'Y',
				chr(195).chr(159) => 's', chr(195).chr(160) => 'a',
				chr(195).chr(161) => 'a', chr(195).chr(162) => 'a',
				chr(195).chr(163) => 'a', chr(195).chr(164) => 'a',
				chr(195).chr(165) => 'a', chr(195).chr(167) => 'c',
				chr(195).chr(168) => 'e', chr(195).chr(169) => 'e',
				chr(195).chr(170) => 'e', chr(195).chr(171) => 'e',
				chr(195).chr(172) => 'i', chr(195).chr(173) => 'i',
				chr(195).chr(174) => 'i', chr(195).chr(175) => 'i',
				chr(195).chr(177) => 'n', chr(195).chr(178) => 'o',
				chr(195).chr(179) => 'o', chr(195).chr(180) => 'o',
				chr(195).chr(181) => 'o', chr(195).chr(182) => 'o',
				chr(195).chr(182) => 'o', chr(195).chr(185) => 'u',
				chr(195).chr(186) => 'u', chr(195).chr(187) => 'u',
				chr(195).chr(188) => 'u', chr(195).chr(189) => 'y',
				chr(195).chr(191) => 'y',
				// Decompositions for Latin Extended-A
				chr(196).chr(128) => 'A', chr(196).chr(129) => 'a',
				chr(196).chr(130) => 'A', chr(196).chr(131) => 'a',
				chr(196).chr(132) => 'A', chr(196).chr(133) => 'a',
				chr(196).chr(134) => 'C', chr(196).chr(135) => 'c',
				chr(196).chr(136) => 'C', chr(196).chr(137) => 'c',
				chr(196).chr(138) => 'C', chr(196).chr(139) => 'c',
				chr(196).chr(140) => 'C', chr(196).chr(141) => 'c',
				chr(196).chr(142) => 'D', chr(196).chr(143) => 'd',
				chr(196).chr(144) => 'D', chr(196).chr(145) => 'd',
				chr(196).chr(146) => 'E', chr(196).chr(147) => 'e',
				chr(196).chr(148) => 'E', chr(196).chr(149) => 'e',
				chr(196).chr(150) => 'E', chr(196).chr(151) => 'e',
				chr(196).chr(152) => 'E', chr(196).chr(153) => 'e',
				chr(196).chr(154) => 'E', chr(196).chr(155) => 'e',
				chr(196).chr(156) => 'G', chr(196).chr(157) => 'g',
				chr(196).chr(158) => 'G', chr(196).chr(159) => 'g',
				chr(196).chr(160) => 'G', chr(196).chr(161) => 'g',
				chr(196).chr(162) => 'G', chr(196).chr(163) => 'g',
				chr(196).chr(164) => 'H', chr(196).chr(165) => 'h',
				chr(196).chr(166) => 'H', chr(196).chr(167) => 'h',
				chr(196).chr(168) => 'I', chr(196).chr(169) => 'i',
				chr(196).chr(170) => 'I', chr(196).chr(171) => 'i',
				chr(196).chr(172) => 'I', chr(196).chr(173) => 'i',
				chr(196).chr(174) => 'I', chr(196).chr(175) => 'i',
				chr(196).chr(176) => 'I', chr(196).chr(177) => 'i',
				chr(196).chr(178) => 'IJ',chr(196).chr(179) => 'ij',
				chr(196).chr(180) => 'J', chr(196).chr(181) => 'j',
				chr(196).chr(182) => 'K', chr(196).chr(183) => 'k',
				chr(196).chr(184) => 'k', chr(196).chr(185) => 'L',
				chr(196).chr(186) => 'l', chr(196).chr(187) => 'L',
				chr(196).chr(188) => 'l', chr(196).chr(189) => 'L',
				chr(196).chr(190) => 'l', chr(196).chr(191) => 'L',
				chr(197).chr(128) => 'l', chr(197).chr(129) => 'L',
				chr(197).chr(130) => 'l', chr(197).chr(131) => 'N',
				chr(197).chr(132) => 'n', chr(197).chr(133) => 'N',
				chr(197).chr(134) => 'n', chr(197).chr(135) => 'N',
				chr(197).chr(136) => 'n', chr(197).chr(137) => 'N',
				chr(197).chr(138) => 'n', chr(197).chr(139) => 'N',
				chr(197).chr(140) => 'O', chr(197).chr(141) => 'o',
				chr(197).chr(142) => 'O', chr(197).chr(143) => 'o',
				chr(197).chr(144) => 'O', chr(197).chr(145) => 'o',
				chr(197).chr(146) => 'OE',chr(197).chr(147) => 'oe',
				chr(197).chr(148) => 'R',chr(197).chr(149) => 'r',
				chr(197).chr(150) => 'R',chr(197).chr(151) => 'r',
				chr(197).chr(152) => 'R',chr(197).chr(153) => 'r',
				chr(197).chr(154) => 'S',chr(197).chr(155) => 's',
				chr(197).chr(156) => 'S',chr(197).chr(157) => 's',
				chr(197).chr(158) => 'S',chr(197).chr(159) => 's',
				chr(197).chr(160) => 'S', chr(197).chr(161) => 's',
				chr(197).chr(162) => 'T', chr(197).chr(163) => 't',
				chr(197).chr(164) => 'T', chr(197).chr(165) => 't',
				chr(197).chr(166) => 'T', chr(197).chr(167) => 't',
				chr(197).chr(168) => 'U', chr(197).chr(169) => 'u',
				chr(197).chr(170) => 'U', chr(197).chr(171) => 'u',
				chr(197).chr(172) => 'U', chr(197).chr(173) => 'u',
				chr(197).chr(174) => 'U', chr(197).chr(175) => 'u',
				chr(197).chr(176) => 'U', chr(197).chr(177) => 'u',
				chr(197).chr(178) => 'U', chr(197).chr(179) => 'u',
				chr(197).chr(180) => 'W', chr(197).chr(181) => 'w',
				chr(197).chr(182) => 'Y', chr(197).chr(183) => 'y',
				chr(197).chr(184) => 'Y', chr(197).chr(185) => 'Z',
				chr(197).chr(186) => 'z', chr(197).chr(187) => 'Z',
				chr(197).chr(188) => 'z', chr(197).chr(189) => 'Z',
				chr(197).chr(190) => 'z', chr(197).chr(191) => 's',
				// Euro Sign
				chr(226).chr(130).chr(172) => 'E',
				// GBP (Pound) Sign
				chr(194).chr(163) => '');
		$string = strtr($string, $chars);
	} else {
		// Assume ISO-8859-1 if not UTF-8
		$chars['in'] = chr(128).chr(131).chr(138).chr(142).chr(154).chr(158)
		.chr(159).chr(162).chr(165).chr(181).chr(192).chr(193).chr(194)
		.chr(195).chr(196).chr(197).chr(199).chr(200).chr(201).chr(202)
		.chr(203).chr(204).chr(205).chr(206).chr(207).chr(209).chr(210)
		.chr(211).chr(212).chr(213).chr(214).chr(216).chr(217).chr(218)
		.chr(219).chr(220).chr(221).chr(224).chr(225).chr(226).chr(227)
		.chr(228).chr(229).chr(231).chr(232).chr(233).chr(234).chr(235)
		.chr(236).chr(237).chr(238).chr(239).chr(241).chr(242).chr(243)
		.chr(244).chr(245).chr(246).chr(248).chr(249).chr(250).chr(251)
		.chr(252).chr(253).chr(255);
		$chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";
		$string = strtr($string, $chars['in'], $chars['out']);
		$double_chars['in'] = array(chr(140), chr(156), chr(198), chr(208), chr(222), chr(223), chr(230), chr(240), chr(254));
		$double_chars['out'] = array('OE', 'oe', 'AE', 'DH', 'TH', 'ss', 'ae', 'dh', 'th');
		$string = str_replace($double_chars['in'], $double_chars['out'], $string);
	}
	return $string;
}
function seems_utf8($Str) { # by bmorel at ssi dot fr
	$length = strlen($Str);
	for ($i = 0; $i < $length; $i++) {
		if (ord($Str[$i]) < 0x80) continue; # 0bbbbbbb
		elseif ((ord($Str[$i]) & 0xE0) == 0xC0) $n = 1; # 110bbbbb
		elseif ((ord($Str[$i]) & 0xF0) == 0xE0) $n = 2; # 1110bbbb
		elseif ((ord($Str[$i]) & 0xF8) == 0xF0) $n = 3; # 11110bbb
		elseif ((ord($Str[$i]) & 0xFC) == 0xF8) $n = 4; # 111110bb
		elseif ((ord($Str[$i]) & 0xFE) == 0xFC) $n = 5; # 1111110b
		else return false; # Does not match any model
		for ($j = 0; $j < $n; $j++) { # n bytes matching 10bbbbbb follow ?
			if ((++$i == $length) || ((ord($Str[$i]) & 0xC0) != 0x80))
				return false;
		}
	}
	return true;
}
?>
<script>window.scrollTo(0,10000);</script>
</body>
</html>
