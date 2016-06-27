<?php
define ( ONDEI3GEO, "../../.." );
include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
error_reporting ( 0 );
include "../../head.php";
?>
	<!--admin1/index.php -->
	<div class="container-fluid">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="../../init/index.php">i3Geo</a></li>
				<li><a href="../../index.php">Admin</a></li>
				<li>Ferramentas</li>
				<li class="active">Estatisticas</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12">
				<div class="well">
			<?php
			include("../../../admin/php/admin.php");
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

			$sql = "select codigo_tema,soma from (select a.codigo_tema, sum(nacessos) as soma from ".$esquemaadmin."i3geoadmin_acessostema as a,".$esquemaadmin."i3geoadmin_temas as b where a.codigo_tema = b.codigo_tema AND nacessos > 0 group by a.codigo_tema) as soma where soma >";

			$nacessosmaiorqueum = count(pegaDados($sql." 0"));
			$nacessosmaiorquedez = count(pegaDados($sql." 10"));
			$nacessosmaiorquecem = count(pegaDados($sql." 100"));

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

			echo "<h4>Totais</h4>";
			echo "<ul>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero total de temas cadastrados: <span class='badge'>$totaltemas</span></label></li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero total de temas v&aacute;lidos (c&oacute;digo diferente de vazio): <span class='badge'>$totaltemasvalidos</span></label></li>";
			echo "<li class='list-group-item'><label class='text-success'>Temas v&aacute;lidos com c&oacute;digos duplicados: <span class='badge'>".count($temasmaisdeum)."</span></label></li>";
			echo "<li class='list-group-item'><label class='text-success'>Temas v&aacute;lidos com nomes duplicados: <span class='badge'>".count($nomestemasmaisdeum)."</span></label></li>";
			echo "<li class='list-group-item'><label class='text-success'>Temas associados a algum sub-grupo: <span class='badge'>".count($temasassocsubgrupos)."</span></label></li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero de tags: <span class='badge'>".count($ntags)."</span></label></li>";
			echo "</ul>";
			echo "<h4>Dos temas v&aacute;lidos</h4>";
			echo "<ul>";
			echo "<li class='list-group-item'>
					<label class='text-success'>N&uacute;mero de temas sem link: <span class='badge'>".$nsemlinktemas."<span class='badge'>
					&nbsp;&nbsp;".round(($nsemlinktemas * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nsemlinktemas * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div></li>";
			echo "<li class='list-group-item'>
					<label class='text-success'>N&uacute;mero de temas sem tags: <span class='badge'>".$nsemtagstemas."<span class='badge'>
					&nbsp;&nbsp;".round(($nsemtagstemas * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nsemtagstemas * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";
			echo "<li class='list-group-item'>
					<label class='text-success'>N&uacute;mero de temas dispon&iacute;veis para download: <span class='badge'>".$ndownloadtemas."<span class='badge'>
					&nbsp;&nbsp;".round(($ndownloadtemas * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($ndownloadtemas * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero de temas dispon&iacute;veis como KML: <span class='badge'>".$nkmltemas."<span class='badge'>
					&nbsp;&nbsp;".round(($nkmltemas * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nkmltemas * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero de temas dispon&iacute;veis como Web Service OGC: <span class='badge'>".$nogctemas."<span class='badge'>
					&nbsp;&nbsp;".round(($nogctemas * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nogctemas * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero de temas com acesso maior que 0: <span class='badge'>".$nacessosmaiorqueum."<span class='badge'>
					&nbsp;&nbsp;".round(($nacessosmaiorqueum * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nacessosmaiorqueum * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero de temas com acesso maior que 10: <span class='badge'>".$nacessosmaiorquedez."<span class='badge'>
					&nbsp;&nbsp;".round(($nacessosmaiorquedez * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nacessosmaiorquedez * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";
			echo "<li class='list-group-item'><label class='text-success'>N&uacute;mero de temas com acesso maior que 100: <span class='badge'>".$nacessosmaiorquecem."<span class='badge'>
					&nbsp;&nbsp;".round(($nacessosmaiorquecem * 100) / $totaltemasvalidos,2) ." %</label>
					<div class='progress'><div style='width: ".round(($nacessosmaiorquecem * 100) / $totaltemasvalidos,2)."%;' class='progress-bar'>
					</div></div>
					</li>";

			echo "</ul>";
			echo "<h4>Acesos por tema</h4><ul>";
			arsort($temasacessos);
			$temasacessos2 = array_keys($temasacessos);
			for($i=0;$i<=count($temasacessos2);$i++){
				if(mb_detect_encoding($temasacessos2[$i],'UTF-8, ISO-8859-1') == "UTF-8"){
					echo "<li class='list-group-item'><label class='text-success'>".utf8_decode($temasacessos2[$i])." <span class='badge'> ".$temasacessos[$temasacessos2[$i]]."</span></li>";
				}
				else{
					echo "<li class='list-group-item'><label class='text-success'>".$temasacessos2[$i]." <span class='badge'> ".$temasacessos[$temasacessos2[$i]]."</span></li>";
				}
			}
			echo "</ul><div class='well well-info'>".date('l jS \of F Y h:i:s A')."</div>";
			?>

				</div>
			</div>
		</div>
	</div>
	<script>
	$(document).ready(function(){
		//vem de admin1/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		$.material.init();
	});
	</script>
</body>
</html>
