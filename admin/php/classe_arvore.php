<?php
class Arvore
{
	protected $locaplic;
	//subgrupos que tem pelo menos um tema
	public $sql_subgrupos = "select i3geoadmin_subgrupos.nome_subgrupo,i3geoadmin_n2.id_n2,i3geoadmin_n2.publicado,i3geoadmin_n2.n2_perfil from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo ";
	//grupos que tem pelo menos um sub-grupo
	public $sql_grupos = "select i3geoadmin_grupos.nome_grupo,id_n1,id_menu,i3geoadmin_n1.publicado,n1_perfil from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo ";
	//nomes de todos os grupos
	public $sql_todosgrupos = "select * from i3geoadmin_grupos ";
	//temas na raiz
	public $sql_temasraiz = "select id_raiz,i3geoadmin_raiz.id_tema,nome_tema FROM i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema ";
	//todos os temas
	public $sql_temas = "select * from i3geoadmin_temas ";
	//temas de um subgrupo
	public $sql_temasSubgrupo = "select i3geoadmin_temas.codigo_tema,i3geoadmin_temas.tags_tema,i3geoadmin_n3.id_n3,i3geoadmin_temas.nome_tema,i3geoadmin_n3.publicado,i3geoadmin_n3.n3_perfil,i3geoadmin_n3.id_tema,i3geoadmin_temas.download_tema,i3geoadmin_temas.ogc_tema from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema ";
	function __construct($locaplic)
	{
		$this->locaplic = $locaplic;
		$dbh = "";
		error_reporting(0);
		include($locaplic."/admin/php/conexao.php");
		if(!isset($convUTF))
		{$convUTF = true;}
		$this->convUTF = $convUTF;
		$this->dbh = $dbh;
		//
		//verifica se o ip atual estб cadastrado como um dos editores
		//editores podem ver as coisas marcadas como nгo publicado
		//no sistema de administraзгo
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
		if($this->editor)
		$sql = 'SELECT * from i3geoadmin_menus order by nome_menu';
		else
		$sql = "SELECT * from i3geoadmin_menus where publicado_menu != 'NAO' or publicado_menu isnull order by nome_menu";
		$regs = $this->execSQL($sql);
   		$resultado = array();
		foreach($regs as $reg)
		{
			if ($this->verificaOcorrencia($perfil,explode(",",$reg["perfil_menu"])))
			{
				$status = "fechado";
				if(strtolower($reg["aberto"]) == "sim")
				$status = "aberto";
				$url = "";//$this->urli3geo."/admin/xmlmenutemas.php?id_menu=".$reg["id_menu"];
				$resultado[] = array("desc"=>$this->converte($reg["desc_menu"]),"publicado"=>$reg["publicado_menu"],"nomemenu"=>$this->converte($reg["nome_menu"]),"idmenu"=>$reg["id_menu"],"arquivo"=>"","status"=>$status,"url"=>$url);
			}
		}
		return $resultado;
	}
	//procura um tema tendo como base uma palavra
	function procuraTemas ($procurar,$perfil)
	{
		$procurar = $this->removeAcentos($procurar);
		$menus = $this->pegaListaDeMenus($perfil);
		$resultado = array();
		$subgrupo = array();
		$final = array();
		foreach($menus as $menu)
		{
			$grupos = $this->pegaGruposMenu($menu["idmenu"]);
			foreach($grupos["grupos"] as $grupo)
			{
				if($this->verificaOcorrencia($perfil,explode(",",$grupo["n1_perfil"])))
				{
					$sgrupos = $this->pegaSubgruposGrupo($menu["idmenu"],$grupo["id_n1"]);
					foreach($sgrupos["subgrupos"] as $sgrupo)
					{
						if($this->verificaOcorrencia($perfil,explode(",",$sgrupo["n2_perfil"])))
						{
							$temas = $this->pegaTemasSubGrupo($sgrupo["id_n2"]);
							foreach ($temas as $tema)
							{
								if($this->verificaOcorrencia($perfil,explode(",",$tema["n3_perfil"])))
								{
									$t = $this->pegaTema($tema["id_tema"]);
									$t = $t[0];
									$nome = $this->removeAcentos($tema["nome_tema"]);
									$tags = $this->removeAcentos($tema["tags_tema"]);
									$down = "nao";
									if (strtolower($t["download_tema"]) == "sim")
									{$down = "sim";}
									$texto = array("tid"=>$tema["codigo_tema"],"nome"=>$this->converte($tema["nome_tema"]),"link"=>$t["link_tema"],"download"=>$down);
									if (stristr($nome,$procurar))
									{$resultado[] = $texto;}
									else
									{
										if (stristr($tags,$procurar))
										{$resultado[] = $texto;}
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
	//pega os grupos de um menu especнfico e os temas na raiz do menu
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
		$raiz = $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
		return array("raiz"=>$raiz,"subgrupos"=>$subgrupos);		
	}
	//pega os temas na raiz de um grupo
	function pegaTemasRaizGrupo($id_menu,$id_n1)
	{
		return $this->execSQL($this->sql_temasraiz."where i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = $id_n1 order by ordem");
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
		$dados = $this->pegaGruposMenu($id_menu);
		$resultado = array();
		$temasraiz = array();
		foreach($dados["raiz"] as $temar)
		{$temasraiz[] = $this->formataTema($temar["id_tema"]);}
		if(count($dados["grupos"]) == 0)
		{$grupos[] = array();}
		foreach($dados["grupos"] as $grupo)
		{
			if($this->verificaOcorrencia($perfil,explode(",",$grupo["n1_perfil"])))
			{
				$temas = array();
				$raizgrupo = $this->pegaTemasRaizGrupo($id_menu,$grupo["id_n1"]);
				foreach($raizgrupo as $tema)
				{$temas[] = $this->formataTema($tema["id_tema"]);}

				$grupodown = "nao";
				$grupoogc = "nao";
				$subgrupos = array();
				if($listasgrupos=="sim")
				{
					$dadossubgrupos = $this->pegaSubgruposGrupo($id_menu,$grupo["id_n1"]);
					foreach($dadossubgrupos["subgrupos"] as $sgrupo)
					{
						if($this->verificaOcorrencia($perfil,explode(",",$sgrupo["n2_perfil"])))
						{
							//verifica se existem temas que podem receber download
							$down = "nao";
							$ogc = "nao";
							foreach($this->pegaTemasSubGrupo($sgrupo["id_n2"]) as $tema)
							{
								if (strtolower($tema["download_tema"]) == "sim")
								{$down = "sim";$grupodown = "sim";}
								if (strtolower($tema["ogc_tema"]) == "sim")
								{$ogc = "sim";$grupoogc = "sim";}
							}
							$subgrupos[] = array("publicado"=>($sgrupo["publicado"]),"nome"=>$this->converte($sgrupo["nome_subgrupo"]),"download"=>$down,"ogc"=>$ogc);
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
			if ($this->verificaOcorrencia($perfil,explode(",",$sgrupo["n2_perfil"])))
			{
				$sgrupodown = "nao";
				$sgrupoogc = "nao";
				$down = "nao";
				$ogc = "nao";
				foreach($this->pegaTemasSubGrupo($sgrupo["id_n2"]) as $tema)
				{
					if (strtolower($tema["download_tema"]) == "sim")
					{$down = "sim";$grupodown = "sim";}
					if (strtolower($tema["ogc_tema"]) == "sim")
					{$ogc = "sim";$grupoogc = "sim";}
				}
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
			if($this->verificaOcorrencia($perfil,explode(",",$tema["n3_perfil"])))
			{$temas[] = $this->formataTema($tema["id_tema"],$tema["publicado"]);}
		}
		return $temas;
	}
	//formata os dados de um tema
	function formataTema($id_tema,$publicado="SIM")
	{
		$recordset = $this->pegaTema($id_tema);
		$recordset = $recordset[0];
		$down = "nao";
		$ogc = "sim";
		$link = " ";
		if (strtolower($recordset["download_tema"]) == "sim")
		{$down = "sim";}
		if (strtolower($recordset["ogc_tema"]) == "nao")
		{$ogc = "nao";}
		if ($recordset["link_tema"] != "")
		{$link = $recordset["link_tema"];}
		return array("publicado"=>$publicado,"nacessos"=>($recordset["nacessos"]),"tid"=>($recordset["codigo_tema"]),"nome"=>$this->converte($recordset["nome_tema"]),"link"=>$link,"download"=>$down,"ogc"=>$ogc);		
	}
	//executa o sql
	function execSQL($sql)
	{
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
		$s = ereg_replace("[бавг]","a",$s);
		$s = ereg_replace("[БАВГ]","A",$s);
		$s = ereg_replace("[йик]","e",$s);
		$s = ereg_replace("[н]","i",$s);
		$s = ereg_replace("[Н]","I",$s);
		$s = ereg_replace("[ЙИК]","E",$s);
		$s = ereg_replace("[утфх]","o",$s);
		$s = ereg_replace("[УТФХ]","O",$s);
		$s = ereg_replace("[ъщы]","u",$s);
		$s = ereg_replace("[ЪЩЫ]","U",$s);
		$s = str_replace("з","c",$s);
		$s = str_replace("З","C",$s);
		//$str = htmlentities($s);
		$str = preg_replace("/(&)([a-z])([a-z]+;)/i", '$2', $s);
		$str = preg_replace("/[^A-Z0-9]/i", ' ', $str);
		$str = preg_replace("/\s+/i", ' ', $str);
		return $str;
	}
	function converte($texto){
		if($this->convUTF == true)
		$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"UTF8");
		else
		$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"ISO-8859-1");
		return $texto;	
	}
}
?>