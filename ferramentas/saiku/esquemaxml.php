<?php
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
$m = new Metaestat();

$regioes = $m->listaTipoRegiao();
$xml = "<Schema name='i3Geo Metaestat'>";
foreach($regioes as $regiao){
	$caminho = $m->hierarquiaPath($regiao["codigo_tipo_regiao"]);
	//
	//verifica se a regiao tem hierarquia
	if(empty($caminho)){
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
		$xml .= "
			<Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='".converte($regiao["nome_tipo_regiao"])."'>
				<Hierarchy hasAll='true'  primaryKey='".$regiao["identificador"]."'>
		";
		//cria uma view juntando as tabelas da hierarquia de regioes
		$n = count($caminho);
		$r = $m->listaTipoRegiao($caminho[0]);
		$colunas = array();
		$sql = "SELECT __COLUNAS__ FROM {$r['esquemadb']}.{$r['tabela']} AS regiao ";
		$colunas[] = "regiao.".$r['identificador'];
		$colunas[] = "regiao.".$r['colunanomeregiao'];
		$tabelaAnt = "regiao";
		if($n > 1){
			for($i=1;$i<$n;$i++){
				$r = $m->listaTipoRegiao($caminho[$i]);
				$colunas[] = "j".$i.".".$r['colunanomeregiao'];
				$colunas[] = "j".$i.".".$r['identificador'];
				$sql .= "INNER JOIN {$r['esquemadb']}.{$r['tabela']}
					AS j$i ON j$i.{$r['identificador']}::text = {$tabelaAnt}.{$r['identificador']}::text
				";
				$tabelaAnt = "j".$i;
			}
		}
		$sql .= "INNER JOIN {$regiao['esquemadb']}.{$regiao['tabela']}
					AS j$i ON j$i.{$regiao['identificador']}::text = {$tabelaAnt}.{$regiao['identificador']}::text
				";
		$colunas[] = "j".$i.".".$regiao['colunanomeregiao'];
		$colunas[] = "j".$i.".".$regiao['identificador'];
		$colunas = implode($colunas,",");
		$sql = str_replace("__COLUNAS__",$colunas,$sql);
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
