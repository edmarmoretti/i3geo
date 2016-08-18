<?php
include_once(dirname(__FILE__)."/../../admin/php/login.php");
$funcoesEdicao = array(
		"LISTARQUIVOS",
		"LISTADRIVES"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/editormapfile") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;

		//se nao estiver logado permite acesso a pasta i3geo/aplicmap/dados
		//localiza a pasta aplicmap/dados
		$d = dirname(__FILE__); //precisa descer ainda
		$d = dirname($d);
		$d = dirname($d)."/aplicmap/dados"; //pasta permitida
		if(strpos($diretorio,$d) === false){
			if(strtoupper($funcao) == "LISTADRIVES"){
				//lista a pasta default
				$retorno = 	array(
					"drives"=>array(
						array("caminho"=>$d,"nome"=>"Dados")
					)
				);
				cpjson($retorno);
			}
		}
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
		//pega apenas os nomes para nao expor o caminho completo
		$d = $navegadoresLocais[0]["drives"];
		$resultado = array();
		//a primeira string sera o nome definido em drives
		foreach($d as $n){
			$n["caminho"] = $n["nome"];
			$resultado[] = $n;
		}
		$retorno = array("drives"=>$resultado);
	break;
/*
Valor: LISTAARQUIVOS*

Lista os arquivos de um diretório.
*/
	case "LISTAARQUIVOS":
		//pega o caminho
		//nome
		$nome = explode("/",$_GET["diretorio"]);
		$nome = $nome[0];
		if(empty($nome)){
			$retorno = "erro";
		}
		else{
			//remove o nome do caminho
			$novo = explode("/",$_GET["diretorio"]);
			$novo[0] = "";
			$_GET["diretorio"] = implode("/",$novo);
			//
			include(dirname(__FILE__)."/../../ms_configura.php");
			$d = $navegadoresLocais[0]["drives"];
			$p = "";
			foreach($d as $n){
				if($n["nome"] == $nome){
					$p = $n["caminho"];
				}
			}
			if($p != "" && file_exists($p)){
				$path = $p."/".$_GET["diretorio"];
				$path = str_replace(".","",$path);
				$retorno = listaArquivos($path,true);
			}
			else{
				$retorno = "erro";
			}
		}
	break;
}
cpjson($retorno);
?>