<?php
include_once(dirname(__FILE__)."/../../admin/php/login.php");
$funcoesEdicao = array(
		"LISTARQUIVOS"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/editormapfile") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: LISTADRIVES

Pega a lista de drives registrados para o usu&aacute;rio atual.

A lista de drives &eacute; definida no ms_configura e permite que o usu&aacute;rio navegue pelos arquivos do servidor.
*/
	case "LISTADRIVES":
		include(dirname(__FILE__)."/../ms_configura.php");
		$retorno = $navegadoresLocais[0];
	break;
/*
Valor: LISTAARQUIVOS*

Lista os arquivos de um diretório.
*/
	case "LISTAARQUIVOS":
		$retorno = listaArquivos($diretorio,true);
	break;
}
cpjson($retorno);
?>