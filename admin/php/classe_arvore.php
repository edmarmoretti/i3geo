<?php
/*
Title: classe_arvore.php

Fun&ccedil;&otilde;es para montagem da &aacute;rvore de temas

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

i3geo/admin/php/classe_arvore.php
*/
/*
Classe: Arvore

Classe utilizada para compor a &aacute;rvore de temas ou obter dados espec&iacute;ficos da &aacute;rvore.

&Eacute; utilizada por v&aacute;rias opera&ccedil;&otilde;es do i3Geo, principalmente pela <classe_menutemas>
*/
class Arvore
{
	//temas com acesso restrito e que nao podem ser acessados pelo usuario que esta logado
	public $temassindevidos;
	protected $locaplic;
	//subgrupos que tem pelo menos um tema
	//public $sql_subgrupos = "select i3geoadmin_subgrupos.nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado,i3geoadmin_n2.n2_perfil from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo ";
	//grupos que tem pelo menos um sub-grupo
	//public $sql_grupos = "select i3geoadmin_grupos.nome_grupo,id_n1,id_menu,i3geoadmin_n1.publicado,n1_perfil from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo ";
	//nomes de todos os grupos
	public $sql_todosgrupos = "select * from i3geoadmin_grupos ";
	//temas na raiz
	//public $sql_temasraiz = "select id_raiz,i3geoadmin_raiz.id_tema,nome_tema,tipoa_tema FROM i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema ";
	//todos os temas
	//public $sql_temas = "select * from i3geoadmin_temas ";
	//temas de um subgrupo
	//public $sql_temasSubgrupo = "select i3geoadmin_temas.tipoa_tema, i3geoadmin_temas.codigo_tema,i3geoadmin_temas.tags_tema,i3geoadmin_n3.id_n3,i3geoadmin_temas.nome_tema,i3geoadmin_n3.publicado,i3geoadmin_n3.n3_perfil,i3geoadmin_n3.id_tema,i3geoadmin_temas.download_tema,i3geoadmin_temas.ogc_tema from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema ";
	/*
	Function: __construct

	Cria um objeto Arvore

	Parametros:

	locaplic {string} - localiza&ccedil;&atilde;o do i3geo no sistema de arquivos

	idioma {string} - default = "pt"
	*/
	function __construct($locaplic,$idioma="pt")
	{
		$this->locaplic = $locaplic;
		$dbh = "";
		error_reporting(0);
		include($locaplic."/admin/php/conexao.php");
		$this->esquemaadmin = "";
		if(!empty($esquemaadmin)){
			$this->esquemaadmin = str_replace(".","",$esquemaadmin).".";
		}
		if(!isset($convUTF)){
			$convUTF = true;
		}
		$this->convUTF = $convUTF;
		$this->dbh = $dbh;

		$this->idioma = $idioma;
		if($idioma == "pt"){
			$coluna = "nome_grupo";
		}
		else{
			$coluna = $idioma;
		}
		$this->sql_grupos = "select i3geoadmin_grupos.$coluna as nome_grupo,id_n1,id_menu,i3geoadmin_n1.publicado,n1_perfil from ".$this->esquemaadmin."i3geoadmin_n1 LEFT JOIN ".$this->esquemaadmin."i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo ";

		if($idioma == "pt"){
			$coluna = "nome_subgrupo";
		}
		else{
			$coluna = $idioma;
		}
		$this->sql_subgrupos = "select i3geoadmin_subgrupos.$coluna as nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado,i3geoadmin_n2.n2_perfil from ".$this->esquemaadmin."i3geoadmin_n2 LEFT JOIN ".$this->esquemaadmin."i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo ";

		if($idioma == "pt"){
			$coluna = "nome_tema";
		}
		else{
			$coluna = $idioma;
		}
		$this->sql_temasraiz = "select codigo_tema,id_raiz,i3geoadmin_raiz.id_tema,$coluna as nome_tema,tipoa_tema,perfil FROM ".$this->esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$this->esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema ";
		$this->sql_temasSubgrupo = "select i3geoadmin_temas.tipoa_tema, i3geoadmin_temas.codigo_tema,i3geoadmin_temas.tags_tema,i3geoadmin_n3.id_n3,i3geoadmin_temas.$coluna as nome_tema,i3geoadmin_n3.publicado,i3geoadmin_n3.n3_perfil,i3geoadmin_n3.id_tema,i3geoadmin_temas.download_tema,i3geoadmin_temas.ogc_tema from ".$this->esquemaadmin."i3geoadmin_n3 LEFT JOIN ".$this->esquemaadmin."i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema ";

		//$this->sql_temas = "select kmz_tema,nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,$coluna as nome_tema,codigo_tema from i3geoadmin_temas ";

		$this->sql_temas = "select kmz_tema,b.soma as nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,$coluna as nome_tema,codigo_tema  from i3geoadmin_temas as a,(SELECT c.codigo_tema codigo_soma,sum( r.nacessos) as soma FROM ".$this->esquemaadmin."i3geoadmin_temas c LEFT JOIN ".$this->esquemaadmin."i3geoadmin_acessostema r ON (c.codigo_tema = r.codigo_tema) group by  c.codigo_tema) as b WHERE a.codigo_tema = b.codigo_soma	";
		//
		//verifica se o ip atual est&aacute; cadastrado como um dos editores
		//editores podem ver as coisas marcadas como n&atilde;o publicado
		//no sistema de administra&ccedil;&atilde;o
		//
		$this->editor = false;
		$this->editor = $this->verificaOperacaoSessao("admin/php/classe_arvore/editor");
		$this->pubsql = " (publicado != 'NAO' or publicado is null) and ";
		if($this->editor){
			$this->pubsql = "";
		}
		if(!function_exists("listaTemasIndevidos")){
			include_once(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
		}
		$this->temasindevidos = listaTemasIndevidos();
	}
	function __destruct()
	{
		$this->dbh = null;
		$this->dbhw = null;
	}
	/*
	Function: validaTemas

	Remove de um array os temas que nao sao permitidos ao usuario atualmente logado
	 */
	function validaTemas($linhas,$id){
		$res = array();
		foreach($linhas as $l){
			if(!in_array($l[$id],$this->temasindevidos)){
				array_push($res,$l);
			}
		}
		return $res;
	}
	/*
	Function: pegaListaDeMenus

	Retorna a lista de menus

	Parametros:

	perfil {string} - considera apenas esse perfil

	Return:

	{array}
	*/
	function pegaListaDeMenus($perfil)
	{
		if($this->idioma == "pt"){
			$coluna = "nome_menu";
		}
		else{
			$coluna = $this->idioma;
		}
		if($this->editor == true)
		{
			$perfil = "";
			$sql = "SELECT publicado_menu,'' as perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from ".$this->esquemaadmin."i3geoadmin_menus order by nome_menu";
		}
		else{
			$sql = "SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from ".$this->esquemaadmin."i3geoadmin_menus where publicado_menu != 'NAO' or publicado_menu is null order by nome_menu";
		}
		$regs = $this->execSQL($sql);
		$resultado = array();
		foreach($regs as $reg)
		{
			$a = $reg["perfil_menu"];
			$a = str_replace(" ",",",$a);
			if ($this->verificaOcorrencia($perfil,explode(",",$a)))
			{
				$status = "fechado";
				if(strtolower($reg["aberto"]) == "sim")
					$status = "aberto";
				$url = "";
				$resultado[] = array("desc"=>$this->converte($reg["desc_menu"]),"publicado"=>$reg["publicado_menu"],"nomemenu"=>$this->converte($reg["nome_menu"]),"idmenu"=>$reg["id_menu"],"arquivo"=>"","status"=>$status,"url"=>$url);
			}
		}
		return $resultado;
	}
	/*
	Function: procuraTemas

	Localiza temas conforme uma palavra de busca

	Parametros:

	procurar {string} - palavra de busca

	perfil {string} - considera apenas esse perfil

	Return:

	{array}
	*/
	function procuraTemas ($procurar,$perfil)
	{
		if($procurar != "")
		{
			$procurar = $this->removeAcentos($procurar);
		}
		$menus = $this->pegaListaDeMenus($perfil);
		$resultado = array();
		$subgrupo = array();
		$final = array();
		foreach($menus as $menu)
		{
			$grupos = $this->pegaGruposMenu($menu["idmenu"]);
			foreach($grupos["grupos"] as $grupo)
			{
				$a = $grupo["n1_perfil"];
				$a = str_replace(" ",",",$a);
				if($this->verificaOcorrencia($perfil,explode(",",$a)))
				{
					$sgrupos = $this->pegaSubgruposGrupo($menu["idmenu"],$grupo["id_n1"]);
					$temasRaizGrupo = array();
					$temasR = $this->pegaTemasRaizGrupo($menu["idmenu"],$grupo["id_n1"]);
					foreach($temasR as $tema)
					{
						$a = $tema["perfil"];
						$a = str_replace(" ",",",$a);
						if($this->verificaOcorrencia($perfil,explode(",",$a)))
						{
							$t = $this->pegaTema($tema["id_tema"]);
							$t = $t[0];
							$nome = $this->removeAcentos($tema["nome_tema"]);
							$tags = $this->removeAcentos($tema["tags_tema"]);
							$tags1 = $this->removeAcentos(mb_convert_encoding($tema["tags_tema"],"ISO-8859-1","UTF-8"));
							$nome1 = $this->removeAcentos(mb_convert_encoding($tema["nome_tema"],"ISO-8859-1","UTF-8"));
							$miniatura = "nao";
							if(file_exists($this->locaplic."/temas/miniaturas/".$t["codigo_tema"].".map.mini.png"))
							{
								$miniatura = "sim";
							}
							$down = "sim";
							if (strtolower($t["download_tema"]) == "nao")
							{
								$down = "nao";
							}
							$texto = array("miniatura"=>$miniatura,"tid"=>$t["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
							if($procurar == "")
							{
								$temasRaizGrupo[] = $texto;
							}
							else
							{
								if (stristr($nome,$procurar) || stristr($nome1,$procurar))
								{
									$temasRaizGrupo[] = $texto;
								}
								else
								{
									if (stristr($tags,$procurar) || stristr($tags1,$procurar))
									{
										$temasRaizGrupo[] = $texto;
									}
								}
							}
						}
					}
					foreach($sgrupos["subgrupos"] as $sgrupo)
					{
						$a = $sgrupo["n2_perfil"];
						$a = str_replace(" ",",",$a);
						if($this->verificaOcorrencia($perfil,explode(",",$a)))
						{
							$temas = $this->pegaTemasSubGrupo($sgrupo["id_n2"]);
							foreach ($temas as $tema)
							{
								$a = $tema["n3_perfil"];
								$a = str_replace(" ",",",$a);
								if($this->verificaOcorrencia($perfil,explode(",",$a)))
								{
									$t = $this->pegaTema($tema["id_tema"]);
									$t = $t[0];
									$nome = $this->removeAcentos($tema["nome_tema"]);
									$tags = $this->removeAcentos($tema["tags_tema"]);
									$tags1 = $this->removeAcentos(mb_convert_encoding($tema["tags_tema"],"ISO-8859-1","UTF-8"));
									$nome1 = $this->removeAcentos(mb_convert_encoding($tema["nome_tema"],"ISO-8859-1","UTF-8"));
									$miniatura = "nao";
									if(file_exists($this->locaplic."/temas/miniaturas/".$tema["codigo_tema"].".map.mini.png"))
									{
										$miniatura = "sim";
									}
									$down = "sim";
									if (strtolower($t["download_tema"]) == "nao")
									{
										$down = "nao";
									}
									$texto = array("miniatura"=>$miniatura,"tid"=>$tema["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
									if($procurar == "")
									{
										$resultado[] = $texto;
									}
									else
									{
										if (stristr($nome,$procurar) || stristr($nome1,$procurar))
										{
											$resultado[] = $texto;
										}
										else
										{
											if (stristr($tags,$procurar) || stristr($tags1,$procurar))
											{
												$resultado[] = $texto;
											}
										}
									}
								}
							}
						}
						if (count($resultado) > 0)
						{
							$subgrupo[] = array("subgrupo"=>$this->converte($sgrupo["nome_subgrupo"]),"temas"=>$resultado);
						}
						$resultado = array();
					}
				}
				if (count($subgrupo) > 0 || count($temasRaizGrupo) > 0)
				{
					$final[] = array("grupo"=>$this->converte($grupo["nome_grupo"]),"temas"=>$temasRaizGrupo,"subgrupos"=>$subgrupo);
				}
				$subgrupo = array();
			}
		}
		return $final;
	}
	/*
	Function: procuraTemasEstrela

	Localiza temas que t&ecirc;m um determinado n&uacute;mero (n&iacute;vel) de estrelas

	Parametros:

	nivel {numeric} - n&uacute;mero de estrelas

	perfil {string} - considera apenas esse perfil

	Return:

	{array}
	*/
	function procuraTemasEstrela($nivel,$fatorestrela,$perfil)
	{
		$menus = $this->pegaListaDeMenus($perfil);
		$resultado = array();
		$subgrupo = array();
		$final = array();
		foreach($menus as $menu)
		{
			$grupos = $this->pegaGruposMenu($menu["idmenu"]);
			foreach($grupos["grupos"] as $grupo)
			{
				$a = $grupo["n1_perfil"];
				$a = str_replace(" ",",",$a);
				if($this->verificaOcorrencia($perfil,explode(",",$a)))
				{
					$sgrupos = $this->pegaSubgruposGrupo($menu["idmenu"],$grupo["id_n1"]);
					$temasRaizGrupo = array();
					$temasR = $this->pegaTemasRaizGrupo($menu["idmenu"],$grupo["id_n1"]);
					foreach($temasR as $tema)
					{
						$a = $tema["perfil"];
						$a = str_replace(" ",",",$a);
						if($this->verificaOcorrencia($perfil,explode(",",$a)))
						{
							$t = $this->pegaTema($tema["id_tema"]);
							$t = $t[0];
							$nome = $this->removeAcentos($tema["nome_tema"]);
							$tags = $this->removeAcentos($tema["tags_tema"]);
							$tags1 = $this->removeAcentos(mb_convert_encoding($tema["tags_tema"],"ISO-8859-1","UTF-8"));
							$nome1 = $this->removeAcentos(mb_convert_encoding($tema["nome_tema"],"ISO-8859-1","UTF-8"));
							$miniatura = "nao";
							if(file_exists($this->locaplic."/temas/miniaturas/".$t["codigo_tema"].".map.mini.png"))
							{
								$miniatura = "sim";
							}
							$down = "sim";
							if (strtolower($t["download_tema"]) == "nao")
							{
								$down = "nao";
							}
							$texto = array("miniatura"=>$miniatura,"tid"=>$t["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
							$n = intval($t["nacessos"] / $fatorestrela);
							if($n >= 5){
								$n = 5;
							}

							if ($n == $nivel)
							{
								$temasRaizGrupo[] = $texto;
							}
						}
					}
					foreach($sgrupos["subgrupos"] as $sgrupo)
					{
						$a = $sgrupo["n2_perfil"];
						$a = str_replace(" ",",",$a);
						if($this->verificaOcorrencia($perfil,explode(",",$a)))
						{
							$temas = $this->pegaTemasSubGrupo($sgrupo["id_n2"]);
							foreach ($temas as $tema)
							{
								$a = $tema["n3_perfil"];
								$a = str_replace(" ",",",$a);
								if($this->verificaOcorrencia($perfil,explode(",",$a)))
								{
									$t = $this->pegaTema($tema["id_tema"]);
									$t = $t[0];
									$nome = $this->removeAcentos($tema["nome_tema"]);
									$tags = $this->removeAcentos($tema["tags_tema"]);
									$tags1 = $this->removeAcentos(mb_convert_encoding($tema["tags_tema"],"ISO-8859-1","UTF-8"));
									$nome1 = $this->removeAcentos(mb_convert_encoding($tema["nome_tema"],"ISO-8859-1","UTF-8"));
									$miniatura = "nao";
									if(file_exists($this->locaplic."/temas/miniaturas/".$tema["codigo_tema"].".map.mini.png"))
									{
										$miniatura = "sim";
									}
									$down = "sim";
									if (strtolower($t["download_tema"]) == "nao")
									{
										$down = "nao";
									}
									$texto = array("miniatura"=>$miniatura,"tid"=>$tema["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
									$n = abs($t["nacessos"] / $fatorestrela);
									if($n >= 5){
										$n = 5;
									}
									if ($n == $nivel)
									{
										$resultado[] = $texto;
									}
								}
							}
						}
						if (count($resultado) > 0)
						{
							$subgrupo[] = array("subgrupo"=>$this->converte($sgrupo["nome_subgrupo"]),"temas"=>$resultado);
						}
						$resultado = array();
					}
				}
				if (count($subgrupo) > 0 || count($temasRaizGrupo) > 0)
				{
					$final[] = array("grupo"=>$this->converte($grupo["nome_grupo"]),"temas"=>$temasRaizGrupo,"subgrupos"=>$subgrupo);
				}
				$subgrupo = array();
			}
		}
		return $final;
	}
	/*
	Function: pegaGruposMenu

	Retorna a lista de grupos de um menu

	Parametros:

	id_menu {string}

	Return:

	{array}
	*/
	function pegaGruposMenu($id_menu){
		$grupos = $this->execSQL($this->sql_grupos."where ".$this->pubsql." id_menu='$id_menu' order by ordem");
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 0 order by ordem");
		$raiz = $this->validaTemas($raiz,"codigo_tema");
		return array("raiz"=>$raiz,"grupos"=>$grupos);
	}
	/*
	Function: pegaSubgruposGrupo

	Retorna a lista de subgrupos de um grupo

	Parametros:

	id_menu {string}

	id_n1 {string} - id do grupo

	Return:

	{array}
	*/
	function pegaSubgruposGrupo($id_menu,$id_n1)
	{
		$subgrupos = $this->execSQL($this->sql_subgrupos."where ".$this->pubsql." i3geoadmin_n2.id_n1='$id_n1' order by ordem");
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
		$raiz = $this->validaTemas($raiz,"codigo_tema");
		return array("raiz"=>$raiz,"subgrupos"=>$subgrupos);
	}
	/*
	Function: pegaTemasRaizMenu

	Retorna a lista de temas da raiz de um menu

	Parametros:

	id_menu {string}

	Return:

	{array}
	*/
	function pegaTemasRaizMenu($id_menu)
	{
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 0 order by ordem");
		$raiz = $this->validaTemas($raiz,"codigo_tema");
		return $raiz;
	}
	/*
	Function: pegaTemasRaizGrupo

	Retorna a lista de temas da raiz de um grupo

	Parametros:

	id_menu {string}

	id_n1 {string} - id do grupo

	Return:

	{array}
	*/
	function pegaTemasRaizGrupo($id_menu,$id_n1)
	{
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
		$raiz = $this->validaTemas($raiz,"codigo_tema");
		return $raiz;
	}
	/*
	Function: pegaTema

	Retorna os dados de um tema

	Parametros:

	id_tema {string}

	Return:

	{array}
	*/
	function pegaTema($id_tema)
	{
		$q =  $this->execSQL($this->sql_temas." and id_tema = '$id_tema' ");
		if($q){
			return $q;
		}
		else{
			//caso de banco de dados antigo
			$sql = "select kmz_tema,'0' as nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema  from ".$this->esquemaadmin."i3geoadmin_temas	";
			$q = $this->execSQL($sql." where id_tema = '$id_tema' ");
			return $q;
		}
	}
	/*
	Function: pegaTemaPorCodigo

	Retorna os dados de um tema buscando por codigo

	Parametros:

	codigo_tema {string}

	Return:

	{array}
	*/
	function pegaTemaPorCodigo($codigo_tema)
	{
		$q =  $this->execSQL($this->sql_temas." and codigo_tema = '$codigo_tema' ");
		if($q){
			return $q;
		}
		else{
			//caso de banco de dados antigo
			$sql = "select kmz_tema,'0' as nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema  from ".$this->esquemaadmin."i3geoadmin_temas	";
			$q = $this->execSQL($sql." where codigo_tema = '$codigo_tema' ");
			return $q;
		}
	}
	/*
	Function: pegaTemasSubGrupo

	Retorna os temas de um subgrupo

	Parametros:

	id_n2 {string} - id do subgrupo

	Return:

	{array}
	*/
	function pegaTemasSubGrupo($id_n2)
	{
		$temas = $this->execSQL($this->sql_temasSubgrupo."where ".$this->pubsql." i3geoadmin_n3.id_n2='$id_n2' order by ordem");
		$temas = $this->validaTemas($temas,"codigo_tema");
		return $temas;
	}
	/*
	Function: formataMenus

	Retorna os menus e temas na raiz de um menu, formatados no padr&atilde;o da &aacute;rvore

	Return:

	{array}
	*/
	function formataMenus(){
	}
	/*
	Function: formataGruposMenu

	Retorna os grupos e temas na raiz de um menu, formatados no padr&atilde;o da &aacute;rvore

	Parametros:

	id_menu {string}

	perfil {string}

	listasgrupos {string} - sim|nao

	Return:

	{array}
	*/
	function formataGruposMenu ($id_menu,$perfil,$listasgrupos)
	{
		//error_reporting(0);
		$dados = $this->pegaGruposMenu($id_menu);
		$resultado = array();
		$temasraiz = array();
		foreach($dados["raiz"] as $temar){
			$temasraiz[] = $this->formataTema($temar["id_tema"]);
		}
		if(count($dados["grupos"]) == 0){
			$grupos[] = array();
		}
		foreach($dados["grupos"] as $grupo)
		{
			$a = $grupo["n1_perfil"];
			$a = str_replace(" ",",",$a);
			if($this->verificaOcorrencia($perfil,explode(",",$a)) == true)
			{
				$temas = array();
				$raizgrupo = $this->pegaTemasRaizGrupo($id_menu,$grupo["id_n1"]);
				$grupodown = "nao";
				$grupoogc = "nao";
				foreach($raizgrupo as $tema)
				{
					$temas[] = $this->formataTema($tema["id_tema"]);
				}
				if($temas > 0)
				{
					$grupodown = "sim";
					$grupoogc = "sim";
				}
				$subgrupos = array();
				if($listasgrupos=="sim")
				{
					$dadossubgrupos = $this->pegaSubgruposGrupo($id_menu,$grupo["id_n1"]);

					foreach($dadossubgrupos["subgrupos"] as $sgrupo)
					{
						$a = $sgrupo["n2_perfil"];
						$a = str_replace(" ",",",$a);
						if($this->verificaOcorrencia($perfil,explode(",",$a)))
						{
							//verifica se existem temas que podem receber download
							$down = "nao";
							$ogc = "nao";
							$listaT = $this->pegaTemasSubGrupo($sgrupo["id_n2"]);
							foreach($listaT as $tema)
							{
								if(strtolower($tema["tipoa_tema"]) != "wms")
								{
									if (strtolower($tema["download_tema"]) != "nao")
									{
										$down = "sim";$grupodown = "sim";
									}

									if (strtolower($tema["ogc_tema"]) != "nao")
									{
										$ogc = "sim";$grupoogc = "sim";
									}
								}
							}
							if(count($listaT) > 0)
								$subgrupos[] = array("id_n2"=>$sgrupo["id_n2"],"publicado"=>($sgrupo["publicado"]),"nome"=>$this->converte($sgrupo["nome_subgrupo"]),"download"=>$down,"ogc"=>$ogc);
						}
					}
				}
				$grupos[] = array("publicado"=>($grupo["publicado"]),"id_n1"=>($grupo["id_n1"]),"nome"=>$this->converte($grupo["nome_grupo"]),"ogc"=>$grupoogc,"download"=>$grupodown,"subgrupos"=>$subgrupos,"temasgrupo"=>$temas);
			}
		}
		$grupos[] = array("temasraiz"=>$temasraiz);
		//pega os sistemas checando os perfis
		$sistemas = array();
		$grupos[] = array("idmenu"=>$id_menu);
		$grupos[] = array("sistemas"=>"");
		return($grupos);
	}
	/*
	Function: formataSubgruposGrupo

	Retorna os subgrupos e temas na raiz de um grupo, formatados no padr&atilde;o da &aacute;rvore

	Parametros:

	id_menu {string}

	id_n1 {string} - id do grupo

	perfil {string}

	Return:

	{array}
	*/
	function formataSubgruposGrupo ($id_menu,$id_n1,$perfil)
	{
		$dados = $this->pegaSubgruposGrupo($id_menu,$id_n1);
		$resultado = array();
		$temasraiz = array();
		foreach($dados["raiz"] as $temar)
		{
			$temasraiz[] = $this->formataTema($temar["id_tema"]);
		}
		if(count($dados["subgrupos"]) == 0)
		{
			$sgrupos[] = array();
		}
		$subgrupos = array();
		foreach($dados["subgrupos"] as $sgrupo)
		{
			$a = $sgrupo["n2_perfil"];
			$a = str_replace(" ",",",$a);
			if ($this->verificaOcorrencia($perfil,explode(",",$a)))
			{
				$listaT = $this->pegaTemasSubGrupo($sgrupo["id_n2"]);
				$down = "nao";
				$ogc = "nao";
				foreach($listaT as $tema)
				{
					if(strtolower($tema["tipoa_tema"]) != "wms")
					{
						if (strtolower($tema["download_tema"]) != "nao")
						{
							$down = "sim";
						}
						if (strtolower($tema["ogc_tema"]) != "nao")
						{
							$ogc = "sim";
						}
					}
				}
				if(count($listaT) > 0)
				{
					$subgrupos[] = array("publicado"=>($sgrupo["publicado"]),"id_n2"=>($sgrupo["id_n2"]),"nome"=>$this->converte($sgrupo["nome_subgrupo"]),"download"=>$down,"ogc"=>$ogc,"temas"=>$listaT);
				}
			}
		}
		return (array("subgrupo"=>$subgrupos,"temasgrupo"=>$temasraiz));
	}
	/*
	Function: formataTemasSubgrupo

	Retorna os temas de um subgrupo, formatados no padr&atilde;o da &aacute;rvore

	Parametros:

	id_n2 {string} - id do subgrupo

	perfil {string}

	Return:

	{array}
	*/
	function formataTemasSubgrupo($id_n2,$perfil)
	{
		$dados = $this->pegaTemasSubGrupo($id_n2);
		$temas = array();
		foreach($dados as $tema)
		{
			$a = $tema["n3_perfil"];
			$a = str_replace(" ",",",$a);
			if($this->verificaOcorrencia($perfil,explode(",",$a)))
			{
				$temas[] = $this->formataTema($tema["id_tema"],$tema["publicado"]);
			}
		}
		return $temas;
	}
	/*
	Function: formataTema

	Retorna os dados de um tema, formatados no padr&atilde;o da &aacute;rvore

	Parametros:

	id_tema {string}

	publicado {string} - SIM|NAO valor do &iacute;ndice "publicado" que ser&aacute; inclu&iacute;do no array de retorno

	Return:

	{array}
	*/
	function formataTema($id_tema,$publicado="SIM")
	{
		$recordset = $this->pegaTema($id_tema);
		$recordset = $recordset[0];
		$down = "sim";
		$ogc = "sim";
		$link = " ";
		$kmz = "nao";
		if (strtolower($recordset["download_tema"]) == "nao")
		{
			$down = "nao";
		}
		if (strtolower($recordset["ogc_tema"]) == "nao")
		{
			$ogc = "nao";
		}
		if(strtolower($recordset["tipoa_tema"]) == "wms")
		{
			$down = "nao";
			$ogc = "nao";
		}
		if ($recordset["link_tema"] != "")
		{
			$link = $recordset["link_tema"];
		}
		if (strtolower($recordset["kmz_tema"]) == "sim")
		{
			$kmz = "sim";
		}
		return array("tipoa_tema"=>$recordset["tipoa_tema"],"publicado"=>$publicado,"nacessos"=>($recordset["nacessos"]),"tid"=>($recordset["codigo_tema"]),"nome"=>$this->converte($recordset["nome_tema"]),"link"=>$link,"download"=>$down,"ogc"=>$ogc,"kmz"=>$kmz);
	}
	/*
	Function: execSQL

	Executa um SQL no banco de administra&ccedil;&atilde;o

	Parametros:

	sql {string}

	Return:

	{array}
	*/
	function execSQL($sql)
	{
		//echo "<br>".$sql;
		//error_reporting(0);
		$q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
		if($q)
		{
			return $q->fetchAll();
		}
		else
		{return false;
		}
	}
	/*
	Verifica se uma string ocorre em um array
	*/
	function verificaOcorrencia($procurar,$em)
	{
		if(count($em) == 1 && $em[0] == "")
		{
			$em = "";
		}
		if($procurar == "" && $em == "")
		{
			return true;
		}
		if($em == "")
		{
			return true;
		}
		$resultado = false;
		if($procurar != "" && $em != "")
		{
			foreach($em as $e)
			{
				$e = trim($e);
				foreach($procurar as $p)
				{
					$p = trim($p);
					if($p == $e)
					{
						$resultado = true;
					}
				}
			}
		}
		return $resultado;
	}
	/**
	 *
	 * TODO V5 verificar a acentuacao das palavras nessa funcao
	 */
	function removeAcentos($s)
	{
		$s = ereg_replace("[����]","a",$s);
		$s = ereg_replace("[����]","A",$s);
		$s = ereg_replace("[���]","e",$s);
		$s = ereg_replace("[�]","i",$s);
		$s = ereg_replace("[�]","I",$s);
		$s = ereg_replace("[���]","E",$s);
		$s = ereg_replace("[����]","o",$s);
		$s = ereg_replace("[����]","O",$s);
		$s = ereg_replace("[���]","u",$s);
		$s = ereg_replace("[���]","U",$s);
		$s = str_replace("�","c",$s);
		$s = str_replace("�","C",$s);
		//$str = htmlentities($s);
		$str = preg_replace("/(&)([a-z])([a-z]+;)/i", '$2', $s);
		$str = preg_replace("/[^A-Z0-9]/i", ' ', $str);
		$str = preg_replace("/\s+/i", ' ', $str);
		return $str;
	}
	function converte($texto){
		if($this->convUTF == true)
			$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"UTF-8");
		else
			$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"ISO-8859-1");
		return $texto;
	}
	function verificaPapelSessao($id_papel){
		if(!empty($_COOKIE["i3geocodigologin"])){
			session_write_close();
			session_name("i3GeoLogin");
			session_id($_COOKIE["i3geocodigologin"]);
			session_start();
			//var_dump($_SESSION);exit;
			if($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"]){
				return false;
			}
			foreach($_SESSION["papeis"] as $p){
				if($p == 1 || $p == $id_papel){
					return true;
				}
			}
		}
		else{//caso nao exista, retorna um erro
			return false;
		}
	}
	function verificaOperacaoSessao($operacao){
		session_write_close();
		session_name("i3GeoLogin");
		session_id($_COOKIE["i3geocodigologin"]);
		session_start();
		$resultado = false;
		//verifica se e administrador
		foreach($_SESSION["papeis"] as $p){
			if($p["id_papel"] == 1){
				return true;
			}
		}
		if(!empty($_SESSION["operacoes"][$operacao])){
			$resultado = true;
		}
		return $resultado;
	}
}
?>