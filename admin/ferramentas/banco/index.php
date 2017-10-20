<?php
define ( "ONDEI3GEO", "../../.." );
include ("exec.php");
include "../../head.php";
?>
	<div class="container-fluid migalha" >
		<div class="row">
			<div class="btn-group btn-breadcrumb">
				<a class="btn btn-default" href="../../../init/index.php"><span>i3Geo</span></a>
				<a class="btn btn-default" href="../../index.php"><span>Admin</span></a>
				<a class="btn btn-default" style="pointer-events: none"><span>Ferramentas</span></a>
				<a class="btn btn-default" style="pointer-events: none"><span>Banco</span></a>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row center-block">
			<div class="col-sm-12">
				<div class="well">
				<h2>Descri&ccedil;&atilde;o da estrutura do banco de dados de administra&ccedil;&atilde;o</h2>
			<?php
				if(!file_exists("../../../admin/admin.db")){
					echo "<div class='alert alert-danger'>O arquivo menutemas/admin.db n&atilde;o existe. Utilize a op&ccedil;&atilde;o existente no menu de administra&ccedil;&atilde;o para criar o banco de dados SQLITE.</div>";
					exit;
				}
				$dbh = new PDO('sqlite:../../../admin/admin.db');
				echo "</div><div class='well'><h3>Lista de tabelas</h3>";
				$q = $dbh->query("SELECT name FROM (SELECT * FROM sqlite_master UNION ALL SELECT * FROM sqlite_temp_master) WHERE type='table' ORDER BY name",PDO::FETCH_ASSOC);
				$resultado = $q->fetchAll();
				foreach ($resultado as $r){
					echo "<p>".$r["name"]."</p>";
				}
				$q = $dbh->query("select * from sqlite_master",PDO::FETCH_ASSOC);
				$resultado = $q->fetchAll();
				echo "</div><div class='well'><h3>SQL no padr&atilde;o SQLite</span></h3>";
				foreach($resultado as $r){
					if(mb_detect_encoding($temasacessos2[$i],'UTF-8, ISO-8859-1') == "ISO-8859-1"){
						echo "<p>".utf8_encode($r["sql"])."</p>";
					}
					else{
						echo "<p>".$r["sql"]."</p>";
					}
				}
				echo "</div><div class='well'><h3>SQL no padr&atilde;o PostgreSQL</h3>";
				echo "<div class='alert alert-info'><p>Ap&oacute;s criar as tabelas no PostgreSQL, voc&ecirc; deve definir as permiss&otilde;es para os usu&aacute;rios.</p>";
				echo "<p>Para usar outro banco de dados que n&atilde;o seja o default (SQLite), voc&ecirc; ter&aacute; de alterar a vari&aacute;vel <code>conexaoadmin</code> do programa <samp>i3geo/ms_configura.php</samp></p></div>";
				foreach($resultado as $r){
					if(mb_detect_encoding($r["sql"],'UTF-8, ISO-8859-1') == "ISO-8859-1"){
						$r["sql"] = utf8_encode($r["sql"]);
					}
					echo str_ireplace("INTEGER PRIMARY KEY","SERIAL PRIMARY KEY NOT NULL",$r["sql"])."<br>";
				}
				echo "</div><div class='well'><h3>Listagem completa</h3>";
				echo "<pre style='overflow:auto;'>";
				$resultado = var_dump($resultado);
				if(mb_detect_encoding($resultado,'UTF-8, ISO-8859-1') == "ISO-8859-1"){
					$resultado = utf8_encode($resultado);
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
		//vem de admin/index.js
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
