<?php
/*
Title: Administração do cadastro de sistemas

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

File: i3geo/admin/sistemas.php

19/6/2007

*/

include_once("admin.php");
include_once("../../ms_configura.php");
include_once("../../classesphp/funcoes_gerais.php");
error_reporting(0);
//faz a busca da função que deve ser executada
switch ($funcao)
{
	case "pegaTextoMapfile":
		$arquivo = $locaplic."/temas/".$codigoMap.".map";
		$handle = fopen($arquivo, "r");
    	$final = "";
    	while (!feof($handle)) 
    	{
        	$linha = fgets($handle);
        	$final .= rtrim($linha, "\r\n") . PHP_EOL;
    	}
    	fclose($handle);
		retornaJSON($final);
		exit;
	break;
	case "salvaTextoMapfile":
		$texto = str_replace('\"\"','" "',$texto);
		$texto = str_replace('\"','"',$texto);
		$texto = str_replace('xxxxxxxx',PHP_EOL,$texto);
		/*
		$arquivo = $locaplic."/temas/".$codigoMap.".map";
		$fp = fopen($arquivo, 'w');
		fwrite($fp, $texto);
		fclose($fp);
		retornaJSON(file_get_contents($arquivo));
		*/
		retornaJSON($texto);
		exit;
	break;
	case "pegaMapfiles":
		retornaJSON(pegaLayers());
		exit;
	break;
	case "criarNovoMap":
		retornaJSON(criarNovoMap());
		exit;
	break;
	case "pegaLayers":
		retornaJSON(pegaLayers());
		exit;
	break;
	case "excluirMapfile":
		$tabela = "mapfiles";
		$id = $codigoMap;
		$f = verificaFilhos();
		if($f)
		{
			retornaJSON("erro");
			exit;
		}
		else
		{
			unlink("../../temas/".$codigoMap.".map");
			retornaJSON("ok");
			exit;
		}
	break;
	case "criarNovoLayer":
		retornaJSON(criarNovoLayer());
		exit;
	break;
	case "excluirLayer":
		retornaJSON(excluirLayer());
		exit;
	break;	
	case "listaClasses":
		retornaJSON(listaClasses());
		exit;
	break;
	case "criarNovaClasse":
		retornaJSON(criarNovaClasse());
		exit;
	break;
	case "excluirClasse":
		excluirClasse();
		retornaJSON(listaClasses());
		exit;
	break;
	case "listaEstilos":
		retornaJSON(listaEstilos());
		exit;
	break;	
	case "criarNovoEstilo":
		retornaJSON(criarNovoEstilo());
		exit;
	break;	
	case "excluirEstilo":
		excluirEstilo();
		retornaJSON(listaEstilos());
		exit;
	break;
	case "pegaConexao":
		retornaJSON(pegaConexao());
		exit;
	break;	
	case "alterarConexao":
		alterarConexao();
		retornaJSON(pegaConexao());
		exit;
	break;
	case "pegaMetadados":
		retornaJSON(pegaMetadados());
		exit;
	break;
	case "alterarMetadados":
		alterarMetadados();
		retornaJSON(pegaMetadados());
		exit;
	break;
	case "pegaGeral":
		retornaJSON(pegaGeral());
		exit;
	break;
	case "alterarGeral":
		alterarGeral();
		$codigoLayer = $name;
		retornaJSON(pegaGeral());
		exit;
	break;
}
function criarNovoMap()
{
	global $nome,$codigo,$locaplic;
	$arq = $locaplic."/temas/".$codigo.".map";
	if(!file_exists($arq))
	{
		$dados[] = "SYMBOLSET ../symbols/simbolos.sym";
		$dados[] = 'FONTSET   "../symbols/fontes.txt"';
		$dados[] = "LAYER";
		$dados[] = "	NAME base";
		$dados[] = "	TYPE line";
		$dados[] = '	DATA ""';
		$dados[] = '	METADATA';
		$dados[] = '		TEMA "'.$nome.'"';
		$dados[] = '	METADATA';
		$dados[] = "END";
		$dados[] = "END";
		$fp = fopen($arq,"w");
		foreach ($dados as $dado)
		{
			fwrite($fp,$dado."\n");
		}
    	require_once("conexao.php");
    	$dbh->query("INSERT INTO i3geoadmin_temas (link_tema,kml_tema,ogc_tema,download_tema,desc_tema,tipoa_tema,tags_tema,nome_tema,codigo_tema) VALUES ('','', '','','','','','$nome','$codigo')");
    	$dbh = null;
    	$dbhw = null;
		return "ok";
	}
	return "erro";
}
function criarNovoLayer()
{
	global $locaplic,$codigoMap;
	include_once("../../classesphp/funcoes_gerais.php");
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = ms_newLayerObj($mapa);
	$nl->set("name",nomeRandomico());
	$nl->set("type",MS_LAYER_LINE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return array("layers"=>(array($nl->name)));
}
function criarNovaClasse()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $nl->numclasses;
	$classe = ms_newClassObj($nl);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	$dados[] = array("indice"=>($nclasses),"nome"=>(""));
	return $dados;
}
function criarNovoEstilo()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($indiceClasse);
	$numestilos = $classObj->numstyles;
	$nestilo = ms_newStyleObj($classObj);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	$dados[] = array("estilo"=>$numestilos);
	return $dados;
}
function pegaLayers()
{
	global $codigoMap,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layers = $mapa->getalllayernames();
	$dados["layers"] = $layers;
	return $dados;
}
function listaClasses()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $layer->numclasses;
	for($i=0;$i<$nclasses;++$i)
	{
		$classe = $layer->getclass($i);
		$dados[] = array("indice"=>$i,"nome"=>($classe->name));
	}
	return $dados;
}
function listaEstilos()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($indiceClasse);
	$numestilos = $classe->numstyles;
	for($i=0;$i<$numestilos;++$i)
	{
		$dados[] = array("estilo"=>$i);
	}
	return $dados;
}

function excluirLayer()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$nl->set("status",MS_DELETE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function excluirClasse()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($indiceClasse);
	$classObj->set("status",MS_DELETE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function excluirEstilo()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$indiceEstilo,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($indiceClasse);
	$classObj->deletestyle($indiceEstilo);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaConexao()
{
	global $codigoMap,$codigoLayer,$locaplic,$postgis_mapa;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["connection"] = $layer->connection;
	$dados["connectiontype"] = $layer->connectiontype;
	$dados["data"] = $layer->data;
	$dados["tileindex"] = $layer->tileindex;
	$dados["tileitem"] = $layer->tileitem;
	if($dados["tileindex"] == ""){$dados["tileitem"] = "";}
	$dados["postgis_mapa"] = array_keys($postgis_mapa);
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	return $dados;
}
function alterarConexao()
{
	global $codigoMap,$codigoLayer,$locaplic,$connection,$connectiontype,$data,$tileitem,$tileindex;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$layer->set("connection",$connection);
	$layer->set("connectiontype",$connectiontype);
	$layer->set("data",$data);
	$layer->set("tileitem",$tileitem);
	$layer->set("tileindex",$tileindex);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaMetadados()
{
	global $codigoMap,$codigoLayer,$locaplic,$postgis_mapa;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["itens"] = $layer->getmetadata("itens");
	$dados["itensdesc"] = $layer->getmetadata("itensdesc");
	$dados["itenslink"] = $layer->getmetadata("itenslink");
	$dados["tip"] = $layer->getmetadata("tip");
	$dados["tema"] = $layer->getmetadata("tema");
	$dados["classe"] = $layer->getmetadata("classe");
	$dados["escala"] = $layer->getmetadata("escala");
	$dados["download"] = $layer->getmetadata("download");
	$dados["escondido"] = $layer->getmetadata("escondido");
	$dados["extensao"] = $layer->getmetadata("extensao");
	$dados["identifica"] = $layer->getmetadata("identifica");
	$dados["mensagem"] = $layer->getmetadata("mensagem");
	$dados["classesitem"] = $layer->getmetadata("classesitem");
	$dados["classesnome"] = $layer->getmetadata("classesnome");
	$dados["classescor"] = $layer->getmetadata("classescor");
	$dados["classessimbolo"] = $layer->getmetadata("classessimbolo");
	$dados["classestamanho"] = $layer->getmetadata("classestamanho");
	$dados["aplicaextensao"] = $layer->getmetadata("aplicaextensao");
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$colunas = "";
	if($layer->type < 3)
	{
		if(@$layer->open())
		{
			$layer->open();
			$colunas = implode(", ",$layer->getitems());
			$layer->close();
		}
	}
	$dados["colunas"] = $colunas;
	
	return $dados;
}
function alterarMetadados()
{
	global $codigoMap,$codigoLayer,$locaplic,$aplicaextensao,$classestamanho,$classessimbolo,$classescor,$classesnome,$classesitem,$mensagem,$identifica,$extensao,$escondido,$download,$escala,$tema,$classe,$tip,$itenslink,$itens,$itensdesc;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$layer->setmetadata("itens",$itens);
	$layer->setmetadata("itensdesc",$itensdesc);
	$layer->setmetadata("itenslink",$itenslink);
	$layer->setmetadata("tip",$tip);
	$layer->setmetadata("tema",$tema);
	$layer->setmetadata("classe",$classe);
	$layer->setmetadata("escala",$escala);
	$layer->setmetadata("download",$download);
	$layer->setmetadata("escondido",$escondido);
	$layer->setmetadata("extensao",$extensao);
	$layer->setmetadata("identifica",$identifica);
	$layer->setmetadata("mensagem",$mensagem);
	$layer->setmetadata("classesitem",$classesitem);
	$layer->setmetadata("classesnome",$classesnome);
	$layer->setmetadata("classescor",$classescor);
	$layer->setmetadata("classessimbolo",$classessimbolo);
	$layer->setmetadata("classestamanho",$classestamanho);
	$layer->setmetadata("aplicaextensao",$aplicaextensao);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaGeral()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["type"] = $layer->type;
	$dados["filter"] = $layer->getfilter();
	if($dados["filter"]== ""){$dados["filter"] = "";}
	$dados["filteritem"] = $layer->filteritem;
	$dados["group"] = $layer->group;
	//$dados["labelangleitem"] = $layer->labelangleitem;
	$dados["labelitem"] = $layer->labelitem;
	$dados["labelmaxscale"] = $layer->labelmaxscale;
	$dados["labelmaxscale"] = $layer->labelmaxscale;
	$dados["labelminscale"] = $layer->labelminscale;
	//$dados["labelsizeitem"] = $layer->labelsizeitem;
	$dados["maxscale"] = $layer->maxscale;
	$dados["minscale"] = $layer->minscale;
	$dados["offsite"] = $layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue;
	$dados["opacity"] = $layer->opacity;
	$dados["symbolscale"] = $layer->symbolscale;
	$dados["tolerance"] = $layer->tolerance;
	$dados["toleranceunits"] = $layer->toleranceunits;
	$dados["status"] = $layer->status;
	$dados["sizeunits"] = $layer->sizeunits;
	$dados["projection"] = $layer->getProjection();
	$dados["name"] = $layer->name;
	$colunas = "";
	if($layer->type < 3)
	{
		if(@$layer->open())
		{
			$layer->open();
			$colunas = implode(", ",$layer->getitems());
			$layer->close();
		}
	}
	if($dados["projection"] == "null")
	$dados["projection"] = "";
	
	$dados["colunas"] = $colunas;
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	return $dados;	
}
function alterarGeral()
{
	global $codigoMap,$codigoLayer,$locaplic,$name,$projection,$sizeunits,$status,$toleranceunits,$tolerance,$symbolscale,$opacity,$offsite,$minscale,$maxscale,$labelsizeitem,$labelminscale,$labelmaxscale,$labelitem,$group,$filteritem,$type,$filter;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	
	if($offsite == -1 || $offsite == "null")
	{$offsite = "-1,-1,-1";}
	$layer->set("name",$name);
	$layer->set("type",$type);
	$layer->setfilter($filter);
	$layer->set("filteritem",$filteritem);
	$layer->set("group",$group);
	//$layer->set("labelangleitem",$labelangleitem);
	$layer->set("labelitem",$labelitem);
	$layer->set("labelmaxscale",$labelmaxscale);
	$layer->set("labelminscale",$labelminscale);
	//$layer->set("labelsizeitem",$labelsizeitem);
	$layer->set("maxscale",$maxscale);
	$layer->set("minscale",$minscale);
	$cor = $layer->offsite;
	$c = explode(",",$offsite);
	if(count($c) < 3)
	$c = explode(" ",$offsite);
	$cor->setrgb($c[0],$c[1],$c[2]);
	$layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue;
	$layer->set("opacity",$opacity);
	$layer->set("symbolscale",$symbolscale);
	$layer->set("tolerance",$tolerance);
	$layer->set("toleranceunits",$toleranceunits);
	$layer->set("status",$status);
	$layer->set("sizeunits",$sizeunits);
	
	if($layer->getprojection() == MS_TRUE)
	$layer->setprojection($projection);
	if($layer->getprojection() == MS_FALSE && $projection != "")
	$layer->setprojection($projection);
	
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";	
}




















function pegaFontes()
{
	$arq = "../../symbols/fontes.txt";
	$h = fopen ($arq,"r");
	while ($i = fscanf ($h, "%s\t%s\t"))
	{
		list ($f,$g) = $i;
		$nome[] = $f;
	}
	return $nome;
}
function alteraEstilo()
{
	global $codigoMap,$codigoLayer,$classe,$estilo,$parametro,$valor;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($classe);
	$estilo = $classe->getstyle($estilo);
	$ok = false;
	$cor = "";
	switch ($parametro)
	{
		case "backgroundcolor":
		$cor = $estilo->backgroundcolor;
		$ok = true;
		break;
		case "color":
		$cor = $estilo->color;
		$ok = true;
		break;
		case "outlinecolor":
		$cor = $estilo->outlinecolor;
		$ok = true;
		break;
		default:
		if(!$ok)$estilo->set($parametro,$valor);
	}
	if ($cor != "")
	{
		$c = explode(",",$valor);
		if(count($c) < 3)
		$c = explode(" ",$valor);
		$cor->setrgb($c[0],$c[1],$c[2]);		
	}
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function alteraClasse()
{
	global $codigoMap,$codigoLayer,$classe,$parametro,$valor;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($classe);
	if($parametro == "text")
	{$classe->settext($valor);}
	elseif
	($parametro == "expression")
	{$classe->setexpression($valor);}	
	else
	$classe->set($parametro,$valor);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function alteraClasseLabel()
{
	global $codigoMap,$codigoLayer,$classe,$parametro,$valor;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($classe);
	$label = $classe->label;
	$ok = false;
	$cor = "";
	switch ($parametro)
	{
		case "backgroundcolor":
		$cor = $label->backgroundcolor;
		$ok = true;
		break;
		case "backgroundshadowcolor":
		$cor = $label->backgroundshadowcolor;
		$ok = true;
		break;
		case "color":
		$cor = $label->color;
		$ok = true;
		break;
		case "outlinecolor":
		$cor = $label->outlinecolor;
		$ok = true;
		break;
		case "shadowcolor":
		$cor = $label->shadowcolor;
		$ok = true;
		break;
		case "shadowsizex":
		$cor = $label->shadowsizex;
		$ok = true;
		break;
		case "shadowsizey":
		$cor = $label->shadowsizey;
		$ok = true;
		break;
		case "backgroundshadowsizex":
		$cor = $label->backgroundshadowsizex;
		$ok = true;
		break;
		case "backgroundshadowsizey":
		$cor = $label->backgroundshadowsizey;
		$ok = true;
		break;
		default:
		if(!$ok)$label->set($parametro,$valor);
	}
	if ($cor != "")
	{
		$c = explode(",",$valor);
		if(count($c) < 3)
		$c = explode(" ",$valor);
		$cor->setrgb($c[0],$c[1],$c[2]);
	}
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}

function removeCabecalho($arq)
{
	global $postgis_mapa;
	restauraCon($arq,$postgis_mapa);
	$handle = fopen($arq, "r");
	if ($handle)
	{
    	$final[] = "SYMBOLSET ../symbols/simbolos.sym\n";
    	$final[] = "FONTSET   ".'"'."../symbols/fontes.txt".'"'."\n";
    	$grava = false;
    	while (!feof($handle)) 
    	{
        	$linha = fgets($handle);
        	if(strtoupper(trim($linha)) == "LAYER")
        	{$grava = true;}
        	if($grava)
        	{$final[] = rtrim($linha, "\r\n") . PHP_EOL;}//$linha."\n";}
    	}
    	fclose($handle);
	}
	$handle = fopen($arq, "w+");
	foreach ($final as $f)
	{
		if(($f != "") && ($f != 'FILTERITEM ""') && ($f != 'LABELITEM ""'))
		fwrite($handle,$f);
	}
	fclose($handle);
}

function pegaDadosClasse()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $layer->numclasses;
	for($i=0;$i<$nclasses;++$i)
	{
		$classe = $layer->getclass($i);
		$temp["name"] = $classe->name;
		$temp["expression"] = $classe->getExpression();
		$temp["keyimage"] = $classe->keyimage;
		$temp["maxscale"] = $classe->maxscale;
		$temp["minscale"] = $classe->minscale;
		$temp["maxsize"] = $classe->maxsize;
		$temp["minsize"] = $classe->minsize;
		$temp["size"] = $classe->size;
		$temp["status"] = $classe->status;
		$temp["symbolname"] = $classe->symbolname;
		$temp["text"] = $classe->getTextString();
		$temp["type"] = $classe->type;
		$label = $classe->label;
		if ($label != "")
		{
			$t["font"] = $label->font;
			$t["type"] = $label->type;
			$t["backgroundcolor"] = $label->backgroundcolor->red.",".$label->backgroundcolor->green.",".$label->backgroundcolor->blue;
			$t["backgroundshadowcolor"] = $label->backgroundshadowcolor->red.",".$label->backgroundshadowcolor->green.",".$label->backgroundshadowcolor->blue;
			$t["color"] = $label->color->red.",".$label->color->green.",".$label->color->blue;
			$t["outlinecolor"] = $label->outlinecolor->red.",".$label->outlinecolor->green.",".$label->outlinecolor->blue;
			$t["shadowcolor"] = $label->shadowcolor->red.",".$label->shadowcolor->green.",".$label->shadowcolor->blue;
			$t["shadowsizex"] = $label->shadowsizex;
			$t["shadowsizey"] = $label->shadowsizey;
			$t["backgroundshadowsizex"] = $label->backgroundshadowsizex;
			$t["backgroundshadowsizey"] = $label->backgroundshadowsizey;
			$t["size"] = $label->size;
			$t["minsize"] = $label->minsize;
			$t["maxsize"] = $label->maxsize;
			$t["position"] = $label->position;
			$t["offsetx"] = $label->offsetx;
			$t["offsety"] = $label->offsety;
			$t["angle"] = $label->angle;
			$t["autoangle"] = $label->autoangle;
			$t["buffer"] = $label->buffer;
			$t["antialias"] = $label->antialias;
			$t["wrap"] = $label->wrap;
			$t["minfeaturesize"] = $label->minfeaturesize;
			$t["autominfeaturesize"] = $label->autominfeaturesize;
			$t["mindistance"] = $label->mindistance;
			$t["partials"] = $label->partials;
			$t["force"] = $label->force;
			$t["encoding"] = $label->encoding;
			$temp["label"] = $t;			
		}
		else
		$temp["label"] = array();	
		$dados[] = array("id"=>$i,"dados"=>$temp);
	}
	return $dados;
}
function pegaDadosEstilo()
{
	global $codigoMap,$codigoLayer;
	$dados = array();
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $layer->numclasses;
	for($i=0;$i<$nclasses;++$i)
	{
		$classe = $layer->getclass($i);
		$numestilos = $classe->numstyles;
		$estilos = array();
		for($j=0;$j<$numestilos;++$j)
		{
			$estilo = $classe->getstyle($j);
			$temp["symbolname"] = $estilo->symbolname;
			$temp["color"] = $estilo->color->red.",".$estilo->color->green.",".$estilo->color->blue;
			$temp["size"] = $estilo->size;
			$temp["minsize"] = $estilo->minsize;
			$temp["maxsize"] = $estilo->maxsize;
			$temp["offsetx"] = $estilo->offsetx;
			$temp["offsety"] = $estilo->offsety;
			$temp["antialias"] = $estilo->antialias;
			$temp["backgroundcolor"] = $estilo->backgroundcolor->red.",".$estilo->backgroundcolor->green.",".$estilo->backgroundcolor->blue;
			$temp["outlinecolor"] = $estilo->outlinecolor->red.",".$estilo->outlinecolor->green.",".$estilo->outlinecolor->blue;
			$temp["width"] = $estilo->width;
			$temp["minwidth"] = $estilo->minwidth;
			$temp["maxwidth"] = $estilo->maxwidth;
			$temp["angle"] = $estilo->angle;
			$temp["angleitem"] = $estilo->angleitem;  
			$temp["sizeitem"] = $estilo->sizeitem;
			$temp["minvalue"] = $estilo->minvalue;
			$temp["maxvalue"] = $estilo->maxvalue;
			$estilos[] = array("estilo"=>$j,"dados"=>$temp);
		}
		$dados[] = array("classe"=>$i,"estilos"=>$estilos);
	}
	return $dados;
}

?>