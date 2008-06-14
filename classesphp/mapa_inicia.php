<?php
/*
Title: A - Inicializa o mapa

Inicia o mapa.
Gera as imagens necessárias para abrir o mapa e calcula um conjunto de variáveis necessárias
ao funcionamento do mapa.

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

File: i3geo/classesphp/mapa_inicia.php

19/6/2007
*/
/*
Function: iniciaMapa

Inicia um mapa, pegando os parâmetros necessários.

Parameters:

navegadoresLocais - array que indica quais usuários podem navegar no servidor

cp - Objeto CPAINT.

embedLegenda - inclui a legenda no corpo do mapa sim|nao

map_file - Arquivo map file.

mapext - Extensão geográfica do mapa.

w - Largura da imagem do mapa.

h - Altura da imagem do mapa.

locsistemas - Variável definida no arquivo ms_configura.php que identifica se existem sistemas associados que serão incluídos na guia de adição de temas.

locidentifica - Variável definida no arquivo ms_configura.php que identifica se existem sistemas adicionais a ser mostrados na opção de identificação.

R_path - Variável definida no arquivo ms_configura.php que indica se o software R está instalado.

locmapas - Variável definida no arquivo ms_configura.php que indica se a guia de mapas deve ser mostrada.

locmapserv - Variável definida no arquivo ms_configura.php que indica nome do mapserver cgi.

postgis_con - Variável definida no arquivo ms_configura.php que indica qual conexão postgis deve ser utilizada (algumas funções de análise utilizam essa conexão, se existir)

Return:

objeto cpaint contendo uma string como no exemplo abaixo

"var temas='<lista de temas>;var mapexten= '<extensão geográfica do mapa criado>';
var mapscale=<escala do mapa>;var mapres=<resolução da imagem do mapa>;
g_celula=<tamanho do pixel em décimo de grau>;var mapimagem='<endereço da imagem do mapa>'
;var mapwidth=<largura do mapa>;var mapheight=<altura do mapa>;
var mappath='<diretório temporário do mapa>';var mapurl='<url do diretório do mapa>';
var refimagem='<depreciado>';var refwidth=<depreciado>;var refheight=<depreciado>;
var refpath='<depreciado>';var refurl='<depreciado>';var legimagem='<depreciado>';
var legwidth=<depreciado>;var legheight=<depreciado>;var legpath='<depreciado>';
var legurl='<depreciado>';g_locsistemas='<endereço do xml com os sistemas adicionais>';
g_locidentifica='<endereço do xml com os sistemas da interface de identificação>';
g_r='<o R está instalado?>';g_locmapas='<endereço do xml para a lista de mapas>';
objmapa.mapfile='<objeto mapfile>';objmapa.cgi='<objeto cgi>';;objmapa.postgis_con='<conexão com o postgis>';"

Essa string é recuperada no lado do javascript com eval().

Se $expoeMapfile = "nao", o nome do mapfile não é retornado
*/
function iniciaMapa()
{
	global $tituloInstituicao,$tempo,$navegadoresLocais,$locaplic,$cp,$embedLegenda,$map_file,$mapext,$w,$h,$locsistemas,$locidentifica,$R_path,$locmapas,$locmapserv,$postgis_con,$utilizacgi,$expoeMapfile;
	//
	//pega o xml com os sietmas para identificação
	//
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$protocolo = $protocolo[0];
	$protocolo = $protocolo . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
	$urli3geo = str_replace("/classesphp/mapa_controle.php","",$protocolo.$_SERVER["PHP_SELF"]);
	if($locidentifica == "")
	{
		$locidentifica = $urli3geo."/admin/xmlidentifica.php";	
	}
	if (!file_exists($locaplic))
	{$cp->set_data("erro. $locaplic nao existe (variavel locaplic - corrija o ms_configura.php)");return;}
	if (!file_exists($map_file))
	{$cp->set_data("erro. $map_file nao existe (variavel map_file utilize o testainstal.php)");return;}
	//altera o tamanho do query map para ficar igual ao do mapa
	include_once("classe_mapa.php");
	$m = new Mapa($map_file);
	if(!$m->arquivo){$cp->set_data(" erro. Mapfile $map_file nao existe");return;}
	if(!$m->mapa){$cp->set_data(" erro. Problemas com o mapfile $map_file");return;}
	$m->mudaQS($w,$h);
	$m = new Mapa($map_file);
	$m->mapa->setsize($w,$h);
	//
	//verifica se a legenda deve ser embebida no mapa
	//
	$legenda = $m->mapa->legend;
	if ($embedLegenda == "sim")
	{$legenda->set("status",MS_EMBED);}
	else
	{$legenda->set("status",MS_OFF);}
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
	//
	//pega os parametros de cada tema
	//
	$arqsel = (file_exists($map_file."qy")) ? true : false;
	foreach ($m->layers as $oLayer)
	{
		if ((strtoupper($oLayer->getmetadata("tema")) != "NAO") && ($oLayer->getmetadata("ESCONDIDO") == ""))
		{
			$sel = "nao";
			if ($arqsel) //verifica se existe alguma selecao
			{
				$oLayer->open();
				$res_count = $oLayer->getNumresults();
				$oLayer->close();
				if ($res_count > 0){$sel = "sim";}
			}
			$escala = $oLayer->getmetadata("escala");
			if ($escala == ""){$escala = 0;}
			$down = $oLayer->getmetadata("download");
			$ct = $oLayer->connectiontype;
			
			if ($oLayer->getmetadata("tema") != "")
			//
			//verifica se o tema pode receber a operação de zoom para o tema
			//
			$zoomtema = "sim";
			if (($ct != 1) && ($oLayer->getmetadata("extensao") == ""))
			{$zoomtema = "nao";}
			//
			//verifica se existe restrição de escala
			//
			$contextoescala = "nao";
			if(($oLayer->minscale > 0) || ($oLayer->maxscale > 0))
			{$contextoescala = "sim";}
			//codigo,status,nome,transparencia,tipo,selecao,escala,download,tem features,conexao,tem wfs,permite zoom para o tema
			$temas[] = ($oLayer->name)."*".($oLayer->status)."*".$oLayer->getmetadata("tema")."*".$oLayer->transparency."*".$oLayer->type."*".$sel."*".$escala."*".$down."*nao*".$ct."*nao*".$zoomtema."*".$contextoescala;
		}
	}
	$temas = implode(";",array_reverse($temas));
	$nomes = nomeRandomico(12);
	$nomer = ($imgo->imagepath)."mapa".$nomes.".png";
	$imgo->saveImage($nomer);
	if (isset($utilizacgi) && strtolower($utilizacgi) == "sim")
	{$nomer = $locmapserv."?map=".$map_file."&mode=map";}
	else
	{$nomer = ($imgo->imageurl).basename($nomer);}
	$iref = $m->mapa->reference;
	$irefH = $iref->height;
	$res = "var temas='".$temas."';var mapexten= '".$ext."';var mapscale=".$m->mapa->scale.";var mapres=".$m->mapa->resolution.";g_celula=".$m->mapa->cellsize.";var mapimagem='".$nomer."';var mapwidth=".$imgo->width.";var mapheight=".$imgo->height.";var mappath='".$imgo->imagepath."';var mapurl='".$imgo->imageurl."'";
	$res .= ";var refimagem='';var refwidth=0;objmapa.refheight=".$irefH.";var refpath='';var refurl=''";
	$res .= ";var legimagem='';var legwidth=0;var legheight=0;var legpath='';var legurl='';g_locsistemas='".$locsistemas."';g_locidentifica='".$locidentifica."'";
	$r = (isset($R_path)) ? "sim" : "nao";
	$res .= ";g_r='".$r."'"; //identifica se o r esta instalado
	$res .= ";g_locmapas='".$locmapas."'";
	if ((isset($expoeMapfile)) && ($expoeMapfile == "nao"))
	{$res .= ";objmapa.mapfile=''";}
	else
	{$res .= ";objmapa.mapfile='".$map_file."'";}
	$res .= ";objmapa.cgi='".$locmapserv."'";
	$res .= ";objmapa.utilizacgi='".$utilizacgi."'";
	$res .= ";objmapa.postgis_con='".$postgis_con."'";
	$res .= ";var titulo='".$tituloInstituicao."'";
	$versao = versao();
	$res .= ";objmapa.versaoms ='".$versao["principal"]."'";
	//Pega os estilos disponíveis
	$visual = "";
	if (file_exists($locaplic."/imagens/visual"))
	{$visual = implode(",",listaDiretorios($locaplic."/imagens/visual"));}
	$res .= ";objmapa.listavisual='".$visual."'";
	//pega os usuários navegadores
	$res .= ";objmapa.navegacaoDir='".$navegadoresLocais."'";
	//
	//verifica se o pacote geoip está instalado ou não
	//
	$geoip = "nao";
	if (file_exists($locaplic."/pacotes/geoip") && file_exists($locaplic."/pacotes/geoip/GeoLiteCity.dat"))
	{$geoip = "sim";}
	$res .= ";objmapa.geoip='".$geoip."';";
	$res .= "var tempo =".(microtime(1) - $tempo).";";
	if (function_exists("mb_convert_encoding"))
	{$res = mb_convert_encoding($res,"UTF-8","ISO-8859-1");}
	
	//
	//salva uma copia para opção de reiniciar o mapa
	//
	//$salvoreinc = $m->mapa->save(str_replace(".map","reinc.map",$map_file));
	copy($map_file,(str_replace(".map","reinc.map",$map_file)));
	$cp->set_data($res);
}
?>