<?php
/*
 * Title: Inicializa o i3Geo via URL ms_criamapa.php
 *
 * Esse &eacute; o programa principal de inicializa&ccedil;&atilde;o, podendo ser chamado diretamente pelo navegador web.
 *
 * Cria os diret&oacute;rios tempor&aacute;rios em ms_tmp, incluindo o mapfile (http://mapserver.org/mapfile/index.html#mapfile) que ser&aacute; a base para o funcionamento do mapa.
 *
 * Com o uso de par&acirc;metros &eacute; poss&iacute;vel alterar o processo padr&atilde;o de cria&ccedil;&atilde;o do mapa, como por exemplo, podem ser adicionadas novas camadas ou modificada a abrang&ecirc;ncia espacial do mapa.
 *
 * A inicializa&ccedil;&atilde;o padr&atilde;o abrir&aacute; uma interface HTML com todas as funcionalidades dispon&iacute;veis, por&eacute;m &eacute; poss&iacute;vel escolher qualquer outro HTML para a apresenta&ccedil;&atilde;o do mapa.
 *
 * No diret&oacute;rio i3geo/interface est&atilde;o os arquivos HTML que formatam a apresenta&ccedil;&atilde;o do mapa. Al&eacute;m desses arquivos, podem ser criados outros, conforme a necessidade do usu&aacute;rio.
 *
 * Os par&acirc;metros podem ser utilizados na chamada do i3geo via navegador, p.e.,
 *
 * http://localhost/i3geo/ms_criamapa.php?temasa=estadosl
 *
 * A ordem dos par&acirc;metros n&atilde;o &eacute; importante, mas o primeiro deve ser precedido de "?". Os demais par&acirc;metros devem ser acrescentados sempre precedidos de "&", p.e.,
 *
 * http://localhost/i3geo/ms_criamapa.php?temasa=estadosl bioma&layers=estadosl bioma
 *
 * Caso a inicializa&ccedil;&atilde;o do i3geo ocorra por um outro programa PHP, o ms_criamapa.php deve ser executado via include. Nesse caso, os par&acirc;metros devem ser especificados como vari&aacute;veis, p.e.,
 *
 * $temasa="bioma";
 *
 * include("ms_criamapa.php");
 *
 * Observa&ccedil;&otilde;es:
 *
 * Os cookies passados ao servidor s&atilde;o eliminados com a linha
 *
 * $_COOKIE = array();
 *
 * Se a sua aplica&ccedil;&atilde;o precisa de cookies, comente essa linha do programa.
 *
 * A interface HTML padr&atilde;o de abertura do mapa &eacute; definido em uma vari&aacute;vel no arquivo ms_configura.php, podendo ser alterada se necess&aacute;rio.
 *
 * Link:
 *
 * http://localhost/i3geo/ms_criamapa.php
 *
 * Licen&ccedil;a:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo: i3geo/ms_criamapa.php
 *
 * Par&acirc;metros:
 *
 * base - arquivo mapfile que servir&aacute; de base para a cria&ccedil;&atilde;o do mapa. Por default, s&atilde;o utilizados os arquivos existentes em i3geo/aplicmap (geral1windows, geral1,...)
 * Essa vari&aacute;vel pode ser definida em ms_configura tamb&eacute;m. Se n&atilde;o estiver definida em nenhum lugar, o i3Geo tentar&aacute; descobrir o arquivo adequado a ser utilizado. Voc&ecirc; pode utilizar essa op&ccedil;&atilde;o para abrir um mapa com as camadas que voc&ecirc; quiser, mas para evitar redund&acirc;ncias, prefira o uso de &temasa
 *
 * temasa - lista, separada por espa&ccedil;os, com os nomes dos arquivos map ou gvsig que ser&atilde;o adicionados ao mapa. Se o arquivo n&atilde;o estiver no diret&oacute;rio i3geo/temas, o nome deve incluir o caminho completo no servidor. O arquivo pode conter mais de um layer pois todos os existentes ser&atilde;o adicionados ao mapa. Por default, todos os layers encontrados nos mapfiles s&atilde;o adicionados ao mapa com o status de desenho em OFF.
 *
 * layers - lista, separada por espa&ccedil;os, com os nomes dos layers que ser&atilde;o ligados. A lista deve conter os nomes dos layers e n&atilde;o os nomes dos mapfiles acrescentados ao mapa. Por exemplo, ao adicionar com "temasa" um mapfile chamado "transporte" que contenha os layers "estradas" e "ferrovias" os dois layers ser&atilde;o adicionados ao mapa. Para que esses dois layers fiquem vis&iacute;veis no mapa deve-se utilizar &layers=estradas ferrovias.
 *
 * desligar - lista com os nomes dos temas que ser&atilde;o for&ccedil;ados a inicializar desligados, ou seja, com STATUS OFF
 *
 * mapext - extensao geografica que ser&aacute; utilizada. Por padr&atilde;o, a extens&atilde;o geogr&aacute;fica &eacute; definida para abranger o Brasil todo. Para alterar o padr&atilde;o deve-se utilizar o par&acirc;metro mapext para especificar a nova abrang&ecirc;ncia. Essa abrang&ecirc;ncia deve ser definida em coordenadas no formato d&eacute;cimos de grau e na proje&ccedil;&atilde;o geogr&aacute;fica. Exemplo: &mapext=-54 -30 -50 -12. Observe que a ordem dos valores s&atilde;o xmin ymin xmax ymax
 *
 * interface - nome da interface que ser&aacute; utilizada para abrir o mapa. As interfaces s&atilde;o arquivos HTML que podem estar no diret&oacute;rio aplicmap. Por default, utiliza-se o geral.htm. Vc pode copiar esse html e alter&aacute;-lo para customizar o mapa. Para chamar o html customizado, utilize ms_criamapa.php?interface=meumapa.htm
 *
 * perfil - perfil utilizado para restringir os menus de temas. ms_criamapa.php?perfil=usu&aacute;rio1
 *
 * caminho - caminho relativo que indica o local onde a interface do mapa esta localizada.
 *
 * pontos - lista de coordenadas x e y que ser&atilde;o adicionadas como pontos no mapa.
 *
 * nometemapontos - nome do tema de pontos
 *
 * linhas - lista de coordenadas x e y que ser&atilde;o adicionadas como linhas no mapa. As coordenadas de linhas diferentes devem ser separadas por ",", por exemplo: -54 -12 -50 -12,-50 -1 -50 -2 -50 -3
 *
 * nometemalinhas - nome do tema de linhas
 *
 * poligonos - lista de coordenadas x e y que ser&atilde;o adicionadas como pol&iacute;gonos no mapa. As coordenadas dos v&eacute;rtices de pol&iacute;gonos diferentes devem ser separadas por ",".
 *
 * nometemapoligonos - nome do tema de pol&iacute;gonos
 *
 * simbolo - nome do s&iacute;mbolo que ser&aacute; utilizado para desenhar os elementos inseridos (veja arquivo de s&iacute;mbolos em i3geo/symbols)
 *
 * corsimbolo - cor do s&iacute;mbolo definido em RGB separados por espa&ccedil;o ou v&iacute;rgula
 *
 * tamanhosimbolo - tamanho do s&iacute;mbolo em pixels
 *
 * wkt - insere elementos no mapa com coordenadas definidas em wkt
 *
 * nometemawkt - nome do tema em wkt
 *
 * idioma - idioma da interface (veja os idiomas dispon&iacute;veis em classe_idioma.js)
 *
 * kmlurl - url de um arquivo KML que ser&aacute; incluido no mapa. V&aacute;lido apenas na interface google maps
 *
 * url_wms - endere&ccedil;o de um WMS (ser&aacute; incluido como uma camada no mapa)
 *
 * layer_wms - nome do layer
 *
 * style_wms - estilo do layer
 *
 * nome_wms - nome da camada (titulo)
 *
 * srs_wms - c&oacute;digo da proje&ccedil;&atilde;o
 *
 * image_wms - tipo de imagem dispon&iacute;vel
 *
 * versao_wms - Vers&atilde;o do WMS (necess&aacute;rio quando da inclus&atilde;o de uma camada WMS diretamente pela URL)
 *
 * restauramapa - id do mapa armazenado no sistema de administracao e que ser&aacute; restaurado para ser aberto novamente
 *
 * filtros - filtros podem ser adicionados incluindo o parametro da seguinte forma: &map_layer_<nomedotema>_filter=
 *
 * Exemplo de filtro
 *
 * http://localhost/i3geo/ms_criamapa.php?temasa=_lbiomashp&map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))&temasa=_lbiomashp
 *
 * no caso de camadas Postgis basta usar map_layer__lbiomashp_filter=cd_legenda='CAATINGA'
 *
 * largura - largura em pixel do mapa
 *
 * altura - altura em pixels do mapa
 *
 * DESLIGACACHE - sim|nao forca o desligamento do cache em todos os layers
 */
if (isset($_GET["ajuda"])) {
    echo "<pre>";
    echo "
Par&acirc;metros:

base - arquivo mapfile que servir&aacute; de base para a cria&ccedil;&atilde;o do mapa. Por default, s&atilde;o utilizados os arquivos existentes em i3geo/aplicmap (geral1windows, geral1,...)
	Essa vari&aacute;vel pode ser definida em ms_configura tamb&eacute;m. Se n&atilde;o estiver definida em nenhum lugar, o i3Geo tentar&aacute; descobrir o arquivo adequado a ser utilizado. Voc&ecirc; pode utilizar essa op&ccedil;&atilde;o para abrir um mapa com as camadas que voc&ecirc; quiser, mas para evitar redund&acirc;ncias, prefira o uso de &temasa

temasa - lista, separada por espa&ccedil;os, com os nomes dos arquivos map ou gvsig que ser&atilde;o adicionados ao mapa. Se o arquivo n&atilde;o estiver no diret&oacute;rio i3geo/temas, o nome deve incluir o caminho completo no servidor. O arquivo pode conter mais de um layer pois todos os existentes ser&atilde;o adicionados ao mapa. Por default, todos os layers encontrados nos mapfiles s&atilde;o adicionados ao mapa com o status de desenho em OFF.

layers - lista, separada por espa&ccedil;os, com os nomes dos layers que ser&atilde;o ligados. A lista deve conter os nomes dos layers e n&atilde;o os nomes dos mapfiles acrescentados ao mapa. Por exemplo, ao adicionar com 'temasa' um mapfile chamado 'transporte' que contenha os layers 'estradas' e 'ferrovias' os dois layers ser&atilde;o adicionados ao mapa. Para que esses dois layers fiquem vis&iacute;veis no mapa deve-se utilizar &layers=estradas ferrovias.

desligar - lista com os nomes dos temas que ser&atilde;o for&ccedil;ados a inicializar desligados, ou seja, com STATUS OFF

mapext - extensao geografica que ser&aacute; utilizada. Por padr&atilde;o, a extens&atilde;o geogr&aacute;fica &eacute; definida para abranger o Brasil todo. Para alterar o padr&atilde;o deve-se utilizar o par&acirc;metro mapext para especificar a nova abrang&ecirc;ncia. Essa abrang&ecirc;ncia deve ser definida em coordenadas no formato d&eacute;cimos de grau e na proje&ccedil;&atilde;o geogr&aacute;fica. Exemplo: &mapext=-54 -30 -50 -12. Observe que a ordem dos valores s&atilde;o xmin ymin xmax ymax

interface - nome da interface que ser&aacute; utilizada para abrir o mapa. As interfaces s&atilde;o arquivos HTML que podem estar no diret&oacute;rio aplicmap. Por default, utiliza-se o geral.htm. Vc pode copiar esse html e alter&aacute;-lo para customizar o mapa. Para chamar o html customizado, utilize ms_criamapa.php?interface=meumapa.htm

perfil - perfil utilizado para restringir os menus de temas. ms_criamapa.php?perfil=usu&aacute;rio1

caminho - caminho relativo que indica o local onde a interface do mapa esta localizada.

pontos - lista de coordenadas x e y que ser&atilde;o adicionadas como pontos no mapa.

nometemapontos - nome do tema de pontos

linhas - lista de coordenadas x e y que ser&atilde;o adicionadas como linhas no mapa. As coordenadas de linhas diferentes devem ser separadas por ',', por exemplo: -54 -12 -50 -12,-50 -1 -50 -2 -50 -3

nometemalinhas - nome do tema de linhas

poligonos - lista de coordenadas x e y que ser&atilde;o adicionadas como pol&iacute;gonos no mapa. As coordenadas dos v&eacute;rtices de pol&iacute;gonos diferentes devem ser separadas por ','.

nometemapoligonos - nome do tema de pol&iacute;gonos

simbolo - nome do s&iacute;mbolo que ser&aacute; utilizado para desenhar os elementos inseridos (veja arquivo de s&iacute;mbolos em i3geo/symbols)

corsimbolo - cor do s&iacute;mbolo definido em RGB separados por espa&ccedil;o ou v&iacute;rgula

tamanhosimbolo - tamanho do s&iacute;mbolo em pixels

wkt - insere elementos no mapa com coordenadas definidas em wkt

nometemawkt - nome do tema em wkt

idioma - idioma da interface (veja os idiomas dispon&iacute;veis em classe_idioma.js)

kmlurl - url de um arquivo KML que ser&aacute; incluido no mapa. V&aacute;lido apenas na interface google maps

url_wms - endere&ccedil;o de um WMS (ser&aacute; incluido como uma camada no mapa)

layer_wms - nome do layer

style_wms - estilo do layer

nome_wms - nome da camada (titulo)

srs_wms - c&oacute;digo da proje&ccedil;&atilde;o

image_wms - tipo de imagem dispon&iacute;vel

versao_wms - Vers&atilde;o do WMS (necess&aacute;rio quando da inclus&atilde;o de uma camada WMS diretamente pela URL)

restauramapa - id do mapa armazenado no sistema de administracao e que ser&aacute; restaurado para ser aberto novamente

filtros - filtros podem ser adicionados incluindo o parametro da seguinte forma: &map_layer_<nomedotema>_filter=

  Exemplo de filtro

  http://localhost/i3geo/ms_criamapa.php?layers=_lbiomashp&temasa=_lbiomashp&map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))

  no caso de camadas Postgis basta usar map_layer__lbiomashp_filter=cd_legenda='CAATINGA'

 largura - largura em pixel do mapa

 altura - altura em pixels do mapa
	";
    exit();
}
// $_COOKIE = array();

//
// quando $funcao existe, &eacute; pq o ms_criamapa.php est&aacute;
// sendo utilizado como um include em classesphp/mapa_controle.php
//
if (! isset($funcao)) {
    ob_end_clean();
    /*
     * Carrega as extens&otilde;es PHP
     *
     * Carrega as extens&otilde;es utilizadas no programa de inicializa&ccedil;&atilde;o.
     * A carga das extens&otilde;es geralmente &eacute; necess&aacute;ria nas instala&ccedil;&otilde;es windows (ms4w) ou quando as mesmas n&atilde;o s&atilde;o carregadas pela pr&oacute;pria inicializa&ccedil;&atilde;o do PHP.
     */
    include_once (dirname(__FILE__) . "/classesphp/carrega_ext.php");
    /*
     * Include dos arquivos PHP.
     *
     * Inclui os programas php com fun&ccedil;&otilde;es utilizadas pelo ms_criamapa.php
     */
    include_once (dirname(__FILE__) . "/classesphp/sani_request.php");
    include_once (dirname(__FILE__) . "/classesphp/funcoes_gerais.php");
    if (! isset($_GET["interface"])) {
        $_GET["interface"] = "";
    }
    $interface = $_GET["interface"];
}
$parurl = array_merge($_GET, $_POST);
//
// $base pode vir do ms_configura ou da URL
// o ms_configura pode ter sido inserido antes
//
if (empty($base) && ! empty($parurl["base"])) {
    $base = $parurl["base"];
}

ms_ResetErrorList();
$metaestatids = @$parurl["metaestatids"];
$temasa = @$parurl["temasa"];
$layers = @$parurl["layers"];
$desligar = @$parurl["desligar"];
$mapext = @$parurl["mapext"];
$executa = ""; // $parurl["executa"];
$perfil = @$parurl["perfil"];
$caminho = @$parurl["caminho"];
$pontos = @$parurl["pontos"];
$nometemapontos = @$parurl["nometemapontos"];
$linhas = @$parurl["linhas"];
$nometemalinhas = @$parurl["nometemalinhas"];
$poligonos = @$parurl["poligonos"];
$nometemapoligonos = @$parurl["nometemapoligonos"];
$simbolo = @$parurl["simbolo"];
$corsimbolo = @$parurl["corsimbolo"];
$tamanhosimbolo = @$parurl["tamanhosimbolo"];
$wkt = @$parurl["wkt"];
$nometemawkt = @$parurl["nometemawkt"];
$idioma = @$parurl["idioma"];
$kmlurl = @$parurl["kmlurl"];
$url_wms = @$parurl["url_wms"];
$layer_wms = @$parurl["layer_wms"];
$style_wms = @$parurl["style_wms"];
$nome_wms = @$parurl["nome_wms"];
$srs_wms = @$parurl["srs_wms"];
$image_wms = @$parurl["image_wms"];
$versao_wms = @$parurl["versao_wms"];
$gvsigview = @$parurl["gvsigview"];
$restauramapa = @$parurl["restauramapa"];

$versao = versao();
$versao = $versao["principal"];

//
// a vari&aacute;vel $base pode ser definida em ms_configura, mas a prefer&ecirc;ncia &eacute; pela defini&ccedil;&atilde;o j&aacute; existente
// por isso, $base &eacute; guardada em uma vari&aacute;vel e retomada apos o include de ms_configura.php
// se restauramapa estiver definido, usa o mapfile guardado no banco de administracao como a base
//
if (! isset($dir_tmp)) {
    include_once (dirname(__FILE__) . "/ms_configura.php");
    if (! empty($parurl["base"])) {
        $base = $parurl["base"];
    }
    if (! empty($parurl["interface"])) {
        $interface = $parurl["interface"];
    }
}
if (isset($logExec) && $logExec["init"] == true) {
    i3GeoLog("prog: ms_criamapa url: " . implode("&", array_merge($_GET, $_POST)), $dir_tmp);
}
if (! empty($restauramapa)) {
    $base = restauraMapaAdmin($restauramapa, $dir_tmp);
    $m = ms_newMapObj($base);
    $w = $m->web;
    $w->set("imagepath", dirname($w->imagepath) . "/");
    $w->set("imageurl", dirname($w->imageurl) . "/");
    $m->save($base);
} else {
    if (isset($base)) {
        $tempBaseX = $base;
    }
    if (isset($tempBaseX) && $tempBaseX != "") {
        $base = $tempBaseX;
    }
}
// verifica se o usuario trocou a senha do master
if ($_SERVER['SERVER_NAME'] != "localhost" && ($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin")) {
    echo json_encode(array(
        "bloqueado" => "Bloqueado. ATENCAO!!! Acesso bloqueado: edite o arquivo i3geo/ms_configura.php e altere o login e senha da variavel i3geomaster"
    ));
    exit();
}
/*
 * Define o cookie para o idioma da interface
 */
if (isset($idioma) && $idioma != "") {
    setcookie("i3geolingua", $idioma);
}
/*
 * Cria os diretorios tempor&aacute;rios que ser&atilde;o utilizados pelo i3geo para armazenar as imagens e outros dados.
 */
$diretorios = criaDirMapa($dir_tmp, $cachedir);
if (! $diretorios) {
    echo "<p style=color:red ><b>N&atilde;o foi poss&iacute;vel criar os diret&oacute;rios tempor&aacute;rios em $dir_tmp.</b></p>";
    exit();
}
criaIndex($dir_tmp, $diretorios);
$tmpfname = $diretorios[0];
$protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
/*
 * Prepara as vari&aacute;veis que ser&atilde;o incluidas na se&ccedil;&atilde;o
 *
 * As vari&aacute;veis v&ecirc;m do arquivo ms_configura.php e s&atilde;o armazenadas em uma se&ccedil;&atilde;o com nome espec&iacute;fico para o i3geo.
 */
if (! isset($mapext) || empty($mapext)) {
    $mapext = "";
} else {
    $mapext = str_replace(",", " ", $mapext);
}
$saikuUrl_ = $saikuUrl;
$cachedir_ = $cachedir;
$dir_tmp_ = $dir_tmp;
$emailInstituicao_ = $emailInstituicao;
$locmapserv_ = $locmapserv;
$locaplic_ = $locaplic;
// $locsistemas_ = $locsistemas;
// $locidentifica_ = $locidentifica;
$R_path_ = $R_path;
$mapext_ = $mapext;

$debug_ = @$debug;
$ler_extensoes_ = $ler_extensoes;
$postgis_mapa_ = $postgis_mapa;
$tituloInstituicao_ = $tituloInstituicao;
// $atlasxml_ = $atlasxml;
$expoeMapfile_ = $expoeMapfile;
$googleApiKey_ = $googleApiKey;
$mensagemInicia_ = $mensagemInicia;
$interfacePadrao_ = $interfacePadrao;
if (empty($interface)) {
    $interface_ = $interfacePadrao;
}
if (isset($kmlurl)) {
    $kmlurl_ = $kmlurl;
}
//
// se houver string de conex&atilde;o para substitui&ccedil;&atilde;o
// o modo cgi n&atilde;o ir&aacute; funcionar
//
if ($postgis_mapa != "") {
    $utilizacgi = "nao";
}
if (! isset($perfil)) {
    $perfil = "";
}
$perfil_ = $perfil;
$utilizacgi_ = $utilizacgi;
if ((isset($navegadoresLocais)) && ($navegadoresLocais != "")) {
    $navegadoresLocais_ = "sim";
} else {
    $navegadoresLocais_ = "nao";
}
if (empty($i3georendermode)) {
    $i3georendermode_ = 0;
} else {
    $i3georendermode_ = $i3georendermode;
}
if (empty($statusFerramentas)) {
    $statusFerramentas_ = array();
} else {
    $statusFerramentas_ = $statusFerramentas;
}
if (empty($logExec)) {
    $logExec_ = "";
} else {
    $logExec_ = $logExec;
}
if (! isset($i3geoPermiteLogin)) {
    $i3geoPermiteLogin_ = "";
} else {
    $i3geoPermiteLogin_ = $i3geoPermiteLogin;
}
if (! isset($i3geoBlFerramentas)) {
    $i3geoBlFerramentas_ = "";
} else {
    $i3geoBlFerramentas_ = $i3geoBlFerramentas;
}
/*
 * Inicia a se&ccedil;&atilde;o
 *
 * O i3geo inicia uma se&ccedil;&atilde;o espec&iacute;fica no servidor, denominada i3GeoPHP.
 * Se j&aacute; houver uma se&ccedil;&atilde;o aberta, em fun&ccedil;&atilde;o de outro browser estar ativo, cria uma nova. Faz a c&oacute;pia das vari&aacute;veis definidas para itens da se&ccedil;&atilde;o.
 */
session_name("i3GeoPHP");
session_start();
// echo $_SESSION["map_file"];exit;
if (! isset($g_sid)) {
    $g_sid = "";
}
if (isset($_SESSION["map_file"]) || $g_sid != "" || $g_sid == "undefined") {
    session_regenerate_id();
    $_SESSION = array();
}
/*
 * Aguarde
 *
 * Monta a apresenta&ccedil;&atilde;o do aguarde.
 *
 * Aqui &eacute; necess&aacute;rio verificar se $executa est&aacute; definido
 * isso pq algumas aplica&ccedil;&otilde;es podem ser prejudicadas caso o aguarde seja mostrado
 */
$_SESSION["dir_tmp"] = $dir_tmp_;
$_SESSION["cachedir"] = $cachedir_;
$_SESSION["emailInstituicao"] = $emailInstituicao_;
$_SESSION["locmapserv"] = $locmapserv_;
$_SESSION["locaplic"] = $locaplic_;
$_SESSION["R_path"] = $R_path_;
$_SESSION["mapext"] = $mapext_;
$_SESSION["debug"] = $debug_;
$_SESSION["ler_extensoes"] = $ler_extensoes_;
$_SESSION["postgis_mapa"] = $postgis_mapa_;
$_SESSION["perfil"] = $perfil_;
$_SESSION["navegadoresLocais"] = $navegadoresLocais_;
$_SESSION["utilizacgi"] = $utilizacgi_;
$_SESSION["tituloInstituicao"] = $tituloInstituicao_;
$_SESSION["expoeMapfile"] = $expoeMapfile;
$_SESSION["googleApiKey"] = $googleApiKey_;
$_SESSION["mensagemInicia"] = $mensagemInicia_;
$_SESSION["interfacePadrao"] = $interfacePadrao_;
$_SESSION["logExec"] = $logExec_;
$_SESSION["i3geoPermiteLogin"] = $i3geoPermiteLogin_;
if (! isset($customDir)) {
    $customDir = "";
}
$_SESSION["customDir"] = $customDir;
if (isset($interface_)) {
    $_SESSION["interface"] = $interface_;
}
if (isset($kmlurl_)) {
    $_SESSION["kmlurl"] = $kmlurl_;
}
// rotina de seguran&ccedil;a, ver http://shiflett.org/articles/the-truth-about-sessions
$fingerprint = 'I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'];
$_SESSION['fingerprint'] = md5($fingerprint . session_id());
$_SESSION["mapdir"] = $diretorios[1];
$_SESSION["imgdir"] = $diretorios[2];
$_SESSION["contadorsalva"] = 0; // essa variavel e utilizada pela ferramenta telaremota. Toda vez que o mapa e salvo, acrescenta 1 (veja classesphp/mapa_controle.php)
$_SESSION["i3georendermode"] = $i3georendermode_;
$_SESSION["saikuUrl"] = $saikuUrl_;
$_SESSION["logExec"] = $logExec_;
$_SESSION["i3geoPermiteLogin"] = $i3geoPermiteLogin_;
$_SESSION["i3geoBlFerramentas"] = $i3geoBlFerramentas_;

// sao arrays
$postgis_mapa = $postgis_mapa_;
$_SESSION["statusFerramentas"] = $statusFerramentas_;
/*
 * Define os arquivos .map
 *
 * Seleciona os arquivos mapfile que ser&atilde;o carregados como base conforme o tipo de sistema operacional.
 *
 * A vari&aacute;vel $base pode ser definida como um par&acirc;metro na inicializa&ccedil;&atilde;o, caso contr&aacute;rio ser&aacute; utilizado o valor definido em ms_configura.php ou o i3Geo tentar&aacute; descobrir o melhor arquivo a ser usado, conforme o que existir em i3geo/aplicmap.
 *
 * Os arquivos .map padr&atilde;o s&atilde;o armazenados em i3geo/aplicmap.
 * O arquivo &eacute; lido conforma a caracter&iacute;stica do sistema operacional.
 *
 */
$versao = versao();
$versao = $versao["principal"];
if (! isset($base) || $base == "") {
    if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
        $base = $locaplic . "/aplicmap/geral1windowsv" . $versao . ".map";
    } else {
        if ($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv' . $versao . '.map')) {
            $base = "/var/www/i3geo/aplicmap/geral1debianv" . $versao . ".map";
        }
        if ($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
            $base = "/var/www/html/i3geo/aplicmap/geral1fedorav" . $versao . ".map";
        }
        if ($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
            $base = "/opt/www/html/i3geo/aplicmap/geral1v" . $versao . ".map";
        }
        if ($base == "") {
            $base = $locaplic . "/aplicmap/geral1v" . $versao . ".map";
        }
    }
}
// error_log($base);
// if(!isset($estadosl))
// {$estadosl = "estadosl";}
/*
 * Cria os objetos map que ser&atilde;o processados
 *
 * O arquivo definido em $base &eacute; lido como um objeto map. Esse objeto ser&aacute; processado para incluir novos layers e alterar outros par&acirc;metros definidos pelo usu&aacute;rio.
 */
if (file_exists($base)) {
    $map = ms_newMapObj($base);
    $mapn = ms_newMapObj($base);
} else {
    $map = ms_newMapObj($locaplic . "/aplicmap/" . $base . ".map");
    $mapn = ms_newMapObj($locaplic . "/aplicmap/" . $base . ".map");
}
/*
 * Par&acirc;metros adicionais.
 *
 * Processa os par&acirc;metros para a inicializa&ccedil;&atilde;o verificando se foram passados pela URL ou n&atilde;o.
 */
if (! isset($mapext)) {
    $mapext = $map->extent->minx . " " . $map->extent->miny . " " . $map->extent->maxx . " " . $map->extent->maxy;
}
// arquivo com a imagem de refer&ecirc;ncia
if (! isset($map_reference_image)) {
    $map_reference_image = $map->reference->image;
    //verifica o caminho
    if(!file_exists($map_reference_image)){
        $map_reference_image = $locaplic . "/imagens/" . basename($map_reference_image);
    }
}
// extens&atilde;o geogr&aacute;fica da imagem do mapa de refer&ecirc;ncia
if (! isset($map_reference_extent)) {
    $map_reference_extent = $map->reference->extent->minx . " " . $map->reference->extent->miny . " " . $map->reference->extent->maxx . " " . $map->reference->extent->maxy;
}
if (empty($interface)) {
    if (! isset($interfacePadrao)) {
        $interfacePadrao = "ol.htm";
    }
    $interface = $interfacePadrao;
}

if (isset($layers) && ! isset($temasa)) {
    $temasa = $layers;
}

incluiTemasIniciais();

if (isset($layers)) {
    ligaTemas();
}
desligaTemasIniciais();

if (isset($map_reference_image)) {
    $mapn->reference->set("image", $map_reference_image);
}
$extr = $mapn->reference->extent;
if (isset($map_reference_extent)) {
    $temp = explode(" ", $map_reference_extent);
    foreach ($temp as $t) {
        if ($t != "") {
            $newext[] = $t;
        }
    }
    if (count($newext) == 4) {
        $extr->setextent($newext[0], $newext[1], $newext[2], $newext[3]);
    }
}
$ext = $mapn->extent;
$newext = array();
if ((isset($mapext)) && ($mapext != "")) {
    $temp = explode(" ", $mapext);
    foreach ($temp as $t) {
        if ($t != "") {
            $newext[] = $t;
        }
    }
    if (count($newext) == 4) {
        $ext->setextent($newext[0], $newext[1], $newext[2], $newext[3]);
    }
} else {
    // algumas aplicacoes usam essa variavel (SAIKU)
    $mapext = $ext->minx . " " . $ext->miny . " " . $ext->maxx . " " . $ext->maxy;
}

/*
 * Configura os endere&ccedil;os corretos no mapfile.
 *
 * Altera as propriedades imagepath e imageurl corrigindo os caminhos padr&atilde;o conforme o diret&oacute;rio criado para armazenar o mapa de trabalho.
 */

$w = $mapn->web;
$atual = $w->imagepath;
$w->set("imagepath", $atual . $diretorios[2] . "/");
$atual = $w->imageurl;
$w->set("imageurl", $atual . $diretorios[2] . "/");

$projecao = pegaProjecaoDefault("proj4");
if ($projecao != "") {
    $mapn->setProjection($projecao);
}
// aplica o tamanho do mapa
if (isset($parurl["largura"]) && isset($parurl["altura"])) {
    $mapn->setsize($parurl["largura"], $parurl["altura"]);
}

$tmpfname = str_replace(".map", "", $tmpfname) . ".map";
$salvo = $mapn->save($tmpfname);

$_SESSION["imgurl"] = strtolower($protocolo[0]) . "://" . $_SERVER['HTTP_HOST'] . $atual . $diretorios[2] . "/";
$_SESSION["tmpurl"] = strtolower($protocolo[0]) . "://" . $_SERVER['HTTP_HOST'] . $atual;
$_SESSION["map_file"] = $tmpfname;
$_SESSION["mapext"] = $mapext;
if (isset($wkt)) {
    insereWKTUrl();
}

if (isset($pontos)) {
    inserePontosUrl();
}

if (isset($linhas)) {
    insereLinhasUrl();
}

if (isset($poligonos)) {
    inserePoligonosUrl();
}

if (isset($url_wms)) {
    incluiTemaWms();
}

adaptaLayers($tmpfname, $versao);
if ($interface != "mashup") {
    abreInterface($interface, $caminho);
}

/*
 * Adapta os dados de cada layer.
 *
 * Faz altera&ccedil;&otilde;es em cada layer caso sejam necess&aacute;rias.
 */
function adaptaLayers($tmpfname, $versao)
{
    global $parurl;
    $mapa = ms_newMapObj($tmpfname);
    $path = $mapa->shapepath;
    $numlayers = $mapa->numlayers;
    for ($i = 0; $i < $numlayers; ++ $i) {
        $layer = $mapa->getLayer($i);
        $ok = true;
        if ($layer->connection == "") {
            $ok = false;
            $d = $layer->data;
            if ((file_exists($d)) || (file_exists($d . ".shp"))) {
                $ok = true;
            } else {
                if ((file_exists($path . "/" . $d)) || (file_exists($path . "/" . $d . ".shp"))) {
                    $ok = true;
                }
            }
        }
        if ($ok == false) {
            $layer->set("status", MS_OFF);
        }
        // para impedir erros na legenda
        if ($layer->getmetadata("classe") == "") {
            $layer->setmetadata("classe", "");
        }
        if ($versao > 5) {
            $pr = $layer->getProcessing();
            if (! in_array("LABEL_NO_CLIP=True", $pr)) {
                $layer->setprocessing("LABEL_NO_CLIP=True");
            }
            if (! in_array("POLYLINE_NO_CLIP=True", $pr)) {
                $layer->setprocessing("POLYLINE_NO_CLIP=True");
            }
        }
        //
        // verifica se deve aplicar filtro
        //
        $filtro = @$parurl["map_layer_" . $layer->name . "_filter"];
        if (! empty($filtro)) {
            $layer->setmetadata("CACHE", "nao");
            $layer->setfilter($filtro);
        }
        corrigeLayerPath($layer, $mapa);
    }
    $mapa->save($tmpfname);
    erroCriacao();
}

/*
 * Redireciona para o HTML definido em $interface, abrindo o mapa
 */
function abreInterface($interface, $caminho)
{
    global $customDir;
    if(empty($customDir)){
        $customDir = "interface";
    }
    $nomeInterface = explode(".", basename($interface));
    if (count(explode(".xphp", $interface)) > 1) {
        if (file_exists($caminho . $customDir . "/" . $interface)) {
            include_once ($caminho . $customDir . "/" . $interface);
        }
        exit();
    } else {
        //para efeitos de compatibilidade
        $interface = str_replace("ol.htm","ol.php",$interface);
        $interface = str_replace("osm.htm","osm.php",$interface);
        if (file_exists($caminho . $customDir . "/" . $interface)) {
            $urln = $caminho . $customDir . "/" . $interface . "?&" . session_id();
        } else {
            $urln = $interface . "?&" . session_id();
        }
        //echo $urln;exit;
        if (! headers_sent()) {
            header("Location:" . $urln);
        } else {
            echo "<meta http-equiv='refresh' content='0;url=$urln'>";
        }
    }
}

/*
 * Desliga os temas definidos na vari&aacute;vel $desligar
 */
function desligaTemasIniciais()
{
    global $desligar, $temasa, $layers, $mapn;
    //para evitar LAYERS com status MS_DEFAULT
    if(!isset($desligar)){
        $lista = array_diff(explode(" ", $temasa),explode(" ", $layers));
    } else {
        $layersdesligar = str_replace(',', " ", $desligar);
        $lista = explode(" ", $layersdesligar);
    }
    foreach ($lista as $l) {
        if ($l == "") {
            continue;
        }
        if (@$mapn->getLayerByName($l)) {
            $layern = $mapn->getLayerByName($l);
            $layern->set("status", MS_OFF);
        }
        $grupos = $mapn->getLayersIndexByGroup($l);
        if (count($grupos) > 0) {
            for ($i = 0; $i < count($grupos); ++ $i) {
                $layern = $mapn->getLayer($grupos[$i]);
                if (strtolower($layern->group) == strtolower($l)) {
                    $layern->set("status", MS_OFF);
                }
            }
        }
    }
    erroCriacao();
}

/*
 * Liga os temas definidos na vari&aacute;vel $layers
 */
function ligaTemas()
{
    global $layers, $mapn;
    if (isset($layers)) {
        $layers = str_replace(',', " ", $layers);
        $lista = explode(" ", $layers);
        foreach ($lista as $l) {
            if ($l == "") {
                continue;
            }
            if (@$mapn->getLayerByName($l)) {
                $layern = $mapn->getLayerByName($l);
                $layern->set("status", MS_DEFAULT);
            }
            $grupos = $mapn->getLayersIndexByGroup($l);
            if (count($grupos) > 0) {
                for ($i = 0; $i < count($grupos); ++ $i) {
                    $layern = $mapn->getLayer($grupos[$i]);
                    if (strtolower($layern->group) == strtolower($l)) {
                        $layern->set("status", MS_DEFAULT);
                    }
                }
            }
        }
    }
    erroCriacao();
}

/*
 * Inclui os temas definidos na vari&aacute;vel $temasa
 *
 * Os temas devem estar em i3geo/temas
 */
function incluiTemasIniciais()
{
    global $temasa, $mapn, $locaplic, $metaestatids, $layers;
    if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
        $temasdir = $locaplic . "\\temas";
    } else {
        $temasdir = $locaplic . "/temas";
    }
    if (! isset($temasa)) {
        $temasa = "";
    }
    $temasa = str_replace(',', " ", $temasa);
    $alayers = explode(" ", $temasa);
    if (isset($metaestatids)) {
        // localhost/i3geo/ms_criamapa.php?metaestatids=25,12&layers=25
        include_once (dirname(__FILE__) . "/classesphp/classe_metaestatinfo.php");
        $metaestatids = str_replace(',', " ", $metaestatids);
        $metaestatids = explode(" ", $metaestatids);
        $metaestatidsligados = $layers;
        $metaestatidsligados = str_replace(',', " ", $metaestatidsligados);
        $metaestatidsligados = explode(" ", $metaestatidsligados);
        foreach ($metaestatids as $metaestatid) {
            if(!file_exists($_SESSION["dir_tmp"]."/metaestatTempInit".$metaestatid.".map")){
                $m = new MetaestatInfo();
                $parametros = $m->listaParametro($metaestatid, "", "", true, true);
                // id_parametro_medida,coluna
                $filtroPar = array();
                $tituloPar = array();
                foreach ($parametros as $parametro) {
                    $valoresparametro = $m->valorUnicoMedidaVariavel($metaestatid, $parametro["coluna"]);
                    //var_dump($valoresparametro);
                    //exit();
                    $valormaior = $valoresparametro[count($valoresparametro) - 1];
                    $filtroPar[] = " " . $parametro["coluna"] . "::text = '" . $valormaior[$parametro["coluna"]] . "' ";
                    $tituloPar[] = $parametro["coluna"] . ": " . $valormaior[$parametro["coluna"]];
                }
                $dadosMedida = $m->listaMedidaVariavel("", $metaestatid);
                // var_dump($dadosMedida);exit;
                $tituloCamada = mb_convert_encoding($dadosMedida["nomemedida"],"ISO-8859-1",mb_detect_encoding($dadosMedida["nomemedida"]));
                if(count($tituloPar)>0){
                    $tituloCamada = $tituloCamada." (".implode(" ,",$tituloPar)." )";
                }
                $mapfilemetaestat = $m->mapfileMedidaVariavel($metaestatid, implode(" AND ", $filtroPar), 0, "polygon", $tituloCamada, "", "", "", "", false, true,$_SESSION["dir_tmp"]."/metaestatTempInit".$metaestatid.".map");
            } else {
                $mapfilemetaestat = array(
                    "mapfile" => $_SESSION["dir_tmp"]."/metaestatTempInit".$metaestatid.".map",
                    "layer" => "metaestatTempInit".$metaestatid
                );
            }
            // array(3) { ["mapfile"]=> string(52) "/tmp/ms_tmp/AAAAc20ad4d76fe97759aa27a0c99bff6710.map" ["layer"]=> string(36) "AAAAc20ad4d76fe97759aa27a0c99bff6710" ["titulolayer"]=> string(0) "" }
            // var_dump ($mapfilemetaestat);
            // exit;
            array_push($alayers, $mapfilemetaestat["mapfile"]);

            if (in_array($metaestatid, $metaestatidsligados)) {
                $maptemp = @ms_newMapObj($mapfilemetaestat["mapfile"]);
                $maptemp->getlayerbyname($mapfilemetaestat["layer"])->set("status", MS_DEFAULT);
                $maptemp->save($mapfilemetaestat["mapfile"]);
            }
        }
    }

    $existeraster = false;
    foreach ($alayers as $arqt) {
        $arqtemp = "";
        $arqt = trim($arqt);
        if ($arqt == "") {
            continue;
        }
        $extensao = ".map";
        if (file_exists($arqt)) {
            $arqtemp = $arqt;
        }
        if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($locaplic . "\\aplicmap\\" . $arqt . $extensao))) {
            $arqtemp = $locaplic . "\\aplicmap\\" . $arqt . $extensao;
        } elseif (file_exists($locaplic . "/aplicmap/" . $arqt . $extensao)) {
            $arqtemp = $locaplic . "/aplicmap/" . $arqt . $extensao;
        }
        if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($temasdir . "\\" . $arqt . $extensao))) {
            $arqtemp = $temasdir . "\\" . $arqt . $extensao;
        } elseif (file_exists($temasdir . "/" . $arqt . $extensao)) {
            $arqtemp = $temasdir . "/" . $arqt . $extensao;
        }
        if ($arqtemp == "") {
            // echo "<br>Imposs&iacute;vel acessar tema $arqtemp";
        } else {
            if ($extensao == ".map" && ! @ms_newMapObj($arqtemp)) {
                echo "<br>Problemas com a camada $arqtemp<br>";
            } else {
                $maptemp = @ms_newMapObj($arqtemp);
                for ($i = 0; $i < ($maptemp->numlayers); ++ $i) {
                    // error_reporting(0);
                    $layern = $maptemp->getLayer($i);
                    if ($layern->type == MS_LAYER_RASTER) {
                        $existeraster = true;
                    }
                    if ($layern->name == "estadosl") {
                        $layern->set("data", $locaplic . "/aplicmap/dados/estados.shp");
                    }
                    $layern->setmetadata("nomeoriginal", $layern->name);
                    $nNome = str_replace(".map", "", basename($arqtemp));
                    $layern->setmetadata("arquivotemaoriginal", $nNome);
                    autoClasses($layern, $mapn);
                    //
                    // necess&aacute;rio para n&atilde;o alterar a extens&atilde;o do mapa por esse par&acirc;metro
                    //
                    $layern->setmetadata("aplicaextensao", "");
                    // cria e aplica sld se for wms e existirem classes
                    if ($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == "") {
                        $tipotemp = $layern->type;
                        $statustemp = $layern->status;
                        $tiporep = $layern->getmetadata("tipooriginal");
                        $layern->set("type", MS_LAYER_POLYGON);
                        if ($tiporep == "linear") {
                            $layern->set("type", MS_LAYER_LINE);
                        }
                        if ($tiporep == "pontual") {
                            $layern->set("type", MS_LAYER_POINT);
                        }
                        $layern->set("status", MS_DEFAULT);
                        $sld = $layern->generateSLD();
                        if ($sld != "")
                            $layern->setmetadata("wms_sld_body", str_replace('"', "'", $sld));
                        $layern->set("type", $tipotemp);
                        $layern->set("status", $statustemp);
                    }
                    cloneInlineSymbol($layern, $maptemp, $mapn);
                    //$layerAdicionado = ms_newLayerObj($mapn, $layern);
                    if($layern->type == MS_LAYER_POLYGON && $layern->getmetadata("METAESTAT") == "SIM"){
                        $mapn->insertLayer($layern,0);
                    } else {
                        $mapn->insertLayer($layern,-1);
                    }
                    // echo $layern->name;
                    //corrigeLayerGrid($layern, $layerAdicionado);
                    corrigeLayerGrid($layern, $mapn->getlayerbyname($layern->name));
                }
            }
        }
    }
    erroCriacao();
}

/*
 * Cria os arquivos vazios index.htm e index.html nos diretorios tempor&aacute;rios
 */
function criaIndex($dir_tmp, $diretorios)
{
    if (! file_exists($dir_tmp . "/index.htm")) {
        $f = fopen($dir_tmp . "/index.htm", "x");
        fclose($f);
        $f = fopen($dir_tmp . "/index.html", "x");
        fclose($f);
        $f = fopen($dir_tmp . "/" . $diretorios[1] . "/index.html", "x");
        fclose($f);
        $f = fopen($dir_tmp . "/" . $diretorios[1] . "/index.htm", "x");
        fclose($f);
        $f = fopen($dir_tmp . "/" . $diretorios[2] . "/index.html", "x");
        fclose($f);
        $f = fopen($dir_tmp . "/" . $diretorios[2] . "/index.htm", "x");
        fclose($f);
    }
    if (! file_exists($dir_tmp . "/index.htm")) {
        echo "Erro. N&atilde;o foi poss&iacute;vel gravar no diret&oacute;rio tempor&aacute;rio";
        exit();
    }
}

/*
 * Mostra a mensagem de aguarde
 */
function mostraAguarde()
{
    global $interface, $mensagemInicia, $tituloInstituicao;
    if (! isset($interface)) {
        echo "<html><head>";
        echo '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"></head>';
        echo "<title>" . $tituloInstituicao . "</title>";
        echo '<div id="aguarde"><center>';
        echo '<p class=paguarde style="font-family: Verdana, Arial, Helvetica, sans-serif;color:black;text-align:center;font-size:12pt"><b>' . $mensagemInicia . '</b><br> Aguarde...preparando o mapa</p>';
        echo '<table><tr>';
        echo "<td colspan=3 ><center><img src='" . dirname(__FILE__) . "/imagens/i3geo1.jpg'></td></tr>";
        echo "<tr><td><center><img src='" . dirname(__FILE__) . "/imagens/pspb.png'></td>";
        echo "<td><center><img src='" . dirname(__FILE__) . "/imagens/mapserv.png'></td>";
        echo "<td><center><img src='" . dirname(__FILE__) . "/imagens/yui-logo.png'></td>";
        echo "<td><center><a href='http://mapas.mma.gov.br/download' target=blank ><img src='" . dirname(__FILE__) . "/imagens/somerights20_pt.gif' ></a></td>";
        echo "</tr></table>";
        echo '<BODY bgcolor="white" style="background-color:white">';
    }
}

/*
 * Insere elementos no mapa a partir de uma string definida em wkt
 */
function insereWKTUrl()
{
    global $tamanhosimbolo, $simbolo, $corsimbolo, $wkt, $nometemawkt, $dir_tmp, $imgdir, $tmpfname, $locaplic;
    include_once "pacotes/phpxbase/api_conversion.php";
    if (! isset($nometemapontos)) {
        $nometemapontos = "WKT";
    }
    if ($nometemapontos == "") {
        $nometemapontos = "WKT";
    }
    //
    // cria o shape file
    //
    $shape = ms_shapeObjFromWkt($wkt);
    $tipol = $shape->type;
    if ($tipol == 0) {
        $tipol = 3;
    }
    $nomeshp = $dir_tmp . "/" . $imgdir . "/wkts";
    // cria o dbf
    $def = array();
    $items = array(
        "COORD"
    );
    foreach ($items as $ni) {
        $def[] = array(
            $ni,
            "C",
            "254"
        );
    }
    if (! function_exists(dbase_create)) {
        xbase_create($nomeshp . ".dbf", $def);
    } else {
        dbase_create($nomeshp . ".dbf", $def);
    }
    $dbname = $nomeshp . ".dbf";
    $db = xbase_open($dbname, 2);
    if ($tipol == 1) {
        $novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_ARC);
    }
    if ($tipol == 3) {
        $novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_MULTIPOINT);
    }
    if ($tipol == 2) {
        $novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);
    }
    $reg[] = "";
    $novoshpf->addShape($shape);
    xbase_add_record($db, $reg);
    $novoshpf->free();
    xbase_close($db);
    // adiciona o layer
    $mapa = ms_newMapObj($tmpfname);
    $layer = ms_newLayerObj($mapa);
    $layer->set("name", "wktins");
    $layer->set("data", $nomeshp . ".shp");
    $layer->setmetadata("DOWNLOAD", "sim");
    $layer->setmetadata("temalocal", "sim");
    $layer->setmetadata("tema", $nometemawkt);
    $layer->setmetadata("classe", "sim");
    $layer->set("type", $shape->type);
    $layer->set("status", MS_DEFAULT);
    $classe = ms_newClassObj($layer);
    $classe->set("name", " ");
    $estilo = ms_newStyleObj($classe);
    if ($shape->type == 0) {
        if (! isset($simbolo))
            $estilo->set("symbolname", "ponto");
        if (! isset($tamanhosimbolo))
            $estilo->set("size", 6);
    }
    if ($shape->type == 1) {
        if (! isset($simbolo))
            //$estilo->set("symbolname", "linha");
        if (! isset($tamanhosimbolo))
            $estilo->set("width", 3);
    }
    if ($shape->type == 2) {
        $layer->set("opacity", "50");
    }

    $cor = $estilo->color;
    if (! isset($corsimbolo)) {
        $corsimbolo = "255,0,0";
    }
    $corsimbolo = str_replace(" ", ",", $corsimbolo);
    $corsimbolo = explode(",", $corsimbolo);
    $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);

    $salvo = $mapa->save($tmpfname);
    erroCriacao();
}

/*
 * Insere um tema do tipo ponto
 *
 */
function inserePontosUrl()
{
    global $pontos, $tamanhosimbolo, $simbolo, $corsimbolo, $nometemapontos, $dir_tmp, $imgdir, $tmpfname, $locaplic;
    include_once "pacotes/phpxbase/api_conversion.php";
    if (! isset($nometemapontos)) {
        $nometemapontos = "Pontos";
    }
    if ($nometemapontos == "") {
        $nometemapontos = "Pontos";
    }
    //
    // cria o shape file
    //
    $tipol = MS_SHP_POINT;
    $nomeshp = $dir_tmp . "/" . $imgdir . "/" . nomeRandomico();
    // cria o dbf
    $def = array();
    $items = array(
        "COORD"
    );
    foreach ($items as $ni) {
        $def[] = array(
            $ni,
            "C",
            "254"
        );
    }
    if (! function_exists(dbase_create)) {
        xbase_create($nomeshp . ".dbf", $def);
    } else {
        dbase_create($nomeshp . ".dbf", $def);
    }
    $dbname = $nomeshp . ".dbf";
    $db = xbase_open($dbname, 2);
    $novoshpf = ms_newShapefileObj($nomeshp, $tipol);
    $pontos = explode(" ", trim($pontos));
    if (count($pontos) == 1) {
        $pontos = explode(",", trim($pontos[0]));
    }
    foreach ($pontos as $p) {
        if (is_numeric($p)) {
            $pontosn[] = $p;
        }
    }
    $pontos = $pontosn;
    for ($ci = 0; $ci < count($pontos); $ci = $ci + 2) {
        $reg = array();
        $reg[] = $pontos[$ci] . " " . $pontos[$ci + 1];
        $shape = ms_newShapeObj($tipol);
        $linha = ms_newLineObj();
        $linha->addXY($pontos[$ci], $pontos[$ci + 1]);
        $shape->add($linha);
        $novoshpf->addShape($shape);
        xbase_add_record($db, $reg);
    }
    $novoshpf->free();
    xbase_close($db);
    // adiciona o layer
    $mapa = ms_newMapObj($tmpfname);
    $layer = ms_newLayerObj($mapa);
    $layer->set("name", "pontoins");
    $layer->set("data", $nomeshp . ".shp");
    $layer->setmetadata("DOWNLOAD", "sim");
    $layer->setmetadata("tema", $nometemapontos);
    $layer->setmetadata("classe", "sim");
    $layer->setmetadata("temalocal", "sim");
    $layer->setmetadata("ATLAS", "nao");
    $layer->set("type", MS_LAYER_POINT);
    $layer->set("status", MS_DEFAULT);
    $classe = ms_newClassObj($layer);
    $classe->set("name", " ");
    $estilo = ms_newStyleObj($classe);

    if (! isset($simbolo)) {
        $simbolo = "ponto";
    }
    $estilo->set("symbolname", $simbolo);
    if (! isset($tamanhosimbolo)) {
        $tamanhosimbolo = 6;
    }
    $estilo->set("size", $tamanhosimbolo);
    $cor = $estilo->color;
    if (! isset($corsimbolo)) {
        $corsimbolo = "255,0,0";
    }
    $corsimbolo = str_replace(" ", ",", $corsimbolo);
    $corsimbolo = explode(",", $corsimbolo);
    $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);

    $salvo = $mapa->save($tmpfname);
    erroCriacao();
}

/*
 * Insere um tema do tipo linear
 *
 * As linhas devem ter os pontos separados por espa&ccedil;os e cada linha separada por v&iacute;rgula
 *
 */
function insereLinhasUrl()
{
    global $tamanhosimbolo, $simbolo, $corsimbolo, $linhas, $nometemalinhas, $dir_tmp, $imgdir, $tmpfname, $locaplic;
    include_once "pacotes/phpxbase/api_conversion.php";
    if (! isset($nometemalinhas)) {
        $nometemalinhas = "Linhas";
    }
    if ($nometemalinhas == "") {
        $nometemalinhas = "Linhas";
    }
    //
    // cria o shape file
    //
    $tipol = MS_SHP_ARC;
    $nomeshp = $dir_tmp . "/" . $imgdir . "/" . nomeRandomico();
    // cria o dbf
    $def = array();
    $items = array(
        "COORD"
    );
    foreach ($items as $ni) {
        $def[] = array(
            $ni,
            "C",
            "254"
        );
    }
    if (! function_exists(dbase_create)) {
        xbase_create($nomeshp . ".dbf", $def);
    } else {
        dbase_create($nomeshp . ".dbf", $def);
    }
    $dbname = $nomeshp . ".dbf";
    $db = xbase_open($dbname, 2);
    $novoshpf = ms_newShapefileObj($nomeshp, $tipol);
    $linhas = explode(",", trim($linhas));
    $pontosLinhas = array(); // guarda os pontos de cada linha em arrays
    foreach ($linhas as $l) {
        $tempPTs = explode(" ", trim($l));
        $temp = array();
        foreach ($tempPTs as $p) {
            if (is_numeric($p)) {
                $temp[] = $p;
            }
        }
        $pontosLinhas[] = $temp;
    }
    foreach ($pontosLinhas as $ptsl) {
        $linhas = $ptsl;
        $shape = ms_newShapeObj(MS_SHAPE_LINE);
        $linha = ms_newLineObj();
        $reg = array();
        $reg[] = implode(",", $ptsl);
        for ($ci = 0; $ci < count($linhas); $ci = $ci + 2) {
            $linha->addXY($linhas[$ci], $linhas[$ci + 1]);
        }
        $shape->add($linha);
        $novoshpf->addShape($shape);
        xbase_add_record($db, $reg);
    }
    $novoshpf->free();
    xbase_close($db);
    // adiciona o layer
    $mapa = ms_newMapObj($tmpfname);
    $layer = ms_newLayerObj($mapa);
    $layer->set("name", "linhains");
    $layer->set("data", $nomeshp . ".shp");
    $layer->setmetadata("DOWNLOAD", "sim");
    $layer->setmetadata("temalocal", "sim");
    $layer->setmetadata("tema", $nometemalinhas);
    $layer->setmetadata("classe", "sim");
    $layer->setmetadata("ATLAS", "nao");
    $layer->set("type", MS_LAYER_LINE);
    $layer->set("status", MS_DEFAULT);
    $classe = ms_newClassObj($layer);
    $classe->set("name", " ");
    $estilo = ms_newStyleObj($classe);

    if (isset($simbolo)) {
        $simbolo = "linha";
        $estilo->set("symbolname", $simbolo);
    }
    if (! isset($tamanhosimbolo)) {
        $tamanhosimbolo = 4;
    }
    $estilo->set("width", $tamanhosimbolo);
    $cor = $estilo->color;
    if (! isset($corsimbolo)) {
        $corsimbolo = "255,0,0";
    }
    $corsimbolo = str_replace(" ", ",", $corsimbolo);
    $corsimbolo = explode(",", $corsimbolo);
    $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);

    $salvo = $mapa->save($tmpfname);
    erroCriacao();
}

/*
 * Insere um tema poligonal.
 *
 * Os pol&iacute;gonos devem ter os pontos separados por espa&ccedil;os e cada pol&iacute;gono separado por v&iacute;rgula
 */
function inserePoligonosUrl()
{
    global $tamanhosimbolo, $simbolo, $corsimbolo, $poligonos, $nometemapoligonos, $dir_tmp, $imgdir, $tmpfname, $locaplic;
    include_once "pacotes/phpxbase/api_conversion.php";
    if (! isset($nometemapoligonos)) {
        $nometemapoligonos = "Poligonos";
    }
    if ($nometemapoligonos == "") {
        $nometemapoligonos = "Poligonos";
    }
    //
    // cria o shape file
    //
    $tipol = MS_SHP_POLYGON;
    $nomeshp = $dir_tmp . "/" . $imgdir . "/" . nomeRandomico();
    // cria o dbf
    $def = array();
    $items = array(
        "COORD"
    );
    foreach ($items as $ni) {
        $def[] = array(
            $ni,
            "C",
            "254"
        );
    }
    if (! function_exists(dbase_create)) {
        xbase_create($nomeshp . ".dbf", $def);
    } else {
        dbase_create($nomeshp . ".dbf", $def);
    }
    $dbname = $nomeshp . ".dbf";
    $db = xbase_open($dbname, 2);
    $novoshpf = ms_newShapefileObj($nomeshp, $tipol);
    $linhas = explode(",", trim($poligonos));
    $pontosLinhas = array(); // guarda os pontos de cada linha em arrays
    foreach ($linhas as $l) {
        $tempPTs = explode(" ", trim($l));
        $temp = array();
        foreach ($tempPTs as $p)
            if (is_numeric($p)) {
                $temp[] = $p;
            }
        $pontosLinhas[] = $temp;
    }
    foreach ($pontosLinhas as $ptsl) {
        $linhas = $ptsl;
        $shape = ms_newShapeObj(MS_SHAPE_POLYGON);
        $linha = ms_newLineObj();
        $reg = array();
        $reg[] = "";
        for ($ci = 0; $ci < count($linhas); $ci = $ci + 2) {
            $linha->addXY($linhas[$ci], $linhas[$ci + 1]);
        }
        $shape->add($linha);
        $novoshpf->addShape($shape);
        xbase_add_record($db, $reg);
    }
    $novoshpf->free();
    xbase_close($db);
    // adiciona o layer
    $mapa = ms_newMapObj($tmpfname);
    $layer = ms_newLayerObj($mapa);
    $layer->set("name", "linhains");
    $layer->set("data", $nomeshp . ".shp");
    $layer->setmetadata("DOWNLOAD", "sim");
    $layer->setmetadata("temalocal", "sim");
    $layer->setmetadata("tema", $nometemapoligonos);
    $layer->setmetadata("classe", "sim");
    $layer->setmetadata("ATLAS", "nao");
    $layer->set("type", MS_LAYER_POLYGON);
    $layer->set("opacity", "50");
    $layer->set("status", MS_DEFAULT);
    $classe = ms_newClassObj($layer);
    $classe->set("name", " ");
    $estilo = ms_newStyleObj($classe);

    $cor = $estilo->color;
    if (! isset($corsimbolo)) {
        $corsimbolo = "255,0,0";
    }
    $corsimbolo = str_replace(" ", ",", $corsimbolo);
    $corsimbolo = explode(",", $corsimbolo);
    $cor->setRGB($corsimbolo[0], $corsimbolo[1], $corsimbolo[2]);

    $salvo = $mapa->save($tmpfname);
    erroCriacao();
}

/*
 * Inclui no mapa um tema do tipo WMS
 */
function incluiTemaWms()
{
    global $nome_wms, $url_wms, $layer_wms, $style_wms, $srs_wms, $image_wms, $versao_wms, $tmpfname, $locaplic;
    include_once ($locaplic . "/classesphp/classe_mapa.php");
    if (! $nome_wms) {
        $nome = $layer_wms . " " . $style_wms;
    } else
        $nome = $nome_wms;
    $m = new Mapa($tmpfname);
    $m->adicionatemawms($layer_wms, $url_wms, $style_wms, $srs_wms, $image_wms, $locaplic, "", $versao_wms, $nome, "", "", "", "", "nao", "text/plain", "");
    $salvo = $m->salva($tmpfname);
    // echo $tmpfname;exit;
    erroCriacao();
}

/*
 * Projeto gvsig
 */
function incluiMapaGvsig($gvsiggvp, $gvsigview = "")
{}

/*
 * Captura e mostra os erros de processamento do mapserver
 */
function erroCriacao()
{
    $error = ms_GetErrorObj();
    while ($error && $error->code != MS_NOERR) {
        printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
        $error = $error->next();
    }
    ms_ResetErrorList();
}

/*
 * Cria os diret&oacute;rios tempor&aacute;rios para a aplica&ccedil;&atilde;o.
 *
 * Parametro:
 *
 * $dir_tmp {string} - Diret&oacute;rio tempor&aacute;rio (no servidor) utilizado pelo mapserver.
 *
 * $cachedir {string} - Diret&oacute;rio de cache tempor&aacute;rio definido no ms_configura.php
 *
 * Retorno:
 *
 * {boleano}
 */
function criaDirMapa($dir_tmp, $cachedir = "")
{
    if (empty($dir_tmp)) {
        return false;
    }
    if (! file_exists($dir_tmp)) {
        @mkdir($dir_tmp, 0744);
    }
    if (file_exists($dir_tmp)) {
        foreach (glob($dir_tmp . '/{,.}*.php', GLOB_BRACE) as $f) {
            rename($f,str_replace(".php","_php_renomeado_por_ms_criamapa",$f));
        }
        $tmpdirname = nomeRandomico();
        $crdir = @mkdir($dir_tmp . "/" . $tmpdirname, 0744);
        chmod($dir_tmp . "/" . $tmpdirname, 0744);
        $crdiri = @mkdir($dir_tmp . "/img" . $tmpdirname, 0744);
        chmod($dir_tmp . "/img" . $tmpdirname, 0744);
        $mapfile = $dir_tmp . "/" . $tmpdirname . "/" . $tmpdirname . ".map";
        $tmpimgname = "img" . $tmpdirname;
        if (! file_exists($dir_tmp . "/comum")) {
            @mkdir($dir_tmp . "/comum", 0744);
        }
        if (! file_exists($dir_tmp . "/saiku-datasources")) {
            // utilizado para armazenar os arquivos de fonte de dados do SAIKU
            @mkdir($dir_tmp . "/saiku-datasources", 0744);
            chmod($dir_tmp . "/saiku-datasources", 0744);
        }
        //
        if ($cachedir == "") {
            if (! file_exists($dir_tmp . "/cache")) {
                @mkdir($dir_tmp . "/cache", 0744);
                chmod($dir_tmp . "/cache", 0744);
                @mkdir($dir_tmp . "/cache/googlemaps", 0744);
                chmod($dir_tmp . "/cache/googlemaps", 0744);
            }
        } else {
            if (! file_exists($cachedir)) {
                @mkdir($cachedir, 0744);
                chmod($cachedir, 0744);
                @mkdir($cachedir . "/googlemaps", 0744);
                chmod($cachedir . "/googlemaps", 0744);
            }
        }
        if (file_exists($dir_tmp . "/" . $tmpdirname)) {
            return array(
                $mapfile,
                $tmpdirname,
                $tmpimgname
            );
        } else {
            return false;
        }
    } else {
        return false;
    }
}
?>