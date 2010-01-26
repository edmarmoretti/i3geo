<?php
class Arvore
{
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
	function __construct($locaplic,$idioma="pt")
	{
		$this->idioma = $idioma;
		if($idioma == "pt")
		{$coluna = "nome_grupo";}
		else
		{$coluna = $idioma;}
		$this->sql_grupos = "select i3geoadmin_grupos.$coluna as nome_grupo,id_n1,id_menu,i3geoadmin_n1.publicado,n1_perfil from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo ";

		if($idioma == "pt")
		{$coluna = "nome_subgrupo";}
		else
		{$coluna = $idioma;}
		$this->sql_subgrupos = "select i3geoadmin_subgrupos.$coluna as nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado,i3geoadmin_n2.n2_perfil from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo ";

		if($idioma == "pt")
		{$coluna = "nome_tema";}
		else
		{$coluna = $idioma;}
		$this->sql_temasraiz = "select id_raiz,i3geoadmin_raiz.id_tema,$coluna as nome_tema,tipoa_tema FROM i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema ";
		$this->sql_temasSubgrupo = "select i3geoadmin_temas.tipoa_tema, i3geoadmin_temas.codigo_tema,i3geoadmin_temas.tags_tema,i3geoadmin_n3.id_n3,i3geoadmin_temas.$coluna as nome_tema,i3geoadmin_n3.publicado,i3geoadmin_n3.n3_perfil,i3geoadmin_n3.id_tema,i3geoadmin_temas.download_tema,i3geoadmin_temas.ogc_tema from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema ";

		$this->sql_temas = "select kmz_tema,nacessos,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,$coluna as nome_tema,codigo_tema from i3geoadmin_temas ";

		
		$this->locaplic = $locaplic;
		$dbh = "";
		error_reporting(0);
		include($locaplic."/admin/php/conexao.php");
		if(!isset($convUTF))
		{$convUTF = true;}
		$this->convUTF = $convUTF;
		$this->dbh = $dbh;
		//
		//verifica se o ip atual está cadastrado como um dos editores
		//editores podem ver as coisas marcadas como não publicado
		//no sistema de administração
		//
		include($locaplic."/ms_configura.php");
		$this->editor = false;
		if($editores != "")
		{$this->editor = $this->verificaeditores($editores);}
		$this->editores = $editores;
		$this->pubsql = " (publicado != 'NAO' or publicado isnull) and ";
		if($this->editor)
		{$this->pubsql = "";}
	}
	function __destruct()
	{
		$this->dbh = null;
		$this->dbhw = null;
	}
	//pega a lista de menus
	function pegaListaDeMenus($perfil)
	{
		if($this->idioma == "pt")
		{$coluna = "nome_menu";}
		else
		{$coluna = $this->idioma;}
		if($this->editor)
		$sql = "SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from i3geoadmin_menus order by nome_menu";
		else
		$sql = "SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from i3geoadmin_menus where publicado_menu != 'NAO' or publicado_menu isnull order by nome_menu";

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
	//procura um tema tendo como base uma palavra
	function procuraTemas ($procurar,$perfil)
	{
		if($procurar != "")
		{$procurar = $this->removeAcentos($procurar);}
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
									{$miniatura = "sim";}
									$down = "sim";
									if (strtolower($t["download_tema"]) == "nao")
									{$down = "nao";}
									$texto = array("miniatura"=>$miniatura,"tid"=>$tema["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
									if($procurar == "")
									{$resultado[] = $texto;}
									else
									{
										if (stristr($nome,$procurar) || stristr($nome1,$procurar))
										{$resultado[] = $texto;}
										else
										{
											if (stristr($tags,$procurar) || stristr($tags1,$procurar))
											{$resultado[] = $texto;}
										}
									}
								}
							}
						}
						if (count($resultado) > 0)
						{$subgrupo[] = array("subgrupo"=>$this->converte($sgrupo["nome_subgrupo"]),"temas"=>$resultado);}
						$resultado = array();
					}	
				}
				if (count($subgrupo) > 0)
				{$final[] = array("grupo"=>$this->converte($grupo["nome_grupo"]),"subgrupos"=>$subgrupo);}
				$subgrupo = array();				
			}
		}
		return $final;
	}
	//pega os grupos de um menu específico e os temas na raiz do menu
	function pegaGruposMenu($id_menu)
	{
		$grupos = $this->execSQL($this->sql_grupos."where ".$this->pubsql." id_menu='$id_menu' order by ordem");
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 0 order by ordem");
		return array("raiz"=>$raiz,"grupos"=>$grupos);		
	}
	//pega os subgrupos de um grupo e os temas na raiz de um grupo
	function pegaSubgruposGrupo($id_menu,$id_n1)
	{
		$subgrupos = $this->execSQL($this->sql_subgrupos."where ".$this->pubsql." i3geoadmin_n2.id_n1='$id_n1' order by ordem");
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
		return array("raiz"=>$raiz,"subgrupos"=>$subgrupos);		
	}
	//pega os temas na raiz de um grupo
	function pegaTemasRaizGrupo($id_menu,$id_n1)
	{
		return $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
	}
	//pega os dados de um tema
	function pegaTema($id_tema)
	{
		return $this->execSQL($this->sql_temas."where id_tema = '$id_tema' ");
	}
	//pega os temas de um subgrupo
	function pegaTemasSubGrupo($id_n2)
	{
		return $this->execSQL($this->sql_temasSubgrupo."where ".$this->pubsql." i3geoadmin_n3.id_n2='$id_n2' order by ordem");
	}
	//formata os dados com grupos e temas na raiz do menu
	function formataGruposMenu ($id_menu,$perfil,$listasgrupos)
	{
		//error_reporting(E_ALL);
		$dados = $this->pegaGruposMenu($id_menu);
		$resultado = array();
		$temasraiz = array();
		foreach($dados["raiz"] as $temar)
		{$temasraiz[] = $this->formataTema($temar["id_tema"]);}
		if(count($dados["grupos"]) == 0)
		{$grupos[] = array();}
		foreach($dados["grupos"] as $grupo)
		{
			$a = $grupo["n1_perfil"];
			$a = str_replace(" ",",",$a);								
			if($this->verificaOcorrencia($perfil,explode(",",$a)))
			{
				$temas = array();
				$raizgrupo = $this->pegaTemasRaizGrupo($id_menu,$grupo["id_n1"]);
				$grupodown = "nao";
				$grupoogc = "nao";
				foreach($raizgrupo as $tema)
				{$temas[] = $this->formataTema($tema["id_tema"]);}
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
									{$down = "sim";$grupodown = "sim";}
									
									if (strtolower($tema["ogc_tema"]) != "nao")
									{$ogc = "sim";$grupoogc = "sim";}
								}
							}
							if(count($listaT) > 0)
							$subgrupos[] = array("id_n2"=>$sgrupo["id_n2"],"publicado"=>($sgrupo["publicado"]),"nome"=>$this->converte($sgrupo["nome_subgrupo"]),"download"=>$down,"ogc"=>$ogc);
						}
					}
				}
			}
			$grupos[] = array("publicado"=>($grupo["publicado"]),"id_n1"=>($grupo["id_n1"]),"nome"=>$this->converte($grupo["nome_grupo"]),"ogc"=>$grupoogc,"download"=>$grupodown,"subgrupos"=>$subgrupos,"temasgrupo"=>$temas);
		}
		$grupos[] = array("temasraiz"=>$temasraiz);
		//pega os sistemas checando os perfis
		$sistemas = array();
		$grupos[] = array("idmenu"=>$id_menu);
		$grupos[] = array("sistemas"=>"");
		return($grupos);		
	}
	//formata os dados com subgrupos de um grupo e temas na raiz do grupo
	function formataSubgruposGrupo ($id_menu,$id_n1,$perfil)
	{
		$dados = $this->pegaSubgruposGrupo($id_menu,$id_n1);
		$resultado = array();
		$temasraiz = array();
		foreach($dados["raiz"] as $temar)
		{$temasraiz[] = $this->formataTema($temar["id_tema"]);}
		if(count($dados["subgrupos"]) == 0)
		{$sgrupos[] = array();}
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
						{$down = "sim";}
						if (strtolower($tema["ogc_tema"]) != "nao")
						{$ogc = "sim";}
					}
				}
				if(count($listaT) > 0)
				$subgrupos[] = array("publicado"=>($sgrupo["publicado"]),"id_n2"=>($sgrupo["id_n2"]),"nome"=>$this->converte($sgrupo["nome_subgrupo"]),"download"=>$down,"ogc"=>$ogc);
			}
		}
		return (array("subgrupo"=>$subgrupos,"temasgrupo"=>$temasraiz));
	}
	//formata os temas de um subgrupo
	function formataTemasSubgrupo($id_n2,$perfil)
	{
		$dados = $this->pegaTemasSubGrupo($id_n2);
		$temas = array();
		foreach($dados as $tema)
		{
			$a = $tema["n3_perfil"];
			$a = str_replace(" ",",",$a);
			if($this->verificaOcorrencia($perfil,explode(",",$a)))
			{$temas[] = $this->formataTema($tema["id_tema"],$tema["publicado"]);}
		}
		return $temas;
	}
	//formata os dados de um tema
	function formataTema($id_tema,$publicado="SIM")
	{
		$recordset = $this->pegaTema($id_tema);
		$recordset = $recordset[0];
		$down = "sim";
		$ogc = "sim";
		$link = " ";
		$kmz = "nao";
		if (strtolower($recordset["download_tema"]) == "nao")
		{$down = "nao";}
		if (strtolower($recordset["ogc_tema"]) == "nao")
		{$ogc = "nao";}
		if(strtolower($recordset["tipoa_tema"]) == "wms")
		{$down = "nao";$ogc="nao";}
		if ($recordset["link_tema"] != "")
		{$link = $recordset["link_tema"];}
		if (strtolower($recordset["kmz_tema"]) == "sim")
		{$kmz = "sim";}
		return array("publicado"=>$publicado,"nacessos"=>($recordset["nacessos"]),"tid"=>($recordset["codigo_tema"]),"nome"=>$this->converte($recordset["nome_tema"]),"link"=>$link,"download"=>$down,"ogc"=>$ogc,"kmz"=>$kmz);		
	}
	//executa o sql
	function execSQL($sql)
	{
    	//echo "<br>".$sql;
		//error_reporting(E_ALL);
		$q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
    	return $q->fetchAll();
	}
	function verificaOcorrencia($procurar,$em)
	{
		if($procurar == "" && $em == "")
		{return TRUE;}
		$resultado = FALSE;
		if($procurar != "" && $em != "")
		{
			foreach($em as $e)
			{
				$e = trim($e);
				foreach($procurar as $p)
				{
					$p = trim($p);
					if($p == $e)
					{$resultado = TRUE;}
				}
			}
		}
		return $resultado;
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
	function converte($texto){
		if($this->convUTF == true)
		$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"UTF-8");
		else
		$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"ISO-8859-1");
		
		return $texto;	
	}
}
?>