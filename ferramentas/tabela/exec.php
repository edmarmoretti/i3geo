<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: INCLUISEL

Inclu&iacute; elementos em uma sele&ccedil;&atilde;o.

<Selecao->incluiSel>
*/
	case "INCLUISEL":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$retorno = $m->incluiSel($ids);
		//
		//&eacute; necess&aacute;rio obter os par&acirc;metros do mapa para remontar a &aacute;rvore de camadas
		//
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
/*
Valor: ESTATISTICA

Calcula estat&iacute;sticas b&aacute;sicas de uma tabela de um tema.

<Atributos->estatDescritivas>
*/
	case "ESTATISTICA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_atributos.php");
		$m = new Atributos($map_file,$tema,$locaplic,$ext);
		$retorno = $m->estatDescritivas($item,$exclui);
	break;
/*
Valor: GRAFICOPIZZA

Cria um gr&aacute;fico de pizza.

<graficoPizza>
*/
	case "GRAFICOPIZZA":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoPizza();
	break;
/*
Valor: GRAFICOESTRELA

Cria um gr&aacute;fico do tipo estrela.

<graficoEstrela>
*/
	case "GRAFICOESTRELA":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoEstrela();
	break;
/*
Valor: GRAFICOSCATTER

Cria um gr&aacute;fico de distribui&ccedil;&atilde;o de pontos.

<graficoScatter>
*/
	case "GRAFICOSCATTER":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoScatter();
	break;
/*
Valor: GRAFICOSCATTERBINS

Cria um gr&aacute;fico de distribui&ccedil;&atilde;o de pontos com agrupamento em pixels (bins).

<graficoScatterBins>
*/
	case "GRAFICOSCATTERBINS":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoScatterBins();
	break;
/*
Valor: GRAFICOLINHAS

Cria um gr&aacute;fico de linhas.

<graficoLinhas>
*/
	case "GRAFICOLINHAS":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoLinhas();
	break;
/*
Valor: GRAFICOHIST

Cria um gr&aacute;fico de histograma.

<graficoHist>
*/
	case "GRAFICOHIST":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoHist();
	break;
/*
Valor: GRAFICOBARRAS

Cria um gr&aacute;fico de barras.

<graficoBarras>
*/
	case "GRAFICOBARRAS":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		$retorno = graficoBarras();
	break;
/*
Valor: FUSAOGRAFICO

Faz a fus&atilde;o da imagem de um gr&aacute;fico com a imagem do mapa atual.

<fusaoGrafico>
*/
	case "FUSAOGRAFICO":
		include_once(dirname(__FILE__)."/../../classesphp/graficos.php");
		restauraCon($map_file,$postgis_mapa);
		include_once(dirname(__FILE__)."/../../classesphp/classe_imagem.php");
		if($map_file != "")
		{
			$mapa = ms_newMapObj($map_file);
			$imgo = $mapa->draw();
			$nome = ($imgo->imagepath).nomeRandomico().".png";
			$imgo->saveImage($nome);
			$imagem = ($imgo->imageurl).basename($nome);
		}
		$m = new Imagem(dirname($dir_tmp).$imagem);
		$i = $m->fundeIm(dirname($dir_tmp).$grafico);
		imagepng($i,dirname($dir_tmp).$imagem);
		$retorno = $imagem;
	break;
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>