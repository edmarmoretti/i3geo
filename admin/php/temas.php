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
$cp = new cpaint();
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//verifica os editores
	case "criarNovoMap":
	$cp->set_data(criarNovoMap());
	$cp->return_data();
	break;
	case "pegaLayers":
	$cp->set_data(pegaLayers());
	$cp->return_data();
	break;	
	case "pegaCaracteristicasGerais":
	$cp->set_data(pegaCaracteristicasGerais());
	$cp->return_data();
	break;	
	case "pegaMetadados":
	$cp->set_data(pegaMetadados());
	$cp->return_data();
	break;
	case "pegaClasses":
	$cp->set_data(pegaClasses());
	$cp->return_data();
	break;		
	case "pegaEstilos":
	$cp->set_data(pegaEstilos());
	$cp->return_data();
	break;
	case "alteraLayer":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(alteraLayer());
	$cp->return_data();
	break;
	case "alteraMetadados":
	$cp->set_data(alteraMetadados());
	$cp->return_data();
	break;
	case "alteraClasse":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(alteraClasse());
	$cp->return_data();
	break;
	case "alteraClasseLabel":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(alteraClasseLabel());
	$cp->return_data();
	break;
	case "alteraEstilo":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(alteraEstilo());
	$cp->return_data();
	break;
	case "pegaFontes":
	$cp->set_data(pegaFontes());
	$cp->return_data();
	break;
	case "criarNovoLayer":
	$cp->set_data(criarNovoLayer());
	$cp->return_data();
	break;
	case "excluirLayer":
	$cp->set_data(excluirLayer());
	$cp->return_data();
	break;
	case "adicionarClasse":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(adicionarClasse());
	$cp->return_data();
	break;
	case "excluirClasse":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(excluirClasse());
	$cp->return_data();
	break;
	case "adicionarEstilo":
	substituiCon($map_file,$postgis_mapa);
	$cp->set_data(adicionarEstilo());
	$cp->return_data();
	break;
}
function adicionarEstilo()
{
	global $codigoMap,$codigoLayer,$codigoClasse;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($codigoClasse);
	$nestilo = ms_newStyleObj($classObj);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function excluirClasse()
{
	global $codigoMap,$codigoLayer,$codigoClasse;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($codigoClasse);
	$classObj->set("status",MS_DELETE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function adicionarClasse()
{
	global $codigoMap,$codigoLayer;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = ms_newClassObj($nl);
	$classObj->set("name"," ");
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function excluirLayer()
{
	global $codigoMap,$codigoLayer;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$nl->set("status",MS_DELETE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function criarNovoLayer()
{
	global $codigoMap;
	include_once("../../classesphp/funcoes_gerais.php");
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapat = ms_newMapObj("base.map");
	$layer = $mapat->getlayerbyname("base");
	$mapa = ms_newMapObj($mapfile);
	$nl = ms_newLayerObj($mapa,$layer);
	$nl->set("name",nomeRandomico());
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

function alteraMetadados()
{
	global $codigoMap,$codigoLayer,$parametro,$valor;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$layer->setmetadata(strtoupper($parametro),$valor);
	if($valor == "")
	$layer->removemetadata(strtoupper($parametro));
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}

function alteraLayer()
{
	global $codigoMap,$codigoLayer,$parametro,$valor;
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$ok = false;
	switch ($parametro)
	{
		case "offsite":
		$cor = $layer->offsite;
		$c = explode(",",$valor);
		if(count($c) < 3)
		$c = explode(" ",$valor);
		$cor->setrgb($c[0],$c[1],$c[2]);
		$ok = true;
		break;
		case "filter":
		$layer->setfilter($valor);
		$ok = true;
		break;
		default:
		if(!$ok)$layer->set($parametro,$valor);
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
        	{$final[] = $linha."\n";}
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
function pegaLayers()
{
	global $codigoMap;
	$dados = array();
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layers = $mapa->getalllayernames();
	$dados["layers"] = $layers;
	return $dados;
}
function pegaCaracteristicasGerais()
{
	global $codigoMap,$codigoLayer;
	$dados = array();
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["connection"] = $layer->connection;
	$dados["connectiontype"] = $layer->connectiontype;
	$dados["data"] = $layer->data;
	$dados["type"] = $layer->type;
	$dados["filter"] = $layer->getfilter();
	if($dados["filter"]== ""){$dados["filter"] = "";}
	$dados["filteritem"] = $layer->filteritem;
	$dados["group"] = $layer->group;
	$dados["labelangleitem"] = $layer->labelangleitem;
	$dados["labelitem"] = $layer->labelitem;
	$dados["labelmaxscale"] = $layer->labelmaxscale;
	$dados["labelmaxscale"] = $layer->labelmaxscale;
	$dados["labelminscale"] = $layer->labelminscale;
	$dados["labelsizeitem"] = $layer->labelsizeitem;
	$dados["maxscale"] = $layer->maxscale;
	$dados["minscale"] = $layer->minscale;
	$dados["offsite"] = $layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue;
	$dados["opacity"] = $layer->opacity;
	$dados["symbolscale"] = $layer->symbolscale;
	$dados["tileindex"] = $layer->tileindex;
	$dados["tileitem"] = $layer->tileitem;
	$dados["tolerance"] = $layer->tolerance;
	$dados["toleranceunits"] = $layer->toleranceunits;
	$dados["status"] = $layer->status;
	$dados["sizeunits"] = $layer->sizeunits;
	$dados["projection"] = $layer->getProjection;
	$dados["name"] = $layer->name;
	if($dados["type"] < 3)
	{
		$layer->open();
		$colunas = implode(", ",$layer->getitems());
		$layer->close();
	}
	$dados["colunas"] = $colunas;
	return $dados;
}
function pegaMetadados()
{
	global $codigoMap,$codigoLayer;
	$dados = array();
	$mapfile = "../../temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["itens"] = $layer->getmetadata("itens");
	$dados["itensdesc"] = $layer->getmetadata("itensdesc");
	$dados["itenslink"] = $layer->getmetadata("itenslink");
	$dados["tip"] = $layer->getmetadata("tip");
	$dados["tema"] = mb_convert_encoding(($layer->getmetadata("tema")),"UTF-8","ISO-8859-1");
	$dados["classe"] = $layer->getmetadata("classe");
	$dados["escala"] = $layer->getmetadata("escala");
	$dados["download"] = $layer->getmetadata("download");
	$dados["escondido"] = $layer->getmetadata("escondido");
	$dados["extensao"] = $layer->getmetadata("extensao");
	$dados["identifica"] = $layer->getmetadata("identifica");
	$dados["mensagem"] = mb_convert_encoding(($layer->getmetadata("mensagem")),"UTF-8","ISO-8859-1");
	$dados["classesitem"] = $layer->getmetadata("classesitem");
	$dados["classesnome"] = $layer->getmetadata("classesnome");
	$dados["classescor"] = $layer->getmetadata("classescor");
	$dados["classessimbolo"] = $layer->getmetadata("classessimbolo");
	$dados["classestamanho"] = $layer->getmetadata("classestamanho");
	$dados["aplicaextensao"] = $layer->getmetadata("aplicaextensao");
	return $dados;
}
function pegaClasses()
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
		$temp["name"] = mb_convert_encoding(($classe->name),"UTF-8","ISO-8859-1");
		$temp["expression"] = $classe->getExpression();
		$temp["keyimage"] = $classe->keyimage;
		$temp["maxscale"] = $classe->maxscale;
		$temp["minscale"] = $classe->minscale;
		$temp["maxsize"] = $classe->maxsize;
		$temp["minsize"] = $classe->minsize;
		$temp["size"] = $classe->size;
		$temp["status"] = $classe->status;
		$temp["symbolname"] = $classe->symbolname;
		$temp["text"] = mb_convert_encoding(($classe->getTextString()),"UTF-8","ISO-8859-1");
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
function pegaEstilos()
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
function criarNovoMap()
{
	global $nome,$codigo;
	if(!file_exists("../../temas/".$codigo.".map"))
	{
		$nome = mb_convert_encoding($nome,"UTF-8","ISO-8859-1");
		copy("base.map","../../temas/".$codigo.".map");
		$mapfile = "../../temas/".$codigo.".map";
		$mapa = ms_newMapObj($mapfile);
		$layer = $mapa->getlayerbyname("base");
		$layer->set("name",$codigo);
		$mapa->save($mapfile);
    	require_once("conexao.php");
    	$dbhw->query("INSERT INTO i3geoadmin_temas (link_tema,kml_tema,ogc_tema,download_tema,desc_tema,tipoa_tema,tags_tema,nome_tema,codigo_tema) VALUES ('','', '','','','','','$nome','$codigo')");
    	$dbh = null;
    	$dbhw = null;
		return "ok";
	}
	return "erro";
}
?>