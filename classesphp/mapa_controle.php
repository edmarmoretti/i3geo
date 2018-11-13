<?php
/*
 * Title: mapa_controle.php
 *
 * Controle das requisi&ccedil;&otilde;es em Ajax feitas pelas interfaces normais do i3geo
 *
 * Recebe as requisi&ccedil;&otilde;es feitas em JavaScript (AJAX) e retorna o resultado para a interface.
 *
 * As principais vari&aacute;veis necess&aacute;rias s&atilde;o obtidas da se&ccedil;&atilde;o, definida na inicializa&ccedil;&atilde;o do I3Geo.
 *
 * Se a vari&aacute;vel $map_file n&atilde;o for enviada, o retorno &eacute; uma mensagem linkquebrado e o fim do programa.
 *
 * Para utilizar esse programa fora do i3Geo, envie o par&acirc;metro "map_file=''", dessa forma, evita-se a mensagem de link quebrado.
 *
 * O par&acirc;metro "funcao" define qual a opera&ccedil;&atilde;o que ser&aacute; executada (veja exemplo abaixo). Esse par&acirc;metro &eacute; verificado em um bloco "switch ($funcao)".
 *
 * Sequ&ecirc;ncia de opera&ccedil;&otilde;es:
 *
 * pega as vari&aacute;veis get ou post->
 *
 * pega as vari&aacute;veis da se&ccedil;&atilde;o->
 *
 * verifica se o debug deve ser ativado->
 *
 * carrega as extens&otilde;es do PHP->
 *
 * cria o objeto cpaint->
 *
 * carrega as fun&ccedil;&otilde;es de uso mais comuns->
 *
 * faz uma c&oacute;pia de seguran&ccedil;a do map_file->
 *
 * roda a fun&ccedil;&atilde;o desejada->
 *
 * retorna os valores obtidos
 *
 * Licenca:
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
 * Este programa &eacute; distribu&iacute;do na expectativa
 * de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo:
 *
 * i3geo/classesphp/mapa_controle.php
 *
 * Parametros:
 *
 * funcao - op&ccedil;&atilde;o que ser&aacute; executada (veja abaixo a lista de Valores que esse par&acirc;metro pode assumir).
 *
 * Retorno:
 *
 * O resultado da opera&ccedil;&atilde;o ser&aacute; retornado em um objeto CPAINT.
 *
 * A constru&ccedil;&atilde;o da string JSON &eacute; feita preferencialmente pelas fun&ccedil;&otilde;es nativas do PHP.
 * Para efeitos de compatibilidade, uma vez que at&eacute; a vers&atilde;o 4.2 a string JSON era construida pelo CPAINT,
 * o objeto CPAINT ainda &eacute; definido, por&eacute;m, a fun&ccedil;&atilde;o cpjson verifica se as fun&ccedil;&otilde;es nativas do PHPO (json)
 * est&atilde;o instaladas, se estiverem, utiliza-se a fun&ccedil;&atilde;o nativa, se n&atilde;o, utiliza-se o CPAINT para gerar o JSON.
 *
 * Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):
 *
 * var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid
 *
 * var cp = new cpaint()
 *
 * cp.set_response_type("JSON")
 *
 * cp.call(p,"lente",ajaxabrelente)
 *
 * Vari&aacute;veis de Se&ccedil;&atilde;o:
 *
 * dir_tmp - diret&oacute;rio, no servidor, tempor&aacute;rio utilizado pelo I3Geo, exemplo: c:/ms4w/tmp/ms_tmp
 * locmapserv - localiza&ccedil;&atilde;o, no servidor, do CGI, exemplo: /cgi-bin/mapserv.exe
 * locaplic - localiza&ccedil;&atilde;o, no servidor, do I3Geo, exemplo: c:/ms4w/apache/htdocs/i3geo
 * R_path - localiza&ccedil;&atilde;o, no servidor, do execut&aacute;vel do pacote R, exemplo: c:/ms4w/apache/htdocs/i3geo/pacotes/r/win/bin/R.exe
 * imgurl - url das imagens geradas pelo mapa, exemplo: http://localhost/ms_tmp/imgTVHbdijFMk/
 * tmpurl - url do diret&oacute;rio tempor&aacute;rio, exemplo: http://localhost/ms_tmp/
 * map_file - endere&ccedil;o, no servidor, do mapfile atual, exemplo: c:/ms4w/tmp/ms_tmp/TVHbdijFMk/TVHbdijFMk.map
 * mapext - extens&atilde;o geogr&aacute;fica do mapa atual, exemplo: -76.5125927 -39.3925675209 -29.5851853 9.49014852081
 * perfil - nome do perfil para controlar os temas que ser&atilde;o vis&iacute;veis na lista de temas.
 * mapdir - localiza&ccedil;&atilde;o, no servidor, do diret&oacute;rio com o mapfile tempor&aacute;rio do mapa atual.
 * imgdir - localiza&ccedil;&atilde;o, no servidor, das imagens tempor&aacute;rias do mapa atual.
 * debug - (pode ser definido como "sim" indica se o erro_reporting deve ser definido como E_ALL
 * contadorsalva - indica quantas vezes o mapa j&aacute; foi salvo. Permite que uma aplica&ccedil;&atilde;o verifique se o mapa foi alterado ou n&atilde;o.
 */
// error_reporting(0);

// sleep(5);

//
// pega as variaveis passadas com get ou post
//
error_reporting(0);
$tempo = microtime(1);

include_once ("sani_request.php");
$_pg = array_merge($_GET, $_POST);

if (isset($_pg["interface"])) {
    $interface = $_pg["interface"];
    $interfaceTemp = $interface;
}
if (isset($_pg["funcao"])) {
    $funcao = $_pg["funcao"];
}
if (isset($_pg["g_sid"])) {
    $g_sid = $_pg["g_sid"];
}
//
// inicializa a sessao
// algumas funcoes sao utilizadas por outros aplicativos e por isso
// nao passam por essa critica
// TEMA2SLD e usado por datadownload.htm
// PEGAMAPAS e utilizado em varias funcoes
//
if ($funcao != "listaEpsg" && $funcao != "pegaTodosTemas" && $funcao != "download3" && $funcao != "listainterfaces" && $funcao != "pegalistadetemas" && $funcao != "pegalistadeSubgrupos" && $funcao != "procurartemasestrela" && $funcao != "pegalistadegrupos" && $funcao != "pegalistademenus" && $funcao != "criaMapa" && strtoupper($funcao) != "TEMA2SLD" && strtoupper($funcao) != "PEGAMAPAS") {
    session_name("i3GeoPHP");
    if (isset($g_sid) && $g_sid != "") {
        session_id($g_sid);
    }
    session_start();
    $statusFerramentas = $_SESSION["statusFerramentas"];
    $imgurl = $_SESSION["imgurl"];
    $tmpurl = $_SESSION["tmpurl"];
    $map_file = $_SESSION["map_file"];
    // error_log($map_file);
    $mapext = $_SESSION["mapext"];
    $dir_tmp = $_SESSION["dir_tmp"];
    $cachedir = $_SESSION["cachedir"];
    $emailInstituicao = $_SESSION["emailInstituicao"];
    $locmapserv = $_SESSION["locmapserv"];
    $locaplic = $_SESSION["locaplic"];
    $R_path = $_SESSION["R_path"];
    $mapext = $_SESSION["mapext"];
    $debug = $_SESSION["debug"];
    $ler_extensoes = $_SESSION["ler_extensoes"];
    $postgis_mapa = $_SESSION["postgis_mapa"];
    $perfil = $_SESSION["perfil"];
    $navegadoresLocais = $_SESSION["navegadoresLocais"];
    $utilizacgi = $_SESSION["utilizacgi"];
    $tituloInstituicao = $_SESSION["tituloInstituicao"];
    $expoeMapfile = $_SESSION["expoeMapfile"];
    $googleApiKey = $_SESSION["googleApiKey"];
    $mensagemInicia = $_SESSION["mensagemInicia"];
    $interfacePadrao = $_SESSION["interfacePadrao"];
    $interface = $_SESSION["interface"];
    if (isset($_SESSION["kmlurl"])) {
        $kmlurl = $_SESSION["kmlurl"];
    }

    $mapdir = $_SESSION["mapdir"];
    $imgdir = $_SESSION["imgdir"];
    $i3geoPermiteLogin = $_SESSION["i3geoPermiteLogin"];
    $contadorsalva = $_SESSION["contadorsalva"];
    $i3georendermode = $_SESSION["i3georendermode"];
    $saikuUrl = $_SESSION["saikuUrl"];
    // sao arrays
    $postgis_mapa = $_SESSION["postgis_mapa"];
    $statusFerramentas = $_SESSION["statusFerramentas"];
    if (isset($_SESSION['fingerprint'])) {
        $f = explode(",", $_SESSION['fingerprint']);
        if ($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())) {
            header("HTTP/1.1 403 Tentativa de acesso nao permitida. Inicie um novo mapa.");
            exit();
        }
    }
} else {
    $map_file = "";
    if (isset($g_sid) && $g_sid != "") {
        session_name("i3GeoPHP");
        session_id($g_sid);
        session_start();
        $perfil = $_SESSION["perfil"];
        $_pg["perfil"] = $perfil;
    }
}

//
// isso &eacute; necess&aacute;rio pois a vari&aacute;vel "interface" pode ser utilizada como par&acirc;metro em algumas fun&ccedil;&otilde;es ajax
// nesses casos, &eacute; necess&aacute;rio recuperar o valor correto e n&atilde;o da sess&atilde;o
//
if (isset($interfaceTemp) && $interfaceTemp != "") {
    $_SESSION["interface"] = $interfaceTemp;
    $interface = $interfaceTemp;
}
// error_reporting(0);
//
// teste de timeout
//
// for($i==0;$i<5000000000;++$i){}
//
// ativa o php mapscript e as extens&otilde;es necess&aacute;rias
// se as extens&otilde;es j&aacute; estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais r&aacute;pido
//
include_once ("carrega_ext.php");
if (! function_exists("sobeAnno")) {
    include_once ("funcoes_gerais.php");
}
if ($funcao == "criaMapa") {
    session_name("i3GeoPHP");
    unset($GLOBALS);
    if (session_status() == PHP_SESSION_ACTIVE) {
        // error_log("--------------Apagando a session");
        session_destroy();
        //lembrete: validaAcessoTemas usa cookies
        $_COOKIE = array();
    }

    //
    // primeiro &eacute; necess&aacute;rio carregar o ms_configura.php para pegar a vari&aacute;vel $locaplic
    //
    $d = "";
    include_once (dirname(__FILE__) . "/../ms_configura.php");
    //
    // &eacute; necess&aacute;rio mudar o diret&oacute;rio em fun&ccedil;&atilde;o dos includes que s&atilde;o feitos pelo ms_criamapa.php
    //
    // chdir($locaplic);
    $interfaceTemp = $interface;
    $interface = "mashup";

    include_once (dirname(__FILE__) . "/../ms_criamapa.php");
    if (isset($_SESSION["logExec"])) {
        if(@$_SESSION["logExec"]["controle"] == true){
            i3GeoLog("prog: mapa_controle url: " . implode("&", array_merge($_GET, $_POST)), $_SESSION["dir_tmp"]);
        }
    }
    $_SESSION["interface"] = $interfaceTemp;
    $temp = $_SESSION["map_file"];
    $id = session_id();
    session_write_close();
    // ver funcoes_gerais.php
    validaAcessoTemas($temp);
    cpjson($id);
    return;
}

if (! isset($map_file)) {
    // nesse caso &eacute; necess&aacute;rio criar o diret&oacute;rio tempor&aacute;rio e iniciar o mapa
    // $cp->set_data(array("erro"=>"linkquebrado"));
    // $cp->return_data();
    // cpjson(array("erro"=>"linkquebrado"));
    exit();
}
include_once ("classe_vermultilayer.php");
include_once ("classe_estatistica.php");
// error_reporting(0);
//
// identifica qual a url do i3geo
//

$protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
$protocolo = strtolower($protocolo[0]) . '://' . $_SERVER['HTTP_HOST']; // $_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/classesphp/mapa_controle.php", "", $protocolo . $_SERVER["PHP_SELF"]);

//
// inserido na vers&atilde;o 4.6
//
if (! isset($locaplic)) {
    include_once (dirname(__FILE__) . "/../ms_configura.php");
}
//
// substitui a string de conex&atilde;o
//
if ($funcao != "recuperamapa" && $funcao != "TEMA2SLD") {
    //if (! substituiCon($map_file, $postgis_mapa)) {
    //    cpjson("erro", $cp);
    //    return;
    //}
}

//
// faz a busca da fun&ccedil;&atilde;o que deve ser executada
//

$retorno = ""; // string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao)) {
    /*
     * Section: Inicializa&ccedil;&atilde;o
     *
     * Inicia o mapa.
     */
    /*
     * Valor: INICIA
     *
     * Inicia o mapa, pegando os par&acirc;metros necess&aacute;rios para a montagem inicial.
     *
     * <iniciaMapa>
     */
    case "INICIA":
        include_once ("mapa_inicia.php");
        if (isset($_pg["kmlurl"])) {
            $kmlurl = $_pg["kmlurl"];
        }
        $w = $_pg["w"];
        $h = $_pg["h"];
        iniciaMapa();
        break;
    /*
     * Valor: OPENLAYERS
     *
     * Prepara o mapa atual para funcionar na interface openlayers.
     */
    case "OPENLAYERS":
        $interface = "openlayers";
        include_once ("mapa_inicia.php");
        iniciaMapa();
        break;
    /*
     * Valor: GOOGLEMAPS
     *
     * Prepara o mapa atual para funcionar na interface googlemaps.
     */
    case "GOOGLEMAPS":
        $interface = "googlemaps";
        include_once ("mapa_inicia.php");
        iniciaMapa();
        break;
    /*
     * Valor: GOOGLEEARTH
     *
     * Prepara o mapa atual para funcionar na interface googleearth.
     */
    case "GOOGLEEARTH":
        $interface = "googleearth";
        include_once ("mapa_inicia.php");
        iniciaMapa();
        break;
    /*
     * Valor: CONVERTE2OPENLAYERS
     *
     * Prepara o mapa atual que estava usando outra interface
     */
    case "CONVERTE2OPENLAYERS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->converteInterfacePara("openlayers");
        break;
    /*
     * Valor: CONVERTE2GOOGLEMAPS
     *
     * Prepara o mapa atual que estava usando outra interface
     */
    case "CONVERTE2GOOGLEMAPS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->converteInterfacePara("googlemaps");
        break;
    /*
     * Section: An&aacute;lise
     *
     * An&aacute;lise de dados.
     *
     * <classe_analise.php>
     */
    /*
     * Valor: INCMAPAGEOMETRIAS
     *
     * Inclui geometrias, armazenadas no formato I3Geo, como um tema no mapa atual.
     *
     * O mapfile &eacute; alterado e salvo novamente com os novos layers.
     *
     * <Analise->incmapageometrias>
     */
    case "INCMAPAGEOMETRIAS":
        include_once ("classe_analise.php");
        $m = new Analise($map_file, "");
        $retorno = $m->incmapageometrias($dir_tmp, $imgdir, $_pg["lista"]);
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: FUNCOESGEOMETRIAS
     *
     * Processa geometrias, armazenadas no formato i3Geo, gerando uma nova geometria.
     * Uni&atilde;o, intersec&ccedil;&atilde;o, etc.
     *
     * <Analise->funcoesGeometrias>
     */
    case "FUNCOESGEOMETRIAS":
        include_once ("classe_analise.php");
        $m = new Analise($map_file, "");
        $retorno = $m->funcoesGeometrias($dir_tmp, $imgdir, $_pg["lista"], $_pg["operacao"]);
        if ($_pg["recalcareaper"] == "true") {
            $m->calculaGeometrias($dir_tmp, $imgdir, basename($retorno), "area");
            $m->calculaGeometrias($dir_tmp, $imgdir, basename($retorno), "perimetro");
        }
        break;
    /*
     * Valor: FUNCOESGEOMETRIASWKT
     *
     * Processa geometrias recebidas como WKT gerando uma nova geometria.
     * Uni&atilde;o, intersec&ccedil;&atilde;o, etc.
     *
     * A lista de WKTs deve usar o separador |
     *
     * <Analise->funcoesGeometriasWKT>
     */
    case "FUNCOESGEOMETRIASWKT":
        include_once ("classe_analise.php");
        $m = new Analise($map_file, "");
        $retorno = $m->aplicaFuncaoListaWKT(explode("|", $_pg["geometrias"]), $_pg["operacao"], $dir_tmp, $imgdir);
        break;
    /*
     * Valor: CALCULAGEOMETRIAS
     *
     * Processa geometrias, armazenadas no formato I3Geo, gerando c&aacute;lculos.
     * &Aacute;rea, per&iacute;metro, etc.
     *
     * <Analise->calculaGeometrias>
     */
    case "CALCULAGEOMETRIAS":
        include_once ("classe_analise.php");
        $m = new Analise($map_file, "");
        $retorno = $m->calculaGeometrias($dir_tmp, $imgdir, $_pg["lista"], $_pg["operacao"]);
        break;
    /*
     * Valor: LISTAGEOMETRIAS
     *
     * Gera a lista de geometrias dispon&iacute;veis para o mapa atual.
     *
     * As geometrias s&atilde;o armazenadas no diret&oacute;rio tempor&aacute;rio do usu&aacute;rio, utilizando um formato pr�prio do I3Geo.
     *
     * <Temas->listaGeometrias>
     */
    case "LISTAGEOMETRIAS":
        include_once ("classe_temas.php");
        if (! isset($_pg["tema"])) {
            $_pg["tema"] = "";
        }
        $m = new Temas($map_file, $_pg["tema"]);
        $retorno = $m->listaGeometrias($dir_tmp, $imgdir);
        break;
    /*
     * Valor: CAPTURAGEOMETRIAS
     *
     * Gera um arquivo de geometrias, no formato I3Geo, para um tema, considerando os elementos selecionados.
     *
     * As geometrias s&atilde;o armazenadas no diret&oacute;rio tempor&aacute;rio do usu&aacute;rio, utilizando um formato pr�prio do I3Geo.
     *
     * <Temas->capturaGeometrias>
     */
    case "CAPTURAGEOMETRIAS":
        include_once ("classe_temas.php");
        $m = new Temas($map_file, $_pg["tema"]);
        $retorno = $m->capturaGeometrias($dir_tmp, $imgdir, $_pg["nome"]);
        break;
    /*
     * Section: Mapa
     *
     * <classe_mapa.php>
     */
    /*
     * Valor: PEGAMENSAGENS
     *
     * Pega as mensagens do metadata 'mensagem'.
     *
     * <Mapa->pegaMensagens>
     */
    case "PEGAMENSAGENS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->pegaMensagens();
        break;
    /*
     * Valor: REINICIAMAPA
     *
     * Reinicia um mapa restaurando a c�pia de seguran&ccedil;a.
     */
    case "REINICIAMAPA":
        $qyfile = str_replace(".map", ".qy", $map_file);
        if (file_exists($qyfile)) {
            unlink($qyfile);
        }
        unlink($map_file);
        copy(str_replace(".map", "reinc.map", $map_file), $map_file);
        $retorno = "ok";
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: RECUPERAMAPA
     *
     * Recupera o mapfile de seguran&ccedil;a.
     */
    case "RECUPERAMAPA":
        $qyfile = str_replace(".map", ".qy", $map_file);
        if (file_exists($qyfile)) {
            unlink($qyfile);
        }
        unlink($map_file);
        $nmf = str_replace(".map", "seguranca.map", $map_file);
        if (file_exists($nmf)) {
            copy($nmf, $map_file);
        } else {
            $nmf = str_replace(".map", "reinc.map", $map_file);
            copy($nmf, $map_file);
        }
        $retorno = "ok";
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: ATIVALOGO
     *
     * Ativa ou desativa a marca de logo no mapa.
     *
     * <Mapa->ativalogo>
     */
    case "ATIVALOGO":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);
        $m->ativalogo();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: ATIVALEGENDA
     *
     * Ativa ou desativa a legenda inserida no mapa.
     *
     * <Mapa->ativalegenda>
     */
    case "ATIVALEGENDA":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);
        $m->ativalegenda();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: CONVERTEWS
     *
     * Converte o mapa atual em um wms.
     *
     * <Mapa->converteWS>
     */
    case "CONVERTEWS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        if (! isset($_pg["h"])) {
            $_pg["h"] = "";
        }
        $retorno = $m->converteWS($locaplic, $_pg["h"]);
        break;
    /*
     * Valor: QUERYMAPCOR
     *
     * Altera a cor de sele&ccedil;&atilde;o.
     *
     * <Mapa->corQM>
     */
    case "QUERYMAPCOR":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);
        $m->corQM($_pg["cor"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: CORPO
     *
     * Redesenha o mapa.
     */
    case "CORPO":
        redesenhaMapa();
        break;
    /*
     * Valor: CORPOENTORNO
     *
     * Desenha as imagens do entorno do mapa.
     *
     * <Mapa->redesenhaEntorno>
     */
    case "CORPOENTORNO":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->redesenhaEntorno();
        break;
    /*
     * Valor: ADICIONATEMASHP
     *
     * Adiciona um tema baseado em um arquivo shape file.
     *
     * <Mapa->adicionaTemaSHP>
     */
    case "ADICIONATEMASHP":
        if (! empty($navegadoresLocais)) {
            // verifica se est&aacute; cadastrado
            $ipcliente = pegaIPcliente();
            $retorno = array();
            $ips = array();
            // pega os nomes de cada ip
            include ("../ms_configura.php");
            foreach ($navegadoresLocais["ips"] as $n) {
                $ips[] = gethostbyname($n);
                $ips[] = $n;
            }
            if (in_array($ipcliente, $ips)) {
                $drives = $navegadoresLocais["drives"];
                // pega o caminho
                // nome
                $split = explode("/", $_pg["arq"]);
                if (empty($split[0]) || ! in_array($split[0], array_keys($drives))) {
                    $retorno = array();
                } else {

                    include_once ("classe_mapa.php");
                    copiaSeguranca($map_file);
                    $m = new Mapa($map_file);
                    $path = $split[0];
                    $split[0] = "";
                    $shp = implode("/", $split);
                    $shp = explode(".", $shp);
                    $shp = $shp[0] . ".shp";
                    $path = $drives[$path] . $shp;

                    $retorno = $m->adicionaTemaSHP($path);
                    if ($retorno != "erro") {
                        $m->salva();
                        $_SESSION["contadorsalva"] ++;
                        redesenhaMapa();
                    } else {
                        $retorno = "erro.Nenhum dado espacializado foi encontrado.";
                    }
                }
            } else {
                $retorno = array();
            }
        }
        break;
    /*
     * Valor: ADICIONATEMAIMG
     *
     * Adiciona um tema baseado em um arquivo de imagem.
     *
     * <Mapa->adicionaTemaIMG>
     */
    case "ADICIONATEMAIMG":
        if (! empty($navegadoresLocais)) {
            // verifica se est&aacute; cadastrado
            $ipcliente = pegaIPcliente();
            $retorno = array();
            $ips = array();
            // pega os nomes de cada ip
            include ("../ms_configura.php");
            foreach ($navegadoresLocais["ips"] as $n) {
                $ips[] = gethostbyname($n);
                $ips[] = $n;
            }
            if (in_array($ipcliente, $ips)) {
                $drives = $navegadoresLocais["drives"];
                // pega o caminho
                // nome
                $split = explode("/", $_pg["arq"]);
                if (empty($split[0]) || ! in_array($split[0], array_keys($drives))) {
                    $retorno = array();
                } else {

                    include_once ("classe_mapa.php");
                    copiaSeguranca($map_file);
                    $m = new Mapa($map_file);
                    $path = $split[0];
                    $split[0] = "";
                    $shp = implode("/", $split);
                    $path = $drives[$path] . $shp;
                    error_log($path);
                    $retorno = $m->adicionaTemaIMG($path);
                    if ($retorno != "erro") {
                        $m->salva();
                        $_SESSION["contadorsalva"] ++;
                        redesenhaMapa();
                    } else {
                        $retorno = "erro.Nenhum dado espacializado foi encontrado.";
                    }
                }
            } else {
                $retorno = array();
            }
        }
        break;
    /*
     * Valor: LISTATEMAS
     *
     * Lista os temas existentes em um mapa.
     *
     * <Mapa->listaTemas>
     */
    case "LISTATEMAS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->listaTemas($_pg["tipo"]);
        $retorno = array_reverse($retorno);
        break;
    /*
     * Valor: LISTATEMASLOCAIS
     *
     * Lista os temas existentes no diret&oacute;rio tempor&aacute;rio do mapa atual.
     *
     * <Mapa->listaTemasLocais>
     */
    case "LISTATEMASLOCAIS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->listaTemasLocais();
        break;
    /*
     * Valor: LISTATEMASTIPO
     *
     * Lista os temas existentes por tipo.
     *
     * <Mapa->listaTemasTipo>
     */
    case "LISTATEMASTIPO":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        if (! isset($_pg["selecao"]) || $_pg["selecao"] == "") {
            $_pg["selecao"] = "nao";
        }
        $retorno = $m->listaTemasTipo($_pg["tipo"], $_pg["selecao"]);
        break;

    /*
     * Valor: LISTATEMASCOMSEL
     *
     * Lista os temas que possuem sele&ccedil;&atilde;o.
     *
     * <Mapa->listaTemasComSel>
     */
    case "LISTATEMASCOMSEL":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file);
        $retorno = $m->listaTemasComSel();
        break;
    /*
     * Valor: LIGATEMAS
     *
     * Liga e desliga temas no mapa atual.
     *
     * <Mapa->ligaDesligaTemas>
     */
    case "LIGATEMAS":
        include_once ("classe_mapa.php");
        $m = new Mapa($map_file, $locaplic);
        $m->ligaDesligaTemas($_pg["ligar"], $_pg["desligar"], $_pg["adicionar"]);
        $m->salva();
        break;
    /*
     * Valor: LIGATEMASBEACON
     *
     * Liga e desliga temas no mapa atual partindo de uma chamada via tag IMG
     *
     * Retorna um c�digo de erro para indicar o fim do retorno.
     *
     * Veja no livro "Javascript de Alto Desempenho", de Nicholas C. Zakas pg. 162
     *
     * <Mapa->ligaDesligaTemas>
     */
    case "LIGATEMASBEACON":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file, $locaplic);
        $retorno = $m->ligaDesligaTemas($_pg["ligar"], $_pg["desligar"], $_pg["adicionar"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        ob_start();
        header("HTTP/1.1 204 Not Content");
        header("Status: 204 Not Content");
        ob_end_flush();
        break;
    /*
     * Valor: ADTEMA
     *
     * Adiciona um novo tema ao mapa.
     *
     * <Mapa->adicionaTema>
     */
    case "ADTEMA":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);
        $salvar = $m->adicionaTema($_pg["temas"], $locaplic);
        if ($salvar) {
            $m->salva();
            $_SESSION["contadorsalva"] ++;
        }
        validaAcessoTemas($map_file);
        $retorno = "ok";
        /*
         * if($interface != "openlayers"){
         * $teste = testaMapa($map_file,$postgis_mapa);
         * if ($teste == "ok")
         * {$retorno = "ok";$_SESSION["contadorsalva"]++;}
         * else
         * {$retorno = array("erro"=>"A camada nao pode ser adicionada. ".$teste);}
         * }
         */
        break;
    /*
     * Valor: EXCLUITEMA
     *
     * Exclui um tema do mapa.
     *
     * <Mapa->excluiTemas>
     */
    case "EXCLUITEMA":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);
        $temas = $m->excluiTemas($_pg["temas"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: ADICIONATEMAWMS
     *
     * Acrescenta um novo tema em um arquivo map file tendo como fonte um WMS.
     *
     * <Mapa->adicionatemawms>
     */
    case "ADICIONATEMAWMS":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);

        $m->adicionatemawms($_pg["tema"], $_pg["servico"], $_pg["nome"], $_pg["proj"], $_pg["formato"], $locaplic, $_pg["tipo"], $_pg["versao"], $_pg["nomecamada"], $dir_tmp, $imgdir, $imgurl, $_pg["tiporep"], $_pg["suportasld"], $_pg["formatosinfo"], $_pg["time"], $_pg["tile"]);

        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: REFERENCIA
     *
     * Gera a imagem do mapa de refer&ecirc;ncia.
     */
    case "REFERENCIA":
        $objMapa = ms_newMapObj($map_file);
        $nomeImagem = nomeRandomico();
        $ext = $_pg["ext"];
        if (! isset($ext)) {
            $ext = "";
        }
        $retorno = retornaReferencia($ext);
        break;
    /*
     * Valor: REFERENCIADINAMICA
     *
     * Gera a imagem do mapa de refer&ecirc;ncia de forma din&acirc;mica, variando com a escala do mapa atual.
     */
    case "REFERENCIADINAMICA":
        // $objMapa = ms_newMapObj($map_file);
        $nomeImagem = nomeRandomico();
        $ext = $_pg["ext"];
        if (! isset($ext)) {
            $ext = "";
        }
        $retorno = retornaReferenciaDinamica($ext, $_pg["w"], $_pg["h"], $_pg["zoom"], $_pg["tipo"]);
        break;
    /*
     * Valor: MUDAOUTPUTFORMAT
     *
     * Muda o OUTPUTFORMAT.
     *
     * <Mapa->mudaoutputformat>
     */
    case "MUDAOUTPUTFORMAT":
        include_once ("classe_mapa.php");
        copiaSeguranca($map_file);
        $m = new Mapa($map_file);
        $res = $m->mudaoutputformat($_pg["tipo"]);
        if ($res != 1) {
            $m->salva();
            $_SESSION["contadorsalva"] ++;
        } else {
            $res = "erro";
        }
        $retorno = $res;
        break;
    /*
     * Section: Temas
     *
     * Processa os layers do mapa.
     *
     * <classe_temas.php>
     */
    /*
     * Valor: PEGANOMELAYER
     *
     * Obt&eacute;m o nome de um layer e de seu arquivo mapfile original.
     *
     * <Temas->peganomelayer>
     */
    case "PEGANOMELAYER":
        include_once ("classe_temas.php");
        $m = new Temas($map_file, $_pg["tema"]);
        $retorno = $m->peganomelayer();
        break;
    /*
     * Valor: PEGAMETADATA
     *
     * Obt&eacute;m os metadados de um tema
     *
     * Tema pode ser um mapfile existente em i3geo/temas
     *
     * <Temas->pegametadata>
     */
    case "PEGAMETADATA":
        include_once ("classe_temas.php");
        // pode pegar os metadata de um mapfile existente em i3geo/temas
        $tema = $_pg["tema"];
        if (file_exists(dirname(__FILE__) . "/../temas/" . $tema . ".map")) {
            $map_file = dirname(__FILE__) . "/../temas/" . $tema . ".map";
        }
        $m = new Temas($map_file, $tema);
        $retorno = $m->pegametadata();
        break;
    /*
     * Valor: PEGADATA
     *
     * Obt&eacute;m o valor definido no elemento DATA de um LAYER.
     *
     * <Temas->pegadata>
     */
    case "PEGADATA":
        // verifica login
        session_write_close();
        session_name("i3GeoLogin");
        if ($_SESSION["usuario"] == "" || ($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"])) {
            $retorno = "login";
        } else {
            include_once ("classe_temas.php");
            $m = new Temas($map_file, $_pg["tema"]);
            $retorno = $m->pegadata();
        }
        break;
    /*
     * Valor: ALTERADATA
     *
     * Altera o valor definido no elemento DATA de um LAYER.
     *
     * <Temas->alteradata>
     */
    case "ALTERADATA":
        // verifica login
        session_write_close();
        session_name("i3GeoLogin");
        if ($_SESSION["usuario"] == "" || ($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"])) {
            $retorno = "login";
        } else {
            include_once ("classe_temas.php");
            $m = new Temas($map_file, $_pg["tema"]);
            $retorno = $m->alteradata($_pg["novodata"], $_pg["removemeta"]);
            if ($retorno != "") {
                $m->salva();
            }
            $_SESSION["contadorsalva"] ++;
        }
        break;
    /*
     * Valor: REMOVERGEOMETRIAS
     *
     * Remove geometrias do diret&oacute;rio tempor&aacute;rio.
     *
     * As geometrias s&atilde;o armazenadas no diret&oacute;rio tempor&aacute;rio do usu&aacute;rio, utilizando um formato pr�prio do I3Geo.
     *
     * <Temas->removerGeometrias>
     */
    case "REMOVERGEOMETRIAS":
        include_once ("classe_temas.php");
        if (! isset($_pg["tema"])) {
            $_pg["tema"] = "";
        }
        $m = new Temas($map_file, $_pg["tema"]);
        $retorno = $m->removerGeometrias($dir_tmp, $imgdir, $_pg["lista"]);
        break;
    /*
     * Valor: ALTERAREPRESENTACAO
     *
     * Altera o tipo de representa&ccedil;&atilde;o cartogr&aacute;fica do tema.
     *
     * <Temas->alteraRepresentacao>
     */
    case "ALTERAREPRESENTACAO":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->alteraRepresentacao();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: GERADESTAQUE
     *
     * Gera uma imagem que ser&aacute; utilizada para destacar um determinado tema.
     *
     * <Temas->geraDestaque>
     */
    case "GERADESTAQUE":
        include_once ("classe_temas.php");
        $m = new Temas($map_file, $_pg["tema"], "", $_pg["ext"]);
        $retorno = $m->geraDestaque();
        break;
    /*
     * Valor: DOWNLOAD (depreciado, utilize DOWNLOAD2
     */
    case "DOWNLOAD":
        $retorno = downloadTema($map_file, $_pg["tema"], $locaplic, $dir_tmp, $postgis_mapa);
        break;
    /*
     * Valor: DOWNLOAD2
     *
     * Gera os arquivos para download de um tema.
     */
    case "DOWNLOAD2":
        $retorno = downloadTema2($map_file, $_pg["tema"], $locaplic, $dir_tmp, $postgis_mapa);
        break;
        /*
         * Valor: DOWNLOAD3
         *
         * Gera um arquivo para download de um tema.
         */
    case "DOWNLOAD3":
        if(isset($_SESSION)){
            $map_file = $_SESSION["map_file"];
        }
        $retorno = downloadTema2($map_file, $_pg["tema"], $locaplic, $dir_tmp, $postgis_mapa);
        $retorno["arquivos"] = "";
        $retorno["datas"] = "";
        $_SESSION["downloadZipTema"] = $retorno["shape-zip"];
        $retorno["shape-zip"] = basename($retorno["shape-zip"]);
        session_write_close();
        break;
    /*
     * Valor: DOWNLOAD3
     *
     * Gera os arquivos para download de um tema for&ccedil;ando um mapfile vazio.
     */
    case "DOWNLOAD3x":
        // caso o tema tenha de vir do sistema de metadados estatisticos
        // pode ser uma regiao cadastrada no sistema de metadados
        $tema = $_pg["tema"];
        $codigo_tipo_regiao = $_pg["codigo_tipo_regiao"];
        if (isset($codigo_tipo_regiao) && $codigo_tipo_regiao != "") {
            include (dirname(__FILE__) . "/classe_metaestatinfo.php");
            $m = new MetaestatInfo();
            $m->nomecache = "ogcmetaestatreg" . $codigo_tipo_regiao;
            $tema = $m->mapfileTipoRegiao($codigo_tipo_regiao);
            $tema = str_replace(".map", "", $tema["mapfile"]);
        }
        // pode ser uma medida de uma variavel
        $id_medida_variavel = $_pg["id_medida_variavel"];
        if (isset($id_medida_variavel) && $id_medida_variavel != "") {
            include (dirname(__FILE__) . "/classe_metaestatinfo.php");
            $m = new MetaestatInfo();
            $m->nomecache = "ogcmetaestat" . $id_medida_variavel;
            $tema = $m->mapfileMedidaVariavel($id_medida_variavel, "", 1, "", "", "", "", "", "", true);
            $tema = str_replace(".map", "", $tema["mapfile"]);
        }
        $retorno = downloadTema2("", $tema, $locaplic, $dir_tmp, $postgis_mapa);
        break;
    /*
     * function: INSEREFEATURE
     *
     * Insere elemento gr&aacute;fico em um tema.
     *
     * <Temas->insereFeature>
     */
    case "INSEREFEATURE":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, "");
        if (! isset($_pg["marca"])) {
            $_pg["marca"] = "";
        }
        if (! isset($_pg["wkt"])) {
            $_pg["wkt"] = false;
        }
        if (! isset($_pg["nomeTema"])) {
            $_pg["nomeTema"] = "";
        }
        $m->insereFeature($_pg["marca"], $_pg["tipo"], $_pg["xy"], $_pg["texto"], $_pg["position"], $_pg["partials"], $_pg["offsetx"], $_pg["offsety"], $_pg["minfeaturesize"], $_pg["mindistance"], $_pg["force"], $_pg["shadowcolor"], $_pg["shadowsizex"], $_pg["shadowsizey"], $_pg["outlinecolor"], $_pg["cor"], $_pg["sombray"], $_pg["sombrax"], $_pg["sombra"], $_pg["fundo"], $_pg["angulo"], $_pg["tamanho"], $_pg["fonte"], $_pg["wrap"], $_pg["wkt"], $_pg["nomeTema"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: SOBETEMA
     *
     * Sobe um tema na ordem de desenho.
     *
     * <Temas->sobeTema>
     */
    case "SOBETEMA":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->sobeTema();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: DESCETEMA
     *
     * Desce um tema na ordem de desenho.
     *
     * <Temas->desceTema>
     */
    case "DESCETEMA":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->desceTema();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: FONTETEMA
     *
     * Busca o link para a fonte do tema
     *
     * <Temas->fonteTema>
     */
    case "FONTETEMA":
        include_once ("classe_temas.php");
        $m = new Temas($map_file, null, $locaplic);
        $retorno = $m->fonteTema($_pg["tema"]);
        break;
    /*
     * Valor: REORDENATEMAS
     *
     * Reordena os temas baseados na localiza&ccedil;&atilde;o de um segundo tema no mapa.
     *
     * <Temas->reordenatemas>
     */
    case "REORDENATEMAS":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file);
        $m->reordenatemas($_pg["lista"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: ZOOMTEMA
     *
     * Muda a extens&atilde;o geogr&aacute;fica do mapa de acordo com a abrang&ecirc;ncia de um tema.
     *
     * <Temas->zoomTema>
     */
    case "ZOOMTEMA":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->zoomTema();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: ZOOMSEL
     *
     * Muda a extens&atilde;o geogr&aacute;fica do mapa de acordo com a abrang&ecirc;ncia dos elementos selecionados de um tema.
     *
     * <Temas->zoomSel>
     */
    case "ZOOMSEL":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->zoomSel();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: APLICAPROCESSOS
     *
     * Aplica processos em um tema do tipo imagem
     *
     * <Temas->aplicaProcessos>
     */
    case "APLICAPROCESSOS":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->aplicaProcessos($_pg["lista"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: INVERTESTATUSLEGENDA
     *
     * Inverte o metadata CLASSE
     *
     * <Temas->inverteStatusLegenda>
     */
    case "INVERTESTATUSLEGENDA":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->inverteStatusLegenda();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: MUDATRANSP
     *
     * Altera a transpar&ecirc;ncia de um tema
     *
     * <Temas->mudaTransparencia>
     */
    case "MUDATRANSP":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->mudaTransparencia($_pg["valor"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: COPIATEMA
     *
     * Cria uma copia de um tema
     *
     * <Temas->copia>
     */
    case "COPIATEMA":
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->copiaTema();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: MUDANOME
     *
     * Altera o nome do tema
     *
     * <Temas->mudaNome>
     */
    case "MUDANOME":
        include_once ("classe_temas.php");
        $valor = mb_convert_encoding($_pg["valor"], "ISO-8859-1", mb_detect_encoding($valor));
        copiaSeguranca($map_file);
        $m = new Temas($map_file, $_pg["tema"]);
        $m->mudaNome($valor);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: MUDANOME
     *
     * Altera o nome do tema
     *
     * <Temas->mudaNome>
     */
    case "CONTORNO":
        include_once ("classe_temas.php");
        $m = new Temas($map_file, $_pg["tema"]);
        $m->contorno();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Section: Classes
     *
     * Edita as caracter&iacute;sticas das classes de um tema.
     *
     * <classe_alteraclasse.php>
     */
    /*
     * Valor: ALTERACLASSE
     *
     * Altera uma classe de um tema, aplicando uma nova classifica&ccedil;&atilde;o ou modificando par&acirc;metros de uma ou mais classes.
     */
    case "ALTERACLASSE":
        include_once ("classe_alteraclasse.php");
        copiaSeguranca($map_file);
        $m = new Alteraclasse($map_file, $_pg["tema"], "", $_pg["ext"]);
        $opcao = $_pg["opcao"];
        $cores = $_pg["cores"];
        $idclasse = $_pg["idclasse"];
        if ($opcao == "aplicacoresrgb") {
            $cores = str_replace("rgb", "", $cores);
            $cores = str_replace(")", "", $cores);
            $cores = str_replace("(", "", $cores);
            $retorno = $m->aplicacoresrgb(explode("|", $cores));
        }
        if ($opcao == "sobeclasse") {
            $retorno = $m->sobeclasse($idclasse);
        }
        if ($opcao == "desceclasse") {
            $retorno = $m->desceclasse($idclasse);
        }
        if ($opcao == "alteracor") {
            if(!isset($_pg["w"])){
                $_pg["w"] = 35;
                $_pg["h"] = 25;
            }
            $retorno = $m->alteracor($idclasse, $_pg["cor"],$_pg["w"],$_pg["h"]);
        }
        if ($opcao == "adicionaopacidade") {
            $retorno = $m->adicionaopacidade();
        }
        if ($opcao == "alterageometria") {
            $retorno = $m->alterageometria($_pg["tipo"]);
        }
        if ($opcao == "adicionaclasse") {
            $retorno = $m->adicionaclasse();
        }
        if ($opcao == "valorunico") {
            if (empty($_pg["itemNome"])) {
                $_pg["itemNome"] = "";
            }
            $retorno = $m->valorunico($_pg["item"], $_pg["ignorar"], $_pg["itemNome"]);
        }
        if ($opcao == "intervalosiguais") {
            $retorno = $m->intervalosiguais($_pg["item"], $_pg["nclasses"], $_pg["ignorar"]);
        }
        if ($opcao == "quantil") {
            $retorno = $m->quantil($_pg["item"], $_pg["nclasses"], $_pg["ignorar"]);
        }
        if ($opcao == "quebrasnaturais") {
            $retorno = $m->quebrasnaturais($_pg["item"], $_pg["nclasses"], $_pg["ignorar"]);
        }
        if ($opcao == "metade") {
            $retorno = $m->metade($_pg["item"], $_pg["itemid"], $_pg["ignorar"]);
        }
        if ($opcao == "media") {
            $retorno = $m->classemedia($_pg["item"], $_pg["ignorar"]);
        }
        if ($opcao == "quartis") {
            if (! isset($_pg["tipoLegenda"])) {
                $_pg["tipoLegenda"] = "";
            }
            $retorno = $m->quartis($_pg["item"], $_pg["ignorar"], $_pg["tipoLegenda"]);
        }
        if ($opcao == "alteraclasses") {
            // esta opera&ccedil;&atilde;o &eacute; chamada com POST via cpaint
            // error_reporting(0);
            alteraclassesPost($_pg["ids"], $_pg["nomes"], $_pg["exps"], $_pg["base64"], $_pg["minScales"], $_pg["maxScales"]);
            restauraCon($map_file, $postgis_mapa);
            cpjson("");
        }
        if ($opcao == "simbolounico") {
            $retorno = $m->simbolounico();
        }
        $salvo = $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: INVERTECORESCLASSES
     *
     * Inverte a ordem das cores das classes de um tema.
     *
     * <Alteraclasse->inverteCoresClasses>
     */
    case "INVERTECORESCLASSES":
        include_once ("classe_alteraclasse.php");
        copiaSeguranca($map_file);
        $m = new Alteraclasse($map_file, $_pg["tema"]);
        $m->inverteCoresClasses();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: CALCULATAMANHOCLASSES
     *
     * Calcula o tamanho dos estilos das classes, alterando o tamanho do s&iacute;mbolo.
     *
     * <Alteraclasse->calculaTamanhoClasses>
     */
    case "CALCULATAMANHOCLASSES":
        include_once ("classe_alteraclasse.php");
        copiaSeguranca($map_file);
        $m = new Alteraclasse($map_file, $_pg["tema"]);
        $retorno = $m->calculaTamanhoClasses();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: ORDENACLASSES
     *
     * Ordena as classes pelo nome
     *
     * <Alteraclasse->ordenaClasses>
     */
    case "ORDENACLASSES":
        include_once ("classe_alteraclasse.php");
        copiaSeguranca($map_file);
        $m = new Alteraclasse($map_file, $_pg["tema"]);
        $retorno = $m->ordenaClasses();
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: ALTERACORESCLASSES
     *
     * Altera as cores das classes de um tema conforme uma cor inicial e uma final.
     *
     * <Alteraclasse->alteraCoresClasses>
     */
    case "ALTERACORESCLASSES":
        include_once ("classe_alteraclasse.php");
        copiaSeguranca($map_file);
        $m = new Alteraclasse($map_file, $_pg["tema"]);
        $retorno = $m->alteraCoresClasses($_pg["cori"], $_pg["corf"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: INVERTESTATUSCLASSE
     *
     * Altera o status de desenho de uma classe, tornando-a vi�sivel ou n&atilde;o.
     *
     * <Alteraclasse->statusClasse>
     */
    case "INVERTESTATUSCLASSE":
        include_once ("classe_alteraclasse.php");
        copiaSeguranca($map_file);
        $m = new Alteraclasse($map_file, $_pg["tema"]);
        $retorno = $m->statusClasse($_pg["classe"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: VERPALETA
     *
     * Gera cores tendo como base uma cor inicial e uma cor final.
     *
     * <class.palette.php>
     */
    case "VERPALETA":
        include_once ("class.palette.php");
        $cori = $_pg["cori"];
        $corf = $_pg["corf"];
        $numclasses = $_pg["numclasses"];
        $cori = RGB2hex(explode(",", $cori));
        $corf = RGB2hex(explode(",", $corf));
        $myPalette = new palette(array(
            $cori,
            $corf
        ), ($numclasses + 1));
        foreach ($myPalette->colorRGB as $cores) {
            $res[] = $cores[0] . "," . $cores[1] . "," . $cores[2];
        }
        $retorno = implode("*", $res);
        break;

    /*
     * Section: Edi&ccedil;&atilde;o
     *
     * Cria arquivos shapefile ou altera suas caracter&iacute;sticas.
     *
     * <classe_shp.php>
     */
    /*
     * Valor: SPHPT2SHP
     *
     * Converte os elementos de um tema em um arquivo shp.
     *
     * Acrescenta um novo tema ao mapa.
     *
     * <SHP->shpPT2shp>
     */
    case "SPHPT2SHP":
        include_once ("classe_shp.php");
        $m = new SHP($map_file, $_pg["tema"], $locaplic, $_pg["ext"]);
        $retorno = $m->shpPT2shp($locaplic, $_pg["para"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: LISTAPONTOSSHAPE
     *
     * Lista os pontos dos elementos de um arquivo shp.
     *
     * <SHP->listaPontosShape>
     */
    case "LISTAPONTOSSHAPE":
        include_once ("classe_shp.php");
        $m = new SHP($map_file, $_pg["tema"]);
        $retorno = $m->listaPontosShape();
        break;
    /*
     * Valor: CRIASHPVAZIO
     *
     * Cria um shapefile vazio e acrescenta como tema ao mapa.
     *
     * <SHP->criaSHPvazio>
     */
    case "CRIASHPVAZIO":
        include_once ("classe_shp.php");
        $m = new SHP($map_file);
        if (! isset($_pg["tituloTema"])) {
            $_pg["tituloTema"] = "";
        }
        $retorno = $m->criaSHPvazio($_pg["tituloTema"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: PEGAXYULTIMOPONTO
     *
     * Insere um ponto em um shape file tendo como refer&ecirc;ncia o &uacute;ltimo ponto existente no tema, a dire&ccedil;&atilde;o e a dist&acirc;ncia.
     *
     * <SHP->ultimoXY>
     */
    case "PEGAXYULTIMOPONTO":
        include_once ("classe_shp.php");
        $m = new SHP($map_file, $_pg["tema"]);
        $retorno = $m->ultimoXY();
        break;

    /*
     * Valor: MOSTRAWKT
     *
     * Gera string wkt de um conjunto de pontos.
     */
    case "MOSTRAWKT":
        $res = xy2wkt($_pg["xy"]);
        $retorno = array(
            $res["ponto"],
            $res["linha"],
            $res["poligono"]
        );
        break;
    /*
     * Valor: DADOSLINHADOTEMPO
     *
     * Pega os dados de um tema para gera&ccedil;&atilde;o do gr&aacute;fico de linha do tempo.
     *
     * <dadosLinhaDoTempo>
     */
    case "DADOSLINHADOTEMPO":
        include_once ("graficos.php");
        if (! isset($_pg["ext"])) {
            $_pg["ext"] = "";
        }
        $retorno = dadosLinhaDoTempo($map_file, $_pg["tema"], $_pg["ext"]);
        break;
    /*
     * Valor: DADOSPERFILRELEVO
     *
     * Pega os dados para elabora&ccedil;&atilde;o de gr&aacute;fico de perfil do relevo
     *
     * <dadosPerfilRelevo>
     */
    case "DADOSPERFILRELEVO":
        include_once ("graficos.php");
        if (! isset($_pg["ext"])) {
            $_pg["ext"] = "";
        }
        $retorno = dadosPerfilRelevo($_pg["pontos"], $_pg["opcao"], $_pg["amostragem"], $_pg["item"], $map_file);
        break;
    /*
     * Section: Menu de temas
     *
     * Obt&eacute;m a lista de temas, grupos e sub-grupos.
     *
     * <classe_menutemas.php>
     */
    /*
     * Valor: PEGALISTADEMENUS
     *
     * Pega a lista de menus para incluir na guia adiciona.
     *
     * <Menutemas->pegaListaDeMenus>
     */
    case "PEGALISTADEMENUS":
        include_once ("classe_menutemas.php");
        if (isset($_pg["editores"])) {
            $editores = $_pg["editores"];
        } else {
            $editores = "";
        }
        if (isset($_pg["perfil"])) {
            $perfil = $_pg["perfil"];
        } else {
            $perfil = "";
        }
        $idioma = $_pg["idioma"];
        $filtraOgc = $_pg["filtraOgc"];
        $filtraDown = $_pg["filtraDown"];
        if (! isset($editores)) {
            $editores = "";
        }
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma);
        $retorno = $m->pegaListaDeMenus($filtraOgc, $filtraDown);
        break;
    case "PEGALISTADEMENUSCOMPLETA":
        $arq = $dir_tmp."/catalogoTemas.json";
        if (file_exists($arq)){
            $retorno = unserialize(file_get_contents($arq));
        } else {
            include_once ("classe_menutemas.php");
            if (isset($_pg["editores"])) {
                $editores = $_pg["editores"];
            } else {
                $editores = "";
            }
            if (isset($_pg["perfil"])) {
                $perfil = $_pg["perfil"];
            } else {
                $perfil = "";
            }
            $idioma = $_pg["idioma"];
            if(empty($idioma)){
                $idioma = "pt";
            }
            $filtraOgc = $_pg["filtraOgc"];
            $filtraDown = $_pg["filtraDown"];
            if (! isset($editores)) {
                $editores = "";
            }
            $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma);
            $retorno = $m->pegaListaDeMenus($filtraOgc, $filtraDown);
            for($i = 0; $i < count($retorno); $i++){
                $idmenu = $retorno[$i]["idmenu"];
                $grupos = $m->pegaListaDeGrupos($retorno[$i]["idmenu"], "nao", "sim");
                for($j = 0; $j < count($grupos); $j++){
                    $idgrupo = $grupos[$j]["id_n1"];
                    for ($k = 0; $k < count($grupos[$j]["subgrupos"]); $k++){
                        $idsubgrupo = $grupos[$j]["subgrupos"][$k]["id_n2"];
                        $temas = $m->pegaListaDeTemas($idgrupo, $idsubgrupo, $idmenu);
                        $grupos[$j]["subgrupos"][$k]["temas"] = $temas;
                    }
                }
                $retorno[$i]["grupos"] = $grupos;
            }
            if (!file_exists($arq) && count($retorno) > 0){
                gravaDados([serialize($retorno)], $arq);
            }
        }
        break;
    /*
     * Valor: PEGALISTADEGRUPOS
     *
     * Pega a lista de grupos do menu.
     *
     * <Menutemas->pegaListaDeGrupos>
     */
    case "PEGALISTADEGRUPOS":
        include_once ("classe_menutemas.php");
        if (isset($_pg["editores"])) {
            $editores = $_pg["editores"];
        } else {
            $editores = "";
        }
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];
        if (isset($_pg["filtro"])) {
            $filtro = $_pg["filtro"];
        } else {
            $filtro = "";
        }
        $idmenu = $_pg["idmenu"];
        $listasistemas = $_pg["listasistemas"];
        $listasgrupos = $_pg["listasgrupos"];
        $ordenaNome = $_pg["ordenaNome"];
        $filtraOgc = $_pg["filtraOgc"];
        $filtraDown = $_pg["filtraDown"];

        if (! isset($urli3geo)) {
            $urli3geo = "";
        }
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma, $filtro);
        if (! isset($idmenu)) {
            $idmenu = "";
        }
        if (! isset($listasistemas)) {
            $listasistemas = "nao";
        }
        if (! isset($listasgrupos)) {
            $listasgrupos = "nao";
        }
        if (! isset($ordenaNome)) {
            $ordenaNome = "nao";
        }
        if (! isset($filtraOgc)) {
            $filtraOgc = "nao";
        }
        if (! isset($filtraDown)) {
            $filtraDown = "nao";
        }
        $retorno = array(
            "idmenu" => $idmenu,
            "grupos" => $m->pegaListaDeGrupos($idmenu, $listasistemas, $listasgrupos, $ordenaNome, $filtraOgc, $filtraDown)
        );
        break;
    /*
     * Valor: PEGASISTEMASIDENTIFICACAO
     *
     * Pega a lista de sistemas especiais de identifica&ccedil;&atilde;o de elementos no mapa
     *
     * <Menutemas->pegaSistemasI>
     */
    case "PEGASISTEMASIDENTIFICACAO":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];

        $m = new Menutemas($map_file, $perfil, $locaplic, "", $editores, $idioma);
        $retorno = $m->pegaSistemasI();
        break;
    /*
     * Valor: PEGASISTEMAS
     *
     * Pega a lista de sistemas.
     *
     * <Menutemas->pegaSistemas>
     */
    case "PEGASISTEMAS":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];

        $m = new Menutemas($map_file, $perfil, $locaplic, "", $editores, $idioma);
        $retorno = $m->pegaSistemas();
        break;
    /*
     * Valor: PEGALISTADESUBGRUPOS
     *
     * Pega a lista de subgrupos de um grupo do menu.
     *
     * <Menutemas->pegaListaDeSubGrupos>
     */
    case "PEGALISTADESUBGRUPOS":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];
        if(isset($_pg["filtro"])){
            $filtro = $_pg["filtro"];
        } else {
            $filtro = "";
        }

        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma, $filtro);
        if (! isset($_pg["idmenu"])) {
            $_pg["idmenu"] = "";
        }
        $retorno = $m->pegaListaDeSubGrupos($_pg["grupo"], $_pg["idmenu"]);
        break;
    /*
     * Valor: PEGALISTADETEMAS
     *
     * Pega a lista de temas do menu.
     *
     * <Menutemas->pegaListaDeTemas>
     */
    case "PEGALISTADETEMAS":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];

        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma);
        if (! isset($_pg["idmenu"])) {
            $_pg["idmenu"] = "";
        }
        $retorno = array(
            "temas" => $m->pegaListaDeTemas($_pg["grupo"], $_pg["subgrupo"], $_pg["idmenu"])
        );
        break;
    /*
     * Valor: PEGATODOSTEMAS
     *
     * Pega a lista de todos os temas que nao possuem restricoes de acesso
     */
    case "PEGATODOSTEMAS":
        include ("../classesphp/classe_arvore.php");
        $idioma = $_pg["idioma"];

        $arvore = new Arvore($locaplic, $idioma);
        $resultado = $arvore->pegaTodosTemas();
        $retorno = array(
            "temas" => $resultado
        );
        break;
    /*
     * Valor: PROCURARTEMAS
     *
     * Procura um tema no menu considerando apenas os existentes em subgruppos.
     *
     * <Menutemas->procurartemas>
     */
    case "PROCURARTEMAS":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];

        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma);
        $retorno = $m->procurartemas($procurar);
        break;
    /*
     * Valor: PROCURARTEMAS2
     *
     * Procura um tema no menu considerando todos os n&iacute;veis.
     *
     * <Menutemas->procurartemas2>
     */
    case "PROCURARTEMAS2":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];

        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma);
        $retorno = $m->procurartemas2($procurar);
        break;
    /*
     * Valor: PROCURARTEMASESTRELA
     *
     * Procura um tema com um certo n&uacute;mero de estrelas.
     *
     * <Menutemas->procurartemasestrela>
     */
    case "PROCURARTEMASESTRELA":
        include_once ("classe_menutemas.php");
        $editores = $_pg["editores"];
        $perfil = $_pg["perfil"];
        $idioma = $_pg["idioma"];
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $idioma);
        $retorno = $m->procurartemasestrela($_pg["nivel"], $_pg["fatorestrela"]);
        break;
    /*
     * Valor: PEGAMAPAS
     *
     * Pega a lista de links para outros mapas.
     *
     * Utilizado no preenchimento da guia mapas
     *
     * <Menutemas->pegaListaDeMapas>
     */
    case "PEGAMAPAS":
        include_once ("classe_menutemas.php");
        if (isset($_pg["perfil"])) {
            $perfil = $_pg["perfil"];
        } else {
            $perfil = "";
        }
        if (isset($_pg["id_mapa"])) {
            $id_mapa = $_pg["id_mapa"];
        } else {
            $id_mapa = "";
        }
        if (isset($_pg["idioma"])) {
            $idioma = $_pg["idioma"];
        } else {
            $idioma = "pt";
        }
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $idioma);
        $retorno = $m->pegaListaDeMapas($locmapas,$id_mapa);
        break;
    /*
     * Section: Webservices
     *
     * Processa servi&ccedil;os OGC.
     *
     * <wmswfs.php>
     */
    /*
     * Valor: GETCAPABILITIES
     *
     * Chama a fun&ccedil;&atilde;o getcapabilities e retorna o resultado.
     *
     * <getcapabilities>
     */
    case "GETCAPABILITIES":
        include_once ("wmswfs.php");
        $retorno = getcapabilities();
        restauraCon($map_file, $postgis_mapa);
        break;
    /*
     * Valor: GETCAPABILITIES2
     *
     * Chama a fun&ccedil;&atilde;o getcapabilities e retorna o resultado formatado (WMS).
     *
     * <getcapabilities2>
     */
    case "GETCAPABILITIES2":
        include_once ("wmswfs.php");
        $retorno = getcapabilities2();
        restauraCon($map_file, $postgis_mapa);
        break;
    /*
     * Valor: GETCAPABILITIES3
     *
     * Chama a fun&ccedil;&atilde;o getcapabilities e retorna o resultado formatado (WFS).
     *
     * <getcapabilities3>
     */
    case "GETCAPABILITIES3":
        include_once ("wmswfs.php");
        $retorno = getcapabilities3();
        restauraCon($map_file, $postgis_mapa);
        break;
    /*
     * Valor: TEMASWMS
     *
     * Retorna a lista de camadas de um WMS formatado em HTML.
     *
     * <temaswms>
     */
    case "TEMASWMS":
        include_once ("wmswfs.php");
        error_reporting(0);
        $servico = $_pg["servico"];
        restauraCon($map_file, $postgis_mapa);
        $retorno = temaswms();
        break;
    /*
     * Valor: LISTALAYERSWMS
     *
     * Retorna a lista de layers de um WMS.
     *
     * <listaLayersWMS>
     */
    case "LISTALAYERSWMS":
        include_once ("wmswfs.php");
        $servico = $_pg["servico"];
        $nivel = $_pg["nivel"];
        $id_ws = $_pg["id_ws"];
        $nomelayer = $_pg["nomelayer"];
        $tipo_ws = $_pg["tipo_ws"];
        $retorno = listaLayersWMS();
        break;
    case "LISTALAYERSARCGISREST":
        $id_ws = $_pg["id_ws"];
        $nomelayer = $_pg["nomelayer"];
        //obtem a url
        include("conexao.php");
        $sql = "SELECT link_ws from {$esquemaadmin}i3geoadmin_ws WHERE id_ws = '{$id_ws}'";
        $q = $dbh->query($sql,PDO::FETCH_ASSOC)->fetchAll();
        $servico = $q[0]["link_ws"];
        if(!empty($nomelayer)){
            $servico = $servico . "/" . $nomelayer;
        }
        include_once ("wmswfs.php");
        $retorno = json_decode(listaLayersARCGISREST());
        break;
    /*
     * Section: Atributos
     *
     * Processa os atributos da tabela associada ao tema.
     *
     * <classe_atributos.php>
     */
    /*
     * Valor: BUSCARAPIDA
     *
     * Acessa dados de um servi&ccedil;o de geonames ou busca dados nos temas existentes no mapa.
     *
     * A pesquisa em temas &eacute; feita apenas quando existir o metadata itembuscarapida
     *
     * <buscaRapida>
     */
    case "BUSCARAPIDA":
        $servico = $_pg["servico"];
        $palavra = $_pg["palavra"];
        if ($servico != "temas") {
            $retorno = buscaRapida($servico, $palavra);
        } else {
            include_once ("classe_mapa.php");
            $m = new Mapa($map_file);
            $lista = $m->listaTemasBuscaRapida();
            if ($lista != "") {
                include_once ("classe_atributos.php");
                $m = new Atributos($map_file);
                $dados = $m->buscaRegistros($palavra, $lista, "qualquer", "mapa");
                foreach ($dados as $tema) {
                    $rs = $tema["resultado"];
                    foreach ($rs as $r) {
                        $retorno[] = array(
                            "box" => $r["box"],
                            "valor" => $r["valores"][0]["valor"]
                        );
                    }
                }
            } else {
                $retorno = "erro";
            }
        }
        break;
    /*
     * Valor: LISTAITENS
     *
     * Lista os itens de um tema.
     *
     * <Atributos->listaItens>
     */
    case "LISTAITENS":
        include_once ("classe_atributos.php");
        $m = new Atributos($map_file, $_pg["tema"], "", $_pg["ext"]);
        $retorno = $m->listaItens();
        break;
    /*
     * Valor: LISTAVALORESITENS
     *
     * Procura valores em uma tabela que aderem a uma palavra de busca.
     *
     * <Atributos->buscaRegistros>
     */
    case "LISTAVALORESITENS":
        include_once ("classe_atributos.php");
        if (! isset($_pg["tema"])) {
            $_pg["tema"] = "";
        }
        $m = new Atributos($map_file, $_pg["tema"], "", $_pg["ext"]);
        $retorno = $m->buscaRegistros($_pg["palavra"], $_pg["lista"], $_pg["tipo"], $_pg["onde"]);
        break;
    /*
     * Valor: IDENTIFICA
     *
     * Depreciado na vers&atilde;o 4.2 (utilize "identifica2")
     *
     * Identifica elementos no mapa.
     *
     * <Atributos->identifica>
     */
    case "IDENTIFICA":
        $tema = $_pg["tema"];
        $opcao = $_pg["opcao"];
        $xy = $_pg["xy"];
        $resolucao = $_pg["resolucao"];

        if (! isset($tema)) {
            $tema = "";
        }
        if (! isset($resolucao)) {
            $resolucao = 5;
        }
        include_once ("classe_atributos.php");
        $m = new Atributos($map_file, $tema);
        $retorno = $m->identifica($opcao, $xy, $resolucao);
        break;
    /*
     * Valor: IDENTIFICA2
     *
     * Depreciado na vers&atilde;o 4.7 (utilize "identifica3")
     *
     * Identifica elementos no mapa.
     *
     * <Atributos->identifica2>
     */
    case "IDENTIFICA2":
        $tema = $_pg["tema"];
        $opcao = $_pg["opcao"];
        $xy = $_pg["xy"];
        $resolucao = $_pg["resolucao"];
        $ext = $_pg["ext"];
        $opcao = $_pg["opcao"];
        $listaDeTemas = $_pg["listaDeTemas"];
        $wkt = $_pg["wkt"];

        if (! isset($tema)) {
            $tema = "";
        }
        if (! isset($resolucao)) {
            $resolucao = 5;
        }
        include_once ("classe_atributos.php");
        if (! isset($ext)) {
            $ext = "";
        }
        if (! isset($wkt)) {
            $wkt = "nao";
        }
        $m = new Atributos($map_file, $tema, "", $ext);
        $retorno = $m->identifica2($opcao, $xy, $resolucao, $ext, $listaDeTemas, $wkt);
        break;
    /*
     * Valor: IDENTIFICA3
     *
     * Identifica elementos no mapa.
     *
     * <Atributos->identifica3>
     */
    case "IDENTIFICA3":
        $tema = "";
        if(isset($_pg["tema"])){
            $tema = $_pg["tema"];
        }
        $opcao = $_pg["opcao"];
        $xy = $_pg["xy"];
        $resolucao = $_pg["resolucao"];
        $ext = $_pg["ext"];
        $opcao = $_pg["opcao"];
        $listaDeTemas = $_pg["listaDeTemas"];
        $wkt = $_pg["wkt"];

        if (! isset($tema)) {
            $tema = "";
        }
        if (! isset($resolucao)) {
            $resolucao = 5;
        }
        include_once ("classe_atributos.php");
        if (! isset($ext)) {
            $ext = "";
        }
        if (! isset($wkt)) {
            $wkt = "nao";
        }
        $m = new Atributos($map_file, $tema, "", $ext);
        $retorno = $m->identifica3($opcao, $xy, $resolucao, $ext, $listaDeTemas, $wkt);
        break;
    /*
     * Valor: IDENTIFICAUNICO
     *
     * Identifica elementos no mapa retornando apenas o valor de um &uacute;nico item.
     *
     * <Atributos->identificaQBP>
     */
    case "IDENTIFICAUNICO":
        $tema = $_pg["tema"];
        $xy = $_pg["xy"];
        $resolucao = $_pg["resolucao"];
        $ext = $_pg["ext"];
        $item = $_pg["item"];

        if (! isset($resolucao)) {
            $resolucao = 5;
        }
        include_once ("classe_atributos.php");
        if (! isset($ext)) {
            $ext = "";
        }
        $m = new Atributos($map_file, $tema, "", $ext);
        $xy = explode(",", $xy);
        $retorno = $m->identificaQBP3($tema, $xy[0], $xy[1], $map_file, $resolucao, $item, "unico");
        break;
    /*
     * Valor: LISTATEXTO
     *
     * Pega todos os valores dos itens de uma tabela de um tema.
     *
     * <Atributos->itensTexto>
     */
    case "LISTATEXTO":
        include_once ("classe_atributos.php");
        $m = new Atributos($map_file, $_pg["tema"]);
        $retorno = $m->itensTexto($_pg["tipo"]);
        break;
    //depreciado na versao 8. Ver: ferramentas/tabela/exec.php
    //@TODO excluir codigo pois esta duplpicado
    case "LISTAREGISTROS":
        $tema = $_pg["tema"];
        $ext = $_pg["ext"];
        $tipo = $_pg["tipo"];
        $inicio = $_pg["inicio"];
        $fim = $_pg["fim"];
        $tipolista = $_pg["tipolista"];
        if (isset($_pg["itemtema"])) {
            $itemtema = $_pg["itemtema"];
        }
        if (isset($_pg["unico"])) {
            $unico = $_pg["unico"];
        }
        $dadosDaClasse = $_pg["dadosDaClasse"];
        include_once ("classe_atributos.php");
        $m = new Atributos($map_file, $tema, "", $ext);
        if (! isset($tipo)) {
            $tipo = "";
        }
        if (! isset($inicio)) {
            $inicio = 0;
        }
        if (! isset($fim)) {
            $fim = "";
        }
        if (! isset($tipolista)) {
            $tipolista = "";
        }
        if (! isset($itemtema)) {
            $itemtema = "";
        }
        if (! isset($unico)) {
            $unico = "";
        }
        $legenda = "";
        if (! isset($dadosDaClasse)) {
            $dadosDaClasse = "nao";
        } else {
            include_once ("classe_legenda.php");
            $mc = new Legenda($map_file, $locaplic, $tema);
            $linhas = $mc->tabelaLegenda();
            foreach ($linhas as $linha) {
                if ($linha["tema"] == $tema) {
                    $legenda[$linha["idclasse"]] = $linha["imagem"];
                }
            }
        }
        $retorno = $m->listaRegistros($itemtema, $tipo, $unico, $inicio, $fim, $tipolista, $dadosDaClasse);
        $retorno["legenda"] = $legenda;
        break;
    /*
     * Valor: LISTAUNICA
     *
     * Pega todos os valores dos itens de uma tabela de um tema.
     *
     * <Atributos->listaRegistros>
     */
    case "LISTAUNICA":
        $tema = $_pg["tema"];
        $ext = $_pg["ext"];
        $item = $_pg["item"];
        include_once ("classe_atributos.php");
        $m = new Atributos($map_file, $tema, "", $ext);
        $retorno = $m->listaUnicoRapida($item);
        break;
    /*
     * Valor: EXTREGISTROS
     *
     * Pega a extens&atilde;o geogr&aacute;fica de um registro na tabela de atributos de um tema.
     *
     * <Atributos->extensaoRegistro>
     */
    case "EXTREGISTROS":
        include_once ("classe_atributos.php");
        $tema = $_pg["tema"];
        $registro = $_pg["registro"];
        $m = new Atributos($map_file, $tema);
        $retorno = $m->extensaoRegistro($registro);
        $m->salva();
        break;
    /*
     * Section: Navega&ccedil;&atilde;o
     *
     * Altera a extens&atilde;o geogr&aacute;fica do mapa.
     *
     * <classe_navegacao.php>
     */
    /*
     * Valor: MARCADORES2SHP
     *
     * Converte marcadores em shapefile
     */
    case "MARCADORES2SHP":
        $marcadores = explode(":", $_COOKIE["marcadoresDoI3Geo"]);
        $marcas = array();
        foreach ($marcadores as $marcador) {
            $par = explode("|", $marcador);
            if (count($par) == 2) {
                $marcas[] = array(
                    "ext" => $par[1],
                    "nome" => $par[0]
                );
            }
        }
        if (count($marcas) == 0) {
            $retorno = "";
        } else {
            include_once ("classe_analise.php");
            $m = new Analise($map_file);
            $imgdir = basename($map_file);
            $dir_tmp = basename($imgdir);
            $res = $m->incmapageometrias($dir_tmp, $imgdir, $marcas, "marcadores");
            $retorno = $res;
        }
        break;

    /*
     * Valor: GEO2UTM
     *
     * Retorna coordenadas utm a partir de coordenadas geo
     */
    case "GEO2UTM":
        $x = $_pg["x"];
        $y = $_pg["y"];
        $zona = geo2zonaUTM($x);
        $retorno = geo2utm($x, $y, $zona);
        break;
    /*
     * Valor: DESATIVACGI
     *
     * Desativa o modo cgi.
     */
    case "DESATIVACGI":
        $_SESSION["utilizacgi"] = "nao";
        $retorno = $_SESSION["utilizacgi"];
        break;

    /*
     * Valor: MUDAEXT
     *
     * Muda a extens&atilde;o geogr&aacute;fica do mapa.
     *
     * <Navegacao->mudaExtensao>
     */
    case "MUDAEXT":
        include_once ("classe_navegacao.php");
        copiaSeguranca($map_file);
        $ext = $_pg["ext"];
        $geo = $_pg["geo"];
        if (! isset($ext) || $ext == "" || $ext == " ") {
            $ext = "-76.512593 -39.392568 -29.585185 9.490149";
        }
        if (! isset($geo) || $geo == "") {
            $geo = false;
        }
        $m = new Navegacao($map_file);
        $m->mudaExtensao($ext);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: MUDAESCALA
     *
     * Muda a escala do mapa.
     *
     * <Navegacao->mudaEscala>
     */
    case "MUDAESCALA":
        include_once ("classe_navegacao.php");
        copiaSeguranca($map_file);
        $m = new Navegacao($map_file);
        $m->mudaEscala($_pg["escala"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: PAN
     *
     * Desloca a visualiza&ccedil;&atilde;o de um mapa (pan).
     *
     * <Navegacao->pan>
     */
    case "PAN":
        include_once ("classe_navegacao.php");
        copiaSeguranca($map_file);
        $m = new Navegacao($map_file);
        $tipo = $_pg["tipo"];
        if (! isset($tipo)) {
            $tipo = "";
        }
        $m->pan($_pg["x"], $_pg["y"], $_pg["escala"], $tipo);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: APROXIMA
     *
     * Aproxima a visualiza&ccedil;&atilde;o de um mapa (zoom in)
     *
     * <Navegacao->aproxima>
     */
    case "APROXIMA":
        include_once ("classe_navegacao.php");
        copiaSeguranca($map_file);
        $m = new Navegacao($map_file);
        $m->aproxima($_pg["nivel"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: AFASTA
     *
     * Afasta a visualiza&ccedil;&atilde;o de um mapa (zoom out)
     *
     * <Navegacao->afasta>
     */
    case "AFASTA":
        include_once ("classe_navegacao.php");
        copiaSeguranca($map_file);
        $m = new Navegacao($map_file);
        $m->afasta($_pg["nivel"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Valor: CRIALENTE
     *
     * Aplica uma resolu&ccedil;&atilde;o nova ao mapa atual e gera uma imagem para a lente.
     *
     * <Navegacao->aplicaResolucao>
     */
    case "CRIALENTE":
        include_once ("classe_navegacao.php");
        $m = new Navegacao($map_file);
        if (! isset($_pg["ext"])) {
            $_pg["ext"] = "";
        }
        // $ext = projetaExt($map_file,$ext);
        $m->aplicaResolucao($_pg["resolucao"], $ext);
        $retorno = ($m->mapa->width) . "," . ($m->mapa->height) . "," . $m->gravaImagemCorpo();
        break;
    /*
     * Valor: LOCALIZAIP
     *
     * Localiza as coordenadas geogr&aacute;ficas do usu&aacute;rio atual.
     *
     * Baseia-se na identifica&ccedil;&atilde;o do IP e no pacote geoip
     */
    case "LOCALIZAIP":
        copiaSeguranca($map_file);
        $ip = pegaIPcliente();
        $r = ip2geo($ip);
        if ($r["latitude"] == null) {
            $ip = pegaIPcliente2();
            $r = ip2geo($ip);
        }
        $retorno = $r;
        break;
    /*
     * Valor: ZOOMPONTO
     *
     * Desloca o centro do mapa para um ponto espec&iacute;fico.
     *
     * <Navegacao->zoomPonto>
     */
    case "ZOOMPONTO":
        include_once ("classe_navegacao.php");
        include_once ("classe_temas.php");
        copiaSeguranca($map_file);
        $m = new Navegacao($map_file);
        $m->zoomPonto($_pg["xy"]);
        $m->salva();
        $m = new Temas($map_file, "");
        if (! isset($_pg["marca"])) {
            $_pg["marca"] = "ponto";
        }
        $m->insereFeature($marca, "POINT", $_pg["xy"], $_pg["texto"], $_pg["position"], $_pg["partials"], $_pg["offsetx"], $_pg["offsety"], $_pg["minfeaturesize"], $_pg["mindistance"], $_pg["force"], $_pg["shadowcolor"], $_pg["shadowsizex"], $_pg["shadowsizey"], $_pg["outlinecolor"], $_pg["cor"], $_pg["sombray"], $_pg["sombrax"], $_pg["sombra"], $_pg["fundo"], $_pg["angulo"], $_pg["tamanho"], $_pg["fonte"]);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Section: Legenda
     *
     * Processa a legenda do mapa e de temas espec&iacute;ficos.
     *
     * <classe_legenda.php>
     */
    /*
     * Valor: GERACORESCOLOURRAMP
     *
     * Retorna uma lista de valores RGB de cores geradas com base nsa grades de cores existentes (ver i3geo/symbols/colourramps)
     */
    case "GERACORESCOLOURRAMP":
        include_once ("class.palette.php");
        $m = new palette();
        $retorno = $m->geraCoresColourRamp("..", $_pg["codigo"], $_pg["inicio"], $_pg["fim"], $_pg["ncores"]);
        break;
    /*
     * Valor: EDITASIMBOLO
     *
     * Define as caracter&iacute;sticas de simbologia de uma classe, cria, adiciona e exclui estilos.
     */
    case "EDITASIMBOLO":
        include_once ("classe_legenda.php");
        copiaSeguranca($map_file);
        if (! isset($_pg["tema"])) {
            $_pg["tema"] = "";
        }
        $classe = $_pg["classe"];
        $estilo = $_pg["estilo"];
        $opcao = $_pg["opcao"];
        $m = new Legenda($map_file, $locaplic, $_pg["tema"]);
        if ($opcao == "excluiestilo") {
            $retorno = $m->excluiEstilo($classe, $estilo);
            $m->salva();
        }
        if ($opcao == "adicionaestilo") {
            $retorno = $m->adicionaEstilo($classe, $estilo);
            $m->salva();
        }
        if ($opcao == "sobeestilo") {
            $retorno = $m->sobeEstilo($classe, $estilo);
            $m->salva();
        }
        if ($opcao == "desceestilo") {
            $retorno = $m->desceEstilo($classe, $estilo);
            $m->salva();
        }
        if ($opcao == "aplica") {
            $retorno = $m->aplicaParametro($classe, $estilo, $_pg["outlinecolor"], $_pg["backgroundcolor"], $_pg["color"], $_pg["symbolname"], $_pg["size"], $_pg["opacidade"], $_pg["width"], $_pg["pattern"], $_pg["angle"], $_pg["minsize"], $_pg["maxsize"], $_pg["offsetx"], $_pg["offsety"]);
            if (! empty($_pg["symbolscale"])) {
                $m->layer->set("symbolscaledenom", $_pg["symbolscale"]);
            }
            $m->salva();
        }
        if ($opcao == "listaSimbolos") {
            $retorno = $m->listaSimbolos($_pg["tipo"], $dir_tmp, $imgdir, $_pg["onclick"]);
            if ($retorno == "") {
                $retorno = $m->listaSimbolos($_pg["tipo"], $dir_tmp, $imgdir, $_pg["onclick"], 8, 1, true);
            }
        }
        if ($opcao == "pegaparametros") {
            $retorno = $m->pegaParametros($classe);
        }
        $_SESSION["contadorsalva"] ++;
        break;
    /*
     * Valor: CRIALEGENDAHTML
     *
     * Gera a legenda processando o template HTML.
     *
     * <Legenda->criaLegenda>
     */
    case "CRIALEGENDAHTML":
        include_once ("classe_legenda.php");
        // para efeitos de compatibilidade com vers&otilde;es anteriores
        if (isset($_pg["template"])) {
            $_pg["templateLegenda"] = $_pg["template"];
        }
        $m = new Legenda($map_file, $locaplic, $_pg["tema"], $_pg["templateLegenda"]);
        $r = $m->criaLegenda();
        if (! $r) {
            $r = "erro. Legenda nao disponivel";
        }
        $retorno = $r;
        break;
    case "CRIALEGENDAJSON":
        include_once ("classe_legenda.php");
        // para efeitos de compatibilidade com vers&otilde;es anteriores
        $m = new Legenda($map_file, $locaplic, $_pg["tema"]);
        $r = $m->criaLegendaJson($_pg["w"], $_pg["h"]);
        if (! $r) {
            $r = "erro. Legenda nao disponivel";
        }
        $retorno = $r;
        break;
    /*
     * Valor: CRIALEGENDAIMAGEM
     *
     * Desenha a imagem da legenda.
     *
     * <Legenda->legendaGrafica>
     */
    case "CRIALEGENDAIMAGEM":
        include_once ("classe_legenda.php");
        $m = new Legenda($map_file);
        $retorno = $m->legendaGrafica();
        break;
    /*
     * Section: Escala gr&aacute;fica
     *
     * Processa a escala gr&aacute;fica do mapa.
     *
     * <classe_escala.php>
     */
    /*
     * Valor: ESCALAGRAFICA
     *
     * Gera a imagem da barra de escala.
     *
     * <Escala->retornaBarraEscala>
     */
    case "ESCALAGRAFICA":
        include_once ("classe_escala.php");
        $m = new Escala($map_file);
        $retorno = $m->retornaBarraEscala();
        break;
    /*
     * Section: Sele&ccedil;&atilde;o
     *
     * Seleciona elementos do mapa ou processa a sele&ccedil;&atilde;o existente.
     *
     * <classe_selecao.php>
     */
    /*
     * Valor: SELECAOATRIB
     *
     * Seleciona elementos com base nos atributos.
     *
     * <Selecao->selecaoAtributos>
     */
    case "LIMPASEL":
        include_once ("classe_selecao.php");
        $m = new Selecao($map_file, $_pg["tema"]);
        $retorno = $m->selecaoLimpa();
        redesenhaMapa();
        break;
    case "SELECAOATRIB":
        include_once ("classe_selecao.php");
        copiaSeguranca($map_file);
        $m = new Selecao($map_file, $_pg["tema"], $_pg["ext"]);
        $retorno = $m->selecaoAtributos($_pg["tipo"], $_pg["item"], $_pg["operador"], $_pg["valor"]);
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        break;
    /*
     * Section: Outros
     *
     * Op&ccedil;&otilde;es de uso geral.
     */
    /*
     * Valor: LISTATRUETYPE
     *
     * Lista as fontes truetype dispon&iacute;veis.
     */
    case "LISTATRUETYPE":
        $retorno = listaTrueType();
        restauraCon($map_file, $postgis_mapa);
        break;
    /*
     * Valor: AREAPIXEL
     *
     * Calcula a &aacute;rea de um pixel da imagem.
     */
    case "AREAPIXEL":
        $retorno = calculaAreaPixel($map_file, $_pg["celsize"]);
        break;
    /*
     * Valor: LISTAEPSG
     *
     * Pega os codigos de proje&ccedil;&atilde;o EPSG.
     *
     */
    case "LISTAEPSG":
        $retorno = listaEpsg();
        break;
    /*
     * Valor: LISTADIRETORIOS
     *
     * Depreciado na V 5.0, use ferramentas/navegarquivos/exec.php
     *
     * Lista os diret&oacute;rios de um diret&oacute;rio.
     *
     */
    case "LISTADIRETORIOS":
        $retorno = listaDiretorios($_pg["diretorio"]);
        break;
    /*
     * Valor: LISTAARQUIVOS
     *
     * Depreciado na V 5.0, use ferramentas/navegarquivos/exec.php
     *
     * Lista os arquivos de um diret&oacute;rio.
     */
    case "LISTAARQUIVOS":
        $retorno = listaArquivos($_pg["diretorio"]);
        break;
    /*
     * Depreciado
     *
     * Retorna o valor da chave registrada para a API do Google maps
     *
     * Essa chave deve ser registrada em i3geo/ms_configura.php
     */
    case "CHAVEGOOGLE":
        $retorno = $googleApiKey;
        break;
    /*
     * Valor: LISTAINTERFACES
     *
     * Lista as interfaces de abertura de mapas
     *
     * Pesquisa na pasta interfaces e na pasta definida em $customDir
     */
    case "LISTAINTERFACES":
        include (dirname(__FILE__) . "/../ms_configura.php");
        $pesquisarEm = array(
            $locaplic . "/interface"
        );
        if (isset($customDir) && $customDir != "" && $customDir != "interface") {
            $pesquisarEm[] = $locaplic . "/" . $customDir;
        }
        $retorno = array();
        foreach ($pesquisarEm as $p) {
            $r = listaArquivos($p);
            // var_dump($r);exit;
            $arqs = $r["arquivos"];
            $ext = $r["extensoes"];
            $nomes = $r["nomes"];
            $n = count($arqs);
            for ($i = 0; $i < $n; $i ++) {
                if (in_array($ext[$i], array(
                    "php",
                    "phtml",
                    "htm",
                    "html"
                ))) {
                    // verifica se tem a carga do js i3geo.js
                    $a = $p . "/" . $nomes[$i];
                    if(file_exists($a)){
                        $handle = fopen($a, "r");
                        $conteudo = fread($handle, filesize($a));
                        fclose($handle);
                        if (strstr($conteudo, "i3geo.js")) {
                            $retorno[] = "../" . basename($p) . "/" . $nomes[$i];
                        }
                    }
                }
            }
        }
        break;
}
if (isset($map_file) && isset($postgis_mapa) && $map_file != "")
    restauraCon($map_file, $postgis_mapa);
cpjson($retorno);

/*
 * Function: projetaExt
 *
 * Projeta uma string com coordenadas geogr&aacute;ficas para coordenadas m&eacute;tricas
 *
 * Parametros:
 *
 * $map_file {string}
 *
 * $ext {string} - extens&atilde;o geogr&aacute;fica com valores separados por espa&ccedil;o ou um par de coordenadas x y
 *
 * Return:
 *
 * {string}
 */
function projetaExt($map_file, $ext, $separador = " ")
{
    $ext = str_replace($separador, " ", $ext);
    $extA = explode(" ", $ext);
    $mapa = ms_newMapObj($map_file);
    $ponto = false;
    if ($extA[0] < 180 && $extA[0] > - 180) {
        if (count($extA) == 2) {
            $ponto = true;
            $extA[] = $extA[0] + 1;
            $extA[] = $extA[1] + 1;
        }
        $rect = ms_newRectObj();
        $rect->setextent($extA[0], $extA[1], $extA[2], $extA[3]);
        $prjMapa = $mapa->getProjection();
        $projInObj = ms_newprojectionobj("proj=longlat,ellps=WGS84,datum=WGS84,no_defs");
        $projOutObj = ms_newprojectionobj($prjMapa);
        $rect->project($projInObj, $projOutObj);
        if ($ponto == false) {
            $ext = $rect->minx . " " . $rect->miny . " " . $rect->maxx . " " . $rect->maxy;
        } else {
            $ext = $rect->minx . " " . $rect->miny;
        }
    }
    $ext = str_replace(" ", $separador, $ext);
    return $ext;
}

/*
 * Function: alteraclassesPost
 *
 * Altera as classes de um tema aplicando novos par&acirc;metros como nome e express&atilde;o.
 *
 * Include:
 * <classe_alteraclasse.php>
 */
function alteraclassesPost($ids, $nomes, $exps, $base64 = "nao", $minScales = "", $maxScales = "")
{
    global $map_file, $_pg;
    $m = new Alteraclasse($map_file, $_pg["tema"]);
    $m->alteraclasses($ids, $nomes, $exps, $base64, $minScales, $maxScales);
    $m->salva();
    $_SESSION["contadorsalva"] ++;
}

/*
 * Function: redesenhaMapa
 *
 * Redesenha o mapa e retorna os par&acirc;metros do novo mapa.
 *
 * Include:
 * <classe_mapa.php>
 *
 * Parametros:
 *
 * tipoimagem {String} - tipo de imagem que ser&aacute; gerada nenhum|cinza|sepianormal|sepiaclara
 */
function redesenhaMapa()
{
    global $map_file, $postgis_mapa;
    if (connection_aborted()) {
        exit();
    }
    include_once ("classe_mapa.php");
    $m = new Mapa($map_file);
    $par = $m->parametrosTemas();
    //
    // na interface googlemaps n&atilde;o &eacute; necess&aacute;rio gerar a imagem
    //
    $e = $m->mapa->extent;
    $ext = $e->minx . " " . $e->miny . " " . $e->maxx . " " . $e->maxy;
    $res = array();
    $res["mapimagem"] = "";
    $res["mapexten"] = $ext;
    $res["mapres"] = "";
    $res["erro"] = "";
    $res["mapscale"] = "";
    $res["pixelsize"] = "";
    $res["mapimagem"] = "";
    $res["w"] = $m->mapa->width;
    $res["h"] = $m->mapa->height;
    $res["mappath"] = "";
    $res["mapurl"] = "";
    $res["mensagens"] = $m->pegaMensagens();
    $res["tempo"] = "";
    restauraCon($map_file, $postgis_mapa);
    ob_clean();
    if ($par == "") {
        $retorno = "erro";
    } else {
        $retorno = array(
            "variaveis" => $res,
            "temas" => $par
        );
    }
    cpjson($retorno);
}
?>
