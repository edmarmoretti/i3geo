<?php
/*
Title: mapa_inicia.php

Inicia um novo mapa.

Gera as imagens necessárias para abrir o mapa e calcula um conjunto de variáveis necessárias
ao funcionamento do i3Geo.

Licenca:

GPL2


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

Arquivo:

i3geo/classesphp/mapa_inicia.php
*/

/*
Function: iniciaMapa

Inicia um mapa e obtém os parâmetros necessários para o funcionamento da interface HTML.

Globais:

$interfacePadrao - interface definida em ms_configura.php

$navegadoresLocais - array que indica quais usuários podem navegar no servidor

$cp - Objeto CPAINT.

$embedLegenda - inclui a legenda no corpo do mapa sim|nao

$map_file - Arquivo map file.

$mapext - Extensão geográfica do mapa.

$w - Largura da imagem do mapa.

$h - Altura da imagem do mapa.

$locsistemas - Variável definida no arquivo ms_configura.php que identifica se existem sistemas associados que serão incluídos na guia de adição de temas.

$locidentifica - Variável definida no arquivo ms_configura.php que identifica se existem sistemas adicionais a ser mostrados na opção de identificação.

$R_path - Variável definida no arquivo ms_configura.php que indica se o software R está instalado.

$locmapas - Variável definida no arquivo ms_configura.php que indica se a guia de mapas deve ser mostrada.

$locmapserv - Variável definida no arquivo ms_configura.php que indica nome do mapserver cgi.

$postgis_con - Variável definida no arquivo ms_configura.php que indica qual conexão postgis deve ser utilizada (algumas funções de análise utilizam essa conexão, se existir)

$kmlurl - url de um arquivo kml que será inserido no mapa. Válido para a interface google maps

Retorno:

{JSON}

(start code)

{
	variaveis:,
	temas:[{
		"name":,
		"status":,
		"tema":,
		"transparency":,
		"type":,
		"sel":,
		"escala":,
		"download":,
		"features":,
		"connectiontype":,
		"zoomtema":,
		"contextoescala":,
		"etiquetas":,
		"identifica":,
		"editorsql":,
		"escondido":
	}]
}

(end)
*/
function iniciaMapa()
{
	global $interfacePadrao,$mensagemInicia,$kmlurl,$tituloInstituicao,$tempo,$navegadoresLocais,$locaplic,$embedLegenda,$map_file,$mapext,$w,$h,$locsistemas,$locidentifica,$R_path,$locmapas,$locmapserv,$postgis_con,$utilizacgi,$expoeMapfile,$interface;
	error_reporting(E_ALL);
	//
	//pega o xml com os sietmas para identificação
	//
	if(!isset($interface)){$interface = "";}
	if($interface == "googlemaps" || $interface == "googleearth")
	{
		$m = ms_newMapObj($map_file);
		if($interface == "googlemaps"){
			$m->setProjection("proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m");
			//$m->setProjection("init=epsg:900913"); //900913
			//$m->setProjection("+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
		}
		$c = $m->numlayers;
		for ($i=0;$i < $c;++$i)
		{
			$layer = $m->getlayer($i);
			if($layer->name == "mundo" || $layer->name == "estados")
			{$layer->set("status",MS_OFF);}			
			if($layer->type == MS_LAYER_POLYGON)
			{
				$nclasses = $layer->numclasses;
				for($ii=0;$ii<$nclasses;++$ii){
					$classe = $layer->getclass($ii);
					$nestilos = $classe->numstyles;
					for($j=0;$j<$nestilos;++$j){
						$estilo = $classe->getstyle($j);
						$estilo->set("symbolname","p7");
						$estilo->set("size","2");
					}	
				}
			}
			//echo $l->getProjection();exit;
			if($layer->getProjection() == "" )
			{$layer->setProjection("init=epsg:4291");}
		}
		$temp = $m->scalebar;
		$temp->set("status",MS_OFF);
		$c = $m->imagecolor;
		$c->setrgb(255,255,255);
		if($interface == "googleearth")
		{
			$m->selectOutputFormat("jpeg");
			$of = $m->outputformat;
			$of->set("imagemode",MS_IMAGEMODE_RGBA);
			$of->set("driver","AGG/PNG");
		}
		else
		{$of = $m->outputformat;}
		$of->set("transparent",MS_ON);
		$m->save($map_file);
	}
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$protocolo = $protocolo[0];
	$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
	$urli3geo = str_replace("/classesphp/mapa_controle.php","",$protocolo.$_SERVER["PHP_SELF"]);
	$locidentifica = ($locidentifica == "") ? $urli3geo."/admin/xmlidentifica.php" : $locidentifica;
	//altera o tamanho do query map para ficar igual ao do mapa
	include_once("classe_mapa.php");
	error_reporting(E_ALL);
	$m = new Mapa($map_file);
	if(isset($w))
	{
		$m->mudaQS($w,$h);
		$m = new Mapa($map_file);
		$m->mapa->setsize($w,$h);
	}
	error_reporting(E_ALL);
	//
	//verifica se a legenda deve ser embebida no mapa
	//
	$legenda = $m->mapa->legend;
	$embedLegenda == "sim" ? $legenda->set("status",MS_EMBED) : $legenda->set("status",MS_OFF);
	//
	//salva as alterações feitas
	//
	$m->salva();
	//prepara a legenda para incluir no mapa, preenchendo os nomes das classes em branco
	if ($embedLegenda == "sim")
	{
		foreach ($m->layers as $l)
		{
			if (($l->data != "") && (strtoupper($l->getmetadata("escondido")) != "SIM") && ($l->getmetadata("tema") != "NAO"))
			{
				if ($l->numclasses > 0)
				{
					$classe = $l->getclass(0);
					if (($classe->name == "") || ($classe->name == " "))
					{$classe->set("name",$l->getmetadata("tema"));}
				}
			}
		}
	}
	//
	//cuidado ao mexer aqui
	//o mapa precisa ser salvo para registrar a extensão geográfica
	//
	$imgo = $m->mapa->draw();
	$m->salva($map_file);
	$e = $m->mapa->extent;
	$ext = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
	$escalaMapa = $m->mapa->scaledenom;
	$celula = $m->mapa->cellsize;
	//
	//pega os parametros de cada tema
	//
	$qyfile = str_replace(".map",".qy",$map_file);
	$arqsel = (file_exists($qyfile)) ? true : false;
	$m = New Mapa($map_file);
	$temas = $m->parametrosTemas();
	//$m->ligaDesligaTemas("",implode(",",$m->nomes),"nao");
	//
	//é necessário um mapa para compor o fundo apenas com o imagecolor e sem nenhuma outra camada
	//utilizado em algumas interfaces
	//
	$nomefundo = str_replace(".map","fundo.map",$map_file);
	$m->mapa->save($nomefundo);
	$mf = ms_newMapObj($nomefundo);
	$of = $mf->outputformat;
	$of->set("driver","GD/PNG");
	$temp = $mf->scalebar;
	$temp->set("status",MS_OFF);
	$mf->save($nomefundo);
	$temp = $m->mapa->scalebar;
	$temp->set("status",MS_OFF);		
	$of = $m->mapa->outputformat;
	$of->set("imagemode",MS_IMAGEMODE_RGBA);
	$of->setOption("QUANTIZE_FORCE","OFF");
	$of->set("driver","AGG/PNG");		
	$m->salva();

	$nomes = nomeRandomico(12);
	$nomer = ($imgo->imagepath)."mapa".$nomes.".png";
	$imgo->saveImage($nomer);
	if (isset($utilizacgi) && strtolower($utilizacgi) == "sim")
	{$nomer = $locmapserv."?map=".$map_file."&mode=map";}
	else
	{$nomer = ($imgo->imageurl).basename($nomer);}
	$iref = $m->mapa->reference;
	$irefH = $iref->height;
	$res = "var mapexten= '".$ext."';var mapscale=".$escalaMapa.";var mapres=".$m->mapa->resolution.";var g_celula=".$celula.";var mapimagem='".$nomer."';var mapwidth=".$imgo->width.";var mapheight=".$imgo->height.";var mappath='".$imgo->imagepath."';var mapurl='".$imgo->imageurl."'";
	$res .= ";var extentref = '';var refimagem='';var refwidth=0;var refpath='';var refurl=''";
	$res .= ";var legimagem='';var legwidth=0;var legheight=0;var legpath='';var legurl='';var locsistemas='".$locsistemas."';var locidentifica='".$locidentifica."'";
	$r = (isset($R_path)) ? "sim" : "nao";
	$res .= ";var r='".$r."'"; //identifica se o r esta instalado
	$res .= ";var locmapas='".$locmapas."'";
	if ((isset($expoeMapfile)) && ($expoeMapfile == "nao"))
	{$res .= ";var mapfile=''";}
	else
	{$res .= ";var mapfile='".$map_file."'";}
	$res .= ";var cgi='".$locmapserv."'";
	$res .= ";var utilizacgi='".$utilizacgi."'";
	$res .= ";var titulo='".$tituloInstituicao."'";
	$versao = versao();
	$res .= ";var versaoms ='".$versao["principal"]."'";
	$res .= ";var versaomscompleta ='".$versao["completa"]."'";
	//Pega os estilos disponíveis
	$visual = (file_exists($locaplic."/imagens/visual")) ? implode(",",listaDiretorios($locaplic."/imagens/visual")) : "";
	$res .= ";var listavisual='".$visual."'";
	//pega os usuários navegadores
	//para efeitos de compatibilidade
	$res .= ";var navegacaoDir='".$navegadoresLocais."'";
	$res .= ($navegadoresLocais == "sim") ? ";i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir=true" : ";i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir=false";
	//
	//verifica se o pacote geoip está instalado ou não
	//
	$geoip = "nao";
	if (file_exists($locaplic."/pacotes/geoip") && file_exists($locaplic."/pacotes/geoip/GeoLiteCity.dat"))
	{$geoip = "sim";}
	$res .= ";var geoip='".$geoip."';";
	$res .= "var tempo =".(microtime(1) - $tempo).";";
	$res .= "var mensagens ='".$m->pegaMensagens()."';";
	$res .= "var kmlurl ='".$kmlurl."';";
	$res .= "var mensagemInicia ='".$mensagemInicia."';";
	$res .= "var interfacePadrao ='".$interfacePadrao."';";
	$res .= "var embedLegenda ='".$embedLegenda."';";
	$res .= "var erro ='';";	
	copy($map_file,(str_replace(".map","reinc.map",$map_file)));
	copy($map_file,(str_replace(".map","seguranca.map",$map_file)));
	//$cp->set_data(array("variaveis"=>$res,"temas"=>$temas));
	cpjson(array("variaveis"=>$res,"temas"=>$temas));
}
?>