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
	if (empty ( $_SESSION ["dir_tmp"] )) {
		echo "<div class='alert alert-danger' role='alert'>Pasta n&atilde;o encontrada</div>";
		exit ();
	}
	echo "<div class='alert alert-success' role='alert'>Carregando o arquivo...</div>";

	ob_flush ();flush (); sleep ( 2 );

	if (! file_exists ( $_SESSION ["dir_tmp"] ) || empty($_SESSION ["dir_tmp"])) {
		echo "<div class='alert alert-danger' role='alert'>Pasta tempor&aacute;ria n&atilde;o  existe no servidor</div>";
		exit ();
	}
	// verifica nomes
	verificaNome ( $_FILES ['i3GEOuploadshp'] ['name'] );
	verificaNome ( $_FILES ['i3GEOuploadshx'] ['name'] );
	verificaNome ( $_FILES ['i3GEOuploaddbf'] ['name'] );
	// remove acentos
	$nomePrefixo = "shp2pg".(rand (9000,10000)) * -1;
	// sobe arquivo
	$Arquivo = $_FILES ['i3GEOuploadshp'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shp" );
	if ($status != 1) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo SHP. Pode ser uma limita&ccedil;&atilde;o quanto ao tamanho do arquivo ou permiss&atilde;o de escrita na pasta indicada.</div>";
		exit ();
	}
	$Arquivo = $_FILES ['i3GEOuploadshx'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shx" );
	if ($status != 1) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo SHX</div>";
		exit ();
	}
	$Arquivo = $_FILES ['i3GEOuploaddbf'] ['tmp_name'];
	$status = move_uploaded_file ( $Arquivo, $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".dbf" );
	if ($status != 1) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu um erro no envio do arquivo DBF</div>";
		exit ();
	}
	if (! file_exists ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shp" )) {
		echo "<div class='alert alert-danger' role='alert'>Ocorreu algum problema no envio do arquivo</div>";
		exit ();
	}
	$checkphp = \admin\php\funcoesAdmin\fileContemString ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shx", "<?php" );
	if ($checkphp == true) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo shx invalido</div>";
		unlink ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shp" );
		unlink ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".dbf" );
		unlink ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shx" );
		exit ();
	}
	$checkphp = \admin\php\funcoesAdmin\fileContemString ( $dirmap . "/" . $nomePrefixo . ".dbf", "<?php" );
	if ($checkphp == true) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo dbf invalido</div>";
		unlink ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shp" );
		unlink ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".dbf" );
		unlink ( $_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shx" );
		exit ();
	}
	echo "<div class='alert alert-success' role='alert'>Arquivo enviado.</div>";
	//
	//gera o script para inclusao no banco
	//
	$shapefileObj = ms_newShapefileObj($_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shp",-1);
	$numshapes = $shapefileObj->numshapes;

	echo "<div class='alert alert-success' role='alert'>Numshapes existentes no SHP: " . $numshapes . "</div>";
	ob_flush ();flush (); sleep ( 2 );

	$mapObj = ms_newMapObjFromString("MAP END");
	$layer = ms_newLayerObj($mapObj);
	$layer->set("data",$_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".shp");
	if(file_exists($_SESSION ["dir_tmp"] . "/" . $nomePrefixo . ".prj")){
		//$layer->setprojection("AUTO");
	}
	$layer->open();
	$colunasTemp = $layer->getItems();
	$colunas = array();
	foreach($colunasTemp as $c){
		if(!is_numeric($c)){
			$colunas[] = $c;
		}
	}

	echo "<div class='alert alert-success' role='alert'>Tipo do SHP: " . $shapefileObj->type . "</div>";
	echo "<div class='alert alert-success' role='alert'>Colunas: <p><pre>";
	print_r( $colunas );
	echo "</pre></p></div>";

	ob_flush(); flush(); sleep(2);

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
	echo "<div class='alert alert-success' role='alert'>Tipos das colunas: <p><pre>";
	print_r( $tipoColuna );
	echo "</pre></p></div>";

	//verifica autorizacao para o esquema
	if(empty($_POST["i3GEOuploadEsquemaDestino"]) || !in_array($_POST["i3GEOuploadEsquemaDestino"],$_SESSION["i3geoUploadDataWL"]["postgis"]["esquemas"])){
		echo "<div class='alert alert-danger' role='alert'>Esquema n&atilde;o permitido</div>";
		exit;
	}

	$conexao = $_SESSION["i3geoUploadDataWL"]["postgis"]["conexao"];
	try {
		$dbh = new PDO('pgsql:dbname='.$conexao["dbname"].';user='.$conexao["user"].';password='.$conexao["password"].';host='.$conexao["host"].';port='.$conexao["port"]);
	} catch (PDOException $e) {
		echo "<div class='alert alert-danger' role='alert'>Falha ao conectar com o banco</div>";
		exit;
	}
	if(empty($_POST["i3GEOuploadNomeTabela"]) || empty($_POST["i3GEOuploadEsquemaDestino"])){
		exit;
	}
	//gera o script para criar a tabela
	//verifica se a tabela ja existe
	$sql = "SELECT table_name FROM information_schema.tables where table_schema = '".$_POST["i3GEOuploadEsquemaDestino"]."' AND table_name = '".$_POST["i3GEOuploadNomeTabela"]."'";
	$res = $dbh->query($sql,PDO::FETCH_ASSOC);
	if(count($res->fetchAll())>0){
		$tabelaExiste = true;
	}
	else{
		$tabelaExiste = false;
	}
	//encoding do banco de dados
	$sql = "SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname = '".$conexao["dbname"]."'";
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

	if($tabelaExiste == false && $_POST["i3GEOuploadTipoOperacao"] == "criar"){
		$sql = "CREATE TABLE ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"]."(the_geom geometry";
		foreach($colunas as $coluna){
			$sql .= ",".\admin\php\funcoesAdmin\removeAcentos(strtolower($coluna))." ".$tipoColuna[$coluna];
		}
		$sql .= ")WITH(OIDS=FALSE)";
		$sqltabela[] = $sql;
		$sqltabela[] = "ALTER TABLE ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"]." OWNER TO ".$conexao["user"];
		$sqltabela[] = "CREATE INDEX ".$_POST["i3GEOuploadNomeTabela"]."_indx_thegeom ON ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"]." USING gist (the_geom )";
		if(!empty($_POST["i3GEOuploadComentario"])){
			$enc = mb_detect_encoding($texto);
			$_POST["i3GEOuploadComentario"] = mb_convert_encoding($_POST["i3GEOuploadComentario"],$encodingdb,$enc);
			$sqltabela[] = "COMMENT ON TABLE ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"]." IS '".$_POST["i3GEOuploadComentario"]."'";
		}
		echo "<div class='alert alert-info' role='alert'>Sql tabela: <p><pre>";
		print_r( $sqltabela );
		echo "</pre></p></div>";
	}
	if($tabelaExiste == true && $_POST["i3GEOuploadTipoOperacao"] == "criar"){
		echo "<div class='alert alert-danger' role='alert'>A tabela existe. N&atilde;o pode ser criada.</div>";
		exit;
	}
	//se a tabela existe e e para atualizar os registros
	if($tabelaExiste == true && $_POST["i3GEOuploadTipoOperacao"] == "atualizar"){
		$sqltabela[] = "delete from ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"];
	}

	//gera o script para inserir os dados
	$linhas = array();
	$insert = "INSERT INTO ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"]." (".strtolower(\admin\php\funcoesAdmin\removeAcentos(implode(",",$colunas))).",the_geom)";
	echo "<div class='alert alert-info' role='alert'>Preparando inclus&atilde;o de dados...</div>";
	ob_flush();
	flush();
	sleep(1);

	$escapar = "'";
	//
	//caso o usuario tenha definido a projecao de saida, os dados devem ser projetados
	//
	$mapObj->setProjection("init=epsg:".$_POST["i3GEOuploadSridDestino"]);
	$layer->setProjection("init=epsg:".$_POST["i3GEOuploadSridOrigem"]);
	$projInObj = $layer->getProjection();
	$projOutObj = $mapObj->getProjection();
	for ($i=0; $i<$numshapes;$i++){
		$s = $layer->getShape(new resultObj($i));
		//projeta o shape
		if($_POST["i3GEOuploadSridDestino"] != $_POST["i3GEOuploadSridOrigem"]){
			$s->project(ms_newProjectionObj($projInObj), ms_newProjectionObj($projOutObj));
		}
		$vs = array();
		foreach($colunas as $coluna){
			$escape = "";
			if($tipoColuna[$coluna] == "varchar"){
				$texto = $s->getValue($layer,$coluna);
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
		if($_POST["i3GEOuploadSridDestino"] == $_POST["i3GEOuploadSridOrigem"]){
			$vs[] = "st_geomfromtext('".$s->toWkt()."','".$_POST["i3GEOuploadSridDestino"]."')";
		}
		else{
			$vs[] = "st_transform(st_geomfromtext('".$s->toWkt()."','".$_POST["i3GEOuploadSridDestino"]."'),'".$_POST["i3GEOuploadSridDestino"]."')";
		}
		$str = implode(",",$vs);
		$str = str_replace("nulo",'null',$str);
		$linhas[] = $insert."VALUES(".$escape."".$str.")";
	}
	$layer->close();

	if(!in_array($_POST["i3GEOuploadColunaGid"],$colunas) && $_POST["i3GEOuploadTipoOperacao"] == "criar"){
		$linhas[] = "alter table ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"]." add " . $_POST["i3GEOuploadColunaGid"] . " serial CONSTRAINT ".$_POST["i3GEOuploadNomeTabela"]."_gid_pkey PRIMARY KEY";
	}

	if($_POST["i3GEOuploadApenasScript"] == "on"){
		echo "<div class='alert alert-success' role='alert'>Sql de inser&ccedil;&atilde;o de dados: <p><pre>";
		foreach($linhas as $linha){
			echo( $linha )."\n";
		}
		echo "</pre></p></div>";

	} else {
		//aqui o sql e executado verdadeiramente
		//antes e feito um backup da tabela


		//$sqltabela sera vazio se a tabela ja existir
		foreach($sqltabela as $linha){
			try {
				$dbh->query($linha);
			} catch (PDOException $e) {
				echo "<div class='alert alert-danger' role='alert'>N&atilde;o foi poss&iacute;vel criar a tabela<p><pre>";
				exit;
			}
		}
		//para testar com acentuacao diferente
		$conexao = $_SESSION["i3geoUploadDataWL"]["postgis"]["conexao"];
		$bdcon = pg_connect('dbname='.$conexao["dbname"].' user='.$conexao["user"].' password='.$conexao["password"].' host='.$conexao["host"].' port='.$conexao["port"]."options='-c client_encoding=LATIN1'");
		echo "<div class='alert alert-success' role='alert'>Sql de inser&ccedil;&atilde;o de dados com erros ou modificados: <p><pre>";

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
								echo "<p><span style=color:red >Erro em: </span>$linha</p>";
							}
						}
						else{
							echo "<p><span style=color:red >Acentos removidos: $linha</span></p>";
						}
					}
				}
			} catch (PDOException $e) {
				echo "<div class='alert alert-danger' role='alert'>N&atilde;o foi poss&iacute;vel executar os SQLs<p><pre>";
			}
		}
		echo "</pre></p></div>";

		$sql = "select * from ".$_POST["i3GEOuploadEsquemaDestino"].".".$_POST["i3GEOuploadNomeTabela"];
		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = $q->fetchAll();

		echo "<div class='alert alert-info' role='alert'>";
		echo "<p>Registros existentes no SHP: $numshapes</p>";

		echo "<p>Registros na tabela final: ". count($r) . "</p>";
		echo "<p>Diferen&ccedil;as podem ocorrer em fun&ccedil;&atilde;o de caracteres acentuados n&atilde;o suportados pelo banco de dados</p>";
		echo "<p><b>Feito!!!</p>";
		echo "</div>";
	}
	//
	ob_flush ();flush (); sleep ( 2 );
	$nomeMapfile = $_SESSION ["locaplic"] . "/temas/" . $_POST["i3GEOuploadNomeTabela"] . ".map";
	if ($_POST["i3GEOuploadCriaMapfile"] == "on" && file_exists ( $nomeMapfile )) {
		echo "<div class='alert alert-danger' role='alert'>Arquivo mapfile com o nome " . $_POST["i3GEOuploadNomeTabela"] . "j&aacute; existe.</div>";
		$_POST["i3GEOuploadCriaMapfile"] = "";
	}
	if ($_POST["i3GEOuploadCriaMapfile"] == "on" && $_POST["i3GEOuploadAliasConexao"] != "") {
		$_POST["i3GEOuploadAliasConexao"] = str_replace(" ","",$_POST["i3GEOuploadAliasConexao"]);
		if(!in_array($_POST["i3GEOuploadAliasConexao"],array_keys($_SESSION ["postgis_mapa"]))){
			echo "<div class='alert alert-danger' role='alert'>Alias para a conex&atilde;o com o banco n&atilde;o definida</div>";
		} else {
			echo "<div class='alert alert-info' role='alert'>Criando mapfile...</div>";
			ob_flush ();flush (); sleep ( 2 );

			if ($shapefileObj->type == 1) {
				$tipoLayer = MS_LAYER_POINT;
			}
			if ($shapefileObj->type == 3) {
				$tipoLayer = MS_LAYER_LINE;
			}
			if ($shapefileObj->type == 5) {
				$tipoLayer = MS_LAYER_POLYGON;
			}
			include ($_SESSION ["locaplic"] . "/admin/catalogo/mapfile/funcoes.php");
			$cria = \admin\catalogo\mapfile\adicionar ( $_SESSION ["locaplic"], $_POST["i3GEOuploadNomeTabela"], "", $_POST["i3GEOuploadNomeTabela"], "", "", $_POST["i3GEOuploadNomeTabela"], "", $_POST["i3GEOuploadNomeTabela"], $_POST["i3GEOuploadNomeTabela"], true, $dbhw );
			if ($cria == true && file_exists ( $_SESSION ["locaplic"] . "/temas/" . $_POST["i3GEOuploadNomeTabela"] . ".map" )) {
				$mapa = ms_newMapObj ( $_SESSION ["locaplic"] . "/temas/" . $_POST["i3GEOuploadNomeTabela"] . ".map" );
				$layer = $mapa->getLayerByName ( $_POST["i3GEOuploadNomeTabela"] );
				$layer->set ( "data", "the_geom from (select * from " . $_POST["i3GEOuploadEsquemaDestino"] . "." . $_POST["i3GEOuploadNomeTabela"] . ") as foo using unique " . $_POST["i3GEOuploadColunaGid"] . " using srid=" . $_POST["i3GEOuploadSridDestino"] );
				$layer->set("connection",$_POST["i3GEOuploadAliasConexao"]);
				$layer->setconnectiontype(6);
				$layer->set ( "type", $tipoLayer );
				if($shapefileObj->type == 1){
					$classe = $layer->getclass(0);
					$estilo = $classe->getstyle(0);
					$estilo->set("symbolname","ponto");
				}
				$mapa->save ( $_SESSION ["locaplic"] . "/temas/" . $_POST["i3GEOuploadNomeTabela"] . ".map" );
				\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $_SESSION ["locaplic"] . "/temas/" . $_POST["i3GEOuploadNomeTabela"] . ".map" );
				echo "<div class='alert alert-success' role='alert'>Mapfile " . $_POST["i3GEOuploadNomeTabela"] ." criado!!!</div>";
			} else {
				echo "<div class='alert alert-danger' role='alert'>Mapfile n&atilde;o pode ser criado criado!!!</div>";
			}
		}
	}
	echo "<div class='alert alert-info' role='alert'>Pode fechar essa janela.</div>";
} else {
	echo "<div class='alert alert-danger' role='alert'>Erro ao enviar o arquivo. Talvez o tamanho do arquivo seja maior do que o permitido.</div>";
}
if (file_exists ( $_SESSION ["locaplic"] . "/temas/" . $_POST["i3GEOuploadNomeTabela"] . ".map" )) {
	echo "<div class='alert alert-info' role='alert'><a href='#' onclick=\"abreEditor('" . $_POST["i3GEOuploadNomeTabela"] . "')\" class='alert-link'>Editar mapfile</a></div>";
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
