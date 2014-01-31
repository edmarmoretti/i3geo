<?php
if(empty($_GET["g_sid"])){
	echo "erro";
	exit;
}
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
if(!isset($dir_tmp)){
	include(dirname(__FILE__)."/../../ms_configura.php");
}
//pega a sessao PHP aberta pelo i3Geo
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();

$map_file = $_SESSION["map_file"];
$nomeConexao = nomeRandomico();
$nomeDatasource = $dir_tmp."/saiku-datasources/".$nomeConexao;
$urlXmlEsquema = $_SESSION["tmpurl"].basename(dirname($map_file))."/".$nomeConexao.".xml";
$arquivoXmlEsquema = dirname($map_file)."/".$nomeConexao.".xml";
/*
$saikuConfigDataSource vem do ms_configura.php

Exemplo de arquivo de fonte:
type=OLAP
name=i3geo
driver=mondrian.olap4j.MondrianOlap4jDriver
location=jdbc:mondrian:Jdbc=jdbc:postgresql://localhost:5432/i3geosaude;Catalog=http://localhost/i3geo/ferramentas/saiku/esquemaxml.php;JdbcDrivers=org.postgresql.Driver;
username=postgres
password=postgres

Array com os parametros definidos em ms_configura:

$saikuConfigDataSource = array(
	"type"=>"OLAP",
	"driver"=>"mondrian.olap4j.MondrianOlap4jDriver",
	"location"=>"jdbc:mondrian:Jdbc=jdbc:postgresql",
	"serverdb"=>"localhost",
	"port"=>"5432",
	"database"=>"i3geosaude",
	"JdbcDrivers"=>"org.postgresql.Driver",
	"username"=>"postgres",
	"password"=>"postgres"
);
*/
$stringDatasource = "
type={$saikuConfigDataSource["type"]}
name={$nomeConexao}
driver={$saikuConfigDataSource["driver"]}
location={$saikuConfigDataSource["location"]}://{$saikuConfigDataSource["serverdb"]}:{$saikuConfigDataSource["port"]}/{$saikuConfigDataSource["database"]};Catalog={$urlXmlEsquema};JdbcDrivers={$saikuConfigDataSource["JdbcDrivers"]};
username={$saikuConfigDataSource["username"]}
password={$saikuConfigDataSource["password"]}
";
//salva o arquivo com a fonte
gravaDados(array($stringDatasource),$nomeDatasource);
$m = new Metaestat();
$selecaoRegiao = array();
//obtem os layers que sao do sistema metaestat, sao regioes e que possuem selecao
$mapa = ms_newMapObj($map_file);
$c = $mapa->numlayers;
$codigo_tipo_regiao = "";
for ($i=0;$i < $c;++$i){
	$l = $mapa->getlayer($i);
	//verifica o alias na conexao
	if (!empty($postgis_mapa)){
		if ($l->connectiontype == MS_POSTGIS){
			$lcon = $l->connection;
			if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
				if(($lcon == " ") || ($lcon == "")) //para efeitos de compatibilidade
				{$l->set("connection",$postgis_mapa);}
				else{
					$l->set("connection",$postgis_mapa[$lcon]);
				}
			}
		}
	}	
	//
	$registros = array();
	if($l->status == MS_DEFAULT && $l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO") != ""){
		$codigo_tipo_regiao = $l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO");
		//verifica se tem selecao
		$qyfile = dirname($map_file)."/".$l->name.".php";
		if(file_exists($qyfile)){
			//pega os registros
			$shapes = retornaShapesSelecionados($l,$map_file,$mapa);
			//pega o nome da coluna que identifica cada registro
			$regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
			$item = $regiao["identificador"];
			foreach($shapes as $shape){
				$registros[] = $shape->values[$item];
			}
			$reg = $item." IN ('".implode("','",$registros)."') ";
			$selecaoRegiao[$codigo_tipo_regiao] = array(
					"item" => $item,
					"sql" => $reg
			);
			break; //mantem a primeira ocorrencia de regiao que possui selecao
		}
		else{
			$selecaoRegiao[$codigo_tipo_regiao] = "";
		}
	}
}
if($codigo_tipo_regiao == ""){
	$regioes = $m->listaTipoRegiao();
}
else{
	$regioes = array($m->listaTipoRegiao($codigo_tipo_regiao));
}
$regiao = "";
$item = "";
$registros = "";
//echo "<pre>";var_dump($regioes);exit;
$xml = "<Schema name='i3Geo Metaestat'>";
//cria as dimensoes de tipo temporal
$sqlAno = "select nu_ano from ".$saikuConfigDataSource['tabelaDimensaoTempo']." group by nu_ano order by nu_ano";
$sqlMes = "select nu_ano::text,nu_mes::text,ds_mes_abreviado as mes,COALESCE (nu_ano::text||'-'||nu_mes::text,nu_ano::text) as nu_anomes from ".$saikuConfigDataSource['tabelaDimensaoTempo']." group by nu_ano,nu_mes,mes,nu_anomes order by nu_ano,nu_mes";
$xml .= "
	<Dimension name='Anual' type='TimeDimension' caption='Tempo: Anual'>
		<Hierarchy hasAll='true' primaryKey='nu_ano'>
			<view alias='tempo_ano' ><SQL dialect='generic' >$sqlAno</SQL></view>
			<Level name='Ano' column='nu_ano' type='Numeric' uniqueMembers='true' levelType='TimeYears'/>
		</Hierarchy>
	</Dimension>
	<Dimension name='Mensal' type='TimeDimension' caption='Tempo: Mensal'>
		<Hierarchy hasAll='true' primaryKey='nu_anomes'>
			<view alias='tempo_ano' ><SQL dialect='generic' >$sqlMes</SQL></view>
			<Level name='Ano' column='nu_ano' type='Numeric' uniqueMembers='true' levelType='TimeYears'/>
			<Level nameColumn='mes' name='Mes' column='nu_mes' type='Numeric' uniqueMembers='false' levelType='TimeMonths'/>
		</Hierarchy>
	</Dimension>
	<Dimension name='Tempo' type='TimeDimension' caption='Tempo'>
		<Hierarchy hasAll='true' primaryKey='nu_anomes'>
			<view alias='tempo' ><SQL dialect='generic' >$sqlMes</SQL></view>
			<Level name='Ano' column='nu_ano' type='String' uniqueMembers='true' levelType='TimeYears'/>
			<Level nameColumn='mes' name='Mes' column='nu_mes' type='String' uniqueMembers='false' levelType='TimeMonths'/>
		</Hierarchy>
	</Dimension>
";
//as dimensoes sao duplicadas
//uma delas contem o geocodigo que permite a geracao do mapa
$xml1 = "";
$xml2 = "";
foreach($regioes as $regiao){
	$caminho = $m->hierarquiaPath($regiao["codigo_tipo_regiao"]);
	$xml1 .= "
		<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='Onde:".converte($regiao["nome_tipo_regiao"])."'>
			<Hierarchy hasAll='true'  primaryKey='codigo'>
	";
	$xml2 .= "
		<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."_geocod' caption='GeoCod:".converte($regiao["nome_tipo_regiao"])."'>
			<Hierarchy hasAll='true'  primaryKey='codigo'>
	";
	//cria uma view juntando as tabelas da hierarquia de regioes
	$n = count($caminho);
	$colunas = array();
	$niveis1 = array();
	$niveis2 = array();
	$sql = "SELECT __COLUNAS__ FROM {$regiao['esquemadb']}.{$regiao['tabela']} AS regiao ";
	$colunas[] = "regiao.{$regiao['identificador']} AS codigo ";
	$colunas[] = "regiao.{$regiao['colunanomeregiao']} AS nome";
	$tabelaAnt = "regiao";
	for($i=0;$i<$n;$i++){
		$r = $m->listaTipoRegiao($caminho[$i]);
		$colunas[] = "j$i.{$r['colunanomeregiao']} AS j$i{$r['colunanomeregiao']}";
		$colunas[] = "j$i.{$r['identificador']}  AS j$i{$r['identificador']}";
		$sql .= "INNER JOIN {$r['esquemadb']}.{$r['tabela']}
			AS j$i ON j$i.{$r['identificador']}::text = {$tabelaAnt}.{$r['identificador']}::text
		";
		$tabelaAnt = "j".$i;
		$niveis1[] = "
			<Level name='".converte($r["nome_tipo_regiao"])."'
				column='j$i{$r['identificador']}'
				nameColumn='j$i{$r["colunanomeregiao"]}' uniqueMembers='false'/>
		";
		$niveis2[] = "
			<Level name='".converte($r["nome_tipo_regiao"])." - GeoCod #{$caminho[$i]}'
				column='j$i{$r['identificador']}'
				nameColumn='j$i{$r["identificador"]}' uniqueMembers='false'/>
		";
	}
	$niveis1[] = "
		<Level name='".converte($regiao["nome_tipo_regiao"])."'
			column='codigo'
			nameColumn='nome' uniqueMembers='true' />
	";
	$niveis2[] = "
		<Level name='".converte($regiao["nome_tipo_regiao"])." - GeoCod #{$regiao["codigo_tipo_regiao"]}'
			column='codigo'
			nameColumn='codigo' uniqueMembers='true' />
	";
	//verifica outras colunas
	$vis = $regiao['colunasvisiveis'];
	if($vis != ""){
		$vis = str_replace(";",",",$vis);
		$vis = str_replace(",,",",",$vis);
		$vis = explode(",",$vis);
		foreach($vis as $v){
			$colunas[] = "regiao.".$v." as ".$v;
		}
		$colunas = array_unique($colunas);
	}
	$colunas = implode($colunas,",");
	$sql = str_replace("__COLUNAS__",$colunas,$sql);
	//inclui a selecao se houver
	if(!empty($selecaoRegiao[$regiao["codigo_tipo_regiao"]]))
		$rs = $selecaoRegiao[$regiao["codigo_tipo_regiao"]];
	$pos = strpos($sql, "regiao.".$rs["item"]." ");
	if($rs != "" || !$pos === false){
		$sql .= " WHERE regiao.".$rs["sql"];
	}

	$xml1 .= "
			<view alias='view_codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' ><SQL dialect='generic' >$sql</SQL></view>
	";
	$xml2 .= "
			<view alias='view_codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."_GeoCod' ><SQL dialect='generic' >$sql</SQL></view>
	";
	$xml1 .= implode(" ",$niveis1);
	$xml2 .= implode(" ",$niveis2);
	/*
	//verifica se existem propriedades (colunas adicionais)
	if($vis != ""){
		//apelidos
		$apelidos = $regiao['apelidos'];
		if($apelidos != ""){
			$apelidos = str_replace(";",",",$apelidos);
			$apelidos = str_replace(",,",",",$apelidos);
			$apelidos = converte($apelidos);
			$apelidos = explode(",",$apelidos);
		}
		else{
			$apelidos = $vis;
		}
		$nvis = count($vis);
		for($i = 0; $i < $nvis; $i++){
			$xml .= "
				<Property name='{$apelidos[$i]}' column='{$vis[$i]}'/>
			";
		}
	}
	*/
	$xml1 .= "
			</Hierarchy>
		</Dimension>
	";
	$xml2 .= "
			</Hierarchy>
		</Dimension>
	";
}
$xml .= $xml1.$xml2;
//junta as medidas conforme o nome da tabela utilizada
$medidas = $m->listaMedidaVariavel();
$tbs = array();

foreach($medidas as $medida){
	if($medida["codigo_tipo_regiao"] == $codigo_tipo_regiao){
		$k = $medida["esquemadb"].$medida["tabela"];
		if(empty($tbs[$k])){
			$tbs[$k] = array($medida);
		}
		else{
			array_push($tbs[$k],$medida);
		}
	}
}

//monta os cubos para cada esquema.tabela diferente
$VirtualCubeDimension = array();
$VirtualCubeMeasure = array();
foreach($tbs as $tb){
	//cabecalho de cada cubo obtido da primeira medida
	$c = $tb[0];
	$VirtualCubeDimension[] = "
		<VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}' />
	";
	$VirtualCubeDimension[] = "
		<VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}_geocod' />
	";
	//verifica as dimensoes do tipo tempo
	$dimTempo = array();
	foreach($tb as $medida){
		$parametros = $m->listaParametro($medida["id_medida_variavel"],"","",$apenasTempo=true,$ordenaPeloPai=false);
		$parComposto = array(); //guarda a composicao da chave que liga com a dimensao
		$colunaAdicionais = array();
		foreach($parametros as $parametro){
			if($parametro["tipo"] < 5){
				$parComposto[] = $parametro["coluna"];
			}
		}
		$VirtualCubeDimension[] = "
						<VirtualCubeDimension name='Tempo' />
					";
		$dimTempo[] = "
						<DimensionUsage foreignKey='".implode("_",$parComposto)."_' name='Tempo' source='Tempo'/>
					";
	}
	$xml .= "
	<Cube cache='false' name='{$c["esquemadb"]}{$c["tabela"]}'>";
	$sql = "select * from {$c["esquemadb"]}.{$c["tabela"]}";
	if(count($parComposto) > 0){
		$sql = "select *,".implode("||'-'||",$parComposto)."::text as ".implode("_",$parComposto)."_ from {$c["esquemadb"]}.{$c["tabela"]}";
	}
	$xml .= "
		<view alias='view_{$c["esquemadb"]}{$c["tabela"]}' ><SQL dialect='generic' >$sql</SQL></view>
			<DimensionUsage foreignKey='".$c["colunaidgeo"]."' name='codigo_tipo_regiao_".$c["codigo_tipo_regiao"]."' source='codigo_tipo_regiao_".$c["codigo_tipo_regiao"]."'/>
			<DimensionUsage foreignKey='".$c["colunaidgeo"]."' name='codigo_tipo_regiao_".$c["codigo_tipo_regiao"]."_geocod' source='codigo_tipo_regiao_".$c["codigo_tipo_regiao"]."_geocod'/>
	";

	$xml .= implode(" ",array_unique($dimTempo));

	//inclui cada elemento em medida
	foreach($tb as $medida){
		$agregador = "sum";
		if($medida["permitesoma"] == 0 && $medida["permitemedia"] == 1){
			$agregador = "avg";
		}
		if($medida["permitesoma"] == 0 && $medida["permitemedia"] == 0){
			$agregador = "count";
		}
		$xml .= "
			<Measure name='id_medida_variavel_".$medida["id_medida_variavel"]."' caption='".converte($medida["nomemedida"])."' column='".$medida["colunavalor"]."' aggregator='".$agregador."' />
		";
		$VirtualCubeMeasure[] = "
			<VirtualCubeMeasure cubeName='{$c["esquemadb"]}{$c["tabela"]}' name='[Measures].[id_medida_variavel_".$medida["id_medida_variavel"]."]'/>
		";
	}
	$xml .= "
		</Cube>
		";
}
$xml .= '<VirtualCube name="Todas as medidas" >';
$VirtualCubeDimension = array_unique($VirtualCubeDimension);
$VirtualCubeMeasure = array_unique($VirtualCubeMeasure);
$xml .= implode(" ",$VirtualCubeDimension);
$xml .= implode(" ",$VirtualCubeMeasure);
$xml .= '</VirtualCube>';
$xml .= "</Schema>";
error_reporting(0);
ob_end_clean();

gravaDados(array($xml),$arquivoXmlEsquema);
header("Location:".$saikuUrl."/?nomeConexao=".$nomeConexao."&locaplic=".$_GET["locaplic"]."&g_sid=".$_GET["g_sid"]."&mapext=".$_GET["mapext"]);

function converte($texto){
	$texto = str_replace("&","&amp;",htmlentities($texto));
	//$texto = htmlentities($texto);
	//$texto = mb_convert_encoding($texto, 'UTF-8', mb_detect_encoding($texto));
	//$texto = utf8_encode($texto);
	return $texto;
}
?>
