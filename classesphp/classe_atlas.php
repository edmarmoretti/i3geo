<?php
/*
Title: classe_atlas.php

Manipulação da interface Atlas.

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

i3geo/classesphp/classe_atlas.php
*/
/*
Classe: Atlas
*/
class Atlas
{
	public $atlas;
/*
Function: __construct

Cria um objeto atlas 

parameters:

$atlasxml - Objeto xml com o atlas.
*/  	
	function __construct($xml)
	{
  		error_reporting(E_ALL);
  		$this->xml = $xml;
	}
/*
Method: pegaListaDeAtlas

Pega a lista de atlas existentes e as informações básicas sobre cada um

Parametros:

tituloinstituicao - é utilizado para montar o cabeçalho HTML com a lista de atlas. Pode ser obtido do ms_configura.php
*/
	function pegaListaDeAtlas($tituloinstituicao="")
	{
		$tituloinstituicao = mb_convert_encoding($tituloinstituicao,"HTML-ENTITIES","auto");
		$atlas = array();
		foreach($this->xml->ATLAS as $s)
		{
			$atlas[] =  array("PUBLICADO"=>ixml($s,"PUBLICADO"),"ID"=>ixml($s,"ID"),"TITULO"=>ixml($s,"TITULO"),"DESCRICAO"=>ixml($s,"DESCRICAO"),"ICONE"=>ixml($s,"ICONE"),"W"=>ixml($s,"WABERTURA"),"H"=>ixml($s,"HABERTURA"),"TEMPLATEHTML"=>ixml($s,"TEMPLATEHTML"));
		}
		return (array("atlas"=>$atlas,"tituloinstituicao"=>$tituloinstituicao));
	}
/*
Method: criaAtlas

Lê os parâmetros necessários para abrir um atlas no i3geo

Parametros:

atlasId - id do atlas desejado, conforme existente em atlas.xml
*/
	function criaAtlas($atlasId)
	{
		foreach($this->xml->ATLAS as $s)
		{
			$id = ixml($s,"ID");
			if ($id == $atlasId)
			{
				$interface = ixml($s,"TEMPLATEHTML");
				$base = ixml($s,"BASEMAPFILE");
			}
		}
		return (array("interface"=>$interface,"base"=>$base));
	}
/*
Method: pegaListaDePranchas

Pega a lista de pranchas existentes em um atlas específico e as informações básicas sobre cada uma

Parametros:

atlasId - identificador do Atlas desejado
*/
	function pegaListaDePranchas($atlasId)
	{
		$p = array();
		foreach($this->xml->ATLAS as $s)
		{
			$id = ixml($s,"ID");
			if ($id == $atlasId)
			{
				$titulo = ixml($s,"TITULO");
				$link = ixml($s,"LINKMAISINFO");
				$w = ixml($s,"WABERTURA");
				$h = ixml($s,"HABERTURA");
				$icone = ixml($s,"ICONE");
				$tipoguias = ixml($s,"TIPOGUIAS");
				$pdefault = ixml($s,"PRANCHADEFAULT");
				foreach($s->PRANCHAS as $pranchas)
				{
					foreach($pranchas->PRANCHA as $prancha)
					{
						$p[] = array("id"=>ixml($prancha,"ID"),"titulo"=>ixml($prancha,"TITULO"),"icone"=>ixml($prancha,"ICONE"));
					}
				}
			}
		}
		return (array("tipoguias"=>$tipoguias,"pranchadefault"=>$pdefault,"icone"=>$icone,"titulo"=>$titulo,"w"=>$w,"h"=>$h,"link"=>$link,"pranchas"=>$p));
	}
/*
Method: abrePrancha

Ativa uma prancha do atlas.

Inclui os temas definidos na configuração da prancha.

Os layers que não são oriundos de uma prancha recebe o metadata "ATLAS" igual a "nao". Isso é feito na inicialização do Atlas.

Parametros:

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
			if (($l->getmetadata("ATLAS")) != "nao")
			{$l->set("status",MS_DELETE);}
		}
		$mapa->save($map_file);
		$mp = "";
		foreach($this->xml->ATLAS as $s)
		{
			$ida = ixml($s,"ID");
			if ($ida == $atlasId)
			{
				foreach($s->PRANCHAS as $pranchas)
				{
					foreach($pranchas->PRANCHA as $prancha)
					{
						if($pranchaId == ixml($prancha,"ID"))
						{
							$link = ixml($prancha,"LINKMAISINFO");
							$w = ixml($prancha,"WABERTURA");
							$h = ixml($prancha,"HABERTURA");
							$mp = ixml($prancha,"MAPEXT");
							//pega os temas
							foreach($prancha->TEMAS as $temas)
							{
								foreach($temas->TEMA as $tema)
								{
									$codigo = ixml($tema,"CODIGO");
									$ligado = ixml($tema,"LIGADO");
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
			include_once("classe_mapa.php");
			$mapa = "";
			$m = new Mapa($map_file);
			$m->adicionaTema((implode(",",$temasa)),$locaplic,"nao");
			$m->salva();
			
			$mapa = ms_newMapObj($map_file);
			$nomes = $mapa->getalllayernames();
			foreach ($nomes as $n)
			{
				$l = $mapa->getlayerbyname($n);
				if (($l->getmetadata("ATLAS")) != "nao")
				{$l->set("status",MS_OFF);}
			}
			foreach($layers as $t)
			{
				$layer = $mapa->getlayerbyname($t);
				$layer->set("status",MS_DEFAULT);
			}
			$mapa->save($map_file);
		}
		//verifica extensão geográfica
		$newext = array();
		if ($mp != "")
		{
			$ext = $mapa->extent;
			$newext = array();
			$temp = explode(",",$mp);
			foreach ($temp as $t)
			{
				if ($t != "")
				{$newext[] = $t;}
			}
			if (count($newext) == 4)
			{$ext->setextent($newext[0], $newext[1], $newext[2], $newext[3]);}
			$mapa->save($map_file);	
		}
		if(!function_exists("sobeAnno")){
			include_once("funcoes_gerais.php");
		}
		sobeAnno($map_file);		
		if ($w == ""){$w = 300;}
		if($h == ""){$h = 300;}
		return (array("link"=>$link,"w"=>$w,"h"=>$h,"mapexten"=>implode(" ",$newext)));
	}
}
?>