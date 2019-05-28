<html>
<title>Compacta js</title>
	<body>
	<h1>Compactador de c&oacute;digo Javascript</h1>
	<p>Esse programa deve ser executado sempre que forem feitas altera&ccedil;&otilde;es nos c&oacute;digos javascript principais do i3Geo (aqueles que ficam na pasta i3geo/js).
	A compacta&ccedil;&atilde;o reduz o tamanho dos arquivos e faz a concatena&ccedil;&atilde;o de v&aacute;rios arquivos em um s&oacute;. O compactador atua tamb&eacute;m sobre os arquivos CSS existentes
	em i3geo/css. Ao utilizar o javascript i3geo/js/i3geo.js o arquivo compactado ser&aacute; carregado, assim como o CSS, correspondentes a &uacute;ltima vers&atilde;o do i3Geo.
	A compacta&ccedil;&atilde;o tamb&eacute;m gera arquivos em i3geo/mashups. Os arquivos individuais compactados, da pasta i3geo/js, s&atilde;o armazenados em i3geo/js/compactados</p>

<?php
/*
Compacta os arquivos js e css utilizados pelo i3Geo.

Deve ser executado sempre que forem feitas altera&ccedil;&otilde;es nos arquivos javascript existentes em js ou nos arquivos de estilo existentes em css.

Qunado forem feitas alteracoes nesse arquivo, atualize tambem o WIKI https://softwarepublico.gov.br/gitlab/i3geo/i3geo/wikis/para-desenvolvedores-indice
*/
//
//
include ("../ms_configura.php");
include ($locaplic . "/classesphp/carrega_ext.php");
include ($locaplic . "/classesphp/funcoes_gerais.php");
include ("../admin/php/funcoesAdmin.php");
//verifica se o login pode ser realizado
if(isset($i3geoPermiteLogin) && $i3geoPermiteLogin == false){
	header ( "HTTP/1.1 403 Login desativado" );
	exit ();
}
//$i3geoPermiteLoginIp vem de ms_configura.php
if(isset($i3geoPermiteLoginIp)){
	checaLoginIp($i3geoPermiteLoginIp);
}
include_once("../classesphp/conexao.php");

if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	\admin\php\funcoesAdmin\formularioLoginMaster("compactajs.php");
	exit;
}
else{
	$continua = \admin\php\funcoesAdmin\verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
	if($continua == false){
		echo "Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
		exit;
	}
}
	echo "<pre>Para usar o console do firebug utilize sempre sem {}\n";
	echo "como no exemplo:\n";
	echo "if (typeof (console) !== 'undefined')\n";
	echo '		console.info("i3GEO.arvoreDeCamadas.atualiza()");';
	echo "</pre>";
if(file_exists("../js/teste.txt")){
	unlink("../js/teste.txt");
}
$f = @fopen("../js/teste.txt",w);
@fclose($f);
if (!file_exists("../js/teste.txt")){
	echo "<span style='color:red'>N&atilde;o foi possivel escrever em js";exit;
} else {
	unlink("../js/teste.txt");
}
if(file_exists("../css/teste.txt")){
	unlink("../css/teste.txt");
}
$f = @fopen("../css/teste.txt",w);
@fclose($f);
if (!file_exists("../css/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever em css";exit;
} else {
	unlink("../css/teste.txt");
}
if(file_exists("../pacotes/teste.txt")){
	unlink("../pacotes/teste.txt");
}
$f = @fopen("../pacotes/teste.txt",w);
@fclose($f);
if (!file_exists("../pacotes/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever em pacotes";exit;
} else {
	unlink("../pacotes/teste.txt");
}
if(file_exists("../mashups/teste.txt")){
	unlink("../mashups/teste.txt");
}
$f = @fopen("../mashups/teste.txt",w);
@fclose($f);
if (!file_exists("../mashups/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever em mashups";exit;
} else {
	unlink("../mashups/teste.txt");
}
echo "<pre>";
//
//compacta os arquivos do i3geo
//gera um arquivo compactado para cada um
//
packer("../pacotes/cesium154/Build/CesiumUnminified/Cesium.js","../pacotes/cesium154/Build/CesiumUnminified/Cesium_compacto.js","None");
packer("../pacotes/mobileesp/mdetect.js","../pacotes/mobileesp/mdetect_compacto.js","None");
packer("plugini3geo.js","compactados/plugini3geo_compacto.js","Normal");
packer("marcador.js","compactados/marcador_compacto.js","Normal");
packer("login.js","compactados/login_compacto.js","Normal");
packer("arvoredecamadas.js","compactados/arvoredecamadas_compacto.js","Normal");
packer("arvoredetemas.js","compactados/arvoredetemas_compacto.js","Normal");
packer("request.js","compactados/request_compacto.js","Normal");
packer("util.js","compactados/util_compacto.js","Normal");
packer("calculo.js","compactados/calculo_compacto.js","Normal");
packer("maparef.js","compactados/maparef_compacto.js","Normal");
packer("janela.js","compactados/janela_compacto.js","Normal");
packer("dicionario.js","compactados/dicionario_compacto.js","Normal");
packer("idioma.js","compactados/idioma_compacto.js","Normal");
packer("ajuda.js","compactados/ajuda_compacto.js","Normal");
packer("configura.js","compactados/configura_compacto.js","Normal");
packer("navega.js","compactados/navega_compacto.js","Normal");
packer("geolocal.js","compactados/geolocal_compacto.js","Normal");
packer("coordenadas.js","compactados/coordenadas_compacto.js","Normal");
packer("eventos.js","compactados/eventos_compacto.js","Normal");
packer("editor.js","compactados/editor_compacto.js","Normal");
packer("guias.js","compactados/guias_compacto.js","Normal");
packer("mapa.js","compactados/mapa_compacto.js","Normal");
packer("desenho.js","compactados/desenho_compacto.js","Normal");
packer("tema.js","compactados/tema_compacto.js","Normal");
packer("analise.js","compactados/analise_compacto.js","Normal");
packer("php.js","compactados/php_compacto.js","Normal");
packer("interface.js","compactados/interface_compacto.js","Normal");
packer("ini_i3geo.js","compactados/ini_i3geo_compacto.js","Normal");
packer("social.js","compactados/social_compacto.js","Normal");
packer("catalogoMenus.js","compactados/catalogoMenus_compacto.js","Normal");
packer("catalogoInde.js","compactados/catalogoInde_compacto.js","Normal");
packer("catalogoOgc.js","compactados/catalogoOgc_compacto.js","Normal");
packer("catalogoRegioes.js","compactados/catalogoRegioes_compacto.js","Normal");
packer("catalogoMetaestat.js","compactados/catalogoMetaestat_compacto.js","Normal");
packer("catalogoMapas.js","compactados/catalogoMapas_compacto.js","Normal");
packer("catalogoEstrelas.js","compactados/catalogoEstrelas_compacto.js","Normal");
packer("catalogoSistemas.js","compactados/catalogoSistemas_compacto.js","Normal");
packer("catalogoDir.js","compactados/catalogoDir_compacto.js","Normal");
packer("busca.js","compactados/busca_compacto.js","Normal");
packer("legenda.js","compactados/legenda_compacto.js","Normal");
packer("timer.js","compactados/timer_compacto.js","Normal");
packer("caixaDeFerramentas.js","compactados/caixaDeFerramentas_compacto.js","Normal");
//packer("../ferramentas/editorol/editorol.js","../ferramentas/editorol/editorol_compacto.js","Normal");
//packer("../ferramentas/editorgm/editorgm.js","../ferramentas/editorgm/editorgm_compacto.js","Normal");
packer("../pacotes/yui290/build/container/container.js","../pacotes/yui290/build/container/container_compacto.js","Normal");
packer("../pacotes/yui290/build/container/container_core.js","../pacotes/yui290/build/container/container_core_compacto.js","Normal");
packer("../pacotes/yui290/build/utilities/utilities.js","../pacotes/yui290/build/utilities/utilities_compacto.js","Normal");
packer("../pacotes/yui290/build/treeview/treeview.js","../pacotes/yui290/build/treeview/treeview_compacto.js","Normal");
packer("../pacotes/yui290/build/carousel/carousel-min.js","../pacotes/yui290/build/carousel/carousel_compacto.js","Normal");
packer("../pacotes/yui290/build/resize/resize-min.js","../pacotes/yui290/build/resize/resize_compacto.js","Normal");
packer("../pacotes/cpaint/cpaint2.inc.js","../pacotes/cpaint/cpaint2_compacto.inc.js","Normal");
packer("../pacotes/base64.js","compactados/base64_compacto.js","Normal");
packer("../pacotes/mustache.js-master/mustache.js","compactados/mustache.js","Normal");
packer("../pacotes/proj4js/lib/proj4js.js","compactados/proj4js.js","Normal");
packer("../pacotes/wicket/wicket.js","compactados/wicket.js","Normal");
packer("../pacotes/bootstrap-material-design/dist/js/material.js","compactados/material.js","Normal");
//
//gera um unico js para a inicializacao do I3Geo
//
$jsfiles = array(
"../pacotes/jsts/jsts_min.js",
"../pacotes/mobileesp/mdetect_compacto.js",
"compactados/proj4js.js",
"../pacotes/cpaint/cpaint2_compacto.inc.js",
"../pacotes/yui290/build/yahoo/yahoo-min.js",
"../pacotes/yui290/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui290/build/dom/dom-min.js",
"../pacotes/yui290/build/utilities/utilities_compacto.js",
"../pacotes/yui290/build/container/container_core_compacto.js",
"../pacotes/yui290/build/menu/menu-min.js",
"../pacotes/yui290/build/dragdrop/dragdrop-min.js",
"../pacotes/yui290/build/animation/animation-min270.js",
"../pacotes/yui290/build/container/container_compacto.js",
"../pacotes/yui290/build/element/element-min.js",
"../pacotes/yui290/build/tabview/tabview-min.js",
"../pacotes/yui290/build/json/json-min.js",
"../pacotes/yui290/build/storage/storage-min.js",
"../pacotes/yui290/build/resize/resize_compacto.js",
"../pacotes/yui290/build/progressbar/progressbar_compacto.js",
"../pacotes/yui290/build/selector/selector-min.js",
"../pacotes/jquery/dist/jquery.min.js",
"../pacotes/jquery/jquery-number/jquery.number.min.js",
"../pacotes/jquery/jquery-ui/jquery-ui.min.js",
"../pacotes/bootstrap/js/bootstrap.min.js",
"../pacotes/nouislider/nouislider.min.js",
"../pacotes/bootstrap-material-design/snackbarjs-1.1.0/dist/snackbar.min.js",
"compactados/material.js",
"compactados/wicket.js",
"compactados/ini_i3geo_compacto.js",
"compactados/request_compacto.js",
"compactados/mustache.js",
"compactados/util_compacto.js",
"compactados/dicionario_compacto.js",
"compactados/idioma_compacto.js",
"compactados/php_compacto.js",
"compactados/configura_compacto.js",
"compactados/calculo_compacto.js",
"compactados/desenho_compacto.js",
"compactados/interface_compacto.js",
"compactados/mapa_compacto.js",
"compactados/tema_compacto.js",
"compactados/analise_compacto.js",
"compactados/maparef_compacto.js",
"compactados/ajuda_compacto.js",
"compactados/janela_compacto.js",
"compactados/guias_compacto.js",
"compactados/arvoredecamadas_compacto.js",
"compactados/navega_compacto.js",
"compactados/geolocal_compacto.js",
"compactados/eventos_compacto.js",
"compactados/arvoredetemas_compacto.js",
"compactados/editor_compacto.js",
"compactados/coordenadas_compacto.js",
"compactados/social_compacto.js",
"compactados/login_compacto.js",
"compactados/marcador_compacto.js",
"compactados/plugini3geo_compacto.js",
"compactados/catalogoMenus_compacto.js",
"compactados/catalogoInde_compacto.js",
"compactados/catalogoOgc_compacto.js",
"compactados/catalogoRegioes_compacto.js",
"compactados/catalogoMetaestat_compacto.js",
"compactados/catalogoMapas_compacto.js",
"compactados/catalogoEstrelas_compacto.js",
"compactados/catalogoSistemas_compacto.js",
"compactados/catalogoDir_compacto.js",
"compactados/legenda_compacto.js",
"compactados/busca_compacto.js",
"compactados/caixaDeFerramentas_compacto.js",
"compactados/timer_compacto.js",
"template.js"
);

$removeQuebra = array();

$buffer = "\$i = function(id){return document.getElementById(id);};\n";
salvatudojs($jsfiles,$buffer,"i3geo_tudo_compacto8.js","js");
//
//gera um unico css
//

$cssfiles = array(
"../css/input.css",
"../css/geral.css",
"../pacotes/yui290/build/fonts/fonts-min.css",
"../pacotes/yui290/build/reset-fonts-grids/reset-fonts-grids.css",
"../pacotes/yui290/build/grids/grids-min.css",
"../pacotes/yui290/build/menu/assets/skins/sam/menu.css",
"../pacotes/yui290/build/container/assets/skins/sam/container.css",
"../pacotes/yui290/build/tabview/assets/skins/sam/tabview.css",
"../pacotes/yui290/build/resize/assets/skins/sam/resize.css",
//"../pacotes/jquery/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css",
"../pacotes/jquery/jquery-ui/jquery-ui.min.css",
"../mashups/theme/default/style.css",
"../mashups/openlayers.css"
);

$buffer = "";
salvatudojs($cssfiles,$buffer,"../css/i3geo8.css","css");
//css das ferramentas
$cssfiles = array(
"../css/input.css",
"../css/geral.css",
"../css/button.css",
"../css/ferramentas.css",
"../pacotes/yui290/build/container/assets/skins/sam/container.css",
"../pacotes/yui290/build/menu/assets/skins/sam/menu-skin.css",
"../css/tabview.css"
);
$buffer = "";
foreach ($cssfiles as $f)
{
	$abre = fopen($f, "r");
	while (!feof($abre))
	{$buffer .= fgets($abre);}
	fclose($abre);
	$buffer .= "\n";
}
$abre = fopen("../css/i3geo_ferramentas8.css", "wt");
$escreve = fwrite ($abre,$buffer);
$fecha = fclose ($abre);
//testa os scripts
foreach ($jsfiles as $f)
{
    //echo "<script>console.log('".$f."');</script>";
    //echo '<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>';
    echo '<script src="../pacotes/ol4/ol.js"></script>';
    echo "<script src='".$f."'></script>";
}



function inicia($arquivo)
{
	$abre = fopen($arquivo, "r");
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$maparray[] = $buffer."kkkk";
	}
	fclose($abre);
	$c = compress(implode("",$maparray));
	$c = str_replace("kkkk","\n",$c);
	$c = str_replace("kkk","",$c);
	$c = str_replace(";\n",";",$c);
	$c = str_replace("{\n","{",$c);
	$c = str_replace("\n}","}",$c);
	$c = str_replace(")\n",")",$c);
	$c = str_replace(" \n","",$c);
	$c = str_replace("\n}","}\n",$c);
	return $c;
}
function compress($code)
{ // Remove multiline comment
$mlcomment = '/\/\*(?!-)[\x00-\xff]*?\*\//';
$code = preg_replace($mlcomment,"",$code);

// Remove single line comment
$slcomment = '/[^:]\/\/.*/';
$code = preg_replace($slcomment,"",$code);

// Remove extra spaces
$extra_space = '/\s+/';
$code = preg_replace($extra_space," ",$code);

// Remove spaces that can be removed
$removable_space = '/\s?([\{\};\=\(\)\\\/\+\*-])\s?/';
$code = preg_replace('/\s?([\{\};\=\(\)\/\+\*-])\s?/',"\\1",$code);
return $code;
}
function packer($src,$out,$tipo="None")
{
	if(file_exists($out))
	{unlink($out);}
	require_once dirname(__FILE__).'/../pacotes/packer/class.JavaScriptPacker.php';
	$script = file_get_contents($src);

	$script = str_replace("if(typeof(console)","//if(typeof(console)",$script);
	$script = str_replace("if (typeof (console)","//if(typeof(console)",$script);
	$script = str_replace("if (typeof(console)","//if(typeof(console)",$script);
	$script = str_replace("console.i","//console.i",$script);
	$script = str_replace("console.w","//console.w",$script);
	$script = str_replace("console.e","//console.e",$script);

	$t1 = microtime(true);
	$packer = new JavaScriptPacker($script, 0, true, false);
	$packed = $packer->pack();
	$t2 = microtime(true);
	$time = sprintf('%.4f', ($t2 - $t1) );
	echo 'script ', $src, ' packed in ' , $out, ', in ', $time, ' s.', "\n";
	file_put_contents($out, $packed);
}
function salvatudojs($jsfiles,$buffer,$final,$tipo)
{
	global $removeQuebra;
	//junta todos os js em um unico
	if(file_exists($final))
	{unlink($final);}
	if(file_exists($final.".php"))
	{unlink($final.".php");}

	foreach ($jsfiles as $f)
	{
		echo $f;
		if($tipo == "js"){
			$buffer .= "//\n//".$f."\n";
		}
		$linhas = file($f);
		foreach($linhas as $linha){
			$linha = trim(preg_replace('#[\r\n]#', '', $linha));
			if($linha != ""){
				$buffer .= $linha;
				if(!in_array($f,$removeQuebra)){
					$buffer .= "\n";
				}
			}
		}
	}

	$abre = fopen($final, "wt");
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);


	chmod($final,0777);
	//gzip

	$abre = fopen($final, "r");
	if ($tipo == "js")
		$buffer = "<?php header(\"Content-type: text/javascript\"); ?>";
	else
		$buffer = "<?php header(\"Content-type: text/css\"); ?>";

	while (!feof($abre))
	{$buffer .= fgets($abre);}
	fclose($abre);

	$buffer .= "\n";
	$buffer .= "<?php if(extension_loaded('zlib')){ob_end_flush();}?>";
	$abre = fopen($final.".php", "wt");
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);
}
?>
	<p>Notas importantes:</p>
	<p>Ao escrever c&oacute;digo, para usar o console do firebug utilize sempre sem {}, exemplo:
	<pre>
	if (typeof (console) !== 'undefined')
			console.info("i3GEO.arvoreDeCamadas.atualiza()");
	</pre>
	<p>Para fins de debug, voc&ecirc; pode utilizar o arquivo i3geonaocompacto.js no lugar de i3geo.js em sua interface de mapa interativo.</p>
</html>
</body>
