<?php
/*
Title: classe_legenda.php

Manipula&ccedil;&atilde;o da legenda.

Cria legenda, edita simbolos, etc.

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

i3geo/classesphp/classe_legenda.php
*/
/*
Classe: Legenda

*/
class Legenda
{
	/*
	Variavel: $mapa

	Objeto mapa
	*/
	protected $mapa;
	/*
	Variavel: $arquivo

	Arquivo map file
	*/
	protected $arquivo;
	/*
	Variavel: $layer

	Objeto layer
	*/
	protected $layer;
	/*
	Variavel: $nome

	Nome do layer
	*/
	protected $nome;
	/*
	Variavel: $grupo

	Array com os temas do grupo, se houver
	*/
	protected $grupo;
	/*
	Variavel: $visiveis

	Temas do grupo que s&atilde;o vis&iacute;veis em fun&ccedil;&atilde;o da escala
	*/
	protected $visiveis;
	/*
	Variavel: $indices

	Indices dos layers do grupo
	*/
	protected $indices;
	/*
	Variavel: $templateleg

	Template da legenda
	*/
	protected $templateleg;
	/*
	Variavel: $localaplicacao

	Localiza&ccedil;&atilde;o da aplica&ccedil;&atilde;o
	*/
	protected $localaplicacao;
	/*
	Variavel: $v

	Vers&atilde;o atual do Mapserver (primeiro d&iacute;gito)
	*/
	public $v;
/*
Function: __construct

Cria um objeto Legenda

parameters:

$map_file - Endere&ccedil;o do mapfile no servidor.

$locaplic - localiza&ccedil;&atilde;o do I3Geo no servidor

$tema - nome do tema

$template - nome do template para processar a legenda
*/

	function __construct($map_file="",$locaplic="",$tema="",$template="")
	{
  		//error_reporting(E_ALL);
  		if(file_exists($locaplic."/funcoes_gerais.php"))
  		include_once($locaplic."/funcoes_gerais.php");
  		else
  		include_once("funcoes_gerais.php");
		$this->v = versao();
		$this->v = $this->v["principal"];
		$this->localaplicacao = $locaplic;
  		if($map_file == "")
		{return;}
		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
   		if($tema != "" && @$this->mapa->getlayerbyname($tema))
  		{
  			$this->layer = $this->mapa->getlayerbyname($tema);
  			$this->nome = $tema;
			$vermultilayer = new vermultilayer();
			$vermultilayer->verifica($map_file,$tema);
			if ($vermultilayer->resultado == 1) // o tema e multi layer
			{
				$ls = $vermultilayer->temas;
				$this->visiveis = $vermultilayer->temasvisiveis;
			}
			else
			{
				$ls[] = $tema;
				$this->visiveis = array($tema);
			}
			$this->grupo = $ls;
			foreach ($ls as $l)
			{
				$t = $this->mapa->getlayerbyname($l);
				$this->indices[] = $t->index;
			}
  		}
  		if ($template == ""){$template="legenda.htm";}
  		if(file_exists($template))
  		{
  			$this->templateleg = $template;
  			return;
  		}
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$this->templateleg = $locaplic."\\aplicmap\\".$template;}
		else
		{$this->templateleg = $locaplic."/aplicmap/".$template;}
	}
/*
function: salva

Salva o mapfile atual
*/
 	function salva()
 	{
	  	if (connection_aborted()){exit();}
	  	$this->recalculaSLD();
		$this->mapa->save($this->arquivo);
	}
/*
function: recalculaSLD

Constrói o SLD que &eacute; aplicado ao metadata wms_sld_body. O SLD resultante &eacute; baseado nas defini&ccedil;&otilde;es das classes existentes no layer
*/
	function recalculaSLD(){
		if($this->layer->classitem != "" && $this->layer->connectiontype == 7 && $this->layer->numclasses > 0){
			$tipotemp = $this->layer->type;
			$tiporep = $this->layer->getmetadata("tipooriginal");
			$this->layer->set("type",MS_LAYER_POLYGON);
			if ($tiporep == "linear")
			{$this->layer->set("type",MS_LAYER_LINE);}
			if ($tiporep == "pontual")
			{$this->layer->set("type",MS_LAYER_POINT);}
			$this->layer->set("status",MS_DEFAULT);
			$this->layer->setmetadata("wms_sld_body","");
			$sld = $this->layer->generateSLD();
			if($sld != "")
			{$this->layer->setmetadata("wms_sld_body",str_replace('"',"'",$sld));}
			$this->layer->set("type",$tipotemp);
		}
	}

/*
function: criaLegenda

Gera a legenda processando o template HTML definido na constru&ccedil;&atilde;o da classe.

Se o tema for um WMS ou se o metadata legendaimg estiver definido, executa $this->tabelaLegenda

Return:

string com a legenda HTML
*/
	function criaLegenda()
	{
		$l = "";
		$numlayers = $this->mapa->numlayers;
		if($this->nome != "")
		{
			//verifica se &eacute; wms ou se o metadata legendaimg est&aacute; definido
			$c = $this->layer->connectiontype;
			if ($c == 7 || $this->layer->getmetadata("legendaimg") != "")
			{
				return($this->tabelaLegenda());
			}
			for ($i=0;$i < $numlayers;++$i)
			{
				$la = $this->mapa->getlayer($i);
				if ($la->name != $this->nome)
				{$la->set("status",MS_OFF);}
				if ($la->group == $this->nome)
				{$la->set("status",MS_DEFAULT);}
			}
			$this->layer->set("status",MS_DEFAULT);
		}
		$desligar = array();
		$conta = 0;
		$desligar = array();
		for ($i=0;$i < $numlayers;++$i)
		{
			$la = $this->mapa->getlayer($i);
			if (strtoupper($la->getmetadata("ESCONDIDO")) == "SIM")
			{$la->set("status",MS_OFF);}
			if($la->status == MS_DEFAULT)
			{
				$nc = $la->numclasses;
				for ($c = 0;$c < $nc;$c++)
				{
					$classe = $la->getclass($c);
					if($classe->status == MS_OFF)
					{$desligar[] = $conta;}
					$conta = $conta + 1;
				}
			}
		}
		$legenda = $this->mapa->legend;
		$legenda->set("template",$this->templateleg);
		$tmparray["my_tag"] = "value_of_my_tag";
		if(!$l = @$this->mapa->processlegendtemplate($tmparray))
		{return ("erro");}
		if (function_exists("mb_convert_encoding"))
		{$l = mb_convert_encoding($l,"UTF-8","ISO-8859-1");}
		return (array("legenda"=>$l,"desativar"=>$desligar));
	}
/*
function: legendaGrafica

Desenha a imagem da legenda.

return:
string de variaveis no formato javascript que permitem montar a legenda.
*/
	function legendaGrafica()
	{
		$numlayers = $this->$mapa->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$layer = $this->$mapa->getlayer($i);
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
		$nomeImagem = nomeRandomico();
		$imgo = $this->mapa->drawlegend();
		if($imgo->imagepath == "")
		{echo "Erro IMAGEPATH vazio";exit;}
		$nomer = ($imgo->imagepath)."leg".$nomeImagem.".png";
		$imgo->saveImage($nomer);
		$nomer = ($imgo->imageurl).basename($nomer);
		return("var legimagem='".$nomer."';var legwidth=".$imgo->width.";var legheight=".$imgo->height.";var legpath='".$imgo->imagepath."';var legurl='".$imgo->imageurl."'");
	}
/*
function: tabelaLegenda

Cria elementos para construir uma legenda no formato de tabela em HTML.

Utilizado na fun&ccedil;&atilde;o de edi&ccedil;&atilde;o de legenda e legenda de WMS

parameters:

totaliza - sim|nao indica se os totais de elementos devem ser acrescentados ao nome da classe

return:
array
*/
	function tabelaLegenda($totaliza="nao")
	{
		$linhas = array();
		foreach ($this->visiveis as $l)
		{
			$layer = $this->mapa->getlayerbyname($l);
			//verifica se &eacute; wms ou wfs
			$c = $layer->connectiontype;

			$s = $layer->getmetadata("wms_sld_url");
			$im = $layer->getmetadata("legendaimg");
			$nc = $layer->numclasses;

			//
			//se for wms e tiver classes define o tipo de layer para poder gerar a legenda corretamente
			//
			if($c == 7 && $nc > 0){
				$tipotemp = $layer->type;
				$tiporep = $layer->getmetadata("tipooriginal");
				$layer->set("type",MS_LAYER_POLYGON);
				if($tiporep == "linear")
				{$layer->set("type",MS_LAYER_LINE);}
				if ($tiporep == "pontual")
				{$layer->set("type",MS_LAYER_POINT);}
			}
			//
			//se for WMS e n&atilde;o tiver classes, tenta pegar a legenda via requisi&ccedil;&atilde;o WMS
			//
			if ($nc == 0 && ($c == 7 || $im != ""))
			{
				if($c == 7){
					$con = $layer->connection;
					$ver = $layer->getmetadata("wms_server_version");
					$lwms = $layer->getmetadata("wms_name");
					$f = $layer->getmetadata("wms_formatlist");
					$f = explode(",",$f);
					$f = $f[0];
					$imgLeg = $con."&request=GetLegendGraphic&version=".$ver."&service=wms&layer=".$lwms."&format=".$f."&SLD=".$s;
					if ($layer->getmetadata("legendawms") != "")
					{$imgLeg = $layer->getmetadata("legendawms");}
				}
				else
				{$imgLeg = $im;}
				$linhas[] = array("tema"=>$l,"idclasse"=>"","nomeclasse"=>"","expressao"=>"","expressao"=>"","imagem"=>$imgLeg);
			}
			else
			{
				for ($c = 0;$c < $nc;$c++)
				{
					$classe = $layer->getclass($c);
					$imgi = $classe->createlegendicon(30,15);
					$classe->drawlegendicon(30,15,$imgi,5,5);
					$nomes = nomeRandomico(12);
					$nomer = ($imgi->imagepath)."icone".$nomes.".png";
					$imgi->saveImage($nomer);
					$i = ($imgi->imageurl).basename($nomer);
					$nomeclasse = $classe->name;
					if (function_exists("mb_convert_encoding"))
					{$nomeclasse = mb_convert_encoding($nomeclasse,"UTF-8","ISO-8859-1");}
					$nomeexp = $classe->getExpressionString();
					if (function_exists("mb_convert_encoding"))
					{$nomeexp = mb_convert_encoding($nomeexp,"UTF-8","ISO-8859-1");}
					$linhas[] = array("tema"=>$l,"idclasse"=>$c,"nomeclasse"=>$nomeclasse,"expressao"=>$nomeexp,"imagem"=>$i,"proc"=>"");
				}
				if (($totaliza=="sim") && ($nc > 1))
				{
					$layer->set("template","none.htm");
					$sopen = $layer->open();
					if($sopen == MS_FAILURE){return "erro";}
					$itens = $layer->getitems();
					$total = 0;
					$nreg = array();
					for ($c = 0;$c < $nc;$c++)
					{
						$exp = $linhas[$c]["expressao"];
						if($exp !== "")
						{
							if($this->layer->connectiontype == MS_POSTGIS)
							{
								$exp = str_replace("eq"," = ",$exp);
								$exp = str_replace("ne"," != ",$exp);
								$exp = str_replace("lt"," < ",$exp);
								$exp = str_replace("gt"," < ",$exp);
								$exp = str_replace("(","",$exp);
								$exp = str_replace(")","",$exp);
								$exp = str_replace("'[","",$exp);
								$exp = str_replace("]'","",$exp);
								$exp = str_replace("' [","",$exp);
								$exp = str_replace("] '","",$exp);
								$exp = str_replace("and"," and ",$exp);
								$exp = str_replace("or"," or ",$exp);
								$exp = str_replace("[","",$exp);
								$exp = str_replace("]","",$exp);
							}
							$teste = $layer->queryByAttributes($itens[0], $exp, 1);
						}
						else
						{$teste = 0;}
						if ($teste == 0)
						{
							$n = $layer->getNumResults();
							$nreg[] = $n;
						}
						else {$nreg[] = "erro";}
						$total = $total + $n;
					}
					$layer->close();
					for ($c = 0;$c < $nc;$c++)
					{
						$linhas[$c]["nomeclasse"] = $linhas[$c]["nomeclasse"]." - n=".$nreg[$c]."(".(round(($nreg[$c] * 100 / $total)))."%)";
						$linhas[$c]["nreg"] = $nreg[$c];
						$linhas[$c]["totalreg"] = $total;
					}
				}
				if ($layer->type == MS_LAYER_RASTER && $nc == 1)
				{
					$proc = "";
					$linhas = array();
					if($layer->num_processing > 0){$proc = $layer->getProcessing();}
					if($layer->type == MS_LAYER_RASTER && $proc == "")
					{
						$proc = array("RESAMPLE=NEAREST");
					}
					$linhas[] = array("tema"=>$l,"idclasse"=>"","nomeclasse"=>"","expressao"=>"","imagem"=>"","proc"=>$proc);
				}
			}
		}
		return $linhas;
	}
/*
function: excluiEstilo

Exclui um estilo de uma classe.
*/
	function excluiEstilo($classe,$estilo)
	{
		if(!$this->layer){return "erro";}
		$classe = $this->layer->getclass($classe);
		$classe->deletestyle($estilo);
		$this->layer->removeMetaData("cache");
		return "ok";
	}
/*
function: adicionaEstilo

Adiciona um estilo em uma classe.

return:
objeto estilo
*/
	function adicionaEstilo($classe,$estilo)
	{
		if(!$this->layer){return "erro";}
		$classe = $this->layer->getclass($classe);
		$estilo = $classe->getstyle($estilo);
		$e = ms_newStyleObj($classe,$estilo);
		$this->layer->removeMetaData("cache");
		return($e);
	}
/*
function: sobeEstilo


Sobe um estilo na ordem de desenho de uma classe.

parameters:
$classe - &Iacute;ndice da classe.
$estilo - &Iacute;ndice do estilo de uma classe que ser&aacute; clonado.
*/
	function sobeEstilo($classe,$estilo)
	{
		if(!$this->layer){return "erro";}
		$classe = $this->layer->getclass($classe);
		$classe->movestyleup($estilo);
		$this->layer->removeMetaData("cache");
	}
/*
function: desceEstilo

Desce um estilo na ordem de desenho de uma classe.

parameters:
$classe - &Iacute;ndice da classe.

$estilo - &Iacute;ndice do estilo de uma classe que ser&aacute; clonado.
*/
	function desceEstilo($classe,$estilo)
	{
		if(!$this->layer){return "erro";}
		$classe = $this->layer->getclass($classe);
		$classe->movestyledown($estilo);
		$this->layer->removeMetaData("cache");
	}
/*
function: listaSimbolos

Retorna uma lista de s&iacute;mbolos clic&aacute;veis no formato HTML.

Para cada tipo de simbologia deve haver um arquivo .map com as defini&ccedil;&otilde;es b&aacute;sicas.

Todos os s&iacute;mbolos do arquivo symbols/simbolos ser&atilde;o retornados como imagens.

parameters:

$tipo - Tipo de representa&ccedil;&atilde;o do s&iacute;mbolo, 0 pontos, 1 linhas e 2 pol&iacute;gonos.

$dir_tmp - Diretório tempor&aacute;rio do mapserver.

$imgdir - Diretório tempor&aacute;rio das imagens.

$onclick - Fun&ccedil;&atilde;o que ser&aacute; inclu&iacute;da no HTML no evento onclick sobre o s&iacute;mbolo

$tamanho - Tamanho (size) do s&iacute;mbolo

$forca {boolean} - forca a exclusao dos simbolos atualmente em cache

return:

String no formato HTML com as imagens dos s&iacute;mbolos
*/
	function listaSimbolos($tipo,$dir_tmp,$imgdir,$onclick,$tamanho=8,$width=1,$forca=false)
	{
		$versao = versao();
		$versao = $versao["principal"];
		error_reporting(E_ALL);
		if ($tipo == 3){$tipo = 2;} //tipo raster
		if($imgdir == "")
		{$dir = $dir_tmp;}
		else
		{$dir = $dir_tmp."/".$imgdir;}
		if($forca == true){
			unlink($dir."/simbolos".$tipo.".inc");
		}
		if (!file_exists($dir."/simbolos".$tipo.".inc"))
		{
			$f = fopen($dir."/simbolos".$tipo.".inc","w");
			if ($tipo == 2){$t="simpolv".$versao.".map";}
			if ($tipo == 0){$t="simptv".$versao.".map";}
			if ($tipo == 1){
				$t="simlinv".$versao.".map";
				$tamanho = $tamanho / 4;
			}
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{$mapatemp = ms_newMapObj($this->localaplicacao."\\aplicmap\\".$t);}
			else
			{$mapatemp = ms_newMapObj($this->localaplicacao."/aplicmap/".$t);}
			$ins = "";
			$l = $mapatemp->getlayer(0);
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{$novoss = dirname($this->mapa->symbolsetfilename)."\\".basename($mapatemp->symbolsetfilename);}
			else
			{$novoss = dirname($this->mapa->symbolsetfilename)."/".basename($mapatemp->symbolsetfilename);}
			$this->mapa->setsymbolset($novoss);
			$ns = $this->mapa->getnumsymbols();
			for ($i=0;$i < $ns;++$i)
			{
				$oSymbol = $this->mapa->getSymbolObjectById($i);
				$nomes = $oSymbol->name;
				if($nomes == "")
				{$nomes = $i;}
				$adiciona = ms_newLayerObj($this->mapa, $l);
				$nomel = $l->name;
				$tematemp= $this->mapa->getlayerbyname($nomel);
				$c = $tematemp->getClass(0);
				$e = $c->getstyle(0);
				$e->set("symbolname",$nomes);
				$e->set("size",$tamanho);
				$e->set("width",$width);
				$ico = $c->createLegendIcon(40,40);
				$nimg = $ico->saveWebImage();
				$pat = $this->mapa->web->imageurl;
				$ins .= "<img src='".$nimg."' style='cursor:pointer;border: 5px solid #FFFFFF' title=".$nomes." onclick='".$onclick."'>";
			}
			fwrite($f,"<?php \$res = \"".$ins."\";?>");
			fclose($f);
			//copy ($dir."/simbolos".$tipo.".inc",$dir_tmp."/comum/simbolos".$tipo.".inc");
			return $ins;
		}
		else
		{
			$res = "";
			include_once $dir."/simbolos".$tipo.".inc";
			return $res;
		}
	}
/*
function: pegaParametros

Retorna uma lista com par&acirc;metros sobre cada estilo de uma classe.

parameters:
$classe - &Iacute;ndice da classe.

return:
string com o tipo do layer,id do estilo,outlinecolor,backgroundcolor,color,symbolname,size|
*/
	function pegaParametros($classe)
	{
		if(!$this->layer){return "erro";}
		$tipoLayer = $this->layer->type;
		$classe = $this->layer->getclass($classe);
		$numestilos = $classe->numstyles;
		for ($i=0;$i<$numestilos;++$i)
		{
			$linha = array();
			$estilo = $classe->getstyle($i);
			$linha[] = $i;
			$linha[] = corRGB($estilo->outlinecolor);
			$linha[] = corRGB($estilo->backgroundcolor);
			$linha[] = corRGB($estilo->color);
			$linha[] = $estilo->symbolname;
			$linha[] = $estilo->size;
			$linha[] = $estilo->opacity;
			if($this->v == 6){
				$linha[] = $estilo->width;
				$s = $estilo->symbol;
				$linha[] = implode(" ",$s->getPatternArray);
			}
			else{
				$linha[] = "";
				$linha[] = "";
			}
			$linhas[] = $tipoLayer."#".implode("#",$linha);
		}
		//retorna tipo do layer,id do estilo,outlinecolor,backgroundcolor,color,symbolname,size
		return implode("|",$linhas);
	}
/*
function: aplicaParametro

Aplica um par&acirc;metro em um estilo de uma classe.

parameters:

$classe - &Iacute;ndice da classe.

$estilo - &Iacute;ndice do estilo que ser&aacute; alterado.

$outlinecolor - Cor do contorno.

$backgroundcolor - Cor do fundo.

$color - Cor da frente.

$symbolname - Nome do s&iacute;mbolo.

$size - Tamanho que ser&aacute; aplicado ao s&iacute;mbolo.

$opacidade - Opacidade
*/
	function aplicaParametro($classe,$estilo,$outlinecolor,$backgroundcolor,$color,$symbolname,$size,$opacidade,$width,$pattern,$angle)
	{
		if(!$this->layer){return "erro";}
		if(!empty($pattern))
		{$pattern = str_replace(","," ",$pattern);}
		$classe = $this->layer->getclass($classe);
		//isso &eacute; necess&aacute;rio pq o mapserver n&atilde;o consegue apagar o nome de um estilo
		if(isset($symbolname) && ($symbolname == "" || $symbolname == "0")){
			$classe->deletestyle($estilo);
			$estilo = ms_newStyleObj($classe);
		}
		else{
			$estilo = $classe->getstyle($estilo);
		}
		if (isset($outlinecolor))
		{
			$cor = $estilo->outlinecolor;
			$nc = explode(",",$outlinecolor);
			$cor->setRGB($nc[0],$nc[1],$nc[2]);
		}
		if (isset($backgroundcolor))
		{
			$cor = $estilo->backgroundcolor;
			$nc = explode(",",$backgroundcolor);
			$cor->setRGB($nc[0],$nc[1],$nc[2]);
		}
		if (isset($color))
		{
			$cor = $estilo->color;
			$nc = explode(",",$color);
			$cor->setRGB($nc[0],$nc[1],$nc[2]);
		}
		if((isset($symbolname)) && ($symbolname != ""))
		{
			if(is_numeric($symbolname))
			{$estilo->set("symbol",$symbolname);}
			else
			{$estilo->set("symbolname",$symbolname);}
		}
		if ((isset ($size)) && ($size != "-1"))
		{$estilo->set("size",$size);}
		if ((isset ($width)) && ($width != "-1") && ($this->v == 6))
		{$estilo->set("width",$width);}
		if ((isset ($pattern)) && ($pattern != "-1") && ($this->v == 6) && ($pattern != ""))
		{$estilo->updatefromstring("STYLE PATTERN ".$pattern." END");}
		if(isset($opacidade))
		{$estilo->set("opacity",$opacidade);}
		if(isset($angle))
		{
			$estilo->set("angle",$angle);
		}
		if ($this->layer->getmetadata("sld") != "")
		{
			$sld = $this->layer->getmetadata("sld");
			reSLD($this->arquivo,$this->nome,$sld);
		}
		$this->layer->setMetaData("cache","");
		return "ok";
	}
/*
function: pegaParametrosLegImg

Pega os par&acirc;metros da legenda embebida no mapa.

return:

array - "imagecolor"=>$imagecolor,"transparent"=>transparent,"position"=>$position,"status"=>$status,"outlinecolor"=>$outlinecolor,"keyspacingy"=>$keyspacingy,"keyspacingx"=>$keyspacingx,"keysizey"=>$keysizey,"keysizex"=>$keysizex,"heigt"=>$height,"width"=>$width

*/
	function pegaParametrosLegImg()
	{
		error_reporting(E_ALL);
		$legenda = $this->mapa->legend;
		$height = $legenda->height;
		$width = $legenda->width;
		$keysizex = $legenda->keysizex;
		$keysizey = $legenda->keysizey;
		$keyspacingx = $legenda->keyspacingx;
		$keyspacingy = $legenda->keyspacingy;
		$outlinecolor = corRGB($legenda->outlinecolor); //Color of outline of box, -1 for no outline
		$status = $legenda->status; //MS_ON, MS_OFF, MS_EMBED
		$position = $legenda->position;
		if ($position < 99){$position = "10".$position;}
		$transparent = 100;
		$imagecolor = corRGB($legenda->imagecolor);
		$label = $legenda->label;
		$font = $label->font;
		if($font == MS_BITMAP)
		{
			$l = $label->size;
			if ($l == MS_TINY){$t = 5;}
			if ($l == MS_SMALL){$t = 7;}
			if ($l == MS_MEDIUM){$t = 10;}
			if ($l == MS_LARGE){$t = 12;}
			if ($l == MS_GIANT){$t = 14;}
			$labelsize = $t;
		}
		else
		$labelsize = $label->size;

		$tipofonte = $label->type;
		return(array("tipofonte"=>$tipofonte,"font"=>$font,"imagecolor"=>$imagecolor,"transparent"=>transparent,"position"=>$position,"status"=>$status,"outlinecolor"=>$outlinecolor,"keyspacingy"=>$keyspacingy,"keyspacingx"=>$keyspacingx,"keysizey"=>$keysizey,"keysizex"=>$keysizex,"height"=>$height,"width"=>$width,"labelsize"=>$labelsize));
	}
/*
function: aplicaParametrosLegImg

Aplica os par&acirc;metros da legenda embebida no mapa.

parameters:

$imagecolor

$position

$status

$outlinecolor

$keyspacingy

$keyspacingx

$keysizey

$keysizex

$heigt

$width
*/
	function aplicaParametrosLegImg($fonte,$imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize)
	{
		$legenda = $this->mapa->legend;
		$legenda->set("height",$height);
		$legenda->set("width",$width);
		$legenda->set("keysizex",$keysizex);
		$legenda->set("keysizey",$keysizey);
		$legenda->set("keyspacingx",$keyspacingx);
		$legenda->set("keyspacingy",$keyspacingy);
		$corres = $legenda->outlinecolor;
		$cor = explode(",",$outlinecolor);
		$corres->setRGB($cor[0],$cor[1],$cor[2]);
		if ($status == 3)
		{$legenda->set("status",MS_EMBED);} //MS_ON, MS_OFF, MS_EMBED
		else
		{$legenda->set("status",MS_OFF);}
		$verifica = $legenda->position;
		if ($verifica < 100)
		{
			if($position > 99){$position = 3;}
		}
		$legenda->set("position",$position);
		$corres = $legenda->imagecolor;
		$cor = explode(",",$imagecolor);
		$corres->setRGB($cor[0],$cor[1],$cor[2]);
		$label = $legenda->label;

		if ($fonte != "bitmap")
		{
			$label->set("type",MS_TRUETYPE);
			$label->set("font",$fonte);
			$label->set("size",$labelsize);
		}
		else
		{
			$label->set("type",MS_BITMAP);
			$t = MS_TINY;
			if ($labelsize > 5 ){$t = MS_TINY;}
			if ($labelsize >= 7 ){$t = MS_SMALL;}
			if ($labelsize >= 10 ){$t = MS_MEDIUM;}
			if ($labelsize >= 12 ){$t = MS_LARGE;}
			if ($labelsize >= 14 ){$t = MS_GIANT;}
			$label->set("size",$t);
		}
		return("ok");
	}
}
?>