<?php
/*
Title: classe_menutemas.php

Manipulação dos temas do arquivo menutemas.xml ou sistema de administração

Quando o i3Geo está configurado para acessar o sistema de administração, os métodos desta classe
passam a utilizar a classe i3geo/admin/php/classe_arvore.php

Lista temas, grupos,etc.

Licenca:

GPL2


I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

$map_file - (opcional) endereço do mapfile no servidor

$perfil - (opcional) lista dos perfis, separados por espaços, que devem restringir a lista de menus, grupos, temas e etc.

$locaplic - (opcional) endereço físico do i3geo

$urli3geo - (opcional) url onde está o i3geo (p.ex. http://localhost/i3geo

$editores - (opcional) array com os editores cadastrados no ms_configura.php

$idioma - (opcional) pt|en|es|it
*/  	
	function __construct($map_file="",$perfil="",$locaplic="",$urli3geo="",$editores="",$idioma="pt")
	{
		if($editores == "")
		{
			if(file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
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
		//verifica se o ip atual está cadastrado como um dos editores
		//editores podem ver as coisas marcadas como não publicado
		//no sistema de administração
		//
		$this->editor = false;
		if($editores != "")
		{$this->editor = $this->verificaeditores($editores);}
		$this->editores = $editores;
	}
/*
function: pegaListaDeMenus

Pega a lista de menus do banco de dados de administração.

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Parametros:

return:
array
*/
	function pegaListaDeMenus()
	{
		$resultado = array();
		//necessário por conta da inclusao do conexao.php
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

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Os grupos e subgrupos são definidos no xml menutemas/menutemas.xml e os sistemas em menutemas/sistemas.xml.

Parametros:

idmenu - id que identifica o xml que será utilizado (definido na variável $menutemas em ms_configura.php)

listasistemas - sim|nao pega a lista de sistemas para montar a árvore de sistemas

listasgrupos - sim|nao lista também os subgrupos associados

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

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Os grupos e subgrupos são definidos no xml menutemas/menutemas.xml e os sistemas em menutemas/sistemas.xml.

Parametros:

idmenu - id que identifica o xml que será utilizado (definido na variável $menutemas em ms_configura.php)

grupo - código do grupo

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

Le o arquivo xml com os temas e retorna um array com a lista de temas de um subgrupo.

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

Le o arquivo xml com a lista de mapas existente no xml $locmapas.

O perfil do usuário é armazenado na seção na inicialização do I3Geo.

Parametros:

locmapas - endereço do arquivo xml.

return:
array
*/
	function pegaListaDeMapas($locmapas)
	{
		//necessário por conta da inclusao do conexao.php
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

Retorna a lista de sistemas especiais de adição de temas.

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
function: procurartemas

Procura um tema no menu de temas considerando apenas os subgrupos.

parameters:

$procurar - String que será procurada.
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
				if(!isset($menu["url"])){$menu["url"] = "";} //para efeitos de compatibilidade entre versões do i3geo
				$ondexml = $menu["arquivo"];
				if($menu["url"] != ""){$ondexml = $menu["url"];}
				$this->xml[] = simplexml_load_file($ondexml);
			}
		}
		else
		{
				//$this->xml[] = simplexml_load_string(geraXmlMenutemas(implode(" ",$this->perfil),$menu["idmenu"],$tipo,$this->locaplic));	
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

$procurar - String que será procurada.
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
function: listaTags

Lista os tags registrados nos menus de temas.

Parametros:

rss - (opcional) endereço de um RSS para cruzar com as tags.

nrss - (opcional) número de registros no rss que serão considerados

*/
	function listaTags($rss="",$nrss="")
	{
		include_once($this->locaplic."/admin/php/xml.php");
		$tipo = "";
		//carrega os títulos e links do rss especificado
		$noticiasRSS = array(); //guarda as notícias originais do RRS
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
			if(!isset($menu["url"])){$menu["url"] = "";} //para efeitos de compatibilidade entre versões do i3geo
			$ondexml = $menu["arquivo"];
			if($menu["url"] != ""){$ondexml = $menu["url"];}
			if($ondexml != "")
			{$this->xml[] = simplexml_load_file($ondexml);}
			else //pega o xml do sistema de administração
			{
				$this->xml[] = simplexml_load_string(geraXmlMenutemas(implode(" ",$this->perfil),$menu["idmenu"],$tipo,$this->locaplic));	
			}
		}

		$resultado = array();
		$noticias = array();
		foreach ($this->xml as $xml)
		{
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