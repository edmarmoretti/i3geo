<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css"
	href="../../css/i3geo_ferramentas45.css">
<title></title>
<style>
td {
	text-align: left
}
</style>
</head>
<body style="overflow: auto;">
	<div style="text-align: center; width: 600px">
		<p>
			<img src="../../imagens/i3geo1.jpg" />
		</p>
		<p style='font-size: 16px'>Estat&iacute;stica do sistema de administra&ccedil;&atilde;o</p>
	</div>
	<div style="text-align: left; width: 600px">
		<?php
		/*
		 Title: Estat&iacute;sticas do banco de dados de administra&ccedil;&atilde;o

		Gera uma p&aacute;gina HTML com dados que descrevem a situa&ccedil;&atilde;o atual do banco de dados de administra&ccedil;&atilde;o.

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

		i3geo/admin/php/estatisticas.php

		*/
		include_once("admin.php");
		$totaltemas = count(pegaDados("select * from ".$esquemaadmin."i3geoadmin_temas"));
		$temasvalidos = pegaDados("select codigo_tema,nome_tema,download_tema,kml_tema,ogc_tema,link_tema,tags_tema from ".$esquemaadmin."i3geoadmin_temas where codigo_tema <> ''");
		$temasassocsubgrupos = pegaDados("select id_tema from ".$esquemaadmin."i3geoadmin_n3 group by id_tema");
		$nacessostema = pegaDados("select b.nome_tema,sum(a.nacessos) as soma,a.codigo_tema from ".$esquemaadmin."i3geoadmin_acessostema as a,".$esquemaadmin."i3geoadmin_temas as b where a.codigo_tema = b.codigo_tema and a.nacessos > 0 group by a.codigo_tema,b.nome_tema");
		$ntags = pegaDados("select nome from ".$esquemaadmin."i3geoadmin_tags");
		$totaltemasvalidos = count($temasvalidos);
		$codigostemas = array();
		$ncodigostemas = array();
		$nnomestemas = array();
		$ndownloadtemas = 0;
		$nkmltemas = 0;
		$nogctemas = 0;
		$nsemlinktemas = 0;
		$nsemtagstemas = 0;
		$nacessosmaiorqueum = count(pegaDados("select sum(nacessos) as soma from ".$esquemaadmin."i3geoadmin_acessostema where nacessos > 0 group by codigo_tema"));
		$nacessosmaiorquedez = count(pegaDados("select soma from (select sum(nacessos) as soma from ".$esquemaadmin."i3geoadmin_acessostema where nacessos > 0 group by codigo_tema) as soma where soma > 10"));
		$nacessosmaiorquecem = count(pegaDados("select soma from (select sum(nacessos) as soma from ".$esquemaadmin."i3geoadmin_acessostema where nacessos > 0 group by codigo_tema) as soma where soma > 100"));
		$temasacessos = array();
		error_reporting(0);
		foreach($temasvalidos as $tema){
			$ncodigostemas[$tema["codigo_tema"]]++;
			$nnomestemas[$tema["nome_tema"]]++;
			if(strtolower($tema["download_tema"]) == "sim")
			{
				$ndownloadtemas++;
			}
			if(strtolower($tema["kml_tema"]) != "nao")
			{
				$nkmltemas++;
			}
			if(strtolower($tema["ogc_tema"]) != "nao")
			{
				$nogctemas++;
			}
			if(strtolower($tema["link_tema"]) == "")
			{
				$nsemlinktemas++;
			}
			if($tema["tags_tema"] == "")
			{
				$nsemtagstemas++;
			}
			/*
			 if($tema["nacessos"] > 0)
			 {$nacessosmaiorqueum++;}
			if($tema["nacessos"] > 10)
			{$nacessosmaiorquedez++;}
			if($tema["nacessos"] > 100)
			{
			$nacessosmaiorquecem++;
			//$temasmaisdecem[] = $tema[nome_tema];
			}
			$temasacessos[$tema[nome_tema]] = $tema["nacessos"];
			*/
		}
		foreach($nacessostema as $tema){
			$temasacessos[$tema["nome_tema"]] = $tema["soma"];
		}
		$temasmaisdeum = array();
		foreach ($ncodigostemas as $n)
		{
			if($n > 1)
				$temasmaisdeum[] = $n;
		}
		$nomestemasmaisdeum = array();
		foreach ($nnomestemas as $n)
		{
			if($n > 1)
				$nomestemasmaisdeum[] = $n;
		}
		echo "<table>";
		echo "<tr><td><b>N&uacute;mero total de temas cadastrados: </b></td><td>$totaltemas</td><td></td></tr>";
		echo "<tr><td><b>N&uacute;mero total de temas v&aacute;lidos (c�digo diferente de vazio): </b></td><td>$totaltemasvalidos</td><td></td></tr>";
		echo "<tr><td><b>Temas v&aacute;lidos com c�digos duplicados: </b></td><td>".count($temasmaisdeum)."</td><td></td></tr>";
		echo "<tr><td><b>Temas v&aacute;lidos com nomes duplicados: </b></td><td>".count($nomestemasmaisdeum)."</td><td></td></tr>";
		echo "<tr><td><b>Temas associados a algum sub-grupo: </b></td><td>".count($temasassocsubgrupos)."</td><td></td></tr>";

		echo "<tr><td>Dos temas v&aacute;lidos:</td><td>&nbsp;</td><td></td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas sem link: </b></td><td>".$nsemlinktemas."</td><td>&nbsp;&nbsp;".round(($nsemlinktemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas sem tags: </b></td><td>".$nsemtagstemas."</td><td>&nbsp;&nbsp;".round(($nsemtagstemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas dispon&iacute;veis para download: </b></td><td>".$ndownloadtemas."</td><td>&nbsp;&nbsp;".round(($ndownloadtemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas dispon&iacute;veis como KML: </b></td><td>".$nkmltemas."</td><td>&nbsp;&nbsp;".round(($nkmltemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas dispon&iacute;veis como Web Service OGC: </b></td><td>".$nogctemas."</td><td>&nbsp;&nbsp;".round(($nogctemas * 100) / $totaltemasvalidos,2) ." %</td></tr>";

		echo "<tr><td>&nbsp;</td><td>&nbsp;</td><td></td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas com acesso maior que 0: </b></td><td>".$nacessosmaiorqueum."</td><td>&nbsp;&nbsp;".round(($nacessosmaiorqueum * 100) / $totaltemasvalidos,2) ." %</td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas com acesso maior que 10: </b></td><td>".$nacessosmaiorquedez."</td><td>&nbsp;&nbsp;".round(($nacessosmaiorquedez * 100) / $totaltemasvalidos,2) ." %</td></tr>";
		echo "<tr><td><b>N&uacute;mero de temas com acesso maior que 100: </b></td><td>".$nacessosmaiorquecem."</td><td>&nbsp;&nbsp;".round(($nacessosmaiorquecem * 100) / $totaltemasvalidos,2) ." %</td></tr>";

		echo "<tr><td>&nbsp;</td><td>&nbsp;</td><td></td></tr>";
		echo "<tr><td><b>N&uacute;mero de tags: </b></td><td>".count($ntags)."</td><td></td></tr>";

		echo "</table>";
		echo "<p><b>Acesos por tema</b></p>";
		arsort($temasacessos);
		$temasacessos2 = array_keys($temasacessos);
		for($i=0;$i<=count($temasacessos2);$i++)
		{
			if(mb_detect_encoding($temasacessos2[$i],'UTF-8, ISO-8859-1') == "UTF-8")
				echo "<p>".utf8_decode($temasacessos2[$i])." - ".$temasacessos[$temasacessos2[$i]]."</p>";
			else
				echo "<p>".$temasacessos2[$i]." - ".$temasacessos[$temasacessos2[$i]]."</p>";
		}
		echo "<pre>";
		echo "<hr>".date('l jS \of F Y h:i:s A');
		//var_dump($temasacessos);
?>
	</div>