<?php
/*
Title: classe_metaestat.php

Implementa a consulta e manuten&ccedil;&atilde;o do banco de metadados estat&iacute;sticos

Veja o MER em i3geo/documentacao/diagramas/metaestat.erm

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2012 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/classe_metaestat.php
*/
/*
Classe: Metaestat
*/
class Metaestat{
	protected $esquemaadmin;
	protected $dbh;
	protected $dbhw;
	protected $convUTF;
	/*
	Function: __construct

	Cria um objeto Metaestat
	*/
	function __construct(){
		error_reporting(E_ALL);
		include(__DIR__."/conexao.php");
		if(!isset($convUTF)){
			$convUTF = true;
		}
		$this->convUTF = $convUTF;
		$this->dbh = $dbh;
		$this->dbhw = $dbhw;
		$this->esquemaadmin = "";
		if(!empty($esquemaadmin)){
			$this->esquemaadmin = $esquemaadmin.".";
		}
	}
	function __destruct(){
		$this->fechaConexao;
	}
	function fechaConexao(){
		$this->dbh = null;
		$this->dbhw = null;
	}
	//aceita string ou array
	function converteTextoArray($texto){
		if(empty($texto) || strtoupper($texto) == "NULL"){
			return "";
		}
		$chaves = array_keys($texto);
		if($chaves[0] != "0"){
			foreach($chaves as $chave){
				$texto[$chave] = $this->converteTexto($texto[$chave]);
			}
		}
		else{
			$n = count($texto);
			for($i=0;$i<$n;$i++){
				$chaves = array_keys($texto[$i]);
				foreach($chaves as $chave){
					$texto[$i][$chave] = $this->converteTexto($texto[$i][$chave]);
				}
			}
		}
		return $texto;
	}
	function converteTexto($texto){
		if(empty($texto) || strtoupper($texto) == "NULL"){
			return "";
		}
		if($this->convUTF == true){
			$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"UTF-8");
		}
		else{
			$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"ISO-8859-1");
		}
		return $texto;
	}
	/*
	Function: execSQL

	Executa um SQL no banco

	Parametros:

	$sql {string}

	$id {string} - se for vazio retorna todos os registros, caso contrario, retorna apenas o primeiro

	Return:

	{array}
	*/
	function execSQL($sql,$id=""){
		try	{
			$q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
		if($q){
			$r = $q->fetchAll();
			if($r){
				if($id != ""){
					if(count($r) == 1){
						$r = $r[0];
					}
					else{
						$r = false;
					}
				}
				if($r != false)
					$r = $this->converteTextoArray($r);

				return $r;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
	function insertId($tabela,$colunatemp,$colunaid){
		$idtemp = (rand (9000,10000)) * -1;
		//echo "INSERT INTO ".$this->esquemaadmin.$tabela." ($colunatemp) VALUES ('$idtemp')";exit;
		$this->dbhw->query("INSERT INTO ".$this->esquemaadmin.$tabela." ($colunatemp) VALUES ('$idtemp')");
		$id = $this->dbh->query("SELECT $colunaid FROM ".$this->esquemaadmin.$tabela." WHERE $colunatemp = '$idtemp'");
		$id = $id->fetchAll();
		$id = $id[0][$colunaid];
		$this->dbhw->query("UPDATE ".$this->esquemaadmin.$tabela." SET $colunatemp = '' WHERE $colunaid = $id AND $colunatemp = '$idtemp'");
		return $id;
	}
	function excluirRegistro($tabela,$coluna,$id)
	{
		try	{
			$this->dbhw->query("DELETE from ".$this->esquemaadmin.$tabela." WHERE $coluna = $id");
			return "ok";
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/*
	Function: listaConexao

	Lista as conexoes cadastradas ou uma unica conexao

	Parametros:

	$id {string} - opcional

	$senha {boolean} - mostra ou nao a senha - opcional
	*/
	function listaConexao($id_conexao="",$senha=false){
		if($senha){
			$colunas = "codigo_estat_conexao, bancodedados, host, porta, usuario, senha";
		}
		else{
			$colunas = "codigo_estat_conexao, bancodedados, host, porta, usuario";
		}
		$sql = "select $colunas from ".$this->esquemaadmin."i3geoestat_conexao ";
		if($id != ""){
			$sql .= "WHERE codigo_estat_conexao = $id_conexao ";
		}
		$sql .= "ORDER BY bancodedados,host,usuario";
		return $this->execSQL($sql,$id_conexao);
	}
	/*
	Function: listaVariavel

	Lista as variaveis cadastradas ou uma unica variavel

	Parametros:

	$codigo_variavel - opcional
	*/
	function listaVariavel($codigo_variavel=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_variavel ";
		if($codigo_variavel != ""){
			$sql .= "WHERE codigo_variavel = $codigo_variavel ";
		}
		$sql .= "ORDER BY nome";
		return $this->execSQL($sql,$codigo_variavel);
	}
	/*
	Function: alteraVariavel

	Altera uma variavel ou cria uma nova

	Parametros:

	$codigo_variavel - opcional
	*/
	function alteraVariavel($codigo_variavel="",$nome="",$descricao=""){
		try	{
			if($this->convUTF){
				$nome = utf8_encode($nome);
				$descricao = utf8_encode($descricao);
			}
			if($codigo_variavel != ""){
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_variavel SET nome='$nome',descricao='$descricao' WHERE codigo_variavel = $codigo_variavel");
				$retorna = $codigo_variavel;
			}
			else{
				$retorna = $this->insertId("i3geoestat_variavel","descricao","codigo_variavel");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/*
	Function: listaMedidaVariavel

	Lista as medidas das variaveis cadastradas para uma variavel ou uma unica medida

	Parametros:

	$codigo_variavel

	$id_medida_variavel - opcional
	*/
	function listaMedidaVariavel($codigo_variavel,$id_medida_variavel=""){
		$sql = "SELECT i3geoestat_medida_variavel.* ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_variavel ";
		//$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_unidade_medida ";
		//$sql .= "ON i3geoestat_medida_variavel.codigo_unidade_medida = i3geoestat_unidade_medida.codigo_unidade_medida ";
		$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
		$sql .= "ON i3geoestat_variavel.codigo_variavel = i3geoestat_medida_variavel.codigo_variavel ";
		if($codigo_variavel != ""){
			$sql .= "WHERE i3geoestat_variavel.codigo_variavel = $codigo_variavel ";
			if($id_medida_variavel != ""){
				$sql .= "AND i3geoestat_medida_variavel.id_medida_variavel = $id_medida_variavel ";
			}
		}
		else{
			$sql .= "WHERE i3geoestat_medida_variavel.id_medida_variavel = $id_medida_variavel ";
		}
		return $this->execSQL($sql,$id_medida_variavel);
	}
	/*
	 Function: sqlMedidaVariavel

	Monta o sql que permite acessar os dados de uma media de uma variavel

	Parametros:

	$id_medida_variavel - opcional

	$todasascolunas - opcional
	*/
	function sqlMedidaVariavel($id_medida_variavel,$todasascolunas){
		$filtro = false;
		$dados = $this->listaMedidaVariavel("",$id_medida_variavel);
		if($todasascolunas == 0){
			$sql = " SELECT ".$dados["colunavalor"].",".$dados["colunaidgeo"];
		}
		else{
			$sql = " SELECT * ";
		}
		$sql .= " FROM ".$dados["esquemadb"].".".$dados["tabela"];
		if(!empty($dados["filtro"])){
			$sql .= " WHERE ".$dados["filtro"];
			$filtro = true;
		}
		else{
			$dados["filtro"] = "";
		}
		return array("sql"=>$sql,"sqlmapserver"=>"","filtro"=>$filtro);
	}
	function dadosMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0){
		$sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas);
		$sqlf = $sql["sql"];
		if($sql["filtro"] == true){
			if(!empty($filtro)){
				$sqlf .= $sqlf." AND ".$filtro;
			}
		}
		elseif(!empty($filtro)){
			$sqlf .= " WHERE ".$filtro;
		}
		$metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
		if(!empty($metaVariavel["codigo_estat_conexao"])){
			$c = $this->listaConexao($metaVariavel["codigo_estat_conexao"],true);
			$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
			$this->dbh = $dbh;
			return $this->execSQL($sqlf);
		}
		return false;
	}
	/*
	 Function: alteraMedidaVariavel

	Altera uma medida de uma variavel ou cria uma nova
	*/
	function alteraMedidaVariavel($codigo_variavel,$id_medida_variavel="",$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida){
		try	{
			if($id_medida_variavel != ""){
				if($this->convUTF){
					$nomemedida = utf8_encode($nomemedida);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel SET codigo_unidade_medida = '$codigo_unidade_medida',codigo_tipo_periodo = '$codigo_tipo_periodo',codigo_tipo_regiao = '$codigo_tipo_regiao',codigo_estat_conexao = '$codigo_estat_conexao',esquemadb = '$esquemadb',tabela = '$tabela',colunavalor = '$colunavalor',colunaidgeo = '$colunaidgeo',filtro = '$filtro',nomemedida = '$nomemedida' WHERE id_medida_variavel = $id_medida_variavel");
				$retorna = $id_medida_variavel;
			}
			else{
				$retorna = $this->insertId("i3geoestat_medida_variavel","nomemedida","id_medida_variavel");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel SET codigo_variavel = $codigo_variavel WHERE id_medida_variavel = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/*
	 Function: listaDimensao

	Lista as variaveis cadastradas ou uma unica variavel

	Parametros:

	$id_medida_variavel

	$id_dimensao_variavel - opcional
	*/
	function listaDimensao($id_medida_variavel,$id_dimensao_medida=""){
		$sql = "SELECT i3geoestat_dimensao_medida.* ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_dimensao_medida ";
		$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
		$sql .= "ON i3geoestat_dimensao_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel ";
		if($id_medida_variavel != ""){
			$sql .= "WHERE i3geoestat_dimensao_medida.id_medida_variavel = $id_medida_variavel ";
			if($id_dimensao_medida != ""){
				$sql .= "AND i3geoestat_dimensao_medida.id_dimensao_medida = $id_dimensao_medida ";
			}
		}
		else{
			$sql .= "WHERE i3geoestat_dimensao_medida.id_dimensao_medida = $id_dimensao_medida ";
		}
		//echo $sql;exit;
		return $this->execSQL($sql,$id_dimensao_medida);
	}
	/*
	 Function: alteraDimensaoMedida

	Altera uma dimensao de uma medida ou cria uma nova
	*/
	function alteraDimensaoMedida($id_medida_variavel,$id_dimensao_medida="",$nomedimensao,$descricao,$coluna,$agregavalores){
		try	{
			if($id_dimensao_medida != ""){
				if($this->convUTF){
					$nomedimensao = utf8_encode($nomedimensao);
					$descricao = utf8_encode($descricao);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_dimensao_medida SET nomedimensao = '$nomedimensao',descricao = '$descricao',coluna = '$coluna',agregavalores = '$agregavalores' WHERE id_dimensao_medida = $id_dimensao_medida";exit;
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_dimensao_medida SET nomedimensao = '$nomedimensao',descricao = '$descricao',coluna = '$coluna',agregavalores = '$agregavalores' WHERE id_dimensao_medida = $id_dimensao_medida");
				$retorna = $id_dimensao_medida;
			}
			else{
				$retorna = $this->insertId("i3geoestat_dimensao_medida","nomedimensao","id_dimensao_medida");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_dimensao_medida SET id_medida_variavel = $id_medida_variavel WHERE id_dimensao_medida = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}

	/*
	 Function: listaUnidadeMedida

	Lista as unidades de medida cadastradas ou uma unica unidade

	Parametros:

	$codigo_unidade_medida - opcional
	*/
	function listaUnidadeMedida($codigo_unidade_medida=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_unidade_medida ";
		if($id != ""){
			$sql .= "WHERE codigo_unidade_medida = $codigo_unidade_medida ";
		}
		$sql .= "ORDER BY nome";
		return $this->execSQL($sql,$codigo_unidade_medida);
	}
	/*
	 Function: listaTipoPeriodo

	Lista os tipos de períodos de tempo cadastrados ou um único período

	Parametros:

	$codigo_tipo_periodo - opcional
	*/
	function listaTipoPeriodo($codigo_tipo_periodo=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_periodo ";
		if($id != ""){
			$sql .= "WHERE codigo_tipo_periodo = $codigo_tipo_periodo ";
		}
		$sql .= "ORDER BY nome";
		return $this->execSQL($sql,$codigo_tipo_periodo);
	}
	/*
	Function: listaTipoRegiao

	Lista os tipos de períodos de tempo cadastrados ou um único período

	Parametros:

	$codigo_tipo_periodo - opcional
	*/
	function listaTipoRegiao($codigo_tipo_regiao=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
		if($id != ""){
			$sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao ";
		}
		$sql .= "ORDER BY nome_tipo_regiao";
		return $this->execSQL($sql,$codigo_tipo_regiao);
	}
}
?>