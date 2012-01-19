<?php
/*
Title: mapa_inicia.php

Inicia um novo mapa.

Gera as imagens necessárias para abrir o mapa e calcula um conjunto de variáveis necessárias
ao funcionamento do i3Geo. Os dados são devolvidos como um objeto json. Conforme a interface
que será utilizada pelo mapa, são feitos ajustes específicos.

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

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

$interface - nome da interface que será utilizada pelo mapa padrao|openlayers|googlemaps|googleearth|flamingo . O valor de $interface é também armazenado no metadata "interface" do objeto Map, podendo ser utilizada em outros programas do i3Geo.

$openid - indica se o usuário foi ou não autenticado em alguma rede social (veja i3geo/pacotes/openid)

$interfacePadrao - interface definida em ms_configura.php

$navegadoresLocais - array que indica quais usuários podem navegar no servidor

$cp - Objeto CPAINT.

$embedLegenda - inclui a legenda no corpo do mapa sim|nao

$map_file - Arquivo map file.

$mapext - Extensão geográfica do mapa.

$w - Largura da imagem do mapa.

$h - Altura da imagem do mapa.

$R_path - Variável definida no arquivo ms_configura.php que indica se o software R está instalado.

$locmapserv - Variável definida no arquivo ms_configura.php que indica nome do mapserver cgi.

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
	global $emailInstituicao,$openid,$interfacePadrao,$mensagemInicia,$kmlurl,$tituloInstituicao,$tempo,$navegadoresLocais,$editor,$locaplic,$embedLegenda,$map_file,$mapext,$w,$h,$R_path,$locmapserv,$utilizacgi,$expoeMapfile,$interface;
	if(!isset($editor) || empty($editor))
	{$editor = "nao";}
	if(!isset($kmlurl))
	{$kmlurl = "";}
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
		}
		$c = $m->numlayers;
		for ($i=0;$i < $c;++$i)
		{
			$layer = $m->getlayer($i);
			if($layer->name == "mundo" || $layer->name == "estados")
			{$layer->set("status",MS_OFF);}		
			if($layer->type == MS_LAYER_POLYGON)
			{
				if($layer->opacity == "");
				{$layer->set("opacity",50);}
			}
			if($layer->name == "rosadosventos" || $layer->name == "copyright")
			{$layer->set("status",MS_DELETE);}
		}
		$temp = $m->scalebar;
		$temp->set("status",MS_OFF);
		$c = $m->imagecolor;
		$c->setrgb(255,255,255);
		if($interface == "googleearth")
		{
			$m->selectOutputFormat("jpeg");
			$of = $m->outputformat;
			$of->set("driver","AGG/PNG");
		}
		else
		{$of = $m->outputformat;}
		$of->set("imagemode",MS_IMAGEMODE_RGBA);
		$of->set("transparent",MS_ON);
		$m->save($map_file);
	}
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$protocolo = $protocolo[0];
	$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
	$urli3geo = str_replace("/classesphp/mapa_controle.php","",$protocolo.$_SERVER["PHP_SELF"]);
	//altera o tamanho do query map para ficar igual ao do mapa
	include_once("classe_mapa.php");
	error_reporting(E_ALL);
	if(!function_exists("sobeAnno")){
		include_once("funcoes_gerais.php");
	}
	sobeAnno($map_file);
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
	if (strtolower($embedLegenda) == "sim")
	{
		foreach ($m->layers as $l)
		{
			if (($l->data != "") && (strtoupper($l->getmetadata("escondido")) != "SIM") && (strtolower($l->getmetadata("tema")) != "nao"))
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
	$m = New Mapa($map_file,$locaplic);
	$temas = $m->parametrosTemas();
	//$m->ligaDesligaTemas("",implode(",",$m->nomes),"nao");
	//
	//é necessário um mapa para compor o fundo apenas com o imagecolor e sem nenhuma outra camada
	//utilizado em algumas interfaces
	//
	$nomefundo = str_replace(".map","fundo.map",$map_file);
	$m->mapa->save($nomefundo);
	$mf = ms_newMapObj($nomefundo);
	$numlayers = $mf->numlayers;
	for($i = 0;$i < $numlayers;$i++)
	{
		$l = $mf->getLayer($i);
		$l->set("status",MS_DELETE);
	}
	$of = $mf->outputformat;
	$of->set("driver","GD/PNG");
	$versao = versao();
	/*
	$versao = versao();
	if($versao["principal"] == 6)
	{$of->set("driver","GD/PNG");}
	else
	{$of->set("driver","AGG/PNG");}
	*/
	$temp = $mf->scalebar;
	$temp->set("status",MS_OFF);
	$mf->save($nomefundo);
	//
	$temp = $m->mapa->scalebar;
	$temp->set("status",MS_OFF);		
	$of = $m->mapa->outputformat;
	$of->set("imagemode",MS_IMAGEMODE_RGBA);
	$of->setOption("QUANTIZE_FORCE","OFF");
	$of->set("driver","AGG/PNG");		
	$m->mapa->setmetadata("interface",$interface);
	//$iref = $m->mapa->reference;
	//$m->mapa->setmetadata("referencew",$iref->width);
	//$m->mapa->setmetadata("referenceh",$iref->height);
	$m->salva();

	$nomes = nomeRandomico(12);
	if($imgo->imagepath == "")
	{echo "Erro IMAGEPATH vazio";exit;}	
	$nomer = ($imgo->imagepath)."mapa".$nomes.".png";
	$imgo->saveImage($nomer);
	if (isset($utilizacgi) && strtolower($utilizacgi) == "sim")
	{$nomer = $locmapserv."?map=".$map_file."&mode=map";}
	else
	{$nomer = ($imgo->imageurl).basename($nomer);}
	//$iref = $m->mapa->reference;
	//$irefH = $iref->height;
	$res["editor"] = $editor;
	$res["mapexten"] = $ext;
	$res["mapscale"] = $escalaMapa;
	$res["mapres"] = $m->mapa->resolution;
	$res["pixelsize"] = $celula;
	if ((isset($expoeMapfile)) && ($expoeMapfile == "nao"))
	{$res["mapfile"] = "";}
	else
	{$res["mapfile"] = $map_file;}
	$res["cgi"] = $locmapserv;
	$res["extentTotal"] = $ext;
	$res["mapimagem"] = $nomer;	
	$geoip = "nao";
	if (file_exists($locaplic."/pacotes/geoip") && file_exists($locaplic."/pacotes/geoip/GeoLiteCity.dat"))
	{$geoip = "sim";}
	$res["geoip"] = $geoip;
	$res["listavisual"] = (file_exists($locaplic."/imagens/visual")) ? implode(",",listaDiretorios($locaplic."/imagens/visual")) : "";					
	$res["utilizacgi"] = $utilizacgi;					
	
	$res["versaoms"] = $versao["principal"];
	$res["versaomscompleta"] = $versao["completa"];
	$res["mensagens"] = $m->pegaMensagens();
	$res["r"] = (isset($R_path)) ? "sim" : "nao";					
	$res["extentref"] = "";					
	$res["kmlurl"] = $kmlurl;					
	$res["mensageminicia"] = $mensagemInicia;					
	$res["interfacePadrao"] = $interfacePadrao;					
	$res["embedLegenda"] =	$embedLegenda;				
	$res["w"] = $w;
	$res["h"] = $h;
	$res["titulo"] = $tituloInstituicao;
	$res["tempo"] = microtime(1) - $tempo;
	$res["embedLegenda"] = $embedLegenda;
	$res["erro"] = '';
	$res["mappath"] = $imgo->imagepath;
	$res["mapurl"] = $imgo->imageurl;
	$res["navegacaoDir"] = $navegadoresLocais;
	if($openid == true)
	{$res["autenticadoopenid"] = "sim";}
	else
	{$res["autenticadoopenid"] = "nao";}
	$res["emailInstituicao"] = $emailInstituicao;
	copy($map_file,(str_replace(".map","reinc.map",$map_file)));
	copy($map_file,(str_replace(".map","seguranca.map",$map_file)));
	ob_clean();
	cpjson(array("variaveis"=>$res,"temas"=>$temas));
}
?>