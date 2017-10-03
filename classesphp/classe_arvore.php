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
Voc&ecirc; deve ter recebido uma cï¿½pia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

classe_arvore.php
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
	//tipo de filtro
	//ogc|download|""
	public $filtro;
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
	function __construct($locaplic,$idioma="pt",$filtro="")
	{
		$this->locaplic = $locaplic;
		$this->filtro = $filtro;
		$dbh = "";
		//error_reporting(0);

		include($locaplic."/classesphp/conexao.php");

		$this->esquemaadmin = $esquemaadmin;
		$this->convUTF = $convUTF;
		$this->dbh = $dbh;

		$this->idioma = $idioma;
		if($idioma == "pt"){
			$coluna = "nome_grupo";
		}
		else{
			$coluna = $idioma;
		}
		$this->sql_grupos = "select CASE i3geoadmin_grupos.$coluna WHEN '' THEN nome_grupo ELSE i3geoadmin_grupos.$coluna END as nome_grupo,i3geoadmin_grupos.id_grupo, id_n1,id_menu,i3geoadmin_n1.publicado,n1_perfil,ordem from ".$this->esquemaadmin."i3geoadmin_n1 LEFT JOIN ".$this->esquemaadmin."i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo ";
		if($filtro === "ogc" || $filtro === "download"){
			//esse sql retorna tambem os grupos dos temas que estao na raiz do grupo
			$this->sql_grupos = "select DISTINCT * from (select CASE grupos.$coluna WHEN '' THEN nome_grupo ELSE grupos.$coluna END as nome_grupo,gr.id_n1,gr.id_menu,gr.publicado,gr.n1_perfil, 0 as ordem from ".$this->esquemaadmin."i3geoadmin_grupos as grupos, ".$this->esquemaadmin."i3geoadmin_n1 as gr, ".$this->esquemaadmin."i3geoadmin_n2 as sg, ".$this->esquemaadmin."i3geoadmin_n3 as t, ".$this->esquemaadmin."i3geoadmin_temas as temas where gr.id_grupo = grupos.id_grupo AND sg.id_n1 = gr.id_n1 AND t.id_n2 = sg.id_n2 AND t.id_tema = temas.id_tema AND (temas.ogc_tema NOT IN ('NAO','nao') OR temas.download_tema NOT IN ('NAO','nao') ) UNION select c.nome_grupo as nome_grupo,a.id_nivel as id_n1,a.id_menu,'SIM' as publicado,a.perfil as n1_perfil, 0 as ordem from ".$this->esquemaadmin."i3geoadmin_raiz as a, ".$this->esquemaadmin."i3geoadmin_temas as b, ".$this->esquemaadmin."i3geoadmin_grupos as c, ".$this->esquemaadmin."i3geoadmin_n1 as d where nivel = 1 AND a.id_tema = b.id_tema AND a.id_nivel = d.id_n1 AND d.id_grupo = c.id_grupo) as s ";
		}

		if($idioma == "pt"){
			$coluna = "nome_subgrupo";
		}
		else{
			$coluna = $idioma;
		}
		$this->sql_subgrupos = "select CASE i3geoadmin_subgrupos.$coluna WHEN '' THEN nome_subgrupo ELSE i3geoadmin_subgrupos.$coluna END as nome_subgrupo,i3geoadmin_subgrupos.id_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado,i3geoadmin_n2.n2_perfil from ".$this->esquemaadmin."i3geoadmin_n2 LEFT JOIN ".$this->esquemaadmin."i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo ";

		if($idioma == "pt"){
			$coluna = "nome_tema";
		}
		else{
			$coluna = $idioma;
		}

		$this->sql_temasraiz = "select id_nivel,ordem,codigo_tema,id_raiz,i3geoadmin_raiz.id_tema,CASE $coluna WHEN '' THEN nome_tema ELSE $coluna END as nome_tema,tipoa_tema,perfil, ogc_tema, download_tema, link_tema FROM ".$this->esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$this->esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema ";
		$this->sql_temasSubgrupo = "select i3geoadmin_temas.tipoa_tema, i3geoadmin_temas.codigo_tema,i3geoadmin_temas.tags_tema,i3geoadmin_n3.id_n3,CASE i3geoadmin_temas.$coluna WHEN '' THEN nome_tema ELSE i3geoadmin_temas.$coluna END as nome_tema,i3geoadmin_n3.publicado,i3geoadmin_n3.n3_perfil,i3geoadmin_n3.id_tema,i3geoadmin_temas.download_tema,i3geoadmin_temas.ogc_tema from ".$this->esquemaadmin."i3geoadmin_n3 LEFT JOIN ".$this->esquemaadmin."i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema ";

		//$this->sql_temas = "select kmz_tema,nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,$coluna as nome_tema,codigo_tema from i3geoadmin_temas ";

		$this->sql_temas = "select kmz_tema,b.soma as nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,CASE $coluna WHEN '' THEN nome_tema ELSE $coluna END as nome_tema,codigo_tema  from ".$this->esquemaadmin."i3geoadmin_temas as a,(SELECT c.codigo_tema codigo_soma,sum( r.nacessos) as soma FROM ".$this->esquemaadmin."i3geoadmin_temas c LEFT JOIN ".$this->esquemaadmin."i3geoadmin_acessostema r ON (c.codigo_tema = r.codigo_tema) group by  c.codigo_tema) as b WHERE a.codigo_tema = b.codigo_soma	";
		$this->sql_temas_combo = "select id_tema,CASE $coluna WHEN '' THEN nome_tema ELSE $coluna END as nome_tema,codigo_tema  from ".$this->esquemaadmin."i3geoadmin_temas as a,(SELECT c.codigo_tema codigo_soma,sum( r.nacessos) as soma FROM ".$this->esquemaadmin."i3geoadmin_temas c LEFT JOIN ".$this->esquemaadmin."i3geoadmin_acessostema r ON (c.codigo_tema = r.codigo_tema) group by  c.codigo_tema) as b WHERE a.codigo_tema = b.codigo_soma	";
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
		    include_once($locaplic."/classesphp/funcoes_gerais.php");
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
	function pegaListaDeMenus($perfil="",$filtraOgc="nao",$filtraDown="nao")
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
			$sql = "SELECT publicado_menu,'' as perfil_menu,aberto,desc_menu,id_menu,CASE $coluna WHEN '' THEN nome_menu ELSE $coluna END as nome_menu from ".$this->esquemaadmin."i3geoadmin_menus order by nome_menu";
		}
		else{
			$sql = "SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,CASE $coluna WHEN '' THEN nome_menu ELSE $coluna END as nome_menu from ".$this->esquemaadmin."i3geoadmin_menus where publicado_menu != 'NAO' or publicado_menu is null order by nome_menu";
		}
		$regs = $this->execSQL($sql);
		$resultado = array();
		foreach($regs as $reg){
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
	 Function: pegaListaDeTiposGrupos

	 Retorna a lista de grupos de um menu

	 Parametros:

	 id_menu {string}

	 Return:

	 {array}
	 */
	function pegaListaDeTiposGrupos(){
		if($this->idioma == "pt"){
			$coluna = "nome_grupo";
		}
		else{
			$coluna = $this->idioma;
		}
		$sql = "select CASE i3geoadmin_grupos.$coluna WHEN '' THEN nome_grupo ELSE i3geoadmin_grupos.$coluna END as nome_grupo, id_grupo from ".$this->esquemaadmin."i3geoadmin_grupos ORDER by nome_grupo ";
		$grupos = $this->execSQL($sql);
		return $grupos;
	}
	/*
	 Function: pegaListaDeTiposSubGrupos

	 Retorna a lista de grupos de um menu

	 Parametros:

	 id_menu {string}

	 Return:

	 {array}
	 */
	function pegaListaDeTiposSubGrupos(){
		if($this->idioma == "pt"){
			$coluna = "nome_subgrupo";
		}
		else{
			$coluna = $this->idioma;
		}
		$sql = "select CASE i3geoadmin_subgrupos.$coluna WHEN '' THEN nome_subgrupo ELSE i3geoadmin_subgrupos.$coluna END as nome_subgrupo, id_subgrupo from ".$this->esquemaadmin."i3geoadmin_subgrupos ORDER by nome_subgrupo ";
		$subgrupos = $this->execSQL($sql);
		return $subgrupos;
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
							$texto = array("codigo_tema"=>$t["codigo_tema"],"miniatura"=>$miniatura,"tid"=>$t["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
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
									$texto = array("codigo_tema"=>$tema["codigo_tema"],"miniatura"=>$miniatura,"tid"=>$tema["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
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
							$texto = array("codigo_tema"=>$t["codigo_tema"],"miniatura"=>$miniatura,"tid"=>$t["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
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
									$texto = array("codigo_tema"=>$tema["codigo_tema"],"miniatura"=>$miniatura,"tid"=>$tema["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
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
	function pegaGruposMenu($id_menu,$ordenaNome="nao"){
		if($ordenaNome == "sim"){
			$ordem = "nome_grupo";
		}
		else{
			$ordem = "ordem";
		}
		$sqlgrupos = $this->sql_grupos."where ".$this->pubsql." id_menu='$id_menu' order by $ordem";
		$sqlraiz = $this->sql_temasraiz."where i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 0 order by ordem";
		$grupos = $this->execSQL($sqlgrupos);
		$raiz = $this->execSQL($sqlraiz);
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
	function pegaSubgruposGrupo($id_menu,$id_n1,$ordenaNome="nao",$filtraOgc="nao",$filtraDown="nao")
	{
		if($ordenaNome == "sim"){
			$ordem = "nome_subgrupo";
		}
		else{
			$ordem = "ordem";
		}
		$f = "";
		if($filtraOgc == "sim" || $filtraDown == "sim"){
			$ff = array();
			if($filtraOgc == "sim"){
				$ff[] = " i3geoadmin_temas.ogc_tema = 'SIM' ";
			}
			if($filtraDown == "sim"){
				$ff[] = " i3geoadmin_temas.download_tema = 'SIM' ";
			}
			$f = implode(" AND ",$ff) . " AND ";
		}
		$subgrupos = $this->execSQL($this->sql_subgrupos."where ".$this->pubsql." i3geoadmin_n2.id_n1='$id_n1' order by $ordem");
		$raiz = $this->execSQL($this->sql_temasraiz."where $f i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
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
	function pegaTemasRaizGrupo($id_menu,$id_n1,$filtraOgc="nao",$filtraDown="nao")
	{
		$f = "";
		if($filtraOgc == "sim" || $filtraDown == "sim"){
			$ff = array();
			if($filtraOgc == "sim"){
				$ff[] = " i3geoadmin_temas.ogc_tema = 'SIM' ";
			}
			if($filtraDown == "sim"){
				$ff[] = " i3geoadmin_temas.download_tema = 'SIM' ";
			}
			$f = implode(" AND ",$ff) . " AND ";
		}
		if($id_n1 == ""){
			$raiz = $this->execSQL($this->sql_temasraiz."where $f i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel > 0 order by ordem");
		}
		else {
			$raiz = $this->execSQL($this->sql_temasraiz."where $f i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
		}
		$raiz = $this->validaTemas($raiz,"codigo_tema");
		return $raiz;
	}
	/*
	 Function: pegaTodosTemas

	 Retorna os dados de todos os temas

	 Return:

	 {array}
	 */
	function pegaTodosTemas($combo=false)
	{
		if($combo == true){
			$q =  $this->execSQL($this->sql_temas_combo." ORDER BY nome_tema ASC");
		}
		else{
			$q =  $this->execSQL($this->sql_temas." ORDER BY nome_tema ASC");
		}
		if($q){
			$q = $this->validaTemas($q,"codigo_tema");
			return $q;
		}
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
	function pegaTemasSubGrupo($id_n2,$filtraOgc="nao",$filtraDown="nao")
	{
		$f = "";
		if($filtraOgc == "sim" || $filtraDown == "sim"){
			$ff = array();
			if($filtraOgc == "sim"){
				$ff[] = " i3geoadmin_temas.ogc_tema = 'SIM' ";
			}
			if($filtraDown == "sim"){
				$ff[] = " i3geoadmin_temas.download_tema = 'SIM' ";
			}
			$f = implode(" AND ",$ff) . " AND ";
		}
		$temas = $this->execSQL($this->sql_temasSubgrupo."where $f ".$this->pubsql." i3geoadmin_n3.id_n2='$id_n2' order by ordem");
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
	function formataGruposMenu ($id_menu,$perfil,$listasgrupos,$ordenaNome="nao",$filtraOgc="nao",$filtraDown="nao")
	{
		//error_reporting(0);
		$dados = $this->pegaGruposMenu($id_menu,$ordenaNome);
		$resultado = array();
		$temasraiz = array();
		foreach($dados["raiz"] as $temar){
			$temasraiz[] = $this->formataTema($temar["id_tema"]);
		}
		if(count($dados["grupos"]) == 0){
			$grupos[] = array();
		}
		$raizgrupos = $this->pegaTemasRaizGrupo($id_menu,"",$filtraOgc,$filtraDown);
		//var_dump($raizgrupos);exit;
		foreach($dados["grupos"] as $grupo)	{
			$a = $grupo["n1_perfil"];
			$a = str_replace(" ",",",$a);
			if($this->verificaOcorrencia($perfil,explode(",",$a)) == true)
			{
				$temas = array();
				//$raizgrupo = $this->pegaTemasRaizGrupo($id_menu,$grupo["id_n1"],$filtraOgc,$filtraDown);
				$grupodown = "nao";
				$grupoogc = "nao";
				foreach($raizgrupos as $tema){
					if($tema["id_nivel"] == $grupo["id_n1"]){
						$temas[] = $this->formataTema($tema["id_tema"]);
					}
				}
				if($temas > 0){
					$grupodown = "sim";
					$grupoogc = "sim";
				}
				$subgrupos = array();
				if($listasgrupos=="sim"){
					$dadossubgrupos = $this->pegaSubgruposGrupo($id_menu,$grupo["id_n1"],$ordenaNome,$filtraOgc,$filtraDown);
					foreach($dadossubgrupos["subgrupos"] as $sgrupo){
						$a = $sgrupo["n2_perfil"];
						$a = str_replace(" ",",",$a);
						if($this->verificaOcorrencia($perfil,explode(",",$a))){
							//verifica se existem temas que podem receber download
							$down = "nao";
							$ogc = "nao";
							$listaT = $this->pegaTemasSubGrupo($sgrupo["id_n2"],$filtraOgc,$filtraDown);
							foreach($listaT as $tema){
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
							if(count($listaT) > 0){
								$subgrupos[] = array("id_n2"=>$sgrupo["id_n2"],"publicado"=>($sgrupo["publicado"]),"nome"=>$this->converte($sgrupo["nome_subgrupo"]),"download"=>$down,"ogc"=>$ogc);
							}
						}
					}
				}
				//evita ocorrencias vazias quando for aplicado um filtro
				if($filtraOgc == "sim" || $filtraDown == "sim"){
					if(count($subgrupos) > 0 || count($temas) > 0){
						$grupos[] = array("publicado"=>($grupo["publicado"]),"id_n1"=>($grupo["id_n1"]),"nome"=>$this->converte($grupo["nome_grupo"]),"ogc"=>$grupoogc,"download"=>$grupodown,"subgrupos"=>$subgrupos,"temasgrupo"=>$temas);
					}
				}
				else{
					$grupos[] = array("publicado"=>($grupo["publicado"]),"id_n1"=>($grupo["id_n1"]),"nome"=>$this->converte($grupo["nome_grupo"]),"ogc"=>$grupoogc,"download"=>$grupodown,"subgrupos"=>$subgrupos,"temasgrupo"=>$temas);
				}
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
		//codigo_tema para fins de compatibilidade
		return array("codigo_tema"=>($recordset["codigo_tema"]),"tipoa_tema"=>$recordset["tipoa_tema"],"publicado"=>$publicado,"nacessos"=>($recordset["nacessos"]),"tid"=>($recordset["codigo_tema"]),"nome"=>$this->converte($recordset["nome_tema"]),"link"=>$link,"download"=>$down,"ogc"=>$ogc,"kmz"=>$kmz);
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
		$sql = str_ireplace(array("update","delete","insert","--","drop",";"),"",$sql);
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
		if($_COOKIE["i3geocodigologin"] != ""){
			session_write_close();
			session_name("i3GeoLogin");
			session_id($_COOKIE["i3geocodigologin"]);
			session_start();
			$resultado = false;
			//verifica se e administrador
			foreach($_SESSION["papeis"] as $p){
				if($p == 1){
					return true;
				}
			}
			if(!empty($_SESSION["operacoes"][$operacao])){
				$resultado = true;
			}
			return $resultado;
		} else {
			return false;
		}
	}
}
?>