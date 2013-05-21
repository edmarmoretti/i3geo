<?php
/*
 * Faz o upload de csv e insere no banco de dados criando uma nova tabela
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
if ($_FILES['i3GEOuploadcsv']['name'] == ""){
	echo "Arquivo n&atilde;o definido";
	exit;
}
if (isset($_FILES['i3GEOuploadcsv']['name'])){
	require_once ("../../ms_configura.php");
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$arqcsv = $_FILES['i3GEOuploadcsv']['tmp_name'];
	$nomePrefixo = str_replace(" ","_",removeAcentos($_FILES['i3GEOuploadcsv']['name']));
	$nomePrefixo = $nomePrefixo."_".(nomeRandomico(4));

	$Arquivo = $_FILES['i3GEOuploadcsv']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dir_tmp."/".$nomePrefixo);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo";exit;}


	if(!file_exists($dir_tmp."/".$nomePrefixo))
	{echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ".$dir_tmp."/".$nomePrefixo;paraAguarde();exit;}
	$arqcsv = $dir_tmp."/".$nomePrefixo;

	//pega os parametros de conexao
	include("classe_metaestat.php");
	$m = new Metaestat();
	$conexao = $m->listaConexao($_POST["i3GEOuploadcodigoconexao"],true);
	//pega a lista de colunas e identifica o separador utilizado
		$handle = fopen ($arqcsv, "r");
		$cabecalho = fgets($handle);
		$buffer = str_replace('"','',$cabecalho);
		$buffer = str_replace("'",'',$buffer);
		$buffer = str_replace("\n",'',$buffer);
		$buffer = str_replace("\r",'',$buffer);
		$colunas = explode(";",$buffer);
		$separador = ";";
		if(count($colunas) == 1){
			$colunas = explode(",",$buffer);
			$separador = ",";
		}
		//var_dump($colunas);
		$colunas = implode(",",$colunas);
		fclose ($handle);
		
		
	//le o csv em um array
	$handle = fopen ($arqcsv, "r");
	$linhas = array();
		while (!feof($handle)) {
			$buffer = fgets($handle);
			if($buffer != $cabecalho){
				$buffer = str_replace('"','',$buffer);
				$buffer = str_replace("'",'',$buffer);
				$buffer = str_replace("\n",'',$buffer);
				$buffer = str_replace("\r",'',$buffer);
				$linhas[] = explode($separador,$buffer);
			}
		}	
	fclose ($handle);
	//decobre o tipo de coluna
	$ncolunas = count($colunas);
	for ($j=0; $j<$ncolunas;$j++){
		$tipo = "numeric";
		for ($i=0; $i<$testar;$i++){
			$s = $linhas[$i];
			$v = $s[$j];
			if(!is_numeric($v)){
				$tipo = "varchar";
			}
		}
		$tipoColuna[$colunas[$j]] = $tipo;
	}
	echo "<br>Tipos das colunas: <pre>";
	var_dump($tipoColuna);
	echo "</pre>";
	//gera o script para criar a tabela
	$sqltabela = array();
	$sql = "CREATE TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]."(";
	foreach($colunas as $coluna){
		$sql .= ",".strtolower($coluna)." ".$tipoColuna[$coluna];
	}
	$sql .= ")WITH(OIDS=FALSE)";
	$sqltabela[] = $sql;
	$sqltabela[] = "ALTER TABLE ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]." OWNER TO ".$conexao["usuario"];
	echo "<br>Sql tabela: <pre>";
	var_dump($sqltabela);
	echo "</pre>";
	//gera o script para inserir os dados
	$linhasql = array();
	$insert = "INSERT INTO ".$_POST["i3GEOuploadesquema"].".".$_POST["tabelaDestino"]."(".strtolower(implode(",",$colunas)).")";
	$nlinhas = count($linhas);
	for ($i=0; $i<$nlinhas;$i++){
		$s = $linhas[$i];
		$vs = array();
		$vs[] = $i;
		for ($j=0; $j<$ncolunas;$j++){
			if($tipoColuna[$colunas[$j]] == "varchar"){
				$vs[] = "'".$s[$j]."'";
			}
			else{
				$vs[] = $s[$j];
			}
		}
		$linhasql[] = $insert."VALUES(".implode(",",$vs).")";
	}
	try {
		$dbh = new PDO('pgsql:dbname='.$conexao["bancodedados"].';user='.$conexao["usuario"].';password='.$conexao["senha"].';host='.$conexao["host"].';port='.$conexao["porta"]);
	} catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
	}
	
	foreach($sqltabela as $linha){
		try {
			$dbh->query($linha);
		} catch (PDOException $e) {
			echo 'Erro: ' . $e->getMessage();
		}
	}
	foreach($linhasql as $linha){
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

?>
</body>
</html>
