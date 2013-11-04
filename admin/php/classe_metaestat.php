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
GNU conforme publicada pela listaDadosRegiao Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/classe_metaestat.php
*/
/**
 * Classe metaestat
 * O construtor da classe faz o include do programa conexao.php que por sua vez faz o include
 * de i3geo/ms_configura.php. Com base nesses programas sao definidas algumas das variaveis globais
*/
class Metaestat{
	/**
	 * Nome do esquema no banco de dados utilizado para armazenar as tabelas
	 * do sistema de admnistracao. Obtido de ms_configura.php
	 */
	protected $esquemaadmin;
	/**
	 * Objeto PDO obtido com new PDO com direito de leitura no banco de dados de administracao
	 */
	public $dbh;
	/**
	 * Objeto PDO obtido com new PDO com direito de escrita no banco de dados de administracao
	 */
	protected $dbhw;
	/**
	 * Indica se e necessario converter para UTF strings obtidas do banco de administracao
	 */
	protected $convUTF;
	/**
	 * Pasta temporaria utilizada pelo mapserver
	 */
	public $dir_tmp;
	/**
	 * Pasta onde e feito o cache de imagens do i3Geo
	 */
	public $nomecache;
	/**
	 * Construtor
	 * Faz o include de conexao.php que por sua vez faz o include de i3geo/ms_configura.php
	*/
	function __construct(){
		error_reporting(0);
		include(dirname(__FILE__)."/conexao.php");
		//vem do include
		$this->dir_tmp = $dir_tmp;
		$this->locaplic = $locaplic;
		$this->base = $base;
		if(!isset($convUTF)){
			$convUTF = true;
		}
		$this->convUTF = $convUTF;
		$this->dbh = $dbh;
		$this->dbhw = $dbhw;
		$this->esquemaadmin = "";
		if(!empty($esquemaadmin)){
			$this->esquemaadmin = str_replace(".","",$esquemaadmin).".";
		}
		$this->nomecache = $this->nomeCache();
	}
	function __destruct(){
		$this->fechaConexao;
	}
	/**
	 * Cria um nome de arquivo concatenando $_request
	 * @return string
	 */
	function nomeCache(){
		return md5(implode("x",$_REQUEST));
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
		$this->dbhw = null;
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
		$buscar = array("drop","update","insert","delete");
		$sql = str_ireplace($buscar,"",$sql);
		try	{
			$q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
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
	 * Insere um registro em uma tabela do sistema de administracao
	 * Para efeitos de compatibilidade entre bancos de dados, ao inserir um registro e definido um valor aleatorio
	 * que e armazenado em uma das colunas. Esse valor e usado para recuperar o registro criado e assim
	 * permitir a obtencao de seu ID
	 * @param nome da tabela
	 * @param nome da coluna que recebera o valor temporario
	 * @param nome da coluna com os identificadores unicos
	 * @return id do registro criado
	 */
	function insertId($tabela,$colunatemp,$colunaid){
		$idtemp = (rand (9000,10000)) * -1;
		$this->dbhw->query("INSERT INTO ".$this->esquemaadmin.$tabela." ($colunatemp) VALUES ('$idtemp')");
		$id = $this->dbh->query("SELECT $colunaid FROM ".$this->esquemaadmin.$tabela." WHERE $colunatemp = '$idtemp'");
		$id = $id->fetchAll();
		$id = $id[0][$colunaid];
		$this->dbhw->query("UPDATE ".$this->esquemaadmin.$tabela." SET $colunatemp = '' WHERE $colunaid = $id AND $colunatemp = '$idtemp'");
		return $id;
	}
	/**
	 * Exclui um registro de uma tabela no banco de administracao
	 * @param tabela alvo
	 * @param coluna com os ids que identificam os registros
	 * @param id do registro que sera selecionado e excluido
	 */
	function excluirRegistro($tabela,$coluna,$id){
		$this->testaNumerico(array($id));
		try	{
			$this->dbhw->query("DELETE from ".$this->esquemaadmin.$tabela." WHERE $coluna = $id");
			return "ok";
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Exclui um registro da tabela de ligacao entre medida de variavel e fonte
	 * @paraam id da medida da variavel
	 * @param id da fonte
	 */
	function excluirFonteinfoMedida($id_medida_variavel,$id_fonteinfo){
		$this->testaNumerico(array($id_medida_variavel,$id_fonteinfo));
		try	{
			$this->dbhw->query("DELETE from ".$this->esquemaadmin."i3geoestat_fonteinfo_medida WHERE id_medida_variavel = $id_medida_variavel and id_fonteinfo = $id_fonteinfo");
			return "ok";
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Monta o sql que permite acessar os dados de uma media de uma variavel
	 * @param id da medida da variavel
	 * @param inclui todas as colunas da tabela com os dados ou nao
	 * @param coluna que sera usada para agrupar os dados
	 * @param tipo de layer. Usado para escolher qual coluna com as geometrias sera incluida no sql
	 * @param codigo do tipo de regiao. Se nao for definido, utiliza-se o default da variavel
	 * @return array("sqlagrupamento"=>,"sql"=>,"sqlmapserver"=>,"filtro"=>,"colunas"=>,"alias"=>,"colunavalor"=>,"titulo"=>,"nomeregiao"=>)
	 */
	function sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor="",$tipolayer="polygon",$codigo_tipo_regiao = "",$suportaWMST = false,$filtro = ""){
		/* Modelo de SQL
			SELECT regiao.*,sum(j.valorcalculado) OVER (PARTITION BY regiao.co_municipio) AS valorcalculado
			FROM i3geo_metaestat.municipios AS regiao
			INNER JOIN (
				SELECT regiao.co_municipio AS cod_regiao,sum(j.valorcalculado) AS valorcalculado
				FROM i3geo_metaestat.distritos_manaus AS regiao
				LEFT JOIN
				(
					SELECT regiao.cod_dis AS cod_regiao,sum(j.valorcalculado) AS valorcalculado
					FROM i3geo_metaestat.bairros_manaus AS regiao
					LEFT JOIN
					(
						SELECT cod AS cod_regiao,sum(valor) AS valorCalculado
						FROM i3geo_metaestat.obitos_maternos_manaus12
						WHERE ano IN ('2012') AND cod_mes IN ('1','2')
						GROUP BY cod_regiao
					)
					AS j ON j.cod_regiao = regiao.cod GROUP BY regiao.cod_dis
				)
				AS j ON j.cod_regiao = regiao.cod_dis GROUP BY regiao.co_municipio
			)
			AS j ON j.cod_regiao = regiao.co_municipio
		 */


		//
		//o sql que faz acesso aos dados e marcado com /*SE*//*SE*/ na string que sera usada nos mapfiles
		//a parte que contem referencias a coluna com a geometria e marcada com /*SG*//*SG*/
		//
		//registros da medida da variavel
		$dados = $this->listaMedidaVariavel("",$id_medida_variavel);

		if(!empty($dados["filtro"])){
			if($filtro == ""){
				$filtro = $dados["filtro"];
			}
			else{
				$filtro = $filtro." AND (".$dados["filtro"].")";
			}
		}

		//parametros da medida da variavel
		$parametrosMedida = array();
		$pp = $this->listaParametro($id_medida_variavel,"",0);
		foreach($pp as $p){
			$parametrosMedida[] = $p["coluna"];
		}

		//titulo da medida de variavel
		$titulo = $dados["nomemedida"];
		//indica se os dados devem ser agregados a uma regiao de nivel superior
		$agregaregiao = false;
		//nome da coluna que contem os limites geograficos da regiao desejada pelo usuario
		$colunageo = "";

		//se a regiao definida para a medida da variavel for diferente da regiao indicada pelo usuario
		//significa que a regiao indicada pelo usuario e uma agragacao
		if($codigo_tipo_regiao != "" && $dados["codigo_tipo_regiao"] != $codigo_tipo_regiao){
			$agregaregiao = true;
			//guarda os dados da regiao que agrega a regiao original da medida variavel
			$dadosgeo = $this->listaTipoRegiao($codigo_tipo_regiao);
		}
		else{
			$dadosgeo = $this->listaTipoRegiao($dados["codigo_tipo_regiao"]);
		}
		if($tipolayer != "point"){
			$colunageo = $dadosgeo["colunageo"];
			$titulo .= " (pol) ";
		}
		else{
			$colunageo = $dadosgeo["colunacentroide"];
			$titulo .= " (pt) ";
		}
		$titulo .= $dadosgeo["nome_tipo_regiao"];

		$vis = $dadosgeo["colunasvisiveis"];
		if(!empty($vis) && $suportaWMST == false){
			$vis = $vis.",".$dadosgeo["identificador"];
			$vis = str_replace(" ",",",$vis);
			$vis = str_replace(",,",",",$vis);
			$vis = str_replace(";",",",$vis);

			$colunasSemGeo = explode(",",$vis);
			$colunasSemGeo = array_unique($colunasSemGeo);

			if($dadosgeo["apelidos"] != ""){
				$alias = "Valor,".$dadosgeo["apelidos"].",".$dadosgeo["identificador"];
				$alias = mb_convert_encoding($alias,"ISO-8859-1",mb_detect_encoding($alias));
				$alias = str_replace(";",",",$alias);
				$alias = str_replace(",,",",",$alias);
				$alias = explode(",",$alias);
				$alias = array_unique($alias);
			}
			else{
				$alias = $colunasSemGeo;
			}
			if(count($alias)-1 != count($colunasSemGeo)){
				$alias = array();
			}
		}
		else{
			//colunas da tabela geometria sem as colunas GEOMETRY
			$colunasSemGeo = $this->colunasTabela($dadosgeo["codigo_estat_conexao"], $dadosgeo["esquemadb"], $dadosgeo["tabela"],"geometry","!=");
			$alias = array();
			if($suportaWMST == true){
				$sqlWMST = $this->listaParametroTempo2CampoData($id_medida_variavel);
				$colunasSemGeo[] = "dimtempo";
			}
		}
		//verifica o tipo de calculo para agragacao de valores
		$tipoconta = "";
		if($dados["permitesoma"] == 1){
			$tipoconta = "sum";
			if($agregaregiao == true){
				$titulo .= " - soma";
			}
		}
		elseif($dados["permitemedia"] == 1){
			$tipoconta = "avg";
			if($agregaregiao == true){
				$titulo .= " - media";
			}
		}

		//obtem o SQL que faz o acesso aos dados da media da variavel
		$sqlDadosMedidaVariavel = "SELECT ".$dados["colunaidgeo"]." AS cod_regiao,$tipoconta(".$dados["colunavalor"].") AS valorcalculado FROM ".$dados["esquemadb"].".".$dados["tabela"];
		if($suportaWMST == true){
			$sqlDadosMedidaVariavel = "SELECT $sqlWMST as dimtempo,".$dados["colunaidgeo"]." AS cod_regiao,".$dados["colunavalor"]." AS valorcalculado FROM ".$dados["esquemadb"].".".$dados["tabela"];
		}
		if(!empty ($filtro)){
			$sqlDadosMedidaVariavel .=	" WHERE ".$filtro;
		}
		if($suportaWMST != true){
			$sqlDadosMedidaVariavel .= " /*FA*//*FA*/ /*FAT*//*FAT*/ GROUP BY cod_regiao ";
		}
		$sqlagrupamento = "";
		//sql que retorna a lista de ocorrencias agrupados de uma coluna especifica
		if(!empty($agruparpor)){
			$sqlagrupamento = " SELECT $agruparpor FROM ".$dados["esquemadb"].".".$dados["tabela"];
			if(!empty ($filtro)){
				$sqlagrupamento .= " WHERE ".$filtro;
			}
			$sqlagrupamento .= " /*FA*//*FA*/ /*FAT*//*FAT*/ GROUP BY ".$agruparpor." ORDER BY ".$agruparpor;
		}
		//SQL para a primeira regiao __SQLDADOS__ ira conter os sqls dos niveis inferiores da regiao se ouver
		//@TODO verificar tipos das colunas no join para tornar mais rapida a juncao
		$sqlIntermediario = "SELECT (j.valorcalculado) AS ".$dados["colunavalor"].", __COLUNASSEMGEO__".
		" FROM ".$dadosgeo["esquemadb"].".".$dadosgeo["tabela"]." AS regiao ".
		" INNER JOIN ( __SQLDADOS__ ) ".
		" AS j ON j.cod_regiao::text = regiao.".$dadosgeo["identificador"]."::text";
		//inclui os sqls de regioes de niveis inferiores
		if($agregaregiao == true){
			$hierarquia = $this->regiaoFilhaAoPai($dados["codigo_tipo_regiao"],$codigo_tipo_regiao);
			$caminho = $hierarquia["caminho"];
			$dadosColunas = $hierarquia["colunas"];
			//var_dump($hierarquia);exit;
			if(count($caminho) > 0){
				$caminho = array_reverse($caminho);
				foreach($caminho as $idregiao){
					if($idregiao != $codigo_tipo_regiao){//a regiao pai ja esta no sql
						$tempDadosRegiao = $this->listaTipoRegiao($idregiao);
						$temp = "SELECT regiao.".$dadosColunas[$idregiao]["colunaligacao_regiaopai"]." AS cod_regiao,sum(j.valorcalculado) AS valorcalculado ".
						"FROM ".$tempDadosRegiao["esquemadb"].".".$tempDadosRegiao["tabela"]." AS regiao ".
						"INNER JOIN ".
						"( __SQLDADOS__ )".
						" AS j ON j.cod_regiao::text = regiao.".$tempDadosRegiao["identificador"]."::text GROUP BY regiao.".$dadosColunas[$idregiao]["colunaligacao_regiaopai"];
						$sqlIntermediario = str_replace("__SQLDADOS__",$temp,$sqlIntermediario);
					}
				}
			}
		}
		//sql final que retorna os dados
		//contem todas as colunas da tabela regiao, menos as que contem geometria
		$sql = 	str_replace("__SQLDADOS__",$sqlDadosMedidaVariavel,$sqlIntermediario);
		$sql = 	str_replace("__COLUNASSEMGEO__",implode(",",$colunasSemGeo),$sql);

		//sql para o mapserver
		$sqlgeo = 	str_replace("__SQLDADOS__",$sqlDadosMedidaVariavel,$sqlIntermediario);
		$colunasComGeo = $colunasSemGeo;
		//$colunasComGeo[] = "/*SG*/st_setsrid(".$colunageo.",".$dadosgeo["srid"].") as ".$colunageo." /*SG*/";
		$colunasComGeo[] = "/*SG*/".$colunageo." as ".$colunageo." /*SG*/";
		$sqlgeo = str_replace("__COLUNASSEMGEO__",implode(",",$colunasComGeo),$sqlgeo);
		$sqlgeo = $colunageo." from /*SE*/(".$sqlgeo.")/*SE*/ as foo using unique ".$dadosgeo["identificador"]." using srid=".$dadosgeo["srid"];

		//o SQL com os dados contem um filtro ou nao?
		$contemfiltro = false;
		if(!empty($filtro)){
			$contemfiltro = true;
			$titulo .= " ".$filtro;
		}
		//adiciona a coluna com os valores no inicio do array()
		$colunasSemGeo = array_merge(array($dados["colunavalor"]),$colunasSemGeo);
		$buscar = array("drop","update","insert","create","alter","delete");
		$sql = str_ireplace($buscar,"",$sql);
		$sqlagrupamento = str_ireplace($buscar,"",$sqlagrupamento);
		$sqlgeo = str_ireplace($buscar,"",$sqlgeo);
		return array(
			"nomeregiao"=>$dadosgeo["colunanomeregiao"],
			"titulo"=>$titulo,
			"colunavalor"=>$dados["colunavalor"],
			"sqlagrupamento"=>$sqlagrupamento,
			"sql"=>$sql,
			"sqlmapserver"=>$sqlgeo,
			"filtro"=>$contemfiltro,
			"colunas"=>$colunasSemGeo,
			"alias"=>$alias
		);
	}
	/**
	 * Retorna os ids das regioes que permitem partir de uma regiao filha chegar a uma regiao pai
	 * Usado para descobrir que regioes devem ser sequencialmente agregadas
	 * @param partir da regiao
	 * @param chegar na regiao
	 * @return array lista de ids de regioes sequenciais do filho ate chegar ao pai indicado
	 */
	function regiaoFilhaAoPai($codigo_tipo_regiao,$codigo_tipo_regiao_pai){
		//echo $codigo_tipo_regiao." ".$codigo_tipo_regiao_pai;
		$pais = $this->listaAgregaRegiao($codigo_tipo_regiao);
		$caminho = array($codigo_tipo_regiao);
		$colunas = array();
		if(count($pais) == 0){
			return $caminho;
		}
		$achou = false;
		foreach($pais as $pai){
			$caminho[] = $pai["codigo_tipo_regiao_pai"];
			$colunas[$pai["codigo_tipo_regiao"]] = $pai;
			if($pai["codigo_tipo_regiao_pai"] == $codigo_tipo_regiao_pai){
				$achou = true;
				return array("caminho"=>$caminho,"colunas"=>$colunas);
			}
			$testaPai = $this->regiaoFilhaAoPai($pai["codigo_tipo_regiao_pai"],$codigo_tipo_regiao_pai);
			if(count($testaPai) == 0){
				$caminho = array();
				$colunas = array();
			}
		}
	}
	/**
	 * Cria um arquivo mapfile para uma medida de variavel
	 * Inclui no arquivo o layer de acesso aos dados
	 * O mapfile contem apenas o layer
	 * O arquivo e armazenado em uma pasta temporaria
	 * O sql e obtido com o metodo sqlMedidaVariavel
	 * @param id da medida da variavel
	 * @param filtro que sera concatenado ao sql padrao da medida
	 * @param 0|1 indica se todas as colunas da tabela original dos dados sera incluida no sql
	 * @param tipo de layer
	 * @param titulo do layer
	 * @param id da classificacao cadastrada,se for vazio usa o primeiro
	 * @param coluna que sera usada como agrupamento no sql
	 * @param codigo do tipo de regiao cadastrada
	 * @param valor de opacidade do layer
	 * @return array("mapfile"=>,"layer"=>,"titulolayer"=>)
	 */
	function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor="",$codigo_tipo_regiao="",$opacidade="",$suportaWMST=false){
		//para permitir a inclusao de filtros, o fim do sql e marcado com /*FW*//*FW*/
		//indicando onde deve comecar e terminar uma possivel clausula where
		//ou com /*FA*//*FA*/
		//para marcar que deve ser utilizado AND ao adicionar o filtro
		//utiliza-se da mesma forma /*FAT*//*FAT*/ e /*FWT*//*FWT*/ para os filtros de tempo
		//Layers adicionados aqui sao marcados com o metadata METAESTAT "SIM"
		//O codigo_tipo_regiao e marcado com o metadata METAESTAT_CODIGO_TIPO_REGIAO
		//O id da medida da variavel e marcado com o metadata METAESTAT_ID_MEDIDA_VARIAVEL
		//outros metadados tambem sao utilizados, veja em admin/php/editormapfile.php
		$arq = $this->dir_tmp."/".$this->nomecache.".map";
		if(!file_exists($arq)){
			$meta = $this->listaMedidaVariavel("",$id_medida_variavel);
			//evita agregar regioes qd nao e necessario
			if($meta["codigo_tipo_regiao"] == $codigo_tipo_regiao || empty($codigo_tipo_regiao) ){
				$agruparpor = "";
			}
			$dconexao = $this->listaConexao($meta["codigo_estat_conexao"],true);
			$conexao = "user=".$dconexao["usuario"]." password=".$dconexao["senha"]." dbname=".$dconexao["bancodedados"]." host=".$dconexao["host"]." port=".$dconexao["porta"]."";
			$sql = $this->sqlMedidaVariavel(
					$id_medida_variavel,
					$todasascolunas,
					$agruparpor,
					$tipolayer,
					$codigo_tipo_regiao,
					$suportaWMST,
					$filtro
				);
			if(empty($codigo_tipo_regiao)){
				$d = $this->listaMedidaVariavel("",$id_medida_variavel);
				$codigo_tipo_regiao = $d["codigo_tipo_regiao"];
			}
			//define o tipo correto de layer
			$dg = $this->listaDadosGeometriaRegiao($codigo_tipo_regiao);
			if(empty($tipolayer)){
				$tipolayer = "polygon";
			}
			if($dg["dimension"] == 0){
				$tipolayer = "point";
			}
			if($dg["dimension"] == 1){
				$tipolayer = "line";
			}
			$sqlf = $sql["sqlmapserver"];

			$classes = "";
			if(!empty($id_classificacao)){
				$classes = $this->listaClasseClassificacao($id_classificacao);
			}
			else{
				$classificacoes = $this->listaClassificacaoMedida($id_medida_variavel);
				$classes = $this->listaClasseClassificacao($classificacoes[0]["id_classificacao"]);
			}
			if(!empty($titulolayer)){
				$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
			}
			else{
				$titulolayer = mb_convert_encoding($sql["titulo"],"ISO-8859-1",mb_detect_encoding($sql["titulo"]));
			}
			//necessario para evitar problemas com ITENSDESC
			$titulolayer = str_replace(","," ",$titulolayer);
			$titulolayer = str_replace("=",": ",$titulolayer);
			//pega os parametros caso seja um mapfile para WMS-time
			if($suportaWMST == true){
				$sqlMinMax = "select min(dimtempo) as min,max(dimtempo) as max from(".$sql["sql"].") as x";
				$minmaxdata = $this->execSQLDB($meta["codigo_estat_conexao"],$sqlMinMax );
				$fontemeta = $this->listaFonteinfoMedida($id_medida_variavel);
				if(count($fontemeta) > 0){
					$fontemeta = $fontemeta[0]["link"];
				}
				else{
					$fontemeta = "";
				}
			}
			$dados[] = "MAP";
			$dados[] = 'SYMBOLSET "'.$this->locaplic.'/symbols/simbolosv6.sym"';
			$dados[] = 'FONTSET   "'.$this->locaplic.'/symbols/fontes.txt"';
			//inclui os simbolos que podem ser definidos como imagens
			foreach($classes as $classe){
				if(file_exists($classe["simbolo"])){
					$dados[] = "SYMBOL";
					$dados[] = '	NAME "'.$classe["simbolo"].'"';
					$dados[] = '			TYPE pixmap';
					$dados[] = '	IMAGE "'.$classe["simbolo"].'"';
					$dados[] = "END";
				}
			}
			$dados[] = "LAYER";
			$dados[] = '	NAME "'.$this->nomecache.'"';
			$dados[] = "	TYPE $tipolayer";
			$dados[] = '	DATA "'.$sqlf.'"';
			$dados[] = '	CONNECTION "'.$conexao.'"';
			$dados[] = '	CONNECTIONTYPE POSTGIS';
			$dados[] = '	STATUS OFF';
			$dados[] = '	TEMPLATE "none.htm"';
			if($opacidade != ""){
				$dados[] = '	OPACITY '.$opacidade;
			}
			$dados[] = '	METADATA';
			$dados[] = '		TEMA "'.$titulolayer.'"';
			$dados[] = '		TIP "'.$sql["colunavalor"].','.$sql["nomeregiao"].'"';
			$dados[] = '		CLASSE "SIM"';
			$dados[] = '		permitedownload "SIM"';
			$dados[] = '		METAESTAT "SIM"';
			$dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
			$dados[] = '		METAESTAT_ID_MEDIDA_VARIAVEL "'.$id_medida_variavel.'"';
			//marca se a tabela e editavel, verificando se esta no esquema padrao
			if($meta["esquemadb"] == "i3geo_metaestat"){
				$dados[] = '		METAESTATEDITAVEL "SIM"';
			}
			if(count($sql["alias"]) > 0){
				$dados[] = '	ITENS "'.implode(",",$sql["colunas"]).'"';
				$dados[] = '	ITENSDESC "'.implode(",",$sql["alias"]).'"';
			}
			if($suportaWMST == true){
				$dados[] = '	"wms_timeitem"	"dimtempo"';
				$dados[] = '	"wms_timeextent" "'.$minmaxdata[0]["min"]."/".$minmaxdata[0]["max"].'"';
				$dados[] = '	"wms_timedefault" "'.$minmaxdata[0]["max"].'"';
				$dados[] = '	"ows_metadataurl_href" "'.$fontemeta.'"';
				$dados[] = ' 	"ows_metadataurl_type" "TC211" ';
				$dados[] = '	"ows_metadataurl_format" "text/html" ';
			}
			$dados[] = '	END';
			if($classes == ""){
				$dados[] = '    CLASS';
				$dados[] = '        NAME ""';
				$dados[] = '        STYLE';
				$dados[] = '        	COLOR 200 0 0';
				if(strtolower($tipolayer) == "point"){
					$dados[] = '        SYMBOL "ponto"';
					$dados[] = '        SIZE 5';
				}
				$dados[] = '        END';
				$dados[] = '    END';
			}
			else{
				foreach($classes as $classe){
					//var_dump($classe);exit;
					$dados[] = '    CLASS';
					$dados[] = '        NAME "'.mb_convert_encoding($classe["titulo"],"ISO-8859-1",mb_detect_encoding($classe["titulo"])).'"';
					if($classe["expressao"] != ""){
						$expressao = str_replace('"',"'",$classe["expressao"]);
						$dados[] = "        EXPRESSION ".$expressao;
					}
					$dados[] = '        STYLE';
					$dados[] = '        	COLOR '.$classe["vermelho"].' '.$classe["verde"].' '.$classe["azul"];
					if(!empty($classe["tamanho"])){
						$dados[] = '        SIZE '.$classe["tamanho"];
					}
					elseif(strtolower($tipolayer) == "point"){
						$dados[] = '        SIZE 5';
					}
					if(!empty($classe["simbolo"])){
						$dados[] = '        SYMBOL '.$classe["simbolo"];
					}
					elseif(strtolower($tipolayer) == "point"){
						$dados[] = '        SYMBOL ponto';
					}
					if(!empty($classe["otamanho"])){
						$dados[] = '        OUTLINEWIDTH '.$classe["otamanho"];
					}
					if(!empty($classe["overmelho"]) || $classe["overmelho"] == "0"){
						$dados[] = '        OUTLINECOLOR '.$classe["overmelho"].' '.$classe["overde"].' '.$classe["oazul"];
					}
					$dados[] = '        END';
					$dados[] = '    END';
				}
			}
			$dados[] = "END";
			$dados[] = "END";
			$fp = fopen($arq,"w");
			foreach ($dados as $dado){
				fwrite($fp,$dado."\n");
			}
		}
		return array("mapfile"=>$arq,"layer"=>$this->nomecache,"titulolayer"=>$titulolayer);
	}
	/**
	 * Cria um mapfile para visualizacao de regioes
	 * Inclui no arquivo o layer de acesso aos dados
	 * O mapfile contem apenas o layer
	 * O arquivo e armazenado em uma pasta temporaria
	 * Se o arquivo para a mesma regiao ja existir, tenta usa-lo ao inves de criar um novo
	 * @param codigo da regiao
	 * @param cor do outline do simbolo de desenho
	 * @param largura do simbolo
	 * @param sim|nao inclui ou nao os labels
	 * @param boolean remove o arquivo em cache e cria um novo
	 * @return array("mapfile"=>,"layer"=>,"titulolayer"=>,"codigo_tipo_regiao"=>)
	 */
	function mapfileTipoRegiao($codigo_tipo_regiao,$outlinecolor="255,0,0",$width=1,$nomes="nao",$forcaArquivo=false){
		//para permitir a inclusao de filtros, o fim do sql e marcado com /*FW*//*FW*/
		//indicando onde deve comecar e terminar uma possivel clausula where
		//Layers adicionados aqui sao marcados com o metadata METAESTAT "SIM"
		//O codigo_tipo_regiao e marcado com o metadata METAESTAT_CODIGO_TIPO_REGIAO
		if($forcaArquivo == false){
			$arq = $this->dir_tmp."/".$this->nomecache.".map";
		}
		else{
			$arq = $this->dir_tmp."/".$this->nomecache.nomeRandomico(3).".map";
		}
		if(!file_exists($arq)){
			$tipolayer = "polygon";
			//define o tipo correto de layer
			$dg = $this->listaDadosGeometriaRegiao($codigo_tipo_regiao);
			if(empty($tipolayer)){
				$tipolayer = "polygon";
			}
			if($dg["dimension"] == 0){
				$tipolayer = "point";
			}
			if($dg["dimension"] == 1){
				$tipolayer = "line";
			}
			$meta = $this->listaTipoRegiao($codigo_tipo_regiao);
			$titulolayer = $meta["nome_tipo_regiao"];
			$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
			$conexao = $this->listaConexao($meta["codigo_estat_conexao"],true);
			$conexao = "user=".$conexao["usuario"]." password=".$conexao["senha"]." dbname=".$conexao["bancodedados"]." host=".$conexao["host"]." port=".$conexao["porta"]."";
			$colunageo = $meta["colunageo"];
			$srid = $meta["srid"];
			//st_setsrid(".$colunageo.",".$srid.") as ".$colunageo
			$vis = $meta["colunasvisiveis"];
			if($vis == ""){
				$vis = $meta["colunanomeregiao"];
			}
			$vis = str_replace(";",",",$vis);
			$vis = str_replace(",,",",",$vis);
			$vis = explode(",",$vis);
			$itens = $vis;//array
			$vis[] = "gid";
			$vis = array_unique($vis);
			$visiveis = array();
			//verifica se as colunas existem mesmo
			$colunastabela = $this->colunasTabela($meta["codigo_estat_conexao"],$meta["esquemadb"],$meta["tabela"]);
			foreach($vis as $v){
				if(in_array($v,$colunastabela)){
					$visiveis[] = $v;
				}
			}
			$vis = implode(",",$visiveis);
			//apelidos
			$apelidos = $meta["apelidos"];
			if($apelidos == ""){
				$apelidos = "Nome";
			}
			$apelidos = str_replace(";",",",$apelidos);
			$apelidos = str_replace(",,",",",$apelidos);
			$apelidos = mb_convert_encoding($apelidos,"ISO-8859-1",mb_detect_encoding($apelidos));
			$apelidos = explode(",",$apelidos);
			$apelidos = array_unique($apelidos);

			$sqlf = $meta["colunageo"]." from (select st_setsrid(".$colunageo.",".$srid.") as $colunageo,$vis from ".$meta["esquemadb"].".".$meta["tabela"]." /*FW*//*FW*/) as foo using unique gid using srid=".$srid;
			$sqlf = str_replace(",,",",",$sqlf);
			$outlinecolor = str_replace(","," ",$outlinecolor);
			$dados[] = "MAP";
			$dados[] = 'SYMBOLSET "'.$this->locaplic.'/symbols/simbolosv6.sym"';
			$dados[] = 'FONTSET   "'.$this->locaplic.'/symbols/fontes.txt"';
			$dados[] = "LAYER";
			$dados[] = '	NAME "'.$this->nomecache.'"';
			$dados[] = "	TYPE $tipolayer";
			$dados[] = '	DATA "'.$sqlf.'"';
			$dados[] = '	CONNECTION "'.$conexao.'"';
			$dados[] = '	CONNECTIONTYPE POSTGIS';
			$dados[] = '	TEMPLATE "none.htm"';
			$dados[] = '	STATUS OFF';
			$dados[] = '	METADATA';
			$dados[] = '		TEMA "'.$titulolayer.'"';
			$dados[] = '		CLASSE "SIM"';
			$dados[] = '		METAESTAT "SIM"';
			$dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
			if($meta["esquemadb"] == "i3geo_metaestat"){
				$dados[] = '		METAESTATEDITAVEL "SIM"';
			}
			$dados[] = '		TIP "'.$meta["colunanomeregiao"].'"';
			if(count($itens) == count($apelidos)){
				$dados[] = '		ITENS "'.implode(",",$itens).'"';
				$dados[] = '		ITENSDESC "'.implode(",",$apelidos).'"';
			}

			$dados[] = '	END';
			$dados[] = '    CLASS';
			$dados[] = '        NAME ""';
			$dados[] = '        STYLE';
			$dados[] = '        	OUTLINECOLOR '.$outlinecolor;

			$dados[] = '        	WIDTH '.$width;
			if(strtolower($tipolayer) == "point"){
				$dados[] = '        SYMBOL "ponto"';
				$dados[] = '        SIZE 5';
				$dados[] = '        COLOR 0 0 0 ';
			}
			else{
				$dados[] = '        	COLOR -1 -1 -1';
			}
			$dados[] = '        END';
			//$dados[] = '        STYLE';
			//$dados[] = '        	OUTLINECOLOR -1 -1 -1';
			//$dados[] = '        	COLOR 255 255 255';
			//$dados[] = '        	OPACITY 20';
			//$dados[] = '        END';
			$dados[] = '    END';
			$dados[] = "END";
			//toponimia
			if($nomes == "sim"){
				$dados[] = "LAYER";
				$dados[] = '	NAME "'.$this->nomecache.'_anno"';
				$dados[] = "	TYPE ANNOTATION";
				$dados[] = '	DATA "'.$sqlf.'"';
				$dados[] = '	CONNECTION "'.$conexao.'"';
				$dados[] = '	CONNECTIONTYPE POSTGIS';
				$dados[] = '	TEMPLATE "none.htm"';
				$dados[] = '	STATUS OFF';
				$dados[] = '    LABELITEM "'.$meta["colunanomeregiao"].'"';
				$dados[] = '	METADATA';
				$dados[] = '		TEMA "'.$titulolayer.' (nomes)"';
				$dados[] = '		CLASSE "SIM"';
				$dados[] = '		METAESTAT "SIM"';
				$dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
				$dados[] = '	END';
				$dados[] = '    CLASS';
				$dados[] = '        NAME ""';
				$dados[] = '        LABEL';
				$dados[] = '           FONT "arial"';
				$dados[] = '           SIZE 10';
				$dados[] = '           COLOR 0 0 0';
				$dados[] = '           MINDISTANCE 0';
				$dados[] = '           MINFEATURESIZE 0';
				$dados[] = '           OFFSET 0 0';
				$dados[] = '           OUTLINECOLOR 255 255 255';
				$dados[] = '           PARTIALS FALSE';
				$dados[] = '           POSITION AUTO';
				$dados[] = '           SHADOWSIZE 1 1';
				$dados[] = '           TYPE TRUETYPE';
				$dados[] = '        END';
				$dados[] = '    END';
				$dados[] = "END";
			}
			$dados[] = "END";
			$fp = fopen($arq,"w");
			foreach ($dados as $dado){
				fwrite($fp,$dado."\n");
			}
		}
		return array("mapfile"=>$arq,"layer"=>$this->nomecache,"titulolayer"=>$titulolayer,"codigo_tipo_regiao"=>$codigo_tipo_regiao);
	}
	/**
	 * Complementa um mapfile resumido inserindo seus layers em um mapfile completo, contendo todos os elementos necessarios para uso
	 * Usado na geracao de WMS e outros servicos
	 * @param mapfile resumido
	 * @return nome do arquivo com o mapfile completo
	 */
	function mapfileCompleto($mapfile){
		$f = $this->base;
		if($f == ""){
			include_once($this->locaplic."/classesphp/funcoes_gerais.php");
			$versao = versao();
			$versao = $versao["principal"];
			$f = "";
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
				$f = $this->locaplic."/aplicmap/geral1windowsv".$versao.".map";
			}
			else{
				if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
					$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
				}
				if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
				}
				if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
				}
				if($f == "")				{
					$f = $this->locaplic."/aplicmap/geral1v".$versao.".map";
				}
			}
		}
		$mapa = ms_newMapObj($f);
		$n = $mapa->numlayers;
		for($i=0;$i<$n;$i++){
			$l = $mapa->getlayer($i);
			$l->set("status",MS_DELETE);
		}
		$mapatemp = ms_newMapObj($mapfile);
		$l = $mapatemp->getlayer(0);

		$l->set("status",MS_DEFAULT);
		$novonome = str_replace(".map","completo.map",$mapfile);
		//necessario para o kml
		$mapa->setmetadata("ows_enable_request","*");
		$listaepsg = "EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
		$l->setmetadata("ows_srs",$listaepsg);
		$temp = ms_newLayerObj($mapa,$l);
		$mapa->save($novonome);
		return $novonome;
	}
	/**
	 * Obtem os dados de uma medida de variavel
	 * @param id da medida
	 * @param filtro que sera concatenado ao sql
	 * @param 0|1 mostra ou nao todas as colunas da tabela com os dados
	 * @param coluna de agrupamento
	 * @param limite do numero de registros
	 * @return execSQL
	 */
	function dadosMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$agruparpor = "",$limite=""){
		set_time_limit(0);
		$sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor,"polygon","",false,$filtro);
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
	 * @return array("colunavalor"=>,"soma"=>,"media"=>,"menor"=>,"maior"=>,"quantidade"=>,"histograma"=>,"grupos"=>,"unidademedida"=>,"quartis"=>)
	 */
	function sumarioMedidaVariavel($id_medida_variavel,$filtro="",$agruparpor="",$limite=""){
		if(!empty($agruparpor)){
			$dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,1,"",$limite);
		}
		else{
			$dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,0,"",$limite);
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
						"quartis"=>$quartis
					);
		}
		return false;
	}
	/**
	 * Altera um mapa cadastrado ou adiciona um novo
	 * Mapas sao armazenados na tabela i3geoestat_mapa
	 * Mapas contem grupos e grupos contem temas
	 * Se o id for vazio, cria um novo mapa
	 * @param id do mapa
	 * @param titulo do mapa
	 * @param string logotipo 1
	 * @param string logotipo 2
	 * @param publicado ou nao
	 * @return id do mapa
	 */
	function alteraMapa($id_mapa="",$titulo="",$template="",$logoesquerdo="",$logodireito="",$publicado=""){
		try	{
			if($this->convUTF){
				$titulo = utf8_encode($titulo);
			}
			if($id_mapa != ""){
				$this->testaNumerico(array($id_mapa));
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_mapa SET titulo='$titulo',template='$template',logoesquerdo='$logoesquerdo',logodireito='$logodireito',publicado='$publicado' WHERE id_mapa = $id_mapa");
				$retorna = $id_mapa;
			}
			else{
				$retorna = $this->insertId("i3geoestat_mapa","titulo","id_mapa");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Altera um grupo de um mapa ou adiciona um novo
	 * Se o id do grupo for vazio, cria um novo
	 * Grupo contem temas
	 * @param id do mapa que contem o grupo
	 * @param id do grupo
	 * @param titulo
	 * @return id do grupo
	 */
	function alteraMapaGrupo($id_mapa,$id_mapa_grupo="",$titulo=""){
		$this->testaNumerico(array($id_mapa,$id_mapa_grupo));
		try	{
			if($this->convUTF){
				$titulo = utf8_encode($titulo);
			}
			if($id_mapa_grupo != ""){
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_mapa_grupo SET titulo='$titulo' WHERE id_mapa_grupo = $id_mapa_grupo");
				$retorna = $id_mapa_grupo;
			}
			else{
				$retorna = $this->insertId("i3geoestat_mapa_grupo","titulo","id_mapa_grupo");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_mapa_grupo SET id_mapa = $id_mapa WHERE id_mapa_grupo = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Altera um tema de um grupo de um mapa ou adiciona um novo
	 * Se o id do tema for vazio, cria um novo
	 * @param id do grupo
	 * @param id do tema
	 * @param titulo do tema
	 * @param id da medida da variavel vinculada ao tema
	 * @return id do tema
	 */
	function alteraMapaTema($id_mapa_grupo,$id_mapa_tema="",$titulo="",$id_medida_variavel=""){
		$this->testaNumerico(array($id_mapa_grupo,$id_mapa_tema,$id_medida_variavel));
		try	{
			if($this->convUTF){
				$titulo = utf8_encode($titulo);
			}
			if($id_mapa_tema != ""){
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_mapa_tema SET titulo='$titulo',id_medida_variavel='$id_medida_variavel' WHERE id_mapa_tema = $id_mapa_tema");
				$retorna = $id_mapa_tema;
			}
			else{
				$retorna = $this->insertId("i3geoestat_mapa_tema","titulo","id_mapa_tema");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_mapa_tema SET id_mapa_grupo = $id_mapa_grupo WHERE id_mapa_tema = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Altera uma variavel ou cria uma nova
	 * Variaveis contem medidas de variavel
	 * Se o codigo for vazio, cria uma nova
	 * @param codigo da variavel
	 * @param nome da variavel
	 * @param descricao
	 * @return id da variavel
	 */
	function alteraVariavel($codigo_variavel="",$nome="",$descricao=""){
		$this->testaNumerico(array($codigo_variavel));
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
	/**
	 * Altera uma medida de uma variavel ou cria uma nova
	 * Medidas contem links, fontes, parametros e classificacoes
	 * Se id for vazio, cria uma nova
	 * @param codigo da variavel pai
	 * @param id da medida da variavel
	 * @param codigo da unidade de medida utilizada
	 * @param codigo do tipo de periodo
	 * @param codigo do tipo de regiao
	 * @param codigo da conexao que acessa o banco onde estao os dados
	 * @param nome do esquema no banco de daods
	 * @param nome da tabela
	 * @param coluna que armazena os valores da medida
	 * @param nome da coluna com os identificadores de regiao
	 * @param coluna que identifica de forma unica cada registro da medida em sua tabela de valores
	 * @param filtro (sql) que otem os registros da medida na tabela com os valores
	 * @param nome da medida
	 * @return id da medida
	*/
	function alteraMedidaVariavel($codigo_variavel,$id_medida_variavel="",$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$colunaidunico,$filtro,$nomemedida){
		$this->testaNumerico(array($codigo_variavel,$id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao));
		try	{
			if($id_medida_variavel != ""){
				if($this->convUTF){
					$nomemedida = utf8_encode($nomemedida);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel SET codigo_unidade_medida = '$codigo_unidade_medida',codigo_tipo_periodo = '$codigo_tipo_periodo',codigo_tipo_regiao = '$codigo_tipo_regiao',codigo_estat_conexao = '$codigo_estat_conexao',esquemadb = '$esquemadb',tabela = '$tabela',colunavalor = '$colunavalor',colunaidgeo = '$colunaidgeo',colunaidunico = '$colunaidunico' ,filtro = '".$filtro."',nomemedida = '$nomemedida' WHERE id_medida_variavel = $id_medida_variavel");
				$retorna = $id_medida_variavel;
			}
			else{
				$retorna = $this->insertId("i3geoestat_medida_variavel","nomemedida","id_medida_variavel");
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel SET codigo_variavel = $codigo_variavel WHERE id_medida_variavel = $retorna";exit;
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
	/**
	 * Cria ou altera um link vinculado a uma medida
	 * Links nao sao compartilhados entre medidas
	 * @param id da medida de variavel
	 * @param id do link
	 * @param nome do link
	 * @param url do link
	 * @return id do link
	 */
	function alteraLinkMedida($id_medida_variavel,$id_link="",$nome,$link){
		$this->testaNumerico(array($id_medida_variavel,$id_link));
		try	{
			if($id_link != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel_link SET nome='$nome',link='$link' WHERE id_link = $id_link");
				$retorna = $id_link;
			}
			else{
				$retorna = $this->insertId("i3geoestat_medida_variavel_link","link","id_link");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel_link SET id_medida_variavel = $id_medida_variavel WHERE id_link = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou altera uma fonte
	 * Fontes sao usadas para documentar medidas
	 * Fontes podem ser compartilhadas entre medidas
	 * @param id da fonte
	 * @param titulo
	 * @param url
	 * @return id da fonte
	 */
	function alteraFonteinfo($id_fonteinfo="",$titulo,$link){
		$this->testaNumerico(array($id_fonteinfo));
		try	{
			if($id_fonteinfo != ""){
				if($this->convUTF){
					$titulo = utf8_encode($titulo);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_fonteinfo SET titulo='$titulo',link='$link' WHERE id_fonteinfo = $id_fonteinfo");
				$retorna = $id_fonteinfo;
			}
			else{
				$retorna = $this->insertId("i3geoestat_fonteinfo","link","id_fonteinfo");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Vincula o registro de uma fonte a uma medida
	 * @param id da medida
	 * @param id da fonte
	 */
	function adicinaFonteinfoMedida($id_medida_variavel,$id_fonteinfo){
		//echo "INSERT INTO ".$this->esquemaadmin."i3geoestat_fonteinfo_medida (id_medida_variavel,id_fonteinfo) VALUES ('$id_medida_variavel','$id_fonteinfo')";exit;
		$this->testaNumerico(array($id_medida_variavel,$id_fonteinfo));
		$this->dbhw->query("INSERT INTO ".$this->esquemaadmin."i3geoestat_fonteinfo_medida (id_medida_variavel,id_fonteinfo) VALUES ('$id_medida_variavel','$id_fonteinfo')");
	}
	/**
	 * Cria ou modifica uma unidade de medida
	 * Unidade de medida e uma tabela controlada de tipos de unidades
	 * Uma variavel possui obrigatoriamente uma unidade de medida
	 * @param codigo da unidade de medida
	 * @param nome
	 * @param sigla
	 * @param permite somar seus valores
	 * @param permite calcular a media
	 * @return id da unidade
	 */
	function alteraUnidadeMedida($codigo_unidade_medida,$nome,$sigla,$permitesoma,$permitemedia){
		$this->testaNumerico(array($codigo_unidade_medida));
		try	{
			if($codigo_unidade_medida != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_unidade_medida SET nome = '$nome', sigla = '$sigla', permitesoma = '$permitesoma', permitemedia = '$permitemedia' WHERE codigo_unidade_medida = $codigo_unidade_medida");
				$retorna = $codigo_unidade_medida;
			}
			else{
				$retorna = $this->insertId("i3geoestat_unidade_medida","nome","codigo_unidade_medida");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou modifica um tipo de periodo de tempo
	 * Periodo e uma tabela controlada usada nas medidas de variavel
	 * @param codigo do tipo de periodo
	 * @param nome
	 * @param descricao
	 * @return codigo do tipo de periodo
	 */
	function alteraTipoPeriodo($codigo_tipo_periodo,$nome,$descricao){
		$this->testaNumerico(array($codigo_tipo_periodo));
		try	{
			if($codigo_tipo_periodo != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
					$descricao = utf8_encode($descricao);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_tipo_periodo SET nome = '$nome', descricao = '$descricao' WHERE codigo_tipo_periodo = $codigo_tipo_periodo";exit;
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_tipo_periodo SET nome = '$nome', descricao = '$descricao' WHERE codigo_tipo_periodo = $codigo_tipo_periodo");
				$retorna = $codigo_tipo_periodo;
			}
			else{
				$retorna = $this->insertId("i3geoestat_tipo_periodo","nome","codigo_tipo_periodo");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou modifica uma conexao
	 * Conexoes sao parametros necessarios para realizar o acesso a um banco de dados
	 * A senha deve ser cadastrada manualmente
	 * @param codigo da conexao
	 * @param banco de dados
	 * @param hostname
	 * @param porta
	 * @param usuario
	 * @return id da conexao
	 */
	function alteraConexao($codigo_estat_conexao,$bancodedados,$host,$porta,$usuario){
		$this->testaNumerico(array($codigo_estat_conexao));
		try	{
			if($codigo_estat_conexao != ""){
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_conexao SET usuario = '$usuario',porta = '$porta',host = '$host',bancodedados = '$bancodedados' WHERE codigo_estat_conexao = $codigo_estat_conexao");
				$retorna = $codigo_estat_conexao;
			}
			else{
				$retorna = $this->insertId("i3geoestat_conexao","bancodedados","codigo_estat_conexao");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou altera um tipo de regiao
	 * Regioes sao tipos de localizacao geografica que permite espacializar os dados estatisticos
	 * Possuem uma coluna com as geometrias de cada localizacao e um identificador unico
	 * Regioes podem ter relacionamentos entre si que permitem realizar agregacoes de dados estatisticos por meio de soma ou media dos valores
	 * A hierarquia e registrada por meio das tabelas de agregacao que indicam a relacao pai-filho
	 * @param codigo unico da regiao
	 * @param nome do tipo de regiao
	 * @param descricao
	 * @param esquema do banco de dados onde fica a tabela com os dados que compoe a regiao
	 * @param tabela com os dados
	 * @param coluna com as geometrias
	 * @param coluna com o centroide
	 * @param data dos dados
	 * @param coluna que identifica de forma unica cada localizacao
	 * @param coluna que contem os nomes de cada localizacao
	 * @param codigo srid indicando a projecao dos dados
	 * @param codigo da conexao com o banco de dados
	 * @param lista de colunas que devem ser incluidas quando a regiao e mostrada no mapa
	 * @param apelidos das colunas visiveis
	 * @return id da regiao
	 */
	function alteraTipoRegiao($codigo_tipo_regiao,$nome_tipo_regiao,$descricao_tipo_regiao,$esquemadb,$tabela,$colunageo,$colunacentroide,$data,$identificador,$colunanomeregiao,$srid,$codigo_estat_conexao,$colunasvisiveis,$apelidos){
		$this->testaNumerico(array($codigo_tipo_regiao,$codigo_estat_conexao));
		try	{
			if($codigo_tipo_regiao != ""){
				if($this->convUTF){
					$nome_tipo_regiao = utf8_encode($nome_tipo_regiao);
					$descricao_tipo_regiao = utf8_encode($descricao_tipo_regiao);
					$apelidos = utf8_encode($apelidos);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_tipo_regiao SET codigo_estat_conexao = '$codigo_estat_conexao', colunacentroide = '$colunacentroide',nome_tipo_regiao = '$nome_tipo_regiao',descricao_tipo_regiao = '$descricao_tipo_regiao',esquemadb = '$esquemadb',tabela = '$tabela',colunageo = '$colunageo',data = '$data',identificador = '$identificador',colunanomeregiao = '$colunanomeregiao', srid = '$srid', colunasvisiveis = '$colunasvisiveis', apelidos = '$apelidos' WHERE codigo_tipo_regiao = $codigo_tipo_regiao";exit;
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_tipo_regiao SET codigo_estat_conexao = '$codigo_estat_conexao', colunacentroide = '$colunacentroide',nome_tipo_regiao = '$nome_tipo_regiao',descricao_tipo_regiao = '$descricao_tipo_regiao',esquemadb = '$esquemadb',tabela = '$tabela',colunageo = '$colunageo',data = '$data',identificador = '$identificador',colunanomeregiao = '$colunanomeregiao', srid = '$srid', colunasvisiveis = '$colunasvisiveis', apelidos = '$apelidos' WHERE codigo_tipo_regiao = $codigo_tipo_regiao");
				$retorna = $codigo_tipo_regiao;
			}
			else{
				$retorna = $this->insertId("i3geoestat_tipo_regiao","nome_tipo_regiao","codigo_tipo_regiao");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou altera o registro de uma agregacao de regiao
	 * Agregacoes indica a relacao de pai-filho entre tipos de regiao
	 * @param codigo do tipo de regiao
	 * @param id que identifica a agregacao
	 * @param codigo do tipo de regiao pai
	 * @param nome da coluna que faz a ligacao com a tabela da regiao pai
	 * @return id
	 */
	function alteraAgregaRegiao($codigo_tipo_regiao,$id_agregaregiao="",$codigo_tipo_regiao_pai="",$colunaligacao_regiaopai=""){
		$this->testaNumerico(array($codigo_tipo_regiao,$id_agregaregiao,$codigo_tipo_regiao_pai));
		try	{
			if($id_agregaregiao != ""){
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_agregaregiao SET colunaligacao_regiaopai = '$colunaligacao_regiaopai', codigo_tipo_regiao_pai = '$codigo_tipo_regiao_pai' WHERE id_agregaregiao = $id_agregaregiao");
				$retorna = $id_agregaregiao;
			}
			else{
				$retorna = $this->insertId("i3geoestat_agregaregiao","colunaligacao_regiaopai","id_agregaregiao");
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_agregaregiao SET codigo_tipo_regiao = '$codigo_tipo_regiao' WHERE id_agregaregiao = $retorna");
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou altera um parametro de uma medida de variavel
	 * Parametros permitem caracterizar os dados, por exemplo, um ano, mes e dia
	 * Parametros podem ter uma hierarquia
	 * @param id da medida da variavel
	 * @param id do parametro
	 * @param nome do parametro
	 * @param descricao
	 * @param nome da coluna na tabela que armazena os valores do parametro
	 * @param i do parametro pai do atual
	 * @param tipo de parametro. Utilizado para parametros que indicam tempo sendo 0=ano,1=mes,2=dia,3=hora
	 * @return id do parametro
	 */
	function alteraParametroMedida($id_medida_variavel,$id_parametro_medida="",$nome,$descricao,$coluna,$id_pai,$tipo="0"){
		$this->testaNumerico(array($id_medida_variavel,$id_parametro_medida,$id_pai));
		try	{
			if($id_parametro_medida != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
					$descricao = utf8_encode($descricao);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_parametro_medida SET nome = '$nome',descricao = '$descricao',coluna = '$coluna',id_pai = '$id_pai', tipo = '$tipo' WHERE id_parametro_medida = $id_parametro_medida";exit;
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_parametro_medida SET nome = '$nome',descricao = '$descricao',coluna = '$coluna',id_pai = '$id_pai', tipo = '$tipo' WHERE id_parametro_medida = $id_parametro_medida");
				$retorna = $id_parametro_medida;
			}
			else{
				$retorna = $this->insertId("i3geoestat_parametro_medida","nome","id_parametro_medida");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_parametro_medida SET id_medida_variavel = $id_medida_variavel WHERE id_parametro_medida = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/*
	 * Cria ou altera uma classificacao de uma medida
	 * Classificacoes possuem classes que definem os intervalos e simbologia
	 * Uma medida pode ter varias classificacoes
	 * @param id da medida de variavel
	 * @param id da classificacao
	 * @param nome
	 * @param observacao
	 * @return id
	 */
	function alteraClassificacaoMedida($id_medida_variavel,$id_classificacao="",$nome="",$observacao=""){
		$this->testaNumerico(array($id_medida_variavel,$id_classificacao));
		try	{
			if($id_classificacao != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
					$observacao = utf8_encode($observacao);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_classificacao SET observacao = '$observacao',nome = '$nome' WHERE id_classificacao = $id_classificacao");
				$retorna = $id_parametro_medida;
			}
			else{
				$retorna = $this->insertId("i3geoestat_classificacao","nome","id_classificacao");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_classificacao SET id_medida_variavel = $id_medida_variavel WHERE id_classificacao = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/**
	 * Cria ou altera uma classe de uma classificacao
	 * @param id da classificacao
	 * @param id da classe
	 * @param titulo da classe
	 * @param expressao de selecao (no padrao mapfile)
	 * @param componente vermelho da cor da classe
	 * @param verde
	 * @param azul
	 * @param tamanho do simbolo
	 * @param componente vermelho da cor do outline da classe
	 * @param verde
	 * @param azul
	 * @param tamanho do outline (expessura)
	 * @return id
	 */
	function alteraClasseClassificacao($id_classificacao,$id_classe="",$titulo="",$expressao="",$vermelho="",$verde="",$azul="",$tamanho="",$simbolo="",$overmelho="",$overde="",$oazul="",$otamanho=""){
		if(!empty($expressao)){
			$expressao = str_replace("\\",'',$expressao);
			$expressao = str_replace("''",'',$expressao);
			$expressao = str_replace("##","'",$expressao);
		}

		$this->testaNumerico(array($id_classificacao,$id_classe));
		try	{
			if($id_classe != ""){
				if($this->convUTF){
					$titulo = utf8_encode($titulo);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_classe SET azul = '$azul', verde = '$verde', vermelho = '$vermelho',expressao = '$expressao', titulo = '$titulo' WHERE id_classe = $id_classe";exit;
				//o sinal de | e substituido por < para compatibilizar pois o contrario e feito no lado do cliente
				//essa troca e feita para evitar um erro na passagem de parametro, que remove o <
				$expressao = str_replace("|","<",$expressao);
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_classes SET tamanho='$tamanho',simbolo='$simbolo',overmelho='$overmelho',overde='$overde',oazul='$oazul',otamanho='$otamanho',azul = '$azul', verde = '$verde', vermelho = '$vermelho',".'expressao = "'.$expressao.'"'.", titulo = '$titulo' WHERE id_classe = $id_classe");
				$retorna = $id_classe;
			}
			else{
				$retorna = $this->insertId("i3geoestat_classes","titulo","id_classe");
				if($retorna){
					$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_classes SET id_classificacao = $id_classificacao WHERE id_classe = $retorna");
				}
			}
			return $retorna;
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
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
	 * Lista os dads de uma conexao ou de todas
	 * @param id da conexao
	 * @param boolean inclui na lista a senha ou nao
	 */
	function listaConexao($codigo_estat_conexao="",$senha=false){
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
		return $this->execSQL($sql,$codigo_estat_conexao);
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
			/**
			 * @TODO falta a hora
			 */
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
		else{
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
	 * Lista os dados de agregacao de uma regiao pai
	 * @param codigo da regiao
	 */
	function listaHierarquiaRegioes($codigoregiaopai=""){
		$sql = "select i3geoestat_agregaregiao.colunaligacao_regiaopai,i3geoestat_tipo_regiao.codigo_tipo_regiao,i3geoestat_tipo_regiao.nome_tipo_regiao from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
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
	function listaAgregaRegiao($codigo_tipo_regiao,$id_agregaregiao=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao ";
		if($id_agregaregiao != ""){
			$sql .= "WHERE id_agregaregiao = $id_agregaregiao ";
		}
		else{
			$sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao";
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
		$sql .= "AND codigo_tipo_regiao = $codigo_tipo_regiao";
		return $this->execSQL($sql,$codigo_tipo_regiao_pai);
	}
	/**
	 * Lista os esquemas em um banco de dados
	 * @param codigo da conexao
	 * @return execSQLDB
	 */
	function esquemasConexao($codigo_estat_conexao){
		return $this->execSQLDB($codigo_estat_conexao,"SELECT oid,nspname as esquema FROM pg_namespace group by nspname,oid order by nspname");
	}
	/**
	 * Cria um novo esquema no banco de dados
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @return execSQLDB
	 */
	function criaEsquemaDB($codigo_estat_conexao,$nome_esquema){
		return $this->execSQLDB($codigo_estat_conexao,"create schema $nome_esquema");
	}
	/**
	 * Lista as tabelas de um esquema
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param sim|nao exclui da lista as tabelas que contem geometria
	 * @return execSQLDB
	 */
	function tabelasEsquema($codigo_estat_conexao,$nome_esquema,$excluigeom=""){
		$sql = "SELECT table_name as tabela FROM information_schema.tables where table_schema = '$nome_esquema'";
		if(strtolower($excluigeom) == "sim"){
			$sql = "SELECT c.table_name as tabela FROM information_schema.tables as c left join (SELECT distinct a.table_name FROM information_schema.tables as a left join information_schema.columns as b	on	a.table_name = b.table_name	where a.table_schema = '$nome_esquema' and	udt_name = 'geometry' ) as d on c.table_name = d.table_name where c.table_schema = '$nome_esquema' and d.table_name isnull";
		}
		return $this->execSQLDB($codigo_estat_conexao,$sql);
	}
	/**
	 * Cria uma nova tabela no banco de dados
	 * A nova tabela tera apenas uma coluna chamada gid (PK)
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @return execSQLDB
	 */
	function criaTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		return $this->execSQLDB($codigo_estat_conexao,"create table ".$nome_esquema.".".$nome_tabela." (gid serial, CONSTRAINT ".$nome_tabela."_pkey PRIMARY KEY (gid ))");
	}
	/**
	 * ALtera o nome de uma tabela
	 * Nao atualiza as tabelas i3geoestat_medida_variavel e i3geoestat_tipo_regiao
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela atual
	 * @param novo nome da tabela
	 * @return execSQLDB
	 */
	function alteraNomeTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$novonome_tabela){
		$res = $this->execSQLDB($codigo_estat_conexao,"ALTER TABLE ".$nome_esquema.".".$nome_tabela." RENAME TO ".$novonome_tabela );
		/*
		$tabela = $this->execSQLDB($codigo_estat_conexao,"SELECT table_name FROM information_schema.tables where table_name = '$novonome_tabela' and table_schema = '$nome_esquema'");
		if(count($tabela) > 0){
			$sql = "UPDATE i3geoestat_medida_variavel SET tabela = '$novonome_tabela' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_tipo_regiao SET tabela = '$novonome_tabela' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela'";
			$this->execSQL($sql,"",false);
		}
		*/
		return $res;
	}
	/**
	 * Faz uma copia de uma tabela
	 * @param codigo da conexao
	 * @param esquema
	 * @param nome da tabela existente
	 * @param nome da nova tabela
	 * @return execSQLDB
	 */
	function copiaTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$novonome_tabela){
		return $this->execSQLDB($codigo_estat_conexao,"CREATE TABLE ".$nome_esquema.".".$novonome_tabela." AS select * from ".$nome_esquema.".".$nome_tabela );
	}
	/**
	 * ALtera o nome de um esquema
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param novo nome do esquema
	 * @return execSQLDB
	 */
	function alteraNomeEsquemaDB($codigo_estat_conexao,$nome_esquema,$novonome_esquema){
		$res = $this->execSQLDB($codigo_estat_conexao,"ALTER SCHEMA ".$nome_esquema." RENAME TO ".$novonome_esquema );
		return $res;
	}
	/**
	 * Lista as colunas de uma tabela e seus metadados
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
	 * Cria uma coluna em uma tabela do banco
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @param nome da nova coluna
	 * @param tipo da coluna
	 * @return execSQLDB
	 */
	function criaColunaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nova_coluna,$tipo){
		return $this->execSQLDB($codigo_estat_conexao,"ALTER TABLE ".$nome_esquema.".".$nome_tabela." ADD COLUMN $nova_coluna $tipo ");
	}
	/**
	 * Altera o nome de uma coluna de uma tabela
	 * Atualiza as tabelas i3geoestat_medida_variavel, i3geoestat_tipo_regiao, i3geoestat_parametro_medida e i3geoestat_agregaregiao
	 * @param codigo da conexao
	 * @param nome do esquema
	 * @param nome da tabela
	 * @param nome da coluna
	 * @param novo nome
	 * @return execSQLDB
	 */
	function alteraNomeColunaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nome_coluna,$novonome_coluna){
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);

		$sql = "ALTER TABLE ".$nome_esquema.".".$nome_tabela." RENAME COLUMN $nome_coluna TO ".$novonome_coluna;
		$res = $dbh->query($sql,PDO::FETCH_ASSOC);

		$coluna = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name FROM information_schema.columns where table_name = '$novonome_tabela' and table_schema = '$nome_esquema' and column_name = '$novonome_coluna'");
		if(count($coluna) > 0){
			$sql = "UPDATE i3geoestat_medida_variavel SET colunavalor = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunavalor = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
			$sql = "UPDATE i3geoestat_medida_variavel SET colunaidgeo = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunaidgeo = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
			$sql = "UPDATE i3geoestat_medida_variavel SET colunaidunico = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunaidgeo = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
			$sql = "UPDATE i3geoestat_tipo_regiao SET colunageo = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' ' and colunageo = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
			$sql = "UPDATE i3geoestat_tipo_regiao SET colunanomeregiao = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' ' and colunanomeregiao = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
			$sql = "UPDATE i3geoestat_tipo_regiao SET colunacentroide = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' ' and colunacentroide = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);

			$sql = "UPDATE i3geoestat_parametro_medida SET coluna = '$novonome_coluna' FROM i3geoestat_medida_variavel WHERE i3geoestat_parametro_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel and esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and coluna = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
			$sql = "UPDATE i3geoestat_agregaregiao SET colunaligacao_regiaopai = '$novonome_coluna' FROM i3geoestat_tipo_regiao WHERE i3geoestat_agregaregiao.codigo_tipo_regiao = i3geoestat_tipo_regiao.codigo_tipo_regiao and esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunaligacao_regiaopai = '$nome_coluna'";
			$dbh->query($sql,PDO::FETCH_ASSOC);
		}
		return $res;
	}
	/**
	 * Lista os metadados de uma coluna
	 * Os metadados são obtidos do próprio PostgreSQL
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
	 * Insere dados de um arquivo CSV em uma tabela no padrão usado pelo METAESTAT
	 * O arquivo ja deve estar no servidor
	 * A medida de variavel ja deve ter sido criada
	 * A tabela deve ter a estrutura de colunas utilizada como padrao do METAESTAT
	 * @param nome do arquivo csv (no servidor)
	 * @param ID da medida da variavel
	 * @param codigo do tipo de regiao
	 * @param nome da coluna no CSV que contem os valores
	 * @param substituir|adicionar os dados
	 * @param (opcional) nome da coluna no arquivo csv que contem o ano do dado
	 * @param (opcional) nome da coluna no arquivo csv que contem o mes do dado
	 * @param (opcional) nome da coluna no arquivo csv que contem o dia do dado
	 * @param (opcional) nome da coluna no arquivo csv que contem a hora do dado
	 * @return string
	 */
	function inserirDados($nomearquivoserv,$id_medida_variavel,$codigoregiao,$valor,$tipoinclusao,$ano="",$mes="",$dia="",$hora=""){
		if(!file_exists($nomearquivoserv)){
			return "Arquivo de dados nao encontrado";
		}
		//le o arquivo
		$handle = fopen ($nomearquivoserv, "r");
		$cabecalho = fgets($handle);
		fclose ($handle);
		$buffer = str_replace('"','',$cabecalho);
		$buffer = str_replace("'",'',$buffer);
		$buffer = str_replace("\n",'',$buffer);
		$colunas = explode(";",$buffer);
		$separador = ";";
		if(count($colunas) == 1){
			$colunas = explode(",",$buffer);
			$separador = ",";
		}
		if(count($colunas) < 3){
			return "Arquivo nao contem todas as colunas necessarias";
		}
		//define o indice das colunas existentes no arquivo csv que correspondem as colunas de destino
		$icodigoregiao = "";
		$ivalor = "";
		$iano = "";
		$imes = "";
		$idia = "";
		$ihora = "";
		$n = count($colunas);
		for($i=0;$i<$n;++$i){
			if($colunas[$i] ==  $codigoregiao){
				$icodigoregiao = $i;
			}
			if($colunas[$i] ==  $valor){
				$ivalor = $i;
			}
			if($colunas[$i] ==  $ano){
				$iano = $i;
			}
			if($colunas[$i] ==  $mes){
				$imes = $i;
			}
			if($colunas[$i] ==  $dia){
				$idia = $i;
			}
			if($colunas[$i] ==  $hora){
				$ihora = $i;
			}
		}
		$handle = fopen ($nomearquivoserv, "r");
		$linhas = array();
		$r = array();
		$medidavariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
		//cria os inserts
		while (!feof($handle)) {
			$linha = fgets($handle);
			if($linha != $cabecalho){
				$linha = str_replace("\n",'',$linha);
				$linha = str_replace('"','',$linha);
				$linha = str_replace("'",'',$linha);
				$linha = explode($separador,$linha);
				//var_dump($linha);exit;
				if(count($linha) == count($colunas)){
					$ano = 0;
					$mes = 0;
					$dia = 0;
					$hora = 0;
					if($iano != ""){
						$ano = $linha[$iano];
					}
					if($imes != ""){
						$mes = $linha[$imes];
					}
					if($idia != ""){
						$dia = $linha[$idia];
					}
					if($ihora != ""){
						$hora = $linha[$ihora];
					}
					$linhas[] = "INSERT INTO i3geo_metaestat.".$medidavariavel["tabela"]." (id_medida_variavel,codigoregiao,".$medidavariavel["colunavalor"].",ano,mes,dia,hora) VALUES ('$id_medida_variavel','".$linha[$icodigoregiao]."','".$linha[$ivalor]."','".$ano."','".$mes."','".$dia."','".$hora."')";
				}
			}
		}
		fclose ($handle);
		//var_dump($linhas);
		//pega a conexao
		$c = $this->listaConexao($medidavariavel["codigo_estat_conexao"],true);
		//gera o objeto pdo
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		//verifica o tipo de operacao
		//apaga os dados se for necessario
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->beginTransaction();
			$sta = 0;
			if($tipoinclusao == "substituir"){
				$sth = $dbh->exec("UPDATE i3geo_metaestat.".$medidavariavel["tabela"]." SET id_medida_variavel = '".($id_medida_variavel * -1)."' WHERE id_medida_variavel = '".$id_medida_variavel."' and id_medida_variavel > 0");
			}
			foreach($linhas as $linha){
				$sta += $dbh->exec($linha);
			}
			$dbh->commit();

		} catch (Exception $e) {
			$dbh->rollBack();
			return "Falhou: " . $e->getMessage();
		}
		return "Processo concluido para ".count($linhas)." linhas";
	}
	/**
	 * Edita a tabela com os dados de um tipo de regiao
	 * @param codigo do tipo de regiao no cadastro
	 * @param nome da coluna que identifica cada registro na tabela de regioes
	 * @param valor do indicador
	 * @param nome da regiao
	 * @param wkt
	 * @param excluir|alterar tipo de operacao
	 * @return string
	 */
	function mantemDadosRegiao($codigo_tipo_regiao,$identificador,$identificadornovo,$nome,$wkt="",$tipo=""){
		if($tipo != "excluir" && ($identificadornovo == "" || $nome == "")){
			return array("erro");
		}
		//pega a tabela, esquema e conexao para acessar os dados da regiao
		$regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
		$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		//verifica se o registro com o valor do identificador novo ja existe
		$novoexiste = false;
		$sql = "select * from i3geo_metaestat.".$regiao["tabela"]." WHERE ".$regiao["identificador"]."::text = '$identificadornovo' ";
		$q = $dbh->query($sql,PDO::FETCH_ASSOC);
		$r = $q->fetchAll();
		if(count($r) > 0){
			$novoexiste = true;
		}
		//verifica se o registro com o valor do identificador existe
		$atualexiste = false;
		if($identificador != ""){
			$sql = "select * from i3geo_metaestat.".$regiao["tabela"]." WHERE ".$regiao["identificador"]."::text = '$identificador' ";
			$q = $dbh->query($sql,PDO::FETCH_ASSOC);
			$r = $q->fetchAll();
			if(count($r) > 0){
				$atualexiste = true;
			}
		}
		if($tipo == "excluir"){
			$dbh->query("DELETE from i3geo_metaestat.".$regiao["tabela"]." where ".$regiao["identificador"]."::text = '$identificador' ");
			return array("ok");
		}
		$nome = $this->converteTexto($nome);
		//aborta se ja existe o registro com valor igual ao identificador novo
		//caso o identificador novo for diferente do identificador original, o que configura uma tentativa de alteracao no codigo
		if($identificador != $identificadornovo && $novoexiste == true){
			return array("Falhou: codigo ja existe");
		}
		if($atualexiste == false && $wkt == ""){
			return array("Falhou: nao pode inserir registro sem wkt");
		}
		//echo "UPDATE i3geo_metaestat.".$regiao["tabela"]." SET ".$regiao["identificador"]." = '$identificadornovo', ".$regiao["colunanomeregiao"]." = '$nome' WHERE ".$regiao["identificador"]." = '$identificador' ";
		//faz o update
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->beginTransaction();
			//no caso de update
			if($atualexiste == true){
				$sql = "UPDATE i3geo_metaestat.".$regiao["tabela"]." SET ".$regiao["identificador"]." = '$identificadornovo', ".$regiao["colunanomeregiao"]." = '$nome' ";
				if($wkt != ""){
					$sql .= ", ".$regiao["colunageo"]." = ST_GeomFromText('SRID=".$regiao["srid"].";$wkt')";
					if($regiao["colunageo"] != $regiao["colunacentroide"]){
						$sql .= ", ".$regiao["colunacentroide"]." = ST_centroid(ST_GeomFromText('SRID=".$regiao["srid"].";$wkt'))";
					}
				}
				$sql .= " WHERE ".$regiao["identificador"]." = '$identificador' ";
			}
			//no caso de insert
			else{
				if($wkt != ""){
					if($regiao["colunageo"] != $regiao["colunacentroide"]){
						$sql = "INSERT INTO i3geo_metaestat.".$regiao["tabela"]." (".$regiao["identificador"].",".$regiao["colunanomeregiao"].",".$regiao["colunageo"].",".$regiao["colunacentroide"].")";
						$sql .= " VALUES ('$identificadornovo','$nome',ST_GeomFromText('SRID=".$regiao["srid"].";$wkt'),ST_centroid(ST_GeomFromText('SRID=".$regiao["srid"].";$wkt')))";
					}
					else{
						$sql = "INSERT INTO i3geo_metaestat.".$regiao["tabela"]." (".$regiao["identificador"].",".$regiao["colunanomeregiao"].",".$regiao["colunageo"].")";
						$sql .= " VALUES ('$identificadornovo','$nome',ST_GeomFromText('SRID=".$regiao["srid"].";$wkt'))";
					}
				}
			}
			$sth = $dbh->exec($sql);
			$dbh->commit();

		} catch (Exception $e) {
			$dbh->rollBack();
			return array("Falhou: " . $e->getMessage());
		}
		return array("ok");
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
		//var_dump($c);exit;
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
	/**
	 * Salva os atributos de uma medida de variavel com base em uma localizacao
	 * @param id da medida de variavel
	 * @param codigo do tipo de regiao
	 * @param identificador da regiao
	 * @param array contendo os identificadores unicos de cada registro na tabela com os dados da medida de variavel
	 * @param array com as colunas que contem os dados que serao modificados
	 * @param array com os valores para as colunas
	 * @return string
	 */
	function salvaAtributosMedidaVariavel($id_medida_variavel,$codigo_tipo_regiao,$identificador_regiao,$idsunicos,$colunas,$valores){
		$medida = $this->listaMedidaVariavel("",$id_medida_variavel);
		if($medida["esquemadb"] != "i3geo_metaestat"){
			return "erro";
		}
		$c = $this->listaConexao($medida["codigo_estat_conexao"],true);
		//var_dump($c);exit;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$sql = array();
		$nreg = count($idsunicos);
		$ncols = count($colunas);
		//loop pelos resgistros
		for($i=0;$i<$nreg;++$i){
			$id = $idsunicos[$i];
			$vals = explode(";",$valores[$i]);
			$sets = array();
			//loop pelas colunas
			for($j=0;$j<$ncols;$j++){
				$sets[] = $colunas[$j]." = '".$vals[$j]."'";
			}
			if($id != ""){
				$s = "UPDATE i3geo_metaestat.".$medida["tabela"]." SET ".implode(",",$sets);
				$s .= " WHERE ".$medida["colunaidunico"]."::text = '".$id."'";
				if(!empty($identificador_regiao)){
					$s .= " AND ".$medida["colunaidgeo"]."::text = '".$identificador_regiao."'";
				}
				if($medida["filtro"] != ""){
					$s .= " AND ".$medida["filtro"];
				}
				$sql[] = $s;
			}
			else{
				$s = "INSERT INTO i3geo_metaestat.".$medida["tabela"]." (".implode(",",$colunas).",id_medida_variavel,".$medida["colunaidgeo"].") ";
				$s .= "VALUES ('".implode("','",$vals)."','$id_medida_variavel','$identificador_regiao') ";
				$sql[] = $s;
			}
		}
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->beginTransaction();
			foreach($sql as $s){
				$sth = $dbh->exec($s);
			}
			$dbh->commit();
		} catch (Exception $e) {
			$dbh->rollBack();
			return array("Falhou: " . $e->getMessage());
		}
		return array("ok");
	}
	/**
	 * Transforma em um valor negativo o id de uma medida de variavel na tabela com os dados
	 * A tabela com os dados deve ter uma coluna chamada id_medida_variavel
	 * Utilizado para marcar como removido os registros de uma medida de variavel
	 * @param id da medida de variavel
	 * @return string
	 */
	function negativaValoresMedidaVariavel($id_medida_variavel){
		$this->testaNumerico(array($id_medida_variavel));

		$medida = $this->listaMedidaVariavel("",$id_medida_variavel);
		if($medida["esquemadb"] != "i3geo_metaestat"){
			return "erro";
		}
		$c = $this->listaConexao($medida["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		if($id_medida_variavel != ""){
			if($medida["filtro"] != ""){
				$sql = "UPDATE from i3geo_metaestat.".$medida["tabela"];
				$sql .= "SET id_medida_variavel = id_medida_variavel * -1 WHERE id_medida_variavel = $id_medida_variavel";
				try {
					$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					$dbh->beginTransaction();
					$sth = $dbh->exec($sql);
					$dbh->commit();
				} catch (Exception $e) {
					$dbh->rollBack();
					return array("Falhou: " . $e->getMessage());
				}
			}
		}
		return array("ok");
	}
	/**
	 * Exclui o valor de uma medida em uma regiao especifica
	 * Utilizado pelo editor de limites
	 * @param id da medida de variavel
	 * @param codigo do tipo de regiao
	 * @param identificador da regiao
	 * @param identificador do registro que sera removido da tabela com os dados
	 * @return string
	 */
	function excluiAtributosMedidaVariavel($id_medida_variavel,$codigo_tipo_regiao,$identificador_regiao,$id){
		$medida = $this->listaMedidaVariavel("",$id_medida_variavel);
		if($medida["esquemadb"] != "i3geo_metaestat"){
			return "erro";
		}
		$c = $this->listaConexao($medida["codigo_estat_conexao"],true);
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$sql = array();
		if($id_medida_variavel != "" && $codigo_tipo_regiao != "" && $identificador_regiao != "" && $id != ""){
			$s = "DELETE from i3geo_metaestat.".$medida["tabela"];
			$s .= " WHERE ".$medida["colunaidunico"]."::text = '".$id."' AND ".$medida["colunaidgeo"]."::text = '".$identificador_regiao."'";
			if($medida["filtro"] != ""){
				$s .= " AND ".$medida["filtro"];
			}
			$sql[] = $s;
		}
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->beginTransaction();
			foreach($sql as $s){
				$sth = $dbh->exec($s);
			}
			$dbh->commit();
		} catch (Exception $e) {
			$dbh->rollBack();
			return array("Falhou: " . $e->getMessage());
		}
		return array("ok");
	}
	/**
	 * Converte um tipo de regiao em shapefile
	 * @param codigo do tipo de regiao
	 * @return nome do arquivo criado
	 */
	function regiao2shp($codigo_tipo_regiao){
		$regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
		$dados = $this->obtemDadosTabelaDB($regiao["codigo_estat_conexao"],$regiao["esquemadb"],$regiao["tabela"],"sim");
		$tipol = $this->listaPropGeoRegiao($codigo_tipo_regiao);
		include_once(dirname(__FILE__)."/../../classesphp/classe_shp.php");
		$s = new SHP();
		//st_dimension returns 0 for POINT, 1 for LINESTRING, 2 for POLYGON
		//echo MS_SHP_POINT.", ".MS_SHP_ARC.", ".MS_SHP_POLYGON.", ".MS_SHP_MULTIPOINT;
		//1, 3, 5, 8
		$conv[0] = 1;
		$conv[1] = 3;
		$conv[2] = 5;
		//cria as colunas
		$cni = 0;
		foreach($dados["colunas"] as $t){
			$temp = strtoupper($t["field"]);
			if(strlen($temp) > 10){
				$temp = substr($temp,0,8).($cni++);
			}
			if($t["type"] == "varchar" || $t["type"] == "char" || $t["type"] == "character varying" || $t["type"] == "character" || $t["type"] == "text"){
				$def[] = array($temp,"C","254");
			}
			else{
				if($t["lengthvar"] < 0){
					$t["lengthvar"] = 0;
				}
				$def[] = array($temp,"N", $t["length"],$t["lengthvar"]);
			}
		}
		$nomeshp = $this->dir_tmp."/regiao$codigo_tipo_regiao"."_".$this->nomeRandomico();
		$dbaseExiste = false;
		if(function_exists("dbase_create")){
			$dbaseExiste = true;
		}
		//para manipular dbf
		if($dbaseExiste == false){
			include_once (dirname(__FILE__)."/../pacotes/phpxbase/api_conversion.php");
			$db = xbase_create($nomeshp.".dbf", $def);
		}
		else
		{$db = dbase_create($nomeshp.".dbf", $def);}
		$dbname = $nomeshp.".dbf";
		$reg = array();
		$novoshpf = ms_newShapefileObj($nomeshp.".shp", $conv[$tipol["st_dimension"]]);
		$cols = $dados["colunas"];
		$nc = count($dados["colunas"]);
		foreach($dados["linhas"] as $l){
			$reg = array();
			for($i=0;$i<$nc;$i++){
				if($cols[$i]["type"] != "geometry" && $cols[$i]["type"] != "geography"){
					$reg[] = $l[$i];
				}
				else{
					$reg[] = 0;
					if($cols[$i]["field"] == $regiao["colunageo"]){
						$shape = ms_shapeObjFromWkt($l[$i]);
					}
				}
			}
			$novoshpf->addShape($shape);
			if($dbaseExiste == false){
				xbase_add_record($db,$reg);
			}
			else{
				dbase_add_record($db,$reg);
			}
		}
		if($this->dbaseExiste == false){
			xbase_close($db);
		}
		else{
			dbase_close($db);
		}
		return $nomeshp;
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
