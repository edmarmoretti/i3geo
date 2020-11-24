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
        &nulos = lista de valores, separados por ',' que n&atilde;o ser&atilde;o considerados ao aplicar o filtro, por exemplo &nulos=-, ,0<br>
        &tipocolunat = string|numero tipo de dados existentes na coluna que cont&eacute;m os valores para o filtro<br>
        O tema pode ter par&acirc;metros j&aacute; armazenados no METADATA animagif, criado pelo formul&aacute;rio do i3Geo.
        Para for&ccedil;ar o uso desses par&acirc;metros, basta passar &colunat como vazio.
    ";
    exit;
}
//http://localhost/i3geo/ferramentas/animagif/exec.php?operador=lt&nulos=-&transparente=nao&legenda=sim&tema=_llocalianimagif&colunat=ANOCRIA&w=500&h=500&mapext=-74%20-32%20-34%204
//http://localhost:8014/i3geo/ferramentas/animagif/exec.php?transparente=nao&legenda=sim&tema=dengue_casos_provaveis&colunat=semana_ano_epidemiologico&w=500&h=500&mapext=-74%20-32%20-34%204
//http://localhost/i3geo/ferramentas/animagif/exec.php?nulos=-,0&transparente=sim&legenda=nao&tema=_llocalianimagif&colunat=ANOCRIA&w=500&h=500&mapext=-74%20-32%20-34%204&tipocolunat=string
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include("../../classesphp/funcoes_gerais.php");
include("../../classesphp/carrega_ext.php");
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
//
//verifica se existem parametros definidos no proprio mapfile
//
if(empty($_GET["colunat"])){
    $nmapa = ms_newMapObj($locaplic."/temas/".$_GET["tema"].".map");
    $layer = $nmapa->getlayerbyname($_GET["tema"]);
    $animagif = $layer->getmetadata("animagif");
    $animagif = json_decode(str_replace("'",'"',$animagif),true);
    $_GET["colunat"] = $animagif["colunat"];
    $_GET["tempo"] = $animagif["tempo"];
    $_GET["w"] = $animagif["w"];
    $_GET["h"] = $animagif["h"];
    $_GET["cache"] = $animagif["cache"];
    $_GET["mapext"] = $animagif["mapext"];
    $_GET["legenda"] = $animagif["legenda"];
    $_GET["transparente"] = $animagif["transparente"];
    $_GET["operador"] = $animagif["operador"];
    $_GET["nulos"] = $animagif["nulos"];
    $_GET["tipocolunat"] = $animagif["tipocolunat"];
}
//podem vir da url tbm
$tema = $_GET["tema"];
$colunat = $_GET["colunat"];
$tempo = $_GET["tempo"];
$w = $_GET["w"];
$h = $_GET["h"];
$cache = $_GET["cache"];
$mapext = $_GET["mapext"];
$legenda = $_GET["legenda"];
$transparente = $_GET["transparente"];
$operador = $_GET["operador"];
$nulos = $_GET["nulos"];
$tipocolunat = $_GET["tipocolunat"];

$v = versao();
$vi = $v["inteiro"];
$v = $v["principal"];

if($cache == "nao"){
    $nometemp = nomeRandomico();
} else {
    $nometemp = md5(implode("",$_GET));
}
$nometemp = "animagif".$nometemp;
if(empty($tempo)){
    $tempo = 40;
}
if(empty($w)){
    $w = 500;
}
if(empty($h)){
    $h = 500;
}
if(!isset($nulos)){
    $nulos = "";
}
if(empty($tipocolunat)){
    $tipocolunat = "string";
}
if(empty($operador) || @$operador == "eq"){
    $operador = "=";
}
else{
    if($operador == "lt"){
        $operador = "<";
    } elseif ($operador == "gt"){
        $operador = ">";
    } elseif ($operador == "lte"){
        $operador = "<=";
    } elseif ($operador == "gte"){
        $operador = ">=";
    }
}
if(!in_array($operador,array("=","<",">","<=",">="))){
    exit;
}
if(isset($_GET["sid"])){
    ini_set("session.use_cookies", 0);
    session_name("i3GeoPHP");
    session_id($_GET["sid"]);
    session_start([
        'read_and_close' => true
    ]);
    $base = $_SESSION["map_file"];
}
$nulos = explode(",",$nulos);
$arqtemp = $dir_tmp."/".$nometemp;
if(file_exists($arqtemp.".xgif")){
    if(getimagesize($arqtemp.".gif") == false){
        echo "";
        exit;
    }
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
//base vem de ms_configura
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
if(!isset($_GET["sid"])){
    $numlayers = $mapa->numlayers;
    for ($i=0;$i < $numlayers;$i++){
        $layern = $mapa->getlayer($i);
        $layern->set("status",MS_DELETE);
    }
    //adiciona ao mapa base as camadas do mapfile indicado em $tema
    $nmapa = ms_newMapObj($locaplic."/temas/".$tema.".map");
    $numlayers = $nmapa->numlayers;
    for ($i=0;$i < $numlayers;$i++){
        $layern = $nmapa->getlayer($i);
        $layern->set("status",MS_DEFAULT);
        cloneInlineSymbol($layern,$nmapa,$mapa);
        ms_newLayerObj($mapa, $layern);
    }
}

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
    $cor->setrgb(255,255,255);
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

$o = $mapa->outputformat;

if($transparente == "sim"){
    $o->set("transparent",MS_TRUE);
    $o->set("imagemode",MS_IMAGEMODE_RGBA);
} else {
    $o->set("imagemode",MS_IMAGEMODE_RGB);
    $o->set("transparent",MS_FALSE);
    $c = $mapa->imagecolor;
    $c->setrgb(255,255,255);
}
restauraConObj($mapa,$postgis_mapa);
//adiciona o layer para o titulo
$mapatit = ms_newMapObj(dirname(__FILE__)."/title.map");
$layertit = $mapatit->getlayer(0);
ms_newLayerObj($mapa, $layertit);
$mapa->save($arqtemp.".map");
$mapa = ms_newMapObj($arqtemp.".map");
//pega a lista de valores unicos da $colunat
include("../../mapserverapi/classes/util.php");
include("../../mapserverapi/classes/layer.php");
$layer = $mapa->getlayerbyname($tema);
$layer->set("status",MS_DEFAULT);

$m = new \mapserverapi\Layer();
$lista = $m->getUniqueValuesItem($layer, $colunat);

$listaunica = array();
foreach($lista as $l){
    $l = str_replace($nulos,"",$l);
    if($l != ""){
        $listaunica[] = $l;
    }
}

substituiConObj($mapa,$postgis_mapa);
$numlayers = $mapa->numlayers;
for ($i = 0; $i < $numlayers; ++ $i) {
    $l = $mapa->getlayer($i);
    if ($l->getProjection() == "") {
        $l->setProjection("proj=latlong,a=6378137,b=6378137");
    }
    if (($l->data != "") && (strtoupper($l->getmetadata("escondido")) != "SIM") && (strtoupper($l->getmetadata("tema")) != "NAO")) {
        if ($l->numclasses > 0) {
            $cl = $l->getclass(0);
            if (($cl->name == "") || ($cl->name == " ")) {
                $cl->set("name", $l->getmetadata("tema"));
            }
            // corrige o titulo da legenda
            if ($l->type != 3 && $l->type != 4) {
                $nclass = $l->numclasses;
                for ($j = 0; $j < $nclass; $j ++) {
                    $cl = $l->getclass($j);
                    if ($cl->title === "") {
                        $cl->title = $cl->name;
                    }
                }
            }
        }
    }
}
$copyright = $mapa->getlayerbyname("title");
if($copyright != ""){
    $c = $copyright->getclass(0);
    $label = $c->getLabel(0);
}

$imagens = array();
$duracao = array();
$objImagem = "";
$layer = $mapa->getlayerbyname($tema);
$layer->set("status",MS_OFF);
$s = "LABEL TEXT '' END";
$label->updateFromString($s);
$objImagem = $mapa->draw();
$objImagem->saveImage($arqtemp."0.png");
$layer->set("status",MS_DEFAULT);
$imagens[] = $arqtemp."0.png";
$duracao[] = $tempo;
foreach($listaunica as $d){
    $filtro = "(('[$colunat]' $operador '$d'))";
    if($tipocolunat == "numerico" || $tipocolunat == "numero"){
        $filtro = "(([$colunat] $operador $d))";
    }
    $layer->setfilter($filtro);
    $nomec = $arqtemp.$d.".png";
    $s = "LABEL TEXT '".$d."' END";
    $label->updateFromString($s);
    $i = $mapa->draw();
    $objImagem->pasteImage($i,-1);
    $objImagem->saveImage($nomec);
    $imagens[] = $nomec;
    $duracao[] = $tempo;
}

restauraConObj($mapa,$postgis_mapa);
$mapa = null;
//junta as imagens no gif
include("../../pacotes/gifcreator/GifCreator.php");

$gc = new GifCreator();
$gc->create($imagens, $duracao, 0);
$gifBinary = $gc->getGif();
file_put_contents($arqtemp.".gif", $gifBinary);
foreach($imagens as $i){
    unlink($i);
}
//retorna o gif para o navegador
ob_clean();
header('Content-type: image/gif');
header('Content-Disposition: filename="'.$tema.'.gif"');
echo $gifBinary;
exit;
?>
