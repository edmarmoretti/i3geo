<?php
/*
Title: Testa um mapfile

Permite testar um mapfile específico existente no diretório "temas" ou gerar uma imagem miniatura.

As miniaturas são utilizadas na árvore de temas mostrada na opção "adiciona", existente na interface padrão.
Quando o usuário passa o mouse sobre a palavra "miniatura" é executado o programa de geração de miniaturas. Caso o
a miniatura tiver sido gerada previamente, a preferência é por esse arquivo em cahce. Isso permite uma performance melhor,
uma vez que a geração on-line pode ser muito demorada. Para gerar as miniaturas o administrador deve executar o
programa geraminiatura.php.


Arquivo:

i3geo/testamapfile.php

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br
Colaboração: Luis Henrique Weirich de Matos
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

Exemplos:

testamapfile.php?map=bioma

testamapfile.php?map=bioma&tipo=mini

Link:

http://localhost/i3geo/testamapfile.php

Parametro: map

Nome do mapfile que será testado ou usado na geração da miniatura. O arquivo é procurado no caminho indicado e no diretório i3geo/temas
Se map=todos, todos os mapas são testados em grupos de 10 em 10 e a miniatura não é gerada.

Parametro: tipo (opcional)

Define o tamanho da imagem que será gerada. Se não for definido, será feito o teste do mapfile.
Tipo de retorno mini|grande . Controla o tamanho da miniatura que deverá ser mostrada.

Valores:

mini - Gera uma miniatura de 50x50 pixels
grande - Gera uma miniatura de 300x300 pixels
*/
set_time_limit(300);
ini_set('max_execution_time', 300);
include("ms_configura.php");
include("classesphp/funcoes_gerais.php");
require_once("classesphp/pega_variaveis.php");
include_once ("classesphp/carrega_ext.php");
//
//carrega o phpmapscript
//
if (!function_exists('ms_GetVersion'))
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		if(!@dl('php_mapscript_48.dll'))
		dl('php_mapscript.dll');
	}
	else
	{dl('php_mapscript.so');}
}
ms_ResetErrorList();
if(!isset($tipo))
{$tipo = "";}
if ($tipo == "")
{
	echo '<html><head><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"></head><script>function roda(){window.location.href = "?map="+document.getElementById("nomemap").value;}</script><body ><form action="testamapfile.php" method="post" id=f >Nome do arquivo map existente no diretório i3geo/temas (digite "todos" para testar todos de uma só vez):<br><br><input id=nomemap class=digitar type="file" size=20 ><input id=map type="hidden" value="" name="map"><input type="button" onclick="roda()" class=executar value="Testar" size=10 name="submit"></form></body></html>';
}
if (isset($map) && $map != "")
{
	if ($map == "todos")
	{
		$tipo = "todos";
		$arqs = listaArquivos("temas");
		$conta = 0;
		echo "<br>Número de mapas = ".(count($arqs["arquivos"]))." Faltam= ".(count($arqs["arquivos"])-$iniciar-10)."<br>";
		if (!isset($iniciar)){$iniciar = 0;}
		sort($arqs["arquivos"]);
		foreach ($arqs["arquivos"] as $arq)
		{
			if (($conta >= $iniciar) && ($conta < $iniciar+10))
			{
				$temp = explode(".",$arq);
				if($temp[1] == "map")
				verifica($arq);
				else
				{echo "<br>Arquivo <i>$map</i> não é válido. <br>";}
			}
			$conta++;
		}
		echo "<hr><br><br><a href='testamapfile.php?map=todos&iniciar=".($iniciar+10)."' >Próximos mapas</a>";
	}
	else
	{verifica($map);}	
}
function verifica($map)
{
	global $tipo,$locaplic,$postgis_mapa;
	if ($tipo == "mini" && file_exists('temas/miniaturas/'.$map.".mini.png"))
	{
		Header("Content-type: image/png");
		ImagePng(ImageCreateFromPNG('temas/miniaturas/'.$map.".mini.png"));
		exit;		
	}
	if ($tipo == "grande" && file_exists('temas/miniaturas/'.$map.".grande.png"))
	{
		Header("Content-type: image/png");
		ImagePng(ImageCreateFromPNG('temas/miniaturas/'.$map.".grande.png"));
		exit;		
	}
	ms_ResetErrorList();
	$tema = "";

	if(file_exists($map))
	$tema = $map;
	else
	{	
		$map = str_replace("\\","/",$map);
		$map = basename($map);
		if (file_exists('temas/'.$map))
		{$tema = 'temas/'.$map;}
		if (file_exists('temas/'.$map.'.map'))
		{$tema = 'temas/'.$map.".map";}
	}

	
	if(($tipo == "") || ($tipo == "todos"))
	echo "<hr><br><br><span style='color:red' ><b>Testando: $tema </span><pre></b>";
	if(!file_exists($tema)){echo "Arquivo ".$map." não encontrado.";exit;}
	if ($tema != "")
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$mapa = ms_newMapObj("aplicmap/geral1windows.map");}
		else
		{$mapa = ms_newMapObj("aplicmap/geral1.map");}
		if(@ms_newMapObj($tema))
		{
			$nmapa = ms_newMapObj($tema);
		}
		else
		{
			echo "erro no arquivo $map <br>";
			$error = ms_GetErrorObj();
			while($error && $error->code != MS_NOERR)
			{
				printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
				$error = $error->next();
			}
			return;
		}
		$temasn = $nmapa->getAllLayerNames();
		$dados = "";
		foreach ($temasn as $teman)
		{
			$layern = $nmapa->getLayerByName($teman);
			$layern->set("status",MS_DEFAULT);
			if ($layern->connectiontype == MS_POSTGIS)
			{
				if ($layern->connection == " " || $layern->connection == "")
				{
					if(!is_array($postgis_mapa))
					$l->set("connection",$postgis_mapa);
					else
					$l->set("connection",$postgis_mapa[$l->connection]);
				}				
			}			
			autoClasses(&$layern,$nmapa);
			ms_newLayerObj($mapa, $layern);
			if ($layern->data == "")
			$dados = $layern->connection;
			else
			$dados = $layern->data;
			$pegarext = $teman;	
		}
		if (isset($postgis_mapa))
		{
			if ($postgis_mapa != "")
			{
				$numlayers = $mapa->numlayers;
				for ($i=0;$i < $numlayers;$i++)
				{
					$layer = $mapa->getlayer($i);
					if ($layer->connectiontype == MS_POSTGIS)
					{
						if ($layer->connection == " ")
						{
							$layer->set("connection",$postgis_mapa);
						}
					}
				}
			}
		}
		zoomTema($pegarext,&$mapa);
		if ($tipo == "mini")
		{
		 	 $mapa->setsize(50,50);
			 $sca = $mapa->scalebar;
			 $sca->set("status",MS_OFF);
		}
		if ($tipo == "grande")
		{
		 	 $mapa->setsize(300,300);
			 $sca = $mapa->scalebar;
			 $sca->set("status",MS_OFF);
		}
		if($tipo == "todos")
		{
		 	 $mapa->setsize(150,150);
			 $sca = $mapa->scalebar;
			 $sca->set("status",MS_OFF);
		}
		$objImagem = @$mapa->draw();
		$objImagemLegenda = @$mapa->drawLegend();
		if (!$objImagem)
		{
			echo "Problemas ao gerar o mapa<br>";
			$error = "";
			$error = ms_GetErrorObj();
			while($error && $error->code != MS_NOERR)
			{
				echo "<br>Error in %s: %s<br>", $error->routine, $error->message;
				$error = $error->next();
			}
			return;
		}
		$nomec = ($objImagem->imagepath).nomeRandomico()."teste.png";
		$objImagem->saveImage($nomec);
		$nomer = ($objImagem->imageurl).basename($nomec);
		
		$nomel = ($objImagemLegenda->imagepath).nomeRandomico()."testel.png";
		$objImagemLegenda->saveImage($nomel);
		$nomerl = ($objImagemLegenda->imageurl).basename($nomel);
		
		
		if(($tipo == "") || ($tipo == "todos"))
		{
			echo "<img src=".$nomer." /><br>";
			echo "<img src=".$nomerl." />";
			if($tipo == "todos")
			{
			 echo "<br>".$dados."<br>";
			}
			if($map != "todos")
			{
				echo "<br>Erros:<br>";
				$error = "";
				$error = ms_GetErrorObj();
				while($error && $error->code != MS_NOERR)
				{
					echo "<br>Error in %s: %s<br>", $error->routine, $error->message;
					$error = $error->next();
				}
			}
				
		}
		else
		{
			Header("Content-type: image/png");
			ImagePng(ImageCreateFromPNG($nomec));
		}
		$objImagem->free();
	}
}
function zoomTema($nomelayer,&$mapa)
{
	$layer = $mapa->getlayerbyname($nomelayer);
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$extatual = $mapa->extent;
	$ret = $layer->getmetadata("extensao");
	if($layer->type > 2 && $ret == "")
	{return;}
	$ct = $layer->connectiontype;
	if(($ret == "") && ($ct != 1))
	{return;}
	if ($ret == "")
	{
		$ret = $layer->getextent();
		//reprojeta o retangulo
		if (($prjTema != "") && ($prjMapa != $prjTema))
		{
			$projInObj = ms_newprojectionobj($prjTema);
			$projOutObj = ms_newprojectionobj($prjMapa);
			$ret->project($projInObj, $projOutObj);
		}
		$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
	}
	else
	{
		$ret = explode(" ",$ret);
		$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
	}
}

?>