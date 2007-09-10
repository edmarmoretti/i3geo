<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
</head>
<body >
<form action="sobearquivo.php" method="post" ENCTYPE="multipart/form-data">
Arquivo para upload:<br>
Atenção: se o arquivo já existir, será sobreposto!<br><br>
<input class=digitar type="file" size=20 name="arquivo"><br>
subir para:<br>
<select name="para" >
<option value="temas">temas</option>
<option value="menutemas">menutemas</option>
</select><br><br>
<input type="submit" class=executar value="Subir" size=10 name="submit">
</div>
<input type="hidden" name="MAX_FILE_SIZE" value="10000">
</form>
</body>
</html>
<?php
require_once("ms_configura.php");
if (isset($arquivo))
{
	$nome = $_FILES['arquivo']['name'];
	require_once ("ms_configura.php");
	$editor = "nao";
	foreach ($editores as $e)
	{
 		if ($e == $_SERVER['REMOTE_ADDR']){$editor="sim";}
	}
	if ($editor == "nao")
	{echo "Você não tem permissão para fazer isso!";}
 	else
 	{
		if (!copy($arquivo,$para."/".$nome)) {
    		echo "falha ao copiar $file...\n";
		}
		else
 		{chmod($para."/".$nome, 0777);   
 		echo "<br>Concluído!!!";}
 	}
}
?>