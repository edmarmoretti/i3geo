<?php
/**
 * Este programa e usado para testes do plugin de parametrizacao
 *
 * Veja o mapfile i3geo/temas/_llocaliphp.map
 *
 * Eh incluido em i3geo/ferramentas/parametrossql/exec.php
 *
 * Deve definir a variavel $retorno com um json contendo nome,valor
 */
$retorno = array(
	array(
		"n"=> "Ano de 1960",
		"v" => "1960"
	),
	array(
		"n"=> "Ano de 1970",
		"v" => "1970"
	),
	array(
		"n" => "Ano de 1980",
		"v" => "1980"
	),
	array(
		"n" => "Ano de 1990",
		"v" => "1990"
	)
);
echo json_encode($retorno);
?>