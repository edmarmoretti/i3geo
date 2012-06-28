<?php
/*
Title: classe_menutemas.php

Manipula&ccedil;&atilde;o dos temas do arquivo menutemas.xml ou sistema de administra&ccedil;&atilde;o

Quando o i3Geo est&aacute; configurado para acessar o sistema de administra&ccedil;&atilde;o, os m&eacute;todos desta classe
passam a utilizar a classe i3geo/admin/php/classe_arvore.php

Lista temas, grupos,etc.

Licenca:

GPL2


i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/classe_menutemas.php

*/
/*
Classe: Menutemas
*/
class Menutemas
{
/*
function: __construct

Cria um objeto Menutemas

parameters:

$map_file - (opcional) endere&ccedil;o do mapfile no servidor

$perfil - (opcional) lista dos perfis, separados por espa&ccedil;os, que devem restringir a lista de menus, grupos, temas e etc.

$locaplic - (opcional) endere&ccedil;o f&iacute;sico do i3geo

$urli3geo - (opcional) url onde est&aacute; o i3geo (p.ex. http://localhost/i3geo

$editores - (opcional) array com os editores cadastrados no ms_configura.php

$idioma - (opcional) pt|en|es|it
*/  	
	function __construct($map_file="",$perfil="",$locaplic="",$urli3geo="",$editores="",$idioma="pt")
	{
		if($editores == "")
		{
			if(file_exists("../ms_configura.php"))
			{include("../ms_configura.php");}
		}
		$perfil = str_replace(" ",",",$perfil);
		$this->perfil = explode(",",$perfil);
		$this->locaplic = $locaplic;
		$this->urli3geo = $urli3geo;
		$this->idioma = $idioma;
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
		//
		//verifica se o ip atual est&aacute; cadastrado como um dos editores
		//editores podem ver as coisas marcadas como n&atilde;o publicado
		//no sistema de administra&ccedil;&atilde;o
		//
		$this->editor = false;
		if($editores != "")
		{$this->editor = $this->verificaeditores($editores);}
		$this->editores = $editores;
	}
/*
function: pegaListaDeMenus

Pega a lista de menus do banco de dados de administra&ccedil;&atilde;o.

O perfil do usu&aacute;rio &eacute; armazenado na se&ccedil;&atilde;o na inicializa&ccedil;&atilde;o do I3Geo.

Parametros:

return:
array
*/
	function pegaListaDeMenus()
	{
		$resultado = array();
		//necess&aacute;rio por conta da inclusao do conexao.php
		$locaplic = $this->locaplic;
		if(!isset($this->locaplic))
		{return "locaplic nao foi definido";}
		include_once($this->locaplic."/admin/php/classe_arvore.php");
		$arvore = new Arvore($this->locaplic,$this->idioma);
		$resultado = $arvore->pegaListaDeMenus($this->perfil);
		unset($arvore);
		return ($resultado);
	}
/*
function: pegaListaDeGrupos

Pega a lista de grupos, subgrupos e sistemas adicionais.

O perfil do usu&aacute;rio &eacute; armazenado na se&ccedil;&atilde;o na inicializa&ccedil;&atilde;o do I3Geo.

Parametros:

idmenu - id que identifica o menu

listasistemas - sim|nao pega a lista de sistemas para montar a &aacute;rvore de sistemas

listasgrupos - sim|nao lista tamb&eacute;m os subgrupos associados

return:

array
*/
	function pegaListaDeGrupos($idmenu="",$listasistemas="sim",$listasgrupos="sim")
	{
		$locaplic = $this->locaplic;
		if($listasgrupos == "sim")
		{$tipo = "";}
		else
		{$tipo = "gruposeraiz";}
		$tempm = $this->pegaListaDeMenus();
		foreach($tempm as $menu)
		{
			if($menu["idmenu"] == $idmenu || $idmenu == "")
			{
				include_once("../admin/php/classe_arvore.php");
				$arvore = new Arvore($this->locaplic,$this->idioma);
				$grupos = $arvore->formataGruposMenu($idmenu,$this->perfil,$listasgrupos);
				unset($arvore);
			}
		}
		return ($grupos);
	}
/*
function: pegaListaDeSubGrupos

Pega a lista de sub-grupos.

O perfil do usu&aacute;rio &eacute; armazenado na se&ccedil;&atilde;o na inicializa&ccedil;&atilde;o do I3Geo.

Parametros:

codgrupo - código do grupo

idmenu - id que identifica o menu

return:

array
*/
	function pegaListaDeSubGrupos($codgrupo,$idmenu="")
	{
		$locaplic=$this->locaplic;
		$tipo = "subgrupos";
		foreach($this->pegaListaDeMenus() as $menu)
		{
			if($menu["idmenu"] == $idmenu || $idmenu == "")
			{
				include_once("../admin/php/classe_arvore.php");
				$arvore = new Arvore($this->locaplic,$this->idioma);
				$subGrupos = $arvore->formataSubgruposGrupo($idmenu,$codgrupo,$this->perfil);
				unset($arvore);
				return($subGrupos);
			}
		}
		$conta = 0;
		$subgrupos[] = array();
		return (array("subgrupo"=>$subgrupos,"temasgrupo"=>$temas));
	}
/*
function: pegaListaDeTemas

Lista de temas de um subgrupo

parameters:

$grupo - Id do grupo.

$subgrupo - Id do subgrupo

return:
array
*/
	function pegaListaDeTemas($grupo,$subgrupo,$idmenu)
	{
		include_once("../admin/php/classe_arvore.php");
		$arvore = new Arvore($this->locaplic,$this->idioma);
		$temas = $arvore->formataTemasSubgrupo($subgrupo,$this->perfil);
		unset($arvore);
		return($temas);
	}
/*
function: pegaListaDeMapas

Lista de mapas cadastrados

O perfil do usu&aacute;rio &eacute; armazenado na se&ccedil;&atilde;o na inicializa&ccedil;&atilde;o do I3Geo.

Parametros:

locmapas - endere&ccedil;o do arquivo xml.

return:
array
*/
	function pegaListaDeMapas($locmapas)
	{
		//necess&aacute;rio por conta da inclusao do conexao.php
		$locaplic = $this->locaplic;
		$perfilgeral = implode(" ",$this->perfil);
		if($locmapas != "")
		{$this->xml = simplexml_load_file($locmapas);}
		else
		{
			include_once($this->locaplic."/admin/php/xml.php");
			$this->xml = simplexml_load_string(geraXmlMapas(implode(" ",$this->perfil),$this->locaplic,$this->editores));
		}
		$mapas = array();
		//pega os sistemas checando os perfis
		foreach($this->xml->MAPA as $s)
		{
			$ps = $this->ixml($s,"PERFIL");
			$perfis = str_replace(","," ",$ps);
			$perfis = explode(" ",$perfis);
			if (($this->array_in_array($this->perfil,$perfis)) || ($ps == ""))
			{
				$n = $this->ixml($s,"NOME");
				$i = $this->ixml($s,"IMAGEM");
				$t = $this->ixml($s,"TEMAS");
				$l = $this->ixml($s,"LIGADOS");
				$e = $this->ixml($s,"EXTENSAO");
				$o = $this->ixml($s,"OUTROS");
				$k = $this->ixml($s,"LINKDIRETO");
				$p = $this->ixml($s,"PUBLICADO");
				$mapas[] =  array("PUBLICADO"=>$p,"NOME"=>$n,"IMAGEM"=>$i,"TEMAS"=>$t,"LIGADOS"=>$l,"EXTENSAO"=>$e,"OUTROS"=>$o,"LINK"=>$k);
			}
		}
		return (array("mapas"=>$mapas));
	}	
/*
function: pegaSistemas

Retorna a lista de sistemas especiais de adi&ccedil;&atilde;o de temas.

parameters:

Return:

Array
*/
	function pegaSistemas()
	{
		error_reporting(0);
		include_once($this->locaplic."/admin/php/xml.php");
		$xmlsistemas = simplexml_load_string(geraXmlSistemas(implode(" ",$this->perfil),$this->locaplic,$this->editores));
		$sistemas = array();
		foreach($xmlsistemas->SISTEMA as $s)
		{
			$publicado = $this->ixml($s,"PUBLICADO");

			if(strtolower($publicado) != "nao" || $this->editor)
			{
				$nomesis = $this->ixml($s,"NOMESIS");
				$ps = $this->ixml($s,"PERFIL");
				$perfis = str_replace(","," ",$ps);
				$perfis = explode(" ",$perfis);
				if (($this->array_in_array($this->perfil,$perfis)) || ($ps == ""))
				{
					$funcoes = array();
					foreach($s->FUNCAO as $f)
					{
						$n = $this->ixml($f,"NOMEFUNCAO");
						$a = $this->ixml($f,"ABRIR");
						$w = $this->ixml($f,"JANELAW");
						$h = $this->ixml($f,"JANELAH");
						$p = $this->ixml($f,"PERFIL");
						if (($this->array_in_array($this->perfil,$perfis)) || ($p == ""))
						{$funcoes[] = array("NOME"=>$n,"ABRIR"=>$a,"W"=>$w,"H"=>$h);}
					}
					$sistemas[] =  array("PUBLICADO"=>$publicado,"NOME"=>$nomesis,"FUNCOES"=>$funcoes);
				}
			}
		}
		return $sistemas;		
	}
/*
function: pegaSistemasI

Retorna a lista de sistemas especiais de identifica&ccedil;&atilde;o de temas.

parameters:

Return:

Array
*/
	function pegaSistemasI()
	{
		error_reporting(0);
		include_once($this->locaplic."/admin/php/xml.php");
		
		$xmlsistemas = simplexml_load_string(geraXmlIdentifica(implode(" ",$this->perfil),$this->locaplic,$this->editores));
		$sistemas = array();
		foreach($xmlsistemas->FUNCAO as $s)
		{
			$publicado = $this->ixml($s,"PUBLICADO");
			if(strtolower($publicado) != "nao" || $this->editor)
			{
				$nomesis = $this->ixml($s,"NOMESIS");
				$ps = $this->ixml($s,"PERFIL");
				$perfis = str_replace(","," ",$ps);
				$perfis = explode(" ",$perfis);
				if (($this->array_in_array($this->perfil,$perfis)) || ($ps == ""))
				{
					$sistemas[] = array("PUBLICADO"=>$publicado,"NOME"=>$nomesis,"TARGET"=>($this->ixml($s,"TARGET")),"ABRIR"=>($this->ixml($s,"ABRIR")));
				}
			}
		}
		return $sistemas;		
	}	
/*
function: procurartemas

Procura um tema no menu de temas considerando apenas os subgrupos.

parameters:

$procurar - String que ser&aacute; procurada.
*/
	function procurartemas($procurar)
	{
		include_once($this->locaplic."/admin/php/xml.php");
		$tipo = "";
		$this->xml = "";
		if($this->menutemas != "")
		{
			foreach($this->pegaListaDeMenus() as $menu)
			{
				if(!isset($menu["url"])){$menu["url"] = "";} //para efeitos de compatibilidade entre vers&otilde;es do i3geo
				$ondexml = $menu["arquivo"];
				if($menu["url"] != ""){$ondexml = $menu["url"];}
				$this->xml[] = simplexml_load_file($ondexml);
			}
		}
		else
		{
			include_once("../admin/php/classe_arvore.php");
			$arvore = new Arvore($this->locaplic,$this->idioma);
			$temas = $arvore->procuraTemas($procurar,$this->perfil);
			unset($arvore);
			return($temas);
		}
		$resultado = array();
		$texto = array();
		foreach ($this->xml as $xml)
		{
			$listadetemas = array();
			$subgrupo = array();
			foreach($xml->GRUPO as $grupo)
			{
				$incluigrupo = TRUE;
				$temp = $this->ixml($grupo,"PERFIL");
				if ($temp != "")
				{
					$incluigrupo = FALSE;
					$perfis = str_replace(","," ",$temp);
					$perfis = explode(" ",$perfis);
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
							$temp = $this->ixml($sgrupo,"PERFIL");
							$perfis = str_replace(","," ",$temp);
							$perfis = explode(" ",$perfis);
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
									$temp = $this->ixml($tema,"PERFIL");
									$perfis = str_replace(","," ",$temp);
									$perfis = explode(" ",$perfis);
									if (!$this->array_in_array($this->perfil,$perfis))
									{$inclui = FALSE;}
								}
								if ($inclui == TRUE)
								{
									$down = "nao";
									$temp = $this->ixml($tema,"DOWNLOAD");
									if (($temp == "sim") || ($temp == "SIM"))
									{$down = "sim";}
									$link = $this->ixml($tema,"TLINK");
									$tid = $this->ixml($tema,"TID");
									
									if(!isset($texto[$tid]))
									{
										$texto[$tid] = array("tid"=>$tid,"nome"=>($this->ixml($tema,"TNOME")),"link"=>$link,"download"=>$down);
										$p1 = $this->removeAcentos($procurar);
										$p1 = $this->removeAcentos(htmlentities($p1));
										$pp1 = $this->removeAcentos($this->ixml($tema,"TNOME"));
										$pp1 = $this->removeAcentos($pp1);
										$pp1 = $this->removeAcentos(htmlentities($pp1));
										if (stristr($pp1,$p1) || stristr($this->ixml($tema,"TNOME"),htmlentities($procurar)))
										{
											$listadetemas[] = $texto[$tid];
										}
										else
										if($this->ixml($tema,"TAGS") != "")
										{
											$pp1 = $this->ixml($tema,"TAGS");
											$pp1 = $this->removeAcentos($pp1);
											if (stristr($pp1,$p1))
											{$listadetemas[] = $texto[$tid];}	
										}
									}
								}
							}
							if (count($listadetemas) > 0)
							{
								$subgrupo[] = array("subgrupo"=>($this->ixml($sgrupo,"SDTIPO")),"temas"=>$listadetemas);
							}
							$listadetemas = array();
						}
						
					}
					if (count($subgrupo) > 0)
					{
						$resultado[] = array("grupo"=>($this->ixml($grupo,"GTIPO")),"subgrupos"=>$subgrupo);
					}
					$subgrupo = array();
				}
			}
		}
		return ($resultado);
	}
/*
function: procurartemas2

Procura um tema no menu de temas.

parameters:

$procurar - String que ser&aacute; procurada.
*/
	function procurartemas2($procurar)
	{
		include_once("../admin/php/classe_arvore.php");
		$arvore = new Arvore($this->locaplic,$this->idioma);
		$temas = $arvore->procuraTemas($procurar,$this->perfil);
		unset($arvore);
		return($temas);
	}
/*
function: procurartemasestrela

Procura temas com determinado n&uacute;mero de estrelas

parameters:

$nivel - n&uacute;mero de estrelas

$fatorestrela - valor para normalizar o total de acessos com o valor da estrela
*/
	function procurartemasestrela($nivel,$fatorestrela)
	{
		include_once("../admin/php/classe_arvore.php");
		$arvore = new Arvore($this->locaplic,$this->idioma);
		$temas = $arvore->procuraTemasEstrela($nivel,$fatorestrela,$this->perfil);
		unset($arvore);
		return($temas);
	}
/*
function: listaTags

Lista os tags registrados nos menus de temas.

Parametros:

rss - (opcional) endere&ccedil;o de um RSS para cruzar com as tags.

nrss - (opcional) n&uacute;mero de registros no rss que ser&atilde;o considerados

*/
	function listaTags($rss="",$nrss="")
	{
		include_once($this->locaplic."/admin/php/xml.php");
		$tipo = "";
		//carrega os t&iacute;tulos e links do rss especificado
		$noticiasRSS = array(); //guarda as not&iacute;cias originais do RRS
		if($rss != "")
		{
			$conta = 0;
			foreach ( simplexml_load_file($rss)->channel->item as $item )
			{
				if($conta < $nrss)
				$noticiasRSS[] = array("desc"=>($this->ixml($item,"description")),"titulo"=>($this->ixml($item,"title")),"link"=>($this->ixml($item,"link")));
				$conta++;
			}	
		}
		$this->xml = array();
		foreach($this->pegaListaDeMenus() as $menu)
		{
			$x = geraXmlMenutemas(implode(" ",$this->perfil),$menu["idmenu"],$tipo,$this->locaplic);
			$this->xml[] = $x;
		}
		$resultado = array();
		$noticias = array();
		foreach ($this->xml as $xml)
		{
			$xml = simplexml_load_string($xml);
			foreach($xml->GRUPO as $grupo)
			{
				
				$incluigrupo = TRUE;
				$temp = $this->ixml($grupo,"PERFIL");
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
							$temp = $this->ixml($sgrupo,"PERFIL");
							$perfis = str_replace(","," ",$temp);
							$perfis = explode(" ",$perfis);
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
									$perfis = str_replace(","," ",$temp);
									$perfis = explode(" ",$perfis);
									if (!$this->array_in_array($this->perfil,$perfis))
									{$inclui = FALSE;}
								}
								if ($inclui == TRUE)
								{
									
									$tid = $this->ixml($tema,"TID");
									$tags = explode(" ",$this->ixml($tema,"TAGS"));
									foreach ($tags as $tag)
									{
										
										if($tag != "")
										{
											
											if(!isset($resultado[$tag]))
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
															if(!isset($noticias[$tag]))
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
		//var_dump($resultado);
		foreach(array_keys($resultado) as $k)
		{
			if(isset($noticias[$k]))
			{$not = array($noticias[$k]);}
			else
			{$not = array();}
			$final[] = array("tag"=>$k,"temas"=>$resultado[$k],"noticias"=>$not);
		}
		return ($final);
	}
	
	function removeAcentos($s)
	{
		$s = ereg_replace("[&aacute;à&acirc;&atilde;]","a",$s);
		$s = ereg_replace("[&Aacute;À&Acirc;&Atilde;]","A",$s);
		$s = ereg_replace("[&eacute;è&ecirc;]","e",$s);
		$s = ereg_replace("[&iacute;]","i",$s);
		$s = ereg_replace("[&Iacute;]","I",$s);
		$s = ereg_replace("[&Eacute;È&Ecirc;]","E",$s);
		$s = ereg_replace("[óò&ocirc;&otilde;]","o",$s);
		$s = ereg_replace("[ÓÒ&Ocirc;&Otilde;]","O",$s);
		$s = ereg_replace("[&uacute;ùû]","u",$s);
		$s = ereg_replace("[&Uacute;ÙÛ]","U",$s);
		$s = str_replace("&ccedil;","c",$s);
		$s = str_replace("&Ccedil;","C",$s);
		//$str = htmlentities($s);
		$str = preg_replace("/(&)([a-z])([a-z]+;)/i", '$2', $s);
		$str = preg_replace("/[^A-Z0-9]/i", ' ', $str);
		$str = preg_replace("/\s+/i", ' ', $str);
		return $str;
	}
	/*
	Function: array_in_array

	Procura ocorr&ecirc;ncias de um array em outro array
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
	function verificaEditores($editores)
	{
		$editor = false;
		foreach ($editores as $e)
		{
			$e = gethostbyname($e);
			$ip = "UNKNOWN";
			if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
			else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
			else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
			else $ip = "UNKNOWN";
			if ($e == $ip){$editor=true;}
		}
		return $editor;
	}
	function ixml($no,$nome)
	{
		$texto = $no->$nome;
		if (!mb_detect_encoding($texto,"UTF-8",true))
		{$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");}
		return mb_convert_encoding($texto,"HTML-ENTITIES","auto");
	}

}
?>