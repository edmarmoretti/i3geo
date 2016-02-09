<html>
<style>
body
{background-color:white;font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 12px;margin: 10px}
img
{cursor:pointer;border:1px solid gray;}
</style>
<?php
//http://localhost/i3geo/pacotes/openid/login.php?g_sid=dqpk71kh6ei121s4u5g1qb9vi1
session_name("openid");
session_start();
include(dirname(__FILE__)."/../../ms_configura.php");
if($_SESSION["openid"] == false)
{
	$dadosurl = array_merge($_GET,$_POST);
	if(!empty($dadosurl["erro"])){
		echo "<span style=color:red >Ocorreu algum erro</span><br><br>";
	}

}
require 'openid.php';
try {
		$openid = new LightOpenID;
	if(!$openid->mode && $_SESSION["openid"] == false) {
				if(isset($dadosurl['openid_identifier']) && empty($dadosurl["erro"])) {
			$openid->identity = $dadosurl['openid_identifier'];
						header('Location: ' . $openid->authUrl());
				}
?>

<body>
<div id=corpo >
<a href="http://openid.net/" target=_blank ><img style="border:0px solid gray;" src="../../imagens/redes_openid.png"/></a>&nbsp;
<a href="http://oauth.net/" target=_blank ><img width=135px style="border:0px solid gray;" src="../../imagens/redes_oauth.png"/></a><br>

Utilize uma das redes abaixo para confirmar sua identidade<br><br>
<img src="../../imagens/redes_google.png" onclick="submete('google')"/>
<img src="../../imagens/redes_myspace.png" onclick="submete('myspace')"/>
<img src="../../imagens/redes_myopenid.png" onclick="submete('myopenid')"/>
<!--<img src="../../imagens/redes_windowslive.png" onclick="submete('windowslive')"/>-->
<img src="../../imagens/redes_wordpress.png" onclick="submete('wordpress')"/>
<img src="../../imagens/redes_blogger.png" onclick="submete('blogger')"/>
<?php
if(is_array($facebookoauth))
{echo '<img src="../../imagens/redes_facebook.png" onclick="submete(\'facebook\')"/> ';}
?>
<?php
if(is_array($twitteroauth))
{echo '<img src="../../imagens/redes_twitter.png" onclick="submete(\'twitter\')"/> ';}
?>
<?php
if(is_array($linkedinoauth))
{echo '<img src="../../imagens/redes_linkedin.png" onclick="submete(\'linkedin\')"/> ';}
?>

</div>

<script>
function submete(quem){
	if(quem == "linkedin")
	{
		var url = "<?php echo $_SESSION["locaplic"]; ?>/pacotes/linkedinoauth/index.php";
	}
	if(quem == "google")
	{
		var u = window.prompt("Usu�rio","");
		if(!u){return;}
		var url = 'http://www.google.com/profiles/'+u;
	}
	if(quem == "myopenid")
	{
		var u = window.prompt("Usu�rio","");
		if(!u){return;}
		var url = "http://"+u+".myopenid.com/";
	}
	if(quem == "myspace")
	{
		var u = window.prompt("Usu�rio","");
		if(!u){return;}
		var url = 'http://myspace.com/'+u;
	}
	if(quem == "twitter")
	{
		var url = "<?php echo $_SESSION["locaplic"]; ?>/pacotes/twitteroauth/redirect.php";
	}
	if(quem == "wordpress")
	{
		var u = window.prompt("Usu�rio","");
		if(!u){return;}
		var url = 'http://'+u+'wordpress.com';
	}
	if(quem == "blogger")
	{
		var u = window.prompt("Usu�rio","");
		if(!u){return;}
		var url = 'http://'+u+'.blogspot.com';
	}
	if(quem == "facebook")
	{
		var url = "<?php echo $_SESSION["locaplic"]; ?>/pacotes/facebookoauth/index.php";
	}
	if(quem == "myopenid" || quem == "google" || quem == "myspace" || quem == "wordpress" || quem == "blogger"){
		url = "login.php?&usuario="+u+"&openid_identifier="+url+"&servico="+quem+"&imagem=&nome="+u;
	}
	document.getElementById("corpo").style.display = "none";
	document.body.innerHTML += "Aguarde...";
	window.location.href = url;
}
</script>
<?php
		} elseif($openid->mode == 'cancel') {
				echo 'User has canceled authentication!';
		} else {
		if($_SESSION["openidservico"] != "twitter" && $_SESSION["openidservico"] != "facebook" && $_SESSION["openidservico"] != "linkedin"){
			$valido = $openid->validate();
			$_SESSION["openid"] = false;
			if($valido){
				$_SESSION["openid"] = true;
				$_SESSION["openidurl"] = $dadosurl["openid_identifier"];
				$_SESSION["openidusuario"] = $dadosurl["usuario"];
				$_SESSION["openidservico"] = $dadosurl["servico"];
				$_SESSION["openidimagem"] = $dadosurl["imagem"];
				$_SESSION["openidnome"] = $dadosurl["nome"];
			}
		}
		else{
			$valido = $_SESSION["openid"];
		}
		if($valido){
			header('Location: ' . $_SESSION["urlVolta"]);
		}
		if(!$valido){
			$url = "login.php?login&erro=ok";
			header('Location: ' . $url);
		}
		}
} catch(ErrorException $e) {
		echo $e->getMessage();
	echo "<br>O nome de usuario pode estar errado.";
}
?>