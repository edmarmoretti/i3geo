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
if($_POST["srid"] == ""){
	echo "SRID n&atilde;o definido";
	exit;
}
if ($_FILES['i3GEOuploadshp']['name'] == ""){
	echo "Arquivo n&atilde;o definido";
	exit;
}
if (isset($_FILES['i3GEOuploadshp']['name'])){
	require_once ("../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
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
		//abaixo gid e forçado a entrar
		if(!is_numeric($c) && strtolower($c) != "gid"){
			$colunas[] = $c;
		}
	}
	echo "<br>Numshapes: ". $numshapes;
	$tipo = $shapefileObj->type;
	echo "<br>Tipo: ". $tipo;
	echo "<br>Colunas: ";
	var_dump($colunas);
	$sqinsert = array();
	//verifica o tipo de coluna
	$tipoColuna = array();
	if($numshapes < 10){
		$testar = $numshapes;
	}
	else{
		$testar = 10;
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
		$sql = "CREATE TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]."(gid integer, the_geom geometry";
		foreach($colunas as $coluna){
			$sql .= ",".strtolower($coluna)." ".$tipoColuna[$coluna];
		}
		$sql .= ")WITH(OIDS=FALSE)";
		$sqltabela[] = $sql;
		$sqltabela[] = "ALTER TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." OWNER TO ".$conexao["usuario"];
		$sqltabela[] = "CREATE INDEX ".$_POST["tabelaDestino"]."_indx_thegeom ON ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." USING gist (the_geom )";
		echo "<br>Sql tabela: <pre>";
		var_dump($sqltabela);
		echo "</pre>";
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
	$insert = "INSERT INTO ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]."( gid,".strtolower(implode(",",$colunas)).",the_geom)";
	for ($i=0; $i<$numshapes;$i++){
		$s = $layer->getShape(new resultObj($i));
		$vs = array();
		$vs[] = $i;
		foreach($colunas as $coluna){
			if($tipoColuna[$coluna] == "varchar"){
				$texto = $s->getValue($layer,$coluna);
				//echo mb_detect_encoding($texto);
				$vs[] = "'".mb_convert_encoding($texto,$encodingdb,mb_detect_encoding($texto))."'";
			}
			else{
				$vs[] = $s->getValue($layer,$coluna);
			}
		}
		$vs[] = "st_geomfromtext('".$s->toWkt()."','".$_POST["srid"]."')";
		$linhas[] = $insert."VALUES(".implode(",",$vs).")";
	}
	$layer->close();
	foreach($sqltabela as $linha){
		try {
			$dbh->query($linha);
		} catch (PDOException $e) {
			echo 'Erro: ' . $e->getMessage();
		}
	}
	foreach($linhas as $linha){
		try {
			$dbh->query($linha);
		} catch (PDOException $e) {
			echo 'Erro: ' . $e->getMessage();
		}
	}
	echo "<br>Feito!!!<br>Fa&ccedil;a o reload da p&aacute;gina";
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
</body>
</html>
