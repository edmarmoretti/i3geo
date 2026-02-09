<?php
/*
Title: graficos.php

Fun&ccedil;&otilde;es de representa&ccedil;&atilde;o gr&aacute;fica de dados com o software R.
Gera scripts na linguagem R para ser executados como CGI.

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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/graficos.php
*/



function iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,$percentual,$ext="",$incluicores=true,$ordenax="nao")
{
    $map = ms_newMapObj($map_file);
	if($ext && $ext != ""){
		$e = explode(" ",$ext);
		$extatual = $map->extent;
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
	}
	$layer = $map->getLayerByName($tema);
	//verifica se tem selecao
	$selecionados = carregaquery2($map_file,$layer,$map);
	if ($exclui == ""){
	    $exclui = "nulo";
	}

	//pega os valores
	//$itemvalores pode ser um array de intens
	$nnval = array();
	if(!is_array($itemvalores)){
		$valores = pegaValoresM($map,$layer,array($itemclasses,$itemvalores),$exclui,$selecionados);
		//agrupa se for o caso
		$dados = agrupaValores($valores,0,1,$tipo);
		foreach($valores as $valor){
			if(!empty($valor[0])){
				$cores[$valor[0]] = $valor["cores"];
			}
		}
		//calcula os parametros para o grafico
		$nval = count($dados);
		$max = max($dados);
		$soma = array_sum($dados);
		$tempm = array_keys($dados);
		$tempval = array();
		$nnval[] = "n;x";
		if ($tipo != "xy"){
			for ($i=0;$i < $nval; ++$i){
				if ($tempm[$i] != "" && $dados[$tempm[$i]] > 0){
					$pp = ($dados[$tempm[$i]] * 100) / $soma;
					if ($percentual == "TRUE"){
						$temp = "'".$tempm[$i]." (".round($pp,0)."%)';".$dados[$tempm[$i]];
						if($incluicores == true){
							$temp = $temp.";".$cores[$tempm[$i]];
						}
					}
					else{
						$temp = "'".$tempm[$i]."';".$dados[$tempm[$i]];
						if($incluicores == true){
							$temp = $temp.";".$cores[$tempm[$i]];
						}
					}
					$tempval[] = $temp;
				}
			}
			$nval = count($tempval);
		}
		else{
			foreach ($valores as $v){
				$temp = $v[0].";".$v[1];
				if($incluicores == true){
					$temp = $temp.";".$cores[$v[0]];
				}
				$tempval[] = $temp;
			}
		}
		if($ordenax == "sim"){
			sort($tempval);
		}
		$nnval = array_merge($nnval,$tempval);
	}
	else{
		$colunas = array_merge(array($itemclasses),$itemvalores);
		$valores = pegaValoresM($map,$layer,$colunas,$exclui,$selecionados);
		$nval = count($dados);
		$nnval[] = implode(";",$colunas);
		foreach($valores as $valor){
			$nnval[] = implode(";",$valor);
		}
		$max = "";
	}
	return array("dados"=>$nnval,"ndados"=>$nval,"max"=>$max);
}
function dadosLinhaDoTempo($map_file,$tema,$ext="")
{
	$map = ms_newMapObj($map_file);

	if($ext && $ext != ""){
		$e = explode(" ",$ext);
		$extatual = $map->extent;
		$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
	}

	$layer = $map->getLayerByName($tema);
	$selecionados = carregaquery2($map_file,$layer,$map);
	if ($exclui == ""){$exclui = "nulo";}
	//define os itens para pegar os dados
	$itens = array();
	if($layer->getmetadata("ltempoformatodata") == "")
	{return "Nao esta definido o metadata com o formato do campo";}

	if($layer->getmetadata("ltempoiteminicio") != ""){
		$iteminicio = $layer->getmetadata("ltempoiteminicio");
		$itens[] = $iteminicio;
	}
	else
	{return "Nao esta definido o metadata com o item inicial";}

	$itemi = "";
	if($layer->getmetadata("ltempoitemimagem") != ""){
		$itemi = $layer->getmetadata("ltempoitemimagem");
		$itens[] = $itemi;
	}
	$itemicone = "";
	if($layer->getmetadata("ltempoitemicone") != ""){
		$itemicone = $layer->getmetadata("ltempoitemicone");
		$itens[] = $itemicone;
	}
	$itemfim = "";
	if($layer->getmetadata("ltempoitemfim") != ""){
		$itemfim = $layer->getmetadata("ltempoitemfim");
		$itens[] = $itemfim;
	}
	$itemtitulo = $iteminicio;
	if($layer->getmetadata("ltempoitemtitulo") != ""){
		$itemtitulo = $layer->getmetadata("ltempoitemtitulo");
		$itens[] = $itemtitulo;
	}
	$itemdescricao = $itemtitulo;
	if($layer->getmetadata("ltempoitemdescricao") != ""){
		$itemdescricao = $layer->getmetadata("ltempoitemdescricao");
		$itens[] = $itemdescricao;
	}
	$itemtip = $itemdescricao;
	if($layer->getmetadata("ltempoitemtip") != ""){
		$itemtip = $layer->getmetadata("ltempoitemtip");
		$itens[] = $itemtip;
	}
	$itemlink = "";
	if($layer->getmetadata("ltempoitemlink") != ""){
		$itemlink = $layer->getmetadata("ltempoitemlink");
		$itens[] = $itemlink;
	}
	$converteE = "sim";
	if($layer->getmetadata("ltempoconvencode") != ""){
		$converteE = $layer->getmetadata("ltempoconvencode");
	}
	$dados = pegaValoresM($map,$layer,$itens,$exclui,$selecionados,true,true);
	$eventos = array();
	$anos = array();
	foreach($dados as $dado){
		if($itemi == "")
		{$image = '';}
		else {$image = $dado[$itemi];}
		if($itemicone == "")
		{$icone = 'dark-red-circle.png';}
		else {$icone = $dado[$itemicone];}
		if($itemfim == "")
		{$fim = '';}
		else {$fim = $dado[$itemfim];}
		if($itemlink == "")
		{$link = '';}
		else {$link = $dado[$link];}
		$titulo = $dado[$itemtitulo];
		$desc = $dado[$itemdescricao];
		if(function_exists("mb_convert_encoding") && strtolower($converteE) == "sim"){
		    $titulo = mb_convert_encoding($titulo,"UTF-8",mb_detect_encoding($titulo));
		    $desc = mb_convert_encoding($desc,"UTF-8",mb_detect_encoding($desc));
		}
		if($dado[$iteminicio] != 0 && $dado[$iteminicio] != '-'){
			$eventos[] = array(
				'start'=>$dado[$iteminicio],
				'end'=>$fim,
				'title'=>"<span onmouseover='tituloover(\"".$dado["centroide"]."\")' onmouseout='tituloout()'>".$titulo."</span>",
				'description'=>$dado[$iteminicio]." ".$fim."<br>".$desc,
				'icon'=>$icone,
				'image'=>$image,
				'link'=>$link
			);
			$anos[] = $fim;
			$anos[] = $dado[$iteminicio];
		}
	}
	//echo "<pre>";
	return array(
		"dateTimeFormat"=>$layer->getmetadata("ltempoformatodata"),
		"wikiURL"=>"",
		"wikiSection"=>"",
		"events"=>$eventos,
		"menorano"=>min($anos),
		"maiorano"=>max($anos)
	);
}
//
//opcao pode ser "google" ou o c�digo de um tema. Nesse &uacute;ltimo caso, deve-se definir $item
//
function dadosPerfilRelevo($pontos,$opcao,$amostragem,$item="",$map_file=""){
	$urlGoogle = "http://maps.google.com/maps/api/elevation/json?sensor=false&path=";
	$pontos = str_replace(",","|",$pontos);
	$pontos = str_replace(" ",",",$pontos);
	$urlGoogle .= $pontos."&samples=".$amostragem;
	$curl = curl_init();
	if(!isset($i3geo_proxy_server)){
		include(dirname(__FILE__)."/../ms_configura.php");
	}
	curl_setopt ($curl, CURLOPT_URL, $urlGoogle);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
		curl_setopt($curl, CURLOPT_PROXY, $i3geo_proxy_server);
	}
	$result = curl_exec($curl);
	curl_close ($curl);
	$result = json_decode( $result, true );

	if($opcao != "google"){
		include_once("classe_atributos.php");
		$m = New Atributos($map_file,$opcao);
		$rs = array();
		foreach($result["results"] as $r){
			$l = $r["location"];
			$rs[] = $m->identificaQBP2("",$l["lng"],$l["lat"],"",5,$item,"googlerelevo",$etip=false,$ext="");
		}
		$result = array("results"=>$rs,"status"=>"OK");
	}
	return $result;
}

/*
Function: pegaValoresM

Pega os valores de m&uacute;ltiplos itens de um tema.

Se for passado apenas um item, o array de retorno ser&aacute; unidimensional.

Parametros:

$layer {objeto} - Layer que ser&aacute; processado.

$itens {array} - Itens que ser&atilde;o processados.

$exclui {string} - O registro n&atilde;o ser&aacute; considerado se um dos valores for igual a esse valor.

$selecionados {string} - sim|nao Utiliza apenas os selecionados ou todos

$chaves {boolean} - inclui ou n&atilde;o os nomes dos itens como chave no array resultante

$centroide {boolean} - captura ou n&atilde;o o WKT com o centroide do elemento

Retorno:

{array}
*/
function pegaValoresM($mapa,$layer,$itens,$exclui="nulo",$selecionados="nao",$chaves=false,$centroide=false)
{
	$versao = versao();
	$versao = $versao["principal"];
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$layer->set("template","none.htm");
	//$layer->setfilter("");

	$indicesel = array();
	//pega os valores dos indices dos elementos selecionados para comparacao posterior
	if ($selecionados == "sim"){
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();
		for ($i = 0; $i < $res_count; ++$i)
		{
			$result = $layer->getResult($i);
			$indicesel[] = $result->shapeindex;
		}
		$layer->close();
	}
	$valores = array();
	$nclasses = $layer->numclasses;
	if (@$layer->queryByrect($mapa->extent) == MS_SUCCESS){
		//$layer->draw();
		$sopen = $layer->open();
		if($sopen == MS_FAILURE){return "erro";}
		$res_count = $layer->getNumresults();
		//echo $res_count;echo "\n";
		for ($i=0;$i<$res_count;++$i){
			if($versao >= 6){
				$shape = $layer->getShape($layer->getResult($i));
				$shp_index = $shape->index;
			}
			else{
				$result = $layer->getResult($i);
				$shp_index  = $result->shapeindex;
				$shape = $layer->getfeature($shp_index,-1);
			}
			if (($selecionados == "sim") && (array_search($shp_index,$indicesel) === FALSE))
			{continue;}
			$considera = "sim";
			//verifica se no registro deve ser considerado
			if ($exclui != "nulo"){
				foreach ($itens as $item)
				{if($shape->values[$item] == $exclui){$considera = "nao";}}
			}
			//pega os valores
			$v = array();
			if ($considera == "sim"){
				//pega os valores dos itens do registro
				foreach ($itens as $item){
					$vitem = $shape->values[$item];
					if (!mb_detect_encoding($vitem,"UTF-8",true)){
						$vitem = mb_convert_encoding($vitem,"UTF-8","ISO-8859-1");
					}
					if($chaves == false)
					{$v[] = $vitem;}
					else
					{$v[$item] = $vitem;}
				}
				//pega o centroide
				//echo $i;echo "\n";
				if($centroide == true){
					$c = $shape->getCentroid();
					if (($prjTema != "") && ($prjMapa != $prjTema)){
						$projOutObj = ms_newprojectionobj($prjTema);
						$projInObj = ms_newprojectionobj($prjMapa);
						$c->project($projInObj, $projOutObj);
					}
					$v["centroide"] = "POINT(".$c->x." ".$c->y.")";
				}
				//echo $i;echo "---\n";
				//pega a cor da classe onde cai o registro
				if($nclasses > 0 && $versao >= 6){
					$cx = $layer->getClassIndex($shape);
					if($cx > -1){
						$classe = $layer->getclass($cx);
						$cor = $classe->getstyle(0)->color;
						$v["cores"] = $cor->red." ".$cor->green." ".$cor->blue;
					}
				}
				if (count($v) == 1){
					$valores[] = $v[0];
				}
				else{
					$valores[] = $v;
				}
			}
		}
		$layer->close();
	}
	return ($valores);
}
/*
Function: agrupaValores

Agrupa os valores de um array por um m&eacute;todo de c&aacute;lculo.

No caso de soma e m&eacute;dia, ser&aacute; considerado apenas um item e uma chave.

Parametros:

$lista {array} - Lista com os arrays contendo os dados que ser&atilde;o processados.

$indiceChave {string} - &Iacute;ndice do array da lista que ser&aacute; considerado como a chave do array.

$indiceValor {string} - &Iacute;ndice do array da lista que ser&aacute; considerado como o valor.

$tipo {string} - Tipo de processamento soma|media|contagem|nenhum.

Retorno:

{array}
*/
function agrupaValores($lista,$indiceChave,$indiceValor,$tipo)
{
	$valores = null;
	foreach ($lista as $linha){
		$c = $linha[$indiceChave];
		$v = $linha[$indiceValor];
		if ($tipo == "conta"){
			if(@$valores[$c])
			$valores[$c] = $valores[$c] + 1;
			else
			$valores[$c] = 1;
		}
		if (($tipo == "soma"))
		{
			if (($v != "") && (is_numeric($v))){
				if(@$valores[$c])
				$valores[$c] = $valores[$c] + $v;
				else
				$valores[$c] = $v;
			}
		}
		if ($tipo == "media"){
			if (($v != "") && (is_numeric($v))){
				if(@$soma[$c])
				$soma[$c] = $soma[$c] + $v;
				else
				$soma[$c] = $v;

				if(@$conta[$c])
				$conta[$c] = $conta[$c] + 1;
				else
				$conta[$c] = 1;
			}
		}
		if ($tipo == "nenhum"){
			//if (($v != "") && (is_numeric($v)))
			//{
				$valoresn[] = $v;
			//}
			$valores = $valoresn;
		}
	}
	if ($tipo == "media"){
		$chaves = array_keys($conta);
		foreach ($chaves as $c){
			$valores[$c] = $soma[$c] / $conta[$c];
		}
	}
	return ($valores);
}

?>
