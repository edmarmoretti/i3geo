<?php
define ( ONDEI3GEO, "../../.." );
include (dirname ( __FILE__ ) . "/../../ms_configura.php");
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
				<li class="active">Banco</li>
			</ol>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12">
				<div class="well">
			<?php
				if(!file_exists("../../../admin/admin.db")){
					echo "<div class='well well-danger'>O arquivo menutemas/admin.db n&atilde;o existe. Utilize a op&ccedil;&atilde;o existente no menu de administra&ccedil;&atilde;o para criar o banco de dados SQLITE.</div>";
					exit;
				}
				$dbh = new PDO('sqlite:../../../admin/admin.db');
				echo "<h3>Lista de tabelas</span></h3>";
				$q = $dbh->query("SELECT name FROM (SELECT * FROM sqlite_master UNION ALL SELECT * FROM sqlite_temp_master) WHERE type='table' ORDER BY name",PDO::FETCH_ASSOC);
				$resultado = $q->fetchAll();
				foreach ($resultado as $r){
					echo "<p>".$r["name"]."</p>";
				}
				$q = $dbh->query("select * from sqlite_master",PDO::FETCH_ASSOC);
				$resultado = $q->fetchAll();
				echo "<h3>SQL no padr&atilde;o SQLITE</span></h3>";
				foreach($resultado as $r){
					if(mb_detect_encoding($temasacessos2[$i],'UTF-8, ISO-8859-1') == "UTF-8"){
						echo "<p>".utf8_decode($r["sql"])."</p>";
					}
					else{
						echo "<p>".$r["sql"]."</p>";
					}
				}
				echo "<h3>SQL no padr&atilde;o POSTGRES</h3>";
				echo "<div class='well well-info'><p>Ap&oacute;s criar as tabelas no Postgres, vc deve definir as permiss&otilde;es para os usu&aacute;rios.</p>";
				echo "<p>Para usar outro banco de dados que n&atilde;o seja o default (SQLITE), voc&ecirc; ter&aacute; de alterar o programa i3geo/admin/php/conexao.php</p></div>";
				foreach($resultado as $r){
					if(mb_detect_encoding($r["sql"],'UTF-8, ISO-8859-1') == "UTF-8"){
						$r["sql"] = utf8_decode($r["sql"]);
					}
					echo str_ireplace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$r["sql"])."<br>";
				}
				echo "<h3>Listagem completa</h3>";
				echo "<pre style='overflow:auto;'>";
				$resultado = var_dump($resultado);
				if(mb_detect_encoding($resultado,'UTF-8, ISO-8859-1') == "UTF-8"){
					$resultado = utf8_decode($resultado);
				}
				echo $resultado;
				$dbh = null;
				$dbhw = null;
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
