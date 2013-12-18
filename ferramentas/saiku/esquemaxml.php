<?php
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
$m = new Metaestat();

$regioes = $m->listaTipoRegiao();
$hierarquia = array();
//hierarquia de cada regiao
foreach($regioes as $regiao){
	$hregioes = $m->listaHierarquiaRegioes($regiao["codigo_tipo_regiao"]);
	$hierarquias[$regiao["codigo_tipo_regiao"]] = $hregioes;
}
echo "<pre>";var_dump($hierarquias);exit;
$xml = "<Schema name='i3Geo Metaestat'>";
foreach($regioes as $regiao){
	//verifica se a regiao tem hierarquia
	if(count($hierarquias[$regiao["codigo_tipo_regiao"]]) == 0){
		$xml .= "
			<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='".converte($regiao["nome_tipo_regiao"])."'>
				<Hierarchy hasAll='true'  primaryKey='".$regiao["identificador"]."'>
				<Table name='".$regiao["tabela"]."' schema='".$regiao["esquemadb"]."' />
					<Level name='Nome - ".converte($regiao["nome_tipo_regiao"])."' column='".$regiao["colunanomeregiao"]."' uniqueMembers='true'/>
				</Hierarchy>
			</Dimension>
		";
	}
	else{
		$caminho = $m->regiaoFilhaAoPai($regiao["codigo_tipo_regiao"]);
		//echo "<pre>";var_dump($caminho);
		$xml .= "
			<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='".converte($regiao["nome_tipo_regiao"])."'>
				<Hierarchy hasAll='true'  primaryKey='".$regiao["identificador"]."'>
		";
		//cria uma view juntando as tabelas da hierarquia de regioes
		$ri = $regioes[$caminho[0]];
		$sql = "SELECT * FROM {$ri['esquemadb']}.{$ri['tabela']} AS regiao ";
		$nc = count($caminho) - 1;
		for($i=0;$i<$nc;$i++){
			$r = $regioes[$caminho[$i]];
			$sql .= "INNER JOIN {$r['esquemadb']}.{$r['tabela']}
				AS j$i ON j$i.{$r['identificador']}::text = regiao.{$regiao['identificador']}::text
			";
		}
		$h = $hierarquias[$caminho[0]];
		$h = $h[0];
		$sql .= "INNER JOIN {$regiao['esquemadb']}.{$regiao['tabela']}
			AS j ON j.{$regiao['identificador']}::text = regiao.{$h['colunaligacao_regiaopai']}::text
		";
		$xml .= "
				<view><sql>$sql</sql></view>
		";
		//<Level name='Nome - ".converte($regiao["nome_tipo_regiao"])."' column='".$regiao["colunanomeregiao"]."' uniqueMembers='true'/>
		$xml .= "
				</Hierarchy>
			</Dimension>
		";
	}
}

$xml .= "
	<Cube name='Vari&amp;aacute;veis'>";
$medidas = $m->listaMedidaVariavel();
$tabela = "";
foreach($medidas as $medida){
	$agregador = "sum";
	if($medida["permitesoma"] == 0 && $medida["permitemedia"] == 1){
		$agregador = "avg";
	}
	if($medida["permitesoma"] == 0 && $medida["permitemedia"] == 0){
		$agregador = "count";
	}
	if($tabela != $medida["esquemadb"].".".$medida["tabela"]){
		$xml .= "
			<Table name='".$medida["tabela"]."' schema='".$medida["esquemadb"]."' />
			<DimensionUsage foreignKey='".$medida["colunaidgeo"]."' name='codigo_tipo_regiao_".$medida["codigo_tipo_regiao"]."' source='codigo_tipo_regiao_".$medida["codigo_tipo_regiao"]."'/>
		";
	}
	$xml .= "
		<Measure name='id_medida_variavel_".$medida["id_medida_variavel"]."' caption='".converte($medida["nomemedida"])."' column='".$medida["colunavalor"]."' aggregator='".$agregador."' />
	";

	$tabela = $medida["esquemadb"].".".$medida["tabela"];
}
$xml .= "
	</Cube>
	</Schema>";
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