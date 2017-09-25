<?php
/**
 * Classe bdexplorer
 *
 * Contem funcoes que acessam o sistema de metadados estatisticos e o banco de dados de determinada conexao
 * Permite listagens apenas quando o esquema estiver em ms_configura/i3geoEsquemasWL
 *
*/
namespace i3geo\classesphp\bdexplorer;
use PDO;
use PDOException;
class Bdexplorer{
	/**
	 * Nome do esquema no banco de dados utilizado para armazenar as tabelas
	 * do sistema de admnistracao. Obtido de ms_configura.php
	 */
	public $esquemaadmin;
	/**
	 * Objeto PDO obtido com new PDO com direito de leitura no banco de dados de administracao
	 */
	public $dbh;
	/**
	 * Indica se e necessario converter para UTF strings obtidas do banco de administracao
	 */
	public $convUTF;
	/**
	 * Pasta temporaria utilizada pelo mapserver
	 */
	public $dir_tmp;
	/**
	 * Pasta onde e feito o cache de imagens do i3Geo
	 */
	public $nomecache;
	/**
	 * Lista branca de esquemas permitidos
	 */
	public $i3geoEsquemasWL;

	public $i3geoEsquemasUpload;
	/**
	 * Construtor
	 * Faz o include de conexao.php que por sua vez faz o include de i3geo/ms_configura.php
	*/
	function __construct($loc="",$dbh=""){
		if(empty($loc)){
			$loc = dirname(__FILE__)."/..";
		}
		include($loc."/ms_configura.php");
		//vem do include
		$this->dir_tmp = $dir_tmp;
		$this->locaplic = $locaplic;
		$this->base = $base;
		$this->esquemaadmin = "";
		if(!empty($esquemaadmin)){
			$this->esquemaadmin = str_replace(".","",$esquemaadmin).".";
		}
		if(!isset($i3geoEsquemasWL) || !is_array($i3geoEsquemasWL)){
			$this->i3geoEsquemasWL = array();
		} else {
			$this->i3geoEsquemasWL = $i3geoEsquemasWL;
		}
		if(!isset($i3geoUploadDataWL) || !is_array($i3geoUploadDataWL)){
			$this->i3geoEsquemasUpload = array();
		} else {
			$this->i3geoEsquemasUpload = $i3geoUploadDataWL["postgis"]["esquemas"];
		}
		//se a conexao nao vier como parametro, cria uma nova
		if(is_array($dbh)){
			$this->dbh = $this->conecta($dbh);
		} else {
			$this->dbh = $dbh;
		}
	}
	function __destruct(){
		$this->fechaConexao();
	}
	function conecta($c){
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		return $dbh;
	}
	/**
	 * Fecha a conexao com o banco de dados de administracao
	 */
	function fechaConexao(){
		$this->dbh = null;
	}
	function listaDeEsquemas(){
		return $this->i3geoEsquemasWL;
	}
	function listaDeEsquemasUpload(){
		return $this->i3geoEsquemasUpload;
	}
	function validaEsquemas($listaDeEsquemas,$lista = ""){
		if($lista == ""){
			$lista = $this->i3geoEsquemasWL;
		}
		$novaLista = array();
		foreach($listaDeEsquemas as $e){
			if(in_array($e,$lista)){
				$novaLista[] = $e;
			}
		}
		return $novaLista;
	}
	function validaEsquema($esquema,$lista=""){
		$lista = $this->validaEsquemas(array($esquema),$lista);
		if(count($lista) == 0){
			return false;
		} else {
			return true;
		}
	}
	function listaDeTabelas($esquema){
		$tabelas = array();
		if($this->validaEsquema($esquema) == true){
			$sql = "SELECT table_name as tabela FROM information_schema.tables where table_schema = '$esquema' AND table_schema NOT LIKE 'i3geo%' AND table_schema NOT LIKE 'pg_%' AND table_schema NOT LIKE '%_schema%'";
			$res = $this->execSQL($sql);
			foreach($res as $r){
				$tabelas[] = $r["tabela"];
			}
		}
		return $tabelas;
	}
	function listaDeTabelasUpload($esquema){
		$tabelas = array();
		if($this->validaEsquema($esquema,$this->i3geoEsquemasUpload) == true){
			$sql = "SELECT table_name as tabela FROM information_schema.tables where table_schema = '$esquema' AND table_schema NOT LIKE 'i3geo%' AND table_schema NOT LIKE 'pg_%' AND table_schema NOT LIKE '%_schema%'";
			$res = $this->execSQL($sql);
			foreach($res as $r){
				$tabelas[] = $r["tabela"];
			}
		}
		return $tabelas;
	}
	function listaDeColunas($esquema,$tabela){
		$colunas = array();
		if($this->validaEsquema($esquema) == true){
			$sql = "SELECT column_name as coluna,udt_name FROM information_schema.columns where table_schema = '$esquema' and table_name = '$tabela'";
			$res = $this->execSQL($sql);
			foreach($res as $r){
				$colunas[] = $r["coluna"];
			}
		}
		return $colunas;
	}
	function execSQL($sql){
		$sql = str_ireplace(array("update","delete","insert","--","drop",";"),"",$sql);
		try	{
			$q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
			$q = $q->fetchAll();
			return $q;
		}
		catch (PDOException $e)	{
			return "Error!: ";
		}
	}
}
?>
