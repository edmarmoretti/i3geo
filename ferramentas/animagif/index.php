<?php
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),"",false);
$url = strip_tags("./gif.php?".$_SERVER["QUERY_STRING"]);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="../../pacotes/libgifjs/libgif.js"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
		<style>
		body {
			font-family: Verdana, Arial, Helvetica, sans-serif;
		}
		</style>
	</head>
	<body>
		<center>
			<div id="aguarde" style="display:block;">Aguarde...</div>
			<img id="anima" onload="document.getElementById('aguarde').style.display='none';" src="<?php echo $url; ?>" rel:animated_src="<?php echo $url; ?>" rel:auto_play="1" width="<?php echo $_GET["w"]?>" height="<?php echo $_GET["h"]?>" />
			<br>
			<script type="text/javascript">
				var sup1 = new SuperGif({ gif: document.getElementById('anima') } );
				sup1.load();
			</script>
			<button style="cursor:pointer;" onclick="sup1.pause(); return false;"><img src='../../imagens/player_pausa.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.play(); return false;"><img src='../../imagens/player_inicia.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.move_to(0); return false;"><img src='../../imagens/player_para.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.move_relative(-1); return false;"><img src='../../imagens/player_volta.png' /></button>
			<button style="cursor:pointer;" onclick="sup1.move_relative(1); return false;"><img src='../../imagens/player_avanca.png' /></button> &nbsp;
			<br><br>
			<a href="<?php echo $url; ?>" target="_blank">Download</a>
		</center>
	</body>
</html>