<?php
/*
Title: exec.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
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

*/
include_once(dirname(__FILE__)."/../inicia.php");
include_once(dirname(__FILE__)."/../../admin/php/login.php");
$funcoesEdicao = array(
		"ADICIONAGEOMETRIA",
		"EXCLUIREGISTRO",
		"SALVAREGISTRO"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/editormapfile") == false){
		retornaJSON("Vc nao pode realizar essa operacao. Tente fazer login novamente.");exit;
	}
}
$retorno = "";
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	case "ADICIONAGEOMETRIA":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		if(strtolower($layer->getmetadata("EDITAVEL")) != "sim"){
			$retorno = "erro";
		}
		else{
			$tabela = $layer->getmetadata("TABELAEDITAVEL");
			$esquema = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
			$colunaidunico = $layer->getmetadata("COLUNAIDUNICO");
			$colunageometria = $layer->getmetadata("COLUNAGEOMETRIA");
			if($colunageometria == ""){
				$retorno = "erro";
			}
			$c = stringCon2Array($layer->connection);
			try {
				$dbh = new PDO('pgsql:dbname='.$c["dbname"].';user='.$c["user"].';password='.$c["password"].';host='.$c["host"].';port='.$c["port"]);
				//pega o SRID
				$sql = "select ST_SRID($colunageometria) as srid from $esquema"."."."$tabela LIMIT 1";
				//echo $sql;exit;
				$q = $dbh->query($sql,PDO::FETCH_ASSOC);
				$r = $q->fetchAll();
				$srid = $r[0]["srid"];

				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$dbh->beginTransaction();

				$sql = "INSERT INTO ".$esquema.".".$tabela." (".$colunageometria.")";
				$sql .= " VALUES (ST_GeomFromText('SRID=$srid;".$wkt."'))";

				$sth = $dbh->exec($sql);
				$dbh->commit();
				$retorno = "ok";
			} catch (Exception $e) {
				$dbh->rollBack();
				$retorno = array("Falhou: " . $e->getMessage());
			}
		}
	break;
	case "EXCLUIREGISTRO":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		if(strtolower($layer->getmetadata("EDITAVEL")) != "sim"){
			$retorno = "erro";
		}
		else{
			$tabela = $layer->getmetadata("TABELAEDITAVEL");
			$esquema = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
			$colunaidunico = $layer->getmetadata("COLUNAIDUNICO");
			$colunageometria = $layer->getmetadata("COLUNAGEOMETRIA");
			if($colunageometria == ""){
				$retorno = "erro";
			}
			$c = stringCon2Array($layer->connection);
			try {
				$dbh = new PDO('pgsql:dbname='.$c["dbname"].';user='.$c["user"].';password='.$c["password"].';host='.$c["host"].';port='.$c["port"]);
				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$dbh->beginTransaction();
				$sql = "DELETE from ".$esquema.".".$tabela." where ".$colunaidunico."::text = '$identificador' ";
				$sth = $dbh->exec($sql);
				$dbh->commit();
			} catch (Exception $e) {
				$dbh->rollBack();
				$retorno = array("Falhou: " . $e->getMessage());
			}
		}
		$retorno = "ok";
	break;
	case "SALVAREGISTRO":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		if(strtolower($layer->getmetadata("EDITAVEL")) != "sim"){
			$retorno = "erro";
		}
		else{
			$tabela = $layer->getmetadata("TABELAEDITAVEL");
			$esquema = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
			$colunaidunico = $layer->getmetadata("COLUNAIDUNICO");
			if($colunageometria == ""){
				$retorno = "erro";
			}
			$c = stringCon2Array($layer->connection);
			try {
				$dbh = new PDO('pgsql:dbname='.$c["dbname"].';user='.$c["user"].';password='.$c["password"].';host='.$c["host"].';port='.$c["port"]);
				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$dbh->beginTransaction();
				$sql = "UPDATE ".$esquema.".".$tabela." SET $coluna = '$valor' where ".$colunaidunico."::text = '$identificador' ";
				$sth = $dbh->exec($sql);
				$dbh->commit();
			} catch (Exception $e) {
				$dbh->rollBack();
				$retorno = array("Falhou: " . $e->getMessage());
			}
		}
		$retorno = "ok";
		break;
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
		restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>