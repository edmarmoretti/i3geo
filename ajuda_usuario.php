<?php
/*
Title: Lista de funcionalidades

Lista as principais funcionalidades do i3Geo. Em i3geo/classesjs/dicionario_ajuda.js ficam cadastrados os textos. A listagem &eacute; organizada em grupos que podem ser expandidos individualmente ou no total, mostrando assim uma lista completa de fun&ccedil;&otilde;s.

&Eacute; utilizado pelo i3geo para fornecer ajuda ao usu&aacute;rio por meio de links posicionados em cabe&ccedil;alhos de janelas por exemplo.

Os textos de ajuda ficam no javascript classesjs/dicionario_ajuda.js . Para mostrar uma funcionalidade, utilize por exemplo

http://localhost/i3geo/ajuda_usuario.php?idcategoria=5&idajuda=39

para obter o ID veja em dicionario_ajuda.js

Licen&ccedil;a:

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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/ajuda_usuario.php

Par&acirc;metros:

idcategoria - id da categoria. Lista apenas uma categoria

idajuda - id da funcionalidade. Lista apenas uma funcionalidade
*/
include_once (dirname(__FILE__)."/classesphp/sani_request.php");
include("ms_configura.php");
$dicionario = file_get_contents("js/dicionario_ajuda.json");
$dicionario = json_decode($dicionario,true);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<script type="text/javascript" src="js/i3geo.js"></script>
<style>
.ajuda_usuario {
	margin-left: 10px;
}

P {
	padding-top: 12px;
	COLOR: #2F4632;
	text-align: left;
	font-size: 14px;
	font-family: Verdana, Arial, Helvetica, sans-serif;
}

#corpo {
	text-align: left;
	font-size: 12px;
	width: 450px;
	position: absolute;
	top: 0px;
	left: 300px;
	background: white;
}

#arvoreTemas {
	width: 280px;
}

body {
	padding-top: 0px;
	COLOR: #2F4632;
	text-align: center;
	font-size: 0.6cm;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	background-color: white;
	margin: auto;
}

#brasil {
	background-image: url("imagens/sprite.png");
	background-position: 0 -600px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 10px;
	width: 20px;
}

#uk {
	background-image: url("imagens/sprite.png");
	background-position: 0 -625px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 10px;
	width: 20px;
}

#espanhol {
	background-image: url("imagens/sprite.png");
	background-position: 0 -1400px;
	background-repeat: no-repeat;
	cursor: pointer;
	height: 10px;
	width: 20px;
}

#bandeiras img {
	margin-left: 7px;
}

#bandeiras {
	width: 100px;
	text-align: left;
	position: absolute;
	left: 0.2cm;
	z-index: 10;
}

a {
	margin: 0px auto;
	text-decoration: none;
	font-size: 14px;
	color: #26298D;
	outline: none;
}

A:hover {
	color: #4142ff;
}

</style>
</head>
<body class=" yui-skin-sam " style="background-color: rgb(250, 250, 250);">
	<div class="borda">
		<div id="bandeiras"></div>
		<div style="text-align: center">
			<b>&nbsp;</b>
		</div>
	</div>

<div class="mascaraPrincipal" id="divGeral">
	<img src="imagens/i3geo1.jpg" />
	<p style='font-size:16px'>Documenta&ccedil;&atilde;o do usu&aacute;rio.</p>
	<?php
	if (isset($_GET["idcategoria"]))
	{
		echo "<p>Para ver toda a documenta&ccedil;&atilde;o, ";
		echo "clique <a href='ajuda_usuario.php' >aqui</a></p>";
	}
	else
	{
		echo "<p style='padding-left:10px;text-align:left;color:blue;cursor:pointer' onclick='expandirtudo()'>expandir tudo</p>";
	}
	?>

	<div id=resultado style='margin:10px;'>
	</div>
</div>
<!-- <script language="JavaScript" type="text/javascript" src="classesjs/dicionario_ajuda.js"></script>-->
<script>

g_traducao_ajuda = <?php echo json_encode($dicionario["dicionario_ajuda"]); ?>;
g_traducao_ajuda_categorias = <?php echo json_encode($dicionario["dicionario_ajuda"]["categorias"]); ?>;

i3GEO.configura.locaplic = i3GEO.util.protocolo() + "://"
+ window.location.host + "/i3geo";
var idcategoria = "<?php echo $_GET["idcategoria"];?>";
var idajuda = "<?php echo $_GET["idajuda"];?>";
if(screen.availWidth > 700){
	document.getElementById("divGeral").style.width = "700px";
}
function pegaAjuda(tipo,categoria){
	eval("var obj = g_traducao_ajuda."+tipo);
	for(var k in obj){
		if(idajuda != "" && idajuda != k)
		{}
		else{
			if(idajuda == "" && categoria != obj[k].categoria){}
			else{
				ins += "<br><li onclick='expande(\""+k+"\")' style='cursor:pointer;font-size:16px;color:#759555'><b>"+traduzir(obj[k].titulo)+"</b></li>";
				ins += "<div id='"+k+"' style='display:none'><p>"+traduzir(obj[k])+"</p>";
				if(obj[k].complemento){
					ins += "<p>"+obj[k].complemento+"</p>";
				}
				if(obj[k].diretorio){
					ins += "<p style='color:gray;padding-left:20px'>"+obj[k].diretorio+"</p>";
				}
				if(obj[k].apijs){
					ins += "<p style='color:gray;padding-left:20px'>API js: "+obj[k].apijs+"</p>";
				}
				if(obj[k].tela){
					ins += "<p><a href='"+obj[k].tela+"' target=_blank style='padding-left:20px' >Exemplo de tela</a></p>";
				}
				if(obj[k].gadget){
					ins += "<p><a href='"+obj[k].gadget+"' target=_blank style='padding-left:20px' >Gadget</a></p>";
				}
				ins += "</div>";
			}
		}
	}
}
function inicia(){
	ins = "<div style='text-align:justify'>";
	for(var key in g_traducao_ajuda_categorias){
		if(idcategoria != "" && idcategoria != key)
		{}
		else{
			if(idajuda == "")
				ins += "<p style='font-size:18px' ><br><b>"+traduzir(g_traducao_ajuda_categorias[key].titulo)+"</b></p>";
			if(g_traducao_ajuda_categorias[key].observacao && idajuda == "")
				ins += "<p style='font-size:14px;color:gray' >"+traduzir(g_traducao_ajuda_categorias[key].observacao)+"</p>";
			if(idajuda == "")
				pegaAjuda("ferramentas",key);
			else{
				pegaAjuda("ferramentas",g_traducao_ajuda_categorias[key]);
			}
			if(idcategoria == ""){
				document.getElementById("resultado").innerHTML = ins+"</div>";
				expande(idajuda);
			}
		}
	}
	document.getElementById("resultado").innerHTML = ins+"</div>";
	if(idcategoria != ""){expande(idajuda);}
}
function expande(id){
	var i = document.getElementById(id);
	if(i){
		if(i.style.display=="none")
		i.style.display = "block";
		else
		i.style.display="none";
	}
}
function expandirtudo(){
	for(var key in g_traducao_ajuda.ferramentas){
		var j = document.getElementById(key);
		if(j)
		{expande(key);}
	}
}
function traduzir(hash){
	var r = hash[i3GEO.idioma.ATUAL];
	if (!r || (r && r == "")) {
		r = hash["pt"];
	}
	return r;
}
inicia()
</script>
</body>
</html>
