<?php
//http://localhost/i3geo/ferramentas/animagif/index.php?transparente=sim&legenda=sim&tema=_llocali&colunat=ANOCRIA&w=500&h=500&mapext=-74%20-32%20-34%204
	$url = "./exec.php?".$_SERVER["QUERY_STRING"];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="../../pacotes/libgifjs/libgif.js"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
	</head>

	<body>
		<center>
			<img id="anima" src="<?php echo $url; ?>" rel:animated_src="<?php echo $url; ?>" rel:auto_play="1" width="<?php echo $_GET["w"]?>" height="<?php echo $_GET["h"]?>" />
			<br>
			<script type="text/javascript">
				var sup1 = new SuperGif({ gif: document.getElementById('anima') } );
				sup1.load();
			</script>
			<button style="cursor:pointer;" onclick="sup1.pause(); return false;"><img src='../../imagens/player_pausa.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.play(); return false;"><img src='../../imagens/player_inicia.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.move_to(0); return false;"><img src='../../imagens/player_para.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.move_relative(1); return false;"><img src='../../imagens/player_avanca.png' /></button> &nbsp;
			<button style="cursor:pointer;" onclick="sup1.move_relative(-1); return false;"><img src='../../imagens/player_volta.png' /></button>
		</center>
	</body>
</html>