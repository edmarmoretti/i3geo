<?php
/*
Title: Atlas

Manipulação da interface Atlas.

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

File: i3geo/classesphp/classe_atlas.php

19/6/2007
*/
/*
Class: Atlas
*/
class Atlas
{
	/*
	Variable: $tlas
	
	Objeto Atlas
	*/
	public $atlas;
/*
Function: __construct

Cria um objeto atlas 

parameters:

$atlasxml - Endereço do arquivo xml com as definições do Atlas.
*/  	
	function __construct($atlasxml)
	{
  		$this->arquivo = $atlasxml;
  		$this->xml = simplexml_load_file($atlasxml);
	}
/*
Method: pegaListaDeAtlas

Pega a lista de atlas existentes e as informações básicas sobre cada um
*/
	function pegaListaDeAtlas($tituloinstituicao)
	{
		$tituloinstituicao = mb_convert_encoding($tituloinstituicao,"HTML-ENTITIES","auto");
		$atlas = array();
		foreach($this->xml->ATLAS as $s)
		{
			$id = mb_convert_encoding($s->ID,"HTML-ENTITIES","auto");
			$titulo = mb_convert_encoding($s->TITULO,"HTML-ENTITIES","auto");
			$descricao = mb_convert_encoding($s->DESCRICAO,"HTML-ENTITIES","auto");
			$icone = mb_convert_encoding($s->ICONE,"HTML-ENTITIES","auto");
			$w = mb_convert_encoding($s->WABERTURA,"HTML-ENTITIES","auto");
			$h = mb_convert_encoding($s->HABERTURA,"HTML-ENTITIES","auto");
			$templatehtml = mb_convert_encoding($s->TEMPLATEHTML,"HTML-ENTITIES","auto");
			$atlas[] =  array("ID"=>$id,"TITULO"=>$titulo,"DESCRICAO"=>$descricao,"ICONE"=>$icone,"W"=>$w,"H"=>$h,"TEMPLATEHTML"=>$templatehtml);
		}
		return (array("atlas"=>$atlas,"tituloinstituicao"=>$tituloinstituicao,"atlasxml"=>$this->arquivo));
	}
/*
Method: criaAtlas

Lê os parâmetros específicos para abrir um atlas
*/
	function criaAtlas($atlasId)
	{
		$parametros = array();
		foreach($this->xml->ATLAS as $s)
		{
			$id = mb_convert_encoding($s->ID,"HTML-ENTITIES","auto");
			if ($id == $atlasId)
			{
				$interface = mb_convert_encoding($s->TEMPLATEHTML,"HTML-ENTITIES","auto");
			}
		}
		return ($interface);
	}
/*
Method: pegaListaDePranchas

Pega a lista de atlas existentes e as informações básicas sobre cada um

Parameters:

atlasId - identificador do Atlas desejado
*/
	function pegaListaDePranchas($atlasId)
	{
		$p = array();
		foreach($this->xml->ATLAS as $s)
		{
			$id = mb_convert_encoding($s->ID,"HTML-ENTITIES","auto");
			if ($id == $atlasId)
			{
				$titulo = mb_convert_encoding($s->TITULO,"HTML-ENTITIES","auto");
				$link = mb_convert_encoding($s->LINKMAISINFO,"HTML-ENTITIES","auto");
				$w = mb_convert_encoding($s->WABERTURA,"HTML-ENTITIES","auto");
				$h = mb_convert_encoding($s->HABERTURA,"HTML-ENTITIES","auto");
				foreach($s->PRANCHAS as $pranchas)
				{
					foreach($pranchas->PRANCHA as $prancha)
					{
						$t = mb_convert_encoding($prancha->TITULO,"HTML-ENTITIES","auto");
						$pranchaId = mb_convert_encoding($prancha->ID,"HTML-ENTITIES","auto");
						$p[] = array("id"=>$pranchaId,"titulo"=>$t);
					}
				}
			}
		}
		return (array("titulo"=>$titulo,"w"=>$w,"h"=>$h,"link"=>$link,"pranchas"=>$p));
	}
/*
Method: abrePrancha

Ativa uma prancha do atlas.

Inclui os temas definidos na configuração da prancha. Ao adicionar um tema, é incluido o metadata ATLAS = "sim" no layer

Parameters:

atlasId - id do atlas

pranchaId - identificador da prancha de um atlas

map_file - nome do mapfile do mapa atual

locaplic - localização do i3geo no servidor
*/
	function abrePrancha($atlasId,$pranchaId,$map_file,$locaplic)
	{
		$p = array();
		$temasa = array();
		$layers = array();
		$mapa = ms_newMapObj($map_file);
		$nomes = $mapa->getalllayernames();
		foreach ($nomes as $n)
		{
			$l = $mapa->getlayerbyname($n);
			if (($l->getmetadata("ATLAS")) == "sim")
			{$l->set("status",MS_DELETE);}
		}
		$mapa->save($map_file);

		foreach($this->xml->ATLAS as $s)
		{
			$ida = mb_convert_encoding($s->ID,"HTML-ENTITIES","auto");
			if ($ida == $atlasId)
			{
				foreach($s->PRANCHAS as $pranchas)
				{
					foreach($pranchas->PRANCHA as $prancha)
					{
						if($pranchaId == mb_convert_encoding($prancha->ID,"HTML-ENTITIES","auto"))
						{
							$link = mb_convert_encoding($prancha->LINKMAISINFO,"HTML-ENTITIES","auto");
							$w = mb_convert_encoding($prancha->WABERTURA,"HTML-ENTITIES","auto");
							$h = mb_convert_encoding($prancha->HABERTURA,"HTML-ENTITIES","auto");
							//pega os temas
							foreach($prancha->TEMAS as $temas)
							{
								foreach($temas->TEMA as $tema)
								{
									$codigo = mb_convert_encoding($tema->CODIGO,"HTML-ENTITIES","auto");
									$ligado = mb_convert_encoding($tema->LIGADO,"HTML-ENTITIES","auto");
									if ($codigo != "")
									{
										$temasa[] = $codigo;
										if (strtolower($ligado) == "sim")
										{$layers[] = $codigo;}
									}
								}
							}
						}
					}
				}
			}
		}
		if(count($temasa) > 0)
		{
			include("classe_mapa.php");
			$m = new Mapa($map_file);
			$m->adicionaTema((implode(",",$temasa)),$locaplic,"nao");
			$m->salva();
			$mapa = ms_newMapObj($map_file);
			foreach($temasa as $t)
			{
				$layer = $mapa->getlayerbyname($t);
				$layer->setmetadata("ATLAS","sim");
			}
			$mapa->save($map_file);
			foreach($layers as $t)
			{
				$layer = $mapa->getlayerbyname($t);
				$layer->set("status",MS_DEFAULT);
			}
			$mapa->save($map_file);
		}
		if ($w == ""){$w = 300;}
		if($h == ""){$h = 300;}
		return (array("link"=>$link,"w"=>$w,"h"=>$h));
	}

}

?>