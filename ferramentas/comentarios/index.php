<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../admin/html/admin.css">
<script type="text/javascript" src="../../classesjs/classe_util.js"></script>
</head>
<body>
<p>Bookmark esse tema com: <span id="bm" style="width:100px;cursor:pointer;"></span></p>
<?php
/*
Parametros:

g_sid

tema - tema que ser&aacute; comentado
*/
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

include (dirname(__FILE__)."/../../classesphp/sani_request.php");
$parametrosURL = array_merge($_GET,$_POST);

session_name("openid");
session_start();
if(!empty($parametrosURL["limpalogin"]))
{
	session_destroy();
	session_name("openid");
	session_start();
	$_SESSION["g_sid"] = $parametrosURL["g_sid"];
	$_SESSION["locaplic"] = $parametrosURL["locaplic"];
}
if(!empty($parametrosURL["tema"]))
{$_SESSION["tema"] = $parametrosURL["tema"];}
if(!empty($parametrosURL["locaplic"]))
{$_SESSION["locaplic"] = $parametrosURL["locaplic"];}
$_SESSION["urlVolta"] = $_SESSION["locaplic"]."/ferramentas/comentarios/index.php";


if($_SESSION["openid"] == true && $_POST["novocomentario"] != "")
{gravaComentario();}

listaComentarios($_SESSION["tema"]);

if($_SESSION["openid"] == true)
{formularioInsere();}
else
{linkOpenid();}

function linkOpenId()
{
	$urlVolta = $_SESSION["locaplic"]."/ferramentas/comentarios/index.php?";
	$urlVolta .= "tema=".$_SESSION["tema"];
	$url = $_SESSION["locaplic"]."/pacotes/openid/login.php?";
	echo "<p><a href='".$url."' target=_self ><img style='border:0px solid white' src='../../imagens/plus.png' >Inserir coment&aacute;rio</a>";
}
function formularioInsere()
{
	echo "<p>Adicione um coment&aacute;rio:</p>";
	$url = $_SESSION["locaplic"]."/ferramentas/comentarios/index.php?g_sid=".$_SESSION["g_sid"]."&tema=".$_SESSION["tema"]."&locaplic=".$_SESSION["locaplic"];
	echo "<form action='".$url."' method='post'>";
	echo "	<textarea name=novocomentario value='' type='text' style='height:150px;width:98%' ></textarea><br>";
	echo "	<input type=submit value='Salvar' />";
	echo "</form>";
	echo "<p>Para alterar o seu login e escolher uma outra rede, <a href='".$url."&limpalogin=sim' >clique aqui</a>";
}
function listaComentarios()
{
	$locaplic = "../..";
	include(dirname(__FILE__)."/../../classesphp/conexao.php");
	if(!empty($esquemaadmin)){
		$esquemaadmin = str_replace(".","",$esquemaadmin).".";
	}
	$data = gmdate("d-m-Y\TH:i:s\Z");
	$id_tema = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_temas where codigo_tema = '".$_SESSION["tema"]."' ",PDO::FETCH_ASSOC);
		$id_tema = $id_tema->fetchAll();
	$id_tema = $id_tema[0]["id_tema"];
	$lista = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_comentarios where id_tema = $id_tema ",PDO::FETCH_ASSOC);
	$lista = $lista->fetchAll();

	echo "<table>";
	foreach ($lista as $reg)
	{
		//echo "<tr><td>&nbsp;</td><td></td></tr><tr>";
		echo "<td style='vertical-align:top;border-top:2px solid white;' >";
		if($reg["openidimagem"] != "")
		{echo "<img src='".$reg["openidimagem"]."'/>&nbsp;";}
		echo "<p><a href='".$reg["openidurl"]."'>".$reg["openidnome"]."</a></td>";
		echo "<td style='vertical-align:top;border-top:2px solid white;' ><p style=line-height:15px ><span style=color:gray >".$reg["data"]."</span><br>".mb_convert_encoding($reg["comentario"],"ISO-8859-1",mb_detect_encoding($reg["comentario"]))."<br></td>";
		echo "</tr>";
	}
	echo "</table><hr>";
		$dbhw = null;
		$dbh = null;
	echo "<p><a href='../../admin/rsscomentariostemas.php'><img src='../../imagens/rss.gif' style='border:0px solid gray;' > todos os coment&aacute;rios</a>";
	echo " <a href='../../admin/rsscomentariostemas.php?id_tema=".$id_tema."'><img src='../../imagens/rss.gif' style='border:0px solid gray;' > coment&aacute;rios para o tema</a></p>";

}
function gravaComentario()
{
	//necess&aacute;rio para os includes do admin.php
	include_once(dirname(__FILE__)."/../../classesphp/conexao.php");
	if(!empty($esquemaadmin)){
		$esquemaadmin = str_replace(".","",$esquemaadmin).".";
	}
	$data = gmdate("d-m-Y\TH:i:s\Z");
	$id_tema = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_temas where codigo_tema = '".$_SESSION["tema"]."' ",PDO::FETCH_ASSOC);
		$id_tema = $id_tema->fetchAll();
	$id_tema = $id_tema[0]["id_tema"];
	$q = "INSERT INTO ".$esquemaadmin."i3geoadmin_comentarios (comentario,data,openidnome,openidimagem,openidservico,openidusuario,openidurl,id_tema) VALUES ('".converte($_POST["novocomentario"])."','".$data."','".$_SESSION["openidnome"]."','".$_SESSION["openidimagem"]."','".$_SESSION["openidservico"]."','".$_SESSION["openidusuario"]."','".$_SESSION["openidurl"]."','".$id_tema."')";
	$dbhw->query($q);
		$dbhw = null;
		$dbh = null;
}
function converte($texto){
	global $convUTF;
	if($convUTF == true)
	$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"UTF-8");
	else
	$texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"ISO-8859-1");
	return $texto;
}
?>
<script>
i3GEO.configura = {"locaplic": "<?php echo $_SESSION["locaplic"];?>"};
if(document.getElementById("bm"))
{document.getElementById("bm").innerHTML = window.parent.i3GEO.social.bookmark("<?php echo $_SESSION["locaplic"]."/ms_criamapa.php?layers=".$_SESSION["tema"];?>");}
</script>