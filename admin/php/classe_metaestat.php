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
	public $dbh;
	protected $dbhw;
	protected $convUTF;
	public $dir_tmp;
	/*
	Function: __construct

	Cria um objeto Metaestat
	*/
	function __construct(){
		error_reporting(0);
		include(__DIR__."/conexao.php");
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
			$this->esquemaadmin = $esquemaadmin.".";
		}
	}
	function __destruct(){
		$this->fechaConexao;
	}
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
	function fechaConexao(){
		$this->dbh = null;
		$this->dbhw = null;
	}
	//aceita string ou array
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
	function excluirFonteinfoMedida($id_medida_variavel,$id_fonteinfo)
	{
		try	{
			$this->dbhw->query("DELETE from ".$this->esquemaadmin."i3geoestat_fonteinfo_medida WHERE id_medida_variavel = $id_medida_variavel and id_fonteinfo = $id_fonteinfo");
			return "ok";
		}
		catch (PDOException $e)	{
			return "Error!: " . $e->getMessage();
		}
	}
	/*
	 Function: sqlMedidaVariavel

	Monta o sql que permite acessar os dados de uma media de uma variavel

	Parametros:

	$id_medida_variavel - opcional

	$todasascolunas - opcional
	*/
	function sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor="",$tipolayer="polygon"){
		$filtro = false;
		$dados = $this->listaMedidaVariavel("",$id_medida_variavel);
		$dadosgeo = $this->listaTipoRegiao($dados["codigo_tipo_regiao"]);
		if($tipolayer != "point"){
			$colunageo = $dadosgeo["colunageo"];
		}
		else{
			$colunageo = $dadosgeo["colunacentroide"];
		}

		if($todasascolunas == 0){
			$sql = " SELECT d.".$dados["colunavalor"].",d.".$dados["colunaidgeo"];
			if(!empty($agruparpor)){
				$sql .= ",d.".$agruparpor;
			}
			$sqlgeo = $sql.",g.".$colunageo;
		}
		else{
			$sql = " SELECT d.* ";
			$sqlgeo = $sql.",g.".$colunageo;
		}
		if(empty($agruparpor)){
			$sql .= " FROM ".$dados["esquemadb"].".".$dados["tabela"]." as d ";
			$sqlgeo .= " FROM ".$dados["esquemadb"].".".$dados["tabela"]." as d,".$dadosgeo["esquemadb"].".".$dadosgeo["tabela"]." as g ";
		}
		else{
			$sqlgeo .= " FROM (SELECT sum(".$dados["colunavalor"].") as ".$dados["colunavalor"].",".$dados["colunaidgeo"].",".$agruparpor." FROM ".$dados["esquemadb"].".".$dados["tabela"] ." group by ".$agruparpor.",".$dados["colunaidgeo"].") as d, ".$dadosgeo["esquemadb"].".".$dadosgeo["tabela"]." as g";
			$sql .= " FROM (SELECT sum(".$dados["colunavalor"].") as ".$dados["colunavalor"].",".$dados["colunaidgeo"].",".$agruparpor." FROM ".$dados["esquemadb"].".".$dados["tabela"] ." group by ".$agruparpor.",".$dados["colunaidgeo"].") as d ";
		}
		if(!empty($dados["filtro"])){
			$sql .= " WHERE ".$dados["filtro"];
			$sqlgeo .= " WHERE ".$dados["filtro"];
			$filtro = true;
		}
		//join com a tabela geo
		$j = " d.".$dados["colunaidgeo"]." = g.".$dadosgeo["identificador"];
		if($filtro){
			$sqlgeo .= " AND ".$j;
		}
		else{
			$sqlgeo .= " WHERE ".$j;
		}
		//atencao: cuidado ao alterar essa string pois ') as foo' pode ser usado para replace em outras funcoes
		$sqlgeo = $colunageo." from ($sqlgeo) as foo using unique ".$dados["colunaidgeo"]." using srid=".$dadosgeo["srid"];
		$colunas = $this->colunasTabela($dados["codigo_estat_conexao"],$dados["esquemadb"],$dados["tabela"]);
		return array("sql"=>$sql,"sqlmapserver"=>$sqlgeo,"filtro"=>$filtro,"colunas"=>$colunas);
	}
	function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor=""){
		if(empty($tipolayer)){
			$tipolayer = "polygon";
		}
		$meta = $this->listaMedidaVariavel("",$id_medida_variavel);
		if($titulolayer == ""){
			$titulolayer = $meta["nomemedida"];
		}
		$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
		$conexao = $this->listaConexao($meta["codigo_estat_conexao"],true);
		$conexao = "user=".$conexao["usuario"]." password=".$conexao["senha"]." dbname=".$conexao["bancodedados"]." host=".$conexao["host"]." port=".$conexao["porta"]."";
		//echo $conexao;exit;
		$sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor,$tipolayer);
		$sqlf = $sql["sqlmapserver"];
		if(!empty($filtro)){
			$sqlf = str_replace(") as foo"," AND ".$filtro." ) as foo",$sqlf);
		}
		$classes = "";
		if(!empty($id_classificacao)){
			$classes = $this->listaClasseClassificacao($id_classificacao);
		}
		$rand = $this->nomeRandomico();
		$arq = $this->dir_tmp."/".$rand.".map";
		$dados[] = "MAP";
		$dados[] = 'SYMBOLSET "'.$this->locaplic.'/symbols/simbolosv6.sym"';
		$dados[] = 'FONTSET   "'.$this->locaplic.'/symbols/fontes.txt"';
		$dados[] = "LAYER";
		$dados[] = '	NAME "'.$rand.'"';
		$dados[] = "	TYPE $tipolayer";
		$dados[] = '	DATA "'.$sqlf.'"';
		$dados[] = '	CONNECTION "'.$conexao.'"';
		$dados[] = '	CONNECTIONTYPE POSTGIS';
		$dados[] = '	STATUS OFF';
		$dados[] = '	METADATA';
		$dados[] = '		TEMA "'.$titulolayer.'"';
		$dados[] = '		CLASSE "SIM"';
		$dados[] = '	END';
		if($classes == ""){
			$dados[] = '    CLASS';
			$dados[] = '        NAME ""';
			$dados[] = '        STYLE';
			$dados[] = '        	COLOR 200 0 0';
			$dados[] = '        END';
			$dados[] = '    END';
		}
		else{
			foreach($classes as $classe){
				//var_dump($classe);exit;
				$dados[] = '    CLASS';
				$dados[] = '        NAME "'.mb_convert_encoding($classe["titulo"],"ISO-8859-1",mb_detect_encoding($titulolayer)).'"';
				$dados[] = '        EXPRESSION '.$classe["expressao"];
				$dados[] = '        STYLE';
				$dados[] = '        	COLOR '.$classe["vermelho"].' '.$classe["verde"].' '.$classe["azul"];
				if(!empty($classe["tamanho"])){
					$dados[] = '        SIZE '.$classe["tamanho"];
				}
				if(!empty($classe["simbolo"])){
					$dados[] = '        SYMBOL '.$classe["simbolo"];
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
		return array("mapfile"=>$arq,"layer"=>$rand,"titulolayer"=>$titulolayer);
	}
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
	function dadosMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$agruparpor = ""){
		$sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor);
		$sqlf = $sql["sql"];
		if($sql["filtro"] == true){
			if(!empty($filtro)){
				$sqlf .= $sqlf." AND ".$filtro;
			}
		}
		elseif(!empty($filtro)){
			$sqlf .= " WHERE ".$filtro;
		}
		//echo $sqlf;exit;
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
	function sumarioMedidaVariavel($id_medida_variavel,$filtro="",$agruparpor=""){
		if(!empty($agruparpor)){
			$dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,1);
		}
		else{
			$dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,0);
		}
		if($dados){
			$metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
			$un = $this->listaUnidadeMedida($metaVariavel["codigo_unidade_medida"]);
			$agrupamento = "";
			foreach($dados as $d){
				$valores[] = $d[$metaVariavel["colunavalor"]];
			}
			if(!empty($agruparpor)){
				$agrupamento = array();
				foreach($dados as $d){
					$g = $d[$agruparpor];
					//var_dump($d);exit;
					if(!empty($agrupamento[$g])){
						$agrupamento[$g] += $d[$metaVariavel["colunavalor"]];
					}
					else{
						$agrupamento[$g] = $d[$metaVariavel["colunavalor"]];
					}
				}
				natsort($agrupamento);
			}
			$soma = "";
			$media = "";
			$min = "";
			$max = "";
			$quantidade = count($valores);
			if($un["permitesoma"] == "1"){
				$soma = array_sum($valores);
			}
			if($un["permitemedia"] == "1"){
				$media = $soma / $quantidade;
			}
			if($un["permitesoma"] == "1" || $un["permitemedia"] == "1"){
				sort($valores);
				$min = $valores[0];
				$max = $valores[$quantidade - 1];
			}
			$histograma = array_count_values($valores);
			return array(
						"soma"=>$soma,
						"media"=>$media,
						"menor"=>$min,
						"maior"=>$max,
						"quantidade"=>$quantidade,
						"histograma"=>$histograma,
						"grupos"=>$agrupamento,
						"unidademedida"=>$un
					);
		}
		return false;
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
	 Function: alteraLinkMedida

	Altera um link

	*/
	function alteraLinkMedida($id_medida_variavel,$id_link="",$nome,$link){
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
	/*
	Function: alteraFonteinfo

	Altera uma fonte

	*/
	function alteraFonteinfo($id_fonteinfo="",$titulo,$link){
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
	/*
	Function: adicinaFonteinfoMedida

	Adiciona um fonte a uma medida

	*/
	function adicinaFonteinfoMedida($id_medida_variavel,$id_fonteinfo){
		//echo "INSERT INTO ".$this->esquemaadmin."i3geoestat_fonteinfo_medida (id_medida_variavel,id_fonteinfo) VALUES ('$id_medida_variavel','$id_fonteinfo')";exit;
		$this->dbhw->query("INSERT INTO ".$this->esquemaadmin."i3geoestat_fonteinfo_medida (id_medida_variavel,id_fonteinfo) VALUES ('$id_medida_variavel','$id_fonteinfo')");
	}
	/*
	 Function: alteraUnidadeMedida

	Altera uma medida de uma variavel ou cria uma nova
	*/
	function alteraUnidadeMedida($codigo_unidade_medida,$nome,$sigla,$permitesoma,$permitemedia){
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
	/*
	 Function: alteraTipoPeriodo

	Altera um tipo de periodo de tempo
	*/
	function alteraTipoPeriodo($codigo_tipo_periodo,$nome,$descricao){
		try	{
			if($codigo_tipo_periodo != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
					$descricao = utf8_encode($descricao);
				}
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
	/*
	Function: alteraConexao

	Altera uma conexao
	*/
	function alteraConexao($codigo_estat_conexao,$bancodedados,$host,$porta,$usuario){
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
	/*
	 Function: alteraTipoRegiao

	Altera uma regiao
	*/
	function alteraTipoRegiao($codigo_tipo_regiao,$nome_tipo_regiao,$descricao_tipo_regiao,$esquemadb,$tabela,$colunageo,$colunacentroide,$data,$identificador,$colunanomeregiao,$srid){
		try	{
			if($codigo_tipo_regiao != ""){
				if($this->convUTF){
					$nome_tipo_regiao = utf8_encode($nome_tipo_regiao);
					$descricao_tipo_regiao = utf8_encode($descricao_tipo_regiao);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_tipo_regiao SET colunacentroide = '$colunacentroide',nome_tipo_regiao = '$nome_tipo_regiao',descricao_tipo_regiao = '$descricao_tipo_regiao',esquemadb = '$esquemadb',tabela = '$tabela',colunageo = '$colunageo',data = '$data',identificador = '$identificador',colunanomeregiao = '$colunanomeregiao', srid = '$srid' WHERE codigo_tipo_regiao = $codigo_tipo_regiao");
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
	Function: alteraDimensaoMedida

	Altera uma dimensao de uma medida ou cria uma nova
	*/
	function alteraClassificacaoMedida($id_medida_variavel,$id_classificacao="",$nome="",$observacao=""){
		try	{
			if($id_classificacao != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
					$observacao = utf8_encode($observacao);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_classificacao SET observacao = '$observacao',nome = '$nome' WHERE id_classificacao = $id_classificacao");
				$retorna = $id_dimensao_medida;
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
	/*
	 Function: alteraClasseClassificacao

	Altera uma classe de uma classificacao
	*/
	function alteraClasseClassificacao($id_classificacao,$id_classe="",$titulo="",$expressao="",$vermelho="",$verde="",$azul="",$tamanho="",$simbolo="",$overmelho="",$overde="",$oazul="",$otamanho=""){
		try	{
			if($id_classe != ""){
				if($this->convUTF){
					$titulo = utf8_encode($titulo);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_classe SET azul = '$azul', verde = '$verde', vermelho = '$vermelho',expressao = '$expressao', titulo = '$titulo' WHERE id_classe = $id_classe";exit;
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_classes SET tamanho='$tamanho',simbolo='$simbolo',overmelho='$overmelho',overde='$overde',oazul='$oazul',otamanho='$otamanho',azul = '$azul', verde = '$verde', vermelho = '$vermelho',expressao = '$expressao', titulo = '$titulo' WHERE id_classe = $id_classe");
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
	/*
	 Function: listaUnidadeMedida

	Lista as unidades de medida cadastradas ou uma unica unidade

	Parametros:

	$codigo_unidade_medida - opcional
	*/
	function listaUnidadeMedida($codigo_unidade_medida=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_unidade_medida ";
		if($codigo_unidade_medida != ""){
			$sql .= "WHERE codigo_unidade_medida = $codigo_unidade_medida ";
		}
		$sql .= "ORDER BY nome";
		return $this->execSQL($sql,$codigo_unidade_medida);
	}
	/*
	 Function: listaFonteinfo

	Lista as fontes cadastradas ou uma unica unidade

	*/
	function listaFonteinfo($id_fonteinfo=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_fonteinfo ";
		if($id_fonteinfo != ""){
			$sql .= "WHERE id_fonteinfo = $id_fonteinfo ";
		}
		$sql .= "ORDER BY titulo";
		return $this->execSQL($sql,$id_fonteinfo);
	}
	/*
	 Function: listaFonteinfoMedida

	Lista as fontes cadastradas ou uma unica unidade

	*/
	function listaFonteinfoMedida($id_medida_variavel){
		$sql = "SELECT i3geoestat_fonteinfo.* ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_fonteinfo ";
		$sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_fonteinfo_medida ";
		$sql .= "ON i3geoestat_fonteinfo.id_fonteinfo = i3geoestat_fonteinfo_medida.id_fonteinfo ";
		$sql .= "WHERE i3geoestat_fonteinfo_medida.id_medida_variavel = $id_medida_variavel ";
		$sql .= "ORDER BY titulo";
		return $this->execSQL($sql,$id_fonteinfo);
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
	Function: listaClassificacaoMedida

	Lista as classificacoes de uma medida de uma variavel

	Parametros:

	$id_medida_variavel
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
	/*
	 Function: listaLinkMedida

	Lista os links de uma medida de uma variavel

	Parametros:

	$id_medida_variavel
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
	/*
	 Function: listaClasseClassificacao

	Lista as classes de uma classificacao
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
	 Function: listaConexao

	Lista as conexoes cadastradas ou uma unica conexao

	Parametros:

	$id {string} - opcional

	$senha {boolean} - mostra ou nao a senha - opcional
	*/
	function listaConexao($codigo_estat_conexao="",$senha=false){
		if($senha){
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
	 Function: listaTipoPeriodo

	Lista os tipos de períodos de tempo cadastrados ou um único período

	Parametros:

	$codigo_tipo_periodo - opcional
	*/
	function listaTipoPeriodo($codigo_tipo_periodo=""){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_periodo ";
		if($codigo_tipo_periodo != ""){
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
		if($codigo_tipo_regiao != ""){
			$sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao ";
		}
		$sql .= "ORDER BY nome_tipo_regiao";
		return $this->execSQL($sql,$codigo_tipo_regiao);
	}
	function esquemasConexao($codigo_estat_conexao){
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbhold = $this->dbh;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$this->dbh = $dbh;
		$res = $this->execSQL("SELECT oid,nspname as esquema FROM pg_namespace group by table_schema");
		$this->dbh = $dbhold;
		return $res;
	}
	function tabelasEsquema($codigo_estat_conexao,$nome_esquema){
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbhold = $this->dbh;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$this->dbh = $dbh;
		$res = $this->execSQL("SELECT table_name as tabela FROM information_schema.tables where table_schema = '$nome_esquema'");
		$this->dbh = $dbhold;
		return $res;
	}
	function colunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		$colunas = array();
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbhold = $this->dbh;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$this->dbh = $dbh;
		$res = $this->execSQL("SELECT column_name as coluna FROM information_schema.columns where table_schema = '$nome_esquema' and table_name = '$nome_tabela'");
		$this->dbh = $dbhold;
		foreach($res as $c){
			$colunas[] = $c["coluna"];
		}
		return $colunas;
	}
	function descreveColunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbhold = $this->dbh;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$this->dbh = $dbh;
		$res = $this->execSQL("SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
		$this->dbh = $dbhold;
		return $res;
	}
	function relatorioCompleto(){
		$dados = array();
		$vs = $this->listaVariavel();
		foreach($vs as $v){
			$nivel1["id"] = $v["codigo_variavel"];
			$nivel1["titulo"] = $v["nome"];
			$nivel1["descricao"] = $v["descricao"];
			$ms = $this->listaMedidaVariavel($v["codigo_variavel"]);
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

				$nivel1["filho"] = $nivel2;
			}
			$dados[] = $nivel1;
		}
		return $dados;
	}
	function formataRelatorioHtml($dados){
		$html = "<div class='var_div_relatorio'>";
		$var_cor = "var_cor1";
		foreach($dados as $variavel){
			$html .= "<div class='".$var_cor."'>";
			$html .= "<h1>".$variavel["titulo"]."</h1>";
			$html .= "<p><i>".$variavel["descricao"]."</i></p>";
			$f = $variavel["filho"];
			$html .= "<h2>".$f["titulo"]."</h2>";
			$html .= "<p><i>".$f["descricao"]."</i></p>";
			$html .= "<p><b>Fontes:</b></p>";
			foreach($f["fontes"] as $fonte){
				$html .= "<p><a href='".$fonte["link"]."' >".$fonte["titulo"]."</a></p>";
			}
			$html .= "<p><b>Links:</b></p>";
			foreach($f["links"] as $link){
				$html .= "<p><a href='".$link["link"]."' >".$link["nome"]."</a></p>";
			}
			$html .= "</div>";
			if($var_cor == "var_cor1"){
				$var_cor = "var_cor2";
			}
			else{
				$var_cor = "var_cor1";
			}
		}
		$html .= "</div>";
		return $html;
	}
}
?>