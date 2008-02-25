<?php
/*
Title: Classes e estilos



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

File: i3geo/classesphp/classe_alteraclasse.php

19/6/2007
*/
/*
Class: Alteraclasse

Operações que alteram as classes da legenda de um tema existente no mapa.
As modificações permitem contruir novas legendas para cada tema.
*/
class Alteraclasse
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
	Variable: $layer
	
	Objeto layer
	*/
	protected $layer;
	/*
	Variable: $nome
	
	Nome do layer
	*/
	protected $nome;
/*
Function: __construct

Cria um objeto Alteraclasse 

parameters:

$map_file - Endereço do mapfile no servidor.

$tema - nome do tema
*/ 
	function __construct($map_file,$tema="")
	{
  		//error_reporting(E_ALL);
  		require_once("funcoes_gerais.php");
  		$this->mapa = ms_newMapObj($map_file);
  		$this->arquivo = $map_file;
 		$this->layer = $this->mapa->getlayerbyname($tema);
  		$this->nome = $tema;
	}
/*
function: salva

Salva o mapfile atual
 
*/	
 	function salva()
 	{
	  	if (connection_aborted()){exit();}
	  	$this->mapa->save($this->arquivo);
	}
/*
function: simbolounico

Elimina as classes existentes em um objeto layer mantendo apenas a primeira classe.
Todos os elementos passarão a ser desenhados conforme essa primeira classe, uma vez que a expressão de definição da classe passa a ser vazia.
*/
	function simbolounico()
	{
		$numclasses = $this->layer->numclasses;
		if ($numclasses > 0)
		{
			//elimina a expressão da primeira classe
			$classe0 = $this->layer->getClass(0);
			$classe0->setexpression("");
			$classe0->set("name"," ");
			//apaga todas as classes menos a primeira
			for ($i=1; $i < $numclasses; $i++)
			{
				$classe = $this->layer->getClass($i);
				$classe->set("status",MS_DELETE);
			}
		}
		return("ok");
	}
/*
function: alteraclasses

Altera as classes existentes em um objeto layer conforme a lista de índices, nomes e expressões definidas nos parâmetros passados como argumentos.

parameters:

$ids - lista de ids, separados por vírgula, que identificam as classes no layer

$nomes - lista com os novos nomes

$exps - lista com as novas expressões
*/
	function alteraclasses($ids,$nomes,$exps)
	{
		//prepara os arrays com os valores
		$ids = explode(";",$ids);
		$nomes = explode(";",$nomes);
		$exps = explode(";",$exps);
		//pega os layers existentes no array ids e armazena no array t
		for ($i=0; $i < count($ids); $i++)
		{
			$tx = explode("-",$ids[$i]);
			$t[] = $tx[0];
		}
		//elimina nomes de layers duplicados
		$t = array_unique($t);
		//elimina as classes existentes atualmente em cada layer
		foreach ($t as $tema)
		{
			$layer = $this->mapa->getlayerbyname($tema);
			$nc = $layer->numclasses;
			for($i=0;$i < $nc;$i++)
			{
				$class = $layer->getclass($i);
				$class->set("status",MS_DELETE);
			}
		}
		//acrescenta as classes definidas
		for ($i=0; $i < count($ids); $i++)
		{
			$layerc = explode("-",$ids[$i]); //nome do layer é o indice 0 do array
			$layer = $this->mapa->getlayerbyname($layerc[0]);
			$ncl = $layer->numclasses;
			if ($layerc[1] < $ncl)
			{
				$classe = $layer->getclass($layerc[1]);
				$classe->set("status",MS_DEFAULT);
				$classe->set("name",$nomes[$i]);
				$e = $exps[$i];
				$e = str_replace("\\","",$e);
				$e = str_replace('"',"'",$e);
				$classe->setexpression($e);
			}
		}
	}
/*
function: intervalosiguais

Cria classes em um objeto layer com intervalos iguais baseando-se em um item numérico na tabela de atributos com um número de classes fixos.

parameters:

$item - item da tabela de atributos

$nclasses - número de classes

$ignorar - valor que será ignorado na listagem final
*/
	function intervalosiguais($item,$nclasses,$ignorar)
	{
		$valores = pegaValores($this->mapa,$this->layer,$item,true,$ignorar);
		if (count($valores) > 0)
		{
			//calcula o menor valor e o maior valor
			$min = min($valores);
			$max = max($valores);
			$intervalo = ($max - $min) / $nclasses;
			$numclassesatual = $this->layer->numclasses;
			//apaga todas as classes existentes
			$classetemp = $this->layer->getClass(0);
			$estilotemp = $classetemp->getStyle(0);
			for ($i=0; $i < $numclassesatual; $i++)
			{
				$classe = $this->layer->getClass($i);
				$classe->set("status",MS_DELETE);
			}
			//adiciona as classes novas
			$intatual = $min;
			for ($i=0; $i < $nclasses; $i++)
			{
				if ($i == $nclasses - 1)
				{$expressao = "(([".$item."]>=".$intatual.")and([".$item."]<=".($intatual+$intervalo)."))";}
				else 
				{$expressao = "(([".$item."]>=".$intatual.")and([".$item."]<".($intatual+$intervalo)."))";}
				$nomeclasse = ">= ".$intatual." e < que ".($intatual+$intervalo);
				$intatual = $intatual + $intervalo;
				$classe = ms_newClassObj($this->layer);
				$novoestilo = ms_newStyleObj($classe);
				if ($this->layer->type == 0)
				{
					$novoestilo->set("symbolname","ponto");
					$novoestilo->set("size","6");
				}
				$ncor = $novoestilo->color;
				$ncor->setrgb((mt_rand(0,255)),(mt_rand(0,255)),(mt_rand(0,255)));
				$classe->setexpression($expressao);
				$classe->set("name",$nomeclasse);
				$classe->set("title",($this->layer->name)."+".$i);
			}
			return ("ok");
		}
		else
		{return ("erro. Nenhum valor numerico no item");}
	}
/*
function: quartis

Cria classes em um objeto layer com intervalos em quartis baseando-se em um item numérico na tabela de atributos com um número de classes fixos.

parameters:

$item - Item da tabela de atributos utilizado para gerar as classes.

$ignorar - valor que será ignorado na listagem final

Include:
<classe_estatistica.php>
*/
	function quartis($item,$ignorar)
	{
		$valores = pegaValores($this->mapa,$this->layer,$item,true,$ignorar);
		if (count($valores) > 0)
		{
			require_once("classe_estatistica.php");
			$estat = new estatistica();
			$estat->calcula($valores);
			$calc = $estat->resultado;
			$numclassesatual = $this->layer->numclasses;
			//apaga todas as classes existentes
			$classetemp = $this->layer->getClass(0);
			for ($i=0; $i < $numclassesatual; $i++)
			{
				$classe = $this->layer->getClass($i);
				$classe->set("status",MS_DELETE);
			}
			//adiciona as classes novas
			$expressao[] = "([".$item."]<=".($calc["quartil1"]).")";
			$expressao[] = "(([".$item."]>".($calc["quartil1"]).")and([".$item."]<=".($calc["quartil2"])."))";
			$expressao[] = "(([".$item."]>".($calc["quartil2"]).")and([".$item."]<=".($calc["quartil3"])."))";
			$expressao[] = "([".$item."]>".($calc["quartil3"]).")";
			$vcor = array(250,230,150,0);
			for ($i=0;$i < 4;$i++)
			{
				$classe = ms_newClassObj($this->layer);
				$novoestilo = ms_newStyleObj($classe);
				if ($this->layer->type == 0)
				{
					$novoestilo->set("symbolname","ponto");
					$novoestilo->set("size","6");
				}
				$classe->setexpression($expressao[$i]);
				$classe->set("name","Quartil ".($i+1)." ".$expressao[$i]);
				$ncor = $novoestilo->color;
				$ncor->setrgb(255,$vcor[$i],$vcor[$i]);
			}
			return ("ok");
		}
		else
		{return ("erro. Nenhum valor numerico no item");}
	}
/*
function: valorunico

Cria classes em um objeto layer baseando-se em um item na tabela de atributos.

Para cada ocorrência de um valor é acrescentada uma classe.

parameters:

$item - Item da tabela de atributos utilizado para gerar as classes.

$ignorar - valor que será ignorado na listagem final
*/
	function valorunico($item,$ignorar)
	{
		// pega valores
		$valoresu = array_unique(pegaValores($this->mapa,$this->layer,$item,false,$ignorar));
		// processa array com os valores
		rsort($valoresu);
		reset($valoresu);
		$nclassexist = $this->layer->numclasses;
		if ($nclassexist > count($valoresu))
		{$nclassexist = count($valoresu);}
		// cria classes
		$classes = array();
		$classpadrao = $this->layer->getClass(0);
		for ($i = 0; $i < $nclassexist; $i++)
		{$classes[$i] = $this->layer->getClass($i);}
		for ($i = 0; $i < $this->layer->numclasses; $i++) // apaga classes atuais
		{
			$cl = $this->layer->getClass($i);
			$cl->set("status",MS_DELETE);
		}
		for ($i = 0; $i < count($valoresu); $i++)
		{
			$classes[$i] = ms_newClassObj($this->layer);
			$newstyle = ms_newStyleObj($classes[$i]);
		}
		for ($i = 0; $i < count($valoresu); $i++)
		{
			$e = "('[".$item."]'eq'".$valoresu[$i]."')";
			$c = $classes[$i];
			$c->setexpression($e);
			$c->set("name",$valoresu[$i]);
			$estilo = $classes[$i]->getStyle(0);
			$ncor = $estilo->color;
			$ncor->setrgb((mt_rand(0,255)),(mt_rand(0,255)),(mt_rand(0,255)));
			if ($this->layer->type == 0) //tipo ponto
			{
				$estilo->set("symbolname","ponto");
				$estilo->set("size",6);
			}
			//$c->set("title",$tema."+".$i);
		}
		return("ok");
	}
/*
function: adicionaclasse

Adiciona uma nova classe em um objeto layer

A nova classe será uma cópia da classe 0.
*/
	function adicionaclasse()
	{
		$classe = $this->layer->getclass(0);
		$c = ms_newClassObj($this->layer, $classe);
		$classe = $this->layer->getclass(0);
		$nova = $classe->clone;
		return("ok");
	}
/*
function: alteraCoresClasses

Altera as cores das classes existentes em um objeto layer gerando uma paleta de cores de acordo com um valor inicial e final.

parameters:
$cori - cor inicial.

$corf - cor final.

Include:
<class.palette.php>
*/
	function alteraCoresClasses($cori,$corf)
	{
		include("class.palette.php");
		$cori = RGB2hex(explode(",",$cori));
		$corf = RGB2hex(explode(",",$corf));
		$numclasses = $this->layer->numclasses;
		$myPalette=new palette(array($cori,$corf),($numclasses + 1));
		$cores = $myPalette->colorRGB;
		for($i=0;$i<$numclasses;$i++)
		{
			$classe = $this->layer->getclass($i);
			$estilo = $classe->getstyle(0);
			$corpaleta = $cores[$i];
			if ($this->layer->type == MS_LAYER_LINE)
			{
				$cor = $estilo->outlinecolor;
				$cor->setrgb($corpaleta[0],$corpaleta[1],$corpaleta[2]);
			}
			$cor = $estilo->color;
			$cor->setrgb($corpaleta[0],$corpaleta[1],$corpaleta[2]);
		}
		return("ok");
	}
/*
function: inverteCoresClasses

Inverte as cores da legenda de um tema.
*/
	function inverteCoresClasses()
	{
		$numclasses = $this->layer->numclasses;
		for($i=0;$i<$numclasses;$i++)
		{
			$classe = $this->layer->getclass($i);
			$estilo = $classe->getstyle(0);
			$cor[] = $estilo->color;
		}
		$c = 0;
		for($i=($numclasses-1);$i>=0;$i--)
		{
			$classe = $this->layer->getclass($i);
			$estilo = $classe->getstyle(0);
			$ncor = $estilo->color;
			$ncor->setrgb($cor[$c]->red,$cor[$c]->green,$cor[$c]->blue);
			$c++;
		}
		return("ok");
	}
/*
function: calculaTamanhoClasses

Calcula o tamanho dos estilos das classes, alterando o tamanho do símbolo.
*/
	function calculaTamanhoClasses()
	{
		$numclasses = $this->layer->numclasses;
		for($i=0;$i<$numclasses;$i++)
		{
			$classe = $this->layer->getclass($i);
			$estilo = $classe->getstyle(0);
			$estilo->set("size",($i+1));
			if ($estilo->symbolname == "")
			{
				if ($this->layer->type == MS_LAYER_LINE)
				{$estilo->set("symbolname","linha");}
				if ($this->layer->type == MS_LAYER_POINT)
				{$estilo->set("symbolname","ponto");}
				if ($this->layer->type == MS_LAYER_POLYGON)
				{$estilo->set("symbolname","p4");}
			}
		}
		return("ok");
	}
/*
function: inverteStatusClasse

Inverte o status a uma classe.

Parameters:

$classe - id da classe

*/
	function statusClasse($classe,$status)
	{
		$classe = $this->layer->getclass($classe);
		$status = $classe->status;
		if ($status == MS_OFF)
		{$classe->set("status",MS_ON);}
		else
		{$classe->set("status",MS_OFF);}
	}
}
?>