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
		return (array("atlas"=>$atlas,"tituloinstituicao"=>$tituloinstituicao));
	}
}
?>