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
	public $nomecache;
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
		$this->nomecache = $this->nomeCache();
	}
	function __destruct(){
		$this->fechaConexao;
	}
	function nomeCache(){
		return md5(implode("x",$_REQUEST));
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

	Executa um SQL no banco de administracao

	Parametros:

	$sql {string}

	$id {string} - se for vazio retorna todos os registros, caso contrario, retorna apenas o primeiro

	Return:

	{array}
	*/
	function execSQL($sql,$id="",$convTexto=true){
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
	/*
	 Function: execSQLDB

	Executa um SQL no banco de dados definido em uma conexao
	*/
	function execSQLDB($codigo_estat_conexao,$sql){
		$c = $this->listaConexao($codigo_estat_conexao,true);
		$dbhold = $this->dbh;
		$dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
		$this->dbh = $dbh;
		$res = $this->execSQL($sql,"",false);
		$this->dbh = $dbhold;
		return $res;
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
	function sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor="",$tipolayer="polygon",$codigo_tipo_regiao = ""){
		$filtro = false;
		$dados = $this->listaMedidaVariavel("",$id_medida_variavel);
		$dadosgeo = $this->listaTipoRegiao($dados["codigo_tipo_regiao"]);
		$agregaregiao = false;
		if($codigo_tipo_regiao != "" && $dados["codigo_tipo_regiao"] != $codigo_tipo_regiao){
			$agregaregiao = true;
			$dadosgeoagregada = $this->listaTipoRegiao($codigo_tipo_regiao);
		}
		if($tipolayer != "point"){
			$colunageo = $dadosgeo["colunageo"];
		}
		else{
			$colunageo = $dadosgeo["colunacentroide"];
		}
		if($todasascolunas == 0){
			$sql = " SELECT d.".$dados["colunavalor"].",d.".$dados["colunaidgeo"];
			$colunas[] = $dados["colunavalor"];
			$colunas[] = $dados["colunaidgeo"];
			if(!empty($agruparpor)){
				$temp = explode(",",$agruparpor);
				$sql .= ",d.".implode(",d.",$temp);
				$colunas = array_merge($colunas,$temp);
			}
		}
		else{
			$sql = " SELECT d.* ";
			$colunas = $this->colunasTabela($dados["codigo_estat_conexao"],$dados["esquemadb"],$dados["tabela"]);
		}
		//prepara a lista de colunas que ficarao visiveis no sql geo
		$vis = $dadosgeo["colunasvisiveis"];
		$vis = str_replace(" ",",",$vis);
		$vis = str_replace(",,",",",$vis);
		$colunasvisiveis = explode(",",$vis);
		//$vis[] = "st_setsrid($colunageo,".$dadosgeo["srid"].") as $colunageo";
		$colunasvisiveis = array_unique($colunasvisiveis);
		$colunas = array_merge($colunas,$colunasvisiveis);
		$vis = implode(",g.",$colunasvisiveis);
		$vis = "g.".$vis.",st_setsrid(g.".$colunageo.",".$dadosgeo["srid"].") as ".$colunageo;
		//$sqlgeo = $sql.",g.".$colunageo;
		$sqlgeo = $sql.",".$vis;
		//
		//prepara os alias das colunas
		//
		$alias = $colunas;
		$n = count($colunas);
		for($i=0;$i<$n;$i++){
			if($colunas[$i] === $dados["colunavalor"]){
				$alias[$i] = mb_convert_encoding($dados["nomemedida"],"ISO-8859-1",mb_detect_encoding($dados["nomemedida"]));
			}
		}
		$aliasvis = $dadosgeo["apelidos"];
		$aliasvis = str_replace(" ",",",$aliasvis);
		$aliasvis = str_replace(",,",",",$aliasvis);
		$aliasvis = explode(",",$aliasvis);
		if(count($aliasvis) == count($colunasvisiveis)){
			$n = count($colunas);
			for($i=0;$i<$n;$i++){
				$nj = count($colunasvisiveis);
				for($j=0;$j<$nj;$j++){
					if($colunas[$i] === $colunasvisiveis[$j]){
						$alias[$i] = mb_convert_encoding($aliasvis[$j],"ISO-8859-1",mb_detect_encoding($aliasvis[$j]));
					}
				}
			}
		}
		//
		if($agregaregiao == true){
			$dadosAgregacao = $this->listaAgregaRegiaoFilho($dados["codigo_tipo_regiao"], $codigo_tipo_regiao);
			$sqlgeo = "g.".$dadosAgregacao["colunaligacao_regiaopai"].",sum(d.".$dados["colunavalor"].") as ".$dados["colunavalor"];
		}
		$tipoconta = "";
		if($dados["permitesoma"] == 1){
			$tipoconta = "sum";
		}
		elseif($dados["permitemedia"] == 1){
			$tipoconta = "mean";
		}
		if(empty($agruparpor)){
			$sql .= " FROM ".$dados["esquemadb"].".".$dados["tabela"]." as d ";
			$sqlgeo .= " FROM ".$dados["esquemadb"].".".$dados["tabela"]." as d,".$dadosgeo["esquemadb"].".".$dadosgeo["tabela"]." as g ";
		}
		else{
			$sqlagrupamento = " SELECT d.".$agruparpor." FROM ".$dados["esquemadb"].".".$dados["tabela"]." as d group by ".$agruparpor." order by ".$agruparpor;
			$sqlgeo .= " FROM (SELECT $tipoconta(".$dados["colunavalor"].") as ".$dados["colunavalor"].",".$dados["colunaidgeo"].",".$agruparpor." FROM ".$dados["esquemadb"].".".$dados["tabela"] ." __dadosfiltro__ group by ".$agruparpor.",".$dados["colunaidgeo"].") as d, ".$dadosgeo["esquemadb"].".".$dadosgeo["tabela"]." as g";
			$sql .= " FROM (SELECT $tipoconta(".$dados["colunavalor"].") as ".$dados["colunavalor"].",".$dados["colunaidgeo"].",".$agruparpor." FROM ".$dados["esquemadb"].".".$dados["tabela"] ." __dadosfiltro__ group by ".$agruparpor.",".$dados["colunaidgeo"].") as d ";
		}
		$dadosfiltro = "";
		if(!empty($dados["filtro"])){
			//$sql .= " WHERE ".$dados["filtro"];
			//$sqlgeo .= " WHERE ".$dados["filtro"];
			$dadosfiltro = " WHERE ".$dados["filtro"];
			$filtro = true;
		}
		$sql = str_replace("__dadosfiltro__",$dadosfiltro,$sql);
		$sqlgeo = str_replace("__dadosfiltro__",$dadosfiltro,$sqlgeo);
		//join com a tabela geo
		$j = " d.".$dados["colunaidgeo"]."::text = g.".$dadosgeo["identificador"]."::text";
		$sqlgeo .= " WHERE ".$j;


		//@TODO - agregacao com uma regiao maior
		if($agregaregiao == true){
			//$sqlgeo = "select pg.*,".$dados["colunavalor"]." from (select ".$sqlgeo." __filtro__ group by g.".$dadosAgregacao["colunaligacao_regiaopai"].") as fg, ".$dadosgeoagregada["esquemadb"].".".$dadosgeoagregada["tabela"]." as pg where fg.".$dadosAgregacao["colunaligacao_regiaopai"]." = pg.".$dadosgeoagregada["identificador"];
			$sqlgeo = $colunageo." from ( $sqlgeo ) as foo using unique ".$dadosAgregacao["colunaligacao_regiaopai"]." using srid=".$dadosgeo["srid"];
		}
		else{
			$sqlgeo = $colunageo." from (".$sqlgeo." __filtro__ ) as foo using unique ".$dados["colunaidgeo"]." using srid=".$dadosgeo["srid"];
		}
		return array("sqlagrupamento"=>$sqlagrupamento,"sql"=>$sql,"sqlmapserver"=>$sqlgeo,"filtro"=>$filtro,"colunas"=>$colunas,"alias"=>$alias);
	}
	function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor="",$codigo_tipo_regiao=""){
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
			$sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor,$tipolayer,$codigo_tipo_regiao);
			$sqlf = $sql["sqlmapserver"];
			if(!empty($filtro)){
				$sqlf = str_replace("__filtro__"," AND ".$filtro." /*FA*//*FA*/ /*FAT*//*FAT*/",$sqlf);
			}
			else{
				$sqlf = str_replace("__filtro__"," /*FA*//*FA*/ /*FAT*//*FAT*/",$sqlf);
			}
			$classes = "";
			if(!empty($id_classificacao)){
				$classes = $this->listaClasseClassificacao($id_classificacao);
			}
			$dados[] = "MAP";
			$dados[] = 'SYMBOLSET "'.$this->locaplic.'/symbols/simbolosv6.sym"';
			$dados[] = 'FONTSET   "'.$this->locaplic.'/symbols/fontes.txt"';
			$dados[] = "LAYER";
			$dados[] = '	NAME "'.$this->nomecache.'"';
			$dados[] = "	TYPE $tipolayer";
			$dados[] = '	DATA "'.$sqlf.'"';
			$dados[] = '	CONNECTION "'.$conexao.'"';
			$dados[] = '	CONNECTIONTYPE POSTGIS';
			$dados[] = '	STATUS OFF';
			$dados[] = '	TEMPLATE "none.htm"';
			$dados[] = '	METADATA';
			$dados[] = '		TEMA "'.$titulolayer.'"';
			$dados[] = '		CLASSE "SIM"';
			$dados[] = '		METAESTAT "SIM"';
			$dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
			$dados[] = '		METAESTAT_ID_MEDIDA_VARIAVEL "'.$id_medida_variavel.'"';
			$dados[] = '		ITENS "'.implode(",",$sql["colunas"]).'"';
			$dados[] = '		ITENSDESC "'.implode(",",$sql["alias"]).'"';
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
					$dados[] = '        EXPRESSION '.$classe["expressao"];
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
	function mapfileTipoRegiao($codigo_tipo_regiao,$outlinecolor="255,0,0",$width=1,$nomes="nao"){
		//para permitir a inclusao de filtros, o fim do sql e marcado com /*FW*//*FW*/
		//indicando onde deve comecar e terminar uma possivel clausula where
		//Layers adicionados aqui sao marcados com o metadata METAESTAT "SIM"
		//O codigo_tipo_regiao e marcado com o metadata METAESTAT_CODIGO_TIPO_REGIAO
		$arq = $this->dir_tmp."/".$this->nomecache.".map";
		if(!file_exists($arq)){
			$tipolayer = "polygon";
			$meta = $this->listaTipoRegiao($codigo_tipo_regiao);
			$titulolayer = $meta["nome_tipo_regiao"];
			$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
			$conexao = $this->listaConexao($meta["codigo_estat_conexao"],true);
			$conexao = "user=".$conexao["usuario"]." password=".$conexao["senha"]." dbname=".$conexao["bancodedados"]." host=".$conexao["host"]." port=".$conexao["porta"]."";
			$colunageo = $meta["colunageo"];
			$srid = $meta["srid"];
			//st_setsrid(".$colunageo.",".$srid.") as ".$colunageo
			$vis = $meta["colunasvisiveis"];
			$vis = str_replace(" ",",",$vis);
			$vis = str_replace(",,",",",$vis);
			$sqlf = $meta["colunageo"]." from (select st_setsrid(".$colunageo.",".$srid.") as $colunageo,$vis,gid from ".$meta["esquemadb"].".".$meta["tabela"]." /*FW*//*FW*/) as foo using unique gid using srid=".$srid;
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
			$dados[] = '	END';
			$dados[] = '    CLASS';
			$dados[] = '        NAME ""';
			$dados[] = '        STYLE';
			$dados[] = '        	OUTLINECOLOR '.$outlinecolor;
			$dados[] = '        	COLOR -1 -1 -1';
			$dados[] = '        	WIDTH '.$width;
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
		return array("mapfile"=>$arq,"layer"=>$this->nomecache,"titulolayer"=>$titulolayer);
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
				$sqlf = $sqlf." AND ".$filtro;
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
			$colunavalor = $metaVariavel["colunavalor"];
			foreach($dados as $d){
				$valores[] = $d[$colunavalor];
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
				$min = $valores[0];
				$max = $valores[$quantidade - 1];
				include_once(__DIR__."/../../classesphp/classe_estatistica.php");
				$calc = new estatistica();
				$calc->calcula($valores);
				$v = $calc->resultado;
				//expressao para o mapfile
				$expressao[] = "([".$colunavalor."]<=".($v["quartil1"]).")";
				$expressao[] = "(([".$colunavalor."]>".($v["quartil1"]).")and([".$colunavalor."]<=".($v["quartil2"])."))";
				$expressao[] = "(([".$colunavalor."]>".($v["quartil2"]).")and([".$colunavalor."]<=".($v["quartil3"])."))";
				$expressao[] = "([".$colunavalor."]>".($v["quartil3"]).")";
				$nomes[] = "<= ".($v["quartil1"]);
				$nomes[] = "> ".($v["quartil1"])." e <= ".($v["quartil2"]);
				$nomes[] = "> ".($v["quartil2"])." e <= ".($v["quartil3"]);
				$nomes[] = "> ".($v["quartil3"]);

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
	function alteraMedidaVariavel($codigo_variavel,$id_medida_variavel="",$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$colunaidunico,$filtro,$nomemedida){
		try	{
			if($id_medida_variavel != ""){
				if($this->convUTF){
					$nomemedida = utf8_encode($nomemedida);
				}
				$this->dbhw->query("UPDATE ".$this->esquemaadmin."i3geoestat_medida_variavel SET codigo_unidade_medida = '$codigo_unidade_medida',codigo_tipo_periodo = '$codigo_tipo_periodo',codigo_tipo_regiao = '$codigo_tipo_regiao',codigo_estat_conexao = '$codigo_estat_conexao',esquemadb = '$esquemadb',tabela = '$tabela',colunavalor = '$colunavalor',colunaidgeo = '$colunaidgeo',colunaidunico = '$colunaidunico' ,filtro = '$filtro',nomemedida = '$nomemedida' WHERE id_medida_variavel = $id_medida_variavel");
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
	function alteraTipoRegiao($codigo_tipo_regiao,$nome_tipo_regiao,$descricao_tipo_regiao,$esquemadb,$tabela,$colunageo,$colunacentroide,$data,$identificador,$colunanomeregiao,$srid,$codigo_estat_conexao,$colunasvisiveis,$apelidos){
		try	{
			if($codigo_tipo_regiao != ""){
				if($this->convUTF){
					$nome_tipo_regiao = utf8_encode($nome_tipo_regiao);
					$descricao_tipo_regiao = utf8_encode($descricao_tipo_regiao);
				}
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
	function alteraAgregaRegiao($codigo_tipo_regiao,$id_agregaregiao="",$codigo_tipo_regiao_pai="",$colunaligacao_regiaopai=""){
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
	/*
	Function: alteraParametroMedida

	Altera uma parametro de uma medida ou cria uma nova
	*/
	function alteraParametroMedida($id_medida_variavel,$id_parametro_medida="",$nome,$descricao,$coluna,$id_pai,$tipo="0"){
		try	{
			if($id_parametro_medida != ""){
				if($this->convUTF){
					$nome = utf8_encode($nome);
					$descricao = utf8_encode($descricao);
				}
				//echo "UPDATE ".$this->esquemaadmin."i3geoestat_parametro_medida SET nomeparametro = '$nomeparametro',descricao = '$descricao',coluna = '$coluna',agregavalores = '$agregavalores' WHERE id_parametro_medida = $id_parametro_medida";exit;
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
	function alteraClassificacaoMedida($id_medida_variavel,$id_classificacao="",$nome="",$observacao=""){
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
	function listaVariavel($codigo_variavel="",$filtro_esquema=""){
		$sql = "select a.* from ".$this->esquemaadmin."i3geoestat_variavel as a ";
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
		$sql = "SELECT i3geoestat_medida_variavel.*,i3geoestat_variavel.nome as nome_variavel,i3geoestat_unidade_medida.permitemedia,i3geoestat_unidade_medida.permitesoma,i3geoestat_unidade_medida.nome as unidade_medida ";
		$sql .= "FROM ".$this->esquemaadmin."i3geoestat_variavel ";
		$sql .= "JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
		$sql .= "ON i3geoestat_variavel.codigo_variavel = i3geoestat_medida_variavel.codigo_variavel ";
		$sql .= "JOIN ".$this->esquemaadmin."i3geoestat_unidade_medida ";
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
		return $this->execSQL($sql,$id_medida_variavel);
	}
	/*
	 Function: listaRegioesMedida

	Lista as regioes de uma medida variavel
	*/
	function listaRegioesMedida($id_medida_variavel){
		$variavel = $this->listaMedidaVariavel("",$id_medida_variavel);
		$codigo_tipo_regiao = $variavel["codigo_tipo_regiao"];
		$regioes[] = $this->listaTipoRegiao($codigo_tipo_regiao);
		$agregacoes = $this->listaAgregaRegiao($codigo_tipo_regiao);
		foreach($agregacoes as $a){
			$regioes[] = $this->listaTipoRegiao($a["codigo_tipo_regiao_pai"]);
		}
		return $regioes;
	}
	/*
	 Function: listaConexao

	Lista as conexoes cadastradas ou uma unica conexao

	Parametros:

	$id {string} - opcional

	$senha {boolean} - mostra ou nao a senha - opcional
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
	/*
	 Function: listaParametro

	Lista as variaveis cadastradas ou uma unica variavel

	Parametros:

	$id_medida_variavel

	$id_parametro_variavel - opcional
	*/
	function listaParametro($id_medida_variavel,$id_parametro_medida=""){
		$sql = "SELECT i3geoestat_parametro_medida.* ";
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
		//echo $sql;exit;
		return $this->execSQL($sql,$id_parametro_medida);
	}
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

	Lista os tipos de regiao cadastrados ou uma unica

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
	function listaHierarquiaRegioes($codigoregiaopai=""){
		$sql = "select i3geoestat_tipo_regiao.codigo_tipo_regiao,i3geoestat_tipo_regiao.nome_tipo_regiao from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
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
		$r = $q->fetchAll();
		return $r;
	}
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
	function listaAgregaRegiaoFilho($codigo_tipo_regiao,$codigo_tipo_regiao_pai){
		$sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao ";
		$sql .= "WHERE codigo_tipo_regiao_pai = $codigo_tipo_regiao_pai ";
		$sql .= "AND codigo_tipo_regiao = $codigo_tipo_regiao";
		return $this->execSQL($sql,$codigo_tipo_regiao_pai);
	}
	function esquemasConexao($codigo_estat_conexao){
		return $this->execSQLDB($codigo_estat_conexao,"SELECT oid,nspname as esquema FROM pg_namespace group by nspname,oid order by nspname");
	}
	function criaEsquemaDB($codigo_estat_conexao,$nome_esquema){
		return $this->execSQLDB($codigo_estat_conexao,"create schema $nome_esquema");
	}
	function tabelasEsquema($codigo_estat_conexao,$nome_esquema){
		return $this->execSQLDB($codigo_estat_conexao,"SELECT table_name as tabela FROM information_schema.tables where table_schema = '$nome_esquema'");
	}
	function criaTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		return $this->execSQLDB($codigo_estat_conexao,"create table ".$nome_esquema.".".$nome_tabela." (gid serial, CONSTRAINT ".$nome_tabela."_pkey PRIMARY KEY (gid ))");
	}
	function alteraNomeTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$novonome_tabela){
		$res = $this->execSQLDB($codigo_estat_conexao,"ALTER TABLE ".$nome_esquema.".".$nome_tabela." RENAME TO ".$novonome_tabela );
		$tabela = $this->execSQLDB($codigo_estat_conexao,"SELECT table_name FROM information_schema.tables where table_name = '$novonome_tabela' and table_schema = '$nome_esquema'");
		if(count($tabela) > 0){
			$sql = "UPDATE i3geoestat_medida_variavel SET tabela = '$novonome_tabela' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_tipo_regiao SET tabela = '$novonome_tabela' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela'";
			$this->execSQL($sql,"",false);
		}
		return $res;
	}
	function copiaTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$novonome_tabela){
		return $this->execSQLDB($codigo_estat_conexao,"CREATE TABLE ".$nome_esquema.".".$novonome_tabela." AS select * from ".$nome_esquema.".".$nome_tabela );
	}
	function colunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		$colunas = array();
		$res = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name as coluna FROM information_schema.columns where table_schema = '$nome_esquema' and table_name = '$nome_tabela'");
		foreach($res as $c){
			$colunas[] = $c["coluna"];
		}
		return $colunas;
	}
	function criaColunaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nova_coluna,$tipo){
		return $this->execSQLDB($codigo_estat_conexao,"ALTER TABLE ".$nome_esquema.".".$nome_tabela." ADD COLUMN $nova_coluna $tipo ");
	}
	function alteraNomeColunaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nome_coluna,$novonome_coluna){
		$res = $this->execSQLDB($codigo_estat_conexao,"ALTER TABLE ".$nome_esquema.".".$nome_tabela." RENAME COLUMN $nome_coluna TO ".$novonome_coluna );
		$coluna = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name FROM information_schema.columns where table_name = '$novonome_tabela' and table_schema = '$nome_esquema' and column_name = '$novonome_coluna'");
		if(count($coluna) > 0){
			$sql = "UPDATE i3geoestat_medida_variavel SET colunavalor = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunavalor = '$nome_coluna'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_medida_variavel SET colunaidgeo = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunaidgeo = '$nome_coluna'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_medida_variavel SET colunaidunico = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunaidgeo = '$nome_coluna'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_tipo_regiao SET colunageo = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' ' and colunageo = '$nome_coluna'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_tipo_regiao SET colunanomeregiao = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' ' and colunanomeregiao = '$nome_coluna'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_tipo_regiao SET colunacentroide = '$novonome_coluna' WHERE esquemadb = '$nome_esquema' and tabela = '$nome_tabela' ' and colunacentroide = '$nome_coluna'";
			$this->execSQL($sql,"",false);

			$sql = "UPDATE i3geoestat_parametro_medida SET coluna = '$novonome_coluna' FROM i3geoestat_medida_variavel WHERE i3geoestat_parametro_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel and esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and coluna = '$nome_coluna'";
			$this->execSQL($sql,"",false);
			$sql = "UPDATE i3geoestat_agregaregiao SET colunaligacao_regiaopai = '$novonome_coluna' FROM i3geoestat_tipo_regiao WHERE i3geoestat_agregaregiao.codigo_tipo_regiao = i3geoestat_tipo_regiao.codigo_tipo_regiao and esquemadb = '$nome_esquema' and tabela = '$nome_tabela' and colunaligacao_regiaopai = '$nome_coluna'";
			$this->execSQL($sql,"",false);
		}
		return $res;
	}
	function descreveColunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela){
		return $this->execSQLDB($codigo_estat_conexao,"SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
	}
	function relatorioCompleto($codigo_variavel=""){
		$dados = array();

		if($codigo_variavel != "" || !empty($codigo_variavel)){
			$vs[] = $this->listaVariavel($codigo_variavel);;
		}
		else{
			$vs = $this->listaVariavel();
		}
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
	//$dados vem de relatorioCompleto
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
	//busca o valor de uma chave em um array multiplo
	function buscaNoArray($lista,$chave,$valor){
		foreach($lista as $l){
			if($l[$chave] == $valor){
				return true;
			}
		}
		return false;
	}
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
				$linha = explode($separador,$linha);
				//var_dump($linha);exit;
				if(count($linha) > 2){
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
				$s .= " WHERE ".$medida["colunaidunico"]."::text = '".$id."' AND ".$medida["colunaidgeo"]."::text = '".$identificador_regiao."'";
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
}
?>