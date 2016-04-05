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
		&operador = operador que ser&aacute; utilizado no filtro. Por default utilza-se 'igual a'. Pode ser ainda lt (menor que) ou gt (maior que)<br>
		&nulos = lista de valores, separados por ',' que não serão considerados ao aplicar o filtro, por exemplo &nulos=-, ,0<br>
		&tipocolunat = string|numero tipo de dados existentes na coluna que cont&eacute;m os valores para o filtro<br>
	";
	exit;
}
//http://localhost/i3geo/ferramentas/animagif/exec.php?operador=lt&nulos=-&transparente=nao&legenda=sim&tema=_llocalianimagif&colunat=ANOCRIA&w=500&h=500&mapext=-74%20-32%20-34%204
//http://localhost:8014/i3geo/ferramentas/animagif/exec.php?transparente=nao&legenda=sim&tema=dengue_casos_provaveis&colunat=semana_ano_epidemiologico&w=500&h=500&mapext=-74%20-32%20-34%204
//http://localhost/i3geo/ferramentas/animagif/exec.php?nulos=-,0&transparente=sim&legenda=nao&tema=_llocalianimagif&colunat=ANOCRIA&w=500&h=500&mapext=-74%20-32%20-34%204&tipocolunat=string
include("../../ms_configura.php");
include("../../classesphp/funcoes_gerais.php");
include("../../classesphp/pega_variaveis.php");
include("../../classesphp/carrega_ext.php");
$v = versao();
$vi = $v["inteiro"];
$v = $v["principal"];

if($cache == "nao"){
	$nometemp = nomeRandomico();
} else {
	$nometemp = md5(implode("",$_GET));
}
if(empty($tempo)){
	$tempo = 40;
}
if(empty($w)){
	$w = 500;
}
if(empty($h)){
	$h = 500;
}
if(empty($nulos)){
	$nulos = "";
}
if(empty($tipocolunat)){
	$tipocolunat = "string";
}
if(empty($operador)){
	$operador = "=";
}
else{
	if($operador == "lt"){
		$operador = "<";
	}
	if($operador == "gt"){
		$operador = ">";
	}
}
$nulos = explode(",",$nulos);
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
if (!function_exists('ms_GetVersion')){
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
		if(!@dl('php_mapscript_48.dll'))
			dl('php_mapscript.dll');
	}
	else{
		dl('php_mapscript.so');
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

//desenv /var/www/html/i3geo/i3geo/sage/camadas/base_linux.map
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

$copyright = $mapa->getlayerbyname("copyright");
if($copyright != ""){
	$classe = $copyright->getclass(0);
	if($vi >= 60200){
		$label = $classe->getLabel(0);
	}
	else{
		$label = $classe->label;
	}
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

	$labelleg->updatefromstring("LABEL TYPE TRUETYPE END");
	$labelleg->set("font","arial");

	$labelleg->set("size",12);
	$leg->set("keyspacingy",0);
	$leg->set("keysizey",20);
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

/*
if(validaAcessoTemas($arqtemp.".map",false) == true){
	echo "Existem temas restritos";exit;
}
*/
//pega a lista de valores unicos da $colunat
include_once("../../classesphp/classe_atributos.php");
$m = new Atributos($arqtemp.".map",$tema);

$lista = $m->listaUnicoRapida($colunat);
$listaunica = array();
foreach($lista as $l){
	$l = str_replace($nulos,"",$l);
	if($l != ""){
		$listaunica[] = $l;
	}
}

//$listaunica = array("201537");

//cria as imagens para cada periodo
$layer = $mapa->getlayerbyname($tema);

$copyright = $mapa->getlayerbyname("copyright");
if($copyright != ""){
	$classe = ms_newClassObj($copyright);
	$classet = ms_newClassObj($copyright);
	$classet->title = " ";
}
$mapa->moveLayerdown(0);

if($copyright != ""){
	$c = $copyright->getclass(0);
	if($vi >= 60200){
		$label = $c->getLabel(0);
	}
	else{
		$label = $c->label;
	}
}

//$classe = ms_newClassObj($copyright);

$imagens = array();
$duracao = array();
$objImagem = "";
foreach($listaunica as $d){
	if(strtoupper($colunat) == $colunat){
		$filtro = "(('[$colunat]' $operador '$d'))";
		if($tipocolunat == "numerico"){
			$filtro = "(([$colunat] $operador $d))";
		}
	}
	else{
		$filtro = "$colunat $operador '$d'";
		if($tipocolunat == "numerico"){
			$filtro = "$colunat $operador $d";
		}
	}
	$layer->setfilter($filtro);

	$nomec = $arqtemp.$d.".png";

	if($copyright != "" && $vi >= 60300){
		$s = "LABEL TEXT '".$d."' END";
		$label->updateFromString($s);
	}
	else{
		$classe->title = $d;
	}
	//$mapa->save($arqtemp."teste.map");
	if(!file_exists($nomec)){
		if($objImagem == ""){
			//$mapa->save($arqtemp.".map");
			//echo $arqtemp.".map";
			$objImagem = $mapa->draw();
			$objImagem->saveImage($nomec);
		}
		else{
			//$mapa->save($arqtemp.".map");
			//echo $arqtemp.".map";
			$i = $mapa->draw();
			$objImagem->pasteImage($i,-1);
			$objImagem->saveImage($nomec);
		}
	}
	$imagens[] = $nomec;
	$duracao[] = $tempo;
	//$mapa->save($arqtemp.".map");exit;
}

//junta as imagens no gif

include("../../pacotes/gifcreator/GifCreator.php");

$gc = new GifCreator();
$gc->create($imagens, $duracao, 0);
$gifBinary = $gc->getGif();
file_put_contents($arqtemp.".gif", $gifBinary);
//retorna o gif para o navegador
ob_clean();
header('Content-type: image/gif');
header('Content-Disposition: filename="'.$tema.'.gif"');
echo $gifBinary;
exit;
?>
