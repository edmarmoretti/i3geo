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

File: i3geo/classesphp/classe_menutemas.php

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
		//error_reporting(E_ALL);
		$this->perfil = explode(",",$perfil);
		$this->xmlsistemas = "";
		if ($locsistemas != "")
		$this->xmlsistemas = simplexml_load_file($locsistemas);		
		if (($map_file != "") && (file_exists($map_file)))
		{
			$this->mapa = ms_newMapObj($map_file);
			$this->arquivo = $map_file;
			if ($this->mapa)
			{
				$c = $this->mapa->numlayers;
				for ($i=0;$i < $c;++$i)
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
			$ps = ixml($s,"PERFIL");
			$perfis = explode(",",$ps);
			if (($this->array_in_array($this->perfil,$perfis)) || ($ps == ""))
			{
				$n = ixml($s,"NOME");
				$i = ixml($s,"IMAGEM");
				$t = ixml($s,"TEMAS");
				$l = ixml($s,"LIGADOS");
				$e = ixml($s,"EXTENSAO");
				$o = ixml($s,"OUTROS");
				$k = ixml($s,"LINKDIRETO");
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

Parameters:

idmenu - id que identifica o xml que será utilizado (definido na variável $menutemas em ms_configura.php)

listasistemas - sim|nao pega a lista de sistemas para montar a árvore de sistemas

listasgrupos - sim|nao lista também os subgrupos associados

menutemas - variável com a lista de menus (veja o ms_configura.php). Se não for definida, é obtida do ms_configura.php

return:

array
*/
	function pegaListaDeGrupos($idmenu="",$listasistemas="sim",$listasgrupos="sim",$menutemas=null)
	{
		$this->xml = "";
		if(isset($menutemas))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
		}
		if ((isset($menutemas)) && ($menutemas != "") && ($idmenu != ""))
		{
			foreach ($menutemas as $m)
			{
				if (($m["idmenu"] == $idmenu))
				{$this->xml = simplexml_load_file($m["arquivo"]);}
			} 
		}
		if (($this->xml == "") && ($menutemas == ""))
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		}
		if ($this->xml == "")
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		}
		$sistemas = array();
		$grupos = array();
		$temasraiz = array();
		//pega os grupos
		//verifica se existem temas na raiz do menu
		foreach($this->xml->TEMA as $temar)
		{
			$down = "nao";
			$ogc = "sim";
			$temp = ixml($temar,"DOWNLOAD");
			if (($temp == "sim") || ($temp == "SIM"))
			{$down = "sim";}
			$temp = ixml($temar,"OGC");
			if (($temp == "nao") || ($temp == "NAO"))
			{$down = "nao";}
			$link = " ";
			$temp = ixml($temar,"TLINK");
			if ($temp != "")
			{$link = $temp;}
			$tid = ixml($temar,"TID");
			$nome = ixml($temar,"TNOME");
			$temasraiz[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down,"ogc"=>$ogc);
		}
		foreach($this->xml->GRUPO as $grupo)
		{
			$incluigrupo = TRUE;
			$temp = ixml($grupo,"PERFIL");
			if ($temp != "")
			{
				$incluigrupo = FALSE;
				$perfis = explode(",",$temp);
				if ($this->array_in_array($this->perfil,$perfis))
				{$incluigrupo = TRUE;}
			}
			//verifica se existem temas no nível de grupo
			if ($incluigrupo == TRUE)
			{
				$temas = array();
				foreach($grupo->TEMA as $temar)
				{
					$down = "nao";
					$ogc = "sim";
					$temp = ixml($temar,"DOWNLOAD");
					if (($temp == "sim") || ($temp == "SIM"))
					{$down = "sim";}
					$temp = ixml($temar,"OGC");
					if (($temp == "nao") || ($temp == "NAO"))
					{$ogc = "nao";}
					$link = " ";
					$temp = ixml($temar,"TLINK");
					if ($temp != "")
					{$link = $temp;}
					$tid = ixml($temar,"TID");
					$nome = ixml($temar,"TNOME");
					$temas[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down,"ogc"=>$ogc);
				}
				$subgrupos = array();
				if($listasgrupos=="sim")
				{
					foreach($grupo->SGRUPO as $sgrupo)
					{
						$incluisgrupo = TRUE;
						$temp = ixml($sgrupo,"PERFIL");
						if ($temp != "")
						{
							$incluisgrupo = FALSE;
							$perfis = explode(",",$temp);
							if ($this->array_in_array($this->perfil,$perfis))
							{$incluisgrupo = TRUE;}
						}
						if ($incluisgrupo == TRUE)
						{
							//verifica se existem temas que podem receber download
							$down = "nao";
							$ogc = "nao";
							foreach($sgrupo->TEMA as $tema)
							{
								$temp = ixml($tema,"DOWNLOAD");
								if (($temp == "sim") || ($temp == "SIM"))
								{$down = "sim";}
								$temp = ixml($temar,"OGC");
								if (($temp != "nao") || ($temp != "NAO"))
								{$ogc = "sim";}
							}
							$nome = ixml($sgrupo,"SDTIPO");
							$subgrupos[] = array("nome"=>$nome,"download"=>$down,"ogc"=>$ogc);
						}
					}
				}
				$nome = ixml($grupo,"GTIPO");
				$grupos[] = array("nome"=>$nome,"subgrupos"=>$subgrupos,"temasgrupo"=>$temas);
			}
		}
		$grupos[] = array("temasraiz"=>$temasraiz);
		//pega os sistemas checando os perfis
		$sistemas = array();
		if ($listasistemas == "sim")
		{
			foreach($this->xmlsistemas->SISTEMA as $s)
			{
				$nomesis = ixml($s,"NOMESIS");
				$ps = ixml($s,"PERFIL");
				$perfis = explode(",",$ps);
				if (($this->array_in_array($this->perfil,$perfis)) || ($ps == ""))
				{
					$funcoes = array();
					foreach($s->FUNCAO as $f)
					{
						$n = ixml($f,"NOMEFUNCAO");
						$a = ixml($f,"ABRIR");
						$w = ixml($f,"JANELAW");
						$h = ixml($f,"JANELAH");
						$p = ixml($f,"PERFIL");
						if (($this->array_in_array($this->perfil,$perfis)) || ($p == ""))
						{$funcoes[] = array("NOME"=>$n,"ABRIR"=>$a,"W"=>$w,"H"=>$h);}
					}
					$sistemas[] =  array("NOME"=>$nomesis,"FUNCOES"=>$funcoes);
				}
			}
		}
		$grupos[] = array("idmenu"=>$idmenu);
		$grupos[] = array("sistemas"=>$sistemas);
		return ($grupos);
	}
/*
function: pegaListaDeSubGrupos

Pega a lista de sub-grupos.

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Os grupos e subgrupos são definidos no xml menutemas/menutemas.xml e os sistemas em menutemas/sistemas.xml.

Parameters:

idmenu - id que identifica o xml que será utilizado (definido na variável $menutemas em ms_configura.php)

grupo - código do grupo

return:

array
*/
	function pegaListaDeSubGrupos($codgrupo,$idmenu="")
	{
		$this->xml = "";
		if (file_exists("../ms_configura.php"))
		{include_once("../ms_configura.php");}
		if ((isset($menutemas)) && ($menutemas != "") && ($idmenu != ""))
		{
			foreach ($menutemas as $m)
			{
				if (($m["idmenu"] == $idmenu))
				{$this->xml = simplexml_load_file($m["arquivo"]);}
			} 
		}
		if (($this->xml == "") && ($menutemas == ""))
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		}
		if ($this->xml == "")
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		}
		$conta = 0;
		$subgrupos[] = array();
		foreach($this->xml->GRUPO as $grupo)
		{
			$temp = ixml($grupo,"PERFIL");
			if ($conta == $codgrupo)
			{
				$incluigrupo = TRUE;
				if ($temp != "")
				{
					$incluigrupo = FALSE;
					$perfis = explode(",",$temp);
					if ($this->array_in_array($this->perfil,$perfis))
					{$incluigrupo = TRUE;}
				}
				//verifica se existem temas no nível de grupo
				if ($incluigrupo == TRUE)
				{
					$subgrupos = array();
					foreach($grupo->SGRUPO as $sgrupo)
					{
						$incluisgrupo = TRUE;
						$temp = ixml($sgrupo,"PERFIL");
						if ($temp != "")
						{
							$incluisgrupo = FALSE;
							$perfis = explode(",",$temp);
							if ($this->array_in_array($this->perfil,$perfis))
							{$incluisgrupo = TRUE;}
						}
						if (($incluisgrupo == TRUE))
						{
							$down = "nao";
							$ogc = "nao";
							$nome = ixml($sgrupo,"SDTIPO");
							$subgrupos[] = array("nome"=>$nome,"download"=>$down,"ogc"=>$ogc);
						}
					}
				}
					$temas = array();
					foreach($grupo->TEMA as $temar)
					{
						$down = "nao";
						$ogc = "sim";
						$temp = ixml($temar,"DOWNLOAD");
						if (($temp == "sim") || ($temp == "SIM"))
						{$down = "sim";}
						$temp = ixml($temar,"OGC");
						if (($temp == "nao") || ($temp == "NAO"))
						{$ogc = "nao";}
						$link = " ";
						$temp = ixml($temar,"TLINK");
						if ($temp != "")
						{$link = $temp;}
						$tid = ixml($temar,"TID");
						$nome = ixml($temar,"TNOME");
						$temas[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down,"ogc"=>$ogc);
					}

			}
			$conta = $conta + 1;
		}
		return (array("subgrupo"=>$subgrupos,"temasgrupo"=>$temas));
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
	function pegaListaDeTemas($grupo,$subgrupo,$idmenu)
	{
		$this->xml = "";
		if (file_exists("../ms_configura.php"))
		{include_once("../ms_configura.php");}
		if ((isset($menutemas)) && ($menutemas != "") && ($idmenu != ""))
		{
			foreach ($menutemas as $m)
			{
				if (($m["idmenu"] == $idmenu))
				{$this->xml = simplexml_load_file($m["arquivo"]);}
			} 
		}
		if ($this->xml == "")
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml = simplexml_load_file("menutemas/menutemas.xml");}
		}
		$contagrupo = 0;
		$temas = array();
		foreach($this->xml->GRUPO as $g)
		{
			$incluigrupo = TRUE;
			if (ixml($g,"PERFIL") != "")
			{
				$incluigrupo = FALSE;
				$perfis = explode(",",ixml($g,"PERFIL"));
				if ($this->array_in_array($this->perfil,$perfis))
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
						if (ixml($s,"PERFIL") != "")
						{
							$incluisgrupo = FALSE;
							$perfis = explode(",",ixml($s,"PERFIL"));
							if ($this->array_in_array($this->perfil,$perfis))
							{$incluisgrupo = TRUE;}
						}
						if ($incluisgrupo == TRUE)
						{
							if ($contasubgrupo == $subgrupo)
							{
								foreach($s->TEMA as $tema)
								{
									$inclui = TRUE;
									if (ixml($tema,"PERFIL") != "")
									{
										
										$inclui = FALSE;
										$perfis = explode(",",ixml($tema,"PERFIL"));
										if ($this->array_in_array($this->perfil,$perfis))
										{$inclui = TRUE;}
									}
									if ($inclui == TRUE)
									{
										$down = "nao";
										if (($tema->DOWNLOAD == "sim") || ($tema->DOWNLOAD == "SIM"))
										{$down = "sim";}
										$ogc = "sim";
										if (($tema->OGC == "nao") || ($tema->OGC == "NAO"))
										{$ogc = "nao";}
										$link = " ";
										if ($tema->TLINK != "")
										{$link = ixml($tema,"TLINK");}
										$tid = ixml($tema,"TID");
										$nome = ixml($tema,"TNOME");
										$temas[] = array("tid"=>$tid,"nome"=>$nome,"link"=>$link,"down"=>$down,"ogc"=>$ogc);
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
		$this->xml = array();
		if (file_exists("../ms_configura.php"))
		{include_once("../ms_configura.php");}
		if ((isset($menutemas)) && ($menutemas != ""))
		{
			foreach ($menutemas as $m)
			{
				$this->xml[] = simplexml_load_file($m["arquivo"]);
			} 
		}
		if ($this->xml == "")
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml[] = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml[] = simplexml_load_file("menutemas/menutemas.xml");}
		}
		$resultado = array();
		$listadetemas = array();
		foreach ($this->xml as $xml)
		{
			foreach($xml->GRUPO as $grupo)
			{
				$incluigrupo = TRUE;
				$temp = ixml($grupo,"PERFIL");
				if ($temp != "")
				{
					$incluigrupo = FALSE;
					$perfis = explode(",",$temp);
					if ($this->array_in_array($this->perfil,$perfis))
					{$incluigrupo = TRUE;}
				}
				if ($incluigrupo == TRUE)
				{
					foreach($grupo->SGRUPO as $sgrupo)
					{
						$incluisgrupo = TRUE;
						if ($this->perfil != "")
						{
							$temp = ixml($sgrupo,"PERFIL");
							$perfis = explode(",",$temp);
							if (!$this->array_in_array($this->perfil,$perfis))
							{$incluisgrupo = FALSE;}
						}
						if ($incluisgrupo == TRUE)
						{
							foreach($sgrupo->TEMA as $tema)
							{
								$inclui = TRUE;
								if ($this->perfil != "")
								{
									$temp = ixml($tema,"PERFIL");
									$perfis = explode(",",$temp);
									if (!$this->array_in_array($this->perfil,$perfis))
									{$inclui = FALSE;}
								}
								if ($inclui == TRUE)
								{
									$down = "nao";
									$temp = ixml($tema,"DOWNLOAD");
									if (($temp == "sim") || ($temp == "SIM"))
									{$down = "sim";}
									$link = ixml($tema,"TLINK");
									$tid = ixml($tema,"TID");
									$texto = array("tid"=>$tid,"nome"=>(ixml($tema,"TNOME")),"link"=>$link,"download"=>$down);
									$p1 = $this->removeAcentos($procurar);
									$p1 = $this->removeAcentos(htmlentities($p1));
									
									$pp1 = $this->removeAcentos(ixml($tema,"TNOME"));
									$pp1 = $this->removeAcentos($pp1);
									$pp1 = $this->removeAcentos(htmlentities($pp1));
									
									if (stristr($pp1,$p1) || stristr(ixml($tema,"TNOME"),htmlentities($procurar)))
									{$listadetemas[] = $texto;}
									
									if(ixml($tema,"TAGS") != "")
									{
										$pp1 = ixml($tema,"TAGS");
										$pp1 = $this->removeAcentos($pp1);
										if (stristr($pp1,$p1))
										{$listadetemas[] = $texto;}	
									}
								}
							}
							if (count($listadetemas) > 0)
							{
								$subgrupo[] = array("subgrupo"=>(ixml($sgrupo,"SDTIPO")),"temas"=>$listadetemas);
							}
						}
						$listadetemas = array();
					}
					if (count($subgrupo) > 0)
					{
						$resultado[] = array("grupo"=>(ixml($grupo,"GTIPO")),"subgrupos"=>$subgrupo);
					}
					$subgrupo = array();
				}
			}
		}
		return ($resultado);
	}
/*
function: listaTags

Lista os tags registrados nos menus de temas.

Parameters:

rss - (opcional) endereço de um RSS para cruzar com as tags.

nrss - (opcional) número de registros no rss que serão considerados

*/
	function listaTags($rss="",$nrss="")
	{
		//carrega os títulos e links do rss especificado
		$noticiasRSS = array(); //guarda as notícias originais do RRS
		if($rss != "")
		{
			$conta = 0;
			foreach ( simplexml_load_file ($rss)->channel->item as $item )
			{
				if($conta < $nrss)
				$noticiasRSS[] = array("desc"=>(ixml($item,"description")),"titulo"=>(ixml($item,"title")),"link"=>(ixml($item,"link")));
				$conta++;
			}	
		}
		$this->xml = array();
		if (file_exists("../ms_configura.php"))
		{include_once("../ms_configura.php");}
		if ((isset($menutemas)) && ($menutemas != ""))
		{
			foreach ($menutemas as $m)
			{
				$this->xml[] = simplexml_load_file($m["arquivo"]);
			} 
		}
		if ($this->xml == "")
		{
			if (file_exists("../menutemas/menutemas.xml"))
			{$this->xml[] = simplexml_load_file("../menutemas/menutemas.xml");}
			else
			{$this->xml[] = simplexml_load_file("menutemas/menutemas.xml");}
		}
		$resultado = array();
		$noticias = array();
		foreach ($this->xml as $xml)
		{
			foreach($xml->GRUPO as $grupo)
			{
				$incluigrupo = TRUE;
				$temp = ixml($grupo,"PERFIL");
				if ($temp != "")
				{
					$incluigrupo = FALSE;
					$perfis = explode(",",$temp);
					if ($this->array_in_array($this->perfil,$perfis))
					{$incluigrupo = TRUE;}
				}
				if ($incluigrupo == TRUE)
				{
					foreach($grupo->SGRUPO as $sgrupo)
					{
						$incluisgrupo = TRUE;
						if ($this->perfil != "")
						{
							$temp = ixml($sgrupo,"PERFIL");
							$perfis = explode(",",$temp);
							if (!$this->array_in_array($this->perfil,$perfis))
							{$incluisgrupo = FALSE;}
						}
						if ($incluisgrupo == TRUE)
						{
							foreach($sgrupo->TEMA as $tema)
							{
								$inclui = TRUE;
								if ($this->perfil != "")
								{
									$temp = ixml($tema,"PERFIL");
									$perfis = explode(",",$temp);
									if (!$this->array_in_array($this->perfil,$perfis))
									{$inclui = FALSE;}
								}
								if ($inclui == TRUE)
								{
									$tid = ixml($tema,"TID");
									$tags = explode(" ",ixml($tema,"TAGS"));
									foreach ($tags as $tag)
									{
										if($tag != "")
										{
											if(!$resultado[$tag])
											{
												$resultado[$tag] = array($tid);
												//busca noticias
												if(count($noticiasRSS) > 0)
												{
													foreach($noticiasRSS as $noticia)
													{
														$titulo = explode(" ",strtolower($this->removeAcentos($noticia["desc"])));
														$t = $this->removeAcentos($tag);
														if(in_array(strtolower($t),$titulo))
														{
															//echo $noticia["link"]."<br>";
															if(!$noticias[$tag])
															$noticias[$tag] = array("titulo"=>$noticia["titulo"],"link"=>$noticia["link"]);
															else
															$noticias[$tag] = array_merge($noticias[$tag],array("titulo"=>$noticia["titulo"],"link"=>$noticia["link"]));
														}
													}	
												}
											}
											else
											{
												$resultado[$tag] = array_merge($resultado[$tag],array($tid));
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		ksort($resultado);
		foreach(array_keys($resultado) as $k)
		{
			
			if($noticias[$k])
			{$not = array($noticias[$k]);}
			else
			{$not = array();}
			$final[] = array("tag"=>$k,"temas"=>$resultado[$k],"noticias"=>$not);
		}
		return ($final);
	}
	
	function removeAcentos($s)
	{
		$s = ereg_replace("[áàâã]","a",$s);
		$s = ereg_replace("[ÁÀÂÃ]","A",$s);
		$s = ereg_replace("[éèê]","e",$s);
		$s = ereg_replace("[í]","i",$s);
		$s = ereg_replace("[Í]","I",$s);
		$s = ereg_replace("[ÉÈÊ]","E",$s);
		$s = ereg_replace("[óòôõ]","o",$s);
		$s = ereg_replace("[ÓÒÔÕ]","O",$s);
		$s = ereg_replace("[úùû]","u",$s);
		$s = ereg_replace("[ÚÙÛ]","U",$s);
		$s = str_replace("ç","c",$s);
		$s = str_replace("Ç","C",$s);
		//$str = htmlentities($s);
		$str = preg_replace("/(&)([a-z])([a-z]+;)/i", '$2', $s);
		$str = preg_replace("/[^A-Z0-9]/i", ' ', $str);
		$str = preg_replace("/\s+/i", ' ', $str);
		return $str;
	}
	/*
	Function: array_in_array

	Procura ocorrências de um array em outro array
	*/
	function array_in_array($needle, $haystack)
	{
    	//Make sure $needle is an array for foreach
    	if(!is_array($needle)) $needle = array($needle);
    	//For each value in $needle, return TRUE if in $haystack
    	foreach($needle as $pin)
        	if(in_array($pin, $haystack)) return TRUE;
    	//Return FALSE if none of the values from $needle are found in $haystack
    	return FALSE;
	}
	
}
?>