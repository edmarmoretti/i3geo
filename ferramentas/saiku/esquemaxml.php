<?php
var_dump($_COOKIE);exit;
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
$m = new Metaestat();

$regioes = $m->listaTipoRegiao();
$xml = "<Schema name='i3Geo Metaestat'>";
/*
echo "<pre>";
foreach($regioes as $regiao){
	echo $regiao["codigo_tipo_regiao"]."<br>";
	$caminho = $m->hierarquiaPath($regiao["codigo_tipo_regiao"]);
	var_dump($caminho);
}
exit;
*/

//cria as dimensoes de tipo temporal
$sqlAno = "select nu_ano from i3geo_metaestat.dim_tempo group by nu_ano order by nu_ano";
$sqlMes = "select nu_ano,nu_mes,ds_mes_abreviado as mes,nu_ano::text||'-'||nu_mes::text as nu_anomes from i3geo_metaestat.dim_tempo group by nu_ano,nu_mes,mes,nu_anomes order by nu_ano,nu_mes";
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
";
foreach($regioes as $regiao){
	$caminho = $m->hierarquiaPath($regiao["codigo_tipo_regiao"]);
	//
	//verifica se a regiao tem hierarquia
	if(empty($caminho)){
		$xml .= "
			<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='Onde: ".converte($regiao["nome_tipo_regiao"])."'>
				<Hierarchy hasAll='true'  primaryKey='".$regiao["identificador"]."'>
				<Table name='".$regiao["tabela"]."' schema='".$regiao["esquemadb"]."' />
					<Level name='Nome - ".converte($regiao["nome_tipo_regiao"])."' column='".$regiao["colunanomeregiao"]."' uniqueMembers='true'/>
				</Hierarchy>
			</Dimension>
		";
	}
	else{
		$xml .= "
			<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='Onde: ".converte($regiao["nome_tipo_regiao"])."'>
				<Hierarchy hasAll='true'  primaryKey='codigo'>
		";
		//cria uma view juntando as tabelas da hierarquia de regioes
		$n = count($caminho);
		$colunas = array();
		$niveis = array();
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
			$niveis[] = "
				<Level name='".converte($r["nome_tipo_regiao"])."'
					column='j$i{$r['identificador']}'
					nameColumn='j$i{$r["colunanomeregiao"]}' uniqueMembers='false'/>
			";

		}
		$niveis[] = "
			<Level name='".converte($regiao["nome_tipo_regiao"])."'
				column='codigo'
				nameColumn='nome' uniqueMembers='true'>
		";

		//verifica outras colunas
		$vis = $regiao['colunasvisiveis'];
		if($vis != ""){
			$vis = str_replace(";",",",$vis);
			$vis = str_replace(",,",",",$vis);
			$vis = explode(",",$vis);
			foreach($vis as $v){
				//if($v != $regiao['colunanomeregiao'] && $v != $regiao['identificador']){
					$colunas[] = "regiao.".$v." as ".$v;
				//}
			}
			$colunas = array_unique($colunas);
		}
		$colunas = implode($colunas,",");
		$sql = str_replace("__COLUNAS__",$colunas,$sql);
		$xml .= "
				<view alias='view_codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' ><SQL dialect='generic' >$sql</SQL></view>
		";
		$xml .= implode(" ",$niveis);
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
		//fecha os elementos. LEVEL deve ser fechado pois o ultimo recebe as propriedades
		$xml .= "
				</Level>
				</Hierarchy>
			</Dimension>
		";
	}
}
//junta as medidas conforme o nome da tabela utilizada
$medidas = $m->listaMedidaVariavel();
$tbs = array();

foreach($medidas as $medida){
	$k = $medida["esquemadb"].$medida["tabela"];
	if(empty($tbs[$k])){
		$tbs[$k] = array($medida);
	}
	else{
		array_push($tbs[$k],$medida);
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
	//verifica as dimensoes do tipo tempo
	$dimTempo = array();
	foreach($tb as $medida){
		$parametros = $m->listaParametro($medida["id_medida_variavel"],"","",$apenasTempo=true,$ordenaPeloPai=false);
		$parComposto = array(); //guarda a composicao da chave que liga com a dimensao
		foreach($parametros as $parametro){
			if($parametro["tipo"] == 1){
				if(count($parametros) == 1){
					$VirtualCubeDimension[] = "
						<VirtualCubeDimension name='Anual' />
					";
					$dimTempo[] = "
						<DimensionUsage foreignKey='".$parametro["coluna"]."' name='Anual' source='Anual'/>
					";
				}
				$parComposto[] = $parametro["coluna"];
			}
			if($parametro["tipo"] == 2){
				$parComposto[] = $parametro["coluna"];
				if(count($parametros) == 2){
					$VirtualCubeDimension[] = "
						<VirtualCubeDimension name='Mensal' />
					";
					$dimTempo[] = "
						<DimensionUsage foreignKey='".implode("_",$parComposto)."' name='Mensal' source='Mensal'/>
					";
				}
			}
		}
		//echo "<pre>";var_dump($parametro);exit;
	}
	$xml .= "
	<Cube name='{$c["esquemadb"]}{$c["tabela"]}'>";
	$sql = "select * from {$c["esquemadb"]}.{$c["tabela"]}";
	if(count($parComposto) > 0){
		$sql = "select *,".implode("||'-'||",$parComposto)." as ".implode("_",$parComposto)." from {$c["esquemadb"]}.{$c["tabela"]}";
	}
	$xml .= "
		<view alias='view_{$c["esquemadb"]}{$c["tabela"]}' ><SQL dialect='generic' >$sql</SQL></view>
			<DimensionUsage foreignKey='".$c["colunaidgeo"]."' name='codigo_tipo_regiao_".$c["codigo_tipo_regiao"]."' source='codigo_tipo_regiao_".$c["codigo_tipo_regiao"]."'/>
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
$xml .= '<VirtualCube name="i3Geo - Metaestat" >';
$VirtualCubeDimension = array_unique($VirtualCubeDimension);
$VirtualCubeMeasure = array_unique($VirtualCubeMeasure);
$xml .= implode(" ",$VirtualCubeDimension);
$xml .= implode(" ",$VirtualCubeMeasure);
$xml .= '</VirtualCube>';
$xml .= "</Schema>";
error_reporting(0);
ob_end_clean();
echo header("Content-type: application/xml");
echo $xml;
exit;
function converte($texto)
{
	//$texto = str_replace("Í","&amp;iacute",$texto);
$texto = str_replace("&","&amp;",htmlentities($texto));
	return $texto;
}
?>
