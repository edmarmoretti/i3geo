<?php
if(empty($_GET)){
	echo "
		Esse programa gera um arquivo gif a partir de uma camada existente em i3geo/temas <br>
		O arquivo gif &eacute; gerado na pasta tempor&aacute;ria e reaproveitado como cache <br>
		<br>Par&acirc;metros: <br>
		&tema = c&oacute;digo do tema (mapfile) existente em i3geo/temas<br>
		&colunat = coluna da tabela de atributos do tema que cont&eacute;m o per&iacute;odo.
			Essa coluna ser&aacute; utilizada para gerar o filtro para o desenho de cada frame que compor&aacute; o gif<br>
		&tempo = tempo em milisegundos entre cada frame<br>
		&w = largura da imagem em pixels<br>
		&h = altura da imagem em pixels<br>
		&cache = sim|nao utiliza cache do arquivo gif?<br>
		&mapext = extens&atilde;o geogr&aacute;fica xmin,ymin,xmax,ymax que ser&aacute; usada nas imagens<br>
		&legenda = sim|nao<br>
		&transparente = sim|nao<br>
	";
	exit;
}
//http://localhost:8014/i3geo/ferramentas/animagif/exec.php?transparente=nao&legenda=sim&tema=dengue_casos_provaveis&colunat=semana_ano_epidemiologico&w=500&h=500&mapext=-74%20-32%20-34%204
include("../../ms_configura.php");
include("../../classesphp/funcoes_gerais.php");
include("../../classesphp/pega_variaveis.php");
include("../../classesphp/carrega_ext.php");
if($cache == "nao"){
	$nometemp = nomeRandomico();
} else {
	$nometemp = md5(implode("",$_GET));
}
if(empty($tempo)){
	$tempo = 40;
}
$arqtemp = $dir_tmp."/".$nometemp;
if(file_exists($arqtemp.".gif")){
	$gifBinary = file_get_contents($arqtemp.".gif");
	//retorna o gif para o navegador
	header('Content-type: image/gif');
	header('Content-Disposition: filename="'.$tema.'.gif"');
	echo $gifBinary;
	exit;
}
//
//carrega o phpmapscript
//
if (!function_exists('ms_GetVersion'))
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		if(!@dl('php_mapscript_48.dll'))
			dl('php_mapscript.dll');
	}
	else
	{dl('php_mapscript.so');
	}
}
$versao = versao();
$versao = $versao["principal"];

//cria um mapa temporario
if($base == "" or !isset($base)){
	$base = "";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
		$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
	}
	else{
		if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
			$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
		}
		if($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
		}
		if($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
		}
		if($base == ""){
			$base = $locaplic."/aplicmap/geral1v".$versao.".map";
		}
	}
}
else{
	if(!file_exists($base)){
		$base = $locaplic."/aplicmap/".$base;
	}
}
$mapa = ms_newMapObj($base);

//remove as camadas do mapa base
$numlayers = $mapa->numlayers;
for ($i=0;$i < $numlayers;$i++){
	$layern = $mapa->getlayer($i);
	if($layern->name != "copyright"){
		$layern->set("status",MS_DELETE);
	}
	else{
		$layern->set("status",MS_DEFAULT);
	}
}
//ajusta o label
$l = $mapa->getlayerbyname("copyright");
if($l != ""){
	$classe = $l->getclass(0);
	$label = $classe->getLabel(0);
	$label->updatefromstring("LABEL TYPE TRUETYPE END");
	$label->set("font","arial");
	$label->set("size",15);
	$label->updatefromstring("LABEL POSITION lr END");
	$label->updatefromstring('LABEL STYLE GEOMTRANSFORM "labelpoly" COLOR 255 255 255 END END');
}
//
$mapa->save($arqtemp.".map");
//adiciona ao mapa base as camadas do mapfile indicado em $tema
$nmapa = ms_newMapObj($locaplic."/temas/".$tema.".map");
$numlayers = $nmapa->numlayers;

for ($i=0;$i < $numlayers;$i++){
	$layern = $nmapa->getlayer($i);
	$layern->set("status",MS_DEFAULT);
	if (!empty($postgis_mapa)){
		if ($layern->connectiontype == MS_POSTGIS){
			$lcon = $layern->connection;
			error_reporting(0);
			if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
				if(($lcon == " ") || ($lcon == "")){
					$layern->set("connection",$postgis_mapa);
				}
				else{
					$layern->set("connection",$postgis_mapa[$lcon]);
				}
			}
		}
	}
	autoClasses($layern,$nmapa);
	cloneInlineSymbol($layern,$nmapa,$mapa);
	ms_newLayerObj($mapa, $layern);
}
$mapa->save($arqtemp.".map");

//aplica a extensao geografica
$layer = $mapa->getlayerbyname($tema);

$extatual = $mapa->extent;
$ret = "";
if(isset($mapext)){
	$ret = str_replace(","," ",$mapext);
}
else{
	$ret = $layer->getmetadata("extensao");
}
if ($ret != ""){
	$ret = explode(" ",$ret);
	$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
}
$mapa->setsize($w,$h);
$sca = $mapa->scalebar;
$sca->set("status",MS_OFF);
if($legenda == "sim"){
	$leg = $mapa->legend;
	$leg->set("status",MS_EMBED);
	$cor = $leg->imagecolor;
	$cor->setrgb(250,250,250);
	$labelleg = $leg->label;
	//$labelleg->set("type",MS_TRUETYPE);
	//$labelleg->set("font","arial");
	$labelleg->set("size",10);
	//$leg->set("keyspacingy",10);
	$layer = $mapa->getlayerbyname($tema);
	$nclass = $layer->numclasses;
	for($i=0;$i<$nclass;$i++){
		$classe = $layer->getclass($i);
		if($classe->title === ""){
			$classe->title = $classe->name;
		}
	}
}
$c = $mapa->imagecolor;
$c->setrgb(-1,-1,-1);
$o = $mapa->outputformat;
$o->set("imagemode",MS_IMAGEMODE_RGBA);
if($transparente == "sim"){
	$o->set("transparent",MS_TRUE);
}
$mapa->save($arqtemp.".map");
$mapa = ms_newMapObj($arqtemp.".map");
if(validaAcessoTemas($arqtemp.".map",false) == true){
	echo "Existem temas restritos";exit;
}
//pega a lista de valores unicos da $colunat
include_once("../../classesphp/classe_atributos.php");
$m = new Atributos($arqtemp.".map",$tema);
$lista = $m->listaUnicoRapida($colunat);
$listaunica = array();
foreach($lista as $l){
	if($l != ""){
		$listaunica[] = $l;
	}
}
//cria as imagens para cada periodo
$layer = $mapa->getlayerbyname($tema);

$l = $mapa->getlayerbyname("copyright");
if($l != ""){
	$c = $l->getclass(0);
	$label = $c->getLabel(0);
}
$imagens = array();
$duracao = array();
$objImagem = "";
//$listaunica = array($listaunica[1]);
foreach($listaunica as $d){
	if(strtoupper($colunat) == $colunat){
		$filtro = "(('[$colunat]' = '$d'))";
	}
	else{
		$filtro = "$colunat = '$d'";
	}
	$layer->setfilter($filtro);
	//$mapa->save($arqtemp.".map");echo $arqtemp;exit;
	$nomec = $arqtemp.$d.".png";

	$s = "LABEL TEXT '".$d."' END";
	if($l != ""){
		$label->updateFromString($s);
	}
	if($objImagem == ""){
		$objImagem = $mapa->draw();
		$objImagem->saveImage($nomec);
	}
	else{
		$i = $mapa->draw();
		$objImagem->pasteImage($i,-1);
		$objImagem->saveImage($nomec);
	}
	$imagens[] = $nomec;
	$duracao[] = $tempo;
}
//junta as imagens no gif
include("../../pacotes/gifcreator/GifCreator.php");
$gc = new GifCreator();
$gc->create($imagens, $duracao, 0);
$gifBinary = $gc->getGif();
file_put_contents($arqtemp.".gif", $gifBinary);
//retorna o gif para o navegador
header('Content-type: image/gif');
header('Content-Disposition: filename="'.$tema.'.gif"');
echo $gifBinary;
exit;
?>
