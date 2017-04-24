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
		$this->nomecache = $this->nomeCache();
		if(!isset($i3geoEsquemasWL) || !is_array($i3geoEsquemasWL)){
			$this->i3geoEsquemasWL = array();
		} else {
			$this->i3geoEsquemasWL = $i3geoEsquemasWL;
		}
		//se a conexao nao vier como parametro, cria uma nova
		if(empty($dbh)){
			$this->conecta($conexaoadmin);
		} else {
			$this->dbh = $dbh;
			if(!isset($convUTF)){
				$this->convUTF = true;
			} else {
				$this->convUTF = $convUTF;
			}
		}
	}
	function __destruct(){
		$this->fechaConexao();
	}
	function conecta($conexaoadmin){
		if($conexaoadmin == ""){
			//banco de dados sqlite default
			$arquivosqlite = $this->locaplic."/admin/admin.db";
			if(!file_exists($arquivosqlite)){
				header ( "HTTP/1.1 500 O arquivo admin.db nao existe. Utilize i3geo/admin/criabanco.php para criar o banco de dados SQLITE." );
				exit;
			}
			$conAdmin = "sqlite:$arquivosqlite";
			$conAdminw = "sqlite:$arquivosqlite";
			if(!extension_loaded("PDO")){
				header ( "HTTP/1.1 500 PDO nao instalado" );
				exit;
			}
			if (!extension_loaded( "pdo_sqlite")){
				header ( "HTTP/1.1 500 pdo_sqlite nao instalado" );
				exit;
			}
			if (!extension_loaded( "SQLite") && !extension_loaded( "sqlite3")){
				header ( "HTTP/1.1 500 sqlite nao instalado" );
				exit;
			}
			try	{
				$dbh = new PDO($conAdmin);
			}
			catch (PDOException $e)	{
				die();
			}
		}
		else {
			include($conexaoadmin);
			if(isset($convUTF)){
				$this->convUTF = $convUTF;
			}
		}
		$this->dbh = $dbh;
	}
	function listaDeEsquemas(){
		return $this->i3geoEsquemasWL;
	}
	function validaEsquemas($listaDeEsquemas){
		$novaLista = array();
		foreach($listaDeEsquemas as $e){
			if(in_array($e,$this->i3geoEsquemasWL)){
				$novaLista[] = $e;
			}
		}
		return $novaLista;
	}
	/**
	 * Cria um nome de arquivo concatenando $_request
	 * @return string
	 */
	function nomeCache(){
		return "AAAA".md5(implode("x",$_REQUEST));
	}
	/**
	 * Cria um nome aleatorio
	 * @param numero de caracteres
	 * @return string
	 */
	function nomeRandomico($n=10){
		$nomes = "";
		$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$max = 51;
		for($i=0; $i < $n; ++$i)
		{
			$nomes .= $a{mt_rand(0, $max)};
		}
		return $nomes;
	}
	/**
	 * Fecha a conexao com o banco de dados de administracao
	 */
	function fechaConexao(){
		$this->dbh = null;
	}
	/**
	 * Aplica a conversao de caracteres em um array ou string conforme o padrao do banco de administracao
	 * Verifica se o parametro e um array ou um texto e executa converteTexto()
	 * @param string|array
	 * @return string|array
	 */
	function converteTextoArray($texto){
		try	{
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
						if(is_string($texto[$i][$chave])){
							$t = $this->converteTexto($texto[$i][$chave]);
							$texto[$i][$chave] = $t;
						}
					}
				}
			}
			return $texto;
		}
		catch (Exception $e)	{
			return $texto;
		}
	}
	/**
	 * Converte a codificacao de caracteres de uma string conforme o padrao do banco de admnistracao
	 * @param string
	 * @return string
	 */
	function converteTexto($texto){
		if($texto == "0"){
			return "0";
		}
		if(empty($texto)){
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
	/**
	 * Executa um SQL no banco de administracao
	 * Utiliza fetchAll() para obter os dados
	 * O resultado e processado por converteTextoArray se for desejado
	 * @param string sql
	 * @param se for vazio retorna todos os registros, caso contrario, retorna apenas o primeiro
	 * @param indica se deve ser feita a conversao de caracteres
	 * @return Array
	 */
	function execSQL($sql,$id="",$convTexto=true){
		$sql = str_ireplace(array("update","delete","insert","--","drop",";"),"",$sql);
		try	{
			$q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
		}
		catch (PDOException $e)	{
			return "Error!: ";
		}
		if($q){
			$r = $q->fetchAll();
			if($convTexto == false){
				return $r;
			}
			if($r){
				if($id != ""){
					if(count($r) == 1){
						$r = $r[0];
					}
					else{
						$r = array();
					}
				}
				if($r != false && count($r) > 0){
					$r = $this->converteTextoArray($r);
				}
				return $r;
			}
			else{
				return array();
			}
		}
		else{
			return false;
		}
	}
	/**
	 * Executa um SQL no banco de dados definido em uma conexao cadastrada no sistema de admnistracao
	 * @param codigo da conexao
	 * @param tring sql
	 * @return resultado de execSQL
	*/
	function execSQLDB($codigo_estat_conexao,$sql){
		$buscar = array("drop","update","insert","delete");
		$sql = str_ireplace($buscar,"",$sql);
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbhold = $this->dbh;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$this->dbh = $dbh;
		$res = $this->execSQL($sql,"",false);
		$this->dbh = $dbhold;
		return $res;
	}
	/**
	 * Obtem os dados de uma medida de variavel
	 * @param id da medida
	 * @param filtro que sera concatenado ao sql
	 * @param 0|1 mostra ou nao todas as colunas da tabela com os dados
	 * @param coluna de agrupamento
	 * @param limite do numero de registros
	 * @param le os dados diretamente da tabela sem nenhum tipo de agrupamento, seja por data ou outro parametro
	 * @return execSQL
	 */
	function dadosMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$agruparpor = "",$limite="",$direto=false){
		set_time_limit(0);
		$sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor,"polygon","",false,$filtro,$direto);
		$sqlf = $sql["sqlmapserver"];
		//remove marcadores geo
		$sqlf = explode("/*SE*/",$sqlf);
		$sqlf = explode("/*SG*/",$sqlf[1]);
		$sqlf = $sqlf[0]." ".$sqlf[2];
		if($limite != ""){
			$sqlf .= " limit ".$limite;
		}
		$sqlf = str_replace(",  FROM"," FROM",$sqlf);
		$metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
		//echo $sqlf;exit;
		if(!empty($metaVariavel["codigo_estat_conexao"])){
			$c = $this->listaConexao($metaVariavel["codigo_estat_conexao"],true);
			$dbhold = $this->dbh;
			$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
			$this->dbh = $dbh;
			$res = $this->execSQL($sqlf);
			$this->dbh = $dbhold;
			return $res;
		}
		return false;
	}
	/**
	 * Lista as ocorrencias de valores em uma coluna de uma medida de variavel
	 * @param id da medida de variavel
	 * @param coluna
	 * @return execSQL
	 */
	function valorUnicoMedidaVariavel($id_medida_variavel,$coluna){
		$sqlf = $this->sqlMedidaVariavel($id_medida_variavel,0,$coluna);
		$sqlf = $sqlf["sqlagrupamento"];
		$metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
		if(!empty($metaVariavel["codigo_estat_conexao"])){
			$c = $this->listaConexao($metaVariavel["codigo_estat_conexao"],true);
			$dbhold = $this->dbh;
			$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
			$this->dbh = $dbh;
			$res = $this->execSQL($sqlf);
			$this->dbh = $dbhold;
			return $res;
		}
		return false;
	}
	/**
	 * Sumario estatistico de uma medida de variavel
	 * @param id da medida
	 * @param filtro a ser concatenado ao sql
	 * @param coluna de agrupamento
	 * @param limite numero maximo de registros que serao lidos do banco
	 * @param le os dados diretamente da tabela sem nenhum tipo de agrupamento, seja por data ou outro parametro
	 * @return array("colunavalor"=>,"soma"=>,"media"=>,"menor"=>,"maior"=>,"quantidade"=>,"histograma"=>,"grupos"=>,"unidademedida"=>,"quartis"=>)
	 */
	function sumarioMedidaVariavel($id_medida_variavel,$filtro="",$agruparpor="",$limite="",$direto=false){
		if(!empty($agruparpor)){
			$dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,1,"",$limite,$direto);
		}
		else{
			$dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,0,"",$limite,$direto);
		}
		if($dados){
			$metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
			$un = $this->listaUnidadeMedida($metaVariavel["codigo_unidade_medida"]);
			$agrupamento = "";
			$colunavalor = $metaVariavel["colunavalor"];
			foreach($dados as $d){
				if($d[$colunavalor]){
					$valores[] = $d[$colunavalor];
				}
			}
			if(!empty($agruparpor)){
				$agrupamento = array();
				foreach($dados as $d){
					$g = $d[$agruparpor];
					//var_dump($d);exit;
					if(!empty($agrupamento[$g])){
						$agrupamento[$g] += $d[$colunavalor];
					}
					else{
						$agrupamento[$g] = $d[$colunavalor];
					}
				}
				natsort($agrupamento);
			}
			$soma = "";
			$media = "";
			$min = "";
			$max = "";
			$quantidade = count($valores);
			$sturges = 1 + (3.322 * (log10($quantidade)));
			$quartis = array();
			if($un["permitesoma"] == "1"){
				$soma = array_sum($valores);
			}
			if($un["permitemedia"] == "1"){
				$media = $soma / $quantidade;
			}
			if($un["permitesoma"] == "1" || $un["permitemedia"] == "1"){
				sort($valores);
				//var_dump($valores);exit;
				$min = $valores[0];
				$max = $valores[$quantidade - 1];
				include_once(dirname(__FILE__)."/../../classesphp/classe_estatistica.php");
				$calc = new estatistica();
				$calc->calcula($valores);
				$v = $calc->resultado;
				//expressao para o mapfile
				$expressao[] = "([".$colunavalor."]<=".($v["quartil1"]).")";
				$expressao[] = "(([".$colunavalor."]>".($v["quartil1"]).")and([".$colunavalor."]<=".($v["quartil2"])."))";
				if($v["quartil3"] != 0){
					$expressao[] = "(([".$colunavalor."]>".($v["quartil2"]).")and([".$colunavalor."]<=".($v["quartil3"])."))";
					$expressao[] = "([".$colunavalor."]>".($v["quartil3"]).")";
				}
				$nomes[] = "<= ".($v["quartil1"]);
				$nomes[] = "> ".($v["quartil1"])." e <= ".($v["quartil2"]);
				if($v["quartil3"] != 0){
					$nomes[] = "> ".($v["quartil2"])." e <= ".($v["quartil3"]);
					$nomes[] = "> ".($v["quartil3"]);
				}
				$quartis = array(
							"cortes"=>array(
								"q1"=>$v['quartil1'],
								"q2"=>$v['quartil2'],
								"q3"=>$v['quartil3']
							),
							"expressoes"=>$expressao,
							"nomes"=>$nomes
						);
			}
			$histograma = array_count_values($valores);
			//echo "<pre>".var_dump($quartis);exit;
			return array(
						"colunavalor"=>$colunavalor,
						"soma"=>$soma,
						"media"=>$media,
						"menor"=>$min,
						"maior"=>$max,
						"quantidade"=>$quantidade,
						"histograma"=>$histograma,
						"grupos"=>$agrupamento,
						"unidademedida"=>$un,
						"quartis"=>$quartis,
						"sturges"=>$sturges
					);
		}
		return false;
	}
	/**
	 * Lista os dados de um ou de todos os mapas cadastrados
	 * @param id do mapa
	 */
	function listaMapas($id_mapa=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_mapa ";
		if($id_mapa != ""){
			$sql .= "WHERE id_mapa = $id_mapa ";
		}
		$sql .= "ORDER BY titulo";
		return $this->execSQL($sql,$id_mapa);
	}
	/**
	 * Lista os dados de um ou de todos os mapas grupos de um mapa
	 * @param id do mapa
	 * @param id do grupo
	 */
	function listaGruposMapa($id_mapa,$id_mapa_grupo){
		if(!empty($id_mapa)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_grupo WHERE id_mapa = $id_mapa";
		}
		if(!empty($id_mapa_grupo)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_grupo WHERE id_mapa_grupo = $id_mapa_grupo";
		}
		$sql .= " ORDER BY titulo";
		return $this->execSQL($sql,$id_mapa_grupo);
	}
	/**
	 * Lista os dados de um ou de todos os temas de um grupo de um mapa
	 * @param id do mapa
	 * @param id do grupo
	 * @param id do tema
	 */
	function listaTemasMapa($id_mapa_grupo,$id_mapa_tema){
		if(!empty($id_mapa_grupo)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_tema WHERE id_mapa_grupo = $id_mapa_grupo";
		}
		if(!empty($id_mapa_tema)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_tema WHERE id_mapa_tema = $id_mapa_tema";
		}
		$sql .= " ORDER BY titulo";
		return $this->execSQL($sql,$id_mapa_tema);
	}
	/**
	 * Lista os dados de uma ou todas as unidades de medida cadastradas
	 * @param codigo da unidade
	 */
	function listaUnidadeMedida($codigo_unidade_medida=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_unidade_medida ";
		if($codigo_unidade_medida != ""){
			$sql .= "WHERE codigo_unidade_medida = $codigo_unidade_medida ";
		}
		$sql .= "ORDER BY nome";
		return $this->execSQL($sql,$codigo_unidade_medida);
	}
	/**
	 * Lista os dados de uma ou todas as fontes cadastradas
	 * @param id da fonte
	 */
	function listaFonteinfo($id_fonteinfo=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_fonteinfo ";
		if($id_fonteinfo != ""){
			$sql .= "WHERE id_fonteinfo = $id_fonteinfo ";
		}
		$sql .= "ORDER BY titulo";
		return $this->execSQL($sql,$id_fonteinfo);
	}
	/**
	 * Lista as fontes vinculadas a uma medida de variavel
	 * @param id da medida de variavel
	 */
	function listaFonteinfoMedida($id_medida_variavel){
		$sql = "SELECT i3geoestat_fonteinfo.* ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_fonteinfo ";
		$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_fonteinfo_medida ";
		$sql .= "ON i3geoestat_fonteinfo.id_fonteinfo = i3geoestat_fonteinfo_medida.id_fonteinfo ";
		$sql .= "WHERE i3geoestat_fonteinfo_medida.id_medida_variavel = $id_medida_variavel ";
		$sql .= "ORDER BY titulo";
		//echo $sql;exit;
		return $this->execSQL($sql,$id_fonteinfo);
	}
	/**
	 * Lista os dados de uma ou todas as variaveis cadastradas
	 * @param codigo da variavel
	 * @param mostra apenas as variaveis cujas tabelas ficam nesse esquema
	 */
	function listaVariavel($codigo_variavel="",$filtro_esquema=""){
		$sql = "select DISTINCT a.* from ".$this->esquemaadmin."i3geoestat_variavel as a ";
		if($codigo_variavel != ""){
			$sql .= "WHERE a.codigo_variavel = $codigo_variavel ";
		}
		if($filtro_esquema != ""){
			$sql .= ", ".$this->esquemaadmin."i3geoestat_medida_variavel as b WHERE a.codigo_variavel = b.codigo_variavel and b.esquemadb = '$filtro_esquema' ";
		}
		$sql .= "ORDER BY a.nome";
		//echo $sql;exit;
		return $this->execSQL($sql,$codigo_variavel);
	}
	/**
	 * Lista os dados de uma ou todas as classificacoes de uma medida de variavel
	 * @param id da medida de variavel
	 * @param id da classificacao
	 */
	function listaClassificacaoMedida($id_medida_variavel,$id_classificacao=""){
		if(!empty($id_medida_variavel)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classificacao WHERE id_medida_variavel = $id_medida_variavel";
		}
		if(!empty($id_classificacao)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classificacao WHERE id_classificacao = $id_classificacao";
		}
		return $this->execSQL($sql,$id_classificacao);
	}
	/**
	 * Lista os dados de um ou todos os links de uma medida
	 * @param id da medida
	 * @param id do link
	 */
	function listaLinkMedida($id_medida_variavel,$id_link=""){
		if(!empty($id_medida_variavel)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_medida_variavel_link WHERE id_medida_variavel = $id_medida_variavel";
		}
		if(!empty($id_link)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_medida_variavel_link WHERE id_link = $id_link";
		}
		return $this->execSQL($sql,$id_link);
	}
	/**
	 * Lista os dados de uma ou todas as classes de uma classificacao
	 * @param id da classificacao
	 * @param id da classe
	 */
	function listaClasseClassificacao($id_classificacao,$id_classe=""){
		if(!empty($id_classificacao)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classes WHERE id_classificacao = $id_classificacao";
		}
		if(!empty($id_classe)){
			$sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classes WHERE id_classe = $id_classe";
		}
		return $this->execSQL($sql,$id_classe);
	}
	/**
	 * Lista os dados de uma ou todas as medidas de variavel de uma variavel
	 * @param codigo da variavel
	 * @param id da medida de variavel
	 */
	function listaMedidaVariavel($codigo_variavel,$id_medida_variavel=""){
		$sql = "SELECT i3geoestat_medida_variavel.*,i3geoestat_variavel.nome as nome_variavel,i3geoestat_unidade_medida.permitemedia,i3geoestat_unidade_medida.permitesoma,i3geoestat_unidade_medida.nome as unidade_medida ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_variavel ";
		$sql .= "JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
		$sql .= "ON i3geoestat_variavel.codigo_variavel = i3geoestat_medida_variavel.codigo_variavel ";
		$sql .= "LEFT JOIN ".$this->esquemaadmin."i3geoestat_unidade_medida ";
		$sql .= "ON i3geoestat_unidade_medida.codigo_unidade_medida = i3geoestat_medida_variavel.codigo_unidade_medida ";
		if($codigo_variavel != ""){
			$sql .= "WHERE i3geoestat_variavel.codigo_variavel = $codigo_variavel ";
			if($id_medida_variavel != ""){
				$sql .= "AND i3geoestat_medida_variavel.id_medida_variavel = $id_medida_variavel ";
			}
		}
		elseif($id_medida_variavel != "") {
			$sql .= "WHERE i3geoestat_medida_variavel.id_medida_variavel = $id_medida_variavel ";
		}
		$sql .= "ORDER BY i3geoestat_medida_variavel.nomemedida";
		$res = $this->execSQL($sql,$id_medida_variavel);
		$res = str_replace('"',"'",$res);
		return $res;
	}
	/**
	 * Lista as regioes vinculadas a uma medida de variavel
	 * @param id da medida de vriavel
	 */
	function listaRegioesMedida($id_medida_variavel){
		$variavel = $this->listaMedidaVariavel("",$id_medida_variavel);
		$codigo_tipo_regiao = $variavel["codigo_tipo_regiao"];
		$regioes[] = $this->listaTipoRegiao($codigo_tipo_regiao);
		//var_dump($regioes);exit;
		$agregacoes = $this->listaAgregaRegiao($codigo_tipo_regiao);
		foreach($agregacoes as $a){
			$regioes[] = $this->listaTipoRegiao($a["codigo_tipo_regiao_pai"]);
		}
		return $regioes;
	}
	/**
	 * Lista os dados de uma conexao ou de todas
	 * @param id da conexao
	 * @param boolean inclui na lista a senha ou nao
	 * @param boolean inclui as conexoes definidas em postgis_mapa (ms_configura.php)
	 */
	function listaConexao($codigo_estat_conexao="",$senha=false,$incluiPostgisMapa=true){
		if($senha == true){
			$colunas = "codigo_estat_conexao, bancodedados, host, porta, usuario, senha";
		}
		else{
			$colunas = "codigo_estat_conexao, bancodedados, host, porta, usuario";
		}
		$sql = "select $colunas from ".$this->esquemaadmin."i3geoestat_conexao ";
		if($codigo_estat_conexao != ""){
			$sql .= "WHERE codigo_estat_conexao = $codigo_estat_conexao ";
		}
		$sql .= "ORDER BY bancodedados,host,usuario";
		$res = $this->execSQL($sql,$codigo_estat_conexao);
		//se achou e a requisico e para listar uma conexao, retorna o que for encontrado
		$cres = count($res);
		if($cres > 0 && $codigo_estat_conexao != "" && !empty($cres[0]["dbname"])){
			return $res;
		}
		//caso contrario, e deve retornar todas as conexoes, inclui a fonte
		if($codigo_estat_conexao == ""){
			for($i=0; $i<$cres;$i++){
				$res[$i]["fonte"] = "metaestat";
			}
		}
		//obtem as conexoes definidas em ms_configgura.php
		if($incluiPostgisMapa == true){
			if(!isset($postgis_mapa)){
				require(dirname(__FILE__)."/../../ms_configura.php");
			}
			if(!empty($postgis_mapa)){
				foreach(array_keys($postgis_mapa) as $key){
					$lista = explode(" ",$postgis_mapa[$key]);
					$con = array();
					foreach($lista as $l){
						$teste = explode("=",$l);
						$con[trim($teste[0])] = trim($teste[1]);
					}
					$c = array(
						"codigo_estat_conexao" => $key,
						"bancodedados" => $con["dbname"],
						"host" => $con["host"],
						"porta" => $con["port"],
						"usuario" => $con["user"],
						"fonte" => "ms_configura"
					);
					if($senha == true){
						$c["senha"] = $con["password"];
					}
					$res[] = $c;
					if($codigo_estat_conexao != "" && $codigo_estat_conexao == $key){
						return $c;
					}
				}
			}
		}
		//echo "<pre>";
		//var_dump($res);exit;
		return $res;
	}
	function listaParametroTempo2CampoData($id_medida_variavel,$prefixoAlias = ""){
		//lista os parametros temporais
		$parametros = $this->listaParametro($id_medida_variavel,"","",true,true);
		echo "<pre>";
		//var_dump($parametros);exit;
		//faz o sql para pegar os valores e definir a resolucao
		//o tempo deve comecar sempre pelo ano
		$data = array();
		if($parametros[0]["tipo"] == 1){
			//ano
			$data[] = $prefixoAlias.$parametros[0]["coluna"];
			$tipodata = "YYYY";
			//mes
			if(!empty($parametros[1])){
				$data[] = "'-'".$prefixoAlias.$parametros[1]["coluna"];
				$tipodata = "YYYYMM";
			}
			else{
				$data[] = "'-01'";
			}
			//dia
			if(!empty($parametros[2])){
				$data[] = "'-'".$prefixoAlias.$parametros[2]["coluna"];
				$tipodata = "YYYYMMDD";
			}
			else{
				$data[] = "'-01'";
			}
			$data = implode("||",$data);
			return "to_date($data,'$tipodata')";
		}
	}
	/**
	 * Lista os dados de um ou de todos os parametros relacionados a uma medida de variavel
	 * @param id da medida de variavel
	 * @param id do parametro
	 * @param id do pai (se definido, lista apenas os filhos deste)
	 * @param bool indica se apenas parametros do tipo temporal serao retornados
	 */
	function listaParametro($id_medida_variavel,$id_parametro_medida="",$id_pai="",$apenasTempo=false,$ordenaPeloPai=false){
		$sql = "SELECT i3geoestat_parametro_medida.*,i3geoestat_medida_variavel.* ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_parametro_medida ";
		$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
		$sql .= "ON i3geoestat_parametro_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel ";
		if($id_medida_variavel != ""){
			$sql .= "WHERE i3geoestat_parametro_medida.id_medida_variavel = $id_medida_variavel ";
			if($id_parametro_medida != ""){
				$sql .= "AND i3geoestat_parametro_medida.id_parametro_medida = $id_parametro_medida ";
			}
		}
		elseif ($id_parametro_medida != ""){
			$sql .= "WHERE i3geoestat_parametro_medida.id_parametro_medida = $id_parametro_medida ";
		}
		if($id_pai != ""){
			$sql .= " AND id_pai = $id_pai";
		}
		if($apenasTempo == true){
			$tempo = " AND i3geoestat_parametro_medida.tipo > 0 AND i3geoestat_parametro_medida.tipo < 5 ";
			$sql .= $tempo;
		}
		if($ordenaPeloPai == true){
			$sql .= " ORDER BY id_pai";
		}
		//echo $sql;exit;
		return $this->execSQL($sql,$id_parametro_medida);
	}
	/**
	 * Lista todos os parametros cadastrados
	 */
	function listaTodosParametros(){
		$sql = "SELECT i3geoestat_parametro_medida.*,i3geoestat_medida_variavel.* ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_parametro_medida ";
		$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
		$sql .= "ON i3geoestat_parametro_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel ";
		$sql .= " ORDER BY nome";
		return $this->execSQL($sql);
	}
	/**
	 * Lista os valores (unicos) que ocorrem em um parametro de uma medida de variavel
	 * @param id do parametro
	 * @return array com os valores
	 */
	function listaValoresParametro($id_parametro_medida){
		$parametro = $this->listaParametro("",$id_parametro_medida);
		//$medida = $this->listaMedidaVariavel("",$parametro["id_medida_variavel"]);
		$sm = $this->valorUnicoMedidaVariavel($parametro["id_medida_variavel"],$parametro["coluna"]);
		$nsm = array();
		foreach($sm as $s){
			$nsm[] = $s[$parametro["coluna"]];
		}
		return $nsm;
	}
	/**
	 * Lista os dados de um ou todos os tipos de periodo cadastrados
	 * @param id
	 */
	function listaTipoPeriodo($codigo_tipo_periodo=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_periodo ";
		if($codigo_tipo_periodo != ""){
			$sql .= "WHERE codigo_tipo_periodo = $codigo_tipo_periodo ";
		}
		$sql .= "ORDER BY nome";
		return $this->execSQL($sql,$codigo_tipo_periodo);
	}
	/**
	 * Lista as propriedades da coluna com as geometrias de uma regiao geografica
	 * @param codigo do tipo de regiao
	 * @return array com os parametros, inclusive a dimensao (st_dimension)
	 */
	function listaPropGeoRegiao($codigo_tipo_regiao){
		//st_dimension returns 0 for POINT, 1 for LINESTRING, 2 for POLYGON
		$regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
		$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$c = $regiao["colunageo"];
		$sql = "select st_dimension(".$regiao["colunageo"].") as st_dimension from ".$regiao["esquemadb"].".".$regiao["tabela"]." limit 1";
		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = array();
		if($q){
			$r = $q->fetchAll();
			$r = $r[0];
		}
		return $r;
	}
	/**
	 * Lista os dados de uma ou todas as regioes cadastradas
	 * @param codigo do tipo de regiao
	 */
	function listaTipoRegiao($codigo_tipo_regiao=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
		if($codigo_tipo_regiao != ""){
			$sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao ";
		}
		$sql .= "ORDER BY nome_tipo_regiao";
		return $this->execSQL($sql,$codigo_tipo_regiao);
	}
	/**
	 * Obtem de um tipo de regiao a coluna do tipo serial
	 * @param codigo do tipo de regiao
	 */
	function listaTipoRegiaoSerial($codigo_tipo_regiao){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_regiao WHERE codigo_tipo_regiao = $codigo_tipo_regiao ";
		$regiao = $this->execSQL($sql,$codigo_tipo_regiao);
		$nome_esquema = $regiao["esquemadb"];
		$nome_tabela = $regiao["tabela"];
		$sql = "SELECT a.attname as coluna FROM pg_class s JOIN pg_depend d ON d.objid = s.oid JOIN pg_class t ON d.objid = s.oid AND d.refobjid = t.oid JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum) JOIN pg_namespace n ON n.oid = s.relnamespace WHERE s.relkind = 'S' AND n.nspname = '$nome_esquema' AND t.relname = '$nome_tabela'";
		$colunas = $this->execSQLDB($regiao["codigo_estat_conexao"],$sql);
		$colunas = $colunas[0];
		return $colunas["coluna"];
	}
	/**
	 * Obtem de uma tabela a coluna do tipo serial
	 * @param codigo do tipo de regiao
	 */
	function listaTabelaSerial($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		$sql = "SELECT a.attname as coluna FROM pg_class s JOIN pg_depend d ON d.objid = s.oid JOIN pg_class t ON d.objid = s.oid AND d.refobjid = t.oid JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum) JOIN pg_namespace n ON n.oid = s.relnamespace WHERE s.relkind = 'S' AND n.nspname = '$nome_esquema' AND t.relname = '$nome_tabela'";
		$colunas = $this->execSQLDB($codigo_estat_conexao,$sql);
		$colunas = $colunas[0];
		return $colunas["coluna"];
	}
	/**
	 * Lista os dados de agregacao de uma regiao pai
	 * @param codigo da regiao
	 */
	function listaHierarquiaRegioes($codigoregiaopai=""){
		$sql = "select i3geoestat_agregaregiao.id_agregaregiao,i3geoestat_agregaregiao.colunaligacao_regiaopai,i3geoestat_tipo_regiao.codigo_tipo_regiao,i3geoestat_tipo_regiao.nome_tipo_regiao from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
		$sql .= "LEFT JOIN ".$this->esquemaadmin."i3geoestat_agregaregiao ";
		$sql .= "ON i3geoestat_tipo_regiao.codigo_tipo_regiao = i3geoestat_agregaregiao.codigo_tipo_regiao ";
		if($codigoregiaopai != ""){
			$sql .= " WHERE ".$this->esquemaadmin."i3geoestat_agregaregiao.codigo_tipo_regiao_pai = $codigoregiaopai";
		}
		else{
			$sql .= "WHERE ".$this->esquemaadmin."i3geoestat_agregaregiao.codigo_tipo_regiao IS NULL";
		}
		return $this->execSQL($sql,"");
	}
	function listaHierarquia($codigoregiaopai=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao order by codigo_tipo_regiao";
		return $this->execSQL($sql,"");
	}
	/**
	 * Lista os registros de um tipo de regiao
	 * Se for definido o pai, lista os valores da regiao que e filha
	 * Nesse caso e necessario definir o identificador da regiao pai para obter os registros na regiao filha
	 * @param codigo do tipo de regiao
	 * @param codigo do tipo de regiao pai
	 * @param identificador da regiao (registro) pai
	 */
	function listaDadosRegiao($codigo_tipo_regiao,$codigo_tipo_regiaopai="",$valorregiaopai=""){
		//pega a tabela, esquema e conexao para acessar os dados da regiao
		$regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
		$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$c = $regiao["colunageo"];
		$bbox = "ST_XMin($c)||' '||ST_YMin($c)||' '||ST_XMax($c)||' '||ST_YMax($c) as ext ";
		$sql = "select $bbox,".$regiao["colunanomeregiao"]." as nome_regiao,".$regiao["identificador"]." as identificador_regiao from ".$regiao["esquemadb"].".".$regiao["tabela"];
		if($valorregiaopai != ""){
			$r = $this->listaAgregaRegiaoFilho($codigo_tipo_regiao,$codigo_tipo_regiaopai);
			$sql .= " WHERE ".$r["colunaligacao_regiaopai"]."::text = '$valorregiaopai'";
		}
		$sql .= " order by ".$regiao["colunanomeregiao"];

		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = array();
		if($q){
			$r = $q->fetchAll();
		}
		return $r;
	}
	/**
	 * Lista os registros de uma tabela que e uma regiao
	 * @param codigo do tipo de regiao
	 */
	function listaDadosGeometriaRegiao($codigo_tipo_regiao){
		//pega a tabela, esquema e conexao para acessar os dados da regiao
		$regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
		$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$c = $regiao["colunageo"];
		$s = "ST_dimension($c) as dimension ";
		$sql = "select $s,".$regiao["colunanomeregiao"]." as nome_regiao,".$regiao["identificador"]." as identificador_regiao from ".$regiao["esquemadb"].".".$regiao["tabela"];
		$sql .= " limit 1";
		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = array();
		if($q){
			$r = $q->fetchAll();
		}
		return $r[0];
	}
	/**
	 * Lista uma ou todas as agregacoes de regioes existentes para um tipo de regiao
	 * @param codigo do tipo de regiao
	 * @param id da agregacao
	 */
	function listaAgregaRegiao($codigo_tipo_regiao="",$id_agregaregiao=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao ";
		if($id_agregaregiao != ""){
			$sql .= "WHERE id_agregaregiao = $id_agregaregiao ";
		}
		else{
			if($codigo_tipo_regiao != ""){
				$sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao";
			}
		}
		$sql .= " ORDER BY colunaligacao_regiaopai";
		//echo $sql;exit;
		return $this->execSQL($sql,$id_agregaregiao);
	}
	/**
	 * Lista uma ou todas as agregacoes de regioes filhas de um tipo de regiao
	 * @param codigo do tipo de regiao
	 * @param codigo do tipo de regiao que e pai
	 */
	function listaAgregaRegiaoFilho($codigo_tipo_regiao,$codigo_tipo_regiao_pai){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao ";
		$sql .= "WHERE codigo_tipo_regiao_pai = $codigo_tipo_regiao_pai ";
		if($codigo_tipo_regiao != ""){
			$sql .= "AND codigo_tipo_regiao = $codigo_tipo_regiao";
		}
		return $this->execSQL($sql,$codigo_tipo_regiao_pai);
	}
	/**
	 * Lista os esquemas em um banco de dados
	 * @param codigo da conexao
	 * @return execSQLDB
	 */
	function esquemasConexao($codigo_estat_conexao){
		return $this->execSQLDB($codigo_estat_conexao,"SELECT oid,nspname as esquema FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname NOT LIKE '%_schema%' group by nspname,oid order by nspname");
	}
	/**
	 * Lista as tabelas de um esquema
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param sim|nao exclui da lista as tabelas que contem geometria
	 * @return execSQLDB
	 */
	function tabelasEsquema($codigo_estat_conexao,$nome_esquema,$excluigeom=""){
		$sql = "SELECT table_name as tabela FROM information_schema.tables where table_schema = '$nome_esquema' AND table_schema NOT LIKE 'i3geo%' AND table_schema NOT LIKE 'pg_%' AND table_schema NOT LIKE '%_schema%'";
		if(strtolower($excluigeom) == "sim"){
			$sql = "SELECT c.table_name as tabela FROM information_schema.tables as c left join (SELECT distinct a.table_name FROM information_schema.tables as a left join information_schema.columns as b	on	a.table_name = b.table_name	where a.table_schema = '$nome_esquema' and	udt_name = 'geometry' ) as d on c.table_name = d.table_name where c.table_schema = '$nome_esquema'  AND c.table_schema NOT LIKE 'i3geo%' AND c.table_schema NOT LIKE 'pg_%' AND c.table_schema NOT LIKE '%_schema%' and d.table_name is null";
		}
		return $this->execSQLDB($codigo_estat_conexao,$sql);
	}
	/**
	 * Lista as colunas de uma tabela
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @param tipo de coluna (opcional)
	 * @param tipo de tratamento do parametro tipo, pode ser =|!=
	 * @return execSQLDB
	 */
	function colunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela,$tipo="",$tipotratamento="="){
		$colunas = array();
		$res = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name as coluna,udt_name FROM information_schema.columns where table_schema = '$nome_esquema' and table_name = '$nome_tabela'");
		if($tipo != ""){
			$res = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name as coluna,udt_name FROM information_schema.columns where table_schema = '$nome_esquema' and udt_name $tipotratamento '$tipo' and table_name = '$nome_tabela'");
		}
		foreach($res as $c){
			$colunas[] = $c["coluna"];
		}
		return $colunas;
	}
	/**
	 * Lista o comentario de uma tabela
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @return execSQLDB
	 */
	function comentarioTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		$colunas = array();
		$sql = "SELECT  pg_catalog.obj_description(c.oid, 'pg_class') AS comments FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON (n.oid = c.relnamespace) WHERE n.nspname = '".$nome_esquema."' AND c.relname = '".$nome_tabela."'";
		$res = $this->execSQLDB($codigo_estat_conexao,$sql);
		if(count($res) > 0){
			$res = $res[0];
			$res = $res["comments"];
		}
		else{
			$res = "";
		}
		if($res == null){
			$res = "";
		}
		return $res;
	}
	/**
	 * Lista os metadados de uma coluna
	 * Os metadados sao obtidos do proprio PostgreSQL
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @param nome da coluna (opcional)
	 * @return execSQLDB
	 */
	function descreveColunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nome_coluna=""){
		if($nome_coluna == ""){
			return $this->execSQLDB($codigo_estat_conexao,"SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
		}
		else{
			$res = $this->execSQLDB($codigo_estat_conexao,"SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE a.attname = '$nome_coluna' AND c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
			return $res[0];
		}
	}
	/**
	 * Lista os dados de uma tabela
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @param sim|nao inclui o WKT da geometria de colunas geo
	 * @param (opcional) numero de registros que serao listados
	 * @return execSQLDB
	 */
	function obtemDadosTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$geo="nao",$nreg=""){
		$desccolunas = $this->descreveColunasTabela($codigo_estat_conexao, $nome_esquema, $nome_tabela);
		$colunas = array();
		$colsql = array();
		foreach($desccolunas as $d){
			if($d["type"] != "geometry" && $d["type"] != "geography"){
				$colunas[] = $d["field"];
				$colsql[] = $d["field"];
			}
			elseif($geo == "sim"){
				$colunas[] = $d["field"];
				$colsql[] = "ST_AsText(".$d["field"].") as ".$d["field"];
			}
		}
		$sql = "SELECT ".implode(",",$colsql)." from ".$nome_esquema.".".$nome_tabela;
		if($nreg != ""){
			$sql = "SELECT ".implode(",",$colsql)." from ".$nome_esquema.".".$nome_tabela." limit $nreg";
		}
		$dados = $this->execSQLDB($codigo_estat_conexao,$sql );
		$linhas = array();
		foreach($dados as $d){
			$l = array();
			foreach($colunas as $c){
				$l[] = $d[$c];
			}
			$linhas[] = $l;
		}
		return array("nomescolunas"=>$colunas,"colunas"=>$desccolunas,"linhas"=>$linhas);
	}
	/**
	 * Relatorio completo com a lista de variaveis e medidas
	 * @param codigo da variavel
	 * @param sim|nao inclui dados detalhados
	 * @return Array
	 */
	function relatorioCompleto($codigo_variavel="",$dadosGerenciais="nao"){
		$dados = array();
		if($codigo_variavel != "" || !empty($codigo_variavel)){
			$vs[] = $this->listaVariavel($codigo_variavel);
		}
		else{
			$vs = $this->listaVariavel();
		}
		foreach($vs as $v){
			$nivel1["id"] = $v["codigo_variavel"];
			$nivel1["titulo"] = $v["nome"];
			$nivel1["descricao"] = $v["descricao"];
			$ms = $this->listaMedidaVariavel($v["codigo_variavel"]);
			$nivel1["filhos"] = array();
			foreach($ms as $m){
				$nivel2["id"] = $m["id_medida_variavel"];
				$nivel2["titulo"] = $m["nomemedida"];
				$unidade = $this->listaUnidadeMedida($m["codigo_unidade_medida"]);
				$unidade = "Unidade de medida: ".$unidade["nome"];
				$periodo = $this->listaTipoPeriodo($m["codigo_tipo_periodo"]);
				$periodo = "Per&iacute;odo de tempo: ".$periodo["nome"];
				$regiao = $this->listaTipoRegiao($m["codigo_tipo_regiao"]);
				$regiao = "Regi&atilde;o: ".$regiao["nome_tipo_regiao"];
				$nivel2["descricao"] = $unidade.", ".$periodo.", ".$regiao;
				$nivel2["fontes"] = $this->listaFonteinfoMedida($m["id_medida_variavel"]);
				$nivel2["links"] = $this->listaLinkMedida($m["id_medida_variavel"]);
				$nivel2["dadosgerenciais"] = "";
				if($dadosGerenciais == "sim"){
					$nivel2["dadosgerenciais"] = $m;
				}
				$nivel1["filhos"][] = $nivel2;
			}
			$dados[] = $nivel1;
		}
		return $dados;
	}
	/**
	 * Cria um raltorio formatado em HTML
	 * @param dados obtidos com relatorioCompleto
	 * @param sim|nao inclui os dados detalhados
	 * @return string
	 */
	function formataRelatorioHtml($dados,$detalhes="sim"){
		$html[] = "<div class='var_div_relatorio'>";
		$var_cor = "var_cor1";
		foreach($dados as $variavel){
			$html[] = "<div class='".$var_cor."'>";
			$html[] = "<h1 style=padding:3px; ><b>".$variavel["titulo"];
			$html[] = "</b><br><span style='color:rgb(100,100,100)'>".$variavel["descricao"]."</span></h1>";
			$filhos = $variavel["filhos"];
			foreach($filhos as $f){
				$html[] = "<h2 style='position:relative;left:10px;'>ID: <u>".$f["id"]."</u> - ".$f["titulo"]."</h2>";
				$html[] = "<div style='position:relative;padding-left:20px;'>";
				$html[] = "<p>".$f["descricao"]."</p>";
				if($detalhes == "sim"){
					$html[] = "<p><b>Fontes:</b></p>";
					foreach($f["fontes"] as $fonte){
						$html[] = "<p><a href='".$fonte["link"]."' >".$fonte["titulo"]."</a></p>";
					}
					$html[] = "<p><b>Links:</b></p>";
					foreach($f["links"] as $link){
						$html[] = "<p><a href='".$link["link"]."' >".$link["nome"]."</a></p>";
					}
					if($f["dadosgerenciais"] != ""){
						$html[] = "<span style='color:gray'>";
						$html[] = "esquemadb = ".$f["dadosgerenciais"][esquemadb].", ";
						$html[] = "tabela = ".$f["dadosgerenciais"][tabela].", ";
						$html[] = "colunavalor = ".$f["dadosgerenciais"][colunavalor].", ";
						$html[] = "colunaidgeo = ".$f["dadosgerenciais"][colunaidgeo].", ";
						$html[] = "filtro = ".$f["dadosgerenciais"][filtro].", ";
						$html[] = "colunaidunico = ".$f["dadosgerenciais"][colunaidunico];
						$html[] = "</span>";
					}
				}
				$html[] = "</div>";
			}
			$html[] = "</div>";
			if($var_cor == "var_cor1"){
				$var_cor = "var_cor2";
			}
			else{
				$var_cor = "var_cor1";
			}
		}
		$html[] = "</div><br><br>";
		return implode("",$html);
	}
	/**
	 * Cria um relatorio no formato XML
	 * @param dados obtidos com relatorioCompleto
	 * @return string
	 */
	function formataXML($dados){
		$chaves = array_keys($dados[0]);
		if(count($chaves) == 0){
			$chaves = false;
		}
		$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">" . PHP_EOL;
		$xml .= '<result-set>' . PHP_EOL;
		//tenta descobrir o tipo de coluna
		//$xml .= '<!--java.lang.String,java.lang.Integer-->' . PHP_EOL;
		$xmldados = "";
		if($chaves){
			foreach($dados as $d){
				$xmldados .= "<row>" . PHP_EOL;
				foreach($chaves as $c){
					$xmldados .= "<".$c.">".$d[$c]."</".$c.">" . PHP_EOL;
				}
				$xmldados .= "</row>" . PHP_EOL;
			}
			$tipos = array();
			$d = $dados[0];
			foreach($chaves as $c){
				if(is_numeric($d[$c])){
					$tipos[] = "java.lang.Integer";
				}
				else{
					$tipos[] = "java.lang.String";
				}
			}
			$xml .= '<!--'.implode($tipos,",").'-->' . PHP_EOL;
		}
		else{
			while (list($key, $val) = each($dados)) {
				$xmldados .= "<row>" . PHP_EOL;
				$xmldados .= "<nome>".$key."</nome>" . PHP_EOL;
				$xmldados .= "<valor>".$val."</valor>" . PHP_EOL;
				$xmldados .= "</row>" . PHP_EOL;
			}
			reset($dados);
			$tipos = array();
			while (list($key, $val) = each($dados)) {
				if(is_numeric($val)){
					$tipos[] = "java.lang.Integer";
				}
				else{
					$tipos[] = "java.lang.String";
				}
				if(is_numeric($key)){
					$tipos[] = "java.lang.Integer";
				}
				else{
					$tipos[] = "java.lang.String";
				}
				break;
			}
			$xml .= '<!--'.implode($tipos,",").'-->' . PHP_EOL;
		}
		$xml .= $xmldados;
		$xml .= '</result-set>' . PHP_EOL;
		return $xml;
	}
	/**
	 * Verifica se em um array existe uma chave com determinado valor
	 * @param Array
	 * @param nome da chave
	 * @param valor a ser buscado
	 * @return boolean
	 */
	function buscaNoArray($lista,$chave,$valor){
		foreach($lista as $l){
			if($l[$chave] == $valor){
				return true;
			}
		}
		return false;
	}
	/**
	 * Obtem o valor de um registro de uma tabela de regiao com base na coordenada de longitude e latitude
	 * @param codigo do tipo de regiao
	 * @param longitude
	 * @param latitude
	 * @return array
	 */
	function xy2regiao($codigo_tipo_regiao,$x,$y){
		//pega a tabela, esquema e conexao para acessar os dados da regiao
		$regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
		$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$sql = "select ".$regiao["identificador"]." as identificador_regiao,".$regiao["colunanomeregiao"]." as nomeregiao from i3geo_metaestat.".$regiao["tabela"]." WHERE ST_within(ST_GeomFromText('POINT($x $y)',".$regiao["srid"]."),".$regiao["colunageo"].")";
		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = $q->fetchAll();
		if(count($r) > 0){
			return $r[0];
		}
		else{
			return "";
		}
	}
	/**
	 * Busca os dados de uma medida de variavel para uma regiao
	 * Identificador da regiao e o valor a ser encontrado na coluna de
	 * ligacao da tabela da medida da variavel com a tabela com as localidades (tipo de regiao)
	 * @param identificador da regiao
	 * @param id da medida da variavel
	 * @return multitype:unknown multitype: string
	 */
	function listaAtributosMedidaVariavelRegiao ($identificador_regiao,$id_medida_variavel){
		$medida = $this->listaMedidaVariavel("",$id_medida_variavel);
		$c = $this->listaConexao($medida["codigo_estat_conexao"],true);
		if($medida["colunavalor"] == ""){
			return "";
		}
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$colunassql[] = $medida["colunavalor"].",".$medida["colunaidunico"];

		$alias[] = $medida["nomemedida"];
		$colunas[] = $medida["colunavalor"];
		$alias[] = "idunico";
		$colunas[] = $medida["colunaidunico"];
		$descricao[] = $medida["unidade_medida"];
		$parametros = $this->listaParametro($id_medida_variavel);
		foreach($parametros as $p){
			$colunassql[] = $p["coluna"];
			$alias[] = $p["nome"];
			$descricao[] = $p["descricao"];
			$colunas[] = $p["coluna"];
		}

		$sql = "select ".implode(",",$colunassql)." from ".$medida["esquemadb"].".".$medida["tabela"]." WHERE ".$medida["colunaidgeo"]."::text = ".$identificador_regiao."::text ";
		if($medida["filtro"] != ""){
			$sql .= " and ".$medida["filtro"];
		}
		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = $q->fetchAll();
		return array("dados"=>$r,"aliascolunas"=>$alias,"colunas"=>$colunas,"descricao"=>$descricao);
	}
	/*
	 * Testa se os elementos de um array sao numericos
	 */
	function testaNumerico($valores){
		foreach ($valores as $valor) {
			if(!empty($valor) && !is_numeric($valor)) {
				echo "valor nao numerico";
				exit;
			}
		}
	}
}
?>
