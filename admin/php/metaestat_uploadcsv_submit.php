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
if (ob_get_level() == 0) ob_start();

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color: white; text-align: left;">
	<p>
		<?php
		if($_POST["tabelaDestinocsv"] == ""){
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
			ob_flush();
			flush();
			sleep(1);
			$arqcsv = $_FILES['i3GEOuploadcsv']['tmp_name'];
			$nomePrefixo = str_replace(" ","_",removeAcentos($_FILES['i3GEOuploadcsv']['name']));
			$nomePrefixo = $nomePrefixo."_".(nomeRandomico(4));

			$Arquivo = $_FILES['i3GEOuploadcsv']['tmp_name'];
			$status =  move_uploaded_file($Arquivo,$dir_tmp."/".$nomePrefixo);
			if($status != 1){
				echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo";exit;
			}
			if(!file_exists($dir_tmp."/".$nomePrefixo)){
				echo "<p class='paragrafo' >Ocorreu algum problema no envio do arquivo ".$dir_tmp."/".$nomePrefixo;paraAguarde();exit;
			}
			$arqcsv = $dir_tmp."/".$nomePrefixo;
			//pega os parametros de conexao
			include("classe_metaestat.php");
			$m = new Metaestat();
			$conexao = $m->listaConexao($_POST["i3GEOuploadcsvcodigoconexao"],true);
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
			fclose ($handle);
			//le o csv em um array
			$handle = fopen ($arqcsv, "r");
			$linhas = array();

			$ncolunas = count($colunas);
			while (!feof($handle)) {
				$buffer = fgets($handle);
				if($buffer != $cabecalho){
					$buffer = str_replace('"','',$buffer);
					$buffer = str_replace("'",'',$buffer);
					$buffer = str_replace("\n",'',$buffer);
					$buffer = str_replace("\r",'',$buffer);
					$temp = explode($separador,$buffer);
					if(count($temp) == $ncolunas)
						$linhas[] = $temp;
				}
			}
			fclose ($handle);
			//decobre o tipo de coluna
			$testar = 10;
			if(count($linhas) < $testar){
				$testar = count($linhas);
			}
			$tipoColuna = array();
			for ($j=0; $j<$ncolunas;$j++){
				$tipo = "numeric";
				for ($i=0; $i<$testar;$i++){
					$s = $linhas[$i];
					$v = $s[$j];
					if(!empty($v) && !is_numeric($v)){
						$tipo = "varchar";
					}
				}
				$tipoColuna[$colunas[$j]] = $tipo;
			}
			echo "<br>Tipos das colunas: <pre>";
			var_dump($tipoColuna);
			echo "</pre>";
			ob_flush();
			flush();
			sleep(1);
			//gera o script para criar a tabela
			$sqltabela = array();
			$sql = "CREATE TABLE ".$_POST["i3GEOuploadcsvesquema"].".".$_POST["tabelaDestinocsv"]."(";
			$temp = array();
			foreach($colunas as $coluna){
				$temp[] = strtolower($coluna)." ".$tipoColuna[$coluna];
			}
			$sql .= implode(",",$temp).") WITH(OIDS=FALSE)";
			$sqltabela[] = $sql;
			$sqltabela[] = "ALTER TABLE ".$_POST["i3GEOuploadcsvesquema"].".".$_POST["tabelaDestinocsv"]." OWNER TO ".$conexao["usuario"];
			echo "<br>Sql tabela: <pre>";
			var_dump($sqltabela);
			echo "</pre>";
			ob_flush();
			flush();
			sleep(1);
			//gera o script para inserir os dados
			echo "<br>Preparando inclus&atilde;o de dados";
			ob_flush();
			flush();
			sleep(1);
			$linhasql = array();
			$insert = "INSERT INTO ".$_POST["i3GEOuploadcsvesquema"].".".$_POST["tabelaDestinocsv"]."(".strtolower(implode(",",$colunas)).")";
			$nlinhas = count($linhas);
			for ($i=0; $i<$nlinhas;$i++){
				$s = $linhas[$i];
				$vs = array();
				for ($j=0; $j<$ncolunas;$j++){
					if($tipoColuna[$colunas[$j]] == "varchar"){
						$vs[] = "'".$s[$j]."'";
					}
					else{
						if($s[$j] == ""){
							$vs[] = 'null';
						}
						else{
							$vs[] = $s[$j];
						}
					}
				}
				$linhasql[] = $insert."VALUES(".implode(",",$vs).")";
			}
			//echo "<pre>";
			//var_dump($linhasql);exit;
			try {
				$dbh = new PDO('pgsql:dbname='.$conexao["bancodedados"].';user='.$conexao["usuario"].';password='.$conexao["senha"].';host='.$conexao["host"].';port='.$conexao["porta"]);
			} catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
	}
	echo "<br>Incluindo dados";
	echo "<script>window.scrollTo(0,10000);</script>";
	ob_flush();
	flush();
	sleep(1);
	if($_POST["incluiserialcsv"] == "on"){
		$linhasql[] = "alter table ".$_POST["i3GEOuploadcsvesquema"].".".$_POST["tabelaDestinocsv"]." add gid serial CONSTRAINT gid_pkey PRIMARY KEY";
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
	echo "<b><br>Feito!!!<br>Fa&ccedil;a o reload da p&aacute;gina";
		}
		else{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</p>";
}

?>
<script>window.scrollTo(0,10000);</script>
</body>
</html>
