<?php
/*
 * Faz o upload de shapefile e insere no banco de dados
 */
include_once("admin.php");
include_once("login.php");
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
	if($numshapes > 500){
		$testar = 500;
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
			$sql .= ",".strtolower($coluna)." ".$tipoColuna[$coluna];
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
			if($tipoColuna[$coluna] == "varchar"){
				$texto = $s->getValue($layer,$coluna);
				//echo $i." - ".mb_detect_encoding($texto)."<br>";
				//$texto = str_replace("'","",$texto);
				$enc = mb_detect_encoding($texto);
				$texto = addcslashes($texto,$escapar);
				if($enc != ""){
					$texto = "'".mb_convert_encoding($texto,$encodingdb,$enc)."'";
				}
				else{
					$texto = "'".$texto."'";
				}
				if($texto == "''"){
					$texto = 'null';
				}
				$vs[] = $texto;
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
		$linhas[] = $insert."VALUES(".$str.")";
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
	foreach($linhas as $linha){
		try {
			$res = $dbh->query($linha);
			if($res == false){
				echo "<br><br><span style=color:red >Erro em: </span>".$linha;
			}
		} catch (PDOException $e) {
			echo 'Erro: ' . $e->getMessage();
		}
	}
	echo "<br>Registros existentes no SHP: ". $numshapes;
	$sql = "select * from ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"];
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	$r = $q->fetchAll();
	echo "<br>Registros na tabela final: ". count($r);
	echo "<br>Diferen&ccedil;as podem ocorrer em fun&ccedil;&atilde;o de caracteres acentuados n&atilde;o suportados pelo banco de dados";
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
?>
<script>window.scrollTo(0,10000);</script>
</body>
</html>
