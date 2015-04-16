<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: TEMA2SLD

Mostra na tela o SLD de um tema

<Temas->sld>
*/
	case "TEMA2SLD":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		$m = new Temas($map_file,$tema);
		$sld = $m->sld();
		echo header('Content-Disposition: attachment; filename="'.$tema.'.sld"');
		echo header("Content-type: application/xml");
		echo $m->sld();
		exit;
	break;
/*
function: ADICIONALABELCLASSE

Adiciona LABEL em uma classe de um layer

<Temas->adicionaLabel>
*/
	case "ADICIONALABELCLASSE":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		$m = new Temas($map_file,$tema);
		$l = $m->mapa->getlayerbyname($tema);
		if(empty($item))
		{$retorno = "erro";}
		else{
			//$l->set("labelitem",$item);
			$novac = $l->getclass($classe);
			$m->adicionaLabel($novac,$wrap,$fonte,$tamanho,$angulo,$fundo,$sombra,$cor,$outlinecolor,$shadowcolor,$shadowsizex,$shadowsizey,$force,$mindistance,$minfeaturesize,$offsetx,$offsety,$partials,$position,"[".$item."]");
			$m->salva();
			$retorno = "ok";
		}
	break;
/*
function: REMOVELABELCLASSE

Remove LABEL em uma classe de um layer
*/
	case "REMOVELABELCLASSE":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		$m = new Temas($map_file,$tema);
		$m->removeLabel($classe);
		$m->salva();
		$retorno = "ok";
	break;
/*
Valor: EDITALEGENDA

Cria elementos para construir uma legenda no formato de tabela em HTML.

<Legenda->tabelaLegenda>
*/
	case "EDITALEGENDA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda();
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$retorno = $r;
	break;
/*
Valor: CONTAGEMCLASSE

Acrescenta a contagem de elementos em cada classe.

<Legenda->tabelaLegenda>
*/
	case "CONTAGEMCLASSE":
		//apresenta erro com palavras acentuadas
		include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda("sim");
		$m->salva();
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$retorno = $r;
	break;
	/*
	 Valor: APLICATODASCLASSES

	Aplica um parametro a todas as classes
	*/
	case "APLICATODASCLASSES":
		include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->aplicaTodasClasses($parametro,$valor);
		$m->salva();
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$retorno = $r;
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