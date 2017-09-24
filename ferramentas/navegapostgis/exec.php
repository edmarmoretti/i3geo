<?php
include_once(dirname(__FILE__)."/../../admin1/php/login.php");
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

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
		$retorno = $navegadoresLocais[0];
	break;
/*
Valor: LISTAARQUIVOS*

Lista os arquivos de um diretório.
*/
	case "LISTAARQUIVOS":
		$retorno = listaArquivos($_GET["diretorio"],true);
	break;
}
cpjson($retorno);
?>