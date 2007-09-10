<?php
/*
Title: Menu

Manipulação dos temas do arquivo menutemas.xml.

Lista temas, grupos,etc.

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

File: classe_menutemas.php

19/6/2007
*/
/*
Class: Menutemas
*/
class Menutemas
{
	/*
	Variable: $mapa
	
	Objeto mapa
	*/
	protected $mapa;
	/*
	Variable: $arquivo
	
	Arquivo map file
	*/
	protected $arquivo;
	/*
	Variable: $layers
	
	Array com os layers
	*/
	protected $layers;
	/*
	Variable: $perfil
	
	Perfil do usuário atual
	*/
	protected $perfil;
	/*
	Variable: $xmlsistemas
	
	xml com a lista de sistemas
	*/
	protected $xmlsistemas;
/*
function: __construct

Cria um objeto Menutemas

parameters:
$map_file - string $map_file Endereço do mapfile no servidor. 
*/  	
	function __construct($map_file="",$perfil="",$locsistemas="")
	{
		$this->perfil = $perfil;
		$this->xmlsistemas = "";
		if ($locsistemas != "")
		$this->xmlsistemas = simplexml_load_file($locsistemas);		
		if ($map_file != "")
		{
			$this->mapa = ms_newMapObj($map_file);
			$this->arquivo = $map_file;
			if ($this->mapa)
			{
				for ($i=0;$i < ($this->mapa->numlayers);$i++)
				{$this->layers[] = $this->mapa->getlayer($i);}
			}
		}
	}
/*
function: pegaListaDeMapas

Le o arquivo xml com a lista de mapas existente no xml $locmapas.

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Parameters:

locmapas - endereço do arquivo xml.

return:
array
*/
	function pegaListaDeMapas($locmapas)
	{
		$this->xml = simplexml_load_file($locmapas);
		$mapas = array();
		//pega os sistemas checando os perfis
		foreach($this->xml->MAPA as $s)
		{
			$ps = mb_convert_encoding($s->PERFIL,"HTML-ENTITIES","auto");
			$perfis = explode(",",$ps);
			if ((in_array($this->perfil,$perfis)) || ($ps == ""))
			{
				$n = mb_convert_encoding($s->NOME,"HTML-ENTITIES","auto");
				$i = mb_convert_encoding($s->IMAGEM,"HTML-ENTITIES","auto");
				$t = mb_convert_encoding($s->TEMAS,"HTML-ENTITIES","auto");
				$l = mb_convert_encoding($s->LIGADOS,"HTML-ENTITIES","auto");
				$e = mb_convert_encoding($s->EXTENSAO,"HTML-ENTITIES","auto");
				$o = mb_convert_encoding($s->OUTROS,"HTML-ENTITIES","auto");
				$k = mb_convert_encoding($s->LINKDIRETO,"HTML-ENTITIES","auto");
				$mapas[] =  array("NOME"=>$n,"IMAGEM"=>$i,"TEMAS"=>$t,"LIGADOS"=>$l,"EXTENSAO"=>$e,"OUTROS"=>$o,"LINK"=>$k);
			}
		}
		return (array("mapas"=>$mapas));
	}
/*
function: pegaListaDeGrupos

Pega a lista de grupos, subgrupos e sistemas adicionais.

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Os grupos e subgrupos são definidos no xml menutemas/menutemas.xml e os sistemas em menutemas/sistemas.xml.

return:

array
*/
	function pegaListaDeGrupos()
	{
		if (file_exists("../menutemas/menutemas.xml"))
		{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
		else
		{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		$sistemas = array();
		$grupos = array();
		$temasraiz = array();
		//pega os grupos
		//verifica se existem temas na raiz do menu
		foreach($this->xml->TEMA as $temar)
		{
			$down = "nao";
			if (($temar->DOWNLOAD == "sim") || ($temar->DOWNLOAD == "SIM"))
			{$down = "sim";}
			$link = " ";
			if ($temar->TLINK != "")
			{$link = mb_convert_encoding($temar->TLINK,"HTML-ENTITIES","auto");}
			$tid = mb_convert_encoding($temar->TID,"HTML-ENTITIES","auto");
			if (function_exists("mb_convert_encoding"))
			{$nome = mb_convert_encoding($temar->TNOME,"HTML-ENTITIES","auto");}
			else
			{$nome = $temar->TNOME;}
			$temasraiz[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down);
		}
		foreach($this->xml->GRUPO as $grupo)
		{
			$incluigrupo = TRUE;
			if ($grupo->PERFIL != "")
			{
				$incluigrupo = FALSE;
				$perfis = explode(",",$grupo->PERFIL);
				if (in_array($this->perfil,$perfis))
				{$incluigrupo = TRUE;}
			}
			//verifica se existem temas no nível de grupo
			if ($incluigrupo == TRUE)
			{
				$temas = array();
				foreach($grupo->TEMA as $temar)
				{
					$down = "nao";
					if (($temar->DOWNLOAD == "sim") || ($temar->DOWNLOAD == "SIM"))
					{$down = "sim";}
					$link = " ";
					if ($temar->TLINK != "")
					{$link = mb_convert_encoding($temar->TLINK,"HTML-ENTITIES","auto");}
					$tid = mb_convert_encoding($temar->TID,"HTML-ENTITIES","auto");
					if (function_exists("mb_convert_encoding"))
					{$nome = mb_convert_encoding($temar->TNOME,"HTML-ENTITIES","auto");}
					else
					{$nome = $temar->TNOME;}
					$temas[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down);
				}
				$subgrupos = array();
				foreach($grupo->SGRUPO as $sgrupo)
				{
					$incluisgrupo = TRUE;
					if ($sgrupo->PERFIL != "")
					{
						$incluisgrupo = FALSE;
						$perfis = explode(",",$sgrupo->PERFIL);
						if (in_array($this->perfil,$perfis))
						{$incluisgrupo = TRUE;}
					}
					if ($incluisgrupo == TRUE)
					{
						//verifica se existem temas que podem receber download
						$down = "nao";
						foreach($sgrupo->TEMA as $tema)
						{
							if (($tema->DOWNLOAD == "sim") || ($tema->DOWNLOAD == "SIM"))
							{$down = "sim";}
						}
						if (function_exists("mb_convert_encoding"))
						{$nome = mb_convert_encoding($sgrupo->SDTIPO,"HTML-ENTITIES","auto");}
						else
						{$nome = $sgrupo->SDTIPO;}
						$subgrupos[] = array("nome"=>$nome,"download"=>$down);
					}
				}
				if (function_exists("mb_convert_encoding"))
				{$nome = mb_convert_encoding($grupo->GTIPO,"HTML-ENTITIES","auto");}
				else
				{$nome = $grupo->GTIPO;}
				$grupos[] = array("nome"=>$nome,"subgrupos"=>$subgrupos,"temasgrupo"=>$temas);
			}
		}
		$grupos[] = array("temasraiz"=>$temasraiz);
		//pega os sistemas checando os perfis
		foreach($this->xmlsistemas->SISTEMA as $s)
		{
			$nomesis = mb_convert_encoding($s->NOMESIS,"HTML-ENTITIES","auto");
			$ps = mb_convert_encoding($s->PERFIL,"HTML-ENTITIES","auto");
			$perfis = explode(",",$ps);
			if ((in_array($this->perfil,$perfis)) || ($ps == ""))
			{
				$funcoes = array();
				foreach($s->FUNCAO as $f)
				{
					$n = mb_convert_encoding($f->NOMEFUNCAO,"HTML-ENTITIES","auto");
					$a = mb_convert_encoding($f->ABRIR,"HTML-ENTITIES","auto");
					$w = mb_convert_encoding($f->JANELAW,"HTML-ENTITIES","auto");
					$h = mb_convert_encoding($f->JANELAH,"HTML-ENTITIES","auto");
					$p = mb_convert_encoding($f->PERFIL,"HTML-ENTITIES","auto");
					if ((in_array($this->perfil,$perfis)) || ($p == ""))
					{$funcoes[] = array("NOME"=>$n,"ABRIR"=>$a,"W"=>$w,"H"=>$h);}
				}
				$sistemas[] =  array("NOME"=>$nomesis,"FUNCOES"=>$funcoes);
			}
		}
		$grupos[] = array("sistemas"=>$sistemas);
		return ($grupos);
	}
/*
function: pegaListaDeTemas

Le o arquivo xml com os temas e retorna um array com a lista de temas de um subgrupo.

parameters:
$grupo - Id do grupo.

$subgrupo - Id do subgrupo

return:
array
*/
	function pegaListaDeTemas($grupo,$subgrupo)
	{
		if (file_exists("../menutemas/menutemas.xml"))
		{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
		else
		{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		$contagrupo = 0;
		$temas = array();
		foreach($this->xml->GRUPO as $g)
		{
			$incluigrupo = TRUE;
			if ($g->PERFIL != "")
			{
				$incluigrupo = FALSE;
				$perfis = explode(",",$g->PERFIL);
				if (in_array($this->perfil,$perfis))
				{$incluigrupo = TRUE;}
			}
			if ($incluigrupo == TRUE)
			{
				if ($contagrupo == $grupo)
				{
					$contasubgrupo = 0;
					foreach ($g->SGRUPO as $s)
					{
						$incluisgrupo = TRUE;
						if ($s->PERFIL != "")
						{
							$incluisgrupo = FALSE;
							$perfis = explode(",",$s->PERFIL);
							if (in_array($this->perfil,$perfis))
							{$incluisgrupo = TRUE;}
						}
						if ($incluisgrupo == TRUE)
						{
							if ($contasubgrupo == $subgrupo)
							{
								foreach($s->TEMA as $tema)
								{
									$inclui = TRUE;
									if ($tema->PERFIL != "")
									{
										$inclui = FALSE;
										$perfis = explode(",",$tema->PERFIL);
										if (in_array($this->perfil,$perfis))
										{$inclui = TRUE;}
									}
									if ($inclui == TRUE)
									{
										$down = "nao";
										if (($tema->DOWNLOAD == "sim") || ($tema->DOWNLOAD == "SIM"))
										{$down = "sim";}
										$link = " ";
										if ($tema->TLINK != "")
										{$link = mb_convert_encoding($tema->TLINK,"HTML-ENTITIES","auto");}
										$tid = mb_convert_encoding($tema->TID,"HTML-ENTITIES","auto");
										if (function_exists("mb_convert_encoding"))
										{$nome = mb_convert_encoding($tema->TNOME,"HTML-ENTITIES","auto");}
										else
										{$nome = $tema->TNOME;}
										$temas[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down);
									}
								}
							}
							$contasubgrupo = $contasubgrupo + 1;
						}
					}
				}
				$contagrupo = $contagrupo + 1;
			}
		}
		return ($temas);
	}
/*
function: procurartemas

Procura um tema no menu de temas.

Le o arquivo de temas xml e retorna o nome do mapfile correspondente.

parameters:
$procurar - String que será procurada.
*/
	function procurartemas($procurar)
	{
		if (file_exists("../menutemas/menutemas.xml"))
		{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
		else
		{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		$listadetemas = array();
		$resultado = array();
		foreach($this->xml->GRUPO as $grupo)
		{
			$incluigrupo = TRUE;
			if ($grupo->PERFIL != "")
			{
				$incluigrupo = FALSE;
				$perfis = explode(",",$grupo->PERFIL);
				if (in_array($this->perfil,$perfis))
				{$incluigrupo = TRUE;}
			}
			if ($incluigrupo == TRUE)
			{
				foreach($grupo->SGRUPO as $sgrupo)
				{
					$incluisgrupo = TRUE;
					if ($this->perfil != "")
					{
						$perfis = explode(",",$sgrupo->PERFIL);
						if (!in_array($this->perfil,$perfis))
						{$incluisgrupo = FALSE;}
					}
					if ($incluisgrupo == TRUE)
					{
						foreach($sgrupo->TEMA as $tema)
						{
							$inclui = TRUE;
							if ($this->perfil != "")
							{
								$perfis = explode(",",$tema->PERFIL);
								if (!in_array($this->perfil,$perfis))
								{$inclui = FALSE;}
							}
							if ($inclui == TRUE)
							{
								$down = "nao";
								if (($tema->DOWNLOAD == "sim") || ($tema->DOWNLOAD == "SIM"))
								{$down = "sim";}
								$link = mb_convert_encoding($tema->TLINK,"HTML-ENTITIES","auto");;
								$tid = mb_convert_encoding($tema->TID,"HTML-ENTITIES","auto");
								if (function_exists("mb_convert_encoding"))
								{$texto = array("tid"=>$tid,"nome"=>(mb_convert_encoding($tema->TNOME,"HTML-ENTITIES","auto")),"link"=>$link,"download"=>$down);}
								else
								{$texto = array("tid"=>$tid,"nome"=>$tema->TNOME,"link"=>$link,"download"=>$down);}
								if (stristr((mb_convert_encoding($tema->TNOME,"HTML-ENTITIES","auto")),$procurar))
								{$listadetemas[] = $texto;}
							}
						}
						if (count($listadetemas) > 0)
						{
							if (function_exists("mb_convert_encoding"))
							{$subgrupo[] = array("subgrupo"=>(mb_convert_encoding($sgrupo->SDTIPO,"HTML-ENTITIES","auto")),"temas"=>$listadetemas);}
							else
							{$subgrupo[] = array("subgrupo"=>$sgrupo->SDTIPO,"temas"=>$listadetemas);}
						}
					}
					$listadetemas = array();
				}
				if (count($subgrupo) > 0)
				{
					if (function_exists("mb_convert_encoding"))
					{$resultado[] = array("grupo"=>(mb_convert_encoding($grupo->GTIPO,"HTML-ENTITIES","auto")),"subgrupos"=>$subgrupo);}
					else
					{$resultado[] = array("grupo"=>$grupo->GTIPO,"subgrupos"=>$subgrupo);}
				}
				$subgrupo = array();
			}
			
		}
		return ($resultado);
	}
}
?>