<?php
/*
Title: classe_vermultilayer.php

Verifica se o layer e multilayer

Analisa um mapfile e retorna a situa&ccedil;&atilde;o de agrupamento das camadas.

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

i3geo/classesphp/classe_vermultilayer.php
*/
/*
Classe: vermultilayer
*/
class vermultilayer
{
	/*
	Variavel: $resultado

	Indica se &eacute; multi-layer ou n&atilde;o (0 ou 1)
	*/
	var $resultado;
	/*
	Variavel: $temas

	Lista de c�digos dos temas
	*/
	var $temas; //lista de nomes de temas se for um grupo
	/*
	Variavel: $layers

	Lista de objetos layers
	*/
	var $layers; //lista de objetos temas se for um grupo
	/*
	Variavel: $nomes

	Lista de nomes dos temas
	*/
	var $nomes; //lista de nomes se for um grupo
	/*
	Variavel: $nomesvisiveis

	Lista dos nomes dos temas vis&iacute;veis
	*/
	var $nomesvisiveis; //nomes dos temas vis&iacute;veis na escala
	/*
	Variavel: $temasvisiveis

	Lista com os c�digos dos temas vis&iacute;veis
	*/
	var $temasvisiveis; //temas vi'siveis na escala
	/*
	function: verifica

	Verifica se um tema &eacute; multilayer

	parameters:
	$mapfile - arquivo mapfile

	$tema - c�digo do tema que ser&aacute; verificado
	*/
	function verifica($mapfile,$tema) //$mapfile = arquivo .map, $tema = nome do layer
	{
	    $this->resultado = 0;
	    $this->temas = array();
	    $this->layers = array();
	    $this->nomes = array();
	    $this->nomesvisiveis = array();
	    $this->temasvisiveis = array();
	    return;

	    include(dirname(__FILE__)."/../ms_configura.php");
		$this->postgis_mapa = $postgis_mapa;

		$map = ms_newMapObj($mapfile);
		substituiConObj($this->mapa,$postgis_mapa);

		$map->preparequery();
		$escala = $map->scaledenom ;
		$multilayer = 0;
		$temas = array();
		$layers = array();
		$nomes = array();
		$nomesvisiveis = array();
		$temasvisiveis = array();

		$numlayers = $map->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $map->getlayer($i);
			$temai = $layer->name;
			$testa = 0;
			//verifica se o tema &eacute; visivel na escala
			$mins = $layer->minscaledenom;
			$maxs = $layer->maxscaledenom;
			if ($mins != $maxs)
			{
				$testa = 1;
				if ($mins > 0)
				{
					if ($escala >= $mins)
					{$testa = 0;}
				}
				if ($maxs > 0)
				{
					if ($escala <= $maxs)
					{$testa = 0;}
					else {$testa = 1;}
				}
				if (($mins > 0) && ($maxs > 0))
				{
					if (($escala >= $mins) && ($escala <= $maxs))
					{$testa = 0;}
					else {$testa = 1;}
				}
			}
			if (strtoupper($layer->getmetadata("escondido")) != "SIM")
			{
				if (($layer->group == $tema) && ($layer->type != 4))
				{
					$multilayer = 1;
					$temas[] = $temai;
					$layers[] = $layer;
					$pn = pegaNome($layer);
					$nomes[] = $pn;
					if ($testa == 0)
					{
						$nomesvisiveis[] = $pn;
						$temasvisiveis[] = $temai;
					}
				}
			}
		}
		$this->resultado = $multilayer;
		$this->temas = $temas;
		$this->layers = $layers;
		$this->nomes = $nomes;
		$this->nomesvisiveis = $nomesvisiveis;
		$this->temasvisiveis = $temasvisiveis;
	}
}
?>