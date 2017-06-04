<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include("../../ms_configura.php");
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
if(empty($navegadoresLocais)){
	cpjson("veja ms_configura.php");
	exit;
}
switch (strtoupper($funcao))
{
/*
Valor: LISTADRIVES

Pega a lista de drives registrados para o usu&aacute;rio atual.

A lista de drives &eacute; definida no ms_configura e permite que o usu&aacute;rio navegue pelos arquivos do servidor.
*/
	case "LISTADRIVES":
		if(!empty($navegadoresLocais)){
			//verifica se est&aacute; cadastrado
			$ipcliente = pegaIPcliente();
			$retorno = array();
			$ips = array();
			//pega os nomes de cada ip
			foreach ($navegadoresLocais["ips"] as $n){
				$ips[] = gethostbyname($n);
				$ips[] = $n;
			}
			if(in_array($ipcliente,$ips) || empty($navegadoresLocais["ips"])){
				$retorno = array_keys($navegadoresLocais["drives"]);

			} else {
				$retorno = array();
			}
		} else {
			$retorno = array();
		}
	break;
/*
Valor: LISTAARQUIVOS*

Lista os arquivos de um diretório.
*/
	case "LISTAARQUIVOS":
		if(!empty($navegadoresLocais)){
			//verifica se est&aacute; cadastrado
			$ipcliente = pegaIPcliente();
			$retorno = array();
			$ips = array();
			//pega os nomes de cada ip
			foreach ($navegadoresLocais["ips"] as $n){
				$ips[] = gethostbyname($n);
				$ips[] = $n;
			}
			if(in_array($ipcliente,$ips) || empty($navegadoresLocais["ips"])){
				$drives = array_keys($navegadoresLocais["drives"]);
				//pega o caminho
				//nome
				$nome = explode("/",$_GET["diretorio"]);
				$nome = $nome[0];
				if(empty($nome) || !in_array($nome,array_keys($drives))){
					$retorno = array();
				}
				else{
					//remove o nome do caminho
					$novo = explode("/",$_GET["diretorio"]);
					$nome = array_shift($novo);
					$_GET["diretorio"] = implode("/",$novo);
					$d = $navegadoresLocais["drives"];
					$p = $d[$nome];
					if($p != "" && file_exists($p)){
						$path = $p."/".$_GET["diretorio"];
						$path = str_replace(".","",$path);
						$retorno = listaArquivos($path,true);
						$retorno["path"] = str_replace("//","/",$nome."/".$_GET["diretorio"]);
					}
					else{
						$retorno = array();
					}
				}
			} else {
				$retorno = array();
			}
		} else {
			$retorno = array();
		}
	break;
}
cpjson($retorno);
?>