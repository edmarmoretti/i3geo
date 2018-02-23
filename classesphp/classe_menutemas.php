<?php
/*
Title: classe_menutemas.php

Manipula&ccedil;&atilde;o dos temas do arquivo menutemas.xml ou sistema de administra&ccedil;&atilde;o

Quando o i3Geo est&aacute; configurado para acessar o sistema de administra&ccedil;&atilde;o, os m&eacute;todos desta classe
passam a utilizar a classe i3geo/classesphp/classe_arvore.php

Lista temas, grupos,etc.

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

$editores - (depreciado) array com os editores cadastrados no ms_configura.php

$idioma - (opcional) pt|en|es|it
*/
	function __construct($map_file="",$perfil="",$locaplic="",$urli3geo="",$editores="",$idioma="pt", $filtro="")
	{
		include(dirname(__FILE__)."/../ms_configura.php");
		$this->postgis_mapa = $postgis_mapa;

		$perfil = str_replace(" ",",",$perfil);
		$this->perfil = explode(",",$perfil);
		$this->locaplic = $locaplic;
		$this->urli3geo = $urli3geo;
		$this->idioma = $idioma;
		$this->filtro = $filtro;
		if (($map_file != "") && (file_exists($map_file)))
		{
			$this->mapa = ms_newMapObj($map_file);
			substituiConObj($this->mapa,$postgis_mapa);

			$this->arquivo = $map_file;
			if ($this->mapa)
			{
				$c = $this->mapa->numlayers;
				for ($i=0;$i < $c;++$i)
				{$this->layers[] = $this->mapa->getlayer($i);}
			}
		}
		//
		//verifica o usuario logado esta cadastrado como um dos publicadores
		//editores podem ver as coisas marcadas como n&atilde;o publicado
		//no sistema de administra&ccedil;&atilde;o
		//
		$this->editor = false;
		$this->editores = "";
		$this->editor = $this->verificaPapelSessao(3);
	}
/*
function: pegaListaDeMenus

Pega a lista de menus do banco de dados de administra&ccedil;&atilde;o.

O perfil do usu&aacute;rio &eacute; armazenado na se&ccedil;&atilde;o na inicializa&ccedil;&atilde;o do I3Geo.

Parametros:

return:
array
*/
	function pegaListaDeMenus($filtraOgc="nao",$filtraDown="nao")
	{
		$resultado = array();
		//necess&aacute;rio por conta da inclusao do conexao.php
		$locaplic = $this->locaplic;
		if(!isset($this->locaplic))
		{return "locaplic nao foi definido";}
		include_once($this->locaplic."/classesphp/classe_arvore.php");
		$arvore = new Arvore($this->locaplic,$this->idioma);
		$resultado = $arvore->pegaListaDeMenus($this->perfil,$filtraOgc,$filtraDown);
		$final = array();
		//pega os temas na raiz
		foreach($resultado as $r){
			$temasR = $arvore->pegaTemasRaizMenu($r["idmenu"]);
			$r["temas"] = $temasR;
			$final[] = $r;
		}
		unset($arvore);
		return ($final);
	}
/*
function: pegaListaDeGrupos

Pega a lista de grupos, subgrupos e sistemas adicionais.

O perfil do usu&aacute;rio &eacute; armazenado na se&ccedil;&atilde;o na inicializa&ccedil;&atilde;o do I3Geo.

Parametros:

idmenu - id que identifica o menu

listasistemas - sim|nao pega a lista de sistemas para montar a &aacute;rvore de sistemas

listasgrupos - sim|nao lista tamb&eacute;m os subgrupos associados

filtro ogc|download|""

return:

array
*/
	function pegaListaDeGrupos($idmenu="",$listasistemas="sim",$listasgrupos="sim",$ordenaNome="nao",$filtraOgc="nao",$filtraDown="nao")
	{
		$locaplic = $this->locaplic;
		if($listasgrupos == "sim")
		{$tipo = "";}
		else
		{$tipo = "gruposeraiz";}
		$tempm = $this->pegaListaDeMenus($filtraOgc,$filtraDown);
		include_once(dirname(__FILE__)."/../classesphp/classe_arvore.php");
		$arvore = new Arvore($this->locaplic,$this->idioma,$this->filtro);
		foreach($tempm as $menu)
		{
			if($menu["idmenu"] == $idmenu || $idmenu == "")
			{
				$grupos = $arvore->formataGruposMenu($idmenu,$this->perfil,$listasgrupos,$ordenaNome,$filtraOgc,$filtraDown);
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

codgrupo - codigo do grupo

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
				include_once(dirname(__FILE__)."/../classesphp/classe_arvore.php");
				$arvore = new Arvore($this->locaplic,$this->idioma,$this->filtro);
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
		include_once(dirname(__FILE__)."/../classesphp/classe_arvore.php");
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
	function pegaListaDeMapas($locmapas,$id_mapa="")
	{
		//necess&aacute;rio por conta da inclusao do conexao.php
		$locaplic = $this->locaplic;
		$perfilgeral = implode(" ",$this->perfil);
		if($locmapas != "")	{
		    $this->xml = simplexml_load_file($locmapas);
		}
		else{
			include_once($this->locaplic."/classesphp/xml.php");
			$this->xml = simplexml_load_string(geraXmlMapas(implode(" ",$this->perfil),$this->locaplic));
		}
		//print_r($this->xml);exit;
		$mapas = array();
		//pega os mapas checando os perfis
		foreach($this->xml->MAPA as $s){
			$ps = $this->ixml($s,"PERFIL");
			$perfis = str_replace(","," ",$ps);
			$perfis = explode(" ",$perfis);
			if (($this->array_in_array($this->perfil,$perfis)) || ($ps == "")){
				$n = $this->ixml($s,"NOME");
				$i = $this->ixml($s,"IMAGEM");
				$t = $this->ixml($s,"TEMAS");
				$l = $this->ixml($s,"LIGADOS");
				$e = $this->ixml($s,"EXTENSAO");
				$o = $this->ixml($s,"OUTROS");
				$k = $this->ixml($s,"LINKDIRETO");
				$p = $this->ixml($s,"PUBLICADO");
				$m = $this->ixml($s,"CONTEMMAPFILE");
				$id = $this->ixml($s,"ID_MAPA");
				$dm = $this->ixml($s,"DESCRICAO");
				//echo $p;
				if($id_mapa != "" && $id == $id_mapa && strtoupper($p) != "NAO"){
				    return array("mapas"=>array("ID_MAPA"=>$id,"PUBLICADO"=>$p,"NOME"=>$n,"IMAGEM"=>$i,"TEMAS"=>$t,"LIGADOS"=>$l,"EXTENSAO"=>$e,"OUTROS"=>$o,"LINK"=>$k,"CONTEMMAPFILE"=>$m,"DESCRICAO"=>$dm));
				}
				if($id_mapa == "" && strtoupper($p) != "NAO"){
				    $mapas[] =  array("ID_MAPA"=>$id,"PUBLICADO"=>$p,"NOME"=>$n,"IMAGEM"=>$i,"TEMAS"=>$t,"LIGADOS"=>$l,"EXTENSAO"=>$e,"OUTROS"=>$o,"LINK"=>$k,"CONTEMMAPFILE"=>$m,"DESCRICAO"=>$dm);
				}
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
		//error_reporting(0);
		include_once($this->locaplic."/classesphp/xml.php");
		$xmlsistemas = simplexml_load_string(geraXmlSistemas(implode(" ",$this->perfil),$this->locaplic));
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
		//error_reporting(0);
		include_once($this->locaplic."/classesphp/xml.php");

		$xmlsistemas = simplexml_load_string(geraXmlIdentifica(implode(" ",$this->perfil),$this->locaplic));
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
		include_once($this->locaplic."/classesphp/xml.php");
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
			include_once(dirname(__FILE__)."/../classesphp/classe_arvore.php");
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
		include_once(dirname(__FILE__)."/../classesphp/classe_arvore.php");
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
		include_once(dirname(__FILE__)."/../classesphp/classe_arvore.php");
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
		include_once($this->locaplic."/classesphp/xml.php");
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
	function verificaPapelSessao($id_papel=""){
		if(!empty($_COOKIE["i3geocodigologin"])){
			session_write_close();
			session_name("i3GeoLogin");
			session_id($_COOKIE["i3geocodigologin"]);
			session_start();
			if($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"]){
				return false;
			}
			foreach($_SESSION["papeis"] as $p){
				if($p == 1 || $p == $id_papel){
					//error_log("------------------true".json_encode($_SESSION["papeis"]));
					return true;
				}
			}
			return false;
		}
		else{//caso nao exista, retorna um erro
			return false;
		}
	}
	function seems_utf8($Str) { # by bmorel at ssi dot fr
		$length = strlen($Str);
		for ($i = 0; $i < $length; $i++) {
			if (ord($Str[$i]) < 0x80) continue; # 0bbbbbbb
			elseif ((ord($Str[$i]) & 0xE0) == 0xC0) $n = 1; # 110bbbbb
			elseif ((ord($Str[$i]) & 0xF0) == 0xE0) $n = 2; # 1110bbbb
			elseif ((ord($Str[$i]) & 0xF8) == 0xF0) $n = 3; # 11110bbb
			elseif ((ord($Str[$i]) & 0xFC) == 0xF8) $n = 4; # 111110bb
			elseif ((ord($Str[$i]) & 0xFE) == 0xFC) $n = 5; # 1111110b
			else return false; # Does not match any model
			for ($j = 0; $j < $n; $j++) { # n bytes matching 10bbbbbb follow ?
				if ((++$i == $length) || ((ord($Str[$i]) & 0xC0) != 0x80))
					return false;
			}
		}
		return true;
	}
	/**
	 *
	 * TODO Verificar ao fechar versao - verificar a acentuacao das palavras nessa funcao
	 */
	function removeAcentos($s)
	{
		$s = ereg_replace("[&aacute;�&acirc;&atilde;]","a",$s);
		$s = ereg_replace("[&Aacute;�&Acirc;&Atilde;]","A",$s);
		$s = ereg_replace("[&eacute;�&ecirc;]","e",$s);
		$s = ereg_replace("[&iacute;]","i",$s);
		$s = ereg_replace("[&Iacute;]","I",$s);
		$s = ereg_replace("[&Eacute;�&Ecirc;]","E",$s);
		$s = ereg_replace("[��&ocirc;&otilde;]","o",$s);
		$s = ereg_replace("[��&Ocirc;&Otilde;]","O",$s);
		$s = ereg_replace("[&uacute;��]","u",$s);
		$s = ereg_replace("[&Uacute;��]","U",$s);
		$s = str_replace("&ccedil;","c",$s);
		$s = str_replace("&Ccedil;","C",$s);
		//$str = htmlentities($s);
		$str = preg_replace("/(&)([a-z])([a-z]+;)/i", '$2', $s);
		$str = preg_replace("/[^A-Z0-9]/i", ' ', $str);
		$string = preg_replace("/\s+/i", ' ', $str);

		if (!preg_match('/[\x80-\xff]/', $string)){
			return $string;
		}
		if ($this->seems_utf8($string)) {
			$chars = array(
					// Decompositions for Latin-1 Supplement
					chr(195).chr(128) => 'A', chr(195).chr(129) => 'A',
					chr(195).chr(130) => 'A', chr(195).chr(131) => 'A',
					chr(195).chr(132) => 'A', chr(195).chr(133) => 'A',
					chr(195).chr(135) => 'C', chr(195).chr(136) => 'E',
					chr(195).chr(137) => 'E', chr(195).chr(138) => 'E',
					chr(195).chr(139) => 'E', chr(195).chr(140) => 'I',
					chr(195).chr(141) => 'I', chr(195).chr(142) => 'I',
					chr(195).chr(143) => 'I', chr(195).chr(145) => 'N',
					chr(195).chr(146) => 'O', chr(195).chr(147) => 'O',
					chr(195).chr(148) => 'O', chr(195).chr(149) => 'O',
					chr(195).chr(150) => 'O', chr(195).chr(153) => 'U',
					chr(195).chr(154) => 'U', chr(195).chr(155) => 'U',
					chr(195).chr(156) => 'U', chr(195).chr(157) => 'Y',
					chr(195).chr(159) => 's', chr(195).chr(160) => 'a',
					chr(195).chr(161) => 'a', chr(195).chr(162) => 'a',
					chr(195).chr(163) => 'a', chr(195).chr(164) => 'a',
					chr(195).chr(165) => 'a', chr(195).chr(167) => 'c',
					chr(195).chr(168) => 'e', chr(195).chr(169) => 'e',
					chr(195).chr(170) => 'e', chr(195).chr(171) => 'e',
					chr(195).chr(172) => 'i', chr(195).chr(173) => 'i',
					chr(195).chr(174) => 'i', chr(195).chr(175) => 'i',
					chr(195).chr(177) => 'n', chr(195).chr(178) => 'o',
					chr(195).chr(179) => 'o', chr(195).chr(180) => 'o',
					chr(195).chr(181) => 'o', chr(195).chr(182) => 'o',
					chr(195).chr(182) => 'o', chr(195).chr(185) => 'u',
					chr(195).chr(186) => 'u', chr(195).chr(187) => 'u',
					chr(195).chr(188) => 'u', chr(195).chr(189) => 'y',
					chr(195).chr(191) => 'y',
					// Decompositions for Latin Extended-A
					chr(196).chr(128) => 'A', chr(196).chr(129) => 'a',
					chr(196).chr(130) => 'A', chr(196).chr(131) => 'a',
					chr(196).chr(132) => 'A', chr(196).chr(133) => 'a',
					chr(196).chr(134) => 'C', chr(196).chr(135) => 'c',
					chr(196).chr(136) => 'C', chr(196).chr(137) => 'c',
					chr(196).chr(138) => 'C', chr(196).chr(139) => 'c',
					chr(196).chr(140) => 'C', chr(196).chr(141) => 'c',
					chr(196).chr(142) => 'D', chr(196).chr(143) => 'd',
					chr(196).chr(144) => 'D', chr(196).chr(145) => 'd',
					chr(196).chr(146) => 'E', chr(196).chr(147) => 'e',
					chr(196).chr(148) => 'E', chr(196).chr(149) => 'e',
					chr(196).chr(150) => 'E', chr(196).chr(151) => 'e',
					chr(196).chr(152) => 'E', chr(196).chr(153) => 'e',
					chr(196).chr(154) => 'E', chr(196).chr(155) => 'e',
					chr(196).chr(156) => 'G', chr(196).chr(157) => 'g',
					chr(196).chr(158) => 'G', chr(196).chr(159) => 'g',
					chr(196).chr(160) => 'G', chr(196).chr(161) => 'g',
					chr(196).chr(162) => 'G', chr(196).chr(163) => 'g',
					chr(196).chr(164) => 'H', chr(196).chr(165) => 'h',
					chr(196).chr(166) => 'H', chr(196).chr(167) => 'h',
					chr(196).chr(168) => 'I', chr(196).chr(169) => 'i',
					chr(196).chr(170) => 'I', chr(196).chr(171) => 'i',
					chr(196).chr(172) => 'I', chr(196).chr(173) => 'i',
					chr(196).chr(174) => 'I', chr(196).chr(175) => 'i',
					chr(196).chr(176) => 'I', chr(196).chr(177) => 'i',
					chr(196).chr(178) => 'IJ',chr(196).chr(179) => 'ij',
					chr(196).chr(180) => 'J', chr(196).chr(181) => 'j',
					chr(196).chr(182) => 'K', chr(196).chr(183) => 'k',
					chr(196).chr(184) => 'k', chr(196).chr(185) => 'L',
					chr(196).chr(186) => 'l', chr(196).chr(187) => 'L',
					chr(196).chr(188) => 'l', chr(196).chr(189) => 'L',
					chr(196).chr(190) => 'l', chr(196).chr(191) => 'L',
					chr(197).chr(128) => 'l', chr(197).chr(129) => 'L',
					chr(197).chr(130) => 'l', chr(197).chr(131) => 'N',
					chr(197).chr(132) => 'n', chr(197).chr(133) => 'N',
					chr(197).chr(134) => 'n', chr(197).chr(135) => 'N',
					chr(197).chr(136) => 'n', chr(197).chr(137) => 'N',
					chr(197).chr(138) => 'n', chr(197).chr(139) => 'N',
					chr(197).chr(140) => 'O', chr(197).chr(141) => 'o',
					chr(197).chr(142) => 'O', chr(197).chr(143) => 'o',
					chr(197).chr(144) => 'O', chr(197).chr(145) => 'o',
					chr(197).chr(146) => 'OE',chr(197).chr(147) => 'oe',
					chr(197).chr(148) => 'R',chr(197).chr(149) => 'r',
					chr(197).chr(150) => 'R',chr(197).chr(151) => 'r',
					chr(197).chr(152) => 'R',chr(197).chr(153) => 'r',
					chr(197).chr(154) => 'S',chr(197).chr(155) => 's',
					chr(197).chr(156) => 'S',chr(197).chr(157) => 's',
					chr(197).chr(158) => 'S',chr(197).chr(159) => 's',
					chr(197).chr(160) => 'S', chr(197).chr(161) => 's',
					chr(197).chr(162) => 'T', chr(197).chr(163) => 't',
					chr(197).chr(164) => 'T', chr(197).chr(165) => 't',
					chr(197).chr(166) => 'T', chr(197).chr(167) => 't',
					chr(197).chr(168) => 'U', chr(197).chr(169) => 'u',
					chr(197).chr(170) => 'U', chr(197).chr(171) => 'u',
					chr(197).chr(172) => 'U', chr(197).chr(173) => 'u',
					chr(197).chr(174) => 'U', chr(197).chr(175) => 'u',
					chr(197).chr(176) => 'U', chr(197).chr(177) => 'u',
					chr(197).chr(178) => 'U', chr(197).chr(179) => 'u',
					chr(197).chr(180) => 'W', chr(197).chr(181) => 'w',
					chr(197).chr(182) => 'Y', chr(197).chr(183) => 'y',
					chr(197).chr(184) => 'Y', chr(197).chr(185) => 'Z',
					chr(197).chr(186) => 'z', chr(197).chr(187) => 'Z',
					chr(197).chr(188) => 'z', chr(197).chr(189) => 'Z',
					chr(197).chr(190) => 'z', chr(197).chr(191) => 's',
					// Euro Sign
					chr(226).chr(130).chr(172) => 'E',
					// GBP (Pound) Sign
					chr(194).chr(163) => '');
			$string = strtr($string, $chars);
		} else {
			// Assume ISO-8859-1 if not UTF-8
			$chars['in'] = chr(128).chr(131).chr(138).chr(142).chr(154).chr(158)
			.chr(159).chr(162).chr(165).chr(181).chr(192).chr(193).chr(194)
			.chr(195).chr(196).chr(197).chr(199).chr(200).chr(201).chr(202)
			.chr(203).chr(204).chr(205).chr(206).chr(207).chr(209).chr(210)
			.chr(211).chr(212).chr(213).chr(214).chr(216).chr(217).chr(218)
			.chr(219).chr(220).chr(221).chr(224).chr(225).chr(226).chr(227)
			.chr(228).chr(229).chr(231).chr(232).chr(233).chr(234).chr(235)
			.chr(236).chr(237).chr(238).chr(239).chr(241).chr(242).chr(243)
			.chr(244).chr(245).chr(246).chr(248).chr(249).chr(250).chr(251)
			.chr(252).chr(253).chr(255);
			$chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";
			$string = strtr($string, $chars['in'], $chars['out']);
			$double_chars['in'] = array(chr(140), chr(156), chr(198), chr(208), chr(222), chr(223), chr(230), chr(240), chr(254));
			$double_chars['out'] = array('OE', 'oe', 'AE', 'DH', 'TH', 'ss', 'ae', 'dh', 'th');
			$string = str_replace($double_chars['in'], $double_chars['out'], $string);
		}
		return $string;
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
	function ixml($no,$nome)
	{
		$texto = $no->$nome;
		if (!mb_detect_encoding($texto,"UTF-8",true))
		{$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");}
		return mb_convert_encoding($texto,"HTML-ENTITIES","auto");
	}
}
?>
