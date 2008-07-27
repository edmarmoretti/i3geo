<?php
/*
Title: Mapa

Manipulação do mapa. Altera tamanho, lista temas, etc.

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

File: i3geo/classesphp/classe_mapa.php

19/6/2007
*/
/*
Class: Mapa
*/
class Mapa
{
	/*
	Variable: $mapa
	
	Objeto mapa
	*/
	public $mapa;
	/*
	Variable: $arquivo
	
	Arquivo map file
	*/
	public $arquivo;
	/*
	Variable: $layers
	
	Objetos layers
	*/
	public $layers;
	
/*
Function: __construct

Cria um objeto mapa 

parameters:

$map_file - Endereço do mapfile no servidor.
*/  	
	function __construct($map_file,$locaplic="")
	{
  		//error_reporting(E_ALL);
  		if (!function_exists('ms_newMapObj')) {return false;}
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		require_once($locaplic."/funcoes_gerais.php");
  		else
  		require_once("funcoes_gerais.php");
  		$this->locaplic = $locaplic;
  		if(!file_exists($map_file))
  		{return $this->arquivo = false;}
  		if(!@ms_newMapObj($map_file))
  		{return $this->mapa = false;}
		$this->mapa = @ms_newMapObj($map_file);
		$this->arquivo = $map_file;
		for ($i=0;$i < ($this->mapa->numlayers);$i++)
		{$this->layers[] = $this->mapa->getlayer($i);}
	}
/*
Method: salva

Salva o mapfile atual 
*/	
 	function salva()
 	{
	  	if (connection_aborted()){exit();}
	  	$this->mapa->save($this->arquivo);
	}
/*
Method: pegaMensagens

Pega as mensagens do metadata mensagem
*/
	function pegaMensagens()
	{
		$mensagem = "";
		foreach($this->layers as $l)
		{
			if($l->status == MS_DEFAULT)
			{$mensagem .= $l->getmetadata("mensagem");}
		}
		if (function_exists("mb_convert_encoding"))
		{$mensagem = mb_convert_encoding($mensagem,"UTF-8","ISO-8859-1");}
		return ($mensagem);
	}

/*
Method: gravaImagemCorpo (depreciado)

Grava a imagem do mapa atual
*/
	function gravaImagemCorpo()
	{
	 	$imgo = $this->mapa->draw();
		$nome = ($imgo->imagepath).nomeRandomico().".png";
		$imgo->saveImage($nome);
		$nome = ($imgo->imageurl).basename($nome);
		$imgo->free();
		return ($nome);
	}
/*
Method: parametrosTemas

Pega os parametros dos layers do mapa.

return:

string - javascript com os parametros
*/
	function parametrosTemas()
	{
		$existesel = false;
		$qy = file_exists(($this->arquivo)."qy");
		if ($qy)
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		foreach ($this->layers as $oLayer)
		{
			$sel = "nao";
			if ($qy) //verifica se existe alguma selecao no tema
			{
				$oLayer->open();
				$res_count = $oLayer->getNumresults();
				$oLayer->close();
				if ($res_count > 0){$sel = "sim";$existesel = true;}
			}
			if ((strtoupper($oLayer->getmetadata("tema")) != "NAO") && ($oLayer->getmetadata("escondido") == ""))
			{
				$escala = $oLayer->getmetadata("escala");
				if ($escala == ""){$escala = 0;}
				$down = $oLayer->getmetadata("download");
				//
				//verifica se o layer é do tipo features
				//
				$f = "nao";
				if (($oLayer->data == "") && ($oLayer->connection == ""))
				{$f = "sim";}
				$ct = $oLayer->connectiontype;
				//
				//verifica se o tema tem wfs
				//
				$wfs = $oLayer->getmetadata("wfs");
				//
				//verifica se o tema pode receber a operação de zoom para o tema
				//
				$zoomtema = "sim";
				if (($ct != 1) && ($oLayer->getmetadata("extensao") == ""))
				{$zoomtema = "nao";}
				//
				//verifica se existe restrição de escala
				//
				$contextoescala = "nao";
				if(($oLayer->minscale > 0) || ($oLayer->maxscale > 0))
				{$contextoescala = "sim";}
				$temas[] = ($oLayer->name)."*".($oLayer->status)."*".$oLayer->getmetadata("tema")."*".$oLayer->transparency."*".$oLayer->type."*".$sel."*".$escala."*".$down."*".$f."*".$ct."*nao*".$zoomtema."*".$contextoescala;
			}
		}
		//apaga o arquivo qy se não for necessário
		if (!$existesel && $qy)
		{unlink(($this->arquivo)."qy");}
		$temas = array_reverse($temas);
		$res = "var temas='".implode(";",$temas)."'";
		if (function_exists("mb_convert_encoding"))
		{$res = mb_convert_encoding($res,"UTF-8","ISO-8859-1");}
		return $res;
	}
/*
Method: redesenhaCorpo

Redesenha o mapa e retorna as variáveis necessárias para montar o mapa.

Parameters:

$locsistemas - Endereço do arquivo xml com a lista de sistemas adicionais.
$locidentifica - Variável definida no arquivo ms_configura.php que identifica se existem sistemas adicionais a ser mostrados na opção de identificação.
$tipoimagem - filtro que será aplicado na imagem (opcional).

Return:

string - parametros do corpo do mapa

Include:
<classe_imagem.php>
*/
	function redesenhaCorpo($locsistemas,$locidentifica,$tipoimagem,$utilizacgi,$locmapserv)
	{
  		if(file_exists($this->locaplic."/classe_imagem.php"))
  		require_once($this->locaplic."/classe_imagem.php");
  		else
  		require_once("classe_imagem.php");
		$nomer = "";
		$qy = file_exists(($this->arquivo)."qy");
		$legenda = $this->mapa->legend;
		//
		//prepara a legenda para incluir no mapa, preenchendo os nomes das classes que podem estar em branco
		//isso ocorre quando o layer tem só uma classe
		//
		if ($legenda->status == MS_EMBED)
		{
			foreach ($this->layers as $layer)
			{
				if (($layer->data != "") && (strtoupper($layer->getmetadata("escondido")) != "SIM") && (strtoupper($layer->getmetadata("tema")) != "NAO"))
				{
					if ($layer->numclasses > 0)
					{
						$classe = $layer->getclass(0);
						if (($classe->name == "") || ($classe->name == " "))
						{$classe->set("name",$layer->getmetadata("tema"));}
					}
				}
			}
		}			
		$nome = nomeRandomico();
		//
		//gera a imagem do mapa
		//se estiver sendo utilizado o cgi para desenhar a imagem
		//é necessário criar uma imagem vazia para capturar o nome que será retornado
		//
		if (isset($utilizacgi) && strtolower($utilizacgi) == "sim" && $tipoimagem=="nenhum" && !$qy)
		{
			foreach($this->layers as $l)
			{$l->set("status",MS_OFF);}
			$imgo = @$this->mapa->draw();
		}
		else
		{
			if($tipoimagem != "nenhum")
			{
				$of = $this->mapa->outputformat;
				$of->set("imagemode",MS_IMAGEMODE_RGB);
			}
			if (!$qy)
			{$imgo = @$this->mapa->draw();}
			else
			{$imgo = @$this->mapa->drawQuery();}
			$nomer = ($imgo->imagepath)."mapa".$nome.".png";
			$imgo->saveImage($nomer);
			//
			//aplica o filtro de imagem se estiver definido em $tipoimagem
			//
			if ($tipoimagem == "cinza")
			{
				$m = new Imagem($nomer);
				imagepng($m->cinzaNormal(),str_replace("\\","/",$nomer));
			}
			if ($tipoimagem == "sepiaclara")
			{
				$m = new Imagem($nomer);
				imagepng($m->sepiaClara(),str_replace("\\","/",$nomer));
			}
			if ($tipoimagem == "sepianormal")
			{
				$m = new Imagem($nomer);
				imagepng($m->sepiaNormal(),str_replace("\\","/",$nomer));
			}
			$nomer = ($imgo->imageurl).basename($nomer);
		}
		if ($imgo == ""){return "erro";}
		$e = $this->mapa->extent;
		$ext = $e->minx." ".$e->miny." ".$e->maxx." ".$e->maxy;
		if (isset($utilizacgi) && strtolower($utilizacgi) == "sim" && !$qy)
		{
			$nomer = $locmapserv."?map=".$this->arquivo."&mode=map&".nomeRandomico();
		}
		$res = "g_locidentifica='".$locidentifica."';g_sistemas='".$locsistemas."';g_celula=".$this->mapa->cellsize.";var mapscale = ".$this->mapa->scale.";var mapres=".$this->mapa->resolution.";var mapcellsize=".$this->mapa->cellsize.";var mapexten='".$ext."';var mapimagem='".$nomer."';var mapwidth=".$imgo->width.";var mapheight=".$imgo->height.";var mappath='".$imgo->imagepath."';var mapurl='".$imgo->imageurl."'";
		$imgo->free();
		return $res;
	}
/*
Method: redesenhaEntorno (depreciado)

Redesenha o entorno do mapa (depreciado).

Redesenha as partes norte, sul, leste e oeste do mapa e retorna as variáveis necessárias para montar o mapa.

Return:

string - javascript com as variáveis para redesenho do mapa
*/
	function redesenhaEntorno()
	{
		$nomes = nomeRandomico();
		$this->mapa->prepareimage();
		$e = $this->mapa->extent;
		$w = $this->mapa->width;
		$h = $this->mapa->height;
		$s = $this->mapa->scale;
		$this->mapa = desligamargem($this->mapa);
		$pt = ms_newPointObj();
		//desenha o leste
		$pt->setXY($w + ($w/2), $h/2);
		$this->mapa->zoompoint(0,$pt,$w,$h,$e);
		$nomeL = gravaImagemMapa($this->mapa);
		//desenha o oeste
		$pt->setXY(0 - ($w / 2), $h/2);
		$this->mapa->zoomscale($s*2,$pt,$w,$h,$e);
		$nomeO = gravaImagemMapa();
		//desenha o norte
		$pt->setXY($w / 2, 0 - $h);
		$this->mapa->zoomscale($s*2,$pt,$w,$h,$e);
		$nomeN = gravaImagemMapa();
		//desenha o sul
		$pt->setXY($w / 2, $h * 2);
		$this->mapa->zoomscale($s * 2,$pt,$w,$h,$e);
		$nomeS = gravaImagemMapa();
		$pt->free();
		return "var imagens=['".$nomeL["url"]."','".$nomeO["url"]."','".$nomeN["url"]."','".$nomeS["url"]."'];";
	}
/*
Method: ativalegenda

Ativa/desativa legenda, incluindo ou não no corpo do mapa.
*/
	function ativalegenda()
	{
		$legenda = $this->mapa->legend;
		$legenda->status == MS_EMBED ? $legenda->set("status",MS_OFF) : $legenda->set("status",MS_EMBED) ; 
		return "ok";
	}
/*
Method: ativalogo

Ativa/desativa logomarca.

A logomarca é mostrada no canto superior direito da imagem do mapa.
No mapfile padrão (geral1.map), o layer "copyright" é utilizado para incluir a logomarca.
Essa função liga ou desliga esse layer, manipulando a propriedade "status".

*/
	function ativalogo()
	{
		$layer = $this->mapa->getlayerbyname("copyright");
		if ($layer != "")
		{
			$layer->status == MS_DEFAULT ? $layer->set("status",MS_OFF) : $layer->set("status",MS_DEFAULT);
		}
		return "ok";
	}
/*
Method: listaTemasLocais

Lista os temas locais de um mapa.

Lista os temas existentes no mapfile atual, que utilizam como fonte de dados shape file, e que estão armazenados no diretório temporário do mapa.
Os arquivos shape file existentes no diretório temporário do mapa são passíveis de edição.
Obs.: Toda vez que um tema local é criado pelo I3Geo, o METADATA "TEMALOCAL" é marcado como "sim".

Parameter:

$tipo - tipo de layer que será considerado. Default é 0.
*/
	function listaTemasLocais($tipo=0)
	{
		$final = array(); //resultado final
		//verifica se o tema é local
		$layers = array();
		foreach ($this->layers as $layer)
		{
			if (($layer->getMetaData("TEMALOCAL") != "") && ($layer->type == $tipo))
			{
				$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));
			}
		}
		return $final;
	}
/*
Method: listaTemas

Lista os temas de um mapa.

Obs.: o "METADATA" "ESCONDIDO", quando presente no tema e diferente de vazio, indica que o tema é do
tipo escondido, ou seja, não deve ser listado pelo I3Geo em combos ou listagens. Por isso,
layers desse tipo são ignorados por essa função.

Parameter:

$opcao Situação desejada do tema (ligados ou todos).

Return:

Array com os temas e seus nomes

Properties:

tema

nome
*/
	function listaTemas($opcao)
	{
		$final = array();
		if ($opcao == "ligados")
		{
			foreach ($this->layers as $layer)
			{
				if (($layer->isvisible()) && ($layer->status == 2) && ($layer->getmetadata("ESCONDIDO") == ""))
				{
					$ident = $layer->getmetadata("IDENTIFICA");
					$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")),"identifica"=>$ident);
				}
			}
		}
		else
		{
			foreach ($this->layers as $layer)
			{
			 	if ($layer->getmetadata("ESCONDIDO") == "")
				{$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));}
			}
		}
		return $final;
	}
/*
Method: listaTemasTipo

Lista os temas, visíveis, de um determinado tipo de feição de um mapa.

Obs.: o "METADATA" "ESCONDIDO", quando presente no tema e diferente de vazio, indica que o tema é do
tipo escondido, ou seja, não deve ser listado pelo I3Geo em combos ou listagens. Por isso,
layers desse tipo são ignorados por essa função.

Parameters:

$tipo Tipo de tema (pode ser mais de um) ponto,poligono,linha,raster

Return:

Array com os temas e seus nomes

Properties:

tema

nome

*/
	function listaTemasTipo($tipo,$selecao="nao")
	{
		if (($selecao=="sim") && (file_exists(($this->arquivo)."qy")))
		{$this->mapa->loadquery(($this->arquivo)."qy");}
		$layers = array();
		foreach($this->layers as $layer)
		{
			if (($layer->isvisible()) && ($layer->getmetadata("ESCONDIDO") == ""))
			{$layers[] = $layer;}
		}
		$final = array();
		//substitui os tipos pelo código usado no mapserver
		$tipo = str_ireplace("ponto","0",$tipo);
		$tipo = str_ireplace("poligono","2",$tipo);
		$tipo = str_ireplace("linha","1",$tipo);
		$tipo = str_ireplace("raster","3",$tipo);
		$tipos = explode(",",$tipo);
		//pega os layers apenas dos tipos indicados e monta a string com os nomes corretos
		foreach ($layers as $layer)
		{
			if (!(array_search(($layer->type),$tipos) === FALSE))
			{
				if($selecao == "sim")
				{
					$res_count = $layer->getNumresults();
					if ($res_count > 0)
					{$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));}					
				}
				else
				{$final[] = array("tema"=>$layer->name,"nome"=>(pegaNome($layer,"UTF-8")));}
			}
		}
		return $final;
	}
/*
Method: listaTemasComSel

Lista os temas de um mapa que possuem elementos selecionados.

Obs.: o "METADATA" "ESCONDIDO", quando presente no tema e diferente de vazio, indica que o tema é do
tipo escondido, ou seja, não deve ser listado pelo I3Geo em combos ou listagens. Por isso,
layers desse tipo são ignorados por essa função.

Return:

Array com os temas e seus nomes

Properties:

tema

nome

*/
	function listaTemasComSel()
	{
		$layers = array();
		$final = array();
		if (file_exists(($this->arquivo)."qy"))
		{
			foreach($this->layers as $layer)
			{
				if ($layer->getmetadata("ESCONDIDO") == "")
				{$layers[] = $layer;}
			}
			$this->mapa->loadquery(($this->arquivo)."qy");
			foreach ($layers as $layer)
			{
				//verifica se o tema tem selecao
				$layer->set("template","none.htm");
				$res_count = $layer->getNumresults();
				if ($res_count > 0)
				{
				 	$nometmp = pegaNome($layer,"UTF-8");
					$final[] = array("tema"=>$layer->name,"nome"=>$nometmp);
				}
			}
		}
		return $final;
	}
/*
Method: mudaQS

Muda o tamanho do query map.

Essa função é executada na inicialização do mapa ou quando o mapa tem suas dimensões alteradas.
A função de alteração dos parâmetros do query map original do PHPMapscript, não funciona corretamente.

Parameters:

$w - Largura.

$h - Altura.
*/
	function mudaQS($w,$h)
	{
		//le o map file
		$abre = fopen($this->arquivo, "r");
		while (!feof($abre))
		{
			$buffer = fgets($abre);
			$maparray[] = $buffer;
		}
		fclose($abre);
		$novoarray = array();
		$conta = 0;
		$pega = "nao";
		//procura a string "querymap"
		foreach ($maparray as $e)
		{
			$testa = explode("QUERYMAP",$e);
			if (count($testa) > 1)
			{$pega = "sim";}
			$testa = explode("SIZE",$e);
			if ((count($testa) > 1) && ($pega == "sim"))
			{
				$e = "SIZE ".$w." ".$h;
				$pega = "nao";
			}
			$novoarray[] = $e;
		}
		//salva o mapfile
		$abre = fopen($this->arquivo, "wt");
		foreach($novoarray as $linha)
		{$escreve = fwrite ($abre,$linha);}
		$fecha = fclose ($abre);
	}
/*
Method: corQM

Muda a cor do query map.

Muda a cor utilizada para mostrar os elementos selecionados de um tema ou retorna a cor atual

Parameter:

$cor - RGB separado por vírgula. Se a cor for vazia, retorna a cor atual.

*/
	function corQM($cor)
	{
		$c = $this->mapa->querymap->color;
		if ($cor != "")
		{
			$cores = explode(",",$cor);
			$c->setrgb($cores[0],$cores[1],$cores[2]);
			$retorno = "ok";
		}
		else
		{
			$retorno = $c->red.",".$c->green.",".$c->blue;
		}
		return ($retorno);
	}
/*
Method: corfundo

Muda a cor do fundo do mapa.

Parameter:

$cor - RGB separado por vírgula. Se a cor for vazia, retorna a cor atual.

*/
	function corfundo($cor)
	{
		$c = $this->mapa->imagecolor;
		if ($cor != "")
		{
			$cores = explode(",",$cor);
			$c->setrgb($cores[0],$cores[1],$cores[2]);
			$retorno = "ok";
		}
		else
		{
			$retorno = $c->red.",".$c->green.",".$c->blue;
		}
		return ($retorno);
	}
/*
Method: gradeCoord

Gera uma grade de coordenadas

A grade é incluida no mapa como um novo layer.

Parameter:

$intervalo - intervalo entre as linhas da grade.

$corlinha - cor em RGB das linhas da grade

$larguralinha - largura das linhas da grade em pixel

$tipolinha - símbolo das linhas

$tamanhotexto - tamanho do texto

$cortexto - cor do texto

$incluitexto - sim|nao
*/
	function gradeCoord($intervalo,$corlinha="200,200,200",$larguralinha=1,$tipolinha="linha",$tamanhotexto=MS_TINY,$cortexto="0,0,0",$incluitexto="sim")
	{
		echo $corlinha;
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		$nlayer = criaLayer($this->mapa,MS_LAYER_LINE,MS_DEFAULT,"Grade de coordenadas","SIM");
		ms_newgridobj($nlayer);
		$nlayer->grid->set("labelformat", "DDMMSS");
		$nlayer->grid->set("maxinterval", $intervalo);
		$classe = $nlayer->getclass(0);
		$classe->set("name","");
		$estilo =$classe->getstyle(0);
		$estilo->set("maxsize",100);
		$estilo->set("minsize",1);
		$estilo->set("size",$larguralinha);
		$estilo->set("symbolname",$tipolinha);
		$cor = $estilo->color;
		$corlinha = explode(",",$corlinha);
		$cor->setrgb($corlinha[0],$corlinha[1],$corlinha[2]);
		if($incluitexto == "sim")
		{
			$label = $classe->label;
			$label->set("size",$tamanhotexto);
			$label->set("type",MS_BITMAP);
			$label->set("buffer",0);
			$label->set("force",MS_FALSE);
			$label->set("partials",MS_TRUE);
			$label->set("position",MS_CC);
			$corl = $label->color;
			$cortexto = explode(",",$cortexto);
			$corl->setrgb($cortexto[0],$cortexto[1],$cortexto[2]);
			$label->set("offsetx",0);
			$label->set("offsety",0);
		}
		return ("ok");
	}
/*
Method: adicionaTema

Acrescenta um novo tema em um arquivo map file.

O tema deve estar incluído em um arquivo .map localizado no diretório "temas".
Ao ser adicionado, todos os layers do arquivo indicado serão acrescentados.
Os layers que formam grupos também são processados, tendo seus nomes alterados de acordo.
Cada novo layer receberá um novo nome, definido de forma aleatória.
Os nomes dos temas podem conter o caminho completo do mapfile.

Parameters:

$temas - string Lista separada por vírgulas, dos arquivos que serão abertos para pegar os novos layers. Não inclua a extensão ".map".

$locaplic - string Diretório onde fica a aplicação.

$random - indica se os nomes dos novos layers serão modificados ou nao
*/
	function adicionaTema($temas,$locaplic,$random="sim")
	{
		//limpa selecao
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		$temas = explode(",",$temas);
		foreach ($temas as $nome)
		{
			$nomemap = "";
			//
			//verifica se o tema é um arquivo php
			//
			if ((file_exists($locaplic."/temas/".$nome.".php")) || (file_exists($nome.".php")))
			{include_once($locaplic."/temas/".$nome.".php");}
			else
			{
				if (file_exists($locaplic."/temas/".$nome.".map"))
				{$nomemap = $locaplic."/temas/".$nome.".map";}
				if (file_exists($nome))
				{$nomemap = $nome;}
				if (file_exists($nome.".map"))
				{$nomemap = $nome.".map";}
				if ($nomemap != "")
				{
					$nmap = ms_newMapObj($nomemap);
					$novosnomes = $nmap->getAllLayerNames();
					//define nomes unicos para os temas
					foreach ($novosnomes as $n)
					{$random == "sim" ? $nomeunico[$n] = nomeRandomico() : $nomeunico[$n] = $n;}
					//altera os temas para incluir o nome unico
					foreach ($novosnomes as $n)
					{
						$nlayer = $nmap->getlayerbyname($n);
						autoClasses(&$nlayer,$this->mapa);
						//
						//cria as classes com base em atributos
						//
						/*
						if($nlayer->getmetadata("classesitem") != "")
						{
							$itemnome = $nlayer->getmetadata("classesnome");
							$itemid = $nlayer->getmetadata("classesitem");
							$itemcor = $nlayer->getmetadata("classescor");
							$itemsimbolo = $nlayer->getmetadata("classesimbolo");
							$itemtamanho = $nlayer->getmetadata("classestamanho");
							$classeoriginal = $nlayer->getclass(0);
							//
							//pega o número de ocorrências de itemid
							//
							$nlayer->open();
							$status = $nlayer->whichShapes($this->mapa->extent);
							$parametrosClasses = array();	
							if ($status == 0)
							{	
								while ($shape = $nlayer->nextShape())
								{
									$id = trim($shape->values[$itemid]);
									if (!$parametrosClasses[$id])
									{
										$nome = "";
										if($itemnome != "")
										$nome = trim($shape->values[$itemnome]);
										$cor = "";
										if($itemcor != "")
										$cor = explode(",",trim($shape->values[$itemcor]));
										if(count($cor) != 3)
										$cor = explode(" ",trim($shape->values[$itemcor]));
										$tamanho = "";
										if($itemtamanho != "")
										$tamanho = trim($shape->values[$itemtamanho]);
										$simbolo = "";
										if($itemsimbolo != "")
										$simbolo = trim($shape->values[$itemsimbolo]);
										$parametrosClasses[$id] = array("nome"=>$nome,"cor"=>$cor,"tamanho"=>$tamanho,"simbolo"=>$simbolo);
									}
								}
								$fechou = $nlayer->close();
								//echo "<pre>";var_dump($parametrosClasses);
								if (count($parametrosClasses) > 0)
								{
									$ids = array_keys($parametrosClasses);
									for($i=0;$i < count($parametrosClasses);$i++)
									{
										$p = $parametrosClasses[$ids[$i]];
										//echo "<pre>";var_dump($p);
										$nclasse = ms_newClassObj($nlayer,$classeoriginal);
										if($p["nome"] != "")
										$nclasse->set("name",$p["nome"]);
										$estilo = $nclasse->getstyle(0);
										if($p["cor"] != "")
										{
											$cor = $p["cor"];
											$ncor = $estilo->color;
											if($ncor == "")
											$ncor = $estilo->outlinecolor;
											$ncor->setrgb($cor[0],$cor[1],$cor[2]);
										}
										if($p["tamanho"] != "")
										$estilo->set("size",$p["tamanho"]);
										if($p["simbolo"] != "")
										$estilo->set("symbolname",$p["simbolo"]);
										
										$strE = "('[".$itemid."]'eq'".$ids[$i]."')";
										$nclasse->setexpression($strE);
									}
									$classeoriginal->set("status",MS_DELETE);
								}
							}
						}
						*/
						//
						//muda para RGB para melhorar o desenho da imagem raster
						//
						if($nlayer->type == MS_LAYER_RASTER)
						{
							$of = $this->mapa->outputformat;
							$of->set("imagemode",MS_IMAGEMODE_RGB);
						}
						$nlayer->set("status",MS_DEFAULT);
						$nlayer->setmetadata("nomeoriginal",$nlayer->name);
						$nlayer->set("name",$nomeunico[$n]);
						//altera o nome do grupo se existir
						if ($nlayer->group != " ")
						{
							$lr = $nlayer->group;
							$nlayer->set("group",$nomeunico[$lr]);
						}
						ms_newLayerObj($this->mapa, $nlayer);
						$l = $this->mapa->getlayerbyname($nlayer->name);
						//reposiciona o layer se for o caso
						if ($l->group == "")
						{
							$ltipo = $l->type;
							if (($ltipo == 2) || ($ltipo == 3))//poligono = 2
							{
								$indicel = $l->index;
								$numlayers = $this->mapa->numlayers;
								$nummove = 0;
								for ($i = $numlayers-1;$i > 0;$i--)
								{
									$layerAbaixo = $this->mapa->getlayer($i);
									$tipo = $layerAbaixo->type;
									if (($tipo != 2) && ($tipo != 3))
									{$nummove++;}
								}
								if ($nummove > 2)
								{
									for ($i=0;$i<=($nummove - 3);$i++)
									{
										$this->mapa->movelayerup($indicel);
									}
								}
							}
						}
					}
				}
			}
		}
		return("ok");
	}
/*
Method: excluiTemas

Exclui temas de um mapa.

O arquivo de seleção (.qy) é apagado do diretório temporário.

Parameter:

$temas - lista separada por vírgula dos temas que serão excluídos.
*/
	function excluiTemas($temas)
	{
		if (file_exists(($this->arquivo)."qy"))
		{unlink(($this->arquivo)."qy");}
		$temas = explode(",",$temas);
		foreach ($temas as $nome)
		{
			if ($layer = @$this->mapa->getlayerbyname($nome))
			{
				$grupo = $layer->group;
				$layer->set("status",MS_DELETE);
				$lgs = $this->mapa->getLayersIndexByGroup($grupo);
				if($lgs)
				{
					foreach ($lgs as $lg)
					{
						$ll = $this->mapa->getlayer($lg);
						$ll->set("status",MS_DELETE);
					}
				}
				$lgs = $this->mapa->getLayersIndexByGroup($nome);
				if ($lgs)
				{
					foreach ($lgs as $lg)
					{
						$ll = $this->mapa->getlayer($lg);
						$ll->set("status",MS_DELETE);
					}
				}
			}
		}
		return("ok");
	}
/*
Method: ligaDesligaTemas

Liga desliga temas.

Torna temas visíveis ou não no mapa alterando seu status.

Parameters:

$ligar - lista separada por vírgula dos temas que serão ligados.

$desligar - lista separada por vírgula dos temas que serão desligados. Se for igual a todos, todos os layers serão desligados.
*/
	function ligaDesligaTemas($ligar,$desligar)
	{
		if($desligar == "todos")
		{
			$desligar = $this->mapa->getalllayernames();
			$desligar = implode(",",$desligar);	
		}
		if ($ligar != "")
		{
			$listal = explode(",",$ligar);
			foreach ($listal as $layer)
			{
				$ls = array();
				$vermultilayer = new vermultilayer();
				$vermultilayer->verifica($this->arquivo,$layer);
				if ($vermultilayer->resultado == 1) // o tema e multi layer
				{$ls = $vermultilayer->temas;}
				$ls[] = $layer;
				foreach ($ls as $l)
				{
					$l = $this->mapa->getlayerbyname($l);
					$l->set("status",2);
				}
			}
		}
		if ($desligar != "")
		{
			$listad = explode(",",$desligar);
			foreach ($listad as $layer)
			{
				$ls = array();
				$vermultilayer = new vermultilayer();
				$vermultilayer->verifica($this->arquivo,$layer);
				if ($vermultilayer->resultado == 1) // o tema e multi layer
				{$ls = $vermultilayer->temas;}
				else
				{$ls[] = $layer;}
				foreach ($ls as $l)
				{
					$l = $this->mapa->getlayerbyname($l);
					$l->set("status",0);
				}
			}
		}
		return("ok");
	}
/*
Method: adicionatemawms

Acrescenta um novo tema em um arquivo map file tendo como fonte um WMS.

Parameters:

$tema - Tema que será adicionado.
$servico - Endereço do web service.
$nome - Nome do tema para a legenda.
$proj - Lista das projeções suportadas separadas por vírgula.
$formato - Lista dos formatos de imagem separadas por vírgula.
$locaplic - Diretório onde fica a aplicação.
$tipo - Tipo de representação poligonal|linear|pontual.
$versao - Versão do getcapabilities
$nomecamada - nome da camada do WMS
$dir_tmp - diretório temporário do I3Geo
$imgdir - diretório temporário das imagens
$imgurl - url do imgdir
$tiporep - tipo de representação das feições do mapa
$suportasld - Suporta SLD sim|nao.
$formatosinfo - lista de formatos da requisição de atributos para a função getfeatureinfo (default text/plain)
Include:
<wmswfs.php>
*/
	function adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld,$formatosinfo="text/plain")
	{
		if(file_exists($this->locaplic."/wmswfs.php"))
		require_once($this->locaplic."/wmswfs.php");
		else
		require_once("wmswfs.php");
		//limpa selecao
		if (file_exists(($this->arquivo)."qy"))
		{unlink (($this->arquivo)."qy");}
		$nmap = ms_newMapObj($locaplic."/aplicmap/novotema.map");
		$layer = $nmap->getlayerbyname("novotema");
		$layer->set("name",$tema);
		$layer->set("status",MS_DEFAULT);
		$layer->setmetadata("tema",$nomecamada);
		$layer->setmetadata("nomeoriginal",$tema); //nome original do layer no web service
		$layer->setmetadata("tipooriginal",$tiporep);
		if ($tiporep != "")
		{
			$layer->set("type",MS_LAYER_POLYGON);
			if ($tiporep == "linear")
			{
				$layer->set("type",MS_LAYER_LINE);
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(-1,-1,-1);
			}
			if ($tiporep == "pontual")
			{$layer->set("type",MS_LAYER_POINT);}
			$sld = $layer->generateSLD();
			$fp = fopen($dir_tmp."/".$imgdir."/".$layer->name."sld.xml", "a");
			fputs( $fp, $sld );
			fclose($fp);
		}
		$layer->set("name",nomeRandomico(6));
		$layer->set("type",MS_LAYER_RASTER);
		$layer->set("connection",$servico);
		$layer->set("connectiontype",MS_WMS);
		$epsg = "EPSG:4291";
		$e4291 = "nao";
		$pos = explode(",",$proj);
		if (count($pos) > 1)
		{
			foreach ($pos as $p)
			{
				$p = explode(":",$p);
				if ($p[1] == "4326")
				{$epsg = "EPSG:4326";}
				if ($p[1] == "4291")
				{$epsg = "EPSG:4291";$e4291="sim";}
			}
		}
		else {$epsg = $proj;}
		if ($e4291 == "sim"){$epsg = "EPSG:4291";}
		$layer->setmetadata("wms_srs",$epsg);
		$layer->setmetadata("wms_name",$tema);
		$layer->setmetadata("wms_server_version",$versao);
		$layer->setmetadata("wms_formatlist",$formato);
		$layer->setmetadata("formatosinfo",$formatosinfo);
		$layer->setmetadata("wms_exceptions_format","application/vnd.ogc.se_xml");
		$layer->setmetadata("wms_style",$nome);
		$layer->setmetadata("wms_connectiontimeout","30");
		$layer->setmetadata("wms_force_separate_request","1");
		//pega o timpo de formato de imagem que deve ser requisitado
		//a preferência é png, mas se não for possível, pega o primeiro da lista de formatos
		//disponíveis no formato
		if (stristr($formato,"png"))
		{$im = "image/png";}
		else
		{
			$im = explode(",",$formato);
			$im = $im[0];
		}
		if (($tiporep != "") && ($suportasld == "sim"))
		{
			$layer->setmetadata("wms_sld_url",$imgurl.$layer->name."sld.xml");
			$layer->setmetadata("sld",$dir_tmp."/".$imgdir."/".$layer->name."sld.xml");
		}
		else
		{
			$urllegenda = $servico."&service=wms&request=getlegendgraphic&version=".$versao."&service=wms&layer=".$tema."&format=".$im;
			$layer->setmetadata("legendawms",$urllegenda);
		}

		$layer->setmetadata("wms_format",$im);
		$layer->setmetadata("wfs","nao");
		//verifica se o serviço tem wfs
		$wfs = existeWFS($servico);
		if ($wfs != "nao")
		{
			//verifica se a camada esta no wfs
			$existeWFS = existeTemaWFS();
			if ($existeWFS == "sim")
			{$layer->setmetadata("wfs","sim");}
		}
		$c = $layer->offsite;
		$c->setrgb(255,255,255);
		ms_newLayerObj($this->mapa, $layer);
		$of = $this->mapa->outputformat;
		$of->set("imagemode",MS_IMAGEMODE_RGB);
		$this->salva();
	}
/*
Method: converteWS

Transforma o mapa atual em um web service.

O novo map file é armazenado no mesmo diretório do map file original.

Parameters:
$locmapserv - localização do CGI do mapserver
$h - host name

Return:

Endereço do WMS
*/
	function converteWS($locmapserv,$h)
	{
		$nomews = str_replace(".map","ws.map",$this->arquivo);
		$nomeurl = $locmapserv."?map=".$nomews;
		$w = $this->mapa->web;
		$w->set("template","");
		// adiciona os parametros no nivel do mapa
		$this->mapa->setmetadata("wms_title","I3Geo");
		$this->mapa->setmetadata("wms_onlineresource","http://".$h.$nomeurl);
		$this->mapa->setmetadata("wms_srs","EPSG:4291");
		foreach ($this->layers as $layer)
		{
			$n = pegaNome($layer);
			$layer->setmetadata("wms_title",$n);
			$layer->setmetadata("wms_name",$n);
			$layer->setmetadata("wms_srs","EPSG:4291 EPSG:4326");
			$layer->setmetadata("WMS_INCLUDE_ITEMS","all");
			$layer->set("status","ON");
			$layer->set("template","none.htm");
			$layer->setmetadata("gml_include_items","all");
			$layer->set("dump",MS_TRUE);
			$c = $layer->getclass(0);
			if ($c->name == "")
			{$c->name = " ";}
		}
		$eb = $this->mapa->scalebar;
		$eb->set("status",MS_OFF);
		$this->mapa->save($nomews);
		return($nomeurl);
	}
/*
Method: adicionaTemaGeoRSS

Adiciona um canal GeoRSS como um tema no mapa.

Parameters:
$servico - Endereço do RSS.
$dir_tmp - Diretório onde o arquivo será criado.
$locaplic - Localização do I3geo
$canal - Identificador do canal (ordem em que está no RSS)
*/
	function adicionaTemaGeoRSS($servico,$dir_tmp,$locaplic,$canal)
	{
		$xml = simplexml_load_file($servico);
		$conta = 0;
		foreach($xml->channel as $c)
		{
			if ($conta == $canal)
			{$canal = $c;}
		}
		$resultado = array();
		foreach ($canal->item as $item)
		{
			$env = array();
			//define o tipo
			$tipog = "envelope";
			if ($item->xpath('geo:lat')){$tipog = "geo";}
			if ($item->xpath('georss:point')){$tipog = "georsspoint";}
			if ($tipog == "envelope")
			{
				foreach ($item->xpath('georss:where') as $w)
				{
					foreach ($w->xpath('gml:Envelope') as $e)
					{
						$lc = $e->xpath('gml:lowerCorner');
						$uc = $e->xpath('gml:upperCorner');
						$lc = explode(" ",$lc[0]);
						$uc = explode(" ",$uc[0]);
						if (is_numeric($lc[0]))
						{
							$ymin = $lc[0];
							$ymax = $uc[0];
							$xmin = $lc[1];
							$xmax = $uc[1];
							if ($ymin !="")
							{$env = array($xmin,$ymin,$xmax,$ymax);}
						}
					}
				}
			}
			if ($tipog == "geo")
			{
				if ($item->xpath('geo:lon'))
				{$x = $item->xpath('geo:lon');}
				else
				{$x = $item->xpath('geo:long');}
				$y = $item->xpath('geo:lat');
				$env = array($y[0],$x[0]);
			}
			if ($tipog == "georsspoint")
			{
				$temp = $item->xpath('georss:point');
				$env = array( explode(" ",$temp[0]) );
			}
			if (count($env) > 0)
			{
				$resultado[] = array($item->title,$item->link,$item->description,$item->category,$env);
			}
		}
		//cria o shapefile com os dados
		if (count($resultado) > 0)
		{
			//para manipular dbf
			if (file_exists($this->locaplic."/pacotes/phpxbase/api_conversion.php"))
			require_once ($this->locaplic."/pacotes/phpxbase/api_conversion.php");
			else
			require_once ("../pacotes/phpxbase/api_conversion.php");
			$diretorio = dirname($this->arquivo);
			$tipol = MS_SHP_POLYGON;
			if ($tipog != "envelope"){$tipol = MS_SHP_POINT;}
			$novonomelayer = nomeRandomico(10)."georss";
			$nomeshp = $diretorio."/".$novonomelayer;
			$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
			$novoshpf->free();
			$def[] = array("titulo","C","254");
			$def[] = array("link","C","254");
			$def[] = array("desc","C","254");
			$def[] = array("categoria","C","254");
			$db = xbase_create($nomeshp.".dbf", $def);
			$dbname = $nomeshp.".dbf";
			$reg = array();
			$novoshpf = ms_newShapefileObj($nomeshp.".shp", -2);
			//acrescenta os shapes
			foreach ($resultado as $r)
			{
				$pts = $r[4];
				if ($tipol == MS_SHP_POLYGON)
				{
					$shp = ms_newShapeObj(MS_SHP_POLYGON);
					$linha = ms_newLineObj();
					$linha->addXY($pts[0],$pts[3]);
					$linha->addXY($pts[2],$pts[3]);
					$linha->addXY($pts[2],$pts[1]);
					$linha->addXY($pts[0],$pts[1]);
					$linha->addXY($pts[0],$pts[3]);
				}
				else
				{
					$shp = ms_newShapeObj(MS_SHP_POINT);
					$linha = ms_newLineObj();
					$linha->addXY($pts[1],$pts[0]);
				}
				$shp->add($linha);
				$novoshpf->addShape($shp);
				$reg = array($r[0],$r[1],$r[2],$r[3]);
				xbase_add_record($db,$reg);
				$reg = array();
				$linha->free();
			}
			xbase_close($db);
			$novoshpf->free();
			if ($tipol == MS_SHP_POINT)
			{$tipol = MS_LAYER_POINT;}
			if ($tipol == MS_SHP_POLYGON)
			{$tipol = MS_LAYER_POLYGON;}
			if ($tipol == MS_SHP_LINE)
			{$tipol = MS_LAYER_LINE;}
			$layer = criaLayer($this->mapa,$tipol,MS_DEFAULT,"GeoRSS","SIM");
			$layer->set("data",$nomeshp.".shp");
			$layer->set("name",basename($nomeshp));
			$layer->setmetadata("DOWNLOAD","sim");
			$layer->setmetadata("TEMALOCAL","SIM");
			if($tipol == MS_LAYER_POLYGON)
			{
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$estilo->set("symbolname","p4");
				$estilo->set("size",5);		
				$cor = $estilo->color;
				$cor->setrgb(255,0,0);
				$coro = $estilo->outlinecolor;
				$coro->setrgb(255,0,0);				
			}
			//$layer->set("transparency",50);
			$layer->setmetadata("nomeoriginal",basename($nomeshp));
			return("ok");
		}
		return("erro");
	}
/*
Method: adicionaTemaSHP

Adiciona um tema a partir de um arquivo shape file armazenado no servidor de arquivos.

Parameters:
$arq - Nome do shape file.
*/
	function adicionaTemaSHP($arq)
	{
		if (file_exists($arq))
		{
			$s = ms_newShapefileObj($arq,-1);
			$shape = $s->getShape(0);
			$t = $shape->type;
			$tipo = MS_LAYER_POLYGON;
			if ($t == 0)
			{$tipo = MS_LAYER_POINT;}
			if ($t == 1)
			{$tipo = MS_LAYER_LINE;}
			$layer = criaLayer($this->mapa,$tipo,MS_DEFAULT,basename($arq),"SIM");
			$layer->set("data",$arq);
			$layer->set("name",basename($arq));
			$layer->setmetadata("DOWNLOAD","nao");
			$layer->setmetadata("TEMALOCAL","NAO");
			$layer->setmetadata("nomeoriginal",basename($arq));
		}
		return("ok");
	}
/*
Method: adicionaTemaIMG

Adiciona um tema a partir de um arquivo imagem armazenado no servidor de arquivos.

Parameters:
$arq - Nome do arquivo.
*/
	function adicionaTemaIMG($arq)
	{
		if (file_exists($arq))
		{
			$layer = criaLayer($this->mapa,MS_LAYER_RASTER,MS_DEFAULT,basename($arq),"SIM");
			$layer->set("data",$arq);
			$layer->set("name",basename($arq));
			$layer->setmetadata("DOWNLOAD","nao");
			$layer->setmetadata("TEMALOCAL","NAO");
		}
		return("ok");
	}
}
?>